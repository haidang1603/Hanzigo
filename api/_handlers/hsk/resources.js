/**
 * HANZI GO - HSK PUBLIC RESOURCES HANDLER
 * GET /api/hsk/resources
 */
import { getPublicHskResources } from '../../../src/services/hskReviewService.js';

export default async function resourcesHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  try {
    const { level, category, skill, format, search } = req.query || {};
    const resources = await getPublicHskResources({ level, category, skill, format, search });

    return res.status(200).json({
      success: true,
      total: resources.length,
      resources
    });
  } catch (err) {
    console.error('[HSK Resources Error]:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi tải tài liệu HSK.', message: err?.message });
  }
}
