-- Task 27.07: Chinese Pronunciation Lab Schema
CREATE TABLE IF NOT EXISTS public.pronunciation_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (
    category IN ('initials_finals', 'tone_pairs', 'tone_sandhi', 'minimal_pairs', 'sentence_shadowing')
  ),
  hsk_level SMALLINT NOT NULL DEFAULT 1 CHECK (hsk_level BETWEEN 1 AND 9),
  hanzi TEXT NOT NULL,
  pinyin_underlying TEXT NOT NULL,
  pinyin_surface TEXT NOT NULL,
  meaning_vi TEXT NOT NULL DEFAULT '',
  phonetic_focus TEXT NOT NULL DEFAULT '',
  articulation_tip_vi TEXT NOT NULL DEFAULT '',
  reference_pitch_contour JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_pronunciation_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drill_id UUID NULL REFERENCES public.pronunciation_drills(id) ON DELETE SET NULL,
  target_text TEXT NOT NULL,
  overall_score SMALLINT NOT NULL DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
  initial_final_score SMALLINT NOT NULL DEFAULT 0 CHECK (initial_final_score BETWEEN 0 AND 100),
  tone_score SMALLINT NOT NULL DEFAULT 0 CHECK (tone_score BETWEEN 0 AND 100),
  fluency_score SMALLINT NOT NULL DEFAULT 0 CHECK (fluency_score BETWEEN 0 AND 100),
  syllable_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pronunciation_drills_category_hsk
  ON public.pronunciation_drills (category, hsk_level);

CREATE INDEX IF NOT EXISTS idx_user_pronunciation_attempts_user
  ON public.user_pronunciation_attempts (user_id, created_at DESC);

ALTER TABLE public.pronunciation_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pronunciation_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pronunciation_drills_read_all" ON public.pronunciation_drills;
CREATE POLICY "pronunciation_drills_read_all"
  ON public.pronunciation_drills
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "user_pronunciation_attempts_own" ON public.user_pronunciation_attempts;
CREATE POLICY "user_pronunciation_attempts_own"
  ON public.user_pronunciation_attempts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

