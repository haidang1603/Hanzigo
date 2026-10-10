/**
 * =========================================================================
 * HANZI GO - LIVE CLASSROOM ROUTER (Single Vercel Serverless Function)
 * =========================================================================
 * Dispatches:
 * - /api/live/session
 * - /api/live/join
 * - /api/live/leave
 * - /api/live/moderation
 * - /api/live/participants
 * - /api/live/end
 * Consolidates live classroom APIs into a single function to strictly
 * respect the Vercel Hobby plan limit (<= 12 Serverless Functions).
 */

import sessionHandler from '../_handlers/live/session.js';
import joinHandler from '../_handlers/live/join.js';
import leaveHandler from '../_handlers/live/leave.js';
import moderationHandler from '../_handlers/live/moderation.js';
import participantsHandler from '../_handlers/live/participants.js';
import endHandler from '../_handlers/live/end.js';

export default async function handler(req, res) {
  const urlPath = req.url ? req.url.split('?')[0] : '';
  const pathAction = urlPath.split('/').filter(Boolean).pop();
  const action = req.query?.action || pathAction;

  if (action === 'session') {
    return sessionHandler(req, res);
  }

  if (action === 'join') {
    return joinHandler(req, res);
  }

  if (action === 'leave') {
    return leaveHandler(req, res);
  }

  if (action === 'moderation') {
    return moderationHandler(req, res);
  }

  if (action === 'participants') {
    return participantsHandler(req, res);
  }

  if (action === 'end') {
    return endHandler(req, res);
  }

  return res.status(404).json({
    error: `Live Classroom endpoint không tồn tại: ${action || 'unknown'}`
  });
}
