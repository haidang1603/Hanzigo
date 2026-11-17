import {
  computeLocalTelemetrySnapshot,
  filterRealUserVocabItems,
  ROADMAP_PROGRESS_STORAGE_KEY,
  VOCAB_ITEMS_STORAGE_KEY,
} from '../../core/telemetry/learningTelemetryService.js';
import { supabase, isSupabaseConfigured } from '../../supabase/config.js';

export const PRESCRIPTION_VALID_ROUTES = [
  'vocabulary',
  'writing',
  'pronunciation',
  'grammar',
  'lesson',
  'hsk',
  'hsk30-translation',
  'reading',
  'listening-studio',
  'roadmap',
];

export const CBT_SPEED_BENCHMARKS_MS = {
  listening: { label: 'Nghe phản xạ', goldMs: 12000, goldSec: 12 },
  grammar: { label: 'Ngữ pháp / Câu bệnh', goldMs: 25000, goldSec: 25 },
  reading: { label: 'Đọc sắp xếp & Hiểu', goldMs: 35000, goldSec: 35 },
  writing: { label: 'Viết & Dịch 3 tầng', goldMs: 45000, goldSec: 45 },
};

function getSafeLocalStorage() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    // ignore
  }
  return null;
}

function readJsonStorage(key, fallback) {
  const storage = getSafeLocalStorage();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

function resolveNextLessonId(roadmapProgress = {}) {
  const completedRaw = roadmapProgress?.completedLessons || roadmapProgress?.completed || [];
  const completedSet = new Set(
    (Array.isArray(completedRaw) ? completedRaw : [])
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id >= 1 && id <= 180)
  );

  for (let id = 1; id <= 180; id += 1) {
    if (!completedSet.has(id)) return id;
  }
  return 180;
}

function resolveHskLevelFromLesson(lessonId) {
  const safeId = Math.min(180, Math.max(1, Number(lessonId) || 1));
  return Math.ceil(safeId / 20);
}

function detectWeakestDimension(vocabItems = [], triMastery = null) {
  if (Array.isArray(vocabItems) && vocabItems.length > 0) {
    let meaningSum = 0;
    let writingSum = 0;
    let pronunciationSum = 0;
    for (const item of vocabItems) {
      const base = Math.min(100, Math.max(20, Number(item.mastery_level || 1) * 20));
      meaningSum += Number.isFinite(Number(item.meaning_mastery)) ? Number(item.meaning_mastery) : base;
      writingSum += Number.isFinite(Number(item.writing_mastery)) ? Number(item.writing_mastery) : Math.max(15, base - 15);
      pronunciationSum += Number.isFinite(Number(item.pronunciation_mastery)) ? Number(item.pronunciation_mastery) : Math.max(20, base - 10);
    }
    const n = vocabItems.length;
    const avgMeaning = meaningSum / n;
    const avgWriting = writingSum / n;
    const avgPronunciation = pronunciationSum / n;

    if (avgWriting <= avgMeaning && avgWriting <= avgPronunciation) return 'writing';
    if (avgPronunciation <= avgMeaning && avgPronunciation <= avgWriting) return 'pronunciation';
    return 'meaning';
  }

  return triMastery?.weakestDimension || 'writing';
}

function detectLeechVocabItems(vocabItems = [], weakestDimension = 'writing') {
  if (!Array.isArray(vocabItems) || vocabItems.length === 0) {
    return [];
  }

  const scoreItemUrgency = (item) => {
    const lapses = Number(item.lapses || 0);
    const dimScore =
      weakestDimension === 'writing'
        ? Number(item.writing_mastery ?? 50)
        : weakestDimension === 'pronunciation'
        ? Number(item.pronunciation_mastery ?? 50)
        : Number(item.meaning_mastery ?? 50);
    const isDue = item.next_review_at ? new Date(item.next_review_at).getTime() <= Date.now() : true;
    return lapses * 30 + (100 - dimScore) + (isDue ? 25 : 0);
  };

  return [...vocabItems]
    .sort((a, b) => scoreItemUrgency(b) - scoreItemUrgency(a))
    .slice(0, 6)
    .map((item, idx) => ({
      id: item.id || `rx-${idx + 1}`,
      simplified: item.simplified || '学习',
      pinyin: item.pinyin || 'xuéxí',
      meaning_vi: item.meaning_vi || 'Từ vựng trọng tâm',
      weakestDimension,
    }));
}

