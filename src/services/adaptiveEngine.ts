/**
 * =========================================================================
 * HANZIGO — ADAPTIVE LEARNING ENGINE (TASK 26.04)
 * =========================================================================
 * Deterministic + heuristic personalization engine combining:
 *   - Task 26.01: Real-time telemetry & user_mistake_records
 *   - Task 26.02: Multi-skill gaps vs target HSK benchmark
 *   - Task 26.03: SRS Retrievability (R) & Leech detection
 *
 * Priority Formula:
 *   PriorityScore(i) = w1*(1 - R_i) + w2*ErrorWeight_i + w3*SkillGap_i + w4*ExamProximity_i
 *
 * Dynamic Difficulty Adjustment (DDA):
 *   Targets Zone of Proximal Development (75% - 85% rolling 10-item accuracy).
 * =========================================================================
 */

import {
  getLocalMistakeRecords,
  getPendingLearningEvents,
  type ErrorCategory,
  type NormalizedLearningEvent,
  type UserMistakeRecord,
} from './learningDataService.ts';
import {
  computeStudentAnalyticsSnapshot,
  mapErrorCategoryToAction,
  type StudentAnalyticsSnapshot,
} from '../features/analytics/studentAnalyticsService.ts';
import {
  buildSrsRetentionSnapshot,
  type SrsRetentionCard,
  type SrsRetentionSnapshot,
} from './srsRetentionService.ts';

export interface PriorityWeights {
  w1Decay: number;
  w2Error: number;
  w3SkillGap: number;
  w4ExamProximity: number;
}

export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  w1Decay: 0.35,
  w2Error: 0.30,
  w3SkillGap: 0.25,
  w4ExamProximity: 0.10,
};

export interface PriorityInputs {
  retrievability: number; // 0..1
  errorWeight: number; // 0..1
  skillGap: number; // 0..1
  examProximity: number; // 0..1
}

export interface PriorityScoreResult {
  score: number; // 0..100
  components: {
    decayUrgency: number; // 1 - R
    errorWeight: number;
    skillGap: number;
    examProximity: number;
  };
}

export type DifficultyTier = 'supportive' | 'optimal_zpd' | 'challenge';

export interface DynamicDifficultyProfile {
  tier: DifficultyTier;
  label: string;
  rollingAccuracy: number | null; // 0..100 or null if no events
  sampleSize: number;
  distractorSimilarity: 'low' | 'medium' | 'high';
  audioSpeed: number; // e.g., 0.85, 1.0, 1.15
  audioReplayLimit: number; // e.g., 3, 2, 1
  timePressureMultiplier: number; // e.g., 1.25, 1.0, 0.85
  guidance: string;
}

export type QuestBlockType = 'srs_leech' | 'mistake_repair' | 'weak_skill_drill';

export interface AdaptiveQuestItem {
  id: string;
  blockType: QuestBlockType;
  stepLabel: string;
  estimatedMinutes: number;
  title: string;
  subtitle: string;
  skillDomain: string;
  hskLevel: number;
  priorityScore: number; // 0..100
  scoreBreakdown: PriorityScoreResult['components'];
  whyRecommended: string;
  targetTab: string;
  targetRef: string;
  source: string;
}

export interface DailyAdaptivePlanSnapshot {
  hskLevel: number;
  totalMinutes: number;
  examProximityScore: number;
  difficultyProfile: DynamicDifficultyProfile;
  quests: AdaptiveQuestItem[];
  allRankedCandidates: AdaptiveQuestItem[];
}

function clamp01(val: number): number {
  if (!Number.isFinite(val)) return 0;
  return Math.min(1, Math.max(0, val));
}

/**
 * Compute PriorityScore(i) = w1*(1 - R_i) + w2*ErrorWeight_i + w3*SkillGap_i + w4*ExamProximity_i
 * Scaled to 0..100 for deterministic ranking and UI display.
 */
