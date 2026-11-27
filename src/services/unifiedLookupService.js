/**
 * =========================================================================
 * HANZIGO — UNIFIED CHINESE WORD & SINO-VIETNAMESE LOOKUP SERVICE
 * =========================================================================
 * Nguồn chân lý thống nhất (Single Source of Truth) cho:
 *  - Word Inspector (ReaderPage.jsx & chineseNlpEngine.js)
 *  - SelectionAiPopover.jsx (selectionAiService.js)
 *  - localVocabLookup.js
 *
 * Thứ tự ưu tiên phân giải (3 tầng):
 *  1. Giáo trình HSK chuẩn (`VOCABULARY_LIST`)
 *  2. Từ điển chữ đơn mở rộng (`EXTENDED_COMMON_CHARS`) + 214 Bộ thủ Khang Hy (`KANGXI_RADICALS`) + Chiết tự IDS (`getHanziDecomposition`)
 *  3. Tự động căn chỉnh Pinyin / Hán-Việt / nghĩa theo từ ghép HSK liên quan hoặc tách cụm đa âm tiết
 * Tuyệt đối KHÔNG trả về chuỗi giữ chỗ "Đang cập nhật", "Chưa cập nhật", hoặc gán bừa Âm Hán-Việt = "Tự" / Pinyin = "zì".
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { EXTENDED_COMMON_CHARS } from '../data/commonCharactersDict.js';
import { KANGXI_RADICALS, findRadical } from '../data/radicalsData.js';
import { getHanziDecomposition } from '../data/hanziDecomposition.js';

const HANZI_ONLY_RE = /[\u4e00-\u9fa5]/;

const PLACEHOLDER_PATTERNS = [
  /^đang cập nhật\.{0,3}$/i,
  /^chưa cập nhật\.{0,3}$/i,
  /^đang câp nhật\.{0,3}$/i,
  /^chưa có mục từ chi tiết/i,
  /^từ ghép tiếng trung$/i,
  /^từ vựng lưu từ ngữ cảnh/i,
  /^mục từ mở rộng cho\b/i,
  /^extended entry for\b/i,
  /^(tbd|n\/a|none|null|undefined|-+|—+)$/i,
];

let cachedIndexes = null;

function buildIndexes() {
  if (cachedIndexes) return cachedIndexes;

  const vocabMap = new Map();
  const compoundByChar = new Map();

  for (const item of VOCABULARY_LIST || []) {
    if (!item || !item.hanzi) continue;
    if (!vocabMap.has(item.hanzi)) {
      vocabMap.set(item.hanzi, item);
    }
    const chars = Array.from(item.hanzi);
    if (chars.length >= 2) {
      for (const ch of chars) {
        if (!HANZI_ONLY_RE.test(ch)) continue;
        if (!compoundByChar.has(ch)) compoundByChar.set(ch, []);
        const list = compoundByChar.get(ch);
        if (!list.some((existing) => existing.hanzi === item.hanzi)) {
          list.push(item);
        }
      }
    }
  }

  const radicalMap = new Map();
  for (const rad of KANGXI_RADICALS || []) {
    if (!rad) continue;
    if (rad.radical && !radicalMap.has(rad.radical)) {
      radicalMap.set(rad.radical, rad);
    }
    if (Array.isArray(rad.variants)) {
      for (const variant of rad.variants) {
        if (variant && !radicalMap.has(variant)) {
          radicalMap.set(variant, rad);
        }
      }
    }
  }

  cachedIndexes = { vocabMap, compoundByChar, radicalMap };
  return cachedIndexes;
}

/**
 * Kiểm tra nghĩa tiếng Việt có phải nội dung thực sự hay chuỗi giữ chỗ / rỗng.
 */
