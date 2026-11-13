import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { detectCompletedMissions } from '../api/_handlers/ai/roleplay.js';
import {
  retrieveLearnerAdaptiveProfile,
  retrieveContextualKnowledgeForQuery,
} from '../api/_utils/ragRetriever.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Phase 34 Test 1: Migration 20261114_3401_ai_learner_memory_rag.sql creates table & RPCs', () => {
  const migrationPath = path.join(
    ROOT_DIR,
    'supabase',
    'migrations',
    '20261114_3401_ai_learner_memory_rag.sql'
  );
  assert.equal(fs.existsSync(migrationPath), true);

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.match(sql, /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.ai_roleplay_sessions/i);
  assert.match(sql, /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.get_user_adaptive_ai_context/i);
  assert.match(sql, /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.search_knowledge_rag_hybrid/i);
  assert.match(sql, /ENABLE\s+ROW\s+LEVEL\s+SECURITY/i);
});

test('Phase 34 Test 2: detectCompletedMissions detects target vocab and HSK grammar patterns (把, 被, 不仅...而且, 虽然...但是)', () => {
  const vocab = [
    { simplified: '讨价还价', pinyin: 'tǎo jià huán jià', used: false },
    { simplified: '质量', pinyin: 'zhìliàng', used: false },
  ];
  const grammar = [
    { code: 'HSK3-BA-01', pattern_display: 'S + 把 + O + V + 了', used: false },
    { code: 'HSK3-BEI-01', pattern_display: 'S + 被 + O + V + 了', used: false },
    { code: 'HSK4-BUJIN-01', pattern_display: '不仅...而且...', used: false },
    { code: 'HSK3-SUIRAN-01', pattern_display: '虽然...但是...', used: false },
  ];

  const res = detectCompletedMissions(
    '虽然价格有点贵，但是我把衣服讨价还价了，不仅质量很好，而且我的钱包差点被拿走了。',
    vocab,
    grammar
  );

  assert.deepEqual(res.newlyUsedVocab, ['讨价还价', '质量']);
  assert.deepEqual(res.newlyMatchedGrammar, [
    'HSK3-BA-01',
    'HSK3-BEI-01',
    'HSK4-BUJIN-01',
    'HSK3-SUIRAN-01',
  ]);
  assert.equal(res.missionCompletionPct, 100);
});

test('Phase 34 Test 3: ragRetriever returns structuredCitations and handles empty DB / unauthenticated safely', async () => {
  // Unauthenticated / null DB client must never crash
  const emptyProfile = await retrieveLearnerAdaptiveProfile(null, 3, {
    supabaseClient: null,
  });
  assert.deepEqual(emptyProfile.targetVocabList, []);
  assert.deepEqual(emptyProfile.targetGrammarList, []);
  assert.ok(emptyProfile.systemPromptInjection.includes('HSK 3'));

  const emptyKnowledge = await retrieveContextualKnowledgeForQuery('坚持 HSK3-BA-01', {
    hskLevel: 4,
    userId: null,
    supabaseClient: null,
  });
  assert.deepEqual(emptyKnowledge.structuredCitations, []);
  assert.equal(emptyKnowledge.formattedPromptContext, '');

  // With mock DB returning dictionary & grammar rows
  const chainWith = (rows) => ({
    select() { return this; },
    in() { return this; },
    lte() { return this; },
    or() { return this; },
    overlaps() { return this; },
    limit() { return Promise.resolve({ data: rows, error: null }); },
  });

  const mockDb = {
    from(table) {
      if (table === 'dictionary_entries') {
        return chainWith([
          {
            id: 'd-1',
            simplified: '坚持',
            traditional: '堅持',
            pinyin_display: 'jiān chí',
            han_viet: 'KIÊN TRÌ',
            pos_meanings: [{ pos: 'v.', definitions: ['kiên trì'] }],
            decomposition: {},
            synonyms_antonyms: {},
          },
        ]);
      }
      if (table === 'grammar_points') {
        return chainWith([
          {
            code: 'HSK3-BA-01',
            title_vi: 'Câu chữ 把',
            pattern_display: 'S + 把 + O + V + X',
            explanation_vi: 'Câu chữ 把',
            formula_tokens: [],
            common_mistakes: [],
          },
        ]);
      }
      return chainWith([]);
    },
  };

  const grounded = await retrieveContextualKnowledgeForQuery('坚持 HSK3-BA-01', {
    hskLevel: 4,
    userId: 'u-1',
    supabaseClient: mockDb,
  });

  assert.equal(grounded.structuredCitations.length, 2);
  assert.equal(grounded.structuredCitations[0].source_type, 'dictionary_entries');
  assert.equal(grounded.structuredCitations[1].source_type, 'grammar_points');
  assert.ok(grounded.formattedPromptContext.includes('<verified_knowledge>'));
});

