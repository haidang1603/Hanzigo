-- Task 27.05: Chinese Listening Studio Schema
CREATE TABLE IF NOT EXISTS public.listening_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  hsk_level SMALLINT NOT NULL DEFAULT 2 CHECK (hsk_level BETWEEN 1 AND 9),
  category TEXT NOT NULL DEFAULT 'dialogue' CHECK (category IN ('dialogue', 'podcast', 'news', 'hsk_mock')),
  audio_url TEXT NOT NULL DEFAULT '',
  duration_seconds INT NOT NULL DEFAULT 60,
  speech_rate_wpm SMALLINT NOT NULL DEFAULT 130,
  transcript_segments JSONB NOT NULL DEFAULT '[]'::jsonb,
  listening_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_listening_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.listening_tracks(id) ON DELETE CASCADE,
  dictation_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  completed_segments INT[] NOT NULL DEFAULT '{}'::int[],
  quiz_score SMALLINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, track_id)
);

CREATE INDEX IF NOT EXISTS idx_listening_tracks_hsk_category
  ON public.listening_tracks (hsk_level, category);

CREATE INDEX IF NOT EXISTS idx_user_listening_logs_user
  ON public.user_listening_logs (user_id, updated_at DESC);

ALTER TABLE public.listening_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_listening_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listening_tracks_read_all" ON public.listening_tracks;
CREATE POLICY "listening_tracks_read_all"
  ON public.listening_tracks
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "user_listening_logs_select_own" ON public.user_listening_logs;
CREATE POLICY "user_listening_logs_select_own"
  ON public.user_listening_logs
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_listening_logs_upsert_own" ON public.user_listening_logs;
CREATE POLICY "user_listening_logs_upsert_own"
  ON public.user_listening_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

