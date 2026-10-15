import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Layers, 
  BookOpen,
  X, 
  Share2, 
  Grid, 
  Check, 
  Repeat, 
  Printer
} from 'lucide-react';
import StrokeOrderPlayer from '../components/dictionary/StrokeOrderPlayer';
import InteractiveWritingPad from '../components/dictionary/InteractiveWritingPad';
import CharacterDetailCard from '../components/dictionary/CharacterDetailCard';
import RadicalBrowserModal from '../components/dictionary/RadicalBrowserModal';
import AiCharacterTutorModal from '../components/dictionary/AiCharacterTutorModal';
import WorksheetGeneratorModal from '../components/dictionary/WorksheetGeneratorModal';
import AudioButton from '../components/AudioButton';
import { 
  searchCharacters, 
  getCharacterDetail, 
  getUserWritingProgressMap, 
  setUserWritingStatus, 
  WRITING_STATUS 
} from '../services/characterDictionaryService';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { awardXp } from '../utils/gamification';

export default function WritingPage({ 
  user, 
  targetVocab, 
  _onClearTargetVocab, 
  _setActiveTab, 
  _onSelectPronounce 
}) {
  // Parse initial character from URL hash if available (e.g. #writing?char=学 or #writing/学)
  const getUrlInitialChar = () => {
    try {
      const fullHash = window.location.hash || '';
      const [path, query] = fullHash.split('?');
      if (query) {
        const params = new URLSearchParams(query);
        const charParam = params.get('char');
        if (charParam) return decodeURIComponent(charParam).trim();
      }
      const parts = path.replace(/^#\/?/, '').split('/').filter(Boolean);
      if (parts.length >= 2 && (parts[0] === 'writing' || parts[0] === 'dictionary')) {
        return decodeURIComponent(parts[1]).trim();
      }
    } catch {}
    return null;
  };

  const initialTargetChar = targetVocab?.hanzi 
    ? (Array.from(targetVocab.hanzi).find(c => /[\u4e00-\u9fa5]/.test(c)) || '你')
    : (getUrlInitialChar() || '你');

  const [selectedChar, setSelectedChar] = useState(initialTargetChar);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hskFilter, setHskFilter] = useState('all');
  const [radicalFilter, setRadicalFilter] = useState('all');
  const [strokeFilter, setStrokeFilter] = useState('all');

  // Modals state
  const [radicalModalOpen, setRadicalModalOpen] = useState(false);
  const [aiTutorModalOpen, setAiTutorModalOpen] = useState(false);
  const [worksheetModalOpen, setWorksheetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // User progress mapping
  const [progressMap, setProgressMap] = useState(() => getUserWritingProgressMap(user));

  // Sync progress state on user change or progress event
  useEffect(() => {
    setProgressMap(getUserWritingProgressMap(user));
    const handleProgressUpdate = () => {
      setProgressMap(getUserWritingProgressMap(user));
    };
    window.addEventListener('hanzigo_writing_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('hanzigo_writing_progress_updated', handleProgressUpdate);
  }, [user]);

  // Debounce search query input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Synchronize URL hash when selected character changes for shareable link
  useEffect(() => {
    if (!selectedChar) return;
    try {
      const currentTab = window.location.hash.startsWith('#dictionary') ? 'dictionary' : 'writing';
      const expectedHash = `#${currentTab}?char=${encodeURIComponent(selectedChar)}`;
      if (window.location.hash !== expectedHash && !window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', expectedHash);
      }
    } catch {}
  }, [selectedChar]);

  // Listen to external hash changes (e.g. browser back/forward or navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const urlChar = getUrlInitialChar();
      if (urlChar && urlChar !== selectedChar) {
        setSelectedChar(urlChar);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [selectedChar]);

  // Update selected character when targetVocab prop changes
  useEffect(() => {
    if (targetVocab?.hanzi) {
      const firstHanzi = Array.from(targetVocab.hanzi).find(c => /[\u4e00-\u9fa5]/.test(c));
      if (firstHanzi) {
        setSelectedChar(firstHanzi);
      }
    }
  }, [targetVocab]);

  // Parse stroke min/max based on stroke filter
  const strokeRange = useMemo(() => {
    if (strokeFilter === '1-4') return { min: 1, max: 4 };
    if (strokeFilter === '5-8') return { min: 5, max: 8 };
    if (strokeFilter === '9-12') return { min: 9, max: 12 };
    if (strokeFilter === '13+') return { min: 13, max: 64 };
    return { min: null, max: null };
  }, [strokeFilter]);

  // Execute dictionary search
  const searchResults = useMemo(() => {
    return searchCharacters({
      query: debouncedQuery,
      hskFilter,
      radicalFilter,
      strokeMin: strokeRange.min,
      strokeMax: strokeRange.max,
      limit: 60
    });
  }, [debouncedQuery, hskFilter, radicalFilter, strokeRange]);

  // Fetch full details of the currently selected character
  const characterDetail = useMemo(() => {
    return getCharacterDetail(selectedChar);
  }, [selectedChar]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle direct Enter submit in search box
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;

    // 1. If it contains Chinese characters, select the first Chinese character
    const hanChar = Array.from(clean).find(c => /[\u4e00-\u9fa5]/.test(c));
    if (hanChar) {
      setSelectedChar(hanChar);
      showToast(`Đã chọn chữ "${hanChar}"`);
      return;
    }

    // 2. Otherwise if searchResults has items, select the top match
    if (searchResults.items && searchResults.items.length > 0) {
      const topMatch = searchResults.items[0].char;
      setSelectedChar(topMatch);
      showToast(`Đã chọn chữ "${topMatch}"`);
    }
  };

  // Handle Mark Status (Học mới, Đang học, Đã học, Cần ôn tập)
  const handleSetStatus = async (status) => {
    playClickSound();
    await setUserWritingStatus(selectedChar, status, user);
    setProgressMap(getUserWritingProgressMap(user));

    if (status === WRITING_STATUS.LEARNED) {
      playSuccessSound();
      awardXp(15, user, `writing_learned_${selectedChar}`);
      showToast(`Đã đánh dấu chữ "${selectedChar}" là ĐÃ HỌC (+15 XP)!`);
    } else if (status === WRITING_STATUS.NEEDS_REVIEW) {
      showToast(`Đã đưa chữ "${selectedChar}" vào danh sách CẦN ÔN TẬP!`);
    } else {
      showToast(`Đã cập nhật trạng thái chữ "${selectedChar}".`);
    }
  };

  // Handle Practice Complete (Quiz Mode)
  const handlePracticeComplete = async (summary) => {
    await setUserWritingStatus(selectedChar, WRITING_STATUS.LEARNED, user, {
      score: summary.score,
      mistakes: summary.mistakes
    });
    setProgressMap(getUserWritingProgressMap(user));
    awardXp(20, user, `writing_quiz_${selectedChar}`);
    showToast(`Chúc mừng! Bạn đạt ${summary.score}/100 điểm (+20 XP)!`);
  };

  // Handle Share link copy
  const handleShareLink = () => {
    playClickSound();
    try {
      const shareUrl = `${window.location.origin}/#writing?char=${encodeURIComponent(selectedChar)}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        showToast('Đã sao chép liên kết chia sẻ chữ Hán vào bộ nhớ tạm!');
      } else {
        showToast(`Liên kết: ${shareUrl}`);
      }
    } catch {
      showToast('Không thể sao chép liên kết.');
    }
  };

  const currentCharStatus = progressMap[selectedChar]?.status || WRITING_STATUS.NOT_STARTED;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Page Header & Search Bar */}
      <div className="bg-gradient-to-br from-[#FFF9F2] via-white to-[#FCEEE2] dark:from-[#131B24] dark:via-[#1E293B] dark:to-[#0F172A] rounded-3xl p-6 sm:p-8 border border-[#F1E5D8] dark:border-[#334155] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E85D3F]/10 text-[#E85D3F] border border-[#E85D3F]/20 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Từ điển Chữ Hán & Thứ tự Nét
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Chuẩn hóa 214 Bộ thủ Khang Hy & Thuật toán nét thuận
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#243447] dark:text-[#F3F4F6] tracking-tight">
            Tra cứu Chữ Hán & Luyện viết Nét thuận
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Tra cứu theo Chữ Hán giản/phồn, Pinyin có dấu hoặc không dấu, nghĩa tiếng Việt, bộ thủ và số nét. Quan sát hoạt ảnh bút thuận chi tiết và tự tay luyện viết trên ô Mễ tự.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative flex items-center shadow-md shadow-[#E85D3F]/5 rounded-2xl overflow-hidden border-2 border-[#E85D3F]/40 focus-within:border-[#E85D3F] bg-white dark:bg-[#0F172A] transition-all">
                <Search className="w-5 h-5 absolute left-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm chữ Hán (học, 你, nihao, hao3, nước, con người, bộ thủ...)"
                  className="w-full pl-12 pr-24 py-3.5 sm:py-4 text-sm sm:text-base text-[#243447] dark:text-[#F3F4F6] bg-transparent focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-12 text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                  >
                    Xóa
                  </button>
                )}
                <div className="absolute right-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {searchResults.total} kết quả
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            {/* HSK Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#0F172A] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#334155]">
              <span className="text-gray-400 px-1 font-semibold">HSK:</span>
              {['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5-6'].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setHskFilter(lvl);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    hskFilter === lvl
                      ? 'bg-[#E85D3F] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả' : lvl}
                </button>
              ))}
            </div>

            {/* Radical Button Trigger */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setRadicalModalOpen(true);
              }}
              className={`px-3 py-2 rounded-xl font-bold border flex items-center gap-1.5 transition-all ${
                radicalFilter !== 'all'
                  ? 'bg-[#E85D3F] text-white border-[#E85D3F]'
                  : 'bg-white dark:bg-[#0F172A] border-[#F1E5D8] dark:border-[#334155] text-gray-700 dark:text-gray-200 hover:border-[#E85D3F]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#E85D3F]" />
              <span>
                {radicalFilter !== 'all' ? `Bộ thủ: ${radicalFilter}` : '214 Bộ thủ (Khang Hy)'}
              </span>
            </button>
            {radicalFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setRadicalFilter('all')}
                className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-800"
                title="Bỏ lọc bộ thủ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Stroke Count Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#0F172A] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#334155]">
              <span className="text-gray-400 px-1 font-semibold">Số nét:</span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: '1-4', label: '1 - 4' },
                { id: '5-8', label: '5 - 8' },
                { id: '9-12', label: '9 - 12' },
                { id: '13+', label: '13+' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setStrokeFilter(s.id);
                  }}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    strokeFilter === s.id
                      ? 'bg-[#E85D3F] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compound Multi-Character Breakdown Banner (nếu tìm từ ghép) */}
      {searchResults.multiCharBreakdown && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-['Noto_Serif_SC'] text-2xl sm:text-3xl font-black text-[#E85D3F]">
              {searchResults.multiCharBreakdown.word}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#243447] dark:text-[#F3F4F6]">
                  {searchResults.multiCharBreakdown.pinyin}
                </span>
                <AudioButton text={searchResults.multiCharBreakdown.word} size="sm" />
                {searchResults.multiCharBreakdown.level && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#E85D3F]/10 text-[#E85D3F]">
                    {searchResults.multiCharBreakdown.level}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                {searchResults.multiCharBreakdown.meaning}
              </p>
            </div>
          </div>

          {/* Individual character selection buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Phân rã từng chữ:</span>
            {searchResults.multiCharBreakdown.characters.map((item) => (
              <button
                key={item.char}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedChar(item.char);
                }}
                className={`w-9 h-9 rounded-xl font-['Noto_Serif_SC'] text-lg font-bold transition-all border ${
                  selectedChar === item.char
                    ? 'bg-[#E85D3F] text-white border-[#E85D3F] scale-105 shadow-xs'
                    : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 text-[#243447] dark:text-[#F3F4F6] hover:border-[#E85D3F]'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Centerpiece Workspace (Grid: 2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 Cols): Stroke Animation & Interactive Writing Pad */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stroke Animator Player */}
          <StrokeOrderPlayer
            character={selectedChar}
            strokesCount={characterDetail?.strokesCount || 6}
          />

          {/* Interactive Writing Area */}
          <InteractiveWritingPad
            character={selectedChar}
            strokesCount={characterDetail?.strokesCount || 6}
            onPracticeComplete={handlePracticeComplete}
          />
        </div>

        {/* Right Column (7 Cols): Comprehensive Character Detail Profile */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status & Mastery Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#334155] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                Trạng thái học tập:
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                currentCharStatus === WRITING_STATUS.LEARNED
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : currentCharStatus === WRITING_STATUS.NEEDS_REVIEW
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : currentCharStatus === WRITING_STATUS.LEARNING
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                {currentCharStatus === WRITING_STATUS.LEARNED && '✓ Đã học'}
                {currentCharStatus === WRITING_STATUS.NEEDS_REVIEW && '⚠️ Cần ôn tập'}
                {currentCharStatus === WRITING_STATUS.LEARNING && '📖 Đang học'}
                {currentCharStatus === WRITING_STATUS.NOT_STARTED && 'Chưa bắt đầu'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleSetStatus(WRITING_STATUS.LEARNED)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 active:scale-95 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Đánh dấu Đã học</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus(WRITING_STATUS.NEEDS_REVIEW)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 active:scale-95 transition-all"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Cần ôn</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setWorksheetModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                title="Tạo & in bảng tập viết ô Điền tự / Mễ tự chuẩn A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In tập viết (A4)</span>
              </button>

              <button
                type="button"
                onClick={handleShareLink}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                title="Sao chép liên kết chia sẻ chữ này"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Character Detail Card */}
          <CharacterDetailCard
            detail={characterDetail}
            onSelectRelatedWord={(vocab) => {
              playClickSound();
              const hanzi = Array.from(vocab.hanzi)[0];
              if (hanzi) setSelectedChar(hanzi);
            }}
            onSelectRadical={(rad) => {
              playClickSound();
              setRadicalFilter(rad);
            }}
            onOpenAiTutor={() => {
              playClickSound();
              setAiTutorModalOpen(true);
            }}
            onOpenWorksheet={() => {
              playClickSound();
              setWorksheetModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* 4. Bottom Characters Grid / Carousel */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#334155] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E85D3F]" />
            <h3 className="font-bold text-base text-[#243447] dark:text-[#F3F4F6]">
              Kho chữ Hán tra cứu ({searchResults.total} chữ)
            </h3>
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Bấm vào chữ để xem chi tiết & hoạt ảnh bút thuận
          </span>
        </div>

        {searchResults.items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Không tìm thấy chữ Hán nào phù hợp với bộ lọc hiện tại. Hãy thử tìm từ khóa khác.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
            {searchResults.items.map((item) => {
              const isSelected = selectedChar === item.char;
              const status = progressMap[item.char]?.status;

              return (
                <div
                  key={item.char}
                  onClick={() => {
                    playClickSound();
                    setSelectedChar(item.char);
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className={`p-3 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-between relative group ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white border-[#E85D3F] shadow-md shadow-[#E85D3F]/25 scale-105'
                      : 'bg-[#FFF9F2] dark:bg-[#0F172A] border-[#F1E5D8] dark:border-[#334155] hover:border-[#E85D3F] hover:shadow-xs'
                  }`}
                >
                  {/* Status Indicator Dot */}
                  {status === WRITING_STATUS.LEARNED && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-white dark:ring-black" />
                  )}
                  {status === WRITING_STATUS.NEEDS_REVIEW && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 ring-2 ring-white dark:ring-black" />
                  )}

                  <span className={`font-['Noto_Serif_SC'] text-3xl font-black ${
                    isSelected ? 'text-white' : 'text-[#243447] dark:text-[#F3F4F6] group-hover:text-[#E85D3F]'
                  }`}>
                    {item.char}
                  </span>

                  <span className={`text-[11px] font-bold mt-1 ${
                    isSelected ? 'text-white/90' : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`}>
                    {item.pinyin}
                  </span>

                  <span className={`text-[10px] truncate max-w-full ${
                    isSelected ? 'text-white/80' : 'text-gray-400'
                  }`}>
                    {item.hanviet || item.strokesCount + ' nét'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Modals */}
      <RadicalBrowserModal
        isOpen={radicalModalOpen}
        onClose={() => setRadicalModalOpen(false)}
        onSelectRadical={(rad) => setRadicalFilter(rad)}
      />

      <AiCharacterTutorModal
        isOpen={aiTutorModalOpen}
        onClose={() => setAiTutorModalOpen(false)}
        character={selectedChar}
        characterDetail={characterDetail}
        user={user}
      />

      <WorksheetGeneratorModal
        isOpen={worksheetModalOpen}
        onClose={() => setWorksheetModalOpen(false)}
        initialChar={selectedChar}
        relatedWords={characterDetail?.relatedWords || []}
      />

      {/* 6. Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#243447] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
