import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

import {
  calculateStrokeAccuracy,
  computeMasteryTier,
  getWritingHistoryAndMastery,
  recordWritingAttempt,
  WritingQueueManager,
} from '../src/services/writingStudioService.ts';

describe('Task 27.03: Hanzi Writing Studio', () => {
  it('computes recall stroke accuracy and zeroes strokes with >3 mistakes', () => {
    const perfect = calculateStrokeAccuracy({
      mode: 'recall',
      totalStrokes: 10,
      strokeMistakes: {},
    });
    assert.equal(perfect.accuracyScore, 100);
    assert.deepEqual(perfect.mistakenStrokeIndices, []);

    const oneMiss = calculateStrokeAccuracy({
      mode: 'recall',
      totalStrokes: 10,
      strokeMistakes: { 2: 1 },
    });
    // 100 - 100 / (10 * 1.5) = 93.33
    assert.equal(oneMiss.accuracyScore, 93.33);
    assert.deepEqual(oneMiss.mistakenStrokeIndices, [2]);

    const failedStroke = calculateStrokeAccuracy({
      mode: 'recall',
      totalStrokes: 10,
      strokeMistakes: { 4: 4 },
    });
    // Stroke 4 failed (>3 mistakes) -> full 10-point stroke weight deducted = 90
    assert.equal(failedStroke.accuracyScore, 90);
    assert.deepEqual(failedStroke.zeroedStrokeIndices, [4]);
    assert.deepEqual(failedStroke.mistakenStrokeIndices, [4]);
  });

  it('manages multi-character word, sentence, and deck queues', () => {
    const queue = new WritingQueueManager('图书馆');
    assert.equal(queue.getItems().length, 3);
    assert.equal(queue.getCurrentItem()?.character, '图');

    queue.next();
    assert.equal(queue.getCurrentItem()?.character, '书');
    assert.deepEqual(queue.getProgress(), { current: 2, total: 3, percent: 67 });

    queue.load([{ hanzi: '学习' }, { hanzi: '中文' }]);
    assert.equal(queue.getItems().length, 4);
    queue.jumpTo(3);
    assert.equal(queue.getCurrentItem()?.character, '文');
  });

  it('persists writing attempts, updates mastery tiers, and ranks most mistaken chars', async () => {
    globalThis.localStorage.clear();

    await recordWritingAttempt({
      character: '图',
      mode: 'recall',
      totalStrokes: 8,
      strokeMistakes: { 1: 4, 3: 2 },
      durationMs: 4200,
    });

    for (let i = 0; i < 5; i += 1) {
      await recordWritingAttempt({
        character: '好',
        mode: 'guided',
        totalStrokes: 6,
        strokeMistakes: {},
        durationMs: 2100,
      });
    }

    const { logs, masteryList, mostMistakenCharacters } =
      await getWritingHistoryAndMastery();

    assert.equal(logs.length, 6);
    assert.equal(masteryList.length, 2);
    assert.equal(computeMasteryTier(5, 95), 'calligrapher');
    assert.equal(mostMistakenCharacters[0].character, '图');
    assert.ok(mostMistakenCharacters[0].problematic_strokes['1'] >= 1);
  });

  it('defines hanzi_writing_logs and hanzi_character_mastery with RLS in SQL migration', () => {
    const sqlPath = path.join(
      process.cwd(),
      'supabase/migrations/20261112_2703_hanzi_writing_studio.sql'
    );
    const sql = fs.readFileSync(sqlPath, 'utf8');
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.hanzi_writing_logs'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.hanzi_character_mastery'));
    assert.ok(sql.includes('CONSTRAINT uq_hanzi_character_mastery UNIQUE (user_id, character)'));
    assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'));
  });
});

