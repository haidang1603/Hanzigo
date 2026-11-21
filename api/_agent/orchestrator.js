/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: STATELESS AGENT ORCHESTRATOR
 * =========================================================================
 * Bounded stateless ReAct / Tool-Calling loop for Vercel Serverless:
 * - Step 1: Input Guardrails + Lightweight Intent Classification
 * - Step 2: Bounded Loop (MAX_TOOL_CALLS = 3, TOTAL_TIMEOUT_MS = 25000)
 * - Step 3: Output Guardrails & Grounded Citation Enforcement
 * - Step 4: Smart Deterministic Tool-Backed Fallback (429 / Timeout / Offline)
 */

import crypto from 'node:crypto';
import {
  AGENT_INTENTS,
  ALL_AGENT_INTENTS,
  EVIDENCE_STATUS,
} from './contracts.js';
import {
  validateAgentInput,
  validateAgentOutput,
  sanitizeUntrustedContext,
} from './guardrails.js';
import {
  getPromptEntry,
  buildAgentSystemPrompt,
} from './promptRegistry.js';
import { selectModelTier } from './modelRouter.js';
import {
  registerAllAgentTools,
  getAgentToolDeclarationsForRole,
} from './tools/index.js';
import {
  compressConversationHistory,
  buildSafeLearnerMemoryContext,
} from './memoryManager.js';
import {
  checkAgentRequestBudget,
  isCacheEligible,
  buildPublicCacheKey,
  getPublicCachedAnswer,
  setPublicCachedAnswer,
  buildAgentTraceRecord,
  emitAgentTrace,
} from './costAndObservability.js';
import { callAgentModelTurn } from '../_utils/aiProviderAdapter.js';

export const MAX_TOOL_CALLS = 3;
export const TOTAL_TIMEOUT_MS = 25000;

/**
 * Lightweight deterministic intent classifier over 8 specialized intents.
 */
export function classifyAgentIntent(message = '', explicitIntent = null) {
  if (explicitIntent && ALL_AGENT_INTENTS.includes(explicitIntent)) {
    return explicitIntent;
  }

  const text = String(message || '').toLowerCase();
  if (/đề thi|câu hỏi hsk|đáp án|bẫy|cbt|h\d{5}|q-hsk/.test(text)) {
    return AGENT_INTENTS.HSK_EXAM_COACH;
  }
  if (/viết chữ|bút thuận|chiết tự|bộ thủ|số nét|viết đoạn/.test(text)) {
    return AGENT_INTENTS.WRITING_COACH;
  }
  if (/phát âm|thanh điệu|biến điệu|thanh \d|bật hơi|khẩu hình|pinyin/.test(text)) {
    return AGENT_INTENTS.PRONUNCIATION_COACH;
  }
  if (/ngữ pháp|cấu trúc|sửa câu|trợ từ|câu chữ|把|被|比|了|着|过/.test(text)) {
    return AGENT_INTENTS.GRAMMAR_TUTOR;
  }
  if (/dịch|đoạn văn|đọc hiểu|tín đạt nhã|thành ngữ|chengyu/.test(text)) {
    return AGENT_INTENTS.READING_TRANSLATION;
  }
  if (/lộ trình|tiến độ|hôm nay học gì|kê đơn|srs|ôn tập|điểm yếu/.test(text)) {
    return AGENT_INTENTS.PROGRESS_COACH;
  }
  if (/từ vựng|nghĩa là gì|phân biệt|tra từ/.test(text)) {
    return AGENT_INTENTS.VOCAB_TUTOR;
  }
  return AGENT_INTENTS.GENERAL_TUTOR;
}

function buildConversationContents(history = [], userMessage = '') {
  const safeHistory = Array.isArray(history)
    ? history.slice(-8).map((msg) => ({
        role: msg?.role === 'user' || msg?.sender === 'user' ? 'user' : 'model',
        parts: [{ text: sanitizeUntrustedContext(String(msg?.content || msg?.text || msg?.answer || '')).slice(0, 300) }],
      }))
    : [];

  return [
    ...safeHistory,
    { role: 'user', parts: [{ text: userMessage }] },
  ];
}

function collectToolArtifacts(toolRes, state) {
  state.toolsUsed.push({
    toolName: toolRes.toolName,
    ok: toolRes.ok,
    latencyMs: toolRes.latencyMs,
  });

  if (!toolRes.ok) return;

  for (const src of toolRes.sources || []) {
    if (!src?.sourceId || state.allowedSourceSet.has(src.sourceId)) continue;
    state.allowedSourceSet.add(src.sourceId);
    state.citations.push({
      source_id: src.sourceId,
      title: src.title,
      type: src.type,
      verified: src.verified !== false,
    });
  }

  if (Array.isArray(toolRes.data?.uiActions)) {
    state.uiActions.push(...toolRes.data.uiActions);
  }
  if (toolRes.data?.pendingConfirmation) {
    state.pendingConfirmations.push(toolRes.data.pendingConfirmation);
  }
}

