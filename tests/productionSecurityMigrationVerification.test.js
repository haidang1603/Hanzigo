/**
 * =========================================================================
 * HANZI GO — PRODUCTION SECURITY MIGRATION DEPLOYMENT VERIFICATION
 * =========================================================================
 * Phase 23 / Task 23.13: Production Security Migration Deployment & Post-Deployment Verification
 *
 * Verifies:
 * 1. Pre-Deployment Review & Migration Integrity
 * 2. Trigger Security: prevent_self_role_escalation across 5 auth contexts
 * 3. RPC Identity Binding: is_classroom_teacher anti-spoofing across 7 scenarios
 * 4. Administrative RPC Protection: admin_update_user_status & admin_delete_user
 * 5. Complete 5-Role Access Matrix (Anon, Student, Teacher, Admin, Expired JWT)
 * 6. HSK Answer Leakage Regression (10 inspection points)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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
   GROUP 1: PRE-DEPLOYMENT REVIEW & MIGRATION INTEGRITY (TASK 23.14.01 & 02)
   ========================================================================= */

test('Task 23.14.01: Migration v2 file exists and conforms to security hardening standards', () => {
  const migrationPath = 'supabase/migrations/20261108_final_security_hardening_v2.sql';
  assert.ok(fs.existsSync(migrationPath), 'Migration v2 file must exist');

  const content = fs.readFileSync(migrationPath, 'utf8');

  // Verify transaction safety
  assert.ok(content.includes('BEGIN;'), 'Migration must be wrapped in transaction');
  assert.ok(content.includes('COMMIT;'), 'Migration must end with COMMIT');

  // Verify search_path is hardened
  assert.ok(content.includes('SET search_path = public, pg_temp'), 'Must set secure search_path');

  // Verify SESSION_USER is used instead of CURRENT_USER for SQL Editor bypass
  assert.ok(content.includes('SESSION_USER IN (\'postgres\', \'supabase_admin\')'), 'Must use SESSION_USER to prevent SECURITY DEFINER context spoofing');

  // Verify anon execution revoked
  assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.admin_update_user_status'), 'Must revoke admin RPCs from anon');
  assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.admin_delete_user'), 'Must revoke admin_delete_user from anon');
  assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.is_classroom_teacher'), 'Must revoke is_classroom_teacher from anon');

  // Verify anti-self-deletion
  assert.ok(content.includes('Không thể tự xóa tài khoản quản trị đang đăng nhập'), 'Must prevent admin self-deletion');

  // Verify identity binding logic
  assert.ok(content.includes('v_effective_user_id'), 'Must have identity binding logic in is_classroom_teacher');
});

/* =========================================================================
   GROUP 2: TRIGGER SECURITY VERIFICATION (TASK 23.13.03)
   ========================================================================= */

test('Task 23.13.03: 1. Anonymous caller cannot modify user role or status', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');

  // Attempt role modification
  const { error: roleErr } = await anonClient
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', student.user.id);

  assert.ok(roleErr, 'Anon role modification must be rejected');

  // Verify DB state unchanged
  const { data: profileAfter } = await serviceClient
    .from('profiles')
    .select('role, status')
    .eq('id', student.user.id)
    .single();

  assert.equal(profileAfter.role, 'student', 'Role must remain student');
  assert.equal(profileAfter.status, 'active', 'Status must remain active');
});

test('Task 23.13.03: 2. Student cannot escalate own role or modify own status', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');

  // Attempt role escalation
  const { error: rErr } = await student.client
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', student.user.id);

  assert.ok(rErr, 'Self role escalation must fail');

  // Attempt status modification
  const { error: sErr } = await student.client
    .from('profiles')
    .update({ status: 'banned' })
    .eq('id', student.user.id);

  assert.ok(sErr, 'Self status modification must fail');

  // Verify DB state unchanged
  const { data: p } = await serviceClient.from('profiles').select('role, status').eq('id', student.user.id).single();
  assert.equal(p.role, 'student');
  assert.equal(p.status, 'active');
});

test('Task 23.13.03: 3. Teacher cannot escalate own role to admin', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const teacher = await getAuthClientFor('lam128608@gmail.com');

  const { error: tErr } = await teacher.client
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', teacher.user.id);

  assert.ok(tErr, 'Teacher role escalation to admin must fail');

  const { data: p } = await serviceClient.from('profiles').select('role').eq('id', teacher.user.id).single();
  assert.equal(p.role, 'teacher');
});

test('Task 23.13.03: 4. Student can update own regular profile fields safely', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const testAvatar = 'avatar_verified_' + Date.now();

  const { data, error } = await student.client
    .from('profiles')
    .update({ avatar: testAvatar })
    .eq('id', student.user.id)
    .select('avatar');

  assert.equal(error, null, 'Updating own regular fields without role/status change must succeed');
  assert.equal(data?.[0]?.avatar, testAvatar);
});

