/**
 * =========================================================================
 * HANZI GO — IMMUTABLE EXAM ATTEMPT SNAPSHOT (SNAPSHOT_VERSION = 1)
 * =========================================================================
 * Helper thuần khiết dùng chung cho cả Backend (/api/hsk/submit, /api/hsk/attempt)
 * và Client (hskService, hskExamBlueprints, HskPracticePage).
 *
 * Mục tiêu:
 * - Đóng băng hoàn toàn ngữ cảnh câu hỏi, đáp án người học chọn và đáp án đúng
 *   tại thời điểm nộp bài để lịch sử bài thi cũ không bao giờ bị lệch khi
 *   hsk_questions thay đổi thứ tự A/B/C/D về sau.
 * - Tối ưu dung lượng (cắt gọn văn bản dài, không lưu base64 ảnh / audioText).
 */

export const SNAPSHOT_VERSION = 1;
export const MAX_LOCAL_SNAPSHOT_ATTEMPTS = 12;

const MAX_PROMPT_LEN = 320;
const MAX_TEXT_LEN = 500;
const MAX_EXPLANATION_LEN = 600;
const MAX_OPTION_LEN = 220;

const BASE64_DATA_URI_REGEX = /data:[^;\s]+;base64,[A-Za-z0-9+/=]+/gi;

function sanitizeLocalImageUrl(value) {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.trim();
  if (!cleaned.startsWith('/images/hsk/')) return undefined;
  if (/data:|https?:/i.test(cleaned)) return undefined;
  return cleaned.slice(0, 220);
}

