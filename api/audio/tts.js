/**
 * =========================================================================
 * HANZIGO — CONTENT-ADDRESSABLE TTS PROXY & STORAGE CACHE (TASK 32.02)
 * =========================================================================
 * 1. Rate Limiting (60 req/min/user or IP via distributedRateLimiter.js) & Zero-Trust Auth.
 * 2. Strict Validation (1 - 600 chars, must contain Hanzi [\u4e00-\u9fa5], canonical voice & rate).
 * 3. Content-Addressable SHA-256 Cache Key + Bucket 'tts-audio-cache' + Registry Table.
 * 4. 2-Tier Lookup: Fast Registry Hit -> Azure/OpenAI/Edge Synthesis -> Persist to Storage.
 * 5. Graceful fallback (`client_fallback_required`) without ever throwing HTTP 500 on provider miss.
 */

import crypto from 'crypto';
import { verifyRequestAuth, getSupabaseAdminClient } from '../_utils/supabaseServer.js';
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
};

const TTS_BUCKET = 'tts-audio-cache';
const TTS_REGISTRY_TABLE = 'tts_audio_cache_registry';
const MAX_TEXT_LENGTH = 600;

/**
 * Normalize Chinese text for deterministic hashing.
 */
export function normalizeTtsText(text = '') {
  return String(text || '').trim().replace(/\s+/g, ' ');
}

/**
 * Compute deterministic SHA-256 cache key.
 * Supports both `(voice, rate, text)` and `({ text, voice, rate })` signatures.
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
 * Compute sharded Supabase Storage path for optimal prefix distribution.
 */
export function buildTtsStoragePath(voice, rate, cacheKey) {
  const resolvedVoice = resolveTtsVoice(voice);
  const normalizedRate = normalizeTtsRate(rate);
  return `${resolvedVoice}/${normalizedRate.toFixed(2)}/${cacheKey.slice(0, 2)}/${cacheKey}.mp3`;
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown-ip';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-User-Id, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
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

    // 2. Distributed Rate Limiting (60 requests/min/user or IP)
    const clientKey = auth.user.id || getClientIp(req);
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

    // 3. Input Validation & Canonicalization
    const body = req.method === 'POST' ? req.body || {} : {};
    const query = req.query || {};

    const rawText = normalizeTtsText(body.text ?? query.text ?? '');
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

    const resolvedVoice = resolveTtsVoice(body.voice ?? query.voice);
    const normalizedRate = normalizeTtsRate(body.rate ?? query.rate);

    const cacheKey = computeTtsCacheKey(resolvedVoice, normalizedRate, rawText);
    const storagePath = buildTtsStoragePath(resolvedVoice, normalizedRate, cacheKey);

    const admin = getSupabaseAdminClient();

    // 4. Tier 1: Fast Registry Lookup (Cache Hit)
    if (admin) {
      try {
        const { data: record, error: lookupError } = await admin
          .from(TTS_REGISTRY_TABLE)
          .select('public_url, provider')
          .eq('cache_key', cacheKey)
          .maybeSingle();

        if (!lookupError && record?.public_url) {
          // Non-blocking hit counter update
          Promise.resolve(
            admin.rpc('increment_tts_cache_hit', { p_cache_key: cacheKey })
          ).catch(() => {});

          res.setHeader('X-TTS-Cache', 'HIT');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.status(200).json({
            status: 'hit',
            cached: true,
            audioUrl: record.public_url,
            cacheKey,
            provider: record.provider || 'azure_neural',
            voice: resolvedVoice,
            rate: normalizedRate,
          });
        }
      } catch {
        // Proceed to Tier 2 synthesis on registry lookup error
      }
    }

    // 5. Tier 2: Synthesize Audio Buffer via Provider Adapter
    const synthResult = await synthesizeChineseSpeechBuffer({
      text: rawText,
      voice: resolvedVoice,
      rate: normalizedRate,
    });

    if (!synthResult.ok || !synthResult.buffer) {
      return res.status(200).json({
        status: 'client_fallback_required',
        fallbackToWebSpeech: true,
        reason: synthResult.reason || 'tts_provider_unconfigured',
        cacheKey,
        voice: resolvedVoice,
        rate: normalizedRate,
      });
    }

    // 6. Tier 3: Persist to Supabase Storage & Registry
    if (admin) {
      try {
        const { error: uploadError } = await admin.storage
          .from(TTS_BUCKET)
          .upload(storagePath, synthResult.buffer, {
            contentType: synthResult.contentType || 'audio/mpeg',
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = admin.storage
            .from(TTS_BUCKET)
            .getPublicUrl(storagePath);
          const publicUrl = publicUrlData?.publicUrl || null;

          if (publicUrl) {
            await admin.from(TTS_REGISTRY_TABLE).upsert(
              {
                cache_key: cacheKey,
                text_zh: rawText,
                voice_id: resolvedVoice,
                speed_rate: normalizedRate,
                storage_path: storagePath,
                public_url: publicUrl,
                byte_size: synthResult.buffer.length,
                provider: synthResult.provider,
              },
              { onConflict: 'cache_key' }
            );

            res.setHeader('X-TTS-Cache', 'MISS');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return res.status(200).json({
              status: 'miss_synthesized',
              cached: false,
              audioUrl: publicUrl,
              cacheKey,
              provider: synthResult.provider,
              byteSize: synthResult.buffer.length,
              voice: resolvedVoice,
              rate: normalizedRate,
            });
          }
        }
      } catch {
        // Fall through to inline base64 delivery if storage write fails
      }
    }

    // Fallback delivery if Supabase Storage is unavailable in local dev
    res.setHeader('X-TTS-Cache', 'BYPASS');
    return res.status(200).json({
      status: 'miss_synthesized',
      cached: false,
      audioUrl: null,
      audioBase64: synthResult.buffer.toString('base64'),
      contentType: synthResult.contentType || 'audio/mpeg',
      cacheKey,
      provider: synthResult.provider,
      byteSize: synthResult.buffer.length,
      voice: resolvedVoice,
      rate: normalizedRate,
    });
  } catch {
    return res.status(200).json({
      status: 'client_fallback_required',
      fallbackToWebSpeech: true,
      reason: 'tts_internal_fallback',
    });
  }
}
