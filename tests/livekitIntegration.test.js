import test from 'node:test';
import assert from 'node:assert/strict';
import livekitTokenHandler from '../api/_webrtc/livekit-token.js';
import { LiveKitClassroomManager } from '../src/services/livekitService.js';

test('LiveKit Token: Rejects unauthenticated requests with 401', async () => {
  let statusCode = 0;
  let jsonResult = null;

  const req = {
    method: 'POST',
    headers: {},
    body: {
      roomName: 'room-101'
    }
  };

  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          jsonResult = data;
        }
      };
    }
  };

  await livekitTokenHandler(req, res);
  assert.equal(statusCode, 401);
  assert.ok(jsonResult?.error);
});

test('LiveKit Token: Rejects request missing roomName with 400', async () => {
  let statusCode = 0;
  let jsonResult = null;

  const req = {
    method: 'POST',
    headers: {
      'x-user-id': 'test-teacher-id'
    },
    body: {}
  };

  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          jsonResult = data;
        }
      };
    }
  };

  await livekitTokenHandler(req, res);
  assert.equal(statusCode, 400);
  assert.ok(jsonResult?.error);
});

test('LiveKit Token: Generates valid access token for Teacher with publish grants', async () => {
  let statusCode = 0;
  let jsonResult = null;

  const req = {
    method: 'POST',
    headers: {
      'x-user-id': 'teacher-01'
    },
    body: {
      roomName: 'hsk3-classroom-live',
      userName: 'Thầy Trương',
      role: 'teacher'
    }
  };

  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          jsonResult = data;
        }
      };
    }
  };

  await livekitTokenHandler(req, res);
  assert.equal(statusCode, 200);
  assert.ok(jsonResult?.token, 'Token must be generated');
  assert.equal(jsonResult?.role, 'teacher');
  assert.equal(jsonResult?.roomName, 'hsk3-classroom-live');

  // Verify JWT structure (header.payload.signature)
  const parts = jsonResult.token.split('.');
  assert.equal(parts.length, 3, 'JWT must have 3 segments');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
  assert.equal(payload.video?.room, 'hsk3-classroom-live');
  assert.equal(payload.video?.canPublish, true, 'Teacher must have canPublish: true');
  assert.equal(payload.video?.canSubscribe, true);
  assert.equal(payload.sub, 'teacher-01');
});

test('LiveKit Token: Generates restricted access token for Student (canPublish: false by default)', async () => {
  let statusCode = 0;
  let jsonResult = null;

  const req = {
    method: 'POST',
    headers: {
      'x-user-id': 'student-01'
    },
    body: {
      roomName: 'hsk3-classroom-live',
      userName: 'Nguyễn Văn A',
      role: 'student'
    }
  };

  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          jsonResult = data;
        }
      };
    }
  };

  await livekitTokenHandler(req, res);
  assert.equal(statusCode, 200);
  assert.ok(jsonResult?.token);
  assert.equal(jsonResult?.role, 'student');

  const parts = jsonResult.token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
  assert.equal(payload.video?.room, 'hsk3-classroom-live');
  assert.equal(payload.video?.canPublish, false, 'Student default canPublish must be false');
  assert.equal(payload.video?.canSubscribe, true, 'Student can subscribe');
  assert.equal(payload.sub, 'student-01');
});

test('LiveKit Manager: Handles connection lifecycle and graceful offline fallback', async () => {
  const manager = new LiveKitClassroomManager();
  assert.equal(manager.isConnected, false);
  assert.equal(manager.teacherVideoTrack, null);
  assert.equal(manager.teacherAudioTrack, null);

  // Connect without configured server URL should gracefully degrade without crashing
  const result = await manager.connect({
    sessionId: 'session-demo',
    user: { id: 'student-99', name: 'Test Student' },
    role: 'student'
  });

  // Should succeed gracefully or return structured fallback
  assert.ok(result);
  await manager.disconnect();
  assert.equal(manager.isConnected, false);
});
