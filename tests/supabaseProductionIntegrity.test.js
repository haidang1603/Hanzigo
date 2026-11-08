/**
 * =========================================================================
 * HANZI GO — SUPABASE PRODUCTION INTEGRITY & SECURITY TEST SUITE
 * =========================================================================
 * Phase 23 / Task 23.10: Live Database, Storage, RLS & Application End-to-End Audit
 *
 * Comprehensive verification of:
 * 1. Database table completeness & row count integrity across 13 core tables
 * 2. Referential integrity & foreign keys (zero orphaned rows, zero duplicate IDs)
 * 3. Storage binary integrity:
 *    - Bucket 'materials' configuration (private, 50MB limit)
 *    - All 20 system materials exist as real readable PDF binaries
 *    - Signed URL generation & HTTP 200 download verification
 *    - Direct public URL blocked (HTTP 400/403)
 * 4. RLS Security Matrix:
 *    - Anonymous: Public tables accessible, private tables return 0 rows
 *    - HSK Answer Leakage: hsk_questions blocked; v_hsk_questions_public hides correct_option_index
 *    - Authenticated Student: Own reading_progress isolated; cross-user spoofing blocked; self-role escalation rejected
 *    - Authenticated Teacher: Own classrooms visible; foreign classrooms hidden & modification rejected
 * 5. RPC Security:
 *    - is_admin() and is_teacher() correctly evaluate based on auth context
 * 6. RAG Hybrid Search Quality:
 *    - match_rag_knowledge executes cleanly across Vietnamese, Chinese, Pinyin and 768-dim vector embeddings
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasLiveCredentials = Boolean(url && serviceKey && anonKey);

const serviceClient = hasLiveCredentials
  ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

const anonClient = hasLiveCredentials
  ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

/* =========================================================================
   GROUP 1: DATABASE INTEGRITY & REFERENTIAL VALIDATION
   ========================================================================= */

test('Production Audit: 1.1 Core educational tables have exact expected row counts', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const expectedCounts = {
    learning_levels: 7,
    learning_chapters: 24,
    learning_lessons: 120,
    learning_boss_challenges: 24,
    hanzi_decompositions: 325,
    vocabulary: 804,
    hsk_exams: 27,
    hsk_questions: 417,
    materials: 20,
    daily_quotes: 60,
    rag_knowledge_chunks: 455
  };

  for (const [table, expected] of Object.entries(expectedCounts)) {
    const { count, error } = await serviceClient
      .from(table)
      .select('*', { count: 'exact', head: true });

    assert.ifError(error, `Failed count on ${table}`);
    assert.equal(count, expected, `Table ${table} must contain exactly ${expected} rows, got ${count}`);
  }
});

test('Production Audit: 1.2 Referential integrity has zero orphaned rows', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  // Lessons reference valid chapters
  const { data: chapters } = await serviceClient.from('learning_chapters').select('id');
  const chapterIds = new Set(chapters.map(c => c.id));

  const { data: lessons } = await serviceClient.from('learning_lessons').select('id, chapter_id, level_id');
  assert.equal(lessons.length, 120);
  for (const l of lessons) {
    assert.ok(chapterIds.has(l.chapter_id), `Lesson ${l.id} has invalid chapter_id: ${l.chapter_id}`);
  }

  // Boss challenges reference valid chapters
  const { data: bosses } = await serviceClient.from('learning_boss_challenges').select('id, chapter_id');
  assert.equal(bosses.length, 24);
  for (const b of bosses) {
    assert.ok(chapterIds.has(b.chapter_id), `Boss ${b.id} has invalid chapter_id: ${b.chapter_id}`);
  }

  // HSK questions reference valid exams
  const { data: exams } = await serviceClient.from('hsk_exams').select('id');
  const examIds = new Set(exams.map(e => e.id));

  const { data: questions } = await serviceClient.from('hsk_questions').select('id, exam_id');
  assert.equal(questions.length, 417);
  for (const q of questions) {
    assert.ok(examIds.has(q.exam_id), `Question ${q.id} has invalid exam_id: ${q.exam_id}`);
  }
});

test('Production Audit: 1.3 Zero duplicate primary keys across core tables', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const tables = ['learning_lessons', 'learning_chapters', 'learning_boss_challenges', 'materials', 'hsk_exams'];
  for (const table of tables) {
    const { data } = await serviceClient.from(table).select('id');
    const ids = data.map(r => r.id);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size, `Duplicate primary keys detected in table ${table}`);
  }
});

/* =========================================================================
   GROUP 2: STORAGE BINARY & ACCESS CONTROL VERIFICATION
   ========================================================================= */

test('Production Audit: 2.1 Storage bucket "materials" is configured private with 50MB limit', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const { data: buckets, error } = await serviceClient.storage.listBuckets();
  assert.ifError(error);

  const bucket = buckets.find(b => b.id === 'materials');
  assert.ok(bucket, 'materials bucket must exist');
  assert.equal(bucket.public, false, 'materials bucket must be private');
  assert.equal(bucket.file_size_limit, 52428800, 'materials bucket limit must be 50MB');
});

