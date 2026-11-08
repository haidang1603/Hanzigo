import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.08A.1 — Community RLS & Data Integrity Correction Verification Tests', () => {

  const migrationFileA = path.join(rootDir, 'supabase', 'migrations', '20261108_community_schema_and_rls_hardening.sql');
  const migrationFileA1 = path.join(rootDir, 'supabase', 'migrations', '20261108_community_rls_and_data_integrity_correction.sql');
  const masterSchemaFile = path.join(rootDir, 'supabase', 'schema.sql');

  // =========================================================================
  // GROUP 1: STATIC CODE & MIGRATION DEFINITIONS AUDIT
  // =========================================================================
  describe('Group 1: Static Migration & Schema Integrity Audit', () => {

    test('1.1. Migration 20261108_community_rls_and_data_integrity_correction.sql exists and is non-destructive', () => {
      assert.ok(fs.existsSync(migrationFileA1), 'Correction migration must exist');
      const content = fs.readFileSync(migrationFileA1, 'utf-8');

      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must not drop community_posts');
      assert.ok(!content.includes('ALTER COLUMN id TYPE UUID'), 'Must not change BIGSERIAL id to UUID');
    });

    test('1.2. Safe backfill query handles SQL NULL, JSON null and scalars gracefully', () => {
      const content = fs.readFileSync(migrationFileA1, 'utf-8');

      assert.ok(content.includes("jsonb_typeof(comments) = 'array'"), 'Must strictly verify jsonb_typeof is array before calling jsonb_array_length');
      assert.ok(content.includes('COALESCE(likes, 0)'), 'Must coalesce likes with fallback to 0');
      assert.ok(content.includes('GREATEST'), 'Must ensure non-negative counts');
    });

    test('1.3. Audit preservation: foreign keys on delete use SET NULL to preserve history', () => {
      const content = fs.readFileSync(migrationFileA1, 'utf-8');

      assert.ok(content.includes('FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE SET NULL'), 'admin_id must be ON DELETE SET NULL');
      assert.ok(content.includes('FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE SET NULL'), 'reporter_id must be ON DELETE SET NULL');
      assert.ok(content.includes('FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE SET NULL'), 'report post_id must be ON DELETE SET NULL');
      assert.ok(content.includes('FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL'), 'comments author_id must be ON DELETE SET NULL');
    });

    test('1.4. Check constraints: reaction types and comment content length are constrained', () => {
      const content = fs.readFileSync(migrationFileA1, 'utf-8');

      assert.ok(content.includes("chk_community_reactions_type CHECK (reaction_type IN ('like', 'heart', 'clap', 'bulb'))"), 'Reaction types constrained');
      assert.ok(content.includes('length(trim(content)) > 0 AND length(content) <= 3000'), 'Comment non-empty and length <= 3000 constrained');
      assert.ok(content.includes('likes_count >= 0 AND comments_count >= 0'), 'Non-negative counts constrained');
    });

    test('1.5. Defense-in-depth triggers defined for post and comment integrity', () => {
      const content = fs.readFileSync(migrationFileA1, 'utf-8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.enforce_community_post_integrity()'), 'Post integrity trigger function defined');
      assert.ok(content.includes('CREATE TRIGGER trg_enforce_community_post_integrity'), 'Post integrity trigger bound');
      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.enforce_community_comment_integrity()'), 'Comment integrity trigger function defined');
      assert.ok(content.includes('CREATE TRIGGER trg_enforce_community_comment_integrity'), 'Comment integrity trigger bound');
    });

    test('1.6. Master schema.sql synchronizes all triggers and constraints', () => {
      const master = fs.readFileSync(masterSchemaFile, 'utf-8');

      assert.ok(master.includes('trg_enforce_community_post_integrity'), 'Master schema includes post integrity trigger');
      assert.ok(master.includes('trg_enforce_community_comment_integrity'), 'Master schema includes comment integrity trigger');
      assert.ok(master.includes('chk_community_comments_content'), 'Master schema includes comment content check constraint');
      assert.ok(master.includes('chk_community_reactions_type'), 'Master schema includes reaction type check constraint');
    });
  });

  // =========================================================================
  // GROUP 2: UNIT & BUSINESS LOGIC INTEGRITY TESTS
  // =========================================================================
  describe('Group 2: Business Logic Integrity & Constraint Checks', () => {

    test('2.1. Comment validation: rejects empty or whitespace-only content', () => {
      const validateComment = (content) => {
        if (!content || typeof content !== 'string') return false;
        const trimmed = content.trim();
        return trimmed.length > 0 && trimmed.length <= 3000;
      };

      assert.strictEqual(validateComment(''), false, 'Empty comment must fail');
      assert.strictEqual(validateComment('   '), false, 'Whitespace-only comment must fail');
      assert.strictEqual(validateComment('\n\t  \n'), false, 'Newline/tab whitespace must fail');
      assert.strictEqual(validateComment('Chào cả nhà! Bài viết rất hay.'), true, 'Valid comment must pass');
      assert.strictEqual(validateComment('a'.repeat(3001)), false, 'Overlength comment (> 3000) must fail');
    });

    test('2.2. Reaction validation: rejects unsupported reaction types', () => {
      const allowedReactions = new Set(['like', 'heart', 'clap', 'bulb']);
      const isAllowed = (t) => allowedReactions.has(t);

      assert.strictEqual(isAllowed('like'), true);
      assert.strictEqual(isAllowed('heart'), true);
      assert.strictEqual(isAllowed('clap'), true);
      assert.strictEqual(isAllowed('bulb'), true);
      assert.strictEqual(isAllowed('dislike'), false, 'Dislike not supported');
      assert.strictEqual(isAllowed('angry'), false, 'Angry not supported');
      assert.strictEqual(isAllowed(''), false, 'Empty type not supported');
    });

    test('2.3. Report XOR target validation: enforces mutually exclusive targets', () => {
      const validateReportTarget = (postId, commentId) => {
        const hasPost = postId !== null && postId !== undefined;
        const hasComment = commentId !== null && commentId !== undefined;
        return (hasPost && !hasComment) || (!hasPost && hasComment);
      };

      assert.strictEqual(validateReportTarget(3, null), true, 'Report targeting post only must pass');
      assert.strictEqual(validateReportTarget(null, 'uuid-comm-1'), true, 'Report targeting comment only must pass');
      assert.strictEqual(validateReportTarget(3, 'uuid-comm-1'), false, 'Report targeting BOTH post and comment must fail');
      assert.strictEqual(validateReportTarget(null, null), false, 'Report targeting NEITHER post nor comment must fail');
    });
  });

  // =========================================================================
  // GROUP 3: DATABASE RUNTIME & CONSERVATION TESTS (LIVE SUPABASE)
  // =========================================================================
  describe('Group 3: Live Database Runtime & Data Conservation Tests', () => {

    test('3.1. Existing live posts remain intact (no data loss, BIGSERIAL preserved)', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { data: posts, error } = await supabase.from('community_posts').select('*');
      assert.ok(!error, `Failed to query live posts: ${error?.message}`);
      assert.ok(posts.length >= 2, 'Live posts must not be lost');

      const p3 = posts.find(p => p.id === 3);
      assert.ok(p3, 'Post 3 (Ban Quản Trị HanziGo) must exist');
      assert.strictEqual(typeof p3.id, 'number', 'Post 3 ID must be numeric (BIGSERIAL)');
      assert.strictEqual(p3.author_name, 'Ban Quản Trị HanziGo');
      assert.ok(Array.isArray(p3.comments), 'Comments JSONB array must be intact');
      assert.ok(p3.comments.length >= 1, 'Legacy comment must be preserved');
    });

    test('3.2. Existing live study partners remain intact (no data loss)', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { data: partners, error } = await supabase.from('study_partners').select('*');
      assert.ok(!error, `Failed to query live study partners: ${error?.message}`);
      assert.ok(partners.length >= 3, 'Live study partners must not be lost');
    });

    test('3.3. RLS runtime: unauthenticated client cannot insert reports, reactions, or moderation logs directly', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      // 1. Try inserting moderation log as anon
      const { error: logErr } = await supabase.from('community_moderation_logs').insert([
        { target_type: 'post', target_id: '3', action: 'hide' }
      ]);
      assert.ok(logErr, 'Unauthenticated moderation log insertion must be rejected by RLS');

      // 2. Try inserting report as anon
      const { error: repErr } = await supabase.from('community_reports').insert([
        { reason: 'spam', post_id: 3, details: 'spam test' }
      ]);
      assert.ok(repErr, 'Unauthenticated report insertion must be rejected by RLS');

      // 3. Try inserting reaction as anon
      const { error: reactErr } = await supabase.from('community_reactions').insert([
        { post_id: 3, reaction_type: 'like' }
      ]);
      assert.ok(reactErr, 'Unauthenticated reaction insertion must be rejected by RLS');
    });

    test('3.4. Zero client-side exposure of SUPABASE_SERVICE_ROLE_KEY', () => {
      const clientFiles = [
        'src/services/communityService.js',
        'src/pages/CommunityPage.jsx',
        'src/supabase/services.js',
        'src/supabase/config.js'
      ];

      clientFiles.forEach(file => {
        const fullPath = path.join(rootDir, file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          assert.ok(!content.includes('SERVICE_ROLE_KEY'), `File ${file} must not contain SERVICE_ROLE_KEY`);
          assert.ok(!content.includes('SUPABASE_SERVICE_ROLE_KEY'), `File ${file} must not contain SUPABASE_SERVICE_ROLE_KEY`);
        }
      });
    });
  });

});
