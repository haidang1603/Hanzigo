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
import { verifyRequestAuth } from '../ai/verifyAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  // 1. Authenticate user
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.'
    });
  }

  const userId = auth.user.id || req.body?.userId;
  const userName = auth.user.name || req.body?.userName || 'Người dùng HanziGo';
  const role = req.body?.role === 'teacher' ? 'teacher' : 'student';
  const roomName = req.body?.roomName || req.body?.sessionId;

  if (!roomName) {
    return res.status(400).json({ error: 'Mã phòng học (roomName / sessionId) là bắt buộc.' });
  }

  // 2. Read LiveKit credentials
  const livekitUrl = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || '';
  const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
  const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';
  const isConfigured = Boolean(process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL);

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: String(userId),
      name: String(userName),
      metadata: JSON.stringify({ role, userId }),
      ttl: '2h'
    });

    const isTeacher = role === 'teacher';
    at.addGrant({
      room: String(roomName),
      roomJoin: true,
      canPublish: isTeacher || Boolean(req.body?.canPublish),
      canPublishData: true,
      canSubscribe: true
    });

    const token = await at.toJwt();

    return res.status(200).json({
      token,
      serverUrl: livekitUrl,
      isConfigured,
      role,
      roomName
    });
  } catch (err) {
    console.error('Lỗi tạo LiveKit token:', err);
    return res.status(500).json({
      error: 'Không thể khởi tạo phiên kết nối WebRTC LiveKit: ' + err.message
    });
  }
}
