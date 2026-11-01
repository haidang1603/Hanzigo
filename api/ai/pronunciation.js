/**
 * =========================================================================
 * HANZI GO - AI PRONUNCIATION & PHONETICS EVALUATION API
 * =========================================================================
 * Sử dụng Gemini AI để phân tích thực tế:
 * 1. Phân tích chi tiết từng âm tiết, thanh điệu (Tones 1, 2, 3, 4, khinh thanh)
 * 2. Điểm số linh hoạt & chân thực (KHÔNG cố định 93/100 hay random giả lập)
 * 3. Chỉ ra cụ thể lỗi phát âm: sai thanh mẫu (initial), sai vận mẫu (final), sai thanh điệu (tone)
 * 4. Lời khuyên khẩu hình (articulatory feedback) bằng tiếng Việt rõ ràng, dễ hiểu.
 * =========================================================================
 */

export default async function handler(req, res) {
  // CORS & Methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST' });
  }

  try {
    const {
      targetHanzi = '',
      targetPinyin = '',
      spokenTranscript = '',
      audioDurationMs = 0,
      audioBase64 = null,
      mimeType = 'audio/webm'
    } = req.body || {};

    if (!targetHanzi.trim()) {
      return res.status(400).json({ error: 'Thiếu chữ Hán mục tiêu (targetHanzi)' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa cấu hình GEMINI_API_KEY trên server' });
    }

    const cleanTarget = targetHanzi.trim();
    const cleanSpoken = (spokenTranscript || '').trim();

    // Prompt chuyên sâu cho chuyên gia ngữ âm tiếng Trung
    const systemInstruction = `Bạn là một chuyên gia khảo thí ngữ âm tiếng Trung Bắc Kinh (Standard Mandarin Phonetics Evaluator).
Nhiệm vụ của bạn là thẩm định và chấm điểm phát âm tiếng Trung của người học Việt Nam một cách CHÂN THỰC, KHẮC KHE NHƯNG CÓ TÍNH SƯ PHẠM.

QUY TẮC CHẤM ĐIỂM NGHIÊM NGẶT:
1. TUYỆT ĐỐI KHÔNG làm tròn hoặc luôn trả về một con số cố định như 93, 95 hay 98 điểm. Điểm số từ 0 đến 100 phải phản ánh chính xác chất lượng phát âm:
   - 95 - 100: Hoàn hảo, tự nhiên như người bản xứ Bắc Kinh, đúng cả thanh điệu lẫn biến điệu (ví dụ: biến điệu 2 thanh 3, biến điệu 不 bù/bú, 一 yī/yí/yì).
   - 85 - 94: Rất tốt, nhận diện chính xác chữ Hán, thanh điệu chuẩn nhưng có thể hơi cứng hoặc khẩu hình chưa mở tròn.
   - 70 - 84: Khá, nhận diện đúng từ vựng nhưng sai nhẹ thanh điệu (ví dụ thanh 1 bị tụt, thanh 4 đọc như dấu huyền tiếng Việt, thanh 3 chưa xuống đủ sâu).
   - 50 - 69: Trung bình, phát âm ngọng âm đầu (zh/ch/sh/r, j/q/x, z/c/s) hoặc sai lệch 1-2 từ trong câu.
   - 20 - 49: Kém, nhận diện sai nhiều từ hoặc chỉ nói được một phần nhỏ.
   - 0: Không nói gì hoặc hoàn toàn không nghe ra tiếng Trung.
2. Kiểm tra cẩn thận các lỗi người Việt Nam hay mắc phải:
   - Thanh 4 (hạ nhanh dứt khoát 5->1) bị đọc thành dấu huyền tiếng Việt (2->1).
   - Âm bật hơi (p, t, k, q, ch, c) không bật hơi.
   - Âm uốn lưỡi (zh, ch, sh, r) bị đọc phẳng lưỡi thành (z, c, s).
   - Vận mẫu tròn môi (ü, üe, uan...) bị bè môi.
3. Trả về định dạng JSON thuần túy (KHÔNG có markdown block, KHÔNG có chữ ngoài JSON).`;

    const userPrompt = `
Mục tiêu luyện tập:
- Chữ Hán chuẩn: "${cleanTarget}"
- Pinyin chuẩn: "${targetPinyin || ''}"
- Nhận diện giọng nói từ mic (ASR): "${cleanSpoken || '(không nhận diện được từ nào)'}"
- Thời lượng thu âm: ${audioDurationMs} ms

Hãy phân tích và trả về đúng JSON format sau:
{
  "overall": <số nguyên từ 0 đến 100>,
  "accuracyScore": <số nguyên 0-100 về độ khớp từ và âm tiết>,
  "toneScore": <số nguyên 0-100 về độ chuẩn thanh điệu>,
  "fluencyScore": <số nguyên 0-100 về tốc độ và nhịp điệu phát âm>,
  "rank": "<Xuất sắc | Rất tốt | Khá | Cần luyện thêm | Chưa đạt>",
  "rankBadge": "<VD: Xuất sắc 🌟 | Rất tốt 👏 | Cần luyện thêm ✍️>",
  "charBreakdown": [
    {
      "char": "<từng chữ Hán trong mục tiêu>",
      "pinyin": "<pinyin tương ứng>",
      "status": "<correct | warning | incorrect>",
      "label": "<Chuẩn xác | Lệch thanh điệu | Sai âm đầu | Chưa phát âm>",
      "feedback": "<nhận xét ngắn 1 câu cho chữ này>"
    }
  ],
  "feedback": "<nhận xét tổng quát bằng tiếng Việt, chân thực, chỉ ra cụ thể ưu điểm và lỗi sai>",
  "articulatoryTip": "<hướng dẫn mẹo đặt vị trí lưỡi, khẩu hình môi hoặc cách điều hơi để đọc đúng hơn>",
  "xpEarned": <số điểm thưởng XP từ 5 đến 25 tùy độ tốt>
}
`;

    // Gọi Gemini API (Sử dụng gemini-1.5-flash hoặc gemini-2.0-flash-exp)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const parts = [];

    // Nếu có audio base64 gửi kèm, đính kèm vào Gemini Multimodal để thẩm âm thực tế
    if (audioBase64 && typeof audioBase64 === 'string') {
      const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: cleanBase64
        }
      });
      parts.push({
        text: `ĐÂY LÀ FILE GHI ÂM THỰC TẾ CỦA HỌC VIÊN. Hãy nghe kỹ ngữ âm, cao độ giọng (pitch), độ vang và thanh điệu trong file ghi âm này để so sánh với mục tiêu: "${cleanTarget}" (${targetPinyin}).\n${userPrompt}`
      });
    } else {
      parts.push({
        text: userPrompt
      });
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: 'user',
          parts
        }
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[Gemini Pronunciation Error]', response.status, errorText);
      return res.status(response.status).json({
        error: `Gemini API trả về lỗi (${response.status})`,
        details: errorText
      });
    }

    const data = await response.json();
    const rawOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawOutput) {
      return res.status(502).json({ error: 'AI không trả về kết quả thẩm âm' });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawOutput);
    } catch {
      // Làm sạch markdown nếu có
      const cleaned = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    // Đảm bảo không bao giờ bị rơi vào bẫy cố định 93 điểm
    parsedResult.spokenTranscript = cleanSpoken;
    parsedResult.targetHanzi = cleanTarget;
    parsedResult.targetPinyin = targetPinyin;
    parsedResult.isAiScored = true;

    return res.status(200).json({
      success: true,
      result: parsedResult
    });

  } catch (err) {
    console.error('[Pronunciation API Exception]', err);
    return res.status(500).json({
      error: 'Lỗi máy chủ khi xử lý thẩm âm: ' + err.message
    });
  }
}

