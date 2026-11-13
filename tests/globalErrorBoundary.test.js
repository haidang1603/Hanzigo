import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  sanitizeSensitiveText,
  buildDiagnosticPayload,
  reportClientError,
  flushOfflineErrorLogs,
  getOfflineErrorQueue,
  __resetErrorReporterForTests,
  TELEMETRY_CONSTANTS,
} from '../src/core/telemetry/errorReporter.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    get length() {
      return store.size;
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
  };
}

describe('errorReporter telemetry & sanitization', () => {
  beforeEach(() => {
    __resetErrorReporterForTests();
  });

  it('strips emails, JWT tokens, Bearer tokens, and password fields', () => {
    const raw =
      'Auth failed for user alice.nguyen@example.com with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.sig123 and password="MySecretPassword123" token=abc_987';
    const clean = sanitizeSensitiveText(raw);

    assert.equal(clean.includes('alice.nguyen@example.com'), false);
    assert.equal(clean.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'), false);
    assert.equal(clean.includes('MySecretPassword123'), false);
    assert.equal(clean.includes('abc_987'), false);
    assert.match(clean, /\[REDACTED_EMAIL\]/);
    assert.match(clean, /\[REDACTED\]/);
  });

  it('packages diagnostic payload with required schema fields', () => {
    const err = new Error('Canvas WebGL crash for bob@hanzigo.vn');
    const payload = buildDiagnosticPayload(err, {
      routePath: '/hsk-practice?token=secret123',
      now: 1700000000000,
    });

    assert.equal(typeof payload.message, 'string');
    assert.equal(payload.message.includes('bob@hanzigo.vn'), false);
    assert.equal(typeof payload.stack_summary, 'string');
    assert.equal(payload.route_path.includes('secret123'), false);
    assert.equal(typeof payload.user_agent, 'string');
    assert.equal(payload.timestamp, new Date(1700000000000).toISOString());
  });

  it('deduplicates identical errors within 60 seconds and allows after 60s', async () => {
    const sent = [];
    const transport = async (p) => sent.push(p);

    const err = new Error('ChunkLoadError: Loading chunk 42 failed');
    const r1 = await reportClientError(err, { now: 100_000, isOnline: true, transport });
    const r2 = await reportClientError(err, { now: 120_000, isOnline: true, transport });
    const r3 = await reportClientError(err, {
      now: 100_000 + TELEMETRY_CONSTANTS.DEDUPE_WINDOW_MS + 1,
      isOnline: true,
      transport,
    });

    assert.equal(r1.status, 'sent');
    assert.equal(r2.status, 'deduped');
    assert.equal(r3.status, 'sent');
    assert.equal(sent.length, 2);
  });

  it('stores at most 10 offline error logs in sessionStorage and flushes when online', async () => {
    const storage = createMemoryStorage();
    const sent = [];
    const transport = async (p) => sent.push(p);

    for (let i = 1; i <= 13; i += 1) {
      await reportClientError(new Error(`Offline error #${i}`), {
        now: 1000 + i,
        isOnline: false,
        storage,
        transport,
      });
    }

    const queued = getOfflineErrorQueue(storage);
    assert.equal(queued.length, 10);
    assert.equal(queued[0].message, 'Offline error #4');
    assert.equal(queued[9].message, 'Offline error #13');

    const flushResult = await flushOfflineErrorLogs({ isOnline: true, storage, transport });
    assert.equal(flushResult.flushed, 10);
    assert.equal(flushResult.remaining, 0);
    assert.equal(sent.length, 10);
    assert.equal(getOfflineErrorQueue(storage).length, 0);
  });
});

describe('GlobalErrorBoundary & App.jsx integration', () => {
  it('contains Exam Draft Rescue, Dark Cyber theme, 3 recovery buttons, and 2-layer boundary in App.jsx', () => {
    const boundarySrc = fs.readFileSync(
      path.resolve('src/components/common/GlobalErrorBoundary.jsx'),
      'utf8'
    );
    const appSrc = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');

    assert.match(boundarySrc, /#0a0a1f/);
    assert.match(boundarySrc, /#00D4FF/);
    assert.match(boundarySrc, /hsk_exam_draft_/);
    assert.match(boundarySrc, /hanzigo_sync_queue_v1/);
    assert.match(boundarySrc, /Tải xuống bản sao bài làm \(\.JSON\)/);
    assert.match(boundarySrc, /Thử tải lại khu vực này/);
    assert.match(boundarySrc, /Xóa bộ nhớ đệm giao diện/);
    assert.match(boundarySrc, /Về Trang chủ/);
    assert.match(boundarySrc, /clearStorageByCategory\('functional'\)/);

    assert.match(appSrc, /<GlobalErrorBoundary\s+scope="app">/);
    assert.match(appSrc, /scope="route"/);
    assert.match(appSrc, /initGlobalErrorReporter\(\)/);
  });
});

