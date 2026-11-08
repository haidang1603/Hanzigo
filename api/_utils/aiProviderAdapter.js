/**
 * =========================================================================
 * HANZI GO - REUSABLE SERVER-SIDE AI PROVIDER ADAPTER
 * =========================================================================
 * Free-First AI Architecture with xKiro as the Primary Provider:
 * 1. Primary: xKiro (OpenAI-compatible endpoint with generous free-tier tokens)
 *    - Base URL: process.env.XKIRO_BASE_URL || 'https://api.xkiro.com/v1'
 *    - Model: process.env.XKIRO_MODEL || 'qwen/qwen-plus-2025-07-28'
 *    - API Key: process.env.XKIRO_API_KEY (Server-side ONLY, never in client)
 *    - Zero-Cost Policy: Free tokens consumed first; no silent charges incurred.
 * 2. Secondary (Paid Fallback): Google Gemini 1.5 Flash
 *    - Only enabled if ALLOW_PAID_FALLBACK=true explicitly configured by Admin,
 *      OR if XKIRO_API_KEY is not configured and GEMINI_API_KEY is present.
 * 3. Graceful Offline Fallback:
 *    - When providers are unconfigured, rate-limited, or quota-exhausted,
 *      returns standardized fallback signals so downstream caller seamlessly
 *      activates deterministicRuleEngine with zero application crashes.
 * =========================================================================
 */

export const XKIRO_DEFAULT_BASE_URL = 'https://api.xkiro.com/v1';
export const XKIRO_DEFAULT_MODEL = 'sensenova/sensenova-6.8-flash-lite';
export const GEMINI_DEFAULT_MODEL = 'gemini-3.5-flash-lite';
export const DEFAULT_TIMEOUT_MS = 25000;

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
 * Executes a call to the xKiro OpenAI-compatible endpoint.
 */
