// =========================================================================
// HANZIGO CURRICULUM COMPLETENESS & CTI COVERAGE AUDITOR
// Scans 120 HSK 1-6 lessons + 60 HSK 7-9 lessons + Dictionary + HSK Exam Bank
// Outputs a deterministic Curriculum Coverage Scorecard / 100
// =========================================================================

import {
  HSK_120_LESSONS,
  FUNCTION_WORDS_SYSTEM,
  GRAMMAR_MATRIX_HSK1_6,
  HSK6_FAULTY_SENTENCE_8_TYPES,
  HSK6_SUMMARY_1000_TO_400_RULES,
  HSK_EXAM_22_QUESTION_TYPES,
} from '../src/features/curriculum/hsk120CurriculumData.js';
import {
  CURRICULUM_ALL_LESSONS,
} from '../src/data/curriculumLessons.js';
import {
  HSK_79_60_LESSONS,
} from '../src/features/curriculum/hsk7to9CurriculumData.js';
import {
  synthesizeHsk79Lesson,
} from '../src/features/curriculum/lessonContentSynthesizer.js';
import { MODULE_PASSAGE_TEMPLATES } from '../src/features/curriculum/hsk79PassagesAndGrammar.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';
import { GRAMMAR_LESSONS } from '../src/services/grammarEngineService.js';
import { HSK_EXAMS, HSK_QUESTIONS } from '../src/data/hskExamsData.js';

const FORBIDDEN_FALLBACK_PATTERNS = [
  'Từ khóa trọng tâm thuộc chủ đề',
  'Thuật ngữ trọng tâm cấp HSK',
  'HÁN VIỆT CHUẨN',
  'đang cập nhật',
  'Lorem ipsum',
  'TODO:',
];

