-- =========================================================================
-- HANZIGO — MIGRATION: CLOUD SRS SM-2 SYNC, WEAKNESS CAPTURE & HYBRID DICTIONARY
-- =========================================================================
-- Description:
-- 1. Creates public.user_srs_cards table with strict Zero-Trust RLS.
-- 2. Creates public.srs_review_logs table for audit trail & analytics.
-- 3. Creates search_dictionary RPC with multi-tier ranking (Exact Hanzi ->
--    Clean Pinyin -> Hanviet -> HSK level -> String length).
-- 4. Guarantees Zero-Trust security: auth.uid() isolation, no Security Definer leaks.
-- =========================================================================

-- 1. Enable pg_trgm Extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create user_srs_cards table
CREATE TABLE IF NOT EXISTS public.user_srs_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hanzi VARCHAR(100) NOT NULL,
    traditional VARCHAR(100),
    pinyin VARCHAR(150),
    hanviet VARCHAR(100),
    meaning_vi TEXT,
    meaning_en TEXT,
    hsk_level INT DEFAULT 1,
    repetition INT NOT NULL DEFAULT 0,
    interval_days INT NOT NULL DEFAULT 0,
    ease_factor NUMERIC(4, 2) NOT NULL DEFAULT 2.50,
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    lapse_count INT NOT NULL DEFAULT 0,
    source_context VARCHAR(50) NOT NULL DEFAULT 'lesson', -- 'lesson', 'smart_reader', 'quiz_mistake', 'writing_mistake', 'dictionary'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_hanzi UNIQUE (user_id, hanzi),
    CONSTRAINT chk_ease_factor_min CHECK (ease_factor >= 1.30)
);

-- Fast lookup indexes for due review cards & user sync
CREATE INDEX IF NOT EXISTS idx_user_srs_due 
    ON public.user_srs_cards (user_id, next_review_at ASC);

CREATE INDEX IF NOT EXISTS idx_user_srs_hanzi 
    ON public.user_srs_cards (user_id, hanzi);

CREATE INDEX IF NOT EXISTS idx_user_srs_updated 
    ON public.user_srs_cards (user_id, updated_at DESC);

-- 3. Create srs_review_logs table (Historical logs for review accuracy)
CREATE TABLE IF NOT EXISTS public.srs_review_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id UUID REFERENCES public.user_srs_cards(id) ON DELETE CASCADE,
    hanzi VARCHAR(100) NOT NULL,
    quality_rating INT NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
    prev_repetition INT DEFAULT 0,
    new_repetition INT DEFAULT 0,
    prev_interval_days INT DEFAULT 0,
    new_interval_days INT DEFAULT 0,
    prev_ease_factor NUMERIC(4, 2) DEFAULT 2.50,
    new_ease_factor NUMERIC(4, 2) DEFAULT 2.50,
    source_context VARCHAR(50) DEFAULT 'review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_srs_logs_user 
    ON public.srs_review_logs (user_id, created_at DESC);

-- 4. Configure Row Level Security (RLS) - Zero-Trust Isolation
ALTER TABLE public.user_srs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_review_logs ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can only select their own SRS cards" ON public.user_srs_cards;
DROP POLICY IF EXISTS "Users can only insert their own SRS cards" ON public.user_srs_cards;
DROP POLICY IF EXISTS "Users can only update their own SRS cards" ON public.user_srs_cards;
DROP POLICY IF EXISTS "Users can only delete their own SRS cards" ON public.user_srs_cards;

DROP POLICY IF EXISTS "Users can only select their own SRS review logs" ON public.srs_review_logs;
DROP POLICY IF EXISTS "Users can only insert their own SRS review logs" ON public.srs_review_logs;

-- Policies for user_srs_cards
CREATE POLICY "Users can only select their own SRS cards"
    ON public.user_srs_cards FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own SRS cards"
    ON public.user_srs_cards FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own SRS cards"
    ON public.user_srs_cards FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own SRS cards"
    ON public.user_srs_cards FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for srs_review_logs
