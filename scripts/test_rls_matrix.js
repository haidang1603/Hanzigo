import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runAnonTests() {
  console.log('=== TESTING ANONYMOUS CLIENT ===');
  
  // 1. Public Tables (Should succeed with > 0 rows)
  const publicTables = [
    'learning_levels',
    'learning_chapters',
    'learning_lessons',
    'learning_boss_challenges',
    'hanzi_decompositions',
    'vocabulary',
    'daily_quotes',
    'materials',
    'hsk_exams',
    'hsk_exam_structures',
    'v_hsk_questions_public'
  ];

  for (const table of publicTables) {
    const { data, error } = await anonClient.from(table).select('*').limit(3);
    if (error) {
      console.log(`  ❌ ${table}: ERROR - ${error.message}`);
    } else {
      console.log(`  ✅ ${table}: SUCCESS (${data.length} rows returned)`);
    }
  }

  // 2. Private Tables (Should FAIL or return 0 rows for anonymous)
  const privateTables = [
    'profiles',
    'reading_progress',
    'audit_logs',
    'session_participants',
    'class_materials',
    'classrooms',
    'class_members',
    'user_journey_progress',
    'user_lesson_progress'
  ];

  for (const table of privateTables) {
    const { data, error } = await anonClient.from(table).select('*').limit(3);
    if (error) {
      console.log(`  🔒 ${table}: BLOCKED - ${error.message}`);
    } else if (data.length === 0) {
      console.log(`  🔒 ${table}: PROTECTED (0 rows visible to anon)`);
    } else {
      console.log(`  ⚠️ ${table}: LEAKED ${data.length} rows to anon!`);
    }
  }

  // 3. HSK Answer Leakage Test
  console.log('\n=== TESTING HSK ANSWER LEAKAGE ===');
  const { data: qAnon, error: qErr } = await anonClient.from('hsk_questions').select('id, correct_option_index').limit(3);
  if (qErr) {
    console.log(`  🔒 direct hsk_questions SELECT blocked: ${qErr.message}`);
  } else if (qAnon.length === 0) {
    console.log(`  🔒 direct hsk_questions SELECT returns 0 rows to anon`);
  } else {
    console.log(`  ⚠️ direct hsk_questions SELECT returned rows to anon! Sample:`, qAnon[0]);
  }

  // Check public view v_hsk_questions_public
  const { data: vAnon, error: vErr } = await anonClient.from('v_hsk_questions_public').select('*').limit(1);
  if (vErr) {
    console.log(`  ❌ v_hsk_questions_public error: ${vErr.message}`);
  } else if (vAnon && vAnon.length > 0) {
    const cols = Object.keys(vAnon[0]);
    const hasAnswer = cols.includes('correct_option_index') || cols.includes('correct_answer');
    console.log(`  ✅ v_hsk_questions_public readable by anon. Columns:`, cols.join(', '));
    console.log(`  ${hasAnswer ? '❌ ANSWER EXPOSED IN VIEW!' : '✅ ZERO ANSWER LEAKAGE: Answers omitted from public view'}`);
  }
}

runAnonTests();

