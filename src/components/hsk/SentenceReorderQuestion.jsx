import React, { useMemo } from 'react';
import { RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';

/**
 * =========================================================================
 * SENTENCE REORDER QUESTION COMPONENT (HSK WRITING SECTION)
 * =========================================================================
 * Trình dựng câu tương tác bằng thẻ từ (Interactive Word Chips):
 * - Học viên bấm các thẻ từ rời rạc để xếp thành câu hoàn chỉnh theo ngữ pháp.
 * - Hỗ trợ bấm vào thẻ đã xếp để gỡ trả lại khay từ.
 * - Nút "Làm lại (Reset)" để xóa câu đang xếp.
 * - Hiển thị bản xem trước câu hoàn chỉnh.
 * - Tương thích 100% với cả phương thức chọn đáp án trắc nghiệm truyền thống.
 * =========================================================================
 */
export default function SentenceReorderQuestion({
  question,
  userAnswer,
  onAnswerChange,
  isReviewMode = false
}) {
  const words = useMemo(() => {
    return question.words || question.scrambledWords || [];
  }, [question]);

  // Chuẩn hóa mảng từ đã đặt
  const placedWords = useMemo(() => {
    if (Array.isArray(userAnswer)) return userAnswer;
    if (typeof userAnswer === 'string') {
      // Nếu đáp án là chuỗi khớp với 1 option, hoặc là chuỗi ghép
      return [];
    }
    return [];
  }, [userAnswer]);

  // Tính toán các từ còn lại trong khay (Word Bank)
  const availableBank = useMemo(() => {
    const placedCounts = {};
    placedWords.forEach(w => {
      placedCounts[w] = (placedCounts[w] || 0) + 1;
    });

    const bank = [];
    words.forEach((w, idx) => {
      const placed = placedCounts[w] || 0;
      if (placed > 0) {
        placedCounts[w] = placed - 1;
      } else {
        bank.push({ word: w, originalIndex: idx });
      }
    });
    return bank;
  }, [words, placedWords]);

  // Xử lý khi nhấn từ trong khay để thêm vào câu
  const handleSelectWord = (word) => {
    if (isReviewMode) return;
    const nextPlaced = [...placedWords, word];
    onAnswerChange(nextPlaced);
  };

  // Xử lý khi nhấn từ trong câu để gỡ bỏ
  const handleRemoveWord = (indexToRemove) => {
    if (isReviewMode) return;
    const nextPlaced = placedWords.filter((_, idx) => idx !== indexToRemove);
    onAnswerChange(nextPlaced);
  };

  // Làm lại từ đầu
  const handleReset = () => {
    if (isReviewMode) return;
    onAnswerChange([]);
  };

  return (
    <div className="space-y-4 my-3">
      {/* 1. Khung hiển thị câu đang xếp (Sentence Assembly Dropzone) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-[#E85D3F]/40 dark:border-slate-700 min-h-[90px] flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-bold">
          <span>Câu bạn đang sắp xếp:</span>
          {placedWords.length > 0 && !isReviewMode && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[#E85D3F] hover:text-[#D44D30] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xếp lại</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 min-h-[44px]">
          {placedWords.length === 0 ? (
            <span className="text-xs text-slate-400 italic">
              Bấm vào các thẻ từ bên dưới theo đúng thứ tự để tạo câu hoàn chỉnh...
            </span>
          ) : (
            placedWords.map((word, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRemoveWord(idx)}
                disabled={isReviewMode}
                className="px-3.5 py-1.5 rounded-xl bg-[#E85D3F] text-white font-bold text-sm shadow-xs hover:bg-[#D44D30] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer group"
                title="Bấm để gỡ từ này"
              >
                <span>{word}</span>
                {!isReviewMode && <span className="text-xs opacity-70 group-hover:opacity-100">✕</span>}
              </button>
            ))
          )}
          {placedWords.length > 0 && (
            <span className="text-lg font-bold text-slate-600 dark:text-slate-300">。</span>
          )}
        </div>
      </div>

      {/* 2. Khay các thẻ từ cần sắp xếp (Scrambled Word Bank) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-bold text-slate-500 mb-2.5">
          Khay từ ngữ (Bấm chọn theo thứ tự):
        </div>

        <div className="flex flex-wrap gap-2.5">
          {availableBank.length === 0 ? (
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 py-1">
              <Check className="w-4 h-4" />
              <span>Đã xếp toàn bộ các từ vào câu.</span>
            </div>
          ) : (
            availableBank.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectWord(item.word)}
                disabled={isReviewMode}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-xs hover:border-[#E85D3F] hover:bg-[#FFF5F2] dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                {item.word}
              </button>
            ))
          )}
        </div>
      </div>

      {/* 3. Lựa chọn dạng trắc nghiệm bổ trợ (Option choices alternative) */}
      {question.options && question.options.length > 0 && (
        <div className="pt-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Hoặc chọn đáp án nhanh:
          </div>
          <div className="space-y-2">
            {question.options.map((opt, optIdx) => {
              const isSelected = userAnswer === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => onAnswerChange(optIdx)}
                  disabled={isReviewMode}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#E85D3F] bg-[#FFF5F2] dark:bg-orange-950/20 text-[#E85D3F] font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {opt.translation && (
                    <span className="text-[11px] text-slate-400">{opt.translation}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
