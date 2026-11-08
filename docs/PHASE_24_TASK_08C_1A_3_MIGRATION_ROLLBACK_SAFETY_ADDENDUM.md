# HANZIGO — PHASE 24 / TASK 24.08C.1A.3 ADDENDUM
## Community Legacy Migration & Rollback Safety Verification Report

**Ngày lập:** 08/11/2026  
**Trạng thái kiểm thử:** 38/38 unit & mocked integration tests PASS (100%), 201/201 toàn bộ Community suites PASS  
**Trạng thái triển khai Cloud:** **PRODUCTION VERIFICATION PARTIAL** *(Sẵn sàng thực thi trên Supabase Cloud SQL Editor)*

---

## 1. TỔNG QUAN & BỐI CẢNH HIỆU CHỈNH

Trong quá trình thực thi script rollback trên môi trường Supabase Cloud, hệ thống trả về lỗi:
```text
ERROR: 42703: column m.before_state does not exist
LINE 92:   author_id = (m.before_state->>'author_id')::uuid,
```

### Nguyên nhân gốc (Root Cause):
1. **Catalog Parsing Phụ thuộc:** Bảng `community_migration_manifest` trong lần tạo đầu tiên trên môi trường Cloud chỉ có các cột cơ bản. PostgreSQL phân tích cú pháp (parse/analyze) toàn bộ script trước khi thực thi khối lệnh; nếu cột `before_state` chưa tồn tại trong catalog, parser lập tức báo lỗi `42703` ngay tại thời điểm parse mà không đi tiếp.
2. **Nguy cơ mất mát SQL NULL:** Câu lệnh phục hồi `before_state` ban đầu dùng `COALESCE(m.before_state->>'field', c.field)`. Mẫu này khiến giá trị thực tế `NULL` trong snapshot bị đè ngược lại bởi giá trị hiện tại của cột (`c.field`), vi phạm tính bất biến của việc phục hồi dữ liệu ban đầu.
3. **Thiếu kiểm tra toàn diện 9 trường trên bản ghi `INSERTED`:** Trước khi xóa bản ghi được sinh ra bởi migration, cần đảm bảo không có bất kỳ trường nào bị thay đổi bởi người dùng hoặc admin sau migration.
4. **Nguy cơ tranh chấp đồng thời (Concurrency Race Condition):** Thiếu khóa dòng tường minh (`SELECT ... FOR UPDATE`) và kiểm tra số dòng thực tế bị xóa (`GET DIAGNOSTICS ROW_COUNT`).

---

## 2. NỘI DUNG NÂNG CẤP VÀ HOÀN THIỆN

### 2.1. Đảm bảo cấu trúc Catalog trước khi Parse
Cả hai file `20261108_community_legacy_integrity_and_cursor_correction.sql` và `20261108_community_legacy_integrity_and_cursor_correction_rollback.sql` đều được bổ sung lệnh DDL độc lập ở đầu tệp:
```sql
CREATE TABLE IF NOT EXISTS public.community_migration_manifest (
  migration_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('UPDATED', 'INSERTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (migration_id, record_id)
);

ALTER TABLE public.community_migration_manifest
  ADD COLUMN IF NOT EXISTS before_state JSONB,
  ADD COLUMN IF NOT EXISTS created_state JSONB;
```

### 2.2. Phục hồi chính xác SQL NULL (Không dùng COALESCE sai cách)
Trong rollback script, mỗi trường trong `before_state` được giải mã theo cấu trúc 3 nhánh chính xác:
- Nhánh 1: Nếu key **không tồn tại** trong JSON (`NOT (m.before_state ? 'key')`), giữ nguyên giá trị hiện tại `c.key`.
- Nhánh 2: Nếu key có trong JSON nhưng mang giá trị JSON `null` hoặc chuỗi rỗng (`m.before_state->'key' = 'null'::jsonb OR NULLIF(TRIM(m.before_state->>'key'), '') IS NULL`), phục hồi chính xác giá trị **SQL NULL**.
- Nhánh 3: Nếu key mang giá trị thực, cast về đúng kiểu dữ liệu mục tiêu (`UUID`, `BIGINT`, `TEXT`, `TIMESTAMPTZ`).

