import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

describe('=== PHASE 25 / TASK 25.03: CLOUD MIGRATION HARMONIZATION & DB INTEGRITY ===', () => {

  // =========================================================================
  // GROUP 1: PUBLIC SCHEMA & 55 TABLES CATALOG INTEGRITY
  // =========================================================================
  describe('Group 1: Cloud Database Catalog & 55 Tables Existence', () => {

    const expected55Tables = [
      'ai_conversations',
      'ai_messages',
      'assignment_submissions',
      'assignments',
      'audio_cache_logs',
      'audit_logs',
      'class_announcements',
      'class_materials',
      'class_members',
      'class_sessions',
      'classrooms',
      'community_comments',
      'community_migration_manifest',
      'community_moderation_logs',
      'community_posts',
      'community_reactions',
      'community_reports',
      'daily_quotes',
      'dictionary_entries',
      'hanzi_decompositions',
      'hsk_attempts',
      'hsk_exam_structures',
      'hsk_exams',
      'hsk_mistakes',
      'hsk_questions',
      'hsk_reports',
      'hsk_resources',
      'issued_certificates',
      'learning_boss_challenges',
      'learning_chapters',
      'learning_lessons',
      'learning_levels',
      'lessons',
      'materials',
      'newsletter_subscribers',
      'profiles',
      'pronunciation_items',
      'rag_ingestion_audit_logs',
      'rag_knowledge_chunks',
      'rag_knowledge_sources',
      'reading_progress',
      'session_chat_messages',
      'session_participants',
      'srs_review_logs',
      'study_partners',
      'user_daily_missions',
      'user_journey_progress',
      'user_lesson_progress',
      'user_saved_materials',
      'user_skill_mastery',
      'user_srs_cards',
      'user_study_logs',
      'user_vocab_srs',
      'vocabulary',
      'writing_characters'
    ];

    test('1.1. 55/55 schema tables exist on Supabase Cloud', async () => {
      const results = await Promise.all(
        expected55Tables.map(async (table) => {
          const { error } = await serviceClient.from(table).select('*', { count: 'exact', head: true });
          return { table, ok: !error, code: error?.code, msg: error?.message };
        })
      );

      const failed = results.filter(r => !r.ok);
      assert.strictEqual(failed.length, 0, `All tables must exist. Missing/Error: ${JSON.stringify(failed)}`);
    });

    test('1.2. Public view v_hsk_questions_public exists and hides answers from public view', async () => {
      const { data, error } = await anonClient.from('v_hsk_questions_public').select('*').limit(2);
      assert.ifError(error, 'View must be readable by anon');
      assert.ok(Array.isArray(data) && data.length > 0, 'View must return rows');

      // Sensitive columns must NOT exist in the view
      for (const row of data) {
        assert.strictEqual(row.correct_option_index, undefined, 'correct_option_index must not leak in public view');
        assert.strictEqual(row.correct_answer, undefined, 'correct_answer must not leak in public view');
      }
    });

    test('1.3. Custom Content columns exist on vocabulary and lessons tables', async () => {
      const { data: vData, error: vErr } = await serviceClient.from('vocabulary').select('*').limit(1);
      assert.ifError(vErr);
      const vCols = Object.keys(vData[0] || {});
      assert.ok(vCols.includes('is_custom'), 'vocabulary must have is_custom column');
      assert.ok(vCols.includes('is_hidden'), 'vocabulary must have is_hidden column');
      assert.ok(vCols.includes('created_by'), 'vocabulary must have created_by column');

      const { data: lData, error: lErr } = await serviceClient.from('lessons').select('*').limit(1);
      assert.ifError(lErr);
      const lCols = Object.keys(lData[0] || {});
      assert.ok(lCols.includes('is_custom'), 'lessons must have is_custom column');
      assert.ok(lCols.includes('is_hidden'), 'lessons must have is_hidden column');
      assert.ok(lCols.includes('created_by'), 'lessons must have created_by column');
    });

    test('1.4. Study Partners table contains Phase 24 Task 24.08E hardening columns', async () => {
      const { data, error } = await serviceClient.from('study_partners').select('*').limit(1);
      assert.ifError(error);
      const cols = Object.keys(data[0] || {});
      assert.ok(cols.includes('qr_image'), 'study_partners must have qr_image');
      assert.ok(cols.includes('is_active'), 'study_partners must have is_active');
      assert.ok(cols.includes('is_contact_public'), 'study_partners must have is_contact_public');
      assert.ok(cols.includes('skills'), 'study_partners must have skills');
    });
  });

  // =========================================================================
  // GROUP 2: RPC SECURITY, SIGNATURE & EXECUTION VERIFICATION
  // =========================================================================
  describe('Group 2: Cloud RPC Security, Parameters & Execution', () => {

    test('2.1. RPC search_dictionary & search_dictionary_paginated execute GIN Trigram search', async () => {
      const { data: res1, error: err1 } = await serviceClient.rpc('search_dictionary', {
        search_query: '你',
        result_limit: 3
      });
      assert.ifError(err1);
      assert.ok(Array.isArray(res1) && res1.length > 0, 'search_dictionary must return matches');
      assert.ok(res1[0].simplified === '你' || res1[0].traditional === '你');

      const { data: res2, error: err2 } = await serviceClient.rpc('search_dictionary_paginated', {
        p_query: '好',
        p_hsk: 'ALL',
        p_page: 1,
        p_page_size: 2
      });
      assert.ifError(err2);
      assert.ok(Array.isArray(res2) && res2.length > 0, 'search_dictionary_paginated must return matches');
    });

    test('2.2. RPC match_rag_knowledge executes 768-dim vector cosine similarity search', async () => {
      const dummyVector = Array(768).fill(0.01);
      const { data, error } = await serviceClient.rpc('match_rag_knowledge', {
        query_embedding: dummyVector,
        match_threshold: 0.05,
        match_count: 2
      });
      assert.ifError(error);
      assert.ok(Array.isArray(data) && data.length > 0, 'match_rag_knowledge must return matching chunks');
      assert.ok(data[0].chunk_id, 'Chunk must contain chunk_id');
      assert.ok(data[0].similarity_score !== undefined, 'Chunk must contain similarity_score');
    });

    test('2.3. RPC toggle_community_post_reaction strictly rejects anonymous calls', async () => {
      const { error } = await anonClient.rpc('toggle_community_post_reaction', {
        p_post_id: 1,
        p_reaction_type: 'like'
      });
      assert.ok(error, 'Anonymous reaction must fail');
      assert.strictEqual(error.code, '42501');
      assert.ok(
        error.message.includes('permission denied') || error.message.includes('Chưa đăng nhập'),
        'Must return permission denied or login required error'
      );
    });

    test('2.4. RPC moderate_community_content enforces input action validation', async () => {
      const { error } = await serviceClient.rpc('moderate_community_content', {
        p_target_type: 'post',
        p_target_id: 99999,
        p_action: 'invalid_action_xyz',
        p_reason: 'test'
      });
      assert.ok(error, 'Invalid moderation action must be rejected');
      assert.ok(error.message.includes('không hợp lệ'), 'Must reject invalid action code');
    });

    test('2.5. RPC atomic_join_live_session handles non-existent session safely', async () => {
      const { error } = await serviceClient.rpc('atomic_join_live_session', {
        p_session_id: '00000000-0000-0000-0000-000000000000',
        p_user_id: '00000000-0000-0000-0000-000000000000'
      });
      assert.ok(error, 'Should throw clean domain error for non-existent session');
      assert.ok(error.message.includes('Phòng học trực tuyến không tồn tại'), 'Clean Vietnamese error message');
    });

    test('2.6. RPC verify_hsk_certificate_public handles invalid certificate code cleanly', async () => {
      const { data, error } = await anonClient.rpc('verify_hsk_certificate_public', {
        p_certificate_code: 'INVALID-CODE-999'
      });
      assert.ifError(error);
      assert.deepStrictEqual(data, [], 'Must return empty array for non-existent certificate');
    });
  });

  // =========================================================================
  // GROUP 3: ROW LEVEL SECURITY (RLS) MULTI-ROLE ENFORCEMENT
  // =========================================================================
  describe('Group 3: Row Level Security & Multi-Role Data Protection', () => {

    test('3.1. Raw exam questions table hsk_questions blocks anonymous access', async () => {
      const { error } = await anonClient.from('hsk_questions').select('id, correct_option_index').limit(1);
      assert.ok(error, 'Anonymous access to raw questions must be rejected');
      assert.strictEqual(error.code, '42501', 'Must be 42501 permission denied');
    });

    test('3.2. System audit logs table audit_logs is RLS filtered for anonymous callers', async () => {
      const { data } = await anonClient.from('audit_logs').select('*');
      assert.strictEqual(data?.length, 0, 'Anonymous caller must see 0 audit logs');
    });

    test('3.3. Moderation tables community_reports and community_moderation_logs are protected', async () => {
      const { data: reports } = await anonClient.from('community_reports').select('*');
      assert.strictEqual(reports?.length, 0, 'Anonymous caller must see 0 community reports');

      const { data: logs } = await anonClient.from('community_moderation_logs').select('*');
      assert.strictEqual(logs?.length, 0, 'Anonymous caller must see 0 moderation logs');
    });

    test('3.4. Study partners public listing only displays active profiles (is_active = true)', async () => {
      const { data, error } = await anonClient.from('study_partners').select('*');
      assert.ifError(error);
      for (const item of data || []) {
        assert.strictEqual(item.is_active, true, 'Anon caller must only receive active study partners');
      }
    });

    test('3.5. Storage bucket materials is private and configured properly', async () => {
      const { data: buckets, error } = await serviceClient.storage.listBuckets();
      assert.ifError(error);
      const materialsBucket = buckets?.find(b => b.id === 'materials');
      assert.ok(materialsBucket, 'Bucket materials must exist');
      assert.strictEqual(materialsBucket.public, false, 'materials bucket must be private');
      assert.strictEqual(materialsBucket.file_size_limit, 52428800, 'Bucket file size limit must be 50MB');
    });
  });

  // =========================================================================
  // GROUP 4: STATIC MIGRATION DDL & RESOLUTION AUDIT
  // =========================================================================
  describe('Group 4: Static Migration DDL Harmonization & Ambiguity Fix Audit', () => {

    const migrationV25 = path.join(rootDir, 'supabase', 'migrations', '20261108_cloud_migration_harmonization_and_integrity_v25.sql');
    const legacyMigration = path.join(rootDir, 'supabase', 'migrations', '20261108_community_legacy_integrity_and_cursor_correction.sql');
    const masterSchema = path.join(rootDir, 'supabase', 'schema.sql');

    test('4.1. Migration v25 file exists and is non-destructive', () => {
      assert.ok(fs.existsSync(migrationV25), 'Migration v25 file must exist');
      const content = fs.readFileSync(migrationV25, 'utf-8');
      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must not drop community_posts');
      assert.ok(!content.includes('DROP TABLE public.vocabulary'), 'Must not drop vocabulary');
      assert.ok(!content.includes('DROP TABLE public.dictionary_entries'), 'Must not drop dictionary_entries');
    });

    test('4.2. audit_community_post_counters contains #variable_conflict and non-ambiguous subquery aliases', () => {
      const v25Content = fs.readFileSync(migrationV25, 'utf-8');
      assert.ok(v25Content.includes('#variable_conflict use_column'), 'Must set #variable_conflict use_column');
      assert.ok(v25Content.includes('rx_post_id'), 'Must alias reaction post_id to rx_post_id');
      assert.ok(v25Content.includes('cm_post_id'), 'Must alias comment post_id to cm_post_id');

      const legacyContent = fs.readFileSync(legacyMigration, 'utf-8');
      assert.ok(legacyContent.includes('#variable_conflict use_column'), 'Legacy migration must have ambiguity fix');

      const masterContent = fs.readFileSync(masterSchema, 'utf-8');
      assert.ok(masterContent.includes('#variable_conflict use_column'), 'Master schema must have ambiguity fix');
    });

    test('4.3. All 19 migration files exist in supabase/migrations/ directory', () => {
      const migrationFiles = fs.readdirSync(path.join(rootDir, 'supabase', 'migrations'));
      assert.ok(migrationFiles.length >= 19, `Must have at least 19 migration files (found: ${migrationFiles.length})`);
    });
  });
});
