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
export const FALLBACK_TIMEOUT_MS = 12000;
export const MAX_FALLBACK_KEYS_PER_PROVIDER = 2;
const KEY_COOLDOWN_MS = 60_000;
const rateLimitedKeysUntil = new Map();

export const GROQ_DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_DEFAULT_MODEL_LITE = 'llama-3.1-8b-instant';
export const GROQ_DEFAULT_MODEL_STANDARD = 'llama-3.3-70b-versatile';

export const OPENROUTER_DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const OPENROUTER_DEFAULT_MODEL_LITE = 'openrouter/free';
export const OPENROUTER_DEFAULT_MODEL_STANDARD = 'qwen/qwen-2.5-72b-instruct:free';

const PROVIDER_LIVE_PREFIXES = {
  gemini: ['AIza', 'AQ.'],
  groq: ['gsk_'],
  openrouter: ['sk-or-'],
};

function redactSecret(text, secret = '') {
  let out = String(text || '');
  if (secret && String(secret).length >= 6) {
    out = out.split(String(secret)).join('[REDACTED_KEY]');
  }
  return out
    .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED]')
    .replace(/\b(AIza[0-9A-Za-z_-]{12,}|gsk_[0-9A-Za-z_-]{12,}|sk-or-[0-9A-Za-z_-]{12,}|sk-[0-9A-Za-z_-]{12,})\b/g, '[REDACTED_KEY]');
}

/**
 * Shared multi-key pool loader supporting:
 * <PREFIX>_API_KEY, <PREFIX>_API_KEYS (comma/newline separated), and <PREFIX>_API_KEY_1..10.
 * Sorts healthy keys before cooled-down keys using `${provider}:${key}` entries.
 */
export function getProviderApiKeys(prefix = 'GEMINI', now = Date.now()) {
  const upper = String(prefix || 'GEMINI').trim().toUpperCase();
  const provider = upper.toLowerCase();
  const placeholder = `your_${provider}_api_key_here`;
  const livePrefixes = PROVIDER_LIVE_PREFIXES[provider] || [];

  const candidates = [];
  if (process.env[`${upper}_API_KEY`]) {
    candidates.push(process.env[`${upper}_API_KEY`]);
  }
  if (process.env[`${upper}_API_KEYS`]) {
    for (const part of String(process.env[`${upper}_API_KEYS`]).split(/[,\r\n]+/)) {
      candidates.push(part);
    }
  }
  for (let i = 1; i <= 10; i += 1) {
    const numbered = process.env[`${upper}_API_KEY_${i}`];
    if (numbered) candidates.push(numbered);
  }

  const isIsolatedTestEnv =
    Boolean(process.env.NODE_TEST_CONTEXT) && process.env.HANZIGO_LIVE_AI_TEST !== 'true';
  const deduped = [];
  const seen = new Set();
  for (const raw of candidates) {
    const key = String(raw || '').trim();
    if (!key || key === placeholder || seen.has(key)) continue;
    if (isIsolatedTestEnv && livePrefixes.some((p) => key.startsWith(p))) continue;
    seen.add(key);
    deduped.push(key);
  }

  const healthy = [];
  const cooledDown = [];
  for (const key of deduped) {
    const cooldownKey = `${provider}:${key}`;
    const until = rateLimitedKeysUntil.get(cooldownKey) || 0;
    if (until > now) {
      cooledDown.push(key);
    } else {
      if (until > 0) rateLimitedKeysUntil.delete(cooldownKey);
      healthy.push(key);
    }
  }
  return [...healthy, ...cooledDown];
}

export function markProviderKeyRateLimited(provider, apiKey, cooldownMs = KEY_COOLDOWN_MS, now = Date.now()) {
  if (!provider || !apiKey) return;
  rateLimitedKeysUntil.set(`${String(provider).toLowerCase()}:${apiKey}`, now + cooldownMs);
}

export function getGroqApiKeys(now = Date.now()) {
  return getProviderApiKeys('GROQ', now);
}

export function getOpenRouterApiKeys(now = Date.now()) {
  return getProviderApiKeys('OPENROUTER', now);
}

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
  return getProviderApiKeys('GEMINI', now);
}

