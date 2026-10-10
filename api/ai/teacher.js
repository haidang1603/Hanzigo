/**
 * =========================================================================
 * HANZI GO - SECURE SERVERLESS API: /api/ai/teacher
 * =========================================================================
 * Vercel Serverless Function (Node.js runtime):
 * - Keeps GEMINI_API_KEY securely on server-side environment variables.
 * - Enforces authentication, rate limiting, payload validation, and output bounds.
 * - Enforces Prompt Injection and Abuse Protection.
 * - Sanitizes all error messages (never leaks API keys, database details, or raw stack traces).
 * - Handles:
 *    1. analyze_class: Aggregated anonymized metrics -> strengths, weaknesses, reviews, exercises
 *    2. generate_assignment: Topic & HSK -> draft questions (requires teacher review)
 *    3. generate_lesson_plan: Topic & Duration -> 7-phase pedagogical lesson plan
 */

import { checkRateLimitAndQuota } from '../_utils/distributedRateLimiter.js';
import { verifyRequestAuth } from '../_utils/supabaseServer.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const DAILY_QUOTA_MAX_REQUESTS = 150;

// Prompt injection & abuse detection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts)/i,
  /system\s+prompt\s+override/i,
  /you\s+are\s+now\s+(an\s+unrestricted|DAN|jailbreak)/i,
  /reveal\s+(your\s+)?(api[_\s]?key|secret|system\s+prompt)/i,
  /drop\s+table\s+/i,
  /<script\b[^>]*>/i
];

