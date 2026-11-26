/**
 * =========================================================================
 * HANZI GO - UNIFIED SECURE SERVERLESS API: /api/ai/personalize
 * =========================================================================
 * Production-Hardened Vercel Serverless Function (Node.js runtime):
 * - Keeps GEMINI_API_KEY securely on the server-side environment variables.
 * - Enforces Authentication via Bearer token or verified user header.
 * - Enforces Distributed Rate Limiting (20 req/min/user) & Daily Quotas (150 req/day).
 * - Caps Maximum Input & Output Lengths to prevent prompt injection & resource exhaustion.
 * - Detects prompt injection & abuse patterns across all actions.
 * - Sanitizes all error messages (no stack traces, database internals, or API keys leaked).
 * - Polymorphic Action Support:
 *    1. coach_plan: Daily learning plan, weakness detection, next & review lessons.
 *    2. explain_grammar: Contextual Vietnamese explanations tailored to HSK level.
 *    3. generate_exercise: Targeted drills for weak vocabulary and grammar concepts.
 *    4. diagnose_hsk_mistakes: Skill-based diagnosis & revision strategies for HSK mistakes.
 *    5. recommend_resources: Pedagogical matching with approved learning materials.
 * =========================================================================
 */

import crypto from 'node:crypto';
import { checkRateLimitAndQuota } from '../../_utils/distributedRateLimiter.js';
import { verifyRequestAuth, sendSafeServerError } from '../../_utils/supabaseServer.js';
import { enforceAiKillSwitch } from '../../_utils/corsAndIp.js';
import { callUnifiedAiProvider } from '../../_utils/aiProviderAdapter.js';
import { AGENT_INTENTS, createPendingConfirmationContract } from '../../_agent/contracts.js';
import { validateAgentInput, redactSensitiveData } from '../../_agent/guardrails.js';
import { selectModelTier } from '../../_agent/modelRouter.js';
import { buildSafeLearnerMemoryContext } from '../../_agent/memoryManager.js';
import { buildAgentTraceRecord, emitAgentTrace } from '../../_agent/costAndObservability.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const DAILY_QUOTA_MAX_REQUESTS = 150;

// Maximum bounds
const MAX_PAYLOAD_LENGTH = 15000;

export function detectAbuseOrInjection(text) {
  if (!text) return false;
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  if (!str.trim()) return false;
  const check = validateAgentInput({ text: str, maxLength: MAX_PAYLOAD_LENGTH });
  return !check.allowed && (check.code === 'prompt_injection_detected' || check.code === 'high_risk_action_blocked');
}

