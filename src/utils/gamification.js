// Gamification, Real-time XP and Consecutive Streak Engine for HanziGo
import { triggerCloudSync } from '../firebase/services';

const STORAGE_BONUS_XP = 'hanzigo_bonus_xp';
const STORAGE_LAST_STUDY_DATE = 'hanzigo_last_study_date';
const STORAGE_STREAK = 'hanzigo_streak_count';

// Format local date YYYY-MM-DD
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate total XP accurately based on all real learning activities across HanziGo
 */
export function calculateTotalXp(user = null) {
  let xp = 0;

  // 1. Bonus / explicitly awarded XP
  try {
    const rawBonus = localStorage.getItem(STORAGE_BONUS_XP);
    if (rawBonus) xp += parseInt(rawBonus, 10) || 0;
  } catch {}

  // 2. XP from completed lessons (50 XP each)
  try {
    const rawLessons = localStorage.getItem('hanzigo_completed_lessons');
    if (rawLessons) {
      const lessons = JSON.parse(rawLessons);
      if (Array.isArray(lessons)) xp += lessons.length * 50;
    }
  } catch {}

  // 3. XP from mastered vocabulary (10 XP each)
  try {
    const rawVocab = localStorage.getItem('hanzigo_vocab_remembered');
    if (rawVocab) {
      const vocab = JSON.parse(rawVocab);
      if (Array.isArray(vocab)) xp += vocab.length * 10;
    }
  } catch {}

  // 4. XP from pronunciation practice (15 XP each)
  try {
    const rawPronounce = localStorage.getItem('hanzigo_pronounce_history');
    if (rawPronounce) {
      const hist = JSON.parse(rawPronounce);
      if (Array.isArray(hist)) xp += hist.length * 15;
    }
  } catch {}

  // 5. XP from calligraphy writing characters (15 XP each)
  try {
    const rawWriting = localStorage.getItem('hanzigo_custom_writing_chars');
    if (rawWriting) {
      const chars = JSON.parse(rawWriting);
      if (Array.isArray(chars)) xp += chars.length * 15;
    }
  } catch {}

  // 6. XP from AI conversations (10 XP per user dialogue message)
  try {
    const rawChat = localStorage.getItem('hanzigo_ai_chat_history');
    if (rawChat) {
      const chats = JSON.parse(rawChat);
      if (typeof chats === 'object') {
        const totalMessages = Object.values(chats).reduce((acc, thread) => {
          return acc + (Array.isArray(thread) ? thread.filter(m => m.speaker === 'user').length : 0);
        }, 0);
        xp += totalMessages * 10;
      }
    }
  } catch {}

  // 7. Base XP from user profile if higher
  if (user && typeof user.xp === 'number' && user.xp > xp) {
    xp = user.xp;
  }

  return xp;
}

/**
 * Award XP to the learner, update streak activity, and sync to DB
 */
export function awardXp(amount) {
  if (typeof amount !== 'number' || amount <= 0) return calculateTotalXp();

  try {
    const rawBonus = localStorage.getItem(STORAGE_BONUS_XP);
    const current = rawBonus ? parseInt(rawBonus, 10) || 0 : 0;
    const nextBonus = current + amount;
    localStorage.setItem(STORAGE_BONUS_XP, String(nextBonus));
  } catch (err) {
    console.error('Error awarding XP:', err);
  }

  // Also record study activity to maintain/advance streak
  recordStudyActivity();

  // Async sync to Firestore
  triggerCloudSync();

  return calculateTotalXp();
}

/**
 * Record a study activity today and advance the consecutive day streak
 */
