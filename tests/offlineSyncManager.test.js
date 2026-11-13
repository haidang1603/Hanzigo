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

function setupMockWindow() {
  const events = [];
  const localStorage = createMemoryStorage();
  const sessionStorage = createMemoryStorage();

  globalThis.window = {
    localStorage,
    sessionStorage,
    dispatchEvent(evt) {
      events.push(evt);
      return true;
    },
  };
  if (typeof globalThis.CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
      }
    };
  }
  return { localStorage, sessionStorage, events };
}

test('OfflineSyncManager: defaults, essential lock, and key classification', async () => {
  const { localStorage } = setupMockWindow();
  const mod = await import('../src/core/sync/OfflineSyncManager.js');

  const defaults = mod.getStoragePreferences();
  assert.equal(defaults.essential, true);
  assert.equal(defaults.functional, true);
  assert.equal(defaults.local_learning, true);
  assert.equal(defaults.analytics, false);
  assert.equal(defaults.consent_given_at, null);

  // Essential must remain locked to true even if false is passed
  const saved = mod.saveStoragePreferences({
    essential: false,
    functional: false,
    analytics: true,
  });
  assert.equal(saved.essential, true);
  assert.equal(saved.functional, false);
  assert.equal(saved.analytics, true);
  assert.ok(saved.consent_given_at);

  // Key classification
  assert.equal(mod.classifyStorageKey('sb-project-auth-token'), 'essential');
  assert.equal(mod.classifyStorageKey(mod.STORAGE_PREFS_KEY), 'essential');
  assert.equal(mod.classifyStorageKey('ui_theme_mode'), 'functional');
  assert.equal(mod.classifyStorageKey('audio_speed'), 'functional');
  assert.equal(mod.classifyStorageKey('hsk_exam_draft_4'), 'local_learning');
  assert.equal(mod.classifyStorageKey(mod.SYNC_QUEUE_KEY), 'local_learning');

  localStorage.setItem('sb-demo-auth', '{"token":"abc"}');
  localStorage.setItem('ui_theme', 'dark');
  localStorage.setItem('hsk_exam_draft_1', '{"q":1}');

  const summary = await mod.inspectBrowserStorage();
  assert.ok(summary.categories.essential.keyCount >= 2);
  assert.equal(summary.categories.functional.keyCount, 1);
  assert.equal(summary.categories.local_learning.keyCount, 1);
});

test('OfflineSyncManager: enqueue, flush to Supabase, safe clear, and export snapshot', async () => {
  const { localStorage, events } = setupMockWindow();
  const mod = await import('../src/core/sync/OfflineSyncManager.js');

  localStorage.setItem('sb-demo-auth', '{"token":"keep-me"}');
  localStorage.setItem('ui_font_size', '18');
  localStorage.setItem('hsk_exam_draft_3', '{"ans":[1,2]}');

  const queued = mod.enqueueOfflineMutation({
    type: 'vocab_save',
    table: 'user_vocab_items',
    action: 'upsert',
    payload: { hanzi: '学习', pinyin: 'xuexi' },
  });
  assert.ok(queued);
  assert.equal(mod.getPendingSyncItems().length, 1);

  // Essential cannot be cleared
  const essentialRes = mod.clearStorageByCategory('essential');
  assert.equal(essentialRes.cleared, false);
  assert.equal(essentialRes.blocked, true);
  assert.ok(localStorage.getItem('sb-demo-auth'));

  // local_learning requires confirmation when pending items or exam drafts exist
  const blockedLocal = mod.clearStorageByCategory('local_learning');
  assert.equal(blockedLocal.cleared, false);
  assert.equal(blockedLocal.requiresConfirmation, true);
  assert.equal(blockedLocal.pendingCount, 1);
  assert.equal(blockedLocal.hasExamDrafts, true);

  // Flush to mock Supabase
  const upserted = [];
  const mockSupabase = {
    auth: {
      async getUser() {
        return { data: { user: { id: 'user-123', email: 'test@hanzigo.vn' } } };
      },
    },
    from(table) {
      return {
        async upsert(payload) {
          upserted.push({ table, payload });
          return { error: null };
        },
        async insert(payload) {
          upserted.push({ table, payload });
          return { error: null };
        },
        select() {
          return {
            async eq() {
              return { data: [{ id: 1 }], error: null };
            },
          };
        },
      };
    },
  };

  const flushRes = await mod.flushOfflineQueueToSupabase(mockSupabase);
  assert.equal(flushRes.syncedCount, 1);
  assert.equal(flushRes.failedCount, 0);
  assert.equal(mod.getPendingSyncItems().length, 0);
  assert.equal(upserted[0].table, 'user_vocab_items');
  assert.equal(upserted[0].payload.hanzi, '学习');
  assert.ok(events.some((e) => e.type === 'hanzigo:sync-updated'));

  // Snapshot export
  const snapshot = await mod.exportUserLearningSnapshot(mockSupabase);
  assert.equal(snapshot.app, 'HanziGo');
  assert.equal(snapshot.user.id, 'user-123');
  assert.ok(snapshot.local_storage.hsk_exam_draft_3);
  assert.ok(snapshot.cloud_data.user_vocab_items.length === 1);

  // Force clear local_learning succeeds and leaves essential intact
  const forcedClear = mod.clearStorageByCategory('local_learning', { force: true });
  assert.equal(forcedClear.cleared, true);
  assert.equal(localStorage.getItem('hsk_exam_draft_3'), null);
  assert.ok(localStorage.getItem('sb-demo-auth'));
});
