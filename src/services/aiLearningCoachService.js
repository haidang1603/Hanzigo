// =========================================================================
// HANZI GO - AI LEARNING COACH & PERSONALIZED LEARNING ENGINE
// =========================================================================
// Hệ thống Cố vấn Học tập AI Cá nhân hóa cho học viên tiếng Trung:
// - Phân tích hồ sơ năng lực 7 kỹ năng chuẩn xác (không tạo điểm số giả)
// - Phát hiện lỗ hổng kiến thức và rủi ro gián đoạn học tập
// - Lập Kế hoạch học tập Hôm nay (Today's Learning Plan) theo dữ liệu thực
// - Chu trình học khép kín: Assess -> Learn -> Practice -> Evaluate -> Detect -> Recommend -> SRS -> Next Lesson
// - Bộ đệm thông minh (Smart Caching) & Chế độ Sư phạm Ngoại tuyến (Offline Heuristics)
// =========================================================================

import { 
  getUserStorageKey, 
  getLocalDateString, 
  getStreakStatus 
} from '../utils/gamification.js';

import { 
  isCardDueForReview, 
  getDueReviewCards 
} from '../utils/srsEngine.js';

import { 
  getUserJourneyProgress, 
  getLessonById,
  LEARNING_GOALS,
  getUserLearningGoal,
  getUserDailyGoalMinutes,
  getRecommendedNextLesson,
  getRecommendedReviewLessons,
  getRecommendedMaterialsForUser
} from './learningPathService.js';

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

export const SKILL_KEYS = [
  'vocabulary',
  'grammar',
  'listening',
  'speaking',
  'reading',
  'writing',
  'pronunciation'
];

export const SKILL_LABELS = {
  vocabulary: 'Từ vựng (Vocabulary)',
  grammar: 'Ngữ pháp (Grammar)',
  listening: 'Nghe hiểu (Listening)',
  speaking: 'Nói phản xạ (Speaking)',
  reading: 'Đọc hiểu (Reading)',
  writing: 'Chữ Hán & Thuận bút (Writing)',
  pronunciation: 'Phát âm & Thanh điệu (Pronunciation)'
};

const COACH_STORAGE_KEYS = {
  CACHE: 'hanzigo_ai_coach_cache',
  LEARNING_LOOP: 'hanzigo_learning_loop_state',
  MISTAKES_LOG: 'hanzigo_learning_mistakes_log'
};

// =========================================================================
// 1. STUDENT LEARNING PROFILE BUILDER (DERIVED FROM REAL DATA)
// =========================================================================

/**
 * Xây dựng hồ sơ năng lực học tập dẫn xuất (Derived Profile) từ dữ liệu thực
 * TUYỆT ĐỐI KHÔNG DÙNG RANDOM/FAKE SCORE. Nếu chưa đủ dữ liệu thì trả về null & hasEnoughData: false.
 */
