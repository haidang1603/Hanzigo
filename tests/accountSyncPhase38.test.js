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
    _dumpKeys() {
      return Array.from(store.keys());
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

const {
  getUserStorageKey,
  clearLegacyUnscopedLearningKeys,
  LEGACY_UNSCOPED_LEARNING_KEYS,
} = await import('../src/utils/gamification.js');
const {
  getPendingSyncItems,
  enqueueOfflineMutation,
  flushOfflineQueueToSupabase,
  exportUserLearningSnapshot,
  getScopedSyncQueueKey,
} = await import('../src/core/sync/OfflineSyncManager.js');
const {
  saveTemporaryAnswers,
  getTemporaryAnswers,
  getMistakeNotebook,
  getUserExamHistory,
  mergeLocalAttemptsToUser,
} = await import('../src/services/hskService.js');
const {
  trackLearningEvent,
  getTelemetryBuffer,
  clearTelemetryLocalState,
} = await import('../src/core/telemetry/learningTelemetryService.js');

const USER_A = { id: '11111111-1111-4111-8111-111111111111', email: 'usera@example.com' };
const USER_B = { id: '22222222-2222-4222-8222-222222222222', email: 'userb@example.com' };

test('Phase 38.03 (1): Logout & clearLegacyUnscopedLearningKeys purge all global learning keys and drafts', () => {
  localStorage.clear();

  for (const key of LEGACY_UNSCOPED_LEARNING_KEYS) {
    localStorage.setItem(key, JSON.stringify(['legacy-data']));
  }
  localStorage.setItem('hanzigo_hsk_draft_hsk1-mock-01', JSON.stringify({ answers: { q1: 0 } }));
  localStorage.setItem(getUserStorageKey('hanzigo_completed_lessons', USER_A), JSON.stringify(['l-101']));

  clearLegacyUnscopedLearningKeys();

  for (const key of LEGACY_UNSCOPED_LEARNING_KEYS) {
    assert.equal(localStorage.getItem(key), null, `Expected legacy key ${key} to be removed`);
  }
  assert.equal(localStorage.getItem('hanzigo_hsk_draft_hsk1-mock-01'), null);
  assert.deepEqual(
    JSON.parse(localStorage.getItem(getUserStorageKey('hanzigo_completed_lessons', USER_A))),
    ['l-101'],
    'Scoped User A key should remain isolated in storage under User A namespace'
  );
});

test('Phase 38.03 (2): HSK drafts, mistakes, and attempt history are strictly isolated per user (no guest leak)', async () => {
  localStorage.clear();

  // Seed a Guest mistake and Guest attempt in legacy/guest storage
  localStorage.setItem(
    getUserStorageKey('hanzigo_hsk_mistakes', { id: 'guest' }),
    JSON.stringify([
      {
        id: 'm-guest-1',
        questionId: 'q-guest-1',
        userId: null,
        anonymousSessionId: 'anon-1',
        level: 'HSK 1',
        partType: 'reading',
        status: 'active',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ])
  );
  localStorage.setItem(
    getUserStorageKey('hanzigo_hsk_attempts', { id: 'guest' }),
    JSON.stringify([
      {
        id: 'att-guest-1',
        userId: null,
        anonymousSessionId: 'anon-1',
        examId: 'hsk1-mock-01',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ])
  );

  // User A saves an exam draft
  saveTemporaryAnswers('hsk1-mock-01', { q1: 2 }, { user: USER_A });
  assert.deepEqual(getTemporaryAnswers('hsk1-mock-01', USER_A), { q1: 2 });
  assert.equal(getTemporaryAnswers('hsk1-mock-01', USER_B), null, 'User B must not see User A draft');

  // Authenticated User B must NOT inherit Guest (userId === null) mistakes or attempts
  const userBMistakes = await getMistakeNotebook({ user: USER_B });
  assert.equal(userBMistakes.length, 0, 'User B must not inherit guest mistakes');

  const userBAttempts = await getUserExamHistory({ user: USER_B });
  assert.equal(userBAttempts.length, 0, 'User B must not inherit guest attempts');

  // Explicit mergeLocalAttemptsToUser transfers Guest records only to the target user
  const mergeRes = await mergeLocalAttemptsToUser(USER_A.id);
  assert.equal(mergeRes.success, true);
  assert.equal(mergeRes.mergedCount, 1);

  const userAAttempts = await getUserExamHistory({ user: USER_A });
  assert.equal(userAAttempts.length, 1);
  assert.equal(userAAttempts[0].userId, USER_A.id);
});

test('Phase 38.03 (3): OfflineSyncManager isolates queues by userId and deduplicates idempotencyKey', async () => {
  localStorage.clear();

  enqueueOfflineMutation(
    {
      type: 'srs_card',
      table: 'user_vocab_srs',
      action: 'upsert',
      onConflict: 'user_id,hanzi',
      idempotencyKey: `srs:${USER_A.id}:好`,
      payload: { user_id: USER_A.id, hanzi: '好', interval: 1 },
    },
    USER_A
  );
  // Duplicate update for same idempotencyKey should update in-place
  enqueueOfflineMutation(
    {
      type: 'srs_card',
      table: 'user_vocab_srs',
      action: 'upsert',
      onConflict: 'user_id,hanzi',
      idempotencyKey: `srs:${USER_A.id}:好`,
      payload: { user_id: USER_A.id, hanzi: '好', interval: 6 },
    },
    USER_A
  );
  enqueueOfflineMutation(
    {
      type: 'srs_card',
      table: 'user_vocab_srs',
      action: 'upsert',
      onConflict: 'user_id,hanzi',
      idempotencyKey: `srs:${USER_B.id}:学`,
      payload: { user_id: USER_B.id, hanzi: '学', interval: 3 },
    },
    USER_B
  );

  assert.notEqual(getScopedSyncQueueKey(USER_A), getScopedSyncQueueKey(USER_B));
  const queueA = getPendingSyncItems(USER_A);
  const queueB = getPendingSyncItems(USER_B);
  assert.equal(queueA.length, 1, 'Idempotency key should prevent duplicate queue items');
  assert.equal(queueA[0].payload.interval, 6, 'Latest payload should win on idempotency collision');
  assert.equal(queueB.length, 1);

  const upsertCalls = [];
  const mockSupabase = {
    from(table) {
      return {
        async upsert(payload, opts) {
          upsertCalls.push({ table, payload, opts });
          return { error: null };
        },
        async insert(payload) {
          upsertCalls.push({ table, payload });
          return { error: null };
        },
      };
    },
  };

  const flushRes = await flushOfflineQueueToSupabase(mockSupabase, USER_A);
  assert.equal(flushRes.syncedCount, 1);
  assert.equal(flushRes.remainingCount, 0);
  assert.equal(upsertCalls.length, 1);
  assert.deepEqual(upsertCalls[0].opts, { onConflict: 'user_id,hanzi' });
  assert.equal(getPendingSyncItems(USER_B).length, 1, 'Flushing User A must not touch User B queue');
});

test('Phase 38.03 (4): Telemetry buffer & GDPR snapshot export are strictly isolated per user', async () => {
  localStorage.clear();
  clearTelemetryLocalState(USER_A);
  clearTelemetryLocalState(USER_B);

  trackLearningEvent({ userId: USER_A.id, eventType: 'vocab_review', itemId: '好' }, { user: USER_A });
  assert.equal(getTelemetryBuffer(USER_A).length, 1);
  assert.equal(getTelemetryBuffer(USER_B).length, 0);

  clearTelemetryLocalState(USER_B);
  localStorage.setItem(getUserStorageKey('hanzigo_completed_lessons', USER_A), JSON.stringify(['l-101']));
  localStorage.setItem(getUserStorageKey('hanzigo_completed_lessons', USER_B), JSON.stringify(['l-201']));

  const mockSupabase = {
    auth: {
      async getUser() {
        return { data: { user: USER_B } };
      },
    },
    from() {
      return {
        select() {
          return {
            async eq() {
              return { data: [] };
            },
          };
        },
      };
    },
  };

  const snapshotB = await exportUserLearningSnapshot(mockSupabase, USER_B);
  const exportedKeys = Object.keys(snapshotB.local_storage);
  assert.ok(
    exportedKeys.some((k) => k.endsWith(`_${USER_B.id}`)),
    'GDPR export should include User B scoped keys'
  );
  assert.ok(
    !exportedKeys.some((k) => k.endsWith(`_${USER_A.id}`)),
    'GDPR export for User B must NEVER include User A scoped keys'
  );
});

test('Phase 38.03 (5): Static regression checks for DQ-CRIT-01 and DQ-CRIT-02 fixes', () => {
  const root = path.resolve(process.cwd());

  const progressSrc = fs.readFileSync(path.join(root, 'src/services/progressService.js'), 'utf8');
  assert.ok(
    !progressSrc.includes("localStorage.getItem('hanzigo_vocab_remembered')"),
    'progressService.js must not read unscoped hanzigo_vocab_remembered'
  );
  assert.ok(
    !progressSrc.includes("localStorage.getItem('hanzigo_completed_lessons')"),
    'progressService.js must not read unscoped hanzigo_completed_lessons'
  );
  assert.ok(
    !progressSrc.includes("localStorage.setItem('hanzigo_shared_profiles_cache'"),
    'progressService.js must not write hanzigo_shared_profiles_cache'
  );

  const vocabSrc = fs.readFileSync(path.join(root, 'src/services/vocabularyService.js'), 'utf8');
  assert.ok(
    !vocabSrc.includes("localStorage.setItem('hanzigo_vocab_srs_state'"),
    'vocabularyService.js must not mirror SRS state to unscoped global key'
  );
  assert.ok(
    !vocabSrc.includes("localStorage.setItem('hanzigo_vocab_remembered'"),
    'vocabularyService.js must not mirror remembered words to unscoped global key'
  );

  const gamificationSrc = fs.readFileSync(path.join(root, 'src/utils/gamification.js'), 'utf8');
  assert.ok(
    !gamificationSrc.includes("localStorage.setItem('hanzigo_shared_profiles_cache'"),
    'gamification.js must not write hanzigo_shared_profiles_cache'
  );

  const workspaceSrc = fs.readFileSync(path.join(root, 'src/services/vocabWorkspaceService.ts'), 'utf8');
  assert.ok(
    workspaceSrc.includes('getDecksStorageKey') && workspaceSrc.includes('getItemsStorageKey'),
    'vocabWorkspaceService.ts must scope decks and items per user'
  );

  const dsrModalSrc = fs.readFileSync(path.join(root, 'src/components/DataSubjectRequestModal.jsx'), 'utf8');
  assert.ok(
    dsrModalSrc.includes('getUserStorageKey') && dsrModalSrc.includes("'hanzigo_hsk_attempts'"),
    'DataSubjectRequestModal.jsx must export user-scoped keys and read hanzigo_hsk_attempts'
  );
  assert.ok(
    !dsrModalSrc.includes("'hanzigo_hsk_exam_history'"),
    'DataSubjectRequestModal.jsx must not reference non-existent hanzigo_hsk_exam_history key'
  );
});
