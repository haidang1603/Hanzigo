/**
 * Production-Hardened Distributed Rate Limiter with Upstash Redis REST
 * and automatic in-memory fallback for Vercel Serverless Functions.
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
          rateCount: currentRateCount,
          quotaCount: currentQuotaCount,
          isDistributed: true
        };
      }
    } catch (err) {
      console.warn('[RateLimiter] Upstash Redis request failed, falling back to in-memory:', err.message);
    }
  }

  // 2. In-memory Fallback Store
  const now = Date.now();
  const rateKey = `${prefix}:rate:${clientKey}`;
  const quotaKey = `${prefix}:quota:${clientKey}`;

  // Check Minute Window
  const rateData = memoryStore.get(rateKey) || { count: 0, resetTime: now + windowMs };
  if (now > rateData.resetTime) {
    rateData.count = 1;
    rateData.resetTime = now + windowMs;
  } else {
    if (rateData.count >= maxRequests) {
      return {
        allowed: false,
        statusCode: 429,
        reason: 'Quá nhiều yêu cầu trong thời gian ngắn (vượt quá giới hạn theo phút). Vui lòng đợi 1 phút.',
        isDistributed: false
      };
    }
    rateData.count += 1;
  }
  memoryStore.set(rateKey, rateData);

  // Check Daily Quota
  const quotaData = memoryStore.get(quotaKey) || { count: 0, resetTime: now + dailyQuotaWindowMs };
  if (now > quotaData.resetTime) {
    quotaData.count = 1;
    quotaData.resetTime = now + dailyQuotaWindowMs;
  } else {
    if (quotaData.count >= dailyQuotaMax) {
      return {
        allowed: false,
        statusCode: 429,
        reason: `Bạn đã đạt hạn ngạch tối đa trong ngày (${dailyQuotaMax} lượt). Vui lòng quay lại vào ngày mai.`,
        isDistributed: false
      };
    }
    quotaData.count += 1;
  }
  memoryStore.set(quotaKey, quotaData);

  return {
    allowed: true,
    rateCount: rateData.count,
    quotaCount: quotaData.count,
    isDistributed: false
  };
}

export function resetMemoryRateLimits() {
  memoryStore.clear();
}
