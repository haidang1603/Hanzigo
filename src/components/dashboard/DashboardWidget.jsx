import React from 'react';

/**
 * DashboardWidget
 * Standardized surface container for unified dashboard widgets
 */
export default function DashboardWidget({
  title = undefined,
  subtitle = undefined,
  icon: Icon = undefined,
  action = undefined,
  children = undefined,
  className = '',
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'Chưa có dữ liệu hiển thị.',
  onRetry = null
}) {
  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-5 transition-all ${className}`}>
      {(title || Icon || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-950/40 text-[#E85D3F] flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-base sm:text-lg font-bold text-[#243447] dark:text-white truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-[#E85D3F] border-t-transparent animate-spin" />
          <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-medium">Đang tải dữ liệu thực tế...</span>
        </div>
      ) : error ? (
        <div className="py-8 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-center space-y-3">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all"
            >
              Thử lại
            </button>
          )}
        </div>
      ) : empty ? (
        <div className="py-10 text-center space-y-2">
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

