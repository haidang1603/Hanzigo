import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/newsletter/subscribe.js';

test('Newsletter API: GET returns today featured lesson', async () => {
  const req = {
    method: 'GET',
    headers: {}
  };

  let statusCode = 0;
  let responseData = null;

  const res = {
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
        }
      };
    }
  };

  await handler(req, res);

  assert.equal(statusCode, 200);
  assert.equal(responseData.success, true);
  assert.ok(responseData.lesson);
  assert.ok(responseData.lesson.character);
  assert.ok(responseData.lesson.pinyin);
});

test('Newsletter API: POST validates invalid email format', async () => {
  const req = {
    method: 'POST',
    headers: { 'x-forwarded-for': '127.0.0.1' },
    body: { email: 'invalid-email-address' }
  };

  let statusCode = 0;
  let responseData = null;

  const res = {
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
        }
      };
    }
  };

  await handler(req, res);

  assert.equal(statusCode, 400);
  assert.match(responseData.error, /định dạng/);
});

test('Newsletter API: POST accepts valid email and delivers lesson payload', async () => {
  const req = {
    method: 'POST',
    headers: { 'x-forwarded-for': '10.0.0.99' },
    body: { email: 'student.test@example.com' }
  };

  let statusCode = 0;
  let responseData = null;

  const res = {
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
        }
      };
    }
  };

  await handler(req, res);

  assert.equal(statusCode, 200);
  assert.equal(responseData.success, true);
  assert.ok(responseData.lesson);
  assert.ok(responseData.lesson.mnemonic);
});

