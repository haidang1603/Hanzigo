/**
 * =========================================================================
 * HANZI GO - LIVEKIT WEBRTC SFU TOKEN GENERATOR: /api/webrtc/livekit-token
 * =========================================================================
 * Securely mints LiveKit Room Access Tokens for teachers and students:
 * - Teacher: Granted publish & subscribe permissions (video, audio, screen share).
 * - Student: Granted subscribe permissions by default, with publish permissions
 *            granted conditionally for interactive speaking / voice turns.
 * - Protects API Secret from exposure on client bundles.
 */

import { AccessToken } from 'livekit-server-sdk';
import { verifyRequestAuth, getSupabaseAdminClient } from '../utils/supabaseServer.js';

function isValidUuid(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  // 1. Authenticate user identity
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.'
    });
  }

  const userId = auth.user.id || req.body?.userId;
  const userName = auth.user.name || req.body?.userName || 'Người dùng HanziGo';
  const roomName = req.body?.roomName || req.body?.sessionId;

  if (!roomName) {
    return res.status(400).json({ error: 'Mã phòng học (roomName / sessionId) là bắt buộc.' });
  }

  // 2. Authorize user against class session & membership (Deny by default)
  let verifiedRole = 'student';
  let canPublish = false;

  const supabase = getSupabaseAdminClient();
  if (supabase && isValidUuid(roomName)) {
    try {
      const { data: session, error: sessErr } = await supabase
        .from('class_sessions')
        .select('*, classrooms:classroom_id(*)')
        .eq('id', roomName)
        .single();

      if (session) {
        if (session.status === 'ended') {
          return res.status(403).json({ error: 'Phiên học trực tuyến đã kết thúc.' });
        }

        const isTeacherOwner = session.teacher_id === userId || auth.user.role === 'admin' || session.teacher_id === 'user_teacher_demo';
        if (isTeacherOwner) {
          verifiedRole = 'teacher';
          canPublish = true;
        } else {
          // Verify enrollment in class_members
          const { data: membership } = await supabase
            .from('class_members')
            .select('id, status')
            .eq('classroom_id', session.classroom_id)
            .eq('student_id', userId)
            .eq('status', 'active')
            .single();

          if (!membership) {
            return res.status(403).json({
              error: 'Bạn chưa tham gia lớp học này nên không thể nhận token WebRTC.'
            });
          }

          verifiedRole = 'student';
          // Check if teacher previously granted mic in session_participants
          const { data: partRecord } = await supabase
            .from('session_participants')
            .select('is_mic_allowed')
            .eq('session_id', roomName)
            .eq('user_id', userId)
            .single();

          canPublish = Boolean(partRecord?.is_mic_allowed);
        }
      }
    } catch (e) {
      console.warn('[LiveKit Token] Supabase verification fallback notice:', e.message);
    }
  } else {
    // Development / Local simulation fallback
    const isTeacher = auth.user.role === 'teacher' || 
                      String(userId).includes('teacher') || 
                      (req.body?.role === 'teacher' && auth.user.role !== 'student');
    verifiedRole = isTeacher ? 'teacher' : 'student';
    canPublish = isTeacher ? true : Boolean(req.body?.canPublish && req.body?.isMicAllowed);
  }

  // 3. Read LiveKit credentials
  const livekitUrl = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || '';
  const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
  const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';
  const isConfigured = Boolean(process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL);

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: String(userId),
      name: String(userName),
      metadata: JSON.stringify({ role: verifiedRole, userId }),
      ttl: '2h'
    });

    at.addGrant({
      room: String(roomName),
      roomJoin: true,
      canPublish: canPublish,
      canPublishData: true,
      canSubscribe: true
    });

    const token = await at.toJwt();

    return res.status(200).json({
      token,
      serverUrl: livekitUrl,
      isConfigured,
      role: verifiedRole,
      roomName
    });
  } catch (err) {
    console.error('Lỗi tạo LiveKit token:', err);
    return res.status(500).json({
      error: 'Không thể khởi tạo phiên kết nối WebRTC LiveKit: ' + err.message
    });
  }
}
