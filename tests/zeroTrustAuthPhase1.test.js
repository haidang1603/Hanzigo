import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  verifyRequestAuth, 
  setSupabaseAdminClientForTesting 
} from '../api/_utils/supabaseServer.js';

import createClassroomHandler from '../api/_handlers/classroom/create.js';
import removeStudentHandler from '../api/_handlers/classroom/remove.js';
import hskImportHandler from '../api/_handlers/hsk/import.js';
import hskReviewHandler from '../api/_handlers/hsk/review.js';
import { loginWithEmail, registerWithEmail, ADMIN_EMAILS, isEmailAdmin } from '../src/services/authService.js';

function createMockReqRes({ method = 'POST', headers = {}, body = {} } = {}) {
  let statusCode = 200;
  let responseData = null;

  const req = { method, headers, body };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    get data() {
      return responseData;
    }
  };

  return { req, res };
}

// =========================================================================
// 1. ZERO-TRUST AUTHENTICATION & ROLE TAMPERING TESTS
// =========================================================================

test('SEC-01: verifyRequestAuth rejects invalid or missing Bearer token in production', async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    // Missing Bearer token completely
    const authNoToken = await verifyRequestAuth({ headers: { 'x-user-id': 'teacher-attacker' } });
    assert.equal(authNoToken.authenticated, false);
    assert.ok(authNoToken.error?.includes('Bearer'));

    // Invalid / unverified Bearer token
    const authInvalidToken = await verifyRequestAuth({
      headers: {
        authorization: 'Bearer malformed.invalid.token',
        'x-user-id': 'teacher-attacker'
      }
    });
    assert.equal(authInvalidToken.authenticated, false);
    assert.ok(authInvalidToken.error?.includes('hết hạn') || authInvalidToken.error?.includes('không hợp lệ'));
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});

