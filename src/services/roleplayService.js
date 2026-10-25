/**
 * =========================================================================
 * HANZIGO — CLIENT ROLEPLAY SERVICE (PHASE 11)
 * =========================================================================
 * Dịch vụ giao tiếp phòng luyện hội thoại AI phía Client.
 * Tự động gắn Supabase Bearer Token và xử lý fallback ngoại tuyến mượt mà.
 * =========================================================================
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { detectUsedTargetVocab } from '../utils/roleplayScenarioBuilder.js';

/**
 * Gửi tin nhắn của học viên tới endpoint /api/ai/roleplay
 * 
 * @param {Object} params - Tham số hội thoại
 * @returns {Promise<Object>} Phản hồi sư phạm từ AI
 */
export async function sendRoleplayMessage({
  userMessage,
  scenario = {},
  conversationHistory = [],
  hskLevel = 'HSK 1',
  targetVocab = [],
  targetGrammar = []
}) {
  const cleanMsg = (userMessage || '').trim();
  if (!cleanMsg) {
    throw new Error('Nội dung tin nhắn không được để trống.');
  }

  // 1. Chuẩn bị Token xác thực
  let accessToken = null;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      accessToken = session?.access_token;
    } catch {}
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // 2. Gửi request tới Serverless API
  try {
    const res = await fetch('/api/ai/roleplay', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userMessage: cleanMsg,
        scenario,
        conversationHistory,
        hskLevel,
        targetVocab,
        targetGrammar
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('[RoleplayService] Lỗi kết nối API, kích hoạt fallback cục bộ:', err.message);
  }

  // 3. Fallback Cục bộ (Trường hợp mất mạng hoặc không kết nối được server)
  const matched = detectUsedTargetVocab(cleanMsg, targetVocab);
  return {
    replyHanzi: '很好！你说的非常清楚。我们继续往下聊吧。',
    replyPinyin: 'Hěn hǎo! Nǐ shuō de fēicháng qīngchu. Wǒmen jìxù wǎng xià liáo ba.',
    replyVietnamese: 'Rất tốt! Bạn nói rất rõ ràng. Chúng ta tiếp tục trò chuyện nhé.',
    grammarFeedback: matched.length > 0 
      ? `Tuyệt vời! Bạn đã áp dụng thành công từ vựng: ${matched.join(', ')}.`
      : 'Câu nói tự nhiên. Hãy cố gắng vận dụng thêm các từ vựng mục tiêu của bài nhé!',
    correctedHanzi: cleanMsg,
    usedTargetItems: matched,
    completedObjectives: matched.length > 0 ? [1, 2] : [1],
    suggestedReplies: [
      { hanzi: '好的，请问接下来呢？', pinyin: 'Hǎo de, qǐngwèn jiēxiàlái ne?', vi: 'Được rồi, cho hỏi tiếp theo là gì?' },
      { hanzi: '非常感谢你的帮助！', pinyin: 'Fēicháng gǎnxiè nǐ de bāngzhù!', vi: 'Rất cảm ơn sự giúp đỡ của bạn!' }
    ],
    mode: 'client_local_fallback'
  };
}
