-- =========================================================================
-- MIGRATION: 20261112_2902_ocr_scanner.sql
-- OCR FLASH LOOKUP & TEXTBOOK SCANNER (TASK 29.02)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.ocr_scan_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_width INT NOT NULL DEFAULT 800,
  image_height INT NOT NULL DEFAULT 600,
  ocr_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  extracted_full_text TEXT NOT NULL DEFAULT '',
  converted_article_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning-fast user document retrieval and block searches
CREATE INDEX IF NOT EXISTS idx_ocr_docs_user_id ON public.ocr_scan_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_ocr_docs_created ON public.ocr_scan_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ocr_docs_blocks_gin ON public.ocr_scan_documents USING gin(ocr_blocks);

-- Enable Row Level Security
ALTER TABLE public.ocr_scan_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own OCR documents or public samples" ON public.ocr_scan_documents;
CREATE POLICY "Users can view own OCR documents or public samples"
  ON public.ocr_scan_documents
  FOR SELECT
  USING (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Users can create OCR documents" ON public.ocr_scan_documents;
CREATE POLICY "Users can create OCR documents"
  ON public.ocr_scan_documents
  FOR INSERT
  WITH CHECK (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Users can update own OCR documents" ON public.ocr_scan_documents;
CREATE POLICY "Users can update own OCR documents"
  ON public.ocr_scan_documents
  FOR UPDATE
  USING (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  )
  WITH CHECK (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Users can delete own OCR documents" ON public.ocr_scan_documents;
CREATE POLICY "Users can delete own OCR documents"
  ON public.ocr_scan_documents
  FOR DELETE
  USING (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

