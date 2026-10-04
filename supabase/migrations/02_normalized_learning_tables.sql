-- =========================================================================
-- MIGRATION 02: Normalized Learning Tables & SRS Spaced Repetition Engine
-- Description: Thay thế việc lưu trữ toàn bộ dữ liệu học tập trong các trường JSON lớn.
-- Tạo các bảng quan hệ chuẩn: user_vocab_srs, user_lesson_progress, user_study_logs,
-- ai_conversations, ai_messages, user_saved_materials.
-- =========================================================================

-- 1. user_vocab_srs: Tiến độ từ vựng theo thuật toán SRS (SM-2)
CREATE TABLE IF NOT EXISTS public.user_vocab_srs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocab_id BIGINT,
  hanzi TEXT NOT NULL,
  pinyin TEXT,
  meaning TEXT,
  level TEXT DEFAULT 'HSK 1',
  stage INT DEFAULT 0,              -- 0: Học mới, 1: Đang ôn tập, 2: Đã thuần thục
  repetitions INT DEFAULT 0,        -- Số lần ôn liên tiếp đúng
  interval_days INT DEFAULT 1,      -- Khoảng cách ngày ôn kế tiếp
  ease_factor NUMERIC(4,2) DEFAULT 2.50, -- Hệ số dễ/khó SM-2 (tối thiểu 1.30)
  next_review_at TIMESTAMPTZ DEFAULT NOW(), -- Thời điểm cần ôn tập tiếp theo
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_vocab UNIQUE (user_id, hanzi)
);

CREATE INDEX IF NOT EXISTS idx_user_vocab_srs_user_review 
  ON public.user_vocab_srs(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_vocab_srs_stage 
  ON public.user_vocab_srs(user_id, stage);

-- 2. user_lesson_progress: Tiến độ hoàn thành bài học
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INT DEFAULT 100,
  xp_earned INT DEFAULT 50,
  CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lesson_user 
  ON public.user_lesson_progress(user_id);

-- 3. user_study_logs: Lịch sử hoạt động học tập (Audit trail & chống cộng điểm lặp XP)
CREATE TABLE IF NOT EXISTS public.user_study_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'vocab_srs', 'lesson_complete', 'pronounce_practice', 'writing_practice', 'ai_chat'
  item_ref TEXT,               -- ID bài học / chữ Hán / mã hội thoại
  xp_awarded INT DEFAULT 0,
  study_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_study_logs_user_date 
  ON public.user_study_logs(user_id, study_date);

-- 4. ai_conversations: Phiên hội thoại AI Tutor
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id TEXT,
  title TEXT NOT NULL DEFAULT 'Hội thoại tiếng Trung',
  hsk_level TEXT DEFAULT 'HSK 1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ai_messages: Tin nhắn chi tiết trong phiên hội thoại AI
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
  hanzi TEXT NOT NULL,
  pinyin TEXT,
  meaning TEXT,
  grammar_analysis TEXT,
  correction TEXT,
  vocab_suggestions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conv 
  ON public.ai_messages(conversation_id, created_at ASC);

-- 6. user_saved_materials: Đánh dấu tài liệu yêu thích
CREATE TABLE IF NOT EXISTS public.user_saved_materials (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id TEXT NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_material UNIQUE (user_id, material_id)
);
