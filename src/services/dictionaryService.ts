import { VOCABULARY_LIST } from '../data/chineseData.js';
import { getHanziDecomposition } from '../data/hanziDecomposition.js';
import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { invokeAiPersonalization } from './aiGateway.js';
import {
  cleanPinyin,
  cleanVietnamese,
  normalizeNumberedPinyin,
  searchLocalDictionary,
} from './dictionaryService.js';
import type {
  CharacterDecomposition,
  DictionaryEntry,
  DictionaryExample,
  DictionaryHistoryItem,
  DictionarySearchResult,
  MeasureWordItem,
  PosMeaningItem,
  PosTag,
  SearchInputType,
  SentenceTokenResult,
  StructureType,
  SynonymsAntonyms,
} from '../types/dictionary.types.ts';

const HISTORY_STORAGE_KEY = 'hanzigo_smart_dict_history_v1';
const SAVED_DECK_STORAGE_KEY = 'hanzigo_smart_dict_saved_deck_v1';
const AI_CACHE_STORAGE_KEY = 'hanzigo_smart_dict_ai_cache_v1';

const HANZI_REGEX = /[\u4e00-\u9fa5]/;
const NUMBERED_PINYIN_REGEX = /^[a-züǖǘǚǜ]+[1-5](\s+[a-züǖǘǚǜ]+[1-5])*$/i;
const VIETNAMESE_DIACRITIC_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

const COMMON_MEASURE_WORDS: Record<string, MeasureWordItem[]> = {
  书: [{ simplified: '本', pinyin: 'běn', usage_note: 'Dùng cho sách, vở, tạp chí đóng quyển' }],
  人: [
    { simplified: '个', pinyin: 'gè', usage_note: 'Lượng từ phổ thông chỉ người' },
    { simplified: '位', pinyin: 'wèi', usage_note: 'Dùng trang trọng, lịch sự (vị khách, thầy cô)' },
  ],
  水: [{ simplified: '杯', pinyin: 'bēi', usage_note: 'Dùng cho cốc, ly nước hoặc đồ uống' }],
  茶: [{ simplified: '杯', pinyin: 'bēi', usage_note: 'Một tách/ly trà' }],
  车: [{ simplified: '辆', pinyin: 'liàng', usage_note: 'Dùng cho xe cộ có bánh (ô tô, xe đạp)' }],
  狗: [{ simplified: '只', pinyin: 'zhī', usage_note: 'Dùng cho động vật nhỏ, chim, thú nuôi' }],
  猫: [{ simplified: '只', pinyin: 'zhī', usage_note: 'Một chú mèo' }],
  衣服: [{ simplified: '件', pinyin: 'jiàn', usage_note: 'Dùng cho áo, sự việc, hành lý' }],
  事: [{ simplified: '件', pinyin: 'jiàn', usage_note: 'Một việc, một sự kiện' }],
  问题: [{ simplified: '个', pinyin: 'gè', usage_note: 'Một câu hỏi, một vấn đề' }],
};

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

function getUserScopedKey(base: string, user?: { id?: string | null } | null): string {
  return user?.id ? `${base}_${user.id}` : base;
}

/**
 * Automatically detect whether user input is Hanzi, numbered Pinyin,
 * tone-free Pinyin, Hán-Việt, or Vietnamese meaning.
 */
export function detectSearchInputType(input: string): SearchInputType {
  const trimmed = (input || '').trim();
  if (!trimmed) return 'vietnamese';

  if (HANZI_REGEX.test(trimmed)) {
    return 'hanzi';
  }
  if (NUMBERED_PINYIN_REGEX.test(trimmed)) {
    return 'pinyin_numeric';
  }
  if (VIETNAMESE_DIACRITIC_REGEX.test(trimmed)) {
    return 'vietnamese';
  }

  const normalized = trimmed.toLowerCase();
  const hasSpaces = /\s+/.test(normalized);
  const hanVietHints = [
    'hoc',
    'nhan',
    'quoc',
    'thien',
    'dia',
    'trung',
    'van',
    'hoa',
    'ngon',
    'ngu',
    'tam',
    'dao',
    'phong',
    'thuy',
    'minh',
  ];
  if (hasSpaces && normalized.split(/\s+/).some((w) => hanVietHints.includes(w))) {
    return 'han_viet';
  }

  if (/^[a-züǖǘǚǜ\s]+$/i.test(normalized) && !hasSpaces) {
    return 'pinyin_clean';
  }

  // Check if ASCII words resemble pinyin syllables vs Vietnamese
  const syllables = normalized.split(/\s+/);
  const looksLikePinyin = syllables.every((s) =>
    /^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[aeiouv]+[ngr]{0,2}$/.test(s)
  );
  return looksLikePinyin ? 'pinyin_clean' : 'vietnamese';
}

