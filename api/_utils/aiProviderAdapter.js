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
export const XKIRO_DEFAULT_MODEL = 'qwen/qwen-plus-2025-07-28:free';
export const DEFAULT_TIMEOUT_MS = 45000;

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
  model = XKIRO_DEFAULT_MODEL,
  messages,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const url = `${cleanBaseUrl}/chat/completions`;
  const cleanModel = model === 'qwen/qwen-plus-2025-07-28' ? 'qwen/qwen-plus-2025-07-28:free' : model;

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

      return {
        success: false,
        status: errStatus,
        error: errorBody?.error?.message || errorBody?.message || `xKiro HTTP ${errStatus}`,
        code: errorBody?.error?.code || (errStatus === 429 ? 'rate_limit_exceeded' : 'provider_error'),
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
      model,
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
 * Executes a call to Google Gemini 1.5 Flash (Paid Fallback or Standalone).
 */
async function callGemini({
  apiKey,
  systemPrompt,
  userPrompt,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
      return {
        success: false,
        status: response.status,
        error: `Gemini HTTP ${response.status}`,
        code: 'gemini_error',
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

    // Gemini 1.5 Flash Pricing: $0.075 / 1M input, $0.30 / 1M output
    const costUsd = Number(((promptTokens * 0.000000075) + (completionTokens * 0.0000003)).toFixed(6));

    return {
      success: true,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
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
 * UNIFIED AI SERVICE DISPATCHER
 * Enforces Free-First Policy:
 * 1. Attempts xKiro with configured model (Free).
 * 2. If xKiro succeeds -> Returns result ($0.00 cost).
 * 3. If xKiro fails / quota exhausted (429):
 *    - Checks if ALLOW_PAID_FALLBACK is explicitly enabled AND GEMINI_API_KEY exists.
 *    - If NOT enabled -> Safely terminates with quota message to protect budget.
 * 4. If xKiro is not configured, checks for Gemini as standalone fallback.
 * 5. If no providers succeed -> Returns structured failure for deterministic fallback.
 */
export async function callUnifiedAiProvider({
  systemPrompt = '',
  userPrompt = '',
  messages = null,
  temperature = 0.6,
  maxTokens = 1200,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  action = 'personalize'
}) {
  const xkiroKey = process.env.XKIRO_API_KEY;
  const xkiroBaseUrl = process.env.XKIRO_BASE_URL || XKIRO_DEFAULT_BASE_URL;
  const xkiroModel = process.env.XKIRO_MODEL || XKIRO_DEFAULT_MODEL;

  const geminiKey = process.env.GEMINI_API_KEY;
  const allowPaidFallback = String(process.env.ALLOW_PAID_FALLBACK || '').toLowerCase() === 'true';

  // Format messages for OpenAI format
  const chatMessages = messages && Array.isArray(messages) && messages.length > 0
    ? messages
    : [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: userPrompt }
      ];

  // =========================================================================
  // 1. PRIMARY: xKiro Free-First Provider
  // =========================================================================
  if (xkiroKey) {
    const xkiroRes = await callXkiro({
      apiKey: xkiroKey,
      baseUrl: xkiroBaseUrl,
      model: xkiroModel,
      messages: chatMessages,
      temperature,
      maxTokens,
      timeoutMs
    });

    if (xkiroRes.success) {
      return {
        ...xkiroRes,
        action,
        timestamp: new Date().toISOString()
      };
    }

    console.warn(`[AI Gateway] xKiro call failed (Status: ${xkiroRes.status}, Error: ${xkiroRes.error})`);

    // Free-first cost policy enforcement:
    // If xKiro returned 429 (Quota / Rate Limit) or failed, do NOT silently charge user.
    if (!allowPaidFallback) {
      return {
        success: false,
        status: xkiroRes.status,
        provider: 'xkiro',
        model: xkiroModel,
        error: xkiroRes.status === 429 
          ? 'Hạn mức miễn phí hàng ngày của xKiro đã hết. Hệ thống chuyển sang chế độ sư phạm ngoại tuyến để bảo vệ ngân sách.'
          : `Nhà cung cấp AI xKiro tạm thời gián đoạn (${xkiroRes.error}).`,
        code: xkiroRes.code,
        latencyMs: xkiroRes.latencyMs,
        paidFallbackBlocked: true
      };
    }

    console.info('[AI Gateway] ALLOW_PAID_FALLBACK=true. Chuyển hướng sang nhà cung cấp phụ trợ (Gemini)...');
  }

  // =========================================================================
  // 2. SECONDARY: Gemini (Explicit opt-in or standalone)
  // =========================================================================
  if (geminiKey && (allowPaidFallback || !xkiroKey)) {
    const geminiRes = await callGemini({
      apiKey: geminiKey,
      systemPrompt,
      userPrompt: userPrompt || (messages ? JSON.stringify(messages) : ''),
      temperature,
      maxTokens,
      timeoutMs
    });

    if (geminiRes.success) {
      return {
        ...geminiRes,
        action,
        timestamp: new Date().toISOString(),
        isPaidFallback: !!xkiroKey
      };
    }

    console.warn(`[AI Gateway] Gemini fallback failed (Status: ${geminiRes.status}, Error: ${geminiRes.error})`);
  }

  // =========================================================================
  // 3. NO PROVIDER SUCESS -> SAFE RETURN FOR DETERMINISTIC ENGINE
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
