import React from 'react';
import {
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';
import { MATERIAL_LEVELS } from '../../utils/materialsStorage';
import { playClickSound } from '../../utils/audio';
import { COMPACT_GUIDE_TABS } from './materialsHelpers';

export default function MaterialsFilterBar({
  filteredCount,
  materialsCount,
  selectedGuideType = 'Tất cả',
  setSelectedGuideType,
  selectedExamVersion,
  setSelectedExamVersion,
  selectedLevel,
  setSelectedLevel,
  viewMode = 'grid',
  onChangeViewMode,
  isFilterOpen,
  hasActiveFilters,
  handleResetFilters,
  renderMobileFilterToggle,
}) {
  return (
    <div className="bg-white dark:bg-[#1E293B] p-3 sm:p-4 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-2.5">
      {/* Row 1: Single-line horizontal scrolling category tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {COMPACT_GUIDE_TABS.map((tab) => {
          const active = selectedGuideType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playClickSound();
                setSelectedGuideType(tab.id);
              }}
              aria-pressed={active}
              className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                active
                  ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24]'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Row 2: Secondary filters (desktop inline / mobile button) + Grid/List View Switcher */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
        {/* Left: Mobile toggle or Desktop selects */}
        <div className="flex items-center gap-2 min-w-0">
          {renderMobileFilterToggle && renderMobileFilterToggle()}

          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            <select
              aria-label="Hệ thi HSK"
              value={selectedExamVersion}
              onChange={(e) => setSelectedExamVersion(e.target.value)}
              className="min-h-11 px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-bold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">Hệ: Tất cả</option>
              <option value="2.0">HSK 2.0</option>
              <option value="3.0">HSK 3.0</option>
            </select>

            <select
              aria-label="Cấp độ HSK"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="min-h-11 px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-bold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
            >
              {MATERIAL_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === 'Tất cả' ? 'Cấp: Tất cả' : lvl}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-11 px-3 py-2 rounded-xl text-xs font-bold text-[#E85D3F] bg-rose-50 dark:bg-rose-950/40 flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Xóa lọc</span>
              </button>
            )}

            <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-semibold">
              {filteredCount} / {materialsCount}
            </span>
          </div>
        </div>

        {/* Right: Grid / Compact List View Switcher */}
        <div className="flex items-center gap-1 shrink-0 p-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
          <button
            type="button"
            onClick={() => onChangeViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="Chế độ lưới"
            className={`min-h-11 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#E85D3F] text-white'
                : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            <LayoutGrid size={14} />
            <span>Lưới</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="Chế độ danh sách gọn"
            className={`min-h-11 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              viewMode === 'list'
                ? 'bg-[#E85D3F] text-white'
                : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            <List size={14} />
            <span>Danh sách</span>
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Drawer for Hệ / Cấp độ / Xóa lọc */}
      {isFilterOpen && (
        <div className="sm:hidden pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] grid grid-cols-2 gap-2">
          <select
            aria-label="Chọn hệ thi HSK"
            value={selectedExamVersion}
            onChange={(e) => setSelectedExamVersion(e.target.value)}
            className="min-h-11 px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-bold text-[#243447] dark:text-white focus:outline-none"
          >
            <option value="all">Hệ: Tất cả</option>
            <option value="2.0">HSK 2.0</option>
            <option value="3.0">HSK 3.0</option>
          </select>

          <select
            aria-label="Chọn cấp độ HSK"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="min-h-11 px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-bold text-[#243447] dark:text-white focus:outline-none"
          >
            {MATERIAL_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl === 'Tất cả' ? 'Cấp: Tất cả' : lvl}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="col-span-2 min-h-11 px-3 py-2 rounded-xl text-xs font-bold text-[#E85D3F] bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Xóa lọc ({filteredCount} / {materialsCount})</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
