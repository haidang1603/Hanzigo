import React, { useState, useMemo } from 'react';
import { 
  User, 
  Flame, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Calendar,
  Award,
  CheckCircle2
} from 'lucide-react';
import { USER_ACHIEVEMENTS } from '../data/chineseData';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { calculateTotalXp, getStreakStatus, getUserLevelInfo } from '../utils/gamification';

export default function ProfilePage({ 
  user, 
  onLogout, 
  darkMode, 
  setDarkMode, 
  soundEnabled, 
  setSoundEnabled 
}) {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState('15');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const streakStatus = useMemo(() => getStreakStatus(), []);
  const streakCount = Math.max(streakStatus.streak, user?.streak || 0);

  // Dynamic learning stats from storage
  const rememberedIds = useMemo(() => {
    try {
      const s = localStorage.getItem('hanzigo_vocab_remembered');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, []);

  const completedLessonIds = useMemo(() => {
    try {
      const s = localStorage.getItem('hanzigo_completed_lessons');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, []);

  const pronounceHistory = useMemo(() => {
    try {
      const s = localStorage.getItem('hanzigo_pronounce_history');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, []);

  const customWritingChars = useMemo(() => {
    try {
      const s = localStorage.getItem('hanzigo_custom_writing_chars');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, []);

  const aiChatHistory = useMemo(() => {
    try {
      const s = localStorage.getItem('hanzigo_ai_chat_history');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  }, []);

  const wordsLearnedCount = rememberedIds.length > 0 ? rememberedIds.length : (user?.wordsLearned || 0);

  const totalStudyHours = useMemo(() => {
    const mins = (completedLessonIds.length * 15) + (rememberedIds.length * 2) + (pronounceHistory.length * 3) + (customWritingChars.length * 3);
    return mins > 0 ? (mins / 60).toFixed(1) : (user ? '0.5' : '0');
  }, [completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, user]);

  const totalXp = calculateTotalXp(user);
  const levelInfo = useMemo(() => getUserLevelInfo(totalXp), [totalXp]);

  // Real Dynamic Achievements
  const dynamicAchievements = useMemo(() => {
    const hasFinishedLesson = completedLessonIds.length > 0;
    const hasLearnedVocab = rememberedIds.length >= 5;
    const hasPracticedPronounce = pronounceHistory.length > 0;
    const hasWrittenChar = customWritingChars.length > 0;
    const hasChattedAI = Object.keys(aiChatHistory).length > 0;

    return USER_ACHIEVEMENTS.map(ach => {
      let isUnlocked = ach.unlocked;
      if (ach.id === 'first-step' && hasFinishedLesson) isUnlocked = true;
      if (ach.id === 'vocab-100' && hasLearnedVocab) isUnlocked = true;
      if (ach.id === 'pinyin-master' && hasPracticedPronounce) isUnlocked = true;
      if (ach.id === 'calligraphy' && hasWrittenChar) isUnlocked = true;
      if (ach.id === 'conversation-star' && hasChattedAI) isUnlocked = true;
      if (ach.id === 'streak-7' && streakCount >= 7) isUnlocked = true;
      return { ...ach, unlocked: isUnlocked };
    });
  }, [completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, aiChatHistory, streakCount]);

  // Heatmap: 12 weeks of 7 days (84 days) with streak tail highlighted
  const heatmapData = useMemo(() => {
    return Array.from({ length: 84 }, (_, index) => {
      const daysFromEnd = 83 - index;
      if (daysFromEnd === 0 && streakStatus.hasStudiedToday) {
        return { level: 4 };
      }
      if (daysFromEnd < streakCount) {
        return { level: Math.min(4, Math.max(1, (daysFromEnd % 3) + 2)) };
      }
      return { level: 0 };
    });
  }, [streakCount, streakStatus.hasStudiedToday]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    playSuccessSound();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#E85D3F] shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border-4 border-[#E85D3F] flex items-center justify-center text-[#E85D3F] font-bold text-2xl shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={36} />}
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
              {user?.name || 'Học viên HanziGo'}
            </h1>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              {user?.email || 'Tài khoản chưa đăng nhập'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] text-xs font-bold flex items-center gap-1">
                <span>{levelInfo.badge}</span>
                <span>{levelInfo.title}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] text-xs font-bold flex items-center gap-1">
                <Flame size={12} className="fill-[#F4B942]" />
                <span>Streak {streakCount} ngày</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onLogout();
          }}
          className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors flex items-center gap-1.5 self-center md:self-start"
        >
          <LogOut size={14} />
          <span>Đăng xuất</span>
        </button>

      </div>

      {/* Level Progress Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#FFF9F2] to-amber-500/10 dark:from-[#1E293B] dark:via-[#131B24] dark:to-[#1E293B] border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{levelInfo.badge}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-500 text-white">
                  Cấp {levelInfo.level}
                </span>
                <h3 className="text-sm sm:text-base font-black text-[#243447] dark:text-white">
                  {levelInfo.title}
                </h3>
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                  • {levelInfo.hskEquivalent}
                </span>
              </div>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] mt-0.5">
                {levelInfo.xpToNextLevel > 0 
                  ? `Cần thêm ${levelInfo.xpToNextLevel} XP để thăng cấp tiếp theo` 
                  : 'Đã đạt đẳng cấp cao nhất!'}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              {totalXp} XP / {levelInfo.maxXp} XP
            </span>
            <p className="text-[10px] text-[#748092] font-semibold">{levelInfo.currentProgressPercent}% hoàn thành cấp</p>
          </div>
        </div>

        <div className="w-full h-3 bg-amber-100 dark:bg-amber-950/40 rounded-full overflow-hidden border border-amber-200 dark:border-amber-900/40">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-[#E85D3F] rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.currentProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Chuỗi học</p>
          <p className="text-2xl font-black text-[#E85D3F] mt-1">{streakCount} ngày 🔥</p>
          <p className="text-[10px] text-[#45B97C] font-semibold mt-0.5">
            {streakStatus.hasStudiedToday ? 'Đã học hôm nay ✅' : 'Chưa học hôm nay'}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Từ vựng vững</p>
          <p className="text-2xl font-black text-[#45B97C] mt-1">{wordsLearnedCount} từ 📚</p>
          <p className="text-[10px] text-[#748092] font-semibold mt-0.5">Đã ghi nhớ</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Tổng giờ học</p>
          <p className="text-2xl font-black text-[#3B82F6] mt-1">{totalStudyHours} giờ ⏱️</p>
          <p className="text-[10px] text-[#748092] font-semibold mt-0.5">Thời gian tích lũy</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Tổng EXP</p>
          <p className="text-2xl font-black text-[#F4B942] mt-1">{totalXp} XP ⚡</p>
          <p className="text-[10px] text-[#D97706] font-semibold mt-0.5">Điểm kinh nghiệm</p>
        </div>
      </div>

      {/* Learning Activity Heatmap */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Calendar size={16} className="text-[#E85D3F]" />
            <span>Lịch sử học tập 12 tuần gần nhất</span>
          </h3>
          <span className="text-xs text-[#748092]">Đều đặn mỗi ngày</span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px]">
            {heatmapData.map((d, i) => {
              const bgColors = [
                'bg-gray-100 dark:bg-gray-800',
                'bg-[#FDEEEB] dark:bg-[#2D1E1B]',
                'bg-[#F7A693]',
                'bg-[#E85D3F]',
                'bg-[#CB4529]'
              ];
              return (
                <div 
                  key={i}
                  className={`w-3.5 h-3.5 rounded-sm ${bgColors[d.level]} transition-colors`}
                  title={`Ngày học cấp độ ${d.level}`}
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 text-[10px] text-[#748092]">
          <span>Ít</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#FDEEEB]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#F7A693]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#E85D3F]" />
          </div>
          <span>Nhiều</span>
        </div>
      </div>

      {/* Badges Collection Showcase */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Award size={16} className="text-[#F4B942]" />
            <span>Kho Huy Hiệu Thành Tích ({dynamicAchievements.filter(a => a.unlocked).length}/{dynamicAchievements.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {dynamicAchievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                ach.unlocked 
                  ? 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F4B942]/40 shadow-sm' 
                  : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-40 grayscale'
              }`}
            >
              <span className="text-3xl block mb-2">{ach.icon}</span>
              <p className="text-xs font-bold text-[#243447] dark:text-white">{ach.name}</p>
              <p className="text-[10px] text-[#748092] mt-1">{ach.desc}</p>
              {ach.unlocked && (
                <span className="inline-block mt-2 text-[9px] font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2 py-0.5 rounded-full">
                  Đã mở khóa
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
          <Settings size={16} className="text-[#748092]" />
          <span>Cài đặt học tập & Thông báo</span>
        </h3>

        {showSavedToast && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Đã lưu thành công các cài đặt cá nhân!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
          
          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
              Giờ nhắc nhở học mỗi tối
            </label>
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#E85D3F]" />
              <input 
                type="time" 
                value={reminderTime} 
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
              />
              <span className="text-xs text-[#748092]">Hệ thống gửi thông báo nhắc vào giờ này</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
              Mục tiêu học mỗi ngày
            </label>
            <div className="flex items-center gap-2">
              {['10', '15', '30', '45'].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDailyGoalMinutes(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dailyGoalMinutes === mins 
                      ? 'bg-[#E85D3F] text-white' 
                      : 'border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092]'
                  }`}
                >
                  {mins} phút
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#243447] dark:text-white">Hiệu ứng âm thanh khi làm bài</p>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Âm thanh vui tươi khi trả lời đúng câu hỏi</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playClickSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-[#45B97C]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
                <span>Giao diện tối (Dark Mode)</span>
              </p>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Giảm mỏi mắt khi học vào ban đêm</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDarkMode(!darkMode);
                playClickSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                darkMode ? 'bg-[#E85D3F]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs shadow-md transition-all"
            >
              Lưu cài đặt
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
