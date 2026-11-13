import test from 'node:test';
import assert from 'node:assert/strict';

import {
  gradeHsk4SentenceWriting,
  gradeHsk5KeywordEssay,
  gradeHsk5PictureEssay,
  gradeHsk6SummaryEssay,
} from '../src/services/hskWritingGraderService.ts';
import {
  gradeHskkSpeakingResponse,
  HSKK_SAMPLE_QUESTIONS,
} from '../src/features/hskk-exam/hskkEngine.ts';
import {
  extractRemediationFromMistakes,
  pushMistakeVocabToWorkspaceDeck,
} from '../src/features/hsk-exam/analytics/hskMistakeRemediationService.ts';
import {
  bulkImportHskPapers,
  enrichListeningTtsMetadata,
  generateBulkSampleHsk1To6Papers,
} from '../src/features/hsk-exam/admin-importer/hskBulkImporterService.ts';

test('30.05: gradeHsk4SentenceWriting scores keyword, picture context, and grammar out of 8', () => {
  const good = gradeHsk4SentenceWriting({
    targetKeyword: '认真',
    pictureKeywords: ['学生', '图书馆', '看书'],
    userSentence: '两个学生在图书馆里认真地看书。',
  });
  assert.equal(good.maxScore, 8);
  assert.equal(good.score, 8);

  const missingKw = gradeHsk4SentenceWriting({
    targetKeyword: '认真',
    pictureKeywords: ['学生'],
    userSentence: '学生在看书。',
  });
  assert.equal(missingKw.breakdown.keywordUsed, false);
  assert.ok(missingKw.score < 8);
});

test('30.05: gradeHsk5KeywordEssay & gradeHsk5PictureEssay evaluate coherence and 75-90 char length', () => {
  const essay =
    '周末我决定去公园散步，因为最近工作压力很大。虽然天气有点儿凉，但是我还是坚持走了一个小时。后来我在路边遇到了一位老朋友，于是我们一起喝茶聊天。这次散步不仅让我放松了心情，而且收获了快乐。';
  const res99 = gradeHsk5KeywordEssay({
    keywords: ['周末', '散步', '坚持', '不仅', '快乐'],
    userEssay: essay,
  });
  assert.equal(res99.maxScore, 30);
  assert.equal(res99.missingKeywords.length, 0);
  assert.ok(res99.score >= 25);

  const res100 = gradeHsk5PictureEssay({
    pictureElements: ['厨房', '做饭', '开心'],
    userEssay: '今天一家人在厨房里一起做饭。因为明天是妈妈的生日，所以大家决定亲手准备一顿丰盛的晚餐，每个人都感到非常开心。',
  });
  assert.equal(res100.maxScore, 30);
  assert.ok(res100.score >= 22);
});

