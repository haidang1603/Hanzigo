import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import tutorHandler from '../api/_handlers/ai/tutor.js';
import {
  extractContextSentence,
  lookupLocalSelectionEntry,
  SelectionLruCache,
  fetchSelectionAiInsight,
  evaluateSelectionPronunciation,
  clearSelectionAiCache,
  getSelectionCacheSize,
  redactSelectionPii,
  buildTutorHandoffPrompt,
  saveSelectionToSrs,
  getSavedSelectionSrsCards,
  MAX_SELECTION_LENGTH,
  MAX_CONTEXT_LENGTH,
  MAX_LRU_CACHE_SIZE,
} from '../src/services/selectionAiService.js';

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
    clear() {
      map.clear();
    },
  };
}

function createMockReqRes({ method = 'POST', headers = {}, body = {} } = {}) {
  let statusCode = 200;
  let responseBody = null;
  const resHeaders = {};
  const req = {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body,
    socket: { remoteAddress: '127.0.0.1' },
  };
  const res = {
    setHeader(k, v) {
      resHeaders[k] = v;
      return this;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      responseBody = payload;
      return this;
    },
    end() {
      return this;
    },
  };
  return {
    req,
    res,
    getStatus: () => statusCode,
    getBody: () => responseBody,
  };
}

test('1. Context extraction isolates surrounding Chinese sentence & caps <= 240 chars', () => {
  const paragraph =
    '我叫小明。每天早上的练习让我进步很快！你们觉得怎么样？' +
    '另外还有一段非常长的补充说明'.repeat(20);
  const ctx = extractContextSentence(paragraph, '每天早上的');
  assert.equal(ctx, '每天早上的练习让我进步很快！');

  const longSentence = `${'一'.repeat(180)}每天早上的${'二'.repeat(180)}。`;
  const clipped = extractContextSentence(longSentence, '每天早上的');
  assert.ok(clipped.length <= MAX_CONTEXT_LENGTH);
  assert.ok(clipped.includes('每天早上的'));
});

test('2. Session LRU Cache enforces max = 40 & AbortController cancels superseded requests', async () => {
  const cache = new SelectionLruCache(MAX_LRU_CACHE_SIZE);
  for (let i = 0; i < 45; i += 1) {
    cache.set(`key-${i}`, { ok: true, i });
  }
  assert.equal(cache.size, 40);
  assert.equal(cache.get('key-0'), undefined);
  assert.deepEqual(cache.get('key-44'), { ok: true, i: 44 });

  clearSelectionAiCache();
  let networkCalls = 0;
  const mockFetch = async (_url, init) => {
    networkCalls += 1;
    // Verify second request gets aborted only on superseded call
    if (networkCalls === 1) {
      return await new Promise((resolve, reject) => {
        if (init?.signal?.aborted) {
          const err = new Error('Aborted');
          err.name = 'AbortError';
          reject(err);
          return;
        }
        init?.signal?.addEventListener(
          'abort',
          () => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          },
          { once: true }
        );
      });
    }
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          success: true,
          mode: 'selection_insight',
          action: 'grammar',
          insight: {
            selectedText: '每天早上的',
            pinyin: 'měitiān zǎoshang de',
            contextualMeaningVi: 'buổi sáng mỗi ngày (bổ nghĩa cho danh từ sau)',
            grammarStructure: '[Thời gian] + 的 + (Danh từ)',
            nuanceVi: 'Diễn tả thói quen đều đặn mỗi sáng.',
            breakdown: [],
            vietnamesePitfall: 'Không đảo danh từ lên trước 的.',
            examples: [],
          },
        };
      },
    };
  };

  const authStub = async () => ({ Authorization: 'Bearer valid-student-token' });

  const firstPromise = fetchSelectionAiInsight({
    action: 'grammar',
    selectedText: '昨天',
    contextSentence: '我昨天去学校了。',
    userHskLevel: 'HSK 1',
    fetchImpl: mockFetch,
    getAuthHeadersImpl: authStub,
  });

  const secondPromise = fetchSelectionAiInsight({
    action: 'grammar',
    selectedText: '每天早上的',
    contextSentence: '每天早上的练习让我进步很快。',
    userHskLevel: 'HSK 2',
    fetchImpl: mockFetch,
    getAuthHeadersImpl: authStub,
  });

  const [firstRes, secondRes] = await Promise.all([firstPromise, secondPromise]);
  assert.equal(firstRes.aborted, true, 'First in-flight selection request must abort when selection changes');
  assert.equal(secondRes.ok, true);
  assert.equal(secondRes.isAi, true);
  assert.equal(secondRes.fromCache, false);
  assert.equal(getSelectionCacheSize(), 1);

  // Repeat identical query -> served in 0ms from LRU cache without hitting fetchImpl
  const callsBeforeHit = networkCalls;
  const cachedRes = await fetchSelectionAiInsight({
    action: 'grammar',
    selectedText: '每天早上的',
    contextSentence: '每天早上的练习让我进步很快。',
    userHskLevel: 'HSK 2',
    fetchImpl: mockFetch,
    getAuthHeadersImpl: authStub,
  });
  assert.equal(cachedRes.fromCache, true);
  assert.equal(networkCalls, callsBeforeHit);
});