export function isValidVietnameseMeaning(meaning) {
  if (typeof meaning !== 'string') return false;
  const trimmed = meaning.trim();
  if (trimmed.length < 2) return false;
  return !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function splitSyllables(str = '') {
  return String(str || '')
    .trim()
    .split(/[\s/·]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Trích xuất các từ ghép HSK tiêu biểu chứa chữ Hán đầu vào (mặc định tối đa 4 từ).
 */
export function getRelatedHskCompounds(rawHanzi = '', limit = 4) {
  const clean = String(rawHanzi || '').trim();
  if (!clean || !HANZI_ONLY_RE.test(clean)) return [];
  const { compoundByChar, vocabMap } = buildIndexes();
  const chars = Array.from(clean).filter((ch) => HANZI_ONLY_RE.test(ch));
  const seen = new Set([clean]);
  const results = [];

  for (const ch of chars) {
    const candidates = compoundByChar.get(ch) || [];
    for (const item of candidates) {
      if (seen.has(item.hanzi)) continue;
      seen.add(item.hanzi);
      results.push({
        hanzi: item.hanzi,
        pinyin: item.pinyin || '',
        hanviet: item.hanviet || '',
        meaning: item.meaning || '',
        level: item.level || 'HSK',
      });
      if (results.length >= limit) return results;
    }
  }

  if (results.length < limit) {
    for (const item of vocabMap.values()) {
      if (seen.has(item.hanzi)) continue;
      if (chars.some((ch) => item.hanzi.includes(ch))) {
        seen.add(item.hanzi);
        results.push({
          hanzi: item.hanzi,
          pinyin: item.pinyin || '',
          hanviet: item.hanviet || '',
          meaning: item.meaning || '',
          level: item.level || 'HSK',
        });
        if (results.length >= limit) break;
      }
    }
  }

  return results;
}

/**
 * Phân giải metadata chuẩn xác cho 1 Hán tự đơn (tuyệt đối không gán 'Tự' / 'zì' cho ký tự lạ).
 */
export function resolveSingleCharMeta(char = '') {
  const ch = String(char || '').trim();
  if (!ch || !HANZI_ONLY_RE.test(ch)) {
    return null;
  }

  const { vocabMap, compoundByChar, radicalMap } = buildIndexes();
  const vocabEntry = vocabMap.get(ch);
  const extEntry = EXTENDED_COMMON_CHARS?.[ch];
  const radEntry = radicalMap.get(ch) || findRadical?.(ch) || null;
  const decomp = getHanziDecomposition?.(ch) || null;
  const compounds = compoundByChar.get(ch) || [];

  let pinyin = extEntry?.pinyin || vocabEntry?.pinyin || '';
  let hanviet = extEntry?.hanviet || vocabEntry?.hanviet || '';
  let meaning = '';

  if (extEntry && isValidVietnameseMeaning(extEntry.meaning)) {
    meaning = extEntry.meaning.trim();
  }
  if (vocabEntry && isValidVietnameseMeaning(vocabEntry.meaning)) {
    meaning = vocabEntry.meaning.trim();
  }

  // Căn chỉnh Pinyin & âm Hán-Việt từ từ ghép HSK nếu chữ đơn chưa khai báo trực tiếp
  if ((!pinyin || !hanviet) && compounds.length > 0) {
    for (const comp of compounds) {
      const compChars = Array.from(comp.hanzi);
      const charIdx = compChars.indexOf(ch);
      if (charIdx === -1) continue;

      if (!pinyin && comp.pinyin) {
        const pyParts = splitSyllables(comp.pinyin);
        if (pyParts.length === compChars.length && pyParts[charIdx]) {
          pinyin = pyParts[charIdx];
        }
      }
      if (!hanviet && comp.hanviet) {
        const hvParts = splitSyllables(comp.hanviet);
        if (hvParts.length === compChars.length && hvParts[charIdx]) {
          hanviet = hvParts[charIdx];
        }
      }
      if (pinyin && hanviet) break;
    }
  }

  // Fallback từ bảng Bộ thủ Khang Hy
  if (radEntry) {
    if (!pinyin && radEntry.pinyin) pinyin = radEntry.pinyin;
    if (!hanviet && radEntry.hanviet) hanviet = radEntry.hanviet;
    if (!meaning && isValidVietnameseMeaning(radEntry.meaning)) {
      meaning = `Bộ ${radEntry.hanviet || ch}: ${radEntry.meaning}`;
    }
  }

  // Fallback từ Chiết tự IDS
  if (decomp && Array.isArray(decomp.components) && decomp.components.length > 0) {
    const exactComp = decomp.components.find((c) => c.char === ch);
    if (exactComp) {
      if (!pinyin && exactComp.pinyin) pinyin = exactComp.pinyin;
      if (!hanviet && exactComp.hanviet) hanviet = exactComp.hanviet;
      if (!meaning && isValidVietnameseMeaning(exactComp.meaning)) {
        meaning = exactComp.meaning;
      }
    }
    if (!meaning) {
      const compDesc = decomp.components
        .map((c) => `${c.char}${c.meaning ? ` (${c.meaning})` : c.name ? ` (${c.name})` : ''}`)
        .join(' + ');
      if (compDesc) {
        meaning = compounds.length > 0
          ? `Yếu tố tạo từ (${compounds.slice(0, 2).map((c) => `${c.hanzi}: ${c.meaning}`).join('; ')}) · Cấu tạo: ${compDesc}`
          : `Chữ Hán cấu tạo từ ${compDesc}`;
      }
    }
  }

  // Fallback ngữ nghĩa từ các từ ghép HSK chứa chữ đơn này
  if (!meaning && compounds.length > 0) {
    const previews = compounds
      .slice(0, 2)
      .map((c) => `${c.hanzi} (${c.meaning})`)
      .join(', ');
    meaning = `Thành tố xuất hiện trong: ${previews}`;
  }

  return {
    hanzi: ch,
    traditional: vocabEntry?.traditional || ch,
    pinyin,
    hanviet,
    sinoVietnamese: hanviet,
    meaning,
    meaningEn: vocabEntry?.en || '',
    pos: vocabEntry?.pos || '',
    level: vocabEntry?.level || (compounds[0]?.level) || 'HSK',
    radical: extEntry?.radical || (radEntry ? `${radEntry.radical} (${radEntry.hanviet})` : ''),
    strokes: extEntry?.strokesCount || radEntry?.strokes || 0,
    decomposition: decomp,
    mnemonic: vocabEntry?.mnemonic || decomp?.mnemonic || '',
    example: vocabEntry?.example || null,
    found: Boolean(isValidVietnameseMeaning(meaning)),
  };
}

function segmentLongestFromIndexes(text) {
  const { vocabMap } = buildIndexes();
  const chars = Array.from(text);
  const parts = [];
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];
    if (!HANZI_ONLY_RE.test(ch)) {
      i += 1;
      continue;
    }

    let matchedWord = null;
    for (let len = Math.min(4, chars.length - i); len >= 2; len -= 1) {
      const candidate = chars.slice(i, i + len).join('');
      if (vocabMap.has(candidate)) {
        matchedWord = candidate;
        break;
      }
    }

    if (matchedWord) {
      const entry = vocabMap.get(matchedWord);
      parts.push({
        hanzi: matchedWord,
        pinyin: entry.pinyin || '',
        hanviet: entry.hanviet || '',
        meaning: entry.meaning || '',
        level: entry.level || 'HSK',
        pos: entry.pos || '',
        traditional: entry.traditional || matchedWord,
      });
      i += Array.from(matchedWord).length;
    } else {
      const single = resolveSingleCharMeta(ch);
      if (single) {
        parts.push(single);
      }
      i += 1;
    }
  }

  return parts;
}

/**
 * Chuỗi phân giải nghĩa tiếng Việt theo 3 tầng (không bao giờ trả về "Đang cập nhật").
 */
export function resolveVietnameseMeaning(rawHanzi = '') {
  const clean = String(rawHanzi || '').trim();
  if (!clean) return '';

  const { vocabMap } = buildIndexes();
  const direct = vocabMap.get(clean);
  if (direct && isValidVietnameseMeaning(direct.meaning)) {
    return direct.meaning.trim();
  }

  const chars = Array.from(clean);
  if (chars.length === 1 && HANZI_ONLY_RE.test(chars[0])) {
    const meta = resolveSingleCharMeta(chars[0]);
    return meta && isValidVietnameseMeaning(meta.meaning) ? meta.meaning : '';
  }

  const parts = segmentLongestFromIndexes(clean);
  const validParts = parts.filter((p) => isValidVietnameseMeaning(p.meaning));
  if (validParts.length === 0) return '';

  return validParts.map((p) => `${p.hanzi}: ${p.meaning}`).join(' • ');
}

/**
 * API tra cứu hợp nhất dùng cho cả Word Inspector & SelectionAiPopover.
 */
export function lookupUnifiedChineseWord(rawWord = '') {
  const clean = String(rawWord || '').trim();
  if (!clean || !HANZI_ONLY_RE.test(clean)) {
    return {
      hanzi: clean,
      traditional: clean,
      pinyin: '',
      hanviet: '',
      sinoVietnamese: '',
      meaning: '',
      meaningVi: '',
      meaningEn: '',
      pos: '',
      level: 'HSK',
      radical: '',
      strokes: 0,
      decomposition: null,
      mnemonic: '',
      example: null,
      relatedCompounds: [],
      tokens: [],
      found: false,
    };
  }

  const { vocabMap } = buildIndexes();
  const directVocab = vocabMap.get(clean);
  const relatedCompounds = getRelatedHskCompounds(clean, 4);

  if (directVocab && isValidVietnameseMeaning(directVocab.meaning)) {
    const decomp = getHanziDecomposition?.(Array.from(clean)[0]) || null;
    const extFirst = EXTENDED_COMMON_CHARS?.[Array.from(clean)[0]];
    const parts = segmentLongestFromIndexes(clean);
    return {
      hanzi: clean,
      traditional: directVocab.traditional || clean,
      pinyin: directVocab.pinyin || '',
      hanviet: directVocab.hanviet || '',
      sinoVietnamese: directVocab.hanviet || '',
      meaning: directVocab.meaning.trim(),
      meaningVi: directVocab.meaning.trim(),
      meaningEn: directVocab.en || '',
      pos: directVocab.pos || '',
      level: directVocab.level || 'HSK',
      radical: extFirst?.radical || '',
      strokes: extFirst?.strokesCount || 0,
      decomposition: decomp,
      mnemonic: directVocab.mnemonic || decomp?.mnemonic || '',
      example: directVocab.example || null,
      relatedCompounds,
      tokens: parts.map((p) => ({
        text: p.hanzi,
        pinyin: p.pinyin || '',
        meaningVi: p.meaning || '',
      })),
      found: true,
    };
  }

  const chars = Array.from(clean);
  if (chars.length === 1) {
    const single = resolveSingleCharMeta(chars[0]);
    const valid = Boolean(single && isValidVietnameseMeaning(single.meaning));
    return {
      hanzi: clean,
      traditional: single?.traditional || clean,
      pinyin: single?.pinyin || '',
      hanviet: single?.hanviet || '',
      sinoVietnamese: single?.hanviet || '',
      meaning: valid ? single.meaning : '',
      meaningVi: valid ? single.meaning : '',
      meaningEn: single?.meaningEn || '',
      pos: single?.pos || 'Chữ Hán đơn',
      level: single?.level || 'HSK',
      radical: single?.radical || '',
      strokes: single?.strokes || 0,
      decomposition: single?.decomposition || null,
      mnemonic: single?.mnemonic || '',
      example: single?.example || null,
      relatedCompounds,
      tokens: [
        {
          text: clean,
          pinyin: single?.pinyin || '',
          meaningVi: valid ? single.meaning : '',
        },
      ],
      found: valid,
    };
  }

  const parts = segmentLongestFromIndexes(clean);
  const validParts = parts.filter((p) => isValidVietnameseMeaning(p.meaning));
  const combinedMeaning = validParts.map((p) => `${p.hanzi}: ${p.meaning}`).join(' • ');
  const combinedPinyin = parts.map((p) => p.pinyin).filter(Boolean).join(' ');
  const combinedHanviet = parts.map((p) => p.hanviet).filter(Boolean).join(' ');
  const decomp = getHanziDecomposition?.(chars[0]) || null;

  return {
    hanzi: clean,
    traditional: clean,
    pinyin: combinedPinyin,
    hanviet: combinedHanviet,
    sinoVietnamese: combinedHanviet,
    meaning: combinedMeaning,
    meaningVi: combinedMeaning,
    meaningEn: '',
    pos: 'Cụm từ',
    level: parts[0]?.level || 'HSK',
    radical: parts[0]?.radical || '',
    strokes: parts.reduce((sum, p) => sum + (p.strokes || 0), 0),
    decomposition: decomp,
    mnemonic: decomp?.mnemonic || '',
    example: null,
    relatedCompounds,
    tokens: parts.map((p) => ({
      text: p.hanzi,
      pinyin: p.pinyin || '',
      meaningVi: isValidVietnameseMeaning(p.meaning) ? p.meaning : '',
    })),
    found: Boolean(isValidVietnameseMeaning(combinedMeaning)),
  };
}

/**
 * Chuẩn hóa & kiểm tra thẻ Flashcard SRS từ ReaderPage Word Inspector (chặn thẻ rác không có nghĩa chuẩn).
 */
export function buildSafeReaderFlashcard(token, rawContextText = '') {
  if (!token || !token.raw) {
    return { ok: false, error: 'Chưa chọn từ để lưu.' };
  }
  const fallbackMeta = lookupUnifiedChineseWord(token.raw);
  const resolvedMeaning = isValidVietnameseMeaning(token.meaningVi)
    ? token.meaningVi.trim()
    : isValidVietnameseMeaning(fallbackMeta?.meaningVi)
      ? fallbackMeta.meaningVi.trim()
      : '';

  if (!resolvedMeaning) {
    return {
      ok: false,
      error: 'Chưa có nghĩa tiếng Việt chuẩn để lưu SRS — hãy dùng "Tra AI ngữ cảnh"!',
    };
  }

  return {
    ok: true,
    vocabItem: {
      id: `srs-reader-${Date.now()}-${token.raw}`,
      hanzi: token.raw,
      traditional: token.traditional || fallbackMeta?.traditional || token.raw,
      pinyin: token.pinyin || fallbackMeta?.pinyin || '',
      hanviet: token.hanviet || fallbackMeta?.hanviet || '',
      meaning: resolvedMeaning,
      level: token.level || fallbackMeta?.level || 'HSK 1',
      topic: 'Bài đọc thông minh',
      radical: token.decomposition?.components?.[0]?.name || fallbackMeta?.radical || '—',
      strokes: Array.from(token.raw).length * 6,
      mnemonic:
        token.mnemonic ||
        token.decomposition?.mnemonic ||
        fallbackMeta?.mnemonic ||
        'Ghi nhớ qua bài đọc ngữ cảnh HanziGo.',
      en: token.meaningEn || fallbackMeta?.meaningEn || '',
      pos: token.pos || fallbackMeta?.pos || 'Từ vựng',
      example: {
        hanzi: String(rawContextText || '').slice(0, 50),
        pinyin: '',
        meaning: 'Trích từ bài đọc thông minh HanziGo',
      },
    },
  };
}
