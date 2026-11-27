import test from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeXmlSsml,
  parseDialogueTurns,
  buildAzureSsml,
  computeCdnAudioHash,
  buildCdnAudioStoragePath,
  resolveVoiceProfile,
  MAX_TTS_TEXT_LENGTH,
} from '../api/_utils/azureTtsSsml.js';
import handler from '../api/audio/tts.js';
import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

function createMockHttp({ method = 'POST', headers = {}, query = {}, body = {}, fetchImpl = null } = {}) {
  const req = {
    method,
    headers,
    query,
    body,
    _fetchImpl: fetchImpl,
  };
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
    redirect(code, url) {
      this.statusCode = code;
      this.headers.Location = url;
      return this;
    },
    end() {
      return this;
    },
  };
  return { req, res };
}

test('Scenario 1: SSML Injection Guard escapes all XML meta characters safely', () => {
  const malicious = '</voice><break time="10s"/> & <script>alert(1)</script> "quote" \'apos\'';
  const escaped = escapeXmlSsml(malicious);
  assert.equal(escaped.includes('</voice>'), false);
  assert.equal(escaped.includes('<break'), false);
  assert.equal(escaped.includes('<script>'), false);
  assert.equal(escaped.includes('&amp;'), true);
  assert.equal(escaped.includes('&lt;/voice&gt;'), true);

  const ssml = buildAzureSsml(`你好 ${malicious}`, 'female');
  assert.equal((ssml.match(/<voice\b/g) || []).length, 1);
  assert.equal((ssml.match(/<\/voice>/g) || []).length, 1);
  assert.equal(ssml.includes('<break'), false);
});

test('Scenario 2: Multi-Voice Dialogue Parser splits Male/Female turns with 350ms break', () => {
  const dialogue = '男：你好！请问去火车站怎么走？\n女：你好，请问你要坐地铁还是出租车？';
  const turns = parseDialogueTurns(dialogue);
  assert.equal(turns.length, 2);
  assert.equal(turns[0].voiceId, 'zh-CN-YunxiNeural');
  assert.equal(turns[1].voiceId, 'zh-CN-XiaoxiaoNeural');

  const ssml = buildAzureSsml(dialogue, 'auto');
  assert.equal(resolveVoiceProfile('auto', dialogue), 'dialogue');
  assert.ok(ssml.includes("name='zh-CN-YunxiNeural'"));
  assert.ok(ssml.includes("name='zh-CN-XiaoxiaoNeural'"));
  assert.ok(ssml.includes("<break time='350ms'/>"));
});

test('Scenario 3: Deterministic Content Hash generates rate-independent CDN Storage path', () => {
  const text = '  今天天气   真好！  ';
  const h1 = computeCdnAudioHash('female', text);
  const h2 = computeCdnAudioHash('female_standard', '今天天气 真好！');
  const hMale = computeCdnAudioHash('male', text);
  const hDiff = computeCdnAudioHash('female', '明天天气也很好！');

  assert.equal(h1.length, 32);
  assert.equal(h1, h2);
  assert.notEqual(h1, hMale);
  assert.notEqual(h1, hDiff);

  const p1 = buildCdnAudioStoragePath('female', h1);
  assert.equal(p1, `v1/female/${h1.slice(0, 2)}/${h1}.mp3`);
  // Path never depends on playback speed
  assert.equal(p1.includes('0.75'), false);
  assert.equal(p1.includes('1.25'), false);
});

test('Scenario 4: CDN Cache-Hit Short-Circuit skips Azure fetch completely (0 calls)', async () => {
  let azureFetchCalls = 0;
  const text = '我们一起去图书馆看书吧';
  const hash = computeCdnAudioHash('female', text);
  const fileName = `${hash}.mp3`;
  const expectedPath = buildCdnAudioStoragePath('female', hash);
  const oldKey = process.env.AZURE_SPEECH_KEY;
  process.env.AZURE_SPEECH_KEY = 'dummy-azure-key';

  setSupabaseAdminClientForTesting({
    storage: {
      from(bucket) {
        assert.equal(bucket, 'hsk-audio');
        return {
          async list() {
            return { data: [{ name: fileName }], error: null };
          },
          getPublicUrl(path) {
            return { data: { publicUrl: `https://cdn.example.supabase.co/storage/v1/object/public/hsk-audio/${path}` } };
          },
        };
      },
    },
  });

  try {
    const { req, res } = createMockHttp({
      method: 'POST',
      headers: { 'x-user-id': 'test-user-id', accept: 'application/json' },
      query: { format: 'url' },
      body: { text, voice: 'female' },
      fetchImpl: async () => {
        azureFetchCalls += 1;
        throw new Error('Azure must NOT be called on CDN cache hit');
      },
    });

    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['X-TTS-Cache'], 'HIT');
    assert.equal(res.data.cached, true);
    assert.equal(res.data.hash, hash);
    assert.ok(res.data.url.endsWith(expectedPath));
    assert.equal(azureFetchCalls, 0);
  } finally {
    setSupabaseAdminClientForTesting(null);
    if (oldKey !== undefined) process.env.AZURE_SPEECH_KEY = oldKey;
    else delete process.env.AZURE_SPEECH_KEY;
  }
});

