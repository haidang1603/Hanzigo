/**
 * =========================================================================
 * HANZI GO - UNIFIED SECURE AI PERSONALIZATION GATEWAY
 * =========================================================================
 * Cổng kết nối AI cá nhân hóa tập trung phía máy khách:
 * - Bảo mật tuyệt đối: Mọi lệnh gọi đều đi qua serverless gateway `/api/ai/personalize`.
 * - Tự động đính kèm JWT Bearer token và User ID.
 * - Kiểm soát quyền riêng tư: Nếu người học tắt tính năng cá nhân hóa, tự động dùng bộ máy quy tắc chuẩn.
 * - Bộ đệm thông minh (Smart Caching) tránh gọi trùng lặp và tiết kiệm chi phí API.
 * - Tự động chuyển đổi sang Bộ máy Sư phạm Ngoại tuyến (Deterministic Offline Engine) khi mất mạng/hết quota.
 * - Kiểm tra tính hợp lệ của cấu trúc dữ liệu trả về trước khi render trên giao diện.
 * =========================================================================
 */

import { 
  buildComprehensiveLearnerContext, 
  sanitizeContextForAi, 
  isPersonalizationEnabled,
  LEARNER_STORAGE_KEYS 
} from './learnerContextService.js';

import {
  generateOfflinePersonalizedPlan,
  generateOfflineGrammarExplanation,
  generateOfflineExercises,
  diagnoseOfflineHskMistakes,
  recommendOfflineResources
} from './deterministicPersonalizationEngine.js';
import { supabase, isSupabaseConfigured } from '../supabase/config.js';

/**
 * Lấy Bearer Token và User ID của người dùng hiện tại
 */
async function getClientAuthHeaders(user = null) {
  let authToken = user?.token || user?.access_token || '';
  let authUid = user?.uid || user?.id || '';

  // 1. Trích xuất authoritative session JWT từ Supabase client nếu đã khởi tạo
  if (isSupabaseConfigured && supabase?.auth) {
    try {
      const { data: { session } = {} } = await supabase.auth.getSession();
      if (session?.access_token) {
        authToken = session.access_token;
      }
      if (session?.user?.id) {
        authUid = session.user.id;
      }
    } catch {}
  }

  // 2. Dự phòng đọc từ localStorage nếu session chưa kịp hydrate
  try {
    if (typeof localStorage !== 'undefined') {
      const rawUser = localStorage.getItem('hanzigo_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (!authUid) authUid = u.uid || u.id || '';
        if (!authToken) authToken = u.token || u.access_token || '';
      }
    }
  } catch {}

  // 3. Trong môi trường dev cục bộ (Vite dev), nếu chưa đăng nhập thì cung cấp uid dev để hỗ trợ kiểm thử
  if (!authUid && import.meta.env?.DEV) {
    authUid = 'dev_student_user';
  }

  return {
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...(authUid ? { 'x-user-id': authUid } : {})
  };
}

/**
 * Hàm điều phối chính gửi yêu cầu tới serverless `/api/ai/personalize`
 */
export async function invokeAiPersonalization({
  action,
  payload = {},
  user = null,
  bypassCache = false
}) {
  const enabled = isPersonalizationEnabled(user);
  const uid = user?.uid || user?.id || 'guest_learner';
  const today = new Date().toISOString().split('T')[0];
  const payloadTarget = payload.grammarPoint || payload.targetConcept || payload.questionId || payload.examId || payload.learningGoal || '';
  const payloadSubKey = payloadTarget ? `_${String(payloadTarget).replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_').slice(0, 30)}` : '';
  const cacheKey = `${LEARNER_STORAGE_KEYS.CACHE_PREFIX}_${uid}_${action}${payloadSubKey}_${today}`;

  // 1. Kiểm tra quyền riêng tư: Nếu tắt cá nhân hóa -> chạy deterministic offline ngay lập tức
  if (!enabled) {
    return {
      success: true,
      data: getOfflineResultForAction(action, payload, user),
      fromCache: false,
      isOffline: true,
      personalizationDisabled: true
    };
  }

  // 2. Kiểm tra Cache trong ngày
  if (!bypassCache) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { success: true, data: parsed, fromCache: true };
      }
    } catch {}
  }

  // 3. Chuẩn bị headers và dữ liệu đã làm sạch
  const authHeaders = await getClientAuthHeaders(user);
  const cleanPayload = sanitizeContextForAi(payload);

  // 4. Thử gọi backend serverless
  try {
    const response = await fetch('/api/ai/personalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        action,
        payload: cleanPayload
      })
    });

    if (response.ok) {
      const json = await response.json();
      if (json && typeof json === 'object') {
        // Lưu Cache
        try {
          localStorage.setItem(cacheKey, JSON.stringify(json));
        } catch {}

        return {
          success: true,
          data: json,
          fromCache: false,
          isOffline: false
        };
      }
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn(`[AI Gateway] Backend returned status ${response.status}:`, errData.error);
    }
  } catch (netErr) {
    console.warn(`[AI Gateway] Network or endpoint unreachable (${action}), activating offline heuristics:`, netErr.message);
  }

  // 5. Fallback an toàn sang Deterministic Offline Engine
  const offlineData = getOfflineResultForAction(action, cleanPayload, user);

  try {
    localStorage.setItem(cacheKey, JSON.stringify(offlineData));
  } catch {}

  return {
    success: true,
    data: offlineData,
    fromCache: false,
    isOffline: true
  };
}

