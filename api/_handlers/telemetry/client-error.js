import { applyCorsAllowlist, getTrustedClientIp } from '../../_utils/corsAndIp.js';
import { checkRateLimitAndQuota } from '../../_utils/distributedRateLimiter.js';
import { getSupabaseAdminClient, sendSafeServerError } from '../../_utils/supabaseServer.js';

const MAX_STACK_LENGTH = 1500;
const MAX_MESSAGE_LENGTH = 500;

/**
 * Redact emails, JWTs, Bearer/Basic tokens, cookies, and secret key-value pairs
 * before persisting or logging any diagnostic text.
 */
export function redactSensitiveData(input) {
  if (input == null) return '';
  if (typeof input === 'object') {
    const out = Array.isArray(input) ? [] : {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = redactSensitiveData(v);
    }
    return out;
  }

  let text = String(input);
  text = text.replace(/\beyJ[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{4,}(?:\.[A-Za-z0-9_-]*)?/g, '[REDACTED_JWT]');
  text = text.replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi, '$1 [REDACTED_TOKEN]');
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  text = text.replace(
    /((?:"|')?(?:password|passwd|pwd|passcode|secret|token|access_token|refresh_token|id_token|api_key|apikey|x-api-key|authorization|cookie|set-cookie)(?:"|')?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,&;}\]]+)/gi,
    '$1[REDACTED]'
  );
  return text;
}

function cleanField(val, maxLen) {
  return redactSensitiveData(String(val ?? '')).trim().slice(0, maxLen);
}

export function sanitizeClientErrorPayload(body = {}, req = null) {
  const rawMessage = body.error_message ?? body.message ?? '';
  const error_message = cleanField(rawMessage, MAX_MESSAGE_LENGTH);
  const error_name = cleanField(body.error_name || 'Error', 120) || 'Error';
  const route = cleanField(body.route || body.route_path || '/', 250) || '/';
  const rawStack = body.component_stack_short ?? body.stack_summary ?? '';
  const component_stack_short = cleanField(rawStack, MAX_STACK_LENGTH);
  const app_version = cleanField(body.app_version || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || '', 60);
  const rawUa = body.user_agent_short ?? body.user_agent ?? req?.headers?.['user-agent'] ?? '';
  const user_agent_short = cleanField(rawUa, 200);
  const rawFingerprint = body.fingerprint || `${error_name}::${error_message.slice(0, 80)}::${route}`;
  const fingerprint = cleanField(rawFingerprint, 160);

  return {
    route,
    error_name,
    error_message,
    component_stack_short,
    app_version,
    user_agent_short,
    fingerprint,
  };
}

export default async function handler(req, res) {
  if (applyCorsAllowlist(req, res, 'POST, OPTIONS', 'Content-Type')) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIp = getTrustedClientIp(req);
    const rate = await checkRateLimitAndQuota({
      clientKey: `client_err:${clientIp}`,
      windowMs: 60 * 1000,
      maxRequests: 15,
      dailyQuotaMax: 150,
      prefix: 'telemetry_client_error',
    });

    if (!rate.allowed) {
      return res.status(429).json({ error: 'Quá nhiều báo cáo lỗi từ thiết bị này.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body || '{}');
      } catch {
        body = {};
      }
    }
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Payload không hợp lệ.' });
    }

    const record = sanitizeClientErrorPayload(body, req);
    if (!record.error_message) {
      return res.status(400).json({ error: 'Thiếu thông tin error_message.' });
    }

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return res.status(202).json({ ok: true, stored: false, fingerprint: record.fingerprint });
    }

    const { error } = await adminClient.from('client_error_logs').insert([record]);
    if (error) {
      return sendSafeServerError(res, 'Không thể lưu log lỗi.', error, 500);
    }

    return res.status(202).json({ ok: true, stored: true, fingerprint: record.fingerprint });
  } catch (err) {
    return sendSafeServerError(res, 'Lỗi máy chủ nội bộ.', err, 500);
  }
}
