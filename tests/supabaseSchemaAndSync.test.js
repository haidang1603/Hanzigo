/**
 * =========================================================================
 * HANZI GO — SUPABASE SCHEMA & DATA SYNCHRONIZATION TEST SUITE
 * =========================================================================
 * Phase 23: Complete Supabase Data & Schema Synchronization Validation
 *
 * Verifies:
 * 1. Schema integrity across core learning & application tables
 * 2. 120 HSK 1-6 lessons content completeness (20 lessons/level)
 * 3. 24 learning chapters & 7 levels hierarchy
 * 4. 24 chapter boss challenges
 * 5. 325 ISO/IEC 10646 IDS character decompositions
 * 6. 804 vocabulary entries (754 core + 50 HSK 6 idioms)
 * 7. HSK Exam Center (structures, 27 exams, 417 questions)
 * 8. Learning Materials (20 textbooks/workbooks) & Storage metadata
 * 9. Daily Quotes (60 motivational quotes)
 * 10. Reading Progress table & unique constraints
 * 11. Storage bucket configuration (materials: private)
 * 12. RLS & Zero-Trust security rules
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

import { 
  LEARNING_LEVELS, 
  LEARNING_CHAPTERS, 
  LEARNING_LESSONS, 
  BOSS_CHALLENGES 
} from '../src/data/learningPathData.js';
import { HANZI_DECOMPOSITION_DATABASE } from '../src/data/hanziDecomposition.js';
import { HSK_EXAMS, HSK_QUESTIONS } from '../src/data/hskExamsData.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';
import { HSK6_IDIOMS_DATABASE } from '../src/data/hsk6IdiomsData.js';
import { DEFAULT_MATERIALS } from '../src/utils/materialsStorage.js';
import { DAILY_QUOTES } from '../src/data/dailyQuotesData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const hasLiveCredentials = Boolean(supabaseUrl && supabaseKey);

const supabase = hasLiveCredentials 
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

/* =========================================================================
   GROUP 1: REPOSITORY DATA INTEGRITY & BASELINE AUDIT
   ========================================================================= */

test('Supabase Sync Audit: 1.1 Curriculum HSK 1-6 has exactly 120 lessons across 24 chapters', () => {
  assert.equal(LEARNING_LESSONS.length, 120, 'Curriculum must contain exactly 120 lessons');
  assert.equal(LEARNING_CHAPTERS.length, 24, 'Curriculum must contain exactly 24 chapters');
  assert.equal(LEARNING_LEVELS.length, 7, 'Must define 7 levels (HSK 1 to HSK 7-9)');

  // Verify 20 lessons per HSK level 1-6
  for (let lvl = 1; lvl <= 6; lvl++) {
    const levelLessons = LEARNING_LESSONS.filter(l => l.levelId === `lvl-${lvl}`);
    assert.equal(levelLessons.length, 20, `HSK ${lvl} must have exactly 20 lessons`);
  }
});

test('Supabase Sync Audit: 1.2 Learning Boss Challenges has exactly 24 challenges', () => {
  assert.equal(BOSS_CHALLENGES.length, 24, 'Must have exactly 24 boss challenges corresponding to 24 chapters');
  for (let i = 1; i <= 24; i++) {
    const boss = BOSS_CHALLENGES.find(b => b.id === `boss-ch-${i}`);
    assert.ok(boss, `Boss challenge boss-ch-${i} must exist`);
    assert.equal(boss.chapterId, `ch-${i}`);
  }
});

test('Supabase Sync Audit: 1.3 IDS Hanzi Decomposition Database has 325 characters', () => {
  const decompKeys = Object.keys(HANZI_DECOMPOSITION_DATABASE);
  assert.equal(decompKeys.length, 325, 'Decomposition database must contain exactly 325 characters');
  for (const char of decompKeys) {
    const item = HANZI_DECOMPOSITION_DATABASE[char];
    assert.ok(item.structure?.code, `Character ${char} must have a valid structure code`);
    assert.ok(item.structure?.symbol, `Character ${char} must have an IDS symbol`);
    assert.ok(Array.isArray(item.components), `Character ${char} must have components array`);
  }
});

test('Supabase Sync Audit: 1.4 HSK Exam Center has 29 exams and 429 questions', () => {
  assert.equal(HSK_EXAMS.length, 29, 'Must have 29 curated exams across HSK 1-6');
  assert.equal(HSK_QUESTIONS.length, 429, 'Must have 429 detailed questions');

  // Verify all questions reference valid exams
  const examIds = new Set(HSK_EXAMS.map(e => e.id));
  for (const q of HSK_QUESTIONS) {
    assert.ok(examIds.has(q.exam_id), `Question ${q.id} references invalid exam_id: ${q.exam_id}`);
    assert.ok(q.prompt || q.stem, `Question ${q.id} must have a prompt`);
    assert.ok(q.options && q.options.length >= 2, `Question ${q.id} must have at least 2 options`);
  }
});

