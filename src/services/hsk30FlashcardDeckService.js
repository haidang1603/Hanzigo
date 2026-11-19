import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { VOCABULARY_LIST } from '../data/chineseData.js';
import { HSK79_VOCAB_GLOSSARY } from '../features/curriculum/hsk79VocabGlossary.js';

export const HSK_30_TOTAL_VOCAB_COUNT = 11092;

export const HSK_30_BANDS = {
  all: { id: 'all', label: 'Tất cả HSK 3.0', offset: 0, limit: 11092 },
  'HSK 1': { id: 'HSK 1', label: 'HSK 1', offset: 0, limit: 500 },
  'HSK 2': { id: 'HSK 2', label: 'HSK 2', offset: 500, limit: 772 },
  'HSK 3': { id: 'HSK 3', label: 'HSK 3', offset: 1272, limit: 973 },
  'HSK 4': { id: 'HSK 4', label: 'HSK 4', offset: 2245, limit: 1000 },
  'HSK 5': { id: 'HSK 5', label: 'HSK 5', offset: 3245, limit: 1071 },
  'HSK 6': { id: 'HSK 6', label: 'HSK 6', offset: 4316, limit: 1140 },
  'HSK 7-9': { id: 'HSK 7-9', label: 'HSK 7–9', offset: 5456, limit: 5636 },
};

const PURE_CJK_REGEX = /^[\u4e00-\u9fff]+$/;

function isPureCjkWord(word) {
  return PURE_CJK_REGEX.test(String(word || '').trim());
}

function inferBandFromGlobalRank(globalIdx) {
  if (globalIdx < 500) return 'HSK 1';
  if (globalIdx < 1272) return 'HSK 2';
  if (globalIdx < 2245) return 'HSK 3';
  if (globalIdx < 3245) return 'HSK 4';
  if (globalIdx < 4316) return 'HSK 5';
  if (globalIdx < 5456) return 'HSK 6';
  return 'HSK 7-9';
}

export function getLocalHsk79Flashcards() {
  const entries = Object.entries(HSK79_VOCAB_GLOSSARY || {});
  return entries.map(([hanzi, entry], idx) => ({
    id: `hsk79-${idx + 1}-${hanzi}`,
    hanzi,
    traditional: hanzi,
    pinyin: entry.pinyin || '',
    hanviet: entry.hanViet || '',
    meaning: entry.meaning || '',
    pos: entry.pos || 'Từ vựng cao cấp',
    level: 'HSK 7-9',
    topic: 'HSK 3.0 Cao cấp (7–9)',
    example: entry.collocations?.[0]
      ? {
          zh: entry.collocations[0],
          pinyin: entry.pinyin || '',
          vi: entry.synonymComparison || entry.meaning || '',
        }
      : null,
    isHsk30Curated: true,
  }));
}

function getCuratedVietnamesePool(bandId = 'all') {
  const baseVocabList = VOCABULARY_LIST.map((v, idx) => ({
    id: v.id || `local-${idx + 1}`,
    hanzi: v.hanzi,
    traditional: v.traditional || v.hanzi,
    pinyin: v.pinyin || '',
    hanviet: v.hanviet || '',
    meaning: v.meaning || '',
    pos: v.pos || 'Từ vựng',
    level: v.level || 'HSK 1',
    topic: v.topic || 'Giáo trình chuẩn',
    radical: v.radical || '—',
    strokes: v.strokes,
    mnemonic: v.mnemonic,
    example: v.example || null,
  }));
  const baseHanziSet = new Set(baseVocabList.map((item) => item.hanzi));
  // Loại bỏ 45 từ đã nằm trong VOCABULARY_LIST (HSK 1–6) để tránh ghi đè cấp độ khi gộp kho HSK 7–9
  const hsk79Local = getLocalHsk79Flashcards().filter((item) => !baseHanziSet.has(item.hanzi));
  const basePool = [...baseVocabList, ...hsk79Local];

  const deduped = Array.from(
    new Map(basePool.filter((it) => isPureCjkWord(it.hanzi)).map((it) => [it.hanzi, it])).values()
  );

  if (bandId === 'all') return deduped;
  return deduped.filter(
    (item) =>
      item.level === bandId ||
      (bandId === 'HSK 7-9' && /^HSK\s+[789]/.test(item.level || ''))
  );
}

function normalizeDictionaryRowToFlashcard(row, globalIdx) {
  const inferredLevel =
    row.hsk_level && /^HSK\s+[1-9]/.test(String(row.hsk_level))
      ? String(row.hsk_level)
      : inferBandFromGlobalRank(globalIdx);

  const rawVi = String(row.vietnamese_meaning || '').trim();
  const rawEn = String(row.english_meanings || '').trim();
  const hasRealVietnamese = Boolean(rawVi && rawVi !== rawEn);
  const hanViet = String(row.hanviet || row.han_viet || '').trim();

  return {
    id: `hsk30-${row.id}`,
    hanzi: row.simplified,
    traditional: row.traditional || row.simplified,
    pinyin: row.pinyin_tone || row.pinyin_display || '',
    hanviet: hanViet,
    meaning: hasRealVietnamese ? rawVi : rawEn || 'Từ vựng HSK 3.0',
    meaningEn: rawEn,
    pos: row.pos || 'Từ vựng',
    level: inferredLevel,
    topic: 'Kho chuẩn HSK 3.0 (11.092 từ)',
    example: null,
    isHsk30Corpus: true,
  };
}

