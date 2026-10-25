/**
 * =========================================================================
 * HANZIGO — SECURE SERVERLESS API: /api/audio/tts (PHASE 11)
 * =========================================================================
 * Azure Neural TTS Caching Proxy with 4 Security & Cost Safeguards:
 * 1. Chốt chặn 1: Zero-Trust Auth (Bắt buộc Supabase Bearer Token).
 * 2. Chốt chặn 2: Ràng buộc nội dung nghiêm ngặt (1 - 150 chars, bắt buộc có
 *    chữ Hán, whitelist voices, escape SSML injection).
 * 3. Chốt chặn 3: Định danh Cache bất biến SHA-256 (kiểm tra Supabase Storage
 *    bucket audio-cache, trả về ngay nếu Cache HIT).
 * 4. Chốt chặn 4: Gọi Azure REST API khi Cache MISS, tự động lưu đệm vào Storage,
 *    và Graceful Fallback về Web Speech API nếu chưa có khóa hoặc lỗi mạng.
 * =========================================================================
 */

import crypto from 'crypto';
import { verifyRequestAuth, getSupabaseAdminClient } from '../_utils/supabaseServer.js';

// Danh sách giọng đọc Azure Neural Trung văn được phép (Whitelist)
export const ALLOWED_VOICES = {
  'zh-CN-XiaoxiaoNeural': { gender: 'Female', name: 'Xiaoxiao (Nữ chuẩn)' },
  'zh-CN-YunxiNeural': { gender: 'Male', name: 'Yunxi (Nam chuẩn)' },
  'zh-CN-XiaoyiNeural': { gender: 'Female', name: 'Xiaoyi (Nữ trẻ trung)' }
};

export const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';
export const DEFAULT_RATE = 0.85;

/**
 * Escape các ký tự đặc biệt chống SSML Injection
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
 * Tính toán mã băm SHA-256 bất biến làm Cache Key
 */
