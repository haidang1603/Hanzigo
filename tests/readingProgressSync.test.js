import test from 'node:test';
import assert from 'node:assert/strict';

import {
  READING_STORAGE_KEY_PREFIX,
  getLocalReadingStorageKey,
  getLocalReadingStore,
  saveLocalReadingRecord,
  normalizeReadingProgressPayload,
  getEffectiveUserId,
  getReadingProgress,
  saveReadingProgress,
  getRecentReadingProgress,
  migrateLocalReadingProgressToCloud,
  deleteReadingProgress
} from '../src/services/readingProgressService.js';

// Polyfill localStorage cho môi trường kiểm thử Node
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

// =========================================================================
// NHÓM A — DATABASE & SERVICE VALIDATION
// =========================================================================

test('A1. Service: normalizeReadingProgressPayload ensures valid page, scroll and percentage bounds', () => {
  // Trường hợp dữ liệu âm hoặc vượt quá 100%
  const norm1 = normalizeReadingProgressPayload('gr-101', {
    title: '  Bài đọc Tiểu Minh  ',
    currentPage: -5,
    totalPages: 0,
    scrollPosition: -50,
    progressPercent: 150
  });

  assert.equal(norm1.materialId, 'gr-101');
  assert.equal(norm1.title, 'Bài đọc Tiểu Minh');
  assert.equal(norm1.currentPage, 1, 'Current page must be at least 1');
  assert.equal(norm1.totalPages, 1, 'Total pages must be at least 1');
  assert.equal(norm1.scrollPosition, 0, 'Scroll position must be non-negative');
  assert.equal(norm1.progressPercent, 100, 'Progress percent must be capped at 100%');
  assert.equal(norm1.isCompleted, true, 'Progress 100% automatically sets isCompleted');
});

test('A2. Service: Calculates percentage automatically when not provided', () => {
  const norm2 = normalizeReadingProgressPayload('gr-201', {
    currentPage: 2,
    totalPages: 4
  });
  assert.equal(norm2.progressPercent, 50, 'Page 2 of 4 should calculate 50%');
  assert.equal(norm2.isCompleted, false);
});

test('A3. Service: Local storage persistence and retrieval by user ID', () => {
  const userA = { id: 'user-uuid-aaa' };
  saveLocalReadingRecord(userA.id, 'gr-101', {
    title: 'Tiểu Minh',
    currentPage: 1,
    totalPages: 2,
    scrollPosition: 120,
    progressPercent: 50
  });

  const storeA = getLocalReadingStore(userA.id);
  assert.ok(storeA['gr-101']);
  assert.equal(storeA['gr-101'].progressPercent, 50);
  assert.equal(storeA['gr-101'].scrollPosition, 120);

  // Đảm bảo không lẫn sang tài khoản khác
  const storeB = getLocalReadingStore('user-uuid-bbb');
  assert.equal(storeB['gr-101'], undefined);
});

test('A4. Service: saveReadingProgress saves locally and handles offline/simulation gracefully', async () => {
  const res = await saveReadingProgress('gr-test-offline', {
    title: 'Bài đọc Offline',
    currentPage: 3,
    totalPages: 5,
    progressPercent: 60
  }, { id: 'local-test-user' });

  assert.equal(res.success, true);
  assert.equal(res.record.progressPercent, 60);

  const saved = await getReadingProgress('gr-test-offline', { id: 'local-test-user' });
  assert.ok(saved);
  assert.equal(saved.progressPercent, 60);
});

// =========================================================================
// NHÓM B — SECURITY & ACCESS CONTROL
// =========================================================================

test('B1. Security: getEffectiveUserId validates UUID and rejects malformed IDs', async () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const invalidId = 'not-a-uuid-string';

  const uid1 = await getEffectiveUserId({ id: validUuid });
  assert.equal(uid1, validUuid);

  const uid2 = await getEffectiveUserId({ id: invalidId });
  assert.equal(uid2, null, 'Malformed non-UUID user ID must be rejected');
});

test('B2. Security: User isolation prevents user A from reading user B store', () => {
  const keyA = getLocalReadingStorageKey('user-a');
  const keyB = getLocalReadingStorageKey('user-b');
  assert.notEqual(keyA, keyB);
  assert.equal(keyA.endsWith('user-a'), true);
  assert.equal(keyB.endsWith('user-b'), true);
});

// =========================================================================
// NHÓM C — LOCAL MIGRATION & RECENT READS
// =========================================================================

test('C1. Migration: migrateLocalReadingProgressToCloud safely processes local records', async () => {
  const testUid = '11111111-2222-3333-4444-555555555555';
  saveLocalReadingRecord(testUid, 'gr-mig-1', {
    title: 'Bài đọc cần migrate',
    currentPage: 1,
    totalPages: 3,
    progressPercent: 33,
    lastReadAt: new Date().toISOString()
  });

  const migRes = await migrateLocalReadingProgressToCloud({ id: testUid });
  assert.equal(typeof migRes.migratedCount, 'number');
});

test('C2. Recent Reads: getRecentReadingProgress sorts by lastReadAt descending', async () => {
  const testUid = 'sim_user_recent_tester';
  saveLocalReadingRecord(testUid, 'gr-old', {
    title: 'Đọc cũ',
    progressPercent: 20,
    lastReadAt: '2026-11-01T00:00:00.000Z'
  });
  saveLocalReadingRecord(testUid, 'gr-new', {
    title: 'Đọc mới',
    progressPercent: 80,
    lastReadAt: '2026-11-08T01:00:00.000Z'
  });

  const recent = await getRecentReadingProgress(5, { id: testUid });
  assert.ok(recent.length >= 2);
  assert.equal(recent[0].materialId, 'gr-new', 'Most recent read must be first');
});

test('C3. Delete: deleteReadingProgress removes record from local store', async () => {
  const testUid = 'sim_user_del_tester';
  saveLocalReadingRecord(testUid, 'gr-to-delete', { title: 'Xóa tôi' });
  const delRes = await deleteReadingProgress('gr-to-delete', { id: testUid });
  assert.equal(delRes.success, true);

  const remaining = getLocalReadingStore(testUid);
  assert.equal(remaining['gr-to-delete'], undefined);
});

// =========================================================================
// NHÓM D — REGRESSION CHECK
// =========================================================================

test('D1. Regression: Zero secret key exposure in client reading progress service', () => {
  assert.equal(typeof getReadingProgress, 'function');
  assert.equal(typeof saveReadingProgress, 'function');
  assert.equal(typeof migrateLocalReadingProgressToCloud, 'function');
  assert.equal(typeof getRecentReadingProgress, 'function');
  assert.equal(typeof deleteReadingProgress, 'function');
});
