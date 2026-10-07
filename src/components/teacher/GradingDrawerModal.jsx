import React from 'react';
import { X } from 'lucide-react';

export default function GradingDrawerModal({
  submission,
  onClose,
  onSubmit,
  gradeInput,
  setGradeInput
}) {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#243447] dark:text-white">Chấm điểm Bài nộp</h3>
            <p className="text-xs text-[#748092]">Học viên: {submission.student_name}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#748092] hover:text-[#243447] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Submission preview */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-2">
          <p className="font-bold text-[#243447] dark:text-white">{submission.assignment_title}</p>
          <div className="text-[#748092] dark:text-[#94A3B8] max-h-36 overflow-y-auto whitespace-pre-wrap">
            {submission.submission_data?.notes 
              ? submission.submission_data.notes 
              : JSON.stringify(submission.submission_data, null, 2)}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#748092] mb-1">Điểm số (0 - 100) *</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              placeholder="Ví dụ: 95"
              value={gradeInput.score}
              onChange={e => setGradeInput({ ...gradeInput, score: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#243447] border border-[#F1E5D8] font-bold text-sm text-[#E85D3F]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#748092] mb-1">Nhận xét & Feedback của Giáo viên</label>
            <textarea
              placeholder="Ghi nhận xét chi tiết, khen ngợi hoặc lỗi cần khắc phục..."
              value={gradeInput.feedback}
              onChange={e => setGradeInput({ ...gradeInput, feedback: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#243447] border border-[#F1E5D8] text-xs"
              rows={3}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
            >
              Xác nhận Chấm điểm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
