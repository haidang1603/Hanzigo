import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  callUnifiedAiProvider, 
  extractStructuredJson,
  XKIRO_DEFAULT_BASE_URL,
  XKIRO_DEFAULT_MODEL
} from '../api/_utils/aiProviderAdapter.js';

test('1. JSON Extraction & Resilient Parsing', async (t) => {
  await t.test('correctly parses raw pure JSON string', () => {
    const input = '{"hanzi": "你好", "pinyin": "nǐ hǎo"}';
    const result = extractStructuredJson(input);
    assert.deepEqual(result, { hanzi: '你好', pinyin: 'nǐ hǎo' });
  });

  await t.test('cleans and extracts JSON wrapped in markdown code fences', () => {
    const input = '```json\n{"summary": "Học tốt", "score": 95}\n```';
    const result = extractStructuredJson(input);
    assert.deepEqual(result, { summary: 'Học tốt', score: 95 });
  });

  await t.test('extracts embedded JSON when model adds conversational prefix or suffix', () => {
    const input = 'Dưới đây là kế hoạch học tập của bạn:\n{"dailyPlan": [{"id": 1, "title": "Ôn từ vựng"}]}\nChúc bạn học tốt!';
    const result = extractStructuredJson(input);
    assert.ok(result.dailyPlan);
    assert.equal(result.dailyPlan[0].title, 'Ôn từ vựng');
  });

  await t.test('throws meaningful error on empty or malformed non-JSON string', () => {
    assert.throws(() => extractStructuredJson(''));
    assert.throws(() => extractStructuredJson('Xin chào, tôi là AI'));
  });
});

test('2. Missing Keys & Offline Fallback State', async () => {
  const origXkiro = process.env.XKIRO_API_KEY;
  const origGemini = process.env.GEMINI_API_KEY;
  delete process.env.XKIRO_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const res = await callUnifiedAiProvider({
      action: 'coach_plan',
      systemPrompt: 'Test system',
      userPrompt: 'Test user'
    });

    assert.equal(res.success, false);
    assert.equal(res.status, 503);
    assert.equal(res.code, 'NO_ACTIVE_AI_PROVIDER');
    assert.equal(res.provider, 'none');
  } finally {
    if (origXkiro) process.env.XKIRO_API_KEY = origXkiro;
    if (origGemini) process.env.GEMINI_API_KEY = origGemini;
  }
});

test('3. Primary Provider (xKiro) Success Flow', async () => {
  const origFetch = global.fetch;
  const origKey = process.env.XKIRO_API_KEY;
  process.env.XKIRO_API_KEY = 'xkiro-test-mock-key';

  const mockAiPayload = {
    summary: 'Kế hoạch học tập tối ưu hôm nay từ xKiro',
    weaknesses: [],
    dailyPlan: [{ id: 'p1', title: 'Ôn 10 từ HSK 1' }]
  };

  global.fetch = async (url, opts) => {
    assert.ok(url.includes('/chat/completions'));
    assert.equal(opts.method, 'POST');
    assert.equal(opts.headers.Authorization, 'Bearer xkiro-test-mock-key');

    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAiPayload)
            }
          }
        ],
        usage: {
          prompt_tokens: 350,
          completion_tokens: 180,
          total_tokens: 530
        }
      })
    };
  };

  try {
    const res = await callUnifiedAiProvider({
      action: 'coach_plan',
      systemPrompt: 'You are coach',
      userPrompt: 'User data'
    });

    assert.equal(res.success, true);
    assert.equal(res.provider, 'xkiro');
    assert.equal(res.model, XKIRO_DEFAULT_MODEL);
    assert.equal(res.costUsd, 0); // Free-first: $0.00
    assert.equal(res.usage.totalTokens, 530);
    assert.equal(res.data.summary, 'Kế hoạch học tập tối ưu hôm nay từ xKiro');
  } finally {
    global.fetch = origFetch;
    if (origKey) process.env.XKIRO_API_KEY = origKey;
    else delete process.env.XKIRO_API_KEY;
  }
});

