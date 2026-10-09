-- =========================================================================
-- HANZI GO - MIGRATION 15: SECURE SESSION PARTICIPANTS RLS & ANTI-ESCALATION
-- =========================================================================
-- 1. Thắt chặt quyền cập nhật trên bảng public.session_participants
-- 2. Trigger trg_prevent_participant_privilege_escalation:
--    - Ngăn chặn học viên tự ý cấp quyền mic (is_mic_allowed) cho chính mình
--    - Ngăn chặn học viên tự sửa vai trò (role) thành teacher trong phiên học
--    - Ngăn chặn học viên can thiệp vào điểm danh (attendance_status)
--    - Học viên chỉ được phép bật/tắt thiết bị của mình (mic_enabled, camera_enabled)
--      và trạng thái giơ tay (hand_raised, hand_raised_at)
-- =========================================================================

-- 1. FUNCTION KIỂM TRA QUYỀN TRÊN SESSION_PARTICIPANTS
CREATE OR REPLACE FUNCTION public.prevent_participant_privilege_escalation()
RETURNS TRIGGER AS $$
DECLARE
  v_is_teacher BOOLEAN := false;
BEGIN
  -- Kiểm tra xem người thực thi có phải là Giáo viên phụ trách phiên học hoặc Admin không
  IF auth.uid() IS NOT NULL THEN
    v_is_teacher := public.is_admin() OR EXISTS (
      SELECT 1 
      FROM public.class_sessions s
      WHERE s.id = OLD.session_id 
        AND s.teacher_id = auth.uid()
    );
  END IF;

  -- Nếu không phải giáo viên phụ trách phòng hoặc admin:
  IF NOT v_is_teacher THEN
    -- 1. Chặn tự cấp quyền mic
    IF (NEW.is_mic_allowed IS DISTINCT FROM OLD.is_mic_allowed) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ giáo viên phụ trách phòng mới có quyền cấp hoặc thu hồi quyền bật Micro.';
    END IF;

    -- 2. Chặn tự sửa role trong phiên học
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự thay đổi vai trò trong phòng học.';
    END IF;

    -- 3. Chặn can thiệp điểm danh
    IF (NEW.attendance_status IS DISTINCT FROM OLD.attendance_status) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự sửa trạng thái điểm danh.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. GÁN TRIGGER VÀO BẢNG public.session_participants
DROP TRIGGER IF EXISTS trg_prevent_participant_privilege_escalation ON public.session_participants;
CREATE TRIGGER trg_prevent_participant_privilege_escalation
  BEFORE UPDATE ON public.session_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_participant_privilege_escalation();

-- 3. CẬP NHẬT LẠI RLS POLICY ĐẢM BẢO RÕ RÀNG
DROP POLICY IF EXISTS "Users or Teacher can update participant" ON public.session_participants;

CREATE POLICY "Users or Teacher can update participant"
  ON public.session_participants FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (s.teacher_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (s.teacher_id = auth.uid() OR public.is_admin())
    )
  );
