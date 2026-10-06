import React from 'react';
import { GraduationCap, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TeacherGuard({ user, isTeacher, onGoHome, children }) {
  const { logout } = useAuth();

  if (!isTeacher) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] border border-[#E85D3F]/20 flex items-center justify-center shadow-inner">
            <GraduationCap size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#243447] dark:text-white">
              Khu vực Dành riêng cho Giáo viên
            </h2>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Tài khoản hiện tại ({user?.name || user?.email || 'Khách'}) đang ở vai trò{' '}
              <span className="font-bold text-[#E85D3F]">
                {user?.role === 'student' ? 'Học viên (Student)' : 'Chưa xác thực'}
              </span>.
            </p>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Bạn cần đăng ký hoặc đăng nhập với vai trò{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Giáo viên (Teacher)</span>{' '}
              để quản lý lớp học và giảng dạy trực tuyến. Người dùng không được tự ý sửa đổi quyền hạn.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                logout();
                onGoHome();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#E85D3F]/30"
            >
              <LogIn size={15} />
              <span>Đăng xuất & Đăng nhập với vai trò Giáo viên</span>
            </button>

            <button
              onClick={onGoHome}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#F1E5D8] dark:hover:bg-[#2B3A4F] text-[#243447] dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#F1E5D8] dark:border-[#2B3A4F]"
            >
              <ArrowLeft size={15} />
              <span>Quay lại Trang chủ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
