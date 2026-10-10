/**
 * HANZI GO - LIVE LEAVE HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function leaveHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
  }

  const { sessionId, userId } = req.body || {};
  if (!sessionId || !userId) {
    return res.status(400).json({ error: 'Thiếu thông tin sessionId hoặc userId.' });
  }

  const effectiveUserId = auth.user.id;
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const now = new Date();
      const { data: existing } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', effectiveUserId)
        .single();

      if (existing) {
        const joinTime = new Date(existing.joined_at || now);
        const addedSeconds = Math.max(0, Math.floor((now.getTime() - joinTime.getTime()) / 1000));
        const totalDuration = (existing.total_duration_seconds || 0) + addedSeconds;

        await supabase
          .from('session_participants')
          .update({
            left_at: now.toISOString(),
            total_duration_seconds: totalDuration
          })
          .eq('session_id', sessionId)
          .eq('user_id', effectiveUserId);
      }
    } catch (err) {
      console.warn('[/api/live/leave] Notice:', err.message);
    }
  }

  return res.status(200).json({ success: true });
}
