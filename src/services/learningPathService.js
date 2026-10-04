// =========================================================================
// HANZIGO LEARNING PATH SERVICE
// Manages levels, chapters, lessons, unlocks, progress, gamification & DB sync
// =========================================================================

import { 
  LEARNING_LEVELS, 
  LEARNING_CHAPTERS, 
  LEARNING_LESSONS, 
  BOSS_CHALLENGES,
  PLACEMENT_QUESTIONS,
  DEFAULT_DAILY_MISSIONS
} from '../data/learningPathData.js';

import { 
  getUserStorageKey, 
  getLocalDateString, 
  awardXp 
} from '../utils/gamification.js';

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

const STORAGE_KEYS = {
  JOURNEY_PROGRESS: 'hanzigo_journey_progress',
  DAILY_MISSIONS: 'hanzigo_daily_missions',
  SKILL_MASTERY: 'hanzigo_skill_mastery',
  PLACEMENT_RESULT: 'hanzigo_placement_result'
};

// =========================================================================
// 1. DATA ACCESSORS
// =========================================================================

export function getAllLevels() {
  return LEARNING_LEVELS;
}

export function getLevelById(levelId) {
  return LEARNING_LEVELS.find(lvl => lvl.id === levelId) || LEARNING_LEVELS[0];
}

export function getChaptersByLevel(levelId) {
  return LEARNING_CHAPTERS.filter(ch => ch.levelId === levelId);
}

export function getAllChapters() {
  return LEARNING_CHAPTERS;
}

export function getChapterById(chapterId) {
  return LEARNING_CHAPTERS.find(ch => ch.id === chapterId);
}

export function getLessonsByChapter(chapterId) {
  return LEARNING_LESSONS.filter(l => l.chapterId === chapterId);
}

export function getLessonById(lessonId) {
  return LEARNING_LESSONS.find(l => l.id === lessonId);
}

export function getBossChallengeByChapter(chapterId) {
  return BOSS_CHALLENGES.find(b => b.chapterId === chapterId);
}

export function getBossChallengeById(bossId) {
  return BOSS_CHALLENGES.find(b => b.id === bossId || b.aliasId === bossId);
}

// =========================================================================
// 2. PROGRESS & UNLOCK ENGINE
// =========================================================================

export function getUserJourneyProgress(user = null) {
  const key = getUserStorageKey(STORAGE_KEYS.JOURNEY_PROGRESS, user);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        completedLessons: parsed.completedLessons || {}, // { [lessonId]: { score, stars, completedAt } }
        completedBosses: parsed.completedBosses || {},   // { [bossId]: { score, completedAt } }
        unlockedLevelNumber: parsed.unlockedLevelNumber || 1,
        activeLessonId: parsed.activeLessonId || 'l-101'
      };
    }
  } catch (err) {
    console.warn('Error reading journey progress:', err);
  }

  // Default initial state
  return {
    completedLessons: {},
    completedBosses: {},
    unlockedLevelNumber: 1,
    activeLessonId: 'l-101'
  };
}

