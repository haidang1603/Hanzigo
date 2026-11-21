import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  exportUserLearningSnapshot,
  getScopedSyncQueueKey,
  getScopedFailedSyncKey,
  getFailedSyncItems,
  MAX_SYNC_RETRIES,
} from '../src/core/sync/OfflineSyncManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readRel(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function createMockStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
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
      store.set(k, String(v));
    },
    removeItem(k) {
      store.delete(k);
    },
  };
}

test('Task 39.07 (1): exportUserLearningSnapshot scopes data by userId and skips essential auth keys', async () => {
  const prevWindow = globalThis.window;
  try {
    const mockStorage = createMockStorage({
      hanzigo_user: JSON.stringify({ id: 'user-a' }),
      'hanzigo_completed_lessons_user-a': JSON.stringify(['lesson-1', 'lesson-2']),
      'hanzigo_completed_lessons_user-b': JSON.stringify(['lesson-99']),
      'hanzigo_sync_queue_v1_user-a': JSON.stringify([{ id: 'q1', type: 'vocab' }]),
    });
    globalThis.window = { localStorage: mockStorage };

    const mockSupabase = {
      auth: {
        async getUser() {
          return { data: { user: { id: 'user-a', email: 'a@hanzigo.test' } } };
        },
      },
      from(table) {
        return {
          select() {
            return {
              eq() {
                if (table === 'user_vocab_items') {
                  return Promise.resolve({ data: [{ simplified: '你好', user_id: 'user-a' }] });
                }
                return Promise.resolve({ data: [{ id: 'att-1', user_id: 'user-a' }] });
              },
            };
          },
        };
      },
    };

    const snapshot = await exportUserLearningSnapshot(mockSupabase, { id: 'user-a', email: 'a@hanzigo.test' });
    assert.equal(snapshot.user.id, 'user-a');
    assert.equal(snapshot.cloud_data.user_vocab_items.length, 1);
    assert.equal(snapshot.cloud_data.hsk_attempts.length, 1);
    assert.ok(snapshot.local_storage['hanzigo_completed_lessons_user-a']);
    assert.equal(snapshot.local_storage['hanzigo_completed_lessons_user-b'], undefined);
    assert.equal(snapshot.local_storage['hanzigo_user'], undefined);
  } finally {
    globalThis.window = prevWindow;
  }
});

test('Task 39.07 (2): GlobalErrorBoundary Exam Draft Rescue isolates drafts by userId and exports JSON payload', () => {
  const ebSrc = readRel('src/components/common/GlobalErrorBoundary.jsx');
  assert.match(ebSrc, /export function collectExamRescueSnapshot\(/);
  assert.match(ebSrc, /key\.startsWith\(HSK_DRAFT_PREFIX\) && key\.endsWith\(userSuffix\)/);
  assert.match(ebSrc, /export function buildRescueDownloadPayload\(/);
  assert.match(ebSrc, /hanzigo-exam-rescue-/);
});

test('Task 39.07 (3): OfflineSyncManager scopes sync & failed quarantine keys per user', () => {
  assert.equal(MAX_SYNC_RETRIES, 5);
  assert.equal(getScopedSyncQueueKey({ id: 'u123' }), 'hanzigo_sync_queue_v1_u123');
  assert.equal(getScopedFailedSyncKey({ id: 'u123' }), 'hanzigo_sync_failed_v1_u123');

  const prevWindow = globalThis.window;
  try {
    const mockStorage = createMockStorage({
      hanzigo_sync_failed_v1_u123: JSON.stringify([{ id: 'err-1', error: 'timeout' }]),
    });
    globalThis.window = { localStorage: mockStorage };
    const failed = getFailedSyncItems({ id: 'u123' });
    assert.equal(failed.length, 1);
    assert.equal(failed[0].id, 'err-1');
  } finally {
    globalThis.window = prevWindow;
  }
});

test('Task 39.07 (4): Phase 38 migrations are idempotent and provide manual ROLLBACK GUIDE', () => {
  const m3804 = readRel('supabase/migrations/20261119_3804_learning_progress_integrity.sql');
  assert.match(m3804, /ADD COLUMN IF NOT EXISTS lapse_count/);
  assert.match(m3804, /CREATE OR REPLACE VIEW/);
  assert.match(m3804, /CREATE OR REPLACE FUNCTION/);
  assert.match(m3804, /ROLLBACK GUIDE/);

  const m3806 = readRel('supabase/migrations/20261119_3806_security_hardening.sql');
  assert.match(m3806, /CREATE OR REPLACE FUNCTION/);
  assert.match(m3806, /ROLLBACK GUIDE/);
});

test('Task 39.07 (5): progressService protects against words_learned=0 overwrite and uses Set union', () => {
  const progressSrc = readRel('src/services/progressService.js');
  assert.match(progressSrc, /Math\.max\(rememberedWords\.length,\s*existingWordsCount\)/);
  assert.match(progressSrc, /new Set\(\[\.\.\.localIds,\s*\.\.\.cloudIds\]\)/);
});