test('3. Tab Tra từ resolves synchronously at 0ms without calling AI; AI only runs on explicit trigger', async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    throw new Error('Dictionary local lookup must not call fetch');
  };
  try {
    const local = lookupLocalSelectionEntry('你好');
    assert.equal(local.found, true);
    assert.ok(local.pinyin.length > 0);
    assert.ok(local.meaningVi.length > 0);
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }

  const popoverSrc = fs.readFileSync(
    path.resolve('src/features/unified-ecosystem/SelectionAiPopover.jsx'),
    'utf8'
  );
  assert.ok(popoverSrc.includes('Giải thích theo ngữ cảnh (AI)'));
  assert.ok(popoverSrc.includes("activeTab !== 'grammar'"));
});

test('4. Backend /api/ai/tutor mode selection_insight enforces auth, kill-switch, validation & fixed JSON', async () => {
  // Unauthenticated -> 401
  const unauth = createMockReqRes({
    body: {
      mode: 'selection_insight',
      action: 'grammar',
      selectedText: '每天早上的',
      contextSentence: '每天早上的练习很好。',
    },
  });
  await tutorHandler(unauth.req, unauth.res);
  assert.equal(unauth.getStatus(), 401);

  // Selected text > 120 chars -> 400
  const tooLongSelected = createMockReqRes({
    headers: { 'x-user-id': 'selection-test-student-1' },
    body: {
      mode: 'selection_insight',
      action: 'grammar',
      selectedText: '好'.repeat(MAX_SELECTION_LENGTH + 1),
      contextSentence: '好',
    },
  });
  await tutorHandler(tooLongSelected.req, tooLongSelected.res);
  assert.equal(tooLongSelected.getStatus(), 400);

  // contextSentence > 300 chars -> 400
  const tooLongCtx = createMockReqRes({
    headers: { 'x-user-id': 'selection-test-student-1' },
    body: {
      mode: 'selection_insight',
      action: 'context_explain',
      selectedText: '每天',
      contextSentence: '你'.repeat(301),
    },
  });
  await tutorHandler(tooLongCtx.req, tooLongCtx.res);
  assert.equal(tooLongCtx.getStatus(), 400);

  // CBT exam lock -> 403
  const cbtBlocked = createMockReqRes({
    headers: { 'x-user-id': 'selection-test-student-1' },
    body: {
      mode: 'selection_insight',
      action: 'grammar',
      selectedText: '每天',
      isActiveExamSession: true,
    },
  });
  await tutorHandler(cbtBlocked.req, cbtBlocked.res);
  assert.equal(cbtBlocked.getStatus(), 403);

  // Kill switch -> 503
  const prevKillSwitch = process.env.AI_TUTOR_KILL_SWITCH;
  process.env.AI_TUTOR_KILL_SWITCH = 'true';
  try {
    const killed = createMockReqRes({
      headers: { 'x-user-id': 'selection-test-student-1' },
      body: {
        mode: 'selection_insight',
        action: 'grammar',
        selectedText: '每天早上的',
      },
    });
    await tutorHandler(killed.req, killed.res);
    assert.equal(killed.getStatus(), 503);
  } finally {
    if (prevKillSwitch === undefined) delete process.env.AI_TUTOR_KILL_SWITCH;
    else process.env.AI_TUTOR_KILL_SWITCH = prevKillSwitch;
  }

  // Valid structured JSON output (never premium reasoning tier)
  const prevPremium = process.env.AI_ALLOW_PREMIUM_TIER;
  process.env.AI_ALLOW_PREMIUM_TIER = 'true';
  try {
    const valid = createMockReqRes({
      headers: { 'x-user-id': 'selection-test-student-1' },
      body: {
        mode: 'selection_insight',
        action: 'grammar',
        selectedText: '每天早上的',
        contextSentence: '每天早上的练习让我进步很快。',
        learner_level: 'HSK 7-9',
      },
    });
    await tutorHandler(valid.req, valid.res);
    assert.equal(valid.getStatus(), 200);
    const body = valid.getBody();
    assert.equal(body.success, true);
    assert.equal(body.mode, 'selection_insight');
    assert.ok(body.insight && typeof body.insight.contextualMeaningVi === 'string');
    assert.ok(Array.isArray(body.insight.breakdown));
    assert.ok(Array.isArray(body.insight.examples));
    assert.notEqual(body._metadata?.model_tier, 'reasoning');
  } finally {
    if (prevPremium === undefined) delete process.env.AI_ALLOW_PREMIUM_TIER;
    else process.env.AI_ALLOW_PREMIUM_TIER = prevPremium;
  }
});

