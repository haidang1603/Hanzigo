/**
 * =========================================================================
 * HANZI GO - REUSABLE SERVER-SIDE AI PROVIDER ADAPTER
 * =========================================================================
 * Gemini-First AI Architecture with Deterministic Offline Fallback:
 * 1. Primary: Google Gemini (Server-side ONLY via process.env.GEMINI_API_KEY)
 *    - Model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
 * 2. Graceful Offline Fallback:
 *    - When GEMINI_API_KEY is unconfigured, rate-limited, or quota-exhausted,
 *      returns standardized fallback signals so downstream caller seamlessly
 *      activates deterministicRuleEngine with zero application crashes.
 * =========================================================================
 */

export const GEMINI_DEFAULT_MODEL = 'gemini-3.5-flash-lite';
export const DEFAULT_TIMEOUT_MS = 25000;
const KEY_COOLDOWN_MS = 60_000;
const rateLimitedKeysUntil = new Map();

const GEMINI_PRICING_PER_1M_USD = {
  'flash-lite': { input: 0.10, output: 0.40 },
  flash: { input: 0.15, output: 0.60 },
  pro: { input: 1.25, output: 5.00 },
};

/**
 * Calculate token cost in USD based on Gemini model tier and token counts.
 */
export function calculateGeminiTokenCost({
  model = GEMINI_DEFAULT_MODEL,
  promptTokens = 0,
  completionTokens = 0,
} = {}) {
  const normalized = String(model || '').toLowerCase();
  const tier = normalized.includes('pro')
    ? GEMINI_PRICING_PER_1M_USD.pro
    : normalized.includes('flash-lite')
      ? GEMINI_PRICING_PER_1M_USD['flash-lite']
      : GEMINI_PRICING_PER_1M_USD.flash;

  const safePrompt = Math.max(0, Number(promptTokens) || 0);
  const safeCompletion = Math.max(0, Number(completionTokens) || 0);

  const inputCostUsd = (safePrompt / 1_000_000) * tier.input;
  const outputCostUsd = (safeCompletion / 1_000_000) * tier.output;
  const totalCostUsd = Number((inputCostUsd + outputCostUsd).toFixed(8));

  return {
    costUsd: totalCostUsd,
    inputCostUsd: Number(inputCostUsd.toFixed(8)),
    outputCostUsd: Number(outputCostUsd.toFixed(8)),
    inputRatePer1M: tier.input,
    outputRatePer1M: tier.output,
  };
}

/**
 * Collect all configured Gemini API keys in priority order:
 * GEMINI_API_KEY, GEMINI_API_KEYS (comma-separated), and GEMINI_API_KEY_1..10.
 * Places non-cooled-down keys first so rate-limited keys are skipped automatically.
 */
export function getGeminiApiKeys(now = Date.now()) {
  const candidates = [];
  if (process.env.GEMINI_API_KEY) {
    candidates.push(process.env.GEMINI_API_KEY);
  }
  if (process.env.GEMINI_API_KEYS) {
    for (const part of process.env.GEMINI_API_KEYS.split(',')) {
      candidates.push(part);
    }
  }
  for (let i = 1; i <= 10; i += 1) {
    const numbered = process.env[`GEMINI_API_KEY_${i}`];
    if (numbered) candidates.push(numbered);
  }

  const deduped = [];
  const seen = new Set();
  for (const raw of candidates) {
    const key = String(raw || '').trim();
    if (!key || key === 'your_gemini_api_key_here' || seen.has(key)) continue;
    seen.add(key);
    deduped.push(key);
  }

  const healthy = [];
  const cooledDown = [];
  for (const key of deduped) {
    const until = rateLimitedKeysUntil.get(key) || 0;
    if (until > now) {
      cooledDown.push(key);
    } else {
      if (until > 0) rateLimitedKeysUntil.delete(key);
      healthy.push(key);
    }
  }
  return [...healthy, ...cooledDown];
}

export function markGeminiKeyRateLimited(apiKey, cooldownMs = KEY_COOLDOWN_MS, now = Date.now()) {
  if (!apiKey) return;
  rateLimitedKeysUntil.set(apiKey, now + cooldownMs);
}

export function __resetGeminiKeyPoolForTests() {
  rateLimitedKeysUntil.clear();
}

/**
 * Extracts and cleans JSON from raw LLM responses.
 * Handles Markdown code blocks (```json ... ```) and conversational wrappers.
 */
