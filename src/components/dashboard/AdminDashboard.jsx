import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap,
  UserCheck, 
  BookOpen, 
  FolderDown, 
  ShieldAlert, 
  Activity, 
  ArrowRight, 
  Lock, 
  ChevronRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import { 
  getAdminOverviewMetrics,
  getUserDistributionData,
  getUserGrowthData,
  getPlatformLearningActivityData,
  getHskCurriculumDistributionData,
  getCommunityModerationOverviewData
} from '../../services/adminAnalyticsService';
import { getAllProfilesFromDb } from '../../services/adminService';
import { getMaterialsFromDb } from '../../services/materialsService';
import { playClickSound } from '../../utils/audio';
import {
  UserDistributionChart,
  UserGrowthChart,
  PlatformActivityChart,
  CurriculumDistributionChart,
  CommunityModerationChart
} from './charts';

export default function AdminDashboard({ user, setActiveTab, onNavigate = null }) {
  const [metrics, setMetrics] = useState({
    totalAccounts: 0,
    studentCount: 0,
    teacherCount: 0,
    adminCount: 0,
    blockedCount: 0,
    totalMaterials: 0,
    activeClassroomsCount: 0
  });

  const [profiles, setProfiles] = useState([]);
  const [distributionData, setDistributionData] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [growthTimeframe, setGrowthTimeframe] = useState('30d');
  const [activityData, setActivityData] = useState(null);
  const [curriculumData, setCurriculumData] = useState(null);
  const [moderationData, setModerationData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAdminAnalytics = async (tf = growthTimeframe) => {
    setLoading(true);
    setError(null);
    try {
      const [
        metricsRes,
        distRes,
        growthRes,
        actRes,
        currRes,
        modRes,
        rawProfiles,
        rawMaterials
      ] = await Promise.all([
        getAdminOverviewMetrics().catch(() => ({})),
        getUserDistributionData().catch(() => null),
        getUserGrowthData(tf).catch(() => null),
        getPlatformLearningActivityData().catch(() => null),
        getHskCurriculumDistributionData().catch(() => null),
        getCommunityModerationOverviewData().catch(() => null),
        getAllProfilesFromDb().catch(() => []),
        getMaterialsFromDb().catch(() => [])
      ]);

      setMetrics(metricsRes || {});
      setDistributionData(distRes);
      setGrowthData(growthRes);
      setActivityData(actRes);
      setCurriculumData(currRes);
      setModerationData(modRes);
      setProfiles(rawProfiles || []);
    } catch (err) {
      console.warn('AdminDashboard load analytics notice:', err);
      setError('Không thể tải toàn bộ hệ thống phân tích quản trị.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminAnalytics(growthTimeframe);
  }, []);

  const handleTimeframeChange = async (tf) => {
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
    if (hash) window.location.hash = hash;
    else window.location.hash = `#${tab}`;
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
            <ShieldCheck size={14} />
            <span>Trung Tâm Điều Hành & Giám Sát Hệ Thống</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bảng điều khiển Quản Trị Viên
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Giám sát thời gian thực người dùng, lớp học, tài nguyên giáo trình và kiểm duyệt cộng đồng với số liệu xác thực.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('admin', '#admin#users')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Users size={15} />
            <span>Quản lý Người dùng</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin', '#admin#moderation')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ShieldAlert size={15} />
            <span>Kiểm duyệt Báo cáo</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        
        {/* Total Accounts */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Tổng tài khoản</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {metrics.totalAccounts || profiles.length}
            </p>
          </div>
        </div>

        {/* Students */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Học viên</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {metrics.studentCount || 0}
            </p>
          </div>
        </div>

        {/* Teachers */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Giáo viên</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {metrics.teacherCount || 0}
            </p>
          </div>
        </div>

        {/* Active Classrooms */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Lớp hoạt động</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {metrics.activeClassroomsCount || 0}
            </p>
          </div>
        </div>

        {/* Materials */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <FolderDown size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Tài liệu số</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {metrics.totalMaterials || 0}
            </p>
          </div>
        </div>

        {/* Blocked Accounts */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Lock size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Bị khóa</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {metrics.blockedCount || 0}
            </p>
          </div>
        </div>

      </div>

      {/* 3. Row 2: User Growth (Area) + User Distribution (Donut) */}
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

      {/* 4. Row 3: Platform Activity (Bar) + HSK Curriculum Distribution (Horizontal Bar) */}
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

      {/* 5. Row 4: Community Moderation Overview */}
      <div>
        <CommunityModerationChart
          data={moderationData}
          loading={loading}
          error={error}
          onRetry={() => loadAdminAnalytics(growthTimeframe)}
        />
      </div>

      {/* 6. Row 5: Recent Users & System Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Recent Registrations */}
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
                onClick={() => handleNav('admin', '#admin#users')}
                className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả ({profiles.length})</span>
                <ArrowRight size={13} />
              </button>
            }
          >
            <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
              {profiles.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white truncate">
                        {p.name || p.email?.split('@')[0] || 'Người dùng'}
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                        p.role === 'admin' 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                          : p.role === 'teacher'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                      }`}>
                        {p.role === 'admin' ? 'Admin' : p.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">{p.email}</p>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl ${
                    p.status === 'blocked'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                  }`}>
                    {p.status === 'blocked' ? 'Đã khóa' : 'Hoạt động'}
                  </span>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>

        {/* Right Column (4 cols): Quick Admin Management Hub */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#E85D3F]" />
              <span>Phân hệ Quản trị</span>
            </h3>
            
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => handleNav('admin', '#admin#users')}
                className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8]/50 dark:hover:bg-[#2B3A4F] flex items-center justify-between font-semibold transition-colors text-left"
              >
                <div>
                  <p className="font-bold text-[#243447] dark:text-white">Quản lý người dùng</p>
                  <p className="text-[10px] text-[#748092]">Phân quyền và tạo tài khoản</p>
                </div>
                <ChevronRight size={15} className="text-[#748092]" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('admin', '#admin#moderation')}
                className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8]/50 dark:hover:bg-[#2B3A4F] flex items-center justify-between font-semibold transition-colors text-left"
              >
                <div>
                  <p className="font-bold text-[#243447] dark:text-white">Kiểm duyệt Cộng đồng</p>
                  <p className="text-[10px] text-[#748092]">Xử lý bài viết & bình luận vi phạm</p>
                </div>
                <ChevronRight size={15} className="text-[#748092]" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('admin', '#admin#materials')}
                className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8]/50 dark:hover:bg-[#2B3A4F] flex items-center justify-between font-semibold transition-colors text-left"
              >
                <div>
                  <p className="font-bold text-[#243447] dark:text-white">Quản lý Thư viện số</p>
                  <p className="text-[10px] text-[#748092]">Thêm, sửa giáo trình BLCU</p>
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
