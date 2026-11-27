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
import dashboardHandler from '../_handlers/admin/dashboard.js';
import { sendSafeServerError } from '../_utils/supabaseServer.js';

export default async function handler(req, res) {
  try {
    const urlPath = req.url ? req.url.split('?')[0] : '';
    const pathAction = urlPath.split('/').filter(Boolean).pop();
    const action = req.query?.action || pathAction;

    if (action === 'create-user') {
      return await createUserHandler(req, res);
    }
    if (action === 'dashboard') {
      return await dashboardHandler(req, res);
    }

    return res.status(404).json({
      error: `Admin endpoint không tồn tại: ${action || 'unknown'}`
    });
  } catch (err) {
    console.error('[Admin Router Error]:', err);
    return sendSafeServerError(res, 'Lỗi máy chủ nội bộ.', err);
  }
}

