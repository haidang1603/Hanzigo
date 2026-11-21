/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: CONTROLLED LEARNER MEMORY & COMPRESSION
 * =========================================================================
 * - Deterministic multi-turn history compression (sliding window + <= 600 char
 *   sessionSummary) at zero extra LLM cost.
 * - Controlled 3-layer memory assembly (learnerProfile + verified learningMemory
 *   + sessionSummary) strictly respecting user opt-in/opt-out.
 * - Anti-memory-poisoning & PII/secret redaction via Task 02 guardrails.
 */

import { redactSensitiveData, sanitizeUntrustedContext } from './guardrails.js';

export const MAX_WINDOW_TURNS = 6;
export const MAX_SESSION_SUMMARY_CHARS = 600;

function extractMsgText(msg) {
  if (!msg) return '';
  if (typeof msg === 'string') return msg;
  return String(msg.content || msg.text || msg.answer || '');
}

/**
 * Compress long multi-turn history into a recent sliding window plus a
 * compact deterministic sessionSummary (<= 600 chars).
 */
export function compressConversationHistory(
  history = [],
  { maxWindowTurns = MAX_WINDOW_TURNS, existingSummary = '' } = {}
) {
  const safeList = Array.isArray(history) ? history : [];
  const windowSize = Math.max(1, Math.min(10, Number(maxWindowTurns) || MAX_WINDOW_TURNS));

  if (safeList.length <= windowSize) {
    const cleanExisting = sanitizeUntrustedContext(redactSensitiveData(String(existingSummary || ''))).slice(
      0,
      MAX_SESSION_SUMMARY_CHARS
    );
    return {
      recentTurns: safeList,
      sessionSummary: cleanExisting,
      compressedCount: 0,
    };
  }

  const olderTurns = safeList.slice(0, safeList.length - windowSize);
  const recentTurns = safeList.slice(-windowSize);

  const hanziSet = new Set();
  const lessonSet = new Set();
  let lastOlderUserQuestion = '';

  for (const turn of olderTurns) {
    const raw = extractMsgText(turn);
    const cleaned = sanitizeUntrustedContext(redactSensitiveData(raw));
    const hanziMatches = cleaned.match(/[\u4e00-\u9fa5\u3400-\u4dbf]{1,6}/g) || [];
    for (const h of hanziMatches) {
      if (hanziSet.size < 12) hanziSet.add(h);
    }
    const lessonMatches = cleaned.match(/\bl-\d{3}\b/gi) || [];
    for (const l of lessonMatches) {
      if (lessonSet.size < 4) lessonSet.add(l.toLowerCase());
    }
    if (turn?.role === 'user' || turn?.sender === 'user') {
      lastOlderUserQuestion = cleaned.slice(0, 120);
    }
  }

  const parts = [];
  if (existingSummary) {
    parts.push(sanitizeUntrustedContext(redactSensitiveData(String(existingSummary))).slice(0, 180));
  }
  if (hanziSet.size > 0) {
    parts.push(`Từ/chữ đã thảo luận: ${Array.from(hanziSet).join(', ')}`);
  }
  if (lessonSet.size > 0) {
    parts.push(`Bài học liên quan: ${Array.from(lessonSet).join(', ')}`);
  }
  if (lastOlderUserQuestion) {
    parts.push(`Câu hỏi trước đó: "${lastOlderUserQuestion}"`);
  }

  const combined = parts.filter(Boolean).join(' | ');
  const sessionSummary = sanitizeUntrustedContext(redactSensitiveData(combined)).slice(
    0,
    MAX_SESSION_SUMMARY_CHARS
  );

  return {
    recentTurns,
    sessionSummary,
    compressedCount: olderTurns.length,
  };
}

/**
 * Assemble controlled 3-layer learner memory context for <learner_context>.
 * Strictly enforces memoryEnabled opt-out and prevents unverified mistake fabrication.
 */
