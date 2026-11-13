/**
 * =========================================================================
 * HANZIGO — SRS RETENTION & MEMORY DECAY ANALYTICS (TASK 26.03)
 * =========================================================================
 * Models memory decay via FSRS-inspired Stability (S), Difficulty (D),
 * Elapsed Days (t), Scheduled Days, Lapses, and Review Rating (1..4).
 *
 * Retrievability Formula:
 *   R(t, S) = (1 + (19 / 81) * (t / S)) ^ (-0.5)
 *
 * Leech Detection:
 *   lapses >= 4 OR accuracy < 45% over the last 6 reviews.
 * =========================================================================
 */

import { getUserStorageKey } from '../utils/gamification.js';
import { STORAGE_SRS_STATE } from '../utils/srsEngine.js';
import { VOCABULARY_LIST } from '../data/chineseData.js';
import { getHanziDecomposition } from '../data/hanziDecomposition.js';

export type ReviewRating = 1 | 2 | 3 | 4; // 1=Again, 2=Hard, 3=Good, 4=Easy

export type MaturityState = 'New' | 'Learning' | 'Young' | 'Mature' | 'Leech';

export interface SrsRetentionReviewLog {
  id: string;
  cardId: string;
  hanzi: string;
  hskLevel: number;
  reviewRating: ReviewRating;
  isCorrect: boolean;
  elapsedDays: number;
  scheduledDays: number;
  stabilityBefore: number;
  stabilityAfter: number;
  difficultyAfter: number;
  confusedWith?: string | null;
  timestamp: string;
}

export interface RadicalComponentInfo {
  char: string;
  pinyin?: string;
  hanviet?: string;
  name?: string;
  meaning?: string;
}

export interface SrsRetentionCard {
  cardId: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number;
  stability: number; // S (days)
  difficulty: number; // D (1..10)
  elapsed_days: number; // t (days)
  scheduled_days: number;
  lapses: number;
  review_rating: ReviewRating;
  totalReviews: number;
  recentAccuracies: boolean[]; // up to last 6 reviews
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
  retrievability: number; // 0..1
  maturity: MaturityState;
  isLeech: boolean;
  confusedWith: string[];
  customMnemonic?: string;
  radicalBreakdown?: {
    ids?: string;
    structureName?: string;
    components: RadicalComponentInfo[];
    mnemonic?: string;
  } | null;
}

export interface ForgettingCurvePoint {
  intervalDays: 1 | 7 | 14 | 30 | 90;
  label: string;
  predictedRetention: number; // 0..100
  actualRetention: number | null; // 0..100 or null when no logs in bucket
  sampleSize: number;
}

export interface MaturityBreakdown {
  hskLevel: number | 'all';
  total: number;
  counts: Record<MaturityState, number>;
}

export interface WorkloadForecastDay {
  dayOffset: number;
  date: string;
  label: string;
  dueReviews: number;
  estimatedMinutes: number;
  burnoutRisk: 'low' | 'moderate' | 'high';
}

export interface SrsRetentionSnapshot {
  hskFilter: number | 'all';
  totalTrackedCards: number;
  averageStabilityDays: number;
  averageRetrievability: number; // 0..100
  leechCount: number;
  forgettingCurve: ForgettingCurvePoint[];
  maturityDistribution: MaturityBreakdown;
  workloadForecast: WorkloadForecastDay[];
  recommendedNewCardsPerDay: number;
  workloadGuidance: string;
  leechCards: SrsRetentionCard[];
}

const STORAGE_RETENTION_CARDS = 'hanzigo_srs_retention_cards';
const STORAGE_RETENTION_LOGS = 'hanzigo_srs_retention_logs';
const FORGETTING_INTERVALS: Array<1 | 7 | 14 | 30 | 90> = [1, 7, 14, 30, 90];

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('srsRetentionService storage write error:', err);
  }
}

/**
 * Exponential forgetting curve:
 *   R(t, S) = (1 + (19 / 81) * (t / S)) ^ (-0.5)
 */
