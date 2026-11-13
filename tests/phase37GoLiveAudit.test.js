import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  scanClientSecretLeaks,
  countServerlessEntrypoints,
  runPreFlightGoLiveAudit,
} from '../scripts/preFlightGoLiveAudit.js';

describe('Phase 37 Pre-Flight Go-Live Auditor', () => {
  it('finds zero client-side secret leaks across src/', () => {
    const scan = scanClientSecretLeaks();
    assert.ok(scan.scannedFiles > 0);
    assert.deepEqual(scan.leaks, []);
    assert.equal(scan.passed, true);
  });

  it('verifies Vercel serverless entrypoint count is <= 12 (ignoring api/_* helpers)', () => {
    const serverless = countServerlessEntrypoints();
    assert.ok(serverless.count > 0 && serverless.count <= 12, `Got ${serverless.count} entrypoints`);
    assert.equal(serverless.passed, true);
    for (const entry of serverless.entrypoints) {
      assert.equal(entry.includes('/_'), false, `Unexpected underscore helper counted: ${entry}`);
    }
  });

  it('achieves 100/100 on the Go-Live Readiness Scorecard', () => {
    const report = runPreFlightGoLiveAudit();
    assert.equal(report.totalScore, 100, JSON.stringify(report.categories, null, 2));
    assert.equal(report.maxScore, 100);
    assert.equal(report.passed, true);
  });
});

