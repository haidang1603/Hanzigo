import React, { useEffect, useMemo, useState } from 'react';
import {
  Sparkles,
  BookMarked,
  PenTool,
  Mic,
  BookOpen,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { listVocabItems, type UserVocabItem } from '../../services/vocabWorkspaceService.ts';
import { getBuiltInReadingArticles } from '../../services/readingStudioService.ts';
import { getBuiltInListeningTracks } from '../../services/listeningStudioService.ts';
import { createSmartDailyLoopPlan } from '../../core/ecosystem/useUnifiedEcosystemStore.ts';
import { useUnifiedTools } from '../../core/ecosystem/UnifiedToolsContext.tsx';
import { trackLearningEvent } from '../../core/telemetry/learningTelemetryService.js';

export interface PrescribedStudyTargets {
  vocabTargets?: Array<{
    id: string;
    simplified: string;
    pinyin: string;
    meaning_vi: string;
    weakestDimension?: string;
  }>;
  writingCharacters?: string[];
  pronunciationTargets?: Array<{
    hanzi: string;
    pinyin: string;
    meaningVi: string;
  }>;
  grammarFocusKey?: string;
  nextLessonId?: number;
  targetHskLevel?: number;
}

interface DailySmartStudyFlowProps {
  user?: { id?: string | null } | null;
  onNavigateModule?: (moduleKey: 'vocab' | 'writing' | 'pronunciation' | 'reading' | 'listening') => void;
  prescribedTargets?: PrescribedStudyTargets | null;
}

const STARTER_DAILY_VOCAB: UserVocabItem[] = [
  { id: 'starter-1', simplified: '学习', traditional: '學習', pinyin: 'xuéxí', meaning_vi: 'Học tập', mastery_level: 1 } as UserVocabItem,
  { id: 'starter-2', simplified: '习惯', traditional: '習慣', pinyin: 'xíguàn', meaning_vi: 'Thói quen', mastery_level: 1 } as UserVocabItem,
  { id: 'starter-3', simplified: '早上', traditional: '早上', pinyin: 'zǎoshang', meaning_vi: 'Buổi sáng', mastery_level: 1 } as UserVocabItem,
  { id: 'starter-4', simplified: '咖啡', traditional: '咖啡', pinyin: 'kāfēi', meaning_vi: 'Cà phê', mastery_level: 1 } as UserVocabItem,
  { id: 'starter-5', simplified: '朋友', traditional: '朋友', pinyin: 'péngyou', meaning_vi: 'Bạn bè', mastery_level: 1 } as UserVocabItem,
  { id: 'starter-6', simplified: '时间', traditional: '時間', pinyin: 'shíjiān', meaning_vi: 'Thời gian', mastery_level: 1 } as UserVocabItem,
  { id: 'starter-7', simplified: '准备', traditional: '準備', pinyin: 'zhǔnbèi', meaning_vi: 'Chuẩn bị', mastery_level: 1 } as UserVocabItem,
  { id: 'starter-8', simplified: '努力', traditional: '努力', pinyin: 'nǔlì', meaning_vi: 'Cố gắng, nỗ lực', mastery_level: 1 } as UserVocabItem,
];

export const DailySmartStudyFlow: React.FC<DailySmartStudyFlowProps> = ({
  user,
  onNavigateModule,
  prescribedTargets = null,
}) => {
  const { openQuickWritingModal, openQuickPronunciationModal, openQuickDictionary } =
    useUnifiedTools();
  const [vocabItems, setVocabItems] = useState<UserVocabItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    let active = true;
    listVocabItems(user).then((items) => {
      if (active) setVocabItems(items);
    });
    return () => {
      active = false;
    };
  }, [user]);

  const effectiveVocab = useMemo(() => {
    if (prescribedTargets?.vocabTargets && prescribedTargets.vocabTargets.length > 0) {
      const injected = prescribedTargets.vocabTargets.map((vt, idx) => ({
        id: vt.id || `rx-${idx + 1}`,
        simplified: vt.simplified,
        traditional: vt.simplified,
        pinyin: vt.pinyin,
        meaning_vi: vt.meaning_vi,
        mastery_level: 1,
      })) as UserVocabItem[];
      return injected;
    }
    return vocabItems.length > 0 ? vocabItems : STARTER_DAILY_VOCAB;
  }, [prescribedTargets, vocabItems]);

  const usingStarterFallback = vocabItems.length === 0 && !prescribedTargets?.vocabTargets?.length;

  const basePlan = useMemo(() => {
    return createSmartDailyLoopPlan(
      effectiveVocab,
      getBuiltInReadingArticles(),
      getBuiltInListeningTracks()
    );
  }, [effectiveVocab]);

  const plan = useMemo(() => {
    return {
      ...basePlan,
      hardCharacters:
        prescribedTargets?.writingCharacters && prescribedTargets.writingCharacters.length > 0
          ? prescribedTargets.writingCharacters
          : basePlan.hardCharacters,
      pronunciationTargets:
        prescribedTargets?.pronunciationTargets && prescribedTargets.pronunciationTargets.length > 0
          ? prescribedTargets.pronunciationTargets
          : basePlan.pronunciationTargets,
    };
  }, [basePlan, prescribedTargets]);

  const toggleStep = (step: number) => {
    const isMarkingDone = !completedSteps.has(step);
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });

    if (isMarkingDone) {
      const eventTypeByStep: Record<number, string> = {
        1: 'vocab_review',
        2: 'hanzi_stroke_quiz',
        3: 'ai_roleplay_turn',
        4: 'reading_lookup',
      };
      const targetKeyByStep: Record<number, string> = {
        1: plan.dueVocabItems[0]?.simplified || 'daily-vocab',
        2: plan.hardCharacters[0] || 'daily-hanzi',
        3: plan.pronunciationTargets[0]?.hanzi || 'daily-tone',
        4: prescribedTargets?.grammarFocusKey || plan.recommendedArticle?.title_zh || 'daily-context',
      };
      trackLearningEvent(
        {
          event_type: eventTypeByStep[step] || 'vocab_review',
          hsk_level: prescribedTargets?.targetHskLevel || 1,
          lesson_id: prescribedTargets?.nextLessonId || null,
          target_key: targetKeyByStep[step] || `daily-step-${step}`,
          is_correct: true,
          score_pct: 100,
          latency_ms: 6000,
          metadata: { source: 'DailySmartStudyFlow', step },
          flushNow: step === 4,
        },
        { user }
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-sky-50 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
            <Sparkles className="w-4 h-4" />
            Smart Daily Loop · 20 phút khép kín
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Chu trình học tiếng Trung liên thông đa kỹ năng
          </h1>
          <p className="text-xs text-slate-600">
            Từ vựng đến hạn → Luyện viết chữ Hán → Chuẩn hóa thanh điệu → Đọc/Nghe theo ngữ cảnh
          </p>
        </div>

        <div className="rounded-xl bg-white border border-emerald-200 px-4 py-2 text-center">
          <div className="text-xs text-slate-500">Tiến độ hôm nay</div>
          <div className="text-lg font-bold text-emerald-700">{completedSteps.size} / 4 bước</div>
        </div>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Vocabulary SRS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <BookMarked className="w-4 h-4" />
              Bước 1 · Ôn {plan.dueVocabItems.length} từ vựng {usingStarterFallback ? 'gợi ý' : 'đến hạn'}
            </span>
            <button
              type="button"
              onClick={() => toggleStep(1)}
              className={`text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                completedSteps.has(1)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completedSteps.has(1) ? 'Xong' : 'Đánh dấu'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {plan.dueVocabItems.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => openQuickDictionary(it.simplified)}
                className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-slate-800"
              >
                {it.simplified} ({it.pinyin})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigateModule?.('vocab')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
          >
            Mở Vocabulary Workspace <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step 2: Writing Practice */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <PenTool className="w-4 h-4" />
              Bước 2 · Luyện viết {plan.hardCharacters.length} chữ Hán trọng tâm
            </span>
            <button
              type="button"
              onClick={() => toggleStep(2)}
              className={`text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                completedSteps.has(2)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completedSteps.has(2) ? 'Xong' : 'Đánh dấu'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {plan.hardCharacters.map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => openQuickWritingModal(ch)}
                className="w-10 h-10 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-lg font-bold text-slate-900"
              >
                {ch}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openQuickWritingModal(plan.hardCharacters.join(''))}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
          >
            Luyện viết tất cả ngay <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step 3: Pronunciation Lab */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">
              <Mic className="w-4 h-4" />
              Bước 3 · Luyện phát âm &amp; thanh điệu
            </span>
            <button
              type="button"
              onClick={() => toggleStep(3)}
              className={`text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                completedSteps.has(3)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completedSteps.has(3) ? 'Xong' : 'Đánh dấu'}
            </button>
          </div>

          <div className="space-y-1.5">
            {plan.pronunciationTargets.map((pt) => (
              <button
                key={pt.hanzi}
                type="button"
                onClick={() => openQuickPronunciationModal(pt.hanzi, pt.pinyin)}
                className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 px-3 py-2 flex items-center justify-between text-xs cursor-pointer"
              >
                <span>
                  <strong className="text-sm text-slate-900 mr-2">{pt.hanzi}</strong>
                  <span className="text-sky-700">{pt.pinyin}</span>
                </span>
                <span className="text-slate-500">{pt.meaningVi}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigateModule?.('pronunciation')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
          >
            Mở Pronunciation Lab <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step 4: Contextual Reading & Listening */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700">
              <BookOpen className="w-4 h-4" />
              Bước 4 · Đọc &amp; Nghe trong ngữ cảnh thật
            </span>
            <button
              type="button"
              onClick={() => toggleStep(4)}
              className={`text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                completedSteps.has(4)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completedSteps.has(4) ? 'Xong' : 'Đánh dấu'}
            </button>
          </div>

          {plan.recommendedArticle && (
            <div className="rounded-xl border border-slate-200 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <BookOpen className="w-3.5 h-3.5" />
                Bài đọc gợi ý (HSK {plan.recommendedArticle.hsk_level})
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {plan.recommendedArticle.title_zh} — {plan.recommendedArticle.title_vi}
              </div>
              <button
                type="button"
                onClick={() => onNavigateModule?.('reading')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Mở Reading Studio →
              </button>
            </div>
          )}

          {plan.recommendedTrack && (
            <div className="rounded-xl border border-slate-200 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                <Headphones className="w-3.5 h-3.5" />
                Bài nghe gợi ý (HSK {plan.recommendedTrack.hsk_level})
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {plan.recommendedTrack.title_zh} — {plan.recommendedTrack.title_vi}
              </div>
              <button
                type="button"
                onClick={() => onNavigateModule?.('listening')}
                className="text-xs font-semibold text-indigo-700 hover:underline"
              >
                Mở Listening Studio →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

