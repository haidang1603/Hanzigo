-- =========================================================================
-- MIGRATION 17: Bổ sung và đồng bộ cột XP, Chuỗi (Streak) cho bảng profiles
-- Mô tả: Đảm bảo bảng profiles trên Supabase luôn có đầy đủ các cột:
--   - xp: Điểm kinh nghiệm tích lũy
--   - streak: Chuỗi số ngày học liên tiếp hiện tại
--   - words_learned: Số từ vựng đã ghi nhớ
--   - longest_streak: Kỷ lục chuỗi ngày học dài nhất
--   - last_study_date: Ngày học gần nhất
--   - is_leaderboard_hidden: Cài đặt ẩn danh trên Bảng Vàng
-- =========================================================================

-- 1. Bổ sung các cột nếu chưa tồn tại (An toàn, không làm mất dữ liệu hiện có)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_study_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_leaderboard_hidden BOOLEAN DEFAULT false;

-- 2. Cập nhật giá trị mặc định cho các hàng cũ đang bị NULL (Backfill)
UPDATE public.profiles 
SET xp = 50 
WHERE xp IS NULL;

UPDATE public.profiles 
SET streak = 1 
WHERE streak IS NULL;

UPDATE public.profiles 
SET words_learned = 0 
WHERE words_learned IS NULL;

UPDATE public.profiles 
SET longest_streak = GREATEST(streak, 1) 
WHERE longest_streak IS NULL;

UPDATE public.profiles 
SET is_leaderboard_hidden = false 
WHERE is_leaderboard_hidden IS NULL;

-- 3. Tạo Index tối ưu hiệu năng truy vấn cho Bảng Xếp Hạng (Leaderboard)
CREATE INDEX IF NOT EXISTS idx_profiles_xp_desc 
  ON public.profiles (xp DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_streak_desc 
  ON public.profiles (streak DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_leaderboard 
  ON public.profiles (status, is_leaderboard_hidden, xp DESC);

-- 4. Chú thích tài liệu cho các cột dữ liệu
COMMENT ON COLUMN public.profiles.xp IS 'Điểm kinh nghiệm tích lũy (XP) dùng cho cấp độ và Bảng Vàng';
COMMENT ON COLUMN public.profiles.streak IS 'Số ngày học liên tiếp (Streak) hiện tại';
COMMENT ON COLUMN public.profiles.words_learned IS 'Tổng số từ vựng HSK đã ghi nhớ thành thạo';
COMMENT ON COLUMN public.profiles.longest_streak IS 'Kỷ lục chuỗi ngày học liên tục dài nhất';
COMMENT ON COLUMN public.profiles.is_leaderboard_hidden IS 'Chế độ ẩn danh trên Bảng Xếp Hạng';

-- 5. Đảm bảo Policy RLS cho phép người dùng cập nhật XP/Streak của chính họ
DO $$
BEGIN
  -- Đảm bảo chính sách update cho phép chủ tài khoản cập nhật thông tin học tập
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'profiles_update_owner_or_admin'
  ) THEN
    CREATE POLICY "profiles_update_owner_or_admin" 
      ON public.profiles FOR UPDATE 
      USING (auth.uid() = id OR public.is_admin())
      WITH CHECK (auth.uid() = id OR public.is_admin());
  END IF;
END $$;

-- 6. Truy vấn kiểm tra kết quả sau khi chạy
SELECT id, name, email, role, level, xp, streak, words_learned, created_at 
FROM public.profiles 
ORDER BY xp DESC 
LIMIT 10;
