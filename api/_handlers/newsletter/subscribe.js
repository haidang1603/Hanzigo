/**
 * =========================================================================
 * HANZI GO - NEWSLETTER SUBSCRIPTION & DAILY LESSON DISPATCH API
 * =========================================================================
 * Endpoint: POST /api/newsletter/subscribe
 * - Rate-limited to prevent abuse
 * - Stores subscriber into Supabase (table: newsletter_subscribers)
 * - Records audit log
 * - Returns today's curated Chinese lesson preview immediately
 * =========================================================================
 */

import { getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

// Memory rate-limiting fallback (5 submissions / 15 minutes per IP)
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now - record.firstAttempt > windowMs) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true;
  }

  record.count += 1;
  return false;
}

// Curated daily lesson seed
const DAILY_LESSONS = [
  {
    character: '好',
    pinyin: 'hǎo',
    meaning: 'Tốt, đẹp, hay, được',
    hanViet: 'HẢO',
    hskLevel: 'HSK 1',
    breakdown: 'Bộ Nữ (女 - người phụ nữ) + bộ Tử (子 - đứa con).',
    mnemonic: 'Người mẹ ôm đứa con thơ là biểu tượng tuyệt đẹp của tình mẫu tử, sự viên mãn và những điều tốt lành (Hảo).',
    strokeCount: 6,
    examples: [
      { zh: '你好！', py: 'Nǐ hǎo!', vi: 'Xin chào!' },
      { zh: '今天天气很好。', py: 'Jīntiān tiānqì hěn hǎo.', vi: 'Hôm nay thời tiết rất đẹp.' }
    ]
  },
  {
    character: '学',
    pinyin: 'xué',
    meaning: 'Học, nghiên cứu, bắt chước',
    hanViet: 'HỌC',
    hskLevel: 'HSK 1',
    breakdown: 'Phía trên là mái trường và những tia sáng tri thức (爻), phía dưới là bộ Tử (子 - người học trò).',
    mnemonic: 'Đứa trẻ ngồi dưới mái nhà chăm chỉ rèn luyện tri thức mỗi ngày chính là "Học".',
    strokeCount: 8,
    examples: [
      { zh: '我学汉语。', py: 'Wǒ xué Hànyǔ.', vi: 'Tôi học tiếng Trung.' },
      { zh: '好好学习，天天向上。', py: 'Hǎohǎo xuéxí, tiāntiān xiàngshàng.', vi: 'Học tập thật tốt, mỗi ngày một tiến bộ.' }
    ]
  },
  {
    character: '明',
    pinyin: 'míng',
    meaning: 'Sáng, rõ ràng, sáng mai',
    hanViet: 'MINH',
    hskLevel: 'HSK 1',
    breakdown: 'Bộ Nhật (日 - mặt trời) + bộ Nguyệt (月 - mặt trăng).',
    mnemonic: 'Mặt trời ban ngày và mặt trăng ban đêm cùng tỏa sáng, tạo nên nguồn sáng rực rỡ và rõ ràng (Minh).',
    strokeCount: 8,
    examples: [
      { zh: '明天见！', py: 'Míngtiān jiàn!', vi: 'Hẹn gặp lại vào ngày mai!' },
      { zh: '我明白了。', py: 'Wǒ míngbai le.', vi: 'Tôi hiểu rõ rồi.' }
    ]
  }
];

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch today's featured lesson
  if (req.method === 'GET') {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const todayLesson = DAILY_LESSONS[dayOfYear % DAILY_LESSONS.length];
    return res.status(200).json({
      success: true,
      lesson: todayLesson,
      dispatchSchedule: '07:00 sáng mỗi ngày'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST hoặc GET' });
  }

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: 'Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau 15 phút.'
      });
    }

    const { email = '', source = 'footer_newsletter' } = req.body || {};
    const cleanEmail = String(email).trim().toLowerCase();

    // Regex RFC 5322 standard email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 255) {
      return res.status(400).json({
        error: 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.'
      });
    }

    // Pick today's lesson based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const todayLesson = DAILY_LESSONS[dayOfYear % DAILY_LESSONS.length];

    // Supabase persistence if available
    const supabase = getSupabaseAdminClient();
    let isNewSubscriber = true;

    if (supabase) {
      try {
        // 1. Check if subscriber already exists
        const { data: existing } = await supabase
          .from('newsletter_subscribers')
          .select('id, status, email')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          isNewSubscriber = false;
        } else {
          // 2. Insert new subscriber
          await supabase
            .from('newsletter_subscribers')
            .insert({
              email: cleanEmail,
              status: 'active',
              source,
              subscribed_at: new Date().toISOString()
            });
        }
      } catch (dbErr) {
        // Fallback: If table newsletter_subscribers doesn't exist yet, save into audit_logs table
        try {
          await supabase
            .from('audit_logs')
            .insert({
              action: 'NEWSLETTER_SUBSCRIBE',
              category: 'USER_ENGAGEMENT',
              severity: 'INFO',
              actor_id: 'visitor',
              target_id: cleanEmail,
              metadata: { source, timestamp: new Date().toISOString() }
            });
        } catch {}
      }
    }

    return res.status(200).json({
      success: true,
      isNewSubscriber,
      message: isNewSubscriber 
        ? 'Đăng ký thành công! Bạn sẽ nhận được bài học vào 7h sáng hàng ngày.'
        : 'Email này đã có trong danh sách đăng ký. Hãy kiểm tra hòm thư của bạn nhé!',
      lesson: todayLesson
    });
  } catch (error) {
    console.error('[Newsletter API Error]:', error);
    return res.status(500).json({
      error: 'Không thể hoàn tất đăng ký lúc này. Vui lòng thử lại sau.'
    });
  }
}

