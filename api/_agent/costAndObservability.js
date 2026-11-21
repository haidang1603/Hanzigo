/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: COST GUARD, PUBLIC CACHE & OBSERVABILITY
 * =========================================================================
 * - Per-request token & USD budget cap across multi-step tool loops.
 * - Strict public-only exact-match cache (never caches personalized/PII data).
 * - Fail-open Upstash Redis cache with short TTL (20 minutes).
 * - Structured, PII-redacted JSON trace emitter.
 */

import crypto from 'node:crypto';
import { AGENT_INTENTS } from './contracts.js';
import { redactSensitiveData } from './guardrails.js';

export const MAX_REQUEST_TOTAL_TOKENS = 6000;
export const MAX_REQUEST_COST_USD = 0.02;
export const PUBLIC_CACHE_TTL_SECONDS = 1200; // 20 minutes
const CACHE_TIMEOUT_MS = 1200;

const PERSONAL_TOOL_NAMES = new Set([
  'get_learner_adaptive_profile',
  'generate_study_prescription',
  'suggest_save_vocab_to_srs',
]);

const CACHEABLE_INTENTS = new Set([
  AGENT_INTENTS.VOCAB_TUTOR,
  AGENT_INTENTS.GRAMMAR_TUTOR,
]);

/**
 * Per-Request Token & Cost Budget Guard.
 */
export function checkAgentRequestBudget({
  totalTokens = 0,
  costUsd = 0,
  maxTotalTokens = MAX_REQUEST_TOTAL_TOKENS,
  maxCostUsd = MAX_REQUEST_COST_USD,
} = {}) {
  const safeTokenLimit = Math.max(100, Number(maxTotalTokens) || MAX_REQUEST_TOTAL_TOKENS);
  const safeCostLimit = Math.max(0.0001, Number(maxCostUsd) || MAX_REQUEST_COST_USD);
  const tokenExceeded = Number(totalTokens || 0) >= safeTokenLimit;
  const costExceeded = Number(costUsd || 0) >= safeCostLimit;

  return {
    withinBudget: !tokenExceeded && !costExceeded,
    tokenExceeded,
    costExceeded,
    reason: tokenExceeded
      ? `token_budget_reached_${safeTokenLimit}`
      : costExceeded
        ? `cost_budget_reached_${safeCostLimit}`
        : null,
  };
}

/**
 * Strict Public-Only Cache Eligibility Check.
 * Never caches personalized turns, history turns, or personal tool calls.
 */
export function isCacheEligible({
  intent,
  memoryApplied = false,
  history = [],
  toolsUsed = [],
} = {}) {
  if (!CACHEABLE_INTENTS.has(intent)) return false;
  if (memoryApplied) return false;
  if (Array.isArray(history) && history.length > 0) return false;
  if (Array.isArray(toolsUsed) && toolsUsed.some((t) => PERSONAL_TOOL_NAMES.has(t?.toolName || t))) {
    return false;
  }
  return true;
}

export function buildPublicCacheKey({
  query = '',
  intent = '',
  hskLevel = 'HSK 1',
  promptVersion = '1.0.0',
  modelTier = 'standard',
} = {}) {
  const normalizedQuery = String(query || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const raw = `${normalizedQuery}|${intent}|${String(hskLevel || 'HSK 1').toUpperCase()}|${promptVersion}|${modelTier}`;
  const digest = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);
  return `hanzigo:agent:pubcache:v1:${digest}`;
}

function getRedisCredentials() {
  const isIsolatedTest =
    Boolean(process.env.NODE_TEST_CONTEXT) && process.env.HANZIGO_TEST_UPSTASH !== 'true';
  if (isIsolatedTest) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || typeof fetch !== 'function') return null;
  return { url, token };
}

/**
 * Fail-open Upstash Redis GET for strict public-only cache.
 */
export async function getPublicCachedAnswer(cacheKey, { cacheAdapter = null } = {}) {
  if (!cacheKey) return null;

  if (cacheAdapter && typeof cacheAdapter.get === 'function') {
    try {
      const val = await cacheAdapter.get(cacheKey);
      return val && typeof val === 'object' ? val : null;
    } catch {
      return null;
    }
  }

  const creds = getRedisCredentials();
  if (!creds) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CACHE_TIMEOUT_MS);
  try {
    const res = await fetch(`${creds.url}/get/${encodeURIComponent(cacheKey)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${creds.token}` },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.result) return null;
    const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fail-open Upstash Redis SETEX for strict public-only cache.
 */
export async function setPublicCachedAnswer(
  cacheKey,
  payload,
  { ttlSeconds = PUBLIC_CACHE_TTL_SECONDS, cacheAdapter = null } = {}
) {
  if (!cacheKey || !payload || typeof payload !== 'object') return false;

  if (cacheAdapter && typeof cacheAdapter.set === 'function') {
    try {
      await cacheAdapter.set(cacheKey, payload, ttlSeconds);
      return true;
    } catch {
      return false;
    }
  }

  const creds = getRedisCredentials();
  if (!creds) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CACHE_TIMEOUT_MS);
  try {
    const res = await fetch(`${creds.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([['SET', cacheKey, JSON.stringify(payload), 'EX', ttlSeconds]]),
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function hashUserId(userId) {
  if (!userId) return 'guest';
  return crypto.createHash('sha256').update(String(userId)).digest('hex').slice(0, 16);
}

/**
 * Build a PII-free structured trace record for observability.
 */
export function buildAgentTraceRecord({
  traceId = crypto.randomUUID(),
  requestId = '',
  userId = null,
  intent = '',
  tier = null,
  model = null,
  promptId = '',
  promptVersion = '',
  stepsCount = 0,
  toolCallsCount = 0,
  toolsUsed = [],
  ragSourceIds = [],
  evidenceStatus = 'insufficient_evidence',
  cacheHit = false,
  budgetCapped = false,
  fallbackUsed = false,
  fallbackReason = null,
  memoryApplied = false,
  totalTokens = 0,
  costUsd = 0,
  latencyMs = 0,
  status = 'ok',
  errorCode = null,
} = {}) {
  const rawRecord = {
    traceId,
    requestId,
    userIdHash: hashUserId(userId),
    intent,
    tier,
    model,
    promptId,
    promptVersion,
    stepsCount,
    toolCallsCount,
    toolsUsed: Array.isArray(toolsUsed) ? toolsUsed.map((t) => t?.toolName || String(t)) : [],
    ragSourceIds: Array.isArray(ragSourceIds) ? ragSourceIds.slice(0, 10) : [],
    evidenceStatus,
    cacheHit: Boolean(cacheHit),
    budgetCapped: Boolean(budgetCapped),
    fallbackUsed: Boolean(fallbackUsed),
    fallbackReason: fallbackReason || null,
    memoryApplied: Boolean(memoryApplied),
    totalTokens: Math.max(0, Number(totalTokens) || 0),
    costUsd: Number(Number(costUsd || 0).toFixed(8)),
    latencyMs: Math.max(0, Number(latencyMs) || 0),
    status,
    ...(errorCode ? { errorCode } : {}),
    timestamp: new Date().toISOString(),
  };

  return redactSensitiveData(rawRecord);
}

export function emitAgentTrace(record, { sink = null } = {}) {
  if (!record || typeof record !== 'object') return;
  const safeRecord = redactSensitiveData(record);
  if (typeof sink === 'function') {
    try {
      sink(safeRecord);
    } catch {}
    return;
  }
  if (!process.env.NODE_TEST_CONTEXT) {
    console.info(JSON.stringify({ event: 'hanzigo_agent_trace', ...safeRecord }));
  }
}
