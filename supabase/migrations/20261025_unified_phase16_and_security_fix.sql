-- =========================================================================
-- HANZIGO — TỔNG HỢP TOÀN DIỆN: MỞ RỘNG TỪ ĐIỂN 120.000 TỪ & SỬA LỖI RLS
-- =========================================================================
-- Tệp này tổng hợp đầy đủ:
-- 1. Hàm kiểm tra quyền Admin an toàn public.is_admin().
-- 2. Mở rộng bảng public.dictionary_entries (Phase 16).
-- 3. Khử trùng lặp và tạo Unique Composite Index chống duplicate.
-- 4. RPC phân trang tìm kiếm hiệu năng cao search_dictionary_paginated.
-- 5. Cấu hình RLS an toàn cho public.dictionary_entries (sửa cảnh báo linter).
-- 6. Cấu hình RLS an toàn cho public.issued_certificates (sửa cảnh báo linter).
--
-- Hướng dẫn: Mở Supabase SQL Editor, dán toàn bộ nội dung file này và bấm Run.
-- =========================================================================

-- -------------------------------------------------------------------------
-- PHẦN 1: ĐẢM BẢO HÀM KIỂM TRA ADMIN AN TOÀN (ZERO-TRUST)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- -------------------------------------------------------------------------
-- PHẦN 2: MỞ RỘNG BẢNG DICTIONARY_ENTRIES CHO 120.000 TỪ (PHASE 16)
-- -------------------------------------------------------------------------
ALTER TABLE public.dictionary_entries 
    ADD COLUMN IF NOT EXISTS definitions JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS examples JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS source_id VARCHAR(50) DEFAULT 'cc_cedict',
    ADD COLUMN IF NOT EXISTS source_license VARCHAR(100) DEFAULT 'CC BY-SA 4.0',
    ADD COLUMN IF NOT EXISTS quality_status VARCHAR(30) DEFAULT 'community_standard';

-- Khử trùng lặp các dòng lịch sử (giữ lại bản ghi có id nhỏ nhất)
DELETE FROM public.dictionary_entries a
USING public.dictionary_entries b
WHERE a.id > b.id
  AND a.traditional = b.traditional
  AND a.simplified = b.simplified
  AND a.pinyin_number = b.pinyin_number;

-- Tạo Unique Composite Index chống trùng lặp đa âm
CREATE UNIQUE INDEX IF NOT EXISTS idx_dict_unique_entry 
    ON public.dictionary_entries (traditional, simplified, pinyin_number);

-- Index tối ưu hóa lọc theo cấp độ HSK và chất lượng
CREATE INDEX IF NOT EXISTS idx_dict_hsk_level 
    ON public.dictionary_entries (hsk_level);

CREATE INDEX IF NOT EXISTS idx_dict_quality_status 
    ON public.dictionary_entries (quality_status);

