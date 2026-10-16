/**
 * HANZI GO - HSK ATTEMPT DETAILS HANDLER
 * GET /api/hsk/attempt?id=hsk-att-...
 * ZERO-TRUST: Ngăn chặn tuyệt đối việc xem trộm kết quả bài thi của người khác.
 */
import { getSupabaseAdminClient, verifyRequestAuth } from '../../_utils/supabaseServer.js';
import { getAttemptResult } from '../../../src/services/hskService.js';

export default async function attemptHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const id = req.query?.id || req.body?.id || req.query?.attemptId || req.body?.attemptId;
  if (!id) {
    return res.status(400).json({ error: 'Thiếu mã bài làm (id).' });
  }

  // 1. Thử lấy từ Supabase
  const supabase = getSupabaseAdminClient();
  let attempt = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('hsk_attempts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        attempt = {
          id: data.id,
          examId: data.exam_id,
          userId: data.user_id,
          anonymousSessionId: data.anonymous_session_id,
          timeSpentSeconds: data.time_spent_seconds,
          submittedAnswers: data.submitted_answers,
          score: data.score,
          maxScore: data.max_score,
          accuracyPercentage: Number(data.accuracy_percentage),
          passed: data.passed,
          skillBreakdown: data.skill_breakdown,
          detailedResults: data.detailed_results,
          createdAt: data.created_at
        };
      }
    } catch (err) {
      console.warn('[/api/hsk/attempt] Supabase attempt notice:', err.message);
    }
  }

  // 2. Fallback sang local cache nếu chưa có trên DB
  if (!attempt) {
    attempt = await getAttemptResult(id);
  }

  if (!attempt) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy kết quả bài thi.' });
  }

  // 3. ZERO-TRUST ACCESS CONTROL (SEC-03):
  const auth = await verifyRequestAuth(req);
  const isAdmin = auth.authenticated && auth.user?.role === 'admin';

  if (attempt.userId) {
    // Registered user attempt: Caller MUST be the owner or admin
    if (!auth.authenticated || !auth.user) {
      return res.status(401).json({ error: 'Bài làm thuộc tài khoản cá nhân. Vui lòng đăng nhập để xem.' });
    }
    const isOwner = auth.user.id === attempt.userId;
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Từ chối quyền hạn: Không thể xem bài thi của người dùng khác.' });
    }
  } else if (!isAdmin) {
    // Guest attempt: Caller MUST provide the matching anonymous session ID (SEC-03)
    const clientAnonId = req.headers?.['x-anonymous-session-id'] || req.query?.anonymousSessionId || req.query?.sessionId;
    if (!clientAnonId || String(clientAnonId).trim() !== String(attempt.anonymousSessionId).trim()) {
      return res.status(403).json({ error: 'Từ chối quyền hạn: Không thể truy cập bài làm của khách vãng lai khác.' });
    }
  }

  return res.status(200).json({ success: true, attempt });
}
