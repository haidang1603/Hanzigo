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
import { getStoredMaterials } from '../utils/materialsStorage.js';
import { syncLessonVocabToSrs } from './vocabularyService.js';

const STORAGE_KEYS = {
  JOURNEY_PROGRESS: 'hanzigo_journey_progress',
  DAILY_MISSIONS: 'hanzigo_daily_missions',
  SKILL_MASTERY: 'hanzigo_skill_mastery',
  PLACEMENT_RESULT: 'hanzigo_placement_result',
  LEARNING_GOAL: 'hanzigo_learning_goal',
  DAILY_GOAL: 'hanzigo_daily_goal'
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

/**
 * Retrieve verified materials linked to a specific lesson
 */
export function getLessonMaterials(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return [];

  const allMaterials = getStoredMaterials();
  const materialIds = lesson.relatedMaterialIds || [];

  return allMaterials.filter(mat => {
    if (materialIds.includes(mat.id)) return true;
    if (mat.relatedLessonId && mat.relatedLessonId.includes(lessonId)) return true;
    return false;
  });
}

/**
 * Retrieve verified materials linked to a specific chapter/module
 */
export function getChapterMaterials(chapterId) {
  const chapter = getChapterById(chapterId);
  if (!chapter) return [];

  const allMaterials = getStoredMaterials();
  const directIds = new Set(chapter.relatedMaterialIds || []);

  const chapterLessons = getLessonsByChapter(chapterId);
  chapterLessons.forEach(l => {
    (l.relatedMaterialIds || []).forEach(mid => directIds.add(mid));
  });

  return allMaterials.filter(mat => {
    if (directIds.has(mat.id)) return true;
    if (mat.relatedLessonId && (
      mat.relatedLessonId.includes(chapterId) ||
      (chapter.moduleCode && mat.relatedLessonId.includes(`Module ${chapter.moduleCode}`))
    )) return true;
    return false;
  });
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
    const completedLessonIds = Object.keys(progress.completedLessons || {});
    const completedBossIds = Object.keys(progress.completedBosses || {});

    supabase
      .from('user_journey_progress')
      .upsert({
        user_id: user.uid,
        completed_lessons: completedLessonIds,
        completed_bosses: completedBossIds,
        unlocked_levels: progress.unlockedLevelNumber,
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
 * Sync user journey progress from cloud without overwriting local accomplishments
 */
export async function syncUserJourneyProgressFromCloud(user = null) {
  if (!user?.uid || !isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('user_journey_progress')
      .select('*')
      .eq('user_id', user.uid)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const localProgress = getUserJourneyProgress(user);

    // Merge non-destructively: keep all completions from both sources
    const mergedCompletedLessons = { ...localProgress.completedLessons };
    const cloudLessons = Array.isArray(data.completed_lessons) ? data.completed_lessons : [];
    cloudLessons.forEach(lid => {
      if (!mergedCompletedLessons[lid]) {
        mergedCompletedLessons[lid] = { score: 100, stars: 3, completedAt: data.updated_at || new Date().toISOString() };
      }
    });

    const mergedCompletedBosses = { ...localProgress.completedBosses };
    const cloudBosses = Array.isArray(data.completed_bosses) ? data.completed_bosses : [];
    cloudBosses.forEach(bid => {
      if (!mergedCompletedBosses[bid]) {
        mergedCompletedBosses[bid] = { score: 100, completedAt: data.updated_at || new Date().toISOString() };
      }
    });

    const merged = {
      completedLessons: mergedCompletedLessons,
      completedBosses: mergedCompletedBosses,
      unlockedLevelNumber: Math.max(localProgress.unlockedLevelNumber || 1, data.unlocked_levels || 1),
      activeLessonId: localProgress.activeLessonId || data.active_lesson_id || 'l-101'
    };

    saveUserJourneyProgress(merged, user);
    return merged;
  } catch (err) {
    console.warn('Sync journey progress from cloud notice:', err);
    return null;
  }
}

/**
 * Determine the status of a specific lesson node
 * Returns: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
 */
export function getLessonNodeStatus(lessonId, progress) {
  const completedInfo = progress?.completedLessons?.[lessonId];
  if (completedInfo) {
    return completedInfo.stars >= 3 ? 'mastered' : 'completed';
  }

  // Find index in curriculum
  const targetLesson = getLessonById(lessonId);
  if (!targetLesson) return 'locked';

  const levelObj = getLevelById(targetLesson.levelId);
  if (levelObj && levelObj.levelNumber > (progress?.unlockedLevelNumber || 1)) {
    return 'locked';
  }

  // Check chapter and lesson prerequisites
  const chapterLessons = getLessonsByChapter(targetLesson.chapterId);
  const currentIndex = chapterLessons.findIndex(l => l.id === lessonId);

  if (currentIndex === 0) {
    // First lesson of chapter: check if previous chapter boss is completed
    const currentChapter = getChapterById(targetLesson.chapterId);
    if (!currentChapter || currentChapter.chapterNumber === 1) {
      return progress?.activeLessonId === lessonId ? 'in_progress' : 'available';
    }

    const prevChapter = LEARNING_CHAPTERS.find(c => c.chapterNumber === currentChapter.chapterNumber - 1);
    if (!prevChapter) {
      return progress?.activeLessonId === lessonId ? 'in_progress' : 'available';
    }

    const prevBossBeaten = Boolean(progress?.completedBosses?.[prevChapter.bossId]);
    if (!prevBossBeaten) {
      return 'locked';
    }

    return progress?.activeLessonId === lessonId ? 'in_progress' : 'available';
  }

  // Subsequent lesson in chapter: previous lesson must be completed
  const prevLesson = chapterLessons[currentIndex - 1];
  const isPrevCompleted = Boolean(progress?.completedLessons?.[prevLesson.id]);

  if (!isPrevCompleted) {
    return 'locked';
  }

  return progress?.activeLessonId === lessonId ? 'in_progress' : 'available';
}

/**
 * Check if the chapter boss challenge is unlocked
 * Boss requires all 5 lessons in the module to be completed
 */
export function isBossUnlocked(chapterId, progress) {
  const chapterLessons = getLessonsByChapter(chapterId);
  if (chapterLessons.length === 0) return true;

  // All lessons in this chapter must be completed
  return chapterLessons.every(lesson => Boolean(progress?.completedLessons?.[lesson.id]));
}

/**
 * Mark a lesson completed and award XP & trigger unlocks
 * Enforces passing threshold: score >= 70% required to complete and advance
 */
export function completeLesson(lessonId, score = 100, user = null) {
  const progress = getUserJourneyProgress(user);
  const targetLesson = getLessonById(lessonId);

  // Passing criteria check: minimum 70% required
  if (score < 70) {
    return {
      success: false,
      passed: false,
      score,
      stars: 0,
      progress,
      message: 'Điểm số chưa đạt chuẩn đầu ra (tối thiểu 70%). Hãy ôn tập kiến thức và thử lại!'
    };
  }

  const isFirstTime = !progress.completedLessons[lessonId];
  const prevScore = progress.completedLessons[lessonId]?.score || 0;
  const bestScore = Math.max(prevScore, score);

  // Score to stars conversion: 90+ -> 3 stars (mastered), 80-89 -> 2 stars, 70-79 -> 1 star
  const stars = bestScore >= 90 ? 3 : (bestScore >= 80 ? 2 : 1);

  progress.completedLessons[lessonId] = {
    score: bestScore,
    stars,
    completedAt: progress.completedLessons[lessonId]?.completedAt || new Date().toISOString(),
    lastReviewedAt: new Date().toISOString()
  };

  // Determine next lesson and advance activeLessonId if first time or currently on this node
  if (targetLesson && (isFirstTime || progress.activeLessonId === lessonId)) {
    const chapterLessons = getLessonsByChapter(targetLesson.chapterId);
    const currentIndex = chapterLessons.findIndex(l => l.id === lessonId);

    if (currentIndex >= 0 && currentIndex < chapterLessons.length - 1) {
      progress.activeLessonId = chapterLessons[currentIndex + 1].id;
    }
  }

  saveUserJourneyProgress(progress, user);

  // Award lesson XP (+50 XP for initial completion, strictly idempotent)
  let xpEarned = 0;
  if (isFirstTime) {
    xpEarned = targetLesson?.xpReward || 50;
    awardXp(xpEarned, user, `lesson_complete_${lessonId}`);

    // Update Daily Mission progress for 'lesson'
    updateDailyMissionProgress('lesson', 1, user);
    if (score >= 90) {
      updateDailyMissionProgress('quiz', 1, user);
    }
  } else {
    // Review completion: award review XP (+10 XP) with daily idempotency
    xpEarned = 10;
    const today = getLocalDateString();
    awardXp(xpEarned, user, `lesson_review_${lessonId}_${today}`);
    updateDailyMissionProgress('vocab_review', 1, user);
  }

  // Update skill mastery
  updateSkillMasteryAfterLesson(lessonId, score, user);

  // Synchronize vocabulary & Hanzi into user's remembered list & SRS queue
  if (targetLesson) {
    const vocabToSync = [
      ...(targetLesson.step2_vocabulary || []),
      ...(targetLesson.step3_hanzi || []).map(h => ({
        id: `hz-${h.hanzi}`,
        hanzi: h.hanzi,
        pinyin: h.pinyin,
        meaning: h.meaning,
        level: targetLesson.levelId ? 'HSK 1' : 'HSK 1'
      }))
    ];
    syncLessonVocabToSrs(vocabToSync, user).catch(() => {});
  }

  return { success: true, passed: true, progress, xpEarned, stars, isFirstTime };
}

/**
 * Retrieve the current in-progress or next recommended lesson to resume
 */
export function getResumeLesson(progress) {
  if (!progress) {
    const defaultL = getLessonById('l-101');
    return {
      lesson: defaultL,
      chapter: getChapterById('ch-1'),
      level: getLevelById('lvl-1'),
      status: 'available'
    };
  }

  const activeId = progress.activeLessonId || 'l-101';
  const activeLesson = getLessonById(activeId);
  if (activeLesson) {
    const status = getLessonNodeStatus(activeId, progress);
    const chapter = getChapterById(activeLesson.chapterId);
    const level = getLevelById(activeLesson.levelId);
    if (status !== 'locked') {
      return {
        lesson: activeLesson,
        chapter,
        level,
        status
      };
    }
  }

  // Fallback to first available or in_progress lesson
  for (const ch of LEARNING_CHAPTERS) {
    const lessons = getLessonsByChapter(ch.id);
    for (const l of lessons) {
      const status = getLessonNodeStatus(l.id, progress);
      if (status === 'in_progress' || status === 'available') {
        return {
          lesson: l,
          chapter: ch,
          level: getLevelById(ch.levelId),
          status
        };
      }
    }
  }

  const fallbackL = getLessonById('l-101');
  return {
    lesson: fallbackL,
    chapter: getChapterById('ch-1'),
    level: getLevelById('lvl-1'),
    status: 'available'
  };
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

export const LEARNING_GOALS = {
  general_foundation: {
    id: 'general_foundation',
    name: 'Nền tảng toàn diện HSK 3.0',
    shortName: 'Toàn diện HSK',
    desc: 'Cân bằng cả 7 kỹ năng: từ vựng, phát âm, ngữ pháp, nghe, đọc, viết theo chuẩn HSK 3.0.',
    icon: '🌱',
    primarySkills: ['vocabulary', 'grammar', 'pronunciation', 'listening', 'reading', 'writing']
  },
  hsk_exam: {
    id: 'hsk_exam',
    name: 'Luyện thi chứng chỉ HSK 1–3',
    shortName: 'Luyện thi HSK',
    desc: 'Tập trung từ vựng tần suất cao trong đề thi, ngữ pháp cốt lõi và các dạng bài trắc nghiệm điểm số cao.',
    icon: '🎯',
    primarySkills: ['vocabulary', 'grammar', 'reading', 'listening']
  },
  daily_communication: {
    id: 'daily_communication',
    name: 'Giao tiếp đời sống & Du lịch',
    shortName: 'Giao tiếp & Du lịch',
    desc: 'Ưu tiên phát âm chuẩn, phản xạ nghe nói nhanh, đàm thoại tình huống thực tế và hội thoại cùng AI.',
    icon: '🗣️',
    primarySkills: ['speaking', 'pronunciation', 'listening']
  },
  hanzi_culture: {
    id: 'hanzi_culture',
    name: 'Chữ Hán & Quy tắc bút thuận',
    shortName: 'Chữ Hán & Bút thuận',
    desc: 'Tập trung 214 bộ thủ, chiết tự, quy tắc thuận bút chữ Hán và luyện viết chuẩn ô mễ tự.',
    icon: '✍️',
    primarySkills: ['writing', 'vocabulary', 'reading']
  },
  work_business: {
    id: 'work_business',
    name: 'Tiếng Trung công việc & Thương mại',
    shortName: 'Công việc & Thương mại',
    desc: 'Tăng cường từ vựng công sở, giao dịch, lịch thiệp và đàm thoại công việc thực tế.',
    icon: '💼',
    primarySkills: ['speaking', 'vocabulary', 'reading', 'listening']
  }
};

export function getUserLearningGoal(user = null) {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.LEARNING_GOAL, user);
    const saved = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_learning_goal'));
    if (saved && LEARNING_GOALS[saved]) {
      return saved;
    }
    if (user?.learningGoal && LEARNING_GOALS[user.learningGoal]) {
      return user.learningGoal;
    }
    if (user?.goal && LEARNING_GOALS[user.goal]) {
      return user.goal;
    }
  } catch {}
  return 'general_foundation';
}

export function saveUserLearningGoal(goalId, user = null) {
  const targetId = LEARNING_GOALS[goalId] ? goalId : 'general_foundation';
  try {
    const key = getUserStorageKey(STORAGE_KEYS.LEARNING_GOAL, user);
    localStorage.setItem(key, targetId);
  } catch {}
  return targetId;
}

export function getUserDailyGoalMinutes(user = null) {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.DAILY_GOAL, user);
    const saved = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_daily_goal'));
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch {}
  return 15;
}

export function saveUserDailyGoalMinutes(minutes, user = null) {
  const val = Math.max(10, Math.min(60, Number(minutes) || 15));
  try {
    const key = getUserStorageKey(STORAGE_KEYS.DAILY_GOAL, user);
    localStorage.setItem(key, String(val));
  } catch {}
  return val;
}

/**
 * Đề xuất bài học tiếp theo kèm lý do sư phạm xác thực
 */
export function getRecommendedNextLesson(user = null) {
  const progress = getUserJourneyProgress(user);
  const resume = getResumeLesson(progress);
  const lesson = resume?.lesson || getLessonById('l-101');
  const chapter = resume?.chapter || getChapterById(lesson?.chapterId) || getChapterById('ch-1');
  const level = resume?.level || getLevelById(lesson?.levelId) || getLevelById('lvl-1');

  const completedCount = Object.keys(progress?.completedLessons || {}).length;

  let reason = '';
  if (completedCount === 0) {
    reason = 'Bài học mở đầu lộ trình HSK 1: Làm quen với thanh mẫu, vận mẫu và lời chào cơ bản.';
  } else {
    const completedList = Object.entries(progress.completedLessons || {})
      .sort((a, b) => new Date(b[1].completedAt || 0) - new Date(a[1].completedAt || 0));
    const lastDone = completedList[0];
    if (lastDone) {
      const lastLesson = getLessonById(lastDone[0]);
      const lastScore = lastDone[1]?.score || 100;
      reason = `Tiếp nối thành tích ${lastScore}% ở ${lastLesson?.title || 'bài trước'}. Tiến tới "${lesson?.title}" để mở rộng từ vựng và mẫu câu mới.`;
    } else {
      reason = `Bài học tiếp theo trên Lộ trình ${level?.name || 'HSK 1'}: Duy trì đà học tập đều đặn.`;
    }
  }

  return {
    lesson,
    chapter,
    level,
    lessonId: lesson?.id || 'l-101',
    title: lesson?.title || 'Bài học mới',
    chineseTitle: lesson?.chineseTitle || '汉语学习',
    chapterTitle: chapter?.title || 'Chương 1',
    levelName: level?.name || 'HSK 1',
    lessonNumber: lesson?.lessonNumber || 1,
    durationMinutes: lesson?.durationMinutes || 18,
    status: resume?.status || 'available',
    reason,
    targetRoute: 'roadmap'
  };
}

/**
 * Đề xuất bài cần ôn lại (Điểm kiểm tra 70-89% hoặc đã hoàn thành quá 7 ngày)
 */
export function getRecommendedReviewLessons(user = null, limit = 3) {
  const progress = getUserJourneyProgress(user);
  const completedMap = progress?.completedLessons || {};
  const completedEntries = Object.entries(completedMap);

  if (completedEntries.length === 0) {
    return [];
  }

  const now = Date.now();
  const candidates = [];

  for (const [lessonId, info] of completedEntries) {
    const lesson = getLessonById(lessonId);
    if (!lesson) continue;

    const score = Number(info.score) || 70;
    const stars = Number(info.stars) || (score >= 90 ? 3 : (score >= 80 ? 2 : 1));
    const completedAt = info.completedAt ? new Date(info.completedAt).getTime() : now;
    const daysAgo = Math.max(0, Math.floor((now - completedAt) / 86400000));

    let needsReview = false;
    let priority = 0;
    let reason = '';

    if (score < 80) {
      needsReview = true;
      priority = 3;
      reason = `Điểm bài kiểm tra đạt ${score}% (1 sao). Bạn đã qua bài nhưng còn nhiều câu sai trắc nghiệm, cần ôn lại để đạt 3 sao chuẩn đầu ra.`;
    } else if (score < 90) {
      needsReview = true;
      priority = 2;
      reason = `Điểm bài kiểm tra đạt ${score}% (2 sao). Cần ôn tập lại để củng cố ngữ pháp và đạt trọn vẹn 3 sao thuần thục.`;
    } else if (daysAgo >= 7) {
      needsReview = true;
      priority = 1;
      reason = `Đã hoàn thành ${daysAgo} ngày trước. Ôn lại ngắn 5 phút để kích hoạt trí nhớ dài hạn theo chu kỳ Spaced Repetition.`;
    }

    if (needsReview) {
      const chapter = getChapterById(lesson.chapterId);
      const level = getLevelById(lesson.levelId);
      candidates.push({
        lessonId,
        lesson,
        chapter,
        level,
        title: lesson.title,
        chineseTitle: lesson.chineseTitle,
        chapterTitle: chapter?.title || '',
        score,
        stars,
        daysAgo,
        priority,
        reason,
        targetRoute: 'roadmap'
      });
    }
  }

  candidates.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.score - b.score;
  });

  return candidates.slice(0, limit);
}

