/**
 * =========================================================================
 * HANZI GO - LEARNER PROFILE & PERSONALIZATION CONTEXT SERVICE
 * =========================================================================
 * Trung tâm hợp nhất hồ sơ năng lực và ngữ cảnh học tập cá nhân hóa:
 * - Thu thập đúng và đủ dữ liệu học tập thực tế (Zero-fabrication).
 * - Quản lý mục tiêu học, cấp độ mục tiêu, ngày thi dự kiến, ngôn ngữ giải thích.
 * - Hỗ trợ người dùng mới (Cold-start) mà không sinh điểm số ảo.
 * - Cho phép người dùng bật/tắt cá nhân hóa, xuất dữ liệu và xóa dữ liệu.
 * - Cổng làm sạch bảo mật (Sanitization Gate): Tước bỏ mật khẩu và token.
 * =========================================================================
 */

import { getUserStorageKey, getStreakStatus } from '../utils/gamification.js';
import { getUserJourneyProgress, getRecommendedNextLesson, getRecommendedReviewLessons } from './learningPathService.js';
import { isCardDueForReview, getDueReviewCards } from '../utils/srsEngine.js';

export const LEARNER_STORAGE_KEYS = {
  PREFERENCES: 'hanzigo_learner_preferences',
  PERSONALIZATION_ENABLED: 'hanzigo_personalization_enabled',
  TARGET_EXAM_DATE: 'hanzigo_target_exam_date',
  EXPLANATION_LANG: 'hanzigo_explanation_language',
  MISTAKE_LOG: 'hanzigo_personalization_mistakes_log',
  CACHE_PREFIX: 'hanzigo_ai_personalize_cache'
};

export const DEFAULT_PREFERENCES = {
  learningGoal: 'general_foundation', // 'general_foundation' | 'hsk_exam' | 'daily_communication' | 'travel_speaking' | 'hanzi_culture' | 'work_business'
  targetHskLevel: 'HSK 1',
  targetExamDate: null,
  dailyGoalMinutes: 15,
  explanationLanguage: 'vi', // 'vi' | 'zh' | 'en'
  personalizationEnabled: true,
  showPinyinByDefault: true,
  showVietnameseMeaningByDefault: true
};

/**
 * Lấy tùy chọn cá nhân hóa của người học
 */
