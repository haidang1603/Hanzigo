import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  PenTool, 
  Headphones, 
  MessageSquare, 
  RotateCcw, 
  RotateCw,
  Zap, 
  Target, 
  Music, 
  Trophy, 
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Filter,
  Search,
  Check,
  HelpCircle,
  Compass,
  ExternalLink,
  GraduationCap,
  Flame,
  MapPin
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { speakChinese, playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import { evaluateRealPronunciation } from '../utils/pronunciationEvaluator';
import { awardXp } from '../utils/gamification';
import { 
  PRACTICE_LEVELS, 
  PRONUNCIATION_ITEMS_BY_LEVEL, 
  LISTENING_DRILLS_BY_LEVEL, 
  GRAMMAR_DRILLS_BY_LEVEL,
  HSK_LEVELS_METADATA
} from '../data/practiceLevelData';
import { VOCABULARY_LIST } from '../data/chineseData';
import { 
  getAllRoadmapVocabulary, 
  getRoadmapLessonsWithVocabCount, 
  getCompletedRoadmapVocabulary,
  getUserJourneyProgress
} from '../services/learningPathService';

export default function PracticePage({ 
  user = null,
  setActiveTab, 
  onSelectWriting, 
  onSelectPronounce,
  onSelectLesson
}) {
  // 1. Current Selected Level (1, 2, 3, 4)
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const activeLevel = useMemo(() => {
    return PRACTICE_LEVELS.find(l => l.level === selectedLevelId) || PRACTICE_LEVELS[0];
  }, [selectedLevelId]);

  // 2. Active Skill Practice Mode: 'pronounce' | 'listening' | 'grammar' | 'vocab'
  const [practiceSkill, setPracticeSkill] = useState('pronounce');

  // ==========================================
  // PRONUNCIATION DRILL STATE
  // ==========================================
  const levelPronounceItems = useMemo(() => {
    return PRONUNCIATION_ITEMS_BY_LEVEL.filter(item => item.level === selectedLevelId);
  }, [selectedLevelId]);

  const [selectedPronounceIndex, setSelectedPronounceIndex] = useState(0);
  const currentPronounceItem = levelPronounceItems[selectedPronounceIndex] || levelPronounceItems[0];

  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [pronounceScore, setPronounceScore] = useState(null);
  const recognitionRef = useRef(null);

  // Synchronize item index when level changes
  useEffect(() => {
    setSelectedPronounceIndex(0);
    setPronounceScore(null);
    setSpeechError(null);
  }, [selectedLevelId]);

  // Handle Speech Recognition for Pronunciation Lab
  const handleStartRecording = () => {
    playClickSound();
    setSpeechError(null);
    setPronounceScore(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Trình duyệt chưa hỗ trợ ghi âm trực tiếp. Bạn có thể nghe âm mẫu bản xứ bên dưới!');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        setIsRecording(false);
        const transcript = event.results[0][0].transcript || '';
        evaluatePronounceAttempt(transcript);
      };

      recognition.onerror = (e) => {
        setIsRecording(false);
        if (e.error === 'not-allowed') {
          setSpeechError('Micro bị chặn. Vui lòng cấp quyền truy cập Mic trên thanh địa chỉ trình duyệt.');
        } else if (e.error === 'no-speech') {
          setSpeechError('Hệ thống chưa nghe thấy âm thanh. Vui lòng lại gần mic và nói rõ ràng.');
        } else {
          setSpeechError('Lỗi thu âm: ' + e.error);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      setSpeechError('Không thể khởi động micro: ' + err.message);
    }
  };

  const handleStopRecording = () => {
    playClickSound();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const evaluatePronounceAttempt = (transcript) => {
    if (!currentPronounceItem) return;

    const result = evaluateRealPronunciation({
      targetHanzi: currentPronounceItem.hanzi,
      targetPinyin: currentPronounceItem.pinyin,
      spokenText: transcript
    });

    setPronounceScore(result);

    if (result.overall >= 80) {
      playSuccessSound();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}
      awardXp(15, null, `practice_pronounce_${currentPronounceItem.hanzi}`);
    } else {
      playClickSound();
      awardXp(5, null, `practice_pronounce_try_${currentPronounceItem.hanzi}`);
    }
  };

  // ==========================================
  // LISTENING DRILL STATE
  // ==========================================
  const levelListeningItems = useMemo(() => {
    return LISTENING_DRILLS_BY_LEVEL.filter(item => item.level === selectedLevelId);
  }, [selectedLevelId]);

  const [selectedListeningIndex, setSelectedListeningIndex] = useState(0);
  const currentListeningItem = levelListeningItems[selectedListeningIndex] || levelListeningItems[0];
  const [listeningSelectedOption, setListeningSelectedOption] = useState(null);
  const [listeningChecked, setListeningChecked] = useState(false);

  useEffect(() => {
    setSelectedListeningIndex(0);
    setListeningSelectedOption(null);
    setListeningChecked(false);
  }, [selectedLevelId]);

  const handleChooseListeningOption = (idx) => {
    if (listeningChecked) return;
    playClickSound();
    setListeningSelectedOption(idx);
    setListeningChecked(true);

    if (idx === currentListeningItem.correctIndex) {
      playSuccessSound();
      awardXp(10, null, `practice_listening_${currentListeningItem.id}`);
    } else {
      playErrorSound();
    }
  };

  const handleNextListening = () => {
    playClickSound();
    setListeningSelectedOption(null);
    setListeningChecked(false);
    if (levelListeningItems.length > 0) {
      setSelectedListeningIndex((prev) => (prev + 1) % levelListeningItems.length);
    }
  };

  // ==========================================
  // GRAMMAR DRILL STATE
  // ==========================================
  const levelGrammarItems = useMemo(() => {
    return GRAMMAR_DRILLS_BY_LEVEL.filter(item => item.level === selectedLevelId);
  }, [selectedLevelId]);

  const [selectedGrammarIndex, setSelectedGrammarIndex] = useState(0);
  const currentGrammarItem = levelGrammarItems[selectedGrammarIndex] || levelGrammarItems[0];
  const [userGrammarTokens, setUserGrammarTokens] = useState([]);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const [grammarIsCorrect, setGrammarIsCorrect] = useState(false);

  useEffect(() => {
    setSelectedGrammarIndex(0);
    setUserGrammarTokens([]);
    setGrammarChecked(false);
    setGrammarIsCorrect(false);
  }, [selectedLevelId]);

  const availableGrammarTokens = useMemo(() => {
    if (!currentGrammarItem) return [];
    // Token list minus used ones
    const usedCounts = {};
    userGrammarTokens.forEach(t => {
      usedCounts[t] = (usedCounts[t] || 0) + 1;
    });

    const result = [];
    currentGrammarItem.tokens.forEach(t => {
      if (usedCounts[t] > 0) {
        usedCounts[t]--;
      } else {
        result.push(t);
      }
    });
    return result;
  }, [currentGrammarItem, userGrammarTokens]);

  const handleAddGrammarToken = (token) => {
    if (grammarChecked) return;
    playClickSound();
    setUserGrammarTokens(prev => [...prev, token]);
  };

  const handleRemoveGrammarToken = (indexToRemove) => {
    if (grammarChecked) return;
    playClickSound();
    setUserGrammarTokens(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleCheckGrammar = () => {
    if (userGrammarTokens.length === 0 || !currentGrammarItem) return;
    playClickSound();
    setGrammarChecked(true);

    const isMatch = userGrammarTokens.join('') === currentGrammarItem.correctTokens.join('');
    setGrammarIsCorrect(isMatch);

    if (isMatch) {
      playSuccessSound();
      awardXp(12, null, `practice_grammar_${currentGrammarItem.id}`);
    } else {
      playErrorSound();
    }
  };

  const handleNextGrammar = () => {
    playClickSound();
    setUserGrammarTokens([]);
    setGrammarChecked(false);
    setGrammarIsCorrect(false);
    if (levelGrammarItems.length > 0) {
      setSelectedGrammarIndex((prev) => (prev + 1) % levelGrammarItems.length);
    }
  };

  // ==========================================
  // VOCABULARY BY HSK & ROADMAP PRACTICE STATE
  // ==========================================
  const [vocabSourceMode, setVocabSourceMode] = useState('all'); // 'all' | 'roadmap' | 'completed'
  const [selectedRoadmapLevel, setSelectedRoadmapLevel] = useState('all'); // 'all' | 'lvl-1' | 'lvl-2' | 'lvl-3'
  const [selectedRoadmapLessonId, setSelectedRoadmapLessonId] = useState('all'); // 'all' | lessonId
  const [vocabHskFilter, setVocabHskFilter] = useState('by-level'); // 'by-level' | 'all' | 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5-6'
  const [vocabSearchQuery, setVocabSearchQuery] = useState('');
  const [vocabSubMode, setVocabSubMode] = useState('cards'); // 'cards' | 'grid' | 'quiz'
  const [vocabCardIndex, setVocabCardIndex] = useState(0);
  const [vocabCardFlipped, setVocabCardFlipped] = useState(false);

  // Vocabulary Quiz State
  const [vocabQuizIndex, setVocabQuizIndex] = useState(0);
  const [vocabQuizSelectedOption, setVocabQuizSelectedOption] = useState(null);
  const [vocabQuizChecked, setVocabQuizChecked] = useState(false);
  const [vocabQuizScore, setVocabQuizScore] = useState(0);

  // 1. All pure vocabulary & characters directly extracted from the 60 Roadmap lessons
  const allRoadmapVocab = useMemo(() => {
    return getAllRoadmapVocabulary();
  }, []);

  // 2. Roadmap lessons with vocabulary counts
  const roadmapLessons = useMemo(() => {
    return getRoadmapLessonsWithVocabCount();
  }, []);

  // Filtered lessons list based on selected roadmap level
  const filteredRoadmapLessons = useMemo(() => {
    if (selectedRoadmapLevel === 'all') return roadmapLessons;
    return roadmapLessons.filter(l => l.levelId === selectedRoadmapLevel);
  }, [roadmapLessons, selectedRoadmapLevel]);

  // 3. User's completed roadmap lessons vocabulary
  const userCompletedVocab = useMemo(() => {
    return getCompletedRoadmapVocabulary(user);
  }, [user]);

  // 4. Master combined vocabulary pool (VOCABULARY_LIST + Roadmap metadata & unique characters)
  const masterVocabPool = useMemo(() => {
    const roadmapMap = new Map();
    allRoadmapVocab.forEach(rv => {
      if (!roadmapMap.has(rv.hanzi)) {
        roadmapMap.set(rv.hanzi, rv);
      }
    });

    const list = VOCABULARY_LIST.map(v => {
      let rm = roadmapMap.get(v.hanzi);
      if (!rm) {
        for (const [rHanzi, rMeta] of roadmapMap.entries()) {
          if (v.hanzi.includes(rHanzi) || rHanzi.includes(v.hanzi)) {
            rm = rMeta;
            break;
          }
        }
      }
      if (rm) {
        return {
          ...v,
          roadmapLessonId: rm.roadmapLessonId,
          roadmapLessonNumber: rm.roadmapLessonNumber,
          roadmapLessonTitle: rm.roadmapLessonTitle,
          roadmapChapterId: rm.roadmapChapterId,
          roadmapChapterTitle: rm.roadmapChapterTitle,
          roadmapLevelId: rm.roadmapLevelId,
          source: 'both'
        };
      }
      return { ...v, source: 'vocab_list' };
    });

    // Append unique characters/words from roadmap not yet in VOCABULARY_LIST
    const existingHanziSet = new Set(list.map(v => v.hanzi));
    allRoadmapVocab.forEach(rv => {
      if (!existingHanziSet.has(rv.hanzi)) {
        list.push(rv);
        existingHanziSet.add(rv.hanzi);
      }
    });

    return list;
  }, [allRoadmapVocab]);

  // Reset indices on level or filter change
  useEffect(() => {
    setVocabCardIndex(0);
    setVocabCardFlipped(false);
    setVocabQuizIndex(0);
    setVocabQuizSelectedOption(null);
    setVocabQuizChecked(false);
  }, [selectedLevelId, vocabHskFilter, vocabSourceMode, selectedRoadmapLevel, selectedRoadmapLessonId]);

  // Target HSK determined by level or manual selection
  const effectiveHskTarget = useMemo(() => {
    if (vocabHskFilter === 'by-level') {
      if (selectedLevelId === 1) return 'HSK 1';
      if (selectedLevelId === 2) return 'HSK 2';
      if (selectedLevelId === 3) return 'HSK 3';
      return 'HSK 4+';
    }
    return vocabHskFilter;
  }, [vocabHskFilter, selectedLevelId]);

  // Filtered vocabulary list
  const levelVocabItems = useMemo(() => {
    let sourcePool = masterVocabPool;

    if (vocabSourceMode === 'completed') {
      const progress = getUserJourneyProgress(user);
      const completedLessonIds = new Set(Object.keys(progress.completedLessons || {}));
      sourcePool = masterVocabPool.filter(v => v.roadmapLessonId && completedLessonIds.has(v.roadmapLessonId));
    } else if (vocabSourceMode === 'roadmap') {
      sourcePool = allRoadmapVocab;
      if (selectedRoadmapLevel !== 'all') {
        sourcePool = sourcePool.filter(v => v.roadmapLevelId === selectedRoadmapLevel);
      }
      if (selectedRoadmapLessonId !== 'all') {
        sourcePool = sourcePool.filter(v => v.roadmapLessonId === selectedRoadmapLessonId);
      }
    } else {
      // 'all': HSK level filter
      if (effectiveHskTarget !== 'all') {
        if (effectiveHskTarget === 'HSK 4+') {
          sourcePool = sourcePool.filter(v => v.level === 'HSK 4' || v.level === 'HSK 5-6' || v.level === 'HSK 5' || v.level === 'HSK 6');
        } else if (effectiveHskTarget === 'HSK 5-6') {
          sourcePool = sourcePool.filter(v => v.level === 'HSK 5-6' || v.level === 'HSK 5' || v.level === 'HSK 6');
        } else {
          sourcePool = sourcePool.filter(v => v.level === effectiveHskTarget);
        }
      }
    }

    if (!vocabSearchQuery.trim()) return sourcePool;

    const q = vocabSearchQuery.trim().toLowerCase();
    return sourcePool.filter(v => 
      (v.hanzi && v.hanzi.toLowerCase().includes(q)) ||
      (v.pinyin && v.pinyin.toLowerCase().includes(q)) ||
      (v.meaning && v.meaning.toLowerCase().includes(q)) ||
      (v.hanviet && v.hanviet.toLowerCase().includes(q)) ||
      (v.roadmapLessonTitle && v.roadmapLessonTitle.toLowerCase().includes(q))
    );
  }, [masterVocabPool, allRoadmapVocab, vocabSourceMode, selectedRoadmapLevel, selectedRoadmapLessonId, effectiveHskTarget, vocabSearchQuery, user]);

  const currentVocabCard = levelVocabItems[vocabCardIndex] || levelVocabItems[0];

  const handleNextVocabCard = () => {
    playClickSound();
    setVocabCardFlipped(false);
    if (levelVocabItems.length > 0) {
      setVocabCardIndex(prev => (prev + 1) % levelVocabItems.length);
    }
  };

  const handlePrevVocabCard = () => {
    playClickSound();
    setVocabCardFlipped(false);
    if (levelVocabItems.length > 0) {
      setVocabCardIndex(prev => (prev - 1 + levelVocabItems.length) % levelVocabItems.length);
    }
  };

  const handleRememberVocab = () => {
    if (!currentVocabCard) return;
    playSuccessSound();
    awardXp(8, null, `practice_vocab_${currentVocabCard.hanzi}`);
    handleNextVocabCard();
  };

  const handleReviewVocab = () => {
    if (!currentVocabCard) return;
    playErrorSound();
    handleNextVocabCard();
  };

  // Quiz items for the current HSK selection
  const quizCurrentCard = levelVocabItems[vocabQuizIndex] || levelVocabItems[0];
  const quizOptions = useMemo(() => {
    if (!quizCurrentCard) return [];
    const correct = quizCurrentCard.meaning;
    const others = levelVocabItems
      .filter(item => item.hanzi !== quizCurrentCard.hanzi && item.meaning !== correct)
      .map(item => item.meaning);
    if (others.length < 3) {
      const backup = VOCABULARY_LIST.filter(item => item.meaning !== correct).map(item => item.meaning);
      others.push(...backup);
    }
    const unique = Array.from(new Set(others)).slice(0, 3);
    const pos = (quizCurrentCard.hanzi.charCodeAt(0) || 0) % 4;
    const opts = [...unique];
    opts.splice(pos, 0, correct);
    return opts;
  }, [quizCurrentCard, levelVocabItems]);

  const handleSelectQuizOption = (opt) => {
    if (vocabQuizChecked || !quizCurrentCard) return;
    playClickSound();
    setVocabQuizSelectedOption(opt);
    setVocabQuizChecked(true);

    if (opt === quizCurrentCard.meaning) {
      playSuccessSound();
      setVocabQuizScore(prev => prev + 1);
      awardXp(10, null, `practice_quiz_${quizCurrentCard.hanzi}`);
    } else {
      playErrorSound();
    }
  };

  const handleNextQuizQuestion = () => {
    playClickSound();
    setVocabQuizSelectedOption(null);
    setVocabQuizChecked(false);
    if (levelVocabItems.length > 0) {
      setVocabQuizIndex(prev => (prev + 1) % levelVocabItems.length);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles size={14} />
          Trung Tâm Luyện Tập Phân Cấp Đa Kỹ Năng
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#243447] dark:text-white tracking-tight">
          Luyện Tập Tiếng Trung Theo Mức Độ
        </h1>
        <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] leading-relaxed">
          Phân chia khoa học theo 4 cấp độ từ Nhập môn đến Bậc thầy. Rèn luyện toàn diện cả 4 kỹ năng: Phát âm qua Mic, Nghe hiểu, Ghép câu ngữ pháp và Từ vựng ứng dụng.
        </p>
      </div>

      {/* 2. Four Level Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRACTICE_LEVELS.map((lvl) => {
          const isSelected = selectedLevelId === lvl.level;
          return (
            <button
              key={lvl.id}
              id={`practice-level-btn-${lvl.level}`}
              onClick={() => {
                playClickSound();
                setSelectedLevelId(lvl.level);
              }}
              className={`p-5 rounded-3xl text-left border-2 transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'border-[#E85D3F] shadow-lg shadow-[#E85D3F]/15 bg-white dark:bg-[#1E293B] scale-[1.02]'
                  : 'border-transparent bg-white/70 dark:bg-[#1E293B]/70 hover:border-black/10 dark:hover:border-white/10 hover:shadow-md'
              }`}
            >
              {/* Top Accent Strip */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5 transition-all"
                style={{ backgroundColor: lvl.color }}
              />

              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${lvl.bgLight} ${lvl.textColor}`}>
                  {lvl.code}
                </span>
                <span className="text-xs font-bold opacity-80" style={{ color: lvl.color }}>
                  {lvl.badge}
                </span>
              </div>

              <h3 className="text-sm font-black text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors leading-snug">
                {lvl.name}
              </h3>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] mt-1 line-clamp-2">
                {lvl.subtitle}
              </p>

              <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-[#748092]">
                <span>{lvl.stats.pronounceItems} bài phát âm</span>
                <span className="text-[#E85D3F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Luyện ngay <ArrowRight size={12} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Level Summary Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl border ${activeLevel.borderLight} ${activeLevel.bgLight} flex flex-wrap items-center justify-between gap-4 transition-all shadow-xs`}>
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-white shadow-xs" style={{ backgroundColor: activeLevel.color }}>
              Đang chọn: {activeLevel.badge}
            </span>
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
              {activeLevel.subtitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#243447] dark:text-[#E2E8F0] font-medium leading-relaxed">
            {activeLevel.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#748092] dark:text-[#94A3B8]">
            <span className="font-bold">Mục tiêu:</span>
            {activeLevel.targetOutcomes.map((t, idx) => (
              <span key={idx} className="bg-white/70 dark:bg-[#131B24]/70 px-2 py-0.5 rounded-md border border-black/5 dark:border-white/5">
                ✓ {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#748092] block">Độ khó</span>
            <span className="text-sm font-black" style={{ color: activeLevel.color }}>
              {activeLevel.badge}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Skills Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white dark:bg-[#1E293B] p-2 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs max-w-2xl mx-auto">
        {[
          { id: 'pronounce', label: '🎙️ Luyện Phát Âm', desc: 'Thanh điệu & Mic AI' },
          { id: 'listening', label: '🎧 Luyện Nghe Phản Xạ', desc: 'Chọn đáp án âm thanh' },
          { id: 'grammar', label: '🧩 Ghép Câu Ngữ Pháp', desc: 'Thứ tự từ trong câu' },
          { id: 'vocab', label: '📚 Từ Vựng Mẫu', desc: 'Bộ từ trọng điểm' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`practice-skill-tab-${tab.id}`}
            onClick={() => {
              playClickSound();
              setPracticeSkill(tab.id);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              practiceSkill === tab.id
                ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25 scale-[1.02]'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* MODE 1: PRONUNCIATION LAB BY LEVEL */}
      {/* ======================================================== */}
      {practiceSkill === 'pronounce' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: List of pronunciation items for this level (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="text-sm font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <span>Bài Luyện Phát Âm</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                    {levelPronounceItems.length} bài
                  </span>
                </h3>
                <p className="text-[11px] text-[#748092]">Chọn câu muốn thử thách giọng nói qua Mic</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {levelPronounceItems.map((item, index) => {
                const isSelected = selectedPronounceIndex === index;
                return (
                  <div
                    key={item.id}
                    id={`pronounce-item-${item.id}`}
                    onClick={() => {
                      playClickSound();
                      setSelectedPronounceIndex(index);
                      setPronounceScore(null);
                      setSpeechError(null);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-[#FDEEEB] dark:bg-[#2D1E1B] border-[#E85D3F] shadow-xs scale-[1.01]'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/50'
                    }`}
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white truncate">
                          {item.hanzi}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-black/5 dark:bg-white/10 text-[#748092] shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#E85D3F] truncate">
                        {item.pinyin}
                      </p>
                      <p className="text-[11px] text-[#748092] truncate">
                        {item.meaning}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <AudioButton text={item.hanzi} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Pronunciation Stage (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-lg text-center space-y-6">
            
            {/* Top Level & Category Bar */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs" style={{ backgroundColor: activeLevel.color }}>
                {activeLevel.badge}
              </span>
              <span className="text-xs font-bold text-[#748092]">
                {currentPronounceItem?.category}
              </span>
            </div>

            {/* Target Display Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFF9F2] to-white dark:from-[#131B24] dark:to-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
              <div className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl font-black text-[#243447] dark:text-white tracking-wide">
                {currentPronounceItem?.hanzi}
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl sm:text-2xl font-black text-[#E85D3F] tracking-wide">
                  {currentPronounceItem?.pinyin}
                </span>
                <AudioButton text={currentPronounceItem?.hanzi} size="md" />
              </div>
              <p className="text-sm font-semibold text-[#748092] dark:text-[#94A3B8]">
                {currentPronounceItem?.meaning}
              </p>
            </div>

            {/* Phonetic Tip */}
            {currentPronounceItem?.tip && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                  <strong>Mẹo phát âm:</strong> {currentPronounceItem.tip}
                </p>
              </div>
            )}

            {/* Error Notification */}
            {speechError && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-left flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Mic Recording CTA Button */}
            <div className="pt-2">
              <button
                id="practice-mic-toggle-btn"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 mx-auto shadow-lg transition-all active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-red-500 text-white shadow-red-500/40 animate-pulse'
                    : 'bg-[#E85D3F] hover:bg-[#D94E30] text-white shadow-[#E85D3F]/30 hover:scale-[1.02]'
                }`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isRecording ? 'Đang nghe... Nhấp để dừng' : 'Bật Micro & Luyện Nói'}</span>
              </button>
              <p className="text-[11px] text-[#748092] mt-2">
                Nói to, rõ ràng vào mic để AI thẩm âm nhận diện chính xác thanh điệu
              </p>
            </div>

            {/* Evaluation Score Card */}
            {pronounceScore && (
              <div className="p-5 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                  <div>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-500 text-white">
                      {pronounceScore.rankBadge}
                    </span>
                    <p className="text-xs text-[#243447] dark:text-white font-medium mt-1">
                      {pronounceScore.feedback}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#E85D3F] leading-none">
                      {pronounceScore.overall}
                    </span>
                    <span className="text-[10px] text-[#748092] block">Điểm</span>
                  </div>
                </div>

                {/* Score bars: Word, Tone, Fluency */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-black/5 dark:border-white/5">
                    <span className="text-[10px] text-[#748092] block">Độ chuẩn từ</span>
                    <strong className="text-emerald-600 font-black">{pronounceScore.wordScore}%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-black/5 dark:border-white/5">
                    <span className="text-[10px] text-[#748092] block">Thanh điệu</span>
                    <strong className="text-blue-600 font-black">{pronounceScore.toneScore}%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-black/5 dark:border-white/5">
                    <span className="text-[10px] text-[#748092] block">Lưu loát</span>
                    <strong className="text-purple-600 font-black">{pronounceScore.fluencyScore}%</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Quick cross-skill action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (onSelectWriting && currentPronounceItem) {
                    onSelectWriting(currentPronounceItem);
                  } else if (setActiveTab) {
                    setActiveTab('writing');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] border border-orange-200 dark:border-orange-800 text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer"
                title="Tập viết chữ này trên ô Mễ tự"
              >
                <PenTool size={13} />
                <span>Tập viết chữ này 🖌️</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (onSelectPronounce && currentPronounceItem) {
                    onSelectPronounce(currentPronounceItem);
                  } else if (setActiveTab) {
                    setActiveTab('pronunciation');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Mở Studio phát âm chuyên sâu"
              >
                <Mic size={13} />
                <span>Mở Studio phát âm 🎙️</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: LISTENING DRILL BY LEVEL */}
      {/* ======================================================== */}
      {practiceSkill === 'listening' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs" style={{ backgroundColor: activeLevel.color }}>
                {activeLevel.badge}
              </span>
              <span className="text-xs font-bold text-[#748092]">
                Câu hỏi {selectedListeningIndex + 1}/{levelListeningItems.length}
              </span>
            </div>
            <button
              onClick={() => speakChinese(currentListeningItem?.audioText, 0.85)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] hover:bg-[#FDEED3] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 size={15} />
              <span>Phát lại âm thanh</span>
            </button>
          </div>

          {/* Sound Prompt Stage */}
          <div className="p-6 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#E85D3F] text-white flex items-center justify-center mx-auto shadow-md shadow-[#E85D3F]/30 animate-pulse">
              <Headphones size={28} />
            </div>
            <p className="text-sm font-black text-[#243447] dark:text-white">
              {currentListeningItem?.question}
            </p>
            <p className="text-xs text-[#748092]">
              Bấm nút loa để nghe kỹ cách phát âm và chọn đáp án chính xác
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentListeningItem?.options.map((option, idx) => {
              const isSelected = listeningSelectedOption === idx;
              const isCorrectOption = idx === currentListeningItem.correctIndex;
              let btnStyle = 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]';

              if (listeningChecked) {
                if (isCorrectOption) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md';
                } else if (isSelected && !isCorrectOption) {
                  btnStyle = 'bg-red-500 text-white border-red-500 shadow-md';
                } else {
                  btnStyle = 'opacity-40 bg-gray-100 dark:bg-gray-800 border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  id={`listening-option-btn-${idx}`}
                  disabled={listeningChecked}
                  onClick={() => handleChooseListeningOption(idx)}
                  className={`p-4 rounded-2xl border text-sm font-black text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {listeningChecked && isCorrectOption && <CheckCircle2 size={16} />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {listeningChecked && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2 animate-in fade-in">
              <p className="text-xs text-blue-900 dark:text-blue-300 font-bold">
                💡 Giải thích: {currentListeningItem?.explanation}
              </p>
              <button
                id="listening-next-btn"
                onClick={handleNextListening}
                className="w-full py-2.5 rounded-xl bg-[#243447] text-white hover:bg-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: GRAMMAR SENTENCE BUILDER BY LEVEL */}
      {/* ======================================================== */}
      {practiceSkill === 'grammar' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
            <span className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs" style={{ backgroundColor: activeLevel.color }}>
              {activeLevel.badge}
            </span>
            <span className="text-xs font-bold text-[#748092]">
              Cấu trúc {selectedGrammarIndex + 1}/{levelGrammarItems.length}
            </span>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-base font-black text-[#243447] dark:text-white">
              {currentGrammarItem?.title}
            </h3>
            <p className="text-xs font-bold text-[#E85D3F]">
              Nghĩa: "{currentGrammarItem?.meaning}"
            </p>
          </div>

          {/* Answer Drop Area */}
          <div className="p-5 min-h-[90px] rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-center gap-2">
            {userGrammarTokens.length === 0 ? (
              <span className="text-xs text-[#748092]">Chạm vào các từ bên dưới theo thứ tự đúng</span>
            ) : (
              userGrammarTokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveGrammarToken(idx)}
                  className="px-3.5 py-2 rounded-xl bg-[#E85D3F] text-white font-['Noto_Serif_SC'] text-base font-bold shadow-xs hover:bg-red-500 transition-colors cursor-pointer"
                >
                  {tok}
                </button>
              ))
            )}
          </div>

          {/* Available Word Tokens Bank */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {availableGrammarTokens.map((tok, idx) => (
              <button
                key={idx}
                id={`grammar-token-btn-${idx}`}
                onClick={() => handleAddGrammarToken(tok)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white hover:border-[#E85D3F] hover:shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                {tok}
              </button>
            ))}
          </div>

          {/* Check and Reset Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                playClickSound();
                setUserGrammarTokens([]);
                setGrammarChecked(false);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-[#748092] hover:text-[#243447] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Xếp lại</span>
            </button>
            <button
              id="grammar-check-btn"
              disabled={userGrammarTokens.length === 0}
              onClick={handleCheckGrammar}
              className="flex-1 py-3 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-black shadow-md shadow-[#E85D3F]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Kiểm Tra Đáp Án</span>
              <CheckCircle2 size={16} />
            </button>
          </div>

          {/* Grammar Result Banner */}
          {grammarChecked && (
            <div className={`p-4 rounded-2xl border text-left space-y-2 animate-in fade-in ${
              grammarIsCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {grammarIsCorrect ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={18} className="text-red-600" />
                )}
                <span className={`text-xs font-black ${grammarIsCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                  {grammarIsCorrect ? 'Chính xác xuất sắc! +12 XP' : 'Chưa đúng, thử lại nhé!'}
                </span>
              </div>
              <p className="text-xs text-[#243447] dark:text-[#E2E8F0]">
                {currentGrammarItem?.explanation}
              </p>
              <button
                id="grammar-next-btn"
                onClick={handleNextGrammar}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#243447] text-white hover:bg-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Cấu trúc tiếp theo</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4: VOCABULARY BY HSK LEVELS WITH CONTEXTUAL SENTENCES */}
      {/* ======================================================== */}
      {practiceSkill === 'vocab' && (
        <div className="space-y-6">
          
          {/* Vocab Header & Source Filter Toolbar */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <BookOpen size={20} className="text-[#E85D3F]" />
                  <span>Kho Từ Vựng & Lộ Trình Học Tập Đa Cấp Độ</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                    {levelVocabItems.length} từ khả dụng
                  </span>
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                  Tích hợp đồng bộ từ vựng giữa 60 bài học Lộ trình và toàn bộ chuẩn HSK 1 - 6 kèm câu ví dụ ngữ cảnh thực tế.
                </p>
              </div>

              {/* Sub-mode Switcher: Cards vs Grid vs Quiz */}
              <div className="flex items-center gap-1 bg-[#FFF9F2] dark:bg-[#131B24] p-1.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] shrink-0 self-start md:self-auto">
                {[
                  { id: 'cards', label: '🎴 Thẻ Flashcard', icon: Layers },
                  { id: 'grid', label: '📋 Lưới Từ Vựng', icon: BookOpen },
                  { id: 'quiz', label: '🎯 Trắc Nghiệm', icon: Target }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      playClickSound();
                      setVocabSubMode(mode.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      vocabSubMode === mode.id
                        ? 'bg-[#E85D3F] text-white shadow-xs'
                        : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Vocabulary Source Mode Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0 flex items-center gap-1">
                <Compass size={14} className="text-[#E85D3F]" />
                Nguồn học:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => {
                    playClickSound();
                    setVocabSourceMode('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    vocabSourceMode === 'all'
                      ? 'bg-[#E85D3F] text-white shadow-xs scale-[1.02]'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Toàn bộ kho từ HSK</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    vocabSourceMode === 'all' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                  }`}>
                    {masterVocabPool.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setVocabSourceMode('roadmap');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    vocabSourceMode === 'roadmap'
                      ? 'bg-[#E85D3F] text-white shadow-xs scale-[1.02]'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  <Compass size={13} />
                  <span>Theo Lộ trình 60 bài</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    vocabSourceMode === 'roadmap' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                  }`}>
                    {allRoadmapVocab.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setVocabSourceMode('completed');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    vocabSourceMode === 'completed'
                      ? 'bg-[#E85D3F] text-white shadow-xs scale-[1.02]'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  <GraduationCap size={13} />
                  <span>Bài đã học trong Lộ trình</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    vocabSourceMode === 'completed' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                  }`}>
                    {userCompletedVocab.length}
                  </span>
                </button>
              </div>
            </div>

            {/* 2A. When Source is 'roadmap': Level pills & Detailed Lesson Dropdown */}
            {vocabSourceMode === 'roadmap' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
                    Cấp độ Lộ trình:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'all', label: 'Tất cả 60 bài', count: allRoadmapVocab.length },
                      { id: 'lvl-1', label: 'Level 1: 🌱 Khởi đầu (Bài 1-20)', count: allRoadmapVocab.filter(v => v.roadmapLevelId === 'lvl-1').length },
                      { id: 'lvl-2', label: 'Level 2: 🌿 Sinh hoạt (Bài 21-40)', count: allRoadmapVocab.filter(v => v.roadmapLevelId === 'lvl-2').length },
                      { id: 'lvl-3', label: 'Level 3: 🌳 Giao tiếp (Bài 41-60)', count: allRoadmapVocab.filter(v => v.roadmapLevelId === 'lvl-3').length }
                    ].map((rlvl) => {
                      const isActive = selectedRoadmapLevel === rlvl.id;
                      return (
                        <button
                          key={rlvl.id}
                          onClick={() => {
                            playClickSound();
                            setSelectedRoadmapLevel(rlvl.id);
                            setSelectedRoadmapLessonId('all');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                            isActive
                              ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-xs'
                              : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                          }`}
                        >
                          <span>{rlvl.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isActive ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#131B24]' : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                          }`}>
                            {rlvl.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lesson Selector Dropdown */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[#FFF9F2] dark:bg-[#131B24] p-3 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E85D3F] shrink-0">
                    <Compass size={15} />
                    <span>Lọc theo bài học:</span>
                  </div>
                  <select
                    value={selectedRoadmapLessonId}
                    onChange={(e) => {
                      setSelectedRoadmapLessonId(e.target.value);
                      setVocabCardIndex(0);
                    }}
                    className="flex-1 bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="all">
                      -- Tất cả bài học {selectedRoadmapLevel !== 'all' ? `thuộc ${selectedRoadmapLevel === 'lvl-1' ? 'Level 1' : selectedRoadmapLevel === 'lvl-2' ? 'Level 2' : 'Level 3'}` : 'trong Lộ trình'} ({filteredRoadmapLessons.reduce((acc, l) => acc + l.vocabCount, 0)} từ) --
                    </option>
                    {filteredRoadmapLessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        Bài {l.lessonNumber}: {l.title} ({l.vocabCount} từ vựng)
                      </option>
                    ))}
                  </select>

                  {selectedRoadmapLessonId !== 'all' && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        if (onSelectLesson) {
                          onSelectLesson(selectedRoadmapLessonId);
                        } else if (setActiveTab) {
                          setActiveTab('roadmap');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold flex items-center justify-center gap-1 shrink-0 hover:bg-[#D44E32] transition-colors cursor-pointer"
                      title="Mở bài học này trực tiếp trong Lộ trình"
                    >
                      <Compass size={13} />
                      <span>Học bài này 🚀</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2B. When Source is 'all': Standard HSK Level Selection Pills */}
            {vocabSourceMode === 'all' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
                  Chọn cấp HSK:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'by-level', label: `🎯 Theo Mức ${activeLevel.level}: ${activeLevel.badge}`, count: null },
                    { id: 'all', label: 'Tất cả HSK', count: masterVocabPool.length },
                    { id: 'HSK 1', label: 'HSK 1', count: masterVocabPool.filter(v => v.level === 'HSK 1').length },
                    { id: 'HSK 2', label: 'HSK 2', count: masterVocabPool.filter(v => v.level === 'HSK 2').length },
                    { id: 'HSK 3', label: 'HSK 3', count: masterVocabPool.filter(v => v.level === 'HSK 3').length },
                    { id: 'HSK 4', label: 'HSK 4', count: masterVocabPool.filter(v => v.level === 'HSK 4').length },
                    { id: 'HSK 5-6', label: 'HSK 5-6 (Thành ngữ)', count: masterVocabPool.filter(v => v.level === 'HSK 5-6').length }
                  ].map((tab) => {
                    const isActive = vocabHskFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          playClickSound();
                          setVocabHskFilter(tab.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-xs scale-[1.02]'
                            : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== null && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#131B24]'
                              : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2C. When Source is 'completed': Status Info */}
            {vocabSourceMode === 'completed' && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>
                    Đang hiển thị <strong>{userCompletedVocab.length}</strong> từ vựng từ các bài học bạn đã hoàn thành trong Lộ trình.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (setActiveTab) setActiveTab('roadmap');
                  }}
                  className="font-bold underline hover:text-emerald-950 dark:hover:text-white cursor-pointer"
                >
                  Xem Bản đồ Lộ trình 🗺️
                </button>
              </div>
            )}

            {/* Search Input Filter */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-[#748092]" />
              <input
                type="text"
                placeholder="Tìm từ vựng theo chữ Hán, Pinyin, nghĩa tiếng Việt, âm Hán-Việt hoặc tên bài học Lộ trình..."
                value={vocabSearchQuery}
                onChange={(e) => {
                  setVocabSearchQuery(e.target.value);
                  setVocabCardIndex(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
            </div>
          </div>

          {/* Empty state when no words match search or no completed lessons */}
          {levelVocabItems.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              {vocabSourceMode === 'completed' ? (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <GraduationCap size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-[#243447] dark:text-white">Bạn chưa hoàn thành bài học nào trong Lộ trình</h4>
                  <p className="text-xs text-[#748092] max-w-md mx-auto">
                    Hãy bắt đầu học Bài 1 (4 Thanh điệu & Nhóm thanh mẫu môi - đầu lưỡi) để tích lũy kho từ vựng ôn tập cá nhân hóa!
                  </p>
                  <button
                    onClick={() => {
                      if (onSelectLesson) {
                        onSelectLesson('l-101');
                      } else if (setActiveTab) {
                        setActiveTab('roadmap');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:bg-[#D44E32] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Compass size={14} />
                    <span>Bắt đầu học Bài 1 trong Lộ trình 🚀</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-[#748092]">Không tìm thấy từ vựng nào khớp với từ khóa "{vocabSearchQuery}"</p>
                  <button
                    onClick={() => setVocabSearchQuery('')}
                    className="px-4 py-1.5 rounded-xl bg-[#FDEEEB] text-[#E85D3F] text-xs font-bold"
                  >
                    Xóa bộ lọc tìm kiếm
                  </button>
                </>
              )}
            </div>
          )}

          {/* SUB-MODE 1: INTERACTIVE FLASHCARD DECK WITH EXAMPLE SENTENCES & ROADMAP INFO */}
          {vocabSubMode === 'cards' && currentVocabCard && (
            <div className="max-w-2xl mx-auto space-y-4">
              
              {/* Card Meta & Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-[#748092] flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {currentVocabCard.level}
                  </span>
                  <span>{currentVocabCard.topic}</span>
                  {currentVocabCard.roadmapLessonId && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectLesson) {
                          onSelectLesson(currentVocabCard.roadmapLessonId);
                        } else if (setActiveTab) {
                          setActiveTab('roadmap');
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-[#E85D3F] dark:bg-orange-950/60 dark:text-orange-300 hover:bg-orange-200 transition-colors cursor-pointer"
                      title="Nhấn để mở bài học này trong Lộ trình"
                    >
                      <Compass size={11} />
                      <span>Bài {currentVocabCard.roadmapLessonNumber}: {currentVocabCard.roadmapLessonTitle}</span>
                      <ExternalLink size={10} />
                    </button>
                  )}
                </div>
                <span>
                  Thẻ <strong>{vocabCardIndex + 1}</strong> / {levelVocabItems.length}
                </span>
              </div>

              {/* Flashcard Main Surface */}
              <div 
                onClick={() => {
                  playClickSound();
                  setVocabCardFlipped(prev => !prev);
                }}
                className="bg-white dark:bg-[#1E293B] p-8 sm:p-10 rounded-3xl border-2 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] shadow-lg transition-all text-center space-y-6 cursor-pointer relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
                    {currentVocabCard.radical !== '—' && `Bộ ${currentVocabCard.radical}`} • {currentVocabCard.strokes} nét
                  </span>
                  <span className="text-[11px] font-bold text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] px-2 py-0.5 rounded-md">
                    Âm Hán-Việt: {currentVocabCard.hanviet || '—'}
                  </span>
                </div>

                {/* Main Hanzi & Audio */}
                <div className="space-y-3 py-4">
                  <span className="font-['Noto_Serif_SC'] text-6xl sm:text-7xl font-black text-[#243447] dark:text-white block group-hover:scale-105 transition-transform">
                    {currentVocabCard.hanzi}
                  </span>
                  <p className="text-xl font-black text-[#E85D3F] tracking-wide">
                    {currentVocabCard.pinyin}
                  </p>
                  <div className="inline-block" onClick={(e) => e.stopPropagation()}>
                    <AudioButton text={currentVocabCard.hanzi} size="md" />
                  </div>
                </div>

                {/* Back Details: Meaning, Mnemonic & Contextual Example Sentence */}
                <div className={`space-y-4 pt-4 border-t border-black/5 dark:border-white/5 transition-all ${
                  vocabCardFlipped ? 'opacity-100 block' : 'opacity-80'
                }`}>
                  <div>
                    <span className="text-xs uppercase font-bold text-[#748092] block mb-1">Nghĩa tiếng Việt:</span>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {currentVocabCard.meaning}
                    </p>
                    {currentVocabCard.mnemonic && (
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] italic mt-1.5 max-w-md mx-auto">
                        💡 {currentVocabCard.mnemonic}
                      </p>
                    )}
                  </div>

                  {/* Contextual Example Sentence Box */}
                  {currentVocabCard.example && (() => {
                    const exHanzi = typeof currentVocabCard.example === 'object' ? currentVocabCard.example?.hanzi : currentVocabCard.example;
                    const exPinyin = typeof currentVocabCard.example === 'object' ? currentVocabCard.example?.pinyin : currentVocabCard.pinyinSentence;
                    const exMeaning = typeof currentVocabCard.example === 'object' ? currentVocabCard.example?.meaning : currentVocabCard.exampleMeaning;
                    return (
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#E85D3F] flex items-center gap-1">
                            <MessageSquare size={13} />
                            Câu ví dụ ngữ cảnh từ giáo trình:
                          </span>
                          <AudioButton text={exHanzi} size="sm" />
                        </div>
                        <p className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">
                          {exHanzi}
                        </p>
                        {exPinyin && (
                          <p className="text-xs font-semibold text-[#E85D3F]">
                            {exPinyin}
                          </p>
                        )}
                        {exMeaning && (
                          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                            {exMeaning}
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  <p className="text-[11px] text-[#748092]">
                    {vocabCardFlipped ? 'Chạm vào thẻ để lật lại' : 'Chạm vào thẻ để xem câu ví dụ & mẹo chiết tự'}
                  </p>
                </div>
              </div>

              {/* Card Bottom Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevVocabCard}
                  className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] hover:bg-black/5 text-xs font-bold text-[#748092] flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Thẻ trước</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReviewVocab}
                    className="px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer"
                    title="Đánh dấu cần ôn tập lại"
                  >
                    Cần ôn lại
                  </button>
                  <button
                    onClick={handleRememberVocab}
                    className="px-5 py-2.5 rounded-xl bg-[#45B97C] hover:bg-[#3AA36B] text-white text-xs font-bold shadow-md shadow-[#45B97C]/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Đã nhớ vững (+8 XP)"
                  >
                    <Check size={16} />
                    <span>Đã nhớ (+8 XP)</span>
                  </button>
                </div>

                <button
                  onClick={handleNextVocabCard}
                  className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] hover:bg-black/5 text-xs font-bold text-[#748092] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Thẻ tiếp theo</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Quick Jump to Writing, Pronunciation & Roadmap Lesson */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs">
                {currentVocabCard.roadmapLessonId && (
                  <>
                    <button
                      onClick={() => {
                        playClickSound();
                        if (onSelectLesson) {
                          onSelectLesson(currentVocabCard.roadmapLessonId);
                        } else if (setActiveTab) {
                          setActiveTab('roadmap');
                        }
                      }}
                      className="text-[#E85D3F] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Compass size={13} />
                      <span>Mở bài {currentVocabCard.roadmapLessonNumber} trong Lộ trình</span>
                    </button>
                    <span className="text-[#CBD5E1]">•</span>
                  </>
                )}
                <button
                  onClick={() => {
                    playClickSound();
                    if (onSelectWriting) {
                      onSelectWriting(currentVocabCard);
                    } else if (setActiveTab) {
                      setActiveTab('writing');
                    }
                  }}
                  className="text-[#748092] hover:text-[#E85D3F] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <PenTool size={13} />
                  <span>Tập viết chữ này trên ô Mễ tự</span>
                </button>
                <span className="text-[#CBD5E1]">•</span>
                <button
                  onClick={() => {
                    playClickSound();
                    if (onSelectPronounce) {
                      onSelectPronounce(currentVocabCard);
                    } else if (setActiveTab) {
                      setActiveTab('pronunciation');
                    }
                  }}
                  className="text-[#748092] hover:text-[#E85D3F] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Mic size={13} />
                  <span>Luyện phát âm qua Mic AI</span>
                </button>
              </div>

            </div>
          )}

          {/* SUB-MODE 2: GRID VIEW OF VOCABULARY & EXAMPLES */}
          {vocabSubMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelVocabItems.map((vocab) => (
                <div
                  key={vocab.id || vocab.hanzi}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:shadow-md transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {vocab.level}
                      </span>
                      {vocab.roadmapLessonId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectLesson) {
                              onSelectLesson(vocab.roadmapLessonId);
                            } else if (setActiveTab) {
                              setActiveTab('roadmap');
                            }
                          }}
                          className="text-[10px] font-bold text-[#E85D3F] bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.5 rounded-md hover:bg-orange-100 flex items-center gap-1 cursor-pointer"
                          title={`Thuộc bài học: ${vocab.roadmapLessonTitle}`}
                        >
                          <Compass size={10} />
                          <span>Bài {vocab.roadmapLessonNumber}</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-[#748092]">
                      {vocab.hanviet ? `Âm Hán-Việt: ${vocab.hanviet}` : vocab.topic}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-['Noto_Serif_SC'] text-4xl font-black text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                        {vocab.hanzi}
                      </span>
                      <p className="text-sm font-bold text-[#E85D3F]">
                        {vocab.pinyin}
                      </p>
                    </div>
                    <AudioButton text={vocab.hanzi} size="sm" />
                  </div>

                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {vocab.meaning}
                  </p>

                  {/* Contextual Sentence */}
                  {vocab.example && (() => {
                    const exHanzi = typeof vocab.example === 'object' ? vocab.example?.hanzi : vocab.example;
                    const exPinyin = typeof vocab.example === 'object' ? vocab.example?.pinyin : vocab.pinyinSentence;
                    const exMeaning = typeof vocab.example === 'object' ? vocab.example?.meaning : vocab.exampleMeaning;
                    return (
                      <div className="pt-2.5 border-t border-black/5 dark:border-white/5 space-y-1 bg-[#FFF9F2] dark:bg-[#131B24] p-3 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="font-['Noto_Serif_SC'] text-xs font-bold text-[#243447] dark:text-white">
                            {exHanzi}
                          </span>
                          <AudioButton text={exHanzi} size="sm" />
                        </div>
                        {exPinyin && (
                          <p className="text-[11px] text-[#E85D3F]">
                            {exPinyin}
                          </p>
                        )}
                        {exMeaning && (
                          <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                            {exMeaning}
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* Cross-skill action buttons for each grid item */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                    {vocab.roadmapLessonId && (
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          if (onSelectLesson) {
                            onSelectLesson(vocab.roadmapLessonId);
                          } else if (setActiveTab) {
                            setActiveTab('roadmap');
                          }
                        }}
                        className="p-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] border border-orange-200 dark:border-orange-800 text-xs font-bold hover:bg-orange-100 transition-colors flex items-center justify-center cursor-pointer"
                        title="Vào bài học Lộ trình"
                      >
                        <Compass size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        if (onSelectWriting) {
                          onSelectWriting(vocab);
                        } else if (setActiveTab) {
                          setActiveTab('writing');
                        }
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] border border-orange-200 dark:border-orange-800 text-xs font-bold hover:bg-orange-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Tập viết chữ này"
                    >
                      <PenTool size={12} />
                      <span>Tập viết</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        if (onSelectPronounce) {
                          onSelectPronounce(vocab);
                        } else if (setActiveTab) {
                          setActiveTab('pronunciation');
                        }
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Luyện phát âm từ này"
                    >
                      <Mic size={12} />
                      <span>Phát âm</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUB-MODE 3: VOCABULARY QUIZ CHALLENGE */}
          {vocabSubMode === 'quiz' && quizCurrentCard && (
            <div className="max-w-xl mx-auto bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-lg text-center space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
                <div className="flex items-center gap-1.5">
                  <span>Thử thách nghĩa câu HSK</span>
                  {quizCurrentCard.roadmapLessonId && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#E85D3F] dark:bg-orange-950/50">
                      Bài {quizCurrentCard.roadmapLessonNumber}
                    </span>
                  )}
                </div>
                <span className="text-emerald-600">Đã đúng: {vocabQuizScore} câu</span>
              </div>

              <div className="space-y-2 py-4">
                <span className="font-['Noto_Serif_SC'] text-6xl font-black text-[#243447] dark:text-white block">
                  {quizCurrentCard.hanzi}
                </span>
                <p className="text-lg font-bold text-[#E85D3F]">
                  {quizCurrentCard.pinyin}
                </p>
                <div className="pt-1">
                  <AudioButton text={quizCurrentCard.hanzi} size="md" />
                </div>
              </div>

              <p className="text-xs font-bold text-[#748092]">Chọn nghĩa tiếng Việt chính xác:</p>

              <div className="grid grid-cols-1 gap-2.5">
                {quizOptions.map((opt, idx) => {
                  let btnStyle = 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';
                  if (vocabQuizChecked) {
                    if (opt === quizCurrentCard.meaning) {
                      btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (vocabQuizSelectedOption === opt) {
                      btnStyle = 'bg-red-50 dark:bg-red-950/60 border-red-400 text-red-800 dark:text-red-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={vocabQuizChecked}
                      onClick={() => handleSelectQuizOption(opt)}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {vocabQuizChecked && (
                <div className="pt-2 space-y-3">
                  {quizCurrentCard.example && (
                    <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left text-xs">
                      <span className="font-bold text-[#E85D3F] block mb-1">Ví dụ thực tế:</span>
                      <p className="font-['Noto_Serif_SC'] font-bold text-[#243447] dark:text-white">{quizCurrentCard.example.hanzi}</p>
                      <p className="text-[#748092]">{quizCurrentCard.example.meaning}</p>
                    </div>
                  )}

                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-3 rounded-xl bg-[#243447] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Từ vựng tiếp theo</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Link to Full Vocabulary Studio */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                playClickSound();
                if (setActiveTab) setActiveTab('vocabulary');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E85D3F] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 hover:bg-[#D94E30] transition-all cursor-pointer"
            >
              <span>Mở Kho Flashcard Toàn Diện & Tự Thêm Từ Vựng</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 5. Direct Shortcuts to Deep Practice Studios */}
      <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-4">
        <h3 className="text-xs font-black text-[#748092] uppercase tracking-wider text-center">
          Các Phòng Luyện Tập Chuyên Sâu
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'pronunciation',
              title: 'Phòng Thu Phát Âm AI',
              desc: 'Tự thêm câu & chẩn đoán ngữ âm',
              icon: Mic,
              color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
            },
            {
              id: 'writing',
              title: 'Tập Viết Ô Mễ Tự',
              desc: 'Thứ tự nét bút & tải ảnh PNG',
              icon: PenTool,
              color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
            },
            {
              id: 'conversation',
              title: 'Hội Thoại AI Lão Sư',
              desc: 'Đàm thoại phản xạ theo tình huống',
              icon: MessageSquare,
              color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
            },
            {
              id: 'vocabulary',
              title: 'Thẻ Từ Vựng SRS SM-2',
              desc: 'Ôn tập lặp lại ngắt quãng',
              icon: Layers,
              color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
            }
          ].map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.id}
                id={`deep-studio-btn-${sc.id}`}
                onClick={() => {
                  playClickSound();
                  if (setActiveTab) setActiveTab(sc.id);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] transition-all flex items-center justify-between text-left group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${sc.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                      {sc.title}
                    </h4>
                    <p className="text-[10px] text-[#748092]">{sc.desc}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#748092] group-hover:translate-x-1 group-hover:text-[#E85D3F] transition-all" />
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
