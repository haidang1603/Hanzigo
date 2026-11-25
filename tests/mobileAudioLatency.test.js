import test from 'node:test';
import assert from 'node:assert/strict';

function createAudioMocks({
  enableAudioContext = true,
  enableCaches = true,
  rejectCaches = false,
} = {}) {
  const resumeCalls = [];
  const silentBufferCalls = [];
  const decodeCalls = [];
  const startedSources = [];
  const audioElements = [];
  const speechEvents = [];
  const cacheStore = new Map();

  const storageData = new Map();
  const localStorage = {
    getItem: (k) => (storageData.has(k) ? storageData.get(k) : null),
    setItem: (k, v) => storageData.set(k, String(v)),
    removeItem: (k) => storageData.delete(k),
    clear: () => storageData.clear(),
  };

  class MockAudio {
    constructor() {
      this.src = '';
      this.preload = '';
      this.currentTime = 0;
      this.onended = null;
      this.onerror = null;
      this.playCalls = 0;
      audioElements.push(this);
    }
    pause() {}
    async play() {
      this.playCalls += 1;
      if (this.onended) this.onended();
    }
  }

  class MockAudioContext {
    constructor() {
      this.state = 'suspended';
      this.destination = { id: 'mock-dest' };
    }
    resume() {
      resumeCalls.push(Date.now());
      this.state = 'running';
      return Promise.resolve();
    }
    createBuffer(channels, length, sampleRate) {
      return { channels, length, sampleRate, isSilentUnlock: length === 1 };
    }
    createBufferSource() {
      const source = {
        buffer: null,
        onended: null,
        connected: false,
        stopped: false,
        connect() {
          this.connected = true;
        },
        disconnect() {},
        stop() {
          this.stopped = true;
        },
        start() {
          if (source.buffer?.isSilentUnlock) {
            silentBufferCalls.push(source.buffer);
            return;
          }
          startedSources.push(source);
          if (typeof source.onended === 'function') {
            source.onended();
          }
        },
      };
      return source;
    }
    async decodeAudioData(arrayBuffer) {
      decodeCalls.push(arrayBuffer.byteLength);
      return { duration: 0.4, byteLength: arrayBuffer.byteLength };
    }
  }

  class MockSpeechSynthesisUtterance {
    constructor(text) {
      this.text = text;
      this.lang = '';
      this.rate = 1;
      this.voice = null;
      this.onstart = null;
      this.onend = null;
      this.onerror = null;
    }
  }

  const speechSynthesis = {
    getVoices() {
      return [{ name: 'Xiaoxiao', lang: 'zh-CN' }];
    },
    cancel() {
      speechEvents.push('cancel');
    },
    speak(utterance) {
      speechEvents.push(`speak:${utterance.text}`);
      if (utterance.onstart) utterance.onstart();
      if (utterance.onend) utterance.onend();
    },
  };

  const mockCaches = enableCaches
    ? {
        async open(name) {
          if (rejectCaches) {
            throw new DOMException('SecurityError: Cache blocked in Private Mode', 'SecurityError');
          }
          return {
            async match(key) {
              return cacheStore.get(`${name}::${key}`) || undefined;
            },
            async put(key, resp) {
              cacheStore.set(`${name}::${key}`, resp);
            },
          };
        },
      }
    : undefined;

  globalThis.window = {
    localStorage,
    Audio: MockAudio,
    AudioContext: enableAudioContext ? MockAudioContext : undefined,
    webkitAudioContext: enableAudioContext ? MockAudioContext : undefined,
    speechSynthesis,
    SpeechSynthesisUtterance: MockSpeechSynthesisUtterance,
  };
  globalThis.Audio = MockAudio;
  globalThis.AudioContext = enableAudioContext ? MockAudioContext : undefined;
  globalThis.speechSynthesis = speechSynthesis;
  globalThis.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  globalThis.caches = mockCaches;

  Object.defineProperty(globalThis, 'navigator', {
    value: { onLine: true },
    configurable: true,
    writable: true,
  });

  return {
    resumeCalls,
    silentBufferCalls,
    decodeCalls,
    startedSources,
    audioElements,
    speechEvents,
    cacheStore,
  };
}

