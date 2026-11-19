import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

function createMockReqRes({ method = 'GET', headers = {}, body = {}, query = {} } = {}) {
  let statusCode = 200;
  let responseData = null;
  const req = { method, headers, body, query, socket: { remoteAddress: '127.0.0.1' } };
  const res = {
    setHeader() {},
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    end() {
      return this;
    },
  };
  return {
    req,
    res,
    getStatus: () => statusCode,
    getData: () => responseData,
  };
}

test('Phase 38.06 (1): Admin create-user & Live participants reject unauthenticated requests (401) in production mode', async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const { default: createUserHandler } = await import('../api/_handlers/admin/create-user.js');
    const { default: participantsHandler } = await import('../api/_handlers/live/participants.js');

    const { req: req1, res: res1, getStatus: getStatus1 } = createMockReqRes({
      method: 'POST',
      headers: {},
      body: { email: 'test@example.com', password: 'Password123!', name: 'Test', role: 'student' },
    });
    await createUserHandler(req1, res1);
    assert.equal(getStatus1(), 401, 'create-user must reject unauthenticated caller with 401');

    const { req: req2, res: res2, getStatus: getStatus2 } = createMockReqRes({
      method: 'GET',
      headers: {},
      query: { sessionId: 'sess-123' },
    });
    await participantsHandler(req2, res2);
    assert.equal(getStatus2(), 401, 'participantsHandler must reject unauthenticated caller with 401 in production');
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});

test('Phase 38.06 (2): create-user.js writes audit_logs with valid schema columns (actor_id, target_id, metadata) and rate limiting', () => {
  const src = fs.readFileSync(path.join(ROOT, 'api/_handlers/admin/create-user.js'), 'utf8');

  assert.ok(src.includes("from('audit_logs').insert("), 'create-user.js must insert into audit_logs');
  assert.ok(src.includes('actor_id: auth.user.id'), 'audit_logs insert must use actor_id');
  assert.ok(src.includes('target_id: String(newUserId)'), 'audit_logs insert must use target_id');
  assert.ok(src.includes('metadata: {'), 'audit_logs insert must use metadata');
  assert.ok(!src.includes('user_id: auth.user.id'), 'audit_logs insert must not use non-existent user_id column');
  assert.ok(!src.includes('details: {'), 'audit_logs insert must not use non-existent details column');
  assert.ok(src.includes('checkRateLimitAndQuota'), 'create-user.js must enforce rate limiting');
});

test('Phase 38.06 (3): leaderboardService.js has completely removed hanzigo_shared_profiles_cache', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src/services/leaderboardService.js'), 'utf8');
  assert.ok(
    !src.includes('hanzigo_shared_profiles_cache'),
    'leaderboardService.js must not read or write hanzigo_shared_profiles_cache'
  );
});

test('Phase 38.06 (4): Security hardening migration covers Phase 27-30 SECURITY DEFINER functions with search_path & ownership checks', () => {
  const migPath = path.join(ROOT, 'supabase/migrations/20261119_3806_security_hardening.sql');
  assert.ok(fs.existsSync(migPath), '20261119_3806_security_hardening.sql must exist');

  const sql = fs.readFileSync(migPath, 'utf8');
  for (const fnName of [
    'sync_word_multidimensional_mastery',
    'trg_fn_sync_word_multidimensional_mastery',
    'update_vocab_dimension_score',
  ]) {
    assert.ok(sql.includes(fnName), `Hardening migration must include ${fnName}`);
  }
  assert.ok(
    sql.includes('SET search_path = public, pg_temp'),
    'Hardening migration must set search_path = public, pg_temp'
  );
  assert.ok(
    sql.includes('auth.uid()') && sql.includes('public.is_admin()'),
    'Hardening migration must enforce caller ownership or admin check'
  );
  assert.ok(sql.includes('ROLLBACK GUIDE'), 'Hardening migration must include rollback instructions');
});

test('Phase 38.06 (5): No server secrets (SUPABASE_SERVICE_ROLE_KEY, LIVEKIT_API_SECRET, AZURE_SPEECH_KEY, UPSTASH_REDIS_REST_TOKEN) appear in src/ or dist/', () => {
  const forbiddenSecrets = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'LIVEKIT_API_SECRET',
    'AZURE_SPEECH_KEY',
    'UPSTASH_REDIS_REST_TOKEN',
  ];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(js|jsx|ts|tsx)$/i.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const secretName of forbiddenSecrets) {
          assert.ok(
            !content.includes(secretName),
            `Forbidden server secret ${secretName} found in client/build file: ${fullPath}`
          );
        }
      }
    }
  }

  scanDir(path.join(ROOT, 'src'));
  scanDir(path.join(ROOT, 'dist'));
});
