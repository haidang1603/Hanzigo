/**
 * HANZI GO - HSK EXAM HISTORY & COMPARISON HANDLER
 * GET /api/hsk/history?examId=...
 * GET /api/hsk/history?compare=true&attemptA=...&attemptB=...
 */
import { getUserExamHistory, compareExamAttempts, getAttemptResult } from '../../../src/services/hskService.js';
import { verifyRequestAuth } from '../../_utils/supabaseServer.js';

export default async function historyHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { compare, attemptA, attemptB, examId } = req.query || {};

  // Xác thực người dùng (nếu có)
  const auth = await verifyRequestAuth(req);
  const user = auth.authenticated ? auth.user : null;

  // Luồng so sánh 2 bài thi
  if (compare === 'true') {
    if (!attemptA || !attemptB) {
      return res.status(400).json({ error: 'Thiếu attemptA hoặc attemptB để so sánh.' });
    }

    const attA = await getAttemptResult(attemptA);
    const attB = await getAttemptResult(attemptB);

    if (!attA || !attB) {
      return res.status(404).json({ error: 'Không tìm thấy một trong hai bài thi để so sánh.' });
    }

    // Bảo vệ quyền riêng tư: Nếu bài thi gắn với tài khoản cá nhân, người xem phải là chủ sở hữu hoặc admin
    if (user && (attA.userId || attB.userId)) {
      if ((attA.userId && attA.userId !== user.id && user.role !== 'admin') ||
          (attB.userId && attB.userId !== user.id && user.role !== 'admin')) {
        return res.status(403).json({ error: 'Từ chối quyền hạn: Không thể so sánh bài thi của người dùng khác.' });
      }
    }

    const comparison = compareExamAttempts(attA, attB);
    return res.status(200).json({ success: true, comparison });
  }

  // Luồng lấy lịch sử
  const history = await getUserExamHistory({ user, examId });
  return res.status(200).json({ success: true, history });
}
