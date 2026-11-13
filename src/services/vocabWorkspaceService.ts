import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { recordLearningEvent } from './learningDataService.ts';

export type SrsState = 'new' | 'learning' | 'review' | 'relearning';
export type ReviewRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy
export type ReviewModalMode = 'flashcard' | 'audio_choice' | 'context_cloze';

export interface VocabSourceContext {
  source_type: 'reading' | 'listening' | 'dictionary' | 'grammar';
  source_id?: string;
  sentence_zh: string;
  sentence_pinyin: string;
  sentence_vi: string;
  audio_timestamp_ms?: number;
}

export interface VocabDeck {
  id: string;
  name: string;
  description: string;
  color_hex: string;
  is_default: boolean;
  created_at: string;
}

export interface UserVocabItem {
  id: string;
  deck_id: string;
  dictionary_entry_id?: string | null;
  simplified: string;
  pinyin: string;
  han_viet: string;
  meaning_vi: string;
  hsk_level: number;
  personal_mnemonic: string;
  tags: string[];
  source_context: VocabSourceContext[];
  srs_state: SrsState;
  stability: number;
  difficulty: number;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  meaning_mastery: number;
  writing_mastery: number;
  pronunciation_mastery: number;
}

export interface WorkspaceStats {
  dueToday: number;
  newCount: number;
  learningCount: number;
  masteredCount: number;
  leechCount: number;
  forecast7Days: Array<{ dateLabel: string; count: number }>;
}

export interface MultiModalReviewCard {
  item: UserVocabItem;
  mode: ReviewModalMode;
  audioOptions?: UserVocabItem[];
  clozePrompt?: string;
}

const DECKS_STORAGE_KEY = 'hanzigo_vocab_workspace_decks_v1';
const ITEMS_STORAGE_KEY = 'hanzigo_vocab_workspace_items_v1';

const DEFAULT_DECKS: VocabDeck[] = [
  {
    id: 'deck-default-core',
    name: 'Sổ tay cốt lõi',
    description: 'Từ vựng lưu từ bài đọc, bài nghe và từ điển',
    color_hex: '#10b981',
    is_default: true,
    created_at: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'deck-hsk4-focus',
    name: 'Trọng tâm HSK 4',
    description: 'Các cụm từ dễ nhầm trong giao tiếp & công việc',
    color_hex: '#0ea5e9',
    is_default: false,
    created_at: '2026-11-02T00:00:00.000Z',
  },
];

