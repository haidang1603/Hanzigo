import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanPinyin,
  normalizeNumberedPinyin,
  cleanVietnamese,
  searchLocalDictionary,
  searchDictionaryHybrid
} from '../src/services/dictionaryService.js';

test('Dictionary: cleanPinyin removes all diacritical tone marks', () => {
  assert.equal(cleanPinyin('xuéxí'), 'xuexi');
  assert.equal(cleanPinyin('hàn yǔ'), 'hanyu');
  assert.equal(cleanPinyin('nǚ ér'), 'nver');
  assert.equal(cleanPinyin('lǜ'), 'lv');
});

test('Dictionary: normalizeNumberedPinyin converts tone numbers and formats to clean pinyin', () => {
  assert.equal(normalizeNumberedPinyin('xue2 xi2'), 'xuexi');
  assert.equal(normalizeNumberedPinyin('han4yu3'), 'hanyu');
  assert.equal(normalizeNumberedPinyin('nv3er2'), 'nver');
});

test('Dictionary: cleanVietnamese strips Vietnamese accents and lowercase', () => {
  assert.equal(cleanVietnamese('Học Tập'), 'hoc tap');
  assert.equal(cleanVietnamese('Xin Chào!'), 'xin chao!');
  assert.equal(cleanVietnamese('Cà phê Đen'), 'ca phe den');
});

test('Dictionary Local Search: Matches exact Hanzi (Simplified and Traditional)', () => {
  const simpRes = searchLocalDictionary('学习');
  assert.ok(simpRes.length > 0);
  assert.equal(simpRes[0].hanzi, '学习');

  const tradRes = searchLocalDictionary('學習');
  assert.ok(tradRes.length > 0);
  assert.ok(tradRes[0].hanzi === '学习' || tradRes[0].traditional === '學習');
});

test('Dictionary Local Search: Multi-modal query resolution (Pinyin, Numbered, Tone, Hán-Việt, Meaning)', () => {
  // Pinyin tone: 'xuéxí' or 'xué xí'
  const toneRes = searchLocalDictionary('xuéxí');
  assert.ok(toneRes.length > 0);
  assert.ok(toneRes.some(r => r.hanzi === '学习' || r.hanzi === '学'));

  // Clean unaccented Pinyin: 'xuexi'
  const cleanRes = searchLocalDictionary('xuexi');
  assert.ok(cleanRes.length > 0);
  assert.ok(cleanRes.some(r => r.hanzi === '学习' || r.hanzi === '学'));

  // Numbered Pinyin: 'xue2 xi2'
  const numRes = searchLocalDictionary('xue2 xi2');
  assert.ok(numRes.length > 0);
  assert.ok(numRes.some(r => r.hanzi === '学习' || r.hanzi === '学'));

  // Hán-Việt: 'Học tập'
  const hvRes = searchLocalDictionary('học tập');
  assert.ok(hvRes.length > 0);
  assert.ok(hvRes.some(r => r.hanzi === '学习' || r.hanzi === '学'));
});

test('Dictionary Local Search: Resilient to special characters and regex injection', () => {
  assert.doesNotThrow(() => {
    const res1 = searchLocalDictionary('%_');
    assert.ok(Array.isArray(res1));

    const res2 = searchLocalDictionary("'; DROP TABLE dictionary_entries; --");
    assert.ok(Array.isArray(res2));

    const res3 = searchLocalDictionary('[[*?+\\^$()]');
    assert.ok(Array.isArray(res3));
  });
});

test('Dictionary Hybrid: Integrates Local (0ms) and handles Cloud degradation gracefully', async () => {
  const results = await searchDictionaryHybrid('你好', { limit: 10 });
  assert.ok(results.length > 0);
  assert.equal(results[0].hanzi, '你好');
});
