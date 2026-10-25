import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  X, 
  Volume2, 
  BookOpen, 
  PenTool, 
  BookmarkPlus, 
  BookmarkCheck, 
  Sparkles, 
  Layers, 
  ExternalLink,
  Command,
  ArrowRight
} from 'lucide-react';
import AudioButton from '../AudioButton.jsx';
import { searchDictionaryHybrid } from '../../services/dictionaryService.js';
import { saveCustomVocab } from '../../utils/materialsStorage.js';
import { captureWeakVocabulary } from '../../utils/srsEngine.js';
import { playClickSound, playSuccessSound, speakChinese } from '../../utils/audio.js';
import { awardXp } from '../../utils/gamification.js';

export default function CommandPaletteModal({ 
  isOpen, 
  onClose, 
  user = null,
  onNavigate = null 
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [savedHanziSet, setSavedHanziSet] = useState(new Set());
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Focus input khi mở modal
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Debounced search (0ms for local, debounced for cloud)
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let isCancelled = false;

    const timer = setTimeout(async () => {
      try {
        const res = await searchDictionaryHybrid(trimmed, { limit: 20 });
        if (!isCancelled) {
          setResults(res);
          setSelectedIndex(0);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Search error:', err);
        if (!isCancelled) setIsLoading(false);
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // Bắt phím điều hướng (ArrowUp, ArrowDown, Escape, Enter)
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        e.preventDefault();
        const item = results[selectedIndex];
        speakChinese(item.hanzi);
      }
    }
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Tự động cuộn phần tử được chọn vào vùng nhìn thấy
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Lưu từ vào Flashcard SRS
  const handleSaveToSrs = (e, item) => {
    e.stopPropagation();
    playClickSound();

    try {
      saveCustomVocab({
        hanzi: item.hanzi,
        pinyin: item.pinyin,
        hanviet: item.hanviet,
        meaning: item.meaningVi,
        level: item.level,
        topic: item.topic || 'Tra từ điển'
      });

      captureWeakVocabulary(item, 'dictionary', user);
      awardXp(10, user, `dict_save_${item.hanzi}`);
      playSuccessSound();

      setSavedHanziSet(prev => new Set([...prev, item.hanzi]));
    } catch (err) {
      console.warn('Error saving to SRS:', err);
    }
  };

  // Điều hướng sang luyện viết nét
  const handleGoToWriting = (e, item) => {
    e.stopPropagation();
    playClickSound();
    onClose();
    if (onNavigate) {
      onNavigate('writing');
      window.location.hash = `#writing?char=${encodeURIComponent(item.hanzi)}`;
    } else {
      window.location.hash = `#writing?char=${encodeURIComponent(item.hanzi)}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E85D3F]/10 text-[#E85D3F] flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tra chữ Hán, Pinyin (xuexi / xué xí), Hán-Việt, Nghĩa Việt/Anh..."
              className="w-full bg-transparent text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden"
            />
          </div>

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs font-mono">
            <span>ESC</span>
          </div>
        </div>

        {/* Results Container */}
        <div 
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-gray-50 dark:divide-gray-800/50"
        >
          {isLoading && results.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              <div className="w-6 h-6 border-2 border-[#E85D3F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Đang tra cứu kho từ điển...</span>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-600 dark:text-gray-300">Không tìm thấy từ "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Hãy thử gõ chữ Hán, Pinyin không dấu hoặc âm Hán-Việt</p>
            </div>
          )}

          {!query && (
            <div className="py-10 px-6 text-center text-xs text-gray-400 space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                <Command className="w-4 h-4 text-[#E85D3F]" />
                <span>HanziGo Global Command Palette</span>
              </div>
              <p>Tra cứu siêu tốc hơn 120.000 từ vựng CC-CEDICT, 500 từ cốt lõi và nét viết chữ Hán.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">学习 (học tập)</span>
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">nihao (Pinyin)</span>
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">cảm ơn (Nghĩa)</span>
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">HSK 1 - 6</span>
              </div>
            </div>
          )}

          {results.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const isSaved = savedHanziSet.has(item.hanzi);

            return (
              <div
                key={item.id || idx}
                onClick={() => {
                  setSelectedIndex(idx);
                  speakChinese(item.hanzi);
                }}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected 
                    ? 'bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#E85D3F]/40 shadow-xs' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                {/* Left: Hanzi + Pinyin + Meaning */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="font-['Noto_Serif_SC'] text-2xl font-black text-[#E85D3F]">
                      {item.hanzi}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {item.pinyin}
                      </span>
                      {item.hanviet && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          ({item.hanviet})
                        </span>
                      )}
                      {item.level && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E85D3F]/10 text-[#E85D3F]">
                          {item.level}
                        </span>
                      )}
                      {item.decomposition?.ids && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400">
                          {item.decomposition.ids}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5 max-w-md">
                      {item.meaningVi || item.meaningEn}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <AudioButton text={item.hanzi} size="sm" />

                  <button
                    type="button"
                    onClick={(e) => handleGoToWriting(e, item)}
                    className="p-2 rounded-xl text-gray-500 hover:text-[#E85D3F] hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                    title="Luyện viết nét chữ này"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSaveToSrs(e, item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSaved
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-[#E85D3F]/10 text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white'
                    }`}
                    title="Lưu vào Sổ tay Flashcard SRS"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Đã lưu SRS</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Lưu SRS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-gray-50 dark:bg-[#131B24] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono">↓</kbd>
              <span>Di chuyển</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono">Enter</kbd>
              <span>Nghe phát âm</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#E85D3F] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Hybrid 120.000 từ CC-CEDICT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
