-- =========================================================================
-- HANZI GO - PUBLIC CDN AUDIO BUCKET FOR AZURE NEURAL TTS (hsk-audio)
-- =========================================================================
-- Public read-only CDN playback for browser HTMLAudioElement (zero serverless hop on HIT).
-- Only service_role (backend TTS gateway & admin pregen CLI) can write/update/delete.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hsk-audio',
  'hsk-audio',
  true,
  2097152,
  ARRAY['audio/mpeg']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "hsk_audio_public_select" ON storage.objects;
CREATE POLICY "hsk_audio_public_select"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'hsk-audio');

DROP POLICY IF EXISTS "hsk_audio_service_insert" ON storage.objects;
CREATE POLICY "hsk_audio_service_insert"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'hsk-audio');

DROP POLICY IF EXISTS "hsk_audio_service_update" ON storage.objects;
CREATE POLICY "hsk_audio_service_update"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'hsk-audio')
  WITH CHECK (bucket_id = 'hsk-audio');

DROP POLICY IF EXISTS "hsk_audio_service_delete" ON storage.objects;
CREATE POLICY "hsk_audio_service_delete"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'hsk-audio');
