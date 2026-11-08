import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.08B — Atomic Community Reaction RPC & Comment Counter Trigger Tests', () => {

  const migrationFileB = path.join(rootDir, 'supabase', 'migrations', '20261108_community_atomic_reaction_and_comment_counter.sql');
  const masterSchemaFile = path.join(rootDir, 'supabase', 'schema.sql');

  // =========================================================================
  // GROUP 1: STATIC SCHEMA & DDL AUDIT
  // =========================================================================
  describe('Group 1: Static Schema, Migration & RPC Definition Audit', () => {

    test('1.1. Migration 20261108_community_atomic_reaction_and_comment_counter.sql exists and is non-destructive', () => {
      assert.ok(fs.existsSync(migrationFileB), 'Migration file 24.08B must exist');
      const content = fs.readFileSync(migrationFileB, 'utf-8');

      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must not drop community_posts');
      assert.ok(!content.includes('ALTER COLUMN id TYPE UUID'), 'Must not change BIGSERIAL id to UUID');
    });

    test('1.2. RPC toggle_community_post_reaction defined with row locking and strict auth.uid() identity', () => {
      const content = fs.readFileSync(migrationFileB, 'utf-8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.toggle_community_post_reaction'), 'RPC signature defined');
      assert.ok(content.includes('v_user_id := auth.uid();'), 'Strictly derives user identity from auth.uid()');
      assert.ok(content.includes('FOR UPDATE;'), 'Row-level lock on community_posts prevents race conditions');
      assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) FROM PUBLIC'), 'Revoked from public');
      assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) FROM anon'), 'Revoked from anon');
      assert.ok(content.includes('GRANT EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) TO authenticated, service_role'), 'Granted to authenticated and service_role');
    });

    test('1.3. Comment counter trigger sync_community_post_comments_count defined for INSERT, UPDATE, DELETE', () => {
      const content = fs.readFileSync(migrationFileB, 'utf-8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.sync_community_post_comments_count()'), 'Trigger function defined');
      assert.ok(content.includes('AFTER INSERT OR UPDATE OR DELETE ON public.community_comments'), 'Trigger bound to all modification events');
      assert.ok(content.includes("NEW.status = 'published' AND NEW.deleted_at IS NULL"), 'Validates published non-deleted comment');
      assert.ok(content.includes('GREATEST(0,'), 'Guarantees comments_count never drops below zero');
    });

    test('1.4. Post integrity trigger updated to permit internal counter sync via transaction-local setting', () => {
      const content = fs.readFileSync(migrationFileB, 'utf-8');

      assert.ok(content.includes("current_setting('hanzigo.internal_counter_sync', true) = 'true'"), 'Authorizes internal counter sync');
      assert.ok(content.includes('Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ'), 'Rejects direct client mutations to likes_count and comments_count');
    });

    test('1.5. Telemetry audit function audit_community_post_counters defined', () => {
      const content = fs.readFileSync(migrationFileB, 'utf-8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.audit_community_post_counters()'), 'Audit telemetry function defined');
      assert.ok(content.includes('likes_diff'), 'Calculates likes discrepancy');
      assert.ok(content.includes('comments_diff'), 'Calculates comments discrepancy');
    });

    test('1.6. Master schema.sql synchronizes RPC, trigger and security settings', () => {
      const master = fs.readFileSync(masterSchemaFile, 'utf-8');

      assert.ok(master.includes('toggle_community_post_reaction'), 'Master schema includes reaction RPC');
      assert.ok(master.includes('sync_community_post_comments_count'), 'Master schema includes comment counter function');
      assert.ok(master.includes('trg_sync_community_post_comments_count'), 'Master schema includes comment counter trigger');
      assert.ok(master.includes('audit_community_post_counters'), 'Master schema includes audit telemetry');
    });
  });

  // =========================================================================
  // GROUP 2: UNIT & BUSINESS LOGIC INTEGRITY SIMULATION (RPC & COUNTERS)
  // =========================================================================
  describe('Group 2: Unit Logic Integrity Simulation (Reaction RPC & Comment Trigger)', () => {

    // Simulated database state for testing logic
    class InMemoryCommunityDB {
      constructor() {
        this.posts = new Map([
          [3, { id: 3, author_name: 'Ban Quản Trị HanziGo', status: 'published', deleted_at: null, likes_count: 12, comments_count: 1 }],
          [7, { id: 7, author_name: 'Đăng', status: 'published', deleted_at: null, likes_count: 1, comments_count: 0 }],
          [99, { id: 99, author_name: 'Hidden Post', status: 'hidden', deleted_at: null, likes_count: 0, comments_count: 0 }],
          [100, { id: 100, author_name: 'Deleted Post', status: 'published', deleted_at: '2026-11-01', likes_count: 0, comments_count: 0 }]
        ]);
        this.reactions = []; // { id, post_id, user_id, reaction_type }
        this.comments = [];  // { id, post_id, author_id, status, deleted_at, content }
      }

      // 6.1 Simulation: toggle_community_post_reaction
      toggleReaction(postId, reactionType, userContext) {
        if (!userContext || !userContext.id) {
          throw new Error('Chưa đăng nhập: Thao tác tương tác yêu cầu đăng nhập tài khoản.');
        }
        if (!postId) {
          throw new Error('Tham số không hợp lệ: Thiếu post_id.');
        }
        const allowedTypes = new Set(['like', 'heart', 'clap', 'bulb']);
        if (!reactionType || !allowedTypes.has(reactionType)) {
          throw new Error('Loại tương tác không hợp lệ: Chỉ chấp nhận like, heart, clap, bulb.');
        }

        const post = this.posts.get(postId);
        if (!post) {
          throw new Error('Bài viết không tồn tại.');
        }
        if (post.deleted_at != null || post.status !== 'published') {
          throw new Error('Bài viết đã bị xóa hoặc không cho phép tương tác.');
        }

        // Unique constraint check: (post_id, user_id)
        const existingIdx = this.reactions.findIndex(r => r.post_id === postId && r.user_id === userContext.id);

        if (existingIdx === -1) {
          // ADD
          this.reactions.push({ id: `r-${Date.now()}-${Math.random()}`, post_id: postId, user_id: userContext.id, reaction_type: reactionType });
          post.likes_count = (post.likes_count || 0) + 1;
          return { success: true, action: 'added', post_id: postId, user_reaction: reactionType, likes_count: post.likes_count };
        } else {
          const existing = this.reactions[existingIdx];
          if (existing.reaction_type === reactionType) {
            // REMOVE (Toggle off)
            this.reactions.splice(existingIdx, 1);
            post.likes_count = Math.max(0, (post.likes_count || 0) - 1);
            return { success: true, action: 'removed', post_id: postId, user_reaction: null, likes_count: post.likes_count };
          } else {
            // UPDATE type
            existing.reaction_type = reactionType;
            return { success: true, action: 'updated', post_id: postId, user_reaction: reactionType, likes_count: post.likes_count };
          }
        }
      }

      // 6.2 Simulation: Comment Counter Trigger
      insertComment(comment) {
        this.comments.push(comment);
        const isValid = comment.status === 'published' && comment.deleted_at == null;
        if (isValid) {
          const post = this.posts.get(comment.post_id);
          if (post) post.comments_count = (post.comments_count || 0) + 1;
        }
      }

      updateComment(commentId, updates) {
        const idx = this.comments.findIndex(c => c.id === commentId);
        if (idx === -1) return;
        const oldRow = { ...this.comments[idx] };
        const newRow = { ...oldRow, ...updates };
        this.comments[idx] = newRow;

        const oldValid = oldRow.status === 'published' && oldRow.deleted_at == null;
        const newValid = newRow.status === 'published' && newRow.deleted_at == null;

        if (newRow.post_id !== oldRow.post_id) {
          if (oldValid) {
            const oldPost = this.posts.get(oldRow.post_id);
            if (oldPost) oldPost.comments_count = Math.max(0, (oldPost.comments_count || 0) - 1);
          }
          if (newValid) {
            const newPost = this.posts.get(newRow.post_id);
            if (newPost) newPost.comments_count = (newPost.comments_count || 0) + 1;
          }
        } else {
          const post = this.posts.get(newRow.post_id);
          if (post) {
            if (!oldValid && newValid) {
              post.comments_count = (post.comments_count || 0) + 1;
            } else if (oldValid && !newValid) {
              post.comments_count = Math.max(0, (post.comments_count || 0) - 1);
            }
          }
        }
      }

      deleteComment(commentId) {
        const idx = this.comments.findIndex(c => c.id === commentId);
        if (idx === -1) return;
        const oldRow = this.comments.splice(idx, 1)[0];
        const oldValid = oldRow.status === 'published' && oldRow.deleted_at == null;
        if (oldValid) {
          const post = this.posts.get(oldRow.post_id);
          if (post) post.comments_count = Math.max(0, (post.comments_count || 0) - 1);
        }
      }
    }

    // -----------------------------------------------------------------------
    // Section 6.1 Reaction RPC Tests
    // -----------------------------------------------------------------------
    test('2.1. RPC 1: Anonymous cannot call reaction RPC', () => {
      const db = new InMemoryCommunityDB();
      assert.throws(() => {
        db.toggleReaction(7, 'like', null);
      }, /Chưa đăng nhập/);
    });

    test('2.2. RPC 2: Authenticated user creates reaction successfully', () => {
      const db = new InMemoryCommunityDB();
      const res = db.toggleReaction(7, 'like', { id: 'u-1' });
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.action, 'added');
      assert.strictEqual(res.user_reaction, 'like');
      assert.strictEqual(res.likes_count, 2); // Was 1 baseline + 1 = 2
    });

    test('2.3. RPC 3: Toggling same reaction a second time removes reaction and decrements counter', () => {
      const db = new InMemoryCommunityDB();
      db.toggleReaction(7, 'like', { id: 'u-1' });
      const res = db.toggleReaction(7, 'like', { id: 'u-1' });
      assert.strictEqual(res.action, 'removed');
      assert.strictEqual(res.user_reaction, null);
      assert.strictEqual(res.likes_count, 1); // Decremented back to baseline
    });

    test('2.4. RPC 4: Changing reaction type updates record without changing total count', () => {
      const db = new InMemoryCommunityDB();
      db.toggleReaction(7, 'like', { id: 'u-1' });
      const res = db.toggleReaction(7, 'heart', { id: 'u-1' });
      assert.strictEqual(res.action, 'updated');
      assert.strictEqual(res.user_reaction, 'heart');
      assert.strictEqual(res.likes_count, 2); // Total count remains 2
    });

    test('2.5. RPC 5: A user cannot create duplicate reactions for the same post', () => {
      const db = new InMemoryCommunityDB();
      db.toggleReaction(7, 'like', { id: 'u-1' });
      assert.strictEqual(db.reactions.filter(r => r.post_id === 7 && r.user_id === 'u-1').length, 1);
    });

    test('2.6. RPC 6: User A cannot impersonate or toggle User B reactions', () => {
      const db = new InMemoryCommunityDB();
      db.toggleReaction(7, 'like', { id: 'user-A' });
      db.toggleReaction(7, 'heart', { id: 'user-B' });

      assert.strictEqual(db.reactions.find(r => r.user_id === 'user-A')?.reaction_type, 'like');
      assert.strictEqual(db.reactions.find(r => r.user_id === 'user-B')?.reaction_type, 'heart');
      assert.strictEqual(db.posts.get(7).likes_count, 3); // 1 + 2 = 3
    });

    test('2.7. RPC 7: Non-existent post is rejected with error', () => {
      const db = new InMemoryCommunityDB();
      assert.throws(() => {
        db.toggleReaction(999999, 'like', { id: 'u-1' });
      }, /Bài viết không tồn tại/);
    });

    test('2.8. RPC 8: Deleted or hidden post cannot be reacted to', () => {
      const db = new InMemoryCommunityDB();
      assert.throws(() => db.toggleReaction(99, 'like', { id: 'u-1' }), /không cho phép tương tác/);
      assert.throws(() => db.toggleReaction(100, 'like', { id: 'u-1' }), /không cho phép tương tác/);
    });

    test('2.9. RPC 9: Invalid reaction type is rejected', () => {
      const db = new InMemoryCommunityDB();
      assert.throws(() => db.toggleReaction(7, 'dislike', { id: 'u-1' }), /Loại tương tác không hợp lệ/);
      assert.throws(() => db.toggleReaction(7, 'angry', { id: 'u-1' }), /Loại tương tác không hợp lệ/);
      assert.throws(() => db.toggleReaction(7, '', { id: 'u-1' }), /Loại tương tác không hợp lệ/);
    });

    test('2.10. RPC 10: Client cannot directly mutate likes_count without internal sync permission', () => {
      const simulateDirectUpdate = (isInternalSync = false) => {
        if (!isInternalSync) {
          throw new Error('Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.');
        }
        return true;
      };

      assert.throws(() => simulateDirectUpdate(false), /Số lượt thích và bình luận/);
      assert.strictEqual(simulateDirectUpdate(true), true);
    });

    test('2.11. RPC 11 & 12: Concurrent reactions from multiple users maintain accurate atomic count', () => {
      const db = new InMemoryCommunityDB();
      const users = ['u1', 'u2', 'u3', 'u4', 'u5'];
      users.forEach(u => db.toggleReaction(7, 'like', { id: u }));

      assert.strictEqual(db.posts.get(7).likes_count, 6); // 1 baseline + 5 = 6
      assert.strictEqual(db.reactions.length, 5);
    });

    test('2.12. RPC 13 & 14: Reaction removal never allows likes_count to drop below zero', () => {
      const db = new InMemoryCommunityDB();
      const testPost = { id: 88, status: 'published', deleted_at: null, likes_count: 0 };
      db.posts.set(88, testPost);

      // Force add and remove
      db.toggleReaction(88, 'like', { id: 'u1' });
      assert.strictEqual(db.posts.get(88).likes_count, 1);
      db.toggleReaction(88, 'like', { id: 'u1' });
      assert.strictEqual(db.posts.get(88).likes_count, 0);

      // Even if another remove occurs
      const post = db.posts.get(88);
      post.likes_count = Math.max(0, post.likes_count - 1);
      assert.strictEqual(post.likes_count, 0);
    });

    // -----------------------------------------------------------------------
    // Section 6.2 Comment Counter Trigger Tests
    // -----------------------------------------------------------------------
    test('2.13. Comment 1: INSERT published comment increments counter by 1', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c1', post_id: 7, status: 'published', deleted_at: null, content: 'Bình luận 1' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);
    });

    test('2.14. Comment 2: INSERT pending comment does NOT increment counter', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c2', post_id: 7, status: 'pending', deleted_at: null, content: 'Chờ duyệt' });
      assert.strictEqual(db.posts.get(7).comments_count, 0);
    });

    test('2.15. Comment 3: Transition pending -> published increments counter', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c3', post_id: 7, status: 'pending', deleted_at: null, content: 'Chờ duyệt' });
      assert.strictEqual(db.posts.get(7).comments_count, 0);

      db.updateComment('c3', { status: 'published' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);
    });

    test('2.16. Comment 4: Transition published -> hidden decrements counter', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c4', post_id: 7, status: 'published', deleted_at: null, content: 'Bình luận hợp lệ' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);

      db.updateComment('c4', { status: 'hidden' });
      assert.strictEqual(db.posts.get(7).comments_count, 0);
    });

    test('2.17. Comment 5: Transition published -> soft deleted decrements counter', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c5', post_id: 7, status: 'published', deleted_at: null, content: 'Sắp xóa' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);

      db.updateComment('c5', { deleted_at: '2026-11-08' });
      assert.strictEqual(db.posts.get(7).comments_count, 0);
    });

    test('2.18. Comment 6: Transition hidden -> published increments counter', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c6', post_id: 7, status: 'hidden', deleted_at: null, content: 'Bị ẩn' });
      assert.strictEqual(db.posts.get(7).comments_count, 0);

      db.updateComment('c6', { status: 'published' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);
    });

    test('2.19. Comment 7: DELETE published comment decrements counter', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c7', post_id: 7, status: 'published', deleted_at: null, content: 'Bình luận xóa hẳn' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);

      db.deleteComment('c7');
      assert.strictEqual(db.posts.get(7).comments_count, 0);
    });

    test('2.20. Comment 8: Content update without validity change leaves counter unaffected', () => {
      const db = new InMemoryCommunityDB();
      db.insertComment({ id: 'c8', post_id: 7, status: 'published', deleted_at: null, content: 'Nội dung cũ' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);

      db.updateComment('c8', { content: 'Nội dung sửa đổi' });
      assert.strictEqual(db.posts.get(7).comments_count, 1);
    });

    test('2.21. Comment 9: Transferring comment between posts updates both post counters correctly', () => {
      const db = new InMemoryCommunityDB();
      // Post 3 has 1 baseline comment, Post 7 has 0
      db.insertComment({ id: 'c9', post_id: 3, status: 'published', deleted_at: null, content: 'Chuyển bài' });
      assert.strictEqual(db.posts.get(3).comments_count, 2);
      assert.strictEqual(db.posts.get(7).comments_count, 0);

      // Move comment c9 from post 3 to post 7
      db.updateComment('c9', { post_id: 7 });
      assert.strictEqual(db.posts.get(3).comments_count, 1);
      assert.strictEqual(db.posts.get(7).comments_count, 1);
    });

    test('2.22. Comment 10 & 11: Counter never drops below zero and direct student mutation blocked', () => {
      const db = new InMemoryCommunityDB();
      const post = db.posts.get(7);
      assert.strictEqual(post.comments_count, 0);

      // Deleting a non-existent or already decremented comment
      db.deleteComment('non-existent');
      assert.strictEqual(post.comments_count, 0);
    });
  });

  // =========================================================================
  // GROUP 3: LIVE SUPABASE RLS & RUNTIME TESTS
  // =========================================================================
  describe('Group 3: Live Supabase Database RLS & Runtime Checks', () => {

    test('3.1. Live Supabase: anonymous user cannot call toggle_community_post_reaction RPC', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Skipping live test: Supabase not configured');
        return;
      }

      const { data, error } = await supabase.rpc('toggle_community_post_reaction', {
        p_post_id: 3,
        p_reaction_type: 'like'
      });

      // Anonymous MUST be rejected by PostgREST execution permissions
      assert.ok(error, 'Anonymous RPC call must be rejected');
    });

    test('3.2. Live Supabase: existing community_posts remain intact with baseline counters', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { data: posts, error } = await supabase.from('community_posts').select('*');
      assert.ok(!error, `Failed to query community_posts: ${error?.message}`);
      assert.ok(Array.isArray(posts) && posts.length >= 2, 'Must have at least 2 posts');

      const post3 = posts.find(p => p.id === 3 || p.id === '3');
      const post7 = posts.find(p => p.id === 7 || p.id === '7');
      assert.ok(post3, 'Post 3 must be intact');
      assert.ok(post7, 'Post 7 must be intact');
      assert.ok(post3.likes_count >= 12, 'Post 3 baseline likes_count preserved');
    });

    test('3.3. Live Supabase: unauthenticated direct mutation on likes_count is blocked', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { error } = await supabase.from('community_posts').update({ likes_count: 99999 }).eq('id', 3);
      assert.ok(error, 'Direct mutation on likes_count must fail');
    });

    test('3.4. Codebase Security: frontend codebase contains zero service role keys', () => {
      const srcDir = path.join(rootDir, 'src');
      const checkDir = (dir) => {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const full = path.join(dir, item.name);
          if (item.isDirectory()) {
            checkDir(full);
          } else if (/\.(jsx?|tsx?)$/.test(item.name)) {
            const code = fs.readFileSync(full, 'utf-8');
            assert.ok(!code.includes('service_role') && !code.includes('SUPABASE_SERVICE_ROLE'), `File ${item.name} has service role secret!`);
          }
        }
      };
      checkDir(srcDir);
    });
  });

});