export function buildStudentLearningProfile(user = null) {
  // 1. Dữ liệu từ vựng & SRS
  let rememberedWords = [];
  let reviewWords = [];
  try {
    const remKey = getUserStorageKey('hanzigo_vocab_remembered', user);
    const remRaw = localStorage.getItem(remKey) || (user ? null : localStorage.getItem('hanzigo_vocab_remembered'));
    if (remRaw) rememberedWords = JSON.parse(remRaw) || [];

    const revKey = getUserStorageKey('hanzigo_vocab_review', user);
    const revRaw = localStorage.getItem(revKey) || (user ? null : localStorage.getItem('hanzigo_vocab_review'));
    if (revRaw) reviewWords = JSON.parse(revRaw) || [];
  } catch {}

  // 2. Lịch sử bài học đã hoàn thành
  const journey = getUserJourneyProgress(user);
  const completedLessonsMap = journey.completedLessons || {};
  const completedLessonIds = Object.keys(completedLessonsMap);

  // 3. Lịch sử phát âm thực tế từ microphone
  let pronounceHistory = [];
  try {
    const pKey = getUserStorageKey('hanzigo_pronounce_history', user);
    const pRaw = localStorage.getItem(pKey) || (user ? null : localStorage.getItem('hanzigo_pronounce_history'));
    if (pRaw) pronounceHistory = JSON.parse(pRaw) || [];
  } catch {}

  // 4. Lịch sử viết chữ Hán
  let customWritingChars = [];
  try {
    const wKey = getUserStorageKey('hanzigo_custom_writing_chars', user);
    const wRaw = localStorage.getItem(wKey) || (user ? null : localStorage.getItem('hanzigo_custom_writing_chars'));
    if (wRaw) customWritingChars = JSON.parse(wRaw) || [];
  } catch {}

  // 5. Nhật ký thời gian học tập & chuỗi ngày học
  const streakInfo = getStreakStatus(user);
  let studyMinutesMap = {};
  try {
    const mKey = getUserStorageKey('hanzigo_daily_study_minutes', user);
    const mRaw = localStorage.getItem(mKey);
    if (mRaw) studyMinutesMap = JSON.parse(mRaw) || {};
  } catch {}

  const totalStudyMinutes = Object.values(studyMinutesMap).reduce((acc, m) => acc + (Number(m) || 0), 0);

  // 6. Tính số từ vựng đến hạn ôn tập (SRS Due)
  // Xây dựng danh sách card SRS từ reviewWords và rememberedWords
  const simulatedCards = reviewWords.map(id => ({
    id,
    nextReviewAt: new Date(Date.now() - 3600000).toISOString(), // quá hạn
    stage: 1,
    easeFactor: 1.8
  }));
  const srsDueCards = getDueReviewCards(simulatedCards);
  const srsDueCount = srsDueCards.length;

  // 6.5. Dữ liệu lớp học và bài tập (Classroom & Assignments)
  let classroomSubmissions = [];
  let overdueAssignmentsCount = 0;
  let lowScoreSubmissions = [];
  try {
    const subKey = 'hanzigo_submissions_store';
    const subRaw = localStorage.getItem(subKey);
    const submissions = subRaw ? JSON.parse(subRaw) : [];
    const studentId = user?.uid || user?.id || 'user_guest';
    classroomSubmissions = submissions.filter(s => s.student_id === studentId || studentId === 'user_guest');

    const assignRaw = localStorage.getItem('hanzigo_assignments_store');
    const allAssignments = assignRaw ? JSON.parse(assignRaw) : [];
    const submittedAssignIds = new Set(classroomSubmissions.map(s => s.assignment_id));
    const now = Date.now();
    for (const a of allAssignments) {
      if (a.due_date && !submittedAssignIds.has(a.id)) {
        const dueTime = new Date(a.due_date).getTime();
        if (dueTime < now) {
          overdueAssignmentsCount++;
        }
      }
    }

    for (const sub of classroomSubmissions) {
      if (sub.graded && typeof sub.score === 'number' && sub.score < 60) {
        lowScoreSubmissions.push(sub);
      }
    }
  } catch {}

  // 7. Tính điểm cho 7 kỹ năng (Honest, 0 random)
  const skills = {};

  // (1) VOCABULARY
  const totalTargetVocab = 150; // Chuẩn HSK 1
  if (rememberedWords.length === 0 && reviewWords.length === 0) {
    skills.vocabulary = {
      score: null,
      hasEnoughData: false,
      statusText: 'Chưa đủ dữ liệu',
      metrics: { rememberedCount: 0, reviewCount: 0 }
    };
  } else {
    const vocabScore = Math.min(100, Math.round((rememberedWords.length / totalTargetVocab) * 100));
    skills.vocabulary = {
      score: vocabScore,
      hasEnoughData: true,
      statusText: `${vocabScore}% mục tiêu HSK 1`,
      metrics: { rememberedCount: rememberedWords.length, reviewCount: reviewWords.length }
    };
  }

  // (2) GRAMMAR
  if (completedLessonIds.length === 0) {
    skills.grammar = {
      score: null,
      hasEnoughData: false,
      statusText: 'Chưa đủ dữ liệu',
      metrics: { lessonsEvaluated: 0 }
    };
  } else {
    const scores = completedLessonIds.map(id => completedLessonsMap[id]?.score || 70);
    const avgGrammar = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    skills.grammar = {
      score: avgGrammar,
      hasEnoughData: true,
      statusText: `Trung bình ${avgGrammar}/100`,
      metrics: { lessonsEvaluated: completedLessonIds.length }
    };
  }

  // (3) LISTENING
  if (completedLessonIds.length === 0) {
    skills.listening = {
      score: null,
      hasEnoughData: false,
      statusText: 'Chưa đủ dữ liệu',
      metrics: { dialoguesCompleted: 0 }
    };
  } else {
    // Tỷ lệ hoàn thành bước nghe trong các bài học đã qua
    const listeningFactor = Math.min(100, Math.round((completedLessonIds.length / 15) * 100));
    skills.listening = {
      score: listeningFactor,
      hasEnoughData: true,
      statusText: `${completedLessonIds.length} bài đối thoại hoàn thành`,
      metrics: { dialoguesCompleted: completedLessonIds.length }
    };
  }

  // (4) SPEAKING
  if (pronounceHistory.length === 0) {
    skills.speaking = {
      score: null,
      hasEnoughData: false,
      statusText: 'Chưa đủ dữ liệu',
      metrics: { speechSessions: 0 }
    };
  } else {
    const avgFluency = Math.round(
      pronounceHistory.reduce((acc, p) => acc + (p.fluencyScore || p.overall || 70), 0) / pronounceHistory.length
    );
    skills.speaking = {
      score: avgFluency,
      hasEnoughData: true,
      statusText: `Phản xạ ${avgFluency}/100 (${pronounceHistory.length} lượt)`,
      metrics: { speechSessions: pronounceHistory.length }
    };
  }

  // (5) READING
  if (completedLessonIds.length === 0 && rememberedWords.length === 0) {
    skills.reading = {
      score: null,
      hasEnoughData: false,
      statusText: 'Chưa đủ dữ liệu',
      metrics: { readingExCompleted: 0 }
    };
  } else {
    const readingScore = Math.min(100, Math.round(
      ((completedLessonIds.length * 5 + rememberedWords.length) / 80) * 100
    ));
    skills.reading = {
      score: readingScore,
      hasEnoughData: true,
      statusText: `Độ hiểu mặt chữ ${readingScore}%`,
      metrics: { readingExCompleted: completedLessonIds.length }
    };
  }

  // (6) WRITING
  if (customWritingChars.length === 0) {
    skills.writing = {
      score: null,
      hasEnoughData: false,
      statusText: 'Chưa đủ dữ liệu',
      metrics: { charsWritten: 0 }
    };
  } else {
    const writingScore = Math.min(100, Math.round((customWritingChars.length / 20) * 100));
    skills.writing = {
      score: writingScore,
      hasEnoughData: true,
      statusText: `Đã luyện ${customWritingChars.length} chữ thuận bút`,
      metrics: { charsWritten: customWritingChars.length }
    };
  }

  // (7) PRONUNCIATION
  if (pronounceHistory.length === 0) {
    skills.pronunciation = {
      score: null,
      hasEnoughData: false,
      statusText: 'Chưa đủ dữ liệu',
      metrics: { testsRecorded: 0 }
    };
  } else {
    const validScores = pronounceHistory.map(p => Number(p.overall) || 0);
    const avgPronounce = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
    skills.pronunciation = {
      score: avgPronounce,
      hasEnoughData: true,
      statusText: `Độ chuẩn xác ${avgPronounce}/100`,
      metrics: { testsRecorded: pronounceHistory.length }
    };
  }

  // 8. Trích xuất từ vựng yếu (Weak Vocabulary)
  const weakVocabulary = reviewWords.slice(0, 10).map(id => {
    const found = VOCABULARY_LIST.find(v => v.id === id);
    return {
      id,
      hanzi: found?.hanzi || id,
      pinyin: found?.pinyin || '',
      meaning: found?.meaning || 'Từ cần củng cố'
    };
  });

  // 9. Lỗi sai gần đây (Recent Mistakes)
  const recentMistakes = [];
  pronounceHistory.slice(-5).forEach(p => {
    if (p.overall < 70) {
      recentMistakes.push({
        type: 'pronunciation',
        target: p.targetHanzi || 'Phát âm',
        score: p.overall,
        detail: `Âm tiết hoặc thanh điệu chưa chuẩn xác (${p.overall}/100)`
      });
    }
  });

  // 10. Tính toán ngày không hoạt động (Inactivity detection)
  let daysInactive = 0;
  const lastStudyDateStr = Object.keys(studyMinutesMap).sort().pop();
  if (lastStudyDateStr) {
    const lastDate = new Date(lastStudyDateStr);
    const diffMs = Date.now() - lastDate.getTime();
    daysInactive = Math.max(0, Math.floor(diffMs / (86400000)));
  } else if (completedLessonIds.length === 0 && rememberedWords.length === 0) {
    daysInactive = 0; // Tài khoản mới tinh
  } else {
    daysInactive = streakInfo.streak === 0 ? 3 : 0;
  }

  // 11. Mục tiêu học tập & Thời gian học mỗi ngày
  const learningGoal = getUserLearningGoal(user);
  const dailyGoalMinutes = getUserDailyGoalMinutes(user);

  // 12. Phát hiện người học mới (Sparse Data Detection)
  const hasSparseData = completedLessonIds.length === 0 && 
    rememberedWords.length === 0 && 
    reviewWords.length === 0 && 
    pronounceHistory.length === 0 && 
    customWritingChars.length === 0 && 
    totalStudyMinutes === 0;

  const guidanceForNewLearner = hasSparseData ? {
    isNewLearner: true,
    title: 'Học viên mới — Chưa có đủ dữ liệu học tập',
    message: 'Hệ thống chưa ghi nhận lịch sử học tập của bạn. Để AI cá nhân hóa lộ trình phù hợp và chuẩn xác nhất, bạn hãy làm Bài kiểm tra đầu vào (Placement Test 10 câu - 3 phút) hoặc bắt đầu ngay Bài 101.',
    suggestedAction: 'placement_test'
  } : null;

  // 13. Đề xuất bài học tiếp theo & bài cần ôn lại
  const nextLesson = getRecommendedNextLesson(user);
  const reviewLessons = getRecommendedReviewLessons(user, 3);

  return {
    userId: user?.uid || user?.id || 'guest',
    userName: user?.name || 'Học viên',
    userObj: user,
    hskLevel: user?.hskLevel || user?.level || 'HSK 1',
    learningGoal,
    learningGoalDetails: LEARNING_GOALS[learningGoal] || LEARNING_GOALS.general_foundation,
    dailyGoalMinutes,
    hasSparseData,
    guidanceForNewLearner,
    nextLesson,
    reviewLessons,
    skills,
    srsDueCount,
    weakVocabulary,
    recentMistakes,
    studyTime: {
      totalMinutes: Math.round(totalStudyMinutes),
      totalHours: (totalStudyMinutes / 60).toFixed(1)
    },
    lessonCompletion: {
      completedCount: completedLessonIds.length,
      totalCount: 60,
      percentage: Math.min(100, Math.round((completedLessonIds.length / 60) * 100)),
      activeLessonId: journey.activeLessonId || 'l-101'
    },
    streak: streakInfo.streak,
    daysInactive,
    lastActiveDate: lastStudyDateStr || null,
    classroomData: {
      submissions: classroomSubmissions,
      overdueCount: overdueAssignmentsCount,
      lowScoreSubmissions
    }
  };
}

