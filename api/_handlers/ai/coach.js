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
import { enforceAiKillSwitch } from '../../_utils/corsAndIp.js';
import { callUnifiedAiProvider } from '../../_utils/aiProviderAdapter.js';
import { AGENT_INTENTS, RISK_LEVELS, createPendingConfirmationContract } from '../../_agent/contracts.js';
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

  if (enforceAiKillSwitch(res)) {
    return;
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
    hskLevel: payload.hskLevel || payload.targetHskLevel || 'HSK 1',
    allowPremiumTier: false,
  });
  const memoryEnabled = body.memory_enabled !== false && payload.memory_enabled !== false;

  // 3.5 Telemetry Briefing Action (with instant deterministic fallback)
  if (action === 'generate_telemetry_briefing') {
    const safeBriefPayload = redactSensitiveData(payload);
    const targetHsk = String(safeBriefPayload.hskLevel || 'HSK 1');
    const retention = Number(safeBriefPayload.retention_rate_pct || 0);
    const streakDays = Number(safeBriefPayload.study_streak_days || 0);
    const events7d = Number(safeBriefPayload.events_count_7d || 0);
    const weakDim = String(safeBriefPayload.weakestDimension || 'writing');
    const avgLatency = safeBriefPayload.avg_response_latency_ms || {};
    const bottlenecks = Array.isArray(safeBriefPayload.top_cognitive_bottlenecks)
      ? safeBriefPayload.top_cognitive_bottlenecks
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
      const briefingPrompt = redactSensitiveData(`Tóm tắt chẩn đoán telemetry học viên tiếng Trung bằng tiếng Việt (trả về JSON thuần {"greeting": string, "summary": string, "examTactic": string}):
- Mục tiêu: ${targetHsk}
- Chuỗi học: ${streakDays} ngày, 7 ngày qua: ${events7d} sự kiện
- Tỷ lệ ghi nhớ SRS: ${retention}%
- Kỹ năng yếu nhất: ${weakDimLabel}
- Tốc độ phản xạ (ms): Nghe=${avgLatency.listening || 0}, Đọc=${avgLatency.reading || 0}, Ngữ pháp=${avgLatency.grammar || 0}, Viết=${avgLatency.writing || 0}
- Điểm nghẽn: ${bottlenecks.map(b => b.target_key).join(', ') || 'Chưa có'}`);

      const aiBriefing = await callUnifiedAiProvider({
        action: 'generate_telemetry_briefing',
        systemPrompt: 'Bạn là Lão Sư HanziGo. Trả về JSON thuần gồm 3 khóa tiếng Việt súc tích, thực tế: greeting, summary, examTactic.',
        userPrompt: briefingPrompt,
        temperature: 0.5,
        maxTokens: 500,
      });

      if (aiBriefing.success && aiBriefing.data?.summary) {
        return res.status(200).json(redactSensitiveData({
          source: 'ai_coach',
          greeting: aiBriefing.data.greeting || deterministicBriefing.greeting,
          summary: aiBriefing.data.summary,
          examTactic: aiBriefing.data.examTactic || deterministicBriefing.examTactic,
          _metadata: {
            provider: aiBriefing.provider,
            model: aiBriefing.model,
            latencyMs: aiBriefing.latencyMs,
          },
        }));
      }
    } catch {
      // Fall back deterministically below
    }

    return res.status(200).json(deterministicBriefing);
  }

  // 3.6 Smart Adaptive Plan Action (4 real telemetry signals + HITL pending_confirmations)
  if (action === 'generate_smart_adaptive_plan') {
    const safeSmart = redactSensitiveData(payload);
    const targetHsk = String(safeSmart.targetHskLevel || safeSmart.hskLevel || 'HSK 1');
    const readinessScore = Number(safeSmart.readinessScore || 0);
    const isColdStart = Boolean(safeSmart.isColdStart);
    const srsDueToday = Number(safeSmart.srsDueToday || 0);
    const streakVn = Number(safeSmart.streakVn || 0);
    const weakestSkill = safeSmart.weakestSkill ? String(safeSmart.weakestSkill) : null;
    const topLeechWords = Array.isArray(safeSmart.topLeechWords) ? safeSmart.topLeechWords.slice(0, 5) : [];
    const mistakeClusters = Array.isArray(safeSmart.mistakeClusters) ? safeSmart.mistakeClusters.slice(0, 3) : [];
    const fiveSkills = Array.isArray(safeSmart.fiveSkills) ? safeSmart.fiveSkills.slice(0, 5) : [];

    const pendingConfirmations = [];
    if (topLeechWords[0]?.hanzi) {
      pendingConfirmations.push(
        createPendingConfirmationContract({
          actionType: 'save_vocab_to_srs',
          label: `Đưa "${topLeechWords[0].hanzi}" vào sổ ôn cấp bách SRS`,
          riskLevel: RISK_LEVELS.MEDIUM,
          requiresConfirmation: true,
          payload: {
            hanzi: topLeechWords[0].hanzi,
            pinyin: topLeechWords[0].pinyin || '',
            meaning: topLeechWords[0].meaning || 'Từ cần củng cố',
            hskLevel: targetHsk,
          },
        })
      );
    }

    const fallbackTasks = isColdStart
      ? [
          {
            id: 'smart-placement',
            priority: 1,
            category: 'placement',
            title: `Làm bài kiểm tra xếp lớp ${targetHsk}`,
            reason: 'Chưa có dữ liệu thực tế — làm 1 bài đo để định vị đúng trình độ.',
            durationMinutes: 5,
            targetRoute: 'hsk',
            actionLabel: 'Làm bài kiểm tra',
          },
          {
            id: 'smart-starter-srs',
            priority: 2,
            category: 'srs',
            title: 'Ôn 5 thẻ từ vựng đầu tiên',
            reason: 'Khởi tạo sổ SRS để hệ thống theo dõi tỷ lệ ghi nhớ.',
            durationMinutes: 4,
            targetRoute: 'vocabulary',
            actionLabel: 'Ôn 5 từ đầu tiên',
          },
          {
            id: 'smart-starter-roadmap',
            priority: 3,
            category: 'roadmap',
            title: 'Học Bài #1 trên Lộ trình 180 bài',
            reason: 'Xây nền phát âm và mẫu câu giao tiếp chuẩn.',
            durationMinutes: 6,
            targetRoute: 'roadmap',
            actionLabel: 'Vào Lộ trình',
          },
        ]
      : [
          {
            id: 'smart-srs-due',
            priority: 1,
            category: 'srs',
            title: srsDueToday > 0 ? `Ôn ${srsDueToday} thẻ SRS đến hạn` : 'Củng cố từ vựng trọng tâm',
            reason: topLeechWords.length > 0
              ? `Ưu tiên các từ hay quên: ${topLeechWords.slice(0, 3).map((w) => w.hanzi).join(', ')}.`
              : 'Giữ nhịp ôn tập ngắt quãng SM-2 trong ngày.',
            durationMinutes: 5,
            targetRoute: 'vocabulary',
            actionLabel: 'Ôn SRS ngay',
          },
          {
            id: 'smart-mistakes',
            priority: 2,
            category: 'mistakes',
            title: mistakeClusters[0]
              ? `Khắc phục ${mistakeClusters[0].count} lỗi nhóm ${mistakeClusters[0].key}`
              : 'Kiểm tra lại các câu sai gần đây',
            reason: 'Giảm lỗi lặp lại để kéo điểm Sẵn sàng HSK lên nhanh nhất.',
            durationMinutes: 6,
            targetRoute: 'hsk',
            actionLabel: 'Sửa câu sai',
          },
          {
            id: 'smart-weak-skill',
            priority: 3,
            category: weakestSkill || 'reading',
            title: weakestSkill ? `Luyện kỹ năng yếu: ${weakestSkill}` : `Luyện bài mới ${targetHsk}`,
            reason: 'Cân bằng năng lực 5 kỹ năng trước kỳ thi thử CBT.',
            durationMinutes: 7,
            targetRoute: weakestSkill === 'speaking' ? 'pronunciation' : weakestSkill === 'writing' ? 'writing' : 'hsk',
            actionLabel: 'Bắt đầu ngay',
          },
        ];

    const fallbackSmart = {
      source: 'rule_based_fallback',
      greeting: `Cố vấn học tập thông minh · ${targetHsk}`,
      coachInsight: isColdStart
        ? 'Bạn chưa có dữ liệu học tập thật. Hãy làm bài kiểm tra xếp lớp hoặc ôn 5 từ đầu tiên.'
        : `Sẵn sàng ${targetHsk}: ${readinessScore}% · Chuỗi ${streakVn} ngày · ${srsDueToday} thẻ SRS đến hạn.`,
      weakestSkillNote: weakestSkill
        ? `Kỹ năng cần ưu tiên kéo lên hôm nay: ${weakestSkill}.`
        : 'Chưa đủ dữ liệu chấm 5 kỹ năng.',
      dailyPlan: fallbackTasks,
      pending_confirmations: pendingConfirmations,
      generatedAt: new Date().toISOString(),
    };

    try {
      const smartPrompt = redactSensitiveData(`Phân tích Telemetry học viên (JSON thuần, KHÔNG bịa số liệu):
- Mục tiêu: ${targetHsk} | Sẵn sàng: ${readinessScore}% | Streak VN: ${streakVn} ngày
- SRS đến hạn: ${srsDueToday} | Từ hay quên: ${topLeechWords.map((w) => `${w.hanzi}(${w.lapses} lần)`).join(', ') || 'Không'}
- 5 kỹ năng: ${fiveSkills.map((s) => `${s.skill}:${s.overallPct ?? 'N/A'}%`).join(', ') || 'Chưa đo'}
- Cụm lỗi: ${mistakeClusters.map((c) => `${c.key}(${c.count})`).join(', ') || 'Không'}
Trả về JSON: {"greeting":string,"coachInsight":string,"weakestSkillNote":string,"dailyPlan":[{"id":string,"priority":number,"category":string,"title":string,"reason":string,"durationMinutes":number,"targetRoute":"vocabulary|hsk|pronunciation|writing|reader|roadmap","actionLabel":string}]}`);

      const aiSmart = await callUnifiedAiProvider({
        action: 'generate_smart_adaptive_plan',
        systemPrompt: 'Bạn là Lão Sư HanziGo. Trả về JSON thuần tiếng Việt ngắn gọn, súc tích, chỉ dựa trên số liệu thật được cung cấp.',
        userPrompt: smartPrompt,
        temperature: route.temperature,
        maxTokens: Math.min(900, route.maxOutputTokens),
        timeoutMs: route.timeoutMs,
      });

      if (aiSmart.success && Array.isArray(aiSmart.data?.dailyPlan) && aiSmart.data.dailyPlan.length > 0) {
        const aiPending = Array.isArray(aiSmart.data.pending_confirmations)
          ? aiSmart.data.pending_confirmations.map((p) =>
              createPendingConfirmationContract({
                actionType: p?.actionType || 'save_vocab_to_srs',
                label: p?.label || 'Xác nhận đề xuất học tập',
                payload: p?.payload || {},
                requiresConfirmation: true,
              })
            )
          : [];

        emitAgentTrace(
          buildAgentTraceRecord({
            traceId,
            userId: auth.user.id,
            intent: AGENT_INTENTS.PROGRESS_COACH,
            tier: route.tier,
            model: aiSmart.model || route.model,
            memoryApplied: false,
            totalTokens: aiSmart.usage?.totalTokens || 0,
            costUsd: aiSmart.costUsd || 0,
            latencyMs: aiSmart.latencyMs || Date.now() - startedAt,
            status: 'ok',
          })
        );

        return res.status(200).json(
          redactSensitiveData({
            source: 'ai_coach',
            greeting: aiSmart.data.greeting || fallbackSmart.greeting,
            coachInsight: aiSmart.data.coachInsight || fallbackSmart.coachInsight,
            weakestSkillNote: aiSmart.data.weakestSkillNote || fallbackSmart.weakestSkillNote,
            dailyPlan: aiSmart.data.dailyPlan.slice(0, 4),
            pending_confirmations: aiPending.length > 0 ? aiPending : pendingConfirmations,
            generatedAt: new Date().toISOString(),
            _metadata: {
              provider: aiSmart.provider,
              model: aiSmart.model || route.model,
              model_tier: route.tier,
              trace_id: traceId,
            },
          })
        );
      }
    } catch {
      // Fall back deterministically below
    }

    return res.status(200).json(fallbackSmart);
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
