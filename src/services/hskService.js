/**
 * =========================================================================
 * HSK SERVICE — HANZIGO FREE PRACTICE PLATFORM
 * =========================================================================
 * Dịch vụ xử lý logic cho hệ thống thi thử HSK:
 * - Truy xuất danh sách đề thi & bộ lọc
 * - Tước bỏ đáp án khi cấp đề làm bài (chống gian lận)
 * - Chấm điểm độc lập, tính độ chính xác & phân tích kỹ năng
 * - Lưu trữ kết quả và bảo vệ câu trả lời tạm thời khi F5/refresh
 * - Hỗ trợ cả khách vãng lai (Anonymous) và người dùng có tài khoản
 * =========================================================================
 */

import { HSK_EXAMS, HSK_QUESTIONS, getFullExamById, getSanitizedExamForTaking } from '../data/hskExamsData.js';
import { supabase } from '../supabase/config.js';
import { awardXp } from '../utils/gamification.js';

const STORAGE_ATTEMPTS_KEY = 'hanzigo_hsk_attempts';
const STORAGE_DRAFT_PREFIX = 'hanzigo_hsk_draft_';
const STORAGE_ANON_SESSION_KEY = 'hanzigo_anon_session_id';
const STORAGE_MISTAKES_KEY = 'hanzigo_hsk_mistakes';

/**
 * Lấy hoặc khởi tạo ID phiên ẩn danh cho khách vãng lai
 */
export function getOrCreateAnonymousSessionId() {
  try {
    let anonId = localStorage.getItem(STORAGE_ANON_SESSION_KEY);
    if (!anonId) {
      anonId = 'anon_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem(STORAGE_ANON_SESSION_KEY, anonId);
    }
    return anonId;
  } catch {
    return 'anon_fallback_' + Date.now();
  }
}

/**
 * Lấy danh sách đề thi theo bộ lọc
 */
export async function getHskExams({ level = 'all', skill = 'all', type = 'all', query = '' } = {}) {
  // Ưu tiên đọc từ local dataset chuẩn
  let exams = [...HSK_EXAMS].filter(e => e.is_published);

  if (level && level !== 'all') {
    exams = exams.filter(e => e.level.toLowerCase() === level.toLowerCase());
  }

  if (skill && skill !== 'all') {
    exams = exams.filter(e => e.skill_category.toLowerCase() === skill.toLowerCase() || e.skill_category === 'mixed');
  }

  if (type && type !== 'all') {
    exams = exams.filter(e => e.exam_type.toLowerCase() === type.toLowerCase());
  }

  if (query && query.trim()) {
    const qWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    exams = exams.filter(e => {
      const targetText = `${e.title} ${e.description} ${e.level}`.toLowerCase();
      return qWords.every(word => targetText.includes(word));
    });
  }

  return exams;
}

/**
 * Lấy chi tiết thông tin đề thi (kèm cấu trúc các phần)
 */
export async function getHskExamDetails(examId) {
  const exam = HSK_EXAMS.find(e => e.id === examId);
  if (!exam) return null;

  const questions = HSK_QUESTIONS.filter(q => q.exam_id === examId);
  const listeningCount = questions.filter(q => q.part_type === 'listening').length;
  const readingCount = questions.filter(q => q.part_type === 'reading').length;
  const writingCount = questions.filter(q => q.part_type === 'writing').length;

  return {
    ...exam,
    partsSummary: {
      listening: listeningCount,
      reading: readingCount,
      writing: writingCount,
      total: questions.length
    }
  };
}

/**
 * Lấy đề thi để làm bài — BẢO MẬT: Tước bỏ hoàn toàn correct_option_index & explanation
 */
export async function getExamForTaking(examId) {
  const sanitized = getSanitizedExamForTaking(examId);
  if (!sanitized) {
    throw new Error(`Đề thi không tồn tại: ${examId}`);
  }
  return sanitized;
}

/**
 * Chấm điểm và lưu kết quả bài làm
 * @param {Object} params - { examId, submittedAnswers, timeSpentSeconds, user }
 */
