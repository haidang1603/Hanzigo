import test from 'node:test';
import assert from 'node:assert/strict';

function createMemoryStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    getItem(k) {
      return store.has(k) ? store.get(k) : null;
    },
    setItem(k, v) {
      store.set(String(k), String(v));
    },
    removeItem(k) {
      store.delete(String(k));
    },
    clear() {
      store.clear();
    },
  };
}

function setupBrowserAudioMocks() {
  const localStorage = createMemoryStorage();
  const sessionStorage = createMemoryStorage();
  const audioInstances = [];
  const spokenUtterances = [];

  class MockAudio {
    constructor() {
      this.src = '';
      this.currentTime = 0;
      this.preload = '';
      this.onended = null;
      this.onerror = null;
      audioInstances.push(this);
    }
    pause() {}
    async play() {
      if (this.onended) {
        queueMicrotask(() => this.onended?.());
      }
    }
  }

  class MockUtterance {
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

  globalThis.window = {
    localStorage,
    sessionStorage,
    Audio: MockAudio,
    SpeechSynthesisUtterance: MockUtterance,
    speechSynthesis: {
      cancel() {},
      getVoices() {
        return [{ lang: 'zh-CN', name: 'Mock Zh' }];
      },
      speak(utt) {
        spokenUtterances.push(utt);
        utt.onstart?.();
        queueMicrotask(() => utt.onend?.());
      },
    },
    dispatchEvent() {
      return true;
    },
  };

  Object.defineProperty(globalThis, 'navigator', {
    value: { onLine: true },
    configurable: true,
    writable: true,
  });

  return { localStorage, audioInstances, spokenUtterances };
}

test('ttsAudioService: 3-tier cache reuses shared HTMLAudioElement and hits memory cache on repeat', async () => {
  const { audioInstances } = setupBrowserAudioMocks();
  const mod = await import('../src/services/ttsAudioService.js');
  mod.clearTtsMemoryCache();

  let fetchCalls = 0;
  const mockFetch = async () => {
    fetchCalls += 1;
    return {
      ok: true,
      async json() {
        return {
          status: 'hit',
          audioUrl: 'https://cdn.example.com/tts/nihao.mp3',
          cacheKey: 'abc',
          provider: 'azure_neural',
        };
      },
    };
  };

  const first = await mod.playChineseTts('你好', { rate: 1.0, fetchImpl: mockFetch });
  assert.equal(first.ok, true);
  assert.equal(first.mode, 'cdn_cache_hit');
  assert.equal(fetchCalls, 1);

  const second = await mod.playChineseTts('你好', { rate: 1.0, fetchImpl: mockFetch });
  assert.equal(second.ok, true);
  assert.equal(second.mode, 'memory_cache');
  assert.equal(fetchCalls, 1);
  assert.equal(audioInstances.length, 1);
});

test('ttsAudioService: falls back to Web Speech API on client_fallback_required', async () => {
  const { spokenUtterances } = setupBrowserAudioMocks();
  const mod = await import('../src/services/ttsAudioService.js');
  mod.clearTtsMemoryCache();

  const mockFetch = async () => ({
    ok: true,
    async json() {
      return {
        status: 'client_fallback_required',
        fallbackToWebSpeech: true,
        reason: 'tts_provider_unconfigured',
      };
    },
  });

  const res = await mod.playChineseTts('谢谢', { rate: 0.9, fetchImpl: mockFetch });
  assert.equal(res.ok, true);
  assert.equal(res.mode, 'web_speech');
  assert.equal(spokenUtterances.length, 1);
  assert.equal(spokenUtterances[0].text, '谢谢');
  assert.equal(spokenUtterances[0].lang, 'zh-CN');
});

test('ttsAudioService: respects OfflineSyncManager functional preference and plays dialogue turns', async () => {
  const { localStorage } = setupBrowserAudioMocks();
  const syncMod = await import('../src/core/sync/OfflineSyncManager.js');
  const mod = await import('../src/services/ttsAudioService.js');
  mod.clearTtsMemoryCache();

  syncMod.saveStoragePreferences({ functional: true });
  localStorage.setItem('audio_speed', '0.75');
  localStorage.setItem('ui_tts_voice', 'male_standard');

  const enabledSettings = mod.getTtsFunctionalSettings();
  assert.equal(enabledSettings.rate, 0.75);
  assert.equal(enabledSettings.voice, 'male_standard');

  syncMod.saveStoragePreferences({ functional: false });
  const disabledSettings = mod.getTtsFunctionalSettings();
  assert.equal(disabledSettings.rate, 0.90);
  assert.equal(disabledSettings.voice, 'female_standard');

  const requestedVoices = [];
  const mockFetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    requestedVoices.push({ text: body.text, voice: body.voice });
    return {
      ok: true,
      async json() {
        return {
          status: 'hit',
          audioUrl: `https://cdn.example.com/${encodeURIComponent(body.text)}.mp3`,
        };
      },
    };
  };

  const seqRes = await mod.playDialogueSequence(
    [
      { speaker: '男', text: '请问，现在几点？' },
      { speaker: '女', text: '现在八点半。' },
    ],
    { fetchImpl: mockFetch }
  );

  assert.equal(seqRes.ok, true);
  assert.equal(seqRes.playedTurns, 2);
  assert.deepEqual(requestedVoices, [
    { text: '请问，现在几点？', voice: 'zh-CN-YunxiNeural' },
    { text: '现在八点半。', voice: 'zh-CN-XiaoxiaoNeural' },
  ]);
});

