/**
 * =========================================================================
 * HANZIGO - KNOWLEDGE PIPELINE: HANZIGO CORE VOCABULARY PARSER
 * =========================================================================
 * Chuyển đổi tập 455 từ vựng HSK 1-3 đã kiểm duyệt từ `src/data/chineseData.js`
 * thành cấu trúc chunk chuẩn hóa phục vụ RAG và cơ sở dữ liệu Supabase.
 * =========================================================================
 */

import crypto from 'crypto';
import { VOCABULARY_LIST } from '../../../src/data/chineseData.js';
import { normalizeUnicodeNfc } from '../normalizer.js';

export const HANZIGO_CORE_METADATA = {
  source_key: 'hanzigo-core-curriculum',
  title: 'Giáo trình chuẩn HanziGo HSK 1-3 & Từ điển giải nghĩa Tiếng Việt',
  category: 'curriculum',
  hsk_level: 'HSK 1-3',
  author: 'Ban Biên Tập HanziGo',
  publisher: 'HanziGo Open Curriculum Initiative',
  source_url: 'https://hanzigo.edu.vn/curriculum/standard',
  license_identifier: 'HanziGo-Curated-Original',
  attribution: 'Ban Biên Tập HanziGo & Giáo trình Chuẩn HSK',
  version: '1.2.0',
  review_status: 'curated_verified',
  is_verified: true
};

/**
 * Trích xuất và chuẩn hóa toàn bộ 455 từ vựng thành các chunk RAG
 * @param {Array} [vocabList=VOCABULARY_LIST]
 * @returns {{ records: Array, errors: Array, totalCount: number }}
 */
export function parseHanzigoCoreVocabulary(vocabList = VOCABULARY_LIST) {
  const records = [];
  const errors = [];

  for (let i = 0; i < vocabList.length; i++) {
    const item = vocabList[i];
    try {
      if (!item.hanzi || !item.meaning) {
        errors.push({ index: i, reason: 'Thiếu hanzi hoặc meaning bắt buộc' });
        continue;
      }

      const simplified = normalizeUnicodeNfc(item.hanzi);
      const pinyin = normalizeUnicodeNfc(item.pinyin || '');
      const meaning = normalizeUnicodeNfc(item.meaning);
      const level = item.level || 'HSK 1';
      const topic = item.topic || 'Từ vựng';

      // Tính khóa chunk_key duy nhất (SHA-256)
      const rawKey = `hanzigo-core::${simplified}::${pinyin}::${level}`;
      const chunkKey = crypto.createHash('sha256').update(rawKey, 'utf8').digest('hex').slice(0, 32);

      // Xây dựng ghi chú sư phạm từ mẹo nhớ và bộ thủ
      const notesParts = [];
      if (item.hanviet) notesParts.push(`Âm Hán Việt: ${item.hanviet}`);
      if (item.radical) notesParts.push(`Bộ thủ: ${item.radical}`);
      if (item.mnemonic) notesParts.push(`Mẹo ghi nhớ: ${item.mnemonic}`);
      const pedagogicalNotes = notesParts.join(' • ');

      // Ví dụ minh họa
      const examples = [];
      if (item.example && item.example.hanzi) {
        examples.push({
          chinese: normalizeUnicodeNfc(item.example.hanzi),
          pinyin: normalizeUnicodeNfc(item.example.pinyin || ''),
          vietnamese: normalizeUnicodeNfc(item.example.meaning || '')
        });
      }

      records.push({
        chunk_key: chunkKey,
        chunk_type: 'vocab_entry',
        hsk_level: level,
        topic: topic,
        simplified: simplified,
        traditional: simplified, // Có thể bổ sung từ điển phồn thể
        pinyin: pinyin,
        pinyin_numbered: null,
        vietnamese_meaning: meaning,
        pedagogical_notes: pedagogicalNotes,
        grammar_pattern: null,
        example_sentences: examples,
        license_identifier: HANZIGO_CORE_METADATA.license_identifier,
        attribution: HANZIGO_CORE_METADATA.attribution,
        review_status: 'curated_verified',
        is_verified: true,
        metadata: {
          radical: item.radical || null,
          strokes: item.strokes || null,
          mnemonic: item.mnemonic || null,
          hanviet: item.hanviet || null,
          vocab_id: item.id
        }
      });
    } catch (err) {
      errors.push({ index: i, reason: err.message });
    }
  }

  return {
    records,
    errors,
    totalCount: records.length
  };
}
