-- ============================================================================
-- Migration 39: Supabase Storage Bucket & TTS Audio Cache Registry
-- Task 32.01: Permanent Chinese TTS pronunciation cache on Supabase Storage
-- PostgreSQL 15+ | Idempotent
-- ============================================================================

-- 1. STORAGE BUCKET: 'tts-audio-cache'
-- Public read bucket (max 5MB per file, audio/mpeg, audio/mp3, audio/wav)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tts-audio-cache',
  'tts-audio-cache',
  true,
  5242880, -- 5MB (5 * 1024 * 1024 bytes)
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. STORAGE RLS POLICIES ON storage.objects FOR 'tts-audio-cache'
DROP POLICY IF EXISTS "tts_audio_cache_public_select" ON storage.objects;
CREATE POLICY "tts_audio_cache_public_select"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'tts-audio-cache');

DROP POLICY IF EXISTS "tts_audio_cache_service_role_insert" ON storage.objects;
CREATE POLICY "tts_audio_cache_service_role_insert"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'tts-audio-cache');

DROP POLICY IF EXISTS "tts_audio_cache_service_role_update" ON storage.objects;
CREATE POLICY "tts_audio_cache_service_role_update"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'tts-audio-cache')
  WITH CHECK (bucket_id = 'tts-audio-cache');

DROP POLICY IF EXISTS "tts_audio_cache_service_role_delete" ON storage.objects;
CREATE POLICY "tts_audio_cache_service_role_delete"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'tts-audio-cache');

-- 3. METADATA REGISTRY TABLE: public.tts_audio_cache_registry
CREATE TABLE IF NOT EXISTS public.tts_audio_cache_registry (
  cache_key CHAR(64) PRIMARY KEY,
  text_zh TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  speed_rate NUMERIC(3,2) NOT NULL DEFAULT 1.00,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  byte_size INT NOT NULL DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'azure_neural',
  hit_count BIGINT NOT NULL DEFAULT 1,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_tts_audio_cache_key_sha256 CHECK (char_length(trim(cache_key)) = 64),
  CONSTRAINT chk_tts_audio_cache_speed_rate CHECK (speed_rate > 0 AND speed_rate <= 4.00),
  CONSTRAINT chk_tts_audio_cache_byte_size CHECK (byte_size >= 0),
  CONSTRAINT chk_tts_audio_cache_hit_count CHECK (hit_count >= 0)
);

-- Indexes for fast lookup and analytics
CREATE INDEX IF NOT EXISTS idx_tts_audio_cache_text_zh
  ON public.tts_audio_cache_registry (text_zh);

CREATE INDEX IF NOT EXISTS idx_tts_audio_cache_voice_speed
  ON public.tts_audio_cache_registry (voice_id, speed_rate);

CREATE INDEX IF NOT EXISTS idx_tts_audio_cache_popularity
  ON public.tts_audio_cache_registry (hit_count DESC, last_accessed_at DESC);

-- Enable RLS on registry table
ALTER TABLE public.tts_audio_cache_registry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tts_registry_public_select" ON public.tts_audio_cache_registry;
CREATE POLICY "tts_registry_public_select"
  ON public.tts_audio_cache_registry
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "tts_registry_service_role_all" ON public.tts_audio_cache_registry;
CREATE POLICY "tts_registry_service_role_all"
  ON public.tts_audio_cache_registry
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. RPC: public.increment_tts_cache_hit(p_cache_key CHAR(64))
CREATE OR REPLACE FUNCTION public.increment_tts_cache_hit(p_cache_key CHAR(64))
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_hit_count BIGINT;
BEGIN
  UPDATE public.tts_audio_cache_registry
  SET
    hit_count = hit_count + 1,
    last_accessed_at = NOW()
  WHERE cache_key = p_cache_key
  RETURNING hit_count INTO v_new_hit_count;

  RETURN COALESCE(v_new_hit_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_tts_cache_hit(CHAR(64)) TO anon, authenticated, service_role;

