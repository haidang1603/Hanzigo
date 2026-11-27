import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDiagnosticPayload,
  sendTelemetryPayload,
  __resetErrorReporterForTests,
  TELEMETRY_CONSTANTS,
} from '../src/core/telemetry/errorReporter.js';
import handler, {
  redactSensitiveData,
  sanitizeClientErrorPayload,
} from '../api/_handlers/telemetry/client-error.js';

function createMockRes() {
  const headers = {};
  let statusCode = 200;
  let jsonBody = null;
  let ended = false;
  return {
    headersSent: false,
    setHeader(k, v) {
      headers[k.toLowerCase()] = v;
    },
    status(code) {
      statusCode = code;
      return {
        json(payload) {
          jsonBody = payload;
          return payload;
        },
        end() {
          ended = true;
        },
      };
    },
    getStatus: () => statusCode,
    getJson: () => jsonBody,
    getHeaders: () => headers,
    isEnded: () => ended,
  };
}

test('Client Error Telemetry: strips PII, JWT, Bearer tokens, and truncates stack <= 1500 chars', () => {
  __resetErrorReporterForTests();

  const longStack = 'at Component (app.js:10:5)\n'.repeat(120);
  const err = new Error(
    'Failed for user@hanzigo.vn with Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.sig password="Secret123"'
  );
  err.name = 'TypeError';

  const payload = buildDiagnosticPayload(err, {
    routePath: '/#community?token=abc_secret_99',
    componentStack: longStack,
  });

  assert.equal(payload.error_name, 'TypeError');
  assert.equal(payload.error_message.includes('user@hanzigo.vn'), false);
  assert.equal(payload.error_message.includes('eyJhbGciOiJIUzI1NiJ9'), false);
  assert.equal(payload.error_message.includes('Secret123'), false);
  assert.equal(payload.route.includes('abc_secret_99'), false);
  assert.ok(payload.component_stack_short.length <= TELEMETRY_CONSTANTS.MAX_COMPONENT_STACK_CHARS);

  const serverClean = redactSensitiveData({
    msg: 'Email admin@hanzigo.vn cookie=sid_12345',
    nested: ['Bearer tok_987654'],
  });
  assert.equal(serverClean.msg.includes('admin@hanzigo.vn'), false);
  assert.equal(serverClean.msg.includes('sid_12345'), false);
  assert.equal(serverClean.nested[0].includes('tok_987654'), false);

  const serverRow = sanitizeClientErrorPayload({
    error_message: 'Crash for tester@gmail.com',
    component_stack_short: 'X'.repeat(2500),
  });
  assert.equal(serverRow.error_message.includes('tester@gmail.com'), false);
  assert.equal(serverRow.component_stack_short.length, 1500);
});

test('Client Error Telemetry: deduplicates fingerprints per session and caps at 5 events', async () => {
  __resetErrorReporterForTests();

  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 202 };
  };

  const p1 = buildDiagnosticPayload(new Error('Same error'), { routePath: '/#hsk' });
  const r1 = await sendTelemetryPayload(p1, { forceSend: true, fetchFn: fetchMock, navigatorObj: {} });
  const r2 = await sendTelemetryPayload(p1, { forceSend: true, fetchFn: fetchMock, navigatorObj: {} });

  assert.equal(r1.sent, true);
  assert.equal(r1.method, 'fetch');
  assert.equal(r1.init?.keepalive, undefined);
  assert.equal(calls[0].init.keepalive, true);
  assert.equal(r2.sent, false);
  assert.equal(r2.reason, 'session_deduped');

  // Send 4 more unique errors -> reaches cap of 5
  for (let i = 2; i <= 5; i += 1) {
    const p = buildDiagnosticPayload(new Error(`Unique error ${i}`), { routePath: `/#route-${i}` });
    const res = await sendTelemetryPayload(p, { forceSend: true, fetchFn: fetchMock, navigatorObj: {} });
    assert.equal(res.sent, true);
  }

  // 6th unique error must be dropped by session cap
  const p6 = buildDiagnosticPayload(new Error('Unique error 6'), { routePath: '/#route-6' });
  const r6 = await sendTelemetryPayload(p6, { forceSend: true, fetchFn: fetchMock, navigatorObj: {} });
  assert.equal(r6.sent, false);
  assert.equal(r6.reason, 'session_cap');
  assert.equal(calls.length, 5);
});

test('Client Error Telemetry: fail-silent when sendBeacon throws or fetch rejects', async () => {
  __resetErrorReporterForTests();

  const payload = buildDiagnosticPayload(new Error('Network down error'), { routePath: '/#classroom' });
  const brokenNav = {
    sendBeacon() {
      throw new Error('Beacon blocked');
    },
  };
  const brokenFetch = async () => {
    throw new Error('ECONNREFUSED');
  };

  const res = await sendTelemetryPayload(payload, {
    forceSend: true,
    navigatorObj: brokenNav,
    fetchFn: brokenFetch,
  });

  assert.equal(res.sent, false);
  assert.equal(res.reason, 'fail_silent');
});

test('Client Error Telemetry API handler: validates method, payload, CORS, and rate-limit', async () => {
  const getRes = createMockRes();
  await handler({ method: 'GET', headers: {} }, getRes);
  assert.equal(getRes.getStatus(), 405);

  const badRes = createMockRes();
  await handler(
    { method: 'POST', headers: { 'x-real-ip': '10.0.0.51' }, body: {} },
    badRes
  );
  assert.equal(badRes.getStatus(), 400);

  const okRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: {
        origin: 'https://www.hanzigo.io.vn',
        'x-real-ip': '10.0.0.52',
      },
      body: {
        error_name: 'ReferenceError',
        error_message: 'Filter is not defined for alice@hanzigo.vn',
        route: '/#community',
      },
    },
    okRes
  );
  assert.equal(okRes.getStatus(), 202);
  assert.equal(okRes.getJson().ok, true);
  assert.equal(okRes.getHeaders()['access-control-allow-origin'], 'https://www.hanzigo.io.vn');
  assert.equal(okRes.getJson().fingerprint.includes('alice@hanzigo.vn'), false);
});
