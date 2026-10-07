import React from 'react';
import { X } from 'lucide-react';

export default function StudentDetailModal({
  student,
  onClose
}) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs">
              {student.student_name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#243447] dark:text-white">{student.student_name}</h3>
              <p className="text-[10px] text-[#748092]">{student.student_email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#748092] hover:text-[#243447] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447]">
            <span className="font-bold text-[#748092]">Đánh giá học thuật:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${student.health?.badgeClass}`}>
              {student.health?.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200">
              <p className="text-[10px] text-[#748092]">Kinh nghiệm (XP)</p>
              <p className="text-base font-black text-[#E85D3F]">{student.xp || 0}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
              <p className="text-[10px] text-[#748092]">Chuỗi học tập</p>
              <p className="text-base font-black text-amber-600">{student.streak || 0} ngày</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
              <p className="text-[10px] text-[#748092]">Từ vựng đã học</p>
              <p className="text-base font-black text-emerald-600">{student.words_learned || 0}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200">
              <p className="text-[10px] text-[#748092]">Thời gian tích lũy</p>
              <p className="text-base font-black text-blue-600">{student.study_hours || 1.5} giờ</p>
            </div>
          </div>

          <p className="text-[11px] text-[#748092] italic pt-1 text-center">
            Chẩn đoán: {student.health?.reason}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#FFF9F2] text-[#243447] dark:text-white font-bold text-xs hover:bg-[#F1E5D8] transition-all cursor-pointer border border-[#F1E5D8]"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
