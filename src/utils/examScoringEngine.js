/**
 * =========================================================================
 * HANZIGO — AUTHENTIC HSK CBT SCORING ENGINE (200/300 SCALE)
 * =========================================================================
 * Bộ máy chấm điểm thi thử HSK trên máy tính chuẩn Quốc tế (CTI / CLEC):
 * 1. Chuẩn hóa thang điểm:
 *    - HSK 1 – 2: 2 phần (Nghe: 100 điểm, Đọc: 100 điểm) -> Tổng: 200 điểm. Điểm đậu >= 120.
 *    - HSK 3 – 6: 3 phần (Nghe: 100 điểm, Đọc: 100 điểm, Viết: 100 điểm) -> Tổng: 300 điểm. Điểm đậu >= 180.
 * 2. Quy tắc điểm liệt:
 *    - Bất kỳ phần thi nào dưới 40/100 điểm sẽ bị đánh giá "Chưa đạt chuẩn cân bằng kỹ năng".
 * 3. Hỗ trợ đa dạng loại hình câu hỏi:
 *    - listening_mcq: Trắc nghiệm Nghe hiểu
 *    - reading_mcq: Trắc nghiệm Đọc hiểu
 *    - sentence_order_abc: Sắp xếp 3 mệnh đề A - B - C
 *    - writing_reorder / reorder_sentence: Sắp xếp từ thành câu hoàn chỉnh
 *    - fill_blank: Điền từ vào chỗ trống
 *    - free_writing: Tự luận viết câu / đoạn văn
 * =========================================================================
 */

/**
 * Chuẩn hóa chuỗi so sánh loại bỏ khoảng trắng và dấu câu
 */
export function normalizeAnswerText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\s\p{P}\p{S}]/gu, '')
    .toLowerCase()
    .trim();
}

/**
 * Xác định cấu hình thang điểm chuẩn theo cấp độ HSK
 */
export function getHskScoreConfig(hskLevel = 'HSK 1') {
  const clean = String(hskLevel || 'HSK 1').toUpperCase();
  const match = clean.match(/HSK\s*([1-6])/i);
  const num = match ? parseInt(match[1], 10) : 1;

  if (num <= 2) {
    return {
      levelNum: num,
      levelLabel: `HSK ${num}`,
      maxScore: 200,
      passingScore: 120,
      eliminationThreshold: 40, // Điểm liệt phần thi
      sections: [
        { id: 'listening', name: 'Nghe hiểu (听力)', maxScore: 100 },
        { id: 'reading', name: 'Đọc hiểu (阅读)', maxScore: 100 }
      ]
    };
  }

  return {
    levelNum: num,
    levelLabel: `HSK ${num}`,
    maxScore: 300,
    passingScore: 180,
    eliminationThreshold: 40,
    sections: [
      { id: 'listening', name: 'Nghe hiểu (听力)', maxScore: 100 },
      { id: 'reading', name: 'Đọc hiểu (阅读)', maxScore: 100 },
      { id: 'writing', name: 'Viết (书写)', maxScore: 100 }
    ]
  };
}

/**
 * Chấm điểm từng câu hỏi đơn lẻ
 */
