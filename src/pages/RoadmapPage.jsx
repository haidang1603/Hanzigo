// File: src/pages/RoadmapPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Trophy,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  Sparkles,
  BookOpen,
  PenTool,
  Mic,
  Headphones,
  MessageSquare,
  ShieldCheck,
  Search,
  ChevronRight,
  Flame,
  Volume2,
  Award,
  RotateCcw,
  Languages,
  GraduationCap,
  Compass,
  Calendar,
  Layers,
  BarChart3,
  X,
  Check,
  RotateCw,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  ALL_9_STAGE_CONFIGS,
  ALL_180_LESSONS,
} from '@/features/curriculum/lessonContentSynthesizer';
import {
  playClickSound,
  playSuccessSound,
  playErrorSound,
  speakChinese as speakChineseAudio,
} from '../utils/audio';
import { getUserJourneyProgress } from '../services/learningPathService';
import {
  getStudentSupplementaryLessons,
  completeCustomLesson,
} from '../services/customLessonService';
import LearningJourneyMap from '../components/learning/LearningJourneyMap';
import InteractiveLessonPlayer from '../components/learning/InteractiveLessonPlayer';
import BossChallengeModal from '../components/learning/BossChallengeModal';
import PlacementTestModal from '../components/learning/PlacementTestModal';
import DailyMissionsModal from '../components/learning/DailyMissionsModal';
import SkillMasteryCard from '../components/learning/SkillMasteryCard';

const LOCAL_ROADMAP_PROGRESS_KEY = 'hanzigo_roadmap_120_progress_v1';
const LOCAL_FREE_EXPLORE_KEY = 'hanzigo_roadmap_free_explore_v1';

