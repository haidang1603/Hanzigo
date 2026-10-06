-- =========================================================================
-- HANZI GO - MIGRATION 05: TEACHER MODE & CLASSROOM MVP SCHEMA & RLS
-- =========================================================================

-- 1. Mở rộng role check trong profiles (student, teacher, admin, moderator)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS chk_profile_role;
ALTER TABLE public.profiles ADD CONSTRAINT chk_profile_role 
  CHECK (role IN ('student', 'teacher', 'admin', 'moderator'));

-- 2. Hàm kiểm tra quyền Teacher an toàn trên database
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

-- =========================================================================
-- 3. CÁC BẢNG DỮ LIỆU CLASSROOM
-- =========================================================================

-- 3.1. classrooms: Thông tin lớp học
CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  hsk_level TEXT DEFAULT 'HSK 1',
  class_code TEXT NOT NULL UNIQUE,
  max_students INT DEFAULT 30 CHECK (max_students >= 1),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2. class_members: Học viên trong lớp
CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed')),
  CONSTRAINT uq_class_member_pair UNIQUE (classroom_id, student_id)
);

-- 3.3. assignments: Bài tập do giáo viên giao
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'Vocabulary', -- 'Vocabulary', 'Grammar', 'Listening', 'Speaking', 'Reading', 'Writing', 'Quiz'
  content_id TEXT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  due_date TIMESTAMPTZ NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4. assignment_submissions: Bài nộp và chấm điểm
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('pending', 'submitted', 'graded', 'late')),
  submission_data JSONB DEFAULT '{}'::jsonb,
  score NUMERIC(5,2) NULL,
  feedback TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ NULL,
  graded_by UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT uq_assignment_student_submission UNIQUE (assignment_id, student_id)
);

-- 3.5. class_announcements: Bảng thông báo của lớp
CREATE TABLE IF NOT EXISTS public.class_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6. class_materials: Tài liệu học tập riêng của lớp
CREATE TABLE IF NOT EXISTS public.class_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf', -- 'pdf', 'audio', 'image', 'video'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 4. CHỈ MỤC TỐI ƯU HIỆU NĂNG (INDEXES)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher ON public.classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_code ON public.classrooms(class_code);
CREATE INDEX IF NOT EXISTS idx_classrooms_status ON public.classrooms(status);

CREATE INDEX IF NOT EXISTS idx_class_members_class ON public.class_members(classroom_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON public.class_members(student_id);
CREATE INDEX IF NOT EXISTS idx_class_members_status ON public.class_members(status);

CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due ON public.assignments(due_date);

CREATE INDEX IF NOT EXISTS idx_submissions_assign ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.assignment_submissions(status);

CREATE INDEX IF NOT EXISTS idx_class_announcements_class ON public.class_announcements(classroom_id);
CREATE INDEX IF NOT EXISTS idx_class_materials_class ON public.class_materials(classroom_id);

-- =========================================================================
-- 5. FUNCTION RPC: JOIN LỚP BẰNG CLASS CODE (BẢO VỆ CHẶT CHẼ)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.join_class_by_code(p_class_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_uid UUID;
  v_user_role TEXT;
  v_user_status TEXT;
  v_classroom RECORD;
  v_student_count INT;
BEGIN
  -- 1. Xác thực người dùng
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Chưa xác thực: Vui lòng đăng nhập trước khi tham gia lớp học.';
  END IF;

  -- 2. Kiểm tra thông tin hồ sơ & trạng thái
  SELECT role, status INTO v_user_role, v_user_status
  FROM public.profiles
  WHERE id = v_uid;

  IF v_user_status = 'blocked' THEN
    RAISE EXCEPTION 'Tài khoản của bạn đang bị khóa, không thể tham gia lớp học.';
  END IF;

  -- 3. Tìm classroom theo class_code (không phân biệt hoa thường, loại bỏ khoảng trắng)
  SELECT * INTO v_classroom
  FROM public.classrooms
  WHERE UPPER(TRIM(class_code)) = UPPER(TRIM(p_class_code));

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mã lớp không hợp lệ hoặc không tồn tại.';
  END IF;

  -- 4. Kiểm tra trạng thái lớp học (chỉ nhận khi active)
  IF v_classroom.status != 'active' THEN
    RAISE EXCEPTION 'Lớp học hiện tại đã đóng hoặc lưu trữ, không tiếp nhận học viên mới.';
  END IF;

  -- Không cho phép giáo viên của lớp tự gia nhập vào lớp của mình dưới dạng học sinh
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

  -- 7. Ghi nhận thành viên lớp (insert hoặc kích hoạt lại nếu đã bị removed)
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

-- =========================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_materials ENABLE ROW LEVEL SECURITY;

-- Helper functions with SECURITY DEFINER to break mutual RLS recursion
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

GRANT EXECUTE ON FUNCTION public.is_classroom_member(UUID, UUID) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.is_classroom_teacher(UUID, UUID) TO authenticated, service_role, anon;

-- 6.1. classrooms policies
-- Giáo viên thấy lớp mình dạy, Admin thấy tất cả, Học viên thấy lớp mình tham gia
CREATE POLICY "classrooms_select_policy" ON public.classrooms
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_member(id, auth.uid())
  );

-- Chỉ người dùng đã đăng nhập (không bị khóa) mới có thể tạo lớp (và làm giáo viên của lớp đó)
CREATE POLICY "classrooms_insert_policy" ON public.classrooms
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'blocked'
    )
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

