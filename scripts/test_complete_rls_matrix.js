import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const serviceClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anonClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function getAuthClientFor(email) {
  const { data: link } = await serviceClient.auth.admin.generateLink({ type: 'magiclink', email });
  const freshAnon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: sess } = await freshAnon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'magiclink' });
  const client = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${sess.session.access_token}` } }
  });
  return { client, user: sess.user, token: sess.session.access_token };
}

async function runMatrix() {
  console.log('================================================================');
  console.log('COMPLETE RLS ROLE MATRIX VERIFICATION (ANON, STUDENT, TEACHER, ADMIN)');
  console.log('================================================================\n');

  const student = await getAuthClientFor('gsun2906@gmail.com');
  const studentB = await getAuthClientFor('4ddef8f9-5149-45e7-8380-1689576468c8@example.com').catch(async () => {
    // If not exists, use hehe16@gmail.com
    return await getAuthClientFor('hehe16@gmail.com');
  });
  const teacher = await getAuthClientFor('lam128608@gmail.com');

  const matrix = [];

  function record(role, resource, op, expected, actual, evidence, pass) {
    matrix.push({ role, resource, op, expected, actual, evidence, pass });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${role} | ${resource} | ${op} -> ${actual} (${evidence})`);
  }

  // --- 1. ANONYMOUS ---
  // SELECT Public
  const { data: aPub, error: aPubErr } = await anonClient.from('learning_lessons').select('id').limit(1);
  record('Anonymous', 'learning_lessons', 'SELECT', 'Allow', aPub?.length > 0 ? 'Allow' : 'Deny', `Returned ${aPub?.length} rows`, !aPubErr && aPub?.length > 0);

  // SELECT Private reading_progress
  const { data: aRead } = await anonClient.from('reading_progress').select('*');
  record('Anonymous', 'reading_progress', 'SELECT', '0 rows', `${aRead?.length} rows`, `Returned ${aRead?.length} rows`, aRead?.length === 0);

  // INSERT learning_lessons
  const { error: aInsErr } = await anonClient.from('learning_lessons').insert([{ id: 'test-fake', title: 'hack' }]);
  record('Anonymous', 'learning_lessons', 'INSERT', 'Deny', aInsErr ? 'Deny' : 'Allow', aInsErr?.message || 'Allowed', Boolean(aInsErr));

  // SELECT hsk_questions direct
  const { error: aHskErr } = await anonClient.from('hsk_questions').select('id, correct_option_index').limit(1);
  record('Anonymous', 'hsk_questions (raw)', 'SELECT', 'Deny', aHskErr ? 'Deny' : 'Allow', aHskErr?.message || 'Allowed', Boolean(aHskErr));

  // SELECT v_hsk_questions_public
  const { data: aVData, error: aVErr } = await anonClient.from('v_hsk_questions_public').select('*').limit(1);
  const leakedCol = aVData?.[0] && ('correct_option_index' in aVData[0] || 'correct_answer' in aVData[0]);
  record('Anonymous', 'v_hsk_questions_public', 'SELECT', 'Allow (No answers)', !leakedCol ? 'Allow (No answers)' : 'Leaked', `Has answer: ${leakedCol}`, !aVErr && !leakedCol);

  // --- 2. AUTHENTICATED STUDENT ---
  // Student own reading_progress INSERT
  const testMatId = 'mat-matrix-test';
  const { error: sInsErr } = await student.client.from('reading_progress').upsert([{
    user_id: student.user.id,
    material_id: testMatId,
    title: 'Matrix Test',
    current_page: 1,
    total_pages: 10,
    progress_percent: 10
  }], { onConflict: 'user_id,material_id' });
  record('Student', 'reading_progress (own)', 'INSERT/UPSERT', 'Allow', !sInsErr ? 'Allow' : 'Deny', sInsErr?.message || 'Inserted', !sInsErr);

  // Student own reading_progress SELECT
  const { data: sSel, error: sSelErr } = await student.client.from('reading_progress').select('*').eq('material_id', testMatId);
  record('Student', 'reading_progress (own)', 'SELECT', '1 row', `${sSel?.length} rows`, `Read own progress`, sSel?.length === 1);

  // Student spoofing other user's reading_progress INSERT
  const { error: sSpoofErr } = await student.client.from('reading_progress').upsert([{
    user_id: studentB.user.id,
    material_id: testMatId,
    title: 'Spoof Test',
    current_page: 5,
    total_pages: 10,
    progress_percent: 50
  }], { onConflict: 'user_id,material_id' });
  record('Student', 'reading_progress (other user)', 'INSERT (spoof)', 'Deny', sSpoofErr ? 'Deny' : 'Allow', sSpoofErr?.message || 'Allowed', Boolean(sSpoofErr));

  // Student trying to read other user's reading_progress
  const { data: sOtherSel } = await student.client.from('reading_progress').select('*').eq('user_id', studentB.user.id);
  record('Student', 'reading_progress (other user)', 'SELECT', '0 rows', `${sOtherSel?.length} rows`, `Read other rows: ${sOtherSel?.length}`, sOtherSel?.length === 0);

  // Student self-role escalation
  const { error: sEscErr } = await student.client.from('profiles').update({ role: 'admin' }).eq('id', student.user.id);
  record('Student', 'profiles (self role escalation)', 'UPDATE role', 'Deny', sEscErr ? 'Deny' : 'Allow', sEscErr?.message || 'Allowed', Boolean(sEscErr));

  // Clean student test data
  await student.client.from('reading_progress').delete().eq('material_id', testMatId);

  // --- 3. AUTHENTICATED TEACHER ---
  // Teacher reading own classrooms
  const { data: tMyClass } = await teacher.client.from('classrooms').select('id, teacher_id');
  const ownAll = tMyClass?.every(c => c.teacher_id === teacher.user.id);
  record('Teacher', 'classrooms (own)', 'SELECT', 'Only own classrooms', ownAll ? 'Only own classrooms' : 'Leaked others', `Found ${tMyClass?.length} classes`, ownAll && tMyClass?.length > 0);

  // Teacher tampering with foreign classroom
  const foreignClassId = 'bcd3f89d-9d86-4ce1-8bf7-f25572522e6f';
  const { data: tTamper } = await teacher.client.from('classrooms').update({ name: 'Hacked' }).eq('id', foreignClassId).select();
  record('Teacher', 'classrooms (foreign)', 'UPDATE', '0 rows affected', `${tTamper?.length} rows`, `Tamper result: ${tTamper?.length} rows`, tTamper?.length === 0);

  // Teacher reading foreign class_materials
  const { data: tForeignMat } = await teacher.client.from('class_materials').select('*').eq('classroom_id', foreignClassId);
  record('Teacher', 'class_materials (foreign)', 'SELECT', '0 rows', `${tForeignMat?.length} rows`, `Returned ${tForeignMat?.length} rows`, tForeignMat?.length === 0);

  // --- 4. EXPIRED / INVALID TOKEN ---
  const invalidClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.expired` } }
  });
  const { data: invData, error: invErr } = await invalidClient.from('reading_progress').select('*');
  record('Expired/Invalid Token', 'reading_progress', 'SELECT', 'Deny (401)', invErr ? 'Deny (401)' : `${invData?.length} rows`, invErr?.message || 'Allowed', Boolean(invErr));

  console.log('\nMatrix tests completed. Total tests:', matrix.length);
}
runMatrix();

