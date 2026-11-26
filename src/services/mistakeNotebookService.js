/**
 * =========================================================================
 * HANZI GO — MISTAKE NOTEBOOK SERVICE (USER-ISOLATED & QUOTA-SAFE)
 * =========================================================================
 * Sổ lỗi sai tự động đồng bộ từ Exam Mode, Learning Mode và Luyện theo kỹ năng:
 * - Cô lập hoàn toàn theo userId (`hanzigo_mistake_notebook_v1_${userId}`).
 * - Giới hạn dung lượng an toàn (MAX_MISTAKE_ITEMS = 150) + QuotaExceededError fail-open.
 * - Hỗ trợ tạo phiên "Ôn lại câu sai (N câu)" và tự động gỡ khi trả lời đúng lại.
 */

import { registerDynamicExam } from '../data/hskExamsData.js';

export const MISTAKE_NOTEBOOK_PREFIX = 'hanzigo_mistake_notebook_v1_';
export const MAX_MISTAKE_ITEMS = 150;

function resolveUserKey(user) {
  const uid =
    typeof user === 'string'
      ? user.trim()
      : String(user?.id || user?.uid || 'guest').trim();
  return uid || 'guest';
}

export function getMistakeNotebookStorageKey(user = null) {
  return `${MISTAKE_NOTEBOOK_PREFIX}${resolveUserKey(user)}`;
}

function readNotebookRaw(user = null) {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getMistakeNotebookStorageKey(user));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNotebookSafe(user = null, list = []) {
  if (typeof localStorage === 'undefined') return false;
  const key = getMistakeNotebookStorageKey(user);
  const caps = [MAX_MISTAKE_ITEMS, 80, 40, 15];
  for (const cap of caps) {
    try {
      localStorage.setItem(key, JSON.stringify(list.slice(0, cap)));
      return true;
    } catch {
      // QuotaExceededError fail-open: thu gọn dần danh sách cũ nhất
    }
  }
  return false;
}

function normalizeSkillKey(question = {}) {
  return String(
    question.skill || question.part_type || question.partType || question.section || 'reading'
  ).toLowerCase();
}

function compactOptionsForMistake(options) {
  if (!Array.isArray(options)) return [];
  return options.map((opt) => {
    if (typeof opt === 'string') return { text: opt.slice(0, 220) };
    if (opt && typeof opt === 'object') {
      return {
        text: String(opt.text ?? opt.label ?? '').slice(0, 220),
        ...(opt.pinyin ? { pinyin: String(opt.pinyin).slice(0, 220) } : {}),
        ...(opt.translation ? { translation: String(opt.translation).slice(0, 220) } : {}),
      };
    }
    return { text: String(opt || '') };
  });
}

function resolveCorrectIdx(question = {}) {
  if (typeof question.correct_option_index === 'number') return question.correct_option_index;
  if (typeof question.correctIndex === 'number') return question.correctIndex;
  return 0;
}

/**
 * Lấy danh sách câu sai đang hoạt động của user (cô lập hoàn toàn theo userId).
 */
export function getUserMistakeEntries(
  user = null,
  { level = 'all', skill = 'all', examSystem = 'all' } = {}
) {
  const entries = readNotebookRaw(user);
  return entries.filter((item) => {
    if (!item || !item.questionId) return false;
    if (level !== 'all' && String(item.level || '').replace(/–/g, '-') !== String(level).replace(/–/g, '-')) {
      return false;
    }
    if (skill !== 'all' && normalizeSkillKey(item) !== String(skill).toLowerCase()) {
      return false;
    }
    if (examSystem !== 'all' && item.examSystem && item.examSystem !== examSystem) {
      return false;
    }
    return true;
  });
}

/**
 * Ghi nhận 1 câu trả lời sai vào Sổ lỗi sai (Exam Mode, Learning Mode hoặc Luyện kỹ năng).
 */
