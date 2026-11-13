/**
 * =========================================================================
 * HANZIGO — STUDENT ANALYTICS SERVICE & MEMOIZED SELECTORS (TASK 26.02)
 * =========================================================================
 * Consumes standardized telemetry & mistake records from Task 26.01
 * (Supabase RPCs + offline local telemetry fallback + CBT exam history).
 * Zero-Fabrication: Only derives metrics from real user learning records.
 * =========================================================================
 */

import { supabase, isSupabaseConfigured } from '../../supabase/config.js';
import { isValidUuid } from '../../services/authService.js';
import {
  getPendingLearningEvents,
  getLocalMistakeRecords,
  type ErrorCategory,
  type NormalizedLearningEvent,
  type UserMistakeRecord,
} from '../../services/learningDataService.ts';
import { getPastAttempts } from '../../services/hskService.js';

export interface SkillRadarAxis {
  skillKey: 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar' | 'stroke_order';
  skillLabel: string;
  proficiency: number; // 0..100
  targetBenchmark: number; // 0..100
  attemptsCount: number;
  lastPracticedAt: string | null;
}

export interface ActivityHeatmapDay {
  date: string; // YYYY-MM-DD
  totalDurationMs: number;
  studyMinutes: number;
  itemsReviewed: number;
  correctCount: number;
  accuracyRate: number; // 0..100
}

export interface ErrorPatternItem {
  errorCategory: ErrorCategory;
  label: string;
  totalOccurrences: number;
  activeCount: number;
  reviewingCount: number;
  masteredCount: number;
  resolutionRate: number; // 0..100
  lastMistakeAt: string | null;
  recommendedTab: string;
  recommendedSkill: string;
}

export interface CbtProgressPoint {
  id: string;
  date: string;
  label: string;
  hskLevel: number;
  rawScore: number;
  maxScore: 200 | 300;
  normalizedPercent: number; // 0..100
  studyMinutesOnDay: number;
}

export interface StudentAnalyticsKpis {
  totalStudyHours: number;
  activeStreakDays: number;
  hskReadinessScore: number; // 0..100 pass probability
  activeMistakesCount: number;
  totalEventsCount: number;
}

export interface StudentAnalyticsSnapshot {
  hskLevel: number;
  daysWindow: 90 | 180;
  isEmpty: boolean;
  kpis: StudentAnalyticsKpis;
  skillRadar: SkillRadarAxis[];
  heatmap: ActivityHeatmapDay[];
  errorPatterns: ErrorPatternItem[];
  cbtProgress: CbtProgressPoint[];
}

export const CANONICAL_RADAR_SKILLS: Array<{
  skillKey: SkillRadarAxis['skillKey'];
  skillLabel: string;
}> = [
  { skillKey: 'listening', skillLabel: 'Nghe hiểu' },
  { skillKey: 'reading', skillLabel: 'Đọc hiểu' },
  { skillKey: 'writing', skillLabel: 'Viết & Dịch' },
  { skillKey: 'vocabulary', skillLabel: 'Từ vựng' },
  { skillKey: 'grammar', skillLabel: 'Ngữ pháp' },
  { skillKey: 'stroke_order', skillLabel: 'Nét chữ Hán' },
];

const ERROR_CATEGORY_META: Record<
  ErrorCategory,
  { label: string; recommendedTab: string; recommendedSkill: string }
> = {
  tone_confusion: {
    label: 'Nhầm thanh điệu (Tone)',
    recommendedTab: 'pronunciation',
    recommendedSkill: 'pronunciation',
  },
  radical_stroke_error: {
    label: 'Sai bộ thủ / thứ tự nét',
    recommendedTab: 'writing',
    recommendedSkill: 'writing',
  },
  synonym_nuance: {
    label: 'Nhầm nghĩa / từ gần nghĩa',
    recommendedTab: 'vocabulary',
    recommendedSkill: 'vocabulary',
  },
  word_order_syntax: {
    label: 'Sai trật tự từ / ngữ pháp',
    recommendedTab: 'practice',
    recommendedSkill: 'grammar',
  },
  listening_homophone: {
    label: 'Nhầm từ đồng âm khi nghe',
    recommendedTab: 'practice',
    recommendedSkill: 'listening',
  },
  reading_inference: {
    label: 'Suy luận đọc hiểu',
    recommendedTab: 'hsk-practice',
    recommendedSkill: 'reading',
  },
  translation_omission: {
    label: 'Thiếu ý khi dịch / viết',
    recommendedTab: 'practice',
    recommendedSkill: 'writing',
  },
};

