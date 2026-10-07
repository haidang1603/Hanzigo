-- =========================================================================
-- HANZI GO - MIGRATION 10: FIX CLASSROOM LOOKUP BY CODE & RLS POLICIES
-- =========================================================================

-- 1. Cập nhật RLS Policy trên public.classrooms:
-- Cho phép SELECT đối với lớp đang active (học viên có thể xem thông tin lớp khi tra cứu mã)
DROP POLICY IF EXISTS "classrooms_select_policy" ON public.classrooms;
CREATE POLICY "classrooms_select_policy" ON public.classrooms
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_member(id, auth.uid())
    OR status = 'active'
  );

-- 2. Hàm RPC lookup_classroom_by_code: Tra cứu lớp học bằng mã (SECURITY DEFINER)
-- Bỏ qua hạn chế RLS để bất kỳ người dùng nào nhập đúng mã đều xem được thông tin lớp
CREATE OR REPLACE FUNCTION public.lookup_classroom_by_code(p_class_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_clean_code TEXT;
  v_without_prefix TEXT;
  v_classroom RECORD;
  v_student_count INT;
BEGIN
  IF p_class_code IS NULL OR TRIM(p_class_code) = '' THEN
    RETURN NULL;
  END IF;

  v_clean_code := UPPER(REGEXP_REPLACE(TRIM(p_class_code), '\s+', '', 'g'));
  v_without_prefix := REGEXP_REPLACE(v_clean_code, '^HZG-?', '');

  SELECT c.*, p.name AS teacher_name, p.avatar AS teacher_avatar
  INTO v_classroom
  FROM public.classrooms c
  LEFT JOIN public.profiles p ON p.id = c.teacher_id
  WHERE (
    UPPER(REGEXP_REPLACE(c.class_code, '\s+', '', 'g')) = v_clean_code
    OR UPPER(REGEXP_REPLACE(c.class_code, '\s+', '', 'g')) = 'HZG-' || v_without_prefix
    OR UPPER(REGEXP_REPLACE(REGEXP_REPLACE(c.class_code, '\s+', '', 'g'), '^HZG-?', '')) = v_without_prefix
  )
  AND c.status = 'active'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*) INTO v_student_count
  FROM public.class_members
  WHERE classroom_id = v_classroom.id AND status = 'active';

  RETURN jsonb_build_object(
    'id', v_classroom.id,
    'name', v_classroom.name,
    'description', v_classroom.description,
    'hsk_level', v_classroom.hsk_level,
    'class_code', v_classroom.class_code,
    'max_students', v_classroom.max_students,
    'status', v_classroom.status,
    'teacher_name', COALESCE(v_classroom.teacher_name, 'Giáo viên HanziGo'),
    'teacher_avatar', v_classroom.teacher_avatar,
    'student_count', v_student_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.lookup_classroom_by_code(TEXT) TO authenticated, anon, service_role;

-- 3. Cập nhật hàm RPC join_class_by_code:
-- Hỗ trợ mã có hoặc không có tiền tố HZG-, bỏ qua khoảng trắng
CREATE OR REPLACE FUNCTION public.join_class_by_code(p_class_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_uid UUID;
  v_user_role TEXT;
  v_user_status TEXT;
  v_classroom RECORD;
  v_clean_code TEXT;
  v_without_prefix TEXT;
  v_student_count INT;
BEGIN
  -- 1. Xác thực người dùng
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Chưa xác thực: Vui lòng đăng nhập trước khi tham gia lớp học.';
  END IF;

  -- 2. Kiểm tra hồ sơ & trạng thái
  SELECT role, status INTO v_user_role, v_user_status
  FROM public.profiles
  WHERE id = v_uid;

  IF v_user_status = 'blocked' THEN
    RAISE EXCEPTION 'Tài khoản của bạn đang bị khóa, không thể tham gia lớp học.';
  END IF;

  v_clean_code := UPPER(REGEXP_REPLACE(TRIM(p_class_code), '\s+', '', 'g'));
  v_without_prefix := REGEXP_REPLACE(v_clean_code, '^HZG-?', '');

  -- 3. Tìm classroom linh hoạt theo mã
  SELECT * INTO v_classroom
  FROM public.classrooms
  WHERE (
    UPPER(REGEXP_REPLACE(class_code, '\s+', '', 'g')) = v_clean_code
    OR UPPER(REGEXP_REPLACE(class_code, '\s+', '', 'g')) = 'HZG-' || v_without_prefix
    OR UPPER(REGEXP_REPLACE(REGEXP_REPLACE(class_code, '\s+', '', 'g'), '^HZG-?', '')) = v_without_prefix
  )
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mã lớp không hợp lệ hoặc không tồn tại.';
  END IF;

  -- 4. Kiểm tra trạng thái lớp học
  IF v_classroom.status != 'active' THEN
    RAISE EXCEPTION 'Lớp học hiện tại đã đóng hoặc lưu trữ, không tiếp nhận học viên mới.';
  END IF;

  IF v_classroom.teacher_id = v_uid THEN
    RAISE EXCEPTION 'Bạn là giáo viên phụ trách lớp này, không cần tham gia dưới vai trò học viên.';
  END IF;

  -- 5. Kiểm tra sĩ số tối đa
  SELECT COUNT(*) INTO v_student_count
  FROM public.class_members
  WHERE classroom_id = v_classroom.id AND status = 'active';

  IF v_student_count >= v_classroom.max_students THEN
    RAISE EXCEPTION 'Lớp học đã đạt sĩ số tối đa (% học viên). Vui lòng liên hệ giáo viên.', v_classroom.max_students;
  END IF;

  -- 6. Kiểm tra đã tham gia chưa
  IF EXISTS (
    SELECT 1 FROM public.class_members
    WHERE classroom_id = v_classroom.id AND student_id = v_uid AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Bạn đã là thành viên của lớp học này.';
  END IF;

  -- 7. Ghi nhận thành viên lớp
  INSERT INTO public.class_members (classroom_id, student_id, status, joined_at)
  VALUES (v_classroom.id, v_uid, 'active', NOW())
  ON CONFLICT (classroom_id, student_id)
  DO UPDATE SET status = 'active', joined_at = NOW();

  -- 8. Trả về kết quả
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Tham gia lớp học thành công!',
    'classroom_id', v_classroom.id,
    'name', v_classroom.name,
    'hsk_level', v_classroom.hsk_level
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.join_class_by_code(TEXT) TO authenticated, anon, service_role;
