import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';
import createUserHandler from '../api/_handlers/admin/create-user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to create mock response object
function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

describe('Task 24.03 - Admin Management Standardization & Deep Integration Tests', () => {

  test('1. AdminPage.jsx has completely removed isDemoUser, demoIds, and demoEmails', () => {
    const adminPageContent = fs.readFileSync(path.join(rootDir, 'src/pages/AdminPage.jsx'), 'utf-8');
    assert.strictEqual(adminPageContent.includes('isDemoUser'), false, 'AdminPage.jsx should not contain isDemoUser');
    assert.strictEqual(adminPageContent.includes('demoIds'), false, 'AdminPage.jsx should not contain demoIds');
    assert.strictEqual(adminPageContent.includes('demoEmails'), false, 'AdminPage.jsx should not contain demoEmails');
    assert.strictEqual(adminPageContent.includes('hoang.tran@hanzigo.com'), false, 'AdminPage.jsx should not contain hardcoded demo email');
    assert.strictEqual(adminPageContent.includes('user-admin-1'), false, 'AdminPage.jsx should not contain hardcoded demo user ID');
  });

  test('2. AdminPage.jsx includes pagination, search, loading, error, and refresh controls', () => {
    const adminPageContent = fs.readFileSync(path.join(rootDir, 'src/pages/AdminPage.jsx'), 'utf-8');
    assert.strictEqual(adminPageContent.includes('pageSize = 10'), true, 'AdminPage.jsx must define pageSize = 10');
    assert.strictEqual(adminPageContent.includes('safeCurrentPage'), true, 'AdminPage.jsx must compute safeCurrentPage');
    assert.strictEqual(adminPageContent.includes('paginatedUsers'), true, 'AdminPage.jsx must compute paginatedUsers');
    assert.strictEqual(adminPageContent.includes('isLoadingUsers'), true, 'AdminPage.jsx must handle isLoadingUsers');
    assert.strictEqual(adminPageContent.includes('fetchUsersError'), true, 'AdminPage.jsx must handle fetchUsersError');
    assert.strictEqual(adminPageContent.includes('adminCreateUser'), true, 'AdminPage.jsx must import and use adminCreateUser');
    assert.strictEqual(adminPageContent.includes('Tải lại danh sách từ cơ sở dữ liệu'), true, 'AdminPage.jsx must have refresh control');
  });

  test('3. AdminPage.jsx Add User modal strictly restricts role to student and teacher (disallows admin)', () => {
    const adminPageContent = fs.readFileSync(path.join(rootDir, 'src/pages/AdminPage.jsx'), 'utf-8');
    const modal1Start = adminPageContent.indexOf('MODAL 1: ADD USER MODAL');
    assert.ok(modal1Start > 0, 'AdminPage.jsx must contain MODAL 1: ADD USER MODAL');
    const modal2Start = adminPageContent.indexOf('MODAL 2: EDIT USER MODAL');
    const modal1Content = adminPageContent.substring(modal1Start, modal2Start > 0 ? modal2Start : modal1Start + 3000);

    assert.ok(modal1Content.includes('value="student"'), 'Modal 1 must include student option');
    assert.ok(modal1Content.includes('value="teacher"'), 'Modal 1 must include teacher option');
    assert.strictEqual(modal1Content.includes('value="admin"'), false, 'Modal 1 must NOT include admin option');
  });

  test('4. Serverless dispatcher api/admin/[action].js and handler exist and enforce Hobby plan limits', () => {
    const dispatcherPath = path.join(rootDir, 'api/admin/[action].js');
    assert.ok(fs.existsSync(dispatcherPath), 'api/admin/[action].js dispatcher must exist');
    const handlerPath = path.join(rootDir, 'api/_handlers/admin/create-user.js');
    assert.ok(fs.existsSync(handlerPath), 'api/_handlers/admin/create-user.js must exist');

    const apiFiles = fs.readdirSync(path.join(rootDir, 'api'), { withFileTypes: true });
    const topLevelEndpoints = apiFiles.filter(f => !f.name.startsWith('_'));
    assert.ok(topLevelEndpoints.length <= 12, `Top-level Vercel API functions (${topLevelEndpoints.length}) must be <= 12`);
  });

  test('5. API rejects unauthenticated caller with 401', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { email: 'student@example.com', name: 'Nguyen Van A', role: 'student', password: 'Password123!' }
    };
    const res = createMockRes();

    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 401);
    assert.ok(res.body?.error?.includes('chưa được xác thực'));
  });

  test('6. API rejects non-admin callers (student, teacher -> 403, blocked admin -> 401)', async () => {
    const rolesToTest = [
      { role: 'student', status: 'active', expected: 403 },
      { role: 'teacher', status: 'active', expected: 403 },
      { role: 'admin', status: 'blocked', expected: 401 } // Blocked account is denied at auth gate
    ];

    for (const testCase of rolesToTest) {
      const mockClient = {
        auth: {
          getUser: async () => ({
            data: { user: { id: 'caller-uuid', email: 'caller@example.com' } },
            error: null
          })
        },
        from: (table) => {
          if (table === 'profiles') {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({
                    data: { id: 'caller-uuid', email: 'caller@example.com', role: testCase.role, status: testCase.status },
                    error: null
                  })
                })
              })
            };
          }
          return {};
        }
      };
      setSupabaseAdminClientForTesting(mockClient);

      const req = {
        method: 'POST',
        headers: { authorization: 'Bearer test-token' },
        body: { email: 'newstudent@example.com', name: 'Le Thi B', role: 'student', password: 'Password123!' }
      };
      const res = createMockRes();

      await createUserHandler(req, res);
      assert.strictEqual(res.statusCode, testCase.expected, `Role ${testCase.role} (status: ${testCase.status}) must return ${testCase.expected}`);
    }
  });

  test('7. API rejects client spoofing admin role in metadata when database profile is student', async () => {
    const mockClient = {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: 'spoofed-uuid',
              email: 'spoofed@example.com',
              user_metadata: { role: 'admin' } // Spoofed in client metadata
            }
          },
          error: null
        })
      },
      from: (table) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: { id: 'spoofed-uuid', email: 'spoofed@example.com', role: 'student', status: 'active' }, // Real DB role
                  error: null
                })
              })
            })
          };
        }
        return {};
      }
    };
    setSupabaseAdminClientForTesting(mockClient);

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer spoofed-token' },
      body: { email: 'victim@example.com', name: 'Victim', role: 'student', password: 'Password123!' }
    };
    const res = createMockRes();

    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 403, 'Must reject spoofed admin metadata when database says student');
  });

  test('8. API rejects creation attempts with role = admin (400)', async () => {
    const mockClient = {
      auth: {
        getUser: async () => ({
          data: { user: { id: 'admin-uuid', email: 'admin@hanzigo.com' } },
          error: null
        })
      },
      from: (table) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: { id: 'admin-uuid', email: 'admin@hanzigo.com', role: 'admin', status: 'active' },
                  error: null
                })
              })
            })
          };
        }
        return {};
      }
    };
    setSupabaseAdminClientForTesting(mockClient);

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: { email: 'newadmin@example.com', name: 'Second Admin', role: 'admin', password: 'Password123!' }
    };
    const res = createMockRes();

    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body?.error?.includes('Chỉ được phép tạo tài khoản "student"'));
  });

  test('9. API validates email, name, and password constraints (400)', async () => {
    const mockClient = {
      auth: {
        getUser: async () => ({
          data: { user: { id: 'admin-uuid', email: 'admin@hanzigo.com' } },
          error: null
        })
      },
      from: (table) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: { id: 'admin-uuid', email: 'admin@hanzigo.com', role: 'admin', status: 'active' },
                  error: null
                })
              })
            })
          };
        }
        return {};
      }
    };
    setSupabaseAdminClientForTesting(mockClient);

    // Case A: Missing email
    let req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: { email: '', name: 'Test User', role: 'student', password: 'Password123!' }
    };
    let res = createMockRes();
    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 400);

    // Case B: Invalid email format
    req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: { email: 'notanemail', name: 'Test User', role: 'student', password: 'Password123!' }
    };
    res = createMockRes();
    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 400);

    // Case C: Missing name
    req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: { email: 'valid@example.com', name: '', role: 'student', password: 'Password123!' }
    };
    res = createMockRes();
    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 400);

    // Case D: Password shorter than 8 characters
    req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: { email: 'valid@example.com', name: 'Test User', role: 'student', password: '123' }
    };
    res = createMockRes();
    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body?.error?.includes('tối thiểu 8 ký tự'));
  });

  test('10. API handles email conflicts in profiles or auth with 409', async () => {
    const mockClientProfilesConflict = {
      auth: {
        getUser: async () => ({
          data: { user: { id: 'admin-uuid', email: 'admin@hanzigo.com' } },
          error: null
        })
      },
      from: (table) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: (col, val) => ({
                maybeSingle: async () => {
                  if (col === 'email') {
                    return { data: { id: 'existing-uuid', email: 'existing@example.com' }, error: null };
                  }
                  return { data: { id: 'admin-uuid', email: 'admin@hanzigo.com', role: 'admin', status: 'active' }, error: null };
                }
              })
            })
          };
        }
        return {};
      }
    };
    setSupabaseAdminClientForTesting(mockClientProfilesConflict);

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: { email: 'existing@example.com', name: 'Duplicate User', role: 'student', password: 'Password123!' }
    };
    const res = createMockRes();
    await createUserHandler(req, res);
    assert.strictEqual(res.statusCode, 409);
    assert.ok(res.body?.error?.includes('đã được đăng ký'));
  });

  test('11. Atomic Rollback: Deletes Auth user if profile upsert fails', async () => {
    let deletedUserId = null;

    const mockClientRollback = {
      auth: {
        getUser: async () => ({
          data: { user: { id: 'admin-uuid', email: 'admin@hanzigo.com' } },
          error: null
        }),
        admin: {
          createUser: async () => ({
            data: { user: { id: 'new-auth-uuid', email: 'rollback@example.com' } },
            error: null
          }),
          deleteUser: async (id) => {
            deletedUserId = id;
            return { data: {}, error: null };
          }
        }
      },
      from: (table) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: (col) => ({
                maybeSingle: async () => {
                  if (col === 'email') return { data: null, error: null }; // Not registered yet
                  return { data: { id: 'admin-uuid', email: 'admin@hanzigo.com', role: 'admin', status: 'active' }, error: null };
                }
              })
            }),
            upsert: () => ({
              select: () => ({
                single: async () => ({
                  data: null,
                  error: { message: 'DB connection dropped during profile upsert' }
                })
              })
            })
          };
        }
        return {};
      }
    };
    setSupabaseAdminClientForTesting(mockClientRollback);

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: { email: 'rollback@example.com', name: 'Rollback User', role: 'student', password: 'Password123!' }
    };
    const res = createMockRes();
    await createUserHandler(req, res);

    assert.strictEqual(res.statusCode, 500);
    assert.ok(res.body?.error?.includes('hoàn tác an toàn'));
    assert.strictEqual(deletedUserId, 'new-auth-uuid', 'Must delete auth user when profile upsert fails');
  });

  test('12. Valid Admin successfully creates student account (201)', async () => {
    let insertedAuditLog = null;
    let createdAuthUserPayload = null;

    const mockClientSuccess = {
      auth: {
        getUser: async () => ({
          data: { user: { id: 'admin-uuid', email: 'admin@hanzigo.com' } },
          error: null
        }),
        admin: {
          createUser: async (payload) => {
            createdAuthUserPayload = payload;
            return {
              data: { user: { id: 'student-uuid-123', email: payload.email } },
              error: null
            };
          }
        }
      },
      from: (table) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: (col, val) => ({
                maybeSingle: async () => {
                  if (col === 'email') return { data: null, error: null }; // Not registered yet
                  return { data: { id: 'admin-uuid', email: 'admin@hanzigo.com', role: 'admin', status: 'active' }, error: null };
                }
              })
            }),
            upsert: () => ({
              select: () => ({
                single: async () => ({
                  data: {
                    id: 'student-uuid-123',
                    email: 'newstudent@example.com',
                    name: 'Le Van C',
                    role: 'student',
                    status: 'active',
                    level: 'HSK 2 - Cơ bản',
                    created_at: new Date().toISOString()
                  },
                  error: null
                })
              })
            })
          };
        }
        if (table === 'audit_logs') {
          return {
            insert: async (entry) => {
              insertedAuditLog = entry;
              return { data: entry, error: null };
            }
          };
        }
        return {};
      }
    };
    setSupabaseAdminClientForTesting(mockClientSuccess);

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: {
        email: 'newstudent@example.com',
        name: 'Le Van C',
        role: 'student',
        password: 'Password123!',
        level: 'HSK 2 - Cơ bản'
      }
    };
    const res = createMockRes();
    await createUserHandler(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body?.success, true);
    assert.strictEqual(res.body?.user?.id, 'student-uuid-123');
    assert.strictEqual(res.body?.user?.role, 'student');
    assert.strictEqual(createdAuthUserPayload?.email_confirm, true);
    assert.ok(insertedAuditLog, 'Audit log must be recorded');
  });

  test('13. Backend RPC definitions enforce self-guards (prevent self-demote, self-lock, self-delete)', () => {
    const migrationContent = fs.readFileSync(
      path.join(rootDir, 'supabase/migrations/20261108_final_security_hardening_v2.sql'),
      'utf-8'
    );

    // Verify admin_delete_user blocks self deletion
    assert.ok(
      migrationContent.includes('IF target_user_id = auth.uid() THEN'),
      'admin_delete_user must block self-delete'
    );
    assert.ok(
      migrationContent.includes('Không thể tự xóa tài khoản quản trị đang đăng nhập'),
      'admin_delete_user error message must be present'
    );

    // Verify admin_update_user_status blocks self lock & self demote
    assert.ok(
      migrationContent.includes("IF new_status = 'blocked' THEN"),
      'admin_update_user_status must block self-lock'
    );
    assert.ok(
      migrationContent.includes("IF new_role IS NOT NULL AND new_role != 'admin' THEN"),
      'admin_update_user_status must block self-demote'
    );
  });

  test('14. Client bundle and frontend code never expose SUPABASE_SERVICE_ROLE_KEY', () => {
    const srcFiles = [];
    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
          srcFiles.push(fullPath);
        }
      }
    }
    scanDir(path.join(rootDir, 'src'));

    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      assert.strictEqual(
        content.includes('VITE_SUPABASE_SERVICE_ROLE_KEY'),
        false,
        `${file} must not expose VITE_SUPABASE_SERVICE_ROLE_KEY`
      );
      assert.strictEqual(
        content.includes('SUPABASE_SERVICE_ROLE_KEY'),
        false,
        `${file} must not reference SUPABASE_SERVICE_ROLE_KEY`
      );
    }
  });

  test('15. Navbar and Lesson navigation harmonized to #roadmap', () => {
    const navbarContent = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.jsx'), 'utf-8');
    assert.strictEqual(navbarContent.includes("handleNavClick('lesson')"), false, 'Navbar should not route to lesson stub');
    assert.ok(navbarContent.includes("handleNavClick('roadmap')"), 'Navbar should route to roadmap');

    const lessonPageContent = fs.readFileSync(path.join(rootDir, 'src/pages/LessonPage.jsx'), 'utf-8');
    assert.ok(lessonPageContent.includes("roadmap"), 'LessonPage.jsx must forward to roadmap');
  });

  test('16. Client build artifact contains zero service role secrets', () => {
    const distAssetsDir = path.join(rootDir, 'dist/assets');
    if (fs.existsSync(distAssetsDir)) {
      const assetFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));
      for (const f of assetFiles) {
        const content = fs.readFileSync(path.join(distAssetsDir, f), 'utf-8');
        assert.strictEqual(
          content.includes('service_role'),
          false,
          `Built asset ${f} must not contain service_role secret string`
        );
      }
    }
  });

});
