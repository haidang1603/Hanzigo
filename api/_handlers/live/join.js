/**
 * HANZI GO - LIVE JOIN HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient, memoryParticipants } from '../../_utils/supabaseServer.js';

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

  if (isProd && !supabase) {
    return res.status(503).json({ error: 'Dịch vụ cơ sở dữ liệu phòng học không khả dụng.' });
  }

  let verifiedRole = 'student';

  if (supabase) {
    try {
      const { data: session } = await supabase
        .from('class_sessions')
        .select('teacher_id, status, ended_at, classroom_id, max_capacity')
        .eq('id', session_id)
        .maybeSingle();

      if (session) {
        if (session.status === 'ended' || session.ended_at) {
          return res.status(403).json({ error: 'Phiên học trực tuyến đã kết thúc.' });
        }

        const isTeacherOwner = session.teacher_id === userId || auth.user.role === 'admin';
        verifiedRole = isTeacherOwner ? 'teacher' : 'student';

        // Non-teacher participants must be verified class members in production
        if (!isTeacherOwner) {
          if (isProd) {
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
        }

        // Attempt atomic serialized RPC join first (if migration 20261016_phase5 applied)
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('atomic_join_live_session', {
            p_session_id: session_id,
            p_user_id: userId,
            p_role: verifiedRole,
            p_attendance_status: participant.attendance_status || 'present'
          });

          if (!rpcError && rpcData) {
            return res.status(200).json({ success: true, participant: rpcData });
          }

          if (rpcError && rpcError.message) {
            if (rpcError.message.includes('sĩ số tối đa') || rpcError.message.includes('đã kết thúc')) {
              return res.status(403).json({ error: rpcError.message });
            }
            if (rpcError.message.includes('không tồn tại')) {
              return res.status(404).json({ error: rpcError.message });
            }
          }
        } catch {
          // If RPC not installed on DB, gracefully continue to direct query/upsert fallback
        }

        if (!isTeacherOwner) {
          // Enforce 50 students capacity limit (teacher is excluded)
          const maxCap = session.max_capacity || 50;
          const { count: activeCount, error: countErr } = await supabase
            .from('session_participants')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session_id)
            .is('left_at', null)
            .neq('role', 'teacher')
            .neq('user_id', userId);

          if (countErr && isProd) {
            return res.status(500).json({ error: 'Không thể xác minh sĩ số phòng học.' });
          }

          if (typeof activeCount === 'number' && activeCount >= maxCap) {
            return res.status(403).json({ error: `Phòng học đã đạt sĩ số tối đa (${maxCap} học viên).` });
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

      if (error && isProd) {
        return res.status(500).json({ error: 'Không thể ghi nhận thông tin tham gia phòng học vào cơ sở dữ liệu.' });
      }
    } catch (err) {
      console.warn('[/api/live/join] Fallback notice:', err.message);
      if (isProd) {
        return res.status(500).json({ error: 'Lỗi hệ thống khi tham gia phòng học trực tuyến.' });
      }
    }
  } else {
    const isTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher' || userId.includes('teacher');
    verifiedRole = isTeacher ? 'teacher' : 'student';

    if (!isTeacher) {
      let activeCount = 0;
      for (const [key, part] of memoryParticipants.entries()) {
        if (key.startsWith(`${session_id}:`) && !key.endsWith(`:${userId}`) && !part?.left_at && part?.role !== 'teacher') {
          activeCount++;
        }
      }
      if (activeCount >= 50) {
        return res.status(403).json({ error: 'Phòng học đã đạt sĩ số tối đa (50 học viên).' });
      }
    }

    memoryParticipants.set(`${session_id}:${userId}`, {
      session_id,
      user_id: userId,
      role: verifiedRole,
      joined_at: participant.joined_at || new Date().toISOString(),
      left_at: null,
      is_mic_allowed: verifiedRole === 'teacher'
    });
  }

  if (isProd) {
    return res.status(500).json({ error: 'Không thể xác thực và ghi nhận người tham gia trong môi trường sản xuất.' });
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