export function buildSafeLearnerMemoryContext({
  hskLevel = 'HSK 1',
  memoryEnabled = true,
  learnerProfile = null,
  learningMemory = null,
  sessionSummary = '',
} = {}) {
  const safeHsk = sanitizeUntrustedContext(String(hskLevel || 'HSK 1')).slice(0, 20);

  if (!memoryEnabled) {
    return {
      memoryApplied: false,
      contextText: `Trình độ mục tiêu: ${safeHsk} (Chế độ không lưu/không áp dụng ký ức học tập).`,
    };
  }

  const lines = [];
  let hasVerifiedMemory = false;

  // Layer 1: Learner Profile (Goal & Completed Lessons)
  if (learnerProfile && typeof learnerProfile === 'object') {
    const cleanProfile = redactSensitiveData(learnerProfile);
    const goal = cleanProfile.learningGoal ? sanitizeUntrustedContext(cleanProfile.learningGoal).slice(0, 60) : null;
    const completed = Number.isFinite(Number(cleanProfile.completedLessonsCount))
      ? Math.max(0, Math.floor(Number(cleanProfile.completedLessonsCount)))
      : null;
    lines.push(`Trình độ: ${safeHsk}${goal ? ` | Mục tiêu: ${goal}` : ''}${completed !== null ? ` | Đã học: ${completed} bài` : ''}`);
    if (goal || (completed !== null && completed > 0)) {
      hasVerifiedMemory = true;
    }
  } else {
    lines.push(`Trình độ: ${safeHsk}`);
  }

  // Layer 2: Verified Learning Memory (SRS due words, confirmed mistakes, recent topics)
  if (learningMemory && typeof learningMemory === 'object') {
    const cleanMem = redactSensitiveData(learningMemory);
    const confirmedMistakes = Array.isArray(cleanMem.confirmedMistakes)
      ? cleanMem.confirmedMistakes
          .map((m) => sanitizeUntrustedContext(typeof m === 'string' ? m : (m?.topic || m?.label || '')))
          .filter(Boolean)
          .slice(0, 5)
      : [];
    const dueVocab = Array.isArray(cleanMem.dueVocabWords)
      ? cleanMem.dueVocabWords
          .map((w) => sanitizeUntrustedContext(String(w || '')))
          .filter(Boolean)
          .slice(0, 8)
      : [];
    const recentTopics = Array.isArray(cleanMem.recentTopics)
      ? cleanMem.recentTopics
          .map((t) => sanitizeUntrustedContext(String(t || '')))
          .filter(Boolean)
          .slice(0, 5)
      : [];

    if (confirmedMistakes.length > 0) {
      hasVerifiedMemory = true;
      lines.push(`Lỗi sai ĐÃ XÁC NHẬN từ bài tập: ${confirmedMistakes.join('; ')}`);
    }
    if (dueVocab.length > 0) {
      hasVerifiedMemory = true;
      lines.push(`Từ vựng SRS cần ôn: ${dueVocab.join(', ')}`);
    }
    if (recentTopics.length > 0) {
      hasVerifiedMemory = true;
      lines.push(`Chủ đề vừa quan tâm: ${recentTopics.join(', ')}`);
    }
  }

  // Layer 3: Compressed Session Summary
  const cleanSummary = sanitizeUntrustedContext(redactSensitiveData(String(sessionSummary || ''))).slice(
    0,
    MAX_SESSION_SUMMARY_CHARS
  );
  if (cleanSummary) {
    hasVerifiedMemory = true;
    lines.push(`Tóm tắt phiên hiện tại: ${cleanSummary}`);
  }

  if (!hasVerifiedMemory) {
    lines.push('Trạng thái: Học viên mới (Cold Start — chưa có dữ liệu lịch sử, tuyệt đối không suy diễn lỗi sai).');
  }

  return {
    memoryApplied: hasVerifiedMemory,
    contextText: lines.join('\n'),
  };
}
