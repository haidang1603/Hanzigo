import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { AGENT_INTENTS } from '../api/_agent/contracts.js';
import { MODEL_TIERS, selectModelTier } from '../api/_agent/modelRouter.js';
import {
  callAgentModelTurn,
  __resetGeminiKeyPoolForTests,
} from '../api/_utils/aiProviderAdapter.js';

describe('Task 03: Model Router', () => {
  test('routes HSK 1-3 lightweight Q&A without tools to lite tier', () => {
    const decision = selectModelTier({
      intent: AGENT_INTENTS.GENERAL_TUTOR,
      hskLevel: 'HSK 2',
      hasTools: false,
      allowPremiumTier: false,
    });
    assert.equal(decision.tier, MODEL_TIERS.LITE);
    assert.ok(decision.model);
    assert.ok(decision.fallbackModel);
    assert.ok(decision.maxOutputTokens <= 600);
  });

  test('routes HSK 4-6 or tool-calling turns to standard tier', () => {
    const withTools = selectModelTier({
      intent: AGENT_INTENTS.VOCAB_TUTOR,
      hskLevel: 'HSK 1',
      hasTools: true,
      allowPremiumTier: false,
    });
    assert.equal(withTools.tier, MODEL_TIERS.STANDARD);
    assert.equal(withTools.reason, 'tool_calling_turn');

    const intermediate = selectModelTier({
      intent: AGENT_INTENTS.GRAMMAR_TUTOR,
      hskLevel: 'HSK 5',
      hasTools: false,
      allowPremiumTier: false,
    });
    assert.equal(intermediate.tier, MODEL_TIERS.STANDARD);
  });

  test('blocks premium reasoning escalation unless allowPremiumTier is true', () => {
    const capped = selectModelTier({
      intent: AGENT_INTENTS.WRITING_COACH,
      hskLevel: 'HSK 7-9',
      allowPremiumTier: false,
    });
    assert.equal(capped.tier, MODEL_TIERS.STANDARD);
    assert.equal(capped.reason, 'premium_tier_disabled_capped_at_standard');

    const allowed = selectModelTier({
      intent: AGENT_INTENTS.WRITING_COACH,
      hskLevel: 'HSK 7-9',
      allowPremiumTier: true,
    });
    assert.equal(allowed.tier, MODEL_TIERS.REASONING);
    assert.equal(allowed.reason, 'deep_reasoning_permitted');
  });
});

describe('Task 03: Tool-Calling Adapter (callAgentModelTurn)', () => {
  test('parses single and multiple Gemini functionCall responses', async () => {
    const origFetch = globalThis.fetch;
    const origKeys = process.env.GEMINI_API_KEYS;
    __resetGeminiKeyPoolForTests();
    process.env.GEMINI_API_KEYS = 'test-key-1';

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                { functionCall: { name: 'lookup_dictionary_entry', args: { query: '把' } } },
                { functionCall: { name: 'lookup_grammar_pattern', args: { code: 'HSK3-BA-01' } } },
              ],
            },
          },
        ],
        usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 30, totalTokenCount: 150 },
      }),
    });

    try {
      const res = await callAgentModelTurn({
        systemInstruction: 'System',
        contents: [{ role: 'user', content: 'Giải thích chữ 把' }],
        tools: [{ functionDeclarations: [{ name: 'lookup_dictionary_entry' }] }],
        routingDecision: { tier: 'standard', model: 'gemini-3.5-flash', fallbackModel: 'gemini-3.5-flash-lite' },
      });
      assert.equal(res.success, true);
      assert.equal(res.type, 'tool_calls');
      assert.equal(res.toolCalls.length, 2);
      assert.equal(res.toolCalls[0].name, 'lookup_dictionary_entry');
      assert.deepEqual(res.toolCalls[0].args, { query: '把' });
      assert.equal(res.fallbackUsed, false);
      assert.equal(res.usage.totalTokens, 150);
    } finally {
      globalThis.fetch = origFetch;
      if (origKeys === undefined) delete process.env.GEMINI_API_KEYS;
      else process.env.GEMINI_API_KEYS = origKeys;
      __resetGeminiKeyPoolForTests();
    }
  });

  test('rotates key on 429 and falls back to fallbackModel when primary fails', async () => {
    const origFetch = globalThis.fetch;
    const origKeys = process.env.GEMINI_API_KEYS;
    __resetGeminiKeyPoolForTests();
    process.env.GEMINI_API_KEYS = 'key-a,key-b';

    const calledUrls = [];
    globalThis.fetch = async (url) => {
      calledUrls.push(url);
      if (url.includes('gemini-3.5-pro') && url.includes('key=key-a')) {
        return {
          ok: false,
          status: 429,
          json: async () => ({ error: { message: 'Quota exceeded' } }),
        };
      }
      if (url.includes('gemini-3.5-pro') && url.includes('key=key-b')) {
        return {
          ok: false,
          status: 503,
          json: async () => ({ error: { message: 'Upstream unavailable' } }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: '{"answer":"Giải thích chữ 把 chuẩn HSK 3"}' }],
              },
            },
          ],
          usageMetadata: { promptTokenCount: 80, candidatesTokenCount: 20, totalTokenCount: 100 },
        }),
      };
    };

    try {
      const res = await callAgentModelTurn({
        contents: [{ role: 'user', content: 'Giải thích chữ 把' }],
        routingDecision: {
          tier: 'reasoning',
          model: 'gemini-3.5-pro',
          fallbackModel: 'gemini-3.5-flash-lite',
        },
        maxRetries: 2,
      });
      assert.equal(res.success, true);
      assert.equal(res.type, 'final_text');
      assert.equal(res.fallbackUsed, true);
      assert.equal(res.model, 'gemini-3.5-flash-lite');
      assert.equal(res.parsedJson?.answer, 'Giải thích chữ 把 chuẩn HSK 3');
      assert.equal(calledUrls.length, 3);
    } finally {
      globalThis.fetch = origFetch;
      if (origKeys === undefined) delete process.env.GEMINI_API_KEYS;
      else process.env.GEMINI_API_KEYS = origKeys;
      __resetGeminiKeyPoolForTests();
    }
  });
});
