import React from 'react';
import { X } from 'lucide-react';

export default function CreateClassModal({
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
          <h3 className="text-base font-bold text-[#243447] dark:text-white">Tạo Lớp học mới</h3>
          <button 
            onClick={onClose}
            className="text-[#748092] hover:text-[#243447] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#748092] mb-1">Tên lớp học *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: HSK 1 - Khóa Buổi tối 2-4-6"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#748092] mb-1">Mô tả mục tiêu lớp</label>
            <textarea
              placeholder="Giới thiệu về mục tiêu, lịch học, yêu cầu..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#748092] mb-1">Trình độ HSK</label>
              <select
                value={formData.hskLevel}
                onChange={e => setFormData({ ...formData, hskLevel: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
              >
                <option value="HSK 1">HSK 1</option>
                <option value="HSK 2">HSK 2</option>
                <option value="HSK 3">HSK 3</option>
                <option value="HSK 4">HSK 4</option>
                <option value="HSK 5">HSK 5</option>
                <option value="HSK 6">HSK 6</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#748092] mb-1">Sĩ số tối đa</label>
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Tối thiểu 1 học viên"
                value={formData.maxStudents}
                onChange={e => setFormData({ ...formData, maxStudents: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
              />
              <p className="text-[10px] text-[#748092] mt-1">Từ 1 học viên trở lên (hỗ trợ kèm 1-1 hoặc lớp nhóm)</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
            >
              Tạo lớp & Nhận mã
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