function sanitizeCompactText(value, maxLen = MAX_TEXT_LEN) {
  if (value === null || value === undefined) return '';
  const cleaned = String(value)
    .replace(BASE64_DATA_URI_REGEX, '[media]')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen - 1)}…`;
}

function getOptionText(opt) {
  if (typeof opt === 'string') return opt;
  if (opt && typeof opt === 'object') {
    return String(opt.text ?? opt.label ?? opt.value ?? '');
  }
  return '';
}

function normalizeSnapshotQuestionType(question = {}) {
  const raw = String(
    question.questionType || question.question_type || question.type || ''
  ).toLowerCase();

  if (raw === 'true_false') return 'true_false';
  if (raw === 'reorder' || raw === 'reorder_sentence' || raw === 'writing_reorder') return 'reorder';
  if (raw === 'fill_blank') return 'fill_blank';
  if (raw === 'essay' || raw === 'essay_summary' || raw === 'free_writing') return 'essay';
  if (raw === 'translation') return 'translation';
  if (raw === 'speaking') return 'speaking';
  if (question.is_subjective || question.isSubjective) return 'essay';
  if (Array.isArray(question.options) && question.options.length === 2) return 'true_false';
  return 'mcq';
}

function normalizeSnapshotSkill(question = {}) {
  return String(question.skill || question.part_type || question.partType || question.section || 'reading')
    .toLowerCase();
}

function isSubjectiveSnapshotType(questionType) {
  return questionType === 'essay' || questionType === 'translation' || questionType === 'speaking';
}

/**
 * Tạo snapshot bất biến cho 1 câu hỏi tại thời điểm nộp bài.
 */
export function buildQuestionAnswerSnapshot(
  question = {},
  { userAnswer = null, isCorrect = false, earnedPoints = 0, subjectiveGrade = null } = {}
) {
  const questionType = normalizeSnapshotQuestionType(question);
  const skill = normalizeSnapshotSkill(question);
  const part = Number(question.part || question.part_number || question.partNumber || 1);
  const questionId = String(question.id || question.questionId || '');
  const promptSnapshot = sanitizeCompactText(question.prompt || question.question || '', MAX_PROMPT_LEN);
  const explanationViSnapshot = sanitizeCompactText(
    question.explanationVi || question.explanation || '',
    MAX_EXPLANATION_LEN
  );

  if (isSubjectiveSnapshotType(questionType)) {
    const submittedText = sanitizeCompactText(userAnswer || '', MAX_TEXT_LEN * 2);
    const sampleAnswerSnapshot = sanitizeCompactText(
      question.sampleAnswer || question.sample_answer || '',
      MAX_TEXT_LEN
    );
    const maxScore = Number(question.points || 10);
    const rawScore =
      subjectiveGrade && typeof subjectiveGrade.overallScore === 'number'
        ? Number(((maxScore * Math.max(0, Math.min(100, subjectiveGrade.overallScore))) / 100).toFixed(1))
        : Number(earnedPoints || 0);
    const gradingSource = !submittedText
      ? 'skipped'
      : subjectiveGrade?.source === 'ai_rubric' || subjectiveGrade?.gradingSource === 'ai_rubric'
        ? 'ai_rubric'
        : 'deterministic_fallback';

    const imageUrl = sanitizeLocalImageUrl(question.imageUrl || question.image_url);
    const imageAlt = imageUrl ? sanitizeCompactText(question.imageAlt || question.image_alt || '', 160) : undefined;

    return {
      snapshotVersion: SNAPSHOT_VERSION,
      questionId,
      questionNumber: Number(question.question_number || question.questionNumber || 0) || undefined,
      skill,
      part,
      questionType,
      promptSnapshot,
      ...(imageUrl ? { imageUrl, ...(imageAlt ? { imageAlt } : {}) } : {}),
      submittedText,
      sampleAnswerSnapshot,
      scoreAwarded: rawScore,
      maxScore,
      gradingSource,
      feedbackVi: sanitizeCompactText(subjectiveGrade?.feedbackVi || '', MAX_EXPLANATION_LEN),
      explanationViSnapshot,
    };
  }

  // Objective question: mcq, true_false, fill_blank, reorder
  const rawOptions = Array.isArray(question.options) ? question.options : [];
  const optionsSnapshot =
    questionType === 'mcq' || questionType === 'true_false'
      ? rawOptions.map((opt) => sanitizeCompactText(getOptionText(opt), MAX_OPTION_LEN))
      : undefined;

  const rawCorrectIdx =
    typeof question.correct_option_index === 'number'
      ? question.correct_option_index
      : typeof question.correctIndex === 'number'
        ? question.correctIndex
        : null;

  let selectedIndex = null;
  let selectedText = '';
  if (typeof userAnswer === 'number' && Number.isInteger(userAnswer)) {
    selectedIndex = userAnswer;
    selectedText =
      rawOptions[userAnswer] !== undefined
        ? sanitizeCompactText(getOptionText(rawOptions[userAnswer]), MAX_OPTION_LEN)
        : '';
  } else if (Array.isArray(userAnswer)) {
    selectedText = userAnswer.map((w) => sanitizeCompactText(w, 60));
  } else if (typeof userAnswer === 'string' && userAnswer.trim() !== '') {
    const asNum = Number(userAnswer);
    if (
      (questionType === 'mcq' || questionType === 'true_false') &&
      Number.isInteger(asNum) &&
      asNum >= 0 &&
      asNum < rawOptions.length
    ) {
      selectedIndex = asNum;
      selectedText = sanitizeCompactText(getOptionText(rawOptions[asNum]), MAX_OPTION_LEN);
    } else {
      selectedText = sanitizeCompactText(userAnswer, MAX_TEXT_LEN);
    }
  }

  let correctText = '';
  if (questionType === 'reorder') {
    correctText = sanitizeCompactText(
      question.correct_sentence ||
        question.correctSentence ||
        (Array.isArray(question.correct_order || question.correctOrder)
          ? (question.correct_order || question.correctOrder).join('')
          : '') ||
        (rawCorrectIdx !== null && rawOptions[rawCorrectIdx] ? getOptionText(rawOptions[rawCorrectIdx]) : ''),
      MAX_TEXT_LEN
    );
  } else if (questionType === 'fill_blank') {
    const accepted = question.accepted_answers || question.acceptedAnswers || [];
    correctText = sanitizeCompactText(
      question.expectedAnswer ||
        (Array.isArray(accepted) && accepted[0]) ||
        (rawCorrectIdx !== null && rawOptions[rawCorrectIdx] ? getOptionText(rawOptions[rawCorrectIdx]) : ''),
      MAX_TEXT_LEN
    );
  } else if (rawCorrectIdx !== null && rawOptions[rawCorrectIdx] !== undefined) {
    correctText = sanitizeCompactText(getOptionText(rawOptions[rawCorrectIdx]), MAX_OPTION_LEN);
  }

  const imageUrl = sanitizeLocalImageUrl(question.imageUrl || question.image_url);
  const imageAlt = imageUrl ? sanitizeCompactText(question.imageAlt || question.image_alt || '', 160) : undefined;

  const snapshot = {
    snapshotVersion: SNAPSHOT_VERSION,
    questionId,
    questionNumber: Number(question.question_number || question.questionNumber || 0) || undefined,
    skill,
    part,
    questionType,
    promptSnapshot,
    ...(imageUrl ? { imageUrl, ...(imageAlt ? { imageAlt } : {}) } : {}),
    selectedIndex,
    selectedText,
    correctIndex: rawCorrectIdx,
    correctText,
    isCorrect: Boolean(isCorrect),
    explanationViSnapshot,
  };

  if (optionsSnapshot) {
    snapshot.optionsSnapshot = optionsSnapshot;
  }

  return snapshot;
}

/**
 * Xây dựng mảng `answerSnapshots` cho toàn bộ bài thi.
 */
export function buildAttemptAnswerSnapshots(
  questions = [],
  { answers = {}, detailedResults = [], subjectiveGrades = {} } = {}
) {
  if (!Array.isArray(questions)) return [];
  const detailById = new Map();
  if (Array.isArray(detailedResults)) {
    for (const d of detailedResults) {
      if (d?.questionId) detailById.set(d.questionId, d);
    }
  }

  return questions.map((q) => {
    const detail = detailById.get(q.id);
    const userAnswer = detail !== undefined ? detail.userAnswer : answers?.[q.id];
    const isCorrect = detail ? Boolean(detail.isCorrect) : false;
    const earnedPoints = detail ? Number(detail.pointsAwarded ?? detail.earnedPoints ?? 0) : 0;
    const subjectiveGrade = subjectiveGrades?.[q.id] || null;
    return buildQuestionAnswerSnapshot(q, {
      userAnswer,
      isCorrect,
      earnedPoints,
      subjectiveGrade,
    });
  });
}

/**
 * Giới hạn dung lượng lưu localStorage:
 * Chỉ giữ `answerSnapshots` (và chi tiết câu hỏi) cho `maxSnapshotAttempts` lượt thi gần nhất;
 * các lượt cũ hơn vẫn giữ nguyên điểm tổng, trạng thái đạt và `skillBreakdown`.
 */
export function compactAttemptsForLocalStorage(
  attempts = [],
  { maxSnapshotAttempts = MAX_LOCAL_SNAPSHOT_ATTEMPTS, maxTotalAttempts = 30 } = {}
) {
  if (!Array.isArray(attempts)) return [];
  const capped = attempts.slice(0, maxTotalAttempts);

  return capped.map((attempt, idx) => {
    if (!attempt || typeof attempt !== 'object') return attempt;
    if (idx < maxSnapshotAttempts) return attempt;

    const {
      answerSnapshots: _prunedSnapshots,
      detailedResults: _prunedDetails,
      ...lightweightSummary
    } = attempt;

    return {
      ...lightweightSummary,
      snapshotsPruned: true,
    };
  });
}

/**
 * Adapter ưu tiên đọc từ `answerSnapshots` bất biến cho màn hình Review (HskResultView).
 * - Nếu có `answerSnapshots` (snapshotVersion >= 1): render từ snapshot đóng băng,
 *   không phụ thuộc vào thứ tự options hay correctIndex hiện tại trong kho đề.
 * - Nếu là bản ghi cũ chưa có snapshot: fallback mượt về `attempt.detailedResults`.
 */
export function resolveReviewItemsFromAttempt(attempt) {
  if (!attempt || typeof attempt !== 'object') return [];

  const snapshots = Array.isArray(attempt.answerSnapshots) ? attempt.answerSnapshots : [];
  const details = Array.isArray(attempt.detailedResults) ? attempt.detailedResults : [];

  if (snapshots.length === 0 || !(snapshots[0]?.snapshotVersion >= 1)) {
    return details;
  }

  const detailById = new Map();
  for (const d of details) {
    if (d?.questionId) detailById.set(d.questionId, d);
  }

  return snapshots.map((snap, idx) => {
    const legacy = detailById.get(snap.questionId) || {};
    const isSubjective = isSubjectiveSnapshotType(snap.questionType);
    const options = Array.isArray(snap.optionsSnapshot)
      ? snap.optionsSnapshot.map((text) => ({ text }))
      : Array.isArray(legacy.options)
        ? legacy.options
        : [];

    return {
      ...legacy,
      questionId: snap.questionId,
      questionNumber: snap.questionNumber || legacy.questionNumber || idx + 1,
      partType: snap.skill || legacy.partType || 'reading',
      partNumber: snap.part || legacy.partNumber || 1,
      questionType:
        snap.questionType === 'reorder'
          ? 'reorder_sentence'
          : snap.questionType === 'essay'
            ? legacy.questionType || 'free_writing'
            : snap.questionType || legacy.questionType || 'multiple_choice',
      prompt: snap.promptSnapshot || legacy.prompt || '',
      imageUrl: snap.imageUrl || legacy.imageUrl,
      imageAlt: snap.imageAlt || legacy.imageAlt,
      options,
      selectedIndex: isSubjective ? null : snap.selectedIndex ?? null,
      selectedText: isSubjective ? snap.submittedText : snap.selectedText,
      userAnswer: isSubjective
        ? snap.submittedText
        : snap.selectedIndex !== null && snap.selectedIndex !== undefined
          ? snap.selectedIndex
          : snap.selectedText,
      correctIndex: isSubjective ? null : snap.correctIndex ?? null,
      correctText: isSubjective ? snap.sampleAnswerSnapshot : snap.correctText,
      correctSentence: snap.questionType === 'reorder' ? snap.correctText : legacy.correctSentence,
      sampleAnswer: isSubjective
        ? snap.sampleAnswerSnapshot || legacy.sampleAnswer || ''
        : legacy.sampleAnswer || '',
      isCorrect: isSubjective ? null : Boolean(snap.isCorrect),
      isSubjective,
      points: isSubjective ? snap.maxScore || legacy.points || 10 : legacy.points || 5,
      pointsAwarded: isSubjective
        ? snap.scoreAwarded ?? legacy.pointsAwarded ?? 0
        : legacy.pointsAwarded ?? (snap.isCorrect ? legacy.points || 5 : 0),
      gradingSource: isSubjective ? snap.gradingSource : undefined,
      feedbackVi: isSubjective ? snap.feedbackVi : undefined,
      explanation: snap.explanationViSnapshot || legacy.explanation || '',
      fromImmutableSnapshot: true,
    };
  });
}
