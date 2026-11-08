/**
 * =========================================================================
 * HANZI GO - LIVEKIT 50-USER CLASSROOM CAPACITY & LOAD TEST SUITE
 * =========================================================================
 * Phase 23 / Task 23.09: LiveKit 50-User Load Test & Classroom Capacity Validation
 *
 * Verifies:
 * 1. Token generation, role isolation & least privilege (teacher vs student)
 * 2. 50-student capacity limit enforcement (51st rejected with 403)
 * 3. Stepwise Connection Ramp-up (10 -> 20 -> 30 -> 40 -> 50 students)
 * 4. Full Classroom sustained session (1 teacher + 50 students = 51 participants)
 * 5. Audio publish / subscribe & server-side mic permission enforcement
 * 6. Video publish / subscribe & avatar fallback for non-publishers
 * 7. Screen sharing start, subscriber propagation, stop, and restart
 * 8. Network interruption & automated reconnection
 * 9. Participant churn & resource cleanup
 * 10. Teacher disconnect & presenter role recovery
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { TrackSource } from 'livekit-server-sdk';
import livekitTokenHandler from '../api/_webrtc/livekit-token.js';
import joinHandler from '../api/_handlers/live/join.js';
import leaveHandler from '../api/_handlers/live/leave.js';
import moderationHandler from '../api/_handlers/live/moderation.js';
import { memoryParticipants } from '../api/_utils/supabaseServer.js';
import { LiveKitLoadTester, SimulatedClassroomClient } from '../scripts/livekit_load_tester.js';

// Setup minimal polyfills for Node.js test environment
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

async function callHandler(handler, { method = 'POST', headers = {}, body = {} } = {}) {
  let statusCode = 200;
  let responseData = null;
  const req = { method, headers, body };
  const res = {
    status(code) { statusCode = code; return this; },
    json(data) { responseData = data; return this; }
  };
  await handler(req, res);
  return { status: statusCode, data: responseData };
}

/* =========================================================================
   GROUP 1: TOKEN GENERATION, ROLE VERIFICATION & ZERO-TRUST GRANTS
   ========================================================================= */

test('LiveKit 50-User Capacity: 1.1 Rejects unauthenticated token request with 401', async () => {
  const res = await callHandler(livekitTokenHandler, {
    method: 'POST',
    headers: {},
    body: { roomName: 'room-sec-1' }
  });
  assert.equal(res.status, 401);
  assert.ok(res.data?.error);
});

test('LiveKit 50-User Capacity: 1.2 Rejects missing roomName with 400', async () => {
  const res = await callHandler(livekitTokenHandler, {
    method: 'POST',
    headers: { 'x-user-id': 'teacher-01' },
    body: {}
  });
  assert.equal(res.status, 400);
  assert.ok(res.data?.error);
});

test('LiveKit 50-User Capacity: 1.3 Generates Teacher token with full publish grants & 30m TTL', async () => {
  const res = await callHandler(livekitTokenHandler, {
    method: 'POST',
    headers: { 'x-user-id': 'teacher-101' },
    body: {
      roomName: 'room-teacher-grant',
      userName: 'Thầy Trương',
      role: 'teacher'
    }
  });

  assert.equal(res.status, 200);
  assert.ok(res.data?.token);
  assert.equal(res.data?.role, 'teacher');

  const parts = res.data.token.split('.');
  assert.equal(parts.length, 3);
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));

  assert.equal(payload.video?.room, 'room-teacher-grant');
  assert.equal(payload.video?.canPublish, true, 'Teacher must have canPublish: true');
  assert.equal(payload.video?.canSubscribe, true);
  assert.equal(payload.video?.canPublishData, true);
  assert.ok(!payload.video?.canPublishSources, 'Teacher has unrestricted publish sources');
  assert.equal(payload.sub, 'teacher-101');
});

test('LiveKit 50-User Capacity: 1.4 Generates Student token with restricted grants (canPublish: false by default)', async () => {
  const res = await callHandler(livekitTokenHandler, {
    method: 'POST',
    headers: { 'x-user-id': 'student-101' },
    body: {
      roomName: 'room-student-grant',
      userName: 'Học viên A',
      role: 'student'
    }
  });

  assert.equal(res.status, 200);
  assert.ok(res.data?.token);
  assert.equal(res.data?.role, 'student');

  const parts = res.data.token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));

  assert.equal(payload.video?.room, 'room-student-grant');
  assert.equal(payload.video?.canPublish, false, 'Student default canPublish must be false');
  assert.equal(payload.video?.canSubscribe, true);
  assert.equal(payload.video?.canPublishData, true);
  assert.equal(payload.sub, 'student-101');
});