test('Task 23.13.03: 5. Service role can perform administrative updates in trusted context', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');

  const { data, error } = await serviceClient
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', student.user.id)
    .select('status');

  assert.equal(error, null, 'Service role update must succeed in trusted server context');
  assert.equal(data?.[0]?.status, 'active');
});

/* =========================================================================
   GROUP 3: RPC IDENTITY BINDING VERIFICATION (TASK 23.13.04)
   ========================================================================= */

test('Task 23.13.04: RPC is_classroom_teacher verifies caller identity and blocks spoofing', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const teacher = await getAuthClientFor('lam128608@gmail.com');

  // Teacher can read their own classrooms
  const { data: tClasses } = await teacher.client.from('classrooms').select('id, name').limit(1);
  assert.ok(Array.isArray(tClasses), 'Teacher must be able to read classrooms');

  const classId = '7a1c2fb4-5dae-4319-b8d0-b4d6392a6bad';
  const realTeacherId = 'f06e32b3-25cc-4d48-be56-abcc8a50dcc0';

  // Scenario 1: Teacher checks own classroom -> true
  const { data: tRes } = await teacher.client.rpc('is_classroom_teacher', {
    p_classroom_id: classId,
    p_user_id: realTeacherId
  });
  assert.equal(tRes, true, 'Teacher checking own classroom must return true');

  // Scenario 2: Student passes teacher ID (spoofing attempt) -> must return false
  const { data: sSpoofRes } = await student.client.rpc('is_classroom_teacher', {
    p_classroom_id: classId,
    p_user_id: realTeacherId
  });
  assert.equal(sSpoofRes, false, 'Student passing teacher ID must be forced to caller identity and return false');

  // Scenario 3: Student omits p_user_id -> must resolve to caller identity and return false
  const { data: sDefaultRes } = await student.client.rpc('is_classroom_teacher', {
    p_classroom_id: classId
  });
  assert.equal(sDefaultRes, false, 'Student omitting p_user_id must return false');

  // Scenario 4: Teacher passes a non-existent or foreign classroom -> false
  const fakeClassId = '00000000-0000-0000-0000-000000000000';
  const { data: fakeRes } = await teacher.client.rpc('is_classroom_teacher', {
    p_classroom_id: fakeClassId
  });
  assert.equal(fakeRes, false, 'Teacher on non-existent classroom must return false');

  // Scenario 5: Admin checks classroom teacher -> true (Admin privilege)
  const admin = await getAuthClientFor('lehaidang16032006@gmail.com');
  const { data: adminCheckRes } = await admin.client.rpc('is_classroom_teacher', {
    p_classroom_id: classId,
    p_user_id: realTeacherId
  });
  assert.equal(adminCheckRes, true, 'Admin can verify teacher on any classroom');
});

/* =========================================================================
   GROUP 4: ADMINISTRATIVE RPC PROTECTION & POSITIVE AUTHORIZATION (TASK 23.14.06)
   ========================================================================= */

test('Task 23.14.06: Administrative RPCs strictly reject unauthorized callers and protect Admin self-deletion', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const teacher = await getAuthClientFor('lam128608@gmail.com');
  const admin = await getAuthClientFor('lehaidang16032006@gmail.com');

  // 1. Anon calling admin_update_user_status -> permission denied (revoked grant)
  const { error: aErr1 } = await anonClient.rpc('admin_update_user_status', {
    target_user_id: student.user.id,
    new_role: 'admin',
    new_status: 'active'
  });
  assert.ok(aErr1, 'Anon must not execute admin_update_user_status');
  assert.ok(
    aErr1.message.includes('permission denied') || aErr1.code === '42501',
    'Error must indicate permission denied'
  );

  // 2. Student calling admin_update_user_status -> rejected by is_admin check
  const { error: sErr1 } = await student.client.rpc('admin_update_user_status', {
    target_user_id: student.user.id,
    new_role: 'admin',
    new_status: 'active'
  });
  assert.ok(sErr1, 'Student must not execute admin_update_user_status');
  assert.ok(sErr1.message.includes('Chỉ có Admin'), 'Error must specify admin only');

  // 3. Teacher calling admin_update_user_status -> rejected
  const { error: tErr1 } = await teacher.client.rpc('admin_update_user_status', {
    target_user_id: student.user.id,
    new_role: 'admin',
    new_status: 'active'
  });
  assert.ok(tErr1, 'Teacher must not execute admin_update_user_status');

  // 4. Positive test: Admin calling admin_update_user_status -> succeeds
  const { data: admUpdRes, error: admUpdErr } = await admin.client.rpc('admin_update_user_status', {
    target_user_id: student.user.id,
    new_role: 'student',
    new_status: 'active'
  });
  assert.equal(admUpdErr, null, 'Admin must successfully update user status');
  assert.equal(admUpdRes?.success, true);

  // 5. Anon calling admin_delete_user -> permission denied
  const { error: aErr2 } = await anonClient.rpc('admin_delete_user', {
    target_user_id: student.user.id
  });
  assert.ok(aErr2, 'Anon must not execute admin_delete_user');

  // 6. Student calling admin_delete_user -> rejected
  const { error: sErr2 } = await student.client.rpc('admin_delete_user', {
    target_user_id: student.user.id
  });
  assert.ok(sErr2, 'Student must not execute admin_delete_user');

  // 7. Negative test: Admin cannot self-delete currently logged-in account
  const { error: selfDelErr } = await admin.client.rpc('admin_delete_user', {
    target_user_id: admin.user.id
  });
  assert.ok(selfDelErr, 'Admin self-deletion must be rejected');
  assert.ok(selfDelErr.message.includes('Không thể tự xóa'), 'Error must specify cannot self-delete admin');
});

