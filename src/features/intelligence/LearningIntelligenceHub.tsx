import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  GraduationCap,
  PenTool,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
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
import {
  applyConfirmedHitlProposal,
  buildRuleBasedAdaptivePlan,
  buildSmartLearningSnapshot,
  fetchSmartCoachWithCacheAndFallback,
  syncSmartTelemetrySnapshotAsync,
} from '../../services/smartLearningTelemetryService.js';

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
  setActiveTab,
  onSelectLesson,
  initialSubTab = 'smart_plan',
}: LearningIntelligenceHubProps) {
  const [activeSubTab, setActiveSubTab] =
    useState<IntelligenceHubTab>(initialSubTab);
  const [examSystem, setExamSystem] = useState<'all' | 'hsk_2_0' | 'hsk_3_0'>('all');
  const [skillModeFilter, setSkillModeFilter] = useState<'overall' | 'exam' | 'learning'>('overall');
  const [targetLevelOverride, setTargetLevelOverride] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [coachRefreshing, setCoachRefreshing] = useState(false);
  const [hitlStatusMsg, setHitlStatusMsg] = useState<string | null>(null);
  const [handledProposalIds, setHandledProposalIds] = useState<Record<string, 'applied' | 'dismissed'>>({});

  const summary = useMemo(
    () => getLearningIntelligenceState({ user }),
    [user, refreshTick]
  );

  const smartSnapshot = useMemo(
    () =>
      buildSmartLearningSnapshot(user, {
        examSystem,
        targetHskLevel: targetLevelOverride,
      }),
    [user, examSystem, targetLevelOverride, refreshTick]
  );

  const [telemetrySnapshot, setTelemetrySnapshot] = useState(() =>
    computeLocalTelemetrySnapshot({ user })
  );

  const dailyPrescription = useMemo(
    () =>
      buildDailyAiPrescription({
        telemetrySnapshot,
        targetHskLevel: smartSnapshot.targetHskLevel,
      }),
    [telemetrySnapshot, smartSnapshot.targetHskLevel]
  );

  const [aiBriefing, setAiBriefing] = useState(() =>
    buildDeterministicTelemetryBriefing(telemetrySnapshot, dailyPrescription)
  );

  const [smartCoachPlan, setSmartCoachPlan] = useState(() =>
    buildRuleBasedAdaptivePlan(smartSnapshot, { user })
  );

  useEffect(() => {
    setSmartCoachPlan(buildRuleBasedAdaptivePlan(smartSnapshot, { user }));
  }, [smartSnapshot, user]);

  useEffect(() => {
    let active = true;
    fetchTelemetryDashboardSummary(user, 14).then((snap) => {
      if (!active || !snap) return;
      setTelemetrySnapshot(snap);
      const rx = buildDailyAiPrescription({
        telemetrySnapshot: snap,
        targetHskLevel: smartSnapshot.targetHskLevel,
      });
      setAiBriefing(buildDeterministicTelemetryBriefing(snap, rx));
      fetchAiTelemetryBriefing(user, snap, rx).then((brief) => {
        if (active && brief) setAiBriefing(brief);
      });
    });

    fetchSmartCoachWithCacheAndFallback(user, smartSnapshot).then((plan) => {
      if (active && plan) setSmartCoachPlan(plan);
    });

    if (user?.id) {
      void syncSmartTelemetrySnapshotAsync(user, smartSnapshot);
    }

    return () => {
      active = false;
    };
  }, [user, smartSnapshot, smartSnapshot.targetHskLevel]);

  const handleForceRefreshCoach = useCallback(async () => {
    setCoachRefreshing(true);
    try {
      const next = await fetchSmartCoachWithCacheAndFallback(user, smartSnapshot, {
        forceRefresh: true,
      });
      if (next) setSmartCoachPlan(next);
    } finally {
      setCoachRefreshing(false);
    }
  }, [user, smartSnapshot]);

  const handleNavigateRoute = useCallback(
    (route: string, targetHash?: string) => {
      if (typeof window !== 'undefined' && targetHash) {
        window.location.hash = targetHash;
      }
      setActiveTab?.(route || 'roadmap');
    },
    [setActiveTab]
  );

  const navigateToLesson = (lessonId: number) => {
    if (onSelectLesson) {
      onSelectLesson({ id: lessonId });
    } else if (typeof window !== 'undefined') {
      window.location.hash = `#lesson?id=${lessonId}`;
    }
    setActiveTab?.('lesson');
  };

  const handleConfirmProposal = (proposal: any, confirmed: boolean) => {
    const pid = String(proposal?.id || proposal?.actionType || '');
    if (!confirmed) {
      setHandledProposalIds((prev) => ({ ...prev, [pid]: 'dismissed' }));
      setHitlStatusMsg('Đã bỏ qua đề xuất.');
      return;
    }
    const res = applyConfirmedHitlProposal(proposal, user, { confirmed: true });
    if (res.applied) {
      setHandledProposalIds((prev) => ({ ...prev, [pid]: 'applied' }));
      setHitlStatusMsg(
        res.actionType === 'save_vocab_to_srs'
          ? 'Đã xác nhận và thêm từ vào sổ ôn tập SRS!'
          : `Đã cập nhật mục tiêu ${res.targetHskLevel}!`
      );
      setRefreshTick((t) => t + 1);
    }
  };

  const maxCadenceMinutes = Math.max(
    15,
    ...(smartSnapshot.cadence?.last7Days || []).map((d) => Number(d.minutes || 0))
  );

  const visibleProposals = (smartCoachPlan?.pending_confirmations || []).filter(
    (p) => !handledProposalIds[String(p.id || p.actionType || '')]
  );

  return (
    <div className="min-h-dvh bg-amber-50/30 dark:bg-slate-950 py-5 sm:py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* KHỐI 1: TÓM TẮT HÔM NAY & HSK READINESS (ZERO MOCK DATA) */}
        <section
          aria-label="Tóm tắt hôm nay và Độ sẵn sàng HSK"
          className="p-4 sm:p-7 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-700 space-y-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-amber-300 text-xs font-bold uppercase">
                <Sparkles size={13} />
                <span>Trung tâm Học tập Thông minh · Dữ liệu thật 100%</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                AI Coach &amp; Telemetry HSK {smartSnapshot.targetHskLevel}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Tổng hợp từ lộ trình 180 bài, SRS, Snapshot bài thi HSK 2.0/3.0, Sổ lỗi sai và chuỗi ngày học giờ Việt Nam.
              </p>
            </div>

            {/* Filters: System + Target Level */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs font-bold">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'hsk_2_0', label: 'HSK 2.0' },
                  { id: 'hsk_3_0', label: 'HSK 3.0' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExamSystem(opt.id as 'all' | 'hsk_2_0' | 'hsk_3_0')}
                    className={`min-h-11 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      examSystem === opt.id
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <select
                aria-label="Chọn cấp độ HSK mục tiêu"
                value={targetLevelOverride || `HSK ${smartSnapshot.targetHskLevel}`}
                onChange={(e) => setTargetLevelOverride(e.target.value)}
                className="min-h-11 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white cursor-pointer"
              >
                {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Mục tiêu: {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 KPI Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>HSK Readiness</span>
                <Target size={15} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {smartSnapshot.readiness.score}%
              </div>
              <p className="text-xs text-slate-400">
                {smartSnapshot.readiness.isColdStart
                  ? 'Chưa có dữ liệu (0%)'
                  : `Đo từ ${smartSnapshot.readiness.recentExamCount} đề thi gần nhất`}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Chuỗi ngày học (VN)</span>
                <Flame size={15} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300">
                {smartSnapshot.cadence.streak} ngày
              </div>
              <p className="text-xs text-slate-400">
                7 ngày: {smartSnapshot.cadence.totalMinutes7d} phút
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>SRS đến hạn hôm nay</span>
                <Clock size={15} className="text-orange-400" />
              </div>
              <div className="text-2xl font-black text-orange-300">
                {smartSnapshot.roadmapAndSrs.dueToday} từ
              </div>
              <p className="text-xs text-slate-400">
                Hay quên: {smartSnapshot.roadmapAndSrs.leechCount} · Nhớ: {smartSnapshot.roadmapAndSrs.retentionPct}%
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Lộ trình &amp; Sổ lỗi</span>
                <AlertTriangle size={15} className="text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {smartSnapshot.roadmapAndSrs.completedCount}
                <span className="text-xs font-bold text-slate-400">/180</span>
              </div>
              <p className="text-xs text-rose-300">
                {smartSnapshot.mistakeClusters.activeMistakesCount} câu sai đang mở
              </p>
            </div>
          </div>

          {/* Transparent Readiness Breakdown or Cold-Start Empty State */}
          {smartSnapshot.readiness.isColdStart ? (
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-amber-300">
                  {smartSnapshot.isGuest ? 'Chế độ Khách — Chưa có dữ liệu (0%)' : 'Tài khoản mới — Chưa có dữ liệu (0%)'}
                </p>
                <p className="text-xs text-slate-300">
                  Hệ thống chỉ hiển thị số liệu thật của chính bạn. Hãy làm bài kiểm tra đầu vào hoặc ôn 5 từ đầu tiên để mở khóa phân tích.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNavigateRoute('hsk', '#hsk')}
                  className="min-h-11 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <GraduationCap size={14} />
                  <span>Làm bài kiểm tra xếp lớp</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateRoute('vocabulary', '#vocabulary')}
                  className="min-h-11 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Zap size={14} />
                  <span>Ôn 5 từ đầu tiên</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-extrabold text-slate-200">
                  Công thức HSK Readiness: 35% Từ vựng &amp; Lộ trình ({smartSnapshot.readiness.factors.vocabCoveragePct}%) · 45% Điểm 3 đề gần nhất ({smartSnapshot.readiness.factors.recentExamAvgPct}%) · 20% Sửa lỗi &amp; SRS ({smartSnapshot.readiness.factors.mistakeResolutionPct}%)
                </span>
              </div>
              {smartSnapshot.readiness.pullDownFactors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {smartSnapshot.readiness.pullDownFactors.slice(0, 3).map((factor) => (
                    <button
                      key={factor.key}
                      type="button"
                      onClick={() => handleNavigateRoute(factor.targetRoute, `#${factor.targetRoute}`)}
                      className="min-h-11 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-700/60 text-xs text-rose-200 hover:border-rose-400 text-left cursor-pointer inline-flex items-center gap-2"
                    >
                      <AlertTriangle size={13} className="text-rose-400 shrink-0" />
                      <span>{factor.reasonVi}</span>
                      <span className="font-bold text-white underline shrink-0">{factor.actionLabel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Unified Hub Sub-Navigation */}
          <div
            role="tablist"
            aria-label="Learning Intelligence Modules"
            className="flex flex-wrap gap-2 pt-1"
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
                  className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-2 ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* KHỐI 2: BIỂU ĐỒ NĂNG LỰC 5 KỸ NĂNG (ANSWER SNAPSHOTS) & NHỊP ĐỘ 7 NGÀY */}
        <section
          aria-label="Biểu đồ năng lực 5 kỹ năng và nhịp độ 7 ngày"
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* Left 7 cols: 5-Skill Accuracy (Exam vs Learning) */}
          <div className="lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Năng lực 5 Kỹ năng từ Snapshot đề thi
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tính từ answerSnapshots thật trên HSK 2.0 &amp; HSK 3.0 (tách Exam Mode vs Learning Mode).
                </p>
              </div>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold shrink-0">
                {[
                  { id: 'overall', label: 'Tổng hợp' },
                  { id: 'exam', label: 'Exam' },
                  { id: 'learning', label: 'Learning' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSkillModeFilter(m.id as 'overall' | 'exam' | 'learning')}
                    className={`min-h-11 px-2.5 py-1 rounded-lg cursor-pointer ${
                      skillModeFilter === m.id
                        ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {smartSnapshot.fiveSkills.list.map((sk) => {
                const displayPct =
                  skillModeFilter === 'exam'
                    ? sk.examPct
                    : skillModeFilter === 'learning'
                      ? sk.learningPct
                      : sk.hasData
                        ? sk.overallPct
                        : null;
                const val = displayPct ?? 0;
                const barColor =
                  val >= 75
                    ? 'bg-emerald-500'
                    : val >= 50
                      ? 'bg-amber-500'
                      : val > 0
                        ? 'bg-rose-500'
                        : 'bg-slate-300 dark:bg-slate-700';

                return (
                  <div key={sk.skill} className="space-y-1">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {sk.labelVi}
                      </span>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        {sk.hasData && skillModeFilter === 'overall' && (
                          <span className="hidden sm:inline text-xs">
                            Exam: {sk.examPct !== null ? `${sk.examPct}%` : '—'} · Learn: {sk.learningPct !== null ? `${sk.learningPct}%` : '—'}
                          </span>
                        )}
                        <span className="font-black text-slate-900 dark:text-white">
                          {displayPct !== null ? `${displayPct}%` : 'Chưa đo'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${Math.max(displayPct !== null && displayPct > 0 ? 6 : 0, val)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {smartSnapshot.fiveSkills.weakestSkill && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Kỹ năng cần ưu tiên:{' '}
                  <strong className="text-rose-600 dark:text-rose-400">
                    {smartSnapshot.fiveSkills.weakestSkill.labelVi} ({smartSnapshot.fiveSkills.weakestSkill.overallPct}%)
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleNavigateRoute(
                      smartSnapshot.fiveSkills.weakestSkill.targetRoute,
                      `#${smartSnapshot.fiveSkills.weakestSkill.targetRoute}`
                    )
                  }
                  className="min-h-11 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Luyện ngay</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Right 5 cols: Inline SVG 7-Day Cadence (VN Time) + Top Mistake Clusters */}
          <div className="lg:col-span-5 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Nhịp độ 7 ngày (Giờ VN)
                </h2>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {smartSnapshot.cadence.activeDays7d}/7 ngày hoạt động
                </span>
              </div>

              <svg
                viewBox="0 0 280 96"
                className="w-full h-24 text-slate-500 dark:text-slate-400"
                role="img"
                aria-label="Biểu đồ thời lượng học 7 ngày theo múi giờ Việt Nam"
              >
                <line x1="8" y1="72" x2="272" y2="72" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                {smartSnapshot.cadence.last7Days.map((day, idx) => {
                  const mins = Number(day.minutes || 0);
                  const barH = mins > 0 ? Math.max(6, Math.round((mins / maxCadenceMinutes) * 52)) : 3;
                  const x = 14 + idx * 38;
                  const y = 72 - barH;
                  return (
                    <g key={day.dateKey}>
                      <rect
                        x={x}
                        y={y}
                        width="22"
                        height={barH}
                        rx="4"
                        fill={mins > 0 ? (day.isToday ? '#E85D3F' : '#10B981') : 'currentColor'}
                        fillOpacity={mins > 0 ? '0.9' : '0.2'}
                      />
                      {mins > 0 && (
                        <text x={x + 11} y={y - 4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">
                          {Math.round(mins)}p
                        </text>
                      )}
                      <text x={x + 11} y="86" textAnchor="middle" fontSize="8" fill="currentColor">
                        {day.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Nhóm lỗi lặp lại nhiều nhất
                </span>
                <button
                  type="button"
                  onClick={() => handleNavigateRoute('hsk', '#hsk/mistakes')}
                  className="min-h-11 px-2 text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Mở Sổ lỗi sai
                </button>
              </div>
              {smartSnapshot.mistakeClusters.clusters.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chưa ghi nhận cụm lỗi sai lặp lại nào.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {smartSnapshot.mistakeClusters.clusters.slice(0, 3).map((cluster) => (
                    <button
                      key={cluster.key}
                      type="button"
                      onClick={() => handleNavigateRoute(cluster.targetRoute, cluster.targetHash)}
                      className="min-h-11 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {cluster.labelVi}
                      </span>
                      <span className="font-black text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                        {cluster.count} câu
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* KHỐI 3 & KHỐI 4: KẾ HOẠCH THÍCH ỨNG HÔM NAY + GỢI Ý LÃO SƯ AI & XÁC NHẬN HITL */}
        <section
          aria-label="Kế hoạch thích ứng hôm nay và Lão Sư AI"
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* Khối 3: Daily Adaptive Plan (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Kế hoạch Thích ứng Hôm nay
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {smartCoachPlan.source === 'ai_coach' ? 'AI Coach' : 'Luật thích ứng'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  3–4 nhiệm vụ ưu tiên cao nhất dựa trên dữ liệu thực tế lúc này.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab('smart_plan');
                    const el = document.getElementById('intelligence-smart-study-flow');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="min-h-11 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Zap size={13} />
                  <span>Khởi chạy Phiên Học Thích Ứng 15 Phút</span>
                </button>
                <button
                  type="button"
                  onClick={handleForceRefreshCoach}
                  disabled={coachRefreshing}
                  className="min-h-11 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-orange-500 cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw size={13} className={coachRefreshing ? 'animate-spin' : ''} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(smartCoachPlan?.dailyPlan || []).map((task: any, idx: number) => (
                <div
                  key={task.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-bold">
                        Ưu tiên #{task.priority || idx + 1}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ~{task.durationMinutes || 5} phút
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Tại sao nên học lúc này?</strong> {task.reason}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigateRoute(task.targetRoute, task.targetHash)}
                    className="min-h-11 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>{task.actionLabel || 'Bắt đầu ngay'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Khối 4: AI Coach Insight & HITL Confirmations (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Gợi ý Lão Sư AI &amp; Xác nhận HITL
                </h2>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-1.5">
                <div className="text-xs font-extrabold text-orange-700 dark:text-amber-300">
                  {smartCoachPlan.greeting || aiBriefing?.greeting}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {smartCoachPlan.coachInsight || aiBriefing?.summary}
                </p>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {smartCoachPlan.weakestSkillNote}
                </p>
              </div>

              {hitlStatusMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{hitlStatusMsg}</span>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">
                  Đề xuất cần bạn xác nhận (HITL)
                </h3>
                {visibleProposals.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chưa có thay đổi sổ SRS hoặc mục tiêu HSK nào đang chờ xác nhận.
                  </p>
                ) : (
                  visibleProposals.map((prop: any) => (
                    <div
                      key={prop.id || prop.label}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {prop.label}
                      </p>
                      {prop.reason && (
                        <p className="text-xs text-slate-600 dark:text-slate-300">{prop.reason}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleConfirmProposal(prop, true)}
                          className="min-h-11 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          Xác nhận
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmProposal(prop, false)}
                          className="min-h-11 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                        >
                          Bỏ qua
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleNavigateRoute('conversation', '#conversation/tutor')}
              className="min-h-11 w-full px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-orange-600 hover:bg-slate-800 dark:hover:bg-orange-700 text-white text-xs font-extrabold cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              <span>Hỏi sâu hơn với Lão Sư AI</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

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
                smartSnapshot={smartSnapshot}
                targetHskLevel={smartSnapshot.targetHskLevel}
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
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Sẵn sàng thi thử CBT mô phỏng chuẩn HSK 1–6 &amp; HSK 7–9?
              </div>
              <button
                type="button"
                onClick={() => setActiveTab?.('hsk')}
                className="min-h-11 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
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
