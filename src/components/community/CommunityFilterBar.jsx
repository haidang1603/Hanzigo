import React from 'react';
import { Search, X } from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { TAG_FILTERS, HSK_GROUP_FILTERS } from './communityConstants.js';

export default function CommunityFilterBar({
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
  selectedHskGroup,
  setSelectedHskGroup,
  postSort,
  setPostSort,
}) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
        <input
          type="text"
          placeholder="Tìm kiếm bài viết, tác giả hoặc chủ đề..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-base sm:text-sm font-medium text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#748092] hover:text-[#243447] cursor-pointer"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Tag Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TAG_FILTERS.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => {
              playClickSound();
              setSelectedTag(tag.id);
            }}
            className={`min-h-11 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTag === tag.id
                ? 'bg-[#E85D3F] text-white shadow-sm'
                : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* HSK Level Group Filter + Sort Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {HSK_GROUP_FILTERS.map((grp) => (
            <button
              key={grp.id}
              type="button"
              onClick={() => {
                playClickSound();
                setSelectedHskGroup(grp.id);
              }}
              className={`min-h-11 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                selectedHskGroup === grp.id
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'bg-white dark:bg-[#1E293B] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
          {[
            { id: 'newest', label: 'Mới nhất' },
            { id: 'popular', label: 'Nổi bật nhất' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                playClickSound();
                setPostSort(s.id);
              }}
              className={`min-h-11 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                postSort === s.id
                  ? 'bg-[#E85D3F] text-white'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
