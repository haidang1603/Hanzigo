/**
 * =========================================================================
 * HANZI GO - INTELLIGENT AI CONVERSATION TUTOR SERVICE
 * =========================================================================
 * Tích hợp mô hình AI gia sư tiếng Trung cá nhân hóa:
 * - Hỗ trợ Gemini API / OpenAI / Backend API Endpoint
 * - Phản hồi Hanzi, Pinyin chuẩn, Bản dịch tiếng Việt
 * - Phân tích ngữ pháp (Grammar Points)
 * - Sửa lỗi câu của học viên (Correction & Suggestion)
 * - Gợi ý từ vựng theo cấp độ HSK
 * - Chế độ Huấn luyện Ngoại tuyến (Offline Engine) thông minh khi chưa có API Key
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

/**
 * Gọi Backend Serverless Function (/api/ai/chat)
 * GEMINI_API_KEY được bảo mật 100% trên server-side, không bao giờ lộ ra Client Bundle.
 */
async function callBackendAiTutor(userText, hskLevel = 'HSK 1', conversationHistory = []) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userText,
      hskLevel,
      conversationHistory
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Chế độ Huấn luyện Ngoại tuyến (Offline Intelligent Engine)
 * Phục vụ trường hợp người dùng chưa cấu hình API Key nhưng vẫn có trải nghiệm học tập đầy đủ
 */
function getOfflineAiTutorResponse(userText, hskLevel = 'HSK 1') {
  const text = (userText || '').trim();
  const lower = text.toLowerCase();

  if (lower.includes('你好') || lower.includes('您好') || lower.includes('hi') || lower.includes('hello')) {
    return {
      hanzi: '你好呀！很高兴和你一起练习中文。今天你想聊些什么话题呢？',
      pinyin: 'Nǐ hǎo ya! Hěn gāoxìng hé nǐ yìqǐ liànxí Zhōngwén. Jīntiān nǐ xiǎng liáo xiē shénme huàtí ne?',
      meaning: 'Chào bạn nha! Rất vui được cùng bạn luyện tập tiếng Trung. Hôm nay bạn muốn trò chuyện về chủ đề gì nào?',
      grammarAnalysis: 'Cấu trúc "很高兴 + 和...一起 + Động từ" (Rất vui được cùng ai làm việc gì). Trợ từ ngữ khí "呢" dùng ở cuối câu hỏi để tạo sắc thái nhẹ nhàng, thân mật.',
      userCorrection: 'Chào hỏi rất chuẩn! Bạn có thể thử dùng "您好" (Nín hǎo) khi chào người lớn tuổi hoặc trong bối cảnh lịch sự trang trọng.',
      vocabSuggestions: [
        { hanzi: '一起', pinyin: 'yìqǐ', meaning: 'Cùng nhau', level: 'HSK 1' },
        { hanzi: '话题', pinyin: 'huàtí', meaning: 'Chủ đề', level: 'HSK 3' }
      ]
    };
  }

  if (lower.includes('叫') || lower.includes('我是') || lower.includes('名字') || lower.includes('越南')) {
    return {
      hanzi: '很高兴认识你！越南是一个非常美丽的国家，听说越南咖啡特别好喝，是真的吗？',
      pinyin: 'Hěn gāoxìng rènshi nǐ! Yuènán shì yí gè fēicháng měilì de guójiā, tīngshuō Yuènán kāfēi tèbié hǎohē, shì zhēn de ma?',
      meaning: 'Rất vui được làm quen với bạn! Việt Nam là một đất nước rất xinh đẹp, nghe nói cà phê Việt Nam ngon tuyệt vời, có thật vậy không?',
      grammarAnalysis: 'Phó từ "听说" (tīngshuō) đặt đầu mệnh đề mang nghĩa "nghe nói là...". Mẫu câu xác nhận "... 是真的吗？" dùng để hỏi xem thông tin có đúng sự thật không.',
      userCorrection: 'Cách giới thiệu của bạn rất rõ ràng. Để tự nhiên hơn khi giới thiệu họ tên, người Trung Quốc thường nói: "我叫...，你可以叫我..." (Tôi tên là..., bạn có thể gọi tôi là...).',
      vocabSuggestions: [
        { hanzi: '认识', pinyin: 'rènshi', meaning: 'Quen biết, làm quen', level: 'HSK 1' },
        { hanzi: '听说', pinyin: 'tīngshuō', meaning: 'Nghe nói', level: 'HSK 2' },
        { hanzi: '真的', pinyin: 'zhēnde', meaning: 'Thật sự, chân thực', level: 'HSK 2' }
      ]
    };
  }

  if (lower.includes('学') || lower.includes('中文') || lower.includes('难') || lower.includes('hsk')) {
    return {
      hanzi: '学中文最重要的是多开口多积累。虽然汉字笔画有点多，但只要掌握了偏旁部首，就会发现非常有趣！',
      pinyin: 'Xué Zhōngwén zuì zhòngyào de shì duō kāikǒu duō jīlěi. Suīrán Hànzì bǐhuà yǒudiǎn duō, dàn zhǐyào zhǎngwò le piānpáng bùshǒu, jiù huì fāxiàn fēicháng yǒuqù!',
      meaning: 'Học tiếng Trung điều quan trọng nhất là mở miệng nói nhiều và tích lũy từ vựng. Mặc dù nét chữ Hán hơi nhiều, nhưng chỉ cần nắm vững bộ thủ, bạn sẽ thấy nó cực kỳ thú vị!',
      grammarAnalysis: 'Cặp liên từ chỉ sự nhượng bộ "虽然... 但是..." (Tuy rằng... nhưng mà...). Cặp điều kiện "只要... 就..." (Chỉ cần... thì sẽ...).',
      userCorrection: 'Rất tốt! Khi nói về việc học tập, bạn có thể bổ sung thêm trạng từ chỉ thời gian: "我学中文学了三个月了" (Tôi đã học tiếng Trung được 3 tháng rồi).',
      vocabSuggestions: [
        { hanzi: '积累', pinyin: 'jīlěi', meaning: 'Tích lũy', level: 'HSK 4' },
        { hanzi: '部首', pinyin: 'bùshǒu', meaning: 'Bộ thủ chữ Hán', level: 'HSK 3' }
      ]
    };
  }

  // Fallback intelligent response
  return {
    hanzi: `你说的很有道理！用中文表达自己的想法是非常好的口语练习。对于刚才的内容，我们可以继续深入讨论吗？`,
    pinyin: 'Nǐ shuō de hěn yǒu dàolǐ! Yòng Zhōngwén biǎodá zìjǐ de xiǎngfǎ shì fēicháng hǎo de kǒuyǔ liànxí. Duìyú gāngcái de nèiróng, wǒmen kěyǐ jìxù shēnrù tǎolùn ma?',
    meaning: 'Bạn nói rất có lý! Dùng tiếng Trung để diễn đạt ý nghĩ của mình là bài tập khẩu ngữ rất tuyệt vời. Về nội dung vừa rồi, chúng mình có thể tiếp tục thảo luận sâu hơn không?',
    grammarAnalysis: 'Cấu trúc "用 + Ngôn ngữ + Động từ" (Dùng tiếng... để làm gì). "对于..." (Đối với / Về phương diện...).',
    userCorrection: 'Câu của bạn diễn đạt khá trôi chảy. Hãy thử sử dụng thêm liên từ như "所以" (suǒyǐ - cho nên) hoặc "因为" (yīnwèi - bởi vì) để câu văn mạch lạc hơn nhé!',
    vocabSuggestions: [
      { hanzi: '表达', pinyin: 'biǎodá', meaning: 'Biểu đạt, diễn đạt', level: 'HSK 3' },
      { hanzi: '讨论', pinyin: 'tǎolùn', meaning: 'Thảo luận', level: 'HSK 3' }
    ]
  };
}

