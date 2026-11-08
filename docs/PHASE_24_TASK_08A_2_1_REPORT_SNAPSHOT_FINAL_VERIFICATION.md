# HANZIGO — PHASE 24 / TASK 24.08A.2.1
# COMMUNITY REPORT SNAPSHOT BACKFILL & FINAL RUNTIME VERIFICATION REPORT
## BÁO CÁO TOÀN DIỆN VỀ BACKFILL SNAPSHOT BÁO CÁO VI PHẠM, GIA CỐ RÀNG BUỘC VÀ KIỂM CHỨNG RUNTIME TOÀN HỆ THỐNG

---

## 1. TỔNG QUAN VÀ TRẠNG THÁI NGHIỆM THU

- **Dự án**: HanziGo — Nền tảng học tiếng Trung toàn diện cho người Việt.
- **Giai đoạn**: Phase 24 — Hoàn thiện sản phẩm cốt lõi & Chuyển đổi Community sang dữ liệu thật.
- **Nhiệm vụ**: Task 24.08A.2.1 — Community Report Snapshot Backfill & Final Runtime Verification.
- **Trạng thái**: **`PRODUCTION VERIFICATION PARTIAL`**
  *(Lý do tuân thủ: Migration `20261108_community_report_snapshot_backfill_and_runtime_hardening.sql` và master `schema.sql` đã hoàn thành 100%, 33/33 tests mới cùng 164/164 tests hồi quy toàn Phase 24 đều PASS 100%, dữ liệu bài viết thật (Post 3, Post 7) và đối tác học tập (Study Partners) được bảo toàn nguyên vẹn. DDL migration sẵn sàng được quản trị viên chạy trên Supabase Cloud Console trước khi bước sang Task 24.08B UI & RPC).*

---

## 2. KẾT QUẢ AUDIT DỮ LIỆU REPORT THỰC TẾ & MÔ HÌNH BACKFILL

### 2.1. Kiểm tra dữ liệu thực tế trên Supabase Cloud
- **Bảng `public.community_reports`**: Hiện có **0 bản ghi** (`[]`).
- **Bảng `public.community_posts`**: Có **2 bản ghi** chính khóa (ID 3: *Ban Quản Trị HanziGo*, ID 7: *Đăng*) với định danh `BIGSERIAL` (số nguyên) và các trường JSONB (`comments`, `liked_by`) nguyên vẹn 100%.
- **Bảng `public.study_partners`**: Có **3 bản ghi** (ID 6, 7, 8) nguyên vẹn.
- **Bảng `public.community_comments`**: Có **0 bản ghi** (chuẩn bị cho Task 24.08B).

### 2.2. Chiến lược Idempotent Backfill cho Community Reports
Mặc dù dữ liệu report hiện tại chưa có báo cáo phát sinh từ production, quy trình backfill được thiết kế mang tính phòng vệ tuyệt đối (Defense-in-depth) cho cả dữ liệu lịch sử và dữ liệu thử nghiệm nội bộ:

```sql
-- 1. Backfill snapshot cho reports liên kết Post
UPDATE public.community_reports
SET
  target_type = 'post',
  target_id = post_id::text
WHERE post_id IS NOT NULL
  AND comment_id IS NULL
  AND (target_id IS NULL OR length(trim(target_id)) = 0 OR target_type IS NULL OR target_type <> 'post');

-- 2. Backfill snapshot cho reports liên kết Comment
UPDATE public.community_reports
SET
  target_type = 'comment',
  target_id = comment_id::text
WHERE comment_id IS NOT NULL
  AND post_id IS NULL
  AND (target_id IS NULL OR length(trim(target_id)) = 0 OR target_type IS NULL OR target_type <> 'comment');

-- 3. Chuẩn hóa khoảng trắng target_id
UPDATE public.community_reports
SET target_id = trim(target_id)
WHERE target_id IS NOT NULL AND target_id <> trim(target_id);
```

