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
  location: { pathname: '/hsk-practice', search: '', hash: '' },
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
  reportClientError,
  sanitizeSensitiveText,
  classifyErrorCategory,
  inferSourceModule,
  __resetErrorReporterForTests,
} = await import('../src/core/telemetry/errorReporter.js');
const {
  enqueueOfflineMutation,
  flushOfflineQueueToSupabase,
  getPendingSyncItems,
  getFailedSyncItems,
} = await import('../src/core/sync/OfflineSyncManager.js');
const {
  saveTemporaryAnswers,
  getTemporaryExamSession,
} = await import('../src/services/hskService.js');
const { sendSafeServerError } = await import('../api/_utils/supabaseServer.js');

const USER_A = { id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa' };
const USER_B = { id: 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb' };

test('Phase 38.07 (1): Error Reporter redacts PII/secrets and deduplicates repeated errors in 60s window', async () => {
  __resetErrorReporterForTests();

  const raw =
    'Auth failed for student@example.com with Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.sig password="MySecret123" cookie=session_abc';
  const sanitized = sanitizeSensitiveText(raw);

  assert.ok(!sanitized.includes('student@example.com'), 'Email must be redacted');
  assert.ok(!sanitized.includes('eyJhbGciOiJIUzI1NiJ9'), 'JWT must be redacted');
  assert.ok(!sanitized.includes('MySecret123'), 'Password must be redacted');
  assert.ok(!sanitized.includes('session_abc'), 'Cookie must be redacted');

  const sentPayloads = [];
  const transport = async (p) => {
    sentPayloads.push(p);
  };

  const r1 = await reportClientError(new Error('Network timeout for user@test.com'), {
    now: 1000,
    isOnline: true,
    transport,
  });
  const r2 = await reportClientError(new Error('Network timeout for user@test.com'), {
    now: 25000,
    isOnline: true,
    transport,
  });
  const r3 = await reportClientError(new Error('Network timeout for user@test.com'), {
    now: 70000,
    isOnline: true,
    transport,
  });

  assert.equal(r1.status, 'sent');
  assert.equal(r2.status, 'deduped', 'Identical error within 60s must be deduplicated');
  assert.equal(r3.status, 'sent', 'Same error after 60s window should be sent again');
  assert.equal(sentPayloads.length, 2);
});

test('Phase 38.07 (2): Error Reporter classifies error categories and infers source module', async () => {
  __resetErrorReporterForTests();

  assert.equal(classifyErrorCategory(new Error('Failed to fetch resource')), 'network');
  assert.equal(classifyErrorCategory(new Error('PGRST116 relation missing')), 'database');
  assert.equal(classifyErrorCategory(new Error('401 Unauthorized JWT expired')), 'auth');
  assert.equal(classifyErrorCategory(new Error('QuotaExceededError on localStorage sync')), 'sync');
  assert.equal(
    classifyErrorCategory(new Error('Cannot read properties'), { componentStack: '<App />' }),
    'render'
  );

  assert.equal(inferSourceModule({}, '/hsk-practice'), 'hsk_exam');
  assert.equal(inferSourceModule({}, '/vocabulary'), 'vocabulary_srs');
  assert.equal(inferSourceModule({ module: 'custom_writer' }, '/'), 'custom_writer');

  const res = await reportClientError(new Error('PostgreSQL connection refused'), {
    context: { routePath: '/hsk-practice', module: 'hsk_exam' },
    now: 123456,
    isOnline: true,
    transport: async () => {},
  });
  assert.equal(res.payload.category, 'database');
  assert.equal(res.payload.module, 'hsk_exam');
});

test('Phase 38.07 (3): OfflineSyncManager enforces maxRetries cap, quarantines failing item, and continues syncing valid items', async () => {
  localStorage.clear();

  enqueueOfflineMutation(
    {
      type: 'bad_mutation',
      table: 'user_vocab_srs',
      action: 'upsert',
      onConflict: 'user_id,hanzi',
      idempotencyKey: `srs:${USER_A.id}:bad`,
      payload: { user_id: USER_A.id, hanzi: 'bad' },
    },
    USER_A
  );
  enqueueOfflineMutation(
    {
      type: 'good_mutation',
      table: 'user_vocab_srs',
      action: 'upsert',
      onConflict: 'user_id,hanzi',
      idempotencyKey: `srs:${USER_A.id}:好`,
      payload: { user_id: USER_A.id, hanzi: '好' },
    },
    USER_A
  );

  const mockSupabase = {
    from() {
      return {
        async upsert(payload) {
          if (payload.hanzi === 'bad') {
            return { error: { message: 'Permanent constraint violation' } };
          }
          return { error: null };
        },
      };
    },
  };

  // First flush: '好' succeeds immediately, 'bad' fails retry 1
  const res1 = await flushOfflineQueueToSupabase(mockSupabase, USER_A, {
    maxRetries: 3,
    ignoreBackoff: true,
  });
  assert.equal(res1.syncedCount, 1);
  assert.equal(res1.remainingCount, 1);
  assert.equal(res1.quarantinedCount, 0);

  // Retry 2
  const res2 = await flushOfflineQueueToSupabase(mockSupabase, USER_A, {
    maxRetries: 3,
    ignoreBackoff: true,
  });
  assert.equal(res2.remainingCount, 1);
  assert.equal(res2.quarantinedCount, 0);

  // Retry 3 -> hits maxRetries (3), moved to quarantine!
  const res3 = await flushOfflineQueueToSupabase(mockSupabase, USER_A, {
    maxRetries: 3,
    ignoreBackoff: true,
  });
  assert.equal(res3.remainingCount, 0, 'Quarantined item must leave active retry queue');
  assert.equal(res3.quarantinedCount, 1);

  assert.equal(getPendingSyncItems(USER_A).length, 0);
  const failed = getFailedSyncItems(USER_A);
  assert.equal(failed.length, 1);
  assert.equal(failed[0].status, 'failed_max_retries');
  assert.equal(failed[0].retryCount, 3);
});

test('Phase 38.07 (4): Exam Draft Rescue preserves answers + writingAnswers and isolates by userId', () => {
  localStorage.clear();
  localStorage.setItem('hanzigo_user', JSON.stringify(USER_A));

  saveTemporaryAnswers(
    'hsk6-official-01',
    { q1: 2, q2: 0 },
    {
      user: USER_A,
      writingAnswers: { q101: '《我的中国梦》\n这是一个关于努力的故事。' },
      flaggedQuestionIds: ['q2'],
      timeLeft: 1800,
    }
  );
  saveTemporaryAnswers(
    'hsk1-official-01',
    { q1: 1 },
    {
      user: USER_B,
      writingAnswers: {},
    }
  );

  const sessionA = getTemporaryExamSession('hsk6-official-01', USER_A);
  assert.deepEqual(sessionA.answers, { q1: 2, q2: 0 });
  assert.equal(
    sessionA.writingAnswers.q101,
    '《我的中国梦》\n这是一个关于努力的故事。'
  );

  const sessionB = getTemporaryExamSession('hsk6-official-01', USER_B);
  assert.equal(sessionB, null, 'User B must not access User A exam draft');

  const boundarySrc = fs.readFileSync(
    path.join(process.cwd(), 'src/components/common/GlobalErrorBoundary.jsx'),
    'utf8'
  );
  assert.ok(
    boundarySrc.includes("HSK_DRAFT_PREFIX = 'hanzigo_hsk_draft_'") &&
      boundarySrc.includes('resolveActiveUserSuffix'),
    'GlobalErrorBoundary must collect user-scoped hanzigo_hsk_draft_ rescue snapshots'
  );
  assert.ok(
    boundarySrc.includes("category: 'render'"),
    'GlobalErrorBoundary must tag render errors with category: render'
  );
});

test('Phase 38.07 (5): sendSafeServerError strips raw internal error message & stack in production mode', () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    let statusCode = 0;
    let payload = null;
    const mockRes = {
      headersSent: false,
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        payload = data;
        return this;
      },
    };

    const internalErr = new Error('password authentication failed for user postgres on relation profiles');
    internalErr.stack = 'Error: password auth...\n at /app/api/secret.js:12:5';
    sendSafeServerError(mockRes, 'Lỗi máy chủ nội bộ.', internalErr, 500);

    assert.equal(statusCode, 500);
    assert.deepEqual(payload, { error: 'Lỗi máy chủ nội bộ.' });
    assert.equal(payload.message, undefined, 'Production error response must not expose raw err.message');
    assert.equal(payload.stack, undefined, 'Production error response must not expose stack');
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});
