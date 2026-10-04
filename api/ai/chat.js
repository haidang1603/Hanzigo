/**
 * =========================================================================
 * HANZI GO - SECURE SERVERLESS API: /api/ai/chat
 * =========================================================================
 * Vercel Serverless Function (Node.js runtime):
 * - Keeps GEMINI_API_KEY securely on the server-side environment variables.
 * - Frontend NEVER exposes secret keys into client-side bundles (no VITE_ prefix).
 * - Proxies conversation requests, validates parameters, and returns structured JSON.
 */

const SYSTEM_PROMPT = `
Bạn là "Lão Sư HanziGo", một gia sư tiếng Trung bản ngữ kiên nhẫn, thân thiện và giàu kinh nghiệm sư phạm dành cho người Việt Nam.
Nhiệm vụ của bạn là trò chuyện tự nhiên bằng tiếng Trung, đồng thời hướng dẫn và sửa lỗi cho người học.

Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "hanzi": "Câu trả lời bằng chữ Hán giản thể",
  "pinyin": "Pinyin có dấu thanh điệu chuẩn xác",
  "meaning": "Bản dịch tiếng Việt tự nhiên, chuẩn nghĩa",
  "grammarAnalysis": "Giải thích ngắn gọn 1-2 điểm ngữ pháp xuất hiện trong câu hội thoại",
  "userCorrection": "Nếu câu của người học có lỗi sai (ngữ pháp, trật tự từ, từ vựng), hãy chỉ ra lỗi và đưa ra cách diễn đạt tự nhiên hơn bằng tiếng Việt. Nếu người học đã nói rất tốt, hãy khen ngợi và đưa ra 1 cách diễn đạt nâng cao tương đương.",
  "vocabSuggestions": [
    { "hanzi": "从", "pinyin": "cóng", "meaning": "Từ (nơi chốn, thời gian)", "level": "HSK 1" }
  ]
}
Chỉ trả về chuỗi JSON thuần túy, không bọc trong markdown code block nếu không cần thiết.
`;

export default async function handler(req, res) {
  // Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // GEMINI_API_KEY is securely retrieved on the server environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Falling back to offline engine.'
    });
  }

  const { userText, hskLevel = 'HSK 1', conversationHistory = [] } = req.body || {};
  if (!userText || typeof userText !== 'string' || !userText.trim()) {
    return res.status(400).json({ error: 'Missing or invalid userText in request body.' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${SYSTEM_PROMPT}\nTrình độ hiện tại của học viên: ${hskLevel}` }]
    },
    ...conversationHistory.slice(-6).map(msg => ({
      role: msg.sender === 'user' || msg.speaker === 'user' ? 'user' : 'model',
      parts: [{ text: msg.hanzi || msg.text || '' }]
    })),
    {
      role: 'user',
      parts: [{ text: `Câu người học vừa nói: "${userText}"` }]
    }
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData?.error?.message || `Gemini API error: ${response.statusText}`
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(502).json({ error: 'Empty response returned from Gemini API.' });
    }

    const parsed = JSON.parse(rawText);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Serverless AI Tutor error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