export function getTargetBenchmarkForLevel(hskLevel: number): number {
  if (hskLevel <= 2) return 75;
  if (hskLevel <= 4) return 80;
  return 85;
}

export function mapErrorCategoryToAction(category: ErrorCategory): {
  label: string;
  recommendedTab: string;
  recommendedSkill: string;
} {
  return (
    ERROR_CATEGORY_META[category] ?? {
      label: category,
      recommendedTab: 'practice',
      recommendedSkill: 'grammar',
    }
  );
}

function normalizeSkillKey(
  skillDomain: string
): SkillRadarAxis['skillKey'] {
  if (skillDomain === 'writing' || skillDomain === 'translation') return 'writing';
  if (skillDomain === 'speaking') return 'listening';
  if (
    skillDomain === 'listening' ||
    skillDomain === 'reading' ||
    skillDomain === 'vocabulary' ||
    skillDomain === 'grammar' ||
    skillDomain === 'stroke_order'
  ) {
    return skillDomain;
  }
  return 'reading';
}

function toUtcDateKey(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

function buildDateRangeKeys(days: number): string[] {
  const keys: string[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

function computeStreakFromHeatmap(
  heatmap: ActivityHeatmapDay[],
  fallbackStreak = 0
): number {
  let streak = 0;
  for (let i = heatmap.length - 1; i >= 0; i -= 1) {
    const day = heatmap[i];
    const hasActivity = day.itemsReviewed > 0 || day.totalDurationMs > 0;
    if (hasActivity) {
      streak += 1;
    } else if (i < heatmap.length - 1) {
      // Allow today to still be empty if yesterday was active
      break;
    }
  }
  return Math.max(streak, fallbackStreak || 0);
}

export function calculateHskReadinessScore(
  skillRadar: SkillRadarAxis[],
  cbtProgress: CbtProgressPoint[],
  hskLevel: number
): number {
  const activeAxes = skillRadar.filter((s) => s.attemptsCount > 0);
  const levelExams = cbtProgress.filter((e) => e.hskLevel === hskLevel);
  const referenceExams = levelExams.length > 0 ? levelExams : cbtProgress;

  if (activeAxes.length === 0 && referenceExams.length === 0) {
    return 0;
  }

  const benchmark = getTargetBenchmarkForLevel(hskLevel);
  const radarAvg =
    activeAxes.length > 0
      ? activeAxes.reduce((sum, s) => sum + s.proficiency, 0) / activeAxes.length
      : 0;

  const latestExamPct =
    referenceExams.length > 0
      ? referenceExams[referenceExams.length - 1].normalizedPercent
      : 0;

  // Weighted pass probability: 60% multi-skill radar vs target benchmark, 40% latest CBT mock exam
  let rawReadiness = 0;
  if (activeAxes.length > 0 && referenceExams.length > 0) {
    rawReadiness = (radarAvg / benchmark) * 60 + (latestExamPct / 60) * 40;
  } else if (activeAxes.length > 0) {
    rawReadiness = (radarAvg / benchmark) * 85;
  } else {
    rawReadiness = (latestExamPct / 60) * 80;
  }

  return Math.min(99, Math.max(0, Math.round(rawReadiness)));
}

export interface RawAnalyticsInputs {
  hskLevel: number;
  daysWindow: 90 | 180;
  streakHint?: number;
  rpcRadar?: Array<{
    skill_key: string;
    skill_label?: string;
    proficiency: number | string;
    target_benchmark?: number | string;
    attempts_count?: number | string;
    last_practiced_at?: string | null;
  }> | null;
  rpcHeatmap?: Array<{
    activity_date: string;
    total_duration_ms: number | string;
    items_reviewed: number | string;
    correct_count: number | string;
    accuracy_rate: number | string;
  }> | null;
  rpcErrors?: Array<{
    error_category: ErrorCategory;
    total_occurrences: number | string;
    active_count: number | string;
    reviewing_count: number | string;
    mastered_count: number | string;
    resolution_rate: number | string;
    last_mistake_at?: string | null;
  }> | null;
  localEvents?: NormalizedLearningEvent[];
  localMistakes?: UserMistakeRecord[];
  examAttempts?: Array<{
    id?: string;
    examId?: string;
    title?: string;
    examTitle?: string;
    level?: number | string;
    hskLevel?: number;
    score?: number;
    totalPoints?: number;
    maxScore?: number;
    percentage?: number;
    timeSpent?: number;
    submittedAt?: string;
    createdAt?: string;
  }>;
}

/**
 * Pure deterministic selector that builds the complete StudentAnalyticsSnapshot
 * from RPC outputs, local offline telemetry, mistake records, and CBT attempts.
 */
export function computeStudentAnalyticsSnapshot(
  inputs: RawAnalyticsInputs
): StudentAnalyticsSnapshot {
  const hskLevel = Math.min(9, Math.max(1, Math.round(inputs.hskLevel || 1)));
  const daysWindow: 90 | 180 = inputs.daysWindow === 180 ? 180 : 90;
  const benchmark = getTargetBenchmarkForLevel(hskLevel);
  const localEvents = inputs.localEvents ?? [];
  const localMistakes = inputs.localMistakes ?? [];
  const examAttempts = inputs.examAttempts ?? [];

  // 1. Build Skill Radar (prefer RPC when populated, overlay/fallback with localEvents)
  const localSkillBuckets = new Map<
    SkillRadarAxis['skillKey'],
    { sum: number; count: number; lastAt: string | null }
  >();

  for (const ev of localEvents) {
    if (ev.hsk_level !== hskLevel) continue;
    const key = normalizeSkillKey(ev.skill_domain);
    const pct =
      ev.score_max > 0
        ? Math.min(100, Math.max(0, (ev.score_earned / ev.score_max) * 100))
        : ev.is_correct
        ? 100
        : 0;
    const prev = localSkillBuckets.get(key) ?? { sum: 0, count: 0, lastAt: null };
    localSkillBuckets.set(key, {
      sum: prev.sum + pct,
      count: prev.count + 1,
      lastAt:
        !prev.lastAt || ev.created_at > prev.lastAt ? ev.created_at : prev.lastAt,
    });
  }

  const rpcRadarMap = new Map(
    (inputs.rpcRadar ?? []).map((r) => [r.skill_key, r])
  );

  const skillRadar: SkillRadarAxis[] = CANONICAL_RADAR_SKILLS.map((canon) => {
    const rpcRow = rpcRadarMap.get(canon.skillKey);
    const localBucket = localSkillBuckets.get(canon.skillKey);
    const rpcCount = Number(rpcRow?.attempts_count ?? 0);
    const rpcProf = Number(rpcRow?.proficiency ?? 0);

    let proficiency = rpcProf;
    let attemptsCount = rpcCount;
    let lastPracticedAt = rpcRow?.last_practiced_at ?? null;

    if (localBucket && localBucket.count > 0) {
      const totalCount = rpcCount + localBucket.count;
      const weightedSum = rpcProf * rpcCount + localBucket.sum;
      proficiency = Math.round((weightedSum / totalCount) * 10) / 10;
      attemptsCount = totalCount;
      if (!lastPracticedAt || (localBucket.lastAt && localBucket.lastAt > lastPracticedAt)) {
        lastPracticedAt = localBucket.lastAt;
      }
    }

    return {
      skillKey: canon.skillKey,
      skillLabel: canon.skillLabel,
      proficiency: Math.min(100, Math.max(0, Number(proficiency.toFixed(1)))),
      targetBenchmark: Number(rpcRow?.target_benchmark ?? benchmark),
      attemptsCount,
      lastPracticedAt,
    };
  });

  // 2. Build Study Activity Heatmap (90 / 180 days)
  const dateKeys = buildDateRangeKeys(daysWindow);
  const heatmapMap = new Map<string, ActivityHeatmapDay>();
  for (const date of dateKeys) {
    heatmapMap.set(date, {
      date,
      totalDurationMs: 0,
      studyMinutes: 0,
      itemsReviewed: 0,
      correctCount: 0,
      accuracyRate: 0,
    });
  }

  for (const row of inputs.rpcHeatmap ?? []) {
    const dateKey = String(row.activity_date).slice(0, 10);
    const existing = heatmapMap.get(dateKey);
    if (!existing) continue;
    const dur = Number(row.total_duration_ms ?? 0);
    const items = Number(row.items_reviewed ?? 0);
    const ok = Number(row.correct_count ?? 0);
    existing.totalDurationMs += dur;
    existing.itemsReviewed += items;
    existing.correctCount += ok;
  }

  for (const ev of localEvents) {
    const dateKey = toUtcDateKey(ev.created_at);
    const existing = heatmapMap.get(dateKey);
    if (!existing) continue;
    existing.totalDurationMs += Math.max(0, ev.duration_ms || 0);
    existing.itemsReviewed += 1;
    if (ev.is_correct) existing.correctCount += 1;
  }

  const heatmap: ActivityHeatmapDay[] = dateKeys.map((k) => {
    const day = heatmapMap.get(k)!;
    return {
      ...day,
      studyMinutes: Math.round((day.totalDurationMs / 60000) * 10) / 10,
      accuracyRate:
        day.itemsReviewed > 0
          ? Math.round((day.correctCount / day.itemsReviewed) * 1000) / 10
          : 0,
    };
  });

  // 3. Build Top Error Patterns
  const errorMap = new Map<ErrorCategory, ErrorPatternItem>();

  for (const row of inputs.rpcErrors ?? []) {
    const meta = mapErrorCategoryToAction(row.error_category);
    errorMap.set(row.error_category, {
      errorCategory: row.error_category,
      label: meta.label,
      totalOccurrences: Number(row.total_occurrences ?? 0),
      activeCount: Number(row.active_count ?? 0),
      reviewingCount: Number(row.reviewing_count ?? 0),
      masteredCount: Number(row.mastered_count ?? 0),
      resolutionRate: Number(row.resolution_rate ?? 0),
      lastMistakeAt: row.last_mistake_at ?? null,
      recommendedTab: meta.recommendedTab,
      recommendedSkill: meta.recommendedSkill,
    });
  }

  for (const rec of localMistakes) {
    const meta = mapErrorCategoryToAction(rec.error_category);
    const existing = errorMap.get(rec.error_category) ?? {
      errorCategory: rec.error_category,
      label: meta.label,
      totalOccurrences: 0,
      activeCount: 0,
      reviewingCount: 0,
      masteredCount: 0,
      resolutionRate: 0,
      lastMistakeAt: null,
      recommendedTab: meta.recommendedTab,
      recommendedSkill: meta.recommendedSkill,
    };

    existing.totalOccurrences += rec.occurrence_count || 1;
    if (rec.resolved_status === 'active') existing.activeCount += 1;
    else if (rec.resolved_status === 'reviewing') existing.reviewingCount += 1;
    else if (rec.resolved_status === 'mastered') existing.masteredCount += 1;

    const totalItems =
      existing.activeCount + existing.reviewingCount + existing.masteredCount;
    existing.resolutionRate =
      totalItems > 0
        ? Math.round((existing.masteredCount / totalItems) * 1000) / 10
        : 0;

    if (
      !existing.lastMistakeAt ||
      (rec.last_mistake_at && rec.last_mistake_at > existing.lastMistakeAt)
    ) {
      existing.lastMistakeAt = rec.last_mistake_at;
    }

    errorMap.set(rec.error_category, existing);
  }

  const errorPatterns = Array.from(errorMap.values()).sort(
    (a, b) =>
      b.activeCount - a.activeCount ||
      b.totalOccurrences - a.totalOccurrences
  );

  // 4. Build CBT Mock Exam Time-Series Progress (200/300 scales)
  const cbtProgress: CbtProgressPoint[] = [...examAttempts]
    .sort((a, b) => {
      const ta = new Date(a.submittedAt || a.createdAt || 0).getTime();
      const tb = new Date(b.submittedAt || b.createdAt || 0).getTime();
      return ta - tb;
    })
    .slice(-12)
    .map((att, idx) => {
      const lvl = Math.min(
        9,
        Math.max(
          1,
          Number(
            att.hskLevel ??
              (typeof att.level === 'string'
                ? parseInt(att.level.replace(/\D/g, ''), 10)
                : att.level)
          ) || hskLevel
        )
      );
      const maxScore: 200 | 300 =
        att.maxScore === 200 || att.totalPoints === 200
          ? 200
          : att.maxScore === 300 || att.totalPoints === 300
          ? 300
          : lvl <= 2
          ? 200
          : 300;
      const rawScore =
        typeof att.score === 'number'
          ? att.score
          : typeof att.percentage === 'number'
          ? Math.round((att.percentage / 100) * maxScore)
          : 0;
      const normalizedPercent =
        maxScore > 0 ? Math.min(100, Math.round((rawScore / maxScore) * 100)) : 0;
      const dateStr = toUtcDateKey(att.submittedAt || att.createdAt || new Date());
      const dayEntry = heatmapMap.get(dateStr);

      return {
        id: att.id || att.examId || `cbt_${idx}`,
        date: dateStr,
        label: att.examTitle || att.title || `HSK ${lvl} #${idx + 1}`,
        hskLevel: lvl,
        rawScore,
        maxScore,
        normalizedPercent,
        studyMinutesOnDay: dayEntry
          ? Math.round((dayEntry.totalDurationMs / 60000) * 10) / 10
          : Math.round(((att.timeSpent || 0) / 60) * 10) / 10,
      };
    });

  // 5. KPI Summary Cards
  const totalHeatmapMs = heatmap.reduce((s, d) => s + d.totalDurationMs, 0);
  const totalExamSeconds = examAttempts.reduce(
    (s, a) => s + Math.max(0, Number(a.timeSpent ?? 0)),
    0
  );
  const totalStudyHours =
    Math.round(((totalHeatmapMs / 3600000) + totalExamSeconds / 3600) * 10) / 10;

  const activeStreakDays = computeStreakFromHeatmap(
    heatmap,
    inputs.streakHint ?? 0
  );
  const activeMistakesCount = errorPatterns.reduce(
    (s, e) => s + e.activeCount + e.reviewingCount,
    0
  );
  const totalEventsCount =
    heatmap.reduce((s, d) => s + d.itemsReviewed, 0) + examAttempts.length;

  const hskReadinessScore = calculateHskReadinessScore(
    skillRadar,
    cbtProgress,
    hskLevel
  );

  const isEmpty =
    totalEventsCount === 0 &&
    errorPatterns.length === 0 &&
    cbtProgress.length === 0;

  return {
    hskLevel,
    daysWindow,
    isEmpty,
    kpis: {
      totalStudyHours,
      activeStreakDays,
      hskReadinessScore,
      activeMistakesCount,
      totalEventsCount,
    },
    skillRadar,
    heatmap,
    errorPatterns,
    cbtProgress,
  };
}

/**
 * Fetch student analytics data from Supabase RPCs (with offline & guest fallback).
 */
export async function fetchStudentAnalyticsSnapshot(params: {
  user?: { id?: string | null } | null;
  hskLevel?: number;
  daysWindow?: 90 | 180;
  streakHint?: number;
}): Promise<StudentAnalyticsSnapshot> {
  const userId = params.user?.id ?? null;
  const hskLevel = params.hskLevel ?? 1;
  const daysWindow = params.daysWindow === 180 ? 180 : 90;

  let rpcRadar: RawAnalyticsInputs['rpcRadar'] = null;
  let rpcHeatmap: RawAnalyticsInputs['rpcHeatmap'] = null;
  let rpcErrors: RawAnalyticsInputs['rpcErrors'] = null;

  if (isSupabaseConfigured && supabase && userId && isValidUuid(userId)) {
    const [radarRes, heatmapRes, errorsRes] = await Promise.allSettled([
      supabase.rpc('get_student_skill_radar', {
        p_user_id: userId,
        p_hsk_level: hskLevel,
      }),
      supabase.rpc('get_study_activity_heatmap', {
        p_user_id: userId,
        p_days: daysWindow,
      }),
      supabase.rpc('get_top_error_patterns', {
        p_user_id: userId,
        p_limit: 7,
      }),
    ]);

    if (radarRes.status === 'fulfilled' && !radarRes.value.error) {
      rpcRadar = radarRes.value.data;
    }
    if (heatmapRes.status === 'fulfilled' && !heatmapRes.value.error) {
      rpcHeatmap = heatmapRes.value.data;
    }
    if (errorsRes.status === 'fulfilled' && !errorsRes.value.error) {
      rpcErrors = errorsRes.value.data;
    }
  }

  const localEvents = getPendingLearningEvents().filter(
    (ev) => !userId || ev.user_id === userId || ev.user_id === null
  );
  const localMistakes = getLocalMistakeRecords(userId ?? undefined);
  const examAttempts = getPastAttempts() ?? [];

  return computeStudentAnalyticsSnapshot({
    hskLevel,
    daysWindow,
    streakHint: params.streakHint,
    rpcRadar,
    rpcHeatmap,
    rpcErrors,
    localEvents,
    localMistakes,
    examAttempts,
  });
}

