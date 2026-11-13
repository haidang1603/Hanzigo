import React, { useCallback, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Compass,
  Gauge,
  HelpCircle,
  Play,
  Sliders,
  Sparkles,
} from 'lucide-react';
import DashboardWidget from '../../components/dashboard/DashboardWidget.jsx';
import { setAdaptiveNavigationTarget } from '../../services/adaptiveLearningService.js';
import {
  loadDailyAdaptivePlan,
  type AdaptiveQuestItem,
  type DailyAdaptivePlanSnapshot,
} from '../../services/adaptiveEngine.ts';

export interface DailyAdaptivePlanProps {
  user?: { id?: string | null; hskLevel?: number | string } | null;
  setActiveTab?: (tab: string) => void;
  initialPlan?: DailyAdaptivePlanSnapshot | null;
}

export default function DailyAdaptivePlan({
  user = null,
  setActiveTab,
  initialPlan = null,
}: DailyAdaptivePlanProps) {
  const initialHsk = useMemo(() => {
    const raw = user?.hskLevel;
    const parsed =
      typeof raw === 'number'
        ? raw
        : typeof raw === 'string'
        ? parseInt(raw.replace(/\D/g, ''), 10)
        : 1;
    return Number.isFinite(parsed) && parsed >= 1 && parsed <= 9 ? parsed : 1;
  }, [user?.hskLevel]);

  const [hskLevel, setHskLevel] = useState<number>(initialHsk);
  const [targetExamDate, setTargetExamDate] = useState<string>('');
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  const plan = useMemo(() => {
    if (initialPlan && !targetExamDate && hskLevel === initialPlan.hskLevel) {
      return initialPlan;
    }
    return loadDailyAdaptivePlan({
      user,
      hskLevel,
      targetExamDate: targetExamDate || null,
    });
  }, [initialPlan, user, hskLevel, targetExamDate]);

  const completedCount = useMemo(
    () => plan.quests.filter((q) => completedIds[q.id]).length,
    [plan.quests, completedIds]
  );

  const handleStartQuest = useCallback(
    (quest: AdaptiveQuestItem) => {
      setAdaptiveNavigationTarget({
        targetTab: quest.targetTab,
        source: quest.source,
        levelNum: quest.hskLevel,
        targetRef: quest.targetRef,
      });
      setActiveTab?.(quest.targetTab);
    },
    [setActiveTab]
  );

  const toggleCompleted = useCallback((questId: string) => {
    setCompletedIds((prev) => ({
      ...prev,
      [questId]: !prev[questId],
    }));
  }, []);

  const dda = plan.difficultyProfile;
  const ddaBadgeStyle =
    dda.tier === 'challenge'
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
      : dda.tier === 'supportive'
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';

  return (
    <DashboardWidget
      title="Today's Smart Session"
      subtitle={`Lộ trình vi mô ${plan.totalMinutes} phút cá nhân hóa theo ZPD & độ ưu tiên lỗi sai · Đã xong ${completedCount}/${plan.quests.length}`}
      icon={Compass}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B6B7F] dark:text-gray-300 bg-[#FAF6F0] dark:bg-[#0F172A] px-2.5 py-1.5 rounded-xl border border-[#EFE4D6] dark:border-[#2B3A4F]">
            <span>HSK</span>
            <select
              aria-label="Chọn cấp độ HSK cho Smart Session"
              value={hskLevel}
              onChange={(e) => setHskLevel(Number(e.target.value))}
              className="bg-transparent font-bold text-[#E85D3F] focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <option key={lvl} value={lvl} className="dark:bg-[#1E293B]">
                  {lvl}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B6B7F] dark:text-gray-300 bg-[#FAF6F0] dark:bg-[#0F172A] px-2.5 py-1.5 rounded-xl border border-[#EFE4D6] dark:border-[#2B3A4F]">
            <Calendar size={13} className="text-[#E85D3F]" />
            <input
              type="date"
              aria-label="Ngày thi HSK dự kiến"
              value={targetExamDate}
              onChange={(e) => setTargetExamDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#243447] dark:text-white focus:outline-none"
            />
          </label>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Dynamic Difficulty Adjustment (DDA) Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#243447] dark:text-white">
                <Gauge size={14} className="text-[#E85D3F]" />
                Dynamic Difficulty Adjustment (DDA):
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${ddaBadgeStyle}`}>
                {dda.label}
              </span>
            </div>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              {dda.guidance}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 text-[11px] font-semibold text-[#5B6B7F] dark:text-gray-300">
            <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] inline-flex items-center gap-1">
              <Sliders size={12} className="text-[#E85D3F]" />
              Nhiễu: {dda.distractorSimilarity}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F]">
              Audio: {dda.audioSpeed}x · {dda.audioReplayLimit} lượt
            </span>
          </div>
        </div>

        {/* Structured Micro-Plan Quest Cards */}
        {plan.quests.length === 0 ? (
          <div className="py-8 text-center text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
            Chưa có nhiệm vụ thích ứng. Hãy hoàn thành 1 bài luyện tập hoặc thẻ SRS để hệ thống tạo lộ trình thông minh.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.quests.map((quest) => {
              const isDone = Boolean(completedIds[quest.id]);
              return (
                <div
                  key={quest.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-[#FAF6F0]/60 dark:bg-[#0F172A]/70 border-[#EFE4D6] dark:border-[#2B3A4F]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F]">
                        {quest.stepLabel}
                      </span>
                      <span className="text-[11px] font-bold text-[#5B6B7F] dark:text-gray-300 inline-flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-500" />
                        Điểm ưu tiên: {quest.priorityScore}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-[#243447] dark:text-white leading-snug">
                        {quest.title}
                      </h4>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">
                        {quest.subtitle}
                      </p>
                    </div>

                    {/* Transparent "Why this recommendation?" Badge */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[11px] text-[#5B6B7F] dark:text-gray-300 flex items-start gap-1.5">
                      <HelpCircle size={14} className="text-[#E85D3F] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#243447] dark:text-white">
                          Why this recommendation?{' '}
                        </span>
                        <span>{quest.whyRecommended}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartQuest(quest)}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Play size={13} />
                      <span>Bắt đầu ngay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCompleted(quest.id)}
                      aria-label={`Đánh dấu hoàn thành ${quest.title}`}
                      className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1 border ${
                        isDone
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-[#1E293B] text-[#5B6B7F] dark:text-gray-300 border-[#E5D8C8] dark:border-[#2B3A4F] hover:border-emerald-500'
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      <span>{isDone ? 'Đã xong' : 'Xong'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}

