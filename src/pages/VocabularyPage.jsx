import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  RotateCw, 
  Check, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  CreditCard, 
  Plus, 
  Trash2, 
  Sparkles, 
  Filter, 
  X, 
  Zap, 
  CheckCircle2,
  Download,
  PenTool,
  Mic,
  Flame,
  Keyboard,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Layers,
  BookOpen,
  BookmarkPlus,
  BookmarkCheck,
  Info,
  ExternalLink
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import { VOCABULARY_LIST, TOPIC_FILTERS } from '../data/chineseData';
import { getStoredCustomVocab, saveCustomVocab, deleteCustomVocab } from '../utils/materialsStorage';
import { triggerCloudSync, getVocabularyFromDb, addVocabularyToDb } from '../supabase/services';
import { awardXp, getUserStorageKey, getLocalDateString } from '../utils/gamification';
import { calculateNextSrsReview, SRS_QUALITY, calculateSrsStats, isCardDueForReview, captureWeakVocabulary } from '../utils/srsEngine';
import { saveUserVocabSrsCard, syncUserVocabSrsFromCloud, updateDailyMissionProgress } from '../services';
import AiContextBadge from '../components/personalization/AiContextBadge.jsx';
import { getPersonalizedExercises } from '../services/aiGateway.js';
import { searchDictionaryPaginated, formatDictionaryItemForDisplay } from '../services/dictionaryService.js';

const STORAGE_REMEMBERED = 'hanzigo_vocab_remembered';
const STORAGE_REVIEW = 'hanzigo_vocab_review';
const STORAGE_SRS_STATE = 'hanzigo_vocab_srs_state';

// Quick suggestion templates for rapid vocabulary addition
const QUICK_VOCAB_SUGGESTIONS = [
  {
    hanzi: '猫',
    pinyin: 'māo',
    hanviet: 'Miêu',
    meaning: 'Con mèo',
    level: 'HSK 1',
    topic: 'Đời sống',
    radical: '犭(Khuyển)',
    strokes: 11,
    mnemonic: 'Loài thú bốn chân (犭) kêu meo meo săn chuột trên đồng ruộng (苗).',
    exampleHanzi: '我家有一只可爱的小猫。',
    examplePinyin: 'Wǒ jiā yǒu yì zhī kě’ài de xiǎomāo.',
    exampleMeaning: 'Nhà tôi có một chú mèo con rất đáng yêu.'
  },
  {
    hanzi: '咖啡',
    pinyin: 'kāfēi',
    hanviet: 'Cà phê',
    meaning: 'Cà phê',
    level: 'HSK 2',
    topic: 'Ăn uống',
    radical: '口 (Khẩu)',
    strokes: 16,
    mnemonic: 'Đồ uống dùng miệng (口) thưởng thức từng ngụm thơm nồng đậm đà.',
    exampleHanzi: '你想喝热咖啡还是冰咖啡？',
    examplePinyin: 'Nǐ xiǎng hē rè kāfēi háishi bīng kāfēi?',
    exampleMeaning: 'Bạn muốn uống cà phê nóng hay cà phê đá?'
  },
  {
    hanzi: '奶茶',
    pinyin: 'nǎichá',
    hanviet: 'Nãi trà',
    meaning: 'Trà sữa',
    level: 'HSK 2',
    topic: 'Ăn uống',
    radical: '女 (Nữ) + 艹 (Thảo)',
    strokes: 14,
    mnemonic: 'Sự hòa quyện tuyệt vời giữa sữa béo ngậy (奶) và hương thơm lá trà (茶).',
    exampleHanzi: '下午我们一起去买一杯珍珠奶茶吧！',
    examplePinyin: 'Xiàwǔ wǒmen yìqǐ qù mǎi yì bēi zhēnzhū nǎichá ba!',
    exampleMeaning: 'Chiều nay chúng mình cùng đi mua một ly trà sữa trân châu nhé!'
  },
  {
    hanzi: '漂亮',
    pinyin: 'piàoliang',
    hanviet: 'Phiêu lượng',
    meaning: 'Xinh đẹp, đẹp đẽ',
    level: 'HSK 1',
    topic: 'Cảm xúc',
    radical: '氵(Chấm thủy)',
    strokes: 14,
    mnemonic: 'Dòng nước (氵) trong veo phản chiếu ánh sáng (亮) thanh tú rực rỡ.',
    exampleHanzi: '这件中国传统旗袍真漂亮！',
    examplePinyin: 'Zhè jiàn Zhōngguó chuántǒng qípáo zhēn piàoliang!',
    exampleMeaning: 'Bộ sườn xám truyền thống Trung Quốc này thật xinh đẹp!'
  },
  {
    hanzi: '手机',
    pinyin: 'shǒujī',
    hanviet: 'Thủ cơ',
    meaning: 'Điện thoại di động',
    level: 'HSK 2',
    topic: 'Công nghệ',
    radical: '手 (Thủ) + 木 (Mộc)',
    strokes: 10,
    mnemonic: 'Thiết bị máy móc (机) nhỏ gọn luôn cầm trên tay (手) kết nối mọi người.',
    exampleHanzi: '请把你的手机号码告诉我。',
    examplePinyin: 'Qǐng bǎ nǐ de shǒujī hàomǎ gàosu wǒ.',
    exampleMeaning: 'Xin hãy cho tôi biết số điện thoại của bạn.'
  },
  {
    hanzi: '学习',
    pinyin: 'xuéxí',
    hanviet: 'Học tập',
    meaning: 'Học tập, rèn luyện',
    level: 'HSK 1',
    topic: 'Trường học',
    radical: '子 (Tử) + 乙 (Ất)',
    strokes: 11,
    mnemonic: 'Học hỏi (学) kiến thức mới rồi phải siêng năng thực hành (习) như chim non tập bay.',
    exampleHanzi: '我们每天都在HanziGo努力学习汉语。',
    examplePinyin: 'Wǒmen měitiān dōu zài HanziGo nǔlì xuéxí Hànyǔ.',
    exampleMeaning: 'Chúng tôi mỗi ngày đều nỗ lực học tiếng Trung trên HanziGo.'
  }
];

// Helper to normalize vocabulary shape across local & Supabase sources
function normalizeVocab(item) {
  let exampleObj = null;
  if (item.example) {
    if (typeof item.example === 'object' && item.example.hanzi) {
      exampleObj = item.example;
    } else if (typeof item.example === 'string' && item.example.trim()) {
      exampleObj = {
        hanzi: item.example,
        pinyin: item.examplePinyin || item.example_pinyin || '',
        meaning: item.exampleMeaning || item.example_meaning || ''
      };
    }
  } else if (item.example_hanzi) {
    exampleObj = {
      hanzi: item.example_hanzi,
      pinyin: item.example_pinyin || '',
      meaning: item.example_meaning || ''
    };
  }

  return {
    id: String(item.id || `vocab-${item.hanzi}`),
    hanzi: item.hanzi,
    pinyin: item.pinyin || '',
    hanviet: item.hanviet || '',
    meaning: item.meaning || '',
    level: item.level || item.hsk || 'HSK 1',
    topic: item.topic || 'Đời sống',
    radical: item.radical || '—',
    strokes: Number(item.strokes) || Number(item.strokeCount) || 5,
    mnemonic: item.mnemonic || item.memoryTip || 'Ghi nhớ cấu trúc bộ thủ và hình tượng của chữ.',
    example: exampleObj,
    isCustom: !!item.isCustom
  };
}

