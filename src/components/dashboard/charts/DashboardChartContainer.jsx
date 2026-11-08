import React from 'react';
import { AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';

/**
 * Standardized Dashboard Chart Container
 * Provides consistent header, controls, loading skeletons, error states, and empty states.
 */
export default function DashboardChartContainer({
  title,
  subtitle,
  icon: Icon = BarChart2,
  badge = null,
  controls = null,
  legend = null,
  loading = false,
  error = null,
  onRetry = null,
  empty = false,
  emptyMessage = 'Chưa có đủ dữ liệu để hiển thị biểu đồ.',
  children
}) {
  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-col justify-between space-y-5 transition-all">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E5D8]/60 dark:border-[#2B3A4F]/60 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] flex items-center justify-center shrink-0 shadow-2xs">
            <Icon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-[#243447] dark:text-white tracking-tight">
                {title}
              </h3>
              {badge && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#E85D3F]">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls (e.g., Timeframe filters, Selectors) */}
        {controls && (
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
            {controls}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[220px] flex flex-col justify-center relative">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-full max-w-sm h-36 bg-gray-100 dark:bg-gray-800/60 rounded-2xl" />
            <div className="flex items-center gap-3">
              <div className="w-20 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
              <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
              <div className="w-16 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
            <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              Đang phân tích và tổng hợp dữ liệu...
            </span>
          </div>
        ) : error ? (
          <div className="py-10 text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold text-[#243447] dark:text-white transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw size={12} />
                <span>Thử tải lại</span>
              </button>
            )}
          </div>
        ) : empty ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/40 text-gray-400 flex items-center justify-center mx-auto">
              <BarChart2 size={24} />
            </div>
            <p className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8] max-w-sm mx-auto">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>

      {/* Optional Legend Bar */}
      {legend && !loading && !error && !empty && (
        <div className="pt-3 border-t border-[#F1E5D8]/50 dark:border-[#2B3A4F]/50 flex flex-wrap items-center justify-center gap-4 text-xs">
          {legend}
        </div>
      )}

    </div>
  );
}