/**
 * Trợ giúp điều hướng kết quả ngoại tuyến theo từng action
 */
function getOfflineResultForAction(action, payload, user) {
  const context = buildComprehensiveLearnerContext(user);

  switch (action) {
    case 'coach_plan':
      return generateOfflinePersonalizedPlan({ ...context, ...payload });

    case 'explain_grammar':
      return generateOfflineGrammarExplanation(payload.grammarPoint, payload.hskLevel || context.hskLevel);

    case 'generate_exercise':
      return generateOfflineExercises(payload.targetConcept, payload.hskLevel || context.hskLevel, payload.exerciseType);

    case 'diagnose_hsk_mistakes':
      return diagnoseOfflineHskMistakes(payload.mistakes || [], payload.attempts || []);

    case 'recommend_resources':
      return recommendOfflineResources({ ...context, ...payload }, payload.candidateMaterials || []);

    default:
      return { message: 'Offline result generated successfully.', isOffline: true };
  }
}

/**
 * Convenience method: Lấy kế hoạch học tập cá nhân hóa
 */
export async function getPersonalizedStudyPlan(user = null, options = {}) {
  const context = buildComprehensiveLearnerContext(user);
  return invokeAiPersonalization({
    action: 'coach_plan',
    payload: {
      ...context,
      ...options
    },
    user,
    bypassCache: options.bypassCache || false
  });
}

/**
 * Convenience method: Giải thích ngữ pháp theo ngữ cảnh
 */
export async function getContextualGrammarExplanation(grammarPoint, hskLevel = 'HSK 1', user = null) {
  return invokeAiPersonalization({
    action: 'explain_grammar',
    payload: {
      grammarPoint,
      hskLevel
    },
    user
  });
}

/**
 * Convenience method: Sinh bài tập cá nhân hóa
 */
export async function getPersonalizedExercises(targetConcept, hskLevel = 'HSK 1', exerciseType = 'multiple_choice', user = null) {
  return invokeAiPersonalization({
    action: 'generate_exercise',
    payload: {
      targetConcept,
      hskLevel,
      exerciseType
    },
    user
  });
}

/**
 * Convenience method: Chẩn đoán lỗi sai thi thử HSK
 */
export async function getHskMistakesDiagnosis(mistakes = [], attempts = [], user = null) {
  return invokeAiPersonalization({
    action: 'diagnose_hsk_mistakes',
    payload: {
      mistakes,
      attempts
    },
    user
  });
}

/**
 * Convenience method: Đề xuất tài liệu học tập phù hợp
 */
export async function getPersonalizedResourceRecommendations(user = null, candidateMaterials = []) {
  const context = buildComprehensiveLearnerContext(user);
  return invokeAiPersonalization({
    action: 'recommend_resources',
    payload: {
      ...context,
      candidateMaterials
    },
    user
  });
}

/**
 * Convenience method: Tra cứu Gia sư AI có kiểm chứng (Secure RAG + xKiro)
 * Tích hợp cá nhân hóa an toàn dựa trên hồ sơ học viên thực tế
 */
export async function askAiTutor({
  question,
  conversationId = null,
  contextType = 'general',
  learnerLevel = null,
  conversationHistory = [],
  learnerContext = null,
  user = null,
  bypassCache = false
}) {
  // Bộ đệm phản hồi tức thì (Instant Cache) cho câu hỏi đơn lẻ hoặc câu hỏi mẫu
  const effectiveLevel = learnerLevel || 'HSK 1';
  const cleanQ = (question || '').trim().toLowerCase();
  const cacheKey = `hanzigo_tutor_q_${contextType}_${effectiveLevel}_${cleanQ.slice(0, 40).replace(/[^a-z0-9_\u4e00-\u9fa5]/gi, '_')}`;

  if (!bypassCache && (!conversationHistory || conversationHistory.length === 0)) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.success && parsed.data) {
            return { ...parsed, fromCache: true };
          }
        }
      }
    } catch {}
  }

  const authHeaders = await getClientAuthHeaders(user);

  // Xử lý ngữ cảnh cá nhân hóa an toàn nếu được bật
  let safeLearnerContext = null;
  if (learnerContext) {
    safeLearnerContext = sanitizeContextForAi(learnerContext);
  } else if (isPersonalizationEnabled(user)) {
    try {
      const fullContext = buildComprehensiveLearnerContext(user);
      safeLearnerContext = sanitizeContextForAi(fullContext);
    } catch {}
  }

  try {
    const response = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        question,
        conversation_id: conversationId,
        context_type: contextType,
        learner_level: learnerLevel || safeLearnerContext?.targetHskLevel || null,
        conversation_history: conversationHistory,
        learner_context: safeLearnerContext
      })
    });

    if (response.ok) {
      const resData = await response.json();
      if (!bypassCache && (!conversationHistory || conversationHistory.length === 0) && resData?.success) {
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(cacheKey, JSON.stringify(resData));
          }
        } catch {}
      }
      return resData;
    }
    const errData = await response.json().catch(() => ({}));
    return {
      success: false,
      status: response.status,
      error: errData.error || `Lỗi Gia sư AI (HTTP ${response.status})`
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      error: `Lỗi kết nối tới Gia sư AI: ${err.message}`
    };
  }
}

