/**
 * HANZI GO - HSK EXAM DETAIL & TAKING DATA HANDLER
 * GET /api/hsk/exam?id=hsk1-mock-01
 * BẢO MẬT BẮT BUỘC: 
 * 1. Tuyệt đối tước bỏ correct_option_index & explanation trước khi phản hồi!
 * 2. Đề thi chưa xuất bản (is_published = false) chỉ Admin mới được truy cập.
 */
import { getSanitizedExamForTaking } from '../../../src/data/hskExamsData.js';
import { getSupabaseAdminClient, verifyRequestAuth } from '../../_utils/supabaseServer.js';

export default async function examDetailHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ error: 'Thiếu mã đề thi (id).' });
  }

  const auth = await verifyRequestAuth(req);
  const isAdmin = auth.authenticated && auth.user?.role === 'admin';

  // 1. Thử lấy từ Supabase
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data: examData, error: examErr } = await supabase
        .from('hsk_exams')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!examErr && examData) {
        if (!examData.is_published && !isAdmin) {
          return res.status(403).json({ success: false, error: 'Đề thi hiện chưa được xuất bản hoặc đang bảo trì.' });
        }

        // Lấy câu hỏi từ VIEW bảo mật (đã tước bỏ đáp án & lời giải)
        const { data: questionsData } = await supabase
          .from('v_hsk_questions_public')
          .select('*')
          .eq('exam_id', id)
          .order('question_number', { ascending: true });

        return res.status(200).json({
          success: true,
          exam: {
            ...examData,
            questions: (questionsData || []).map(q => {
              const { correct_option_index, explanation, ...safeQ } = q;
              return safeQ;
            })
          }
        });
      }
    } catch (err) {
      console.warn('[/api/hsk/exam] Supabase notice, falling back:', err.message);
    }
  }

  // 2. Fallback sang local dataset đã được bóc tách bảo mật
  const sanitized = getSanitizedExamForTaking(id);
  if (!sanitized) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy đề thi.' });
  }

  // Chặn học viên/khách vãng lai xem đề chưa xuất bản
  if (!sanitized.is_published && !isAdmin) {
    return res.status(403).json({ success: false, error: 'Đề thi hiện chưa được xuất bản hoặc đang bảo trì.' });
  }

  return res.status(200).json({ success: true, exam: sanitized });
}
