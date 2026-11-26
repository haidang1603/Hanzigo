import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_AI_TELEMETRY_PAYLOAD_CHARS,
  SMART_COACH_CACHE_PREFIX,
  applyConfirmedHitlProposal,
  buildCompactAiTelemetryPayload,
  buildRuleBasedAdaptivePlan,
  buildSmartLearningSnapshot,
  computeVietnamStudyCadence,
  fetchSmartCoachWithCacheAndFallback,
  getVietnamDateKey,
  purgeSmartTelemetryCachesForLogout,
  redactClientPii,
} from '../src/services/smartLearningTelemetryService.js';
import { STORAGE_SRS_STATE, STORAGE_REVIEW } from '../src/utils/srsEngine.js';
import { saveDualExamHistoryRecord } from '../src/data/hskExamBlueprints.js';
import { recordMistakeEntry } from '../src/services/mistakeNotebookService.js';
import { redactSensitiveData } from '../api/_agent/guardrails.js';
import coachHandler from '../api/_handlers/ai/coach.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    key(idx) {
      return Array.from(store.keys())[idx] ?? null;
    },
    getItem(k) {
      return store.has(String(k)) ? store.get(String(k)) : null;
    },
    setItem(k, v) {
      store.set(String(k), String(v));
    },
    removeItem(k) {
      store.delete(String(k));
    },
    clear() {
      store.clear();
    },
  };
}

function withMockStorage(fn) {
  const prevStorage = globalThis.localStorage;
  const mockStorage = createMemoryStorage();
  globalThis.localStorage = mockStorage;
  try {
    return fn(mockStorage);
  } finally {
    if (prevStorage === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = prevStorage;
    }
  }
}

async function withMockStorageAsync(fn) {
  const prevStorage = globalThis.localStorage;
  const mockStorage = createMemoryStorage();
  globalThis.localStorage = mockStorage;
  try {
    return await fn(mockStorage);
  } finally {
    if (prevStorage === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = prevStorage;
    }
  }
}

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

test('1. Zero Mock, Guest Cold-Start State, User A/B Isolation & Logout Purge', () => {
  withMockStorage((storage) => {
    const guestSnap = buildSmartLearningSnapshot(null);
    assert.equal(guestSnap.isGuest, true);
    assert.equal(guestSnap.readiness.score, 0);
    assert.equal(guestSnap.readiness.hasData, false);
    assert.equal(guestSnap.readiness.isColdStart, true);
    assert.equal(guestSnap.roadmapAndSrs.completedCount, 0);
    assert.equal(guestSnap.cadence.streak, 0);
    assert.ok(guestSnap.readiness.pullDownFactors[0].actionLabel.includes('Ôn 5 từ'));

    const userA = { id: 'user-alpha-1', hskLevel: 'HSK 3' };
    const userB = { id: 'user-beta-2', hskLevel: 'HSK 3' };

    storage.setItem('hanzigo_completed_lessons_user-alpha-1', JSON.stringify(['l-101', 'l-102']));
    storage.setItem(`${STORAGE_SRS_STATE}_user-alpha-1`, JSON.stringify({
      w1: { id: 'w1', hanzi: '学习', pinyin: 'xuéxí', meaning: 'Học tập', repetitions: 1, lapse_count: 3, easeFactor: 1.4 },
    }));
    storage.setItem(`${SMART_COACH_CACHE_PREFIX}user-alpha-1`, JSON.stringify({ hash: 'h1', cachedAt: Date.now(), data: { dailyPlan: [{ id: 't1' }] } }));

    saveDualExamHistoryRecord({
      user: userA,
      analytics: {
        examSystem: 'hsk_3_0',
        level: 'HSK 3',
        practiceMode: 'exam',
        totalScore: 240,
        maxScore: 300,
        answerSnapshots: [
          { questionId: 'q1', skill: 'listening', questionType: 'mcq', isCorrect: true },
        ],
      },
    });

    const snapA = buildSmartLearningSnapshot(userA);
    const snapB = buildSmartLearningSnapshot(userB);

    assert.equal(snapA.roadmapAndSrs.completedCount, 2);
    assert.equal(snapA.roadmapAndSrs.leechCount, 1);
    assert.equal(snapA.examAttemptsCount, 1);
    assert.ok(snapA.readiness.score > 0);

    // User B remains completely isolated (0% cold-start)
    assert.equal(snapB.roadmapAndSrs.completedCount, 0);
    assert.equal(snapB.roadmapAndSrs.leechCount, 0);
    assert.equal(snapB.examAttemptsCount, 0);
    assert.equal(snapB.readiness.score, 0);
    assert.equal(snapB.readiness.isColdStart, true);

    purgeSmartTelemetryCachesForLogout();
    assert.equal(storage.getItem(`${SMART_COACH_CACHE_PREFIX}user-alpha-1`), null);
  });
});