const TOOL_META = {
  pronunciation: {
    label: 'Phát âm & Biến điệu',
    icon: Mic,
    tab: 'pronunciation',
    color:
      'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  },
  writing: {
    label: 'Luyện viết Mễ tự cách',
    icon: PenTool,
    tab: 'writing',
    color:
      'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  },
  grammar: {
    label: 'Cấu trúc Ngữ pháp',
    icon: Sparkles,
    tab: 'practice',
    color:
      'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
  },
  reading: {
    label: 'Đọc hiểu & Dịch thuật',
    icon: BookOpen,
    tab: 'reader',
    color:
      'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800',
  },
  listening: {
    label: 'Luyện nghe A-B Loop',
    icon: Headphones,
    tab: 'listening-studio',
    color:
      'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
  },
  roleplay: {
    label: 'Hội thoại & Biện luận AI',
    icon: MessageSquare,
    tab: 'conversation',
    color:
      'text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
  },
  exam: {
    label: 'Thi thử CBT HSK',
    icon: Trophy,
    tab: 'hsk',
    color:
      'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  },
};

function readInitialCompletedIds() {
  try {
    const raw = localStorage.getItem(LOCAL_ROADMAP_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.completedIds)) {
        return parsed.completedIds;
      }
      if (parsed.completedLessons && typeof parsed.completedLessons === 'object') {
        const mapped = Object.keys(parsed.completedLessons)
          .map((key) => {
            const match = ALL_180_LESSONS.find(
              (l) => l.canonicalId === key || l.stringId === key || String(l.id) === key
            );
            return match ? match.id : null;
          })
          .filter(Boolean);
        if (mapped.length > 0) return mapped;
      }
    }
  } catch {
    // Ignore parse error
  }
  return [1, 2, 3];
}

export default function RoadmapPage({
  user = null,
  setActiveTab,
  initialLessonId = null,
  onClearInitialLesson = null,
  onAddXp = null,
  onSelectWriting = null,
  onSelectPronounce = null,
}) {
  // Chế độ hiển thị chính: 'syllabus' (Lộ trình 9 Cấp & 180 Bài) | 'journey' (Bản đồ Du ký HSK) | 'skills' (Ma trận Kỹ năng) | 'supplementary' (Bài học Mở rộng)
  const [roadmapView, setRoadmapView] = useState('syllabus');
  const [trackGroup, setTrackGroup] = useState('hsk1_6'); // 'hsk1_6' | 'hsk7_9' | 'all_9'
  const [activeLevel, setActiveLevel] = useState(1);
  const [activeModuleFilter, setActiveModuleFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [completedLessonIds, setCompletedLessonIds] = useState(readInitialCompletedIds);

  const [bestCbtScores, setBestCbtScores] = useState({
    1: 175,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  });

  const [freeExploreUnlocked, setFreeExploreUnlocked] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_FREE_EXPLORE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Supplementary lessons state
  const [activeLessonToPlay, setActiveLessonToPlay] = useState(null);
  const [activeBossChallenge, setActiveBossChallenge] = useState(null);
  const [showPlacementTest, setShowPlacementTest] = useState(false);
  const [showDailyMissions, setShowDailyMissions] = useState(false);
  const [journeyVersion, setJourneyVersion] = useState(0);

  const [supplementaryLessons, setSupplementaryLessons] = useState([]);
  const [isLoadingSupplementary, setIsLoadingSupplementary] = useState(false);
  const [supplementarySearch, setSupplementarySearch] = useState('');
  const [supplementaryLevelFilter, setSupplementaryLevelFilter] = useState('all');
  const [selectedSupplementaryLesson, setSelectedSupplementaryLesson] = useState(null);
  const [isCompletingSupplementary, setIsCompletingSupplementary] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  const progress = useMemo(
    () => getUserJourneyProgress(user),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, journeyVersion]
  );

  // Điều hướng tương thích cả Hash Router (App.jsx) và React Router
  // Cập nhật hash trước khi gọi setActiveTab để App.jsx giữ nguyên query string (?id=...)
  const navigateToAppRoute = useCallback(
    (tabName, queryString = '') => {
      window.location.hash = `#${tabName}${queryString ? `?${queryString}` : ''}`;
      if (typeof setActiveTab === 'function') {
        setActiveTab(tabName);
      }
    },
    [setActiveTab]
  );

  // Nếu được chuyển vào Roadmap với initialLessonId (ví dụ từ #roadmap/l-101), điều hướng thẳng tới LessonPage
  useEffect(() => {
    if (!initialLessonId) return;
    const rawStr = String(initialLessonId).trim();
    const matched =
      ALL_180_LESSONS.find(
        (l) => l.canonicalId === rawStr || l.stringId === rawStr || String(l.id) === rawStr
      ) || ALL_180_LESSONS[0];
    if (onClearInitialLesson) onClearInitialLesson();
    if (matched) {
      navigateToAppRoute('lesson', `id=${matched.id}&level=${matched.level}`);
    }
  }, [initialLessonId, onClearInitialLesson, navigateToAppRoute]);

  useEffect(() => {
    let isMounted = true;
    async function syncProgressFromCloud() {
      try {
        if (!supabase?.auth) return;
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        const targetUid = user?.id || user?.uid || authUser?.id;
        if (!targetUid || !isMounted) return;

        const { data: attempts } = await supabase
          .from('hsk_attempts')
          .select('hsk_level, total_score')
          .eq('user_id', targetUid)
          .order('total_score', { ascending: false });

        if (attempts && attempts.length > 0 && isMounted) {
          setBestCbtScores((prev) => {
            const next = { ...prev };
            for (const row of attempts) {
              const lvl = Number(row.hsk_level);
              const sc = Number(row.total_score) || 0;
              if (lvl >= 1 && lvl <= 9 && sc > (next[lvl] || 0)) {
                next[lvl] = sc;
              }
            }
            return next;
          });
        }
      } catch {
        // Fallback offline
      }
    }
    syncProgressFromCloud();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const loadSupplementaryLessons = useCallback(async () => {
    setIsLoadingSupplementary(true);
    try {
      const items = await getStudentSupplementaryLessons();
      setSupplementaryLessons(Array.isArray(items) ? items : []);
    } catch {
      // Non-blocking fallback
    } finally {
      setIsLoadingSupplementary(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadSupplementaryLessons();

    const handleRemoteLessonsUpdate = () => {
      if (isMounted) loadSupplementaryLessons();
    };
    window.addEventListener('hanzigo:custom_lessons_updated', handleRemoteLessonsUpdate);

    let channel;
    if (isSupabaseConfigured && supabase) {
      try {
        channel = supabase
          .channel('public:lessons_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, () => {
            if (isMounted) loadSupplementaryLessons();
          })
          .subscribe();
      } catch {
        // Ignore realtime init failure
      }
    }

    return () => {
      isMounted = false;
      window.removeEventListener('hanzigo:custom_lessons_updated', handleRemoteLessonsUpdate);
      if (channel && supabase) {
        supabase.removeChannel(channel).catch(() => {});
      }
    };
  }, [loadSupplementaryLessons]);

  const filteredSupplementaryLessons = useMemo(() => {
    return supplementaryLessons.filter((l) => {
      if (l.isHidden || l.is_hidden) return false;
      const matchSearch =
        !supplementarySearch.trim() ||
        (l.title && l.title.toLowerCase().includes(supplementarySearch.toLowerCase())) ||
        (l.description &&
          l.description.toLowerCase().includes(supplementarySearch.toLowerCase()));
      const matchLevel =
        supplementaryLevelFilter === 'all' ||
        (l.level &&
          l.level.toLowerCase().replace(/\s+/g, '') ===
            supplementaryLevelFilter.toLowerCase().replace(/\s+/g, ''));
      return matchSearch && matchLevel;
    });
  }, [supplementaryLessons, supplementarySearch, supplementaryLevelFilter]);

  const handleOpenSupplementaryLesson = (lesson) => {
    playClickSound();
    if (lesson?.step1_objectives && lesson?.step2_vocabulary) {
      setActiveLessonToPlay(lesson);
    } else {
      setSelectedSupplementaryLesson(lesson);
    }
  };

  const handleCompleteSupplementaryLesson = async (lesson) => {
    if (!lesson) return;
    playClickSound();
    setIsCompletingSupplementary(true);
    try {
      const res = await completeCustomLesson(lesson, user);
      if (res?.success) {
        playSuccessSound();
        if (res.isFirstTime && onAddXp) {
          onAddXp(res.xpAwarded);
        }
        showToast(
          `🎉 Chúc mừng! Bạn đã hoàn thành "${lesson.title}" (+${res.xpAwarded} XP)`
        );
        setJourneyVersion((v) => v + 1);
        setSelectedSupplementaryLesson(null);
      }
    } catch (err) {
      playErrorSound();
      showToast(err.message || 'Lỗi khi ghi nhận hoàn thành bài học.');
    } finally {
      setIsCompletingSupplementary(false);
    }
  };

  const toggleFreeExplore = useCallback(() => {
    playClickSound();
    setFreeExploreUnlocked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_FREE_EXPLORE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const toggleLessonComplete = useCallback((lessonId) => {
    playClickSound();
    setCompletedLessonIds((prev) => {
      const exists = prev.includes(lessonId);
      const next = exists ? prev.filter((id) => id !== lessonId) : [...prev, lessonId];
      try {
        const existingRaw = localStorage.getItem(LOCAL_ROADMAP_PROGRESS_KEY);
        const existingObj = existingRaw ? JSON.parse(existingRaw) : {};
        const safeExisting =
          existingObj && typeof existingObj === 'object' ? existingObj : {};
        localStorage.setItem(
          LOCAL_ROADMAP_PROGRESS_KEY,
          JSON.stringify({
            ...safeExisting,
            completedIds: next,
            updatedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore quota error
      }
      return next;
    });
  }, []);

  const speakChinese = useCallback((text) => {
    if (typeof window === 'undefined') return;
    speakChineseAudio(text);
  }, []);

  // Tính toán Mastery cho toàn bộ 9 cấp độ (HSK 1 - HSK 9)
  const stageMasteryStats = useMemo(() => {
    const stats = {};
    for (const stage of ALL_9_STAGE_CONFIGS) {
      const stageLessons = ALL_180_LESSONS.filter((l) => l.level === stage.level);
      const completedInStage = stageLessons.filter((l) =>
        completedLessonIds.includes(l.id)
      ).length;
      const lessonPct = Math.round((completedInStage / stageLessons.length) * 100);

      const bestScore = bestCbtScores[stage.level] || 0;
      const cbtPct = Math.min(
        100,
        Math.round((bestScore / stage.examConfig.unlockTargetScore) * 100)
      );

      const masteryPct =
        bestScore >= stage.examConfig.unlockTargetScore
          ? Math.max(lessonPct, 100)
          : Math.round(lessonPct * 0.75 + cbtPct * 0.25);

      let isUnlocked = stage.level === 1 || stage.level === 7 || freeExploreUnlocked;
      if (!isUnlocked && stage.level > 1) {
        const prevLevel = stage.level - 1;
        const prevStageConfig = ALL_9_STAGE_CONFIGS.find((s) => s.level === prevLevel);
        const prevLessons = ALL_180_LESSONS.filter((l) => l.level === prevLevel);
        const prevCompleted = prevLessons.filter((l) =>
          completedLessonIds.includes(l.id)
        ).length;
        const prevLessonRatio = prevCompleted / prevLessons.length;
        const prevBestScore = bestCbtScores[prevLevel] || 0;

        isUnlocked =
          prevLessonRatio >= 0.7 ||
          prevBestScore >= (prevStageConfig?.examConfig.passScore || 180);
      }

      stats[stage.level] = {
        completedCount: completedInStage,
        totalCount: stageLessons.length,
        lessonPct,
        bestScore,
        masteryPct,
        isUnlocked,
        isExamPassed: bestScore >= stage.examConfig.passScore,
      };
    }
    return stats;
  }, [completedLessonIds, bestCbtScores, freeExploreUnlocked]);

  const globalStats = useMemo(() => {
    const totalCompleted = completedLessonIds.length;
    const totalPct = Math.round((totalCompleted / 180) * 100);

    let estimatedVocab = 0;
    for (const stage of ALL_9_STAGE_CONFIGS) {
      const st = stageMasteryStats[stage.level];
      estimatedVocab += Math.round((st.completedCount / st.totalCount) * stage.newWords);
    }

    const nextRecommendedLesson =
      ALL_180_LESSONS.find((l) => !completedLessonIds.includes(l.id)) ||
      ALL_180_LESSONS[0];

    return {
      totalCompleted,
      totalPct,
      estimatedVocab,
      nextRecommendedLesson,
    };
  }, [completedLessonIds, stageMasteryStats]);

  const visibleStageConfigs = useMemo(() => {
    if (trackGroup === 'hsk1_6') {
      return ALL_9_STAGE_CONFIGS.filter((s) => s.level <= 6);
    }
    if (trackGroup === 'hsk7_9') {
      return ALL_9_STAGE_CONFIGS.filter((s) => s.level >= 7);
    }
    return ALL_9_STAGE_CONFIGS;
  }, [trackGroup]);

  const currentStage = useMemo(
    () => ALL_9_STAGE_CONFIGS.find((s) => s.level === activeLevel) || ALL_9_STAGE_CONFIGS[0],
    [activeLevel]
  );

  const currentStageStat = stageMasteryStats[activeLevel] || stageMasteryStats[1];

  const filteredLessons = useMemo(() => {
    return ALL_180_LESSONS.filter((lesson) => {
      if (lesson.level !== activeLevel) return false;
      if (activeModuleFilter !== 0 && lesson.moduleIndex !== activeModuleFilter) {
        return false;
      }
      if (statusFilter === 'completed' && !completedLessonIds.includes(lesson.id)) {
        return false;
      }
      if (statusFilter === 'remaining' && completedLessonIds.includes(lesson.id)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          lesson.zh.toLowerCase().includes(q) ||
          lesson.pinyin.toLowerCase().includes(q) ||
          lesson.vi.toLowerCase().includes(q) ||
          lesson.grammarCode.toLowerCase().includes(q) ||
          lesson.keyVocab.some((w) => w.includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [activeLevel, activeModuleFilter, statusFilter, searchQuery, completedLessonIds]);

  const groupedModules = useMemo(() => {
    const map = new Map();
    for (const lesson of filteredLessons) {
      if (!map.has(lesson.moduleIndex)) {
        map.set(lesson.moduleIndex, {
          moduleIndex: lesson.moduleIndex,
          moduleTitle: lesson.moduleTitle,
          lessons: [],
        });
      }
      map.get(lesson.moduleIndex).lessons.push(lesson);
    }
    return Array.from(map.values());
  }, [filteredLessons]);

  const handleStartLesson = (lesson) => {
    playClickSound();
    navigateToAppRoute('lesson', `id=${lesson.id}&level=${lesson.level}`);
  };

  const handleTakeStageCbtExam = (stage) => {
    playClickSound();
    navigateToAppRoute('hsk', `level=${stage.level}&paper=${stage.examConfig.paperCode}`);
  };

  // Trình phát bài học mở rộng 9 bước (nếu có) — giữ nguyên trong layout chuẩn không che Sidebar
  if (activeLessonToPlay) {
    return (
      <div className="min-h-[80vh] bg-[#FFF9F2] dark:bg-[#131B24] animate-in fade-in duration-200">
        <InteractiveLessonPlayer
          lesson={activeLessonToPlay}
          user={user}
          onClose={() => setActiveLessonToPlay(null)}
          onBack={() => setActiveLessonToPlay(null)}
          onSelectWriting={(v) => {
            setActiveLessonToPlay(null);
            if (onSelectWriting) onSelectWriting(v);
          }}
          onSelectPronounce={(v) => {
            setActiveLessonToPlay(null);
            if (onSelectPronounce) onSelectPronounce(v);
          }}
          onCompleteLesson={(score, stars) => {
            playSuccessSound();
            showToast(`🎉 Xuất sắc! Bạn đã hoàn thành bài học với ${score} điểm (${stars} sao)`);
            setJourneyVersion((v) => v + 1);
          }}
          onNextLesson={() => setActiveLessonToPlay(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-[#F3F4F6] py-6 sm:py-8 transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10">
            <CheckCircle2 size={16} className="text-[#45B97C]" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1. HERO BANNER: ASIAN-MODERN PORTAL */}
        <section className="relative overflow-hidden p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] text-white shadow-lg border border-white/5">
          {/* Warm Ambient Glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-[#E85D3F]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold backdrop-blur-md border border-white/15">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Khung Chuẩn HSK 2.0 & 3.0 • 180 Bài Học (HSK 1 – HSK 9)</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Noto_Serif_SC'] leading-snug text-white">
                  Lộ Trình Chinh Phục Hán Ngữ 9 Cấp Độ
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Từ nền tảng <strong className="text-white">HSK 1–6 (120 bài • 5.000 từ)</strong>{' '}
                  đến đỉnh cao học thuật{' '}
                  <strong className="text-amber-300">HSK 7–9 (60 bài • 11.092 từ)</strong> kèm{' '}
                  <span className="text-orange-300 font-semibold">
                    Xưởng Dịch Thuật 3 Tầng, Luận văn 600 chữ và Phòng thi CBT
                  </span>
                  .
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShowPlacementTest(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Compass size={14} className="text-amber-400" />
                    <span>Xếp lớp HSK</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShowDailyMissions(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Calendar size={14} className="text-emerald-400" />
                    <span>Nhiệm vụ ngày</span>
                  </button>
                </div>
              </div>

              {globalStats.nextRecommendedLesson && (
                <div className="w-full lg:w-96 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Bài học đề xuất tiếp theo
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-black/25 text-white/90 font-bold text-[11px]">
                      HSK {globalStats.nextRecommendedLesson.level} • Bài #
                      {String(globalStats.nextRecommendedLesson.id).padStart(2, '0')}
                    </span>
                  </div>

                  <div>
                    <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-['Noto_Serif_SC']">
                      <span>{globalStats.nextRecommendedLesson.zh}</span>
                      <span className="text-xs font-sans font-normal text-amber-300">
                        ({globalStats.nextRecommendedLesson.pinyin})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                      {globalStats.nextRecommendedLesson.vi}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartLesson(globalStats.nextRecommendedLesson)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs transition shadow-md cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Vào học ngay Bài #{globalStats.nextRecommendedLesson.id}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleFreeExplore}
                      title="Bật/Tắt chế độ mở khóa tự do mọi cấp độ"
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        freeExploreUnlocked
                          ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                          : 'bg-black/25 border-white/15 text-slate-300 hover:text-white'
                      }`}
                    >
                      {freeExploreUnlocked ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Chỉ số Mastery Toàn hệ thống (180 bài / 11.092 từ) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[11px] text-slate-300 font-medium">Tiến độ 180 bài học</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black text-white">
                    {globalStats.totalCompleted} / 180
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    {globalStats.totalPct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-black/30 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#45B97C] via-amber-400 to-[#E85D3F] transition-all duration-500"
                    style={{ width: `${Math.max(4, globalStats.totalPct)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[11px] text-slate-300 font-medium">
                  Từ vựng tích lũy (HSK 3.0)
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black text-emerald-300">
                    {globalStats.estimatedVocab.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-300">/ 11.092 từ</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-2">
                  HSK 1–6 (5.000) + HSK 7–9 (6.092)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[11px] text-slate-300 font-medium">Cấp độ đang mở</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black text-amber-300">
                    HSK {activeLevel}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {currentStageStat.masteryPct}% Mastery
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-2 truncate font-['Noto_Serif_SC']">
                  {currentStage.subtitleZh}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[11px] text-slate-300 font-medium">Nhánh chương trình</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-white">
                    {activeLevel >= 7 ? 'HSK 3.0 Cao Cấp (7–9)' : 'HSK 1–6 Chuẩn Quốc Tế'}
                  </span>
                </div>
                <p className="text-[11px] text-orange-300 mt-2">
                  {activeLevel >= 7
                    ? 'Tích hợp Xưởng Dịch Thuật 3 Tầng'
                    : 'Tích hợp HanziWriter & CBT'}
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Calligraphy Watermark */}
          <div className="absolute right-4 -bottom-6 font-['Noto_Serif_SC'] text-8xl sm:text-9xl font-black text-white/5 select-none pointer-events-none">
            学海无涯
          </div>
        </section>

        {/* 2. SUB-NAVIGATION VIEW SWITCHER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setRoadmapView('syllabus');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                roadmapView === 'syllabus'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              <Layers size={16} />
              <span>Giáo trình 9 Cấp & 180 Bài</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setRoadmapView('journey');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                roadmapView === 'journey'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              <Compass size={16} />
              <span>Bản đồ Du ký HSK (Map)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setRoadmapView('skills');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                roadmapView === 'skills'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              <BarChart3 size={16} />
              <span>Ma trận 5 Kỹ năng</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setRoadmapView('supplementary');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                roadmapView === 'supplementary'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              <BookOpen size={16} />
              <span>Bài học Mở rộng ({supplementaryLessons.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#748092] dark:text-[#94A3B8]">
            <span className="font-semibold">Tiến độ chung:</span>
            <div className="w-24 h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#45B97C] via-amber-400 to-[#E85D3F] transition-all duration-500"
                style={{ width: `${Math.max(5, globalStats.totalPct)}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[#E85D3F]">{globalStats.totalPct}%</span>
          </div>
        </div>

        {/* ========================================================== */}
        {/* VIEW 1: GIÁO TRÌNH 9 CẤP ĐỘ & 180 BÀI HỌC HSK 1–9          */}
        {/* ========================================================== */}
        {roadmapView === 'syllabus' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Bộ chuyển đổi nhánh (HSK 1–6 vs HSK 7–9 Cao Cấp) & Chọn 9 cấp */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setTrackGroup('hsk1_6');
                      if (activeLevel > 6) setActiveLevel(1);
                      setActiveModuleFilter(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                      trackGroup === 'hsk1_6'
                        ? 'bg-[#E85D3F] text-white shadow-xs'
                        : 'text-[#5B6B7F] dark:text-slate-300 hover:bg-[#FAF6F0] dark:hover:bg-[#0F172A]'
                    }`}
                  >
                    HSK 1 – HSK 6 (Bài 01–120 • 5.000 từ)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setTrackGroup('hsk7_9');
                      if (activeLevel < 7) setActiveLevel(7);
                      setActiveModuleFilter(0);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                      trackGroup === 'hsk7_9'
                        ? 'bg-[#243447] text-amber-300 shadow-xs'
                        : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>HSK 3.0 Cao Cấp: HSK 7 – 9 (Bài 121–180 • 11.092 từ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setTrackGroup('all_9');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      trackGroup === 'all_9'
                        ? 'bg-[#FFF5F2] dark:bg-white/10 text-[#E85D3F] dark:text-amber-300'
                        : 'text-[#748092] dark:text-slate-400 hover:text-[#243447] dark:hover:text-white'
                    }`}
                  >
                    Hiện tất cả 9 cấp
                  </button>
                </div>

                {activeLevel >= 7 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    <Languages className="w-4 h-4" />
                    <span>Mỗi bài HSK 7–9 đều tích hợp Xưởng Dịch Thuật 3 Tầng & Dàn ý Luận văn</span>
                  </span>
                )}
              </div>

              <div
                className={`grid grid-cols-2 md:grid-cols-3 ${
                  visibleStageConfigs.length === 3
                    ? 'lg:grid-cols-3'
                    : visibleStageConfigs.length === 6
                    ? 'lg:grid-cols-6'
                    : 'lg:grid-cols-9'
                } gap-3`}
              >
                {visibleStageConfigs.map((stage) => {
                  const st = stageMasteryStats[stage.level];
                  const isSelected = activeLevel === stage.level;

                  return (
                    <button
                      key={stage.level}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setActiveLevel(stage.level);
                        setActiveModuleFilter(0);
                      }}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#E85D3F] bg-white dark:bg-[#1E293B] shadow-md ring-2 ring-[#E85D3F]/20'
                          : 'bg-white/80 dark:bg-[#1E293B]/60 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${stage.badgeBg}`}
                        >
                          {stage.badge}
                        </span>
                        {st.isUnlocked ? (
                          st.masteryPct >= 100 ? (
                            <CheckCircle2 className="w-4 h-4 text-[#45B97C]" />
                          ) : (
                            <Unlock className="w-4 h-4 text-[#748092] dark:text-slate-400" />
                          )
                        ) : (
                          <Lock className="w-4 h-4 text-amber-500" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#243447] dark:text-white line-clamp-1">
                          Bài {stage.lessonRange[0]} – {stage.lessonRange[1]}
                        </div>
                        <div className="text-[11px] text-[#748092] dark:text-slate-400 mt-0.5">
                          {stage.vocabTarget.toLocaleString()} từ tích lũy
                        </div>
                      </div>

                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#748092] dark:text-slate-400">
                            {st.completedCount}/{st.totalCount} bài
                          </span>
                          <span className="font-bold text-[#243447] dark:text-slate-200">
                            {st.masteryPct}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${stage.accentColor} transition-all duration-500`}
                            style={{ width: `${st.masteryPct}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Banner Chi tiết Cấp độ & Cổng thi CBT */}
            <div
              className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border ${currentStage.borderGlow} shadow-xs space-y-5`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${currentStage.badgeBg}`}
                    >
                      {currentStage.badge} • {currentStage.subtitleZh}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300 text-xs font-medium">
                      ⏱️ Thời lượng: {currentStage.durationWeeks}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300 text-xs font-medium">
                      ✍️ {currentStage.hanziTarget.toLocaleString()} Hán tự tích lũy
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                    {currentStage.titleVi}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-[#748092] dark:text-slate-400">
                      Trọng tâm rèn luyện:
                    </span>
                    {currentStage.primaryTools.map((toolName, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-[#E85D3F]/30 text-[#E85D3F] dark:text-orange-300 text-xs font-semibold"
                      >
                        {toolName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-[400px] p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3 shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Cổng Thi CBT ({currentStage.examConfig.paperCode})</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        currentStageStat.isExamPassed
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {currentStageStat.isExamPassed
                        ? `Đã Đạt (${currentStageStat.bestScore}/${currentStage.examConfig.maxScore}đ)`
                        : `Chuẩn đỗ: ≥ ${currentStage.examConfig.passScore}/${currentStage.examConfig.maxScore}đ`}
                    </span>
                  </div>

                  <div className="text-xs text-[#5C6672] dark:text-slate-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Quy mô bài thi:</span>
                      <strong className="text-[#243447] dark:text-white">
                        {currentStage.examConfig.questionCount} câu /{' '}
                        {currentStage.examConfig.durationMinutes} phút
                      </strong>
                    </div>
                    {currentStage.examConfig.hskkRequired && (
                      <div className="flex items-center justify-between">
                        <span>Khẩu ngữ & Dịch:</span>
                        <strong className="text-purple-600 dark:text-purple-300">
                          {currentStage.examConfig.hskkRequired}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleTakeStageCbtExam(currentStage)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs hover:opacity-95 transition shadow-xs cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Thi CBT {currentStage.badge}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigateToAppRoute('vocabulary', `level=${currentStage.level}`)
                      }
                      className="py-2 px-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F] text-xs font-bold transition cursor-pointer"
                    >
                      Ôn {currentStage.newWords.toLocaleString()} từ SRS
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách 20 bài học của cấp độ đang chọn */}
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 0, label: `Tất cả 20 bài (${currentStage.badge})` },
                    { id: 1, label: `Chặng ${activeLevel}.1 (5 bài)` },
                    { id: 2, label: `Chặng ${activeLevel}.2 (5 bài)` },
                    { id: 3, label: `Chặng ${activeLevel}.3 (5 bài)` },
                    { id: 4, label: `Chặng ${activeLevel}.4 (5 bài)` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setActiveModuleFilter(tab.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        activeModuleFilter === tab.id
                          ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-xs'
                          : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-slate-300 hover:border-[#E85D3F]/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#748092] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm chữ Hán, thành ngữ, ngữ pháp..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-medium text-[#243447] dark:text-white placeholder:text-[#748092] focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#243447] dark:text-slate-200 focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="remaining">Chưa hoàn thành</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </div>
              </div>

              {groupedModules.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-3">
                  <p className="text-sm text-[#748092] dark:text-slate-400">
                    Không tìm thấy bài học nào khớp với bộ lọc hiện tại.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setActiveModuleFilter(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-xs font-bold text-[#E85D3F] border border-[#E85D3F]/30 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt lại bộ lọc</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedModules.map((mod) => {
                    const completedInMod = mod.lessons.filter((l) =>
                      completedLessonIds.includes(l.id)
                    ).length;

                    return (
                      <div
                        key={mod.moduleIndex}
                        className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs overflow-hidden"
                      >
                        <div className="px-5 py-3.5 bg-[#FFF9F2] dark:bg-[#131B24]/70 border-b border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-[#E85D3F]/30 text-[#E85D3F] text-xs font-extrabold flex items-center justify-center">
                              {mod.moduleIndex}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white">
                              {mod.moduleTitle}
                            </h3>
                          </div>
                          <span className="text-xs font-bold text-[#748092] dark:text-slate-400 shrink-0">
                            Hoàn thành {completedInMod}/{mod.lessons.length} bài
                          </span>
                        </div>

                        <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                          {mod.lessons.map((lesson) => {
                            const isDone = completedLessonIds.includes(lesson.id);
                            const toolInfo = TOOL_META[lesson.focusTool] || TOOL_META.reading;
                            const ToolIcon = toolInfo.icon;

                            return (
                              <div
                                key={lesson.id}
                                className={`p-4 sm:p-5 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                                  isDone
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/15 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/25'
                                    : 'hover:bg-[#FFF9F2]/60 dark:hover:bg-[#1A2433]'
                                }`}
                              >
                                <div className="flex items-start gap-3.5">
                                  <button
                                    type="button"
                                    onClick={() => toggleLessonComplete(lesson.id)}
                                    title={
                                      isDone ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'
                                    }
                                    className={`mt-0.5 w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center border shrink-0 transition cursor-pointer ${
                                      isDone
                                        ? 'bg-[#45B97C] text-white border-[#45B97C] shadow-xs'
                                        : 'bg-[#FFF5F2] dark:bg-[#131B24] text-[#E85D3F] border-[#E85D3F]/30 hover:border-[#E85D3F]'
                                    }`}
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                      `#${String(lesson.id).padStart(2, '0')}`
                                    )}
                                  </button>

                                  <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-base sm:text-lg font-bold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                                        {lesson.zh}
                                      </span>
                                      <span className="text-xs font-semibold text-[#E85D3F]">
                                        ({lesson.pinyin})
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => speakChinese(lesson.zh)}
                                        className="p-1 rounded-lg bg-[#FFF5F2] dark:bg-slate-800 text-[#E85D3F] hover:brightness-95 transition cursor-pointer"
                                        title="Nghe phát âm tiêu đề"
                                      >
                                        <Volume2 className="w-3.5 h-3.5" />
                                      </button>
                                      {lesson.level >= 7 && (
                                        <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase">
                                          + Xưởng Dịch 3 Tầng
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-xs sm:text-sm text-[#5B6B7F] dark:text-slate-300 font-medium">
                                      {lesson.vi}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                      <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-semibold">
                                        📐 {lesson.grammarCode}
                                      </span>

                                      {lesson.keyVocab.map((word, wIdx) => (
                                        <span
                                          key={wIdx}
                                          onClick={() => speakChinese(word)}
                                          className="cursor-pointer px-2 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/60 text-[#243447] dark:text-slate-200 text-xs transition font-medium"
                                        >
                                          {word}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-end lg:self-center shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => navigateToAppRoute(toolInfo.tab)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition hover:brightness-95 cursor-pointer ${toolInfo.color}`}
                                  >
                                    <ToolIcon className="w-3.5 h-3.5" />
                                    <span>{toolInfo.label}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleStartLesson(lesson)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                      isDone
                                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                                        : 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white hover:opacity-95 shadow-xs'
                                    }`}
                                  >
                                    <Award className="w-3.5 h-3.5" />
                                    <span>{isDone ? 'Ôn lại bài' : 'Vào học ngay'}</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2: BẢN ĐỒ DU KÝ HSK (MAP + BOSS CHALLENGE)            */}
        {/* ========================================================== */}
        {roadmapView === 'journey' && (
          <LearningJourneyMap
            key={journeyVersion}
            user={user}
            onSelectLesson={(lesson) => {
              playClickSound();
              navigateToAppRoute('lesson', `id=${encodeURIComponent(lesson.id)}`);
            }}
            onOpenBoss={(boss) => setActiveBossChallenge(boss)}
            onOpenPlacementTest={() => setShowPlacementTest(true)}
            onOpenDailyMissions={() => setShowDailyMissions(true)}
            onOpenSkills={() => setRoadmapView('skills')}
            onLockedClick={(lesson) => {
              playErrorSound();
              showToast(
                `🔒 Bài học "${lesson.title}" đang khóa. Hoàn thành bài trước hoặc làm bài Xếp lớp để mở khóa!`
              );
            }}
          />
        )}

        {/* ========================================================== */}
        {/* VIEW 3: MA TRẬN 5 KỸ NĂNG & NHIỆM VỤ NGÀY                  */}
        {/* ========================================================== */}
        {roadmapView === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-2 space-y-6">
              <SkillMasteryCard user={user} onNavigateTab={setActiveTab} />
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F] flex items-center justify-center mx-auto text-2xl">
                  🔥
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    Nhiệm vụ hàng ngày
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                    Duy trì streak học tập mỗi ngày và nhận rương mở khóa rèn luyện +100 XP
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowDailyMissions(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Mở bảng nhiệm vụ ngày</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#243447] to-[#131B24] text-white shadow-sm space-y-4 text-center border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                  🧭
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Kiểm tra xếp lớp HSK</h3>
                  <p className="text-xs text-slate-300">
                    Đã có kiến thức tiếng Trung từ trước? Làm bài khảo hạch 15 câu để mở khóa cấp độ ngay.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowPlacementTest(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Compass size={14} />
                  <span>Làm bài kiểm tra ngay</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 4: BÀI HỌC MỞ RỘNG (CUSTOM LESSONS)                   */}
        {/* ========================================================== */}
        {roadmapView === 'supplementary' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]"
                />
                <input
                  type="text"
                  value={supplementarySearch}
                  onChange={(e) => setSupplementarySearch(e.target.value)}
                  placeholder="Tìm tiêu đề, chuyên đề bài học mở rộng..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={supplementaryLevelFilter}
                  onChange={(e) => setSupplementaryLevelFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                >
                  <option value="all">Mọi cấp độ HSK</option>
                  <option value="Nhập môn">Nhập môn</option>
                  <option value="HSK 1">HSK 1</option>
                  <option value="HSK 2">HSK 2</option>
                  <option value="HSK 3">HSK 3</option>
                  <option value="HSK 4">HSK 4</option>
                  <option value="HSK 5">HSK 5</option>
                  <option value="HSK 6">HSK 6</option>
                </select>

                <button
                  type="button"
                  onClick={loadSupplementaryLessons}
                  disabled={isLoadingSupplementary}
                  className="p-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-[#131B24] transition-all cursor-pointer shrink-0"
                  title="Làm mới bài học mở rộng"
                >
                  <RotateCw
                    size={16}
                    className={isLoadingSupplementary ? 'animate-spin text-[#E85D3F]' : ''}
                  />
                </button>
              </div>
            </div>

            {isLoadingSupplementary && (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#E85D3F] border-t-transparent animate-spin" />
                <p className="text-sm font-bold text-[#748092]">
                  Đang tải bài học mở rộng từ máy chủ...
                </p>
              </div>
            )}

            {!isLoadingSupplementary && filteredSupplementaryLessons.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                <BookOpen size={40} className="mx-auto text-gray-400" />
                <h4 className="text-base font-bold text-[#243447] dark:text-white">
                  Không tìm thấy bài học mở rộng nào
                </h4>
                <p className="text-xs text-[#748092]">
                  {supplementarySearch || supplementaryLevelFilter !== 'all'
                    ? 'Thử thay đổi từ khóa hoặc bộ lọc cấp độ HSK.'
                    : 'Các bài học mở rộng mới nhất từ giáo viên sẽ hiển thị tại đây khi được xuất bản.'}
                </p>
              </div>
            )}

            {!isLoadingSupplementary && filteredSupplementaryLessons.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSupplementaryLessons.map((l) => {
                  const isDone = Boolean(progress?.completedLessons?.[l.id]);
                  return (
                    <div
                      key={l.id}
                      className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#E85D3F] transition-all group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F]">
                            {l.level}
                          </span>
                          <span className="text-xs font-bold text-[#D97706] flex items-center gap-1">
                            <Sparkles size={13} />
                            <span>+{l.xp} XP</span>
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                          {l.title}
                        </h4>
                        <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-3 leading-relaxed">
                          {l.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                        <span className="text-xs text-[#748092]">
                          Thời lượng: {l.duration} phút
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenSupplementaryLesson(l)}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40'
                              : 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-xs hover:opacity-90'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>Ôn lại</span>
                            </>
                          ) : (
                            <>
                              <Play size={12} fill="currentColor" />
                              <span>Học ngay</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {activeBossChallenge && (
        <BossChallengeModal
          bossChallenge={activeBossChallenge}
          user={user}
          onClose={() => setActiveBossChallenge(null)}
          onVictory={(score) => {
            playSuccessSound();
            showToast(`🐉 Chiến thắng vang dội! Bạn đã hạ gục Boss với ${score} điểm!`);
            if (onAddXp) onAddXp(activeBossChallenge.xpReward || 200);
            setJourneyVersion((v) => v + 1);
          }}
        />
      )}

      {showPlacementTest && (
        <PlacementTestModal
          user={user}
          onClose={() => setShowPlacementTest(false)}
          onComplete={(result) => {
            playSuccessSound();
            showToast(
              `🎉 Xếp lớp thành công! Trình độ đề xuất: ${
                result.levelTitle || result.badge || 'Level ' + result.recommendedLevel
              }`
            );
            setJourneyVersion((v) => v + 1);
          }}
        />
      )}

      {showDailyMissions && (
        <DailyMissionsModal
          user={user}
          onClose={() => setShowDailyMissions(false)}
          onRewardClaimed={onAddXp}
        />
      )}

      {selectedSupplementaryLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F]">
                    {selectedSupplementaryLesson.level || 'HSK'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-[#D97706]">
                    🌟 Bài học bổ sung
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <BookOpen size={20} className="text-[#E85D3F]" />
                  <span>{selectedSupplementaryLesson.title}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplementaryLesson(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#748092] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-[#748092] mb-1">
                  Mô tả tóm tắt
                </h4>
                <p className="text-sm text-[#243447] dark:text-slate-200 leading-relaxed font-medium">
                  {selectedSupplementaryLesson.description ||
                    'Chuyên đề học tập bổ trợ củng cố kiến thức thực hành.'}
                </p>
              </div>

              {selectedSupplementaryLesson.grammarPoints && (
                <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                  <h4 className="text-xs font-black uppercase text-[#E85D3F] flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Trọng tâm & Điểm ngữ pháp cần nhớ</span>
                  </h4>
                  <p className="text-xs text-[#243447] dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                    {selectedSupplementaryLesson.grammarPoints}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <button
                type="button"
                onClick={() => setSelectedSupplementaryLesson(null)}
                className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Đóng
              </button>

              <button
                type="button"
                disabled={isCompletingSupplementary}
                onClick={() => handleCompleteSupplementaryLesson(selectedSupplementaryLesson)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-black shadow-md shadow-[#E85D3F]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check size={16} />
                <span>
                  {isCompletingSupplementary
                    ? 'Đang ghi nhận...'
                    : `Hoàn thành bài học (+${selectedSupplementaryLesson.xp || 50} XP)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
