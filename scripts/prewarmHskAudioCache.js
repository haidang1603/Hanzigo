/**
 * =========================================================================
 * HANZIGO — BATCH TTS PRE-WARM CLI (TASK 32.05)
 * =========================================================================
 * Pre-generates MP3 pronunciation files in Supabase Storage ('tts-audio-cache')
 * and registers metadata in `public.tts_audio_cache_registry` for HSK vocabulary
 * (`dictionary_entries`) and listening dialogues (`listening_tracks`, `hsk_question_bank`).
 *
 * Usage:
 *   node scripts/prewarmHskAudioCache.js --level=1 --limit=200 --concurrency=3
 *   node scripts/prewarmHskAudioCache.js --level=2 --limit=50 --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createClient } from '@supabase/supabase-js';
import {
  computeTtsCacheKey,
  buildTtsStoragePath,
  normalizeTtsText,
  resolveTtsVoice,
  normalizeTtsRate,
} from '../api/audio/tts.js';
import { synthesizeChineseSpeechBuffer } from '../api/_utils/ttsProviderAdapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TTS_BUCKET = 'tts-audio-cache';
const TTS_REGISTRY_TABLE = 'tts_audio_cache_registry';

function loadEnvFileIfPresent() {
  for (const filename of ['.env.local', '.env']) {
    const filePath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && !(key in process.env)) {
        process.env[key] = val;
      }
    }
  }
}

export function parsePrewarmArgs(argv = []) {
  const getArgValue = (name) => {
    const prefix = `--${name}=`;
    const match = argv.find((a) => a.startsWith(prefix));
    return match ? match.slice(prefix.length) : null;
  };

  const levelRaw = getArgValue('level');
  const limitRaw = getArgValue('limit');
  const concurrencyRaw = getArgValue('concurrency');
  const voiceRaw = getArgValue('voice');
  const rateRaw = getArgValue('rate');
  const delayRaw = getArgValue('delay');

  const level = levelRaw ? Number.parseInt(levelRaw, 10) : null;
  const limit = limitRaw ? Math.max(1, Number.parseInt(limitRaw, 10)) : 200;
  const concurrency = concurrencyRaw
    ? Math.max(1, Math.min(10, Number.parseInt(concurrencyRaw, 10)))
    : 3;
  const voice = resolveTtsVoice(voiceRaw || 'female_standard');
  const rate = normalizeTtsRate(rateRaw || 1.00);
  const delayMs = delayRaw ? Math.max(0, Number.parseInt(delayRaw, 10)) : 200;
  const dryRun = argv.includes('--dry-run');
  const includeListening = !argv.includes('--dictionary-only');

  return { level, limit, concurrency, voice, rate, delayMs, dryRun, includeListening };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process items with bounded concurrency and gentle inter-item delay
 * to avoid hitting upstream TTS provider rate limits.
 */
export async function processWithConcurrency(items, concurrency, workerFn, delayMs = 200) {
  const results = new Array(items.length);
  let cursor = 0;

  async function runWorker() {
    while (true) {
      const idx = cursor;
      cursor += 1;
      if (idx >= items.length) break;

      results[idx] = await workerFn(items[idx], idx);
      if (delayMs > 0 && cursor < items.length) {
        await sleep(delayMs);
      }
    }
  }

  const poolSize = Math.max(1, Math.min(concurrency, items.length || 1));
  await Promise.all(Array.from({ length: poolSize }, () => runWorker()));
  return results;
}

async function collectCandidateTexts(supabase, { level, limit, includeListening }) {
  const candidates = [];
  const seen = new Set();

  const addCandidate = (text, source) => {
    const clean = normalizeTtsText(text);
    if (!clean || clean.length > 600 || !/[\u4e00-\u9fa5]/.test(clean)) return;
    if (seen.has(clean)) return;
    seen.add(clean);
    candidates.push({ text: clean, source });
  };

  // 1. Dictionary entries (filtered by HSK level if specified)
  let dictQuery = supabase
    .from('dictionary_entries')
    .select('simplified, hsk_2_level, hsk_3_level, frequency_rank')
    .order('frequency_rank', { ascending: true })
    .limit(limit);

  if (level && Number.isInteger(level)) {
    dictQuery = dictQuery.or(`hsk_3_level.eq.${level},hsk_2_level.eq.${level}`);
  }

  const { data: dictRows, error: dictError } = await dictQuery;
  if (!dictError && Array.isArray(dictRows)) {
    for (const row of dictRows) {
      addCandidate(row.simplified, 'dictionary_entries');
    }
  }

  // 2. Listening tracks & HSK question bank (optional)
  if (includeListening && candidates.length < limit) {
    const remaining = limit - candidates.length;

    const { data: tracks } = await supabase
      .from('listening_tracks')
      .select('transcript_zh, title')
      .limit(Math.min(remaining, 100));

    if (Array.isArray(tracks)) {
      for (const track of tracks) {
        addCandidate(track.transcript_zh || track.title, 'listening_tracks');
      }
    }

    if (candidates.length < limit) {
      const { data: questions } = await supabase
        .from('hsk_question_bank')
        .select('prompt_zh, transcript_zh')
        .limit(Math.min(limit - candidates.length, 100));

      if (Array.isArray(questions)) {
        for (const q of questions) {
          addCandidate(q.transcript_zh || q.prompt_zh, 'hsk_question_bank');
        }
      }
    }
  }

  return candidates.slice(0, limit);
}