/**
 * Main AI Tutor Message Handler
 */
export async function sendTutorMessage(userText, options = {}) {
  const {
    hskLevel = 'HSK 1',
    conversationHistory = [],
    userId = null
  } = options;

  let tutorResponse;
  let provider = 'offline';

  try {
    // Gọi Serverless Function /api/ai/chat (bảo mật GEMINI_API_KEY ở server)
    tutorResponse = await callBackendAiTutor(userText, hskLevel, conversationHistory);
    provider = 'gemini';
  } catch (err) {
    // Khi chưa cấu hình serverless function hoặc ngoại tuyến: kích hoạt AI offline tutor
    console.info('Backend AI proxy không phản hồi hoặc ngoại tuyến, chuyển sang AI Tutor Offline:', err.message);
    tutorResponse = getOfflineAiTutorResponse(userText, hskLevel);
    provider = 'offline';
  }

  // Save to DB if logged in
  if (userId && isSupabaseConfigured && supabase && isValidUuid(userId)) {
    try {
      // Record user study log
      await supabase.from('user_study_logs').insert([{
        user_id: userId,
        activity_type: 'ai_chat',
        item_ref: userText.slice(0, 50),
        xp_awarded: 10
      }]);
    } catch (e) {
      console.warn('AI chat DB log notice:', e);
    }
  }

  return {
    ...tutorResponse,
    provider
  };
}
