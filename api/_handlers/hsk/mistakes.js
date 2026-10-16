/**
 * HANZI GO - HSK MISTAKE NOTEBOOK HANDLER
 * GET /api/hsk/mistakes
 * PATCH /api/hsk/mistakes
 * DELETE /api/hsk/mistakes
 */
import {
  getMistakeNotebook,
  updateMistakeStatus,
  removeMistakeItem,
  getMistakePracticeExam
} from '../../../src/services/hskService.js';
import { verifyRequestAuth } from '../../_utils/supabaseServer.js';

export default async function mistakesHandler(req, res) {
  const auth = await verifyRequestAuth(req);
  const user = auth.authenticated ? auth.user : null;

  const clientAnonId = req.headers?.['x-anonymous-session-id'] || req.query?.anonymousSessionId || null;

  if (req.method === 'GET') {
    const { level, skill, status, search, mode } = req.query || {};

    if (mode === 'practice_exam') {
      const practiceExam = await getMistakePracticeExam({ user, level });
      if (!practiceExam) {
        return res.status(404).json({ success: false, error: 'Không có câu hỏi sai nào cần ôn tập.' });
      }
      return res.status(200).json({ success: true, exam: practiceExam });
    }

    const list = await getMistakeNotebook({ user, level, skill, status, search });
    return res.status(200).json({ success: true, mistakes: list });
  }

  if (req.method === 'PATCH') {
    const mistakeId = req.body?.mistakeId || req.query?.mistakeId;
    const status = req.body?.status || req.query?.status;
    if (!mistakeId || !status) {
      return res.status(400).json({ error: 'Thiếu mistakeId hoặc status.' });
    }
    if (!user && !clientAnonId) {
      return res.status(403).json({ success: false, error: 'Từ chối quyền hạn: Thiếu session xác minh quyền sở hữu.' });
    }
    const success = await updateMistakeStatus(mistakeId, status, user, clientAnonId);
    if (!success) {
      return res.status(403).json({ success: false, error: 'Không tìm thấy câu hỏi sai hoặc bạn không có quyền cập nhật.' });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const mistakeId = req.body?.mistakeId || req.query?.mistakeId;
    if (!mistakeId) {
      return res.status(400).json({ error: 'Thiếu mistakeId cần xóa.' });
    }
    if (!user && !clientAnonId) {
      return res.status(403).json({ success: false, error: 'Từ chối quyền hạn: Thiếu session xác minh quyền sở hữu.' });
    }
    const success = await removeMistakeItem(mistakeId, user, clientAnonId);
    if (!success) {
      return res.status(403).json({ success: false, error: 'Không tìm thấy câu hỏi sai hoặc bạn không có quyền xóa.' });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}
