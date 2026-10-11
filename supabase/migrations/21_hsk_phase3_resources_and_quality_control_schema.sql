-- =========================================================================
-- MIGRATION 21: HSK PHASE 3 RESOURCE HUB, EXAM LIBRARY & QUALITY CONTROL
-- =========================================================================
-- Quản lý kho tài nguyên công khai (hsk_resources), hệ thống báo cáo lỗi
-- từ người học (hsk_reports), kiểm soát trạng thái duyệt và bảo mật RLS.
-- =========================================================================

-- 1. Bổ sung các cột kiểm duyệt cho bảng đề thi hsk_exams (nếu chưa có)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'hsk_exams' AND column_name = 'review_status'
  ) THEN
    ALTER TABLE public.hsk_exams 
    ADD COLUMN review_status TEXT NOT NULL DEFAULT 'published' 
    CHECK (review_status IN ('draft', 'needs_review', 'approved', 'published', 'rejected', 'archived'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'hsk_exams' AND column_name = 'difficulty_estimate'
  ) THEN
    ALTER TABLE public.hsk_exams 
    ADD COLUMN difficulty_estimate TEXT NOT NULL DEFAULT 'standard';
  END IF;
END $$;

-- 2. Bảng kho tài nguyên học tập HSK (hsk_resources)
CREATE TABLE IF NOT EXISTS public.hsk_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'All', -- 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'All'
  exam_version TEXT NOT NULL DEFAULT '2015-Standard', -- '2015-Standard', 'HSK 3.0-2021'
  category TEXT NOT NULL DEFAULT 'sample_exam', -- 'sample_exam', 'document', 'audio', 'video', 'grammar_guide', 'vocab_sheet', 'external_portal'
  skill TEXT NOT NULL DEFAULT 'mixed', -- 'listening', 'reading', 'writing', 'vocabulary', 'grammar', 'mixed'
  format TEXT NOT NULL DEFAULT 'web_link', -- 'practice_exam', 'pdf', 'audio_mp3', 'video_link', 'web_link'
  source_url TEXT NOT NULL,
  source_author TEXT NOT NULL,
  license_status TEXT NOT NULL DEFAULT 'Public Educational Sample',
  permission_status TEXT NOT NULL DEFAULT 'reproducible' CHECK (permission_status IN ('reproducible', 'linked_only', 'unverified')),
  review_status TEXT NOT NULL DEFAULT 'published' CHECK (review_status IN ('draft', 'needs_review', 'approved', 'published', 'rejected', 'archived')),
  is_published BOOLEAN NOT NULL DEFAULT true,
  download_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  verified_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Chỉ mục tối ưu tìm kiếm tài nguyên
CREATE INDEX IF NOT EXISTS idx_hsk_resources_level ON public.hsk_resources(level);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_category ON public.hsk_resources(category);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_skill ON public.hsk_resources(skill);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_published ON public.hsk_resources(is_published);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_status ON public.hsk_resources(review_status);

-- 3. Bảng báo cáo sự cố và khiếu nại chất lượng từ học viên (hsk_reports)
CREATE TABLE IF NOT EXISTS public.hsk_reports (
  id TEXT PRIMARY KEY,
  resource_id TEXT REFERENCES public.hsk_resources(id) ON DELETE SET NULL,
  exam_id TEXT REFERENCES public.hsk_exams(id) ON DELETE SET NULL,
  question_id TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('broken_link', 'audio_error', 'answer_discrepancy', 'typo', 'copyright_concern')),
  description TEXT NOT NULL,
  reporter_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_reports_status ON public.hsk_reports(status);
CREATE INDEX IF NOT EXISTS idx_hsk_reports_type ON public.hsk_reports(report_type);

-- 4. Bật Row Level Security (RLS)
ALTER TABLE public.hsk_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_reports ENABLE ROW LEVEL SECURITY;

-- 5. Chính sách RLS cho hsk_resources
-- Công chúng chỉ đọc tài nguyên đã xuất bản và duyệt thành công
CREATE POLICY "hsk_resources_public_read" ON public.hsk_resources
  FOR SELECT
  USING (
    (is_published = true AND review_status = 'published')
    OR
    public.is_admin()
  );

-- Chỉ Admin được thêm, cập nhật, xóa tài nguyên
CREATE POLICY "hsk_resources_admin_all" ON public.hsk_resources
  FOR ALL
  USING (public.is_admin());

-- 6. Chính sách RLS cho hsk_reports
-- Bất kỳ học viên hay khách vãng lai nào cũng có quyền gửi báo cáo
CREATE POLICY "hsk_reports_public_insert" ON public.hsk_reports
  FOR INSERT
  WITH CHECK (true);

-- Chỉ Admin được xem và xử lý báo cáo
CREATE POLICY "hsk_reports_admin_all" ON public.hsk_reports
  FOR ALL
  USING (public.is_admin());
