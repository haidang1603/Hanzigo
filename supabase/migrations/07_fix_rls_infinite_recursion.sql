-- =========================================================================
-- MIGRATION 07: FIX INFINITE RECURSION IN CLASSROOMS & CLASS_MEMBERS RLS
-- HanziGo Live & Teacher Classroom Platform
-- =========================================================================

-- 1. Helper Function: Kiểm tra người dùng có phải là học viên trong lớp không
-- Sử dụng SECURITY DEFINER STABLE để bypass RLS nội bộ, tránh vòng lặp kiểm tra chéo
CREATE OR REPLACE FUNCTION public.is_classroom_member(
  p_classroom_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_members
    WHERE classroom_id = p_classroom_id
      AND student_id = p_user_id
      AND status = 'active'
  );
$$;

-- 2. Helper Function: Kiểm tra người dùng có phải giáo viên phụ trách lớp không
CREATE OR REPLACE FUNCTION public.is_classroom_teacher(
  p_classroom_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = p_classroom_id
      AND teacher_id = p_user_id
  );
$$;

-- Cấp quyền thực thi các helper functions cho authenticated và service_role
GRANT EXECUTE ON FUNCTION public.is_classroom_member(UUID, UUID) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.is_classroom_teacher(UUID, UUID) TO authenticated, service_role, anon;

-- 2.1. Cập nhật hàm is_teacher để nhận diện cả người có role teacher/admin hoặc đang quản lý lớp
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin') AND status != 'blocked'
  ) OR EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE teacher_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.is_teacher() TO authenticated, service_role, anon;

-- =========================================================================
-- 3. CẬP NHẬT LẠI POLICIES TRÊN public.classrooms
-- =========================================================================
DROP POLICY IF EXISTS "classrooms_select_policy" ON public.classrooms;
CREATE POLICY "classrooms_select_policy" ON public.classrooms
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_member(id, auth.uid())
  );

DROP POLICY IF EXISTS "classrooms_insert_policy" ON public.classrooms;
CREATE POLICY "classrooms_insert_policy" ON public.classrooms
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'blocked'
    )
  );

DROP POLICY IF EXISTS "classrooms_update_policy" ON public.classrooms;
CREATE POLICY "classrooms_update_policy" ON public.classrooms
  FOR UPDATE USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "classrooms_delete_policy" ON public.classrooms;
CREATE POLICY "classrooms_delete_policy" ON public.classrooms
  FOR DELETE USING (
    teacher_id = auth.uid() OR public.is_admin()
  );

-- Trigger: Tự động thăng cấp tài khoản tạo lớp thành 'teacher' nếu đang là 'student'
CREATE OR REPLACE FUNCTION public.handle_new_classroom_teacher()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'teacher'
  WHERE id = NEW.teacher_id AND (role IS NULL OR role = 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_classroom_set_teacher ON public.classrooms;
CREATE TRIGGER trg_classroom_set_teacher
  AFTER INSERT ON public.classrooms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_classroom_teacher();

-- =========================================================================
-- 4. CẬP NHẬT LẠI POLICIES TRÊN public.class_members
-- =========================================================================
DROP POLICY IF EXISTS "class_members_select_policy" ON public.class_members;
CREATE POLICY "class_members_select_policy" ON public.class_members
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
    OR public.is_classroom_member(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "class_members_insert_policy" ON public.class_members;
CREATE POLICY "class_members_insert_policy" ON public.class_members
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "class_members_update_policy" ON public.class_members;
CREATE POLICY "class_members_update_policy" ON public.class_members
  FOR UPDATE USING (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "class_members_delete_policy" ON public.class_members;
CREATE POLICY "class_members_delete_policy" ON public.class_members
  FOR DELETE USING (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- =========================================================================
-- 5. CẬP NHẬT LẠI POLICIES TRÊN public.assignments & SUBMISSIONS
-- =========================================================================
DROP POLICY IF EXISTS "assignments_select_policy" ON public.assignments;
CREATE POLICY "assignments_select_policy" ON public.assignments
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR (
      published = true
      AND public.is_classroom_member(classroom_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "assignments_insert_policy" ON public.assignments;
CREATE POLICY "assignments_insert_policy" ON public.assignments
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND (public.is_teacher() OR public.is_admin())
    AND public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "announcements_select_policy" ON public.class_announcements;
CREATE POLICY "announcements_select_policy" ON public.class_announcements
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_member(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "class_materials_select_policy" ON public.class_materials;
CREATE POLICY "class_materials_select_policy" ON public.class_materials
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_member(classroom_id, auth.uid())
  );

-- =========================================================================
-- 6. CẬP NHẬT LẠI POLICIES TRÊN public.class_sessions (LIVE CLASSROOM)
-- =========================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'class_sessions') THEN
    DROP POLICY IF EXISTS "Class members and teacher can view sessions" ON public.class_sessions;
    CREATE POLICY "Class members and teacher can view sessions"
      ON public.class_sessions FOR SELECT
      USING (
        teacher_id = auth.uid()
        OR public.is_admin()
        OR public.is_classroom_member(classroom_id, auth.uid())
      );

    DROP POLICY IF EXISTS "Teacher can create session" ON public.class_sessions;
    CREATE POLICY "Teacher can create session"
      ON public.class_sessions FOR INSERT
      WITH CHECK (
        teacher_id = auth.uid()
        AND (public.is_teacher() OR public.is_admin())
        AND public.is_classroom_teacher(classroom_id, auth.uid())
      );
  END IF;
END $$;

-- =========================================================================
-- 7. RÀNG BUỘC SĨ SỐ LỚP HỌC (CHO PHÉP TỪ 1 HỌC VIÊN TRỞ LÊN - KÈM 1-1 HOẶC LỚP NHÓM)
-- =========================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_classrooms_max_students'
  ) THEN
    ALTER TABLE public.classrooms ADD CONSTRAINT check_classrooms_max_students CHECK (max_students >= 1);
  END IF;
END $$;

