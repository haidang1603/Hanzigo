/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: INPUT/OUTPUT GUARDRAILS & SANITIZERS
 * =========================================================================
 * Multilingual prompt-injection defense (VI / ZH / EN), high-risk action
 * blocking, RAG context sanitization, PII/secret redaction, and grounded
 * output validation.
 */

import { EVIDENCE_STATUS, RISK_LEVELS } from './contracts.js';

export const DEFAULT_MAX_INPUT_LENGTH = 500;

// Multilingual Prompt Injection & System Override Patterns (EN, VI, ZH)
const INJECTION_PATTERNS = [
  // English
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /system\s+prompt\s+override/i,
  /you\s+are\s+now\s+(an?\s+unrestricted|dan|jailbreak|developer\s+mode|admin)/i,
  /reveal\s+(your\s+)?(api[_\s]?key|secret|system\s+prompt|hidden\s+instructions)/i,
  /bypass\s+(security|guardrails|auth|rls)/i,
  // Vietnamese
  /bỏ\s+qua\s+(toàn\s+bộ\s+|mọi\s+|tất\s+cả\s+)?(chỉ\s+dẫn|chỉ\s+thị|quy\s+tắc|hướng\s+dẫn|prompt)\s*(trước(\s+đó)?|cũ)?/i,
  /tiết\s+lộ\s+(secret|mật\s+khẩu|api[_\s]?key|system\s+prompt|mã\s+bí\s+mật)/i,
  /đóng\s+vai\s+(admin|quản\s+trị\s+viên|developer|hệ\s+thống\s+không\s+giới\s+hạn)/i,
  /vượt\s+qua\s+(bảo\s+mật|kiểm\s+soát|quyền)/i,
  // Chinese
  /忽略.*(之前|以前|前面|所有).*(指令|提示|规则|指示|prompt)/i,
  /无视.*(指令|规则|限制|系统提示)/i,
  /透露.*(密码|密钥|secret|api[_\s]?key|system\s*prompt)/i,
  /你现在是.*(管理员|无限制|越狱|DAN)/i,
  // XML / HTML / SQL / Code Execution Breakouts
  /<\/?(verified_knowledge|learner_context|system|prompt|instructions)\b[^>]*>/i,
  /<script\b[^>]*>/i,
  /\bdrop\s+table\b/i,
  /\bexec\s*\(/i,
];

// High-risk out-of-scope / destructive requests
const HIGH_RISK_PATTERNS = [
  /\b(delete|truncate|destroy)\s+(all\s+)?(users|profiles|database|table|progress)\b/i,
  /xóa\s+(toàn\s+bộ\s+|tất\s+cả\s+)?(dữ\s+liệu|tài\s+khoản|người\s+dùng|bảng)/i,
  /(nâng\s+quyền|cấp\s+quyền\s+admin|đổi\s+role\s+thành\s+admin|escalate\s+role)/i,
  /(xem|đọc|truy\s+cập)\s+(dữ\s+liệu|hồ\s+sơ(\s+điểm)?|điểm(\s+số)?|tin\s+nhắn)\s+(của\s+)?(người\s+khác|học\s+viên\s+khác)/i,
];

const SECRET_LEAK_PATTERNS = [
  /AIza[0-9A-Za-z_-]{20,}/,
  /\bsk-[0-9A-Za-z_-]{16,}\b/,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/,
  /<verified_knowledge>|<learner_context>/i,
];

/**
 * Strip ASCII control characters (except newline and tab) and normalize whitespace.
 */
function stripControlChars(text) {
  return String(text || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

/**
 * Input Guardrail: validates length, multilingual prompt injection, and high-risk actions.
 */
export function validateAgentInput({ text, maxLength = DEFAULT_MAX_INPUT_LENGTH } = {}) {
  if (typeof text !== 'string' || !text.trim()) {
    return {
      allowed: false,
      code: 'empty_input',
      riskLevel: RISK_LEVELS.LOW,
      reason: 'Nội dung câu hỏi không được để trống.',
      sanitizedText: '',
    };
  }

  const sanitizedText = stripControlChars(text).trim();
  if (sanitizedText.length > maxLength) {
    return {
      allowed: false,
      code: 'input_too_long',
      riskLevel: RISK_LEVELS.LOW,
      reason: `Độ dài câu hỏi vượt quá giới hạn cho phép (tối đa ${maxLength} ký tự).`,
      sanitizedText: sanitizedText.slice(0, maxLength),
    };
  }

  if (INJECTION_PATTERNS.some((pattern) => pattern.test(sanitizedText))) {
    return {
      allowed: false,
      code: 'prompt_injection_detected',
      riskLevel: RISK_LEVELS.HIGH,
      reason: 'Yêu cầu chứa cú pháp không hợp lệ hoặc có dấu hiệu can thiệp hệ thống.',
      sanitizedText: '',
    };
  }

  if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(sanitizedText))) {
    return {
      allowed: false,
      code: 'high_risk_action_blocked',
      riskLevel: RISK_LEVELS.HIGH,
      reason: 'Lão Sư AI không có quyền thực hiện thao tác xóa dữ liệu, nâng quyền hoặc truy cập dữ liệu người khác.',
      sanitizedText: '',
    };
  }

  return {
    allowed: true,
    code: 'ok',
    riskLevel: RISK_LEVELS.LOW,
    reason: null,
    sanitizedText,
  };
}

/**
 * RAG / Context Sanitizer: prevents closing XML tags or embedded directives
 * inside retrieved chunks from breaking out of <verified_knowledge> / <learner_context>.
 */
export function sanitizeUntrustedContext(rawContext = '') {
  if (rawContext === null || rawContext === undefined) return '';
  let clean = stripControlChars(
    typeof rawContext === 'string' ? rawContext : JSON.stringify(rawContext)
  );

  // Neutralize XML boundary breakouts & script tags
  clean = clean
    .replace(/<\/?(verified_knowledge|learner_context|system|prompt|instructions|script)\b[^>]*>/gi, '[filtered_tag]')
    .replace(/ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts)/gi, '[filtered_directive]')
    .replace(/bỏ\s+qua\s+(mọi\s+|toàn\s+bộ\s+)?(chỉ\s+dẫn|chỉ\s+thị|quy\s+tắc|prompt)/gi, '[filtered_directive]')
    .replace(/忽略.*(指令|提示|规则|prompt)/gi, '[filtered_directive]');

  return clean.trim();
}

