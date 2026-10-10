/**
 * =========================================================================
 * HANZI GO - SECURE SERVERLESS API: /api/ai/chat
 * =========================================================================
 * Production-Hardened Vercel Serverless Function (Node.js runtime):
 * - Keeps GEMINI_API_KEY securely on the server-side environment variables.
 * - Enforces Authentication (Bearer token or verified user header).
 * - Enforces Request Validation & Sanitization.
 * - Caps Maximum Input Length (<= 500 chars) to prevent prompt injection & resource exhaustion.
 * - Enforces Rate Limiting (20 req/min/IP) and Daily Quotas (150 req/day).
 * - Enforces Maximum Output Bounds (maxOutputTokens: 1000).
 * - Implements Abuse & Prompt Injection Protection.
 * - Sanitizes all error messages (no stack traces, no internal database / key leakage).
 */

import { checkRateLimitAndQuota } from '../_utils/distributedRateLimiter.js';
import { verifyRequestAuth } from '../_utils/supabaseServer.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;     // 20 requests per minute
const DAILY_QUOTA_MAX_REQUESTS = 150;   // 150 requests per 24 hours

// Maximum bounds
const MAX_USER_TEXT_LENGTH = 500;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_MSG_LENGTH = 300;
const ALLOWED_HSK_LEVELS = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'];

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

const SYSTEM_PROMPT = `
Bạn là "Lão Sư HanziGo", một gia sư tiếng Trung bản ngữ kiên nhẫn, thân thiện và giàu kinh nghiệm sư phạm dành cho người Việt Nam.
Nhiệm vụ: Trò chuyện tự nhiên bằng tiếng Trung, đồng thời hướng dẫn và sửa lỗi cho người học.

Yêu cầu trả về BẮT BUỘC theo định dạng JSON với cấu trúc sau:
{
  "hanzi": "Câu trả lời bằng chữ Hán giản thể",
  "pinyin": "Pinyin có dấu thanh điệu chuẩn xác",
  "meaning": "Bản dịch tiếng Việt tự nhiên, chuẩn nghĩa",
  "grammarAnalysis": "Giải thích ngắn gọn 1-2 điểm ngữ pháp xuất hiện trong câu hội thoại",
  "userCorrection": "Nếu câu của người học có lỗi sai (ngữ pháp, trật tự từ, từ vựng), hãy chỉ ra lỗi và đưa ra cách diễn đạt tự nhiên hơn bằng tiếng Việt. Nếu người học đã nói rất tốt, hãy khen ngợi.",
  "vocabSuggestions": [
    { "hanzi": "从", "pinyin": "cóng", "meaning": "Từ (nơi chốn, thời gian)", "level": "HSK 1" }
  ]
}
Chỉ trả về chuỗi JSON thuần túy, không bọc trong markdown code block.
`;

export default async function handler(req, res) {
  // 1. Method Enforce
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không hợp lệ. Chỉ chấp nhận POST.' });
  }

  // 2. Client Authentication & JWT Validation
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập để sử dụng tính năng trò chuyện AI.'
    });
  }

  // Determine client rate limiting key (bound to verified User ID)
  const clientKey = `user:${auth.user.id}`;

  // 3. Rate Limit & Daily Quota Check (Distributed with In-Memory fallback)
  const limitCheck = await checkRateLimitAndQuota({
    clientKey,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
    dailyQuotaMax: DAILY_QUOTA_MAX_REQUESTS,
    prefix: 'chat'
  });
  if (!limitCheck.allowed) {
    return res.status(429).json({ error: limitCheck.reason });
  }

  // 4. Input Validation & Sanitization
  const { userText, hskLevel = 'HSK 1', conversationHistory = [] } = req.body || {};

  if (!userText || typeof userText !== 'string' || !userText.trim()) {
    return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống.' });
  }

  const cleanUserText = userText.trim();

  // Maximum Input Length Constraint
  if (cleanUserText.length > MAX_USER_TEXT_LENGTH) {
    return res.status(400).json({
      error: `Độ dài tin nhắn vượt quá giới hạn cho phép (tối đa ${MAX_USER_TEXT_LENGTH} ký tự).`
    });
  }

  // Abuse & Prompt Injection Protection
  if (detectAbuseOrInjection(cleanUserText)) {
    return res.status(400).json({
      error: 'Yêu cầu chứa cú pháp không hợp lệ hoặc có dấu hiệu can thiệp hệ thống.'
    });
  }

  // 5. GEMINI_API_KEY Check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Hệ thống AI đang bảo trì. Vui lòng thử lại sau.'
    });
  }

  // Validate HSK Level
  const safeHskLevel = ALLOWED_HSK_LEVELS.includes(hskLevel) ? hskLevel : 'HSK 1';

  // Sanitize Conversation History
  const safeHistory = Array.isArray(conversationHistory) 
    ? conversationHistory.slice(-MAX_HISTORY_ITEMS).map(msg => {
        const rawText = msg && typeof msg === 'object' 
          ? String(msg.hanzi || msg.text || '').slice(0, MAX_HISTORY_MSG_LENGTH)
          : String(msg || '').slice(0, MAX_HISTORY_MSG_LENGTH);
        const role = msg && typeof msg === 'object' && (msg.sender === 'user' || msg.speaker === 'user') 
          ? 'user' 
          : 'model';
        return {
          role,
          parts: [{ text: rawText }]
        };
      })
    : [];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${SYSTEM_PROMPT}\nTrình độ hiện tại của học viên: ${safeHskLevel}` }]
    },
    ...safeHistory,
    {
      role: 'user',
      parts: [{ text: `Câu người học vừa nói: "${cleanUserText}"` }]
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
          maxOutputTokens: 1000, // Enforce maximum output bounds
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
    return res.status(200).json(parsed);
  } catch (err) {
    // Sanitized internal error logging
    console.error('AI Tutor Internal Error:', err.message);
    return res.status(500).json({ error: 'Đã xảy ra lỗi nội bộ khi xử lý hội thoại AI.' });
  }
}
