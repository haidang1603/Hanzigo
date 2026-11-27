/**
 * =========================================================================
 * HANZI GO — ZERO-NETWORK LOCAL CHINESE CLICK-TO-LOOKUP ENGINE
 * =========================================================================
 * Tra từ nhanh tại chỗ trong bài đọc hiểu dựa trên kho từ vựng nội bộ
 * (VOCABULARY_LIST + EXTENDED_COMMON_CHARS), không gọi thêm API nặng.
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { EXTENDED_COMMON_CHARS } from '../data/commonCharactersDict.js';
import { lookupUnifiedChineseWord } from '../services/unifiedLookupService.js';

let cachedIndex = null;

function ensureIndex() {
  if (cachedIndex) return cachedIndex;
  const map = new Map();

  if (Array.isArray(VOCABULARY_LIST)) {
    for (const item of VOCABULARY_LIST) {
      if (!item?.hanzi) continue;
      const key = String(item.hanzi).trim();
      if (!key || map.has(key)) continue;
      map.set(key, {
        hanzi: key,
        traditional: item.traditional || key,
        pinyin: item.pinyin || '',
        hanviet: item.hanviet || '',
        meaning: item.meaning || '',
        pos: item.pos || '',
        level: item.level || 'HSK 1',
        radical: item.radical || '',
        strokes: item.strokes || 0,
        mnemonic: item.mnemonic || '',
        example: item.example || null,
        found: true,
      });
    }
  }

  if (EXTENDED_COMMON_CHARS && typeof EXTENDED_COMMON_CHARS === 'object') {
    for (const [char, info] of Object.entries(EXTENDED_COMMON_CHARS)) {
      if (!char || map.has(char)) continue;
      map.set(char, {
        hanzi: char,
        traditional: char,
        pinyin: info.pinyin || '',
        hanviet: info.hanviet || '',
        meaning: info.meaning || '',
        pos: 'Chữ Hán',
        level: 'HSK 1-6',
        radical: info.radical || '',
        strokes: info.strokesCount || 0,
        mnemonic: '',
        example: null,
        found: true,
      });
    }
  }

  cachedIndex = map;
  return map;
}

/**
 * Tra cứu 1 từ hoặc 1 chữ Hán trong kho từ điển nội bộ.
 */
export function lookupChineseTokenLocal(rawToken = '') {
  const token = String(rawToken || '').trim();
  if (!token) return null;
  const unified = lookupUnifiedChineseWord(token);
  if (unified) {
    return {
      hanzi: unified.hanzi,
      traditional: unified.traditional || unified.hanzi,
      pinyin: unified.pinyin || '',
      hanviet: unified.hanviet || '',
      meaning: unified.meaningVi || '',
      pos: unified.pos || '',
      level: unified.level || 'HSK',
      radical: unified.radical || '',
      strokes: unified.strokes || 0,
      mnemonic: unified.mnemonic || '',
      example: unified.example || null,
      relatedCompounds: unified.relatedCompounds || [],
      found: Boolean(unified.found),
    };
  }

  return {
    hanzi: token,
    traditional: token,
    pinyin: '',
    hanviet: '',
    meaning: '',
    pos: '',
    level: 'HSK',
    radical: '',
    strokes: 0,
    mnemonic: '',
    example: null,
    relatedCompounds: [],
    found: false,
  };
}

/**
 * Tách đoạn văn tiếng Trung thành các token có thể bấm tra từ (ưu tiên khớp từ ghép 2–4 chữ).
 */
export function segmentChineseForLookup(text = '') {
  const input = String(text || '');
  if (!input) return [];
  const index = ensureIndex();
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    if (!/[\u4e00-\u9fa5]/.test(ch)) {
      let j = i + 1;
      while (j < input.length && !/[\u4e00-\u9fa5]/.test(input[j])) j += 1;
      tokens.push({ text: input.slice(i, j), isHanzi: false });
      i = j;
      continue;
    }

    let matchedLen = 1;
    for (let len = Math.min(4, input.length - i); len >= 2; len -= 1) {
      const candidate = input.slice(i, i + len);
      if (/^[\u4e00-\u9fa5]+$/.test(candidate) && index.has(candidate)) {
        matchedLen = len;
        break;
      }
    }
    const word = input.slice(i, i + matchedLen);
    tokens.push({ text: word, isHanzi: true, inDict: index.has(word) });
    i += matchedLen;
  }

  return tokens;
}
