import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabase/config.js';
import { saveWordToDeck, type DictionaryEntry } from '../../services/dictionaryService.ts';
import {
  isVocabItemMastered,
  type UserVocabItem,
} from '../../services/vocabWorkspaceService.ts';
import type { ReadingArticle } from '../../services/readingStudioService.ts';
import type { ListeningTrack } from '../../services/listeningStudioService.ts';

export type UnifiedToolTab = 'dictionary' | 'grammar' | 'writing' | 'pronunciation';

export type UnifiedToolSource =
  | 'dictionary'
  | 'grammar'
  | 'writing'
  | 'reading'
  | 'listening'
  | 'vocab'
  | 'pronunciation';

export type UnifiedEventType =
  | 'lookup'
  | 'save_vocab'
  | 'write_char'
  | 'pronounce_drill'
  | 'complete_article'
  | 'complete_listening'
  | 'grammar_quiz';

export interface UnifiedSourceContext {
  sourceType?: 'reading' | 'listening' | 'dictionary' | 'grammar';
  sourceId?: string;
  sentenceZh?: string;
  sentencePinyin?: string;
  sentenceVi?: string;
  sourceVocabId?: string;
}

export interface UnifiedLearningEvent {
  id: string;
  tool_source: UnifiedToolSource;
  event_type: UnifiedEventType;
  target_entity: string;
  score?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface SmartDailyLoopPlan {
  dueVocabItems: UserVocabItem[];
  hardCharacters: string[];
  pronunciationTargets: Array<{ hanzi: string; pinyin: string; meaningVi: string }>;
  recommendedArticle: ReadingArticle | null;
  recommendedTrack: ListeningTrack | null;
}

const EVENTS_KEY = 'hanzigo_unified_learning_events_v1';

/**
 * Overall Mastery = 0.4 * Meaning SRS + 0.3 * Writing Mastery + 0.3 * Pronunciation Mastery
 */
export function computeOverallMastery(
  meaningMastery: number,
  writingMastery: number,
  pronunciationMastery: number
): number {
  const m = Math.max(0, Math.min(100, meaningMastery));
  const w = Math.max(0, Math.min(100, writingMastery));
  const p = Math.max(0, Math.min(100, pronunciationMastery));
  return Math.round(0.4 * m + 0.3 * w + 0.3 * p);
}

/**
 * A word is "True Mastered" only when meaning, writing, and pronunciation all reach >= 80%.
 */
export function isTrueMastered(
  meaningMastery: number,
  writingMastery: number,
  pronunciationMastery: number
): boolean {
  return meaningMastery >= 80 && writingMastery >= 80 && pronunciationMastery >= 80;
}

export function createSmartDailyLoopPlan(
  vocabItems: UserVocabItem[],
  articles: ReadingArticle[],
  tracks: ListeningTrack[]
): SmartDailyLoopPlan {
  const dueVocabItems = vocabItems
    .filter((item) => !isVocabItemMastered(item))
    .slice(0, 10);
  const charSet = new Set<string>();
  dueVocabItems.forEach((item) => {
    for (const ch of Array.from(item.simplified)) {
      if (/[\u4e00-\u9fa5]/.test(ch)) charSet.add(ch);
    }
  });

  const hardCharacters = Array.from(charSet).slice(0, 8);
  const pronunciationTargets = dueVocabItems.slice(0, 5).map((it) => ({
    hanzi: it.simplified,
    pinyin: it.pinyin,
    meaningVi: it.meaning_vi,
  }));

  const targetWords = dueVocabItems.map((v) => v.simplified);
  const recommendedArticle =
    articles.find((art) =>
      art.paragraphs.some((p) =>
        p.sentences.some((s) => targetWords.some((w) => s.zh_raw.includes(w)))
      )
    ) ||
    articles[0] ||
    null;

  const recommendedTrack =
    tracks.find((trk) =>
      trk.transcript_segments.some((seg) => targetWords.some((w) => seg.hanzi.includes(w)))
    ) ||
    tracks[0] ||
    null;

  return {
    dueVocabItems,
    hardCharacters,
    pronunciationTargets,
    recommendedArticle,
    recommendedTrack,
  };
}

export function useUnifiedEcosystemStore(user?: { id?: string | null } | null) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<UnifiedToolTab>('dictionary');
  const [targetText, setTargetText] = useState('');
  const [targetPinyin, setTargetPinyin] = useState('');
  const [sourceContext, setSourceContext] = useState<UnifiedSourceContext | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentEvents, setRecentEvents] = useState<UnifiedLearningEvent[]>([]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const userId = user?.id ?? null;

  const emitUnifiedEvent = useCallback(
    async (
      toolSource: UnifiedToolSource,
      eventType: UnifiedEventType,
      targetEntity: string,
      score?: number,
      metadata: Record<string, unknown> = {}
    ) => {
      const ev: UnifiedLearningEvent = {
        id: `uev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tool_source: toolSource,
        event_type: eventType,
        target_entity: targetEntity,
        score,
        metadata,
        created_at: new Date().toISOString(),
      };

      setRecentEvents((prev) => [ev, ...prev].slice(0, 30));

      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(EVENTS_KEY);
          const list = raw ? (JSON.parse(raw) as UnifiedLearningEvent[]) : [];
          localStorage.setItem(EVENTS_KEY, JSON.stringify([ev, ...list].slice(0, 50)));
        }
      } catch {
        // ignore storage errors
      }

      if (isSupabaseConfigured && supabase && userId) {
        try {
          await supabase.from('unified_learning_events').insert({
            user_id: userId,
            tool_source: toolSource,
            event_type: eventType,
            target_entity: targetEntity,
            score: score ?? null,
            metadata,
          });
        } catch {
          // non-fatal
        }
      }
    },
    [userId]
  );

  const openQuickDictionary = useCallback(
    (hanziText: string, ctx: UnifiedSourceContext | null = null) => {
      setTargetText(hanziText.trim());
      setSourceContext(ctx);
      setActiveTab('dictionary');
      setDrawerOpen(true);
      void emitUnifiedEvent('dictionary', 'lookup', hanziText.trim());
    },
    [emitUnifiedEvent]
  );

  const openQuickGrammarParser = useCallback(
    (sentenceZh: string) => {
      setTargetText(sentenceZh.trim());
      setActiveTab('grammar');
      setDrawerOpen(true);
      void emitUnifiedEvent('grammar', 'lookup', sentenceZh.trim());
    },
    [emitUnifiedEvent]
  );

  const openQuickWritingModal = useCallback(
    (characters: string, sourceVocabId?: string) => {
      setTargetText(characters.trim());
      setSourceContext((prev) => ({ ...prev, sourceVocabId }));
      setActiveTab('writing');
      setDrawerOpen(true);
    },
    []
  );

  const openQuickPronunciationModal = useCallback(
    (textZh: string, pinyin = '') => {
      setTargetText(textZh.trim());
      setTargetPinyin(pinyin.trim());
      setActiveTab('pronunciation');
      setDrawerOpen(true);
    },
    []
  );

  const quickSaveToVocabulary = useCallback(
    async (
      wordData: {
        simplified: string;
        pinyin?: string;
        han_viet?: string;
        meaning_vi?: string;
        hsk_level?: number;
      },
      ctx: UnifiedSourceContext | null = null
    ) => {
      const entry: DictionaryEntry = {
        id: `unified_${wordData.simplified}`,
        simplified: wordData.simplified,
        traditional: wordData.simplified,
        pinyin_display: wordData.pinyin || '',
        pinyin_numeric: wordData.pinyin || '',
        pinyin_clean: (wordData.pinyin || wordData.simplified)
          .replace(/[^a-zA-Z0-9]/g, '')
          .toLowerCase(),
        han_viet: wordData.han_viet || '',
        hsk_2_level: wordData.hsk_level && wordData.hsk_level <= 6 ? wordData.hsk_level : null,
        hsk_3_level: wordData.hsk_level || null,
        frequency_rank: 5000,
        pos_meanings: [
          {
            pos: 'n',
            definitions_vi: [wordData.meaning_vi || 'Từ vựng lưu từ hệ sinh thái học tập'],
            definitions_en: [],
            collocations: [],
          },
        ],
        examples: ctx?.sentenceZh
          ? [
              {
                hanzi: ctx.sentenceZh,
                pinyin: ctx.sentencePinyin || '',
                vi: ctx.sentenceVi || '',
                hsk_level: wordData.hsk_level || 3,
              },
            ]
          : [],
      };

      await saveWordToDeck(entry, user);
      await emitUnifiedEvent('vocab', 'save_vocab', wordData.simplified, undefined, {
        sourceType: ctx?.sourceType || 'dictionary',
      });
      setToastMessage(`Đã lưu "${wordData.simplified}" vào Vocabulary Workspace kèm ngữ cảnh!`);
    },
    [user, emitUnifiedEvent]
  );

  return {
    drawerOpen,
    activeTab,
    targetText,
    targetPinyin,
    sourceContext,
    toastMessage,
    recentEvents,
    setActiveTab,
    closeDrawer: () => setDrawerOpen(false),
    dismissToast: () => setToastMessage(null),
    emitUnifiedEvent,
    openQuickDictionary,
    openQuickGrammarParser,
    openQuickWritingModal,
    openQuickPronunciationModal,
    quickSaveToVocabulary,
  };
}