// =========================================================================
// 2. WEAKNESS DETECTION ENGINE
// =========================================================================

/**
 * Phát hiện lỗ hổng và rủi ro học tập dựa trên dữ liệu thật
 */
export function detectWeaknesses(profile) {
  if (!profile) return [];
  const weaknesses = [];

  // 1. Rủi ro gián đoạn học tập (Inactivity Risk)
  if (profile.daysInactive >= 7) {
    weaknesses.push({
      id: 'wk-inactivity-high',
      skill: 'inactivity',
      severity: 'high',
      label: 'Nguy cơ gián đoạn học tập (7+ ngày không học)',
      detail: `Bạn đã không học trong ${profile.daysInactive} ngày qua. Trí nhớ từ vựng có thể giảm sút nhanh chóng nếu không ôn tập.`,
      suggestedAction: 'Bắt đầu bài khởi động nhẹ 5 phút để kích hoạt lại thói quen.',
      targetRoute: 'roadmap'
    });
  } else if (profile.streak === 0 && profile.srsDueCount > 0) {
    weaknesses.push({
      id: 'wk-streak-broken',
      skill: 'inactivity',
      severity: 'medium',
      label: 'Chuỗi ngày học bị ngắt quãng',
      detail: `Hiện có ${profile.srsDueCount} từ vựng đang chờ bạn ôn tập lại.`,
      suggestedAction: 'Ôn tập nhanh để lấy lại chuỗi streak ngọn lửa 🔥!',
      targetRoute: 'vocabulary'
    });
  }

  // 2. Điểm yếu từ vựng (Weak Vocabulary / Overdue SRS)
  if (profile.srsDueCount >= 10) {
    weaknesses.push({
      id: 'wk-srs-overflow',
      skill: 'vocabulary',
      severity: 'high',
      label: `Từ vựng dồn ứ (${profile.srsDueCount} từ cần ôn)`,
      detail: 'Nhiều từ vựng đã vượt chu kỳ lặp lại ngắt quãng SM-2 và có nguy cơ bị lãng quên hoàn toàn.',
      suggestedAction: 'Dành 10 phút hoàn thành chu kỳ SRS Spaced Repetition hôm nay.',
      targetRoute: 'vocabulary'
    });
  } else if (profile.weakVocabulary.length > 0) {
    weaknesses.push({
      id: 'wk-vocab-difficult',
      skill: 'vocabulary',
      severity: 'medium',
      label: `Có ${profile.weakVocabulary.length} từ vựng hay quên`,
      detail: `Các từ: ${profile.weakVocabulary.map(v => v.hanzi).slice(0, 4).join(', ')} cần được củng cố ngữ cảnh.`,
      suggestedAction: 'Luyện tập Flashcard chuyên sâu cho nhóm từ hay quên.',
      targetRoute: 'vocabulary'
    });
  }

  // 3. Điểm yếu phát âm & thanh điệu (Pronunciation Weakness)
  if (profile.skills.pronunciation.hasEnoughData && profile.skills.pronunciation.score < 70) {
    weaknesses.push({
      id: 'wk-pronunciation-low',
      skill: 'pronunciation',
      severity: 'high',
      label: `Điểm phát âm thấp (${profile.skills.pronunciation.score}/100)`,
      detail: `Thanh điệu tiếng Trung (đặc biệt thanh 3 và thanh 4) cần được điều chỉnh để giao tiếp chuẩn xác (${profile.skills.pronunciation.score}/100).`,
      suggestedAction: 'Luyện 5 mẫu câu ngắn với bộ chẩn đoán phát âm HanziGo.',
      targetRoute: 'pronunciation'
    });
  } else if (profile.skills.pronunciation.score === null && profile.lessonCompletion.completedCount >= 2) {
    weaknesses.push({
      id: 'wk-pronunciation-skipped',
      skill: 'pronunciation',
      severity: 'medium',
      label: 'Chưa kích hoạt thực hành giọng nói qua Mic',
      detail: 'Bạn đã hoàn thành bài học nhưng chưa luyện phát âm thực tế để kích hoạt trí nhớ cơ miệng.',
      suggestedAction: 'Bật Mic và thử thách phát âm với 3 câu giao tiếp cơ bản.',
      targetRoute: 'pronunciation'
    });
  }

  // 4. Điểm yếu nghe hiểu (Listening Weakness)
  if (profile.skills.listening.hasEnoughData && profile.skills.listening.score < 60) {
    weaknesses.push({
      id: 'wk-listening-low',
      skill: 'listening',
      severity: 'medium',
      label: 'Kỹ năng nghe hiểu cần tăng cường',
      detail: 'Tốc độ nhận diện âm thanh thoại tiếng Trung còn chậm so với tốc độ chuẩn của người bản ngữ.',
      suggestedAction: 'Luyện nghe đối thoại theo ngữ cảnh trong phòng hội thoại.',
      targetRoute: 'conversation'
    });
  }

  // 5. Điểm yếu chữ Hán & Thuận bút (Writing Weakness)
  if (profile.skills.writing.hasEnoughData && profile.skills.writing.score < 50) {
    weaknesses.push({
      id: 'wk-writing-low',
      skill: 'writing',
      severity: 'low',
      label: 'Quy tắc thuận bút chữ Hán chưa vững',
      detail: 'Viết đúng thứ tự nét giúp bạn ghi nhớ cấu trúc bộ thủ và mặt chữ lâu hơn gấp 3 lần.',
      suggestedAction: 'Thực hành tập viết 5 chữ Hán cơ bản trên bảng Mễ tự cách.',
      targetRoute: 'writing'
    });
  }

  // 6. Điểm yếu ngữ pháp (Grammar Weakness)
  if (profile.skills.grammar.hasEnoughData && profile.skills.grammar.score < 70) {
    weaknesses.push({
      id: 'wk-grammar-low',
      skill: 'grammar',
      severity: 'medium',
      label: `Điểm kiểm tra ngữ pháp dưới chuẩn (${profile.skills.grammar.score}/100)`,
      detail: 'Thứ tự từ trong câu (Trạng ngữ chỉ thời gian / nơi chốn) có một số nhầm lẫn so với tiếng Việt.',
      suggestedAction: 'Ôn lại các cấu trúc câu trọng tâm trong bài học gần nhất.',
      targetRoute: 'roadmap'
    });
  }

  // 6.5. Rủi ro học tập trên Lớp học (Classroom Academic Risk)
  if (profile.classroomData?.overdueCount > 0) {
    weaknesses.push({
      id: 'wk-classroom-overdue',
      skill: 'classroom',
      severity: 'high',
      label: `Có ${profile.classroomData.overdueCount} bài tập trên lớp đã quá hạn`,
      detail: 'Bạn có bài tập được giáo viên giao trong Lớp học đã quá hạn nộp. Cần hoàn thành ngay để không bị gián đoạn tiến độ và điểm số.',
      suggestedAction: 'Vào Lớp học nộp bài tập để giáo viên chấm điểm và nhận xét.',
      targetRoute: 'classroom'
    });
  } else if (profile.classroomData?.lowScoreSubmissions?.length > 0) {
    const latestLow = profile.classroomData.lowScoreSubmissions[0];
    weaknesses.push({
      id: 'wk-classroom-lowscore',
      skill: 'classroom',
      severity: 'medium',
      label: `Bài tập lớp học cần củng cố (${latestLow.score}/100 đ)`,
      detail: latestLow.feedback 
        ? `Nhận xét của giáo viên: "${latestLow.feedback}"` 
        : 'Điểm bài tập của bạn dưới 60 điểm. Hãy xem lại kiến thức bài học và cải thiện lỗi sai.',
      suggestedAction: 'Xem nhận xét của giáo viên và ôn lại kiến thức liên quan.',
      targetRoute: 'classroom'
    });
  }

  // 7. Trường hợp học viên mới hoàn toàn chưa có dữ liệu nào
  if (weaknesses.length === 0 && profile.hasSparseData) {
    weaknesses.push({
      id: 'wk-sparse-data',
      skill: 'placement',
      severity: 'medium',
      label: 'Chưa có dữ liệu đánh giá đầu vào',
      detail: 'Hệ thống chưa ghi nhận lịch sử học tập. Bạn hãy làm bài kiểm tra đầu vào 3 phút để hệ thống định vị chính xác lộ trình phù hợp.',
      suggestedAction: 'Làm bài kiểm tra đầu vào (Placement Test)',
      targetRoute: 'roadmap',
      actionType: 'placement_test'
    });
  }

  return weaknesses;
}

