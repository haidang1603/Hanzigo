import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, EyeOff } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * Community Moderation Overview Chart (Admin)
 * Displays report statuses (Pending, Resolved, Hidden) and total community posts
 */
export default function CommunityModerationChart({
  data = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [hoveredMetric, setHoveredMetric] = useState(null);

  const metrics = data?.metrics || [];
  const totalReports = data?.totalReports || 0;
  const totalPosts = data?.totalPosts || 0;
  const isEmpty = !data || (totalReports === 0 && totalPosts === 0);

  const icons = {
    pending: AlertTriangle,
    resolved: CheckCircle2,
    hidden: EyeOff
  };

  return (
    <DashboardChartContainer
      title="Giám sát & Kiểm duyệt Cộng đồng"
      subtitle={`${totalReports} báo cáo nội dung trên tổng số ${totalPosts} bài viết thảo luận`}
      icon={ShieldAlert}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có dữ liệu báo cáo vi phạm cộng đồng."
    >
      <div className="space-y-4 py-2">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {metrics.map((m) => {
            const IconComp = icons[m.id] || ShieldAlert;
            const isHovered = hoveredMetric?.id === m.id;

            return (
              <div
                key={m.id}
                onMouseEnter={() => setHoveredMetric(m)}
                onMouseLeave={() => setHoveredMetric(null)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-orange-50/40 dark:bg-orange-950/20 border-[#E85D3F]'
                    : 'bg-gray-50/70 dark:bg-gray-800/40 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${m.color}15`, color: m.color }}
                  >
                    <IconComp size={15} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 text-[#748092] dark:text-gray-300">
                    {m.percentage}%
                  </span>
                </div>

                <p className="text-xl font-black text-[#243447] dark:text-white">
                  {m.count}
                </p>
                <p className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8] mt-0.5">
                  {m.label}
                </p>

                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${m.percentage}%`,
                      backgroundColor: m.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Callout Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-xs">
          <span className="text-[#748092] dark:text-[#94A3B8]">
            Tỷ lệ xử lý vi phạm: <strong>{totalReports > 0 ? Math.round(((totalReports - (data?.pendingReports || 0)) / totalReports) * 100) : 100}%</strong>
          </span>
          <span className="font-bold text-[#E85D3F]">
            {data?.pendingReports || 0} mục cần kiểm duyệt
          </span>
        </div>
      </div>
    </DashboardChartContainer>
  );
}

