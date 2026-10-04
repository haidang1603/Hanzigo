import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminGuard({ user, isAdmin, onGoHome, children }) {
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#243447] dark:text-white">
              Khu vực Quản trị Bảo mật
            </h2>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Tài khoản hiện tại ({user?.email || 'Khách'}) không có quyền Quản trị viên (Admin). Thao tác này đã được ghi nhận trên hệ thống bảo mật Supabase.
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Quay lại Trang chủ</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
}
