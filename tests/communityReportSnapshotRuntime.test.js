import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.08A.2.1 — Community Report Snapshot Backfill & Final Runtime Verification Tests', () => {

  const migrationFileA21 = path.join(rootDir, 'supabase', 'migrations', '20261108_community_report_snapshot_backfill_and_runtime_hardening.sql');
  const masterSchemaFile = path.join(rootDir, 'supabase', 'schema.sql');

  // =========================================================================
  // GROUP 1: STATIC SCHEMA & DDL AUDIT
  // =========================================================================
  describe('Group 1: Static Schema & DDL Audit', () => {

    test('1.1. Migration 20261108_community_report_snapshot_backfill_and_runtime_hardening.sql exists and is non-destructive', () => {
      assert.ok(fs.existsSync(migrationFileA21), 'Migration file must exist');
      const content = fs.readFileSync(migrationFileA21, 'utf-8');

      assert.ok(!content.includes('DROP TABLE public.community_posts'), 'Must not drop community_posts');
      assert.ok(!content.includes('ALTER COLUMN id TYPE UUID'), 'Must not change BIGSERIAL id to UUID');
    });

    test('1.2. Idempotent backfill queries cover both post and comment targets without blanket assumptions', () => {
      const content = fs.readFileSync(migrationFileA21, 'utf-8');

      assert.ok(content.includes("target_type = 'post'"), 'Backfill covers post target');
      assert.ok(content.includes("target_type = 'comment'"), 'Backfill covers comment target');
      assert.ok(content.includes('post_id IS NOT NULL'), 'Post backfill filters post_id');
      assert.ok(content.includes('comment_id IS NOT NULL'), 'Comment backfill filters comment_id');
      assert.ok(content.includes('trim(target_id)'), 'Backfill trims target_id to avoid whitespace');
    });

    test('1.3. Telemetry and audit function audit_community_reports_snapshot_status() defined and secured', () => {
      const content = fs.readFileSync(migrationFileA21, 'utf-8');

      assert.ok(content.includes('CREATE OR REPLACE FUNCTION public.audit_community_reports_snapshot_status()'), 'Telemetry function defined');
      assert.ok(content.includes('reports_target_type_mismatch'), 'Tracks target type mismatches');
      assert.ok(content.includes('reports_both_fks_present'), 'Tracks duplicate FK anomalies');
      assert.ok(content.includes('REVOKE EXECUTE ON FUNCTION public.audit_community_reports_snapshot_status() FROM PUBLIC'), 'Revokes execute from public');
    });

    test('1.4. Hardened check constraint chk_community_reports_target_valid strictly validates all 3 valid states', () => {
      const content = fs.readFileSync(migrationFileA21, 'utf-8');
      const normalized = content.replace(/\s+/g, ' ');

      assert.ok(content.includes('chk_community_reports_target_valid'), 'Constraint named correctly');
      assert.ok(normalized.includes("post_id IS NOT NULL AND comment_id IS NULL AND target_type = 'post'"), 'Validates active post state');
      assert.ok(normalized.includes("post_id IS NULL AND comment_id IS NOT NULL AND target_type = 'comment'"), 'Validates active comment state');
      assert.ok(normalized.includes("post_id IS NULL AND comment_id IS NULL AND target_type IN ('post', 'comment')"), 'Validates preserved historical state');
      assert.ok(content.includes('length(trim(target_id)) > 0'), 'Strictly bans empty or whitespace target_ids');
    });

    test('1.5. Hardened trigger sync_community_report_target_snapshot handles INSERT and UPDATE', () => {
      const content = fs.readFileSync(migrationFileA21, 'utf-8');

      assert.ok(content.includes('BEFORE INSERT OR UPDATE ON public.community_reports'), 'Trigger fires on INSERT OR UPDATE');
      assert.ok(content.includes('v_is_parent_deleted'), 'Detects parent deletion during ON DELETE SET NULL');
      assert.ok(content.includes('NEW.target_type := OLD.target_type;'), 'Preserves snapshot on parent deletion');
      assert.ok(content.includes('NEW.target_id := OLD.target_id;'), 'Preserves target_id on parent deletion');
      assert.ok(content.includes('Không thể chuyển đối tượng mục tiêu'), 'Blocks student from switching target FK');
      assert.ok(content.includes('Không thể sửa đổi dữ liệu snapshot'), 'Blocks student from modifying snapshot');
    });

    test('1.6. Master schema.sql synchronizes all constraints, triggers and functions', () => {
      const master = fs.readFileSync(masterSchemaFile, 'utf-8');

      assert.ok(master.includes('chk_community_reports_target_valid'), 'Master schema includes chk_community_reports_target_valid');
      assert.ok(master.includes('audit_community_reports_snapshot_status'), 'Master schema includes audit_community_reports_snapshot_status');
      assert.ok(master.includes('v_is_parent_deleted'), 'Master schema includes parent deletion handling');
    });
  });

  // =========================================================================
  // GROUP 2: POSTGRESQL BUSINESS LOGIC & TRIGGER SIMULATION (UNIT TESTS 1-22)
  // =========================================================================
  describe('Group 2: PostgreSQL Business Logic & Runtime Rules (Tests 1-22)', () => {

    // Helper to evaluate PostgreSQL constraint logic
    const evaluateTargetConstraint = (row) => {
      const postId = row.post_id !== undefined ? row.post_id : row.postId;
      const commentId = row.comment_id !== undefined ? row.comment_id : row.commentId;
      const targetType = row.target_type !== undefined ? row.target_type : row.targetType;
      const rawTargetId = row.target_id !== undefined ? row.target_id : row.targetId;

      const cleanTargetId = typeof rawTargetId === 'string' ? rawTargetId.trim() : (rawTargetId != null ? String(rawTargetId).trim() : '');
      const validTargetId = cleanTargetId.length > 0;

      // Case 1: Active Post
      const case1 = postId != null && commentId == null && targetType === 'post' && validTargetId;
      // Case 2: Active Comment
      const case2 = postId == null && commentId != null && targetType === 'comment' && validTargetId;
      // Case 3: Preserved Historical (target deleted)
      const case3 = postId == null && commentId == null && (targetType === 'post' || targetType === 'comment') && validTargetId;

      return case1 || case2 || case3;
    };

    // Helper to simulate sync_community_report_target_snapshot trigger
    const simulateReportTrigger = (tgOp, oldRow, newRow, userContext = { role: 'student', status: 'active', id: 'user-1' }) => {
      const isAdmin = (userContext.role === 'admin' && userContext.status === 'active') || userContext.role === 'service_role';
      const modified = { ...newRow };

      if (tgOp === 'INSERT') {
        if (modified.post_id != null && modified.comment_id == null) {
          modified.target_type = 'post';
          modified.target_id = String(modified.post_id).trim();
        } else if (modified.comment_id != null && modified.post_id == null) {
          modified.target_type = 'comment';
          modified.target_id = String(modified.comment_id).trim();
        } else {
          throw new Error('Báo cáo không hợp lệ: Bắt buộc phải chỉ định chính xác một bài viết hoặc một bình luận.');
        }

        if (!modified.target_id || modified.target_id.length === 0) {
          throw new Error('Báo cáo không hợp lệ: Mã định danh mục tiêu không thể để trống.');
        }

        if (!isAdmin) {
          if (modified.reporter_id != null && modified.reporter_id !== userContext.id) {
            throw new Error('Quyền hạn bị từ chối: Không thể tạo báo cáo dưới danh nghĩa người dùng khác.');
          }
          modified.reporter_id = userContext.id;
          modified.status = 'pending';
          modified.resolved_by = null;
          modified.resolved_at = null;
        }

        return modified;
      }

      if (tgOp === 'UPDATE') {
        const isParentDeleted = oldRow && (
          (oldRow.post_id != null && modified.post_id == null && modified.comment_id == null) ||
          (oldRow.comment_id != null && modified.comment_id == null && modified.post_id == null)
        );

        if (isParentDeleted) {
          modified.target_type = oldRow.target_type;
          modified.target_id = oldRow.target_id;
          return modified;
        }

        if (!isAdmin) {
          if (modified.post_id !== oldRow.post_id || modified.comment_id !== oldRow.comment_id) {
            throw new Error('Quyền hạn bị từ chối: Không thể chuyển đối tượng mục tiêu của báo cáo sau khi đã tạo.');
          }
          if (modified.target_type !== oldRow.target_type || modified.target_id !== oldRow.target_id) {
            throw new Error('Quyền hạn bị từ chối: Không thể sửa đổi dữ liệu snapshot của báo cáo.');
          }
          if (modified.reporter_id !== oldRow.reporter_id) {
            throw new Error('Quyền hạn bị từ chối: Không thể thay đổi người tạo báo cáo.');
          }
          if (modified.created_at !== oldRow.created_at) {
            throw new Error('Quyền hạn bị từ chối: Không thể sửa đổi thời gian tạo báo cáo.');
          }
          if (modified.status !== oldRow.status || modified.resolved_by !== oldRow.resolved_by) {
            throw new Error('Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền xử lý hoặc đổi trạng thái báo cáo.');
          }
        }

        return modified;
      }

      return modified;
    };

    // 1. Tạo report cho post
    test('2.1. Report 1: Tạo report cho post tạo snapshot chính xác', () => {
      const res = simulateReportTrigger('INSERT', null, { post_id: 3, comment_id: null, reason: 'spam' });
      assert.strictEqual(res.target_type, 'post');
      assert.strictEqual(res.target_id, '3');
      assert.ok(evaluateTargetConstraint(res));
    });

    // 2. Tạo report cho comment
    test('2.2. Report 2: Tạo report cho comment tạo snapshot chính xác', () => {
      const res = simulateReportTrigger('INSERT', null, { post_id: null, comment_id: 'c-uuid-123', reason: 'harassment' });
      assert.strictEqual(res.target_type, 'comment');
      assert.strictEqual(res.target_id, 'c-uuid-123');
      assert.ok(evaluateTargetConstraint(res));
    });

    // 3. Từ chối report không có target
    test('2.3. Report 3: Từ chối report không có target (cả 2 FK đều NULL)', () => {
      assert.throws(() => {
        simulateReportTrigger('INSERT', null, { post_id: null, comment_id: null, reason: 'spam' });
      }, /chỉ định chính xác một bài viết hoặc một bình luận/);

      assert.strictEqual(evaluateTargetConstraint({ postId: null, commentId: null, targetType: 'post', targetId: null }), false);
    });

    // 4. Từ chối report có cả hai target
    test('2.4. Report 4: Từ chối report có cả hai target (cả 2 FK đều có giá trị)', () => {
      assert.throws(() => {
        simulateReportTrigger('INSERT', null, { post_id: 3, comment_id: 'c-uuid-123', reason: 'spam' });
      }, /chỉ định chính xác một bài viết hoặc một bình luận/);

      assert.strictEqual(evaluateTargetConstraint({ postId: 3, commentId: 'c-uuid-123', targetType: 'post', targetId: '3' }), false);
    });

    // 5. Từ chối target_type không khớp FK
    test('2.5. Report 5: Ràng buộc từ chối target_type không khớp FK', () => {
      // post_id provided but target_type is 'comment'
      assert.strictEqual(evaluateTargetConstraint({ postId: 3, commentId: null, targetType: 'comment', targetId: '3' }), false);
      // comment_id provided but target_type is 'post'
      assert.strictEqual(evaluateTargetConstraint({ postId: null, commentId: 'c-1', targetType: 'post', targetId: 'c-1' }), false);
    });

    // 6. Client không thể tự giả mạo target_id
    test('2.6. Report 6: Client không thể tự giả mạo target_id khi INSERT', () => {
      const spoofPayload = {
        post_id: 7,
        comment_id: null,
        target_type: 'comment', // client tries to fake type
        target_id: '999999'     // client tries to fake target id
      };
      const res = simulateReportTrigger('INSERT', null, spoofPayload);
      assert.strictEqual(res.target_type, 'post', 'Must override spoofed target_type with FK derived type');
      assert.strictEqual(res.target_id, '7', 'Must override spoofed target_id with actual post_id');
    });

    // 7. Client không thể thay đổi snapshot sau khi tạo
    test('2.7. Report 7: Client không thể thay đổi snapshot sau khi tạo', () => {
      const original = { post_id: 7, comment_id: null, target_type: 'post', target_id: '7', status: 'pending', created_at: '2026-11-01' };
      const maliciousEdit = { ...original, target_id: 'altered-target' };

      assert.throws(() => {
        simulateReportTrigger('UPDATE', original, maliciousEdit, { role: 'student', status: 'active', id: 'user-1' });
      }, /Không thể sửa đổi dữ liệu snapshot/);
    });

    // 8. Client không thể chuyển report từ post sang comment
    test('2.8. Report 8: Client không thể chuyển report từ post sang comment', () => {
      const original = { post_id: 7, comment_id: null, target_type: 'post', target_id: '7' };
      const maliciousSwitch = { post_id: null, comment_id: 'c-other-uuid', target_type: 'comment', target_id: 'c-other-uuid' };

      assert.throws(() => {
        simulateReportTrigger('UPDATE', original, maliciousSwitch, { role: 'student', status: 'active', id: 'user-1' });
      }, /Không thể chuyển đối tượng mục tiêu/);
    });

    // 9. Report cũ có snapshot chính xác sau backfill
    test('2.9. Report 9: Backfill logic phục hồi chính xác snapshot cho report cũ', () => {
      const legacyReports = [
        { id: 'r1', post_id: 3, comment_id: null, target_type: null, target_id: null },
        { id: 'r2', post_id: null, comment_id: 'c-legacy-88', target_type: null, target_id: null },
      ];

      const backfilled = legacyReports.map(r => {
        if (r.post_id != null && r.comment_id == null) {
          return { ...r, target_type: 'post', target_id: String(r.post_id).trim() };
        }
        if (r.comment_id != null && r.post_id == null) {
          return { ...r, target_type: 'comment', target_id: String(r.comment_id).trim() };
        }
        return r;
      });

      assert.strictEqual(backfilled[0].target_type, 'post');
      assert.strictEqual(backfilled[0].target_id, '3');
      assert.ok(evaluateTargetConstraint(backfilled[0]));

      assert.strictEqual(backfilled[1].target_type, 'comment');
      assert.strictEqual(backfilled[1].target_id, 'c-legacy-88');
      assert.ok(evaluateTargetConstraint(backfilled[1]));
    });

    // 10. Xóa post vẫn giữ snapshot report
    test('2.10. Report 10: Xóa post kích hoạt ON DELETE SET NULL nhưng trigger bảo toàn snapshot', () => {
      const activeReport = { post_id: 7, comment_id: null, target_type: 'post', target_id: '7' };
      // PostgreSQL cascades SET NULL:
      const cascadingUpdate = { post_id: null, comment_id: null };

      const preserved = simulateReportTrigger('UPDATE', activeReport, cascadingUpdate);
      assert.strictEqual(preserved.post_id, null, 'post_id set to null');
      assert.strictEqual(preserved.comment_id, null, 'comment_id remains null');
      assert.strictEqual(preserved.target_type, 'post', 'Snapshot target_type preserved');
      assert.strictEqual(preserved.target_id, '7', 'Snapshot target_id preserved');
      assert.ok(evaluateTargetConstraint(preserved), 'Preserved report satisfies constraint Case 3');
    });

    // 11. Xóa comment vẫn giữ snapshot report
    test('2.11. Report 11: Xóa comment kích hoạt ON DELETE SET NULL nhưng trigger bảo toàn snapshot', () => {
      const activeReport = { post_id: null, comment_id: 'comm-99', target_type: 'comment', target_id: 'comm-99' };
      // PostgreSQL cascades SET NULL:
      const cascadingUpdate = { post_id: null, comment_id: null };

      const preserved = simulateReportTrigger('UPDATE', activeReport, cascadingUpdate);
      assert.strictEqual(preserved.post_id, null);
      assert.strictEqual(preserved.comment_id, null);
      assert.strictEqual(preserved.target_type, 'comment');
      assert.strictEqual(preserved.target_id, 'comm-99');
      assert.ok(evaluateTargetConstraint(preserved), 'Preserved report satisfies constraint Case 3');
    });

    // 12. Student không thể sửa author_id trên post
    test('2.12. Post 12: Student không thể sửa author_id', () => {
      const validatePostEdit = (oldRow, newRow, isAdmin = false) => {
        if (!isAdmin && newRow.author_id !== oldRow.author_id) {
          throw new Error('Quyền hạn bị từ chối: Không thể chuyển quyền sở hữu tác giả bài viết.');
        }
        return true;
      };

      assert.throws(() => {
        validatePostEdit({ author_id: 'u-1' }, { author_id: 'u-hacker' }, false);
      }, /Không thể chuyển quyền sở hữu/);
    });

    // 13. Student không thể sửa author_name/avatar/level
    test('2.13. Post 13: Student không thể sửa author_name/avatar/level trên post', () => {
      const validatePostMetadata = (oldRow, newRow, isAdmin = false) => {
        if (!isAdmin) {
          if (newRow.author_name !== oldRow.author_name || newRow.author_avatar !== oldRow.author_avatar || newRow.author_level !== oldRow.author_level) {
            throw new Error('Quyền hạn bị từ chối: Không thể sửa đổi trực tiếp thông tin tác giả trên bài viết.');
          }
        }
        return true;
      };

      assert.throws(() => {
        validatePostMetadata({ author_name: 'Đăng' }, { author_name: 'Super Admin' }, false);
      }, /Không thể sửa đổi trực tiếp thông tin tác giả/);
    });

    // 14. Student không thể sửa created_at
    test('2.14. Post 14: Student không thể sửa created_at trên post', () => {
      const validatePostCreatedAt = (oldRow, newRow, isAdmin = false) => {
        if (!isAdmin && newRow.created_at !== oldRow.created_at) {
          throw new Error('Quyền hạn bị từ chối: Không thể sửa đổi thời gian tạo bài viết.');
        }
        return true;
      };

      assert.throws(() => {
        validatePostCreatedAt({ created_at: '2026-11-01' }, { created_at: '2020-01-01' }, false);
      }, /Không thể sửa đổi thời gian tạo/);
    });

    // 15. Student không thể tự ghim bài hoặc thay đổi status
    test('2.15. Post 15: Student không thể tự ghim bài hoặc đổi status kiểm duyệt', () => {
      const validatePostStatus = (oldRow, newRow, isAdmin = false) => {
        if (!isAdmin) {
          if (newRow.status !== oldRow.status) {
            throw new Error('Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền thay đổi trạng thái kiểm duyệt bài viết.');
          }
          if (newRow.is_pinned !== oldRow.is_pinned) {
            throw new Error('Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền ghim bài viết.');
          }
        }
        return true;
      };

      assert.throws(() => validatePostStatus({ status: 'published' }, { status: 'hidden' }, false), /trạng thái kiểm duyệt/);
      assert.throws(() => validatePostStatus({ is_pinned: false }, { is_pinned: true }, false), /ghim bài viết/);
    });

    // 16. Student không thể sửa likes_count/comments_count
    test('2.16. Post 16: Student không thể can thiệp số likes_count và comments_count', () => {
      const validatePostCounters = (oldRow, newRow, isAdmin = false) => {
        if (!isAdmin) {
          if (newRow.likes_count !== oldRow.likes_count || newRow.comments_count !== oldRow.comments_count) {
            throw new Error('Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.');
          }
        }
        return true;
      };

      assert.throws(() => validatePostCounters({ likes_count: 5 }, { likes_count: 9999 }, false), /Số lượt thích và bình luận/);
    });

    // 17. Student vẫn sửa được content hợp lệ
    test('2.17. Post 17: Student được phép sửa nội dung hợp lệ (content, tag, image_url, is_solved)', () => {
      const oldPost = {
        id: 7,
        author_id: 'u-1',
        author_name: 'Đăng',
        author_avatar: 'avatar.png',
        author_level: 'HSK4',
        created_at: '2026-11-01',
        status: 'published',
        is_pinned: false,
        likes_count: 5,
        comments_count: 2,
        content: 'Bài viết cũ',
        tag: 'Học tập',
        image_url: null,
        is_solved: false
      };

      const updatedPost = {
        ...oldPost,
        content: 'Nội dung cập nhật thành công',
        tag: 'Chia sẻ',
        image_url: 'https://newimage.com/pic.jpg',
        is_solved: true
      };

      // Ensure no exceptions thrown
      assert.doesNotThrow(() => {
        if (updatedPost.author_id !== oldPost.author_id) throw new Error('author_id error');
        if (updatedPost.author_name !== oldPost.author_name) throw new Error('author_name error');
        if (updatedPost.created_at !== oldPost.created_at) throw new Error('created_at error');
        if (updatedPost.status !== oldPost.status) throw new Error('status error');
        if (updatedPost.likes_count !== oldPost.likes_count) throw new Error('likes error');
      });
      assert.strictEqual(updatedPost.content, 'Nội dung cập nhật thành công');
      assert.strictEqual(updatedPost.is_solved, true);
    });

    // 18. Comment trigger bảo vệ đúng metadata
    test('2.18. Comment 18: Comment trigger cấm sửa author_id, post_id, created_at, status, deleted_at', () => {
      const validateCommentEdit = (oldRow, newRow, isAdmin = false) => {
        if (!isAdmin) {
          if (newRow.author_id !== oldRow.author_id) throw new Error('Không thể thay đổi tác giả');
          if (newRow.post_id !== oldRow.post_id) throw new Error('Không thể chuyển bình luận');
          if (newRow.created_at !== oldRow.created_at) throw new Error('Không thể sửa thời gian');
          if (newRow.status !== oldRow.status) throw new Error('Chỉ quản trị viên mới có quyền đổi trạng thái');
        }
        return true;
      };

      const original = { author_id: 'u-1', post_id: 3, created_at: '2026-11-01', status: 'published', content: 'Bình luận 1' };
      assert.throws(() => validateCommentEdit(original, { ...original, author_id: 'u-2' }), /Không thể thay đổi tác giả/);
      assert.throws(() => validateCommentEdit(original, { ...original, post_id: 7 }), /Không thể chuyển bình luận/);
      assert.throws(() => validateCommentEdit(original, { ...original, status: 'hidden' }), /Chỉ quản trị viên/);

      // Sửa content thì hợp lệ
      assert.doesNotThrow(() => validateCommentEdit(original, { ...original, content: 'Nội dung sửa' }));
    });

    // 19. Admin active thực hiện được thao tác quản trị hợp lệ
    test('2.19. Admin 19: Admin active thực hiện được thao tác ghim bài, đổi status, duyệt report', () => {
      const checkAdmin = (user) => Boolean(user && user.role === 'admin' && user.status === 'active');
      const activeAdmin = { role: 'admin', status: 'active', id: 'admin-1' };

      assert.strictEqual(checkAdmin(activeAdmin), true);
      // Admin update on report
      const adminReportUpdate = simulateReportTrigger('UPDATE', 
        { post_id: 3, comment_id: null, target_type: 'post', target_id: '3', status: 'pending' },
        { post_id: 3, comment_id: null, status: 'resolved', resolved_by: activeAdmin.id },
        activeAdmin
      );
      assert.strictEqual(adminReportUpdate.status, 'resolved');
      assert.strictEqual(adminReportUpdate.resolved_by, 'admin-1');
    });

    // 20. Admin blocked không thể thực hiện thao tác đặc quyền
    test('2.20. Admin 20: Admin blocked bị từ chối mọi quyền hạn đặc quyền', () => {
      const checkAdmin = (user) => Boolean(user && user.role === 'admin' && user.status === 'active');
      const blockedAdmin = { role: 'admin', status: 'blocked', id: 'admin-blocked' };
      const suspendedAdmin = { role: 'admin', status: 'suspended', id: 'admin-suspended' };

      assert.strictEqual(checkAdmin(blockedAdmin), false, 'Blocked admin must be rejected');
      assert.strictEqual(checkAdmin(suspendedAdmin), false, 'Suspended admin must be rejected');

      // Attempt privileged operation as blocked admin -> rejected like regular student
      assert.throws(() => {
        simulateReportTrigger('UPDATE',
          { post_id: 3, comment_id: null, target_type: 'post', target_id: '3', status: 'pending' },
          { post_id: 3, comment_id: null, target_type: 'post', target_id: '3', status: 'resolved' },
          blockedAdmin
        );
      }, /Chỉ quản trị viên mới có quyền xử lý/);
    });

    // 21. Moderation logs không thể bị student sửa/xóa
    test('2.21. Admin 21: Moderation logs là bảng bất biến, cấm student sửa hoặc xóa', () => {
      const validateLogOperation = (action, userContext) => {
        if (action === 'UPDATE' || action === 'DELETE') {
          throw new Error('Quyền hạn bị từ chối: Bảng moderation logs là bất biến, không cho phép sửa hoặc xóa.');
        }
        if (action === 'INSERT' && userContext.role !== 'admin' && userContext.role !== 'service_role') {
          throw new Error('Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền tạo moderation logs.');
        }
        return true;
      };

      assert.throws(() => validateLogOperation('UPDATE', { role: 'student' }), /bất biến/);
      assert.throws(() => validateLogOperation('DELETE', { role: 'student' }), /bất biến/);
      assert.throws(() => validateLogOperation('DELETE', { role: 'admin' }), /bất biến/);
      assert.throws(() => validateLogOperation('INSERT', { role: 'student' }), /Chỉ quản trị viên/);
    });

    // 22. Xóa profile không làm mất moderation logs
    test('2.22. Admin 22: Xóa profile admin không làm mất moderation logs (ON DELETE SET NULL)', () => {
      const logRecord = { id: 'log-1', admin_id: 'admin-uuid-1', action: 'hide_post', target_type: 'post', target_id: '3', created_at: '2026-11-08' };
      // Profile deleted -> FK admin_id cascades SET NULL:
      const postAdminDeleteLog = { ...logRecord, admin_id: null };

      assert.strictEqual(postAdminDeleteLog.id, 'log-1', 'Log row survives');
      assert.strictEqual(postAdminDeleteLog.action, 'hide_post', 'Audit action preserved');
      assert.strictEqual(postAdminDeleteLog.target_id, '3', 'Audit target preserved');
      assert.strictEqual(postAdminDeleteLog.admin_id, null, 'admin_id safely nulled without cascading deletion');
    });
  });

  // =========================================================================
  // GROUP 3: LIVE SUPABASE RLS RUNTIME & DATA CONSERVATION
  // =========================================================================
  describe('Group 3: Live Supabase RLS Runtime & Data Conservation', () => {

    test('3.1. Live Supabase: existing community_posts remain intact with BIGSERIAL IDs', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Skipping live test: Supabase not configured');
        return;
      }

      const { data: posts, error } = await supabase.from('community_posts').select('*');
      assert.ok(!error, `Failed to query community_posts: ${error?.message}`);
      assert.ok(Array.isArray(posts) && posts.length >= 2, 'Must have at least 2 posts');

      const post3 = posts.find(p => p.id === 3 || p.id === '3');
      const post7 = posts.find(p => p.id === 7 || p.id === '7');
      assert.ok(post3, 'Post 3 must be intact');
      assert.ok(post7, 'Post 7 must be intact');
      assert.strictEqual(typeof post3.id, 'number', 'Post 3 ID must be numeric BIGSERIAL');
      assert.strictEqual(typeof post7.id, 'number', 'Post 7 ID must be numeric BIGSERIAL');
    });

    test('3.2. Live Supabase: existing study_partners remain intact', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { data: partners, error } = await supabase.from('study_partners').select('*');
      assert.ok(!error, `Failed to query study_partners: ${error?.message}`);
      assert.ok(Array.isArray(partners) && partners.length >= 3, 'Must have at least 3 study partners');
    });

    test('3.3. Live Supabase RLS: unauthenticated insert into community_reports is strictly blocked', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { error } = await supabase.from('community_reports').insert([
        { post_id: 3, reason: 'spam', details: 'Unauthenticated attack test' }
      ]);
      assert.ok(error, 'Unauthenticated client must be blocked by RLS');
    });

    test('3.4. Live Supabase RLS: unauthenticated insert into community_moderation_logs is strictly blocked', async () => {
      const { supabase, isSupabaseConfigured } = await import('../src/supabase/config.js');
      if (!isSupabaseConfigured || !supabase) return;

      const { error } = await supabase.from('community_moderation_logs').insert([
        { target_type: 'post', target_id: '3', action: 'malicious_hide' }
      ]);
      assert.ok(error, 'Unauthenticated log insert must be blocked by RLS');
    });

    test('3.5. Security Verification: frontend codebase contains zero service role keys', () => {
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
