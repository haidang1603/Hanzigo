/**
 * =========================================================================
 * HANZIGO — LEARNING INTELLIGENCE ORCHESTRATOR (TASK 26.08)
 * =========================================================================
 * Unifies Tasks 26.01 through 26.07 into a closed-loop ecosystem:
 *   Activity Completion (Lesson / SRS / Hanzi Writer / Writing / CBT Exam)
 *     -> Telemetry & Error Classification (26.01)
 *     -> SRS Retention & Leech Escalation (26.03)
 *     -> Student Analytics Radar & Heatmap Recalculation (26.02)
 *     -> Adaptive Engine "Today's Smart Session" & HSK 1-9 Remediation (26.04-26.07)
 * =========================================================================
 */

import {
  getLocalMistakeRecords,
  getPendingLearningEvents,
  recordLearningEvent,
  type LearningEventInput,
  type NormalizedLearningEvent,
  type UserMistakeRecord,
} from './learningDataService.ts';
import {
  computeStudentAnalyticsSnapshot,
  type StudentAnalyticsSnapshot,
} from '../features/analytics/studentAnalyticsService.ts';
import {
  buildSrsRetentionSnapshot,
  recordSrsRetentionReview,
  type ReviewRating,
  type SrsRetentionCard,
  type SrsRetentionSnapshot,
} from './srsRetentionService.ts';
import {
  buildDailyAdaptivePlan,
  type DailyAdaptivePlanSnapshot,
} from './adaptiveEngine.ts';
import { HSK_WRITING_PROMPTS } from './writingEvaluationService.ts';
import { HSK_7_9_MODULES } from '../data/hsk7to9CurriculumData.ts';
import { getPastAttempts } from './hskService.js';

export interface OrchestratedActivityInput extends LearningEventInput {
  user?: { id?: string | null; hskLevel?: number | string } | null;
  hanzi?: string;
  pinyin?: string;
  meaning?: string;
  reviewRating?: ReviewRating;
  confusedWith?: string | null;
  targetExamDate?: string | null;
}

export interface LearningIntelligenceState {
  hskLevel: number;
  analytics: StudentAnalyticsSnapshot;
  srs: SrsRetentionSnapshot;
  adaptivePlan: DailyAdaptivePlanSnapshot;
  remediationCatalogSummary: {
    writingPromptsCount: number;
    hsk7to9ModulesCount: number;
  };
}

export interface OrchestratedActivityResult {
  telemetryEvent: NormalizedLearningEvent;
  mistakeRecord: UserMistakeRecord | null;
  srsCard: SrsRetentionCard | null;
  intelligenceState: LearningIntelligenceState;
}

function resolveUserHskLevel(
  explicitLevel?: number | string,
  user?: { hskLevel?: number | string } | null
): number {
  const raw = explicitLevel ?? user?.hskLevel ?? 1;
  const parsed =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string'
      ? parseInt(raw.replace(/\D/g, ''), 10)
      : 1;
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 9 ? parsed : 1;
}

/**
 * Build unified Learning Intelligence snapshot across 26.01, 26.02, 26.03, and 26.04.
 */
export function getLearningIntelligenceState(params: {
  user?: { id?: string | null; hskLevel?: number | string } | null;
  hskLevel?: number | string;
  targetExamDate?: string | null;
  daysWindow?: 90 | 180;
} = {}): LearningIntelligenceState {
  const user = params.user ?? null;
  const userId = user?.id ?? null;
  const hskLevel = resolveUserHskLevel(params.hskLevel, user);

  const recentEvents = getPendingLearningEvents().filter(
    (ev) => !userId || ev.user_id === userId || ev.user_id === null
  );
  const mistakeRecords = getLocalMistakeRecords(userId ?? undefined);
  const examAttempts = getPastAttempts() ?? [];

  const analytics = computeStudentAnalyticsSnapshot({
    hskLevel,
    daysWindow: params.daysWindow ?? 90,
    localEvents: recentEvents,
    localMistakes: mistakeRecords,
    examAttempts,
  });

  const srs = buildSrsRetentionSnapshot({
    user,
    hskFilter: 'all',
  });

  const adaptivePlan = buildDailyAdaptivePlan({
    hskLevel,
    targetExamDate: params.targetExamDate ?? null,
    recentEvents,
    mistakeRecords,
    analyticsSnapshot: analytics,
    srsSnapshot: srs,
  });

  return {
    hskLevel,
    analytics,
    srs,
    adaptivePlan,
    remediationCatalogSummary: {
      writingPromptsCount: HSK_WRITING_PROMPTS.length,
      hsk7to9ModulesCount: HSK_7_9_MODULES.length,
    },
  };
}

/**
 * Closed-loop orchestrator called when a learner completes any activity:
 *   1. Emits standardized telemetry & classifies errors (26.01)
 *   2. Updates SRS Retention & Leech state when applicable (26.03)
 *   3. Recalculates Student Analytics Radar & Heatmap (26.02)
 *   4. Refreshes Adaptive Engine "Today's Smart Session" (26.04)
 */
export async function processLearningActivity(
  input: OrchestratedActivityInput
): Promise<OrchestratedActivityResult> {
  const user = input.user ?? null;
  const userId = input.userId ?? user?.id ?? null;
  const hskLevel = resolveUserHskLevel(input.hskLevel, user);

  // Step 1: Standardized telemetry & error classification (Task 26.01)
  const telemetryRes = await recordLearningEvent({
    ...input,
    userId,
    hskLevel,
  });

  // Step 2: Update SRS Retention & Leech state (Task 26.03)
  let srsCard: SrsRetentionCard | null = null;
  const shouldUpdateSrs =
    input.sourceModule === 'srs_review' ||
    typeof input.reviewRating === 'number' ||
    (!telemetryRes.event.is_correct && Boolean(input.hanzi));

  if (shouldUpdateSrs) {
    const rating: ReviewRating =
      input.reviewRating ?? (telemetryRes.event.is_correct ? 3 : 1);
    const srsRes = recordSrsRetentionReview({
      user,
      cardId: input.itemId,
      hanzi: input.hanzi ?? input.itemId,
      pinyin: input.pinyin ?? '',
      meaning: input.meaning ?? '',
      hskLevel,
      reviewRating: rating,
      confusedWith: input.confusedWith ?? null,
      timestamp: telemetryRes.event.created_at,
    });
    srsCard = srsRes.card;
  }

  // Steps 3 & 4: Recalculate Analytics (26.02) & Adaptive Smart Session (26.04)
  const intelligenceState = getLearningIntelligenceState({
    user: user ?? (userId ? { id: userId, hskLevel } : null),
    hskLevel,
    targetExamDate: input.targetExamDate ?? null,
  });

  return {
    telemetryEvent: telemetryRes.event,
    mistakeRecord: telemetryRes.mistakeRecord,
    srsCard,
    intelligenceState,
  };
}

