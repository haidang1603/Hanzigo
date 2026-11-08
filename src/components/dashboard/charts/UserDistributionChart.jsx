import React, { useState } from 'react';
import { Users } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * User Distribution Donut Chart (Admin)
 * Role and Status breakdown with interactive SVG donut and central counter
 */
export default function UserDistributionChart({
  data = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [activeSegment, setActiveSegment] = useState(null);
  const [viewMode, setViewMode] = useState('roles'); // 'roles' | 'statuses'

  const items = viewMode === 'roles' ? (data?.roles || []) : (data?.statuses || []);
  const total = data?.total || 0;
  const isEmpty = !data || total === 0 || items.length === 0;

  // Polar coordinates calculation for SVG Donut slices
  const size = 220;
  const center = size / 2;
  const outerRadius = 82;
  const innerRadius = 54;

  let cumulativeAngle = -90; // Start at top
  const slices = items.map((item) => {
    const angle = total > 0 ? (item.count / total) * 360 : 0;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + outerRadius * Math.cos(startRad);
    const y1 = center + outerRadius * Math.sin(startRad);
    const x2 = center + outerRadius * Math.cos(endRad);
    const y2 = center + outerRadius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    return {
      ...item,
      pathData,
      startAngle,
      endAngle
    };
  });

  return (
    <DashboardChartContainer
      title="Phân bố Tài khoản Người dùng"
      subtitle="Cơ cấu vai trò học viên, giáo viên và trạng thái hoạt động"
      icon={Users}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có dữ liệu tài khoản người dùng."
      controls={
        <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('roles')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'roles'
                ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            Vai trò
          </button>
          <button
            type="button"
            onClick={() => setViewMode('statuses')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'statuses'
                ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            Trạng thái
          </button>
        </div>
      }
      legend={
        items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveSegment(item)}
            onMouseLeave={() => setActiveSegment(null)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-semibold text-[#243447] dark:text-gray-200">
              {item.label}:
            </span>
            <span className="font-bold text-[#748092] dark:text-gray-400">
              {item.count} ({item.percentage}%)
            </span>
          </div>
        ))
      }
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
        {/* SVG Donut */}
        <div className="relative w-[220px] h-[220px] shrink-0">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full drop-shadow-sm transition-transform"
          >
            {slices.map((slice) => {
              const isHovered = activeSegment?.id === slice.id;
              return (
                <path
                  key={slice.id}
                  d={slice.pathData}
                  fill={slice.color}
                  className="transition-all duration-200 cursor-pointer"
                  opacity={activeSegment ? (isHovered ? 1 : 0.45) : 0.95}
                  stroke="var(--bg-canvas, #ffffff)"
                  strokeWidth={2}
                  onMouseEnter={() => setActiveSegment(slice)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          {/* Central Counter Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {activeSegment ? (
              <div className="animate-in fade-in duration-150">
                <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8] block">
                  {activeSegment.label}
                </span>
                <span className="text-xl font-black text-[#243447] dark:text-white block">
                  {activeSegment.count}
                </span>
                <span className="text-[11px] font-bold text-[#E85D3F] block">
                  {activeSegment.percentage}%
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8] block uppercase tracking-wider">
                  Tổng số
                </span>
                <span className="text-2xl font-black text-[#243447] dark:text-white block">
                  {total}
                </span>
                <span className="text-[10px] text-[#748092] block">Tài khoản</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="space-y-2.5 w-full max-w-xs">
          {items.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveSegment(item)}
              onMouseLeave={() => setActiveSegment(null)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                activeSegment?.id === item.id
                  ? 'bg-orange-50/50 dark:bg-orange-950/20 border-[#E85D3F]'
                  : 'bg-gray-50/70 dark:bg-gray-800/40 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
                <span className="font-black text-[#243447] dark:text-white">
                  {item.count} <span className="text-[#748092] font-normal">({item.percentage}%)</span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardChartContainer>
  );
}

