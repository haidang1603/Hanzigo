import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Compass,
  GraduationCap,
  PenTool,
  Sparkles,
  Zap,
} from 'lucide-react';
import DailyAdaptivePlan from '../adaptive/DailyAdaptivePlan.tsx';
import SrsRetentionDashboard from '../srs/SrsRetentionDashboard.tsx';
import HskWritingEvaluator from '../writing/HskWritingEvaluator.tsx';
import HskAdvancedModule from '../curriculum/HskAdvancedModule.tsx';
import TelemetryVisualAnalyticsGrid from '../analytics/TelemetryVisualAnalyticsGrid.jsx';
import HskReadinessRadarCard from '../analytics/HskReadinessRadarCard.jsx';
import { DailySmartStudyFlow } from '../unified-ecosystem/DailySmartStudyFlow.tsx';
import { getLearningIntelligenceState } from '../../services/learningIntelligenceOrchestrator.ts';
import {
  computeLocalTelemetrySnapshot,
  fetchTelemetryDashboardSummary,
} from '../../core/telemetry/learningTelemetryService.js';
import {
  buildDailyAiPrescription,
  buildDeterministicTelemetryBriefing,
  fetchAiTelemetryBriefing,
} from '../analytics/aiStudyPrescriptionEngine.js';

export type IntelligenceHubTab =
  | 'smart_plan'
  | 'analytics'
  | 'srs_retention'
  | 'writing_lab'
  | 'hsk7_9_cbt';

export interface LearningIntelligenceHubProps {
  user?: { id?: string | null; hskLevel?: number | string } | null;
  streak?: number;
  setActiveTab?: (tab: string) => void;
  onSelectLesson?: (lesson: { id: number }) => void;
  initialSubTab?: IntelligenceHubTab;
}

const HUB_TABS: Array<{
  id: IntelligenceHubTab;
  label: string;
  icon: typeof Compass;
}> = [
  { id: 'smart_plan', label: 'Smart Daily Plan', icon: Compass },
  { id: 'analytics', label: 'Analytics & Mistakes', icon: BarChart3 },
  { id: 'srs_retention', label: 'SRS Memory & Leech', icon: Brain },
  { id: 'writing_lab', label: 'AI Writing Lab', icon: PenTool },
  { id: 'hsk7_9_cbt', label: 'HSK 7–9 & CBT', icon: GraduationCap },
];

