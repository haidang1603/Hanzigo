/**
 * =========================================================================
 * HANZI GO - SECURE SERVERLESS API: /api/webrtc/ice-servers
 * =========================================================================
 * Placed in _webrtc so Vercel does not count it as a standalone function.
 */

import crypto from 'node:crypto';
import { verifyRequestAuth } from '../_utils/supabaseServer.js';

export const DEFAULT_STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
];

export default async function handler(req, res) {
  // 1. Method Enforce
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không hợp lệ. Chỉ chấp nhận GET hoặc POST.' });
  }

  // 2. Authentication & JWT Validation
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập để yêu cầu ICE servers.'
    });
  }

  const userId = auth.user.id;
  const turnSecret = process.env.TURN_SHARED_SECRET;
  const turnServerUrl = process.env.TURN_SERVER_URL || process.env.COTURN_SERVER_URL;

  // 3. Ephemeral TURN Generation (RFC 5766) if configured on server
  if (turnSecret && turnServerUrl) {
    const ttlSeconds = 3600; // 1 hour validity
    const expiryTimestamp = Math.floor(Date.now() / 1000) + ttlSeconds;
    const ephemeralUsername = `${expiryTimestamp}:${userId}`;

    // Compute HMAC-SHA1 hash using the server-side shared secret
    const hmac = crypto.createHmac('sha1', turnSecret);
    hmac.update(ephemeralUsername);
    const ephemeralCredential = hmac.digest('base64');

    const iceServers = [
      ...DEFAULT_STUN_SERVERS,
      {
        urls: [
          `turn:${turnServerUrl}?transport=udp`,
          `turn:${turnServerUrl}?transport=tcp`,
          `turns:${turnServerUrl}?transport=tcp`
        ],
        username: ephemeralUsername,
        credential: ephemeralCredential
      }
    ];

    return res.status(200).json({
      iceServers,
      ttl: ttlSeconds,
      expiresAt: new Date(expiryTimestamp * 1000).toISOString(),
      type: 'ephemeral'
    });
  }

  // 4. Default High-Availability STUN Servers
  return res.status(200).json({
    iceServers: DEFAULT_STUN_SERVERS,
    ttl: 86400,
    type: 'stun_only'
  });
}