export function runCurriculumAudit() {
  const dictSet = new Set(VOCABULARY_LIST.map((v) => v.hanzi));
  const lessonMap = new Map(HSK_120_LESSONS.map((l) => [l.id, l]));
  const examMap = new Map(HSK_EXAMS.map((e) => [e.id, e]));

  // Aggregate searchable lesson corpus text per HSK 1-6 lesson
  const hsk120VocabSet = new Set();
  const hsk120TextPool = HSK_120_LESSONS.map((l) => {
    for (const kw of l.keyVocab || []) hsk120VocabSet.add(kw);
    for (const v of l.step2_vocabulary || []) hsk120VocabSet.add(v.hanzi);
    for (const ev of l.extendedVocabulary || []) hsk120VocabSet.add(ev.hanzi);
    return JSON.stringify(l);
  }).join('\n');

  // -----------------------------------------------------------------------
  // PILLAR 1: Lexical & Function Words Coverage (25 points)
  // -----------------------------------------------------------------------
  const requiredPronouns = ['二', '两', '几', '多少', '谁', '哪儿'];
  const requiredMeasureWords = ['个', '口', '本', '件', '张', '把', '条', '双', '套', '辆', '趟', '顿', '遍', '次', '场', '番', '门', '项'];
  const requiredAdverbs = ['不', '没', '又', '再', '就', '才', '刚', '刚才', '往往', '经常', '忽然', '突然', '果然', '居然', '竟然', '难免', '未免', '幸亏', '多亏'];
  const requiredPrepositions = ['在', '从', '离', '往', '向', '对', '对于', '关于', '把', '被', '由', '随着', '趁', '凭', '围绕', '鉴于', '本着'];

  const allFnWords = [...new Set([...requiredPronouns, ...requiredMeasureWords, ...requiredAdverbs, ...requiredPrepositions])];
  const missingInDict = allFnWords.filter((w) => !dictSet.has(w));
  const missingInLessons = allFnWords.filter((w) => !hsk120VocabSet.has(w) && !hsk120TextPool.includes(w));

  const under5VocabLessons = HSK_120_LESSONS.filter((l) => (l.keyVocab || []).length < 5).map((l) => l.id);
  const syncCheck = CURRICULUM_ALL_LESSONS.length === 120 && HSK_120_LESSONS.length === 120;

  let p1Score = 25;
  if (missingInDict.length > 0) p1Score -= Math.min(8, missingInDict.length);
  if (missingInLessons.length > 0) p1Score -= Math.min(8, missingInLessons.length);
  if (under5VocabLessons.length > 0) p1Score -= Math.min(5, under5VocabLessons.length);
  if (FUNCTION_WORDS_SYSTEM.measureWords18.length < 18) p1Score -= 2;
  if (FUNCTION_WORDS_SYSTEM.confusableAdverbs9Pairs.length < 9) p1Score -= 2;
  if (FUNCTION_WORDS_SYSTEM.corePrepositions17.length < 17) p1Score -= 2;
  if (!syncCheck) p1Score -= 3;
  p1Score = Math.max(0, p1Score);

  // -----------------------------------------------------------------------
  // PILLAR 2: Grammar Matrix Completeness HSK 1-6 (25 points)
  // -----------------------------------------------------------------------
  const requiredGrammarTokens = [
    // HSK 1
    'S + Thời gian', '是', '有', '太', '是……的', 'Thanh 3', '不', '一',
    // HSK 2
    'V 不 V', '着', '过', 'VV', '请', '让', '叫', '比', '没有', '完', '好', '懂', '快要',
    // HSK 3
    '起来', '出来', '下去', '看得懂', '来不及', '把', '被', '跟……一样', '还是', '或者', '一边', '越来越', '越A越B', '除了', '只有', '只要',
    // HSK 4
    '不仅……而且……', '尽管……但是……', '无论……都……', '既然……就……', '哪怕……也……', '与其……不如……', '之所以……是因为……', '连……也/都……', '以', '对',
    // HSK 5
    '何必', '何况', '况且', '幸亏', '索性', '偏偏', '简直', '依然', '可见', '总之', '一旦', '词语搭配', '褒义', '贬义',
    // HSK 6
    '成分残缺', '成分赘余', '搭配不当', '语序不当', '句式杂糅', '两面对一面', '否定失当', '表意不明', '缩写',
  ];

  const missingGrammarTokens = requiredGrammarTokens.filter((tok) => !hsk120TextPool.includes(tok));
  const yubingCount = HSK6_FAULTY_SENTENCE_8_TYPES.length;
  const summaryRulesCount = HSK6_SUMMARY_1000_TO_400_RULES.length;
  const lessonsWithoutAst = HSK_120_LESSONS.filter((l) => !Array.isArray(l.grammarAst) || l.grammarAst.length === 0).map((l) => l.id);

  let p2Score = 25;
  if (missingGrammarTokens.length > 0) p2Score -= Math.min(10, missingGrammarTokens.length);
  if (yubingCount < 8) p2Score -= 5;
  if (summaryRulesCount < 6) p2Score -= 4;
  if (lessonsWithoutAst.length > 0) p2Score -= 4;
  if (Object.keys(GRAMMAR_MATRIX_HSK1_6).length < 6) p2Score -= 2;
  if (GRAMMAR_LESSONS.length === 0) p2Score -= 2;
  p2Score = Math.max(0, p2Score);

  // -----------------------------------------------------------------------
  // PILLAR 3: Content Depth & Zero-Fallback Synthesis (25 points)
  // -----------------------------------------------------------------------
  const synthesized79 = HSK_79_60_LESSONS.map((m) => synthesizeHsk79Lesson(m));
  const fallbackHits = [];

  for (const l of [...HSK_120_LESSONS, ...synthesized79]) {
    const blob = JSON.stringify(l);
    for (const pat of FORBIDDEN_FALLBACK_PATTERNS) {
      if (blob.includes(pat)) {
        fallbackHits.push({ lessonId: l.id, pattern: pat });
      }
    }
  }

  const expectedModules79 = ['7.1', '7.2', '7.3', '7.4', '8.1', '8.2', '8.3', '8.4', '9.1', '9.2', '9.3', '9.4'];
  const missingModulePassages = expectedModules79.filter((code) => !MODULE_PASSAGE_TEMPLATES[code]);

  const invalidQuizLessons = [...HSK_120_LESSONS, ...synthesized79].filter((l) => {
    const qs = Array.isArray(l.step8_quiz) ? l.step8_quiz : [];
    if (qs.length === 0) return true;
    return qs.some((q) => !Array.isArray(q.options) || q.options.length < 3 || typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length);
  }).map((l) => l.id);

  const unique79Mistakes = new Set(synthesized79.map((l) => l.grammarDetail?.commonMistakes?.[0]?.wrong).filter(Boolean));

  let p3Score = 25;
  if (fallbackHits.length > 0) p3Score -= Math.min(12, fallbackHits.length);
  if (missingModulePassages.length > 0) p3Score -= missingModulePassages.length * 2;
  if (invalidQuizLessons.length > 0) p3Score -= Math.min(5, invalidQuizLessons.length);
  if (unique79Mistakes.size < 60) p3Score -= 4;
  p3Score = Math.max(0, p3Score);

  // -----------------------------------------------------------------------
  // PILLAR 4: Exam Alignment (22 Archetypes <-> Lessons <-> Exam Bank) (25 pts)
  // -----------------------------------------------------------------------
  const unmappedExamTypes = HSK_EXAM_22_QUESTION_TYPES.filter((qt) => {
    const validLessons = Array.isArray(qt.targetLessons) && qt.targetLessons.every((lid) => lessonMap.has(lid));
    const validExams = Array.isArray(qt.examIds) && qt.examIds.every((eid) => examMap.has(eid));
    return !validLessons || !validExams;
  });
  const unmappedLessons = HSK_120_LESSONS.filter((l) => !Array.isArray(l.examQuestionTypesMapped) || l.examQuestionTypesMapped.length === 0).map((l) => l.id);

  const hsk6FullQs = HSK_QUESTIONS.filter((q) => q.exam_id === 'hsk6-full-101-01');
  const hasHsk6Full101 = hsk6FullQs.length === 101 && hsk6FullQs.some((q) => q.question_type === 'essay_summary');

  let p4Score = 25;
  if (HSK_EXAM_22_QUESTION_TYPES.length < 22) p4Score -= 6;
  if (unmappedExamTypes.length > 0) p4Score -= Math.min(10, unmappedExamTypes.length * 2);
  if (unmappedLessons.length > 0) p4Score -= Math.min(5, unmappedLessons.length);
  if (!hasHsk6Full101) p4Score -= 4;
  p4Score = Math.max(0, p4Score);

  const totalScore = p1Score + p2Score + p3Score + p4Score;

  return {
    totalScore,
    pillars: {
      pillar1_lexicalAndFunctionWords: {
        score: p1Score,
        maxScore: 25,
        dictionarySize: VOCABULARY_LIST.length,
        functionWordsChecked: allFnWords.length,
        missingInDict,
        missingInLessons,
        under5VocabLessons,
        measureWordsMapped: FUNCTION_WORDS_SYSTEM.measureWords18.length,
        confusableAdverbPairsMapped: FUNCTION_WORDS_SYSTEM.confusableAdverbs9Pairs.length,
        prepositionsMapped: FUNCTION_WORDS_SYSTEM.corePrepositions17.length,
      },
      pillar2_grammarMatrix: {
        score: p2Score,
        maxScore: 25,
        missingGrammarTokens,
        yubingTypesCount: yubingCount,
        summaryRulesCount,
        lessonsWithoutAst,
      },
      pillar3_contentDepthZeroFallback: {
        score: p3Score,
        maxScore: 25,
        totalLessonsAudited: HSK_120_LESSONS.length + synthesized79.length,
        fallbackHits,
        missingModulePassages,
        unique79GrammarMistakes: unique79Mistakes.size,
        invalidQuizLessons,
      },
      pillar4_examAlignment: {
        score: p4Score,
        maxScore: 25,
        archetypesCount: HSK_EXAM_22_QUESTION_TYPES.length,
        totalExamsInBank: HSK_EXAMS.length,
        totalQuestionsInBank: HSK_QUESTIONS.length,
        unmappedExamTypes: unmappedExamTypes.map((e) => e.code),
        unmappedLessons,
        hasHsk6Full101,
      },
    },
  };
}

