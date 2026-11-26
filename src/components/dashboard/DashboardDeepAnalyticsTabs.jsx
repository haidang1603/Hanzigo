import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import {
  ShieldCheck,
  BarChart3,
  GraduationCap,
  Users,
  Trophy,
  Flame,
  Crown,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  TrendingUp,
} from 'lucide-react';
import AudioButton from '../AudioButton';
import { playClickSound } from '../../utils/audio';
import { getXpHonorificTitle } from '../../utils/communitySafety';
import {
  computeLocalTelemetrySnapshot,
  fetchTelemetryDashboardSummary,
} from '../../core/telemetry/learningTelemetryService.js';
import { buildSmartLearningSnapshot } from '../../services/smartLearningTelemetryService.js';

const HskReadinessRadarCard = lazy(() =>
  import('../../features/analytics/HskReadinessRadarCard.jsx')
);
const TelemetryVisualAnalyticsGrid = lazy(() =>
  import('../../features/analytics/TelemetryVisualAnalyticsGrid.jsx')
);
const SrsRetentionDashboard = lazy(() =>
  import('../../features/srs/SrsRetentionDashboard.tsx')
);

function TabLoadingFallback({ label }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] p-8 text-center text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
      <div className="inline-block w-6 h-6 rounded-full border-2 border-[#E85D3F] border-t-transparent animate-spin mb-2" />
      <p>{label || 'Đang tải dữ liệu phân tích...'}</p>
    </div>
  );
}

const DEEP_TABS = [
  { id: 'readiness', label: 'Năng lực HSK', icon: ShieldCheck },
  { id: 'telemetry', label: 'Biểu đồ & Telemetry', icon: BarChart3 },
  { id: 'community', label: 'Lớp học & Cộng đồng', icon: Users },
];