test('LiveKit 50-User Capacity: 1.5 Student granted mic can ONLY publish audio (TrackSource.MICROPHONE)', async () => {
  const roomName = 'room-mic-grant';
  const studentId = 'student-mic-allowed';

  // Seed mic permission in memory store
  memoryParticipants.set(`${roomName}:${studentId}`, {
    session_id: roomName,
    user_id: studentId,
    role: 'student',
    joined_at: new Date().toISOString(),
    left_at: null,
    is_mic_allowed: true
  });

  const res = await callHandler(livekitTokenHandler, {
    method: 'POST',
    headers: { 'x-user-id': studentId },
    body: {
      roomName,
      userName: 'Học viên Được Bật Mic',
      role: 'student'
    }
  });

  assert.equal(res.status, 200);
  const parts = res.data.token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));

  assert.equal(payload.video?.canPublish, true, 'Mic allowed student canPublish must be true');
  assert.ok(
    payload.video?.canPublishSources?.includes('microphone') || payload.video?.canPublishSources?.includes(TrackSource.MICROPHONE),
    'Must be strictly limited to MICROPHONE'
  );
  assert.equal(payload.video?.canPublishSources?.length, 1, 'Only microphone permitted');

  memoryParticipants.delete(`${roomName}:${studentId}`);
});

test('LiveKit 50-User Capacity: 1.6 Prevents Student from escalating to Teacher role', async () => {
  const res = await callHandler(livekitTokenHandler, {
    method: 'POST',
    headers: { 'x-user-id': 'student-hacker' },
    body: {
      roomName: 'room-role-spoof',
      userName: 'Impostor',
      role: 'teacher' // Malicious client attempts self-assigned teacher role
    }
  });

  assert.equal(res.status, 200);
  // Authoritative server rejects escalation: student identity retains student role
  assert.equal(res.data?.role, 'student');
  const parts = res.data.token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
  assert.equal(payload.video?.canPublish, false, 'Impostor cannot publish');
});

/* =========================================================================
   GROUP 2: 50-STUDENT CAPACITY ENFORCEMENT & 51ST REJECTION
   ========================================================================= */

test('LiveKit 50-User Capacity: 2.1 Enforces strict 50-student cap (51st student rejected with 403)', async () => {
  const roomName = `room-cap-test-${Date.now()}`;

  // 1. Add 1 teacher
  const teacherRes = await callHandler(joinHandler, {
    method: 'POST',
    headers: { 'x-user-id': `teacher-${roomName}` },
    body: { sessionId: roomName, participant: { role: 'teacher' } }
  });
  assert.equal(teacherRes.status, 200);

  // 2. Add 50 students
  for (let i = 1; i <= 50; i++) {
    const sId = `student-${roomName}-${i}`;
    const sJoin = await callHandler(joinHandler, {
      method: 'POST',
      headers: { 'x-user-id': sId },
      body: { sessionId: roomName, participant: { role: 'student', user_id: sId } }
    });
    assert.equal(sJoin.status, 200, `Student ${i} must join successfully`);
  }

  // 3. Attempt to add 51st student -> Must return 403
  const excessId = `student-${roomName}-excess-51`;
  const excessJoin = await callHandler(joinHandler, {
    method: 'POST',
    headers: { 'x-user-id': excessId },
    body: { sessionId: roomName, participant: { role: 'student', user_id: excessId } }
  });
  assert.equal(excessJoin.status, 403);
  assert.match(excessJoin.data?.error, /sĩ số tối đa \(50 học viên\)/);

  // 4. Token endpoint also rejects 51st student
  const excessToken = await callHandler(livekitTokenHandler, {
    method: 'POST',
    headers: { 'x-user-id': excessId },
    body: { roomName, role: 'student' }
  });
  assert.equal(excessToken.status, 403);
  assert.match(excessToken.data?.error, /sĩ số tối đa/);

  // Cleanup
  for (const k of Array.from(memoryParticipants.keys())) {
    if (k.startsWith(`${roomName}:`)) memoryParticipants.delete(k);
  }
});

test('LiveKit 50-User Capacity: 2.2 Student leaving frees capacity slot for next student', async () => {
  const roomName = `room-slot-reuse-${Date.now()}`;

  // Fill 50 students
  for (let i = 1; i <= 50; i++) {
    const sId = `student-${roomName}-${i}`;
    await callHandler(joinHandler, {
      method: 'POST',
      headers: { 'x-user-id': sId },
      body: { sessionId: roomName, participant: { role: 'student', user_id: sId } }
    });
  }

  // Verify 51st is blocked
  const blockedRes = await callHandler(joinHandler, {
    method: 'POST',
    headers: { 'x-user-id': `student-${roomName}-51` },
    body: { sessionId: roomName, participant: { role: 'student' } }
  });
  assert.equal(blockedRes.status, 403);

  // Student 1 leaves
  await callHandler(leaveHandler, {
    method: 'POST',
    headers: { 'x-user-id': `student-${roomName}-1` },
    body: { sessionId: roomName, userId: `student-${roomName}-1` }
  });

  // Now student 51 can join
  const allowedRes = await callHandler(joinHandler, {
    method: 'POST',
    headers: { 'x-user-id': `student-${roomName}-51` },
    body: { sessionId: roomName, participant: { role: 'student', user_id: `student-${roomName}-51` } }
  });
  assert.equal(allowedRes.status, 200, 'Slot must be freed when a student leaves');

  // Cleanup
  for (const k of Array.from(memoryParticipants.keys())) {
    if (k.startsWith(`${roomName}:`)) memoryParticipants.delete(k);
  }
});

