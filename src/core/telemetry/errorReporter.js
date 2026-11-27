const DEDUPE_WINDOW_MS = 60_000;
const MAX_OFFLINE_QUEUE_SIZE = 10;
const MAX_SESSION_EVENTS = 5;
const MAX_COMPONENT_STACK_CHARS = 1500;
const OFFLINE_QUEUE_STORAGE_KEY = 'hanzigo_error_telemetry_queue_v1';
const DEFAULT_TELEMETRY_ENDPOINT = '/api/telemetry/client-error';

const recentErrorTimestamps = new Map();
const sessionSentFingerprints = new Set();
let sessionEventsSent = 0;
let isReporterInitialized = false;
let cleanupListeners = null;

/**
 * Strip sensitive data (emails, JWTs, Bearer tokens, passwords/secrets)
 * from any diagnostic text before packaging telemetry payloads.
 */
export function sanitizeSensitiveText(input) {
  if (input == null) return '';
  let text = String(input);

  // 1. JWT tokens (header.payload.signature)
  text = text.replace(/\beyJ[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{4,}(?:\.[A-Za-z0-9_-]*)?/g, '[REDACTED_JWT]');

  // 2. Bearer / Authorization tokens
  text = text.replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi, '$1 [REDACTED_TOKEN]');

  // 3. Email addresses
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');

  // 4. Password / token / secret / cookie / api_key assignments in JSON, query strings, or logs
  text = text.replace(
    /((?:"|')?(?:password|passwd|pwd|passcode|secret|token|access_token|refresh_token|id_token|api_key|apikey|x-api-key|authorization|cookie|set-cookie)(?:"|')?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,&;}\]]+)/gi,
    '$1[REDACTED]'
  );

  return text;
}

export const ERROR_CATEGORIES = ['network', 'database', 'auth', 'validation', 'render', 'sync', 'unknown'];

export function classifyErrorCategory(errorInput, context = {}) {
  if (context?.category && ERROR_CATEGORIES.includes(context.category)) {
    return context.category;
  }
  const msg = String(errorInput?.message || errorInput?.reason?.message || errorInput || '').toLowerCase();
  if (context?.componentStack || /render|react|minified react error|hydration/i.test(msg)) return 'render';
  if (/network|fetch|timeout|econn|offline|failed to fetch|load failed|502|503|504/i.test(msg)) return 'network';
  if (/jwt|token|unauthori|forbidden|401|403|auth|session|login|permission/i.test(msg)) return 'auth';
  if (/postgres|supabase|pgrst|sql|relation|column|duplicate key|rls|database|db /i.test(msg)) return 'database';
  if (/sync|queue|quotaexceeded|localstorage|idempoten/i.test(msg)) return 'sync';
  if (/invalid|required|validation|schema|400|zod|parse/i.test(msg)) return 'validation';
  return 'unknown';
}

export function inferSourceModule(context = {}, routePath = '/') {
  if (context?.module) return String(context.module);
  if (context?.boundaryScope) return String(context.boundaryScope);
  const pathStr = String(routePath || '/').toLowerCase();
  if (pathStr.includes('hsk')) return 'hsk_exam';
  if (pathStr.includes('vocab') || pathStr.includes('dict')) return 'vocabulary_srs';
  if (pathStr.includes('live') || pathStr.includes('classroom')) return 'live_classroom';
  if (pathStr.includes('roadmap') || pathStr.includes('lesson')) return 'learning_path';
  if (pathStr.includes('admin')) return 'admin_dashboard';
  if (pathStr.includes('teacher')) return 'teacher_dashboard';
  if (pathStr.includes('dashboard')) return 'student_dashboard';
  return 'app_global';
}

/**
 * Summarize and sanitize a stack trace to at most 6 lines / 600 chars.
 */
export function summarizeStack(stack) {
  if (!stack) return '';
  const sanitized = sanitizeSensitiveText(stack);
  const lines = sanitized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);
  const joined = lines.join('\n');
  return joined.length > 600 ? `${joined.slice(0, 597)}...` : joined;
}

function getSafeSessionStorage(customStorage) {
  if (customStorage) return customStorage;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function getCurrentRoutePath() {
  if (typeof window === 'undefined' || !window.location) return '/';
  const raw = `${window.location.pathname || '/'}${window.location.search || ''}${window.location.hash || ''}`;
  return sanitizeSensitiveText(raw);
}

function getUserAgent() {
  if (typeof navigator === 'undefined') return 'unknown';
  return sanitizeSensitiveText(navigator.userAgent || 'unknown');
}

function isNavigatorOnline() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

function buildErrorFingerprint(payload) {
  const firstStackLine = (payload.stack_summary || '').split('\n')[0] || '';
  return `${payload.message}::${firstStackLine}::${payload.route_path}`;
}

export function isDuplicateError(payload, now = Date.now()) {
  const key = buildErrorFingerprint(payload);
  const lastSentAt = recentErrorTimestamps.get(key);
  if (typeof lastSentAt === 'number' && now - lastSentAt < DEDUPE_WINDOW_MS) {
    return true;
  }
  recentErrorTimestamps.set(key, now);

  // Prune stale entries to prevent unbounded memory growth
  if (recentErrorTimestamps.size > 100) {
    for (const [entryKey, ts] of recentErrorTimestamps.entries()) {
      if (now - ts >= DEDUPE_WINDOW_MS) {
        recentErrorTimestamps.delete(entryKey);
      }
    }
  }
  return false;
}

export function buildDiagnosticPayload(errorInput, context = {}) {
  const errObj =
    errorInput instanceof Error
      ? errorInput
      : typeof errorInput === 'string'
        ? new Error(errorInput)
        : errorInput && typeof errorInput === 'object'
          ? errorInput
          : { message: String(errorInput || 'Unknown client error') };

  const rawName = errObj.name || 'Error';
  const rawMessage = errObj.message || errObj.reason?.message || String(errorInput || 'Unknown client error');
  const rawStack = errObj.stack || context.componentStack || '';
  const routePath = sanitizeSensitiveText(context.routePath || getCurrentRoutePath());
  const cleanMessage = sanitizeSensitiveText(rawMessage).slice(0, 300);
  const cleanName = sanitizeSensitiveText(rawName).slice(0, 120) || 'Error';
  const componentStackShort = sanitizeSensitiveText(context.componentStack || rawStack).slice(
    0,
    MAX_COMPONENT_STACK_CHARS
  );
  const stackSummary = summarizeStack(rawStack);
  const userAgent = getUserAgent();
  const appVersion = sanitizeSensitiveText(
    context.appVersion || (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_APP_VERSION) || ''
  ).slice(0, 60);
  const firstStackLine = (stackSummary || '').split('\n')[0] || '';
  const fingerprint = sanitizeSensitiveText(`${cleanName}::${cleanMessage}::${firstStackLine}::${routePath}`).slice(
    0,
    160
  );

  return {
    message: cleanMessage,
    category: classifyErrorCategory(errObj, context),
    module: sanitizeSensitiveText(inferSourceModule(context, routePath)).slice(0, 80),
    stack_summary: stackSummary,
    route_path: routePath,
    user_agent: userAgent,
    timestamp: new Date(context.now || Date.now()).toISOString(),
    route: routePath.slice(0, 250),
    error_name: cleanName,
    error_message: cleanMessage,
    component_stack_short: componentStackShort,
    app_version: appVersion,
    user_agent_short: userAgent.slice(0, 200),
    fingerprint,
  };
}

export function getOfflineErrorQueue(customStorage) {
  const storage = getSafeSessionStorage(customStorage);
  if (!storage) return [];
  try {
    const raw = storage.getItem(OFFLINE_QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function enqueueOfflineErrorLog(payload, customStorage) {
  const storage = getSafeSessionStorage(customStorage);
  if (!storage) return [];
  const queue = getOfflineErrorQueue(storage);
  queue.push(payload);
  const trimmed = queue.slice(-MAX_OFFLINE_QUEUE_SIZE);
  try {
    storage.setItem(OFFLINE_QUEUE_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage quota errors in telemetry path
  }
  return trimmed;
}

function clearOfflineErrorQueue(customStorage) {
  const storage = getSafeSessionStorage(customStorage);
  if (!storage) return;
  try {
    storage.removeItem(OFFLINE_QUEUE_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Send telemetry payload over the network in Production only (unless forceSend/endpoint override).
 * Enforces per-session fingerprint Set deduplication and max 5 events/session.
 * Uses navigator.sendBeacon with fetch(..., { keepalive: true }) fallback. Fail-silent.
 */
export async function sendTelemetryPayload(payload, options = {}) {
  try {
    let isProd = false;
    let envEndpoint = '';
    try {
      isProd = Boolean(import.meta?.env?.PROD);
      envEndpoint = import.meta?.env?.VITE_TELEMETRY_ENDPOINT || '';
    } catch {
      isProd = false;
      envEndpoint = '';
    }

    const endpoint = options.endpoint || envEndpoint || DEFAULT_TELEMETRY_ENDPOINT;
    const allowSend = options.forceSend === true || isProd || Boolean(envEndpoint) || Boolean(options.endpoint);
    if (!allowSend) {
      return { sent: false, reason: 'non_prod' };
    }

    const fingerprint = payload?.fingerprint || buildErrorFingerprint(payload || {});
    if (sessionSentFingerprints.has(fingerprint)) {
      return { sent: false, reason: 'session_deduped' };
    }
    if (sessionEventsSent >= MAX_SESSION_EVENTS) {
      return { sent: false, reason: 'session_cap' };
    }

    sessionSentFingerprints.add(fingerprint);
    sessionEventsSent += 1;

    const bodyJson = JSON.stringify(payload);
    const nav = options.navigatorObj || (typeof navigator !== 'undefined' ? navigator : null);
    if (nav && typeof nav.sendBeacon === 'function' && typeof Blob !== 'undefined') {
      const ok = nav.sendBeacon(endpoint, new Blob([bodyJson], { type: 'application/json' }));
      if (ok) {
        return { sent: true, method: 'sendBeacon', fingerprint };
      }
    }

    const fetchFn = options.fetchFn || (typeof fetch === 'function' ? fetch : null);
    if (fetchFn) {
      await fetchFn(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyJson,
        keepalive: true,
      });
      return { sent: true, method: 'fetch', fingerprint };
    }

    return { sent: false, reason: 'no_transport' };
  } catch {
    return { sent: false, reason: 'fail_silent' };
  }
}

async function defaultTransport(payload) {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('hanzigo:telemetry-error', { detail: payload }));
    } catch {
      // ignore event dispatch errors
    }
  }
  await sendTelemetryPayload(payload);
}

/**
 * Report a client error with PII sanitization, 60s deduplication, and offline queueing.
 */
export async function reportClientError(errorInput, options = {}) {
  const {
    context = {},
    now = Date.now(),
    isOnline = isNavigatorOnline(),
    storage,
    transport = defaultTransport,
  } = options;

  const payload = buildDiagnosticPayload(errorInput, { ...context, now });

  if (isDuplicateError(payload, now)) {
    return { status: 'deduped', payload };
  }

  if (!isOnline) {
    const queue = enqueueOfflineErrorLog(payload, storage);
    return { status: 'queued_offline', queueLength: queue.length, payload };
  }

  try {
    await transport(payload);
    return { status: 'sent', payload };
  } catch {
    const queue = enqueueOfflineErrorLog(payload, storage);
    return { status: 'queued_after_failure', queueLength: queue.length, payload };
  }
}

/**
 * Flush queued offline error logs once network connectivity is restored.
 */
export async function flushOfflineErrorLogs(options = {}) {
  const {
    isOnline = isNavigatorOnline(),
    storage,
    transport = defaultTransport,
  } = options;

  if (!isOnline) {
    return { flushed: 0, remaining: getOfflineErrorQueue(storage).length };
  }

  const queue = getOfflineErrorQueue(storage);
  if (queue.length === 0) {
    return { flushed: 0, remaining: 0 };
  }

  clearOfflineErrorQueue(storage);
  let flushed = 0;
  const failed = [];

  for (const item of queue) {
    try {
      await transport(item);
      flushed += 1;
    } catch {
      failed.push(item);
    }
  }

  if (failed.length > 0) {
    for (const item of failed.slice(-MAX_OFFLINE_QUEUE_SIZE)) {
      enqueueOfflineErrorLog(item, storage);
    }
  }

  return { flushed, remaining: failed.length };
}

/**
 * Initialize global window error and unhandledrejection listeners.
 * Returns a cleanup function. Safe to call multiple times (idempotent).
 */
export function initGlobalErrorReporter(options = {}) {
  if (typeof window === 'undefined') return () => {};
  if (isReporterInitialized && cleanupListeners) {
    return cleanupListeners;
  }

  const handleWindowError = (event) => {
    const errorObj = event?.error || {
      message: event?.message || 'Unhandled window error',
      stack: event?.filename ? `at ${event.filename}:${event.lineno || 0}:${event.colno || 0}` : '',
    };
    void reportClientError(errorObj, options);
  };

  const handleUnhandledRejection = (event) => {
    const reason = event?.reason;
    const errorObj =
      reason instanceof Error
        ? reason
        : {
            message: typeof reason === 'string' ? reason : 'Unhandled Promise rejection',
            stack: reason?.stack || '',
          };
    void reportClientError(errorObj, options);
  };

  const handleOnline = () => {
    void flushOfflineErrorLogs(options);
  };

  window.addEventListener('error', handleWindowError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('online', handleOnline);

  isReporterInitialized = true;

  // Flush any leftover logs from earlier offline state if currently online
  if (isNavigatorOnline()) {
    void flushOfflineErrorLogs(options);
  }

  cleanupListeners = () => {
    window.removeEventListener('error', handleWindowError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('online', handleOnline);
    isReporterInitialized = false;
    cleanupListeners = null;
  };

  return cleanupListeners;
}

export function __resetErrorReporterForTests() {
  recentErrorTimestamps.clear();
  sessionSentFingerprints.clear();
  sessionEventsSent = 0;
  if (cleanupListeners) {
    cleanupListeners();
  }
}

export const TELEMETRY_CONSTANTS = {
  DEDUPE_WINDOW_MS,
  MAX_OFFLINE_QUEUE_SIZE,
  MAX_SESSION_EVENTS,
  MAX_COMPONENT_STACK_CHARS,
  OFFLINE_QUEUE_STORAGE_KEY,
};