export function extractStructuredJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Chuỗi phản hồi từ AI trống hoặc không hợp lệ.');
  }

  let text = rawText.trim();

  // Strip code fences
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // 1. Direct parse attempt
  try {
    return JSON.parse(text);
  } catch {}

  // 2. Find outer JSON bounds if model wrapped JSON in conversational prose
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');

  let startIdx = -1;
  let isObject = false;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isObject = false;
  }

  if (startIdx !== -1) {
    const endIdx = isObject ? text.lastIndexOf('}') : text.lastIndexOf(']');
    if (endIdx > startIdx) {
      try {
        return JSON.parse(text.slice(startIdx, endIdx + 1));
      } catch {}
    }
    text = text.slice(startIdx);
  }

  // 3. Resilient repair for truncated JSON streaming outputs
  let searchIdx = text.length;
  while (searchIdx > 0) {
    const lastBrace = text.lastIndexOf('}', searchIdx - 1);
    if (lastBrace === -1) break;

    let candidate = text.slice(0, lastBrace + 1);

    // Count open brackets vs close brackets
    let openBrackets = (candidate.match(/\[/g) || []).length;
    let closeBrackets = (candidate.match(/\]/g) || []).length;
    let openBraces = (candidate.match(/\{/g) || []).length;
    let closeBraces = (candidate.match(/\}/g) || []).length;

    while (closeBrackets < openBrackets) {
      candidate += ']';
      closeBrackets++;
    }
    while (closeBraces < openBraces) {
      candidate += '}';
      closeBraces++;
    }

    try {
      return JSON.parse(candidate);
    } catch {}

    searchIdx = lastBrace;
  }

  return JSON.parse(text);
}

/**
 * Executes a call to Google Gemini (3.5 Flash Lite or configured).
 */
