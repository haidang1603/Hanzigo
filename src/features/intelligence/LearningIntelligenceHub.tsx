import React, { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Brain,
  Compass,
  GraduationCap,
  PenTool,
  Sparkles,
} from 'lucide-react';
import DailyAdaptivePlan from '../adaptive/DailyAdaptivePlan.tsx';
import StudentAnalyticsDashboard from '../analytics/StudentAnalyticsDashboard.tsx';
import SrsRetentionDashboard from '../srs/SrsRetentionDashboard.tsx';
import HskWritingEvaluator from '../writing/HskWritingEvaluator.tsx';
import HskAdvancedModule from '../curriculum/HskAdvancedModule.tsx';
import { getLearningIntelligenceState } from '../../services/learningIntelligenceOrchestrator.ts';

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
  initialSubTab = 'smart_plan',
}: LearningIntelligenceHubProps) {
  const [activeSubTab, setActiveSubTab] =
    useState<IntelligenceHubTab>(initialSubTab);

  const summary = useMemo(
    () => getLearningIntelligenceState({ user }),
    [user]
  );

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#131B24] py-6 sm:py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Command Center Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] text-white shadow-xl border border-white/10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D3F]/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Learning Intelligence Hub · Closed-Loop Ecosystem</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Trung tâm Học tập Thông minh (AI & Telemetry)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Đồng bộ khép kín giữa Telemetry & Lỗi sai, Radar Năng lực, Đường cong Trí nhớ SRS, Lộ trình Thích ứng, Chấm Viết HSK 4–6 và Chuẩn HSK 7–9.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/10 text-xs">
                <span className="text-slate-300 block text-[10px] uppercase">Readiness</span>
                <strong className="text-base text-emerald-300">
                  {summary.analytics.kpis.hskReadinessScore}%
                </strong>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/10 text-xs">
                <span className="text-slate-300 block text-[10px] uppercase">Active Mistakes</span>
                <strong className="text-base text-rose-300">
                  {summary.analytics.kpis.activeMistakesCount}
                </strong>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/10 text-xs">
                <span className="text-slate-300 block text-[10px] uppercase">SRS Leeches</span>
                <strong className="text-base text-amber-300">
                  {summary.srs.leechCount}
                </strong>
              </div>
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
          <DailyAdaptivePlan user={user} setActiveTab={setActiveTab} />
        )}

        {activeSubTab === 'analytics' && (
          <StudentAnalyticsDashboard
            user={user}
            streak={streak}
            setActiveTab={setActiveTab}
          />
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