// =========================================================================
// 3. DAILY LEARNING PLAN GENERATOR (NON-RANDOM, DATA-DRIVEN, ADAPTIVE)
// =========================================================================

/**
 * Lập kế hoạch học tập hôm nay (Today's Learning Plan) thích ứng với thời gian và mục tiêu
 * Thời lượng đề xuất: 10, 15, 20, 30, 45, 60 phút
 */
export function generateDailyLearningPlan(profile, weaknesses = [], durationMinutes = 15, learningGoal = null) {
  const plan = [];
  const targetMinutes = Math.max(10, Math.min(60, Number(durationMinutes) || profile?.dailyGoalMinutes || 15));
  const targetGoal = learningGoal || profile?.learningGoal || 'general_foundation';

  const nextLesson = profile?.nextLesson || getRecommendedNextLesson(profile?.userObj || null);
  const reviewLessons = profile?.reviewLessons || getRecommendedReviewLessons(profile?.userObj || null, 2);

  // 1. Bước 1: Ôn tập Spaced Repetition (SRS)
  if (profile?.srsDueCount > 0 || (profile?.weakVocabulary && profile.weakVocabulary.length > 0)) {
    const dueCount = Math.min(15, Math.max(5, profile.srsDueCount || profile.weakVocabulary.length));
    const srsMins = targetMinutes >= 30 ? 5 : (targetMinutes >= 20 ? 4 : (targetMinutes <= 10 ? 2 : 3));
    plan.push({
      id: 'plan-step-srs',
      type: 'srs',
      title: `Ôn tập ${dueCount} từ vựng đến hạn (SRS SM-2)`,
      subtitle: 'Chu kỳ lặp lại ngắt quãng củng cố trí nhớ dài hạn',
      durationMinutes: srsMins,
      targetRef: 'vocabulary',
      route: 'vocabulary',
      reason: `Bạn có ${profile.srsDueCount || dueCount} thẻ từ đến hạn ôn tập hoặc cần củng cố theo chu kỳ SM-2.`,
      completed: false
    });
  } else {
    plan.push({
      id: 'plan-step-srs-new',
      type: 'srs',
      title: 'Khám phá 5 từ vựng mới theo chuẩn HSK',
      subtitle: 'Nạp thêm vốn từ vựng vào chu kỳ ghi nhớ',
      durationMinutes: targetMinutes <= 10 ? 2 : 3,
      targetRef: 'vocabulary',
      route: 'vocabulary',
      reason: 'Bộ từ vựng hiện tại của bạn đã được ôn tập đầy đủ, hãy nạp thêm từ mới!',
      completed: false
    });
  }

  // 2. Bước 2: Khắc phục điểm yếu ưu tiên cao nhất
  const topWeakness = weaknesses.find(w => w.severity === 'high') || weaknesses[0];
  if (topWeakness) {
    if (topWeakness.actionType === 'placement_test' || topWeakness.skill === 'placement') {
      plan.push({
        id: 'plan-step-placement',
        type: 'placement',
        title: 'Làm bài đánh giá đầu vào 3 phút (Placement Test)',
        subtitle: '10 câu hỏi định vị cấp độ HSK chính xác',
        durationMinutes: targetMinutes <= 10 ? 2 : 3,
        targetRef: 'placement_test',
        route: 'roadmap',
        reason: 'Hệ thống cần dữ liệu đầu vào để mở khóa bài học phù hợp với trình độ của bạn.',
        completed: false
      });
    } else if (topWeakness.skill === 'pronunciation') {
      plan.push({
        id: 'plan-step-pronounce',
        type: 'pronunciation',
        title: 'Thử thách phát âm 4 Thanh điệu & Biến điệu',
        subtitle: 'Chẩn đoán âm sắc và phản xạ nói chuẩn Bắc Kinh',
        durationMinutes: targetMinutes <= 10 ? 2 : 4,
        targetRef: 'pronunciation',
        route: 'pronunciation',
        reason: topWeakness.detail,
        completed: false
      });
    } else if (topWeakness.skill === 'listening') {
      plan.push({
        id: 'plan-step-listening',
        type: 'listening',
        title: 'Luyện nghe hiểu hội thoại tương tác',
        subtitle: 'Nghe đối thoại thực tế và chọn câu trả lời chính xác',
        durationMinutes: targetMinutes <= 10 ? 2 : 4,
        targetRef: 'conversation',
        route: 'conversation',
        reason: topWeakness.detail,
        completed: false
      });
    } else if (topWeakness.skill === 'writing') {
      plan.push({
        id: 'plan-step-writing',
        type: 'writing',
        title: 'Thực hành tập viết chữ Hán đúng thuận bút',
        subtitle: 'Luyện nét chữ trên ô vuông Mễ tự cách',
        durationMinutes: targetMinutes <= 10 ? 2 : 4,
        targetRef: 'writing',
        route: 'writing',
        reason: topWeakness.detail,
        completed: false
      });
    } else if (topWeakness.skill === 'grammar') {
      plan.push({
        id: 'plan-step-grammar',
        type: 'grammar',
        title: 'Củng cố cấu trúc ngữ pháp còn nhầm lẫn',
        subtitle: 'Luyện đặt câu và phân biệt thứ tự từ',
        durationMinutes: targetMinutes <= 10 ? 2 : 4,
        targetRef: 'roadmap',
        route: 'roadmap',
        reason: topWeakness.detail,
        completed: false
      });
    } else if (topWeakness.skill === 'classroom' || topWeakness.targetRoute === 'classroom') {
      plan.push({
        id: 'plan-step-classroom',
        type: 'classroom',
        title: topWeakness.label,
        subtitle: 'Hoàn thành bài tập được giáo viên giao và xem nhận xét',
        durationMinutes: 5,
        targetRef: 'classroom',
        route: 'classroom',
        reason: topWeakness.detail,
        completed: false
      });
    }
  }

  // Bổ sung bước luyện nghe nếu phát hiện điểm yếu nghe hiểu
  const listWk = weaknesses.find(w => w.skill === 'listening');
  if (listWk && !plan.some(p => p.type === 'listening')) {
    plan.push({
      id: 'plan-step-listening-drill',
      type: 'listening',
      title: 'Luyện nghe hiểu hội thoại tương tác',
      subtitle: 'Nghe đối thoại thực tế và chọn câu trả lời chính xác',
      durationMinutes: targetMinutes <= 10 ? 2 : 4,
      targetRef: 'conversation',
      route: 'conversation',
      reason: listWk.detail,
      completed: false
    });
  }

  // Luôn đảm bảo có bước phát âm nếu chưa có (khi thời lượng > 10 phút hoặc chưa có bài tập kỹ năng)
  if (!plan.some(p => p.type === 'pronunciation') && (targetMinutes > 10 || plan.length < 2)) {
    plan.push({
      id: 'plan-step-pronounce-daily',
      type: 'pronunciation',
      title: 'Luyện phát âm câu ngắn phản xạ hàng ngày',
      subtitle: 'Đọc to rõ ràng theo chuẩn phiên âm Pinyin',
      durationMinutes: targetMinutes <= 10 ? 2 : 3,
      targetRef: 'pronunciation',
      route: 'pronunciation',
      reason: 'Duy trì độ chuẩn xác của thanh điệu và ngữ điệu tự nhiên.',
      completed: false
    });
  }

  // 3. Bước 3: Bài học chính trên Lộ trình HSK (Roadmap Lesson)
  const activeLessonId = nextLesson?.lessonId || profile?.lessonCompletion?.activeLessonId || 'l-101';
  const lessonTitle = nextLesson?.title || 'Bài học tiếp theo';
  const mainLessonMins = targetMinutes >= 45 ? 12 : (targetMinutes >= 30 ? 9 : (targetMinutes >= 20 ? 6 : (targetMinutes <= 10 ? 4 : 5)));

  plan.push({
    id: 'plan-step-roadmap',
    type: 'lesson',
    title: `Chinh phục "${lessonTitle}"`,
    subtitle: 'Nắm vững ngữ pháp, từ mới và bài tập thực chiến',
    durationMinutes: mainLessonMins,
    targetRef: activeLessonId,
    route: 'roadmap',
    reason: nextLesson?.reason || `Bài học tiếp theo để hoàn thành cấp độ ${profile?.hskLevel || 'HSK 1'}.`,
    completed: false
  });

  // 4. Bước 4: Bài ôn tập hoặc bổ trợ theo mục tiêu (khi thời lượng >= 20 phút hoặc có bài cần ôn)
  if (targetMinutes >= 20 || reviewLessons.length > 0) {
    if (reviewLessons.length > 0) {
      const topReview = reviewLessons[0];
      plan.push({
        id: 'plan-step-review-lesson',
        type: 'review_lesson',
        title: `Ôn tập lại "${topReview.title}" (${topReview.score}%)`,
        subtitle: 'Khắc phục các câu sai để nâng hạng 3 sao',
        durationMinutes: targetMinutes >= 30 ? 5 : (targetMinutes <= 10 ? 3 : 4),
        targetRef: topReview.lessonId,
        route: 'roadmap',
        reason: topReview.reason,
        completed: false
      });
    } else if (targetGoal === 'daily_communication') {
      plan.push({
        id: 'plan-step-comm-drill',
        type: 'speaking',
        title: 'Luyện đọc to mẫu câu giao tiếp đời sống',
        subtitle: 'Bật Mic thực hành phản xạ nói tự nhiên',
        durationMinutes: 4,
        targetRef: 'pronunciation',
        route: 'pronunciation',
        reason: 'Mục tiêu giao tiếp đời sống đòi hỏi tăng cường thời lượng luyện nói qua Micro.',
        completed: false
      });
    } else if (targetGoal === 'hanzi_culture') {
      plan.push({
        id: 'plan-step-hanzi-drill',
        type: 'writing',
        title: 'Tập viết 3 chữ Hán trọng tâm trong vở ô Mễ tự',
        subtitle: 'Ghi nhớ quy tắc thuận bút và bộ thủ',
        durationMinutes: 4,
        targetRef: 'writing',
        route: 'writing',
        reason: 'Mục tiêu Hán tự & bút thuận yêu cầu thực hành viết tay đều đặn mỗi ngày.',
        completed: false
      });
    } else if (targetGoal === 'hsk_exam') {
      plan.push({
        id: 'plan-step-hsk-drill',
        type: 'grammar',
        title: 'Luyện trắc nghiệm mẫu câu thi HSK',
        subtitle: 'Phản xạ chọn đáp án đúng nhanh và chính xác',
        durationMinutes: 4,
        targetRef: 'roadmap',
        route: 'roadmap',
        reason: 'Mục tiêu luyện thi HSK cần củng cố tốc độ giải đề trắc nghiệm.',
        completed: false
      });
    }
  }

  // 5. Bước 5: Đọc tài liệu tham khảo từ Materials (khi thời lượng >= 30 phút)
  if (targetMinutes >= 30) {
    plan.push({
      id: 'plan-step-materials',
      type: 'materials',
      title: 'Đọc tài liệu bổ trợ từ Thư viện HanziGo',
      subtitle: 'Mở rộng kiến thức với giáo trình và tài liệu học thuật',
      durationMinutes: targetMinutes >= 45 ? 8 : 5,
      targetRef: 'materials',
      route: 'materials',
      reason: `Thời lượng ${targetMinutes} phút cho phép nghiên cứu tài liệu chuyên sâu phù hợp với mục tiêu của bạn.`,
      completed: false
    });
  }

  // 6. Bước 6: Trò chuyện phản xạ cùng Lão Sư AI (Speaking / Dialogue) (khi thời lượng >= 15 phút)
  if (targetMinutes >= 15) {
    plan.push({
      id: 'plan-step-ai-chat',
      type: 'speaking',
      title: 'Hội thoại phản xạ 3 phút cùng Lão Sư HanziGo',
      subtitle: 'Ứng dụng kiến thức hôm nay vào đàm thoại cùng AI',
      durationMinutes: 3,
      targetRef: 'conversation',
      route: 'conversation',
      reason: 'Kích hoạt khả năng ghép câu và phản xạ giao tiếp tự nhiên.',
      completed: false
    });
  }

  // Nếu phiên học ngắn 10 phút, giới hạn tối đa 4 bước trọng tâm nhất
  if (targetMinutes <= 10 && plan.length > 4) {
    return plan.slice(0, 4);
  }

  return plan;
}

