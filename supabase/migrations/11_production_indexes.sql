-- =========================================================================
-- HANZI GO - MIGRATION 11: PRODUCTION PERFORMANCE INDEXES & RLS HARDENING
-- =========================================================================
-- Mục tiêu:
-- 1. Tighten RLS: Loại bỏ 'OR status = active' khỏi classrooms_select_policy
--    để tránh việc Teacher A xem được danh sách lớp của Teacher B hoặc
--    học sinh xem được các lớp không thuộc về mình. Việc tra cứu mã được thực
--    hiện an toàn qua RPC lookup_classroom_by_code (SECURITY DEFINER).
-- 2. Tối ưu hóa Database Index cho các trường khóa ngoại và lọc tần suất cao:
--    - teacher_id
--    - classroom_id
--    - student_id
--    - assignment_id
--    - session_id
--    - created_at
-- =========================================================================

-- 1. HARDEN CLASSROOMS SELECT POLICY
-- Chỉ cho phép:
--   - Giáo viên sở hữu lớp (teacher_id = auth.uid())
--   - Quản trị viên (is_admin())
--   - Thành viên đang hoạt động trong lớp (is_classroom_member(id, auth.uid()))
DROP POLICY IF EXISTS "classrooms_select_policy" ON public.classrooms;
CREATE POLICY "classrooms_select_policy" ON public.classrooms
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_member(id, auth.uid())
  );

-- 2. PERFORMANCE INDEXES
-- 2.1. classrooms table
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher_id 
  ON public.classrooms (teacher_id);

CREATE INDEX IF NOT EXISTS idx_classrooms_created_at 
  ON public.classrooms (created_at DESC);

-- 2.2. class_members table
CREATE INDEX IF NOT EXISTS idx_class_members_classroom_id 
  ON public.class_members (classroom_id);

CREATE INDEX IF NOT EXISTS idx_class_members_student_id 
  ON public.class_members (student_id);

-- 2.3. assignments table
CREATE INDEX IF NOT EXISTS idx_assignments_classroom_id 
  ON public.assignments (classroom_id);

CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id 
  ON public.assignments (teacher_id);

CREATE INDEX IF NOT EXISTS idx_assignments_created_at 
  ON public.assignments (created_at DESC);

-- 2.4. assignment_submissions table
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id 
  ON public.assignment_submissions (assignment_id);

CREATE INDEX IF NOT EXISTS idx_submissions_student_id 
  ON public.assignment_submissions (student_id);

-- 2.5. class_sessions table (Live Classroom)
CREATE INDEX IF NOT EXISTS idx_class_sessions_classroom_id 
  ON public.class_sessions (classroom_id);

CREATE INDEX IF NOT EXISTS idx_class_sessions_teacher_id 
  ON public.class_sessions (teacher_id);

CREATE INDEX IF NOT EXISTS idx_class_sessions_status_created 
  ON public.class_sessions (status, created_at DESC);

-- 2.6. session_participants table
CREATE INDEX IF NOT EXISTS idx_session_participants_session_id 
  ON public.session_participants (session_id);

CREATE INDEX IF NOT EXISTS idx_session_participants_user_id 
  ON public.session_participants (user_id);

-- 2.7. session_chat_messages table
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id 
  ON public.session_chat_messages (session_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at 
  ON public.session_chat_messages (created_at ASC);

-- 2.8. class_announcements & class_materials
CREATE INDEX IF NOT EXISTS idx_announcements_classroom_id 
  ON public.class_announcements (classroom_id);

CREATE INDEX IF NOT EXISTS idx_materials_classroom_id 
  ON public.class_materials (classroom_id);
