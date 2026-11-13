-- =========================================================================
-- TASK 27.04: CHINESE READING STUDIO (ARTICLES & READING SESSIONS)
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Pre-tokenized & Custom Reading Articles
CREATE TABLE IF NOT EXISTS public.reading_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh TEXT NOT NULL,
  title_vi TEXT NOT NULL DEFAULT '',
  hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 9),
  topic TEXT NOT NULL DEFAULT 'Tổng hợp',
  word_count INT NOT NULL DEFAULT 0 CHECK (word_count >= 0),
  estimated_minutes SMALLINT NOT NULL DEFAULT 3 CHECK (estimated_minutes > 0),
  paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  comprehension_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_user_custom BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_articles_hsk_topic
  ON public.reading_articles (hsk_level, topic, is_user_custom);

-- 2. User Reading Sessions & Coverage Analytics
CREATE TABLE IF NOT EXISTS public.user_reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.reading_articles(id) ON DELETE CASCADE,
  known_words_percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (known_words_percentage >= 0 AND known_words_percentage <= 100),
  saved_vocab_count SMALLINT NOT NULL DEFAULT 0 CHECK (saved_vocab_count >= 0),
  quiz_score SMALLINT NOT NULL DEFAULT 0 CHECK (quiz_score >= 0 AND quiz_score <= 100),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_reading_sessions_user
  ON public.user_reading_sessions (user_id, completed_at DESC);

-- 3. Row-Level Security
ALTER TABLE public.reading_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read system articles and own custom articles" ON public.reading_articles;
CREATE POLICY "Public read system articles and own custom articles"
  ON public.reading_articles
  FOR SELECT
  USING (is_user_custom = false OR auth.uid() = created_by);

DROP POLICY IF EXISTS "Users manage own custom reading articles" ON public.reading_articles;
CREATE POLICY "Users manage own custom reading articles"
  ON public.reading_articles
  FOR ALL
  TO authenticated
  USING (is_user_custom = true AND auth.uid() = created_by)
  WITH CHECK (is_user_custom = true AND auth.uid() = created_by);

DROP POLICY IF EXISTS "Users manage own reading sessions" ON public.user_reading_sessions;
CREATE POLICY "Users manage own reading sessions"
  ON public.user_reading_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

