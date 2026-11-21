// File: src/pages/LessonPage.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  PenTool,
  MessageSquare,
  CheckCircle2,
  Volume2,
  BookmarkPlus,
  BookmarkCheck,
  Play,
  Eye,
  EyeOff,
  Award,
  Layers,
  Trophy,
  HelpCircle,
  Languages,
  FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  buildSynthesizedLessonDetail,
  ALL_180_LESSONS,
} from '@/features/curriculum/lessonContentSynthesizer';
import {
  playClickSound,
  playSuccessSound,
  speakChinese as speakChineseAudio,
} from '../utils/audio';

const LOCAL_ROADMAP_PROGRESS_KEY = 'hanzigo_roadmap_120_progress_v1';

const AST_ROLE_STYLES = {
  S: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300',
  V: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
  O: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
  Keyword:
    'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-200 font-bold',
  Complement:
    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
  Particle:
    'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
};

function resolveNumericLessonId(raw) {
  if (raw === null || raw === undefined || raw === '') return 1;
  const trimmed = String(raw).trim();
  const byCanonical = ALL_180_LESSONS.find(
    (item) => item.canonicalId === trimmed || item.stringId === trimmed
  );
  if (byCanonical) return byCanonical.id;

  const prefixed = trimmed.match(/^(?:lesson[-_]?|hsk79-)?(\d{1,3})$/i);
  const num = prefixed ? Number(prefixed[1]) : Number(trimmed);
  if (!Number.isFinite(num) || num < 1) return 1;
  if (num > 180) return 180;
  return Math.floor(num);
}

function parseLessonIdFromUrl(fallbackId = null) {
  if (typeof window === 'undefined') return resolveNumericLessonId(fallbackId);
  // Hỗ trợ cả ?id=121 trên search params lẫn #lesson?id=121 trên Hash Router (từ 1..180 và l-101..hsk79-180)
  const searchParams = new URLSearchParams(window.location.search);
  const hashQuery = window.location.hash.includes('?')
    ? window.location.hash.split('?')[1]
    : '';
  const hashParams = new URLSearchParams(hashQuery);
  const raw = hashParams.get('id') || searchParams.get('id') || fallbackId;
  return resolveNumericLessonId(raw);
}

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
    // Ignore
  }
  return [1, 2, 3];
}

