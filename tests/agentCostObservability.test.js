import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { AGENT_INTENTS } from '../api/_agent/contracts.js';
import {
  buildPublicCacheKey,
  buildAgentTraceRecord,
  isCacheEligible,
} from '../api/_agent/costAndObservability.js';
import { runAgentOrchestrator } from '../api/_agent/orchestrator.js';
import {
  checkRateLimitAndQuota,
  resetMemoryRateLimits,
  computeAgentQuotaWeight,
} from '../api/_utils/distributedRateLimiter.js';

describe('Task 09: Cost Guard, Public Cache, Quota Weight & Observability', () => {
  test('1. Token/Cost Budget Cap stops tool loop when maxRequestTotalTokens is exceeded', async () => {
    let llmCalls = 0;
    const res = await runAgentOrchestrator({
      message: 'Giải thích từ 我',
      hskLevel: 'HSK 1',
      executionContext: {
        maxRequestTotalTokens: 500,
      },
      modelTurnFn: async () => {
        llmCalls += 1;
        return {
          success: true,
          type: 'tool_calls',
          toolCalls: [{ name: 'lookup_dictionary_entry', args: { query: '我' } }],
          usage: { promptTokens: 400, completionTokens: 200, totalTokens: 600 },
          costUsd: 0.001,
          model: 'gemini-3.5-flash',
        };
      },
    });

    assert.equal(res.ok, true);
    assert.equal(llmCalls, 1);
    assert.equal(res.metadata.budget_capped, true);
    assert.equal(res.metadata.fallbackUsed, true);
  });

  test('2. Public Cache Isolation: caches pure public vocab/grammar queries and blocks personalized turns', async () => {
    const cacheStore = new Map();
    const cacheAdapter = {
      get: async (k) => cacheStore.get(k) || null,
      set: async (k, v) => cacheStore.set(k, v),
    };

    let llmCalls = 0;
    const modelTurnFn = async () => {
      llmCalls += 1;
      return {
        success: true,
        type: 'final_text',
        text: 'Từ 我 nghĩa là tôi.',
        model: 'gemini-3.5-flash-lite',
        usage: { promptTokens: 50, completionTokens: 20, totalTokens: 70 },
        costUsd: 0.00001,
      };
    };

    // First public query -> miss & populate cache
    const first = await runAgentOrchestrator({
      message: 'Từ vựng 我 nghĩa là gì?',
      hskLevel: 'HSK 1',
      explicitIntent: AGENT_INTENTS.VOCAB_TUTOR,
      executionContext: { memoryEnabled: false, cacheAdapter },
      modelTurnFn,
    });
    assert.equal(first.ok, true);
    assert.equal(first.metadata.cache_hit, false);
    assert.equal(llmCalls, 1);
    assert.equal(cacheStore.size, 1);

    // Second identical public query -> cache hit, 0 LLM call
    const second = await runAgentOrchestrator({
      message: 'Từ vựng 我 nghĩa là gì?',
      hskLevel: 'HSK 1',
      explicitIntent: AGENT_INTENTS.VOCAB_TUTOR,
      executionContext: { memoryEnabled: false, cacheAdapter },
      modelTurnFn,
    });
    assert.equal(second.ok, true);
    assert.equal(second.metadata.cache_hit, true);
    assert.equal(second.metadata.costUsd, 0);
    assert.equal(llmCalls, 1);

    // Personalized turn (memoryApplied: true) -> NEVER hits or writes cache
    const personalized = await runAgentOrchestrator({
      message: 'Từ vựng 我 nghĩa là gì?',
      hskLevel: 'HSK 1',
      explicitIntent: AGENT_INTENTS.VOCAB_TUTOR,
      executionContext: {
        user: { id: 'student-1', role: 'student' },
        memoryEnabled: true,
        learningMemory: { recentTopics: ['Học HSK 1'] },
        cacheAdapter,
      },
      modelTurnFn,
    });
    assert.equal(personalized.metadata.cache_hit, false);
    assert.equal(llmCalls, 2);

    assert.equal(
      isCacheEligible({
        intent: AGENT_INTENTS.VOCAB_TUTOR,
        memoryApplied: false,
        toolsUsed: [{ toolName: 'get_learner_adaptive_profile' }],
      }),
      false
    );
  });

  test('3. Cache Key Versioning produces distinct keys across promptVersion and hskLevel', () => {
    const k1 = buildPublicCacheKey({
      query: 'Giải thích chữ 把',
      intent: AGENT_INTENTS.GRAMMAR_TUTOR,
      hskLevel: 'HSK 3',
      promptVersion: '1.0.0',
      modelTier: 'standard',
    });
    const k2 = buildPublicCacheKey({
      query: 'Giải thích chữ 把',
      intent: AGENT_INTENTS.GRAMMAR_TUTOR,
      hskLevel: 'HSK 3',
      promptVersion: '1.1.0',
      modelTier: 'standard',
    });
    const k3 = buildPublicCacheKey({
      query: 'Giải thích chữ 把',
      intent: AGENT_INTENTS.GRAMMAR_TUTOR,
      hskLevel: 'HSK 4',
      promptVersion: '1.0.0',
      modelTier: 'standard',
    });

    assert.notEqual(k1, k2);
    assert.notEqual(k1, k3);
  });

  test('4. Quota Weighting supports costWeight > 1 while preserving default costWeight = 1', async () => {
    resetMemoryRateLimits();
    assert.equal(computeAgentQuotaWeight(0), 1);
    assert.equal(computeAgentQuotaWeight(3), 3);

    const r1 = await checkRateLimitAndQuota({
      clientKey: 'user:weight-test',
      maxRequests: 5,
      dailyQuotaMax: 10,
      prefix: 't09',
      costWeight: 3,
    });
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);

    const r2 = await checkRateLimitAndQuota({
      clientKey: 'user:weight-test',
      maxRequests: 5,
      dailyQuotaMax: 10,
      prefix: 't09',
      costWeight: 3,
    });
    assert.equal(r2.allowed, false);
    assert.equal(r2.statusCode, 429);
  });

  test('5. PII-Free Structured Trace masks sensitive fields and preserves observability metadata', () => {
    const traces = [];
    const record = buildAgentTraceRecord({
      requestId: 'req-123',
      userId: 'user-secret-id',
      intent: AGENT_INTENTS.GRAMMAR_TUTOR,
      tier: 'standard',
      model: 'gemini-3.5-flash',
      promptId: 'hanzigo.agent.grammar_tutor',
      promptVersion: '1.0.0',
      stepsCount: 2,
      toolCallsCount: 1,
      toolsUsed: [{ toolName: 'lookup_grammar_pattern' }],
      ragSourceIds: ['src-curriculum-hsk3'],
      evidenceStatus: 'grounded',
      fallbackReason: 'Contact admin@hanzigo.vn with AIzaSyD1234567890abcdefghij1234567890',
      totalTokens: 200,
      costUsd: 0.00005,
      latencyMs: 320,
    });

    traces.push(record);
    assert.ok(record.traceId);
    assert.notEqual(record.userIdHash, 'user-secret-id');
    assert.doesNotMatch(record.fallbackReason, /admin@hanzigo\.vn/);
    assert.doesNotMatch(record.fallbackReason, /AIzaSy/);
    assert.match(record.fallbackReason, /\[REDACTED_EMAIL\]/);
    assert.match(record.fallbackReason, /\[REDACTED_API_KEY\]/);
  });

  test('6. Cache Failure Resilience: cache errors fail-open without crashing Orchestrator', async () => {
    const brokenCacheAdapter = {
      get: async () => {
        throw new Error('Redis cache connection timeout');
      },
      set: async () => {
        throw new Error('Redis cache write timeout');
      },
    };

    const res = await runAgentOrchestrator({
      message: 'Từ vựng 你好 nghĩa là gì?',
      hskLevel: 'HSK 1',
      explicitIntent: AGENT_INTENTS.VOCAB_TUTOR,
      executionContext: {
        memoryEnabled: false,
        cacheAdapter: brokenCacheAdapter,
      },
      modelTurnFn: async () => ({
        success: true,
        type: 'final_text',
        text: '你好 (nǐ hǎo) nghĩa là Xin chào.',
        model: 'gemini-3.5-flash-lite',
      }),
    });

    assert.equal(res.ok, true);
    assert.equal(res.metadata.cache_hit, false);
    assert.match(res.answer, /Xin chào/);
  });
});
