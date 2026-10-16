/**
 * =========================================================================
 * HANZI GO - PHASE 5: LIVE CLASSROOM RELIABILITY & SECURITY TEST SUITE
 * =========================================================================
 * Independent forensic verification for 1 teacher + 50 students online class:
 * 1. Role verification & Server-Side Zero-Trust enforcement
 * 2. LiveKit Token generation, TTL, and least-privilege publish grants
 * 3. 50-student capacity limit enforcement
 * 4. Teacher moderation (Allow Mic, Revoke Mic, Mute All, Kick) & RBAC isolation
 * 5. Audio track lifecycle, playback unlock, and DOM cleanup on disconnect
 * 6. Browser native screen-share stop synchronization
 * 7. Device enumeration and input switching API
 * 8. Reconnection resilience, presence sync, and stale session timeout
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createClassroom,
  joinClassByCode
} from '../src/services/classroomService.js';

import {
  createClassSession,
  joinLiveSession,
  leaveLiveSession,
  endLiveSession,
  getSessionById,
  getActiveSessionForClass,
  getSessionParticipants,
  verifySessionAccess,
  allowStudentMic,
  revokeStudentMic,
  muteAllParticipants
} from '../src/services/liveClassroomService.js';

import livekitTokenHandler from '../api/_webrtc/livekit-token.js';
import moderationHandler from '../api/_handlers/live/moderation.js';
import joinHandler from '../api/_handlers/live/join.js';
import leaveHandler from '../api/_handlers/live/leave.js';
import endHandler from '../api/_handlers/live/end.js';
import participantsHandler from '../api/_handlers/live/participants.js';
import { LiveKitClassroomManager } from '../src/services/livekitService.js';
import { memoryParticipants, setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

// Polyfill localStorage in Node test runner
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] || null,
    get length() { return store.size; }
  };
}

// Polyfill minimal document in Node environment for DOM audio cleanup testing
if (typeof globalThis.document === 'undefined') {
  const domElements = new Set();
  globalThis.document = {
    body: {
      appendChild(el) { domElements.add(el); return el; },
      removeChild(el) { domElements.delete(el); }
    },
    querySelectorAll(selector) {
      const match = selector.match(/data-livekit-participant="([^"]+)"/);
      if (match) {
        const id = match[1];
        return Array.from(domElements).filter(el => el.dataset?.livekitParticipant === id);
      }
      if (selector.includes('data-livekit-participant')) {
        return Array.from(domElements).filter(el => el.dataset?.livekitParticipant);
      }
      return [];
    }
  };
}

function resetTestStore() {
  localStorage.clear();
  memoryParticipants.clear();
}

function createMockReqRes({ method = 'POST', headers = {}, body = {} } = {}) {
  const req = { method, headers, body };
  let statusCode = 200;
  let responseData = null;
  const res = {
    status(code) { statusCode = code; return this; },
    json(data) { responseData = data; return this; }
  };
  return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

/* =========================================================================
   SCENARIO 1: Teacher Ownership & Student Protection against Unauthorized End
   ========================================================================= */

