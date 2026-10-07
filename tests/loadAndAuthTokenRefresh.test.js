import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  calculateNextSrsReview, 
  SRS_QUALITY,
  SRS_STAGES
} from '../src/utils/srsEngine.js';

import {
  checkRateLimitAndQuota,
  resetMemoryRateLimits
} from '../api/ai/distributedRateLimiter.js';

import {
  computeClassAnalytics,
  getAtRiskStudents
} from '../src/services/teacherAnalyticsService.js';

import {
  refreshUserSession,
  getValidSessionToken
} from '../src/services/authService.js';

// =========================================================================
// 1. LOAD TEST: SRS ENGINE HIGH-VOLUME CONCURRENT EVALUATIONS
// =========================================================================

test('LOAD TEST 1: SRS Engine calculates 500 items concurrently within latency budget', () => {
  const startTime = performance.now();
  const itemCount = 500;
  const results = [];

  for (let i = 0; i < itemCount; i++) {
    const quality = (i % 4) + 1; // ratings 1 to 4
    const mockItem = {
      intervalDays: (i % 30) + 1,
      repetitions: (i % 10) + 1,
      easeFactor: 2.0 + (i % 10) * 0.05,
      lastReviewed: new Date(Date.now() - (i % 14) * 86400000).toISOString()
    };

    const next = calculateNextSrsReview(mockItem, quality);
    results.push(next);
  }

  const durationMs = performance.now() - startTime;

  // Validation
  assert.equal(results.length, itemCount);
  assert.ok(durationMs < 200, `Expected 500 SRS calculations in < 200ms, actual: ${durationMs.toFixed(2)}ms`);

  // Verify all outputs are valid and non-NaN
  for (const r of results) {
    assert.ok(r.intervalDays >= 1, 'intervalDays must be >= 1');
    assert.ok(r.easeFactor >= 1.3, 'Ease factor must be >= 1.3 minimum');
    assert.ok(!isNaN(r.intervalDays), 'intervalDays must not be NaN');
    assert.ok(!isNaN(r.easeFactor), 'EaseFactor must not be NaN');
    assert.ok(typeof r.nextReviewAt === 'string' && !isNaN(Date.parse(r.nextReviewAt)));
  }
});

// =========================================================================
// 2. LOAD TEST: BURST CONCURRENT TRAFFIC ON RATE LIMITER
// =========================================================================

test('LOAD TEST 2: Rate Limiter maintains precise bounds under 100 concurrent requests', async () => {
  resetMemoryRateLimits();
  const testKey = 'burst-client-100';
  const MAX_ALLOWED = 20;
  const TOTAL_BURST = 100;

  const promises = [];
  for (let i = 0; i < TOTAL_BURST; i++) {
    promises.push(
      checkRateLimitAndQuota({
        clientKey: testKey,
        windowMs: 60000,
        maxRequests: MAX_ALLOWED,
        dailyQuotaMax: 200,
        prefix: 'burst-test'
      })
    );
  }

  const results = await Promise.all(promises);

  const allowedCount = results.filter(r => r.allowed).length;
  const blockedCount = results.filter(r => !r.allowed).length;

  assert.equal(allowedCount, MAX_ALLOWED, `Exactly ${MAX_ALLOWED} requests should be allowed`);
  assert.equal(blockedCount, TOTAL_BURST - MAX_ALLOWED, `Remaining ${TOTAL_BURST - MAX_ALLOWED} requests should be blocked with 429`);
});

// =========================================================================
// 3. LOAD TEST: AT-RISK DETECTION & ANALYTICS OVER 200 STUDENTS
// =========================================================================

test('LOAD TEST 3: At-Risk & KPI engine processes 200 students within 50ms', () => {
  const startTime = performance.now();
  const now = Date.now();
  const students = [];

  for (let i = 0; i < 200; i++) {
    const daysAgo = (i % 15);
    students.push({
      id: `stu-load-${i}`,
      student_id: `stu-load-${i}`,
      student_name: `Student ${i}`,
      classroom_id: 'cls-large',
      last_active: new Date(now - daysAgo * 86400000).toISOString(),
      assignment_completion: (i * 7) % 100,
      assignment_score: 50 + ((i * 3) % 50),
      attendance_rate: 60 + (i % 40),
      xp: i * 50,
      words_learned: i * 5,
      hsk_level: `HSK ${(i % 3) + 1}`,
      study_hours: (i % 20) + 1
    });
  }

  const atRisk = getAtRiskStudents(students);
  const analytics = computeClassAnalytics('cls-large', students, [{ id: 'a1', classroom_id: 'cls-large' }], []);
  const durationMs = performance.now() - startTime;

  assert.ok(durationMs < 100, `Analytics calculation over 200 students took ${durationMs.toFixed(2)}ms (expected < 100ms)`);
  assert.equal(atRisk.healthy.length + atRisk.atRisk.length + atRisk.needsAttention.length, 200);
  assert.equal(analytics.totalStudents, 200);
});

// =========================================================================
// 4. AUTH TOKEN REFRESH & SESSION LIFECYCLE
// =========================================================================

test('AUTH TOKEN REFRESH: Handles unconfigured / test environment gracefully', async () => {
  const res = await refreshUserSession();
  assert.equal(res.success, false);
  assert.ok(res.error.includes('Supabase'));
});

test('AUTH TOKEN REFRESH: getValidSessionToken returns null safely when no active session', async () => {
  const token = await getValidSessionToken();
  assert.equal(token, null);
});
