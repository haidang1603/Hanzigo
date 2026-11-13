import test from 'node:test';
import assert from 'node:assert/strict';
import {
  retrieveLearnerAdaptiveProfile,
  retrieveContextualKnowledgeForQuery,
  extractStructuredQueryTokens,
  normalizeQueryForRetrieval,
} from '../api/_utils/ragRetriever.js';

test('ragRetriever: extractStructuredQueryTokens extracts Hanzi, grammar codes, and exam codes', () => {
  const tokens = extractStructuredQueryTokens(
    'Thầy ơi giải thích ngữ pháp HSK3-BA-01 với từ 把 và thành ngữ 入乡随俗 trong đề H31001'
  );
  assert.ok(tokens.hanziClusters.includes('把'));
  assert.ok(tokens.hanziClusters.includes('入乡随俗'));
  assert.deepEqual(tokens.grammarCodes, ['HSK3-BA-01']);
  assert.deepEqual(tokens.examPaperCodes, ['H31001']);
  assert.deepEqual(tokens.chengyuCandidates, ['入乡随俗']);

  // Ensure legacy export remains intact
  const legacy = normalizeQueryForRetrieval('把 chữ này dùng sao?');
  assert.ok(legacy.preservedParticles.includes('把'));
});

test('ragRetriever: retrieveLearnerAdaptiveProfile normalizes RPC output & builds Markdown prompt', async () => {
  const mockSupabase = {
    async rpc(fnName, params) {
      assert.equal(fnName, 'get_user_adaptive_ai_context');
      assert.equal(params.p_user_id, 'user-abc');
      assert.equal(params.p_hsk_level, 4);
      return {
        data: {
          due_and_leech_vocab: [
            {
              simplified: '坚持',
              pinyin: 'jiān chí',
              meaning_vi: 'kiên trì',
              lapses: 3,
              overall_mastery: 42.5,
            },
          ],
          weak_grammar_points: [
            {
              code: 'HSK3-BA-01',
              pattern_display: 'S + 把 + O + V + Thành phần khác',
              title_vi: 'Câu chữ 把',
              formula_tokens: ['S', '把', 'O', 'V'],
              common_mistakes: ['Quên thành phần khác sau V'],
            },
          ],
          problematic_hanzi: [
            { character: '难', avg_accuracy: 58.2, total_attempts: 6 },
          ],
        },
        error: null,
      };
    },
  };

  const profile = await retrieveLearnerAdaptiveProfile('user-abc', 4, {
    supabaseClient: mockSupabase,
  });

  assert.equal(profile.targetVocabList.length, 1);
  assert.equal(profile.targetVocabList[0].simplified, '坚持');
  assert.equal(profile.targetGrammarList.length, 1);
  assert.equal(profile.targetGrammarList[0].code, 'HSK3-BA-01');
  assert.equal(profile.problematicHanzi[0].character, '难');
  assert.ok(profile.systemPromptInjection.includes('坚持'));
  assert.ok(profile.systemPromptInjection.includes('HSK3-BA-01'));
  assert.ok(profile.systemPromptInjection.includes('难'));
});

test('ragRetriever: retrieveContextualKnowledgeForQuery queries 4 tables in parallel and formats citations', async () => {
  const queriedTables = [];
  const createChain = (rows) => {
    const chain = {
      select() { return chain; },
      in() { return chain; },
      lte() { return chain; },
      or() { return chain; },
      overlaps() { return chain; },
      limit() { return Promise.resolve({ data: rows, error: null }); },
    };
    return chain;
  };

  const mockSupabase = {
    from(table) {
      queriedTables.push(table);
      if (table === 'dictionary_entries') {
        return createChain([
          {
            id: 'dict-1',
            simplified: '坚持',
            traditional: '堅持',
            pinyin_display: 'jiān chí',
            han_viet: 'KIÊN TRÌ',
            pos_meanings: [{ pos: 'v.', definitions: ['kiên trì'] }],
            decomposition: { radical: '土' },
            synonyms_antonyms: {},
          },
        ]);
      }
      if (table === 'grammar_points') {
        return createChain([
          {
            code: 'HSK3-BA-01',
            title_vi: 'Câu chữ 把',
            pattern_display: 'S + 把 + O + V + X',
            explanation_vi: 'Đưa tân ngữ lên trước động từ',
            formula_tokens: ['S', '把', 'O', 'V'],
            common_mistakes: [],
          },
        ]);
      }
      if (table === 'chengyu_entries') {
        return createChain([
          {
            chengyu: '入乡随俗',
            pinyin: 'rù xiāng suí sú',
            han_viet: 'NHẬP HƯƠNG TÙY TỤC',
            literal_meaning_vi: 'Vào làng theo tục',
            figurative_meaning_vi: 'Thích nghi môi trường mới',
            vietnamese_equivalent_idiom: 'Nhập gia tùy tục',
          },
        ]);
      }
      if (table === 'hsk_question_bank') {
        return createChain([
          {
            id: 'q-1',
            paper_code: 'H31001',
            section: 'reading',
            question_number_start: 41,
            stimulus_payload: { prompt: '请坚持学习' },
          },
        ]);
      }
      return createChain([]);
    },
  };

  const result = await retrieveContextualKnowledgeForQuery(
    'Phân tích HSK3-BA-01, từ 坚持, thành ngữ 入乡随俗 và đề H31001',
    { hskLevel: 6, userId: 'u-1', includeExamQuestions: true, supabaseClient: mockSupabase }
  );

  assert.equal(queriedTables.length, 4);
  assert.equal(result.contextBlocks.length, 4);
  assert.equal(result.structuredCitations.length, 4);
  assert.ok(result.formattedPromptContext.includes('<verified_knowledge>'));
  assert.ok(result.formattedPromptContext.includes('HSK3-BA-01'));
  assert.ok(result.formattedPromptContext.includes('入乡随俗'));
  assert.ok(result.formattedPromptContext.includes('H31001'));
});