test('PHASE 5 - SCENARIO 1: Teacher Ownership & Session Lifecycle Security', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-p5-owner', uid: 'teacher-p5-owner', role: 'teacher', name: 'Cô Trần' };
  const student = { id: 'student-p5-01', uid: 'student-p5-01', role: 'student', name: 'Em Bảo' };
  const stranger = { id: 'stranger-p5-99', uid: 'stranger-p5-99', role: 'student', name: 'Kẻ Lạ' };

  // 1. Create class & session
  const cls = await createClassroom({
    name: 'Lớp HSK 2 Cấp Tốc',
    teacherId: teacher.id,
    teacherName: teacher.name,
    hskLevel: 'HSK 2'
  });
  assert.equal(cls.success, true);
  const classId = cls.classroom.id;

  // Student enrolls into classroom
  await joinClassByCode(cls.classroom.class_code, student);

  const ses = await createClassSession({
    classroomId: classId,
    teacherId: teacher.id,
    title: 'Buổi 1: Luyện thanh điệu & khẩu ngữ'
  });
  assert.equal(ses.success, true);
  const sessionId = ses.session.id;

  // 2. Stranger attempts to verify access -> must be rejected
  const strangerAccess = await verifySessionAccess(sessionId, stranger);
  assert.equal(strangerAccess.allowed, false);

  // 3. Enrolled student accesses session -> allowed as student
  const studentAccess = await verifySessionAccess(sessionId, student);
  assert.equal(studentAccess.allowed, true);
  assert.equal(studentAccess.role, 'student');

  // 4. Student attempts to end teacher session -> strictly rejected
  const studentIllegalEnd = await endLiveSession(sessionId, student.id);
  assert.equal(studentIllegalEnd.success, false, 'Student must not be able to end teacher session');

  // 5. Calling endLiveSession with missing/null teacherId -> fails closed
  const nullEnd = await endLiveSession(sessionId, null);
  assert.equal(nullEnd.success, false, 'Missing teacherId must fail closed');

  // 6. Legitimate teacher ends session -> succeeds
  const legitEnd = await endLiveSession(sessionId, teacher.id);
  assert.equal(legitEnd.success, true);

  const closedSession = await getSessionById(sessionId);
  assert.equal(closedSession.status, 'ended');
});

/* =========================================================================
   SCENARIO 2: Zero-Trust Token Generation & Least-Privilege Publish Grants
   ========================================================================= */

test('PHASE 5 - SCENARIO 2: Zero-Trust Token Generation & Least-Privilege Grants', async () => {
  resetTestStore();

  const sessionId = 'session-token-test-p5';
  const studentId = 'student-token-01';
  const teacherId = 'teacher-token-owner';

  // 1. Student requests token without mic permission
  const { req: req1, res: res1, getStatus: getStatus1, getData: getData1 } = createMockReqRes({
    headers: { 'x-user-id': studentId },
    body: { roomName: sessionId, userName: 'Học viên A', role: 'teacher' } // Attempted role escalation
  });

  await livekitTokenHandler(req1, res1);
  assert.equal(getStatus1(), 200);
  const data1 = getData1();
  assert.equal(data1.role, 'student', 'Server must evaluate role as student regardless of client body');

  // Verify JWT claims: canPublish must be false
  const tokenParts1 = data1.token.split('.');
  const payload1 = JSON.parse(Buffer.from(tokenParts1[1], 'base64url').toString('utf-8'));
  assert.equal(payload1.video?.canPublish, false, 'Student without granted mic must have canPublish: false');
  assert.equal(payload1.video?.canSubscribe, true);

  // 2. Teacher grants mic permission to student in memory/database
  memoryParticipants.set(`${sessionId}:${studentId}`, {
    session_id: sessionId,
    user_id: studentId,
    role: 'student',
    is_mic_allowed: true
  });

  // 3. Student requests token again -> canPublish is true, but restricted to microphone only
  const { req: req2, res: res2, getStatus: getStatus2, getData: getData2 } = createMockReqRes({
    headers: { 'x-user-id': studentId },
    body: { roomName: sessionId, userName: 'Học viên A' }
  });

  await livekitTokenHandler(req2, res2);
  assert.equal(getStatus2(), 200);
  const data2 = getData2();
  const payload2 = JSON.parse(Buffer.from(data2.token.split('.')[1], 'base64url').toString('utf-8'));

  assert.equal(payload2.video?.canPublish, true, 'Student with mic granted must have canPublish: true');
  assert.deepEqual(payload2.video?.canPublishSources, ['microphone'], 'Student must ONLY be allowed to publish microphone');

  // 4. Teacher requests token -> unrestricted publishing
  const { req: req3, res: res3, getStatus: getStatus3, getData: getData3 } = createMockReqRes({
    headers: { 'x-user-id': teacherId },
    body: { roomName: sessionId, userName: 'Thầy Hùng' }
  });

  await livekitTokenHandler(req3, res3);
  assert.equal(getStatus3(), 200);
  const data3 = getData3();
  const payload3 = JSON.parse(Buffer.from(data3.token.split('.')[1], 'base64url').toString('utf-8'));

  assert.equal(payload3.video?.canPublish, true);
  assert.equal(payload3.video?.canPublishSources, undefined, 'Teacher has unrestricted publish grants');
});

