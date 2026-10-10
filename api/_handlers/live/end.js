/**
 * HANZI GO - LIVE END HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

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
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
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
  }

  return res.status(200).json({ success: true, endedAt: closeTime });
}
