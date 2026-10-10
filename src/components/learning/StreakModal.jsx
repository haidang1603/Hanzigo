import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  X, 
  ArrowRight, 
  Award,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getStreakStatus, 
  getLongestStreak, 
  getStreakFreeze, 
  consumeStreakFreeze, 
  getWeeklyStudyDays,
  getUserStorageKey
} from '../../utils/gamification';
import { playClickSound, playSuccessSound, playLevelUpSound } from '../../utils/audio';

const STREAK_MILESTONES = [
  { days: 3, xp: 50, title: 'Tân Binh Chăm Chỉ', icon: '🌱' },
  { days: 7, xp: 120, title: 'Tuần Lễ Rực Lửa', icon: '🔥' },
  { days: 14, xp: 300, title: 'Ngọn Lửa Kiên Định', icon: '⚡' },
  { days: 30, xp: 800, title: 'Bất Diệt Hán Ngữ', icon: '👑' }
];

export default function StreakModal({ user, isOpen, onClose, onNavigateTab }) {
  const [streakStatus, setStreakStatus] = useState(() => getStreakStatus(user));
  const [longestStreak, setLongestStreak] = useState(() => getLongestStreak(user));
  const [freezeCount, setFreezeCount] = useState(() => getStreakFreeze(user));
  const [freezeUsedToast, setFreezeUsedToast] = useState(false);

  // Authoritative streak resolution across status, user object, and storage
  const effectiveStreak = useMemo(() => {
    const statusVal = streakStatus?.streak ?? 0;
    const userVal = typeof user?.streak === 'number' && !isNaN(user.streak) ? user.streak : 0;
    let localKeyVal = 0;
    let globalVal = 0;
    try {
      const k = getUserStorageKey('hanzigo_streak_count', user);
      localKeyVal = parseInt(localStorage.getItem(k) || '0', 10) || 0;
      globalVal = parseInt(localStorage.getItem('hanzigo_streak_count') || '0', 10) || 0;
    } catch {}
    return Math.max(statusVal, userVal, localKeyVal, globalVal);
  }, [streakStatus, user]);

  const hasStudied = Boolean(streakStatus?.hasStudiedToday);

  const effectiveLongestStreak = useMemo(() => {
    const statusLongest = longestStreak || 0;
    const userLongest = typeof user?.longest_streak === 'number' ? user.longest_streak : 0;
    return Math.max(statusLongest, userLongest, effectiveStreak);
  }, [longestStreak, user, effectiveStreak]);

  // Sync freeze count, streak & longest streak fresh when modal opens
  useEffect(() => {
    if (isOpen) {
      setFreezeCount(getStreakFreeze(user));
      setStreakStatus(getStreakStatus(user));
      setLongestStreak(getLongestStreak(user));
    }
  }, [isOpen, user]);

  // Support ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const weeklyDays = useMemo(() => getWeeklyStudyDays(user), [user, streakStatus, effectiveStreak]);

  // Hours remaining until midnight
  const hoursRemaining = useMemo(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.max(1, Math.round((midnight.getTime() - now.getTime()) / (1000 * 60 * 60)));
  }, [isOpen]);

  const handleUseFreeze = () => {
    playClickSound();
    const res = consumeStreakFreeze(user);
    if (res.success) {
      setFreezeCount(res.remaining);
      const updatedStatus = getStreakStatus(user);
      setStreakStatus(updatedStatus);
      setLongestStreak(getLongestStreak(user));
      setFreezeUsedToast(true);
      playSuccessSound();
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch {}
      setTimeout(() => setFreezeUsedToast(false), 3000);
    }
  };

  const handleActionStudy = () => {
    playClickSound();
    onClose();
    if (typeof onNavigateTab === 'function') {
      onNavigateTab('roadmap');
    }
    window.location.hash = '#roadmap';
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playClickSound();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl overflow-hidden relative space-y-5 animate-in zoom-in-95 duration-200 cursor-default"
      >
        
        {/* Prominent High-Contrast Close Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 active:scale-95 text-white border border-white/40 shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer transition-all hover:rotate-90 duration-200 group"
          title="Đóng (Esc)"
          aria-label="Đóng cửa sổ chuỗi học"
        >
          <X size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Hero Roaring Flame Header */}
        <div className="relative overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-amber-500 via-[#E85D3F] to-[#CB4529] text-white text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Glowing Animated Flame */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-xl shadow-amber-900/30">
              <Flame size={44} className="text-yellow-200 fill-yellow-300 drop-shadow-md animate-pulse" />
            </div>
            {hasStudied && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#45B97C] text-white flex items-center justify-center border-2 border-white text-xs font-bold shadow-sm">
                ✓
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-['Noto_Serif_SC'] tracking-tight">
            {effectiveStreak} Ngày Liên Tiếp
          </h2>

          <p className="text-xs text-white/90 mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
            {hasStudied ? (
              <span>Tuyệt vời! Ngọn lửa học tập của bạn hôm nay đã được thắp sáng rực rỡ. Tiếp tục giữ lửa vào ngày mai nhé!</span>
            ) : effectiveStreak > 0 ? (
              <span>Ngọn lửa đang chờ bạn! Hoàn thành 1 bài học trong <strong>{hoursRemaining} giờ</strong> tới để giữ vững chuỗi {effectiveStreak} ngày!</span>
            ) : (
              <span>Bắt đầu chuỗi học tập ngay hôm nay! Hoàn thành bài học đầu tiên trong <strong>{hoursRemaining} giờ</strong> tới để thắp sáng chuỗi (+1 ngày)!</span>
            )}
          </p>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 space-y-5">
          
          {/* Weekly 7-Day Calendar Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                <Calendar size={13} className="text-[#E85D3F]" />
                <span>Tiến độ tuần này</span>
              </span>
              <span className="text-[11px] text-[#748092]">
                {hasStudied ? 'Hôm nay: Đã học ✅' : 'Hôm nay: Chưa học ⏳'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weeklyDays.map((day, idx) => {
                return (
                  <div 
                    key={idx}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-between space-y-1 transition-all ${
                      day.isToday 
                        ? (day.isStudied 
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-500 shadow-sm'
                            : 'bg-orange-50 dark:bg-orange-950/40 border-2 border-dashed border-[#E85D3F]')
                        : day.isStudied
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${day.isToday ? 'text-[#E85D3F]' : 'text-[#748092]'}`}>
                      {day.name}
                    </span>

                    <div className="w-6 h-6 flex items-center justify-center">
                      {day.isStudied ? (
                        <Flame size={16} className="text-amber-500 fill-amber-500" />
                      ) : day.isToday ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E85D3F] animate-ping" />
                      ) : day.isPast ? (
                        <span className="text-[10px] text-gray-300 dark:text-gray-600 font-bold">•</span>
                      ) : (
                        <span className="text-[10px] text-gray-300 dark:text-gray-600 font-bold">○</span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-bold text-[#748092]">
                      {day.dateNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Bar (Longest Streak & Streak Freeze) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                <Trophy size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-[#748092] truncate">Kỷ lục dài nhất</div>
                <div className="text-sm font-black text-[#243447] dark:text-white font-mono">{effectiveLongestStreak} ngày</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                  <Shield size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-[#748092] truncate">Bảo vệ chuỗi</div>
                  <div className="text-xs font-black text-[#243447] dark:text-white">{freezeCount} khiên ❄️</div>
                </div>
              </div>

              {freezeCount > 0 && !hasStudied && (
                <button
                  onClick={handleUseFreeze}
                  className="px-2 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold cursor-pointer transition-all shrink-0"
                  title="Dùng khiên bảo vệ chuỗi nếu hôm nay bận"
                >
                  Dùng
                </button>
              )}
            </div>
          </div>

          {freezeUsedToast && (
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs text-center font-bold animate-in fade-in">
              ❄️ Đã kích hoạt 1 khiên bảo vệ chuỗi! Chuỗi của bạn sẽ an toàn hôm nay.
            </div>
          )}

          {/* Milestones Road */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
              <Award size={13} className="text-amber-500" />
              <span>Cột mốc & Phần thưởng danh giá</span>
            </span>

            <div className="space-y-2">
              {STREAK_MILESTONES.map((m, idx) => {
                const isReached = effectiveStreak >= m.days;
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      isReached 
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{m.icon}</span>
                      <div>
                        <div className="font-bold text-[#243447] dark:text-white">
                          Cột mốc {m.days} ngày: {m.title}
                        </div>
                        <div className="text-[10px] text-[#748092]">
                          {isReached ? 'Đã hoàn thành xuất sắc 🎉' : `Còn ${Math.max(0, m.days - effectiveStreak)} ngày nữa`}
                        </div>
                      </div>
                    </div>

                    <span className="font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px]">
                      +{m.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action CTA & Close Button */}
          <div className="pt-2 flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-4 sm:px-5 py-3.5 rounded-2xl bg-[#F1E5D8]/80 hover:bg-[#E5D7C7] dark:bg-[#2B3A4F] dark:hover:bg-[#384A63] text-[#748092] hover:text-[#243447] dark:text-[#CBD5E1] dark:hover:text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              title="Đóng cửa sổ"
            >
              <X size={16} strokeWidth={2.5} />
              <span>Đóng</span>
            </button>

            <button
              type="button"
              onClick={handleActionStudy}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#E85D3F]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>{hasStudied ? 'Tiếp tục luyện tập (+15 XP)' : 'Học bài ngay để tiếp lửa (+1 ngày)'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
