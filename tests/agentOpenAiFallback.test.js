import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  callUnifiedAiProvider,
  callAgentModelTurn,
  callOpenAiCompatibleProvider,
  __resetGeminiKeyPoolForTests,
} from '../api/_utils/aiProviderAdapter.js';

async function withEnvAndFetch(envPatch, mockFetch, fn) {
  const prevEnv = {};
  for (const [k, v] of Object.entries(envPatch)) {
    prevEnv[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  const origFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;
  __resetGeminiKeyPoolForTests();
  try {
    return await fn();
  } finally {
    globalThis.fetch = origFetch;
    __resetGeminiKeyPoolForTests();
    for (const [k, v] of Object.entries(prevEnv)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

describe('Tier-2 OpenAI-Compatible Fallback (Groq & OpenRouter)', () => {
  test('1. Gemini 429 automatically degrades to Groq with provider=groq and fallbackUsed=true', async () => {
    const calledUrls = [];
    const mockFetch = async (url, init) => {
      calledUrls.push(String(url));
      if (String(url).includes('generativelanguage.googleapis.com')) {
        return {
          ok: false,
          status: 429,
          json: async () => ({ error: { message: 'Quota exceeded' } }),
        };
      }
      if (String(url).includes('api.groq.com')) {
        const body = JSON.parse(init.body);
        assert.equal(body.model, 'llama-3.3-70b-versatile');
        assert.deepEqual(body.response_format, { type: 'json_object' });
        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({ answer: 'Xin chào từ Groq', hanzi: '你好' }),
                },
              },
            ],
            usage: { prompt_tokens: 30, completion_tokens: 20, total_tokens: 50 },
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    await withEnvAndFetch(
      {
        GEMINI_API_KEY: 'test-gemini-429',
        GROQ_API_KEY: 'test-groq-key-123',
        OPENROUTER_API_KEY: undefined,
        HANZIGO_LIVE_AI_TEST: 'true',
      },
      mockFetch,
      async () => {
        const res = await callUnifiedAiProvider({
          systemPrompt: 'Trả về JSON.',
          userPrompt: 'Giải thích 你好',
          tier: 'standard',
        });

        assert.equal(res.success, true);
        assert.equal(res.provider, 'groq');
        assert.equal(res.model, 'llama-3.3-70b-versatile');
        assert.equal(res.fallbackUsed, true);
        assert.equal(res.costUsd, 0);
        assert.equal(res.data.answer, 'Xin chào từ Groq');
        assert.ok(calledUrls.some((u) => u.includes('generativelanguage.googleapis.com')));
        assert.ok(calledUrls.some((u) => u.includes('api.groq.com')));
      }
    );
  });

  test('2. Gemini + Groq both fail -> automatically degrades to OpenRouter (provider=openrouter)', async () => {
    const mockFetch = async (url, init) => {
      if (String(url).includes('generativelanguage.googleapis.com')) {
        return { ok: false, status: 429, json: async () => ({ error: { message: '429' } }) };
      }
      if (String(url).includes('api.groq.com')) {
        return { ok: false, status: 503, json: async () => ({ error: { message: 'Groq down' } }) };
      }
      if (String(url).includes('openrouter.ai')) {
        assert.equal(init.headers['X-Title'], 'HanziGo');
        assert.ok(init.headers['HTTP-Referer']);
        const body = JSON.parse(init.body);
        assert.equal(body.model, 'openrouter/free');
        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({ summary: 'Phản hồi từ OpenRouter' }),
                },
              },
            ],
            usage: { prompt_tokens: 25, completion_tokens: 15, total_tokens: 40 },
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    await withEnvAndFetch(
      {
        GEMINI_API_KEY: 'test-gemini-fail',
        GROQ_API_KEY: 'test-groq-fail',
        OPENROUTER_API_KEY: 'test-or-key-456',
        HANZIGO_LIVE_AI_TEST: 'true',
      },
      mockFetch,
      async () => {
        const res = await callUnifiedAiProvider({
          systemPrompt: 'Trả về JSON',
          userPrompt: 'Phân tích tiến độ',
          tier: 'lite',
          maxTokens: 500,
        });

        assert.equal(res.success, true);
        assert.equal(res.provider, 'openrouter');
        assert.equal(res.model, 'openrouter/free');
        assert.equal(res.fallbackUsed, true);
        assert.equal(res.costUsd, 0);
        assert.equal(res.data.summary, 'Phản hồi từ OpenRouter');
      }
    );
  });

  test('3. Function Calling conversion: functionDeclarations -> OpenAI tools -> orchestrator tool_calls contract', async () => {
    let capturedOpenAiBody = null;
    const mockFetch = async (url, init) => {
      if (String(url).includes('generativelanguage.googleapis.com')) {
        return { ok: false, status: 429, json: async () => ({ error: { message: 'Quota' } }) };
      }
      if (String(url).includes('api.groq.com')) {
        capturedOpenAiBody = JSON.parse(init.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: null,
                  tool_calls: [
                    {
                      id: 'call_abc_1',
                      type: 'function',
                      function: {
                        name: 'lookup_dictionary_entry',
                        arguments: JSON.stringify({ query: '好' }),
                      },
                    },
                  ],
                },
              },
            ],
            usage: { prompt_tokens: 40, completion_tokens: 12, total_tokens: 52 },
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    await withEnvAndFetch(
      {
        GEMINI_API_KEY: 'test-gemini-fc',
        GROQ_API_KEY: 'test-groq-fc',
        OPENROUTER_API_KEY: undefined,
        HANZIGO_LIVE_AI_TEST: 'true',
      },
      mockFetch,
      async () => {
        const res = await callAgentModelTurn({
          systemInstruction: 'Bạn là Lão Sư AI.',
          contents: [{ role: 'user', parts: [{ text: 'Tra từ 好' }] }],
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'lookup_dictionary_entry',
                  description: 'Tra từ điển Hán-Việt',
                  parameters: { type: 'object', properties: { query: { type: 'string' } } },
                },
              ],
            },
          ],
          routingDecision: { tier: 'standard', model: 'gemini-3.5-flash-lite' },
        });

        assert.equal(capturedOpenAiBody.tools[0].type, 'function');
        assert.equal(capturedOpenAiBody.tools[0].function.name, 'lookup_dictionary_entry');
        assert.equal(res.success, true);
        assert.equal(res.provider, 'groq');
        assert.equal(res.fallbackUsed, true);
        assert.equal(res.type, 'tool_calls');
        assert.deepEqual(res.toolCalls, [{ name: 'lookup_dictionary_entry', args: { query: '好' } }]);
      }
    );
  });

  test('4. Without GROQ_API_KEY and OPENROUTER_API_KEY, skips tier-2 cleanly and preserves baseline behavior', async () => {
    const mockFetch = async () => ({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'Quota exceeded' } }),
    });

    await withEnvAndFetch(
      {
        GEMINI_API_KEY: 'test-gemini-only',
        GROQ_API_KEY: undefined,
        GROQ_API_KEYS: undefined,
        OPENROUTER_API_KEY: undefined,
        OPENROUTER_API_KEYS: undefined,
        HANZIGO_LIVE_AI_TEST: 'true',
      },
      mockFetch,
      async () => {
        const res = await callUnifiedAiProvider({
          systemPrompt: 'Test',
          userPrompt: 'Hello',
        });
        assert.equal(res.success, false);
        assert.equal(res.provider, 'gemini');
        assert.equal(res.status, 429);

        const agentRes = await callAgentModelTurn({
          systemInstruction: 'Test',
          contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
          routingDecision: { tier: 'lite', model: 'gemini-3.5-flash-lite' },
        });
        assert.equal(agentRes.success, false);
        assert.equal(agentRes.status, 429);
      }
    );
  });

  test('5. API keys are strictly redacted from error messages on 401/500 responses', async () => {
    const secretKey = 'gsk_super_secret_token_999888777';
    const mockFetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: `Invalid API key provided: ${secretKey} with Bearer ${secretKey}` },
      }),
    });

    await withEnvAndFetch({}, mockFetch, async () => {
      const res = await callOpenAiCompatibleProvider({
        providerName: 'groq',
        baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
        apiKey: secretKey,
        model: 'llama-3.1-8b-instant',
        systemInstruction: 'Test',
        contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
      });

      assert.equal(res.success, false);
      assert.equal(res.status, 401);
      assert.ok(!res.error.includes(secretKey), 'Error message must never leak API key');
      assert.ok(res.error.includes('[REDACTED'));
    });
  });

  test('6. Groq multi-key pool rotates to key #2 on 429, cools down key #1 for 60s, and never leaks keys in logs', async () => {
    const key1 = 'gsk_pool_key_one_11111111';
    const key2 = 'gsk_pool_key_two_22222222';
    const capturedAuthHeaders = [];
    const loggedWarnings = [];
    const origWarn = console.warn;
    console.warn = (...args) => loggedWarnings.push(args.map(String).join(' '));

    const mockFetch = async (url, init) => {
      if (String(url).includes('generativelanguage.googleapis.com')) {
        return { ok: false, status: 429, json: async () => ({ error: { message: 'Gemini 429' } }) };
      }
      if (String(url).includes('api.groq.com')) {
        const auth = init.headers.Authorization;
        capturedAuthHeaders.push(auth);
        if (auth === `Bearer ${key1}`) {
          return {
            ok: false,
            status: 429,
            json: async () => ({ error: { message: `Rate limited for ${key1}` } }),
          };
        }
        if (auth === `Bearer ${key2}`) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              choices: [{ message: { content: JSON.stringify({ answer: 'Thành công từ key 2' }) } }],
              usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
            }),
          };
        }
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    try {
      await withEnvAndFetch(
        {
          GEMINI_API_KEY: 'test-gemini-429',
          GROQ_API_KEY: undefined,
          GROQ_API_KEYS: `${key1}, ${key2}`,
          OPENROUTER_API_KEY: undefined,
          HANZIGO_LIVE_AI_TEST: 'true',
        },
        mockFetch,
        async () => {
          const res1 = await callUnifiedAiProvider({
            systemPrompt: 'Trả về JSON.',
            userPrompt: 'Test multi-key rotation',
            tier: 'lite',
          });
          assert.equal(res1.success, true);
          assert.equal(res1.provider, 'groq');
          assert.equal(res1.data.answer, 'Thành công từ key 2');
          assert.deepEqual(capturedAuthHeaders, [`Bearer ${key1}`, `Bearer ${key2}`]);

          // Second call immediately after must prioritize key2 first because key1 is in 60s cooldown
          const res2 = await callUnifiedAiProvider({
            systemPrompt: 'Trả về JSON.',
            userPrompt: 'Test cooldown order',
            tier: 'lite',
          });
          assert.equal(res2.success, true);
          assert.deepEqual(capturedAuthHeaders, [`Bearer ${key1}`, `Bearer ${key2}`, `Bearer ${key2}`]);
        }
      );
    } finally {
      console.warn = origWarn;
    }

    const joinedLogs = loggedWarnings.join('\n');
    assert.ok(!joinedLogs.includes(key1), 'Logs must never contain key1');
    assert.ok(!joinedLogs.includes(key2), 'Logs must never contain key2');
  });
});
