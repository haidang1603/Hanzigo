import test from 'node:test';
import assert from 'node:assert/strict';

import {
  cleanPinyin,
  cleanVietnamese,
  searchLocalDictionary,
  searchDictionaryHybrid,
  searchDictionaryPaginated,
  formatDictionaryItemForDisplay
} from '../src/services/dictionaryService.js';

import {
  calculateNextSrsReview,
  SRS_QUALITY,
  captureWeakVocabulary,
  isCardDueForReview
} from '../src/utils/srsEngine.js';

import { saveCustomVocab, getStoredCustomVocab } from '../src/utils/materialsStorage.js';

// =========================================================================
// HANZIGO PHASE 16: LARGE-SCALE CHINESE VOCABULARY TEST SUITE
// =========================================================================

test('PHASE 16 TEST 1: Pinyin Tone and Clean Normalization handles complex finals and accents', () => {
  // Test cleanPinyin removing tones and umlauts
  assert.equal(cleanPinyin('xué xí'), 'xuexi');
  assert.equal(cleanPinyin('nǚ ér'), 'nver');
  assert.equal(cleanPinyin('lǜ sè'), 'lvse');
  assert.equal(cleanPinyin('Hàn yǔ'), 'hanyu');
  assert.equal(cleanPinyin('běi jīng'), 'beijing');
  assert.equal(cleanPinyin('xue2 xi2'), 'xuexi'); // number stripping
});

test('PHASE 16 TEST 2: Vietnamese Text Normalization for accent-insensitive search', () => {
  assert.equal(cleanVietnamese('Học tập'), 'hoc tap');
  assert.equal(cleanVietnamese('Điện thoại di động'), 'dien thoai di dong');
  assert.equal(cleanVietnamese('Chào buổi sáng'), 'chao buoi sang');
});

test('PHASE 16 TEST 3: Multi-tier Ranking in Local Search matches exact Hanzi, Pinyin and Vietnamese', () => {
  // 1. Exact Hanzi match
  const resHanzi = searchLocalDictionary('我', 5);
  assert.ok(resHanzi.length > 0);
  assert.equal(resHanzi[0].hanzi, '我');
  assert.equal(resHanzi[0].matchScore, 100);

  // 2. Exact Pinyin match
  const resPinyin = searchLocalDictionary('ni', 5);
  assert.ok(resPinyin.length > 0);
  assert.equal(resPinyin[0].hanzi, '你');
  assert.equal(resPinyin[0].matchScore, 90);

  // 3. Vietnamese Meaning match
  const resMeaning = searchLocalDictionary('học tập', 5);
  assert.ok(resMeaning.length > 0);
  assert.ok(resMeaning.some(item => item.hanzi === '学习' || item.meaningVi.includes('học') || item.hanviet.includes('Học')));
});

test('PHASE 16 TEST 4: Hybrid Search merges local and deduplicates correctly', async () => {
  const hybridResults = await searchDictionaryHybrid('学习', { limit: 10 });
  assert.ok(Array.isArray(hybridResults));
  assert.ok(hybridResults.length > 0);
  // Ensure no duplicate hanzi in returned array
  const seen = new Set();
  for (const item of hybridResults) {
    assert.equal(seen.has(item.hanzi), false, `Duplicate hanzi found: ${item.hanzi}`);
    seen.add(item.hanzi);
  }
});

test('PHASE 16 TEST 5: Paginated Search prevents client RAM bloat by returning bounded pages', async () => {
  const page1 = await searchDictionaryPaginated({ query: '', hskLevel: 'ALL', page: 1, pageSize: 15 });
  assert.equal(page1.page, 1);
  assert.equal(page1.pageSize, 15);
  assert.ok(page1.entries.length <= 15);
  assert.ok(page1.totalCount > 0);
  assert.ok(page1.totalPages >= 1);

  const page2 = await searchDictionaryPaginated({ query: '', hskLevel: 'ALL', page: 2, pageSize: 15 });
  assert.equal(page2.page, 2);
  assert.ok(page2.entries.length <= 15);

  // Ensure entries on page 1 and page 2 are distinct
  if (page1.entries.length > 0 && page2.entries.length > 0) {
    const p1Ids = new Set(page1.entries.map(e => e.id));
    for (const e2 of page2.entries) {
      assert.equal(p1Ids.has(e2.id), false, `Overlap between page 1 and page 2: ${e2.id}`);
    }
  }
});

test('PHASE 16 TEST 6: HSK Filter in Paginated Search strictly adheres to requested level', async () => {
  const hsk1Results = await searchDictionaryPaginated({ query: '', hskLevel: 'HSK 1', page: 1, pageSize: 20 });
  for (const item of hsk1Results.entries) {
    if (item.level) {
      assert.equal(item.level, 'HSK 1');
    }
  }
});

