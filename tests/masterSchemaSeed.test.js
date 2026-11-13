import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const migrationPath = path.resolve(
  'supabase/migrations/20261113_master_seed_and_reconciliation_p27_29_30.sql',
);

test('20261113_master_seed_and_reconciliation_p27_29_30.sql exists and reconciles existing schemas', () => {
  assert.equal(fs.existsSync(migrationPath), true);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Reconciled columns on existing Phase 27 & 29 tables
  assert.match(sql, /ALTER TABLE public\.reading_articles\s+ADD COLUMN IF NOT EXISTS slug TEXT/i);
  assert.match(sql, /ALTER TABLE public\.listening_tracks\s+ADD COLUMN IF NOT EXISTS slug TEXT/i);
  assert.match(sql, /ALTER TABLE public\.pronunciation_drills\s+ADD COLUMN IF NOT EXISTS code TEXT/i);
  assert.match(sql, /ALTER TABLE public\.textbook_units\s+ADD COLUMN IF NOT EXISTS unit_grammar_codes TEXT\[\]/i);
  assert.match(sql, /CREATE INDEX IF NOT EXISTS idx_dict_entries_simplified/i);
  assert.doesNotMatch(sql, /uq_dict_entries_simplified/i);

  // New grammar_points table
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.grammar_points/i);

  // Seed data inserts across Phase 27 & 29
  assert.match(sql, /WITH seed_dict/i);
  assert.match(sql, /INSERT INTO public\.dictionary_entries/i);
  assert.match(sql, /INSERT INTO public\.grammar_points/i);
  assert.match(sql, /INSERT INTO public\.reading_articles/i);
  assert.match(sql, /INSERT INTO public\.listening_tracks/i);
  assert.match(sql, /INSERT INTO public\.pronunciation_drills/i);
  assert.match(sql, /INSERT INTO public\.chengyu_entries/i);
  assert.match(sql, /INSERT INTO public\.specialized_domain_packs/i);
  assert.match(sql, /INSERT INTO public\.textbook_series/i);
  assert.match(sql, /INSERT INTO public\.textbook_units\s*\(\s*series_id,/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.vocab_decks/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_vocab_items/i);

  // RPC function
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.update_vocab_dimension_score/i);
});

test('verifyAndSeedEcosystemDatabase summarizes table counts and errors cleanly', async () => {
  const { verifyAndSeedEcosystemDatabase } = await import('../src/scripts/seedAllEcosystemData.ts');

  const unconfigured = await verifyAndSeedEcosystemDatabase(null);
  assert.equal(unconfigured.status, 'partial_error');
  assert.equal(unconfigured.errors.length, 1);

  const mockSuccessClient = {
    from(table) {
      const counts = {
        dictionary_entries: 120,
        grammar_points: 15,
        reading_articles: 8,
        listening_tracks: 6,
        hsk_question_bank: 417,
      };
      return {
        async select() {
          return { count: counts[table] ?? 0, error: null };
        },
      };
    },
  };

  const okSummary = await verifyAndSeedEcosystemDatabase(mockSuccessClient);
  assert.deepEqual(okSummary, {
    dictionaryCount: 120,
    grammarCount: 15,
    readingCount: 8,
    listeningCount: 6,
    hskQuestionsCount: 417,
    status: 'success',
    errors: [],
  });

  const mockPartialErrorClient = {
    from(table) {
      return {
        async select() {
          if (table === 'grammar_points') {
            return { count: null, error: { message: 'permission denied' } };
          }
          return { count: 10, error: null };
        },
      };
    },
  };

  const errSummary = await verifyAndSeedEcosystemDatabase(mockPartialErrorClient);
  assert.equal(errSummary.status, 'partial_error');
  assert.equal(errSummary.grammarCount, 0);
  assert.equal(errSummary.dictionaryCount, 10);
  assert.deepEqual(errSummary.errors, ['Grammar Table: permission denied']);
});

test('normalizeListeningQuestions converts object options and correct_answer safely', async () => {
  const { normalizeListeningQuestions } = await import('../src/services/listeningStudioService.ts');

  const normalized = normalizeListeningQuestions([
    {
      question_number: 1,
      question_zh: '男的为什么觉得紧张？',
      options: { A: '简历还没写好', B: '明天要去参加面试', C: '迟到了' },
      correct_answer: 'B',
      explanation_vi: 'Vì ngày mai đi phỏng vấn.',
    },
  ]);

  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].id, 'lq-1');
  assert.deepEqual(normalized[0].options, [
    'A. 简历还没写好',
    'B. 明天要去参加面试',
    'C. 迟到了',
  ]);
  assert.equal(normalized[0].correct_index, 1);
  assert.equal(normalized[0].evidence_segment_index, 0);
});
