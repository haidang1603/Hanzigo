/**
 * Production Serverless Endpoint: /api/ai/coach
 * Dedicated AI Learning Coach for HanziGo learners.
 * Features:
 * - Client authentication verification (Bearer Token or user header)
 * - Distributed Rate Limiting via Upstash Redis REST
 * - Anti-abuse & Prompt injection protection
 * - Gemini 1.5 Flash structured JSON output
 * - Sanitized response (no API keys, database internals, or stack traces leaked)
 */

import { checkRateLimitAndQuota } from './distributedRateLimiter.js';
import { verifyRequestAuth } from './verifyAuth.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const DAILY_QUOTA_MAX_REQUESTS = 80;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt\s+override/i,
  /dan\s+mode/i,
  /jailbreak/i,
  /reveal\s+(system\s+prompt|instructions|api\s+key|token)/i,
  /bypass\s+security/i,
  /drop\s+table/i
];

function detectAbuseOrInjection(input) {
  if (typeof input !== 'string') return false;
  return INJECTION_PATTERNS.some(regex => regex.test(input));
}

const SYSTEM_PROMPT_COACH = `Bạn là "Lão Sư HanziGo" — Cố vấn Học tập AI Sư phạm (Pedagogical Learning Coach) chuyên biệt cho người Việt học tiếng Trung theo chuẩn HSK 3.0.
Nhiệm vụ của bạn là phân tích dữ liệu học tập thực tế của học viên, chỉ ra điểm mạnh, điểm yếu, đề xuất bài học tiếp theo, bài cần ôn lại, tài liệu phù hợp từ Materials và lập Kế hoạch học tập Hôm nay (Today's Learning Plan) cá nhân hóa, khả thi và truyền cảm hứng.
Tuyệt đối không giả lập điểm số hoặc tuyên bố thành thạo nếu chưa có số liệu chứng minh.

BẮT BUỘC trả về định dạng JSON thuần túy (không bọc trong markdown codeblock nếu không cần, hoặc đúng cú pháp JSON) với các khóa sau:
{
  "summary": "Lời khuyên sư phạm ngắn gọn (2-3 câu), ấm áp, súc tích và khích lệ học viên bằng tiếng Việt gắn với mục tiêu và thời lượng học của họ.",
  "weaknesses": [
    {
      "id": "wk-1",
      "skill": "pronunciation | vocabulary | listening | grammar | writing | speaking | inactivity | placement",
      "severity": "high | medium | low",
      "label": "Tên điểm yếu ngắn gọn",
      "detail": "Giải thích lý do cần cải thiện dựa trên số liệu thực",
      "suggestedAction": "Hành động khắc phục cụ thể",
      "targetRoute": "vocabulary | pronunciation | conversation | writing | roadmap | materials"
    }
  ],
  "recommendedNextLesson": {
    "lessonId": "mã_bài_học",
    "title": "Tên bài học tiếp theo",
    "reason": "Lý do sư phạm cụ thể vì sao bài học này là bước tiếp theo tối ưu"
  },
  "recommendedReviewLessons": [
    {
      "lessonId": "mã_bài_ôn",
      "title": "Tên bài cần ôn lại",
      "score": 75,
      "reason": "Lý do vì sao cần ôn lại (ví dụ: điểm trắc nghiệm dưới 90% hoặc đã học lâu)"
    }
  ],
  "recommendedMaterials": [
    {
      "id": "mat-1",
      "title": "Tên tài liệu",
      "category": "Giáo trình chuẩn | Ngữ pháp chuyên sâu | Đề thi HSK | Bộ thủ & Hán tự | Thành ngữ & Giao tiếp | Kỹ năng Nghe & Đọc",
      "reason": "Lý do tài liệu này hỗ trợ điểm yếu hoặc mục tiêu học viên"
    }
  ],
  "recommendedLessons": [
    {
      "id": "mã_bài_học",
      "title": "Tên bài học đề xuất",
      "hskLevel": "HSK 1",
      "priority": "high",
      "rationale": "Lý do bài học này giúp ích cho học viên lúc này"
    }
  ],
  "dailyPlan": [
    {
      "id": "plan-1",
      "type": "srs | pronunciation | listening | grammar | lesson | review_lesson | speaking | writing | materials | placement",
      "title": "Tiêu đề nhiệm vụ rõ ràng",
      "subtitle": "Mô tả ngắn nhiệm vụ",
      "durationMinutes": 4,
      "route": "vocabulary | pronunciation | conversation | writing | roadmap | materials",
      "targetRef": "tham chiếu mục tiêu",
      "reason": "Lý do vì sao nhiệm vụ này được phân bổ cho hôm nay",
      "completed": false
    }
  ],
  "reasoning": [
    "Giải thích ngắn 1: Căn cứ vào số liệu nào để ra kế hoạch này...",
    "Giải thích ngắn 2: ..."
  ]
}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Client Authentication & JWT Validation
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập để sử dụng AI Learning Coach.'
    });
  }

  // 2. Rate Limiting & Daily Quota (bound to verified user ID)
  const clientKey = `user:${auth.user.id}`;
  const limitCheck = await checkRateLimitAndQuota({
    clientKey,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
    dailyQuotaMax: DAILY_QUOTA_MAX_REQUESTS,
    prefix: 'coach'
  });
  if (!limitCheck.allowed) {
    return res.status(429).json({ error: limitCheck.reason });
  }

  // 3. Payload Validation
  const body = req.body || {};
  const { action, payload } = body;

  if (!action || !payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid action or payload in request body.' });
  }

  // Privacy Check: Ensure no password, credentials, or private tokens in payload
  if (payload.password || payload.token || payload.access_token || payload.refresh_token) {
    return res.status(400).json({ error: 'Payload must not contain credentials or security tokens.' });
  }

  // Anti-abuse & Prompt injection protection
  const payloadString = JSON.stringify(payload);
  if (payloadString.length > 5000) {
    return res.status(400).json({ error: 'Dữ liệu phân tích vượt quá giới hạn cho phép.' });
  }

  if (detectAbuseOrInjection(payloadString)) {
    return res.status(400).json({
      error: 'Yêu cầu chứa cú pháp không hợp lệ hoặc có dấu hiệu can thiệp hệ thống.'
    });
  }

  // 4. Server API Key verification
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Sẽ sử dụng bộ cố vấn sư phạm ngoại tuyến.'
    });
  }

  // 5. Construct Prompts
  const { 
    hskLevel = 'HSK 1', 
    learningGoal = 'general_foundation',
    streak = 0, 
    daysInactive = 0, 
    studyMinutes = 0, 
    completedLessonsCount = 0, 
    activeLessonId = 'l-101', 
    nextLesson = null,
    reviewLessonsCount = 0,
    srsDueCount = 0, 
    hasSparseData = false,
    skills = {}, 
    weaknesses = [],
    weakVocabHanzi = [],
    durationMinutes = 15 
  } = payload;

  const userPrompt = `Dữ liệu hồ sơ học viên:
