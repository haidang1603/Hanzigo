/**
 * =========================================================================
 * HANZI GO - ADMIN SERVERLESS ROUTER (Single Vercel Function)
 * =========================================================================
 * Dispatches:
 * - /api/admin/create-user
 * 
 * Consolidates Admin endpoints to respect Vercel Serverless Function limit.
 */

import createUserHandler from '../_handlers/admin/create-user.js';

export default async function handler(req, res) {
  try {
    const urlPath = req.url ? req.url.split('?')[0] : '';
    const pathAction = urlPath.split('/').filter(Boolean).pop();
    const action = req.query?.action || pathAction;

    if (action === 'create-user') {
      return await createUserHandler(req, res);
    }

    return res.status(404).json({
      error: `Admin endpoint không tồn tại: ${action || 'unknown'}`
    });
  } catch (err) {
    console.error('[Admin Router Error]:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ.', message: err?.message });
    }
  }
}

