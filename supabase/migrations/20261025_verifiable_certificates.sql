-- =========================================================================
-- HANZIGO PHASE 13: HARDENED VERIFIABLE HSK CERTIFICATES SCHEMA & RLS
-- =========================================================================
-- 1. Bảng lưu trữ chứng nhận HSK (public.issued_certificates)
-- 2. Triệt tiêu lỗ hổng rò rỉ dữ liệu (Anti-Scraping / Zero Data Leakage)
-- 3. Hỗ trợ cơ chế thu hồi chứng nhận (Certificate Revocation)
-- 4. RPC công khai chỉ trả về dữ liệu tối thiểu (Minimal Disclosure)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.issued_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  hsk_level TEXT NOT NULL,
  exam_percentage NUMERIC(5, 2) NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_revoked BOOLEAN DEFAULT false NOT NULL,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index tra cứu tốc độ cao
CREATE INDEX IF NOT EXISTS idx_issued_certificates_code ON public.issued_certificates (certificate_code);
CREATE INDEX IF NOT EXISTS idx_issued_certificates_user_id ON public.issued_certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_issued_certificates_revoked ON public.issued_certificates (is_revoked);

-- Kích hoạt Row Level Security (RLS)
ALTER TABLE public.issued_certificates ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- POLICIES (CHÍNH SÁCH BẢO MẬT BẢNG)
-- -------------------------------------------------------------------------

-- Xóa các policy cũ và policy hiện tại để đảm bảo idempotent khi chạy lại
DROP POLICY IF EXISTS "Public Read Access by Certificate Code" ON public.issued_certificates;
DROP POLICY IF EXISTS "Users can insert own certificates" ON public.issued_certificates;
DROP POLICY IF EXISTS "Certificates are viewable by everyone" ON public.issued_certificates;
DROP POLICY IF EXISTS "Service role manages certificates" ON public.issued_certificates;
DROP POLICY IF EXISTS "Users can only view their own certificates" ON public.issued_certificates;
DROP POLICY IF EXISTS "Only service role and admin can insert certificates" ON public.issued_certificates;
DROP POLICY IF EXISTS "Users can insert their own certificates or admin" ON public.issued_certificates;
DROP POLICY IF EXISTS "Only service role and admin can update certificates" ON public.issued_certificates;
DROP POLICY IF EXISTS "Only admin can update certificates" ON public.issued_certificates;
DROP POLICY IF EXISTS "Only admin can delete certificates" ON public.issued_certificates;

-- 1. CHÍNH SÁCH XEM (SELECT):
-- CHỈ người sở hữu chứng nhận (hoặc Admin) mới được SELECT trực tiếp bảng này.
-- Người lạ/Anon KHÔNG ĐƯỢC chạy SELECT * để cào dữ liệu email, user_id và điểm số.
CREATE POLICY "Users can only view their own certificates"
  ON public.issued_certificates
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- 2. CHÍNH SÁCH THÊM (INSERT):
-- Cho phép người học lưu chứng nhận của chính mình (auth.uid() = user_id) hoặc Admin.
-- Supabase service_role mặc định bypass RLS nên luôn có toàn quyền ghi.
CREATE POLICY "Users can insert their own certificates or admin"
  ON public.issued_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- 3. CHÍNH SÁCH CẬP NHẬT (UPDATE):
-- Chỉ Admin hoặc postgres được quyền thu hồi / cập nhật.
CREATE POLICY "Only admin can update certificates"
  ON public.issued_certificates
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
  );

-- 4. CHÍNH SÁCH XÓA (DELETE):
-- Cấm xóa tùy tiện (chỉ thu hồi soft-revoke). Chỉ Admin hệ thống mới có quyền xóa.
CREATE POLICY "Only admin can delete certificates"
  ON public.issued_certificates
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- -------------------------------------------------------------------------
-- PUBLIC VERIFICATION RPC (TRA CỨU CÔNG KHAI TỐI THIỂU - AN TOÀN TUYỆT ĐỐI)
-- -------------------------------------------------------------------------
-- Cho phép bất kỳ ai (kể cả anon/nhà tuyển dụng chưa đăng nhập) tra cứu
-- một mã chứng nhận mà KHÔNG làm lộ email, user_id, hay thông tin nội bộ.
CREATE OR REPLACE FUNCTION public.verify_hsk_certificate_public(p_certificate_code TEXT)
RETURNS TABLE (
  certificate_code TEXT,
  display_name TEXT,
  hsk_level TEXT,
  issue_date DATE,
  is_valid BOOLEAN,
  is_revoked BOOLEAN,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.certificate_code,
    c.user_name AS display_name,
    c.hsk_level,
    c.issue_date,
    (NOT c.is_revoked) AS is_valid,
    c.is_revoked,
    c.revoked_at,
    c.revocation_reason
  FROM public.issued_certificates c
  WHERE c.certificate_code = trim(upper(p_certificate_code))
  LIMIT 1;
END;
$$;

-- Cấp quyền thực thi RPC cho cả anon và authenticated
GRANT EXECUTE ON FUNCTION public.verify_hsk_certificate_public(TEXT) TO anon, authenticated;
