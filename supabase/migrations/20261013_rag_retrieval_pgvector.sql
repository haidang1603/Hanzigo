-- =========================================================================
-- HANZIGO - PHASE 02: SECURE RAG RETRIEVAL (PGVECTOR & HYBRID SEARCH)
-- =========================================================================
-- 1. Bật extension pgvector
-- 2. Bổ sung cột embedding (768 chiều), model identifier, dimension và tsvector
-- 3. Tạo chỉ mục HNSW vector index và GIN full-text search index
-- 4. Tạo hàm RPC tìm kiếm lai (Hybrid Search) kết hợp Cosine + BM25/tsvector
-- =========================================================================

-- 1. Kích hoạt pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Mở rộng rag_knowledge_chunks
ALTER TABLE public.rag_knowledge_chunks
ADD COLUMN IF NOT EXISTS embedding vector(768),
ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'gemini-text-embedding-004',
ADD COLUMN IF NOT EXISTS embedding_dimension INT DEFAULT 768,
ADD COLUMN IF NOT EXISTS search_tokens tsvector GENERATED ALWAYS AS (
  to_tsvector('simple', 
    coalesce(simplified, '') || ' ' || 
    coalesce(traditional, '') || ' ' || 
    coalesce(pinyin, '') || ' ' || 
    coalesce(vietnamese_meaning, '') || ' ' || 
    coalesce(pedagogical_notes, '') || ' ' || 
    coalesce(grammar_pattern, '')
  )
) STORED;

-- 3. Chỉ mục tối ưu Vector & Toàn văn
CREATE INDEX IF NOT EXISTS idx_rag_chunks_embedding_hnsw 
ON public.rag_knowledge_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_rag_chunks_search_tokens 
ON public.rag_knowledge_chunks 
USING gin (search_tokens);

-- 4. Hàm RPC Tìm Kiếm Lai Bảo Mật (Hybrid Search Function)
CREATE OR REPLACE FUNCTION public.match_rag_knowledge (
  query_embedding vector(768) DEFAULT NULL,
  query_text text DEFAULT '',
  match_threshold float DEFAULT 0.45,
  match_count int DEFAULT 5,
  filter_hsk text DEFAULT NULL,
  filter_type text DEFAULT NULL
)
RETURNS TABLE (
  chunk_id UUID,
  source_id UUID,
  source_title TEXT,
  source_url TEXT,
  license_identifier TEXT,
  attribution TEXT,
  chunk_type TEXT,
  hsk_level TEXT,
  topic TEXT,
  simplified TEXT,
  traditional TEXT,
  pinyin TEXT,
  vietnamese_meaning TEXT,
  pedagogical_notes TEXT,
  grammar_pattern TEXT,
  example_sentences JSONB,
  similarity_score float,
  lexical_score float,
  hybrid_score float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_query text := trim(coalesce(query_text, ''));
  has_vector boolean := query_embedding IS NOT NULL;
  has_text boolean := length(clean_query) > 0;
  ts_q tsquery := CASE WHEN has_text THEN plainto_tsquery('simple', clean_query) ELSE NULL END;
BEGIN
  RETURN QUERY
  WITH scored_candidates AS (
    SELECT
      c.id AS c_chunk_id,
      s.id AS c_source_id,
      s.title AS c_source_title,
      s.source_url AS c_source_url,
      c.license_identifier AS c_license,
      c.attribution AS c_attribution,
      c.chunk_type AS c_chunk_type,
      c.hsk_level AS c_hsk_level,
      c.topic AS c_topic,
      c.simplified AS c_simplified,
      c.traditional AS c_traditional,
      c.pinyin AS c_pinyin,
      c.vietnamese_meaning AS c_vietnamese_meaning,
      c.pedagogical_notes AS c_pedagogical_notes,
      c.grammar_pattern AS c_grammar_pattern,
      c.example_sentences AS c_example_sentences,
      -- Điểm tương đồng Vector Cosine (0.0 - 1.0)
      CASE 
        WHEN has_vector AND c.embedding IS NOT NULL THEN (1.0 - (c.embedding <=> query_embedding))
        ELSE 0.0 
      END AS c_sim_score,
      -- Điểm khớp từ khóa Full-Text Rank (chuẩn hóa 0.0 - 1.0)
      CASE 
        WHEN has_text AND ts_q IS NOT NULL THEN LEAST(ts_rank_cd(c.search_tokens, ts_q) * 2.0, 1.0)
        ELSE 0.0 
      END AS c_lex_score
    FROM public.rag_knowledge_chunks c
    JOIN public.rag_knowledge_sources s ON s.id = c.source_id
    WHERE s.is_verified = true 
      AND s.review_status = 'curated_verified'
      AND s.is_active = true
      AND c.is_verified = true
      AND c.review_status = 'curated_verified'
      AND (filter_hsk IS NULL OR c.hsk_level = filter_hsk OR c.hsk_level = 'All')
      AND (filter_type IS NULL OR c.chunk_type = filter_type)
  ),
  hybrid_scored AS (
    SELECT
      sc.*,
      -- Trọng số kết hợp: 65% Vector Semantics + 35% Exact Lexical Match
      CASE
        WHEN has_vector AND has_text THEN (sc.c_sim_score * 0.65 + sc.c_lex_score * 0.35)
        WHEN has_vector THEN sc.c_sim_score
        ELSE sc.c_lex_score
      END AS c_hybrid_score
    FROM scored_candidates sc
  )
  SELECT
    hs.c_chunk_id,
    hs.c_source_id,
    hs.c_source_title,
    hs.c_source_url,
    hs.c_license,
    hs.c_attribution,
    hs.c_chunk_type,
    hs.c_hsk_level,
    hs.c_topic,
    hs.c_simplified,
    hs.c_traditional,
    hs.c_pinyin,
    hs.c_vietnamese_meaning,
    hs.c_pedagogical_notes,
    hs.c_grammar_pattern,
    hs.c_example_sentences,
    hs.c_sim_score::float,
    hs.c_lex_score::float,
    hs.c_hybrid_score::float
  FROM hybrid_scored hs
  -- Cổng chặn chứng cứ không đủ (Threshold Gate)
  WHERE hs.c_hybrid_score >= match_threshold
  ORDER BY hs.c_hybrid_score DESC
  LIMIT match_count;
END;
$$;
