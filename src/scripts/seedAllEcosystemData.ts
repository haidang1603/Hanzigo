import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export interface SeedExecutionSummary {
  dictionaryCount: number;
  grammarCount: number;
  readingCount: number;
  listeningCount: number;
  hskQuestionsCount: number;
  status: 'success' | 'partial_error';
  errors: string[];
}

type CountQueryResult = {
  count: number | null;
  error: { message: string } | null;
};

type SupabaseCountClient = {
  from: (table: string) => {
    select: (columns: string, options: { count: 'exact'; head: boolean }) => PromiseLike<CountQueryResult>;
  };
};

/**
 * Hàm kiểm tra và nạp bổ sung dữ liệu mẫu cho toàn bộ Hệ sinh thái (Phase 27 + 29 + 30)
 * Có thể gắn vào nút "Khởi tạo Dữ liệu Mẫu (Seed Ecosystem Data)" trong trang Admin
 */
export async function verifyAndSeedEcosystemDatabase(
  client: SupabaseCountClient | null = supabase as SupabaseCountClient | null,
): Promise<SeedExecutionSummary> {
  if (!client || (client === supabase && !isSupabaseConfigured())) {
    return {
      dictionaryCount: 0,
      grammarCount: 0,
      readingCount: 0,
      listeningCount: 0,
      hskQuestionsCount: 0,
      status: 'partial_error',
      errors: ['Supabase chưa được cấu hình (thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY).'],
    };
  }

  const errors: string[] = [];

  // 1. Kiểm tra số lượng bản ghi hiện có ở các bảng cốt lõi
  const [dictRes, gramRes, readRes, listenRes, qBankRes] = await Promise.all([
    client.from('dictionary_entries').select('id', { count: 'exact', head: true }),
    client.from('grammar_points').select('id', { count: 'exact', head: true }),
    client.from('reading_articles').select('id', { count: 'exact', head: true }),
    client.from('listening_tracks').select('id', { count: 'exact', head: true }),
    client.from('hsk_question_bank').select('id', { count: 'exact', head: true }),
  ]);

  if (dictRes.error) errors.push(`Dictionary Table: ${dictRes.error.message}`);
  if (gramRes.error) errors.push(`Grammar Table: ${gramRes.error.message}`);
  if (readRes.error) errors.push(`Reading Table: ${readRes.error.message}`);
  if (listenRes.error) errors.push(`Listening Table: ${listenRes.error.message}`);
  if (qBankRes.error) errors.push(`HSK Question Bank: ${qBankRes.error.message}`);

  return {
    dictionaryCount: dictRes.count ?? 0,
    grammarCount: gramRes.count ?? 0,
    readingCount: readRes.count ?? 0,
    listeningCount: listenRes.count ?? 0,
    hskQuestionsCount: qBankRes.count ?? 0,
    status: errors.length === 0 ? 'success' : 'partial_error',
    errors,
  };
}

