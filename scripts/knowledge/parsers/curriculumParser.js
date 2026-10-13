/**
 * =========================================================================
 * HANZIGO - KNOWLEDGE PIPELINE: CURRICULUM & GRAMMAR PARSER
 * =========================================================================
 * Bộ phân tích dữ liệu giáo trình tự biên soạn chuẩn HanziGo (HSK 1 - HSK 6).
 * Trích xuất:
 * 1. Mục từ vựng sư phạm (vocab_entry) kèm nghĩa tiếng Việt và ví dụ.
 * 2. Điểm ngữ pháp trọng tâm (grammar_pattern) kèm công thức và giải thích.
 * 3. Tình huống đàm thoại mẫu (dialogue_context) kèm đối thoại bản ngữ.
 * =========================================================================
 */

import { normalizeUnicodeNfc, validateVietnameseText, containsChineseCharacters } from '../normalizer.js';

export const CURRICULUM_METADATA = {
  source_key: 'hanzigo-curriculum-v2',
  title: 'HanziGo Standard Vietnamese-Chinese Pedagogical Curriculum',
  category: 'curriculum',
  hsk_level: 'HSK 1 - HSK 6',
  author: 'HanziGo Academic & Pedagogical Research Department',
  publisher: 'HanziGo Education Platform',
  source_url: 'https://hanzigo-xi.vercel.app/materials',
  license_identifier: 'Educational-CC-BY-NC-SA-4.0',
  attribution: 'HanziGo Pedagogical Curriculum (Licensed under CC BY-NC-SA 4.0 for non-commercial educational use)',
  version: '2.0.0',
  review_status: 'curated_verified',
  is_verified: true
};

/**
 * Phân tích danh sách từ vựng giáo trình
 * @param {Array} rawVocabList 
 * @param {string} defaultHsk 
 * @returns {{ records: Array, errors: Array }}
 */
export function parseCurriculumVocabulary(rawVocabList = [], defaultHsk = 'HSK 1') {
  const records = [];
  const errors = [];

  if (!Array.isArray(rawVocabList)) {
    return { records: [], errors: [{ error: 'Danh sách từ vựng không phải mảng.' }] };
  }

  rawVocabList.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push({ index, error: 'Mục từ vựng không hợp lệ.' });
      return;
    }

    const simplified = normalizeUnicodeNfc(item.word || item.hanzi || item.char || '');
    const pinyin = normalizeUnicodeNfc(item.pinyin || '');
    const vietnamese = normalizeUnicodeNfc(item.meaning || item.vietnamese || item.definition || '');
    const hskLevel = normalizeUnicodeNfc(item.level || item.hskLevel || defaultHsk);

    if (!containsChineseCharacters(simplified)) {
      errors.push({ index, error: `Từ không chứa chữ Hán hợp lệ: "${simplified}"` });
      return;
    }

    const vnCheck = validateVietnameseText(vietnamese);
    if (!vnCheck.valid) {
      errors.push({ index, error: vnCheck.reason, raw: vietnamese });
      return;
    }

    const exampleList = [];
    if (item.example) {
      if (typeof item.example === 'string') {
        exampleList.push({ chinese: item.example, vietnamese: item.exampleMeaning || '' });
      } else if (typeof item.example === 'object') {
        exampleList.push({
          chinese: item.example.chinese || item.example.hanzi || '',
          pinyin: item.example.pinyin || '',
          vietnamese: item.example.vietnamese || item.example.meaning || ''
        });
      }
    }

    records.push({
      chunk_type: 'vocab_entry',
      hsk_level: hskLevel,
      topic: item.category || 'Từ vựng trọng tâm',
      simplified,
      traditional: item.traditional || null,
      pinyin,
      pinyin_numbered: item.pinyinNumbered || null,
      vietnamese_meaning: vietnamese,
      pedagogical_notes: item.tip || item.notes || null,
      example_sentences: exampleList,
      license_identifier: CURRICULUM_METADATA.license_identifier,
      attribution: CURRICULUM_METADATA.attribution,
      review_status: CURRICULUM_METADATA.review_status,
      is_verified: CURRICULUM_METADATA.is_verified,
      metadata: {
        source_key: CURRICULUM_METADATA.source_key,
        radical: item.radical || null,
        strokes: item.strokes || item.strokesCount || null
      }
    });
  });

  return { records, errors };
}

/**
 * Phân tích danh mục ngữ pháp giáo trình
 * @param {Array} rawLessons 
 * @returns {{ records: Array, errors: Array }}
 */
export function parseCurriculumGrammar(rawLessons = []) {
  const records = [];
  const errors = [];

  if (!Array.isArray(rawLessons)) {
    return { records: [], errors: [{ error: 'Danh sách bài học không phải mảng.' }] };
  }

  rawLessons.forEach((lesson, lIdx) => {
    if (!lesson) return;
    const lessonTitle = normalizeUnicodeNfc(lesson.title || `Bài học ${lIdx + 1}`);
    const hskLevel = normalizeUnicodeNfc(lesson.hskLevel || lesson.level || 'HSK 1');

    // Phân tích các điểm ngữ pháp trong bài học
    const grammarPoints = lesson.grammarPoints || lesson.grammar || [];
    if (Array.isArray(grammarPoints)) {
      grammarPoints.forEach((g, gIdx) => {
        const pattern = normalizeUnicodeNfc(g.pattern || g.title || g.rule || '');
        const explanation = normalizeUnicodeNfc(g.explanation || g.desc || g.meaning || '');
        
        if (!pattern && !explanation) {
          errors.push({ lesson: lessonTitle, gIndex: gIdx, error: 'Thiếu công thức hoặc giải thích ngữ pháp.' });
          return;
        }

        const examples = Array.isArray(g.examples) 
          ? g.examples.map(ex => ({
              chinese: normalizeUnicodeNfc(typeof ex === 'string' ? ex : (ex.chinese || ex.hanzi || '')),
              pinyin: normalizeUnicodeNfc(ex.pinyin || ''),
              vietnamese: normalizeUnicodeNfc(ex.vietnamese || ex.meaning || '')
            }))
          : [];

        records.push({
          chunk_type: 'grammar_pattern',
          hsk_level: hskLevel,
          topic: lessonTitle,
          simplified: pattern || lessonTitle,
          grammar_pattern: pattern,
          vietnamese_meaning: explanation,
          pedagogical_notes: g.usageNotes || g.tips || null,
          example_sentences: examples,
          license_identifier: CURRICULUM_METADATA.license_identifier,
          attribution: CURRICULUM_METADATA.attribution,
          review_status: CURRICULUM_METADATA.review_status,
          is_verified: CURRICULUM_METADATA.is_verified,
          metadata: {
            source_key: CURRICULUM_METADATA.source_key,
            lesson_id: lesson.id || `lesson-${lIdx + 1}`,
            lesson_title: lessonTitle
          }
        });
      });
    }
  });

  return { records, errors };
}
