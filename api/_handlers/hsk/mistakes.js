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

export default async function mistakesHandler(req, res) {
  if (req.method === 'GET') {
    const { level, skill, status, search, mode } = req.query || {};

    if (mode === 'practice_exam') {
      const practiceExam = await getMistakePracticeExam({ level });
      if (!practiceExam) {
        return res.status(404).json({ success: false, error: 'Không có câu hỏi sai nào cần ôn tập.' });
      }
      return res.status(200).json({ success: true, exam: practiceExam });
    }

    const list = await getMistakeNotebook({ level, skill, status, search });
    return res.status(200).json({ success: true, mistakes: list });
  }

  if (req.method === 'PATCH') {
    const { mistakeId, status } = req.body || {};
    if (!mistakeId || !status) {
      return res.status(400).json({ error: 'Thiếu mistakeId hoặc status.' });
    }
    const success = await updateMistakeStatus(mistakeId, status);
    return res.status(200).json({ success });
  }

  if (req.method === 'DELETE') {
    const { mistakeId } = req.body || {};
    if (!mistakeId) {
      return res.status(400).json({ error: 'Thiếu mistakeId cần xóa.' });
    }
    const success = await removeMistakeItem(mistakeId);
    return res.status(200).json({ success });
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}
