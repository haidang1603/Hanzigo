/**
 * =========================================================================
 * HANZI GO - CLASSROOM ROUTER (Single Vercel Serverless Function)
 * =========================================================================
 * Dispatches:
 * - /api/classroom/lookup
 * - /api/classroom/join
 * - /api/classroom/members
 * - /api/classroom/remove
 * Consolidates classroom APIs into a single function to strictly respect
 * the Vercel Hobby plan limit (<= 12 Serverless Functions).
 */

import lookupHandler from '../_handlers/classroom/lookup.js';
import joinHandler from '../_handlers/classroom/join.js';
import membersHandler from '../_handlers/classroom/members.js';
import removeHandler from '../_handlers/classroom/remove.js';
import createHandler from '../_handlers/classroom/create.js';
import assignmentsHandler from '../_handlers/classroom/assignments.js';

export default async function handler(req, res) {
  try {
    const urlPath = req.url ? req.url.split('?')[0] : '';
    const pathAction = urlPath.split('/').filter(Boolean).pop();
    const action = req.query?.action || pathAction;

    if (action === 'lookup') {
      return await lookupHandler(req, res);
    }

    if (action === 'create') {
      return await createHandler(req, res);
    }

    if (action === 'join') {
      return await joinHandler(req, res);
    }

    if (action === 'members') {
      return await membersHandler(req, res);
    }

    if (action === 'remove') {
      return await removeHandler(req, res);
    }

    if (action === 'assignments') {
      return await assignmentsHandler(req, res);
    }

    return res.status(404).json({
      error: `Classroom endpoint không tồn tại: ${action || 'unknown'}`
    });
  } catch (err) {
    console.error('[Classroom Router Error]:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ.', message: err?.message });
    }
  }
}