function resolveDefaultGrammarKey(hskLevel) {
  if (hskLevel >= 7) return 'HSK7-WRITTEN-YUQISHUO';
  if (hskLevel >= 5) return 'HSK6-YUBING-MISSING-SUBJ';
  return 'HSK3-BA-01';
}

function detectWeakestGrammarKey(telemetrySnapshot, hskLevel) {
  const bottlenecks = telemetrySnapshot?.top_cognitive_bottlenecks || [];
  const grammarHit = bottlenecks.find((b) => b.event_type === 'grammar_drill');
  if (grammarHit?.target_key) return grammarHit.target_key;
  return resolveDefaultGrammarKey(hskLevel);
}

function detectSlowestCbtSkill(telemetrySnapshot, hskAttempts = []) {
  const avg = telemetrySnapshot?.avg_response_latency_ms || {};
  const candidates = [
    { key: 'listening', ms: Number(avg.listening || 0), ...CBT_SPEED_BENCHMARKS_MS.listening },
    { key: 'grammar', ms: Number(avg.grammar || 0), ...CBT_SPEED_BENCHMARKS_MS.grammar },
    { key: 'reading', ms: Number(avg.reading || 0), ...CBT_SPEED_BENCHMARKS_MS.reading },
    { key: 'writing', ms: Number(avg.writing || 0), ...CBT_SPEED_BENCHMARKS_MS.writing },
  ];

  const overtime = candidates
    .filter((c) => c.ms > 0)
    .sort((a, b) => b.ms / b.goldMs - a.ms / a.goldMs);

  if (overtime.length > 0) return overtime[0];

  if (Array.isArray(hskAttempts) && hskAttempts.length > 0) {
    const latest = hskAttempts[0];
    if (latest?.weakest_section === 'listening') return candidates[0];
    if (latest?.weakest_section === 'writing') return candidates[3];
  }

  return candidates[2];
}

/**
 * Generates the 4-task "Daily AI Prescription" and deep-linked prescribedTargets
 * covering all 180 lessons (HSK 1–9), 3-dimensional vocab mastery, grammar AST drills, and CBT speed.
 */
