/**
 * =========================================================================
 * HANZI GO - CLIENT SERVICE: AI PRONUNCIATION SCORER
 * =========================================================================
 * Gửi dữ liệu âm thanh và transcript lên Gemini AI để chấm điểm khách quan,
 * phân tích thanh điệu, ngữ âm thực tế thay vì điểm cố định 93/100.
 * =========================================================================
 */

import { evaluateRealPronunciation } from '../utils/pronunciationEvaluator';

/**
 * Chuyển Blob âm thanh sang base64 string
 */
export async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Gọi AI chấm điểm phát âm qua backend API hoặc trực tiếp
 */
export async function scorePronunciationWithAi({
  targetHanzi,
  targetPinyin = '',
  spokenTranscript = '',
  audioBlob = null,
  audioDurationMs = 0
}) {
  let audioBase64 = null;
  let mimeType = 'audio/webm';

  if (audioBlob) {
    try {
      audioBase64 = await blobToBase64(audioBlob);
      mimeType = audioBlob.type || 'audio/webm';
    } catch (e) {
      console.warn('Không thể convert audio sang base64:', e);
    }
  }

  // 1. Thử gọi qua API backend serverless (/api/ai/pronunciation)
  try {
    const res = await fetch('/api/ai/pronunciation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetHanzi,
        targetPinyin,
        spokenTranscript,
        audioDurationMs,
        audioBase64,
        mimeType
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.result) {
        return {
          ...data.result,
          isValid: true,
          isAiEvaluated: true
        };
      }
    }
  } catch (apiErr) {
    console.warn('[AI Pronunciation Service] Backend serverless API not reachable, falling back to offline evaluator...', apiErr);
  }

  // 2. Fallback ngoại tuyến: Bộ máy chấm điểm ngữ âm chuyên sâu tại máy khách (Zero Leaks, KHÔNG cố định 93 điểm)
  const localResult = evaluateRealPronunciation({
    targetHanzi,
    targetPinyin,
    spokenTranscript,
    audioDurationMs
  });

  return {
    ...localResult,
    isAiEvaluated: false
  };
}

