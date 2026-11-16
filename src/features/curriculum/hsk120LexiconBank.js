// =========================================================================
// HANZIGO UNIFIED LEXICON BANK (HSK 1-9 · 180 LESSONS)
// File: src/features/curriculum/hsk120LexiconBank.js
// =========================================================================

import { HSK_120_LESSONS } from './hsk120CurriculumData.js';
import { HSK120_SUPPLEMENTAL_VOCAB } from './hsk120SupplementalVocab.js';
import { HSK_7_TO_9_RAW_LEXICON } from './hsk7to9LexiconAndGrammarBank.js';

export const RAW_LEXICON_ENTRIES = {};

for (const lesson of HSK_120_LESSONS) {
  const combined = [
    ...(lesson.step2_vocabulary || []),
    ...(lesson.extendedVocabulary || []),
  ];
  for (const v of combined) {
    if (v?.hanzi && !RAW_LEXICON_ENTRIES[v.hanzi]) {
      RAW_LEXICON_ENTRIES[v.hanzi] = `${v.pinyin || ''}|${String(v.hanviet || '').toUpperCase()}|${v.pos || 'Từ vựng'}|${v.meaning || ''}|${v.radical || 'Chữ Hán'}`;
    }
  }
}

for (const [hanzi, entry] of Object.entries(HSK120_SUPPLEMENTAL_VOCAB)) {
  if (!RAW_LEXICON_ENTRIES[hanzi]) {
    RAW_LEXICON_ENTRIES[hanzi] = `${entry.pinyin || ''}|${String(entry.hanviet || '').toUpperCase()}|${entry.pos || 'Từ vựng'}|${entry.meaning || ''}|${entry.topic || 'HSK 1-6'}`;
  }
}

// Merge HSK 7-9 Academic Lexicon so HSK 1-9 shares one authoritative bank
Object.assign(RAW_LEXICON_ENTRIES, HSK_7_TO_9_RAW_LEXICON);

export function getUnifiedLexiconEntry(word) {
  const raw = RAW_LEXICON_ENTRIES[word];
  if (!raw) return null;
  const [pinyin = '', hanViet = '', pos = '', meaning = '', radical = ''] = String(raw).split('|');
  return { simplified: word, pinyin, hanViet, pos, meaning, radical };
}

/**
 * Tra cứu và chuẩn hóa mục từ vựng từ ngân hàng HSK 1-6 (kết hợp bài học và từ điển bổ sung)
 */
export function resolveCuratedLexiconItem(word, lessonMeta = {}, orderIndex = 1) {
  const combined = [
    ...(lessonMeta?.step2_vocabulary || []),
    ...(lessonMeta?.extendedVocabulary || []),
  ];
  const matched = combined.find((v) => v?.hanzi === word || v?.simplified === word);
  const supp = HSK120_SUPPLEMENTAL_VOCAB[word];
  const unified = getUnifiedLexiconEntry(word);
  const hanziStepMatch = (lessonMeta?.step3_hanzi || []).find(
    (h) => word && word.includes(h?.hanzi)
  );

  const src = matched || supp || {};
  const pinyin = src.pinyin || unified?.pinyin || lessonMeta?.pinyin || '';
  const hanViet = String(
    src.hanviet || src.hanViet || unified?.hanViet || word
  ).toUpperCase();
  const pos = src.pos || unified?.pos || 'Từ vựng';
  const meaningVi = src.meaning || src.meaningVi || unified?.meaning || lessonMeta?.vi || word;
  const radical = src.radical || unified?.radical || `Bộ ${hanziStepMatch?.hanzi || word[0] || '汉字'}`;
  const strokeCount =
    Number(src.strokes || src.strokeCount || hanziStepMatch?.strokesCount) ||
    word.length * 8;
  const mnemonicVi =
    src.mnemonic ||
    src.mnemonicVi ||
    hanziStepMatch?.mnemonic ||
    `Từ vựng HSK ${lessonMeta?.level || 1} “${word}” (${hanViet} — ${meaningVi}), xuất hiện trong Bài #${lessonMeta?.numericId || lessonMeta?.id || 1} 《${lessonMeta?.zh || lessonMeta?.chineseTitle || word}》.`;

  const exObj = typeof src.example === 'object' && src.example !== null ? src.example : null;
  const exampleZh =
    exObj?.hanzi ||
    src.exampleZh ||
    `我们在学习《${lessonMeta?.zh || lessonMeta?.chineseTitle || word}》时，要熟练运用“${word}”。`;
  const examplePinyin =
    exObj?.pinyin ||
    src.examplePinyin ||
    `Wǒmen zài xuéxí “${lessonMeta?.pinyin || pinyin}” shí, yào shúliàn yùnyòng “${pinyin}”.`;
  const exampleVi =
    exObj?.meaning ||
    src.exampleVi ||
    `Khi học bài “${lessonMeta?.vi || lessonMeta?.title || word}”, cần vận dụng thành thạo từ “${word}” (${meaningVi.split(',')[0]}).`;

  return {
    order: orderIndex,
    simplified: word,
    traditional: src.traditional || word,
    pinyin,
    hanViet,
    pos,
    meaningVi,
    radical,
    strokeCount,
    mnemonicVi,
    exampleZh,
    examplePinyin,
    exampleVi,
  };
}

export default RAW_LEXICON_ENTRIES;
