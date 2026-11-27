import React from 'react';
import { CheckCircle2, Clock, Send } from 'lucide-react';
import {
  SECTION_STATES,
  getSectionStatus,
  canAccessSection,
} from '../../utils/examSectionLockEngine.js';
import { formatExamTime } from './hskPracticeHelpers.js';

export function HskExamTopBar({
  exam,
  examMode,
  isLearningMode,
  answeredCount,
  totalQuestions,
  flaggedIds,
  showPinyin,
  setShowPinyin,
  sectionLowTime,
  timeLeft,
  timeSpentSeconds,
  activeSectionSchedule,
  activeSectionRemaining,
  sections,
  currentSecKey,
  sectionLockState,
  setCurrentIdx,
  hasNextUnlockedSection,
  isSubmitting,
  restoredToast,
  setRestoredToast,
  sectionBannerNotice,
  setSectionBannerNotice,
  handleSwitchExamMode,
  setConfirmFinishSectionOpen,
  setShowConfirmModal,
}) {
  return (
    <>
      {/* Toast khôi phục phiên */}
      {restoredToast && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã tự động khôi phục các câu trả lời bạn đang làm dở từ phiên trước.</span>
          </div>
          <button onClick={() => setRestoredToast(false)} className="text-emerald-700 hover:text-emerald-950 text-xs font-black">
            ✕
          </button>
        </div>
      )}

      {/* Thông báo khóa pha phân môn */}
      {sectionBannerNotice && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between">
          <span>{sectionBannerNotice}</span>
          <button type="button" onClick={() => setSectionBannerNotice('')} className="text-amber-700 hover:text-amber-950 text-xs font-black cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Sticky Timer */}
      <div className="sticky top-0 z-30 bg-[#FFF9F2]/95 dark:bg-slate-950/95 backdrop-blur-md py-1.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 mb-3 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="w-full sm:w-auto sm:flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-black text-[#E85D3F] uppercase tracking-wider truncate">
              {exam.level} • {exam.title}
            </span>
            <span
              className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                examMode === 'simulation'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              {examMode === 'simulation' ? '⏱️ 正式模考 (CBT)' : '📚 Luyện tập tự do'}
            </span>
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
            {isLearningMode ? 'Đã làm:' : '已完成：'} <strong className="text-slate-900 dark:text-white">{answeredCount}</strong> / {totalQuestions} {isLearningMode ? 'câu' : '题'}
            {flaggedIds.length > 0 && (
              <span className="ml-2 text-amber-600 font-bold">
                • {isLearningMode ? 'Đánh dấu xem lại:' : '已标记：'} {flaggedIds.length} {isLearningMode ? 'câu' : '题'}
              </span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mode Switch Toggle */}
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleSwitchExamMode('simulation')}
              className={`min-h-11 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                examMode === 'simulation'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              {isLearningMode ? 'Thi thử' : '正式考试'}
            </button>
            <button
              type="button"
              onClick={() => handleSwitchExamMode('practice')}
              className={`min-h-11 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                examMode === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              {isLearningMode ? 'Luyện tập' : '练习模式'}
            </button>
          </div>

          {/* Pinyin Toggle (Chỉ hiện ở Learning Mode, ẩn hoàn toàn ở Exam Mode) */}
          {isLearningMode && (
            <button
              type="button"
              onClick={() => setShowPinyin((prev) => !prev)}
              className={`min-h-11 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                showPinyin
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500'
              }`}
            >
              Pinyin: {showPinyin ? 'Bật' : 'Tắt'}
            </button>
          )}

          {/* Clock */}
          <div
            className={`min-h-11 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-black ${
              sectionLowTime || (examMode === 'simulation' && timeLeft < 300)
                ? 'bg-rose-100 text-rose-700 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-[#E85D3F]" />
            {examMode === 'simulation' ? (
              <span className="flex items-center gap-1.5">
                {activeSectionSchedule && (
                  <span className="text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400">
                    {activeSectionSchedule.labelVi}:
                  </span>
                )}
                <span>{formatExamTime(activeSectionRemaining)}</span>
                {sections.length > 1 && (
                  <span className="text-[10px] font-sans text-slate-400">
                    / {formatExamTime(timeLeft)}
                  </span>
                )}
              </span>
            ) : (
              formatExamTime(timeSpentSeconds)
            )}
          </div>

          {hasNextUnlockedSection && (
            <button
              type="button"
              onClick={() => setConfirmFinishSectionOpen(true)}
              disabled={isSubmitting}
              className="min-h-11 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold text-xs hover:bg-amber-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Kết thúc phần này sớm
            </button>
          )}

          {/* Submit Action */}
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="min-h-11 px-4 py-2 rounded-xl bg-[#E85D3F] text-white font-bold text-xs shadow-sm hover:bg-[#CB4529] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? (isLearningMode ? 'Đang nộp...' : '正在交卷...') : (isLearningMode ? 'Nộp bài' : '交卷')}
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs (Khóa cứng theo pha CTI ở chế độ thi thử) */}
      {sections.length > 1 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec, secIdx) => {
            const isActive = sec.key === currentSecKey;
            const status = getSectionStatus(sectionLockState, secIdx);
            const accessible = canAccessSection(sectionLockState, secIdx);
            return (
              <button
                key={sec.key}
                type="button"
                disabled={!accessible}
                onClick={() => {
                  if (accessible) setCurrentIdx(sec.firstIdx);
                }}
                className={`min-h-11 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E85D3F] text-white shadow-md shadow-orange-500/20 scale-[1.02] cursor-pointer'
                    : accessible
                      ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-300 cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-400 opacity-50 cursor-not-allowed'
                }`}
              >
                {status === SECTION_STATES.LOCKED_COMPLETED && <span>🔒</span>}
                {status === SECTION_STATES.LOCKED_UPCOMING && <span>⏳</span>}
                <span>{sec.title}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {sec.answered}/{sec.total}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

export function HskExamConfirmModals({
  confirmFinishSectionOpen,
  setConfirmFinishSectionOpen,
  activeSectionSchedule,
  examSchedule,
  activeSectionIdx,
  handleConfirmFinishSectionEarly,
  showConfirmModal,
  setShowConfirmModal,
  isLearningMode,
  totalQuestions,
  answeredCount,
  flaggedIds,
  executeSubmission,
  isSubmitting,
}) {
  return (
    <>
      {/* Modal xác nhận kết thúc sớm phân môn (2 bước chống bấm nhầm) */}
      {confirmFinishSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              Xác nhận kết thúc sớm phân môn?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Sau khi kết thúc phần <strong>{activeSectionSchedule?.labelVi}</strong>, bạn sẽ <strong>không thể quay lại</strong> chỉnh sửa các câu trong phần này và hệ thống sẽ chuyển ngay sang <strong>{examSchedule[activeSectionIdx + 1]?.labelVi || 'phần tiếp theo'}</strong>.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmFinishSectionOpen(false)}
                className="flex-1 min-h-11 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tiếp tục làm phần này
              </button>
              <button
                type="button"
                onClick={handleConfirmFinishSectionEarly}
                className="flex-1 min-h-11 py-3 rounded-xl bg-[#E85D3F] text-white font-bold text-xs shadow-md hover:bg-[#CB4529] transition-colors cursor-pointer"
              >
                Khóa &amp; chuyển phần
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#E85D3F] flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2">
              {isLearningMode ? 'Xác nhận nộp bài thi?' : '确认提交试卷？'}
            </h3>

            <div className="text-xs text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span>{isLearningMode ? 'Tổng số câu:' : '总题数：'}</span>
                <strong>{totalQuestions} {isLearningMode ? 'câu' : '题'}</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                <span>{isLearningMode ? 'Đã làm:' : '已作答：'}</span>
                <strong>{answeredCount} {isLearningMode ? 'câu' : '题'}</strong>
              </div>
              {totalQuestions - answeredCount > 0 && (
                <div className="flex justify-between p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold">
                  <span>{isLearningMode ? 'Chưa trả lời:' : '未作答：'}</span>
                  <strong>{totalQuestions - answeredCount} {isLearningMode ? 'câu' : '题'}</strong>
                </div>
              )}
              {flaggedIds.length > 0 && (
                <div className="flex justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                  <span>{isLearningMode ? 'Đánh dấu xem lại:' : '已标记：'}</span>
                  <strong>{flaggedIds.length} {isLearningMode ? 'câu' : '题'}</strong>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 min-h-11 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isLearningMode ? 'Tiếp tục làm bài' : '继续作答'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  executeSubmission();
                }}
                disabled={isSubmitting}
                className="flex-1 min-h-11 py-3 rounded-xl bg-[#E85D3F] text-white font-bold text-xs shadow-md hover:bg-[#CB4529] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting ? (isLearningMode ? 'Đang chấm điểm...' : '正在评分...') : (isLearningMode ? 'Đồng ý nộp bài' : '确认交卷')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
