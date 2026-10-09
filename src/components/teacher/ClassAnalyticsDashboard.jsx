import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight,
  BarChart3,
  Calendar,
  Activity,
  Flame,
  FileText
} from 'lucide-react';

export default function ClassAnalyticsDashboard({
  analyticsData,
  currentClass = null,
  atRiskSummary = null,
  onOpenAiStudio = null,
  onViewStudentDetail = null,
  onFilterAtRisk = null
}) {
  const [activeChartTab, setActiveChartTab] = useState('completion'); // 'completion' | 'scores' | 'attendance' | 'activity'

  if (!analyticsData) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
        Đang tổng hợp dữ liệu sư phạm...
      </div>
    );
  }

  if (analyticsData.isEmptyClass) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-4 shadow-sm animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-[#E85D3F] flex items-center justify-center mx-auto shadow-xs">
          <Users size={32} />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-lg font-black text-[#243447] dark:text-white">
            Lớp học hiện chưa có học viên
          </h3>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            {analyticsData.emptyStateMessage || 'Lớp học hiện chưa có học viên nào. Hãy chia sẻ mã lớp để học viên tham gia và bắt đầu thu thập số liệu phân tích sư phạm.'}
          </p>
        </div>
        {currentClass?.class_code && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white">
            <span className="text-[#748092]">Mã lớp học:</span>
            <span className="font-mono text-base text-[#E85D3F] tracking-wider font-black">{currentClass.class_code}</span>
          </div>
        )}
      </div>
    );
  }

  const {
    totalStudents,
    activeStudents,
    averageScore,
    assignmentCompletion,
    attendanceRate,
    averageStudyTime,
    vocabularyProgress,
    hskProgress,
    charts,
    skillBreakdown
  } = analyticsData;

  const atRiskCount = atRiskSummary?.atRisk?.length || 0;
  const needsAttentionCount = atRiskSummary?.needsAttention?.length || 0;
  const totalWarning = atRiskCount + needsAttentionCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner & AI Trigger */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-white via-white to-amber-50/40 dark:from-[#1A2433] dark:via-[#1A2433] dark:to-amber-950/20 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F] text-[11px] font-bold">
              <BarChart3 size={12} />
              <span>Sư phạm Thông minh</span>
            </span>
            <span className="text-xs text-[#748092] dark:text-[#94A3B8]">
              {currentClass ? `Lớp: ${currentClass.name} • ${currentClass.hsk_level}` : 'Tất cả các lớp học'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white tracking-tight">
            Teacher Analytics & AI Chẩn đoán
          </h2>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Thấu hiểu năng lực học viên, phát hiện sớm nguy cơ hổng kiến thức và hỗ trợ giáo viên đưa ra quyết định sư phạm tối ưu.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenAiStudio && (
            <button
              onClick={() => onOpenAiStudio('analysis')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Sparkles size={15} />
              <span>AI Phân tích Lớp học</span>
            </button>
          )}

          {onOpenAiStudio && (
            <button
              onClick={() => onOpenAiStudio('assignment')}
              className="px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#F1E5D8] dark:hover:bg-[#2B3A4F] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <FileText size={14} className="text-[#E85D3F]" />
              <span>AI Tạo bài tập</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Deterministic Rule-Based At-Risk Alert Banner (if any) */}
      {totalWarning > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Phát hiện {totalWarning} học viên cần hỗ trợ sư phạm
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                {atRiskCount > 0 && <span className="font-semibold">⚠️ {atRiskCount} học viên nguy cơ cao (nghỉ học ≥ 7 ngày)</span>}
                {atRiskCount > 0 && needsAttentionCount > 0 && ' • '}
                {needsAttentionCount > 0 && <span className="font-semibold">⚡ {needsAttentionCount} học viên cần lưu ý (hoàn thành &lt; 50% hoặc điểm &lt; 60)</span>}
              </p>
            </div>
          </div>

          {onFilterAtRisk && (
            <button
              onClick={onFilterAtRisk}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto whitespace-nowrap"
            >
              <span>Xem danh sách cảnh báo</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* 3. The 8 Core Pedagogical KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* KPI 1: Sĩ số tổng */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Sĩ số học viên</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF5F2] text-[#E85D3F] flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#243447] dark:text-white">{totalStudents}</span>
            <span className="text-xs text-[#748092]">học viên</span>
          </div>
          <p className="text-[11px] text-[#748092]">Quy mô lớp học hiện tại</p>
        </div>

        {/* KPI 2: Học viên hoạt động */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Đang hoạt động</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeStudents}</span>
            <span className="text-xs text-[#748092]">/ {totalStudents}</span>
          </div>
          <p className="text-[11px] text-[#748092]">Đăng nhập trong 7 ngày qua</p>
        </div>

        {/* KPI 3: Điểm trung bình */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Điểm trung bình</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{averageScore}</span>
            <span className="text-xs text-[#748092]">/ 100</span>
          </div>
          <p className="text-[11px] text-[#748092]">Bài tập & kiểm tra trắc nghiệm</p>
        </div>

        {/* KPI 4: Tỷ lệ hoàn thành bài tập */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Hoàn thành bài tập</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{assignmentCompletion}%</span>
            <span className="text-xs text-[#748092]">đúng hạn</span>
          </div>
          <p className="text-[11px] text-[#748092]">Tỷ lệ nộp bài đạt yêu cầu</p>
        </div>

        {/* KPI 5: Chuyên cần */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Chuyên cần</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{attendanceRate}%</span>
            <span className="text-xs text-[#748092]">tham gia</span>
          </div>
          <p className="text-[11px] text-[#748092]">Tham gia học tập & buổi live</p>
        </div>

        {/* KPI 6: Thời lượng học trung bình */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Thời lượng học TB</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#E85D3F] flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#243447] dark:text-white">{averageStudyTime}</span>
            <span className="text-xs text-[#748092]">phút / tuần</span>
          </div>
          <p className="text-[11px] text-[#748092]">Tương tác luyện từ & ngữ pháp</p>
        </div>

        {/* KPI 7: Tiến độ từ vựng */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Tiến độ từ vựng</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{vocabularyProgress}</span>
            <span className="text-xs text-[#748092]">từ vựng TB</span>
          </div>
          <p className="text-[11px] text-[#748092]">Đã nạp vào bộ nhớ dài hạn SRS</p>
        </div>

        {/* KPI 8: Tiến độ HSK */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Tiến độ chuẩn HSK</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{hskProgress}%</span>
            <span className="text-xs text-[#748092]">đạt chỉ tiêu</span>
          </div>
          <p className="text-[11px] text-[#748092]">So với mục tiêu cấp độ lớp</p>
        </div>

      </div>

      {/* 4. Visual Charts Section: Tab Switcher & Visualizations */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
        
        {/* Chart Nav Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#243447] dark:text-white">
              Biểu Đồ Trực Quan Hóa Sư Phạm
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Theo dõi phân bố hoàn thành, phổ điểm và nhịp độ hoạt động thực tế
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto">
            <button
              onClick={() => setActiveChartTab('completion')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartTab === 'completion'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              Hoàn thành bài
            </button>
            <button
              onClick={() => setActiveChartTab('scores')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartTab === 'scores'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              Phổ điểm số
            </button>
            <button
              onClick={() => setActiveChartTab('attendance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartTab === 'attendance'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              Chuyên cần tuần
            </button>
            <button
              onClick={() => setActiveChartTab('activity')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartTab === 'activity'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              Nhịp độ học tập
            </button>
            <button
              onClick={() => setActiveChartTab('weakness')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartTab === 'weakness'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              Điểm yếu kỹ năng
            </button>
            <button
              onClick={() => setActiveChartTab('assignment')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartTab === 'assignment'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              Hiệu suất bài tập
            </button>
          </div>
        </div>

        {/* CHART 1: Completion Distribution */}
        {activeChartTab === 'completion' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span>Phân loại tỷ lệ hoàn thành nhiệm vụ học tập của học viên</span>
              <span>Tổng: {totalStudents} học viên</span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-6 w-full rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex shadow-inner">
              {charts.completionDistribution.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  className="h-full flex items-center justify-center text-[10px] font-bold text-white transition-all hover:opacity-90"
                  title={`${item.label}: ${item.count} học viên (${item.percentage}%)`}
                >
                  {item.percentage > 10 ? `${item.percentage}%` : ''}
                </div>
              ))}
            </div>

            {/* Legend Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {charts.completionDistribution.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/50 dark:bg-[#243447]/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-[#243447] dark:text-white">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#243447] dark:text-white">{item.count}</span>
                    <span className="text-[11px] text-[#748092] ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHART 2: Scores Distribution */}
        {activeChartTab === 'scores' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span>Phân bố điểm số các bài kiểm tra & bài tập gần nhất</span>
              <span>Điểm TB lớp: {averageScore}/100</span>
            </div>

            {/* Histogram Bars */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 pt-6 pb-2 items-end h-48 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
              {charts.scoresDistribution.map((bucket, idx) => {
                const heightPct = Math.max(12, bucket.percentage || 10);
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-xs font-bold text-[#243447] dark:text-white opacity-80 group-hover:opacity-100 transition-opacity">
                      {bucket.count} hs ({bucket.percentage}%)
                    </span>
                    <div 
                      style={{ height: `${heightPct}%`, backgroundColor: bucket.color }}
                      className="w-full max-w-[60px] rounded-t-2xl shadow-sm transition-all hover:scale-105"
                    />
                    <span className="text-[11px] font-bold text-[#748092] mt-1">
                      {bucket.range} đ
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHART 3: Attendance Trend */}
        {activeChartTab === 'attendance' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span>Tỷ lệ chuyên cần các ngày trong tuần</span>
              <span>TB: {attendanceRate}%</span>
            </div>

            {/* Trend Bars */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-6 pb-2 items-end h-48 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
              {charts.attendanceTrend.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-[#748092] group-hover:text-[#E85D3F]">
                    {item.rate}%
                  </span>
                  <div 
                    style={{ height: `${item.rate}%` }}
                    className="w-full max-w-[36px] rounded-t-xl bg-purple-500 hover:bg-purple-600 transition-all shadow-sm"
                  />
                  <span className="text-xs font-bold text-[#243447] dark:text-white mt-1">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHART 4: Activity Timeline */}
        {activeChartTab === 'activity' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span>Số lượng học viên chủ động học tập theo ngày</span>
              <span>Tổng hoạt động: {activeStudents}</span>
            </div>

            {/* Activity Bars */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-6 pb-2 items-end h-48 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
              {charts.activityTimeline.map((item, idx) => {
                const maxVal = Math.max(...charts.activityTimeline.map(x => x.active), 1);
                const heightPct = Math.round((item.active / maxVal) * 90) + 10;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-bold text-[#748092] group-hover:text-emerald-600">
                      {item.active} hs
                    </span>
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[36px] rounded-t-xl bg-emerald-500 hover:bg-emerald-600 transition-all shadow-sm"
                    />
                    <span className="text-xs font-bold text-[#243447] dark:text-white mt-1">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHART 5: Weakness Analysis */}
        {activeChartTab === 'weakness' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span>Chẩn đoán điểm yếu từng kỹ năng so với ngưỡng chuẩn (70 điểm)</span>
              <span>Kỹ năng yếu: {analyticsData.weakSkills?.length || 0}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(charts.weaknessAnalysis || []).map((w, idx) => {
                const isUnder = w.score < (w.threshold || 70);
                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border ${
                      isUnder 
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60' 
                        : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                    } flex items-center justify-between`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#243447] dark:text-white">{w.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold ${isUnder ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {w.status || (isUnder ? 'Cần cải thiện' : 'Tốt')}
                        </span>
                        <span className="text-[10px] text-[#748092]">Ngưỡng: {w.threshold || 70}đ</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-black ${isUnder ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {w.score}
                      </span>
                      <span className="text-xs text-[#748092]">/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHART 6: Assignment Performance */}
        {activeChartTab === 'assignment' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span>Hiệu suất làm bài & tỷ lệ nộp bài theo từng nhiệm vụ</span>
              <span>Tổng bài tập: {charts.assignmentPerformance?.length || 0}</span>
            </div>

            {(!charts.assignmentPerformance || charts.assignmentPerformance.length === 0) ? (
              <div className="p-8 text-center text-xs text-[#748092]">
                Lớp học chưa có bài tập nào được giao.
              </div>
            ) : (
              <div className="space-y-2.5 pt-2">
                {charts.assignmentPerformance.map((asg, idx) => (
                  <div 
                    key={asg.id || idx}
                    className="p-3.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/50 dark:bg-[#243447]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-[#243447] dark:text-white">{asg.title}</h5>
                      <span className="text-[11px] text-[#748092]">
                        Đã nộp: {asg.submittedCount}/{asg.totalStudents} ({asg.submissionRate}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <div className="text-right">
                        <span className="text-[10px] text-[#748092] block">Điểm TB</span>
                        <span className="text-amber-600 dark:text-amber-400 font-black">{asg.averageScore}đ</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#748092] block">Tỷ lệ nộp</span>
                        <span className="text-blue-600 dark:text-blue-400 font-black">{asg.submissionRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 5. 4-Skill Mastery Summary */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#243447] dark:text-white">
              Cân Bằng 4 Kỹ Năng Ngôn Ngữ Của Lớp
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Đánh giá tương quan giữa Nghe (Listening), Nói (Speaking), Đọc (Reading), Viết (Writing)
            </p>
          </div>
          <span className="text-xs font-bold text-[#E85D3F]">Chuẩn HSK 3.0</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#243447] dark:text-white">🎧 Kỹ năng Nghe</span>
              <span className="text-blue-600">{skillBreakdown.listening}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div style={{ width: `${skillBreakdown.listening}%` }} className="h-full bg-blue-500 rounded-full" />
            </div>
            <p className="text-[11px] text-[#748092]">Nhận diện thanh điệu & hội thoại</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#243447] dark:text-white">🗣️ Kỹ năng Nói</span>
              <span className="text-emerald-600">{skillBreakdown.speaking}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div style={{ width: `${skillBreakdown.speaking}%` }} className="h-full bg-emerald-500 rounded-full" />
            </div>
            <p className="text-[11px] text-[#748092]">Khẩu ngữ & phản xạ câu ngắn</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#243447] dark:text-white">📖 Kỹ năng Đọc</span>
              <span className="text-amber-600">{skillBreakdown.reading}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div style={{ width: `${skillBreakdown.reading}%` }} className="h-full bg-amber-500 rounded-full" />
            </div>
            <p className="text-[11px] text-[#748092]">Nhận diện chữ Hán & ngữ cảnh</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#243447] dark:text-white">✍️ Kỹ năng Viết</span>
              <span className="text-purple-600">{skillBreakdown.writing}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div style={{ width: `${skillBreakdown.writing}%` }} className="h-full bg-purple-500 rounded-full" />
            </div>
            <p className="text-[11px] text-[#748092]">Quy tắc bút thuận & cấu trúc câu</p>
          </div>

        </div>
      </div>

    </div>
  );
}
