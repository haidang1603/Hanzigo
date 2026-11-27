/**
 * =========================================================================
 * HANZI GO - CONTEXTUAL SELECTION AI SERVICE
 * =========================================================================
 * - Zero-network 0ms dictionary lookup (CC-CEDICT / VOCABULARY_LIST local)
 * - Context sentence extraction around 。！？!?\n (max 240 chars)
 * - Session LRU Cache (max = 40 entries) keyed by (action, text, contextHash, hskLevel)
 * - Active AbortController cancellation on selection changes or popover dismissal
 * - Graceful 0-red-error fallback on 401 / 429 / 503 / offline
 * - User-isolated HITL SRS saving & PII-redacted handoff to Lão Sư AI (#conversation)
 * =========================================================================
 */

import { segmentChineseForLookup } from '../utils/localVocabLookup.js';
import {
  lookupUnifiedChineseWord,
  isValidVietnameseMeaning,
} from './unifiedLookupService.js';
import {
  MAX_SELECTION_LENGTH,
  MAX_CONTEXT_LENGTH,
  redactSelectionPii,
  extractContextSentence,
  extractContextSentenceFromDomSelection,
  cancelActiveSelectionRequest,
  setActiveSelectionController,
  getActiveSelectionController,
} from '../utils/selectionTextUtils.js';
import { evaluateRealPronunciation } from '../utils/pronunciationEvaluator.js';
import { getClientAuthHeaders } from '../supabase/config.js';
import { getUserStorageKey } from '../utils/gamification.js';
import { saveUserVocabSrsCard } from './vocabularyService.js';

export {
  MAX_SELECTION_LENGTH,
  MAX_CONTEXT_LENGTH,
  redactSelectionPii,
  extractContextSentence,
  extractContextSentenceFromDomSelection,
  cancelActiveSelectionRequest,
  isValidVietnameseMeaning,
};
export const MAX_LRU_CACHE_SIZE = 40;
export const SELECTION_TO_TUTOR_STORAGE_KEY = 'hanzigo_selection_tutor_prefill_v1';
export const SELECTION_SRS_STORAGE_BASE = 'hanzigo_selection_srs_cards_v1';

/**
 * Instant 0ms local dictionary lookup (no network request).
 */
export function lookupLocalSelectionEntry(selectedText = '') {
  const clean = String(selectedText || '').trim();
  if (!clean) {
    return {
      hanzi: '',
      traditional: '',
      pinyin: '',
      hanviet: '',
      sinoVietnamese: '',
      meaningVi: '',
      hskLevel: 'HSK',
      pos: '',
      relatedCompounds: [],
      found: false,
      tokens: [],
    };
  }

  const entry = lookupUnifiedChineseWord(clean) || {};
  const tokens = segmentChineseForLookup(clean)
    .filter((tok) => tok.isHanzi)
    .map((tok) => {
      const sub = lookupUnifiedChineseWord(tok.text);
      return {
        text: tok.text,
        pinyin: sub?.pinyin || '',
        meaningVi: sub?.found ? sub.meaningVi : '',
      };
    });

  return {
    hanzi: entry.hanzi || clean,
    traditional: entry.traditional || clean,
    pinyin: entry.pinyin || '',
    hanviet: entry.hanviet || '',
    sinoVietnamese: entry.sinoVietnamese || entry.hanviet || '',
    meaningVi: entry.meaningVi || '',
    hskLevel: entry.level || 'HSK',
    pos: entry.pos || '',
    relatedCompounds: Array.isArray(entry.relatedCompounds) ? entry.relatedCompounds : [],
    found: Boolean(entry.found),
    tokens,
  };
}

