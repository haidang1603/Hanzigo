import React, { useEffect, useState } from 'react';
import { Cookie, ShieldCheck, SlidersHorizontal, X, CheckCircle2, Lock } from 'lucide-react';
import {
  acceptAllStoragePreferences,
  acceptEssentialOnlyPreferences,
  getStoragePreferences,
  saveStoragePreferences,
} from '../../core/sync/OfflineSyncManager.js';

export default function CookieStorageConsentBanner({ setActiveTab }) {
  const [visible, setVisible] = useState(() => !getStoragePreferences().consent_given_at);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [draftPrefs, setDraftPrefs] = useState(() => getStoragePreferences());

  useEffect(() => {
    const onPrefsUpdated = () => {
      const latest = getStoragePreferences();
      setDraftPrefs(latest);
      if (latest.consent_given_at) {
        setVisible(false);
        setShowQuickModal(false);
      }
    };
    window.addEventListener('hanzigo:storage-prefs-updated', onPrefsUpdated);
    return () => window.removeEventListener('hanzigo:storage-prefs-updated', onPrefsUpdated);
  }, []);

  if (!visible) return null;

  const handleEssentialOnly = () => {
    acceptEssentialOnlyPreferences();
    setVisible(false);
  };

  const handleAcceptAll = () => {
    acceptAllStoragePreferences();
    setVisible(false);
  };

  const handleSaveQuickCustomize = () => {
    saveStoragePreferences({
      ...draftPrefs,
      essential: true,
      consent_given_at: new Date().toISOString(),
    });
    setShowQuickModal(false);
    setVisible(false);
  };

  const openFullStoragePage = () => {
    setShowQuickModal(false);
    if (typeof setActiveTab === 'function') {
      setActiveTab('storage-preferences');
    } else {
      window.location.hash = '#storage-preferences';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div
        role="dialog"
        aria-label="Thông báo chấp thuận Cookie và Lưu trữ"
        className="fixed bottom-4 inset-x-4 z-50 max-w-4xl mx-auto rounded-2xl bg-[#0a0a1f]/95 border border-[#00D4FF]/30 backdrop-blur-xl text-slate-100 shadow-[0_16px_50px_rgba(0,212,255,0.18)] p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-200"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00D4FF] uppercase tracking-wider">
              <Cookie className="w-4 h-4 shrink-0" />
              <span>Quyền riêng tư &amp; Tùy chọn lưu trữ HanziGo</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              HanziGo sử dụng bộ nhớ trình duyệt để duy trì đăng nhập an toàn, lưu tiến độ học tập
              khi ngoại tuyến và tùy chọn giao diện. Cookie phân tích mặc định{' '}
              <strong className="text-white">tắt</strong> cho đến khi bạn đồng ý.{' '}
              <button
                type="button"
                onClick={() => {
                  if (typeof setActiveTab === 'function') {
                    setActiveTab('cookies');
                  } else {
                    window.location.hash = '#cookies';
                  }
                }}
                className="text-[#00D4FF] underline hover:text-cyan-300 cursor-pointer font-semibold"
              >
                Xem Chính sách Cookie
              </button>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleEssentialOnly}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Chỉ dùng thiết yếu
            </button>

            <button
              type="button"
              onClick={() => {
                setDraftPrefs(getStoragePreferences());
                setShowQuickModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-[#00D4FF]/40 text-[#00D4FF] text-xs font-semibold transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tùy chỉnh lưu trữ</span>
            </button>

            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D4FF] hover:brightness-110 text-[#0a0a1f] text-xs font-bold shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chấp nhận tất cả</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tùy chỉnh nhanh */}
      {showQuickModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[#0a0a1f] border border-[#00D4FF]/35 text-slate-100 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00D4FF]" />
                <h3 className="text-sm font-bold text-white">Tùy chỉnh Lưu trữ &amp; Cookie</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickModal(false)}
                className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lưu trữ Thiết yếu</span>
                  </div>
                  <p className="text-slate-400 mt-0.5">
                    Phiên đăng nhập Supabase Auth, bảo mật RBAC &amp; CSRF (luôn bật).
                  </p>
                </div>
                <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  BẮT BUỘC
                </span>
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                <div className="pr-3">
                  <div className="font-bold text-white">Tùy chọn giao diện (Functional)</div>
                  <p className="text-slate-400 mt-0.5">
                    Giao diện sáng/tối, cỡ chữ, chế độ Pinyin/Phồn thể &amp; tốc độ Audio.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draftPrefs.functional}
                  onChange={(e) =>
                    setDraftPrefs((prev) => ({ ...prev, functional: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#00D4FF]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                <div className="pr-3">
                  <div className="font-bold text-white">Dữ liệu học tập cục bộ (Offline)</div>
                  <p className="text-slate-400 mt-0.5">
                    Lưu nháp bài thi HSK, từ vựng tạm thời và hàng đợi đồng bộ khi mất mạng.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draftPrefs.local_learning}
                  onChange={(e) =>
                    setDraftPrefs((prev) => ({ ...prev, local_learning: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#00D4FF]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                <div className="pr-3">
                  <div className="font-bold text-white">Phân tích trải nghiệm (Analytics)</div>
                  <p className="text-slate-400 mt-0.5">
                    Thống kê hiệu năng ẩn danh giúp cải thiện chất lượng bài học.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draftPrefs.analytics}
                  onChange={(e) =>
                    setDraftPrefs((prev) => ({ ...prev, analytics: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#00D4FF]"
                />
              </label>
            </div>

            <div className="px-5 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950/70">
              <button
                type="button"
                onClick={openFullStoragePage}
                className="text-xs text-[#00D4FF] hover:underline font-semibold cursor-pointer"
              >
                Mở trang Tùy chọn lưu trữ đầy đủ →
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuickCustomize}
                  className="px-4 py-1.5 rounded-xl bg-[#00D4FF] text-[#0a0a1f] text-xs font-bold cursor-pointer"
                >
                  Lưu tùy chọn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

