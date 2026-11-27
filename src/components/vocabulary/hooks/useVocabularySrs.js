import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { playClickSound, playSuccessSound, playErrorSound } from '../../../utils/audio';
import { VOCABULARY_LIST } from '../../../data/chineseData';
import {
  getStoredCustomVocab,
  saveCustomVocab,
  deleteCustomVocab,
} from '../../../utils/materialsStorage';
import {
  triggerCloudSync,
  getVocabularyFromDb,
  addVocabularyToDb,
} from '../../../supabase/services';
import { awardXp, getUserStorageKey, getLocalDateString } from '../../../utils/gamification';
import {
  calculateNextSrsReview,
  SRS_QUALITY,
  captureWeakVocabulary,
} from '../../../utils/srsEngine';
import {
  syncUserVocabSrsFromCloud,
  updateDailyMissionProgress,
} from '../../../services';
import { getPersonalizedExercises } from '../../../services/aiGateway.js';
import { searchDictionaryPaginated } from '../../../services/dictionaryService.js';
import {
  getLocalHsk79Flashcards,
  HSK_30_TOTAL_VOCAB_COUNT,
} from '../../../services/hsk30FlashcardDeckService.js';
import {
  STORAGE_REMEMBERED,
  STORAGE_REVIEW,
  STORAGE_SRS_STATE,
  VALID_VOCAB_VIEWS,
} from '../vocabularyConstants';
import {
  normalizeVocab,
  buildInitialVocabList,
  computeHskCounts,
  computeVocabSrsStats,
  computeHskLevelProgress,
  exportVocabListToCsv,
} from '../vocabularyHelpers';

