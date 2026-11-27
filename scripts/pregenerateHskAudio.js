/**
 * =========================================================================
 * HANZI GO — BATCH AZURE NEURAL TTS AUDIO PRE-GENERATION CLI
 * =========================================================================
 * Usage:
 *   npm run audio:pregen -- --dry-run
 *   npm run audio:pregen -- --level=1 --voice=auto --limit=50
 *   npm run audio:pregen -- --all --voice=auto
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { HSK_EXAMS, HSK_QUESTIONS } from '../src/data/hskExamsData.js';
import { EXPANDED_MOCK_EXAMS, EXPANDED_MOCK_QUESTIONS } from '../src/data/hskMockExamsExpanded.js';
import { HSK6_FULL_101_EXAM, HSK6_FULL_101_QUESTIONS } from '../src/data/hsk6FullExamData.js';
import { ensureAllExamSupplementsLoaded } from '../src/data/examSupplements/index.js';
import { ensureAllFullStandardExamsLoaded } from '../src/data/hsk30/index.js';
import { ALL_CONVERSATION_SCENARIOS } from '../src/data/conversationScenarios.js';
import {
  HSK_AUDIO_BUCKET,
  AZURE_OUTPUT_FORMAT,
  MAX_TTS_TEXT_LENGTH,
  VOICE_PROFILES,
  normalizeAudioText,
  parseDialogueTurns,
  resolveVoiceProfile,
  buildAzureSsml,
  computeCdnAudioHash,
  buildCdnAudioStoragePath,
} from '../api/_utils/azureTtsSsml.js';

function parseCliArgs(argv = []) {
  const args = {
    dryRun: false,
    level: 'all',
    voice: 'auto',
    provider: 'auto',
    limit: Infinity,
  };
  for (const raw of argv) {
    if (raw === '--dry-run') args.dryRun = true;
    else if (raw === '--all') args.level = 'all';
    else if (raw.startsWith('--level=')) args.level = raw.slice('--level='.length).trim();
    else if (raw.startsWith('--voice=')) args.voice = raw.slice('--voice='.length).trim();
    else if (raw.startsWith('--provider=')) args.provider = raw.slice('--provider='.length).trim().toLowerCase();
    else if (raw.startsWith('--limit=')) {
      const n = Number.parseInt(raw.slice('--limit='.length), 10);
      if (Number.isFinite(n) && n > 0) args.limit = n;
    }
  }
  return args;
}

function matchesLevelFilter(rawLevel = '', targetFilter = 'all') {
  if (!targetFilter || targetFilter === 'all') return true;
  const lvl = String(rawLevel || '').replace(/–/g, '-').toUpperCase();
  const target = String(targetFilter).trim().toUpperCase();
  if (target === 'HSKK' || target === 'CONVERSATION') {
    return lvl === target;
  }
  if (target === '7' || target === '8' || target === '9' || target === '7-9') {
    return lvl.includes('7') || lvl.includes('8') || lvl.includes('9');
  }
  return lvl.includes(`HSK ${target}`) || lvl === target;
}

function extractHskkPrompts() {
  try {
    const filePath = path.resolve(process.cwd(), 'src/features/hskk-exam/hskkEngine.ts');
    const source = fs.readFileSync(filePath, 'utf8');
    const prompts = [];
    const regex = /promptZh:\s*['"`]([^'"`\r\n]+)['"`]/g;
    let m;
    while ((m = regex.exec(source)) !== null) {
      if (m[1] && /[\u4e00-\u9fa5]/.test(m[1])) {
        prompts.push({ level: 'HSKK', source: 'hskkEngine', text: m[1] });
      }
    }
    return prompts;
  } catch {
    return [];
  }
}

export async function collectTargetAudioEntries({ level = 'all', voice = 'auto' } = {}) {
  const rawItems = [];

  const examLevelById = new Map();
  for (const e of [...HSK_EXAMS, ...EXPANDED_MOCK_EXAMS, HSK6_FULL_101_EXAM]) {
    if (e?.id) examLevelById.set(e.id, e.level || 'HSK');
  }

  const pushQuestionList = (questions = [], sourceName = 'bank', fallbackLevel = 'HSK') => {
    for (const q of questions) {
      if (!q) continue;
      const qLevel = q.level || examLevelById.get(q.exam_id) || fallbackLevel;
      const skill = String(q.part_type || q.skill || '').toLowerCase();
      const candidateText = q.audioText || q.audio_script || (skill === 'listening' ? q.prompt : '');
      if (!candidateText || !/[\u4e00-\u9fa5]/.test(candidateText)) continue;
      rawItems.push({ level: qLevel, source: sourceName, text: candidateText });
    }
  };

  pushQuestionList(HSK_QUESTIONS, 'hskExamsData');
  pushQuestionList(EXPANDED_MOCK_QUESTIONS, 'hskMockExamsExpanded');
  pushQuestionList(HSK6_FULL_101_QUESTIONS, 'hsk6FullExamData', 'HSK 6');

  const supplements = await ensureAllExamSupplementsLoaded();
  for (const exam of supplements) {
    pushQuestionList(exam?.questions || [], `supplement:${exam?.id}`, exam?.level);
  }

  const { hsk30Exams, hsk20FullExams } = await ensureAllFullStandardExamsLoaded();
  for (const exam of [...hsk30Exams, ...hsk20FullExams]) {
    pushQuestionList(exam?.questions || [], `dual:${exam?.id}`, exam?.level);
  }

  for (const hskk of extractHskkPrompts()) {
    rawItems.push(hskk);
  }

  for (const scen of ALL_CONVERSATION_SCENARIOS || []) {
    if (scen?.initialMessage && /[\u4e00-\u9fa5]/.test(scen.initialMessage)) {
      rawItems.push({ level: scen.level || 'CONVERSATION', source: 'conversation', text: scen.initialMessage });
    }
    if (Array.isArray(scen?.suggestedReplies)) {
      for (const reply of scen.suggestedReplies) {
        const zh = typeof reply === 'string' ? reply : reply?.zh || reply?.hanzi;
        if (zh && /[\u4e00-\u9fa5]/.test(zh)) {
          rawItems.push({ level: scen.level || 'CONVERSATION', source: 'conversation', text: zh });
        }
      }
    }
  }

  const deduped = new Map();
  for (const item of rawItems) {
    if (!matchesLevelFilter(item.level, level)) continue;
    const normalized = normalizeAudioText(item.text);
    if (!normalized || normalized.length > MAX_TTS_TEXT_LENGTH) continue;
    const voiceProfile = resolveVoiceProfile(voice, normalized);
    const hash = computeCdnAudioHash(voiceProfile, normalized);
    const storagePath = buildCdnAudioStoragePath(voiceProfile, hash);
    const key = `${voiceProfile}:${hash}`;
    if (!deduped.has(key)) {
      deduped.set(key, {
        level: item.level,
        source: item.source,
        text: normalized,
        charCount: normalized.length,
        voiceProfile,
        hash,
        storagePath,
      });
    }
  }

  return Array.from(deduped.values());
}

function createSupabaseAdmin() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function fetchCachedPathSet(supabase, scopedItems = []) {
  const cachedSet = new Set();
  if (!supabase || scopedItems.length === 0) return cachedSet;

  const neededByFolder = new Map();
  const profilesNeeded = new Set();
  for (const item of scopedItems) {
    const lastSlash = item.storagePath.lastIndexOf('/');
    const folder = lastSlash >= 0 ? item.storagePath.slice(0, lastSlash) : '';
    const fileName = lastSlash >= 0 ? item.storagePath.slice(lastSlash + 1) : item.storagePath;
    profilesNeeded.add(`v1/${item.voiceProfile}`);
    if (!neededByFolder.has(folder)) neededByFolder.set(folder, []);
    neededByFolder.get(folder).push({ fileName, storagePath: item.storagePath });
  }

  const existingFolders = new Set();
  await Promise.all(
    Array.from(profilesNeeded).map(async (profilePrefix) => {
      const { data, error } = await supabase.storage
        .from(HSK_AUDIO_BUCKET)
        .list(profilePrefix, { limit: 300 });
      if (error || !Array.isArray(data)) return;
      for (const entry of data) {
        if (entry?.name) existingFolders.add(`${profilePrefix}/${entry.name}`);
      }
    })
  );

  const foldersToCheck = Array.from(neededByFolder.keys()).filter((f) => existingFolders.has(f));
  let cursor = 0;
  const workerCount = Math.min(10, foldersToCheck.length);

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (cursor < foldersToCheck.length) {
        const folder = foldersToCheck[cursor++];
        const { data, error } = await supabase.storage.from(HSK_AUDIO_BUCKET).list(folder, { limit: 200 });
        if (error || !Array.isArray(data)) continue;
        const presentNames = new Set(data.map((d) => d?.name).filter(Boolean));
        for (const item of neededByFolder.get(folder) || []) {
          if (presentNames.has(item.fileName)) cachedSet.add(item.storagePath);
        }
      }
    })
  );

  return cachedSet;
}

async function synthesizeWithBackoff(item, apiKey, region, maxRetries = 3) {
  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const ssml = buildAzureSsml(item.text, item.voiceProfile);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': AZURE_OUTPUT_FORMAT,
          'User-Agent': 'HanziGo-Audio-Pregen',
        },
        body: ssml,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.status === 429 && attempt < maxRetries) {
        const waitMs = 1500 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      if (!res.ok) {
        return { ok: false, status: res.status };
      }
      const arrBuf = await res.arrayBuffer();
      return { ok: true, buffer: Buffer.from(arrBuf) };
    } catch (err) {
      clearTimeout(timer);
      if (attempt === maxRetries) {
        return { ok: false, error: err?.message || 'network_error' };
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return { ok: false };
}

const EDGE_PYTHON_SCRIPT = `
import asyncio, json, sys, edge_tts

async def synth_all(turns, out_path):
    chunks = []
    for t in turns:
        comm = edge_tts.Communicate(t["text"], t["voice"])
        async for msg in comm.stream():
            if msg["type"] == "audio":
                chunks.append(msg["data"])
    with open(out_path, "wb") as f:
        for c in chunks:
            f.write(c)

payload = json.loads(sys.stdin.read())
asyncio.run(synth_all(payload["turns"], payload["out"]))
`;

function runEdgePython(turns, outPath, timeoutMs = 30000) {
  return new Promise((resolve) => {
    const child = spawn('python', ['-c', EDGE_PYTHON_SCRIPT], {
      stdio: ['pipe', 'ignore', 'pipe'],
      windowsHide: true,
    });
    let stderr = '';
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        try { child.kill(); } catch {}
        resolve({ ok: false, error: 'edge_timeout' });
      }
    }, timeoutMs);

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      if (!settled) {
        settled = true;
        resolve({ ok: false, error: err?.message || 'spawn_error' });
      }
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (!settled) {
        settled = true;
        if (code === 0 && fs.existsSync(outPath)) {
          try {
            const buffer = fs.readFileSync(outPath);
            resolve(buffer.length > 0 ? { ok: true, buffer } : { ok: false, error: 'empty_mp3' });
          } catch (e) {
            resolve({ ok: false, error: e?.message || 'read_error' });
          }
        } else {
          resolve({ ok: false, error: stderr.trim() || `exit_${code}` });
        }
      }
    });

    child.stdin.write(JSON.stringify({ turns, out: outPath }), 'utf8');
    child.stdin.end();
  });
}

async function synthesizeWithEdgeTts(item, maxRetries = 3) {
  const turns =
    item.voiceProfile === 'dialogue'
      ? parseDialogueTurns(item.text).map((t) => ({ text: t.text, voice: t.voiceId }))
      : [];
  const resolvedTurns =
    turns.length >= 2
      ? turns
      : [
          {
            text: item.text,
            voice: item.voiceProfile === 'male' ? VOICE_PROFILES.male : VOICE_PROFILES.female,
          },
        ];

  const tmpFile = path.join(os.tmpdir(), `hanzigo_edge_${item.hash}_${Date.now()}.mp3`);
  try {
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      const res = await runEdgePython(resolvedTurns, tmpFile);
      if (res.ok && res.buffer?.length) {
        return res;
      }
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
    return { ok: false, error: 'edge_failed_after_retries' };
  } finally {
    try {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    } catch {}
  }
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const items = await collectTargetAudioEntries({ level: args.level, voice: args.voice });
  const scoped = Number.isFinite(args.limit) ? items.slice(0, args.limit) : items;

  const supabase = createSupabaseAdmin();
  const cachedSet = await fetchCachedPathSet(supabase, scoped);
  let alreadyCached = 0;
  const pending = [];

  for (const item of scoped) {
    if (cachedSet.has(item.storagePath)) {
      alreadyCached += 1;
    } else {
      pending.push(item);
    }
  }

  const azureKey = (process.env.AZURE_SPEECH_KEY || '').trim();
  const azureRegion = (process.env.AZURE_SPEECH_REGION || 'eastasia').trim();
  const resolvedProvider =
    args.provider === 'azure' || args.provider === 'edge'
      ? args.provider
      : azureKey
        ? 'azure'
        : 'edge';

  const totalChars = scoped.reduce((sum, x) => sum + x.charCount, 0);
  const pendingChars = pending.reduce((sum, x) => sum + x.charCount, 0);

  console.log('=== HANZIGO NEURAL TTS PREGEN ===');
  console.log(`Mode: ${args.dryRun ? 'DRY RUN (0 synthesis calls)' : `LIVE SYNTHESIS (provider=${resolvedProvider})`}`);
  console.log(`Scope: level=${args.level}, voice=${args.voice}, limit=${args.limit === Infinity ? 'ALL' : args.limit}`);
  console.log(`Total unique texts found: ${items.length} (in batch: ${scoped.length})`);
  console.log(`Already cached in '${HSK_AUDIO_BUCKET}': ${alreadyCached}`);
  console.log(`Pending synthesis: ${pending.length} (${pendingChars.toLocaleString()} chars; total batch: ${totalChars.toLocaleString()} chars / 500,000 Azure F0 monthly quota)`);

  if (args.dryRun) {
    return;
  }

  if (!supabase) {
    console.error('❌ Cần cấu hình SUPABASE_URL/VITE_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trong .env.');
    process.exit(1);
  }
  if (resolvedProvider === 'azure' && !azureKey) {
    console.error('❌ Cần cấu hình AZURE_SPEECH_KEY hoặc chạy với --provider=edge.');
    process.exit(1);
  }

  const CONCURRENCY = 3;
  let cursor = 0;
  let uploaded = 0;
  let failed = 0;

  async function worker() {
    while (cursor < pending.length) {
      const idx = cursor;
      cursor += 1;
      const item = pending[idx];
      const synth =
        resolvedProvider === 'azure'
          ? await synthesizeWithBackoff(item, azureKey, azureRegion)
          : await synthesizeWithEdgeTts(item);
      if (!synth.ok || !synth.buffer?.length) {
        failed += 1;
        continue;
      }
      const { error } = await supabase.storage
        .from(HSK_AUDIO_BUCKET)
        .upload(item.storagePath, synth.buffer, {
          contentType: 'audio/mpeg',
          cacheControl: '31536000',
          upsert: true,
        });
      if (error) {
        failed += 1;
      } else {
        uploaded += 1;
        if (uploaded % 25 === 0 || uploaded + failed === pending.length) {
          console.log(`Progress: ${uploaded}/${pending.length} uploaded (${failed} failed)...`);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, pending.length || 1) }, () => worker()));
  console.log(`✅ Completed (${resolvedProvider}): uploaded=${uploaded}, failed=${failed}, skipped_cached=${alreadyCached}`);
}

const isEntry = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isEntry || process.argv[1]?.endsWith('pregenerateHskAudio.js')) {
  main().catch((err) => {
    console.error('❌ Pregen error:', err);
    process.exit(1);
  });
}
