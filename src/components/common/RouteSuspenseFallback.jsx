import React from 'react';

export default function RouteSuspenseFallback() {
  return (
    <div
      className="min-h-[75vh] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse"
      role="status"
      aria-label="Đang tải trang..."
    >
      {/* Header Glassmorphic Skeleton */}
      <div className="h-24 rounded-3xl bg-white/70 dark:bg-[#161E2E]/80 backdrop-blur-md border border-[#F1E5D8] dark:border-[#2B3A4F]/80 p-5 flex items-center justify-between shadow-sm">
        <div className="space-y-2.5 w-2/3 max-w-md">
          <div className="h-3 w-28 rounded-full bg-[#E85D3F]/25" />
          <div className="h-6 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-700/70" />
        </div>
        <div className="h-10 w-28 rounded-2xl bg-slate-200 dark:bg-slate-700/70 hidden sm:block" />
      </div>

      {/* Main Grid Skeleton (Zero CLS layout placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 h-72 rounded-3xl bg-white/70 dark:bg-[#161E2E]/80 backdrop-blur-md border border-[#F1E5D8] dark:border-[#2B3A4F]/80 p-6 space-y-4">
          <div className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-700/70" />
          <div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-slate-800/70" />
          <div className="h-4 w-5/6 rounded-lg bg-slate-100 dark:bg-slate-800/70" />
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>

        <div className="h-72 rounded-3xl bg-white/70 dark:bg-[#161E2E]/80 backdrop-blur-md border border-[#F1E5D8] dark:border-[#2B3A4F]/80 p-6 space-y-3">
          <div className="h-5 w-36 rounded-lg bg-slate-200 dark:bg-slate-700/70" />
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
    </div>
  );
}

