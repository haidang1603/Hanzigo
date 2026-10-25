-- =========================================================================
-- HANZIGO - FIX SUPABASE LINTER: REMOVE INSECURE USER_METADATA REFERENCES IN RLS
-- =========================================================================
-- Vấn đề an ninh:
-- Supabase Auth linter phát hiện các policy RLS sử dụng:
--   auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
-- user_metadata là trường do phía client/người dùng có thể tự sửa đổi thông qua
-- supabase.auth.updateUser({ data: { role: 'admin' } }), tạo lỗ hổng leo thang
-- đặc quyền (Privilege Escalation).
--
-- Đồng thời, việc gọi auth.jwt() trong SQL Editor sẽ gây lỗi:
--   ERROR: 22P02: invalid input syntax for type json (Token "service_role" is invalid)
-- do biến request.jwt.claim chứa chuỗi thô service_role không phải JSON hợp lệ.
--
-- Giải pháp bảo mật chuẩn:
-- 1. Sử dụng hàm bảo mật cơ sở dữ liệu `public.is_admin()` đối soát trực tiếp
--    với bảng `public.profiles` (được bảo vệ bởi trigger chống sửa role).
-- 2. Trong Supabase, vai trò service_role mặc định có cờ BYPASSRLS nên luôn có
--    toàn quyền truy cập cho backend server-side mà không cần gọi auth.jwt().
-- =========================================================================

-- 1. KHẮC PHỤC BẢNG public.dictionary_entries
-- Policy: "Admin and service role can modify dictionary"
DROP POLICY IF EXISTS "Admin and service role can modify dictionary" ON public.dictionary_entries;

CREATE POLICY "Admin and service role can modify dictionary"
    ON public.dictionary_entries
    FOR ALL
    TO authenticated
    USING (
        public.is_admin()
    );

-- 2. KHẮC PHỤC BẢNG public.issued_certificates
-- Policy 2.1: "Users can only view their own certificates"
DROP POLICY IF EXISTS "Users can only view their own certificates" ON public.issued_certificates;

CREATE POLICY "Users can only view their own certificates"
    ON public.issued_certificates
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR public.is_admin()
    );

-- Policy 2.2: "Users can insert their own certificates or admin"
DROP POLICY IF EXISTS "Users can insert their own certificates or admin" ON public.issued_certificates;

CREATE POLICY "Users can insert their own certificates or admin"
    ON public.issued_certificates
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        OR public.is_admin()
    );

-- Policy 2.3: "Only admin can update certificates"
DROP POLICY IF EXISTS "Only admin can update certificates" ON public.issued_certificates;

CREATE POLICY "Only admin can update certificates"
    ON public.issued_certificates
    FOR UPDATE
    TO authenticated
    USING (
        public.is_admin()
    );

-- Policy 2.4: "Only admin can delete certificates"
DROP POLICY IF EXISTS "Only admin can delete certificates" ON public.issued_certificates;

CREATE POLICY "Only admin can delete certificates"
    ON public.issued_certificates
    FOR DELETE
    TO authenticated
    USING (
        public.is_admin()
    );
