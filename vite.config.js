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
              // 1. Auth validation
              const authHeader = req.headers['authorization'] || req.headers['x-authorization'];
              const userIdHeader = req.headers['x-user-id'] || req.headers['x-auth-uid'];
              if (!authHeader && !userIdHeader) {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' }));
                return;
              }

              let body;
              try {
                body = JSON.parse(bodyStr || '{}');
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Dữ liệu JSON không hợp lệ.' }));
                return;
              }
              const { userText, hskLevel = 'HSK 1', conversationHistory = [] } = body;

              if (!userText || typeof userText !== 'string' || !userText.trim()) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Nội dung tin nhắn không được để trống.' }));
                return;
              }

              const cleanText = userText.trim();
              if (cleanText.length > 500) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Độ dài tin nhắn vượt quá giới hạn (tối đa 500 ký tự).' }));
                return;
              }

              // Prompt injection / abuse check
              const isAbusive = /ignore\s+(all\s+)?(previous|prior)\s+instructions|system\s+prompt\s+override|drop\s+table/i.test(cleanText);
              if (isAbusive) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Nội dung chứa cú pháp không hợp lệ.' }));
                return;
              }

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
                  parts: [{ text: String(msg.hanzi || msg.text || '').slice(0, 300) }]
                })),
                {
                  role: 'user',
                  parts: [{ text: `Câu người học vừa nói: "${cleanText}"` }]
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
                res.statusCode = 502;
                res.end(JSON.stringify({ error: 'Dịch vụ AI phản hồi không thành công. Vui lòng thử lại sau.' }));
                return;
              }

              const data = await gRes.json();
              const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              res.statusCode = 200;
              res.end(rawText || '{}');
            } catch (err) {
              console.error('Local dev chat error:', err.message);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Đã xảy ra lỗi nội bộ khi xử lý hội thoại AI.' }));
            }
          });
          return;
        }

        if (req.url === '/api/ai/teacher' && req.method === 'POST') {
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
              // Auth validation
              const authHeader = req.headers['authorization'] || req.headers['x-authorization'];
              const userIdHeader = req.headers['x-user-id'] || req.headers['x-auth-uid'];
              if (!authHeader && !userIdHeader) {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' }));
                return;
              }

              let body;
              try {
                body = JSON.parse(bodyStr || '{}');
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Dữ liệu JSON không hợp lệ.' }));
                return;
              }
              const { action, payload } = body;

              if (!action || !payload) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing action or payload' }));
                return;
              }

              let systemPrompt = '';
              let userPrompt = '';

              if (action === 'analyze_class') {
                systemPrompt = 'Bạn là Cố vấn Sư phạm AI Cao cấp chuyên sâu về giảng dạy tiếng Trung Quốc cho học sinh Việt Nam theo khung HSK 3.0. Phân tích số liệu học tập tổng hợp của lớp học (hoàn toàn ẩn danh) và đưa ra báo cáo chẩn đoán sư phạm. BẮT BUỘC định dạng JSON: { "classStrengths": [...], "classWeaknesses": [...], "recommendedReview": [...], "recommendedExercises": [{ "title": "...", "hskLevel": "...", "type": "Quiz", "focus": "...", "suggestedTopic": "..." }] }';
                const { totalStudents, averageScore, assignmentCompletion, attendanceRate, hskLevel = 'HSK 1', skillBreakdown } = payload;
                userPrompt = `Dữ liệu lớp học: Sĩ số ${totalStudents || 0}, cấp độ ${hskLevel}, điểm TB ${averageScore || 0}/100, hoàn thành bài tập ${assignmentCompletion || 0}%, chuyên cần ${attendanceRate || 0}%. Điểm kỹ năng: Nghe ${skillBreakdown?.listening || 70}%, Nói ${skillBreakdown?.speaking || 65}%, Đọc ${skillBreakdown?.reading || 75}%, Viết ${skillBreakdown?.writing || 60}%. Hãy phân tích điểm mạnh, điểm yếu và đề xuất bài tập tiếp theo.`;
              } else if (action === 'generate_assignment') {
                systemPrompt = 'Bạn là Trợ lý Soạn Đề thi & Bài tập Tiếng Trung cho giáo viên. Tạo bộ câu hỏi trắc nghiệm tiếng Trung theo chuẩn HSK. BẮT BUỘC định dạng JSON: { "topic": "...", "hskLevel": "...", "questions": [{ "id": "q1", "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "...", "difficulty": "Trung bình" }] }';
                const { hskLevel = 'HSK 1', topic = 'Cuộc sống', questionCount = 5, assignmentType = 'Quiz' } = payload;
                userPrompt = `Tạo ${Math.min(Math.max(Number(questionCount) || 5, 1), 15)} câu hỏi dạng ${assignmentType} cấp độ ${hskLevel}, chủ đề "${String(topic).slice(0, 80)}".`;
              } else if (action === 'generate_lesson_plan') {
                systemPrompt = 'Bạn là Chuyên gia Soạn Giáo án Tiếng Trung cho giáo viên. Soạn giáo án 7 bước thực chiến. BẮT BUỘC định dạng JSON: { "title": "...", "hskLevel": "...", "topic": "...", "duration": 45, "sections": { "warmUp": { "durationMinutes": 5, "title": "Khởi động", "activities": [...] }, "vocabulary": { "durationMinutes": 10, "title": "Từ vựng", "items": [{ "hanzi": "...", "pinyin": "...", "meaning": "...", "example": "..." }] }, "grammar": { "durationMinutes": 10, "title": "Ngữ pháp", "rules": [{ "pattern": "...", "explanation": "...", "example": "..." }] }, "listening": { "durationMinutes": 5, "title": "Nghe hiểu", "script": "...", "translation": "..." }, "speaking": { "durationMinutes": 10, "title": "Nói", "scenario": "...", "prompts": [...] }, "quiz": { "durationMinutes": 5, "title": "Quiz nhanh", "questions": [{ "prompt": "...", "answer": "..." }] }, "homework": { "title": "Bài tập về nhà", "tasks": [...] } } }';
                const { hskLevel = 'HSK 1', topic = 'Giao tiếp', duration = 45, targetOutcomes = '' } = payload;
                userPrompt = `Soạn giáo án ${duration} phút cho lớp ${hskLevel}, chủ đề "${String(topic).slice(0, 80)}"${targetOutcomes ? `, mục tiêu: ${targetOutcomes}` : ''}.`;
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: `Unknown action: ${action}` }));
                return;
              }

              const contents = [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nYêu cầu cụ thể từ giáo viên:\n${userPrompt}` }]
                }
              ];

              const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
              const gRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents,
                  generationConfig: {
                    temperature: 0.6,
                    responseMimeType: 'application/json'
                  }
                })
              });

              if (!gRes.ok) {
                res.statusCode = 502;
                res.end(JSON.stringify({ error: 'Dịch vụ AI phản hồi không thành công. Vui lòng thử lại sau.' }));
                return;
              }

              const data = await gRes.json();
              const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              res.statusCode = 200;
              res.end(rawText || '{}');
            } catch (err) {
              console.error('Local dev teacher error:', err.message);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Đã xảy ra lỗi nội bộ khi xử lý yêu cầu AI Giáo viên.' }));
            }
          });
          return;
        }

        if (req.url === '/api/ai/coach' && req.method === 'POST') {
          const env = loadEnv('', process.cwd(), '');
          const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

          res.setHeader('Content-Type', 'application/json');

          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              // Auth validation
              const authHeader = req.headers['authorization'] || req.headers['x-authorization'];
              const userIdHeader = req.headers['x-user-id'] || req.headers['x-auth-uid'];
              if (!authHeader && !userIdHeader) {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' }));
                return;
              }

              let body;
              try {
                body = JSON.parse(bodyStr || '{}');
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Dữ liệu JSON không hợp lệ.' }));
                return;
              }

              const { action, payload } = body;
              if (!action || !payload || typeof payload !== 'object') {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing action or payload in request body.' }));
                return;
              }

              if (payload.password || payload.token) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Payload must not contain credentials.' }));
                return;
              }

              const payloadStr = JSON.stringify(payload);
              const isAbusive = /ignore\s+(all\s+)?(previous|prior)\s+instructions|system\s+prompt\s+override|drop\s+table/i.test(payloadStr);
              if (isAbusive) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Nội dung chứa cú pháp không hợp lệ.' }));
                return;
              }

              if (!apiKey) {
                res.statusCode = 503;
                res.end(JSON.stringify({
                  error: 'GEMINI_API_KEY is not configured in local environment.'
                }));
                return;
              }

              const SYSTEM_PROMPT_COACH = `Bạn là Lão Sư HanziGo — Cố vấn Học tập AI Sư phạm cho người Việt học tiếng Trung HSK 3.0. BẮT BUỘC trả về JSON với các trường: summary, weaknesses, recommendedLessons, dailyPlan, reasoning.`;
              const userPrompt = `Phân tích hồ sơ: HSK ${payload.hskLevel || 'HSK 1'}, streak ${payload.streak || 0}, srsDue ${payload.srsDueCount || 0}. Tạo kế hoạch học ${payload.durationMinutes || 15} phút.`;

              const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
              const gRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT_COACH}\n${userPrompt}` }] }],
                  generationConfig: { temperature: 0.6, maxOutputTokens: 1200, responseMimeType: 'application/json' }
                })
              });

              if (!gRes.ok) {
                res.statusCode = 502;
                res.end(JSON.stringify({ error: 'Dịch vụ AI phản hồi không thành công.' }));
                return;
              }

              const data = await gRes.json();
              const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              res.statusCode = 200;
              res.end(rawText || '{}');
            } catch (err) {
              console.error('Local dev coach error:', err.message);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Lỗi nội bộ máy chủ khi xử lý AI Coach.' }));
            }
          });
          return;
        }

        if (req.url === '/api/webrtc/ice-servers') {
          res.setHeader('Content-Type', 'application/json');
          const authHeader = req.headers['authorization'] || req.headers['x-authorization'];
          const userIdHeader = req.headers['x-user-id'] || req.headers['x-auth-uid'];
          if (!authHeader && !userIdHeader) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' }));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify({
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' }
            ],
            ttl: 86400,
            type: 'stun_only'
          }));
          return;
        }

        if (req.url === '/api/webrtc/livekit-token' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          const authHeader = req.headers['authorization'] || req.headers['x-authorization'];
          const userIdHeader = req.headers['x-user-id'] || req.headers['x-auth-uid'];
          if (!authHeader && !userIdHeader) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' }));
            return;
          }

          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              let body = {};
              try {
                body = JSON.parse(bodyStr || '{}');
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'JSON không hợp lệ.' }));
                return;
              }

              const env = loadEnv('', process.cwd(), '');
              const livekitUrl = env.VITE_LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || env.LIVEKIT_URL || process.env.LIVEKIT_URL || '';
              const apiKey = env.LIVEKIT_API_KEY || process.env.LIVEKIT_API_KEY || 'devkey';
              const apiSecret = env.LIVEKIT_API_SECRET || process.env.LIVEKIT_API_SECRET || 'secret';

              const userId = body.userId || userIdHeader || 'user-1';
              const userName = body.userName || 'Người dùng HanziGo';
              const role = body.role === 'teacher' ? 'teacher' : 'student';
              const roomName = body.roomName || body.sessionId || 'hanzigo-room';

              const { AccessToken } = await import('livekit-server-sdk');
              const at = new AccessToken(apiKey, apiSecret, {
                identity: String(userId),
                name: String(userName),
                metadata: JSON.stringify({ role, userId }),
                ttl: '2h'
              });

              at.addGrant({
                room: String(roomName),
                roomJoin: true,
                canPublish: role === 'teacher' || Boolean(body.canPublish),
                canPublishData: true,
                canSubscribe: true
              });

              const token = await at.toJwt();
              res.statusCode = 200;
              res.end(JSON.stringify({
                token,
                serverUrl: livekitUrl,
                isConfigured: Boolean(livekitUrl),
                role,
                roomName
              }));
            } catch (err) {
              console.error('Vite dev LiveKit token error:', err.message);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Lỗi tạo token LiveKit: ' + err.message }));
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-confetti';
            }
            return 'vendor-deps';
          }
          if (id.includes('curriculumLessons')) {
            return 'data-curriculum';
          }
          if (id.includes('chineseData')) {
            return 'data-chinese';
          }
          if (id.includes('learningPathData')) {
            return 'data-learning-path';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