export function saveUserJourneyProgress(progress, user = null) {
  const key = getUserStorageKey(STORAGE_KEYS.JOURNEY_PROGRESS, user);
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving journey progress:', err);
  }

  // Asynchronously sync to Supabase if logged in
  if (user?.uid && isSupabaseConfigured && supabase) {
    supabase
      .from('user_journey_progress')
      .upsert({
        user_id: user.uid,
        completed_lessons: progress.completedLessons,
        completed_bosses: progress.completedBosses,
        unlocked_level: progress.unlockedLevelNumber,
        active_lesson_id: progress.activeLessonId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .then(({ error }) => {
        if (error) console.warn('Supabase journey sync fallback:', error.message);
      })
      .catch(() => {});
  }
}

/**
 * Determine the status of a specific lesson node
 * Returns: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
 */
export function getLessonNodeStatus(lessonId, progress) {
  const completedInfo = progress.completedLessons[lessonId];
  if (completedInfo) {
    return completedInfo.stars >= 3 ? 'mastered' : 'completed';
  }

  if (progress.activeLessonId === lessonId) {
    return 'in_progress';
  }

  // Find index in curriculum
  const targetLesson = getLessonById(lessonId);
  if (!targetLesson) return 'locked';

  const levelObj = getLevelById(targetLesson.levelId);
  if (levelObj.levelNumber > progress.unlockedLevelNumber) {
    return 'locked';
  }

  // In Chapter 1: First lesson is always available
  if (lessonId === 'l-101') return 'available';

  // Check if previous lesson in same chapter is completed
  const chapterLessons = getLessonsByChapter(targetLesson.chapterId);
  const currentIndex = chapterLessons.findIndex(l => l.id === lessonId);

  if (currentIndex === 0) {
    // First lesson of chapter: check if previous chapter boss is completed
    const currentChapter = getChapterById(targetLesson.chapterId);
    if (currentChapter.chapterNumber === 1) return 'available';

    const prevChapter = LEARNING_CHAPTERS.find(c => c.chapterNumber === currentChapter.chapterNumber - 1);
    if (!prevChapter) return 'available';

    const prevBossBeaten = progress.completedBosses[prevChapter.bossId];
    return prevBossBeaten ? 'available' : 'locked';
  }

  const prevLesson = chapterLessons[currentIndex - 1];
  return progress.completedLessons[prevLesson.id] ? 'available' : 'locked';
}

/**
 * Check if the chapter boss challenge is unlocked
 */
export function isBossUnlocked(chapterId, progress) {
  const chapterLessons = getLessonsByChapter(chapterId);
  if (chapterLessons.length === 0) return true;

  // All lessons in this chapter must be completed
  return chapterLessons.every(lesson => Boolean(progress.completedLessons[lesson.id]));
}

/**
 * Mark a lesson completed and award XP & trigger unlocks
 */
export function completeLesson(lessonId, score = 100, user = null) {
  const progress = getUserJourneyProgress(user);
  const targetLesson = getLessonById(lessonId);
  const stars = score >= 90 ? 3 : (score >= 70 ? 2 : 1);

  progress.completedLessons[lessonId] = {
    score,
    stars,
    completedAt: new Date().toISOString()
  };

  // Determine next lesson
  if (targetLesson) {
    const chapterLessons = getLessonsByChapter(targetLesson.chapterId);
    const currentIndex = chapterLessons.findIndex(l => l.id === lessonId);

    if (currentIndex >= 0 && currentIndex < chapterLessons.length - 1) {
      progress.activeLessonId = chapterLessons[currentIndex + 1].id;
    }
  }

  saveUserJourneyProgress(progress, user);

  // Award lesson XP (+50 XP)
  const xpEarned = targetLesson?.xpReward || 50;
  awardXp(xpEarned, user, `lesson_${lessonId}_${Date.now()}`);

  // Update Daily Mission progress for 'lesson'
  updateDailyMissionProgress('lesson', 1, user);
  if (score >= 90) {
    updateDailyMissionProgress('quiz', 1, user);
  }

  // Update skill mastery
  updateSkillMasteryAfterLesson(lessonId, score, user);

  return { progress, xpEarned, stars };
}

/**
 * Mark a boss challenge completed
 */
export function completeBossChallenge(bossId, score = 100, user = null) {
  const progress = getUserJourneyProgress(user);
  const boss = getBossChallengeById(bossId);

  progress.completedBosses[bossId] = {
    score,
    completedAt: new Date().toISOString()
  };

  // If this was the last chapter of a level, unlock next level
  if (boss) {
    const chapter = getChapterById(boss.chapterId);
    if (chapter) {
      const currentLevel = getLevelById(chapter.levelId);
      const isLastChapterOfLevel = chapter.chapterNumber % 4 === 0;

      if (isLastChapterOfLevel && progress.unlockedLevelNumber <= currentLevel.levelNumber) {
        progress.unlockedLevelNumber = currentLevel.levelNumber + 1;
      }
    }
  }

  saveUserJourneyProgress(progress, user);

  // Award Boss XP (+200 XP)
  const xpEarned = boss?.xpReward || 200;
  awardXp(xpEarned, user, `boss_${bossId}_${Date.now()}`);

  return { progress, xpEarned };
}

// =========================================================================
// 3. SKILL MASTERY & PERSONALIZED RECOMMENDATIONS
// =========================================================================

export function getSkillMastery(user = null) {
  const key = getUserStorageKey(STORAGE_KEYS.SKILL_MASTERY, user);
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}

  // Base radar profile
  return {
    listening: 68,
    speaking: 55,
    reading: 78,
    writing: 62,
    vocabulary: 80,
    hanzi: 65,
    grammar: 70
  };
}