test('2. 5-Skill Aggregation from answerSnapshots (HSK 2.0 & 3.0, Exam vs Learning) & Mistake Clustering', () => {
  withMockStorage(() => {
    const user = { id: 'user-5skill', hskLevel: 'HSK 7-9' };

    saveDualExamHistoryRecord({
      user,
      analytics: {
        examSystem: 'hsk_3_0',
        level: 'HSK 7-9',
        practiceMode: 'exam',
        totalScore: 210,
        maxScore: 300,
        answerSnapshots: [
          { questionId: 'l1', skill: 'listening', questionType: 'mcq', isCorrect: true },
          { questionId: 'l2', skill: 'listening', questionType: 'mcq', isCorrect: false },
          { questionId: 'r1', skill: 'reading', questionType: 'mcq', isCorrect: true },
          { questionId: 'r2', skill: 'reading', questionType: 'mcq', isCorrect: true },
          { questionId: 'w1', skill: 'writing', questionType: 'essay', scoreAwarded: 8, maxScore: 10, gradingSource: 'ai_rubric' },
          { questionId: 't1', skill: 'translation', questionType: 'translation', scoreAwarded: 4, maxScore: 10, gradingSource: 'deterministic_fallback' },
          { questionId: 's1', skill: 'speaking', questionType: 'speaking', scoreAwarded: 9, maxScore: 10, gradingSource: 'ai_rubric' },
        ],
      },
    });

    saveDualExamHistoryRecord({
      user,
      analytics: {
        examSystem: 'hsk_2_0',
        level: 'HSK 5',
        practiceMode: 'learning',
        totalScore: 270,
        maxScore: 300,
        answerSnapshots: [
          { questionId: 'l20-1', skill: 'listening', questionType: 'mcq', isCorrect: true },
          { questionId: 'r20-1', skill: 'reading', questionType: 'mcq', isCorrect: true },
        ],
      },
    });

    recordMistakeEntry({
      user,
      question: { id: 'm1', skill: 'listening', question_type: 'multiple_choice', prompt: '听说明天要下雨' },
      examSystem: 'hsk_3_0',
      level: 'HSK 7-9',
    });
    recordMistakeEntry({
      user,
      question: { id: 'm2', skill: 'reading', question_type: 'reorder_sentence', prompt: '把句子排列正确' },
      examSystem: 'hsk_3_0',
      level: 'HSK 7-9',
    });

    const snap30 = buildSmartLearningSnapshot(user, { examSystem: 'hsk_3_0' });
    assert.equal(snap30.fiveSkills.skills.listening.examPct, 50);
    assert.equal(snap30.fiveSkills.skills.reading.examPct, 100);
    assert.equal(snap30.fiveSkills.skills.writing.examPct, 80);
    assert.equal(snap30.fiveSkills.skills.translation.examPct, 40);
    assert.equal(snap30.fiveSkills.skills.speaking.examPct, 90);
    assert.equal(snap30.fiveSkills.weakestSkill.skill, 'translation');

    const snapAll = buildSmartLearningSnapshot(user, { examSystem: 'all' });
    assert.equal(snapAll.fiveSkills.skills.listening.examPct, 50);
    assert.equal(snapAll.fiveSkills.skills.listening.learningPct, 100);
    assert.ok(snapAll.mistakeClusters.clusters.some((c) => c.key === 'listening_dialogue'));
    assert.ok(snapAll.mistakeClusters.clusters.some((c) => c.key === 'reorder'));
    assert.ok(snapAll.readiness.score > 0);
    assert.ok(snapAll.readiness.pullDownFactors.length > 0);
  });
});

test('3. Vietnam Timezone (Asia/Ho_Chi_Minh) Streak & 7-Day Cadence Across UTC Midnight', () => {
  // 2026-11-26T16:30:00Z = 2026-11-26 23:30 VN
  // 2026-11-26T17:30:00Z = 2026-11-27 00:30 VN
  assert.equal(getVietnamDateKey('2026-11-26T16:30:00Z'), '2026-11-26');
  assert.equal(getVietnamDateKey('2026-11-26T17:30:00Z'), '2026-11-27');

  const cadence = computeVietnamStudyCadence({
    now: new Date('2026-11-27T01:00:00Z'), // 08:00 VN on 2026-11-27
    events: [
      { created_at: '2026-11-24T18:00:00Z', latency_ms: 12000 }, // 2026-11-25 01:00 VN
      { created_at: '2026-11-26T16:30:00Z', latency_ms: 18000 }, // 2026-11-26 23:30 VN
      { created_at: '2026-11-26T17:30:00Z', latency_ms: 30000 }, // 2026-11-27 00:30 VN
    ],
  });

  assert.equal(cadence.todayDateKey, '2026-11-27');
  assert.equal(cadence.streak, 3);
  assert.equal(cadence.activeDays7d, 3);
  assert.equal(cadence.last7Days.length, 7);
  assert.equal(cadence.last7Days[6].dateKey, '2026-11-27');
  assert.equal(cadence.last7Days[6].isToday, true);
});

