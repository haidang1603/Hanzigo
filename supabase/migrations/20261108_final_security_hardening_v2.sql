-- =========================================================================
-- MIGRATION: 20261108_final_security_hardening_v2.sql
-- HanziGo Phase 23 / Task 23.14: Final Production Security Hardening & Zero-Trust Verification
-- =========================================================================

BEGIN;

-- 1. HARDEN TRIGGER: prevent_self_role_escalation()
-- Sử dụng SESSION_USER để phân biệt chính xác giữa phiên kết nối SQL Editor/psql
-- và phiên kết nối PostgREST (authenticator).
-- Chống mọi kẽ hở leo thang quyền qua cả 4 ngữ cảnh:
--   - PostgREST Anonymous (auth.uid() IS NULL hoặc role = 'anon')
--   - PostgREST Authenticated Student / Teacher (auth.uid() <> target hoặc non-admin sửa role/status)
--   - Service Role (được phép trong server context an toàn)
--   - Supabase SQL Editor / Migration runner (SESSION_USER = 'postgres' không có JWT claim)

CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_jwt_claims text;
  v_jwt_role text;
BEGIN
  -- 1. Cho phép thao tác trực tiếp từ Supabase SQL Editor / superuser (SESSION_USER là 'postgres' hoặc 'supabase_admin' không kèm JWT claim)
  IF SESSION_USER IN ('postgres', 'supabase_admin') AND current_setting('request.jwt.claims', true) IS NULL THEN
    RETURN NEW;
  END IF;

  -- 2. Đọc vai trò từ JWT claims nếu được gọi qua HTTP API
  v_jwt_claims := current_setting('request.jwt.claims', true);
  IF v_jwt_claims IS NOT NULL AND v_jwt_claims <> '' THEN
    v_jwt_role := (v_jwt_claims::jsonb ->> 'role');
  ELSE
    v_jwt_role := NULL;
  END IF;

  -- 3. Cho phép Service Role (backend scripts / migrations qua service_role key)
  IF v_jwt_role = 'service_role' OR auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- 4. Chặn hoàn toàn yêu cầu vô danh (anon) cập nhật bất kỳ trường nào trên profiles
  IF v_jwt_role = 'anon' OR auth.role() = 'anon' OR auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Quyền hạn bị từ chối: Yêu cầu chưa xác thực không thể sửa đổi hồ sơ người dùng.';
  END IF;

  -- 5. Người dùng xác thực thông thường (không phải Admin) không được cập nhật hồ sơ của người khác
  IF auth.uid() IS NOT NULL AND auth.uid() <> OLD.id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Quyền hạn bị từ chối: Bạn không có quyền sửa đổi hồ sơ của người dùng khác.';
  END IF;

  -- 6. Người dùng xác thực thông thường (không phải Admin) không được tự sửa role hoặc status
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.status IS DISTINCT FROM OLD.status) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Quản trị viên (Admin) mới có thể sửa đổi vai trò hoặc trạng thái.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- 2. HARDEN RLS ON PROFILES: Chặn hoàn toàn UPDATE từ Anonymous & Người khác
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Dọn dẹp toàn bộ policy UPDATE cũ hoặc quá mở có thể tồn tại trên profiles
DROP POLICY IF EXISTS "profiles_update_owner_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are updatable" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for all users" ON public.profiles;
DROP POLICY IF EXISTS "Allow all update" ON public.profiles;
DROP POLICY IF EXISTS "allow_update_all" ON public.profiles;
DROP POLICY IF EXISTS "anon_update_profiles" ON public.profiles;

CREATE POLICY "profiles_update_owner_or_admin" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- 3. HARDEN RPC: is_classroom_teacher(p_classroom_id, p_user_id)
-- Ngăn chặn giả danh (Identity Spoofing):
-- - Anon caller (auth.uid() IS NULL): luôn trả về FALSE, thu hồi EXECUTE khỏi anon
-- - Non-admin caller: cưỡng chế kiểm tra theo auth.uid() thực tế của caller, bất kể p_user_id truyền vào là gì
-- - Admin hoặc service_role: cho phép kiểm tra p_user_id tùy chọn
CREATE OR REPLACE FUNCTION public.is_classroom_teacher(
  p_classroom_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_effective_user_id UUID;
BEGIN
  -- 1. Nếu caller là anonymous (auth.uid() IS NULL) và không phải service_role: tuyệt đối không cấp quyền
  IF auth.uid() IS NULL AND auth.role() IS DISTINCT FROM 'service_role' THEN
    RETURN FALSE;
  END IF;

  -- 2. Nếu caller không phải Admin và không phải service_role:
  -- Ép buộc chỉ kiểm tra theo auth.uid() của chính caller, triệt tiêu hoàn toàn nguy cơ giả mạo p_user_id
  IF NOT public.is_admin() AND auth.role() IS DISTINCT FROM 'service_role' THEN
    v_effective_user_id := auth.uid();
  ELSE
    v_effective_user_id := COALESCE(p_user_id, auth.uid());
  END IF;

  IF v_effective_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = p_classroom_id AND teacher_id = v_effective_user_id
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_classroom_teacher(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_classroom_teacher(UUID, UUID) TO authenticated, service_role;

-- 4. HARDEN SECURITY DEFINER SEARCH PATH & RESTRICT EXECUTE
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin') AND status != 'blocked'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_user_status(target_user_id UUID, new_role TEXT, new_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Chỉ có Admin mới có quyền thay đổi role hoặc status của người dùng.';
  END IF;

  -- SEC-SELF-GUARD: Ngăn chặn quản trị viên tự khóa hoặc tự hạ quyền của chính mình qua RPC
  IF auth.role() IS DISTINCT FROM 'service_role' AND target_user_id = auth.uid() THEN
    IF new_status = 'blocked' THEN
      RAISE EXCEPTION 'Quản trị viên không thể tự khóa tài khoản của chính mình.';
    END IF;
    IF new_role IS NOT NULL AND new_role != 'admin' THEN
      RAISE EXCEPTION 'Quản trị viên không thể tự hạ quyền của chính mình.';
    END IF;
  END IF;

  UPDATE public.profiles
  SET 
    role = COALESCE(new_role, role),
    status = COALESCE(new_status, status),
    updated_at = NOW()
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Cập nhật thành công.');
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Chỉ có Admin mới có quyền thực thi thao tác xóa người dùng.';
  END IF;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'target_user_id không được để trống.';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Không thể tự xóa tài khoản quản trị đang đăng nhập.';
  END IF;

  DELETE FROM public.user_vocab_srs WHERE user_id = target_user_id;
  DELETE FROM public.user_lesson_progress WHERE user_id = target_user_id;
  DELETE FROM public.user_study_logs WHERE user_id = target_user_id;
  DELETE FROM public.ai_conversations WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Đã xóa người dùng thành công.');
END;
$$;

-- Thu hồi quyền EXECUTE các hàm quản trị đối với anon và PUBLIC
REVOKE EXECUTE ON FUNCTION public.admin_update_user_status(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_user_status(UUID, TEXT, TEXT) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.admin_delete_user(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated, service_role;

COMMIT;

