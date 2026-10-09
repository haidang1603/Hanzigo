-- =========================================================================
-- HANZI GO - MIGRATION 13: PRODUCTION AUDIT LOGS & GRADE TAMPERING PROTECTION
-- =========================================================================
-- 1. Bảng public.audit_logs: Ghi vết kiểm toán cho các hành vi nhạy cảm
--    (Tạo/xóa lớp, đổi mã lớp, kích học viên, chấm điểm, cảnh báo bảo mật)
--    Enforce RLS: Chỉ Admin hoặc Giáo viên (với lớp của mình) được xem.
--    Học viên (Student) tuyệt đối bị chặn không được đọc audit logs.
-- 2. Trigger trg_prevent_student_self_grading:
--    Ngăn chặn triệt để việc học viên gửi lệnh UPDATE SQL can thiệp vào điểm số
--    (score), thời gian chấm (graded_at), người chấm (graded_by) hoặc nhận xét.
-- =========================================================================

-- 1. TẠO BẢNG AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'CLASSROOM', -- 'AUTH', 'CLASSROOM', 'ASSIGNMENT', 'LIVE_ROOM', 'SECURITY'
  severity TEXT NOT NULL DEFAULT 'INFO',      -- 'INFO', 'WARN', 'SECURITY_ALERT'
  actor_id TEXT NOT NULL,
  target_id TEXT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục hiệu năng cho audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs (category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs (target_id);

-- KÍCH HOẠT ROW LEVEL SECURITY CHO audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy INSERT: Cho phép ghi nhận nhật ký (người dùng xác thực hoặc anon ghi security event)
DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR actor_id = 'anonymous' OR public.is_admin()
  );

-- Policy SELECT: CHỈ ADMIN HOẶC GIÁO VIÊN PHỤ TRÁCH ĐƯỢC XEM
-- Học sinh (Student) không có quyền đọc dữ liệu kiểm toán.
DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_logs;
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.is_teacher() 
      AND (
        actor_id = auth.uid()::text
        OR target_id IN (
          SELECT id::text FROM public.classrooms WHERE teacher_id = auth.uid()
        )
      )
    )
  );

-- 2. TRIGGER CHỐNG HỌC VIÊN TỰ SỬA ĐIỂM SỐ (ANTI-SELF-GRADING)
CREATE OR REPLACE FUNCTION public.prevent_student_self_grading()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu điểm số, người chấm, thời gian chấm hoặc feedback bị sửa đổi
  IF (NEW.score IS DISTINCT FROM OLD.score 
      OR NEW.graded_at IS DISTINCT FROM OLD.graded_at 
      OR NEW.graded_by IS DISTINCT FROM OLD.graded_by
      OR NEW.feedback IS DISTINCT FROM OLD.feedback) THEN
    
    -- Kiểm tra người thực hiện: Phải là Admin hoặc Giáo viên sở hữu lớp học chứa bài tập này
    IF auth.uid() IS NOT NULL AND NOT (
      public.is_admin() OR EXISTS (
        SELECT 1 
        FROM public.assignments a
        JOIN public.classrooms c ON a.classroom_id = c.id
        WHERE a.id = NEW.assignment_id 
          AND c.teacher_id = auth.uid()
      )
    ) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự chấm điểm hoặc chỉnh sửa điểm bài nộp.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_student_self_grading ON public.assignment_submissions;
CREATE TRIGGER trg_prevent_student_self_grading
  BEFORE UPDATE ON public.assignment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_student_self_grading();
