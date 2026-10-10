import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

/**
 * Fetch User Profile by UUID
 */
export async function getUserProfile(uid) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(uid)) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Could not fetch user profile:', err);
    return null;
  }
}

/**
 * Check if a user has Admin role verified on the server/DB
 */
export async function checkUserIsAdmin(uid) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(uid)) return false;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', uid)
      .maybeSingle();

    if (error || !data) return false;
    return data.role === 'admin' && data.status === 'active';
  } catch {
    return false;
  }
}

/**
 * Update Profile Information (Name, Avatar, Bio, Level)
 * Note: Role & status cannot be escalated by users due to RLS and DB trigger.
 */
export async function updateUserProfile(uid, profileData) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(uid)) return null;

  try {
    const payload = {
      updated_at: new Date().toISOString()
    };
    if (profileData.name !== undefined) payload.name = profileData.name;
    if (profileData.avatar !== undefined) payload.avatar = profileData.avatar;
    if (profileData.bio !== undefined) payload.bio = profileData.bio;
    if (profileData.level !== undefined) payload.level = profileData.level;
    if (profileData.xp !== undefined && typeof profileData.xp === 'number') payload.xp = profileData.xp;
    if (profileData.streak !== undefined && typeof profileData.streak === 'number') payload.streak = profileData.streak;
    if (profileData.words_learned !== undefined && typeof profileData.words_learned === 'number') payload.words_learned = profileData.words_learned;
    if (profileData.last_study_date !== undefined) payload.last_study_date = profileData.last_study_date;
    if (profileData.longest_streak !== undefined && typeof profileData.longest_streak === 'number') payload.longest_streak = profileData.longest_streak;

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', uid)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase updateUserProfile error:', error);
      throw error;
    }

    // Also update auth user metadata if possible
    try {
      await supabase.auth.updateUser({
        data: {
          display_name: profileData.name,
          avatar_url: profileData.avatar,
          level: profileData.level
        }
      });
    } catch {
      // non-critical
    }

    return data;
  } catch (err) {
    console.error('Failed to update profile in Supabase:', err);
    return null;
  }
}

/**
 * Save / Update User Progress (XP, Streak, Words learned)
 */
export async function saveUserProgress(uid, progressData) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(uid)) return;

  try {
    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    if (progressData.xp !== undefined) updatePayload.xp = progressData.xp;
    if (progressData.streak !== undefined) updatePayload.streak = progressData.streak;
    if (progressData.wordsLearned !== undefined) updatePayload.words_learned = progressData.wordsLearned;
    if (progressData.level !== undefined) updatePayload.level = progressData.level;
    if (progressData.last_study_date !== undefined) updatePayload.last_study_date = progressData.last_study_date;
    if (progressData.longestStreak !== undefined) updatePayload.longest_streak = progressData.longestStreak;

    await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', uid);
  } catch (err) {
    console.error('Failed to sync progress to Supabase:', err);
  }
}
