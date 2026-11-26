import test from 'node:test';
import assert from 'node:assert/strict';

import { buildHskQuestionPayloads } from '../scripts/seedHskExams.js';
import { HSK_EXAMS, getFullExamById } from '../src/data/hskExamsData.js';
import { ensureAllExamSupplementsLoaded } from '../src/data/examSupplements/index.js';
import { ensureAllFullStandardExamsLoaded } from '../src/data/hsk30/index.js';

const VIETNAMESE_EXCLUSIVE_RE =
  /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõồốộổỗơờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
const VIETNAMESE_TONE_OR_DIACRITIC_RE =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const VIETNAMESE_KEYWORD_RE =
  /\b(Đúng|Sai|True|False|Chọn|Nghe|Đọc|Viết|Dịch|Câu hỏi|Trả lời|Phương án|Hoàn thành|Lưu nháp|Bài đọc|Đoạn văn)\b/i;

function isValidViToZhTranslation(q) {
  const qType = String(q.question_type || q.questionType || q.type || '').toLowerCase();
  const skill = String(q.part_type || q.skill || '').toLowerCase();
  const dir = String(q.direction || '').toLowerCase();
  const prompt = String(q.prompt || '');
  return (
    (qType === 'translation' || skill === 'translation') &&
    (dir === 'vi_to_zh' || prompt.includes('越译汉') || prompt.includes('翻译成符合') || prompt.includes('翻译成严谨规范'))
  );
}

function containsDisallowedVietnamese(text, { allowPinyinTokens = false } = {}) {
  if (typeof text !== 'string' || !text.trim()) return false;
  if (VIETNAMESE_KEYWORD_RE.test(text)) return true;

  // Characters exclusively Vietnamese (circumflex/breve/horn/đ/dấu hỏi/ngã/nặng/sắc-huyền on y)
  const exclusiveOnly = /[ăâđêôơưạảãầấậẩẫằắặẳẵẹẻẽềếệểễịỉĩọỏõồốộổỗơờớợởỡụủũừứựửữỳýỵỷỹ]/i;
  if (exclusiveOnly.test(text)) return true;

  if (!allowPinyinTokens) {
    return VIETNAMESE_TONE_OR_DIACRITIC_RE.test(text);
  }

  // In explicit Pinyin-to-Hanzi prompts (看拼音选汉字 / 根据拼音写汉字), strip valid Pinyin syllables before checking
  const isExplicitPinyinPrompt = /看拼音|根据拼音/.test(text);
  if (!isExplicitPinyinPrompt) {
    return VIETNAMESE_TONE_OR_DIACRITIC_RE.test(text);
  }
  const stripped = text.replace(/[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü']+/gi, '');
  return VIETNAMESE_EXCLUSIVE_RE.test(stripped) || VIETNAMESE_TONE_OR_DIACRITIC_RE.test(stripped);
}

test('Pure-Chinese Guard: 0 Vietnamese leaks across all 1,726+ HSK exam payloads', async () => {
  const payloads = await buildHskQuestionPayloads();
  assert.ok(payloads.length >= 1700, `Expected >= 1700 question payloads, found ${payloads.length}`);

  const leaks = [];
  let validTranslationExceptions = 0;

  for (const q of payloads) {
    if (isValidViToZhTranslation(q)) {
      validTranslationExceptions += 1;
    } else if (containsDisallowedVietnamese(q.prompt, { allowPinyinTokens: true })) {
      leaks.push(`${q.id}.prompt: ${q.prompt}`);
    }

    if (containsDisallowedVietnamese(q.audio_script)) {
      leaks.push(`${q.id}.audio_script: ${q.audio_script}`);
    }

    const opts = Array.isArray(q.options) ? q.options : [];
    for (const opt of opts) {
      const optText = typeof opt === 'string' ? opt : String(opt?.text || '');
      if (containsDisallowedVietnamese(optText)) {
        leaks.push(`${q.id}.options: ${optText}`);
      }
    }

    if (Array.isArray(q.words) && q.words.some((w) => containsDisallowedVietnamese(String(w)))) {
      leaks.push(`${q.id}.words: ${q.words.join('|')}`);
    }

    const isZhToViTrans =
      String(q.question_type || '').toLowerCase() === 'translation' && !isValidViToZhTranslation(q);
    if (!isZhToViTrans && q.sample_answer && containsDisallowedVietnamese(q.sample_answer)) {
      leaks.push(`${q.id}.sample_answer: ${q.sample_answer}`);
    }
  }

  assert.equal(validTranslationExceptions, 4, 'Expected exactly 4 valid vi_to_zh translation tasks');
  assert.deepEqual(leaks, [], `Found Vietnamese leaks in exam-face fields:\n${leaks.slice(0, 15).join('\n')}`);
});

test('True/False & MCQ Structural Integrity after Pure-Chinese normalization', async () => {
  await ensureAllExamSupplementsLoaded();
  const { hsk30Exams = [], hsk20FullExams = [] } = await ensureAllFullStandardExamsLoaded();
  const allExams = [
    ...HSK_EXAMS.map((e) => getFullExamById(e.id)),
    ...hsk20FullExams,
    ...hsk30Exams,
  ].filter(Boolean);

  for (const exam of allExams) {
    for (const q of exam.questions || []) {
      const opts = Array.isArray(q.options) ? q.options : [];
      if (opts.length === 2) {
        const texts = opts.map((o) => (typeof o === 'string' ? o : String(o?.text || '')));
        const qType = String(q.question_type || q.questionType || q.type || '').toLowerCase();
        if (qType === 'true_false' || texts[0] === '对' || texts[1] === '错') {
          assert.deepEqual(texts, ['对', '错'], `Expected pure Chinese 对/错 options on ${q.id}`);
        }
      }

      if (opts.length >= 2) {
        const idx =
          typeof q.correct_option_index === 'number'
            ? q.correct_option_index
            : typeof q.correctIndex === 'number'
              ? q.correctIndex
              : -1;
        assert.ok(
          idx >= 0 && idx < opts.length,
          `Invalid correctIndex on ${exam.id}/${q.id}: ${idx}`
        );

        const normOpts = opts.map((o) =>
          String(typeof o === 'string' ? o : o?.text || '')
            .replace(/^[A-E]\.\s*/, '')
            .trim()
        );
        assert.equal(
          new Set(normOpts).size,
          normOpts.length,
          `Duplicate option text detected on ${exam.id}/${q.id}`
        );
      }
    }
  }
});
