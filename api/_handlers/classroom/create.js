/**
 * HANZI GO - CLASSROOM CREATE HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function createHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' });
  }

  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

  // Enforce role: Only teachers and admins can create classrooms
  if (auth.user.role !== 'teacher' && auth.user.role !== 'admin' && (!auth.user.id.includes('teacher') || isProd)) {
    return res.status(403).json({ error: 'Chỉ giáo viên hoặc quản trị viên mới có quyền tạo lớp học mới.' });
  }

  const { name, hsk_level, class_code, max_students, description, id } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Tên lớp học là bắt buộc.' });
  }
  if (!class_code || typeof class_code !== 'string' || !class_code.trim()) {
    return res.status(400).json({ error: 'Mã lớp học là bắt buộc.' });
  }

  const teacherId = auth.user.id;
  const cleanCode = String(class_code).trim().toUpperCase().replace(/\s+/g, '');
  const classroomId = id || `cls-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const classRecord = {
    id: classroomId,
    teacher_id: teacherId,
    name: name.trim(),
    description: description ? String(description).trim() : '',
    hsk_level: hsk_level || 'HSK 1',
    class_code: cleanCode,
    max_students: Number(max_students) || 30,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      // Check for code collision upfront
      const { data: existing } = await supabase
        .from('classrooms')
        .select('id')
        .eq('class_code', cleanCode)
        .maybeSingle();

      if (existing) {
        return res.status(409).json({ error: 'Mã lớp học này đã tồn tại trong hệ thống. Vui lòng tạo mã khác.' });
      }

      const { data, error } = await supabase
        .from('classrooms')
        .insert(classRecord)
        .select()
        .maybeSingle();

      if (!error && data) {
        return res.status(200).json({ success: true, classroom: data });
      }
      if (error) {
        if (error.code === '23505' || /unique|duplicate/i.test(error.message || '')) {
          return res.status(409).json({ error: 'Mã lớp học này đã tồn tại trong hệ thống. Vui lòng tạo mã khác.' });
        }
        if (isProd) {
          return res.status(500).json({ error: 'Không thể tạo lớp học: ' + (error.message || 'Lỗi cơ sở dữ liệu') });
        }
        console.warn('[/api/classroom/create] DB error:', error.message);
      }
    } catch (err) {
      if (err.code === '23505' || /unique|duplicate/i.test(err.message || '')) {
        return res.status(409).json({ error: 'Mã lớp học này đã tồn tại trong hệ thống. Vui lòng tạo mã khác.' });
      }
      if (isProd) {
        return res.status(500).json({ error: 'Lỗi máy chủ khi tạo lớp học.' });
      }
      console.warn('[/api/classroom/create] Fallback notice:', err.message);
    }
  } else if (isProd) {
    return res.status(503).json({ error: 'Dịch vụ cơ sở dữ liệu không khả dụng.' });
  }

  return res.status(200).json({ success: true, classroom: classRecord });
}