export function recordMistakeEntry({
  user = null,
  question = null,
  userAnswer = null,
  examId = '',
  examSystem = 'hsk_2_0',
  level = 'HSK 1',
  mode = 'practice',
} = {}) {
  const questionId = String(question?.id || question?.questionId || '').trim();
  if (!questionId) return null;

  const list = readNotebookRaw(user);
  const existing = list.find((item) => item.questionId === questionId);
  const nowIso = new Date().toISOString();
  const correctIdx = resolveCorrectIdx(question);

  const entry = {
    questionId,
    examId: String(examId || question.exam_id || existing?.examId || 'hsk-practice'),
    examSystem: examSystem || question.examSystem || existing?.examSystem || 'hsk_2_0',
    level: level || question.level || existing?.level || 'HSK 1',
    skill: normalizeSkillKey(question),
    part: Number(question.part || question.part_number || question.partNumber || 1),
    questionType: String(question.questionType || question.question_type || question.type || 'multiple_choice'),
    prompt: String(question.prompt || question.promptSnapshot || '').slice(0, 320),
    pinyin: String(question.pinyin || '').slice(0, 320),
    translation: String(question.translation || question.translationVi || '').slice(0, 320),
    audio_script: String(question.audio_script || question.audioScript || '').slice(0, 420),
    options: compactOptionsForMistake(question.options || question.optionsSnapshot),
    correct_option_index: correctIdx,
    correctIndex: correctIdx,
    explanation: String(question.explanationVi || question.explanation || question.explanationViSnapshot || '').slice(0, 600),
    points: Number(question.points || 10),
    words: Array.isArray(question.words || question.scrambledWords)
      ? (question.words || question.scrambledWords).slice(0, 20)
      : [],
    correct_order: Array.isArray(question.correct_order || question.correctOrder)
      ? (question.correct_order || question.correctOrder).slice(0, 20)
      : [],
    accepted_answers: Array.isArray(question.accepted_answers || question.acceptedAnswers)
      ? (question.accepted_answers || question.acceptedAnswers).slice(0, 10)
      : [],
    lastUserAnswer: userAnswer,
    sourceMode: mode,
    wrongCount: (existing?.wrongCount || 0) + 1,
    lastWrongAt: nowIso,
    createdAt: existing?.createdAt || nowIso,
  };

  const nextList = [entry, ...list.filter((item) => item.questionId !== questionId)].slice(
    0,
    MAX_MISTAKE_ITEMS
  );
  writeNotebookSafe(user, nextList);
  return entry;
}

/**
 * Ghi nhận hàng loạt câu sai sau khi nộp bài (Exam Mode / Learning Mode / By-Skill).
 * Nếu phiên đang là phiên ôn lại câu sai (`isMistakeReview === true`), các câu trả lời ĐÚNG
 * sẽ tự động được đánh dấu đã khắc phục và gỡ khỏi sổ.
 */
export function syncMistakeNotebookFromAttempt({
  user = null,
  attempt = null,
  exam = null,
} = {}) {
  const details = Array.isArray(attempt?.detailedResults) ? attempt.detailedResults : [];
  if (details.length === 0) {
    return { addedCount: 0, resolvedCount: 0, remainingCount: getUserMistakeEntries(user).length };
  }

  const isReviewSession =
    Boolean(exam?.isMistakeReview) || String(attempt?.examId || '').startsWith('mistake-review-');

  let addedCount = 0;
  let resolvedCount = 0;

  for (const item of details) {
    if (!item || item.isSubjective) continue;
    if (item.isCorrect === false) {
      recordMistakeEntry({
        user,
        question: {
          id: item.questionId,
          part_type: item.partType,
          part_number: item.partNumber,
          question_type: item.questionType,
          prompt: item.prompt,
          pinyin: item.pinyin,
          translation: item.translation,
          audio_script: item.audio_script,
          options: item.options,
          correct_option_index: item.correctIndex,
          explanation: item.explanation,
          points: item.points,
          words: item.words,
          correct_order: item.correctOrder,
          accepted_answers: item.acceptedAnswers,
        },
        userAnswer: item.selectedIndex ?? item.userAnswer,
        examId: attempt.examId,
        examSystem: attempt.examSystem || exam?.examSystem || 'hsk_2_0',
        level: attempt.examLevel || exam?.level || 'HSK 1',
        mode: attempt.examMode || 'simulation',
      });
      addedCount += 1;
    } else if (item.isCorrect === true && isReviewSession) {
      if (markMistakeResolved({ user, questionId: item.questionId })) {
        resolvedCount += 1;
      }
    }
  }

  return {
    addedCount,
    resolvedCount,
    remainingCount: getUserMistakeEntries(user).length,
  };
}

