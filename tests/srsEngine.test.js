import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateNextSrsReview, 
  SRS_QUALITY, 
  SRS_STAGES, 
  isCardDueForReview,
  calculateSrsStats,
  mergeSrsCardsLastWriteWins,
  captureWeakVocabulary
} from '../src/utils/srsEngine.js';

test('SM-2 SRS: New card initial review with Good quality should set interval to 1 day', () => {
  const initialCard = { repetitions: 0, intervalDays: 1, easeFactor: 2.5 };
  const next = calculateNextSrsReview(initialCard, SRS_QUALITY.GOOD);

  assert.equal(next.repetitions, 1);
  assert.equal(next.repetition, 1);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.interval_days, 1);
  assert.equal(next.stage, SRS_STAGES.REVIEW);
  assert.ok(next.easeFactor >= 1.30);
});

test('SM-2 SRS: Second consecutive correct review should expand interval to 6 days', () => {
  const cardAfterOne = { repetitions: 1, intervalDays: 1, easeFactor: 2.5 };
  const next = calculateNextSrsReview(cardAfterOne, SRS_QUALITY.GOOD);

  assert.equal(next.repetitions, 2);
  assert.equal(next.intervalDays, 6);
  assert.equal(next.stage, SRS_STAGES.REVIEW);
});

test('SM-2 SRS: Third consecutive correct review multiplies by ease factor (1 -> 6 -> 15)', () => {
  const cardAfterTwo = { repetitions: 2, intervalDays: 6, easeFactor: 2.5 };
  const next = calculateNextSrsReview(cardAfterTwo, SRS_QUALITY.GOOD);

  assert.equal(next.repetitions, 3);
  assert.equal(next.intervalDays, 15); // round(6 * 2.5) = 15
});

test('SM-2 SRS: Forgotten card (Again, q=1) resets repetitions to 0, interval to 1, and increments lapse count', () => {
  const advancedCard = { repetitions: 4, intervalDays: 30, easeFactor: 2.3, lapseCount: 1 };
  const next = calculateNextSrsReview(advancedCard, SRS_QUALITY.AGAIN);

  assert.equal(next.repetitions, 0);
  assert.equal(next.repetition, 0);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.interval_days, 1);
  assert.equal(next.lapseCount, 2);
  assert.equal(next.stage, SRS_STAGES.LEARNING);
});

test('SM-2 SRS: Ease factor is bounded at minimum 1.30 even after 20 consecutive failures', () => {
  let card = { repetitions: 0, intervalDays: 1, easeFactor: 2.50 };
  for (let i = 0; i < 20; i++) {
    card = calculateNextSrsReview(card, SRS_QUALITY.AGAIN);
  }
  assert.equal(card.easeFactor, 1.30);
  assert.equal(card.ease_factor, 1.30);
  assert.equal(card.repetitions, 0);
  assert.equal(card.intervalDays, 1);
  assert.equal(card.lapseCount, 20);
});

test('SM-2 SRS: Easy grade (q=5) increases interval with bonus and elevates ease factor', () => {
  const card = { repetitions: 2, intervalDays: 6, easeFactor: 2.50 };
  const next = calculateNextSrsReview(card, SRS_QUALITY.EASY);

  assert.equal(next.repetitions, 3);
  assert.ok(next.intervalDays >= 18); // 6 * 2.5 * 1.3 = 19.5 -> 20
  assert.ok(next.easeFactor > 2.50);
});

test('SM-2 SRS: isCardDueForReview detects overdue cards correctly', () => {
  const pastCard = { nextReviewAt: new Date(Date.now() - 3600000).toISOString() };
  const futureCard = { nextReviewAt: new Date(Date.now() + 86400000).toISOString() };

  assert.equal(isCardDueForReview(pastCard), true);
  assert.equal(isCardDueForReview(futureCard), false);
});