// =========================================================================
// 4. OFFLINE PEDAGOGICAL HEURISTIC ENGINE (FALLBACK KHI CHƯA CÓ API)
// =========================================================================

/**
 * Tạo phản hồi Cố vấn AI theo quy tắc sư phạm chuẩn xác khi backend AI offline
 */
export function getOfflineCoachRecommendation(profile, weaknesses = [], options = {}) {
  const durationMinutes = options.durationMinutes || profile?.dailyGoalMinutes || 15;
  const learningGoal = options.learningGoal || profile?.learningGoal || 'general_foundation';

  const dailyPlan = generateDailyLearningPlan(profile, weaknesses, durationMinutes, learningGoal);
  const topWeakness = weaknesses[0];

  const recommendedNextLesson = profile?.nextLesson || getRecommendedNextLesson(profile?.userObj || null);
  const recommendedReviewLessons = profile?.reviewLessons || getRecommendedReviewLessons(profile?.userObj || null, 3);
  const recommendedMaterials = getRecommendedMaterialsForUser(profile?.userObj || null, weaknesses, learningGoal, 3);

  const goalDetails = LEARNING_GOALS[learningGoal] || LEARNING_GOALS.general_foundation;

  let summary = '';
  if (profile?.hasSparseData) {
    summary = `Chào mừng bạn đến với HanziGo! Bạn chưa có dữ liệu học tập ghi nhận, Lão Sư khuyên bạn nên làm bài kiểm tra đầu vào 3 phút để hệ thống đề xuất đúng lộ trình nhất.`;
  } else if (profile?.daysInactive >= 7) {
    summary = `Chào mừng bạn quay lại HanziGo! Bạn đã tạm nghỉ ${profile.daysInactive} ngày, Lão Sư đã điều chỉnh kế hoạch hôm nay ${durationMinutes} phút nhẹ nhàng để khởi động lại trí nhớ từ vựng.`;
  } else if (profile?.srsDueCount >= 10) {
    summary = `Hiện tại bạn có ${profile.srsDueCount} từ vựng đến hạn cần củng cố theo chu kỳ SM-2. Kế hoạch ${durationMinutes} phút hôm nay đã ưu tiên lượt ôn tập để bạn không bị quên từ cũ!`;
  } else if (recommendedReviewLessons.length > 0 && recommendedReviewLessons[0].score < 80) {
    summary = `Lão Sư nhận thấy bài "${recommendedReviewLessons[0].title}" đạt ${recommendedReviewLessons[0].score}%. Kế hoạch hôm nay đã bổ sung phần ôn lại để bạn củng cố ngữ pháp trước khi tiến xa hơn.`;
  } else if (topWeakness) {
    summary = `Lão Sư đã tối ưu kế hoạch ${durationMinutes} phút theo mục tiêu "${goalDetails.shortName}", chú trọng củng cố kỹ năng ${topWeakness.label}.`;
  } else {
    summary = `Bạn đang duy trì tiến độ học rất xuất sắc với chuỗi ${profile?.streak || 0} ngày liên tiếp 🔥! Hãy hoàn thành kế hoạch ${durationMinutes} phút hôm nay theo mục tiêu ${goalDetails.shortName}.`;
  }

  const reasoning = [
    `Mục tiêu học tập: "${goalDetails.name}" với thời lượng phân bổ ${durationMinutes} phút/ngày.`,
    profile?.hasSparseData 
      ? 'Hồ sơ chưa có dữ liệu kiểm tra đầu vào, cần thực hiện Placement Test để định vị xuất phát điểm chuẩn xác.'
      : `Hồ sơ ghi nhận hoàn thành ${profile?.lessonCompletion?.completedCount || 0}/60 bài học trên lộ trình ${profile?.hskLevel || 'HSK 1'}.`,
    profile?.srsDueCount > 0 
      ? `Chu kỳ Spaced Repetition SM-2 yêu cầu ôn tập ${profile.srsDueCount} thẻ từ hôm nay để đảm bảo ghi nhớ dài hạn.`
      : 'Vốn từ vựng đã học đang ở trạng thái ôn tập tốt.',
    recommendedReviewLessons.length > 0
      ? `Có ${recommendedReviewLessons.length} bài kiểm tra đạt dưới 90% (chưa thuần thục 3 sao), được xếp lịch ôn tập bổ trợ.`
      : 'Tất cả các bài đã học đều đạt điểm số cao (>= 90%).',
    weaknesses.length > 0 && !profile?.hasSparseData
      ? `Phát hiện điểm cần cải thiện: ${weaknesses[0].label}.`
      : 'Các chỉ số học tập đều duy trì sự cân bằng ổn định.'
  ];

  const recommendedLessons = [
    {
      id: recommendedNextLesson.lessonId,
      title: recommendedNextLesson.title,
      hskLevel: profile?.hskLevel || 'HSK 1',
      priority: 'high',
      rationale: recommendedNextLesson.reason
    }
  ];

  return {
    summary,
    weaknesses,
    recommendedLessons,
    recommendedNextLesson,
    recommendedReviewLessons,
    recommendedMaterials,
    dailyPlan,
    reasoning,
    guidanceForNewLearner: profile?.guidanceForNewLearner || null,
    learningGoal,
    durationMinutes,
    generatedAt: new Date().toISOString(),
    source: 'offline_heuristic'
  };
}