export function getLearnerPreferences(user = null) {
  try {
    const key = getUserStorageKey(LEARNER_STORAGE_KEYS.PREFERENCES, user);
    const saved = localStorage.getItem(key);
    if (saved) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    }
    // Fallback: migrate legacy goal if present
    const legacyGoalKey = getUserStorageKey('hanzigo_learning_goal', user);
    const legacyGoal = localStorage.getItem(legacyGoalKey);
    const legacyMinsKey = getUserStorageKey('hanzigo_daily_goal', user);
    const legacyMins = localStorage.getItem(legacyMinsKey);

    return {
      ...DEFAULT_PREFERENCES,
      learningGoal: legacyGoal || DEFAULT_PREFERENCES.learningGoal,
      dailyGoalMinutes: legacyMins ? parseInt(legacyMins, 10) : DEFAULT_PREFERENCES.dailyGoalMinutes
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * Lưu tùy chọn cá nhân hóa
 */
export function saveLearnerPreferences(preferences = {}, user = null) {
  try {
    const current = getLearnerPreferences(user);
    const updated = { ...current, ...preferences };
    const key = getUserStorageKey(LEARNER_STORAGE_KEYS.PREFERENCES, user);
    localStorage.setItem(key, JSON.stringify(updated));

    // Đồng bộ ngược lại các legacy keys để tương thích với các component cũ
    if (preferences.learningGoal) {
      const gKey = getUserStorageKey('hanzigo_learning_goal', user);
      localStorage.setItem(gKey, preferences.learningGoal);
    }
    if (preferences.dailyGoalMinutes) {
      const mKey = getUserStorageKey('hanzigo_daily_goal', user);
      localStorage.setItem(mKey, String(preferences.dailyGoalMinutes));
    }

    // Phát sự kiện thông báo thay đổi
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanzigo_preferences_updated', { detail: updated }));
    }

    return updated;
  } catch (err) {
    console.warn('Could not save learner preferences:', err.message);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Kiểm tra xem người học có bật tính năng cá nhân hóa AI không
 */
export function isPersonalizationEnabled(user = null) {
  const prefs = getLearnerPreferences(user);
  return prefs.personalizationEnabled !== false;
}

/**
 * Xây dựng Ngữ cảnh Học tập Đầy đủ (Comprehensive Learning Context)
 */
export function buildComprehensiveLearnerContext(user = null) {
  const prefs = getLearnerPreferences(user);

  // 1. Dữ liệu từ vựng & SRS
  let rememberedWords = [];
  let reviewWords = [];
  try {
    const remKey = getUserStorageKey('hanzigo_vocab_remembered', user);
    const remRaw = localStorage.getItem(remKey);
    if (remRaw) rememberedWords = JSON.parse(remRaw) || [];

    const revKey = getUserStorageKey('hanzigo_vocab_review', user);
    const revRaw = localStorage.getItem(revKey);
    if (revRaw) reviewWords = JSON.parse(revRaw) || [];
  } catch {}

  // 2. Tiến độ lộ trình bài học
  const journey = getUserJourneyProgress(user);
  const completedLessonsMap = journey.completedLessons || {};
  const completedLessonIds = Object.keys(completedLessonsMap);
  const completedCount = completedLessonIds.length;

  // 3. Lịch sử phát âm từ mic
  let pronounceHistory = [];
  try {
    const pKey = getUserStorageKey('hanzigo_pronounce_history', user);
    const pRaw = localStorage.getItem(pKey);
    if (pRaw) pronounceHistory = JSON.parse(pRaw) || [];
  } catch {}

  // 4. Lịch sử làm bài thi thử HSK và danh sách câu sai
  let hskMistakes = [];
  try {
    const mRaw = localStorage.getItem('hanzigo_hsk_mistakes');
    if (mRaw) hskMistakes = JSON.parse(mRaw) || [];
  } catch {}

  let hskAttempts = [];
  try {
    const aRaw = localStorage.getItem('hanzigo_hsk_attempts');
    if (aRaw) hskAttempts = JSON.parse(aRaw) || [];
  } catch {}

  // 5. Chuỗi ngày học & thời gian học
  const streakInfo = getStreakStatus(user);
  let studyMinutesMap = {};
  try {
    const mKey = getUserStorageKey('hanzigo_daily_study_minutes', user);
    const mRaw = localStorage.getItem(mKey);
    if (mRaw) studyMinutesMap = JSON.parse(mRaw) || {};
  } catch {}
  const totalStudyMinutes = Object.values(studyMinutesMap).reduce((acc, m) => acc + (Number(m) || 0), 0);

  // 6. Tính số từ SRS đến hạn
  const simulatedCards = reviewWords.map(id => ({
    id,
    nextReviewAt: new Date(Date.now() - 3600000).toISOString(),
    stage: 1,
    easeFactor: 1.8
  }));
  const srsDueCards = getDueReviewCards(simulatedCards);
  const srsDueCount = srsDueCards.length;

  // 7. Xác định bài tiếp theo và bài cần ôn lại
  const nextLesson = getRecommendedNextLesson(user);
  const reviewLessons = getRecommendedReviewLessons(user, 3);

  // 8. Đánh giá tính chất người học mới (Cold Start)
  const hasSparseData = (
    completedCount === 0 &&
    rememberedWords.length === 0 &&
    reviewWords.length === 0 &&
    pronounceHistory.length === 0 &&
    hskAttempts.length === 0
  );

  // 9. Phân tích điểm yếu thực tế (Derived Weaknesses)
  const weaknesses = [];

  if (hasSparseData) {
    weaknesses.push({
      id: 'wk-cold-start',
      skill: 'placement',
      severity: 'medium',
      label: 'Chưa xác định trình độ đầu vào',
      detail: 'Tài khoản chưa có dữ liệu thực hành. Cần làm bài kiểm tra hoặc học bài 1.',
      suggestedAction: 'Làm bài kiểm tra đầu vào ngắn (Placement Test) để hệ thống định vị chính xác',
      targetRoute: 'roadmap',
      actionType: 'placement_test'
    });
  }

  // Yếu phát âm nếu điểm trung bình phát âm từ mic < 70%
  if (pronounceHistory.length >= 2) {
    const avgPron = Math.round(
      pronounceHistory.reduce((acc, p) => acc + (p.overall || p.score || 0), 0) / pronounceHistory.length
    );
    if (avgPron < 70) {
      weaknesses.push({
        id: 'wk-pronunciation',
        skill: 'pronunciation',
        severity: avgPron < 50 ? 'high' : 'medium',
        label: 'Phát âm và thanh điệu chưa chuẩn',
        detail: `Điểm phát âm microphone thực tế đạt ${avgPron}/100. Cần chú ý phân biệt các thanh 1 và 4.`,
        suggestedAction: 'Luyện tập phát âm từng âm tiết và nghe lại giọng mẫu bản xứ',
        targetRoute: 'pronunciation'
      });
    }
  }

  // Yếu từ vựng nếu có nhiều từ đến hạn chưa ôn
  if (srsDueCount >= 10) {
    weaknesses.push({
      id: 'wk-srs-backlog',
      skill: 'vocabulary',
      severity: 'high',
      label: 'Tồn đọng từ vựng cần ôn tập',
      detail: `Có ${srsDueCount} từ vựng đã đến hạn chu kỳ ôn nhưng chưa được luyện tập.`,
      suggestedAction: 'Dành 5 phút hoàn thành phiên ôn tập Flashcard SRS hôm nay',
      targetRoute: 'vocabulary'
    });
  }

  // Yếu bài thi HSK nếu có nhiều lỗi
  if (hskMistakes.length >= 5) {
    weaknesses.push({
      id: 'wk-hsk-mistakes',
      skill: 'listening',
      severity: 'medium',
      label: 'Có nhiều câu sai trong bài thi thử HSK',
      detail: `Sổ tay ghi nhận ${hskMistakes.length} câu làm sai trong các đề thi gần nhất.`,
      suggestedAction: 'Xem Sổ tay lỗi sai và làm lại các câu bị điểm liệt',
      targetRoute: 'hsk'
    });
  }

  // 10. Lỗi sai đã xác nhận từ các bài kiểm tra thực tế (Confirmed Quiz/Exam Mistakes)
  const confirmedMistakesList = getConfirmedMistakes(user);
  if (confirmedMistakesList.length > 0) {
    // Nhóm và đánh giá các chủ đề có lỗi sai xác nhận lặp lại
    confirmedMistakesList.forEach(m => {
      const mistakeCount = m.count || 1;
      if (mistakeCount >= 2 || m.source === 'hsk_exam') {
        weaknesses.push({
          id: `wk-confirmed-${m.topic}`,
          skill: 'grammar',
          severity: mistakeCount >= 3 ? 'high' : 'medium',
          label: `Lỗi sai xác nhận: ${m.topic}`,
          detail: m.details || `Đã ghi nhận ${mistakeCount} lần làm sai trong bài kiểm tra thực tế.`,
          suggestedAction: `Luyện tập chuyên đề "${m.topic}" với bài tập có giải thích chi tiết`,
          targetRoute: 'roadmap',
          topic: m.topic,
          isConfirmed: true
        });
      }
    });
  }

  return {
    userId: user?.uid || user?.id || 'guest_learner',
    hskLevel: prefs.targetHskLevel || user?.level || 'HSK 1',
    targetHskLevel: prefs.targetHskLevel,
    targetExamDate: prefs.targetExamDate,
    learningGoal: prefs.learningGoal,
    dailyGoalMinutes: prefs.dailyGoalMinutes,
    explanationLanguage: prefs.explanationLanguage,
    personalizationEnabled: prefs.personalizationEnabled,
    streak: streakInfo.streak || 0,
    daysInactive: streakInfo.daysInactive || 0,
    studyMinutes: totalStudyMinutes,
    completedLessonsCount: completedCount,
    activeLessonId: journey.activeLessonId || 'l-101',
    nextLesson,
    reviewLessons,
    reviewLessonsCount: reviewLessons.length,
    srsDueCount,
    hasSparseData,
    weaknesses,
    confirmedMistakes: confirmedMistakesList.map(m => ({
      topic: m.topic,
      count: m.count || 1,
      source: m.source || 'quiz',
      details: m.details || ''
    })),
    weakVocabHanzi: reviewWords.slice(0, 10),
    guidanceForNewLearner: hasSparseData ? {
      suggestedAction: 'placement_test',
      message: 'Khởi đầu với bài kiểm tra năng lực đầu vào hoặc bắt đầu từ bài 1.'
    } : null
  };
}

/**
 * Ghi nhận một lỗi sai đã xác nhận từ bài học, bài thi thử hoặc quiz
 * (Chỉ lưu từ sự kiện kiểm tra hợp lệ; tuyệt đối không để AI tự ý ghi nhận bừa bãi)
 */
export function recordConfirmedMistake(user = null, {
  topic,
  question = '',
  userChoice = '',
  correctAnswer = '',
  source = 'quiz',
  details = ''
}) {
  if (!topic || typeof topic !== 'string') return null;

  try {
    const key = getUserStorageKey(LEARNER_STORAGE_KEYS.MISTAKE_LOG, user);
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    const existingIdx = existing.findIndex(m => m.topic === topic.trim() || (question && m.question === question));
    const record = {
      id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      topic: topic.trim(),
      question: (question || '').slice(0, 150),
      userChoice: String(userChoice || '').slice(0, 50),
      correctAnswer: String(correctAnswer || '').slice(0, 50),
      source,
      details: details || `Ghi nhận sai trong ${source}`,
      count: 1,
      lastOccurredAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      existing[existingIdx].count = (existing[existingIdx].count || 1) + 1;
      existing[existingIdx].lastOccurredAt = new Date().toISOString();
      if (details) existing[existingIdx].details = details;
    } else {
      existing.unshift(record);
    }

    const limited = existing.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(limited));

    return record;
  } catch (err) {
    console.warn('Could not record confirmed mistake:', err.message);
    return null;
  }
}

/**
 * Lấy danh sách các lỗi sai đã xác nhận của người học
 */
export function getConfirmedMistakes(user = null) {
  try {
    const key = getUserStorageKey(LEARNER_STORAGE_KEYS.MISTAKE_LOG, user);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Cổng Bảo mật & Lọc Dữ liệu (Sanitization Gate):
 * Đảm bảo 100% không gửi token, password hoặc dữ liệu nhạy cảm cho AI.
 * Đồng thời loại bỏ mọi tham số đặc quyền RBAC (Zero-Trust RBAC).
 */
export function sanitizeContextForAi(context) {
  if (!context || typeof context !== 'object') return {};

  const safe = { ...context };

  // Xóa bỏ tất cả credentials và token nếu vô tình lọt vào
  delete safe.password;
  delete safe.token;
  delete safe.access_token;
  delete safe.refresh_token;
  delete safe.secret;
  delete safe.apiKey;
  delete safe.api_key;

  // Xóa bỏ các thuộc tính phân quyền bảo mật (Zero-Trust)
  delete safe.role;
  delete safe.roles;
  delete safe.permissions;
  delete safe.permission;
  delete safe.isAdmin;
  delete safe.is_admin;
  delete safe.claims;

  // Giới hạn số lượng phần tử để payload gửi lên AI gọn gàng, súc tích
  if (Array.isArray(safe.weakVocabHanzi)) safe.weakVocabHanzi = safe.weakVocabHanzi.slice(0, 15);
  if (Array.isArray(safe.weaknesses)) safe.weaknesses = safe.weaknesses.slice(0, 8);
  if (Array.isArray(safe.confirmedMistakes)) safe.confirmedMistakes = safe.confirmedMistakes.slice(0, 5);
  if (Array.isArray(safe.reviewLessons)) safe.reviewLessons = safe.reviewLessons.slice(0, 5);

  return safe;
}

/**
 * Xóa sạch toàn bộ dữ liệu cá nhân hóa của học viên (Privacy / Data Deletion)
 */
export function clearLearnerPersonalizationData(user = null) {
  try {
    const keysToRemove = [
      getUserStorageKey(LEARNER_STORAGE_KEYS.PREFERENCES, user),
      getUserStorageKey('hanzigo_learning_goal', user),
      getUserStorageKey('hanzigo_daily_goal', user),
      getUserStorageKey(LEARNER_STORAGE_KEYS.MISTAKE_LOG, user),
      getUserStorageKey('hanzigo_conversation_mistakes', user),
      'hanzigo_conversation_mistakes'
    ];

    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Xóa bộ đệm cá nhân hóa theo userId
    const uid = user?.uid || user?.id || 'guest_learner';
    const prefix = `${LEARNER_STORAGE_KEYS.CACHE_PREFIX}_${uid}`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanzigo_personalization_cleared'));
    }

    return { success: true, message: 'Đã xóa toàn bộ dữ liệu cá nhân hóa thành công.' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Xuất dữ liệu học tập cá nhân hóa ra tệp JSON (Data Portability)
 */
export function exportLearnerPersonalizationData(user = null) {
  const context = buildComprehensiveLearnerContext(user);
  const prefs = getLearnerPreferences(user);
  return {
    userId: user?.id || user?.uid || 'guest_learner',
    exportedAt: new Date().toISOString(),
    preferences: prefs,
    learningContext: context
  };
}
