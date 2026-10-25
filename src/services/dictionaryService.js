/**
 * =========================================================================
 * HANZIGO — HYBRID DICTIONARY SERVICE (PHASE 10)
 * =========================================================================
 * Bộ tra cứu từ điển thông minh 2 tầng:
 * - Tầng 1: Instant Local Search (0ms) - Tra cứu tức thì trong 500 từ cốt lõi
 *   + 120 bài học giáo trình + 600 chữ Hán thường gặp.
 * - Tầng 2: Cloud Trigram Search (Debounced 250ms) - Truy vấn bảng 120.000 từ
 *   CC-CEDICT trên Supabase PostgreSQL thông qua RPC search_dictionary (pg_trgm).
 * - Tầng 3: Hybrid Deduplication & Smart Ranking - Kết hợp, loại trùng lặp
 *   và xếp hạng theo độ tương đồng chính xác.
 * =========================================================================
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { EXTENDED_COMMON_CHARS } from '../data/commonCharactersDict.js';
import { getHanziDecomposition } from '../data/hanziDecomposition.js';
import { supabase, isSupabaseConfigured } from '../supabase/config.js';

/**
 * Loại bỏ dấu thanh điệu Pinyin (ā, á, ǎ, à, ü -> a, a, a, a, v/u)
 */
export function cleanPinyin(pinyinStr) {
  if (!pinyinStr || typeof pinyinStr !== 'string') return '';
  return pinyinStr
    .toLowerCase()
    .replace(/[üǖǘǚǜ]/g, 'v')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[0-9]/g, '') // Bỏ số chỉ thanh (xue2 -> xue)
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Chuẩn hóa Pinyin có số (xue2 xi2 -> xuexi, ni3 hao3 -> nihao)
 */
export function normalizeNumberedPinyin(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[1-5]/g, '').replace(/\s+/g, '').toLowerCase().trim();
}

/**
 * Loại bỏ dấu tiếng Việt (học tập -> hoc tap)
 */