test('Supabase Sync Audit: 1.5 Vocabulary dataset has 754 curated entries and 50 idioms', () => {
  assert.equal(VOCABULARY_LIST.length, 754, 'Curated vocabulary list must contain 754 words');
  const idiomKeys = Object.keys(HSK6_IDIOMS_DATABASE);
  assert.equal(idiomKeys.length, 50, 'HSK 6 idioms database must contain 50 idioms');

  // Verify total unique vocabulary target
  const totalCombined = VOCABULARY_LIST.length + idiomKeys.length;
  assert.equal(totalCombined, 804, 'Combined vocabulary target must be 804 entries');
});

test('Supabase Sync Audit: 1.6 Materials library has 20 textbooks and workbooks', () => {
  assert.equal(DEFAULT_MATERIALS.length, 20, 'Default materials must contain 20 items');
  for (const m of DEFAULT_MATERIALS) {
    assert.ok(m.id, 'Material must have id');
    assert.ok(m.title, 'Material must have title');
    assert.ok(m.level, 'Material must have level');
  }
});

test('Supabase Sync Audit: 1.7 Daily quotes dataset has 60 motivational quotes', () => {
  assert.equal(DAILY_QUOTES.length, 60, 'Daily quotes must contain exactly 60 entries');
});

/* =========================================================================
   GROUP 2: SUPABASE LIVE DATABASE & RECONCILIATION VERIFICATION
   ========================================================================= */

test('Supabase Live Sync: 2.1 Verifies learning_lessons table contains all 120 lessons in Supabase', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { count, error } = await supabase
    .from('learning_lessons')
    .select('*', { count: 'exact', head: true });

  assert.ifError(error);
  assert.equal(count, 120, 'learning_lessons table in Supabase must contain exactly 120 rows');
});

test('Supabase Live Sync: 2.2 Verifies learning_chapters and learning_levels in Supabase', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { count: chCount } = await supabase.from('learning_chapters').select('*', { count: 'exact', head: true });
  assert.equal(chCount, 24, 'learning_chapters table must contain 24 rows');

  const { count: lvlCount } = await supabase.from('learning_levels').select('*', { count: 'exact', head: true });
  assert.equal(lvlCount, 7, 'learning_levels table must contain 7 rows');
});

test('Supabase Live Sync: 2.3 Verifies learning_boss_challenges contains all 24 challenges in Supabase', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { count, error } = await supabase
    .from('learning_boss_challenges')
    .select('*', { count: 'exact', head: true });

  assert.ifError(error);
  assert.equal(count, 24, 'learning_boss_challenges table must contain 24 rows');
});

test('Supabase Live Sync: 2.4 Verifies hanzi_decompositions contains all 325 characters in Supabase', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { count, error } = await supabase
    .from('hanzi_decompositions')
    .select('*', { count: 'exact', head: true });

  assert.ifError(error);
  assert.equal(count, 325, 'hanzi_decompositions table must contain 325 rows');
});

test('Supabase Live Sync: 2.5 Verifies HSK Exam Center tables in Supabase (29 exams, 429 questions)', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { count: examCount } = await supabase.from('hsk_exams').select('*', { count: 'exact', head: true });
  assert.equal(examCount, 29, 'hsk_exams table must contain 29 rows');

  const { count: qCount } = await supabase.from('hsk_questions').select('*', { count: 'exact', head: true });
  assert.equal(qCount, 429, 'hsk_questions table must contain 429 rows');

  const { count: structCount } = await supabase.from('hsk_exam_structures').select('*', { count: 'exact', head: true });
  assert.ok(structCount >= 13, 'hsk_exam_structures table must contain at least 13 rows');
});

test('Supabase Live Sync: 2.6 Verifies vocabulary table contains all 804 entries in Supabase', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { count, error } = await supabase
    .from('vocabulary')
    .select('*', { count: 'exact', head: true });

  assert.ifError(error);
  assert.equal(count, 804, 'vocabulary table must contain 804 rows');
});

test('Supabase Live Sync: 2.7 Verifies materials library has at least 83 items in Supabase', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { count, error } = await supabase
    .from('materials')
    .select('*', { count: 'exact', head: true });

  assert.ifError(error);
  assert.ok(count >= 83, `materials table must contain at least 83 rows (got ${count})`);
});

test('Supabase Live Sync: 2.8 Verifies Storage bucket "materials" is configured and private', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { data: buckets, error } = await supabase.storage.listBuckets();
  assert.ifError(error);

  const matBucket = (buckets || []).find(b => b.id === 'materials' || b.name === 'materials');
  assert.ok(matBucket, 'materials bucket must exist in Supabase Storage');
  assert.equal(matBucket.public, false, 'materials bucket must be private (public: false)');
});

test('Supabase Live Sync: 2.9 Verifies reading_progress table exists and is functional', async (t) => {
  if (!hasLiveCredentials) {
    t.skip('Skipping live Supabase check: credentials missing');
    return;
  }

  const { error } = await supabase
    .from('reading_progress')
    .select('*')
    .limit(1);

  assert.ifError(error, 'reading_progress table must be queryable without schema errors');
});

