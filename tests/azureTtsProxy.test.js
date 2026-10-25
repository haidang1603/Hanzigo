import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { 
  escapeSsml, 
  computeTtsCacheKey, 
  buildSsml,
  ALLOWED_VOICES,
  DEFAULT_VOICE,
  DEFAULT_RATE
} from '../api/audio/tts.js';

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

test('TTS Proxy Input Validation: Rejects text > 150 characters with 400 Bad Request', async () => {
  const longText = '你好'.repeat(80); // 160 chars
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

test('TTS Proxy Graceful Fallback: Returns fallbackToWebSpeech when AZURE_SPEECH_KEY is missing', async () => {
  const oldKey = process.env.AZURE_SPEECH_KEY;
  delete process.env.AZURE_SPEECH_KEY;

  try {
    const { req, res } = createMockHttp({
      method: 'POST',
      headers: { 'x-user-id': 'test-user-id' },
      body: { text: '早上好' }
    });

    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.fallbackToWebSpeech, true);
    assert.ok(res.data.reason.includes('chưa cấu hình AZURE_SPEECH_KEY'));
    assert.ok(res.data.cacheKey);
  } finally {
    if (oldKey) process.env.AZURE_SPEECH_KEY = oldKey;
  }
});