function detectAbuseOrInjection(text) {
  if (!text || typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

const SYSTEM_PROMPT_ANALYZE_CLASS = `
Bạn là Cố vấn Sư phạm AI Cao cấp chuyên sâu về giảng dạy tiếng Trung Quốc cho học sinh Việt Nam theo khung HSK 3.0.
Nhiệm vụ: Phân tích số liệu học tập tổng hợp của lớp học (hoàn toàn ẩn danh, không có PII) và đưa ra báo cáo chẩn đoán sư phạm chính xác.

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
  "recommendedTeachingTopics": [
    "Chủ đề giảng dạy/ôn tập trọng tâm 1",
    "Chủ đề giảng dạy/ôn tập trọng tâm 2"
  ],
  "recommendedReview": [
    "Nội dung ôn tập 1",
    "Nội dung ôn tập 2"
  ],
  "studentsNeedingAttention": [
    "Mô tả nhóm học viên cần lưu ý 1 (dựa trên số liệu tổng hợp, không nêu tên)",
    "Mô tả nhóm học viên cần lưu ý 2"
  ],
  "suggestedActivities": [
    {
      "title": "Tên hoạt động đề xuất",
      "hskLevel": "HSK 1 - HSK 6",
      "type": "Quiz | Listening | Grammar | Reading | Speaking",
      "focus": "Mục tiêu trọng tâm rèn luyện",
      "suggestedTopic": "Chủ đề gợi ý"
    }
  ],
  "recommendedExercises": [
    {
      "title": "Tên bài tập đề xuất",
      "hskLevel": "HSK 1 - HSK 6",
      "type": "Quiz | Listening | Grammar | Reading",
      "focus": "Mục tiêu trọng tâm",
      "suggestedTopic": "Chủ đề gợi ý"
    }
  ]
}
Chỉ trả về chuỗi JSON thuần túy, không có văn bản thừa.
`;

const SYSTEM_PROMPT_GENERATE_ASSIGNMENT = `
Bạn là Trợ lý Soạn Đề thi & Bài tập Tiếng Trung cho giáo viên.
Tạo bộ câu hỏi đa kỹ năng bao gồm đủ 5 kỹ năng: Vocabulary, Grammar, Listening, Reading, Speaking bám sát chủ đề và chuẩn khung HSK.
Chú ý: Bộ đề do AI soạn là bản nháp chờ giáo viên duyệt (DRAFT_REQUIRES_TEACHER_REVIEW), không được tự động xuất bản (published: false).

Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "title": "Tiêu đề bài tập",
  "topic": "Chủ đề bài tập",
  "hskLevel": "Cấp độ HSK",
  "skillsCovered": ["Vocabulary", "Grammar", "Listening", "Reading", "Speaking"],
  "status": "DRAFT_REQUIRES_TEACHER_REVIEW",
  "published": false,
  "reviewedByTeacher": false,
  "questions": [
    {
      "id": "q1",
      "skill": "Vocabulary | Grammar | Listening | Reading | Speaking",
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
Hãy thiết kế một giáo án chuẩn sư phạm, cuốn hút, bao gồm mục tiêu bài học, từ vựng, ngữ pháp, ví dụ, luyện tập và câu hỏi kiểm tra nhanh.

Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "title": "Tên bài giảng",
  "hskLevel": "Cấp độ HSK",
  "topic": "Chủ đề",
  "duration": 45,
  "learningObjective": [
    "Mục tiêu bài học 1",
    "Mục tiêu bài học 2"
  ],
  "vocabulary": [
    { "hanzi": "Chữ Hán", "pinyin": "Pinyin", "meaning": "Nghĩa tiếng Việt", "example": "Câu ví dụ" }
  ],
  "grammar": [
    { "pattern": "Cấu trúc ngữ pháp", "explanation": "Giải thích", "example": "Ví dụ" }
  ],
  "examples": [
    { "chinese": "Câu tiếng Trung mẫu", "pinyin": "Pinyin", "vietnamese": "Nghĩa tiếng Việt" }
  ],
  "practice": [
    "Hoạt động luyện tập 1",
    "Hoạt động luyện tập 2"
  ],
  "quiz": [
    { "prompt": "Câu hỏi trắc nghiệm nhanh", "answer": "Đáp án đúng" }
  ],
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

  // Client Authentication & JWT Validation
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập để sử dụng tính năng AI Giáo viên.'
    });
  }

  // Rate Limiting & Daily Quota check (bound to verified user ID)
  const clientKey = `user:${auth.user.id}`;
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

  // Payload Validation
  const body = req.body || {};
  const { action, payload } = body;

  if (!action || !payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid action or payload in request body.' });
  }

  // Anti-abuse & Prompt injection protection
  if (payload.topic && detectAbuseOrInjection(String(payload.topic))) {
    return res.status(400).json({
      error: 'Yêu cầu chứa cú pháp không hợp lệ hoặc có dấu hiệu can thiệp hệ thống.'
    });
  }

  if (payload.targetOutcomes && detectAbuseOrInjection(String(payload.targetOutcomes))) {
    return res.status(400).json({
      error: 'Yêu cầu chứa cú pháp không hợp lệ hoặc có dấu hiệu can thiệp hệ thống.'
    });
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

  // GEMINI_API_KEY verification on server
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Sẽ sử dụng bộ mô phỏng sư phạm ngoại tuyến.'
    });
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
          maxOutputTokens: 1000,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API call failed with status:', response.status);
      return res.status(502).json({
        error: 'Dịch vụ AI phản hồi không thành công. Vui lòng thử lại sau.'
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(502).json({ error: 'Không nhận được dữ liệu phản hồi từ AI.' });
    }

    const parsed = JSON.parse(rawText);
    if (action === 'generate_assignment') {
      parsed.status = 'DRAFT_REQUIRES_TEACHER_REVIEW';
      parsed.published = false;
      parsed.reviewedByTeacher = false;
    } else if (action === 'generate_lesson_plan') {
      parsed.status = 'DRAFT_REQUIRES_TEACHER_REVIEW';
      parsed.published = false;
    }
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Serverless Teacher AI error:', err.message);
    return res.status(500).json({ error: 'Đã xảy ra lỗi nội bộ khi xử lý yêu cầu AI Giáo viên.' });
  }
}