function createStarterItems(now = new Date()): UserVocabItem[] {
  const isoNow = now.toISOString();
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
  const inTwoDays = new Date(now.getTime() + 2 * 24 * 3600 * 1000).toISOString();

  return [
    {
      id: 'vitem-1',
      deck_id: 'deck-default-core',
      simplified: '图书馆',
      pinyin: 'túshūguǎn',
      han_viet: 'ĐỒ THƯ QUÁN',
      meaning_vi: 'Thư viện',
      hsk_level: 2,
      personal_mnemonic: 'Quán (馆) chứa đồ thư (图书) = Thư viện.',
      tags: ['địa điểm', 'học tập'],
      source_context: [
        {
          source_type: 'reading',
          sentence_zh: '今天我去图书馆学习中文。',
          sentence_pinyin: 'Jīntiān wǒ qù túshūguǎn xuéxí Zhōngwén.',
          sentence_vi: 'Hôm nay tôi đi thư viện học tiếng Trung.',
        },
      ],
      srs_state: 'learning',
      stability: 1.5,
      difficulty: 4.5,
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 1,
      lapses: 0,
      next_review_at: yesterday,
      last_reviewed_at: yesterday,
      meaning_mastery: 55,
      writing_mastery: 40,
      pronunciation_mastery: 65,
    },
    {
      id: 'vitem-2',
      deck_id: 'deck-hsk4-focus',
      simplified: '自律',
      pinyin: 'zìlǜ',
      han_viet: 'TỰ LUẬT',
      meaning_vi: 'Tính tự giác, kỷ luật bản thân',
      hsk_level: 4,
      personal_mnemonic: 'Tự (自) đặt ra quy luật (律) cho mình.',
      tags: ['công việc', 'tính cách'],
      source_context: [
        {
          source_type: 'listening',
          sentence_zh: '远程办公需要更强的自律。',
          sentence_pinyin: 'Yuǎnchéng bàngōng xūyào gèng qiáng de zìlǜ.',
          sentence_vi: 'Làm việc từ xa đòi hỏi tính tự giác cao hơn.',
          audio_timestamp_ms: 7500,
        },
      ],
      srs_state: 'review',
      stability: 3.2,
      difficulty: 5.8,
      ease_factor: 2.3,
      interval_days: 3,
      repetitions: 2,
      lapses: 3,
      next_review_at: isoNow,
      last_reviewed_at: yesterday,
      meaning_mastery: 70,
      writing_mastery: 50,
      pronunciation_mastery: 75,
    },
    {
      id: 'vitem-3',
      deck_id: 'deck-hsk4-focus',
      simplified: '氛围',
      pinyin: 'fēnwéi',
      han_viet: 'PHÂN VI',
      meaning_vi: 'Bầu không khí, không khí xung quanh',
      hsk_level: 5,
      personal_mnemonic: 'Khí phân (氛) bao vây (围) xung quanh.',
      tags: ['văn hóa', 'HSK5'],
      source_context: [
        {
          source_type: 'reading',
          sentence_zh: '公共空间提升了城市的文化氛围。',
          sentence_pinyin: 'Gōnggòng kōngjiān tíshēng le chéngshì de wénhuà fēnwéi.',
          sentence_vi: 'Không gian công cộng nâng tầm bầu không khí văn hóa đô thị.',
        },
      ],
      srs_state: 'new',
      stability: 0,
      difficulty: 5.0,
      ease_factor: 2.5,
      interval_days: 0,
      repetitions: 0,
      lapses: 0,
      next_review_at: isoNow,
      last_reviewed_at: null,
      meaning_mastery: 15,
      writing_mastery: 10,
      pronunciation_mastery: 20,
    },
    {
      id: 'vitem-4',
      deck_id: 'deck-default-core',
      simplified: '顺便',
      pinyin: 'shùnbiàn',
      han_viet: 'THUẬN TIỆN',
      meaning_vi: 'Nhân tiện, tiện thể',
      hsk_level: 3,
      personal_mnemonic: 'Thuận (顺) đường thì tiện (便) làm luôn.',
      tags: ['giao tiếp'],
      source_context: [
        {
          source_type: 'listening',
          sentence_zh: '在这里喝，顺便用一下你们的无线网。',
          sentence_pinyin: 'Zài zhèlǐ hē, shùnbiàn yòng yíxià nǐmen de wúxiànwǎng.',
          sentence_vi: 'Uống tại đây, nhân tiện dùng nhờ Wi-Fi của quán.',
          audio_timestamp_ms: 14800,
        },
      ],
      srs_state: 'review',
      stability: 12.0,
      difficulty: 3.8,
      ease_factor: 2.65,
      interval_days: 10,
      repetitions: 5,
      lapses: 0,
      next_review_at: inTwoDays,
      last_reviewed_at: yesterday,
      meaning_mastery: 92,
      writing_mastery: 85,
      pronunciation_mastery: 90,
    },
  ];
}

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key: string, value: unknown): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}

/**
 * Adaptive SM-2 / FSRS-inspired multidimensional SRS scheduler.
 * Ratings: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy.
 */
