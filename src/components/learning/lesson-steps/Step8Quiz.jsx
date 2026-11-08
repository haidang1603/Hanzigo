import React from 'react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';

export default function Step8Quiz({
  lesson,
  selectedAnswers = {},
  quizFeedbacks = {},
  handleSpeak,
  handleSelectQuizOption
}) {
  if (!lesson?.step8_quiz) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
          Step 8: Thử thách trắc nghiệm
        </span>
        <h3 className="text-base font-bold text-[#243447] dark:text-white">
          Kiểm tra độ ghi nhớ kiến thức
        </h3>
      </div>

      <div className="space-y-5">
        {lesson.step8_quiz.map((q, qIdx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;

          return (
            <div key={q.id} className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#E85D3F]">Câu hỏi {qIdx + 1}:</span>
                {q.audioText && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(q.audioText)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] text-[10px] text-[#E85D3F] flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 size={12} />
                    <span>Nghe audio</span>
                  </button>
                )}
              </div>

              <p className="text-xs font-bold text-[#243447] dark:text-white">
                {q.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;
                  const isAnsweredCorrectly = quizFeedbacks[q.id] === true;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnsweredCorrectly}
                      onClick={() => handleSelectQuizOption?.(q.id, optIdx, q.correctIndex)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isAnsweredCorrectly
                          ? isThisCorrect
                            ? 'border-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] text-[#3AA56E] font-bold shadow-xs'
                            : 'border-[#F1E5D8] dark:border-[#2B3A4F] opacity-40'
                          : isSelected
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold'
                          : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] hover:border-[#E85D3F]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {isAnsweredCorrectly && isThisCorrect && (
                          <CheckCircle2 size={15} className="text-[#3AA56E]" />
                        )}
                        {!isAnsweredCorrectly && isSelected && (
                          <XCircle size={15} className="text-red-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered && q.explanation && (
                <p className="text-[11px] text-[#748092] italic pt-1 border-t border-[#F1E5D8]/50">
                  Giải thích: {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

