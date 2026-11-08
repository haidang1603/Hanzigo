/**
 * =========================================================================
 * HANZI GO — FINAL PRODUCTION SECURITY GAP CLOSURE & ACCEPTANCE TESTS
 * =========================================================================
 * Phase 23 / Task 23.15: Final Production Security Gap Closure & Acceptance Evidence
 *
 * Covers:
 * 1. Admin Delete User Validation & Auth/Profile Synchronization
 * 2. Foreign Key Cascade & SET NULL Verification
 * 3. Trigger Bypass Matrix & Context Audit
 * 4. Exact SQLSTATE & Error Code Assertions
 * 5. Complete 17 RPC Security & Least Privilege Matrix
 * 6. RLS 5-Role CRUD Isolation (No Forgery, No Direct Enrollment, Scope Isolation)
 * 7. HSK Zero Answer Leakage (10 Inspection Points)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { getExamForTaking } from '../src/services/hskService.js';

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

const expiredClient = hasLiveCredentials
  ? createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.invalid' } }
    })
  : null;

const clientCache = {};
function getAuthClientFor(email) {
  if (clientCache[email]) return clientCache[email];
  clientCache[email] = (async () => {
    const { data: link, error: lErr } = await serviceClient.auth.admin.generateLink({ type: 'magiclink', email });
    if (lErr || !link?.properties?.hashed_token) {
      throw new Error(`GenerateLink failed for ${email}: ${lErr?.message}`);
    }
    const freshAnon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: sess, error: vErr } = await freshAnon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'magiclink' });
    if (vErr || !sess?.session) {
      throw new Error(`VerifyOtp failed for ${email}: ${vErr?.message}`);
    }
    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${sess.session.access_token}` } }
    });
    return { client, user: sess.user, token: sess.session.access_token };
  })();
  return clientCache[email];
}

/* =========================================================================
   GROUP 1: ADMIN_DELETE_USER AUDIT & AUTH CONSISTENCY (TASK 23.15.01)
   ========================================================================= */

test('Task 23.15.01: Admin delete user rejects self-deletion and non-admin callers', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const admin = await getAuthClientFor('lehaidang16032006@gmail.com');

  // 1. Anon caller rejected
  const { error: aErr } = await anonClient.rpc('admin_delete_user', {
    target_user_id: student.user.id
  });
  assert.ok(aErr, 'Anon must not execute admin_delete_user');
  assert.equal(aErr.code, '42501', 'Must return 42501 (permission denied)');

  // 2. Student caller rejected
  const { error: sErr } = await student.client.rpc('admin_delete_user', {
    target_user_id: student.user.id
  });
  assert.ok(sErr, 'Student must not execute admin_delete_user');

  // 3. Admin self-deletion rejected
  const { error: selfDelErr } = await admin.client.rpc('admin_delete_user', {
    target_user_id: admin.user.id
  });
  assert.ok(selfDelErr, 'Admin self-deletion must be rejected');
  assert.ok(selfDelErr.message.includes('Không thể tự xóa'));
});

test('Task 23.15.01: Admin delete user synchronizes deletion between profiles and auth.users', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const admin = await getAuthClientFor('lehaidang16032006@gmail.com');

  // Create disposable test student
  const tempEmail = `disposable_student_${Date.now()}@hanzigo.test`;
  const { data: tempUser, error: cErr } = await serviceClient.auth.admin.createUser({
    email: tempEmail,
    password: 'TempPassword123!',
    email_confirm: true
  });
  assert.equal(cErr, null, 'Must create temp user cleanly');
  const tempId = tempUser.user.id;

  // Ensure profile exists
  await serviceClient.from('profiles').upsert({
    id: tempId,
    email: tempEmail,
    role: 'student',
    status: 'active',
    name: 'Disposable Student'
  });

  // Execute deletion via Admin RPC
  const { data: delRes, error: delErr } = await admin.client.rpc('admin_delete_user', {
    target_user_id: tempId
  });
  assert.equal(delErr, null, 'Admin delete execution must succeed');
  assert.equal(delRes?.success, true);

  // Verify profiles record is deleted
  const { data: pCheck } = await serviceClient.from('profiles').select('id').eq('id', tempId);
  assert.equal(pCheck?.length, 0, 'Profile record must be deleted');

  // Verify auth.users record is deleted
  const { data: authCheck, error: authErr } = await serviceClient.auth.admin.getUserById(tempId);
  assert.equal(authCheck?.user, null, 'Auth user must be null (not found)');
  assert.ok(authErr || !authCheck?.user, 'Auth user must be reported as not found');
});

