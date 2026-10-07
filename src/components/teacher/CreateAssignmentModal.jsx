import React from 'react';
import { X } from 'lucide-react';

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
          <h3 className="text-base font-bold text-[#243447] dark:text-white">Giao Bài tập mới</h3>
          <button 
            onClick={onClose}
            className="text-[#748092] hover:text-[#243447] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#748092] mb-1">Tiêu đề bài tập *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Ôn tập 20 Từ vựng Bài 3"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#748092] mb-1">Loại bài tập</label>
            <select
              value={formData.contentType}
              onChange={e => setFormData({ ...formData, contentType: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
            >
              <option value="Vocabulary">Từ vựng (Vocabulary)</option>
              <option value="Grammar">Ngữ pháp (Grammar)</option>
              <option value="Listening">Luyện nghe (Listening)</option>
              <option value="Speaking">Luyện nói (Speaking)</option>
              <option value="Reading">Đọc hiểu (Reading)</option>
              <option value="Writing">Viết chữ (Writing)</option>
              <option value="Quiz">Trắc nghiệm (Quiz - Tự động chấm)</option>
            </select>
          </div>

          {formData.contentType === 'Quiz' && (
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
              <p className="font-bold text-blue-700 dark:text-blue-300">Câu hỏi mẫu (Tự động chấm điểm)</p>
              <input
                type="text"
                placeholder="Câu hỏi trắc nghiệm..."
                value={formData.quizQuestion1}
                onChange={e => setFormData({ ...formData, quizQuestion1: e.target.value })}
                className="w-full p-2 rounded-xl bg-white dark:bg-[#1A2433] border text-xs"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#748092]">Đáp án đúng:</span>
                <select
                  value={formData.quizCorrect}
                  onChange={e => setFormData({ ...formData, quizCorrect: Number(e.target.value) })}
                  className="p-1 rounded bg-white text-xs"
                >
                  <option value={0}>Đáp án A</option>
                  <option value={1}>Đáp án B</option>
                  <option value={2}>Đáp án C</option>
                  <option value={3}>Đáp án D</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#748092] mb-1">Mô tả & Hướng dẫn làm bài</label>
            <textarea
              placeholder="Ghi chú thêm cho học viên..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
              rows={2}
            />
          </div>

          <div>
            <label className="block font-bold text-[#748092] mb-1">Hạn nộp (Deadline)</label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-2 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="asgPub"
              checked={formData.published}
              onChange={e => setFormData({ ...formData, published: e.target.checked })}
              className="rounded text-[#E85D3F]"
            />
            <label htmlFor="asgPub" className="font-bold text-[#243447] dark:text-white">Công bố ngay cho học viên</label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] hover:bg-gray-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
            >
              Giao bài ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
