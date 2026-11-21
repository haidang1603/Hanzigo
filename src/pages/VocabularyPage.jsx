import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from 'react';
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
  Layers,
  BookOpen,
  BookmarkPlus,
  BookmarkCheck,
  Info,
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import { VOCABULARY_LIST, TOPIC_FILTERS } from '../data/chineseData';
import {
  getStoredCustomVocab,
  saveCustomVocab,
  deleteCustomVocab,
} from '../utils/materialsStorage';
import {
  triggerCloudSync,
  getVocabularyFromDb,
  addVocabularyToDb,
} from '../supabase/services';
import { supabase, isSupabaseConfigured } from '../supabase/config';
import { awardXp, getUserStorageKey, getLocalDateString } from '../utils/gamification';
import {
  calculateNextSrsReview,
  SRS_QUALITY,
  calculateSrsStats,
  isCardDueForReview,
  captureWeakVocabulary,
} from '../utils/srsEngine';
import {
  saveUserVocabSrsCard,
  syncUserVocabSrsFromCloud,
  updateDailyMissionProgress,
} from '../services';
import { recordLearningEvent } from '../services/learningDataService.ts';
import { trackLearningEvent } from '../core/telemetry/learningTelemetryService.js';
import AiContextBadge from '../components/personalization/AiContextBadge.jsx';
import { getPersonalizedExercises } from '../services/aiGateway.js';
import { searchDictionaryPaginated } from '../services/dictionaryService.js';
import {
  getLocalHsk79Flashcards,
  fetchHsk30FlashcardBatch,
  HSK_30_BANDS,
  HSK_30_TOTAL_VOCAB_COUNT,
} from '../services/hsk30FlashcardDeckService.js';

// Lazy-load 2 module lớn để giảm dung lượng chunk ban đầu (Phase 35 Optimization)
const VocabularyWorkspace = lazy(() =>
  import('../features/vocabulary-workspace/VocabularyWorkspace.tsx').then((m) => ({
    default: m.VocabularyWorkspace || m.default,
  }))
);
const ChengyuCollocationExplorer = lazy(() =>
  import('../features/chengyu-explorer/ChengyuCollocationExplorer.tsx').then((m) => ({
    default: m.ChengyuCollocationExplorer || m.default,
  }))
);

const STORAGE_REMEMBERED = 'hanzigo_vocab_remembered';
const STORAGE_REVIEW = 'hanzigo_vocab_review';
const STORAGE_SRS_STATE = 'hanzigo_vocab_srs_state';

// Định mức từ vựng chuẩn HSK 3.0 theo từng cấp độ (HSK 1 -> HSK 7-9, tổng 11.000 từ)
const HSK_LEVEL_TARGETS = [
  {
    id: 'HSK 1',
    label: 'HSK 1',
    target: 300,
    cumulative: 300,
    color: 'from-emerald-400 to-teal-500',
    badge: 'Sơ cấp',
  },
  {
    id: 'HSK 2',
    label: 'HSK 2',
    target: 200,
    cumulative: 500,
    color: 'from-teal-400 to-cyan-500',
    badge: 'Sơ cấp',
  },
  {
    id: 'HSK 3',
    label: 'HSK 3',
    target: 500,
    cumulative: 1000,
    color: 'from-sky-400 to-blue-500',
    badge: 'Sơ cấp',
  },
  {
    id: 'HSK 4',
    label: 'HSK 4',
    target: 1000,
    cumulative: 2000,
    color: 'from-indigo-400 to-purple-500',
    badge: 'Trung cấp',
  },
  {
    id: 'HSK 5',
    label: 'HSK 5',
    target: 1600,
    cumulative: 3600,
    color: 'from-purple-400 to-fuchsia-500',
    badge: 'Trung cấp',
  },
  {
    id: 'HSK 6',
    label: 'HSK 6',
    target: 1800,
    cumulative: 5400,
    color: 'from-rose-400 to-orange-500',
    badge: 'Trung cấp',
  },
  {
    id: 'HSK 7-9',
    label: 'HSK 7–9',
    target: 5600,
    cumulative: 11000,
    color: 'from-amber-400 to-red-500',
    badge: 'Cao cấp',
  },
];

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
    mnemonic: 'Loài thú bốn chân (犭) kêu meo meo trên đồng ruộng (苗).',
    exampleHanzi: '我家有一只可爱的小猫。',
    examplePinyin: 'Wǒ jiā yǒu yì zhī kě’ài de xiǎomāo.',
    exampleMeaning: 'Nhà tôi có một chú mèo con rất đáng yêu.',
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
    exampleMeaning: 'Bạn muốn uống cà phê nóng hay cà phê đá?',
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
    exampleMeaning: 'Chiều nay chúng mình cùng đi mua một ly trà sữa trân châu nhé!',
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
    exampleMeaning: 'Bộ sườn xám truyền thống Trung Quốc này thật xinh đẹp!',
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
    exampleMeaning: 'Xin hãy cho tôi biết số điện thoại của bạn.',
  },
  {
    hanzi: '赋能',
    pinyin: 'fùnéng',
    hanviet: 'Phú năng',
    meaning: 'Trao quyền, tiếp sức mạnh công nghệ cho',
    level: 'HSK 7-9',
    topic: 'Công nghệ',
    radical: '贝 (Bối) + 能 (Năng)',
    strokes: 22,
    mnemonic: 'Trao giá trị (贝) và năng lực (能) giúp tổ chức chuyển đổi số bứt phá.',
    exampleHanzi: '人工智能正在为传统制造业赋能。',
    examplePinyin: 'Réngōng zhìnéng zhèngzài wèi chuántǒng zhìzàoyè fùnéng.',
    exampleMeaning: 'Trí tuệ nhân tạo đang tiếp thêm sức mạnh cho ngành sản xuất truyền thống.',
  },
];

// Helper chuẩn hóa dữ liệu từ vựng từ mọi nguồn (Local, HSK 3.0 Corpus, CC-CEDICT, Supabase)
function normalizeVocab(item) {
  if (!item) return null;
  const hanziVal = item.hanzi || item.simplified || item.word || '';
  if (!hanziVal) return null;

  let exampleObj = null;
  if (item.example) {
    if (typeof item.example === 'object' && (item.example.hanzi || item.example.zh)) {
      exampleObj = {
        hanzi: item.example.hanzi || item.example.zh,
        pinyin: item.example.pinyin || '',
        meaning: item.example.meaning || item.example.vi || '',
      };
    } else if (typeof item.example === 'string' && item.example.trim()) {
      exampleObj = {
        hanzi: item.example,
        pinyin: item.examplePinyin || item.example_pinyin || '',
        meaning: item.exampleMeaning || item.example_meaning || '',
      };
    }
  } else if (item.example_hanzi) {
    exampleObj = {
      hanzi: item.example_hanzi,
      pinyin: item.example_pinyin || '',
      meaning: item.example_meaning || '',
    };
  }

  return {
    id: String(item.id || `vocab-${hanziVal}`),
    hanzi: hanziVal,
    traditional: item.traditional || hanziVal,
    pinyin: item.pinyin || item.pinyin_display || item.pinyin_tone || '',
    hanviet: item.hanviet || item.han_viet || '',
    pos: item.pos || '',
    meaning: item.meaning || item.meaningVi || item.meaning_vi || '',
    en: item.en || item.meaningEn || '',
    level:
      item.level ||
      item.hsk ||
      (item.hsk_level
        ? Number(item.hsk_level) >= 7
          ? 'HSK 7-9'
          : `HSK ${item.hsk_level}`
        : 'HSK 1'),
    topic: item.topic || 'Đời sống',
    radical: item.radical || item.decomposition?.radical || '—',
    strokes:
      Number(item.strokes) ||
      Number(item.strokeCount) ||
      Number(item.decomposition?.stroke_count) ||
      hanziVal.length * 6,
    mnemonic:
      item.mnemonic ||
      item.memoryTip ||
      item.personal_mnemonic ||
      'Ghi nhớ cấu trúc bộ thủ và hình tượng của chữ.',
    example: exampleObj,
    isCustom: !!(
      item.isCustom ||
      item.is_custom ||
      (item.example && item.example.is_custom) ||
      (typeof item.topic === 'string' &&
        (item.topic.startsWith('Tự thêm') || item.topic.startsWith('Custom')))
    ),
  };
}

const VALID_VOCAB_VIEWS = ['flashcard', 'grid', 'quiz', 'dictionary', 'workspace', 'chengyu'];

