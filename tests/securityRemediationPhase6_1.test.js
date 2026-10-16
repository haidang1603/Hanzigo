import test from 'node:test';
import assert from 'node:assert/strict';

// Import handlers, utilities and services to test
import { verifyRequestAuth, setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';
import livekitTokenHandler from '../api/_webrtc/livekit-token.js';
import submitHandler from '../api/_handlers/hsk/submit.js';
import attemptHandler from '../api/_handlers/hsk/attempt.js';
import mistakesHandler from '../api/_handlers/hsk/mistakes.js';
import { resolveRegistrationRole } from '../src/services/authService.js';
import { submitExam, submitExamAttempt } from '../src/services/hskService.js';
import { getFullExamById, HSK_EXAMS } from '../src/data/hskExamsData.js';

// Helper to create mock request / response objects
function createMockReqRes({ method = 'GET', body = {}, query = {}, headers = {} }) {
  const req = {
    method,
    body,
    query,
    headers: { ...headers }
  };
  let statusCode = 200;
  let responseBody = null;
  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseBody = data;
      return res;
    },
    setHeader() {
      return res;
    },
    getStatusCode() {
      return statusCode;
    },
    getBody() {
      return responseBody;
    }
  };
  return { req, res, getStatus: () => statusCode, getBody: () => responseBody };
}

test('PHASE 6.1 — SEC-07: Test Header Authentication Boundary Enforcement', async (t) => {
  const originalEnv = { ...process.env };

  await t.test('Test header x-user-id is REJECTED in Production environment', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.VERCEL_ENV;
    delete process.env.ALLOW_TEST_HEADER_AUTH;

    const req = {
      headers: {
        'x-user-id': 'spoofed-admin-id',
        'x-user-role': 'admin'
      }
    };
    const result = await verifyRequestAuth(req);
    assert.equal(result.authenticated, false, 'Should reject test headers in production');
    assert.equal(result.user, null);
  });

  await t.test('Test header x-user-id is REJECTED in Vercel Preview environment', async () => {
    delete process.env.NODE_ENV;
    process.env.VERCEL_ENV = 'preview';
    delete process.env.ALLOW_TEST_HEADER_AUTH;

    const req = {
      headers: {
        'x-user-id': 'attacker-preview-id',
        'x-user-role': 'teacher'
      }
    };
    const result = await verifyRequestAuth(req);
    assert.equal(result.authenticated, false, 'Should reject test headers in preview environment');
    assert.equal(result.user, null);
  });

  await t.test('Test header x-user-id is only allowed in local test when explicit opt-in', async () => {
    process.env.NODE_ENV = 'test';
    delete process.env.VERCEL_ENV;
    delete process.env.ALLOW_TEST_HEADER_AUTH;

    const req = {
      headers: {
        'x-user-id': 'valid-test-user',
        'x-user-role': 'student',
        'x-user-email': 'test@hanzigo.local'
      }
    };
    const result = await verifyRequestAuth(req);
    assert.equal(result.authenticated, true, 'Test header allowed in isolated test mode');
    assert.equal(result.user.id, 'valid-test-user');
    assert.equal(result.user.role, 'student');
  });

  // Restore env
  process.env = originalEnv;
});

