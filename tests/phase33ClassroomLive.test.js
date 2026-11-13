import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  HANZIGO_WB_PROTOCOL_V1,
  createInitialWhiteboardState,
  encodeWhiteboardPacket,
  decodeWhiteboardPacket,
  reduceWhiteboardState,
  canParticipantDraw,
} from '../src/features/classroom/live/useLiveHanziWhiteboard.js';
import assignmentsHandler from '../api/_handlers/classroom/assignments.js';
import classroomRouter from '../api/classroom/[action].js';
import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

function createMockSupabase({ role = 'student', userId = 'user-1' } = {}) {
  return {
    auth: {
      async getUser(token) {
        if (!token) return { data: { user: null }, error: new Error('Invalid token') };
        return { data: { user: { id: userId, email: `${userId}@hanzigo.test` } }, error: null };
      },
    },
    from(table) {
      if (table === 'profiles') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return { data: { id: userId, name: 'Test User', role, status: 'active' }, error: null };
                  },
                };
              },
            };
          },
        };
      }

      if (table === 'classroom_hsk_assignments') {
        return {
          insert(row) {
            return {
              select() {
                return {
                  async single() {
                    return { data: { id: 'asg-1', ...row }, error: null };
                  },
                };
              },
            };
          },
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return {
                      data: { id: 'asg-1', classroom_id: 'cls-1', teacher_id: 'teacher-1', title: 'HSK 3 Mock' },
                      error: null,
                    };
                  },
                  order() {
                    return Promise.resolve({ data: [], error: null });
                  },
                };
              },
            };
          },
        };
      }

      if (table === 'class_members') {
        return {
          select() {
            return {
              eq() {
                return {
                  async eq() {
                    return { data: [{ student_id: 'student-1' }, { student_id: 'student-2' }], error: null };
                  },
                };
              },
            };
          },
        };
      }

      if (table === 'classroom_assignment_submissions') {
        return {
          async upsert(rows) {
            return { data: rows, error: null };
          },
          select() {
            return {
              eq() {
                return {
                  order() {
                    return Promise.resolve({ data: [], error: null });
                  },
                };
              },
            };
          },
        };
      }

      return {};
    },
    async rpc(fnName, params) {
      if (fnName === 'get_classroom_assignment_analytics') {
        return {
          data: {
            assignment_id: params.p_assignment_id,
            total_students: 2,
            submitted_count: 2,
            avg_score: 215,
            pass_rate_pct: 100,
            top_missed_questions: [{ question_number: 12, miss_count: 2, miss_rate_pct: 100 }],
            top_weak_vocab: [{ word: '整理', occurrence_count: 2 }],
          },
          error: null,
        };
      }
      return { data: null, error: null };
    },
  };
}

test('Task 33.01: SQL Migration defines required tables and analytics RPC', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261114_3301_classroom_assignments_and_whiteboard.sql'
  );
  assert.equal(fs.existsSync(migrationPath), true, 'Migration 3301 file must exist');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.classroom_hsk_assignments/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.classroom_assignment_submissions/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.live_whiteboard_snapshots/i);
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.get_classroom_assignment_analytics/i);
});

test('Task 33.02: HANZIGO_WB_PROTOCOL_V1 encodes/decodes and enforces pen grant permissions', () => {
  const packet = {
    type: 'WB_SET_CHARACTER',
    character: '整',
    pinyin: 'zhěng',
    meaning_vi: 'chỉnh lý',
    gridType: 'mizige',
    mode: 'quiz',
  };
  const encoded = encodeWhiteboardPacket(packet);
  assert.equal(encoded instanceof Uint8Array, true);

  const decoded = decodeWhiteboardPacket(encoded);
  assert.equal(decoded.protocol, HANZIGO_WB_PROTOCOL_V1);
  assert.equal(decoded.type, 'WB_SET_CHARACTER');
  assert.equal(decoded.character, '整');

  // Permissions: teacher always allowed, student only when grantedStudentIdentity matches
  assert.equal(
    canParticipantDraw({ isTeacher: true, userIdentity: 'teacher-1', grantedStudentIdentity: null }),
    true
  );
  assert.equal(
    canParticipantDraw({ isTeacher: false, userIdentity: 'student-1', grantedStudentIdentity: null }),
    false
  );
  assert.equal(
    canParticipantDraw({ isTeacher: false, userIdentity: 'student-1', grantedStudentIdentity: 'student-2' }),
    false
  );
  assert.equal(
    canParticipantDraw({ isTeacher: false, userIdentity: 'student-2', grantedStudentIdentity: 'student-2' }),
    true
  );

  let state = createInitialWhiteboardState();
  state = reduceWhiteboardState(state, {
    type: 'WB_GRANT_STUDENT_PEN',
    grantedIdentity: 'student-2',
    studentName: 'Minh Anh',
  });
  assert.equal(state.grantedStudentIdentity, 'student-2');
  assert.equal(state.grantedStudentName, 'Minh Anh');
});

test('Task 33.04: assignments API enforces RBAC (blocks student from creating assignment) and allows teacher creation', async () => {
  try {
    // 1. Student blocked with 403
    setSupabaseAdminClientForTesting(createMockSupabase({ role: 'student', userId: 'student-1' }));
    const studentReq = {
      method: 'POST',
      url: '/api/classroom/assignments',
      headers: { authorization: 'Bearer student-token' },
      body: {
        action: 'create_assignment',
        classroomId: 'cls-1',
        title: 'Unauthorized HSK Exam',
        assignmentType: 'hsk_mock_exam',
        targetResourceId: 'H31329',
      },
    };
    const studentRes = createMockRes();
    await classroomRouter(studentReq, studentRes);
    assert.equal(studentRes.statusCode, 403);

    // 2. Teacher allowed with 200 and initializes members
    setSupabaseAdminClientForTesting(createMockSupabase({ role: 'teacher', userId: 'teacher-1' }));
    const teacherReq = {
      method: 'POST',
      url: '/api/classroom/assignments',
      headers: { authorization: 'Bearer teacher-token' },
      body: {
        action: 'create_assignment',
        classroomId: 'cls-1',
        title: 'HSK 3 Mock Test H31329',
        assignmentType: 'hsk_mock_exam',
        targetResourceId: 'H31329',
        hskLevel: 3,
      },
    };
    const teacherRes = createMockRes();
    await assignmentsHandler(teacherReq, teacherRes);
    assert.equal(teacherRes.statusCode, 200);
    assert.equal(teacherRes.body.success, true);
    assert.equal(teacherRes.body.initialized_students_count, 2);

    // 3. Teacher analytics RPC call
    const analyticsReq = {
      method: 'GET',
      url: '/api/classroom/assignments?assignmentId=asg-1&analytics=true',
      query: { assignmentId: 'asg-1', analytics: 'true' },
      headers: { authorization: 'Bearer teacher-token' },
    };
    const analyticsRes = createMockRes();
    await assignmentsHandler(analyticsReq, analyticsRes);
    assert.equal(analyticsRes.statusCode, 200);
    assert.equal(analyticsRes.body.analytics.top_missed_questions[0].question_number, 12);
    assert.equal(analyticsRes.body.analytics.top_weak_vocab[0].word, '整理');
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});
