import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const serviceClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anonClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function getAuthClient(email) {
  const { data: link } = await serviceClient.auth.admin.generateLink({ type: 'magiclink', email });
  const fresh = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: sess } = await fresh.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'magiclink' });
  return {
    client: createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${sess.session.access_token}` } }
    }),
    user: sess.user
  };
}

async function run() {
  const student = await getAuthClient('gsun2906@gmail.com');
  const teacher = await getAuthClient('lam128608@gmail.com');
  const admin = await getAuthClient('lehaidang16032006@gmail.com');

  console.log('--- Context 4: PostgREST Anonymous ---');
  const resAnon = await anonClient.from('profiles').update({ role: 'admin' }).eq('id', student.user.id);
  console.log('Anon update result:', { error: resAnon.error, status: resAnon.status });

  console.log('--- Context 5: PostgREST Authenticated Student ---');
  const resStud = await student.client.from('profiles').update({ role: 'admin' }).eq('id', student.user.id);
  console.log('Student update result:', { error: resStud.error, status: resStud.status });

  console.log('--- Context 6: PostgREST Authenticated Teacher ---');
  const resTchr = await teacher.client.from('profiles').update({ role: 'admin' }).eq('id', teacher.user.id);
  console.log('Teacher update result:', { error: resTchr.error, status: resTchr.status });

  console.log('--- Context 7: PostgREST Authenticated Admin ---');
  const resAdmin = await admin.client.from('profiles').update({ role: 'student' }).eq('id', student.user.id).select('id, role');
  console.log('Admin update result:', { data: resAdmin.data, error: resAdmin.error, status: resAdmin.status });

  console.log('--- Context 8: Server-side Service Role ---');
  const resSrv = await serviceClient.from('profiles').update({ role: 'student', status: 'active' }).eq('id', student.user.id).select('id, role, status');
  console.log('Service role update result:', { data: resSrv.data, error: resSrv.error, status: resSrv.status });
}

run().catch(console.error);

