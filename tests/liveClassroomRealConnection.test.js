import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Auto-load .env in Node test runtime if present
try {
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
} catch {}

import {
  createClassroom,
  joinClassByCode
} from '../src/services/classroomService.js';
import {
  createClassSession,
  joinLiveSession,
  leaveLiveSession,
  getSessionParticipants,
  verifySessionAccess,
  raiseHand,
  lowerHand,
  allowStudentMic,
  revokeStudentMic,
  muteAllParticipants,
  kickParticipant,
  lockRoom,
  endLiveSession,
  getSessionAttendanceReport,
  setTeachingBoardChar,
  getLiveTeachingState,
  getActiveSessionForClass,
  getSessionById
} from '../src/services/liveClassroomService.js';
import { fetchLiveKitToken, LiveKitClassroomManager } from '../src/services/livekitService.js';

test('TEST A: Two different accounts — Teacher starts session and student joins', async () => {
  // 1. Teacher creates classroom
  const cls = await createClassroom({
    teacherId: 'teacher-acc-1',
    name: 'Lớp HSK 3 - Giao tiếp Thực chiến',
    hskLevel: 'HSK 3'
  });
  assert.equal(cls.success, true);
  const classId = cls.classroom.id;
  const classCode = cls.classroom.class_code;

  // 2. Student joins the classroom first
  const student = {
    uid: 'student-acc-2',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@test.com',
    role: 'student'
  };
  const joinClassRes = await joinClassByCode(classCode, student);
  assert.equal(joinClassRes.success, true);

  // 3. Teacher starts live session
  const ses = await createClassSession({
    classroomId: classId,
    teacherId: 'teacher-acc-1',
    title: 'Buổi học Live: Khẩu ngữ HSK 3'
  });
  assert.equal(ses.success, true);
  const sessionId = ses.session.id;

  // 4. Teacher joins session
  const teacherUser = {
    uid: 'teacher-acc-1',
    name: 'Giáo viên Chủ nhiệm',
    role: 'teacher'
  };
  const teacherJoin = await joinLiveSession(sessionId, teacherUser);
  assert.equal(teacherJoin.success, true);
  assert.equal(teacherJoin.role, 'teacher');

  // 5. Student joins session
  const studentJoin = await joinLiveSession(sessionId, student);
  assert.equal(studentJoin.success, true);
  assert.equal(studentJoin.role, 'student');

  // 6. Verify participants list contains BOTH teacher and student
  const participants = await getSessionParticipants(sessionId, true);
  assert.equal(participants.length, 2);
  assert.ok(participants.some(p => p.user_id === 'teacher-acc-1' && p.role === 'teacher'));
  assert.ok(participants.some(p => p.user_id === 'student-acc-2' && p.role === 'student'));
});

test('TEST B & C: Media permissions and Teacher moderation (Allow Mic, Revoke Mic, Mute All)', async () => {
  const cls = await createClassroom({
    teacherId: 'teacher-mod-1',
    name: 'Lớp Luyện phát âm ngữ điệu',
    hskLevel: 'HSK 2'
  });
  const ses = await createClassSession({
    classroomId: cls.classroom.id,
    teacherId: 'teacher-mod-1',
    title: 'Kiểm tra phát âm'
  });
  const sessionId = ses.session.id;

  const student = { uid: 'student-mic-1', name: 'Lê Hoàng Nam', role: 'student' };
  await joinClassByCode(cls.classroom.class_code, student);
  await joinLiveSession(sessionId, student);

  // Student raises hand
  await raiseHand(sessionId, student.uid);
  let parts = await getSessionParticipants(sessionId, true);
  let stuPart = parts.find(p => p.user_id === student.uid);
  assert.equal(stuPart.hand_raised, true);
  assert.equal(stuPart.is_mic_allowed, false);

  // Teacher grants mic permission
  const allowRes = await allowStudentMic(sessionId, 'teacher-mod-1', student.uid);
  assert.equal(allowRes.success, true);

  parts = await getSessionParticipants(sessionId, true);
  stuPart = parts.find(p => p.user_id === student.uid);
  assert.equal(stuPart.is_mic_allowed, true);
  assert.equal(stuPart.hand_raised, false); // Lower hand automatically upon mic grant

  // Teacher revokes mic permission
  const revokeRes = await revokeStudentMic(sessionId, 'teacher-mod-1', student.uid);
  assert.equal(revokeRes.success, true);

  parts = await getSessionParticipants(sessionId, true);
  stuPart = parts.find(p => p.user_id === student.uid);
  assert.equal(stuPart.is_mic_allowed, false);

  // Mute All test
  await allowStudentMic(sessionId, 'teacher-mod-1', student.uid);
  const muteAllRes = await muteAllParticipants(sessionId, 'teacher-mod-1');
  assert.equal(muteAllRes.success, true);

  parts = await getSessionParticipants(sessionId, true);
  stuPart = parts.find(p => p.user_id === student.uid);
  assert.equal(stuPart.is_mic_allowed, false);
});