export default function LearningIntelligenceHub({
  user = null,
  streak = 0,
  setActiveTab,
  onSelectLesson,
  initialSubTab = 'smart_plan',
}: LearningIntelligenceHubProps) {
  const [activeSubTab, setActiveSubTab] =
    useState<IntelligenceHubTab>(initialSubTab);

  const summary = useMemo(
    () => getLearningIntelligenceState({ user }),
    [user]
  );

  const [telemetrySnapshot, setTelemetrySnapshot] = useState(() =>
    computeLocalTelemetrySnapshot()
  );

  const dailyPrescription = useMemo(
    () => buildDailyAiPrescription({ telemetrySnapshot }),
    [telemetrySnapshot]
  );

  const [aiBriefing, setAiBriefing] = useState(() =>
    buildDeterministicTelemetryBriefing(telemetrySnapshot, dailyPrescription)
  );

  useEffect(() => {
    let active = true;
    fetchTelemetryDashboardSummary(user, 14).then((snap) => {
      if (!active || !snap) return;
      setTelemetrySnapshot(snap);
      const rx = buildDailyAiPrescription({ telemetrySnapshot: snap });
      setAiBriefing(buildDeterministicTelemetryBriefing(snap, rx));
      fetchAiTelemetryBriefing(user, snap, rx).then((brief) => {
        if (active && brief) setAiBriefing(brief);
      });
    });
    return () => {
      active = false;
    };
  }, [user]);

  const navigateToLesson = (lessonId: number) => {
    if (onSelectLesson) {
      onSelectLesson({ id: lessonId });
    } else if (typeof window !== 'undefined') {
      window.location.hash = `#lesson?id=${lessonId}`;
    }
    setActiveTab?.('lesson');
  };

  return (
    <div className="min-h-dvh bg-[#FFF9F2] dark:bg-[#131B24] py-6 sm:py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Command Center Header */}
        <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] text-white shadow-xl border border-white/10 space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-1.5">
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D3F]/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Learning Intelligence Hub · Closed-Loop Ecosystem</span>
              </div>
              <h1 className="text-lg sm:text-3xl font-black tracking-tight">
                Trung tâm Học tập Thông minh (AI & Telemetry)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-none">
                Đồng bộ khép kín giữa Telemetry & Lỗi sai, Radar Năng lực, Đường cong Trí nhớ SRS, Lộ trình Thích ứng, Chấm Viết HSK 4–6 và Chuẩn HSK 7–9.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-xs">
                <span className="text-slate-300 block text-[10px] uppercase">Readiness</span>
                <strong className="text-sm sm:text-base text-emerald-300">
                  {summary.analytics.kpis.hskReadinessScore}%
                </strong>
              </div>
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-xs">
                <span className="text-slate-300 block text-[10px] uppercase">Active Mistakes</span>
                <strong className="text-sm sm:text-base text-rose-300">
                  {summary.analytics.kpis.activeMistakesCount}
                </strong>
              </div>
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-xs">
                <span className="text-slate-300 block text-[10px] uppercase">SRS Leeches</span>
                <strong className="text-sm sm:text-base text-amber-300">
                  {summary.srs.leechCount}
                </strong>
              </div>
            </div>
          </div>

          {/* AI Diagnostic Briefing & 4 Daily Prescription Tasks */}
          <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-amber-300">
                  {aiBriefing?.greeting || `Chẩn đoán AI · Mục tiêu HSK ${dailyPrescription.targetHskLevel}`}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {aiBriefing?.summary}
                </p>
                <p className="text-[11px] text-emerald-300 font-semibold">
                  {aiBriefing?.examTactic}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveSubTab('smart_plan');
                  const el = document.getElementById('intelligence-smart-study-flow');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-extrabold shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap size={14} className="fill-white" />
                <span>⚡ Khởi chạy Phiên Học Thích Ứng 15 Phút</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {dailyPrescription.tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    if (task.route === 'lesson' && task.lessonId) {
                      navigateToLesson(task.lessonId);
                    } else {
                      setActiveTab?.(task.route);
                    }
                  }}
                  className="text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E85D3F]/60 p-3 flex flex-col justify-between gap-2 transition-all cursor-pointer group"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-amber-300">
                      {task.badge}
                    </span>
                    <div className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                      {task.title}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 pt-1 border-t border-white/10">
                    <span>{task.actionLabel}</span>
                    <ArrowRight size={12} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Unified Hub Sub-Navigation */}
          <div
            role="tablist"
            aria-label="Learning Intelligence Modules"
            className="flex flex-wrap gap-2 pt-2"
          >
            {HUB_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#E85D3F] text-white shadow-md'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Content */}
        {activeSubTab === 'smart_plan' && (
          <div className="space-y-6">
            <div id="intelligence-smart-study-flow">
              <DailySmartStudyFlow
                user={user}
                prescribedTargets={dailyPrescription.prescribedTargets}
                onNavigateModule={(mod) =>
                  setActiveTab?.(mod === 'vocab' ? 'vocabulary' : mod)
                }
              />
            </div>
            <DailyAdaptivePlan user={user} setActiveTab={setActiveTab} />
          </div>
        )}

        {activeSubTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4">
              <HskReadinessRadarCard
                snapshot={telemetrySnapshot}
                targetHskLevel={dailyPrescription.targetHskLevel}
                onLaunchExam={() => setActiveTab?.('hsk')}
              />
            </div>
            <div className="lg:col-span-8">
              <TelemetryVisualAnalyticsGrid
                snapshot={telemetrySnapshot}
                setActiveTab={setActiveTab}
                onSelectLevel={(_lvl, startLessonId) =>
                  navigateToLesson(startLessonId)
                }
              />
            </div>
          </div>
        )}

        {activeSubTab === 'srs_retention' && (
          <SrsRetentionDashboard user={user} setActiveTab={setActiveTab} />
        )}

        {activeSubTab === 'writing_lab' && (
          <HskWritingEvaluator user={user} />
        )}

        {activeSubTab === 'hsk7_9_cbt' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">
                Sẵn sàng thi thử CBT mô phỏng chuẩn HSK 1–6 & HSK 7–9?
              </div>
              <button
                type="button"
                onClick={() => setActiveTab?.('hsk')}
                className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Award size={14} />
                <span>Mở HSK CBT Simulator</span>
              </button>
            </div>
            <HskAdvancedModule user={user} />
          </div>
        )}
      </div>
    </div>
  );
}