test('SM-2 SRS: calculateSrsStats aggregates due, new, review, mastered, and leeches', () => {
  const cards = [
    { hanzi: '一', repetitions: 0, lapseCount: 0, nextReviewAt: new Date(Date.now() - 1000).toISOString() }, // due & new
    { hanzi: '二', repetitions: 2, lapseCount: 0, nextReviewAt: new Date(Date.now() + 86400000).toISOString() }, // review
    { hanzi: '三', repetitions: 6, lapseCount: 0, nextReviewAt: new Date(Date.now() + 86400000 * 2).toISOString() }, // mastered
    { hanzi: '四', repetitions: 1, lapseCount: 4, nextReviewAt: new Date(Date.now() - 5000).toISOString() }, // due & leech
  ];

  const stats = calculateSrsStats(cards);
  assert.equal(stats.totalCount, 4);
  assert.equal(stats.dueCount, 2);
  assert.equal(stats.newCount, 1);
  assert.equal(stats.reviewCount, 2);
  assert.equal(stats.masteredCount, 1);
  assert.equal(stats.leechCount, 1);
  assert.equal(stats.forecast7Days.length, 7);
  assert.ok(stats.forecast7Days[0].isToday);
});

test('SM-2 SRS: mergeSrsCardsLastWriteWins merges cards without losing records', () => {
  const localMap = {
    '你': {
      hanzi: '你',
      repetition: 2,
      interval_days: 6,
      updated_at: '2026-10-25T00:00:00.000Z'
    },
    '好': {
      hanzi: '好',
      repetition: 1,
      interval_days: 1,
      updated_at: '2026-10-25T02:00:00.000Z'
    }
  };

  const remoteList = [
    // Remote has newer version of '你'
    {
      hanzi: '你',
      repetition: 3,
      interval_days: 15,
      updated_at: '2026-10-25T01:00:00.000Z'
    },
    // Remote has older version of '好'
    {
      hanzi: '好',
      repetition: 1,
      interval_days: 1,
      updated_at: '2026-10-25T00:30:00.000Z'
    },
    // Remote has extra word '学'
    {
      hanzi: '学',
      repetition: 4,
      interval_days: 20,
      updated_at: '2026-10-25T00:00:00.000Z'
    }
  ];

  const merged = mergeSrsCardsLastWriteWins(localMap, remoteList);
  assert.equal(merged['你'].interval_days, 15); // picked remote (newer)
  assert.equal(merged['好'].updated_at, '2026-10-25T02:00:00.000Z'); // picked local (newer)
  assert.equal(merged['学'].repetition, 4); // picked new remote
});

test('SM-2 SRS: captureWeakVocabulary creates or updates weak cards with due priority', () => {
  // Mock localStorage and window in node test environment
  const storage = {};
  globalThis.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = v; },
    removeItem: (k) => { delete storage[k]; }
  };
  globalThis.window = {
    dispatchEvent: () => true
  };
  globalThis.CustomEvent = class {
    constructor(type, init) {
      this.type = type;
      this.detail = init?.detail;
    }
  };

  // 1. Capture new word
  const card1 = captureWeakVocabulary({
    hanzi: '测试',
    pinyin: 'cèshì',
    meaning: 'kiểm tra'
  }, 'quiz_mistake', null);

  assert.equal(card1.hanzi, '测试');
  assert.equal(card1.repetitions, 0);
  assert.equal(card1.intervalDays, 1);
  assert.equal(card1.lapseCount, 1);
  assert.equal(card1.sourceContext, 'quiz_mistake');
  assert.equal(isCardDueForReview(card1), true);

  // 2. Capture mistake on existing card
  const card2 = captureWeakVocabulary({
    hanzi: '测试',
    pinyin: 'cèshì',
    meaning: 'kiểm tra'
  }, 'writing_mistake', null);

  assert.equal(card2.repetitions, 0);
  assert.equal(card2.lapseCount, 2);
  assert.equal(card2.sourceContext, 'writing_mistake');
});