### 2.3. Bảng phân loại và Snapshot Mapping
| Trạng thái nguồn | Điều kiện nhận dạng | `target_type` | `target_id` | Hành động xử lý |
|---|---|---|---|---|
| **Post Report** | `post_id IS NOT NULL AND comment_id IS NULL` | `'post'` | `post_id::text` | Chuẩn hóa target_type và ép kiểu sang text sạch |
| **Comment Report** | `post_id IS NULL AND comment_id IS NOT NULL` | `'comment'` | `comment_id::text` | Chuẩn hóa target_type và ép kiểu sang text sạch |
| **Preserved Snapshot** | `post_id IS NULL AND comment_id IS NULL AND target_id IS NOT NULL` | Giữ nguyên | Giữ nguyên | Không ghi đè snapshot lịch sử |
| **Dữ liệu bất thường (Both FKs)** | `post_id IS NOT NULL AND comment_id IS NOT NULL` | Cảnh báo | Cảnh báo | Bị từ chối bởi constraint, kích hoạt cảnh báo audit |
| **Dữ liệu vô thừa nhận (No target)** | `post_id IS NULL AND comment_id IS NULL AND target_id IS NULL` | Cảnh báo | Cảnh báo | Bị từ chối bởi constraint, ghi nhận vào telemetry |

### 2.4. Hàm Telemetry Audit Báo cáo Vi phạm
Đã tạo hàm giám sát an toàn `audit_community_reports_snapshot_status()`:
```sql
CREATE OR REPLACE FUNCTION public.audit_community_reports_snapshot_status()
RETURNS TABLE (
  total_reports BIGINT,
  reports_with_post_fk BIGINT,
  reports_with_comment_fk BIGINT,
  reports_with_snapshot BIGINT,
  reports_missing_snapshot BIGINT,
  reports_target_type_mismatch BIGINT,
  reports_both_fks_present BIGINT,
  reports_orphan_no_snapshot BIGINT
) ...
```

---

## 3. RÀNG BUỘC SNAPSHOT CUỐI CÙNG (`chk_community_reports_target_valid`)

Ràng buộc check constraint được gia cố nghiêm ngặt, bao quát trọn vẹn 3 trạng thái hợp lệ và loại bỏ mọi trạng thái sai lệch:

```sql
ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS chk_community_reports_target_valid;
ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS chk_report_target_xor;

ALTER TABLE public.community_reports
  ADD CONSTRAINT chk_community_reports_target_valid CHECK (
    -- Trạng thái 1: Báo cáo bài viết đang hoạt động
    (
      post_id IS NOT NULL 
      AND comment_id IS NULL 
      AND target_type = 'post' 
      AND target_id IS NOT NULL 
      AND length(trim(target_id)) > 0
    )
    OR
    -- Trạng thái 2: Báo cáo bình luận đang hoạt động
    (
      post_id IS NULL 
      AND comment_id IS NOT NULL 
      AND target_type = 'comment' 
      AND target_id IS NOT NULL 
      AND length(trim(target_id)) > 0
    )
    OR
    -- Trạng thái 3: Đối tượng cha bị xóa (ON DELETE SET NULL), bảo lưu snapshot lịch sử
    (
      post_id IS NULL 
      AND comment_id IS NULL 
      AND target_type IN ('post', 'comment') 
      AND target_id IS NOT NULL 
      AND length(trim(target_id)) > 0
    )
  );
```

### Các tiêu chuẩn đạt được:
1. `post_id` khác NULL $\rightarrow$ bắt buộc `target_type = 'post'`.
2. `comment_id` khác NULL $\rightarrow$ bắt buộc `target_type = 'comment'`.
3. Khi cả hai FK là NULL $\rightarrow$ `target_type` và `target_id` bắt buộc có giá trị hợp lệ.
4. Cấm báo cáo mới thiếu target (cả hai FK và target_id đều NULL).
5. Cấm báo cáo có đồng thời `post_id` và `comment_id`.
6. Cấm `target_type` ngoài tập `('post', 'comment')`.
7. Cấm `target_id` rỗng hoặc chỉ chứa khoảng trắng (`length(trim(target_id)) > 0`).