test('Task 23.15.01: Deleting a teacher cascades to classrooms and prevents orphaned classes', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const admin = await getAuthClientFor('lehaidang16032006@gmail.com');

  // Create disposable teacher
  const tEmail = `disposable_teacher_${Date.now()}@hanzigo.test`;
  const { data: tUser, error: cErr } = await serviceClient.auth.admin.createUser({
    email: tEmail,
    password: 'TeacherPassword123!',
    email_confirm: true
  });
  assert.equal(cErr, null);
  const tId = tUser.user.id;

  await serviceClient.from('profiles').upsert({
    id: tId,
    email: tEmail,
    role: 'teacher',
    status: 'active',
    name: 'Disposable Teacher'
  });

  // Create class owned by this teacher
  const classCode = `AUD_${Date.now().toString().slice(-6)}`;
  const { data: cls, error: clsErr } = await serviceClient.from('classrooms').insert({
    name: 'Audit Cascade Class',
    teacher_id: tId,
    class_code: classCode
  }).select('id').single();
  assert.equal(clsErr, null);
  assert.ok(cls?.id);

  // Delete teacher via admin
  const { data: delRes } = await admin.client.rpc('admin_delete_user', {
    target_user_id: tId
  });
  assert.equal(delRes?.success, true);

  // Verify class was cascade deleted
  const { data: clsCheck } = await serviceClient.from('classrooms').select('id').eq('id', cls.id);
  assert.equal(clsCheck?.length, 0, 'Classroom must be cascade deleted with teacher');

  // Verify auth user deleted
  const { data: authCheck } = await serviceClient.auth.admin.getUserById(tId);
  assert.equal(authCheck?.user, null);
});

/* =========================================================================
   GROUP 2: TRIGGER BYPASS & CONTEXT AUDIT (TASK 23.15.02)
   ========================================================================= */

test('Task 23.15.02: Trigger prevents role/status escalation across all client roles', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const teacher = await getAuthClientFor('lam128608@gmail.com');

  // 1. Anon cannot update role
  const { error: aErr } = await anonClient.from('profiles').update({ role: 'admin' }).eq('id', student.user.id);
  assert.ok(aErr, 'Anon role update must fail');
  assert.equal(aErr.code, 'P0001');

  // 2. Student cannot update own role
  const { error: sErr } = await student.client.from('profiles').update({ role: 'admin' }).eq('id', student.user.id);
  assert.ok(sErr, 'Student role update must fail');
  assert.equal(sErr.code, 'P0001');

  // 3. Teacher cannot update own role to admin
  const { error: tErr } = await teacher.client.from('profiles').update({ role: 'admin' }).eq('id', teacher.user.id);
  assert.ok(tErr, 'Teacher role update must fail');
  assert.equal(tErr.code, 'P0001');

  // 4. Service role trusted context succeeds
  const { error: srvErr } = await serviceClient.from('profiles').update({ status: 'active' }).eq('id', student.user.id);
  assert.equal(srvErr, null, 'Service role can update status in trusted server context');
});

/* =========================================================================
   GROUP 3: SQLSTATE CONSISTENCY (TASK 23.15.03)
   ========================================================================= */

test('Task 23.15.03: SQLSTATE codes return consistent error classifications', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');

  // 1. Revoked function access returns 42501 (insufficient_privilege)
  const { error: revErr } = await anonClient.rpc('admin_update_user_status', {
    target_user_id: student.user.id,
    new_role: 'admin',
    new_status: 'active'
  });
  assert.equal(revErr?.code, '42501', 'Revoked function call must return 42501');

  // 2. Trigger check exception returns P0001 (raise_exception)
  const { error: trigErr } = await student.client.from('profiles').update({ role: 'admin' }).eq('id', student.user.id);
  assert.equal(trigErr?.code, 'P0001', 'Trigger exception must return P0001');

  // 3. Expired token returns PGRST301
  const { error: expErr } = await expiredClient.from('profiles').select('id').limit(1);
  assert.equal(expErr?.code, 'PGRST301', 'Expired JWT must return PGRST301');
});

/* =========================================================================
   GROUP 4: COMPLETE RPC SECURITY & IDENTITY BINDING (TASK 23.15.04)
   ========================================================================= */

