/**
 * =========================================================================
 * HANZIGO — LOW-LATENCY MOBILE CLIENT TTS AUDIO SERVICE
 * =========================================================================
 * 4-Layer Mobile-Optimized Chinese Pronunciation Engine:
 * 1. Synchronous AudioContext Unlock (`unlockMobileAudio`) + Singletons
 *    (1 AudioContext + 1 shared HTMLAudioElement, zero overlapping playback).
 * 2. Web Audio API (`decodeAudioData` -> `AudioBufferSourceNode`) < 50ms playback
 *    with seamless singleton `HTMLAudioElement` fallback + In-Flight Deduplication.
 * 3. 2-Tier Cache:
 *    - L1: In-Memory LRU Map (`MAX_MEMORY_CACHE_ENTRIES = 50`)
 *    - L2: Browser Cache API (`hanzigo-tts-v1`, fail-open on Private Mode/Node)
 *    + Non-blocking `prefetchTtsItems(items, { concurrency: 2 })`.
 * 4. Hardened Web Speech API fallback (`speechSynthesis.cancel()` before `speak()`).
 *
 * Integrates with Phase 31 OfflineSyncManager (`functional` storage group)
 * and supports multi-turn HSK dialogue sequences (`playDialogueSequence`).
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { getStoragePreferences } from '../core/sync/OfflineSyncManager.js';

export const TTS_CANONICAL_RATES = [0.75, 0.90, 1.00, 1.25];
export const TTS_VOICE_ALIASES = {
  female: 'female',
  male: 'male',
  dialogue: 'dialogue',
  auto: 'auto',
  female_standard: 'zh-CN-XiaoxiaoNeural',
  male_standard: 'zh-CN-YunxiNeural',
  female_news: 'zh-CN-XiaoyiNeural',
};

const AUDIO_SPEED_KEY = 'audio_speed';
const AUDIO_VOICE_KEY = 'ui_tts_voice';
const MAX_MEMORY_CACHE_ENTRIES = 50;
const MAX_CLIENT_TTS_TEXT_LENGTH = 1200;
const TTS_L2_CACHE_NAME = 'hanzigo-tts-v1';

// L1 LRU cache: Map<signature, { audioBuffer, arrayBuffer, audioUrl, cacheKey, provider }>
const memoryTtsCache = new Map();
// In-flight request deduplication: Map<signature, Promise>
const inFlightMap = new Map();

let sharedAudioContext = null;
let audioContextUnlocked = false;
let activeBufferSource = null;
let sharedAudioElement = null;
let activeObjectUrl = null;
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

export function hasDialogueSpeakerTags(text = '') {
  const clean = normalizeClientTtsText(text);
  if (!clean) return false;
  const matches = clean.match(/(?:^|\s)(男|女|A|B|甲|乙)\s*[：:]/g);
  return Boolean(matches && matches.length >= 2);
}

export function resolveClientTtsVoice(voiceInput, text = '') {
  if (!voiceInput || voiceInput === 'auto') {
    if (hasDialogueSpeakerTags(text)) return 'dialogue';
    return 'female';
  }
  const raw = String(voiceInput).trim();
  if (raw === 'zh-CN-YunxiNeural' || raw === 'male_standard' || raw === 'male') return 'male';
  if (raw === 'dialogue') return 'dialogue';
  if (raw === 'zh-CN-XiaoxiaoNeural' || raw === 'female_standard' || raw === 'female') return 'female';
  if (raw === 'zh-CN-XiaoyiNeural' || raw === 'female_news') return raw;
  return hasDialogueSpeakerTags(text) ? 'dialogue' : 'female';
}

export function buildClientTtsSignature(text, voice, _rate) {
  const cleanText = normalizeClientTtsText(text);
  const resolvedVoice = resolveClientTtsVoice(voice, cleanText);
  // Single 1.0x asset signature regardless of requested playbackRate
  return `${cleanText}|${resolvedVoice}|1.00`;
}

/**
 * Read default playback speed & preferred voice from Phase 31 `functional` storage group.
 */
