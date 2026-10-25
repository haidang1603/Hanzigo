/**
 * =========================================================================
 * HANZIGO — SECURE SERVERLESS API: /api/ai/roleplay (PHASE 11)
 * =========================================================================
 * Contextual AI Roleplay Studio Endpoint:
 * - Keeps API keys securely server-side.
 * - Multi-tier AI Gateway: xKiro (Free-First) -> Gemini (Backup) -> Offline Pedagogical Engine.
 * - Validates input, prevents prompt injection, enforces HSK level constraints.
 * - Returns structured JSON: replyHanzi, replyPinyin, replyVietnamese,
 *   grammarFeedback, correctedHanzi, usedTargetItems, completedObjectives, suggestedReplies.
 * =========================================================================
 */

import { checkRateLimitAndQuota } from '../_utils/distributedRateLimiter.js';
import { verifyRequestAuth } from '../_utils/supabaseServer.js';
import { callUnifiedAiProvider, extractStructuredJson } from '../_utils/aiProviderAdapter.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 25;
const DAILY_QUOTA_MAX_REQUESTS = 150;

// Prompt injection detection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts)/i,
  /system\s+prompt\s+override/i,
  /you\s+are\s+now\s+(an\s+unrestricted|DAN|jailbreak)/i,
  /reveal\s+(your\s+)?(api[_\s]?key|secret|system\s+prompt)/i,
  /<script\b[^>]*>/i
];

