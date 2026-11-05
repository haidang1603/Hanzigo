/**
 * =========================================================================
 * HANZI GO - NEWSLETTER ROUTER (Single Vercel Serverless Function)
 * =========================================================================
 * Dispatches:
 * - /api/newsletter/subscribe
 * Consolidates newsletter endpoints to respect Vercel Hobby plan limit.
 * =========================================================================
 */

import subscribeHandler from '../_handlers/newsletter/subscribe.js';

export default async function handler(req, res) {
  const urlPath = req.url ? req.url.split('?')[0] : '';
  const pathAction = urlPath.split('/').filter(Boolean).pop();
  const action = req.query?.action || pathAction;

  if (action === 'subscribe') {
    return subscribeHandler(req, res);
  }

  return res.status(404).json({
    error: `Newsletter endpoint không tồn tại: ${action || 'unknown'}`
  });
}