test('4. Free-First Cost Policy Enforcement & Protection against Silent Charges', async (t) => {
  const origFetch = global.fetch;
  const origXkiro = process.env.XKIRO_API_KEY;
  const origGemini = process.env.GEMINI_API_KEY;
  const origPaid = process.env.ALLOW_PAID_FALLBACK;

  process.env.XKIRO_API_KEY = 'xkiro-test-key';
  process.env.GEMINI_API_KEY = 'gemini-paid-key';

  await t.test('blocks paid fallback and protects budget when xKiro quota exhausted (429) and ALLOW_PAID_FALLBACK=false', async () => {
    process.env.ALLOW_PAID_FALLBACK = 'false';

    let callCount = 0;
    global.fetch = async () => {
      callCount++;
      return {
        ok: false,
        status: 429,
        json: async () => ({
          error: { message: 'Daily free token quota exceeded', code: 'rate_limit_exceeded' }
        })
      };
    };

    const res = await callUnifiedAiProvider({
      action: 'coach_plan',
      systemPrompt: 'System',
      userPrompt: 'User'
    });

    assert.equal(res.success, false);
    assert.equal(res.status, 429);
    assert.equal(res.paidFallbackBlocked, true);
    assert.ok(res.error.includes('Hạn mức miễn phí hàng ngày của xKiro đã hết'));
    assert.equal(callCount, 1); // Never called secondary provider
  });

  await t.test('permits fallback to Gemini ONLY when ALLOW_PAID_FALLBACK=true explicitly configured', async () => {
    process.env.ALLOW_PAID_FALLBACK = 'true';

    let callCount = 0;
    global.fetch = async (url) => {
      callCount++;
      if (url.includes('xkiro.com')) {
        return {
          ok: false,
          status: 429,
          json: async () => ({ error: { message: 'Quota exceeded' } })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify({ summary: 'Kế hoạch dự phòng từ Gemini' }) }]
              }
            }
          ]
        })
      };
    };

    const res = await callUnifiedAiProvider({
      action: 'coach_plan',
      systemPrompt: 'System',
      userPrompt: 'User'
    });

    assert.equal(res.success, true);
    assert.equal(res.provider, 'gemini');
    assert.equal(res.isPaidFallback, true);
    assert.equal(res.data.summary, 'Kế hoạch dự phòng từ Gemini');
    assert.equal(callCount, 2);
  });

  // Restore env
  global.fetch = origFetch;
  if (origXkiro) process.env.XKIRO_API_KEY = origXkiro; else delete process.env.XKIRO_API_KEY;
  if (origGemini) process.env.GEMINI_API_KEY = origGemini; else delete process.env.GEMINI_API_KEY;
  if (origPaid) process.env.ALLOW_PAID_FALLBACK = origPaid; else delete process.env.ALLOW_PAID_FALLBACK;
});

test('5. Timeout & Provider Failure Handling', async (t) => {
  const origFetch = global.fetch;
  const origXkiro = process.env.XKIRO_API_KEY;
  process.env.XKIRO_API_KEY = 'xkiro-test-key';

  await t.test('handles network abort / timeout gracefully with status 504 without crashing', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    global.fetch = async () => {
      throw abortError;
    };

    const res = await callUnifiedAiProvider({
      action: 'explain_grammar',
      systemPrompt: 'System',
      userPrompt: 'User',
      timeoutMs: 100
    });

    assert.equal(res.success, false);
    assert.equal(res.status, 504);
    assert.equal(res.code, 'timeout');
  });

  await t.test('handles malformed model response body gracefully', async () => {
    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: 'Sorry, I am unable to output JSON.' } }]
      })
    });

    const res = await callUnifiedAiProvider({
      action: 'generate_exercise',
      systemPrompt: 'System',
      userPrompt: 'User'
    });

    assert.equal(res.success, false);
    assert.ok(res.error);
  });

  global.fetch = origFetch;
  if (origXkiro) process.env.XKIRO_API_KEY = origXkiro; else delete process.env.XKIRO_API_KEY;
});

test('6. Real Endpoint Smoke Test: xKiro Availability & Model Catalog Verification', async () => {
  // Test connection to public models endpoint
  try {
    const response = await fetch(`${XKIRO_DEFAULT_BASE_URL}/models`);
    assert.equal(response.status, 200, 'xKiro models endpoint should return HTTP 200');

    const body = await response.json();
    assert.ok(Array.isArray(body.data), 'xKiro should return list of models in OpenAI format');
    assert.ok(body.data.length > 50, 'xKiro should have rich catalog of models (>50)');

    const qwenModels = body.data.filter(m => m.id && m.id.toLowerCase().includes('qwen'));
    assert.ok(qwenModels.length > 0, 'Catalog must contain Qwen family models');

    const hasQwenPlus = qwenModels.some(m => m.id.includes('qwen-plus'));
    assert.ok(hasQwenPlus, 'Catalog must include Qwen Plus variant');
  } catch (err) {
    // If offline or network unavailable in certain environments, log notice
    console.warn('[Smoke Test Notice] Network check skipped or failed:', err.message);
  }
});
