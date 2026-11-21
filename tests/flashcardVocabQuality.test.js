import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { VOCABULARY_LIST, TOPIC_FILTERS } from '../src/data/chineseData.js';
import { HSK79_VOCAB_GLOSSARY } from '../src/features/curriculum/hsk79VocabGlossary.js';
import {
  HSK_30_BANDS,
  HSK_30_TOTAL_VOCAB_COUNT,
  getLocalHsk79Flashcards,
  normalizeDictionaryRowToFlashcard,
} from '../src/services/hsk30FlashcardDeckService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const NUMBERED_PINYIN = /[a-zA-ZüÜ]+[1-5]\b/;
const RAW_ENGLISH_TERMS = /\b(win-win|job offer|quotation|counter-offer|checks and balances|bấm like)\b/i;

test('Flashcard Quality (1): Zero duplicate hanzi, zero missing core fields, zero numbered pinyin', () => {
  const seen = new Set();
  assert.equal(VOCABULARY_LIST.length, 812);
  for (const item of VOCABULARY_LIST) {
    assert.ok(item.hanzi && String(item.hanzi).trim(), `Missing hanzi for id ${item.id}`);
    assert.equal(seen.has(item.hanzi), false, `Duplicate hanzi: ${item.hanzi}`);
    seen.add(item.hanzi);

    assert.ok(item.pinyin && String(item.pinyin).trim(), `Missing pinyin for ${item.hanzi}`);
    assert.equal(NUMBERED_PINYIN.test(item.pinyin), false, `Numbered pinyin in ${item.hanzi}: ${item.pinyin}`);
    assert.ok(item.hanviet && String(item.hanviet).trim(), `Missing hanviet for ${item.hanzi}`);
    assert.ok(item.meaning && String(item.meaning).trim(), `Missing meaning for ${item.hanzi}`);
  }
});

test('Flashcard Quality (2): Zero legacy "HSK 5-6" labels; all HSK 1-9 bands populated', () => {
  const levelCounts = {};
  for (const item of VOCABULARY_LIST) {
    assert.notEqual(item.level, 'HSK 5-6', `Legacy merged level HSK 5-6 found on ${item.hanzi}`);
    levelCounts[item.level] = (levelCounts[item.level] || 0) + 1;
  }

  for (const lvl of ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6']) {
    assert.ok((levelCounts[lvl] || 0) > 0, `Empty HSK level: ${lvl}`);
  }

  const hsk79Cards = getLocalHsk79Flashcards();
  assert.ok(hsk79Cards.length >= 439, `Expected >= 439 HSK 7-9 cards, got ${hsk79Cards.length}`);

  // Verify HSK 3.0 revised standard targets (300/200/500/1000/1600/1800/5600 = 11.000)
  assert.equal(HSK_30_TOTAL_VOCAB_COUNT, 11000);
  assert.equal(HSK_30_BANDS['HSK 1'].limit, 300);
  assert.equal(HSK_30_BANDS['HSK 2'].limit, 200);
  assert.equal(HSK_30_BANDS['HSK 3'].limit, 500);
  assert.equal(HSK_30_BANDS['HSK 4'].limit, 1000);
  assert.equal(HSK_30_BANDS['HSK 5'].limit, 1600);
  assert.equal(HSK_30_BANDS['HSK 6'].limit, 1800);
  assert.equal(HSK_30_BANDS['HSK 7-9'].limit, 5600);
});

test('Flashcard Quality (3): 100% of VOCABULARY_LIST maps to 16 standard TOPIC_FILTERS with zero empty topics', () => {
  const allowedTopics = TOPIC_FILTERS.filter((t) => t !== 'Tất cả');
  assert.equal(allowedTopics.length, 16);

  const topicCounts = {};
  for (const item of VOCABULARY_LIST) {
    assert.ok(
      allowedTopics.includes(item.topic),
      `Unstandardized topic "${item.topic}" on id=${item.id} (${item.hanzi})`
    );
    topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
  }

  for (const t of allowedTopics) {
    assert.ok((topicCounts[t] || 0) > 0, `Empty topic filter: ${t}`);
  }
});