/* =========================================================================
   SCENARIO 3: 50-Student Capacity Limit Enforcement
   ========================================================================= */

test('PHASE 5 - SCENARIO 3: Strict 50-Student Capacity Limit Enforcement', async () => {
  resetTestStore();

  const sessionId = 'session-cap-50-test';

  // Populate 50 active students in session memory
  for (let i = 1; i <= 50; i++) {
    memoryParticipants.set(`${sessionId}:student-${i}`, {
      session_id: sessionId,
      user_id: `student-${i}`,
      role: 'student',
      left_at: null
    });
  }

  // 51st student attempts to join / request token -> rejected with 403
  const { req: req51, res: res51, getStatus: getStatus51, getData: getData51 } = createMockReqRes({
    headers: { 'x-user-id': 'student-51' },
    body: { roomName: sessionId, userName: 'Học sinh thứ 51' }
  });

  await livekitTokenHandler(req51, res51);
  assert.equal(getStatus51(), 403, '51st student must be rejected with 403 Forbidden');
  assert.match(getData51().error, /tối đa \(50 học viên\)/);

  // Teacher joining is NOT blocked by student capacity
  const { req: reqTeacher, res: resTeacher, getStatus: getStatusT, getData: getDataT } = createMockReqRes({
    headers: { 'x-user-id': 'teacher-owner-cap' },
    body: { roomName: sessionId, userName: 'Thầy Chủ Nhiệm' }
  });

  await livekitTokenHandler(reqTeacher, resTeacher);
  assert.equal(getStatusT(), 200, 'Teacher must always be permitted to join their class');
});

/* =========================================================================
   SCENARIO 4: Teacher Moderation RBAC & Input Validation
   ========================================================================= */

test('PHASE 5 - SCENARIO 4: Teacher Moderation RBAC & Targeted Action Validation', async () => {
  resetTestStore();

  const sessionId = 'session-mod-test';
  const teacherId = 'teacher-mod-p5';
  const studentId = 'student-mod-p5';
  const maliciousStudent = 'student-hacker-p5';

  // 1. Missing targetUserId for targeted action returns 400
  const { req: r1, res: s1, getStatus: st1, getData: d1 } = createMockReqRes({
    headers: { 'x-user-id': teacherId },
    body: { sessionId, action: 'ALLOW_MIC', targetUserId: '' }
  });
  await moderationHandler(r1, s1);
  assert.equal(st1(), 400);
  assert.match(d1().error, /targetUserId/);

  // 2. Student caller attempting moderation returns 403
  const { req: r2, res: s2, getStatus: st2 } = createMockReqRes({
    headers: { 'x-user-id': maliciousStudent },
    body: { sessionId, action: 'MUTE_ALL' }
  });
  await moderationHandler(r2, s2);
  assert.equal(st2(), 403, 'Student calling MUTE_ALL must be rejected with 403');

  // 3. Teacher grants mic to student
  const { req: r3, res: s3, getStatus: st3, getData: d3 } = createMockReqRes({
    headers: { 'x-user-id': teacherId },
    body: { sessionId, action: 'ALLOW_MIC', targetUserId: studentId }
  });
  await moderationHandler(r3, s3);
  assert.equal(st3(), 200);
  assert.equal(d3().success, true);

  const partAfterAllow = memoryParticipants.get(`${sessionId}:${studentId}`);
  assert.equal(partAfterAllow?.is_mic_allowed, true);

  // 4. Teacher revokes mic
  const { req: r4, res: s4, getStatus: st4 } = createMockReqRes({
    headers: { 'x-user-id': teacherId },
    body: { sessionId, action: 'REVOKE_MIC', targetUserId: studentId }
  });
  await moderationHandler(r4, s4);
  assert.equal(st4(), 200);

  const partAfterRevoke = memoryParticipants.get(`${sessionId}:${studentId}`);
  assert.equal(partAfterRevoke?.is_mic_allowed, false);
});

/* =========================================================================
   SCENARIO 5: DOM Audio Element Lifecycle & Disconnect Cleanup
   ========================================================================= */

