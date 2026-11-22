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

import crypto from 'node:crypto';
import { checkRateLimitAndQuota } from '../../_utils/distributedRateLimiter.js';
import { verifyRequestAuth, sendSafeServerError } from '../../_utils/supabaseServer.js';
import { callUnifiedAiProvider } from '../../_utils/aiProviderAdapter.js';
import { AGENT_INTENTS } from '../../_agent/contracts.js';
import { validateAgentInput, redactSensitiveData } from '../../_agent/guardrails.js';
import { selectModelTier } from '../../_agent/modelRouter.js';
import { buildSafeLearnerMemoryContext } from '../../_agent/memoryManager.js';
import { buildAgentTraceRecord, emitAgentTrace } from '../../_agent/costAndObservability.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const DAILY_QUOTA_MAX_REQUESTS = 80;
const MAX_COACH_PAYLOAD_LEN = 5000;

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

  // Anti-abuse & Prompt injection protection via shared api/_agent guardrails
  const payloadString = JSON.stringify(payload);
  const inputGuard = validateAgentInput({ text: payloadString, maxLength: MAX_COACH_PAYLOAD_LEN });
  if (!inputGuard.allowed) {
    return res.status(400).json({
      error:
        inputGuard.code === 'input_too_long'
          ? 'Dữ liệu phân tích vượt quá giới hạn cho phép.'
          : inputGuard.reason || 'Yêu cầu chứa cú pháp không hợp lệ hoặc có dấu hiệu can thiệp hệ thống.',
    });
  }

  const traceId = crypto.randomUUID();
  const startedAt = Date.now();
  const route = selectModelTier({
    intent: AGENT_INTENTS.PROGRESS_COACH,
    hskLevel: payload.hskLevel || 'HSK 1',
  });
  const memoryEnabled = body.memory_enabled !== false && payload.memory_enabled !== false;

  // 3.5 Telemetry Briefing Action (with instant deterministic fallback)
  if (action === 'generate_telemetry_briefing') {
    const targetHsk = String(payload.hskLevel || 'HSK 1');
    const retention = Number(payload.retention_rate_pct || 0);
    const streakDays = Number(payload.study_streak_days || 0);
    const events7d = Number(payload.events_count_7d || 0);
    const weakDim = String(payload.weakestDimension || 'writing');
    const avgLatency = payload.avg_response_latency_ms || {};
    const bottlenecks = Array.isArray(payload.top_cognitive_bottlenecks)
      ? payload.top_cognitive_bottlenecks
      : [];

    const weakDimLabel =
      weakDim === 'writing'
        ? 'bút thuận viết chữ Hán'
        : weakDim === 'pronunciation'
        ? 'phát âm & thanh điệu'
        : 'ghi nhớ nghĩa ngữ cảnh';

    const deterministicBriefing = {
      source: 'deterministic_fallback',
      greeting: `Chẩn đoán AI cho mục tiêu ${targetHsk}`,
      summary: `Trong 7 ngày qua bạn đã ghi nhận ${events7d} lượt luyện tập (chuỗi ${streakDays} ngày, tỷ lệ nhớ SRS ${retention}%). Chiều kỹ năng cần ưu tiên kéo lên hôm nay là ${weakDimLabel}.`,
      examTactic: targetHsk.includes('7') || targetHsk.includes('8') || targetHsk.includes('9')
        ? `Chiến thuật ${targetHsk}: Kiểm soát tốc độ đọc học thuật dưới 35s/câu và rà lỗi dịch Tín–Đạt–Nhã.`
        : `Chiến thuật ${targetHsk}: Tập trung ôn các điểm nghẽn ${bottlenecks.slice(0, 2).map(b => b.target_key).join(', ') || 'ngữ pháp cốt lõi'} và giữ nhịp phản xạ ổn định.`,
    };

    try {
      const briefingPrompt = `Tóm tắt chẩn đoán telemetry học viên tiếng Trung bằng tiếng Việt (trả về JSON thuần {"greeting": string, "summary": string, "examTactic": string}):
- Mục tiêu: ${targetHsk}
- Chuỗi học: ${streakDays} ngày, 7 ngày qua: ${events7d} sự kiện
- Tỷ lệ ghi nhớ SRS: ${retention}%
- Kỹ năng yếu nhất: ${weakDimLabel}
- Tốc độ phản xạ (ms): Nghe=${avgLatency.listening || 0}, Đọc=${avgLatency.reading || 0}, Ngữ pháp=${avgLatency.grammar || 0}, Viết=${avgLatency.writing || 0}
- Điểm nghẽn: ${bottlenecks.map(b => b.target_key).join(', ') || 'Chưa có'}`;

      const aiBriefing = await callUnifiedAiProvider({
        action: 'generate_telemetry_briefing',
        systemPrompt: 'Bạn là Lão Sư HanziGo. Trả về JSON thuần gồm 3 khóa tiếng Việt súc tích, thực tế: greeting, summary, examTactic.',
        userPrompt: briefingPrompt,
        temperature: 0.5,
        maxTokens: 500,
      });

      if (aiBriefing.success && aiBriefing.data?.summary) {
        return res.status(200).json({
          source: 'ai_coach',
          greeting: aiBriefing.data.greeting || deterministicBriefing.greeting,
          summary: aiBriefing.data.summary,
          examTactic: aiBriefing.data.examTactic || deterministicBriefing.examTactic,
          _metadata: {
            provider: aiBriefing.provider,
            model: aiBriefing.model,
            latencyMs: aiBriefing.latencyMs,
          },
        });
      }
    } catch {
      // Fall back deterministically below
    }

    return res.status(200).json(deterministicBriefing);
  }

  // 4. Construct Prompts (respecting memory_enabled opt-out)
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
    durationMinutes = 15,
    session_summary = '',
  } = payload;

  const memoryContext = buildSafeLearnerMemoryContext({
    hskLevel,
    memoryEnabled,
    learnerProfile: memoryEnabled ? { learningGoal, completedLessonsCount } : null,
    learningMemory: memoryEnabled
      ? {
          confirmedMistakes: Array.isArray(weaknesses) ? weaknesses.map((w) => w?.label || w).filter(Boolean) : [],
          dueVocabWords: Array.isArray(weakVocabHanzi) ? weakVocabHanzi : [],
        }
      : null,
    sessionSummary: memoryEnabled ? session_summary : '',
  });

  const safeWeaknesses = memoryEnabled ? weaknesses : [];
  const safeWeakVocab = memoryEnabled ? weakVocabHanzi : [];

  const userPrompt = redactSensitiveData(`Dữ liệu hồ sơ học viên:
<learner_context>
${memoryContext.contextText}
</learner_context>
- Trình độ hiện tại: ${hskLevel}
- Mục tiêu học tập ưu tiên: ${learningGoal}
- Chuỗi ngày học liên tục (Streak): ${memoryEnabled ? streak : 0} ngày
- Số ngày tạm dừng học: ${memoryEnabled ? daysInactive : 0} ngày
- Tổng thời gian đã học: ${memoryEnabled ? studyMinutes : 0} phút
- Số bài học đã hoàn thành: ${memoryEnabled ? completedLessonsCount : 0}/60 bài (Bài học tiếp theo: ${nextLesson?.title || activeLessonId})
- Số bài cần ôn tập (Điểm < 90% hoặc đã lâu): ${memoryEnabled ? reviewLessonsCount : 0} bài
- Số từ vựng đến hạn cần ôn (SRS Due): ${memoryEnabled ? srsDueCount : 0} từ
- Trạng thái dữ liệu học tập: ${!memoryEnabled || hasSparseData ? 'Học viên mới hoặc đã tắt bộ nhớ dài hạn' : 'Đã có dữ liệu học tập thực tế'}
- Từ vựng hay quên/cần củng cố: ${safeWeakVocab.length > 0 ? safeWeakVocab.join(', ') : 'Không áp dụng'}
- Đánh giá 7 kỹ năng (Thực tế, không điểm ảo):
  + Từ vựng: ${memoryEnabled ? (skills.vocabulary || 'Chưa đủ dữ liệu') : 'Chế độ riêng tư'}
  + Ngữ pháp: ${memoryEnabled ? (skills.grammar || 'Chưa đủ dữ liệu') : 'Chế độ riêng tư'}
  + Nghe hiểu: ${memoryEnabled ? (skills.listening || 'Chưa đủ dữ liệu') : 'Chế độ riêng tư'}
  + Nói phản xạ: ${memoryEnabled ? (skills.speaking || 'Chưa đủ dữ liệu') : 'Chế độ riêng tư'}
  + Đọc hiểu: ${memoryEnabled ? (skills.reading || 'Chưa đủ dữ liệu') : 'Chế độ riêng tư'}
  + Chữ Hán/Viết: ${memoryEnabled ? (skills.writing || 'Chưa đủ dữ liệu') : 'Chế độ riêng tư'}
  + Phát âm: ${memoryEnabled ? (skills.pronunciation || 'Chưa đủ dữ liệu') : 'Chế độ riêng tư'}
- Các điểm yếu đã phát hiện: ${safeWeaknesses.length > 0 ? safeWeaknesses.map(w => `${w.label} (${w.severity})`).join('; ') : 'Không áp dụng'}
- Thời lượng học mục tiêu hôm nay: ${durationMinutes} phút.

Hãy đóng vai Lão Sư HanziGo, đưa ra phân tích, điểm yếu, đề xuất bài học tiếp theo, bài cần ôn lại, tài liệu từ Materials và tạo kế hoạch học tập chi tiết ${durationMinutes} phút hôm nay theo đúng cấu trúc JSON quy định.`);

  try {
    const aiResult = await callUnifiedAiProvider({
      action: 'coach_plan',
      systemPrompt: SYSTEM_PROMPT_COACH,
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
        error: aiResult.error || 'Dịch vụ AI phản hồi không thành công. Hệ thống sẽ tự động chuyển sang chế độ ngoại tuyến.'
      });
    }

    const parsedResult = aiResult.data || {};
    parsedResult._metadata = {
      provider: aiResult.provider,
      model: aiResult.model || route.model,
      model_tier: route.tier,
      route_reason: route.reason,
      trace_id: traceId,
      memory_applied: memoryContext.memoryApplied,
      usage: aiResult.usage,
      costUsd: aiResult.costUsd || 0,
      latencyMs: aiResult.latencyMs
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
    console.error('Coach API internal error:', redactSensitiveData(err?.message || ''));
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
        errorCode: 'coach_internal_error',
      })
    );
    return sendSafeServerError(res, 'Lỗi máy chủ nội bộ khi xử lý phân tích AI Learning Coach.', err, 500);
  }
}
