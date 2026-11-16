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
