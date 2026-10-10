import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

/**
 * Record a study activity in normalized DB table (audit log & anti-abuse)
 */
export async function recordStudyLog(uid, activityType, itemRef = '', xpAwarded = 0) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(uid)) return;

  try {
    await supabase.from('user_study_logs').insert([{
      user_id: uid,
      activity_type: activityType,
      item_ref: itemRef,
      xp_awarded: xpAwarded
    }]);
  } catch (err) {
    console.warn('Could not record study log:', err);
  }
}

/**
 * Trigger Cloud Sync: Syncs user progress to Supabase
 * Synchronizes both normalized tables and profile statistics
 */
export async function triggerCloudSync(uid = null, explicitXp = null) {
  if (!isSupabaseConfigured || !supabase) return;

  let targetUid = uid;
  if (!targetUid) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const u = JSON.parse(saved);
        targetUid = u?.uid || u?.id;
      }
    } catch {
      targetUid = null;
    }
  }

  if (!targetUid || !isValidUuid(targetUid)) return;

  // Load user object from localStorage for profile fields (name, avatar, level, etc.)
  let targetUser = null;
  try {
    const saved = localStorage.getItem('hanzigo_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u && (u.uid === targetUid || u.id === targetUid)) {
        targetUser = u;
      }
    }
  } catch {}

  try {
    const rawRemembered = localStorage.getItem('hanzigo_vocab_remembered');
    const rememberedWords = rawRemembered ? JSON.parse(rawRemembered) : [];
    
    const rawCompletedLessons = localStorage.getItem('hanzigo_completed_lessons');
    const completedLessons = rawCompletedLessons ? JSON.parse(rawCompletedLessons) : [];

    // Sync lesson progress to normalized table
    if (Array.isArray(completedLessons) && completedLessons.length > 0) {
      const lessonRows = completedLessons.map(lId => ({
        user_id: targetUid,
        lesson_id: String(lId),
        score: 100,
        xp_earned: 50
      }));
      try {
        await supabase
          .from('user_lesson_progress')
          .upsert(lessonRows, { onConflict: 'user_id,lesson_id' });
      } catch (lErr) {
        console.warn('Lesson progress sync notice:', lErr);
      }
    }

    // Check streak and last study date
    let streakVal = null;
    try {
      const rawStreak = localStorage.getItem(`hanzigo_streak_count_${targetUid}`) || localStorage.getItem('hanzigo_streak_count');
      if (rawStreak !== null && rawStreak !== undefined) {
        streakVal = parseInt(rawStreak, 10);
      }
    } catch {}

    let lastStudyDateVal = null;
    try {
      lastStudyDateVal = localStorage.getItem(`hanzigo_last_study_date_${targetUid}`) || localStorage.getItem('hanzigo_last_study_date') || targetUser?.last_study_date;
    } catch {}

    // Calculate or resolve authentic XP
    let finalXp = explicitXp;
    if (typeof finalXp !== 'number' || isNaN(finalXp)) {
      if (typeof targetUser?.xp === 'number' && !isNaN(targetUser.xp)) {
        finalXp = targetUser.xp;
      } else {
        // Fallback from activity weights
        const bonus = parseInt(localStorage.getItem(`hanzigo_bonus_xp_${targetUid}`) || '0', 10) || 0;
        finalXp = (completedLessons.length * 50) + (rememberedWords.length * 10) + bonus;
      }
    }

    // Sync high-level stats to `profiles` in Supabase
    const profileUpdate = {
      words_learned: rememberedWords.length,
      xp: finalXp,
      updated_at: new Date().toISOString()
    };
    if (typeof streakVal === 'number' && !isNaN(streakVal)) {
      profileUpdate.streak = streakVal;
    }
    if (lastStudyDateVal) {
      profileUpdate.last_study_date = lastStudyDateVal;
    }
    if (targetUser?.level) profileUpdate.level = targetUser.level;
    if (targetUser?.avatar) profileUpdate.avatar = targetUser.avatar;
    if (targetUser?.name) profileUpdate.name = targetUser.name;

    await supabase.from('profiles').update(profileUpdate).eq('id', targetUid);

    // Also persist in local shared roster cache for multi-account testing
    try {
      const rawCache = localStorage.getItem('hanzigo_shared_profiles_cache');
      const cache = rawCache ? JSON.parse(rawCache) : {};
      cache[targetUid] = {
        id: targetUid,
        name: targetUser?.name || 'Học viên',
        email: targetUser?.email || '',
        avatar: targetUser?.avatar || null,
        level: targetUser?.level || 'HSK 1 - Sơ cấp',
        xp: finalXp,
        streak: streakVal ?? 1,
        wordsLearned: rememberedWords.length,
        role: targetUser?.role || 'student',
        status: 'active'
      };
      localStorage.setItem('hanzigo_shared_profiles_cache', JSON.stringify(cache));
    } catch {}

    console.log('⚡ HanziGo Progress & XP synced to Cloud DB for user', targetUid, finalXp);
  } catch (err) {
    console.warn('⚠️ HanziGo Supabase DB Sync notice:', err);
  }
}