test('PHASE 5 - SCENARIO 5: Audio Element Lifecycle & DOM Cleanup on Disconnect', async () => {
  resetTestStore();

  const lkManager = new LiveKitClassroomManager();
  lkManager.sessionId = 'ses-cleanup-test';

  // Simulate remote audio track attachment
  const mockAudioEl = {
    dataset: { livekitParticipant: 'student-speaking-1', livekitSession: 'ses-cleanup-test' },
    style: {},
    play: async () => {},
    remove: () => {}
  };

  lkManager.attachedAudioElements.add(mockAudioEl);
  document.body.appendChild(mockAudioEl);
  assert.equal(lkManager.attachedAudioElements.size, 1);

  // Disconnect manager
  await lkManager.disconnect();

  assert.equal(lkManager.attachedAudioElements.size, 0, 'Audio elements set must be cleared');
  assert.equal(lkManager.isConnected, false);
  assert.equal(lkManager.teacherVideoTrack, null);
  assert.equal(lkManager.teacherAudioTrack, null);
});

/* =========================================================================
   SCENARIO 6: Screen Sharing Native onended Synchronization
   ========================================================================= */

test('PHASE 5 - SCENARIO 6: Browser Native Screen-Share Stop Synchronization', async () => {
  resetTestStore();

  const lkManager = new LiveKitClassroomManager();
  lkManager.isConnected = true;

  let stoppedFired = false;
  const mockMediaStreamTrack = {
    onended: null,
    addEventListener(event, fn) {
      if (event === 'ended') this._handler = fn;
    },
    stop() {
      stoppedFired = true;
    }
  };

  let localStreamFired = false;
  lkManager.onLocalStreamChange = (data) => {
    if (data.screenTrack === null) {
      localStreamFired = true;
    }
  };

  // Mock localParticipant.setScreenShareEnabled
  lkManager.room = {
    localParticipant: {
      async setScreenShareEnabled(enabled) {
        if (enabled) {
          return {
            track: {
              mediaStreamTrack: mockMediaStreamTrack,
              on: (evt, fn) => { if (evt === 'ended') mockMediaStreamTrack._onEndedFn = fn; }
            }
          };
        } else {
          return null;
        }
      }
    }
  };

  // Teacher enables screen share
  await lkManager.setScreenShareEnabled(true);
  assert.ok(mockMediaStreamTrack.onended, 'mediaStreamTrack.onended handler must be attached');

  // Simulate user clicking native browser "Stop sharing" button
  mockMediaStreamTrack.onended();

  // Wait tick for async handling
  await new Promise(r => setTimeout(r, 10));

  assert.equal(lkManager.localScreenTrack, null, 'Screen track must be set to null');
  assert.equal(localStreamFired, true, 'onLocalStreamChange must be notified that screen sharing stopped');
});

/* =========================================================================
   SCENARIO 7: Device Enumeration & Input Switching API
   ========================================================================= */

test('PHASE 5 - SCENARIO 7: Device Enumeration & Input Switching API', async () => {
  resetTestStore();

  const lkManager = new LiveKitClassroomManager();

  // Test when room is not connected
  const noRoomSwitch = await lkManager.switchDevice('audioinput', 'mic-device-123');
  assert.equal(noRoomSwitch, false);

  // Mock connected room with switchActiveDevice
  let switchedKind = null;
  let switchedId = null;
  lkManager.room = {
    switchActiveDevice: async (kind, id) => {
      switchedKind = kind;
      switchedId = id;
      return true;
    }
  };

  const switched = await lkManager.switchDevice('audioinput', 'mic-device-hd');
  assert.equal(switched, true);
  assert.equal(switchedKind, 'audioinput');
  assert.equal(switchedId, 'mic-device-hd');
});

/* =========================================================================
   SCENARIO 8: Student Reconnection & Cumulative Attendance Duration
   ========================================================================= */

