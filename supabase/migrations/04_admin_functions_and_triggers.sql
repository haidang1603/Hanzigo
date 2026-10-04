-- =========================================================================
-- MIGRATION 04: Server-Side Admin Functions, User Management & Auth Triggers
-- Description: Cung cấp các stored procedures (RPC) bảo mật chạy trên server
-- để Admin thực hiện quản lý học viên, xóa user, và gán vai trò an toàn.
-- =========================================================================

-- 1. Hàm tạo tự động hồ sơ khi người dùng đăng ký qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, level, avatar, role, status, streak, xp, words_learned)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    ),
    COALESCE(new.raw_user_meta_data->>'level', 'HSK 1 - Sơ cấp'),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    ),
    'student', -- Mặc định luôn là học viên thông thường
    'active',
    1,
    50,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Hàm Admin Server-side: Xóa tài khoản người dùng an toàn
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  -- Kiểm tra quyền Admin của caller
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Chỉ có Admin mới có quyền thực thi thao tác xóa người dùng.';
  END IF;

  -- Không cho phép admin tự xóa chính mình qua RPC này
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Không thể tự xóa tài khoản quản trị đang đăng nhập.';
  END IF;

  -- Xóa dữ liệu học tập liên quan
  DELETE FROM public.user_vocab_srs WHERE user_id = target_user_id;
  DELETE FROM public.user_lesson_progress WHERE user_id = target_user_id;
  DELETE FROM public.user_study_logs WHERE user_id = target_user_id;
  DELETE FROM public.ai_conversations WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  -- Xóa khỏi auth.users nếu bảng tồn tại
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Đã xóa người dùng thành công.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Hàm Admin Server-side: Cập nhật quyền (role) hoặc trạng thái (status)
CREATE OR REPLACE FUNCTION public.admin_update_user_status(target_user_id UUID, new_role TEXT, new_status TEXT)
RETURNS JSONB AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Chỉ có Admin mới có quyền thay đổi role hoặc status của người dùng.';
  END IF;

  IF new_role IS NOT NULL AND new_role NOT IN ('student', 'moderator', 'admin') THEN
    RAISE EXCEPTION 'Giá trị vai trò (role) không hợp lệ.';
  END IF;

  IF new_status IS NOT NULL AND new_status NOT IN ('active', 'blocked') THEN
    RAISE EXCEPTION 'Giá trị trạng thái (status) không hợp lệ.';
  END IF;

  UPDATE public.profiles
  SET 
    role = COALESCE(new_role, role),
    status = COALESCE(new_status, status),
    updated_at = NOW()
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Cập nhật thành công.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
