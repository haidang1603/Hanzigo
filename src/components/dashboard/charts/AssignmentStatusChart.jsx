import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * Assignment Status Donut Chart (Teacher)
 * Mutually exclusive states (Chưa nộp, Chờ chấm, Đã chấm, Quá hạn)
 */
export default function AssignmentStatusChart({
  data = null,
  classrooms = [],
  selectedClassId = 'all',
  onSelectClass = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [activeSegment, setActiveSegment] = useState(null);

  const statuses = data?.statuses || [];
  const totalTasks = data?.totalTasks || 0;
  const isEmpty = !data || totalTasks === 0 || statuses.length === 0;

  // Polar coordinates calculation for SVG Donut slices
  const size = 200;
  const center = size / 2;
  const outerRadius = 75;
  const innerRadius = 50;

  let cumulativeAngle = -90;
  const slices = statuses.map((item) => {
    const angle = totalTasks > 0 ? (item.count / totalTasks) * 360 : 0;
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
      title="Tình trạng Nộp Bài tập"
      subtitle={`${totalTasks} lượt bài tập được giao cho học viên`}
      icon={CheckCircle2}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có bài tập nào được giao trong lớp này."
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
      legend={
        statuses.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveSegment(item)}
            onMouseLeave={() => setActiveSegment(null)}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity text-xs"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
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
        <div className="relative w-[200px] h-[200px] shrink-0">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-sm">
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
                <span className="text-[10px] font-semibold text-[#748092] dark:text-[#94A3B8] block">
                  {activeSegment.label}
                </span>
                <span className="text-xl font-black text-[#243447] dark:text-white block">
                  {activeSegment.count}
                </span>
                <span className="text-[10px] font-bold text-[#E85D3F] block">
                  {activeSegment.percentage}%
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-semibold text-[#748092] dark:text-[#94A3B8] block uppercase tracking-wider">
                  Tổng lượt
                </span>
                <span className="text-2xl font-black text-[#243447] dark:text-white block">
                  {totalTasks}
                </span>
                <span className="text-[10px] text-[#748092] block">Bài tập</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="space-y-2 w-full max-w-xs">
          {statuses.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveSegment(item)}
              onMouseLeave={() => setActiveSegment(null)}
              className={`p-2 rounded-2xl border transition-all cursor-pointer ${
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

