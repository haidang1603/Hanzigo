/**
 * HANZI GO - LIVE JOIN HANDLER
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

  const session_id = req.body?.session_id || req.body?.sessionId;
  const participant = req.body?.participant || req.body;
  if (!session_id || !participant) {
    return res.status(400).json({ error: 'Thiếu thông tin session_id hoặc participant.' });
  }

  const userId = auth.user.id;
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const supabase = getSupabaseAdminClient();

  let verifiedRole = 'student';

  if (supabase) {
    try {
      const { data: session } = await supabase
        .from('class_sessions')
        .select('teacher_id, status, ended_at, classroom_id')
        .eq('id', session_id)
        .maybeSingle();

      if (session) {
        if (session.status === 'ended' || session.ended_at) {
          return res.status(403).json({ error: 'Phiên học trực tuyến đã kết thúc.' });
        }

        const isTeacherOwner = session.teacher_id === userId || auth.user.role === 'admin';
        verifiedRole = isTeacherOwner ? 'teacher' : 'student';

        // Non-teacher participants must be verified class members in production
        if (!isTeacherOwner && isProd) {
          const { data: membership } = await supabase
            .from('class_members')
            .select('id, status')
            .eq('classroom_id', session.classroom_id)
            .eq('student_id', userId)
            .eq('status', 'active')
            .maybeSingle();

          if (!membership) {
            return res.status(403).json({ error: 'Bạn chưa tham gia lớp học này.' });
          }
        }
      } else if (isProd) {
        return res.status(404).json({ error: 'Phòng học trực tuyến không tồn tại.' });
      } else {
        const isTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher' || userId.includes('teacher');
        verifiedRole = isTeacher ? 'teacher' : 'student';
      }

      const { data: existingPart } = await supabase
        .from('session_participants')
        .select('is_mic_allowed')
        .eq('session_id', session_id)
        .eq('user_id', userId)
        .maybeSingle();

      const micAllowed = verifiedRole === 'teacher' ? true : Boolean(existingPart?.is_mic_allowed);

      const { data, error } = await supabase
        .from('session_participants')
        .upsert({
          session_id,
          user_id: userId,
          role: verifiedRole,
          joined_at: participant.joined_at || new Date().toISOString(),
          left_at: null,
          total_duration_seconds: participant.total_duration_seconds || 0,
          is_mic_allowed: micAllowed,
          attendance_status: participant.attendance_status || 'present'
        }, { onConflict: 'session_id,user_id' })
        .select()
        .maybeSingle();

      if (!error && data) {
        return res.status(200).json({ success: true, participant: data });
      }
    } catch (err) {
      console.warn('[/api/live/join] Fallback notice:', err.message);
    }
  } else {
    const isTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher' || userId.includes('teacher');
    verifiedRole = isTeacher ? 'teacher' : 'student';
  }

  return res.status(200).json({
    success: true,
    participant: {
      ...participant,
      user_id: userId,
      role: verifiedRole,
      is_mic_allowed: verifiedRole === 'teacher'
    }
  });
}
