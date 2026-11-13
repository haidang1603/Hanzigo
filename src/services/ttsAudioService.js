/**
 * =========================================================================
 * HANZIGO — UNIFIED CLIENT TTS AUDIO SERVICE (TASK 32.03)
 * =========================================================================
 * 3-Tier Chinese Pronunciation Playback Service:
 * - Tier 1: In-Memory Map<cacheSignature, audioUrl> (0ms repeat playback)
 * - Tier 2: Serverless Proxy POST /api/audio/tts -> Supabase Storage CDN
 *           played through a single shared HTMLAudioElement instance
 * - Tier 3: Instant Offline / Fallback via Web Speech API (zh-CN)
 *
 * Integrates with Phase 31 OfflineSyncManager (`functional` storage group)
 * and supports multi-turn HSK dialogue sequences (`playDialogueSequence`).
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { getStoragePreferences } from '../core/sync/OfflineSyncManager.js';

export const TTS_CANONICAL_RATES = [0.75, 0.90, 1.00, 1.25];
export const TTS_VOICE_ALIASES = {
  female_standard: 'zh-CN-XiaoxiaoNeural',
  male_standard: 'zh-CN-YunxiNeural',
  female_news: 'zh-CN-XiaoyiNeural',
};

const AUDIO_SPEED_KEY = 'audio_speed';
const AUDIO_VOICE_KEY = 'ui_tts_voice';
const MAX_MEMORY_CACHE_ENTRIES = 500;

const memoryAudioUrlCache = new Map();
let sharedAudioElement = null;
let activeSequenceId = 0;

function hasWindow() {
  return typeof window !== 'undefined';
}

export function normalizeClientTtsText(text = '') {
  return String(text || '').trim().replace(/\s+/g, ' ');
}

export function normalizeClientTtsRate(rateInput) {
  const parsed = Number.parseFloat(rateInput);
  if (!Number.isFinite(parsed)) return 1.00;

  let nearest = TTS_CANONICAL_RATES[0];
  let minDiff = Math.abs(parsed - nearest);

  for (let i = 1; i < TTS_CANONICAL_RATES.length; i += 1) {
    const candidate = TTS_CANONICAL_RATES[i];
    const diff = Math.abs(parsed - candidate);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = candidate;
    }
  }
  return nearest;
}

export function resolveClientTtsVoice(voiceInput) {
  if (!voiceInput) return TTS_VOICE_ALIASES.female_standard;
  const raw = String(voiceInput).trim();
  if (TTS_VOICE_ALIASES[raw]) return TTS_VOICE_ALIASES[raw];
  if (Object.values(TTS_VOICE_ALIASES).includes(raw)) return raw;
  return TTS_VOICE_ALIASES.female_standard;
}

export function buildClientTtsSignature(text, voice, rate) {
  const cleanText = normalizeClientTtsText(text);
  const resolvedVoice = resolveClientTtsVoice(voice);
  const normalizedRate = normalizeClientTtsRate(rate);
  return `${cleanText}|${resolvedVoice}|${normalizedRate.toFixed(2)}`;
}

/**
 * Read default playback speed & preferred voice from Phase 31 `functional` storage group.
 */
export function getTtsFunctionalSettings() {
  const defaults = { voice: 'female_standard', rate: 0.90 };
  if (!hasWindow()) return defaults;

  const prefs = getStoragePreferences();
  if (!prefs.functional) {
    return defaults;
  }

  try {
    const storedSpeed = window.localStorage.getItem(AUDIO_SPEED_KEY);
    const storedVoice = window.localStorage.getItem(AUDIO_VOICE_KEY);
    return {
      voice: storedVoice && (TTS_VOICE_ALIASES[storedVoice] || Object.values(TTS_VOICE_ALIASES).includes(storedVoice))
        ? storedVoice
        : defaults.voice,
      rate: storedSpeed ? normalizeClientTtsRate(storedSpeed) : defaults.rate,
    };
  } catch {
    return defaults;
  }
}

export function setTtsFunctionalSettings({ voice, rate } = {}) {
  if (!hasWindow()) return getTtsFunctionalSettings();
  const prefs = getStoragePreferences();
  if (!prefs.functional) return getTtsFunctionalSettings();

  try {
    if (voice) {
      window.localStorage.setItem(AUDIO_VOICE_KEY, String(voice));
    }
    if (rate !== undefined) {
      window.localStorage.setItem(AUDIO_SPEED_KEY, normalizeClientTtsRate(rate).toFixed(2));
    }
  } catch {
    // Ignore storage quota errors
  }

  return getTtsFunctionalSettings();
}

