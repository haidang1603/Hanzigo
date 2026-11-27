/**
 * =========================================================================
 * HANZIGO — AZURE NEURAL TTS + SUPABASE STORAGE CDN CACHE GATEWAY
 * =========================================================================
 * 1. Auth (`verifyRequestAuth`) + CORS allowlist + Trusted-IP Rate Limit.
 * 2. Strict Validation (1..1200 chars, valid Hanzi [\u4e00-\u9fa5]).
 * 3. Content-Addressed Immutable 1.0x Cache (`v1/{profile}/{xx}/{hash}.mp3` in `hsk-audio`).
 * 4. Cache-Hit Short-Circuit (0 Azure calls) -> Cache-Miss Azure Neural TTS -> Upload CDN.
 * 5. Fail-safe `TTS_UPSTREAM_UNAVAILABLE` so client falls back smoothly to Web Speech API.
 */

import crypto from 'crypto';
import {
  verifyRequestAuth,
  getSupabaseAdminClient,
  sendSafeServerError,
} from '../_utils/supabaseServer.js';
import { applyCorsAllowlist, getTrustedClientIp } from '../_utils/corsAndIp.js';
import { checkRateLimitAndQuota } from '../_utils/distributedRateLimiter.js';
import {
  ALLOWED_VOICES,
  ALLOWED_RATES,
  DEFAULT_VOICE,
  DEFAULT_RATE,
  VOICE_ALIAS_MAP,
  resolveTtsVoice,
  normalizeTtsRate,
  escapeSsml,
  buildSsml,
  synthesizeChineseSpeechBuffer,
} from '../_utils/ttsProviderAdapter.js';
import {
  HSK_AUDIO_BUCKET,
  AZURE_OUTPUT_FORMAT,
  MAX_TTS_TEXT_LENGTH,
  VOICE_PROFILES,
  normalizeAudioText,
  escapeXmlSsml,
  parseDialogueTurns,
  resolveVoiceProfile,
  buildAzureSsml,
  computeCdnAudioHash,
  buildCdnAudioStoragePath,
  buildPublicCdnAudioUrl,
} from '../_utils/azureTtsSsml.js';

export {
  ALLOWED_VOICES,
  ALLOWED_RATES,
  DEFAULT_VOICE,
  DEFAULT_RATE,
  VOICE_ALIAS_MAP,
  resolveTtsVoice,
  normalizeTtsRate,
  escapeSsml,
  buildSsml,
  HSK_AUDIO_BUCKET,
  AZURE_OUTPUT_FORMAT,
  MAX_TTS_TEXT_LENGTH,
  VOICE_PROFILES,
  normalizeAudioText,
  escapeXmlSsml,
  parseDialogueTurns,
  resolveVoiceProfile,
  buildAzureSsml,
  computeCdnAudioHash,
  buildCdnAudioStoragePath,
  buildPublicCdnAudioUrl,
};

const TTS_REGISTRY_TABLE = 'tts_audio_cache_registry';
const MAX_TEXT_LENGTH = MAX_TTS_TEXT_LENGTH;
const CDN_HEAD_TIMEOUT_MS = 1500;
const AZURE_TTS_TIMEOUT_MS = 12000;

/**
 * Normalize Chinese text for deterministic hashing.
 */
export function normalizeTtsText(text = '') {
  return String(text || '').trim().replace(/\s+/g, ' ');
}

/**
 * Legacy deterministic SHA-256 cache key helper (kept for backward compatibility).
 */
