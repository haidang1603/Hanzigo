import React from 'react';
import { Volume2, PenTool, Mic, Bookmark, BookmarkCheck, Search } from 'lucide-react';

export default function Step2Vocabulary({
  lesson,
  handleSpeak,
  onSelectWriting,
  onSelectPronounce,
  handleSaveFlashcard,
  savedFlashcardIds = new Set(),
  playClickSound,
  setSelectedDictWord,
  setDictModalTab,
  setDictCharIndex
}) {
  if (!lesson?.step2_vocabulary) return null;

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
        <h3 className="text-base font-bold text-[#243447] dark:text-white">
          Từ vựng cốt lõi ({lesson.step2_vocabulary.length} từ)
        </h3>
        <p className="text-xs text-[#748092]">Bấm biểu tượng loa để nghe phát âm từng từ và câu ví dụ</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {lesson.step2_vocabulary.map(v => (
          <div key={v.id} className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-black text-[#243447] dark:text-white font-serif tracking-wider">
                    {v.hanzi}
                  </div>
                  {v.pos && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      {v.pos}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-[#E85D3F] font-mono mt-0.5">
                  {v.pinyin} • {v.hanviet}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSpeak(v.audioText || v.hanzi)}
                className="p-2.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <div className="text-sm font-semibold text-[#243447] dark:text-white">
              {v.meaning}
            </div>

            {v.example && (
              <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1">
                <div className="font-bold text-[#243447] dark:text-white flex items-center justify-between">
                  <span>{v.example.hanzi}</span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(v.example.hanzi)}
                    className="text-[#E85D3F] hover:text-[#CB4529] p-0.5"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
                <div className="text-[#E85D3F] font-mono text-[11px]">{v.example.pinyin}</div>
                <div className="text-[#748092] text-[11px]">{v.example.meaning}</div>
              </div>
            )}

            {/* Cohesive Cross-action links: Luyện viết, Luyện phát âm, Lưu Flashcard, Tra từ điển */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
              {onSelectWriting && (
                <button
                  type="button"
                  onClick={() => onSelectWriting(v)}
                  title="Luyện viết chữ Hán trên ô mễ tự"
                  className="px-2.5 py-1 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#E85D3F] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <PenTool size={11} />
                  <span>Tập viết</span>
                </button>
              )}
              {onSelectPronounce && (
                <button
                  type="button"
                  onClick={() => onSelectPronounce(v)}
                  title="Luyện nói phản xạ & chấm điểm phát âm bằng AI"
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Mic size={11} />
                  <span>Luyện phát âm</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSaveFlashcard?.(v)}
                title="Lưu từ này vào bộ thẻ Flashcard và thuật toán lặp lại ngắt quãng SRS"
                className={`px-2.5 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                  savedFlashcardIds.has(v.id || v.hanzi)
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                {savedFlashcardIds.has(v.id || v.hanzi) ? (
                  <>
                    <BookmarkCheck size={11} />
                    <span>Đã lưu SRS</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={11} />
                    <span>Lưu Flashcard</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound?.();
                  setSelectedDictWord?.(v);
                  setDictModalTab?.('stroke');
                  setDictCharIndex?.(0);
                }}
                title="Xem hoạt họa thứ tự nét (Stroke Order) & tập viết"
                className="px-2.5 py-1 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#E85D3F] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <PenTool size={11} />
                <span>Thuận bút & Viết</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound?.();
                  setSelectedDictWord?.(v);
                  setDictModalTab?.('detail');
                  setDictCharIndex?.(0);
                }}
                title="Xem chi tiết bộ thủ, phân tách nét và ngữ cảnh trong từ điển"
                className="px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ml-auto"
              >
                <Search size={11} />
                <span>Tra từ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