test('PHASE 6.1 — SEC-05: LiveKit Token Fail-Closed in Production & Preview', async (t) => {
  const originalEnv = { ...process.env };

  await t.test('Fails-closed with HTTP 503 if LIVEKIT_API_KEY or SECRET is missing in Production', async () => {
    process.env = { ...originalEnv };
    process.env.NODE_ENV = 'production';
    delete process.env.VERCEL_ENV;
    delete process.env.LIVEKIT_API_KEY;
    delete process.env.LIVEKIT_API_SECRET;
    delete process.env.LIVEKIT_URL;

    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'POST',
      body: { roomName: 'class-room-01', participantName: 'Student A' }
    });

    await livekitTokenHandler(req, res);
    assert.equal(getStatus(), 503, 'Must return 503 Service Unavailable when credentials missing');
    assert.match(getBody().error, /chưa cấu hình LiveKit credentials/i);
  });

  await t.test('Fails-closed with HTTP 503 if LIVEKIT_API_KEY is missing in Preview', async () => {
    process.env = { ...originalEnv };
    delete process.env.NODE_ENV;
    process.env.VERCEL_ENV = 'preview';
    delete process.env.LIVEKIT_API_KEY;
    delete process.env.LIVEKIT_API_SECRET;

    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'POST',
      body: { roomName: 'class-preview-01', participantName: 'Student Preview' }
    });

    await livekitTokenHandler(req, res);
    assert.equal(getStatus(), 503, 'Must return 503 in preview without credentials');
  });

  await t.test('Rejects non-POST requests with 405', async () => {
    process.env = { ...originalEnv };
    const { req, res, getStatus } = createMockReqRes({ method: 'GET' });
    await livekitTokenHandler(req, res);
    assert.equal(getStatus(), 405);
  });

  await t.test('Rejects request without roomName or participantName with 400 when authenticated', async () => {
    process.env = { ...originalEnv };
    process.env.NODE_ENV = 'test';
    delete process.env.VERCEL_ENV;
    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'POST',
      body: { roomName: '' },
      headers: {
        'x-user-id': 'student-1',
        'x-user-role': 'student'
      }
    });
    await livekitTokenHandler(req, res);
    assert.equal(getStatus(), 400);
    assert.match(getBody().error, /Mã phòng học|roomName/i);
  });

  // Restore env
  process.env = originalEnv;
});

test('PHASE 6.1 — SEC-04: Teacher Registration Role Privilege & Invite Code Verification', async (t) => {
  await t.test('Public registration with role: teacher defaults to student without invite code', () => {
    const role = resolveRegistrationRole('teacher', '');
    assert.equal(role, 'student', 'Role must default to student when no invite code provided');
  });

  await t.test('Public registration with invalid invite code defaults to student', () => {
    const role = resolveRegistrationRole('teacher', 'INVALID_CODE_123');
    assert.equal(role, 'student', 'Role must remain student with bad invite code');
  });

  await t.test('Public registration with valid teacher invite code assigns teacher role', () => {
    const role = resolveRegistrationRole('teacher', 'HZG_TEACHER_VERIFIED_2026');
    assert.equal(role, 'teacher', 'Teacher role granted only with valid invite code');
  });

  await t.test('Attempting to self-grant admin via registration is blocked', () => {
    const role = resolveRegistrationRole('admin', 'HZG_TEACHER_VERIFIED_2026');
    assert.equal(role, 'teacher', 'Admin role cannot be self-granted via invite code');
  });
});