/**
 * Redacts PII (emails, phone numbers) and secrets (JWT, Gemini/API keys)
 * recursively from strings, arrays, or plain objects before logging or forwarding.
 */
export function redactSensitiveData(value) {
  if (typeof value === 'string') {
    return value
      .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED]')
      .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, '[REDACTED_JWT]')
      .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, '[REDACTED_API_KEY]')
      .replace(/\bsk-[0-9A-Za-z_-]{16,}\b/g, '[REDACTED_API_KEY]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]')
      .replace(/(?:\+84|0)(?:[\s.-]?\d){8,10}\b/g, '[REDACTED_PHONE]');
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item));
  }

  if (value && typeof value === 'object') {
    const redactedObj = {};
    for (const [k, v] of Object.entries(value)) {
      if (/^(password|token|access_token|refresh_token|api_?key|secret)$/i.test(k)) {
        redactedObj[k] = '[REDACTED]';
      } else {
        redactedObj[k] = redactSensitiveData(v);
      }
    }
    return redactedObj;
  }

  return value;
}

/**
 * Output Guardrail: validates JSON structure, prevents secret/prompt leaks,
 * and blocks fabricated citations outside allowedSourceIds.
 */
export function validateAgentOutput({ output, allowedSourceIds = [] } = {}) {
  if (!output || typeof output !== 'object' || Array.isArray(output)) {
    return {
      valid: false,
      code: 'invalid_output_shape',
      reason: 'Phản hồi AI không đúng định dạng đối tượng JSON.',
      sanitizedOutput: null,
      droppedCitationsCount: 0,
    };
  }

  const serialized = JSON.stringify(output);
  if (SECRET_LEAK_PATTERNS.some((pattern) => pattern.test(serialized))) {
    return {
      valid: false,
      code: 'sensitive_output_leak',
      reason: 'Phản hồi bị chặn do chứa mẫu dữ liệu nhạy cảm hoặc thẻ hệ thống nội bộ.',
      sanitizedOutput: null,
      droppedCitationsCount: 0,
    };
  }

  const cloned = redactSensitiveData(output);
  const allowedSet = new Set(
    (Array.isArray(allowedSourceIds) ? allowedSourceIds : []).map((id) => String(id))
  );
  const evidenceStatus = cloned.evidence_status || EVIDENCE_STATUS.INSUFFICIENT_EVIDENCE;

  let droppedCitationsCount = 0;
  if (Array.isArray(cloned.citations)) {
    if (evidenceStatus === EVIDENCE_STATUS.INSUFFICIENT_EVIDENCE) {
      droppedCitationsCount = cloned.citations.length;
      cloned.citations = [];
    } else if (allowedSet.size > 0) {
      const verifiedCitations = cloned.citations.filter((c) => {
        const cid = c && typeof c === 'object' ? (c.source_id || c.id || c.key) : c;
        return cid !== undefined && cid !== null && allowedSet.has(String(cid));
      });
      droppedCitationsCount = cloned.citations.length - verifiedCitations.length;
      cloned.citations = verifiedCitations;
      if (verifiedCitations.length === 0 && droppedCitationsCount > 0) {
        cloned.evidence_status = EVIDENCE_STATUS.INSUFFICIENT_EVIDENCE;
      }
    }
  }

  return {
    valid: true,
    code: 'ok',
    reason: null,
    sanitizedOutput: cloned,
    droppedCitationsCount,
  };
}
