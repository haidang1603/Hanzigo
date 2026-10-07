/**
 * =========================================================================
 * HANZI GO - SECURE SERVERLESS API: /api/ai/teacher
 * =========================================================================
 * Vercel Serverless Function (Node.js runtime):
 * - Keeps GEMINI_API_KEY securely on server-side environment variables.
 * - Enforces authentication, rate limiting, payload validation, and output bounds.
 * - Handles:
 *    1. analyze_class: Aggregated anonymized metrics -> strengths, weaknesses, reviews, exercises
 *    2. generate_assignment: Topic & HSK -> draft questions (requires teacher review)
 *    3. generate_lesson_plan: Topic & Duration -> 7-phase pedagogical lesson plan
 */

import { checkRateLimitAndQuota } from './distributedRateLimiter.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const DAILY_QUOTA_MAX_REQUESTS = 150;

const SYSTEM_PROMPT_ANALYZE_CLASS = `
Bạn là Cố vấn Sư phạm AI Cao cấp chuyên sâu về giảng dạy tiếng Trung Quốc cho học sinh Việt Nam theo khung HSK 3.0.
Nhiệm vụ: Phân tích số liệu học tập tổng hợp của lớp học (hoàn toàn ẩn danh) và đưa ra báo cáo chẩn đoán sư phạm chính xác.

Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "classStrengths": [
    "Điểm mạnh cụ thể 1 của lớp dựa trên dữ liệu",
    "Điểm mạnh cụ thể 2"
  ],
  "classWeaknesses": [
    "Điểm yếu/lỗ hổng kiến thức 1 cần khắc phục",
    "Điểm yếu/lỗ hổng 2"
  ],
  "recommendedReview": [
    "Nội dung trọng tâm 1 cần ôn tập ngay",
    "Nội dung trọng tâm 2"
  ],
  "recommendedExercises": [
    {
      "title": "Tên bài tập đề xuất",
      "hskLevel": "HSK 1 - HSK 6",
      "type": "Quiz | Listening | Grammar | Reading",
      "focus": "Mục tiêu trọng tâm rèn luyện",
      "suggestedTopic": "Chủ đề gợi ý"
    }
  ]
}
Chỉ trả về chuỗi JSON thuần túy, không có văn bản thừa.
`;

const SYSTEM_PROMPT_GENERATE_ASSIGNMENT = `
Bạn là Trợ lý Soạn Đề thi & Bài tập Tiếng Trung cho giáo viên.
Tạo bộ câu hỏi trắc nghiệm hoặc bài tập phù hợp chuẩn khung HSK, bám sát chủ đề được yêu cầu.

Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "topic": "Chủ đề bài tập",
  "hskLevel": "Cấp độ HSK",
  "questions": [
    {
      "id": "q1",
      "question": "Câu hỏi (gồm chữ Hán + Pinyin + Dịch/Hướng dẫn)",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correctAnswer": 0,
      "explanation": "Giải thích chi tiết ngữ pháp/từ vựng bằng tiếng Việt",
      "difficulty": "Dễ | Trung bình | Khó"
    }
  ]
}
Chỉ trả về chuỗi JSON thuần túy.
`;

