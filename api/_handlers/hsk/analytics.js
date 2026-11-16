/**
 * HANZI GO - HSK LEARNING ANALYTICS & STUDY RECOMMENDATIONS HANDLER
 * GET /api/hsk/analytics
 */
import {
  getUserExamHistory,
  getMistakeNotebook,
  generateStudyAnalytics,
  generateStudyRecommendations
} from '../../../src/services/hskService.js';

export default async function analyticsHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  try {
    const attempts = await getUserExamHistory();
    const mistakes = await getMistakeNotebook();

    const analytics = generateStudyAnalytics(attempts, mistakes);
    const recommendations = generateStudyRecommendations(analytics, mistakes);

    return res.status(200).json({
      success: true,
      analytics,
      recommendations
    });
  } catch (err) {
    console.error('[HSK Analytics Error]:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi tải phân tích HSK.', message: err?.message });
  }
}