- Trình độ hiện tại: ${hskLevel}
- Mục tiêu học tập ưu tiên: ${learningGoal}
- Chuỗi ngày học liên tục (Streak): ${streak} ngày
- Số ngày tạm dừng học: ${daysInactive} ngày
- Tổng thời gian đã học: ${studyMinutes} phút
- Số bài học đã hoàn thành: ${completedLessonsCount}/60 bài (Bài học tiếp theo: ${nextLesson?.title || activeLessonId})
- Số bài cần ôn tập (Điểm < 90% hoặc đã lâu): ${reviewLessonsCount} bài
- Số từ vựng đến hạn cần ôn (SRS Due): ${srsDueCount} từ
- Trạng thái dữ liệu học tập: ${hasSparseData ? 'Học viên mới, chưa có đủ dữ liệu lịch sử' : 'Đã có dữ liệu học tập thực tế'}
- Từ vựng hay quên/cần củng cố: ${weakVocabHanzi.length > 0 ? weakVocabHanzi.join(', ') : 'Chưa có từ nào bị đánh dấu yếu'}
- Đánh giá 7 kỹ năng (Thực tế, không điểm ảo):
  + Từ vựng: ${skills.vocabulary || 'Chưa đủ dữ liệu'}
  + Ngữ pháp: ${skills.grammar || 'Chưa đủ dữ liệu'}
  + Nghe hiểu: ${skills.listening || 'Chưa đủ dữ liệu'}
  + Nói phản xạ: ${skills.speaking || 'Chưa đủ dữ liệu'}
  + Đọc hiểu: ${skills.reading || 'Chưa đủ dữ liệu'}
  + Chữ Hán/Viết: ${skills.writing || 'Chưa đủ dữ liệu'}
  + Phát âm: ${skills.pronunciation || 'Chưa đủ dữ liệu'}
- Các điểm yếu đã phát hiện: ${weaknesses.length > 0 ? weaknesses.map(w => `${w.label} (${w.severity})`).join('; ') : 'Chưa có điểm yếu nghiêm trọng'}
- Thời lượng học mục tiêu hôm nay: ${durationMinutes} phút.

Hãy đóng vai Lão Sư HanziGo, đưa ra phân tích, điểm yếu, đề xuất bài học tiếp theo, bài cần ôn lại, tài liệu từ Materials và tạo kế hoạch học tập chi tiết ${durationMinutes} phút hôm nay theo đúng cấu trúc JSON quy định.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${SYSTEM_PROMPT_COACH}\n\nYêu cầu phân tích học viên:\n${userPrompt}` }]
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
          maxOutputTokens: 1200,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      return res.status(502).json({
        error: 'Dịch vụ AI phản hồi không thành công. Hệ thống sẽ tự động chuyển sang chế độ ngoại tuyến.'
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ error: 'AI không tạo được phản hồi phù hợp.' });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: 'Phản hồi từ AI không đúng chuẩn JSON.' });
    }

    return res.status(200).json(parsedResult);
  } catch (err) {
    console.error('Coach API internal error:', err.message);
    return res.status(500).json({
      error: 'Lỗi máy chủ nội bộ khi xử lý phân tích AI Learning Coach.'
    });
  }
}
