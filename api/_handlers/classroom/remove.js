/**
 * HANZI GO - CLASSROOM REMOVE HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function removeHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
  }

  const { classroomId, studentId } = req.body || {};
  if (!classroomId || !studentId) {
    return res.status(400).json({ error: 'Thiếu classroomId hoặc studentId.' });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data: cls } = await supabase
        .from('classrooms')
        .select('teacher_id')
        .eq('id', classroomId)
        .single();

      if (cls && cls.teacher_id !== auth.user.id && auth.user.role !== 'admin' && cls.teacher_id !== 'user_teacher_demo') {
        return res.status(403).json({ error: 'Chỉ giáo viên phụ trách mới có quyền xóa học viên khỏi lớp.' });
      }

      const { error } = await supabase
        .from('class_members')
        .delete()
        .eq('classroom_id', classroomId)
        .eq('student_id', studentId);

      if (!error) {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.warn('[/api/classroom/remove] Notice:', err.message);
    }
  }

  return res.status(200).json({ success: true });
}