export default function DashboardDeepAnalyticsTabs({
  user,
  setActiveTab,
  targetHskLevel = 1,
  calculatedTotalXp = 0,
  dailyGoalMinutes = 15,
  weeklyStudyMinutes = [],
  totalWeeklyHours = '0.0',
  todayData = null,
  achievedDaysCount = 0,
  daysPassedCount = 1,
  dynamicAchievements = [],
  unlockedAchievementsCount = 0,
  studentClassrooms = [],
  studentAssignments = [],
  loadingClassroomData = false,
  localReviewList = [],
  onMarkReviewDone,
}) {
  const [activeDeepTab, setActiveDeepTab] = useState('readiness');
  const [telemetrySnapshot, setTelemetrySnapshot] = useState(() =>
    computeLocalTelemetrySnapshot({ user })
  );
  const [telemetryLoaded, setTelemetryLoaded] = useState(false);

  const smartSnapshot = useMemo(
    () => buildSmartLearningSnapshot(user, { targetHskLevel }),
    [user, targetHskLevel]
  );

  // Lazy-fetch cloud telemetry summary only once when readiness/telemetry tab is active
  useEffect(() => {
    if (telemetryLoaded) return;
    if (activeDeepTab !== 'readiness' && activeDeepTab !== 'telemetry') return;

    let isMounted = true;
    fetchTelemetryDashboardSummary(user, 14)
      .then((snap) => {
        if (isMounted && snap) {
          setTelemetrySnapshot(snap);
        }
        if (isMounted) setTelemetryLoaded(true);
      })
      .catch(() => {
        if (isMounted) setTelemetryLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [activeDeepTab, telemetryLoaded, user]);

  // 6-skill strength / weakness summary derived from telemetrySnapshot + real exam answerSnapshots
  const skillSummary = useMemo(() => {
    const tri = telemetrySnapshot?.triDimensionalMastery || {};
    const avgLat = telemetrySnapshot?.avg_response_latency_ms || {};
    const retention = Number(telemetrySnapshot?.retention_rate_pct || 0);
    const examSkills = smartSnapshot?.fiveSkills?.skills || {};

    const scoreFromLatency = (ms, goldMs) => {
      if (!ms || ms <= 0) return 0;
      if (ms <= goldMs) return 88;
      return Math.max(25, Math.round((goldMs / ms) * 85));
    };

    const pickRealOrLatency = (examKey, latencyScore) => {
      const ex = examSkills[examKey];
      if (ex?.hasData) return Math.round(ex.overallPct || 0);
      return latencyScore;
    };

    const items = [
      { key: 'listening', label: 'Nghe hiểu', score: pickRealOrLatency('listening', scoreFromLatency(avgLat.listening, 12000)), tab: 'listening-studio' },
      { key: 'reading', label: 'Đọc hiểu', score: pickRealOrLatency('reading', scoreFromLatency(avgLat.reading, 35000)), tab: 'reader' },
      { key: 'vocabulary', label: 'Từ vựng SRS', score: Math.round(Number(tri.meaningPct || smartSnapshot?.roadmapAndSrs?.retentionPct || retention || 0)), tab: 'vocabulary' },
      { key: 'grammar', label: 'Ngữ pháp', score: scoreFromLatency(avgLat.grammar, 25000), tab: 'grammar' },
      { key: 'writing', label: 'Viết / Dịch', score: pickRealOrLatency('writing', Math.round(Number(tri.writingPct || 0))), tab: 'writing' },
      { key: 'pronunciation', label: 'Phát âm / Nói', score: pickRealOrLatency('speaking', Math.round(Number(tri.pronunciationPct || 0))), tab: 'pronunciation' },
    ];

    const sorted = [...items].sort((a, b) => b.score - a.score);
    const hasData = items.some((s) => s.score > 0);
    return {
      items,
      hasData,
      strongest: sorted[0],
      weakest: sorted[sorted.length - 1],
    };
  }, [telemetrySnapshot, smartSnapshot]);

  return (
    <section
      aria-label="Phân tích chuyên sâu và mở rộng"
      className="space-y-4"
    >
      {/* Compact Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
            Phân tích chuyên sâu & Mở rộng
          </h2>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Chuyển tab để xem chi tiết năng lực HSK, biểu đồ học tập hoặc hoạt động lớp học.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Tab phân tích học viên"
          className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto max-w-full scrollbar-none shadow-xs"
        >
          {DEEP_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDeepTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  playClickSound();
                  setActiveDeepTab(tab.id);
                }}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E85D3F] text-white shadow-sm'
                    : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: NĂNG LỰC HSK (MẶC ĐỊNH) */}
      {activeDeepTab === 'readiness' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-7">
            <Suspense fallback={<TabLoadingFallback label="Đang tải biểu đồ Radar 6 kỹ năng..." />}>
              <HskReadinessRadarCard
                snapshot={telemetrySnapshot}
                smartSnapshot={smartSnapshot}
                targetHskLevel={targetHskLevel}
                onLaunchExam={() => {
                  playClickSound();
                  setActiveTab('hsk');
                }}
              />
            </Suspense>
          </div>

          <div className="lg:col-span-5 space-y-5">
            {/* 6-Skill Strength & Weakness Summary */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black text-[#243447] dark:text-white">
                  Tóm tắt 6 kỹ năng HSK
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab('intelligence');
                  }}
                  className="min-h-[44px] px-2 text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Trung tâm AI</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="space-y-2.5">
                {skillSummary.items.map((skill) => (
                  <div key={skill.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#243447] dark:text-slate-200">
                        {skill.label}
                      </span>
                      <span className="font-bold text-[#748092] dark:text-[#94A3B8]">
                        {skill.score > 0 ? `${skill.score}%` : 'Chưa đo'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          skill.score >= 70
                            ? 'bg-[#45B97C]'
                            : skill.score >= 40
                            ? 'bg-amber-500'
                            : 'bg-[#E85D3F]'
                        }`}
                        style={{ width: `${Math.max(skill.score > 0 ? 8 : 0, skill.score)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {skillSummary.hasData ? (
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
                  <div className="p-2.5 rounded-2xl bg-[#EBF8F2] dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60">
                    <span className="block text-[10px] font-bold text-[#45B97C] uppercase">
                      Điểm mạnh nhất
                    </span>
                    <span className="font-bold text-[#243447] dark:text-white">
                      {skillSummary.strongest.label} ({skillSummary.strongest.score}%)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveTab(skillSummary.weakest.tab);
                    }}
                    className="p-2.5 rounded-2xl bg-[#FDEEEB] dark:bg-[#2D1E1B] border border-[#E85D3F]/30 text-left hover:border-[#E85D3F] transition-colors cursor-pointer"
                  >
                    <span className="block text-[10px] font-bold text-[#E85D3F] uppercase">
                      Cần bồi dưỡng →
                    </span>
                    <span className="font-bold text-[#243447] dark:text-white">
                      {skillSummary.weakest.label}
                    </span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] bg-[#FFF9F2] dark:bg-[#131B24] p-3 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  Hoàn thành 1 phiên SRS hoặc 1 đề thi thử CBT để hệ thống tự động chấm điểm mạnh/yếu 6 kỹ năng.
                </p>
              )}
            </div>

            {/* Compact Achievements Preview */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                  <Trophy size={16} className="text-[#F4B942]" />
                  <span>Huy hiệu thành tích</span>
                </h3>
                <span className="text-xs font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2.5 py-0.5 rounded-full">
                  {unlockedAchievementsCount}/{dynamicAchievements.length} đạt
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {dynamicAchievements.slice(0, 4).map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      ach.unlocked
                        ? 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F4B942]/60 shadow-2xs'
                        : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-45'
                    }`}
                  >
                    <span className="text-xl block mb-0.5">{ach.icon}</span>
                    <p className="text-xs font-bold text-[#243447] dark:text-white truncate">
                      {ach.name}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('profile');
                }}
                className="min-h-[44px] w-full py-2.5 rounded-xl text-xs font-bold text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] hover:bg-[#FCD8D2] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Xem toàn bộ phòng truyền thống</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BIỂU ĐỒ & TELEMETRY (LAZY-RENDERED) */}
      {activeDeepTab === 'telemetry' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Suspense fallback={<TabLoadingFallback label="Đang tải lưới phân tích Telemetry..." />}>
            <TelemetryVisualAnalyticsGrid
              snapshot={telemetrySnapshot}
              onSelectLevel={() => {
                playClickSound();
                setActiveTab('roadmap');
              }}
              setActiveTab={setActiveTab}
            />
          </Suspense>

          {/* Weekly Learning Activity Bar Chart */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#E85D3F]" />
                    <span>Thời gian học tập theo tuần ({totalWeeklyHours} giờ)</span>
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Thời gian thực</span>
                  </span>
                </div>
                {todayData && (
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                    Mục tiêu {dailyGoalMinutes} phút/ngày • Hôm nay ({todayData.fullName}):{' '}
                    <strong className="text-[#E85D3F]">{Math.round(todayData.minutes)} phút</strong>
                  </p>
                )}
              </div>

              <span className="text-xs font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/20 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-center">
                {achievedDaysCount}/{daysPassedCount} ngày đạt chỉ tiêu
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-4 pb-2 px-1">
              {weeklyStudyMinutes.map((d, index) => {
                const maxBenchmark = Math.max(dailyGoalMinutes, 50);
                const heightPercent =
                  d.minutes > 0
                    ? Math.min(100, Math.max(14, Math.round((d.minutes / maxBenchmark) * 100)))
                    : 0;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 h-full justify-end select-none"
                  >
                    <div className="h-5 flex items-center justify-center">
                      {d.isFuture ? (
                        <span className="text-[10px] font-medium text-[#94A3B8]/50">-</span>
                      ) : (
                        <span
                          className={`text-[10px] sm:text-[11px] font-bold flex items-center gap-0.5 ${
                            d.isToday
                              ? 'text-[#E85D3F]'
                              : d.reachedGoal
                              ? 'text-[#45B97C]'
                              : 'text-[#748092] dark:text-[#94A3B8]'
                          }`}
                        >
                          {Math.round(d.minutes)}p
                          {d.reachedGoal && <Check size={10} className="text-[#45B97C]" />}
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-full max-w-[40px] rounded-2xl h-full flex items-end p-1 transition-all ${
                        d.isToday
                          ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border-2 border-[#E85D3F]/40 shadow-sm'
                          : d.isFuture
                          ? 'bg-[#FAF8F5]/40 dark:bg-[#131B24]/40 border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F]'
                          : 'bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                      }`}
                    >
                      {d.minutes > 0 ? (
                        <div
                          className={`w-full rounded-xl transition-all duration-500 ${
                            d.isToday
                              ? 'bg-gradient-to-t from-[#E85D3F] via-[#F4B942] to-[#F4B942]'
                              : d.reachedGoal
                              ? 'bg-[#E85D3F]/85'
                              : 'bg-[#E85D3F]/50'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      ) : (
                        <div className="w-full h-1 bg-[#F1E5D8] dark:bg-[#2B3A4F] rounded-full mx-auto opacity-40" />
                      )}
                    </div>

                    <div className="text-center">
                      <span
                        className={`block text-xs font-black ${
                          d.isToday
                            ? 'text-[#E85D3F]'
                            : d.isFuture
                            ? 'text-[#94A3B8]/60 dark:text-[#94A3B8]/40'
                            : 'text-[#243447] dark:text-[#CBD5E1]'
                        }`}
                      >
                        {d.day}
                      </span>
                      <span
                        className={`text-[9px] font-medium block -mt-0.5 ${
                          d.isToday ? 'text-[#E85D3F] font-bold' : 'text-[#94A3B8]'
                        }`}
                      >
                        {d.displayDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Suspense fallback={<TabLoadingFallback label="Đang tải phân tích trí nhớ SRS..." />}>
            <SrsRetentionDashboard user={user} setActiveTab={setActiveTab} />
          </Suspense>
        </div>
      )}

      {/* TAB 3: LỚP HỌC & CỘNG ĐỒNG (LAZY-RENDERED) */}
      {activeDeepTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Left 8 cols: Classroom Assignments + Quick SRS Queue */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <GraduationCap size={20} className="text-[#3B82F6]" />
                    <span>Lớp học & Bài tập được giao</span>
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                    Theo dõi bài tập về nhà, thời hạn nộp và nhận xét từ giáo viên.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    window.location.hash = '#classroom';
                    setActiveTab('classroom');
                  }}
                  className="min-h-[44px] px-3 rounded-xl text-xs font-bold text-[#3B82F6] hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-1 cursor-pointer"
                >
                  <span>Vào Lớp học</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {loadingClassroomData ? (
                <div className="py-6 text-center text-xs text-[#748092] dark:text-[#94A3B8]">
                  Đang cập nhật bài tập lớp học...
                </div>
              ) : studentAssignments.length > 0 ? (
                <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                  {studentAssignments.slice(0, 4).map((item) => {
                    const isSubmitted = Boolean(item.submission);
                    const isGraded = Boolean(item.submission?.graded);
                    const isOverdue =
                      item.due_date &&
                      !isSubmitted &&
                      new Date(item.due_date).getTime() < Date.now();

                    return (
                      <div
                        key={item.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                              {item.classroom_name}
                            </span>
                            <h4 className="text-sm font-bold text-[#243447] dark:text-white truncate">
                              {item.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#748092] dark:text-[#94A3B8]">
                            {item.due_date && (
                              <span className="flex items-center gap-1 text-[11px]">
                                <Clock
                                  size={12}
                                  className={isOverdue ? 'text-rose-500' : 'text-[#748092]'}
                                />
                                <span className={isOverdue ? 'text-rose-500 font-bold' : ''}>
                                  Hạn: {new Date(item.due_date).toLocaleDateString('vi-VN')}
                                </span>
                              </span>
                            )}
                            {isGraded && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Điểm: {item.submission.score}/100 đ
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {isGraded ? (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                              Đã chấm
                            </span>
                          ) : isSubmitted ? (
                            <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
                              Đã nộp bài
                            </span>
                          ) : isOverdue ? (
                            <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold flex items-center gap-1">
                              <AlertTriangle size={12} />
                              Quá hạn
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold">
                              Cần làm
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              window.location.hash = `#classroom/${item.classroom_id}/assignments`;
                              setActiveTab('classroom');
                            }}
                            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            {isSubmitted ? 'Xem bài' : 'Làm bài'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : studentClassrooms.length > 0 ? (
                <div className="py-6 text-center text-xs text-[#748092] dark:text-[#94A3B8] space-y-2">
                  <p>
                    🎉 Bạn đã tham gia <strong>{studentClassrooms.length}</strong> lớp học. Hiện
                    không có bài tập cần nộp gấp.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      window.location.hash = '#classroom';
                      setActiveTab('classroom');
                    }}
                    className="min-h-[44px] px-3 text-[#3B82F6] font-bold hover:underline cursor-pointer"
                  >
                    Vào không gian lớp học ➔
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#748092] dark:text-[#94A3B8] space-y-2">
                  <p>Bạn chưa tham gia lớp học nào trên HanziGo.</p>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      window.location.hash = '#classroom/join';
                      setActiveTab('classroom');
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#3B82F6] font-bold hover:bg-blue-100 transition-colors inline-flex items-center cursor-pointer"
                  >
                    + Nhập mã tham gia lớp học ngay
                  </button>
                </div>
              )}
            </div>

            {/* Quick SRS Review Queue */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                  <RotateCcw size={17} className="text-[#D97706]" />
                  <span>Ôn nhanh từ vựng hôm nay</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab('vocabulary');
                  }}
                  className="min-h-[44px] px-2 text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Mở Flashcard đầy đủ</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {localReviewList.length > 0 ? (
                <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                  {localReviewList.map((word) => (
                    <div key={word.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-['Noto_Serif_SC'] text-2xl font-black text-[#243447] dark:text-white min-w-[56px]">
                          {word.hanzi}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#E85D3F]">{word.pinyin}</span>
                          <p className="text-xs text-[#748092] dark:text-[#94A3B8] truncate">
                            {word.meaning}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <AudioButton text={word.hanzi} size="sm" variant="ghost" />
                        <button
                          type="button"
                          onClick={() => onMarkReviewDone?.(word.id)}
                          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Đã ôn xong từ này"
                        >
                          <Check size={13} />
                          <span className="hidden sm:inline">Đã thuộc</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-xs text-[#748092] dark:text-[#94A3B8]">
                  🎉 Tuyệt vời! Không còn từ tồn đọng cần ôn nhanh.
                </p>
              )}
            </div>
          </div>

          {/* Right 4 cols: Leaderboard + Daily Challenge */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white border border-white/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy size={16} className="text-amber-400" />
                  <span>Bảng Xếp Hạng Cao Thủ</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab('leaderboard');
                  }}
                  className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Top 50</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-[#E85D3F] flex items-center justify-center font-bold text-white shadow-sm">
                    <Crown size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">
                      Điểm tích lũy
                    </div>
                    <div className="font-mono text-base font-black text-amber-300 flex items-center gap-1">
                      <Zap size={14} className="fill-amber-300" />
                      <span>{calculatedTotalXp.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {getXpHonorificTitle(calculatedTotalXp).title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('leaderboard');
                }}
                className="min-h-[44px] w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Mở Bảng Xếp Hạng</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FEF7E9] to-[#FFF9F2] dark:from-[#1E293B] dark:to-[#131B24] border border-[#F4B942]/50 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D97706] flex items-center gap-1.5 uppercase tracking-wide">
                  <Flame size={14} className="fill-[#F4B942]" />
                  <span>Thử thách hôm nay</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                  +50 XP
                </span>
              </div>
              <p className="text-xs text-[#243447] dark:text-white font-semibold">
                Đặt câu với cặp liên từ Vì... Nên... (因为...所以...)
              </p>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('community');
                }}
                className="min-h-[44px] w-full py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                <span>Vào Cộng đồng nộp bài</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
