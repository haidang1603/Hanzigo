import React, { useEffect, useState } from 'react';
import {
  X,
  Volume2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Printer,
  Compass,
  Plus,
  Check,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { playClickSound, playSuccessSound, speakChinese } from '../../utils/audio';

export default function MaterialsReaderDrawer({
  resource,
  detail,
  isLoading,
  isBookmarked,
  isCompleted,
  savedSrsTerms,
  onClose,
  onToggleBookmark,
  onToggleCompleted,
  onSaveTermToSrs,
  onOpenWorksheet,
  onPracticeHskLevel,
}) {
  const [showPinyin, setShowPinyin] = useState(true);

  useEffect(() => {
    if (!resource) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resource, onClose]);

  if (!resource) return null;

  const active = detail || resource;
  const blocks = Array.isArray(active.contentBlocks) ? active.contentBlocks : [];
  const safeExternalUrl =
    typeof active.sourceUrl === 'string' && active.sourceUrl.startsWith('https://')
      ? active.sourceUrl
      : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={active.title}
        className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-3xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden"
      >
        {/* Sticky Top Bar */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3 bg-white dark:bg-[#1E293B]">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                  {active.level}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                  {active.guideType || active.category}
                </span>
                {active.estimatedMinutes && (
                  <span className="text-[10px] font-semibold text-[#748092] dark:text-[#94A3B8]">
                    ~{active.estimatedMinutes} phút
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white leading-snug">
                {active.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng tài liệu"
              className="min-h-11 min-w-11 p-2 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Reader Quick Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowPinyin((prev) => !prev);
              }}
              aria-pressed={showPinyin}
              className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showPinyin
                  ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] border-transparent'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              {showPinyin ? 'Pinyin: BẬT' : 'Pinyin: TẮT'}
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(active.id, active.title)}
              aria-pressed={isBookmarked}
              className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] border-[#E85D3F]/30'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              <span>{isBookmarked ? 'Đã lưu' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompleted(active.id, active.title)}
              aria-pressed={isCompleted}
              className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{isCompleted ? 'Đã học' : 'Đánh dấu đã học'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] leading-relaxed bg-[#FFF9F2] dark:bg-[#131B24] p-3.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
            {active.description || active.summary}
          </p>

          {isLoading && (
            <div className="p-6 text-center text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              Đang tải nội dung chi tiết...
            </div>
          )}

          {!isLoading &&
            blocks.map((block, bIdx) => {
              if (block.type === 'formula') {
                return (
                  <div
                    key={bIdx}
                    className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2.5"
                  >
                    <h3 className="text-sm font-black text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                      <BookOpen size={15} />
                      <span>{block.heading}</span>
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white bg-white dark:bg-[#1E293B] p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                      {block.formula}
                    </p>
                    <p className="text-xs text-[#243447] dark:text-[#E2E8F0] leading-relaxed">
                      {block.explanation}
                    </p>
                    {Array.isArray(block.notes) && block.notes.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-xs text-[#748092] dark:text-[#94A3B8]">
                        {block.notes.map((n, nIdx) => (
                          <li key={nIdx}>{n}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              if (block.type === 'examples') {
                return (
                  <div key={bIdx} className="space-y-2.5">
                    <h3 className="text-sm font-black text-[#243447] dark:text-white">
                      {block.heading}
                    </h3>
                    <div className="space-y-2.5">
                      {block.items.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">
                              {ex.hanzi}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                playClickSound();
                                speakChinese(ex.hanzi);
                              }}
                              aria-label={`Nghe phát âm ${ex.hanzi}`}
                              className="min-h-11 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Volume2 size={14} />
                              <span>Nghe</span>
                            </button>
                          </div>
                          {showPinyin && ex.pinyin && (
                            <p className="text-xs font-semibold text-[#D97706]">{ex.pinyin}</p>
                          )}
                          <p className="text-xs text-[#243447] dark:text-[#CBD5E1]">{ex.vietnamese}</p>
                          {ex.note && (
                            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                              Ghi chú: {ex.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (block.type === 'key_terms') {
                return (
                  <div key={bIdx} className="space-y-2.5">
                    <h3 className="text-sm font-black text-[#243447] dark:text-white">
                      {block.heading}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {block.terms.map((term, tIdx) => {
                        const isSaved = savedSrsTerms?.has(term.hanzi);
                        return (
                          <div
                            key={tIdx}
                            className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col justify-between gap-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="font-['Noto_Serif_SC'] text-lg font-black text-[#E85D3F]">
                                  {term.hanzi}
                                </span>
                                {showPinyin && (
                                  <p className="text-xs font-semibold text-[#D97706]">{term.pinyin}</p>
                                )}
                                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                                  {term.meaning}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => speakChinese(term.hanzi)}
                                aria-label={`Nghe từ ${term.hanzi}`}
                                className="min-h-11 min-w-11 p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] flex items-center justify-center shrink-0 cursor-pointer"
                              >
                                <Volume2 size={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                playSuccessSound();
                                onSaveTermToSrs(term);
                              }}
                              className={`min-h-11 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                isSaved
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                              }`}
                            >
                              {isSaved ? <Check size={14} /> : <Plus size={14} />}
                              <span>{isSaved ? 'Đã thêm SRS' : 'Lưu vào sổ SRS'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (block.type === 'pitfall') {
                return (
                  <div key={bIdx} className="space-y-2.5">
                    <h3 className="text-sm font-black text-[#E85D3F]">{block.heading}</h3>
                    <div className="space-y-2.5">
                      {block.items.map((pf, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3.5 rounded-2xl bg-white dark:bg-[#131B24] border border-rose-200 dark:border-rose-900/50 space-y-2 text-xs"
                        >
                          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 space-y-0.5">
                            <p className="font-bold">❌ Sai: {pf.wrong}</p>
                            <p className="text-[11px]">{pf.wrongNote}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <p className="font-bold">✅ Đúng: {pf.right}</p>
                              {showPinyin && pf.rightPinyin && (
                                <p className="text-[11px] font-semibold">{pf.rightPinyin}</p>
                              )}
                              <p className="text-[11px]">{pf.rightMeaning}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => speakChinese(pf.right)}
                              aria-label={`Nghe câu đúng ${pf.right}`}
                              className="min-h-11 min-w-11 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-black/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 cursor-pointer"
                            >
                              <Volume2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (block.type === 'table') {
                return (
                  <div key={bIdx} className="space-y-2.5">
                    <h3 className="text-sm font-black text-[#243447] dark:text-white">
                      {block.heading}
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white">
                          <tr>
                            {block.columns.map((col, cIdx) => (
                              <th
                                key={cIdx}
                                className="p-3 font-black border-b border-[#F1E5D8] dark:border-[#2B3A4F] whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1E5D8]/70 dark:divide-[#2B3A4F]/70">
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="bg-white dark:bg-[#1E293B]">
                              {row.map((cell, cellIdx) => (
                                <td
                                  key={cellIdx}
                                  className={`p-3 align-top ${
                                    cellIdx === 0
                                      ? 'font-bold text-[#E85D3F] whitespace-nowrap'
                                      : 'text-[#243447] dark:text-[#E2E8F0]'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              if (block.type === 'checklist') {
                return (
                  <div
                    key={bIdx}
                    className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2"
                  >
                    <h3 className="text-sm font-black text-[#243447] dark:text-white">
                      {block.heading}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-[#243447] dark:text-[#CBD5E1]">
                      {block.items.map((itemText, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{itemText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (block.type === 'worksheet_presets') {
                return (
                  <div key={bIdx} className="space-y-2.5">
                    <h3 className="text-sm font-black text-[#243447] dark:text-white">
                      {block.heading}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {block.presets.map((preset, prIdx) => (
                        <div
                          key={prIdx}
                          className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              {preset.level}
                            </span>
                            <h4 className="text-xs font-bold text-[#243447] dark:text-white pt-1">
                              {preset.label}
                            </h4>
                            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                              {preset.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              onOpenWorksheet(preset.chars);
                            }}
                            className="min-h-11 px-3 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Printer size={14} />
                            <span>Mở phiếu tập viết A4</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}
        </div>

        {/* Sticky Bottom Bar */}
        <div className="shrink-0 p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenWorksheet(active.worksheetChars || '学习汉语');
              }}
              className="min-h-11 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#D97706] border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={15} />
              <span>Tạo phiếu bài tập</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onPracticeHskLevel(active.practiceLevel || active.level);
              }}
              className="min-h-11 px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Compass size={15} />
              <span>Luyện đề cấp này</span>
            </button>
          </div>

          {safeExternalUrl && (
            <a
              href={safeExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 px-3 py-2 text-xs font-bold text-[#E85D3F] hover:underline inline-flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>Nguồn gốc</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