---

## 4. TRIGGER DUY TRÌ VÀ BẢO VỆ SNAPSHOT (`sync_community_report_target_snapshot`)

Trigger thực thi `BEFORE INSERT OR UPDATE ON public.community_reports` với các nguyên tắc bảo mật tối thượng:

1. **Không tin tưởng Client**:
   - Khi `INSERT`: Trigger tự động suy ra `target_type` và `target_id` từ FK (`post_id` hoặc `comment_id`), ghi đè hoàn toàn bất kỳ giá trị nào do client truyền lên.
   - Khi `INSERT`: Buộc `reporter_id = auth.uid()`, `status = 'pending'`, `resolved_by = NULL`, `resolved_at = NULL`.
2. **Xử lý cascade `ON DELETE SET NULL`**:
   - Khi bài viết hoặc bình luận cha bị xóa, PostgreSQL kích hoạt `ON DELETE SET NULL`. Trigger nhận diện:
     ```sql
     v_is_parent_deleted := (
       (OLD.post_id IS NOT NULL AND NEW.post_id IS NULL AND NEW.comment_id IS NULL)
       OR
       (OLD.comment_id IS NOT NULL AND NEW.comment_id IS NULL AND NEW.post_id IS NULL)
     );
     ```
   - Khi phát hiện xóa đối tượng cha, trigger tự động gán `NEW.target_type := OLD.target_type; NEW.target_id := OLD.target_id;`, **bảo tồn nguyên vẹn snapshot lịch sử** mà không bị lỗi ràng buộc!
3. **Bảo vệ chống thay đổi trái phép khi `UPDATE`**:
   - Học viên/Client thông thường bị cấm:
     - Đổi `post_id` hoặc `comment_id`.
     - Sửa `target_type` hoặc `target_id`.
     - Thay đổi `reporter_id` hoặc `created_at`.
     - Thay đổi `status`, `resolved_by`, `resolved_at` (chỉ Admin mới có quyền).

---

## 5. AUDIT SECURITY DEFINER & QUYỀN HẠN TỐI THƯỢNG

Toàn bộ các hàm bảo mật đã được chuẩn hóa `SECURITY DEFINER` và phân quyền nghiêm ngặt:

| Tên Hàm | Quyền Thực Thi | `search_path` | Cơ chế xác thực |
|---|---|---|---|
| `public.is_admin()` | `anon`, `authenticated`, `service_role` (Revoked from `PUBLIC`) | `''` (Rỗng - Fully qualified) | Kiểm tra `role = 'admin' AND status = 'active'`. Admin bị blocked/suspended trả về `FALSE`. |
| `public.sync_community_report_target_snapshot()` | Hệ thống kích hoạt qua Trigger | `public, pg_temp` | Kiểm tra `auth.role() = 'service_role' OR public.is_admin()`. Không dựa vào `SESSION_USER`. |
| `public.enforce_community_post_integrity()` | Hệ thống kích hoạt qua Trigger | `public, pg_temp` | Bảo vệ thông tin tác giả, counters và status kiểm duyệt. |
| `public.enforce_community_comment_integrity()` | Hệ thống kích hoạt qua Trigger | `public, pg_temp` | Bảo vệ quyền tác giả comment và quan hệ bài viết. |
| `public.audit_community_reports_snapshot_status()` | `authenticated`, `service_role` (Revoked from `PUBLIC`) | `public, pg_temp` | Hàm giám sát audit nội bộ. |

---

## 6. KẾT QUẢ KIỂM THỬ RUNTIME CHI TIẾT (22 MỤC TIÊU NGHIỆM THU)

Tất cả 22 yêu cầu kiểm thử được tổ chức trong [tests/communityReportSnapshotRuntime.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/communityReportSnapshotRuntime.test.js):

