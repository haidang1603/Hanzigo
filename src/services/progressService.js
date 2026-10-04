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
export async function triggerCloudSync(uid = null) {
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

    // Sync high-level stats to `profiles`
    await supabase.from('profiles').update({
      words_learned: rememberedWords.length,
      updated_at: new Date().toISOString()
    }).eq('id', targetUid);

    console.log('⚡ HanziGo Progress synced to Cloud DB for user', targetUid);
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
