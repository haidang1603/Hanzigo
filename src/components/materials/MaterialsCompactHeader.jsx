import React from 'react';
import {
  Search,
  X,
  Bookmark,
  Printer,
  Plus,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';

export default function MaterialsCompactHeader({
  totalCount,
  completedCount,
  bookmarkedCount,
  searchTerm,
  setSearchTerm,
  isBookmarkedOnly,
  onToggleBookmarkedOnly,
  onOpenWorksheet,
  isAdmin,
  onOpenAddModal,
}) {
  return (
    <div className="bg-white dark:bg-[#1E293B] p-3 sm:p-4 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Left: Title & inline counter */}
      <div className="min-w-0 shrink-0">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h1 className="text-lg sm:text-xl font-black text-[#243447] dark:text-white leading-tight">
            Thư viện tài liệu
          </h1>
          <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
            {totalCount} tài liệu · Đã học {completedCount}
          </span>
        </div>
      </div>

      {/* Middle & Right: Trilingual Search + 2 Clean Action Buttons */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-1 min-w-0 lg:justify-end">
        <div className="relative flex-1 min-w-0 lg:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
          <input
            type="text"
            aria-label="Tìm kiếm tài liệu"
            placeholder="Tìm ngữ pháp, Pinyin (liangci), chữ Hán (把)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-11 pl-10 pr-10 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-semibold text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Xóa từ khóa tìm kiếm"
              className="min-h-11 min-w-11 absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleBookmarkedOnly}
            aria-pressed={isBookmarkedOnly}
            className={`min-h-11 px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              isBookmarkedOnly
                ? 'bg-[#E85D3F] text-white border-transparent'
                : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white border-[#F1E5D8] dark:border-[#2B3A4F]'
            }`}
          >
            <Bookmark size={14} />
            <span>Đã lưu ({bookmarkedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenWorksheet('学习汉语');
            }}
            className="min-h-11 px-3 py-2 rounded-xl bg-[#243447] text-white dark:bg-white dark:text-[#131B24] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer size={14} />
            <span>Phiếu bài tập</span>
          </button>

          {isAdmin && onOpenAddModal && (
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenAddModal();
              }}
              aria-label="Thêm tài liệu"
              title="Thêm tài liệu (Admin)"
              className="min-h-11 min-w-11 px-2.5 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold flex items-center justify-center cursor-pointer shrink-0"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
