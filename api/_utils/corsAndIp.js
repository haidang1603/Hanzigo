/**
 * =========================================================================
 * HANZI GO - SHARED CORS ALLOWLIST, TRUSTED IP & AI KILL SWITCH UTILITIES
 * =========================================================================
 */

export const PROD_ALLOWED_ORIGINS = [
  'https://www.hanzigo.io.vn',
  'https://hanzigo.io.vn',
  'https://hanzigo-xi.vercel.app',
];

export const LOCAL_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
];

export const ALLOWED_ORIGINS = [...PROD_ALLOWED_ORIGINS];

export function getAllowedOrigins() {
  const isProd =
    process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  return isProd ? [...PROD_ALLOWED_ORIGINS] : [...PROD_ALLOWED_ORIGINS, ...LOCAL_DEV_ORIGINS];
}

export function isOriginAllowed(origin) {
  if (!origin || typeof origin !== 'string') return false;
  const normalized = origin.trim().replace(/\/+$/, '');
  return getAllowedOrigins().includes(normalized);
}

/**
 * Applies strict origin allowlist CORS headers (never wildcard `*`).
 * Returns true if it completed the response (e.g. OPTIONS preflight).
 */
export function applyCorsAllowlist(
  req,
  res,
  methods = 'POST, OPTIONS',
  headers = 'Content-Type, Authorization, x-user-id'
) {
  const rawOrigin = req?.headers?.origin || req?.headers?.Origin || '';
  const origin = typeof rawOrigin === 'string' ? rawOrigin.trim() : '';

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);

  const allowed = origin ? isOriginAllowed(origin) : false;
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin.replace(/\/+$/, ''));
  }

  if (req?.method === 'OPTIONS') {
    if (origin && !allowed) {
      res.status(403).json({ error: 'Origin không được phép truy cập.' });
      return true;
    }
    res.status(200).end();
    return true;
  }

  return false;
}

function extractRightmostIp(headerVal) {
  if (!headerVal || typeof headerVal !== 'string') return '';
  const parts = headerVal
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : '';
}

/**
 * Extracts client IP without trusting spoofable leading X-Forwarded-For values.
 * Priority: x-vercel-forwarded-for -> x-real-ip -> socket.remoteAddress -> rightmost x-forwarded-for.
 */
export function getTrustedClientIp(req) {
  const vercelForwarded = extractRightmostIp(req?.headers?.['x-vercel-forwarded-for']);
  if (vercelForwarded) return vercelForwarded;

  const realIp =
    typeof req?.headers?.['x-real-ip'] === 'string' ? req.headers['x-real-ip'].trim() : '';
  if (realIp) return realIp;

  const socketIp =
    typeof req?.socket?.remoteAddress === 'string' ? req.socket.remoteAddress.trim() : '';
  if (socketIp) return socketIp;

  const rightmostForwarded = extractRightmostIp(req?.headers?.['x-forwarded-for']);
  if (rightmostForwarded) return rightmostForwarded;

  return 'anon-client';
}

export function isAiKillSwitchEnabled() {
  return (
    process.env.ENABLE_AI_TUTOR === 'false' ||
    process.env.AI_TUTOR_KILL_SWITCH === 'true' ||
    process.env.AI_GLOBAL_KILL_SWITCH === 'true'
  );
}

/**
 * Enforces emergency global AI kill switch with HTTP 503.
 * Returns true if the request was halted.
 */
export function enforceAiKillSwitch(res) {
  if (!isAiKillSwitchEnabled()) return false;
  res.status(503).json({
    error: 'Dịch vụ AI đang tạm thời bảo trì để nâng cấp chất lượng. Vui lòng quay lại sau.',
    code: 'feature_disabled',
  });
  return true;
}
