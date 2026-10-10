/**
 * HANZI GO - CLASSROOM LOOKUP HANDLER
 */
import { getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function lookupHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const { code } = req.query || {};
  if (!code) {
    return res.status(400).json({ error: 'Thiếu mã lớp học (code).' });
  }

  const cleanCode = String(code).trim().toUpperCase().replace(/\s+/g, '');
  const codeWithoutPrefix = cleanCode.replace(/^HZG-?/, '');
  const codeWithPrefix = `HZG-${codeWithoutPrefix}`;

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .or(`class_code.eq.${cleanCode},class_code.eq.${codeWithPrefix},class_code.eq.${codeWithoutPrefix}`)
        .eq('status', 'active')
        .single();

      if (!error && data) {
        return res.status(200).json({ success: true, classroom: data });
      }
    } catch (err) {
      console.warn('[/api/classroom/lookup] Notice:', err.message);
    }
  }

  return res.status(404).json({ success: false, error: 'Không tìm thấy lớp học.' });
}
