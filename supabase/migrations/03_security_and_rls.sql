-- =========================================================================
-- MIGRATION 03: Row Level Security (RLS) & Role-Based Access Control (RBAC)
-- Description: Thiết lập kiểm soát truy cập và bảo vệ dữ liệu toàn diện ở tầng Database.
-- Không phụ thuộc vào kiểm tra frontend.
-- =========================================================================

-- 1. Helper function: Kiểm tra người dùng hiện tại có phải Admin không (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Trigger: Chặn người dùng tự nâng quyền (role) hoặc gỡ chặn (status) của chính mình
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu role hoặc status bị thay đổi
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.status IS DISTINCT FROM OLD.status) THEN
    -- Nếu không phải Admin thực hiện thay đổi, chặn ngay lập tức
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Quản trị viên (Admin) mới có thể thay đổi vai trò (role) hoặc trạng thái (status).';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- =========================================================================
-- ĐẢM BẢO CÁC CỘT BỔ SUNG TỒN TẠI TRÊN CÁC BẢNG ĐÃ TẠO TỪ TRƯỚC
-- =========================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0;

ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Học viên HanziGo';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_level TEXT DEFAULT 'HSK 1';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT '#HoiDapNguPhap';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS liked_by JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- =========================================================================
-- KÍCH HOẠT ROW LEVEL SECURITY (RLS) CHO TẤT CẢ CÁC BẢNG
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pronunciation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocab_srs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_materials ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- XÓA TẤT CẢ CÁC CHÍNH SÁCH CŨ (ĐẶC BIỆT CÁC POLICY ALL USING (true))
-- =========================================================================
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- =========================================================================
-- 1. BẢNG PROFILES
-- =========================================================================
-- Mọi người đều có thể xem hồ sơ công khai (tên, avatar, level, streak, xp)
CREATE POLICY "profiles_select_public" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Người dùng chỉ được sửa hồ sơ của chính mình (trigger sẽ chặn sửa role/status nếu không phải admin)
-- Hoặc Admin có quyền cập nhật bất kỳ hồ sơ nào
CREATE POLICY "profiles_update_owner_or_admin" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Chỉ Admin mới được phép xóa hồ sơ người dùng
CREATE POLICY "profiles_delete_admin_only" 
  ON public.profiles FOR DELETE 
  USING (public.is_admin());

-- =========================================================================
-- 2. CÁC BẢNG NỘI DUNG HỌC TẬP (materials, lessons, vocabulary, writing, pronunciation)
-- =========================================================================
-- Đọc công khai
CREATE POLICY "materials_select_public" ON public.materials FOR SELECT USING (true);
CREATE POLICY "lessons_select_public" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "vocabulary_select_public" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "writing_select_public" ON public.writing_characters FOR SELECT USING (true);
CREATE POLICY "pronunciation_select_public" ON public.pronunciation_items FOR SELECT USING (true);

-- Chỉ Admin mới được Thêm / Sửa / Xóa nội dung học tập
CREATE POLICY "materials_admin_insert" ON public.materials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "materials_admin_update" ON public.materials FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "materials_admin_delete" ON public.materials FOR DELETE USING (public.is_admin());

CREATE POLICY "lessons_admin_insert" ON public.lessons FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "lessons_admin_update" ON public.lessons FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "lessons_admin_delete" ON public.lessons FOR DELETE USING (public.is_admin());

CREATE POLICY "vocabulary_admin_insert" ON public.vocabulary FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "vocabulary_admin_update" ON public.vocabulary FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "vocabulary_admin_delete" ON public.vocabulary FOR DELETE USING (public.is_admin());

CREATE POLICY "writing_admin_insert" ON public.writing_characters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "writing_admin_update" ON public.writing_characters FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "writing_admin_delete" ON public.writing_characters FOR DELETE USING (public.is_admin());

CREATE POLICY "pronunciation_admin_insert" ON public.pronunciation_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "pronunciation_admin_update" ON public.pronunciation_items FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pronunciation_admin_delete" ON public.pronunciation_items FOR DELETE USING (public.is_admin());

-- =========================================================================
-- 3. TIẾN ĐỘ VÀ DỮ LIỆU HỌC TẬP CỦA HỌC VIÊN (SRS, Lesson Progress, Logs)
-- =========================================================================
-- Học viên chỉ xem và thao tác dữ liệu của chính mình; Admin xem được
CREATE POLICY "user_vocab_srs_owner_all" 
  ON public.user_vocab_srs FOR ALL 
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_lesson_progress_owner_all" 
  ON public.user_lesson_progress FOR ALL 
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_study_logs_owner_all" 
  ON public.user_study_logs FOR ALL 
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "ai_conversations_owner_all" 
  ON public.ai_conversations FOR ALL 
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "ai_messages_owner_all" 
  ON public.ai_messages FOR ALL 
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_saved_materials_owner_all" 
  ON public.user_saved_materials FOR ALL 
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- =========================================================================
-- 4. BẢNG TIN CỘNG ĐỒNG VÀ GHÉP BẠN HỌC
-- =========================================================================
CREATE POLICY "community_posts_select" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "community_posts_update" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());
CREATE POLICY "community_posts_delete" ON public.community_posts FOR DELETE USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "study_partners_select" ON public.study_partners FOR SELECT USING (true);
CREATE POLICY "study_partners_insert" ON public.study_partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "study_partners_update" ON public.study_partners FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "study_partners_delete" ON public.study_partners FOR DELETE USING (auth.uid() = user_id OR public.is_admin());
