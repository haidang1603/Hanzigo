import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Compass, 
  BarChart3, 
  Calendar,
  CheckCircle2,
  Play,
  BookOpen,
  Search,
  Filter,
  Volume2,
  Star,
  Trophy,
  ChevronRight,
  AlertCircle,
  Lock,
  Check,
  FileText,
  Flame,
  Award,
  Layers,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  RotateCw,
  X,
  Unlock,
  ShieldCheck,
  Mic,
  PenTool,
  Headphones,
  MessageSquare
} from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';
import LearningJourneyMap from '../components/learning/LearningJourneyMap';
import InteractiveLessonPlayer from '../components/learning/InteractiveLessonPlayer';
import BossChallengeModal from '../components/learning/BossChallengeModal';
import PlacementTestModal from '../components/learning/PlacementTestModal';
import DailyMissionsModal from '../components/learning/DailyMissionsModal';
import SkillMasteryCard from '../components/learning/SkillMasteryCard';
import { 
  getAllLevels, 
  getLevelById, 
  getChaptersByLevel, 
  getLessonsByChapter, 
  getLessonById, 
  getUserJourneyProgress, 
  getResumeLesson,
  getLessonNodeStatus,
  isBossUnlocked,
  getBossChallengeByChapter,
  getChapterMaterials,
  getRecommendedNextLesson,
  getRecommendedReviewLessons,
  syncUserJourneyProgressFromCloud
} from '../services/learningPathService';
import { 
  getStudentSupplementaryLessons, 
  completeCustomLesson 
} from '../services/customLessonService';
import { supabase, isSupabaseConfigured } from '../supabase/config';
import AiContextBadge from '../components/personalization/AiContextBadge.jsx';
import HskAdvancedModule from '../features/curriculum/HskAdvancedModule.tsx';

const LOCAL_FREE_EXPLORE_KEY = 'hanzigo_roadmap_free_explore_v1';

const TOOL_META = {
  pronunciation: {
    label: 'Phát âm',
    icon: Mic,
    tab: 'pronunciation',
    hash: '#pronunciation/record',
    color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  },
  writing: {
    label: 'Viết chữ',
    icon: PenTool,
    tab: 'writing',
    hash: '#writing',
    color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  },
  grammar: {
    label: 'Ngữ pháp',
    icon: Sparkles,
    tab: 'grammar',
    hash: '#grammar',
    color: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
  },
  reading: {
    label: 'Đọc hiểu',
    icon: BookOpen,
    tab: 'reader',
    hash: '#reader/studio',
    color: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800',
  },
  listening: {
    label: 'Luyện nghe',
    icon: Headphones,
    tab: 'listening',
    hash: '#listening',
    color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
  },
  roleplay: {
    label: 'Hội thoại AI',
    icon: MessageSquare,
    tab: 'conversation',
    hash: '#conversation/roleplay',
    color: 'text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
  },
  exam: {
    label: 'Thi thử HSK',
    icon: Trophy,
    tab: 'hsk',
    hash: '#hsk',
    color: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  },
};

const CBT_STAGE_META = {
  1: { paperCode: 'H10901', questionCount: 40, durationMinutes: 40, passScore: 120, maxScore: 200, unlockTargetScore: 160, hskkRequired: null },
  2: { paperCode: 'H20901', questionCount: 60, durationMinutes: 55, passScore: 120, maxScore: 200, unlockTargetScore: 160, hskkRequired: null },
  3: { paperCode: 'H30901', questionCount: 80, durationMinutes: 90, passScore: 180, maxScore: 300, unlockTargetScore: 230, hskkRequired: 'HSKK Sơ cấp' },
  4: { paperCode: 'H40901', questionCount: 100, durationMinutes: 105, passScore: 180, maxScore: 300, unlockTargetScore: 230, hskkRequired: 'HSKK Trung cấp' },
  5: { paperCode: 'H50901', questionCount: 100, durationMinutes: 125, passScore: 180, maxScore: 300, unlockTargetScore: 230, hskkRequired: 'HSKK Trung/Cao cấp' },
  6: { paperCode: 'H60901', questionCount: 101, durationMinutes: 140, passScore: 180, maxScore: 300, unlockTargetScore: 230, hskkRequired: 'HSKK Cao cấp' },
};

const TOOL_CYCLE = ['pronunciation', 'writing', 'grammar', 'reading', 'listening', 'roleplay', 'exam'];