export function markGeminiKeyRateLimited(apiKey, cooldownMs = KEY_COOLDOWN_MS, now = Date.now()) {
  markProviderKeyRateLimited('gemini', apiKey, cooldownMs, now);
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

function convertGeminiContentsToOpenAiMessages({ systemInstruction = '', contents = [], messages = null } = {}) {
  const out = [];
  if (systemInstruction && String(systemInstruction).trim()) {
    out.push({ role: 'system', content: String(systemInstruction).trim() });
  }

  if (Array.isArray(messages) && messages.length > 0) {
    for (const m of messages) {
      if (!m) continue;
      const role = m.role === 'model' ? 'assistant' : (m.role || 'user');
      if (role === 'system' && out.some((x) => x.role === 'system')) continue;
      out.push({ role, content: String(m.content || m.text || '') });
    }
    return out;
  }

  if (!Array.isArray(contents)) return out;

  const pendingCallIdsByName = new Map();
  let callCounter = 0;

  for (const item of contents) {
    if (!item) continue;
    if (!Array.isArray(item.parts)) {
      const role = item.role === 'model' ? 'assistant' : (item.role || 'user');
      out.push({ role, content: String(item.content || item.text || '') });
      continue;
    }

    const textParts = [];
    const toolCalls = [];
    const toolResponses = [];

    for (const part of item.parts) {
      if (!part) continue;
      if (part.functionCall?.name) {
        callCounter += 1;
        const callId = `call_${callCounter}_${part.functionCall.name}`;
        pendingCallIdsByName.set(part.functionCall.name, callId);
        toolCalls.push({
          id: callId,
          type: 'function',
          function: {
            name: String(part.functionCall.name),
            arguments: JSON.stringify(part.functionCall.args || {}),
          },
        });
      } else if (part.functionResponse?.name) {
        const fnName = String(part.functionResponse.name);
        const callId = pendingCallIdsByName.get(fnName) || `call_${fnName}`;
        toolResponses.push({
          role: 'tool',
          tool_call_id: callId,
          name: fnName,
          content: JSON.stringify(part.functionResponse.response ?? {}),
        });
      } else if (typeof part.text === 'string' && part.text.trim()) {
        textParts.push(part.text);
      }
    }

    if (toolResponses.length > 0) {
      for (const tr of toolResponses) out.push(tr);
    } else if (toolCalls.length > 0) {
      out.push({
        role: 'assistant',
        content: textParts.length > 0 ? textParts.join('\n') : null,
        tool_calls: toolCalls,
      });
    } else if (textParts.length > 0) {
      const role = item.role === 'model' ? 'assistant' : (item.role || 'user');
      out.push({ role, content: textParts.join('\n') });
    }
  }

  return out;
}

function convertGeminiToolsToOpenAiTools(tools = []) {
  if (!Array.isArray(tools) || tools.length === 0) return [];
  const declarations = [];
  for (const entry of tools) {
    if (Array.isArray(entry?.functionDeclarations)) {
      declarations.push(...entry.functionDeclarations);
    } else if (entry?.name) {
      declarations.push(entry);
    }
  }
  return declarations
    .filter((fn) => fn?.name)
    .map((fn) => ({
      type: 'function',
      function: {
        name: String(fn.name),
        description: String(fn.description || ''),
        parameters: fn.parameters && typeof fn.parameters === 'object'
          ? fn.parameters
          : { type: 'object', properties: {} },
      },
    }));
}

/**
 * Shared OpenAI-compatible Chat Completions adapter (Groq, OpenRouter, etc.).
 */
export async function callOpenAiCompatibleProvider({
  providerName = 'openai_compatible',
  baseUrl,
  apiKey,
  model,
  systemInstruction = '',
  messages = null,
  contents = [],
  tools = [],
  jsonMode = false,
  maxOutputTokens = 1000,
  temperature = 0.5,
  timeoutMs = FALLBACK_TIMEOUT_MS,
} = {}) {
  if (!baseUrl || !apiKey || !model) {
    return {
      success: false,
      status: 503,
      provider: providerName,
      model: model || '',
      code: 'NO_ACTIVE_AI_PROVIDER',
      error: 'Thiếu cấu hình provider OpenAI-compatible.',
      latencyMs: 0,
    };
  }

  const effectiveTimeout = Math.min(FALLBACK_TIMEOUT_MS, Math.max(1000, Number(timeoutMs) || FALLBACK_TIMEOUT_MS));
  const openAiMessages = convertGeminiContentsToOpenAiMessages({ systemInstruction, contents, messages });
  const openAiTools = convertGeminiToolsToOpenAiTools(tools);

  const requestBody = {
    model,
    messages: openAiMessages,
    temperature,
    max_tokens: maxOutputTokens,
  };

  if (openAiTools.length > 0) {
    requestBody.tools = openAiTools;
    requestBody.tool_choice = 'auto';
  } else if (jsonMode) {
    requestBody.response_format = { type: 'json_object' };
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  if (providerName === 'openrouter' || String(baseUrl).includes('openrouter.ai')) {
    headers['HTTP-Referer'] = process.env.PUBLIC_SITE_URL || 'https://www.hanzigo.io.vn';
    headers['X-Title'] = 'HanziGo';
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), effectiveTimeout);
  const startTime = Date.now();

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      let errText = '';
      try {
        const errJson = await response.json();
        errText = errJson?.error?.message || errJson?.message || JSON.stringify(errJson);
      } catch {
        errText = await response.text().catch(() => '');
      }
      const safeError = redactSecret(errText || `${providerName} HTTP ${response.status}`, apiKey);
      return {
        success: false,
        status: response.status,
        provider: providerName,
        model,
        code: response.status === 429 ? 'rate_limit_exceeded' : response.status === 400 ? 'bad_request' : 'provider_error',
        error: safeError,
        latencyMs,
      };
    }

    const data = await response.json();
    const choiceMsg = data?.choices?.[0]?.message || {};
    const rawToolCalls = Array.isArray(choiceMsg.tool_calls) ? choiceMsg.tool_calls : [];

    const toolCalls = rawToolCalls
      .filter((tc) => tc?.function?.name)
      .map((tc) => {
        let parsedArgs = {};
        try {
          parsedArgs = typeof tc.function.arguments === 'string'
            ? JSON.parse(tc.function.arguments || '{}')
            : (tc.function.arguments || {});
        } catch {
          parsedArgs = {};
        }
        return {
          name: String(tc.function.name),
          args: parsedArgs && typeof parsedArgs === 'object' ? parsedArgs : {},
        };
      });

    const text = typeof choiceMsg.content === 'string' ? choiceMsg.content.trim() : '';
    if (toolCalls.length === 0 && !text) {
      return {
        success: false,
        status: 502,
        provider: providerName,
        model,
        code: 'empty_response',
        error: `${providerName} trả về phản hồi rỗng.`,
        latencyMs,
      };
    }

    let parsedJson = null;
    if (toolCalls.length === 0 && text) {
      try {
        parsedJson = extractStructuredJson(text);
      } catch {
        parsedJson = null;
      }
    }

    const usageRaw = data?.usage || {};
    const promptTokens = Number(usageRaw.prompt_tokens) || 0;
    const completionTokens = Number(usageRaw.completion_tokens) || Math.ceil(text.length / 4);
    const totalTokens = Number(usageRaw.total_tokens) || promptTokens + completionTokens;
    const isFreeModel = String(model).includes(':free') || model === 'openrouter/free' || providerName === 'groq';
    const costUsd = isFreeModel ? 0 : Number((((promptTokens + completionTokens) / 1_000_000) * 0.25).toFixed(8));

    return {
      success: true,
      provider: providerName,
      model,
      type: toolCalls.length > 0 ? 'tool_calls' : 'final_text',
      toolCalls,
      text,
      rawText: text,
      parsedJson,
      data: parsedJson,
      usage: { promptTokens, completionTokens, totalTokens },
      costUsd,
      fallbackUsed: true,
      latencyMs,
    };
  } catch (err) {
    const isTimeout = err?.name === 'AbortError';
    return {
      success: false,
      status: isTimeout ? 504 : 500,
      provider: providerName,
      model,
      code: isTimeout ? 'timeout' : 'network_error',
      error: isTimeout
        ? `${providerName} timeout sau ${effectiveTimeout}ms`
        : redactSecret(err?.message || 'Network error', apiKey),
      latencyMs: Date.now() - startTime,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runOpenAiFallbackChain({
  tier = 'standard',
  systemInstruction = '',
  messages = null,
  contents = [],
  tools = [],
  jsonMode = false,
  maxOutputTokens = 1000,
  temperature = 0.5,
  timeoutMs = FALLBACK_TIMEOUT_MS,
} = {}) {
  const isLite = tier === 'lite';
  const providers = [
    {
      name: 'groq',
      keys: getGroqApiKeys().slice(0, MAX_FALLBACK_KEYS_PER_PROVIDER),
      baseUrl: (process.env.GROQ_BASE_URL || GROQ_DEFAULT_BASE_URL).trim(),
      model: (
        isLite
          ? (process.env.GROQ_MODEL_LITE || GROQ_DEFAULT_MODEL_LITE)
          : (process.env.GROQ_MODEL_STANDARD || GROQ_DEFAULT_MODEL_STANDARD)
      ).trim(),
    },
    {
      name: 'openrouter',
      keys: getOpenRouterApiKeys().slice(0, MAX_FALLBACK_KEYS_PER_PROVIDER),
      baseUrl: (process.env.OPENROUTER_BASE_URL || OPENROUTER_DEFAULT_BASE_URL).trim(),
      model: (
        isLite
          ? (process.env.OPENROUTER_MODEL_LITE || OPENROUTER_DEFAULT_MODEL_LITE)
          : (process.env.OPENROUTER_MODEL_STANDARD || OPENROUTER_DEFAULT_MODEL_STANDARD)
      ).trim(),
    },
  ];

  for (const provider of providers) {
    for (let idx = 0; idx < provider.keys.length; idx += 1) {
      const apiKey = provider.keys[idx];
      const res = await callOpenAiCompatibleProvider({
        providerName: provider.name,
        baseUrl: provider.baseUrl,
        apiKey,
        model: provider.model,
        systemInstruction,
        messages,
        contents,
        tools,
        jsonMode,
        maxOutputTokens,
        temperature,
        timeoutMs,
      });
      if (res.success) return res;
      console.warn(
        `[AI Gateway] ${provider.name} fallback failed on key #${idx + 1}/${provider.keys.length} (Status: ${res.status}, Error: ${redactSecret(res.error, apiKey)})`
      );
      if (res.status === 400) break;
      if (res.status === 429 || res.status === 403) {
        markProviderKeyRateLimited(provider.name, apiKey);
      }
    }
  }

  return null;
}

/**
 * UNIFIED AI SERVICE DISPATCHER
 * Uses Google Gemini (GEMINI_API_KEY) with Groq -> OpenRouter -> deterministic offline fallback.
 */
export async function callUnifiedAiProvider({
  systemPrompt = '',
  userPrompt = '',
  messages = null,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  action = 'personalize',
  tier = null,
}) {
  const geminiKeys = getGeminiApiKeys();
  const geminiModel = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const resolvedTier = tier || (maxTokens <= 700 ? 'lite' : 'standard');

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

  let lastFailure = null;

  if (geminiKeys.length > 0) {
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
        `[AI Gateway] Gemini call failed on key #${idx + 1}/${geminiKeys.length} (Status: ${geminiRes.status}, Error: ${redactSecret(geminiRes.error, apiKey)})`
      );

      // Do not rotate on 400 Bad Request (prompt/schema issue)
      if (geminiRes.status === 400) {
        return {
          success: false,
          status: lastFailure?.status || 400,
          provider: 'gemini',
          model: geminiModel,
          error: lastFailure?.error || 'Bad request.',
          code: lastFailure?.code || 'bad_request',
          latencyMs: lastFailure?.latencyMs || 0
        };
      }

      if (geminiRes.status === 429 || geminiRes.status === 403) {
        markGeminiKeyRateLimited(apiKey);
      }
    }
  }

  // =========================================================================
  // TIER-2 FALLBACK: GROQ -> OPENROUTER (OPENAI-COMPATIBLE)
  // =========================================================================
  const fallbackRes = await runOpenAiFallbackChain({
    tier: resolvedTier,
    systemInstruction: resolvedSystemPrompt,
    contents: resolvedUserPrompt ? [{ role: 'user', parts: [{ text: resolvedUserPrompt }] }] : [],
    messages: !resolvedUserPrompt && Array.isArray(messages) ? messages : null,
    jsonMode: true,
    maxOutputTokens: maxTokens,
    temperature,
    timeoutMs: Math.min(FALLBACK_TIMEOUT_MS, timeoutMs),
  });

  if (fallbackRes?.success && (fallbackRes.data || fallbackRes.text)) {
    return {
      ...fallbackRes,
      action,
      fallbackUsed: true,
      timestamp: new Date().toISOString(),
    };
  }

  if (lastFailure) {
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

function normalizeGeminiContents(contents) {
  if (!Array.isArray(contents)) return [];
  return contents.map((item) => {
    if (item && Array.isArray(item.parts)) {
      return {
        role: item.role === 'assistant' ? 'model' : (item.role || 'user'),
        parts: item.parts,
      };
    }
    return {
      role: item?.role === 'assistant' ? 'model' : (item?.role || 'user'),
      parts: [{ text: String(item?.content || item?.text || '') }],
    };
  });
}

async function executeGeminiAgentHttpCall({
  apiKey,
  model,
  systemInstruction,
  contents,
  tools,
  temperature,
  maxOutputTokens,
  timeoutMs,
}) {
  const cleanModel = String(model || GEMINI_DEFAULT_MODEL).replace(/^models\//, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

  const body = {
    contents: normalizeGeminiContents(contents),
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  };

  if (systemInstruction && String(systemInstruction).trim()) {
    body.systemInstruction = {
      parts: [{ text: String(systemInstruction).trim() }],
    };
  }

  if (Array.isArray(tools) && tools.length > 0) {
    body.tools = tools;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const latencyMs = Date.now() - startTime;
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { message: await response.text().catch(() => '') };
      }
      return {
        success: false,
        status: response.status,
        code: response.status === 429 ? 'rate_limit_exceeded' : response.status === 400 ? 'bad_request' : 'gemini_error',
        error: errorBody?.error?.message || errorBody?.message || `Gemini HTTP ${response.status}`,
        model: cleanModel,
        latencyMs,
      };
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const toolCalls = [];
    const textChunks = [];

    for (const part of parts) {
      if (part?.functionCall?.name) {
        toolCalls.push({
          name: String(part.functionCall.name),
          args: part.functionCall.args && typeof part.functionCall.args === 'object' ? part.functionCall.args : {},
        });
      } else if (typeof part?.text === 'string' && part.text.trim()) {
        textChunks.push(part.text);
      }
    }

    const text = textChunks.join('\n').trim();
    if (toolCalls.length === 0 && !text) {
      return {
        success: false,
        status: 502,
        code: 'empty_response',
        error: 'Gemini trả về phản hồi rỗng.',
        model: cleanModel,
        latencyMs,
      };
    }

    let parsedJson = null;
    if (toolCalls.length === 0 && text) {
      try {
        parsedJson = extractStructuredJson(text);
      } catch {
        parsedJson = null;
      }
    }

    const usageMeta = data?.usageMetadata || {};
    const promptTokens = Number(usageMeta.promptTokenCount) || 0;
    const completionTokens = Number(usageMeta.candidatesTokenCount) || Math.ceil(text.length / 4);
    const totalTokens = Number(usageMeta.totalTokenCount) || promptTokens + completionTokens;
    const costBreakdown = calculateGeminiTokenCost({ model: cleanModel, promptTokens, completionTokens });

    return {
      success: true,
      type: toolCalls.length > 0 ? 'tool_calls' : 'final_text',
      toolCalls,
      text,
      parsedJson,
      usage: { promptTokens, completionTokens, totalTokens },
      costUsd: costBreakdown.costUsd,
      costBreakdown,
      model: cleanModel,
      latencyMs,
    };
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return {
      success: false,
      status: isTimeout ? 504 : 500,
      code: isTimeout ? 'timeout' : 'network_error',
      error: isTimeout ? `Gemini timeout sau ${timeoutMs}ms` : err.message,
      model: cleanModel,
      latencyMs: Date.now() - startTime,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Execute one Agent model turn with Gemini Function Calling support,
 * bounded retries, multi-key rotation, and fallbackModel degradation.
 */
export async function callAgentModelTurn({
  systemInstruction = '',
  contents = [],
  tools = [],
  routingDecision = {},
  timeoutMs = null,
  maxRetries = 1,
} = {}) {
  const geminiKeys = getGeminiApiKeys();
  const tier = routingDecision?.tier || 'standard';
  const primaryModel = routingDecision?.model || process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const fallbackModel = routingDecision?.fallbackModel || primaryModel;
  const effectiveTimeout = Math.min(25000, Math.max(1000, Number(timeoutMs || routingDecision?.timeoutMs || DEFAULT_TIMEOUT_MS)));
  const maxOutputTokens = Number(routingDecision?.maxOutputTokens || 1000);
  const temperature = typeof routingDecision?.temperature === 'number' ? routingDecision.temperature : 0.5;
  const boundedRetries = Math.min(2, Math.max(0, Number(maxRetries) || 0));

  if (geminiKeys.length === 0) {
    const fallbackRes = await runOpenAiFallbackChain({
      tier,
      systemInstruction,
      contents,
      tools,
      jsonMode: false,
      maxOutputTokens,
      temperature,
      timeoutMs: Math.min(FALLBACK_TIMEOUT_MS, effectiveTimeout),
    });
    if (fallbackRes?.success) {
      return { ...fallbackRes, tier, fallbackUsed: true };
    }

    return {
      success: false,
      status: 503,
      code: 'NO_ACTIVE_AI_PROVIDER',
      error: 'Chưa cấu hình GEMINI_API_KEY.',
      type: 'final_text',
      toolCalls: [],
      text: '',
      parsedJson: null,
      model: primaryModel,
      tier,
      fallbackUsed: false,
      latencyMs: 0,
    };
  }

  const runWithModel = async (targetModel, attemptLimit) => {
    let lastFailure = null;
    const keysToTry = geminiKeys.slice(0, Math.max(1, attemptLimit + 1));

    for (let idx = 0; idx < keysToTry.length; idx += 1) {
      const apiKey = keysToTry[idx];
      const res = await executeGeminiAgentHttpCall({
        apiKey,
        model: targetModel,
        systemInstruction,
        contents,
        tools,
        temperature,
        maxOutputTokens,
        timeoutMs: effectiveTimeout,
      });

      if (res.success) {
        return { ...res, provider: 'gemini' };
      }

      lastFailure = res;
      if (res.status === 400) break;
      if (res.status === 429 || res.status === 403) {
        markGeminiKeyRateLimited(apiKey);
      }
    }

    return lastFailure;
  };

  const primaryRes = await runWithModel(primaryModel, boundedRetries);
  if (primaryRes?.success) {
    return { ...primaryRes, tier, fallbackUsed: false };
  }

  let totalLatencyMs = primaryRes?.latencyMs || 0;
  let lastFailedRes = primaryRes;

  if (primaryRes?.status !== 400 && fallbackModel && fallbackModel !== primaryModel) {
    const fallbackRes = await runWithModel(fallbackModel, 0);
    totalLatencyMs += fallbackRes?.latencyMs || 0;
    if (fallbackRes?.success) {
      return { ...fallbackRes, tier, fallbackUsed: true };
    }
    lastFailedRes = fallbackRes || primaryRes;
  }

  if (primaryRes?.status !== 400) {
    const openAiFallback = await runOpenAiFallbackChain({
      tier,
      systemInstruction,
      contents,
      tools,
      jsonMode: false,
      maxOutputTokens,
      temperature,
      timeoutMs: Math.min(FALLBACK_TIMEOUT_MS, effectiveTimeout),
    });
    if (openAiFallback?.success) {
      return {
        ...openAiFallback,
        tier,
        fallbackUsed: true,
        latencyMs: totalLatencyMs + (openAiFallback.latencyMs || 0),
      };
    }
  }

  return {
    success: false,
    status: lastFailedRes?.status || 503,
    code: lastFailedRes?.code || 'provider_error',
    error: lastFailedRes?.error || 'Model call failed.',
    type: 'final_text',
    toolCalls: [],
    text: '',
    parsedJson: null,
    model: lastFailedRes?.model || primaryModel,
    tier,
    fallbackUsed: lastFailedRes !== primaryRes,
    latencyMs: totalLatencyMs,
  };
}