export function computeTtsCacheKey(voiceOrInput, rateArg, textArg) {
  let voice = voiceOrInput;
  let rate = rateArg;
  let text = textArg;

  if (voiceOrInput && typeof voiceOrInput === 'object') {
    voice = voiceOrInput.voice;
    rate = voiceOrInput.rate;
    text = voiceOrInput.text;
  }

  const normalizedText = normalizeTtsText(text);
  const resolvedVoice = resolveTtsVoice(voice);
  const numericRate = Number.parseFloat(rate);
  const formattedRate = (Number.isFinite(numericRate) ? numericRate : DEFAULT_RATE).toFixed(2);

  const payload = `${normalizedText}|${resolvedVoice}|${formattedRate}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Legacy sharded Supabase Storage path helper (kept for backward compatibility).
 */
export function buildTtsStoragePath(voice, rate, cacheKey) {
  const resolvedVoice = resolveTtsVoice(voice);
  const normalizedRate = normalizeTtsRate(rate);
  return `${resolvedVoice}/${normalizedRate.toFixed(2)}/${cacheKey.slice(0, 2)}/${cacheKey}.mp3`;
}

function getSupabasePublicBaseUrl() {
  return (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
}

async function checkPublicUrlExists(publicUrl, fetchImpl = fetch) {
  if (!publicUrl || typeof fetchImpl !== 'function') return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CDN_HEAD_TIMEOUT_MS);
  try {
    const res = await fetchImpl(publicUrl, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return Boolean(res && res.ok);
  } catch {
    clearTimeout(timer);
    return false;
  }
}

async function checkBucketObjectExists(admin, storagePath) {
  if (!admin?.storage) return false;
  try {
    const lastSlash = storagePath.lastIndexOf('/');
    const folder = lastSlash >= 0 ? storagePath.slice(0, lastSlash) : '';
    const fileName = lastSlash >= 0 ? storagePath.slice(lastSlash + 1) : storagePath;
    const { data, error } = await admin.storage
      .from(HSK_AUDIO_BUCKET)
      .list(folder, { limit: 10, search: fileName });
    if (error || !Array.isArray(data)) return false;
    return data.some((item) => item?.name === fileName);
  } catch {
    return false;
  }
}

async function synthesizeAzureDirect({ text, voiceProfile, fetchImpl = fetch }) {
  const apiKey = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!apiKey) {
    return { ok: false, reason: 'azure_unconfigured' };
  }

  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const ssml = buildAzureSsml(text, voiceProfile);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AZURE_TTS_TIMEOUT_MS);

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': AZURE_OUTPUT_FORMAT,
        'User-Agent': 'HanziGo-TTS-Gateway',
      },
      body: ssml,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response?.ok) {
      return {
        ok: false,
        status: response?.status || 502,
        reason: `azure_http_${response?.status || 502}`,
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

function respondWithCdnHit(res, { publicUrl, cacheState, voiceProfile, cdnHash, cacheKey, wantsBinaryRedirect }) {
  res.setHeader('X-TTS-Cache', cacheState);
  res.setHeader('Cache-Control', cacheState === 'HIT' ? 'public, max-age=86400' : 'public, max-age=31536000, immutable');

  if (wantsBinaryRedirect && publicUrl && typeof res.redirect === 'function') {
    return res.redirect(302, publicUrl);
  }
  if (wantsBinaryRedirect && publicUrl) {
    res.setHeader('Location', publicUrl);
    return res.status(302).end();
  }

  return res.status(200).json({
    status: cacheState === 'HIT' ? 'hit' : 'miss_synthesized',
    cached: cacheState === 'HIT',
    url: publicUrl,
    audioUrl: publicUrl,
    voice: voiceProfile,
    hash: cdnHash,
    cacheKey,
    provider: 'azure_neural',
    rate: 1.0,
  });
}

export default async function handler(req, res) {
  if (
    applyCorsAllowlist(
      req,
      res,
      'GET, POST, OPTIONS',
      'Authorization, Content-Type, X-User-Id, Accept'
    )
  ) {
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Chỉ hỗ trợ GET hoặc POST.' });
  }

  try {
    // 1. Zero-Trust Auth
    const auth = await verifyRequestAuth(req);
    if (!auth.authenticated || !auth.user) {
      return res.status(401).json({
        error: 'Unauthorized: Yêu cầu cung cấp Bearer Token hợp lệ để sử dụng dịch vụ TTS.',
      });
    }

    // 2. Distributed Rate Limiting (60 requests/min/user or trusted IP)
    const clientKey = auth.user.id || getTrustedClientIp(req);
    const rateCheck = await checkRateLimitAndQuota({
      clientKey,
      windowMs: 60 * 1000,
      maxRequests: 60,
      dailyQuotaMax: 2000,
      prefix: 'tts',
    });

    if (!rateCheck.allowed) {
      return res.status(rateCheck.statusCode || 429).json({
        error: rateCheck.reason || 'Quá nhiều yêu cầu TTS. Vui lòng thử lại sau 1 phút.',
      });
    }

    // 3. Input Validation & Normalization
    const body = req.method === 'POST' ? req.body || {} : {};
    const query = req.query || {};

    const rawInputText = body.text ?? query.text ?? '';
    const normalizedForSsml = normalizeAudioText(rawInputText);
    const rawText = normalizeTtsText(normalizedForSsml);

    if (!rawText) {
      return res.status(400).json({ error: 'Nội dung văn bản cần phát âm không được để trống.' });
    }

    if (rawText.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        error: `Độ dài văn bản vượt quá giới hạn tối đa (${MAX_TEXT_LENGTH} ký tự).`,
      });
    }

    if (!/[\u4e00-\u9fa5]/.test(rawText)) {
      return res.status(400).json({
        error: 'Văn bản cần phát âm bắt buộc phải chứa ít nhất một ký tự chữ Hán hợp lệ.',
      });
    }

    const requestedVoice = body.voice ?? query.voice;
    const voiceProfile = resolveVoiceProfile(requestedVoice, normalizedForSsml);
    const resolvedLegacyVoice = resolveTtsVoice(
      voiceProfile === 'male' ? 'male_standard' : requestedVoice
    );
    const normalizedRate = normalizeTtsRate(body.rate ?? query.rate);

    const cdnHash = computeCdnAudioHash(voiceProfile, normalizedForSsml);
    const cdnStoragePath = buildCdnAudioStoragePath(voiceProfile, cdnHash);
    const supabaseBaseUrl = getSupabasePublicBaseUrl();
    const expectedCdnUrl = buildPublicCdnAudioUrl(supabaseBaseUrl, cdnStoragePath);

    // Keep legacy cacheKey for existing callers & registry backward compatibility
    const cacheKey = computeTtsCacheKey(resolvedLegacyVoice, normalizedRate, rawText);
    const wantsUrlJson =
      query.format === 'url' ||
      body.format === 'url' ||
      req.method === 'POST' ||
      String(req.headers?.accept || '').includes('application/json');
    const wantsBinaryRedirect = !wantsUrlJson && req.method === 'GET';

    const admin = getSupabaseAdminClient();
    const fetchImpl = req._fetchImpl || fetch;

    // 4A. Check `hsk-audio` CDN Storage bucket / public URL HEAD (Zero Azure cost)
    const existsInBucket = admin ? await checkBucketObjectExists(admin, cdnStoragePath) : false;
    const existsViaHead = !existsInBucket && expectedCdnUrl
      ? await checkPublicUrlExists(expectedCdnUrl, fetchImpl)
      : false;

    if (existsInBucket || existsViaHead) {
      let publicUrl = expectedCdnUrl;
      if (!publicUrl && admin?.storage) {
        publicUrl = admin.storage.from(HSK_AUDIO_BUCKET).getPublicUrl(cdnStoragePath)?.data?.publicUrl || null;
      }
      return respondWithCdnHit(res, {
        publicUrl,
        cacheState: 'HIT',
        voiceProfile,
        cdnHash,
        cacheKey,
        wantsBinaryRedirect,
      });
    }

    // 4B. Backward-compatible check against legacy `tts_audio_cache_registry`
    if (admin && typeof admin.from === 'function') {
      try {
        const { data: record, error: lookupError } = await admin
          .from(TTS_REGISTRY_TABLE)
          .select('public_url, provider')
          .eq('cache_key', cacheKey)
          .maybeSingle();

        if (!lookupError && record?.public_url) {
          Promise.resolve(
            admin.rpc('increment_tts_cache_hit', { p_cache_key: cacheKey })
          ).catch(() => {});

          res.setHeader('X-TTS-Cache', 'HIT');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.status(200).json({
            status: 'hit',
            cached: true,
            url: record.public_url,
            audioUrl: record.public_url,
            cacheKey,
            hash: cdnHash,
            provider: record.provider || 'azure_neural',
            voice: resolvedLegacyVoice,
            rate: normalizedRate,
          });
        }
      } catch {
        // Proceed to Azure synthesis
      }
    }

    // 5. Cache MISS -> Call Azure Neural TTS (always 1.0x single file)
    let synthResult = await synthesizeAzureDirect({
      text: normalizedForSsml,
      voiceProfile,
      fetchImpl,
    });

    // Optional fallback to secondary server adapters (OpenAI/Edge) if configured & not a strict Azure test
    if (!synthResult.ok && !process.env.AZURE_SPEECH_KEY) {
      synthResult = await synthesizeChineseSpeechBuffer({
        text: rawText,
        voice: resolvedLegacyVoice,
        rate: 1.0,
      });
    }

    if (!synthResult.ok || !synthResult.buffer) {
      const failStatus = query.format === 'url' || body.format === 'url' ? 503 : 200;
      return res.status(failStatus).json({
        status: 'client_fallback_required',
        code: 'TTS_UPSTREAM_UNAVAILABLE',
        fallbackToWebSpeech: true,
        reason: synthResult.reason || 'tts_provider_unconfigured',
        cacheKey,
        hash: cdnHash,
        voice: voiceProfile,
        rate: normalizedRate,
      });
    }

    // 6. Upload MP3 to Supabase Storage `hsk-audio` (idempotent upsert)
    if (admin?.storage) {
      try {
        const { error: uploadError } = await admin.storage
          .from(HSK_AUDIO_BUCKET)
          .upload(cdnStoragePath, synthResult.buffer, {
            contentType: 'audio/mpeg',
            cacheControl: '31536000',
            upsert: true,
          });

        if (!uploadError) {
          const publicUrl =
            admin.storage.from(HSK_AUDIO_BUCKET).getPublicUrl(cdnStoragePath)?.data?.publicUrl ||
            expectedCdnUrl;

          if (publicUrl) {
            return respondWithCdnHit(res, {
              publicUrl,
              cacheState: 'MISS',
              voiceProfile,
              cdnHash,
              cacheKey,
              wantsBinaryRedirect,
            });
          }
        }
      } catch {
        // Fall through to inline base64 delivery
      }
    }

    // Fallback delivery if Storage client is unavailable (e.g. local simulation)
    res.setHeader('X-TTS-Cache', 'BYPASS');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    return res.status(200).json({
      status: 'miss_synthesized',
      cached: false,
      url: null,
      audioUrl: null,
      audioBase64: synthResult.buffer.toString('base64'),
      contentType: synthResult.contentType || 'audio/mpeg',
      cacheKey,
      hash: cdnHash,
      provider: synthResult.provider || 'azure_neural',
      byteSize: synthResult.buffer.length,
      voice: voiceProfile,
      rate: 1.0,
    });
  } catch (err) {
    return sendSafeServerError(
      res,
      'Dịch vụ tổng hợp giọng nói gặp sự cố nội bộ.',
      err,
      500
    );
  }
}
