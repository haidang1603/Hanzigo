import test from 'node:test';
import assert from 'node:assert/strict';
import {
  numericToTone,
  toneToNumeric,
  toPinyinClean,
  normalizePinyinTriple,
  resolveHanVietReading,
} from '../scripts/utils/chinesePhoneticsNormalizer.js';
import {
  buildDictionaryEntryRecord,
  chunkArray,
} from '../scripts/seedFullHskDictionary.js';

test('chinesePhoneticsNormalizer: converts numeric <-> tone <-> clean Pinyin accurately', () => {
  assert.equal(numericToTone('nu:3 li4'), 'nǚ lì');
  assert.equal(numericToTone('nv3 li4'), 'nǚ lì');
  assert.equal(numericToTone('jian1 chi2'), 'jiān chí');
  assert.equal(numericToTone('shu4 ju4 ku4'), 'shù jù kù');

  assert.equal(toneToNumeric('nǚ lì'), 'nv3 li4');
  assert.equal(toneToNumeric('jiān chí'), 'jian1 chi2');
  assert.equal(toneToNumeric('nǚ lì', { umlautStyle: 'u:' }), 'nu:3 li4');

  assert.equal(toPinyinClean('nǚ lì'), 'nuli');
  assert.equal(toPinyinClean('jiān chí'), 'jianchi');

  const triple = normalizePinyinTriple('nu:3 li4');
  assert.equal(triple.pinyin_display, 'nǚ lì');
  assert.equal(triple.pinyin_tone, 'nǚ lì');
  assert.equal(triple.pinyin_numeric, 'nv3 li4');
  assert.equal(triple.pinyin_clean, 'nuli');
});

test('chinesePhoneticsNormalizer: resolves uppercase compound Han-Viet readings', () => {
  assert.equal(resolveHanVietReading('数据库'), 'THỐ CỨ KHỐ');
  assert.equal(resolveHanVietReading('坚持'), 'KIÊN TRÌ');
  assert.equal(resolveHanVietReading('学习'), 'HỌC TẬP');
});

test('seedFullHskDictionary: builds schema-compatible entry and chunks by 400', () => {
  const entry = buildDictionaryEntryRecord({
    simplified: '坚持',
    pinyin: 'jian1 chi2',
    level: 'HSK 4',
    meaning: 'Kiên trì',
  });

  assert.equal(entry.simplified, '坚持');
  assert.equal(entry.pinyin_display, 'jiān chí');
  assert.equal(entry.pinyin_tone, 'jiān chí');
  assert.equal(entry.pinyin_numeric, 'jian1 chi2');
  assert.equal(entry.pinyin_clean, 'jianchi');
  assert.equal(entry.han_viet, 'KIÊN TRÌ');
  assert.equal(entry.hsk_2_level, 4);
  assert.equal(entry.hsk_3_level, 4);

  const chunks = chunkArray(new Array(850).fill(entry), 400);
  assert.equal(chunks.length, 3);
  assert.equal(chunks[0].length, 400);
  assert.equal(chunks[2].length, 50);
});

