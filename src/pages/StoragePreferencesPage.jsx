import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Cloud,
  CloudOff,
  Database,
  Download,
  HardDrive,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Cookie,
  Receipt,
} from 'lucide-react';
import { supabase } from '../supabase/config.js';
import { playClickSound, playSuccessSound } from '../utils/audio';
import {
  clearStorageByCategory,
  exportUserLearningSnapshot,
  flushOfflineQueueToSupabase,
  getLastSyncAt,
  getPendingSyncItems,
  getStoragePreferences,
  inspectBrowserStorage,
  saveStoragePreferences,
} from '../core/sync/OfflineSyncManager.js';

function formatKb(bytes) {
  if (!bytes || bytes <= 0) return '0.0 KB';
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDateTime(iso) {
  if (!iso) return 'Chưa từng đồng bộ';
  try {
    return new Date(iso).toLocaleString('vi-VN');
  } catch {
    return iso;
  }
}

export default function StoragePreferencesPage({ setActiveTab }) {
  const [prefs, setPrefs] = useState(() => getStoragePreferences());
  const [storageInfo, setStorageInfo] = useState(null);
  const [pendingItems, setPendingItems] = useState(() => getPendingSyncItems());
  const [lastSyncAt, setLastSyncAt] = useState(() => getLastSyncAt());
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine !== false : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusBanner, setStatusBanner] = useState(null);
  const [confirmClearModal, setConfirmClearModal] = useState(null);

  const refreshMetrics = useCallback(async () => {
    const info = await inspectBrowserStorage();
    setStorageInfo(info);
    setPendingItems(getPendingSyncItems());
    setLastSyncAt(getLastSyncAt());
    setPrefs(getStoragePreferences());
  }, []);

  useEffect(() => {
    refreshMetrics();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleSyncUpdated = () => refreshMetrics();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('hanzigo:sync-updated', handleSyncUpdated);
    window.addEventListener('hanzigo:storage-prefs-updated', handleSyncUpdated);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('hanzigo:sync-updated', handleSyncUpdated);
      window.removeEventListener('hanzigo:storage-prefs-updated', handleSyncUpdated);
    };
  }, [refreshMetrics]);

  const handleNav = (tab) => {
    playClickSound();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePreference = (key) => {
    if (key === 'essential') return;
    playClickSound();
    const next = saveStoragePreferences({
      [key]: !prefs[key],
      consent_given_at: prefs.consent_given_at || new Date().toISOString(),
    });
    setPrefs(next);
    setStatusBanner({
      type: 'success',
      message: 'Đã cập nhật tùy chọn lưu trữ trình duyệt.',
    });
  };

  const handleSyncNow = async () => {
    playClickSound();
    setIsSyncing(true);
    try {
      const result = await flushOfflineQueueToSupabase(supabase);
      await refreshMetrics();
      if (result.errors.length > 0) {
        setStatusBanner({
          type: 'warning',
          message: `Đã đồng bộ ${result.syncedCount} mục, còn ${result.remainingCount} mục chưa đẩy được (${result.errors[0]}).`,
        });
      } else {
        playSuccessSound();
        setStatusBanner({
          type: 'success',
          message:
            result.syncedCount > 0
              ? `Đã đồng bộ thành công ${result.syncedCount} mục học tập lên tài khoản.`
              : 'Mọi dữ liệu học tập đã được đồng bộ mới nhất với đám mây.',
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearFunctional = async () => {
    playClickSound();
    const res = clearStorageByCategory('functional');
    await refreshMetrics();
    setStatusBanner({
      type: 'info',
      message: `Đã xóa ${res.removedCount} mục tùy chọn giao diện (${formatKb(res.removedBytes)}).`,
    });
  };

  const handleClearLocalLearning = async (force = false) => {
    playClickSound();
    const res = clearStorageByCategory('local_learning', { force });
    if (res.requiresConfirmation) {
      setConfirmClearModal({
        pendingCount: res.pendingCount,
        hasExamDrafts: res.hasExamDrafts,
      });
      return;
    }
    setConfirmClearModal(null);
    await refreshMetrics();
    setStatusBanner({
      type: 'info',
      message: `Đã dọn dẹp ${res.removedCount} mục bộ nhớ đệm học tập (${formatKb(res.removedBytes)}).`,
    });
  };

  const handleSyncThenClear = async () => {
    setIsSyncing(true);
    try {
      await flushOfflineQueueToSupabase(supabase);
      await handleClearLocalLearning(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportSnapshot = async () => {
    playClickSound();
    setIsExporting(true);
    try {
      const snapshot = await exportUserLearningSnapshot(supabase);
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `hanzigo-learning-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      playSuccessSound();
      setStatusBanner({
        type: 'success',
        message: 'Đã tải xuống bản sao dữ liệu học tập (.JSON) về thiết bị của bạn.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const categories = storageInfo?.categories || {
    essential: { keyCount: 0, bytes: 0 },
    functional: { keyCount: 0, bytes: 0 },
    local_learning: { keyCount: 0, bytes: 0 },
    analytics: { keyCount: 0, bytes: 0 },
  };

  const switchItems = [
    {
      key: 'essential',
      title: 'Lưu trữ Thiết yếu (Essential)',
      description:
        'Duy trì phiên đăng nhập Supabase Auth, kiểm soát quyền RBAC và bảo vệ chống CSRF.',
      locked: true,
      badge: 'Bắt buộc để duy trì đăng nhập & bảo mật',
    },
    {
      key: 'functional',
      title: 'Lưu trữ Tùy chọn Giao diện (Functional)',
      description:
        'Ghi nhớ chế độ Sáng/Tối, cỡ chữ, chế độ hiển thị Pinyin/Phồn thể và tốc độ phát Audio.',
      locked: false,
    },
    {
      key: 'local_learning',
      title: 'Dữ liệu Học tập Cục bộ & Ngoại tuyến (Local Learning)',
      description:
        'Lưu nháp bài thi CBT HSK, từ vựng tạm thời và hàng đợi đồng bộ khi thiết bị mất mạng.',
      locked: false,
    },
    {
      key: 'analytics',
      title: 'Phân tích Trải nghiệm & Hiệu năng (Analytics)',
      description:
        'Thu thập chỉ số hiệu năng ẩn danh để tối ưu hóa tốc độ tải và chất lượng bài học (mặc định tắt).',
      locked: false,
    },
  ];

  const legalLinks = [
    { id: 'privacy', label: 'Chính sách bảo mật', icon: ShieldCheck },
    { id: 'terms', label: 'Điều khoản sử dụng', icon: FileText },
    { id: 'cookies', label: 'Chính sách Cookie', icon: Cookie },
    { id: 'refund', label: 'Học phí & Hoàn tiền', icon: Receipt },
    { id: 'storage-preferences', label: 'Tùy chọn lưu trữ', icon: HardDrive },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* 1. Hero Header & Trạng thái Đồng bộ Đám mây */}
      <div className="relative overflow-hidden p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A0A1F] text-white shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#00D4FF]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Quay lại Trang chủ</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/35 text-[#00D4FF] text-[11px] font-bold">
                <Sliders size={12} />
                <span>Mục 5 — Trung tâm Kiểm soát Lưu trữ</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isOnline
                    ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                    : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                }`}
              >
                {isOnline ? <Cloud size={12} /> : <CloudOff size={12} />}
                <span>{isOnline ? 'Trực tuyến (Online)' : 'Ngoại tuyến (Offline)'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tùy Chọn Lưu Trữ &amp; Dữ Liệu Thiết Bị
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kiểm soát dữ liệu lưu trên trình duyệt, đồng bộ hàng đợi học tập ngoại tuyến lên
              Supabase và tải xuống bản sao dữ liệu cá nhân của bạn bất kỳ lúc nào.
            </p>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-2.5 shrink-0 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-slate-300 space-y-1 sm:text-right">
              <div>
                Đang chờ đồng bộ:{' '}
                <strong className="text-[#00D4FF]">{pendingItems.length} mục</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Đồng bộ gần nhất: {formatDateTime(lastSyncAt)}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00D4FF] hover:brightness-110 disabled:opacity-60 text-[#0A0A1F] font-bold text-xs shadow-md transition cursor-pointer"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ lên tài khoản ngay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Toast / Alert */}
      {statusBanner && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-medium ${
            statusBanner.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
              : statusBanner.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
              : 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{statusBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 2. Thẻ Đo lường Dung lượng Thiết bị (Storage Breakdown Cards) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database size={17} className="text-[#E85D3F]" />
            <span>Phân tích Dung lượng Lưu trữ Trình duyệt</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tổng localStorage: <strong>{formatKb(storageInfo?.localStorageBytes || 0)}</strong> •
            IndexedDB/Cache ước tính:{' '}
            <strong>{formatKb(storageInfo?.indexedDbEstimatedBytes || 0)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Lưu trữ Thiết yếu</span>
              <Lock size={14} />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatKb(categories.essential.bytes)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {categories.essential.keyCount} khóa (Supabase Auth, RBAC, Preferences)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>Lưu trữ Tùy chọn</span>
              <Sliders size={14} />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatKb(categories.functional.bytes)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {categories.functional.keyCount} khóa (Theme, cỡ chữ, Pinyin, Audio)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#E85D3F]">
              <span>Dữ liệu Học tập Cục bộ</span>
              <HardDrive size={14} />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatKb(categories.local_learning.bytes)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {categories.local_learning.keyCount} khóa (Hàng đợi sync, nháp HSK, SRS)
            </p>
          </div>
        </div>
      </section>

      {/* 3. Bảng Điều khiển Tùy chọn Lưu trữ (4 Switches) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Cài đặt Quyền Lưu trữ theo Nhóm
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {switchItems.map((item) => {
            const enabled = Boolean(prefs[item.key]);
            return (
              <div
                key={item.key}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  disabled={item.locked}
                  onClick={() => handleTogglePreference(item.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    item.locked ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                  } ${enabled ? 'bg-[#E85D3F]' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Khu vực Quản lý Dữ liệu trên Thiết bị & Xuất dữ liệu */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Quản lý Dữ liệu Cá nhân &amp; Bộ nhớ đệm
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleClearFunctional}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
          >
            <Trash2 size={14} className="text-sky-500" />
            <span>Xóa dữ liệu tùy chọn giao diện</span>
          </button>

          <button
            type="button"
            onClick={() => handleClearLocalLearning(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-xs font-bold text-rose-700 dark:text-rose-300 transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Xóa bộ nhớ đệm &amp; dữ liệu học tập tạm thời</span>
          </button>

          <button
            type="button"
            onClick={handleExportSnapshot}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-60 text-xs font-bold transition cursor-pointer"
          >
            <Download size={14} />
            <span>
              {isExporting
                ? 'Đang tạo bản sao...'
                : 'Tải xuống bản sao dữ liệu học tập (.JSON)'}
            </span>
          </button>
        </div>

        {/* Hộp thoại cảnh báo khi còn dữ liệu chưa đồng bộ */}
        {confirmClearModal && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 space-y-3">
            <div className="flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <div className="text-xs space-y-1">
                <div className="font-bold">
                  Phát hiện dữ liệu học tập chưa đồng bộ lên tài khoản!
                </div>
                <p>
                  Hiện có <strong>{confirmClearModal.pendingCount} mục</strong> trong hàng đợi đồng
                  bộ{confirmClearModal.hasExamDrafts ? ' và bản nháp bài thi HSK đang làm dở' : ''}.
                  Nếu xóa ngay, dữ liệu ngoại tuyến này sẽ bị mất vĩnh viễn.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSyncThenClear}
                disabled={isSyncing}
                className="px-3.5 py-2 rounded-lg bg-[#00D4FF] text-[#0A0A1F] text-xs font-bold cursor-pointer"
              >
                {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ trước khi xóa'}
              </button>
              <button
                type="button"
                onClick={() => handleClearLocalLearning(true)}
                className="px-3.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                Vẫn xóa dữ liệu cục bộ
              </button>
              <button
                type="button"
                onClick={() => setConfirmClearModal(null)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 5. Liên kết Pháp lý chéo */}
      <nav
        aria-label="Liên kết chính sách pháp lý"
        className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800"
      >
        {legalLinks.map((link) => {
          const Icon = link.icon;
          const active = link.id === 'storage-preferences';
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                active
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={13} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