export default function VocabularyPage({
  user,
  setActiveTab,
  onSelectWriting,
  onSelectPronounce,
  initialView = 'flashcard',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposingSearch, setIsComposingSearch] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');
  const [selectedHsk, setSelectedHsk] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'due', 'leeches', 'custom', 'remembered', 'review', 'srs_priority'
  const [hideMastered, setHideMastered] = useState(true); // Ẩn các từ đã thuộc vững khỏi danh sách học mặc định
  const [lengthFilter, setLengthFilter] = useState('all'); // 'all', 'single', 'compound'
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [gridPage, setGridPage] = useState(1);
  const GRID_PAGE_SIZE = 48;
  const cardTouchMovedRef = useRef(false);
  const [viewMode, setViewMode] = useState(() =>
    VALID_VOCAB_VIEWS.includes(initialView) ? initialView : 'flashcard'
  ); // 'flashcard', 'grid', 'quiz', 'dictionary', 'workspace', 'chengyu'

  useEffect(() => {
    if (VALID_VOCAB_VIEWS.includes(initialView)) {
      setViewMode(initialView);
    }
  }, [initialView]);

  // Kho 11.000 từ vựng chuẩn HSK 3.0 cho Flashcards (bật mặc định, tải theo lô 50 từ)
  const [corpusMode, setCorpusMode] = useState(true);
  const [corpusPage, setCorpusPage] = useState(1);
  const [corpusCards, setCorpusCards] = useState([]);
  const [corpusTotalCount, setCorpusTotalCount] = useState(HSK_30_TOTAL_VOCAB_COUNT);
  const [corpusTotalPages, setCorpusTotalPages] = useState(
    Math.ceil(HSK_30_TOTAL_VOCAB_COUNT / 50)
  );
  const [corpusLoading, setCorpusLoading] = useState(false);
  const [corpusSource, setCorpusSource] = useState('supabase_hsk30_corpus');

  useEffect(() => {
    setGridPage(1);
  }, [selectedHsk, selectedTopic, searchTerm, statusFilter, lengthFilter, corpusPage]);

  // Kho từ điển mở rộng quy mô lớn (120.000+ từ CC-CEDICT)
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
  const [savedDictWords, setSavedDictWords] = useState(() => new Set());

  // Đọc tham số ?level=... trên URL/Hash nếu được điều hướng từ RoadmapPage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const parseUrlLevel = () => {
      let rawLvl = new URLSearchParams(window.location.search).get('level');
      if (!rawLvl && window.location.hash.includes('?')) {
        rawLvl = new URLSearchParams(window.location.hash.split('?')[1]).get('level');
      }
      const num = Number(rawLvl);
      if (Number.isFinite(num) && num >= 1 && num <= 9) {
        setSelectedHsk(num >= 7 ? 'HSK 7-9' : `HSK ${num}`);
        setCorpusPage(1);
        setCurrentIndex(0);
      }
    };
    parseUrlLevel();
    window.addEventListener('hashchange', parseUrlLevel);
    return () => window.removeEventListener('hashchange', parseUrlLevel);
  }, []);

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
          pageSize: dictPageSize,
        });
        if (!isCancelled && res) {
          setDictResults(Array.isArray(res.entries) ? res.entries : []);
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

  // Tải từng lô 50 từ trong kho 11.092 từ HSK 3.0 khi bật corpusMode
  useEffect(() => {
    if (!corpusMode || isComposingSearch) return;
    let cancelled = false;
    setCorpusLoading(true);
    const bandKey = HSK_30_BANDS[selectedHsk] ? selectedHsk : 'all';

    fetchHsk30FlashcardBatch({
      hskBand: bandKey,
      page: corpusPage,
      pageSize: 50,
      searchQuery: searchTerm,
    })
      .then((res) => {
        if (cancelled || !res) return;
        setCorpusCards(
          (Array.isArray(res.entries) ? res.entries : [])
            .map(normalizeVocab)
            .filter(Boolean)
        );
        setCorpusTotalCount(res.totalCount || 0);
        setCorpusTotalPages(res.totalPages || 1);
        setCorpusSource(res.source || 'supabase_hsk30_corpus');
      })
      .finally(() => {
        if (!cancelled) setCorpusLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [corpusMode, selectedHsk, corpusPage, searchTerm, isComposingSearch]);

  // Master vocabulary state initialized lazily from storage + static data
  const [allVocabList, setAllVocabList] = useState(() => {
    try {
      const custom = getStoredCustomVocab();
      const normalizedCustom = (Array.isArray(custom) ? custom : [])
        .map(normalizeVocab)
        .filter(Boolean);
      const normalizedStatic = VOCABULARY_LIST.map(normalizeVocab).filter(Boolean);
      const normalizedHsk79 = getLocalHsk79Flashcards()
        .map(normalizeVocab)
        .filter(Boolean);
      const map = new Map();
      normalizedStatic.forEach((item) => map.set(item.hanzi, item));
      normalizedHsk79.forEach((item) => {
        if (!map.has(item.hanzi)) map.set(item.hanzi, item);
      });
      normalizedCustom.forEach((item) => map.set(item.hanzi, item));
      return Array.from(map.values());
    } catch (e) {
      console.error('Error loading vocabulary list:', e);
      return VOCABULARY_LIST.map(normalizeVocab).filter(Boolean);
    }
  });

  // Lưu từ điển vào Flashcard / SRS cá nhân
  const handleSaveDictToSrs = (e, item) => {
    if (e && e.stopPropagation) e.stopPropagation();
    playClickSound();
    try {
      const hanziKey = item.hanzi || item.simplified;
      const savedObj = {
        id: `dict-vocab-${hanziKey}`,
        hanzi: hanziKey,
        pinyin: item.pinyin || '',
        hanviet: item.hanviet || '',
        meaning:
          item.meaningVi ||
          (Array.isArray(item.definitions) && item.definitions[0]
            ? item.definitions[0]
            : item.meaningEn || ''),
        level: item.level || 'Tự chọn',
        topic: item.topic || 'Từ điển CC-CEDICT',
        isCustom: true,
      };
      saveCustomVocab(savedObj);
      const normalizedNew = normalizeVocab(savedObj);
      if (normalizedNew) {
        setAllVocabList((prev) => {
          const map = new Map(prev.map((v) => [v.hanzi, v]));
          map.set(normalizedNew.hanzi, normalizedNew);
          return Array.from(map.values());
        });
      }
      captureWeakVocabulary(item, 'dictionary', user);
      awardXp(10, user, `dict_save_${hanziKey}`);
      playSuccessSound();
      setSavedDictWords((prev) => new Set([...prev, hanziKey]));
    } catch (err) {
      console.warn('Error saving dictionary item to SRS:', err);
    }
  };

  // Fetch all words from Supabase and synchronize seamlessly
  const syncVocabularyFromDb = useCallback(async () => {
    try {
      const dbItems = await getVocabularyFromDb();
      if (!dbItems || !Array.isArray(dbItems)) return;
      const normalizedDb = dbItems.map(normalizeVocab).filter(Boolean);

      setAllVocabList(() => {
        const map = new Map();
        VOCABULARY_LIST.map(normalizeVocab)
          .filter(Boolean)
          .forEach((item) => map.set(item.hanzi, item));
        getLocalHsk79Flashcards()
          .map(normalizeVocab)
          .filter(Boolean)
          .forEach((item) => {
            if (!map.has(item.hanzi)) map.set(item.hanzi, item);
          });
        getStoredCustomVocab()
          .map(normalizeVocab)
          .filter(Boolean)
          .forEach((item) => map.set(item.hanzi, item));
        normalizedDb.forEach((item) => map.set(item.hanzi, item));
        return Array.from(map.values());
      });
    } catch (err) {
      console.warn('Sync vocabulary from Supabase notice:', err);
    }
  }, []);

  // Fetch on mount + subscribe to Supabase Realtime channel and local CustomEvent
  useEffect(() => {
    let isMounted = true;
    syncVocabularyFromDb();

    const handleLocalVocabUpdate = () => {
      if (isMounted) syncVocabularyFromDb();
    };
    window.addEventListener('hanzigo:custom_vocab_updated', handleLocalVocabUpdate);

    let channel;
    if (isSupabaseConfigured && supabase) {
      try {
        channel = supabase
          .channel('public:vocabulary_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'vocabulary' },
            () => {
              if (isMounted) syncVocabularyFromDb();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime vocabulary subscription notice:', err);
      }
    }

    return () => {
      isMounted = false;
      window.removeEventListener('hanzigo:custom_vocab_updated', handleLocalVocabUpdate);
      if (channel && supabase) {
        supabase.removeChannel(channel).catch(() => {});
      }
    };
  }, [syncVocabularyFromDb]);

  // Flashcard interaction state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const isRatingRef = useRef(false);

  // Spaced Repetition status tracking (persisted in localStorage per user)
  const [rememberedIds, setRememberedIds] = useState(() => {
    try {
      const key = getUserStorageKey(STORAGE_REMEMBERED, user);
      const saved =
        localStorage.getItem(key) ||
        (user ? null : localStorage.getItem(STORAGE_REMEMBERED));
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
      const saved =
        localStorage.getItem(key) || (user ? null : localStorage.getItem(STORAGE_REVIEW));
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
      const saved =
        localStorage.getItem(key) ||
        (user ? null : localStorage.getItem(STORAGE_SRS_STATE));
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
      syncUserVocabSrsFromCloud(targetUid).then((res) => {
        if (res && isMounted) {
          if (res.srsMap) setSrsMap(res.srsMap);
          if (Array.isArray(res.remembered)) setRememberedIds(res.remembered);
          if (Array.isArray(res.review)) setReviewIds(res.review);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Synchronize immediately when words are captured from Reader, Command Palette or Quiz
  useEffect(() => {
    const handleSrsUpdate = () => {
      try {
        const key = getUserStorageKey(STORAGE_SRS_STATE, user);
        const saved =
          localStorage.getItem(key) ||
          (user ? null : localStorage.getItem(STORAGE_SRS_STATE));
        if (saved) setSrsMap(JSON.parse(saved));

        const custom = getStoredCustomVocab().map(normalizeVocab).filter(Boolean);
        setAllVocabList((prev) => {
          const map = new Map();
          VOCABULARY_LIST.map(normalizeVocab)
            .filter(Boolean)
            .forEach((item) => map.set(item.hanzi, item));
          prev.forEach((item) => {
            if (item && item.hanzi) map.set(item.hanzi, item);
          });
          custom.forEach((item) => map.set(item.hanzi, item));
          return Array.from(map.values());
        });
      } catch {
        // Ignore storage parse error
      }
    };

    window.addEventListener('hanzigo_srs_updated', handleSrsUpdate);
    window.addEventListener('hanzigo_vocab_saved', handleSrsUpdate);
    return () => {
      window.removeEventListener('hanzigo_srs_updated', handleSrsUpdate);
      window.removeEventListener('hanzigo_vocab_saved', handleSrsUpdate);
    };
  }, [user]);

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
    return allVocabList.find((v) => v.hanzi === clean) || null;
  }, [newHanzi, allVocabList]);

  // Quiz Mode State
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Dynamic counts per HSK Level
  const hskCounts = useMemo(() => {
    const counts = {
      'HSK 1': 0,
      'HSK 2': 0,
      'HSK 3': 0,
      'HSK 4': 0,
      'HSK 5': 0,
      'HSK 6': 0,
      'HSK 5-6': 0,
      'HSK 7-9': 0,
    };
    allVocabList.forEach((v) => {
      const lvl = v.level || 'HSK 1';
      if (/^HSK\s+[789]/.test(lvl) || lvl === 'HSK 7-9') {
        counts['HSK 7-9'] = (counts['HSK 7-9'] || 0) + 1;
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
    const cards = allVocabList.map((v) => ({
      ...v,
      ...(srsMap[v.hanzi] || {}),
    }));
    return calculateSrsStats(cards);
  }, [allVocabList, srsMap]);

  // ===========================================================================
  // MA TRẬN TIẾN ĐỘ LÀM CHỦ TỪ VỰNG THEO CẤP ĐỘ HSK (HSK 1 -> HSK 7-9)
  // ===========================================================================
  const hskLevelProgress = useMemo(() => {
    const rememberedSet = new Set(rememberedIds);
    const reviewSet = new Set(reviewIds);

    return HSK_LEVEL_TARGETS.map((tier) => {
      const wordsInTier = allVocabList.filter((item) => {
        if (!item) return false;
        if (tier.id === 'HSK 7-9') {
          return item.level === 'HSK 7-9' || /^HSK\s+[789]/.test(item.level || '');
        }
        if (tier.id === 'HSK 6') {
          return item.level === 'HSK 6' || item.level === 'HSK 5-6';
        }
        return item.level === tier.id;
      });

      let mastered = 0;
      let learning = 0;
      let dueToday = 0;

      wordsInTier.forEach((w) => {
        const srsCard = srsMap[w.hanzi];
        if (rememberedSet.has(w.id) || srsCard?.stage === 2) {
          mastered += 1;
        } else if (reviewSet.has(w.id) || srsCard?.stage === 1) {
          learning += 1;
        }
        if (srsCard && isCardDueForReview(srsCard)) {
          dueToday += 1;
        }
      });

      const denominator = Math.max(wordsInTier.length, tier.target);
      const masteredPct = Math.min(100, Math.round((mastered / denominator) * 100));
      const learningPct = Math.min(
        100 - masteredPct,
        Math.round((learning / denominator) * 100)
      );

      return {
        ...tier,
        loadedCount: wordsInTier.length,
        denominator,
        mastered,
        learning,
        dueToday,
        masteredPct,
        learningPct,
      };
    });
  }, [allVocabList, rememberedIds, reviewIds, srsMap]);

  // Tiến độ của riêng cấp HSK đang được chọn
  const activeHskProgress = useMemo(() => {
    if (selectedHsk === 'all') return null;
    const normalizedId = selectedHsk === 'HSK 5-6' ? 'HSK 6' : selectedHsk;
    return hskLevelProgress.find((t) => t.id === normalizedId) || null;
  }, [selectedHsk, hskLevelProgress]);

  // Kiểm tra xem người dùng có đang lọc theo trạng thái SRS cá nhân không
  const isPersonalStatusFilter = useMemo(
    () =>
      ['due', 'leeches', 'custom', 'remembered', 'review', 'srs_priority'].includes(
        statusFilter
      ),
    [statusFilter]
  );

  // Filtered vocabularies (Tự động hợp nhất allVocabList + corpusCards khi lọc trạng thái cá nhân hoặc lọc chủ đề)
  const filteredVocab = useMemo(() => {
    const isTopicFiltering = selectedTopic !== 'Tất cả';
    const rawPool =
      corpusMode && !isPersonalStatusFilter && !isTopicFiltering
        ? corpusCards
        : [...allVocabList, ...corpusCards];

    const sourcePool = Array.from(
      new Map(
        rawPool
          .filter((v) => v && v.hanzi)
          .map((v) => [v.hanzi, v])
      ).values()
    );

    const q = searchTerm.trim().toLowerCase();

    const matched = sourcePool.filter((item) => {
      if (!item || !item.hanzi) return false;

      const matchesSearch =
        corpusMode && !isPersonalStatusFilter && !isTopicFiltering && !q
          ? true
          : !q ||
            item.hanzi.toLowerCase().includes(q) ||
            item.pinyin.toLowerCase().includes(q) ||
            item.meaning.toLowerCase().includes(q) ||
            item.hanviet.toLowerCase().includes(q);

      const matchesTopic =
        selectedTopic === 'Tất cả' || item.topic === selectedTopic;

      const matchesHsk =
        (corpusMode && !isPersonalStatusFilter && !isTopicFiltering) || selectedHsk === 'all'
          ? true
          : selectedHsk === 'HSK 5-6'
          ? item.level === 'HSK 5-6' || item.level === 'HSK 5' || item.level === 'HSK 6'
          : selectedHsk === 'HSK 7-9'
          ? item.level === 'HSK 7-9' || /^HSK\s+[789]/.test(item.level || '')
          : item.level === selectedHsk;

      let matchesStatus = true;
      const isMasteredCard =
        rememberedIds.includes(item.id) ||
        srsMap[item.hanzi]?.stage === 2 ||
        ((srsMap[item.hanzi]?.repetitions || 0) >= 1 && !reviewIds.includes(item.id));

      if (statusFilter === 'all' && hideMastered) {
        matchesStatus = !isMasteredCard;
      } else if (statusFilter === 'remembered') {
        matchesStatus = isMasteredCard;
      } else if (statusFilter === 'review') {
        matchesStatus = reviewIds.includes(item.id) || srsMap[item.hanzi]?.stage === 1;
      } else if (statusFilter === 'custom') {
        matchesStatus = !!item.isCustom;
      } else if (statusFilter === 'srs_priority') {
        matchesStatus = !isMasteredCard;
      } else if (statusFilter === 'due') {
        matchesStatus = !isMasteredCard && isCardDueForReview(srsMap[item.hanzi] || item);
      } else if (statusFilter === 'leeches') {
        matchesStatus =
          (srsMap[item.hanzi]?.lapseCount || srsMap[item.hanzi]?.lapse_count || 0) >= 3;
      }

      let matchesLength = true;
      if (lengthFilter === 'single') {
        matchesLength = item.hanzi.length === 1;
      } else if (lengthFilter === 'compound') {
        matchesLength = item.hanzi.length > 1;
      }

      return (
        matchesSearch && matchesTopic && matchesHsk && matchesStatus && matchesLength
      );
    });

    // Ưu tiên đẩy thẻ SRS đến hạn lên đầu hàng đợi ôn tập (giữ ổn định thứ tự các thẻ còn lại)
    if (statusFilter === 'srs_priority' || statusFilter === 'due' || statusFilter === 'all') {
      return [...matched].sort((a, b) => {
        const aDue = srsMap[a.hanzi] && isCardDueForReview(srsMap[a.hanzi]) ? 1 : 0;
        const bDue = srsMap[b.hanzi] && isCardDueForReview(srsMap[b.hanzi]) ? 1 : 0;
        return bDue - aDue;
      });
    }
    return matched;
  }, [
    corpusMode,
    isPersonalStatusFilter,
    hideMastered,
    corpusCards,
    allVocabList,
    searchTerm,
    selectedTopic,
    selectedHsk,
    statusFilter,
    lengthFilter,
    rememberedIds,
    reviewIds,
    srsMap,
  ]);

  const currentCard = filteredVocab[currentIndex] || filteredVocab[0];

  // Dynamic estimated next review intervals for current card across 4 SM-2 grades
  const srsPreview = useMemo(() => {
    if (!currentCard) {
      return {
        againLabel: 'Học lại ngay',
        hardLabel: '12 giờ',
        goodLabel: '1 ngày',
        easyLabel: '4 ngày',
      };
    }
    const cur = srsMap[currentCard.hanzi] || {
      repetitions: 0,
      intervalDays: 1,
      easeFactor: 2.5,
    };
    const reps = cur.repetitions || 0;
    const isNewCard = reps === 0;
    const isSecondRep = reps === 1;
    const hardDays = calculateNextSrsReview(cur, SRS_QUALITY.HARD).intervalDays;
    const goodDays = calculateNextSrsReview(cur, SRS_QUALITY.GOOD).intervalDays;
    const easyDays = calculateNextSrsReview(cur, SRS_QUALITY.EASY).intervalDays;

    return {
      againLabel: 'Học lại ngay',
      hardLabel: isNewCard ? '12 giờ' : isSecondRep ? '4 ngày' : `${hardDays} ngày`,
      goodLabel: `${goodDays} ngày`,
      easyLabel: isNewCard ? '4 ngày' : isSecondRep ? '8 ngày' : `${easyDays} ngày`,
    };
  }, [currentCard, srsMap]);

  // Flip card
  const handleFlip = useCallback(() => {
    playClickSound();
    setIsFlipped((prev) => !prev);
  }, []);

  // Next & Prev card
  const handleNextCard = useCallback(() => {
    playClickSound();
    setIsFlipped(false);
    setAiGeneratedExample(null);
    setCurrentIndex((prev) => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
  }, [filteredVocab.length]);

  const handlePrevCard = useCallback(() => {
    playClickSound();
    setIsFlipped(false);
    setAiGeneratedExample(null);
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : Math.max(0, filteredVocab.length - 1)
    );
  }, [filteredVocab.length]);

  // AI Contextual Example generator
  const handleGenerateAiExample = useCallback(
    async (card) => {
      if (!card) return;
      setIsGeneratingExample(true);
      try {
        const res = await getPersonalizedExercises(
          card.hanzi,
          card.level,
          'contextual_sentence',
          user
        );
        if (res && res.data && Array.isArray(res.data.drills) && res.data.drills.length > 0) {
          setAiGeneratedExample(res.data.drills[0]);
          playSuccessSound();
        }
      } catch (err) {
        console.warn('AI example generation notice:', err.message);
      } finally {
        setIsGeneratingExample(false);
      }
    },
    [user]
  );

  // Handle SM-2 Spaced Repetition Rating (4-tier standard with double-click protection)
  const handleSrsRate = useCallback(
    (card, quality) => {
      if (!card || isRatingRef.current) return;
      isRatingRef.current = true;
      setTimeout(() => {
        isRatingRef.current = false;
      }, 350);

      // Đảm bảo từ trong corpusMode cũng được đưa vào allVocabList khi học viên chấm điểm SRS
      setAllVocabList((prev) => {
        if (prev.some((v) => v.hanzi === card.hanzi)) return prev;
        return [card, ...prev];
      });

      const currentSrs = srsMap[card.hanzi] || {
        repetitions: 0,
        intervalDays: 1,
        easeFactor: 2.5,
      };
      const nextSrs = calculateNextSrsReview(currentSrs, quality);

      setSrsMap((prev) => {
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

        setRememberedIds((prev) => {
          const next = prev.includes(card.id) ? prev : [...prev, card.id];
          try {
            const key = getUserStorageKey(STORAGE_REMEMBERED, user);
            localStorage.setItem(key, JSON.stringify(next));
          } catch {}
          return next;
        });

        setReviewIds((prev) => {
          const next = prev.filter((item) => item !== card.id);
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

        setReviewIds((prev) => {
          const next = prev.includes(card.id) ? prev : [...prev, card.id];
          try {
            const key = getUserStorageKey(STORAGE_REVIEW, user);
            localStorage.setItem(key, JSON.stringify(next));
          } catch {}
          return next;
        });

        if (quality === SRS_QUALITY.AGAIN) {
          setRememberedIds((prev) => {
            const next = prev.filter((item) => item !== card.id);
            try {
              const key = getUserStorageKey(STORAGE_REMEMBERED, user);
              localStorage.setItem(key, JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      }

      // Sync to Supabase user_vocab_srs table & bridge to Unified Telemetry (DQ-HIGH-03)
      try {
        const targetUid = user?.uid || user?.id;
        if (targetUid) {
          saveUserVocabSrsCard(targetUid, {
            hanzi: card.hanzi,
            pinyin: card.pinyin,
            meaning: card.meaning,
            level: card.level,
            ...nextSrs,
          });
        }
        const hskLvlMatch = String(card.level || '1').match(/\d+/);
        const parsedHskLvl = hskLvlMatch ? Number(hskLvlMatch[0]) : 1;
        const isCorrectReview = quality >= SRS_QUALITY.GOOD;
        void recordLearningEvent({
          userId: targetUid ?? null,
          sourceModule: 'srs_review',
          hskLevel: parsedHskLvl,
          skillDomain: 'vocabulary',
          itemId: card.hanzi,
          isCorrect: isCorrectReview,
          scoreEarned: isCorrectReview ? 100 : quality === SRS_QUALITY.HARD ? 60 : 20,
          scoreMax: 100,
          durationMs: 4000,
          metadata: {
            source: 'user_vocab_srs',
            lapse_count: nextSrs?.lapseCount ?? 0,
            stage: nextSrs?.stage ?? 0,
          },
        });
        trackLearningEvent(
          {
            userId: targetUid ?? null,
            eventType: 'vocab_review',
            itemId: card.hanzi,
            hskLevel: parsedHskLvl,
            isCorrect: isCorrectReview,
            metadata: { source: 'user_vocab_srs', lapseCount: nextSrs?.lapseCount ?? 0 },
          },
          { user }
        );
      } catch (e) {
        console.warn('SRS DB sync notice:', e);
      }

      triggerCloudSync(user?.uid || user?.id);
      if (viewMode === 'flashcard') {
        if (quality >= SRS_QUALITY.GOOD && hideMastered && statusFilter === 'all') {
          setIsFlipped(false);
          setAiGeneratedExample(null);
          setCurrentIndex((prev) =>
            prev >= Math.max(0, filteredVocab.length - 1) ? 0 : prev
          );
        } else {
          handleNextCard();
        }
      }
    },
    [srsMap, user, viewMode, hideMastered, statusFilter, filteredVocab.length, handleNextCard]
  );

  // Nhận cả đối tượng item hoặc id để hoạt động chính xác trên cả Corpus Mode và Grid View
  const handleMarkRemembered = useCallback(
    (itemOrId) => {
      const card =
        typeof itemOrId === 'object'
          ? itemOrId
          : filteredVocab.find((v) => v.id === itemOrId) ||
            allVocabList.find((v) => v.id === itemOrId);
      if (card) handleSrsRate(card, SRS_QUALITY.GOOD);
    },
    [filteredVocab, allVocabList, handleSrsRate]
  );

  const handleMarkReview = useCallback(
    (itemOrId) => {
      const card =
        typeof itemOrId === 'object'
          ? itemOrId
          : filteredVocab.find((v) => v.id === itemOrId) ||
            allVocabList.find((v) => v.id === itemOrId);
      if (card) handleSrsRate(card, SRS_QUALITY.AGAIN);
    },
    [filteredVocab, allVocabList, handleSrsRate]
  );

  // Keyboard navigation for Flashcards
  useEffect(() => {
    if (viewMode !== 'flashcard' || showAddModal) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (
        e.code === 'Space' ||
        e.code === 'Enter' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown'
      ) {
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
  }, [
    viewMode,
    showAddModal,
    currentCard,
    handleFlip,
    handleNextCard,
    handlePrevCard,
    handleSrsRate,
  ]);

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
        meaning: newExampleMeaning.trim(),
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
      strokes: parseInt(newStrokes, 10) || newHanzi.trim().length * 6,
      mnemonic:
        newMnemonic.trim() ||
        'Ghi nhớ qua cách chiết tự và ngữ cảnh sử dụng thực tế.',
      example: exampleObj,
      isCustom: true,
    };

    // 1. Save to local storage
    saveCustomVocab(newVocabItem);
    awardXp(15, user, `add_custom_vocab_${newVocabItem.hanzi}`);

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
      example_meaning: newVocabItem.example?.meaning || '',
    };
    addVocabularyToDb(cloudPayload);
    triggerCloudSync(user?.uid || user?.id);

    // 3. Update in-memory state & tự động chuyển sang bộ lọc "Tự thêm" để người dùng thấy ngay từ vừa tạo
    const normalizedItem = normalizeVocab(newVocabItem);
    setAllVocabList((prev) => [
      normalizedItem,
      ...prev.filter((v) => v.hanzi !== normalizedItem.hanzi),
    ]);
    setCorpusMode(false);
    setStatusFilter('custom');
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
    if (!window.confirm('Bạn có chắc muốn xóa từ vựng này khỏi danh sách cá nhân?'))
      return;

    deleteCustomVocab(id);
    const updated = allVocabList.filter((item) => item.id !== id);
    setAllVocabList(updated);

    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  // Export current list to CSV (UTF-8 with BOM for Excel & Anki)
  const handleExportCsv = () => {
    playClickSound();
    if (filteredVocab.length === 0) return;

    const headers = [
      'Chữ Hán (Giản thể)',
      'Chữ Phồn thể',
      'Pinyin',
      'Hán-Việt',
      'Từ loại',
      'Nghĩa tiếng Việt',
      'Tiếng Anh (CC-CEDICT)',
      'Cấp độ',
      'Chủ đề',
      'Bộ thủ',
      'Số nét',
      'Chiết tự',
      'Ví dụ',
    ];
    const rows = filteredVocab.map((v) => [
      `"${v.hanzi}"`,
      `"${v.traditional || v.hanzi}"`,
      `"${v.pinyin}"`,
      `"${v.hanviet}"`,
      `"${v.pos || ''}"`,
      `"${(v.meaning || '').replace(/"/g, '""')}"`,
      `"${(v.en || '').replace(/"/g, '""')}"`,
      `"${v.level}"`,
      `"${v.topic}"`,
      `"${v.radical}"`,
      `"${v.strokes}"`,
      `"${(v.mnemonic || '').replace(/"/g, '""')}"`,
      `"${(v.example?.hanzi || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `hanzigo-tu-vung-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quiz Options generator for current card
  const quizOptions = useMemo(() => {
    if (!currentCard) return [];
    const correctMeaning = currentCard.meaning;
    const pool = [...allVocabList, ...corpusCards];
    const otherMeanings = pool
      .filter((item) => item && item.id !== currentCard.id && item.meaning !== correctMeaning)
      .map((item) => item.meaning);

    if (otherMeanings.length === 0) return [correctMeaning];

    const charCodeSum = (currentCard.hanzi || '')
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const distractor1 = otherMeanings[charCodeSum % otherMeanings.length];
    const distractor2 = otherMeanings[(charCodeSum + 3) % otherMeanings.length];
    const distractor3 = otherMeanings[(charCodeSum + 7) % otherMeanings.length];

    const uniqueDistractors = Array.from(
      new Set([distractor1, distractor2, distractor3])
    ).filter((m) => m && m !== correctMeaning);

    const position = charCodeSum % (uniqueDistractors.length + 1);
    const result = [...uniqueDistractors];
    result.splice(position, 0, correctMeaning);
    return result;
  }, [currentCard, allVocabList, corpusCards]);

  const handleQuizAnswer = async (option) => {
    if (quizAnswered || !currentCard) return;
    setSelectedOption(option);
    setQuizAnswered(true);

    if (option === currentCard.meaning) {
      playSuccessSound();
      setQuizScore((prev) => prev + 1);
      const newStreak = quizStreak + 1;
      setQuizStreak(newStreak);
      awardXp(10, user, `vocab_quiz_${currentCard.hanzi}`);

      if (newStreak > 0 && newStreak % 5 === 0) {
        try {
          const { default: confetti } = await import('canvas-confetti');
          confetti({
            particleCount: 55,
            spread: 65,
            origin: { y: 0.6 },
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

  // Thống kê hiển thị trên Header (Thích ứng thông minh theo cấp độ HSK đang chọn)
  const displayTotalVocabCount = corpusMode
    ? HSK_30_TOTAL_VOCAB_COUNT
    : allVocabList.length;
  const headerMasteredCount = activeHskProgress
    ? activeHskProgress.mastered
    : rememberedIds.length;
  const headerTargetCount = activeHskProgress
    ? activeHskProgress.denominator
    : displayTotalVocabCount || 1;
  const progressPercent = Math.min(
    100,
    Math.round((headerMasteredCount / headerTargetCount) * 100)
  );
  const customVocabCount = allVocabList.filter((item) => item.isCustom).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* =====================================================================
          1. HEADER & ADAPTIVE PROGRESS CARD
      ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            Học Sâu Qua Spaced Repetition &amp; Tự Tạo Từ Điển
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
              Kho Flashcard Từ Vựng Tiếng Trung
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              {displayTotalVocabCount.toLocaleString('vi-VN')} từ chuẩn HSK 1–9
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
            Ghi nhớ chữ Hán qua chiết tự, âm Hán-Việt, tiến độ từng cấp HSK và câu ví dụ thực tế.
          </p>
        </div>

        {/* Adaptive Progress & Add Button Container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Spaced Repetition Progress Card (Tự động đổi theo cấp HSK đang chọn) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm w-full sm:w-auto sm:min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 gap-3">
              <span className="text-[#243447] dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#45B97C]" />
                {activeHskProgress
                  ? `Đã thuộc ${activeHskProgress.label}:`
                  : 'Đã nhớ vững tổng:'}
              </span>
              <span className="text-[#45B97C]">
                {headerMasteredCount.toLocaleString('vi-VN')} /{' '}
                {headerTargetCount.toLocaleString('vi-VN')} từ ({progressPercent}%)
              </span>
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
            className="px-4 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-2 active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus size={18} />
            <span>Thêm từ vựng muốn học</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. BẢNG TIẾN ĐỘ LÀM CHỦ TỪ VỰNG THEO CẤP ĐỘ HSK (HSK 1 -> HSK 7-9)
      ===================================================================== */}
      <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-[#E85D3F]" />
              <span>Tiến Độ Làm Chủ Từ Vựng Theo Cấp Độ HSK (HSK 1 – HSK 9)</span>
            </h2>
            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
              Bấm vào từng thẻ cấp độ để lọc nhanh bộ Flashcard của riêng cấp đó (Bấm lần nữa để xem tất cả).
            </p>
          </div>

          {activeHskProgress && (
            <div className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white flex items-center gap-2">
              <span>
                Đang lọc <strong className="text-[#E85D3F]">{activeHskProgress.label}</strong>:{' '}
                <strong className="text-[#45B97C]">{activeHskProgress.mastered}</strong>/
                {activeHskProgress.denominator} từ ({activeHskProgress.masteredPct}%)
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedHsk('all');
                  setCorpusPage(1);
                  setCurrentIndex(0);
                }}
                className="text-[11px] text-[#E85D3F] hover:underline ml-1 cursor-pointer"
              >
                Bỏ lọc
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {hskLevelProgress.map((tier) => {
            const isSelected = selectedHsk === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedHsk(isSelected ? 'all' : tier.id);
                  setCorpusPage(1);
                  setCurrentIndex(0);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#E85D3F] ring-2 ring-[#E85D3F]/30 shadow-md scale-[1.02]'
                    : 'bg-[#FFF9F2]/60 dark:bg-[#131B24]/60 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-[#243447] dark:text-white">
                    {tier.label}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#748092] dark:text-[#94A3B8]">
                    {tier.masteredPct}%
                  </span>
                </div>

                {/* Thanh Progress 2 tầng: Đã nhớ vững + Đang ôn tập */}
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex">
                  <div
                    className={`h-full bg-gradient-to-r ${tier.color} transition-all duration-500`}
                    style={{ width: `${tier.masteredPct}%` }}
                    title={`Đã nhớ vững: ${tier.mastered} từ`}
                  />
                  {tier.learningPct > 0 && (
                    <div
                      className="h-full bg-amber-400/80 transition-all duration-500"
                      style={{ width: `${tier.learningPct}%` }}
                      title={`Đang ôn: ${tier.learning} từ`}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#748092] dark:text-[#94A3B8]">
                  <span>
                    <strong className="text-[#243447] dark:text-white">
                      {tier.mastered}
                    </strong>
                    /{tier.denominator}
                  </span>
                  {tier.dueToday > 0 ? (
                    <span className="text-rose-500 font-bold">⏰ {tier.dueToday} ôn</span>
                  ) : (
                    <span className="truncate">{tier.badge}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          4. SEARCH, FILTER TOOLBAR & VIEW MODE SWITCHER (REDESIGNED)
      ===================================================================== */}
      <div className="space-y-4 bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
        {/* Row 1: Primary View Mode Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F1E5D8]/80 dark:border-[#2B3A4F]/80">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FFF9F2] dark:bg-[#131B24] p-1.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] w-full lg:w-auto">
            {[
              { id: 'flashcard', label: 'Thẻ lật', icon: CreditCard, title: 'Xem dạng thẻ lật Spaced Repetition', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'grid', label: 'Danh sách', icon: LayoutGrid, title: 'Xem dạng lưới danh sách đầy đủ', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'quiz', label: 'Trắc nghiệm', icon: Zap, title: 'Luyện phản xạ trắc nghiệm nhanh', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'dictionary', label: 'Từ điển CC-CEDICT', icon: BookOpen, title: 'Tra cứu kho từ điển CC-CEDICT', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'workspace', label: 'Workspace SRS', icon: Sparkles, title: 'Vocabulary Workspace: Quản lý Decks & Ẩn từ đã thuộc', activeCls: 'bg-emerald-600 text-white shadow-sm' },
              { id: 'chengyu', label: 'Thành ngữ & Collocations', icon: Layers, title: 'Khám phá Thành ngữ 4 chữ & Kết hợp từ cố định', activeCls: 'bg-amber-600 text-white shadow-sm' },
            ].map((mode) => {
              const Icon = mode.icon;
              const isActive = viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setViewMode(mode.id);
                  }}
                  title={mode.title}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? mode.activeCls
                      : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            title="Tải danh sách từ vựng hiện tại dạng file CSV (Hỗ trợ Anki, Excel)"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#FDEEEB] dark:hover:bg-[#2D1E1B] text-[#748092] hover:text-[#E85D3F] text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 ml-auto"
          >
            <Download size={14} />
            <span>Xuất CSV ({filteredVocab.length})</span>
          </button>
        </div>

        {/* Mobile Filter Toggle Button (One-handed UX) */}
        <div className="flex lg:hidden items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="min-h-[44px] flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white active:scale-95 transition-all cursor-pointer"
          >
            <Filter size={14} className="text-[#E85D3F]" />
            <span>
              {showMobileFilters ? 'Thu gọn bộ lọc & tìm kiếm' : 'Mở bộ lọc, tìm kiếm & HSK'}
            </span>
          </button>
        </div>

        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
        {/* Row 2: Wide Search Bar + Topic Select + Length Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="relative lg:col-span-6">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
            <input
              id="vocab-search-input"
              name="vocabSearch"
              aria-label="Tìm kiếm từ vựng theo chữ Hán, Pinyin, nghĩa hoặc Hán-Việt"
              type="text"
              placeholder="Tìm theo chữ Hán, Pinyin, nghĩa tiếng Việt hoặc âm Hán-Việt..."
              value={searchTerm}
              onCompositionStart={() => setIsComposingSearch(true)}
              onCompositionEnd={() => setIsComposingSearch(false)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentIndex(0);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Xóa từ khóa"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="lg:col-span-3">
            <select
              id="vocab-topic-filter"
              name="vocabTopic"
              aria-label="Lọc từ vựng theo chủ đề"
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            >
              {TOPIC_FILTERS.map((t) => (
                <option key={t} value={t}>
                  {t === 'Tất cả' ? 'Chủ đề: Tất cả' : `Chủ đề: ${t}`}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-1 bg-[#FFF9F2] dark:bg-[#131B24] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'single', label: 'Từ đơn' },
              { id: 'compound', label: 'Từ ghép' },
            ].map((lf) => (
              <button
                key={lf.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setLengthFilter(lf.id);
                  setCurrentIndex(0);
                }}
                className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  lengthFilter === lf.id
                    ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-xs'
                    : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {lf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: HSK Level Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
          <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
            Cấp độ HSK:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              {
                id: 'all',
                label: 'Tất cả HSK',
                count: corpusMode ? HSK_30_BANDS.all.limit : allVocabList.length,
              },
              {
                id: 'HSK 1',
                label: 'HSK 1',
                count: corpusMode
                  ? HSK_30_BANDS['HSK 1'].limit
                  : hskCounts['HSK 1'] || 0,
              },
              {
                id: 'HSK 2',
                label: 'HSK 2',
                count: corpusMode
                  ? HSK_30_BANDS['HSK 2'].limit
                  : hskCounts['HSK 2'] || 0,
              },
              {
                id: 'HSK 3',
                label: 'HSK 3',
                count: corpusMode
                  ? HSK_30_BANDS['HSK 3'].limit
                  : hskCounts['HSK 3'] || 0,
              },
              {
                id: 'HSK 4',
                label: 'HSK 4',
                count: corpusMode
                  ? HSK_30_BANDS['HSK 4'].limit
                  : hskCounts['HSK 4'] || 0,
              },
              {
                id: 'HSK 5',
                label: 'HSK 5',
                count: corpusMode
                  ? HSK_30_BANDS['HSK 5'].limit
                  : hskCounts['HSK 5'] || 0,
              },
              {
                id: 'HSK 6',
                label: 'HSK 6',
                count: corpusMode
                  ? HSK_30_BANDS['HSK 6'].limit
                  : hskCounts['HSK 6'] || 0,
              },
              {
                id: 'HSK 5-6',
                label: 'Thành ngữ / Cao cấp',
                count:
                  (hskCounts['HSK 5-6'] || 0) +
                  (hskCounts['HSK 5'] || 0) +
                  (hskCounts['HSK 6'] || 0),
              },
              {
                id: 'HSK 7-9',
                label: 'HSK 7–9',
                count: corpusMode
                  ? HSK_30_BANDS['HSK 7-9'].limit
                  : hskCounts['HSK 7-9'] || 0,
              },
            ].map((tab) => {
              const isActive = selectedHsk === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedHsk(tab.id);
                    setCorpusPage(1);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#E85D3F] text-white shadow-xs scale-[1.02]'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                    }`}
                  >
                    {tab.count.toLocaleString('vi-VN')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Kho Flashcards 11.092 từ chuẩn HSK 3.0 */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] px-3.5 py-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setCorpusMode((prev) => !prev);
                setCorpusPage(1);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                corpusMode
                  ? 'bg-[#E85D3F] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]'
              }`}
            >
              <Sparkles size={13} />
              <span>Kho 11.092 từ chuẩn HSK 3.0</span>
            </button>
            <span className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
              {isPersonalStatusFilter
                ? 'Đang lọc trên toàn bộ Sổ từ SRS cá nhân của bạn'
                : corpusMode
                ? `${
                    corpusLoading
                      ? 'Đang tải lô thẻ...'
                      : `Đang học ${corpusTotalCount.toLocaleString('vi-VN')} từ (${
                          corpusSource === 'supabase_hsk30_corpus'
                            ? 'Cloud 11.092 từ'
                            : 'Offline HSK 1–9'
                        })`
                  }`
                : 'Bật để học toàn bộ 11.092 từ HSK 3.0 theo từng lô 50 thẻ'}
            </span>
          </div>

          {corpusMode && !isPersonalStatusFilter && (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                type="button"
                disabled={corpusPage <= 1 || corpusLoading}
                onClick={() => {
                  setCorpusPage((p) => Math.max(1, p - 1));
                  setCurrentIndex(0);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] disabled:opacity-40 cursor-pointer"
              >
                Lô trước
              </button>
              <span className="px-2 text-[11px] text-[#243447] dark:text-slate-200">
                Lô {corpusPage} / {corpusTotalPages}
              </span>
              <button
                type="button"
                disabled={corpusPage >= corpusTotalPages || corpusLoading}
                onClick={() => {
                  setCorpusPage((p) => Math.min(corpusTotalPages, p + 1));
                  setCurrentIndex(0);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] disabled:opacity-40 cursor-pointer"
              >
                Lô tiếp (50 từ)
              </button>
            </div>
          )}
        </div>

        {/* Row 5: Status Filter Chips (Full-width, zero clipping) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
          <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
            Trạng thái:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'due', label: `⏰ Cần ôn (${srsStats.dueCount})` },
              { id: 'leeches', label: `⚠️ Hay quên (${srsStats.leechCount})` },
              { id: 'custom', label: `🌟 Tự thêm (${customVocabCount})` },
              { id: 'remembered', label: '✅ Đã thuộc vững' },
              { id: 'review', label: 'Đang ôn' },
              { id: 'srs_priority', label: '🔥 AI Ưu tiên ôn' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setStatusFilter(f.id);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-xs'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}

            {statusFilter === 'all' && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setHideMastered((prev) => !prev);
                  setCurrentIndex(0);
                }}
                title="Ẩn các từ bạn đã đánh dấu Tốt/Dễ để không lặp lại"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ml-auto ${
                  hideMastered
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                }`}
              >
                {hideMastered ? '🙈 Đang ẩn từ đã thuộc' : '👁️ Hiện cả từ đã thuộc'}
              </button>
            )}
          </div>
        </div>

        {/* Row 6: Topics Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
          <Filter size={13} className="text-[#748092] shrink-0" />
          {TOPIC_FILTERS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => {
                playClickSound();
                setSelectedTopic(topic);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* =====================================================================
          5. MAIN CONTENT AREA (ĐÃ SỬA THỨ TỰ KIỂM TRA DICTIONARY TRƯỚC EMPTY STATE)
      ===================================================================== */}
      {viewMode === 'workspace' ? (
        <Suspense
          fallback={
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-2" />
              <p className="text-xs font-bold text-[#748092]">
                Đang tải Vocabulary Workspace...
              </p>
            </div>
          }
        >
          <VocabularyWorkspace user={user} />
        </Suspense>
      ) : viewMode === 'chengyu' ? (
        <Suspense
          fallback={
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-2" />
              <p className="text-xs font-bold text-[#748092]">
                Đang tải Kho Thành ngữ &amp; Collocations...
              </p>
            </div>
          }
        >
          <ChengyuCollocationExplorer user={user} onOpenWriting={onSelectWriting} />
        </Suspense>
      ) : viewMode === 'dictionary' ? (
        /* 4. KHO TỪ ĐIỂN MỞ RỘNG QUY MÔ LỚN (120.000+ TỪ CC-CEDICT) */
        <div className="space-y-6">
          {/* Dictionary Search & Filter Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]"
                />
                <input
                  type="text"
                  placeholder="Tra cứu chữ Hán, Pinyin hoặc nghĩa..."
                  value={dictQuery}
                  onChange={(e) => {
                    setDictQuery(e.target.value);
                    setDictPage(1);
                  }}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
                {dictQuery && (
                  <button
                    onClick={() => {
                      setDictQuery('');
                      setDictPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* HSK Filter for Dictionary */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#748092] mr-1">
                  Bộ lọc HSK:
                </span>
                {['ALL', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5-6', 'HSK 7-9'].map(
                  (lvl) => (
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
                  )
                )}
              </div>
            </div>

            {/* Results metadata count bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#748092] dark:text-[#94A3B8] pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  Tìm thấy{' '}
                  <strong className="text-[#243447] dark:text-white">
                    {dictTotal.toLocaleString()}
                  </strong>{' '}
                  mục từ
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
                  {dictSource === 'cloud_rpc'
                    ? '⚡ PostgreSQL GIN Trigram'
                    : dictSource === 'cloud_table'
                    ? '☁️ Supabase Cloud'
                    : '📦 Dữ liệu chuẩn hóa'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  Trang <strong>{dictPage}</strong> / {dictTotalPages}
                </span>
              </div>
            </div>
          </div>

          {/* Dictionary Results Grid */}
          {dictLoading ? (
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E85D3F] border-t-transparent mb-3" />
              <p className="text-xs font-bold text-[#748092]">
                Đang tải dữ liệu từ kho từ điển CC-CEDICT...
              </p>
            </div>
          ) : dictResults.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-base font-bold text-[#243447] dark:text-white">
                Không tìm thấy từ vựng phù hợp
              </h3>
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
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                item.qualityStatus === 'verified_human'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {item.qualityStatus === 'verified_human'
                                ? '✓ Đã kiểm duyệt'
                                : 'CC-CEDICT'}
                            </span>
                          </div>
                          <AudioButton
                            text={item.hanzi || item.simplified}
                            size="sm"
                          />
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
                            {item.hanzi || item.simplified}
                          </span>
                          {item.traditional &&
                            item.traditional !== (item.hanzi || item.simplified) && (
                              <span
                                className="font-['Noto_Serif_SC'] text-sm text-slate-400"
                                title="Chữ phồn thể"
                              >
                                ({item.traditional})
                              </span>
                            )}
                          <span className="text-sm font-bold text-[#E85D3F]">
                            {item.pinyin}
                          </span>
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
                          {isSaved ? (
                            <BookmarkCheck size={13} />
                          ) : (
                            <BookmarkPlus size={13} />
                          )}
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
                    setDictPage((prev) => Math.max(1, prev - 1));
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
                    setDictPage((prev) => Math.min(dictTotalPages, prev + 1));
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
      ) : filteredVocab.length === 0 ? (
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
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setStatusFilter('all');
                    setSelectedTopic('Tất cả');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#243447] dark:text-white cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setShowAddModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md hover:bg-[#CB4529] transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Thêm từ vựng mới này ngay</span>
                </button>
              </div>
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
              <span>
                Chủ đề: {currentCard.topic} • {currentCard.level}
              </span>
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
                  className="p-1 text-[#748092] hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <span>
                Thẻ {currentIndex + 1} / {filteredVocab.length}
              </span>
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Lật lại mặt trước thẻ từ vựng' : 'Lật xem mặt sau thẻ từ vựng'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFlip();
              }
            }}
            onTouchStart={() => {
              cardTouchMovedRef.current = false;
            }}
            onTouchMove={() => {
              cardTouchMovedRef.current = true;
            }}
            onClick={() => {
              if (cardTouchMovedRef.current) {
                cardTouchMovedRef.current = false;
                return;
              }
              handleFlip();
            }}
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
                  <div className="font-['Noto_Serif_SC'] text-6xl sm:text-7xl font-black text-[#243447] dark:text-white tracking-wide">
                    {currentCard.hanzi}
                  </div>
                  {currentCard.traditional &&
                    currentCard.traditional !== currentCard.hanzi && (
                      <p className="text-xs font-medium text-[#748092] dark:text-[#94A3B8]">
                        Phồn thể:{' '}
                        <span className="font-['Noto_Serif_SC'] font-bold text-[#E85D3F]">
                          {currentCard.traditional}
                        </span>
                      </p>
                    )}
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                    Bộ thủ: {currentCard.radical} • {currentCard.strokes} nét
                  </p>
                </div>

                <div className="text-xs font-bold text-[#E85D3F] flex items-center gap-1.5 animate-bounce">
                  <RotateCw size={14} />
                  <span>Bấm vào thẻ để xem Pinyin, nghĩa &amp; chiết tự</span>
                </div>
              </div>

              {/* BACK OF FLASHCARD */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-[#1E293B] rounded-3xl p-5 sm:p-7 flex flex-col justify-between text-left overflow-y-auto overscroll-contain">
                <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
                      {currentCard.hanzi}
                    </span>
                    {currentCard.traditional &&
                      currentCard.traditional !== currentCard.hanzi && (
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
                    <span className="text-[11px] text-[#748092] dark:text-[#94A3B8] block">
                      Nghĩa tiếng Việt:
                    </span>
                    <p className="text-lg font-bold text-[#45B97C]">
                      {currentCard.meaning}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#748092]">
                      <p>
                        Âm Hán-Việt:{' '}
                        <span className="font-semibold text-[#243447] dark:text-white">
                          {currentCard.hanviet}
                        </span>
                      </p>
                      {currentCard.en && (
                        <p>
                          Tiếng Anh (CC-CEDICT):{' '}
                          <span className="font-medium text-[#243447] dark:text-gray-300">
                            {currentCard.en}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[11px] font-bold text-[#E85D3F] block mb-1">
                      Mẹo nhớ chữ qua chiết tự:
                    </span>
                    <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                      {currentCard.mnemonic}
                    </p>
                  </div>

                  {currentCard.example && (
                    <div className="text-xs space-y-0.5 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#243447] dark:text-white">
                            Ví dụ từ điển:
                          </span>
                          <AiContextBadge type="official_dict" size="xs" />
                        </div>
                        <AudioButton text={currentCard.example.hanzi} size="sm" />
                      </div>
                      <p className="text-[#243447] dark:text-white font-medium">
                        {currentCard.example.hanzi}
                      </p>
                      {currentCard.example.pinyin && (
                        <p className="text-[11px] text-[#E85D3F]">
                          {currentCard.example.pinyin}
                        </p>
                      )}
                      <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                        {currentCard.example.meaning}
                      </p>
                    </div>
                  )}

                  {/* AI Contextual Generated Drill */}
                  {aiGeneratedExample ? (
                    <div className="text-xs space-y-0.5 pt-1 p-2.5 rounded-xl bg-amber-50/70 dark:bg-gray-800/70 border border-amber-200/60 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#E85D3F]">
                            Ngữ cảnh bổ trợ:
                          </span>
                          <AiContextBadge type="ai_suggestion" size="xs" />
                        </div>
                        <AudioButton
                          text={aiGeneratedExample.targetHanzi || currentCard.hanzi}
                          size="sm"
                        />
                      </div>
                      <p className="text-[#243447] dark:text-white font-medium">
                        {aiGeneratedExample.targetHanzi || currentCard.hanzi}
                      </p>
                      {aiGeneratedExample.pinyin && (
                        <p className="text-[11px] text-[#E85D3F]">
                          {aiGeneratedExample.pinyin}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-600 dark:text-gray-300">
                        {aiGeneratedExample.explanation || aiGeneratedExample.prompt}
                      </p>
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
                        <Sparkles
                          size={13}
                          className={isGeneratingExample ? 'animate-spin' : ''}
                        />
                        <span>
                          {isGeneratingExample
                            ? 'Đang tạo câu ví dụ...'
                            : '✨ Tạo câu ví dụ ngữ cảnh AI'}
                        </span>
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
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
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
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
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
                    SRS:{' '}
                    {srsMap[currentCard.hanzi]?.stage === 2
                      ? '🏆 Đã thuần thục'
                      : srsMap[currentCard.hanzi]?.stage === 1
                      ? '🔄 Đang ôn tập'
                      : '🆕 Thẻ mới'}
                  </span>
                </span>
                {(srsMap[currentCard.hanzi]?.lapseCount ||
                  srsMap[currentCard.hanzi]?.lapse_count ||
                  0) >= 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 text-[10px]">
                    ⚠️ Hay quên (
                    {srsMap[currentCard.hanzi]?.lapseCount ||
                      srsMap[currentCard.hanzi]?.lapse_count}{' '}
                    lần)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>
                  Lặp: <strong>{srsMap[currentCard.hanzi]?.repetitions || 0}</strong> lần
                </span>
                <span>
                  Cách: <strong>{srsMap[currentCard.hanzi]?.intervalDays || 1}</strong>{' '}
                  ngày
                </span>
                <span>
                  EF:{' '}
                  <strong>
                    {(srsMap[currentCard.hanzi]?.easeFactor || 2.5).toFixed(2)}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons: 4-tier SM-2 SRS Rating */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.AGAIN)}
              className="min-h-[48px] py-3 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 font-bold text-xs shadow-2xs transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-rose-200/70 dark:bg-rose-900/80 text-[10px] font-black flex items-center justify-center">
                  1
                </span>
                <Clock size={14} className="text-rose-500" />
                <span>Quên</span>
              </div>
              <span className="text-[10px] font-semibold text-rose-600/80 dark:text-rose-300/80">
                {srsPreview.againLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.HARD)}
              className="min-h-[48px] py-3 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 font-bold text-xs shadow-2xs transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-amber-200/80 dark:bg-amber-900/80 text-[10px] font-black flex items-center justify-center">
                  2
                </span>
                <RotateCw size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Khó</span>
              </div>
              <span className="text-[10px] font-semibold text-amber-700/80 dark:text-amber-300/80">
                Ôn sau {srsPreview.hardLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.GOOD)}
              className="min-h-[48px] py-3 px-3 rounded-2xl bg-gradient-to-br from-[#45B97C] to-[#2E8B57] text-white font-bold text-xs shadow-md shadow-[#45B97C]/25 hover:opacity-95 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-white/20 text-[10px] font-black flex items-center justify-center">
                  3
                </span>
                <Check size={14} />
                <span>Tốt</span>
              </div>
              <span className="text-[10px] font-semibold text-white/85">
                Ôn sau {srsPreview.goodLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSrsRate(currentCard, SRS_QUALITY.EASY)}
              className="min-h-[48px] py-3 px-3 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 hover:opacity-95 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-white/20 text-[10px] font-black flex items-center justify-center">
                  4
                </span>
                <Zap size={14} />
                <span>Dễ</span>
              </div>
              <span className="text-[10px] font-semibold text-white/85">
                Ôn sau {srsPreview.easyLabel}
              </span>
            </button>
          </div>

          {/* Prev / Next Card Controls */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              onClick={handlePrevCard}
              title="Thẻ trước (←)"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white shadow-sm transition-colors active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-[#748092]">
              {currentIndex + 1} / {filteredVocab.length}
            </span>
            <button
              onClick={handleNextCard}
              title="Thẻ tiếp theo (→)"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white shadow-sm transition-colors active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Keyboard shortcut guide (Đã đồng bộ chuẩn 4 phím 1-2-3-4) */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#748092] dark:text-[#94A3B8] pt-1">
            <span className="flex items-center gap-1 font-bold text-[#243447] dark:text-white">
              <Keyboard size={13} /> Phím tắt:
            </span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
              Space: Lật
            </span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
              ← / →: Chuyển thẻ
            </span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
              1: Quên
            </span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
              2: Khó
            </span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
              3: Tốt
            </span>
            <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
              4: Dễ
            </span>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* 2. GRID VIEW OF VOCABULARY (Paginated 48/page for fast INP) */
        (() => {
          const gridTotalPages = Math.max(1, Math.ceil(filteredVocab.length / GRID_PAGE_SIZE));
          const safeGridPage = Math.min(gridPage, gridTotalPages);
          const paginatedGridVocab = filteredVocab.slice(
            (safeGridPage - 1) * GRID_PAGE_SIZE,
            safeGridPage * GRID_PAGE_SIZE
          );
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedGridVocab.map((item) => {
            const isRemembered =
              rememberedIds.includes(item.id) || srsMap[item.hanzi]?.stage === 2;
            const isReview =
              reviewIds.includes(item.id) || srsMap[item.hanzi]?.stage === 1;

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
                          className="p-1 rounded-md text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
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
                    <span className="text-sm font-bold text-[#E85D3F]">
                      {item.pinyin}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#45B97C] mt-1">{item.meaning}</p>
                  <p className="text-[11px] text-[#748092] mt-0.5">
                    Hán-Việt: {item.hanviet}
                  </p>
                </div>

                {item.mnemonic && (
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] italic line-clamp-2">
                    💡 {item.mnemonic}
                  </p>
                )}

                {item.example && (
                  <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px] text-[#748092] dark:text-[#94A3B8]">
                    <p className="font-semibold text-[#243447] dark:text-white">
                      {item.example.hanzi}
                    </p>
                    <p>{item.example.meaning}</p>
                  </div>
                )}

                {/* Status Badges (Truyền trực tiếp item để hoạt động cả ở Corpus Mode) */}
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
                      onClick={() => handleMarkReview(item)}
                      title="Đánh dấu cần ôn"
                      className={`p-1 rounded cursor-pointer ${
                        isReview
                          ? 'text-amber-600 font-bold'
                          : 'text-[#748092] hover:text-amber-600'
                      }`}
                    >
                      <Clock size={13} />
                    </button>
                    <button
                      onClick={() => handleMarkRemembered(item)}
                      title="Đánh dấu đã nhớ"
                      className={`p-1 rounded cursor-pointer ${
                        isRemembered
                          ? 'text-emerald-600 font-bold'
                          : 'text-[#748092] hover:text-emerald-600'
                      }`}
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
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
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
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
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
              {gridTotalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={safeGridPage <= 1}
                    onClick={() => setGridPage((p) => Math.max(1, p - 1))}
                    className="min-h-11 px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white disabled:opacity-40 cursor-pointer"
                  >
                    Trang trước
                  </button>
                  <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                    Trang {safeGridPage} / {gridTotalPages} ({filteredVocab.length} từ)
                  </span>
                  <button
                    type="button"
                    disabled={safeGridPage >= gridTotalPages}
                    onClick={() => setGridPage((p) => Math.min(gridTotalPages, p + 1))}
                    className="min-h-11 px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white disabled:opacity-40 cursor-pointer"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          );
        })()
      ) : (
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
          {currentCard && (
            <div className="p-8 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
              <span className="font-['Noto_Serif_SC'] text-6xl sm:text-7xl font-black text-[#243447] dark:text-white block">
                {currentCard.hanzi}
              </span>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-sm font-bold text-[#E85D3F]">
                  {currentCard.pinyin}
                </span>
                <AudioButton text={currentCard.hanzi} size="sm" />
              </div>
              <p className="text-xs text-[#748092]">Hán-Việt: {currentCard.hanviet}</p>
            </div>
          )}

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentCard?.meaning;
              let btnClass =
                'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';

              if (quizAnswered) {
                if (isCorrect) {
                  btnClass =
                    'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnClass =
                    'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Quiz Feedback & Next Button */}
          {quizAnswered && currentCard && (
            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-3 animate-in fade-in">
              <p className="font-bold text-[#243447] dark:text-white">
                {selectedOption === currentCard.meaning
                  ? '🎉 Chính xác tuyệt vời!'
                  : `⚠️ Chưa đúng! Nghĩa đúng là: ${currentCard.meaning}`}
              </p>
              {currentCard.mnemonic && (
                <p className="text-[11px] text-[#748092]">
                  💡 Mẹo nhớ: {currentCard.mnemonic}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectWriting
                        ? onSelectWriting(currentCard)
                        : setActiveTab?.('writing')
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[11px] font-bold flex items-center gap-1 hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    <PenTool size={12} />
                    <span>Viết chữ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectPronounce
                        ? onSelectPronounce(currentCard)
                        : setActiveTab?.('pronunciation')
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <Mic size={12} />
                    <span>Phát âm</span>
                  </button>
                </div>
                <button
                  onClick={handleNextQuizCard}
                  className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-sm transition-all ml-auto cursor-pointer"
                >
                  Từ tiếp theo ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODAL: DICTIONARY WORD DETAIL
      ===================================================================== */}
      {selectedDictWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90dvh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-start justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-['Noto_Serif_SC'] text-4xl font-black text-[#243447] dark:text-white">
                    {selectedDictWord.hanzi || selectedDictWord.simplified}
                  </span>
                  {selectedDictWord.traditional &&
                    selectedDictWord.traditional !==
                      (selectedDictWord.hanzi || selectedDictWord.simplified) && (
                      <span
                        className="font-['Noto_Serif_SC'] text-lg text-slate-400"
                        title="Chữ phồn thể"
                      >
                        ({selectedDictWord.traditional})
                      </span>
                    )}
                  <AudioButton
                    text={selectedDictWord.hanzi || selectedDictWord.simplified}
                    size="md"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-bold text-[#E85D3F]">
                    {selectedDictWord.pinyin}
                  </span>
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
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  selectedDictWord.qualityStatus === 'verified_human'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {selectedDictWord.qualityStatus === 'verified_human'
                  ? '✓ Nghĩa tiếng Việt đã kiểm duyệt'
                  : 'Nguồn CC-CEDICT (CC BY-SA 4.0)'}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#748092]">
                Ý nghĩa &amp; Định nghĩa:
              </h4>
              {selectedDictWord.meaningVi && (
                <p className="text-sm font-bold text-[#45B97C] bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  {selectedDictWord.meaningVi}
                </p>
              )}
              {Array.isArray(selectedDictWord.definitions) &&
              selectedDictWord.definitions.length > 0 ? (
                <ul className="space-y-1 pl-4 list-disc text-xs text-[#243447] dark:text-slate-300">
                  {selectedDictWord.definitions.map((def, dIdx) => (
                    <li key={dIdx}>{def}</li>
                  ))}
                </ul>
              ) : selectedDictWord.meaningEn ? (
                <p className="text-xs italic text-[#748092]">
                  {selectedDictWord.meaningEn}
                </p>
              ) : null}
            </div>

            {selectedDictWord.decomposition && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-[#243447] dark:text-white">
                  Chiết tự &amp; Kết cấu:
                </span>
                <p className="text-[#748092] dark:text-slate-400">
                  {selectedDictWord.decomposition.structureType} • Chuỗi IDS:{' '}
                  <code className="font-mono text-amber-600">
                    {selectedDictWord.decomposition.idsSequence}
                  </code>
                </p>
              </div>
            )}

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

      {/* =====================================================================
          MODAL: ADD CUSTOM VOCABULARY (ĐÃ BỔ SUNG ĐỦ HSK 1 -> HSK 7-9)
      ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90dvh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
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
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

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
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span className="font-bold">{sug.hanzi}</span>
                    <span className="text-[10px] text-[#748092]">({sug.meaning})</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddNewVocab} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Chữ Hán (Hanzi) *
                </label>
                <input
                  type="text"
                  required
                  value={newHanzi}
                  onChange={(e) => setNewHanzi(e.target.value)}
                  placeholder="Ví dụ: 猫, 咖啡 hoặc 赋能"
                  className="w-full px-4 py-3 rounded-2xl text-lg font-['Noto_Serif_SC'] font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {matchedVocabInDict && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-bold flex items-center gap-1">
                      <span>
                        💡 Tìm thấy &ldquo;{matchedVocabInDict.hanzi}&rdquo; trong từ điển!
                      </span>
                    </p>
                    <p className="text-[11px] opacity-80">
                      Pinyin: {matchedVocabInDict.pinyin} • Nghĩa:{' '}
                      {matchedVocabInDict.meaning}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyDictMatch}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 transition-colors shadow-sm cursor-pointer"
                  >
                    Tự điền nhanh
                  </button>
                </div>
              )}

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
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Cấp độ HSK
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="HSK 5">HSK 5</option>
                    <option value="HSK 6">HSK 6</option>
                    <option value="HSK 7-9">HSK 7–9 (HSK 3.0 Cao cấp)</option>
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
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                    <option value="Kinh tế & Học thuật">Kinh tế &amp; Học thuật</option>
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
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />

                <input
                  type="text"
                  value={newExamplePinyin}
                  onChange={(e) => setNewExamplePinyin(e.target.value)}
                  placeholder="Pinyin: Wǒ jiā yǒu yì zhī kě’ài de xiǎomāo."
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />

                <input
                  type="text"
                  value={newExampleMeaning}
                  onChange={(e) => setNewExampleMeaning(e.target.value)}
                  placeholder="Nghĩa: Nhà tôi có một chú mèo con rất đáng yêu."
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!newHanzi.trim() || !newMeaning.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Lưu &amp; Học từ này ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