export function updateSkillMasteryAfterLesson(lessonId, score, user = null) {
  const mastery = getSkillMastery(user);
  const boost = Math.round((score / 100) * 3);

  mastery.listening = Math.min(100, mastery.listening + boost);
  mastery.reading = Math.min(100, mastery.reading + boost);
  mastery.vocabulary = Math.min(100, mastery.vocabulary + boost);
  mastery.grammar = Math.min(100, mastery.grammar + boost);
  mastery.hanzi = Math.min(100, mastery.hanzi + Math.max(1, boost - 1));

  const key = getUserStorageKey(STORAGE_KEYS.SKILL_MASTERY, user);
  try {
    localStorage.setItem(key, JSON.stringify(mastery));
  } catch {}

  return mastery;
}

export function getPersonalizedRecommendation(user = null) {
  const mastery = getSkillMastery(user);
  const skills = [
    { name: 'Phát âm & Nói phản xạ (Speaking)', key: 'speaking', score: mastery.speaking, route: 'pronunciation', desc: 'Luyện âm điệu và tăng phản xạ nói trôi chảy.' },
    { name: 'Quy tắc nét viết (Hanzi & Writing)', key: 'writing', score: mastery.writing, route: 'writing', desc: 'Củng cố quy tắc thuận bút và nhớ lâu mặt chữ.' },
    { name: 'Luyện nghe hiểu hội thoại (Listening)', key: 'listening', score: mastery.listening, route: 'conversation', desc: 'Bắt nhịp tốc độ người bản ngữ và ngữ điệu tự nhiên.' },
    { name: 'Ngữ pháp & Cấu trúc câu (Grammar)', key: 'grammar', score: mastery.grammar, route: 'roadmap', desc: 'Thực hành đặt câu với liên từ và lượng từ.' }
  ];

  skills.sort((a, b) => a.score - b.score);
  const weakest = skills[0];

  return {
    weakestSkill: weakest.name,
    score: weakest.score,
    recommendedTab: weakest.route,
    advice: `Kỹ năng ${weakest.name} hiện đạt ${weakest.score}%. Hãy dành 10 phút luyện tập để cân bằng bảng kỹ năng!`,
    desc: weakest.desc
  };
}

// =========================================================================
// 4. PLACEMENT TEST ENGINE
// =========================================================================

export function getPlacementQuestions() {
  return PLACEMENT_QUESTIONS;
}

