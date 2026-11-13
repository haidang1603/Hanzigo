import React from 'react';
import { GitBranch, Layers, Sparkles } from 'lucide-react';
import type { CharacterDecomposition } from '../../types/dictionary.types.ts';

export interface CharacterDecompositionTreeProps {
  hanzi: string;
  decomposition: CharacterDecomposition | null;
  onSelectComponent?: (char: string) => void;
}

const STRUCTURE_LABELS: Record<string, string> = {
  '左右': 'Trái – Phải (左右)',
  '上下': 'Trên – Dưới (上下)',
  '内外': 'Trong – Ngoài (内外)',
  '独体': 'Độc thể (独体)',
  '品字': 'Tam hợp (品字)',
  '半包围': 'Bán bao vây (半包围)',
  '좌우': 'Trái – Phải',
  '상하': 'Trên – Dưới',
  '내외': 'Trong – Ngoài',
};

export default function CharacterDecompositionTree({
  hanzi,
  decomposition,
  onSelectComponent,
}: CharacterDecompositionTreeProps) {
  if (!decomposition) {
    return (
      <div className="p-6 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-center text-xs text-[#748092]">
        Chưa có dữ liệu chiết tự cho mục từ "{hanzi}".
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Root Node + Structural Metadata */}
      <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1E293B] border-2 border-[#E85D3F]/30 flex items-center justify-center text-4xl font-extrabold text-[#243447] dark:text-white shadow-xs">
            {hanzi}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F] text-xs font-bold">
                Bộ thủ: {decomposition.radical} ({decomposition.radical_meaning_vi})
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-[#243447] dark:text-slate-200 text-xs font-bold">
                {decomposition.stroke_count} nét
              </span>
            </div>
            <div className="text-xs text-[#5B6B7F] dark:text-slate-300 flex items-center gap-1.5">
              <Layers size={13} className="text-[#E85D3F]" />
              <span>
                Cấu trúc:{' '}
                <strong>
                  {STRUCTURE_LABELS[decomposition.structure_type] || decomposition.structure_type}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Branches -> Components */}
      {decomposition.components.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#748092] uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch size={14} className="text-[#E85D3F]" />
            <span>Cây phân rã thành phần ({decomposition.components.length} bộ phận)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-3 border-l-2 border-[#E85D3F]/40">
            {decomposition.components.map((comp, idx) => (
              <button
                key={`${comp.char}-${idx}`}
                type="button"
                onClick={() => onSelectComponent?.(comp.char)}
                className="p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-left flex items-center gap-3 transition-colors cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] flex items-center justify-center text-2xl font-extrabold text-[#243447] dark:text-white shrink-0">
                  {comp.char}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#E85D3F]">
                    {comp.pinyin || 'Bộ cấu tạo'}
                  </div>
                  <div className="text-xs text-[#5B6B7F] dark:text-slate-300 truncate">
                    {comp.meaning_vi || 'Thành phần Hán tự'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mnemonic Story */}
      {decomposition.mnemonic_vi && (
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-900/15 border border-amber-200/70 dark:border-amber-800/40 space-y-1">
          <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Câu chuyện ghi nhớ (Mnemonic)</span>
          </div>
          <p className="text-xs sm:text-sm text-[#243447] dark:text-slate-200 leading-relaxed">
            {decomposition.mnemonic_vi}
          </p>
        </div>
      )}
    </div>
  );
}