function normalizePosTag(rawPos: unknown): PosTag {
  const p = String(rawPos || '').toLowerCase();
  if (p.includes('v') || p.includes('động')) return 'v';
  if (p.includes('adj') || p.includes('tính')) return 'adj';
  if (p.includes('mw') || p.includes('lượng')) return 'mw';
  if (p.includes('adv') || p.includes('phó')) return 'adv';
  if (p.includes('prep') || p.includes('giới')) return 'prep';
  if (p.includes('conj') || p.includes('liên')) return 'conj';
  if (p.includes('pron') || p.includes('đại')) return 'pron';
  if (p.includes('num') || p.includes('số')) return 'num';
  if (p.includes('idiom') || p.includes('thành')) return 'idiom';
  if (p.includes('n') || p.includes('danh')) return 'n';
  return 'other';
}

function normalizeStructureType(raw?: string): StructureType {
  if (!raw) return '左右';
  if (raw.includes('上下')) return '上下';
  if (raw.includes('内外') || raw.includes('包围')) return '内外';
  if (raw.includes('独体')) return '独体';
  if (raw.includes('品')) return '品字';
  return '左右';
}

function buildDecompositionForHanzi(hanzi: string): CharacterDecomposition | null {
  const firstChar = Array.from(hanzi || '').find((c) => HANZI_REGEX.test(c));
  if (!firstChar) return null;

  const raw = getHanziDecomposition(firstChar) as {
    radical?: string;
    radicalMeaning?: string;
    strokes?: number;
    structure?: string;
    components?: Array<{ char?: string; pinyin?: string; meaning?: string }>;
    mnemonic?: string;
  } | null;

  if (!raw) {
    return {
      radical: firstChar,
      radical_meaning_vi: 'Bộ thủ gốc',
      stroke_count: 8,
      structure_type: '左右',
      components: [{ char: firstChar, pinyin: '', meaning_vi: 'Thành phần chính' }],
      mnemonic_vi: `Ghi nhớ mặt chữ "${firstChar}" qua bộ thủ và ngữ cảnh sử dụng.`,
    };
  }

  return {
    radical: raw.radical || firstChar,
    radical_meaning_vi: raw.radicalMeaning || 'Bộ thủ cấu tạo',
    stroke_count: Number(raw.strokes) || 8,
    structure_type: normalizeStructureType(raw.structure),
    components: Array.isArray(raw.components)
      ? raw.components.map((c) => ({
          char: c.char || '',
          pinyin: c.pinyin || '',
          meaning_vi: c.meaning || '',
        }))
      : [],
    mnemonic_vi:
      raw.mnemonic ||
      `Chữ "${firstChar}" kết hợp từ bộ "${raw.radical || firstChar}" (${raw.radicalMeaning || 'ý nghĩa gốc'}).`,
  };
}

