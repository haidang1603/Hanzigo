import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { VOCABULARY_LIST } from '../data/chineseData.js';
import { HSK79_VOCAB_GLOSSARY } from '../features/curriculum/hsk79VocabGlossary.js';

export const HSK_30_TOTAL_VOCAB_COUNT = 11000;

export const HSK_30_BANDS = {
  all: { id: 'all', label: 'Tất cả HSK 3.0', stage: '9 cấp độ', offset: 0, limit: 11000, cumulative: 11000 },
  'HSK 1': { id: 'HSK 1', label: 'HSK 1', stage: 'Sơ cấp', offset: 0, limit: 300, cumulative: 300 },
  'HSK 2': { id: 'HSK 2', label: 'HSK 2', stage: 'Sơ cấp', offset: 300, limit: 200, cumulative: 500 },
  'HSK 3': { id: 'HSK 3', label: 'HSK 3', stage: 'Sơ cấp', offset: 500, limit: 500, cumulative: 1000 },
  'HSK 4': { id: 'HSK 4', label: 'HSK 4', stage: 'Trung cấp', offset: 1000, limit: 1000, cumulative: 2000 },
  'HSK 5': { id: 'HSK 5', label: 'HSK 5', stage: 'Trung cấp', offset: 2000, limit: 1600, cumulative: 3600 },
  'HSK 6': { id: 'HSK 6', label: 'HSK 6', stage: 'Trung cấp', offset: 3600, limit: 1800, cumulative: 5400 },
  'HSK 7-9': { id: 'HSK 7-9', label: 'HSK 7–9', stage: 'Cao cấp', offset: 5400, limit: 5600, cumulative: 11000 },
};

const PURE_CJK_REGEX = /^[\u4e00-\u9fff]+$/;

function isPureCjkWord(word) {
  return PURE_CJK_REGEX.test(String(word || '').trim());
}

function inferBandFromGlobalRank(globalIdx) {
  if (globalIdx < 300) return 'HSK 1';
  if (globalIdx < 500) return 'HSK 2';
  if (globalIdx < 1000) return 'HSK 3';
  if (globalIdx < 2000) return 'HSK 4';
  if (globalIdx < 3600) return 'HSK 5';
  if (globalIdx < 5400) return 'HSK 6';
  return 'HSK 7-9';
}

export function getLocalHsk79Flashcards() {
  const entries = Object.entries(HSK79_VOCAB_GLOSSARY || {});
  return entries.map(([hanzi, entry], idx) => {
    const exampleText = entry.collocations?.[0] || hanzi;
    const exampleMeaning = entry.synonymComparison || entry.meaning || '';
    return {
      id: `hsk79-${idx + 1}-${hanzi}`,
      hanzi,
      traditional: hanzi,
      pinyin: entry.pinyin || '',
      hanviet: entry.hanViet || '',
      meaning: entry.meaning || '',
      pos: entry.pos || 'Từ vựng cao cấp',
      level: 'HSK 7-9',
      topic: 'Học thuật & Thành ngữ',
      example: {
        hanzi: exampleText,
        zh: exampleText,
        pinyin: '',
        meaning: exampleMeaning,
        vi: exampleMeaning,
      },
      isHsk30Curated: true,
    };
  });
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

export function normalizeDictionaryRowToFlashcard(row, globalIdx, targetBandId = 'all') {
  const rawLevel = row.hsk_level ? String(row.hsk_level).trim() : '';
  const hasExplicitHsk = /^HSK\s+[1-9]/.test(rawLevel);
  const inferredLevel = hasExplicitHsk ? rawLevel : inferBandFromGlobalRank(globalIdx);

  // Chặn trộn nhầm cấp HSK khi bản ghi cloud có gắn cấp rõ ràng khác band đang lọc
  if (targetBandId !== 'all' && hasExplicitHsk) {
    const matchesTarget =
      inferredLevel === targetBandId ||
      (targetBandId === 'HSK 7-9' && /^HSK\s+[789]/.test(inferredLevel));
    if (!matchesTarget) return null;
  }

  const rawVi = String(row.vietnamese_meaning || '').trim();
  const rawEn = String(row.english_meanings || '').trim();
  const hasRealVietnamese = Boolean(rawVi && rawVi !== rawEn);
  if (!hasRealVietnamese) {
    // Bỏ qua bản ghi chỉ có tiếng Anh thô để tránh hiển thị tiếng Anh lên thẻ Flashcard
    return null;
  }

  const hanViet = String(row.hanviet || row.han_viet || '').trim();

  return {
    id: `hsk30-${row.id}`,
    hanzi: row.simplified,
    traditional: row.traditional || row.simplified,
    pinyin: row.pinyin_tone || row.pinyin_display || '',
    hanviet: hanViet,
    meaning: rawVi,
    meaningEn: rawEn,
    pos: row.pos || 'Từ vựng',
    level: inferredLevel,
    topic: 'Học thuật & Thành ngữ',
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
        const curatedHanziSet = new Set(curatedPool.map((c) => c.hanzi));
        const seenCloud = new Set();
        const cloudCards = data
          .filter((r) => isPureCjkWord(r.simplified) && !curatedHanziSet.has(r.simplified) && !seenCloud.has(r.simplified))
          .map((row, i) => {
            seenCloud.add(row.simplified);
            return normalizeDictionaryRowToFlashcard(row, cloudOffset + i, band.id);
          })
          .filter(Boolean)
          .slice(0, needed);
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
          const curatedHanziSet = new Set(curatedPool.map((c) => c.hanzi));
          const seenCloud = new Set();
          const cloudCards = data
            .filter((r) => isPureCjkWord(r.simplified) && !curatedHanziSet.has(r.simplified) && !seenCloud.has(r.simplified))
            .map((row, i) => {
              seenCloud.add(row.simplified);
              return normalizeDictionaryRowToFlashcard(row, sliceStart + i, band.id);
            })
            .filter(Boolean)
            .slice(0, needed);
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
