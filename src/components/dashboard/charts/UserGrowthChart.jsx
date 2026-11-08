import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * User Growth Area / Line Chart (Admin)
 * Displays daily/weekly user registrations with timeframe filters and interactive SVG tooltip
 */
export default function UserGrowthChart({
  data = null,
  timeframe = '30d',
  onTimeframeChange = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const points = data?.points || [];
  const totalNewUsers = data?.totalNewUsers || 0;
  const isEmpty = !data || points.length === 0;

  // Chart dimensions & scaling
  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;

  const maxCount = Math.max(5, ...points.map(p => p.count));
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  // Calculate coordinates
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / Math.max(1, points.length - 1)) * innerWidth;
    const y = height - paddingY - (p.count / maxCount) * innerHeight;
    return { ...p, x, y };
  });

  // Construct SVG paths
  const linePath = coords.length > 0 
    ? coords.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`
    : '';

  // X-axis sampled labels (show at most 6-7 labels to prevent overlap)
  const step = Math.max(1, Math.floor(coords.length / 6));
  const sampledLabels = coords.filter((_, idx) => idx % step === 0 || idx === coords.length - 1);

  return (
    <DashboardChartContainer
      title="Tăng trưởng Người dùng"
      subtitle={`Ghi nhận ${totalNewUsers} lượt đăng ký tài khoản mới trong giai đoạn này`}
      icon={TrendingUp}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có dữ liệu tăng trưởng người dùng."
      controls={
        <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold">
          {[
            { id: '7d', label: '7 ngày' },
            { id: '30d', label: '30 ngày' },
            { id: '90d', label: '90 ngày' },
            { id: '12m', label: '12 tháng' }
          ].map((tf) => (
            <button
              key={tf.id}
              type="button"
              onClick={() => onTimeframeChange && onTimeframeChange(tf.id)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="w-full relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="userGrowthAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E85D3F" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#E85D3F" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.5, 1].map((ratio) => {
            const y = height - paddingY - ratio * innerHeight;
            const val = Math.round(ratio * maxCount);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-gray-400 font-bold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#userGrowthAreaGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* Line Stroke */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#E85D3F"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Active Hover Crosshair Line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingY}
              x2={hoveredPoint.x}
              y2={height - paddingY}
              stroke="#E85D3F"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={0.7}
            />
          )}

          {/* Data Points */}
          {coords.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.date === pt.date ? 5 : 3}
              fill={hoveredPoint?.date === pt.date ? '#E85D3F' : '#ffffff'}
              stroke="#E85D3F"
              strokeWidth={2}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* X-axis labels */}
          {sampledLabels.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] fill-gray-400 font-semibold"
            >
              {pt.displayDate}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip floating badge */}
        {hoveredPoint && (
          <div
            className="absolute -top-3 p-2 rounded-xl bg-slate-900 text-white text-xs shadow-lg pointer-events-none transform -translate-x-1/2 z-20 border border-white/10 animate-in fade-in duration-100"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`
            }}
          >
            <span className="block text-[10px] text-slate-400">{hoveredPoint.date}</span>
            <span className="block font-bold text-amber-300">
              +{hoveredPoint.count} tài khoản
            </span>
            <span className="block text-[9px] text-slate-300">
              Lũy kế: {hoveredPoint.cumulative}
            </span>
          </div>
        )}
      </div>
    </DashboardChartContainer>
  );
}

