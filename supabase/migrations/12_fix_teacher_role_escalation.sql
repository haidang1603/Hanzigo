-- =========================================================================
-- HANZI GO - MIGRATION 12: FIX TEACHER ROLE ESCALATION & SECURE CLASSROOM INSERT
-- =========================================================================
-- 1. Hủy bỏ triệt để Trigger tự động thăng cấp role giáo viên (trg_classroom_set_teacher)
--    ngăn chặn người dùng có role 'student' tự ý nâng cấp thành 'teacher' bằng cách INSERT classroom.
-- 2. Thắt chặt chính sách INSERT trên public.classrooms:
--    Chỉ tài khoản đã có role 'teacher' hoặc 'admin' trong public.profiles mới được phép tạo lớp học.

-- 1. DROP TRIGGER và FUNCTION tự động nâng role cũ
DROP TRIGGER IF EXISTS trg_classroom_set_teacher ON public.classrooms;
DROP FUNCTION IF EXISTS public.handle_new_classroom_teacher();

-- 2. CẬP NHẬT LẠI POLICY INSERT TRÊN public.classrooms
DROP POLICY IF EXISTS "classrooms_insert_policy" ON public.classrooms;
CREATE POLICY "classrooms_insert_policy" ON public.classrooms
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
        AND role IN ('teacher', 'admin') 
        AND status != 'blocked'
    )
  );

-- 3. CẬP NHẬT HÀM is_teacher() LOẠI BỎ ĐIỀU KIỆN SỞ HỮU LỚP DƯ THỪA
-- Quyền giáo viên phải được gắn chặt với hồ sơ profile, không phụ thuộc vào việc có dòng trong classrooms
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin') 
      AND status != 'blocked'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.is_teacher() TO authenticated, service_role, anon;