export function computeTtsCacheKey(voice, rate, text) {
  const normalized = (text || '').trim().replace(/\s+/g, ' ');
  const payload = `${voice}_${rate.toFixed(2)}_${normalized}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Xây dựng chuỗi SSML hợp lệ cho Microsoft Cognitive Speech Services
 */
export function buildSsml(voice, rate, text) {
  const safeVoice = ALLOWED_VOICES[voice] ? voice : DEFAULT_VOICE;
  const gender = ALLOWED_VOICES[safeVoice]?.gender || 'Female';
  const escapedText = escapeSsml(text.trim());
  const prosodyRate = `${Math.round((rate - 1.0) * 100)}%`;

  return `<speak version='1.0' xml:lang='zh-CN'><voice xml:lang='zh-CN' xml:gender='${gender}' name='${safeVoice}'><prosody rate='${prosodyRate}'>${escapedText}</prosody></voice></speak>`;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-User-Id, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // -----------------------------------------------------------------------
    // Chốt chặn 1: Zero-Trust Auth
    // -----------------------------------------------------------------------
    const auth = await verifyRequestAuth(req);
    if (!auth.authenticated || !auth.user) {
      return res.status(401).json({
        error: 'Unauthorized: Yêu cầu cung cấp Bearer Token hợp lệ để sử dụng dịch vụ TTS.'
      });
    }

    // -----------------------------------------------------------------------
    // Chốt chặn 2: Ràng buộc Nội dung Nghiêm ngặt (Input Validation)
    // -----------------------------------------------------------------------
    const body = req.method === 'POST' ? req.body || {} : {};
    const query = req.query || {};

    const rawText = (body.text || query.text || '').trim();
    if (!rawText) {
      return res.status(400).json({ error: 'Nội dung văn bản cần phát âm không được để trống.' });
    }

    if (rawText.length > 150) {
      return res.status(400).json({ error: 'Độ dài văn bản vượt quá giới hạn tối đa (150 ký tự).' });
    }

    // Bắt buộc chứa ít nhất một ký tự chữ Hán (CJK Unified Ideographs)
    const hasChinese = /[\u4e00-\u9fa5]/.test(rawText);
    if (!hasChinese) {
      return res.status(400).json({
        error: 'Văn bản cần phát âm bắt buộc phải chứa ít nhất một ký tự chữ Hán hợp lệ.'
      });
    }

    // Kiểm tra và escape SSML injection
    const requestedVoice = body.voice || query.voice || DEFAULT_VOICE;
    const safeVoice = ALLOWED_VOICES[requestedVoice] ? requestedVoice : DEFAULT_VOICE;

    const parsedRate = parseFloat(body.rate || query.rate || DEFAULT_RATE);
    const safeRate = isNaN(parsedRate) ? DEFAULT_RATE : Math.max(0.7, Math.min(1.2, parsedRate));

    // -----------------------------------------------------------------------
    // Chốt chặn 3: Định danh Cache Bất biến SHA-256 (Deterministic Cache Key)
    // -----------------------------------------------------------------------
    const cacheKey = computeTtsCacheKey(safeVoice, safeRate, rawText);
    const storagePath = `tts/${cacheKey}.mp3`;
    const prefersJson = req.headers['accept']?.includes('application/json') || query.format === 'json';

    const admin = getSupabaseAdminClient();

    // Kiểm tra cache từ Supabase Storage bucket 'audio-cache'
    if (admin) {
      try {
        const { data: cachedBlob, error: downloadError } = await admin.storage
          .from('audio-cache')
          .download(storagePath);

        if (cachedBlob && !downloadError) {
          const arrayBuffer = await cachedBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          if (prefersJson) {
            const { data: publicUrlData } = admin.storage.from('audio-cache').getPublicUrl(storagePath);
            return res.status(200).json({
              success: true,
              cached: true,
              cacheKey,
              audioUrl: publicUrlData?.publicUrl || null,
              audioBase64: buffer.toString('base64'),
              contentType: 'audio/mpeg'
            });
          }

          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.status(200).send(buffer);
        }
      } catch (storageCheckErr) {
        // Tiếp tục gọi Azure nếu bucket chưa tạo hoặc download lỗi
        console.warn('[Audio TTS] Cache check notice:', storageCheckErr.message);
      }
    }

    // -----------------------------------------------------------------------
    // Chốt chặn 4: Gọi Azure REST TTS & Lưu Cache (Cache MISS)
    // -----------------------------------------------------------------------
    const azureKey = process.env.AZURE_SPEECH_KEY;
    const azureRegion = process.env.AZURE_SPEECH_REGION || 'eastus';

    if (!azureKey) {
      // Graceful fallback nếu chưa cấu hình khóa Azure
      return res.status(200).json({
        fallbackToWebSpeech: true,
        reason: 'Máy chủ chưa cấu hình AZURE_SPEECH_KEY. Chuyển sang Web Speech API.',
        cacheKey,
        text: rawText
      });
    }

    const ssml = buildSsml(safeVoice, safeRate, rawText);
    const azureEndpoint = `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const azureResponse = await fetch(azureEndpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'HanziGo'
      },
      body: ssml
    });

    if (!azureResponse.ok) {
      const errText = await azureResponse.text().catch(() => '');
      console.warn(`[Audio TTS] Azure trả về lỗi HTTP ${azureResponse.status}: ${errText}`);
      return res.status(200).json({
        fallbackToWebSpeech: true,
        reason: `Azure Speech API trả về HTTP ${azureResponse.status}. Tự động fallback về Web Speech API.`,
        cacheKey,
        text: rawText
      });
    }

    const audioArrayBuffer = await azureResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    // Lưu đệm bất đồng bộ vào Supabase Storage bucket 'audio-cache'
    if (admin) {
      try {
        await admin.storage
          .from('audio-cache')
          .upload(storagePath, audioBuffer, {
            contentType: 'audio/mpeg',
            upsert: true
          });
      } catch (uploadErr) {
        console.warn('[Audio TTS] Lưu cache thất bại (không ảnh hưởng trả kết quả):', uploadErr.message);
      }
    }

    if (prefersJson) {
      return res.status(200).json({
        success: true,
        cached: false,
        cacheKey,
        audioBase64: audioBuffer.toString('base64'),
        contentType: 'audio/mpeg'
      });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(audioBuffer);

  } catch (error) {
    console.error('[Audio TTS] Lỗi xử lý nghiêm trọng:', error);
    return res.status(200).json({
      fallbackToWebSpeech: true,
      reason: 'Lỗi không xác định trong quá trình xử lý TTS. Chuyển sang Web Speech API.',
      error: error.message
    });
  }
}
