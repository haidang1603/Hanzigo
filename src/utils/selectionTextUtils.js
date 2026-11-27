/**
 * =========================================================================
 * HANZIGO — LIGHTWEIGHT SELECTION TEXT HELPERS
 * =========================================================================
 * Giữ tách biệt khỏi VOCABULARY_LIST và dữ liệu từ điển lớn để Entry index.js
 * không bị phình khi GlobalTextSelectionActionBar import.
 */

export const MAX_SELECTION_LENGTH = 120;
export const MAX_CONTEXT_LENGTH = 240;

/**
 * Ẩn thông tin nhạy cảm (email, số điện thoại, token, API key) trước khi gửi AI hoặc hiển thị.
 */
export function redactSelectionPii(text = '') {
  return String(text || '')
    .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED]')
    .replace(/\beyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\b/g, '[REDACTED_JWT]')
    .replace(/\bAIza[0-9A-Za-z_-]{16,}\b/g, '[REDACTED_KEY]')
    .replace(/\bsk-[0-9A-Za-z_-]{12,}\b/g, '[REDACTED_KEY]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[email]')
    .replace(/(?:\+84|0)(?:[\s.-]?\d){8,10}\b/g, '[phone]')
    .trim();
}

/**
 * Trích xuất câu ngữ cảnh chứa selectedText quanh dấu câu 。！？!?\n (tối đa 240 ký tự).
 */
export function extractContextSentence(fullText = '', selectedText = '', maxLen = MAX_CONTEXT_LENGTH) {
  const cleanSelected = String(selectedText || '').trim();
  const rawBlock = String(fullText || '').replace(/\r\n/g, '\n').trim();
  if (!rawBlock) return cleanSelected.slice(0, maxLen);
  if (!cleanSelected) return rawBlock.slice(0, maxLen);

  const sentences = rawBlock
    .split(/(?<=[。！？!?\n；])/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const matched = sentences.find((s) => s.includes(cleanSelected)) || rawBlock.replace(/\s+/g, ' ');
  if (matched.length <= maxLen) return matched;

  const idx = matched.indexOf(cleanSelected);
  if (idx === -1) return matched.slice(0, maxLen);

  const halfPadding = Math.max(0, Math.floor((maxLen - cleanSelected.length) / 2));
  let start = Math.max(0, idx - halfPadding);
  let end = start + maxLen;
  if (end > matched.length) {
    end = matched.length;
    start = Math.max(0, end - maxLen);
  }
  return matched.slice(start, end).trim();
}

export function extractContextSentenceFromDomSelection(selection, maxLen = MAX_CONTEXT_LENGTH) {
  if (!selection) return '';
  const selectedStr = String(selection.toString() || '').trim();
  const anchorNode = selection.anchorNode;
  if (!anchorNode || !anchorNode.textContent) {
    return selectedStr.slice(0, maxLen);
  }
  const fullBlockText = anchorNode.parentElement?.innerText || anchorNode.textContent;
  return extractContextSentence(fullBlockText, selectedStr, maxLen);
}

let activeSelectionAbortController = null;

export function setActiveSelectionController(controller) {
  activeSelectionAbortController = controller || null;
}

export function getActiveSelectionController() {
  return activeSelectionAbortController;
}

export function cancelActiveSelectionRequest() {
  if (activeSelectionAbortController) {
    try {
      activeSelectionAbortController.abort();
    } catch {}
    activeSelectionAbortController = null;
  }
}