/**
 * Đánh dấu 1 câu sai đã khắc phục (trả lời đúng lại) và tự động gỡ khỏi Sổ lỗi sai.
 */
export function markMistakeResolved({ user = null, questionId = '' } = {}) {
  const targetId = String(questionId || '').trim();
  if (!targetId) return false;
  const list = readNotebookRaw(user);
  const nextList = list.filter((item) => item.questionId !== targetId);
  if (nextList.length === list.length) return false;
  writeNotebookSafe(user, nextList);
  return true;
}

/**
 * Tạo và đăng ký một đề luyện tập tập trung đúng các câu đang nằm trong Sổ lỗi sai.
 */
export function buildMistakeReviewExam(
  user = null,
  { maxQuestions = 20, level = 'all', skill = 'all' } = {}
) {
  const entries = getUserMistakeEntries(user, { level, skill }).slice(0, maxQuestions);
  if (entries.length === 0) return null;

  const uid = resolveUserKey(user);
  const examId = `mistake-review-${uid}`;
  const questions = entries.map((m, idx) => ({
    id: m.questionId,
    exam_id: examId,
    examSystem: m.examSystem || 'hsk_2_0',
    skill: m.skill || 'reading',
    part_type: m.skill || 'reading',
    section: m.skill || 'reading',
    part_number: m.part || 1,
    part: m.part || 1,
    question_number: idx + 1,
    question_type: m.questionType || 'multiple_choice',
    questionType: m.questionType || 'multiple_choice',
    prompt: m.prompt,
    pinyin: m.pinyin || '',
    translation: m.translation || '',
    audio_url: '',
    audio_script: m.audio_script || '',
    options: m.options || [],
    correct_option_index: m.correct_option_index ?? m.correctIndex ?? 0,
    correctIndex: m.correctIndex ?? m.correct_option_index ?? 0,
    explanation: m.explanation || '',
    explanationVi: m.explanation || '',
    points: m.points || 10,
    words: m.words || [],
    scrambledWords: m.words || [],
    correct_order: m.correct_order || [],
    accepted_answers: m.accepted_answers || [],
  }));

  const exam = {
    id: examId,
    title: `Ôn tập Sổ lỗi sai (${questions.length} câu)`,
    level: level !== 'all' ? level : (entries[0]?.level || 'HSK 1'),
    exam_version: '2015-Standard',
    exam_type: 'practice',
    examSystem: entries[0]?.examSystem || 'hsk_2_0',
    skill_category: skill !== 'all' ? skill : 'mixed',
    duration_minutes: Math.max(10, questions.length * 2),
    total_questions: questions.length,
    passing_score: Math.round(questions.length * 10 * 0.6),
    max_score: questions.length * 10,
    is_published: true,
    isMistakeReview: true,
    questions,
  };

  registerDynamicExam(exam);
  return exam;
}

/**
 * Xóa Sổ lỗi sai của 1 user cụ thể hoặc toàn bộ Sổ lỗi sai khi đăng xuất.
 */
export function clearMistakeNotebookForUser(user = null) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(getMistakeNotebookStorageKey(user));
  } catch {}
}

export function purgeAllMistakeNotebooksFromStorage() {
  if (typeof localStorage === 'undefined') return;
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith(MISTAKE_NOTEBOOK_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}
