import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function createMockStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(String(key));
    },
    clear() {
      store.clear();
    },
  };
}

globalThis.localStorage = createMockStorage();
globalThis.sessionStorage = createMockStorage();
globalThis.window = {
  localStorage: globalThis.localStorage,
  sessionStorage: globalThis.sessionStorage,
  dispatchEvent: () => {},
  CustomEvent: class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  },
};

const { getLocalDateString, getUserStorageKey, LEGACY_UNSCOPED_LEARNING_KEYS } = await import(
  '../src/utils/gamification.js'
);
const { mapCbtAttemptsToBestScores } = await import('../src/services/hskService.js');
const { HSK_EXAMS } = await import('../src/data/hskExamsData.js');

test('Phase 38.04 (1): RoadmapPage maps hsk_attempts (exam_id, score) to HSK levels without jumping/missing & SQL column fixes verified', () => {
  const sampleExams = [
    ...HSK_EXAMS,
    { id: 'hsk79-official-01', level: 'HSK 7-9' },
  ];
  const hsk1Exam = HSK_EXAMS.find((e) => e.level === 'HSK 1');
  const hsk2Exam = HSK_EXAMS.find((e) => e.level === 'HSK 2');
  assert.ok(hsk1Exam && hsk2Exam, 'Expected HSK 1 and HSK 2 exams in HSK_EXAMS');

  const attempts = [
    { exam_id: hsk1Exam.id, score: 150, max_score: 200 },
    { exam_id: hsk1Exam.id, score: 185, max_score: 200 },
    { exam_id: hsk2Exam.id, score: 190, max_score: 200, status: 'draft' }, // must be ignored!
    { exam_id: hsk2Exam.id, score: 140, max_score: 200, status: 'completed' },
    { exam_id: 'hsk79-official-01', score: 220, max_score: 300 },
  ];

  const mapped = mapCbtAttemptsToBestScores(attempts, sampleExams);
  assert.equal(mapped[1], 185, 'HSK 1 should pick highest score 185');
  assert.equal(mapped[2], 140, 'HSK 2 draft attempt must not unlock or count toward best score');
  assert.equal(mapped[3], undefined, 'Unattempted HSK 3 must remain undefined (no false level jump)');
  assert.equal(mapped[7], 220, 'HSK 7-9 should map to level 7');

  const root = path.resolve(process.cwd());
  const roadmapSrc = fs.readFileSync(path.join(root, 'src/pages/RoadmapPage.jsx'), 'utf8');
  assert.ok(
    roadmapSrc.includes(".select('exam_id, score, max_score')"),
    'RoadmapPage.jsx must query exam_id, score, max_score from hsk_attempts'
  );
  assert.ok(
    !roadmapSrc.includes('hsk_level, total_score'),
    'RoadmapPage.jsx must not reference non-existent hsk_level, total_score columns'
  );

  const adminSrc = fs.readFileSync(path.join(root, 'src/services/adminAnalyticsService.js'), 'utf8');
  assert.ok(
    adminSrc.includes("from('classroom_assignment_submissions')"),
    'adminAnalyticsService.js must query classroom_assignment_submissions'
  );
  assert.ok(
    !adminSrc.includes("from('submissions')"),
    'adminAnalyticsService.js must not query non-existent submissions table'
  );
  assert.ok(
    !adminSrc.includes('hanzigo_reading_progress_store'),
    'adminAnalyticsService.js must not read dead hanzigo_reading_progress_store key'
  );

  const tutorSrc = fs.readFileSync(path.join(root, 'api/_handlers/ai/tutor.js'), 'utf8');
  assert.ok(
    tutorSrc.includes(".select('level')"),
    'tutor.js must select level from profiles'
  );
  assert.ok(
    !tutorSrc.includes('hsk_level, target_hsk'),
    'tutor.js must not select non-existent hsk_level, target_hsk columns'
  );
});

test('Phase 38.04 (2): hskService preserves writing_answers and uses idempotent upsert on hsk_attempts', () => {
  const root = path.resolve(process.cwd());
  const hskSrc = fs.readFileSync(path.join(root, 'src/services/hskService.js'), 'utf8');

  assert.ok(
    hskSrc.includes('writing_answers: attempt.writingAnswers || attempt.writing_answers || {}'),
    'syncAttemptToSupabase must preserve writing_answers'
  );
  assert.ok(
    hskSrc.includes(".upsert(payload, { onConflict: 'id' })"),
    'syncAttemptToSupabase must use idempotent upsert on id'
  );
});