export async function fetchHsk30FlashcardBatch({
  hskBand = 'all',
  page = 1,
  pageSize = 50,
  searchQuery = '',
} = {}) {
  const band = HSK_30_BANDS[hskBand] || HSK_30_BANDS.all;
  const safePageSize = Math.min(100, Math.max(10, Number(pageSize) || 50));
  const safePage = Math.max(1, Number(page) || 1);
  const cleanSearch = String(searchQuery || '').trim();

  // 1. Luôn ưu tiên kho từ vựng tiếng Việt đã biên soạn chuẩn (HSK 1-9) ở các lô đầu
  const curatedPool = getCuratedVietnamesePool(band.id);
  const curatedFiltered = cleanSearch
    ? curatedPool.filter((item) => {
        const q = cleanSearch.toLowerCase();
        return (
          String(item.hanzi || '').toLowerCase().includes(q) ||
          String(item.pinyin || '').toLowerCase().includes(q) ||
          String(item.meaning || '').toLowerCase().includes(q) ||
          String(item.hanviet || '').toLowerCase().includes(q)
        );
      })
    : curatedPool;

  const fromIdx = (safePage - 1) * safePageSize;
  const curatedSlice = curatedFiltered.slice(fromIdx, fromIdx + safePageSize);

  // Nếu lô hiện tại nằm hoàn toàn trong kho tiếng Việt chuẩn, trả về ngay (không dính từ rác kiểu "110")
  if (curatedSlice.length >= safePageSize || (!isSupabaseConfigured || !supabase)) {
    const total = cleanSearch
      ? curatedFiltered.length
      : isSupabaseConfigured && supabase
      ? band.limit
      : curatedFiltered.length;
    return {
      source: 'curated_hsk30_vietnamese',
      entries: curatedSlice,
      totalCount: total,
      totalPages: Math.max(1, Math.ceil(total / safePageSize)),
      page: safePage,
    };
  }

  // 2. Bổ sung phần còn lại từ Supabase dictionary_entries (chỉ lấy chữ Hán thuần, lọc bỏ số/ASCII như "110")
  try {
    const needed = safePageSize - curatedSlice.length;
    const cloudOffset = Math.max(0, fromIdx - curatedFiltered.length);

    if (cleanSearch) {
      const pattern = `%${cleanSearch}%`;
      const { data, count, error } = await supabase
        .from('dictionary_entries')
        .select(
          'id, simplified, traditional, pinyin_tone, hanviet, han_viet, pos, vietnamese_meaning, english_meanings, hsk_level, frequency_rank',
          { count: 'exact' }
        )
        .or(
          `simplified.ilike.${pattern},pinyin_clean.ilike.${pattern},vietnamese_meaning.ilike.${pattern},english_meanings.ilike.${pattern}`
        )
        .order('frequency_rank', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true })
        .range(cloudOffset, cloudOffset + needed + 25);

      if (!error && Array.isArray(data)) {
        const cleanRows = data.filter((r) => isPureCjkWord(r.simplified)).slice(0, needed);
        const cloudCards = cleanRows.map((row, i) =>
          normalizeDictionaryRowToFlashcard(row, cloudOffset + i)
        );
        const total = Math.min(band.limit, curatedFiltered.length + Number(count || cloudCards.length));
        return {
          source: 'supabase_hsk30_corpus',
          entries: [...curatedSlice, ...cloudCards],
          totalCount: total,
          totalPages: Math.max(1, Math.ceil(total / safePageSize)),
          page: safePage,
        };
      }
    } else {
      const sliceStart = band.offset + cloudOffset;
      const sliceEnd = Math.min(band.offset + band.limit - 1, sliceStart + needed + 30);

      if (sliceStart <= sliceEnd) {
        const { data, error } = await supabase
          .from('dictionary_entries')
          .select(
            'id, simplified, traditional, pinyin_tone, hanviet, han_viet, pos, vietnamese_meaning, english_meanings, hsk_level, frequency_rank'
          )
          .order('frequency_rank', { ascending: true, nullsFirst: false })
          .order('id', { ascending: true })
          .range(sliceStart, sliceEnd);

        if (!error && Array.isArray(data) && data.length > 0) {
          const cleanRows = data.filter((r) => isPureCjkWord(r.simplified)).slice(0, needed);
          const cloudCards = cleanRows.map((row, i) =>
            normalizeDictionaryRowToFlashcard(row, sliceStart + i)
          );
          return {
            source: 'supabase_hsk30_corpus',
            entries: [...curatedSlice, ...cloudCards],
            totalCount: band.limit,
            totalPages: Math.max(1, Math.ceil(band.limit / safePageSize)),
            page: safePage,
          };
        }
      }
    }
  } catch {
    // Fallback to curated pool below
  }

  return {
    source: 'local_hsk30_fallback',
    entries: curatedSlice,
    totalCount: curatedFiltered.length,
    totalPages: Math.max(1, Math.ceil(curatedFiltered.length / safePageSize)),
    page: safePage,
  };
}
