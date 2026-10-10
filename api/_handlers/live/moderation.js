/**
 * HANZI GO - LIVE MODERATION HANDLER
 */
import { RoomServiceClient } from 'livekit-server-sdk';
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function moderationHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
  }

  const { sessionId, action, targetUserId } = req.body || {};
  if (!sessionId || !action) {
    return res.status(400).json({ error: 'Thiếu thông tin sessionId hoặc action.' });
  }

  const callerId = auth.user.id;
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data: session } = await supabase
        .from('class_sessions')
        .select('teacher_id')
        .eq('id', sessionId)
        .single();

      if (session && session.teacher_id !== callerId && auth.user.role !== 'admin' && session.teacher_id !== 'user_teacher_demo') {
        return res.status(403).json({ error: 'Chỉ giáo viên phụ trách phòng học mới có quyền điều khiển.' });
      }
    } catch {}
  }

  const livekitUrl = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  let sfuUpdated = false;
  if (livekitUrl && apiKey && apiSecret) {
    try {
      const httpUrl = livekitUrl.replace(/^wss:\/\//i, 'https://').replace(/^ws:\/\//i, 'http://');
      const roomClient = new RoomServiceClient(httpUrl, apiKey, apiSecret);

      if (action === 'ALLOW_MIC' && targetUserId) {
        await roomClient.updateParticipant(sessionId, targetUserId, undefined, {
          canPublish: true,
          canSubscribe: true,
          canPublishData: true
        });
        sfuUpdated = true;
      } else if (action === 'REVOKE_MIC' && targetUserId) {
        await roomClient.updateParticipant(sessionId, targetUserId, undefined, {
          canPublish: false,
          canSubscribe: true,
          canPublishData: true
        });
        sfuUpdated = true;
      } else if (action === 'MUTE_ALL') {
        const participants = await roomClient.listParticipants(sessionId);
        for (const p of participants) {
          let meta = {};
          try { meta = JSON.parse(p.metadata || '{}'); } catch {}
          if (meta.role !== 'teacher' && p.identity !== callerId) {
            await roomClient.updateParticipant(sessionId, p.identity, undefined, {
              canPublish: false,
              canSubscribe: true,
              canPublishData: true
            }).catch(() => {});
          }
        }
        sfuUpdated = true;
      } else if (action === 'KICK' && targetUserId) {
        await roomClient.removeParticipant(sessionId, targetUserId).catch(() => {});
        sfuUpdated = true;
      }
    } catch (err) {
      console.warn('[/api/live/moderation] LiveKit SFU update notice:', err.message);
    }
  }

  if (supabase) {
    try {
      if (action === 'ALLOW_MIC' && targetUserId) {
        await supabase
          .from('session_participants')
          .update({ is_mic_allowed: true })
          .eq('session_id', sessionId)
          .eq('user_id', targetUserId);
      } else if (action === 'REVOKE_MIC' && targetUserId) {
        await supabase
          .from('session_participants')
          .update({ is_mic_allowed: false })
          .eq('session_id', sessionId)
          .eq('user_id', targetUserId);
      } else if (action === 'MUTE_ALL') {
        await supabase
          .from('session_participants')
          .update({ is_mic_allowed: false })
          .eq('session_id', sessionId)
          .neq('role', 'teacher');
      } else if (action === 'KICK' && targetUserId) {
        await supabase
          .from('session_participants')
          .update({ left_at: new Date().toISOString() })
          .eq('session_id', sessionId)
          .eq('user_id', targetUserId);
      }
    } catch {}
  }

  return res.status(200).json({
    success: true,
    action,
    sfuUpdated,
    sessionId,
    targetUserId: targetUserId || null
  });
}