export function computeRetrievability(
  elapsedDays: number,
  stability: number
): number {
  const t = Math.max(0, Number.isFinite(elapsedDays) ? elapsedDays : 0);
  if (t === 0) return 1;
  const s = Math.max(0.1, Number.isFinite(stability) ? stability : 1);
  const r = Math.pow(1 + (19 / 81) * (t / s), -0.5);
  return Math.min(1, Math.max(0, Math.round(r * 10000) / 10000));
}

/**
 * Update Stability (S) and Difficulty (D) from a review_rating (1=Again, 2=Hard, 3=Good, 4=Easy).
 */
export function updateMemoryParameters(params: {
  stability?: number;
  difficulty?: number;
  elapsedDays?: number;
  scheduledDays?: number;
  lapses?: number;
  reviewRating: ReviewRating;
}): {
  stability: number;
  difficulty: number;
  scheduled_days: number;
  lapses: number;
} {
  const rating = params.reviewRating;
  const prevS = Math.max(0.1, params.stability ?? 1);
  const prevD = Math.min(10, Math.max(1, params.difficulty ?? 5));
  const elapsed = Math.max(0, params.elapsedDays ?? 0);
  const prevLapses = Math.max(0, params.lapses ?? 0);
  const retrievability = computeRetrievability(elapsed, prevS);

  let nextD = prevD;
  let nextS = prevS;
  let nextLapses = prevLapses;
  let nextScheduledDays = 1;

  if (rating === 1) {
    // Again: memory lapse
    nextLapses += 1;
    nextD = Math.min(10, Math.round((prevD + 1.2) * 100) / 100);
    nextS = Math.max(0.25, Math.round(prevS * 0.4 * 100) / 100);
    nextScheduledDays = 1;
  } else {
    const difficultyDelta = rating === 2 ? 0.5 : rating === 3 ? -0.15 : -0.6;
    nextD = Math.min(10, Math.max(1, Math.round((prevD + difficultyDelta) * 100) / 100));

    const ratingFactor = rating === 2 ? 1.2 : rating === 3 ? 1.9 : 2.6;
    const difficultyFactor = Math.max(0.4, (11 - nextD) / 6);
    const spacingBoost = 1 + (1 - retrievability) * 0.8;

    nextS = Math.max(
      1,
      Math.round(prevS * ratingFactor * difficultyFactor * spacingBoost * 100) / 100
    );
    nextScheduledDays = Math.max(1, Math.round(nextS));
  }

  return {
    stability: nextS,
    difficulty: nextD,
    scheduled_days: nextScheduledDays,
    lapses: nextLapses,
  };
}

/**
 * Leech detection:
 * Flags items where `lapses >= 4` OR accuracy < 45% over the last 6 reviews.
 */
export function detectLeechStatus(
  lapses: number,
  recentAccuracies: boolean[] = []
): boolean {
  if (lapses >= 4) return true;
  const lastSix = recentAccuracies.slice(-6);
  if (lastSix.length === 0) return false;
  // Require at least 2 reviews before flagging purely by accuracy percentage
  if (lastSix.length < 2) return false;
  const passCount = lastSix.filter(Boolean).length;
  const accuracyPct = (passCount / lastSix.length) * 100;
  return accuracyPct < 45;
}

/**
 * Classify card maturity state: New, Learning, Young (<21d), Mature (>=21d), Leech.
 */
export function classifyCardMaturity(params: {
  totalReviews: number;
  scheduledDays: number;
  isLeech: boolean;
}): MaturityState {
  if (params.isLeech) return 'Leech';
  if (params.totalReviews <= 0) return 'New';
  if (params.scheduledDays < 1) return 'Learning';
  if (params.scheduledDays < 21) return 'Young';
  return 'Mature';
}

function getRadicalBreakdownForWord(hanzi: string) {
  const chars = Array.from(String(hanzi || '').trim());
  for (const ch of chars) {
    const info = getHanziDecomposition(ch);
    if (info) {
      return {
        ids: info.ids,
        structureName: info.structure?.name,
        components: Array.isArray(info.components) ? info.components : [],
        mnemonic: info.mnemonic,
      };
    }
  }
  return null;
}

export function getStoredRetentionCards(
  user: { id?: string | null } | null = null
): Record<string, SrsRetentionCard> {
  const key = getUserStorageKey(STORAGE_RETENTION_CARDS, user);
  return safeReadJson<Record<string, SrsRetentionCard>>(key, {});
}

