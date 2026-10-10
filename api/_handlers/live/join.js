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

  const { session_id, participant } = req.body || {};
  if (!session_id || !participant) {
    return res.status(400).json({ error: 'Thiếu thông tin session_id hoặc participant.' });
  }

  const userId = auth.user.id;
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('session_participants')
        .upsert({
          session_id,
          user_id: userId,
          role: participant.role || 'student',
          joined_at: participant.joined_at || new Date().toISOString(),
          left_at: null,
          total_duration_seconds: participant.total_duration_seconds || 0,
          is_mic_allowed: Boolean(participant.is_mic_allowed),
          attendance_status: participant.attendance_status || 'present'
        }, { onConflict: 'session_id,user_id' })
        .select()
        .single();

      if (!error && data) {
        return res.status(200).json({ success: true, participant: data });
      }
    } catch (err) {
      console.warn('[/api/live/join] Fallback notice:', err.message);
    }
  }

  return res.status(200).json({ success: true, participant });
}
