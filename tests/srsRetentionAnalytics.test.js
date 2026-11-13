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
  computeRetrievability,
  updateMemoryParameters,
  detectLeechStatus,
  classifyCardMaturity,
  recordSrsRetentionReview,
  resetLeechCard,
  injectLeechMnemonic,
  computeSrsRetentionSnapshot,
  buildSrsRetentionSnapshot,
} = await import('../src/services/srsRetentionService.ts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Task 26.03: SRS Retention Analytics', () => {
  const testUser = { id: 'srs_retention_user_1' };

  beforeEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
  });

  it('computes exponential forgetting curve R(t, S) = (1 + (19/81)*(t/S))^(-0.5)', () => {
    // At t = 0, R = 1
    assert.equal(computeRetrievability(0, 10), 1);

    // At t = S, R = (1 + 19/81)^(-0.5) = (100/81)^(-0.5) = 9/10 = 0.9
    assert.equal(computeRetrievability(10, 10), 0.9);
    assert.equal(computeRetrievability(30, 30), 0.9);

    // Monotonic decay across 1d, 7d, 14d, 30d, 90d for S = 14
    const intervals = [1, 7, 14, 30, 90];
    const values = intervals.map((t) => computeRetrievability(t, 14));
    for (let i = 1; i < values.length; i += 1) {
      assert.ok(values[i] < values[i - 1], `Expected R(${intervals[i]}) < R(${intervals[i - 1]})`);
    }
  });

  it('models maturity state transitions (New -> Learning -> Young -> Mature -> Leech)', () => {
    assert.equal(classifyCardMaturity({ totalReviews: 0, scheduledDays: 0, isLeech: false }), 'New');
    assert.equal(classifyCardMaturity({ totalReviews: 1, scheduledDays: 0.5, isLeech: false }), 'Learning');
    assert.equal(classifyCardMaturity({ totalReviews: 3, scheduledDays: 7, isLeech: false }), 'Young');
    assert.equal(classifyCardMaturity({ totalReviews: 5, scheduledDays: 21, isLeech: false }), 'Mature');
    assert.equal(classifyCardMaturity({ totalReviews: 6, scheduledDays: 30, isLeech: true }), 'Leech');

    // Verify rating progression grows stability and scheduled_days
    const goodStep = updateMemoryParameters({
      stability: 6,
      difficulty: 5,
      elapsedDays: 6,
      scheduledDays: 6,
      lapses: 0,
      reviewRating: 3,
    });
    assert.ok(goodStep.stability > 6);
    assert.ok(goodStep.scheduled_days >= 7);

    // Verify Again (1) increments lapses and drops stability
    const againStep = updateMemoryParameters({
      stability: 12,
      difficulty: 5,
      elapsedDays: 10,
      scheduledDays: 12,
      lapses: 1,
      reviewRating: 1,
    });
    assert.equal(againStep.lapses, 2);
    assert.ok(againStep.stability < 12);
    assert.equal(againStep.scheduled_days, 1);
  });

  it('detects leech cards via lapses >= 4 OR accuracy < 45% over last 6 reviews', () => {
    // 1. lapses >= 4
    assert.equal(detectLeechStatus(4, [true, true, true, true, true, true]), true);

    // 2. accuracy < 45% over last 6 reviews (2/6 = 33.3%)
    assert.equal(detectLeechStatus(2, [true, false, false, true, false, false]), true);

    // 3. accuracy >= 50% with lapses < 4 -> NOT leech
    assert.equal(detectLeechStatus(2, [true, false, true, false, true, true]), false);
  });

  it('records reviews, detects leech with radical breakdown, and supports reset/mnemonic intervention', () => {
    // Record 4 lapses on '好' to trigger Leech
    let latest;
    for (let i = 0; i < 4; i += 1) {
      latest = recordSrsRetentionReview({
        user: testUser,
        cardId: 'card_hao',
        hanzi: '好',
        pinyin: 'hǎo',
        meaning: 'tốt, khỏe',
        hskLevel: 1,
        reviewRating: 1,
        elapsedDays: 1,
        confusedWith: '女',
      });
    }

    assert.equal(latest.card.isLeech, true);
    assert.equal(latest.card.maturity, 'Leech');
    assert.equal(latest.card.lapses, 4);
    assert.deepEqual(latest.card.confusedWith, ['女']);
    assert.ok(latest.card.radicalBreakdown);
    assert.equal(latest.card.radicalBreakdown.ids, '⿰女子');

    // Inject custom mnemonic
    const withMnemonic = injectLeechMnemonic('card_hao', 'Mẹ (女) ôm con (子) là rất tốt (好)', testUser);
    assert.equal(withMnemonic?.customMnemonic, 'Mẹ (女) ôm con (子) là rất tốt (好)');

    // Snapshot reflects leech
    let snap = buildSrsRetentionSnapshot({ user: testUser, hskFilter: 1 });
    assert.equal(snap.leechCount, 1);
    assert.equal(snap.leechCards[0].cardId, 'card_hao');

    // Reset leech card
    const reset = resetLeechCard('card_hao', testUser);
    assert.equal(reset?.isLeech, false);
    assert.equal(reset?.lapses, 0);
    assert.equal(reset?.maturity, 'Learning');

    snap = buildSrsRetentionSnapshot({ user: testUser, hskFilter: 1 });
    assert.equal(snap.leechCount, 0);
  });

  it('builds forgetting curve, maturity distribution, and 7-day workload forecast on synthetic dataset', () => {
    const nowMs = Date.UTC(2026, 10, 12, 12, 0, 0);
    const cards = [];
    // Create 50 cards due today to verify burnout prevention recommends 0 new cards
    for (let i = 0; i < 50; i += 1) {
      cards.push({
        cardId: `c_${i}`,
        hanzi: '学',
        pinyin: 'xué',
        meaning: 'học',
        hskLevel: 2,
        stability: 10,
        difficulty: 4,
        elapsed_days: 5,
        scheduled_days: 25,
        lapses: 0,
        review_rating: 3,
        totalReviews: 5,
        recentAccuracies: [true, true, true],
        lastReviewedAt: new Date(nowMs - 5 * 86400000).toISOString(),
        nextReviewAt: new Date(nowMs + (i % 2) * 86400000).toISOString(),
        retrievability: 0.9,
        maturity: 'Mature',
        isLeech: false,
        confusedWith: [],
      });
    }

    const logs = [
      { id: 'l1', cardId: 'c_0', hanzi: '学', hskLevel: 2, reviewRating: 3, isCorrect: true, elapsedDays: 1, scheduledDays: 2, stabilityBefore: 1, stabilityAfter: 2, difficultyAfter: 5, timestamp: new Date(nowMs).toISOString() },
      { id: 'l2', cardId: 'c_1', hanzi: '学', hskLevel: 2, reviewRating: 3, isCorrect: true, elapsedDays: 7, scheduledDays: 14, stabilityBefore: 7, stabilityAfter: 14, difficultyAfter: 5, timestamp: new Date(nowMs).toISOString() },
      { id: 'l3', cardId: 'c_2', hanzi: '学', hskLevel: 2, reviewRating: 1, isCorrect: false, elapsedDays: 30, scheduledDays: 1, stabilityBefore: 14, stabilityAfter: 5, difficultyAfter: 6, timestamp: new Date(nowMs).toISOString() },
    ];

    const snap = computeSrsRetentionSnapshot({
      cards,
      logs,
      hskFilter: 2,
      totalCatalogCardsForLevel: 80,
      nowMs,
    });

    assert.equal(snap.maturityDistribution.counts.Mature, 50);
    assert.equal(snap.maturityDistribution.counts.New, 30);
    assert.equal(snap.workloadForecast.length, 7);
    assert.equal(snap.workloadForecast[0].dueReviews, 25);
    assert.equal(snap.workloadForecast[1].dueReviews, 25);

    const day1 = snap.forgettingCurve.find((f) => f.intervalDays === 1);
    const day30 = snap.forgettingCurve.find((f) => f.intervalDays === 30);
    assert.equal(day1?.actualRetention, 100);
    assert.equal(day30?.actualRetention, 0);
  });

  it('SrsRetentionDashboard.tsx includes all 4 required analytics views', () => {
    const ui = fs.readFileSync(
      path.join(projectRoot, 'src/features/srs/SrsRetentionDashboard.tsx'),
      'utf8'
    );
    assert.match(ui, /SRS Forgetting Curve Chart/);
    assert.match(ui, /Phân bổ Độ chín Từ vựng/);
    assert.match(ui, /Dự báo Khối lượng Ôn tập 7 Ngày tới/);
    assert.match(ui, /Leech Intervention Drawer/);
  });
});