function mapLegacyOrRawToEntry(raw: Record<string, unknown>): DictionaryEntry {
  const simplified = String(raw.simplified || raw.hanzi || '');
  const traditional = String(raw.traditional || simplified);
  const pinyinDisplay = String(raw.pinyin_display || raw.pinyin_tone || raw.pinyin || '');
  const pinyinNumeric = String(
    raw.pinyin_numeric || raw.pinyin_number || normalizeNumberedPinyin(pinyinDisplay)
  );
  const pinyinCleanStr = String(raw.pinyin_clean || cleanPinyin(pinyinDisplay || pinyinNumeric));
  const hanViet = String(raw.han_viet || raw.hanviet || '').toUpperCase();
  const hsk2 = raw.hsk_2_level != null ? Number(raw.hsk_2_level) : raw.hsk_level != null ? Number(raw.hsk_level) : raw.level != null ? Number(raw.level) : null;
  const hsk3 = raw.hsk_3_level != null ? Number(raw.hsk_3_level) : hsk2;

  let posMeanings: PosMeaningItem[] = [];
  if (Array.isArray(raw.pos_meanings) && raw.pos_meanings.length > 0) {
    posMeanings = raw.pos_meanings as PosMeaningItem[];
  } else {
    const meaningVi = String(raw.vietnamese_meaning || raw.meaning || '');
    const meaningEn = String(raw.english_meaning || '');
    posMeanings = [
      {
        pos: normalizePosTag(raw.part_of_speech || raw.pos),
        definitions_vi: meaningVi ? meaningVi.split(/[;|]/).map((s) => s.trim()).filter(Boolean) : [],
        definitions_en: meaningEn ? meaningEn.split(/[;|]/).map((s) => s.trim()).filter(Boolean) : [],
        collocations: Array.isArray(raw.collocations)
          ? (raw.collocations as PosMeaningItem['collocations'])
          : [],
      },
    ];
  }

  const examples: DictionaryExample[] = Array.isArray(raw.examples)
    ? (raw.examples as DictionaryExample[])
    : raw.example
    ? [
        {
          hanzi: String(raw.example),
          pinyin: String(raw.examplePinyin || ''),
          vi: String(raw.exampleMeaning || ''),
          hsk_level: hsk2 || 1,
        },
      ]
    : [];

  const measureWords: MeasureWordItem[] =
    Array.isArray(raw.measure_words) && raw.measure_words.length > 0
      ? (raw.measure_words as MeasureWordItem[])
      : COMMON_MEASURE_WORDS[simplified] || [];

  const synAnt: SynonymsAntonyms =
    raw.synonyms_antonyms && typeof raw.synonyms_antonyms === 'object'
      ? (raw.synonyms_antonyms as SynonymsAntonyms)
      : { synonyms: [], antonyms: [] };

  const decomposition =
    raw.decomposition && typeof raw.decomposition === 'object'
      ? (raw.decomposition as CharacterDecomposition)
      : buildDecompositionForHanzi(simplified);

  return {
    id: String(raw.id || `dict-${simplified}-${pinyinCleanStr}`),
    simplified,
    traditional,
    pinyin_display: pinyinDisplay,
    pinyin_numeric: pinyinNumeric,
    pinyin_clean: pinyinCleanStr,
    han_viet: hanViet,
    hsk_2_level: hsk2 && !Number.isNaN(hsk2) ? hsk2 : null,
    hsk_3_level: hsk3 && !Number.isNaN(hsk3) ? hsk3 : null,
    frequency_rank: Number(raw.frequency_rank) || 999999,
    pos_meanings: posMeanings,
    decomposition,
    measure_words: measureWords,
    synonyms_antonyms: synAnt,
    examples,
    source: (raw.source as DictionaryEntry['source']) || 'local',
    match_score: typeof raw.match_score === 'number' ? raw.match_score : undefined,
  };
}

/**
 * Segment a full Chinese sentence into known vocabulary tokens
 * using greedy longest-match against local vocabulary + cached entries.
 */
export function segmentSentenceIntoTokens(
  sentence: string,
  extraEntries: DictionaryEntry[] = []
): SentenceTokenResult[] {
  const text = (sentence || '').trim();
  if (!text) return [];

  const entryMap = new Map<string, DictionaryEntry>();
  for (const item of VOCABULARY_LIST) {
    if (item?.hanzi && !entryMap.has(item.hanzi)) {
      entryMap.set(item.hanzi, mapLegacyOrRawToEntry(item as unknown as Record<string, unknown>));
    }
  }
  for (const e of extraEntries) {
    if (e.simplified && !entryMap.has(e.simplified)) {
      entryMap.set(e.simplified, e);
    }
  }

  const chars = Array.from(text);
  const tokens: SentenceTokenResult[] = [];
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];
    if (!HANZI_REGEX.test(ch)) {
      i += 1;
      continue;
    }

    let matched: DictionaryEntry | null = null;
    let matchedLen = 1;
    const maxLen = Math.min(4, chars.length - i);

    for (let len = maxLen; len >= 1; len -= 1) {
      const slice = chars.slice(i, i + len).join('');
      const hit = entryMap.get(slice);
      if (hit) {
        matched = hit;
        matchedLen = len;
        break;
      }
    }

    const tokenText = chars.slice(i, i + matchedLen).join('');
    tokens.push({
      token: tokenText,
      entry: matched,
      isKnown: Boolean(matched),
    });
    i += matchedLen;
  }

  return tokens;
}