export function hashContextString(str = '') {
  let hash = 0x811c9dc5;
  const input = String(str || '');
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

export function buildSelectionCacheKey({
  action = 'context_explain',
  selectedText = '',
  contextSentence = '',
  userHskLevel = 'HSK 1',
}) {
  const cleanText = String(selectedText || '').trim();
  const cleanCtx = String(contextSentence || '').trim();
  const ctxHash = hashContextString(cleanCtx);
  const level = String(userHskLevel || 'HSK 1').trim() || 'HSK 1';
  return `${action}|${cleanText}|${ctxHash}|${level}`;
}

export class SelectionLruCache {
  constructor(maxSize = MAX_LRU_CACHE_SIZE) {
    this.maxSize = maxSize;
    this.store = new Map();
  }

  get(key) {
    if (!this.store.has(key)) return undefined;
    const val = this.store.get(key);
    this.store.delete(key);
    this.store.set(key, val);
    return val;
  }

  set(key, val) {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) this.store.delete(oldestKey);
    }
    this.store.set(key, val);
  }

  clear() {
    this.store.clear();
  }

  get size() {
    return this.store.size;
  }
}

const sessionInsightCache = new SelectionLruCache(MAX_LRU_CACHE_SIZE);

export function clearSelectionAiCache() {
  sessionInsightCache.clear();
}

export function getSelectionCacheSize() {
  return sessionInsightCache.size;
}

export function buildLocalSelectionInsightFallback({
  action = 'context_explain',
  selectedText = '',
  contextSentence = '',
  userHskLevel = 'HSK 1',
}) {
  const local = lookupLocalSelectionEntry(selectedText);
  const safeSentence = redactSelectionPii(contextSentence || selectedText);
  const hasDe = selectedText.includes('的');
  const hasLe = selectedText.includes('了');
  const hasZai = selectedText.includes('在');

  let grammarStructure = 'Cụm từ / Thành phần trong câu tiếng Trung';
  let pitfall =
    'Chú ý trật tự từ tiếng Trung: thành phần bổ nghĩa (định ngữ/trạng ngữ) luôn đứng trước thành phần chính.';

  if (hasDe) {
    grammarStructure = '[Định ngữ / Tính chất / Thời gian] + 的 + (Trung tâm ngữ)';
    pitfall = 'Cụm đứng trước 的 bổ nghĩa cho danh từ đứng sau, ngược với thứ tự “của” trong tiếng Việt.';
  } else if (hasLe) {
    grammarStructure = '[Động từ / Tính từ] + 了';
    pitfall = '了 có thể biểu thị hoàn thành động tác hoặc sự thay đổi tình huống mới.';
  } else if (hasZai) {
    grammarStructure = '在 + [Địa điểm / Động từ]';
    pitfall = 'Trạng ngữ “在 + địa điểm” thường đặt trước động từ thay vì đặt ở cuối câu như tiếng Việt.';
  }

  const breakdown =
    local.tokens.length > 0
      ? local.tokens.map((tok) => ({
          segment: tok.text,
          pinyin: tok.pinyin || '',
          role: tok.text === '的' ? 'Trợ từ kết cấu' : 'Thành tố từ vựng',
          meaningVi: tok.meaningVi || 'Chữ Hán thành phần',
        }))
      : [
          {
            segment: selectedText,
            pinyin: local.pinyin || '',
            role: local.pos || 'Cụm từ',
            meaningVi: local.meaningVi || 'Tra cứu từ điển nội bộ',
          },
        ];

  return {
    selectedText,
    pinyin: local.pinyin || '',
    contextualMeaningVi: local.found
      ? `${local.meaningVi} (ngữ cảnh: "${safeSentence}").`
      : `Cụm "${selectedText}" xuất hiện trong câu "${safeSentence}". Hãy kết hợp từ điển từng chữ bên dưới.`,
    grammarStructure,
    nuanceVi:
      action === 'grammar'
        ? `Phân tích cấu trúc nội bộ (${userHskLevel}). Đăng nhập để xem sắc thái ngữ cảnh chi tiết từ AI.`
        : `Dựa trên từ điển chuẩn nội bộ (${userHskLevel}).`,
    breakdown,
    vietnamesePitfall: pitfall,
    examples: [
      {
        chinese: safeSentence,
        pinyin: local.pinyin || '',
        vietnamese: local.found ? `${selectedText}: ${local.meaningVi}` : 'Câu gốc đang đọc',
      },
    ],
  };
}

