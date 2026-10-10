-- =========================================================================
-- HANZI GO - MIGRATION 16: SEED DEFAULT CLASSROOMS & SECURE CREATION RPC
-- =========================================================================
-- 1. Khởi tạo sẵn 2 lớp học nền tảng mặc định trên Supabase DB (nếu chưa có)
--    để học viên có thể tra cứu mã (HZG-7K2P9, HZG-9M4X2) và tham gia ngay lập tức.
-- 2. Cung cấp RPC create_classroom_secure() (SECURITY DEFINER)
--    cho phép giáo viên/admin tạo lớp học an toàn, phòng ngừa lỗi RLS trên client.
-- =========================================================================

DO $$
DECLARE
  v_teacher_id UUID;
BEGIN
  -- Tìm tài khoản Admin hoặc Giáo viên khả dụng đầu tiên trong profiles
  SELECT id INTO v_teacher_id
  FROM public.profiles
  WHERE role IN ('admin', 'teacher') AND status != 'blocked'
  ORDER BY CASE WHEN role = 'admin' THEN 1 ELSE 2 END, created_at ASC
  LIMIT 1;

  -- Nếu tìm thấy giáo viên, khởi tạo 2 lớp mặc định
  IF v_teacher_id IS NOT NULL THEN
    -- 1. Lớp HSK 1 Nền tảng (HZG-7K2P9)
    INSERT INTO public.classrooms (
      id,
      teacher_id,
      name,
      description,
      hsk_level,
      class_code,
      max_students,
      status
    )
    VALUES (
      'c1000000-0000-0000-0000-000000000001'::uuid,
      v_teacher_id,
      'HSK 1 - Nhập môn Giao tiếp & Phát âm',
      'Lớp học nền tảng dành cho người mới bắt đầu. Tập trung phát âm chuẩn Pinyin và 150 từ vựng cốt lõi.',
      'HSK 1',
      'HZG-7K2P9',
      30,
      'active'
    )
    ON CONFLICT (class_code) DO NOTHING;

    -- 2. Lớp HSK 2 Hội thoại (HZG-9M4X2)
    INSERT INTO public.classrooms (
      id,
      teacher_id,
      name,
      description,
      hsk_level,
      class_code,
      max_students,
      status
    )
    VALUES (
      'c2000000-0000-0000-0000-000000000002'::uuid,
      v_teacher_id,
      'HSK 2 - Tăng tốc Hội thoại Hằng ngày',
      'Mở rộng 300 từ vựng và cấu trúc ngữ pháp thông dụng trong sinh hoạt và công việc.',
      'HSK 2',
      'HZG-9M4X2',
      25,
      'active'
    )
    ON CONFLICT (class_code) DO NOTHING;
  END IF;
END $$;

-- 2. RPC TẠO LỚP HỌC AN TOÀN (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.create_classroom_secure(
  p_name TEXT,
  p_description TEXT DEFAULT '',
  p_hsk_level TEXT DEFAULT 'HSK 1',
  p_class_code TEXT DEFAULT NULL,
  p_max_students INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  v_uid UUID;
  v_role TEXT;
  v_code TEXT;
  v_classroom RECORD;
BEGIN
  -- Xác thực user
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Chưa xác thực: Vui lòng đăng nhập trước khi tạo lớp học.';
  END IF;

  -- Xác thực quyền giáo viên / admin
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = v_uid AND status != 'blocked';

  IF v_role NOT IN ('teacher', 'admin') THEN
    RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ tài khoản có vai trò Giáo viên hoặc Quản trị viên mới được phép tạo lớp học.';
  END IF;

  -- Chuẩn hóa mã lớp
  IF p_class_code IS NULL OR TRIM(p_class_code) = '' THEN
    v_code := 'HZG-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
  ELSE
    v_code := UPPER(REGEXP_REPLACE(TRIM(p_class_code), '\s+', '', 'g'));
    IF NOT (v_code ~ '^HZG-[2-9A-HJ-NP-Z]{5}$') THEN
      v_code := 'HZG-' || REGEXP_REPLACE(v_code, '^HZG-?', '');
    END IF;
  END IF;

  -- Insert lớp học
  INSERT INTO public.classrooms (
    teacher_id,
    name,
    description,
    hsk_level,
    class_code,
    max_students,
    status
  )
  VALUES (
    v_uid,
    TRIM(p_name),
    TRIM(COALESCE(p_description, '')),
    COALESCE(p_hsk_level, 'HSK 1'),
    v_code,
    GREATEST(1, COALESCE(p_max_students, 30)),
    'active'
  )
  RETURNING * INTO v_classroom;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_classroom.id,
    'name', v_classroom.name,
    'description', v_classroom.description,
    'hsk_level', v_classroom.hsk_level,
    'class_code', v_classroom.class_code,
    'max_students', v_classroom.max_students,
    'status', v_classroom.status,
    'created_at', v_classroom.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.create_classroom_secure(TEXT, TEXT, TEXT, TEXT, INT) TO authenticated, service_role;