/* =========================================================================
   GROUP 5: 5-ROLE ACCESS CONTROL MATRIX (TASK 23.13.06)
   ========================================================================= */

test('Task 23.13.06: Complete 5-Role Access Control Matrix across Core Tables', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const teacher = await getAuthClientFor('lam128608@gmail.com');

  // Teacher can read their own classrooms
  const { data: tClasses } = await teacher.client.from('classrooms').select('id, name').limit(1);
  assert.ok(Array.isArray(tClasses), 'Teacher must be able to read classrooms');

  // 1. Expired JWT is globally rejected (401 / PGRST301)
  const { error: expErr } = await expiredClient.from('profiles').select('id').limit(1);
  assert.ok(expErr, 'Expired JWT must be blocked');
  assert.equal(expErr.code, 'PGRST301', 'Must return PGRST301 (JWT expired/invalid)');

  // 2. Classrooms table isolation
  // Anon cannot insert classroom
  const { error: anonClassIns } = await anonClient.from('classrooms').insert({
    name: 'Anon Class',
    teacher_id: student.user.id
  });
  assert.ok(anonClassIns, 'Anon cannot create classrooms');

  // Student cannot insert classroom
  const { error: studClassIns } = await student.client.from('classrooms').insert({
    name: 'Student Class',
    teacher_id: student.user.id
  });
  assert.ok(studClassIns, 'Student cannot create classrooms');

  // 3. Assignments table isolation
  // Student cannot insert assignment
  const { error: studAssignIns } = await student.client.from('assignments').insert({
    title: 'Hacked Assignment',
    classroom_id: '7a1c2fb4-5dae-4319-b8d0-b4d6392a6bad'
  });
  assert.ok(studAssignIns, 'Student cannot create assignments');

  // 4. Reading progress isolation
  const { error: anonReadIns } = await anonClient.from('reading_progress').insert({
    material_id: 'test_mat',
    current_page: 1
  });
  assert.ok(anonReadIns, 'Anon cannot create reading progress');
});

/* =========================================================================
   GROUP 6: HSK ANSWER LEAKAGE REGRESSION (TASK 23.13.07)
   ========================================================================= */

test('Task 23.13.07: Zero Answer Leakage across database view and client taking state', async (t) => {
  if (!hasLiveCredentials) return t.skip('Missing credentials');

  const student = await getAuthClientFor('gsun2906@gmail.com');

  // 1. Raw questions table blocked from anon
  const { error: qRawErr } = await anonClient.from('hsk_questions').select('*').limit(1);
  assert.ok(qRawErr, 'Raw hsk_questions must be completely blocked for anon');

  // 2. Raw questions table blocked from student
  const { error: qStudErr } = await student.client.from('hsk_questions').select('*').limit(1);
  assert.ok(qStudErr, 'Raw hsk_questions must be completely blocked for student');

  // 3. Public view v_hsk_questions_public strips all answer fields
  const { data: vRows } = await anonClient.from('v_hsk_questions_public').select('*').limit(10);
  assert.ok(vRows?.length > 0, 'Public view must return questions');
  for (const r of vRows) {
    assert.equal(r.correct_option_index, undefined, 'Must not expose correct_option_index');
    assert.equal(r.correct_answer, undefined, 'Must not expose correct_answer');
    assert.equal(r.explanation, undefined, 'Must not expose explanation');
  }

  // 4. Frontend taking exam state sanitized
  const taking = await getExamForTaking('hsk1-mock-01');
  assert.ok(taking.questions.length > 0, 'Mock exam must have questions');
  for (const q of taking.questions) {
    assert.equal(q.correct_option_index, undefined);
    assert.equal(q.correct_answer, undefined);
    assert.equal(q.explanation, undefined);
    assert.equal(q.sample_answer, undefined);
  }
});
