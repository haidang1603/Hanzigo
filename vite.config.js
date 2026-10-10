import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// In-memory shared registry for local dev classroom sync across browsers/tabs
const sharedDevClassrooms = [
  {
    id: 'cls-hsk1-foundation',
    teacher_id: 'user_teacher_demo',
    teacher_name: 'Giáo viên HanziGo',
    name: 'HSK 1 - Nhập môn Giao tiếp & Phát âm',
    description: 'Lớp học nền tảng dành cho người mới bắt đầu. Tập trung phát âm chuẩn Pinyin và 150 từ vựng cốt lõi.',
    hsk_level: 'HSK 1',
    class_code: 'HZG-7K2P9',
    max_students: 30,
    status: 'active',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cls-hsk2-intermediate',
    teacher_id: 'user_teacher_demo',
    teacher_name: 'Giáo viên HanziGo',
    name: 'HSK 2 - Tăng tốc Hội thoại Hằng ngày',
    description: 'Mở rộng 300 từ vựng và cấu trúc ngữ pháp thông dụng trong sinh hoạt và công việc.',
    hsk_level: 'HSK 2',
    class_code: 'HZG-9M4X2',
    max_students: 25,
    status: 'active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sharedDevMembers = [
  {
    id: 'mem-default-student',
    classroom_id: 'cls-hsk1-foundation',
    student_id: 'user_guest',
    student_name: 'Học viên HanziGo',
    hsk_level: 'HSK 1',
    joined_at: new Date().toISOString(),
    status: 'active'
  }
];

const sharedDevLiveParticipants = [];
const sharedDevLiveSessions = [];

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
              const isTeacher = String(userId).includes('teacher') || (body.role === 'teacher' && !String(userId).includes('student'));
              const verifiedRole = isTeacher ? 'teacher' : 'student';
              const canPublish = isTeacher ? true : Boolean(body.canPublish && body.isMicAllowed);
              const roomName = body.roomName || body.sessionId || 'hanzigo-room';

              const { AccessToken } = await import('livekit-server-sdk');
              const at = new AccessToken(apiKey, apiSecret, {
                identity: String(userId),
                name: String(userName),
                metadata: JSON.stringify({ role: verifiedRole, userId }),
                ttl: '2h'
              });

              at.addGrant({
                room: String(roomName),
                roomJoin: true,
                canPublish: canPublish,
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
        if (req.url === '/api/classroom/list') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, classrooms: sharedDevClassrooms }));
          return;
        }

        if (req.url?.startsWith('/api/classroom/lookup')) {
          res.setHeader('Content-Type', 'application/json');
          const urlObj = new URL(req.url, 'http://localhost');
          const code = (urlObj.searchParams.get('code') || '').trim().toUpperCase().replace(/\s+/g, '');
          const withoutPrefix = code.replace(/^HZG-?/, '');
          const withPrefix = withoutPrefix ? `HZG-${withoutPrefix}` : '';

          const found = sharedDevClassrooms.find(c => {
            const cCode = String(c.class_code || '').trim().toUpperCase().replace(/\s+/g, '');
            const cWithout = cCode.replace(/^HZG-?/, '');
            const cWith = cWithout ? `HZG-${cWithout}` : '';
            return code === cCode || code === cWith || withoutPrefix === cWithout || withPrefix === cCode;
          });

          if (found) {
            const studentCount = sharedDevMembers.filter(m => m.classroom_id === found.id && m.status === 'active').length;
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              classroom: {
                ...found,
                student_count: Math.max(found.student_count || 0, studentCount)
              }
            }));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, error: 'Không tìm thấy lớp học' }));
          }
          return;
        }

        if (req.url === '/api/classroom/create' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              if (body.class_code) {
                const existingIdx = sharedDevClassrooms.findIndex(c => c.class_code === body.class_code || c.id === body.id);
                if (existingIdx >= 0) {
                  sharedDevClassrooms[existingIdx] = { ...sharedDevClassrooms[existingIdx], ...body };
                } else {
                  sharedDevClassrooms.unshift(body);
                }
              }
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, classroom: body }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/classroom/members')) {
          res.setHeader('Content-Type', 'application/json');
          const urlObj = new URL(req.url, 'http://localhost');
          const targetClassId = urlObj.searchParams.get('classroomId');
          const members = targetClassId 
            ? sharedDevMembers.filter(m => (m.classroom_id === targetClassId || String(m.classroom_id) === String(targetClassId)) && m.status !== 'removed')
            : sharedDevMembers.filter(m => m.status !== 'removed');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, members }));
          return;
        }

        if (req.url === '/api/classroom/join' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              if (body.student && body.classroom_id) {
                const targetCId = body.classroom_id;
                const studentId = body.student.student_id || body.student.id || `stu-${Date.now()}`;
                const memberRecord = {
                  ...body.student,
                  classroom_id: targetCId,
                  student_id: studentId,
                  status: 'active'
                };

                const existingIdx = sharedDevMembers.findIndex(m => 
                  (m.classroom_id === targetCId || String(m.classroom_id) === String(targetCId)) && 
                  (m.student_id === studentId || m.id === studentId)
                );
                if (existingIdx >= 0) {
                  sharedDevMembers[existingIdx] = { ...sharedDevMembers[existingIdx], ...memberRecord };
                } else {
                  sharedDevMembers.unshift(memberRecord);
                }

                // Update dynamic student_count in matching classroom
                const classIdx = sharedDevClassrooms.findIndex(c => c.id === targetCId || c.class_code === body.class_code);
                if (classIdx >= 0) {
                  const count = sharedDevMembers.filter(m => (m.classroom_id === targetCId || String(m.classroom_id) === String(targetCId)) && m.status === 'active').length;
                  sharedDevClassrooms[classIdx].student_count = Math.max(sharedDevClassrooms[classIdx].student_count || 0, count);
                }
              }
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Tham gia lớp thành công' }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/classroom/remove' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { classroom_id, student_id } = body;
              if (classroom_id && student_id) {
                const idx = sharedDevMembers.findIndex(m => 
                  (m.classroom_id === classroom_id || String(m.classroom_id) === String(classroom_id)) && 
                  (m.student_id === student_id || m.id === student_id)
                );
                if (idx >= 0) {
                  sharedDevMembers[idx].status = 'removed';
                }
              }
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // Shared dev Live Classroom endpoints (enables live attendance & participant list sync across windows)
        if (req.url === '/api/live/join' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              if (body.participant && body.session_id) {
                const sId = body.session_id;
                const uId = body.participant.user_id;
                const existingIdx = sharedDevLiveParticipants.findIndex(p => 
                  (p.session_id === sId || String(p.session_id) === String(sId)) && 
                  p.user_id === uId
                );
                const record = { ...body.participant, session_id: sId, left_at: null };
                if (existingIdx >= 0) {
                  sharedDevLiveParticipants[existingIdx] = { ...sharedDevLiveParticipants[existingIdx], ...record };
                } else {
                  sharedDevLiveParticipants.push(record);
                }
              }
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/live/participants')) {
          res.setHeader('Content-Type', 'application/json');
          const urlObj = new URL(req.url, 'http://localhost');
          const sId = urlObj.searchParams.get('sessionId');
          const participants = sId
            ? sharedDevLiveParticipants.filter(p => (p.session_id === sId || String(p.session_id) === String(sId)) && !p.left_at)
            : sharedDevLiveParticipants.filter(p => !p.left_at);
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, participants }));
          return;
        }

        if (req.url === '/api/live/leave' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              if (body.sessionId && body.userId) {
                const p = sharedDevLiveParticipants.find(x => 
                  (x.session_id === body.sessionId || String(x.session_id) === String(body.sessionId)) && 
                  x.user_id === body.userId
                );
                if (p) p.left_at = new Date().toISOString();
              }
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/live/session') && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          const urlObj = new URL(req.url, 'http://localhost');
          const targetCId = urlObj.searchParams.get('classroomId');
          const targetSId = urlObj.searchParams.get('sessionId');

          if (targetSId) {
            const found = sharedDevLiveSessions.find(s => s.id === targetSId || String(s.id) === String(targetSId));
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, session: found || null }));
            return;
          }

          if (targetCId) {
            const activeSes = sharedDevLiveSessions.find(s => 
              (s.classroom_id === targetCId || String(s.classroom_id) === String(targetCId)) && 
              s.status === 'live'
            );
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, session: activeSes || null }));
            return;
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, session: null }));
          return;
        }

        if (req.url === '/api/live/session' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const session = body?.session || body;
              if (session && session.classroom_id) {
                const sId = session.id || `ses-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
                const record = {
                  ...session,
                  id: sId,
                  status: session.status || 'live',
                  started_at: session.started_at || new Date().toISOString(),
                  created_at: session.created_at || new Date().toISOString()
                };

                // Close previous live sessions for this classroom
                if (record.status === 'live') {
                  sharedDevLiveSessions.forEach(s => {
                    if ((s.classroom_id === record.classroom_id || String(s.classroom_id) === String(record.classroom_id)) && s.status === 'live') {
                      s.status = 'ended';
                      s.ended_at = new Date().toISOString();
                    }
                  });
                }

                const existingIdx = sharedDevLiveSessions.findIndex(s => s.id === sId || String(s.id) === String(sId));
                if (existingIdx >= 0) {
                  sharedDevLiveSessions[existingIdx] = { ...sharedDevLiveSessions[existingIdx], ...record };
                } else {
                  sharedDevLiveSessions.unshift(record);
                }

                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, session: record }));
                return;
              }
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Thiếu dữ liệu session.' }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/live/end' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { sessionId, endedAt } = body;
              const closeTime = endedAt || new Date().toISOString();
              if (sessionId) {
                sharedDevLiveParticipants.forEach(p => {
                  if (p.session_id === sessionId || String(p.session_id) === String(sessionId)) {
                    if (!p.left_at) p.left_at = closeTime;
                  }
                });
                sharedDevLiveSessions.forEach(s => {
                  if (s.id === sessionId || String(s.id) === String(sessionId)) {
                    s.status = 'ended';
                    s.ended_at = closeTime;
                  }
                });
              }
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, endedAt: closeTime }));
            } catch {
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
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