export function gradeSingleQuestion(question, userAnswer) {
  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';
  const qType = question.questionType || question.question_type || 'multiple_choice';
  const isSubjective = !!question.is_subjective || qType === 'free_writing';

  if (isSubjective) {
    return {
      isCorrect: null,
      isSubjective: true,
      needsSelfAssessment: true,
      pointsAwarded: 0,
      userAnswer: userAnswer || '',
      explanation: question.explanation || ''
    };
  }

  if (!isAnswered) {
    return {
      isCorrect: false,
      isSubjective: false,
      needsSelfAssessment: false,
      pointsAwarded: 0,
      userAnswer: null,
      explanation: question.explanation || ''
    };
  }

  // 1. Dạng sắp xếp từ thành câu (writing_reorder / reorder_sentence)
  if (qType === 'writing_reorder' || qType === 'reorder_sentence') {
    let isCorrect = false;

    if (typeof userAnswer === 'number') {
      // Người dùng chọn option index (1 trong các lựa chọn có sẵn)
      isCorrect = userAnswer === question.correct_option_index || userAnswer === question.correctIndex;
    } else {
      // Người dùng gửi mảng từ xếp được hoặc chuỗi câu ghép
      const targetSentence = question.correct_sentence || question.correctSentence || '';
      const targetOrder = question.correct_order || question.correctOrder || question.answerKey || [];
      const targetClean = normalizeAnswerText(targetSentence || (Array.isArray(targetOrder) ? targetOrder.join('') : ''));

      const userClean = Array.isArray(userAnswer)
        ? normalizeAnswerText(userAnswer.join(''))
        : normalizeAnswerText(userAnswer);

      if (targetClean && userClean) {
        isCorrect = userClean === targetClean;
      } else if (Array.isArray(targetOrder) && Array.isArray(userAnswer)) {
        isCorrect = targetOrder.length === userAnswer.length && targetOrder.every((w, i) => w === userAnswer[i]);
      }
    }

    return {
      isCorrect,
      isSubjective: false,
      needsSelfAssessment: false,
      pointsAwarded: isCorrect ? (question.points || 10) : 0,
      userAnswer,
      explanation: question.explanation || ''
    };
  }

  // 2. Dạng sắp xếp mệnh đề A - B - C (sentence_order_abc)
  if (qType === 'sentence_order_abc') {
    let isCorrect = false;
    const key = (question.answerKey || question.correct_order_abc || '').toString().toUpperCase().replace(/[^ABC]/g, '');

    if (typeof userAnswer === 'number') {
      isCorrect = userAnswer === question.correct_option_index || userAnswer === question.correctIndex;
    } else if (typeof userAnswer === 'string') {
      const userKey = userAnswer.toUpperCase().replace(/[^ABC]/g, '');
      isCorrect = userKey === key;
    }

    return {
      isCorrect,
      isSubjective: false,
      needsSelfAssessment: false,
      pointsAwarded: isCorrect ? (question.points || 10) : 0,
      userAnswer,
      explanation: question.explanation || ''
    };
  }

  // 3. Dạng điền từ vào chỗ trống (fill_blank)
  if (qType === 'fill_blank') {
    let isCorrect = false;
    const accepted = (question.accepted_answers || question.acceptedAnswers || []).map(normalizeAnswerText);
    
    if (question.correct_option_index !== undefined && question.options?.[question.correct_option_index]) {
      accepted.push(normalizeAnswerText(question.options[question.correct_option_index].text));
    }

    if (typeof userAnswer === 'number') {
      isCorrect = userAnswer === question.correct_option_index || userAnswer === question.correctIndex;
    } else {
      const userClean = normalizeAnswerText(userAnswer);
      isCorrect = accepted.includes(userClean);
    }

    return {
      isCorrect,
      isSubjective: false,
      needsSelfAssessment: false,
      pointsAwarded: isCorrect ? (question.points || 10) : 0,
      userAnswer,
      explanation: question.explanation || ''
    };
  }

  // 4. Trắc nghiệm khách quan chuẩn (listening_mcq, reading_mcq, multiple_choice, true_false)
  const targetIndex = question.correct_option_index !== undefined ? question.correct_option_index : question.correctIndex;
  const selectedIndex = Number(userAnswer);
  const isCorrect = !isNaN(selectedIndex) && selectedIndex === targetIndex;

  return {
    isCorrect,
    isSubjective: false,
    needsSelfAssessment: false,
    pointsAwarded: isCorrect ? (question.points || 10) : 0,
    userAnswer: isNaN(selectedIndex) ? userAnswer : selectedIndex,
    explanation: question.explanation || ''
  };
}

/**
 * Thuật toán Quy đổi Điểm thi thử CBT Thang 200/300
 */
