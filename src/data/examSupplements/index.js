/**
 * =========================================================================
 * APPEND-ONLY DYNAMIC EXAM SUPPLEMENT LOADER (ZERO-REGRESSION)
 * =========================================================================
 * Nạp động (lazy import()) các câu hỏi bổ sung cho các đề HSK 2.0 hiện có
 * mà tuyệt đối không xóa, ghi đè hay làm thay đổi dữ liệu gốc trong hskExamsData.js.
 */

import {
  HSK_EXAMS,
  HSK_QUESTIONS,
  DYNAMIC_EXAMS,
  registerDynamicExam,
} from '../hskExamsData.js';

export const SUPPLEMENT_LOADERS = Object.freeze({
  'hsk2-mock-01': () => import('./hsk2Mock01Supplement.js').then((m) => m.HSK2_MOCK01_SUPPLEMENT_QUESTIONS),
  'hsk3-mock-01': () => import('./hsk3Mock01Supplement.js').then((m) => m.HSK3_MOCK01_SUPPLEMENT_QUESTIONS),
  'hsk4-mock-01': () => import('./hsk4Mock01Supplement.js').then((m) => m.HSK4_MOCK01_SUPPLEMENT_QUESTIONS),
  'hsk5-mock-01': () => import('./hsk5Mock01Supplement.js').then((m) => m.HSK5_MOCK01_SUPPLEMENT_QUESTIONS),
});

export const SUPPLEMENTED_EXAM_IDS = Object.freeze(Object.keys(SUPPLEMENT_LOADERS));

export const SUPPLEMENTED_TARGET_TOTALS = Object.freeze({
  'hsk2-mock-01': 60,
  'hsk3-mock-01': 80,
  'hsk4-mock-01': 100,
  'hsk5-mock-01': 100,
});

const loadedSupplementsCache = new Map();

/**
 * Nạp danh sách câu hỏi bổ sung (append-only) cho 1 đề thi theo examId.
 */
export async function loadSupplementQuestionsForExam(examId) {
  if (!SUPPLEMENT_LOADERS[examId]) return [];
  if (loadedSupplementsCache.has(examId)) {
    return loadedSupplementsCache.get(examId);
  }
  const questions = await SUPPLEMENT_LOADERS[examId]();
  const safeList = Array.isArray(questions) ? questions : [];
  loadedSupplementsCache.set(examId, safeList);
  return safeList;
}

/**
 * Gộp (append-only) câu hỏi gốc + câu hỏi bổ sung vào DYNAMIC_EXAMS để làm bài & chấm điểm đủ 100%.
 * Tuyệt đối giữ nguyên toàn bộ id, thứ tự và nội dung của câu hỏi gốc.
 */
export async function ensureExamSupplementLoaded(examId) {
  if (!SUPPLEMENT_LOADERS[examId]) return null;
  if (DYNAMIC_EXAMS.has(examId)) {
    return DYNAMIC_EXAMS.get(examId);
  }

  const baseExam = HSK_EXAMS.find((e) => e.id === examId);
  if (!baseExam) return null;

  const baseQuestions = HSK_QUESTIONS.filter((q) => q.exam_id === examId);
  const supplementQuestions = await loadSupplementQuestionsForExam(examId);

  const existingIds = new Set(baseQuestions.map((q) => q.id));
  const appendedOnly = supplementQuestions.filter((q) => !existingIds.has(q.id));
  const mergedQuestions = [...baseQuestions, ...appendedOnly];

  const mergedExam = {
    ...baseExam,
    examSystem: baseExam.examSystem || 'hsk_2_0',
    base_question_count: baseQuestions.length,
    supplement_question_count: appendedOnly.length,
    total_questions: mergedQuestions.length,
    questions: mergedQuestions,
  };

  registerDynamicExam(mergedExam);
  return mergedExam;
}

/**
 * Nạp toàn bộ các gói bổ sung append-only (dùng cho kiểm định & khởi tạo trước khi thi).
 */
export async function ensureAllExamSupplementsLoaded() {
  const results = [];
  for (const examId of SUPPLEMENTED_EXAM_IDS) {
    const merged = await ensureExamSupplementLoaded(examId);
    if (merged) results.push(merged);
  }
  return results;
}
