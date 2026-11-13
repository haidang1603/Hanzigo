import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  computeOverallMastery,
  isTrueMastered,
  createSmartDailyLoopPlan,
} from '../src/core/ecosystem/useUnifiedEcosystemStore.ts';
import { listVocabItems } from '../src/services/vocabWorkspaceService.ts';
import { getBuiltInReadingArticles } from '../src/services/readingStudioService.ts';
import { getBuiltInListeningTracks } from '../src/services/listeningStudioService.ts';

test('computeOverallMastery calculates 0.4*M + 0.3*W + 0.3*P accurately', () => {
  // 0.4*80 + 0.3*90 + 0.3*70 = 32 + 27 + 21 = 80
  const score = computeOverallMastery(80, 90, 70);
  assert.equal(score, 80);

  // Clamping test
  const clamped = computeOverallMastery(100, 100, 100);
  assert.equal(clamped, 100);
});

test('isTrueMastered returns true only when all three components >= 80', () => {
  assert.equal(isTrueMastered(80, 80, 80), true);
  assert.equal(isTrueMastered(95, 85, 90), true);
  // Fails if writing is below 80 even with high meaning
  assert.equal(isTrueMastered(100, 75, 100), false);
  // Fails if pronunciation is below 80
  assert.equal(isTrueMastered(85, 85, 79), false);
});

test('createSmartDailyLoopPlan aggregates 4-step loop from vocab, reading and listening items', async () => {
  const vocabItems = await listVocabItems(null);
  const articles = getBuiltInReadingArticles();
  const tracks = getBuiltInListeningTracks();

  const plan = createSmartDailyLoopPlan(vocabItems, articles, tracks);
  assert.ok(plan.dueVocabItems.length > 0);
  assert.ok(plan.hardCharacters.length > 0);
  assert.ok(plan.pronunciationTargets.length > 0);
  assert.ok(plan.recommendedArticle !== null);
  assert.ok(plan.recommendedTrack !== null);
});

test('unified ecosystem SQL migration defines unified_learning_events, columns and trigger', () => {
  const sqlPath = path.resolve('supabase/migrations/20261112_2708_unified_ecosystem.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.unified_learning_events/i);
  assert.match(sql, /overall_mastery/i);
  assert.match(sql, /is_true_mastered/i);
  assert.match(sql, /FUNCTION public\.sync_word_multidimensional_mastery/i);
  assert.match(sql, /CREATE TRIGGER trg_sync_word_multidimensional_mastery/i);
});

