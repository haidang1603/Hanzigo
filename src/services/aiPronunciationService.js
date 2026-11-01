/**
 * =========================================================================
 * HANZI GO - CLIENT SERVICE: AI PRONUNCIATION SCORER
 * =========================================================================
 * Gửi dữ liệu âm thanh và transcript lên Gemini AI để chấm điểm khách quan,
 * phân tích thanh điệu, ngữ âm thực tế thay vì điểm cố định 93/100.
 * =========================================================================
 */

import { evaluateRealPronunciation } from '../utils/pronunciationEvaluator';

/**
 * Chuyển Blob âm thanh sang base64 string
 */
export async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Gọi AI chấm điểm phát âm qua backend API hoặc trực tiếp
 */
export async function scorePronunciationWithAi({
  targetHanzi,
  targetPinyin = '',
  spokenTranscript = '',
  audioBlob = null,
  audioDurationMs = 0
}) {
  let audioBase64 = null;
  let mimeType = 'audio/webm';

  if (audioBlob) {
    try {
      audioBase64 = await blobToBase64(audioBlob);
      mimeType = audioBlob.type || 'audio/webm';
    } catch (e) {
      console.warn('Không thể convert audio sang base64:', e);
    }
  }

  // 1. Thử gọi qua API backend serverless (/api/ai/pronunciation)
  try {
    const res = await fetch('/api/ai/pronunciation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetHanzi,
        targetPinyin,
        spokenTranscript,
        audioDurationMs,
        audioBase64,
        mimeType
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.result) {
        return {
          ...data.result,
          isValid: true,
          isAiEvaluated: true
        };
      }
    }
  } catch (apiErr) {
    console.warn('[AI Pronunciation Service] Backend API call failed, trying client-side direct fallback...', apiErr);
  }

  // 2. Dự phòng: Nếu serverless không chạy (ví dụ dev cục bộ chỉ chạy Vite), gọi trực tiếp Gemini bằng client key nếu có
  const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (clientApiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${clientApiKey}`;
      
      const parts = [];
      if (audioBase64) {
        const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: cleanBase64
          }
        });
      }

      parts.push({
        text: `Bạn là giám khảo ngữ âm tiếng Trung Bắc Kinh chấm điểm bài nói của học viên Việt Nam.
Mục tiêu: Chữ Hán: "${targetHanzi}", Pinyin: "${targetPinyin}".
Văn bản nhận diện từ mic: "${spokenTranscript}".
Thời lượng nói: ${audioDurationMs}ms.

QUY TẮC BẮT BUỘC:
- TUYỆT ĐỐI KHÔNG LUÔN CHẤM 93/100. Điểm phải phân hóa chân thực từ 0 đến 100 theo đúng phát âm thực tế.
- Nếu nói chuẩn xác cả thanh điệu và âm đầu/vần: 90 - 98 điểm.
- Nếu đúng chữ nhưng sai thanh điệu (đặc biệt thanh 4, thanh 3, biến điệu): 70 - 85 điểm.
- Nếu đọc ngọng hoặc nhận diện lệch 1 chữ: 55 - 69 điểm.
- Nếu sai nhiều hoặc không nghe rõ: < 50 điểm.

Trả về duy nhất định dạng JSON (không dùng markdown code blocks):
{
  "overall": <số nguyên 0-100>,
  "accuracyScore": <số nguyên 0-100>,
  "toneScore": <số nguyên 0-100>,
  "fluencyScore": <số nguyên 0-100>,
  "rank": "<Xuất sắc | Rất tốt | Khá | Cần luyện thêm | Chưa đạt>",
  "rankBadge": "<VD: Xuất sắc 🌟 | Rất tốt 👏 | Cần luyện thêm ✍️>",
  "charBreakdown": [
    {
      "char": "<chữ Hán>",
      "pinyin": "<pinyin>",
      "status": "<correct | warning | incorrect>",
      "label": "<Chuẩn xác | Lệch thanh điệu | Sai âm đầu>",
      "feedback": "<nhận xét ngắn>"
    }
  ],
  "feedback": "<nhận xét chân thực chi tiết bằng tiếng Việt>",
  "articulatoryTip": "<mẹo đặt lưỡi, khẩu hình để đọc đúng>",
  "xpEarned": <số 5-25>
}`
      });

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      if (response.ok) {
        const geminiData = await response.json();
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return {
            ...parsed,
            spokenText: spokenTranscript,
            isValid: true,
            isAiEvaluated: true
          };
        }
      }
    } catch (directErr) {
      console.warn('[Direct Gemini Fallback Failed]', directErr);
    }
  }

  // 3. Fallback cuối cùng nếu cả 2 cách trên không khả dụng: Bộ máy heuristic cải tiến (KHÔNG cố định 93 điểm)
  const localResult = evaluateRealPronunciation({
    targetHanzi,
    targetPinyin,
    spokenTranscript,
    audioDurationMs
  });

  return {
    ...localResult,
    isAiEvaluated: false
  };
}