function getSharedAudioElement() {
  if (!hasWindow() || typeof window.Audio !== 'function') return null;
  if (!sharedAudioElement) {
    sharedAudioElement = new window.Audio();
    sharedAudioElement.preload = 'auto';
  }
  return sharedAudioElement;
}

function setMemoryCache(signature, url) {
  if (!signature || !url) return;
  if (memoryAudioUrlCache.size >= MAX_MEMORY_CACHE_ENTRIES) {
    const oldestKey = memoryAudioUrlCache.keys().next().value;
    if (oldestKey) memoryAudioUrlCache.delete(oldestKey);
  }
  memoryAudioUrlCache.set(signature, url);
}

export function getCachedTtsAudioUrl(signature) {
  return memoryAudioUrlCache.get(signature) || null;
}

export function clearTtsMemoryCache() {
  memoryAudioUrlCache.clear();
}

export function stopChineseAudio() {
  activeSequenceId += 1;

  if (sharedAudioElement) {
    try {
      sharedAudioElement.onended = null;
      sharedAudioElement.onerror = null;
      sharedAudioElement.pause();
      sharedAudioElement.currentTime = 0;
    } catch {
      // Ignore audio element reset errors
    }
  }

  if (hasWindow() && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore speechSynthesis cancel errors
    }
  }
}

function speakWithWebSpeechFallback(text, { rate = 0.90, onStart, onEnd, onError } = {}) {
  return new Promise((resolve) => {
    if (!hasWindow() || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      if (onEnd) onEnd();
      resolve({ ok: false, mode: 'unsupported', text });
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = Math.max(0.5, Math.min(2.0, Number(rate) || 0.90));

      const voices = window.speechSynthesis.getVoices?.() || [];
      const zhVoice =
        voices.find((v) => v.lang?.toLowerCase() === 'zh-cn') ||
        voices.find((v) => v.lang?.toLowerCase().startsWith('zh'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve({ ok: true, mode: 'web_speech', text });
      };
      utterance.onerror = (err) => {
        if (onError) onError(err);
        if (onEnd) onEnd();
        resolve({ ok: false, mode: 'web_speech_error', text });
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      if (onError) onError(err);
      if (onEnd) onEnd();
      resolve({ ok: false, mode: 'web_speech_error', text });
    }
  });
}

function playUrlOnSharedElement(audioUrl, { onStart, onEnd } = {}) {
  return new Promise((resolve, reject) => {
    const audio = getSharedAudioElement();
    if (!audio) {
      reject(new Error('HTMLAudioElement unavailable'));
      return;
    }

    audio.onended = () => {
      audio.onended = null;
      audio.onerror = null;
      if (onEnd) onEnd();
      resolve({ ok: true });
    };

    audio.onerror = () => {
      audio.onended = null;
      audio.onerror = null;
      reject(new Error('Audio playback failed'));
    };

    audio.pause();
    audio.src = audioUrl;
    audio.currentTime = 0;

    if (onStart) onStart();
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((err) => {
        audio.onended = null;
        audio.onerror = null;
        reject(err);
      });
    }
  });
}

async function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (supabase && isSupabaseConfigured()) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch {
      // Proceed without bearer token; endpoint will reject or fallback gracefully
    }
  }

  return headers;
}

/**
 * Play Chinese text through the 3-tier TTS cache pipeline.
 */
