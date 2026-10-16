import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Preload .env into process.env before serverless handlers initialize
const _initialEnv = loadEnv('', process.cwd(), '');
for (const [k, v] of Object.entries(_initialEnv)) {
  if (v && !process.env[k]) {
    process.env[k] = v;
  }
}

import iceServersHandler from './api/_webrtc/ice-servers.js'
import livekitTokenHandler from './api/_webrtc/livekit-token.js'
import personalizeHandler from './api/ai/personalize.js'
import chatHandler from './api/ai/chat.js'
import teacherHandler from './api/ai/teacher.js'
import coachHandler from './api/ai/coach.js'
import tutorHandler from './api/ai/tutor.js'

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
        const env = loadEnv('', process.cwd(), '');
        for (const [key, val] of Object.entries(env)) {
          if (val && !process.env[key]) {
            process.env[key] = val;
          }
        }

        const handleWithMockRes = (handler) => {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(bodyStr || '{}');
            } catch {
              req.body = {};
            }
            res.status = (code) => {
              res.statusCode = code;
              return {
                json: (payload) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(payload));
                }
              };
            };
            try {
              await handler(req, res);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        };

        if (req.url === '/api/ai/personalize' && req.method === 'POST') {
          handleWithMockRes(personalizeHandler);
          return;
        }

        if (req.url === '/api/ai/chat' && req.method === 'POST') {
          handleWithMockRes(chatHandler);
          return;
        }

        if (req.url === '/api/ai/teacher' && req.method === 'POST') {
          handleWithMockRes(teacherHandler);
          return;
        }

        if (req.url === '/api/ai/coach' && req.method === 'POST') {
          handleWithMockRes(coachHandler);
          return;
        }

        if (req.url === '/api/ai/tutor' && req.method === 'POST') {
          handleWithMockRes(tutorHandler);
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

        if (req.url?.startsWith('/api/webrtc/livekit-token')) {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(bodyStr || '{}');
            } catch {
              req.body = {};
            }
            res.status = (code) => {
              res.statusCode = code;
              return {
                json: (payload) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(payload));
                }
              };
            };
            try {
              await livekitTokenHandler(req, res);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/webrtc/ice-servers')) {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(bodyStr || '{}');
            } catch {
              req.body = {};
            }
            res.status = (code) => {
              res.statusCode = code;
              return {
                json: (payload) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(payload));
                }
              };
            };
            try {
              await iceServersHandler(req, res);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
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