export function computePriorityScore(
  inputs: PriorityInputs,
  weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS
): PriorityScoreResult {
  const decayUrgency = clamp01(1 - clamp01(inputs.retrievability));
  const errorWeight = clamp01(inputs.errorWeight);
  const skillGap = clamp01(inputs.skillGap);
  const examProximity = clamp01(inputs.examProximity);

  const weighted =
    weights.w1Decay * decayUrgency +
    weights.w2Error * errorWeight +
    weights.w3SkillGap * skillGap +
    weights.w4ExamProximity * examProximity;

  const weightSum =
    weights.w1Decay + weights.w2Error + weights.w3SkillGap + weights.w4ExamProximity;
  const normalized = weightSum > 0 ? weighted / weightSum : weighted;

  return {
    score: Math.round(normalized * 1000) / 10,
    components: {
      decayUrgency: Math.round(decayUrgency * 100) / 100,
      errorWeight: Math.round(errorWeight * 100) / 100,
      skillGap: Math.round(skillGap * 100) / 100,
      examProximity: Math.round(examProximity * 100) / 100,
    },
  };
}

/**
 * Compute ExamProximity (0..1) from target exam date.
 */
export function computeExamProximity(
  targetExamDate?: string | null,
  nowMs: number = Date.now()
): number {
  if (!targetExamDate) return 0.25;
  const targetMs = new Date(targetExamDate).getTime();
  if (Number.isNaN(targetMs)) return 0.25;
  const daysLeft = (targetMs - nowMs) / 86400000;
  if (daysLeft <= 7) return 1.0;
  if (daysLeft <= 14) return 0.85;
  if (daysLeft <= 30) return 0.65;
  if (daysLeft <= 60) return 0.45;
  return 0.25;
}

/**
 * Dynamic Difficulty Adjustment (DDA):
 * Scales distractor similarity, audio speed/replay limit, and time pressure
 * based on rolling 10-item accuracy targeting 75%-85% Zone of Proximal Development.
 */
export function computeDynamicDifficulty(
  recentEvents: NormalizedLearningEvent[]
): DynamicDifficultyProfile {
  const window = recentEvents.slice(-10);
  const sampleSize = window.length;

  if (sampleSize === 0) {
    return {
      tier: 'optimal_zpd',
      label: 'Chuẩn ZPD (75%–85%)',
      rollingAccuracy: null,
      sampleSize: 0,
      distractorSimilarity: 'medium',
      audioSpeed: 1.0,
      audioReplayLimit: 2,
      timePressureMultiplier: 1.0,
      guidance:
        'Chưa có dữ liệu 10 lượt gần nhất. Áp dụng độ khó chuẩn HSK để hiệu chỉnh ZPD.',
    };
  }

  const correctCount = window.filter((e) => e.is_correct).length;
  const rollingAccuracy = Math.round((correctCount / sampleSize) * 1000) / 10;

  if (sampleSize >= 3 && rollingAccuracy > 85) {
    return {
      tier: 'challenge',
      label: 'Tăng thử thách (>85%)',
      rollingAccuracy,
      sampleSize,
      distractorSimilarity: 'high',
      audioSpeed: 1.15,
      audioReplayLimit: 1,
      timePressureMultiplier: 0.85,
      guidance: `Độ chính xác ${rollingAccuracy}% vượt ngưỡng 85%. Tăng độ tương đồng đáp án nhiễu, tốc độ nghe 1.15x và giới hạn 1 lần nghe.`,
    };
  }

  if (sampleSize >= 3 && rollingAccuracy < 75) {
    return {
      tier: 'supportive',
      label: 'Hỗ trợ củng cố (<75%)',
      rollingAccuracy,
      sampleSize,
      distractorSimilarity: 'low',
      audioSpeed: 0.85,
      audioReplayLimit: 3,
      timePressureMultiplier: 1.25,
      guidance: `Độ chính xác ${rollingAccuracy}% dưới vùng ZPD 75%. Giảm tốc độ nghe 0.85x, tăng lên 3 lần nghe lại và nới thời gian +25%.`,
    };
  }

  return {
    tier: 'optimal_zpd',
    label: 'Tối ưu ZPD (75%–85%)',
    rollingAccuracy,
    sampleSize,
    distractorSimilarity: 'medium',
    audioSpeed: 1.0,
    audioReplayLimit: 2,
    timePressureMultiplier: 1.0,
    guidance: `Độ chính xác ${rollingAccuracy}% nằm đúng vùng phát triển gần (ZPD 75%–85%). Duy trì nhịp độ thử thách hiện tại.`,
  };
}

