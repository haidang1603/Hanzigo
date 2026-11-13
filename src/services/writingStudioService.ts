import { VOCABULARY_LIST } from '../data/chineseData.js';
import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { recordLearningEvent } from './learningDataService.ts';

export type WritingMode = 'guided' | 'recall' | 'dictation';
export type GridType = 'mizige' | 'tianzige' | 'jiugongge';
export type MasteryTier = 'novice' | 'practicing' | 'proficient' | 'calligrapher';

export interface WritingQueueItem {
  character: string;
  word: string;
  pinyin: string;
  meaning: string;
  vocabId?: string | null;
}

export interface StrokeAccuracyInput {
  mode: WritingMode;
  totalStrokes: number;
  strokeMistakes: Record<number, number>;
}

export interface StrokeAccuracyResult {
  accuracyScore: number;
  totalMistakes: number;
  mistakenStrokeIndices: number[];
  zeroedStrokeIndices: number[];
}

export interface HanziWritingLogRecord {
  id: string;
  character: string;
  source_vocab_id: string | null;
  mode: WritingMode;
  total_strokes: number;
  mistake_count: number;
  mistaken_stroke_indices: number[];
  accuracy_score: number;
  duration_ms: number;
  created_at: string;
}

export interface HanziCharacterMasteryRecord {
  character: string;
  total_attempts: number;
  avg_accuracy: number;
  problematic_strokes: Record<string, number>;
  mastery_tier: MasteryTier;
  last_practiced_at: string;
}

const LOGS_STORAGE_KEY = 'hanzigo_writing_studio_logs_v1';
const MASTERY_STORAGE_KEY = 'hanzigo_writing_studio_mastery_v1';
const SAVED_DECK_STORAGE_KEY = 'hanzigo_smart_dict_saved_deck_v1';
const HANZI_CHAR_REGEX = /[\u4e00-\u9fa5]/;

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}

function getUserKey(base: string, user?: { id?: string | null } | null): string {
  return user?.id ? `${base}_${user.id}` : base;
}

/**
 * Compute stroke accuracy score (0-100):
 * - Starts at 100.
 * - In recall/dictation mode, each mistake deducts 100 / (totalStrokes * 1.5).
 * - In guided mode, each mistake deducts 100 / (totalStrokes * 3).
 * - If a stroke has > 3 mistakes (hint triggered), that stroke scores 0
 *   (full stroke weight 100 / totalStrokes deducted) and its index is recorded
 *   in mistakenStrokeIndices.
 */
export function calculateStrokeAccuracy(input: StrokeAccuracyInput): StrokeAccuracyResult {
  const totalStrokes = Math.max(1, Math.round(input.totalStrokes));
  const strokeWeight = 100 / totalStrokes;
  const perMistakePenalty =
    input.mode === 'guided' ? 100 / (totalStrokes * 3) : 100 / (totalStrokes * 1.5);

  let score = 100;
  let totalMistakes = 0;
  const mistakenStrokeIndices: number[] = [];
  const zeroedStrokeIndices: number[] = [];

  for (const [idxStr, rawCount] of Object.entries(input.strokeMistakes || {})) {
    const strokeIdx = Number(idxStr);
    const mistakes = Math.max(0, Number(rawCount) || 0);
    if (mistakes <= 0 || Number.isNaN(strokeIdx)) continue;

    totalMistakes += mistakes;
    mistakenStrokeIndices.push(strokeIdx);

    if (mistakes > 3) {
      // Stroke failed (>3 mistakes) -> 0 points for this stroke
      score -= strokeWeight;
      zeroedStrokeIndices.push(strokeIdx);
    } else {
      score -= Math.min(strokeWeight, mistakes * perMistakePenalty);
    }
  }

  mistakenStrokeIndices.sort((a, b) => a - b);
  zeroedStrokeIndices.sort((a, b) => a - b);

  return {
    accuracyScore: Math.max(0, Math.min(100, Math.round(score * 100) / 100)),
    totalMistakes,
    mistakenStrokeIndices,
    zeroedStrokeIndices,
  };
}

export function computeMasteryTier(totalAttempts: number, avgAccuracy: number): MasteryTier {
  if (totalAttempts >= 5 && avgAccuracy >= 92) return 'calligrapher';
  if (totalAttempts >= 3 && avgAccuracy >= 80) return 'proficient';
  if (totalAttempts >= 1 && avgAccuracy >= 60) return 'practicing';
  return 'novice';
}

/**
 * Queue manager for practicing a multi-character word, full sentence, or saved vocabulary deck.
 */
export class WritingQueueManager {
  private items: WritingQueueItem[] = [];
  private cursor = 0;

  constructor(initialInput?: string | Array<{ hanzi: string; pinyin?: string; meaning?: string; vocabId?: string | null }>) {
    if (initialInput) {
      this.load(initialInput);
    }
  }

