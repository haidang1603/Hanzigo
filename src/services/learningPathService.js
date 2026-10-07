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

function generateFallbackLesson(lessonId, chapter, lessonNumber) {
  const levelObj = getLevelById(chapter.levelId) || { name: 'HSK 1', levelNumber: 1 };
  return {
    id: lessonId,
    chapterId: chapter.id,
    levelId: chapter.levelId,
    lessonNumber: lessonNumber,
    title: `${chapter.title} (Bài ${lessonNumber})`,
    chineseTitle: chapter.chineseTitle || '汉语学习',
    subtitle: chapter.desc || 'Bài học phản xạ giao tiếp và ngữ pháp ứng dụng.',
    durationMinutes: 18,
    xpReward: 50,
    tags: [levelObj.name, 'Giao tiếp', 'Ngữ pháp'],
    step1_learn: {
      topic: `${chapter.title} - Trọng tâm bài ${lessonNumber}`,
      summary: chapter.desc || 'Nắm vững kiến thức trọng tâm và mẫu câu thực tế.',
      audioDemoText: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.'
    },
    step2_vocabulary: [
      { id: `${lessonId}-v1`, hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào', hanviet: 'Nhĩ hảo', example: '你好，很高兴认识你！' },
      { id: `${lessonId}-v2`, hanzi: '谢谢', pinyin: 'xièxie', meaning: 'Cảm ơn', hanviet: 'Tạ tạ', example: '太谢谢你了！' },
      { id: `${lessonId}-v3`, hanzi: '再见', pinyin: 'zàijiàn', meaning: 'Tạm biệt', hanviet: 'Tái kiến', example: '明天见，再见！' }
    ],
    step3_hanzi: [
      { char: '你', pinyin: 'nǐ', meaning: 'Bạn / Anh / Chị', strokes: 7, radical: '亻 (Nhân đứng)', strokeOrder: ['撇', '竖', '撇', '横撇', '竖', '横折钩', '点'] },
      { char: '好', pinyin: 'hǎo', meaning: 'Tốt / Đẹp / Khỏe', strokes: 6, radical: '女 (Nữ)', strokeOrder: ['撇点', '撇', '横', '横撇', '弯钩', '横'] }
    ],
    step4_grammar: {
      title: 'Mẫu câu giao tiếp cốt lõi',
      formula: 'Chủ ngữ + Vị ngữ + Tân ngữ',
      explanation: 'Thứ tự từ trong câu tiếng Trung cơ bản tương tự tiếng Việt.',
      examples: [
        { cn: '我很开心。', pinyin: 'Wǒ hěn kāixīn.', vi: 'Tôi rất vui.' },
        { cn: '他是我的老师。', pinyin: 'Tā shì wǒ de lǎoshī.', vi: 'Thầy ấy là giáo viên của tôi.' }
      ]
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', cn: '你好！你是哪国人？', pinyin: 'Nǐ hǎo! Nǐ shì nǎ guó rén?', vi: 'Xin chào! Bạn là người nước nào?' },
        { speaker: 'B', cn: '我是越南人。', pinyin: 'Wǒ shì Yuènán rén.', vi: 'Tôi là người Việt Nam.' }
      ]
    },
    step6_speaking: {
      targetSentence: '很高兴认识你',
      targetPinyin: 'Hěn gāoxìng rènshi nǐ',
      meaning: 'Rất vui được làm quen với bạn',
      guide: 'Nhấn phím Mic và đọc to rõ ràng từng âm tiết.'
    },
    step7_writing: {
      prompt: 'Sắp xếp các từ thành câu chào hỏi: "Rất vui được làm quen với bạn"',
      words: ['很高兴', '认识', '你'],
      correctOrder: ['很高兴', '认识', '你']
    },
    step8_quiz: [
      {
        id: `${lessonId}-q1`,
        question: 'Từ "你好" mang ý nghĩa gì?',
        options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Không có gì'],
        correctIndex: 0,
        explanation: '你好 (Nǐ hǎo) là lời chào hỏi cơ bản và thông dụng nhất trong tiếng Trung.'
      },
      {
        id: `${lessonId}-q2`,
        question: 'Chọn câu đáp lại lịch sự khi ai đó nói "谢谢 (Cảm ơn)":',
        options: ['不用谢 (Bú yòng xiè)', '再见 (Zàijiàn)', '没听懂 (Méi tīng dǒng)', '对不起 (Duìbuqǐ)'],
        correctIndex: 0,
        explanation: '不用谢 hoặc 不客气 là câu đáp lại chuẩn khi người khác cảm ơn bạn.'
      }
    ],
    step9_challenge: {
      title: 'Ứng dụng thực tế',
      taskDesc: `Thực hành sử dụng các mẫu câu của "${chapter.title}" trong đời sống hoặc gửi tin nhắn cho bạn bè người Trung Quốc.`,
      badge: 'Giao tiếp tự tin'
    }
  };
}