export default function VocabularyPage({ user, setActiveTab, onSelectWriting, onSelectPronounce }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');
  const [selectedHsk, setSelectedHsk] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'remembered', 'review', 'custom'
  const [lengthFilter, setLengthFilter] = useState('all'); // 'all', 'single', 'compound'
  const [viewMode, setViewMode] = useState('flashcard'); // 'flashcard', 'grid', 'quiz', 'dictionary'

  // Phase 16: Kho từ điển mở rộng quy mô lớn (120.000+ từ)
  const [dictQuery, setDictQuery] = useState('');
  const [dictHsk, setDictHsk] = useState('ALL');
  const [dictPage, setDictPage] = useState(1);
  const [dictPageSize] = useState(24);
  const [dictResults, setDictResults] = useState([]);
  const [dictTotal, setDictTotal] = useState(0);
  const [dictTotalPages, setDictTotalPages] = useState(1);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictSource, setDictSource] = useState('cloud');
  const [selectedDictWord, setSelectedDictWord] = useState(null);
  const [savedDictWords, setSavedDictWords] = useState(new Set());

  // Hiệu ứng tải dữ liệu phân trang kho từ điển 120.000 từ khi mở tab dictionary
  useEffect(() => {
    if (viewMode !== 'dictionary') return;
    let isCancelled = false;
    setDictLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await searchDictionaryPaginated({
          query: dictQuery,
          hskLevel: dictHsk,
          page: dictPage,
          pageSize: dictPageSize
        });
        if (!isCancelled && res) {
          setDictResults(res.entries || []);
          setDictTotal(res.totalCount || 0);
          setDictTotalPages(res.totalPages || 1);
          setDictSource(res.source || 'cloud');
          setDictLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('Error fetching paginated dictionary:', err);
          setDictLoading(false);
        }
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [viewMode, dictQuery, dictHsk, dictPage, dictPageSize]);

  // Lưu từ điển vào Flashcard / SRS cá nhân (không tải 120k từ vào DB người dùng)
  const handleSaveDictToSrs = (e, item) => {
    if (e && e.stopPropagation) e.stopPropagation();
    playClickSound();
    try {
      saveCustomVocab({
        hanzi: item.hanzi || item.simplified,
        pinyin: item.pinyin,
        hanviet: item.hanviet,
        meaning: item.meaningVi || (item.definitions?.[0] ? `(Định nghĩa) ${item.definitions[0]}` : item.meaningEn),
        level: item.level || 'Tự chọn',
        topic: item.topic || 'Từ điển CC-CEDICT'
      });
      captureWeakVocabulary(item, 'dictionary', user);
      awardXp(10, user, `dict_save_${item.hanzi || item.simplified}`);
      playSuccessSound();
      setSavedDictWords(prev => new Set([...prev, item.hanzi || item.simplified]));
    } catch (err) {
      console.warn('Error saving dictionary item to SRS:', err);
    }
  };

  // Master vocabulary state initialized lazily from storage + static data
  const [allVocabList, setAllVocabList] = useState(() => {
    try {
      const custom = getStoredCustomVocab();
      const normalizedCustom = custom.map(normalizeVocab);
      const normalizedStatic = VOCABULARY_LIST.map(normalizeVocab);
      const map = new Map();
      normalizedStatic.forEach(item => map.set(item.hanzi, item));
      normalizedCustom.forEach(item => map.set(item.hanzi, item));
      return Array.from(map.values());
    } catch (e) {
      console.error('Error loading vocabulary list:', e);
      return VOCABULARY_LIST.map(normalizeVocab);
    }
  });

  // Fetch all words from Supabase on mount and synchronize seamlessly
  useEffect(() => {
    let isMounted = true;
    getVocabularyFromDb().then(dbItems => {
      if (!isMounted || !dbItems || dbItems.length === 0) return;
      const normalizedDb = dbItems.map(normalizeVocab);
      setAllVocabList(prev => {
        const map = new Map();
        // 1. Static base list
        VOCABULARY_LIST.map(normalizeVocab).forEach(item => map.set(item.hanzi, item));
        // 2. Previous in-memory items
        prev.forEach(item => map.set(item.hanzi, item));
        // 3. Supabase DB items (latest authority)
        normalizedDb.forEach(item => map.set(item.hanzi, item));
        // 4. Custom user created items
        const custom = getStoredCustomVocab().map(normalizeVocab);
        custom.forEach(item => map.set(item.hanzi, item));
        return Array.from(map.values());
      });
    });
    return () => { isMounted = false; };
  }, []);

  // Flashcard interaction state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const isRatingRef = useRef(false);

  // Spaced Repetition status tracking (persisted in localStorage per user)
  const [rememberedIds, setRememberedIds] = useState(() => {
    try {
      const key = getUserStorageKey(STORAGE_REMEMBERED, user);
      const saved = localStorage.getItem(key) || (user ? null : localStorage.getItem(STORAGE_REMEMBERED));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [reviewIds, setReviewIds] = useState(() => {
    try {
      const key = getUserStorageKey(STORAGE_REVIEW, user);
      const saved = localStorage.getItem(key) || (user ? null : localStorage.getItem(STORAGE_REVIEW));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // SM-2 Spaced Repetition State Map (persisted per user)
  const [srsMap, setSrsMap] = useState(() => {
    try {
      const key = getUserStorageKey(STORAGE_SRS_STATE, user);
      const saved = localStorage.getItem(key) || (user ? null : localStorage.getItem(STORAGE_SRS_STATE));
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Hydrate cross-device SRS cards from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const targetUid = user?.id || user?.uid;
    if (targetUid) {
      syncUserVocabSrsFromCloud(targetUid).then(res => {
        if (res && isMounted) {
          if (res.srsMap) setSrsMap(res.srsMap);
          if (res.remembered) setRememberedIds(res.remembered);
          if (res.review) setReviewIds(res.review);
        }
      });
    }
    return () => { isMounted = false; };
  }, [user]);

  // Synchronize immediately when words are captured from Reader, Command Palette or Quiz
  useEffect(() => {
    const handleSrsUpdate = () => {
      try {
        const key = getUserStorageKey(STORAGE_SRS_STATE, user);
        const saved = localStorage.getItem(key) || (user ? null : localStorage.getItem(STORAGE_SRS_STATE));
        if (saved) setSrsMap(JSON.parse(saved));
        const custom = getStoredCustomVocab().map(normalizeVocab);
        const map = new Map();
        VOCABULARY_LIST.map(normalizeVocab).forEach(item => map.set(item.hanzi, item));
        allVocabList.forEach(item => map.set(item.hanzi, item));
        custom.forEach(item => map.set(item.hanzi, item));
        setAllVocabList(Array.from(map.values()));
      } catch {}
    };

    window.addEventListener('hanzigo_srs_updated', handleSrsUpdate);
    window.addEventListener('hanzigo_vocab_saved', handleSrsUpdate);
    return () => {
      window.removeEventListener('hanzigo_srs_updated', handleSrsUpdate);
      window.removeEventListener('hanzigo_vocab_saved', handleSrsUpdate);
    };
  }, [user, allVocabList]);

  // Add Custom Vocabulary Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHanzi, setNewHanzi] = useState('');
  const [newPinyin, setNewPinyin] = useState('');
  const [newHanviet, setNewHanviet] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newLevel, setNewLevel] = useState('HSK 1');
  const [newTopic, setNewTopic] = useState('Đời sống');
  const [newRadical, setNewRadical] = useState('');
  const [newStrokes, setNewStrokes] = useState('');
  const [newMnemonic, setNewMnemonic] = useState('');
  const [newExampleHanzi, setNewExampleHanzi] = useState('');
  const [newExamplePinyin, setNewExamplePinyin] = useState('');
  const [newExampleMeaning, setNewExampleMeaning] = useState('');
  const [aiGeneratedExample, setAiGeneratedExample] = useState(null);
  const [isGeneratingExample, setIsGeneratingExample] = useState(false);

  // Auto-detect vocabulary when typing in Add Modal
  const matchedVocabInDict = useMemo(() => {
    const clean = newHanzi.trim();
    if (!clean) return null;
    return VOCABULARY_LIST.find(v => v.hanzi === clean) || null;
  }, [newHanzi]);

  // Quiz Mode State
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Dynamic counts per HSK Level
  const hskCounts = useMemo(() => {
    const counts = { 'HSK 1': 0, 'HSK 2': 0, 'HSK 3': 0, 'HSK 4': 0, 'HSK 5-6': 0 };
    allVocabList.forEach(v => {
      const lvl = v.level || 'HSK 1';
      if (lvl === 'HSK 5-6' || lvl === 'HSK 5' || lvl === 'HSK 6') {
        counts['HSK 5-6'] = (counts['HSK 5-6'] || 0) + 1;
      } else if (counts[lvl] !== undefined) {
        counts[lvl] = (counts[lvl] || 0) + 1;
      } else {
        counts[lvl] = 1;
      }
    });
    return counts;
  }, [allVocabList]);

  // SRS Analytics & 7-day forecast
  const srsStats = useMemo(() => {
    const cards = allVocabList.map(v => ({
      ...v,
      ...(srsMap[v.hanzi] || {})
    }));
    return calculateSrsStats(cards);
  }, [allVocabList, srsMap]);

  // Filtered vocabularies
  const filteredVocab = useMemo(() => {
    return allVocabList.filter((item) => {
      const matchesSearch = 
        item.hanzi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hanviet.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTopic = selectedTopic === 'Tất cả' || item.topic === selectedTopic;
      const matchesHsk = selectedHsk === 'all'
        ? true
        : selectedHsk === 'HSK 5-6'
          ? (item.level === 'HSK 5-6' || item.level === 'HSK 5' || item.level === 'HSK 6')
          : item.level === selectedHsk;

      let matchesStatus = true;
      if (statusFilter === 'remembered') {
        matchesStatus = rememberedIds.includes(item.id);
      } else if (statusFilter === 'review') {
        matchesStatus = reviewIds.includes(item.id);
      } else if (statusFilter === 'custom') {
        matchesStatus = !!item.isCustom;
      } else if (statusFilter === 'srs_priority') {
        matchesStatus = reviewIds.includes(item.id) || !rememberedIds.includes(item.id);
      } else if (statusFilter === 'due') {
        matchesStatus = isCardDueForReview(srsMap[item.hanzi] || item);
      } else if (statusFilter === 'leeches') {
        matchesStatus = (srsMap[item.hanzi]?.lapseCount || srsMap[item.hanzi]?.lapse_count || 0) >= 3;
      }

      let matchesLength = true;
      if (lengthFilter === 'single') {
        matchesLength = item.hanzi.length === 1;
      } else if (lengthFilter === 'compound') {
        matchesLength = item.hanzi.length > 1;
      }

      return matchesSearch && matchesTopic && matchesHsk && matchesStatus && matchesLength;
    });
  }, [allVocabList, searchTerm, selectedTopic, selectedHsk, statusFilter, lengthFilter, rememberedIds, reviewIds, srsMap]);

  const currentCard = filteredVocab[currentIndex] || filteredVocab[0];

  // Dynamic estimated next review intervals for current card across 4 SM-2 grades
  const srsPreview = useMemo(() => {
    if (!currentCard) return { again: 1, hard: 1, good: 1, easy: 4 };
    const cur = srsMap[currentCard.hanzi] || { repetitions: 0, intervalDays: 1, easeFactor: 2.50 };
    return {
      again: calculateNextSrsReview(cur, SRS_QUALITY.AGAIN).intervalDays,
      hard: calculateNextSrsReview(cur, SRS_QUALITY.HARD).intervalDays,
      good: calculateNextSrsReview(cur, SRS_QUALITY.GOOD).intervalDays,
      easy: calculateNextSrsReview(cur, SRS_QUALITY.EASY).intervalDays
    };
  }, [currentCard, srsMap]);

  // Flip card
  const handleFlip = useCallback(() => {
    playClickSound();
    setIsFlipped(prev => !prev);
  }, []);

  // Next & Prev card
  const handleNextCard = useCallback(() => {
    playClickSound();
    setIsFlipped(false);
    setAiGeneratedExample(null);
    setCurrentIndex(prev => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
  }, [filteredVocab.length]);

  const handlePrevCard = useCallback(() => {
    playClickSound();
    setIsFlipped(false);
    setAiGeneratedExample(null);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, filteredVocab.length - 1)));
  }, [filteredVocab.length]);

  // AI Contextual Example generator
  const handleGenerateAiExample = useCallback(async (card) => {
    if (!card) return;
    setIsGeneratingExample(true);
    try {
      const res = await getPersonalizedExercises(card.hanzi, card.level, 'contextual_sentence', user);
      if (res && res.data && res.data.drills && res.data.drills.length > 0) {
        setAiGeneratedExample(res.data.drills[0]);
        playSuccessSound();
      }
    } catch (err) {
      console.warn('AI example generation notice:', err.message);
    } finally {
      setIsGeneratingExample(false);
    }
  }, [user]);

  // Handle SM-2 Spaced Repetition Rating (4-tier standard with double-click protection)
  const handleSrsRate = useCallback((card, quality) => {
    if (!card || isRatingRef.current) return;
    isRatingRef.current = true;
    setTimeout(() => { isRatingRef.current = false; }, 350);

    const currentSrs = srsMap[card.hanzi] || { repetitions: 0, intervalDays: 1, easeFactor: 2.50 };
    const nextSrs = calculateNextSrsReview(currentSrs, quality);

    setSrsMap(prev => {
      const updated = { ...prev, [card.hanzi]: nextSrs };
      try {
        const key = getUserStorageKey(STORAGE_SRS_STATE, user);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (quality >= SRS_QUALITY.GOOD) {
      playSuccessSound();
      const xpEarned = quality === SRS_QUALITY.EASY ? 15 : 10;
      awardXp(xpEarned, user, `vocab_srs_${card.hanzi}_${getLocalDateString()}`);
      updateDailyMissionProgress('vocab_review', 1, user);
      
      setRememberedIds(prev => {
        const next = prev.includes(card.id) ? prev : [...prev, card.id];
        try {
          const key = getUserStorageKey(STORAGE_REMEMBERED, user);
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });

      setReviewIds(prev => {
        const next = prev.filter(item => item !== card.id);
        try {
          const key = getUserStorageKey(STORAGE_REVIEW, user);
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    } else {
      playClickSound();
      if (quality === SRS_QUALITY.HARD) {
        awardXp(5, user, `vocab_srs_hard_${card.hanzi}_${getLocalDateString()}`);
      }
      updateDailyMissionProgress('vocab_review', 1, user);

      setReviewIds(prev => {
        const next = prev.includes(card.id) ? prev : [...prev, card.id];
        try {
          const key = getUserStorageKey(STORAGE_REVIEW, user);
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });

      if (quality === SRS_QUALITY.AGAIN) {
        setRememberedIds(prev => {
          const next = prev.filter(item => item !== card.id);
          try {
            const key = getUserStorageKey(STORAGE_REMEMBERED, user);
            localStorage.setItem(key, JSON.stringify(next));
          } catch {}
          return next;
        });
      }
    }

    // Sync to Supabase user_vocab_srs table
    try {
      const targetUid = user?.uid || user?.id;
      if (targetUid) {
        saveUserVocabSrsCard(targetUid, {
          hanzi: card.hanzi,
          pinyin: card.pinyin,
          meaning: card.meaning,
          level: card.level,
          ...nextSrs
        });
      }
    } catch (e) {
      console.warn('SRS DB sync notice:', e);
    }

    triggerCloudSync(user?.uid || user?.id);
    handleNextCard();
  }, [srsMap, user, handleNextCard]);

  // Backward-compatible triggers
  const handleMarkRemembered = useCallback((id) => {
    const card = allVocabList.find(v => v.id === id);
    handleSrsRate(card, SRS_QUALITY.GOOD);
  }, [allVocabList, handleSrsRate]);

  const handleMarkReview = useCallback((id) => {
    const card = allVocabList.find(v => v.id === id);
    handleSrsRate(card, SRS_QUALITY.FORGOT);
  }, [allVocabList, handleSrsRate]);

  // Keyboard navigation for Flashcards
  useEffect(() => {
    if (viewMode !== 'flashcard' || showAddModal) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === '1' || e.key === 'r' || e.key === 'R') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.AGAIN);
      } else if (e.key === '2') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.HARD);
      } else if (e.key === '3' || e.key === 'm' || e.key === 'M') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.GOOD);
      } else if (e.key === '4') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.EASY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, showAddModal, currentCard, handleFlip, handleNextCard, handlePrevCard, handleMarkReview, handleMarkRemembered]);

  // Quick fill suggestion in Add Modal
  const handleApplySuggestion = (sug) => {
    playClickSound();
    setNewHanzi(sug.hanzi);
    setNewPinyin(sug.pinyin);
    setNewHanviet(sug.hanviet);
    setNewMeaning(sug.meaning);
    setNewLevel(sug.level);
    setNewTopic(sug.topic);
    setNewRadical(sug.radical);
    setNewStrokes(String(sug.strokes));
    setNewMnemonic(sug.mnemonic);
    setNewExampleHanzi(sug.exampleHanzi || '');
    setNewExamplePinyin(sug.examplePinyin || '');
    setNewExampleMeaning(sug.exampleMeaning || '');
  };

  const handleApplyDictMatch = () => {
    if (!matchedVocabInDict) return;
    playClickSound();
    setNewPinyin(matchedVocabInDict.pinyin || '');
    setNewHanviet(matchedVocabInDict.hanviet || '');
    setNewMeaning(matchedVocabInDict.meaning || '');
    setNewLevel(matchedVocabInDict.level || 'HSK 1');
    setNewTopic(matchedVocabInDict.topic || 'Đời sống');
    setNewRadical(matchedVocabInDict.radical || '—');
    setNewStrokes(String(matchedVocabInDict.strokes || 5));
    if (matchedVocabInDict.mnemonic) setNewMnemonic(matchedVocabInDict.mnemonic);
    if (matchedVocabInDict.example) {
      setNewExampleHanzi(matchedVocabInDict.example.hanzi || '');
      setNewExamplePinyin(matchedVocabInDict.example.pinyin || '');
      setNewExampleMeaning(matchedVocabInDict.example.meaning || '');
    }
  };

  // Submit new custom vocabulary
  const handleAddNewVocab = (e) => {
    e.preventDefault();
    if (!newHanzi.trim() || !newMeaning.trim()) return;

    playClickSound();

    let exampleObj = null;
    if (newExampleHanzi.trim()) {
      exampleObj = {
        hanzi: newExampleHanzi.trim(),
        pinyin: newExamplePinyin.trim(),
        meaning: newExampleMeaning.trim()
      };
    }

    const newVocabItem = {
      id: `custom-vocab-${Date.now()}`,
      hanzi: newHanzi.trim(),
      pinyin: newPinyin.trim() || '...',
      hanviet: newHanviet.trim() || '...',
      meaning: newMeaning.trim(),
      level: newLevel || 'HSK 1',
      topic: newTopic || 'Đời sống',
      radical: newRadical.trim() || '—',
      strokes: parseInt(newStrokes, 10) || newHanzi.trim().length * 4,
      mnemonic: newMnemonic.trim() || 'Ghi nhớ qua cách chiết tự và ngữ cảnh sử dụng thực tế.',
      example: exampleObj,
      isCustom: true
    };

    // 1. Save to local storage
    saveCustomVocab(newVocabItem);
    awardXp(15);

    // 2. Save directly to Supabase cloud
    const cloudPayload = {
      hanzi: newVocabItem.hanzi,
      pinyin: newVocabItem.pinyin,
      hanviet: newVocabItem.hanviet,
      meaning: newVocabItem.meaning,
      level: newVocabItem.level,
      topic: newVocabItem.topic,
      radical: newVocabItem.radical,
      strokes: newVocabItem.strokes,
      mnemonic: newVocabItem.mnemonic,
      example_hanzi: newVocabItem.example?.hanzi || '',
      example_pinyin: newVocabItem.example?.pinyin || '',
      example_meaning: newVocabItem.example?.meaning || ''
    };
    addVocabularyToDb(cloudPayload);
    triggerCloudSync();

    // 3. Update in-memory state
    const updatedAll = [normalizeVocab(newVocabItem), ...allVocabList];
    setAllVocabList(updatedAll);
    setCurrentIndex(0);
    setIsFlipped(false);

    playSuccessSound();
    setShowAddModal(false);

    // Reset form
    setNewHanzi('');
    setNewPinyin('');
    setNewHanviet('');
    setNewMeaning('');
    setNewRadical('');
    setNewStrokes('');
    setNewMnemonic('');
    setNewExampleHanzi('');
    setNewExamplePinyin('');
    setNewExampleMeaning('');
  };

  // Delete a user custom vocab
  const handleDeleteCustomItem = (id, e) => {
    if (e) e.stopPropagation();
    playClickSound();
    if (!window.confirm('Bạn có chắc muốn xóa từ vựng này khỏi danh sách cá nhân?')) return;

    deleteCustomVocab(id);
    const updated = allVocabList.filter(item => item.id !== id);
    setAllVocabList(updated);

    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  // Export current list to CSV (UTF-8 with BOM for Excel & Anki)
  const handleExportCsv = () => {
    playClickSound();
    if (filteredVocab.length === 0) return;

    const headers = ['Chữ Hán (Giản thể)', 'Chữ Phồn thể', 'Pinyin', 'Hán-Việt', 'Từ loại', 'Nghĩa tiếng Việt', 'Tiếng Anh (CC-CEDICT)', 'Cấp độ', 'Chủ đề', 'Bộ thủ', 'Số nét', 'Chiết tự', 'Ví dụ'];
    const rows = filteredVocab.map(v => [
      `"${v.hanzi}"`,
      `"${v.traditional || v.hanzi}"`,
      `"${v.pinyin}"`,
      `"${v.hanviet}"`,
      `"${v.pos || ''}"`,
      `"${v.meaning}"`,
      `"${v.en || ''}"`,
      `"${v.level}"`,
      `"${v.topic}"`,
      `"${v.radical}"`,
      `"${v.strokes}"`,
      `"${(v.mnemonic || '').replace(/"/g, '""')}"`,
      `"${(v.example?.hanzi || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hanzigo-tu-vung-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quiz Options generator for current card
  const quizOptions = useMemo(() => {
    if (!currentCard) return [];
    const correctMeaning = currentCard.meaning;
    const otherMeanings = allVocabList
      .filter(item => item.id !== currentCard.id && item.meaning !== correctMeaning)
      .map(item => item.meaning);

    if (otherMeanings.length === 0) return [correctMeaning];

    const charCodeSum = (currentCard.hanzi || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const distractor1 = otherMeanings[charCodeSum % otherMeanings.length];
    const distractor2 = otherMeanings[(charCodeSum + 3) % otherMeanings.length];
    const distractor3 = otherMeanings[(charCodeSum + 7) % otherMeanings.length];

    const uniqueDistractors = Array.from(new Set([distractor1, distractor2, distractor3]))
      .filter(m => m && m !== correctMeaning);

    const position = charCodeSum % (uniqueDistractors.length + 1);
    const result = [...uniqueDistractors];
    result.splice(position, 0, correctMeaning);
    return result;
  }, [currentCard, allVocabList]);

  const handleQuizAnswer = (option) => {
    if (quizAnswered) return;
    setSelectedOption(option);
    setQuizAnswered(true);

    if (option === currentCard.meaning) {
      playSuccessSound();
      setQuizScore(prev => prev + 1);
      const newStreak = quizStreak + 1;
      setQuizStreak(newStreak);
      awardXp(10);

      if (newStreak > 0 && newStreak % 5 === 0) {
        try {
          confetti({
            particleCount: 55,
            spread: 65,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    } else {
      playErrorSound();
      setQuizStreak(0);
    }
  };

  const handleNextQuizCard = () => {
    playClickSound();
    setQuizAnswered(false);
    setSelectedOption(null);
    handleNextCard();
  };

  // Progress metrics
  const totalVocabCount = allVocabList.length || 1;
  const progressPercent = Math.round((rememberedIds.length / totalVocabCount) * 100);
  const customVocabCount = allVocabList.filter(item => item.isCustom).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Stats Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            Học Sâu Qua Spaced Repetition & Tự Tạo Từ Điển
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
              Kho Flashcard Từ Vựng Tiếng Trung
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              {allVocabList.length} từ vựng
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
            Ghi nhớ chữ Hán qua chiết tự, âm Hán-Việt, câu ví dụ thực tế và tự do thêm các từ vựng bạn muốn học.
          </p>
        </div>

        {/* Progress & Add Button Container */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Spaced Repetition Progress Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#243447] dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#45B97C]" />
                Đã nhớ vững:
              </span>
              <span className="text-[#45B97C]">{rememberedIds.length} / {allVocabList.length} từ ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-[#FFF9F2] dark:bg-[#131B24] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#45B97C] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Primary "Thêm từ vựng" Button */}
          <button
            onClick={() => {
              playClickSound();
              setShowAddModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus size={18} />
            <span>Thêm từ vựng muốn học</span>
          </button>

        </div>
      </div>

      {/* SRS Analytics & 7-Day Spaced Repetition Forecast Widget */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-[#1E293B] dark:via-[#1A2234] dark:to-[#172033] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
              <TrendingUp size={16} />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white">
              Tiến Độ Ôn Tập SM-2 & Dự Báo 7 Ngày
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#748092] dark:text-[#94A3B8]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Tự động đồng bộ Offline & Cloud</span>
          </div>
        </div>

        {/* 5 SRS Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setStatusFilter('due');
              setCurrentIndex(0);
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusFilter === 'due'
                ? 'bg-red-500 text-white border-red-500 shadow-md scale-[1.02]'
                : 'bg-white dark:bg-[#131B24] border-red-200 dark:border-red-900/40 hover:border-red-400'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-80 flex items-center justify-between">
              <span>⏰ Hôm nay cần ôn</span>
            </div>
            <div className={`text-xl font-black mt-1 ${statusFilter === 'due' ? 'text-white' : 'text-red-600 dark:text-red-400'}`}>
              {srsStats.dueCount}
            </div>
          </button>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#131B24] border border-blue-200 dark:border-blue-900/40 text-left">
            <div className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
              🆕 Thẻ mới (New)
            </div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {srsStats.newCount}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#131B24] border border-amber-200 dark:border-amber-900/40 text-left">
            <div className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
              🔄 Đang ôn (Learning)
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {srsStats.reviewCount}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#131B24] border border-emerald-200 dark:border-emerald-900/40 text-left">
            <div className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
              ✅ Đã thuộc vững
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {srsStats.masteredCount}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setStatusFilter('leeches');
              setCurrentIndex(0);
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusFilter === 'leeches'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]'
                : 'bg-white dark:bg-[#131B24] border-purple-200 dark:border-purple-900/40 hover:border-purple-400'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-80 flex items-center justify-between">
              <span>⚠️ Hay quên (Leeches)</span>
            </div>
            <div className={`text-xl font-black mt-1 ${statusFilter === 'leeches' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`}>
              {srsStats.leechCount}
            </div>
          </button>
        </div>

        {/* 7-Day Forecast Micro Bar Chart */}
        <div className="pt-2">
          <div className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-2 flex items-center gap-1.5">
            <Calendar size={13} />
            <span>Dự báo số thẻ đến hạn trong 7 ngày tới:</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {srsStats.forecast7Days.map((item, idx) => {
              const maxCount = Math.max(...srsStats.forecast7Days.map(f => f.count), 5);
              const heightPercent = Math.max(15, Math.round((item.count / maxCount) * 100));
              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    {item.count}
                  </span>
                  <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg flex items-end justify-center p-1 overflow-hidden">
                    <div 
                      className={`w-full rounded transition-all duration-300 ${
                        item.isToday 
                          ? 'bg-[#E85D3F]' 
                          : item.count > 0 
                            ? 'bg-amber-400 dark:bg-amber-500' 
                            : 'bg-transparent'
                      }`}
                      style={{ height: `${item.count > 0 ? heightPercent : 4}%` }}
                    />
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold ${item.isToday ? 'text-[#E85D3F] font-bold' : 'text-[#748092] dark:text-[#94A3B8]'}`}>
                    {item.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search, Filter Toolbar & View Mode Switcher */}
      <div className="space-y-4 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
        
        {/* Prominent HSK Level Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
            Cấp độ HSK:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Tất cả HSK', count: allVocabList.length },
              { id: 'HSK 1', label: 'HSK 1', count: hskCounts['HSK 1'] || 0 },
              { id: 'HSK 2', label: 'HSK 2', count: hskCounts['HSK 2'] || 0 },
              { id: 'HSK 3', label: 'HSK 3', count: hskCounts['HSK 3'] || 0 },
              { id: 'HSK 4', label: 'HSK 4', count: hskCounts['HSK 4'] || 0 },
              { id: 'HSK 5-6', label: 'HSK 5-6 (Thành ngữ)', count: hskCounts['HSK 5-6'] || 0 }
            ].map((tab) => {
              const isActive = selectedHsk === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedHsk(tab.id);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#E85D3F] text-white shadow-xs scale-[1.02]'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-3 text-[#748092]" />
            <input 
              type="text"
              placeholder="Tìm theo chữ Hán, Pinyin, nghĩa tiếng Việt hoặc âm Hán-Việt..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />
          </div>

          {/* Topic Filter Select */}
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none"
          >
            {TOPIC_FILTERS.map(t => (
              <option key={t} value={t}>{t === 'Tất cả' ? 'Tất cả chủ đề' : t}</option>
            ))}
          </select>

          {/* Learning Status Filter */}
          <div className="flex items-center gap-1 bg-[#FFF9F2] dark:bg-[#131B24] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'due', label: `⏰ Cần ôn (${srsStats.dueCount})` },
              { id: 'leeches', label: `⚠️ Hay quên (${srsStats.leechCount})` },
              { id: 'custom', label: `🌟 Tự thêm (${customVocabCount})` },
              { id: 'remembered', label: 'Đã nhớ' },
              { id: 'review', label: 'Cần ôn' },
              { id: 'srs_priority', label: '🔥 AI Ưu tiên ôn' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  playClickSound();
                  setStatusFilter(f.id);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === f.id
                    ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-sm'
                    : 'text-[#748092] hover:text-[#243447]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Flashcard vs Grid vs Quiz */}
          <div className="flex items-center gap-1 bg-[#FFF9F2] dark:bg-[#131B24] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setViewMode('flashcard');
              }}
              title="Xem dạng thẻ lật Spaced Repetition"
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'flashcard' 
                  ? 'bg-[#E85D3F] text-white shadow-sm' 
                  : 'text-[#748092] hover:text-[#243447]'
              }`}
            >
              <CreditCard size={15} />
              <span className="hidden sm:inline">Thẻ lật</span>
            </button>
            
            <button
              onClick={() => {
                playClickSound();
                setViewMode('grid');
              }}
              title="Xem dạng lưới danh sách đầy đủ"
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#E85D3F] text-white shadow-sm' 
                  : 'text-[#748092] hover:text-[#243447]'
              }`}
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Danh sách</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setViewMode('quiz');
              }}
              title="Luyện phản xạ trắc nghiệm nhanh"
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'quiz' 
                  ? 'bg-[#E85D3F] text-white shadow-sm' 
                  : 'text-[#748092] hover:text-[#243447]'
              }`}
            >
              <Zap size={15} />
              <span className="hidden sm:inline">Trắc nghiệm</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setViewMode('dictionary');
              }}
              title="Tra cứu kho từ điển quy mô lớn CC-CEDICT (120.000 từ)"
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'dictionary' 
                  ? 'bg-[#E85D3F] text-white shadow-sm' 
                  : 'text-[#748092] hover:text-[#243447]'
              }`}
            >
              <BookOpen size={15} />
              <span className="hidden sm:inline">Từ điển 120.000 từ</span>
            </button>
          </div>

        </div>

        {/* Topics Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <Filter size={13} className="text-[#748092] shrink-0 ml-1" />
          {TOPIC_FILTERS.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                playClickSound();
                setSelectedTopic(topic);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedTopic === topic
                  ? 'bg-[#E85D3F] text-white shadow-sm'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Secondary Bar: Length Filter & Export CSV */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider mr-1">Độ dài:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'single', label: 'Từ đơn (1 chữ)' },
              { id: 'compound', label: 'Từ ghép (2+ chữ)' }
            ].map(lf => (
              <button
                key={lf.id}
                onClick={() => {
                  playClickSound();
                  setLengthFilter(lf.id);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  lengthFilter === lf.id
                    ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-sm'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447]'
                }`}
              >
                {lf.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            title="Tải danh sách từ vựng hiện tại dạng file CSV (Hỗ trợ Anki, Excel)"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#FDEEEB] dark:hover:bg-[#2D1E1B] text-[#748092] hover:text-[#E85D3F] text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Download size={14} />
            <span>Xuất CSV ({filteredVocab.length})</span>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      {filteredVocab.length === 0 ? (
        
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4 max-w-xl mx-auto p-6 shadow-sm">
          {statusFilter === 'due' ? (
            <>
              <span className="text-4xl">🎉</span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  Đã hoàn thành toàn bộ thẻ cần ôn hôm nay!
                </h3>
                <p className="text-xs text-[#748092]">
                  Không còn từ vựng nào đến hạn ôn tập SRS lúc này. Bạn có thể học thêm bài mới trên Lộ trình hoặc chuyển sang chế độ ôn tập tất cả.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setStatusFilter('all');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md hover:bg-[#CB4529] transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw size={15} />
                  <span>Ôn tập tự do (Tất cả từ vựng)</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-4xl">📚</span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  Không tìm thấy từ vựng nào phù hợp
                </h3>
                <p className="text-xs text-[#748092]">
                  Bạn chưa có từ vựng thuộc nhóm này, hoặc từ khóa tìm kiếm chưa chính xác.
                </p>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setShowAddModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md hover:bg-[#CB4529] transition-all inline-flex items-center gap-1.5"
              >
                <Plus size={16} />
                <span>Thêm từ vựng mới này ngay</span>
              </button>
            </>
          )}
        </div>

      ) : viewMode === 'flashcard' && currentCard ? (
        
        /* 1. 3D FLASHCARD VIEW */
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Card Meta Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E85D3F]" />
              <span>Chủ đề: {currentCard.topic} • {currentCard.level}</span>
              {currentCard.isCustom && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                  Tự thêm
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentCard.isCustom && (
                <button
                  onClick={(e) => handleDeleteCustomItem(currentCard.id, e)}
                  title="Xóa từ vựng này khỏi danh sách cá nhân"
                  className="p-1 text-[#748092] hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <span>Thẻ {currentIndex + 1} / {filteredVocab.length}</span>
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div 
            onClick={handleFlip}
            className="perspective-1000 cursor-pointer min-h-[380px] select-none"
          >
            <div 
              className={`relative w-full h-[380px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl border border-[#F1E5D8] dark:border-[#2B3A4F] ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              
              {/* FRONT OF FLASHCARD */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-white to-[#FFF9F2] dark:from-[#1E293B] dark:to-[#131B24] rounded-3xl p-8 flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                      {currentCard.level}
                    </span>
                    {currentCard.pos && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                        {currentCard.pos}
                      </span>
                    )}
                  </div>
                  <AudioButton text={currentCard.hanzi} size="md" />
                </div>

                <div className="space-y-3">
                  <div className="font-['Noto_Serif_SC'] text-7xl sm:text-8xl font-black text-[#243447] dark:text-white tracking-wide">
                    {currentCard.hanzi}
                  </div>
                  {currentCard.traditional && currentCard.traditional !== currentCard.hanzi && (
                    <p className="text-xs font-medium text-[#748092] dark:text-[#94A3B8]">
                      Phồn thể: <span className="font-['Noto_Serif_SC'] font-bold text-[#E85D3F]">{currentCard.traditional}</span>
                    </p>
                  )}
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                    Bộ thủ: {currentCard.radical} • {currentCard.strokes} nét
                  </p>
                </div>

                <div className="text-xs font-bold text-[#E85D3F] flex items-center gap-1.5 animate-bounce">
                  <RotateCw size={14} />
                  <span>Bấm vào thẻ để xem Pinyin, nghĩa & chiết tự</span>
                </div>
              </div>

              {/* BACK OF FLASHCARD */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-[#1E293B] rounded-3xl p-7 flex flex-col justify-between text-left overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
                      {currentCard.hanzi}
                    </span>
                    {currentCard.traditional && currentCard.traditional !== currentCard.hanzi && (
                      <span className="font-['Noto_Serif_SC'] text-sm font-semibold text-gray-400">
                        ({currentCard.traditional})
                      </span>
                    )}
                    <span className="text-lg font-bold text-[#E85D3F]">
                      {currentCard.pinyin}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentCard.pos && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50">
                        {currentCard.pos}
                      </span>
                    )}
                    <AudioButton text={currentCard.hanzi} size="sm" />
                  </div>
                </div>

                <div className="space-y-3 my-auto py-2">
                  <div>
                    <span className="text-[11px] text-[#748092] dark:text-[#94A3B8] block">Nghĩa tiếng Việt:</span>
                    <p className="text-lg font-bold text-[#45B97C]">{currentCard.meaning}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#748092]">
                      <p>Âm Hán-Việt: <span className="font-semibold text-[#243447] dark:text-white">{currentCard.hanviet}</span></p>
                      {currentCard.en && (
                        <p>Tiếng Anh (CC-CEDICT): <span className="font-medium text-[#243447] dark:text-gray-300">{currentCard.en}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[11px] font-bold text-[#E85D3F] block mb-1">Mẹo nhớ chữ qua chiết tự:</span>
                    <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">{currentCard.mnemonic}</p>
                  </div>

                  {currentCard.example && (
                    <div className="text-xs space-y-0.5 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#243447] dark:text-white">Ví dụ từ điển:</span>
                          <AiContextBadge type="official_dict" size="xs" />
                        </div>
                        <AudioButton text={currentCard.example.hanzi} size="sm" />
                      </div>
                      <p className="text-[#243447] dark:text-white font-medium">{currentCard.example.hanzi}</p>
                      {currentCard.example.pinyin && (
                        <p className="text-[11px] text-[#E85D3F]">{currentCard.example.pinyin}</p>
                      )}
                      <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">{currentCard.example.meaning}</p>
                    </div>
                  )}

                  {/* AI Contextual Generated Drill */}
                  {aiGeneratedExample ? (
                    <div className="text-xs space-y-0.5 pt-1 p-2.5 rounded-xl bg-amber-50/70 dark:bg-gray-800/70 border border-amber-200/60 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#E85D3F]">Ngữ cảnh bổ trợ:</span>
                          <AiContextBadge type="ai_suggestion" size="xs" />
                        </div>
                        <AudioButton text={aiGeneratedExample.targetHanzi || currentCard.hanzi} size="sm" />
                      </div>
                      <p className="text-[#243447] dark:text-white font-medium">{aiGeneratedExample.targetHanzi || currentCard.hanzi}</p>
                      {aiGeneratedExample.pinyin && (
                        <p className="text-[11px] text-[#E85D3F]">{aiGeneratedExample.pinyin}</p>
                      )}
                      <p className="text-[11px] text-gray-600 dark:text-gray-300">{aiGeneratedExample.explanation || aiGeneratedExample.prompt}</p>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateAiExample(currentCard);
                        }}
                        disabled={isGeneratingExample}
                        className="w-full py-1.5 px-3 rounded-xl bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-gray-700 text-[#E85D3F] dark:text-orange-400 text-xs font-semibold hover:bg-orange-100 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles size={13} className={isGeneratingExample ? 'animate-spin' : ''} />
                        <span>{isGeneratingExample ? 'Đang tạo câu ví dụ...' : '✨ Tạo câu ví dụ ngữ cảnh AI'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Cross-practice Quick Access */}
                {(onSelectWriting || onSelectPronounce || setActiveTab) && (
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectWriting) onSelectWriting(currentCard);
                        else if (setActiveTab) setActiveTab('writing');
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <PenTool size={13} />
                      <span>✍️ Luyện viết chữ</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPronounce) onSelectPronounce(currentCard);
                        else if (setActiveTab) setActiveTab('pronunciation');
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Mic size={13} />
                      <span>🎙️ Luyện phát âm</span>
                    </button>
                  </div>
                )}

                <div className="text-right text-[10px] text-[#748092] italic pt-1">
                  Bấm lần nữa để lật lại mặt trước
                </div>
              </div>

            </div>
          </div>

          {/* SM-2 SRS Card Status Indicator */}
          {currentCard && (
            <div className="px-3 py-2 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#748092] dark:text-[#94A3B8] shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles size={13} className="text-[#E85D3F]" />
                  <span>
                    SRS: {srsMap[currentCard.hanzi]?.stage === 2 
                      ? '🏆 Đã thuần thục' 
                      : srsMap[currentCard.hanzi]?.stage === 1 
                        ? '🔄 Đang ôn tập' 
                        : '🆕 Thẻ mới'}
                  </span>
                </span>
                {(srsMap[currentCard.hanzi]?.lapseCount || srsMap[currentCard.hanzi]?.lapse_count || 0) >= 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 text-[10px]">
                    ⚠️ Hay quên ({srsMap[currentCard.hanzi]?.lapseCount || srsMap[currentCard.hanzi]?.lapse_count} lần)
                  </span>
                )}
                {srsMap[currentCard.hanzi]?.sourceContext && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-[10px]">
                    {srsMap[currentCard.hanzi]?.sourceContext === 'quiz_mistake' ? '🎯 Quiz làm sai' :
                     srsMap[currentCard.hanzi]?.sourceContext === 'writing_mistake' ? '✍️ Nét viết cần ôn' :
                     srsMap[currentCard.hanzi]?.sourceContext === 'smart_reader' ? '📖 Smart Reader' :
                     srsMap[currentCard.hanzi]?.sourceContext === 'dictionary' ? '🔍 Tra từ điển' : '📚 Bài học'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>Lặp: <strong>{srsMap[currentCard.hanzi]?.repetitions || 0}</strong> lần</span>
                <span>Cách: <strong>{srsMap[currentCard.hanzi]?.intervalDays || 1}</strong> ngày</span>
                <span>EF: <strong>{(srsMap[currentCard.hanzi]?.easeFactor || 2.5).toFixed(2)}</strong></span>
              </div>
            </div>
          )}

          {/* Action Buttons: 4-tier SM-2 SRS Rating */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {/* 1. Again (q=1) */}
            <button
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.AGAIN)}
              className="py-3 px-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs shadow-xs transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-rose-500" />
                <span>1. Quên (Again)</span>
              </div>
              <span className="text-[10px] text-rose-600/75 dark:text-rose-400 font-normal">Ôn sau {srsPreview.again} ngày</span>
            </button>

            {/* 2. Hard (q=3) */}
            <button
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.HARD)}
              className="py-3 px-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-bold text-xs shadow-xs transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <RotateCw size={14} className="text-amber-500" />
                <span>2. Khó (Hard)</span>
              </div>
              <span className="text-[10px] text-amber-600/75 dark:text-amber-400 font-normal">Ôn sau {srsPreview.hard} ngày</span>
            </button>

            {/* 3. Good (q=4) */}
            <button
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.GOOD)}
              className="py-3 px-2 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] text-white font-bold text-xs shadow-md shadow-[#45B97C]/25 hover:opacity-95 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Check size={14} />
                <span>3. Tốt (Good)</span>
              </div>
              <span className="text-[10px] text-white/80 font-normal">Ôn sau {srsPreview.good} ngày</span>
            </button>

            {/* 4. Easy (q=5) */}
            <button
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.EASY)}
              className="py-3 px-2 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 hover:opacity-95 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Zap size={14} />
                <span>4. Dễ (Easy)</span>
              </div>
              <span className="text-[10px] text-white/80 font-normal">Ôn sau {srsPreview.easy} ngày</span>
            </button>
          </div>

          {/* Prev / Next Card Controls */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              onClick={handlePrevCard}
              title="Thẻ trước (←)"
              className="p-2.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white shadow-sm transition-colors active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-[#748092]">
              {currentIndex + 1} / {filteredVocab.length}
            </span>
            <button
              onClick={handleNextCard}
              title="Thẻ tiếp theo (→)"
              className="p-2.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white shadow-sm transition-colors active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Keyboard shortcut guide */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#748092] dark:text-[#94A3B8] pt-1">
            <span className="flex items-center gap-1 font-bold text-[#243447] dark:text-white"><Keyboard size={13} /> Phím tắt:</span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">Space: Lật</span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">← / →: Thẻ</span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">1: Ôn lại</span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">2: Đã nhớ</span>
          </div>

        </div>

      ) : viewMode === 'grid' ? (

        /* 2. GRID VIEW OF VOCABULARY */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.map((item) => {
            const isRemembered = rememberedIds.includes(item.id);
            const isReview = reviewIds.includes(item.id);

            return (
              <div 
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F] hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                        {item.topic} • {item.level}
                      </span>
                      {item.isCustom && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          Tự thêm
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <AudioButton text={item.hanzi} size="sm" />
                      {item.isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustomItem(item.id, e)}
                          title="Xóa từ vựng này"
                          className="p-1 rounded-md text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
                      {item.hanzi}
                    </span>
                    <span className="text-sm font-bold text-[#E85D3F]">{item.pinyin}</span>
                  </div>
                  <p className="text-xs font-bold text-[#45B97C] mt-1">{item.meaning}</p>
                  <p className="text-[11px] text-[#748092] mt-0.5">Hán-Việt: {item.hanviet}</p>
                </div>

                {item.mnemonic && (
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] italic line-clamp-2">
                    💡 {item.mnemonic}
                  </p>
                )}

                {item.example && (
                  <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px] text-[#748092] dark:text-[#94A3B8]">
                    <p className="font-semibold text-[#243447] dark:text-white">{item.example.hanzi}</p>
                    <p>{item.example.meaning}</p>
                  </div>
                )}

                {/* Status Badges */}
                <div className="flex items-center justify-between pt-1 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px]">
                  {isRemembered ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Đã nhớ
                    </span>
                  ) : isReview ? (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Clock size={12} /> Cần ôn lại
                    </span>
                  ) : (
                    <span className="text-[#748092]">Chưa đánh dấu</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMarkReview(item.id)}
                      title="Đánh dấu cần ôn"
                      className={`p-1 rounded ${isReview ? 'text-amber-600 font-bold' : 'text-[#748092] hover:text-amber-600'}`}
                    >
                      <Clock size={13} />
                    </button>
                    <button
                      onClick={() => handleMarkRemembered(item.id)}
                      title="Đánh dấu đã nhớ"
                      className={`p-1 rounded ${isRemembered ? 'text-emerald-600 font-bold' : 'text-[#748092] hover:text-emerald-600'}`}
                    >
                      <Check size={13} />
                    </button>
                  </div>
                </div>

                {/* Quick Cross Practice */}
                {(onSelectWriting || onSelectPronounce || setActiveTab) && (
                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                    <button
                      onClick={() => {
                        if (onSelectWriting) onSelectWriting(item);
                        else if (setActiveTab) setActiveTab('writing');
                      }}
                      title="Chuyển sang trang Luyện viết chữ này"
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <PenTool size={11} />
                      <span>Viết chữ</span>
                    </button>
                    <button
                      onClick={() => {
                        if (onSelectPronounce) onSelectPronounce(item);
                        else if (setActiveTab) setActiveTab('pronunciation');
                      }}
                      title="Chuyển sang trang Luyện phát âm từ này"
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Mic size={11} />
                      <span>Phát âm</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      ) : viewMode === 'quiz' ? (

        /* 3. QUICK QUIZ REFLEX MODE */
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
              Thử thách phản xạ từ vựng
            </span>
            <div className="flex items-center gap-2">
              {quizStreak > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse">
                  <Flame size={13} className="text-amber-500 fill-amber-500" />
                  Chuỗi {quizStreak} từ!
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Zap size={12} />
                Đã đúng: {quizScore} từ
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#243447] dark:text-white">
              Chọn nghĩa tiếng Việt chính xác
            </h3>
            <p className="text-xs text-[#748092]">
              Quan sát chữ Hán và chọn 1 trong 4 đáp án bên dưới.
            </p>
          </div>

          {/* Flashcard prompt */}
          <div className="p-8 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
            <span className="font-['Noto_Serif_SC'] text-6xl sm:text-7xl font-black text-[#243447] dark:text-white block">
              {currentCard.hanzi}
            </span>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-sm font-bold text-[#E85D3F]">{currentCard.pinyin}</span>
              <AudioButton text={currentCard.hanzi} size="sm" />
            </div>
            <p className="text-xs text-[#748092]">Hán-Việt: {currentCard.hanviet}</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentCard.meaning;
              let btnClass = 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';

              if (quizAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all text-center ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Quiz Feedback & Next Button */}
          {quizAnswered && (
            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-3 animate-in fade-in">
              <p className="font-bold text-[#243447] dark:text-white">
                {selectedOption === currentCard.meaning ? '🎉 Chính xác tuyệt vời!' : `⚠️ Chưa đúng! Nghĩa đúng là: ${currentCard.meaning}`}
              </p>
              {currentCard.mnemonic && (
                <p className="text-[11px] text-[#748092]">💡 Mẹo nhớ: {currentCard.mnemonic}</p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectWriting ? onSelectWriting(currentCard) : setActiveTab?.('writing')}
                    className="px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[11px] font-bold flex items-center gap-1 hover:bg-orange-100 transition-colors"
                  >
                    <PenTool size={12} />
                    <span>Viết chữ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPronounce ? onSelectPronounce(currentCard) : setActiveTab?.('pronunciation')}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                  >
                    <Mic size={12} />
                    <span>Phát âm</span>
                  </button>
                </div>
                <button
                  onClick={handleNextQuizCard}
                  className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-sm transition-all ml-auto"
                >
                  Từ tiếp theo ➔
                </button>
              </div>
            </div>
          )}
        </div>

      ) : (

        /* 4. PHASE 16: KHO TỪ ĐIỂN MỞ RỘNG QUY MÔ LỚN (120.000+ TỪ CC-CEDICT) */
        <div className="space-y-6">
          
          {/* Dictionary Search & Filter Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  placeholder="Tra cứu chữ Hán, Pinyin hoặc nghĩa..."
                  value={dictQuery}
                  onChange={(e) => {
                    setDictQuery(e.target.value);
                    setDictPage(1);
                  }}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
                {dictQuery && (
                  <button
                    onClick={() => { setDictQuery(''); setDictPage(1); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* HSK Filter for Dictionary */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#748092] mr-1">Bộ lọc HSK:</span>
                {['ALL', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5-6'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => {
                      playClickSound();
                      setDictHsk(lvl);
                      setDictPage(1);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dictHsk === lvl
                        ? 'bg-[#E85D3F] text-white shadow-xs'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Tất cả' : lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Results metadata count bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#748092] dark:text-[#94A3B8] pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  Tìm thấy <strong className="text-[#243447] dark:text-white">{dictTotal.toLocaleString()}</strong> mục từ
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
                  {dictSource === 'cloud_rpc' ? '⚡ PostgreSQL GIN Trigram' : dictSource === 'cloud_table' ? '☁️ Supabase Cloud' : '📦 Dữ liệu chuẩn hóa'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Trang <strong>{dictPage}</strong> / {dictTotalPages}</span>
              </div>
            </div>
          </div>

          {/* Dictionary Results Grid */}
          {dictLoading ? (
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E85D3F] border-t-transparent mb-3" />
              <p className="text-xs font-bold text-[#748092]">Đang tải dữ liệu từ kho từ điển 120.000 mục từ...</p>
            </div>
          ) : dictResults.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-base font-bold text-[#243447] dark:text-white">Không tìm thấy từ vựng phù hợp</h3>
              <p className="text-xs text-[#748092] max-w-md mx-auto">
                Hãy thử tìm bằng Pinyin không dấu, chữ Hán giản thể/phồn thể hoặc kiểm tra lại cấp độ HSK đã chọn.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dictResults.map((item, idx) => {
                  const isSaved = savedDictWords.has(item.hanzi || item.simplified);
                  return (
                    <div
                      key={item.id || idx}
                      className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F] hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.level && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                {item.level}
                              </span>
                            )}
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              item.qualityStatus === 'verified_human'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {item.qualityStatus === 'verified_human' ? '✓ Đã kiểm duyệt' : 'CC-CEDICT'}
                            </span>
                          </div>
                          <AudioButton text={item.hanzi || item.simplified} size="sm" />
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
                            {item.hanzi || item.simplified}
                          </span>
                          {item.traditional && item.traditional !== (item.hanzi || item.simplified) && (
                            <span className="font-['Noto_Serif_SC'] text-sm text-slate-400" title="Chữ phồn thể">
                              ({item.traditional})
                            </span>
                          )}
                          <span className="text-sm font-bold text-[#E85D3F]">{item.pinyin}</span>
                        </div>

                        {item.hanviet && (
                          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                            Hán-Việt: {item.hanviet}
                          </p>
                        )}

                        {item.meaningVi ? (
                          <p className="text-xs font-bold text-[#45B97C] mt-1 line-clamp-2">
                            {item.meaningVi}
                          </p>
                        ) : null}

                        {item.meaningEn ? (
                          <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] mt-1 line-clamp-2 italic">
                            {item.meaningEn}
                          </p>
                        ) : null}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            playClickSound();
                            setSelectedDictWord(item);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-bold text-[#243447] dark:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Info size={13} />
                          <span>Chi tiết</span>
                        </button>

                        <button
                          onClick={(e) => handleSaveDictToSrs(e, item)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isSaved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-[#E85D3F] hover:bg-[#CB4529] text-white shadow-xs active:scale-95'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck size={13} /> : <BookmarkPlus size={13} />}
                          <span>{isSaved ? 'Đã lưu SRS' : '+ Thêm Flashcard'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={dictPage <= 1}
                  onClick={() => {
                    playClickSound();
                    setDictPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
                >
                  « Trang đầu
                </button>
                <button
                  disabled={dictPage <= 1}
                  onClick={() => {
                    playClickSound();
                    setDictPage(prev => Math.max(1, prev - 1));
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold px-3 py-2 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 rounded-xl border border-orange-200 dark:border-orange-800">
                  Trang {dictPage} / {dictTotalPages}
                </span>
                <button
                  disabled={dictPage >= dictTotalPages}
                  onClick={() => {
                    playClickSound();
                    setDictPage(prev => Math.min(dictTotalPages, prev + 1));
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  disabled={dictPage >= dictTotalPages}
                  onClick={() => {
                    playClickSound();
                    setDictPage(dictTotalPages);
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
                >
                  Trang cuối »
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL: DICTIONARY WORD DETAIL */}
      {selectedDictWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-['Noto_Serif_SC'] text-4xl font-black text-[#243447] dark:text-white">
                    {selectedDictWord.hanzi || selectedDictWord.simplified}
                  </span>
                  {selectedDictWord.traditional && selectedDictWord.traditional !== (selectedDictWord.hanzi || selectedDictWord.simplified) && (
                    <span className="font-['Noto_Serif_SC'] text-lg text-slate-400" title="Chữ phồn thể">
                      ({selectedDictWord.traditional})
                    </span>
                  )}
                  <AudioButton text={selectedDictWord.hanzi || selectedDictWord.simplified} size="md" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-bold text-[#E85D3F]">{selectedDictWord.pinyin}</span>
                  {selectedDictWord.hanviet && (
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      • {selectedDictWord.hanviet}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedDictWord(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedDictWord.level && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold">
                  {selectedDictWord.level}
                </span>
              )}
              {selectedDictWord.pos && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
                  {selectedDictWord.pos}
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                selectedDictWord.qualityStatus === 'verified_human'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {selectedDictWord.qualityStatus === 'verified_human' ? '✓ Nghĩa tiếng Việt đã kiểm duyệt' : 'Nguồn CC-CEDICT (CC BY-SA 4.0)'}
              </span>
            </div>

            {/* Meanings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#748092]">Ý nghĩa & Định nghĩa:</h4>
              {selectedDictWord.meaningVi && (
                <p className="text-sm font-bold text-[#45B97C] bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  {selectedDictWord.meaningVi}
                </p>
              )}
              {selectedDictWord.definitions && selectedDictWord.definitions.length > 0 ? (
                <ul className="space-y-1 pl-4 list-disc text-xs text-[#243447] dark:text-slate-300">
                  {selectedDictWord.definitions.map((def, dIdx) => (
                    <li key={dIdx}>{def}</li>
                  ))}
                </ul>
              ) : selectedDictWord.meaningEn ? (
                <p className="text-xs italic text-[#748092]">{selectedDictWord.meaningEn}</p>
              ) : null}
            </div>

            {/* Chiết tự & Bộ thủ nếu có */}
            {selectedDictWord.decomposition && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-[#243447] dark:text-white">Chiết tự & Kết cấu:</span>
                <p className="text-[#748092] dark:text-slate-400">
                  {selectedDictWord.decomposition.structureType} • Chuỗi IDS: <code className="font-mono text-amber-600">{selectedDictWord.decomposition.idsSequence}</code>
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedDictWord(null);
                  if (onSelectWriting) onSelectWriting(selectedDictWord);
                  else setActiveTab?.('writing');
                }}
                className="px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1.5 hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <PenTool size={14} />
                <span>Tập viết chữ</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleSaveDictToSrs(e, selectedDictWord);
                }}
                className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <BookmarkPlus size={14} />
                <span>+ Thêm vào Flashcard SRS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM VOCABULARY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-[#E85D3F]" />
                  <span>Thêm Từ Vựng Mới Muốn Học</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Tự tạo flashcard từ vựng riêng để ghi nhớ theo lộ trình học của bạn.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
                ⚡ Gợi ý từ thông dụng (Nhấn để điền nhanh):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_VOCAB_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium flex items-center gap-1"
                  >
                    <span className="font-bold">{sug.hanzi}</span>
                    <span className="text-[10px] text-[#748092]">({sug.meaning})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Add Form */}
            <form onSubmit={handleAddNewVocab} className="space-y-4">
              
              {/* Hanzi Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Chữ Hán (Hanzi) *
                </label>
                <input
                  type="text"
                  required
                  value={newHanzi}
                  onChange={(e) => setNewHanzi(e.target.value)}
                  placeholder="Ví dụ: 猫 hoặc 咖啡"
                  className="w-full px-4 py-3 rounded-2xl text-lg font-['Noto_Serif_SC'] font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Smart Dict Match Banner */}
              {matchedVocabInDict && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-bold flex items-center gap-1">
                      <span>💡 Tìm thấy "{matchedVocabInDict.hanzi}" trong từ điển mẫu!</span>
                    </p>
                    <p className="text-[11px] opacity-80">
                      Pinyin: {matchedVocabInDict.pinyin} • Nghĩa: {matchedVocabInDict.meaning}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyDictMatch}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
                  >
                    Tự điền nhanh
                  </button>
                </div>
              )}

              {/* Pinyin, Hán-Việt & Nghĩa tiếng Việt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Phiên âm Pinyin
                  </label>
                  <input
                    type="text"
                    value={newPinyin}
                    onChange={(e) => setNewPinyin(e.target.value)}
                    placeholder="Ví dụ: māo"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Âm Hán-Việt
                  </label>
                  <input
                    type="text"
                    value={newHanviet}
                    onChange={(e) => setNewHanviet(e.target.value)}
                    placeholder="Ví dụ: Miêu"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Nghĩa tiếng Việt *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    placeholder="Ví dụ: Con mèo"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              {/* Level & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Cấp độ HSK
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="Tự học">Tự học</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Chủ đề
                  </label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="Đời sống">Đời sống</option>
                    <option value="Ăn uống">Ăn uống</option>
                    <option value="Chào hỏi">Chào hỏi</option>
                    <option value="Gia đình">Gia đình</option>
                    <option value="Trường học">Trường học</option>
                    <option value="Mua sắm">Mua sắm</option>
                    <option value="Công việc">Công việc</option>
                    <option value="Du lịch">Du lịch</option>
                    <option value="Công nghệ">Công nghệ</option>
                    <option value="Cảm xúc">Cảm xúc</option>
                    <option value="Thời gian">Thời gian</option>
                  </select>
                </div>
              </div>

              {/* Radical & Strokes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Bộ thủ (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={newRadical}
                    onChange={(e) => setNewRadical(e.target.value)}
                    placeholder="Ví dụ: 犭(Khuyển)"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Số nét bút (Tùy chọn)
                  </label>
                  <input
                    type="number"
                    value={newStrokes}
                    onChange={(e) => setNewStrokes(e.target.value)}
                    placeholder="Ví dụ: 11"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              {/* Mnemonic Tip */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Mẹo nhớ chữ qua chiết tự (Mnemonic)
                </label>
                <textarea
                  rows={2}
                  value={newMnemonic}
                  onChange={(e) => setNewMnemonic(e.target.value)}
                  placeholder="Ví dụ: Loài thú (犭) kêu meo meo trên đồng ruộng (苗)..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Example Sentence Inputs */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <span className="text-[11px] font-bold text-[#E85D3F] uppercase tracking-wider block">
                  Câu ví dụ thực tế (Tùy chọn)
                </span>
                
                <input
                  type="text"
                  value={newExampleHanzi}
                  onChange={(e) => setNewExampleHanzi(e.target.value)}
                  placeholder="Chữ Hán: 我家有一只可爱的小猫。"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />

                <input
                  type="text"
                  value={newExamplePinyin}
                  onChange={(e) => setNewExamplePinyin(e.target.value)}
                  placeholder="Pinyin: Wǒ jiā yǒu yì zhī kě’ài de xiǎomāo."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />

                <input
                  type="text"
                  value={newExampleMeaning}
                  onChange={(e) => setNewExampleMeaning(e.target.value)}
                  placeholder="Nghĩa: Nhà tôi có một chú mèo con rất đáng yêu."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!newHanzi.trim() || !newMeaning.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Lưu & Học từ này ngay</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