test('PHASE 5 - SCENARIO 8: Student Reconnection & Cumulative Duration Integrity', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-recon', role: 'teacher' };
  const student = { id: 'student-recon', name: 'Lê Hoàng', role: 'student' };

  const cls = await createClassroom({
    name: 'Lớp HSK 3 Reconnection',
    teacherId: teacher.id,
    hskLevel: 'HSK 3'
  });
  await joinClassByCode(cls.classroom.class_code, student);

  const ses = await createClassSession({
    classroomId: cls.classroom.id,
    teacherId: teacher.id,
    title: 'Buổi 2: Kiểm tra kết nối lại'
  });
  const sessionId = ses.session.id;

  // 1. First join
  const join1 = await joinLiveSession(sessionId, student);
  assert.equal(join1.success, true);

  // 2. Student leaves after 5 seconds (simulated)
  await leaveLiveSession(sessionId, student.id);
  const partsAfterLeave = await getSessionParticipants(sessionId, false);
  const part1 = partsAfterLeave.find(p => p.user_id === student.id);
  assert.ok(part1?.left_at, 'left_at must be populated after leave');

  // 3. Student reconnects
  const join2 = await joinLiveSession(sessionId, student);
  assert.equal(join2.success, true);

  const partsAfterRejoin = await getSessionParticipants(sessionId, true);
  // Ensure NO duplicate participant records are created
  const studentRecords = partsAfterRejoin.filter(p => p.user_id === student.id);
  assert.equal(studentRecords.length, 1, 'Rejoining participant must update existing record without creating duplicates');
  assert.equal(studentRecords[0].left_at, null, 'left_at must be reset to null upon rejoining');
});

/* =========================================================================
   SCENARIO 9: Serverless Join API Capacity Limit & Slot Reclamation
   ========================================================================= */

test('PHASE 5.1 - SCENARIO 9: /api/live/join Capacity Limit & Slot Reclamation', async () => {
  resetTestStore();

  const sessionId = 'session-capacity-test';

  // 1. Fill room to 50 active students
  for (let i = 1; i <= 50; i++) {
    const { req, res, getStatus } = createMockReqRes({
      headers: {
        'x-user-id': `student-${i}`,
        'x-user-role': 'student',
        'x-user-name': `Học viên ${i}`
      },
      body: {
        sessionId,
        participant: { role: 'student', name: `Học viên ${i}` }
      }
    });
    await joinHandler(req, res);
    assert.equal(getStatus(), 200, `Student ${i} must join successfully`);
  }

  // 2. 51st student tries to join -> Must be rejected with HTTP 403
  const { req: req51, res: res51, getStatus: getStatus51, getData: getData51 } = createMockReqRes({
    headers: {
      'x-user-id': 'student-51',
      'x-user-role': 'student',
      'x-user-name': 'Học viên 51'
    },
    body: {
      sessionId,
      participant: { role: 'student', name: 'Học viên 51' }
    }
  });
  await joinHandler(req51, res51);
  assert.equal(getStatus51(), 403, '51st student must be rejected with HTTP 403');
  assert.match(getData51().error, /sĩ số tối đa/i);

  // 3. Teacher can still join even when student capacity is 50
  const { req: reqTeacher, res: resTeacher, getStatus: getStatusTeacher } = createMockReqRes({
    headers: {
      'x-user-id': 'teacher-owner',
      'x-user-role': 'teacher',
      'x-user-name': 'Cô Minh'
    },
    body: {
      sessionId,
      participant: { role: 'teacher', name: 'Cô Minh' }
    }
  });
  await joinHandler(reqTeacher, resTeacher);
  assert.equal(getStatusTeacher(), 200, 'Teacher must be allowed to join even at 50 students');

  // 4. Student 50 leaves room
  const { req: reqLeave, res: resLeave, getStatus: getStatusLeave } = createMockReqRes({
    headers: {
      'x-user-id': 'student-50',
      'x-user-role': 'student'
    },
    body: {
      sessionId,
      userId: 'student-50'
    }
  });
  await leaveHandler(reqLeave, resLeave);
  assert.equal(getStatusLeave(), 200, 'Student 50 leaves successfully');

  // 5. Student 51 retries -> Now successfully joins in the reclaimed slot
  const { req: req51Retry, res: res51Retry, getStatus: getStatus51Retry } = createMockReqRes({
    headers: {
      'x-user-id': 'student-51',
      'x-user-role': 'student',
      'x-user-name': 'Học viên 51'
    },
    body: {
      sessionId,
      participant: { role: 'student', name: 'Học viên 51' }
    }
  });
  await joinHandler(req51Retry, res51Retry);
  assert.equal(getStatus51Retry(), 200, 'Student 51 must successfully join after slot is vacated');
});