test('TEST D & H: Teaching tool synchronization and screen sharing state', async () => {
  const cls = await createClassroom({
    teacherId: 'teacher-tool-sync',
    name: 'Lớp Chữ Hán Chuyên Sâu',
    hskLevel: 'HSK 1'
  });
  const ses = await createClassSession({
    classroomId: cls.classroom.id,
    teacherId: 'teacher-tool-sync',
    title: 'Học bộ thủ và quy tắc bút thuận'
  });
  const sessionId = ses.session.id;

  // Teacher changes active Hanzi whiteboard content
  const updateRes = await setTeachingBoardChar(sessionId, 'teacher-tool-sync', {
    char: '学',
    pinyin: 'xué',
    meaning: 'Học tập',
    strokes: 8
  });
  assert.equal(updateRes.success, true);

  // Student queries current teaching state and verifies synchronization
  const state = await getLiveTeachingState(sessionId);
  assert.ok(state);
  assert.equal(state.side_board_state.char, '学');
  assert.equal(state.side_board_state.pinyin, 'xué');
  assert.equal(state.side_board_state.meaning, 'Học tập');
});

test('TEST E: Reconnect resilience without duplicate attendance records', async () => {
  const cls = await createClassroom({
    teacherId: 'teacher-reconnect-1',
    name: 'Lớp Luyện Nghe HSK 2',
    hskLevel: 'HSK 2'
  });
  const ses = await createClassSession({
    classroomId: cls.classroom.id,
    teacherId: 'teacher-reconnect-1',
    title: 'Buổi nghe hội thoại'
  });
  const sessionId = ses.session.id;

  const student = { uid: 'student-recon-1', name: 'Trần Bảo Ngọc', role: 'student' };
  await joinClassByCode(cls.classroom.class_code, student);

  // First join
  await joinLiveSession(sessionId, student);
  let parts = await getSessionParticipants(sessionId, false);
  assert.equal(parts.filter(p => p.user_id === student.uid).length, 1);

  // Student network disconnects
  await leaveLiveSession(sessionId, student.uid);
  parts = await getSessionParticipants(sessionId, false);
  let pRecord = parts.find(p => p.user_id === student.uid);
  assert.ok(pRecord.left_at, 'left_at must be populated');

  // Student reconnects
  await joinLiveSession(sessionId, student);
  parts = await getSessionParticipants(sessionId, false);
  // Must NOT create duplicate participant records for the same user
  const matchingRecords = parts.filter(p => p.user_id === student.uid);
  assert.equal(matchingRecords.length, 1, 'Should retain single unified record on reconnect');
  assert.equal(matchingRecords[0].left_at, null, 'left_at must be cleared on reconnect');
  assert.ok(matchingRecords[0].reconnected_at, 'reconnected_at must be recorded');
});

test('TEST F: Security — Non-enrolled user cannot access live session', async () => {
  const cls = await createClassroom({
    teacherId: 'teacher-sec-1',
    name: 'Lớp Bảo Mật Cao',
    hskLevel: 'HSK 4'
  });
  const ses = await createClassSession({
    classroomId: cls.classroom.id,
    teacherId: 'teacher-sec-1',
    title: 'Buổi học kín'
  });
  const sessionId = ses.session.id;

  // Intruder account that has NOT joined the classroom
  const intruder = {
    uid: 'user-intruder-999',
    name: 'Kẻ xâm nhập',
    role: 'student'
  };

  const access = await verifySessionAccess(sessionId, intruder);
  assert.equal(access.allowed, false);
  assert.match(access.reason, /chưa tham gia lớp học/);

  const joinRes = await joinLiveSession(sessionId, intruder);
  assert.equal(joinRes.success, false);
});

