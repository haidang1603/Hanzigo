import React, { createContext, useCallback, useContext, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabase/config.js';
import { playChineseTts } from '../../services/ttsAudioService.js';
import {
  searchDictionaryMultimodal,
  segmentSentenceIntoTokens,
  type DictionaryEntry,
} from '../../services/dictionaryService.ts';
import {
  useUnifiedEcosystemStore,
  type UnifiedSourceContext,
} from './useUnifiedEcosystemStore.ts';
import type {
  DictionaryEntryRow,
  GrammarPointRow,
  SourceContextPayload,
  UnifiedToolTab,
  UserVocabItemRow,
} from '../../types/unifiedEcosystem.types.ts';

interface ToastBanner {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

type LegacyWordPayload = {
  simplified: string;
  pinyin?: string;
  han_viet?: string;
  meaning_vi?: string;
  hsk_level?: number;
};

type BaseStoreValue = ReturnType<typeof useUnifiedEcosystemStore>;

export interface UnifiedToolsContextValue
  extends Omit<
    BaseStoreValue,
    'quickSaveToVocabulary' | 'closeDrawer' | 'dismissToast' | 'sourceContext'
  > {
  isOpen: boolean;
  selectedText: string;
  sourceContext: (UnifiedSourceContext & Partial<SourceContextPayload>) | null;
  isLoading: boolean;
  dictionaryResults: DictionaryEntryRow[];
  activeDictionaryEntry: DictionaryEntryRow | null;
  grammarResults: GrammarPointRow[];
  savedVocabItem: UserVocabItemRow | null;
  toasts: ToastBanner[];
  openToolDrawer: (
    tab: UnifiedToolTab,
    hanziText: string,
    context?: SourceContextPayload
  ) => Promise<void>;
  closeDrawer: () => void;
  selectDictionaryEntry: (entry: DictionaryEntryRow) => void;
  quickSaveToVocabulary: (
    wordOrText: string | LegacyWordPayload,
    context?: SourceContextPayload | UnifiedSourceContext,
    explicitEntry?: DictionaryEntryRow
  ) => Promise<void>;
  recordDimensionScore: (
    simplified: string,
    dimension: 'meaning' | 'writing' | 'pronunciation',
    score: number
  ) => Promise<void>;
  speakChineseText: (text: string, rate?: number, voice?: string) => void;
  dismissToast: (id?: string) => void;
}

const GLOBAL_CTX_KEY = '__HANZIGO_UNIFIED_TOOLS_CONTEXT__';
const UnifiedToolsContext: React.Context<UnifiedToolsContextValue | null> =
  ((globalThis as Record<string, unknown>)[GLOBAL_CTX_KEY] as
    | React.Context<UnifiedToolsContextValue | null>
    | undefined) ||
  (((globalThis as Record<string, unknown>)[GLOBAL_CTX_KEY] =
    createContext<UnifiedToolsContextValue | null>(null)) as React.Context<UnifiedToolsContextValue | null>);

interface UnifiedToolsProviderProps {
  user?: { id?: string | null } | null;
  children: React.ReactNode;
}

export const UnifiedToolsProvider: React.FC<UnifiedToolsProviderProps> = ({
  user,
  children,
}) => {
  const store = useUnifiedEcosystemStore(user);

  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [localSelectedText, setLocalSelectedText] = useState('');
  const [localSourceContext, setLocalSourceContext] = useState<SourceContextPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [dictionaryResults, setDictionaryResults] = useState<DictionaryEntryRow[]>([]);
  const [activeDictionaryEntry, setActiveDictionaryEntry] = useState<DictionaryEntryRow | null>(null);
  const [grammarResults, setGrammarResults] = useState<GrammarPointRow[]>([]);
  const [savedVocabItem, setSavedVocabItem] = useState<UserVocabItemRow | null>(null);
  const [toasts, setToasts] = useState<ToastBanner[]>([]);

  const pushToast = useCallback((message: string, type: ToastBanner['type'] = 'success') => {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback(
    (id?: string) => {
      if (id) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      } else {
        setToasts([]);
      }
      store.dismissToast();
    },
    [store]
  );

  const speakChineseText = useCallback((text: string, rate?: number, voice?: string) => {
    void playChineseTts(text, {
      ...(rate !== undefined ? { rate } : {}),
      ...(voice ? { voice } : {}),
    });
  }, []);

  const mapDictEntryToRow = (entry: DictionaryEntry): DictionaryEntryRow => ({
    id: entry.id,
    simplified: entry.simplified,
    traditional: entry.traditional || entry.simplified,
    pinyin_numeric: entry.pinyin_numeric || entry.pinyin_display,
    pinyin_display: entry.pinyin_display,
    pinyin_clean: entry.pinyin_clean,
    han_viet: entry.han_viet || '',
    hsk_2_level: entry.hsk_2_level ?? null,
    hsk_3_level: entry.hsk_3_level ?? null,
    frequency_rank: entry.frequency_rank ?? 5000,
    pos_meanings: entry.pos_meanings || [],
    examples: entry.examples || [],
    radical_breakdown: entry.radical_breakdown || null,
    etymology_note: entry.etymology_note || '',
  });

  const fetchUnifiedDataForText = useCallback(async (rawText: string, contextSentence?: string) => {
    const cleanText = rawText.trim();
    if (!cleanText) return;

    const hasSupabase = Boolean(supabase && isSupabaseConfigured);
    setIsLoading(true);
    try {
      let finalDictEntries: DictionaryEntryRow[] = [];

      if (hasSupabase && supabase) {
        const { data: exactDict } = await supabase
          .from('dictionary_entries')
          .select('*')
          .or(`simplified.eq.${cleanText},traditional.eq.${cleanText},pinyin_clean.ilike.${cleanText}`)
          .limit(5);

        finalDictEntries = (exactDict as DictionaryEntryRow[]) || [];

        if (finalDictEntries.length === 0) {
          const firstTwoChars = cleanText.slice(0, 2);
          const { data: fuzzyDict } = await supabase
            .from('dictionary_entries')
            .select('*')
            .ilike('simplified', `%${firstTwoChars}%`)
            .order('frequency_rank', { ascending: true })
            .limit(8);
          finalDictEntries = (fuzzyDict as DictionaryEntryRow[]) || [];
        }
      }

      // Fallback & sentence segmentation: tách từ trong câu dài + tra từ điển cục bộ + AI
      const hasExactMatch = finalDictEntries.some((e) => e.simplified === cleanText);
      if (!hasExactMatch) {
        const segmentedTokens = segmentSentenceIntoTokens(cleanText);
        const tokenEntries = segmentedTokens
          .map((t) => t.entry)
          .filter((e): e is DictionaryEntry => Boolean(e))
          .map(mapDictEntryToRow);

        const multimodal = await searchDictionaryMultimodal(cleanText, { limit: 8 });
        const multiRows = (multimodal.entries || []).map(mapDictEntryToRow);

        // Gọi AI giải thích toàn bộ từ/cụm/câu nếu chưa có mục từ chính xác (kèm cache localStorage)
        let aiEntry: DictionaryEntryRow | null = null;
        try {
          const cacheKey = 'hanzigo_ai_unified_dict_v1';
          const rawCache =
            typeof localStorage !== 'undefined' ? localStorage.getItem(cacheKey) : null;
          const cacheObj: Record<string, DictionaryEntryRow> = rawCache ? JSON.parse(rawCache) : {};

          if (cacheObj[cleanText]) {
            aiEntry = cacheObj[cleanText];
          } else if (typeof fetch !== 'undefined') {
            const aiRes = await fetch('/api/ai/grade', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'dictionary',
                query: cleanText,
                contextSentence: contextSentence || cleanText,
              }),
            });
            if (aiRes.ok) {
              const payload = await aiRes.json();
              const r = payload?.result;
              if (r && r.simplified) {
                aiEntry = {
                  id: `ai-dict-${cleanText}-${Date.now()}`,
                  simplified: String(r.simplified || cleanText),
                  traditional: String(r.traditional || cleanText),
                  pinyin_display: String(r.pinyin_display || ''),
                  pinyin_numeric: String(r.pinyin_numeric || r.pinyin_display || ''),
                  pinyin_clean: String(r.pinyin_clean || ''),
                  han_viet: String(r.han_viet || ''),
                  hsk_2_level: typeof r.hsk_2_level === 'number' ? r.hsk_2_level : null,
                  hsk_3_level: typeof r.hsk_3_level === 'number' ? r.hsk_3_level : null,
                  frequency_rank: 9999,
                  pos_meanings: Array.isArray(r.pos_meanings) ? r.pos_meanings : [],
                  examples: Array.isArray(r.examples) ? r.examples : [],
                  radical_breakdown: null,
                  etymology_note: String(r.etymology_note || ''),
                };
                if (typeof localStorage !== 'undefined') {
                  cacheObj[cleanText] = aiEntry;
                  localStorage.setItem(cacheKey, JSON.stringify(cacheObj));
                }
              }
            }
          }
        } catch {
          // ignore AI fallback errors
        }

        const seen = new Set<string>();
        const combined: DictionaryEntryRow[] = [];
        for (const row of [
          ...(aiEntry ? [aiEntry] : []),
          ...finalDictEntries,
          ...multiRows,
          ...tokenEntries,
        ]) {
          if (!seen.has(row.simplified)) {
            seen.add(row.simplified);
            combined.push(row);
          }
        }
        finalDictEntries = combined.slice(0, 12);
      }

      setDictionaryResults(finalDictEntries);
      const primaryEntry = finalDictEntries[0] || null;
      setActiveDictionaryEntry(primaryEntry);

      if (hasSupabase && supabase) {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        const sentenceToAnalyze = contextSentence || cleanText;
        const { data: allGrammarPoints } = await supabase
          .from('grammar_points')
          .select('*')
          .order('hsk_level', { ascending: true })
          .limit(30);

        if (allGrammarPoints) {
          const matchedGrammar = (allGrammarPoints as GrammarPointRow[]).filter((gp) => {
            const coreTokens = gp.pattern_display
              .replace(/[SOV+……/\s()]/g, ' ')
              .split(' ')
              .filter((t) => t.length >= 1 && /[\u4e00-\u9fa5]/.test(t));

            return (
              coreTokens.some((kw) => sentenceToAnalyze.includes(kw)) ||
              gp.pattern_display.includes(cleanText)
            );
          });

          setGrammarResults(
            matchedGrammar.length > 0
              ? matchedGrammar
              : (allGrammarPoints as GrammarPointRow[]).slice(0, 3)
          );
        }

        if (authUser) {
          const targetWord = primaryEntry ? primaryEntry.simplified : cleanText;
          const { data: existingVocab } = await supabase
            .from('user_vocab_items')
            .select('*')
            .eq('user_id', authUser.id)
            .eq('simplified', targetWord)
            .maybeSingle();

          setSavedVocabItem((existingVocab as UserVocabItemRow) || null);
        } else {
          setSavedVocabItem(null);
        }
      } else {
        setGrammarResults([]);
        setSavedVocabItem(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openToolDrawer = useCallback(
    async (tab: UnifiedToolTab, hanziText: string, context?: SourceContextPayload) => {
      const clean = hanziText.trim();
      if (!clean) return;
      setLocalSelectedText(clean);
      setLocalSourceContext(context || { source_type: 'selection', sentence_zh: clean });
      store.setActiveTab(tab);
      setLocalIsOpen(true);

      const mappedCtx: UnifiedSourceContext | undefined = context
        ? {
            sourceType:
              context.source_type === 'reading' ||
              context.source_type === 'listening' ||
              context.source_type === 'dictionary' ||
              context.source_type === 'grammar'
                ? context.source_type
                : 'dictionary',
            sourceId: context.source_id,
            sentenceZh: context.sentence_zh,
            sentencePinyin: context.sentence_pinyin,
            sentenceVi: context.sentence_vi,
          }
        : undefined;

      if (tab === 'dictionary') {
        store.openQuickDictionary(clean, mappedCtx);
      } else if (tab === 'grammar') {
        store.openQuickGrammarParser(clean, mappedCtx);
      } else if (tab === 'writing') {
        store.openQuickWritingModal(clean, mappedCtx);
      } else if (tab === 'pronunciation') {
        store.openQuickPronunciationModal(clean, mappedCtx);
      }

      await fetchUnifiedDataForText(clean, context?.sentence_zh);
    },
    [fetchUnifiedDataForText, store]
  );

  const closeDrawer = useCallback(() => {
    setLocalIsOpen(false);
    store.closeDrawer();
  }, [store]);

  const selectDictionaryEntry = useCallback((entry: DictionaryEntryRow) => {
    setActiveDictionaryEntry(entry);
    setLocalSelectedText(entry.simplified);
  }, []);

  const quickSaveToVocabulary = useCallback(
    async (
      wordOrText: string | LegacyWordPayload,
      context?: SourceContextPayload | UnifiedSourceContext,
      explicitEntry?: DictionaryEntryRow
    ) => {
      if (typeof wordOrText !== 'string') {
        await store.quickSaveToVocabulary(wordOrText, context as UnifiedSourceContext | undefined);
        return;
      }

      if (!supabase || !isSupabaseConfigured) {
        await store.quickSaveToVocabulary(
          { simplified: wordOrText.trim() },
          context as UnifiedSourceContext | undefined
        );
        return;
      }

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        pushToast('Vui lòng đăng nhập để lưu từ vựng vào sổ tay cá nhân.', 'error');
        return;
      }

      const cleanWord = wordOrText.trim();
      let entry = explicitEntry || activeDictionaryEntry;
      if (!entry || entry.simplified !== cleanWord) {
        const { data } = await supabase
          .from('dictionary_entries')
          .select('*')
          .eq('simplified', cleanWord)
          .maybeSingle();
        if (data) entry = data as DictionaryEntryRow;
      }

      const simplified = entry ? entry.simplified : cleanWord;
      const pinyin = entry ? entry.pinyin_display : 'Đang cập nhật';
      const hanViet = entry ? entry.han_viet : '';
      const primaryMeaning =
        entry?.pos_meanings?.[0]?.definitions_vi?.[0] || 'Từ vựng lưu từ ngữ cảnh đọc/nghe';
      const hskLevel = entry?.hsk_2_level || entry?.hsk_3_level || 3;

      const normalizedContext: SourceContextPayload =
        context && 'sentence_zh' in context
          ? context
          : localSourceContext || {
              source_type: 'selection',
              sentence_zh:
                (context as UnifiedSourceContext | undefined)?.sentenceZh || simplified,
              sentence_pinyin: (context as UnifiedSourceContext | undefined)?.sentencePinyin,
              sentence_vi: (context as UnifiedSourceContext | undefined)?.sentenceVi,
            };

      const { data: existing } = await supabase
        .from('user_vocab_items')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('simplified', simplified)
        .maybeSingle();

      const existingContexts: SourceContextPayload[] = Array.isArray(existing?.source_context)
        ? existing.source_context
        : [];

      const mergedContexts = [
        normalizedContext,
        ...existingContexts.filter((c) => c.sentence_zh !== normalizedContext.sentence_zh),
      ].slice(0, 5);

      const { data: upserted, error } = await supabase
        .from('user_vocab_items')
        .upsert(
          {
            user_id: authUser.id,
            simplified,
            pinyin,
            han_viet: hanViet,
            meaning_vi: primaryMeaning,
            hsk_level: hskLevel,
            source_context: mergedContexts,
            meaning_mastery: existing ? existing.meaning_mastery : 25,
          },
          { onConflict: 'user_id,simplified' }
        )
        .select()
        .single();

      if (error) {
        pushToast(`Lỗi lưu từ vựng: ${error.message}`, 'error');
        return;
      }

      setSavedVocabItem(upserted as UserVocabItemRow);
      pushToast(`Đã lưu “${simplified}” (${pinyin}) kèm câu ngữ cảnh vào Vocabulary Workspace!`);
    },
    [activeDictionaryEntry, localSourceContext, pushToast, store]
  );

  const recordDimensionScore = useCallback(
    async (
      simplified: string,
      dimension: 'meaning' | 'writing' | 'pronunciation',
      score: number
    ) => {
      if (!supabase || !isSupabaseConfigured) return;

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
      const { error } = await supabase.rpc('update_vocab_dimension_score', {
        p_user_id: authUser.id,
        p_simplified: simplified,
        p_dimension: dimension,
        p_score: boundedScore,
      });

      if (!error) {
        const { data: refreshed } = await supabase
          .from('user_vocab_items')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('simplified', simplified)
          .maybeSingle();

        if (refreshed) {
          setSavedVocabItem(refreshed as UserVocabItemRow);
        }
        const labelMap = {
          meaning: 'Ghi nhớ nghĩa',
          writing: 'Viết chữ Hán',
          pronunciation: 'Phát âm',
        };
        pushToast(
          `Đã đồng bộ điểm ${labelMap[dimension]} (${boundedScore}%) cho “${simplified}”`,
          'info'
        );
      }
    },
    [pushToast]
  );

  return (
    <UnifiedToolsContext.Provider
      value={{
        ...store,
        isOpen: store.drawerOpen || localIsOpen,
        selectedText: localSelectedText || store.targetText,
        sourceContext: localSourceContext || store.sourceContext,
        isLoading,
        dictionaryResults,
        activeDictionaryEntry,
        grammarResults,
        savedVocabItem,
        toasts,
        openToolDrawer,
        closeDrawer,
        selectDictionaryEntry,
        quickSaveToVocabulary,
        recordDimensionScore,
        speakChineseText,
        dismissToast,
      }}
    >
      {children}

      {/* Hệ thống thông báo Toast nổi góc dưới phải */}
      <div className="fixed bottom-5 right-5 z-[110] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismissToast(t.id)}
            className={`pointer-events-auto cursor-pointer px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2.5 ${
              t.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-200'
                : t.type === 'info'
                ? 'bg-[#0a0a1f]/95 border-[#00D4FF]/50 text-[#00D4FF]'
                : 'bg-[#0a0a1f]/95 border-emerald-400/50 text-emerald-300'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current shrink-0 animate-pulse" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </UnifiedToolsContext.Provider>
  );
};

export function useUnifiedTools(): UnifiedToolsContextValue {
  const ctx = useContext(UnifiedToolsContext);
  if (!ctx) {
    throw new Error('useUnifiedTools phải được đặt bên trong <UnifiedToolsProvider>');
  }
  return ctx;
}
