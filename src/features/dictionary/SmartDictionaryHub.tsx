import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import {
  fetchOrGenerateDictionaryEntry,
  getRecentSearchHistory,
  getSavedDeckWords,
  saveSearchHistory,
  searchDictionaryMultimodal,
} from '../../services/dictionaryService.ts';
import type {
  DictionaryEntry,
  DictionaryHistoryItem,
  SentenceTokenResult,
} from '../../types/dictionary.types.ts';
import DictionaryEntryDetail from './DictionaryEntryDetail.tsx';
import SmartSearchBar from './SmartSearchBar.tsx';

export interface SmartDictionaryHubProps {
  user?: { id?: string | null } | null;
  setActiveTab?: (tab: string) => void;
  initialQuery?: string;
}

export default function SmartDictionaryHub({
  user = null,
  setActiveTab,
  initialQuery = '学习',
}: SmartDictionaryHubProps) {
  const [query, setQuery] = useState(initialQuery);
  const [hskFilter, setHskFilter] = useState<number | null>(null);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [sentenceTokens, setSentenceTokens] = useState<SentenceTokenResult[]>([]);
  const [history, setHistory] = useState<DictionaryHistoryItem[]>([]);
  const [savedWords, setSavedWords] = useState<string[]>(() => getSavedDeckWords(user));
  const [latencyMs, setLatencyMs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    let active = true;
    void getRecentSearchHistory(user).then((items) => {
      if (active) setHistory(items);
    });
    return () => {
      active = false;
    };
  }, [user]);

  const handleSearch = useCallback(
    async (nextQuery: string, nextHsk: number | null) => {
      setQuery(nextQuery);
      const trimmed = nextQuery.trim();
      if (!trimmed) {
        setEntries([]);
        setSentenceTokens([]);
        setLatencyMs(0);
        return;
      }

      setIsLoading(true);
      try {
        const res = await searchDictionaryMultimodal(trimmed, {
          hskFilter: nextHsk,
          limit: 25,
        });
        setEntries(res.entries);
        setSentenceTokens(res.sentenceTokens);
        setLatencyMs(res.latencyMs);

        if (res.entries.length > 0) {
          const top = res.entries[0];
          setSelectedEntry(top);
          const nextHistory = await saveSearchHistory(trimmed, top, user);
          setHistory(nextHistory);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const handleAiFallback = async () => {
    const trimmed = query.trim();
    if (!trimmed || isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      const aiEntry = await fetchOrGenerateDictionaryEntry(trimmed, user);
      if (aiEntry) {
        setEntries((prev) => [aiEntry, ...prev]);
        setSelectedEntry(aiEntry);
        const nextHistory = await saveSearchHistory(trimmed, aiEntry, user);
        setHistory(nextHistory);
      }
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <section aria-label="Smart Chinese Dictionary" className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#243447] via-[#2B3E54] to-[#1E293B] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <BookOpen size={12} />
            <span>Smart Chinese Dictionary</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Từ điển Hán – Việt Thông minh (HSK 1–9 & AI Cache)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Tra cứu đa phương thức: Chữ Hán, Pinyin số/không dấu, Âm Hán Việt, Vẽ tay & Bộ thủ.
          </p>
        </div>
      </div>

      {/* Multimodal Search Bar */}
      <SmartSearchBar
        query={query}
        onSearch={handleSearch}
        hskFilter={hskFilter}
        onHskFilterChange={setHskFilter}
        history={history}
        latencyMs={latencyMs}
        isLoading={isLoading}
      />

      {/* Sentence Segmentation Bar */}
      {sentenceTokens.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2">
          <div className="text-xs font-bold text-[#748092] uppercase tracking-wider">
            Tách từ tự động từ câu đã dán (nhấn vào từng từ để xem chi tiết)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sentenceTokens.map((tok, idx) => (
              <button
                key={`${tok.token}-${idx}`}
                type="button"
                onClick={() => {
                  if (tok.entry) setSelectedEntry(tok.entry);
                  else void handleSearch(tok.token, hskFilter);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
                  selectedEntry?.simplified === tok.token
                    ? 'bg-[#E85D3F] text-white'
                    : tok.isKnown
                    ? 'bg-[#FAF6F0] dark:bg-[#0F172A] text-[#243447] dark:text-white border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F]'
                    : 'bg-slate-100 dark:bg-slate-800 text-[#748092]'
                }`}
              >
                {tok.token}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-2.5">
          {entries.length === 0 && query.trim() && !isLoading ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-3 text-center">
              <p className="text-xs text-[#748092]">
                Không tìm thấy "{query.trim()}" trong từ điển cơ bản.
              </p>
              <button
                type="button"
                onClick={handleAiFallback}
                disabled={isGeneratingAi}
                className="w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <Sparkles size={14} />
                <span>
                  {isGeneratingAi
                    ? 'Đang tra cứu AI Lexicographer...'
                    : 'Giải nghĩa bằng AI & Lưu Cache'}
                </span>
              </button>
            </div>
          ) : (
            entries.map((item) => {
              const isSelected = selectedEntry?.id === item.id;
              const previewMeaning = item.pos_meanings?.[0]?.definitions_vi?.[0] || '';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedEntry(item)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#FFF5F2] dark:bg-[#2B2022] border-[#E85D3F] shadow-xs'
                      : 'bg-white dark:bg-[#1E293B] border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F]/60'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xl font-extrabold text-[#243447] dark:text-white">
                      {item.simplified}
                    </span>
                    <span className="text-xs font-bold text-[#E85D3F]">
                      {item.pinyin_display}
                    </span>
                  </div>
                  {item.han_viet && (
                    <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase mt-0.5">
                      {item.han_viet}
                    </div>
                  )}
                  {previewMeaning && (
                    <p className="text-xs text-[#5B6B7F] dark:text-slate-300 truncate mt-1">
                      {previewMeaning}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-8">
          {selectedEntry ? (
            <DictionaryEntryDetail
              entry={selectedEntry}
              user={user}
              isSaved={savedWords.includes(selectedEntry.simplified)}
              onWordSaved={(word) =>
                setSavedWords((prev) => (prev.includes(word) ? prev : [...prev, word]))
              }
              onSelectWord={(w) => void handleSearch(w, hskFilter)}
              setActiveTab={setActiveTab}
            />
          ) : (
            <div className="p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-center text-sm text-[#748092]">
              Nhập từ khóa để xem chi tiết từ loại, chiết tự, lượng từ và ví dụ.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