export function scheduleNextReview(
  item: UserVocabItem,
  rating: ReviewRating,
  now = new Date()
): UserVocabItem {
  let ease = item.ease_factor || 2.5;
  let interval = item.interval_days || 0;
  let reps = item.repetitions || 0;
  let lapses = item.lapses || 0;
  let stability = item.stability || 0;
  let difficulty = item.difficulty || 5.0;
  let state: SrsState = item.srs_state || 'new';
  let mastery = item.meaning_mastery || 0;

  if (rating === 1) {
    // Again: reset streak, increment lapses
    lapses += 1;
    reps = 0;
    interval = 1;
    ease = Math.max(1.3, Number((ease - 0.2).toFixed(2)));
    stability = Math.max(0.5, Number((stability * 0.4).toFixed(2)));
    difficulty = Math.min(10, Number((difficulty + 0.8).toFixed(2)));
    state = item.repetitions > 0 ? 'relearning' : 'learning';
    mastery = Math.max(10, mastery - 15);
  } else if (rating === 2) {
    // Hard
    reps = Math.max(1, reps + 1);
    interval = interval <= 1 ? 1 : Math.max(2, Math.round(interval * 1.2));
    ease = Math.max(1.3, Number((ease - 0.15).toFixed(2)));
    stability = Math.max(1, Number((stability * 1.15 + 0.5).toFixed(2)));
    difficulty = Math.min(10, Number((difficulty + 0.25).toFixed(2)));
    state = interval >= 3 ? 'review' : 'learning';
    mastery = Math.min(100, mastery + 6);
  } else if (rating === 3) {
    // Good
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.max(interval + 1, Math.round(interval * ease));

    stability = Math.max(1.5, Number((stability * ease + 1).toFixed(2)));
    difficulty = Math.max(1, Number((difficulty - 0.15).toFixed(2)));
    state = reps >= 2 ? 'review' : 'learning';
    mastery = Math.min(100, mastery + 12);
  } else {
    // Easy (4)
    reps += 1;
    if (reps === 1) interval = 4;
    else if (reps === 2) interval = 10;
    else interval = Math.max(interval + 2, Math.round(interval * ease * 1.3));

    ease = Math.min(3.0, Number((ease + 0.15).toFixed(2)));
    stability = Math.max(3, Number((stability * ease * 1.3 + 2).toFixed(2)));
    difficulty = Math.max(1, Number((difficulty - 0.4).toFixed(2)));
    state = 'review';
    mastery = Math.min(100, mastery + 18);
  }

  const nextReviewDate = new Date(now.getTime() + interval * 24 * 3600 * 1000);

  return {
    ...item,
    srs_state: state,
    ease_factor: ease,
    interval_days: interval,
    repetitions: reps,
    lapses,
    stability,
    difficulty,
    meaning_mastery: mastery,
    last_reviewed_at: now.toISOString(),
    next_review_at: nextReviewDate.toISOString(),
  };
}

/**
 * Cross-module signal adjustment: if a user looks up a word in Reading/Dictionary
 * that is already in 'review' state, halve its interval_days (min 1) so it resurfaces sooner.
 */
export function applyCrossModuleLookupPenalty(
  item: UserVocabItem,
  now = new Date()
): UserVocabItem {
  if (item.srs_state !== 'review') return item;
  const halvedInterval = Math.max(1, Math.floor((item.interval_days || 2) * 0.5));
  const nextReviewDate = new Date(now.getTime() + halvedInterval * 24 * 3600 * 1000);
  return {
    ...item,
    interval_days: halvedInterval,
    stability: Math.max(0.8, Number((item.stability * 0.6).toFixed(2))),
    next_review_at: nextReviewDate.toISOString(),
  };
}

export async function listVocabDecks(user?: { id?: string | null } | null): Promise<VocabDeck[]> {
  const local = safeReadStorage<VocabDeck[]>(DECKS_STORAGE_KEY, DEFAULT_DECKS);
  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return local;
  }

  try {
    const { data, error } = await supabase
      .from('vocab_decks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error || !Array.isArray(data) || data.length === 0) return local;
    const mapped = data.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      description: String(row.description || ''),
      color_hex: String(row.color_hex || '#10b981'),
      is_default: Boolean(row.is_default),
      created_at: String(row.created_at || new Date().toISOString()),
    }));
    safeWriteStorage(DECKS_STORAGE_KEY, mapped);
    return mapped;
  } catch {
    return local;
  }
}

export async function createVocabDeck(
  params: { name: string; description?: string; color_hex?: string },
  user?: { id?: string | null } | null
): Promise<VocabDeck> {
  const existing = safeReadStorage<VocabDeck[]>(DECKS_STORAGE_KEY, DEFAULT_DECKS);
  const deck: VocabDeck = {
    id: `deck-${Date.now()}`,
    name: params.name.trim(),
    description: params.description?.trim() || '',
    color_hex: params.color_hex || '#10b981',
    is_default: false,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      const { data } = await supabase
        .from('vocab_decks')
        .insert({
          user_id: user.id,
          name: deck.name,
          description: deck.description,
          color_hex: deck.color_hex,
          is_default: false,
        })
        .select('id, created_at')
        .single();
      if (data?.id) {
        deck.id = String(data.id);
        deck.created_at = String(data.created_at || deck.created_at);
      }
    } catch {
      // keep local deck
    }
  }

  safeWriteStorage(DECKS_STORAGE_KEY, [...existing, deck]);
  return deck;
}