test('4. Rule-Based Adaptive Fallback (401 / 503 / Network Error) & Daily Progress-Hash Cache', async () => {
  await withMockStorageAsync(async (storage) => {
    const user = { id: 'user-coach-1', token: 'mock-jwt-token', hskLevel: 'HSK 2' };
    storage.setItem('hanzigo_completed_lessons_user-coach-1', JSON.stringify(['l-101']));
    const snap = buildSmartLearningSnapshot(user);

    // 401 fallback
    const res401 = await fetchSmartCoachWithCacheAndFallback(user, snap, {
      forceRefresh: true,
      fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) }),
    });
    assert.equal(res401.source, 'rule_based_fallback');
    assert.equal(res401.fallbackReason, 'http_401');
    assert.ok(res401.dailyPlan.length >= 3);

    // 503 kill-switch fallback
    const res503 = await fetchSmartCoachWithCacheAndFallback(user, snap, {
      forceRefresh: true,
      fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({ error: 'Kill switch' }) }),
    });
    assert.equal(res503.source, 'rule_based_fallback');
    assert.equal(res503.fallbackReason, 'http_503');
    assert.ok(res503.dailyPlan.length >= 3);

    // Network rejection fallback
    const resNet = await fetchSmartCoachWithCacheAndFallback(user, snap, {
      forceRefresh: true,
      fetchImpl: async () => {
        throw new Error('ECONNREFUSED');
      },
    });
    assert.equal(resNet.source, 'rule_based_fallback');
    assert.equal(resNet.fallbackReason, 'network_error');

    // 200 AI success + cache hit on second call
    let fetchCalls = 0;
    const mock200Fetch = async () => {
      fetchCalls += 1;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          source: 'ai_coach',
          greeting: 'Lão Sư chào bạn',
          coachInsight: 'Tập trung ôn thẻ SRS và kỹ năng Nghe.',
          weakestSkillNote: 'Cần thêm luyện tập Nghe.',
          dailyPlan: [
            { id: 'p1', priority: 1, title: 'Ôn 5 từ', reason: 'Sắp quên', targetRoute: 'vocabulary' },
            { id: 'p2', priority: 2, title: 'Nghe HSK 2', reason: 'Tăng tốc', targetRoute: 'hsk' },
            { id: 'p3', priority: 3, title: 'Học bài mới', reason: 'Đều đặn', targetRoute: 'roadmap' },
          ],
        }),
      };
    };

    const first = await fetchSmartCoachWithCacheAndFallback(user, snap, {
      forceRefresh: true,
      fetchImpl: mock200Fetch,
    });
    assert.equal(first.source, 'ai_coach');
    assert.equal(first.fromCache, false);
    assert.equal(fetchCalls, 1);

    const second = await fetchSmartCoachWithCacheAndFallback(user, snap, {
      forceRefresh: false,
      fetchImpl: mock200Fetch,
    });
    assert.equal(second.fromCache, true);
    assert.equal(fetchCalls, 1);
  });
});

