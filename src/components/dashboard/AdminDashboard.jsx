import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  ShieldAlert,
  Activity,
  ArrowRight,
  Lock,
  ChevronRight,
  RefreshCw,
  Award,
  MessageSquare,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import {
  getAdminOverviewMetrics,
  getUserDistributionData,
  getUserGrowthData,
  getPlatformLearningActivityData,
  getHskCurriculumDistributionData,
  getCommunityModerationOverviewData,
} from '../../services/adminAnalyticsService';
import {
  getAllProfilesFromDb,
  fetchAdminDashboardSummary,
} from '../../services/adminService';
import { getMaterialsFromDb } from '../../services/materialsService';
import {
  checkIsAdmin,
  createEmptyDashboardSummary,
  formatVietnamDateTime,
  redactPiiText,
} from '../admin/adminHelpers';
import { playClickSound } from '../../utils/audio';
import {
  UserDistributionChart,
  UserGrowthChart,
  PlatformActivityChart,
  CurriculumDistributionChart,
  CommunityModerationChart,
} from './charts';

export default function AdminDashboard({ user, setActiveTab, onNavigate = null }) {
  const isAdmin = checkIsAdmin(user);

  const [metrics, setMetrics] = useState({
    totalAccounts: 0,
    studentCount: 0,
    teacherCount: 0,
    adminCount: 0,
    blockedCount: 0,
    totalMaterials: 0,
    activeClassroomsCount: 0,
  });

  const [dashboardSummary, setDashboardSummary] = useState(() => createEmptyDashboardSummary());
  const [summaryError, setSummaryError] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [distributionData, setDistributionData] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [growthTimeframe, setGrowthTimeframe] = useState('30d');
  const [activityData, setActivityData] = useState(null);
  const [curriculumData, setCurriculumData] = useState(null);
  const [moderationData, setModerationData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAdminAnalytics = useCallback(
    async (tf = growthTimeframe) => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setSummaryError(null);

      try {
        const [
          summaryRes,
          metricsRes,
          distRes,
          growthRes,
          actRes,
          currRes,
          modRes,
          rawProfiles,
          rawMaterials,
        ] = await Promise.all([
          fetchAdminDashboardSummary().catch((err) => {
            setSummaryError(err?.message || 'Không thể tải tóm tắt điều hành từ máy chủ.');
            return null;
          }),
          getAdminOverviewMetrics().catch(() => ({})),
          getUserDistributionData().catch(() => null),
          getUserGrowthData(tf).catch(() => null),
          getPlatformLearningActivityData().catch(() => null),
          getHskCurriculumDistributionData().catch(() => null),
          getCommunityModerationOverviewData().catch(() => null),
          getAllProfilesFromDb().catch(() => []),
          getMaterialsFromDb().catch(() => []),
        ]);

        if (summaryRes && typeof summaryRes === 'object') {
          setDashboardSummary({ ...createEmptyDashboardSummary(), ...summaryRes });
        }
        setMetrics({
          ...(metricsRes || {}),
          totalMaterials:
            metricsRes?.totalMaterials ?? (Array.isArray(rawMaterials) ? rawMaterials.length : 0),
        });
        setDistributionData(distRes);
        setGrowthData(growthRes);
        setActivityData(actRes);
        setCurriculumData(currRes);
        setModerationData(modRes);
        setProfiles(Array.isArray(rawProfiles) ? rawProfiles : []);
      } catch (err) {
        console.warn('AdminDashboard load analytics notice:', err);
        setError('Không thể tải toàn bộ hệ thống phân tích quản trị.');
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, growthTimeframe]
  );

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    loadAdminAnalytics(growthTimeframe);
  }, [isAdmin, loadAdminAnalytics, growthTimeframe]);

  const handleTimeframeChange = async (tf) => {
    if (!isAdmin) return;
    setGrowthTimeframe(tf);
    try {
      const growthRes = await getUserGrowthData(tf);
      setGrowthData(growthRes);
    } catch (err) {
      console.warn('Error reloading growth data:', err);
    }
  };

  const handleNav = (tab, hash = null) => {
    playClickSound();
    const targetHash = hash || `#${tab}`;
    if (typeof window !== 'undefined') {
      window.location.hash = targetHash;
    }
    if (onNavigate) {
      onNavigate(tab);
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-900/50 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
          <Lock size={28} />
        </div>
        <h1 className="text-xl font-black text-[#243447] dark:text-white">
          Truy cập bị giới hạn
        </h1>
        <p className="text-sm text-[#748092] dark:text-[#94A3B8]">
          Trang điều hành Quản Trị Viên chỉ khả dụng với tài khoản Quản trị đang hoạt động.
        </p>
        <button
          type="button"
          onClick={() => handleNav('home', '#home')}
          className="min-h-11 px-5 py-2.5 rounded-2xl bg-[#E85D3F] text-white text-xs font-bold cursor-pointer"
        >
          Quay về Trang chủ
        </button>
      </div>
    );
  }

  const kpis = dashboardSummary.kpis || {};
  const trends7d =
    Array.isArray(dashboardSummary.trends7d) && dashboardSummary.trends7d.length > 0
      ? dashboardSummary.trends7d
      : createEmptyDashboardSummary().trends7d;
  const hskDistribution = Array.isArray(dashboardSummary.hskDistribution)
    ? dashboardSummary.hskDistribution
    : [];
  const urgentItems = Array.isArray(dashboardSummary.urgentItems)
    ? dashboardSummary.urgentItems
    : [];
  const serviceHealth = Array.isArray(dashboardSummary.serviceHealth)
    ? dashboardSummary.serviceHealth
    : [];
  const contentHealth = dashboardSummary.contentHealth || {};

  const totalUsers = kpis.totalUsers || metrics.totalAccounts || profiles.length || 0;
  const activeLearners7d = kpis.activeLearners7d || 0;
  const totalHskAttempts = kpis.totalHskAttempts || 0;
  const hsk20Attempts = kpis.hsk20Attempts || 0;
  const hsk30Attempts = kpis.hsk30Attempts || 0;
  const communityPostsCount = kpis.communityPostsCount || 0;
  const openReportsCount = kpis.openReportsCount || moderationData?.pendingReports || 0;
  const clientErrors24h = kpis.clientErrors24h || 0;

  const maxTrend = Math.max(1, ...trends7d.map((d) => Number(d.count) || 0));
  const totalDistCount = hskDistribution.reduce((acc, cur) => acc + (Number(cur.count) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
            <ShieldCheck size={14} />
            <span>Trung Tâm Điều Hành &amp; Giám Sát Hệ Thống (ADMIN)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bảng điều khiển Quản Trị Viên
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Số liệu thực tế từ cơ sở dữ liệu: tài khoản, HSK 2.0 &amp; 3.0, kiểm duyệt cộng đồng, sức khỏe học liệu và log sự cố client 24h.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => loadAdminAnalytics(growthTimeframe)}
            className="min-h-11 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin', '#admin?tab=overview')}
            className="min-h-11 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck size={15} />
            <span>Mở Trung Tâm Quản Trị</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin', '#admin?tab=users')}
            className="min-h-11 px-4 py-2.5 rounded-2xl bg-linear-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Users size={15} />
            <span>Quản lý Người dùng</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin', '#admin?tab=moderation')}
            className="min-h-11 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ShieldAlert size={15} />
            <span>Kiểm duyệt Báo cáo</span>
            {openReportsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {openReportsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {summaryError && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center justify-between gap-3">
          <span>{summaryError}</span>
          <button
            type="button"
            onClick={() => loadAdminAnalytics(growthTimeframe)}
            className="min-h-11 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 font-bold shrink-0 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 2. Key Operational KPI Bar (6 Zero-Mock Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Tổng người dùng</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {loading ? '...' : totalUsers.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
              {metrics.studentCount || 0} HV · {metrics.teacherCount || 0} GV · {metrics.blockedCount || 0} khóa
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Hoạt động 7 ngày</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {activeLearners7d.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
              {metrics.activeClassroomsCount || 0} lớp đang hoạt động
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Lượt nộp bài HSK</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {totalHskAttempts.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
              2.0: {hsk20Attempts} · 3.0: {hsk30Attempts}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Bài viết Cộng đồng</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {communityPostsCount.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
              {metrics.totalMaterials || contentHealth.materialsCount || 0} tài liệu số
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleNav('admin', '#admin?tab=moderation')}
          className="min-h-11 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] shadow-xs space-y-2 text-left transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-[#E85D3F] flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Báo cáo chờ xử lý</p>
            <p className="text-xl sm:text-2xl font-black text-[#E85D3F]">
              {openReportsCount.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-[#E85D3F]">Mở kiểm duyệt →</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav('admin', '#admin?tab=ai_metrics')}
          className="min-h-11 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] shadow-xs space-y-2 text-left transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Lỗi client 24h</p>
            <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {clientErrors24h.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-[#748092] dark:text-[#94A3B8]">Xem log sự cố →</p>
          </div>
        </button>
      </div>

      {/* 3. Live HSK 7-Day Vietnam Time Trend + HSK Level Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-black text-[#243447] dark:text-white">
              Xu hướng nộp bài HSK 7 ngày (giờ VN)
            </h2>
            <span className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
              Asia/Ho_Chi_Minh
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 280 112"
              role="img"
              aria-label="Biểu đồ lượt nộp bài HSK 7 ngày gần nhất"
              className="w-full h-32"
            >
              {trends7d.map((pt, idx) => {
                const count = Number(pt.count) || 0;
                const barHeight = Math.round((count / maxTrend) * 66);
                const x = 10 + idx * 38;
                const y = 80 - barHeight;
                return (
                  <g key={pt.date || idx}>
                    <rect
                      x={x}
                      y={14}
                      width={24}
                      height={66}
                      rx={4}
                      fill="#F1E5D8"
                      opacity={0.35}
                    />
                    {count > 0 && (
                      <rect
                        x={x}
                        y={y}
                        width={24}
                        height={barHeight}
                        rx={4}
                        fill="#E85D3F"
                      />
                    )}
                    <text
                      x={x + 12}
                      y={count > 0 ? Math.max(11, y - 3) : 74}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#748092"
                    >
                      {count}
                    </text>
                    <text
                      x={x + 12}
                      y={98}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#748092"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-black text-[#243447] dark:text-white">
              Phân bố lượt thi theo cấp độ HSK
            </h2>
            <span className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
              Tổng {totalDistCount} lượt
            </span>
          </div>

          {hskDistribution.length === 0 ? (
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] py-8 text-center">
              Chưa có dữ liệu nộp bài HSK nào trên máy chủ (0 lượt).
            </p>
          ) : (
            <div className="space-y-2.5">
              {hskDistribution.slice(0, 6).map((item) => {
                const count = Number(item.count) || 0;
                const pct = totalDistCount > 0 ? Math.round((count / totalDistCount) * 100) : 0;
                return (
                  <div key={item.level} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#243447] dark:text-white">{item.level}</span>
                      <span className="text-[#748092] dark:text-[#94A3B8]">
                        {count} lượt ({pct}%)
                      </span>
                    </div>
                    <svg viewBox="0 0 200 8" className="w-full h-2" aria-hidden="true">
                      <rect x="0" y="0" width="200" height="8" rx="4" fill="#F1E5D8" opacity="0.45" />
                      <rect x="0" y="0" width={Math.max(4, pct * 2)} height="8" rx="4" fill="#E85D3F" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. System Service Health (Zero Env Leak) + Read-only Content Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-black text-[#243447] dark:text-white flex items-center gap-2">
              <Cpu size={16} className="text-emerald-600" />
              <span>Trạng thái dịch vụ hệ thống</span>
            </h2>
            <button
              type="button"
              onClick={() => handleNav('admin', '#admin?tab=ai_metrics')}
              className="min-h-11 px-2 text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Hệ thống &amp; Log lỗi</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {serviceHealth.length === 0 ? (
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] py-4">
              Đang kiểm tra trạng thái các dịch vụ lõi từ máy chủ...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {serviceHealth.map((svc) => {
                const isHealthy = ['active', 'ready', 'online'].includes(svc.status);
                return (
                  <div
                    key={svc.id}
                    className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#243447] dark:text-white break-words">
                        {svc.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          isHealthy
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {isHealthy ? 'Sẵn sàng' : 'Giới hạn'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] break-words">
                      {svc.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-black text-[#243447] dark:text-white">
              Sức khỏe Kho đề &amp; Học liệu (Read-only)
            </h2>
            <span className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
              HSK 2.0 &amp; 3.0
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] dark:text-[#94A3B8] block">Câu hỏi HSK 2.0</span>
              <strong className="text-lg font-black text-[#243447] dark:text-white">
                {Number(contentHealth.hsk20QuestionsCount || 0).toLocaleString()}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] dark:text-[#94A3B8] block">Câu hỏi HSK 3.0</span>
              <strong className="text-lg font-black text-[#243447] dark:text-white">
                {Number(contentHealth.hsk30QuestionsCount || 0).toLocaleString()}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] dark:text-[#94A3B8] block">Ảnh HSK 1–5</span>
              <strong className="text-lg font-black text-[#E85D3F]">
                {Number(contentHealth.hsk15ImageCoveragePercent || 0)}%
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] dark:text-[#94A3B8] block">Tài liệu Thư viện</span>
              <strong className="text-lg font-black text-[#243447] dark:text-white">
                {Number(contentHealth.materialsCount || metrics.totalMaterials || 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Top 5 Urgent Admin Action Items */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-black text-[#243447] dark:text-white">
            5 Hoạt động quản trị cần xử lý ngay
          </h2>
          <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            {urgentItems.length} mục
          </span>
        </div>

        {urgentItems.length === 0 ? (
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Không có báo cáo vi phạm mới hoặc lỗi lặp cần xử lý lúc này.
          </p>
        ) : (
          <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
            {urgentItems.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="font-bold text-[#243447] dark:text-white break-words">
                    {redactPiiText(item.title)}
                  </p>
                  <p className="text-[#748092] dark:text-[#94A3B8] break-words">
                    {redactPiiText(item.summary)} · {formatVietnamDateTime(item.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleNav('admin', `#admin?tab=${item.targetTab || 'moderation'}`)
                  }
                  className="min-h-11 px-4 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] font-bold shrink-0 cursor-pointer"
                >
                  Xử lý
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Platform Analytics Charts (Preserved Interactive Deep Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <UserGrowthChart
            data={growthData}
            timeframe={growthTimeframe}
            onTimeframeChange={handleTimeframeChange}
            loading={loading}
            error={error}
            onRetry={() => loadAdminAnalytics(growthTimeframe)}
          />
        </div>
        <div className="lg:col-span-5">
          <UserDistributionChart
            data={distributionData}
            loading={loading}
            error={error}
            onRetry={() => loadAdminAnalytics(growthTimeframe)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <PlatformActivityChart
            data={activityData}
            loading={loading}
            error={error}
            onRetry={() => loadAdminAnalytics(growthTimeframe)}
          />
        </div>
        <div className="lg:col-span-6">
          <CurriculumDistributionChart
            data={curriculumData}
            loading={loading}
            error={error}
            onRetry={() => loadAdminAnalytics(growthTimeframe)}
          />
        </div>
      </div>

      <div>
        <CommunityModerationChart
          data={moderationData}
          loading={loading}
          error={error}
          onRetry={() => loadAdminAnalytics(growthTimeframe)}
        />
      </div>

      {/* 7. Recent Users & Admin Modules Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <DashboardWidget
            title="Thành viên mới đăng ký"
            subtitle="Danh sách người dùng mới gia nhập nền tảng thời gian gần đây"
            icon={Users}
            loading={loading}
            error={error}
            empty={profiles.length === 0}
            emptyMessage="Chưa có dữ liệu người dùng."
            action={
              <button
                type="button"
                onClick={() => handleNav('admin', '#admin?tab=users')}
                className="min-h-11 text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả ({profiles.length})</span>
                <ArrowRight size={13} />
              </button>
            }
          >
            <div className="overflow-x-auto divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
              {profiles.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white truncate">
                        {p.name || p.email?.split('@')[0] || 'Người dùng'}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          p.role === 'admin'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                            : p.role === 'teacher'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                        }`}
                      >
                        {p.role === 'admin' ? 'Admin' : p.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">{p.email}</p>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl shrink-0 ${
                      p.status === 'blocked'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                    }`}
                  >
                    {p.status === 'blocked' ? 'Đã khóa' : 'Hoạt động'}
                  </span>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#E85D3F]" />
              <span>Phân hệ Quản trị</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => handleNav('admin', '#admin?tab=users')}
                className="min-h-11 w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8]/50 dark:hover:bg-[#2B3A4F] flex items-center justify-between font-semibold transition-colors text-left cursor-pointer"
              >
                <div>
                  <p className="font-bold text-[#243447] dark:text-white">Quản lý người dùng</p>
                  <p className="text-[10px] text-[#748092]">Phân quyền và tạo tài khoản</p>
                </div>
                <ChevronRight size={15} className="text-[#748092]" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('admin', '#admin?tab=moderation')}
                className="min-h-11 w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8]/50 dark:hover:bg-[#2B3A4F] flex items-center justify-between font-semibold transition-colors text-left cursor-pointer"
              >
                <div>
                  <p className="font-bold text-[#243447] dark:text-white">Kiểm duyệt Cộng đồng</p>
                  <p className="text-[10px] text-[#748092]">Xử lý bài viết &amp; bình luận vi phạm</p>
                </div>
                <ChevronRight size={15} className="text-[#748092]" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('admin', '#admin?tab=materials')}
                className="min-h-11 w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8]/50 dark:hover:bg-[#2B3A4F] flex items-center justify-between font-semibold transition-colors text-left cursor-pointer"
              >
                <div>
                  <p className="font-bold text-[#243447] dark:text-white">Quản lý Thư viện số</p>
                  <p className="text-[10px] text-[#748092]">Thêm, sửa giáo trình BLCU</p>
                </div>
                <ChevronRight size={15} className="text-[#748092]" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('admin', '#admin?tab=ai_metrics')}
                className="min-h-11 w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8]/50 dark:hover:bg-[#2B3A4F] flex items-center justify-between font-semibold transition-colors text-left cursor-pointer"
              >
                <div>
                  <p className="font-bold text-[#243447] dark:text-white">Hệ thống AI, CDN &amp; Log lỗi</p>
                  <p className="text-[10px] text-[#748092]">Giám sát lỗi client &amp; dịch vụ</p>
                </div>
                <ChevronRight size={15} className="text-[#748092]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
