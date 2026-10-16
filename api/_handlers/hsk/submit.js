/**
 * HANZI GO - HSK EXAM SUBMIT & SCORING HANDLER
 * POST /api/hsk/submit
 * Chấm điểm bài thi an toàn trên máy chủ, tính độ chính xác, phân tích kỹ năng,
 * lưu trữ kết quả và trả về lời giải thích chi tiết.
 */
import { getFullExamById } from '../../../src/data/hskExamsData.js';
import { getSupabaseAdminClient, verifyRequestAuth } from '../../_utils/supabaseServer.js';

// In-memory idempotency cache for deduplication on retry or double-submission
const recentSubmissions = new Map();
const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000; // 5 minutes

export default async function submitHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const { 
    examId, 
    answers = {}, 
    timeSpentSeconds = 0, 
    anonymousSessionId = '', 
    examMode = 'simulation',
    attemptId: clientAttemptId = null
  } = req.body || {};

  if (!examId) {
    return res.status(400).json({ error: 'Thiếu mã đề thi (examId).' });
  }

  // Deduplication check for retried / double-clicked submissions
  if (clientAttemptId && recentSubmissions.has(clientAttemptId)) {
    const cached = recentSubmissions.get(clientAttemptId);
    if (Date.now() - cached.timestamp < IDEMPOTENCY_TTL_MS) {
      return res.status(200).json({
        success: true,
        attempt: cached.attempt,
        deduplicated: true
      });
    } else {
      recentSubmissions.delete(clientAttemptId);
    }
  }

  // 1. Xác thực danh tính người dùng (nếu có Bearer token)
  const auth = await verifyRequestAuth(req);
  const authenticatedUser = auth.authenticated ? auth.user : null;
  const userId = authenticatedUser ? authenticatedUser.id : null;
  const anonSessionId = userId ? null : (anonymousSessionId || `anon_${Date.now()}`);

  const fullExam = getFullExamById(examId);
  if (!fullExam) {
    return res.status(404).json({ error: `Không tìm thấy đề thi: ${examId}` });
  }

  // Chặn nộp bài vào đề chưa xuất bản nếu không phải Admin
  if (!fullExam.is_published && authenticatedUser?.role !== 'admin') {
    return res.status(403).json({ error: 'Đề thi hiện chưa được xuất bản hoặc đang bảo trì.' });
  }

  const questions = fullExam.questions || [];
  if (questions.length === 0) {
    return res.status(400).json({ error: 'Đề thi chưa có câu hỏi khả dụng để chấm điểm.' });
  }
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let subjectiveCount = 0;

  const skillStats = {};

  const detailedResults = questions.map(q => {
    const rawAnswer = answers[q.id];
    const isAnswered = rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== '';
    let isCorrect = false;
    let selectedIndex = null;
    const isSubjective = !!q.is_subjective || q.question_type === 'free_writing';
    let earnedPoints = 0;

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

    if (isSubjective) {
      subjectiveCount++;
      isCorrect = null;
    } else if (!isAnswered) {
      unansweredCount++;
    } else if (q.question_type === 'reorder_sentence') {
      if (typeof rawAnswer === 'number') {
        selectedIndex = rawAnswer;
        isCorrect = selectedIndex === q.correct_option_index;
      } else {
        const cleanStr = (val) => String(val || '').replace(/[\s\p{P}]/gu, '');
        const targetClean = cleanStr(q.correct_sentence || (q.correct_order || []).join('') || (q.options?.[q.correct_option_index]?.text));
        const userClean = Array.isArray(rawAnswer) ? cleanStr(rawAnswer.join('')) : cleanStr(rawAnswer);
        isCorrect = userClean.length > 0 && userClean === targetClean;
      }
      if (isCorrect) {
        correctCount++;
        totalScore += q.points;
        earnedPoints = q.points;
        skillStats[skillKey].correctQuestions += 1;
        skillStats[skillKey].earnedPoints += q.points;
      } else {
        incorrectCount++;
      }
    } else if (q.question_type === 'fill_blank' && typeof rawAnswer === 'string' && !q.options?.some((_, idx) => idx === Number(rawAnswer))) {
      const clean = (s) => String(s || '').trim().toLowerCase();
      const userStr = clean(rawAnswer);
      const accepted = (q.accepted_answers || []).map(clean);
      if (q.options?.[q.correct_option_index]) {
        accepted.push(clean(q.options[q.correct_option_index].text));
      }
      isCorrect = accepted.some(a => a === userStr);
      if (isCorrect) {
        correctCount++;
        totalScore += q.points;
        earnedPoints = q.points;
        skillStats[skillKey].correctQuestions += 1;
        skillStats[skillKey].earnedPoints += q.points;
      } else {
        incorrectCount++;
      }
    } else {
      selectedIndex = Number(rawAnswer);
      if (isNaN(selectedIndex)) {
        selectedIndex = null;
        unansweredCount++;
      } else {
        isCorrect = selectedIndex === q.correct_option_index;
        if (isCorrect) {
          correctCount++;
          totalScore += q.points;
          earnedPoints = q.points;
          skillStats[skillKey].correctQuestions += 1;
          skillStats[skillKey].earnedPoints += q.points;
        } else {
          incorrectCount++;
        }
      }
    }

    return {
      questionId: q.id,
      questionNumber: q.question_number,
      partType: q.part_type,
      partNumber: q.part_number,
      questionType: q.question_type || 'multiple_choice',
      prompt: q.prompt,
      pinyin: q.pinyin,
      translation: q.translation,
      audio_url: q.audio_url,
      audio_script: q.audio_script,
      options: q.options,
      selectedIndex,
      userAnswer: rawAnswer,
      correctIndex: q.correct_option_index,
      isCorrect,
      isSubjective,
      explanation: q.explanation,
      points: q.points,
      pointsAwarded: earnedPoints
    };
  });

  const totalQuestions = questions.length;
  const objectiveCount = totalQuestions - subjectiveCount;
  const accuracyPercentage = objectiveCount > 0 
    ? Math.round((correctCount / objectiveCount) * 1000) / 10 
    : 0;

  const maxScore = fullExam.max_score || 200;
  const passingScore = fullExam.passing_score || Math.round(maxScore * 0.6);

  const totalMaxRawPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  const estimatedScore = totalMaxRawPoints > 0 
    ? Math.round((totalScore / totalMaxRawPoints) * maxScore)
    : totalScore;

  const passed = estimatedScore >= passingScore;
  const attemptId = clientAttemptId || ('hsk-att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));

  const attemptResult = {
    id: attemptId,
    examId: fullExam.id,
    examTitle: fullExam.title,
    examLevel: fullExam.level,
    examType: fullExam.exam_type,
    examMode,
    userId,
    anonymousSessionId: anonSessionId,
    timeSpentSeconds: Number(timeSpentSeconds) || 0,
    submittedAnswers: answers,
    score: estimatedScore,
    maxScore,
    passingScore,
    passed,
    accuracyPercentage,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    subjectiveCount,
    skillBreakdown: skillStats,
    detailedResults,
    createdAt: new Date().toISOString()
  };

  // Lưu attempt và mistakes vào Supabase
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from('hsk_attempts').insert({
        id: attemptResult.id,
        user_id: userId,
        anonymous_session_id: anonSessionId,
        exam_id: attemptResult.examId,
        exam_mode: examMode,
        time_spent_seconds: attemptResult.timeSpentSeconds,
        submitted_answers: attemptResult.submittedAnswers,
        score: attemptResult.score,
        max_score: attemptResult.maxScore,
        accuracy_percentage: attemptResult.accuracyPercentage,
        passed: attemptResult.passed,
        skill_breakdown: attemptResult.skillBreakdown,
        detailed_results: attemptResult.detailedResults,
        created_at: attemptResult.createdAt
      });

      // Server-side Mistake Notebook Recording (Deduplicated via deterministic primary key)
      const incorrectQuestions = detailedResults.filter(q => !q.isCorrect && !q.isSubjective);
      if (incorrectQuestions.length > 0) {
        const mistakeRows = incorrectQuestions.map(q => {
          const mistId = userId
            ? `mst_${userId}_${q.questionId}`
            : `mst_${anonSessionId}_${q.questionId}`;
          return {
            id: mistId,
            user_id: userId,
            anonymous_session_id: anonSessionId,
            question_id: q.questionId,
            exam_id: fullExam.id,
            level: fullExam.level,
            part_type: q.partType || 'general',
            category: q.partType === 'listening' ? 'Phản xạ âm thanh & Nghe hiểu' : q.partType === 'reading' ? 'Nhận diện mặt chữ & Từ vựng' : 'Ngữ pháp & Cấu trúc câu',
            prompt: q.prompt,
            pinyin: q.pinyin || '',
            translation: q.translation || '',
            options: q.options || [],
            user_answer_index: q.selectedIndex,
            correct_answer_index: q.correctIndex,
            explanation: q.explanation || 'Chưa có lời giải chi tiết.',
            mistake_count: 1,
            status: 'needs_review',
            last_attempt_id: attemptResult.id,
            updated_at: new Date().toISOString()
          };
        });

        await supabase.from('hsk_mistakes').upsert(mistakeRows, { onConflict: 'id' });
      }
    } catch (dbErr) {
      console.warn('[/api/hsk/submit] Supabase persistence notice:', dbErr.message);
    }
  }

  // Save to in-memory idempotency cache
  recentSubmissions.set(attemptResult.id, {
    attempt: attemptResult,
    timestamp: Date.now()
  });

  // Evict oldest entries if cache exceeds 200 items
  if (recentSubmissions.size > 200) {
    const now = Date.now();
    for (const [key, value] of recentSubmissions.entries()) {
      if (now - value.timestamp > IDEMPOTENCY_TTL_MS) {
        recentSubmissions.delete(key);
      }
    }
  }

  return res.status(200).json({
    success: true,
    attempt: attemptResult
  });
}
