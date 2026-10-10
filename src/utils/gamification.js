import { triggerCloudSync } from '../supabase/services.js';

/**
 * Broadcast real-time gamification updates across windows, tabs, and components
 */
export function broadcastGamificationUpdate(type = 'LEADERBOARD_UPDATED', payload = {}) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('hanzigo_leaderboard_channel');
      bc.postMessage({ type, ...payload, timestamp: Date.now() });
      if (typeof bc.unref === 'function') bc.unref();
      bc.close();
    }
  } catch {}
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanzigo_gamification_updated', { detail: { type, ...payload } }));
    }
  } catch {}
}

// Format local date YYYY-MM-DD
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalize any date input (Date object, ISO string, or timestamp) to local YYYY-MM-DD string
 */
export function normalizeDateString(val) {
  if (!val) return null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return getLocalDateString(parsed);
    }
    if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 10);
    }
  } else if (val instanceof Date && !isNaN(val.getTime())) {
    return getLocalDateString(val);
  }
  return null;
}

/**
 * Get unique identifier key for current user to isolate storage and scoring
 */
export function getUserStorageKey(key, user = null) {
  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }
  const userIdent = targetUser?.uid || targetUser?.id || (targetUser?.email ? targetUser.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest');
  return `${key}_${userIdent}`;
}

/**
 * Calculate total XP accurately for a SPECIFIC user
 */
export function calculateTotalXp(user = null) {
  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }

  const bonusKey = getUserStorageKey('hanzigo_bonus_xp', targetUser);
  const lessonsKey = getUserStorageKey('hanzigo_completed_lessons', targetUser);
  const vocabKey = getUserStorageKey('hanzigo_vocab_remembered', targetUser);
  const pronounceKey = getUserStorageKey('hanzigo_pronounce_history', targetUser);
  const writingKey = getUserStorageKey('hanzigo_custom_writing_chars', targetUser);
  const chatKey = getUserStorageKey('hanzigo_ai_chat_history', targetUser);

  let xp = 0;

  // 1. User-specific bonus XP
  try {
    const rawBonus = localStorage.getItem(bonusKey);
    if (rawBonus) xp += parseInt(rawBonus, 10) || 0;
  } catch {}

  // 2. User-specific completed lessons (50 XP each)
  try {
    const rawLessons = localStorage.getItem(lessonsKey) || (targetUser ? null : localStorage.getItem('hanzigo_completed_lessons'));
    if (rawLessons) {
      const lessons = JSON.parse(rawLessons);
      if (Array.isArray(lessons)) xp += lessons.length * 50;
    }
  } catch {}

  // 3. User-specific mastered vocab (10 XP each)
  try {
    const rawVocab = localStorage.getItem(vocabKey) || (targetUser ? null : localStorage.getItem('hanzigo_vocab_remembered'));
    if (rawVocab) {
      const vocab = JSON.parse(rawVocab);
      if (Array.isArray(vocab)) xp += vocab.length * 10;
    }
  } catch {}

  // 4. User-specific pronunciation (15 XP each)
  try {
    const rawPronounce = localStorage.getItem(pronounceKey) || (targetUser ? null : localStorage.getItem('hanzigo_pronounce_history'));
    if (rawPronounce) {
      const hist = JSON.parse(rawPronounce);
      if (Array.isArray(hist)) xp += hist.length * 15;
    }
  } catch {}

  // 5. User-specific calligraphy writing (15 XP each)
  try {
    const rawWriting = localStorage.getItem(writingKey) || (targetUser ? null : localStorage.getItem('hanzigo_custom_writing_chars'));
    if (rawWriting) {
      const chars = JSON.parse(rawWriting);
      if (Array.isArray(chars)) xp += chars.length * 15;
    }
  } catch {}

  // 6. User-specific AI chat conversations (10 XP per dialogue message)
  try {
    const rawChat = localStorage.getItem(chatKey) || (targetUser ? null : localStorage.getItem('hanzigo_ai_chat_history'));
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

  // 7. Base profile XP (if user profile has higher baseline, filter out 9999 artifact)
  if (targetUser && typeof targetUser.xp === 'number') {
    if (targetUser.xp === 9999) {
      // 9999 was a temporary artifact, do not use it as real xp
    } else if (targetUser.xp > xp) {
      xp = targetUser.xp;
    }
  }

  return xp;
}