export function recordStudyActivity() {
  const today = getLocalDateString();

  try {
    const lastDate = localStorage.getItem(STORAGE_LAST_STUDY_DATE);
    const rawStreak = localStorage.getItem(STORAGE_STREAK);
    let currentStreak = rawStreak ? parseInt(rawStreak, 10) || 0 : 0;

    if (!lastDate) {
      // First ever recorded study day
      currentStreak = 1;
    } else if (lastDate === today) {
      // Already studied today: ensure streak is at least 1
      if (currentStreak < 1) currentStreak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterday);

      if (lastDate === yesterdayStr) {
        // Consecutive calendar day -> increment streak!
        currentStreak += 1;
      } else {
        // Skipped more than 1 day -> streak restarts at 1
        currentStreak = 1;
      }
    }

    localStorage.setItem(STORAGE_LAST_STUDY_DATE, today);
    localStorage.setItem(STORAGE_STREAK, String(currentStreak));

    // Update current cached user
    const savedUser = localStorage.getItem('hanzigo_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u) {
          u.streak = currentStreak;
          u.lastActiveDate = today;
          u.xp = calculateTotalXp(u);
          localStorage.setItem('hanzigo_user', JSON.stringify(u));
        }
      } catch {}
    }

    triggerCloudSync();
    return currentStreak;
  } catch (err) {
    console.error('Error recording study activity:', err);
    return 1;
  }
}

/**
 * Get current streak status based on calendar dates
 */
export function getStreakStatus() {
  try {
    const today = getLocalDateString();
    const lastDate = localStorage.getItem(STORAGE_LAST_STUDY_DATE);
    const rawStreak = localStorage.getItem(STORAGE_STREAK);
    let streak = rawStreak ? parseInt(rawStreak, 10) || 0 : 0;

    if (!lastDate) {
      return { streak: 0, hasStudiedToday: false };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    if (lastDate === today) {
      return { streak: Math.max(1, streak), hasStudiedToday: true };
    }

    if (lastDate === yesterdayStr) {
      // Active from yesterday, hasn't studied today yet
      return { streak: Math.max(1, streak), hasStudiedToday: false };
    }

    // Missed at least 2 full days
    return { streak: 0, hasStudiedToday: false };
  } catch {
    return { streak: 0, hasStudiedToday: false };
  }
}

/**
 * Level & Rank information calculated from XP
 */
export function getUserLevelInfo(xp) {
  const levels = [
    { level: 1, minXp: 0, maxXp: 150, title: 'Tân Thủ Nhập Môn', badge: '🌱', hskEquivalent: 'Nhập Môn' },
    { level: 2, minXp: 150, maxXp: 400, title: 'Đồng Môn Chăm Chỉ', badge: '📘', hskEquivalent: 'HSK 1' },
    { level: 3, minXp: 400, maxXp: 850, title: 'Học Giả Tiến Bộ', badge: '🔥', hskEquivalent: 'HSK 2' },
    { level: 4, minXp: 850, maxXp: 1600, title: 'Cao Đồ Khẩu Ngữ', badge: '⭐', hskEquivalent: 'HSK 3' },
    { level: 5, minXp: 1600, maxXp: 3000, title: 'Đại Sư Hán Tự', badge: '👑', hskEquivalent: 'HSK 4' },
    { level: 6, minXp: 3000, maxXp: 6000, title: 'Tông Sư Hán Ngữ', badge: '🏆', hskEquivalent: 'HSK 5-6' }
  ];

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    if (xp < l.maxXp || i === levels.length - 1) {
      const range = l.maxXp - l.minXp;
      const current = Math.max(0, xp - l.minXp);
      const percent = Math.min(100, Math.round((current / range) * 100));
      const nextXp = Math.max(0, l.maxXp - xp);

      return {
        ...l,
        currentProgressPercent: percent,
        xpToNextLevel: nextXp
      };
    }
  }

  return {
    level: 6,
    minXp: 3000,
    maxXp: 99999,
    title: 'Tông Sư Hán Ngữ',
    badge: '🏆',
    hskEquivalent: 'HSK 6',
    currentProgressPercent: 100,
    xpToNextLevel: 0
  };
}