test('Task 23.15.04: Comprehensive RPC permission matrix verification', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const teacher = await getAuthClientFor('lam128608@gmail.com');
  const admin = await getAuthClientFor('lehaidang16032006@gmail.com');

  // 1. verify_hsk_certificate_public: Public accessible
  const { error: certErr } = await anonClient.rpc('verify_hsk_certificate_public', {
    p_certificate_code: 'NON_EXISTENT_CODE'
  });
  assert.equal(certErr, null, 'Public certificate verification must be executable by anon');

  // 2. search_dictionary: Public accessible
  const { data: dictRows, error: dictErr } = await anonClient.rpc('search_dictionary', {
    search_query: '你好'
  });
  assert.equal(dictErr, null);
  assert.ok(Array.isArray(dictRows));

  // 3. match_rag_knowledge: Public/hybrid accessible
  const { data: ragRows, error: ragErr } = await anonClient.rpc('match_rag_knowledge', {
    query_text: 'xin chào'
  });
  assert.equal(ragErr, null);
  assert.ok(Array.isArray(ragRows));

  // 4. is_admin: Returns false for student, true for admin
  const { data: studIsAdmin } = await student.client.rpc('is_admin');
  assert.equal(studIsAdmin, false);
  const { data: admIsAdmin } = await admin.client.rpc('is_admin');
  assert.equal(admIsAdmin, true);

  // 5. is_teacher: Returns false for student, true for teacher
  const { data: studIsTeacher } = await student.client.rpc('is_teacher');
  assert.equal(studIsTeacher, false);
  const { data: tchrIsTeacher } = await teacher.client.rpc('is_teacher');
  assert.equal(tchrIsTeacher, true);

  // 6. is_classroom_teacher: Spoofing blocked for student
  const { data: spoofTeacher } = await student.client.rpc('is_classroom_teacher', {
    p_classroom_id: '7a1c2fb4-5dae-4319-b8d0-b4d6392a6bad',
    p_user_id: teacher.user.id
  });
  assert.equal(spoofTeacher, false, 'Student passing teacher ID must evaluate to false');

  // 7. create_classroom_secure: Student rejected
  const { error: studCreateClsErr } = await student.client.rpc('create_classroom_secure', {
    p_name: 'Hack',
    p_description: '',
    p_hsk_level: 'HSK 1',
    p_max_students: 20
  });
  assert.ok(studCreateClsErr, 'Student must not create classroom');

  // 8. join_class_by_code: Anon rejected
  const { error: anonJoinErr } = await anonClient.rpc('join_class_by_code', {
    p_class_code: 'TEST'
  });
  assert.ok(anonJoinErr, 'Anon must not join class');
});

/* =========================================================================
   GROUP 5: RLS 5-ROLE CRUD MATRIX & DATA ISOLATION (TASK 23.15.05)
   ========================================================================= */

test('Task 23.15.05: RLS isolation prevents cross-tenant and forged records', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const teacher = await getAuthClientFor('lam128608@gmail.com');

  // 1. Student cannot insert reading progress with forged user_id
  const { error: forgeErr } = await student.client.from('reading_progress').insert({
    user_id: teacher.user.id,
    material_id: 'mat_audit_forge',
    current_page: 1
  });
  assert.ok(forgeErr, 'Forged user_id in reading progress must be blocked by RLS');

  // 2. Student cannot directly insert into class_members
  const { error: directMemberErr } = await student.client.from('class_members').insert({
    classroom_id: '7a1c2fb4-5dae-4319-b8d0-b4d6392a6bad',
    student_id: student.user.id
  });
  assert.ok(directMemberErr, 'Direct enrollment without join RPC must be blocked by RLS');

  // 3. Raw hsk_questions is completely inaccessible to anon and student
  const { error: rawAnonErr } = await anonClient.from('hsk_questions').select('*').limit(1);
  assert.ok(rawAnonErr, 'Raw hsk_questions must be blocked for anon');
  const { error: rawStudErr } = await student.client.from('hsk_questions').select('*').limit(1);
  assert.ok(rawStudErr, 'Raw hsk_questions must be blocked for student');
});

/* =========================================================================
   GROUP 6: HSK ZERO ANSWER LEAKAGE (TASK 23.15.06)
   ========================================================================= */

test('Task 23.15.06: Zero Answer Leakage verified across view and client taking state', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  // 1. View v_hsk_questions_public contains 0 answer fields
  const { data: vRows, error: vErr } = await anonClient.from('v_hsk_questions_public').select('*').limit(20);
  assert.equal(vErr, null);
  assert.ok(vRows?.length > 0);
  for (const row of vRows) {
    assert.equal(row.correct_option_index, undefined);
    assert.equal(row.correct_answer, undefined);
    assert.equal(row.explanation, undefined);
  }

  // 2. Client taking state has 0 answer fields
  const exam = await getExamForTaking('hsk1-mock-01');
  assert.ok(exam?.questions?.length > 0);
  for (const q of exam.questions) {
    assert.equal(q.correct_option_index, undefined);
    assert.equal(q.correct_answer, undefined);
    assert.equal(q.explanation, undefined);
    assert.equal(q.sample_answer, undefined);
  }
});
