/**
 * =========================================================================
 * HANZIGO - CHINESE CHARACTER DICTIONARY & STROKE WRITING SERVICE
 * =========================================================================
 * Dịch vụ tra cứu chữ Hán, chuẩn hóa ngữ âm Pinyin đa biến thể,
 * trích xuất cấu trúc chiết tự, tra cứu theo bộ thủ, số nét, HSK
 * và quản lý tiến độ luyện viết cho học viên HanziGo.
 * =========================================================================
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { KANGXI_RADICALS, findRadical } from '../data/radicalsData.js';
import { CHARACTER_DECOMPOSITION_DICT, CONFUSING_CHARACTER_PAIRS, STRUCTURE_TYPES } from '../data/characterDecompositionData.js';
import { EXTENDED_COMMON_CHARS } from '../data/commonCharactersDict.js';
import { stripPinyinTones, generatePinyinVariants, convertNumberedPinyinToAccented, normalizeUnicodeNfc } from '../../scripts/knowledge/normalizer.js';
import { getUserStorageKey } from '../utils/gamification.js';
import { saveUserVocabSrsCard } from './vocabularyService.js';

const STORAGE_WRITING_PROGRESS = 'hanzigo_writing_progress_map';
const STORAGE_WRITING_HISTORY = 'hanzigo_writing_history_log';

/**
 * Loại bỏ dấu tiếng Việt để phục vụ tìm kiếm nghĩa không dấu
 * Ví dụ: "học tập" -> "hoc tap", "tiếng trung" -> "tieng trung"
 */
