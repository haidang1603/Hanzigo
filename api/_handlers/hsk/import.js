/**
 * HANZI GO - HSK CONTENT IMPORT HANDLER (ADMIN ONLY)
 * POST /api/hsk/import
 */
import { importHskExamWithValidation, validateHskImportPayload } from '../../../src/services/hskImportService.js';
import { verifyRequestAuth } from '../../_utils/supabaseServer.js';

export default async function importHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  // 1. Xác thực quyền Admin
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated || !auth.user) {
    return res.status(401).json({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập với tài khoản Quản trị viên.' });
  }

  const isAdmin = auth.user.role === 'admin' || (auth.user.email && auth.user.email.includes('admin'));
  if (!isAdmin) {
    return res.status(403).json({ error: 'Từ chối quyền hạn: Chỉ Admin mới có quyền thực hiện nhập liệu đề thi.' });
  }

  const { payload, dryRun = true } = req.body || {};
  if (!payload) {
    return res.status(400).json({ error: 'Thiếu gói dữ liệu payload đề thi.' });
  }

  const result = await importHskExamWithValidation(payload, { ...auth.user, isAdmin: true }, Boolean(dryRun));
  if (!result.success) {
    return res.status(422).json(result);
  }

  return res.status(200).json(result);
}
