/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: MODEL ROUTER
 * =========================================================================
 * Routes Agent turns across lite / standard / reasoning Gemini tiers based
 * on intent, HSK 1-9 complexity, tool usage, and explicit budget flags.
 */

import { AGENT_INTENTS, HSK_TIERS, resolveHskTier } from '../_agent/contracts.js';

export const MODEL_TIERS = Object.freeze({
  LITE: 'lite',
  STANDARD: 'standard',
  REASONING: 'reasoning',
});

const TIER_DEFAULTS = Object.freeze({
  [MODEL_TIERS.LITE]: Object.freeze({
    maxOutputTokens: 600,
    temperature: 0.4,
    timeoutMs: 12000,
  }),
  [MODEL_TIERS.STANDARD]: Object.freeze({
    maxOutputTokens: 1000,
    temperature: 0.5,
    timeoutMs: 18000,
  }),
  [MODEL_TIERS.REASONING]: Object.freeze({
    maxOutputTokens: 1400,
    temperature: 0.35,
    timeoutMs: 24000,
  }),
});

export function getConfiguredModelMap() {
  const baseModel = (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();
  return {
    [MODEL_TIERS.LITE]: (process.env.GEMINI_MODEL_LITE || baseModel).trim(),
    [MODEL_TIERS.STANDARD]: (process.env.GEMINI_MODEL_STANDARD || baseModel).trim(),
    [MODEL_TIERS.REASONING]: (process.env.GEMINI_MODEL_REASONING || process.env.GEMINI_MODEL_STANDARD || baseModel).trim(),
  };
}

/**
 * Select the appropriate model tier without uncontrolled cost escalation.
 */
export function selectModelTier({
  intent = AGENT_INTENTS.GENERAL_TUTOR,
  hskLevel = 'HSK 1',
  hasTools = false,
  requiresDeepReasoning = false,
  allowPremiumTier = process.env.AI_ALLOW_PREMIUM_TIER === 'true',
} = {}) {
  const models = getConfiguredModelMap();
  const hskTier = resolveHskTier(hskLevel);
  const deepIntent =
    intent === AGENT_INTENTS.WRITING_COACH ||
    intent === AGENT_INTENTS.HSK_EXAM_COACH;
  const standardIntent =
    deepIntent ||
    intent === AGENT_INTENTS.GRAMMAR_TUTOR ||
    intent === AGENT_INTENTS.READING_TRANSLATION ||
    intent === AGENT_INTENTS.PROGRESS_COACH;

  const wantsReasoning =
    Boolean(requiresDeepReasoning) ||
    intent === AGENT_INTENTS.WRITING_COACH ||
    (intent === AGENT_INTENTS.HSK_EXAM_COACH && hskTier === HSK_TIERS.ADVANCED) ||
    hskTier === HSK_TIERS.ADVANCED;

  let selectedTier = MODEL_TIERS.LITE;
  let reason = 'lightweight_beginner_qa';

  if (wantsReasoning) {
    if (allowPremiumTier) {
      selectedTier = MODEL_TIERS.REASONING;
      reason = 'deep_reasoning_permitted';
    } else {
      selectedTier = MODEL_TIERS.STANDARD;
      reason = 'premium_tier_disabled_capped_at_standard';
    }
  } else if (hasTools || standardIntent || hskTier !== HSK_TIERS.BEGINNER) {
    selectedTier = MODEL_TIERS.STANDARD;
    reason = hasTools ? 'tool_calling_turn' : 'intermediate_or_structured_intent';
  }

  const defaults = TIER_DEFAULTS[selectedTier];
  return {
    tier: selectedTier,
    model: models[selectedTier],
    fallbackModel: models[MODEL_TIERS.LITE],
    maxOutputTokens: defaults.maxOutputTokens,
    temperature: defaults.temperature,
    timeoutMs: defaults.timeoutMs,
    reason,
  };
}
