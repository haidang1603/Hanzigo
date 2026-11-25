import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  Flame,
  ArrowRight,
  Sparkles,
  Play,
  Target,
  BookOpen,
  PenTool,
  MessageCircle,
  Compass,
  GraduationCap,
  Clock,
  Award,
  Brain,
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { VOCABULARY_LIST } from '../data/chineseData';
import { getStoredCustomVocab } from '../utils/materialsStorage';
import { triggerCloudSync } from '../supabase/services';
import {
  getClassroomsForStudent,
  getAssignmentsForClassroom,
  getStudentSubmission,
} from '../services/classroomService';
import {
  calculateTotalXp,
  getStreakStatus,
  checkInDaily,
  awardXp,
  getUserStorageKey,
  getLocalDateString,
} from '../utils/gamification';
import {
  getLessonById,
  getRecommendedNextLesson,
} from '../services/learningPathService';
import { getRecentReadingProgress } from '../services/readingProgressService';
import { getUserExamHistory } from '../services/hskService';
import { STORAGE_SRS_STATE, calculateSrsStats } from '../utils/srsEngine';
import { DailySmartStudyFlow } from '../features/unified-ecosystem/DailySmartStudyFlow.tsx';
import { evaluateUserAchievements } from '../services/gamificationService';
import StreakModal from '../components/learning/StreakModal';
import DashboardDeepAnalyticsTabs from '../components/dashboard/DashboardDeepAnalyticsTabs';

const AiLearningCoachWidget = lazy(() =>
  import('../components/learning/AiLearningCoachWidget')
);

const TOTAL_HSK_LESSONS = 180;

function parseTargetHskNumber(levelStr) {
  const match = String(levelStr || '').match(/(\d+)/);
  if (!match) return 1;
  const num = Number(match[1]);
  return Number.isFinite(num) ? Math.min(9, Math.max(1, num)) : 1;
}

