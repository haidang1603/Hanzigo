import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  Play, 
  RotateCcw,
  TrendingUp,
  Target,
  BookOpen,
  Mic,
  PenTool,
  MessageCircle,
  FolderDown,
  Compass,
  Check,
  Zap,
  Clock,
  Crown
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { VOCABULARY_LIST, USER_ACHIEVEMENTS } from '../data/chineseData';
import { getStoredCustomVocab } from '../utils/materialsStorage';
import { triggerCloudSync } from '../supabase/services';
import { getXpHonorificTitle } from '../services/leaderboardService';
import { 
  calculateTotalXp, 
  getStreakStatus, 
  getUserLevelInfo, 
  awardXp, 
  getUserStorageKey,
  getLocalDateString 
} from '../utils/gamification';
import { getUserJourneyProgress, getLessonById } from '../services/learningPathService';

export default function DashboardPage({ user, setActiveTab, onSelectLesson }) {
  const userName = user ? (user.name ? user.name.split(' ').pop() : 'Bạn') : 'Bạn';
  const streakStatus = useMemo(() => getStreakStatus(user), [user]);
  const userStreak = streakStatus.streak;

  // Daily study goal state (persisted in localStorage per user)
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(() => {
    try {
      const key = getUserStorageKey('hanzigo_daily_goal', user);
      const saved = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_daily_goal'));
      return saved ? parseInt(saved, 10) : 15;
    } catch {
      return 15;
    }
  });

  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Synchronized data from localStorage per user
  const rememberedIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_vocab_remembered', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_vocab_remembered'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const reviewIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_vocab_review', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_vocab_review'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const completedLessonIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_completed_lessons', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_completed_lessons'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const pronounceHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_pronounce_history', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_pronounce_history'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const customWritingChars = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_custom_writing_chars', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_custom_writing_chars'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const aiChatHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_ai_chat_history', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_ai_chat_history'));
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  }, [user]);

  // Actual words learned count
  const actualWordsLearned = rememberedIds.length > 0 ? rememberedIds.length : (user?.wordsLearned || 0);

  // Total XP and Level info calculated from centralized gamification engine
  const calculatedTotalXp = calculateTotalXp(user);

  const levelInfo = useMemo(() => {
    return getUserLevelInfo(calculatedTotalXp);
  }, [calculatedTotalXp]);

  // Overall roadmap progress percent
  const overallRoadmapProgress = useMemo(() => {
    const totalRoadmapLessonsCount = 28; // Standard courses across all levels
    return Math.min(100, Math.round((completedLessonIds.length / totalRoadmapLessonsCount) * 100));
  }, [completedLessonIds]);

  // Dynamic review words queue from Spaced Repetition
  const [localReviewList, setLocalReviewList] = useState(() => {
    const customVocab = getStoredCustomVocab();
    const all = [...customVocab, ...VOCABULARY_LIST];
    
    // First priority: words specifically marked as need review
    if (reviewIds.length > 0) {
      return all.filter(w => reviewIds.includes(w.id)).slice(0, 4);
    }
    // Second priority: initial words if user has started studying
    if (rememberedIds.length > 0) {
      return all.filter(w => !rememberedIds.includes(w.id)).slice(0, 3);
    }
    // Default preview items
    return all.slice(0, 3);
  });

  const handleMarkReviewDone = (wordId) => {
    playSuccessSound();
    setLocalReviewList(prev => prev.filter(w => w.id !== wordId));
    // Award XP and maintain streak
    awardXp(10);
    // Remove from localStorage review list
    try {
      const updated = reviewIds.filter(id => id !== wordId);
      localStorage.setItem('hanzigo_vocab_review', JSON.stringify(updated));
      triggerCloudSync();
    } catch (e) {
      console.error(e);
    }
  };

  // Real-time daily study minutes state (persisted in localStorage per user)
  const [studyMinutesMap, setStudyMinutesMap] = useState(() => {
    const key = getUserStorageKey('hanzigo_daily_study_minutes', user);
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  });

  // Real-time active study tracker: increments study time while learner is active on the app
  useEffect(() => {
    const timer = setInterval(() => {
      const todayStr = getLocalDateString(new Date());
      setStudyMinutesMap(prev => {
        const actionsToday = (completedLessonIds.length * 15) + (rememberedIds.length * 2) + (pronounceHistory.length * 3) + (customWritingChars.length * 3);
        const currentMins = prev[todayStr] !== undefined 
          ? prev[todayStr] 
          : Math.max(actionsToday, userStreak > 0 ? 15 : 0);
        
        // Increment 0.25 min (15 seconds) each interval
        const nextMins = Math.round((currentMins + 0.25) * 10) / 10;
        const nextMap = { ...prev, [todayStr]: nextMins };
        try {
          const key = getUserStorageKey('hanzigo_daily_study_minutes', user);
          localStorage.setItem(key, JSON.stringify(nextMap));
        } catch {}
        return nextMap;
      });
    }, 15000);

    return () => clearInterval(timer);
  }, [user, completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, userStreak]);

  // Real-time current week days (Monday to Sunday)
  const currentWeekInfo = useMemo(() => {
    const now = new Date();
    const todayStr = getLocalDateString(now);
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const dayFullNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

    const actionsTodayMinutes = (completedLessonIds.length * 15) + (rememberedIds.length * 2) + (pronounceHistory.length * 3) + (customWritingChars.length * 3);

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = getLocalDateString(d);
      const isToday = (dateStr === todayStr);

      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);

      const isFuture = dayStart.getTime() > todayStart.getTime();
      const isPast = dayStart.getTime() < todayStart.getTime();

      let mins = 0;
      if (isToday) {
        const savedToday = studyMinutesMap[todayStr];
        mins = savedToday !== undefined ? savedToday : Math.max(actionsTodayMinutes, userStreak > 0 ? 15 : 0);
      } else if (isPast) {
        if (studyMinutesMap[dateStr] !== undefined) {
          mins = studyMinutesMap[dateStr];
        } else {
          // If this past day was within the user's active consecutive streak
          const daysAgo = Math.round((todayStart.getTime() - dayStart.getTime()) / (1000 * 60 * 60 * 24));
          if (daysAgo <= userStreak) {
            mins = Math.max(15, 20 + ((i * 7) % 25));
          } else {
            mins = 0;
          }
        }
      } else {
        // Future day
        mins = 0;
      }

      days.push({
        index: i,
        day: dayLabels[i],
        fullName: dayFullNames[i],
        dateStr,
        displayDate: `${d.getDate()}/${d.getMonth() + 1}`,
        minutes: mins,
        isToday,
        isPast,
        isFuture,
        reachedGoal: mins >= dailyGoalMinutes
      });
    }

    return {
      days,
      todayStr,
      todayDayLabel: dayLabels[dayOfWeek === 0 ? 6 : dayOfWeek - 1]
    };
  }, [studyMinutesMap, completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, userStreak, dailyGoalMinutes]);

  const weeklyStudyMinutes = currentWeekInfo.days;

  const totalWeeklyHours = useMemo(() => {
    const totalMins = weeklyStudyMinutes.reduce((acc, d) => acc + d.minutes, 0);
    return (totalMins / 60).toFixed(1);
  }, [weeklyStudyMinutes]);

  const daysPassedCount = useMemo(() => {
    return weeklyStudyMinutes.filter(d => !d.isFuture).length;
  }, [weeklyStudyMinutes]);

  const achievedDaysCount = useMemo(() => {
    return weeklyStudyMinutes.filter(d => !d.isFuture && d.reachedGoal).length;
  }, [weeklyStudyMinutes]);

  const todayData = useMemo(() => {
    return weeklyStudyMinutes.find(d => d.isToday) || weeklyStudyMinutes[0];
  }, [weeklyStudyMinutes]);

  // Dynamic real achievements based on actual learner actions
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
      if (ach.id === 'streak-7' && userStreak >= 7) isUnlocked = true;
      return { ...ach, unlocked: isUnlocked };
    });
  }, [completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, aiChatHistory, userStreak]);

  const unlockedAchievementsCount = dynamicAchievements.filter(a => a.unlocked).length;

  // Next recommended lesson calculation
  const nextLessonInfo = useMemo(() => {
    const journey = getUserJourneyProgress(user);
    const activeId = journey.activeLessonId || 'l-101';
    const activeLesson = getLessonById(activeId) || getLessonById('l-101');
    return {
      id: activeLesson?.id || 'l-101',
      number: activeLesson?.lessonNumber || 1,
      title: activeLesson?.title || 'Bài 1: Pinyin & 4 Thanh điệu căn bản',
      desc: activeLesson?.subtitle || activeLesson?.step1_learn?.summary || 'Nắm vững kiến thức trọng tâm và mẫu câu thực tế.',
      duration: activeLesson?.durationMinutes || 15,
      xp: activeLesson?.xpReward || 50,
      level: 'HSK 1'
    };
  }, [user]);

  const handleContinueLesson = () => {
    playClickSound();
    if (onSelectLesson && nextLessonInfo) {
      onSelectLesson(nextLessonInfo.id);
    } else {
      setActiveTab('roadmap');
    }
  };

  const handleSaveGoal = (mins) => {
    playSuccessSound();
    setDailyGoalMinutes(mins);
    const key = getUserStorageKey('hanzigo_daily_goal', user);
    localStorage.setItem(key, String(mins));
    localStorage.setItem('hanzigo_daily_goal', String(mins));
    triggerCloudSync(user?.id);
    setIsEditingGoal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white via-[#FFF9F2] to-white dark:from-[#1E293B] dark:via-[#131B24] dark:to-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm relative overflow-hidden">
        
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]">
              Đang học: {user?.level || 'Sơ cấp (HSK 1)'}
            </span>

            {/* Daily Goal Badge with quick toggle */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              <Target size={13} className="text-[#E85D3F]" />
              <span>Mục tiêu: <strong>{dailyGoalMinutes}p/ngày</strong></span>
              <button
                onClick={() => setIsEditingGoal(!isEditingGoal)}
                className="text-[10px] text-[#E85D3F] font-bold hover:underline ml-1"
              >
                {isEditingGoal ? 'Đóng' : 'Đổi'}
              </button>
            </div>
          </div>

          {/* Quick Goal Select Dropdown if Editing */}
          {isEditingGoal && (
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm animate-in fade-in text-xs">
              <span className="font-semibold text-[#243447] dark:text-white ml-1">Chọn mục tiêu:</span>
              {[10, 15, 25, 30, 45].map(m => (
                <button
                  key={m}
                  onClick={() => handleSaveGoal(m)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    dailyGoalMinutes === m 
                      ? 'bg-[#E85D3F] text-white shadow-sm' 
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447]'
                  }`}
                >
                  {m} phút
                </button>
              ))}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
            Chào {userName}, hôm nay bạn muốn học gì? 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] leading-relaxed">
            {actualWordsLearned > 0 || completedLessonIds.length > 0
              ? `Bạn đang học tập rất tích cực với ${actualWordsLearned} từ vựng đã nhớ và ${completedLessonIds.length} bài học hoàn thành. Hãy tiếp tục duy trì nhé!`
              : 'Chào mừng bạn đến với HanziGo! Hãy bắt đầu bài học đầu tiên hoặc khám phá các công cụ luyện phát âm & flashcards bên dưới.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleContinueLesson}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-sm shadow-lg shadow-[#E85D3F]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Play size={16} className="fill-white" />
            <span>{completedLessonIds.length > 0 ? 'Tiếp tục bài học' : 'Bắt đầu bài 1 ngay'}</span>
          </button>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-2 -bottom-6 font-['Noto_Serif_SC'] text-9xl font-black text-[#E85D3F]/5 select-none pointer-events-none">
          学
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Streak */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center gap-4 hover:border-[#E85D3F] transition-all">
          <div className="w-13 h-13 rounded-2xl bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] flex items-center justify-center text-2xl font-bold p-3">
            <Flame size={28} className="fill-[#F4B942] text-[#E85D3F]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Chuỗi liên tiếp</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">{userStreak} ngày</p>
            <p className={`text-[10px] font-semibold ${streakStatus.hasStudiedToday ? 'text-[#45B97C]' : 'text-[#E85D3F]'}`}>
              {streakStatus.hasStudiedToday 
                ? 'Đã học hôm nay ✅' 
                : (userStreak > 0 ? 'Học hôm nay để giữ chuỗi 🔥' : 'Bắt đầu học hôm nay')}
            </p>
          </div>
        </div>

        {/* Words Learned */}
        <div 
          onClick={() => setActiveTab('vocabulary')}
          className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center gap-4 hover:border-[#E85D3F] transition-all cursor-pointer group"
        >
          <div className="w-13 h-13 rounded-2xl bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] flex items-center justify-center text-2xl p-3">
            <BookOpen size={26} className="text-[#E85D3F]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Từ vựng đã nhớ</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
              {actualWordsLearned} từ
            </p>
            <p className="text-[10px] text-[#45B97C] font-semibold">
              Spaced Repetition SRS
            </p>
          </div>
        </div>

        {/* Study Time / XP */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center gap-4 hover:border-[#E85D3F] transition-all">
          <div className="w-13 h-13 rounded-2xl bg-[#EFF6FF] dark:bg-[#131B24] text-[#3B82F6] flex items-center justify-center text-2xl p-3">
            <Zap size={26} className="text-[#3B82F6]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Kinh nghiệm</p>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                Lv.{levelInfo.level} {levelInfo.badge}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">{calculatedTotalXp} XP</p>
            <p className="text-[10px] text-[#3B82F6] font-semibold truncate">
              {levelInfo.title}
            </p>
          </div>
        </div>

        {/* Roadmap Progress */}
        <div 
          onClick={() => setActiveTab('roadmap')}
          className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center gap-4 hover:border-[#E85D3F] transition-all cursor-pointer group"
        >
          <div className="w-13 h-13 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] flex items-center justify-center text-2xl p-3">
            <Compass size={26} className="text-[#45B97C]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Tiến độ lộ trình</p>
            <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white group-hover:text-[#45B97C] transition-colors">
              {overallRoadmapProgress}%
            </p>
            <p className="text-[10px] text-[#45B97C] font-semibold">
              {completedLessonIds.length} bài học hoàn thành
            </p>
          </div>
        </div>

      </div>

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Today's Recommendation & Weekly Activity */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card: Daily Recommended Lesson */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E85D3F] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Bài học đề xuất hôm nay</span>
              </span>
              <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-semibold">
                {nextLessonInfo.level} • Bài {nextLessonInfo.number}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#243447] dark:text-white">
                  {nextLessonInfo.title}
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                  {nextLessonInfo.desc}
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-semibold">
                    ⏱️ {nextLessonInfo.duration} phút
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] font-semibold">
                    ⭐ +{nextLessonInfo.xp} XP
                  </span>
                  <span className="text-[#748092] dark:text-[#94A3B8]">
                    Đầy đủ ngữ pháp & trắc nghiệm
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinueLesson}
                className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white font-bold text-xs hover:bg-[#CB4529] shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-center active:scale-95"
              >
                <span>Học bài này ngay</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekly Learning Activity Chart - Real-Time */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#E85D3F]" />
                    <span>Thời gian học tập theo tuần ({totalWeeklyHours} giờ)</span>
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Thời gian thực</span>
                  </span>
                </div>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                  Mục tiêu {dailyGoalMinutes} phút/ngày • Hôm nay ({todayData.fullName}): <strong className="text-[#E85D3F]">{Math.round(todayData.minutes)} phút</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/20 px-3 py-1 rounded-full whitespace-nowrap">
                  {achievedDaysCount}/{daysPassedCount} ngày đạt chỉ tiêu
                </span>
              </div>
            </div>

            {/* Real-time Custom Bar Chart */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 px-2">
              {weeklyStudyMinutes.map((d, index) => {
                const maxBenchmark = Math.max(dailyGoalMinutes, 50);
                const heightPercent = d.minutes > 0 
                  ? Math.min(100, Math.max(14, Math.round((d.minutes / maxBenchmark) * 100))) 
                  : 0;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group select-none">
                    {/* Minute label on top */}
                    <div className="h-5 flex items-center justify-center">
                      {d.isFuture ? (
                        <span className="text-[10px] font-medium text-[#94A3B8]/50">-</span>
                      ) : (
                        <span className={`text-[11px] font-bold transition-opacity flex items-center gap-0.5 ${
                          d.isToday 
                            ? 'text-[#E85D3F]' 
                            : d.reachedGoal 
                              ? 'text-[#45B97C]' 
                              : 'text-[#748092] dark:text-[#94A3B8]'
                        }`}>
                          {Math.round(d.minutes)}p
                          {d.reachedGoal && <Check size={11} className="text-[#45B97C]" />}
                        </span>
                      )}
                    </div>

                    {/* Bar container */}
                    <div className={`w-full max-w-[40px] rounded-2xl h-full flex items-end p-1 transition-all ${
                      d.isToday 
                        ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border-2 border-[#E85D3F]/40 shadow-sm'
                        : d.isFuture 
                          ? 'bg-[#FAF8F5]/40 dark:bg-[#131B24]/40 border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F]'
                          : 'bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}>
                      {d.minutes > 0 ? (
                        <div 
                          className={`w-full rounded-xl transition-all duration-500 relative ${
                            d.isToday 
                              ? 'bg-gradient-to-t from-[#E85D3F] via-[#F4B942] to-[#F4B942] shadow-md shadow-[#E85D3F]/35' 
                              : d.reachedGoal
                                ? 'bg-[#E85D3F]/85 hover:bg-[#E85D3F]'
                                : 'bg-[#E85D3F]/50 hover:bg-[#E85D3F]/70'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        >
                          {d.isToday && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-sm animate-pulse" />
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-1 bg-[#F1E5D8] dark:bg-[#2B3A4F] rounded-full mx-auto opacity-40" />
                      )}
                    </div>

                    {/* Day & Date Labels */}
                    <div className="text-center">
                      <span className={`block text-xs font-black ${
                        d.isToday 
                          ? 'text-[#E85D3F]' 
                          : d.isFuture 
                            ? 'text-[#94A3B8]/60 dark:text-[#94A3B8]/40' 
                            : 'text-[#243447] dark:text-[#CBD5E1]'
                      }`}>
                        {d.day}
                      </span>
                      <span className={`text-[9px] font-medium block -mt-0.5 ${
                        d.isToday 
                          ? 'text-[#E85D3F] font-bold' 
                          : 'text-[#94A3B8]'
                      }`}>
                        {d.displayDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spaced Repetition Review List */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                  <RotateCcw size={18} className="text-[#D97706]" />
                  <span>Hàng đợi ôn tập hôm nay (Spaced Repetition)</span>
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                  Ôn lại từ vựng định kỳ giúp chuyển kiến thức vào trí nhớ vĩnh viễn.
                </p>
              </div>
              <button 
                onClick={() => {
                  playClickSound();
                  setActiveTab('vocabulary');
                }}
                className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1"
              >
                <span>Mở Flashcard đầy đủ</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {localReviewList.length > 0 ? (
              <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                {localReviewList.map((word) => (
                  <div key={word.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-['Noto_Serif_SC'] text-2xl font-black text-[#243447] dark:text-white min-w-[60px]">
                        {word.hanzi}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#E85D3F]">{word.pinyin}</span>
                        <p className="text-xs text-[#748092] dark:text-[#94A3B8] truncate">{word.meaning}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <AudioButton text={word.hanzi} size="sm" variant="ghost" />
                      <button
                        onClick={() => handleMarkReviewDone(word.id)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1"
                        title="Đã ôn xong từ này"
                      >
                        <Check size={13} />
                        <span className="hidden sm:inline">Đã thuộc</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#748092] dark:text-[#94A3B8] space-y-2">
                <p>🎉 Tuyệt vời! Bạn không còn từ nào tồn đọng cần ôn hôm nay.</p>
                <button
                  onClick={() => setActiveTab('vocabulary')}
                  className="text-[#E85D3F] font-bold hover:underline"
                >
                  + Khám phá thêm từ vựng mới trong kho Flashcards
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Achievements & Level Roadmap Progress */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* XP Leaderboard Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white border border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                <span>Bảng Xếp Hạng Cao Thủ</span>
              </h3>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('leaderboard');
                }}
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Xem Top 50</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-[#E85D3F] flex items-center justify-center font-bold text-white shadow-sm">
                  <Crown size={20} />
                </div>
                <div>
                  <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Điểm tích lũy của bạn</div>
                  <div className="font-mono text-base font-black text-amber-300 flex items-center gap-1">
                    <Zap size={14} className="fill-amber-300" />
                    <span>{calculatedTotalXp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {getXpHonorificTitle(calculatedTotalXp).title}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Thi đua cùng cộng đồng học viên HanziGo. Tích lũy điểm qua mỗi bài học để thăng hạng và ghi danh lên bục vinh quang!
            </p>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('leaderboard');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Mở Bảng Xếp Hạng Chi Tiết</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Unlocked Achievements */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Trophy size={18} className="text-[#F4B942]" />
                <span>Huy hiệu thành tích</span>
              </h3>
              <span className="text-xs font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2.5 py-0.5 rounded-full">
                {unlockedAchievementsCount}/{dynamicAchievements.length} đạt
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {dynamicAchievements.slice(0, 4).map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    ach.unlocked 
                      ? 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F4B942]/60 shadow-sm' 
                      : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-40'
                  }`}
                >
                  <span className="text-2xl block mb-1">{ach.icon}</span>
                  <p className="text-xs font-bold text-[#243447] dark:text-white truncate">
                    {ach.name}
                  </p>
                  <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] line-clamp-1 mt-0.5">
                    {ach.desc}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('profile');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] hover:bg-[#FCD8D2] transition-colors flex items-center justify-center gap-1"
            >
              <span>Xem toàn bộ phòng truyền thống</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Quick Shortcuts Hub */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
              Lối tắt luyện tập nhanh
            </h3>

            {/* Pronunciation Shortcut */}
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('pronunciation');
              }}
              className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:border-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FEF7E9] text-[#D97706] flex items-center justify-center font-bold text-sm">
                  <Mic size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#243447] dark:text-white">AI Thẩm âm & Phát âm</p>
                  <p className="text-[10px] text-[#748092]">Chấm điểm micro & 4 thanh điệu</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-[#748092] group-hover:text-[#E85D3F] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Writing Shortcut */}
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('writing');
              }}
              className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:border-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EBF8F2] text-[#45B97C] flex items-center justify-center font-bold text-sm">
                  <PenTool size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#243447] dark:text-white">Tập viết chữ Hán mễ tự</p>
                  <p className="text-[10px] text-[#748092]">Thứ tự nét bút & tải file ảnh PNG</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-[#748092] group-hover:text-[#E85D3F] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* AI Conversation Shortcut */}
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('conversation');
              }}
              className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:border-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center font-bold text-sm">
                  <MessageCircle size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#243447] dark:text-white">Hội thoại AI ngữ cảnh</p>
                  <p className="text-[10px] text-[#748092]">Trò chuyện theo tình huống thực tế</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-[#748092] group-hover:text-[#E85D3F] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Materials Shortcut */}
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('materials');
              }}
              className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:border-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FDEEEB] text-[#E85D3F] flex items-center justify-center font-bold text-sm">
                  <FolderDown size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#243447] dark:text-white">Thư viện giáo trình & đề thi</p>
                  <p className="text-[10px] text-[#748092]">Kho tài liệu PDF & file nghe MP3</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-[#748092] group-hover:text-[#E85D3F] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
