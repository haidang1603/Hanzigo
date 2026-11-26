/**
 * =========================================================================
 * HANZI GO — DYNAMIC SESSION OPTION SHUFFLER (PURE & DETERMINISTIC)
 * =========================================================================
 * Xáo trộn thứ tự phương án A/B/C/D theo từng phiên làm bài (sessionSeed),
 * giữ nguyên tính bất biến (immutability) cho dữ liệu đề thi gốc trong src/data/,
 * đồng bộ mảng song song, lời giải (single-pass regex) và ánh xạ ngược về chỉ số gốc
 * khi nộp bài lên server (/api/hsk/submit).
 */

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const EXCLUDED_QUESTION_TYPES = new Set([
  'true_false',
  'reorder',
  'writing_reorder',
  'reorder_sentence',
  'fill_blank',
  'essay',
  'essay_summary',
  'free_writing',
  'translation',
  'speaking',
]);

const POSITION_DEPENDENT_OPTION_REGEX =
  /cả\s+[a-d]\s+và\s+[a-d]|tất cả các đáp án|không có đáp án nào|đáp án trên|phương án trên|以上都|以上都不|以上均/i;

const SENTENCE_ORDER_OPTION_REGEX = /^[A-C]\s*-\s*[A-C]/;

function fnv1aHash(str) {
  let h = 0x811c9dc5;
  const input = String(str || '');
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function createMulberry32(seedStr) {
  let a = fnv1aHash(seedStr) || 1;
  return function nextRandom() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getOptionRawText(opt) {
  if (typeof opt === 'string') return opt;
  if (opt && typeof opt === 'object') return String(opt.text ?? opt.label ?? opt.value ?? '');
  return '';
}

function isSentenceOrderMcq(question) {
  if (!question || !Array.isArray(question.options)) return false;
  return question.options.some((opt) => SENTENCE_ORDER_OPTION_REGEX.test(getOptionRawText(opt).trim()));
}

function isExcludedPositionBlankQuestion(question) {
  const id = String(question?.id || '');
  return /^q-hsk6-full-07\d$/.test(id) || id === 'q-hsk6-full-080';
}

/**
 * Kiểm tra câu hỏi có đủ điều kiện xáo trộn phương án động hay không.
 */
export function isQuestionEligibleForOptionShuffle(question) {
  if (!question || !Array.isArray(question.options) || question.options.length < 3) {
    return false;
  }

  const normalizedTypes = [question.type, question.question_type, question.questionType]
    .filter(Boolean)
    .map((t) => String(t).toLowerCase());

  if (normalizedTypes.some((t) => EXCLUDED_QUESTION_TYPES.has(t))) {
    return false;
  }

  if (question.is_subjective || isExcludedPositionBlankQuestion(question)) {
    return false;
  }

  for (const opt of question.options) {
    const text = getOptionRawText(opt);
    if (POSITION_DEPENDENT_OPTION_REGEX.test(text)) {
      return false;
    }
  }

  return true;
}

/**
 * Sinh sessionSeed duy nhất cho một phiên làm bài mới.
 */
export function createExamSessionSeed(examId = 'exam') {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${String(examId || 'exam')}:${Date.now()}:${rand}`;
}

function cloneAndRelabelOption(opt, newIndex) {
  const newLetter = LETTERS[newIndex] || String.fromCharCode(65 + newIndex);
  if (typeof opt === 'string') {
    if (SENTENCE_ORDER_OPTION_REGEX.test(opt.trim())) return opt;
    return opt.replace(/^([A-D])\.(?=\s*)/, `${newLetter}.`);
  }
  if (opt && typeof opt === 'object') {
    const cloned = { ...opt };
    if (typeof cloned.id === 'string' && /^[A-D]$/.test(cloned.id)) {
      cloned.id = newLetter;
    }
    if (typeof cloned.text === 'string' && !SENTENCE_ORDER_OPTION_REGEX.test(cloned.text.trim())) {
      cloned.text = cloned.text.replace(/^([A-D])\.(?=\s*)/, `${newLetter}.`);
    }
    return cloned;
  }
  return opt;
}

/**
 * Ánh xạ ký hiệu chữ cái phương án (A/B/C/D) trong lời giải bằng 1 lượt regex duy nhất
 * để tránh hoàn toàn lỗi thay thế dây chuyền (ví dụ A -> B rồi B lại thành C).
 */
export function remapExplanationLettersSinglePass(text, oldToNew, isOrdering = false) {
  if (typeof text !== 'string' || !text || !Array.isArray(oldToNew) || oldToNew.length === 0) {
    return text;
  }

  const mapLetter = (letter) => {
    const oldIdx = LETTERS.indexOf(letter);
    if (oldIdx < 0 || oldToNew[oldIdx] === undefined) return letter;
    return LETTERS[oldToNew[oldIdx]] || letter;
  };

  if (isOrdering) {
    return text.replace(
      /(Đáp án(?:\s+chính\s+xác|\s+đúng)?(?:\s+là)?|Chọn(?:\s+phương\s+án)?|[Pp]hương\s+án|loại(?:\s+trừ)?(?:\s+phương\s+án)?)\s+([A-D])(?![\p{L}\p{N}])/gu,
      (_, prefix, letter) => `${prefix} ${mapLetter(letter)}`
    );
  }

  return text.replace(
    /((?:Đáp án(?:\s+chính\s+xác|\s+đúng)?(?:\s+là)?|Chọn(?:\s+phương\s+án)?|[Pp]hương\s+án|[Cc]âu|loại(?:\s+trừ)?(?:\s+phương\s+án)?|bỏ(?:\s+phương\s+án)?)\s+)([A-D])(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])([A-D])(?=\s+(?:hoàn toàn|mắc lỗi|lỗi|sai|chuẩn xác|chính xác|là\s+đúng|phạm lỗi|đúng))|(->\s*)([A-D])(?![\p{L}\p{N}])|(\()([A-D])(\)(?=\s+(?:đúng|sai|hoàn toàn|chuẩn xác|mắc lỗi|chính xác)))/gu,
    (match, p1, c1, c2, p3, c3, p4, c4, s4) => {
      if (c1) return `${p1}${mapLetter(c1)}`;
      if (c2) return mapLetter(c2);
      if (c3) return `${p3}${mapLetter(c3)}`;
      if (c4) return `${p4}${mapLetter(c4)}${s4}`;
      return match;
    }
  );
}

function buildFisherYatesPermutation(length, seedKey) {
  const perm = Array.from({ length }, (_, idx) => idx);
  const rng = createMulberry32(seedKey);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

function cloneQuestionShallow(question) {
  if (!question || typeof question !== 'object') return question;
  const copy = { ...question };
  if (Array.isArray(question.options)) {
    copy.options = question.options.map((opt) =>
      opt && typeof opt === 'object' ? { ...opt } : opt
    );
  }
  if (Array.isArray(question.optionsPinyin)) copy.optionsPinyin = [...question.optionsPinyin];
  if (Array.isArray(question.optionsTranslation)) copy.optionsTranslation = [...question.optionsTranslation];
  if (Array.isArray(question.optionImages)) copy.optionImages = [...question.optionImages];
  return copy;
}

/**
 * Hàm thuần khiết xáo trộn phương án A/B/C/D cho danh sách câu hỏi trong 1 phiên thi.
 * Tuyệt đối KHÔNG mutate dữ liệu câu hỏi gốc.
 */
export function shuffleSessionQuestions(questions, { enabled = true, sessionSeed = '' } = {}) {
  if (!Array.isArray(questions)) return [];

  const shouldShuffle = Boolean(enabled) && Boolean(sessionSeed);

  return questions.map((question, qIndex) => {
    const baseClone = cloneQuestionShallow(question);
    if (!shouldShuffle || !isQuestionEligibleForOptionShuffle(question)) {
      return baseClone;
    }

    const optionCount = question.options.length;
    const perm = buildFisherYatesPermutation(
      optionCount,
      `${String(sessionSeed)}::${String(question.id ?? qIndex)}`
    );
    const oldToNew = new Array(optionCount);
    perm.forEach((origIdx, newIdx) => {
      oldToNew[origIdx] = newIdx;
    });

    const isOrdering = isSentenceOrderMcq(question);

    baseClone.options = perm.map((origIdx, newIdx) =>
      cloneAndRelabelOption(question.options[origIdx], newIdx)
    );

    if (Array.isArray(question.optionsPinyin) && question.optionsPinyin.length === optionCount) {
      baseClone.optionsPinyin = perm.map((origIdx) => question.optionsPinyin[origIdx]);
    }
    if (Array.isArray(question.optionsTranslation) && question.optionsTranslation.length === optionCount) {
      baseClone.optionsTranslation = perm.map((origIdx) => question.optionsTranslation[origIdx]);
    }
    if (Array.isArray(question.optionImages) && question.optionImages.length === optionCount) {
      baseClone.optionImages = perm.map((origIdx) => question.optionImages[origIdx]);
    }

    if (typeof question.correctIndex === 'number' && oldToNew[question.correctIndex] !== undefined) {
      baseClone.correctIndex = oldToNew[question.correctIndex];
    }
    if (
      typeof question.correct_option_index === 'number' &&
      oldToNew[question.correct_option_index] !== undefined
    ) {
      baseClone.correct_option_index = oldToNew[question.correct_option_index];
    }
    if (typeof question.correctAnswer === 'number' && oldToNew[question.correctAnswer] !== undefined) {
      baseClone.correctAnswer = oldToNew[question.correctAnswer];
    } else if (typeof question.correctAnswer === 'string') {
      const upper = question.correctAnswer.trim().toUpperCase();
      const letterIdx = LETTERS.indexOf(upper);
      if (letterIdx >= 0 && letterIdx < optionCount && oldToNew[letterIdx] !== undefined) {
        baseClone.correctAnswer = LETTERS[oldToNew[letterIdx]];
      }
    }

    if (typeof question.explanationVi === 'string') {
      baseClone.explanationVi = remapExplanationLettersSinglePass(
        question.explanationVi,
        oldToNew,
        isOrdering
      );
    }
    if (typeof question.explanation === 'string') {
      baseClone.explanation = remapExplanationLettersSinglePass(
        question.explanation,
        oldToNew,
        isOrdering
      );
    }

    baseClone._optionOriginalIndices = perm;
    return baseClone;
  });
}

/**
 * Quy đổi đáp án người học đã chọn trên phiên đã xáo trộn về chỉ số gốc (originalIndex)
 * để khớp 100% với đáp án gốc trong Supabase / backend (/api/hsk/submit).
 */
export function remapSelectedAnswerToOriginal(question, selectedValue) {
  if (!question || !Array.isArray(question._optionOriginalIndices)) {
    return selectedValue;
  }
  if (typeof selectedValue === 'number' && Number.isInteger(selectedValue)) {
    const mapped = question._optionOriginalIndices[selectedValue];
    return typeof mapped === 'number' ? mapped : selectedValue;
  }
  return selectedValue;
}

/**
 * Quy đổi toàn bộ bảng đáp án phiên thi `{ [questionId]: selectedValue }` về chỉ số gốc
 * trước khi gửi payload lên server (/api/hsk/submit hoặc submitExamAttempt).
 */
export function remapAnswersToOriginalIndices(questions = [], answersMap = {}) {
  const result = { ...(answersMap || {}) };
  if (!Array.isArray(questions) || !answersMap || typeof answersMap !== 'object') {
    return result;
  }
  for (const question of questions) {
    if (!question || !question.id) continue;
    if (Object.prototype.hasOwnProperty.call(answersMap, question.id)) {
      result[question.id] = remapSelectedAnswerToOriginal(question, answersMap[question.id]);
    }
  }
  return result;
}

/**
 * Đồng bộ kết quả phản hồi tức thì (Learning Mode) từ dữ liệu câu hỏi gốc
 * sang đúng vị trí A/B/C/D của phiên thi đã xáo trộn.
 */
export function remapFeedbackForShuffledQuestion(feedback, shuffledQuestion) {
  if (
    !feedback ||
    feedback.blocked ||
    !shuffledQuestion ||
    !Array.isArray(shuffledQuestion._optionOriginalIndices)
  ) {
    return feedback;
  }

  const perm = shuffledQuestion._optionOriginalIndices;
  const oldToNew = new Array(perm.length);
  perm.forEach((origIdx, newIdx) => {
    oldToNew[origIdx] = newIdx;
  });

  const nextFeedback = { ...feedback };
  if (typeof feedback.correctIndex === 'number' && oldToNew[feedback.correctIndex] !== undefined) {
    const newCorrectIdx = oldToNew[feedback.correctIndex];
    nextFeedback.correctIndex = newCorrectIdx;
    const syncedOpt = Array.isArray(shuffledQuestion.options)
      ? shuffledQuestion.options[newCorrectIdx]
      : null;
    if (syncedOpt) {
      nextFeedback.correctAnswerText = getOptionRawText(syncedOpt);
    }
  }
  if (typeof feedback.explanationVi === 'string') {
    nextFeedback.explanationVi = remapExplanationLettersSinglePass(
      feedback.explanationVi,
      oldToNew,
      isSentenceOrderMcq(shuffledQuestion)
    );
  }
  return nextFeedback;
}
