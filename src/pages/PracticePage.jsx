import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Target, 
  Headphones, 
  Trophy, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Mic, 
  PenTool, 
  MessageSquare, 
  Play, 
  Square, 
  Award, 
  Check, 
  ExternalLink, 
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  Compass,
  Video,
  Languages
} from 'lucide-react';
import { 
  speakChinese, 
  stopChineseSpeech, 
  playClickSound, 
  playSuccessSound, 
  playErrorSound, 
  checkChineseVoiceSupport 
} from '../utils/audio';
import { awardXp } from '../utils/gamification';
import {
  recordAdaptiveMistake,
  markAdaptiveItemMastered,
  consumeAdaptiveNavigationTarget
} from '../services/adaptiveLearningService';
import { 
  PRACTICE_LEVELS, 
  GRAMMAR_DRILLS_BY_LEVEL, 
  LISTENING_DRILLS_BY_LEVEL 
} from '../data/practiceLevelData';
import { ChineseListeningStudio } from '../features/listening-studio/ChineseListeningStudio.tsx';
import { DualSubInteractiveVideoStudio } from '../features/video-studio/DualSubInteractiveVideoStudio.tsx';
import { Hsk30TranslationStudio } from '../features/hsk30-translation/Hsk30TranslationStudio.tsx';

/**
 * =========================================================================
 * HANZI GO — MULTI-SKILL PRACTICE HUB (PRACTICE PAGE)
 * =========================================================================
 * Trung tâm Luyện tập Đa Kỹ năng chuyên sâu:
 * 1. Overview Hub: Tổng quan kỹ năng, lựa chọn cấp độ và bài tập
 * 2. Grammar Sentence Builder: Luyện trắc nghiệm cấu trúc và ghép từ thành câu HSK 1–4+
 * 3. Listening Comprehension: Luyện nghe phản xạ audio chuẩn, câu hỏi ngữ cảnh HSK 1–4+
 */

