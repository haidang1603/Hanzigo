-- =========================================================================
-- MIGRATION: 20261108_reading_progress_table.sql
-- HanziGo Phase 23 / Task 23.06: Cloud Reading Progress Synchronization
-- =========================================================================

-- 1. TẠO BẢNG public.reading_progress
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id TEXT NOT NULL,
  title TEXT DEFAULT '',
  current_page INTEGER NOT NULL DEFAULT 1,
  total_pages INTEGER NOT NULL DEFAULT 1,
  scroll_position NUMERIC NOT NULL DEFAULT 0,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_material_reading UNIQUE (user_id, material_id),
  CONSTRAINT chk_reading_page_non_negative CHECK (current_page >= 1),
  CONSTRAINT chk_reading_total_pages_positive CHECK (total_pages >= 1),
  CONSTRAINT chk_reading_progress_bounds CHECK (progress_percent >= 0 AND progress_percent <= 100)
);

-- 2. TẠO INDEXES PHỤC VỤ TRUY VẤN TIẾN ĐỘ ĐỌC VÀ LỊCH SỬ GẦN ĐÂY
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_recent ON public.reading_progress(user_id, last_read_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_progress_material ON public.reading_progress(material_id);

-- 3. BẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- 4. ĐỊNH NGHĨA RLS POLICIES (ZERO-TRUST SECURITY)

-- 4.1. SELECT Policy: Người dùng chỉ được xem tiến độ đọc của chính mình (hoặc Admin hệ thống)
DROP POLICY IF EXISTS "reading_progress_select_policy" ON public.reading_progress;
CREATE POLICY "reading_progress_select_policy" ON public.reading_progress
FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR public.is_admin()
);

-- 4.2. INSERT Policy: Chỉ người dùng đã xác thực mới được tạo tiến độ đọc cho chính tài khoản của mình
DROP POLICY IF EXISTS "reading_progress_insert_policy" ON public.reading_progress;
CREATE POLICY "reading_progress_insert_policy" ON public.reading_progress
FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() OR public.is_admin()
);

-- 4.3. UPDATE Policy: Người dùng chỉ được cập nhật tiến độ đọc của chính mình
DROP POLICY IF EXISTS "reading_progress_update_policy" ON public.reading_progress;
CREATE POLICY "reading_progress_update_policy" ON public.reading_progress
FOR UPDATE TO authenticated USING (
  user_id = auth.uid() OR public.is_admin()
) WITH CHECK (
  user_id = auth.uid() OR public.is_admin()
);

-- 4.4. DELETE Policy: Người dùng chỉ được xóa tiến độ đọc của chính mình
DROP POLICY IF EXISTS "reading_progress_delete_policy" ON public.reading_progress;
CREATE POLICY "reading_progress_delete_policy" ON public.reading_progress
FOR DELETE TO authenticated USING (
  user_id = auth.uid() OR public.is_admin()
);

