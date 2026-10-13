/**
 * Production-Hardened Distributed Rate Limiter with Upstash Redis REST
 * and automatic in-memory fallback for Vercel Serverless Functions.
 * Placed in _utils so Vercel does not count it as a Serverless Function.
 */

// In-memory fallback stores
const memoryStore = new Map();

export const REDIS_TIMEOUT_MS = 2500;

export async function checkRateLimitAndQuota({
  clientKey,
  windowMs = 60 * 1000,
  maxRequests = 20,
  dailyQuotaMax = 150,
  dailyQuotaWindowMs = 24 * 60 * 60 * 1000,
  prefix = 'ratelimit',
  timeoutMs = REDIS_TIMEOUT_MS
}) {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const isProduction = process.env.NODE_ENV === 'production' && process.env.NODE_ENV !== 'test';
  const allowMemoryInProd = process.env.ALLOW_IN_MEMORY_RATE_LIMIT === 'true';

  // 1. Kiểm tra cấu hình Upstash Redis REST
  if (upstashUrl && upstashToken && typeof fetch === 'function') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

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
        ]),
        signal: controller.signal
      });

      clearTimeout(timer);

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
      } else {
        throw new Error(`Upstash returned HTTP ${res.status}`);
      }
    } catch (err) {
      clearTimeout(timer);
      const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
      // Không ghi log chứa secret hoặc URL chi tiết
      console.warn(`[RateLimiter] Redis error (${isTimeout ? 'Timeout' : 'Connection failure'}).`);

      // Chính sách Fail-Closed trong Production nếu không cho phép in-memory fallback
      if (isProduction && !allowMemoryInProd) {
        return {
          allowed: false,
          statusCode: 503,
          reason: 'Dịch vụ kiểm soát lưu lượng tạm thời gián đoạn. Vui lòng thử lại sau giây lát.',
          isDistributed: true,
          error: isTimeout ? 'redis_timeout' : 'redis_error'
        };
      }
    }
  } else if (isProduction && !allowMemoryInProd) {
    // Trong Production nhưng chưa cấu hình Upstash Redis credentials
    console.warn('[RateLimiter] CẢNH BÁO: UPSTASH_REDIS credentials chưa được cấu hình trên môi trường Production.');
    return {
      allowed: false,
      statusCode: 503,
      reason: 'Hệ thống giới hạn phân tán chưa sẵn sàng. Vui lòng liên hệ quản trị viên để cấu hình Redis.',
      isDistributed: false,
      error: 'redis_unconfigured'
    };
  }

  // 2. In-memory fallback (chỉ dùng cho môi trường Test / Local Dev hoặc khi bật ALLOW_IN_MEMORY_RATE_LIMIT=true)
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
