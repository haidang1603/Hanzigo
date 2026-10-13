/**
 * =========================================================================
 * HANZIGO - KNOWLEDGE PIPELINE: CC-CEDICT PARSER
 * =========================================================================
 * Bộ phân tích cú pháp chuẩn cho từ điển mã nguồn mở CC-CEDICT.
 * Giấy phép nguồn: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0).
 * Cấu trúc dòng CC-CEDICT:
 *   Traditional Simplified [pin1 yin1] /definition 1/definition 2/
 * =========================================================================
 */

import { 
  normalizeUnicodeNfc, 
  convertNumberedPinyinToAccented, 
  containsChineseCharacters 
} from '../normalizer.js';

export const CC_CEDICT_METADATA = {
  source_key: 'cc-cedict-v1',
  title: 'CC-CEDICT Chinese-English Comprehensive Dictionary',
  category: 'dictionary',
  hsk_level: 'All',
  author: 'MDBG & Community Contributors (founded by Paul Denisowski)',
  publisher: 'MDBG Project',
  source_url: 'https://www.mdbg.net/chinese/dictionary?page=cedict',
  license_identifier: 'CC-BY-SA-4.0',
  attribution: 'CC-CEDICT (MDBG / Denisowski / Licensed under CC BY-SA 4.0)',
  version: '2026.10',
  review_status: 'curated_verified',
  is_verified: true
};

/**
 * Phân tích 1 dòng của tệp CC-CEDICT
 * @param {string} line 
 * @param {number} lineNumber 
 * @returns {{ valid: boolean, record?: Object, error?: string }}
 */
export function parseCcCedictLine(line, lineNumber = 1) {
  if (!line || typeof line !== 'string') {
    return { valid: false, error: 'Dòng trống hoặc không phải chuỗi.' };
  }

  const trimmed = line.trim();

  // Bỏ qua dòng chú thích
  if (trimmed.startsWith('#') || !trimmed) {
    return { valid: false, isComment: true };
  }

  // Regex bắt chuẩn CC-CEDICT: Traditional Simplified [pinyin] /definitions/
  const match = trimmed.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);
  if (!match) {
    return { 
      valid: false, 
      error: `Cú pháp không hợp lệ tại dòng ${lineNumber}: "${trimmed.slice(0, 80)}"`,
      raw: trimmed 
    };
  }

  const traditional = normalizeUnicodeNfc(match[1]);
  const simplified = normalizeUnicodeNfc(match[2]);
  const pinyinNumbered = normalizeUnicodeNfc(match[3]);
  const rawDefinitions = match[4];

  // Kiểm tra tính hợp lệ của chữ Hán
  if (!containsChineseCharacters(simplified)) {
    return {
      valid: false,
      error: `Từ tại dòng ${lineNumber} không chứa chữ Hán hợp lệ: "${simplified}"`,
      raw: trimmed
    };
  }

  const pinyinAccented = convertNumberedPinyinToAccented(pinyinNumbered);
  const definitions = rawDefinitions
    .split('/')
    .map(d => normalizeUnicodeNfc(d))
    .filter(Boolean);

  if (definitions.length === 0) {
    return {
      valid: false,
      error: `Không tìm thấy định nghĩa hợp lệ tại dòng ${lineNumber}.`,
      raw: trimmed
    };
  }

  return {
    valid: true,
    record: {
      chunk_type: 'vocab_entry',
      simplified,
      traditional,
      pinyin: pinyinAccented,
      pinyin_numbered: pinyinNumbered,
      definitions_en: definitions,
      // Định dạng nghĩa phục vụ gia sư (gồm cả đối chiếu Anh - Việt)
      vietnamese_meaning: definitions.join('; '),
      license_identifier: CC_CEDICT_METADATA.license_identifier,
      attribution: CC_CEDICT_METADATA.attribution,
      review_status: CC_CEDICT_METADATA.review_status,
      is_verified: CC_CEDICT_METADATA.is_verified,
      metadata: {
        original_source: CC_CEDICT_METADATA.source_key,
        line_number: lineNumber,
        definitions_count: definitions.length
      }
    }
  };
}

/**
 * Phân tích toàn bộ nội dung tệp hoặc buffer CC-CEDICT
 * @param {string} content 
 * @returns {{ records: Array, errors: Array, totalLines: number, commentLines: number }}
 */
export function parseCcCedictContent(content) {
  if (!content || typeof content !== 'string') {
    return { records: [], errors: [{ error: 'Nội dung trống.' }], totalLines: 0, commentLines: 0 };
  }

  const lines = content.split(/\r?\n/);
  const records = [];
  const errors = [];
  let commentLines = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const result = parseCcCedictLine(line, lineNum);
    if (result.valid) {
      records.push(result.record);
    } else if (result.isComment) {
      commentLines++;
    } else {
      errors.push({ line: lineNum, error: result.error, raw: result.raw });
    }
  });

  return {
    records,
    errors,
    totalLines: lines.length,
    commentLines
  };
}