export function calculateHskCbtScore(arg1 = {}, arg2 = {}, arg3 = 0) {
  let exam = {};
  let submittedAnswers = {};
  let timeSpentSeconds = 0;

  if (arg1 && arg1.questions) {
    exam = arg1;
    if (arg2 && typeof arg2 === 'object' && arg2.submittedAnswers !== undefined) {
      submittedAnswers = arg2.submittedAnswers || {};
      timeSpentSeconds = arg2.timeSpentSeconds || 0;
    } else {
      submittedAnswers = arg2 || {};
      timeSpentSeconds = arg3 || 0;
    }
  } else if (arg1 && typeof arg1 === 'object') {
    exam = arg1.exam || {};
    submittedAnswers = arg1.submittedAnswers || {};
    timeSpentSeconds = arg1.timeSpentSeconds || 0;
  }

  const hskLevel = exam.level || 'HSK 1';
  const config = getHskScoreConfig(hskLevel);
  const questions = Array.isArray(exam.questions) ? exam.questions : [];

  // Nhóm câu hỏi theo phần thi (Section)
  const sectionQuestions = {
    listening: [],
    reading: [],
    writing: []
  };

  questions.forEach(q => {
    const rawType = (q.section || q.part_type || 'reading').toLowerCase();
    let secKey = 'reading';
    if (rawType.includes('listen') || rawType === '听力') secKey = 'listening';
    else if (rawType.includes('writ') || rawType === '书写') secKey = 'writing';
    else secKey = 'reading';

    if (!sectionQuestions[secKey]) sectionQuestions[secKey] = [];
    sectionQuestions[secKey].push(q);
  });

  // Chấm điểm từng câu hỏi
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnanswered = 0;
  let totalSubjective = 0;

  const detailedResults = questions.map(q => {
    const rawAns = submittedAnswers[q.id];
    const grade = gradeSingleQuestion(q, rawAns);

    if (grade.isSubjective) totalSubjective++;
    else if (grade.isCorrect === true) totalCorrect++;
    else if (rawAns === undefined || rawAns === null || rawAns === '') totalUnanswered++;
    else totalIncorrect++;

    return {
      questionId: q.id,
      prompt: q.prompt,
      pinyin: q.pinyin,
      translation: q.translation,
      section: q.section || q.part_type || 'reading',
      questionType: q.questionType || q.question_type || 'multiple_choice',
      audioScript: q.audioScript || q.audio_script || '',
      audioUrl: q.audioUrl || q.audio_url || '',
      options: q.options || [],
      words: q.words || q.scrambledWords || [],
      userAnswer: grade.userAnswer,
      isCorrect: grade.isCorrect,
      isSubjective: grade.isSubjective,
      needsSelfAssessment: grade.needsSelfAssessment,
      explanation: grade.explanation,
      correctIndex: q.correct_option_index !== undefined ? q.correct_option_index : q.correctIndex,
      correctSentence: q.correct_sentence || q.correctSentence || '',
      correctOrder: q.correct_order || q.correctOrder || q.answerKey || [],
      points: q.points || 10,
      pointsAwarded: grade.pointsAwarded,
      relatedVocab: q.relatedVocab || []
    };
  });

  // Tính điểm từng phần theo thang 100 điểm chuẩn
  const sectionsBreakdown = {};
  let computedTotalScore = 0;
  let hasEliminationSection = false;

  config.sections.forEach(sec => {
    const secQList = sectionQuestions[sec.id] || [];
    const secObjective = secQList.filter(q => !q.is_subjective && q.question_type !== 'free_writing');
    const secCorrectCount = detailedResults.filter(r => {
      const q = questions.find(item => item.id === r.questionId);
      if (!q) return false;
      const qSec = (q.section || q.part_type || 'reading').toLowerCase();
      const matchesSec = (sec.id === 'listening' && (qSec.includes('listen') || qSec === '听力')) ||
                         (sec.id === 'writing' && (qSec.includes('writ') || qSec === '书写')) ||
                         (sec.id === 'reading' && (qSec.includes('read') || qSec === '阅读'));
      return matchesSec && r.isCorrect === true;
    }).length;

    const totalSecQ = secObjective.length;
    let sectionScore = 0;

    if (totalSecQ > 0) {
      sectionScore = Math.round((secCorrectCount / totalSecQ) * 100);
    } else if (secQList.length > 0) {
      // Trường hợp chỉ có câu tự luận
      sectionScore = 100;
    }

    if (sectionScore < config.eliminationThreshold && totalSecQ > 0) {
      hasEliminationSection = true;
    }

    sectionsBreakdown[sec.id] = {
      name: sec.name,
      score: sectionScore,
      maxScore: 100,
      totalQuestions: secQList.length,
      correctQuestions: secCorrectCount,
      accuracyPercentage: totalSecQ > 0 ? Math.round((secCorrectCount / totalSecQ) * 100) : 0,
      isBelowElimination: sectionScore < config.eliminationThreshold && totalSecQ > 0
    };

    computedTotalScore += sectionScore;
  });

  const passed = computedTotalScore >= config.passingScore && !hasEliminationSection;
  const objectiveCount = questions.length - totalSubjective;
  const overallAccuracy = objectiveCount > 0 ? Math.round((totalCorrect / objectiveCount) * 1000) / 10 : 0;

  // Xác định kỹ năng mạnh nhất & yếu nhất
  const secList = Object.entries(sectionsBreakdown).map(([k, v]) => ({ key: k, ...v }));
  secList.sort((a, b) => b.score - a.score);
  const strongestSkill = secList[0] || null;
  const weakestSkill = secList[secList.length - 1] || null;

  // Lời khuyên sư phạm
  const recommendations = [];
  if (hasEliminationSection) {
    recommendations.push({
      type: 'warning',
      text: `Điểm phần thi ${weakestSkill?.name || 'kỹ năng'} của bạn đạt ${weakestSkill?.score}/100 (dưới ngưỡng an toàn 40 điểm). Bạn cần tập trung luyện thêm kỹ năng này.`
    });
  }
  if (passed) {
    recommendations.push({
      type: 'success',
      text: `Xuất sắc! Bạn đã vượt qua bài thi thử ${hskLevel} với tổng điểm ${computedTotalScore}/${config.maxScore} điểm (Ngưỡng đạt: ${config.passingScore}).`
    });
  } else {
    recommendations.push({
      type: 'info',
      text: `Rất tiếc! Điểm số ${computedTotalScore}/${config.maxScore} chưa đạt ngưỡng đậu chuẩn quốc tế (${config.passingScore} điểm). Hãy ôn tập lại các câu sai để cải thiện.`
    });
  }

  // Thu thập từ vựng liên quan của các câu làm sai để đưa vào Flashcard
  const mistakesVocab = [];
  detailedResults.forEach(r => {
    if (r.isCorrect === false && Array.isArray(r.relatedVocab)) {
      mistakesVocab.push(...r.relatedVocab);
    }
  });

  return {
    hskLevel,
    totalScore: computedTotalScore,
    maxScore: config.maxScore,
    passingScore: config.passingScore,
    passed,
    hasEliminationSection,
    eliminatedByZeroScore: hasEliminationSection,
    eliminationThreshold: config.eliminationThreshold,
    timeSpentSeconds,
    accuracyPercentage: overallAccuracy,
    totalQuestions: questions.length,
    correctCount: totalCorrect,
    incorrectCount: totalIncorrect,
    unansweredCount: totalUnanswered,
    subjectiveCount: totalSubjective,
    sectionsBreakdown,
    sections: sectionsBreakdown,
    strongestSkill: strongestSkill?.key || (strongestSkill ? String(strongestSkill.name || '') : null),
    weakestSkill: weakestSkill?.key || (weakestSkill ? String(weakestSkill.name || '') : null),
    strongestSkillDetail: strongestSkill,
    weakestSkillDetail: weakestSkill,
    recommendations,
    mistakesVocab: Array.from(new Set(mistakesVocab)),
    detailedResults
  };
}