test('30.05: gradeHsk6SummaryEssay enforces 6 plot points and rubric penalties (-5 title, -10 quotes, -10 opinion, length)', () => {
  const plots = [
    { id: '1', labelVi: 'Nhân vật Trần Bá', keywords: ['陈伯', '修表'] },
    { id: '2', labelVi: 'Bối cảnh tiệm vắng', keywords: ['四十年', '冷清'] },
    { id: '3', labelVi: 'Lâm Mẫn mang đồng hồ', keywords: ['林敏', '怀表'] },
    { id: '4', labelVi: 'Mài bánh răng 2 ngày', keywords: ['齿轮', '打磨'] },
    { id: '5', labelVi: 'Từ chối thù lao cao', keywords: ['酬金', '手工费'] },
    { id: '6', labelVi: 'Tiệm đông vui trở lại', keywords: ['文章', '热闹'] },
  ];

  // Build ~380-char compliant summary
  const filler = '这件事让小镇上的居民深受感动，大家纷纷称赞老人精湛的手艺与高尚的品格。'.repeat(7);
  const compliantSummary =
    '江南小镇的修表匠陈伯坚守铺子四十年，生意虽日渐冷清却仍坚持修表。去年秋夜，林敏带着父亲留下的破损怀表求助，希望赶在女儿婚礼前修好。陈伯翻找旧零件并连续两天手工打磨齿轮，终于在深夜修好怀表。婚礼前夕林敏欲重金酬谢，陈伯却只收普通手工费。林敏将经历写成文章发到网上后，许多年轻人慕名而来，小铺子重新热闹起来。' +
    filler;

  const cleanRes = gradeHsk6SummaryEssay({
    title: '时间医生陈伯',
    summary: compliantSummary,
    keyPlotPoints: plots,
  });
  assert.equal(cleanRes.penalties.length, 0);
  assert.equal(cleanRes.score, 100);

  const penalizedRes = gradeHsk6SummaryEssay({
    title: '',
    summary: '我觉得陈伯很善良。“我不修，谁来修呢？”',
    keyPlotPoints: plots,
  });
  const codes = penalizedRes.penalties.map((p) => p.code);
  assert.ok(codes.includes('MISSING_TITLE'));
  assert.ok(codes.includes('DIRECT_QUOTE'));
  assert.ok(codes.includes('PERSONAL_OPINION'));
  assert.ok(codes.includes('LENGTH_OUT_OF_RANGE'));
});

test('30.06: gradeHskkSpeakingResponse scores listen_and_repeat via Pronunciation Lab and argumentative_question', () => {
  const q1 = HSKK_SAMPLE_QUESTIONS.beginner[0];
  const res1 = gradeHskkSpeakingResponse(q1, q1.promptZh);
  assert.ok(res1.score >= 85);
  assert.ok(res1.pronunciationDetail);

  const q2 = HSKK_SAMPLE_QUESTIONS.advanced[1];
  const res2 = gradeHskkSpeakingResponse(
    q2,
    '我认为人工智能虽然能提高工作效率和取代部分重复劳动，但它无法取代人类的创造力和情感交流。'
  );
  assert.ok(res2.score >= 70);
});

test('30.07: extractRemediationFromMistakes and pushMistakeVocabToWorkspaceDeck build HSK mistake deck', async () => {
  const extracted = extractRemediationFromMistakes(
    [
      {
        question_number: 51,
        isCorrect: false,
        target_vocab: ['坚持', '进步'],
        target_grammar_codes: ['HSK4_BUGUAN_ZHIYAO_JIU'],
      },
      {
        question_number: 52,
        isCorrect: true,
        target_vocab: ['应该忽略'],
      },
    ],
    'H41008'
  );
  assert.equal(extracted.totalMistakes, 1);
  assert.deepEqual(extracted.vocabWords, ['坚持', '进步']);
  assert.equal(extracted.grammarSuggestions[0].code, 'HSK4_BUGUAN_ZHIYAO_JIU');

  const pushed = await pushMistakeVocabToWorkspaceDeck({
    paperCode: 'H41008',
    vocabWords: extracted.vocabWords,
  });
  assert.equal(pushed.deck.name, 'Từ sai trong đề HSK H41008');
  assert.equal(pushed.pushedCount, 2);
});

test('30.08: enrichListeningTtsMetadata and bulkImportHskPapers seed HSK 1-6 with Beijing TTS voices', async () => {
  const papers = generateBulkSampleHsk1To6Papers();
  assert.equal(papers.length, 6);

  const enriched = enrichListeningTtsMetadata(papers[0]);
  assert.equal(enriched.ttsEnrichedCount, 1);
  assert.equal(enriched.enrichedPayload.questions.listening[0].stimulus_payload.tts_generated, true);
  assert.equal(
    enriched.enrichedPayload.questions.listening[0].stimulus_payload.tts_voice,
    'zh-CN-XiaoxiaoNeural'
  );

  const summary = await bulkImportHskPapers(papers);
  assert.equal(summary.totalPapers, 6);
  assert.equal(summary.succeeded, 6);
  assert.equal(summary.failed, 0);
});
