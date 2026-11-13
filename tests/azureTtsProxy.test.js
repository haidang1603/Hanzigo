import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { 
  escapeSsml, 
  computeTtsCacheKey, 
  buildSsml,
  buildTtsStoragePath,
  resolveTtsVoice,
  normalizeTtsRate,
  ALLOWED_VOICES,
  DEFAULT_VOICE,
  DEFAULT_RATE
} from '../api/audio/tts.js';
import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

// Mock request / response helper
function createMockHttp(options = {}) {
  const req = {
    method: options.method || 'POST',
    headers: options.headers || {},
    query: options.query || {},
    body: options.body || {}
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
    }
  };

  return { req, res };
}

test('TTS Proxy Security: escapeSsml sanitizes special XML characters to prevent SSML injection', () => {
  const attackPayload = '</voice><speak>Hello & World "Quote" \'Apos\'</speak>';
  const escaped = escapeSsml(attackPayload);

  assert.ok(!escaped.includes('<speak>'));
  assert.ok(!escaped.includes('</voice>'));
  assert.ok(escaped.includes('&lt;/voice&gt;'));
  assert.ok(escaped.includes('&lt;speak&gt;'));
  assert.ok(escaped.includes('&amp;'));
  assert.ok(escaped.includes('&quot;'));
  assert.ok(escaped.includes('&apos;'));
});

test('TTS Proxy Security: computeTtsCacheKey generates deterministic SHA-256 hash', () => {
  const key1 = computeTtsCacheKey('zh-CN-XiaoxiaoNeural', 0.85, '你好世界');
  const key2 = computeTtsCacheKey('zh-CN-XiaoxiaoNeural', 0.85, '你好世界');
  const keyDifferentText = computeTtsCacheKey('zh-CN-XiaoxiaoNeural', 0.85, '再见世界');
  const keyDifferentRate = computeTtsCacheKey('zh-CN-XiaoxiaoNeural', 1.00, '你好世界');

  assert.equal(typeof key1, 'string');
  assert.equal(key1.length, 64); // SHA-256 hex string is 64 chars
  assert.equal(key1, key2); // Deterministic
  assert.notEqual(key1, keyDifferentText);
  assert.notEqual(key1, keyDifferentRate);
});

test('TTS Proxy: buildSsml constructs valid Microsoft Cognitive Services SSML', () => {
  const ssml = buildSsml('zh-CN-XiaoxiaoNeural', 0.85, '学习汉语');
  assert.ok(ssml.startsWith("<speak version='1.0' xml:lang='zh-CN'>"));
  assert.ok(ssml.includes("name='zh-CN-XiaoxiaoNeural'"));
  assert.ok(ssml.includes("prosody rate='-15%'"));
  assert.ok(ssml.includes('学习汉语'));
  assert.ok(ssml.endsWith('</voice></speak>'));
});

test('TTS Proxy Auth: Rejects unauthenticated requests with 401 Unauthorized', async () => {
  const { req, res } = createMockHttp({
    method: 'POST',
    headers: {},
    body: { text: '你好' }
  });

  await handler(req, res);
  assert.equal(res.statusCode, 401);
  assert.ok(res.data.error.includes('Unauthorized'));
});

test('TTS Proxy Input Validation: Rejects empty text with 400 Bad Request', async () => {
  const { req, res } = createMockHttp({
    method: 'POST',
    headers: { 'x-user-id': 'test-user-id' }, // local test bypass
    body: { text: '' }
  });

  await handler(req, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.data.error.includes('không được để trống'));
});

test('TTS Proxy Input Validation: Rejects text > 600 characters with 400 Bad Request', async () => {
  const longText = '你好'.repeat(305); // 610 chars
  const { req, res } = createMockHttp({
    method: 'POST',
    headers: { 'x-user-id': 'test-user-id' },
    body: { text: longText }
  });

  await handler(req, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.data.error.includes('vượt quá giới hạn tối đa'));
});

test('TTS Proxy Input Validation: Rejects non-Chinese strings with 400 Bad Request', async () => {
  const { req, res } = createMockHttp({
    method: 'POST',
    headers: { 'x-user-id': 'test-user-id' },
    body: { text: 'Hello, this is English text only!' }
  });

  await handler(req, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.data.error.includes('chứa ít nhất một ký tự chữ Hán'));
});

test('TTS Proxy Graceful Fallback: Returns client_fallback_required when TTS providers are unconfigured', async () => {
  const oldAzureKey = process.env.AZURE_SPEECH_KEY;
  const oldOpenAiKey = process.env.OPENAI_API_KEY;
  const oldEdgeEndpoint = process.env.EDGE_TTS_ENDPOINT;
  delete process.env.AZURE_SPEECH_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.EDGE_TTS_ENDPOINT;

  try {
    const { req, res } = createMockHttp({
      method: 'POST',
      headers: { 'x-user-id': 'test-user-id' },
      body: { text: '早上好', voice: 'female_standard', rate: 0.9 }
    });

    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.status, 'client_fallback_required');
    assert.equal(res.data.fallbackToWebSpeech, true);
    assert.equal(res.data.reason, 'tts_provider_unconfigured');
    assert.ok(res.data.cacheKey);
  } finally {
    if (oldAzureKey) process.env.AZURE_SPEECH_KEY = oldAzureKey;
    if (oldOpenAiKey) process.env.OPENAI_API_KEY = oldOpenAiKey;
    if (oldEdgeEndpoint) process.env.EDGE_TTS_ENDPOINT = oldEdgeEndpoint;
  }
});

test('TTS Proxy Canonicalization & Cache Hit: Resolves aliases, shards path, and returns CDN hit', async () => {
  assert.equal(resolveTtsVoice('female_standard'), 'zh-CN-XiaoxiaoNeural');
  assert.equal(resolveTtsVoice('male_standard'), 'zh-CN-YunxiNeural');
  assert.equal(resolveTtsVoice('female_news'), 'zh-CN-XiaoyiNeural');
  assert.equal(normalizeTtsRate(0.88), 0.90);
  assert.equal(normalizeTtsRate(1.2), 1.25);

  const key = computeTtsCacheKey('male_standard', 1.0, '  你好   世界  ');
  const storagePath = buildTtsStoragePath('male_standard', 1.0, key);
  assert.equal(storagePath, `zh-CN-YunxiNeural/1.00/${key.slice(0, 2)}/${key}.mp3`);

  const rpcCalls = [];
  setSupabaseAdminClientForTesting({
    from(table) {
      assert.equal(table, 'tts_audio_cache_registry');
      return {
        select() {
          return {
            eq() {
              return {
                async maybeSingle() {
                  return {
                    data: {
                      public_url: `https://cdn.example.com/${storagePath}`,
                      provider: 'azure_neural',
                    },
                    error: null,
                  };
                },
              };
            },
          };
        },
      };
    },
    async rpc(fnName, params) {
      rpcCalls.push({ fnName, params });
      return { data: 2, error: null };
    },
  });

  try {
    const { req, res } = createMockHttp({
      method: 'POST',
      headers: { 'x-user-id': 'test-user-id' },
      body: { text: '你好 世界', voice: 'male_standard', rate: 1.0 }
    });

    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.status, 'hit');
    assert.equal(res.data.cached, true);
    assert.equal(res.data.audioUrl, `https://cdn.example.com/${storagePath}`);
    assert.equal(res.headers['Cache-Control'], 'public, max-age=31536000, immutable');
    assert.equal(rpcCalls.length, 1);
    assert.equal(rpcCalls[0].fnName, 'increment_tts_cache_hit');
    assert.equal(rpcCalls[0].params.p_cache_key, key);
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});
