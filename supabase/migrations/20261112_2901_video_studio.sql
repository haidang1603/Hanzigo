-- Task 29.01: Dual-Sub Interactive Video Studio Schema
CREATE TABLE IF NOT EXISTS public.immersion_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL CHECK (source_type IN ('youtube', 'mp4_storage')),
  external_video_id TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  channel_name TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  duration_seconds INT NOT NULL DEFAULT 60,
  hsk_level SMALLINT NOT NULL DEFAULT 3 CHECK (hsk_level BETWEEN 1 AND 9),
  topic_tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  speech_speed TEXT NOT NULL DEFAULT 'normal' CHECK (speech_speed IN ('slow', 'normal', 'fast')),
  subtitles JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_video_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.immersion_videos(id) ON DELETE CASCADE,
  last_position_ms INT NOT NULL DEFAULT 0,
  saved_cues_indices INT[] NOT NULL DEFAULT '{}'::int[],
  shadowed_cues_indices INT[] NOT NULL DEFAULT '{}'::int[],
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_immersion_videos_level_speed
  ON public.immersion_videos (hsk_level, speech_speed);

CREATE INDEX IF NOT EXISTS idx_user_video_progress_user
  ON public.user_video_progress (user_id, updated_at DESC);

ALTER TABLE public.immersion_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_video_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "immersion_videos_read_all" ON public.immersion_videos;
CREATE POLICY "immersion_videos_read_all"
  ON public.immersion_videos
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "user_video_progress_own" ON public.user_video_progress;
CREATE POLICY "user_video_progress_own"
  ON public.user_video_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