// System prompts for polymorphic personalization actions
const SYSTEM_PROMPTS = {
  coach_plan: `Bạn là "Lão Sư HanziGo" — Cố vấn Học tập AI Sư phạm (Pedagogical Learning Coach) chuyên biệt cho người Việt học tiếng Trung theo chuẩn HSK 3.0.
Nhiệm vụ: Phân tích dữ liệu học tập thực tế, xác định điểm mạnh, điểm yếu, bài học tiếp theo, bài cần ôn, và kế hoạch học tập hôm nay.
Không giả lập điểm số hoặc khẳng định thành thạo khi chưa có số liệu.
Trả về JSON thuần túy (không bọc markdown) với cấu trúc:
{
  "summary": "Lời khuyên sư phạm ngắn gọn (2-3 câu), ấm áp và khích lệ bằng tiếng Việt.",
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
    "reason": "Lý do sư phạm cụ thể"
  },
  "recommendedReviewLessons": [
    {
      "lessonId": "mã_bài_ôn",
      "title": "Tên bài cần ôn lại",
      "score": 75,
      "reason": "Lý do vì sao cần ôn lại"
    }
  ],
  "recommendedMaterials": [
    {
      "id": "mat-id",
      "title": "Tên tài liệu",
      "category": "Danh mục tài liệu",
      "reason": "Lý do tài liệu này hỗ trợ điểm yếu"
    }
  ],
  "dailyPlan": [
    {
      "id": "plan-1",
      "type": "srs | pronunciation | listening | grammar | lesson | review_lesson | speaking | writing | materials",
      "title": "Tiêu đề nhiệm vụ",
      "subtitle": "Mô tả ngắn nhiệm vụ",
      "durationMinutes": 5,
      "route": "vocabulary | pronunciation | conversation | writing | roadmap | materials",
      "reason": "Lý do phân bổ cho hôm nay",
      "completed": false
    }
  ],
  "reasoning": [
    "Căn cứ số liệu để ra kế hoạch..."
  ]
}`,

  explain_grammar: `Bạn là Giảng viên Ngữ pháp Tiếng Trung Chuyên sâu cho người học Việt Nam tại HanziGo.
Nhiệm vụ: Giải thích cấu trúc ngữ pháp một cách trực quan, dễ hiểu bằng tiếng Việt, so sánh với ngữ pháp tiếng Việt, nêu rõ lỗi sai người Việt hay mắc phải và đưa ra ví dụ đối chiếu.
Phân biệt rõ quy tắc ngữ pháp đã xác thực với ví dụ minh họa tạo bởi AI.
Trả về JSON thuần túy với cấu trúc:
{
  "grammarPoint": "Tên điểm ngữ pháp",
  "hskLevel": "HSK 1-6",
  "structure": "Công thức / Cấu trúc (vd: Chủ ngữ + 在 + Nơi chốn + Động từ)",
  "explanationVi": "Giải thích chi tiết, mạch lạc bằng tiếng Việt",
  "sinoVietnameseNotes": "Liên hệ từ Hán Việt nếu có để dễ nhớ",
  "commonMistakes": [
    {
      "wrong": "Câu sai thường gặp của người Việt",
      "correct": "Câu sửa đúng chuẩn",
      "reason": "Giải thích tại sao sai (vd: ảnh hưởng thói quen tiếng Việt)"
    }
  ],
  "exampleSentences": [
    {
      "hanzi": "Câu tiếng Trung mẫu",
      "pinyin": "Pinyin có dấu",
      "meaning": "Dịch nghĩa tiếng Việt",
      "sourceType": "ai_generated_example"
    }
  ],
  "quickPractice": [
    {
      "question": "Câu hỏi thực hành nhanh",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Giải thích đáp án đúng"
    }
  ]
}`,

  generate_exercise: `Bạn là Chuyên gia Biên soạn Bài tập Tiếng Trung Cá nhân hóa của HanziGo.
Nhiệm vụ: Dựa trên từ vựng hoặc điểm ngữ pháp mà học viên hay sai, tạo ra các câu hỏi bài tập có ngữ cảnh thực tế, phù hợp với trình độ HSK của học viên.
Phải phân biệt rõ nội dung bài tập do AI tạo ra với ngân hàng đề chính thức.
Trả về JSON thuần túy với cấu trúc:
{
  "targetConcept": "Từ vựng hoặc ngữ pháp mục tiêu",
  "hskLevel": "Cấp độ HSK",
  "exerciseType": "contextual_sentence | multiple_choice | fill_in_blank | sentence_scramble",
  "drills": [
    {
      "id": "drill-1",
      "prompt": "Yêu cầu bài tập bằng tiếng Việt",
      "targetHanzi": "Từ hoặc câu tiếng Trung trọng tâm",
      "pinyin": "Pinyin chuẩn",
      "meaning": "Nghĩa tiếng Việt",
      "options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
      "correctAnswer": "Đáp án đúng",
      "correctIndex": 0,
      "explanation": "Giải thích sư phạm cặn kẽ tại sao đúng/sai",
      "sourceType": "ai_generated_exercise"
    }
  ]
}`,

  diagnose_hsk_mistakes: `Bạn là Chuyên gia Luyện thi HSK & Chẩn đoán Lỗi sai Thi thử của HanziGo.
Nhiệm vụ: Phân tích danh sách các câu hỏi làm sai trong bài thi thử HSK, chỉ ra mẫu hình lỗi sai lặp lại (theo kỹ năng: Nghe, Đọc, Viết hoặc dạng câu hỏi), giải thích nguyên nhân và đề xuất lộ trình khắc phục.
Tuyệt đối không tuyên bố điểm thi thử là chứng chỉ HSK chính thức của Hanban/CTI.
Trả về JSON thuần túy với cấu trúc:
{
  "overallDiagnosis": "Đánh giá tổng quan điểm yếu của bài làm",
  "recurringErrorPatterns": [
    {
      "skill": "listening | reading | writing",
      "errorType": "Từ vựng nhiễu | Bẫy thời gian | Trật tự từ | Thanh điệu | Khuyết trung tâm ngữ",
      "description": "Mô tả mẫu hình sai lặp lại",
      "frequency": "Số lần gặp hoặc mức độ ảnh hưởng",
      "remedy": "Cách khắc phục tức thời"
    }
  ],
  "targetedPracticePlan": [
    {
      "step": 1,
      "focus": "Trọng tâm ôn luyện",
      "recommendedAction": "Hành động cụ thể",
      "targetRoute": "hsk | vocabulary | grammar | pronunciation"
    }
  ],
  "encouragement": "Lời động viên thực tế và truyền cảm hứng"
}`,

  recommend_resources: `Bạn là Thủ thư Học thuật & Cố vấn Tài liệu Tiếng Trung của HanziGo.
Nhiệm vụ: Căn cứ vào mục tiêu và điểm yếu của học viên, chọn lọc và xếp hạng tài liệu phù hợp nhất từ kho tài liệu đã được kiểm duyệt.
Chỉ gợi ý tài liệu từ danh sách được cung cấp, không bịa đặt liên kết hoặc tài liệu không có thực.
Trả về JSON thuần túy với cấu trúc:
{
  "recommendations": [
    {
      "materialId": "id_tai_lieu",
      "title": "Tên tài liệu",
      "category": "Danh mục",
      "matchScore": 95,
      "rationale": "Lý do tài liệu này giải quyết đúng lỗ hổng của học viên",
      "recommendedChaptersOrPages": "Phần nên tập trung đọc"
    }
  ]
}`
};

