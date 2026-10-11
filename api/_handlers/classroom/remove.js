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

  const classroomId = req.body?.classroomId || req.body?.classroom_id;
  const studentId = req.body?.studentId || req.body?.student_id;
  if (!classroomId || !studentId) {
    return res.status(400).json({ error: 'Thiếu classroomId hoặc studentId.' });
  }

  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data: cls } = await supabase
        .from('classrooms')
        .select('teacher_id')
        .eq('id', classroomId)
        .maybeSingle();

      if (!cls) {
        return res.status(404).json({ error: 'Không tìm thấy lớp học.' });
      }

      if (cls.teacher_id !== auth.user.id && auth.user.role !== 'admin') {
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
      return res.status(500).json({ error: 'Không thể xóa học viên: ' + (error.message || 'Lỗi cơ sở dữ liệu') });
    } catch (err) {
      console.warn('[/api/classroom/remove] Notice:', err.message);
      return res.status(500).json({ error: 'Lỗi máy chủ khi xóa học viên.' });
    }
  } else if (isProd) {
    return res.status(503).json({ error: 'Dịch vụ cơ sở dữ liệu không khả dụng.' });
  }

  if (auth.user.role !== 'teacher' && auth.user.role !== 'admin' && (!auth.user.id.includes('teacher') || isProd)) {
    return res.status(403).json({ error: 'Chỉ giáo viên phụ trách mới có quyền xóa học viên khỏi lớp.' });
  }

  return res.status(200).json({ success: true });
}