/**
 * Award XP to the specific learner, update streak activity, and sync to DB.
 * Supports idempotencyKey to prevent duplicate XP on repetitive clicks.
 */
export function awardXp(amount, user = null, idempotencyKey = null) {
  if (typeof amount !== 'number' || amount <= 0) return calculateTotalXp(user);

  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }

  const today = getLocalDateString();

  // Idempotency check: prevent duplicate awarding for the exact same action today
  if (idempotencyKey) {
    const actionHistoryKey = getUserStorageKey('hanzigo_awarded_actions', targetUser);
    try {
      const rawActions = localStorage.getItem(actionHistoryKey);
      const actions = rawActions ? JSON.parse(rawActions) : {};
      const fullActionId = `${idempotencyKey}_${today}`;
      if (actions[fullActionId]) {
        // Already awarded today, do not award duplicate points
        return calculateTotalXp(targetUser);
      }
      actions[fullActionId] = Date.now();
      localStorage.setItem(actionHistoryKey, JSON.stringify(actions));
    } catch (e) {
      console.warn('Idempotency check notice:', e);
    }
  }

  // Anti-abuse: Enforce daily bonus XP cap (max 1,500 XP/day to prevent spam scripts)
  const dailyXpCapKey = getUserStorageKey(`hanzigo_daily_bonus_cap_${today}`, targetUser);
  let dailyGranted = 0;
  try {
    const rawDaily = localStorage.getItem(dailyXpCapKey);
    if (rawDaily) dailyGranted = parseInt(rawDaily, 10) || 0;
  } catch {}

  const MAX_DAILY_CAP = 1500;
  if (dailyGranted >= MAX_DAILY_CAP) {
    // Already hit daily cap, do not add more bonus XP
    return calculateTotalXp(targetUser);
  }

  const effectiveAmount = Math.min(amount, MAX_DAILY_CAP - dailyGranted);
  if (effectiveAmount <= 0) return calculateTotalXp(targetUser);

  try {
    localStorage.setItem(dailyXpCapKey, String(dailyGranted + effectiveAmount));
  } catch {}

  const bonusKey = getUserStorageKey('hanzigo_bonus_xp', targetUser);

  try {
    const rawBonus = localStorage.getItem(bonusKey);
    const current = rawBonus ? parseInt(rawBonus, 10) || 0 : 0;
    const nextBonus = current + effectiveAmount;
    localStorage.setItem(bonusKey, String(nextBonus));
  } catch (err) {
    console.error('Error awarding XP:', err);
  }

  // Record streak activity specifically for this user
  recordStudyActivity(targetUser);

  // Recalculate total XP
  const updatedXp = calculateTotalXp(targetUser);

  // Update target user in localStorage if matching
  if (targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && (u.uid === targetUser.uid || u.email === targetUser.email)) {
          u.xp = updatedXp;
          localStorage.setItem('hanzigo_user', JSON.stringify(u));
        }
      }
    } catch {}
  }

  // Update local shared roster cache
  const targetId = targetUser?.uid || targetUser?.id;
  if (targetId) {
    try {
      const rawCache = localStorage.getItem('hanzigo_shared_profiles_cache');
      const cache = rawCache ? JSON.parse(rawCache) : {};
      cache[targetId] = {
        ...(cache[targetId] || {}),
        id: targetId,
        name: targetUser?.name || 'Học viên',
        email: targetUser?.email || '',
        avatar: targetUser?.avatar || null,
        level: targetUser?.level || 'HSK 1 - Sơ cấp',
        xp: updatedXp,
        streak: targetUser?.streak || 1,
        status: 'active'
      };
      localStorage.setItem('hanzigo_shared_profiles_cache', JSON.stringify(cache));
    } catch {}
  }

  // Trigger cloud sync for this user with authoritative XP
  triggerCloudSync(targetId, updatedXp);
  broadcastGamificationUpdate('LEADERBOARD_UPDATED', { xp: updatedXp, userId: targetId });

  return updatedXp;
}

/**
 * Record a study activity today and advance the consecutive day streak for a SPECIFIC user
 */