test('Flashcard Quality (4): Zero raw English leftovers in curated Vietnamese meanings', () => {
  for (const item of VOCABULARY_LIST) {
    assert.equal(
      RAW_ENGLISH_TERMS.test(String(item.meaning || '')),
      false,
      `English leftover in meaning for ${item.hanzi}: ${item.meaning}`
    );
  }
  for (const [hz, entry] of Object.entries(HSK79_VOCAB_GLOSSARY || {})) {
    assert.equal(
      RAW_ENGLISH_TERMS.test(String(entry.meaning || '')),
      false,
      `English leftover in HSK79 meaning for ${hz}: ${entry.meaning}`
    );
  }
});

test('Flashcard Quality (5): 100% examples contain target hanzi & HSK 7-9 flashcards expose example.hanzi and example.meaning', () => {
  for (const item of VOCABULARY_LIST) {
    const exZh = String(item.example?.hanzi || '');
    const exVi = String(item.example?.meaning || '');
    assert.ok(exZh.length > 0, `Missing example.hanzi for ${item.hanzi}`);
    assert.ok(exVi.length > 0, `Missing example.meaning for ${item.hanzi}`);
    const cleanTarget = String(item.hanzi).replace(/[…./（）()\s]/g, '');
    const parts = String(item.hanzi).split(/[…./～~]+/).filter(Boolean);
    const hasTarget =
      exZh.includes(cleanTarget) || (parts.length > 1 && parts.every((p) => exZh.includes(p)));
    assert.equal(hasTarget, true, `Example for #${item.id} (${item.hanzi}) does not contain target: ${exZh}`);
  }

  const hsk79Cards = getLocalHsk79Flashcards();
  for (const card of hsk79Cards) {
    assert.ok(card.example?.hanzi, `HSK 7-9 card ${card.hanzi} missing example.hanzi`);
    assert.ok(card.example?.meaning, `HSK 7-9 card ${card.hanzi} missing example.meaning`);
  }
});

test('Flashcard Quality (6): Cloud normalizer rejects raw English-only rows & mismatched HSK bands; VocabularyPage applies selectedTopic in corpusMode', () => {
  // Reject English-only row
  const englishOnly = normalizeDictionaryRowToFlashcard(
    {
      id: 999,
      simplified: '测试',
      pinyin_tone: 'cèshì',
      vietnamese_meaning: 'test',
      english_meanings: 'test',
      hsk_level: 'HSK 4',
    },
    100,
    'HSK 4'
  );
  assert.equal(englishOnly, null);

  // Reject wrong HSK band
  const wrongBand = normalizeDictionaryRowToFlashcard(
    {
      id: 1000,
      simplified: '测试',
      pinyin_tone: 'cèshì',
      vietnamese_meaning: 'kiểm tra, thử nghiệm',
      english_meanings: 'test',
      hsk_level: 'HSK 1',
    },
    100,
    'HSK 5'
  );
  assert.equal(wrongBand, null);

  // Accept valid Vietnamese row in matching band
  const validRow = normalizeDictionaryRowToFlashcard(
    {
      id: 1001,
      simplified: '测试',
      pinyin_tone: 'cèshì',
      vietnamese_meaning: 'kiểm tra, thử nghiệm',
      english_meanings: 'test',
      hsk_level: 'HSK 4',
    },
    100,
    'HSK 4'
  );
  assert.ok(validRow);
  assert.equal(validRow.meaning, 'kiểm tra, thử nghiệm');

  // Verify VocabularyPage applies selectedTopic even when corpusMode is active
  const vocabPageSrc = fs.readFileSync(path.join(ROOT, 'src/pages/VocabularyPage.jsx'), 'utf8');
  assert.match(vocabPageSrc, /const isTopicFiltering = selectedTopic !== 'Tất cả';/);
  assert.match(vocabPageSrc, /selectedTopic === 'Tất cả' \|\| item\.topic === selectedTopic/);
});