-- -------------------------------------------------------------------------
-- PHẦN 3: RPC TÌM KIẾM PHÂN TRANG SERVER-SIDE (HIGH-PERFORMANCE)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_dictionary_paginated(
    p_query TEXT DEFAULT '',
    p_hsk TEXT DEFAULT 'ALL',
    p_page INT DEFAULT 1,
    p_page_size INT DEFAULT 25
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
    definitions JSONB,
    examples JSONB,
    hsk_level VARCHAR,
    frequency_rank INT,
    source_id VARCHAR,
    source_license VARCHAR,
    quality_status VARCHAR,
    match_score INT,
    total_count BIGINT
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    clean_q TEXT := LOWER(TRIM(p_query));
    escaped_q TEXT := regexp_replace(clean_q, '([%_\\])', '\\\1', 'g');
    offset_val INT := GREATEST(0, (p_page - 1) * p_page_size);
    limit_val INT := LEAST(100, GREATEST(1, p_page_size));
BEGIN
    RETURN QUERY
    WITH filtered_entries AS (
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
            d.definitions,
            d.examples,
            d.hsk_level,
            d.frequency_rank,
            d.source_id,
            d.source_license,
            d.quality_status,
            (
                CASE 
                    -- Khớp chính xác chữ Hán (Giản thể / Phồn thể)
                    WHEN clean_q <> '' AND (d.simplified = p_query OR d.traditional = p_query) THEN 100
                    -- Khớp chính xác Pinyin sạch
                    WHEN clean_q <> '' AND LOWER(d.pinyin_clean) = clean_q THEN 90
                    -- Khớp chính xác Hán-Việt
                    WHEN clean_q <> '' AND LOWER(COALESCE(d.hanviet, '')) = clean_q THEN 85
                    -- Khớp tiền tố Chữ Hán
                    WHEN clean_q <> '' AND d.simplified LIKE escaped_q || '%' THEN 75
                    -- Khớp Pinyin có thanh
                    WHEN clean_q <> '' AND LOWER(d.pinyin_tone) = clean_q THEN 70
                    -- Khớp tiền tố Pinyin
                    WHEN clean_q <> '' AND d.pinyin_clean LIKE escaped_q || '%' THEN 60
                    -- Khớp nghĩa tiếng Việt
                    WHEN clean_q <> '' AND LOWER(COALESCE(d.vietnamese_meaning, '')) LIKE '%' || escaped_q || '%' THEN 50
                    -- Khớp nghĩa tiếng Anh
                    WHEN clean_q <> '' AND LOWER(COALESCE(d.english_meanings, '')) LIKE '%' || escaped_q || '%' THEN 40
                    -- Mặc định
                    ELSE 10
                END
            ) AS score
        FROM public.dictionary_entries d
        WHERE 
            (
                p_hsk = 'ALL' 
                OR d.hsk_level = p_hsk
                OR (p_hsk = 'HSK 5-6' AND d.hsk_level IN ('HSK 5', 'HSK 6', 'HSK 5-6'))
            )
            AND (
                clean_q = ''
                OR d.simplified = p_query
                OR d.traditional = p_query
                OR LOWER(d.pinyin_clean) = clean_q
                OR LOWER(COALESCE(d.hanviet, '')) = clean_q
                OR d.simplified LIKE escaped_q || '%'
                OR d.pinyin_clean LIKE escaped_q || '%'
                OR LOWER(COALESCE(d.vietnamese_meaning, '')) LIKE '%' || escaped_q || '%'
                OR LOWER(COALESCE(d.english_meanings, '')) LIKE '%' || escaped_q || '%'
            )
    ),
    counted AS (
        SELECT COUNT(*) AS total FROM filtered_entries
    )
    SELECT 
        f.id,
        f.simplified,
        f.traditional,
        f.pinyin_tone,
        f.pinyin_number,
        f.pinyin_clean,
        f.hanviet,
        f.pos,
        f.english_meanings,
        f.vietnamese_meaning,
        f.definitions,
        f.examples,
        f.hsk_level,
        f.frequency_rank,
        f.source_id,
        f.source_license,
        f.quality_status,
        f.score AS match_score,
        c.total AS total_count
    FROM filtered_entries f
    CROSS JOIN counted c
    ORDER BY 
        f.score DESC,
        LENGTH(f.simplified) ASC,
        f.frequency_rank ASC,
        f.id ASC
    OFFSET offset_val
    LIMIT limit_val;
END;
$$;

-- Cấp quyền gọi RPC cho tất cả người dùng (khách và học viên)
GRANT EXECUTE ON FUNCTION public.search_dictionary_paginated(TEXT, TEXT, INT, INT) TO anon, authenticated;

-- -------------------------------------------------------------------------
-- PHẦN 4: BẢO VỆ RLS BẢNG TỪ ĐIỂN (PUBLIC.DICTIONARY_ENTRIES)
-- -------------------------------------------------------------------------
ALTER TABLE public.dictionary_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read dictionary_entries" ON public.dictionary_entries;
DROP POLICY IF EXISTS "Allow public read on dictionary_entries" ON public.dictionary_entries;
DROP POLICY IF EXISTS "Admin and service role can modify dictionary" ON public.dictionary_entries;

-- 1. Cho phép đọc công khai (SELECT read-only)
CREATE POLICY "Allow public read on dictionary_entries" 
    ON public.dictionary_entries 
    FOR SELECT 
    USING (true);

-- 2. Chỉ Admin mới được quyền sửa/xóa; service_role tự động bypass RLS
CREATE POLICY "Admin and service role can modify dictionary"
    ON public.dictionary_entries
    FOR ALL
    TO authenticated
    USING (
        public.is_admin()
    );

-- -------------------------------------------------------------------------
-- PHẦN 5: BẢO VỆ RLS BẢNG CHỨNG NHẬN (PUBLIC.ISSUED_CERTIFICATES)
-- (Sửa triệt để toàn bộ cảnh báo user_metadata linter)
-- -------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'issued_certificates'
    ) THEN
        ALTER TABLE public.issued_certificates ENABLE ROW LEVEL SECURITY;

        -- 5.1. Xem chứng chỉ: Học viên chỉ xem của mình, hoặc Admin
        DROP POLICY IF EXISTS "Users can only view their own certificates" ON public.issued_certificates;
        CREATE POLICY "Users can only view their own certificates"
            ON public.issued_certificates
            FOR SELECT
            TO authenticated
            USING (
                auth.uid() = user_id
                OR public.is_admin()
            );

        -- 5.2. Thêm chứng chỉ: Học viên lưu chứng chỉ của mình, hoặc Admin
        DROP POLICY IF EXISTS "Users can insert their own certificates or admin" ON public.issued_certificates;
        CREATE POLICY "Users can insert their own certificates or admin"
            ON public.issued_certificates
            FOR INSERT
            TO authenticated
            WITH CHECK (
                auth.uid() = user_id
                OR public.is_admin()
            );

        -- 5.3. Sửa chứng chỉ: Chỉ Admin
        DROP POLICY IF EXISTS "Only admin can update certificates" ON public.issued_certificates;
        CREATE POLICY "Only admin can update certificates"
            ON public.issued_certificates
            FOR UPDATE
            TO authenticated
            USING (
                public.is_admin()
            );

        -- 5.4. Xóa chứng chỉ: Chỉ Admin
        DROP POLICY IF EXISTS "Only admin can delete certificates" ON public.issued_certificates;
        CREATE POLICY "Only admin can delete certificates"
            ON public.issued_certificates
            FOR DELETE
            TO authenticated
            USING (
                public.is_admin()
            );
    END IF;
END $$;
