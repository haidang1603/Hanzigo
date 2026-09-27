import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  BookOpen,
  Keyboard
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import { VOCABULARY_LIST, TOPIC_FILTERS } from '../data/chineseData';
import { getStoredCustomVocab, saveCustomVocab, deleteCustomVocab } from '../utils/materialsStorage';
import { triggerCloudSync, getVocabularyFromDb, addVocabularyToDb } from '../supabase/services';
import { awardXp } from '../utils/gamification';

const STORAGE_REMEMBERED = 'hanzigo_vocab_remembered';
const STORAGE_REVIEW = 'hanzigo_vocab_review';

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

export default function VocabularyPage({ setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');
  const [selectedHsk, setSelectedHsk] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'remembered', 'review', 'custom'
  const [lengthFilter, setLengthFilter] = useState('all'); // 'all', 'single', 'compound'
  const [viewMode, setViewMode] = useState('flashcard'); // 'flashcard', 'grid', 'quiz'

  // Master vocabulary state initialized lazily from storage + static data
  const [allVocabList, setAllVocabList] = useState(() => {
    try {
      const custom = getStoredCustomVocab();
      const normalizedCustom = custom.map(normalizeVocab);
      const normalizedStatic = VOCABULARY_LIST.map(normalizeVocab);
      return [...normalizedCustom, ...normalizedStatic];
    } catch (e) {
      console.error('Error loading vocabulary list:', e);
      return VOCABULARY_LIST.map(normalizeVocab);
    }
  });

  // Fetch words from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    getVocabularyFromDb().then(dbItems => {
      if (!isMounted || !dbItems || dbItems.length === 0) return;
      const normalizedDb = dbItems.map(normalizeVocab);
      setAllVocabList(prev => {
        const custom = prev.filter(p => p.isCustom);
        const merged = [...custom];
        normalizedDb.forEach(dbItem => {
          if (!merged.some(m => m.hanzi === dbItem.hanzi)) {
            merged.push(dbItem);
          }
        });
        return merged;
      });
    });
    return () => { isMounted = false; };
  }, []);

  // Flashcard interaction state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Spaced Repetition status tracking (persisted in localStorage)
  const [rememberedIds, setRememberedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REMEMBERED);
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
      const saved = localStorage.getItem(STORAGE_REVIEW);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

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

  // Filtered vocabularies
  const filteredVocab = useMemo(() => {
    return allVocabList.filter((item) => {
      const matchesSearch = 
        item.hanzi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hanviet.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTopic = selectedTopic === 'Tất cả' || item.topic === selectedTopic;
      const matchesHsk = selectedHsk === 'all' || item.level === selectedHsk;

      let matchesStatus = true;
      if (statusFilter === 'remembered') {
        matchesStatus = rememberedIds.includes(item.id);
      } else if (statusFilter === 'review') {
        matchesStatus = reviewIds.includes(item.id);
      } else if (statusFilter === 'custom') {
        matchesStatus = !!item.isCustom;
      }

      let matchesLength = true;
      if (lengthFilter === 'single') {
        matchesLength = item.hanzi.length === 1;
      } else if (lengthFilter === 'compound') {
        matchesLength = item.hanzi.length > 1;
      }

      return matchesSearch && matchesTopic && matchesHsk && matchesStatus && matchesLength;
    });
  }, [allVocabList, searchTerm, selectedTopic, selectedHsk, statusFilter, lengthFilter, rememberedIds, reviewIds]);

  const currentCard = filteredVocab[currentIndex] || filteredVocab[0];

  // Flip card
  const handleFlip = useCallback(() => {
    playClickSound();
    setIsFlipped(prev => !prev);
  }, []);

  // Next & Prev card
  const handleNextCard = useCallback(() => {
    playClickSound();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
  }, [filteredVocab.length]);

  const handlePrevCard = useCallback(() => {
    playClickSound();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, filteredVocab.length - 1)));
  }, [filteredVocab.length]);

  // Mark as remembered
  const handleMarkRemembered = useCallback((id) => {
    playSuccessSound();
    setRememberedIds(prev => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem(STORAGE_REMEMBERED, JSON.stringify(updated));
      return updated;
    });
    setReviewIds(prev => {
      const updated = prev.filter(item => item !== id);
      localStorage.setItem(STORAGE_REVIEW, JSON.stringify(updated));
      return updated;
    });
    awardXp(10);
    triggerCloudSync();
    handleNextCard();
  }, [handleNextCard]);

  // Mark as need review
  const handleMarkReview = useCallback((id) => {
    playClickSound();
    setReviewIds(prev => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem(STORAGE_REVIEW, JSON.stringify(updated));
      return updated;
    });
    setRememberedIds(prev => {
      const updated = prev.filter(item => item !== id);
      localStorage.setItem(STORAGE_REMEMBERED, JSON.stringify(updated));
      return updated;
    });
    triggerCloudSync();
    handleNextCard();
  }, [handleNextCard]);

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
        if (currentCard) handleMarkReview(currentCard.id);
      } else if (e.key === '2' || e.key === 'm' || e.key === 'M') {
        if (currentCard) handleMarkRemembered(currentCard.id);
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

    const headers = ['Chữ Hán', 'Pinyin', 'Hán-Việt', 'Nghĩa', 'Cấp độ', 'Chủ đề', 'Bộ thủ', 'Số nét', 'Chiết tự', 'Ví dụ'];
    const rows = filteredVocab.map(v => [
      `"${v.hanzi}"`,
      `"${v.pinyin}"`,
      `"${v.hanviet}"`,
      `"${v.meaning}"`,
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
        } catch (e) {}
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
          <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
            Kho Flashcard Từ Vựng Tiếng Trung
          </h1>
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

      {/* Search, Filter Toolbar & View Mode Switcher */}
      <div className="space-y-4 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
        
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

          {/* HSK Level Filter */}
          <select
            value={selectedHsk}
            onChange={(e) => {
              setSelectedHsk(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none"
          >
            <option value="all">Tất cả HSK</option>
            <option value="HSK 1">HSK 1</option>
            <option value="HSK 2">HSK 2</option>
            <option value="HSK 3">HSK 3</option>
          </select>

          {/* Learning Status Filter */}
          <div className="flex items-center gap-1 bg-[#FFF9F2] dark:bg-[#131B24] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'custom', label: `🌟 Tự thêm (${customVocabCount})` },
              { id: 'remembered', label: 'Đã nhớ' },
              { id: 'review', label: 'Cần ôn' }
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
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                    {currentCard.level}
                  </span>
                  <AudioButton text={currentCard.hanzi} size="md" />
                </div>

                <div className="space-y-3">
                  <div className="font-['Noto_Serif_SC'] text-7xl sm:text-8xl font-black text-[#243447] dark:text-white tracking-wide">
                    {currentCard.hanzi}
                  </div>
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
                    <span className="text-lg font-bold text-[#E85D3F]">
                      {currentCard.pinyin}
                    </span>
                  </div>
                  <AudioButton text={currentCard.hanzi} size="sm" />
                </div>

                <div className="space-y-3 my-auto py-2">
                  <div>
                    <span className="text-[11px] text-[#748092] dark:text-[#94A3B8] block">Nghĩa tiếng Việt:</span>
                    <p className="text-lg font-bold text-[#45B97C]">{currentCard.meaning}</p>
                    <p className="text-xs text-[#748092]">Âm Hán-Việt: <span className="font-semibold text-[#243447] dark:text-white">{currentCard.hanviet}</span></p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[11px] font-bold text-[#E85D3F] block mb-1">Mẹo nhớ chữ qua chiết tự:</span>
                    <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">{currentCard.mnemonic}</p>
                  </div>

                  {currentCard.example && (
                    <div className="text-xs space-y-0.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#243447] dark:text-white">Ví dụ thực tế:</span>
                        <AudioButton text={currentCard.example.hanzi} size="sm" />
                      </div>
                      <p className="text-[#243447] dark:text-white font-medium">{currentCard.example.hanzi}</p>
                      {currentCard.example.pinyin && (
                        <p className="text-[11px] text-[#E85D3F]">{currentCard.example.pinyin}</p>
                      )}
                      <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">{currentCard.example.meaning}</p>
                    </div>
                  )}
                </div>

                {/* Cross-practice Quick Access */}
                {setActiveTab && (
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('writing');
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
                        setActiveTab('pronunciation');
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

          {/* Action Buttons: Cần ôn lại vs Đã nhớ vững */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <button
              onClick={() => handleMarkReview(currentCard.id)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#FEF7E9] border border-[#F4B942]/50 text-[#D97706] font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Clock size={16} />
              <span>Cần ôn lại (Phím 1)</span>
            </button>

            <button
              onClick={() => handleMarkRemembered(currentCard.id)}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#45B97C]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={16} />
              <span>Đã nhớ vững (Phím 2)</span>
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
                {setActiveTab && (
                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                    <button
                      onClick={() => setActiveTab('writing')}
                      title="Chuyển sang trang Luyện viết chữ"
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <PenTool size={11} />
                      <span>Viết chữ</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('pronunciation')}
                      title="Chuyển sang trang Luyện phát âm"
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
            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-2 animate-in fade-in">
              <p className="font-bold text-[#243447] dark:text-white">
                {selectedOption === currentCard.meaning ? '🎉 Chính xác tuyệt vời!' : `⚠️ Chưa đúng! Nghĩa đúng là: ${currentCard.meaning}`}
              </p>
              {currentCard.mnemonic && (
                <p className="text-[11px] text-[#748092]">💡 Mẹo nhớ: {currentCard.mnemonic}</p>
              )}
              <div className="text-right pt-2">
                <button
                  onClick={handleNextQuizCard}
                  className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-sm transition-all"
                >
                  Từ tiếp theo ➔
                </button>
              </div>
            </div>
          )}
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
