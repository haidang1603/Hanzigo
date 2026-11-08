import React, { useState } from 'react';
import { Award, Trophy } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * Student Performance Score Distribution Chart (Teacher)
 * Displays grade tiers (Xuất sắc, Khá, Trung bình, Cần nỗ lực) and average score
 */
export default function StudentPerformanceChart({
  data = null,
  classrooms = [],
  selectedClassId = 'all',
  onSelectClass = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [hoveredTier, setHoveredTier] = useState(null);

  const tiers = data?.tiers || [];
  const averageScore = data?.averageScore || 0;
  const submissionsCount = data?.submissionsCount || 0;
  const isEmpty = !data || submissionsCount === 0;

  return (
    <DashboardChartContainer
      title="Kết quả Đánh giá & Phổ điểm"
      subtitle={`Dựa trên ${submissionsCount} bài nộp đã được chấm điểm`}
      icon={Award}
      badge={`ĐTB: ${averageScore}/100 đ`}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có bài tập nào được chấm điểm trong lớp này."
      controls={
        classrooms.length > 0 && (
          <select
            value={selectedClassId}
            onChange={(e) => onSelectClass && onSelectClass(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-xs font-bold text-[#243447] dark:text-white cursor-pointer focus:ring-2 focus:ring-[#E85D3F]"
          >
            <option value="all">Tất cả lớp học</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )
      }
    >
      <div className="space-y-4 py-2">
        {/* Hero Score Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Trophy size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Điểm trung bình toàn lớp
              </span>
              <p className="text-xl font-black text-[#243447] dark:text-white">
                {averageScore} <span className="text-xs font-normal text-[#748092]">/ 100 điểm</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-300 shadow-2xs">
            {submissionsCount} bài đã chấm
          </span>
        </div>

        {/* Score Tiers Breakdown */}
        <div className="space-y-3">
          {tiers.map((tier) => {
            const isHovered = hoveredTier?.id === tier.id;

            return (
              <div
                key={tier.id}
                onMouseEnter={() => setHoveredTier(tier)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-orange-50/30 dark:bg-orange-950/20 border-[#E85D3F]'
                    : 'bg-gray-50/60 dark:bg-gray-800/30 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                    {tier.label}
                  </span>
                  <span className="font-black text-[#243447] dark:text-white">
                    {tier.count} <span className="text-[#748092] font-normal">({tier.percentage}%)</span>
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${tier.percentage}%`,
                      backgroundColor: tier.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardChartContainer>
  );
}