export default function RoadmapPage({ 
  user, 
  setActiveTab, 
  initialLessonId = null, 
  onClearInitialLesson = null, 
  onAddXp,
  onSelectWriting = null,
  onSelectPronounce = null
}) {
  // View mode switcher: 'journey' (Interactive Map) | 'syllabus' (Structured List) | 'skills' (Mastery Radar)
  const [curriculumBand, setCurriculumBand] = useState('foundation'); // 'foundation' (HSK 1-6) | 'advanced' (HSK 7-9)
  const [roadmapView, setRoadmapView] = useState('journey');
  const [activeLessonToPlay, setActiveLessonToPlay] = useState(null);
  const [activeBossChallenge, setActiveBossChallenge] = useState(null);
  const [showPlacementTest, setShowPlacementTest] = useState(false);
  const [showDailyMissions, setShowDailyMissions] = useState(false);
  const [journeyVersion, setJourneyVersion] = useState(0);

  // Syllabus list view states
  const [selectedLevelId, setSelectedLevelId] = useState('lvl-1');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');
  const [syllabusSearchTerm, setSyllabusSearchTerm] = useState('');
  const [syllabusStatusFilter, setSyllabusStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed' | 'boss'
  const [selectedMaterialModal, setSelectedMaterialModal] = useState(null);
  const [freeExploreUnlocked, setFreeExploreUnlocked] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_FREE_EXPLORE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [bestCbtScores, setBestCbtScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });

  const toggleFreeExplore = useCallback(() => {
    setFreeExploreUnlocked(prev => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_FREE_EXPLORE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadBestCbtScores() {
      if (!isSupabaseConfigured || !supabase || !(user?.id || user?.uid)) return;
      try {
        const uid = user.id || user.uid;
        const { data: attempts } = await supabase
          .from('hsk_attempts')
          .select('hsk_level, total_score')
          .eq('user_id', uid)
          .order('total_score', { ascending: false });
        if (attempts && attempts.length > 0 && mounted) {
          const scoreMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
          for (const row of attempts) {
            const lvl = Number(row.hsk_level);
            const sc = Number(row.total_score) || 0;
            if (lvl >= 1 && lvl <= 6 && sc > scoreMap[lvl]) {
              scoreMap[lvl] = sc;
            }
          }
          setBestCbtScores(scoreMap);
        }
      } catch {
        // Ignore offline/table errors
      }
    }
    loadBestCbtScores();
    return () => { mounted = false; };
  }, [user]);

  // Supplementary / Custom Lessons State
  const [supplementaryLessons, setSupplementaryLessons] = useState([]);
  const [isLoadingSupplementary, setIsLoadingSupplementary] = useState(false);
  const [supplementarySearch, setSupplementarySearch] = useState('');
  const [supplementaryLevelFilter, setSupplementaryLevelFilter] = useState('all');
  const [selectedSupplementaryLesson, setSelectedSupplementaryLesson] = useState(null);
  const [isCompletingSupplementary, setIsCompletingSupplementary] = useState(false);

  // Load supplementary lessons from Supabase (student-safe, non-hidden only)
  const loadSupplementaryLessons = useCallback(async () => {
    setIsLoadingSupplementary(true);
    try {
      const items = await getStudentSupplementaryLessons();
      setSupplementaryLessons(Array.isArray(items) ? items : []);
    } catch (err) {
      console.warn('Load supplementary lessons notice:', err);
    } finally {
      setIsLoadingSupplementary(false);
    }
  }, []);

  // Fetch supplementary lessons on mount and subscribe to Realtime + CustomEvent
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
      } catch (err) {
        console.warn('Realtime lessons subscription notice:', err);
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

  // Filtered supplementary lessons
  const filteredSupplementaryLessons = useMemo(() => {
    return supplementaryLessons.filter(l => {
      if (l.isHidden || l.is_hidden) return false;
      const matchSearch = !supplementarySearch.trim() ||
        (l.title && l.title.toLowerCase().includes(supplementarySearch.toLowerCase())) ||
        (l.description && l.description.toLowerCase().includes(supplementarySearch.toLowerCase()));
      const matchLevel = supplementaryLevelFilter === 'all' ||
        (l.level && l.level.toLowerCase().replace(/\s+/g, '') === supplementaryLevelFilter.toLowerCase().replace(/\s+/g, ''));
      return matchSearch && matchLevel;
    });
  }, [supplementaryLessons, supplementarySearch, supplementaryLevelFilter]);

  // Handler for opening a supplementary lesson
  const handleOpenSupplementaryLesson = (lesson) => {
    playClickSound();
    if (lesson?.step1_objectives && lesson?.step2_vocabulary) {
      setActiveLessonToPlay(lesson);
    } else {
      setSelectedSupplementaryLesson(lesson);
    }
  };

  // Handler for completing a supplementary lesson
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
        showToast(`🎉 Chúc mừng! Bạn đã hoàn thành "${lesson.title}" (+${res.xpAwarded} XP)`);
        setJourneyVersion(v => v + 1);
        setSelectedSupplementaryLesson(null);
      }
    } catch (err) {
      console.error('Complete custom lesson error:', err);
      playErrorSound();
      showToast(err.message || 'Lỗi khi ghi nhận hoàn thành bài học.');
    } finally {
      setIsCompletingSupplementary(false);
    }
  };

  // Toast notification state
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Hydrate cross-device progress from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    if (user?.id || user?.uid) {
      syncUserJourneyProgressFromCloud(user).then((res) => {
        if (res && isMounted) {
          setJourneyVersion(v => v + 1);
        }
      });
    }
    return () => { isMounted = false; };
  }, [user]);

  // Compute live user journey progress
  const progress = useMemo(() => {
    return getUserJourneyProgress(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, journeyVersion]);

  const resumeInfo = useMemo(() => {
    return getResumeLesson(progress);
  }, [progress]);

  const recommendedNext = useMemo(() => {
    return getRecommendedNextLesson(user);
  }, [user, journeyVersion]);

  const recommendedReview = useMemo(() => {
    return getRecommendedReviewLessons(user, 1);
  }, [user, journeyVersion]);

  const levels = useMemo(() => getAllLevels(), []);
  const selectedLevel = useMemo(() => getLevelById(selectedLevelId), [selectedLevelId]);
  const chaptersForSelectedLevel = useMemo(() => getChaptersByLevel(selectedLevelId), [selectedLevelId]);

  // Overall Statistics across all levels
  const overallStats = useMemo(() => {
    const completedLessonIds = Object.keys(progress.completedLessons || {});
    const totalCompleted = completedLessonIds.length;
    let totalMastered = 0;
    completedLessonIds.forEach(id => {
      if (progress.completedLessons[id]?.stars >= 3) {
        totalMastered++;
      }
    });

    const totalBossDefeated = Object.keys(progress.completedBosses || {}).length;
    const unlockedLevel = progress.unlockedLevelNumber || 1;

    // Total curriculum lessons estimate (24 chapters * 5 lessons = 120 lessons)
    const totalCurriculumLessons = 120;
    const completionPercent = Math.min(100, Math.round((totalCompleted / totalCurriculumLessons) * 100));

    return {
      totalCompleted,
      totalMastered,
      totalBossDefeated,
      unlockedLevel,
      completionPercent,
      totalCurriculumLessons
    };
  }, [progress]);

  // If navigated from Home or Dashboard with a specific initial lesson id, open it directly
  useEffect(() => {
    if (initialLessonId) {
      const target = getLessonById(initialLessonId);
      if (target) {
        setActiveLessonToPlay(target);
      }
      if (onClearInitialLesson) {
        onClearInitialLesson();
      }
    }
  }, [initialLessonId, onClearInitialLesson]);

  // Sync selected level to user unlocked level on first load
  useEffect(() => {
    if (progress.unlockedLevelNumber) {
      setSelectedLevelId(`lvl-${Math.min(6, progress.unlockedLevelNumber)}`);
    }
  }, [progress.unlockedLevelNumber]);

  // =========================================================================
  // 1. IMMERSIVE LESSON VIEW: Fullscreen interactive player
  // =========================================================================
  if (activeLessonToPlay) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FFF9F2] dark:bg-[#131B24] animate-in fade-in duration-200">
        <InteractiveLessonPlayer
          lesson={activeLessonToPlay}
          user={user}
          onClose={() => {
            setActiveLessonToPlay(null);
            setJourneyVersion(v => v + 1);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onBack={() => {
            setActiveLessonToPlay(null);
            setJourneyVersion(v => v + 1);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
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
            if (onAddXp) onAddXp(0);
            setJourneyVersion(v => v + 1);
          }}
          onNextLesson={(nextId) => {
            const next = getLessonById(nextId);
            if (next) {
              setActiveLessonToPlay(next);
            } else {
              setActiveLessonToPlay(null);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#131B24] py-6 sm:py-8 transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10">
            <CheckCircle2 size={16} className="text-[#45B97C]" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Band Switcher: Foundation-Intermediate (HSK 1-6) vs Advanced Band (HSK 7-9) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurriculumBand('foundation')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                curriculumBand === 'foundation'
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'text-[#5B6B7F] dark:text-gray-300 hover:bg-[#FAF6F0] dark:hover:bg-[#0F172A]'
              }`}
            >
              Foundation-Intermediate (HSK 1–6)
            </button>
            <button
              type="button"
              onClick={() => setCurriculumBand('advanced')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                curriculumBand === 'advanced'
                  ? 'bg-[#243447] text-amber-300 shadow-xs'
                  : 'text-[#5B6B7F] dark:text-gray-300 hover:bg-[#FAF6F0] dark:hover:bg-[#0F172A]'
              }`}
            >
              Advanced Professional Band (HSK 7–9 · 三等九级)
            </button>
          </div>
          <span className="text-[11px] font-semibold text-[#748092] dark:text-gray-400 px-2">
            Chuẩn năng lực Hán ngữ Quốc tế (3 Bậc · 9 Cấp)
          </span>
        </div>

        {curriculumBand === 'advanced' ? (
          <HskAdvancedModule
            user={user}
            onSwitchToFoundation={() => setCurriculumBand('foundation')}
          />
        ) : (
          <>

        {/* ========================================================== */}
        {/* 1. HERO BANNER: ASIAN-MODERN PORTAL & LIVE KPIS */}
        {/* ========================================================== */}
        <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] text-white shadow-2xl border border-white/5">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#E85D3F]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15 shadow-xs">
                <Sparkles size={14} className="text-amber-400" />
                <span>Khung Chuẩn HSK 3.0 Mới • Bản Đồ Học Tập Độc Quyền</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-['Noto_Serif_SC'] leading-tight">
                Lộ Trình Học HSK Toàn Diện
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Khám phá 24 chương học theo chuẩn Khảo thí Quốc gia, tích lũy từ vựng phản xạ, 
                chinh phục 12 Boss thực chiến và tự tin vượt qua các kỳ thi HSK 1 đến HSK 6.
              </p>

              {/* 4 Realtime KPI Pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-white/10 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-emerald-400" />
                  <span>Trình độ: <strong>HSK {overallStats.unlockedLevel}</strong></span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white/10 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-400" />
                  <span>Đã xong: <strong>{overallStats.totalCompleted}</strong> / {overallStats.totalCurriculumLessons} bài ({overallStats.completionPercent}%)</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white/10 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-amber-300">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span>Thành thạo 3★: <strong>{overallStats.totalMastered}</strong> bài</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white/10 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-rose-300">
                  <Trophy size={14} className="text-rose-400" />
                  <span>Hạ gục Boss: <strong>{overallStats.totalBossDefeated}</strong> / 12</span>
                </div>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
              {resumeInfo?.lesson && (
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveLessonToPlay(resumeInfo.lesson);
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#f06e52] hover:to-[#db4f33] text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Học tiếp bài {resumeInfo.lesson.lessonNumber} ngay</span>
                </button>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    playClickSound();
                    setShowPlacementTest(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <Compass size={14} className="text-amber-400" />
                  <span>Xếp lớp HSK</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setShowDailyMissions(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <Calendar size={14} className="text-emerald-400" />
                  <span>Nhiệm vụ ngày</span>
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Calligraphy Watermark */}
          <div className="absolute right-4 -bottom-6 font-['Noto_Serif_SC'] text-8xl sm:text-9xl font-black text-white/5 select-none pointer-events-none">
            学海无涯
          </div>
        </div>

        {/* 1.5 ADAPTIVE ROADMAP AI RECOMMENDATION BANNER */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-orange-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#E85D3F] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Lão Sư Đề xuất bước tiếp theo</span>
              </span>
              <AiContextBadge type="ai_pedagogy" size="xs" />
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                • Bạn luôn có quyền tự do lựa chọn bất kỳ bài học nào trên bản đồ
              </span>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                {recommendedNext?.title}
              </h3>
              {recommendedReview[0] && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  (Bài cần ôn lại: {recommendedReview[0].title || recommendedReview[0].lessonId})
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {recommendedNext?.reason}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {recommendedReview[0] && (
              <button
                onClick={() => {
                  playClickSound();
                  const target = getLessonById(recommendedReview[0].lessonId);
                  if (target) setActiveLessonToPlay(target);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Ôn bài {recommendedReview[0].lessonId}
              </button>
            )}
            <button
              onClick={() => {
                playClickSound();
                const target = getLessonById(recommendedNext?.lessonId);
                if (target) setActiveLessonToPlay(target);
              }}
              className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={13} fill="currentColor" />
              <span>Học bài đề xuất ({recommendedNext?.lessonId})</span>
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. SUB-NAVIGATION VIEW SELECTOR (3 CHẾ ĐỘ XEM) */}
        {/* ========================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
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
              <span>Giáo trình & Khung HSK (Syllabus)</span>
            </button>

            <button
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
                style={{ width: `${Math.max(5, overallStats.completionPercent)}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[#E85D3F]">{overallStats.completionPercent}%</span>
          </div>
        </div>

        {/* ========================================================== */}
        {/* VIEW 1: 🗺️ JOURNEY MAP (Default interactive HSK roadmap) */}
        {/* ========================================================== */}
        {roadmapView === 'journey' && (
          <LearningJourneyMap
            key={journeyVersion}
            user={user}
            onSelectLesson={(lesson) => {
              setActiveLessonToPlay(lesson);
            }}
            onOpenBoss={(boss) => setActiveBossChallenge(boss)}
            onOpenPlacementTest={() => setShowPlacementTest(true)}
            onOpenDailyMissions={() => setShowDailyMissions(true)}
            onOpenSkills={() => setRoadmapView('skills')}
            onLockedClick={(lesson) => {
              playErrorSound();
              showToast(`🔒 Bài học "${lesson.title}" đang khóa. Hoàn thành bài trước hoặc làm bài Xếp lớp để mở khóa!`);
            }}
          />
        )}

        {/* ========================================================== */}
        {/* VIEW 2: 📋 SYLLABUS LIST VIEW (Structured curriculum catalog) */}
        {/* ========================================================== */}
        {roadmapView === 'syllabus' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Level Selector Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                  Chọn cấp độ HSK 1–6 (hoặc bật mở khóa tự do để ôn thi vượt cấp):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    toggleFreeExplore();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    freeExploreUnlocked
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  {freeExploreUnlocked ? <Unlock size={13} /> : <Lock size={13} />}
                  <span>{freeExploreUnlocked ? 'Đang mở khóa tự do' : 'Chế độ tuần tự & vượt cấp'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {levels.map(lvl => {
                  const isSelected = selectedLevelId === lvl.id;
                  const prevCbtMeta = CBT_STAGE_META[lvl.levelNumber - 1];
                  const unlockedByPrevCbt = lvl.levelNumber > 1 && prevCbtMeta && (bestCbtScores[lvl.levelNumber - 1] || 0) >= prevCbtMeta.passScore;
                  const isLevelLocked = !freeExploreUnlocked && !unlockedByPrevCbt && lvl.levelNumber > (progress.unlockedLevelNumber || 1);

                  // Calculate level-specific completed lessons
                  const lvlChapters = getChaptersByLevel(lvl.id);
                  const lvlLessons = lvlChapters.flatMap(c => getLessonsByChapter(c.id));
                  const lvlDone = lvlLessons.filter(l => Boolean(progress.completedLessons?.[l.id])).length;
                  const lvlPercent = lvlLessons.length > 0 ? Math.round((lvlDone / lvlLessons.length) * 100) : 0;

                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedLevelId(lvl.id);
                        setSelectedChapterFilter('all');
                      }}
                      className={`px-4 py-3 rounded-2xl border transition-all text-left flex items-center gap-3 shrink-0 cursor-pointer ${
                        isSelected
                          ? 'border-[#E85D3F] bg-white dark:bg-[#1E293B] shadow-md ring-2 ring-[#E85D3F]/20 text-[#243447] dark:text-white'
                          : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/70 dark:bg-[#1E293B]/60 hover:border-[#E85D3F]/50 text-[#748092] dark:text-[#94A3B8]'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{lvl.icon}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black uppercase" style={{ color: isSelected ? '#E85D3F' : undefined }}>
                            {lvl.code}
                          </span>
                          {isLevelLocked ? (
                            <Lock size={12} className="text-[#748092]" />
                          ) : (
                            <span className="text-[10px] text-[#45B97C] font-semibold">● Mở</span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
                          {lvlDone}/{lvlLessons.length} bài ({lvlPercent}%)
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Level Summary Card */}
              {selectedLevel && (() => {
                const cbtMeta = CBT_STAGE_META[selectedLevel.levelNumber] || CBT_STAGE_META[1];
                const bestScore = bestCbtScores[selectedLevel.levelNumber] || 0;
                const isCbtPassed = bestScore >= cbtMeta.passScore;
                return (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg"
                          style={{ backgroundColor: `${selectedLevel.color}15`, color: selectedLevel.color }}
                        >
                          {selectedLevel.code} • {selectedLevel.chineseName}
                        </span>
                        <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-medium">
                          {selectedLevel.hskStage}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white flex items-center gap-2">
                        <span>{selectedLevel.icon}</span>
                        <span>{selectedLevel.code}: {selectedLevel.name}</span>
                      </h2>

                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
                        {selectedLevel.description || selectedLevel.tagline}
                      </p>

                      {selectedLevel.syllabus5Pillars && (
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <div className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
                            <span className="text-[#748092]">Mục tiêu từ: </span>
                            <strong className="font-black text-[#E85D3F]">{selectedLevel.syllabus5Pillars.vocabularyTarget}</strong>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
                            <span className="text-[#748092]">Ngữ pháp: </span>
                            <strong className="font-black text-[#3B82F6]">{selectedLevel.syllabus5Pillars.grammarTarget} điểm</strong>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
                            <span className="text-[#748092]">Chữ Hán: </span>
                            <strong className="font-black text-[#45B97C]">{selectedLevel.syllabus5Pillars.hanziTarget} chữ</strong>
                          </div>
                        </div>
                      )}

                      <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            window.location.hash = `#materials?level=${selectedLevel.code}`;
                            if (setActiveTab) setActiveTab('materials');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] border border-[#E85D3F]/30 text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer"
                        >
                          <BookOpen size={13} />
                          <span>📚 Thư viện tài nguyên & Giáo trình {selectedLevel.code}</span>
                        </button>
                      </div>
                    </div>

                    {/* CBT Gatekeeper Box */}
                    <div className="w-full lg:w-[390px] p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3 shrink-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          <ShieldCheck size={15} />
                          <span>Cổng Thi Vượt Cấp CBT ({cbtMeta.paperCode})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isCbtPassed
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {isCbtPassed ? `Đã đạt (${bestScore}/${cbtMeta.maxScore}đ)` : `Cần ≥ ${cbtMeta.passScore}/${cbtMeta.maxScore}đ`}
                        </span>
                      </div>

                      <div className="text-xs text-[#5C6672] dark:text-[#CBD5E1] space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Cấu trúc chuẩn:</span>
                          <strong className="text-[#243447] dark:text-white">{cbtMeta.questionCount} câu / {cbtMeta.durationMinutes} phút</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Mục tiêu mở khóa xuất sắc:</span>
                          <strong className="text-[#E85D3F]">≥ {cbtMeta.unlockTargetScore}/{cbtMeta.maxScore} điểm</strong>
                        </div>
                        {cbtMeta.hskkRequired && (
                          <div className="flex items-center justify-between">
                            <span>Thi nói đi kèm:</span>
                            <strong className="text-purple-600 dark:text-purple-300">{cbtMeta.hskkRequired}</strong>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            window.location.hash = `#hsk?level=${selectedLevel.levelNumber}`;
                            if (setActiveTab) setActiveTab('hsk');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs hover:opacity-95 transition cursor-pointer"
                        >
                          <Trophy size={13} />
                          <span>Thi vượt cấp {selectedLevel.code}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            window.location.hash = `#vocabulary?level=${selectedLevel.levelNumber}`;
                            if (setActiveTab) setActiveTab('vocabulary');
                          }}
                          className="py-2 px-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold hover:border-[#E85D3F] transition cursor-pointer"
                        >
                          Ôn từ SRS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  placeholder="Tìm bài học theo chủ đề, từ vựng hoặc mã bài..."
                  value={syllabusSearchTerm}
                  onChange={(e) => setSyllabusSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
                {syllabusSearchTerm && (
                  <button
                    onClick={() => setSyllabusSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#748092] hover:text-[#243447]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'pending', label: '⏳ Cần học' },
                  { id: 'completed', label: '✅ Đã xong' },
                  { id: 'boss', label: '🐉 Boss thực chiến' }
                ].map(flt => (
                  <button
                    key={flt.id}
                    onClick={() => {
                      playClickSound();
                      setSyllabusStatusFilter(flt.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      syllabusStatusFilter === flt.id
                        ? 'bg-[#E85D3F] text-white shadow-xs'
                        : 'bg-white dark:bg-[#1E293B] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447]'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter Sub-Filter Tabs */}
            {chaptersForSelectedLevel.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedChapterFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedChapterFilter === 'all'
                      ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-xs'
                      : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  Tất cả {chaptersForSelectedLevel.length} chặng
                </button>
                {chaptersForSelectedLevel.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedChapterFilter(ch.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedChapterFilter === ch.id
                        ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-xs'
                        : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white'
                    }`}
                  >
                    Chặng {selectedLevel?.levelNumber || 1}.{idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Chapters & Lessons Detailed List */}
            <div className="space-y-6">
              {chaptersForSelectedLevel
                .filter(ch => selectedChapterFilter === 'all' || ch.id === selectedChapterFilter)
                .map(chapter => {
                const chapterLessons = getLessonsByChapter(chapter.id);
                const bossChallenge = getBossChallengeByChapter(chapter.id);
                const bossUnlocked = isBossUnlocked(chapter.id, progress);
                const bossBeaten = bossChallenge && Boolean(progress.completedBosses?.[bossChallenge.id]);
                const chapterMaterials = getChapterMaterials(chapter.id);

                // Filter lessons based on search and status
                const filteredLessons = chapterLessons.filter(lesson => {
                  const status = getLessonNodeStatus(lesson.id, progress);
                  const isCompleted = status === 'completed' || status === 'mastered';

                  // Search match
                  if (syllabusSearchTerm) {
                    const term = syllabusSearchTerm.toLowerCase().trim();
                    const matchTitle = lesson.title?.toLowerCase().includes(term);
                    const matchSubtitle = lesson.subtitle?.toLowerCase().includes(term);
                    const matchCn = lesson.chineseTitle?.toLowerCase().includes(term);
                    if (!matchTitle && !matchSubtitle && !matchCn) return false;
                  }

                  // Status filter
                  if (syllabusStatusFilter === 'pending') return !isCompleted;
                  if (syllabusStatusFilter === 'completed') return isCompleted;
                  if (syllabusStatusFilter === 'boss') return false; // Handled in boss section

                  return true;
                });

                if (syllabusStatusFilter === 'boss' && !bossChallenge) return null;

                return (
                  <div 
                    key={chapter.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4"
                  >
                    {/* Chapter Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#E85D3F]/20">
                            {chapter.moduleCode ? `Module ${chapter.moduleCode}` : `Chương ${chapter.chapterNumber}`}
                          </span>
                          {chapter.unitTitle && (
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {chapter.unitTitle}
                            </span>
                          )}
                          <span className="text-xs font-bold text-[#748092]">{chapter.chineseTitle}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#243447] dark:text-white">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                          {chapter.desc}
                        </p>
                      </div>

                      {/* Verified Materials Button if available */}
                      {chapterMaterials.length > 0 && (
                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                          {chapterMaterials.slice(0, 2).map(mat => (
                            <button
                              key={mat.id}
                              onClick={() => setSelectedMaterialModal(mat)}
                              className="px-2.5 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px] font-medium text-[#748092] hover:text-[#E85D3F] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <FileText size={12} className="text-[#E85D3F]" />
                              <span className="max-w-[130px] truncate">{mat.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lessons Grid / Table */}
                    {syllabusStatusFilter !== 'boss' && (
                      <div className="space-y-2.5">
                        {filteredLessons.length === 0 ? (
                          <div className="p-4 text-center text-xs text-[#748092]">
                            Không tìm thấy bài học phù hợp với bộ lọc trong chương này.
                          </div>
                        ) : (
                          filteredLessons.map(lesson => {
                            const status = getLessonNodeStatus(lesson.id, progress);
                            const isLocked = !freeExploreUnlocked && status === 'locked';
                            const isMastered = status === 'mastered';
                            const isCompleted = status === 'completed' || isMastered;
                            const toolKey = lesson.focusTool || TOOL_CYCLE[(Number(lesson.lessonNumber) || 1) % TOOL_CYCLE.length];
                            const toolInfo = TOOL_META[toolKey] || TOOL_META.reading;
                            const ToolIcon = toolInfo.icon;

                            return (
                              <div
                                key={lesson.id}
                                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                  isMastered
                                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                                    : isCompleted
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                                    : isLocked
                                    ? 'bg-gray-50/60 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-75'
                                    : 'bg-white dark:bg-[#1A2433] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Node Icon */}
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                    isMastered
                                      ? 'bg-amber-400 text-amber-950'
                                      : isCompleted
                                      ? 'bg-[#45B97C] text-white'
                                      : isLocked
                                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                                      : 'bg-[#FFF5F2] text-[#E85D3F] border border-[#E85D3F]/30'
                                  }`}>
                                    {isLocked ? <Lock size={14} /> : isCompleted ? <Check size={16} strokeWidth={3} /> : lesson.lessonNumber}
                                  </div>

                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">
                                        Bài {lesson.lessonNumber}: {lesson.title}
                                      </h4>
                                      {lesson.chineseTitle && (
                                        <button
                                          type="button"
                                          onClick={() => speakChinese(lesson.chineseTitle)}
                                          className="text-xs text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
                                          title="Nghe phát âm tiêu đề tiếng Trung"
                                        >
                                          <Volume2 size={12} />
                                          <span className="font-medium font-['Noto_Serif_SC']">{lesson.chineseTitle}</span>
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] line-clamp-1">
                                      {lesson.subtitle || lesson.objective}
                                    </p>
                                  </div>
                                </div>

                                {/* Status & Play Button */}
                                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                  {isMastered ? (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-bold text-[10px] flex items-center gap-1">
                                      <Star size={10} fill="currentColor" />
                                      <span>3★ Thành thạo</span>
                                    </span>
                                  ) : isCompleted ? (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                      ✓ Đã hoàn thành
                                    </span>
                                  ) : isLocked ? (
                                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold text-[10px]">
                                      Chưa mở khóa
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold text-[10px]">
                                      Sẵn sàng học
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      playClickSound();
                                      if (typeof window !== 'undefined' && toolInfo.hash) {
                                        window.location.hash = toolInfo.hash;
                                      }
                                      if (setActiveTab) setActiveTab(toolInfo.tab);
                                    }}
                                    title={`Mở công cụ luyện tập: ${toolInfo.label}`}
                                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 hover:brightness-95 ${toolInfo.color}`}
                                  >
                                    <ToolIcon size={12} />
                                    <span className="hidden md:inline">{toolInfo.label}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      playClickSound();
                                      window.location.hash = `#materials?lesson=${lesson.id}`;
                                      if (setActiveTab) setActiveTab('materials');
                                    }}
                                    title="Xem tài liệu học tập bổ trợ cho bài này trong Thư viện"
                                    className="p-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer text-xs flex items-center gap-1"
                                  >
                                    <FileText size={13} className="text-[#E85D3F]" />
                                    <span className="hidden sm:inline text-[11px] font-bold">Tài liệu</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (isLocked) {
                                        playErrorSound();
                                        showToast(`🔒 Bài học "${lesson.title}" đang khóa. Hoàn thành bài trước hoặc làm bài Xếp lớp để mở khóa!`);
                                        return;
                                      }
                                      playClickSound();
                                      setActiveLessonToPlay(lesson);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                                      isLocked
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white shadow-xs'
                                    }`}
                                  >
                                    <span>{isCompleted ? 'Ôn lại' : 'Vào học'}</span>
                                    <ChevronRight size={13} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}

                    {/* Chapter Boss Challenge Node */}
                    {bossChallenge && (syllabusStatusFilter === 'all' || syllabusStatusFilter === 'boss') && (
                      <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
                            bossBeaten
                              ? 'bg-amber-400 text-white'
                              : bossUnlocked
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                          }`}>
                            {bossBeaten ? '🏆' : bossChallenge.bossAvatar || '🐉'}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                                {bossBeaten ? 'ĐÃ HẠ GỤC' : 'BOSS BATTLE'}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">
                                {bossChallenge.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                              {bossUnlocked 
                                ? `Sẵn sàng khiêu chiến thử thách sinh tồn 5 ải (+${bossChallenge.xpReward || 200} XP)` 
                                : 'Hoàn thành tất cả các bài trong chương để mở đài khiêu chiến Boss'}
                            </p>
                          </div>
                        </div>

                        <button
                          disabled={!bossUnlocked}
                          onClick={() => {
                            playClickSound();
                            setActiveBossChallenge(bossChallenge);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap self-end sm:self-center cursor-pointer ${
                            bossBeaten
                              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                              : bossUnlocked
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/25'
                              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Trophy size={14} />
                          <span>{bossBeaten ? 'Khiêu chiến lại' : 'Vào đấu Boss'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 3: 📊 REAL SKILL MASTERY & DAILY MISSIONS */}
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
                  onClick={() => { playClickSound(); setShowDailyMissions(true); }}
                  className="w-full py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Mở bảng nhiệm vụ ngày</span>
                </button>
              </div>

              {/* Placement Test Promo Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#243447] to-[#131B24] text-white shadow-sm space-y-4 text-center border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                  🧭
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">
                    Kiểm tra xếp lớp HSK
                  </h3>
                  <p className="text-xs text-slate-300">
                    Đã có kiến thức tiếng Trung từ trước? Làm bài khảo hạch 15 câu để mở khóa cấp độ ngay.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { playClickSound(); setShowPlacementTest(true); }}
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
        {/* VIEW 4: 📚 SUPPLEMENTARY / CUSTOM LESSONS */}
        {/* ========================================================== */}
        {roadmapView === 'supplementary' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
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
                  <RotateCw size={16} className={isLoadingSupplementary ? 'animate-spin text-[#E85D3F]' : ''} />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingSupplementary && (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#E85D3F] border-t-transparent animate-spin" />
                <p className="text-sm font-bold text-[#748092]">Đang tải bài học mở rộng từ máy chủ...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingSupplementary && filteredSupplementaryLessons.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                <BookOpen size={40} className="mx-auto text-gray-400" />
                <h4 className="text-base font-bold text-[#243447] dark:text-white">Không tìm thấy bài học mở rộng nào</h4>
                <p className="text-xs text-[#748092]">
                  {supplementarySearch || supplementaryLevelFilter !== 'all'
                    ? 'Thử thay đổi từ khóa hoặc bộ lọc cấp độ HSK.'
                    : 'Các bài học mở rộng mới nhất từ giáo viên sẽ hiển thị tại đây khi được xuất bản.'}
                </p>
              </div>
            )}

            {/* Lessons Grid */}
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
                        <span className="text-xs text-[#748092]">Thời lượng: {l.duration} phút</span>
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
          </>
        )}

      </div>

      {/* ========================================================== */}
      {/* MODAL 2: BOSS CHALLENGE ROLEPLAY BATTLE */}
      {/* ========================================================== */}
      {activeBossChallenge && (
        <BossChallengeModal
          bossChallenge={activeBossChallenge}
          user={user}
          onClose={() => setActiveBossChallenge(null)}
          onVictory={(score) => {
            playSuccessSound();
            showToast(`🐉 Chiến thắng vang dội! Bạn đã hạ gục Boss với ${score} điểm!`);
            if (onAddXp) onAddXp(activeBossChallenge.xpReward || 200);
            setJourneyVersion(v => v + 1);
          }}
        />
      )}

      {/* ========================================================== */}
      {/* MODAL 3: DIAGNOSTIC PLACEMENT TEST */}
      {/* ========================================================== */}
      {showPlacementTest && (
        <PlacementTestModal
          user={user}
          onClose={() => setShowPlacementTest(false)}
          onComplete={(result) => {
            playSuccessSound();
            showToast(`🎉 Xếp lớp thành công! Trình độ đề xuất: ${result.levelTitle || result.badge || 'Level ' + result.recommendedLevel}`);
            if (onAddXp) onAddXp(0);
            setJourneyVersion(v => v + 1);
          }}
        />
      )}

      {/* ========================================================== */}
      {/* MODAL 4: DAILY MISSIONS & STREAK REWARDS */}
      {/* ========================================================== */}
      {showDailyMissions && (
        <DailyMissionsModal
          user={user}
          onClose={() => setShowDailyMissions(false)}
          onAddXp={onAddXp}
        />
      )}

      {/* ========================================================== */}
      {/* MODAL 5: VERIFIED MATERIAL PREVIEW MODAL */}
      {/* ========================================================== */}
      {selectedMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#E85D3F]/20">
                  {selectedMaterialModal.category || 'Tài liệu chuẩn'} • {selectedMaterialModal.level || 'HSK'}
                </span>
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  {selectedMaterialModal.title}
                </h3>
                <p className="text-xs text-[#748092]">
                  {selectedMaterialModal.author} ({selectedMaterialModal.publisher})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMaterialModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#748092] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              {selectedMaterialModal.description || 'Tài liệu giáo dục trích dẫn học thuật phục vụ người học HanziGo.'}
            </p>

            {selectedMaterialModal.verificationNotes && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                ✓ <strong>Thẩm định:</strong> {selectedMaterialModal.verificationNotes}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedMaterialModal(null);
                  window.location.hash = `#materials?level=${selectedMaterialModal.level || 'HSK 1'}`;
                  if (setActiveTab) setActiveTab('materials');
                }}
                className="px-3 py-2 rounded-xl border border-[#E85D3F]/40 bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <BookOpen size={13} />
                <span>Vào Thư viện tài nguyên</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMaterialModal(null)}
                className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] cursor-pointer"
              >
                Đóng
              </button>
              {selectedMaterialModal.downloadUrl || selectedMaterialModal.sourceUrl ? (
                <a
                  href={selectedMaterialModal.downloadUrl || selectedMaterialModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <span>Mở tài liệu (Tab mới)</span>
                  <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 6: SUPPLEMENTARY LESSON VIEWER MODAL */}
      {/* ========================================================== */}
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
                  <span className="text-xs text-[#748092]">
                    ⏱️ {selectedSupplementaryLesson.duration || 20} phút
                  </span>
                  <span className="text-xs font-bold text-[#E85D3F]">
                    +{selectedSupplementaryLesson.xp || 50} XP
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
                <h4 className="text-xs font-bold uppercase text-[#748092] mb-1">Mô tả tóm tắt</h4>
                <p className="text-sm text-[#243447] dark:text-slate-200 leading-relaxed font-medium">
                  {selectedSupplementaryLesson.description || 'Chuyên đề học tập bổ trợ củng cố kiến thức thực hành.'}
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

              {/* Completion status info box */}
              {Boolean(progress?.completedLessons?.[selectedSupplementaryLesson.id]) ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Bạn đã hoàn thành bài học này và tích lũy +{selectedSupplementaryLesson.xp || 50} XP!</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
                  <Award size={18} className="text-amber-600 shrink-0" />
                  <span>Đọc kỹ kiến thức trên và bấm nút xác nhận bên dưới để nhận <strong>+{selectedSupplementaryLesson.xp || 50} XP</strong> vào tài khoản học viên.</span>
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#f06e52] hover:to-[#db4f33] text-white text-xs font-black shadow-md shadow-[#E85D3F]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check size={16} />
                <span>
                  {isCompletingSupplementary
                    ? 'Đang ghi nhận...'
                    : progress?.completedLessons?.[selectedSupplementaryLesson.id]
                      ? 'Học lại & Ghi nhận ôn tập'
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