function getFallbackNoticeForStatus(status) {
  if (status === 401) {
    return 'Đăng nhập để mở khóa phân tích AI theo ngữ cảnh chuyên sâu.';
  }
  if (status === 429) {
    return 'Bạn vừa đạt giới hạn lượt gọi AI hôm nay — đang dùng từ điển & ngữ pháp cục bộ.';
  }
  if (status === 503) {
    return 'Trợ lý AI đang bảo trì — đang hiển thị phân tích cục bộ.';
  }
  if (status === 403) {
    return 'Tính năng AI tạm khóa trong phiên thi CBT.';
  }
  return 'Đang dùng chế độ phân tích cục bộ (không mất kết nối học tập).';
}

export async function fetchSelectionAiInsight({
  action = 'context_explain',
  selectedText = '',
  contextSentence = '',
  userHskLevel = 'HSK 1',
  user = null,
  signal = null,
  fetchImpl = typeof fetch === 'function' ? fetch : null,
  getAuthHeadersImpl = getClientAuthHeaders,
} = {}) {
  const cleanText = redactSelectionPii(selectedText).slice(0, MAX_SELECTION_LENGTH + 1);
  if (!cleanText || cleanText.length > MAX_SELECTION_LENGTH) {
    return {
      ok: false,
      error: `Cụm chữ Hán phải dài từ 1 đến ${MAX_SELECTION_LENGTH} ký tự.`,
      insight: null,
    };
  }

  const safeContext = extractContextSentence(
    redactSelectionPii(contextSentence || cleanText),
    cleanText,
    MAX_CONTEXT_LENGTH
  );
  const safeLevel = String(userHskLevel || 'HSK 1').trim() || 'HSK 1';

  const cacheKey = buildSelectionCacheKey({
    action,
    selectedText: cleanText,
    contextSentence: safeContext,
    userHskLevel: safeLevel,
  });

  const cached = sessionInsightCache.get(cacheKey);
  if (cached) {
    return {
      ...cached,
      fromCache: true,
    };
  }

  cancelActiveSelectionRequest();
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  setActiveSelectionController(controller);

  let externalAbortHandler = null;
  if (signal && controller) {
    if (signal.aborted) {
      controller.abort();
      return { ok: false, aborted: true, insight: null };
    }
    externalAbortHandler = () => controller.abort();
    signal.addEventListener('abort', externalAbortHandler, { once: true });
  }

  const timeoutId = controller ? setTimeout(() => controller.abort(), 12000) : null;

  try {
    const authHeaders = (await getAuthHeadersImpl(user).catch(() => ({}))) || {};
    const hasAuth = Boolean(authHeaders.Authorization || authHeaders['x-user-id']);

    if (!hasAuth || !fetchImpl) {
      const localInsight = buildLocalSelectionInsightFallback({
        action,
        selectedText: cleanText,
        contextSentence: safeContext,
        userHskLevel: safeLevel,
      });
      return {
        ok: true,
        isAi: false,
        fromCache: false,
        authRequired: !hasAuth,
        fallbackNotice: !hasAuth
          ? getFallbackNoticeForStatus(401)
          : getFallbackNoticeForStatus(503),
        insight: localInsight,
      };
    }

    const res = await fetchImpl('/api/ai/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      ...(controller ? { signal: controller.signal } : {}),
      body: JSON.stringify({
        mode: 'selection_insight',
        action,
        selectedText: cleanText,
        contextSentence: safeContext,
        learner_level: safeLevel,
      }),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload?.success && payload?.insight) {
        const result = {
          ok: true,
          isAi: true,
          fromCache: false,
          authRequired: false,
          fallbackNotice: '',
          insight: payload.insight,
        };
        sessionInsightCache.set(cacheKey, result);
        return result;
      }
    }

    const fallbackInsight = buildLocalSelectionInsightFallback({
      action,
      selectedText: cleanText,
      contextSentence: safeContext,
      userHskLevel: safeLevel,
    });
    return {
      ok: true,
      isAi: false,
      fromCache: false,
      authRequired: res.status === 401,
      serviceUnavailable: res.status === 503,
      rateLimited: res.status === 429,
      fallbackNotice: getFallbackNoticeForStatus(res.status),
      insight: fallbackInsight,
    };
  } catch (err) {
    if (err?.name === 'AbortError') {
      return { ok: false, aborted: true, insight: null };
    }
    const fallbackInsight = buildLocalSelectionInsightFallback({
      action,
      selectedText: cleanText,
      contextSentence: safeContext,
      userHskLevel: safeLevel,
    });
    return {
      ok: true,
      isAi: false,
      fromCache: false,
      authRequired: false,
      fallbackNotice: getFallbackNoticeForStatus(503),
      insight: fallbackInsight,
    };
  } finally {
    if (timeoutId !== null) clearTimeout(timeoutId);
    if (signal && externalAbortHandler) {
      signal.removeEventListener('abort', externalAbortHandler);
    }
    if (getActiveSelectionController() === controller) {
      setActiveSelectionController(null);
    }
  }
}

