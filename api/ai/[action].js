/**
 * =========================================================================
 * HANZI GO - AI ROUTER (Single Vercel Serverless Function)
 * =========================================================================
 * Dispatches:
 * - /api/ai/chat
 * - /api/ai/coach
 * - /api/ai/personalize
 * - /api/ai/pronunciation
 * - /api/ai/roleplay
 * - /api/ai/teacher
 * - /api/ai/tutor
 * Consolidates all 7 AI endpoints into a single Serverless Function to
 * strictly respect the Vercel Hobby plan limit (<= 12 Serverless Functions).
 * =========================================================================
 */

import chatHandler from '../_handlers/ai/chat.js';
import coachHandler from '../_handlers/ai/coach.js';
import gradeHandler from '../_handlers/ai/grade.js';
import personalizeHandler from '../_handlers/ai/personalize.js';
import pronunciationHandler from '../_handlers/ai/pronunciation.js';
import roleplayHandler from '../_handlers/ai/roleplay.js';
import teacherHandler from '../_handlers/ai/teacher.js';
import tutorHandler from '../_handlers/ai/tutor.js';

export default async function handler(req, res) {
  const urlPath = req.url ? req.url.split('?')[0] : '';
  const pathAction = urlPath.split('/').filter(Boolean).pop();
  const action = req.query?.action || pathAction;

  switch (action) {
    case 'chat':
      return chatHandler(req, res);
    case 'coach':
      return coachHandler(req, res);
    case 'grade':
      return gradeHandler(req, res);
    case 'personalize':
      return personalizeHandler(req, res);
    case 'pronunciation':
      return pronunciationHandler(req, res);
    case 'roleplay':
      return roleplayHandler(req, res);
    case 'teacher':
      return teacherHandler(req, res);
    case 'tutor':
      return tutorHandler(req, res);
    default:
      return res.status(404).json({
        error: `AI endpoint không tồn tại: ${action || 'unknown'}`
      });
  }
}