  load(
    input:
      | string
      | Array<{ hanzi: string; pinyin?: string; meaning?: string; vocabId?: string | null }>
  ): WritingQueueItem[] {
    const vocabLookup = new Map(
      VOCABULARY_LIST.filter((v) => v?.hanzi).map((v) => [v.hanzi, v])
    );

    const nextItems: WritingQueueItem[] = [];

    if (typeof input === 'string') {
      const text = input.trim();
      const wordMeta = vocabLookup.get(text);
      for (const ch of Array.from(text)) {
        if (!HANZI_CHAR_REGEX.test(ch)) continue;
        const charMeta = vocabLookup.get(ch);
        nextItems.push({
          character: ch,
          word: text,
          pinyin: wordMeta?.pinyin || charMeta?.pinyin || '',
          meaning: wordMeta?.meaning || charMeta?.meaning || '',
          vocabId: null,
        });
      }
    } else if (Array.isArray(input)) {
      for (const entry of input) {
        const word = (entry.hanzi || '').trim();
        if (!word) continue;
        const wordMeta = vocabLookup.get(word);
        for (const ch of Array.from(word)) {
          if (!HANZI_CHAR_REGEX.test(ch)) continue;
          const charMeta = vocabLookup.get(ch);
          nextItems.push({
            character: ch,
            word,
            pinyin: entry.pinyin || wordMeta?.pinyin || charMeta?.pinyin || '',
            meaning: entry.meaning || wordMeta?.meaning || charMeta?.meaning || '',
            vocabId: entry.vocabId ?? null,
          });
        }
      }
    }

    this.items = nextItems;
    this.cursor = 0;
    return this.items;
  }

  getItems(): WritingQueueItem[] {
    return this.items;
  }

  getCurrentItem(): WritingQueueItem | null {
    return this.items[this.cursor] ?? null;
  }

  getCursor(): number {
    return this.cursor;
  }

  next(): WritingQueueItem | null {
    if (this.items.length === 0) return null;
    if (this.cursor < this.items.length - 1) {
      this.cursor += 1;
    }
    return this.getCurrentItem();
  }

  prev(): WritingQueueItem | null {
    if (this.items.length === 0) return null;
    if (this.cursor > 0) {
      this.cursor -= 1;
    }
    return this.getCurrentItem();
  }

  jumpTo(index: number): WritingQueueItem | null {
    if (index >= 0 && index < this.items.length) {
      this.cursor = index;
    }
    return this.getCurrentItem();
  }

  getProgress(): { current: number; total: number; percent: number } {
    const total = this.items.length;
    if (total === 0) return { current: 0, total: 0, percent: 0 };
    const current = this.cursor + 1;
    return {
      current,
      total,
      percent: Math.round((current / total) * 100),
    };
  }
}

export function getSavedDeckForWriting(
  user?: { id?: string | null } | null
): Array<{ hanzi: string; pinyin?: string; meaning?: string }> {
  const key = getUserKey(SAVED_DECK_STORAGE_KEY, user);
  const raw = safeReadJson<
    Array<{ simplified?: string; hanzi?: string; pinyin_display?: string; meaning_vi?: string }>
  >(key, []);

  return raw
    .map((item) => ({
      hanzi: item.simplified || item.hanzi || '',
      pinyin: item.pinyin_display || '',
      meaning: item.meaning_vi || '',
    }))
    .filter((item) => HANZI_CHAR_REGEX.test(item.hanzi));
}