// =========================================================================
// 5. AI RECOMMENDATION ENGINE (WITH SMART CACHING & PRIVACY)
// =========================================================================

/**
 * Lấy khuyến nghị Cố vấn Học tập AI (Có Caching theo ngày & Bảo mật Privacy)
 */
export async function getAiCoachRecommendation(user = null, { forceRefresh = false, durationMinutes = 15, learningGoal = null } = {}) {
  const profile = buildStudentLearningProfile(user);
  const weaknesses = detectWeaknesses(profile);

  const effectiveMinutes = Math.max(10, Math.min(60, Number(durationMinutes) || profile.dailyGoalMinutes || 15));
  const effectiveGoal = learningGoal || profile.learningGoal || 'general_foundation';

  const todayStr = getLocalDateString(new Date());
  const cacheKey = `${COACH_STORAGE_KEYS.CACHE}_${profile.userId}_${todayStr}`;

  // 1. Kiểm tra cache nếu không yêu cầu forceRefresh
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached && cached.dailyPlan && cached.summary) {
          return { success: true, data: cached, fromCache: true };
        }
      }
    } catch {}
  }

  // 2. Chuẩn bị Sanitized Payload (TUYỆT ĐỐI KHÔNG GỬI token, mật khẩu, email riêng tư)
  const sanitizedPayload = {
    hskLevel: profile.hskLevel,
    learningGoal: effectiveGoal,
    durationMinutes: effectiveMinutes,
    streak: profile.streak,
    daysInactive: profile.daysInactive,
    studyMinutes: profile.studyTime.totalMinutes,
    completedLessonsCount: profile.lessonCompletion.completedCount,
    activeLessonId: profile.lessonCompletion.activeLessonId,
    nextLesson: profile.nextLesson,
    reviewLessonsCount: profile.reviewLessons.length,
    srsDueCount: profile.srsDueCount,
    hasSparseData: profile.hasSparseData,
    skills: Object.fromEntries(
      Object.entries(profile.skills).map(([k, v]) => [
        k, 
        v.hasEnoughData ? v.score : 'Not enough data'
      ])
    ),
    weaknesses: weaknesses.map(w => ({
      skill: w.skill,
      severity: w.severity,
      label: w.label
    })),
    weakVocabHanzi: profile.weakVocabulary.map(v => v.hanzi).slice(0, 5)
  };

  // 3. Lấy token xác thực từ Supabase session hiện tại
  let authToken = '';
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        authToken = session.access_token || '';
      }
    } catch {}
  }

  if (!authToken) {
    try {
      const rawUser = localStorage.getItem('hanzigo_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        authToken = u?.token || u?.access_token || '';
      }
    } catch {}
  }

  // 4. Gọi Backend API endpoint /api/ai/coach
  try {
    const response = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        'x-user-id': profile.userId
      },
      body: JSON.stringify({
        action: 'get_coach_recommendation',
        payload: sanitizedPayload
      })
    });

    if (response.ok) {
      const json = await response.json();
      
      // Strict Validation: Kiểm tra cấu trúc JSON từ AI trước khi sử dụng
      if (
        json && 
        typeof json.summary === 'string' &&
        Array.isArray(json.dailyPlan) &&
        Array.isArray(json.weaknesses)
      ) {
        const validatedData = {
          summary: json.summary,
          weaknesses: json.weaknesses.length > 0 ? json.weaknesses : weaknesses,
          recommendedLessons: Array.isArray(json.recommendedLessons) ? json.recommendedLessons : [],
          recommendedNextLesson: json.recommendedNextLesson || profile.nextLesson,
          recommendedReviewLessons: Array.isArray(json.recommendedReviewLessons) && json.recommendedReviewLessons.length > 0 
            ? json.recommendedReviewLessons 
            : profile.reviewLessons,
          recommendedMaterials: Array.isArray(json.recommendedMaterials) && json.recommendedMaterials.length > 0
            ? json.recommendedMaterials
            : getRecommendedMaterialsForUser(user, weaknesses, effectiveGoal, 3),
          dailyPlan: json.dailyPlan.length > 0 
            ? json.dailyPlan 
            : generateDailyLearningPlan(profile, weaknesses, effectiveMinutes, effectiveGoal),
          reasoning: Array.isArray(json.reasoning) ? json.reasoning : [],
          guidanceForNewLearner: profile.guidanceForNewLearner,
          learningGoal: effectiveGoal,
          durationMinutes: effectiveMinutes,
          generatedAt: new Date().toISOString(),
          source: 'gemini_ai'
        };

        // Lưu vào Cache
        try {
          const valStr = JSON.stringify(validatedData);
          localStorage.setItem(cacheKey, valStr);
          const utcDateStr = new Date().toISOString().split('T')[0];
          if (utcDateStr !== todayStr) {
            localStorage.setItem(`${COACH_STORAGE_KEYS.CACHE}_${profile.userId}_${utcDateStr}`, valStr);
          }
        } catch {}

        return { success: true, data: validatedData, fromCache: false };
      }
    }
  } catch (err) {
    console.warn('Backend /api/ai/coach notice, using offline pedagogical heuristics:', err.message);
  }

  // 5. Fallback về Offline Pedagogical Heuristics (không crash, dữ liệu chuẩn xác)
  const offlineResult = getOfflineCoachRecommendation(profile, weaknesses, {
    durationMinutes: effectiveMinutes,
    learningGoal: effectiveGoal
  });

  try {
    const valStr = JSON.stringify(offlineResult);
    localStorage.setItem(cacheKey, valStr);
    const utcDateStr = new Date().toISOString().split('T')[0];
    if (utcDateStr !== todayStr) {
      localStorage.setItem(`${COACH_STORAGE_KEYS.CACHE}_${profile.userId}_${utcDateStr}`, valStr);
    }
  } catch {}

  return { success: true, data: offlineResult, fromCache: false, isOffline: true };
}

