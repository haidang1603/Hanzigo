import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNextSrsReview, SRS_QUALITY, SRS_STAGES, isCardDueForReview } from '../src/utils/srsEngine.js';

test('SM-2 SRS: New card initial review with Good quality should set interval to 1 day', () => {
  const initialCard = { repetitions: 0, intervalDays: 1, easeFactor: 2.5 };
  const next = calculateNextSrsReview(initialCard, SRS_QUALITY.GOOD);

  assert.equal(next.repetitions, 1);
  assert.equal(next.intervalDays, 1);
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

test('SM-2 SRS: Third consecutive correct review multiplies by ease factor', () => {
  const cardAfterTwo = { repetitions: 2, intervalDays: 6, easeFactor: 2.5 };
  const next = calculateNextSrsReview(cardAfterTwo, SRS_QUALITY.GOOD);

  assert.equal(next.repetitions, 3);
  assert.equal(next.intervalDays, Math.round(6 * 2.5)); // 15 days
});

test('SM-2 SRS: Forgotten card resets repetitions to 0 and interval to 1 day', () => {
  const advancedCard = { repetitions: 4, intervalDays: 30, easeFactor: 2.3 };
  const next = calculateNextSrsReview(advancedCard, SRS_QUALITY.FORGOT);

  assert.equal(next.repetitions, 0);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.stage, SRS_STAGES.LEARNING);
});

test('SM-2 SRS: Ease factor is bounded at minimum 1.30', () => {
  let card = { repetitions: 0, intervalDays: 1, easeFactor: 1.35 };
  // Repeated failures
  for (let i = 0; i < 5; i++) {
    card = calculateNextSrsReview(card, SRS_QUALITY.FORGOT);
  }
  assert.equal(card.easeFactor, 1.30);
});

test('SM-2 SRS: isCardDueForReview detects overdue cards correctly', () => {
  const pastCard = { nextReviewAt: new Date(Date.now() - 3600000).toISOString() };
  const futureCard = { nextReviewAt: new Date(Date.now() + 86400000).toISOString() };

  assert.equal(isCardDueForReview(pastCard), true);
  assert.equal(isCardDueForReview(futureCard), false);
});
