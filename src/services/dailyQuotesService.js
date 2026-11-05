/**
 * HANZI GO - DAILY QUOTES SERVICE
 * Đồng bộ châm ngôn học tập từ Supabase `daily_quotes` kèm fallback chuẩn từ local dataset.
 */

import { supabase, isSupabaseConfigured } from '../supabase/config';
import { DAILY_QUOTES, getDailyQuote, getRandomQuote } from '../data/dailyQuotesData';

let cachedQuotes = null;

/**
 * Lấy danh sách châm ngôn từ Supabase (nếu có lỗi/offline thì dùng local dataset)
 * @returns {Promise<Array<{id: number, hanzi: string, pinyin: string, meaning: string, author?: string}>>}
 */
export async function fetchDailyQuotes() {
  if (cachedQuotes && cachedQuotes.length > 0) {
    return cachedQuotes;
  }

  if (!isSupabaseConfigured || !supabase) {
    cachedQuotes = DAILY_QUOTES;
    return cachedQuotes;
  }

  try {
    const { data, error } = await supabase
      .from('daily_quotes')
      .select('id, hanzi, pinyin, meaning, author')
      .eq('is_hidden', false)
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      cachedQuotes = DAILY_QUOTES;
      return cachedQuotes;
    }

    cachedQuotes = data;
    return cachedQuotes;
  } catch (err) {
    cachedQuotes = DAILY_QUOTES;
    return cachedQuotes;
  }
}

/**
 * Lấy câu châm ngôn theo ngày dựa trên kho dữ liệu (Supabase hoặc local)
 * @param {Array} [quotesPool]
 * @returns {{id: number, hanzi: string, pinyin: string, meaning: string, author?: string}}
 */
export function calculateQuoteOfTheDay(quotesPool = DAILY_QUOTES) {
  const pool = Array.isArray(quotesPool) && quotesPool.length > 0 ? quotesPool : DAILY_QUOTES;
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffTime = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % pool.length;
  return pool[index];
}

/**
 * Lấy ngẫu nhiên một câu châm ngôn từ danh sách hiện có
 * @param {number} [excludeId]
 * @param {Array} [quotesPool]
 */
export function getNextRandomQuote(excludeId = null, quotesPool = DAILY_QUOTES) {
  const pool = Array.isArray(quotesPool) && quotesPool.length > 0 ? quotesPool : DAILY_QUOTES;
  const filtered = excludeId ? pool.filter(q => q.id !== excludeId) : pool;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || pool[0];
}