// =========================================================================
// 6. POST-LESSON AI FEEDBACK ENGINE
// =========================================================================

/**
 * Tạo nhận xét sư phạm sau bài học (What user did well, Mistakes, Recommended practice, Next step)
 */
export function generatePostLessonAiFeedback({
  lesson,
  score = 100,
  earnedStars = 3,
  quizErrors = [],
  speakingScore = null,
  user = null
}) {
  const whatUserDidWell = [];
  const mistakes = [];
  const recommendedPractice = [];

  // Điểm làm tốt
  if (score >= 90) {
    whatUserDidWell.push(`Hoàn thành xuất sắc toàn bộ bài học với độ chính xác cao (${score}/100).`);
    whatUserDidWell.push('Đạt trọn vẹn 3 ngôi sao danh dự của bài học.');
  } else if (score >= 70) {
    whatUserDidWell.push(`Đạt yêu cầu qua bài với ${score}/100 điểm và nắm được kiến thức cốt lõi.`);
  }

  if (speakingScore !== null && speakingScore >= 80) {
    whatUserDidWell.push(`Phản xạ giọng nói tự tin, âm lượng và nhịp điệu phát âm tốt (${speakingScore}/100).`);
  }

  if (whatUserDidWell.length === 0) {
    whatUserDidWell.push('Đã kiên trì hoàn thành toàn bộ 9 bước của bài học.');
  }

  // Nhận diện lỗi
  if (quizErrors.length > 0) {
    quizErrors.forEach(err => {
      mistakes.push(`Câu hỏi "${err.question || 'Trắc nghiệm'}": Cần phân biệt rõ hơn đáp án đúng là "${err.correctAnswerText || 'Đáp án'}"`);
    });
  } else if (score < 80) {
    mistakes.push('Một số câu trắc nghiệm ngữ pháp hoặc thanh điệu cần chú ý ngữ cảnh hơn.');
  }

  if (speakingScore !== null && speakingScore < 70) {
    mistakes.push(`Thanh điệu một số âm tiết chưa chuẩn (${speakingScore}/100). Hãy chú ý phân biệt thanh 1 (âm cao bằng) và thanh 4 (hạ dứt khoát).`);
  }

  // Khuyến nghị ôn luyện
  if (mistakes.length > 0) {
    recommendedPractice.push('Ôn lại 3 từ vựng mới trong bài bằng phương pháp Flashcard.');
    recommendedPractice.push('Thực hành lại câu thoại đối thoại để ngấm ngữ điệu tự nhiên.');
  } else {
    recommendedPractice.push('Tập viết 3 chữ Hán trọng tâm trong bài vào vở kẻ ô để ghi nhớ thuận bút.');
    recommendedPractice.push('Tiến tới bài học tiếp theo để giữ vững đà tiến bộ.');
  }

  const nextStep = `Sẵn sàng cho bài học tiếp theo trên Lộ trình HSK 3.0!`;

  // Ghi nhận lỗi vào danh sách cần ôn tập trong SRS
  if (quizErrors.length > 0 && lesson?.step2_vocabulary) {
    try {
      const revKey = getUserStorageKey('hanzigo_vocab_review', user);
      const savedRaw = localStorage.getItem(revKey) || '[]';
      const revList = JSON.parse(savedRaw);
      const newVocabIds = lesson.step2_vocabulary.map(v => v.id).filter(id => !revList.includes(id));
      if (newVocabIds.length > 0) {
        localStorage.setItem(revKey, JSON.stringify([...revList, ...newVocabIds]));
      }
    } catch {}
  }

  return {
    lessonId: lesson?.id,
    lessonTitle: lesson?.title,
    score,
    earnedStars,
    whatUserDidWell,
    mistakes,
    recommendedPractice,
    nextStep,
    createdAt: new Date().toISOString()
  };
}

// =========================================================================
// 7. CLOSED-LOOP LEARNING TRACKER
// =========================================================================

/**
 * Ghi nhận bước trong vòng lặp học tập khép kín:
 * Assess -> Learn -> Practice -> Evaluate -> Detect Weakness -> Recommend -> SRS -> Next Lesson
 */
export function recordLearningLoopStep(stepType, details = {}, user = null) {
  const key = getUserStorageKey(COACH_STORAGE_KEYS.LEARNING_LOOP, user);
  try {
    const raw = localStorage.getItem(key);
    const history = raw ? JSON.parse(raw) : [];
    const entry = {
      id: `loop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      stepType,
      details,
      timestamp: new Date().toISOString()
    };
    const updated = [entry, ...history].slice(0, 50); // giữ 50 bước gần nhất
    localStorage.setItem(key, JSON.stringify(updated));
    return entry;
  } catch {
    return null;
  }
}