async function runDeterministicFallback({
  message,
  intent,
  hskLevel,
  toolRegistry,
  executionContext,
  state,
}) {
  const hanziMatches = message.match(/[\u4e00-\u9fa5\u3400-\u4dbf]+/g) || [];
  const primaryTerm = hanziMatches[0] || message.slice(0, 40);

  const fallbackPlan = [];
  if (intent === AGENT_INTENTS.WRITING_COACH && hanziMatches[0]) {
    fallbackPlan.push({ name: 'lookup_hanzi_decomposition', args: { character: hanziMatches[0].slice(0, 4) } });
  } else if (intent === AGENT_INTENTS.GRAMMAR_TUTOR) {
    fallbackPlan.push({ name: 'lookup_grammar_pattern', args: { query: primaryTerm, hskLevel } });
  } else {
    fallbackPlan.push({ name: 'lookup_dictionary_entry', args: { query: primaryTerm, hskLevel, limit: 3 } });
  }
  fallbackPlan.push({ name: 'search_curated_knowledge', args: { query: message.slice(0, 120), hskLevel, limit: 2 } });

  const snippets = [];
  for (const step of fallbackPlan.slice(0, 2)) {
    if (!toolRegistry.has(step.name)) continue;
    const res = await toolRegistry.executeTool(step.name, step.args, executionContext);
    collectToolArtifacts(res, state);
    if (res.ok && res.data?.found && Array.isArray(res.data.items) && res.data.items.length > 0) {
      const top = res.data.items[0];
      if (top.hanzi && top.meaning) {
        snippets.push(`**${top.hanzi}** (${top.pinyin || ''}): ${top.meaning}`);
      } else if (top.character) {
        snippets.push(`Chữ **${top.character}** (bộ thủ: ${top.radical || 'đang cập nhật'}, ${top.strokes || '?'} nét).`);
      } else if (top.title && top.meaning) {
        snippets.push(`**${top.title}**: ${top.meaning}`);
      } else if (top.simplified && top.meaning) {
        snippets.push(`**${top.simplified}** (${top.pinyin || ''}): ${top.meaning}`);
      }
    }
  }

  if (snippets.length > 0) {
    return `Hệ thống AI tạm thời quá tải nên Lão Sư đã tra cứu trực tiếp từ kho giáo trình kiểm duyệt:\n- ${snippets.join('\n- ')}`;
  }
  return 'Hệ thống AI tạm thời quá tải và kho dữ liệu cục bộ chưa tìm thấy mục khớp trực tiếp cho câu hỏi này. Bạn vui lòng thử lại sau giây lát hoặc nhập từ khóa chữ Hán/Pinyin cụ thể hơn.';
}

/**
 * Execute the bounded stateless Agent loop for one user turn.
 */