export async function evaluateSelectionPronunciation({
  targetHanzi = '',
  targetPinyin = '',
  spokenTranscript = '',
  audioBase64 = null,
  mimeType = 'audio/webm',
  audioDurationMs = 0,
  hskLevel = 'HSK 1',
  user = null,
  signal = null,
  fetchImpl = typeof fetch === 'function' ? fetch : null,
  getAuthHeadersImpl = getClientAuthHeaders,
} = {}) {
  const cleanTarget = String(targetHanzi || '').trim().slice(0, MAX_SELECTION_LENGTH);
  if (!cleanTarget) {
    return {
      ok: false,
      error: 'Thiếu cụm chữ Hán cần chấm phát âm.',
    };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  let externalAbortHandler = null;
  if (signal && controller) {
    if (signal.aborted) {
      controller.abort();
      return { ok: false, aborted: true };
    }
    externalAbortHandler = () => controller.abort();
    signal.addEventListener('abort', externalAbortHandler, { once: true });
  }
  const timeoutId = controller ? setTimeout(() => controller.abort(), 12000) : null;

  let authRequired = false;
  let serviceStatus = 503;

  try {
    const authHeaders = (await getAuthHeadersImpl(user).catch(() => ({}))) || {};
    const hasAuth = Boolean(authHeaders.Authorization || authHeaders['x-user-id']);

    if (!hasAuth) {
      authRequired = true;
      serviceStatus = 401;
    } else if (fetchImpl) {
      const res = await fetchImpl('/api/ai/pronunciation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        ...(controller ? { signal: controller.signal } : {}),
        body: JSON.stringify({
          targetHanzi: cleanTarget,
          targetPinyin: String(targetPinyin || '').trim(),
          spokenTranscript: String(spokenTranscript || '').trim(),
          audioDurationMs: Number(audioDurationMs) || 0,
          audioBase64: audioBase64 || null,
          mimeType: mimeType || 'audio/webm',
          hskLevel: String(hskLevel || 'HSK 1'),
        }),
      });

      serviceStatus = res.status;
      if (res.status === 401) {
        authRequired = true;
      } else if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.result) {
          return {
            ok: true,
            isAiEvaluated: true,
            authRequired: false,
            fallbackNotice: '',
            result: data.result,
          };
        }
      }
    }
  } catch (err) {
    if (err?.name === 'AbortError') {
      return { ok: false, aborted: true };
    }
  } finally {
    if (timeoutId !== null) clearTimeout(timeoutId);
    if (signal && externalAbortHandler) {
      signal.removeEventListener('abort', externalAbortHandler);
    }
  }

  const localResult = evaluateRealPronunciation({
    targetHanzi: cleanTarget,
    targetPinyin: String(targetPinyin || ''),
    spokenTranscript: String(spokenTranscript || cleanTarget),
    audioDurationMs: Number(audioDurationMs) || 1200,
  });

  return {
    ok: true,
    isAiEvaluated: false,
    authRequired,
    fallbackNotice: authRequired
      ? 'Đang chấm khớp âm cục bộ — Đăng nhập để mở khóa phân tích thanh điệu AI chuyên sâu.'
      : getFallbackNoticeForStatus(serviceStatus),
    result: localResult,
  };
}

