/**
 * =========================================================================
 * HANZI GO - WEBRTC ROUTER (Single Vercel Serverless Function)
 * =========================================================================
 * Dispatches:
 * - /api/webrtc/ice-servers
 * - /api/webrtc/livekit-token
 * Consolidates multiple endpoints into a single function to stay within
 * Vercel Hobby plan limit (<= 12 Serverless Functions).
 */

import iceServersHandler from '../_webrtc/ice-servers.js';
import livekitTokenHandler from '../_webrtc/livekit-token.js';

export default async function handler(req, res) {
  try {
    const urlPath = req.url ? req.url.split('?')[0] : '';
    const pathAction = urlPath.split('/').filter(Boolean).pop();
    const action = req.query?.action || pathAction;

    if (action === 'ice-servers') {
      return await iceServersHandler(req, res);
    }

    if (action === 'livekit-token') {
      return await livekitTokenHandler(req, res);
    }

    return res.status(404).json({
      error: `WebRTC endpoint không tồn tại: ${action || 'unknown'}`
    });
  } catch (err) {
    console.error('[WebRTC Router Error]:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ.', message: err?.message });
    }
  }
}