-- Chỉ giáo viên phụ trách lớp hoặc Admin mới có thể cập nhật
CREATE POLICY "classrooms_update_policy" ON public.classrooms
  FOR UPDATE USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

-- Chỉ giáo viên phụ trách lớp hoặc Admin mới có thể xóa
CREATE POLICY "classrooms_delete_policy" ON public.classrooms
  FOR DELETE USING (
    teacher_id = auth.uid() OR public.is_admin()
  );

-- 6.2. class_members policies
-- Xem thành viên: Học viên xem trong lớp mình, Giáo viên xem lớp mình, Admin xem tất cả
CREATE POLICY "class_members_select_policy" ON public.class_members
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
    OR public.is_classroom_member(classroom_id, auth.uid())
  );

-- Không cho phép học viên insert trực tiếp vào class_members bằng HTTP request
-- Phải thông qua RPC join_class_by_code() (SECURITY DEFINER)
-- Chỉ giáo viên của lớp hoặc Admin mới được thêm thủ công
CREATE POLICY "class_members_insert_policy" ON public.class_members
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- Cập nhật trạng thái thành viên (ví dụ remove học sinh): Giáo viên hoặc Admin
CREATE POLICY "class_members_update_policy" ON public.class_members
  FOR UPDATE USING (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- Xóa thành viên: Giáo viên hoặc Admin
CREATE POLICY "class_members_delete_policy" ON public.class_members
  FOR DELETE USING (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- 6.3. assignments policies
-- Xem bài tập: Giáo viên phụ trách, Admin, hoặc học viên trong lớp (nếu bài đã published)
CREATE POLICY "assignments_select_policy" ON public.assignments
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR (
      published = true
      AND public.is_classroom_member(classroom_id, auth.uid())
    )
  );

-- Tạo bài tập: Chỉ giáo viên phụ trách lớp hoặc Admin
CREATE POLICY "assignments_insert_policy" ON public.assignments
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND (public.is_teacher() OR public.is_admin())
    AND public.is_classroom_teacher(classroom_id, auth.uid())
  );

-- Sửa bài tập: Giáo viên phụ trách hoặc Admin
CREATE POLICY "assignments_update_policy" ON public.assignments
  FOR UPDATE USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

-- Xóa bài tập: Giáo viên phụ trách hoặc Admin
CREATE POLICY "assignments_delete_policy" ON public.assignments
  FOR DELETE USING (
    teacher_id = auth.uid() OR public.is_admin()
  );

-- 6.4. assignment_submissions policies
-- Xem bài nộp: Học viên xem bài của chính mình, Giáo viên phụ trách lớp xem mọi bài nộp của lớp
CREATE POLICY "submissions_select_policy" ON public.assignment_submissions
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.classrooms c ON a.classroom_id = c.id
      WHERE a.id = assignment_submissions.assignment_id
        AND (c.teacher_id = auth.uid() OR public.is_admin())
    )
  );

-- Nộp bài: Học viên là thành viên đang hoạt động của lớp
CREATE POLICY "submissions_insert_policy" ON public.assignment_submissions
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.class_members m ON a.classroom_id = m.classroom_id
      WHERE a.id = assignment_submissions.assignment_id
        AND m.student_id = auth.uid()
        AND m.status = 'active'
    )
  );

-- Cập nhật bài nộp:
-- Học viên cập nhật nội dung bài làm của chính mình (chưa qua chấm)
-- HOẶC Giáo viên chấm điểm (cho điểm & feedback)
CREATE POLICY "submissions_update_policy" ON public.assignment_submissions
  FOR UPDATE USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.classrooms c ON a.classroom_id = c.id
      WHERE a.id = assignment_submissions.assignment_id
        AND (c.teacher_id = auth.uid() OR public.is_admin())
    )
  );

-- 6.5. class_announcements policies
-- Xem thông báo: Giáo viên lớp, Admin, hoặc học viên trong lớp
CREATE POLICY "announcements_select_policy" ON public.class_announcements
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_members.classroom_id = class_announcements.classroom_id
        AND class_members.student_id = auth.uid()
        AND class_members.status = 'active'
    )
  );

-- Quản lý thông báo: Giáo viên phụ trách hoặc Admin
CREATE POLICY "announcements_manage_policy" ON public.class_announcements
  FOR ALL USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

-- 6.6. class_materials policies
-- Xem tài liệu: Giáo viên lớp, Admin, hoặc học viên trong lớp
CREATE POLICY "class_materials_select_policy" ON public.class_materials
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_members.classroom_id = class_materials.classroom_id
        AND class_members.student_id = auth.uid()
        AND class_members.status = 'active'
    )
  );

-- Quản lý tài liệu lớp: Giáo viên phụ trách hoặc Admin
CREATE POLICY "class_materials_manage_policy" ON public.class_materials
  FOR ALL USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );
