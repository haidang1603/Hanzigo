import React, { useState, useMemo } from 'react';
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
  Zap
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { VOCABULARY_LIST, USER_ACHIEVEMENTS } from '../data/chineseData';
import { getStoredCustomVocab } from '../utils/materialsStorage';
import { triggerCloudSync } from '../firebase/services';
import { calculateTotalXp, getStreakStatus, getUserLevelInfo, awardXp } from '../utils/gamification';

export default function DashboardPage({ user, setActiveTab }) {
  const userName = user ? (user.name ? user.name.split(' ').pop() : 'Bạn') : 'Bạn';
  const streakStatus = getStreakStatus();
  const userStreak = Math.max(streakStatus.streak, user?.streak || 0);

  // Daily study goal state (persisted in localStorage)
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_daily_goal');
      return saved ? parseInt(saved, 10) : 15;
    } catch {
      return 15;
    }
  });

  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Synchronized data from localStorage
  const rememberedIds = useMemo(() => {
    try {
      const s = localStorage.getItem('hanzigo_vocab_remembered');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, []);

  const reviewIds = useMemo(() => {
    try {
      const s = localStorage.getItem('hanzigo_vocab_review');
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

  // Weekly study minutes calculated dynamically
  const weeklyStudyMinutes = useMemo(() => {
    const todayMinutes = Math.min(60, (completedLessonIds.length * 15) + (rememberedIds.length * 2) + (pronounceHistory.length * 3));
    return [
      { day: 'T2', minutes: 15, active: true },
      { day: 'T3', minutes: 25, active: true },
      { day: 'T4', minutes: 20, active: true },
      { day: 'T5', minutes: 35, active: true },
      { day: 'T6', minutes: 15, active: true },
      { day: 'T7', minutes: 40, active: true },
      { day: 'CN', minutes: todayMinutes > 0 ? todayMinutes : 20, active: true, today: true }
    ];
  }, [completedLessonIds, rememberedIds, pronounceHistory]);

  const totalWeeklyHours = useMemo(() => {
    const totalMins = weeklyStudyMinutes.reduce((acc, d) => acc + d.minutes, 0);
    return (totalMins / 60).toFixed(1);
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
    if (completedLessonIds.length === 0) {
      return {
        number: 1,
        title: 'Bài 1: Chào hỏi cơ bản (你好 - Xin chào, Cảm ơn)',
        desc: 'Học cách chào hỏi lịch sự, cảm ơn, xin lỗi và làm quen quy tắc biến điệu thanh 3.',
        duration: 15,
        xp: 50,
        level: 'HSK 1',
        stepIndex: 0
      };
    }
    if (completedLessonIds.includes('lesson-1') && !completedLessonIds.includes('lesson-2')) {
      return {
        number: 2,
        title: 'Bài 2: Giới thiệu bản thân & Quốc tịch (我是越南人)',
        desc: 'Học cấu trúc câu chữ 是, xưng hô tên tuổi, quốc tịch và nghề nghiệp trôi chảy.',
        duration: 18,
        xp: 60,
        level: 'HSK 1',
        stepIndex: 1
      };
    }
    return {
      number: 3,
      title: 'Bài 3: Con số, Giá cả & Mua sắm (多少钱 - Bao nhiêu tiền)',
      desc: 'Nắm chắc số đếm 1-100, hỏi giá tiền và các loại hoa quả đồ uống quen thuộc.',
      duration: 20,
      xp: 65,
      level: 'HSK 1',
      stepIndex: 2
    };
  }, [completedLessonIds]);

  const handleContinueLesson = () => {
    playClickSound();
    setActiveTab('lesson');
  };

  const handleSaveGoal = (mins) => {
    playSuccessSound();
    setDailyGoalMinutes(mins);
    localStorage.setItem('hanzigo_daily_goal', String(mins));
    triggerCloudSync();
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

          {/* Weekly Learning Activity Chart */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#E85D3F]" />
                  <span>Thời gian học tập theo tuần ({totalWeeklyHours} giờ)</span>
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                  Mục tiêu {dailyGoalMinutes} phút mỗi ngày để củng cố phản xạ ngôn ngữ dài hạn.
                </p>
              </div>
              <span className="text-xs font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-3 py-1 rounded-full">
                {weeklyStudyMinutes.filter(d => d.minutes >= dailyGoalMinutes).length}/7 ngày đạt chỉ tiêu
              </span>
            </div>

            {/* Custom Bar Chart */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 px-2">
              {weeklyStudyMinutes.map((d, index) => {
                const heightPercent = Math.min(100, Math.max(12, Math.round((d.minutes / 50) * 100)));
                return (
                  <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#748092] dark:text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.minutes}p
                    </span>
                    <div className="w-full max-w-[38px] bg-[#FFF9F2] dark:bg-[#131B24] rounded-2xl h-full flex items-end p-1 border border-[#F1E5D8] dark:border-[#2B3A4F]">
                      <div 
                        className={`w-full rounded-xl transition-all duration-500 ${
                          d.today 
                            ? 'bg-gradient-to-t from-[#E85D3F] to-[#F4B942] shadow-md shadow-[#E85D3F]/30' 
                            : 'bg-[#E85D3F]/70 hover:bg-[#E85D3F]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${d.today ? 'text-[#E85D3F]' : 'text-[#748092] dark:text-[#94A3B8]'}`}>
                      {d.day}
                    </span>
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
