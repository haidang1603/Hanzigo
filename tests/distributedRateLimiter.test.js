/**
 * =========================================================================
 * HANZI GO - ISS-04: DISTRIBUTED RATE LIMITER & QUOTA TEST SUITE
 * =========================================================================
 * Kiểm thử giới hạn tốc độ (Rate Limit), hạn ngạch ngày (Daily Quota),
 * tính nguyên tử, chính sách Fail-Closed trong production và Upstash REST.
 * =========================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  checkRateLimitAndQuota,
  resetMemoryRateLimits
} from '../api/_utils/distributedRateLimiter.js';

test('ISS-04: Distributed Rate Limiter & Quota Verification Suite', async (t) => {

  t.beforeEach(() => {
    resetMemoryRateLimits();
  });

  // 1. Kiểm thử giới hạn theo phút (Minute Rate Limit)
  await t.test('1. Blocks requests exceeding maxRequests within window', async () => {
    const clientKey = 'test-user-minute-01';

    // Cho phép 5 requests
    for (let i = 0; i < 5; i++) {
      const res = await checkRateLimitAndQuota({
        clientKey,
        maxRequests: 5,
        dailyQuotaMax: 20
      });
      assert.equal(res.allowed, true, `Request ${i + 1} must be allowed`);
    }

    // Request thứ 6 phải bị chặn (HTTP 429)
    const blockedRes = await checkRateLimitAndQuota({
      clientKey,
      maxRequests: 5,
      dailyQuotaMax: 20
    });
    assert.equal(blockedRes.allowed, false);
    assert.equal(blockedRes.statusCode, 429);
    assert.ok(blockedRes.reason.includes('phút'));
  });

  // 2. Kiểm thử hạn ngạch theo ngày (Daily Quota Limit)
  await t.test('2. Blocks requests exceeding dailyQuotaMax', async () => {
    const clientKey = 'test-user-daily-01';

    // Cho phép 3 requests trong ngày
    for (let i = 0; i < 3; i++) {
      const res = await checkRateLimitAndQuota({
        clientKey,
        maxRequests: 10,
        dailyQuotaMax: 3
      });
      assert.equal(res.allowed, true);
    }

    // Request thứ 4 phải bị chặn do hết hạn ngạch ngày
    const blockedRes = await checkRateLimitAndQuota({
      clientKey,
      maxRequests: 10,
      dailyQuotaMax: 3
    });
    assert.equal(blockedRes.allowed, false);
    assert.equal(blockedRes.statusCode, 429);
    assert.ok(blockedRes.reason.includes('ngày'));
  });

  // 3. Kiểm thử yêu cầu đồng thời (Concurrent Requests)
  await t.test('3. Handles concurrent burst requests correctly without race conditions', async () => {
    const clientKey = 'test-user-concurrent-01';
    const totalRequests = 15;
    const maxAllowed = 10;

    // Gửi 15 request đồng thời qua Promise.all
    const promises = Array.from({ length: totalRequests }, () =>
      checkRateLimitAndQuota({
        clientKey,
        maxRequests: maxAllowed,
        dailyQuotaMax: 50
      })
    );

    const results = await Promise.all(promises);
    const allowedCount = results.filter(r => r.allowed).length;
    const blockedCount = results.filter(r => !r.allowed).length;

    assert.equal(allowedCount, maxAllowed, `Exactly ${maxAllowed} requests must be allowed`);
    assert.equal(blockedCount, totalRequests - maxAllowed, `Exactly ${totalRequests - maxAllowed} requests must be blocked`);
  });

  // 4. Kiểm thử chính sách Fail-Closed trong Production khi thiếu Redis credentials
  await t.test('4. Enforces Fail-Closed (503) in production when Redis credentials are not configured', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalUpstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalUpstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    const originalAllowMemory = process.env.ALLOW_IN_MEMORY_RATE_LIMIT;

    try {
      // Giả lập môi trường Production không có Redis
      process.env.NODE_ENV = 'production';
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
      delete process.env.ALLOW_IN_MEMORY_RATE_LIMIT;

      const res = await checkRateLimitAndQuota({ clientKey: 'prod-user-01' });

      // Trong production không có Redis -> Fail closed với 503
      assert.equal(res.allowed, false);
      assert.equal(res.statusCode, 503);
      assert.equal(res.error, 'redis_unconfigured');
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      if (originalUpstashUrl) process.env.UPSTASH_REDIS_REST_URL = originalUpstashUrl;
      if (originalUpstashToken) process.env.UPSTASH_REDIS_REST_TOKEN = originalUpstashToken;
      if (originalAllowMemory) process.env.ALLOW_IN_MEMORY_RATE_LIMIT = originalAllowMemory;
    }
  });

});
