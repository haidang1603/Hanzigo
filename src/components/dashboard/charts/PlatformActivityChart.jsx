import React, { useState } from 'react';
import { Activity, FileCheck, BookOpen, MessageSquare, FolderDown } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

const ICON_MAP = {
  FileCheck,
  BookOpen,
  MessageSquare,
  FolderDown
};

/**
 * Platform Learning Activity Bar Chart (Admin)
 * Displays aggregate events across learning submissions, reading, community and materials
 */
export default function PlatformActivityChart({
  data = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const activities = data?.activities || [];
  const totalActions = data?.totalActions || 0;
  const isEmpty = !data || activities.length === 0 || totalActions === 0;

  const maxCount = Math.max(10, ...activities.map(a => a.count));

  return (
    <DashboardChartContainer
      title="Hoạt động Học tập Toàn nền tảng"
      subtitle={`Tổng cộng ${totalActions} tương tác học tập và nội dung được tạo`}
      icon={Activity}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có dữ liệu hoạt động học tập trên hệ thống."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3">
        {activities.map((act) => {
          const IconComp = ICON_MAP[act.icon] || Activity;
          const percentage = totalActions > 0 ? Math.round((act.count / totalActions) * 100) : 0;
          const heightPercent = maxCount > 0 ? Math.max(8, Math.round((act.count / maxCount) * 100)) : 8;
          const isHovered = hoveredBar?.id === act.id;

          return (
            <div
              key={act.id}
              onMouseEnter={() => setHoveredBar(act)}
              onMouseLeave={() => setHoveredBar(null)}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                isHovered
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-[#E85D3F] shadow-xs'
                  : 'bg-gray-50/70 dark:bg-gray-800/40 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              {/* Category Icon & Percent */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${act.color}15`, color: act.color }}
                >
                  <IconComp size={16} />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-gray-900 text-[#748092] dark:text-gray-300 shadow-2xs">
                  {percentage}%
                </span>
              </div>

              {/* Bar Meter */}
              <div className="h-28 flex items-end justify-center py-2">
                <div className="w-10 h-full rounded-xl bg-gray-200 dark:bg-gray-700/60 flex items-end p-1">
                  <div
                    className="w-full rounded-lg transition-all duration-500 shadow-xs"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: act.color
                    }}
                  />
                </div>
              </div>

              {/* Count & Label */}
              <div className="text-center pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-base font-black text-[#243447] dark:text-white">
                  {act.count}
                </p>
                <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8] truncate mt-0.5">
                  {act.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardChartContainer>
  );
}

