/**
 * Production-Hardened Distributed Rate Limiter with Upstash Redis REST
 * and automatic in-memory fallback for Vercel Serverless Functions.
 * Placed in _utils so Vercel does not count it as a Serverless Function.
 */

// In-memory fallback stores
const memoryStore = new Map();

export async function checkRateLimitAndQuota({
  clientKey,
  windowMs = 60 * 1000,
  maxRequests = 20,
  dailyQuotaMax = 150,
  dailyQuotaWindowMs = 24 * 60 * 60 * 1000,
  prefix = 'ratelimit'
}) {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Try Upstash Redis REST if configured
  if (upstashUrl && upstashToken && typeof fetch === 'function') {
    try {
      const windowSec = Math.ceil(windowMs / 1000);
      const quotaSec = Math.ceil(dailyQuotaWindowMs / 1000);
      const rateKey = `hanzigo:${prefix}:rate:${clientKey}`;
      const quotaKey = `hanzigo:${prefix}:quota:${clientKey}`;

      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['INCR', rateKey],
          ['EXPIRE', rateKey, windowSec, 'NX'],
          ['INCR', quotaKey],
          ['EXPIRE', quotaKey, quotaSec, 'NX']
        ])
      });

      if (res.ok) {
        const results = await res.json();
        const currentRateCount = results[0]?.result;
        const currentQuotaCount = results[2]?.result;

        if (typeof currentRateCount === 'number' && currentRateCount > maxRequests) {
          return {
            allowed: false,
            statusCode: 429,
            reason: 'Quá nhiều yêu cầu trong thời gian ngắn (vượt quá giới hạn theo phút). Vui lòng đợi 1 phút.',
            isDistributed: true
          };
        }

        if (typeof currentQuotaCount === 'number' && currentQuotaCount > dailyQuotaMax) {
          return {
            allowed: false,
            statusCode: 429,
            reason: `Bạn đã đạt hạn ngạch tối đa trong ngày (${dailyQuotaMax} lượt). Vui lòng quay lại vào ngày mai.`,
            isDistributed: true
          };
        }

        return {
          allowed: true,
          remaining: Math.max(0, maxRequests - currentRateCount),
          quotaRemaining: Math.max(0, dailyQuotaMax - currentQuotaCount),
          isDistributed: true
        };
      }
    } catch (err) {
      console.warn('⚠️ Upstash Rate Limiter REST Error, falling back to in-memory:', err.message);
    }
  }

  // 2. In-memory fallback
  const now = Date.now();
  const memoryKey = `${prefix}:${clientKey}`;

  let record = memoryStore.get(memoryKey);
  if (!record) {
    record = {
      windowStart: now,
      requestCount: 0,
      dailyStart: now,
      dailyCount: 0
    };
    memoryStore.set(memoryKey, record);
  }

  // Reset minute window if expired
  if (now - record.windowStart > windowMs) {
    record.windowStart = now;
    record.requestCount = 0;
  }

  // Reset daily window if expired
  if (now - record.dailyStart > dailyQuotaWindowMs) {
    record.dailyStart = now;
    record.dailyCount = 0;
  }

  // Check minute window limit
  if (record.requestCount >= maxRequests) {
    return {
      allowed: false,
      statusCode: 429,
      reason: 'Quá nhiều yêu cầu trong thời gian ngắn. Vui lòng đợi 1 phút.',
      isDistributed: false
    };
  }

  // Check daily quota limit
  if (record.dailyCount >= dailyQuotaMax) {
    return {
      allowed: false,
      statusCode: 429,
      reason: `Bạn đã đạt hạn ngạch tối đa trong ngày (${dailyQuotaMax} lượt). Vui lòng quay lại vào ngày mai.`,
      isDistributed: false
    };
  }

  // Increment counters
  record.requestCount += 1;
  record.dailyCount += 1;

  return {
    allowed: true,
    remaining: maxRequests - record.requestCount,
    quotaRemaining: dailyQuotaMax - record.dailyCount,
    isDistributed: false
  };
}

export function resetMemoryRateLimits() {
  memoryStore.clear();
}