export function getTtsFunctionalSettings() {
  const defaults = { voice: 'female', rate: 1.00 };
  if (!hasWindow()) return defaults;

  const prefs = getStoragePreferences();
  if (!prefs.functional) {
    return defaults;
  }

  try {
    const storedSpeed = window.localStorage.getItem(AUDIO_SPEED_KEY);
    const storedVoice = window.localStorage.getItem(AUDIO_VOICE_KEY);
    return {
      voice:
        storedVoice &&
          (TTS_VOICE_ALIASES[storedVoice] || Object.values(TTS_VOICE_ALIASES).includes(storedVoice))
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

function getAudioContextConstructor() {
  if (hasWindow()) {
    return window.AudioContext || window.webkitAudioContext || null;
  }
  if (typeof globalThis !== 'undefined') {
    return globalThis.AudioContext || globalThis.webkitAudioContext || null;
  }
  return null;
}

function getSharedAudioContext() {
  const AudioCtx = getAudioContextConstructor();
  if (typeof AudioCtx !== 'function') return null;
  if (!sharedAudioContext) {
    try {
      sharedAudioContext = new AudioCtx();
    } catch {
      return null;
    }
  }
  return sharedAudioContext;
}

function getSharedAudioElement() {
  const AudioCtor = hasWindow() ? window.Audio : globalThis?.Audio;
  if (typeof AudioCtor !== 'function') return null;
  if (!sharedAudioElement) {
    sharedAudioElement = new AudioCtor();
    sharedAudioElement.preload = 'auto';
  }
  return sharedAudioElement;
}

function revokeActiveObjectUrl() {
  if (!activeObjectUrl) return;
  try {
    if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(activeObjectUrl);
    }
  } catch {
    // Ignore revoke errors
  }
  activeObjectUrl = null;
}

/**
 * Synchronous Mobile Audio Unlock for iOS Safari & Android Chrome.
 * MUST execute synchronously inside user gesture before any `await`.
 */
export function unlockMobileAudio() {
  let unlocked = false;
  const ctx = getSharedAudioContext();

  if (ctx) {
    try {
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
        const resumeResult = ctx.resume();
        if (resumeResult && typeof resumeResult.catch === 'function') {
          resumeResult.catch(() => { });
        }
      }

      if (!audioContextUnlocked && typeof ctx.createBuffer === 'function' && typeof ctx.createBufferSource === 'function') {
        const silentBuffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = silentBuffer;
        if (ctx.destination && typeof source.connect === 'function') {
          source.connect(ctx.destination);
        }
        if (typeof source.start === 'function') {
          source.start(0);
        }
        audioContextUnlocked = true;
      }
      unlocked = true;
    } catch {
      // Ignore AudioContext unlock errors on restricted environments
    }
  }

  // Ensure singleton audio element is initialized during user gesture
  const audioEl = getSharedAudioElement();
  if (audioEl) {
    unlocked = true;
  }

  return unlocked;
}

// ---------------------------------------------------------------------------
// L1 LRU Cache Helpers (max 50 entries)
// ---------------------------------------------------------------------------
function getL1Entry(signature) {
  if (!signature || !memoryTtsCache.has(signature)) return null;
  const entry = memoryTtsCache.get(signature);
  // Refresh LRU recency
  memoryTtsCache.delete(signature);
  memoryTtsCache.set(signature, entry);
  return entry;
}

function setL1Entry(signature, entry) {
  if (!signature || !entry) return;
  if (memoryTtsCache.has(signature)) {
    memoryTtsCache.delete(signature);
  }
  while (memoryTtsCache.size >= MAX_MEMORY_CACHE_ENTRIES) {
    const oldestKey = memoryTtsCache.keys().next().value;
    if (oldestKey !== undefined) {
      memoryTtsCache.delete(oldestKey);
    } else {
      break;
    }
  }
  memoryTtsCache.set(signature, entry);
}

export function getCachedTtsAudioUrl(signature) {
  return memoryTtsCache.get(signature)?.audioUrl || null;
}

export function getTtsCacheStats() {
  return {
    l1Size: memoryTtsCache.size,
    l1Max: MAX_MEMORY_CACHE_ENTRIES,
    inFlightCount: inFlightMap.size,
    l1Keys: Array.from(memoryTtsCache.keys()),
  };
}

export function clearTtsMemoryCache() {
  memoryTtsCache.clear();
  inFlightMap.clear();
  revokeActiveObjectUrl();
}

export function resetAudioEngineForTesting() {
  stopCurrentAudio();
  clearTtsMemoryCache();
  sharedAudioContext = null;
  audioContextUnlocked = false;
  sharedAudioElement = null;
}

export function stopCurrentAudio() {
  activeSequenceId += 1;

  if (activeBufferSource) {
    try {
      activeBufferSource.onended = null;
      if (typeof activeBufferSource.stop === 'function') {
        activeBufferSource.stop(0);
      }
      if (typeof activeBufferSource.disconnect === 'function') {
        activeBufferSource.disconnect();
      }
    } catch {
      // Ignore already-stopped source errors
    }
    activeBufferSource = null;
  }

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

  const synth = hasWindow() ? window.speechSynthesis : globalThis?.speechSynthesis;
  if (synth && typeof synth.cancel === 'function') {
    try {
      synth.cancel();
    } catch {
      // Ignore speechSynthesis cancel errors
    }
  }
}

export function stopChineseAudio() {
  stopCurrentAudio();
}

// ---------------------------------------------------------------------------
// L2 Cache API Helpers (fail-open on Private Mode / Node)
// ---------------------------------------------------------------------------
function buildL2CacheRequestUrl(signature) {
  return `https://hanzigo-tts.local/v1/${encodeURIComponent(signature)}`;
}

async function readL2Cache(signature) {
  try {
    const cacheStorage = typeof caches !== 'undefined' ? caches : globalThis?.caches;
    if (!cacheStorage || typeof cacheStorage.open !== 'function') return null;

    const cache = await cacheStorage.open(TTS_L2_CACHE_NAME);
    if (!cache || typeof cache.match !== 'function') return null;

    const matched = await cache.match(buildL2CacheRequestUrl(signature));
    if (!matched) return null;

    const audioUrl = matched.headers?.get?.('X-Audio-Url') || null;
    const cacheKey = matched.headers?.get?.('X-Cache-Key') || null;
    const provider = matched.headers?.get?.('X-Tts-Provider') || null;
    const arrayBuffer =
      typeof matched.arrayBuffer === 'function' ? await matched.arrayBuffer() : null;

    if (!arrayBuffer && !audioUrl) return null;
    return { arrayBuffer, audioUrl, cacheKey, provider };
  } catch {
    return null;
  }
}

async function writeL2Cache(signature, arrayBuffer, meta = {}) {
  try {
    const cacheStorage = typeof caches !== 'undefined' ? caches : globalThis?.caches;
    if (!cacheStorage || typeof cacheStorage.open !== 'function') return false;
    if (!arrayBuffer || typeof Response === 'undefined') return false;

    const cache = await cacheStorage.open(TTS_L2_CACHE_NAME);
    if (!cache || typeof cache.put !== 'function') return false;

    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
    });
    if (meta.audioUrl) headers.set('X-Audio-Url', String(meta.audioUrl));
    if (meta.cacheKey) headers.set('X-Cache-Key', String(meta.cacheKey));
    if (meta.provider) headers.set('X-Tts-Provider', String(meta.provider));

    const resp = new Response(arrayBuffer.slice(0), { status: 200, headers });
    await cache.put(buildL2CacheRequestUrl(signature), resp);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Base64 -> ArrayBuffer & Web Audio Decode Helpers
// ---------------------------------------------------------------------------
function base64ToArrayBuffer(base64) {
  if (!base64 || typeof base64 !== 'string') return null;
  try {
    const clean = base64.replace(/^data:[^;]+;base64,/, '');
    if (typeof atob === 'function') {
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    }
    if (typeof Buffer !== 'undefined') {
      const buf = Buffer.from(clean, 'base64');
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
  } catch {
    return null;
  }
  return null;
}

async function tryDecodeAudioBuffer(arrayBuffer) {
  if (!arrayBuffer) return null;
  const ctx = getSharedAudioContext();
  if (!ctx || typeof ctx.decodeAudioData !== 'function') return null;
  try {
    // Always pass a sliced copy because decodeAudioData detaches the buffer
    return await ctx.decodeAudioData(arrayBuffer.slice(0));
  } catch {
    return null;
  }
}

function speakWithWebSpeechFallback(text, { rate = 0.90, onStart, onEnd, onError } = {}) {
  return new Promise((resolve) => {
    const synth = hasWindow() ? window.speechSynthesis : globalThis?.speechSynthesis;
    const UtteranceCtor = hasWindow()
      ? window.SpeechSynthesisUtterance
      : globalThis?.SpeechSynthesisUtterance;

    if (!synth || typeof synth.speak !== 'function' || typeof UtteranceCtor !== 'function') {
      if (onEnd) onEnd();
      resolve({ ok: false, mode: 'unsupported', text });
      return;
    }

    try {
      if (typeof synth.cancel === 'function') {
        synth.cancel();
      }
      const utterance = new UtteranceCtor(text);
      utterance.lang = 'zh-CN';
      utterance.rate = Math.max(0.5, Math.min(2.0, Number(rate) || 0.90));

      try {
        const voices = typeof synth.getVoices === 'function' ? synth.getVoices() || [] : [];
        const zhVoice =
          voices.find((v) => v?.lang?.toLowerCase() === 'zh-cn') ||
          voices.find((v) => v?.lang?.toLowerCase().startsWith('zh'));
        if (zhVoice) {
          utterance.voice = zhVoice;
        }
      } catch {
        // Safe fail-open if voices list is not ready on iOS
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

      synth.speak(utterance);
    } catch (err) {
      if (onError) onError(err);
      if (onEnd) onEnd();
      resolve({ ok: false, mode: 'web_speech_error', text });
    }
  });
}

function applyElementPlaybackRate(audio, rate = 1.0) {
  if (!audio) return;
  const safeRate = Math.max(0.5, Math.min(2.0, Number(rate) || 1.0));
  audio.preservesPitch = true;
  audio.webkitPreservesPitch = true;
  audio.mozPreservesPitch = true;
  audio.playbackRate = safeRate;
}

export function setActiveAudioPlaybackRate(rate = 1.0) {
  const safeRate = Math.max(0.5, Math.min(2.0, Number(rate) || 1.0));
  if (sharedAudioElement) {
    try {
      applyElementPlaybackRate(sharedAudioElement, safeRate);
    } catch {
      // ignore playbackRate errors
    }
  }
  if (activeBufferSource?.playbackRate) {
    try {
      activeBufferSource.playbackRate.value = safeRate;
    } catch {
      // ignore
    }
  }
  return safeRate;
}

function playDecodedAudioBuffer(audioBuffer, { rate = 1.0, onStart, onEnd } = {}) {
  return new Promise((resolve, reject) => {
    const ctx = getSharedAudioContext();
    if (!ctx || typeof ctx.createBufferSource !== 'function' || !audioBuffer) {
      reject(new Error('Web Audio playback unavailable'));
      return;
    }

    try {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      if (source.playbackRate) {
        source.playbackRate.value = Math.max(0.5, Math.min(2.0, Number(rate) || 1.0));
      }
      if (ctx.destination && typeof source.connect === 'function') {
        source.connect(ctx.destination);
      }

      activeBufferSource = source;
      let settled = false;

      source.onended = () => {
        if (activeBufferSource === source) {
          activeBufferSource = null;
        }
        if (!settled) {
          settled = true;
          if (onEnd) onEnd();
          resolve({ ok: true });
        }
      };

      if (onStart) onStart();
      source.start(0);
    } catch (err) {
      activeBufferSource = null;
      reject(err);
    }
  });
}

function resolveObjectUrlFromArrayBuffer(arrayBuffer) {
  if (!arrayBuffer || typeof Blob === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return null;
  }
  try {
    revokeActiveObjectUrl();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    activeObjectUrl = URL.createObjectURL(blob);
    return activeObjectUrl;
  } catch {
    return null;
  }
}

function playUrlOnSharedElement(audioUrl, { rate = 1.0, onStart, onEnd } = {}) {
  return new Promise((resolve, reject) => {
    const audio = getSharedAudioElement();
    if (!audio || !audioUrl) {
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
    applyElementPlaybackRate(audio, rate);

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

async function playCachedOrResolvedEntry(entry, options = {}) {
  const isRemoteCdnUrl = Boolean(entry?.audioUrl && /^https?:\/\//i.test(entry.audioUrl));
  const rate = options.rate !== undefined ? options.rate : 1.0;

  // Prefer native HTMLAudioElement for remote CDN URLs (supports preservesPitch + streaming)
  if (isRemoteCdnUrl && getSharedAudioElement()) {
    try {
      await playUrlOnSharedElement(entry.audioUrl, { ...options, rate });
      return { ok: true, transport: 'html_audio' };
    } catch {
      // Fallback to Web Audio if decoded buffer exists
    }
  }

  if (entry?.audioBuffer && getSharedAudioContext()) {
    try {
      await playDecodedAudioBuffer(entry.audioBuffer, { ...options, rate });
      return { ok: true, transport: 'web_audio' };
    } catch {
      // Fallback seamlessly to singleton HTMLAudioElement
    }
  }

  let playableUrl = entry?.audioUrl || null;
  if (!playableUrl && entry?.arrayBuffer) {
    playableUrl = resolveObjectUrlFromArrayBuffer(entry.arrayBuffer);
  }
  if (!playableUrl) {
    throw new Error('No playable audio source available');
  }

  await playUrlOnSharedElement(playableUrl, { ...options, rate });
  return { ok: true, transport: 'html_audio' };
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
 * Compute deterministic Supabase CDN URL matching `api/_utils/azureTtsSsml.js`
 * so pre-generated MP3 assets play directly with 0 serverless calls.
 */
export async function computeClientCdnAudioUrl(cleanText, voiceProfile) {
  try {
    if (!isSupabaseConfigured || !supabase?.supabaseUrl) return null;
    const subtle = typeof globalThis !== 'undefined' ? globalThis.crypto?.subtle : null;
    if (!subtle || typeof TextEncoder === 'undefined') return null;

    const textNoCtrl = String(cleanText || '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
    if (!textNoCtrl) return null;

    const payload = `v1|${voiceProfile}|${textNoCtrl}`;
    const hashBuffer = await subtle.digest('SHA-256', new TextEncoder().encode(payload));
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 32);

    const safeProfile =
      voiceProfile === 'male' || voiceProfile === 'dialogue' ? voiceProfile : 'female';
    const base = String(supabase.supabaseUrl).replace(/\/+$/, '');
    return `${base}/storage/v1/object/public/hsk-audio/v1/${safeProfile}/${hashHex.slice(0, 2)}/${hashHex}.mp3`;
  } catch {
    return null;
  }
}

async function probeDirectCdnUrl(url, fetchFn) {
  if (!url || typeof fetchFn !== 'function') return false;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 1500) : null;
  try {
    const res = await fetchFn(url, { method: 'HEAD', signal: controller?.signal });
    return Boolean(res && res.ok);
  } catch {
    return false;
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/**
 * Resolve & cache a TTS entry via L2 Cache API + direct CDN probe + `/api/audio/tts`, deduplicating
 * concurrent requests sharing the same signature in `inFlightMap`.
 */
async function resolveTtsAsset(signature, { cleanText, resolvedVoice, normalizedRate, fetchFn, hasCustomFetch = false, preferWebAudio = true }) {
  if (inFlightMap.has(signature)) {
    return inFlightMap.get(signature);
  }

  const task = (async () => {
    // Tier 2 (L2): Persistent Browser Cache API
    const l2Hit = await readL2Cache(signature);
    if (l2Hit) {
      const audioBuffer = await tryDecodeAudioBuffer(l2Hit.arrayBuffer);
      const entry = {
        audioBuffer,
        arrayBuffer: l2Hit.arrayBuffer || null,
        audioUrl: l2Hit.audioUrl || null,
        cacheKey: l2Hit.cacheKey || null,
        provider: l2Hit.provider || 'cache_api',
      };
      setL1Entry(signature, entry);
      return { ok: true, mode: 'cache_api', entry };
    }

    // Tier 2.5: Direct Public Supabase Storage CDN probe (zero serverless cost)
    const activeFetch = fetchFn || fetch;
    if (!hasCustomFetch && isSupabaseConfigured) {
      const directCdnUrl = await computeClientCdnAudioUrl(cleanText, resolvedVoice);
      if (directCdnUrl && (await probeDirectCdnUrl(directCdnUrl, activeFetch))) {
        const entry = {
          audioBuffer: null,
          arrayBuffer: null,
          audioUrl: directCdnUrl,
          cacheKey: null,
          provider: 'supabase_cdn',
        };
        setL1Entry(signature, entry);
        return { ok: true, mode: 'cdn_cache_hit', entry };
      }
    }

    // Tier 3: Network fetch -> `/api/audio/tts?format=url` (always 1.0x canonical CDN file)
    const headers = await getAuthHeaders();
    const response = await activeFetch('/api/audio/tts?format=url', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: cleanText,
        voice: resolvedVoice,
        rate: 1.0,
        format: 'url',
      }),
    });

    if (!response || !response.ok) {
      return { ok: false, fallback: true };
    }

    const contentType = String(response.headers?.get?.('content-type') || '').toLowerCase();
    let arrayBuffer = null;
    let audioUrl = null;
    let cacheKey = null;
    let provider = null;
    let payloadStatus = null;

    if (contentType.includes('audio/') || typeof response.json !== 'function') {
      if (typeof response.arrayBuffer === 'function') {
        arrayBuffer = await response.arrayBuffer();
      }
      payloadStatus = 'binary_stream';
    } else {
      const payload = await response.json();
      if (payload?.status === 'client_fallback_required' || payload?.fallbackToWebSpeech) {
        return { ok: false, fallback: true };
      }

      payloadStatus = payload?.status || null;
      cacheKey = payload?.hash || payload?.cacheKey || null;
      provider = payload?.provider || null;
      audioUrl = payload?.url || payload?.audioUrl || null;

      if (payload?.audioBase64) {
        arrayBuffer = base64ToArrayBuffer(payload.audioBase64);
        if (!audioUrl) {
          audioUrl = `data:${payload.contentType || 'audio/mpeg'};base64,${payload.audioBase64}`;
        }
      } else if (audioUrl && !/^https?:\/\//i.test(audioUrl) && preferWebAudio && getSharedAudioContext()) {
        // Fetch local/non-CDN audio buffer when Web Audio decoding is needed
        try {
          const binaryRes = await activeFetch(audioUrl);
          if (binaryRes?.ok && typeof binaryRes.arrayBuffer === 'function') {
            arrayBuffer = await binaryRes.arrayBuffer();
          }
        } catch {
          // Keep audioUrl for singleton HTMLAudioElement playback
        }
      }
    }

    if (!arrayBuffer && !audioUrl) {
      return { ok: false, fallback: true };
    }

    const audioBuffer = await tryDecodeAudioBuffer(arrayBuffer);
    const entry = {
      audioBuffer,
      arrayBuffer,
      audioUrl,
      cacheKey,
      provider,
    };

    setL1Entry(signature, entry);

    if (arrayBuffer) {
      void writeL2Cache(signature, arrayBuffer, { audioUrl, cacheKey, provider });
    }

    const mode =
      payloadStatus === 'hit'
        ? 'cdn_cache_hit'
        : payloadStatus === 'binary_stream'
          ? 'web_audio_stream'
          : 'cdn_synthesized';

    return { ok: true, mode, entry };
  })().finally(() => {
    inFlightMap.delete(signature);
  });

  inFlightMap.set(signature, task);
  return task;
}

/**
 * Play Chinese text through the 4-layer low-latency TTS pipeline.
 */
export async function playChineseTts(text, options = {}) {
  // MUST run synchronously before any `await` to unlock iOS Safari AudioContext
  unlockMobileAudio();

  const cleanText = normalizeClientTtsText(text);
  if (!cleanText) {
    return { ok: false, mode: 'empty' };
  }

  const functionalSettings = getTtsFunctionalSettings();
  const voice = options.voice || functionalSettings.voice;
  const resolvedVoice = resolveClientTtsVoice(voice, cleanText);
  const normalizedRate = normalizeClientTtsRate(
    options.rate !== undefined ? options.rate : functionalSettings.rate
  );

  if (!options._preserveSequence) {
    stopCurrentAudio();
  }

  const signature = buildClientTtsSignature(cleanText, resolvedVoice, normalizedRate);

  // Layer 1 (L1): In-Memory LRU Cache
  const l1Entry = getL1Entry(signature);
  if (l1Entry) {
    try {
      options.onPlaybackMode?.('cdn');
      await playCachedOrResolvedEntry(l1Entry, { ...options, rate: normalizedRate });
      return { ok: true, mode: 'memory_cache', audioUrl: l1Entry.audioUrl || null };
    } catch {
      memoryTtsCache.delete(signature);
    }
  }

  // Offline or non-Hanzi fast fallback to Web Speech API
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const hasHanzi = /[\u4e00-\u9fa5]/.test(cleanText);
  if (isOffline || !hasHanzi || cleanText.length > MAX_CLIENT_TTS_TEXT_LENGTH) {
    options.onPlaybackMode?.('device');
    return speakWithWebSpeechFallback(cleanText, {
      ...options,
      rate: normalizedRate,
    });
  }

  try {
    const resolved = await resolveTtsAsset(signature, {
      cleanText,
      resolvedVoice,
      normalizedRate,
      fetchFn: options.fetchImpl || fetch,
      hasCustomFetch: Boolean(options.fetchImpl),
      preferWebAudio: options.preferWebAudio !== false,
    });

    if (!resolved?.ok || !resolved.entry) {
      options.onPlaybackMode?.('device');
      return speakWithWebSpeechFallback(cleanText, {
        ...options,
        rate: normalizedRate,
      });
    }

    options.onPlaybackMode?.('cdn');
    await playCachedOrResolvedEntry(resolved.entry, { ...options, rate: normalizedRate });

    return {
      ok: true,
      mode: resolved.mode,
      audioUrl: resolved.entry.audioUrl || null,
      cacheKey: resolved.entry.cacheKey || null,
      provider: resolved.entry.provider || null,
    };
  } catch {
    options.onPlaybackMode?.('device');
    return speakWithWebSpeechFallback(cleanText, {
      ...options,
      rate: normalizedRate,
    });
  }
}

/**
 * Prefetch upcoming TTS items into L1/L2 cache with capped background concurrency (default: 2).
 * Completely fail-open on Private Mode / offline / unsupported browsers.
 */
export async function prefetchTtsItems(items = [], options = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    return { prefetched: 0, skipped: 0, failed: 0 };
  }

  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  if (isOffline) {
    return { prefetched: 0, skipped: items.length, failed: 0 };
  }

  const functionalSettings = getTtsFunctionalSettings();
  const limit = Math.max(1, Math.min(2, Number(options.concurrency) || 2));
  const fetchFn = options.fetchImpl || (typeof fetch === 'function' ? fetch : null);
  if (!fetchFn) {
    return { prefetched: 0, skipped: items.length, failed: 0 };
  }

  const queue = [];
  const seenSignatures = new Set();
  let skipped = 0;

  for (const rawItem of items) {
    const item = typeof rawItem === 'string' ? { text: rawItem } : rawItem || {};
    const cleanText = normalizeClientTtsText(item.text);
    if (!cleanText || !/[\u4e00-\u9fa5]/.test(cleanText) || cleanText.length > MAX_CLIENT_TTS_TEXT_LENGTH) {
      skipped += 1;
      continue;
    }
    const resolvedVoice = resolveClientTtsVoice(item.voice || options.voice || functionalSettings.voice, cleanText);
    const normalizedRate = normalizeClientTtsRate(
      item.rate !== undefined
        ? item.rate
        : options.rate !== undefined
          ? options.rate
          : functionalSettings.rate
    );
    const signature = buildClientTtsSignature(cleanText, resolvedVoice, normalizedRate);

    if (memoryTtsCache.has(signature) || seenSignatures.has(signature)) {
      skipped += 1;
      continue;
    }
    seenSignatures.add(signature);
    queue.push({ signature, cleanText, resolvedVoice, normalizedRate });
  }

  let prefetched = 0;
  let failed = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < queue.length) {
      const idx = cursor;
      cursor += 1;
      const task = queue[idx];
      try {
        const res = await resolveTtsAsset(task.signature, {
          cleanText: task.cleanText,
          resolvedVoice: task.resolvedVoice,
          normalizedRate: task.normalizedRate,
          fetchFn,
          hasCustomFetch: Boolean(options.fetchImpl),
          preferWebAudio: options.preferWebAudio !== false,
        });
        if (res?.ok) {
          prefetched += 1;
        } else {
          failed += 1;
        }
      } catch {
        failed += 1;
      }
    }
  }

  const workerCount = Math.min(limit, queue.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return { prefetched, skipped, failed };
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

  unlockMobileAudio();
  stopCurrentAudio();
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
