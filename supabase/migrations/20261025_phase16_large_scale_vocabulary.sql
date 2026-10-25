-- =========================================================================
-- HANZIGO PHASE 16: LARGE-SCALE CHINESE VOCABULARY SCHEMA (120,000+ ENTRIES)
-- =========================================================================
-- Mô tả:
-- 1. Mở rộng an toàn (non-breaking) bảng public.dictionary_entries.
-- 2. Thêm các trường metadata nguồn, bản quyền và trạng thái kiểm duyệt:
--    - definitions (JSONB): Mảng các nghĩa độc lập của từ.
--    - examples (JSONB): Câu ví dụ đi kèm nếu có.
--    - source_id (VARCHAR): Nguồn ('cc_cedict', 'hanzigo_curated_core', 'hsk_official').
--    - source_license (VARCHAR): Giấy phép nguồn ('CC BY-SA 4.0', 'HanziGo Educational').
--    - quality_status (VARCHAR): 'verified_human' hoặc 'community_standard'.
-- 3. Đảm bảo Idempotency với UNIQUE INDEX (traditional, simplified, pinyin_number).
-- 4. Bổ sung RPC search_dictionary_paginated hỗ trợ phân trang server-side
--    để không làm quá tải RAM trình duyệt với kho 120.000 từ.
-- =========================================================================

-- 1. Bổ sung các cột mới nếu chưa tồn tại
ALTER TABLE public.dictionary_entries 
    ADD COLUMN IF NOT EXISTS definitions JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS examples JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS source_id VARCHAR(50) DEFAULT 'cc_cedict',
    ADD COLUMN IF NOT EXISTS source_license VARCHAR(100) DEFAULT 'CC BY-SA 4.0',
    ADD COLUMN IF NOT EXISTS quality_status VARCHAR(30) DEFAULT 'community_standard';

-- 2. Dọn dẹp các dòng trùng lặp lịch sử (giữ lại bản ghi chuẩn id nhỏ nhất) trước khi tạo UNIQUE INDEX
DELETE FROM public.dictionary_entries a
USING public.dictionary_entries b
WHERE a.id > b.id
  AND a.traditional = b.traditional
  AND a.simplified = b.simplified
  AND a.pinyin_number = b.pinyin_number;

-- Ràng buộc Unique Composite Index đảm bảo chống trùng lặp tuyệt đối khi re-run import
CREATE UNIQUE INDEX IF NOT EXISTS idx_dict_unique_entry 
    ON public.dictionary_entries (traditional, simplified, pinyin_number);

-- 3. Index tối ưu hóa tra cứu theo cấp độ HSK và chất lượng kiểm duyệt
CREATE INDEX IF NOT EXISTS idx_dict_hsk_level 
    ON public.dictionary_entries (hsk_level);

CREATE INDEX IF NOT EXISTS idx_dict_quality_status 
    ON public.dictionary_entries (quality_status);

-- 4. RPC Phân trang tra cứu từ điển server-side (High performance pagination)
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
                    -- Khớp chính xác chữ Hán
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
                    -- Mặc định duyệt danh mục
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

-- Cấp quyền thực thi RPC cho mọi người dùng
GRANT EXECUTE ON FUNCTION public.search_dictionary_paginated(TEXT, TEXT, INT, INT) TO anon, authenticated;

-- 5. Đảm bảo Row Level Security (RLS) bảo vệ kho từ điển
ALTER TABLE public.dictionary_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read dictionary_entries" ON public.dictionary_entries;
DROP POLICY IF EXISTS "Allow public read on dictionary_entries" ON public.dictionary_entries;
DROP POLICY IF EXISTS "Admin and service role can modify dictionary" ON public.dictionary_entries;

-- Cho phép đọc công khai (read-only)
CREATE POLICY "Allow public read on dictionary_entries" 
    ON public.dictionary_entries FOR SELECT USING (true);

-- Cấm client sửa xóa trực tiếp (chỉ admin)
CREATE POLICY "Admin and service role can modify dictionary"
    ON public.dictionary_entries
    FOR ALL
    TO authenticated
    USING (
        public.is_admin()
    );

-- =========================================================================
-- HƯỚNG DẪN ROLLBACK (KHI CẦN THIẾT):
-- DROP FUNCTION IF EXISTS public.search_dictionary_paginated(TEXT, TEXT, INT, INT);
-- DROP INDEX IF EXISTS idx_dict_unique_entry;
-- DROP INDEX IF EXISTS idx_dict_hsk_level;
-- DROP INDEX IF EXISTS idx_dict_quality_status;
-- ALTER TABLE public.dictionary_entries 
--     DROP COLUMN IF EXISTS definitions,
--     DROP COLUMN IF EXISTS examples,
--     DROP COLUMN IF EXISTS source_id,
--     DROP COLUMN IF EXISTS source_license,
--     DROP COLUMN IF EXISTS quality_status;
-- =========================================================================