export function stripVietnameseDiacritics(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Bảng chữ Hán phổ biến kèm chiết tự sơ cấp
 */
export const POPULAR_CHARS_DICT = {
  '你': { pinyin: 'nǐ', hanviet: 'Nhĩ', meaning: 'Bạn, anh, chị (ngôi 2)', radical: '亻 (Nhân đứng)', strokesCount: 7 },
  '好': { pinyin: 'hǎo', hanviet: 'Hảo', meaning: 'Tốt, đẹp, hay', radical: '女 (Nữ)', strokesCount: 6 },
  '我': { pinyin: 'wǒ', hanviet: 'Ngã', meaning: 'Tôi, ta, bản thân', radical: '戈 (Qua)', strokesCount: 7 },
  '他': { pinyin: 'tā', hanviet: 'Tha', meaning: 'Anh ấy, cậu ấy', radical: '亻 (Nhân đứng)', strokesCount: 5 },
  '她': { pinyin: 'tā', hanviet: 'Tha', meaning: 'Cô ấy, bà ấy', radical: '女 (Nữ)', strokesCount: 6 },
  '学': { pinyin: 'xué', hanviet: 'Học', meaning: 'Học tập, bắt chước', radical: '子 (Tử)', strokesCount: 8 },
  '生': { pinyin: 'shēng', hanviet: 'Sinh', meaning: 'Sinh ra, sống, học sinh', radical: '生 (Sinh)', strokesCount: 5 },
  '国': { pinyin: 'guó', hanviet: 'Quốc', meaning: 'Đất nước, quốc gia', radical: '囗 (Vi)', strokesCount: 8 },
  '家': { pinyin: 'jiā', hanviet: 'Gia', meaning: 'Nhà, gia đình', radical: '宀 (Miên)', strokesCount: 10 },
  '水': { pinyin: 'shuǐ', hanviet: 'Thủy', meaning: 'Nước, dòng sông', radical: '水 (Thủy)', strokesCount: 4 },
  '茶': { pinyin: 'chá', hanviet: 'Trà', meaning: 'Lá trà, nước trà', radical: '艹 (Thảo)', strokesCount: 9 },
  '人': { pinyin: 'rén', hanviet: 'Nhân', meaning: 'Con người', radical: '人 (Nhân)', strokesCount: 2 },
  '天': { pinyin: 'tiān', hanviet: 'Thiên', meaning: 'Trời, ngày', radical: '大 (Đại)', strokesCount: 4 },
  '车': { pinyin: 'chē', hanviet: 'Xa', meaning: 'Xe cộ, phương tiện', radical: '车 (Xa)', strokesCount: 4 },
  '钱': { pinyin: 'qián', hanviet: 'Tiền', meaning: 'Tiền bạc, tài chính', radical: '钅(Kim)', strokesCount: 10 },
  '心': { pinyin: 'xīn', hanviet: 'Tâm', meaning: 'Trái tim, lòng dạ', radical: '心 (Tâm)', strokesCount: 4 },
  '道': { pinyin: 'dào', hanviet: 'Đạo', meaning: 'Con đường, đạo lý', radical: '辶 (Sước)', strokesCount: 12 },
  '语': { pinyin: 'yǔ', hanviet: 'Ngữ', meaning: 'Ngôn ngữ, lời nói', radical: '讠(Ngôn)', strokesCount: 9 },
  '汉': { pinyin: 'hàn', hanviet: 'Hán', meaning: 'Tộc Hán, tiếng Trung', radical: '氵(Chấm thủy)', strokesCount: 5 },
  '字': { pinyin: 'zì', hanviet: 'Tự', meaning: 'Chữ viết, văn tự', radical: '宀 (Miên)', strokesCount: 6 },
  '写': { pinyin: 'xiě', hanviet: 'Tả', meaning: 'Viết, sáng tác', radical: '冖 (Mịch)', strokesCount: 5 },
  '吃': { pinyin: 'chī', hanviet: 'Cật', meaning: 'Ăn uống', radical: '口 (Khẩu)', strokesCount: 6 },
  '喝': { pinyin: 'hē', hanviet: 'Hát', meaning: 'Uống', radical: '口 (Khẩu)', strokesCount: 12 },
  '看': { pinyin: 'kàn', hanviet: 'Khán', meaning: 'Nhìn, xem, đọc', radical: '目 (Mục)', strokesCount: 9 },
  '听': { pinyin: 'tīng', hanviet: 'Thính', meaning: 'Lắng nghe', radical: '口 (Khẩu)', strokesCount: 7 },
  '说': { pinyin: 'shuō', hanviet: 'Thuyết', meaning: 'Nói, giải thích', radical: '讠(Ngôn)', strokesCount: 9 }
};

/**
 * Trích xuất danh sách tất cả các chữ Hán đơn lẻ từ kho VOCABULARY_LIST và các nguồn mở
 */
let CACHED_CANONICAL_CHARACTERS = null;

export function getAllCanonicalCharacters() {
  if (CACHED_CANONICAL_CHARACTERS) return CACHED_CANONICAL_CHARACTERS;

  const charMap = new Map();

  // 1. Nạp từ POPULAR_CHARS_DICT
  for (const [char, meta] of Object.entries(POPULAR_CHARS_DICT)) {
    charMap.set(char, {
      char,
      pinyin: meta.pinyin,
      hanviet: meta.hanviet || '',
      meaning: meta.meaning || '',
      radical: meta.radical || 'Bộ thủ',
      strokesCount: meta.strokesCount || 6,
      hskLevel: 'HSK 1',
      sourceType: 'curated'
    });
  }

  // 2. Quét qua toàn bộ VOCABULARY_LIST (500+ từ HSK)
  VOCABULARY_LIST.forEach(vocab => {
    const hanziStr = String(vocab.hanzi || '');
    const hanChars = Array.from(hanziStr).filter(c => /[\u4e00-\u9fa5]/.test(c));
    const pinyinTokens = (vocab.pinyin || '').trim().split(/\s+/);

    hanChars.forEach((c, idx) => {
      const decomp = CHARACTER_DECOMPOSITION_DICT[c];
      const existing = charMap.get(c);

      if (!existing) {
        charMap.set(c, {
          char: c,
          pinyin: pinyinTokens[idx] || (decomp ? decomp.pinyin : vocab.pinyin) || '',
          hanviet: (decomp && decomp.hanviet) || (idx === 0 ? vocab.hanviet : '') || '',
          meaning: vocab.meaning,
          radical: vocab.radical || (decomp && decomp.components && decomp.components[0]?.name) || 'Bộ thủ',
          strokesCount: Number(vocab.strokes) || 6,
          hskLevel: vocab.level || 'HSK 1',
          primaryWord: vocab.hanzi,
          sourceType: 'vocabulary'
        });
      } else {
        // Cập nhật cấp HSK tối thiểu nếu xuất hiện ở cấp sớm hơn
        if (!existing.primaryWord) existing.primaryWord = vocab.hanzi;
      }
    });
  });

  // 3. Quét qua 214 Bộ thủ (Kangxi Radicals)
  KANGXI_RADICALS.forEach(rad => {
    if (!charMap.has(rad.radical)) {
      charMap.set(rad.radical, {
        char: rad.radical,
        pinyin: rad.pinyin,
        hanviet: rad.hanviet,
        meaning: `Bộ thủ: ${rad.meaning}`,
        radical: `${rad.radical} (${rad.hanviet})`,
        strokesCount: rad.strokes,
        hskLevel: 'Nhập môn',
        sourceType: 'radical'
      });
    }
  });

  // 4. Quét qua EXTENDED_COMMON_CHARS (thiên nhiên, linh vật, cầm kỳ thi họa, phúc lộc...)
  for (const [char, meta] of Object.entries(EXTENDED_COMMON_CHARS)) {
    if (!charMap.has(char)) {
      charMap.set(char, {
        char,
        pinyin: meta.pinyin,
        hanviet: meta.hanviet || '',
        meaning: meta.meaning || '',
        radical: meta.radical || 'Bộ thủ',
        strokesCount: meta.strokesCount || 6,
        hskLevel: 'Mở rộng',
        sourceType: 'extended'
      });
    }
  }

  CACHED_CANONICAL_CHARACTERS = Array.from(charMap.values());
  return CACHED_CANONICAL_CHARACTERS;
}

/**
 * Tìm các từ vựng trong kho VOCABULARY_LIST có chứa chữ Hán mục tiêu
 */
export function getRelatedWordsForChar(char) {
  if (!char) return [];
  const single = Array.from(char)[0];
  return VOCABULARY_LIST.filter(v => v.hanzi && v.hanzi.includes(single));
}

/**
 * Xây dựng hồ sơ chi tiết toàn diện của một chữ Hán (Character Detail Profile)
 * Tuyệt đối không bịa đặt dữ liệu (Zero Hallucination Policy).
 */
export function getCharacterDetail(charOrWord) {
  if (!charOrWord) return null;

  const rawStr = String(charOrWord).trim();
  const firstChar = Array.from(rawStr).find(c => /[\u4e00-\u9fa5]/.test(c)) || rawStr[0];
  if (!firstChar) return null;

  const allChars = getAllCanonicalCharacters();
  const baseMeta = allChars.find(c => c.char === firstChar) || {
    char: firstChar,
    strokesCount: 6,
    hskLevel: 'HSK 1'
  };

  const decomp = CHARACTER_DECOMPOSITION_DICT[firstChar] || null;
  const relatedWords = getRelatedWordsForChar(firstChar);
  const primaryVocab = relatedWords.find(v => v.hanzi === rawStr) || relatedWords[0] || null;
  const confusingInfo = CONFUSING_CHARACTER_PAIRS.find(p => p.pair.includes(firstChar)) || null;

  // Tra cứu bộ thủ chuẩn từ 214 Bộ thủ Khang Hy
  let matchedRadical = null;
  if (baseMeta.radical) {
    matchedRadical = findRadical(baseMeta.radical.replace(/[()]/g, ' ').split(/\s+/)[0]);
  }
  if (!matchedRadical && decomp && decomp.components && decomp.components.length > 0) {
    matchedRadical = findRadical(decomp.components[0].char);
  }

  // Tách số nét chính xác
  const totalStrokes = baseMeta.strokesCount || (primaryVocab ? Number(primaryVocab.strokes) : 6) || 6;

  // Pinyin chuẩn hóa
  const pinyin = baseMeta.pinyin || (primaryVocab ? primaryVocab.pinyin : '');

  // Hán Việt
  const hanviet = baseMeta.hanviet || (primaryVocab ? primaryVocab.hanviet : '') || '';

  // Nghĩa tiếng Việt
  const meaning = baseMeta.meaning || (primaryVocab ? primaryVocab.meaning : '') || '';

  // Ví dụ câu
  let example = null;
  if (primaryVocab && primaryVocab.example) {
    example = primaryVocab.example;
  } else if (relatedWords.length > 0 && relatedWords[0].example) {
    example = relatedWords[0].example;
  }

  return {
    char: firstChar,
    pinyin,
    hanviet,
    meaning,
    hskLevel: primaryVocab ? primaryVocab.level : baseMeta.hskLevel || 'HSK 1',
    strokesCount: totalStrokes,
    radical: matchedRadical ? `${matchedRadical.radical} (${matchedRadical.hanviet})` : (baseMeta.radical || 'Bộ thủ'),
    radicalDetails: matchedRadical ? {
      radical: matchedRadical.radical,
      hanviet: matchedRadical.hanviet,
      strokes: matchedRadical.strokes,
      meaning: matchedRadical.meaning
    } : null,
    structure: decomp ? decomp.structure : STRUCTURE_TYPES.SINGLE,
    components: decomp ? decomp.components : [
      { char: matchedRadical ? matchedRadical.radical : firstChar, role: 'root', name: 'Bộ thủ chủ đạo' }
    ],
    traditional: decomp ? decomp.traditional : firstChar,
    hasTraditionalVariant: decomp ? (decomp.traditional !== firstChar) : false,
    etymologyType: decomp ? decomp.etymologyType : 'Đang cập nhật nguồn gốc chiết tự',
    mnemonic: (decomp && decomp.mnemonicStory) || (primaryVocab && primaryVocab.mnemonic) || `Chữ "${firstChar}" có ý nghĩa "${meaning}".`,
    confusingPair: confusingInfo,
    relatedWords: relatedWords.slice(0, 8),
    example,
    isMultiCharWord: rawStr.length > 1,
    parentWord: rawStr.length > 1 ? rawStr : null,
    wordCharacters: Array.from(rawStr).filter(c => /[\u4e00-\u9fa5]/.test(c))
  };
}

/**
 * Thực hiện tìm kiếm chữ Hán đa tiêu chí (Multi-facet Search Engine)
 * - Chữ Hán Giản thể / Phồn thể
 * - Pinyin có dấu / Pinyin không dấu / Pinyin số (ni3, hao3) / Pinyin viết liền (nihao)
 * - Nghĩa tiếng Việt có dấu / không dấu
 * - Phiên âm Hán Việt
 * - Tên bộ thủ hoặc số nét
 * - Cấp độ HSK (HSK 1 -> HSK 6)
 */
export function searchCharacters({
  query = '',
  hskFilter = 'all',
  radicalFilter = 'all',
  strokeMin = null,
  strokeMax = null,
  limit = 40
} = {}) {
  const characters = getAllCanonicalCharacters();
  const rawQ = (query || '').trim();
  const normQ = normalizeUnicodeNfc(rawQ).toLowerCase();
  const unaccentedQ = stripVietnameseDiacritics(normQ);

  // Sinh các biến thể Pinyin nếu chuỗi tìm kiếm bằng chữ Latin
  const pinyinVariants = /^[a-zA-Z0-9\süÜ:̄́̌̀]+$/.test(rawQ) ? generatePinyinVariants(rawQ) : [];
  const accentedPinyinCandidate = convertNumberedPinyinToAccented(rawQ).toLowerCase();
  if (accentedPinyinCandidate) pinyinVariants.push(accentedPinyinCandidate);

  // Kiểm tra nếu query là chữ Hán nhiều ký tự (ví dụ: "你好", "中国")
  const isHanziWord = /[\u4e00-\u9fa5]{2,}/.test(rawQ);
  let multiCharBreakdown = null;
  const charsFromMatchingVocab = new Set();

  if (isHanziWord) {
    const chars = Array.from(rawQ).filter(c => /[\u4e00-\u9fa5]/.test(c));
    const matchingVocab = VOCABULARY_LIST.find(v => v.hanzi === rawQ) || null;
    chars.forEach(c => charsFromMatchingVocab.add(c));
    multiCharBreakdown = {
      word: rawQ,
      pinyin: matchingVocab ? matchingVocab.pinyin : '',
      meaning: matchingVocab ? matchingVocab.meaning : '',
      level: matchingVocab ? matchingVocab.level : '',
      characters: chars.map(c => getCharacterDetail(c))
    };
  } else if (normQ.length >= 2) {
    // Tìm các từ ghép trong VOCABULARY_LIST khớp Pinyin hoặc nghĩa
    const matchingVocab = VOCABULARY_LIST.find(v => {
      const vPinyin = (v.pinyin || '').toLowerCase();
      const vPinyinNoTone = stripPinyinTones(vPinyin);
      const vPinyinCompact = vPinyinNoTone.replace(/\s+/g, '');
      const vMeaning = stripVietnameseDiacritics(v.meaning || '');

      const matchesPinyin = vPinyin === normQ || vPinyinNoTone === unaccentedQ || vPinyinCompact === unaccentedQ ||
        pinyinVariants.some(pv => vPinyin.includes(pv) || vPinyinNoTone.includes(pv) || vPinyinCompact.includes(pv));
      const matchesMeaning = vMeaning.includes(unaccentedQ) && unaccentedQ.length >= 3;
      return matchesPinyin || matchesMeaning;
    });

    if (matchingVocab) {
      const chars = Array.from(matchingVocab.hanzi).filter(c => /[\u4e00-\u9fa5]/.test(c));
      chars.forEach(c => charsFromMatchingVocab.add(c));
      multiCharBreakdown = {
        word: matchingVocab.hanzi,
        pinyin: matchingVocab.pinyin,
        meaning: matchingVocab.meaning,
        level: matchingVocab.level,
        characters: chars.map(c => getCharacterDetail(c))
      };
    }
  }

  const results = characters.filter(item => {
    // Ưu tiên cao: chữ thuộc từ vựng ghép vừa tìm thấy
    if (charsFromMatchingVocab.has(item.char)) return true;
    // 1. Lọc theo HSK
    if (hskFilter && hskFilter !== 'all') {
      if (item.hskLevel !== hskFilter) return false;
    }

    // 2. Lọc theo Bộ thủ
    if (radicalFilter && radicalFilter !== 'all') {
      const itemRad = (item.radical || '').toLowerCase();
      const targetRad = radicalFilter.toLowerCase();
      if (!itemRad.includes(targetRad)) return false;
    }

    // 3. Lọc theo Số nét
    if (typeof strokeMin === 'number' && strokeMin > 0) {
      if (item.strokesCount < strokeMin) return false;
    }
    if (typeof strokeMax === 'number' && strokeMax > 0) {
      if (item.strokesCount > strokeMax) return false;
    }

    // 4. Nếu không nhập từ khóa tìm kiếm, chấp nhận theo bộ lọc
    if (!normQ) return true;

    // A. Khớp trực tiếp ký tự Hán (giản thể hoặc phồn thể)
    if (item.char === rawQ || item.char.includes(rawQ)) return true;
    const decomp = CHARACTER_DECOMPOSITION_DICT[item.char];
    if (decomp && decomp.traditional && decomp.traditional.includes(rawQ)) return true;

    // B. Khớp Pinyin (có dấu, không dấu, số thanh điệu, viết liền)
    const itemPinyin = (item.pinyin || '').toLowerCase();
    const itemPinyinNoTone = stripPinyinTones(itemPinyin);
    const itemPinyinCompact = itemPinyinNoTone.replace(/\s+/g, '');

    if (itemPinyin.includes(normQ) || itemPinyinNoTone.includes(unaccentedQ) || itemPinyinCompact.includes(unaccentedQ)) {
      return true;
    }
    for (const v of pinyinVariants) {
      if (itemPinyin.includes(v) || itemPinyinNoTone.includes(v) || itemPinyinCompact.includes(v)) {
        return true;
      }
    }

    // C. Khớp Âm Hán Việt
    const itemHanviet = (item.hanviet || '').toLowerCase();
    const itemHanvietNoTone = stripVietnameseDiacritics(itemHanviet);
    if (itemHanviet.includes(normQ) || itemHanvietNoTone.includes(unaccentedQ)) {
      return true;
    }

    // D. Khớp Nghĩa tiếng Việt
    const itemMeaning = (item.meaning || '').toLowerCase();
    const itemMeaningNoTone = stripVietnameseDiacritics(itemMeaning);
    if (itemMeaning.includes(normQ) || itemMeaningNoTone.includes(unaccentedQ)) {
      return true;
    }

    // E. Khớp Tên bộ thủ
    const itemRadical = (item.radical || '').toLowerCase();
    if (itemRadical.includes(normQ) || stripVietnameseDiacritics(itemRadical).includes(unaccentedQ)) {
      return true;
    }

    // F. Khớp từ ghép liên quan
    if (item.primaryWord && item.primaryWord.includes(rawQ)) {
      return true;
    }

    return false;
  });

  // Tự động giải quyết ký tự Hán nhập trực tiếp nếu chưa có trong kết quả
  const queriedHanChars = Array.from(rawQ).filter(c => /[\u4e00-\u9fa5]/.test(c));
  const onDemandItems = [];
  queriedHanChars.forEach(ch => {
    if (!results.some(r => r.char === ch)) {
      const detail = getCharacterDetail(ch);
      onDemandItems.push({
        char: ch,
        pinyin: detail.pinyin || '',
        hanviet: detail.hanviet || '',
        meaning: detail.meaning || `Chữ Hán: ${ch}`,
        radical: detail.radical || 'Bộ thủ',
        strokesCount: detail.strokesCount || 6,
        hskLevel: detail.hskLevel || 'Mở rộng',
        sourceType: 'on_demand'
      });
    }
  });

  const finalItems = [...onDemandItems, ...results];

  return {
    query: rawQ,
    total: finalItems.length,
    multiCharBreakdown,
    items: finalItems.slice(0, limit)
  };
}

/**
 * =========================================================================
 * QUẢN LÝ TIẾN ĐỘ LUYỆN VIẾT VÀ TÍCH HỢP SRS
 * =========================================================================
 */

export const WRITING_STATUS = {
  NOT_STARTED: 'not_started',
  LEARNING: 'learning',
  LEARNED: 'learned',
  NEEDS_REVIEW: 'needs_review'
};

const memoryStore = new Map();

function getStorageItem(key) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(key);
    }
  } catch {}
  return memoryStore.get(key) || null;
}

