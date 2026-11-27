import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Layers,
  Clock,
  BookMarked,
  BarChart2,
  UserCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { mergeLocalAttemptsToUser } from '../../services/hskService';

export default function HskSubNavHeader({ currentView, user, onNavigate, onOpenAdmin }) {
  const [unmergedCount, setUnmergedCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hanzigo_hsk_attempts');
      if (raw) {
        const list = JSON.parse(raw);
        const unmerged = list.filter((a) => !a.userId).length;
        setUnmergedCount(unmerged);
      }
    } catch {}
  }, [user]);

  const handleSyncLocalData = async () => {
    if (!user) return;
    setSyncing(true);
    const res = await mergeLocalAttemptsToUser(user.id);
    setSyncing(false);
    if (res.success) {
      setUnmergedCount(0);
      setSyncNotice(`Đã đồng bộ thành công ${res.mergedCount} lượt thi vào tài khoản của bạn!`);
      setTimeout(() => setSyncNotice(null), 5000);
    } else {
      setSyncNotice('Có lỗi khi đồng bộ dữ liệu.');
    }
  };

  const isAdmin = Boolean(user && (user.role === 'admin' || user.isAdmin === true));

  const navItems = [
    { id: 'exams', label: 'Đề thi HSK', icon: BookOpen, view: 'exams', active: currentView === 'home' || currentView === 'exams' || currentView === 'exam_detail' },
    { id: 'structure', label: 'Cấu trúc đề thi', icon: ShieldCheck, view: 'structure', active: currentView === 'structure' },
    { id: 'resources', label: 'Kho tài liệu & Đề mẫu', icon: Layers, view: 'resources', active: currentView === 'resources' },
    { id: 'history', label: 'Lịch sử thi', icon: Clock, view: 'history', active: currentView === 'history' },
    { id: 'mistakes', label: 'Sổ tay câu sai', icon: BookMarked, view: 'mistakes', active: currentView === 'mistakes' },
    { id: 'analytics', label: 'Báo cáo & Khuyến nghị', icon: BarChart2, view: 'analytics', active: currentView === 'analytics' },
  ];

  return (
    <div className="border-b border-amber-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Module Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.view)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    item.active
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-amber-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sync & Account State */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                  <UserCheck className="w-3.5 h-3.5 mr-1" />
                  Đã kết nối tài khoản
                </span>
                {unmergedCount > 0 && (
                  <button
                    onClick={handleSyncLocalData}
                    disabled={syncing}
                    className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>Đồng bộ {unmergedCount} bài thi</span>
                  </button>
                )}
                {isAdmin && onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer text-xs"
                    title="Quản trị nội dung & Thẩm định đề thi"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Quản trị</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/40 text-[11px] sm:text-xs">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Chế độ Khách (Lưu trên máy này)</span>
              </div>
            )}
          </div>
        </div>

        {/* Sync Toast Notification */}
        {syncNotice && (
          <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
            <span>{syncNotice}</span>
            <button onClick={() => setSyncNotice(null)} className="font-bold ml-2">×</button>
          </div>
        )}
      </div>
    </div>
  );
}