export async function playChineseTts(text, options = {}) {
  const cleanText = normalizeClientTtsText(text);
  if (!cleanText) {
    return { ok: false, mode: 'empty' };
  }

  const functionalSettings = getTtsFunctionalSettings();
  const voice = options.voice || functionalSettings.voice;
  const resolvedVoice = resolveClientTtsVoice(voice);
  const normalizedRate = normalizeClientTtsRate(
    options.rate !== undefined ? options.rate : functionalSettings.rate
  );

  if (!options._preserveSequence) {
    stopChineseAudio();
  }

  const signature = buildClientTtsSignature(cleanText, resolvedVoice, normalizedRate);

  // Tier 1: In-Memory Map Cache
  const cachedUrl = memoryAudioUrlCache.get(signature);
  if (cachedUrl) {
    try {
      await playUrlOnSharedElement(cachedUrl, options);
      return { ok: true, mode: 'memory_cache', audioUrl: cachedUrl };
    } catch {
      memoryAudioUrlCache.delete(signature);
    }
  }

  // Tier 3 fast-path when Offline or text has no Hanzi
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const hasHanzi = /[\u4e00-\u9fa5]/.test(cleanText);
  if (isOffline || !hasHanzi) {
    return speakWithWebSpeechFallback(cleanText, {
      ...options,
      rate: normalizedRate,
    });
  }

  // Tier 2: Serverless Proxy -> Supabase Storage CDN
  try {
    const headers = await getAuthHeaders();
    const fetchFn = options.fetchImpl || fetch;
    const response = await fetchFn('/api/audio/tts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: cleanText,
        voice: resolvedVoice,
        rate: normalizedRate,
      }),
    });

    if (!response.ok) {
      return speakWithWebSpeechFallback(cleanText, {
        ...options,
        rate: normalizedRate,
      });
    }

    const payload = await response.json();
    if (payload?.status === 'client_fallback_required' || payload?.fallbackToWebSpeech) {
      return speakWithWebSpeechFallback(cleanText, {
        ...options,
        rate: normalizedRate,
      });
    }

    const playableUrl =
      payload?.audioUrl ||
      (payload?.audioBase64
        ? `data:${payload.contentType || 'audio/mpeg'};base64,${payload.audioBase64}`
        : null);

    if (!playableUrl) {
      return speakWithWebSpeechFallback(cleanText, {
        ...options,
        rate: normalizedRate,
      });
    }

    setMemoryCache(signature, playableUrl);
    await playUrlOnSharedElement(playableUrl, options);

    return {
      ok: true,
      mode: payload.status === 'hit' ? 'cdn_cache_hit' : 'cdn_synthesized',
      audioUrl: playableUrl,
      cacheKey: payload.cacheKey || null,
      provider: payload.provider || null,
    };
  } catch {
    return speakWithWebSpeechFallback(cleanText, {
      ...options,
      rate: normalizedRate,
    });
  }
}

/**
 * Resolve speaker tag ('男' | '女' | 'male' | 'female') to Azure voice ID.
 */
export function resolveDialogueSpeakerVoice(speaker = '') {
  const normalized = String(speaker || '').trim().toLowerCase();
  if (normalized === '男' || normalized === 'male' || normalized === 'm' || normalized === 'nam') {
    return TTS_VOICE_ALIASES.male_standard;
  }
  return TTS_VOICE_ALIASES.female_standard;
}

/**
 * Play multi-turn Chinese dialogue sequence sequentially with automatic
 * Male ('男') / Female ('女') voice switching.
 */
export async function playDialogueSequence(turns = [], options = {}) {
  if (!Array.isArray(turns) || turns.length === 0) {
    return { ok: false, playedTurns: 0, reason: 'empty_sequence' };
  }

  stopChineseAudio();
  const mySequenceId = activeSequenceId;
  let playedTurns = 0;

  for (let index = 0; index < turns.length; index += 1) {
    if (activeSequenceId !== mySequenceId) {
      return { ok: false, cancelled: true, playedTurns };
    }

    const turn = turns[index] || {};
    const turnText = normalizeClientTtsText(turn.text);
    if (!turnText) continue;

    const turnVoice = turn.voice || resolveDialogueSpeakerVoice(turn.speaker);
    const turnRate = turn.rate !== undefined ? turn.rate : options.rate;

    if (options.onTurnStart) {
      options.onTurnStart({ index, turn, voice: turnVoice });
    }

    await playChineseTts(turnText, {
      voice: turnVoice,
      rate: turnRate,
      fetchImpl: options.fetchImpl,
      _preserveSequence: true,
    });

    if (activeSequenceId !== mySequenceId) {
      return { ok: false, cancelled: true, playedTurns };
    }

    playedTurns += 1;
    if (options.onTurnEnd) {
      options.onTurnEnd({ index, turn, voice: turnVoice });
    }
  }

  if (options.onComplete) {
    options.onComplete({ playedTurns });
  }

  return { ok: true, playedTurns };
}