function setStorageItem(key, val) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function') {
      localStorage.setItem(key, val);
      return;
    }
  } catch {}
  memoryStore.set(key, val);
}

/**
 * Đọc bảng trạng thái luyện viết của người dùng
 */
export function getUserWritingProgressMap(user = null) {
  const key = getUserStorageKey(STORAGE_WRITING_PROGRESS, user);
  try {
    const raw = getStorageItem(key) || (user ? null : getStorageItem(STORAGE_WRITING_PROGRESS));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Cập nhật trạng thái một chữ Hán (Học mới, Đang học, Đã học, Cần ôn tập)
 */
export async function setUserWritingStatus(char, status, user = null, meta = {}) {
  if (!char) return false;
  const single = Array.from(char)[0];
  const progressMap = getUserWritingProgressMap(user);

  const prev = progressMap[single] || {};
  progressMap[single] = {
    ...prev,
    char: single,
    status,
    lastPracticedAt: new Date().toISOString(),
    practiceCount: (prev.practiceCount || 0) + 1,
    bestScore: meta.score ? Math.max(prev.bestScore || 0, meta.score) : (prev.bestScore || 0),
    ...meta
  };

  const key = getUserStorageKey(STORAGE_WRITING_PROGRESS, user);
  try {
    setStorageItem(key, JSON.stringify(progressMap));
  } catch {}

  // Ghi nhật ký luyện viết
  recordWritingHistory(single, status, meta.score || 0, user);

  // Đồng bộ sang bảng SRS đám mây nếu người dùng đăng nhập
  if (user?.uid) {
    try {
      const detail = getCharacterDetail(single);
      if (detail) {
        await saveUserVocabSrsCard(user.uid, {
          hanzi: single,
          pinyin: detail.pinyin,
          meaning: detail.meaning,
          level: detail.hskLevel,
          stage: status === WRITING_STATUS.LEARNED ? 2 : 1,
          repetitions: progressMap[single].practiceCount || 1,
          intervalDays: status === WRITING_STATUS.LEARNED ? 3 : 1
        });
      }
    } catch (err) {
      console.warn('SRS Sync notice:', err);
    }
  }

  // Bắn sự kiện cập nhật tiến độ
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hanzigo_writing_progress_updated', {
      detail: { char: single, status, progress: progressMap[single] }
    }));
  }

  return true;
}

/**
 * Ghi lịch sử lượt luyện viết
 */
function recordWritingHistory(char, status, score, user) {
  const key = getUserStorageKey(STORAGE_WRITING_HISTORY, user);
  try {
    const raw = getStorageItem(key) || '[]';
    const list = JSON.parse(raw);
    list.unshift({
      char,
      status,
      score,
      date: new Date().toISOString()
    });
    // Giữ tối đa 100 lượt gần nhất
    setStorageItem(key, JSON.stringify(list.slice(0, 100)));
  } catch {}
}

/**
 * Lấy lịch sử luyện viết gần đây
 */
export function getWritingHistory(user = null) {
  const key = getUserStorageKey(STORAGE_WRITING_HISTORY, user);
  try {
    const raw = getStorageItem(key) || (user ? null : getStorageItem(STORAGE_WRITING_HISTORY));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