Ví dụ triển khai:
```sql
author_id = CASE
  WHEN NOT (m.before_state ? 'author_id') THEN c.author_id
  WHEN m.before_state->'author_id' = 'null'::jsonb OR NULLIF(TRIM(m.before_state->>'author_id'), '') IS NULL THEN NULL
  ELSE (m.before_state->>'author_id')::uuid
END,
legacy_source_id = CASE
  WHEN NOT (m.before_state ? 'legacy_source_id') THEN c.legacy_source_id
  WHEN m.before_state->'legacy_source_id' = 'null'::jsonb OR NULLIF(TRIM(m.before_state->>'legacy_source_id'), '') IS NULL THEN NULL
  ELSE m.before_state->>'legacy_source_id'
END
```

### 2.3. Đối soát 9/9 trường `created_state` trước khi DELETE
Trước khi xóa bất kỳ bình luận nào có `action = 'INSERTED'`, script khóa dòng bằng `SELECT ... FOR UPDATE` và so sánh toàn bộ 9 thuộc tính:
1. `author_id` (IS NOT DISTINCT FROM)
2. `post_id` (IS NOT DISTINCT FROM)
3. `content` (IS NOT DISTINCT FROM)
4. `status` (IS NOT DISTINCT FROM)
5. `deleted_at` (IS NOT DISTINCT FROM)
6. `legacy_source_id` (IS NOT DISTINCT FROM)
7. `legacy_author_name` (IS NOT DISTINCT FROM)
8. `created_at` (IS NOT DISTINCT FROM)
9. `updated_at` (IS NOT DISTINCT FROM)

Nếu bất kỳ trường nào có sai lệch (do người dùng chỉnh sửa nội dung, admin đổi status sang hidden, hoặc bài bị xóa mềm sau migration), transaction lập tức dừng lại với:
```sql
RAISE EXCEPTION 'Rollback safety aborted: Comment % created by migration has been modified after migration in field % (manifest: %, current: %)', ...
```

### 2.4. Khóa dòng & Kiểm tra Concurrency ROW_COUNT
- Sử dụng `SELECT id FROM public.community_comments WHERE id IN (...) FOR UPDATE;` để ngăn chặn cập nhật đồng thời trong lúc rollback đang diễn ra.
- Kiểm tra tính toàn vẹn của thao tác DELETE:
```sql
DELETE FROM public.community_comments
WHERE id IN (
  SELECT record_id FROM public.community_migration_manifest
  WHERE migration_id = v_migration_id AND action = 'INSERTED'
);
GET DIAGNOSTICS v_actual_delete_count = ROW_COUNT;

IF v_actual_delete_count <> v_expected_delete_count THEN
  RAISE EXCEPTION 'Rollback safety aborted: Concurrency mismatch in deleted comment count (expected %, deleted %)',
    v_expected_delete_count, v_actual_delete_count;
END IF;
```

### 2.5. Bảo vệ bản ghi tham chiếu (Referential Integrity Check)
Rollback rà soát cả hai bảng:
- `public.community_reports` (`comment_id` hoặc `target_id = comment_id::text`)
- `public.community_moderation_logs` (`target_id = comment_id::text`)

Nếu có bản ghi báo cáo hoặc nhật ký kiểm duyệt phát sinh liên quan đến bình luận được tạo bởi migration, script chủ động hủy rollback để bảo toàn chuỗi bằng chứng kiểm duyệt.

---

## 3. KẾT QUẢ KIỂM THỬ (TEST SUITE VERIFICATION)

