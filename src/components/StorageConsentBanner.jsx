import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings, Check, X, ChevronRight, Lock } from 'lucide-react';

export const STORAGE_CONSENT_KEY = 'hanzigo_storage_consent';

export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredConsent(consent) {
  try {
    const record = {
      ...consent,
      essential: true, // always true
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_CONSENT_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent('hanzigo_consent_changed', { detail: record }));
    return record;
  } catch (err) {
    console.warn('Failed to save consent:', err);
    return null;
  }
}

export default function StorageConsentBanner({ setActiveTab }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Preference switches
  const [allowPreferences, setAllowPreferences] = useState(true);
  const [allowAiPersonalization, setAllowAiPersonalization] = useState(true);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      // Delay slightly for smooth page entry
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for open requests (e.g. from footer link or policy page)
  useEffect(() => {
    const handleOpen = () => {
      const existing = getStoredConsent();
      if (existing) {
        setAllowPreferences(existing.preferences !== false);
        setAllowAiPersonalization(existing.aiPersonalization !== false);
      }
      setIsCustomizing(true);
      setIsVisible(true);
    };

    window.addEventListener('hanzigo_open_consent_modal', handleOpen);
    return () => window.removeEventListener('hanzigo_open_consent_modal', handleOpen);
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    saveStoredConsent({
      preferences: true,
      aiPersonalization: true
    });
    setIsVisible(false);
  };

  const handleRejectOptional = () => {
    saveStoredConsent({
      preferences: false,
      aiPersonalization: false
    });
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    saveStoredConsent({
      preferences: allowPreferences,
      aiPersonalization: allowAiPersonalization
    });
    setIsVisible(false);
  };

  const handleOpenCookiePolicy = () => {
    if (setActiveTab) {
      setActiveTab('cookies');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#cookies';
    }
  };

  return (
    <aside 
      aria-label="Tùy chọn lưu trữ dữ liệu và quyền riêng tư"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-black/40 backdrop-blur-md flex justify-center animate-in fade-in slide-in-from-bottom duration-300"
    >
      <div className="w-full max-w-4xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl shadow-2xl p-5 sm:p-6 text-[#243447] dark:text-white space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-[#D97706] flex items-center justify-center shrink-0">
              <Cookie size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black">
                Quyền Riêng Tư & Tùy Chọn Lưu Trữ Dữ Liệu
              </h2>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                HanziGo sử dụng LocalStorage cục bộ để lưu tiến trình học tập và phiên đăng nhập. Không có cookie quảng cáo.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            aria-label="Tạm đóng thông báo tùy chọn lưu trữ"
            className="p-1.5 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content details */}
        {!isCustomizing ? (
          <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
            Để đảm bảo hệ thống nhớ được bài học của bạn (tiến độ HSK, từ vựng Flashcard SM-2, chuỗi ngày streak) và bảo vệ phiên đăng nhập, chúng tôi lưu dữ liệu trực tiếp trong trình duyệt của bạn. Bạn có thể chọn chấp nhận tất cả hoặc chỉ cho phép dữ liệu thiết yếu vận hành. Xem chi tiết tại{' '}
            <button
              type="button"
              onClick={handleOpenCookiePolicy}
              className="text-[#E85D3F] font-bold hover:underline cursor-pointer"
            >
              Chính sách lưu trữ & Cookie
            </button>.
          </p>
        ) : (
          <div className="space-y-3 pt-1 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            {/* Category 1: Essential */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold text-[#243447] dark:text-white">Dữ liệu thiết yếu (Bắt buộc)</span>
                </div>
                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                  Token bảo mật phiên đăng nhập, lưu kết quả bài thi HSK, điểm danh và tiến trình bài học.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                Luôn bật
              </span>
            </div>

            {/* Category 2: Preferences */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1A232E] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-blue-500" />
                  <span className="text-xs font-bold text-[#243447] dark:text-white">Tùy biến giao diện & Âm thanh</span>
                </div>
                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                  Ghi nhớ chế độ Sáng / Tối (Dark mode) và hiệu ứng âm thanh phát âm khi làm bài tập.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={allowPreferences} 
                  onChange={(e) => setAllowPreferences(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E85D3F]"></div>
              </label>
            </div>

            {/* Category 3: AI Personalization */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1A232E] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-purple-500" />
                  <span className="text-xs font-bold text-[#243447] dark:text-white">Lịch sử cá nhân hóa & Hội thoại AI</span>
                </div>
                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                  Lưu tạm hội thoại với AI Tutor Tiểu Hàm và hồ sơ phân tích điểm yếu học thuật.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={allowAiPersonalization} 
                  onChange={(e) => setAllowAiPersonalization(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E85D3F]"></div>
              </label>
            </div>
          </div>
        )}

        {/* Buttons (Equal visual prominence & clear accessibility) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          {!isCustomizing ? (
            <>
              <button
                type="button"
                onClick={() => setIsCustomizing(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                Tùy chỉnh chi tiết
              </button>

              <button
                type="button"
                onClick={handleRejectOptional}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E293B] text-xs font-bold text-[#243447] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-xs"
              >
                Chỉ dữ liệu thiết yếu
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={14} />
                <span>Chấp nhận tất cả</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] transition-all cursor-pointer"
              >
                Quay lại
              </button>

              <button
                type="button"
                onClick={handleSaveCustom}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={14} />
                <span>Lưu lựa chọn của tôi</span>
              </button>
            </>
          )}
        </div>

      </div>
    </aside>
  );
}