/**
 * Đề xuất tài liệu phù hợp từ Materials dựa trên trình độ, điểm yếu và mục tiêu
 */
export function getRecommendedMaterialsForUser(user = null, weakSkills = [], learningGoal = 'general_foundation', limit = 3) {
  const allMaterials = getStoredMaterials();
  if (!allMaterials || allMaterials.length === 0) return [];

  const progress = getUserJourneyProgress(user);
  const currentLevelNumber = progress?.unlockedLevelNumber || 1;
  const currentLevelTag = currentLevelNumber === 1 ? 'HSK 1' : (currentLevelNumber === 2 ? 'HSK 2' : 'HSK 3');

  const scored = allMaterials.map(mat => {
    let score = 0;
    const reasons = [];

    // 1. Khớp trình độ
    if (mat.level === currentLevelTag || mat.level === 'Tất cả' || (currentLevelNumber === 1 && mat.level === 'Nhập môn')) {
      score += 15;
    }

    // 2. Khớp kỹ năng yếu
    const matSkills = (mat.skills || []).map(s => String(s).toLowerCase());
    const weakSkillKeys = Array.isArray(weakSkills) 
      ? weakSkills.map(w => typeof w === 'string' ? w : (w?.skill || ''))
      : [];

    if (weakSkillKeys.includes('pronunciation') && (matSkills.some(s => s.includes('phát âm') || s.includes('audio') || s.includes('thanh điệu')) || mat.id === 'mat-12' || mat.id === 'mat-8')) {
      score += 25;
      reasons.push('Khắc phục điểm yếu phát âm & thanh điệu');
    }
    if (weakSkillKeys.includes('writing') && (matSkills.some(s => s.includes('viết') || s.includes('thuận bút') || s.includes('bộ thủ')) || mat.id === 'mat-9' || mat.id === 'mat-4' || mat.id === 'mat-14')) {
      score += 25;
      reasons.push('Khắc phục điểm yếu chữ Hán & nét thuận bút');
    }
    if (weakSkillKeys.includes('grammar') && (matSkills.some(s => s.includes('ngữ pháp')) || mat.id === 'mat-5')) {
      score += 25;
      reasons.push('Củng cố các cấu trúc ngữ pháp còn nhầm lẫn');
    }
    if (weakSkillKeys.includes('listening') && (matSkills.some(s => s.includes('nghe')) || mat.id === 'mat-12' || mat.id === 'mat-15' || mat.id === 'mat-17')) {
      score += 20;
      reasons.push('Luyện nghe âm sắc và tốc độ chuẩn người bản ngữ');
    }
    if (weakSkillKeys.includes('speaking') && (matSkills.some(s => s.includes('nói') || s.includes('khẩu ngữ') || s.includes('giao tiếp')) || mat.id === 'mat-19' || mat.id === 'mat-16' || mat.id === 'mat-20')) {
      score += 20;
      reasons.push('Gia tăng phản xạ đàm thoại tình huống thực tế');
    }

    // 3. Khớp mục tiêu học tập
    if (learningGoal === 'hsk_exam' && (mat.category === 'Đề thi HSK' || mat.category === 'Giáo trình chuẩn' || mat.id === 'mat-6' || mat.id === 'mat-1')) {
      score += 20;
      reasons.push('Phù hợp mục tiêu luyện thi chứng chỉ HSK');
    } else if (learningGoal === 'daily_communication' && (mat.category === 'Thành ngữ & Giao tiếp' || mat.id === 'mat-19' || mat.id === 'mat-16' || mat.id === 'mat-2')) {
      score += 20;
      reasons.push('Phù hợp mục tiêu giao tiếp đàm thoại đời sống');
    } else if (learningGoal === 'hanzi_culture' && (mat.category === 'Bộ thủ & Hán tự' || mat.id === 'mat-4' || mat.id === 'mat-9' || mat.id === 'mat-8')) {
      score += 20;
      reasons.push('Phù hợp mục tiêu tập viết và chiết tự Hán');
    } else if (learningGoal === 'work_business' && (mat.id === 'mat-19' || mat.id === 'mat-3' || mat.id === 'mat-16')) {
      score += 20;
      reasons.push('Phù hợp mục tiêu đàm thoại công sở & thương mại');
    }

    if (reasons.length === 0) {
      if (mat.isFeatured) {
        score += 5;
        reasons.push('Tài liệu học thuật trọng tâm được khuyên dùng');
      } else {
        reasons.push('Tài liệu tham khảo bổ trợ');
      }
    }

    return {
      material: mat,
      score,
      reason: reasons.join(' • ')
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(item => ({
    id: item.material.id,
    title: item.material.title,
    category: item.material.category,
    level: item.material.level,
    skills: item.material.skills,
    format: item.material.format,
    fileSize: item.material.fileSize,
    author: item.material.author,
    downloadUrl: item.material.downloadUrl,
    sourceUrl: item.material.sourceUrl,
    isFeatured: item.material.isFeatured,
    reason: item.reason
  }));
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

  const goal = getUserLearningGoal(user);
  const nextLesson = getRecommendedNextLesson(user);
  const reviewLessons = getRecommendedReviewLessons(user, 2);
  const materials = getRecommendedMaterialsForUser(user, [weakest.key], goal, 2);

  return {
    weakestSkill: weakest.name,
    weakestKey: weakest.key,
    score: weakest.score,
    recommendedTab: weakest.route,
    advice: `Kỹ năng ${weakest.name} hiện đạt ${weakest.score}%. Hãy dành 10 phút luyện tập để cân bằng bảng kỹ năng!`,
    desc: weakest.desc,
    learningGoal: goal,
    goalDetails: LEARNING_GOALS[goal],
    nextLesson,
    reviewLessons,
    materials
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
// 5. DAILY MISSIONS ENGINE (POWERED BY GAMIFICATION SERVICE)
// =========================================================================
import { 
  generatePersonalizedDailyMissions, 
  updateDailyMissionProgress as updateGamificationDailyMission, 
  claimDailyMission as claimGamificationDailyMission 
} from './gamificationService.js';

export function getDailyMissions(user = null) {
  return generatePersonalizedDailyMissions(user);
}

export function updateDailyMissionProgress(category, increment = 1, user = null) {
  return updateGamificationDailyMission(category, increment, user);
}

export function claimDailyMission(missionId, user = null) {
  return claimGamificationDailyMission(missionId, user);
}

// =========================================================================
// 6. ROADMAP VOCABULARY INTEGRATION
// =========================================================================

/**
 * Extracts all vocabulary and characters taught across the 60 Roadmap lessons.
 * Tags each item with complete roadmap metadata: lessonId, lessonNumber, lessonTitle, chapterId, chapterTitle, levelId, level.
 */
export function getAllRoadmapVocabulary() {
  const chapterMap = {};
  LEARNING_CHAPTERS.forEach(ch => {
    chapterMap[ch.id] = ch.title;
  });

  const items = [];
  const seenKey = new Set();

  LEARNING_LESSONS.forEach(lesson => {
    const chTitle = chapterMap[lesson.chapterId] || '';
    const levelLabel = lesson.levelId === 'lvl-1' ? 'HSK 1' : lesson.levelId === 'lvl-2' ? 'HSK 2' : 'HSK 3';

    // 1. Vocabulary in step2_vocabulary
    (lesson.step2_vocabulary || []).forEach((v, idx) => {
      const key = `${lesson.id}_${v.hanzi}`;
      if (!seenKey.has(key)) {
        seenKey.add(key);
        items.push({
          id: v.id || `roadmap-v-${lesson.id}-${idx}`,
          hanzi: v.hanzi,
          pinyin: v.pinyin || '',
          hanviet: v.hanviet || '',
          meaning: v.meaning || '',
          radical: v.radical || '—',
          strokes: v.strokes || 0,
          mnemonic: v.mnemonic || '',
          example: v.example || { hanzi: `${v.hanzi}很好。`, pinyin: '', meaning: '' },
          level: levelLabel,
          topic: lesson.tags ? (lesson.tags[1] || lesson.tags[0]) : 'Lộ trình',
          roadmapLessonId: lesson.id,
          roadmapLessonNumber: lesson.lessonNumber,
          roadmapLessonTitle: lesson.title,
          roadmapChapterId: lesson.chapterId,
          roadmapChapterTitle: chTitle,
          roadmapLevelId: lesson.levelId,
          source: 'roadmap'
        });
      }
    });

    // 2. Characters in step3_hanzi
    (lesson.step3_hanzi || []).forEach((h, idx) => {
      const charStr = h.hanzi || h.char;
      const key = `${lesson.id}_${charStr}`;
      if (charStr && !seenKey.has(key)) {
        seenKey.add(key);
        items.push({
          id: `roadmap-h-${lesson.id}-${idx}`,
          hanzi: charStr,
          pinyin: h.pinyin || '',
          hanviet: h.hanviet || '',
          meaning: h.meaning || '',
          radical: h.components || h.radical || '—',
          strokes: h.strokesCount || h.strokes || 0,
          mnemonic: h.mnemonic || '',
          example: {
            hanzi: `${charStr}。`,
            pinyin: `${h.pinyin || ''}.`,
            meaning: h.meaning || ''
          },
          level: levelLabel,
          topic: 'Chữ Hán Lộ trình',
          roadmapLessonId: lesson.id,
          roadmapLessonNumber: lesson.lessonNumber,
          roadmapLessonTitle: lesson.title,
          roadmapChapterId: lesson.chapterId,
          roadmapChapterTitle: chTitle,
          roadmapLevelId: lesson.levelId,
          source: 'roadmap_hanzi'
        });
      }
    });
  });

  return items;
}

/**
 * Returns roadmap lessons list with vocabulary counts for easy filtering in Practice
 */
export function getRoadmapLessonsWithVocabCount() {
  const allVocab = getAllRoadmapVocabulary();
  const countMap = {};
  allVocab.forEach(v => {
    countMap[v.roadmapLessonId] = (countMap[v.roadmapLessonId] || 0) + 1;
  });

  return LEARNING_LESSONS.map(l => ({
    id: l.id,
    lessonNumber: l.lessonNumber,
    title: l.title,
    chapterId: l.chapterId,
    levelId: l.levelId,
    vocabCount: countMap[l.id] || 0
  }));
}

/**
 * Extracts vocabulary only from lessons that the user has completed.
 */
export function getCompletedRoadmapVocabulary(user = null) {
  const progress = getUserJourneyProgress(user);
  const completedIds = new Set(Object.keys(progress.completedLessons || {}));
  const allVocab = getAllRoadmapVocabulary();
  return allVocab.filter(v => completedIds.has(v.roadmapLessonId));
}

/**
 * Get vocabulary for a specific roadmap lesson
 */
export function getRoadmapVocabularyByLesson(lessonId) {
  const all = getAllRoadmapVocabulary();
  return all.filter(v => v.roadmapLessonId === lessonId);
}