export function recordStudyActivity(user = null) {
  const today = getLocalDateString();
  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }

  const dateKey = getUserStorageKey('hanzigo_last_study_date', targetUser);
  const streakKey = getUserStorageKey('hanzigo_streak_count', targetUser);

  try {
    const rawDate = localStorage.getItem(dateKey) || localStorage.getItem('hanzigo_last_study_date') || targetUser?.last_study_date || targetUser?.lastActiveDate;
    const lastDate = normalizeDateString(rawDate);

    const rawStreak = localStorage.getItem(streakKey);
    const rawGlobalStreak = localStorage.getItem('hanzigo_streak_count');
    const userStreak = typeof targetUser?.streak === 'number' ? targetUser.streak : 0;
    let currentStreak = Math.max(
      rawStreak ? parseInt(rawStreak, 10) || 0 : 0,
      rawGlobalStreak ? parseInt(rawGlobalStreak, 10) || 0 : 0,
      userStreak
    );

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    if (!lastDate) {
      // Lần đầu tiên học
      currentStreak = Math.max(1, currentStreak);
    } else if (lastDate === today) {
      // Đã học hôm nay rồi -> giữ nguyên chuỗi
      if (currentStreak < 1) currentStreak = 1;
    } else if (lastDate === yesterdayStr) {
      // Hôm qua có học -> Chuỗi liên tiếp tăng thêm 1
      currentStreak = (currentStreak > 0 ? currentStreak : 0) + 1;
    } else {
      // Đã off từ 2 ngày trước trở lên (hôm qua không học) -> Bắt đầu lại chuỗi mới từ 1
      currentStreak = 1;
    }

    localStorage.setItem(dateKey, today);
    localStorage.setItem('hanzigo_last_study_date', today);
    localStorage.setItem(streakKey, String(currentStreak));
    localStorage.setItem('hanzigo_streak_count', String(currentStreak));

    // Update longest streak
    const longestKey = getUserStorageKey('hanzigo_longest_streak', targetUser);
    const prevLongest = parseInt(localStorage.getItem(longestKey) || '0', 10);
    if (currentStreak > prevLongest) {
      localStorage.setItem(longestKey, String(currentStreak));
      localStorage.setItem('hanzigo_longest_streak', String(currentStreak));
    }

    // Update cached user object if applicable
    if (targetUser) {
      try {
        const saved = localStorage.getItem('hanzigo_user');
        if (saved) {
          const u = JSON.parse(saved);
          if (u && (u.uid === targetUser.uid || u.email === targetUser.email || u.id === targetUser.id)) {
            u.streak = currentStreak;
            u.lastActiveDate = today;
            u.last_study_date = today;
            localStorage.setItem('hanzigo_user', JSON.stringify(u));
          }
        }
      } catch {}
    }

    triggerCloudSync(targetUser?.uid || targetUser?.id);
    broadcastGamificationUpdate('STREAK_UPDATED', { streak: currentStreak, userId: targetUser?.uid || targetUser?.id });
    return currentStreak;
  } catch (err) {
    console.error('Error recording study activity:', err);
    return 1;
  }
}

/**
 * Get current streak status based on calendar dates for a SPECIFIC user.
 * Quy tắc:
 * - Nếu hôm nay đã học (lastDate === today): streak giữ nguyên (>= 1), hasStudiedToday = true.
 * - Nếu hôm qua có học, hôm nay chưa học (lastDate === yesterday): streak giữ nguyên chờ học hôm nay, hasStudiedToday = false.
 * - Nếu tài khoản OFF 1 ngày trở lên (hôm qua không học) hoặc chưa từng học: chuỗi quay về 0, hasStudiedToday = false.
 */
