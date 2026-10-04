-- =========================================================================
-- HANZIGO - SUPABASE UPDATE: BẢNG XẾP HẠNG XP, PROFILE & CỘNG ĐỒNG
-- Chạy đoạn script này trên Supabase SQL Editor:
-- https://supabase.com/dashboard/project/woszblniatdvijwdkmpm/sql
-- =========================================================================

-- 1. BẢO ĐẢM CÁC CỘT CẦN THIẾT TỒN TẠI TRONG BẢNG PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0;

-- 2. TẠO CHỈ MỤC TỐI ƯU CHO BẢNG XẾP HẠNG XP (LEADERBOARD)
-- Tăng tốc độ truy vấn top học viên có điểm XP cao nhất
CREATE INDEX IF NOT EXISTS idx_profiles_xp_desc ON public.profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- 3. ĐẢM BẢO CHÍNH SÁCH RLS CHO PHÉP XEM BẢNG XẾP HẠNG CÔNG KHAI
-- Cho phép mọi học viên xem thông tin xếp hạng cơ bản (tên, avatar, level, xp, streak)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'profiles_select_public'
  ) THEN
    CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
  END IF;
END $$;

-- 4. ĐẢM BẢO CÁC CỘT HỖ TRỢ ẢNH / MÃ QR TRONG CỘNG ĐỒNG & GHÉP ĐÔI
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS qr_image TEXT;

-- 5. THÔNG BÁO HOÀN TẤT
SELECT '✅ Cập nhật Supabase thành công! Bảng xếp hạng XP và các cột mở rộng đã sẵn sàng.' AS message;
