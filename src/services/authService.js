import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function isValidUuid(id) {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

/**
 * Register a new user with Email, Password, Name, and initial Level
 */
export async function registerWithEmail(email, password, name, level = 'HSK 1 - Sơ cấp') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Vui lòng thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
        level: level
      }
    }
  });

  if (error) throw error;

  const user = data.user;
  const initialData = {
    uid: user?.id,
    id: user?.id,
    name: name,
    email: email,
    level: level,
    role: 'student',
    streak: 0,
    xp: 0,
    wordsLearned: 0
  };

  // Upsert profile in `profiles` table
  if (user?.id) {
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: email,
        name: name,
        level: level,
        role: 'student',
        streak: 0,
        xp: 0,
        words_learned: 0,
        updated_at: new Date().toISOString()
      });
    } catch (dbErr) {
      console.warn('Supabase profile creation notice:', dbErr);
    }
  }

  return initialData;
}

/**
 * Login with Email and Password
 */
export async function loginWithEmail(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Vui lòng thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  const user = data.user;

  // Fetch verified profile from `profiles`
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      return {
        uid: user.id,
        id: user.id,
        name: profile.name || user.user_metadata?.display_name || email.split('@')[0],
        email: profile.email || user.email,
        level: profile.level || 'HSK 1 - Sơ cấp',
        avatar: profile.avatar || null,
        role: profile.role || 'student',
        status: profile.status || 'active',
        streak: profile.streak || 0,
        xp: profile.xp || 0,
        wordsLearned: profile.words_learned || 0
      };
    }
  } catch (err) {
    console.warn('Supabase profile read notice:', err);
  }

  return {
    uid: user.id,
    id: user.id,
    name: user.user_metadata?.display_name || email.split('@')[0],
    email: user.email,
    level: user.user_metadata?.level || 'HSK 1 - Sơ cấp',
    role: 'student',
    status: 'active',
    streak: 0,
    xp: 0,
    wordsLearned: 0
  };
}

/**
 * Login with Google OAuth (Real Supabase OAuth Flow)
 */
export async function loginWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Vui lòng thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account'
      }
    }
  });

  if (error) throw error;

  if (data?.url) {
    window.location.href = data.url;
    return data;
  }

  return data;
}

/**
 * Sign out from Supabase Auth
 */
export async function logoutUser() {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase logout notice:', err);
    }
  }
}

/**
 * Get current session user
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch {
    return null;
  }
}
