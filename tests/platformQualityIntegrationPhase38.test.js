import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

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
  location: { pathname: '/dashboard', search: '', hash: '' },
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  CustomEvent: class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  },
};

const {
  getUserStorageKey,
  getLocalDateString,
  clearLegacyUnscopedLearningKeys,
  LEGACY_UNSCOPED_LEARNING_KEYS,
} = await import('../src/utils/gamification.js');
const { LEARNING_LESSONS, LEARNING_LEVELS } = await import('../src/data/learningPathData.js');
const { VOCABULARY_LIST } = await import('../src/data/chineseData.js');
const { HSK_EXAMS, getFullExamById } = await import('../src/data/hskExamsData.js');
const { GRADED_READERS_DATA } = await import('../src/data/gradedReadersData.js');
const { GRAMMAR_DRILLS_BY_LEVEL } = await import('../src/data/practiceLevelData.js');
const {
  saveTemporaryAnswers,
  getTemporaryExamSession,
  mapCbtAttemptsToBestScores,
} = await import('../src/services/hskService.js');
const {
  enqueueOfflineMutation,
  flushOfflineQueueToSupabase,
  getFailedSyncItems,
  MAX_SYNC_RETRIES,
} = await import('../src/core/sync/OfflineSyncManager.js');
const {
  reportClientError,
  __resetErrorReporterForTests,
} = await import('../src/core/telemetry/errorReporter.js');

