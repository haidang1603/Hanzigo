/**
 * HANZI GO - LIVE SESSION HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

const memorySessions = new Map();

export default async function sessionHandler(req, res) {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const supabase = getSupabaseAdminClient();

  if (req.method === 'GET') {
    const { classroomId, sessionId } = req.query || {};

    if (sessionId) {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('class_sessions')
            .select('*')
            .eq('id', sessionId)
            .maybeSingle();

          if (!error && data) {
            return res.status(200).json({ success: true, session: data });
          }
          if (isProd) {
            return res.status(200).json({ success: true, session: null });
          }
        } catch (err) {
          console.warn('[/api/live/session] Supabase sessionId query notice:', err.message);
          if (isProd) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu.' });
          }
        }
      }

      const mem = memorySessions.get(sessionId);
      if (mem) {
        return res.status(200).json({ success: true, session: mem });
      }

      return res.status(200).json({ success: true, session: null });
    }

    if (classroomId) {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('class_sessions')
            .select('*')
            .eq('classroom_id', classroomId)
            .eq('status', 'live')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            return res.status(200).json({ success: true, session: data });
          }
          if (isProd) {
            return res.status(200).json({ success: true, session: null });
          }
        } catch (err) {
          console.warn('[/api/live/session] Supabase classroomId query notice:', err.message);
          if (isProd) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu.' });
          }
        }
      }

      for (const ses of memorySessions.values()) {
        if (
          (ses.classroom_id === classroomId || String(ses.classroom_id) === String(classroomId)) &&
          ses.status === 'live'
        ) {
          return res.status(200).json({ success: true, session: ses });
        }
      }

      return res.status(200).json({ success: true, session: null });
    }

    return res.status(400).json({ error: 'Thiếu tham số classroomId hoặc sessionId.' });
  }

  if (req.method === 'POST') {
    const auth = await verifyRequestAuth(req);
    if (!auth.authenticated) {
      return res.status(401).json({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' });
    }

    if (auth.user.role !== 'teacher' && auth.user.role !== 'admin' && (!auth.user.id.includes('teacher') || isProd)) {
      return res.status(403).json({ error: 'Chỉ giáo viên hoặc quản trị viên mới có quyền tạo hoặc cập nhật phiên học.' });
    }

    const session = req.body?.session || req.body;
    if (!session || !session.classroom_id) {
      return res.status(400).json({ error: 'Dữ liệu phiên học không hợp lệ.' });
    }

    if (supabase) {
      try {
        const { data: cls } = await supabase
          .from('classrooms')
          .select('teacher_id, status')
          .eq('id', session.classroom_id)
          .maybeSingle();

        if (cls) {
          if (cls.status !== 'active') {
            return res.status(400).json({ error: 'Lớp học hiện tại đã đóng hoặc lưu trữ.' });
          }
          if (cls.teacher_id !== auth.user.id && auth.user.role !== 'admin') {
            return res.status(403).json({ error: 'Bạn không phải là giáo viên phụ trách lớp học này.' });
          }
        } else if (isProd) {
          return res.status(404).json({ error: 'Lớp học không tồn tại.' });
        }
      } catch (err) {
        console.warn('[/api/live/session] Classroom check notice:', err.message);
      }
    }

    const sessionId = session.id || `ses-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const sessionRecord = {
      ...session,
      id: sessionId,
      teacher_id: auth.user.id,
      status: session.status || 'live',
      started_at: session.started_at || new Date().toISOString(),
      created_at: session.created_at || new Date().toISOString(),
      ended_at: session.status === 'ended' ? (session.ended_at || new Date().toISOString()) : null
    };

    memorySessions.set(sessionId, sessionRecord);

    if (supabase) {
      try {
        if (sessionRecord.status === 'live') {
          await supabase
            .from('class_sessions')
            .update({ status: 'ended', ended_at: new Date().toISOString() })
            .eq('classroom_id', sessionRecord.classroom_id)
            .eq('status', 'live');
        }

        await supabase
          .from('class_sessions')
          .upsert({
            id: sessionRecord.id,
            classroom_id: sessionRecord.classroom_id,
            teacher_id: sessionRecord.teacher_id,
            title: sessionRecord.title || 'Lớp học trực tuyến',
            status: sessionRecord.status,
            started_at: sessionRecord.started_at,
            ended_at: sessionRecord.ended_at,
            max_capacity: sessionRecord.max_capacity || 50
          });
      } catch (err) {
        console.warn('[/api/live/session] Supabase upsert notice:', err.message);
      }
    }

    return res.status(200).json({ success: true, session: sessionRecord });
  }

  return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET hoặc POST.' });
}
