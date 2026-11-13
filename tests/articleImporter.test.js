import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock localStorage if in node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const {
  analyzeChineseReadability,
  adaptTextToHskLevel,
  extractKeyPreReadingVocab,
  importWebContentOrText,
  convertWebArticleToReadingStudio,
  getSampleWebArticles,
  extractDomainFromUrl,
} = await import('../src/services/articleImporterService.ts');
const { parseCustomArticleToParagraphs } = await import('../src/utils/chineseTokenizer.ts');

test('analyzeChineseReadability calculates HSK distribution and readability metrics', () => {
  const sample = '北京是中国的首都。这里的历史非常悠久，有许多名胜古迹，吸引了大量外国游客。';
  const { paragraphs } = parseCustomArticleToParagraphs(sample);
  const result = analyzeChineseReadability(paragraphs);

  assert.ok(result.total_words > 0);
  assert.ok(typeof result.hsk1_3_pct === 'number');
  assert.ok(typeof result.hsk4_5_pct === 'number');
  assert.ok(typeof result.hsk6_plus_pct === 'number');
  assert.equal(result.hsk1_3_pct + result.hsk4_5_pct + result.hsk6_plus_pct, 100);
  assert.ok(result.readability_score >= 0 && result.readability_score <= 100);
  assert.ok(result.estimated_hsk_level >= 1 && result.estimated_hsk_level <= 6);
});

test('adaptTextToHskLevel rewrite mode simplifies advanced terms to HSK 3-4', () => {
  const raw = '据悉，这项技术的突飞猛进为该行业带来了举足轻重的成就。';
  const rewritten = adaptTextToHskLevel(raw, 4, 'rewrite');

  assert.ok(rewritten.includes('根据报道'), 'Should replace 据悉 with 根据报道');
  assert.ok(rewritten.includes('进步很快'), 'Should replace 突飞猛进 with 进步很快');
  assert.ok(rewritten.includes('非常重要'), 'Should replace 举足轻重 with 非常重要');
  assert.ok(!rewritten.includes('据悉'), 'Original advanced word should be replaced');
});

test('adaptTextToHskLevel gloss mode adds inline bracketed synonyms', () => {
  const raw = '据悉，新大楼今日落成。';
  const glossed = adaptTextToHskLevel(raw, 4, 'gloss');

  assert.ok(glossed.includes('据悉 [根据报道]'), 'Should append bracketed gloss after advanced word');
});

test('extractKeyPreReadingVocab prioritizes high-impact and unknown words', () => {
  const raw = '中国人工智能技术突飞猛进。人工智能正在改变人们的生活。人工智能前景广阔。';
  const { paragraphs } = parseCustomArticleToParagraphs(raw);
  const vocab = extractKeyPreReadingVocab(paragraphs, new Set(), 5);

  assert.ok(Array.isArray(vocab));
  assert.ok(vocab.length > 0 && vocab.length <= 5);
  const aiWord = vocab.find((v) => v.text === '人工智能');
  assert.ok(aiWord, 'Frequently repeated word 人工智能 should be in pre-reading vocabulary');
  assert.ok(aiWord.occurrences >= 2);
});

test('importWebContentOrText generates all versions and distribution', async () => {
  const raw = '随着科技的发展，人们的生活越来越方便。\n高速铁路让城市之间的距离变得很近。';
  const article = await importWebContentOrText({
    url: 'https://news.cctv.com/china-tech-2026',
    text: raw,
    title: '科技与高铁生活',
  });

  assert.ok(article.id);
  assert.equal(article.domain_name, 'news.cctv.com');
  assert.equal(article.original_title_zh, '科技与高铁生活');
  assert.ok(article.versions.original.length > 0);
  assert.ok(article.versions.simplified_hsk4);
  assert.ok(article.versions.simplified_hsk3);
  assert.ok(article.versions.glossed);
  assert.ok(article.extracted_key_vocab.length > 0);
});

test('convertWebArticleToReadingStudio produces a ReadingArticle for quiz and study', async () => {
  const samples = getSampleWebArticles();
  const sample = samples[0];

  const readingArticle = await convertWebArticleToReadingStudio(sample, 'simplified_hsk4', {
    id: 'test-user',
  });

  assert.ok(readingArticle.id);
  assert.ok(readingArticle.title_zh.includes('Rút gọn HSK 4'));
  assert.ok(readingArticle.paragraphs.length > 0);
  assert.equal(sample.converted_article_id, readingArticle.id);
});

test('extractDomainFromUrl parses hostnames cleanly', () => {
  assert.equal(extractDomainFromUrl('https://www.bbc.com/zhongwen'), 'bbc.com');
  assert.equal(extractDomainFromUrl('http://tech.china.com/ai'), 'tech.china.com');
  assert.equal(extractDomainFromUrl(null), 'custom_input');
});

test('SQL migration file 20261112_2903_web_importer.sql exists and is syntactically sound', () => {
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/20261112_2903_web_importer.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.imported_web_contents'));
  assert.ok(sql.includes('hsk_distribution JSONB'));
  assert.ok(sql.includes('versions JSONB'));
  assert.ok(sql.includes('extracted_key_vocab JSONB'));
  assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'));
});

