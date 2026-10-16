/**
 * =========================================================================
 * HANZI GO - LIVEKIT WEBRTC SFU TOKEN GENERATOR: /api/webrtc/livekit-token
 * =========================================================================
 * Placed in _webrtc so Vercel does not count it as a standalone function.
 */

import { AccessToken, TrackSource } from 'livekit-server-sdk';
import { verifyRequestAuth, getSupabaseAdminClient, memoryParticipants } from '../_utils/supabaseServer.js';

function isValidUuid(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  // FAIL-CLOSED (SEC-05): Production / Preview missing LiveKit credentials must return 503
  const isProd = process.env.NODE_ENV === 'production' || 
                 process.env.VERCEL_ENV === 'production' || 
                 process.env.VERCEL_ENV === 'preview';
  const apiKey = process.env.LIVEKIT_API_KEY || process.env.VITE_LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (isProd && (!apiKey || !apiSecret)) {
    return res.status(503).json({
      error: 'Dịch vụ lớp học trực tuyến tạm thời gián đoạn: chưa cấu hình LiveKit credentials cho môi trường Production/Preview.'
    });
  }

  // 1. Authenticate user identity
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.'
    });
  }

  const userId = String(auth.user.id);
  const userName = auth.user.name || req.body?.userName || 'Người dùng HanziGo';
  const roomName = req.body?.roomName || req.body?.sessionId;

  if (!roomName || typeof roomName !== 'string' || !roomName.trim()) {
    return res.status(400).json({ error: 'Mã phòng học (roomName / sessionId) là bắt buộc.' });
  }

  // 2. Authorize user against class session & membership (Deny by default)
  let verifiedRole = 'student';
  let canPublish = false;

  const supabase = getSupabaseAdminClient();

  if (isProd) {
    if (!supabase) {
      return res.status(503).json({ error: 'Dịch vụ xác thực dữ liệu cơ sở không khả dụng.' });
    }

    try {
      const { data: session, error: sesErr } = await supabase
        .from('class_sessions')
        .select('*, classrooms:classroom_id(*)')
        .eq('id', roomName)
        .maybeSingle();

      if (sesErr) {
        return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu khi xác minh phiên học.' });
      }

      if (!session) {
        return res.status(404).json({ error: 'Phòng học trực tuyến không tồn tại hoặc đã bị xóa.' });
      }

      if (session.status === 'ended' || session.ended_at) {
        return res.status(403).json({ error: 'Phiên học trực tuyến đã kết thúc.' });
      }

      if (session.classrooms && (session.classrooms.status === 'archived' || session.classrooms.status === 'closed')) {
        return res.status(403).json({ error: 'Lớp học hiện tại đã đóng hoặc lưu trữ.' });
      }

      const isTeacherOwner = session.teacher_id === userId || auth.user.role === 'admin';
      if (isTeacherOwner) {
        verifiedRole = 'teacher';
        canPublish = true;
      } else {
        // Verify enrollment in class_members
        const { data: membership, error: memErr } = await supabase
          .from('class_members')
          .select('id, status')
          .eq('classroom_id', session.classroom_id)
          .eq('student_id', userId)
          .eq('status', 'active')
          .maybeSingle();

        if (memErr || !membership) {
          return res.status(403).json({
            error: 'Bạn chưa tham gia lớp học này nên không thể nhận token WebRTC.'
          });
        }

        // Enforce maximum class capacity (50 students limit)
        const { count: activeCount } = await supabase
          .from('session_participants')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', roomName)
          .is('left_at', null)
          .neq('user_id', userId);

        const maxCap = session.max_capacity || 50;
        if (typeof activeCount === 'number' && activeCount >= maxCap) {
          return res.status(403).json({
            error: `Phòng học đã đạt sĩ số tối đa (${maxCap} học viên).`
          });
        }

        verifiedRole = 'student';
        // Authoritative server check: Has teacher granted mic permission in session_participants?
        const { data: partRecord } = await supabase
          .from('session_participants')
          .select('is_mic_allowed')
          .eq('session_id', roomName)
          .eq('user_id', userId)
          .maybeSingle();

        // Quyền publish tính 100% từ dữ liệu có thẩm quyền của database, tuyệt đối không tin client
        canPublish = Boolean(partRecord?.is_mic_allowed);
      }
    } catch (e) {
      console.error('[LiveKit Token] Production verification error:', e.message);
      return res.status(500).json({ error: 'Lỗi nội bộ khi xác thực phiên kết nối WebRTC.' });
    }
  } else if (supabase && isValidUuid(roomName)) {
    try {
      const { data: session } = await supabase
        .from('class_sessions')
        .select('*, classrooms:classroom_id(*)')
        .eq('id', roomName)
        .maybeSingle();

      if (!session) {
        if (auth.user.role === 'admin' || auth.user.role === 'teacher') {
          verifiedRole = 'teacher';
          canPublish = true;
        } else {
          return res.status(404).json({ error: 'Phòng học trực tuyến không tồn tại hoặc đã bị xóa.' });
        }
      } else {
        if (session.status === 'ended' || session.ended_at) {
          return res.status(403).json({ error: 'Phiên học trực tuyến đã kết thúc.' });
        }

        if (session.classrooms && (session.classrooms.status === 'archived' || session.classrooms.status === 'closed')) {
          return res.status(403).json({ error: 'Lớp học hiện tại đã đóng hoặc lưu trữ.' });
        }

        const isTeacherOwner = session.teacher_id === userId || auth.user.role === 'admin' || auth.user.role === 'teacher';
        if (isTeacherOwner) {
          verifiedRole = 'teacher';
          canPublish = true;
        } else {
        const { data: membership } = await supabase
          .from('class_members')
          .select('id, status')
          .eq('classroom_id', session.classroom_id)
          .eq('student_id', userId)
          .eq('status', 'active')
          .maybeSingle();

        if (!membership) {
          return res.status(403).json({
            error: 'Bạn chưa tham gia lớp học này nên không thể nhận token WebRTC.'
          });
        }

        const { count: activeCount } = await supabase
          .from('session_participants')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', roomName)
          .is('left_at', null)
          .neq('user_id', userId);

        const maxCap = session.max_capacity || 50;
        if (typeof activeCount === 'number' && activeCount >= maxCap) {
          return res.status(403).json({
            error: `Phòng học đã đạt sĩ số tối đa (${maxCap} học viên).`
          });
        }

        verifiedRole = 'student';
        const { data: partRecord } = await supabase
          .from('session_participants')
          .select('is_mic_allowed')
          .eq('session_id', roomName)
          .eq('user_id', userId)
          .maybeSingle();

        canPublish = Boolean(partRecord?.is_mic_allowed);
        }
      }
    } catch (e) {
      console.warn('[LiveKit Token] Supabase verification fallback notice:', e.message);
    }
  } else {
    // Development / Local simulation fallback: Determine strictly from authenticated user role
    const isTeacher = auth.user.role === 'teacher' || 
                      auth.user.role === 'admin' ||
                      String(userId).includes('teacher');
    verifiedRole = isTeacher ? 'teacher' : 'student';

    // Simulation capacity check: Count active participants in memory
    if (!isTeacher) {
      let activeCount = 0;
      for (const [key, part] of memoryParticipants.entries()) {
        if (key.startsWith(`${roomName}:`) && !key.endsWith(`:${userId}`) && !part?.left_at) {
          activeCount++;
        }
      }
      if (activeCount >= 50) {
        return res.status(403).json({
          error: 'Phòng học đã đạt sĩ số tối đa (50 học viên).'
        });
      }
    }

    // Students can NEVER publish by default unless authorized on server
    const memPart = memoryParticipants.get(`${roomName}:${userId}`);
    canPublish = isTeacher ? true : Boolean(memPart?.is_mic_allowed);
  }

  // 3. Read LiveKit credentials & enforce Fail-Closed on Production / Preview (SEC-05)
  const livekitUrl = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || '';

  if (isProd && (!apiKey || !apiSecret || !livekitUrl)) {
    return res.status(503).json({
      error: 'Dịch vụ kết nối phòng học trực tuyến LiveKit chưa được cấu hình đầy đủ khóa bí mật trên máy chủ sản xuất.'
    });
  }

  const effectiveApiKey = apiKey || 'devkey';
  const effectiveApiSecret = apiSecret || 'secret';
  const isConfigured = Boolean(livekitUrl && apiKey && apiSecret);

  try {
    const at = new AccessToken(effectiveApiKey, effectiveApiSecret, {
      identity: String(userId),
      name: String(userName),
      metadata: JSON.stringify({ role: verifiedRole, userId }),
      ttl: '30m'
    });

    const videoGrant = {
      room: String(roomName),
      roomJoin: true,
      canPublish: canPublish,
      canPublishData: true,
      canSubscribe: true
    };

    // Least Privilege: Students granted mic can ONLY publish audio/microphone, never camera or screenshare
    if (canPublish && verifiedRole === 'student') {
      videoGrant.canPublishSources = [TrackSource.MICROPHONE];
    }

    at.addGrant(videoGrant);

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