const isCli = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isCli) {
  const report = runCurriculumAudit();
  console.log('\n=========================================================================');
  console.log(' HANZIGO CURRICULUM COMPLETENESS & CTI COVERAGE SCORECARD');
  console.log('=========================================================================');
  console.log(` TỔNG ĐIỂM KIỂM TOÁN (TOTAL SCORE): ${report.totalScore} / 100`);
  console.log('-------------------------------------------------------------------------');
  console.log(` 1. Từ vựng & Từ chức năng (Pillar 1):   ${report.pillars.pillar1_lexicalAndFunctionWords.score} / 25`);
  console.log(`    - Từ điển VOCABULARY_LIST:            ${report.pillars.pillar1_lexicalAndFunctionWords.dictionarySize} mục`);
  console.log(`    - Đại từ/Số từ, ${report.pillars.pillar1_lexicalAndFunctionWords.measureWordsMapped} Lượng từ, ${report.pillars.pillar1_lexicalAndFunctionWords.confusableAdverbPairsMapped} cặp Phó từ, ${report.pillars.pillar1_lexicalAndFunctionWords.prepositionsMapped} Giới từ -> Thiếu: ${report.pillars.pillar1_lexicalAndFunctionWords.missingInDict.length} (dict), ${report.pillars.pillar1_lexicalAndFunctionWords.missingInLessons.length} (bài học)`);
  console.log(`    - Bài < 5 từ khóa (HSK 1-6):          ${report.pillars.pillar1_lexicalAndFunctionWords.under5VocabLessons.length} / 120`);
  console.log(` 2. Ma trận Ngữ pháp HSK 1-6 (Pillar 2): ${report.pillars.pillar2_grammarMatrix.score} / 25`);
  console.log(`    - Mục ngữ pháp thiếu:                 ${report.pillars.pillar2_grammarMatrix.missingGrammarTokens.length}`);
  console.log(`    - 8 dạng 语病 (Q51-60) & Quy tắc 缩写: ${report.pillars.pillar2_grammarMatrix.yubingTypesCount}/8 & ${report.pillars.pillar2_grammarMatrix.summaryRulesCount}/6`);
  console.log(`    - Bài thiếu AST formula_tokens:       ${report.pillars.pillar2_grammarMatrix.lessonsWithoutAst.length} / 120`);
  console.log(` 3. Chiều sâu Nội dung & 0% Fallback:     ${report.pillars.pillar3_contentDepthZeroFallback.score} / 25`);
  console.log(`    - Tổng bài học rà soát (1-180):       ${report.pillars.pillar3_contentDepthZeroFallback.totalLessonsAudited}`);
  console.log(`    - Chuỗi Fallback bị phát hiện:        ${report.pillars.pillar3_contentDepthZeroFallback.fallbackHits.length}`);
  console.log(`    - Bài đọc chuyên đề HSK 7-9 (12 chặng): ${12 - report.pillars.pillar3_contentDepthZeroFallback.missingModulePassages.length}/12`);
  console.log(`    - Lỗi AST đặc thù HSK 7-9:            ${report.pillars.pillar3_contentDepthZeroFallback.unique79GrammarMistakes}/60`);
  console.log(` 4. Liên thông Ngân hàng Đề HSK (Pillar 4): ${report.pillars.pillar4_examAlignment.score} / 25`);
  console.log(`    - 22 dạng câu hỏi chuẩn CTI ánh xạ:   ${report.pillars.pillar4_examAlignment.archetypesCount}/22 (Unmapped: ${report.pillars.pillar4_examAlignment.unmappedExamTypes.length})`);
  console.log(`    - Ngân hàng đề thi thử & chuẩn mẫu:   ${report.pillars.pillar4_examAlignment.totalExamsInBank} đề · ${report.pillars.pillar4_examAlignment.totalQuestionsInBank} câu`);
  console.log('=========================================================================\n');

  if (report.totalScore < 100 || report.pillars.pillar3_contentDepthZeroFallback.fallbackHits.length > 0) {
    console.error('AUDIT FAILED:', JSON.stringify(report, null, 2));
    process.exit(1);
  }
}