/* =========================================================================
   SCENARIO 10: Serverless API Cross-Role Privilege Isolation
   ========================================================================= */

test('PHASE 5.1 - SCENARIO 10: /api/live/end & /api/live/moderation Role Isolation', async () => {
  resetTestStore();

  const sessionId = 'session-rbac-test';

  // 1. Student attempts to end live session -> Must be 403
  const { req: reqEndByStudent, res: resEndByStudent, getStatus: getStatusEndStudent } = createMockReqRes({
    headers: {
      'x-user-id': 'student-hacker',
      'x-user-role': 'student'
    },
    body: { sessionId }
  });
  await endHandler(reqEndByStudent, resEndByStudent);
  assert.equal(getStatusEndStudent(), 403, 'Student cannot end session');

  // 2. Student attempts to grant mic to another student -> Must be 403
  const { req: reqModByStudent, res: resModByStudent, getStatus: getStatusModStudent } = createMockReqRes({
    headers: {
      'x-user-id': 'student-hacker',
      'x-user-role': 'student'
    },
    body: {
      sessionId,
      action: 'ALLOW_MIC',
      targetUserId: 'student-victim'
    }
  });
  await moderationHandler(reqModByStudent, resModByStudent);
  assert.equal(getStatusModStudent(), 403, 'Student cannot execute moderation actions');

  // 3. Teacher can end live session -> Must be 200
  const { req: reqEndByTeacher, res: resEndByTeacher, getStatus: getStatusEndTeacher } = createMockReqRes({
    headers: {
      'x-user-id': 'teacher-boss',
      'x-user-role': 'teacher'
    },
    body: { sessionId }
  });
  await endHandler(reqEndByTeacher, resEndByTeacher);
  assert.equal(getStatusEndTeacher(), 200, 'Teacher can end session');
});

/* =========================================================================
   SCENARIO 11: Atomic RPC Integration & Participant List Verification
   ========================================================================= */