export async function runAgentOrchestrator({
  message,
  history = [],
  hskLevel = 'HSK 1',
  explicitIntent = null,
  executionContext = {},
  modelTurnFn = callAgentModelTurn,
  registry = null,
} = {}) {
  const startedAt = Date.now();
  const requestId = executionContext?.requestId || crypto.randomUUID();

  // 1. Input Guardrails
  const inputCheck = validateAgentInput({ text: message });
  const intent = classifyAgentIntent(message, explicitIntent);
  const promptEntry = getPromptEntry(intent);

  if (!inputCheck.allowed) {
    return {
      ok: false,
      blocked: true,
      answer: inputCheck.reason,
      structured: null,
      intent,
      evidenceStatus: EVIDENCE_STATUS.INSUFFICIENT_EVIDENCE,
      citations: [],
      toolsUsed: [],
      uiActions: [],
      pendingConfirmations: [],
      metadata: {
        requestId,
        promptId: promptEntry.promptId,
        promptVersion: promptEntry.version,
        model: null,
        tier: null,
        stepsCount: 0,
        toolCallsCount: 0,
        latencyMs: Date.now() - startedAt,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        costUsd: 0,
        fallbackUsed: false,
        blockCode: inputCheck.code,
      },
    };
  }

  // 2. Setup Role-Scoped Tools, Controlled Memory, Model Router & Prompt
  const toolRegistry = registry || registerAllAgentTools();
  const role = executionContext?.role || executionContext?.user?.role || (executionContext?.user?.id ? 'student' : 'guest');
  const toolDeclarations = getAgentToolDeclarationsForRole(toolRegistry, role);
  const routingDecision = selectModelTier({
    intent,
    hskLevel,
    hasTools: toolDeclarations.length > 0,
  });

  const memoryEnabled =
    typeof executionContext?.memoryEnabled === 'boolean'
      ? executionContext.memoryEnabled
      : Boolean(executionContext?.user?.id);

  const compressedHistory = memoryEnabled
    ? compressConversationHistory(history, {
        existingSummary: executionContext?.sessionSummary || '',
      })
    : { recentTurns: Array.isArray(history) ? history.slice(-4) : [], sessionSummary: '', compressedCount: 0 };

  const memoryContext = buildSafeLearnerMemoryContext({
    hskLevel,
    memoryEnabled,
    learnerProfile: executionContext?.learnerProfile || null,
    learningMemory: executionContext?.learningMemory || null,
    sessionSummary: compressedHistory.sessionSummary || executionContext?.sessionSummary || '',
  });

  const combinedLearnerContext = [
    memoryContext.contextText,
    executionContext?.learnerContextSummary || '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const systemInstruction = buildAgentSystemPrompt({
    intent,
    hskLevel,
    learnerContext: combinedLearnerContext,
  });

  const contents = buildConversationContents(compressedHistory.recentTurns, inputCheck.sanitizedText);
  const traceId = crypto.randomUUID();
  const cacheAdapter = executionContext?.cacheAdapter || null;
  const traceSink = executionContext?.traceSink || null;
  const canUsePublicCache = isCacheEligible({
    intent,
    memoryApplied: memoryContext.memoryApplied,
    history,
  });
  const cacheKey = canUsePublicCache
    ? buildPublicCacheKey({
        query: inputCheck.sanitizedText,
        intent,
        hskLevel,
        promptVersion: promptEntry.version,
        modelTier: routingDecision.tier,
      })
    : null;

  if (cacheKey) {
    const cached = await getPublicCachedAnswer(cacheKey, { cacheAdapter });
    if (cached && cached.answer) {
      const latencyMs = Date.now() - startedAt;
      emitAgentTrace(
        buildAgentTraceRecord({
          traceId,
          requestId,
          userId: executionContext?.user?.id || null,
          intent,
          tier: routingDecision.tier,
          model: cached.model || routingDecision.model,
          promptId: promptEntry.promptId,
          promptVersion: promptEntry.version,
          evidenceStatus: cached.evidenceStatus || EVIDENCE_STATUS.GROUNDED,
          ragSourceIds: (cached.citations || []).map((c) => c.source_id).filter(Boolean),
          cacheHit: true,
          memoryApplied: false,
          latencyMs,
          status: 'ok',
        }),
        { sink: traceSink }
      );

      return {
        ok: true,
        blocked: false,
        answer: cached.answer,
        structured: cached.structured || null,
        intent,
        evidenceStatus: cached.evidenceStatus || EVIDENCE_STATUS.GROUNDED,
        citations: cached.citations || [],
        toolsUsed: cached.toolsUsed || [],
        uiActions: cached.uiActions || [],
        pendingConfirmations: [],
        metadata: {
          requestId,
          trace_id: traceId,
          promptId: promptEntry.promptId,
          promptVersion: promptEntry.version,
          model: cached.model || routingDecision.model,
          tier: routingDecision.tier,
          stepsCount: 0,
          toolCallsCount: 0,
          latencyMs,
          usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          costUsd: 0,
          fallbackUsed: false,
          memory_applied: false,
          compressed_turns: 0,
          cache_hit: true,
          budget_capped: false,
        },
      };
    }
  }

  const state = {
    toolsUsed: [],
    allowedSourceSet: new Set(),
    citations: [],
    uiActions: [],
    pendingConfirmations: [],
  };
  const executedCallKeys = new Set();

  let stepsCount = 0;
  let toolCallsCount = 0;
  let finalAnswer = '';
  let finalStructured = null;
  let lastModel = routingDecision.model;
  let totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  let totalCostUsd = 0;
  let fallbackUsed = false;
  let fallbackReason = null;
  let loopCompletedWithAnswer = false;
  let budgetCapped = false;

  // 3. Bounded Stateless Agent Loop (MAX_TOOL_CALLS = 3)
  while (stepsCount <= MAX_TOOL_CALLS) {
    const elapsed = Date.now() - startedAt;
    const remainingMs = TOTAL_TIMEOUT_MS - elapsed;
    if (remainingMs <= 500) {
      fallbackReason = 'total_timeout_exceeded';
      break;
    }

    const canCallTools = toolCallsCount < MAX_TOOL_CALLS && toolDeclarations.length > 0;
    const turnRes = await modelTurnFn({
      systemInstruction,
      contents,
      tools: canCallTools ? [{ functionDeclarations: toolDeclarations }] : [],
      routingDecision,
      timeoutMs: Math.min(routingDecision.timeoutMs, remainingMs),
    });

    stepsCount += 1;
    if (turnRes?.model) lastModel = turnRes.model;
    if (turnRes?.fallbackUsed) fallbackUsed = true;
    if (turnRes?.usage) {
      totalUsage.promptTokens += Number(turnRes.usage.promptTokens || 0);
      totalUsage.completionTokens += Number(turnRes.usage.completionTokens || 0);
      totalUsage.totalTokens += Number(turnRes.usage.totalTokens || 0);
    }
    totalCostUsd = Number((totalCostUsd + Number(turnRes?.costUsd || 0)).toFixed(8));

    const budgetCheck = checkAgentRequestBudget({
      totalTokens: totalUsage.totalTokens,
      costUsd: totalCostUsd,
      maxTotalTokens: executionContext?.maxRequestTotalTokens,
      maxCostUsd: executionContext?.maxRequestCostUsd,
    });
    if (!budgetCheck.withinBudget) {
      budgetCapped = true;
      fallbackReason = budgetCheck.reason;
      if (turnRes?.success && turnRes.type === 'final_text') {
        finalStructured = turnRes.parsedJson || null;
        finalAnswer = finalStructured?.answer || turnRes.text || '';
        loopCompletedWithAnswer = Boolean(finalAnswer);
      }
      break;
    }

    if (!turnRes?.success) {
      fallbackReason = turnRes?.code || turnRes?.error || 'model_turn_failed';
      break;
    }

    if (turnRes.type === 'tool_calls' && Array.isArray(turnRes.toolCalls) && turnRes.toolCalls.length > 0 && canCallTools) {
      const functionResponseParts = [];
      const modelFunctionCallParts = [];
      let executedInThisTurn = 0;

      for (const tc of turnRes.toolCalls) {
        if (toolCallsCount >= MAX_TOOL_CALLS) break;
        const callKey = `${tc.name}:${JSON.stringify(tc.args || {})}`;
        if (executedCallKeys.has(callKey)) {
          modelFunctionCallParts.push({ functionCall: { name: tc.name, args: tc.args || {} } });
          functionResponseParts.push({
            functionResponse: {
              name: tc.name,
              response: { ok: false, error: 'Duplicate tool call skipped; reuse earlier result.' },
            },
          });
          continue;
        }

        executedCallKeys.add(callKey);
        toolCallsCount += 1;
        executedInThisTurn += 1;

        const toolRes = await toolRegistry.executeTool(tc.name, tc.args || {}, executionContext);
        collectToolArtifacts(toolRes, state);

        modelFunctionCallParts.push({ functionCall: { name: tc.name, args: tc.args || {} } });
        functionResponseParts.push({
          functionResponse: {
            name: tc.name,
            response: toolRes.ok ? toolRes.data : { ok: false, error: toolRes.error },
          },
        });
      }

      if (executedInThisTurn === 0) {
        // Model only repeated already-executed calls; force final synthesis without tools
        const synthRes = await modelTurnFn({
          systemInstruction,
          contents: [
            ...contents,
            { role: 'model', parts: modelFunctionCallParts },
            { role: 'user', parts: functionResponseParts },
          ],
          tools: [],
          routingDecision,
          timeoutMs: Math.max(1000, TOTAL_TIMEOUT_MS - (Date.now() - startedAt)),
        });
        stepsCount += 1;
        if (synthRes?.success) {
          finalAnswer = synthRes.parsedJson?.answer || synthRes.text || '';
          finalStructured = synthRes.parsedJson || null;
          loopCompletedWithAnswer = Boolean(finalAnswer);
        } else {
          fallbackReason = synthRes?.code || 'synthesis_turn_failed';
        }
        break;
      }

      contents.push({ role: 'model', parts: modelFunctionCallParts });
      contents.push({ role: 'user', parts: functionResponseParts });
      continue;
    }

    // Final text/JSON response
    finalStructured = turnRes.parsedJson || null;
    finalAnswer = finalStructured?.answer || turnRes.text || '';
    loopCompletedWithAnswer = Boolean(finalAnswer);
    break;
  }

  // 4. Smart Deterministic Fallback if model loop did not produce an answer
  if (!loopCompletedWithAnswer) {
    fallbackUsed = true;
    fallbackReason = fallbackReason || 'empty_model_synthesis';
    finalAnswer = await runDeterministicFallback({
      message: inputCheck.sanitizedText,
      intent,
      hskLevel,
      toolRegistry,
      executionContext,
      state,
    });
  }

  // 5. Output Guardrails & Grounded Citation Enforcement
  const allowedSourceIds = Array.from(state.allowedSourceSet);
  const rawCitations = Array.isArray(finalStructured?.citations) && finalStructured.citations.length > 0
    ? finalStructured.citations
    : state.citations;

  const computedEvidenceStatus =
    state.citations.length > 0
      ? EVIDENCE_STATUS.GROUNDED
      : EVIDENCE_STATUS.INSUFFICIENT_EVIDENCE;

  const outputCheck = validateAgentOutput({
    output: {
      answer: finalAnswer,
      structured: finalStructured,
      evidence_status: computedEvidenceStatus,
      citations: rawCitations,
    },
    allowedSourceIds,
  });

  if (!outputCheck.valid) {
    return {
      ok: false,
      blocked: true,
      answer: outputCheck.reason,
      structured: null,
      intent,
      evidenceStatus: EVIDENCE_STATUS.INSUFFICIENT_EVIDENCE,
      citations: [],
      toolsUsed: state.toolsUsed,
      uiActions: state.uiActions,
      pendingConfirmations: [],
      metadata: {
        requestId,
        promptId: promptEntry.promptId,
        promptVersion: promptEntry.version,
        model: lastModel,
        tier: routingDecision.tier,
        stepsCount,
        toolCallsCount,
        latencyMs: Date.now() - startedAt,
        usage: totalUsage,
        costUsd: totalCostUsd,
        fallbackUsed,
        fallbackReason,
        blockCode: outputCheck.code,
      },
    };
  }

  const cleanOutput = outputCheck.sanitizedOutput;
  const finalLatencyMs = Date.now() - startedAt;
  const finalEvidenceStatus = cleanOutput.evidence_status || computedEvidenceStatus;
  const finalCitations = cleanOutput.citations || [];

  if (
    cacheKey &&
    !fallbackUsed &&
    !budgetCapped &&
    isCacheEligible({
      intent,
      memoryApplied: memoryContext.memoryApplied,
      history,
      toolsUsed: state.toolsUsed,
    })
  ) {
    await setPublicCachedAnswer(
      cacheKey,
      {
        answer: cleanOutput.answer,
        structured: cleanOutput.structured || null,
        evidenceStatus: finalEvidenceStatus,
        citations: finalCitations,
        toolsUsed: state.toolsUsed,
        uiActions: state.uiActions,
        model: lastModel,
      },
      { cacheAdapter }
    );
  }

  emitAgentTrace(
    buildAgentTraceRecord({
      traceId,
      requestId,
      userId: executionContext?.user?.id || null,
      intent,
      tier: routingDecision.tier,
      model: lastModel,
      promptId: promptEntry.promptId,
      promptVersion: promptEntry.version,
      stepsCount,
      toolCallsCount,
      toolsUsed: state.toolsUsed,
      ragSourceIds: allowedSourceIds,
      evidenceStatus: finalEvidenceStatus,
      cacheHit: false,
      budgetCapped,
      fallbackUsed,
      fallbackReason,
      memoryApplied: memoryContext.memoryApplied,
      totalTokens: totalUsage.totalTokens,
      costUsd: totalCostUsd,
      latencyMs: finalLatencyMs,
      status: 'ok',
    }),
    { sink: traceSink }
  );

  return {
    ok: true,
    blocked: false,
    answer: cleanOutput.answer,
    structured: cleanOutput.structured || null,
    intent,
    evidenceStatus: finalEvidenceStatus,
    citations: finalCitations,
    toolsUsed: state.toolsUsed,
    uiActions: state.uiActions,
    pendingConfirmations: state.pendingConfirmations,
    metadata: {
      requestId,
      trace_id: traceId,
      promptId: promptEntry.promptId,
      promptVersion: promptEntry.version,
      model: lastModel,
      tier: routingDecision.tier,
      stepsCount,
      toolCallsCount,
      latencyMs: finalLatencyMs,
      usage: totalUsage,
      costUsd: totalCostUsd,
      fallbackUsed,
      memory_applied: memoryContext.memoryApplied,
      compressed_turns: compressedHistory.compressedCount,
      cache_hit: false,
      budget_capped: budgetCapped,
      ...(fallbackReason ? { fallbackReason } : {}),
    },
  };
}
