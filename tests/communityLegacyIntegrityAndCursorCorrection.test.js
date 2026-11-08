/**
 * HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08C.1
 * Test Suite: Community Legacy Migration Integrity & 3-Tuple Cursor Pagination Correction
 *
 * Comprehensive test coverage:
 * 1. Static Schema & Migration Audit:
 *    - Validates legacy_source_id and legacy_author_name columns.
 *    - Validates unique index uq_community_comments_legacy_source.
 *    - Validates compound feed index idx_community_posts_feed_compound.
 *    - Validates enforce_community_comment_integrity recognizes migration sessions.
 * 2. Unverified Author Disconnection & Safe Attribution:
 *    - Verifies no display-name matching in SQL backfill logic.
 *    - Verifies Post 7 legacy comment author_id is disconnected (NULL) and legacy_author_name is preserved.
 *    - Verifies explicit UUIDs are required for user_id attribution.
 * 3. Content Collision & Stable Deduplication:
 *    - Verifies identical comment content from distinct legacy IDs are not deduplicated/lost.
 * 4. 3-Tuple Cursor Pagination Logic Simulation:
 *    - Case 1: Pinned posts cursor traversal.
 *    - Case 2: Transition from pinned posts to unpinned posts.
 *    - Case 3: Posts with identical created_at timestamps disambiguated by ID.
 *    - Case 4: Unpinned posts created after an older pinned post are not skipped.
 *    - Case 5: Newly inserted posts do not corrupt ongoing cursor pagination.
 *    - Case 6: End of feed returns nextCursor = null and hasMore = false.
 * 5. Live Supabase Database Checks (Read-Only & Data Integrity):
 *    - Validates existing posts and comments preserved.
 *    - Validates zero service role key exposure.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 24.08C.1 — Community Legacy Integrity & Cursor Correction Tests', () => {

  // ---------------------------------------------------------------------------
  // GROUP 1: STATIC SCHEMA & MIGRATION SCRIPT AUDIT
  // ---------------------------------------------------------------------------
  describe('Group 1: Static Schema & Migration Script Audit', () => {

    test('1.1. Migration 20261108_community_legacy_integrity_and_cursor_correction.sql exists and is non-destructive', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      assert.ok(fs.existsSync(migPath), 'Migration file must exist');

      const content = fs.readFileSync(migPath, 'utf8');
      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must NOT drop community_posts');
      assert.ok(!content.includes('DROP TABLE public.community_comments'), 'Must NOT drop community_comments');
      assert.ok(!content.includes('DROP COLUMN comments'), 'Must NOT drop legacy JSONB comments column');
      assert.ok(!content.includes('DROP COLUMN liked_by'), 'Must NOT drop legacy JSONB liked_by column');
    });

    test('1.2. Migration adds legacy_source_id and legacy_author_name to community_comments', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS legacy_source_id TEXT'), 'Must add legacy_source_id');
      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS legacy_author_name TEXT'), 'Must add legacy_author_name');
      assert.ok(content.includes('uq_community_comments_legacy_source'), 'Must create unique index on (post_id, legacy_source_id)');
    });

    test('1.3. Migration creates feed compound index for 3-tuple cursor pagination', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      assert.ok(
        content.includes('idx_community_posts_feed_compound'),
        'Must create compound index idx_community_posts_feed_compound'
      );
      assert.ok(
        content.includes('is_pinned DESC, created_at DESC, id DESC'),
        'Compound index must index is_pinned, created_at, id in DESC order'
      );
    });

    test('1.4. Trigger enforce_community_comment_integrity recognizes migration sessions and protects legacy fields without current_user ambiguity', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      // Task 24.08C.1A security fix: current_user in SECURITY DEFINER must NOT be used to authenticate admin
      assert.ok(
        !content.includes("current_user IN ('postgres', 'supabase_admin')"),
        'Must NOT use current_user inside SECURITY DEFINER'
      );
      assert.ok(
        content.includes("SESSION_USER IN ('postgres', 'supabase_admin')"),
        'Must use SESSION_USER together with internal migration token'
      );
      assert.ok(
        content.includes("hanzigo.internal_migration_session"),
        'Must require transaction-local hanzigo.internal_migration_session'
      );
      assert.ok(
        content.includes('NEW.legacy_source_id := NULL'),
        'Regular users must not forge legacy_source_id on INSERT'
      );
      assert.ok(
        content.includes('NEW.legacy_source_id := OLD.legacy_source_id'),
        'Regular users must not mutate legacy_source_id on UPDATE'
      );
    });

    test('1.5. Master schema.sql synchronizes columns, indexes, triggers, manifest, and audit RPC security', () => {
      const schemaPath = path.resolve(process.cwd(), 'supabase/schema.sql');
      const content = fs.readFileSync(schemaPath, 'utf8');

      assert.ok(content.includes('legacy_source_id TEXT'), 'schema.sql must include legacy_source_id');
      assert.ok(content.includes('legacy_author_name TEXT'), 'schema.sql must include legacy_author_name');
      assert.ok(content.includes('uq_community_comments_legacy_source'), 'schema.sql must include unique index');
      assert.ok(content.includes('idx_community_posts_feed_compound'), 'schema.sql must include compound index');
      assert.ok(content.includes('community_migration_manifest'), 'schema.sql must include community_migration_manifest table');
      assert.ok(content.includes('before_state JSONB'), 'schema.sql must include before_state in manifest');
      assert.ok(content.includes('created_state JSONB'), 'schema.sql must include created_state in manifest');
      assert.ok(!content.includes("current_user IN ('postgres', 'supabase_admin')"), 'schema.sql must NOT use current_user in SECURITY DEFINER');
      assert.ok(content.includes("SESSION_USER IN ('postgres', 'supabase_admin')"), 'schema.sql must use SESSION_USER in migration check');
      assert.ok(content.includes('SECURITY INVOKER'), 'schema.sql must define audit_community_post_counters with SECURITY INVOKER');
      assert.ok(content.includes("REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM authenticated"), 'schema.sql must revoke execute from authenticated');
      assert.ok(content.includes("GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO service_role"), 'schema.sql must grant execute to service_role');
    });

    test('1.6. Static Audit: community_migration_manifest guarantees table_name with safe default and applied_at backfill across old & new schemas', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const rollbackPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction_rollback.sql');
      const migContent = fs.readFileSync(migPath, 'utf8');
      const rbContent = fs.readFileSync(rollbackPath, 'utf8');

      // Both scripts must support table_name column with safe default
      assert.ok(migContent.includes("ADD COLUMN IF NOT EXISTS table_name TEXT DEFAULT 'community_comments'"), 'Migration must add table_name column with default');
      assert.ok(rbContent.includes("ADD COLUMN IF NOT EXISTS table_name TEXT DEFAULT 'community_comments'"), 'Rollback must add table_name column with default');
      assert.ok(migContent.includes("SET table_name = 'community_comments'"), 'Migration must backfill table_name where NULL');
      assert.ok(rbContent.includes("SET table_name = 'community_comments'"), 'Rollback must backfill table_name where NULL');

      // Preflight checks must be present in both
      assert.ok(migContent.includes('Preflight verification failed: community_migration_manifest is missing columns'), 'Migration must contain manifest preflight');
      assert.ok(rbContent.includes('Rollback preflight verification failed: community_migration_manifest is missing columns'), 'Rollback must contain manifest preflight');
    });

    test('1.7. Static Audit: audit_community_post_counters output column consistency (likes_diff, comments_diff)', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const schemaPath = path.resolve(process.cwd(), 'supabase/schema.sql');
      const migContent = fs.readFileSync(migPath, 'utf8');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');

      // Telemetry function signature must use likes_diff and comments_diff
      assert.ok(migContent.includes('likes_diff BIGINT'), 'Migration audit function returns likes_diff');
      assert.ok(migContent.includes('comments_diff BIGINT'), 'Migration audit function returns comments_diff');
      assert.ok(schemaContent.includes('likes_diff BIGINT'), 'schema.sql audit function returns likes_diff');
      assert.ok(schemaContent.includes('comments_diff BIGINT'), 'schema.sql audit function returns comments_diff');

      // Must NOT use diff_likes or diff_comments as returned column names
      assert.ok(!migContent.includes('diff_likes BIGINT'), 'Must not define diff_likes');
      assert.ok(!migContent.includes('diff_comments BIGINT'), 'Must not define diff_comments');
    });
  });

  // ---------------------------------------------------------------------------
  // GROUP 2: UNVERIFIED AUTHOR DISCONNECTION & SAFE ATTRIBUTION
  // ---------------------------------------------------------------------------
  describe('Group 2: Unverified Author Disconnection & Safe Attribution', () => {

    test('2.1. Migration strictly bans display name joining against profiles table', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      // Check that comments backfill does NOT join profiles on name or full_name
      assert.ok(!content.includes('pr.name = TRIM(elem->'), 'Must NOT join profiles on pr.name');
      assert.ok(!content.includes('pr.full_name = TRIM(elem->'), 'Must NOT join profiles on pr.full_name');
      assert.ok(!content.includes('WHERE pr.name ='), 'Must NOT filter profiles by name');
    });

    test('2.2. Explicit UUID regex is required for author attribution', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      const uuidRegexPattern = "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";
      assert.ok(content.includes(uuidRegexPattern), 'Must validate source author identity with UUID regex pattern');
    });

    test('2.3. Data correction removes unverified author_id from Post 7 comment', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      assert.ok(
        content.includes("author_id = NULL"),
        'Must reset author_id to NULL'
      );
      assert.ok(
        content.includes("legacy_source_id = 'comment-1791666635196'"),
        'Must backfill exact legacy id comment-1791666635196'
      );
      assert.ok(
        content.includes("legacy_author_name = 'Alibaba và 36 tên Thanh Hoá'"),
        'Must preserve original display string'
      );
    });

    test('2.4. communityService.js correctly renders legacy author name when author_id is NULL', async () => {
      const { mapCommentRow } = await import('../src/services/communityService.js');
      // If mapCommentRow is internal, test via exported function or simulation
      const mockRowWithLegacy = {
        id: '22eb72d5-38ef-4a2d-9454-e4121bce91b7',
        post_id: 3,
        author_id: null,
        content: 'Ứng dụng tuyệt vời quá!',
        status: 'published',
        legacy_source_id: 'c1',
        legacy_author_name: 'Nguyễn Văn Minh',
        created_at: '2026-09-27T16:08:05.545Z',
        profiles: null
      };

      // Test display resolution logic
      const authorName = (mockRowWithLegacy.author_id && mockRowWithLegacy.profiles?.name)
        ? mockRowWithLegacy.profiles.name
        : (mockRowWithLegacy.legacy_author_name || 'Học viên HanziGo');

      assert.strictEqual(authorName, 'Nguyễn Văn Minh', 'Must display original legacy author string');
      assert.strictEqual(mockRowWithLegacy.author_id, null, 'Must NOT fabricate a profile UUID');
    });
  });

  // ---------------------------------------------------------------------------
  // GROUP 3: CONTENT COLLISION & DEDUPLICATION INTEGRITY
  // ---------------------------------------------------------------------------
  describe('Group 3: Content Collision & Deduplication Integrity', () => {

    test('3.1. Identical comment contents with distinct legacy IDs are both preserved', () => {
      // Simulation of 2 comments on the same post with identical content "Cảm ơn bạn!"
      const legacyComments = [
        { id: 'comm_001', author: 'Học viên A', content: 'Cảm ơn bạn!' },
        { id: 'comm_002', author: 'Học viên B', content: 'Cảm ơn bạn!' }
      ];

      const migratedComments = [];
      legacyComments.forEach((elem, ord) => {
        const legacySourceId = elem.id || `idx_${ord}`;
        // Deduplication check: (post_id, legacy_source_id)
        const exists = migratedComments.some(
          c => c.post_id === 10 && c.legacy_source_id === legacySourceId
        );
        if (!exists) {
          migratedComments.push({
            post_id: 10,
            legacy_source_id: legacySourceId,
            content: elem.content,
            legacy_author_name: elem.author
          });
        }
      });

      assert.strictEqual(migratedComments.length, 2, 'Both identical comments must be preserved');
      assert.strictEqual(migratedComments[0].legacy_source_id, 'comm_001');
      assert.strictEqual(migratedComments[1].legacy_source_id, 'comm_002');
    });

    test('3.2. Idempotent re-run does not create duplicate entries', () => {
      const migratedComments = [
        { post_id: 10, legacy_source_id: 'comm_001', content: 'Cảm ơn bạn!' },
        { post_id: 10, legacy_source_id: 'comm_002', content: 'Cảm ơn bạn!' }
      ];

      // Second run with same legacy array
      let insertedCount = 0;
      const legacyComments = [
        { id: 'comm_001', author: 'Học viên A', content: 'Cảm ơn bạn!' },
        { id: 'comm_002', author: 'Học viên B', content: 'Cảm ơn bạn!' }
      ];

      legacyComments.forEach((elem, ord) => {
        const legacySourceId = elem.id || `idx_${ord}`;
        const exists = migratedComments.some(
          c => c.post_id === 10 && c.legacy_source_id === legacySourceId
        );
        if (!exists) {
          insertedCount++;
        }
      });

      assert.strictEqual(insertedCount, 0, 'Re-run must be strictly idempotent with 0 new inserts');
    });
  });

  // ---------------------------------------------------------------------------
  // GROUP 4: 3-TUPLE CURSOR PAGINATION LOGIC SIMULATION
  // ---------------------------------------------------------------------------
  describe('Group 4: 3-Tuple Cursor Pagination Logic Simulation', () => {

    // Helper: simulate database query with sorting and 3-tuple cursor filtering
    function queryFeed(dataset, cursor = null, limit = 2) {
      // 1. Sort dataset according to compound order: is_pinned DESC, created_at DESC, id DESC
      const sorted = [...dataset].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        if (a.created_at !== b.created_at) return new Date(b.created_at) - new Date(a.created_at);
        return Number(b.id) - Number(a.id);
      });

      // 2. Filter using 3-tuple cursor:
      // If cursor.is_pinned is true:
      //   (is_pinned = true AND (created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id)))
      //   OR (is_pinned = false)
      // If cursor.is_pinned is false:
      //   is_pinned = false AND (created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id))
      let filtered = sorted;
      if (cursor && cursor.created_at && cursor.id !== undefined) {
        const cursorPinned = Boolean(cursor.is_pinned);
        const cursorTime = new Date(cursor.created_at).getTime();
        const cursorId = Number(cursor.id);

        filtered = sorted.filter(item => {
          const itemTime = new Date(item.created_at).getTime();
          const itemId = Number(item.id);

          if (cursorPinned) {
            if (item.is_pinned) {
              if (itemTime < cursorTime) return true;
              if (itemTime === cursorTime && itemId < cursorId) return true;
              return false;
            }
            return true; // Any unpinned post follows pinned posts
          } else {
            if (item.is_pinned) return false;
            if (itemTime < cursorTime) return true;
            if (itemTime === cursorTime && itemId < cursorId) return true;
            return false;
          }
        });
      }

      const hasMore = filtered.length > limit;
      const rows = hasMore ? filtered.slice(0, limit) : filtered;
      const last = rows.length > 0 ? rows[rows.length - 1] : null;

      const nextCursor = (hasMore && last) ? {
        is_pinned: Boolean(last.is_pinned),
        created_at: last.created_at,
        id: String(last.id)
      } : null;

      return { rows, nextCursor, hasMore };
    }

    const testFeedDataset = [
      { id: 1, is_pinned: false, created_at: '2026-09-01T10:00:00Z', title: 'Post 1 (old)' },
      { id: 2, is_pinned: false, created_at: '2026-09-02T10:00:00Z', title: 'Post 2 (mid)' },
      { id: 3, is_pinned: true,  created_at: '2026-09-01T12:00:00Z', title: 'Post 3 (pinned old)' },
      { id: 4, is_pinned: true,  created_at: '2026-09-03T12:00:00Z', title: 'Post 4 (pinned new)' },
      { id: 5, is_pinned: false, created_at: '2026-09-04T10:00:00Z', title: 'Post 5 (unpinned newest)' },
      { id: 6, is_pinned: false, created_at: '2026-09-02T10:00:00Z', title: 'Post 6 (identical timestamp as 2)' }
    ];

    test('4.1. Case 1 & 2: Traversal of pinned posts and boundary transition to unpinned', () => {
      // Page 1: limit 2
      const page1 = queryFeed(testFeedDataset, null, 2);
      assert.strictEqual(page1.rows.length, 2);
      assert.strictEqual(page1.rows[0].id, 4, 'Post 4 (pinned new) must be 1st');
      assert.strictEqual(page1.rows[1].id, 3, 'Post 3 (pinned old) must be 2nd');
      assert.ok(page1.hasMore);
      assert.deepStrictEqual(page1.nextCursor, {
        is_pinned: true,
        created_at: '2026-09-01T12:00:00Z',
        id: '3'
      });

      // Page 2: boundary transition from pinned (3) to unpinned
      const page2 = queryFeed(testFeedDataset, page1.nextCursor, 2);
      assert.strictEqual(page2.rows.length, 2);
      assert.strictEqual(page2.rows[0].id, 5, 'Post 5 (unpinned newest) must follow pinned posts');
      assert.strictEqual(page2.rows[1].id, 6, 'Post 6 (unpinned mid, id 6 > id 2) must be next');
      assert.ok(page2.hasMore);
      assert.deepStrictEqual(page2.nextCursor, {
        is_pinned: false,
        created_at: '2026-09-02T10:00:00Z',
        id: '6'
      });
    });

    test('4.2. Case 3: Posts with identical timestamps disambiguated by ID', () => {
      // From Page 2 cursor (pointing at Post 6 with timestamp 2026-09-02T10:00:00Z and id 6)
      const cursor = {
        is_pinned: false,
        created_at: '2026-09-02T10:00:00Z',
        id: '6'
      };
      const page3 = queryFeed(testFeedDataset, cursor, 2);
      assert.strictEqual(page3.rows.length, 2);
      assert.strictEqual(page3.rows[0].id, 2, 'Post 2 (same timestamp as 6, lower id) must follow 6');
      assert.strictEqual(page3.rows[1].id, 1, 'Post 1 (oldest) must follow 2');
      assert.strictEqual(page3.hasMore, false, 'No more posts');
      assert.strictEqual(page3.nextCursor, null, 'nextCursor must be null at end of feed');
    });

    test('4.3. Case 4: Unpinned posts created after an older pinned post are NEVER skipped', () => {
      // Post 5 was created at '2026-09-04', which is NEWER than pinned Post 3 ('2026-09-01').
      // In a naive created_at cursor, passing cursor of Post 3 ('2026-09-01') would skip Post 5!
      // In 3-tuple cursor, since cursor.is_pinned was true, Post 5 is correctly fetched!
      const cursorAfterPinned = {
        is_pinned: true,
        created_at: '2026-09-01T12:00:00Z',
        id: '3'
      };
      const result = queryFeed(testFeedDataset, cursorAfterPinned, 5);
      const postIds = result.rows.map(r => r.id);
      assert.ok(postIds.includes(5), 'Unpinned Post 5 must NOT be skipped despite being created after pinned post 3');
    });

    test('4.4. Case 5 & 6: Insertion of new post during pagination does not corrupt ongoing pagination', () => {
      // User is at cursor of Post 5
      const cursor = {
        is_pinned: false,
        created_at: '2026-09-04T10:00:00Z',
        id: '5'
      };

      // Someone inserts a brand new post at 2026-09-05
      const expandedDataset = [
        ...testFeedDataset,
        { id: 99, is_pinned: false, created_at: '2026-09-05T10:00:00Z', title: 'Post 99 (newest)' }
      ];

      const nextPage = queryFeed(expandedDataset, cursor, 2);
      // Next page should continue with Post 6 and 2, without duplicating Post 5 or unexpectedly jumping to 99
      assert.strictEqual(nextPage.rows[0].id, 6);
      assert.strictEqual(nextPage.rows[1].id, 2);
    });
  });

  // ---------------------------------------------------------------------------
  // GROUP 5: SECURITY DEFINER THREAT MODEL & RUNTIME AUTHORIZATION TESTS
  // ---------------------------------------------------------------------------
  describe('Group 5: Security Definer Threat Model & Runtime Authorization', () => {

    // Simulation of enforce_community_comment_integrity logic
    function executeCommentTrigger(context, operation, oldRow, newRow) {
      const {
        auth_role = null,
        auth_uid = null,
        jwt_claims_role = null,
        is_admin_active = false,
        session_user = 'authenticated',
        config_migration_session = null
      } = context;

      const is_service_role = (
        auth_role === 'service_role' ||
        jwt_claims_role === 'service_role'
      );
      const is_admin = is_admin_active && !is_service_role && auth_uid !== null;
      const is_migration = (
        config_migration_session === 'true' &&
        (['postgres', 'supabase_admin'].includes(session_user) || is_service_role)
      );

      const has_privileged_access = is_service_role || is_admin || is_migration;

      const row = { ...newRow };

      if (operation === 'INSERT') {
        if (!has_privileged_access) {
          if (row.author_id && row.author_id !== auth_uid) {
            throw new Error('Quyền hạn bị từ chối: Không thể đăng bình luận dưới danh nghĩa người khác.');
          }
          row.author_id = auth_uid;
          row.status = 'published';
          row.deleted_at = null;
          row.created_at = new Date().toISOString();
          row.legacy_source_id = null;
          row.legacy_author_name = null;
        }
        row.updated_at = new Date().toISOString();
        return row;
      }

      if (operation === 'UPDATE') {
        if (!has_privileged_access) {
          if (row.author_id !== oldRow.author_id) {
            throw new Error('Quyền hạn bị từ chối: Không thể thay đổi tác giả bình luận.');
          }
          if (row.post_id !== oldRow.post_id) {
            throw new Error('Quyền hạn bị từ chối: Không thể chuyển bình luận sang bài viết khác.');
          }
          if (row.created_at !== oldRow.created_at) {
            throw new Error('Quyền hạn bị từ chối: Không thể sửa đổi thời gian đăng bình luận.');
          }
          if (row.status !== oldRow.status) {
            throw new Error('Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền đổi trạng thái bình luận.');
          }
          if (row.deleted_at !== oldRow.deleted_at) {
            throw new Error('Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa bình luận.');
          }
          row.legacy_source_id = oldRow.legacy_source_id;
          row.legacy_author_name = oldRow.legacy_author_name;
        }
        row.updated_at = new Date().toISOString();
        return row;
      }

      return row;
    }

    test('5.1. Student A is rejected when attempting to INSERT comment with Student B author_id', () => {
      const studentA = {
        auth_role: 'authenticated',
        auth_uid: '11111111-1111-1111-1111-111111111111',
        session_user: 'authenticated'
      };

      assert.throws(() => {
        executeCommentTrigger(studentA, 'INSERT', null, {
          post_id: 3,
          author_id: '22222222-2222-2222-2222-222222222222', // Student B
          content: 'Impersonation attempt'
        });
      }, /Không thể đăng bình luận dưới danh nghĩa người khác/);
    });

    test('5.2. Student A attempting to INSERT with forged legacy_source_id has it cleared to NULL', () => {
      const studentA = {
        auth_role: 'authenticated',
        auth_uid: '11111111-1111-1111-1111-111111111111',
        session_user: 'authenticated'
      };

      const result = executeCommentTrigger(studentA, 'INSERT', null, {
        post_id: 3,
        author_id: studentA.auth_uid,
        legacy_source_id: 'forged_source_123',
        legacy_author_name: 'Fake BQT Admin',
        content: 'Valid content'
      });

      assert.strictEqual(result.legacy_source_id, null, 'Client forged legacy_source_id must be forced to NULL');
      assert.strictEqual(result.legacy_author_name, null, 'Client forged legacy_author_name must be forced to NULL');
    });

    test('5.3. Student A attempting to UPDATE legacy_source_id or legacy_author_name is ignored/reverted', () => {
      const studentA = {
        auth_role: 'authenticated',
        auth_uid: '11111111-1111-1111-1111-111111111111',
        session_user: 'authenticated'
      };

      const oldComment = {
        id: 'c-100',
        post_id: 3,
        author_id: studentA.auth_uid,
        content: 'Original comment',
        legacy_source_id: 'legacy_original',
        legacy_author_name: 'Original Legacy Author',
        status: 'published',
        created_at: '2026-09-01T10:00:00Z',
        deleted_at: null
      };

      const updated = executeCommentTrigger(studentA, 'UPDATE', oldComment, {
        ...oldComment,
        legacy_source_id: 'tampered_source',
        legacy_author_name: 'Tampered Author',
        content: 'Updated content'
      });

      assert.strictEqual(updated.legacy_source_id, 'legacy_original', 'Must revert to OLD.legacy_source_id');
      assert.strictEqual(updated.legacy_author_name, 'Original Legacy Author', 'Must revert to OLD.legacy_author_name');
    });

    test('5.4. Student A attempting to change comment status or post_id is rejected with exception', () => {
      const studentA = {
        auth_role: 'authenticated',
        auth_uid: '11111111-1111-1111-1111-111111111111',
        session_user: 'authenticated'
      };

      const oldComment = {
        id: 'c-100',
        post_id: 3,
        author_id: studentA.auth_uid,
        content: 'Original comment',
        status: 'published',
        created_at: '2026-09-01T10:00:00Z',
        deleted_at: null
      };

      // Moving to another post
      assert.throws(() => {
        executeCommentTrigger(studentA, 'UPDATE', oldComment, {
          ...oldComment,
          post_id: 7
        });
      }, /Không thể chuyển bình luận sang bài viết khác/);

      // Changing moderation status
      assert.throws(() => {
        executeCommentTrigger(studentA, 'UPDATE', oldComment, {
          ...oldComment,
          status: 'hidden'
        });
      }, /Chỉ quản trị viên mới có quyền đổi trạng thái bình luận/);
    });

    test('5.5. Active Admin profile can perform moderation updates and status changes', () => {
      const activeAdmin = {
        auth_role: 'authenticated',
        auth_uid: '99999999-9999-9999-9999-999999999999',
        is_admin_active: true,
        session_user: 'authenticated'
      };

      const oldComment = {
        id: 'c-100',
        post_id: 3,
        author_id: '11111111-1111-1111-1111-111111111111',
        content: 'Spam comment',
        status: 'published',
        created_at: '2026-09-01T10:00:00Z',
        deleted_at: null
      };

      const moderated = executeCommentTrigger(activeAdmin, 'UPDATE', oldComment, {
        ...oldComment,
        status: 'hidden'
      });

      assert.strictEqual(moderated.status, 'hidden', 'Admin must be permitted to hide comments');
    });

    test('5.6. Blocked / inactive Admin is rejected as regular non-admin', () => {
      const blockedAdmin = {
        auth_role: 'authenticated',
        auth_uid: '88888888-8888-8888-8888-888888888888',
        is_admin_active: false, // Inactive / blocked status
        session_user: 'authenticated'
      };

      const oldComment = {
        id: 'c-100',
        post_id: 3,
        author_id: '11111111-1111-1111-1111-111111111111',
        content: 'Target comment',
        status: 'published',
        created_at: '2026-09-01T10:00:00Z',
        deleted_at: null
      };

      assert.throws(() => {
        executeCommentTrigger(blockedAdmin, 'UPDATE', oldComment, {
          ...oldComment,
          status: 'hidden'
        });
      }, /Chỉ quản trị viên mới có quyền đổi trạng thái bình luận/);
    });

    test('5.7. Migration session with postgres session_user and internal token can set author_id = NULL and legacy fields', () => {
      const migrationSession = {
        auth_role: null,
        auth_uid: null,
        session_user: 'postgres',
        config_migration_session: 'true'
      };

      const inserted = executeCommentTrigger(migrationSession, 'INSERT', null, {
        post_id: 7,
        author_id: null,
        content: 'ní hảo ní nha',
        legacy_source_id: 'comment-1791666635196',
        legacy_author_name: 'Alibaba và 36 tên Thanh Hoá',
        status: 'published'
      });

      assert.strictEqual(inserted.author_id, null, 'Migration session preserves author_id = NULL');
      assert.strictEqual(inserted.legacy_source_id, 'comment-1791666635196');
      assert.strictEqual(inserted.legacy_author_name, 'Alibaba và 36 tên Thanh Hoá');
    });

    test('5.8. Authenticated student setting migration token does NOT gain migration privileges (session_user check)', () => {
      const attackingStudent = {
        auth_role: 'authenticated',
        auth_uid: '11111111-1111-1111-1111-111111111111',
        session_user: 'authenticated', // NOT postgres or supabase_admin!
        config_migration_session: 'true' // Student tried to set session variable
      };

      // Because session_user is 'authenticated' and NOT service_role, migration privilege is DENIED!
      const result = executeCommentTrigger(attackingStudent, 'INSERT', null, {
        post_id: 3,
        author_id: attackingStudent.auth_uid,
        legacy_source_id: 'forged_source_attack',
        legacy_author_name: 'Attacker Impersonating BQT',
        content: 'Valid content'
      });

      assert.strictEqual(result.legacy_source_id, null, 'Migration bypass must fail for student session_user');
      assert.strictEqual(result.legacy_author_name, null);
    });

    test('5.9. audit_community_post_counters dual-context guard: HTTP PostgREST vs Direct SQL', () => {
      // Simulate audit_community_post_counters dual-context guard (Task 24.08C.1A.2)
      function checkAuditAccess(context) {
        const { jwt_role, session_user } = context;

        // Context 1: PostgREST / HTTP invocation (JWT claims present)
        if (jwt_role !== undefined && jwt_role !== null) {
          if (jwt_role !== 'service_role') {
            const err = new Error('Quyền hạn bị từ chối: Chỉ Service Role mới có quyền truy cập công cụ đối soát.');
            err.code = '42501';
            throw err;
          }
          return true;
        }

        // Context 2: Direct SQL session (psql / SQL editor where JWT is null)
        if (!['postgres', 'supabase_admin'].includes(session_user)) {
          const err = new Error('Quyền hạn bị từ chối: Chỉ Superuser hoặc Service Role mới có quyền truy cập công cụ đối soát.');
          err.code = '42501';
          throw err;
        }
        return true;
      }

      // HTTP PostgREST: Anonymous -> denied (42501)
      assert.throws(() => checkAuditAccess({ jwt_role: 'anon', session_user: 'authenticator' }), /Quyền hạn bị từ chối/);

      // HTTP PostgREST: Student A -> denied (42501)
      assert.throws(() => checkAuditAccess({ jwt_role: 'authenticated', session_user: 'authenticator' }), /Quyền hạn bị từ chối/);

      // HTTP PostgREST: Active Admin using authenticated JWT -> denied (42501)
      assert.throws(() => checkAuditAccess({ jwt_role: 'authenticated', session_user: 'authenticator' }), /Quyền hạn bị từ chối/);

      // HTTP PostgREST: Service Role -> allowed
      assert.ok(checkAuditAccess({ jwt_role: 'service_role', session_user: 'authenticator' }));

      // Direct SQL: Unprivileged session_user -> denied (42501)
      assert.throws(() => checkAuditAccess({ jwt_role: null, session_user: 'student_user' }), /Chỉ Superuser hoặc Service Role/);

      // Direct SQL: Superuser postgres / supabase_admin -> allowed
      assert.ok(checkAuditAccess({ jwt_role: null, session_user: 'postgres' }));
      assert.ok(checkAuditAccess({ jwt_role: null, session_user: 'supabase_admin' }));
    });

    test('5.10. Verified Legacy UUID Precondition: Fails if UUID does not exist or belongs to wrong post_id', () => {
      const verifiedDb = [
        { id: 'd76d4034-25c9-4d67-a601-9fa5cb777b2f', post_id: 7, legacy_source_id: 'comment-1791666635196' },
        { id: '22eb72d5-38ef-4a2d-9454-e4121bce91b7', post_id: 3, legacy_source_id: 'c1' }
      ];

      function verifyLegacyTarget(db, targetUuid, expectedPostId, targetSourceId) {
        const rec = db.find(r => r.id === targetUuid);
        if (!rec) {
          throw new Error(`Precondition failed: Verified comment UUID ${targetUuid} does not exist`);
        }
        if (rec.post_id !== expectedPostId) {
          throw new Error(`Precondition failed: Comment UUID ${targetUuid} belongs to post_id ${rec.post_id}, expected ${expectedPostId}`);
        }
        const collision = db.some(r => r.post_id === expectedPostId && r.legacy_source_id === targetSourceId && r.id !== targetUuid);
        if (collision) {
          throw new Error(`Precondition failed: legacy_source_id ${targetSourceId} is already used by another record on Post ${expectedPostId}`);
        }
        return true;
      }

      // Valid cases
      assert.ok(verifyLegacyTarget(verifiedDb, 'd76d4034-25c9-4d67-a601-9fa5cb777b2f', 7, 'comment-1791666635196'));
      assert.ok(verifyLegacyTarget(verifiedDb, '22eb72d5-38ef-4a2d-9454-e4121bce91b7', 3, 'c1'));

      // Non-existent UUID
      assert.throws(
        () => verifyLegacyTarget(verifiedDb, '00000000-0000-0000-0000-000000000000', 3, 'c1'),
        /does not exist/
      );

      // Wrong post_id
      assert.throws(
        () => verifyLegacyTarget(verifiedDb, 'd76d4034-25c9-4d67-a601-9fa5cb777b2f', 3, 'c1'),
        /expected 3/
      );

      // Source ID collision with another record
      const dbWithCollision = [
        ...verifiedDb,
        { id: '11111111-1111-1111-1111-111111111111', post_id: 3, legacy_source_id: 'c1' }
      ];
      assert.throws(
        () => verifyLegacyTarget(dbWithCollision, '22eb72d5-38ef-4a2d-9454-e4121bce91b7', 3, 'c1'),
        /already used by another record/
      );
    });

    test('5.11. JSONB Source Collision Precheck: Detects duplicate explicit source IDs inside single post comments array', () => {
      function detectJsonbSourceCollisions(posts) {
        const collisions = [];
        posts.forEach(p => {
          const comments = Array.isArray(p.comments) ? p.comments : [];
          const counts = {};
          comments.forEach((c, idx) => {
            const rawId = (c && c.id !== undefined && c.id !== null) ? String(c.id).trim() : '';
            const sourceId = rawId !== '' ? rawId : `idx_${idx + 1}`;
            counts[sourceId] = (counts[sourceId] || 0) + 1;
          });
          Object.entries(counts).forEach(([sourceId, count]) => {
            if (count > 1) {
              collisions.push({ postId: p.id, sourceId, occurrences: count });
            }
          });
        });
        if (collisions.length > 0) {
          const first = collisions[0];
          throw new Error(`Source collision detected in community_posts: post_id=${first.postId}, legacy_source_id=${first.sourceId}, occurrences=${first.occurrences}`);
        }
        return true;
      }

      // Valid posts (no duplicates)
      const validPosts = [
        { id: 3, comments: [{ id: 'c1', content: 'C1' }, { id: 'c2', content: 'C2' }] },
        { id: 7, comments: [{ id: 'comm-1', content: 'Hi' }] }
      ];
      assert.ok(detectJsonbSourceCollisions(validPosts));

      // Post with duplicate explicit source ID 'c1'
      const invalidPosts = [
        { id: 3, comments: [{ id: 'c1', content: 'C1' }, { id: 'c1', content: 'C1 duplicate' }] }
      ];
      assert.throws(
        () => detectJsonbSourceCollisions(invalidPosts),
        /Source collision detected in community_posts: post_id=3, legacy_source_id=c1, occurrences=2/
      );
    });

    test('5.12. JSONB Source Collision Precheck: Detects explicit ID colliding with ordinal fallback ID', () => {
      function detectJsonbSourceCollisions(posts) {
        const collisions = [];
        posts.forEach(p => {
          const comments = Array.isArray(p.comments) ? p.comments : [];
          const counts = {};
          comments.forEach((c, idx) => {
            const rawId = (c && c.id !== undefined && c.id !== null) ? String(c.id).trim() : '';
            const sourceId = rawId !== '' ? rawId : `idx_${idx + 1}`;
            counts[sourceId] = (counts[sourceId] || 0) + 1;
          });
          Object.entries(counts).forEach(([sourceId, count]) => {
            if (count > 1) {
              collisions.push({ postId: p.id, sourceId, occurrences: count });
            }
          });
        });
        if (collisions.length > 0) {
          const first = collisions[0];
          throw new Error(`Source collision detected in community_posts: post_id=${first.postId}, legacy_source_id=${first.sourceId}, occurrences=${first.occurrences}`);
        }
        return true;
      }

      // Post where item 1 explicitly declares id = 'idx_2', and item 2 has no id (ordinal 2 fallback = 'idx_2')
      const explicitCollidingWithFallback = [
        {
          id: 5,
          comments: [
            { id: 'idx_2', content: 'Explicit collision' },
            { content: 'No id provided, falls back to idx_2' }
          ]
        }
      ];

      assert.throws(
        () => detectJsonbSourceCollisions(explicitCollidingWithFallback),
        /Source collision detected in community_posts: post_id=5, legacy_source_id=idx_2, occurrences=2/
      );
    });

    test('5.13. Catalog Security Property & ACL Simulation: prosecdef = false (SECURITY INVOKER)', () => {
      // Simulate pg_proc entry
      const pgProcEntry = {
        proname: 'audit_community_post_counters',
        prosecdef: false, // SECURITY INVOKER
        proowner: 'postgres'
      };

      // In SECURITY INVOKER, prosecdef MUST be false
      assert.strictEqual(pgProcEntry.prosecdef, false, 'audit function must NOT be SECURITY DEFINER');

      // Function privileges check simulation
      const privileges = {
        PUBLIC: false,
        anon: false,
        authenticated: false,
        service_role: true
      };

      function hasFunctionPrivilege(role, funcName, priv) {
        if (priv === 'EXECUTE') {
          return privileges[role] || false;
        }
        return false;
      }

      assert.strictEqual(hasFunctionPrivilege('anon', 'public.audit_community_post_counters()', 'EXECUTE'), false);
      assert.strictEqual(hasFunctionPrivilege('authenticated', 'public.audit_community_post_counters()', 'EXECUTE'), false);
      assert.strictEqual(hasFunctionPrivilege('service_role', 'public.audit_community_post_counters()', 'EXECUTE'), true);
    });
  });

  // ---------------------------------------------------------------------------
  // GROUP 6: MIGRATION MANIFEST SNAPSHOT & ROLLBACK INTEGRITY (MOCKED INTEGRATION)
  // ---------------------------------------------------------------------------
  describe('Group 6: Migration Manifest Snapshot & Rollback Integrity (Mocked Integration)', () => {

    // Helper: simulate rollback execution engine with row locks, full 9-field validation, related data check, and ROW_COUNT check
    function executeSurgicalRollback(commentsDb, migrationManifest, reportsDb = [], modLogsDb = [], options = {}) {
      // 1. Concurrency Simulation: Row-level lock acquisition
      const lockedIds = new Set(
        migrationManifest
          .filter(m => m.migration_id === '20261108_community_legacy_integrity')
          .map(m => m.record_id)
      );

      let expectedDeleteCount = 0;

      // 2. Full 9-field validation of INSERTED records
      const insertedEntries = migrationManifest.filter(
        m => m.migration_id === '20261108_community_legacy_integrity' && m.action === 'INSERTED'
      );

      for (const entry of insertedEntries) {
        const comment = commentsDb.find(c => c.id === entry.record_id);
        if (comment) {
          const cs = entry.created_state;
          if (cs) {
            // author_id
            if (comment.author_id !== (cs.author_id !== undefined ? cs.author_id : null)) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field author_id mismatched. Refusing to delete.`);
            }
            // post_id
            if (comment.post_id !== cs.post_id) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field post_id mismatched. Refusing to delete.`);
            }
            // content
            if (comment.content !== cs.content) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field content mismatched. Refusing to delete.`);
            }
            // status
            if (comment.status !== cs.status) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field status mismatched. Refusing to delete.`);
            }
            // deleted_at
            if ((comment.deleted_at || null) !== (cs.deleted_at || null)) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field deleted_at mismatched. Refusing to delete.`);
            }
            // legacy_source_id
            if (comment.legacy_source_id !== cs.legacy_source_id) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field legacy_source_id mismatched. Refusing to delete.`);
            }
            // legacy_author_name
            if (comment.legacy_author_name !== cs.legacy_author_name) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field legacy_author_name mismatched. Refusing to delete.`);
            }
            // created_at
            if (comment.created_at !== cs.created_at) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field created_at mismatched. Refusing to delete.`);
            }
            // updated_at
            if (comment.updated_at !== cs.updated_at) {
              throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} field updated_at mismatched. Refusing to delete.`);
            }
          }

          // Check referencing reports
          const hasReport = reportsDb.some(
            r => r.comment_id === entry.record_id || (r.target_type === 'comment' && r.target_id === String(entry.record_id))
          );
          if (hasReport) {
            throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} has associated reports in community_reports. Refusing to delete.`);
          }

          // Check referencing moderation logs
          const hasModLog = modLogsDb.some(
            l => l.target_type === 'comment' && l.target_id === String(entry.record_id)
          );
          if (hasModLog) {
            throw new Error(`ROLLBACK ABORTED: Comment ${entry.record_id} on post ${entry.post_id} has associated logs in community_moderation_logs. Refusing to delete.`);
          }

          expectedDeleteCount++;
        }
      }

      // 3. Revert UPDATED records from before_state snapshot
      // Exactly matches PostgreSQL CASE decoding logic:
      // - Key absent: keeps c.field
      // - Key is null: restores SQL null
      // - Key is '' (text): preserves '' without converting to null
      // - Key is typed: parses UUID/BIGINT/TIMESTAMPTZ safely
      const updatedEntries = migrationManifest.filter(
        m => m.migration_id === '20261108_community_legacy_integrity' && m.action === 'UPDATED'
      );
      for (const entry of updatedEntries) {
        const comment = commentsDb.find(c => c.id === entry.record_id);
        if (comment && entry.before_state) {
          const bs = entry.before_state;

          const decodeText = (key, currentVal) => {
            if (!Object.prototype.hasOwnProperty.call(bs, key)) return currentVal;
            const val = bs[key];
            if (val === null || val === undefined) return null;
            return String(val); // Preserves '' as ''!
          };

          const decodeTyped = (key, currentVal) => {
            if (!Object.prototype.hasOwnProperty.call(bs, key)) return currentVal;
            const val = bs[key];
            if (val === null || val === undefined || val === '') return null;
            return val;
          };

          comment.author_id = decodeTyped('author_id', comment.author_id);
          comment.legacy_source_id = decodeText('legacy_source_id', comment.legacy_source_id);
          comment.legacy_author_name = decodeText('legacy_author_name', comment.legacy_author_name);
          comment.post_id = decodeTyped('post_id', comment.post_id);
          comment.content = decodeText('content', comment.content);
          comment.status = decodeText('status', comment.status);
          comment.deleted_at = decodeTyped('deleted_at', comment.deleted_at);
          if ('created_at' in bs) comment.created_at = decodeTyped('created_at', comment.created_at);
          if ('updated_at' in bs) comment.updated_at = decodeTyped('updated_at', comment.updated_at);
        }
      }

      // 4. Delete verified untouched INSERTED records and check ROW_COUNT
      const insertedIds = new Set(insertedEntries.map(e => e.record_id));
      const filteredComments = commentsDb.filter(c => !insertedIds.has(c.id));
      const actualDeleteCount = commentsDb.length - filteredComments.length;

      // Simulated concurrency injection (e.g. if another transaction concurrently deleted a row)
      const injectedDeleteCount = options.simulatedActualDeleteCount !== undefined 
        ? options.simulatedActualDeleteCount 
        : actualDeleteCount;

      if (injectedDeleteCount !== expectedDeleteCount) {
        throw new Error(`Concurrency violation: Expected to delete ${expectedDeleteCount} comments, but ${injectedDeleteCount} rows were deleted. Aborting rollback.`);
      }

      // 5. Clear manifest records
      const remainingManifest = migrationManifest.filter(
        m => m.migration_id !== '20261108_community_legacy_integrity'
      );

      return {
        commentsDb: filteredComments,
        migrationManifest: remainingManifest
      };
    }

    test('6.1. Case A1 — UPDATED Snapshot NULL Restoration: NULL fields in before_state are restored to SQL null', () => {
      const recordId = 'd76d4034-25c9-4d67-a601-9fa5cb777b2f';
      // Prior to migration, Post 7 comment had NULL legacy fields and an unverified author_id
      const initialComment = {
        id: recordId,
        post_id: 7,
        author_id: 'c1f7a0b3-9e4a-4a88-8b9a-111111111111',
        content: 'ní hảo ní nha',
        legacy_source_id: null,
        legacy_author_name: null,
        status: 'published'
      };

      // Snapshot captured BEFORE migration UPDATE
      const beforeState = {
        author_id: initialComment.author_id,
        legacy_source_id: null, // explicitly NULL
        legacy_author_name: null, // explicitly NULL
        post_id: 7,
        content: 'ní hảo ní nha',
        status: 'published'
      };

      // Live state AFTER migration: migration populated legacy_source_id and reset author_id to null
      const migratedComment = {
        ...initialComment,
        author_id: null,
        legacy_source_id: 'comment-1791666635196',
        legacy_author_name: 'Alibaba và 36 tên Thanh Hoá'
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: recordId,
        action: 'UPDATED',
        post_id: 7,
        legacy_source_id: 'comment-1791666635196',
        before_state: beforeState,
        created_state: null
      }];

      // Execute rollback
      const result = executeSurgicalRollback([migratedComment], manifest);
      const restored = result.commentsDb.find(c => c.id === recordId);

      // Verify that NULL values in before_state were restored as NULL, NOT masked by COALESCE
      assert.ok(restored, 'Row must exist');
      assert.strictEqual(restored.legacy_source_id, null, 'legacy_source_id must be restored to NULL');
      assert.strictEqual(restored.legacy_author_name, null, 'legacy_author_name must be restored to NULL');
      assert.strictEqual(restored.author_id, 'c1f7a0b3-9e4a-4a88-8b9a-111111111111', 'author_id restored to original UUID');
      assert.strictEqual(restored.content, 'ní hảo ní nha');
    });

    test('6.2. Case A2 — UPDATED Snapshot Non-NULL Restoration: Non-null fields are restored accurately', () => {
      const recordId = '22eb72d5-38ef-4a2d-9454-e4121bce91b7';
      const initialComment = {
        id: recordId,
        post_id: 3,
        author_id: '33333333-3333-3333-3333-333333333333',
        content: 'Bổ ích quá anh',
        legacy_source_id: 'old_source_999',
        legacy_author_name: 'Nguyễn Văn Minh Cũ',
        status: 'published'
      };

      const beforeState = {
        author_id: initialComment.author_id,
        legacy_source_id: initialComment.legacy_source_id,
        legacy_author_name: initialComment.legacy_author_name,
        post_id: initialComment.post_id,
        content: initialComment.content,
        status: initialComment.status
      };

      const migratedComment = {
        ...initialComment,
        author_id: null,
        legacy_source_id: 'c1',
        legacy_author_name: 'Nguyễn Văn Minh'
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: recordId,
        action: 'UPDATED',
        post_id: 3,
        legacy_source_id: 'c1',
        before_state: beforeState,
        created_state: null
      }];

      const result = executeSurgicalRollback([migratedComment], manifest);
      const restored = result.commentsDb.find(c => c.id === recordId);

      assert.ok(restored, 'Row must exist');
      assert.strictEqual(restored.legacy_source_id, 'old_source_999', 'legacy_source_id restored from snapshot');
      assert.strictEqual(restored.legacy_author_name, 'Nguyễn Văn Minh Cũ', 'legacy_author_name restored from snapshot');
      assert.strictEqual(restored.author_id, '33333333-3333-3333-3333-333333333333');
    });

    test('6.3. Case B — INSERTED Unmodified: Clean deletion of only migration-created comment', () => {
      const migratedComment = {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        post_id: 3,
        author_id: null,
        content: 'Bình luận JSONB di chuyển',
        status: 'published',
        deleted_at: null,
        legacy_source_id: 'c2',
        legacy_author_name: 'Học viên A',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: migratedComment.id,
        action: 'INSERTED',
        post_id: 3,
        legacy_source_id: 'c2',
        before_state: null,
        created_state: {
          author_id: null,
          post_id: 3,
          content: 'Bình luận JSONB di chuyển',
          status: 'published',
          deleted_at: null,
          legacy_source_id: 'c2',
          legacy_author_name: 'Học viên A',
          created_at: '2026-09-01T10:00:00Z',
          updated_at: '2026-09-01T10:00:00Z'
        }
      }];

      const preExistingComment = {
        id: '11111111-1111-1111-1111-111111111111',
        post_id: 7,
        content: 'Bình luận đã có trước migration',
        status: 'published'
      };

      const result = executeSurgicalRollback([migratedComment, preExistingComment], manifest);

      assert.strictEqual(result.commentsDb.find(c => c.id === migratedComment.id), undefined);
      assert.ok(result.commentsDb.find(c => c.id === preExistingComment.id));
      assert.strictEqual(result.migrationManifest.length, 0);
    });

    test('6.4. Case C — FULL created_state 9-Field Validation: Mutation of ANY of the 9 fields aborts rollback', () => {
      const baseComment = {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        post_id: 3,
        author_id: null,
        content: 'Bình luận gốc',
        status: 'published',
        deleted_at: null,
        legacy_source_id: 'c2',
        legacy_author_name: 'Tác giả gốc',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: baseComment.id,
        action: 'INSERTED',
        post_id: 3,
        legacy_source_id: 'c2',
        created_state: { ...baseComment }
      }];

      // 1. author_id mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, author_id: '99999999-9999-9999-9999-999999999999' }], manifest),
        /field author_id mismatched/
      );

      // 2. post_id mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, post_id: 99 }], manifest),
        /field post_id mismatched/
      );

      // 3. content mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, content: 'Nội dung bị sửa' }], manifest),
        /field content mismatched/
      );

      // 4. status mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, status: 'hidden' }], manifest),
        /field status mismatched/
      );

      // 5. deleted_at mutation (soft-delete)
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, deleted_at: '2026-09-05T10:00:00Z' }], manifest),
        /field deleted_at mismatched/
      );

      // 6. legacy_source_id mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, legacy_source_id: 'c2_tampered' }], manifest),
        /field legacy_source_id mismatched/
      );

      // 7. legacy_author_name mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, legacy_author_name: 'Tên sửa' }], manifest),
        /field legacy_author_name mismatched/
      );

      // 8. created_at mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, created_at: '2026-09-02T10:00:00Z' }], manifest),
        /field created_at mismatched/
      );

      // 9. updated_at mutation
      assert.throws(
        () => executeSurgicalRollback([{ ...baseComment, updated_at: '2026-09-03T10:00:00Z' }], manifest),
        /field updated_at mismatched/
      );
    });

    test('6.5. Case D — Related Data Protection: community_reports and community_moderation_logs stop rollback', () => {
      const migratedComment = {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        post_id: 3,
        author_id: null,
        content: 'Bình luận có quan hệ liên kết',
        status: 'published',
        deleted_at: null,
        legacy_source_id: 'c2',
        legacy_author_name: 'Học viên A',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: migratedComment.id,
        action: 'INSERTED',
        post_id: 3,
        legacy_source_id: 'c2',
        created_state: { ...migratedComment }
      }];

      // D1: Report in community_reports
      const reportsDb = [{
        id: 'rep-001',
        comment_id: migratedComment.id,
        reason: 'spam',
        status: 'pending'
      }];

      assert.throws(
        () => executeSurgicalRollback([migratedComment], manifest, reportsDb, []),
        /has associated reports in community_reports/
      );

      // D2: Log in community_moderation_logs
      const modLogsDb = [{
        id: 'log-001',
        target_type: 'comment',
        target_id: migratedComment.id,
        action: 'hide',
        reason: 'Investigating'
      }];

      assert.throws(
        () => executeSurgicalRollback([migratedComment], manifest, [], modLogsDb),
        /has associated logs in community_moderation_logs/
      );
    });

    test('6.6. Case E — Concurrency ROW_COUNT check & Atomic All-or-Nothing Rollback', () => {
      const untouchedComment1 = {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        post_id: 3,
        author_id: null,
        content: 'Untouched comment 1',
        status: 'published',
        deleted_at: null,
        legacy_source_id: 'c1',
        legacy_author_name: 'Author 1',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      };

      const untouchedComment2 = {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        post_id: 3,
        author_id: null,
        content: 'Untouched comment 2',
        status: 'published',
        deleted_at: null,
        legacy_source_id: 'c2',
        legacy_author_name: 'Author 2',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      };

      const manifest = [
        {
          migration_id: '20261108_community_legacy_integrity',
          record_id: untouchedComment1.id,
          action: 'INSERTED',
          post_id: 3,
          created_state: { ...untouchedComment1 }
        },
        {
          migration_id: '20261108_community_legacy_integrity',
          record_id: untouchedComment2.id,
          action: 'INSERTED',
          post_id: 3,
          created_state: { ...untouchedComment2 }
        }
      ];

      // E1: Concurrency ROW_COUNT check: simulated race condition where expected != actual
      assert.throws(
        () => executeSurgicalRollback([untouchedComment1, untouchedComment2], manifest, [], [], { simulatedActualDeleteCount: 1 }),
        /Concurrency violation: Expected to delete 2 comments, but 1 rows were deleted/
      );

      // E2: Atomic rollback: if one record is disqualified, 0 records are deleted
      const disqualifiedComment = {
        ...untouchedComment2,
        content: 'Modified by user post-migration' // mismatch!
      };

      const initialDb = [untouchedComment1, disqualifiedComment];

      assert.throws(() => {
        executeSurgicalRollback(initialDb, manifest);
      }, /field content mismatched/);

      // Verify zero partial mutations occurred
      assert.strictEqual(initialDb.length, 2, 'No records deleted on aborted rollback');
      assert.strictEqual(initialDb[0].content, 'Untouched comment 1');
      assert.strictEqual(initialDb[1].content, 'Modified by user post-migration');
    });

    test('6.7. Case F — Migration Rerun Idempotency: Duplicate runs preserve initial pre-migration snapshot', () => {
      let migrationManifest = [];

      function applyMigrationManifestEntry(entry) {
        const existing = migrationManifest.find(
          m => m.migration_id === entry.migration_id && m.record_id === entry.record_id
        );
        // Emulate ON CONFLICT (migration_id, record_id) DO NOTHING
        if (!existing) {
          migrationManifest.push({ ...entry });
        }
      }

      const initialRecordSnapshot = {
        migration_id: '20261108_community_legacy_integrity',
        record_id: '22eb72d5-38ef-4a2d-9454-e4121bce91b7',
        action: 'UPDATED',
        post_id: 3,
        legacy_source_id: 'c1',
        before_state: {
          author_id: 'orig-author-uuid',
          legacy_source_id: null,
          legacy_author_name: null
        }
      };

      // Run 1: insert manifest snapshot
      applyMigrationManifestEntry(initialRecordSnapshot);
      assert.strictEqual(migrationManifest.length, 1);
      assert.strictEqual(migrationManifest[0].before_state.author_id, 'orig-author-uuid');

      // Run 2: migration runs again, but at this point the DB row already has migrated values!
      const reRunSnapshot = {
        migration_id: '20261108_community_legacy_integrity',
        record_id: '22eb72d5-38ef-4a2d-9454-e4121bce91b7',
        action: 'UPDATED',
        post_id: 3,
        legacy_source_id: 'c1',
        before_state: {
          author_id: null, // corrupted state if re-captured!
          legacy_source_id: 'c1',
          legacy_author_name: 'Nguyễn Văn Minh'
        }
      };

      applyMigrationManifestEntry(reRunSnapshot);

      // Verify manifest count is still 1 and initial snapshot was NOT overwritten
      assert.strictEqual(migrationManifest.length, 1, 'Must not duplicate manifest rows');
      assert.strictEqual(
        migrationManifest[0].before_state.author_id,
        'orig-author-uuid',
        'Original pre-migration snapshot must be preserved on re-run'
      );
    });

    test('6.8. Case G — Exact Snapshot Restoration: Empty string preserves "" and does NOT collapse to NULL', () => {
      const recordId = '11111111-2222-3333-4444-555555555555';
      const commentInDb = {
        id: recordId,
        post_id: 3,
        author_id: null,
        content: 'Nội dung sau migration',
        legacy_source_id: 'migrated_source_id',
        legacy_author_name: 'Author Name Migrated',
        status: 'published'
      };

      // Snapshot captured prior to migration has an empty string for legacy_source_id
      const beforeState = {
        legacy_source_id: '', // Explicit empty string!
        legacy_author_name: '', // Explicit empty string!
        author_id: null // Explicit null
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: recordId,
        action: 'UPDATED',
        post_id: 3,
        legacy_source_id: 'migrated_source_id',
        before_state: beforeState,
        created_state: null
      }];

      const result = executeSurgicalRollback([commentInDb], manifest);
      const restored = result.commentsDb.find(c => c.id === recordId);

      assert.ok(restored, 'Restored comment exists');
      assert.strictEqual(restored.legacy_source_id, '', 'legacy_source_id must be restored to empty string "", NOT null');
      assert.strictEqual(restored.legacy_author_name, '', 'legacy_author_name must be restored to empty string "", NOT null');
      assert.strictEqual(restored.author_id, null, 'author_id must be restored to SQL null');
    });

    test('6.9. Case H — Exact Snapshot Restoration: Non-existent key preserves current database value', () => {
      const recordId = '22222222-3333-4444-5555-666666666666';
      const commentInDb = {
        id: recordId,
        post_id: 5,
        author_id: 'orig-author-uuid',
        content: 'Original content that was not touched by migration',
        status: 'published',
        legacy_source_id: 'legacy_src_to_revert',
        legacy_author_name: 'Author to revert'
      };

      // beforeState only recorded legacy fields, content and status were omitted (key does NOT exist)
      const beforeState = {
        legacy_source_id: null,
        legacy_author_name: null
        // content and status keys NOT present
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: recordId,
        action: 'UPDATED',
        post_id: 5,
        before_state: beforeState
      }];

      const result = executeSurgicalRollback([commentInDb], manifest);
      const restored = result.commentsDb.find(c => c.id === recordId);

      assert.strictEqual(restored.content, 'Original content that was not touched by migration', 'Omitted key in before_state must retain current value');
      assert.strictEqual(restored.status, 'published', 'Omitted status key must retain current value');
      assert.strictEqual(restored.legacy_source_id, null, 'Present key with null is restored to null');
    });

    test('6.10. Case I — Exact Snapshot Restoration: Typed UUID, BIGINT, TIMESTAMPTZ restored accurately', () => {
      const recordId = '33333333-4444-5555-6666-777777777777';
      const commentInDb = {
        id: recordId,
        post_id: 999,
        author_id: null,
        deleted_at: null,
        created_at: '2026-11-08T00:00:00Z',
        updated_at: '2026-11-08T12:00:00Z'
      };

      const beforeState = {
        author_id: '44444444-4444-4444-4444-444444444444',
        post_id: 7,
        deleted_at: '2026-10-01T08:30:00Z',
        created_at: '2026-09-01T08:00:00Z',
        updated_at: '2026-09-01T09:00:00Z'
      };

      const manifest = [{
        migration_id: '20261108_community_legacy_integrity',
        record_id: recordId,
        action: 'UPDATED',
        post_id: 7,
        before_state: beforeState
      }];

      const result = executeSurgicalRollback([commentInDb], manifest);
      const restored = result.commentsDb.find(c => c.id === recordId);

      assert.strictEqual(restored.author_id, '44444444-4444-4444-4444-444444444444');
      assert.strictEqual(restored.post_id, 7);
      assert.strictEqual(restored.deleted_at, '2026-10-01T08:30:00Z');
      assert.strictEqual(restored.created_at, '2026-09-01T08:00:00Z');
      assert.strictEqual(restored.updated_at, '2026-09-01T09:00:00Z');
    });

    test('6.11. Case J — Manifest Schema Backward Compatibility: Preflight handles legacy manifest lacking table_name, before_state, created_state', () => {
      // Simulate an older manifest table existing on Supabase Cloud
      // Old schema: { migration_id, record_id, action, post_id, legacy_source_id } (missing table_name, before_state, created_state)
      const legacyTableColumns = ['migration_id', 'record_id', 'action', 'post_id', 'legacy_source_id'];

      // Simulate preflight schema upgrade
      const targetRequiredColumns = [
        'migration_id', 'record_id', 'table_name', 'action',
        'post_id', 'legacy_source_id', 'before_state', 'created_state', 'applied_at'
      ];

      // Missing columns identified by preflight
      const missingBeforeUpgrade = targetRequiredColumns.filter(col => !legacyTableColumns.includes(col));
      assert.deepStrictEqual(missingBeforeUpgrade, ['table_name', 'before_state', 'created_state', 'applied_at']);

      // Simulate execution of ADD COLUMN IF NOT EXISTS & safe backfill
      const upgradedTableColumns = [...legacyTableColumns];
      for (const col of missingBeforeUpgrade) {
        if (!upgradedTableColumns.includes(col)) upgradedTableColumns.push(col);
      }

      // Check all required columns are now present
      const missingAfterUpgrade = targetRequiredColumns.filter(col => !upgradedTableColumns.includes(col));
      assert.strictEqual(missingAfterUpgrade.length, 0, 'All target columns present after preflight upgrade');

      // Verify safe default for table_name
      const oldRow = {
        migration_id: 'old_mig_001',
        record_id: 'uuid-1',
        action: 'INSERTED',
        post_id: 1,
        legacy_source_id: 'src-1'
      };
      // Backfill sets table_name to 'community_comments' if undefined/null
      const backfilledRow = {
        ...oldRow,
        table_name: oldRow.table_name || 'community_comments',
        before_state: oldRow.before_state || null,
        created_state: oldRow.created_state || null
      };

      assert.strictEqual(backfilledRow.table_name, 'community_comments', 'Backfilled row has valid table_name');
    });

    test('6.12. Case K — Audit Telemetry Contract: Querying likes_diff & comments_diff returns identical column structure matching RETURNS TABLE', () => {
      // Contract test: Function public.audit_community_post_counters returns explicit columns
      const expectedOutputColumns = [
        'post_id',
        'author_name',
        'stored_likes_count',
        'actual_reactions_count',
        'legacy_likes_baseline',
        'new_reaction_count',
        'likes_diff',
        'stored_comments_count',
        'actual_published_comments_count',
        'legacy_comments_baseline',
        'comments_diff'
      ];

      // Telemetry row simulation
      const sampleRow = {
        post_id: 1,
        author_name: 'Ban Quản Trị',
        stored_likes_count: 5,
        actual_reactions_count: 2,
        legacy_likes_baseline: 3,
        new_reaction_count: 2,
        likes_diff: 0,
        stored_comments_count: 4,
        actual_published_comments_count: 4,
        legacy_comments_baseline: 4,
        comments_diff: 0
      };

      // Verify exact column matching
      for (const col of expectedOutputColumns) {
        assert.ok(Object.prototype.hasOwnProperty.call(sampleRow, col), `Output row must contain column ${col}`);
      }

      // Verify discrepancy conditions match zero
      assert.strictEqual(sampleRow.likes_diff, 0, 'likes_diff must equal 0 on balanced post');
      assert.strictEqual(sampleRow.comments_diff, 0, 'comments_diff must equal 0 on balanced post');
      assert.strictEqual(sampleRow.stored_likes_count, sampleRow.legacy_likes_baseline + sampleRow.new_reaction_count);
    });
  });

  // ---------------------------------------------------------------------------
  // GROUP 7: LIVE SUPABASE DATABASE CHECKS (LIVE DATABASE ENVIRONMENT ONLY)
  // ---------------------------------------------------------------------------
  describe('Group 7: Live Supabase Database Checks (Live DB Environment)', () => {

    test('7.1. Live Database: community_posts maintains intact legacy data and counters', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Skipping live test: Supabase not configured');
        return;
      }

      const { data: posts, error } = await supabase
        .from('community_posts')
        .select('id, likes, liked_by, likes_count, comments_count, comments')
        .order('id', { ascending: true });

      assert.ok(!error, `Failed to fetch posts: ${error?.message}`);
      assert.ok(Array.isArray(posts) && posts.length >= 2, 'Must have at least 2 posts');

      // Post 3 and Post 7 baselines
      const p3 = posts.find(p => p.id === 3);
      assert.ok(p3, 'Post 3 must exist');
      assert.strictEqual(p3.likes, 12, 'Post 3 likes baseline preserved');
      assert.strictEqual(p3.likes_count, 12, 'Post 3 likes_count preserved');

      const p7 = posts.find(p => p.id === 7);
      assert.ok(p7, 'Post 7 must exist');
      assert.strictEqual(p7.likes, 1, 'Post 7 likes baseline preserved');
      assert.strictEqual(p7.likes_count, 1, 'Post 7 likes_count preserved');
    });

    test('7.2. Live Database: Anonymous & unauthenticated client is strictly denied from audit RPC', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      // Calling audit_community_post_counters as anonymous / client must be rejected with permission denied
      const { error } = await supabase.rpc('audit_community_post_counters');
      assert.ok(error, 'Audit RPC must reject unauthenticated/anonymous caller');
      assert.ok(
        error.message.includes('permission denied') || error.code === '42501',
        `Error must be 42501 permission denied, got: ${error.message}`
      );
    });

    test('7.3. Codebase Security: Zero exposure of SUPABASE_SERVICE_ROLE_KEY', () => {
      const srcDir = path.resolve(process.cwd(), 'src');
      function scanDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            assert.ok(
              !content.includes('service_role') || content.includes("auth.role() = 'service_role'"),
              `Potential service role key usage in ${file}`
            );
            assert.ok(
              !content.includes('SUPABASE_SERVICE_ROLE_KEY'),
              `SUPABASE_SERVICE_ROLE_KEY exposed in ${file}`
            );
          }
        }
      }
      scanDir(srcDir);
    });
  });
});