export default function DashboardPage({ user, setActiveTab, onSelectLesson }) {
  const userName = user ? (user.name ? user.name.split(' ').pop() : 'Bạn') : 'Bạn';
  const [gamificationTick, setGamificationTick] = useState(0);
  const [workspaceTab, setWorkspaceTab] = useState('daily_loop'); // 'daily_loop' | 'ai_coach'

  const greetingTime = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }, []);

  useEffect(() => {
    const handleGamificationUpdated = () => setGamificationTick((t) => t + 1);
    window.addEventListener('hanzigo_gamification_updated', handleGamificationUpdated);
    window.addEventListener('storage', handleGamificationUpdated);
    return () => {
      window.removeEventListener('hanzigo_gamification_updated', handleGamificationUpdated);
      window.removeEventListener('storage', handleGamificationUpdated);
    };
  }, []);

  const streakStatus = useMemo(() => getStreakStatus(user), [user, gamificationTick]);
  const userStreak = streakStatus.streak || 0;
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInToast, setCheckInToast] = useState(null);

  const handleCheckIn = (e) => {
    if (e) e.stopPropagation();
    playClickSound();
    setCheckInLoading(true);
    const res = checkInDaily(user);
    if (res.success) {
      playSuccessSound();
      setCheckInToast({ success: true, message: res.message });
      setTimeout(() => setCheckInToast(null), 4000);
    } else {
      setCheckInToast({ success: false, message: res.message });
      setTimeout(() => setCheckInToast(null), 3500);
    }
    setCheckInLoading(false);
  };

  // Daily study goal state (persisted in localStorage per user)
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(() => {
    try {
      const key = getUserStorageKey('hanzigo_daily_goal', user);
      const saved =
        localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_daily_goal'));
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
      const s =
        localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_vocab_remembered'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const reviewIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_vocab_review', user);
      const s =
        localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_vocab_review'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const completedLessonIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_completed_lessons', user);
      const s =
        localStorage.getItem(key) ||
        (user ? null : localStorage.getItem('hanzigo_completed_lessons'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const pronounceHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_pronounce_history', user);
      const s =
        localStorage.getItem(key) ||
        (user ? null : localStorage.getItem('hanzigo_pronounce_history'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const customWritingChars = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_custom_writing_chars', user);
      const s =
        localStorage.getItem(key) ||
        (user ? null : localStorage.getItem('hanzigo_custom_writing_chars'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  // SRS stats (user-scoped STORAGE_SRS_STATE) for Hero Next Best Action & KPI
  const srsDueCount = useMemo(() => {
    try {
      const key = getUserStorageKey(STORAGE_SRS_STATE, user);
      const raw =
        localStorage.getItem(key) || (user ? null : localStorage.getItem(STORAGE_SRS_STATE));
      if (raw) {
        const map = JSON.parse(raw);
        if (map && typeof map === 'object') {
          const stats = calculateSrsStats(Object.values(map));
          if (stats.dueCount > 0) return stats.dueCount;
        }
      }
    } catch {}
    return reviewIds.length;
  }, [user, reviewIds.length, gamificationTick]);

  // Actual words learned count
  const actualWordsLearned =
    rememberedIds.length > 0 ? rememberedIds.length : user?.wordsLearned || 0;

  // Total XP calculated from centralized gamification engine
  const calculatedTotalXp = useMemo(() => calculateTotalXp(user), [user, gamificationTick]);

  // Overall roadmap progress percent across 180 HSK 1-9 lessons
  const overallRoadmapProgress = useMemo(() => {
    return Math.min(100, Math.round((completedLessonIds.length / TOTAL_HSK_LESSONS) * 100));
  }, [completedLessonIds.length]);

  // Dynamic review words queue from Spaced Repetition
  const [localReviewList, setLocalReviewList] = useState(() => {
    const customVocab = getStoredCustomVocab();
    const all = [...customVocab, ...VOCABULARY_LIST];
    if (reviewIds.length > 0) {
      return all.filter((w) => reviewIds.includes(w.id)).slice(0, 4);
    }
    if (rememberedIds.length > 0) {
      return all.filter((w) => !rememberedIds.includes(w.id)).slice(0, 3);
    }
    return all.slice(0, 3);
  });

  const handleMarkReviewDone = (wordId) => {
    playSuccessSound();
    setLocalReviewList((prev) => prev.filter((w) => w.id !== wordId));
    awardXp(10, user);
    try {
      const updated = reviewIds.filter((id) => id !== wordId);
      const key = getUserStorageKey('hanzigo_vocab_review', user);
      localStorage.setItem(key, JSON.stringify(updated));
      triggerCloudSync(user?.uid || user?.id);
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

  // Classroom, Recent Reading & CBT Exam History (single-pass fetch, zero duplicate queries)
  const [studentClassrooms, setStudentClassrooms] = useState([]);
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [loadingClassroomData, setLoadingClassroomData] = useState(false);
  const [recentReading, setRecentReading] = useState(null);
  const [cbtSummary, setCbtSummary] = useState({
    latestScore: null,
    latestMaxScore: null,
    bestScore: null,
    bestMaxScore: null,
    bestLevel: null,
    attemptsCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    getRecentReadingProgress(1, user)
      .then((list) => {
        if (isMounted && list && list.length > 0) {
          setRecentReading(list[0]);
        }
      })
      .catch(() => {});

    getUserExamHistory({ user })
      .then((attempts) => {
        if (!isMounted || !Array.isArray(attempts) || attempts.length === 0) return;
        const latest = attempts[0];
        let best = attempts[0];
        for (const a of attempts) {
          const aPct = a.maxScore > 0 ? a.score / a.maxScore : 0;
          const bPct = best.maxScore > 0 ? best.score / best.maxScore : 0;
          if (aPct > bPct || (aPct === bPct && (a.score || 0) > (best.score || 0))) {
            best = a;
          }
        }
        setCbtSummary({
          latestScore: Number.isFinite(Number(latest.score)) ? Number(latest.score) : null,
          latestMaxScore: Number.isFinite(Number(latest.maxScore)) ? Number(latest.maxScore) : 200,
          bestScore: Number.isFinite(Number(best.score)) ? Number(best.score) : null,
          bestMaxScore: Number.isFinite(Number(best.maxScore)) ? Number(best.maxScore) : 200,
          bestLevel: best.examLevel || latest.examLevel || 'HSK',
          attemptsCount: attempts.length,
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    async function loadClassroomAssignments() {
      const studentId = user?.uid || user?.id;
      if (!studentId || studentId === 'user_guest') {
        if (isMounted) {
          setStudentClassrooms([]);
          setStudentAssignments([]);
          setLoadingClassroomData(false);
        }
        return;
      }

      setLoadingClassroomData(true);
      try {
        const classrooms = await getClassroomsForStudent(studentId);
        if (!isMounted) return;
        setStudentClassrooms(classrooms || []);

        if (classrooms && classrooms.length > 0) {
          const allAssignments = [];
          for (const cls of classrooms) {
            const assigns = await getAssignmentsForClassroom(cls.id);
            for (const a of assigns) {
              const submission = await getStudentSubmission(a.id, studentId);
              allAssignments.push({
                ...a,
                classroom_name: cls.name,
                classroom_id: cls.id,
                submission,
              });
            }
          }
          if (isMounted) setStudentAssignments(allAssignments);
        } else if (isMounted) {
          setStudentAssignments([]);
        }
      } catch (err) {
        console.warn('Dashboard loadClassroomAssignments error:', err);
      } finally {
        if (isMounted) setLoadingClassroomData(false);
      }
    }

    loadClassroomAssignments();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Real-time active study tracker
  useEffect(() => {
    const timer = setInterval(() => {
      const todayStr = getLocalDateString(new Date());
      setStudyMinutesMap((prev) => {
        const actionsToday =
          completedLessonIds.length * 15 +
          rememberedIds.length * 2 +
          pronounceHistory.length * 3 +
          customWritingChars.length * 3;
        const currentMins = prev[todayStr] !== undefined ? prev[todayStr] : actionsToday;
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

  // Current week study minutes
  const currentWeekInfo = useMemo(() => {
    const now = new Date();
    const todayStr = getLocalDateString(now);
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const dayFullNames = [
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
      'Chủ Nhật',
    ];

    const actionsTodayMinutes =
      completedLessonIds.length * 15 +
      rememberedIds.length * 2 +
      pronounceHistory.length * 3 +
      customWritingChars.length * 3;

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = getLocalDateString(d);
      const isToday = dateStr === todayStr;

      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);

      const isFuture = dayStart.getTime() > todayStart.getTime();
      const isPast = dayStart.getTime() < todayStart.getTime();

      let mins = 0;
      if (isToday) {
        const savedToday = studyMinutesMap[todayStr];
        mins = savedToday !== undefined ? savedToday : actionsTodayMinutes;
      } else if (isPast && studyMinutesMap[dateStr] !== undefined) {
        mins = studyMinutesMap[dateStr];
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
        reachedGoal: mins >= dailyGoalMinutes,
      });
    }

    return { days, todayStr };
  }, [
    studyMinutesMap,
    completedLessonIds,
    rememberedIds,
    pronounceHistory,
    customWritingChars,
    dailyGoalMinutes,
  ]);

  const weeklyStudyMinutes = currentWeekInfo.days;

  const totalWeeklyHours = useMemo(() => {
    const totalMins = weeklyStudyMinutes.reduce((acc, d) => acc + d.minutes, 0);
    return (totalMins / 60).toFixed(1);
  }, [weeklyStudyMinutes]);

  const daysPassedCount = useMemo(
    () => weeklyStudyMinutes.filter((d) => !d.isFuture).length,
    [weeklyStudyMinutes]
  );

  const achievedDaysCount = useMemo(
    () => weeklyStudyMinutes.filter((d) => !d.isFuture && d.reachedGoal).length,
    [weeklyStudyMinutes]
  );

  const todayData = useMemo(
    () => weeklyStudyMinutes.find((d) => d.isToday) || weeklyStudyMinutes[0],
    [weeklyStudyMinutes]
  );

  const dynamicAchievements = useMemo(
    () => evaluateUserAchievements(user),
    [
      user,
      completedLessonIds.length,
      rememberedIds.length,
      pronounceHistory.length,
      customWritingChars.length,
      userStreak,
    ]
  );
  const unlockedAchievementsCount = dynamicAchievements.filter((a) => a.unlocked).length;

  // Next recommended lesson calculation powered by personalization engine
  const nextLessonInfo = useMemo(() => {
    const rec = getRecommendedNextLesson(user);
    const activeLesson = rec?.lesson || getLessonById('l-101');
    return {
      id: rec?.lessonId || activeLesson?.id || 'l-101',
      number: rec?.lessonNumber || activeLesson?.lessonNumber || 1,
      title: rec?.title || activeLesson?.title || 'Bài 1: Pinyin & 4 Thanh điệu căn bản',
      desc:
        rec?.reason ||
        activeLesson?.subtitle ||
        activeLesson?.step1_learn?.summary ||
        'Nắm vững kiến thức trọng tâm và mẫu câu thực tế.',
      duration: activeLesson?.durationMinutes || 15,
      xp: activeLesson?.xpReward || 50,
      level: rec?.levelName || 'HSK 1',
    };
  }, [user, completedLessonIds.length]);

  const targetHskLevel = useMemo(
    () => parseTargetHskNumber(nextLessonInfo.level || user?.level),
    [nextLessonInfo.level, user?.level]
  );

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
    if (!user) {
      localStorage.setItem('hanzigo_daily_goal', String(mins));
    }
    triggerCloudSync(user?.uid || user?.id);
    setIsEditingGoal(false);
  };

  // 6 Core Skill Shortcuts (all mapped to VALID_TABS in App.jsx)
  const coreShortcuts = [
    {
      id: 'roadmap',
      label: 'Lộ trình 180 bài',
      sub: `${completedLessonIds.length}/${TOTAL_HSK_LESSONS} bài`,
      icon: Compass,
      iconBg: 'bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]',
    },
    {
      id: 'vocabulary',
      label: 'Flashcard & SRS',
      sub: srsDueCount > 0 ? `${srsDueCount} thẻ đến hạn` : `${actualWordsLearned} từ nhớ`,
      icon: BookOpen,
      iconBg: 'bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]',
    },
    {
      id: 'writing',
      label: 'Luyện viết Hán tự',
      sub: 'Mễ tự & nét bút',
      icon: PenTool,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'reader',
      label: 'Đọc & Nghe',
      sub: recentReading ? `Đọc tiếp ${recentReading.progressPercent}%` : 'NLP & Audio',
      icon: BookOpen,
      iconBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
    },
    {
      id: 'hsk',
      label: 'Phòng thi CBT',
      sub:
        cbtSummary.attemptsCount > 0
          ? `${cbtSummary.attemptsCount} đề đã thi`
          : 'Thi thử HSK 1–9',
      icon: GraduationCap,
      iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'conversation',
      label: 'Gia sư AI',
      sub: 'Hội thoại ngữ cảnh',
      icon: MessageCircle,
      iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-[#3B82F6]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 animate-in fade-in duration-300">
      {/* Check-in Toast Feedback */}
      {checkInToast && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold shadow-md flex items-center justify-between gap-3 ${
            checkInToast.success
              ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
          }`}
        >
          <span>{checkInToast.message}</span>
          <button
            type="button"
            onClick={() => setCheckInToast(null)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}

      {/* =====================================================================
          TẦNG 1: HERO HÀNH ĐỘNG NGAY (ABOVE THE FOLD — 7:5 DESKTOP, 1 COL MOBILE)
      ===================================================================== */}
      <section
        aria-label="Hành động học tập ưu tiên và chỉ số chính"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch"
      >
        {/* Left 7 cols: Primary Focus Card */}
        <div className="lg:col-span-7 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#FFF9F2] to-white dark:from-[#1E293B] dark:via-[#131B24] dark:to-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm relative overflow-hidden flex flex-col justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2.5 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]">
                {nextLessonInfo.level} • Bài #{nextLessonInfo.number}
              </span>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
                <Target size={13} className="text-[#E85D3F]" />
                <span>
                  Mục tiêu: <strong>{dailyGoalMinutes}p/ngày</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                  className="text-[11px] text-[#E85D3F] font-bold hover:underline ml-1 cursor-pointer"
                >
                  {isEditingGoal ? 'Đóng' : 'Đổi'}
                </button>
              </div>
            </div>

            {isEditingGoal && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm text-xs">
                <span className="font-semibold text-[#243447] dark:text-white ml-1">Mục tiêu:</span>
                {[10, 15, 25, 30, 45].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSaveGoal(m)}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      dailyGoalMinutes === m
                        ? 'bg-[#E85D3F] text-white shadow-sm'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447]'
                    }`}
                  >
                    {m}p
                  </button>
                ))}
              </div>
            )}

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#243447] dark:text-white leading-tight">
              {greetingTime}, {userName}! 👋
            </h1>
          </div>

          {/* Next Best Action Card */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-[#0F172A]/70 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2 sm:space-y-3 relative z-10">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E85D3F] flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Bước tiếp theo ngay lúc này</span>
              </span>
              <span className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
                {srsDueCount > 0 ? 'Ưu tiên củng cố trí nhớ' : `⏱️ ${nextLessonInfo.duration} phút • +${nextLessonInfo.xp} XP`}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white line-clamp-1">
              {srsDueCount > 0
                ? `Bạn có ${srsDueCount} thẻ từ vựng SRS đến hạn ôn tập hôm nay.`
                : nextLessonInfo.title}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {srsDueCount > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveTab('vocabulary');
                    }}
                    className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E85D3F]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Clock size={16} />
                    <span>Ôn ngay {srsDueCount} thẻ SRS đến hạn</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueLesson}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-[#243447] dark:text-white font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={14} className="text-[#E85D3F]" />
                    <span>Học tiếp Bài #{nextLessonInfo.number}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleContinueLesson}
                    className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E85D3F]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={15} className="fill-white shrink-0" />
                    <span className="truncate">Học tiếp Bài #{nextLessonInfo.number}: {nextLessonInfo.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveTab('hsk');
                    }}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-[#243447] dark:text-white font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <GraduationCap size={15} className="text-[#E85D3F]" />
                    <span>Làm đề thi CBT</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Subtle Decorative Watermark */}
          <div className="absolute right-2 -bottom-6 font-['Noto_Serif_SC'] text-8xl font-black text-[#E85D3F]/5 select-none pointer-events-none">
            学
          </div>
        </div>

        {/* Right 5 cols: Compact 4-Card KPI Strip (2x2) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* KPI 1: Streak + Check-in */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Chuỗi ngày học: ${userStreak} ngày. Nhấn để mở lịch trình chuỗi`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playClickSound();
                setStreakModalOpen(true);
              }
            }}
            onClick={() => {
              playClickSound();
              setStreakModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-col justify-between gap-2 hover:border-[#E85D3F] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8]">
                Chuỗi ngày học
              </span>
              <Flame size={18} className="fill-[#F4B942] text-[#E85D3F] shrink-0" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white leading-tight">
                {userStreak} ngày
              </p>
              {!streakStatus.hasStudiedToday ? (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={checkInLoading}
                  className="mt-1.5 min-h-11 w-full px-2 py-1 rounded-lg bg-[#E85D3F] text-white text-[10px] font-bold hover:bg-[#CB4529] transition-colors cursor-pointer"
                >
                  Điểm danh (+15 XP)
                </button>
              ) : (
                <p className="text-[11px] font-semibold text-[#45B97C] mt-1 truncate">
                  ✓ Đã điểm danh hôm nay
                </p>
              )}
            </div>
          </div>

          {/* KPI 2: Từ vựng SRS */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('vocabulary');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-col justify-between gap-2 text-left hover:border-[#E85D3F] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8]">
                Từ vựng SRS
              </span>
              <BookOpen size={17} className="text-[#E85D3F] shrink-0" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white leading-tight">
                {actualWordsLearned} từ
              </p>
              <p
                className={`text-[11px] font-semibold mt-1 truncate ${
                  srsDueCount > 0 ? 'text-[#E85D3F]' : 'text-[#45B97C]'
                }`}
              >
                {srsDueCount > 0 ? `⏰ ${srsDueCount} thẻ cần ôn` : '✓ Không có thẻ tồn'}
              </p>
            </div>
          </button>

          {/* KPI 3: Tiến độ Lộ trình ( / 180 bài HSK 1-9) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('roadmap');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-col justify-between gap-2 text-left hover:border-[#45B97C] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8]">
                Tiến độ Lộ trình
              </span>
              <Compass size={17} className="text-[#45B97C] shrink-0" />
            </div>
            <div className="w-full space-y-1.5">
              <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white leading-tight">
                {completedLessonIds.length}
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                  /{TOTAL_HSK_LESSONS}
                </span>
              </p>
              <div className="w-full h-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 overflow-hidden">
                <div
                  className="h-full bg-[#45B97C] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(overallRoadmapProgress > 0 ? 5 : 0, overallRoadmapProgress)}%` }}
                />
              </div>
            </div>
          </button>

          {/* KPI 4: Điểm CBT gần nhất / Cao nhất (từ hsk_attempts) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('hsk');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-col justify-between gap-2 text-left hover:border-purple-500 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8]">
                Điểm thi CBT
              </span>
              <Award size={17} className="text-purple-500 shrink-0" />
            </div>
            <div>
              {cbtSummary.bestScore !== null ? (
                <>
                  <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white leading-tight">
                    {cbtSummary.bestScore}
                    <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                      /{cbtSummary.bestMaxScore}
                    </span>
                  </p>
                  <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1 truncate">
                    Cao nhất ({cbtSummary.bestLevel})
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white leading-tight">
                    Chưa thi
                  </p>
                  <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8] mt-1 truncate">
                    Thử sức HSK 1–9 →
                  </p>
                </>
              )}
            </div>
          </button>
        </div>
      </section>

      {/* =====================================================================
          TẦNG 2: VÒNG LẶP HỌC TẬP HÔM NAY & LỐI TẮT NHANH (8:4 DESKTOP)
      ===================================================================== */}
      <section
        aria-label="Vòng lặp học tập hôm nay và lối tắt kỹ năng"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
      >
        {/* Main 8 cols: Unified Today's Mission & AI Coach */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-[#E85D3F]" />
              <span>Nhiệm vụ hôm nay & AI Coach</span>
            </h2>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setWorkspaceTab('daily_loop');
                }}
                className={`min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  workspaceTab === 'daily_loop'
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                Vòng lặp hôm nay
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setWorkspaceTab('ai_coach');
                }}
                className={`min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceTab === 'ai_coach'
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                <Brain size={13} />
                <span>AI Coach</span>
              </button>
            </div>
          </div>

          {workspaceTab === 'daily_loop' ? (
            <DailySmartStudyFlow
              user={user}
              onNavigateModule={(mod) => {
                if (mod === 'vocab') setActiveTab('vocabulary');
                else if (mod === 'reading') setActiveTab('reader');
                else if (mod === 'listening') setActiveTab('listening-studio');
                else setActiveTab(mod);
              }}
            />
          ) : (
            <Suspense
              fallback={
                <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] p-8 text-center text-xs font-semibold text-[#748092]">
                  Đang khởi tạo AI Coach...
                </div>
              }
            >
              <AiLearningCoachWidget
                user={user}
                setActiveTab={setActiveTab}
                onSelectLesson={onSelectLesson}
              />
            </Suspense>
          )}
        </div>

        {/* Side 4 cols: 6 Core Skill Shortcuts (grid-cols-2 gap-2.5) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#243447] dark:text-white">
              Lối tắt 6 kỹ năng cốt lõi
            </h2>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('materials');
              }}
              className="text-[11px] font-bold text-[#E85D3F] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Tài liệu</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {coreShortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab(item.id);
                  }}
                  className="min-h-[84px] p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-left flex flex-col justify-between gap-2 transition-all active:scale-95 cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#243447] dark:text-white truncate group-hover:text-[#E85D3F] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">
                      {item.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          TẦNG 3: PHÂN TÍCH CHUYÊN SÂU & MỞ RỘNG (PROGRESSIVE DISCLOSURE TABS)
      ===================================================================== */}
      <DashboardDeepAnalyticsTabs
        user={user}
        setActiveTab={setActiveTab}
        targetHskLevel={targetHskLevel}
        calculatedTotalXp={calculatedTotalXp}
        dailyGoalMinutes={dailyGoalMinutes}
        weeklyStudyMinutes={weeklyStudyMinutes}
        totalWeeklyHours={totalWeeklyHours}
        todayData={todayData}
        achievedDaysCount={achievedDaysCount}
        daysPassedCount={daysPassedCount}
        dynamicAchievements={dynamicAchievements}
        unlockedAchievementsCount={unlockedAchievementsCount}
        studentClassrooms={studentClassrooms}
        studentAssignments={studentAssignments}
        loadingClassroomData={loadingClassroomData}
        localReviewList={localReviewList}
        onMarkReviewDone={handleMarkReviewDone}
      />

      {/* Interactive Streak Modal */}
      <StreakModal
        user={user}
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