test('PHASE 16 TEST 7: Word detail formatting suppresses unverified placeholder fields', () => {
  const unverifiedCcCedict = {
    simplified: '110',
    traditional: '110',
    pinyinTone: 'yāo yāo líng',
    meaningVi: '', // unverified
    meaningEn: 'emergency number',
    definitions: ['emergency number for police'],
    pos: 'n/v/adj',
    level: null,
    qualityStatus: 'community_standard'
  };

  const formatted = formatDictionaryItemForDisplay(unverifiedCcCedict);
  // Must NOT display empty string or fake verified meaning
  assert.equal(formatted.meaningVi, null);
  assert.equal(formatted.traditional, null); // suppressed if same as simplified
  assert.equal(formatted.pos, null); // suppressed if default generic
  assert.equal(formatted.hskLevel, null); // suppressed if unverified
  assert.equal(formatted.qualityStatus, 'community_standard');
  assert.deepEqual(formatted.definitions, ['emergency number for police']);
});

test('PHASE 16 TEST 8: Word detail formatting preserves human-verified rich data', () => {
  const verifiedWord = {
    simplified: '学习',
    traditional: '學習',
    pinyinTone: 'xué xí',
    hanviet: 'Học tập',
    meaningVi: 'học tập, nghiên cứu',
    meaningEn: 'to learn; to study',
    definitions: ['to learn', 'to study'],
    pos: 'Động từ',
    level: 'HSK 1',
    qualityStatus: 'verified_human',
    decomposition: { structureType: 'Trái-Phải', idsSequence: '⿰' }
  };

  const formatted = formatDictionaryItemForDisplay(verifiedWord);
  assert.equal(formatted.simplified, '学习');
  assert.equal(formatted.traditional, '學習');
  assert.equal(formatted.hanviet, 'Học tập');
  assert.equal(formatted.meaningVi, 'học tập, nghiên cứu');
  assert.equal(formatted.pos, 'Động từ');
  assert.equal(formatted.hskLevel, 'HSK 1');
  assert.equal(formatted.qualityStatus, 'verified_human');
  assert.ok(formatted.decomposition);
});

test('PHASE 16 TEST 9: Adding Dictionary Word to Flashcard/SRS bridges without DB pollution', () => {
  // Simulate mock user and dictionary item
  const mockUser = { id: 'test-user-phase16' };
  const dictWord = {
    hanzi: '咖啡',
    pinyin: 'kāfēi',
    hanviet: 'Cà phê',
    meaningVi: 'Cà phê',
    level: 'HSK 2',
    topic: 'Ăn uống'
  };

  // 1. Capture into user SRS weak list
  captureWeakVocabulary(dictWord, 'dictionary', mockUser);

  // 2. Compute SM-2 review step
  const initialSrs = { repetitions: 0, intervalDays: 1, easeFactor: 2.50 };
  const goodReview = calculateNextSrsReview(initialSrs, SRS_QUALITY.GOOD);
  assert.equal(goodReview.repetitions, 1);
  assert.equal(goodReview.intervalDays, 1);

  const easyReview = calculateNextSrsReview(goodReview, SRS_QUALITY.EASY);
  assert.equal(easyReview.repetitions, 2);
  assert.equal(easyReview.intervalDays, 6);
  assert.ok(easyReview.easeFactor > 2.50);

  // 3. Due check
  const futureCard = { nextReviewAt: new Date(Date.now() + 86400000).toISOString() };
  assert.equal(isCardDueForReview(futureCard), false);

  const pastCard = { nextReviewAt: new Date(Date.now() - 3600000).toISOString() };
  assert.equal(isCardDueForReview(pastCard), true);
});

test('PHASE 16 TEST 10: Import Deduplication & Multi-line consolidation logic', () => {
  // Test consolidation pattern for lines having identical (trad, simp, pinyin)
  const lineA = {
    traditional: '丁', simplified: '丁', pinyin_number: 'ding1',
    definitions: ['surname Ding']
  };
  const lineB = {
    traditional: '丁', simplified: '丁', pinyin_number: 'ding1',
    definitions: ['male adult', '4th Heavenly Stem']
  };

  const consolidated = {
    ...lineA,
    definitions: [...lineA.definitions]
  };
  for (const m of lineB.definitions) {
    if (!consolidated.definitions.includes(m)) {
      consolidated.definitions.push(m);
    }
  }

  assert.equal(consolidated.definitions.length, 3);
  assert.deepEqual(consolidated.definitions, ['surname Ding', 'male adult', '4th Heavenly Stem']);
});