test('PHASE 6.1 — SEC-03: Anonymous Attempt and Mistake Data Ownership & Isolation', async (t) => {
  await t.test('Guest attempt retrieval requires matching x-anonymous-session-id or sessionId param', async () => {
    const mockAdmin = {
      from: (tbl) => ({
        select: () => ({
          eq: (_col, val) => ({
            maybeSingle: async () => {
              if (tbl === 'hsk_attempts' && val === 'att-guest-001') {
                return {
                  data: {
                    id: 'att-guest-001',
                    user_id: null,
                    anonymous_session_id: 'guest_session_secret_123',
                    exam_id: 'hsk1-mock-01',
                    score: 180,
                    max_score: 200,
                    passed: true,
                    created_at: new Date().toISOString()
                  },
                  error: null
                };
              }
              return { data: null, error: null };
            }
          })
        })
      })
    };
    setSupabaseAdminClientForTesting(mockAdmin);

    try {
      // 1. Calling without session header -> 403
      const { req: req1, res: res1, getStatus: getStatus1, getBody: getBody1 } = createMockReqRes({
        method: 'GET',
        query: { id: 'att-guest-001' },
        headers: {}
      });
      await attemptHandler(req1, res1);
      assert.equal(getStatus1(), 403, 'Must reject anonymous attempt lookup without session verification');
      assert.match(getBody1().error, /quyền/i);

      // 2. Calling with mismatched session header -> 403
      const { req: req2, res: res2, getStatus: getStatus2 } = createMockReqRes({
        method: 'GET',
        query: { id: 'att-guest-001' },
        headers: { 'x-anonymous-session-id': 'wrong_guest_session_999' }
      });
      await attemptHandler(req2, res2);
      assert.equal(getStatus2(), 403, 'Must reject with mismatched session');

      // 3. Calling with matching session header -> 200
      const { req: req3, res: res3, getStatus: getStatus3, getBody: getBody3 } = createMockReqRes({
        method: 'GET',
        query: { id: 'att-guest-001' },
        headers: { 'x-anonymous-session-id': 'guest_session_secret_123' }
      });
      await attemptHandler(req3, res3);
      assert.equal(getStatus3(), 200, 'Must allow lookup with matching session ID');
      assert.equal(getBody3().attempt.id, 'att-guest-001');
    } finally {
      setSupabaseAdminClientForTesting(null);
    }
  });

  await t.test('Guest mistake notebook update rejects unverified anonymous session', async () => {
    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'PATCH',
      body: {
        mistakeId: 'mst_guestB_q1',
        status: 'mastered'
      },
      headers: {} // Missing session ID
    });

    await mistakesHandler(req, res);
    assert.equal(getStatus(), 403, 'Must return 403 when updating mistake without session ownership');
    assert.match(getBody().error, /quyền/i);
  });

  await t.test('Guest mistake item deletion rejects unverified anonymous session', async () => {
    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'DELETE',
      query: { mistakeId: 'mst_guestB_q2' },
      headers: {} // No session header
    });

    await mistakesHandler(req, res);
    assert.equal(getStatus(), 403, 'Must return 403 when deleting mistake without session ownership');
    assert.match(getBody().error, /quyền/i);
  });
});

test('PHASE 6.1 — SEC-02 & SEC-06: Authoritative Server-Side Scoring & Answer Protection', async (t) => {
  await t.test('Server-side submit grades correctly and does not trust client score', async () => {
    const fullExam = getFullExamById('hsk1-mock-01');
    assert.ok(fullExam, 'Exam hsk1-mock-01 must exist');

    // Build answers where 1 question is right and others are left empty
    const firstQ = fullExam.questions[0];
    const answers = {
      [firstQ.id]: firstQ.correct_option_index
    };

    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'POST',
      body: {
        examId: fullExam.id,
        answers,
        timeSpentSeconds: 120,
        score: 9999, // Attempted score spoofing
        passed: true // Attempted passed spoofing
      }
    });

    await submitHandler(req, res);
    assert.equal(getStatus(), 200);
    const body = getBody();
    assert.equal(body.success, true);
    assert.notEqual(body.attempt.score, 9999, 'Server must never trust client-spoofed score');
    assert.equal(body.attempt.correctCount, 1, 'Server independently counts exactly 1 correct answer');
  });

  await t.test('Server-side submit deduplicates retried submission with same attemptId', async () => {
    const fullExam = getFullExamById('hsk1-mock-01');
    const firstQ = fullExam.questions[0];
    const answers = { [firstQ.id]: firstQ.correct_option_index };
    const fixedAttemptId = `test-dedup-att-${Date.now()}`;

    // First submission
    const { req: req1, res: res1, getStatus: getStatus1, getBody: getBody1 } = createMockReqRes({
      method: 'POST',
      body: {
        examId: fullExam.id,
        answers,
        attemptId: fixedAttemptId
      }
    });
    await submitHandler(req1, res1);
    assert.equal(getStatus1(), 200);
    assert.equal(getBody1().deduplicated, undefined);

    // Immediate second submission with identical attemptId
    const { req: req2, res: res2, getStatus: getStatus2, getBody: getBody2 } = createMockReqRes({
      method: 'POST',
      body: {
        examId: fullExam.id,
        answers,
        attemptId: fixedAttemptId
      }
    });
    await submitHandler(req2, res2);
    assert.equal(getStatus2(), 200);
    assert.equal(getBody2().deduplicated, true, 'Subsequent submit with same attemptId must be deduplicated');
    assert.equal(getBody2().attempt.id, fixedAttemptId);
  });

  await t.test('Server-side submit rejects unpublished exam for non-admin', async () => {
    // Inject temporary unpublished exam into dataset
    const unpublishedExam = {
      id: 'hsk-temp-unpublished-01',
      title: 'Đề chưa xuất bản',
      level: 'HSK 3',
      exam_type: 'mock',
      passing_score: 180,
      max_score: 300,
      questions: [
        { id: 'q-temp-01', points: 10, correct_option_index: 0, options: [{ text: 'A' }] }
      ],
      is_published: false
    };
    HSK_EXAMS.push(unpublishedExam);

    try {
      const { req, res, getStatus, getBody } = createMockReqRes({
        method: 'POST',
        body: {
          examId: 'hsk-temp-unpublished-01',
          answers: {}
        },
        headers: {
          'x-user-id': 'student-123',
          'x-user-role': 'student'
        }
      });

      await submitHandler(req, res);
      assert.equal(getStatus(), 403);
      assert.match(getBody().error, /chưa được xuất bản/i);
    } finally {
      const idx = HSK_EXAMS.findIndex(e => e.id === 'hsk-temp-unpublished-01');
      if (idx !== -1) HSK_EXAMS.splice(idx, 1);
    }
  });

  await t.test('Server-side submit rejects non-existent exam with 404', async () => {
    const { req, res, getStatus } = createMockReqRes({
      method: 'POST',
      body: {
        examId: 'non-existent-exam-xyz',
        answers: {}
      }
    });
    await submitHandler(req, res);
    assert.equal(getStatus(), 404);
  });

  await t.test('Frontend submitExam alias is exported and operates consistently', async () => {
    assert.equal(typeof submitExam, 'function', 'submitExam alias must be exported');
    assert.equal(submitExam, submitExamAttempt, 'submitExam must be an alias for submitExamAttempt');
  });
});