function makeBase64Mp3Payload(byteLen = 16) {
  const bytes = new Uint8Array(byteLen);
  for (let i = 0; i < byteLen; i += 1) bytes[i] = (i + 65) % 255;
  const b64 = Buffer.from(bytes).toString('base64');
  return {
    status: 'hit',
    audioBase64: b64,
    contentType: 'audio/mpeg',
    cacheKey: `key-${byteLen}`,
    provider: 'azure_neural',
  };
}

test('1. unlockMobileAudio() calls audioContext.resume() synchronously BEFORE fetch resolves and decodes via Web Audio', async () => {
  const mocks = createAudioMocks({ enableAudioContext: true, enableCaches: true });
  const mod = await import('../src/services/ttsAudioService.js');
  mod.resetAudioEngineForTesting();

  let resolveFetch;
  const pendingFetch = () =>
    new Promise((resolve) => {
      resolveFetch = resolve;
    });

  const playPromise = mod.playChineseTts('你好', { rate: 1.0, fetchImpl: pendingFetch });

  // Assert resume() and 1-sample silent unlock fired synchronously BEFORE fetch resolved!
  assert.equal(mocks.resumeCalls.length, 1, 'audioContext.resume() must be called synchronously');
  assert.equal(mocks.silentBufferCalls.length, 1, '1-sample silent buffer must unlock iOS audio session');

  // Allow microtasks (readL2Cache / getAuthHeaders) to reach pendingFetch
  while (typeof resolveFetch !== 'function') {
    await new Promise((r) => setTimeout(r, 5));
  }

  resolveFetch({
    ok: true,
    async json() {
      return makeBase64Mp3Payload(32);
    },
  });

  const result = await playPromise;
  assert.equal(result.ok, true);
  assert.equal(mocks.decodeCalls.length, 1, 'Must decode AudioBuffer via Web Audio API');
  assert.equal(mocks.startedSources.length, 1, 'Must play decoded buffer via AudioBufferSourceNode');
});

test('2. L1 LRU Cache hits on replay (0 extra fetch) and evicts least-recently-used entry beyond 50 items', async () => {
  const mocks = createAudioMocks({ enableAudioContext: true, enableCaches: false });
  const mod = await import('../src/services/ttsAudioService.js');
  mod.resetAudioEngineForTesting();

  let fetchCalls = 0;
  const mockFetch = async () => {
    fetchCalls += 1;
    return {
      ok: true,
      async json() {
        return makeBase64Mp3Payload(24);
      },
    };
  };

  // Fill 50 unique entries: 词0 .. 词49
  for (let i = 0; i < 50; i += 1) {
    const res = await mod.playChineseTts(`汉字${i}`, { rate: 1.0, fetchImpl: mockFetch });
    assert.equal(res.ok, true);
  }
  assert.equal(fetchCalls, 50);
  assert.equal(mod.getTtsCacheStats().l1Size, 50);

  // Access entry 汉字0 so it becomes Most Recently Used (汉字1 becomes LRU)
  const replay0 = await mod.playChineseTts('汉字0', { rate: 1.0, fetchImpl: mockFetch });
  assert.equal(replay0.mode, 'memory_cache');
  assert.equal(fetchCalls, 50, 'Replaying cached entry must not call fetch');

  // Add 51st entry -> should evict 汉字1 (not 汉字0!)
  await mod.playChineseTts('汉字50', { rate: 1.0, fetchImpl: mockFetch });
  assert.equal(mod.getTtsCacheStats().l1Size, 50, 'L1 cache size must stay capped at 50');

  // 汉字0 must still be in L1 cache (0 new fetch)
  const verify0 = await mod.playChineseTts('汉字0', { rate: 1.0, fetchImpl: mockFetch });
  assert.equal(verify0.mode, 'memory_cache');
  assert.equal(fetchCalls, 51);

  // 汉字1 should have been evicted -> requires fetch
  const verify1 = await mod.playChineseTts('汉字1', { rate: 1.0, fetchImpl: mockFetch });
  assert.notEqual(verify1.mode, 'memory_cache');
  assert.equal(fetchCalls, 52);
  assert.equal(mocks.startedSources.length, 54);
});

