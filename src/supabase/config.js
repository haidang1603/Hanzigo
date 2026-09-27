import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key, fallback) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) {
      return import.meta.env[key];
    }
    if (typeof process !== 'undefined' && process?.env?.[key]) {
      return process.env[key];
    }
  } catch {
    // fallback
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://woszblniatdvijwdkmpm.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc3pibG5pYXRkdmlqd2RrbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzEwMTcsImV4cCI6MjEwNjA0NzAxN30.qpSGtdIgGG55MXsLJGbMS3KOLz6W_ZsC16r-6XixMXY');

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
