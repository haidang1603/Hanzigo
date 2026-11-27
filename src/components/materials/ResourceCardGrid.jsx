import React from 'react';
import {
  FileText,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import MaterialsCompactCard from './MaterialsCompactCard';
import MaterialsCompactListRow from './MaterialsCompactListRow';

export default function ResourceCardGrid({
  isLoading,
  viewMode = 'grid',
  visibleMaterials = [],
  hasMoreMaterials = false,
  remainingMaterialsCount = 0,
  onLoadMore,
  bookmarkedIds = [],
  completedIds = [],
  openResourceReader,
  toggleBookmark,
  handleResetFilters,
}) {
  return (
    <div className="space-y-4">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div
              key={sk}
              className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3"
            >
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Compact List View (1-line rows, 8-10 items/mobile viewport) */}
      {!isLoading && visibleMaterials.length > 0 && viewMode === 'list' && (
        <div className="rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
          {visibleMaterials.map((item) => (
            <MaterialsCompactListRow
              key={item.id}
              item={item}
              isBookmarked={bookmarkedIds.includes(item.id)}
              isCompleted={completedIds.includes(item.id)}
              onOpenItem={openResourceReader}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}

      {/* Compact Grid View (Clean 3-row cards) */}
      {!isLoading && visibleMaterials.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {visibleMaterials.map((item) => (
            <MaterialsCompactCard
              key={item.id}
              item={item}
              isBookmarked={bookmarkedIds.includes(item.id)}
              isCompleted={completedIds.includes(item.id)}
              onOpenItem={openResourceReader}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}

      {/* Smart Pagination Load More */}
      {!isLoading && hasMoreMaterials && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={onLoadMore}
            className="min-h-11 px-5 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-xs font-bold text-[#243447] dark:text-white cursor-pointer transition-colors"
          >
            Xem thêm (còn {remainingMaterialsCount} tài liệu)
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && visibleMaterials.length === 0 && (
        <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3 max-w-md mx-auto">
          <FileText size={40} className="mx-auto text-[#748092]" />
          <h3 className="text-sm font-bold text-[#243447] dark:text-white">
            Không tìm thấy tài liệu phù hợp
          </h3>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Thử đổi từ khóa hoặc xóa các tiêu chí lọc đang bật.
          </p>
          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-11 px-4 py-2 rounded-xl bg-[#243447] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>
      )}

      {/* Minimal Compliance Footnote */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#748092] dark:text-[#94A3B8] flex items-center gap-2">
        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
        <span>
          Học liệu nội bộ biên soạn bởi HanziGo; các nguồn ngoài trỏ trực tiếp tới CTI, CLEC & kho OER mở minh bạch bản quyền.
        </span>
      </div>
    </div>
  );
}