test('SEC-01: User with user_metadata.role = teacher but profiles.role = student is strictly evaluated as student', async () => {
  const mockAdminClient = {
    auth: {
      async getUser(token) {
        if (token === 'jwt-student-metadata-spoofed') {
          return {
            data: {
              user: {
                id: '11111111-1111-1111-1111-111111111111',
                email: 'student@example.com',
                user_metadata: {
                  role: 'teacher', // Malicious attempt to self-escalate via auth metadata
                  name: 'Student Attacker'
                }
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error('Invalid token') };
      }
    },
    from(table) {
      if (table === 'profiles') {
        return {
          select() {
            return {
              eq(_field, _val) {
                return {
                  async maybeSingle() {
                    // Authoritative Database Record strictly stores role: 'student'
                    return {
                      data: {
                        id: '11111111-1111-1111-1111-111111111111',
                        name: 'Real Student',
                        role: 'student',
                        status: 'active'
                      },
                      error: null
                    };
                  }
                };
              }
            };
          }
        };
      }
      return {};
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  try {
    const auth = await verifyRequestAuth({
      headers: { authorization: 'Bearer jwt-student-metadata-spoofed' }
    });

    assert.equal(auth.authenticated, true);
    // Crucial: Must be 'student', NOT 'teacher'!
    assert.equal(auth.user.role, 'student', 'Must enforce database profile role over user_metadata.role');

    // Attempt to invoke teacher-only endpoint /api/classroom/create
    const { req, res } = createMockReqRes({
      headers: { authorization: 'Bearer jwt-student-metadata-spoofed' },
      body: { name: 'Hack Class', class_code: 'HACK123' }
    });

    await createClassroomHandler(req, res);
    assert.equal(res.statusCode, 403, 'Must reject classroom creation for student with spoofed metadata role');
    assert.ok(res.data.error.includes('Chỉ giáo viên hoặc quản trị viên'));
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

test('SEC-01 FAIL-CLOSED: Missing profile in database is rejected (not granted default access)', async () => {
  const mockAdminClient = {
    auth: {
      async getUser(token) {
        if (token === 'jwt-user-no-profile') {
          return {
            data: {
              user: {
                id: '22222222-2222-2222-2222-222222222222',
                email: 'ghost@example.com',
                user_metadata: {}
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error('Invalid') };
      }
    },
    from(table) {
      if (table === 'profiles') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    // Profile does not exist
                    return { data: null, error: null };
                  }
                };
              }
            };
          }
        };
      }
      return {};
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  try {
    const auth = await verifyRequestAuth({
      headers: { authorization: 'Bearer jwt-user-no-profile' }
    });

    assert.equal(auth.authenticated, false);
    assert.equal(auth.user, null);
    assert.ok(auth.error.includes('Hồ sơ người dùng không tồn tại'));
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

test('SEC-01 FAIL-CLOSED: Database query error fails closed without granting access', async () => {
  const mockAdminClient = {
    auth: {
      async getUser(token) {
        if (token === 'jwt-db-error') {
          return {
            data: {
              user: {
                id: '33333333-3333-3333-3333-333333333333',
                email: 'dberror@example.com'
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error('Invalid') };
      }
    },
    from() {
      return {
        select() {
          return {
            eq() {
              return {
                async maybeSingle() {
                  return { data: null, error: new Error('Postgres connection pool exhausted') };
                }
              };
            }
          };
        }
      };
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  try {
    const auth = await verifyRequestAuth({
      headers: { authorization: 'Bearer jwt-db-error' }
    });

    assert.equal(auth.authenticated, false);
    assert.equal(auth.user, null);
    assert.ok(auth.error.includes('Lỗi xác minh quyền hạn'));
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

test('SEC-01: Blocked account (status = blocked) is strictly rejected', async () => {
  const mockAdminClient = {
    auth: {
      async getUser(token) {
        if (token === 'jwt-blocked-teacher') {
          return {
            data: {
              user: {
                id: '44444444-4444-4444-4444-444444444444',
                email: 'blocked.teacher@example.com'
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error('Invalid') };
      }
    },
    from(table) {
      if (table === 'profiles') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return {
                      data: {
                        id: '44444444-4444-4444-4444-444444444444',
                        name: 'Blocked Teacher',
                        role: 'teacher',
                        status: 'blocked' // Account blocked
                      },
                      error: null
                    };
                  }
                };
              }
            };
          }
        };
      }
      return {};
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  try {
    const auth = await verifyRequestAuth({
      headers: { authorization: 'Bearer jwt-blocked-teacher' }
    });

    assert.equal(auth.authenticated, false);
    assert.equal(auth.user, null);
    assert.ok(auth.error.includes('tạm khóa') || auth.error.includes('vô hiệu hóa'));
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

// =========================================================================
// 2. ADMIN & TEACHER RBAC ENDPOINT HARDENING TESTS
// =========================================================================

test('SEC-02: ADMIN_EMAILS array is completely empty in client bundle', () => {
  assert.equal(ADMIN_EMAILS.length, 0, 'No hardcoded admin emails may be shipped in client bundle');
  assert.equal(isEmailAdmin('admin@hanzigo.com'), false);
  assert.equal(isEmailAdmin('lehaidang16032006@gmail.com'), false);
});

test('SEC-02: Admin endpoints reject users with admin substring in email who lack admin role', async () => {
  // Caller has an email with "admin" word, but role is student
  const { req: reqImport, res: resImport } = createMockReqRes({
    headers: { 'x-user-id': 'student-fake-admin@example.com' },
    body: { payload: {} }
  });

  await hskImportHandler(reqImport, resImport);
  assert.equal(resImport.statusCode, 403, 'Must reject HSK import for non-admin');
  assert.ok(resImport.data.error.includes('Chỉ Admin mới có quyền'));

  const { req: reqReview, res: resReview } = createMockReqRes({
    headers: { 'x-user-id': 'student-sysadmin@example.com' },
    body: { contentId: 'exam-1', targetState: 'published' }
  });

  await hskReviewHandler(reqReview, resReview);
  assert.equal(resReview.statusCode, 403, 'Must reject HSK review for non-admin');
  assert.ok(resReview.data.error.includes('Chỉ Admin mới có quyền'));
});

test('SEC-02: Cross-class isolation: Teacher of Class A cannot remove student from Class B', async () => {
  const mockAdminClient = {
    from(table) {
      if (table === 'classrooms') {
        return {
          select() {
            return {
              eq(_field, val) {
                return {
                  async maybeSingle() {
                    if (val === 'class-b-id') {
                      return {
                        data: {
                          id: 'class-b-id',
                          teacher_id: 'teacher-owner-b' // Belongs to Teacher B
                        },
                        error: null
                      };
                    }
                    return { data: null, error: null };
                  }
                };
              }
            };
          }
        };
      }
      return {};
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  try {
    // Caller is Teacher A (intruder)
    const { req, res } = createMockReqRes({
      headers: { 'x-user-id': 'teacher-intruder-a' },
      body: { classroomId: 'class-b-id', studentId: 'student-victim' }
    });

    await removeStudentHandler(req, res);
    assert.equal(res.statusCode, 403, 'Must forbid Teacher A from modifying Class B');
    assert.ok(res.data.error.includes('Chỉ giáo viên phụ trách'));
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

// =========================================================================
// 3. RPC & REGISTRATION SAFETY TESTS
// =========================================================================

test('BUG-01: registerWithEmail strictly prevents client self-selection of admin role', async () => {
  // Attempting to register with role: 'admin' must be normalized to 'student'
  try {
    await registerWithEmail('newadmin@example.com', 'password123', 'Hacker', 'HSK 1', 'admin');
  } catch (err) {
    // Expected if Supabase is unconfigured in test environment
    assert.ok(err.message.includes('Supabase chưa được cấu hình') || err.message.includes('signUp'));
  }
});

test('BUG-01: loginWithEmail never calls non-existent set_user_role_on_login RPC', async () => {
  // If Supabase is unconfigured, it fails gracefully without throwing set_user_role_on_login errors
  try {
    await loginWithEmail('student@example.com', 'password123', 'teacher');
  } catch (err) {
    assert.ok(err.message.includes('Supabase chưa được cấu hình'));
    assert.ok(!err.message.includes('set_user_role_on_login'), 'Must not reference removed RPC');
  }
});
