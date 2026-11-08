import React from 'react';
import { Sparkles, Play, PenTool } from 'lucide-react';
import { getHanziDecomposition } from '../../../data/hanziDecomposition.js';
import StrokeOrderPlayer from '../../dictionary/StrokeOrderPlayer';
import InteractiveWritingPad from '../../dictionary/InteractiveWritingPad';

export default function Step3Hanzi({
  lesson,
  activeInlineHanzi = {},
  setActiveInlineHanzi,
  playClickSound,
  onSelectWriting
}) {
  if (!lesson?.step3_hanzi) return null;

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
        <h3 className="text-base font-bold text-[#243447] dark:text-white">
          Phân tích cấu tạo & Thuận bút chữ Hán
        </h3>
        <p className="text-xs text-[#748092]">Hiểu quy tắc nét bút và câu chuyện gợi nhớ (mnemonic) giúp nhớ lâu gấp 3 lần</p>
      </div>

      <div className="space-y-4">
        {lesson.step3_hanzi.map((h, idx) => {
          const decomp = getHanziDecomposition(h.hanzi);
          const structName = h.structure?.name || decomp?.structureName || 'Đơn thể (独体字)';
          const structSym = h.structure?.symbol || decomp?.symbol || '◰';
          const idsFormula = h.ids || decomp?.ids || h.hanzi;
          const currentInline = activeInlineHanzi[h.hanzi];

          return (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-4xl font-serif font-black text-[#E85D3F] flex items-center justify-center shadow-xs">
                    {h.hanzi}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#243447] dark:text-white">
                      Chữ {h.hanzi} ({h.pinyin}) — {h.meaning}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-[#748092]">
                        Số nét: <span className="font-bold text-[#E85D3F]">{h.strokesCount} nét</span>
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                        {structSym} {structName}
                      </span>
                      {idsFormula && idsFormula !== h.hanzi && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          IDS: {idsFormula}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons to trigger inline stroke order or writing pad */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound?.();
                      setActiveInlineHanzi?.(prev => ({
                        ...prev,
                        [h.hanzi]: prev[h.hanzi] === 'stroke' ? null : 'stroke'
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentInline === 'stroke'
                        ? 'bg-[#E85D3F] text-white shadow-xs'
                        : 'bg-orange-500/10 hover:bg-orange-500/20 text-[#E85D3F]'
                    }`}
                  >
                    <Play size={13} />
                    <span>{currentInline === 'stroke' ? 'Thu gọn' : 'Xem thuận bút'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound?.();
                      setActiveInlineHanzi?.(prev => ({
                        ...prev,
                        [h.hanzi]: prev[h.hanzi] === 'write' ? null : 'write'
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentInline === 'write'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    <PenTool size={13} />
                    <span>{currentInline === 'write' ? 'Thu gọn' : 'Tập viết'}</span>
                  </button>
                </div>
              </div>

              {/* Inline Interactive Stroke Player Mount */}
              {currentInline === 'stroke' && (
                <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#E85D3F]/30 animate-in fade-in space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E85D3F] flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Hoạt ảnh thứ tự từng nét chuẩn chữ "{h.hanzi}":</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveInlineHanzi?.(prev => ({ ...prev, [h.hanzi]: null }))}
                      className="text-xs text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                    >
                      Đóng [✕]
                    </button>
                  </div>
                  <StrokeOrderPlayer
                    character={h.hanzi}
                    strokesCount={h.strokesCount}
                  />
                </div>
              )}

              {/* Inline Interactive Writing Pad Mount */}
              {currentInline === 'write' && (
                <div className="p-4 rounded-2xl bg-[#F0FDF4] dark:bg-[#14261C] border border-emerald-500/30 animate-in fade-in space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <PenTool size={14} />
                      <span>Luyện viết chữ "{h.hanzi}" trên ô mễ tự:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveInlineHanzi?.(prev => ({ ...prev, [h.hanzi]: null }))}
                      className="text-xs text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                    >
                      Đóng [✕]
                    </button>
                  </div>
                  <InteractiveWritingPad
                    character={h.hanzi}
                    strokesCount={h.strokesCount}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                  <span className="font-bold text-[#E85D3F] block">Quy tắc thứ tự nét:</span>
                  <span className="text-[#243447] dark:text-white">{h.strokeOrderText}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                  <span className="font-bold text-[#45B97C] block">Bộ phận & Bộ thủ:</span>
                  <span className="text-[#243447] dark:text-white">
                    {h.radical?.name ? `${h.radical.name} (${h.radical.char || ''}) • ${h.components}` : h.components}
                  </span>
                </div>
              </div>

              {h.mnemonic && (
                <div className="p-3.5 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-xs space-y-1">
                  <span className="font-bold text-[#3AA56E] flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Mẹo ghi nhớ nhanh:</span>
                  </span>
                  <p className="text-[#243447] dark:text-[#CBD5E1] leading-relaxed">{h.mnemonic}</p>
                </div>
              )}

              {onSelectWriting && (
                <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <button
                    type="button"
                    onClick={() => onSelectWriting({
                      char: h.hanzi,
                      hanzi: h.hanzi,
                      pinyin: h.pinyin,
                      meaning: h.meaning,
                      strokes: h.strokesCount,
                      strokesCount: h.strokesCount,
                      strokeOrder: h.strokeOrderText,
                      components: h.components,
                      tip: h.mnemonic
                    })}
                    className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#E85D3F] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PenTool size={13} />
                    <span>Mở studio tập viết toàn màn hình</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