test('Production Audit: 2.2 All 20 system materials exist as actual binaries and verify via signed URLs', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const { data: materials, error } = await serviceClient
    .from('materials')
    .select('id, storage_bucket, storage_path, file_size_bytes, mime_type, file_name')
    .order('id');

  assert.ifError(error);
  assert.equal(materials.length, 20);

  for (const mat of materials) {
    assert.equal(mat.storage_bucket, 'materials');
    assert.ok(mat.storage_path.startsWith('general/system/mat-'), `Invalid storage path: ${mat.storage_path}`);
    assert.equal(mat.mime_type, 'application/pdf');
    assert.ok(mat.file_size_bytes > 1000, `Material ${mat.id} binary too small: ${mat.file_size_bytes}`);

    // Create signed URL and test live HTTP GET
    const { data: signed, error: signErr } = await serviceClient.storage
      .from('materials')
      .createSignedUrl(mat.storage_path, 60);

    assert.ifError(signErr);
    assert.ok(signed.signedUrl, `Signed URL missing for ${mat.id}`);

    const res = await fetch(signed.signedUrl);
    assert.equal(res.status, 200, `HTTP status for ${mat.id} must be 200`);
    assert.equal(res.headers.get('content-type'), 'application/pdf');

    const buf = await res.arrayBuffer();
    assert.equal(buf.byteLength, mat.file_size_bytes, `Downloaded size mismatch on ${mat.id}`);
  }
});

test('Production Audit: 2.3 Direct public URL to storage binary is blocked (private bucket enforcement)', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const { data } = anonClient.storage.from('materials').getPublicUrl('general/system/mat-1.pdf');
  const res = await fetch(data.publicUrl);
  // Supabase storage returns HTTP 400 when requesting public URL from private bucket
  assert.ok([400, 403, 404].includes(res.status), `Public URL must be rejected with 400/403/404, got ${res.status}`);
});

/* =========================================================================
   GROUP 3: RLS ZERO-TRUST SECURITY MATRIX
   ========================================================================= */

test('Production Audit: 3.1 Anonymous client can read public educational tables', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const publicTables = [
    'learning_levels',
    'learning_chapters',
    'learning_lessons',
    'learning_boss_challenges',
    'hanzi_decompositions',
    'vocabulary',
    'daily_quotes',
    'materials',
    'hsk_exams'
  ];

  for (const table of publicTables) {
    const { data, error } = await anonClient.from(table).select('*').limit(1);
    assert.ifError(error, `Anon read failed on ${table}`);
    assert.ok(data.length > 0, `Anon received 0 rows from public table ${table}`);
  }
});

test('Production Audit: 3.2 HSK Answer Leakage Prevention: hsk_questions is blocked; v_hsk_questions_public hides answers', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  // Direct select on hsk_questions must be rejected
  const { data: qData, error: qErr } = await anonClient.from('hsk_questions').select('id, correct_option_index').limit(1);
  assert.ok(qErr || (qData && qData.length === 0), 'Direct query to hsk_questions must be blocked or return 0 rows');

  // Public view v_hsk_questions_public is readable
  const { data: vData, error: vErr } = await anonClient.from('v_hsk_questions_public').select('*').limit(3);
  assert.ifError(vErr);
  assert.ok(vData.length > 0);

  // View MUST NOT contain correct_option_index or correct_answer
  for (const row of vData) {
    assert.equal(row.correct_option_index, undefined, 'correct_option_index leaked in public view!');
    assert.equal(row.correct_answer, undefined, 'correct_answer leaked in public view!');
    assert.ok(row.prompt || row.options, 'Public view must contain exam prompt and options');
  }
});

test('Production Audit: 3.3 Private user tables return 0 rows to anonymous users', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const privateTables = [
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
    const { data } = await anonClient.from(table).select('*').limit(5);
    // Should either produce error or return 0 rows
    const count = data ? data.length : 0;
    assert.equal(count, 0, `Private table ${table} leaked ${count} rows to anon!`);
  }
});

