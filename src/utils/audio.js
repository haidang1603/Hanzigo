// Web Speech API and Web Audio API synthesizer for HanziGo
import { supabase, isSupabaseConfigured } from '../supabase/config.js';

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
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {}
    activeAudioElement = null;
  }
};

/**
 * Phát âm thông qua Web Speech API (Tầng 1 - Fallback cục bộ 0ms)
 */
export const speakWithWebSpeech = (text, options = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
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

    const voices = window.speechSynthesis.getVoices() || [];
    const chineseVoice = voices.find(v => 
      v.lang === 'zh-CN' || 
      v.lang === 'zh-SG' || 
      v.lang === 'cmn-Hans-CN' || 
      v.lang.startsWith('zh') || 
      v.name.includes('Chinese') || 
      v.name.includes('Mandarin') ||
      v.name.includes('Putonghua')
    );

    if (chineseVoice) {
      utterance.voice = chineseVoice;
    } else {
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
      window.dispatchEvent(new CustomEvent('hanzigo_audio_error', { 
        detail: { error: e, text } 
      }));
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
 * Phát âm tiếng Trung thông minh 2 tầng:
 * - Tầng 2 (Ưu tiên): Azure Neural HD Voice qua proxy backend /api/audio/tts với SHA-256 caching.
 * - Tầng 1 (Fallback): Web Speech API của trình duyệt khi offline hoặc chưa cấu hình API key.
 * 
 * @param {string} text - Văn bản tiếng Trung cần phát âm
 * @param {number|Object} optionsOrRate - Tốc độ (number) hoặc cấu hình chi tiết (object)
 * @returns {Object} Kết quả phát âm
 */
export const speakChinese = (text, optionsOrRate = 0.85) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { success: false, reason: 'empty_text' };
  }

  const options = typeof optionsOrRate === 'object' ? optionsOrRate : { rate: optionsOrRate };
  const rate = options.rate ?? 0.85;
  const preferredVoice = options.voice || (typeof localStorage !== 'undefined' ? localStorage.getItem(AUDIO_STORAGE_PREF) : null) || AUDIO_VOICES.XIAOXIAO;
  const preferNeural = options.preferNeural !== false && preferredVoice !== AUDIO_VOICES.DEVICE;
  const hasChinese = /[\u4e00-\u9fa5]/.test(text);

  // Nếu không ưu tiên giọng Neural hoặc văn bản không có chữ Hán / quá dài: dùng Web Speech ngay
  if (!preferNeural || !hasChinese || text.trim().length > 150) {
    return speakWithWebSpeech(text, options);
  }

  const cacheKey = `${preferredVoice}_${rate.toFixed(2)}_${text.trim()}`;

  // 1. Kiểm tra RAM Cache (Tức thì 0ms, 0 network)
  if (IN_MEMORY_AUDIO_CACHE.has(cacheKey)) {
    const audioUrl = IN_MEMORY_AUDIO_CACHE.get(cacheKey);
    stopChineseSpeech();

    try {
      const audio = new Audio(audioUrl);
      activeAudioElement = audio;

      if (options.onStart) options.onStart();
      audio.onended = () => {
        activeAudioElement = null;
        if (options.onEnd) options.onEnd();
      };
      audio.onerror = () => {
        activeAudioElement = null;
        // Fallback về Web Speech nếu Audio element lỗi
        speakWithWebSpeech(text, options);
      };

      audio.play().catch(() => {
        speakWithWebSpeech(text, options);
      });

      return { success: true, mode: 'neural-memory-cache', cacheKey };
    } catch {
      return speakWithWebSpeech(text, options);
    }
  }

  // 2. Gọi Proxy Backend /api/audio/tts bất đồng bộ
  (async () => {
    try {
      let accessToken = null;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          accessToken = session?.access_token;
        } catch {}
      }

      const headers = { 'Accept': 'application/json' };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const url = `/api/audio/tts?text=${encodeURIComponent(text.trim())}&voice=${encodeURIComponent(preferredVoice)}&rate=${rate}&format=json`;
      const res = await fetch(url, { headers });

      if (!res.ok) {
        // Fallback nếu server trả về mã lỗi HTTP
        speakWithWebSpeech(text, options);
        return;
      }

      const data = await res.json();
      if (data.fallbackToWebSpeech || !data.audioBase64) {
        // Graceful fallback nếu server báo fallback
        speakWithWebSpeech(text, options);
        return;
      }

      // Tạo Audio Data URL & Lưu vào RAM Cache
      const audioUrl = `data:audio/mpeg;base64,${data.audioBase64}`;
      IN_MEMORY_AUDIO_CACHE.set(cacheKey, audioUrl);

      stopChineseSpeech();
      const audio = new Audio(audioUrl);
      activeAudioElement = audio;

      if (options.onStart) options.onStart();
      audio.onended = () => {
        activeAudioElement = null;
        if (options.onEnd) options.onEnd();
      };
      audio.onerror = () => {
        activeAudioElement = null;
        speakWithWebSpeech(text, options);
      };

      await audio.play();
    } catch {
      // Khi mất mạng hoặc lỗi fetch: tự động chuyển về Web Speech
      speakWithWebSpeech(text, options);
    }
  })();

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