export function cleanVietnamese(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * TẦNG 1: Tra cứu từ điển nội bộ tức thời (Instant Local Search - 0ms)
 * 
 * @param {string} query - Chuỗi tìm kiếm (chữ Hán, Pinyin, Hán-Việt, Tiếng Việt, Tiếng Anh)
 * @param {number} limit - Giới hạn số lượng kết quả trả về
 * @returns {Array} Danh sách kết quả xếp hạng
 */
export function searchLocalDictionary(query, limit = 25) {
  if (!query || typeof query !== 'string') return [];
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  const isHanziQuery = /[\u4e00-\u9fa5]/.test(cleanQ);
  const cleanPinyinQ = cleanPinyin(cleanQ);
  const cleanVnQ = cleanVietnamese(cleanQ);

  const results = [];
  const seenHanzi = new Set();

  // 1. Quét VOCABULARY_LIST (500+ từ cốt lõi HanziGo)
  for (const item of VOCABULARY_LIST) {
    if (!item || !item.hanzi || seenHanzi.has(item.hanzi)) continue;

    let score = 0;
    const itemHanzi = item.hanzi;
    const itemPinyin = (item.pinyin || '').toLowerCase();
    const itemPinyinClean = cleanPinyin(itemPinyin);
    const itemHanviet = cleanVietnamese(item.hanviet || '');
    const itemMeaning = cleanVietnamese(item.meaning || '');

    // Khớp Chữ Hán
    if (isHanziQuery) {
      if (itemHanzi === cleanQ || (item.traditional && item.traditional === cleanQ)) score = 100;
      else if (itemHanzi.startsWith(cleanQ)) score = 80;
      else if (itemHanzi.includes(cleanQ)) score = 60;
    }

    // Khớp Pinyin
    if (!score && cleanPinyinQ) {
      if (itemPinyinClean === cleanPinyinQ) score = 90;
      else if (itemPinyin === cleanQ) score = 88;
      else if (itemPinyinClean.startsWith(cleanPinyinQ)) score = 70;
      else if (itemPinyinClean.includes(cleanPinyinQ)) score = 50;
    }

    // Khớp Hán-Việt
    if (!score && cleanVnQ && itemHanviet) {
      if (itemHanviet === cleanVnQ) score = 85;
      else if (itemHanviet.startsWith(cleanVnQ)) score = 65;
      else if (itemHanviet.includes(cleanVnQ)) score = 45;
    }

    // Khớp Nghĩa tiếng Việt
    if (!score && cleanVnQ && itemMeaning) {
      if (itemMeaning === cleanVnQ) score = 75;
      else if (itemMeaning.includes(cleanVnQ)) score = 40;
    }

    if (score > 0) {
      seenHanzi.add(itemHanzi);
      const decomp = getHanziDecomposition(itemHanzi);
      results.push({
        id: `local-vocab-${itemHanzi}`,
        hanzi: itemHanzi,
        simplified: itemHanzi,
        traditional: item.traditional || itemHanzi,
        pinyin: item.pinyin || '',
        pinyinClean: itemPinyinClean,
        hanviet: item.hanviet || '',
        meaningVi: item.meaning || '',
        meaningEn: item.meaningEn || '',
        level: item.level || 'HSK 1',
        topic: item.topic || 'Chung',
        radical: item.radical || '',
        strokes: item.strokes || 5,
        mnemonic: item.mnemonic || '',
        decomposition: decomp,
        matchScore: score,
        source: 'local'
      });
    }
  }

  // 2. Quét EXTENDED_COMMON_CHARS (600+ chữ Hán đơn)
  for (const [char, meta] of Object.entries(EXTENDED_COMMON_CHARS)) {
    if (seenHanzi.has(char)) continue;

    let score = 0;
    const charPinyinClean = cleanPinyin(meta.pinyin);
    const charHanvietClean = cleanVietnamese(meta.hanviet);
    const charMeaningClean = cleanVietnamese(meta.meaning);

    if (isHanziQuery) {
      if (char === cleanQ || (meta.traditional && meta.traditional === cleanQ)) score = 100;
      else if (char.includes(cleanQ)) score = 55;
    }

    if (!score && cleanPinyinQ) {
      if (charPinyinClean === cleanPinyinQ) score = 90;
      else if (charPinyinClean.startsWith(cleanPinyinQ)) score = 65;
    }

    if (!score && cleanVnQ && charHanvietClean) {
      if (charHanvietClean === cleanVnQ) score = 85;
      else if (charHanvietClean.includes(cleanVnQ)) score = 40;
    }

    if (!score && cleanVnQ && charMeaningClean) {
      if (charMeaningClean.includes(cleanVnQ)) score = 35;
    }

    if (score > 0) {
      seenHanzi.add(char);
      const decomp = getHanziDecomposition(char);
      results.push({
        id: `local-char-${char}`,
        hanzi: char,
        simplified: char,
        traditional: meta.traditional || char,
        pinyin: meta.pinyin || '',
        pinyinClean: charPinyinClean,
        hanviet: meta.hanviet || '',
        meaningVi: meta.meaning || '',
        meaningEn: meta.meaningEn || '',
        level: meta.level ? `HSK ${meta.level}` : 'HSK 1',
        topic: 'Chữ Hán cốt lõi',
        radical: meta.radical || '',
        strokes: meta.strokes || 5,
        mnemonic: meta.mnemonic || '',
        decomposition: decomp,
        matchScore: score,
        source: 'local'
      });
    }
  }

  // Sắp xếp theo matchScore giảm dần, độ dài từ tăng dần
  return results
    .sort((a, b) => b.matchScore - a.matchScore || a.hanzi.length - b.hanzi.length)
    .slice(0, limit);
}

/**
 * TẦNG 2: Tra cứu từ điển mở rộng trên Supabase PostgreSQL (Cloud Trigram Search - 250ms)
 * 
 * @param {string} query - Chuỗi tìm kiếm
 * @param {number} limit - Giới hạn kết quả
 * @returns {Promise<Array>} Danh sách kết quả từ bảng dictionary_entries
 */
export async function searchCloudDictionary(query, limit = 25) {
  if (!query || typeof query !== 'string') return [];
  const cleanQ = query.trim();
  if (!cleanQ || !isSupabaseConfigured || !supabase) return [];

  try {
    // Gọi RPC search_dictionary được tối ưu GIN Trigram
    const { data, error } = await supabase.rpc('search_dictionary', {
      search_query: cleanQ,
      result_limit: limit
    });

    if (error) {
      console.warn('[DictionaryService] RPC search_dictionary notice:', error.message);
      return [];
    }

    if (!Array.isArray(data)) return [];

    return data.map(item => {
      const hanzi = item.simplified || item.traditional;
      const decomp = getHanziDecomposition(hanzi);
      return {
        id: `cloud-${item.id}`,
        hanzi,
        simplified: item.simplified,
        traditional: item.traditional,
        pinyin: item.pinyin_tone || item.pinyin_clean || '',
        pinyinClean: item.pinyin_clean,
        hanviet: item.hanviet || '',
        meaningVi: item.vietnamese_meaning || '',
        meaningEn: item.english_meanings || '',
        level: item.hsk_level ? (item.hsk_level.startsWith('HSK') ? item.hsk_level : `HSK ${item.hsk_level}`) : 'HSK 1',
        topic: 'Từ điển mở rộng CC-CEDICT',
        radical: '',
        strokes: 0,
        mnemonic: '',
        decomposition: decomp,
        matchScore: item.match_score || 30,
        source: 'cloud'
      };
    });
  } catch (err) {
    console.warn('[DictionaryService] Cloud search fallback notice:', err.message);
    return [];
  }
}

/**
 * TẦNG 3: Hybrid Search - Kết hợp Local 0ms và Cloud Supabase với khử trùng lặp
 * 
 * @param {string} query - Chuỗi tìm kiếm
 * @param {Object} options - Tùy chọn tìm kiếm
 * @returns {Promise<Array>} Danh sách kết quả hợp nhất
 */
export async function searchDictionaryHybrid(query, options = {}) {
  const limit = options.limit || 25;
  if (!query || typeof query !== 'string' || !query.trim()) return [];

  // 1. Lấy kết quả Tầng 1 (Local 0ms)
  const localResults = searchLocalDictionary(query, limit);

  // Nếu không có kết nối Supabase hoặc đã đủ kết quả hoàn hảo
  if (!isSupabaseConfigured || !supabase) {
    return localResults;
  }

  // 2. Lấy kết quả Tầng 2 (Cloud Trigram Search)
  try {
    const cloudResults = await searchCloudDictionary(query, limit);
    if (!cloudResults || cloudResults.length === 0) {
      return localResults;
    }

    // 3. Khử trùng lặp (Deduplicate) dựa trên chữ Hán
    const seenHanzi = new Set(localResults.map(item => item.hanzi));
    const merged = [...localResults];

    for (const cloudItem of cloudResults) {
      if (!seenHanzi.has(cloudItem.hanzi)) {
        seenHanzi.add(cloudItem.hanzi);
        merged.push(cloudItem);
      }
    }

    // Sắp xếp lại theo điểm matchScore và độ dài từ
    return merged
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0) || a.hanzi.length - b.hanzi.length)
      .slice(0, limit);
  } catch {
    return localResults;
  }
}

