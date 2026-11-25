// Web Speech API and Web Audio API synthesizer for HanziGo
import {
  unlockMobileAudio,
  playChineseTts,
  stopChineseAudio,
  prefetchTtsItems,
} from '../services/ttsAudioService.js';

export { unlockMobileAudio, prefetchTtsItems };

// Danh sách giọng đọc hỗ trợ
export const AUDIO_VOICES = {
  XIAOXIAO: 'zh-CN-XiaoxiaoNeural', // Nữ chuẩn phổ thông
  YUNXI: 'zh-CN-YunxiNeural',       // Nam chuẩn phổ thông
  XIAOYI: 'zh-CN-XiaoyiNeural',     // Nữ trẻ trung
  DEVICE: 'device'                  // Giọng mặc định của thiết bị/trình duyệt
};

export const AUDIO_STORAGE_PREF = 'hanzigo_audio_pref_voice';

// In-Memory Audio Blob/URL Cache để tái sử dụng ngay lập tức trong phiên học (0 network requests)
export const IN_MEMORY_AUDIO_CACHE = new Map();
let activeAudioElement = null;

/**
 * Check if the user's browser/system has at least one Chinese voice installed.
 * Returns boolean.
 */
export const checkChineseVoiceSupport = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.some(v =>
    v.lang === 'zh-CN' ||
    v.lang === 'zh-SG' ||
    v.lang === 'cmn-Hans-CN' ||
    v.lang.startsWith('zh') ||
    v.name.includes('Chinese') ||
    v.name.includes('Mandarin') ||
    v.name.includes('Putonghua')
  );
};

/**
 * Dừng mọi âm thanh đang phát (cả Web Speech API và HTML5 Audio)
 */
export const stopChineseSpeech = () => {
  stopChineseAudio();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore Web Speech cancel errors
    }
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch { }
    activeAudioElement = null;
  }
};

/**
 * Phát âm thông qua Web Speech API (Tầng 1 - Fallback cục bộ 0ms)
 */
export const speakWithWebSpeech = (text, options = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance !== 'function') {
    if (options.onError) {
      options.onError(new Error('Trình duyệt không hỗ trợ Web Speech Synthesis API.'));
    }
    return { success: false, reason: 'unsupported' };
  }

  const rate = options.rate ?? 0.85;
  const pitch = options.pitch ?? 1.0;
  const { onStart, onEnd, onError } = options;

  try {
    stopChineseSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = pitch;

    let chineseVoice = null;
    try {
      const voices = window.speechSynthesis.getVoices?.() || [];
      chineseVoice = voices.find(v =>
        v.lang === 'zh-CN' ||
        v.lang === 'zh-SG' ||
        v.lang === 'cmn-Hans-CN' ||
        v.lang?.startsWith('zh') ||
        v.name?.includes('Chinese') ||
        v.name?.includes('Mandarin') ||
        v.name?.includes('Putonghua')
      );
    } catch {
      // Fail-open when iOS voices list is not loaded yet
    }

    if (chineseVoice) {
      utterance.voice = chineseVoice;
    } else if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('hanzigo_voice_missing', {
        detail: { lang: 'zh-CN', text }
      }));
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('[HanziGo Audio] Utterance error:', e);
      if (onError) onError(e);
      if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('hanzigo_audio_error', {
          detail: { error: e, text }
        }));
      }
    };

    window.speechSynthesis.speak(utterance);
    return { success: true, mode: 'web-speech', voice: chineseVoice?.name || null };
  } catch (err) {
    console.error('[HanziGo Audio] Speech synthesis failure:', err);
    if (onError) onError(err);
    return { success: false, reason: 'error', error: err };
  }
};

/**
 * Speak Chinese text using low-latency Web Audio / L1+L2 cached cloud TTS or Web Speech API fallback.
 * Synchronous `unlockMobileAudio()` runs immediately on invocation before any async step.
 * @param {string} text
 * @param {number | { rate?: number; pitch?: number; voiceName?: string; onStart?: () => void; onEnd?: () => void; onError?: (err?: unknown) => void; [key: string]: any }} [optionsOrRate]
 */
export const speakChinese = (text, optionsOrRate = 0.85) => {
  // Synchronously unlock mobile AudioContext inside the user tap gesture
  unlockMobileAudio();

  if (!text || typeof text !== 'string' || !text.trim()) {
    return { success: false, reason: 'empty_text' };
  }

  const options = typeof optionsOrRate === 'object' ? optionsOrRate : { rate: optionsOrRate };
  const rate = options.rate ?? 0.85;
  const preferredVoice = options.voice || (typeof localStorage !== 'undefined' ? localStorage.getItem(AUDIO_STORAGE_PREF) : null) || AUDIO_VOICES.XIAOXIAO;
  const preferNeural = options.preferNeural !== false && preferredVoice !== AUDIO_VOICES.DEVICE;
  const hasChinese = /[\u4e00-\u9fa5]/.test(text);

  // If device voice requested, non-Hanzi, or very long passage: use hardened Web Speech directly
  if (!preferNeural || !hasChinese || text.trim().length > 600) {
    return speakWithWebSpeech(text, options);
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

  void playChineseTts(text, {
    voice: preferredVoice,
    rate,
    signal: controller?.signal,
    onStart: options.onStart,
    onEnd: options.onEnd,
    onError: options.onError,
  }).then((res) => {
    if (res?.audioUrl) {
      const cacheKey = `${preferredVoice}_${Number(rate).toFixed(2)}_${text.trim()}`;
      IN_MEMORY_AUDIO_CACHE.set(cacheKey, res.audioUrl);
    }
    if (res && !res.ok && options.onEnd) {
      options.onEnd();
    }
  }).catch(() => {
    speakWithWebSpeech(text, options);
  }).finally(() => {
    if (timeoutId !== null) clearTimeout(timeoutId);
  });

  return { success: true, mode: 'neural-fetching', text };
};

// Web Audio API Synthesizer for pleasant UX sound effects (no external MP3 dependencies)
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Success chime (ascending joyful arpeggio)
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  } catch (e) {
    console.error('Audio play error', e);
  }
};

// Error or gentle warning chime
export const playErrorSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [329.63, 293.66]; // E4, D4

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.35);
    });
  } catch (e) {
    console.error('Audio play error', e);
  }
};

// Quick button click tap
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    console.error('Audio play error', e);
  }
};

// Level complete celebration fanfare
export const playLevelUpSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.6);
    });
  } catch (e) {
    console.error('Audio play error', e);
  }
};