export function buildDailyAiPrescription({
  telemetrySnapshot = null,
  vocabItems = null,
  roadmapProgress = null,
  hskAttempts = null,
  targetHskLevel = null,
} = {}) {
  const rawVocab = Array.isArray(vocabItems)
    ? vocabItems
    : readJsonStorage(VOCAB_ITEMS_STORAGE_KEY, []);
  const resolvedVocab = filterRealUserVocabItems(rawVocab);
  const resolvedRoadmap = roadmapProgress && typeof roadmapProgress === 'object'
    ? roadmapProgress
    : readJsonStorage(ROADMAP_PROGRESS_STORAGE_KEY, {});
  const resolvedAttempts = Array.isArray(hskAttempts)
    ? hskAttempts
    : readJsonStorage('hanzigo_hsk_attempts_v1', []);

  const snapshot =
    telemetrySnapshot ||
    computeLocalTelemetrySnapshot({
      vocabItems: resolvedVocab,
      roadmapProgress: resolvedRoadmap,
    });

  const nextLessonId = resolveNextLessonId(resolvedRoadmap);
  const inferredHsk = resolveHskLevelFromLesson(nextLessonId);
  const effectiveHsk = Number.isFinite(Number(targetHskLevel))
    ? Math.min(9, Math.max(1, Math.round(Number(targetHskLevel))))
    : inferredHsk;

  const weakestDimension = detectWeakestDimension(resolvedVocab, snapshot.triDimensionalMastery);
  const leechItems = detectLeechVocabItems(resolvedVocab, weakestDimension);
  const weakestGrammarKey = detectWeakestGrammarKey(snapshot, effectiveHsk);
  const slowestCbtSkill = detectSlowestCbtSkill(snapshot, resolvedAttempts);

  const task1Route =
    weakestDimension === 'writing'
      ? 'writing'
      : weakestDimension === 'pronunciation'
      ? 'pronunciation'
      : 'vocabulary';

  const task1FocusLabel =
    weakestDimension === 'writing'
      ? 'Luyện nét viết Chữ Hán'
      : weakestDimension === 'pronunciation'
      ? 'Chuẩn hóa Thanh điệu & Phát âm'
      : 'Ôn tập Nghĩa & Ngữ cảnh SRS';

  const isHsk79Branch = nextLessonId >= 121 || effectiveHsk >= 7;
  const task3Route = isHsk79Branch && slowestCbtSkill.key === 'writing' ? 'hsk30-translation' : 'lesson';

  const tasks = [
    {
      id: 'rx-task-1-srs',
      priority: 1,
      badge: 'Cấp bách · SRS & Leech Fix',
      title:
        leechItems.length > 0
          ? `Ôn ${leechItems.length} từ trọng tâm (${task1FocusLabel})`
          : `Bắt đầu ${task1FocusLabel} từ Sổ tay`,
      description:
        leechItems.length > 0
          ? `Ưu tiên chiều kỹ năng yếu nhất (${weakestDimension}): ${leechItems
              .slice(0, 3)
              .map((w) => w.simplified)
              .join(' · ')}.`
          : 'Chưa có từ vựng đến hạn trong Sổ tay — hãy lưu hoặc học từ mới để kích hoạt SRS 3 chiều.',
      route: task1Route,
      actionLabel:
        weakestDimension === 'writing'
          ? 'Mở Xưởng Viết Chữ Hán'
          : weakestDimension === 'pronunciation'
          ? 'Mở Lab Phát Âm'
          : 'Ôn Vocabulary SRS',
      durationMinutes: 4,
      targetKeys: leechItems.map((w) => w.simplified),
    },
    {
      id: 'rx-task-2-grammar',
      priority: 2,
      badge: 'Khắc phục Ngữ pháp / Câu bệnh',
      title: `Thực hành cấu trúc ${weakestGrammarKey}`,
      description:
        effectiveHsk >= 6
          ? 'Sửa lỗi câu bệnh & phân tích cấu trúc viết học thuật chuẩn CTI.'
          : 'Luyện trật tự câu chữ 把 / 被 và bổ ngữ kết quả qua bài tập AST.',
      route: 'grammar',
      actionLabel: 'Vào Grammar Drill',
      durationMinutes: 4,
      targetKeys: [weakestGrammarKey],
    },
    {
      id: 'rx-task-3-roadmap',
      priority: 3,
      badge: `Lộ trình 180 bài · HSK ${effectiveHsk}`,
      title:
        task3Route === 'hsk30-translation'
          ? `Xưởng Dịch 3 Tầng HSK 7–9 (Bài #${nextLessonId})`
          : `Học tiếp Bài #${nextLessonId} trên Lộ trình HSK ${effectiveHsk}`,
      description:
        task3Route === 'hsk30-translation'
          ? 'Rèn kỹ năng dịch Tín–Đạt–Nhã và ngữ pháp báo chí cấp cao.'
          : 'Hoàn thành từ vựng cốt lõi, hội thoại và kiểm tra cuối bài.',
      route: task3Route,
      lessonId: nextLessonId,
      actionLabel: task3Route === 'hsk30-translation' ? 'Mở Xưởng Dịch 3 Tầng' : `Học Bài #${nextLessonId}`,
      durationMinutes: 5,
      targetKeys: [`lesson-${nextLessonId}`],
    },
    {
      id: 'rx-task-4-cbt',
      priority: 4,
      badge: 'Tăng tốc Phản xạ CBT',
      title: `Mini-Drill 5 phút: ${slowestCbtSkill.label}`,
      description:
        slowestCbtSkill.ms > slowestCbtSkill.goldMs
          ? `Tốc độ hiện tại ${(slowestCbtSkill.ms / 1000).toFixed(1)}s/câu (vượt chuẩn ${slowestCbtSkill.goldSec}s/câu). Luyện bấm giờ ngay!`
          : `Duy trì nhịp phản xạ dưới ${slowestCbtSkill.goldSec}s/câu cho đề thi HSK ${effectiveHsk}.`,
      route: 'hsk',
      actionLabel: 'Vào Đề Thi CBT',
      durationMinutes: 5,
      targetKeys: [`cbt-${slowestCbtSkill.key}`],
    },
  ];

  const hardCharacters = Array.from(
    new Set(
      leechItems
        .flatMap((w) => Array.from(String(w.simplified || '')))
        .filter((ch) => /[\u4e00-\u9fff]/.test(ch))
    )
  ).slice(0, 6);

  const pronunciationTargets = leechItems.slice(0, 4).map((w) => ({
    hanzi: w.simplified,
    pinyin: w.pinyin,
    meaningVi: w.meaning_vi,
  }));

  return {
    targetHskLevel: effectiveHsk,
    weakestDimension,
    weakestGrammarKey,
    recommendedNextLessonId: nextLessonId,
    slowestCbtSkill,
    headline: `Đơn học thích ứng HSK ${effectiveHsk} · Trọng tâm ${task1FocusLabel}`,
    tasks,
    prescribedTargets: {
      vocabTargets: leechItems,
      writingCharacters: hardCharacters,
      pronunciationTargets,
      grammarFocusKey: weakestGrammarKey,
      nextLessonId,
      targetHskLevel: effectiveHsk,
    },
  };
}