test('TEST G: SFU Token validation & role-based grants', async () => {
  const teacherUser = { uid: 'teacher-jwt-1', name: 'Giáo viên', role: 'teacher' };
  const studentUser = { uid: 'student-jwt-1', name: 'Học viên', role: 'student' };

  // Fetch teacher LiveKit token
  const teacherToken = await fetchLiveKitToken({
    sessionId: 'session-jwt-room-1',
    user: teacherUser,
    role: 'teacher'
  });
  assert.equal(teacherToken.success, true);
  assert.ok(teacherToken.token);

  // Fetch student LiveKit token
  const studentToken = await fetchLiveKitToken({
    sessionId: 'session-jwt-room-1',
    user: studentUser,
    role: 'student'
  });
  assert.equal(studentToken.success, true);
  assert.ok(studentToken.token);

  // Verify token format (standard 3-segment JWT)
  const segments = teacherToken.token.split('.');
  assert.equal(segments.length, 3, 'Token must be a valid signed JWT');
});

test('TEST H: End live session flow, participant closure, and attendance report', async () => {
  const cls = await createClassroom({
    teacherId: 'teacher-end-1',
    name: 'Lớp Luyện Thi HSK 5',
    hskLevel: 'HSK 5'
  });
  const classId = cls.classroom.id;

  const studentA = { uid: 'student-att-1', name: 'Trần Văn An', role: 'student' };
  const studentB = { uid: 'student-att-2', name: 'Lê Thị Bình', role: 'student' };
  await joinClassByCode(cls.classroom.class_code, studentA);
  await joinClassByCode(cls.classroom.class_code, studentB);

  const ses = await createClassSession({
    classroomId: classId,
    teacherId: 'teacher-end-1',
    title: 'Buổi 1: Đọc hiểu và Từ vựng'
  });
  const sessionId = ses.session.id;

  // Student A joins
  await joinLiveSession(sessionId, studentA);

  // Teacher ends session
  const endResult = await endLiveSession(sessionId, 'teacher-end-1');
  assert.equal(endResult.success, true, 'endLiveSession must succeed');
  assert.ok(endResult.endedAt, 'endedAt must be defined');

  // Verify session status is ended
  const verifyAfterEnd = await verifySessionAccess(sessionId, studentA);
  assert.equal(verifyAfterEnd.allowed, false, 'Ended session must not allow entry');
  assert.match(verifyAfterEnd.reason, /đã kết thúc/);

  // Verify participants have left_at populated
  const participants = await getSessionParticipants(sessionId, false);
  const stuPart = participants.find(p => p.user_id === 'student-att-1');
  assert.ok(stuPart, 'Student participant must exist');
  assert.ok(stuPart.left_at, 'Student participant must be marked as left when session ends');

  // Generate attendance report
  const report = await getSessionAttendanceReport(sessionId, 'teacher-end-1');
  assert.equal(report.success, true);
  assert.equal(report.totalEnrolled, 2);
  assert.equal(report.presentCount + report.lateCount, 1);
  assert.equal(report.absentCount, 1);
  assert.ok(report.attendanceRate > 0);
});