function mapErrorCategoryToSkillKey(
  category: ErrorCategory
): 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar' | 'stroke_order' {
  switch (category) {
    case 'radical_stroke_error':
      return 'stroke_order';
    case 'tone_confusion':
    case 'listening_homophone':
      return 'listening';
    case 'word_order_syntax':
      return 'grammar';
    case 'translation_omission':
      return 'writing';
    case 'synonym_nuance':
      return 'vocabulary';
    case 'reading_inference':
    default:
      return 'reading';
  }
}

function getSkillGapNormalized(
  analytics: StudentAnalyticsSnapshot,
  skillKey: string
): number {
  const axis = analytics.skillRadar.find((s) => s.skillKey === skillKey);
  if (!axis) return 0.4;
  // If user has 0 attempts in a skill while having mistakes/activity elsewhere, treat as gap
  if (axis.attemptsCount === 0 && !analytics.isEmpty) {
    return 0.7;
  }
  if (axis.targetBenchmark <= 0) return 0;
  return clamp01((axis.targetBenchmark - axis.proficiency) / axis.targetBenchmark);
}

/**
 * Pure deterministic generator for Today's Smart Session & Priority Ranking.
 */
export function buildDailyAdaptivePlan(params: {
  hskLevel?: number;
  targetExamDate?: string | null;
  recentEvents?: NormalizedLearningEvent[];
  mistakeRecords?: UserMistakeRecord[];
  analyticsSnapshot: StudentAnalyticsSnapshot;
  srsSnapshot: SrsRetentionSnapshot;
  nowMs?: number;
}): DailyAdaptivePlanSnapshot {
  const hskLevel = params.hskLevel ?? params.analyticsSnapshot.hskLevel ?? 1;
  const recentEvents = params.recentEvents ?? [];
  const mistakeRecords = params.mistakeRecords ?? [];
  const analytics = params.analyticsSnapshot;
  const srs = params.srsSnapshot;
  const examProximityScore = computeExamProximity(
    params.targetExamDate,
    params.nowMs
  );
  const difficultyProfile = computeDynamicDifficulty(recentEvents);

  const candidates: AdaptiveQuestItem[] = [];
  const maxMistakeOcc = Math.max(
    1,
    ...mistakeRecords
      .filter((m) => m.resolved_status !== 'mastered')
      .map((m) => m.occurrence_count || 1)
  );

  // 1. Candidate Group A: Urgent SRS Leech & Decaying Cards
  const srsCardsPool: SrsRetentionCard[] = [...srs.leechCards];
  srsCardsPool.slice(0, 5).forEach((card, idx) => {
    const r = card.retrievability;
    const decayPct = Math.round((1 - r) * 100);
    const vocabGap = getSkillGapNormalized(analytics, 'vocabulary');
    const errorWeight = clamp01(card.lapses / 6);

    const priority = computePriorityScore({
      retrievability: r,
      errorWeight,
      skillGap: vocabGap,
      examProximity: examProximityScore,
    });

    candidates.push({
      id: `quest_srs_${card.cardId}_${idx}`,
      blockType: 'srs_leech',
      stepLabel: 'Bước 1 · 10 phút',
      estimatedMinutes: 10,
      title: `Khắc phục thẻ Leech: "${card.hanzi}" (${card.pinyin})`,
      subtitle: card.meaning || `HSK ${card.hskLevel} · ${card.lapses} lần quên`,
      skillDomain: 'vocabulary',
      hskLevel: card.hskLevel || hskLevel,
      priorityScore: priority.score,
      scoreBreakdown: priority.components,
      whyRecommended: `Đề xuất vì khả năng nhớ R=${Math.round(r * 100)}% (suy giảm ${decayPct}%) và đã quên ${card.lapses} lần.`,
      targetTab: 'vocabulary',
      targetRef: card.cardId,
      source: 'srs_leech',
    });
  });

  // 2. Candidate Group B: Unresolved Mistake Records (Grammar, Stroke, Tone, Translation, etc.)
  const unresolvedByCategory = new Map<
    ErrorCategory,
    { count: number; totalOcc: number; latestEntity: string; level: number }
  >();

  for (const rec of mistakeRecords) {
    if (rec.resolved_status === 'mastered') continue;
    const prev = unresolvedByCategory.get(rec.error_category) ?? {
      count: 0,
      totalOcc: 0,
      latestEntity: rec.target_entity_id,
      level: rec.hsk_level || hskLevel,
    };
    unresolvedByCategory.set(rec.error_category, {
      count: prev.count + 1,
      totalOcc: prev.totalOcc + (rec.occurrence_count || 1),
      latestEntity: prev.latestEntity || rec.target_entity_id,
      level: rec.hsk_level || prev.level,
    });
  }

  unresolvedByCategory.forEach((agg, category) => {
    const action = mapErrorCategoryToAction(category);
    const skillKey = mapErrorCategoryToSkillKey(category);
    const skillGap = getSkillGapNormalized(analytics, skillKey);
    const errorWeight = clamp01(agg.totalOcc / Math.max(3, maxMistakeOcc));

    const priority = computePriorityScore({
      retrievability: 0.45, // active mistake implies incomplete retention
      errorWeight,
      skillGap,
      examProximity: examProximityScore,
    });

    const gapPct = Math.round(skillGap * 100);
    candidates.push({
      id: `quest_err_${category}`,
      blockType: 'mistake_repair',
      stepLabel: 'Bước 2 · 8 phút',
      estimatedMinutes: 8,
      title: `Vá lỗi: ${action.label}`,
      subtitle: `${agg.totalOcc} lượt sai chưa khắc phục (${agg.count} mục) · Mục tiêu: ${agg.latestEntity}`,
      skillDomain: skillKey,
      hskLevel: agg.level,
      priorityScore: priority.score,
      scoreBreakdown: priority.components,
      whyRecommended: `Đề xuất vì có ${agg.totalOcc} lỗi "${action.label}" chưa nắm${gapPct > 0 ? ` và kỹ năng còn thiếu ${gapPct}% so với chuẩn HSK ${hskLevel}` : ''}.`,
      targetTab: action.recommendedTab,
      targetRef: agg.latestEntity,
      source: category,
    });
  });

  // 3. Candidate Group C: Weakest Skill Domain Drills (Writing / Stroke / Listening / Reading / Grammar)
  analytics.skillRadar.forEach((axis) => {
    const gap = getSkillGapNormalized(analytics, axis.skillKey);
    if (gap <= 0 && axis.attemptsCount > 0) return;

    const matchingErrors = analytics.errorPatterns.filter(
      (ep) => mapErrorCategoryToSkillKey(ep.errorCategory) === axis.skillKey
    );
    const errWeight =
      matchingErrors.length > 0
        ? clamp01(
            matchingErrors.reduce((s, e) => s + e.totalOccurrences, 0) /
              Math.max(4, maxMistakeOcc)
          )
        : 0.1;

    const priority = computePriorityScore({
      retrievability: axis.attemptsCount > 0 ? axis.proficiency / 100 : 0.65,
      errorWeight: errWeight,
      skillGap: gap,
      examProximity: examProximityScore,
    });

    const tabBySkill: Record<string, string> = {
      listening: 'practice',
      reading: 'hsk-practice',
      writing: 'writing',
      vocabulary: 'vocabulary',
      grammar: 'practice',
      stroke_order: 'writing',
    };

    const deficitPts = Math.max(0, Math.round(axis.targetBenchmark - axis.proficiency));
    candidates.push({
      id: `quest_skill_${axis.skillKey}`,
      blockType: 'weak_skill_drill',
      stepLabel: 'Bước 3 · 7 phút',
      estimatedMinutes: 7,
      title: `Luyện tăng tốc: ${axis.skillLabel}`,
      subtitle: `Độ khó ${difficultyProfile.label} · ${axis.proficiency}% / ${axis.targetBenchmark}%`,
      skillDomain: axis.skillKey,
      hskLevel,
      priorityScore: priority.score,
      scoreBreakdown: priority.components,
      whyRecommended:
        axis.attemptsCount === 0
          ? `Đề xuất vì kỹ năng ${axis.skillLabel} chưa có dữ liệu đo lường ở HSK ${hskLevel}.`
          : `Đề xuất vì ${axis.skillLabel} đang thấp hơn chuẩn HSK ${hskLevel} ${deficitPts} điểm (${axis.proficiency}% vs ${axis.targetBenchmark}%).`,
      targetTab: tabBySkill[axis.skillKey] ?? 'hsk-practice',
      targetRef: axis.skillKey,
      source: axis.skillKey,
    });
  });

  // Deterministic sort: highest PriorityScore first, then title tie-breaker
  const allRankedCandidates = [...candidates].sort(
    (a, b) => b.priorityScore - a.priorityScore || a.title.localeCompare(b.title)
  );

  // Build structured 25-minute micro-plan: pick top from each block if available, else top 3 overall
  const selected: AdaptiveQuestItem[] = [];
  const usedIds = new Set<string>();

  const pickBestForBlock = (
    block: QuestBlockType,
    stepLabel: string,
    minutes: number
  ) => {
    const found = allRankedCandidates.find(
      (c) => c.blockType === block && !usedIds.has(c.id)
    );
    if (found) {
      usedIds.add(found.id);
      selected.push({ ...found, stepLabel, estimatedMinutes: minutes });
    }
  };

  pickBestForBlock('srs_leech', 'Bước 1 · 10 phút', 10);
  pickBestForBlock('mistake_repair', 'Bước 2 · 8 phút', 8);
  pickBestForBlock('weak_skill_drill', 'Bước 3 · 7 phút', 7);

  // Fill up to 3 quests if any block had no items
  const fallbackDurations = [10, 8, 7];
  for (const cand of allRankedCandidates) {
    if (selected.length >= 3) break;
    if (usedIds.has(cand.id)) continue;
    const idx = selected.length;
    const mins = fallbackDurations[idx] ?? 7;
    usedIds.add(cand.id);
    selected.push({
      ...cand,
      stepLabel: `Bước ${idx + 1} · ${mins} phút`,
      estimatedMinutes: mins,
    });
  }

  const totalMinutes = selected.reduce((s, q) => s + q.estimatedMinutes, 0);

  return {
    hskLevel,
    totalMinutes,
    examProximityScore,
    difficultyProfile,
    quests: selected,
    allRankedCandidates,
  };
}

/**
 * Convenience loader gathering live telemetry (26.01), analytics (26.02), and SRS (26.03).
 */
export function loadDailyAdaptivePlan(params: {
  user?: { id?: string | null; hskLevel?: number | string } | null;
  hskLevel?: number;
  targetExamDate?: string | null;
} = {}): DailyAdaptivePlanSnapshot {
  const user = params.user ?? null;
  const userId = user?.id ?? null;
  const hskLevel = params.hskLevel ?? 1;

  const recentEvents = getPendingLearningEvents().filter(
    (ev) => !userId || ev.user_id === userId || ev.user_id === null
  );
  const mistakeRecords = getLocalMistakeRecords(userId ?? undefined);
  const analyticsSnapshot = computeStudentAnalyticsSnapshot({
    hskLevel,
    daysWindow: 90,
    localEvents: recentEvents,
    localMistakes: mistakeRecords,
    examAttempts: [],
  });
  const srsSnapshot = buildSrsRetentionSnapshot({ user, hskFilter: 'all' });

  return buildDailyAdaptivePlan({
    hskLevel,
    targetExamDate: params.targetExamDate,
    recentEvents,
    mistakeRecords,
    analyticsSnapshot,
    srsSnapshot,
  });
}