export function buildDeterministicTelemetryBriefing(snapshot, prescription) {
  const hsk = prescription?.targetHskLevel || 1;
  const retention = Number(snapshot?.retention_rate_pct || 0);
  const weakDim = prescription?.weakestDimension || 'writing';
  const weakDimVi =
    weakDim === 'writing'
      ? 'bút thuận viết chữ Hán'
      : weakDim === 'pronunciation'
      ? 'phát âm & thanh điệu'
      : 'ghi nhớ nghĩa ngữ cảnh';
  const slowest = prescription?.slowestCbtSkill;

  const retentionText =
    retention > 0
      ? `Tỷ lệ ghi nhớ SRS hiện đạt ${retention}%.`
      : 'Hệ thống đang thu thập thêm phiên ôn tập SRS để vẽ đường cong ghi nhớ chính xác hơn.';

  const speedText =
    slowest && slowest.ms > slowest.goldMs
      ? `Kỹ năng "${slowest.label}" đang mất ${(slowest.ms / 1000).toFixed(1)}s/câu (chuẩn vàng < ${slowest.goldSec}s/câu).`
      : `Nhịp phản xạ làm bài đang ổn định theo chuẩn mục tiêu HSK ${hsk}.`;

  return {
    source: 'deterministic_fallback',
    greeting: `Chẩn đoán AI cho mục tiêu HSK ${hsk}`,
    summary: `${retentionText} Chiều kỹ năng cần ưu tiên kéo lên hôm nay là ${weakDimVi}. ${speedText}`,
    examTactic:
      hsk >= 7
        ? 'Chiến thuật HSK 7–9: Phân bổ tối đa 35s/câu đọc học thuật và dùng khung Dịch 3 tầng (Tín–Đạt–Nhã) cho phần viết luận.'
        : hsk >= 4
        ? `Chiến thuật HSK ${hsk}: Chốt nhanh câu sắp xếp A-B-C bằng từ nối nhân quả, tránh sa lầy quá 35 giây/câu.`
        : `Chiến thuật HSK ${hsk}: Khóa chắc thanh điệu âm tiết đôi và viết tay ít nhất 4 chữ Hán trọng tâm mỗi ngày.`,
  };
}

export async function fetchAiTelemetryBriefing(user = null, snapshot = null, prescription = null) {
  const fallback = buildDeterministicTelemetryBriefing(snapshot, prescription);

  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return fallback;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken || typeof fetch !== 'function') {
      return fallback;
    }

    const res = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        action: 'generate_telemetry_briefing',
        payload: {
          hskLevel: `HSK ${prescription?.targetHskLevel || 1}`,
          retention_rate_pct: snapshot?.retention_rate_pct || 0,
          study_streak_days: snapshot?.study_streak_days || 0,
          events_count_7d: snapshot?.events_count_7d || 0,
          avg_response_latency_ms: snapshot?.avg_response_latency_ms || {},
          weakestDimension: prescription?.weakestDimension || 'writing',
          top_cognitive_bottlenecks: (snapshot?.top_cognitive_bottlenecks || []).slice(0, 3),
        },
      }),
    });

    if (!res.ok) return fallback;
    const data = await res.json();
    if (data && typeof data.summary === 'string' && data.summary.trim().length > 0) {
      return {
        source: data.source || 'ai_coach',
        greeting: data.greeting || fallback.greeting,
        summary: data.summary,
        examTactic: data.examTactic || fallback.examTactic,
      };
    }
    return fallback;
  } catch {
    return fallback;
  }
}