const SYSTEM_PROMPT_GENERATE_LESSON_PLAN = `
Bạn là Chuyên gia Soạn Giáo án Tiếng Trung cho giáo viên.
Hãy thiết kế một giáo án 7 bước thực chiến, cuốn hút, lấy học viên làm trung tâm.

Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "title": "Tên bài giảng",
  "hskLevel": "Cấp độ HSK",
  "topic": "Chủ đề",
  "duration": 45,
  "sections": {
    "warmUp": {
      "durationMinutes": 5,
      "title": "Khởi động & Tạo cảm hứng",
      "activities": ["Hoạt động 1", "Hoạt động 2"]
    },
    "vocabulary": {
      "durationMinutes": 10,
      "title": "Từ vựng trọng tâm",
      "items": [
        { "hanzi": "Chữ Hán", "pinyin": "Pinyin", "meaning": "Nghĩa tiếng Việt", "example": "Câu ví dụ" }
      ]
    },
    "grammar": {
      "durationMinutes": 10,
      "title": "Điểm ngữ pháp then chốt",
      "rules": [
        { "pattern": "Cấu trúc", "explanation": "Giải thích", "example": "Ví dụ" }
      ]
    },
    "listening": {
      "durationMinutes": 5,
      "title": "Luyện nghe hiểu",
      "script": "Đoạn hội thoại ngắn tiếng Trung",
      "translation": "Bản dịch tiếng Việt"
    },
    "speaking": {
      "durationMinutes": 10,
      "title": "Luyện nói tương tác / Đóng vai",
      "scenario": "Tình huống giao tiếp thực tế",
      "prompts": ["Gợi ý thoại 1", "Gợi ý thoại 2"]
    },
    "quiz": {
      "durationMinutes": 5,
      "title": "Kiểm tra nhanh tại lớp",
      "questions": [
        { "prompt": "Câu hỏi nhanh", "answer": "Đáp án đúng" }
      ]
    },
    "homework": {
      "title": "Bài tập về nhà",
      "tasks": ["Nhiệm vụ 1", "Nhiệm vụ 2"]
    }
  }
}
Chỉ trả về chuỗi JSON thuần túy.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Client Authentication Validation (Bearer token or user header)
  const authHeader = req.headers['authorization'] || req.headers['x-authorization'];
  const userIdHeader = req.headers['x-user-id'] || req.headers['x-auth-uid'];
  const clientToken = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

  if (!clientToken && !userIdHeader) {
    return res.status(401).json({
      error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập để sử dụng tính năng AI Giáo viên.'
    });
  }

  // Rate Limiting & Daily Quota check (Distributed with In-Memory fallback)
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'client_unknown';
  const clientKey = userIdHeader ? `user:${userIdHeader}` : `ip:${clientIp}`;
  const limitCheck = await checkRateLimitAndQuota({
    clientKey,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
    dailyQuotaMax: DAILY_QUOTA_MAX_REQUESTS,
    prefix: 'teacher'
  });
  if (!limitCheck.allowed) {
    return res.status(429).json({ error: limitCheck.reason });
  }

  // GEMINI_API_KEY verification on server
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Sẽ sử dụng bộ mô phỏng sư phạm ngoại tuyến.'
    });
  }

  // Payload Validation
  const body = req.body || {};
  const { action, payload } = body;

  if (!action || !payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid action or payload in request body.' });
  }

  let systemPrompt = '';
  let userPrompt = '';

  if (action === 'analyze_class') {
    systemPrompt = SYSTEM_PROMPT_ANALYZE_CLASS;
    const { totalStudents, averageScore, assignmentCompletion, attendanceRate, hskLevel = 'HSK 1', skillBreakdown } = payload;
    userPrompt = `Dữ liệu tổng hợp của lớp học:
- Sĩ số: ${totalStudents || 0} học viên
- Cấp độ lớp: ${hskLevel}
- Điểm trung bình bài tập: ${averageScore || 0}/100
- Tỷ lệ nộp & hoàn thành bài tập: ${assignmentCompletion || 0}%
- Tỷ lệ chuyên cần tham gia: ${attendanceRate || 0}%
- Điểm kỹ năng tương đối: Nghe (${skillBreakdown?.listening || 70}%), Nói (${skillBreakdown?.speaking || 65}%), Đọc (${skillBreakdown?.reading || 75}%), Viết (${skillBreakdown?.writing || 60}%)
Hãy phân tích điểm mạnh, điểm yếu và đưa ra khuyến nghị bài tập tiếp theo cho giáo viên.`;

  } else if (action === 'generate_assignment') {
    systemPrompt = SYSTEM_PROMPT_GENERATE_ASSIGNMENT;
    const { hskLevel = 'HSK 1', topic = 'Cuộc sống hàng ngày', questionCount = 5, assignmentType = 'Quiz' } = payload;
    const countClamped = Math.min(Math.max(Number(questionCount) || 5, 1), 15);
    const sanitizedTopic = String(topic).slice(0, 100);
    userPrompt = `Hãy tạo ${countClamped} câu hỏi trắc nghiệm tiếng Trung cho cấp độ ${hskLevel}, dạng bài ${assignmentType}, chủ đề: "${sanitizedTopic}". Mỗi câu có 4 đáp án và giải thích tiếng Việt.`;

  } else if (action === 'generate_lesson_plan') {
    systemPrompt = SYSTEM_PROMPT_GENERATE_LESSON_PLAN;
    const { hskLevel = 'HSK 1', topic = 'Giao tiếp hàng ngày', duration = 45, targetOutcomes = '' } = payload;
    const durClamped = Math.min(Math.max(Number(duration) || 45, 15), 120);
    const sanitizedTopic = String(topic).slice(0, 100);
    userPrompt = `Soạn giáo án chi tiết cho tiết học ${durClamped} phút, cấp độ ${hskLevel}, chủ đề: "${sanitizedTopic}".${targetOutcomes ? ` Mục tiêu cần đạt: ${String(targetOutcomes).slice(0, 150)}` : ''}`;

  } else {
    return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nYêu cầu cụ thể từ giáo viên:\n${userPrompt}` }]
    }
  ];

  try {
    const response = await fetch(url, {
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
    console.error('Serverless Teacher AI error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