export async function recordWritingAttempt(params: {
  user?: { id?: string | null } | null;
  character: string;
  sourceVocabId?: string | null;
  mode: WritingMode;
  totalStrokes: number;
  strokeMistakes: Record<number, number>;
  durationMs: number;
}): Promise<{
  log: HanziWritingLogRecord;
  mastery: HanziCharacterMasteryRecord;
}> {
  const { user = null, character, sourceVocabId = null, mode, totalStrokes, strokeMistakes, durationMs } =
    params;

  const accuracy = calculateStrokeAccuracy({ mode, totalStrokes, strokeMistakes });
  const nowIso = new Date().toISOString();

  const log: HanziWritingLogRecord = {
    id: `wlog-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    character,
    source_vocab_id: sourceVocabId,
    mode,
    total_strokes: totalStrokes,
    mistake_count: accuracy.totalMistakes,
    mistaken_stroke_indices: accuracy.mistakenStrokeIndices,
    accuracy_score: accuracy.accuracyScore,
    duration_ms: Math.max(0, Math.round(durationMs)),
    created_at: nowIso,
  };

  // Persist log locally
  const logsKey = getUserKey(LOGS_STORAGE_KEY, user);
  const existingLogs = safeReadJson<HanziWritingLogRecord[]>(logsKey, []);
  const nextLogs = [log, ...existingLogs].slice(0, 200);
  safeWriteJson(logsKey, nextLogs);

  // Update mastery locally
  const masteryKey = getUserKey(MASTERY_STORAGE_KEY, user);
  const masteryMap = safeReadJson<Record<string, HanziCharacterMasteryRecord>>(masteryKey, {});
  const prev = masteryMap[character];
  const prevAttempts = prev?.total_attempts ?? 0;
  const nextAttempts = prevAttempts + 1;
  const nextAvg =
    Math.round(
      (((prev?.avg_accuracy ?? 0) * prevAttempts + accuracy.accuracyScore) / nextAttempts) * 100
    ) / 100;

  const problematicStrokes: Record<string, number> = { ...(prev?.problematic_strokes ?? {}) };
  for (const sIdx of accuracy.mistakenStrokeIndices) {
    const k = String(sIdx);
    problematicStrokes[k] = (problematicStrokes[k] ?? 0) + 1;
  }

  const mastery: HanziCharacterMasteryRecord = {
    character,
    total_attempts: nextAttempts,
    avg_accuracy: nextAvg,
    problematic_strokes: problematicStrokes,
    mastery_tier: computeMasteryTier(nextAttempts, nextAvg),
    last_practiced_at: nowIso,
  };

  masteryMap[character] = mastery;
  safeWriteJson(masteryKey, masteryMap);

  // Emit unified telemetry (Task 26.01)
  void recordLearningEvent({
    userId: user?.id ?? null,
    sourceModule: 'hanzi_writer',
    skillDomain: 'stroke_order',
    itemId: character,
    isCorrect: accuracy.accuracyScore >= 75,
    scoreEarned: accuracy.accuracyScore,
    scoreMax: 100,
    durationMs: log.duration_ms,
    payload: {
      mode,
      mistakeCount: accuracy.totalMistakes,
      mistakenStrokeIndices: accuracy.mistakenStrokeIndices,
    },
  });

  // Sync to Supabase if authenticated
  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('hanzi_writing_logs').insert({
        user_id: user.id,
        character,
        source_vocab_id: sourceVocabId,
        mode,
        total_strokes: totalStrokes,
        mistake_count: accuracy.totalMistakes,
        mistaken_stroke_indices: accuracy.mistakenStrokeIndices,
        accuracy_score: accuracy.accuracyScore,
        duration_ms: log.duration_ms,
        created_at: nowIso,
      });

      await supabase.from('hanzi_character_mastery').upsert(
        {
          user_id: user.id,
          character,
          total_attempts: mastery.total_attempts,
          avg_accuracy: mastery.avg_accuracy,
          problematic_strokes: mastery.problematic_strokes,
          mastery_tier: mastery.mastery_tier,
          last_practiced_at: nowIso,
        },
        { onConflict: 'user_id,character' }
      );
    } catch {
      // non-fatal offline fallback
    }
  }

  return { log, mastery };
}

export async function getWritingHistoryAndMastery(
  user?: { id?: string | null } | null
): Promise<{
  logs: HanziWritingLogRecord[];
  masteryList: HanziCharacterMasteryRecord[];
  mostMistakenCharacters: HanziCharacterMasteryRecord[];
}> {
  const logsKey = getUserKey(LOGS_STORAGE_KEY, user);
  const masteryKey = getUserKey(MASTERY_STORAGE_KEY, user);

  let logs = safeReadJson<HanziWritingLogRecord[]>(logsKey, []);
  let masteryList = Object.values(
    safeReadJson<Record<string, HanziCharacterMasteryRecord>>(masteryKey, {})
  );

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      const [logsRes, masteryRes] = await Promise.all([
        supabase
          .from('hanzi_writing_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('hanzi_character_mastery')
          .select('*')
          .eq('user_id', user.id)
          .order('avg_accuracy', { ascending: true })
          .limit(50),
      ]);

      if (!logsRes.error && Array.isArray(logsRes.data) && logsRes.data.length > 0) {
        logs = logsRes.data as HanziWritingLogRecord[];
        safeWriteJson(logsKey, logs);
      }
      if (!masteryRes.error && Array.isArray(masteryRes.data) && masteryRes.data.length > 0) {
        masteryList = masteryRes.data as HanziCharacterMasteryRecord[];
      }
    } catch {
      // fallback to local
    }
  }

  const mostMistakenCharacters = [...masteryList]
    .filter((m) => Object.keys(m.problematic_strokes || {}).length > 0 || m.avg_accuracy < 90)
    .sort((a, b) => a.avg_accuracy - b.avg_accuracy)
    .slice(0, 8);

  return { logs, masteryList, mostMistakenCharacters };
}
