/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: UNIFIED TOOL INDEX & ROLE FILTERING
 * =========================================================================
 * Registers all 10 real tools (6 Read-Only Knowledge + 4 Learner/Exam/Safe-Write)
 * and filters exposed tool declarations by verified user role.
 */

import { createToolRegistry } from '../toolRegistry.js';
import {
  READ_ONLY_KNOWLEDGE_TOOLS,
  registerKnowledgeTools,
} from './knowledgeTools.js';
import {
  LEARNER_EXAM_TOOLS,
  registerLearnerExamTools,
} from './learnerExamTools.js';

const PUBLIC_GUEST_TOOL_NAMES = Object.freeze(
  READ_ONLY_KNOWLEDGE_TOOLS.map((t) => t.name)
);

const AUTHENTICATED_TOOL_NAMES = Object.freeze([
  ...PUBLIC_GUEST_TOOL_NAMES,
  ...LEARNER_EXAM_TOOLS.map((t) => t.name),
]);

export function registerAllAgentTools(registry = createToolRegistry()) {
  registerKnowledgeTools(registry);
  registerLearnerExamTools(registry);
  return registry;
}

export function getAllowedToolNamesForRole(role = 'guest') {
  const normalized = String(role || 'guest').toLowerCase();
  if (normalized === 'student' || normalized === 'teacher' || normalized === 'admin') {
    return [...AUTHENTICATED_TOOL_NAMES];
  }
  return [...PUBLIC_GUEST_TOOL_NAMES];
}

export function getAgentToolDeclarationsForRole(registry, role = 'guest') {
  const allowedNames = getAllowedToolNamesForRole(role);
  return registry.getGeminiFunctionDeclarations(allowedNames);
}
