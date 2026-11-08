import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.08C — Community Service Integration, Feed Pagination & Legacy Migration Tests', () => {

  const migrationFileC = path.join(rootDir, 'supabase', 'migrations', '20261108_community_legacy_data_migration.sql');
  const masterSchemaFile = path.join(rootDir, 'supabase', 'schema.sql');
  const communityServiceFile = path.join(rootDir, 'src', 'services', 'communityService.js');
  const communityPageFile = path.join(rootDir, 'src', 'pages', 'CommunityPage.jsx');

  // =========================================================================
  // GROUP 1: STATIC MIGRATION & DATA RECONCILIATION AUDIT
  // =========================================================================
  describe('Group 1: Static Migration & Data Reconciliation Audit', () => {

    test('1.1. Migration 20261108_community_legacy_data_migration.sql exists and is strictly non-destructive', () => {
      assert.ok(fs.existsSync(migrationFileC), 'Migration file 24.08C must exist');
      const content = fs.readFileSync(migrationFileC, 'utf-8');

      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must not drop community_posts');
      assert.ok(!content.includes('ALTER COLUMN id TYPE UUID'), 'Must not alter BIGSERIAL id to UUID');
      assert.ok(!content.includes('DROP COLUMN comments'), 'Must not prematurely drop legacy JSONB comments column');
      assert.ok(!content.includes('DROP COLUMN liked_by'), 'Must not prematurely drop legacy JSONB liked_by column');
    });

    test('1.2. Legacy comments migration handles author resolution and deduplication via NOT EXISTS', () => {
      const content = fs.readFileSync(migrationFileC, 'utf-8');

      assert.ok(content.includes('INSERT INTO public.community_comments'), 'Inserts comments into relational table');
      assert.ok(content.includes('jsonb_array_elements'), 'Unnests JSONB array elements');
      assert.ok(content.includes('NOT EXISTS'), 'Enforces deduplication to prevent re-inserting on rerun');
      assert.ok(content.includes('public.profiles'), 'Resolves profile author_id from name if available');
    });

    test('1.3. Legacy likes migration handles deduplication via ON CONFLICT DO NOTHING', () => {
      const content = fs.readFileSync(migrationFileC, 'utf-8');

      assert.ok(content.includes('INSERT INTO public.community_reactions'), 'Inserts reactions into relational table');
      assert.ok(content.includes('ON CONFLICT (post_id, user_id) DO NOTHING'), 'Enforces idempotent reaction inserts');
    });

    test('1.4. Trigger suspension during migration prevents double-counting', () => {
      const content = fs.readFileSync(migrationFileC, 'utf-8');

      assert.ok(content.includes('ALTER TABLE public.community_comments DISABLE TRIGGER trg_sync_community_post_comments_count;'), 'Disables comment counter trigger during migration');
      assert.ok(content.includes('ALTER TABLE public.community_posts DISABLE TRIGGER trg_enforce_community_post_integrity;'), 'Disables integrity guard during migration');
      assert.ok(content.includes('ALTER TABLE public.community_comments ENABLE TRIGGER trg_sync_community_post_comments_count;'), 'Re-enables comment counter trigger after migration');
      assert.ok(content.includes('ALTER TABLE public.community_posts ENABLE TRIGGER trg_enforce_community_post_integrity;'), 'Re-enables integrity guard after migration');
    });

    test('1.5. Deterministic counter reconciliation preserves unattributed legacy likes baseline', () => {
      const content = fs.readFileSync(migrationFileC, 'utf-8');

      assert.ok(content.includes('UPDATE public.community_posts p'), 'Reconciles post counters');
      assert.ok(content.includes('comments_count = ('), 'Reconciles comments_count to count of published comments');
      assert.ok(content.includes('GREATEST(0, COALESCE(p.likes, 0) -'), 'Preserves unattributed legacy likes baseline');
    });

    test('1.6. Master schema.sql synchronizes audit_community_post_counters telemetry', () => {
      const master = fs.readFileSync(masterSchemaFile, 'utf-8');

      assert.ok(master.includes('CREATE OR REPLACE FUNCTION public.audit_community_post_counters()'), 'Audit telemetry in schema.sql');
      assert.ok(master.includes('GREATEST(0, COALESCE(p.likes, 0) - COALESCE(r.reaction_cnt, 0))'), 'Baseline preserves unattributed likes in schema.sql');
    });
  });

  // =========================================================================
  // GROUP 2: COMMUNITY SERVICE MODULE INTEGRITY & CONTRACT VERIFICATION
  // =========================================================================
  describe('Group 2: Community Service Module Integrity & Contract Verification', () => {

    test('2.1. communityService.js exports all required Post, Comment, Reaction & Pagination APIs', async () => {
      const service = await import('../src/services/communityService.js');

      assert.equal(typeof service.getCommunityPosts, 'function', 'Must export getCommunityPosts');
      assert.equal(typeof service.getCommunityPostById, 'function', 'Must export getCommunityPostById');
      assert.equal(typeof service.createCommunityPost, 'function', 'Must export createCommunityPost');
      assert.equal(typeof service.updateCommunityPost, 'function', 'Must export updateCommunityPost');
      assert.equal(typeof service.deleteCommunityPost, 'function', 'Must export deleteCommunityPost');
      assert.equal(typeof service.getPostComments, 'function', 'Must export getPostComments');
      assert.equal(typeof service.createCommunityComment, 'function', 'Must export createCommunityComment');
      assert.equal(typeof service.updateCommunityComment, 'function', 'Must export updateCommunityComment');
      assert.equal(typeof service.deleteCommunityComment, 'function', 'Must export deleteCommunityComment');
      assert.equal(typeof service.togglePostReaction, 'function', 'Must export togglePostReaction');
      assert.equal(typeof service.normalizePostData, 'function', 'Must export normalizePostData');
      assert.equal(typeof service.formatCommunityTime, 'function', 'Must export formatCommunityTime');
    });

    test('2.2. normalizePostData enforces string serialization for post.id (BIGINT safety)', async () => {
      const { normalizePostData } = await import('../src/services/communityService.js');

      const rawRow = {
        id: 9007199254740991n, // BigInt representation
        author_name: 'Trần Văn A',
        author_level: 'HSK 3',
        content: 'Bài viết học từ vựng',
        likes_count: 5,
        comments_count: 2,
        is_pinned: false,
        created_at: '2026-11-01T12:00:00Z'
      };

      const normalized = normalizePostData(rawRow);
      assert.equal(typeof normalized.id, 'string', 'Post id must strictly be string');
      assert.equal(normalized.id, '9007199254740991');
      assert.equal(normalized.author, 'Trần Văn A');
      assert.equal(normalized.likes, 5);
      assert.equal(normalized.commentsCount, 2);
      assert.equal(normalized.isPinned, false);
    });

    test('2.3. normalizePostData handles Ban Quản Trị branding and official avatar', async () => {
      const { normalizePostData } = await import('../src/services/communityService.js');

      const bqtRow = {
        id: 3,
        author_name: 'Ban Quản Trị HanziGo',
        author_avatar: null,
        author_level: 'Quản trị viên',
        content: 'Chào mừng các bạn',
        created_at: '2026-11-01T10:00:00Z'
      };

      const normalized = normalizePostData(bqtRow);
      assert.equal(normalized.avatar, '/hanzigo-logo.svg', 'BQT avatar must resolve to official logo');
      assert.equal(normalized.initial, 'HZ', 'BQT initial must resolve to HZ');
      assert.equal(normalized.level, 'Quản trị viên');
    });

    test('2.4. formatCommunityTime formats relative timestamps accurately in Vietnamese', async () => {
      const { formatCommunityTime } = await import('../src/services/communityService.js');

      const now = new Date();
      assert.equal(formatCommunityTime(now.toISOString()), 'Vừa xong');

      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      assert.equal(formatCommunityTime(fiveMinutesAgo.toISOString()), '5 phút trước');

      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      assert.equal(formatCommunityTime(twoHoursAgo.toISOString()), '2 giờ trước');

      const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
      assert.equal(formatCommunityTime(fourDaysAgo.toISOString()), '4 ngày trước');
    });

    test('2.5. updateCommunityPost strictly blocks protected columns from client update payload', () => {
      const content = fs.readFileSync(communityServiceFile, 'utf-8');

      // The service must only whitelist content, tag, image_url, is_solved
      assert.ok(content.includes('if (updateData.content !== undefined)'), 'Whitelists content');
      assert.ok(content.includes('if (updateData.tag !== undefined)'), 'Whitelists tag');
      assert.ok(content.includes('if (updateData.is_solved !== undefined)'), 'Whitelists is_solved');
      assert.ok(!content.includes('payload.likes ='), 'Never allows client payload to set likes');
      assert.ok(!content.includes('payload.likes_count ='), 'Never allows client payload to set likes_count');
      assert.ok(!content.includes('payload.comments ='), 'Never allows client payload to set comments');
      assert.ok(!content.includes('payload.comments_count ='), 'Never allows client payload to set comments_count');
    });

    test('2.6. togglePostReaction invokes toggle_community_post_reaction RPC without client counter mutations', () => {
      const content = fs.readFileSync(communityServiceFile, 'utf-8');

      assert.ok(content.includes("supabase.rpc('toggle_community_post_reaction'"), 'Calls atomic RPC');
      assert.ok(content.includes('p_post_id:'), 'Passes post id to RPC');
      assert.ok(content.includes('p_reaction_type:'), 'Passes reaction type to RPC');
      assert.ok(content.includes('likes_count: Number(data.likes_count)'), 'Receives authoritative likes_count');
      assert.ok(content.includes('post_id: String(data.post_id)'), 'Receives post_id as string');
    });
  });

  // =========================================================================
  // GROUP 3: COMMUNITYPAGE FRONTEND INTEGRATION & LOCALSTORAGE DEPRECATION
  // =========================================================================
  describe('Group 3: CommunityPage Frontend Integration & LocalStorage Deprecation', () => {

    test('3.1. CommunityPage imports modernized community services from supabase facade', () => {
      const content = fs.readFileSync(communityPageFile, 'utf-8');

      assert.ok(content.includes('getCommunityPosts,'), 'Imports getCommunityPosts');
      assert.ok(content.includes('createCommunityPost,'), 'Imports createCommunityPost');
      assert.ok(content.includes('getPostComments,'), 'Imports getPostComments');
      assert.ok(content.includes('createCommunityComment,'), 'Imports createCommunityComment');
      assert.ok(content.includes('deleteCommunityComment,'), 'Imports deleteCommunityComment');
      assert.ok(content.includes('togglePostReaction,'), 'Imports togglePostReaction');
    });

    test('3.2. LocalStorage is deprecated as primary source of truth for Community feed', () => {
      const content = fs.readFileSync(communityPageFile, 'utf-8');

      // Check comments and implementation: LocalStorage must only be an offline fallback cache
      assert.ok(content.includes('// Deprecated LocalStorage persistence for feed posts (Supabase is Single Source of Truth)'), 'Explicit deprecation notice');
      assert.ok(!content.includes('localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next));'), 'Does not overwrite LocalStorage on every like');
    });

    test('3.3. CommunityPage implements cursor-based pagination state and Load More handler', () => {
      const content = fs.readFileSync(communityPageFile, 'utf-8');

      assert.ok(content.includes('hasMorePosts'), 'Tracks hasMorePosts state');
      assert.ok(content.includes('nextPostCursor'), 'Tracks nextPostCursor state');
      assert.ok(content.includes('isLoadingMorePosts'), 'Tracks isLoadingMorePosts state');
      assert.ok(content.includes('handleLoadMorePosts'), 'Implements handleLoadMorePosts handler');
      assert.ok(content.includes('Xem thêm bài viết cũ hơn'), 'Renders Load More button in UI');
    });

    test('3.4. Reaction button uses atomic RPC instead of client-side math', () => {
      const content = fs.readFileSync(communityPageFile, 'utf-8');

      assert.ok(content.includes('const res = await togglePostReaction(idStr, \'like\');'), 'Invokes togglePostReaction RPC');
      assert.ok(content.includes('res.data.likes_count'), 'Applies authoritative likes_count from server');
    });

    test('3.5. Comments drawer loads relational comments on demand via getPostComments', () => {
      const content = fs.readFileSync(communityPageFile, 'utf-8');

      assert.ok(content.includes('postCommentsMap'), 'Maintains relational comments state map');
      assert.ok(content.includes('getPostComments(idStr)'), 'Fetches comments on drawer expansion');
      assert.ok(content.includes('createCommunityComment(idStr, text)'), 'Creates comments via relational API');
      assert.ok(content.includes('deleteCommunityComment(commentId)'), 'Deletes comments via relational API');
    });

    test('3.6. Realtime subscription dispatches POST_CHANGE, COMMENT_CHANGE, and REACTION_CHANGE', () => {
      const content = fs.readFileSync(communityPageFile, 'utf-8');

      assert.ok(content.includes("event.type === 'POST_CHANGE'"), 'Handles realtime post events');
      assert.ok(content.includes("event.type === 'COMMENT_CHANGE'"), 'Handles realtime comment events');
      assert.ok(content.includes("event.type === 'REACTION_CHANGE'"), 'Handles realtime reaction events');
    });
  });

  // =========================================================================
  // GROUP 4: LIVE SUPABASE DATABASE VERIFICATION & ZERO TRUST AUDIT
  // =========================================================================
  describe('Group 4: Live Supabase Database Verification & Zero Trust Audit', () => {

    test('4.1. Live Database: community_posts maintains intact legacy data and schema', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { data, error } = await supabase
        .from('community_posts')
        .select('id, author_name, likes_count, comments_count')
        .limit(5);

      assert.equal(error, null, 'Querying community_posts must not error');
      assert.ok(Array.isArray(data), 'Returns post rows');
      assert.ok(data.length > 0, 'Database contains existing posts (Post 3, Post 7)');
      
      const post3 = data.find(p => p.id === 3 || String(p.id) === '3');
      if (post3) {
        assert.ok(post3.likes_count >= 12, 'Post 3 preserves legacy baseline likes');
      }
    });

    test('4.2. Live Database: community_comments and community_reactions tables are accessible', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { data: comments, error: cErr } = await supabase
        .from('community_comments')
        .select('id')
        .limit(1);

      assert.equal(cErr, null, 'Querying community_comments must succeed');
      assert.ok(Array.isArray(comments), 'Returns array');

      const { data: reactions, error: rErr } = await supabase
        .from('community_reactions')
        .select('id')
        .limit(1);

      assert.equal(rErr, null, 'Querying community_reactions must succeed');
      assert.ok(Array.isArray(reactions), 'Returns array');
    });

    test('4.3. Codebase Security: Zero exposure of SUPABASE_SERVICE_ROLE_KEY in frontend', () => {
      const srcDir = path.join(rootDir, 'src');
      const files = fs.readdirSync(srcDir, { recursive: true });

      for (const file of files) {
        const fullPath = path.join(srcDir, file);
        if (fs.statSync(fullPath).isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          assert.ok(
            !content.includes('service_role') && !content.includes('SERVICE_ROLE_KEY'),
            `File ${file} must not reference service role key`
          );
        }
      }
    });
  });
});