/* =========================================================================
   GROUP 3: 8 SCENARIOS END-TO-END LOAD TEST ORCHESTRATION
   ========================================================================= */

test('LiveKit 50-User Capacity: 3.1 Executes full 8-scenario load test suite with 1 Teacher + 50 Students', async () => {
  const sessionId = `loadtest-e2e-${Date.now()}`;
  const tester = new LiveKitLoadTester({
    sessionId,
    targetStudents: 50,
    rampStep: 10,
    sustainedDurationMs: 100
  });

  const results = await tester.runFullSuite();

  // Verify Scenario 1: Connection Ramp-up
  assert.equal(results.rampUp.length, 5, 'Must have 5 ramp-up tiers (10, 20, 30, 40, 50)');
  assert.equal(results.rampUp[4].cumulativeStudents, 50, 'Final ramp tier must reach 50 students');
  assert.equal(results.rampUp[4].totalParticipants, 51, 'Total participants must be 51 (1 teacher + 50 students)');
  for (const tier of results.rampUp) {
    assert.equal(tier.successRate, 100, `Tier ${tier.tier} must have 100% success rate`);
    assert.ok(tier.avgJoinLatencyMs >= 0, 'Join latency must be non-negative');
  }

  // Verify Scenario 2: Full Classroom
  const fc = results.scenarios.fullClassroom;
  assert.equal(fc.actualParticipants, 51);
  assert.equal(fc.activeStudentCount, 50);
  assert.equal(fc.teacherConnected, true);
  assert.equal(fc.isStable, true);

  // Verify Scenario 3: Audio
  const aud = results.scenarios.audio;
  assert.equal(aud.teacherAudioPublished, true);
  assert.equal(aud.unauthorizedStudentBlocked, true);
  assert.equal(aud.teacherGrantedMicSuccess, true);
  assert.equal(aud.authorizedStudentAudioPublished, true);
  assert.equal(aud.audioSubscribersFanout, 50);

  // Verify Scenario 4: Video & Avatar Fallback
  const vid = results.scenarios.video;
  assert.equal(vid.teacherVideoPublished, true);
  assert.equal(vid.videoSubscribers, 50);
  assert.equal(vid.activeVideoPublishers, 1);
  assert.equal(vid.avatarFallbackCount, 50);

  // Verify Scenario 5: Screen Sharing
  const ss = results.scenarios.screenSharing;
  assert.equal(ss.screenShareStarted, true);
  assert.equal(ss.subscribersInitial, 50);
  assert.equal(ss.screenShareStopped, true);
  assert.equal(ss.subscribersCleared, true);
  assert.equal(ss.screenShareRestarted, true);
  assert.equal(ss.subscribersRestored, 50);

  // Verify Scenario 6: Reconnection
  const rec = results.scenarios.reconnection;
  assert.equal(rec.interruptedCount, 5);
  assert.equal(rec.reconnectedCount, 5);
  assert.equal(rec.reconnectSuccessRate, 100);

  // Verify Scenario 7: Churn & Capacity Cap
  const ch = results.scenarios.churnAndCapacity;
  assert.equal(ch.churnGroupLeft, 10);
  assert.equal(ch.replenishedGroupJoined, 10);
  assert.equal(ch.currentActiveStudents, 50);
  assert.equal(ch.excessStudentRejected, true);
  assert.equal(ch.excessStudentStatusCode, 403);
  assert.equal(ch.capacityEnforcementValid, true);

  // Verify Scenario 8: Teacher Disconnect & Presenter Recovery
  const tr = results.scenarios.teacherRecovery;
  assert.equal(tr.teacherDisconnectHandled, true);
  assert.equal(tr.teacherReconnected, true);
  assert.equal(tr.teacherPublishRestored, true);
  assert.equal(tr.classroomContinuityMaintained, true);

  // Verify Overall Summary
  const sum = results.summary;
  assert.equal(sum.maxCapacityReached, 51);
  assert.equal(sum.maxStudentsTested, 50);
  assert.equal(sum.teacherCount, 1);
  assert.equal(sum.connectionSuccessRatePercent, 100);
  assert.equal(sum.capacityCapEnforced, true);
  assert.equal(sum.zeroDanglingResources, true);
});