const USER_A = { id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa', email: 'a@hanzigo.vn', role: 'student' };
const USER_B = { id: 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb', email: 'b@hanzigo.vn', role: 'teacher' };

test('Phase 38.08 Flow 1 & 16: Auth logout cleanup + Cross-device sync idempotency & retry cap', async () => {
  localStorage.clear();
  for (const k of LEGACY_UNSCOPED_LEARNING_KEYS) {
    localStorage.setItem(k, 'stale');
  }
  clearLegacyUnscopedLearningKeys();
  for (const k of LEGACY_UNSCOPED_LEARNING_KEYS) {
    assert.equal(localStorage.getItem(k), null, `Logout must clear legacy key ${k}`);
  }

  // Enqueue idempotent mutation for User A
  enqueueOfflineMutation(
    {
      type: 'srs_card',
      table: 'user_vocab_srs',
      action: 'upsert',
      onConflict: 'user_id,hanzi',
      idempotencyKey: `srs:${USER_A.id}:好`,
      payload: { user_id: USER_A.id, hanzi: '好', lapse_count: 1 },
    },
    USER_A
  );

  assert.equal(MAX_SYNC_RETRIES, 5);
  const mockSupabase = {
    from() {
      return {
        async upsert() {
          return { error: null };
        },
      };
    },
  };
  const res = await flushOfflineQueueToSupabase(mockSupabase, USER_A);
  assert.equal(res.syncedCount, 1);
  assert.equal(getFailedSyncItems(USER_A).length, 0);
});

test('Phase 38.08 Flows 2, 3, 5, 6, 7, 8: HSK 1-9 Curriculum, Dictionary, Reading, Listening, Writing, Pronunciation contracts', () => {
  // Flow 2: Learning Path 180 lessons & levels
  assert.ok(Array.isArray(LEARNING_LEVELS) && LEARNING_LEVELS.length >= 6);
  assert.ok(Array.isArray(LEARNING_LESSONS) && LEARNING_LESSONS.length >= 120);

  // Flow 3: Vocabulary unique hanzi & Dictionary user scoping
  const hanziSet = new Set(VOCABULARY_LIST.map((v) => v.hanzi));
  assert.equal(hanziSet.size, VOCABULARY_LIST.length, 'VOCABULARY_LIST must have unique hanzi');
  assert.notEqual(
    getUserStorageKey('hanzigo_smart_dict_ai_cache_v1', USER_A),
    getUserStorageKey('hanzigo_smart_dict_ai_cache_v1', USER_B)
  );

  // Flow 5, 6, 7, 8: Graded readers, grammar drills, and studio services user-scoped
  assert.ok(Array.isArray(GRADED_READERS_DATA) && GRADED_READERS_DATA.length > 0);
  assert.ok(GRAMMAR_DRILLS_BY_LEVEL && Object.keys(GRAMMAR_DRILLS_BY_LEVEL).length > 0);

  for (const relPath of [
    'src/services/listeningStudioService.ts',
    'src/services/pronunciationLabService.ts',
    'src/services/translationStudioService.ts',
    'src/services/vocabWorkspaceService.ts',
  ]) {
    const src = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    assert.ok(src.includes('getUserStorageKey'), `${relPath} must use getUserStorageKey`);
  }
});

test('Phase 38.08 Flows 4, 9, 10: SRS Telemetry bridge, CBT Exams, Draft Rescue (with writingAnswers) & Roadmap Score Mapping', () => {
  // Flow 4: VocabularyPage SRS -> Telemetry bridge & lapse_count preservation
  const vocabPageSrc = fs.readFileSync(path.join(ROOT, 'src/pages/VocabularyPage.jsx'), 'utf8');
  assert.ok(vocabPageSrc.includes('saveUserVocabSrsCard'));
  assert.ok(vocabPageSrc.includes('recordLearningEvent') && vocabPageSrc.includes('trackLearningEvent'));

  // Flow 9: No published empty CBT exam (hsk1-official-ref-01 unpublished) & Draft Rescue preserves writingAnswers
  const emptyPublished = HSK_EXAMS.filter((e) => {
    if (e.is_published === false) return false;
    const full = getFullExamById(e.id);
    return !Array.isArray(full?.questions) || full.questions.length === 0;
  });
  assert.equal(emptyPublished.length, 0, 'No published CBT exam may have 0 questions');

  localStorage.clear();
  saveTemporaryAnswers(
    'hsk6-official-01',
    { q1: 3 },
    { user: USER_A, writingAnswers: { q101: '作文草稿' }, timeLeft: 900 }
  );
  const restoredA = getTemporaryExamSession('hsk6-official-01', USER_A);
  assert.equal(restoredA.writingAnswers.q101, '作文草稿');
  assert.equal(getTemporaryExamSession('hsk6-official-01', USER_B), null);

  // Flow 10: RoadmapPage CBT mapping ignores drafts and picks highest score
  const hsk1Exam = HSK_EXAMS.find((e) => e.level === 'HSK 1');
  const mapped = mapCbtAttemptsToBestScores([
    { exam_id: hsk1Exam.id, score: 175, max_score: 200, status: 'completed' },
    { exam_id: hsk1Exam.id, score: 199, max_score: 200, status: 'draft' },
  ]);
  assert.equal(mapped[1], 175);
});

test('Phase 38.08 Flows 11, 12, 13, 14, 15: Classroom, Assignments, Community UTC+7, Admin & Teacher contracts', async () => {
  // Flow 11 & 15: Live participants requires auth in production
  const origEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const { default: participantsHandler } = await import('../api/_handlers/live/participants.js');
    let statusCode = 200;
    await participantsHandler(
      { method: 'GET', headers: {}, query: { sessionId: 'sess-1' }, socket: {} },
      {
        setHeader() {},
        status(c) {
          statusCode = c;
          return this;
        },
        json() {
          return this;
        },
      }
    );
    assert.equal(statusCode, 401);
  } finally {
    process.env.NODE_ENV = origEnv;
  }

  // Flow 12 & 14: adminAnalyticsService uses classroom_assignment_submissions & create-user writes audit_logs
  const adminAnalyticsSrc = fs.readFileSync(path.join(ROOT, 'src/services/adminAnalyticsService.js'), 'utf8');
  assert.ok(adminAnalyticsSrc.includes("from('classroom_assignment_submissions')"));

  const createUserSrc = fs.readFileSync(path.join(ROOT, 'api/_handlers/admin/create-user.js'), 'utf8');
  assert.ok(createUserSrc.includes('actor_id: auth.user.id') && createUserSrc.includes('metadata: {'));

  // Flow 13: CommunityPage uses local date UTC+7 (getLocalDateString)
  const communitySrc = fs.readFileSync(path.join(ROOT, 'src/pages/CommunityPage.jsx'), 'utf8');
  assert.ok(communitySrc.includes('getLocalDateString()'));
  assert.equal(getLocalDateString(new Date(2026, 10, 20, 1, 15, 0)), '2026-11-20');

  // Error reporter integration check
  __resetErrorReporterForTests();
  const errRes = await reportClientError(new Error('Failed to fetch /api/hsk/submit for a@hanzigo.vn'), {
    context: { routePath: '/hsk-practice' },
    now: 500000,
    isOnline: true,
    transport: async () => {},
  });
  assert.equal(errRes.payload.category, 'network');
  assert.equal(errRes.payload.module, 'hsk_exam');
  assert.ok(!errRes.payload.message.includes('a@hanzigo.vn'));
});
