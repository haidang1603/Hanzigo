import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { RISK_LEVELS } from '../api/_agent/contracts.js';
import { createToolRegistry } from '../api/_agent/toolRegistry.js';
import { registerKnowledgeTools } from '../api/_agent/tools/knowledgeTools.js';

describe('Task 04: Real Tool Registry', () => {
  test('blocks unregistered tools, rejects high-risk tools, validates schema, and exports Gemini declarations', async () => {
    const registry = createToolRegistry();
    assert.throws(() => {
      registry.register({
        name: 'dangerous_delete_tool',
        description: 'Delete data',
        riskLevel: RISK_LEVELS.HIGH,
        execute: async () => ({}),
      });
    }, /high risk/i);

    registerKnowledgeTools(registry);

    const unregistered = await registry.executeTool('non_existent_tool', {});
    assert.equal(unregistered.ok, false);
    assert.match(unregistered.error, /not registered/i);

    const invalidArgs = await registry.executeTool('lookup_dictionary_entry', { query: '' });
    assert.equal(invalidArgs.ok, false);
    assert.match(invalidArgs.error, /Missing required parameter/i);

    const badTypeArgs = await registry.executeTool('lookup_dictionary_entry', {
      query: '你好',
      limit: 99,
    });
    assert.equal(badTypeArgs.ok, false);
    assert.match(badTypeArgs.error, /<= 5/);

    const declarations = registry.getGeminiFunctionDeclarations();
    assert.equal(declarations.length, 6);
    assert.ok(declarations.every((d) => d.name && d.description && d.parameters));
  });

  test('enforces per-tool timeout and redacts secrets in errors', async () => {
    const registry = createToolRegistry();
    registry.register({
      name: 'slow_tool_test',
      description: 'Simulates timeout',
      riskLevel: RISK_LEVELS.LOW,
      timeoutMs: 200,
      parameters: { type: 'object', properties: {}, required: [] },
      execute: async () => new Promise((resolve) => setTimeout(() => resolve({ data: 'late' }), 1000)),
    });
    registry.register({
      name: 'leaky_error_tool',
      description: 'Simulates error with secret',
      riskLevel: RISK_LEVELS.LOW,
      parameters: { type: 'object', properties: {}, required: [] },
      execute: async () => {
        throw new Error('Upstream failed with AIzaSyD1234567890abcdefghij1234567890');
      },
    });

    const timeoutRes = await registry.executeTool('slow_tool_test', {});
    assert.equal(timeoutRes.ok, false);
    assert.match(timeoutRes.error, /timed out/i);

    const errRes = await registry.executeTool('leaky_error_tool', {});
    assert.equal(errRes.ok, false);
    assert.doesNotMatch(errRes.error, /AIzaSy/);
    assert.match(errRes.error, /\[REDACTED_API_KEY\]/);
  });
});

describe('Task 04: 6 Read-Only Knowledge Tools on Real HSK 1-9 Data', () => {
  const registry = registerKnowledgeTools(createToolRegistry());

  test('1. lookup_dictionary_entry finds HSK 1-6 and HSK 7-9 entries', async () => {
    const hsk1 = await registry.executeTool('lookup_dictionary_entry', { query: '我' });
    assert.equal(hsk1.ok, true);
    assert.equal(hsk1.data.found, true);
    assert.ok(hsk1.data.items.some((i) => i.hanzi === '我'));
    assert.ok(hsk1.sources.length > 0);

    const hsk79 = await registry.executeTool('lookup_dictionary_entry', {
      query: '赋能',
      hskLevel: 'HSK 7-9',
    });
    assert.equal(hsk79.ok, true);
    assert.equal(hsk79.data.found, true);
    assert.equal(hsk79.data.items[0].hanzi, '赋能');
    assert.equal(hsk79.data.items[0].level, 'HSK 7-9');
  });

  test('2. lookup_hanzi_decomposition returns real radical and stroke breakdown', async () => {
    const res = await registry.executeTool('lookup_hanzi_decomposition', { character: '好' });
    assert.equal(res.ok, true);
    assert.equal(res.data.found, true);
    assert.equal(res.data.items[0].character, '好');
    assert.ok(res.sources[0].sourceId.includes('hanzi:decomp:好'));
  });

  test('3. lookup_grammar_pattern returns curated grammar & function words', async () => {
    const res = await registry.executeTool('lookup_grammar_pattern', { query: '把' });
    assert.equal(res.ok, true);
    assert.equal(res.data.found, true);
    assert.ok(res.data.items.length >= 1 && res.data.items.length <= 5);
    assert.ok(res.sources.length > 0);
  });

  test('4. lookup_chengyu_idiom returns real HSK 6 chengyu details', async () => {
    const res = await registry.executeTool('lookup_chengyu_idiom', { query: '坚持不懈' });
    assert.equal(res.ok, true);
    assert.equal(res.data.found, true);
    assert.equal(res.data.items[0].chengyu, '坚持不懈');
    assert.ok(res.data.items[0].figurativeMeaning);
  });

  test('5. get_curriculum_lesson_context fetches lesson from LEARNING_LESSONS', async () => {
    const res = await registry.executeTool('get_curriculum_lesson_context', { lessonId: 'l-101' });
    assert.equal(res.ok, true);
    assert.equal(res.data.found, true);
    assert.equal(res.data.items[0].id, 'l-101');
    assert.equal(res.sources[0].sourceId, 'curriculum:lesson:l-101');
  });

  test('6. search_curated_knowledge returns verified sanitized RAG chunks and transparent empty result on miss', async () => {
    const hit = await registry.executeTool('search_curated_knowledge', { query: '你好' });
    assert.equal(hit.ok, true);
    assert.equal(hit.data.found, true);
    assert.ok(hit.sources.every((s) => s.verified === true && s.sourceId));

    const miss = await registry.executeTool('lookup_dictionary_entry', {
      query: 'ZZZ_NON_EXISTENT_TERM_99999',
    });
    assert.equal(miss.ok, true);
    assert.equal(miss.data.found, false);
    assert.deepEqual(miss.data.items, []);
    assert.deepEqual(miss.sources, []);
  });
});
