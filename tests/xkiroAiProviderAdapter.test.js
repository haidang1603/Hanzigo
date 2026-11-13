import test from 'node:test';
import assert from 'node:assert/strict';

import {
  callUnifiedAiProvider,
  extractStructuredJson,
  getGeminiApiKeys,
  calculateGeminiTokenCost,
  __resetGeminiKeyPoolForTests,
  GEMINI_DEFAULT_MODEL
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

test('2. Missing Gemini Key & Offline Fallback State', async () => {
  const origGemini = process.env.GEMINI_API_KEY;
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
    if (origGemini) process.env.GEMINI_API_KEY = origGemini;
  }
});

test('3. Primary Provider (Google Gemini) Success Flow', async () => {
  const origFetch = global.fetch;
  const origKey = process.env.GEMINI_API_KEY;
  const origModel = process.env.GEMINI_MODEL;
  delete process.env.GEMINI_MODEL;
  process.env.GEMINI_API_KEY = 'gemini-test-mock-key';

  const mockResponsePayload = {
    summary: 'Kế hoạch học tập tối ưu HSK 2',
    tasks: [{ title: 'Luyện từ vựng cốt lõi' }]
  };

  global.fetch = async (url, opts) => {
    assert.ok(url.includes('generativelanguage.googleapis.com'));
    assert.equal(opts.method, 'POST');
    const body = JSON.parse(opts.body);
    assert.ok(Array.isArray(body.contents));

    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockResponsePayload) }]
            }
          }
        ],
        usageMetadata: {
          promptTokenCount: 120,
          candidatesTokenCount: 80,
          totalTokenCount: 200
        }
      })
    };
  };

  try {
    const res = await callUnifiedAiProvider({
      action: 'coach_plan',
      systemPrompt: 'You are an expert tutor',
      userPrompt: 'Create plan'
    });

    assert.equal(res.success, true);
    assert.equal(res.provider, 'gemini');
    assert.equal(res.model, GEMINI_DEFAULT_MODEL);
    assert.equal(res.usage.totalTokens, 200);
    assert.equal(res.costUsd, 0.000044);
    assert.equal(res.data.summary, 'Kế hoạch học tập tối ưu HSK 2');
  } finally {
    global.fetch = origFetch;
    if (origKey) process.env.GEMINI_API_KEY = origKey;
    else delete process.env.GEMINI_API_KEY;
    if (origModel) process.env.GEMINI_MODEL = origModel;
    else delete process.env.GEMINI_MODEL;
  }
});

test('4. Gemini Error Resilience (429 Rate Limit -> Safe Failure Signal)', async () => {
  __resetGeminiKeyPoolForTests();
  const origFetch = global.fetch;
  const origKey = process.env.GEMINI_API_KEY;
  const origKeys = process.env.GEMINI_API_KEYS;
  process.env.GEMINI_API_KEY = 'gemini-test-mock-key';
  delete process.env.GEMINI_API_KEYS;

  global.fetch = async () => ({
    ok: false,
    status: 429,
    json: async () => ({ error: { message: 'Quota exceeded', status: 'RESOURCE_EXHAUSTED' } })
  });

  try {
    const res = await callUnifiedAiProvider({
      action: 'tutor_qa',
      systemPrompt: 'System',
      userPrompt: 'Hello'
    });
    assert.equal(res.success, false);
    assert.equal(res.status, 429);
    assert.equal(res.provider, 'gemini');
    assert.equal(res.code, 'rate_limit_exceeded');
  } finally {
    global.fetch = origFetch;
    __resetGeminiKeyPoolForTests();
    if (origKey) process.env.GEMINI_API_KEY = origKey;
    else delete process.env.GEMINI_API_KEY;
    if (origKeys) process.env.GEMINI_API_KEYS = origKeys;
    else delete process.env.GEMINI_API_KEYS;
  }
});

test('5. Gemini Multi-Key Rotation on 429 Quota Exhaustion', async () => {
  __resetGeminiKeyPoolForTests();
  const origFetch = global.fetch;
  const origKey = process.env.GEMINI_API_KEY;
  const origKeys = process.env.GEMINI_API_KEYS;
  process.env.GEMINI_API_KEY = 'key-primary-exhausted';
  process.env.GEMINI_API_KEYS = 'key-backup-1,key-backup-2';

  const calledKeys = [];
  global.fetch = async (url) => {
    const match = url.match(/key=([^&]+)/);
    const usedKey = match ? decodeURIComponent(match[1]) : '';
    calledKeys.push(usedKey);

    if (usedKey === 'key-primary-exhausted') {
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
        candidates: [{ content: { parts: [{ text: '{"ok":true,"rotated":true}' }] } }]
      })
    };
  };

  try {
    const first = await callUnifiedAiProvider({
      action: 'tutor_qa',
      systemPrompt: 'System',
      userPrompt: 'Ping 1'
    });
    assert.equal(first.success, true);
    assert.equal(first.data.rotated, true);
    assert.deepEqual(calledKeys, ['key-primary-exhausted', 'key-backup-1']);

    // Second call should skip cooled-down key-primary-exhausted and go straight to key-backup-1
    calledKeys.length = 0;
    const keysOrder = getGeminiApiKeys();
    assert.equal(keysOrder[0], 'key-backup-1');

    const second = await callUnifiedAiProvider({
      action: 'tutor_qa',
      systemPrompt: 'System',
      userPrompt: 'Ping 2'
    });
    assert.equal(second.success, true);
    assert.deepEqual(calledKeys, ['key-backup-1']);
  } finally {
    global.fetch = origFetch;
    __resetGeminiKeyPoolForTests();
    if (origKey) process.env.GEMINI_API_KEY = origKey;
    else delete process.env.GEMINI_API_KEY;
    if (origKeys) process.env.GEMINI_API_KEYS = origKeys;
    else delete process.env.GEMINI_API_KEYS;
  }
});

test('6. Token Cost Calculation for Gemini 3.5 Flash Lite', () => {
  const cost = calculateGeminiTokenCost({
    model: 'gemini-3.5-flash-lite',
    promptTokens: 1_000_000,
    completionTokens: 1_000_000
  });
  assert.equal(cost.inputRatePer1M, 0.1);
  assert.equal(cost.outputRatePer1M, 0.4);
  assert.equal(cost.inputCostUsd, 0.1);
  assert.equal(cost.outputCostUsd, 0.4);
  assert.equal(cost.costUsd, 0.5);
});