/**
 * Multimodal Dictionary Search:
 * - Tier 1: Instant Local Search + AI Cache
 * - Tier 2: Supabase RPC `search_dictionary_multimodal` (pg_trgm < 50ms)
 * - Deduplicates & ranks results.
 */
export async function searchDictionaryMultimodal(
  query: string,
  options: { hskFilter?: number | null; limit?: number } = {}
): Promise<DictionarySearchResult> {
  const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const trimmed = (query || '').trim();
  const inputType = detectSearchInputType(trimmed);
  const hskFilter = options.hskFilter ?? null;
  const limit = options.limit ?? 25;

  if (!trimmed) {
    return {
      query: '',
      inputType,
      entries: [],
      sentenceTokens: [],
      latencyMs: 0,
      usedAiFallback: false,
    };
  }

  // 1. Local search + AI local cache
  const aiCache = safeReadJson<Record<string, DictionaryEntry>>(AI_CACHE_STORAGE_KEY, {});
  const localRaw = searchLocalDictionary(trimmed, limit) as Array<Record<string, unknown>>;
  const localEntries = localRaw.map((item) => mapLegacyOrRawToEntry(item));

  const cachedMatches = Object.values(aiCache).filter((entry) => {
    const cleanQ = cleanVietnamese(trimmed);
    return (
      entry.simplified.includes(trimmed) ||
      entry.traditional.includes(trimmed) ||
      entry.pinyin_clean.includes(cleanPinyin(trimmed)) ||
      cleanVietnamese(entry.han_viet).includes(cleanQ) ||
      entry.pos_meanings.some((pm) =>
        pm.definitions_vi.some((d) => cleanVietnamese(d).includes(cleanQ))
      )
    );
  });

  // 2. Cloud search via Supabase RPC search_dictionary_multimodal
  let cloudEntries: DictionaryEntry[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.rpc('search_dictionary_multimodal', {
        query_text: trimmed,
        hsk_filter: hskFilter,
        limit_count: limit,
      });
      if (!error && Array.isArray(data)) {
        cloudEntries = data.map((row) =>
          mapLegacyOrRawToEntry({ ...(row as Record<string, unknown>), source: 'cedict' })
        );
      }
    } catch {
      // Fall back gracefully to local entries
    }
  }

  // 3. Merge & deduplicate by simplified + pinyin_clean
  const mergedMap = new Map<string, DictionaryEntry>();
  for (const entry of [...cloudEntries, ...cachedMatches, ...localEntries]) {
    if (
      hskFilter !== null &&
      entry.hsk_2_level !== hskFilter &&
      entry.hsk_3_level !== hskFilter
    ) {
      continue;
    }
    const key = `${entry.simplified}::${entry.pinyin_clean}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, entry);
    }
  }

  const entries = Array.from(mergedMap.values()).slice(0, limit);

  // 4. Sentence segmentation when pasting a multi-character Chinese sentence (>= 4 Hanzi)
  const hanziCount = Array.from(trimmed).filter((c) => HANZI_REGEX.test(c)).length;
  const sentenceTokens =
    inputType === 'hanzi' && hanziCount >= 4
      ? segmentSentenceIntoTokens(trimmed, entries)
      : [];

  const endedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
  return {
    query: trimmed,
    inputType,
    entries,
    sentenceTokens,
    latencyMs: Math.max(1, Math.round(endedAt - startedAt)),
    usedAiFallback: false,
  };
}

/**
 * AI Lexicographer Fallback:
 * Generates a structured DictionaryEntry via LLM when absent from DB/local,
 * then caches it in Supabase (`dictionary_entries`) + localStorage for instant future lookups.
 */
export async function fetchOrGenerateDictionaryEntry(
  query: string,
  user?: { id?: string | null } | null
): Promise<DictionaryEntry | null> {
  const trimmed = (query || '').trim();
  if (!trimmed) return null;

  const aiCache = safeReadJson<Record<string, DictionaryEntry>>(AI_CACHE_STORAGE_KEY, {});
  if (aiCache[trimmed]) {
    return aiCache[trimmed];
  }

  let generated: DictionaryEntry | null = null;

  try {
    const aiResponse = (await invokeAiPersonalization({
      taskType: 'dictionary_lexicographer',
      payload: {
        query: trimmed,
        schema: {
          simplified: 'string',
          traditional: 'string',
          pinyin_display: 'string',
          pinyin_numeric: 'string',
          han_viet: 'string',
          hsk_2_level: 'number | null',
          hsk_3_level: 'number | null',
          pos_meanings: 'PosMeaningItem[]',
          decomposition: 'CharacterDecomposition | null',
          measure_words: 'MeasureWordItem[]',
          synonyms_antonyms: 'SynonymsAntonyms',
          examples: 'DictionaryExample[]',
        },
      },
      user: user ?? null,
      cacheTtlMs: 3600000,
    })) as { entry?: Record<string, unknown>; data?: Record<string, unknown> } | null;

    const rawEntry = aiResponse?.entry || aiResponse?.data;
    if (rawEntry && rawEntry.simplified) {
      generated = mapLegacyOrRawToEntry({ ...rawEntry, source: 'ai_fallback' });
    }
  } catch {
    // Fallback to deterministic synthesis below
  }

  if (!generated && HANZI_REGEX.test(trimmed)) {
    generated = {
      id: `ai-${trimmed}-${Date.now()}`,
      simplified: trimmed,
      traditional: trimmed,
      pinyin_display: '',
      pinyin_numeric: '',
      pinyin_clean: '',
      han_viet: 'ĐANG CẬP NHẬT',
      hsk_2_level: null,
      hsk_3_level: null,
      frequency_rank: 50000,
      pos_meanings: [
        {
          pos: 'other',
          definitions_vi: [`Mục từ mở rộng cho "${trimmed}" (đã lưu bộ nhớ đệm AI)`],
          definitions_en: [`Extended entry for "${trimmed}"`],
          collocations: [],
        },
      ],
      decomposition: buildDecompositionForHanzi(trimmed),
      measure_words: COMMON_MEASURE_WORDS[trimmed] || [],
      synonyms_antonyms: { synonyms: [], antonyms: [] },
      examples: [
        {
          hanzi: `我们在网上经常看到“${trimmed}”这个词。`,
          pinyin: '',
          vi: `Chúng ta thường thấy từ "${trimmed}" trên mạng hoặc trong giao tiếp thực tế.`,
          hsk_level: 4,
        },
      ],
      source: 'ai_fallback',
    };
  }

  if (!generated) return null;

  aiCache[trimmed] = generated;
  aiCache[generated.simplified] = generated;
  safeWriteJson(AI_CACHE_STORAGE_KEY, aiCache);

  // Cache into Supabase dictionary_entries for instant future hits
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        simplified: generated.simplified,
        traditional: generated.traditional,
        pinyin_display: generated.pinyin_display,
        pinyin_numeric: generated.pinyin_numeric,
        pinyin_clean: generated.pinyin_clean,
        han_viet: generated.han_viet,
        hsk_2_level: generated.hsk_2_level,
        hsk_3_level: generated.hsk_3_level,
        frequency_rank: generated.frequency_rank,
        pos_meanings: generated.pos_meanings,
        decomposition: generated.decomposition,
        measure_words: generated.measure_words,
        synonyms_antonyms: generated.synonyms_antonyms,
        examples: generated.examples,
        source: 'ai_fallback',
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await supabase
        .from('dictionary_entries')
        .select('id')
        .eq('simplified', generated.simplified)
        .eq('source', 'ai_fallback')
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from('dictionary_entries')
          .update(payload)
          .eq('id', existing.id);
      } else {
        await supabase.from('dictionary_entries').insert(payload);
      }
    } catch {
      // Non-fatal if DB write is unavailable offline
    }
  }

  return generated;
}

export async function getRecentSearchHistory(
  user?: { id?: string | null } | null
): Promise<DictionaryHistoryItem[]> {
  const key = getUserScopedKey(HISTORY_STORAGE_KEY, user);
  const local = safeReadJson<DictionaryHistoryItem[]>(key, []);

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      const { data, error } = await supabase
        .from('user_dictionary_history')
        .select('query_text, simplified, pinyin_display, meaning_vi, searched_at')
        .eq('user_id', user.id)
        .order('searched_at', { ascending: false })
        .limit(12);
      if (!error && Array.isArray(data) && data.length > 0) {
        safeWriteJson(key, data as DictionaryHistoryItem[]);
        return data as DictionaryHistoryItem[];
      }
    } catch {
      // fallback to local
    }
  }

  return local;
}

export async function saveSearchHistory(
  query: string,
  entry?: DictionaryEntry | null,
  user?: { id?: string | null } | null
): Promise<DictionaryHistoryItem[]> {
  const trimmed = (query || '').trim();
  if (!trimmed) return getRecentSearchHistory(user);

  const key = getUserScopedKey(HISTORY_STORAGE_KEY, user);
  const existing = safeReadJson<DictionaryHistoryItem[]>(key, []);
  const firstMeaning = entry?.pos_meanings?.[0]?.definitions_vi?.[0] || '';

  const newItem: DictionaryHistoryItem = {
    query_text: trimmed,
    simplified: entry?.simplified || trimmed,
    pinyin_display: entry?.pinyin_display || '',
    meaning_vi: firstMeaning,
    searched_at: new Date().toISOString(),
  };

  const updated = [
    newItem,
    ...existing.filter((item) => item.query_text !== trimmed),
  ].slice(0, 12);

  safeWriteJson(key, updated);

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_dictionary_history').upsert(
        {
          user_id: user.id,
          query_text: newItem.query_text,
          simplified: newItem.simplified,
          pinyin_display: newItem.pinyin_display,
          meaning_vi: newItem.meaning_vi,
          searched_at: newItem.searched_at,
        },
        { onConflict: 'user_id,query_text' }
      );
    } catch {
      // ignore remote sync error
    }
  }

  return updated;
}

export function getSavedDeckWords(user?: { id?: string | null } | null): string[] {
  const key = getUserScopedKey(SAVED_DECK_STORAGE_KEY, user);
  const items = safeReadJson<Array<{ simplified: string }>>(key, []);
  return items.map((i) => i.simplified);
}

export async function saveWordToDeck(
  entry: DictionaryEntry,
  user?: { id?: string | null } | null
): Promise<{ saved: boolean; totalSaved: number }> {
  const key = getUserScopedKey(SAVED_DECK_STORAGE_KEY, user);
  const existing = safeReadJson<Array<Record<string, unknown>>>(key, []);
  const alreadyExists = existing.some((item) => item.simplified === entry.simplified);
  const firstMeaning = entry.pos_meanings?.[0]?.definitions_vi?.[0] || '';

  const next = alreadyExists
    ? existing
    : [
        {
          simplified: entry.simplified,
          traditional: entry.traditional,
          pinyin_display: entry.pinyin_display,
          han_viet: entry.han_viet,
          meaning_vi: firstMeaning,
          hsk_level: entry.hsk_2_level || entry.hsk_3_level || 1,
          saved_at: new Date().toISOString(),
        },
        ...existing,
      ];

  safeWriteJson(key, next);

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_saved_vocabulary').upsert(
        {
          user_id: user.id,
          simplified: entry.simplified,
          traditional: entry.traditional,
          pinyin_display: entry.pinyin_display,
          han_viet: entry.han_viet,
          meaning_vi: firstMeaning,
          hsk_level: entry.hsk_2_level || entry.hsk_3_level || 1,
          saved_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,simplified' }
      );
    } catch {
      // non-fatal
    }
  }

  return { saved: true, totalSaved: next.length };
}