/**
 * TẦNG 4: Tra cứu Phân trang Quy mô lớn (Phase 16 Paginated Large-Scale Dictionary Search)
 * Tránh tải 120.000 bản ghi vào RAM trình duyệt cùng lúc. Hỗ trợ Server-side pagination.
 * 
 * @param {Object} params - Tham số tra cứu và phân trang
 * @returns {Promise<Object>} { entries, totalCount, page, pageSize, totalPages, source }
 */
export async function searchDictionaryPaginated({
  query = '',
  hskLevel = 'ALL',
  page = 1,
  pageSize = 25
} = {}) {
  const cleanQ = (query || '').trim();
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safePageSize = Math.min(100, Math.max(5, parseInt(pageSize, 10) || 25));
  const offset = (safePage - 1) * safePageSize;

  // 1. Thử gọi RPC search_dictionary_paginated trên Supabase (nếu có cấu hình)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.rpc('search_dictionary_paginated', {
        p_query: cleanQ,
        p_hsk: hskLevel,
        p_page: safePage,
        p_page_size: safePageSize
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        const totalCount = parseInt(data[0].total_count, 10) || data.length;
        const entries = data.map(item => {
          const hanzi = item.simplified || item.traditional;
          const decomp = getHanziDecomposition(hanzi);
          return {
            id: `cloud-${item.id}`,
            hanzi,
            simplified: item.simplified,
            traditional: item.traditional,
            pinyin: item.pinyin_tone || item.pinyin_clean || '',
            pinyinTone: item.pinyin_tone,
            pinyinNumber: item.pinyin_number,
            pinyinClean: item.pinyin_clean,
            hanviet: item.hanviet || '',
            meaningVi: item.vietnamese_meaning || '',
            meaningEn: item.english_meanings || '',
            definitions: Array.isArray(item.definitions) ? item.definitions : (item.english_meanings ? item.english_meanings.split('; ') : []),
            examples: Array.isArray(item.examples) ? item.examples : [],
            pos: item.pos || '',
            level: item.hsk_level || '',
            topic: item.hsk_level ? `HSK Chuẩn (${item.hsk_level})` : 'CC-CEDICT 120.000 từ',
            frequencyRank: item.frequency_rank || 999999,
            sourceId: item.source_id || 'cc_cedict',
            sourceLicense: item.source_license || 'CC BY-SA 4.0',
            qualityStatus: item.quality_status || (item.vietnamese_meaning ? 'verified_human' : 'community_standard'),
            decomposition: decomp,
            matchScore: item.match_score || 10,
            source: 'cloud'
          };
        });

        return {
          entries,
          totalCount,
          page: safePage,
          pageSize: safePageSize,
          totalPages: Math.ceil(totalCount / safePageSize),
          source: 'cloud_rpc'
        };
      }

      // 2. Fallback sang query bảng dictionary_entries trực tiếp
      let dbQuery = supabase
        .from('dictionary_entries')
        .select('*', { count: 'exact' });

      if (hskLevel && hskLevel !== 'ALL') {
        if (hskLevel === 'HSK 5-6') {
          dbQuery = dbQuery.in('hsk_level', ['HSK 5', 'HSK 6', 'HSK 5-6']);
        } else {
          dbQuery = dbQuery.eq('hsk_level', hskLevel);
        }
      }

      if (cleanQ) {
        dbQuery = dbQuery.or(`simplified.eq.${cleanQ},traditional.eq.${cleanQ},pinyin_clean.ilike.${cleanQ}%,simplified.ilike.${cleanQ}%,vietnamese_meaning.ilike.%${cleanQ}%,english_meanings.ilike.%${cleanQ}%`);
      }

      dbQuery = dbQuery
        .order('frequency_rank', { ascending: true })
        .range(offset, offset + safePageSize - 1);

      const { data: rawRows, count: totalDbCount, error: dbErr } = await dbQuery;

      if (!dbErr && Array.isArray(rawRows)) {
        const total = totalDbCount || rawRows.length;
        const entries = rawRows.map(item => {
          const hanzi = item.simplified || item.traditional;
          return {
            id: `cloud-${item.id}`,
            hanzi,
            simplified: item.simplified,
            traditional: item.traditional,
            pinyin: item.pinyin_tone || item.pinyin_clean || '',
            pinyinTone: item.pinyin_tone,
            pinyinNumber: item.pinyin_number,
            pinyinClean: item.pinyin_clean,
            hanviet: item.hanviet || '',
            meaningVi: item.vietnamese_meaning || '',
            meaningEn: item.english_meanings || '',
            definitions: Array.isArray(item.definitions) ? item.definitions : (item.english_meanings ? item.english_meanings.split('; ') : []),
            examples: Array.isArray(item.examples) ? item.examples : [],
            pos: item.pos || '',
            level: item.hsk_level || '',
            topic: item.hsk_level ? `HSK Chuẩn (${item.hsk_level})` : 'CC-CEDICT 120.000 từ',
            frequencyRank: item.frequency_rank || 999999,
            sourceId: item.source_id || 'cc_cedict',
            sourceLicense: item.source_license || 'CC BY-SA 4.0',
            qualityStatus: item.quality_status || (item.vietnamese_meaning ? 'verified_human' : 'community_standard'),
            decomposition: getHanziDecomposition(hanzi),
            matchScore: 30,
            source: 'cloud_table'
          };
        });

        return {
          entries,
          totalCount: total,
          page: safePage,
          pageSize: safePageSize,
          totalPages: Math.ceil(total / safePageSize),
          source: 'cloud_table'
        };
      }
    } catch (cloudErr) {
      console.warn('[DictionaryService] Paginated cloud search fallback:', cloudErr.message);
    }
  }

  // 3. Fallback Tầng 1: Tra cứu cục bộ (Local Offline Fallback 0ms)
  let localPool = searchLocalDictionary(cleanQ || ' ', 500);
  if (!cleanQ) {
    // Nếu không có từ khóa tìm kiếm, hiển thị danh mục gốc
    localPool = VOCABULARY_LIST.map(item => ({
      id: `local-vocab-${item.hanzi}`,
      hanzi: item.hanzi,
      simplified: item.hanzi,
      traditional: item.traditional || item.hanzi,
      pinyin: item.pinyin || '',
      pinyinTone: item.pinyin || '',
      pinyinClean: cleanPinyin(item.pinyin || ''),
      hanviet: item.hanviet || '',
      meaningVi: item.meaning || '',
      meaningEn: item.meaningEn || item.en || '',
      definitions: [item.meaning || ''],
      examples: item.example ? [item.example] : [],
      pos: item.pos || '',
      level: item.level || 'HSK 1',
      topic: item.topic || 'Cốt lõi',
      frequencyRank: item.id || 500,
      sourceId: 'hanzigo_curated_core',
      sourceLicense: 'HanziGo Educational',
      qualityStatus: 'verified_human',
      decomposition: getHanziDecomposition(item.hanzi),
      matchScore: 100,
      source: 'local'
    }));
  }

  if (hskLevel && hskLevel !== 'ALL') {
    localPool = localPool.filter(item => {
      if (hskLevel === 'HSK 5-6') return item.level === 'HSK 5' || item.level === 'HSK 6' || item.level === 'HSK 5-6';
      return item.level === hskLevel;
    });
  }

  const totalLocal = localPool.length;
  const paginatedLocal = localPool.slice(offset, offset + safePageSize);

  return {
    entries: paginatedLocal,
    totalCount: totalLocal,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(totalLocal / safePageSize)),
    source: 'local_fallback'
  };
}