export function detectAbuseOrInjection(text) {
  if (!text || typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Bộ sinh phản hồi sư phạm Offline (Fallback khi mất kết nối AI hoặc hết quota)
 */
export function generateOfflinePedagogicalReply(userMessage, scenario = {}, targetVocab = []) {
  const clean = (userMessage || '').trim().toLowerCase();
  const matchedVocab = targetVocab
    .filter(v => v.hanzi && clean.includes(v.hanzi.toLowerCase()))
    .map(v => v.hanzi);

  const personaName = scenario.aiPersona?.name || 'Bạn học AI';
  const roleTitle = scenario.title || 'Giao tiếp';

  let replyHanzi = '我明白了，你说的很好！我们继续练习吧。';
  let replyPinyin = 'Wǒ míngbai le, nǐ shuō de hěn hǎo! Wǒmen jìxù liànxí ba.';
  let replyVietnamese = 'Tôi hiểu rồi, bạn nói rất tốt! Chúng ta tiếp tục luyện tập nhé.';
  let grammarFeedback = matchedVocab.length > 0 
    ? `Rất xuất sắc! Bạn đã áp dụng thành công từ vựng mục tiêu: ${matchedVocab.join(', ')}.`
    : 'Câu nói rõ ràng, dễ hiểu. Bạn hãy thử kết hợp thêm các từ vựng mục tiêu trong bài nhé.';
  let correctedHanzi = userMessage;

  // Rẽ nhánh thông minh dựa trên từ khóa người dùng
  if (clean.includes('你好') || clean.includes('您好')) {
    replyHanzi = '你好！很高兴和你聊天。请问你今天想聊些什么？';
    replyPinyin = 'Nǐ hǎo! Hěn gāoxìng hé nǐ liáotiān. Qǐngwèn nǐ jīntiān xiǎng liáo xiē shénme?';
    replyVietnamese = 'Chào bạn! Rất vui được trò chuyện cùng bạn. Cho hỏi hôm nay bạn muốn trò chuyện về điều gì?';
  } else if (clean.includes('多少钱') || clean.includes('贵') || clean.includes('便宜')) {
    replyHanzi = '这个不算贵，质量非常好。如果你买两个，我可以给你打折。';
    replyPinyin = 'Zhè ge bù suàn guì, zhìliàng fēicháng hǎo. Rúguǒ nǐ mǎi liǎng gè, wǒ kěyǐ gěi nǐ dǎzhé.';
    replyVietnamese = 'Cái này không tính là đắt đâu, chất lượng rất tốt. Nếu bạn mua 2 cái, tôi có thể giảm giá cho bạn.';
  } else if (clean.includes('谢谢') || clean.includes('再见')) {
    replyHanzi = '不客气！祝你今天过得愉快，下次见！';
    replyPinyin = 'Bú kèqi! Zhù nǐ jīntiān guò de yúkuài, xià cì jiàn!';
    replyVietnamese = 'Không có gì! Chúc bạn một ngày vui vẻ, hẹn gặp lại lần sau!';
  } else if (clean.includes('吃') || clean.includes('菜') || clean.includes('点')) {
    replyHanzi = '好的，我们的特色菜味道特别好，你要不要尝一尝？';
    replyPinyin = 'Hǎo de, wǒmen de tèsè cài wèidào tèbié hǎo, nǐ yào bu yào cháng yi cháng?';
    replyVietnamese = 'Vâng, món đặc sản của chúng tôi vị rất ngon, bạn có muốn nếm thử một chút không?';
  }

  const suggestedReplies = [
    { hanzi: '好的，请给我一份。', pinyin: 'Hǎo de, qǐng gěi wǒ yí fèn.', vietnamese: 'Được rồi, xin cho tôi một phần.', vi: 'Được rồi, xin cho tôi một phần.' },
    { hanzi: '请问还有别的推荐吗？', pinyin: 'Qǐngwèn hái yǒu bié de tuījiàn ma?', vietnamese: 'Cho hỏi còn gợi ý nào khác không ạ?', vi: 'Cho hỏi còn gợi ý nào khác không ạ?' },
    { hanzi: '太感谢了，今天就到这里吧。', pinyin: 'Tài gǎnxiè le, jīntiān jiù dào zhèlǐ ba.', vietnamese: 'Cảm ơn nhiều lắm, hôm nay đến đây nhé.', vi: 'Cảm ơn nhiều lắm, hôm nay đến đây nhé.' }
  ];

  return {
    replyHanzi,
    replyPinyin,
    replyVietnamese,
    grammarFeedback,
    correctedHanzi,
    usedTargetItems: matchedVocab,
    completedObjectives: matchedVocab.length > 0 ? [1, 2] : [1],
    suggestedReplies,
    mode: 'pedagogical_offline_fallback'
  };
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-User-Id');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  try {
    // -----------------------------------------------------------------------
    // Chốt chặn 1: Zero-Trust Auth
    // -----------------------------------------------------------------------
    const auth = await verifyRequestAuth(req);
    if (!auth.authenticated || !auth.user) {
      return res.status(401).json({
        error: 'Unauthorized: Vui lòng đăng nhập với Bearer Token hợp lệ để sử dụng AI Roleplay Studio.'
      });
    }

    // -----------------------------------------------------------------------
    // Chốt chặn 2: Rate Limit & Daily Quota
    // -----------------------------------------------------------------------
    const quota = await checkRateLimitAndQuota(req, auth.user, {
      windowMs: RATE_LIMIT_WINDOW_MS,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      dailyMax: DAILY_QUOTA_MAX_REQUESTS
    });

    if (!quota.allowed) {
      // Khi quá giới hạn quota, tự động fallback sang bộ mô phỏng sư phạm offline mà không báo 429
      const fallbackResult = generateOfflinePedagogicalReply(
        req.body?.userMessage,
        req.body?.scenario,
        req.body?.targetVocab
      );
      return res.status(200).json({
        ...fallbackResult,
        warning: 'Bạn đã đạt giới hạn cuộc gọi AI hôm nay. Hệ thống chuyển sang chế độ trợ lý ngoại tuyến.'
      });
    }

    // -----------------------------------------------------------------------
    // Chốt chặn 3: Ràng buộc Nội dung & Chống Abuse
    // -----------------------------------------------------------------------
    const { 
      userMessage = '', 
      scenario = {}, 
      conversationHistory = [], 
      hskLevel = 'HSK 1', 
      targetVocab = [], 
      targetGrammar = [] 
    } = req.body || {};

    const cleanUserMsg = String(userMessage).trim();
    if (!cleanUserMsg) {
      return res.status(400).json({ error: 'Nội dung tin nhắn của học viên không được để trống.' });
    }

    if (cleanUserMsg.length > 250) {
      return res.status(400).json({ error: 'Tin nhắn không được vượt quá 250 ký tự.' });
    }

    if (detectAbuseOrInjection(cleanUserMsg)) {
      return res.status(400).json({ error: 'Nội dung chứa biểu thức không hợp lệ hoặc vi phạm quy tắc an toàn.' });
    }

    // -----------------------------------------------------------------------
    // Chốt chặn 4: Gọi AI Gateway (xKiro Free-First -> Gemini -> Offline)
    // -----------------------------------------------------------------------
    const persona = scenario.aiPersona || { name: 'Người bản xứ', role: 'Đối tác hội thoại', tone: 'Thân thiện' };
    const vocabListStr = targetVocab.map(v => `${v.hanzi} (${v.pinyin}: ${v.meaning})`).join(', ') || 'Từ vựng giao tiếp tự nhiên';
    const grammarListStr = targetGrammar.map(g => `${g.title}: ${g.structure || ''}`).join(', ') || 'Cấu trúc thông dụng';

    const systemPrompt = `Bạn là một trợ lý AI nhập vai tiếng Trung Quốc sư phạm cao cấp trong ứng dụng HanziGo.
Nhiệm vụ: Đóng vai nhân vật "${persona.name}" (${persona.role}), giao tiếp bằng tiếng Trung với học sinh Việt Nam.
Bối cảnh cuộc trò chuyện: "${scenario.title || 'Giao tiếp đời sống'}" (${scenario.chineseTitle || ''}).
Khung trình độ học sinh: Khóa chặt từ vựng và ngữ pháp ở cấp độ ${hskLevel}. KHÔNG dùng từ ngữ quá hàn lâm hoặc cấu trúc quá phức tạp của HSK 5-6 nếu học sinh đang ở ${hskLevel}.

Từ vựng mục tiêu cần ưu tiên khuyến khích học sinh vận dụng: ${vocabListStr}
Ngữ pháp mục tiêu: ${grammarListStr}

Yêu cầu định dạng: BẮT BUỘC chỉ trả về 1 chuỗi JSON hợp lệ duy nhất, KHÔNG kèm văn bản bên ngoài, theo schema sau:
{
  "replyHanzi": "Câu trả lời tự nhiên của nhân vật bằng chữ Hán giản thể (1-3 câu)",
  "replyPinyin": "Phiên âm Pinyin chuẩn xác có dấu thanh của câu trả lời",
  "replyVietnamese": "Bản dịch nghĩa tiếng Việt tự nhiên của câu trả lời",
  "grammarFeedback": "Nhận xét sư phạm ngắn gọn (1-2 câu) bằng tiếng Việt về câu của học sinh. Nếu câu có lỗi (vị trí trạng từ, từ loại, thanh điệu) thì giải thích nhẹ nhàng. Nếu câu đúng và vận dụng tốt từ mục tiêu thì khen ngợi.",
  "correctedHanzi": "Câu tiếng Trung viết lại chuẩn xác và tự nhiên hơn (nếu câu của học sinh có lỗi hoặc chưa tự nhiên). Nếu câu của học sinh đã hoàn hảo, giữ nguyên câu của học sinh.",
  "usedTargetItems": ["Mảng các chữ Hán mục tiêu mà học sinh đã sử dụng trong câu vừa rồi"],
  "completedObjectives": [1, 2],
  "suggestedReplies": [
    { "hanzi": "Gợi ý câu trả lời tiếp theo 1", "pinyin": "Pinyin", "vi": "Nghĩa tiếng Việt" },
    { "hanzi": "Gợi ý câu trả lời tiếp theo 2", "pinyin": "Pinyin", "vi": "Nghĩa tiếng Việt" }
  ]
}`;

    const formattedHistory = Array.isArray(conversationHistory) 
      ? conversationHistory.slice(-6).map(m => ({
          role: m.role === 'ai' || m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content || m.hanzi || ''
        }))
      : [];

    formattedHistory.push({
      role: 'user',
      content: cleanUserMsg
    });

    try {
      const aiResponse = await callUnifiedAiProvider({
        systemPrompt,
        messages: formattedHistory,
        temperature: 0.6,
        maxTokens: 600,
        responseFormat: 'json'
      });

      const parsedData = extractStructuredJson(aiResponse.text);

      if (parsedData && parsedData.replyHanzi) {
        return res.status(200).json({
          replyHanzi: parsedData.replyHanzi,
          replyPinyin: parsedData.replyPinyin || '',
          replyVietnamese: parsedData.replyVietnamese || '',
          grammarFeedback: parsedData.grammarFeedback || 'Bạn giao tiếp rất tự tin!',
          correctedHanzi: parsedData.correctedHanzi || cleanUserMsg,
          usedTargetItems: Array.isArray(parsedData.usedTargetItems) ? parsedData.usedTargetItems : [],
          completedObjectives: Array.isArray(parsedData.completedObjectives) ? parsedData.completedObjectives : [1],
          suggestedReplies: Array.isArray(parsedData.suggestedReplies) ? parsedData.suggestedReplies : [],
          mode: 'cloud_ai'
        });
      }

      throw new Error('AI không trả về đúng định dạng JSON yêu cầu.');
    } catch (aiCallErr) {
      console.warn('[AI Roleplay] AI Provider call notice, using pedagogical fallback:', aiCallErr.message);
      const fallbackResult = generateOfflinePedagogicalReply(cleanUserMsg, scenario, targetVocab);
      return res.status(200).json(fallbackResult);
    }

  } catch (error) {
    console.error('[AI Roleplay] Lỗi xử lý endpoint nghiêm trọng:', error);
    const safeFallback = generateOfflinePedagogicalReply(req.body?.userMessage, req.body?.scenario, req.body?.targetVocab);
    return res.status(200).json(safeFallback);
  }
}
