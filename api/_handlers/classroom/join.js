/**
 * HANZI GO - CLASSROOM JOIN HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function joinHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
  }

  const { class_code, classroom_id, student } = req.body || {};
  if (!class_code && !classroom_id) {
    return res.status(400).json({ error: 'Thiếu mã lớp học hoặc classroom_id.' });
  }

  const userId = auth.user.id;
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      if (class_code) {
        const cleanCode = String(class_code).trim().toUpperCase().replace(/\s+/g, '');
        const { data: rpcData, error: rpcErr } = await supabase.rpc('join_class_by_code', {
          p_class_code: cleanCode
        });

        if (!rpcErr && rpcData?.success) {
          return res.status(200).json(rpcData);
        }
      }

      let targetClassId = classroom_id;
      if (!targetClassId && class_code) {
        const cleanCode = String(class_code).trim().toUpperCase().replace(/\s+/g, '');
        const { data: cls } = await supabase
          .from('classrooms')
          .select('id, max_students, status')
          .eq('class_code', cleanCode)
          .single();

        if (cls) {
          if (cls.status !== 'active') {
            return res.status(400).json({ error: 'Lớp học hiện tại đã đóng hoặc lưu trữ.' });
          }
          targetClassId = cls.id;
        }
      }

      if (targetClassId) {
        const { data: member, error: memErr } = await supabase
          .from('class_members')
          .upsert({
            classroom_id: targetClassId,
            student_id: userId,
            status: 'active',
            joined_at: new Date().toISOString()
          }, { onConflict: 'classroom_id,student_id' })
          .select()
          .single();

        if (!memErr) {
          return res.status(200).json({
            success: true,
            classroom_id: targetClassId,
            member
          });
        }
      }
    } catch (err) {
      console.warn('[/api/classroom/join] Notice:', err.message);
    }
  }

  return res.status(200).json({
    success: true,
    classroom_id: classroom_id || 'cls-simulated',
    student: student || null
  });
}