test('TEST I: Active live session discovery by student across classroom views', async () => {
  const cls = await createClassroom({
    teacherId: 'teacher-discover-1',
    name: 'Lớp Luyện Thi HSK 4 - Cấp Tốc',
    hskLevel: 'HSK 4'
  });
  const classId = cls.classroom.id;

  // Before teacher starts live, student sees NO active session
  const beforeStart = await getActiveSessionForClass(classId);
  assert.equal(beforeStart, null, 'No live session should exist initially');

  // Teacher starts live session
  const ses = await createClassSession({
    classroomId: classId,
    teacherId: 'teacher-discover-1',
    title: 'Buổi học trực tiếp: Ôn từ vựng HSK 4'
  });
  assert.equal(ses.success, true);
  const activeSessionId = ses.session.id;

  // Student queries active session for classroom -> must find it!
  const activeSession = await getActiveSessionForClass(classId);
  assert.ok(activeSession, 'Student must discover the active live session');
  assert.equal(activeSession.id, activeSessionId);
  assert.equal(activeSession.status, 'live');

  // Student verifies session details by ID
  const sessionDetail = await getSessionById(activeSessionId);
  assert.ok(sessionDetail, 'Student must retrieve session by ID');
  assert.equal(sessionDetail.id, activeSessionId);
  assert.equal(sessionDetail.classroom_id, classId);
});

test('TEST J: LiveKitClassroomManager screen share track detection and state lifecycle', async () => {
  const lkManager = new LiveKitClassroomManager();
  assert.equal(lkManager.teacherScreenTrack, null);
  assert.equal(lkManager.localScreenTrack, null);

  // Verify track subscribed properly distinguishes screen share from camera
  let streamNotification = null;
  lkManager.onTeacherStreamChange = (data) => {
    streamNotification = data;
  };

  const fakeParticipant = {
    identity: 'teacher-screen-demo',
    metadata: JSON.stringify({ role: 'teacher' }),
    trackPublications: new Map()
  };

  const fakeScreenTrack = {
    kind: 'video',
    source: 'screen_share',
    attach: () => {},
    detach: () => []
  };

  const fakePublication = {
    source: 'screen_share',
    track: fakeScreenTrack,
    isSubscribed: true
  };

  // Simulate TrackSubscribed for screen share
  lkManager._handleTrackSubscribed(fakeScreenTrack, fakePublication, fakeParticipant);
  assert.equal(lkManager.teacherScreenTrack, fakeScreenTrack, 'Screen track must be assigned to teacherScreenTrack');
  assert.equal(lkManager.teacherVideoTrack, null, 'Screen track must NOT be misassigned to teacherVideoTrack');
  assert.equal(streamNotification?.screenTrack, fakeScreenTrack);

  // Simulate TrackUnsubscribed for screen share
  lkManager._handleTrackUnsubscribed(fakeScreenTrack, fakePublication, fakeParticipant);
  assert.equal(lkManager.teacherScreenTrack, null, 'Screen track must be cleared on unsubscribe');
  assert.equal(streamNotification?.screenTrack, null);

  // Disconnect cleanup
  await lkManager.disconnect();
  assert.equal(lkManager.isConnected, false);
});

test('TEST K: Session lifecycle - When teacher ends live session, getActiveSessionForClass returns null and invalidates cache', async () => {
  // 1. Create class & session
  const cls = await createClassroom({
    teacherId: 'teacher-k-1',
    name: 'Lớp HSK 5 Nâng cao',
    hskLevel: 'HSK 5'
  });
  assert.equal(cls.success, true);
  const classId = cls.classroom.id;

  const ses = await createClassSession({
    classroomId: classId,
    teacherId: 'teacher-k-1',
    title: 'Buổi học HSK 5 Trực tuyến'
  });
  assert.equal(ses.success, true);
  const sessionId = ses.session.id;

  // 2. Before ending: getActiveSessionForClass returns the live session
  const activeBefore = await getActiveSessionForClass(classId);
  assert.ok(activeBefore, 'Session must be active before ending');
  assert.equal(activeBefore.id, sessionId);
  assert.equal(activeBefore.status, 'live');

  // 3. Teacher ends the session
  const endRes = await endLiveSession(sessionId, 'teacher-k-1');
  assert.equal(endRes.success, true);

  // 4. After ending: getActiveSessionForClass immediately returns null and does NOT resurrect old session
  const activeAfter = await getActiveSessionForClass(classId);
  assert.equal(activeAfter, null, 'Active session must be null after session is ended');

  // 5. getSessionById shows status === ended
  const sessionDetail = await getSessionById(sessionId);
  assert.equal(sessionDetail.status, 'ended', 'Session status must be ended');
  assert.ok(sessionDetail.ended_at, 'Session must have ended_at timestamp');
});



