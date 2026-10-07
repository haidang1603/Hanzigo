import React from 'react';
import { X } from 'lucide-react';

export default function CreateAnnouncementModal({
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
          <h3 className="text-base font-bold text-[#243447] dark:text-white">Đăng thông báo lớp</h3>
          <button 
            onClick={onClose}
            className="text-[#748092] hover:text-[#243447] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#748092] mb-1">Tiêu đề thông báo *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nhắc nhở lịch kiểm tra định kỳ"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#748092] mb-1">Nội dung thông báo *</label>
            <textarea
              required
              placeholder="Nhập nội dung chi tiết gửi tới toàn bộ học viên..."
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="annPin"
              checked={formData.pinned}
              onChange={e => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded text-[#E85D3F]"
            />
            <label htmlFor="annPin" className="font-bold text-[#243447] dark:text-white">Ghim lên đầu bảng tin lớp</label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
            >
              Đăng thông báo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