export default function LessonPage({
  setActiveTab: setGlobalAppTab,
  initialLessonId = null,
  onClearInitialLesson = null,
  onAddXp = null,
}) {
  const [currentLessonId, setCurrentLessonId] = useState(() =>
    parseLessonIdFromUrl(initialLessonId)
  );
  const [activeTab, setActiveTab] = useState('vocab');
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [dbDictRows, setDbDictRows] = useState([]);
  const [dbGrammarRow, setDbGrammarRow] = useState(null);
  const [savedWordsSet, setSavedWordsSet] = useState(() => new Set());
  const [toastMsg, setToastMsg] = useState(null);

  const [completedLessonIds, setCompletedLessonIds] = useState(readInitialCompletedIds);

  const isLessonCompleted = completedLessonIds.includes(currentLessonId);

  // State cho Tab Luyện viết HanziWriter
  const writerContainerRef = useRef(null);
  const writerInstanceRef = useRef(null);
  const [activeCharIdx, setActiveCharIdx] = useState(0);
  const [writingMode, setWritingMode] = useState('guided');
  const [strokeMistakes, setStrokeMistakes] = useState(0);
  const [charScoresMap, setCharScoresMap] = useState({});
  const [writingBanner, setWritingBanner] = useState(
    'Hãy viết theo đúng thứ tự nét trên ô Mễ tự cách'
  );

  // State cho Tab Hội thoại
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // State cho Tab Xưởng Dịch Thuật 3 Tầng (HSK 7 - 9: Bài 121 - 180)
  const [userTranslationInput, setUserTranslationInput] = useState('');
  const [isComposingIme, setIsComposingIme] = useState(false);
  const [translationEvaluated, setTranslationEvaluated] = useState(false);
  const [translationScores, setTranslationScores] = useState(null);

  // State cho Tab Kiểm tra cuối bài
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState({});
  const [reorderedTokens, setReorderedTokens] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const showToast = useCallback((text) => {
    setToastMsg(text);
    setTimeout(() => {
      setToastMsg((prev) => (prev === text ? null : prev));
    }, 3000);
  }, []);

  const speakChinese = useCallback((text) => {
    if (typeof window === 'undefined') return;
    speakChineseAudio(text);
  }, []);

  // Đồng bộ initialLessonId nếu được điều hướng từ Dashboard / Materials / CommandPalette
  useEffect(() => {
    if (!initialLessonId) return;
    setCurrentLessonId(resolveNumericLessonId(initialLessonId));
    if (onClearInitialLesson) onClearInitialLesson();
  }, [initialLessonId, onClearInitialLesson]);

  // Lắng nghe thay đổi hash URL (#lesson?id=...)
  useEffect(() => {
    const onHashChange = () => {
      setCurrentLessonId(parseLessonIdFromUrl());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const baseMeta =
      ALL_180_LESSONS.find((l) => l.id === currentLessonId) || ALL_180_LESSONS[0];

    setShowPinyin(baseMeta.level <= 2);
    setActiveCharIdx(0);
    setSelectedMcqAnswers({});
    setReorderedTokens([]);
    setQuizSubmitted(false);
    setUserTranslationInput('');
    setTranslationEvaluated(false);
    setTranslationScores(null);
    setActiveTab((prev) => (prev === 'translation' && baseMeta.level < 7 ? 'vocab' : prev));

    async function fetchLessonSupabaseData() {
      if (!supabase) {
        if (isMounted) setIsLoadingDb(false);
        return;
      }
      setIsLoadingDb(true);
      try {
        const [dictRes, gramRes, authRes] = await Promise.all([
          supabase
            .from('dictionary_entries')
            .select('*')
            .in('simplified', baseMeta.keyVocab),
          supabase
            .from('grammar_points')
            .select('*')
            .eq('code', baseMeta.grammarCode)
            .maybeSingle(),
          supabase.auth.getUser(),
        ]);

        if (!isMounted) return;
        setDbDictRows(dictRes.data || []);
        setDbGrammarRow(gramRes.data || null);

        const user = authRes.data?.user;
        if (user) {
          const { data: userVocab } = await supabase
            .from('user_vocab_items')
            .select('simplified')
            .eq('user_id', user.id)
            .in('simplified', baseMeta.keyVocab);

          if (userVocab && isMounted) {
            setSavedWordsSet(new Set(userVocab.map((r) => r.simplified)));
          }
        }
      } catch {
        // Fallback offline
      } finally {
        if (isMounted) setIsLoadingDb(false);
      }
    }

    fetchLessonSupabaseData();
    return () => {
      isMounted = false;
    };
  }, [currentLessonId]);

  const lessonData = useMemo(
    () => buildSynthesizedLessonDetail(currentLessonId, dbDictRows, dbGrammarRow),
    [currentLessonId, dbDictRows, dbGrammarRow]
  );

  const {
    lessonMeta,
    stageMeta,
    vocabularyList,
    grammarDetail,
    dialogueLines,
    translationDrill,
    essayBlueprint,
    masteryQuizzes,
    uniqueCharacters,
  } = lessonData;

  const isAdvancedHsk7to9 = lessonMeta.level >= 7;
  const activeHanziChar = uniqueCharacters[activeCharIdx] || uniqueCharacters[0] || '汉';

  // Mount HanziWriter với cleanup chống rò rỉ bộ nhớ
  useEffect(() => {
    if (activeTab !== 'writing' || !writerContainerRef.current) return;

    let isCancelled = false;
    const container = writerContainerRef.current;
    container.innerHTML = '';
    setStrokeMistakes(0);
    setWritingBanner(`Đang luyện chữ “${activeHanziChar}” — Hãy viết đúng quy tắc bút thuận`);

    async function mountHanziWriter() {
      try {
        const { default: HanziWriter } = await import('hanzi-writer');
        if (isCancelled || !writerContainerRef.current) return;

        const writer = HanziWriter.create(writerContainerRef.current, activeHanziChar, {
          width: 260,
          height: 260,
          padding: 18,
          showOutline: writingMode === 'guided',
          strokeAnimationSpeed: 1.25,
          delayBetweenStrokes: 160,
          strokeColor: '#E85D3F',
          radicalColor: '#45B97C',
          outlineColor: 'rgba(148, 163, 184, 0.35)',
          drawingColor: '#E85D3F',
          drawingWidth: 20,
          showHintAfterMisses: 2,
        });

        writerInstanceRef.current = writer;

        let sessionMistakes = 0;
        writer.quiz({
          onMistake: (strokeData) => {
            if (isCancelled) return;
            sessionMistakes += 1;
            setStrokeMistakes(sessionMistakes);
            setWritingBanner(
              `Sai nét số ${strokeData.strokeNum + 1}! Còn ${strokeData.strokesRemaining} nét.`
            );
          },
          onCorrectStroke: (strokeData) => {
            if (isCancelled) return;
            setWritingBanner(
              `Chuẩn xác nét ${strokeData.strokeNum + 1}! Còn ${strokeData.strokesRemaining} nét.`
            );
          },
          onComplete: async (summary) => {
            if (isCancelled) return;
            const accuracy = Math.max(40, Math.round(100 - summary.totalMistakes * 12));
            setCharScoresMap((prev) => ({ ...prev, [activeHanziChar]: accuracy }));
            setWritingBanner(
              `Hoàn thành chữ “${activeHanziChar}” — Độ chính xác bút thuận: ${accuracy}%!`
            );
          },
        });
      } catch {
        if (!isCancelled) {
          setWritingBanner('Không thể tải khung luyện viết.');
        }
      }
    }

    mountHanziWriter();
    return () => {
      isCancelled = true;
      try {
        writerInstanceRef.current?.cancelQuiz?.();
        writerInstanceRef.current?.pauseAnimation?.();
      } catch {
        // Ignore cleanup error
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [activeTab, activeHanziChar, writingMode]);

  const handleSaveWordToWorkspace = async (vocabItem) => {
    playClickSound();
    try {
      if (!supabase?.auth) {
        setSavedWordsSet((prev) => new Set([...prev, vocabItem.simplified]));
        showToast(`Đã lưu tạm “${vocabItem.simplified}” trên thiết bị`);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSavedWordsSet((prev) => new Set([...prev, vocabItem.simplified]));
        showToast(`Đã lưu tạm “${vocabItem.simplified}” trên thiết bị`);
        return;
      }

      const contextPayload = [
        {
          source_type: 'reading',
          source_id: `lesson_${lessonMeta.id}`,
          sentence_zh: vocabItem.exampleZh,
          sentence_pinyin: vocabItem.examplePinyin,
          sentence_vi: vocabItem.exampleVi,
        },
      ];

      const { error } = await supabase.from('user_vocab_items').upsert(
        {
          user_id: user.id,
          simplified: vocabItem.simplified,
          pinyin: vocabItem.pinyin,
          han_viet: vocabItem.hanViet,
          meaning_vi: vocabItem.meaningVi,
          hsk_level: lessonMeta.level,
          personal_mnemonic: vocabItem.mnemonicVi,
          source_context: contextPayload,
          meaning_mastery: 35,
        },
        { onConflict: 'user_id,simplified' }
      );

      if (!error) {
        setSavedWordsSet((prev) => new Set([...prev, vocabItem.simplified]));
        showToast(`Đã lưu “${vocabItem.simplified}” vào Vocabulary Workspace!`);
      }
    } catch {
      showToast('Đã lưu vào hàng đợi đồng bộ ngoại tuyến.');
    }
  };

  // Chấm điểm bản dịch Trung - Việt (Tín - Đạt - Nhã) cho HSK 7-9
  const handleEvaluateTranslation = () => {
    playClickSound();
    if (!translationDrill) return;
    const cleanInput = userTranslationInput.trim();
    if (cleanInput.length < 6) {
      showToast('Vui lòng nhập bản dịch tiếng Trung hoàn chỉnh trước khi chấm điểm.');
      return;
    }

    const usedKeywords = translationDrill.requiredKeywords.filter((kw) =>
      cleanInput.includes(kw)
    );
    const keywordRatio =
      usedKeywords.length / Math.max(1, translationDrill.requiredKeywords.length);

    // Kiểm tra có sử dụng hư từ văn viết / thành ngữ bậc cao không
    const literaryMarkers = ['鉴于', '实乃', '之', '其', '与', '而非', '毋宁', '尚且', '诚然'];
    const hasLiteraryStyle = literaryMarkers.some((m) => cleanInput.includes(m));

    const xinScore = Math.min(100, Math.round(65 + keywordRatio * 35)); // Tín (Độ chính xác ý)
    const daScore = Math.min(
      100,
      Math.round(70 + (cleanInput.endsWith('。') ? 15 : 5) + keywordRatio * 15)
    ); // Đạt (Trật tự câu)
    const yaScore = Math.min(
      100,
      Math.round(60 + keywordRatio * 25 + (hasLiteraryStyle ? 15 : 0))
    ); // Nhã (Văn phong học thuật HSK 7-9)
    const overall = Math.round(xinScore * 0.4 + daScore * 0.3 + yaScore * 0.3);

    setTranslationScores({
      xinScore,
      daScore,
      yaScore,
      overall,
      usedKeywords,
    });
    setTranslationEvaluated(true);
    playSuccessSound();
    showToast(`Đã chấm bản dịch: Đạt ${overall}/100 điểm theo chuẩn Tín - Đạt - Nhã!`);
  };

  const markLessonAsCompleted = useCallback(async () => {
    playSuccessSound();
    const isFirstTime = !completedLessonIds.includes(currentLessonId);

    setCompletedLessonIds((prev) => {
      const next = prev.includes(currentLessonId) ? prev : [...prev, currentLessonId];
      try {
        const existingRaw = localStorage.getItem(LOCAL_ROADMAP_PROGRESS_KEY);
        const existingObj = existingRaw ? JSON.parse(existingRaw) : {};
        const safeExisting =
          existingObj && typeof existingObj === 'object' ? existingObj : {};
        const canonicalKey =
          lessonMeta.canonicalId || lessonMeta.stringId || `lesson-${currentLessonId}`;
        const existingCompletedLessons =
          safeExisting.completedLessons && typeof safeExisting.completedLessons === 'object'
            ? safeExisting.completedLessons
            : {};

        localStorage.setItem(
          LOCAL_ROADMAP_PROGRESS_KEY,
          JSON.stringify({
            ...safeExisting,
            completedIds: next,
            completedLessons: {
              ...existingCompletedLessons,
              [canonicalKey]: {
                score: 100,
                stars: 3,
                completedAt: new Date().toISOString(),
              },
            },
            updatedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore
      }
      return next;
    });

    if (isFirstTime && onAddXp) {
      onAddXp(lessonMeta.xpReward || 50);
    }

    try {
      const { default: confetti } = await import('canvas-confetti');
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
    } catch {
      // Ignore
    }

    showToast(`🎉 Chúc mừng! Bạn đã hoàn thành Bài #${currentLessonId}: ${lessonMeta.zh}`);
  }, [
    completedLessonIds,
    currentLessonId,
    lessonMeta.canonicalId,
    lessonMeta.stringId,
    lessonMeta.xpReward,
    lessonMeta.zh,
    onAddXp,
    showToast,
  ]);

  const quizScoreSummary = useMemo(() => {
    let correctCount = 0;
    for (const q of masteryQuizzes) {
      if (q.type === 'multiple_choice') {
        if (selectedMcqAnswers[q.id] === q.correctIndex) correctCount += 1;
      } else if (q.type === 'reorder') {
        if (reorderedTokens.join('') === q.correctAnswer) correctCount += 1;
      }
    }
    const pct = Math.round((correctCount / masteryQuizzes.length) * 100);
    return {
      correctCount,
      total: masteryQuizzes.length,
      pct,
      passed: pct >= 75,
    };
  }, [masteryQuizzes, selectedMcqAnswers, reorderedTokens]);

  const goToLesson = (targetId) => {
    playClickSound();
    const clamped = Math.max(1, Math.min(180, targetId));
    setCurrentLessonId(clamped);
    window.location.hash = `#lesson?id=${clamped}&level=${
      ALL_180_LESSONS.find((l) => l.id === clamped)?.level || 1
    }`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackToRoadmap = () => {
    playClickSound();
    window.location.hash = '#roadmap';
    if (typeof setGlobalAppTab === 'function') {
      setGlobalAppTab('roadmap');
    }
  };

  // Danh sách Tab linh hoạt (5 Tab cho HSK 1-6, 6 Tab cho HSK 7-9 có thêm Xưởng Dịch Thuật 3 Tầng)
  const navTabs = useMemo(() => {
    const base = [
      { id: 'vocab', label: `1. Từ vựng (${vocabularyList.length})`, icon: BookOpen },
      { id: 'grammar', label: '2. Ngữ pháp AST', icon: Sparkles },
      { id: 'writing', label: `3. Luyện viết (${uniqueCharacters.length})`, icon: PenTool },
      { id: 'dialogue', label: '4. Hội thoại & Bài khóa', icon: MessageSquare },
    ];
    if (isAdvancedHsk7to9) {
      base.push({
        id: 'translation',
        label: '5. Xưởng Dịch 3 Tầng & Luận văn',
        icon: Languages,
      });
      base.push({
        id: 'quiz',
        label: `6. Kiểm tra (${masteryQuizzes.length} câu)`,
        icon: Trophy,
      });
    } else {
      base.push({
        id: 'quiz',
        label: `5. Kiểm tra (${masteryQuizzes.length} câu)`,
        icon: Trophy,
      });
    }
    return base;
  }, [isAdvancedHsk7to9, vocabularyList.length, uniqueCharacters.length, masteryQuizzes.length]);

  return (
    <div className="min-h-dvh bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-[#F3F4F6] py-6 sm:py-8 transition-colors duration-200">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#45B97C]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1. HEADER HERO CARD */}
        <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] text-white shadow-lg border border-white/5 p-3.5 sm:p-7">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-[#E85D3F]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 sm:space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBackToRoadmap}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>Quay lại Bản đồ 180 bài (HSK 1–9)</span>
              </button>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={currentLessonId <= 1}
                  onClick={() => goToLesson(currentLessonId - 1)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 disabled:opacity-40 hover:bg-white/20 text-xs font-bold text-white cursor-pointer shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Bài #{currentLessonId - 1}</span>
                </button>

                <select
                  id="lesson-selector"
                  name="lessonSelector"
                  aria-label="Chọn bài học HSK 1 đến 9"
                  value={currentLessonId}
                  onChange={(e) => goToLesson(Number(e.target.value))}
                  className="order-first sm:order-none w-full sm:w-auto min-w-0 sm:max-w-xs px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-base sm:text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400 truncate cursor-pointer"
                >
                  {ALL_180_LESSONS.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="bg-[#1E293B] text-white"
                    >
                      HSK {item.level} • Bài #{String(item.id).padStart(2, '0')}: {item.zh}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={currentLessonId >= 180}
                  onClick={() => goToLesson(currentLessonId + 1)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 disabled:opacity-40 hover:bg-white/20 text-xs font-bold text-white cursor-pointer shrink-0 ml-auto sm:ml-0"
                >
                  <span>Bài #{currentLessonId + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5 pt-0.5 sm:pt-1">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${stageMeta.badgeBg}`}
                  >
                    HSK {lessonMeta.level} • Bài #{String(lessonMeta.id).padStart(2, '0')} / 180
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-300 font-medium">
                    {lessonMeta.moduleTitle}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-semibold">
                    📐 {lessonMeta.grammarCode}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-4xl font-black text-white tracking-wide font-['Noto_Serif_SC']">
                    {lessonMeta.zh}
                  </h1>
                  <span className="text-base sm:text-xl font-semibold text-amber-300">
                    /{lessonMeta.pinyin}/
                  </span>
                  <button
                    type="button"
                    onClick={() => speakChinese(lessonMeta.zh)}
                    className="p-2 rounded-xl bg-white/15 text-amber-300 hover:bg-white/25 transition cursor-pointer"
                    title="Nghe phát âm tiêu đề bài học"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm sm:text-base text-slate-200 font-medium">
                  {lessonMeta.vi}
                </p>
              </div>

              <button
                type="button"
                onClick={markLessonAsCompleted}
                className={`self-start lg:self-center flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                  isLessonCompleted
                    ? 'bg-[#45B97C]/25 border-[#45B97C]/60 text-emerald-200'
                    : 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white border-[#E85D3F] hover:opacity-95 shadow-lg'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isLessonCompleted
                    ? 'Đã hoàn thành bài học này'
                    : 'Đánh dấu hoàn thành bài học'}
                </span>
              </button>
            </div>
          </div>

          <div className="absolute right-4 -bottom-6 font-['Noto_Serif_SC'] text-8xl sm:text-9xl font-black text-white/5 select-none pointer-events-none">
            汉字
          </div>
        </header>

        {/* SUB-NAV LESSON TABS */}
        <nav
          className={`grid grid-cols-2 ${
            isAdvancedHsk7to9 ? 'sm:grid-cols-6' : 'sm:grid-cols-5'
          } gap-2`}
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                  isActive
                    ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-md shadow-[#E85D3F]/25'
                    : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:border-[#E85D3F]/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 2. BODY NỘI DUNG TỪNG TAB */}
        <main className="space-y-6">
          {isLoadingDb && (
            <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-medium text-[#748092] dark:text-slate-300 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[#E85D3F] border-t-transparent rounded-full animate-spin" />
              <span>Đang đồng bộ dữ liệu từ Supabase...</span>
            </div>
          )}

          {/* TAB 1: TỪ VỰNG */}
          {activeTab === 'vocab' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vocabularyList.map((item) => {
                const isSaved = savedWordsSet.has(item.simplified);
                return (
                  <div
                    key={item.simplified}
                    className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/60 shadow-xs transition flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                              {item.simplified}
                            </span>
                            <button
                              type="button"
                              onClick={() => speakChinese(item.simplified)}
                              className="p-1.5 rounded-lg bg-[#FFF5F2] dark:bg-slate-800 text-[#E85D3F] hover:brightness-95 transition cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <span className="px-2 py-0.5 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300 text-xs font-bold uppercase">
                              {item.pos}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-sm font-bold text-[#E85D3F]">
                              /{item.pinyin}/
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-bold uppercase">
                              Hán Việt: {item.hanViet}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveWordToWorkspace(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                            isSaved
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                              : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 hover:border-[#E85D3F]'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5" />
                              <span>Đã lưu SRS</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5" />
                              <span>Lưu từ</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-sm font-bold text-[#243447] dark:text-slate-100">
                        Nghĩa: {item.meaningVi}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 font-bold">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-[#E85D3F]" />
                            Bộ thủ: {item.radical}
                          </span>
                          <span className="text-[#748092] dark:text-slate-400">
                            {item.strokeCount} nét
                          </span>
                        </div>
                        <p className="text-[#5B6B7F] dark:text-slate-300 leading-relaxed">
                          {item.mnemonicVi}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                          {item.exampleZh}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakChinese(item.exampleZh)}
                          className="text-[#E85D3F] font-bold hover:underline shrink-0 cursor-pointer"
                        >
                          Nghe câu
                        </button>
                      </div>
                      {showPinyin && (
                        <div className="text-[#E85D3F] font-medium">{item.examplePinyin}</div>
                      )}
                      <div className="text-[#748092] dark:text-slate-400">{item.exampleVi}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: NGỮ PHÁP AST */}
          {activeTab === 'grammar' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-extrabold">
                  Mã điểm ngữ pháp: {grammarDetail.code}
                </span>
                <span className="text-xs text-[#748092] dark:text-slate-400 font-semibold">
                  {grammarDetail.category}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                {grammarDetail.titleVi}
              </h2>

              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center gap-2">
                {(Array.isArray(grammarDetail.formulaTokens)
                  ? grammarDetail.formulaTokens
                  : []
                ).map((tok, i, arr) => (
                  <React.Fragment key={i}>
                    <div
                      className={`px-3.5 py-2 rounded-xl border text-xs ${
                        AST_ROLE_STYLES[tok.role] || AST_ROLE_STYLES.Particle
                      }`}
                    >
                      <div className="font-bold text-sm font-['Noto_Serif_SC']">
                        {tok.label_zh}
                      </div>
                      <div className="text-[11px] opacity-85 mt-0.5">{tok.label_vi}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-[#748092] font-extrabold text-base">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#E85D3F]">
                  Giải thích & Quy tắc ứng dụng trong đề thi HSK {lessonMeta.level}
                </h3>
                <p className="text-sm text-[#243447] dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {grammarDetail.explanationVi}
                </p>
              </div>

              {Array.isArray(grammarDetail.commonMistakes) &&
                grammarDetail.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2 text-xs sm:text-sm"
                  >
                    <div className="text-rose-600 dark:text-rose-400 line-through font-medium">
                      {mistake.wrong_zh}
                    </div>
                    <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                      {mistake.right_zh}
                    </div>
                    <div className="text-xs text-[#E85D3F] font-semibold">
                      {mistake.pinyin}
                    </div>
                    <div className="text-xs text-[#5B6B7F] dark:text-slate-300">
                      {mistake.meaning_vi}
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
                      💡 <strong>Phân tích lý do sai:</strong> {mistake.reason_vi}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 3: LUYỆN VIẾT CHỮ HÁN (touch-action: none cho Mobile) */}
          {activeTab === 'writing' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
                <h2 className="text-base font-bold text-[#243447] dark:text-white">
                  Danh sách Hán tự Bài #{lessonMeta.id} ({uniqueCharacters.length} chữ)
                </h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {uniqueCharacters.map((ch, idx) => {
                    const score = charScoresMap[ch];
                    const isCurrent = idx === activeCharIdx;
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setActiveCharIdx(idx);
                        }}
                        className={`h-14 rounded-2xl font-bold text-2xl font-['Noto_Serif_SC'] border transition flex flex-col items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-md'
                            : score
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                            : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 hover:border-[#E85D3F]/50'
                        }`}
                      >
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-black text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                      Chữ: {activeHanziChar}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-300">
                      Lỗi nét: {strokeMistakes}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setWritingMode((m) => (m === 'guided' ? 'recall' : 'guided'))
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-slate-200 cursor-pointer"
                  >
                    {writingMode === 'guided' ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-[#E85D3F]" />
                        <span>Có bóng mờ</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                        <span>Tự nhớ mặt chữ</span>
                      </>
                    )}
                  </button>
                </div>

                <div
                  style={{ touchAction: 'none' }}
                  className="touch-none overscroll-contain relative w-[260px] h-[260px] rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-[#E85D3F]/40 shadow-inner overflow-hidden select-none"
                >
                  <div ref={writerContainerRef} className="relative z-10 w-full h-full" />
                </div>

                <p className="text-xs font-bold text-center text-[#5B6B7F] dark:text-slate-200">
                  {writingBanner}
                </p>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => writerInstanceRef.current?.animateCharacter()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-[#E85D3F]/40 text-[#E85D3F] text-xs font-bold cursor-pointer hover:brightness-95"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Xem mẫu bút thuận</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HỘI THOẠI & BÀI KHÓA */}
          {activeTab === 'dialogue' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                  {isAdvancedHsk7to9 ? 'Tọa đàm Học thuật:' : 'Hội thoại ứng dụng:'} 《
                  {lessonMeta.zh}》
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPinyin((v) => !v)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#E85D3F] cursor-pointer"
                  >
                    {showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTranslation((v) => !v)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-emerald-700 dark:text-emerald-300 cursor-pointer"
                  >
                    {showTranslation ? 'Ẩn dịch nghĩa' : 'Hiện dịch nghĩa'}
                  </button>
                </div>
              </div>

              {dialogueLines.map((line, index) => (
                <div
                  key={index}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-[#E85D3F] border border-[#E85D3F]/25 text-xs font-bold">
                        {line.speaker}
                      </span>
                      <span className="text-[11px] text-[#748092] dark:text-slate-400 font-medium">
                        {line.role}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                      {line.zh}
                    </p>
                    {showPinyin && (
                      <p className="text-xs sm:text-sm text-[#E85D3F] font-medium">
                        {line.pinyin}
                      </p>
                    )}
                    {showTranslation && (
                      <p className="text-xs sm:text-sm text-[#5B6B7F] dark:text-slate-300">
                        {line.vi}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => speakChinese(line.zh)}
                    className="p-2.5 rounded-xl bg-[#FFF5F2] dark:bg-slate-800 text-[#E85D3F] shrink-0 cursor-pointer hover:brightness-95"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ===================================================================
              TAB 5 (DÀNH CHO BÀI 121-180): XƯỞNG DỊCH THUẬT 3 TẦNG & LUẬN VĂN HSK 7-9
          =================================================================== */}
          {activeTab === 'translation' && isAdvancedHsk7to9 && translationDrill && (
            <div className="space-y-6">
              {/* Khối 1: Xưởng Luyện Dịch Trung ↔ Việt 3 Tầng */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-amber-300 dark:border-amber-800 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-extrabold uppercase">
                    <Languages className="w-4 h-4" />
                    <span>
                      Xưởng Dịch Thuật 3 Tầng Chuẩn HSK {lessonMeta.level} (Việt ➔ Trung)
                    </span>
                  </span>
                  <span className="text-xs text-[#748092] dark:text-slate-400 font-semibold">
                    Tiêu chuẩn chấm: Tín (40%) • Đạt (30%) • Nhã (30%)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                  <div className="text-xs font-bold uppercase text-[#748092] dark:text-slate-400">
                    Câu nguồn tiếng Việt cần dịch sang văn viết học thuật tiếng Trung:
                  </div>
                  <p className="text-base sm:text-lg font-bold text-[#243447] dark:text-white leading-relaxed">
                    “{translationDrill.sourceTextVi}”
                  </p>

                  {/* Huy hiệu các từ khóa bắt buộc sử dụng */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs text-[#748092] dark:text-slate-400 font-medium">
                      Từ khóa / Thành ngữ bắt buộc dùng:
                    </span>
                    {translationDrill.requiredKeywords.map((kw) => {
                      const isUsed = userTranslationInput.includes(kw);
                      return (
                        <span
                          key={kw}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                            isUsed
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                              : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] dark:text-amber-300'
                          }`}
                        >
                          {kw} {isUsed ? '✓ Đã dùng' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Ô nhập bản dịch có hỗ trợ bộ gõ Pinyin (isComposing) */}
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={userTranslationInput}
                    onCompositionStart={() => setIsComposingIme(true)}
                    onCompositionEnd={() => setIsComposingIme(false)}
                    onChange={(e) => setUserTranslationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        (e.ctrlKey || e.metaKey) &&
                        !e.nativeEvent?.isComposing &&
                        !isComposingIme
                      ) {
                        handleEvaluateTranslation();
                      }
                    }}
                    placeholder="Nhập bản dịch tiếng Trung của bạn tại đây (Gợi ý: Sử dụng giới từ 鉴于..., cấu trúc Tứ tự cách và các từ khóa bắt buộc ở trên)..."
                    className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-sm text-[#243447] dark:text-white placeholder:text-[#748092]"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[#748092] dark:text-slate-400">
                      Độ dài hiện tại: {userTranslationInput.trim().length} ký tự
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setUserTranslationInput(
                            translationDrill.threeTierComparison.masterHsk9Version
                              .replace(/^🏆\s*/u, '')
                              .split('（')[0]
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-xs font-bold text-[#243447] dark:text-slate-200 cursor-pointer"
                      >
                        Điền thử bản mẫu HSK 9
                      </button>

                      <button
                        type="button"
                        onClick={handleEvaluateTranslation}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-extrabold hover:opacity-95 transition shadow-md cursor-pointer"
                      >
                        Chấm điểm & Đối chiếu 3 Tầng
                      </button>
                    </div>
                  </div>
                </div>

                {/* Kết quả chấm điểm Tín - Đạt - Nhã & Bảng đối chiếu 3 tầng */}
                {translationEvaluated && translationScores && (
                  <div className="space-y-4 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                        <div className="text-[11px] text-[#748092] dark:text-slate-400">
                          Tín (Chính xác ý)
                        </div>
                        <div className="text-lg font-extrabold text-[#E85D3F]">
                          {translationScores.xinScore}/100
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                        <div className="text-[11px] text-[#748092] dark:text-slate-400">
                          Đạt (Trật tự câu)
                        </div>
                        <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
                          {translationScores.daScore}/100
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                        <div className="text-[11px] text-[#748092] dark:text-slate-400">
                          Nhã (Văn phong HSK 9)
                        </div>
                        <div className="text-lg font-extrabold text-amber-600 dark:text-amber-300">
                          {translationScores.yaScore}/100
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                        <div className="text-[11px] text-amber-700 dark:text-amber-200 font-bold">
                          Tổng điểm Dịch thuật
                        </div>
                        <div className="text-xl font-black text-[#243447] dark:text-white">
                          {translationScores.overall}/100
                        </div>
                      </div>
                    </div>

                    {/* Bảng Đối Chiếu 3 Tầng Bản Dịch */}
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm space-y-1">
                        <div className="font-bold text-rose-700 dark:text-rose-300">
                          Tầng 1 — Bẫy dịch từng chữ (Literal Word-by-Word Trap):
                        </div>
                        <div className="text-rose-900 dark:text-rose-200">
                          {translationDrill.threeTierComparison.literalTrapVersion}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs sm:text-sm space-y-1">
                        <div className="font-bold text-sky-700 dark:text-sky-300">
                          Tầng 2 — Bản dịch chuẩn ngữ pháp HSK 7:
                        </div>
                        <div className="text-sky-950 dark:text-sky-100">
                          {translationDrill.threeTierComparison.standardHsk7Version}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-xs sm:text-sm space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                            Tầng 3 — Bản dịch Đại sư HSK 9 (Tứ tự cách & Hư từ văn viết):
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              speakChinese(
                                translationDrill.threeTierComparison.masterHsk9Version
                                  .replace(/^🏆\s*/u, '')
                                  .split('（')[0]
                              )
                            }
                            className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[#243447] dark:text-white font-bold text-base font-['Noto_Serif_SC']">
                          {translationDrill.threeTierComparison.masterHsk9Version}
                        </div>
                        <div className="text-xs text-amber-800 dark:text-amber-200 pt-1">
                          💡 <strong>Bí quyết dịch thuật:</strong>{' '}
                          {translationDrill.translationTipVi}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Khối 2: Dàn ý Luận văn Học thuật / Biểu đồ Số liệu (HSK 7-9 Essay Blueprint) */}
              {essayBlueprint && (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#E85D3F]">
                      <FileText className="w-4 h-4" />
                      <span>{essayBlueprint.essayType}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#5B6B7F] dark:text-slate-300 font-semibold">
                      Mục tiêu: {essayBlueprint.targetCharCount} chữ Hán
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                    Đề bài: {essayBlueprint.titleZh}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {essayBlueprint.paragraphsOutline.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5 text-xs"
                      >
                        <div className="font-bold text-[#E85D3F]">{p.step}</div>
                        <p className="text-[#5B6B7F] dark:text-slate-300 leading-relaxed">
                          {p.guideVi}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CUỐI: BÀI TẬP KIỂM TRA MASTERY */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#E85D3F]" />
                    <span>Kiểm tra Mức độ Nắm vững Bài #{lessonMeta.id}</span>
                  </h2>
                </div>
                {quizSubmitted && (
                  <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                    Kết quả: {quizScoreSummary.correctCount}/{quizScoreSummary.total} (
                    {quizScoreSummary.pct}%)
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {masteryQuizzes.map((q, qIdx) => {
                  if (q.type === 'multiple_choice') {
                    const chosenIdx = selectedMcqAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3"
                      >
                        <div className="text-sm font-bold text-[#243447] dark:text-white">
                          Câu {qIdx + 1}: {q.prompt}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = chosenIdx === oIdx;
                            const isCorrectOption = oIdx === q.correctIndex;
                            let btnStyle =
                              'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 hover:border-[#E85D3F]/50';
                            if (quizSubmitted) {
                              if (isCorrectOption) {
                                btnStyle =
                                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold';
                              } else if (isSelected) {
                                btnStyle =
                                  'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300';
                              }
                            } else if (isSelected) {
                              btnStyle =
                                'bg-orange-50 dark:bg-orange-950/40 border-[#E85D3F] text-[#E85D3F] font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => {
                                  playClickSound();
                                  setSelectedMcqAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: oIdx,
                                  }));
                                }}
                                className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${btnStyle}`}
                              >
                                <span className="font-bold mr-1.5">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3"
                    >
                      <div className="text-sm font-bold text-[#243447] dark:text-white">
                        Câu {qIdx + 1}: {q.prompt}
                      </div>
                      <div className="min-h-[48px] p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center gap-2">
                        {reorderedTokens.map((tok, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() =>
                              setReorderedTokens((prev) =>
                                prev.filter((_, idx) => idx !== tIdx)
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#E85D3F] text-white text-xs font-extrabold cursor-pointer"
                          >
                            {tok}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {q.shuffledTokens.map((tok, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => setReorderedTokens((prev) => [...prev, tok])}
                            className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-slate-100 text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] cursor-pointer"
                          >
                            + {tok}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(true);
                      if (quizScoreSummary.passed) markLessonAsCompleted();
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-extrabold text-xs hover:opacity-95 transition shadow-md cursor-pointer"
                  >
                    Nộp bài & Chấm điểm Bài #{lessonMeta.id}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToLesson(Math.min(180, currentLessonId + 1))}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#45B97C] text-white text-xs font-extrabold cursor-pointer shadow-xs"
                  >
                    <Award className="w-4 h-4" />
                    <span>Chuyển sang Bài #{Math.min(180, currentLessonId + 1)}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