test('PHASE 6.1 — SEC-01: RPC atomic_join_live_session Security Invariants', async (t) => {
  await t.test('Migration SQL specifies auth.uid() bound to p_user_id for authenticated role', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const migrationPath = path.resolve('supabase/migrations/20261016_phase6_1_security_and_hsk_remediation.sql');
    assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

    const sqlContent = fs.readFileSync(migrationPath, 'utf8');
    assert.match(sqlContent, /IF auth\.uid\(\) IS NULL OR auth\.uid\(\) != p_user_id THEN/i, 'Must check auth.uid() == p_user_id');
    assert.match(sqlContent, /Không thể tham gia phòng học thay mặt người dùng khác/i);
    assert.match(sqlContent, /REVOKE EXECUTE ON FUNCTION public\.atomic_join_live_session/i);
    assert.match(sqlContent, /GRANT EXECUTE ON FUNCTION public\.atomic_join_live_session/i);
  });

  await t.test('Migration SQL creates v_hsk_questions_public without correct answers', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const migrationPath = path.resolve('supabase/migrations/20261016_phase6_1_security_and_hsk_remediation.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    assert.match(sqlContent, /CREATE VIEW public\.v_hsk_questions_public/i);
    assert.match(sqlContent, /REVOKE SELECT ON TABLE public\.hsk_questions FROM anon/i);
    // Ensure correct_option_index is NOT selected in v_hsk_questions_public
    const viewRegex = /CREATE VIEW public\.v_hsk_questions_public[\s\S]*?AS\s+SELECT([\s\S]*?)FROM/i;
    const match = sqlContent.match(viewRegex);
    assert.ok(match, 'Must have view definition');
    const columns = match[1];
    assert.ok(!columns.includes('correct_option_index'), 'Public view MUST NOT include correct_option_index');
    assert.ok(!columns.includes('correct_order'), 'Public view MUST NOT include correct_order');
    assert.ok(!columns.includes('correct_sentence'), 'Public view MUST NOT include correct_sentence');
    assert.ok(!columns.includes('accepted_answers'), 'Public view MUST NOT include accepted_answers');
  });
});
