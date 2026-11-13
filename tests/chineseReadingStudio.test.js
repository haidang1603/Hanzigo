import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  tokenizeChineseText,
  parseCustomArticleToParagraphs,
} from '../src/utils/chineseTokenizer.ts';
import {
  getBuiltInReadingArticles,
  calculateVocabularyCoverage,
  createCustomReadingArticle,
  analyzeSentenceGrammar,
} from '../src/services/readingStudioService.ts';

test('tokenizeChineseText segments Chinese sentences and marks punctuation', () => {
  const tokens = tokenizeChineseText('今天天气很好，我去图书馆学习。');
  assert.ok(tokens.length >= 5);
  const punctuation = tokens.filter((t) => t.is_punctuation);
  assert.ok(punctuation.length >= 2);
  const words = tokens.filter((t) => !t.is_punctuation);
  assert.ok(words.some((w) => w.text.includes('图书馆') || w.text.includes('学习')));
});

test('parseCustomArticleToParagraphs builds paragraph and sentence structures', () => {
  const raw = '我喜欢学习中文。\n今天我去学校。';
  const { paragraphs, wordCount } = parseCustomArticleToParagraphs(raw);
  assert.equal(paragraphs.length, 2);
  assert.ok(wordCount > 0);
  assert.equal(paragraphs[0].paragraph_index, 0);
  assert.equal(paragraphs[0].sentences[0].zh_raw, '我喜欢学习中文。');
  assert.ok(paragraphs[0].sentences[0].tokens.length > 0);
});

test('calculateVocabularyCoverage computes personalized known percentage', () => {
  const articles = getBuiltInReadingArticles();
  assert.ok(articles.length >= 1);
  const firstArticle = articles[0];

  const emptyReport = calculateVocabularyCoverage(firstArticle, null, []);
  assert.ok(emptyReport.totalUniqueWords > 0);
  assert.equal(emptyReport.knownCount, 0);
  assert.equal(emptyReport.knownPercentage, 0);

  const someWords = emptyReport.unknownWords.slice(0, Math.ceil(emptyReport.totalUniqueWords / 2));
  const halfReport = calculateVocabularyCoverage(firstArticle, null, someWords);
  assert.ok(halfReport.knownPercentage >= 45 && halfReport.knownPercentage <= 55);
  assert.ok(halfReport.recommendationLabel.includes('Bạn đã biết'));
});

test('createCustomReadingArticle creates a custom ReadingArticle with word count', async () => {
  const created = await createCustomReadingArticle({
    titleZh: '我的周末',
    titleVi: 'Cuối tuần của tôi',
    rawText: '周末我常常和朋友一起去咖啡馆看书。',
    hskLevel: 3,
  });

  assert.equal(created.is_user_custom, true);
  assert.equal(created.title_zh, '我的周末');
  assert.equal(created.hsk_level, 3);
  assert.ok(created.word_count > 0);
  assert.ok(created.paragraphs.length === 1);
});

test('analyzeSentenceGrammar returns structured breakdown even offline', async () => {
  const analysis = await analyzeSentenceGrammar('我把作业做完了。', 3);
  assert.equal(analysis.sentence, '我把作业做完了。');
  assert.ok(analysis.pattern.length > 0);
  assert.ok(analysis.explanation_vi.length > 0);
  assert.ok(Array.isArray(analysis.breakdown) && analysis.breakdown.length > 0);
});

test('reading studio SQL migration defines reading_articles and user_reading_sessions', () => {
  const sqlPath = path.resolve('supabase/migrations/20261112_2704_chinese_reading_studio.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.reading_articles/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_reading_sessions/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
});
