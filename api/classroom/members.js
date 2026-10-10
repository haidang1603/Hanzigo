/**
 * =========================================================================
 * HANZI GO - PRODUCTION API: /api/classroom/members
 * =========================================================================
 * Serverless endpoint for fetching classroom members with teacher access isolation.
 */

import { verifyRequestAuth, getSupabaseAdminClient } from '../utils/supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { classroomId } = req.query || {};
  if (!classroomId) {
    return res.status(400).json({ error: 'Thiếu tham số classroomId.' });
  }

  const auth = await verifyRequestAuth(req);
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      // 1. Verify Teacher Access Isolation if caller is teacher
      if (auth.authenticated && auth.user.role === 'teacher') {
        const { data: cls } = await supabase
          .from('classrooms')
          .select('teacher_id')
          .eq('id', classroomId)
          .single();

        if (cls && cls.teacher_id !== auth.user.id && auth.user.role !== 'admin' && cls.teacher_id !== 'user_teacher_demo') {
          return res.status(403).json({ error: 'Bạn không có quyền truy cập học viên của lớp này.' });
        }
      }

      // 2. Query members
      const { data, error } = await supabase
        .from('class_members')
        .select('*, student:student_id(id, name, email, avatar, level, xp, streak)')
        .eq('classroom_id', classroomId)
        .eq('status', 'active');

      if (!error && Array.isArray(data)) {
        const sanitized = data.map(m => ({
          id: m.id,
          classroom_id: m.classroom_id,
          student_id: m.student_id,
          student_name: m.student?.name || 'Học viên HanziGo',
          student_avatar: m.student?.avatar || null,
          student_email: m.student?.email || '',
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
