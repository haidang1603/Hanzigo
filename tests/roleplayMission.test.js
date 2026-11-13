import test from 'node:test';
import assert from 'node:assert/strict';
import roleplayHandler, { detectCompletedMissions } from '../api/_handlers/ai/roleplay.js';
import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

function createMockHttp(body = {}, headers = {}) {
  const req = {
    method: 'POST',
    headers: { 'x-user-id': 'roleplay-user-1', ...headers },
    body,
  };
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
      return this;
    },
    json(obj) {
      this.data = obj;
      return this;
    },
    end() {
      return this;
    },
  };
  return { req, res };
}

test('Roleplay Mission Detector: matches target vocab and grammar patterns (把, 不仅...而且)', () => {
  const vocab = [
    { simplified: '讨价还价', pinyin: 'tǎo jià huán jià', used: false },
    { simplified: '便宜', pinyin: 'piányi', used: false },
  ];
  const grammar = [
    { code: 'HSK3-BA-01', pattern_display: 'S + 把 + O + V + 了', used: false },
    { code: 'HSK4-BUJIN-01', pattern_display: '不仅...而且...', used: false },
  ];

  const result = detectCompletedMissions(
    '我把价格讨价还价了，不仅便宜而且质量很好！',
    vocab,
    grammar
  );

  assert.deepEqual(result.newlyUsedVocab, ['讨价还价', '便宜']);
  assert.deepEqual(result.newlyMatchedGrammar, ['HSK3-BA-01', 'HSK4-BUJIN-01']);
  assert.equal(result.missionCompletionPct, 100);
});

test('Roleplay Handler: start_session and send_turn award SRS mastery and return structured JSON', async () => {
  const rpcCalls = [];
  const sessionStore = new Map();

  setSupabaseAdminClientForTesting({
    async rpc(fnName, params) {
      rpcCalls.push({ fnName, params });
      if (fnName === 'get_user_adaptive_ai_context') {
        return {
          data: {
            due_and_leech_vocab: [
              { simplified: '讨价还价', pinyin: 'tǎo jià huán jià', meaning_vi: 'mặc cả' },
              { simplified: '打折', pinyin: 'dǎ zhé', meaning_vi: 'giảm giá' },
            ],
            weak_grammar_points: [
              { code: 'HSK3-BA-01', pattern_display: 'S + 把 + O + V + 了', title_vi: 'Câu chữ 把' },
            ],
          },
          error: null,
        };
      }
      return { data: null, error: null };
    },
    from(table) {
      if (table === 'ai_roleplay_sessions') {
        return {
          insert(payload) {
            const id = 'session-uuid-1';
            sessionStore.set(id, { id, ...payload });
            return {
              select() {
                return {
                  async single() {
                    return { data: { id }, error: null };
                  },
                };
              },
            };
          },
          select() {
            return {
              eq(_col, val) {
                return {
                  eq() {
                    return {
                      async maybeSingle() {
                        return { data: sessionStore.get(val) || null, error: null };
                      },
                    };
                  },
                };
              },
            };
          },
          update(patch) {
            return {
              async eq(_col, id) {
                const prev = sessionStore.get(id) || {};
                sessionStore.set(id, { ...prev, ...patch });
                return { error: null };
              },
            };
          },
        };
      }
      return {};
    },
  });

  try {
    // 1. Start session
    const startHttp = createMockHttp({
      action: 'start_session',
      scenarioSlug: 'beijing_market_bargain',
      hskLevel: 4,
    });
    await roleplayHandler(startHttp.req, startHttp.res);
    assert.equal(startHttp.res.statusCode, 200);
    assert.equal(startHttp.res.data.sessionId, 'session-uuid-1');
    assert.equal(startHttp.res.data.target_vocab_words.length, 2);
    assert.equal(startHttp.res.data.target_grammar_points.length, 1);
    assert.ok(startHttp.res.data.ai_reply_zh);

    // 2. Send turn using target vocab & grammar
    const turnHttp = createMockHttp({
      action: 'send_turn',
      sessionId: 'session-uuid-1',
      userMessageZh: '老板，我把这件衣服讨价还价了，能便宜一点吗？',
      audioDurationMs: 2400,
    });
    await roleplayHandler(turnHttp.req, turnHttp.res);
    assert.equal(turnHttp.res.statusCode, 200);
    assert.ok(turnHttp.res.data.ai_reply_zh);
    assert.ok(turnHttp.res.data.turn_evaluation);
    assert.ok(Array.isArray(turnHttp.res.data.next_turn_hints));
    assert.deepEqual(turnHttp.res.data.newly_used_vocab, ['讨价还价']);
    assert.deepEqual(turnHttp.res.data.newly_matched_grammar, ['HSK3-BA-01']);

    const masteryRpc = rpcCalls.find((c) => c.fnName === 'update_vocab_dimension_score');
    assert.ok(masteryRpc);
    assert.equal(masteryRpc.params.p_simplified, '讨价还价');
    assert.equal(masteryRpc.params.p_dimension, 'meaning');
    assert.equal(masteryRpc.params.p_score, 90);
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

