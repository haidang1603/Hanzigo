import React, { useState, useMemo } from 'react';
import { X, Search, Grid, Filter, BookOpen } from 'lucide-react';
import { KANGXI_RADICALS, getRadicalsGroupedByStrokes } from '../../data/radicalsData';
import { playClickSound } from '../../utils/audio';

export default function RadicalBrowserModal({ isOpen, onClose, onSelectRadical }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStrokeTab, setSelectedStrokeTab] = useState('all');

  const grouped = useMemo(() => getRadicalsGroupedByStrokes(), []);

  const filteredRadicals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return KANGXI_RADICALS.filter(r => {
      // Stroke count filter
      if (selectedStrokeTab !== 'all' && r.strokes !== Number(selectedStrokeTab)) {
        return false;
      }

      if (!q) return true;

      return (
        r.radical.includes(q) ||
        r.variants.some(v => v.includes(q)) ||
        r.pinyin.toLowerCase().includes(q) ||
        r.hanviet.toLowerCase().includes(q) ||
        r.meaning.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedStrokeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-[#F1E5D8] dark:border-[#334155] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#F1E5D8] dark:border-[#334155] flex items-center justify-between bg-[#FFF9F2] dark:bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white flex items-center justify-center shadow-md shadow-[#E85D3F]/25 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#243447] dark:text-[#F3F4F6]">
                Bảng 214 Bộ Thủ Khang Hy (康熙部首)
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Tra cứu chữ Hán theo bộ thủ chuẩn mực từ 1 đến 17 nét
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Stroke Filters Toolbar */}
        <div className="p-4 sm:p-6 border-b border-[#F1E5D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo bộ thủ (ví dụ: 亻, 水), âm Hán Việt (Nhân, Thủy) hoặc ý nghĩa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#334155] bg-[#FFF9F2] dark:bg-[#0F172A] text-sm text-[#243447] dark:text-[#F3F4F6] focus:outline-hidden focus:ring-2 focus:ring-[#E85D3F]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Stroke Selector Tabs (1 - 17) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setSelectedStrokeTab('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedStrokeTab === 'all'
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Tất cả (214)
            </button>

            {Array.from({ length: 17 }).map((_, idx) => {
              const strokeNum = idx + 1;
              const count = grouped[strokeNum]?.length || 0;
              if (count === 0) return null;
              return (
                <button
                  key={strokeNum}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedStrokeTab(String(strokeNum));
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedStrokeTab === String(strokeNum)
                      ? 'bg-[#E85D3F] text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {strokeNum} nét ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Radicals Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredRadicals.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Không tìm thấy bộ thủ nào phù hợp với từ khóa "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredRadicals.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    playClickSound();
                    onSelectRadical(r.radical);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155] hover:border-[#E85D3F] hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#E85D3F] group-hover:scale-110 transition-transform">
                      {r.radical}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {r.strokes} nét
                    </span>
                  </div>

                  <div className="mt-2 text-xs">
                    <div className="font-bold text-[#243447] dark:text-[#F3F4F6] flex items-center justify-between">
                      <span>{r.hanviet}</span>
                      <span className="text-[11px] text-gray-500 font-normal">{r.pinyin}</span>
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-1 mt-0.5">
                      {r.meaning}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#F1E5D8] dark:border-[#334155] bg-[#FFF9F2] dark:bg-[#0F172A] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span>Hiển thị <strong>{filteredRadicals.length}</strong> / 214 bộ thủ</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