test('Scenario 5: Length (> 1200 chars), Empty Text (400) & Auth Guard (401)', async () => {
  const unauth = createMockHttp({ method: 'POST', headers: {}, body: { text: '你好' } });
  await handler(unauth.req, unauth.res);
  assert.equal(unauth.res.statusCode, 401);

  const empty = createMockHttp({ method: 'POST', headers: { 'x-user-id': 'u-1' }, body: { text: '   ' } });
  await handler(empty.req, empty.res);
  assert.equal(empty.res.statusCode, 400);

  const overMax = createMockHttp({
    method: 'POST',
    headers: { 'x-user-id': 'u-1' },
    body: { text: '汉'.repeat(MAX_TTS_TEXT_LENGTH + 1) },
  });
  await handler(overMax.req, overMax.res);
  assert.equal(overMax.res.statusCode, 400);
});

test('Scenario 6: Client playbackRate (0.75/1.0/1.25) with preservesPitch=true & Web Speech fallback on 503', async () => {
  const createdAudio = [];
  const speechCalls = [];

  class MockAudio {
    constructor() {
      this.src = '';
      this.currentTime = 0;
      this.playbackRate = 1.0;
      this.preservesPitch = false;
      this.webkitPreservesPitch = false;
      this.onended = null;
      this.onerror = null;
      createdAudio.push(this);
    }
    pause() {}
    async play() {
      if (this.onended) this.onended();
    }
  }

  globalThis.window = {
    Audio: MockAudio,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
    speechSynthesis: {
      cancel: () => speechCalls.push('cancel'),
      speak: (u) => {
        speechCalls.push(`speak:${u.text}:${u.rate}`);
        u.onend?.();
      },
      getVoices: () => [{ lang: 'zh-CN', name: 'Mandarin' }],
    },
    SpeechSynthesisUtterance: class {
      constructor(text) {
        this.text = text;
        this.lang = '';
        this.rate = 1.0;
      }
    },
  };
  globalThis.Audio = MockAudio;
  globalThis.speechSynthesis = globalThis.window.speechSynthesis;
  globalThis.SpeechSynthesisUtterance = globalThis.window.SpeechSynthesisUtterance;

  const ttsMod = await import('../src/services/ttsAudioService.js');
  ttsMod.resetAudioEngineForTesting();

  const cdnFetch = async () => ({
    ok: true,
    headers: { get: () => 'application/json' },
    async json() {
      return {
        status: 'hit',
        url: 'https://cdn.example.supabase.co/storage/v1/object/public/hsk-audio/v1/female/aa/aabbcc.mp3',
      };
    },
  });

  const modes = [];
  for (const rate of [0.75, 1.0, 1.25]) {
    const res = await ttsMod.playChineseTts('你好朋友', {
      rate,
      voice: 'female',
      fetchImpl: cdnFetch,
      onPlaybackMode: (m) => modes.push(m),
    });
    assert.equal(res.ok, true);
    const activeEl = createdAudio[createdAudio.length - 1];
    assert.equal(activeEl.playbackRate, rate);
    assert.equal(activeEl.preservesPitch, true);
    assert.equal(activeEl.webkitPreservesPitch, true);
  }
  assert.ok(modes.every((m) => m === 'cdn'));

  // Dynamic mid-sentence update
  ttsMod.setActiveAudioPlaybackRate(0.75);
  assert.equal(createdAudio[createdAudio.length - 1].playbackRate, 0.75);
  assert.equal(createdAudio[createdAudio.length - 1].preservesPitch, true);

  // Fallback to Web Speech on 503
  let fallbackMode = null;
  const errFetch = async () => ({
    ok: false,
    status: 503,
    headers: { get: () => 'application/json' },
    async json() {
      return { code: 'TTS_UPSTREAM_UNAVAILABLE' };
    },
  });

  const fallbackRes = await ttsMod.playChineseTts('再见老师', {
    rate: 0.75,
    fetchImpl: errFetch,
    onPlaybackMode: (m) => {
      fallbackMode = m;
    },
  });
  assert.equal(fallbackRes.ok, true);
  assert.equal(fallbackRes.mode, 'web_speech');
  assert.equal(fallbackMode, 'device');
  assert.ok(speechCalls.some((c) => c.startsWith('speak:再见老师:0.75')));
});
