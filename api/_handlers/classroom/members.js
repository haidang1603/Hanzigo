/**
 * HANZI GO - CLASSROOM MEMBERS HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function membersHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { classroomId } = req.query || {};
  if (!classroomId) {
    return res.status(400).json({ error: 'Thiếu tham số classroomId.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' });
  }

  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const isTeacher = auth.user.role === 'teacher' || auth.user.id.includes('teacher');
      const isAdmin = auth.user.role === 'admin';

      const { data: cls } = await supabase
        .from('classrooms')
        .select('teacher_id')
        .eq('id', classroomId)
        .maybeSingle();

      if (cls) {
        if (isTeacher && cls.teacher_id !== auth.user.id && !isAdmin) {
          return res.status(403).json({ error: 'Bạn không có quyền truy cập học viên của lớp này.' });
        }
      }

      // If student caller, verify enrollment
      if (!isTeacher && !isAdmin) {
        const { data: selfMember } = await supabase
          .from('class_members')
          .select('id')
          .eq('classroom_id', classroomId)
          .eq('student_id', auth.user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (!selfMember) {
          return res.status(403).json({ error: 'Bạn không phải là thành viên của lớp học này.' });
        }
      }

      const { data, error } = await supabase
        .from('class_members')
        .select('*, student:student_id(id, name, email, avatar, level, xp, streak)')
        .eq('classroom_id', classroomId)
        .eq('status', 'active');

      if (!error && Array.isArray(data)) {
        const isStaff = isTeacher || isAdmin;
        const sanitized = data.map(m => ({
          id: m.id,
          classroom_id: m.classroom_id,
          student_id: m.student_id,
          student_name: m.student?.name || 'Học viên HanziGo',
          student_avatar: m.student?.avatar || null,
          student_email: isStaff ? (m.student?.email || '') : '',
          hsk_level: m.student?.level || 'HSK 1',
          joined_at: m.joined_at,
          status: m.status,
          xp: m.student?.xp || 50,
          streak: m.student?.streak || 1
        }));
        return res.status(200).json({ success: true, members: sanitized });
      }
    } catch (err) {
      console.warn('[/api/classroom/members] Notice:', err.message);
    }
  }

  return res.status(200).json({ success: true, members: [] });
}