export function getStoredRetentionLogs(
  user: { id?: string | null } | null = null
): SrsRetentionReviewLog[] {
  const key = getUserStorageKey(STORAGE_RETENTION_LOGS, user);
  const logs = safeReadJson<SrsRetentionReviewLog[]>(key, []);
  return Array.isArray(logs) ? logs : [];
}

/**
 * Record an SRS review and update extended retention metadata (`stability`,
 * `difficulty`, `elapsed_days`, `scheduled_days`, `lapses`, `review_rating`).
 */
export function recordSrsRetentionReview(params: {
  user?: { id?: string | null } | null;
  cardId: string;
  hanzi?: string;
  pinyin?: string;
  meaning?: string;
  hskLevel?: number;
  reviewRating: ReviewRating;
  elapsedDays?: number;
  confusedWith?: string | null;
  timestamp?: string;
}): { card: SrsRetentionCard; log: SrsRetentionReviewLog } {
  const user = params.user ?? null;
  const cards = getStoredRetentionCards(user);
  const logs = getStoredRetentionLogs(user);
  const nowIso = params.timestamp ?? new Date().toISOString();
  const existing = cards[params.cardId];

  const elapsedDays =
    typeof params.elapsedDays === 'number' && params.elapsedDays >= 0
      ? params.elapsedDays
      : existing?.lastReviewedAt
      ? Math.max(
          0,
          Math.round(
            ((new Date(nowIso).getTime() -
              new Date(existing.lastReviewedAt).getTime()) /
              86400000) *
              10
          ) / 10
        )
      : 0;

  const stabilityBefore = existing?.stability ?? 1;
  const updatedParams = updateMemoryParameters({
    stability: stabilityBefore,
    difficulty: existing?.difficulty ?? 5,
    elapsedDays,
    scheduledDays: existing?.scheduled_days ?? 1,
    lapses: existing?.lapses ?? 0,
    reviewRating: params.reviewRating,
  });

  const isCorrect = params.reviewRating >= 2;
  const recentAccuracies = [...(existing?.recentAccuracies ?? []), isCorrect].slice(-6);
  const isLeech = detectLeechStatus(updatedParams.lapses, recentAccuracies);
  const totalReviews = (existing?.totalReviews ?? 0) + 1;

  const nextDate = new Date(
    new Date(nowIso).getTime() + updatedParams.scheduled_days * 86400000
  ).toISOString();

  const confusedSet = new Set(existing?.confusedWith ?? []);
  if (!isCorrect && params.confusedWith) {
    confusedSet.add(params.confusedWith);
  }

  const hanzi = params.hanzi ?? existing?.hanzi ?? params.cardId;
  const maturity = classifyCardMaturity({
    totalReviews,
    scheduledDays: updatedParams.scheduled_days,
    isLeech,
  });

  const updatedCard: SrsRetentionCard = {
    cardId: params.cardId,
    hanzi,
    pinyin: params.pinyin ?? existing?.pinyin ?? '',
    meaning: params.meaning ?? existing?.meaning ?? '',
    hskLevel: params.hskLevel ?? existing?.hskLevel ?? 1,
    stability: updatedParams.stability,
    difficulty: updatedParams.difficulty,
    elapsed_days: elapsedDays,
    scheduled_days: updatedParams.scheduled_days,
    lapses: updatedParams.lapses,
    review_rating: params.reviewRating,
    totalReviews,
    recentAccuracies,
    lastReviewedAt: nowIso,
    nextReviewAt: nextDate,
    retrievability: computeRetrievability(0, updatedParams.stability),
    maturity,
    isLeech,
    confusedWith: Array.from(confusedSet),
    customMnemonic: existing?.customMnemonic,
    radicalBreakdown:
      existing?.radicalBreakdown ?? getRadicalBreakdownForWord(hanzi),
  };

  cards[params.cardId] = updatedCard;
  safeWriteJson(getUserStorageKey(STORAGE_RETENTION_CARDS, user), cards);

  const logEntry: SrsRetentionReviewLog = {
    id: `srslog_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    cardId: params.cardId,
    hanzi,
    hskLevel: updatedCard.hskLevel,
    reviewRating: params.reviewRating,
    isCorrect,
    elapsedDays,
    scheduledDays: updatedParams.scheduled_days,
    stabilityBefore,
    stabilityAfter: updatedParams.stability,
    difficultyAfter: updatedParams.difficulty,
    confusedWith: params.confusedWith ?? null,
    timestamp: nowIso,
  };

  logs.unshift(logEntry);
  safeWriteJson(
    getUserStorageKey(STORAGE_RETENTION_LOGS, user),
    logs.slice(0, 1000)
  );

  return { card: updatedCard, log: logEntry };
}

/**
 * Reset a leech card back to fresh learning state.
 */
export function resetLeechCard(
  cardId: string,
  user: { id?: string | null } | null = null
): SrsRetentionCard | null {
  const cards = getStoredRetentionCards(user);
  const existing = cards[cardId];
  if (!existing) return null;

  const resetCard: SrsRetentionCard = {
    ...existing,
    stability: 1,
    lapses: 0,
    scheduled_days: 1,
    recentAccuracies: [],
    isLeech: false,
    maturity: 'Learning',
    nextReviewAt: new Date().toISOString(),
  };

  cards[cardId] = resetCard;
  safeWriteJson(getUserStorageKey(STORAGE_RETENTION_CARDS, user), cards);
  return resetCard;
}

/**
 * Save a custom mnemonic or mark a leech card for stroke/mnemonic intervention.
 */
export function injectLeechMnemonic(
  cardId: string,
  mnemonic: string,
  user: { id?: string | null } | null = null
): SrsRetentionCard | null {
  const cards = getStoredRetentionCards(user);
  const existing = cards[cardId];
  if (!existing) return null;

  const updated: SrsRetentionCard = {
    ...existing,
    customMnemonic: mnemonic.trim(),
  };

  cards[cardId] = updated;
  safeWriteJson(getUserStorageKey(STORAGE_RETENTION_CARDS, user), cards);
  return updated;
}

function hydrateLegacySrsCards(
  user: { id?: string | null } | null = null
): SrsRetentionCard[] {
  const legacyKey = getUserStorageKey(STORAGE_SRS_STATE, user);
  const legacyMap = safeReadJson<Record<string, Record<string, unknown>>>(
    legacyKey,
    {}
  );
  const retentionMap = getStoredRetentionCards(user);
  const vocabById = new Map(VOCABULARY_LIST.map((v) => [String(v.id), v]));

  const merged = new Map<string, SrsRetentionCard>();

  Object.entries(legacyMap).forEach(([cardId, raw]) => {
    if (retentionMap[cardId]) return;
    const vocab = vocabById.get(cardId);
    const interval = Number(raw.intervalDays ?? raw.interval_days ?? 1);
    const lapses = Number(raw.lapseCount ?? raw.lapse_count ?? 0);
    const reps = Number(raw.repetitions ?? raw.repetition ?? 0);
    const lastAt =
      typeof raw.lastReviewedAt === 'string'
        ? raw.lastReviewedAt
        : typeof raw.last_reviewed_at === 'string'
        ? raw.last_reviewed_at
        : null;
    const nextAt =
      typeof raw.nextReviewAt === 'string'
        ? raw.nextReviewAt
        : typeof raw.next_review_at === 'string'
        ? raw.next_review_at
        : null;
    const elapsedDays = lastAt
      ? Math.max(0, (Date.now() - new Date(lastAt).getTime()) / 86400000)
      : 0;
    const stability = Math.max(0.5, interval);
    const isLeech = detectLeechStatus(lapses, []);
    const totalReviews = reps + lapses;
    const hanzi = vocab?.hanzi ?? cardId;
    const hskLevel = Number(vocab?.level ?? 1);

    merged.set(cardId, {
      cardId,
      hanzi,
      pinyin: vocab?.pinyin ?? '',
      meaning: vocab?.meaning ?? '',
      hskLevel,
      stability,
      difficulty: Math.min(10, Math.max(1, 5 + lapses * 0.6)),
      elapsed_days: Math.round(elapsedDays * 10) / 10,
      scheduled_days: interval,
      lapses,
      review_rating: lapses > 0 && reps === 0 ? 1 : 3,
      totalReviews,
      recentAccuracies: [],
      lastReviewedAt: lastAt,
      nextReviewAt: nextAt,
      retrievability: computeRetrievability(elapsedDays, stability),
      maturity: classifyCardMaturity({
        totalReviews,
        scheduledDays: interval,
        isLeech,
      }),
      isLeech,
      confusedWith: [],
      radicalBreakdown: getRadicalBreakdownForWord(hanzi),
    });
  });

  Object.values(retentionMap).forEach((card) => {
    const elapsed = card.lastReviewedAt
      ? Math.max(
          0,
          (Date.now() - new Date(card.lastReviewedAt).getTime()) / 86400000
        )
      : card.elapsed_days;
    const retrievability = computeRetrievability(elapsed, card.stability);
    const isLeech = detectLeechStatus(card.lapses, card.recentAccuracies);
    merged.set(card.cardId, {
      ...card,
      elapsed_days: Math.round(elapsed * 10) / 10,
      retrievability,
      isLeech,
      maturity: classifyCardMaturity({
        totalReviews: card.totalReviews,
        scheduledDays: card.scheduled_days,
        isLeech,
      }),
      radicalBreakdown:
        card.radicalBreakdown ?? getRadicalBreakdownForWord(card.hanzi),
    });
  });

  return Array.from(merged.values());
}

function getBucketForInterval(
  elapsedDays: number
): 1 | 7 | 14 | 30 | 90 {
  if (elapsedDays <= 3) return 1;
  if (elapsedDays <= 10) return 7;
  if (elapsedDays <= 20) return 14;
  if (elapsedDays <= 59) return 30;
  return 90;
}

/**
 * Pure selector building the complete SRS Retention Analytics Snapshot.
 */
export function computeSrsRetentionSnapshot(params: {
  cards: SrsRetentionCard[];
  logs: SrsRetentionReviewLog[];
  hskFilter?: number | 'all';
  totalCatalogCardsForLevel?: number;
  nowMs?: number;
}): SrsRetentionSnapshot {
  const hskFilter = params.hskFilter ?? 'all';
  const nowMs = params.nowMs ?? Date.now();

  const filteredCards =
    hskFilter === 'all'
      ? params.cards
      : params.cards.filter((c) => c.hskLevel === hskFilter);

  const filteredLogs =
    hskFilter === 'all'
      ? params.logs
      : params.logs.filter((l) => l.hskLevel === hskFilter);

  // Average stability & retrievability
  const avgStability =
    filteredCards.length > 0
      ? Math.round(
          (filteredCards.reduce((s, c) => s + c.stability, 0) /
            filteredCards.length) *
            10
        ) / 10
      : 7;

  const avgRetrievability =
    filteredCards.length > 0
      ? Math.round(
          (filteredCards.reduce((s, c) => s + c.retrievability * 100, 0) /
            filteredCards.length) *
            10
        ) / 10
      : 0;

  // 1. Forgetting Curve across [1, 7, 14, 30, 90] days
  const bucketStats = new Map<
    number,
    { total: number; passed: number }
  >();
  FORGETTING_INTERVALS.forEach((d) =>
    bucketStats.set(d, { total: 0, passed: 0 })
  );

  for (const log of filteredLogs) {
    const bucket = getBucketForInterval(log.elapsedDays);
    const stat = bucketStats.get(bucket)!;
    stat.total += 1;
    if (log.isCorrect) stat.passed += 1;
  }

  const forgettingCurve: ForgettingCurvePoint[] = FORGETTING_INTERVALS.map(
    (intervalDays) => {
      const predictedRetention =
        Math.round(computeRetrievability(intervalDays, avgStability) * 1000) / 10;
      const stat = bucketStats.get(intervalDays)!;
      const actualRetention =
        stat.total > 0
          ? Math.round((stat.passed / stat.total) * 1000) / 10
          : null;
      return {
        intervalDays,
        label: `${intervalDays}d`,
        predictedRetention,
        actualRetention,
        sampleSize: stat.total,
      };
    }
  );

  // 2. Vocabulary Maturity Distribution
  const counts: Record<MaturityState, number> = {
    New: 0,
    Learning: 0,
    Young: 0,
    Mature: 0,
    Leech: 0,
  };

  for (const card of filteredCards) {
    counts[card.maturity] += 1;
  }

  const catalogTotal =
    params.totalCatalogCardsForLevel ??
    (hskFilter === 'all'
      ? VOCABULARY_LIST.length
      : VOCABULARY_LIST.filter((v) => Number(v.level) === hskFilter).length);

  if (catalogTotal > filteredCards.length) {
    counts.New += catalogTotal - filteredCards.length;
  }

  const totalMaturity = Object.values(counts).reduce((a, b) => a + b, 0);

  // 3. 7-Day Workload Forecast
  const workloadForecast: WorkloadForecastDay[] = [];
  const startOfToday = new Date(nowMs);
  startOfToday.setUTCHours(0, 0, 0, 0);

  for (let offset = 0; offset < 7; offset += 1) {
    const dayStartMs = startOfToday.getTime() + offset * 86400000;
    const dayEndMs = dayStartMs + 86400000;
    const dateStr = new Date(dayStartMs).toISOString().slice(0, 10);

    let dueReviews = 0;
    for (const card of filteredCards) {
      if (!card.nextReviewAt) {
        if (offset === 0) dueReviews += 1;
        continue;
      }
      const dueMs = new Date(card.nextReviewAt).getTime();
      if (offset === 0) {
        if (dueMs <= dayEndMs) dueReviews += 1;
      } else if (dueMs >= dayStartMs && dueMs < dayEndMs) {
        dueReviews += 1;
      }
    }

    const estimatedMinutes = Math.round(dueReviews * 0.4 * 10) / 10;
    const burnoutRisk: 'low' | 'moderate' | 'high' =
      dueReviews >= 45 ? 'high' : dueReviews >= 25 ? 'moderate' : 'low';

    workloadForecast.push({
      dayOffset: offset,
      date: dateStr,
      label: offset === 0 ? 'Hôm nay' : `+${offset}d`,
      dueReviews,
      estimatedMinutes,
      burnoutRisk,
    });
  }

  const avgDailyWorkload =
    workloadForecast.reduce((s, d) => s + d.dueReviews, 0) / 7;
  let recommendedNewCardsPerDay = 15;
  let workloadGuidance =
    'Tải ôn tập nhẹ (~<20 thẻ/ngày). Có thể nạp thêm 15 thẻ mới mỗi ngày.';

  if (avgDailyWorkload >= 45) {
    recommendedNewCardsPerDay = 0;
    workloadGuidance =
      'Cảnh báo quá tải ôn tập! Nên tạm dừng nạp thẻ mới và giải phóng tồn đọng hiện tại.';
  } else if (avgDailyWorkload >= 25) {
    recommendedNewCardsPerDay = 5;
    workloadGuidance =
      'Khối lượng ôn tập trung bình-cao. Giới hạn tối đa 5 thẻ mới/ngày để giữ tỷ lệ nhớ >85%.';
  } else if (avgDailyWorkload >= 12) {
    recommendedNewCardsPerDay = 10;
    workloadGuidance =
      'Nhịp độ ôn tập cân bằng. Phù hợp nạp thêm 10 thẻ mới mỗi ngày.';
  }

  const leechCards = filteredCards
    .filter((c) => c.isLeech)
    .sort((a, b) => b.lapses - a.lapses || a.retrievability - b.retrievability);

  return {
    hskFilter,
    totalTrackedCards: filteredCards.length,
    averageStabilityDays: avgStability,
    averageRetrievability: avgRetrievability,
    leechCount: leechCards.length,
    forgettingCurve,
    maturityDistribution: {
      hskLevel: hskFilter,
      total: totalMaturity,
      counts,
    },
    workloadForecast,
    recommendedNewCardsPerDay,
    workloadGuidance,
    leechCards,
  };
}

/**
 * Build SRS Retention Analytics Snapshot from user storage.
 */
export function buildSrsRetentionSnapshot(params: {
  user?: { id?: string | null } | null;
  hskFilter?: number | 'all';
} = {}): SrsRetentionSnapshot {
  const user = params.user ?? null;
  const cards = hydrateLegacySrsCards(user);
  const logs = getStoredRetentionLogs(user);

  return computeSrsRetentionSnapshot({
    cards,
    logs,
    hskFilter: params.hskFilter ?? 'all',
  });
}

