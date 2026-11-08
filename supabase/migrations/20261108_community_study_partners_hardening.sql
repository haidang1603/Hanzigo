-- =========================================================================
-- HANZIGO COMMUNITY — PHASE 24 / TASK 24.08E
-- Migration: 20261108_community_study_partners_hardening.sql
-- Mục tiêu: Hoàn thiện tính năng Study Partners (Tìm bạn cùng tiến HSK),
-- bổ sung các cột trạng thái hiển thị (is_active), quyền riêng tư liên hệ
-- (is_contact_public), kỹ năng luyện tập (skills) và siết chặt RLS policies.
-- =========================================================================

-- 1. Bổ sung các cột mới an toàn (Non-destructive & Idempotent)
ALTER TABLE public.study_partners 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.study_partners 
  ADD COLUMN IF NOT EXISTS qr_image TEXT;

ALTER TABLE public.study_partners 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE public.study_partners 
  ADD COLUMN IF NOT EXISTS is_contact_public BOOLEAN DEFAULT true;

ALTER TABLE public.study_partners 
  ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT 'Luyện khẩu ngữ';

-- 2. Backfill dữ liệu hiện hữu (bảo vệ nguyên vẹn các bản ghi lịch sử ID 6, 7, 8)
UPDATE public.study_partners
SET is_active = true
WHERE is_active IS NULL;

UPDATE public.study_partners
SET is_contact_public = true
WHERE is_contact_public IS NULL;

UPDATE public.study_partners
SET skills = 'Luyện khẩu ngữ'
WHERE skills IS NULL OR TRIM(skills) = '';

-- 3. Tạo chỉ mục hỗ trợ truy vấn và tìm kiếm
CREATE INDEX IF NOT EXISTS idx_study_partners_active 
  ON public.study_partners(is_active);

CREATE INDEX IF NOT EXISTS idx_study_partners_user_id 
  ON public.study_partners(user_id);

CREATE INDEX IF NOT EXISTS idx_study_partners_target_level 
  ON public.study_partners(target_level);

-- 4. Kích hoạt và chuẩn hóa RLS Policies cho study_partners
ALTER TABLE public.study_partners ENABLE ROW LEVEL SECURITY;

-- 4.1. SELECT: Công khai các hồ sơ active; chủ sở hữu xem được cả hồ sơ tạm ngưng; Admin xem tất cả
DROP POLICY IF EXISTS "study_partners_select" ON public.study_partners;
CREATE POLICY "study_partners_select" ON public.study_partners
  FOR SELECT
  USING (
    is_active = true 
    OR (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR public.is_admin()
  );

-- 4.2. INSERT: Bắt buộc xác thực người dùng; nếu có user_id phải khớp auth.uid()
DROP POLICY IF EXISTS "study_partners_insert" ON public.study_partners;
CREATE POLICY "study_partners_insert" ON public.study_partners
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- 4.3. UPDATE: Chỉ chủ sở hữu hoặc Quản trị viên mới có quyền cập nhật
DROP POLICY IF EXISTS "study_partners_update" ON public.study_partners;
CREATE POLICY "study_partners_update" ON public.study_partners
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR public.is_admin()
  );

-- 4.4. DELETE: Chỉ chủ sở hữu hoặc Quản trị viên mới có quyền xóa
DROP POLICY IF EXISTS "study_partners_delete" ON public.study_partners;
CREATE POLICY "study_partners_delete" ON public.study_partners
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR public.is_admin()
  );

-- 5. Đảm bảo cấu hình Realtime Replica Identity
ALTER TABLE public.study_partners REPLICA IDENTITY FULL;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.study_partners;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

