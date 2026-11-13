import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

global.localStorage = createMemoryStorage();
global.sessionStorage = createMemoryStorage();

const {
  DEFAULT_PRIORITY_WEIGHTS,
  computePriorityScore,
  computeExamProximity,
  computeDynamicDifficulty,
  buildDailyAdaptivePlan,
} = await import('../src/services/adaptiveEngine.ts');

const { normalizeLearningEvent } = await import(
  '../src/services/learningDataService.ts'
);
const { computeStudentAnalyticsSnapshot } = await import(
  '../src/features/analytics/studentAnalyticsService.ts'
);
const { computeSrsRetentionSnapshot } = await import(
  '../src/services/srsRetentionService.ts'
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Task 26.04: Adaptive Learning Engine', () => {
  beforeEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
  });

  it('computes PriorityScore(i) = w1(1-R) + w2*ErrorWeight + w3*SkillGap + w4*ExamProximity', () => {
    const high = computePriorityScore({
      retrievability: 0.2, // decayUrgency = 0.8
      errorWeight: 0.9,
      skillGap: 0.8,
      examProximity: 1.0,
    });
    const low = computePriorityScore({
      retrievability: 0.95, // decayUrgency = 0.05
      errorWeight: 0.1,
      skillGap: 0.1,
      examProximity: 0.25,
    });

    const expectedHigh =
      Math.round(
        (DEFAULT_PRIORITY_WEIGHTS.w1Decay * 0.8 +
          DEFAULT_PRIORITY_WEIGHTS.w2Error * 0.9 +
          DEFAULT_PRIORITY_WEIGHTS.w3SkillGap * 0.8 +
          DEFAULT_PRIORITY_WEIGHTS.w4ExamProximity * 1.0) *
          1000
      ) / 10;

    assert.equal(high.score, expectedHigh);
    assert.ok(high.score > low.score);

    const nowMs = Date.UTC(2026, 10, 12);
    assert.equal(computeExamProximity(new Date(nowMs + 5 * 86400000).toISOString(), nowMs), 1.0);
    assert.equal(computeExamProximity(new Date(nowMs + 90 * 86400000).toISOString(), nowMs), 0.25);
  });

  it('adjusts Dynamic Difficulty (DDA) around the 75%-85% ZPD target', () => {
    const makeEvents = (correctCount, total = 10) =>
      Array.from({ length: total }, (_, idx) =>
        normalizeLearningEvent({
          sourceModule: 'lesson',
          hskLevel: 2,
          itemId: `q_${idx}`,
          isCorrect: idx < correctCount,
        })
      );

    // 90% -> challenge
    const challenge = computeDynamicDifficulty(makeEvents(9));
    assert.equal(challenge.tier, 'challenge');
    assert.equal(challenge.distractorSimilarity, 'high');
    assert.equal(challenge.audioSpeed, 1.15);
    assert.equal(challenge.audioReplayLimit, 1);

    // 50% -> supportive
    const supportive = computeDynamicDifficulty(makeEvents(5));
    assert.equal(supportive.tier, 'supportive');
    assert.equal(supportive.distractorSimilarity, 'low');
    assert.equal(supportive.audioSpeed, 0.85);
    assert.equal(supportive.audioReplayLimit, 3);

    // 80% -> optimal_zpd
    const optimal = computeDynamicDifficulty(makeEvents(8));
    assert.equal(optimal.tier, 'optimal_zpd');
    assert.equal(optimal.distractorSimilarity, 'medium');
    assert.equal(optimal.audioSpeed, 1.0);
    assert.equal(optimal.audioReplayLimit, 2);
  });

  it('prioritizes writing/stroke remediation tasks over mastered reading skills for high writing error users', () => {
    const userId = '11111111-1111-4111-8111-111111111111';
    const nowIso = new Date().toISOString();

    // Mastered reading events (100% correct) + failing writing/stroke events (0% correct)
    const events = [
      ...Array.from({ length: 6 }, (_, i) =>
        normalizeLearningEvent({
          userId,
          sourceModule: 'lesson',
          hskLevel: 3,
          skillDomain: 'reading',
          itemId: `read_${i}`,
          isCorrect: true,
          scoreEarned: 1,
          scoreMax: 1,
          createdAt: nowIso,
        })
      ),
      ...Array.from({ length: 6 }, (_, i) =>
        normalizeLearningEvent({
          userId,
          sourceModule: 'hanzi_writer',
          hskLevel: 3,
          skillDomain: 'stroke_order',
          itemId: `stroke_${i}`,
          isCorrect: false,
          scoreEarned: 0,
          scoreMax: 1,
          createdAt: nowIso,
        })
      ),
    ];

    const mistakes = [
      {
        id: 'err_stroke_1',
        user_id: userId,
        error_category: 'radical_stroke_error',
        hsk_level: 3,
        target_entity_id: 'char_写',
        user_answer: {},
        expected_answer: {},
        occurrence_count: 6,
        resolved_status: 'active',
        last_mistake_at: nowIso,
      },
    ];

    const analyticsSnapshot = computeStudentAnalyticsSnapshot({
      hskLevel: 3,
      daysWindow: 90,
      localEvents: events,
      localMistakes: mistakes,
      examAttempts: [],
    });

    const srsSnapshot = computeSrsRetentionSnapshot({
      cards: [],
      logs: [],
      hskFilter: 3,
      totalCatalogCardsForLevel: 30,
    });

    const plan = buildDailyAdaptivePlan({
      hskLevel: 3,
      recentEvents: events,
      mistakeRecords: mistakes,
      analyticsSnapshot,
      srsSnapshot,
    });

    assert.ok(plan.allRankedCandidates.length >= 2);
    const topCandidate = plan.allRankedCandidates[0];
    assert.ok(
      topCandidate.skillDomain === 'stroke_order' || topCandidate.skillDomain === 'writing',
      `Expected top candidate to be stroke_order/writing, got ${topCandidate.skillDomain}`
    );

    // Mastered reading (100% vs 80% benchmark) should NOT outrank writing/stroke remediation
    const readingCandidate = plan.allRankedCandidates.find(
      (c) => c.skillDomain === 'reading'
    );
    assert.equal(readingCandidate, undefined);

    // Verify Today's Smart Session quests have transparent explanations
    assert.ok(plan.quests.length > 0);
    plan.quests.forEach((q) => {
      assert.ok(q.whyRecommended.length > 10);
      assert.ok(q.targetTab);
    });
  });

  it('generates structured 25-minute Today Smart Session across SRS leech, mistake repair, and weak-skill drill', () => {
    const nowIso = new Date().toISOString();
    const srsSnapshot = computeSrsRetentionSnapshot({
      cards: [
        {
          cardId: 'card_leech_1',
          hanzi: '谢谢',
          pinyin: 'xièxie',
          meaning: 'cảm ơn',
          hskLevel: 1,
          stability: 1,
          difficulty: 8,
          elapsed_days: 5,
          scheduled_days: 1,
          lapses: 5,
          review_rating: 1,
          totalReviews: 6,
          recentAccuracies: [false, false, false, true, false, false],
          lastReviewedAt: nowIso,
          nextReviewAt: nowIso,
          retrievability: 0.35,
          maturity: 'Leech',
          isLeech: true,
          confusedWith: ['对不起'],
        },
      ],
      logs: [],
      hskFilter: 1,
      totalCatalogCardsForLevel: 20,
    });

    const mistakes = [
      {
        id: 'm_gram',
        user_id: null,
        error_category: 'word_order_syntax',
        hsk_level: 1,
        target_entity_id: 'grammar_1_0',
        user_answer: {},
        expected_answer: {},
        occurrence_count: 3,
        resolved_status: 'active',
        last_mistake_at: nowIso,
      },
    ];

    const analyticsSnapshot = computeStudentAnalyticsSnapshot({
      hskLevel: 1,
      daysWindow: 90,
      localEvents: [],
      localMistakes: mistakes,
      examAttempts: [],
    });

    const plan = buildDailyAdaptivePlan({
      hskLevel: 1,
      recentEvents: [],
      mistakeRecords: mistakes,
      analyticsSnapshot,
      srsSnapshot,
    });

    assert.equal(plan.quests.length, 3);
    assert.equal(plan.totalMinutes, 25);
    assert.equal(plan.quests[0].blockType, 'srs_leech');
    assert.equal(plan.quests[1].blockType, 'mistake_repair');
    assert.equal(plan.quests[2].blockType, 'weak_skill_drill');
  });

  it('DailyAdaptivePlan.tsx renders Smart Session, DDA, and Why this recommendation badges', () => {
    const ui = fs.readFileSync(
      path.join(projectRoot, 'src/features/adaptive/DailyAdaptivePlan.tsx'),
      'utf8'
    );
    assert.match(ui, /Today's Smart Session/);
    assert.match(ui, /Dynamic Difficulty Adjustment/);
    assert.match(ui, /Why this recommendation\?/);
  });
});