test('Phase 38.04 (3): vocabularyService preserves lapse_count in save & sync and handles pre-migration SQL safely', () => {
  const root = path.resolve(process.cwd());
  const vocabSrc = fs.readFileSync(path.join(root, 'src/services/vocabularyService.js'), 'utf8');

  assert.ok(
    vocabSrc.includes('lapse_count: lapseCount'),
    'saveUserVocabSrsCard must include lapse_count in payload'
  );
  assert.ok(
    vocabSrc.includes("error.code === '42703'") && vocabSrc.includes("includes('lapse_count')"),
    'saveUserVocabSrsCard must safely retry without lapse_count if SQL column is not yet migrated'
  );
  assert.ok(
    vocabSrc.includes('lapseCount: item.lapse_count ?? item.lapseCount ?? local?.lapseCount ?? 0'),
    'syncUserVocabSrsFromCloud must preserve lapseCount'
  );

  const migrationPath = path.join(root, 'supabase/migrations/20261119_3804_learning_progress_integrity.sql');
  assert.ok(fs.existsSync(migrationPath), 'Backward-compatible migration 20261119_3804 must exist');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(
    migrationSql.includes('ADD COLUMN IF NOT EXISTS lapse_count'),
    'Migration must add lapse_count with IF NOT EXISTS'
  );
  assert.ok(
    migrationSql.includes('ROLLBACK GUIDE'),
    'Migration must include rollback instructions'
  );
});

test('Phase 38.04 (4): Date keys stay consistent with local date (00:00-06:59 UTC+7 does not shift back to UTC yesterday)', () => {
  // Construct a Date matching 02:30 local time (same calendar day locally even if UTC is previous day)
  const localEarlyMorning = new Date(2026, 10, 20, 2, 30, 0); // 2026-11-20 02:30:00 local
  assert.equal(
    getLocalDateString(localEarlyMorning),
    '2026-11-20',
    'getLocalDateString must preserve local calendar day 2026-11-20'
  );

  const root = path.resolve(process.cwd());
  const filesToCheck = [
    'src/components/learning/AiLearningCoachWidget.jsx',
    'src/services/srsRetentionService.ts',
    'src/core/telemetry/learningTelemetryService.js',
    'src/features/analytics/studentAnalyticsService.ts',
    'src/pages/CommunityPage.jsx',
  ];

  for (const relPath of filesToCheck) {
    const src = fs.readFileSync(path.join(root, relPath), 'utf8');
    assert.ok(
      !src.includes('.toISOString().slice(0, 10)') && !src.includes(".toISOString().split('T')[0]"),
      `${relPath} must use getLocalDateString() instead of UTC toISOString() date slicing`
    );
  }
});

test('Phase 38.04 (5): dictionaryService.ts partitions all 3 keys per userId and registers legacy cleanup', () => {
  const root = path.resolve(process.cwd());
  const dictSrc = fs.readFileSync(path.join(root, 'src/services/dictionaryService.ts'), 'utf8');

  assert.ok(
    dictSrc.includes("getUserScopedKey(AI_CACHE_STORAGE_KEY"),
    'dictionaryService.ts must scope AI_CACHE_STORAGE_KEY per user'
  );
  assert.ok(
    dictSrc.includes('getUserStorageKey(base, user || null)'),
    'dictionaryService.ts getUserScopedKey must delegate to getUserStorageKey'
  );

  const expectedLegacyKeys = [
    'hanzigo_smart_dict_history_v1',
    'hanzigo_smart_dict_saved_deck_v1',
    'hanzigo_smart_dict_ai_cache_v1',
  ];
  for (const key of expectedLegacyKeys) {
    assert.ok(
      LEGACY_UNSCOPED_LEARNING_KEYS.includes(key),
      `LEGACY_UNSCOPED_LEARNING_KEYS must include ${key}`
    );
  }

  const userA = { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' };
  const userB = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' };
  assert.notEqual(
    getUserStorageKey('hanzigo_smart_dict_ai_cache_v1', userA),
    getUserStorageKey('hanzigo_smart_dict_ai_cache_v1', userB)
  );
});
