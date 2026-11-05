import { createClient } from '@supabase/supabase-js';
import { DAILY_QUOTES } from '../src/data/dailyQuotesData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Thông báo: Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_KEY. Dữ liệu seed sẵn sàng trong migration file: supabase/migrations/20261106_daily_quotes.sql');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDailyQuotes() {
  console.log('🚀 Bắt đầu nạp dữ liệu châm ngôn tiếng Trung lên Supabase...');

  const { data: existing, error: fetchError } = await supabase
    .from('daily_quotes')
    .select('id, hanzi');

  if (fetchError) {
    console.warn('⚠️ Chú ý: Bảng daily_quotes có thể chưa được tạo. Hãy chạy migration supabase/migrations/20261106_daily_quotes.sql trước.', fetchError.message);
    return;
  }

  const existingMap = new Map((existing || []).map(row => [row.hanzi, row.id]));
  let inserted = 0;
  let updated = 0;

  for (const q of DAILY_QUOTES) {
    const payload = {
      hanzi: q.hanzi,
      pinyin: q.pinyin,
      meaning: q.meaning,
      author: q.author || '',
      hsk_level: 'HSK 1',
      is_hidden: false
    };

    if (existingMap.has(q.hanzi)) {
      const existingId = existingMap.get(q.hanzi);
      const { error: updErr } = await supabase
        .from('daily_quotes')
        .update(payload)
        .eq('id', existingId);
      if (!updErr) updated++;
    } else {
      const { error: insErr } = await supabase
        .from('daily_quotes')
        .insert(payload);
      if (!insErr) inserted++;
    }
  }

  console.log(`✅ Đồng bộ hoàn tất: ${inserted} câu mới được thêm, ${updated} câu đã cập nhật. Tổng cộng ${DAILY_QUOTES.length} câu châm ngôn chuẩn xác!`);
}

seedDailyQuotes().catch(err => {
  console.error('Lỗi seed:', err);
});