export function getStreakStatus(user = null) {
  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }

  const dateKey = getUserStorageKey('hanzigo_last_study_date', targetUser);
  const streakKey = getUserStorageKey('hanzigo_streak_count', targetUser);

  try {
    const today = getLocalDateString();
    const rawDate = localStorage.getItem(dateKey) || localStorage.getItem('hanzigo_last_study_date') || targetUser?.last_study_date || targetUser?.lastActiveDate;
    let lastDate = normalizeDateString(rawDate);

    const rawStreak = localStorage.getItem(streakKey);
    const rawGlobalStreak = localStorage.getItem('hanzigo_streak_count');
    const userStreak = typeof targetUser?.streak === 'number' && !isNaN(targetUser.streak) ? targetUser.streak : null;

    let candidateStreak = 0;
    if (rawStreak !== null && rawStreak !== undefined && !isNaN(parseInt(rawStreak, 10))) {
      candidateStreak = Math.max(candidateStreak, parseInt(rawStreak, 10));
    }
    if (rawGlobalStreak !== null && rawGlobalStreak !== undefined && !isNaN(parseInt(rawGlobalStreak, 10))) {
      candidateStreak = Math.max(candidateStreak, parseInt(rawGlobalStreak, 10));
    }
    if (userStreak !== null) {
      candidateStreak = Math.max(candidateStreak, userStreak);
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    // Nếu chưa từng có ngày học nào được lưu nhưng user đã có candidateStreak > 0 (từ cloud DB/profile)
    if (!lastDate && candidateStreak > 0) {
      lastDate = yesterdayStr;
      try {
        localStorage.setItem(dateKey, yesterdayStr);
        localStorage.setItem('hanzigo_last_study_date', yesterdayStr);
      } catch {}
      return { streak: candidateStreak, hasStudiedToday: false };
    }

    // Nếu chưa từng có ngày học nào và candidateStreak là 0
    if (!lastDate) {
      return { streak: 0, hasStudiedToday: false };
    }

    // TH 1: Hôm nay đã học
    if (lastDate === today) {
      return { streak: Math.max(1, candidateStreak), hasStudiedToday: true };
    }

    // TH 2: Hôm qua có học, hôm nay chưa học (giữ chuỗi chờ học hôm nay)
    if (lastDate === yesterdayStr) {
      return { streak: Math.max(1, candidateStreak), hasStudiedToday: false };
    }

    // TH 3: Tài khoản đã off 1 ngày trở lên (hôm qua không học) -> Chuỗi quay về 0!
    try {
      localStorage.setItem(streakKey, '0');
      localStorage.setItem('hanzigo_streak_count', '0');
      if (targetUser) {
        const saved = localStorage.getItem('hanzigo_user');
        if (saved) {
          const u = JSON.parse(saved);
          if (u && (u.uid === targetUser.uid || u.email === targetUser.email || u.id === targetUser.id)) {
            u.streak = 0;
            localStorage.setItem('hanzigo_user', JSON.stringify(u));
          }
        }
      }
    } catch {}

    return { streak: 0, hasStudiedToday: false };
  } catch {
    return { streak: 0, hasStudiedToday: false };
  }
}

/**
 * Get longest streak ever achieved by the user
 */
export function getLongestStreak(user = null) {
  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }
  const longestKey = getUserStorageKey('hanzigo_longest_streak', targetUser);
  const streakStatus = getStreakStatus(targetUser);
  const userStoredLongest = typeof targetUser?.longest_streak === 'number' ? targetUser.longest_streak : 0;
  const userStreak = typeof targetUser?.streak === 'number' ? targetUser.streak : 0;
  try {
    const raw = localStorage.getItem(longestKey);
    const globalRaw = localStorage.getItem('hanzigo_longest_streak');
    const stored = Math.max(
      raw ? parseInt(raw, 10) || 0 : 0,
      globalRaw ? parseInt(globalRaw, 10) || 0 : 0
    );
    return Math.max(stored, userStoredLongest, streakStatus.streak, userStreak);
  } catch {
    return Math.max(userStoredLongest, streakStatus.streak, userStreak);
  }
}

/**
 * Get remaining Streak Freeze count (Bảo vệ chuỗi)
 */
export function getStreakFreeze(user = null) {
  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }
  const freezeKey = getUserStorageKey('hanzigo_streak_freeze', targetUser);
  try {
    const raw = localStorage.getItem(freezeKey);
    return raw !== null ? parseInt(raw, 10) : 1; // Default 1 free streak freeze
  } catch {
    return 1;
  }
}

/**
 * Use / Activate a streak freeze shield
 */