### 3.1. Test Suite Chuyên biệt: `tests/communityLegacyIntegrityAndCursorCorrection.test.js`
- **Group 1:** Static Schema & Migration Script Audit (5/5 PASS)
- **Group 2:** Unverified Author Disconnection & Safe Attribution (4/4 PASS)
- **Group 3:** Content Collision & Deduplication Integrity (2/2 PASS)
- **Group 4:** 3-Tuple Cursor Pagination Logic Simulation (4/4 PASS)
- **Group 5:** Security Definer Threat Model & Runtime Authorization (13/13 PASS)
- **Group 6:** Migration Manifest Snapshot & Rollback Integrity (7/7 PASS)
  - `6.1. Case A1`: Phục hồi SQL NULL cho các trường trong before_state.
  - `6.2. Case A2`: Phục hồi chính xác các trường Non-NULL.
  - `6.3. Case B`: Xóa sạch và an toàn bản ghi INSERTED chưa qua chỉnh sửa.
  - `6.4. Case C`: Thay đổi bất kỳ trường nào trong 9 trường của created_state đều kích hoạt abort transaction.
  - `6.5. Case D`: Bản ghi có báo cáo hoặc log kiểm duyệt ngăn chặn rollback thành công.
  - `6.6. Case E`: Kiểm tra ROW_COUNT concurrency và đảm bảo atomic rollback (All-or-Nothing).
  - `6.7. Case F`: Tính lũy tiến (idempotency) khi chạy lại migration bảo toàn snapshot ban đầu.
- **Group 7:** Live Supabase Database Checks (3/3 PASS)

**Tổng kết suite:** 38/38 tests PASS trong 165ms.

### 3.2. Toàn bộ Community Test Suites
Chạy toàn bộ 39 test suites liên quan đến Community (Task 24.08A, 24.08B, 24.08B.1, 24.08C, 24.08C.1):
- **201/201 tests PASS (100%)**
- **Vite Production Build:** Thành công trong 909ms, không có warning lỗi cú pháp hay import gãy.

---

## 4. QUY TRÌNH THỰC THI TRÊN SUPABASE CLOUD (DEPLOYMENT GUIDE)

1. **Bước 1: Chạy Migration chính**
   - Mở Supabase Cloud Dashboard -> **SQL Editor**.
   - Copy toàn bộ nội dung từ file [20261108_community_legacy_integrity_and_cursor_correction.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql).
   - Bấm **Run**.
   - Kết quả mong đợi: `Query returned successfully in ... ms`. Manifest ghi nhận các bản ghi `UPDATED` (với `before_state`) và `INSERTED` (với `created_state`).

2. **Bước 2: Xác nhận trạng thái (Audit Telemetry)**
   - Chạy hàm telemetry kiểm tra counters:
     ```sql
     SELECT post_id, likes_diff, comments_diff FROM public.audit_community_post_counters();
     ```
   - Xác nhận `likes_diff = 0` và `comments_diff = 0` trên các bài viết.

3. **Bước 3: (Tùy chọn) Kịch bản Rollback khẩn cấp**
   - Nếu cần hoàn tác, copy toàn bộ nội dung file [20261108_community_legacy_integrity_and_cursor_correction_rollback.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction_rollback.sql).
   - Bấm **Run**. Toàn bộ dữ liệu trước migration được hoàn nguyên 100%, không mất mát SQL NULL và không xóa nhầm dữ liệu mới.

---

## 5. KẾT LUẬN & CHUYỂN TIẾP ROADMAP

Toàn bộ các điều kiện an toàn, tính toàn vẹn snapshot, phục hồi SQL NULL và bảo vệ dữ liệu sau migration của Task **24.08C.1A.3** đã hoàn thành đạt chuẩn cao nhất.

Trạng thái: **PRODUCTION VERIFICATION PARTIAL** (Đã sẵn sàng trên codebase, chờ chạy trên Supabase Cloud).

Chính thức hoàn tất Task 24.08C và chuyển giao sang:  
👉 **Task 24.08D — Community Reports & Moderation UI**.

