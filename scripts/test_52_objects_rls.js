import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const serviceClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anonClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const expiredClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.invalid' } }
});

async function getAuthClient(email) {
  const { data: link } = await serviceClient.auth.admin.generateLink({ type: 'magiclink', email });
  const fresh = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: sess } = await fresh.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'magiclink' });
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${sess.session.access_token}` } }
  });
}

// 51 tables + 1 view from live audit
const objects = [
  { name: 'ai_conversations', type: 'TABLE' },
  { name: 'ai_messages', type: 'TABLE' },
  { name: 'assignment_submissions', type: 'TABLE' },
  { name: 'assignments', type: 'TABLE' },
  { name: 'audio-cache', type: 'TABLE' },
  { name: 'audio_cache_logs', type: 'TABLE' },
  { name: 'audit_logs', type: 'TABLE' },
  { name: 'class_announcements', type: 'TABLE' },
  { name: 'class_materials', type: 'TABLE' },
  { name: 'class_members', type: 'TABLE' },
  { name: 'class_sessions', type: 'TABLE' },
  { name: 'classrooms', type: 'TABLE' },
  { name: 'community_posts', type: 'TABLE' },
  { name: 'daily_quotes', type: 'TABLE' },
  { name: 'dictionary_entries', type: 'TABLE' },
  { name: 'hanzi_decompositions', type: 'TABLE' },
  { name: 'hsk_attempts', type: 'TABLE' },
  { name: 'hsk_exam_structures', type: 'TABLE' },
  { name: 'hsk_exams', type: 'TABLE' },
  { name: 'hsk_mistakes', type: 'TABLE' },
  { name: 'hsk_questions', type: 'TABLE' }, // RAW TABLE - SENSITIVE
  { name: 'hsk_reports', type: 'TABLE' },
  { name: 'hsk_resources', type: 'TABLE' },
  { name: 'issued_certificates', type: 'TABLE' },
  { name: 'learning_boss_challenges', type: 'TABLE' },
  { name: 'learning_chapters', type: 'TABLE' },
  { name: 'learning_lessons', type: 'TABLE' },
  { name: 'learning_levels', type: 'TABLE' },
  { name: 'lessons', type: 'TABLE' },
  { name: 'materials', type: 'TABLE' },
  { name: 'newsletter_subscribers', type: 'TABLE' },
  { name: 'profiles', type: 'TABLE' },
  { name: 'pronunciation_items', type: 'TABLE' },
  { name: 'rag_ingestion_audit_logs', type: 'TABLE' },
  { name: 'rag_knowledge_chunks', type: 'TABLE' },
  { name: 'rag_knowledge_sources', type: 'TABLE' },
  { name: 'reading_progress', type: 'TABLE' },
  { name: 'session_chat_messages', type: 'TABLE' },
  { name: 'session_participants', type: 'TABLE' },
  { name: 'srs_review_logs', type: 'TABLE' },
  { name: 'study_partners', type: 'TABLE' },
  { name: 'user_daily_missions', type: 'TABLE' },
  { name: 'user_journey_progress', type: 'TABLE' },
  { name: 'user_lesson_progress', type: 'TABLE' },
  { name: 'user_saved_materials', type: 'TABLE' },
  { name: 'user_skill_mastery', type: 'TABLE' },
  { name: 'user_srs_cards', type: 'TABLE' },
  { name: 'user_study_logs', type: 'TABLE' },
  { name: 'user_vocab_srs', type: 'TABLE' },
  { name: 'v_hsk_questions_public', type: 'VIEW' },
  { name: 'vocabulary', type: 'TABLE' },
  { name: 'writing_characters', type: 'TABLE' }
];

async function run() {
  console.log('Authenticating student, teacher, admin...');
  const studentClient = await getAuthClient('gsun2906@gmail.com');
  const teacherClient = await getAuthClient('lam128608@gmail.com');
  const adminClient = await getAuthClient('lehaidang16032006@gmail.com');

  const clients = {
    anon: anonClient,
    student: studentClient,
    teacher: teacherClient,
    admin: adminClient,
    expired: expiredClient
  };

  const results = [];

  for (const obj of objects) {
    const row = { name: obj.name, type: obj.type };
    for (const [role, client] of Object.entries(clients)) {
      try {
        const { data, error, status } = await client.from(obj.name).select('*').limit(1);
        if (error) {
          row[role] = `DENIED (${error.code || status})`;
        } else {
          row[role] = `ALLOW (${data?.length ?? 0}r)`;
        }
      } catch (err) {
        row[role] = `ERR (${err.message})`;
      }
    }
    results.push(row);
  }

  console.log(`Audited ${results.length} database objects across 5 personas:`);
  console.table(results);
}

run().catch(console.error);