export function consumeStreakFreeze(user = null) {
  let targetUser = user;
  if (!targetUser) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) targetUser = JSON.parse(saved);
    } catch {}
  }
  const freezeKey = getUserStorageKey('hanzigo_streak_freeze', targetUser);
  const current = getStreakFreeze(targetUser);
  if (current > 0) {
    localStorage.setItem(freezeKey, String(current - 1));
    // Protect today's streak by marking today with shield protection
    const today = getLocalDateString();
    const dateKey = getUserStorageKey('hanzigo_last_study_date', targetUser);
    const streakKey = getUserStorageKey('hanzigo_streak_count', targetUser);
    localStorage.setItem(dateKey, today);
    localStorage.setItem('hanzigo_last_study_date', today);
    const rawStreak = localStorage.getItem(streakKey) || localStorage.getItem('hanzigo_streak_count');
    const storedStreak = parseInt(rawStreak || '0', 10);
    const preservedStreak = Math.max(1, storedStreak, typeof targetUser?.streak === 'number' ? targetUser.streak : 0);
    localStorage.setItem(streakKey, String(preservedStreak));
    localStorage.setItem('hanzigo_streak_count', String(preservedStreak));

    if (targetUser) {
      try {
        const saved = localStorage.getItem('hanzigo_user');
        if (saved) {
          const u = JSON.parse(saved);
          if (u && (u.uid === targetUser.uid || u.email === targetUser.email || u.id === targetUser.id)) {
            u.streak = preservedStreak;
            u.lastActiveDate = today;
            u.last_study_date = today;
            localStorage.setItem('hanzigo_user', JSON.stringify(u));
          }
        }
      } catch {}
    }

    triggerCloudSync(targetUser?.uid || targetUser?.id);
    broadcastGamificationUpdate('STREAK_UPDATED', { streak: preservedStreak, userId: targetUser?.uid || targetUser?.id });

    return { success: true, remaining: current - 1 };
  }
  return { success: false, remaining: 0 };
}

// Backward compatibility alias
export const useStreakFreeze = consumeStreakFreeze;

/**
 * Get 7 days array of the current week (Mon -> Sun) with completion status
 */
export function getWeeklyStudyDays(user = null) {
  const streakStatus = getStreakStatus(user);
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const days = [];
  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayStr = getLocalDateString(now);
  const todayDateMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const maxPastDaysStudied = streakStatus.hasStudiedToday 
    ? Math.max(0, streakStatus.streak - 1)
    : Math.max(0, streakStatus.streak);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = getLocalDateString(d);
    const targetDateMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((todayDateMidnight.getTime() - targetDateMidnight.getTime()) / 86400000);

    const isPast = diffDays > 0;
    const isToday = diffDays === 0;
    const isFuture = diffDays < 0;

    let isStudied = false;
    if (isToday) {
      isStudied = streakStatus.hasStudiedToday;
    } else if (isPast) {
      isStudied = diffDays <= maxPastDaysStudied;
    }

    days.push({
      name: dayNames[i],
      dateNumber: d.getDate(),
      dateStr: dStr,
      isToday,
      isPast,
      isFuture,
      isStudied
    });
  }

  return days;
}