export default function PracticePage({ 
  user = null,
  setActiveTab, 
  initialSkill = 'overview',
  initialLevel = 1,
  onSelectWriting, 
  onSelectPronounce,
  onSelectLesson
}) {
  // 1. Practice Skill Mode: 'overview' | 'grammar' | 'listening' | 'listening-studio' | 'video-studio'
  const [practiceSkill, setPracticeSkill] = useState(() => {
    if (initialSkill === 'grammar') return 'grammar';
    if (initialSkill === 'listening') return 'listening';
    if (initialSkill === 'listening-studio') return 'listening-studio';
    if (initialSkill === 'video' || initialSkill === 'video-studio') return 'video-studio';
    return 'overview';
  });

  // Sync practiceSkill if initialSkill changes from route
  useEffect(() => {
    if (initialSkill === 'grammar') setPracticeSkill('grammar');
    else if (initialSkill === 'listening') setPracticeSkill('listening');
    else if (initialSkill === 'listening-studio') setPracticeSkill('listening-studio');
    else if (initialSkill === 'video' || initialSkill === 'video-studio') setPracticeSkill('video-studio');
    else if (initialSkill === 'overview') setPracticeSkill('overview');
  }, [initialSkill]);

  // 2. Selected HSK Level (1: HSK 1, 2: HSK 2, 3: HSK 3, 4: HSK 4, 5: HSK 5, 6: HSK 6)
  const [selectedLevelId, setSelectedLevelId] = useState(() => {
    return Math.min(Math.max(Number(initialLevel) || 1, 1), 6);
  });

  const activeLevel = useMemo(() => {
    return PRACTICE_LEVELS.find(l => l.level === selectedLevelId) || PRACTICE_LEVELS[0];
  }, [selectedLevelId]);

  // Track completed drills for progress tracking & celebration
  const [completedGrammarIds, setCompletedGrammarIds] = useState(() => new Set());
  const [completedListeningIds, setCompletedListeningIds] = useState(() => new Set());

  // Check browser speech support on mount
  const [hasVoiceSupport] = useState(() => checkChineseVoiceSupport());

  // Consume deep-link target when arriving from Adaptive Review Queue
  useEffect(() => {
    const target = consumeAdaptiveNavigationTarget('practice');
    if (!target) return;

    const targetLevel = Math.min(Math.max(Number(target.levelNum) || 1, 1), 6);
    setSelectedLevelId(targetLevel);

    if (target.source === 'grammar') {
      setPracticeSkill('grammar');
      const drills = GRAMMAR_DRILLS_BY_LEVEL.filter(item => item.level === targetLevel);
      const idx = drills.findIndex(item => String(item.id) === String(target.targetRef));
      if (idx >= 0) setSelectedGrammarIndex(idx);
    } else if (target.source === 'listening') {
      setPracticeSkill('listening');
      const drills = LISTENING_DRILLS_BY_LEVEL.filter(item => item.level === targetLevel);
      const idx = drills.findIndex(item => String(item.id) === String(target.targetRef));
      if (idx >= 0) setSelectedListeningIndex(idx);
    }
  }, []);

  // =========================================================================
  // GRAMMAR SENTENCE BUILDER STATE & HANDLERS
  // =========================================================================
  const levelGrammarItems = useMemo(() => {
    return GRAMMAR_DRILLS_BY_LEVEL.filter(item => item.level === selectedLevelId);
  }, [selectedLevelId]);

  const [selectedGrammarIndex, setSelectedGrammarIndex] = useState(0);
  const currentGrammarItem = levelGrammarItems[selectedGrammarIndex] || null;

  const [userGrammarTokens, setUserGrammarTokens] = useState([]);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const [grammarIsCorrect, setGrammarIsCorrect] = useState(false);
  const [grammarNewlyAwarded, setGrammarNewlyAwarded] = useState(false);
  const [isGrammarLevelComplete, setIsGrammarLevelComplete] = useState(false);

  // Reset grammar state when switching level or question
  const resetGrammarQuestionState = useCallback((targetIndex = 0) => {
    setSelectedGrammarIndex(targetIndex);
    setUserGrammarTokens([]);
    setGrammarChecked(false);
    setGrammarIsCorrect(false);
    setGrammarNewlyAwarded(false);
    setIsGrammarLevelComplete(false);
  }, []);

  const handleSelectGrammarLevel = (levelId) => {
    playClickSound();
    setSelectedLevelId(levelId);
    resetGrammarQuestionState(0);
  };

  // Compute available tokens (total tokens minus already chosen tokens)
  const availableGrammarTokens = useMemo(() => {
    if (!currentGrammarItem || !currentGrammarItem.tokens) return [];
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

  const handleResetGrammarTokens = () => {
    playClickSound();
    setUserGrammarTokens([]);
    setGrammarChecked(false);
    setGrammarIsCorrect(false);
  };

  const handleCheckGrammar = () => {
    if (!currentGrammarItem || userGrammarTokens.length === 0) return;
    playClickSound();
    setGrammarChecked(true);

    const isMatch = userGrammarTokens.join('') === currentGrammarItem.correctTokens.join('');
    setGrammarIsCorrect(isMatch);

    if (isMatch) {
      playSuccessSound();
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}

      const isFirstTime = !completedGrammarIds.has(currentGrammarItem.id);
      setGrammarNewlyAwarded(isFirstTime);

      if (isFirstTime) {
        setCompletedGrammarIds(prev => new Set(prev).add(currentGrammarItem.id));
        awardXp(12, null, `practice_grammar_${currentGrammarItem.id}`);
      }
      markAdaptiveItemMastered({
        user,
        source: 'grammar',
        targetRef: currentGrammarItem.id
      });
    } else {
      playErrorSound();
      setGrammarNewlyAwarded(false);
      recordAdaptiveMistake({
        user,
        source: 'grammar',
        skill: 'grammar',
        level: `HSK ${currentGrammarItem.level || selectedLevelId}`,
        targetRef: currentGrammarItem.id,
        title: currentGrammarItem.grammarPoint || currentGrammarItem.meaning || 'Cấu trúc câu HSK',
        detail: `Ghép sai thành "${userGrammarTokens.join('')}" (Đáp án: "${currentGrammarItem.correctTokens.join('')}")`
      });
    }
  };

  const handlePrevGrammar = () => {
    if (levelGrammarItems.length === 0) return;
    playClickSound();
    const nextIdx = (selectedGrammarIndex - 1 + levelGrammarItems.length) % levelGrammarItems.length;
    resetGrammarQuestionState(nextIdx);
  };

  const handleNextGrammar = () => {
    if (levelGrammarItems.length === 0) return;
    playClickSound();
    if (selectedGrammarIndex === levelGrammarItems.length - 1) {
      // Reached the end of the level
      setIsGrammarLevelComplete(true);
    } else {
      resetGrammarQuestionState(selectedGrammarIndex + 1);
    }
  };

  // =========================================================================
  // LISTENING DRILL STATE & HANDLERS
  // =========================================================================
  const levelListeningItems = useMemo(() => {
    return LISTENING_DRILLS_BY_LEVEL.filter(item => item.level === selectedLevelId);
  }, [selectedLevelId]);

  const [selectedListeningIndex, setSelectedListeningIndex] = useState(0);
  const currentListeningItem = levelListeningItems[selectedListeningIndex] || null;

  const [listeningSelectedOption, setListeningSelectedOption] = useState(null);
  const [listeningChecked, setListeningChecked] = useState(false);
  const [listeningNewlyAwarded, setListeningNewlyAwarded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.85);
  const [showTranscriptHint, setShowTranscriptHint] = useState(false);
  const [isListeningLevelComplete, setIsListeningLevelComplete] = useState(false);

  // Stop audio on unmount or question change
  useEffect(() => {
    return () => {
      stopChineseSpeech();
    };
  }, []);

  const resetListeningQuestionState = useCallback((targetIndex = 0) => {
    stopChineseSpeech();
    setIsPlayingAudio(false);
    setSelectedListeningIndex(targetIndex);
    setListeningSelectedOption(null);
    setListeningChecked(false);
    setListeningNewlyAwarded(false);
    setShowTranscriptHint(false);
    setIsListeningLevelComplete(false);
  }, []);

  const handleSelectListeningLevel = (levelId) => {
    playClickSound();
    setSelectedLevelId(levelId);
    resetListeningQuestionState(0);
  };

  const handlePlayListeningAudio = (customRate = playbackSpeed) => {
    if (!currentListeningItem || !currentListeningItem.audioText) return;
    playClickSound();
    setIsPlayingAudio(true);

    speakChinese(
      currentListeningItem.audioText, 
      customRate, 
      () => setIsPlayingAudio(false), 
      () => setIsPlayingAudio(false)
    );
  };

  const handleStopListeningAudio = () => {
    playClickSound();
    stopChineseSpeech();
    setIsPlayingAudio(false);
  };

  const handleChooseListeningOption = (idx) => {
    if (listeningChecked || !currentListeningItem) return;
    playClickSound();
    setListeningSelectedOption(idx);
    setListeningChecked(true);

    if (idx === currentListeningItem.correctIndex) {
      playSuccessSound();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}

      const isFirstTime = !completedListeningIds.has(currentListeningItem.id);
      setListeningNewlyAwarded(isFirstTime);

      if (isFirstTime) {
        setCompletedListeningIds(prev => new Set(prev).add(currentListeningItem.id));
        awardXp(10, null, `practice_listening_${currentListeningItem.id}`);
      }
      markAdaptiveItemMastered({
        user,
        source: 'listening',
        targetRef: currentListeningItem.id
      });
    } else {
      playErrorSound();
      setListeningNewlyAwarded(false);
      recordAdaptiveMistake({
        user,
        source: 'listening',
        skill: 'listening',
        level: `HSK ${currentListeningItem.level || selectedLevelId}`,
        targetRef: currentListeningItem.id,
        title: currentListeningItem.question || currentListeningItem.audioText || 'Bài nghe hiểu HSK',
        detail: `Chọn sai đáp án nghe câu "${currentListeningItem.audioText || ''}"`
      });
    }
  };

  const handlePrevListening = () => {
    if (levelListeningItems.length === 0) return;
    playClickSound();
    const nextIdx = (selectedListeningIndex - 1 + levelListeningItems.length) % levelListeningItems.length;
    resetListeningQuestionState(nextIdx);
  };

  const handleNextListening = () => {
    if (levelListeningItems.length === 0) return;
    playClickSound();
    if (selectedListeningIndex === levelListeningItems.length - 1) {
      setIsListeningLevelComplete(true);
    } else {
      resetListeningQuestionState(selectedListeningIndex + 1);
    }
  };

  // Switch skill and sync hash route
  const handleSwitchSkill = (skillId) => {
    playClickSound();
    setPracticeSkill(skillId);
    if (skillId === 'grammar') {
      window.location.hash = '#grammar';
      resetGrammarQuestionState(0);
    } else if (skillId === 'listening') {
      window.location.hash = '#listening';
      resetListeningQuestionState(0);
    } else {
      window.location.hash = '#practice';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & NAVIGATION */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/10 text-[#E85D3F]">
              Đa Kỹ Năng HSK
            </span>
            <span className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Chuẩn HSK 3.0
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white tracking-tight flex items-center gap-2">
            <span>Trung Tâm Luyện Tập</span>
            <Sparkles size={22} className="text-[#E85D3F]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
            Rèn luyện ngữ pháp câu, phản xạ nghe hiểu âm thanh và làm chủ kiến thức theo từng cấp độ
          </p>
        </div>

        {/* Skill Selector Tabs - Compact Single-Line */}
        <div className="inline-flex items-center gap-1 max-w-full overflow-x-auto bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
          {[
            { id: 'overview', domId: 'tab-practice-overview', label: 'Tổng quan', title: 'Tổng quan luyện tập', icon: Target, activeClass: 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs' },
            { id: 'grammar', domId: 'tab-practice-grammar', label: 'Ngữ pháp', title: 'Luyện Ngữ Pháp', icon: Sparkles, activeClass: 'bg-[#E85D3F] text-white shadow-xs' },
            { id: 'listening', domId: 'tab-practice-listening', label: 'Nghe HSK', title: 'Luyện Nghe HSK', icon: Headphones, activeClass: 'bg-[#E85D3F] text-white shadow-xs' },
            { id: 'listening-studio', domId: 'tab-practice-listening-studio', label: 'Dictation', title: 'Listening Studio & Dictation', icon: Sparkles, activeClass: 'bg-emerald-600 text-white shadow-xs' },
            { id: 'video-studio', domId: 'tab-practice-video-studio', label: 'Video', title: 'Video Studio (Song ngữ)', icon: Video, activeClass: 'bg-rose-600 text-white shadow-xs' },
            { id: 'hsk30-translation', domId: 'tab-practice-hsk30-translation', label: 'Xưởng Dịch', title: 'Xưởng Dịch & HSK 7–9', icon: Languages, activeClass: 'bg-indigo-600 text-white shadow-xs' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = practiceSkill === tab.id;
            return (
              <button
                key={tab.id}
                id={tab.domId}
                type="button"
                title={tab.title}
                onClick={() => handleSwitchSkill(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? tab.activeClass
                    : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OVERVIEW HUB & STUDIO VIEWS */}
      {/* ======================================================== */}
      {practiceSkill === 'listening-studio' && (
        <ChineseListeningStudio user={user} />
      )}

      {practiceSkill === 'hsk30-translation' && (
        <Hsk30TranslationStudio
          user={user}
          onOpenDictionary={(term) => {
            window.dispatchEvent(new CustomEvent('hanzigo:open-dict', { detail: { term } }));
          }}
        />
      )}

      {practiceSkill === 'video-studio' && (
        <DualSubInteractiveVideoStudio
          user={user}
          onOpenDictionary={(term) => {
            window.dispatchEvent(new CustomEvent('hanzigo:open-dict', { detail: { term } }));
          }}
          onOpenPronunciation={(hanzi, pinyin) => {
            if (onSelectPronounce) {
              onSelectPronounce(hanzi, pinyin);
            } else if (setActiveTab) {
              setActiveTab('pronunciation');
            }
          }}
        />
      )}

      {practiceSkill === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#E85D3F]/10 via-[#F4B942]/10 to-transparent border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E85D3F] text-white">
                Khám phá hệ thống luyện tập thực chiến
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                Luyện tập có chủ đích theo từng cấp độ HSK
              </h2>
              <p className="text-xs sm:text-sm text-[#748092] dark:text-[#CBD5E1] leading-relaxed">
                HanziGo cung cấp bài tập ghép từ thành câu chuẩn ngữ pháp, thử thách nghe hiểu âm thanh giọng bản xứ và kết nối trực tiếp với toàn bộ hệ sinh thái học tập HSK 1–6.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="overview-btn-grammar"
                  onClick={() => handleSwitchSkill('grammar')}
                  className="px-4 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#CB4529] shadow-md shadow-[#E85D3F]/25 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>Vào Luyện Ngữ Pháp</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  id="overview-btn-listening"
                  onClick={() => handleSwitchSkill('listening')}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold flex items-center gap-2 hover:border-[#E85D3F] cursor-pointer"
                >
                  <Headphones size={15} />
                  <span>Vào Luyện Nghe Phản Xạ</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  id="overview-btn-video"
                  onClick={() => handleSwitchSkill('video-studio')}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-rose-700 shadow-md shadow-rose-600/25 cursor-pointer"
                >
                  <Video size={15} />
                  <span>Vào Video Song Ngữ</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Core Modules 2-Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Grammar Module Card */}
            <div 
              onClick={() => handleSwitchSkill('grammar')}
              className="group p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-purple-400 dark:hover:border-purple-500 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Sparkles size={24} />
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full">
                  {GRAMMAR_DRILLS_BY_LEVEL.length} cấu trúc HSK 1–6 (15 bài/cấp)
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white group-hover:text-purple-600 transition-colors">
                  Luyện Ngữ Pháp & Ghép Câu
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1 leading-relaxed">
                  Rèn luyện sắp xếp trật tự từ đúng quy tắc tiếng Trung (câu chữ 是, trợ từ 吗, động từ năng nguyện 想, câu chữ 把, liên từ 虽然...但是...).
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-xs font-bold text-purple-600 dark:text-purple-400">
                <span>Thực hành ngay</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Listening Module Card */}
            <div 
              onClick={() => handleSwitchSkill('listening')}
              className="group p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-sky-400 dark:hover:border-sky-500 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                  <Headphones size={24} />
                </div>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full">
                  {LISTENING_DRILLS_BY_LEVEL.length} bài nghe HSK 1–6 (15 bài/cấp)
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white group-hover:text-sky-600 transition-colors">
                  Luyện Nghe Phản Xạ HSK
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1 leading-relaxed">
                  Nghe phát âm chuẩn giọng bản xứ, chọn đáp án đúng, nhận diện giá tiền, địa điểm và các câu líu lưỡi phân biệt thanh điệu.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-xs font-bold text-sky-600 dark:text-sky-400">
                <span>Thực hành ngay</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Quick Links to Companion Learning Modules */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-[#243447] dark:text-white uppercase tracking-wider">
              Kết nối nhanh các kỹ năng bổ trợ
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => handleSwitchSkill('video-studio')}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-rose-500 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2">
                  <Video size={16} />
                </div>
                <h4 className="text-xs font-bold text-[#243447] dark:text-white group-hover:text-rose-500">
                  Video Song Ngữ
                </h4>
                <p className="text-[10px] text-[#748092]">Sub đa tầng & ngắt câu</p>
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('vocabulary')}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                  <Layers size={16} />
                </div>
                <h4 className="text-xs font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F]">
                  Từ vựng & Flashcard SRS
                </h4>
                <p className="text-[10px] text-[#748092]">Học từ vựng ngắt quãng</p>
              </button>

              <button
                onClick={() => setActiveTab && setActiveTab('pronunciation')}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                  <Mic size={16} />
                </div>
                <h4 className="text-xs font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F]">
                  Phòng Luyện Phát Âm
                </h4>
                <p className="text-[10px] text-[#748092]">Nhận diện giọng nói Web Speech</p>
              </button>

              <button
                onClick={() => setActiveTab && setActiveTab('writing')}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
                  <PenTool size={16} />
                </div>
                <h4 className="text-xs font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F]">
                  Từ Điển & Viết Chữ
                </h4>
                <p className="text-[10px] text-[#748092]">Thứ tự nét viết chuẩn</p>
              </button>

              <button
                onClick={() => setActiveTab && setActiveTab('reader')}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2">
                  <BookOpen size={16} />
                </div>
                <h4 className="text-xs font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F]">
                  Đọc Hiểu & NLP
                </h4>
                <p className="text-[10px] text-[#748092]">Phân tích ngữ nghĩa & đoạn văn</p>
              </button>

              <button
                onClick={() => setActiveTab && setActiveTab('conversation')}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2">
                  <MessageSquare size={16} />
                </div>
                <h4 className="text-xs font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F]">
                  Hội Thoại AI
                </h4>
                <p className="text-[10px] text-[#748092]">Giao tiếp phản xạ RAG</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. GRAMMAR SENTENCE BUILDER VIEW */}
      {/* ======================================================== */}
      {practiceSkill === 'grammar' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Level Filter Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] uppercase tracking-wider">
                Chọn cấp độ HSK (Có dữ liệu thực tế)
              </span>
              <span className="text-xs font-bold text-[#E85D3F]">
                {levelGrammarItems.length} cấu trúc có sẵn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {PRACTICE_LEVELS.map((lvl) => {
                const count = GRAMMAR_DRILLS_BY_LEVEL.filter(item => item.level === lvl.level).length;
                const isSelected = selectedLevelId === lvl.level;
                return (
                  <button
                    key={lvl.id}
                    id={`grammar-level-btn-${lvl.level}`}
                    onClick={() => handleSelectGrammarLevel(lvl.level)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#1E293B] border-[#E85D3F] shadow-sm ring-2 ring-[#E85D3F]/20'
                        : 'bg-white/60 dark:bg-[#131B24]/60 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black" style={{ color: lvl.color }}>
                        {lvl.badge}
                      </span>
                      <span className="text-[10px] font-bold text-[#748092] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {count} bài
                      </span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">
                      {lvl.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grammar Question Box */}
          {levelGrammarItems.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <AlertCircle size={32} className="text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-[#243447] dark:text-white">
                Chưa có dữ liệu bài tập cho cấp độ này
              </h3>
              <p className="text-xs text-[#748092]">
                Vui lòng chọn cấp độ HSK 1 đến HSK 6 ở danh sách phía trên.
              </p>
            </div>
          ) : isGrammarLevelComplete ? (
            /* Level Complete Screen */
            <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-emerald-200 dark:border-emerald-800 shadow-lg space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mx-auto">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-black text-[#243447] dark:text-white">
                Hoàn thành cấp độ {activeLevel.badge}!
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Bạn đã luyện tập qua toàn bộ {levelGrammarItems.length} cấu trúc ngữ pháp trọng điểm của cấp độ này.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => resetGrammarQuestionState(0)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Luyện lại cấp này</span>
                </button>
                {selectedLevelId < 6 && (
                  <button
                    onClick={() => handleSelectGrammarLevel(selectedLevelId + 1)}
                    className="px-4 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#CB4529] shadow-md shadow-[#E85D3F]/25 cursor-pointer"
                  >
                    <span>Lên cấp tiếp theo</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : currentGrammarItem ? (
            /* Active Grammar Exercise */
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-lg space-y-6">
              
              {/* Card Header & Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs" style={{ backgroundColor: activeLevel.color }}>
                      {activeLevel.badge}
                    </span>
                    <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                      Cấu trúc {selectedGrammarIndex + 1}/{levelGrammarItems.length}
                    </span>
                  </div>

                  {/* Previous / Next question shortcuts */}
                  <div className="flex items-center gap-1">
                    <button
                      id="grammar-btn-prev"
                      onClick={handlePrevGrammar}
                      title="Cấu trúc trước"
                      className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      id="grammar-btn-next"
                      onClick={handleNextGrammar}
                      title="Cấu trúc sau"
                      className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#E85D3F] transition-all duration-300"
                    style={{ width: `${((selectedGrammarIndex + 1) / levelGrammarItems.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Title & Target Meaning */}
              <div className="space-y-1.5 text-center">
                <h3 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
                  {currentGrammarItem.title}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#E85D3F]">
                  Nghĩa tiếng Việt: "{currentGrammarItem.meaning}"
                </p>
                <p className="text-[11px] text-[#748092]">
                  Chạm vào các từ bên dưới để ghép thành câu hoàn chỉnh theo đúng ngữ pháp
                </p>
              </div>

              {/* Answer Drop Area */}
              <div className="p-4 sm:p-5 min-h-[90px] rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-center gap-2">
                {userGrammarTokens.length === 0 ? (
                  <span className="text-xs text-[#748092]">
                    (Khu vực hiển thị câu bạn đang ghép)
                  </span>
                ) : (
                  userGrammarTokens.map((tok, idx) => (
                    <button
                      key={idx}
                      id={`selected-token-${idx}`}
                      onClick={() => handleRemoveGrammarToken(idx)}
                      title="Nhấn để loại bỏ từ này"
                      className="px-3.5 py-2 rounded-xl bg-[#E85D3F] text-white font-['Noto_Serif_SC'] text-base font-bold shadow-xs hover:bg-red-500 transition-colors cursor-pointer active:scale-95"
                    >
                      {tok}
                    </button>
                  ))
                )}
              </div>

              {/* Word Tokens Bank */}
              <div className="space-y-1 text-center">
                <span className="text-[11px] text-[#748092] uppercase font-bold block">
                  Ngân hàng từ vựng có thể chọn:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {availableGrammarTokens.map((tok, idx) => (
                    <button
                      key={idx}
                      id={`available-token-${idx}`}
                      onClick={() => handleAddGrammarToken(tok)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white hover:border-[#E85D3F] hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {tok}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Reset & Check */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="grammar-reset-btn"
                  onClick={handleResetGrammarTokens}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Xếp lại</span>
                </button>

                <button
                  id="grammar-check-btn"
                  disabled={userGrammarTokens.length === 0 || grammarChecked}
                  onClick={handleCheckGrammar}
                  className="flex-1 py-3 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-black shadow-md shadow-[#E85D3F]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Kiểm Tra Đáp Án</span>
                  <CheckCircle2 size={16} />
                </button>
              </div>

              {/* Result Feedback Banner */}
              {grammarChecked && (
                <div className={`p-4 rounded-2xl border text-left space-y-2 animate-in fade-in ${
                  grammarIsCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {grammarIsCorrect ? (
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                      )}
                      <span className={`text-xs font-black ${
                        grammarIsCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'
                      }`}>
                        {grammarIsCorrect 
                          ? (grammarNewlyAwarded ? 'Chính xác xuất sắc! (+12 XP)' : 'Chính xác xuất sắc! (Đã ghi nhận XP)')
                          : 'Chưa đúng thứ tự, hãy thử lại!'}
                      </span>
                    </div>

                    {/* Audio read of correct sentence */}
                    <button
                      onClick={() => speakChinese(currentGrammarItem.correctTokens.join(''), 0.85)}
                      className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-black/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Nghe câu hoàn chỉnh"
                    >
                      <Volume2 size={14} />
                      <span className="hidden sm:inline">Nghe câu</span>
                    </button>
                  </div>

                  {/* Correct Sentence Display */}
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/20 text-xs">
                    <span className="font-bold text-[#748092] block mb-0.5">Đáp án chuẩn:</span>
                    <span className="font-['Noto_Serif_SC'] text-sm font-bold text-[#243447] dark:text-white">
                      {currentGrammarItem.correctTokens.join(' ')}
                    </span>
                  </div>

                  {/* Grammatical Explanation */}
                  <p className="text-xs text-[#243447] dark:text-[#E2E8F0] leading-relaxed">
                    💡 <strong>Quy tắc:</strong> {currentGrammarItem.explanation}
                  </p>

                  <button
                    id="grammar-next-question-btn"
                    onClick={handleNextGrammar}
                    className="w-full mt-2 py-2.5 rounded-xl bg-[#243447] text-white hover:bg-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{selectedGrammarIndex === levelGrammarItems.length - 1 ? 'Xem kết quả cấp độ' : 'Cấu trúc tiếp theo'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

            </div>
          ) : null}

        </div>
      )}

      {/* ======================================================== */}
      {/* 4. LISTENING DRILL VIEW */}
      {/* ======================================================== */}
      {practiceSkill === 'listening' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Level Filter Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] uppercase tracking-wider">
                Chọn cấp độ HSK (Có bài nghe thực tế)
              </span>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                {levelListeningItems.length} bài nghe có sẵn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {PRACTICE_LEVELS.map((lvl) => {
                const count = LISTENING_DRILLS_BY_LEVEL.filter(item => item.level === lvl.level).length;
                const isSelected = selectedLevelId === lvl.level;
                return (
                  <button
                    key={lvl.id}
                    id={`listening-level-btn-${lvl.level}`}
                    onClick={() => handleSelectListeningLevel(lvl.level)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#1E293B] border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                        : 'bg-white/60 dark:bg-[#131B24]/60 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black" style={{ color: lvl.color }}>
                        {lvl.badge}
                      </span>
                      <span className="text-[10px] font-bold text-[#748092] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {count} bài
                      </span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">
                      {lvl.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listening Box */}
          {levelListeningItems.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <AlertCircle size={32} className="text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-[#243447] dark:text-white">
                Chưa có dữ liệu bài nghe cho cấp độ này
              </h3>
              <p className="text-xs text-[#748092]">
                Vui lòng chọn cấp độ HSK 1 đến HSK 6 ở danh sách phía trên.
              </p>
            </div>
          ) : isListeningLevelComplete ? (
            /* Level Complete Screen */
            <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-sky-200 dark:border-sky-800 shadow-lg space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 flex items-center justify-center mx-auto">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-black text-[#243447] dark:text-white">
                Hoàn thành bài nghe {activeLevel.badge}!
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Bạn đã hoàn thành toàn bộ {levelListeningItems.length} thử thách nghe hiểu phản xạ của cấp độ này.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => resetListeningQuestionState(0)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Nghe lại cấp này</span>
                </button>
                {selectedLevelId < 6 && (
                  <button
                    onClick={() => handleSelectListeningLevel(selectedLevelId + 1)}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-sky-700 shadow-md shadow-sky-600/25 cursor-pointer"
                  >
                    <span>Lên cấp tiếp theo</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : currentListeningItem ? (
            /* Active Listening Exercise */
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-lg space-y-6">
              
              {/* Header & Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs" style={{ backgroundColor: activeLevel.color }}>
                      {activeLevel.badge}
                    </span>
                    <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                      Câu hỏi {selectedListeningIndex + 1}/{levelListeningItems.length}
                    </span>
                  </div>

                  {/* Previous / Next question shortcuts */}
                  <div className="flex items-center gap-1">
                    <button
                      id="listening-btn-prev"
                      onClick={handlePrevListening}
                      title="Câu hỏi trước"
                      className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      id="listening-btn-next"
                      onClick={handleNextListening}
                      title="Câu hỏi sau"
                      className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${((selectedListeningIndex + 1) / levelListeningItems.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Sound Prompt Stage */}
              <div className="p-6 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-4">
                
                {/* Audio Animated Headphones Icon */}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md transition-all ${
                  isPlayingAudio 
                    ? 'bg-sky-500 text-white shadow-sky-500/30 scale-105 animate-pulse' 
                    : 'bg-[#E85D3F] text-white shadow-[#E85D3F]/30'
                }`}>
                  <Headphones size={36} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-black text-[#243447] dark:text-white">
                    {currentListeningItem.question}
                  </p>
                  <p className="text-xs text-[#748092]">
                    Bấm nút phát bên dưới để nghe âm thanh và chọn đáp án chính xác
                  </p>
                </div>

                {/* Audio Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {isPlayingAudio ? (
                    <button
                      id="listening-stop-btn"
                      onClick={handleStopListeningAudio}
                      className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 hover:bg-red-600 transition-all shadow-sm cursor-pointer"
                    >
                      <Square size={14} className="fill-white" />
                      <span>Dừng phát</span>
                    </button>
                  ) : (
                    <button
                      id="listening-play-btn"
                      onClick={() => handlePlayListeningAudio()}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-sky-700 transition-all shadow-md shadow-sky-600/25 cursor-pointer active:scale-95"
                    >
                      <Play size={14} className="fill-white" />
                      <span>Phát âm thanh</span>
                    </button>
                  )}

                  {/* Playback speed toggle */}
                  <button
                    onClick={() => {
                      playClickSound();
                      const nextSpeed = playbackSpeed === 0.85 ? 0.70 : 0.85;
                      setPlaybackSpeed(nextSpeed);
                      handlePlayListeningAudio(nextSpeed);
                    }}
                    title="Chuyển đổi tốc độ đọc"
                    className="px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Tốc độ: {playbackSpeed === 0.85 ? '0.85x (Chuẩn)' : '0.70x (Chậm)'}
                  </button>

                  {/* Accessibility transcript hint toggle */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowTranscriptHint(prev => !prev);
                    }}
                    title="Xem bản ghi văn bản & phiên âm (Hỗ trợ người học và người khó nghe)"
                    className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                  >
                    {showTranscriptHint ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Speech Support Warning Notice */}
                {!hasVoiceSupport && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-xl">
                    ⚠️ Trình duyệt của bạn chưa phát hiện gói giọng tiếng Trung TTS. Khuyến nghị sử dụng Google Chrome để có trải nghiệm âm thanh tốt nhất.
                  </p>
                )}

                {/* Optional Hint Transcript */}
                {showTranscriptHint && (
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs animate-in fade-in">
                    <span className="font-bold text-sky-800 dark:text-sky-300 block mb-0.5">
                      Bản ghi văn bản & Phiên âm (Hỗ trợ tiếp cận):
                    </span>
                    <span className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white mr-2">
                      {currentListeningItem.hanzi}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({currentListeningItem.audioText})
                    </span>
                  </div>
                )}

              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentListeningItem.options.map((option, idx) => {
                  const isSelected = listeningSelectedOption === idx;
                  const isCorrectOption = idx === currentListeningItem.correctIndex;
                  let btnStyle = 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-sky-500';

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

              {/* Result Explanation Banner */}
              {listeningChecked && (
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    {listeningSelectedOption === currentListeningItem.correctIndex ? (
                      <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                    )}
                    <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                      {listeningSelectedOption === currentListeningItem.correctIndex
                        ? (listeningNewlyAwarded ? 'Chính xác! (+10 XP)' : 'Chính xác! (Đã ghi nhận XP)')
                        : `Chưa đúng! Đáp án đúng là: ${currentListeningItem.options[currentListeningItem.correctIndex]}`}
                    </span>
                  </div>

                  <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
                    💡 <strong>Giải thích:</strong> {currentListeningItem.explanation}
                  </p>

                  <button
                    id="listening-next-question-btn"
                    onClick={handleNextListening}
                    className="w-full mt-2 py-2.5 rounded-xl bg-[#243447] text-white hover:bg-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{selectedListeningIndex === levelListeningItems.length - 1 ? 'Xem kết quả bài nghe' : 'Câu tiếp theo'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

            </div>
          ) : null}

        </div>
      )}

    </div>
  );
}
