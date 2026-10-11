/**
 * HANZI GO - HSK EXAM SUBMIT & SCORING HANDLER
 * POST /api/hsk/submit
 * Chấm điểm bài thi an toàn trên máy chủ, tính độ chính xác, phân tích kỹ năng,
 * lưu trữ kết quả và trả về lời giải thích chi tiết.
 */
import { getFullExamById } from '../../../src/data/hskExamsData.js';
import { getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function submitHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const { examId, answers = {}, timeSpentSeconds = 0, anonymousSessionId = '' } = req.body || {};

  if (!examId) {
    return res.status(400).json({ error: 'Thiếu mã đề thi (examId).' });
  }

  const fullExam = getFullExamById(examId);
  if (!fullExam) {
    return res.status(404).json({ error: `Không tìm thấy đề thi: ${examId}` });
  }

  const questions = fullExam.questions;
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const skillStats = {};

  const detailedResults = questions.map(q => {
    const selectedIndex = answers[q.id] !== undefined && answers[q.id] !== null ? Number(answers[q.id]) : null;
    const isAnswered = selectedIndex !== null && !isNaN(selectedIndex);
    const isCorrect = isAnswered && selectedIndex === q.correct_option_index;

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

  const maxScore = fullExam.max_score || 200;
  const passingScore = fullExam.passing_score || Math.round(maxScore * 0.6);

  const totalMaxRawPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  const estimatedScore = totalMaxRawPoints > 0 
    ? Math.round((totalScore / totalMaxRawPoints) * maxScore)
    : totalScore;

  const passed = estimatedScore >= passingScore;
  const attemptId = 'hsk-att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  const attemptResult = {
    id: attemptId,
    examId: fullExam.id,
    examTitle: fullExam.title,
    examLevel: fullExam.level,
    examType: fullExam.exam_type,
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
    skillBreakdown: skillStats,
    detailedResults,
    createdAt: new Date().toISOString()
  };

  // Lưu attempt vào Supabase nếu có cấu hình
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from('hsk_attempts').insert({
        id: attemptResult.id,
        exam_id: attemptResult.examId,
        anonymous_session_id: anonymousSessionId || null,
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
    } catch (dbErr) {
      console.warn('[/api/hsk/submit] Supabase insert attempt notice:', dbErr.message);
    }
  }

  return res.status(200).json({
    success: true,
    attempt: attemptResult
  });
}