test('5. Graceful 0-red-error fallback on 401 & 503 across all 3 tabs', async () => {
  clearSelectionAiCache();
  const guestHeaders = async () => ({});
  const fetch503 = async () => ({
    ok: false,
    status: 503,
    async json() {
      return { error: 'Unavailable' };
    },
  });
  const authHeaders = async () => ({ Authorization: 'Bearer valid-token' });

  for (const action of ['context_explain', 'grammar']) {
    const guestRes = await fetchSelectionAiInsight({
      action,
      selectedText: '每天早上的',
      contextSentence: '每天早上的练习让我进步很快。',
      getAuthHeadersImpl: guestHeaders,
      fetchImpl: fetch503,
    });
    assert.equal(guestRes.ok, true);
    assert.equal(guestRes.isAi, false);
    assert.equal(guestRes.authRequired, true);
    assert.ok(guestRes.insight?.contextualMeaningVi);

    const outageRes = await fetchSelectionAiInsight({
      action,
      selectedText: '每天早上的',
      contextSentence: '每天早上的练习让我进步很快。',
      getAuthHeadersImpl: authHeaders,
      fetchImpl: fetch503,
    });
    assert.equal(outageRes.ok, true);
    assert.equal(outageRes.isAi, false);
    assert.equal(outageRes.serviceUnavailable, true);
  }

  const pronFallback = await evaluateSelectionPronunciation({
    targetHanzi: '每天',
    targetPinyin: 'měitiān',
    spokenTranscript: '每天',
    getAuthHeadersImpl: guestHeaders,
    fetchImpl: fetch503,
  });
  assert.equal(pronFallback.ok, true);
  assert.equal(pronFallback.isAiEvaluated, false);
  assert.equal(pronFallback.authRequired, true);
  assert.equal(typeof pronFallback.result?.overall, 'number');
});

test('6. Zero XSS, PII Redaction, CBT exam_mode lock & 6 toolbar buttons preserved', () => {
  const dirty = 'Liên hệ alice@example.com hoặc 0912345678 với Bearer secretToken12345';
  const clean = redactSelectionPii(dirty);
  assert.equal(clean.includes('alice@example.com'), false);
  assert.equal(clean.includes('0912345678'), false);
  assert.equal(clean.includes('secretToken12345'), false);

  const handoffPrompt = buildTutorHandoffPrompt({
    selectedText: '每天早上的',
    contextSentence: 'Mail bob@test.vn 每天早上的练习',
  });
  assert.equal(handoffPrompt.includes('bob@test.vn'), false);
  assert.ok(handoffPrompt.includes('每天早上的'));

  const popoverSrc = fs.readFileSync(
    path.resolve('src/features/unified-ecosystem/SelectionAiPopover.jsx'),
    'utf8'
  );
  const barSrc = fs.readFileSync(
    path.resolve('src/features/unified-ecosystem/GlobalTextSelectionActionBar.tsx'),
    'utf8'
  );
  const examViewSrc = fs.readFileSync(
    path.resolve('src/components/hsk/HskExamTakingView.jsx'),
    'utf8'
  );
  const ctxSrc = fs.readFileSync(
    path.resolve('src/core/ecosystem/UnifiedToolsContext.tsx'),
    'utf8'
  );

  assert.equal(popoverSrc.includes('dangerouslySetInnerHTML'), false);
  assert.equal(barSrc.includes('dangerouslySetInnerHTML'), false);
  assert.match(popoverSrc, /min-h-11/);
  assert.match(popoverSrc, /overflow-x-auto/);
  assert.ok(barSrc.includes('isActiveExamSession'));
  assert.ok(examViewSrc.includes('setActiveExamSession'));
  assert.ok(ctxSrc.includes('isActiveExamSession'));

  // Preserve all 6 buttons on floating bar
  for (const label of ['Tra từ', 'Ngữ pháp', 'Tập viết', 'Phát âm', 'Lưu từ', 'Nghe phát âm nhanh']) {
    assert.ok(barSrc.includes(label), `Floating selection bar must keep "${label}"`);
  }
});

test('7. HITL SRS persistence isolates cards strictly by userId', async () => {
  const prevStorage = globalThis.localStorage;
  const mockStorage = createMemoryStorage();
  globalThis.localStorage = mockStorage;
  try {
    const userA = { id: 'user-alpha-001', email: 'a@hanzigo.test' };
    const userB = { id: 'user-beta-002', email: 'b@hanzigo.test' };

    await saveSelectionToSrs({
      user: userA,
      hanzi: '学习',
      pinyin: 'xuéxí',
      meaningVi: 'học tập',
      contextSentence: '我每天学习中文。',
    });

    const cardsA = getSavedSelectionSrsCards(userA);
    const cardsB = getSavedSelectionSrsCards(userB);
    const cardsGuest = getSavedSelectionSrsCards(null);

    assert.equal(cardsA.length, 1);
    assert.equal(cardsA[0].hanzi, '学习');
    assert.equal(cardsB.length, 0);
    assert.equal(cardsGuest.length, 0);
  } finally {
    globalThis.localStorage = prevStorage;
  }
});