export default async function handler(req, res) {
  // 1. Method Enforce
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không hợp lệ. Chỉ chấp nhận POST.' });
  }

  // 1b. Global AI Emergency Kill Switch
  if (enforceAiKillSwitch(res)) {
    return;
  }

  // 2. Client Authentication & JWT Validation
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      error: auth.error || 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập để sử dụng tính năng AI cá nhân hóa.'
    });
  }

  // 3. Distributed Rate Limiting & Daily Quota
  const clientKey = `user:${auth.user.id}`;
  const limitCheck = await checkRateLimitAndQuota({
    clientKey,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
    dailyQuotaMax: DAILY_QUOTA_MAX_REQUESTS,
    prefix: 'personalize'
  });

  if (!limitCheck.allowed) {
    return res.status(429).json({ error: limitCheck.reason });
  }

  // 4. Payload Validation & Sanitization
  const body = req.body || {};
  const { action, payload } = body;

  if (!action || !SYSTEM_PROMPTS[action]) {
    return res.status(400).json({
      error: `Hành động không hợp lệ: "${action}". Các hành động được hỗ trợ: ${Object.keys(SYSTEM_PROMPTS).join(', ')}`
    });
  }

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Thiếu dữ liệu payload phân tích hợp lệ.' });
  }

  // Privacy & Credential Gate: Reject any sensitive auth tokens or passwords in payload
  if (payload.password || payload.token || payload.access_token || payload.refresh_token) {
    return res.status(400).json({ error: 'Payload không được chứa mật khẩu hoặc mã bảo mật cá nhân.' });
  }

  // Zero-Trust Authorization: Strict ownership check on userId
  if (payload.userId && payload.userId !== auth.user.id && auth.user.role !== 'admin') {
    return res.status(403).json({ error: 'Không có quyền truy cập hoặc can thiệp dữ liệu cá nhân của người dùng khác.' });
  }
  payload.userId = auth.user.id;

  // Length & Prompt injection detection via shared api/_agent guardrails
  const payloadStr = JSON.stringify(payload);
  const inputGuard = validateAgentInput({ text: payloadStr, maxLength: MAX_PAYLOAD_LENGTH });
  if (!inputGuard.allowed) {
    return res.status(400).json({
      error:
        inputGuard.code === 'input_too_long'
          ? `Dữ liệu phân tích vượt quá giới hạn cho phép (tối đa ${MAX_PAYLOAD_LENGTH} ký tự).`
          : inputGuard.reason || 'Yêu cầu chứa cú pháp không hợp lệ hoặc có dấu hiệu can thiệp hệ thống.',
    });
  }

  const traceId = crypto.randomUUID();
  const startedAt = Date.now();
  const hskLevel = payload.hskLevel || 'HSK 1';
  const route = selectModelTier({
    intent: AGENT_INTENTS.PROGRESS_COACH,
    hskLevel,
    allowPremiumTier: false,
  });
  const memoryEnabled = body.memory_enabled !== false && payload.memory_enabled !== false;
  const memoryContext = buildSafeLearnerMemoryContext({
    hskLevel,
    memoryEnabled,
    learnerProfile: memoryEnabled
      ? payload.learnerProfile || {
          learningGoal: payload.learningGoal,
          completedLessonsCount: payload.completedLessonsCount,
        }
      : null,
    learningMemory: memoryEnabled
      ? payload.learningMemory || {
          confirmedMistakes: payload.mistakes || payload.weaknesses,
          dueVocabWords: payload.weakVocabHanzi,
        }
      : null,
    sessionSummary: memoryEnabled ? payload.session_summary || '' : '',
  });

  const safePayload = memoryEnabled
    ? redactSensitiveData(payload)
    : redactSensitiveData({
        ...payload,
        learningMemory: undefined,
        weakVocabHanzi: undefined,
        weaknesses: undefined,
        mistakes: undefined,
        session_summary: undefined,
        recentTopics: undefined,
        history: undefined,
      });

  // 5. Construct prompt based on action
  const systemPrompt = SYSTEM_PROMPTS[action];
  const userPrompt = `<learner_context>\n${memoryContext.contextText}\n</learner_context>\nDữ liệu đầu vào cho yêu cầu cá nhân hóa (${action}):\n${JSON.stringify(safePayload, null, 2)}`;

  try {
    const aiResult = await callUnifiedAiProvider({
      action,
      systemPrompt,
      userPrompt,
      temperature: route.temperature,
      maxTokens: Math.max(1200, route.maxOutputTokens),
      timeoutMs: route.timeoutMs,
    });

    if (!aiResult.success) {
      emitAgentTrace(
        buildAgentTraceRecord({
          traceId,
          userId: auth.user.id,
          intent: AGENT_INTENTS.PROGRESS_COACH,
          tier: route.tier,
          model: route.model,
          memoryApplied: memoryContext.memoryApplied,
          latencyMs: Date.now() - startedAt,
          status: 'provider_error',
          fallbackUsed: true,
          fallbackReason: aiResult.error || 'provider_unavailable',
        })
      );
      return res.status(aiResult.status || 502).json({
        error: aiResult.error || 'Dịch vụ AI không phản hồi. Chuyển sang bộ tối ưu cá nhân hóa ngoại tuyến.'
      });
    }

    const parsedResult = redactSensitiveData(aiResult.data || {});

    if (Array.isArray(parsedResult.pending_confirmations)) {
      parsedResult.pending_confirmations = parsedResult.pending_confirmations.map((item) =>
        createPendingConfirmationContract({
          actionType: item?.actionType || 'save_vocab_to_srs',
          label: item?.label || 'Xác nhận đề xuất học tập',
          payload: item?.payload || {},
          requiresConfirmation: true,
        })
      );
    }

    // Attach metadata
    parsedResult._metadata = {
      action,
      provider: aiResult.provider,
      model: aiResult.model || route.model,
      model_tier: route.tier,
      route_reason: route.reason,
      trace_id: traceId,
      memory_applied: memoryContext.memoryApplied,
      usage: aiResult.usage,
      costUsd: aiResult.costUsd || 0,
      latencyMs: aiResult.latencyMs,
      timestamp: aiResult.timestamp || new Date().toISOString()
    };

    emitAgentTrace(
      buildAgentTraceRecord({
        traceId,
        userId: auth.user.id,
        intent: AGENT_INTENTS.PROGRESS_COACH,
        tier: route.tier,
        model: aiResult.model || route.model,
        memoryApplied: memoryContext.memoryApplied,
        totalTokens: aiResult.usage?.totalTokens || 0,
        costUsd: aiResult.costUsd || 0,
        latencyMs: aiResult.latencyMs || Date.now() - startedAt,
        status: 'ok',
      })
    );

    return res.status(200).json(parsedResult);
  } catch (err) {
    console.error('Unified AI Personalization Server Error:', redactSensitiveData(err?.message || ''));
    emitAgentTrace(
      buildAgentTraceRecord({
        traceId,
        userId: auth.user.id,
        intent: AGENT_INTENTS.PROGRESS_COACH,
        tier: route.tier,
        model: route.model,
        memoryApplied: memoryContext.memoryApplied,
        latencyMs: Date.now() - startedAt,
        status: 'error',
        errorCode: 'personalize_internal_error',
      })
    );
    return sendSafeServerError(res, 'Đã xảy ra lỗi nội bộ khi xử lý cá nhân hóa AI.', err, 500);
  }
}
