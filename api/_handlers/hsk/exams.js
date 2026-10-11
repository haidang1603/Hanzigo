/**
 * HANZI GO - HSK EXAMS LIST HANDLER
 * GET /api/hsk/exams?level=HSK 1&skill=reading&type=mock
 * Returns public list of published exams with metadata.
 */
import { HSK_EXAMS } from '../../../src/data/hskExamsData.js';
import { getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function examsHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { level, skill, type, search } = req.query || {};

  // 1. Thử lấy từ Supabase nếu có cấu hình
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      let query = supabase.from('hsk_exams').select('*').eq('is_published', true);
      if (level && level !== 'all') query = query.eq('level', level);
      if (skill && skill !== 'all') query = query.eq('skill_category', skill);
      if (type && type !== 'all') query = query.eq('exam_type', type);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results = data;
        if (search) {
          const s = search.toLowerCase();
          results = results.filter(e => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
        }
        return res.status(200).json({ success: true, exams: results });
      }
    } catch (err) {
      console.warn('[/api/hsk/exams] Supabase fallback to local dataset:', err.message);
    }
  }

  // 2. Fallback sang dataset cục bộ chuẩn
  let list = HSK_EXAMS.filter(e => e.is_published);
  if (level && level !== 'all') list = list.filter(e => e.level.toLowerCase() === level.toLowerCase());
  if (skill && skill !== 'all') list = list.filter(e => e.skill_category.toLowerCase() === skill.toLowerCase() || e.skill_category === 'mixed');
  if (type && type !== 'all') list = list.filter(e => e.exam_type.toLowerCase() === type.toLowerCase());
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(e => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
  }

  return res.status(200).json({ success: true, exams: list });
}
