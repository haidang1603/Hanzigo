/**
 * HANZI GO - HSK CONTENT QUALITY REPORT HANDLER (PUBLIC)
 * POST /api/hsk/report
 */
import { submitContentReport } from '../../../src/services/hskReviewService.js';

export default async function reportHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const { resourceId, examId, questionId, reportType, description, reporterEmail } = req.body || {};
  const result = await submitContentReport({
    resourceId,
    examId,
    questionId,
    reportType,
    description,
    reporterEmail
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}
