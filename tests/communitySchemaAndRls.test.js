import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.08A — Community Database Schema Migration & RLS Hardening Tests', () => {

  const migrationFile = path.join(rootDir, 'supabase', 'migrations', '20261108_community_schema_and_rls_hardening.sql');
  const masterSchemaFile = path.join(rootDir, 'supabase', 'schema.sql');

  // =========================================================================
  // GROUP 1: MIGRATION & SCHEMA INTEGRITY
  // =========================================================================
  describe('Group 1: Migration & Schema Integrity', () => {

    test('1.1. Migration file exists and is strictly non-destructive', () => {
      assert.ok(fs.existsSync(migrationFile), 'Migration file must exist');
      const content = fs.readFileSync(migrationFile, 'utf-8');

      // Must NOT drop community_posts table
      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must not drop community_posts');
      assert.ok(!content.includes('DROP TABLE IF EXISTS public.community_posts'), 'Must not drop community_posts');
      // Must NOT alter community_posts.id type
      assert.ok(!content.includes('ALTER COLUMN id TYPE UUID'), 'Must not change BIGSERIAL id to UUID');
    });

    test('1.2. community_posts columns are safely extended with backward compatibility', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS status'), 'status column added');
      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS is_pinned'), 'is_pinned column added');
      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS is_solved'), 'is_solved column added');
      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS likes_count'), 'likes_count column added');
      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS comments_count'), 'comments_count column added');
      assert.ok(content.includes('ADD COLUMN IF NOT EXISTS deleted_at'), 'deleted_at column added for soft-delete');
    });

    test('1.3. New community tables (comments, reactions, reports, moderation_logs) are defined', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('CREATE TABLE IF NOT EXISTS public.community_comments'), 'community_comments created');
      assert.ok(content.includes('CREATE TABLE IF NOT EXISTS public.community_reactions'), 'community_reactions created');
      assert.ok(content.includes('CREATE TABLE IF NOT EXISTS public.community_reports'), 'community_reports created');
      assert.ok(content.includes('CREATE TABLE IF NOT EXISTS public.community_moderation_logs'), 'community_moderation_logs created');
    });

    test('1.4. Master schema.sql synchronizes all new community tables and columns', () => {
      const masterContent = fs.readFileSync(masterSchemaFile, 'utf-8');

      assert.ok(masterContent.includes('CREATE TABLE IF NOT EXISTS public.community_comments'), 'Master schema defines community_comments');
      assert.ok(masterContent.includes('CREATE TABLE IF NOT EXISTS public.community_reactions'), 'Master schema defines community_reactions');
      assert.ok(masterContent.includes('CREATE TABLE IF NOT EXISTS public.community_reports'), 'Master schema defines community_reports');
      assert.ok(masterContent.includes('CREATE TABLE IF NOT EXISTS public.community_moderation_logs'), 'Master schema defines community_moderation_logs');
    });
  });

  // =========================================================================
  // GROUP 2: RELATIONAL CONSTRAINTS & DATA INTEGRITY
  // =========================================================================
  describe('Group 2: Relational Constraints & Data Integrity', () => {

    test('2.1. community_comments correctly references community_posts(id) using BIGINT', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('post_id BIGINT NOT NULL REFERENCES public.community_posts(id)'), 'Foreign key must use BIGINT to match community_posts.id');
      assert.ok(content.includes('author_id UUID NOT NULL REFERENCES public.profiles(id)'), 'Foreign key must reference profiles.id');
    });

    test('2.2. community_reactions enforces strict unique constraint (one reaction per user per post)', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('CONSTRAINT uq_community_reactions_post_user UNIQUE (post_id, user_id)'), 'Must enforce UNIQUE (post_id, user_id)');
    });

    test('2.3. community_reports enforces XOR check constraint (targets either post or comment, never both)', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('chk_report_target_xor'), 'XOR constraint name present');
      assert.ok(content.includes('(post_id IS NOT NULL AND comment_id IS NULL)'), 'Post target branch');
      assert.ok(content.includes('(post_id IS NULL AND comment_id IS NOT NULL)'), 'Comment target branch');
    });

    test('2.4. community_moderation_logs enforces target_type and action constraints', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes("CHECK (target_type IN ('post', 'comment', 'report'))"), 'target_type constrained');
      assert.ok(content.includes("CHECK (action IN ('hide', 'restore', 'delete', 'dismiss_report', 'pin', 'unpin'))"), 'action constrained');
    });
  });

  // =========================================================================
  // GROUP 3: ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
  // =========================================================================
  describe('Group 3: Row Level Security (RLS) & Access Control', () => {

    test('3.1. RLS enabled on all community tables in migration and schema', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;'));
      assert.ok(content.includes('ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;'));
      assert.ok(content.includes('ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;'));
      assert.ok(content.includes('ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;'));
      assert.ok(content.includes('ALTER TABLE public.community_moderation_logs ENABLE ROW LEVEL SECURITY;'));
    });

    test('3.2. community_posts select policy hides deleted and unverified posts from regular users', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes("status = 'published' AND deleted_at IS NULL"), 'Only published non-deleted posts readable by public');
      assert.ok(content.includes('auth.uid() = author_id'), 'Author can view own post regardless of status');
      assert.ok(content.includes('public.is_admin()'), 'Admin has full access via is_admin()');
    });

    test('3.3. community_reactions prevents impersonation (user_id must match auth.uid())', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('auth.uid() = user_id'), 'Reaction INSERT must check user_id = auth.uid()');
      assert.ok(!content.includes('community_reactions FOR UPDATE'), 'No UPDATE policy allowed on reactions');
    });

    test('3.4. community_reports enforces reporter_id = auth.uid() and initial status = pending', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('auth.uid() = reporter_id'), 'Report INSERT requires reporter_id = auth.uid()');
      assert.ok(content.includes("status = 'pending'"), 'Report initial status must be pending');
      assert.ok(content.includes('resolved_by IS NULL'), 'Report cannot self-resolve on creation');
    });

    test('3.5. community_moderation_logs is strictly immutable (UPDATE and DELETE prohibited)', () => {
      const content = fs.readFileSync(migrationFile, 'utf-8');

      assert.ok(content.includes('community_mod_logs_no_update') && content.includes('FOR UPDATE') && content.includes('USING (false)'), 'UPDATE must be disabled via USING (false)');
      assert.ok(content.includes('community_mod_logs_no_delete') && content.includes('FOR DELETE') && content.includes('USING (false)'), 'DELETE must be disabled via USING (false)');
    });
  });

  // =========================================================================
  // GROUP 4: LIVE DATABASE VERIFICATION & DATA CONSERVATION
  // =========================================================================
  describe('Group 4: Live Database Verification & Data Conservation', () => {

    test('4.1. Existing posts in live database are preserved without corruption', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        return; // Skip if offline
      }

      const { data: posts, error } = await supabase.from('community_posts').select('*');
      assert.ok(!error, `Querying community_posts must not fail: ${error?.message}`);
      assert.ok(Array.isArray(posts), 'Must return array of posts');
      assert.ok(posts.length >= 2, 'Existing posts must still be present in database');

      // Verify legacy row properties intact
      const sample = posts[0];
      assert.ok('id' in sample, 'id field present');
      assert.strictEqual(typeof sample.id, 'number', 'id must remain numeric (BIGSERIAL)');
      assert.ok('author_name' in sample, 'author_name field present');
      assert.ok('content' in sample, 'content field present');
      assert.ok('likes' in sample, 'likes field present');
      assert.ok('comments' in sample, 'comments field present');
    });

    test('4.2. Existing study_partners in live database are preserved without corruption', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        return;
      }

      const { data: partners, error } = await supabase.from('study_partners').select('*');
      assert.ok(!error, `Querying study_partners must not fail: ${error?.message}`);
      assert.ok(Array.isArray(partners), 'Must return array of partners');
      assert.ok(partners.length >= 3, 'Existing study partners must still be present');
    });

    test('4.3. Zero exposure of SUPABASE_SERVICE_ROLE_KEY across all client-facing files', () => {
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