export function evaluatePlacementTest(answers, selfAssessedLevel = 'beginner', user = null) {
  let correctCount = 0;

  PLACEMENT_QUESTIONS.forEach((q, idx) => {
    if (answers[q.id] === q.correctIndex || answers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / PLACEMENT_QUESTIONS.length) * 100);

  let recommendedLevel = 1;
  let levelTitle = 'Level 1: 🌱 Khởi động (中文启程)';
  let rationale = 'Bạn mới bắt đầu học hoặc muốn củng cố phát âm chuẩn từ thanh mẫu, vận mẫu và 4 thanh điệu.';

  if (percentage >= 80) {
    recommendedLevel = 4;
    levelTitle = 'Level 4: 🎤 Giao tiếp (真实交流)';
    rationale = 'Kiến thức ngữ âm và cấu trúc câu của bạn rất vững! Bạn nên bắt đầu ngay từ phần phản xạ giao tiếp.';
  } else if (percentage >= 60) {
    recommendedLevel = 3;
    levelTitle = 'Level 3: 🌳 Nền tảng (中文基础)';
    rationale = 'Bạn đã nắm được các câu giao tiếp cơ bản, sẵn sàng học ngữ pháp chuyên sâu và tự tạo câu độc lập.';
  } else if (percentage >= 35) {
    recommendedLevel = 2;
    levelTitle = 'Level 2: 🌿 Sinh tồn (日常中文)';
    rationale = 'Bạn đã biết Pinyin và một số từ thông dụng. Hãy bắt đầu từ các tình huống sinh hoạt hàng ngày.';
  }

  // Fast-forward unlock up to recommended level
  const progress = getUserJourneyProgress(user);
  if (recommendedLevel > progress.unlockedLevelNumber) {
    progress.unlockedLevelNumber = recommendedLevel;
    saveUserJourneyProgress(progress, user);
  }

  const result = {
    correctCount,
    total: PLACEMENT_QUESTIONS.length,
    percentage,
    recommendedLevel,
    levelTitle,
    rationale,
    evaluatedAt: new Date().toISOString()
  };

  const key = getUserStorageKey(STORAGE_KEYS.PLACEMENT_RESULT, user);
  try {
    localStorage.setItem(key, JSON.stringify(result));
  } catch {}

  // Bonus XP for taking placement test (+100 XP)
  awardXp(100, user, `placement_test_${Date.now()}`);

  return result;
}

// =========================================================================
// 5. DAILY MISSIONS ENGINE
// =========================================================================

export function getDailyMissions(user = null) {
  const key = getUserStorageKey(STORAGE_KEYS.DAILY_MISSIONS, user);
  const today = getLocalDateString();

  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today && Array.isArray(parsed.missions)) {
        return parsed.missions;
      }
    }
  } catch {}

  // Generate fresh daily missions for today
  const freshMissions = DEFAULT_DAILY_MISSIONS.map(m => ({ ...m, current: 0, isCompleted: false, isClaimed: false }));
  try {
    localStorage.setItem(key, JSON.stringify({ date: today, missions: freshMissions }));
  } catch {}

  return freshMissions;
}

export function updateDailyMissionProgress(category, increment = 1, user = null) {
  const missions = getDailyMissions(user);
  let hasChanged = false;

  const updated = missions.map(m => {
    if (m.category === category && !m.isCompleted) {
      const newCurrent = Math.min(m.target, m.current + increment);
      const isCompleted = newCurrent >= m.target;
      hasChanged = true;
      return { ...m, current: newCurrent, isCompleted };
    }
    return m;
  });

  if (hasChanged) {
    const key = getUserStorageKey(STORAGE_KEYS.DAILY_MISSIONS, user);
    try {
      localStorage.setItem(key, JSON.stringify({ date: getLocalDateString(), missions: updated }));
    } catch {}
  }

  return updated;
}

export function claimDailyMission(missionId, user = null) {
  const missions = getDailyMissions(user);
  let xpAwarded = 0;

  const updated = missions.map(m => {
    if (m.id === missionId && m.isCompleted && !m.isClaimed) {
      xpAwarded = m.xp;
      return { ...m, isClaimed: true };
    }
    return m;
  });

  if (xpAwarded > 0) {
    const key = getUserStorageKey(STORAGE_KEYS.DAILY_MISSIONS, user);
    try {
      localStorage.setItem(key, JSON.stringify({ date: getLocalDateString(), missions: updated }));
    } catch {}

    awardXp(xpAwarded, user, `mission_${missionId}_${Date.now()}`);
  }

  return { missions: updated, xpAwarded };
}
