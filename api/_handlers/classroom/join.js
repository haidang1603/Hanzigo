/**
 * HANZI GO - CLASSROOM JOIN HANDLER
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function joinHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
  }

  const { class_code, classroom_id, student } = req.body || {};
  if (!class_code && !classroom_id) {
    return res.status(400).json({ error: 'Thiếu mã lớp học hoặc classroom_id.' });
  }

  const userId = auth.user.id;
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      if (class_code) {
        const cleanCode = String(class_code).trim().toUpperCase().replace(/\s+/g, '');
        const { data: rpcData, error: rpcErr } = await supabase.rpc('join_class_by_code', {
          p_class_code: cleanCode
        });

        if (!rpcErr && rpcData?.success) {
          return res.status(200).json(rpcData);
        }
      }

      let targetClassId = classroom_id;
      if (!targetClassId && class_code) {
        const cleanCode = String(class_code).trim().toUpperCase().replace(/\s+/g, '');
        const { data: cls } = await supabase
          .from('classrooms')
          .select('id, max_students, status')
          .eq('class_code', cleanCode)
          .maybeSingle();

        if (cls) {
          if (cls.status !== 'active') {
            return res.status(400).json({ error: 'Lớp học hiện tại đã đóng hoặc lưu trữ.' });
          }
          targetClassId = cls.id;

          // Check capacity limit
          if (cls.max_students) {
            const { count } = await supabase
              .from('class_members')
              .select('*', { count: 'exact', head: true })
              .eq('classroom_id', targetClassId)
              .eq('status', 'active');

            if (count && count >= cls.max_students) {
              return res.status(400).json({ error: 'Lớp học đã đạt số lượng học viên tối đa.' });
            }
          }
        } else {
          return res.status(404).json({ error: 'Mã lớp học không tồn tại.' });
        }
      }

      if (targetClassId) {
        const { data: member, error: memErr } = await supabase
          .from('class_members')
          .upsert({
            classroom_id: targetClassId,
            student_id: userId,
            status: 'active',
            joined_at: new Date().toISOString()
          }, { onConflict: 'classroom_id,student_id' })
          .select()
          .maybeSingle();

        if (!memErr && member) {
          return res.status(200).json({
            success: true,
            classroom_id: targetClassId,
            member
          });
        }
        if (memErr && isProd) {
          return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu khi tham gia lớp học: ' + memErr.message });
        }
      } else if (isProd) {
        return res.status(400).json({ error: 'Không tìm thấy lớp học hợp lệ để tham gia.' });
      }
    } catch (err) {
      console.warn('[/api/classroom/join] Notice:', err.message);
      if (isProd) {
        return res.status(500).json({ error: 'Lỗi hệ thống khi tham gia lớp học.' });
      }
    }
  } else if (isProd) {
    return res.status(503).json({ error: 'Dịch vụ cơ sở dữ liệu không khả dụng.' });
  }

  return res.status(200).json({
    success: true,
    classroom_id: classroom_id || 'cls-simulated',
    student: student || null
  });
}
