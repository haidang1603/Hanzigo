-- =========================================================================
-- HANZIGO — MIGRATION: EDUCATIONAL DICTIONARY, TRIGRAM SEARCH & TTS CACHE
-- =========================================================================
-- Description:
-- 1. Enables pg_trgm for ultra-fast substring and fuzzy searches (ILIKE).
-- 2. Creates dictionary_entries table with 3 Pinyin fields (tone, number, clean)
--    and GIN Trigram indexes on simplified, traditional, pinyin, and vietnamese_meaning.
-- 3. Creates hanzi_decompositions table supporting Make Me A Hanzi IDS sequences.
-- 4. Creates audio_cache_logs table to secure and cache Azure Neural TTS.
-- =========================================================================

-- 1. Enable pg_trgm Extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create dictionary_entries table
CREATE TABLE IF NOT EXISTS public.dictionary_entries (
    id BIGSERIAL PRIMARY KEY,
    simplified VARCHAR(100) NOT NULL,
    traditional VARCHAR(100) NOT NULL,
    pinyin_tone VARCHAR(150) NOT NULL,
    pinyin_number VARCHAR(150),
    pinyin_clean VARCHAR(150) NOT NULL,
    hanviet VARCHAR(100),
    pos VARCHAR(50),
    english_meanings TEXT,
    vietnamese_meaning TEXT NOT NULL,
    hsk_level VARCHAR(20),
    hsk_3_level VARCHAR(20),
    frequency_rank INT DEFAULT 999999,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GIN Trigram Indexes for high-speed ILIKE substring searches
CREATE INDEX IF NOT EXISTS idx_dict_trgm_simp 
    ON public.dictionary_entries USING gin (simplified gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_trgm_trad 
    ON public.dictionary_entries USING gin (traditional gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_trgm_pinyin 
    ON public.dictionary_entries USING gin (pinyin_clean gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_trgm_viet 
    ON public.dictionary_entries USING gin (vietnamese_meaning gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_trgm_hanviet 
    ON public.dictionary_entries USING gin (hanviet gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_freq 
    ON public.dictionary_entries (frequency_rank ASC);

-- 3. Create hanzi_decompositions table (IDS sequences & components)
CREATE TABLE IF NOT EXISTS public.hanzi_decompositions (
    char VARCHAR(4) PRIMARY KEY,
    unicode_hex VARCHAR(10) NOT NULL,
    ids_sequence VARCHAR(30) NOT NULL,
    structure_type VARCHAR(30) NOT NULL,
    structure_symbol VARCHAR(4) NOT NULL,
    components JSONB NOT NULL DEFAULT '[]'::jsonb,
    etymology_hint TEXT,
    hsk_level VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decomp_char 
    ON public.hanzi_decompositions (char);

-- 4. Create audio_cache_logs table (Azure TTS proxy protection)
CREATE TABLE IF NOT EXISTS public.audio_cache_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256(voice + "_" + text.trim())
    text_content VARCHAR(255) NOT NULL,
    voice_name VARCHAR(50) NOT NULL,
    storage_path TEXT NOT NULL,
    duration_ms INT DEFAULT 0,
    hit_count BIGINT DEFAULT 1,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audio_hash 
    ON public.audio_cache_logs (hash);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.dictionary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hanzi_decompositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_cache_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to dictionary and decompositions
CREATE POLICY "Allow public read on dictionary_entries" 
    ON public.dictionary_entries FOR SELECT USING (true);

CREATE POLICY "Allow public read on hanzi_decompositions" 
    ON public.hanzi_decompositions FOR SELECT USING (true);

CREATE POLICY "Allow public read on audio_cache_logs" 
    ON public.audio_cache_logs FOR SELECT USING (true);
