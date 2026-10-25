import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  GRADED_READERS_DATA, 
  getGradedReadersByLevel, 
  getGradedReaderById 
} from '../src/data/gradedReadersData.js';
import { analyzeChineseText } from '../src/utils/chineseNlpEngine.js';

test('SMART CHINESE READER — GRADED READERS DATA INTEGRITY', async (t) => {

  await t.test('1. Must contain at least 12 graded readers covering HSK 1 to HSK 6', () => {
    assert.ok(GRADED_READERS_DATA.length >= 12, 'Must have at least 12 graded readers');
    
    const levels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
    levels.forEach(lvl => {
      const readersAtLevel = getGradedReadersByLevel(lvl);
      assert.ok(readersAtLevel.length >= 2, `Level ${lvl} must have at least 2 readers`);
    });
  });

  await t.test('2. Each graded reader has valid required pedagogical fields', () => {
    GRADED_READERS_DATA.forEach(reader => {
      assert.ok(reader.id, 'Reader must have id');
      assert.ok(reader.titleZh, `Reader ${reader.id} must have titleZh`);
      assert.ok(reader.titleVi, `Reader ${reader.id} must have titleVi`);
      assert.ok(reader.level, `Reader ${reader.id} must have level`);
      assert.ok(reader.topic, `Reader ${reader.id} must have topic`);
      assert.ok(reader.contentZh && reader.contentZh.length >= 50, `Reader ${reader.id} contentZh must have content`);
      assert.ok(reader.translationVi && reader.translationVi.length >= 50, `Reader ${reader.id} translationVi must have content`);
      assert.ok(Array.isArray(reader.vocabularyHighlights) && reader.vocabularyHighlights.length >= 2, `Reader ${reader.id} must have vocabularyHighlights`);
      assert.ok(Array.isArray(reader.questions) && reader.questions.length >= 2, `Reader ${reader.id} must have at least 2 questions`);

      reader.questions.forEach((q, qIdx) => {
        assert.ok(q.question, `Question ${qIdx} in reader ${reader.id} must have question text`);
        assert.ok(Array.isArray(q.options) && q.options.length >= 4, `Question ${qIdx} must have 4 options`);
        assert.ok(typeof q.answerIndex === 'number' && q.answerIndex >= 0 && q.answerIndex < q.options.length, `Question ${qIdx} must have valid answerIndex`);
        assert.ok(q.explanation && q.explanation.length > 5, `Question ${qIdx} must have explanation`);
      });
    });
  });

  await t.test('3. Query helper functions return correct filtered results', () => {
    const hsk1List = getGradedReadersByLevel('HSK 1');
    assert.equal(hsk1List.length, 2);
    assert.equal(hsk1List[0].level, 'HSK 1');
    assert.equal(hsk1List[1].level, 'HSK 1');

    const specificReader = getGradedReaderById('gr-101');
    assert.ok(specificReader);
    assert.equal(specificReader.titleZh, '小明的一天');

    const nonexistent = getGradedReaderById('nonexistent-id');
    assert.equal(nonexistent, null);
  });
});

test('SMART CHINESE READER — NLP INTEGRATION & READING WORKFLOW', async (t) => {

  await t.test('Successfully analyzes full graded reader text into paragraphs and enriched tokens', () => {
    const reader = getGradedReaderById('gr-101');
    const analysis = analyzeChineseText(reader.contentZh);

    assert.ok(analysis.paragraphs.length >= 4, 'Must have multiple paragraphs');
    assert.ok(analysis.stats.totalChars > 0);
    assert.ok(analysis.stats.chineseChars > 0);
    assert.ok(analysis.stats.wordCount > 0);

    // Verify tokens contain Chinese words with Pinyin
    const allTokens = analysis.paragraphs.flatMap(p => p.tokens);
    const chineseTokens = allTokens.filter(t => t.isChinese);
    assert.ok(chineseTokens.length >= 10, 'Must extract Chinese tokens');

    chineseTokens.forEach(tok => {
      assert.ok(tok.raw, 'Token must have raw');
      assert.ok(tok.pinyin, `Token ${tok.raw} must have pinyin`);
      assert.ok(tok.meaningVi, `Token ${tok.raw} must have meaningVi`);
    });
  });

  await t.test('Accurately calculates HSK distribution stats', () => {
    const readerHsk1 = getGradedReaderById('gr-101');
    const analysis1 = analyzeChineseText(readerHsk1.contentZh);
    assert.ok(analysis1.stats.hskStats['HSK 1'] > 0, 'HSK 1 text must contain HSK 1 words');

    const readerHsk4 = getGradedReaderById('gr-401');
    const analysis4 = analyzeChineseText(readerHsk4.contentZh);
    assert.ok(analysis4.stats.hskStats['HSK 4'] > 0 || analysis4.stats.hskStats['HSK 3'] > 0, 'HSK 4 text must contain intermediate words');
  });
});
