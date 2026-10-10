/**
 * HANZI GO - LIVE PARTICIPANTS HANDLER
 */
import { getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function participantsHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { sessionId } = req.query || {};
  if (!sessionId) {
    return res.status(400).json({ error: 'Thiếu tham số sessionId.' });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('session_participants')
        .select('*, profiles:user_id(name, avatar)')
        .eq('session_id', sessionId);

      if (!error && Array.isArray(data)) {
        const participants = data.map(dp => ({
          id: dp.id,
          session_id: dp.session_id,
          user_id: dp.user_id,
          user_name: dp.profiles?.name || (dp.role === 'teacher' ? 'Giáo viên' : 'Học viên'),
          user_avatar: dp.profiles?.avatar || null,
          role: dp.role,
          joined_at: dp.joined_at,
          left_at: dp.left_at,
          is_mic_allowed: dp.is_mic_allowed,
          total_duration_seconds: dp.total_duration_seconds,
          attendance_status: dp.attendance_status || 'present'
        }));
        return res.status(200).json({ success: true, participants });
      }
    } catch (err) {
      console.warn('[/api/live/participants] Notice:', err.message);
    }
  }

  return res.status(200).json({ success: true, participants: [] });
}