export async function listVocabItems(
  user?: { id?: string | null } | null
): Promise<UserVocabItem[]> {
  const cached = safeReadStorage<UserVocabItem[] | null>(ITEMS_STORAGE_KEY, null);
  const local = cached && cached.length > 0 ? cached : createStarterItems();
  if (!cached) {
    safeWriteStorage(ITEMS_STORAGE_KEY, local);
  }

  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return local;
  }

  try {
    const { data, error } = await supabase
      .from('user_vocab_items')
      .select('*')
      .eq('user_id', user.id)
      .order('next_review_at', { ascending: true });

    if (error || !Array.isArray(data) || data.length === 0) return local;
    const mapped = data.map((row) => ({
      id: String(row.id),
      deck_id: String(row.deck_id),
      dictionary_entry_id: row.dictionary_entry_id ? String(row.dictionary_entry_id) : null,
      simplified: String(row.simplified),
      pinyin: String(row.pinyin || ''),
      han_viet: String(row.han_viet || ''),
      meaning_vi: String(row.meaning_vi || ''),
      hsk_level: Number(row.hsk_level || 1),
      personal_mnemonic: String(row.personal_mnemonic || ''),
      tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
      source_context: Array.isArray(row.source_context)
        ? (row.source_context as VocabSourceContext[])
        : [],
      srs_state: (row.srs_state as SrsState) || 'new',
      stability: Number(row.stability || 0),
      difficulty: Number(row.difficulty || 5.0),
      ease_factor: Number(row.ease_factor || 2.5),
      interval_days: Number(row.interval_days || 0),
      repetitions: Number(row.repetitions || 0),
      lapses: Number(row.lapses || 0),
      next_review_at: String(row.next_review_at || new Date().toISOString()),
      last_reviewed_at: row.last_reviewed_at ? String(row.last_reviewed_at) : null,
      meaning_mastery: Number(row.meaning_mastery || 0),
      writing_mastery: Number(row.writing_mastery || 0),
      pronunciation_mastery: Number(row.pronunciation_mastery || 0),
    }));
    safeWriteStorage(ITEMS_STORAGE_KEY, mapped);
    return mapped;
  } catch {
    return local;
  }
}

export async function saveVocabItemReview(
  updatedItem: UserVocabItem,
  rating: ReviewRating,
  user?: { id?: string | null } | null
): Promise<void> {
  const items = safeReadStorage<UserVocabItem[]>(ITEMS_STORAGE_KEY, createStarterItems());
  const nextItems = items.map((it) => (it.id === updatedItem.id ? updatedItem : it));
  safeWriteStorage(ITEMS_STORAGE_KEY, nextItems);

  void recordLearningEvent({
    userId: user?.id ?? null,
    sourceModule: 'vocab',
    hskLevel: updatedItem.hsk_level,
    skillDomain: 'vocabulary',
    itemId: updatedItem.simplified,
    isCorrect: rating >= 3,
    scoreEarned: rating >= 3 ? 100 : rating === 2 ? 60 : 20,
    scoreMax: 100,
    durationMs: 5000,
    payload: {
      rating,
      intervalDays: updatedItem.interval_days,
      srsState: updatedItem.srs_state,
    },
  });

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase
        .from('user_vocab_items')
        .update({
          srs_state: updatedItem.srs_state,
          stability: updatedItem.stability,
          difficulty: updatedItem.difficulty,
          ease_factor: updatedItem.ease_factor,
          interval_days: updatedItem.interval_days,
          repetitions: updatedItem.repetitions,
          lapses: updatedItem.lapses,
          next_review_at: updatedItem.next_review_at,
          last_reviewed_at: updatedItem.last_reviewed_at,
          meaning_mastery: updatedItem.meaning_mastery,
          personal_mnemonic: updatedItem.personal_mnemonic,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedItem.id)
        .eq('user_id', user.id);
    } catch {
      // non-fatal for local starter items
    }
  }
}

export async function updatePersonalMnemonic(
  itemId: string,
  mnemonic: string,
  user?: { id?: string | null } | null
): Promise<UserVocabItem[]> {
  const items = safeReadStorage<UserVocabItem[]>(ITEMS_STORAGE_KEY, createStarterItems());
  const nextItems = items.map((it) =>
    it.id === itemId ? { ...it, personal_mnemonic: mnemonic } : it
  );
  safeWriteStorage(ITEMS_STORAGE_KEY, nextItems);

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase
        .from('user_vocab_items')
        .update({ personal_mnemonic: mnemonic, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .eq('user_id', user.id);
    } catch {
      // ignore
    }
  }
  return nextItems;
}

export function isVocabItemMastered(item: UserVocabItem): boolean {
  if (item.srs_state === 'review' && item.interval_days >= 7) return true;
  if (
    item.meaning_mastery >= 85 &&
    item.writing_mastery >= 80 &&
    item.pronunciation_mastery >= 80
  ) {
    return true;
  }
  return false;
}

