import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function localAiTutorDevPlugin() {
  return {
    name: 'local-ai-tutor-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/ai/chat' && req.method === 'POST') {
          const env = loadEnv('', process.cwd(), '');
          const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

          res.setHeader('Content-Type', 'application/json');

          if (!apiKey) {
            res.statusCode = 503;
            res.end(JSON.stringify({
              error: 'GEMINI_API_KEY is not configured in local environment.'
            }));
            return;
          }

          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { userText, hskLevel = 'HSK 1', conversationHistory = [] } = body;

              const SYSTEM_PROMPT = `Bạn là "Lão Sư HanziGo", một gia sư tiếng Trung bản ngữ kiên nhẫn, thân thiện và giàu kinh nghiệm sư phạm dành cho người Việt Nam.
Nhiệm vụ của bạn là trò chuyện tự nhiên bằng tiếng Trung, đồng thời hướng dẫn và sửa lỗi cho người học.
Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "hanzi": "Câu trả lời bằng chữ Hán giản thể",
  "pinyin": "Pinyin có dấu thanh điệu chuẩn xác",
  "meaning": "Bản dịch tiếng Việt tự nhiên, chuẩn nghĩa",
  "grammarAnalysis": "Giải thích ngắn gọn 1-2 điểm ngữ pháp",
  "userCorrection": "Nhận xét và gợi ý sửa lỗi diễn đạt",
  "vocabSuggestions": [{ "hanzi": "从", "pinyin": "cóng", "meaning": "Từ...", "level": "HSK 1" }]
}
Chỉ trả về chuỗi JSON thuần túy.`;

              const contents = [
                {
                  role: 'user',
                  parts: [{ text: `${SYSTEM_PROMPT}\nTrình độ học viên: ${hskLevel}` }]
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

              const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
              const gRes = await fetch(url, {
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

              if (!gRes.ok) {
                const errData = await gRes.json().catch(() => ({}));
                res.statusCode = gRes.status;
                res.end(JSON.stringify({ error: errData?.error?.message || 'Gemini error' }));
                return;
              }

              const data = await gRes.json();
              const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              res.statusCode = 200;
              res.end(rawText || '{}');
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    localAiTutorDevPlugin()
  ],
})
