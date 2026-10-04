-- =========================================================================
-- HANZIGO - SUPABASE MIGRATION & SEED SCRIPT (HSK 3.0 COMPLETE SYSTEM)
-- =========================================================================
-- Hướng dẫn:
-- 1. Mở: https://supabase.com/dashboard/project/woszblniatdvijwdkmpm/sql
-- 2. Dán toàn bộ nội dung file này vào và bấm [ RUN ] (Ctrl + Enter)
-- 3. File này tự động tạo bảng, cập nhật cột HSK 3.0, cấu hình RLS và nạp đầy đủ dữ liệu!
-- =========================================================================

-- 1. BẢNG PROFILES BỔ SUNG CỘT
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0;

-- 2. BẢNG CỘNG ĐỒNG & BẠN HỌC
CREATE TABLE IF NOT EXISTS public.community_posts (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Học viên HanziGo',
  author_avatar TEXT,
  author_level TEXT DEFAULT 'HSK 1',
  content TEXT NOT NULL,
  tag TEXT DEFAULT '#HoiDapNguPhap',
  likes INT DEFAULT 0,
  liked_by JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_partners (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  target_level TEXT DEFAULT 'HSK 2',
  daily_time TEXT DEFAULT 'Tối 20h - 21h',
  contact TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG DỮ LIỆU LEARNING PATH & GAMIFICATION SYSTEM
-- 3.1. learning_levels: 7 Cấp độ HSK 3.0 (HSK 1 đến HSK 7-9)
CREATE TABLE IF NOT EXISTS public.learning_levels (
  id TEXT PRIMARY KEY,
  level_number INT NOT NULL UNIQUE,
  code TEXT NOT NULL DEFAULT 'HSK 1',
  hsk_level TEXT DEFAULT 'HSK 1',
  hsk_stage TEXT DEFAULT 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)',
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  pinyin TEXT DEFAULT '',
  badge TEXT DEFAULT '🌱',
  color TEXT DEFAULT '#45B97C',
  description TEXT DEFAULT '',
  syllabus_5_pillars JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Đảm bảo các cột HSK 3.0 tồn tại nếu bảng đã được tạo trước đó
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS code TEXT DEFAULT 'HSK 1';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS hsk_level TEXT DEFAULT 'HSK 1';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS hsk_stage TEXT DEFAULT 'Stage 1: HSK 1–3';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT '';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS syllabus_5_pillars JSONB DEFAULT '{}'::jsonb;

-- 3.2. learning_chapters: 24 Chapter
CREATE TABLE IF NOT EXISTS public.learning_chapters (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL REFERENCES public.learning_levels(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  description TEXT DEFAULT '',
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3. learning_lessons: Bài học 9 bước chuẩn sư phạm
CREATE TABLE IF NOT EXISTS public.learning_lessons (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES public.learning_chapters(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL REFERENCES public.learning_levels(id) ON DELETE CASCADE,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  duration_minutes INT DEFAULT 15,
  xp_reward INT DEFAULT 50,
  description TEXT DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4. learning_boss_challenges: Thử thách Boss trận chiến cuối mỗi Chapter
CREATE TABLE IF NOT EXISTS public.learning_boss_challenges (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES public.learning_chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  scenario TEXT NOT NULL,
  xp_reward INT DEFAULT 200,
  passing_score INT DEFAULT 70,
  stages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5. user_journey_progress: Lưu tiến độ node-by-node của từng học viên
CREATE TABLE IF NOT EXISTS public.user_journey_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
  completed_bosses TEXT[] DEFAULT ARRAY[]::TEXT[],
  unlocked_levels INT DEFAULT 1,
  active_lesson_id TEXT DEFAULT 'l-101',
  streak_count INT DEFAULT 1,
  last_study_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_journey UNIQUE (user_id)
);

-- 3.6. user_skill_mastery: Điểm thông thạo 7 kỹ năng
CREATE TABLE IF NOT EXISTS public.user_skill_mastery (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listening INT DEFAULT 40,
  speaking INT DEFAULT 35,
  reading INT DEFAULT 50,
  writing INT DEFAULT 30,
  vocabulary INT DEFAULT 45,
  hanzi INT DEFAULT 38,
  grammar INT DEFAULT 42,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_skills UNIQUE (user_id)
);

-- 3.7. user_daily_missions: Nhiệm vụ ngày & tiến độ thực hiện
CREATE TABLE IF NOT EXISTS public.user_daily_missions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_date DATE DEFAULT CURRENT_DATE,
  missions JSONB NOT NULL DEFAULT '[]'::jsonb,
  all_completed BOOLEAN DEFAULT FALSE,
  claimed_bonus BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_daily_missions UNIQUE (user_id, mission_date)
);

-- 4. BẬT BẢO MẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_boss_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_missions ENABLE ROW LEVEL SECURITY;

-- 5. CHÍNH SÁCH BẢO MẬT (POLICIES)
DROP POLICY IF EXISTS "community_posts_select" ON public.community_posts;
CREATE POLICY "community_posts_select" ON public.community_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "community_posts_insert" ON public.community_posts;
CREATE POLICY "community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "community_posts_update" ON public.community_posts;
CREATE POLICY "community_posts_update" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());
DROP POLICY IF EXISTS "community_posts_delete" ON public.community_posts;
CREATE POLICY "community_posts_delete" ON public.community_posts FOR DELETE USING (auth.uid() = author_id OR public.is_admin());

DROP POLICY IF EXISTS "study_partners_select" ON public.study_partners;
CREATE POLICY "study_partners_select" ON public.study_partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "study_partners_insert" ON public.study_partners;
CREATE POLICY "study_partners_insert" ON public.study_partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "study_partners_update" ON public.study_partners;
CREATE POLICY "study_partners_update" ON public.study_partners FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "study_partners_delete" ON public.study_partners;
CREATE POLICY "study_partners_delete" ON public.study_partners FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "learning_levels_select" ON public.learning_levels;
CREATE POLICY "learning_levels_select" ON public.learning_levels FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_levels_admin" ON public.learning_levels;
CREATE POLICY "learning_levels_admin" ON public.learning_levels FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "learning_chapters_select" ON public.learning_chapters;
CREATE POLICY "learning_chapters_select" ON public.learning_chapters FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_chapters_admin" ON public.learning_chapters;
CREATE POLICY "learning_chapters_admin" ON public.learning_chapters FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "learning_lessons_select" ON public.learning_lessons;
CREATE POLICY "learning_lessons_select" ON public.learning_lessons FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_lessons_admin" ON public.learning_lessons;
CREATE POLICY "learning_lessons_admin" ON public.learning_lessons FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "learning_boss_select" ON public.learning_boss_challenges;
CREATE POLICY "learning_boss_select" ON public.learning_boss_challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_boss_admin" ON public.learning_boss_challenges;
CREATE POLICY "learning_boss_admin" ON public.learning_boss_challenges FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "user_journey_owner" ON public.user_journey_progress;
CREATE POLICY "user_journey_owner" ON public.user_journey_progress FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_skills_owner" ON public.user_skill_mastery;
CREATE POLICY "user_skills_owner" ON public.user_skill_mastery FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_daily_missions_owner" ON public.user_daily_missions;
CREATE POLICY "user_daily_missions_owner" ON public.user_daily_missions FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 6. INDEX TĂNG TỐC TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_chapters_level ON public.learning_chapters(level_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON public.learning_lessons(chapter_id, lesson_number);
CREATE INDEX IF NOT EXISTS idx_user_journey_uid ON public.user_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_uid_date ON public.user_daily_missions(user_id, mission_date);

-- =========================================================================
-- 7. TỰ ĐỘNG NẠP DỮ LIỆU HSK 3.0 (7 LEVELS & 24 CHAPTERS)
-- =========================================================================

-- 7.1. Nạp 7 Cấp độ HSK 3.0
INSERT INTO public.learning_levels (id, level_number, code, hsk_level, hsk_stage, title, title_zh, tagline, badge, color, description, syllabus_5_pillars)
VALUES
('lvl-1', 1, 'HSK 1', 'HSK 1', 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)', 'Khởi đầu & Nền tảng', '中文启程', 'Xây dựng nền móng phát âm & giao tiếp sơ khởi', '🌱', '#45B97C', 'Làm quen tiếng Trung, Pinyin, 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu, quy tắc biến điệu và chữ Hán cơ bản.', '{"vocabularyTarget": 500, "grammarTarget": 48, "hanziTarget": 300, "tasks": ["Chào hỏi lịch sự", "Giới thiệu bản thân", "Đếm số 1-100", "Nói về gia đình", "Hỏi ngày giờ"]}'::jsonb),
('lvl-2', 2, 'HSK 2', 'HSK 2', 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)', 'Sinh hoạt & Tình huống quen thuộc', '日常中文', 'Xử lý trôi chảy các tình huống sinh hoạt thường nhật', '🌿', '#F4B942', 'Gọi món, mua sắm, thời tiết, phương tiện đi lại và khám bệnh đơn giản.', '{"vocabularyTarget": 1272, "grammarTarget": 96, "hanziTarget": 600, "tasks": ["Gọi món nhà hàng", "Hỏi và chỉ đường", "Mua sắm quét mã", "So sánh thời tiết chữ 比"]}'::jsonb),
('lvl-3', 3, 'HSK 3', 'HSK 3', 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)', 'Giao tiếp thực tế & Kể chuyện', '真实交流', 'Mốc chuyển mình: Thực hiện các nhiệm vụ giao tiếp độc lập', '🌳', '#3B82F6', 'Hội thoại dài, kể chuyện, câu chữ 把/被, viết đoạn văn ngắn và hoàn thành Boss du lịch Trung Quốc 3 ngày.', '{"vocabularyTarget": 2245, "grammarTarget": 144, "hanziTarget": 900, "tasks": ["Sinh tồn du lịch 3 ngày", "Sử dụng câu chữ 把/被", "Kể lại trải nghiệm", "Viết đoạn 100 chữ"]}'::jsonb),
('lvl-4', 4, 'HSK 4', 'HSK 4', 'Stage 2: HSK 4–6 (Trung cấp & Độc lập)', 'Sử dụng tiếng Trung độc lập', '独立应用', 'Thảo luận đa chủ đề và giao tiếp tự nhiên với người bản xứ', '🔥', '#E85D3F', 'Phỏng vấn xin việc, viết CV, bàn luận công nghệ số, môi trường, cảm xúc và xã hội.', '{"vocabularyTarget": 3245, "grammarTarget": 216, "hanziTarget": 1200, "tasks": ["Phỏng vấn xin việc", "Viết CV tiếng Trung", "Thuyết trình 2-3 phút", "Thảo luận lối sống số"]}'::jsonb),
('lvl-5', 5, 'HSK 5', 'HSK 5', 'Stage 2: HSK 4–6 (Trung cấp & Độc lập)', 'Thành thạo & Tiếp nhận thông tin gốc', '流利自如', 'Tiếng Trung trở thành công cụ tiếp nhận thông tin thực thụ', '🚀', '#8B5CF6', 'Đọc báo, xem phim, nghe podcast, làm quen giải thích bằng tiếng Trung (🇨🇳 → 🇨🇳).', '{"vocabularyTarget": 4316, "grammarTarget": 288, "hanziTarget": 1500, "tasks": ["Đọc báo Nhân Dân Nhật Báo", "Xem phim tài liệu không sub", "Dùng thành ngữ 4 chữ", "Viết luận 400 chữ"]}'::jsonb),
('lvl-6', 6, 'HSK 6', 'HSK 6', 'Stage 2: HSK 4–6 (Trung cấp & Độc lập)', 'Nâng cao & Bút pháp học thuật', '精深高阶', 'Hiểu sâu và diễn đạt tinh tế trong mọi bối cảnh trừu tượng', '🐉', '#E11D48', 'Đàm phán thương mại, tranh luận học thuật, tóm tắt bài 1000 chữ thành 400 chữ, phong cách cổ văn.', '{"vocabularyTarget": 5456, "grammarTarget": 360, "hanziTarget": 1800, "tasks": ["Đàm phán hợp đồng kinh tế", "Tranh luận hội thảo", "Tóm tắt văn bản học thuật", "Cảm thụ cổ văn"]}'::jsonb),
('lvl-7', 7, 'HSK 7-9', 'HSK 7-9', 'Stage 3: HSK 7–9 (Cao cấp & Bậc thầy)', 'Chinese Master & Phiên dịch', '中文大师', 'Đỉnh cao HSK 3.0: Nghe, Nói, Đọc, Viết và Dịch thuật chuyên nghiệp', '👑', '#0D9488', 'Kiến trúc HSK 7-9: Biên dịch và phiên dịch cabin chuyên nghiệp.', '{"vocabularyTarget": 11092, "grammarTarget": 572, "hanziTarget": 3000, "tasks": ["Biên dịch chính luận 2 chiều", "Phiên dịch nối tiếp", "Nghiên cứu văn bản cổ", "Hùng biện ngoại giao"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  level_number = EXCLUDED.level_number,
  code = EXCLUDED.code,
  hsk_level = EXCLUDED.hsk_level,
  hsk_stage = EXCLUDED.hsk_stage,
  title = EXCLUDED.title,
  title_zh = EXCLUDED.title_zh,
  tagline = EXCLUDED.tagline,
  badge = EXCLUDED.badge,
  color = EXCLUDED.color,
  description = EXCLUDED.description,
  syllabus_5_pillars = EXCLUDED.syllabus_5_pillars;

-- 7.2. Nạp 24 Chapters
INSERT INTO public.learning_chapters (id, level_id, chapter_number, title, title_zh, description, order_index)
VALUES
('ch-1', 'lvl-1', 1, 'Pinyin & 4 Thanh điệu căn bản', '拼音与四声', 'Làm quen hệ thống ngữ âm: Thanh mẫu b, p, m, f, d, t, n, l và 4 cao độ thanh điệu chuẩn.', 1),
('ch-2', 'lvl-1', 2, 'Vận mẫu & Âm uốn lưỡi Er', '韵母与儿化音', 'Bảng vận mẫu đơn, vận mẫu kép và âm uốn lưỡi tạo ngữ điệu bản ngữ.', 2),
('ch-3', 'lvl-1', 3, 'Quy tắc biến điệu quan trọng', '变调规则', 'Nắm chắc bí kíp biến điệu hai thanh 3, biến điệu chữ 不 và 一.', 3),
('ch-4', 'lvl-1', 4, 'Bút thuận & 20 Bộ thủ thông dụng', '笔顺与常用部首', 'Quy tắc thuận bút và các bộ thủ cấu tạo nên 80% chữ Hán sơ cấp.', 4),
('ch-5', 'lvl-2', 5, 'Chào hỏi, Xưng hô & Giới thiệu bản thân', '问候与自我介绍', 'Nói lưu loát họ tên, quốc tịch, tuổi tác và nghề nghiệp.', 5),
('ch-6', 'lvl-2', 6, 'Gia đình & Các mối quan hệ thân thiết', '家庭与亲友', 'Từ vựng xưng hô các thành viên gia đình và lượng từ 口.', 6),
('ch-7', 'lvl-2', 7, 'Đi chợ, Mua sắm & Mặc cả giá cả', '购物与议价', 'Hỏi giá tiền (块/元), mặc cả và thanh toán di động WeChat/Alipay.', 7),
('ch-8', 'lvl-2', 8, 'Ẩm thực, Nhà hàng & Văn hóa bàn ăn', '餐厅点餐', 'Thực đơn đồ ăn Trung Hoa, khẩu vị ít cay và gọi đồ uống.', 8),
('ch-9', 'lvl-3', 9, 'Lượng từ & Cấu trúc số lượng', '量词与数量结构', 'Lượng từ quen thuộc: 个, 本, 支, 杯, 张, 件 và cách kết hợp chuẩn.', 9),
('ch-10', 'lvl-3', 10, 'Thời gian, Ngày tháng & Lịch trình', '时间与日程', 'Diễn đạt giờ phút, ngày tháng năm, thứ trong tuần và sắp xếp lịch hẹn.', 10),
('ch-11', 'lvl-3', 11, 'Câu so sánh chữ 比 & Phủ định đa dạng', '比较句与否定', 'So sánh hơn, so sánh bằng, 不 vs 没 và cách biểu đạt mức độ.', 11),
('ch-12', 'lvl-3', 12, 'Câu ghép, Liên từ logic & Boss Du Lịch', '复句与实战大考', 'Bởi vì...cho nên..., Mặc dù...nhưng... và Đại Khảo Hạch HSK 3 Du Lịch 3 Ngày.', 12),
('ch-13', 'lvl-4', 13, 'Gặp gỡ, Kết bạn & Đàm thoại phản xạ', '社交交友', 'Trò chuyện sở thích, hẹn đi xem phim, đi cà phê và giữ liên lạc.', 13),
('ch-14', 'lvl-4', 14, 'Đặt lịch hẹn, Khách sạn & Vé tàu cao tốc', '预订与出行', 'Đặt phòng khách sạn qua Ctrip, mua vé tàu cao tốc (高铁) và đổi trả vé.', 14),
('ch-15', 'lvl-4', 15, 'Hỏi đường, Đi lạc & Bản đồ Ga tàu điện', '问路与地铁', 'Di chuyển bằng tàu điện ngầm tại các siêu đô thị Bắc Kinh, Thượng Hải.', 15),
('ch-16', 'lvl-4', 16, 'Công sở, Email & Trao đổi đồng nghiệp', '职场与沟通', 'Quy tắc viết email công việc lịch sự và giao tiếp phòng ban.', 16),
('ch-17', 'lvl-5', 17, 'Văn hóa mạng xã hội, Douyin & Slang', '网络热梗与社交', 'Các câu nói trendy, từ lóng internet của giới trẻ Trung Quốc.', 17),
('ch-18', 'lvl-5', 18, 'Ẩm thực 8 đại trường phái Trung Hoa', '中国八大菜系', 'Khám phá văn hóa ẩm thực Tứ Xuyên, Quảng Đông, Sơn Đông, Giang Tô.', 18),
('ch-19', 'lvl-5', 19, 'Lễ hội truyền thống & Phong tục', '传统节日与民俗', 'Tết Nguyên Đán, Trung Thu, phong bao lì xì và chúc Tết đúng nghi lễ.', 19),
('ch-20', 'lvl-5', 20, 'Xử lý tình huống y tế & Bệnh viện', '医院看病与应急', 'Đăng ký sổ khám bệnh, miêu tả triệu chứng và mua thuốc tại quầy.', 20),
('ch-21', 'lvl-6', 21, 'Thành ngữ 4 chữ kinh điển (成语)', '经典成语与典故', 'Nắm chắc 50 thành ngữ 4 chữ thông dụng trong văn nói trang trọng.', 21),
('ch-22', 'lvl-6', 22, 'Phỏng vấn xin việc & Viết CV', '面试与中文简历', 'Giới thiệu kỹ năng chuyên môn, kinh nghiệm thực tập và đàm phán lương.', 22),
('ch-23', 'lvl-6', 23, 'Đàm phán thương mại & Hợp đồng', '商务谈判与合同', 'Điều khoản giao hàng, thỏa thuận thanh toán LC/T/T và biên bản hợp tác.', 23),
('ch-24', 'lvl-6', 24, 'Đọc báo tài chính & Chinh phục HSK Cao cấp', '财经新闻与高级表达', 'Đọc báo Nhân Dân, Tân Hoa Xã và chiến lược đạt điểm cao HSK 5-6.', 24)
ON CONFLICT (id) DO UPDATE SET
  level_id = EXCLUDED.level_id,
  chapter_number = EXCLUDED.chapter_number,
  title = EXCLUDED.title,
  title_zh = EXCLUDED.title_zh,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index;

-- 7.3. Nạp Flagship HSK 3 Boss Challenge (5 Ải Du Lịch Trung Quốc)
INSERT INTO public.learning_boss_challenges (id, chapter_id, title, title_zh, scenario, xp_reward, passing_score, stages)
VALUES
('boss-ch-12', 'ch-12', 'Đại Khảo Hạch HSK 3: Sinh Tồn Du Lịch Tự Túc 3 Ngày Tại Trung Quốc', 'HSK 3大考：中国三日游全境实战', 'Bạn tự xử lý 5 ải sinh tồn liên hoàn: ✈️ Sân bay ➔ 🏨 Khách sạn ➔ 🍜 Nhà hàng ➔ 🚇 Tàu điện ➔ 🛍️ Mua sắm.', 300, 80, '[{"stageNumber": 1, "stageIcon": "✈️", "stageTitle": "Sân bay Thủ đô Bắc Kinh", "bossDialogue": "您好，请问您来中国做什么？计划停留几天？", "options": [{"text": "您好！我是来旅游的，计划停留三天。这是我的护照和酒店预订单。", "isCorrect": true, "score": 20}]}, {"stageNumber": 2, "stageIcon": "🏨", "stageTitle": "Lễ tân khách sạn", "bossDialogue": "欢迎光临！请问有预订吗？", "options": [{"text": "您好，我预订了一间大床房。请问有高一点、安静一点的房间吗？WiFi密码是多少？", "isCorrect": true, "score": 20}]}, {"stageNumber": 3, "stageIcon": "🍜", "stageTitle": "Nhà hàng ẩm thực", "bossDialogue": "您好几位？今天有招牌烤鸭，想吃点什么？", "options": [{"text": "服务员，请来半只烤鸭、一碗青菜汤。请不要放辣椒！再来一壶热茶，谢谢！", "isCorrect": true, "score": 20}]}, {"stageNumber": 4, "stageIcon": "🚇", "stageTitle": "Ga tàu điện ngầm", "bossDialogue": "请问你要去哪里？", "options": [{"text": "请问去八达岭长城应该坐几号线？需要在哪里换乘？", "isCorrect": true, "score": 20}]}, {"stageNumber": 5, "stageIcon": "🛍️", "stageTitle": "Phố đi bộ Vương Phủ Tỉnh", "bossDialogue": "一共一百八十块，您想要哪一个？", "options": [{"text": "老板，如果这两个我都买，可以便宜一点吗？一百五十块可以吗？我扫码付钱！", "isCorrect": true, "score": 20}]}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  title_zh = EXCLUDED.title_zh,
  scenario = EXCLUDED.scenario,
  xp_reward = EXCLUDED.xp_reward,
  passing_score = EXCLUDED.passing_score,
  stages = EXCLUDED.stages;

SELECT '🎉 Cập nhật Schema & Seed dữ liệu HSK 3.0 thành công 100%!' AS result;
