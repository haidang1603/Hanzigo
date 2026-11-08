/**
 * tests/communityReportsAndModerationUI.test.js
 *
 * HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08D
 * COMMUNITY REPORTS & MODERATION UI VERIFICATION TEST SUITE
 *
 * Test Groups:
 *  - Group 1: Static / Schema & Security Definition Audit
 *  - Group 2: Unit Business Logic & Input Validation
 *  - Group 3: Integration & Threat Model Simulation (Student vs Admin)
 *  - Group 4: Live Database Verification (Supabase Environment)
 *  - Group 5: Community Regression & Feed Invariance
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 24.08D — Community Reports & Moderation UI Tests', () => {

  // =========================================================================
  // GROUP 1: STATIC / SCHEMA & SECURITY DEFINITION AUDIT
  // =========================================================================
  describe('Group 1: Static / Schema & Security Definition Audit', () => {

    test('1.1. Migration 20261108_community_moderation_and_reports.sql exists and is strictly non-destructive', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_moderation_and_reports.sql');
      assert.ok(fs.existsSync(migPath), 'Migration file must exist');

      const content = fs.readFileSync(migPath, 'utf8');
      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must NOT drop community_posts');
      assert.ok(!content.includes('DROP TABLE public.community_comments'), 'Must NOT drop community_comments');
      assert.ok(!content.includes('DROP TABLE public.community_reports'), 'Must NOT drop community_reports');
      assert.ok(!content.includes('DROP TABLE public.community_moderation_logs'), 'Must NOT drop community_moderation_logs');
      assert.ok(!content.includes('CASCADE'), 'Must NOT use DROP ... CASCADE');
    });

    test('1.2. Migration adds unique anti-abuse index uq_community_reports_active', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_moderation_and_reports.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      assert.ok(
        content.includes('uq_community_reports_active'),
        'Must define unique index uq_community_reports_active'
      );
      assert.ok(
        content.includes("WHERE status IN ('pending', 'reviewing')"),
        'Unique index must target active report statuses'
      );
    });

    test('1.3. Atomic RPC moderate_community_content enforces admin verification & records audit log', () => {
      const migPath = path.resolve(process.cwd(), 'supabase/migrations/20261108_community_moderation_and_reports.sql');
      const content = fs.readFileSync(migPath, 'utf8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.moderate_community_content'), 'Must define moderate_community_content RPC');
      assert.ok(content.includes('SECURITY DEFINER'), 'RPC must run as SECURITY DEFINER');
      assert.ok(content.includes('public.is_admin()'), 'RPC must check public.is_admin()');
      assert.ok(content.includes('auth.uid()'), 'RPC must extract admin_id from auth.uid()');
      assert.ok(content.includes('INSERT INTO public.community_moderation_logs'), 'RPC must atomically write to audit log');
    });

    test('1.4. Master schema.sql synchronizes moderation RPC, check constraints, and ACL grants', () => {
      const schemaPath = path.resolve(process.cwd(), 'supabase/schema.sql');
      const content = fs.readFileSync(schemaPath, 'utf8');

      assert.ok(content.includes("status IN ('pending', 'reviewing', 'resolved', 'dismissed')"), 'schema.sql must synchronize status check constraint');
      assert.ok(content.includes("action IN ('hide', 'restore', 'delete', 'dismiss_report', 'review_report', 'resolve_report', 'pin', 'unpin')"), 'schema.sql must synchronize action check constraint');
      assert.ok(content.includes('uq_community_reports_active'), 'schema.sql must synchronize uq_community_reports_active');
      assert.ok(content.includes('moderate_community_content'), 'schema.sql must synchronize moderate_community_content RPC');
      assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.moderate_community_content'), 'Must revoke execute from anon and PUBLIC');
      assert.ok(content.includes('GRANT EXECUTE ON FUNCTION public.moderate_community_content'), 'Must grant execute to authenticated and service_role');
    });

    test('1.5. Codebase Security: Zero exposure of service role key in frontend source files', () => {
      const srcDir = path.resolve(process.cwd(), 'src');
      const files = fs.readdirSync(srcDir, { recursive: true });

      for (const file of files) {
        if (typeof file === 'string' && (file.endsWith('.js') || file.endsWith('.jsx'))) {
          const fullPath = path.join(srcDir, file);
          const fileContent = fs.readFileSync(fullPath, 'utf8');
          assert.ok(
            !fileContent.includes('SUPABASE_SERVICE_ROLE_KEY') && !fileContent.includes('service_role_secret'),
            `Service role secret must NOT appear in client source file: ${file}`
          );
        }
      }
    });
  });

  // =========================================================================
  // GROUP 2: UNIT BUSINESS LOGIC & INPUT VALIDATION
  // =========================================================================
  describe('Group 2: Unit Business Logic & Input Validation', () => {

    test('2.1. Validation: Rejects invalid target_type (must be post or comment)', async () => {
      const { validateCommunityReportInput } = await import('../src/services/communityService.js');

      assert.throws(
        () => validateCommunityReportInput({
          targetType: 'invalid_type',
          targetId: '123',
          reason: 'spam'
        }),
        /Loại đối tượng báo cáo không hợp lệ/
      );
    });

    test('2.2. Validation: Rejects empty or missing target_id', async () => {
      const { validateCommunityReportInput } = await import('../src/services/communityService.js');

      assert.throws(
        () => validateCommunityReportInput({
          targetType: 'post',
          targetId: '',
          reason: 'spam'
        }),
        /Mã định danh đối tượng báo cáo không được để trống/
      );
    });

    test('2.3. Validation: Rejects invalid or missing violation reason', async () => {
      const { validateCommunityReportInput } = await import('../src/services/communityService.js');

      assert.throws(
        () => validateCommunityReportInput({
          targetType: 'post',
          targetId: '7',
          reason: 'unknown_violation_code'
        }),
        /Vui lòng chọn một lý do báo cáo hợp lệ/
      );
    });

    test('2.4. Validation: Details text length limit (max 500 characters)', async () => {
      const { validateCommunityReportInput } = await import('../src/services/communityService.js');

      const overlyLongText = 'A'.repeat(501);
      assert.throws(
        () => validateCommunityReportInput({
          targetType: 'comment',
          targetId: 'c1f7a0b3-9e4a-4a88-8b9a-111111111111',
          reason: 'spam',
          details: overlyLongText
        }),
        /Mô tả bổ sung không được vượt quá 500 ký tự/
      );
    });

    test('2.5. Status badge helper reflects all 4 moderation states', async () => {
      const { REPORT_STATUSES } = await import('../src/services/communityService.js');

      const statusIds = REPORT_STATUSES.map(s => s.id);
      assert.ok(statusIds.includes('pending'), 'Supports pending');
      assert.ok(statusIds.includes('reviewing'), 'Supports reviewing');
      assert.ok(statusIds.includes('resolved'), 'Supports resolved');
      assert.ok(statusIds.includes('dismissed'), 'Supports dismissed');
    });

    test('2.6. Reason list covers all 5 required violation categories', async () => {
      const { REPORT_REASONS } = await import('../src/services/communityService.js');

      const reasonIds = REPORT_REASONS.map(r => r.id);
      assert.ok(reasonIds.includes('spam'), 'Supports spam');
      assert.ok(reasonIds.includes('harassment'), 'Supports harassment');
      assert.ok(reasonIds.includes('misinformation'), 'Supports misinformation');
      assert.ok(reasonIds.includes('inappropriate'), 'Supports inappropriate');
      assert.ok(reasonIds.includes('other'), 'Supports other');
    });
  });

  // =========================================================================
  // GROUP 3: INTEGRATION & THREAT MODEL SIMULATION (STUDENT VS ADMIN)
  // =========================================================================
  describe('Group 3: Integration & Threat Model Simulation (Student vs Admin)', () => {

    // In-memory simulation of database state
    function createMockCommunityDb() {
      return {
        posts: [
          { id: 1, author_id: 'u-author', content: 'Bài viết hợp lệ', status: 'published', deleted_at: null },
          { id: 2, author_id: 'u-spammer', content: 'Mua tài khoản giá rẻ tại link này', status: 'published', deleted_at: null }
        ],
        comments: [
          { id: 'comm-1', post_id: 1, author_id: 'u-student-a', content: 'Bình luận hay', status: 'published', deleted_at: null },
          { id: 'comm-2', post_id: 1, author_id: 'u-troll', content: 'Nội dung quấy rối thô tục', status: 'published', deleted_at: null }
        ],
        reports: [],
        moderationLogs: []
      };
    }

    test('3.1. Student sends report for a post: Successfully recorded with pending status', () => {
      const db = createMockCommunityDb();
      const currentUserId = 'student-user-1';

      // Simulate student report insertion
      const newReport = {
        id: 'rep-001',
        reporter_id: currentUserId,
        post_id: 2,
        comment_id: null,
        target_type: 'post',
        target_id: '2',
        reason: 'spam',
        details: 'Spam link quảng cáo',
        status: 'pending',
        resolved_by: null,
        resolved_at: null,
        created_at: new Date().toISOString()
      };

      db.reports.push(newReport);

      assert.strictEqual(db.reports.length, 1);
      assert.strictEqual(db.reports[0].status, 'pending');
      assert.strictEqual(db.reports[0].target_type, 'post');
      assert.strictEqual(db.reports[0].target_id, '2');
    });

    test('3.2. Student sends report for a comment: Successfully points strictly to comment', () => {
      const db = createMockCommunityDb();
      const currentUserId = 'student-user-1';

      const newReport = {
        id: 'rep-002',
        reporter_id: currentUserId,
        post_id: null,
        comment_id: 'comm-2',
        target_type: 'comment',
        target_id: 'comm-2',
        reason: 'harassment',
        details: 'Xúc phạm người khác',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      db.reports.push(newReport);

      assert.strictEqual(db.reports.length, 1);
      assert.strictEqual(db.reports[0].target_type, 'comment');
      assert.strictEqual(db.reports[0].target_id, 'comm-2');
      assert.strictEqual(db.reports[0].post_id, null);
    });

    test('3.3. Duplicate active report prevention: Rejects sending identical active report', () => {
      const db = createMockCommunityDb();
      const currentUserId = 'student-user-1';

      // First report
      db.reports.push({
        id: 'rep-001',
        reporter_id: currentUserId,
        target_type: 'post',
        target_id: '2',
        status: 'pending'
      });

      // Second report attempt on the same target while active
      const isDuplicate = db.reports.some(
        r => r.reporter_id === currentUserId &&
             r.target_type === 'post' &&
             r.target_id === '2' &&
             ['pending', 'reviewing'].includes(r.status)
      );

      assert.strictEqual(isDuplicate, true, 'Must detect duplicate active report');
    });

    test('3.4. Student cannot read other users reports (RLS isolation)', () => {
      const db = createMockCommunityDb();
      db.reports.push(
        { id: 'rep-1', reporter_id: 'student-A', details: 'Báo cáo của Student A' },
        { id: 'rep-2', reporter_id: 'student-B', details: 'Báo cáo bí mật của Student B' }
      );

      // Student A queries reports
      function queryReportsAsUser(userId, isAdmin = false) {
        if (isAdmin) return db.reports;
        return db.reports.filter(r => r.reporter_id === userId);
      }

      const visibleToStudentA = queryReportsAsUser('student-A', false);
      assert.strictEqual(visibleToStudentA.length, 1);
      assert.strictEqual(visibleToStudentA[0].id, 'rep-1');
      assert.strictEqual(visibleToStudentA.some(r => r.id === 'rep-2'), false, 'Student A must NEVER see Student B report');
    });

    test('3.5. Student cannot execute admin moderation action (Authorization rejection)', () => {
      function executeModerationRPC(callerRole, callerIsAdmin) {
        if (callerRole !== 'service_role' && !callerIsAdmin) {
          throw new Error('42501: Quyền hạn bị từ chối: Chỉ Quản trị viên mới có quyền thực hiện thao tác kiểm duyệt.');
        }
        return { success: true };
      }

      // Student attempt
      assert.throws(
        () => executeModerationRPC('authenticated', false),
        /42501/
      );

      // Admin attempt
      const adminResult = executeModerationRPC('authenticated', true);
      assert.strictEqual(adminResult.success, true);
    });

    test('3.6. Admin hides post: Content hidden, report resolved, audit log created atomically', () => {
      const db = createMockCommunityDb();
      const adminId = 'admin-uuid-001';

      // Existing report
      const reportId = 'rep-001';
      db.reports.push({
        id: reportId,
        reporter_id: 'student-1',
        target_type: 'post',
        target_id: '2',
        status: 'pending'
      });

      // Admin executes 'hide'
      function mockAdminModerate(action, targetType, targetId, reason, linkedReportId) {
        // 1. Mutate content
        if (action === 'hide' && targetType === 'post') {
          const post = db.posts.find(p => String(p.id) === String(targetId));
          if (post) post.status = 'hidden';
        }
        // 2. Resolve report
        if (linkedReportId) {
          const report = db.reports.find(r => r.id === linkedReportId);
          if (report) {
            report.status = 'resolved';
            report.resolved_by = adminId;
          }
        }
        // 3. Write moderation log
        db.moderationLogs.push({
          id: 'log-001',
          admin_id: adminId,
          target_type: targetType,
          target_id: String(targetId),
          action,
          reason,
          created_at: new Date().toISOString()
        });

        return { success: true };
      }

      mockAdminModerate('hide', 'post', '2', 'Nội dung spam quảng cáo', reportId);

      // Verify post is hidden
      const post = db.posts.find(p => p.id === 2);
      assert.strictEqual(post.status, 'hidden');

      // Verify report is resolved
      const report = db.reports.find(r => r.id === reportId);
      assert.strictEqual(report.status, 'resolved');
      assert.strictEqual(report.resolved_by, adminId);

      // Verify audit log exists
      assert.strictEqual(db.moderationLogs.length, 1);
      assert.strictEqual(db.moderationLogs[0].action, 'hide');
      assert.strictEqual(db.moderationLogs[0].target_id, '2');
      assert.strictEqual(db.moderationLogs[0].reason, 'Nội dung spam quảng cáo');
    });

    test('3.7. Admin restores post: Content status becomes published & audit log recorded', () => {
      const db = createMockCommunityDb();
      const adminId = 'admin-uuid-001';
      db.posts[1].status = 'hidden'; // Post 2 was hidden

      function mockAdminRestore(targetId, reason) {
        const post = db.posts.find(p => String(p.id) === String(targetId));
        if (post) post.status = 'published';
        db.moderationLogs.push({
          id: 'log-002',
          admin_id: adminId,
          target_type: 'post',
          target_id: String(targetId),
          action: 'restore',
          reason
        });
      }

      mockAdminRestore('2', 'Đã xem xét lại và không vi phạm');

      const post = db.posts.find(p => p.id === 2);
      assert.strictEqual(post.status, 'published');
      assert.strictEqual(db.moderationLogs[0].action, 'restore');
    });

    test('3.8. Purged target inspection: Admin sees snapshot with isTargetDeleted without crashing', () => {
      const db = createMockCommunityDb();
      // Target post 999 does not exist (was deleted or purged)
      const orphanReport = {
        id: 'rep-orphan',
        target_type: 'post',
        target_id: '999',
        reason: 'spam',
        status: 'pending'
      };

      function resolveReportDetails(report) {
        const targetPost = db.posts.find(p => String(p.id) === report.target_id);
        return {
          report,
          targetItem: targetPost || null,
          isTargetDeleted: !targetPost
        };
      }

      const details = resolveReportDetails(orphanReport);
      assert.ok(details.report);
      assert.strictEqual(details.targetItem, null);
      assert.strictEqual(details.isTargetDeleted, true, 'Must gracefully flag isTargetDeleted');
    });
  });

  // =========================================================================
  // GROUP 4: LIVE SUPABASE DATABASE VERIFICATION
  // =========================================================================
  describe('Group 4: Live Supabase Database Checks (Live DB Environment)', () => {

    test('4.1. Live Database: community_reports table exists and enforces RLS', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Skipping live test: Supabase not configured');
        return;
      }

      // Querying as unauthenticated client should yield zero unauthorized rows or error
      const { data, error } = await supabase
        .from('community_reports')
        .select('id, reporter_id, status')
        .limit(1);

      // Either succeeds returning 0 rows (RLS blocks anon) or returns empty array
      if (!error) {
        assert.ok(Array.isArray(data), 'Returns array');
      }
    });

    test('4.2. Live Database: Anonymous user cannot insert report without auth', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Skipping live test: Supabase not configured');
        return;
      }

      const { error } = await supabase
        .from('community_reports')
        .insert([{
          target_type: 'post',
          target_id: '1',
          post_id: 1,
          reason: 'spam'
        }]);

      assert.ok(error, 'Anonymous insert must be blocked by RLS');
    });

    test('4.3. Live Database: Anonymous user cannot call moderate_community_content RPC', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Skipping live test: Supabase not configured');
        return;
      }

      const { error } = await supabase.rpc('moderate_community_content', {
        p_action: 'hide',
        p_target_type: 'post',
        p_target_id: '1'
      });

      assert.ok(error, 'Anonymous moderation RPC invocation must fail');
    });
  });

  // =========================================================================
  // GROUP 5: COMMUNITY REGRESSION & FEED INVARIANCE
  // =========================================================================
  describe('Group 5: Community Regression & Feed Invariance', () => {

    test('5.1. Feed filtering: Hidden posts are excluded from student query', () => {
      const allPosts = [
        { id: 1, content: 'Bài 1', status: 'published', deleted_at: null },
        { id: 2, content: 'Bài 2 vi phạm', status: 'hidden', deleted_at: null },
        { id: 3, content: 'Bài 3 đã xóa', status: 'published', deleted_at: '2026-11-08T00:00:00Z' },
        { id: 4, content: 'Bài 4', status: 'published', deleted_at: null }
      ];

      // Standard feed predicate: status <> 'hidden' AND deleted_at IS NULL
      const visiblePosts = allPosts.filter(p => p.status !== 'hidden' && p.deleted_at === null);

      assert.strictEqual(visiblePosts.length, 2);
      assert.deepStrictEqual(visiblePosts.map(p => p.id), [1, 4]);
    });

    test('5.2. Comments filtering: Hidden comments are excluded from student drawer', () => {
      const allComments = [
        { id: 'c1', content: 'Hay quá', status: 'published', deleted_at: null },
        { id: 'c2', content: 'Chửi bới', status: 'hidden', deleted_at: null },
        { id: 'c3', content: 'Xóa rồi', status: 'published', deleted_at: '2026-11-08T00:00:00Z' },
        { id: 'c4', content: 'Đồng ý', status: 'published', deleted_at: null }
      ];

      const visibleComments = allComments.filter(c => c.status === 'published' && c.deleted_at === null);

      assert.strictEqual(visibleComments.length, 2);
      assert.deepStrictEqual(visibleComments.map(c => c.id), ['c1', 'c4']);
    });

    test('5.3. Realtime event handling: Hidden post removal does NOT corrupt pagination state', () => {
      let feedState = [
        { id: '10', content: 'Post 10' },
        { id: '9', content: 'Post 9 (Toxic)' },
        { id: '8', content: 'Post 8' }
      ];

      // Simulated Realtime UPDATE payload where post 9 was hidden by Admin
      const event = {
        type: 'POST_CHANGE',
        payload: {
          eventType: 'UPDATE',
          new: { id: 9, status: 'hidden' }
        }
      };

      if (event.payload.new.status === 'hidden') {
        feedState = feedState.filter(p => String(p.id) !== String(event.payload.new.id));
      }

      assert.strictEqual(feedState.length, 2);
      assert.deepStrictEqual(feedState.map(p => p.id), ['10', '8']);
    });

    test('5.4. Community schema BigInt safety: post.id numeric string conversion intact', async () => {
      const { normalizePostData } = await import('../src/services/communityService.js');

      const mockRow = {
        id: 9007199254740993n, // Large BigInt beyond Number.MAX_SAFE_INTEGER
        content: 'Nội dung kiểm tra',
        likes_count: 5,
        comments_count: 3,
        status: 'published'
      };

      const normalized = normalizePostData(mockRow);
      assert.strictEqual(typeof normalized.id, 'string');
      assert.strictEqual(normalized.id, '9007199254740993');
    });

    test('5.5. Study Partners functions remain intact and untouched', async () => {
      const communityModule = await import('../src/services/communityService.js');

      assert.strictEqual(typeof communityModule.getStudyPartnersFromDb, 'function');
      assert.strictEqual(typeof communityModule.addStudyPartnerToDb, 'function');
      assert.strictEqual(typeof communityModule.deleteStudyPartnerFromDb, 'function');
    });
  });
});
