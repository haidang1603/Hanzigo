import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { formatCompactLevelBadge } from './materialsHelpers';

export default function MaterialsCompactListRow({
  item,
  isBookmarked,
  isCompleted,
  onOpenItem,
  onToggleBookmark,
}) {
  const shortBadge = formatCompactLevelBadge(item.level);
  const previewText = item.summary || item.description || '';

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
      className="flex items-center justify-between gap-2 px-3 py-2 min-h-11 hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer"
    >
      {/* Left: Compact Level Badge */}
      <div className="shrink-0">
        <span className="sm:hidden inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] text-[10px] font-black">
          {shortBadge}
        </span>
        <span className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] text-[10px] font-bold">
          {item.level}
        </span>
      </div>

      {/* Middle: Single-line Title + Desktop Short Preview */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-bold text-[#243447] dark:text-white truncate">
          {item.title}
        </span>
        {previewText && (
          <span className="hidden sm:inline text-xs text-[#748092] dark:text-[#94A3B8] truncate">
            · {previewText}
          </span>
        )}
      </div>

      {/* Right: Completed Dot + 1-Tap Bookmark + Chevron / External Icon */}
      <div className="shrink-0 flex items-center gap-1">
        {isCompleted && (
          <CheckCircle2
            size={14}
            className="text-emerald-600 shrink-0"
            aria-label="Đã học"
          />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(item.id, item.title);
          }}
          aria-label={isBookmarked ? `Bỏ lưu ${item.title}` : `Lưu ${item.title}`}
          className={`min-h-11 min-w-11 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
            isBookmarked
              ? 'text-[#E85D3F]'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>

        {item.isOfficialExternal ? (
          <a
            href={item.sourceUrl || item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Mở nguồn ngoài ${item.title}`}
            className="min-h-11 min-w-11 flex items-center justify-center text-[#748092] hover:text-[#E85D3F]"
          >
            <ExternalLink size={15} />
          </a>
        ) : (
          <ChevronRight size={16} className="text-[#748092] shrink-0" />
        )}
      </div>
    </div>
  );
}
