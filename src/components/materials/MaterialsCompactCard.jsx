import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function MaterialsCompactCard({
  item,
  isBookmarked,
  isCompleted,
  onOpenItem,
  onToggleBookmark,
}) {
  const summaryText = item.summary || item.description || '';
  const estimatedMinutes = item.estimatedMinutes || 10;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenItem(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenItem(item);
        }
      }}
      className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] transition-colors flex flex-col justify-between gap-3 cursor-pointer"
    >
      {/* Row 1: Level pill + short category + Bookmark button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] shrink-0">
            {item.level}
          </span>
          <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8] truncate">
            {item.guideType || item.category}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(item.id, item.title);
          }}
          aria-label={isBookmarked ? `Bỏ lưu ${item.title}` : `Lưu ${item.title}`}
          className={`min-h-11 min-w-11 flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer ${
            isBookmarked
              ? 'text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B]'
              : 'text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]'
          }`}
        >
          {isBookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
        </button>
      </div>

      {/* Row 2: Title + 2-line Summary */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[#243447] dark:text-white line-clamp-2 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
          {summaryText}
        </p>
      </div>

      {/* Row 3: Read time + Completed status + Action label */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-xs">
        <div className="flex items-center gap-2 text-[#748092] dark:text-[#94A3B8]">
          <span>~{estimatedMinutes} phút</span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckCircle2 size={13} />
              <span>Đã học</span>
            </span>
          )}
        </div>

        {item.isOfficialExternal ? (
          <a
            href={item.sourceUrl || item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-bold text-[#E85D3F] hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Nguồn mở</span>
            <ExternalLink size={13} />
          </a>
        ) : (
          <span className="text-xs font-bold text-[#E85D3F] shrink-0">Đọc ngay</span>
        )}
      </div>
    </div>
  );
}