test('3. In-Flight Deduplication: 2 concurrent calls for the same phrase trigger only 1 fetch', async () => {
  createAudioMocks({ enableAudioContext: true, enableCaches: false });
  const mod = await import('../src/services/ttsAudioService.js');
  mod.resetAudioEngineForTesting();

  let fetchCalls = 0;
  let releaseFetch;
  const controlledFetch = () => {
    fetchCalls += 1;
    return new Promise((resolve) => {
      releaseFetch = () =>
        resolve({
          ok: true,
          async json() {
            return makeBase64Mp3Payload(20);
          },
        });
    });
  };

  // Start two calls simultaneously while network fetch is still pending
  const p1 = mod.playChineseTts('早安', { rate: 0.9, fetchImpl: controlledFetch, _preserveSequence: true });
  const p2 = mod.playChineseTts('早安', { rate: 0.9, fetchImpl: controlledFetch, _preserveSequence: true });

  // Wait microtask tick so resolveTtsAsset reaches controlledFetch
  await new Promise((r) => setTimeout(r, 15));
  assert.equal(fetchCalls, 1, 'Concurrent identical requests must deduplicate to 1 fetch');

  releaseFetch();
  const [r1, r2] = await Promise.all([p1, p2]);
  assert.equal(r1.ok, true);
  assert.equal(r2.ok, true);
  assert.equal(fetchCalls, 1);
});

test('4. Prefetch respects concurrency <= 2, skips cached entries, and fails open without caches/AudioContext', async () => {
  createAudioMocks({ enableAudioContext: false, enableCaches: true, rejectCaches: true });
  const mod = await import('../src/services/ttsAudioService.js');
  mod.resetAudioEngineForTesting();

  // Seed 1 cached phrase first
  await mod.playChineseTts('谢谢', {
    rate: 0.9,
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return makeBase64Mp3Payload(12);
      },
    }),
  });

  let activeRequests = 0;
  let maxConcurrent = 0;
  const fetchedTexts = [];

  const mockFetch = async (_url, init) => {
    activeRequests += 1;
    maxConcurrent = Math.max(maxConcurrent, activeRequests);
    const body = JSON.parse(init.body);
    fetchedTexts.push(body.text);
    await new Promise((r) => setTimeout(r, 20));
    activeRequests -= 1;
    return {
      ok: true,
      async json() {
        return makeBase64Mp3Payload(16);
      },
    };
  };

  const summary = await mod.prefetchTtsItems(
    ['谢谢', '再见', '请进', '不客气', '对不起', '沒问题'],
    { concurrency: 2, rate: 0.9, fetchImpl: mockFetch }
  );

  assert.ok(maxConcurrent <= 2, `Prefetch concurrency (${maxConcurrent}) must be <= 2`);
  assert.equal(summary.skipped, 1, 'Cached phrase must be skipped');
  assert.equal(summary.prefetched, 5);
  assert.equal(summary.failed, 0);
  assert.ok(!fetchedTexts.includes('谢谢'));
});

test('5. Web Speech Fallback always invokes speechSynthesis.cancel() strictly before speak()', async () => {
  const mocks = createAudioMocks({ enableAudioContext: true, enableCaches: false });
  const mod = await import('../src/services/ttsAudioService.js');
  mod.resetAudioEngineForTesting();

  const mockFetchFallback = async () => ({
    ok: true,
    async json() {
      return {
        status: 'client_fallback_required',
        fallbackToWebSpeech: true,
        reason: 'tts_provider_unconfigured',
      };
    },
  });

  const res = await mod.playChineseTts('学习汉语', { rate: 1.0, fetchImpl: mockFetchFallback });
  assert.equal(res.ok, true);
  assert.equal(res.mode, 'web_speech');

  const speakIdx = mocks.speechEvents.indexOf('speak:学习汉语');
  const cancelBeforeSpeak = mocks.speechEvents.slice(0, speakIdx).includes('cancel');
  assert.ok(speakIdx >= 1, 'speak() must be called during fallback');
  assert.equal(cancelBeforeSpeak, true, 'speechSynthesis.cancel() must run before speak()');
});