CREATE POLICY "Users can only select their own SRS review logs"
    ON public.srs_review_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own SRS review logs"
    ON public.srs_review_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 5. RPC Function: search_dictionary
-- High-speed ranked search for CC-CEDICT & Educational Dictionary with Trigram Matching
CREATE OR REPLACE FUNCTION public.search_dictionary(
    search_query TEXT,
    result_limit INT DEFAULT 25
)
RETURNS TABLE (
    id BIGINT,
    simplified VARCHAR,
    traditional VARCHAR,
    pinyin_tone VARCHAR,
    pinyin_number VARCHAR,
    pinyin_clean VARCHAR,
    hanviet VARCHAR,
    pos VARCHAR,
    english_meanings TEXT,
    vietnamese_meaning TEXT,
    hsk_level VARCHAR,
    hsk_3_level VARCHAR,
    frequency_rank INT,
    match_score INT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    clean_q TEXT;
    escaped_q TEXT;
BEGIN
    clean_q := LOWER(TRIM(COALESCE(search_query, '')));
    IF clean_q = '' THEN
        RETURN;
    END IF;

    -- Escape SQL LIKE wildcards
    escaped_q := REPLACE(REPLACE(clean_q, '%', '\%'), '_', '\_');

    RETURN QUERY
    SELECT 
        d.id,
        d.simplified,
        d.traditional,
        d.pinyin_tone,
        d.pinyin_number,
        d.pinyin_clean,
        d.hanviet,
        d.pos,
        d.english_meanings,
        d.vietnamese_meaning,
        d.hsk_level,
        d.hsk_3_level,
        d.frequency_rank,
        (
            CASE 
                -- 1. Exact Hanzi (Simplified or Traditional)
                WHEN d.simplified = search_query OR d.traditional = search_query THEN 100
                -- 2. Exact Pinyin Clean (e.g. 'xuexi' -> 学习)
                WHEN LOWER(d.pinyin_clean) = clean_q THEN 90
                -- 3. Exact Hanviet (e.g. 'học tập')
                WHEN LOWER(COALESCE(d.hanviet, '')) = clean_q THEN 85
                -- 4. Prefix Hanzi match
                WHEN d.simplified LIKE escaped_q || '%' THEN 75
                -- 5. Exact Pinyin with tone
                WHEN LOWER(d.pinyin_tone) = clean_q THEN 70
                -- 6. Prefix Pinyin clean match
                WHEN d.pinyin_clean LIKE escaped_q || '%' THEN 60
                -- 7. Hanviet substring
                WHEN LOWER(COALESCE(d.hanviet, '')) LIKE '%' || escaped_q || '%' THEN 50
                -- 8. Vietnamese meaning substring
                WHEN LOWER(d.vietnamese_meaning) LIKE '%' || escaped_q || '%' THEN 40
                -- 9. English meaning substring
                WHEN LOWER(COALESCE(d.english_meanings, '')) LIKE '%' || escaped_q || '%' THEN 30
                -- 10. General substring
                ELSE 10
            END
        ) AS match_score
    FROM public.dictionary_entries d
    WHERE 
        d.simplified = search_query
        OR d.traditional = search_query
        OR LOWER(d.pinyin_clean) = clean_q
        OR LOWER(COALESCE(d.hanviet, '')) = clean_q
        OR d.simplified LIKE escaped_q || '%'
        OR d.pinyin_clean LIKE escaped_q || '%'
        OR LOWER(COALESCE(d.hanviet, '')) LIKE '%' || escaped_q || '%'
        OR LOWER(d.vietnamese_meaning) LIKE '%' || escaped_q || '%'
        OR LOWER(COALESCE(d.english_meanings, '')) LIKE '%' || escaped_q || '%'
    ORDER BY 
        match_score DESC,
        LENGTH(d.simplified) ASC,
        d.frequency_rank ASC
    LIMIT LEAST(result_limit, 100);
END;
$$;

-- Grant execute to authenticated and anon users for read-only dictionary search
GRANT EXECUTE ON FUNCTION public.search_dictionary(TEXT, INT) TO anon, authenticated;