export const LEVEL_SYSTEM = [
  { level: 1, minXp: 0, maxXp: 150, title: 'Tân Thủ (Beginner)', badge: '🌱', hskEquivalent: 'Nhập Môn' },
  { level: 2, minXp: 150, maxXp: 350, title: 'Đồng Môn Nhập Môn', badge: '📘', hskEquivalent: 'HSK 1-' },
  { level: 3, minXp: 350, maxXp: 600, title: 'Người Học Chăm Chỉ', badge: '🔥', hskEquivalent: 'HSK 1' },
  { level: 4, minXp: 600, maxXp: 950, title: 'Học Giả Khởi Động', badge: '⭐', hskEquivalent: 'HSK 1+' },
  { level: 5, minXp: 950, maxXp: 1400, title: 'Kỵ Sĩ Pinyin', badge: '🗣️', hskEquivalent: 'HSK 2-' },
  { level: 6, minXp: 1400, maxXp: 1950, title: 'Thám Hiểm Từ Vựng', badge: '📚', hskEquivalent: 'HSK 2' },
  { level: 7, minXp: 1950, maxXp: 2600, title: 'Cao Đồ Khẩu Ngữ', badge: '💬', hskEquivalent: 'HSK 2+' },
  { level: 8, minXp: 2600, maxXp: 3350, title: 'Kiện Tướng Bút Thuận', badge: '🖌️', hskEquivalent: 'HSK 3-' },
  { level: 9, minXp: 3350, maxXp: 4200, title: 'Chiến Binh Ngữ Pháp', badge: '⚡', hskEquivalent: 'HSK 3' },
  { level: 10, minXp: 4200, maxXp: 5200, title: 'Người Khám Phá Hán Ngữ (Chinese Explorer)', badge: '🧭', hskEquivalent: 'HSK 3+' },
  { level: 11, minXp: 5200, maxXp: 6350, title: 'Cao Thủ Nghe Hiểu', badge: '🎧', hskEquivalent: 'HSK 4-' },
  { level: 12, minXp: 6350, maxXp: 7650, title: 'Độc Giả Hán Tự', badge: '📖', hskEquivalent: 'HSK 4' },
  { level: 13, minXp: 7650, maxXp: 9100, title: 'Tinh Anh Khẩu Ngữ', badge: '🎙️', hskEquivalent: 'HSK 4+' },
  { level: 14, minXp: 9100, maxXp: 10700, title: 'Hiệp Sĩ Hán Ngữ', badge: '🛡️', hskEquivalent: 'HSK 5-' },
  { level: 15, minXp: 10700, maxXp: 12500, title: 'Chuyên Gia Thành Ngữ', badge: '📜', hskEquivalent: 'HSK 5' },
  { level: 16, minXp: 12500, maxXp: 14500, title: 'Bậc Thầy Đối Thoại', badge: '💎', hskEquivalent: 'HSK 5' },
  { level: 17, minXp: 14500, maxXp: 16700, title: 'Học Giả Uyên Bác', badge: '🏛️', hskEquivalent: 'HSK 5+' },
  { level: 18, minXp: 16700, maxXp: 19100, title: 'Thủ Lĩnh Phản Xạ', badge: '🐅', hskEquivalent: 'HSK 5+' },
  { level: 19, minXp: 19100, maxXp: 21800, title: 'Tiên Phong Học Thuật', badge: '🦅', hskEquivalent: 'HSK 6-' },
  { level: 20, minXp: 21800, maxXp: 25000, title: 'Chiến Binh HSK (HSK Challenger)', badge: '⚔️', hskEquivalent: 'HSK 6' },
  { level: 21, minXp: 25000, maxXp: 28500, title: 'Bậc Thầy Dịch Thuật', badge: '🌐', hskEquivalent: 'HSK 6' },
  { level: 22, minXp: 28500, maxXp: 32500, title: 'Thần Bút Thư Pháp', badge: '🖋️', hskEquivalent: 'HSK 6+' },
  { level: 23, minXp: 32500, maxXp: 37000, title: 'Sứ Giả Văn Hóa', badge: '🏮', hskEquivalent: 'HSK 6+' },
  { level: 24, minXp: 37000, maxXp: 42000, title: 'Kình Ngư Ngôn Ngữ', badge: '🌊', hskEquivalent: 'Cao cấp' },
  { level: 25, minXp: 42000, maxXp: 47500, title: 'Bậc Thầy Phản Xạ Siêu Cấp', badge: '⚡', hskEquivalent: 'Cao cấp' },
  { level: 26, minXp: 47500, maxXp: 53500, title: 'Trí Tuệ Đông Phương', badge: '🐉', hskEquivalent: 'Bản ngữ' },
  { level: 27, minXp: 53500, maxXp: 60000, title: 'Huyền Thoại Hán Học', badge: '✨', hskEquivalent: 'Bản ngữ' },
  { level: 28, minXp: 60000, maxXp: 67500, title: 'Đỉnh Cao Tri Thức', badge: '👑', hskEquivalent: 'Bản ngữ' },
  { level: 29, minXp: 67500, maxXp: 76000, title: 'Thái Sơn Bắc Đẩu', badge: '🏔️', hskEquivalent: 'Tông sư' },
  { level: 30, minXp: 76000, maxXp: 999999, title: 'Đại Tông Sư Hán Ngữ (Chinese Polymath)', badge: '🏆', hskEquivalent: 'Vĩnh cửu' }
];

export function getUserLevelInfo(xp) {
  const safeXp = Math.max(0, typeof xp === 'number' ? xp : 0);
  const levels = LEVEL_SYSTEM;

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    if (safeXp < l.maxXp || i === levels.length - 1) {
      const range = l.maxXp - l.minXp;
      const current = Math.max(0, safeXp - l.minXp);
      const percent = Math.min(100, Math.round((current / range) * 100));
      const nextXp = Math.max(0, l.maxXp - safeXp);

      return {
        ...l,
        currentProgressPercent: percent,
        xpToNextLevel: nextXp
      };
    }
  }

  const maxL = levels[levels.length - 1];
  return {
    ...maxL,
    currentProgressPercent: 100,
    xpToNextLevel: 0
  };
}