export function getSavedSelectionSrsCards(user = null) {
  try {
    if (typeof localStorage === 'undefined') return [];
    const scopedKey = getUserStorageKey(SELECTION_SRS_STORAGE_BASE, user);
    const raw = localStorage.getItem(scopedKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveSelectionToSrs({
  user = null,
  hanzi = '',
  pinyin = '',
  meaningVi = '',
  hskLevel = 'HSK 1',
  contextSentence = '',
} = {}) {
  const cleanHanzi = String(hanzi || '').trim().slice(0, MAX_SELECTION_LENGTH);
  if (!cleanHanzi) return { ok: false, error: 'Không có chữ Hán để lưu SRS.' };
  if (!isValidVietnameseMeaning(meaningVi)) {
    return {
      ok: false,
      error: 'Chưa có nghĩa tiếng Việt chuẩn để lưu SRS — hãy bấm "Giải thích theo ngữ cảnh (AI)" trước.',
    };
  }

  const scopedKey = getUserStorageKey(SELECTION_SRS_STORAGE_BASE, user);
  const existing = getSavedSelectionSrsCards(user);
  const card = {
    hanzi: cleanHanzi,
    pinyin: String(pinyin || '').trim(),
    meaning: String(meaningVi || '').trim(),
    level: String(hskLevel || 'HSK 1').trim(),
    contextSentence: redactSelectionPii(contextSentence || cleanHanzi).slice(0, MAX_CONTEXT_LENGTH),
    savedAt: new Date().toISOString(),
  };

  const nextList = [card, ...existing.filter((item) => item.hanzi !== cleanHanzi)].slice(0, 200);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(scopedKey, JSON.stringify(nextList));
    }
  } catch {}

  const userId = user?.id || user?.uid || null;
  if (userId) {
    try {
      await saveUserVocabSrsCard(userId, {
        hanzi: card.hanzi,
        pinyin: card.pinyin,
        meaning: card.meaning,
        level: card.level,
      });
    } catch {}
  }

  return { ok: true, storageKey: scopedKey, card };
}

export function buildTutorHandoffPrompt({ selectedText = '', contextSentence = '' } = {}) {
  const safeSelected = redactSelectionPii(selectedText).slice(0, MAX_SELECTION_LENGTH);
  const safeContext = redactSelectionPii(contextSentence).slice(0, MAX_CONTEXT_LENGTH);
  if (!safeSelected) return '';
  if (safeContext && safeContext !== safeSelected) {
    return `Lão Sư giúp em phân tích kỹ cụm "${safeSelected}" trong câu "${safeContext}" (nghĩa, cấu trúc ngữ pháp và cách đặt câu).`;
  }
  return `Lão Sư giúp em phân tích kỹ cụm "${safeSelected}" (nghĩa, thanh điệu và ví dụ thực tế).`;
}

export function handoffSelectionToAiTutor({ selectedText = '', contextSentence = '' } = {}) {
  const safeSelected = redactSelectionPii(selectedText).slice(0, MAX_SELECTION_LENGTH);
  const safeContext = redactSelectionPii(contextSentence).slice(0, MAX_CONTEXT_LENGTH);
  const prompt = buildTutorHandoffPrompt({
    selectedText: safeSelected,
    contextSentence: safeContext,
  });

  if (typeof sessionStorage !== 'undefined' && prompt) {
    try {
      sessionStorage.setItem(
        SELECTION_TO_TUTOR_STORAGE_KEY,
        JSON.stringify({
          prompt,
          selectedText: safeSelected,
          contextSentence: safeContext,
          createdAt: Date.now(),
        })
      );
    } catch {}
  }

  if (typeof window !== 'undefined') {
    window.location.hash = '#conversation/tutor';
  }
  return prompt;
}
