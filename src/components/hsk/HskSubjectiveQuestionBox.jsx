import React from 'react';
import { FileText } from 'lucide-react';

export default function HskSubjectiveQuestionBox({
  exam,
  currentQ,
  answers,
  recordAnswerChange,
  isLearningMode,
  examMode,
  renderHsk6SummarySimulator,
}) {
  const isFreeSubjective =
    currentQ.question_type === 'free_writing' ||
    currentQ.question_type === 'essay' ||
    currentQ.question_type === 'translation' ||
    currentQ.question_type === 'speaking' ||
    currentQ.questionType === 'essay' ||
    currentQ.questionType === 'translation' ||
    currentQ.questionType === 'speaking';

  return (
    <>
      {/* QUESTION TYPE: FREE WRITING / ESSAY TASK (Viết tự luận theo tranh) */}
      {isFreeSubjective && (
        <div className="mb-8 p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              {isLearningMode ? 'Nhiệm vụ viết / dịch / khẩu ngữ tự luận' : '主观题作答区'}
            </span>
            <span className="text-xs text-amber-800 dark:text-amber-300 font-bold">
              {isLearningMode
                ? `Yêu cầu: ${currentQ.min_words || 6} — ${currentQ.max_words || 30} chữ Hán`
                : `字数要求：${currentQ.min_words || 6} — ${currentQ.max_words || 30} 字`}
            </span>
          </div>

          {(currentQ.required_words || currentQ.writing_criteria) && (currentQ.required_words || currentQ.writing_criteria).length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">
                {isLearningMode ? 'Từ khóa trọng tâm:' : '参考关键词：'}
              </span>
              {(currentQ.required_words || currentQ.writing_criteria).map((rw, rwIdx) => (
                <span key={rwIdx} className="px-2.5 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-[#E85D3F] font-black text-xs">
                  {rw}
                </span>
              ))}
            </div>
          )}

          <textarea
            rows={currentQ.question_type === 'essay' || currentQ.questionType === 'essay' ? 8 : 5}
            value={typeof answers[currentQ.id] === 'string' ? answers[currentQ.id] : ''}
            onChange={(e) => recordAnswerChange(currentQ.id, e.target.value)}
            placeholder={isLearningMode ? 'Nhập bài làm của bạn bằng chữ Hán tại đây...' : '请在此输入您的作答内容（中文）...'}
            className="w-full p-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:border-[#E85D3F] focus:outline-none"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>
              {isLearningMode ? 'Số chữ hiện tại: ' : '当前字数：'}
              <strong>{(answers[currentQ.id] || '').length}</strong>
              {isLearningMode ? ' ký tự' : ' 字'}
            </span>
            {isLearningMode && (
              <span className="italic text-[11px] text-amber-700 dark:text-amber-400">
                * Bài viết tự luận sẽ được tự đánh giá theo thang tiêu chí &amp; đối chiếu bài mẫu sau khi nộp.
              </span>
            )}
          </div>
        </div>
      )}

      {/* QUESTION TYPE: HSK 6 TWO-PHASE SUMMARY ESSAY (缩写 — Câu 101) */}
      {currentQ.question_type === 'essay_summary' && renderHsk6SummarySimulator && (
        <div className="mb-8 space-y-3">
          {renderHsk6SummarySimulator({
            exam,
            currentQ,
            practiceMode: examMode === 'practice',
            recordAnswerChange,
          })}
          {answers[currentQ.id] && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
              ✅ Đã lưu bài tóm tắt vào phiếu làm bài ({String(answers[currentQ.id]).length} ký tự). Hãy bấm &quot;Nộp bài thi&quot; khi hoàn tất toàn bộ đề!
            </div>
          )}
        </div>
      )}
    </>
  );
}
