import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * HSK Curriculum Distribution Horizontal Bar Chart (Admin)
 * Displays lessons and materials breakdown across HSK 1–6
 */
export default function CurriculumDistributionChart({
  data = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [hoveredLevel, setHoveredLevel] = useState(null);

  const distribution = data?.distribution || [];
  const totalLessons = data?.totalLessons || 0;
  const totalMaterials = data?.totalMaterials || 0;
  const isEmpty = !data || distribution.length === 0;

  const maxLessons = Math.max(20, ...distribution.map(d => d.lessonCount));

  return (
    <DashboardChartContainer
      title="Phân bố Giáo trình & Tài liệu HSK"
      subtitle={`${totalLessons} bài học chuẩn & ${totalMaterials} tài liệu số từ HSK 1 đến HSK 6`}
      icon={BookOpen}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có dữ liệu phân bố giáo trình HSK."
    >
      <div className="space-y-3.5 py-1">
        {distribution.map((item) => {
          const widthPercent = maxLessons > 0 ? Math.round((item.lessonCount / maxLessons) * 100) : 0;
          const isHovered = hoveredLevel?.hsk === item.hsk;

          return (
            <div
              key={item.hsk}
              onMouseEnter={() => setHoveredLevel(item)}
              onMouseLeave={() => setHoveredLevel(null)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-[#E85D3F]'
                  : 'bg-gray-50/60 dark:bg-gray-800/30 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-black text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.hsk}
                  </span>
                  <span className="font-bold text-[#243447] dark:text-white truncate">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-[#748092] dark:text-[#94A3B8]">
                    {item.materialsCount} tài liệu
                  </span>
                  <span className="font-black text-[#243447] dark:text-white min-w-[48px] text-right">
                    {item.lessonCount} bài
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardChartContainer>
  );
}

