import React from 'react';
import {
  FileText,
  Plus,
  Layers,
  Users,
  Activity,
  Cpu,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Award,
  MessageSquare,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import {
  createEmptyDashboardSummary,
  formatVietnamDateTime,
  redactPiiText,
} from './adminHelpers';

export default function AdminOverviewPanel({
  userStats = { total: 0, admins: 0, teachers: 0, active: 0, blocked: 0, totalXp: 0 },
  materials = [],
  dashboardSummary = null,
  isLoadingDashboard = false,
  dashboardError = null,
  setAdminTab,
  setIsAddUserModalOpen,
  handleOpenCreateMat,
  handleOpenCreateVocab,
}) {
  const summary = dashboardSummary || createEmptyDashboardSummary();
  const kpis = summary.kpis || {};
  const trends7d = Array.isArray(summary.trends7d) && summary.trends7d.length > 0
    ? summary.trends7d
    : createEmptyDashboardSummary().trends7d;
  const hskDistribution = Array.isArray(summary.hskDistribution) ? summary.hskDistribution : [];
  const urgentItems = Array.isArray(summary.urgentItems) ? summary.urgentItems : [];

  const totalUsers = kpis.totalUsers || userStats.total || 0;
  const activeLearners7d = kpis.activeLearners7d || 0;
  const totalHskAttempts = kpis.totalHskAttempts || 0;
  const hsk20Attempts = kpis.hsk20Attempts || 0;
  const hsk30Attempts = kpis.hsk30Attempts || 0;
  const communityPostsCount = kpis.communityPostsCount || 0;
  const openReportsCount = kpis.openReportsCount || 0;
  const clientErrors24h = kpis.clientErrors24h || 0;

  const maxTrend = Math.max(1, ...trends7d.map((d) => Number(d.count) || 0));
  const totalDistCount = hskDistribution.reduce((acc, cur) => acc + (Number(cur.count) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {dashboardError && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-200">
          {dashboardError}
        </div>
      )}

      {/* 6 Zero-Mock Operational KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            <span>Tổng người dùng</span>
            <Users size={15} className="text-[#E85D3F]" />
          </div>
          <p className="text-2xl font-black text-[#243447] dark:text-white">
            {isLoadingDashboard ? '...' : totalUsers.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
            {userStats.active || 0} hoạt động · {userStats.blocked || 0} bị khóa
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            <span>Hoạt động 7 ngày</span>
            <Activity size={15} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-[#243447] dark:text-white">
            {activeLearners7d.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Người học có tương tác tuần qua
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            <span>Lượt nộp bài HSK</span>
            <Award size={15} className="text-[#D97706]" />
          </div>
          <p className="text-2xl font-black text-[#243447] dark:text-white">
            {totalHskAttempts.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
            HSK 2.0: {hsk20Attempts} · HSK 3.0: {hsk30Attempts}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            <span>Bài viết Cộng đồng</span>
            <MessageSquare size={15} className="text-sky-500" />
          </div>
          <p className="text-2xl font-black text-[#243447] dark:text-white">
            {communityPostsCount.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
            {materials.length} tài liệu hệ thống
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            <span>Báo cáo chờ xử lý</span>
            <ShieldAlert size={15} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#E85D3F]">
            {openReportsCount.toLocaleString()}
          </p>
          <button
            type="button"
            onClick={() => setAdminTab('moderation')}
            className="text-[11px] font-bold text-[#E85D3F] hover:underline cursor-pointer"
          >
            Mở hàng đợi kiểm duyệt →
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            <span>Lỗi client 24h</span>
            <AlertTriangle size={15} className="text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {clientErrors24h.toLocaleString()}
          </p>
          <button
            type="button"
            onClick={() => setAdminTab('ai_metrics')}
            className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] hover:text-[#E85D3F] cursor-pointer"
          >
            Xem log sự cố →
          </button>
        </div>
      </div>

      {/* Inline Lightweight SVG Charts (Zero external chart library) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 7-Day Exam/Learning Trend SVG */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-black text-[#243447] dark:text-white">
              Xu hướng nộp bài HSK 7 ngày (giờ VN)
            </h3>
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

        {/* HSK Level Distribution Inline SVG + Bars */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-black text-[#243447] dark:text-white">
              Phân bố lượt thi theo cấp độ HSK
            </h3>
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

      {/* Top 5 Urgent Admin Action Items */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-[#243447] dark:text-white">
            5 Hoạt động quản trị cần xử lý ngay
          </h3>
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
                  onClick={() => {
                    playClickSound();
                    setAdminTab(item.targetTab || 'moderation');
                  }}
                  className="min-h-11 px-3 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] font-bold shrink-0 cursor-pointer"
                >
                  Xử lý
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Shortcuts */}
      <div className="p-5 rounded-3xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
        <h3 className="text-base font-black text-[#243447] dark:text-white mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-[#E85D3F]" />
          <span>Lối tắt quản trị nhanh</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setAdminTab('users');
              setIsAddUserModalOpen(true);
            }}
            className="min-h-11 p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
          >
            <Plus size={20} className="text-[#E85D3F] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-[#243447] dark:text-white">Thêm học viên</p>
            <p className="text-[10px] text-[#748092]">Tạo tài khoản mới</p>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setAdminTab('materials');
              handleOpenCreateMat();
            }}
            className="min-h-11 p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
          >
            <FileText size={20} className="text-[#D97706] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-[#243447] dark:text-white">Thêm tài liệu</p>
            <p className="text-[10px] text-[#748092]">Tải lên giáo trình</p>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setAdminTab('vocab');
              handleOpenCreateVocab();
            }}
            className="min-h-11 p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
          >
            <Layers size={20} className="text-[#45B97C] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-[#243447] dark:text-white">Thêm từ vựng</p>
            <p className="text-[10px] text-[#748092]">Bổ sung từ mới</p>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setAdminTab('ai_metrics');
            }}
            className="min-h-11 p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
          >
            <Cpu size={20} className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-[#243447] dark:text-white">Hệ thống &amp; Log lỗi</p>
            <p className="text-[10px] text-[#748092]">AI, Audio CDN &amp; Logs</p>
          </button>
        </div>
      </div>
    </div>
  );
}
