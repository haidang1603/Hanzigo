/**
 * HANZI GO - LIVE END HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient, memoryParticipants } from '../../_utils/supabaseServer.js';

export default async function endHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
  }

  const { sessionId, endedAt } = req.body || {};
  if (!sessionId) {
    return res.status(400).json({ error: 'Thiếu thông tin sessionId.' });
  }

  const closeTime = endedAt || new Date().toISOString();
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data: session } = await supabase
        .from('class_sessions')
        .select('teacher_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (session) {
        if (session.teacher_id !== auth.user.id && auth.user.role !== 'admin') {
          return res.status(403).json({ error: 'Chỉ giáo viên phụ trách mới có quyền kết thúc buổi học.' });
        }
      } else if (isProd) {
        return res.status(404).json({ error: 'Phòng học trực tuyến không tồn tại.' });
      } else if (auth.user.role !== 'teacher' && auth.user.role !== 'admin' && !auth.user.id.includes('teacher')) {
        return res.status(403).json({ error: 'Chỉ giáo viên phụ trách mới có quyền kết thúc buổi học.' });
      }

      await supabase
        .from('class_sessions')
        .update({ status: 'ended', ended_at: closeTime })
        .eq('id', sessionId);

      await supabase
        .from('session_participants')
        .update({
          left_at: closeTime,
          mic_enabled: false,
          camera_enabled: false,
          hand_raised: false
        })
        .eq('session_id', sessionId)
        .is('left_at', null);
    } catch (err) {
      console.warn('[/api/live/end] Notice:', err.message);
    }
  } else if (auth.user.role !== 'teacher' && auth.user.role !== 'admin' && (!auth.user.id.includes('teacher') || isProd)) {
    return res.status(403).json({ error: 'Chỉ giáo viên phụ trách mới có quyền kết thúc buổi học.' });
  }

  for (const [key, part] of memoryParticipants.entries()) {
    if (key.startsWith(`${sessionId}:`)) {
      part.left_at = closeTime;
      part.is_mic_allowed = false;
    }
  }

  return res.status(200).json({ success: true, endedAt: closeTime });
}