async function filterUncachedCandidates(supabase, candidates, voice, rate) {
  if (candidates.length === 0) return [];

  const withKeys = candidates.map((item) => {
    const cacheKey = computeTtsCacheKey(voice, rate, item.text);
    const storagePath = buildTtsStoragePath(voice, rate, cacheKey);
    return { ...item, cacheKey, storagePath };
  });

  const existingKeys = new Set();
  for (let i = 0; i < withKeys.length; i += 200) {
    const slice = withKeys.slice(i, i + 200).map((x) => x.cacheKey);
    const { data: rows } = await supabase
      .from(TTS_REGISTRY_TABLE)
      .select('cache_key')
      .in('cache_key', slice);

    for (const row of rows || []) {
      existingKeys.add(row.cache_key);
    }
  }

  return withKeys.filter((item) => !existingKeys.has(item.cacheKey));
}

export async function runPrewarmHskAudioCache(argv = process.argv.slice(2)) {
  loadEnvFileIfPresent();
  const options = parsePrewarmArgs(argv);

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Thiếu biến môi trường VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY để pre-warm TTS cache.'
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const candidates = await collectCandidateTexts(supabase, options);
  const uncached = await filterUncachedCandidates(
    supabase,
    candidates,
    options.voice,
    options.rate
  );

  if (options.dryRun || uncached.length === 0) {
    return {
      dryRun: options.dryRun,
      totalCandidates: candidates.length,
      uncachedCount: uncached.length,
      synthesized: 0,
      failed: 0,
    };
  }

  let synthesized = 0;
  let failed = 0;

  await processWithConcurrency(
    uncached,
    options.concurrency,
    async (item) => {
      const synth = await synthesizeChineseSpeechBuffer({
        text: item.text,
        voice: options.voice,
        rate: options.rate,
      });

      if (!synth.ok || !synth.buffer) {
        failed += 1;
        return { ok: false, cacheKey: item.cacheKey, reason: synth.reason };
      }

      const { error: uploadErr } = await supabase.storage
        .from(TTS_BUCKET)
        .upload(item.storagePath, synth.buffer, {
          contentType: synth.contentType || 'audio/mpeg',
          upsert: true,
        });

      if (uploadErr) {
        failed += 1;
        return { ok: false, cacheKey: item.cacheKey, reason: uploadErr.message };
      }

      const { data: urlData } = supabase.storage
        .from(TTS_BUCKET)
        .getPublicUrl(item.storagePath);

      const { error: upsertErr } = await supabase.from(TTS_REGISTRY_TABLE).upsert(
        {
          cache_key: item.cacheKey,
          text_zh: item.text,
          voice_id: options.voice,
          speed_rate: options.rate,
          storage_path: item.storagePath,
          public_url: urlData?.publicUrl || '',
          byte_size: synth.buffer.length,
          provider: synth.provider,
        },
        { onConflict: 'cache_key' }
      );

      if (upsertErr) {
        failed += 1;
        return { ok: false, cacheKey: item.cacheKey, reason: upsertErr.message };
      }

      synthesized += 1;
      return { ok: true, cacheKey: item.cacheKey };
    },
    options.delayMs
  );

  return {
    dryRun: false,
    totalCandidates: candidates.length,
    uncachedCount: uncached.length,
    synthesized,
    failed,
  };
}

async function main() {
  console.log('🔊 HanziGo TTS Pre-Warm Pipeline starting...');
  const summary = await runPrewarmHskAudioCache();
  console.log(
    `✅ Pre-Warm complete: ${summary.synthesized}/${summary.uncachedCount} synthesized (${summary.failed} failed, ${summary.totalCandidates} total candidates).`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('❌ Pre-Warm failed:', err?.message || err);
    process.exit(1);
  });
}