export async function markVocabItemAsMastered(
  itemId: string,
  user?: { id?: string | null } | null
): Promise<UserVocabItem[]> {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 365 * 24 * 3600 * 1000).toISOString();
  const items = safeReadStorage<UserVocabItem[]>(ITEMS_STORAGE_KEY, createStarterItems());
  const nextItems = items.map((it) =>
    it.id === itemId
      ? {
          ...it,
          srs_state: 'review' as SrsState,
          interval_days: Math.max(30, it.interval_days || 0),
          meaning_mastery: 100,
          writing_mastery: Math.max(85, it.writing_mastery || 0),
          pronunciation_mastery: Math.max(85, it.pronunciation_mastery || 0),
          last_reviewed_at: now.toISOString(),
          next_review_at: futureDate,
        }
      : it
  );
  safeWriteStorage(ITEMS_STORAGE_KEY, nextItems);

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase
        .from('user_vocab_items')
        .update({
          srs_state: 'review',
          interval_days: 30,
          meaning_mastery: 100,
          last_reviewed_at: now.toISOString(),
          next_review_at: futureDate,
          updated_at: now.toISOString(),
        })
        .eq('id', itemId)
        .eq('user_id', user.id);
    } catch {
      // ignore remote error
    }
  }

  return nextItems;
}

export function computeWorkspaceStats(
  items: UserVocabItem[],
  now = new Date()
): WorkspaceStats {
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  let dueToday = 0;
  let newCount = 0;
  let learningCount = 0;
  let masteredCount = 0;
  let leechCount = 0;

  for (const item of items) {
    const mastered = isVocabItemMastered(item);
    if (mastered) masteredCount += 1;
    else if (item.srs_state === 'new') newCount += 1;
    else learningCount += 1;

    if (item.lapses >= 3 && !mastered) leechCount += 1;

    const dueTime = new Date(item.next_review_at).getTime();
    if (!mastered && !Number.isNaN(dueTime) && dueTime <= endOfToday.getTime()) {
      dueToday += 1;
    }
  }

  const forecast7Days: Array<{ dateLabel: string; count: number }> = [];
  for (let d = 0; d < 7; d += 1) {
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() + d);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const count = items.filter((item) => {
      if (isVocabItemMastered(item)) return false;
      const t = new Date(item.next_review_at).getTime();
      if (Number.isNaN(t)) return false;
      if (d === 0) return t <= dayEnd.getTime();
      return t >= dayStart.getTime() && t <= dayEnd.getTime();
    }).length;

    const label =
      d === 0
        ? 'Hôm nay'
        : `${String(dayStart.getDate()).padStart(2, '0')}/${String(dayStart.getMonth() + 1).padStart(2, '0')}`;
    forecast7Days.push({ dateLabel: label, count });
  }

  return {
    dueToday,
    newCount,
    learningCount,
    masteredCount,
    leechCount,
    forecast7Days,
  };
}

export function buildReviewSessionItems(
  items: UserVocabItem[],
  allPool: UserVocabItem[],
  preferredMode: 'mixed' | ReviewModalMode = 'mixed'
): MultiModalReviewCard[] {
  const activeItems = items.filter((item) => !isVocabItemMastered(item));
  return activeItems.map((item, idx) => {
    const hasSentence = Boolean(
      item.source_context?.[0]?.sentence_zh &&
        item.source_context[0].sentence_zh.includes(item.simplified)
    );

    let mode: ReviewModalMode = 'flashcard';
    if (preferredMode !== 'mixed') {
      mode = preferredMode === 'context_cloze' && !hasSentence ? 'flashcard' : preferredMode;
    } else {
      const mod = idx % 3;
      if (mod === 1 && allPool.length >= 2) mode = 'audio_choice';
      else if (mod === 2 && hasSentence) mode = 'context_cloze';
      else mode = 'flashcard';
    }

    const distractors = allPool.filter((other) => other.id !== item.id).slice(0, 3);
    const audioOptions =
      mode === 'audio_choice'
        ? [item, ...distractors].sort((a, b) => a.simplified.localeCompare(b.simplified))
        : undefined;

    const clozePrompt =
      mode === 'context_cloze' && hasSentence
        ? item.source_context[0].sentence_zh.replace(item.simplified, '______')
        : undefined;

    return {
      item,
      mode,
      audioOptions,
      clozePrompt,
    };
  });
}