/**
 * Chuẩn hóa định dạng hiển thị chi tiết từ vựng
 * Chỉ trả về các trường dữ liệu thực sự có, không hiển thị trường rỗng như thể đã được xác minh.
 */
export function formatDictionaryItemForDisplay(item) {
  if (!item) return null;
  const simp = item.simplified || item.hanzi || '';
  return {
    hanzi: simp,
    simplified: simp,
    traditional: item.traditional && item.traditional !== simp ? item.traditional : null,
    pinyin: item.pinyin || item.pinyinTone || '',
    hanviet: item.hanviet || null,
    meaningVi: item.meaningVi && item.meaningVi.trim() ? item.meaningVi.trim() : null,
    meaningEn: item.meaningEn || (Array.isArray(item.definitions) ? item.definitions.join('; ') : null),
    definitions: Array.isArray(item.definitions) && item.definitions.length > 0 ? item.definitions : null,
    pos: item.pos && item.pos !== 'n/v/adj' ? item.pos : null,
    examples: Array.isArray(item.examples) && item.examples.length > 0 ? item.examples : null,
    hskLevel: item.level && item.level !== 'HSK 1-6' ? item.level : null,
    sourceId: item.sourceId || 'cc_cedict',
    sourceLicense: item.sourceLicense || 'CC BY-SA 4.0',
    qualityStatus: item.qualityStatus || (item.meaningVi ? 'verified_human' : 'community_standard'),
    decomposition: item.decomposition || null
  };
}
