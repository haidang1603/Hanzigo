import React from 'react';
import { RotateCcw, Check, CheckCircle2, XCircle } from 'lucide-react';

export default function Step7Writing({
  lesson,
  reorderedWords = [],
  availableWords = [],
  handleWordTileClick,
  handleResetWriting,
  handleCheckWriting,
  writingChecked = false,
  writingCorrect = false
}) {
  if (!lesson?.step7_writing) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
          Step 7: Sắp xếp câu hoàn chỉnh
        </span>
        <h3 className="text-base font-bold text-[#243447] dark:text-white">
          {lesson.step7_writing.prompt}
        </h3>
      </div>

      {/* Sentence Drop Zone */}
      <div className="min-h-16 p-3.5 rounded-2xl border-2 border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/50 dark:bg-[#131B24]/50 flex flex-wrap items-center gap-2">
        {reorderedWords.length === 0 ? (
          <span className="text-xs text-[#748092] italic">Bấm các thẻ từ bên dưới để ghép vào đây...</span>
        ) : (
          reorderedWords.map((word, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleWordTileClick?.(word, false)}
              className="px-3.5 py-2 rounded-xl bg-[#E85D3F] text-white font-bold text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available word tiles */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {availableWords.map((word, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleWordTileClick?.(word, true)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-sm hover:border-[#E85D3F] transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Validation button & Reset button */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={handleResetWriting}
          disabled={reorderedWords.length === 0 && availableWords.length === (lesson.step7_writing?.words?.length || 0)}
          className="py-3 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 text-[#748092] hover:text-[#243447] dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          title="Xếp lại từ đầu"
        >
          <RotateCcw size={15} />
          <span>Xếp lại</span>
        </button>

        <button
          type="button"
          onClick={handleCheckWriting}
          disabled={reorderedWords.length === 0}
          className="flex-1 py-3 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Check size={16} />
          <span>Kiểm tra đáp án</span>
        </button>
      </div>

      {writingChecked && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          writingCorrect ? 'bg-[#EBF8F2] text-[#3AA56E]' : 'bg-red-50 text-red-500'
        }`}>
          {writingCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <span>{writingCorrect ? 'Ghép câu hoàn toàn chính xác!' : 'Chưa đúng thứ tự, hãy thử lại.'}</span>
        </div>
      )}
    </div>
  );
}

