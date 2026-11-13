-- =========================================================================
-- TASK 27.03: HANZI WRITING STUDIO (LOGS & CHARACTER MASTERY)
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Granular per-attempt writing logs
CREATE TABLE IF NOT EXISTS public.hanzi_writing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character CHAR(1) NOT NULL,
  source_vocab_id UUID DEFAULT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('guided', 'recall', 'dictation')),
  total_strokes SMALLINT NOT NULL CHECK (total_strokes > 0),
  mistake_count SMALLINT NOT NULL DEFAULT 0 CHECK (mistake_count >= 0),
  mistaken_stroke_indices INT[] NOT NULL DEFAULT '{}'::INT[],
  accuracy_score NUMERIC(5,2) NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  duration_ms INT NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hanzi_writing_logs_character
  ON public.hanzi_writing_logs (character);

CREATE INDEX IF NOT EXISTS idx_hanzi_writing_logs_user_recent
  ON public.hanzi_writing_logs (user_id, created_at DESC);

-- 2. Aggregated per-character mastery & problematic stroke breakdown
CREATE TABLE IF NOT EXISTS public.hanzi_character_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character CHAR(1) NOT NULL,
  total_attempts INT NOT NULL DEFAULT 0 CHECK (total_attempts >= 0),
  avg_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (avg_accuracy >= 0 AND avg_accuracy <= 100),
  problematic_strokes JSONB NOT NULL DEFAULT '{}'::jsonb,
  mastery_tier TEXT NOT NULL DEFAULT 'novice' CHECK (mastery_tier IN ('novice', 'practicing', 'proficient', 'calligrapher')),
  last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hanzi_character_mastery UNIQUE (user_id, character)
);

CREATE INDEX IF NOT EXISTS idx_hanzi_character_mastery_user_tier
  ON public.hanzi_character_mastery (user_id, mastery_tier, avg_accuracy ASC);

-- 3. Row-Level Security
ALTER TABLE public.hanzi_writing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hanzi_character_mastery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own hanzi writing logs" ON public.hanzi_writing_logs;
CREATE POLICY "Users manage own hanzi writing logs"
  ON public.hanzi_writing_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own hanzi character mastery" ON public.hanzi_character_mastery;
CREATE POLICY "Users manage own hanzi character mastery"
  ON public.hanzi_character_mastery
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

