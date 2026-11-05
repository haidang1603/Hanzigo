import { DAILY_QUOTES } from '../src/data/dailyQuotesData.js';
import fs from 'fs';

const escapeSql = (str) => String(str || '').replace(/'/g, "''");

const rows = DAILY_QUOTES.map(q => {
  return `  ('${escapeSql(q.hanzi)}', '${escapeSql(q.pinyin)}', '${escapeSql(q.meaning)}', '${escapeSql(q.author)}')`;
}).join(',\n');

const migrationSql = `-- =========================================================================
-- HANZI GO - MIGRATION: DAILY PROVERBS & QUOTES
-- =========================================================================
-- Bảng daily_quotes: 60 câu châm ngôn, danh ngôn Hán học đổi mỗi ngày
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.daily_quotes (
  id SERIAL PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning TEXT NOT NULL,
  author TEXT DEFAULT '',
  hsk_level TEXT DEFAULT 'HSK 1',
  is_hidden BOOLEAN DEFAULT false,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục tối ưu
CREATE INDEX IF NOT EXISTS idx_daily_quotes_level ON public.daily_quotes(hsk_level, is_hidden);

-- Kích hoạt Row Level Security (RLS)
ALTER TABLE public.daily_quotes ENABLE ROW LEVEL SECURITY;

-- Chính sách bảo mật RLS (Công chúng đọc, Admin quản trị)
DROP POLICY IF EXISTS "daily_quotes_select_public" ON public.daily_quotes;
CREATE POLICY "daily_quotes_select_public" ON public.daily_quotes 
  FOR SELECT USING (is_hidden = false OR public.is_admin());

DROP POLICY IF EXISTS "daily_quotes_admin_all" ON public.daily_quotes;
CREATE POLICY "daily_quotes_admin_all" ON public.daily_quotes 
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Dữ liệu khởi tạo (Seed data): 60 câu châm ngôn tiếng Trung
INSERT INTO public.daily_quotes (hanzi, pinyin, meaning, author)
VALUES
${rows}
ON CONFLICT DO NOTHING;
`;

fs.writeFileSync('supabase/migrations/20261106_daily_quotes.sql', migrationSql, 'utf8');
console.log('✅ Generated 20261106_daily_quotes.sql successfully!');