/**
 * Hydrate and restore user learning progress from Supabase DB into localStorage
 */
export async function loadAllUserDataFromDb(uid) {
  if (!isSupabaseConfigured || !supabase || !uid || !isValidUuid(uid)) return null;

  try {
    // 1. Load user profile stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (profile) {
      if (typeof profile.streak === 'number') {
        localStorage.setItem(`hanzigo_streak_count_${uid}`, String(profile.streak));
        localStorage.setItem('hanzigo_streak_count', String(profile.streak));
      }
      if (profile.last_study_date) {
        localStorage.setItem(`hanzigo_last_study_date_${uid}`, String(profile.last_study_date));
        localStorage.setItem('hanzigo_last_study_date', String(profile.last_study_date));
      }
      if (typeof profile.longest_streak === 'number') {
        localStorage.setItem(`hanzigo_longest_streak_${uid}`, String(profile.longest_streak));
      }
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        try {
          const u = JSON.parse(saved);
          if (u && (u.uid === uid || u.id === uid)) {
            if (typeof profile.xp === 'number') u.xp = profile.xp;
            if (typeof profile.streak === 'number') u.streak = profile.streak;
            if (profile.level) u.level = profile.level;
            if (typeof profile.words_learned === 'number') u.wordsLearned = profile.words_learned;
            if (profile.last_study_date) u.last_study_date = profile.last_study_date;
            localStorage.setItem('hanzigo_user', JSON.stringify(u));
          }
        } catch {}
      }
    }

    // 2. Load completed lessons
    const { data: lessons } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', uid);

    if (lessons && lessons.length > 0) {
      const lessonIds = lessons.map(l => l.lesson_id);
      localStorage.setItem('hanzigo_completed_lessons', JSON.stringify(lessonIds));
    }

    // 3. Load SRS vocabulary progress
    const { data: vocabList } = await supabase
      .from('user_vocab_srs')
      .select('*')
      .eq('user_id', uid);

    if (vocabList && vocabList.length > 0) {
      const remembered = vocabList.filter(v => v.stage >= 2).map(v => v.hanzi);
      const review = vocabList.filter(v => v.stage === 1).map(v => v.hanzi);
      if (remembered.length > 0) {
        localStorage.setItem('hanzigo_vocab_remembered', JSON.stringify(remembered));
      }
      if (review.length > 0) {
        localStorage.setItem('hanzigo_vocab_review', JSON.stringify(review));
      }
    }

    console.log('⚡ HanziGo Progress hydrated from Supabase for user', uid);
    return { profile, lessons, vocabList };
  } catch (err) {
    console.warn('⚠️ Could not load user data from Supabase:', err);
    return null;
  }
}