export function getLessonsByChapter(chapterId) {
  const direct = LEARNING_LESSONS.filter(l => l.chapterId === chapterId);
  if (direct.length > 0) return direct;

  const chapter = getChapterById(chapterId);
  if (!chapter || !chapter.lessonIds) return [];

  return chapter.lessonIds.map((lid, idx) => generateFallbackLesson(lid, chapter, idx + 1));
}

export function getLessonById(lessonId) {
  const direct = LEARNING_LESSONS.find(l => l.id === lessonId);
  if (direct) return direct;

  const chapter = LEARNING_CHAPTERS.find(ch => ch.lessonIds && ch.lessonIds.includes(lessonId));
  if (chapter) {
    const idx = chapter.lessonIds.indexOf(lessonId);
    return generateFallbackLesson(lessonId, chapter, idx + 1);
  }
  return null;
}

export function getNextLessonId(lessonId) {
  const direct = getLessonById(lessonId);
  if (!direct) return null;

  const chapterLessons = getLessonsByChapter(direct.chapterId);
  const idx = chapterLessons.findIndex(l => l.id === lessonId);
  if (idx >= 0 && idx < chapterLessons.length - 1) {
    return chapterLessons[idx + 1].id;
  }

  // If last lesson in chapter, transition to first lesson of next chapter
  const currentChapter = getChapterById(direct.chapterId);
  if (currentChapter) {
    const nextChapter = LEARNING_CHAPTERS.find(c => c.chapterNumber === currentChapter.chapterNumber + 1);
    if (nextChapter && nextChapter.lessonIds && nextChapter.lessonIds.length > 0) {
      return nextChapter.lessonIds[0];
    }
  }

  return null;
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
    // Purge legacy mock data cache from previous demo versions
    if (typeof localStorage !== 'undefined') {
      [key, 'hanzigo_skill_mastery'].forEach(k => {
        const s = localStorage.getItem(k);
        if (s) {
          try {
            const p = JSON.parse(s);
            if (p && (
              p.vocabulary === 82 || p.grammar === 72 || p.listening === 70 || p.speaking === 55 || p.reading === 80 || p.writing === 62 ||
              (p.listening === 50 && p.speaking === 50 && p.reading === 50 && p.writing === 40)
            )) {
              localStorage.removeItem(k);
            }
          } catch {}
        }
      });
    }

    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}

  // Calculate purely from REAL user learning activity!
  // If the user hasn't studied yet, all skills start honestly at 0%.
  let vocabCount = 0;
  let pronounceCount = 0;
  let writingCount = 0;
  let completedLessonsCount = 0;

  try {
    const vKey = getUserStorageKey('hanzigo_vocab_remembered', user);
    const vSaved = localStorage.getItem(vKey) || (user ? null : localStorage.getItem('hanzigo_vocab_remembered'));
    if (vSaved) {
      const arr = JSON.parse(vSaved);
      if (Array.isArray(arr)) vocabCount = arr.length;
    }

    const pKey = getUserStorageKey('hanzigo_pronounce_history', user);
    const pSaved = localStorage.getItem(pKey) || (user ? null : localStorage.getItem('hanzigo_pronounce_history'));
    if (pSaved) {
      const arr = JSON.parse(pSaved);
      if (Array.isArray(arr)) pronounceCount = arr.length;
    }

    const wKey = getUserStorageKey('hanzigo_custom_writing_chars', user);
    const wSaved = localStorage.getItem(wKey) || (user ? null : localStorage.getItem('hanzigo_custom_writing_chars'));
    if (wSaved) {
      const arr = JSON.parse(wSaved);
      if (Array.isArray(arr)) writingCount = arr.length;
    }

    const jKey = getUserStorageKey(STORAGE_KEYS.JOURNEY_PROGRESS, user);
    const jSaved = localStorage.getItem(jKey);
    if (jSaved) {
      const parsed = JSON.parse(jSaved);
      completedLessonsCount = Object.keys(parsed.completedLessons || {}).length;
    }
  } catch {}

  // Compute real percentages based strictly on authentic practice milestones:
  // - Vocabulary: words marked remembered in SRS review (target 100 words)
  // - Speaking: speech evaluation sessions completed with mic (target 15 phrases)
  // - Writing: Chinese characters written in studio (target 10 characters)
  // - Listening/Reading/Grammar: lessons passed in the journey (target 20 lessons)
  const vocabScore = Math.min(100, Math.round((vocabCount / 100) * 100));
  const speakingScore = Math.min(100, Math.round((pronounceCount / 15) * 100));
  const writingScore = Math.min(100, Math.round((writingCount / 10) * 100));
  const lessonFactor = Math.min(100, Math.round((completedLessonsCount / 20) * 100));

  return {
    listening: lessonFactor > 0 ? lessonFactor : 0,
    speaking: speakingScore > 0 ? speakingScore : 0,
    reading: lessonFactor > 0 ? lessonFactor : 0,
    writing: writingScore > 0 ? writingScore : 0,
    vocabulary: vocabScore > 0 ? vocabScore : 0,
    hanzi: writingScore > 0 ? writingScore : 0,
    grammar: lessonFactor > 0 ? lessonFactor : 0
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
