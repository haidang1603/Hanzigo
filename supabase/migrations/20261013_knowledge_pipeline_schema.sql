-- =========================================================================
-- HANZIGO - PHASE 01: KNOWLEDGE DATASET PIPELINE & RAG SCHEMA
-- =========================================================================
-- Quản lý nguồn tri thức, phân tách đoạn kiến thức (chunks), kiểm duyệt
-- giấy phép bản quyền, nhật ký audit log và phân tách môi trường kiểm duyệt.
-- =========================================================================

-- 1. Bảng Nguồn Tri Thức Mẹ (rag_knowledge_sources)
CREATE TABLE IF NOT EXISTS public.rag_knowledge_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dictionary', 'grammar', 'curriculum', 'hsk_standard', 'dialogue', 'academic_paper')),
  hsk_level TEXT DEFAULT 'All',
  author TEXT,
  publisher TEXT,
  source_url TEXT,
  license_identifier TEXT NOT NULL,
  attribution TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  retrieval_date TIMESTAMPTZ DEFAULT NOW(),
  checksum TEXT,
  review_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (review_status IN ('curated_verified', 'pending_review', 'rejected')),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  record_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Đoạn Tri Thức Chi Tiết (rag_knowledge_chunks)
CREATE TABLE IF NOT EXISTS public.rag_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES public.rag_knowledge_sources(id) ON DELETE CASCADE,
  chunk_key TEXT UNIQUE NOT NULL, -- SHA-256 hash đảm bảo Idempotency (không trùng lặp khi import lại)
  chunk_type TEXT NOT NULL CHECK (chunk_type IN ('vocab_entry', 'grammar_pattern', 'example_sentence', 'dialogue_context', 'culture_note')),
  hsk_level TEXT DEFAULT 'HSK 1',
  topic TEXT,
  simplified TEXT NOT NULL,
  traditional TEXT,
  pinyin TEXT,
  pinyin_numbered TEXT,
  vietnamese_meaning TEXT NOT NULL,
  pedagogical_notes TEXT,
  grammar_pattern TEXT,
  example_sentences JSONB DEFAULT '[]'::jsonb,
  license_identifier TEXT NOT NULL,
  attribution TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (review_status IN ('curated_verified', 'pending_review', 'rejected')),
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Nhật Ký Kiểm Toán Nhập Dữ Liệu (rag_ingestion_audit_logs)
CREATE TABLE IF NOT EXISTS public.rag_ingestion_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id TEXT NOT NULL,
  source_key TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('dry_run', 'import', 'rollback', 'deduplicate')),
  total_records INT DEFAULT 0,
  imported_records INT DEFAULT 0,
  updated_records INT DEFAULT 0,
  skipped_duplicates INT DEFAULT 0,
  invalid_records INT DEFAULT 0,
  checksum TEXT,
  error_details JSONB DEFAULT '[]'::jsonb,
  executed_by TEXT DEFAULT 'system_importer',
  duration_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục tối ưu tìm kiếm và đối soát
CREATE INDEX IF NOT EXISTS idx_rag_chunks_source ON public.rag_knowledge_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_type_hsk ON public.rag_knowledge_chunks(chunk_type, hsk_level);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_simplified ON public.rag_knowledge_chunks(simplified);
CREATE INDEX IF NOT EXISTS idx_rag_sources_key ON public.rag_knowledge_sources(source_key);
CREATE INDEX IF NOT EXISTS idx_rag_audit_batch ON public.rag_ingestion_audit_logs(batch_id);

-- RLS Policies
ALTER TABLE public.rag_knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_ingestion_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. rag_knowledge_sources: Học viên và Giáo viên chỉ đọc dữ liệu đã duyệt, Admin toàn quyền
DROP POLICY IF EXISTS "rag_sources_read_verified" ON public.rag_knowledge_sources;
CREATE POLICY "rag_sources_read_verified" ON public.rag_knowledge_sources
  FOR SELECT USING ((is_verified = true AND review_status = 'curated_verified' AND is_active = true) OR public.is_admin());

DROP POLICY IF EXISTS "rag_sources_admin_all" ON public.rag_knowledge_sources;
CREATE POLICY "rag_sources_admin_all" ON public.rag_knowledge_sources
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2. rag_knowledge_chunks: Tách biệt tri thức đã duyệt khỏi dữ liệu nháp
DROP POLICY IF EXISTS "rag_chunks_read_verified" ON public.rag_knowledge_chunks;
CREATE POLICY "rag_chunks_read_verified" ON public.rag_knowledge_chunks
  FOR SELECT USING ((is_verified = true AND review_status = 'curated_verified') OR public.is_admin());

DROP POLICY IF EXISTS "rag_chunks_admin_all" ON public.rag_knowledge_chunks;
CREATE POLICY "rag_chunks_admin_all" ON public.rag_knowledge_chunks
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. rag_ingestion_audit_logs: Chỉ Admin được xem lịch sử kiểm toán nhập
DROP POLICY IF EXISTS "rag_audit_admin_all" ON public.rag_ingestion_audit_logs;
CREATE POLICY "rag_audit_admin_all" ON public.rag_ingestion_audit_logs
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
