import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  numericToTonePinyin,
  stripPinyinTones,
  resolveHanVietReading,
} from '../scripts/utils/chinesePhoneticsNormalizer.js';
import ttsHandler, { computeTtsCacheKey } from '../api/audio/tts.js';
import { parsePrewarmArgs, processWithConcurrency } from '../scripts/prewarmHskAudioCache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function createMockHttp(options = {}) {
  const req = {
    method: options.method || 'POST',
    headers: options.headers || {},
    query: options.query || {},
    body: options.body || {},
  };

  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    json(obj) {
      this.data = obj;
      return this;
    },
    send(content) {
      this.data = content;
      return this;
    },
    end() {
      return this;
    },
  };

  return { req, res };
}

test('Phase 32 Test 1: Pinyin normalization (ü/v -> nǚ, lǜ) and Han-Viet compound resolver', () => {
  assert.equal(numericToTonePinyin('nu:3 li4'), 'nǚ lì');
  assert.equal(numericToTonePinyin('nv3'), 'nǚ');
  assert.equal(numericToTonePinyin('lv4 se4'), 'lǜ sè');
  assert.equal(numericToTonePinyin('jian1 chi2'), 'jiān chí');

  assert.equal(stripPinyinTones('nǚ lì'), 'nuli');
  assert.equal(stripPinyinTones('lǜ sè'), 'luse');
  assert.equal(stripPinyinTones('jiān chí'), 'jianchi');

  assert.equal(resolveHanVietReading('数据库'), 'THỐ CỨ KHỐ');
  assert.equal(resolveHanVietReading('坚持'), 'KIÊN TRÌ');
});

test('Phase 32 Test 2: computeTtsCacheKey produces deterministic SHA-256 across extra whitespace', () => {
  const keyClean = computeTtsCacheKey('female_standard', 1.0, '你好 世界');
  const keySpaces = computeTtsCacheKey('zh-CN-XiaoxiaoNeural', 1.0, '   你好    世界   ');
  const keyDifferent = computeTtsCacheKey('female_standard', 0.9, '你好 世界');

  assert.equal(keyClean.length, 64);
  assert.match(keyClean, /^[a-f0-9]{64}$/);
  assert.equal(keyClean, keySpaces);
  assert.notEqual(keyClean, keyDifferent);
});

test('Phase 32 Test 3: SQL migration 20261114_3201_tts_audio_cache.sql defines bucket, registry, and RPC', () => {
  const migrationPath = path.join(
    ROOT_DIR,
    'supabase',
    'migrations',
    '20261114_3201_tts_audio_cache.sql'
  );
  assert.equal(fs.existsSync(migrationPath), true);

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.match(sql, /INSERT\s+INTO\s+storage\.buckets/i);
  assert.match(sql, /'tts-audio-cache'/);
  assert.match(sql, /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.tts_audio_cache_registry/i);
  assert.match(sql, /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.increment_tts_cache_hit/i);
});

test('Phase 32 Test 4: api/audio/tts.js validates Hanzi, length <= 600, and falls back safely without API keys', async () => {
  // 1) Missing Chinese characters -> 400
  {
    const { req, res } = createMockHttp({
      headers: { 'x-user-id': 'phase32-tester' },
      body: { text: 'Hello world only' },
    });
    await ttsHandler(req, res);
    assert.equal(res.statusCode, 400);
  }

  // 2) Exceeds 600 chars -> 400
  {
    const { req, res } = createMockHttp({
      headers: { 'x-user-id': 'phase32-tester' },
      body: { text: '汉'.repeat(601) },
    });
    await ttsHandler(req, res);
    assert.equal(res.statusCode, 400);
  }

  // 3) Missing TTS provider API keys -> 200 client_fallback_required
  const prevAzure = process.env.AZURE_SPEECH_KEY;
  const prevOpenAi = process.env.OPENAI_API_KEY;
  const prevEdge = process.env.EDGE_TTS_ENDPOINT;
  delete process.env.AZURE_SPEECH_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.EDGE_TTS_ENDPOINT;

  try {
    const { req, res } = createMockHttp({
      headers: { 'x-user-id': 'phase32-tester' },
      body: { text: '学习汉语', voice: 'female_standard', rate: 0.9 },
    });
    await ttsHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.status, 'client_fallback_required');
    assert.equal(res.data.fallbackToWebSpeech, true);
  } finally {
    if (prevAzure) process.env.AZURE_SPEECH_KEY = prevAzure;
    if (prevOpenAi) process.env.OPENAI_API_KEY = prevOpenAi;
    if (prevEdge) process.env.EDGE_TTS_ENDPOINT = prevEdge;
  }
});

test('Phase 32 Test 5: prewarmHskAudioCache parses CLI args and bounds concurrency', async () => {
  const parsed = parsePrewarmArgs(['--level=1', '--limit=200', '--concurrency=3', '--dry-run']);
  assert.equal(parsed.level, 1);
  assert.equal(parsed.limit, 200);
  assert.equal(parsed.concurrency, 3);
  assert.equal(parsed.dryRun, true);

  let active = 0;
  let maxObserved = 0;
  const items = [1, 2, 3, 4, 5, 6, 7];

  const out = await processWithConcurrency(
    items,
    3,
    async (item) => {
      active += 1;
      maxObserved = Math.max(maxObserved, active);
      await new Promise((r) => setTimeout(r, 10));
      active -= 1;
      return item * 2;
    },
    0
  );

  assert.ok(maxObserved <= 3);
  assert.deepEqual(out, [2, 4, 6, 8, 10, 12, 14]);
});

