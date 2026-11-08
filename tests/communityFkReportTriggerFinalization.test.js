import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.08A.2 — Community FK, Report & Trigger Finalization Verification Tests', () => {

  const migrationFileA2 = path.join(rootDir, 'supabase', 'migrations', '20261108_community_fk_report_trigger_finalization.sql');
  const masterSchemaFile = path.join(rootDir, 'supabase', 'schema.sql');

  // =========================================================================
  // GROUP 1: STATIC CODE & MIGRATION DEFINITIONS AUDIT
  // =========================================================================
  describe('Group 1: Static Migration & Schema Integrity Audit', () => {

    test('1.1. Migration 20261108_community_fk_report_trigger_finalization.sql exists and is non-destructive', () => {
      assert.ok(fs.existsSync(migrationFileA2), 'Finalization migration must exist');
      const content = fs.readFileSync(migrationFileA2, 'utf-8');

      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must not drop community_posts');
      assert.ok(!content.includes('ALTER COLUMN id TYPE UUID'), 'Must not change BIGSERIAL id to UUID');
    });

    test('1.2. FK Nullability compatibility: explicitly drops NOT NULL for ON DELETE SET NULL foreign keys', () => {
      const content = fs.readFileSync(migrationFileA2, 'utf-8');

      assert.ok(content.includes('ALTER TABLE public.community_moderation_logs ALTER COLUMN admin_id DROP NOT NULL;'), 'admin_id must drop NOT NULL');
      assert.ok(content.includes('ALTER TABLE public.community_reports ALTER COLUMN reporter_id DROP NOT NULL;'), 'reporter_id must drop NOT NULL');
      assert.ok(content.includes('ALTER TABLE public.community_reports ALTER COLUMN post_id DROP NOT NULL;'), 'post_id must drop NOT NULL');
      assert.ok(content.includes('ALTER TABLE public.community_reports ALTER COLUMN comment_id DROP NOT NULL;'), 'comment_id must drop NOT NULL');
      assert.ok(content.includes('ALTER TABLE public.community_comments ALTER COLUMN author_id DROP NOT NULL;'), 'author_id in comments must drop NOT NULL');
    });

    test('1.3. Report snapshot & resilient XOR constraint: preserves audit history after target deletion', () => {
      const content = fs.readFileSync(migrationFileA2, 'utf-8');

      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS target_type'), 'target_type column added');
      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS target_id'), 'target_id column added');
      assert.ok(content.includes('DROP CONSTRAINT IF EXISTS chk_report_target_xor'), 'old rigid XOR constraint dropped');
      assert.ok(content.includes('chk_community_reports_target_valid'), 'resilient target check constraint defined');
      assert.ok(content.includes('(post_id IS NULL AND comment_id IS NULL AND target_id IS NOT NULL)'), 'allows preserved snapshot state when target deleted');
      assert.ok(content.includes('sync_community_report_target_snapshot()'), 'trigger function for target snapshot defined');
      assert.ok(content.includes('trg_sync_community_report_target'), 'trigger bound before insert on community_reports');
    });

    test('1.4. Post integrity trigger: protects author metadata, timestamps, moderation and statistics', () => {
      const content = fs.readFileSync(migrationFileA2, 'utf-8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.enforce_community_post_integrity()'), 'enforce_community_post_integrity defined');
      assert.ok(content.includes('NEW.author_name IS DISTINCT FROM OLD.author_name'), 'protects author_name from direct update');
      assert.ok(content.includes('NEW.author_avatar IS DISTINCT FROM OLD.author_avatar'), 'protects author_avatar from direct update');
      assert.ok(content.includes('NEW.author_level IS DISTINCT FROM OLD.author_level'), 'protects author_level from direct update');
      assert.ok(content.includes('NEW.created_at IS DISTINCT FROM OLD.created_at'), 'protects created_at from update');
      assert.ok(content.includes('NEW.status IS DISTINCT FROM OLD.status'), 'protects status from unauthorized update');
      assert.ok(content.includes('NEW.is_pinned IS DISTINCT FROM OLD.is_pinned'), 'protects is_pinned from unauthorized update');
      assert.ok(content.includes('NEW.deleted_at IS DISTINCT FROM OLD.deleted_at'), 'protects deleted_at from direct update');
      assert.ok(content.includes('NEW.likes_count IS DISTINCT FROM OLD.likes_count'), 'protects likes_count from direct update');
      assert.ok(content.includes('NEW.comments_count IS DISTINCT FROM OLD.comments_count'), 'protects comments_count from direct update');
      assert.ok(content.includes('FROM public.profiles'), 'auto-syncs author profile on insert');
    });

    test('1.5. Comment integrity trigger: protects author_id, post_id, created_at, status and deleted_at', () => {
      const content = fs.readFileSync(migrationFileA2, 'utf-8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.enforce_community_comment_integrity()'), 'enforce_community_comment_integrity defined');
      assert.ok(content.includes('NEW.author_id IS DISTINCT FROM OLD.author_id'), 'protects comment author_id');
      assert.ok(content.includes('NEW.post_id IS DISTINCT FROM OLD.post_id'), 'protects comment post_id');
      assert.ok(content.includes('NEW.created_at IS DISTINCT FROM OLD.created_at'), 'protects comment created_at');
      assert.ok(content.includes('NEW.status IS DISTINCT FROM OLD.status'), 'protects comment status');
      assert.ok(content.includes('NEW.deleted_at IS DISTINCT FROM OLD.deleted_at'), 'protects comment deleted_at');
    });

    test('1.6. SECURITY DEFINER audit & execute permissions: public.is_admin() hardened and granted', () => {
      const content = fs.readFileSync(migrationFileA2, 'utf-8');

      assert.ok(content.includes('SET search_path = public, pg_temp'), 'search_path hardened to public, pg_temp');
      assert.ok(content.includes("role = 'admin' AND status = 'active'"), 'strictly checks both admin role and active status');
      assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC'), 'revokes public execution');
      assert.ok(content.includes('GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role'), 'grants execute to specified roles');
    });

    test('1.7. Master schema.sql synchronizes all finalization elements', () => {
      const master = fs.readFileSync(masterSchemaFile, 'utf-8');

      assert.ok(master.includes('chk_community_reports_target_valid'), 'Master schema contains chk_community_reports_target_valid');
      assert.ok(master.includes('sync_community_report_target_snapshot'), 'Master schema contains snapshot function');
      assert.ok(master.includes('trg_sync_community_report_target'), 'Master schema contains snapshot trigger');
      assert.ok(master.includes('trg_enforce_community_post_integrity'), 'Master schema contains post integrity trigger');
      assert.ok(master.includes('trg_enforce_community_comment_integrity'), 'Master schema contains comment integrity trigger');
    });
  });

  // =========================================================================
  // GROUP 2: UNIT & BUSINESS LOGIC INTEGRITY TESTS
  // =========================================================================
  describe('Group 2: Unit Logic Integrity & Constraint Checks', () => {

    test('2.1. Resilient XOR target validation: validates all allowed and disallowed states', () => {
      const validateTargetConstraint = ({ postId, commentId, targetId }) => {
        const hasPost = postId != null;
        const hasComment = commentId != null;
        const hasTargetSnapshot = targetId != null && targetId !== '';

        const activePostOnly = hasPost && !hasComment;
        const activeCommentOnly = !hasPost && hasComment;
        const historicalPreserved = !hasPost && !hasComment && hasTargetSnapshot;

        return activePostOnly || activeCommentOnly || historicalPreserved;
      };

      // Active report on post -> VALID
      assert.strictEqual(validateTargetConstraint({ postId: 123, commentId: null, targetId: null }), true);
      assert.strictEqual(validateTargetConstraint({ postId: 123, commentId: null, targetId: '123' }), true);

      // Active report on comment -> VALID
      assert.strictEqual(validateTargetConstraint({ postId: null, commentId: 'c-uuid-456', targetId: null }), true);
      assert.strictEqual(validateTargetConstraint({ postId: null, commentId: 'c-uuid-456', targetId: 'c-uuid-456' }), true);

      // Target was deleted, post_id & comment_id were SET NULL, but snapshot targetId exists -> VALID (historical audit preserved)
      assert.strictEqual(validateTargetConstraint({ postId: null, commentId: null, targetId: '123' }), true);
      assert.strictEqual(validateTargetConstraint({ postId: null, commentId: null, targetId: 'c-uuid-456' }), true);

      // Both post_id AND comment_id provided -> INVALID (must not report both simultaneously)
      assert.strictEqual(validateTargetConstraint({ postId: 123, commentId: 'c-uuid-456', targetId: null }), false);

      // No target provided at all -> INVALID
      assert.strictEqual(validateTargetConstraint({ postId: null, commentId: null, targetId: null }), false);
      assert.strictEqual(validateTargetConstraint({ postId: null, commentId: null, targetId: '' }), false);
    });

    test('2.2. Snapshot trigger logic simulation: correctly snapshots post or comment target', () => {
      const runSnapshotTrigger = (row) => {
        const modified = { ...row };
        if (modified.post_id != null) {
          modified.target_type = 'post';
          modified.target_id = String(modified.post_id);
        } else if (modified.comment_id != null) {
          modified.target_type = 'comment';
          modified.target_id = String(modified.comment_id);
        }
        return modified;
      };

      const postReport = runSnapshotTrigger({ post_id: 42, comment_id: null });
      assert.strictEqual(postReport.target_type, 'post');
      assert.strictEqual(postReport.target_id, '42');

      const commentReport = runSnapshotTrigger({ post_id: null, comment_id: 'comment-uuid-999' });
      assert.strictEqual(commentReport.target_type, 'comment');
      assert.strictEqual(commentReport.target_id, 'comment-uuid-999');
    });

    test('2.3. Post update integrity logic simulation: students can edit content, but not author metadata or status', () => {
      const validatePostUpdate = (oldRow, newRow, isAdmin = false) => {
        if (!isAdmin) {
          if (newRow.author_id !== oldRow.author_id) throw new Error('Cannot change author_id');
          if (newRow.author_name !== oldRow.author_name || newRow.author_avatar !== oldRow.author_avatar || newRow.author_level !== oldRow.author_level) {
            throw new Error('Cannot change author metadata');
          }
          if (newRow.created_at !== oldRow.created_at) throw new Error('Cannot change created_at');
          if (newRow.status !== oldRow.status) throw new Error('Cannot change status');
          if (newRow.is_pinned !== oldRow.is_pinned) throw new Error('Cannot change is_pinned');
          if (newRow.deleted_at !== oldRow.deleted_at) throw new Error('Cannot change deleted_at');
          if (newRow.likes_count !== oldRow.likes_count || newRow.comments_count !== oldRow.comments_count) {
            throw new Error('Cannot change counters');
          }
        }
        return true;
      };

      const originalPost = {
        id: 7,
        author_id: 'user-1',
        author_name: 'Đăng',
        author_avatar: 'https://avatar.com/1.png',
        author_level: 'HSK4',
        content: 'Bài viết gốc',
        tag: 'Học tập',
        image_url: null,
        is_solved: false,
        status: 'published',
        is_pinned: false,
        likes_count: 5,
        comments_count: 2,
        deleted_at: null,
        created_at: '2026-11-01T00:00:00Z',
      };

      // Valid student update: edit content and tag
      const validEdit = { ...originalPost, content: 'Nội dung cập nhật', tag: 'Kinh nghiệm' };
      assert.doesNotThrow(() => validatePostUpdate(originalPost, validEdit, false));

      // Invalid: student attempts to change author_name
      const spoofName = { ...originalPost, author_name: 'Super Admin' };
      assert.throws(() => validatePostUpdate(originalPost, spoofName, false), /Cannot change author metadata/);

      // Invalid: student attempts to change author_avatar
      const spoofAvatar = { ...originalPost, author_avatar: 'https://evil.com/fake.png' };
      assert.throws(() => validatePostUpdate(originalPost, spoofAvatar, false), /Cannot change author metadata/);

      // Invalid: student attempts to pin post
      const spoofPin = { ...originalPost, is_pinned: true };
      assert.throws(() => validatePostUpdate(originalPost, spoofPin, false), /Cannot change is_pinned/);

      // Invalid: student attempts to inflate likes_count
      const spoofLikes = { ...originalPost, likes_count: 9999 };
      assert.throws(() => validatePostUpdate(originalPost, spoofLikes, false), /Cannot change counters/);

      // Admin can update pinned status
      const adminPin = { ...originalPost, is_pinned: true };
      assert.doesNotThrow(() => validatePostUpdate(originalPost, adminPin, true));
    });

    test('2.4. Admin check logic simulation: blocked or non-admin users rejected', () => {
      const checkAdmin = (userProfile) => {
        if (!userProfile) return false;
        return userProfile.role === 'admin' && userProfile.status === 'active';
      };

      assert.strictEqual(checkAdmin(null), false, 'Null user profile is not admin');
      assert.strictEqual(checkAdmin({ role: 'student', status: 'active' }), false, 'Student is not admin');
      assert.strictEqual(checkAdmin({ role: 'teacher', status: 'active' }), false, 'Teacher is not admin');
      assert.strictEqual(checkAdmin({ role: 'admin', status: 'blocked' }), false, 'Blocked admin must be rejected');
      assert.strictEqual(checkAdmin({ role: 'admin', status: 'suspended' }), false, 'Suspended admin must be rejected');
      assert.strictEqual(checkAdmin({ role: 'admin', status: 'active' }), true, 'Active admin is accepted');
    });
  });

  // =========================================================================
  // GROUP 3: LIVE DATABASE RUNTIME & DATA CONSERVATION
  // =========================================================================
  describe('Group 3: Live Database Runtime & Data Conservation', () => {

    test('3.1. Live Database: community_posts maintains existing legacy posts with BIGSERIAL integer IDs', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Skipping Live DB check: Supabase credentials not found in environment');
        return;
      }

      const { data: posts, error } = await supabase.from('community_posts').select('*');
      assert.ok(!error, `Failed to query live posts: ${error?.message}`);
      assert.ok(Array.isArray(posts), 'community_posts must return an array');
      assert.ok(posts.length >= 2, `Expected at least 2 community posts, found ${posts.length}`);

      // Verify Post ID 3 (Ban Quản Trị HanziGo) and Post ID 7 (Đăng)
      const post3 = posts.find(p => p.id === 3 || p.id === '3');
      const post7 = posts.find(p => p.id === 7 || p.id === '7');

      assert.ok(post3, 'Post 3 (Ban Quản Trị HanziGo) must exist intact');
      assert.ok(post7, 'Post 7 (Đăng) must exist intact');
      assert.strictEqual(typeof post3.id, 'number', 'Post 3 id must be numeric BIGSERIAL');
      assert.strictEqual(typeof post7.id, 'number', 'Post 7 id must be numeric BIGSERIAL');
      assert.strictEqual(post3.author_name, 'Ban Quản Trị HanziGo');
    });

    test('3.2. Live Database: study_partners maintains existing records intact', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { data: partners, error } = await supabase.from('study_partners').select('*');
      assert.ok(!error, `Failed to query live study partners: ${error?.message}`);
      assert.ok(Array.isArray(partners), 'study_partners must return an array');
      assert.ok(partners.length >= 3, `Expected at least 3 study partner records, found ${partners.length}`);
    });

    test('3.3. Live Database: community_reports and community_moderation_logs reject unauthenticated access', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      // Unauthenticated insert into moderation logs must fail
      const { error: logErr } = await supabase.from('community_moderation_logs').insert([
        { target_type: 'post', target_id: '3', action: 'test_unauthorized_log' }
      ]);
      assert.ok(logErr, 'Unauthenticated moderation log insertion must be rejected by RLS');

      // Unauthenticated insert into reports must fail
      const { error: repErr } = await supabase.from('community_reports').insert([
        { reason: 'spam', post_id: 3, details: 'spam test' }
      ]);
      assert.ok(repErr, 'Unauthenticated report insertion must be rejected by RLS');
    });

    test('3.4. Codebase Security: zero Supabase Service Role Key exposure in frontend src/', () => {
      const srcDir = path.join(rootDir, 'src');
      const scanDir = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath);
          } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            assert.ok(
              !content.includes('service_role') && !content.includes('SUPABASE_SERVICE_ROLE'),
              `File ${entry.name} must not contain service_role key reference`
            );
          }
        }
      };

      scanDir(srcDir);
    });
  });

});