async function callXkiro({
  apiKey,
  baseUrl = XKIRO_DEFAULT_BASE_URL,
  model = process.env.XKIRO_MODEL || XKIRO_DEFAULT_MODEL,
  messages,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const url = `${cleanBaseUrl}/chat/completions`;
  const cleanModel = model || process.env.XKIRO_MODEL || XKIRO_DEFAULT_MODEL;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: cleanModel,
        messages,
        temperature,
        max_tokens: maxTokens
      }),
      signal: controller.signal
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errStatus = response.status;
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { message: await response.text().catch(() => '') };
      }

      let errorCode = 'provider_error';
      if (errStatus === 400) errorCode = 'bad_request';
      else if (errStatus === 401) errorCode = 'auth_error';
      else if (errStatus === 403) errorCode = 'forbidden';
      else if (errStatus === 404) errorCode = 'model_not_found';
      else if (errStatus === 429) errorCode = 'rate_limit_exceeded';
      else if (errStatus >= 500) errorCode = 'server_error';

      return {
        success: false,
        status: errStatus,
        error: errorBody?.error?.message || errorBody?.message || `xKiro HTTP ${errStatus}`,
        code: errorBody?.error?.code || errorCode,
        latencyMs
      };
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;

    if (!messageContent) {
      return {
        success: false,
        status: 502,
        error: 'xKiro phản hồi rỗng (không có message content).',
        code: 'empty_response',
        latencyMs
      };
    }

    const parsedData = extractStructuredJson(messageContent);
    const usage = data?.usage || {};

    return {
      success: true,
      provider: 'xkiro',
      model: cleanModel,
      data: parsedData,
      rawText: messageContent,
      usage: {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0
      },
      costUsd: 0, // xKiro free tier model consumes $0.00
      latencyMs
    };
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return {
      success: false,
      status: isTimeout ? 504 : 500,
      error: isTimeout ? `xKiro timeout sau ${timeoutMs}ms` : err.message,
      code: isTimeout ? 'timeout' : 'network_error',
      latencyMs: Date.now() - startTime
    };
  } finally {
    clearTimeout(timer);
  }
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

    // Approximate token count: ~4 chars per token
    const promptLen = (systemPrompt || '').length + (userPrompt || '').length;
    const promptTokens = Math.ceil(promptLen / 4);
    const completionTokens = Math.ceil(rawText.length / 4);
    const totalTokens = promptTokens + completionTokens;

    // Gemini 1.5/2.5/3.5 Flash pricing estimate
    const costUsd = Number(((promptTokens * 0.000000075) + (completionTokens * 0.0000003)).toFixed(6));

    return {
      success: true,
      provider: 'gemini',
      model: cleanModel,
      data: parsedData,
      rawText,
      usage: { promptTokens, completionTokens, totalTokens },
      costUsd,
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
 * Configurable Primary & Secondary Providers:
 * - AI_PRIMARY_PROVIDER: 'xkiro' (Free-First) or 'gemini'
 * - XKIRO_MODEL: Default 'sensenova/sensenova-6.8-flash-lite'
 * - GEMINI_MODEL: Default 'gemini-3.5-flash-lite'
 * - ALLOW_PAID_FALLBACK: Protects budget against unintended charges
 */
export async function callUnifiedAiProvider({
  systemPrompt = '',
  userPrompt = '',
  messages = null,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  action = 'personalize',
  provider = null
}) {
  const primaryProvider = (provider || process.env.AI_PRIMARY_PROVIDER || 'xkiro').toLowerCase();

  const xkiroKey = process.env.XKIRO_API_KEY;
  const xkiroBaseUrl = process.env.XKIRO_BASE_URL || XKIRO_DEFAULT_BASE_URL;
  const xkiroModel = process.env.XKIRO_MODEL || XKIRO_DEFAULT_MODEL;

  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const allowPaidFallback = String(process.env.ALLOW_PAID_FALLBACK || '').toLowerCase() === 'true';

  // Format messages for OpenAI format
  const chatMessages = messages && Array.isArray(messages) && messages.length > 0
    ? messages
    : [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: userPrompt }
      ];

  const executeXkiro = async () => {
    return await callXkiro({
      apiKey: xkiroKey,
      baseUrl: xkiroBaseUrl,
      model: xkiroModel,
      messages: chatMessages,
      temperature,
      maxTokens,
      timeoutMs
    });
  };

  const executeGemini = async () => {
    return await callGemini({
      apiKey: geminiKey,
      model: geminiModel,
      systemPrompt,
      userPrompt: userPrompt || (messages ? JSON.stringify(messages) : ''),
      temperature,
      maxTokens,
      timeoutMs
    });
  };

  // =========================================================================
  // PATH A: GEMINI AS PRIMARY
  // =========================================================================
  if (primaryProvider === 'gemini') {
    if (geminiKey) {
      const geminiRes = await executeGemini();
      if (geminiRes.success) {
        return {
          ...geminiRes,
          action,
          timestamp: new Date().toISOString()
        };
      }
      console.warn(`[AI Gateway] Gemini primary call failed (Status: ${geminiRes.status}, Error: ${geminiRes.error})`);

      // Evaluate Fallback Policy to xKiro (free-tier secondary)
      const fallbackPolicy = evaluateFallbackPolicy({
        primaryStatus: geminiRes.status,
        primaryCode: geminiRes.code,
        primaryProvider: 'gemini',
        secondaryProvider: 'xkiro',
        allowPaidFallback,
        hasSecondaryKey: !!xkiroKey
      });

      if (fallbackPolicy.canFallback) {
        console.info('[AI Gateway] Chuyển hướng sang nhà cung cấp phụ trợ (xKiro)...');
        const xkiroRes = await executeXkiro();
        if (xkiroRes.success) {
          return {
            ...xkiroRes,
            action,
            isSecondaryFallback: true,
            timestamp: new Date().toISOString()
          };
        }
        console.warn(`[AI Gateway] xKiro secondary fallback failed (Status: ${xkiroRes.status})`);
      }
    }
  } else {
    // =========================================================================
    // PATH B: XKIRO AS PRIMARY (Free-First Architecture)
    // =========================================================================
    if (xkiroKey) {
      const xkiroRes = await executeXkiro();

      if (xkiroRes.success) {
        return {
          ...xkiroRes,
          action,
          timestamp: new Date().toISOString()
        };
      }

      console.warn(`[AI Gateway] xKiro primary call failed (Status: ${xkiroRes.status}, Error: ${xkiroRes.error})`);

      // Evaluate Centralized Fallback Cost Policy for Gemini (paid secondary)
      const fallbackPolicy = evaluateFallbackPolicy({
        primaryStatus: xkiroRes.status,
        primaryCode: xkiroRes.code,
        primaryProvider: 'xkiro',
        secondaryProvider: 'gemini',
        allowPaidFallback,
        hasSecondaryKey: !!geminiKey
      });

      // Strict Cost Enforcement: If paid fallback is prohibited on ANY error path, terminate safely
      if (!fallbackPolicy.canFallback) {
        return {
          success: false,
          status: xkiroRes.status,
          provider: 'xkiro',
          model: xkiroModel,
          error: xkiroRes.status === 429 
            ? 'Hạn mức miễn phí hàng ngày của xKiro đã hết. Hệ thống chuyển sang chế độ sư phạm ngoại tuyến để bảo vệ ngân sách.'
            : `Nhà cung cấp AI xKiro tạm thời gián đoạn (${xkiroRes.error}). Chuyển sang chế độ sư phạm ngoại tuyến.`,
          code: xkiroRes.code,
          latencyMs: xkiroRes.latencyMs,
          paidFallbackBlocked: fallbackPolicy.paidBlocked
        };
      }

      // ALLOW_PAID_FALLBACK=true explicitly granted by administrator
      console.info(`[AI Gateway Fallback] Primary xKiro failed with HTTP ${xkiroRes.status} (${xkiroRes.code}). ALLOW_PAID_FALLBACK=true, activating secondary provider (Gemini)...`);

      const geminiRes = await executeGemini();
      if (geminiRes.success) {
        return {
          ...geminiRes,
          action,
          timestamp: new Date().toISOString(),
          isPaidFallback: true
        };
      }

      console.warn(`[AI Gateway] Gemini secondary fallback failed (Status: ${geminiRes.status}, Error: ${geminiRes.error})`);
    } else if (geminiKey && (allowPaidFallback || !xkiroKey)) {
      // Standalone Gemini when xKiro is unconfigured
      const geminiRes = await executeGemini();
      if (geminiRes.success) {
        return {
          ...geminiRes,
          action,
          timestamp: new Date().toISOString(),
          isPaidFallback: false
        };
      }
      console.warn(`[AI Gateway] Gemini standalone call failed (Status: ${geminiRes.status}, Error: ${geminiRes.error})`);
    }
  }

  // =========================================================================
  // 3. NO PROVIDER SUCCESS -> SAFE RETURN FOR DETERMINISTIC ENGINE
  // =========================================================================
  return {
    success: false,
    status: 503,
    provider: 'none',
    error: 'Không có dịch vụ AI nào khả dụng hoặc chưa cấu hình API Key. Hệ thống sử dụng bộ sư phạm xác định offline.',
    code: 'NO_ACTIVE_AI_PROVIDER',
    latencyMs: 0
  };
}
