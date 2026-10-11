/**
 * HANZI GO - HSK ATTEMPT DETAILS HANDLER
 * GET /api/hsk/attempt?id=hsk-att-...
 */
import { getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function attemptHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ error: 'Thiếu mã bài làm (id).' });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('hsk_attempts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return res.status(200).json({ success: true, attempt: data });
      }
    } catch (err) {
      console.warn('[/api/hsk/attempt] Supabase attempt notice:', err.message);
    }
  }

  return res.status(404).json({ success: false, error: 'Không tìm thấy kết quả bài thi.' });
}