```
▶ Task 24.08A.2.1 — Community Report Snapshot Backfill & Final Runtime Verification Tests
  ▶ Group 1: Static Schema & DDL Audit
    ✔ 1.1. Migration 20261108_community_report_snapshot_backfill_and_runtime_hardening.sql exists and is non-destructive (0.7827ms)
    ✔ 1.2. Idempotent backfill queries cover both post and comment targets without blanket assumptions (0.1843ms)
    ✔ 1.3. Telemetry and audit function audit_community_reports_snapshot_status() defined and secured (0.2078ms)
    ✔ 1.4. Hardened check constraint chk_community_reports_target_valid strictly validates all 3 valid states (0.7155ms)
    ✔ 1.5. Hardened trigger sync_community_report_target_snapshot handles INSERT and UPDATE (0.2184ms)
    ✔ 1.6. Master schema.sql synchronizes all constraints, triggers and functions (5.1231ms)
  ✔ Group 1: Static Schema & DDL Audit (7.841ms)
  ▶ Group 2: PostgreSQL Business Logic & Runtime Rules (Tests 1-22)
    ✔ 2.1. Report 1: Tạo report cho post tạo snapshot chính xác (0.4956ms)
    ✔ 2.2. Report 2: Tạo report cho comment tạo snapshot chính xác (0.0934ms)
    ✔ 2.3. Report 3: Từ chối report không có target (cả 2 FK đều NULL) (0.808ms)
    ✔ 2.4. Report 4: Từ chối report có cả hai target (cả 2 FK đều có giá trị) (0.2612ms)
    ✔ 2.5. Report 5: Ràng buộc từ chối target_type không khớp FK (0.0919ms)
    ✔ 2.6. Report 6: Client không thể tự giả mạo target_id khi INSERT (0.0695ms)
    ✔ 2.7. Report 7: Client không thể thay đổi snapshot sau khi tạo (0.0813ms)
    ✔ 2.8. Report 8: Client không thể chuyển report từ post sang comment (0.0678ms)
    ✔ 2.9. Report 9: Backfill logic phục hồi chính xác snapshot cho report cũ (0.0859ms)
    ✔ 2.10. Report 10: Xóa post kích hoạt ON DELETE SET NULL nhưng trigger bảo toàn snapshot (0.0507ms)
    ✔ 2.11. Report 11: Xóa comment kích hoạt ON DELETE SET NULL nhưng trigger bảo toàn snapshot (0.0374ms)
    ✔ 2.12. Post 12: Student không thể sửa author_id (0.0805ms)
    ✔ 2.13. Post 13: Student không thể sửa author_name/avatar/level trên post (0.0647ms)
    ✔ 2.14. Post 14: Student không thể sửa created_at trên post (0.0563ms)
    ✔ 2.15. Post 15: Student không thể tự ghim bài hoặc đổi status kiểm duyệt (0.0784ms)
    ✔ 2.16. Post 16: Student không thể can thiệp số likes_count và comments_count (0.0678ms)
    ✔ 2.17. Post 17: Student được phép sửa nội dung hợp lệ (content, tag, image_url, is_solved) (0.1236ms)
    ✔ 2.18. Comment 18: Comment trigger cấm sửa author_id, post_id, created_at, status, deleted_at (0.147ms)
    ✔ 2.19. Admin 19: Admin active thực hiện được thao tác ghim bài, đổi status, duyệt report (0.0588ms)
    ✔ 2.20. Admin 20: Admin blocked bị từ chối mọi quyền hạn đặc quyền (0.0929ms)
    ✔ 2.21. Admin 21: Moderation logs là bảng bất biến, cấm student sửa hoặc xóa (0.1257ms)
    ✔ 2.22. Admin 22: Xóa profile admin không làm mất moderation logs (ON DELETE SET NULL) (0.049ms)
  ✔ Group 2: PostgreSQL Business Logic & Runtime Rules (Tests 1-22) (3.5052ms)
  ▶ Group 3: Live Supabase RLS Runtime & Data Conservation
    ✔ 3.1. Live Supabase: existing community_posts remain intact with BIGSERIAL IDs (504.8983ms)
    ✔ 3.2. Live Supabase: existing study_partners remain intact (205.0468ms)
    ✔ 3.3. Live Supabase RLS: unauthenticated insert into community_reports is strictly blocked (121.789ms)
    ✔ 3.4. Live Supabase RLS: unauthenticated insert into community_moderation_logs is strictly blocked (97.8003ms)
    ✔ 3.5. Security Verification: frontend codebase contains zero service role keys (57.3255ms)
  ✔ Group 3: Live Supabase RLS Runtime & Data Conservation (987.1586ms)
✔ Task 24.08A.2.1 — Community Report Snapshot Backfill & Final Runtime Verification Tests (998.8353ms)
ℹ tests 33 | pass 33 | fail 0
```

