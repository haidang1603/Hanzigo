/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: CORE CONTRACTS
 * =========================================================================
 * Shared constants, risk levels, evidence statuses, and payload factories
 * for the stateless Vercel Serverless AI Learning Agent.
 */

export const AGENT_INTENTS = Object.freeze({
  GENERAL_TUTOR: 'general_tutor',
  VOCAB_TUTOR: 'vocab_tutor',
  GRAMMAR_TUTOR: 'grammar_tutor',
  READING_TRANSLATION: 'reading_translation',
  WRITING_COACH: 'writing_coach',
  PRONUNCIATION_COACH: 'pronunciation_coach',
  HSK_EXAM_COACH: 'hsk_exam_coach',
  PROGRESS_COACH: 'progress_coach',
});

export const ALL_AGENT_INTENTS = Object.freeze(Object.values(AGENT_INTENTS));

export const RISK_LEVELS = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

export const EVIDENCE_STATUS = Object.freeze({
  GROUNDED: 'grounded',
  PARTIAL: 'partial',
  INSUFFICIENT_EVIDENCE: 'insufficient_evidence',
});

export const HSK_TIERS = Object.freeze({
  BEGINNER: 'beginner',         // HSK 1-3
  INTERMEDIATE: 'intermediate', // HSK 4-6
  ADVANCED: 'advanced',         // HSK 7-9
});

/**
 * Resolve normalized HSK tier ('beginner' | 'intermediate' | 'advanced')
 * from values like 'HSK 1', 'HSK 7-9', 4, etc.
 */
export function resolveHskTier(hskLevel = 'HSK 1') {
  const match = String(hskLevel || '').match(/(\d+)/);
  const numeric = match ? Number.parseInt(match[1], 10) : 1;
  if (numeric >= 7) return HSK_TIERS.ADVANCED;
  if (numeric >= 4) return HSK_TIERS.INTERMEDIATE;
  return HSK_TIERS.BEGINNER;
}

/**
 * Standard contract for a bounded Agent tool call.
 */
export function createToolCallContract({
  toolName,
  args = {},
  riskLevel = RISK_LEVELS.LOW,
  status = 'pending',
  latencyMs = 0,
} = {}) {
  return {
    toolName: String(toolName || ''),
    args: args && typeof args === 'object' ? args : {},
    riskLevel: Object.values(RISK_LEVELS).includes(riskLevel) ? riskLevel : RISK_LEVELS.LOW,
    status: String(status || 'pending'),
    latencyMs: Math.max(0, Number(latencyMs) || 0),
  };
}

/**
 * Standard contract for Human-in-the-Loop confirmation proposals.
 * AI never performs silent mutating writes without explicit user approval.
 */
export function createPendingConfirmationContract({
  actionType,
  label,
  payload = {},
  riskLevel = RISK_LEVELS.MEDIUM,
  requiresConfirmation = true,
} = {}) {
  return {
    actionType: String(actionType || ''),
    label: String(label || ''),
    payload: payload && typeof payload === 'object' ? payload : {},
    riskLevel: Object.values(RISK_LEVELS).includes(riskLevel) ? riskLevel : RISK_LEVELS.MEDIUM,
    requiresConfirmation: Boolean(requiresConfirmation),
  };
}

/**
 * Standard contract for safe frontend navigation / drawer actions.
 */
export function createUiActionContract({
  type,
  key,
  label,
  route = null,
} = {}) {
  return {
    type: String(type || ''),
    key: String(key || ''),
    label: String(label || ''),
    route: route ? String(route) : null,
  };
}