export async function submitExamAttempt({ examId, submittedAnswers = {}, timeSpentSeconds = 0, user = null }) {
  const fullExam = getFullExamById(examId);
  if (!fullExam) {
    throw new Error(`Không tìm thấy đề thi mã: ${examId}`);
  }

  const questions = fullExam.questions;
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const skillStats = {};

  const detailedResults = questions.map(q => {
    const selectedIndex = submittedAnswers[q.id] !== undefined ? Number(submittedAnswers[q.id]) : null;
    const isAnswered = selectedIndex !== null && !isNaN(selectedIndex);
    const isCorrect = isAnswered && selectedIndex === q.correct_option_index;

    // Phân tích kỹ năng
    const skillKey = q.part_type || 'general';
    if (!skillStats[skillKey]) {
      skillStats[skillKey] = {
        name: skillKey === 'listening' ? 'Nghe hiểu' : skillKey === 'reading' ? 'Đọc hiểu' : skillKey === 'writing' ? 'Viết' : 'Ngữ pháp & Từ vựng',
        totalQuestions: 0,
        correctQuestions: 0,
        earnedPoints: 0,
        maxPoints: 0
      };
    }

    skillStats[skillKey].totalQuestions += 1;
    skillStats[skillKey].maxPoints += q.points;

    if (!isAnswered) {
      unansweredCount++;
    } else if (isCorrect) {
      correctCount++;
      totalScore += q.points;
      skillStats[skillKey].correctQuestions += 1;
      skillStats[skillKey].earnedPoints += q.points;
    } else {
      incorrectCount++;
    }

    return {
      questionId: q.id,
      questionNumber: q.question_number,
      partType: q.part_type,
      partNumber: q.part_number,
      prompt: q.prompt,
      pinyin: q.pinyin,
      translation: q.translation,
      audio_url: q.audio_url,
      audio_script: q.audio_script,
      options: q.options,
      selectedIndex,
      correctIndex: q.correct_option_index,
      isCorrect,
      explanation: q.explanation,
      points: q.points,
      pointsAwarded: isCorrect ? q.points : 0
    };
  });

  const totalQuestions = questions.length;
  const accuracyPercentage = totalQuestions > 0 
    ? Math.round((correctCount / totalQuestions) * 1000) / 10 
    : 0;

  // Tính điểm ước tính theo thang chuẩn của đề
  // Nếu đề quy định max_score = 200 (HSK 1-2) hoặc 300 (HSK 3-6)
  const maxScore = fullExam.max_score || 200;
  const passingScore = fullExam.passing_score || Math.round(maxScore * 0.6);
  
  // Tính điểm tỷ lệ theo max_score
  const totalMaxRawPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  const estimatedScore = totalMaxRawPoints > 0 
    ? Math.round((totalScore / totalMaxRawPoints) * maxScore)
    : totalScore;

  const passed = estimatedScore >= passingScore;
  const attemptId = 'hsk-att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const anonSessionId = getOrCreateAnonymousSessionId();

  const attemptResult = {
    id: attemptId,
    examId: fullExam.id,
    examTitle: fullExam.title,
    examLevel: fullExam.level,
    examType: fullExam.exam_type,
    userId: user?.id || null,
    anonymousSessionId: anonSessionId,
    timeSpentSeconds,
    submittedAnswers,
    score: estimatedScore,
    maxScore,
    passingScore,
    passed,
    accuracyPercentage,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    skillBreakdown: skillStats,
    detailedResults,
    createdAt: new Date().toISOString()
  };

  // 1. Lưu vào localStorage để người dùng xem lại tức thời
  saveAttemptToLocal(attemptResult);

  // 1b. Tự động ghi nhận câu sai vào Sổ tay câu hỏi sai (Mistake Review Notebook)
  recordMistakesFromAttempt(attemptResult, user);

  // 2. Xóa bản nháp câu trả lời tạm thời sau khi nộp thành công
  clearTemporaryAnswers(examId);

  // 3. Tặng XP nếu đạt kết quả tốt
  if (user) {
    try {
      const xpGained = passed ? 50 : 20;
      awardXp(xpGained, user.id);
    } catch {}
  }

  // 4. Đồng bộ lên Supabase nếu có kết nối
  syncAttemptToSupabase(attemptResult).catch(() => {});

  return attemptResult;
}

/**
 * Lưu kết quả lượt làm bài vào localStorage
 */
function saveAttemptToLocal(attempt) {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    // Lưu tối đa 30 lượt làm bài gần nhất
    const updated = [attempt, ...list.filter(a => a.id !== attempt.id)].slice(0, 30);
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(updated));
  } catch {}
}

/**
 * Đồng bộ bài thi lên Supabase (không block luồng trả về)
 */
async function syncAttemptToSupabase(attempt) {
  try {
    if (!supabase) return;
    await supabase.from('hsk_attempts').insert({
      id: attempt.id,
      user_id: attempt.userId,
      anonymous_session_id: attempt.anonymousSessionId,
      exam_id: attempt.examId,
      time_spent_seconds: attempt.timeSpentSeconds,
      submitted_answers: attempt.submittedAnswers,
      score: attempt.score,
      max_score: attempt.maxScore,
      accuracy_percentage: attempt.accuracyPercentage,
      passed: attempt.passed,
      skill_breakdown: attempt.skillBreakdown,
      detailed_results: attempt.detailedResults,
      created_at: attempt.createdAt
    });
  } catch {}
}