test('Production Audit: 3.4 Authenticated Student: reading_progress is isolated and spoofing is blocked', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  // Generate session for student
  const { data: linkData } = await serviceClient.auth.admin.generateLink({
    type: 'magiclink',
    email: 'gsun2906@gmail.com'
  });
  assert.ok(linkData?.properties?.hashed_token);

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: sess } = await authClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink'
  });
  assert.ok(sess?.session?.access_token);

  const studentClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${sess.session.access_token}` } }
  });

  const studentId = sess.user.id;

  // Insert valid progress for self
  const payload = {
    user_id: studentId,
    material_id: 'mat-test-audit',
    title: 'Audit Test Material',
    current_page: 3,
    total_pages: 30,
    progress_percent: 10
  };

  const { error: insErr } = await studentClient
    .from('reading_progress')
    .upsert([payload], { onConflict: 'user_id,material_id' });
  assert.ifError(insErr, 'Student should be allowed to save own progress');

  // Student can read own progress
  const { data: myData } = await studentClient
    .from('reading_progress')
    .select('*')
    .eq('material_id', 'mat-test-audit');
  assert.equal(myData.length, 1);
  assert.equal(myData[0].current_page, 3);

  // Anonymous cannot read it
  const { data: anonView } = await anonClient
    .from('reading_progress')
    .select('*')
    .eq('material_id', 'mat-test-audit');
  assert.equal(anonView.length, 0);

  // Cross-user spoofing: student tries to insert for another user
  const otherUserId = '4ddef8f9-5149-45e7-8380-1689576468c8';
  const { error: spoofErr } = await studentClient
    .from('reading_progress')
    .upsert([{ ...payload, user_id: otherUserId }], { onConflict: 'user_id,material_id' });
  assert.ok(spoofErr, 'Cross-user spoofing must be rejected by RLS');

  // Prevent self-role escalation
  const { error: escErr } = await studentClient
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', studentId);
  assert.ok(escErr, 'Self-role escalation must be rejected');

  // Cleanup
  await studentClient.from('reading_progress').delete().eq('material_id', 'mat-test-audit');
});

test('Production Audit: 3.5 Authenticated Teacher: Cross-classroom modification is strictly blocked', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const { data: linkData } = await serviceClient.auth.admin.generateLink({
    type: 'magiclink',
    email: 'lam128608@gmail.com'
  });
  assert.ok(linkData?.properties?.hashed_token);

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: sess } = await authClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink'
  });

  const teacherClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${sess.session.access_token}` } }
  });

  // Query classrooms - teacher only sees classrooms they own
  const { data: myClasses } = await teacherClient.from('classrooms').select('id, teacher_id');
  assert.ok(myClasses.length >= 1);
  for (const c of myClasses) {
    assert.equal(c.teacher_id, sess.user.id, 'Teacher can only see classrooms they own');
  }

  // Teacher cannot modify another teacher's classroom
  const foreignClassId = 'bcd3f89d-9d86-4ce1-8bf7-f25572522e6f';
  const { data: updateRes } = await teacherClient
    .from('classrooms')
    .update({ name: 'Tampered By Foreign Teacher' })
    .eq('id', foreignClassId)
    .select();

  assert.equal(updateRes.length, 0, 'Cross-classroom modification must affect 0 rows');
});

/* =========================================================================
   GROUP 4: RPC & SECURITY DEFINER FUNCTIONS
   ========================================================================= */

test('Production Audit: 4.1 RPC functions is_admin() and is_teacher() evaluate accurately', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  // Anonymous: both false
  const { data: anonAdmin } = await anonClient.rpc('is_admin');
  const { data: anonTeacher } = await anonClient.rpc('is_teacher');
  assert.equal(anonAdmin, false);
  assert.equal(anonTeacher, false);

  // Teacher context
  const { data: linkTeach } = await serviceClient.auth.admin.generateLink({ type: 'magiclink', email: 'lam128608@gmail.com' });
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: sessTeach } = await authClient.auth.verifyOtp({ token_hash: linkTeach.properties.hashed_token, type: 'magiclink' });
  const teacherClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${sessTeach.session.access_token}` } }
  });

  const { data: teachIsAdmin } = await teacherClient.rpc('is_admin');
  const { data: teachIsTeacher } = await teacherClient.rpc('is_teacher');
  assert.equal(teachIsAdmin, false);
  assert.equal(teachIsTeacher, true);
});

/* =========================================================================
   GROUP 5: RAG HYBRID SEARCH VERIFICATION
   ========================================================================= */

test('Production Audit: 5.1 RAG Knowledge match_rag_knowledge executes hybrid retrieval cleanly', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  // Lexical query (Vietnamese & Chinese)
  const { data: viData, error: viErr } = await anonClient.rpc('match_rag_knowledge', {
    query_text: 'xin chào',
    match_count: 3
  });
  assert.ifError(viErr);
  assert.ok(viData.length > 0, 'RAG should recall chunks for "xin chào"');
  assert.ok(viData[0].simplified === '你好' || viData[0].pinyin.includes('hǎo'));

  const { data: zhData, error: zhErr } = await anonClient.rpc('match_rag_knowledge', {
    query_text: '老师',
    match_count: 3
  });
  assert.ifError(zhErr);
  assert.ok(zhData.length > 0, 'RAG should recall chunks for "老师"');

  // Vector query (768-dim)
  const { data: chunk } = await serviceClient
    .from('rag_knowledge_chunks')
    .select('embedding')
    .not('embedding', 'is', null)
    .limit(1);

  if (chunk && chunk[0]?.embedding) {
    const { data: vecData, error: vecErr } = await anonClient.rpc('match_rag_knowledge', {
      query_embedding: chunk[0].embedding,
      match_count: 3
    });
    assert.ifError(vecErr);
    assert.ok(vecData.length > 0, 'Vector search should return nearest chunks');
    assert.ok(vecData[0].similarity_score >= 0.99, 'Self-similarity score must be close to 1.0');
  }
});