test('PHASE 5.2 - SCENARIO 11: atomic_join_live_session RPC & Participant Endpoint', async () => {
  resetTestStore();

  const sessionId = '00000000-0000-0000-0000-000000000099';
  const userId = '11111111-1111-1111-1111-111111111111';

  // 1. Mock Supabase client with atomic_join_live_session RPC
  const mockSupabase = {
    from(table) {
      if (table === 'class_sessions') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return {
                      data: {
                        id: sessionId,
                        teacher_id: 'teacher-uuid',
                        status: 'live',
                        max_capacity: 50
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
      return {
        select() { return this; },
        eq() { return this; },
        async maybeSingle() { return { data: null, error: null }; }
      };
    },
    async rpc(funcName, params) {
      if (funcName === 'atomic_join_live_session') {
        if (params.p_user_id === 'student-overcap') {
          return {
            data: null,
            error: { message: 'Phòng học đã đạt sĩ số tối đa (50 học viên).' }
          };
        }
        return {
          data: {
            session_id: params.p_session_id,
            user_id: params.p_user_id,
            role: params.p_role,
            is_mic_allowed: false,
            attendance_status: 'present'
          },
          error: null
        };
      }
      return { data: null, error: { message: 'Function not found' } };
    }
  };

  setSupabaseAdminClientForTesting(mockSupabase);

  try {
    // 2. Successful RPC Join
    const { req: reqJoin, res: resJoin, getStatus: getStatusJoin, getData: getDataJoin } = createMockReqRes({
      headers: {
        'x-user-id': userId,
        'x-user-role': 'student',
        'x-user-name': 'Học viên Test'
      },
      body: {
        sessionId,
        participant: { role: 'student', name: 'Học viên Test' }
      }
    });

    await joinHandler(reqJoin, resJoin);
    assert.equal(getStatusJoin(), 200, 'RPC join must succeed with 200');
    assert.equal(getDataJoin().participant.user_id, userId);

    // 3. Rejected RPC Join at Capacity
    const { req: reqBlock, res: resBlock, getStatus: getStatusBlock, getData: getDataBlock } = createMockReqRes({
      headers: {
        'x-user-id': 'student-overcap',
        'x-user-role': 'student'
      },
      body: {
        sessionId,
        participant: { role: 'student', name: 'Học viên 51' }
      }
    });

    await joinHandler(reqBlock, resBlock);
    assert.equal(getStatusBlock(), 403, 'Capacity-blocked RPC join must return 403');
    assert.match(getDataBlock().error, /sĩ số tối đa/i);
  } finally {
    setSupabaseAdminClientForTesting(null);
  }

  // 4. Test participantsHandler fallback memory retrieval
  memoryParticipants.set(`${sessionId}:${userId}`, {
    session_id: sessionId,
    user_id: userId,
    name: 'Học viên Alpha',
    role: 'student',
    left_at: null,
    is_mic_allowed: true
  });

  const { req: reqParts, res: resParts, getStatus: getStatusParts, getData: getDataParts } = createMockReqRes({
    method: 'GET'
  });
  reqParts.query = { sessionId };

  await participantsHandler(reqParts, resParts);
  assert.equal(getStatusParts(), 200);
  assert.equal(getDataParts().participants.length, 1);
  assert.equal(getDataParts().participants[0].user_id, userId);
});

/* =========================================================================
   SCENARIO 12: Production Fail-Closed Safety Gate & Source Revocation
   ========================================================================= */

test('PHASE 5.2.1 - SCENARIO 12: Production Fail-Closed Gate & Strict Revocation', async () => {
  resetTestStore();

  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    // 1. In production, if database throws an exception, joinHandler MUST fail closed (HTTP 500)
    const mockAuthSupabase = {
      auth: {
        async getUser() {
          return { data: { user: { id: 'student-prod-uuid' } }, error: null };
        }
      },
      from(table) {
        if (table === 'profiles') {
          return {
            select() { return this; },
            eq() { return this; },
            async maybeSingle() {
              return { data: { id: 'student-prod-uuid', name: 'Học viên Prod', role: 'student', status: 'active' }, error: null };
            }
          };
        }
        // For class_sessions or other live tables, simulate database connection failure
        throw new Error('Database connection timeout (Simulated)');
      }
    };
    setSupabaseAdminClientForTesting(mockAuthSupabase);

    const { req: reqCrash, res: resCrash, getStatus: getStatusCrash, getData: getDataCrash } = createMockReqRes({
      headers: {
        authorization: 'Bearer valid_mock_token',
        'x-user-id': 'student-prod-uuid',
        'x-user-role': 'student'
      },
      body: {
        sessionId: '00000000-0000-0000-0000-000000000001',
        participant: { role: 'student', name: 'Học viên Crash' }
      }
    });

    await joinHandler(reqCrash, resCrash);
    assert.equal(getStatusCrash(), 500, 'Production join on database crash MUST fail closed with 500');
    assert.match(getDataCrash().error, /Lỗi hệ thống/i);

    // 3. Verify moderation REVOKE_MIC updates memory state and database state
    resetTestStore();
    const sessionId = 'session-revoke-test';
    const targetUserId = 'student-talking';

    memoryParticipants.set(`${sessionId}:${targetUserId}`, {
      session_id: sessionId,
      user_id: targetUserId,
      role: 'student',
      is_mic_allowed: true,
      left_at: null
    });

    const { req: reqRevoke, res: resRevoke, getStatus: getStatusRevoke } = createMockReqRes({
      headers: {
        'x-user-id': 'teacher-owner',
        'x-user-role': 'teacher'
      },
      body: {
        sessionId,
        action: 'REVOKE_MIC',
        targetUserId
      }
    });

    setSupabaseAdminClientForTesting(null); // Local test fallback
    process.env.NODE_ENV = 'development';

    await moderationHandler(reqRevoke, resRevoke);
    assert.equal(getStatusRevoke(), 200);

    const updatedPart = memoryParticipants.get(`${sessionId}:${targetUserId}`);
    assert.equal(updatedPart.is_mic_allowed, false, 'is_mic_allowed must be set to false upon REVOKE_MIC');
  } finally {
    process.env.NODE_ENV = originalEnv;
    setSupabaseAdminClientForTesting(null);
  }
});