/**
 * Lấy kết quả bài thi theo attemptId
 */
export async function getAttemptResult(attemptId) {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      const found = list.find(a => a.id === attemptId);
      if (found) return found;
    }
  } catch {}

  // Nếu không có trong local, thử tìm trên Supabase
  try {
    if (supabase) {
      const { data } = await supabase
        .from('hsk_attempts')
        .select('*')
        .eq('id', attemptId)
        .maybeSingle();

      if (data) {
        return {
          id: data.id,
          examId: data.exam_id,
          userId: data.user_id,
          anonymousSessionId: data.anonymous_session_id,
          timeSpentSeconds: data.time_spent_seconds,
          submittedAnswers: data.submitted_answers,
          score: data.score,
          maxScore: data.max_score,
          accuracyPercentage: Number(data.accuracy_percentage),
          passed: data.passed,
          skillBreakdown: data.skill_breakdown,
          detailedResults: data.detailed_results,
          createdAt: data.created_at
        };
      }
    }
  } catch {}

  return null;
}

/**
 * Lấy lịch sử các lần thi trước đây
 */
export function getPastAttempts(examId = null) {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (!raw) return [];
    let list = JSON.parse(raw);
    if (examId) {
      list = list.filter(a => a.examId === examId);
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Lưu câu trả lời tạm thời (chống mất dữ liệu khi F5/reload)
 */
export function saveTemporaryAnswers(examId, answers) {
  try {
    if (!examId) return;
    localStorage.setItem(STORAGE_DRAFT_PREFIX + examId, JSON.stringify({
      answers,
      savedAt: Date.now()
    }));
  } catch {}
}

/**
 * Lấy câu trả lời tạm thời đã lưu
 */
export function getTemporaryAnswers(examId) {
  try {
    if (!examId) return null;
    const raw = localStorage.getItem(STORAGE_DRAFT_PREFIX + examId);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Hết hạn sau 4 tiếng
    if (Date.now() - data.savedAt > 4 * 60 * 60 * 1000) {
      clearTemporaryAnswers(examId);
      return null;
    }
    return data.answers || null;
  } catch {
    return null;
  }
}

/**
 * Xóa câu trả lời tạm thời
 */
export function clearTemporaryAnswers(examId) {
  try {
    if (!examId) return;
    localStorage.removeItem(STORAGE_DRAFT_PREFIX + examId);
  } catch {}
}

/**
 * =========================================================================
 * PHASE 2: SỔ TAY CÂU HỎI SAI (MISTAKE REVIEW NOTEBOOK)
 * =========================================================================
 */

/**
 * Tự động ghi nhận câu sai từ kết quả bài thi vào Sổ tay câu sai (Deduplication)
 */
export function recordMistakesFromAttempt(attemptResult, user = null) {
  if (!attemptResult || !Array.isArray(attemptResult.detailedResults)) return [];

  const anonSessionId = attemptResult.anonymousSessionId || getOrCreateAnonymousSessionId();
  const userId = user?.id || attemptResult.userId || null;
  const incorrectQuestions = attemptResult.detailedResults.filter(q => !q.isCorrect);

  if (incorrectQuestions.length === 0) return [];

  try {
    const raw = localStorage.getItem(STORAGE_MISTAKES_KEY);
    const mistakesList = raw ? JSON.parse(raw) : [];
    const updatedList = [...mistakesList];

    incorrectQuestions.forEach(q => {
      const existingIdx = updatedList.findIndex(m => 
        m.questionId === q.questionId && 
        (userId ? m.userId === userId : m.anonymousSessionId === anonSessionId)
      );

      if (existingIdx >= 0) {
        // Tăng số lần làm sai, cập nhật câu trả lời mới nhất, trả về trạng thái cần ôn
        const existing = updatedList[existingIdx];
        updatedList[existingIdx] = {
          ...existing,
          userAnswerIndex: q.selectedIndex,
          mistakeCount: (existing.mistakeCount || 1) + 1,
          status: 'needs_review',
          lastAttemptId: attemptResult.id,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Thêm mới câu sai
        updatedList.unshift({
          id: `mst_${attemptResult.examId}_${q.questionId}_${Date.now()}`,
          userId,
          anonymousSessionId: anonSessionId,
          questionId: q.questionId,
          examId: attemptResult.examId,
          examTitle: attemptResult.examTitle,
          level: attemptResult.examLevel,
          partType: q.partType || 'general',
          category: q.partType === 'listening' 
            ? 'Phản xạ âm thanh & Nghe hiểu' 
            : q.partType === 'reading' 
              ? 'Nhận diện mặt chữ & Từ vựng' 
              : 'Ngữ pháp & Cấu trúc câu',
          prompt: q.prompt,
          pinyin: q.pinyin || '',
          translation: q.translation || '',
          options: q.options || [],
          userAnswerIndex: q.selectedIndex,
          correctAnswerIndex: q.correctIndex,
          explanation: q.explanation || 'Chưa có lời giải chi tiết cho câu hỏi này.',
          mistakeCount: 1,
          status: 'needs_review',
          lastAttemptId: attemptResult.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    localStorage.setItem(STORAGE_MISTAKES_KEY, JSON.stringify(updatedList.slice(0, 100)));

    // Đồng bộ lên Supabase nếu có user
    if (supabase && userId && incorrectQuestions.length > 0) {
      syncMistakesToSupabase(updatedList.filter(m => m.userId === userId)).catch(() => {});
    }

    return updatedList;
  } catch {
    return [];
  }
}

/**
 * Lấy danh sách câu hỏi trong Sổ tay câu sai kèm bộ lọc
 */
export async function getMistakeNotebook({ user = null, level = 'all', skill = 'all', status = 'all', search = '' } = {}) {
  const anonSessionId = getOrCreateAnonymousSessionId();
  let list = [];

  // 1. Thử lấy từ Supabase nếu có user
  if (supabase && user?.id) {
    try {
      let query = supabase
        .from('hsk_mistakes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (level && level !== 'all') query = query.eq('level', level);
      if (skill && skill !== 'all') query = query.eq('part_type', skill);
      if (status && status !== 'all') query = query.eq('status', status);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        list = data.map(m => ({
          id: m.id,
          userId: m.user_id,
          anonymousSessionId: m.anonymous_session_id,
          questionId: m.question_id,
          examId: m.exam_id,
          level: m.level,
          partType: m.part_type,
          category: m.category,
          prompt: m.prompt,
          pinyin: m.pinyin,
          translation: m.translation,
          options: m.options,
          userAnswerIndex: m.user_answer_index,
          correctAnswerIndex: m.correct_answer_index,
          explanation: m.explanation,
          mistakeCount: m.mistake_count,
          status: m.status,
          lastAttemptId: m.last_attempt_id,
          createdAt: m.created_at,
          updatedAt: m.updated_at
        }));
      }
    } catch {}
  }

  // 2. Nếu chưa có trên Supabase hoặc là khách vãng lai, đọc từ LocalStorage
  if (list.length === 0) {
    try {
      const raw = localStorage.getItem(STORAGE_MISTAKES_KEY);
      if (raw) {
        const localList = JSON.parse(raw);
        list = localList.filter(m => {
          if (user?.id) return m.userId === user.id || m.userId === null;
          return m.anonymousSessionId === anonSessionId || m.userId === null;
        });
      }
    } catch {}
  }

  // Áp dụng bộ lọc
  if (level && level !== 'all') {
    list = list.filter(m => m.level?.toLowerCase() === level.toLowerCase());
  }

  if (skill && skill !== 'all') {
    list = list.filter(m => m.partType?.toLowerCase() === skill.toLowerCase());
  }

  if (status && status !== 'all') {
    list = list.filter(m => m.status === status);
  }

  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    list = list.filter(m => 
      (m.prompt && m.prompt.toLowerCase().includes(s)) ||
      (m.pinyin && m.pinyin.toLowerCase().includes(s)) ||
      (m.translation && m.translation.toLowerCase().includes(s)) ||
      (m.explanation && m.explanation.toLowerCase().includes(s))
    );
  }

  return list;
}

/**
 * Cập nhật trạng thái câu sai (đã hiểu 'mastered' hoặc cần ôn lại 'needs_review')
 */
export async function updateMistakeStatus(mistakeId, newStatus, user = null) {
  try {
    const raw = localStorage.getItem(STORAGE_MISTAKES_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      const updated = list.map(m => {
        if (m.id === mistakeId || m.questionId === mistakeId) {
          return { ...m, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return m;
      });
      localStorage.setItem(STORAGE_MISTAKES_KEY, JSON.stringify(updated));
    }

    if (supabase && user?.id) {
      await supabase
        .from('hsk_mistakes')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .or(`id.eq.${mistakeId},question_id.eq.${mistakeId}`);
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Xóa một câu hỏi khỏi sổ tay câu sai
 */
export async function removeMistakeItem(mistakeId, user = null) {
  try {
    const raw = localStorage.getItem(STORAGE_MISTAKES_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      const filtered = list.filter(m => m.id !== mistakeId && m.questionId !== mistakeId);
      localStorage.setItem(STORAGE_MISTAKES_KEY, JSON.stringify(filtered));
    }

    if (supabase && user?.id) {
      await supabase
        .from('hsk_mistakes')
        .delete()
        .eq('user_id', user.id)
        .or(`id.eq.${mistakeId},question_id.eq.${mistakeId}`);
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Tạo một đề thi luyện tập chuyên sâu chỉ gồm các câu hỏi trong Sổ tay câu sai
 */
export async function getMistakePracticeExam({ mistakeIds = [], user = null, level = 'all' } = {}) {
  const mistakes = await getMistakeNotebook({ user, level, status: 'needs_review' });
  const selected = mistakeIds.length > 0
    ? mistakes.filter(m => mistakeIds.includes(m.id) || mistakeIds.includes(m.questionId))
    : mistakes;

  if (selected.length === 0) return null;

  return {
    id: 'mistake-practice-' + Date.now(),
    title: `Luyện Tập Sổ Tay Câu Sai (${selected.length} câu)`,
    level: selected[0]?.level || 'Tổng hợp',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: Math.max(10, Math.ceil(selected.length * 1.5)),
    total_questions: selected.length,
    max_score: selected.length * 10,
    passing_score: Math.round(selected.length * 10 * 0.8),
    description: 'Chế độ luyện tập chuyên sâu các câu hỏi từng làm sai hoặc bỏ trống để khắc sâu kiến thức.',
    is_published: true,
    questions: selected.map((m, idx) => ({
      id: m.questionId,
      exam_id: m.examId,
      question_number: idx + 1,
      part_type: m.partType,
      part_number: 1,
      prompt: m.prompt,
      pinyin: m.pinyin,
      translation: m.translation,
      options: m.options,
      points: 10
      // BẢO MẬT: Tuyệt đối không để lộ correct_option_index và explanation khi làm bài!
    }))
  };
}

/**
 * Đồng bộ danh sách câu sai lên Supabase
 */
async function syncMistakesToSupabase(mistakes) {
  try {
    if (!supabase || !Array.isArray(mistakes) || mistakes.length === 0) return;
    const rows = mistakes.map(m => ({
      id: m.id,
      user_id: m.userId,
      anonymous_session_id: m.anonymousSessionId,
      question_id: m.questionId,
      exam_id: m.examId,
      level: m.level,
      part_type: m.partType,
      category: m.category,
      prompt: m.prompt,
      pinyin: m.pinyin,
      translation: m.translation,
      options: m.options,
      user_answer_index: m.userAnswerIndex,
      correct_answer_index: m.correctAnswerIndex,
      explanation: m.explanation,
      mistake_count: m.mistakeCount,
      status: m.status,
      last_attempt_id: m.lastAttemptId,
      updated_at: m.updatedAt || new Date().toISOString()
    }));
    await supabase.from('hsk_mistakes').upsert(rows, { onConflict: 'user_id,question_id' });
  } catch {}
}

/**
 * =========================================================================
 * PHASE 2: LỊCH SỬ THI & SO SÁNH TIẾN ĐỘ (EXAM HISTORY & COMPARISON)
 * =========================================================================
 */

/**
 * Lấy toàn bộ lịch sử thi của người dùng hoặc khách vãng lai
 */
export async function getUserExamHistory({ user = null, examId = null } = {}) {
  const anonSessionId = getOrCreateAnonymousSessionId();
  let attempts = [];

  // 1. Thử lấy từ Supabase nếu có user
  if (supabase && user?.id) {
    try {
      let query = supabase
        .from('hsk_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (examId) query = query.eq('exam_id', examId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        attempts = data.map(d => ({
          id: d.id,
          examId: d.exam_id,
          examTitle: d.exam_title || d.exam_id,
          examLevel: d.exam_level || 'HSK 1',
          userId: d.user_id,
          anonymousSessionId: d.anonymous_session_id,
          timeSpentSeconds: d.time_spent_seconds,
          score: d.score,
          maxScore: d.max_score,
          accuracyPercentage: Number(d.accuracy_percentage),
          passed: d.passed,
          skillBreakdown: d.skill_breakdown,
          detailedResults: d.detailed_results,
          createdAt: d.created_at
        }));
      }
    } catch {}
  }

  // 2. Đọc từ local cache để hợp nhất
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (raw) {
      const localAttempts = JSON.parse(raw);
      const userLocal = localAttempts.filter(a => {
        if (user?.id) return a.userId === user.id || a.userId === null;
        return a.anonymousSessionId === anonSessionId || a.userId === null;
      });

      const existingIds = new Set(attempts.map(a => a.id));
      userLocal.forEach(la => {
        if (!existingIds.has(la.id)) {
          if (!examId || la.examId === examId) {
            attempts.push(la);
            existingIds.add(la.id);
          }
        }
      });
    }
  } catch {}

  attempts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return attempts;
}

/**
 * So sánh 2 lượt làm bài thi của cùng một đề thi
 */
export function compareExamAttempts(attemptA, attemptB) {
  if (!attemptA || !attemptB) {
    return {
      compatible: false,
      reason: 'Thiếu thông tin bài thi để thực hiện so sánh.'
    };
  }

  if (attemptA.examId !== attemptB.examId) {
    return {
      compatible: false,
      reason: 'Không thể so sánh 2 bài thi khác đề.'
    };
  }

  if (attemptA.maxScore !== attemptB.maxScore) {
    return {
      compatible: false,
      reason: 'Không thể so sánh 2 bài thi có thang điểm tối đa khác nhau.'
    };
  }

  // Sắp xếp baseline = lượt trước, target = lượt sau
  const isChronological = new Date(attemptA.createdAt) <= new Date(attemptB.createdAt);
  const baseline = isChronological ? attemptA : attemptB;
  const target = isChronological ? attemptB : attemptA;

  const scoreDelta = target.score - baseline.score;
  const accuracyDelta = Math.round((target.accuracyPercentage - baseline.accuracyPercentage) * 10) / 10;
  const timeDeltaSeconds = target.timeSpentSeconds - baseline.timeSpentSeconds;
  const correctDelta = (target.correctCount || 0) - (baseline.correctCount || 0);
  const improved = scoreDelta > 0 || (scoreDelta === 0 && accuracyDelta >= 0);

  // So sánh kỹ năng
  const skillsDelta = {};
  const allSkills = new Set([
    ...Object.keys(baseline.skillBreakdown || {}),
    ...Object.keys(target.skillBreakdown || {})
  ]);

  allSkills.forEach(skill => {
    const sBase = baseline.skillBreakdown?.[skill] || { earnedPoints: 0, correctQuestions: 0, maxPoints: 1 };
    const sTgt = target.skillBreakdown?.[skill] || { earnedPoints: 0, correctQuestions: 0, maxPoints: 1 };
    const baseAcc = sBase.maxPoints > 0 ? (sBase.earnedPoints / sBase.maxPoints) * 100 : 0;
    const tgtAcc = sTgt.maxPoints > 0 ? (sTgt.earnedPoints / sTgt.maxPoints) * 100 : 0;
    skillsDelta[skill] = {
      name: sTgt.name || sBase.name || skill,
      baselinePoints: sBase.earnedPoints,
      targetPoints: sTgt.earnedPoints,
      maxPoints: sTgt.maxPoints || sBase.maxPoints,
      pointsDelta: sTgt.earnedPoints - sBase.earnedPoints,
      accuracyDelta: Math.round((tgtAcc - baseAcc) * 10) / 10
    };
  });

  return {
    compatible: true,
    examId: baseline.examId,
    examTitle: baseline.examTitle,
    examLevel: baseline.examLevel,
    baseline,
    target,
    metrics: {
      scoreDelta,
      accuracyDelta,
      timeDeltaSeconds,
      correctDelta,
      improved
    },
    skillsDelta
  };
}

/**
 * =========================================================================
 * PHASE 2: BÁO CÁO TIẾN ĐỘ & PHÂN TÍCH NĂNG LỰC (LEARNING ANALYTICS)
 * =========================================================================
 */

/**
 * Tạo báo cáo phân tích năng lực học tập
 */
export function generateStudyAnalytics(attempts = [], mistakes = []) {
  const count = attempts.length;
  
  if (count === 0) {
    return {
      dataStatus: 'no_data',
      message: 'Bạn chưa hoàn thành đề thi thử nào. Hãy chọn một đề thi để bắt đầu đo lường năng lực!',
      totalExams: 0,
      totalQuestions: 0,
      overallAccuracy: 0,
      averageScore: 0,
      passRate: 0,
      totalTimeMinutes: 0,
      skillsAccuracy: {},
      levelsAccuracy: {},
      frequentlyMissedCategories: [],
      recentAttempts: []
    };
  }

  const totalQuestions = attempts.reduce((acc, a) => acc + (a.totalQuestions || 0), 0);
  const totalCorrect = attempts.reduce((acc, a) => acc + (a.correctCount || 0), 0);
  const overallAccuracy = totalQuestions > 0 
    ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 
    : 0;

  const totalScore = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
  const averageScore = Math.round(totalScore / count);
  const passCount = attempts.filter(a => a.passed).length;
  const passRate = Math.round((passCount / count) * 1000) / 10;
  const totalTimeSeconds = attempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0);
  const totalTimeMinutes = Math.round(totalTimeSeconds / 60);

  // Phân tích kỹ năng (Skill breakdown)
  const skillsAcc = {
    listening: { name: 'Nghe hiểu', total: 0, correct: 0, accuracy: 0 },
    reading: { name: 'Đọc hiểu', total: 0, correct: 0, accuracy: 0 },
    writing: { name: 'Viết', total: 0, correct: 0, accuracy: 0 },
    grammar: { name: 'Ngữ pháp & Từ vựng', total: 0, correct: 0, accuracy: 0 }
  };

  attempts.forEach(a => {
    if (a.skillBreakdown) {
      Object.entries(a.skillBreakdown).forEach(([key, s]) => {
        const k = key.toLowerCase();
        const target = skillsAcc[k] || skillsAcc.grammar;
        target.total += s.totalQuestions || 0;
        target.correct += s.correctQuestions || 0;
      });
    }
  });

  Object.values(skillsAcc).forEach(s => {
    s.accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 1000) / 10 : 0;
  });

  // Phân tích theo cấp độ (Level breakdown)
  const levelsAcc = {};
  attempts.forEach(a => {
    const lvl = a.examLevel || 'HSK 1';
    if (!levelsAcc[lvl]) {
      levelsAcc[lvl] = { level: lvl, count: 0, totalQuestions: 0, correct: 0, accuracy: 0, avgScore: 0, totalScore: 0 };
    }
    levelsAcc[lvl].count += 1;
    levelsAcc[lvl].totalQuestions += a.totalQuestions || 0;
    levelsAcc[lvl].correct += a.correctCount || 0;
    levelsAcc[lvl].totalScore += a.score || 0;
  });

  Object.values(levelsAcc).forEach(l => {
    l.accuracy = l.totalQuestions > 0 ? Math.round((l.correct / l.totalQuestions) * 1000) / 10 : 0;
    l.avgScore = Math.round(l.totalScore / l.count);
  });

  // Nhận diện dạng câu hỏi hay mắc lỗi nhất từ sổ tay câu sai
  const categoryMap = {};
  mistakes.forEach(m => {
    const cat = m.category || (m.partType === 'listening' ? 'Nghe hiểu' : 'Đọc hiểu');
    categoryMap[cat] = (categoryMap[cat] || 0) + (m.mistakeCount || 1);
  });

  const frequentlyMissedCategories = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const dataStatus = count < 3 ? 'insufficient' : 'measured';
  const message = dataStatus === 'insufficient'
    ? `Bạn đã hoàn thành ${count}/3 đề thi. Cần làm thêm ít nhất ${3 - count} đề để hệ thống phân tích chuẩn xác năng lực học tập.`
    : `Dữ liệu đo lường tin cậy dựa trên ${count} đề thi đã hoàn thành.`;

  return {
    dataStatus,
    message,
    totalExams: count,
    totalQuestions,
    totalCorrect,
    overallAccuracy,
    averageScore,
    passRate,
    totalTimeMinutes,
    skillsAccuracy: skillsAcc,
    levelsAccuracy: levelsAcc,
    frequentlyMissedCategories,
    recentAttempts: attempts.slice(0, 10)
  };
}

/**
 * =========================================================================
 * PHASE 2: KHUYẾN NGHỊ HỌC TẬP THÔNG MINH (DETERMINISTIC RECOMMENDATIONS)
 * =========================================================================
 */

/**
 * Tạo danh sách khuyến nghị học tập dựa trên luật xác định (Không dùng AI runtime)
 */
export function generateStudyRecommendations(analytics, mistakes = []) {
  const recommendations = [];

  const unmasteredMistakes = mistakes.filter(m => m.status === 'needs_review');
  const listeningAcc = analytics?.skillsAccuracy?.listening?.accuracy || 0;
  const listeningTotal = analytics?.skillsAccuracy?.listening?.total || 0;
  const readingAcc = analytics?.skillsAccuracy?.reading?.accuracy || 0;
  const readingTotal = analytics?.skillsAccuracy?.reading?.total || 0;
  const overallAcc = analytics?.overallAccuracy || 0;

  // 1. Khuyến nghị ôn câu sai trong sổ tay
  if (unmasteredMistakes.length > 0) {
    recommendations.push({
      id: 'rec_mistakes',
      priority: 'high',
      badge: 'Cần ôn ngay',
      title: 'Củng cố sổ tay câu hỏi chưa thành thạo',
      description: `Bạn có ${unmasteredMistakes.length} câu hỏi từng làm sai cần được ôn lại. Hãy giải quyết các lỗ hổng này trước khi thử sức đề mới.`,
      actionLabel: 'Mở Sổ tay câu sai',
      targetTab: 'hsk',
      subRoute: 'mistakes'
    });
  }

  // 2. Kỹ năng nghe hiểu
  if (listeningTotal >= 5 && listeningAcc < 65) {
    recommendations.push({
      id: 'rec_listening',
      priority: 'high',
      badge: 'Điểm yếu cần khắc phục',
      title: 'Tăng cường luyện phản xạ nghe & Thanh điệu Pinyin',
      description: `Độ chính xác kỹ năng Nghe hiểu đạt ${listeningAcc}%. Hãy rèn luyện nhận diện âm điệu và thanh mẫu - vận mẫu tại bảng Pinyin của HanziGo.`,
      actionLabel: 'Luyện Phát âm & Pinyin',
      targetTab: 'pronunciation',
      subRoute: null
    });
  }

  // 3. Kỹ năng đọc hiểu & Từ vựng
  if (readingTotal >= 5 && readingAcc < 65) {
    recommendations.push({
      id: 'rec_reading_vocab',
      priority: 'medium',
      badge: 'Cải thiện vốn từ',
      title: 'Củng cố vốn từ vựng HSK qua Flashcard SRS',
      description: `Độ chính xác đọc hiểu đạt ${readingAcc}%. Hệ thống Flashcard lặp lại ngắt quãng (SRS) sẽ giúp bạn ghi nhớ mặt chữ Hán bền vững.`,
      actionLabel: 'Kho Từ vựng Flashcard',
      targetTab: 'vocabulary',
      subRoute: null
    });
  }

  // 4. Lộ trình bài học chính khóa
  if (analytics?.totalExams >= 2) {
    if (overallAcc >= 80) {
      recommendations.push({
        id: 'rec_level_up',
        priority: 'medium',
        badge: 'Sẵn sàng thăng cấp',
        title: 'Thử sức với các thử thách cấp độ cao hơn',
        description: `Chúc mừng bạn! Độ chính xác tổng thể đạt ${overallAcc}%. Bạn đã sẵn sàng mở rộng sang các cấp độ HSK kế tiếp trong Lộ trình.`,
        actionLabel: 'Xem Lộ trình học',
        targetTab: 'roadmap',
        subRoute: null
      });
    } else if (overallAcc < 60) {
      recommendations.push({
        id: 'rec_roadmap_foundation',
        priority: 'high',
        badge: 'Củng cố nền móng',
        title: 'Học lại các điểm ngữ pháp trọng tâm trong Lộ trình',
        description: 'Kết quả thi thử cho thấy bạn gặp khó khăn ở một số cấu trúc câu. Hãy học theo từng bài học 9 bước trong Lộ trình học.',
        actionLabel: 'Vào Lộ trình bài học',
        targetTab: 'roadmap',
        subRoute: null
      });
    }
  }

  // 5. Khuyến nghị phản xạ giao tiếp 500 câu
  recommendations.push({
    id: 'rec_conversation',
    priority: 'low',
    badge: 'Mở rộng phản xạ',
    title: 'Rèn luyện 500 câu giao tiếp thực chiến',
    description: 'Vận dụng ngữ pháp và từ vựng đã ôn luyện vào 10 chủ đề giao tiếp sinh hoạt hàng ngày.',
    actionLabel: 'Luyện 500 Câu giao tiếp',
    targetTab: 'conversation',
    subRoute: null
  });

  return recommendations;
}

/**
 * Đồng bộ bài thi và câu sai từ máy cục bộ lên tài khoản người dùng (Xác thực và Opt-in)
 */
export async function mergeLocalAttemptsToUser(userId) {
  if (!userId) return { success: false, mergedCount: 0, error: 'Thiếu userId hợp lệ.' };

  try {
    let mergedCount = 0;
    const rawAttempts = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (rawAttempts) {
      const attempts = JSON.parse(rawAttempts);
      const updatedAttempts = attempts.map(a => {
        if (!a.userId) {
          mergedCount++;
          const updated = { ...a, userId };
          if (supabase) {
            syncAttemptToSupabase(updated).catch(() => {});
          }
          return updated;
        }
        return a;
      });
      localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(updatedAttempts));
    }

    // Đồng bộ cả câu sai
    const rawMistakes = localStorage.getItem(STORAGE_MISTAKES_KEY);
    if (rawMistakes) {
      const mistakes = JSON.parse(rawMistakes);
      const updatedMistakes = mistakes.map(m => (!m.userId ? { ...m, userId } : m));
      localStorage.setItem(STORAGE_MISTAKES_KEY, JSON.stringify(updatedMistakes));
      if (supabase) {
        syncMistakesToSupabase(updatedMistakes.filter(m => m.userId === userId)).catch(() => {});
      }
    }

    return { success: true, mergedCount };
  } catch (err) {
    return { success: false, mergedCount: 0, error: err.message };
  }
}

