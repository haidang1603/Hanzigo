-- =========================================================================
-- HANZI GO - MIGRATION 09: USER ROLE REGISTRATION & ADMIN PERMANENCE
-- =========================================================================
-- 1. Chặn người dùng thường tự ý đổi role.
-- 2. Gán role (Học sinh / Giáo viên) khi đăng ký và đăng nhập.
-- 3. BẢO TOÀN VĨNH VIỄN quyền Admin cho lehaidang16032006@gmail.com & admin@hanzigo.com,
--    không bao giờ bị ghi đè thành student hay teacher dù đăng nhập bằng role nào.

-- 1. Cập nhật trigger handle_new_user để lưu role được chọn lúc đăng ký
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
    -- Email admin mặc định luôn là 'admin', các user khác lấy theo role chọn lúc đăng ký
    CASE 
      WHEN LOWER(new.email) IN ('lehaidang16032006@gmail.com', 'admin@hanzigo.com') THEN 'admin'
      WHEN LOWER(COALESCE(new.raw_user_meta_data->>'role', '')) = 'teacher' THEN 'teacher'
      ELSE 'student'
    END,
    'active',
    0, -- Chuỗi bắt đầu từ 0 cho đến khi hoàn thành bài học đầu tiên trong ngày
    50, -- Điểm XP ban đầu chuẩn
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
    -- Nếu là email admin thì luôn giữ admin, không bao giờ hạ quyền
    role = CASE 
      WHEN LOWER(profiles.email) IN ('lehaidang16032006@gmail.com', 'admin@hanzigo.com') THEN 'admin'
      WHEN profiles.role IS NULL OR profiles.role = 'student' THEN EXCLUDED.role
      ELSE profiles.role 
    END,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Đảm bảo trigger on_auth_user_created đang hoạt động
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Hàm bảo mật hỗ trợ xác lập vai trò khi người dùng đăng nhập
CREATE OR REPLACE FUNCTION public.set_user_role_on_login(p_role TEXT)
RETURNS JSONB AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_email TEXT;
  v_current_role TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Chưa đăng nhập');
  END IF;

  SELECT email, role INTO v_email, v_current_role FROM public.profiles WHERE id = v_uid;

  -- Nếu là email admin hoặc role hiện tại là admin/moderator thì luôn bảo toàn admin
  IF LOWER(v_email) IN ('lehaidang16032006@gmail.com', 'admin@hanzigo.com') OR v_current_role IN ('admin', 'moderator') THEN
    UPDATE public.profiles SET role = 'admin', status = 'active' WHERE id = v_uid;
    RETURN jsonb_build_object('success', true, 'role', 'admin');
  END IF;

  IF p_role NOT IN ('student', 'teacher') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Vai trò không hợp lệ');
  END IF;

  -- Cập nhật vai trò theo lựa chọn lúc đăng nhập
  UPDATE public.profiles
  SET role = p_role, updated_at = NOW()
  WHERE id = v_uid;

  RETURN jsonb_build_object('success', true, 'role', p_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.set_user_role_on_login(TEXT) TO authenticated;

-- 3. Khôi phục quyền Admin ngay lập tức cho các tài khoản Admin
UPDATE public.profiles
SET role = 'admin', status = 'active'
WHERE LOWER(email) IN ('lehaidang16032006@gmail.com', 'admin@hanzigo.com');

-- 4. Điều chỉnh lại điểm XP nếu trước đó bị gán nhầm 9999
UPDATE public.profiles
SET xp = 70
WHERE xp >= 9999;
