import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  scheduleNextReview,
  applyCrossModuleLookupPenalty,
  computeWorkspaceStats,
  buildReviewSessionItems,
  listVocabItems,
  isVocabItemMastered,
  markVocabItemAsMastered,
} from '../src/services/vocabWorkspaceService.ts';

test('scheduleNextReview updates SRS intervals and lapses accurately across ratings 1-4', async () => {
  const items = await listVocabItems(null);
  const base = items[0];
  const now = new Date('2026-11-12T10:00:00.000Z');

  // Rating 1: Again -> lapses++, interval = 1
  const again = scheduleNextReview(base, 1, now);
  assert.equal(again.lapses, base.lapses + 1);
  assert.equal(again.interval_days, 1);
  assert.ok(again.ease_factor < base.ease_factor);

  // Rating 3: Good -> increases repetitions and interval
  const good1 = scheduleNextReview({ ...base, repetitions: 0, interval_days: 0 }, 3, now);
  assert.equal(good1.interval_days, 1);
  const good2 = scheduleNextReview(good1, 3, now);
  assert.equal(good2.interval_days, 6);
  assert.equal(good2.srs_state, 'review');

  // Rating 4: Easy -> larger interval & higher ease
  const easy = scheduleNextReview({ ...base, repetitions: 0, interval_days: 0 }, 4, now);
  assert.equal(easy.interval_days, 4);
  assert.ok(easy.ease_factor >= 2.5);
});

test('applyCrossModuleLookupPenalty halves interval_days for review items', () => {
  const now = new Date('2026-11-12T10:00:00.000Z');
  const reviewItem = {
    id: 'test-1',
    deck_id: 'deck-1',
    simplified: '氛围',
    pinyin: 'fēnwéi',
    han_viet: 'PHÂN VI',
    meaning_vi: 'Bầu không khí',
    hsk_level: 5,
    personal_mnemonic: '',
    tags: [],
    source_context: [],
    srs_state: 'review',
    stability: 10,
    difficulty: 4,
    ease_factor: 2.5,
    interval_days: 10,
    repetitions: 4,
    lapses: 0,
    next_review_at: '2026-11-22T10:00:00.000Z',
    last_reviewed_at: now.toISOString(),
    meaning_mastery: 85,
    writing_mastery: 60,
    pronunciation_mastery: 80,
  };

  const penalized = applyCrossModuleLookupPenalty(reviewItem, now);
  assert.equal(penalized.interval_days, 5);
  assert.ok(penalized.stability < reviewItem.stability);
});

test('computeWorkspaceStats computes dueToday, leechCount, and 7-day forecast', async () => {
  const items = await listVocabItems(null);
  const stats = computeWorkspaceStats(items);
  assert.ok(stats.dueToday >= 1);
  assert.ok(stats.leechCount >= 1);
  assert.equal(stats.forecast7Days.length, 7);
});

test('buildReviewSessionItems generates multi-modal cards with context cloze', async () => {
  const items = await listVocabItems(null);
  const cards = buildReviewSessionItems(items, items, 'mixed');
  // Mastered items (e.g. interval >= 7 days) are excluded from the review queue
  assert.ok(cards.length > 0 && cards.length <= items.length);
  const clozeCard = cards.find((c) => c.mode === 'context_cloze');
  assert.ok(clozeCard);
  assert.ok(clozeCard.clozePrompt?.includes('______'));
});

test('markVocabItemAsMastered excludes the item from future review sessions', async () => {
  const items = await listVocabItems(null);
  const target = items[0];
  const updatedList = await markVocabItemAsMastered(target.id, null);
  const updated = updatedList.find((it) => it.id === target.id);
  assert.ok(updated);
  assert.equal(isVocabItemMastered(updated), true);

  const newCards = buildReviewSessionItems([updated], [updated], 'mixed');
  assert.equal(newCards.length, 0); // Excluded from review
});

test('vocabulary workspace SQL migration defines vocab_decks and user_vocab_items', () => {
  const sqlPath = path.resolve('supabase/migrations/20261112_2706_vocabulary_workspace.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.vocab_decks/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_vocab_items/i);
  assert.match(sql, /UNIQUE \(user_id, simplified\)/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
});