async function callGemini({
  apiKey,
  systemPrompt,
  userPrompt,
  model = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const cleanModel = (model || GEMINI_DEFAULT_MODEL).replace(/^models\//, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${systemPrompt ? `${systemPrompt}\n\n` : ''}${userPrompt}` }]
    }
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          responseMimeType: 'application/json'
        }
      }),
      signal: controller.signal
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { message: await response.text().catch(() => '') };
      }

      let errorCode = 'gemini_error';
      if (response.status === 400) errorCode = 'bad_request';
      else if (response.status === 401) errorCode = 'auth_error';
      else if (response.status === 403) errorCode = 'forbidden';
      else if (response.status === 404) errorCode = 'model_not_found';
      else if (response.status === 429) errorCode = 'rate_limit_exceeded';
      else if (response.status >= 500) errorCode = 'server_error';

      return {
        success: false,
        status: response.status,
        error: errorBody?.error?.message || errorBody?.message || `Gemini HTTP ${response.status}`,
        code: errorCode,
        latencyMs
      };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return {
        success: false,
        status: 502,
        error: 'Gemini trả về kết quả rỗng.',
        code: 'empty_response',
        latencyMs
      };
    }

    const parsedData = extractStructuredJson(rawText);

    // Prefer exact token counts from Gemini usageMetadata; fallback to ~4 chars/token estimate
    const usageMeta = data?.usageMetadata || {};
    const promptLen = (systemPrompt || '').length + (userPrompt || '').length;
    const promptTokens =
      typeof usageMeta.promptTokenCount === 'number'
        ? usageMeta.promptTokenCount
        : Math.ceil(promptLen / 4);
    const completionTokens =
      typeof usageMeta.candidatesTokenCount === 'number'
        ? usageMeta.candidatesTokenCount
        : Math.ceil(rawText.length / 4);
    const totalTokens =
      typeof usageMeta.totalTokenCount === 'number'
        ? usageMeta.totalTokenCount
        : promptTokens + completionTokens;

    const costBreakdown = calculateGeminiTokenCost({
      model: cleanModel,
      promptTokens,
      completionTokens,
    });

    return {
      success: true,
      provider: 'gemini',
      model: cleanModel,
      data: parsedData,
      rawText,
      usage: { promptTokens, completionTokens, totalTokens },
      costUsd: costBreakdown.costUsd,
      costBreakdown,
      latencyMs
    };
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return {
      success: false,
      status: isTimeout ? 504 : 500,
      error: isTimeout ? `Gemini timeout sau ${timeoutMs}ms` : err.message,
      code: isTimeout ? 'timeout' : 'network_error',
      latencyMs: Date.now() - startTime
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * CENTRALIZED FALLBACK COST & RECOVERY POLICY
 * Evaluates whether a failure from the primary provider should trigger secondary fallback.
 *
 * Strict Cost Rules:
 * 1. HTTP 400 (Bad Request): NEVER fallback to secondary provider (client formatting error).
 * 2. If Secondary Provider is Paid (e.g. Gemini fallback from free xKiro):
 *    - If ALLOW_PAID_FALLBACK !== true:
 *      STRICTLY FORBIDDEN to call secondary provider on ANY error path:
 *      401 (Auth Error), 403 (Forbidden), 404 (Model Not Found), 429 (Quota),
 *      500-599 (Server Error), Timeout (504), Network Error, or Malformed JSON.
 *      Returns `paidFallbackBlocked: true` and guides downstream to deterministic engine.
 *    - If ALLOW_PAID_FALLBACK === true:
 *      Fallback is permitted for recoverable failures (401, 403, 404, 429, 5xx, timeout, network error).
 * 3. If Secondary Provider is Free (e.g. xKiro fallback from Gemini):
 *    - Permitted for recoverable failures without incurring budget impact.
 */
export function evaluateFallbackPolicy({
  primaryStatus,
  primaryCode,
  primaryProvider,
  secondaryProvider,
  allowPaidFallback = false,
  hasSecondaryKey = false
}) {
  // Rule 1: 400 Bad Request is unrecoverable by secondary provider
  if (primaryStatus === 400) {
    return {
      canFallback: false,
      reason: 'client_bad_request',
      paidBlocked: false
    };
  }

  // If secondary key is not configured, cannot fallback
  if (!hasSecondaryKey) {
    return {
      canFallback: false,
      reason: 'no_secondary_key',
      paidBlocked: false
    };
  }

  // Determine if secondary provider is a paid service
  // Gemini is treated as paid provider when acting as fallback from free xKiro
  const isSecondaryPaid = (secondaryProvider === 'gemini');

  if (isSecondaryPaid && !allowPaidFallback) {
    return {
      canFallback: false,
      reason: 'paid_fallback_prohibited',
      paidBlocked: true
    };
  }

  return {
    canFallback: true,
    reason: 'recoverable_provider_error',
    paidBlocked: false
  };
}

/**
 * UNIFIED AI SERVICE DISPATCHER
 * Uses Google Gemini (GEMINI_API_KEY) with deterministic offline fallback.
 */
export async function callUnifiedAiProvider({
  systemPrompt = '',
  userPrompt = '',
  messages = null,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  action = 'personalize',
}) {
  const geminiKeys = getGeminiApiKeys();
  const geminiModel = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;

  const resolvedUserPrompt =
    userPrompt ||
    (Array.isArray(messages)
      ? messages
          .filter((m) => m.role !== 'system')
          .map((m) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`)
          .join('\n')
      : '');
  const resolvedSystemPrompt =
    systemPrompt ||
    (Array.isArray(messages)
      ? messages
          .filter((m) => m.role === 'system')
          .map((m) => m.content)
          .join('\n')
      : '');

  if (geminiKeys.length > 0) {
    let lastFailure = null;

    for (let idx = 0; idx < geminiKeys.length; idx += 1) {
      const apiKey = geminiKeys[idx];
      const geminiRes = await callGemini({
        apiKey,
        model: geminiModel,
        systemPrompt: resolvedSystemPrompt,
        userPrompt: resolvedUserPrompt,
        temperature,
        maxTokens,
        timeoutMs
      });

      if (geminiRes.success) {
        return {
          ...geminiRes,
          action,
          keyIndex: idx,
          timestamp: new Date().toISOString()
        };
      }

      lastFailure = geminiRes;
      console.warn(
        `[AI Gateway] Gemini call failed on key #${idx + 1}/${geminiKeys.length} (Status: ${geminiRes.status}, Error: ${geminiRes.error})`
      );

      // Do not rotate on 400 Bad Request (prompt/schema issue)
      if (geminiRes.status === 400) {
        break;
      }

      if (geminiRes.status === 429 || geminiRes.status === 403) {
        markGeminiKeyRateLimited(apiKey);
      }
    }

    return {
      success: false,
      status: lastFailure?.status || 503,
      provider: 'gemini',
      model: geminiModel,
      error: lastFailure?.error || 'All configured Gemini keys failed.',
      code: lastFailure?.code || 'provider_error',
      latencyMs: lastFailure?.latencyMs || 0
    };
  }

  // =========================================================================
  // NO PROVIDER CONFIGURED -> SAFE RETURN FOR DETERMINISTIC ENGINE
  // =========================================================================
  return {
    success: false,
    status: 503,
    provider: 'none',
    error: 'Chưa cấu hình GEMINI_API_KEY. Hệ thống sử dụng bộ sư phạm xác định offline.',
    code: 'NO_ACTIVE_AI_PROVIDER',
    latencyMs: 0
  };
}
