/**
 * HANZI GO - HSK CONTENT REVIEW & PUBLISHING HANDLER (ADMIN ONLY)
 * POST /api/hsk/review
 */
import { transitionContentState } from '../../../src/services/hskReviewService.js';
import { verifyRequestAuth } from '../../_utils/supabaseServer.js';

export default async function reviewHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated || !auth.user) {
    return res.status(401).json({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập với tài khoản Quản trị viên.' });
  }

  const isAdmin = auth.user.role === 'admin';
  if (!isAdmin) {
    return res.status(403).json({ error: 'Từ chối quyền hạn: Chỉ Admin mới có quyền duyệt và xuất bản đề thi.' });
  }

  const { contentId, contentType, targetState } = req.body || {};
  if (!contentId || !targetState) {
    return res.status(400).json({ error: 'Thiếu contentId hoặc targetState.' });
  }

  const result = await transitionContentState({
    contentId,
    contentType,
    targetState,
    user: { ...auth.user, isAdmin: true }
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}
