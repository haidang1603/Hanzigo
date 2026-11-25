import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key, fallback) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) {
      return String(import.meta.env[key]).trim();
    }
    if (typeof process !== 'undefined' && process?.env?.[key]) {
      return String(process.env[key]).trim();
    }
  } catch {
    // fallback
  }
  return fallback;
};

const isNodeTestEnv =
  typeof process !== 'undefined' &&
  Boolean(process?.env?.NODE_TEST_CONTEXT) &&
  process?.env?.HANZIGO_LIVE_CLIENT_SUPABASE !== 'true';

const supabaseUrl = isNodeTestEnv ? '' : getEnvVar('VITE_SUPABASE_URL', '');
const supabaseAnonKey = isNodeTestEnv ? '' : getEnvVar('VITE_SUPABASE_ANON_KEY', '');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.includes('supabase.co')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
  : null;

if (isSupabaseConfigured) {
  console.log('⚡ Supabase HanziGo initialized successfully: Project URL', supabaseUrl);
} else {
  console.warn('⚠️ Supabase credentials missing. Running in local simulation mode.');
}

/**
 * Lấy Bearer Token và User ID của người dùng hiện tại cho các lời gọi API backend.
 */
export async function getClientAuthHeaders(user = null) {
  let authToken = user?.token || user?.access_token || '';
  let authUid = user?.uid || user?.id || '';

  if (isSupabaseConfigured && supabase?.auth) {
    try {
      const { data: { session } = {} } = await supabase.auth.getSession();
      if (session?.access_token) {
        authToken = session.access_token;
      }
      if (session?.user?.id) {
        authUid = session.user.id;
      }
    } catch {}
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const rawUser = localStorage.getItem('hanzigo_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (!authUid) authUid = u.uid || u.id || '';
        if (!authToken) authToken = u.token || u.access_token || '';
      }
    }
  } catch {}

  if (!authUid && typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    authUid = 'dev_student_user';
  }

  return {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(authUid ? { 'x-user-id': authUid } : {}),
  };
}
