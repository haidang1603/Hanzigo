import React from 'react';
import { canAccessQuestionIndex } from '../../utils/examSectionLockEngine.js';

export default function HskQuestionPalette({
  exam,
  answers,
  currentIdx,
  setCurrentIdx,
  flaggedIds,
  paletteFilter,
  setPaletteFilter,
  sectionLockState,
  examSchedule,
  isLearningMode,
  answeredCount,
  totalQuestions,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {isLearningMode ? 'Bảng câu hỏi' : '答题卡'} ({answeredCount}/{totalQuestions})
        </h3>
      </div>

      {/* Filter tabs on palette */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold mb-3">
        <button
          type="button"
          onClick={() => setPaletteFilter('all')}
          className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
            paletteFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
          }`}
        >
          {isLearningMode ? 'Tất cả' : '全部'} ({totalQuestions})
        </button>
        <button
          type="button"
          onClick={() => setPaletteFilter('unanswered')}
          className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
            paletteFilter === 'unanswered' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
          }`}
        >
          {isLearningMode ? 'Chưa làm' : '未答'} ({totalQuestions - answeredCount})
        </button>
        <button
          type="button"
          onClick={() => setPaletteFilter('flagged')}
          className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
            paletteFilter === 'flagged' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500'
          }`}
        >
          {isLearningMode ? 'Đánh dấu' : '标记'} ({flaggedIds.length})
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 scrollbar-none">
        {exam.questions.map((q, idx) => {
          const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';
          const isCurrent = idx === currentIdx;
          const isFlag = flaggedIds.includes(q.id);
          const qAccessible = canAccessQuestionIndex(sectionLockState, examSchedule, idx);

          if (paletteFilter === 'unanswered' && hasAnswer) return null;
          if (paletteFilter === 'flagged' && !isFlag) return null;

          return (
            <button
              key={q.id}
              type="button"
              disabled={!qAccessible}
              onClick={() => {
                if (qAccessible) setCurrentIdx(idx);
              }}
              className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center relative transition-all ${
                isCurrent ? 'ring-2 ring-[#E85D3F] ring-offset-2' : ''
              } ${
                !qAccessible
                  ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 opacity-40 cursor-not-allowed'
                  : hasAnswer
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 cursor-pointer'
              } ${isFlag ? 'border-2 border-amber-400' : ''}`}
            >
              {idx + 1}
              {isFlag && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"></span>
          <span>{isLearningMode ? 'Đã trả lời' : '已作答'} ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-slate-300 dark:bg-slate-700 inline-block"></span>
          <span>{isLearningMode ? 'Chưa làm' : '未作答'} ({totalQuestions - answeredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md border-2 border-amber-400 bg-amber-100 inline-block"></span>
          <span>{isLearningMode ? 'Đánh dấu xem lại' : '已标记'} ({flaggedIds.length})</span>
        </div>
      </div>
    </div>
  );
}
