import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Clock,
  Flame,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import DashboardWidget from '../../components/dashboard/DashboardWidget.jsx';
import { setAdaptiveNavigationTarget } from '../../services/adaptiveLearningService.js';
import {
  fetchStudentAnalyticsSnapshot,
  type ActivityHeatmapDay,
  type ErrorPatternItem,
  type SkillRadarAxis,
  type StudentAnalyticsSnapshot,
} from './studentAnalyticsService.ts';

export interface StudentAnalyticsDashboardProps {
  user?: { id?: string | null; hskLevel?: number | string } | null;
  streak?: number;
  setActiveTab?: (tab: string) => void;
  initialSnapshot?: StudentAnalyticsSnapshot | null;
}

const RADAR_CENTER = 140;
const RADAR_RADIUS = 94;

function polarToCartesian(
  angleRad: number,
  radius: number
): { x: number; y: number } {
  return {
    x: Math.round((RADAR_CENTER + radius * Math.cos(angleRad)) * 100) / 100,
    y: Math.round((RADAR_CENTER + radius * Math.sin(angleRad)) * 100) / 100,
  };
}

function getHeatmapCellColor(minutes: number, items: number): string {
  if (items === 0 && minutes === 0) {
    return 'bg-[#F3ECE4] dark:bg-[#263244]';
  }
  if (minutes >= 30 || items >= 25) {
    return 'bg-[#E85D3F]';
  }
  if (minutes >= 15 || items >= 12) {
    return 'bg-[#F2856D]';
  }
  if (minutes >= 5 || items >= 4) {
    return 'bg-[#F8B4A4]';
  }
  return 'bg-[#FCD9D0] dark:bg-[#5E3028]';
}

