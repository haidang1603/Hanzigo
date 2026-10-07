import React from 'react';
import { X } from 'lucide-react';

export default function UploadMaterialModal({
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
          <h3 className="text-base font-bold text-[#243447] dark:text-white">Thêm Tài liệu cho Lớp</h3>
          <button 
            onClick={onClose}
            className="text-[#748092] hover:text-[#243447] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#748092] mb-1">Tên tài liệu *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Sách Giáo trình HSK 1 PDF"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] font-bold text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#748092] mb-1">Loại tệp</label>
              <select
                value={formData.fileType}
                onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] font-bold text-xs"
              >
                <option value="pdf">Tài liệu PDF</option>
                <option value="audio">Âm thanh (Audio/MP3)</option>
                <option value="image">Hình ảnh (Image)</option>
                <option value="video">Video bài giảng</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#748092] mb-1">Đường dẫn tệp (URL) *</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={formData.fileUrl}
                onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#748092] mb-1">Ghi chú thêm</label>
            <textarea
              placeholder="Mô tả nội dung tài liệu..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs"
              rows={2}
            />
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
              Lưu tài liệu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