test('5. PII Redaction & Compact AI Telemetry Payload Cap', () => {
  const dirty = redactClientPii({
    email: 'learner@example.com',
    phone: '+84 912 345 678',
    fullName: 'Nguyen Van A',
    note: 'Liên hệ test.user@gmail.com hoặc 0987654321, token Bearer abc.def.ghi',
  });
  assert.equal(dirty.email, undefined);
  assert.equal(dirty.phone, undefined);
  assert.equal(dirty.fullName, undefined);
  assert.ok(!dirty.note.includes('test.user@gmail.com'));
  assert.ok(!dirty.note.includes('0987654321'));
  assert.ok(dirty.note.includes('[REDACTED_EMAIL]'));
  assert.ok(dirty.note.includes('[REDACTED_PHONE]'));

  const serverRedacted = redactSensitiveData({
    email: 'a@b.com',
    phone_number: '0912345678',
    summary: 'Email user@hanzigo.vn SĐT 0901234567',
  });
  assert.equal(serverRedacted.email, '[REDACTED_EMAIL]');
  assert.equal(serverRedacted.phone_number, '[REDACTED_PHONE]');
  assert.ok(!serverRedacted.summary.includes('user@hanzigo.vn'));
  assert.ok(!serverRedacted.summary.includes('0901234567'));

  const hugeSnapshot = {
    targetHskLevel: 6,
    examSystem: 'hsk_3_0',
    readiness: {
      score: 62,
      isColdStart: false,
      pullDownFactors: Array.from({ length: 10 }, (_, i) => ({
        key: `f${i}`,
        labelVi: `Yếu tố kéo điểm rất dài số ${i} `.repeat(4),
        valuePct: 30 + i,
      })),
    },
    roadmapAndSrs: {
      completedCount: 40,
      dueToday: 18,
      retentionPct: 72,
      leechWords: Array.from({ length: 20 }, (_, i) => ({
        hanzi: `汉字${i}`,
        pinyin: 'hanzi'.repeat(5),
        meaning: 'Giải thích rất dài '.repeat(6),
        lapseCount: 4,
      })),
    },
    fiveSkills: { list: [{ skill: 'listening', overallPct: 55, examPct: 50, learningPct: 70 }] },
    mistakeClusters: { clusters: [{ key: 'reorder', count: 5, totalWrongCount: 8 }] },
    cadence: { streak: 4, totalMinutes7d: 95 },
  };

  const compact = buildCompactAiTelemetryPayload(hugeSnapshot);
  assert.ok(JSON.stringify(compact).length <= MAX_AI_TELEMETRY_PAYLOAD_CHARS);
});

test('6. HITL Guard Blocks Unconfirmed SRS Mutation and Persists After Explicit Confirmation', () => {
  withMockStorage((storage) => {
    const user = { id: 'user-hitl-1', hskLevel: 'HSK 2' };
    storage.setItem(`${STORAGE_SRS_STATE}_user-hitl-1`, JSON.stringify({
      l1: { id: 'l1', hanzi: '方便', pinyin: 'fāngbiàn', meaning: 'Thuận tiện', repetitions: 1, lapse_count: 3, easeFactor: 1.4 },
    }));

    const snap = buildSmartLearningSnapshot(user);
    const plan = buildRuleBasedAdaptivePlan(snap, { user });

    assert.ok(plan.pending_confirmations.length >= 1);
    const proposal = plan.pending_confirmations[0];
    assert.equal(proposal.requiresConfirmation, true);
    assert.equal(storage.getItem(`${STORAGE_REVIEW}_user-hitl-1`), null);

    // Unconfirmed attempt MUST NOT write
    const blocked = applyConfirmedHitlProposal(proposal, user, { confirmed: false });
    assert.equal(blocked.applied, false);
    assert.equal(storage.getItem(`${STORAGE_REVIEW}_user-hitl-1`), null);

    // Confirmed attempt writes cleanly to user-scoped SRS + Review queue
    const applied = applyConfirmedHitlProposal(proposal, user, { confirmed: true });
    assert.equal(applied.applied, true);
    assert.equal(applied.actionType, 'save_vocab_to_srs');

    const savedReview = JSON.parse(storage.getItem(`${STORAGE_REVIEW}_user-hitl-1`));
    assert.ok(savedReview.includes(applied.savedId));

    const savedSrs = JSON.parse(storage.getItem(`${STORAGE_SRS_STATE}_user-hitl-1`));
    assert.ok(savedSrs[applied.savedId]);
    assert.equal(savedSrs[applied.savedId].sourceContext, 'ai_coach_hitl');
  });
});

test('7. Backend /api/ai/coach Enforces Kill-Switch (503) and Auth (401)', async () => {
  const prevKill = process.env.AI_TUTOR_KILL_SWITCH;
  try {
    process.env.AI_TUTOR_KILL_SWITCH = 'true';
    const resKill = createMockRes();
    await coachHandler({ method: 'POST', headers: {}, body: { action: 'generate_smart_adaptive_plan', payload: {} } }, resKill);
    assert.equal(resKill.statusCode, 503);

    delete process.env.AI_TUTOR_KILL_SWITCH;
    const resUnauth = createMockRes();
    await coachHandler({ method: 'POST', headers: {}, body: { action: 'generate_smart_adaptive_plan', payload: {} } }, resUnauth);
    assert.equal(resUnauth.statusCode, 401);
  } finally {
    if (prevKill === undefined) delete process.env.AI_TUTOR_KILL_SWITCH;
    else process.env.AI_TUTOR_KILL_SWITCH = prevKill;
  }
});
