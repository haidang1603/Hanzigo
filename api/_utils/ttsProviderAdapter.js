/**
 * =========================================================================
 * HANZIGO — TTS PROVIDER ADAPTER (TASK 32.02)
 * =========================================================================
 * Handles SSML sanitization, voice/rate normalization, Azure Neural TTS
 * synthesis, and graceful fallback to OpenAI TTS / Edge TTS / client Web Speech.
 */

export const ALLOWED_VOICES = {
  'zh-CN-XiaoxiaoNeural': { gender: 'Female', name: 'Xiaoxiao (Nữ chuẩn)' },
  'zh-CN-YunxiNeural': { gender: 'Male', name: 'Yunxi (Nam chuẩn)' },
  'zh-CN-XiaoyiNeural': { gender: 'Female', name: 'Xiaoyi (Nữ tin tức)' },
};

export const VOICE_ALIAS_MAP = {
  female_standard: 'zh-CN-XiaoxiaoNeural',
  male_standard: 'zh-CN-YunxiNeural',
  female_news: 'zh-CN-XiaoyiNeural',
};

export const ALLOWED_RATES = [0.75, 0.90, 1.00, 1.25];
export const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';
export const DEFAULT_RATE = 1.00;
const TTS_TIMEOUT_MS = 12000;

/**
 * Resolve friendly voice alias or direct Azure voice ID to whitelisted voice ID.
 */
export function resolveTtsVoice(voiceInput) {
  if (!voiceInput) return DEFAULT_VOICE;
  const raw = String(voiceInput).trim();
  const mapped = VOICE_ALIAS_MAP[raw] || raw;
  return ALLOWED_VOICES[mapped] ? mapped : DEFAULT_VOICE;
}

/**
 * Snap requested playback rate to the nearest canonical milestone (0.75, 0.90, 1.00, 1.25)
 * to prevent cache fragmentation.
 */
export function normalizeTtsRate(rateInput) {
  const parsed = Number.parseFloat(rateInput);
  if (!Number.isFinite(parsed)) return DEFAULT_RATE;

  let nearest = ALLOWED_RATES[0];
  let minDiff = Math.abs(parsed - nearest);

  for (let i = 1; i < ALLOWED_RATES.length; i += 1) {
    const candidate = ALLOWED_RATES[i];
    const diff = Math.abs(parsed - candidate);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = candidate;
    }
  }

  return nearest;
}

/**
 * Escape XML special characters to prevent SSML injection.
 */
export function escapeSsml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Build Microsoft Cognitive Speech Services SSML payload.
 */
export function buildSsml(voice, rate, text) {
  const safeVoice = resolveTtsVoice(voice);
  const gender = ALLOWED_VOICES[safeVoice]?.gender || 'Female';
  const escapedText = escapeSsml(String(text || '').trim());
  const prosodyRate = `${Math.round((rate - 1.0) * 100)}%`;

  return `<speak version='1.0' xml:lang='zh-CN'><voice xml:lang='zh-CN' xml:gender='${gender}' name='${safeVoice}'><prosody rate='${prosodyRate}'>${escapedText}</prosody></voice></speak>`;
}

async function synthesizeViaAzure({ text, voice, rate }) {
  const apiKey = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!apiKey) {
    return { ok: false, reason: 'azure_unconfigured' };
  }

  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const ssml = buildSsml(voice, rate, text);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'HanziGo-TTS-Proxy',
      },
      body: ssml,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return {
        ok: false,
        reason: `azure_http_${response.status}`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer.length) {
      return { ok: false, reason: 'azure_empty_audio' };
    }

    return {
      ok: true,
      buffer,
      provider: 'azure_neural',
      contentType: 'audio/mpeg',
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      reason: err?.name === 'AbortError' ? 'azure_timeout' : 'azure_network_error',
    };
  }
}

async function synthesizeViaOpenAi({ text, voice, rate }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: 'openai_unconfigured' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);
  const openAiVoice = voice === 'zh-CN-YunxiNeural' ? 'onyx' : 'nova';

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: String(text || '').trim(),
        voice: openAiVoice,
        speed: rate,
        response_format: 'mp3',
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return { ok: false, reason: `openai_http_${response.status}` };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer.length) {
      return { ok: false, reason: 'openai_empty_audio' };
    }

    return {
      ok: true,
      buffer,
      provider: 'openai_tts',
      contentType: 'audio/mpeg',
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      reason: err?.name === 'AbortError' ? 'openai_timeout' : 'openai_network_error',
    };
  }
}

async function synthesizeViaEdgeEndpoint({ text, voice, rate }) {
  const edgeEndpoint = process.env.EDGE_TTS_ENDPOINT;
  if (!edgeEndpoint) {
    return { ok: false, reason: 'edge_unconfigured' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);

  try {
    const response = await fetch(edgeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: String(text || '').trim(),
        voice,
        rate,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return { ok: false, reason: `edge_http_${response.status}` };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer.length) {
      return { ok: false, reason: 'edge_empty_audio' };
    }

    return {
      ok: true,
      buffer,
      provider: 'edge_neural',
      contentType: 'audio/mpeg',
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      reason: err?.name === 'AbortError' ? 'edge_timeout' : 'edge_network_error',
    };
  }
}

/**
 * Synthesize Chinese speech audio buffer using Azure Neural TTS first,
 * falling back to OpenAI TTS or configured Edge Neural TTS endpoint.
 * Never throws; returns `{ ok: false, reason: 'tts_provider_unconfigured' | ... }` on fallback.
 */
export async function synthesizeChineseSpeechBuffer({ text, voice, rate }) {
  const resolvedVoice = resolveTtsVoice(voice);
  const normalizedRate = normalizeTtsRate(rate);
  const cleanText = String(text || '').trim();

  const azureResult = await synthesizeViaAzure({
    text: cleanText,
    voice: resolvedVoice,
    rate: normalizedRate,
  });
  if (azureResult.ok) return azureResult;

  const openAiResult = await synthesizeViaOpenAi({
    text: cleanText,
    voice: resolvedVoice,
    rate: normalizedRate,
  });
  if (openAiResult.ok) return openAiResult;

  const edgeResult = await synthesizeViaEdgeEndpoint({
    text: cleanText,
    voice: resolvedVoice,
    rate: normalizedRate,
  });
  if (edgeResult.ok) return edgeResult;

  const hasAnyProvider = Boolean(
    process.env.AZURE_SPEECH_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.EDGE_TTS_ENDPOINT
  );

  return {
    ok: false,
    buffer: null,
    provider: null,
    reason: hasAnyProvider ? azureResult.reason : 'tts_provider_unconfigured',
  };
}

