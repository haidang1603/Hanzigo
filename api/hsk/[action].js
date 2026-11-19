/**
 * =========================================================================
 * HANZI GO - HSK PRACTICE ROUTER (Single Vercel Serverless Function)
 * =========================================================================
 * Dispatches:
 * - /api/hsk/exams
 * - /api/hsk/exam
 * - /api/hsk/submit
 * - /api/hsk/attempt
 * - /api/hsk/history
 * - /api/hsk/mistakes
 * - /api/hsk/analytics
 * - /api/hsk/resources
 * - /api/hsk/import
 * - /api/hsk/review
 * - /api/hsk/report
 * Consolidates HSK practice APIs into a single function to strictly respect
 * the Vercel Hobby plan limit (<= 12 Serverless Functions).
 */

import examsHandler from '../_handlers/hsk/exams.js';
import examDetailHandler from '../_handlers/hsk/exam.js';
import submitHandler from '../_handlers/hsk/submit.js';
import attemptHandler from '../_handlers/hsk/attempt.js';
import historyHandler from '../_handlers/hsk/history.js';
import mistakesHandler from '../_handlers/hsk/mistakes.js';
import analyticsHandler from '../_handlers/hsk/analytics.js';
import resourcesHandler from '../_handlers/hsk/resources.js';
import importHandler from '../_handlers/hsk/import.js';
import reviewHandler from '../_handlers/hsk/review.js';
import reportHandler from '../_handlers/hsk/report.js';
import { handleVerifyCertificate, handleIssueCertificate } from '../_handlers/hsk/certificate.js';
import { sendSafeServerError } from '../_utils/supabaseServer.js';

export default async function handler(req, res) {
  try {
    const urlPath = req.url ? req.url.split('?')[0] : '';
    const pathAction = urlPath.split('/').filter(Boolean).pop();
    const action = req.query?.action || pathAction;

    if (action === 'verify-certificate') {
      return await handleVerifyCertificate(req, res);
    }

    if (action === 'issue-certificate') {
      return await handleIssueCertificate(req, res);
    }

    if (action === 'exams') {
      return await examsHandler(req, res);
    }

    if (action === 'exam') {
      return await examDetailHandler(req, res);
    }

    if (action === 'submit') {
      return await submitHandler(req, res);
    }

    if (action === 'attempt') {
      return await attemptHandler(req, res);
    }

    if (action === 'history') {
      return await historyHandler(req, res);
    }

    if (action === 'mistakes') {
      return await mistakesHandler(req, res);
    }

    if (action === 'analytics') {
      return await analyticsHandler(req, res);
    }

    if (action === 'resources') {
      return await resourcesHandler(req, res);
    }

    if (action === 'import') {
      return await importHandler(req, res);
    }

    if (action === 'review') {
      return await reviewHandler(req, res);
    }

    if (action === 'report') {
      return await reportHandler(req, res);
    }

    return res.status(404).json({
      error: `HSK Practice endpoint không tồn tại: ${action || 'unknown'}`
    });
  } catch (err) {
    console.error('[HSK Router Error]:', err);
    return sendSafeServerError(res, 'Lỗi máy chủ nội bộ.', err);
  }
}