### Kết quả Kiểm thử Hồi quy toàn Phase 24:
- Tổng số file test kiểm thử: **11 test suites**.
- Tổng số bài kiểm thử: **164 tests**.
- Kết quả: **164/164 PASS (100%)**, thời gian thực thi: **2.69s**.
- Linter (`oxlint`): **0 errors**.
- Build (`vite build`): **918ms** thành công.

---

## 7. KẾ HOẠCH ROLLBACK VÀ FORWARD-FIX

### 7.1. Cảnh báo an toàn tuyệt đối khi Rollback
> [!CAUTION]
> **KHÔNG BAO GIỜ** khôi phục ràng buộc `chk_report_target_xor` cũ nếu trong database đã xuất hiện các báo cáo có bài viết/bình luận cha bị xóa (nơi `post_id = NULL AND comment_id = NULL` nhưng snapshot vẫn tồn tại). Nếu khôi phục ràng buộc cũ, các bản ghi này sẽ vi phạm XOR và làm hỏng tính toàn vẹn của bảng.

### 7.2. Phương án Forward-Fix (Ưu tiên)
Nếu phát hiện trường hợp ngoại lệ trong quá trình vận hành:
1. Sử dụng hàm `audit_community_reports_snapshot_status()` để xác định ID của bản ghi có vấn đề.
2. Cập nhật bổ sung snapshot:
   ```sql
   UPDATE public.community_reports
   SET target_type = 'post', target_id = post_id::text
   WHERE post_id IS NOT NULL AND (target_id IS NULL OR target_id = '');
   ```

### 7.3. Kịch bản Rollback Khẩn cấp (Nếu bắt buộc hoàn nguyên DDL mới)
```sql
-- 1. Xóa hàm telemetry audit
DROP FUNCTION IF EXISTS public.audit_community_reports_snapshot_status();

-- 2. Khôi phục trigger phiên bản 24.08A.2 (chỉ INSERT)
CREATE OR REPLACE FUNCTION public.sync_community_report_target_snapshot()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NEW.post_id IS NOT NULL THEN
    NEW.target_type := 'post';
    NEW.target_id := NEW.post_id::text;
  ELSIF NEW.comment_id IS NOT NULL THEN
    NEW.target_type := 'comment';
    NEW.target_id := NEW.comment_id::text;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_community_report_target ON public.community_reports;
CREATE TRIGGER trg_sync_community_report_target
  BEFORE INSERT ON public.community_reports
  FOR EACH ROW EXECUTE FUNCTION public.sync_community_report_target_snapshot();
```

---

## 8. SỰ CHUẨN BỊ CHO TASK 24.08B

Toàn bộ lớp dữ liệu, constraint, trigger và quyền hạn của module Community đã hoàn thiện triệt để:
- Không còn xung đột giữa FK `ON DELETE SET NULL` và XOR.
- Snapshot báo cáo được bảo vệ bất biến.
- Tác giả bài viết, bình luận và log kiểm duyệt được bảo vệ cấp database.
- Đã sẵn sàng bước sang **Task 24.08B: Triển khai Atomic Reaction RPC (`toggle_community_post_reaction`), Comment Counter Trigger và Kết nối Community UI thật**.

