import test from 'node:test';
import assert from 'node:assert/strict';

import { VOCABULARY_LIST } from '../src/data/chineseData.js';
import {
  auditAllCuratedVocabularies,
  classifyMeaningQuality,
  NUMBERED_PINYIN_RE,
} from '../scripts/auditVocabularyVietnamese.js';
import { sanitizeSeedDefinition } from '../scripts/seedFullHskDictionary.js';

test('1. Curated HSK 1-9 & Lesson Vocabularies achieve 100% Vietnamese coverage and 0% English/CC-CEDICT leaks', async () => {
  const { reports, rawCedictCount } = await auditAllCuratedVocabularies();
  assert.ok(reports.length >= 18, 'Audit must scan all curated vocabulary & lesson modules');
  assert.ok(rawCedictCount >= 100000, 'Raw offline CC-CEDICT inventory must be accounted for');

  for (const r of reports) {
    assert.equal(r.missing, 0, `${r.file} has ${r.missing} missing meanings`);
    assert.equal(r.english, 0, `${r.file} has ${r.english} English-only meanings`);
    assert.equal(r.cedictOrMixed, 0, `${r.file} has ${r.cedictOrMixed} CC-CEDICT/mixed meanings`);
    assert.equal(
      r.exampleOrPinyinIssues,
      0,
      `${r.file} has ${r.exampleOrPinyinIssues} example/numbered-pinyin issues`
    );
    assert.equal(r.duplicateIds, 0, `${r.file} has duplicate IDs`);
  }
});

test('2. VOCABULARY_LIST preserves unique IDs, Hanzi, accented Pinyin, and complete Vietnamese examples', () => {
  assert.ok(VOCABULARY_LIST.length >= 800, 'VOCABULARY_LIST must remain intact (no deleted words)');
  const seenIds = new Set();
  for (const entry of VOCABULARY_LIST) {
    assert.ok(entry.id !== undefined && entry.id !== null, `Entry ${entry.hanzi} missing id`);
    assert.equal(seenIds.has(entry.id), false, `Duplicate VOCABULARY_LIST id: ${entry.id}`);
    seenIds.add(entry.id);

    assert.ok(entry.hanzi && /[\u4e00-\u9fa5]/.test(entry.hanzi), `Invalid hanzi for id ${entry.id}`);
    assert.ok(entry.pinyin && entry.pinyin.trim().length > 0, `Missing pinyin for ${entry.hanzi}`);
    assert.equal(
      NUMBERED_PINYIN_RE.test(entry.pinyin),
      false,
      `Numbered pinyin leaked in ${entry.hanzi}: ${entry.pinyin}`
    );
    assert.equal(
      classifyMeaningQuality(entry.meaning),
      'ok',
      `Invalid Vietnamese meaning in ${entry.hanzi}: ${entry.meaning}`
    );

    if (entry.example && typeof entry.example === 'object') {
      assert.ok(entry.example.pinyin && !NUMBERED_PINYIN_RE.test(entry.example.pinyin));
      assert.equal(
        classifyMeaningQuality(entry.example.meaning),
        'ok',
        `Invalid example meaning in ${entry.hanzi}: ${entry.example.meaning}`
      );
    }
  }
});

test('3. Seed sanitizer strips raw CC-CEDICT markers, numbered Pinyin, and English surname tags', () => {
  assert.equal(
    sanitizeSeedDefinition('used in 谢谢[xie4 xie5]; CL:個|个[ge4]; surname Wang'),
    'used in 谢谢; họ Wang'
  );
  assert.equal(classifyMeaningQuality('vất vả, cực nhọc'), 'ok');
  assert.equal(classifyMeaningQuality('CL:個|个[ge4]'), 'cedict');
  assert.equal(classifyMeaningQuality('TBD'), 'missing');
});