export default function StudentAnalyticsDashboard({
  user = null,
  streak = 0,
  setActiveTab,
  initialSnapshot = null,
}: StudentAnalyticsDashboardProps) {
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

  const [targetHskLevel, setTargetHskLevel] = useState<number>(initialHsk);
  const [daysWindow, setDaysWindow] = useState<90 | 180>(90);
  const [snapshot, setSnapshot] = useState<StudentAnalyticsSnapshot | null>(
    initialSnapshot
  );
  const [loading, setLoading] = useState<boolean>(!initialSnapshot);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillRadarAxis | null>(null);
  const [hoveredCbtIdx, setHoveredCbtIdx] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<ActivityHeatmapDay | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchStudentAnalyticsSnapshot({
        user,
        hskLevel: targetHskLevel,
        daysWindow,
        streakHint: streak,
      });
      setSnapshot(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải dữ liệu phân tích học tập.'
      );
    } finally {
      setLoading(false);
    }
  }, [user, targetHskLevel, daysWindow, streak]);

  useEffect(() => {
    if (!initialSnapshot) {
      void loadAnalytics();
    }
  }, [initialSnapshot, loadAnalytics]);

  // Memoized Radar Chart Geometry
  const radarGeometry = useMemo(() => {
    const axes = snapshot?.skillRadar ?? [];
    if (axes.length === 0) return null;

    const step = (Math.PI * 2) / axes.length;
    const rings = [25, 50, 75, 100].map((pct) =>
      axes
        .map((_, idx) => {
          const pt = polarToCartesian(idx * step - Math.PI / 2, (pct / 100) * RADAR_RADIUS);
          return `${pt.x},${pt.y}`;
        })
        .join(' ')
    );

    const benchmarkPoints = axes
      .map((axis, idx) => {
        const pt = polarToCartesian(
          idx * step - Math.PI / 2,
          (axis.targetBenchmark / 100) * RADAR_RADIUS
        );
        return `${pt.x},${pt.y}`;
      })
      .join(' ');

    const currentPoints = axes
      .map((axis, idx) => {
        const pt = polarToCartesian(
          idx * step - Math.PI / 2,
          (axis.proficiency / 100) * RADAR_RADIUS
        );
        return `${pt.x},${pt.y}`;
      })
      .join(' ');

    const vertices = axes.map((axis, idx) => {
      const angle = idx * step - Math.PI / 2;
      const outer = polarToCartesian(angle, RADAR_RADIUS);
      const labelPos = polarToCartesian(angle, RADAR_RADIUS + 26);
      const dotPos = polarToCartesian(
        angle,
        (axis.proficiency / 100) * RADAR_RADIUS
      );
      return { axis, outer, labelPos, dotPos };
    });

    return { rings, benchmarkPoints, currentPoints, vertices };
  }, [snapshot?.skillRadar]);

  // Memoized Dual-Axis Time-Series Geometry
  const timeSeriesGeometry = useMemo(() => {
    const points = snapshot?.cbtProgress ?? [];
    if (points.length === 0) return null;

    const width = 520;
    const height = 210;
    const padX = 44;
    const padY = 24;
    const plotW = width - padX * 2;
    const plotH = height - padY * 2;

    const maxMinutes = Math.max(
      30,
      ...points.map((p) => p.studyMinutesOnDay || 0)
    );

    const mapped = points.map((pt, idx) => {
      const x =
        points.length === 1
          ? padX + plotW / 2
          : padX + (idx / (points.length - 1)) * plotW;
      const yScore = padY + plotH - (pt.normalizedPercent / 100) * plotH;
      const yStudy =
        padY + plotH - ((pt.studyMinutesOnDay || 0) / maxMinutes) * plotH;
      return { pt, x, yScore, yStudy };
    });

    const scoreLine = mapped.map((m) => `${m.x},${m.yScore}`).join(' ');
    const studyLine = mapped.map((m) => `${m.x},${m.yStudy}`).join(' ');

    return { width, height, padX, padY, plotW, plotH, maxMinutes, mapped, scoreLine, studyLine };
  }, [snapshot?.cbtProgress]);

  // Memoized Top Error Patterns & Max Occurrences
  const errorChartData = useMemo(() => {
    const patterns = snapshot?.errorPatterns ?? [];
    const maxOcc = Math.max(1, ...patterns.map((p) => p.totalOccurrences));
    return { patterns, maxOcc };
  }, [snapshot?.errorPatterns]);

  // Memoized Heatmap Weeks (columns of 7 days)
  const heatmapWeeks = useMemo(() => {
    const days = snapshot?.heatmap ?? [];
    const weeks: ActivityHeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [snapshot?.heatmap]);

  const handlePracticeWeaknesses = useCallback(
    (targetPattern?: ErrorPatternItem) => {
      const top = targetPattern ?? snapshot?.errorPatterns?.[0];
      if (!top) {
        setActiveTab?.('practice');
        return;
      }

      setAdaptiveNavigationTarget({
        targetTab: top.recommendedTab,
        source: top.recommendedSkill,
        levelNum: targetHskLevel,
        targetRef: top.errorCategory,
      });
      setActiveTab?.(top.recommendedTab);
    },
    [snapshot?.errorPatterns, targetHskLevel, setActiveTab]
  );

  const kpis = snapshot?.kpis;

  return (
    <section
      aria-label="Student Analytics Dashboard"
      className="space-y-6"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-[#E85D3F] text-[11px] font-bold uppercase tracking-wider">
            <BarChart3 size={13} />
            <span>Learning Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#243447] dark:text-white">
            Phân tích Năng lực & Tiến độ HSK
          </h2>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
            Tổng hợp dữ liệu thực tế từ bài học, SRS, luyện viết nét, phát âm và đề thi CBT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5B6B7F] dark:text-gray-300 bg-[#FAF6F0] dark:bg-[#0F172A] px-3 py-2 rounded-xl border border-[#EFE4D6] dark:border-[#2B3A4F]">
            <span>Mục tiêu:</span>
            <select
              aria-label="Chọn cấp độ HSK mục tiêu"
              value={targetHskLevel}
              onChange={(e) => setTargetHskLevel(Number(e.target.value))}
              className="bg-transparent font-bold text-[#E85D3F] focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <option key={lvl} value={lvl} className="dark:bg-[#1E293B]">
                  HSK {lvl}
                </option>
              ))}
            </select>
          </label>

          <div
            role="group"
            aria-label="Khoảng thời gian heatmap"
            className="inline-flex rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] p-1 border border-[#EFE4D6] dark:border-[#2B3A4F]"
          >
            {([90, 180] as const).map((win) => (
              <button
                key={win}
                type="button"
                onClick={() => setDaysWindow(win)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  daysWindow === win
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'text-[#748092] dark:text-gray-400 hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {win} ngày
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void loadAnalytics()}
            disabled={loading}
            className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-gray-300 hover:text-[#E85D3F] transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới phân tích"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              Tổng thời gian học
            </p>
            <p className="text-2xl font-extrabold text-[#243447] dark:text-white">
              {kpis?.totalStudyHours ?? 0} <span className="text-sm font-semibold">giờ</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              Chuỗi ngày học liên tiếp
            </p>
            <p className="text-2xl font-extrabold text-[#243447] dark:text-white">
              {kpis?.activeStreakDays ?? 0} <span className="text-sm font-semibold">ngày</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Target size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              Độ sẵn sàng HSK {targetHskLevel}
            </p>
            <p className="text-2xl font-extrabold text-[#243447] dark:text-white">
              {kpis?.hskReadinessScore ?? 0}%
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              Lỗi đang cần vá
            </p>
            <p className="text-2xl font-extrabold text-[#243447] dark:text-white">
              {kpis?.activeMistakesCount ?? 0} <span className="text-sm font-semibold">mục</span>
            </p>
          </div>
        </div>
      </div>

      {/* Onboarding Empty State for New Users */}
      {!loading && !error && snapshot?.isEmpty && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF8F2] to-white dark:from-[#1E293B] dark:to-[#0F172A] border border-dashed border-[#E85D3F]/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E85D3F]/10 text-[#E85D3F] flex items-center justify-center mx-auto">
            <Sparkles size={24} />
          </div>
          <div className="max-w-lg mx-auto space-y-1.5">
            <h3 className="text-lg font-extrabold text-[#243447] dark:text-white">
              Bắt đầu hành trình để mở khóa biểu đồ năng lực thực tế
            </h3>
            <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
              Bạn chưa có dữ liệu luyện tập cho HSK {targetHskLevel}. Hãy hoàn thành 1 bài học, ôn tập thẻ SRS hoặc làm 1 đề thi thử CBT — hệ thống sẽ tự động vẽ biểu đồ radar 6 kỹ năng và phân tích lỗi sai chi tiết.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab?.('roadmap')}
              className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Vào Lộ trình HSK
            </button>
            <button
              type="button"
              onClick={() => setActiveTab?.('vocabulary')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E5D8C8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer hover:border-[#E85D3F] transition-colors"
            >
              Ôn Từ vựng SRS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab?.('hsk-practice')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E5D8C8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer hover:border-[#E85D3F] transition-colors"
            >
              Thi thử CBT HSK
            </button>
          </div>
        </div>
      )}

      {/* Main Analytics Grid: Multi-Skill Radar + Error Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Skill Radar Chart */}
        <DashboardWidget
          title="Biểu đồ Radar 6 Kỹ năng"
          subtitle={`So sánh năng lực hiện tại với chuẩn mục tiêu HSK ${targetHskLevel}`}
          icon={Target}
          loading={loading}
          error={error}
          onRetry={() => void loadAnalytics()}
          className="lg:col-span-5"
        >
          {radarGeometry && (
            <div className="flex flex-col items-center space-y-3">
              <svg
                viewBox="0 0 280 280"
                className="w-full max-w-[290px] overflow-visible"
                role="img"
                aria-label="Multi-Skill Proficiency Radar Chart"
              >
                {/* Concentric grid rings */}
                {radarGeometry.rings.map((pts, i) => (
                  <polygon
                    key={i}
                    points={pts}
                    fill="none"
                    stroke="currentColor"
                    className="text-[#E5D8C8] dark:text-[#334155]"
                    strokeWidth={1}
                  />
                ))}

                {/* Radial spokes */}
                {radarGeometry.vertices.map(({ axis, outer }) => (
                  <line
                    key={axis.skillKey}
                    x1={RADAR_CENTER}
                    y1={RADAR_CENTER}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="currentColor"
                    className="text-[#E5D8C8] dark:text-[#334155]"
                    strokeWidth={1}
                  />
                ))}

                {/* Target HSK Benchmark Polygon */}
                <polygon
                  points={radarGeometry.benchmarkPoints}
                  fill="rgba(59, 130, 246, 0.08)"
                  stroke="#3B82F6"
                  strokeWidth={1.75}
                  strokeDasharray="4 3"
                />

                {/* Current Proficiency Polygon */}
                <polygon
                  points={radarGeometry.currentPoints}
                  fill="rgba(232, 93, 63, 0.22)"
                  stroke="#E85D3F"
                  strokeWidth={2.5}
                />

                {/* Interactive Vertices & Labels */}
                {radarGeometry.vertices.map(({ axis, labelPos, dotPos }) => (
                  <g
                    key={axis.skillKey}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSkill(axis)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => setHoveredSkill(axis)}
                  >
                    <circle
                      cx={dotPos.x}
                      cy={dotPos.y}
                      r={hoveredSkill?.skillKey === axis.skillKey ? 6 : 4}
                      fill="#E85D3F"
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-[#243447] dark:fill-gray-200 text-[10px] font-bold"
                    >
                      {axis.skillLabel}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Legend + Interactive Readout */}
              <div className="w-full flex flex-wrap items-center justify-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#243447] dark:text-gray-200">
                  <span className="w-3 h-3 rounded-sm bg-[#E85D3F]/30 border-2 border-[#E85D3F]" />
                  Hiện tại
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#748092] dark:text-gray-400">
                  <span className="w-3 h-3 rounded-sm bg-blue-500/10 border border-dashed border-blue-500" />
                  Chuẩn HSK {targetHskLevel} ({snapshot?.skillRadar[0]?.targetBenchmark ?? 75}%)
                </span>
              </div>

              {hoveredSkill && (
                <div className="w-full p-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#243447] dark:text-white">
                    {hoveredSkill.skillLabel}
                  </span>
                  <span className="text-[#748092] dark:text-gray-300">
                    Đạt <strong className="text-[#E85D3F]">{hoveredSkill.proficiency}%</strong> / Chuẩn {hoveredSkill.targetBenchmark}% ({hoveredSkill.attemptsCount} lượt)
                  </span>
                </div>
              )}
            </div>
          )}
        </DashboardWidget>

        {/* Error Breakdown & Mistake Notebook Widget */}
        <DashboardWidget
          title="Phân loại Lỗi sai & Sổ tay Khắc phục"
          subtitle="Phân tích tự động theo nhóm lỗi và mức độ đã nắm"
          icon={AlertTriangle}
          loading={loading}
          error={error}
          onRetry={() => void loadAnalytics()}
          action={
            <button
              type="button"
              onClick={() => handlePracticeWeaknesses()}
              className="px-3.5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              <BookOpen size={14} />
              <span>Practice Weaknesses Now</span>
            </button>
          }
          className="lg:col-span-7"
        >
          {errorChartData.patterns.length === 0 ? (
            <div className="py-10 text-center text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
              Chưa ghi nhận lỗi sai nào trong hệ thống. Khi bạn làm sai câu hỏi CBT, SRS hoặc nét chữ Hanzi Writer, biểu đồ phân loại sẽ xuất hiện tại đây.
            </div>
          ) : (
            <div className="space-y-3">
              {errorChartData.patterns.map((pattern) => {
                const widthPct = Math.max(
                  8,
                  Math.round(
                    (pattern.totalOccurrences / errorChartData.maxOcc) * 100
                  )
                );
                return (
                  <div
                    key={pattern.errorCategory}
                    className="p-3 rounded-2xl bg-[#FAF6F0]/70 dark:bg-[#0F172A]/70 border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white truncate">
                          {pattern.label}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                          {pattern.activeCount + pattern.reviewingCount} đang mở
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="text-[#748092] dark:text-gray-400">
                          Đã nắm:{' '}
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            {pattern.resolutionRate}%
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePracticeWeaknesses(pattern)}
                          className="text-[11px] font-bold text-[#E85D3F] hover:underline cursor-pointer"
                        >
                          Ôn nhóm này →
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-[#EFE4D6] dark:bg-[#1E293B] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#E85D3F] to-[#F59E0B] transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardWidget>
      </div>

      {/* Bottom Row: Dual-Axis CBT Progress + Study Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Time-Series Progress Chart (Dual-Axis SVG) */}
        <DashboardWidget
          title="Tiến độ Thi thử CBT & Thời lượng Học"
          subtitle="Trục kép: Điểm thi CBT (thang 200/300) & phút học mỗi ngày"
          icon={TrendingUp}
          loading={loading}
          error={error}
          onRetry={() => void loadAnalytics()}
          className="lg:col-span-7"
        >
          {!timeSeriesGeometry ? (
            <div className="py-10 text-center text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
              Chưa có bài thi thử CBT nào được nộp. Hãy thử 1 đề thi trong mục Luyện thi HSK để theo dõi đường tiến bộ.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <svg
                  viewBox={`0 0 ${timeSeriesGeometry.width} ${timeSeriesGeometry.height}`}
                  className="w-full min-w-[400px] h-52"
                  role="img"
                  aria-label="Dual-axis CBT Mock Exam and Daily Study Chart"
                >
                  {/* Horizontal Grid */}
                  {[0, 25, 50, 75, 100].map((pct) => {
                    const y =
                      timeSeriesGeometry.padY +
                      timeSeriesGeometry.plotH -
                      (pct / 100) * timeSeriesGeometry.plotH;
                    return (
                      <g key={pct}>
                        <line
                          x1={timeSeriesGeometry.padX}
                          y1={y}
                          x2={timeSeriesGeometry.width - timeSeriesGeometry.padX}
                          y2={y}
                          stroke="currentColor"
                          className="text-[#EFE4D6] dark:text-[#334155]"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={timeSeriesGeometry.padX - 6}
                          y={y + 3}
                          textAnchor="end"
                          className="fill-[#748092] dark:fill-gray-400 text-[9px]"
                        >
                          {pct}%
                        </text>
                        <text
                          x={timeSeriesGeometry.width - timeSeriesGeometry.padX + 6}
                          y={y + 3}
                          textAnchor="start"
                          className="fill-sky-600 dark:fill-sky-400 text-[9px]"
                        >
                          {Math.round((pct / 100) * timeSeriesGeometry.maxMinutes)}p
                        </text>
                      </g>
                    );
                  })}

                  {/* Daily Study Consistency Line (Right Axis) */}
                  {timeSeriesGeometry.mapped.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      points={timeSeriesGeometry.studyLine}
                    />
                  )}

                  {/* CBT Score Line (Left Axis) */}
                  {timeSeriesGeometry.mapped.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#E85D3F"
                      strokeWidth={2.75}
                      points={timeSeriesGeometry.scoreLine}
                    />
                  )}

                  {/* Data Nodes */}
                  {timeSeriesGeometry.mapped.map(({ pt, x, yScore, yStudy }, idx) => (
                    <g
                      key={pt.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredCbtIdx(idx)}
                      onMouseLeave={() => setHoveredCbtIdx(null)}
                    >
                      <circle
                        cx={x}
                        cy={yStudy}
                        r={3.5}
                        fill="#0EA5E9"
                      />
                      <circle
                        cx={x}
                        cy={yScore}
                        r={hoveredCbtIdx === idx ? 6 : 4.5}
                        fill="#E85D3F"
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />
                      <text
                        x={x}
                        y={timeSeriesGeometry.height - 4}
                        textAnchor="middle"
                        className="fill-[#748092] dark:fill-gray-400 text-[9px]"
                      >
                        {pt.date.slice(5)}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#243447] dark:text-gray-200">
                    <span className="w-3 h-0.5 bg-[#E85D3F]" />
                    Điểm CBT (% thang 200/300)
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-sky-600 dark:text-sky-400">
                    <span className="w-3 h-0.5 bg-sky-500" />
                    Thời lượng học (phút)
                  </span>
                </div>

                {hoveredCbtIdx !== null && timeSeriesGeometry.mapped[hoveredCbtIdx] && (
                  <span className="font-semibold text-[#243447] dark:text-white">
                    {timeSeriesGeometry.mapped[hoveredCbtIdx].pt.label}:{' '}
                    <strong className="text-[#E85D3F]">
                      {timeSeriesGeometry.mapped[hoveredCbtIdx].pt.rawScore}/
                      {timeSeriesGeometry.mapped[hoveredCbtIdx].pt.maxScore}
                    </strong>{' '}
                    ({timeSeriesGeometry.mapped[hoveredCbtIdx].pt.studyMinutesOnDay} phút)
                  </span>
                )}
              </div>
            </div>
          )}
        </DashboardWidget>

        {/* Study Activity Heatmap (90 / 180 days) */}
        <DashboardWidget
          title={`Bản đồ Nhiệt Chuyên cần (${daysWindow} ngày)`}
          subtitle="Mỗi ô biểu thị số phút học & độ chính xác theo ngày"
          icon={Activity}
          loading={loading}
          error={error}
          onRetry={() => void loadAnalytics()}
          className="lg:col-span-5"
        >
          <div className="space-y-3">
            <div className="overflow-x-auto pb-1">
              <div className="inline-flex gap-1">
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <button
                        key={day.date}
                        type="button"
                        onMouseEnter={() => setHoveredDay(day)}
                        onFocus={() => setHoveredDay(day)}
                        aria-label={`${day.date}: ${day.studyMinutes} phút, ${day.itemsReviewed} lượt`}
                        className={`w-3 h-3 rounded-[3px] transition-transform hover:scale-125 cursor-pointer ${getHeatmapCellColor(
                          day.studyMinutes,
                          day.itemsReviewed
                        )}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#748092] dark:text-gray-400">
              <span>
                {hoveredDay
                  ? `${hoveredDay.date}: ${hoveredDay.studyMinutes} phút · ${hoveredDay.itemsReviewed} lượt (${hoveredDay.accuracyRate}% đúng)`
                  : 'Di chuột vào từng ô để xem chi tiết ngày học'}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <span>Ít</span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F3ECE4] dark:bg-[#263244]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FCD9D0]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F8B4A4]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F2856D]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#E85D3F]" />
                <span>Nhiều</span>
              </div>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </section>
  );
}