export function useVocabularySrs({ user, initialView = 'flashcard', onRecordSrsTelemetry }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposingSearch, setIsComposingSearch] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');
  const [selectedHsk, setSelectedHsk] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'due', 'leeches', 'custom', 'remembered', 'review', 'srs_priority'
  const [hideMastered, setHideMastered] = useState(true);
  const [lengthFilter, setLengthFilter] = useState('all'); // 'all', 'single', 'compound'
  const [gridPage, setGridPage] = useState(1);
  const [viewMode, setViewMode] = useState(() =>
    VALID_VOCAB_VIEWS.includes(initialView) ? initialView : 'flashcard'
  );

  useEffect(() => {
    if (VALID_VOCAB_VIEWS.includes(initialView)) {
      setViewMode(initialView);
    }
  }, [initialView]);

  // Kho 11.000 từ vựng chuẩn HSK 3.0 cho Flashcards
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

  // Flashcard interaction state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const isRatingRef = useRef(false);
  const filteredVocabRef = useRef([]);

  // Master vocabulary state initialized lazily from storage + static data
  const [allVocabList, setAllVocabList] = useState(() =>
    buildInitialVocabList(getStoredCustomVocab, getLocalHsk79Flashcards)
  );

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

  const hskCounts = useMemo(() => computeHskCounts(allVocabList), [allVocabList]);
  const srsStats = useMemo(
    () => computeVocabSrsStats(allVocabList, srsMap),
    [allVocabList, srsMap]
  );
  const hskLevelProgress = useMemo(
    () => computeHskLevelProgress(allVocabList, rememberedIds, reviewIds, srsMap),
    [allVocabList, rememberedIds, reviewIds, srsMap]
  );

  const activeHskProgress = useMemo(() => {
    if (selectedHsk === 'all') return null;
    const normalizedId = selectedHsk === 'HSK 5-6' ? 'HSK 6' : selectedHsk;
    return hskLevelProgress.find((t) => t.id === normalizedId) || null;
  }, [selectedHsk, hskLevelProgress]);

  const isPersonalStatusFilter = useMemo(
    () =>
      ['due', 'leeches', 'custom', 'remembered', 'review', 'srs_priority'].includes(
        statusFilter
      ),
    [statusFilter]
  );

  const bindFilteredVocab = useCallback((list) => {
    filteredVocabRef.current = Array.isArray(list) ? list : [];
  }, []);

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
    const len = filteredVocabRef.current.length;
    setCurrentIndex((prev) => (prev < len - 1 ? prev + 1 : 0));
  }, []);

  const handlePrevCard = useCallback(() => {
    playClickSound();
    setIsFlipped(false);
    setAiGeneratedExample(null);
    const len = filteredVocabRef.current.length;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, len - 1)));
  }, []);

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

      if (onRecordSrsTelemetry) {
        onRecordSrsTelemetry({ card, quality, nextSrs });
      }

      triggerCloudSync(user?.uid || user?.id);
      if (viewMode === 'flashcard') {
        if (quality >= SRS_QUALITY.GOOD && hideMastered && statusFilter === 'all') {
          setIsFlipped(false);
          setAiGeneratedExample(null);
          const len = filteredVocabRef.current.length;
          setCurrentIndex((prev) => (prev >= Math.max(0, len - 1) ? 0 : prev));
        } else {
          handleNextCard();
        }
      }
    },
    [srsMap, user, viewMode, hideMastered, statusFilter, handleNextCard, onRecordSrsTelemetry]
  );

  const handleMarkRemembered = useCallback(
    (itemOrId) => {
      const card =
        typeof itemOrId === 'object'
          ? itemOrId
          : filteredVocabRef.current.find((v) => v.id === itemOrId) ||
            allVocabList.find((v) => v.id === itemOrId);
      if (card) handleSrsRate(card, SRS_QUALITY.GOOD);
    },
    [allVocabList, handleSrsRate]
  );

  const handleMarkReview = useCallback(
    (itemOrId) => {
      const card =
        typeof itemOrId === 'object'
          ? itemOrId
          : filteredVocabRef.current.find((v) => v.id === itemOrId) ||
            allVocabList.find((v) => v.id === itemOrId);
      if (card) handleSrsRate(card, SRS_QUALITY.AGAIN);
    },
    [allVocabList, handleSrsRate]
  );

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

    saveCustomVocab(newVocabItem);
    awardXp(15, user, `add_custom_vocab_${newVocabItem.hanzi}`);

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

  const handleExportCsv = () => {
    playClickSound();
    exportVocabListToCsv(filteredVocabRef.current);
  };

  const handleQuizAnswer = async (card, option) => {
    if (quizAnswered || !card) return;
    setSelectedOption(option);
    setQuizAnswered(true);

    if (option === card.meaning) {
      playSuccessSound();
      setQuizScore((prev) => prev + 1);
      const newStreak = quizStreak + 1;
      setQuizStreak(newStreak);
      awardXp(10, user, `vocab_quiz_${card.hanzi}`);

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

  return {
    searchTerm,
    setSearchTerm,
    isComposingSearch,
    setIsComposingSearch,
    selectedTopic,
    setSelectedTopic,
    selectedHsk,
    setSelectedHsk,
    statusFilter,
    setStatusFilter,
    hideMastered,
    setHideMastered,
    lengthFilter,
    setLengthFilter,
    gridPage,
    setGridPage,
    viewMode,
    setViewMode,
    corpusMode,
    setCorpusMode,
    corpusPage,
    setCorpusPage,
    corpusCards,
    setCorpusCards,
    corpusTotalCount,
    setCorpusTotalCount,
    corpusTotalPages,
    setCorpusTotalPages,
    corpusLoading,
    setCorpusLoading,
    corpusSource,
    setCorpusSource,
    dictQuery,
    setDictQuery,
    dictHsk,
    setDictHsk,
    dictPage,
    setDictPage,
    dictResults,
    dictTotal,
    dictTotalPages,
    dictLoading,
    dictSource,
    selectedDictWord,
    setSelectedDictWord,
    savedDictWords,
    allVocabList,
    syncVocabularyFromDb,
    handleSaveDictToSrs,
    currentIndex,
    setCurrentIndex,
    isFlipped,
    rememberedIds,
    reviewIds,
    srsMap,
    showAddModal,
    setShowAddModal,
    newHanzi,
    setNewHanzi,
    newPinyin,
    setNewPinyin,
    newHanviet,
    setNewHanviet,
    newMeaning,
    setNewMeaning,
    newLevel,
    setNewLevel,
    newTopic,
    setNewTopic,
    newRadical,
    setNewRadical,
    newStrokes,
    setNewStrokes,
    newMnemonic,
    setNewMnemonic,
    newExampleHanzi,
    setNewExampleHanzi,
    newExamplePinyin,
    setNewExamplePinyin,
    newExampleMeaning,
    setNewExampleMeaning,
    aiGeneratedExample,
    isGeneratingExample,
    matchedVocabInDict,
    quizScore,
    quizStreak,
    quizAnswered,
    selectedOption,
    hskCounts,
    srsStats,
    hskLevelProgress,
    activeHskProgress,
    isPersonalStatusFilter,
    bindFilteredVocab,
    handleFlip,
    handleNextCard,
    handlePrevCard,
    handleGenerateAiExample,
    handleSrsRate,
    handleMarkRemembered,
    handleMarkReview,
    handleApplySuggestion,
    handleApplyDictMatch,
    handleAddNewVocab,
    handleDeleteCustomItem,
    handleExportCsv,
    handleQuizAnswer,
    handleNextQuizCard,
    displayTotalVocabCount,
    headerMasteredCount,
    headerTargetCount,
    progressPercent,
    customVocabCount,
  };
}
