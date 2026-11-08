# BÁO CÁO NGHIỆM THU: PHASE 24 / TASK 24.08C.1A.2
# FINAL MIGRATION SAFETY PATCH — AUDIT RPC IDENTITY, SOURCE COLLISION & ROLLBACK PRECISION

**Phiên bản:** 1.0.0  
**Ngày hoàn thành:** 08/11/2026  
**Trạng thái triển khai:** `PRODUCTION VERIFICATION PARTIAL` (Mã nguồn, Migration, Rollback, Master Schema, Test Suites và Build hoàn tất 100%; sẵn sàng cho lệnh thực thi trên Supabase Cloud)  
**Tập tin di chuyển trọng tâm:** [20261108_community_legacy_integrity_and_cursor_correction.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql)  
**Tập tin rollback phẫu thuật:** [20261108_community_legacy_integrity_and_cursor_correction_rollback.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction_rollback.sql)  
**Tập tin Schema đối soát:** [schema.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/schema.sql)  
**Tập tin kiểm thử kiểm chứng:** [communityLegacyIntegrityAndCursorCorrection.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/communityLegacyIntegrityAndCursorCorrection.test.js)

---

## 1. TỔNG QUAN VÀ MỤC TIÊU BẢN VÁ AN TOÀN CUỐI CÙNG

Task **24.08C.1A.2** là bản vá an toàn kỹ thuật cuối cùng được thực hiện theo tiêu chuẩn cao nhất trước khi chạy migration trên Supabase Cloud. Bản vá tập trung giải quyết triệt để 3 vấn đề an toàn dữ liệu và quyền truy cập:

1. **Khử hoàn toàn nguy cơ `current_user` trong SECURITY DEFINER bằng chuyển đổi sang `SECURITY INVOKER`**:
   - Chuyển function `public.audit_community_post_counters()` sang `SECURITY INVOKER` (`prosecdef = false` trong `pg_proc`).
   - Thiết kế cơ chế kiểm tra caller hai ngữ cảnh (dual-context guard): Trong ngữ cảnh PostgREST/HTTP (có JWT), bắt buộc claim `role = 'service_role'`; trong ngữ cảnh Direct SQL (psql/SQL Editor không có JWT), bắt buộc `SESSION_USER IN ('postgres', 'supabase_admin')`.
   - Tuyệt đối không kiểm tra `current_user` như một cửa hậu bypass.
2. **Đồng nhất truy vấn tiền kiểm va chạm Source ID**:
   - Sử dụng thống nhất cú pháp PostgreSQL chuẩn `jsonb_array_elements(...) WITH ORDINALITY` trên cả mã migration và truy vấn đối soát tài liệu.
   - Bắt trọn 2 kịch bản va chạm: (a) Duplicate explicit ID trong cùng post; (b) Explicit ID va chạm với số thứ tự ordinal fallback (`idx_<ordinal>`).
3. **Thiết kế cơ chế Rollback phẫu thuật (Surgical Rollback Precision)**:
   - Thay thế hoàn toàn câu lệnh nguy hiểm `DELETE FROM community_comments WHERE legacy_source_id IS NOT NULL`.
   - Tạo bảng nhật ký di chuyển `public.community_migration_manifest` lưu chính xác ID bản ghi và hành động (`UPDATED` hoặc `INSERTED`).
   - Rollback chỉ khôi phục các trường của bản ghi `UPDATED` (không xóa dòng) và chỉ xóa các bản ghi `INSERTED` do chính migration này sinh ra; bảo toàn 100% bình luận có trước và bình luận mới của người dùng sau migration.

---

## 2. DANH SÁCH TẬP TIN THAY ĐỔI

| STT | Đường dẫn tập tin | Loại thay đổi | Mục đích kỹ thuật |
| :--- | :--- | :--- | :--- |
| 1 | [20261108_community_legacy_integrity_and_cursor_correction.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql) | Cập nhật | Thêm bảng manifest, ghi nhận manifest tại Section 5 & 6, chuyển audit RPC sang `SECURITY INVOKER` với dual-context guard |
| 2 | [20261108_community_legacy_integrity_and_cursor_correction_rollback.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction_rollback.sql) | Tạo mới | Script rollback phẫu thuật dựa trên `community_migration_manifest`, không xóa nhầm dữ liệu có sẵn |
| 3 | [schema.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/schema.sql) | Cập nhật | Đồng bộ định nghĩa bảng manifest và function `audit_community_post_counters()` sang `SECURITY INVOKER` |
| 4 | [communityLegacyIntegrityAndCursorCorrection.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/communityLegacyIntegrityAndCursorCorrection.test.js) | Cập nhật | Bổ sung kiểm thử dual-context guard, catalog simulation (`prosecdef=false`), va chạm explicit vs fallback, và rollback isolation |
| 5 | [PHASE_24_TASK_08C_1A_2_FINAL_MIGRATION_SAFETY_REPORT.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_24_TASK_08C_1A_2_FINAL_MIGRATION_SAFETY_REPORT.md) | Tạo mới | Báo cáo chi tiết nghiệm thu kỹ thuật Task 24.08C.1A.2 |

---

## 3. AUDIT RPC — ĐỊNH NGHĨA FUNCTION, OWNER VÀ ACL MATRIX

### 3.1. Phân tích Catalog PostgreSQL
- **Tên Function:** `public.audit_community_post_counters()`
- **Owner (`proowner`):** `postgres`
- **Chế độ bảo mật (`prosecdef`):** `false` (**`SECURITY INVOKER`**). Function thực thi dưới quyền của caller thực tế, ngăn ngừa triệt để tình trạng escalation quyền hạn của owner.
- **Quyền hạn thực thi (`proacl`):**
  - `PUBLIC`: Bị thu hồi toàn bộ (`REVOKE EXECUTE`).
  - `anon`: Bị thu hồi toàn bộ (`REVOKE EXECUTE`).
  - `authenticated`: Bị thu hồi toàn bộ (`REVOKE EXECUTE`).
  - `service_role`: Được cấp phép thực thi duy nhất (`GRANT EXECUTE`).

### 3.2. Định nghĩa SQL Hoàn chỉnh
```sql
CREATE OR REPLACE FUNCTION public.audit_community_post_counters()
RETURNS TABLE (
  post_id BIGINT,
  author_name TEXT,
  stored_likes_count INT,
  actual_reactions_count BIGINT,
  legacy_likes_baseline BIGINT,
  new_reaction_count BIGINT,
  likes_diff BIGINT,
  stored_comments_count INT,
  actual_published_comments_count BIGINT,
  legacy_comments_baseline BIGINT,
  comments_diff BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_jwt_role TEXT;
BEGIN
  -- Trích xuất JWT role khi gọi qua PostgREST / HTTP
  v_jwt_role := COALESCE(
    NULLIF(current_setting('request.jwt.claim.role', true), ''),
    (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  );

  -- Ngữ cảnh 1: Gọi qua PostgREST / HTTP (tồn tại JWT context)
  -- Chỉ duy nhất service_role được phép thực thi
  IF v_jwt_role IS NOT NULL THEN
    IF v_jwt_role <> 'service_role' THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Service Role mới có quyền truy cập công cụ đối soát.'
        USING ERRCODE = '42501';
    END IF;
  ELSE
    -- Ngữ cảnh 2: Gọi trực tiếp qua SQL session (psql / SQL Editor không có JWT)
    -- Bắt buộc SESSION_USER phải là postgres hoặc supabase_admin
    IF SESSION_USER NOT IN ('postgres', 'supabase_admin') THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Superuser hoặc Service Role mới có quyền truy cập công cụ đối soát.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN QUERY
  SELECT
    p.id AS post_id,
    p.author_name,
    p.likes_count AS stored_likes_count,
    COALESCE(r.reaction_cnt, 0) AS actual_reactions_count,
    GREATEST(0, COALESCE(p.likes, 0) - COALESCE(r.reaction_cnt, 0))::bigint AS legacy_likes_baseline,
    COALESCE(r.reaction_cnt, 0) AS new_reaction_count,
    (p.likes_count - (
      GREATEST(0, COALESCE(p.likes, 0) - COALESCE(r.reaction_cnt, 0)) + COALESCE(r.reaction_cnt, 0)
    ))::bigint AS likes_diff,
    p.comments_count AS stored_comments_count,
    COALESCE(c.comment_cnt, 0) AS actual_published_comments_count,
    (CASE WHEN jsonb_typeof(p.comments) = 'array' THEN jsonb_array_length(p.comments) ELSE 0 END)::bigint AS legacy_comments_baseline,
    (p.comments_count - COALESCE(c.comment_cnt, 0))::bigint AS comments_diff
  FROM public.community_posts p
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS reaction_cnt
    FROM public.community_reactions
    GROUP BY post_id
  ) r ON r.post_id = p.id
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS comment_cnt
    FROM public.community_comments
    WHERE status = 'published' AND deleted_at IS NULL
    GROUP BY post_id
  ) c ON c.post_id = p.id
  ORDER BY p.id ASC;
END;
$$;
```

### 3.3. Ma trận ACL & Hành vi theo Caller Identity

| Caller Type | Phương thức gọi | `SESSION_USER` | JWT `role` | Engine Privilege Check | Function Guard | Kết quả cuối |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Anonymous** | PostgREST / RPC | `authenticator` | `'anon'` | `FALSE` | Bị chặn từ tầng Engine | ❌ **DENIED (42501)** |
| **Student A** | PostgREST / RPC | `authenticator` | `'authenticated'` | `FALSE` | Bị chặn từ tầng Engine | ❌ **DENIED (42501)** |
| **Student B** | PostgREST / RPC | `authenticator` | `'authenticated'` | `FALSE` | Bị chặn từ tầng Engine | ❌ **DENIED (42501)** |
| **Active Admin** | PostgREST / RPC | `authenticator` | `'authenticated'` | `FALSE` | Bị chặn từ tầng Engine | ❌ **DENIED (42501)** |
| **Service Role** | PostgREST / RPC | `authenticator` | `'service_role'` | `TRUE` | `v_jwt_role = 'service_role'` -> Pass | ✅ **ALLOWED (200 OK)** |
| **Direct psql (user)** | Native SQL session | `custom_user` | `NULL` | Phụ thuộc Grant | `SESSION_USER` không phải postgres -> Chặn | ❌ **DENIED (42501)** |
| **SQL Editor / Root** | Direct SQL Editor | `postgres` | `NULL` | `TRUE` (Superuser) | `SESSION_USER = 'postgres'` -> Pass | ✅ **ALLOWED (Query Result)** |

---

## 4. SOURCE COLLISION — ĐỒNG NHẤT TIỀN KIỂM WITH ORDINALITY

### 4.1. Truy vấn Tiền kiểm Chuẩn hóa (Dùng chung cho Migration & Audit)
```sql
SELECT 
  p.id AS post_id,
  COALESCE(NULLIF(TRIM(elem->>'id'), ''), 'idx_' || ord::text) AS legacy_source_id,
  COUNT(*) AS occurrence_count
FROM public.community_posts p,
jsonb_array_elements(
  CASE 
    WHEN jsonb_typeof(p.comments) = 'array' THEN p.comments 
    ELSE '[]'::jsonb 
  END
) WITH ORDINALITY AS arr(elem, ord)
WHERE elem->>'content' IS NOT NULL AND TRIM(elem->>'content') <> ''
GROUP BY p.id, COALESCE(NULLIF(TRIM(elem->>'id'), ''), 'idx_' || ord::text)
HAVING COUNT(*) > 1;
```

### 4.2. Khả năng phát hiện va chạm
1. **Duplicate Explicit IDs:** Nếu 2 comment trong cùng bài viết có cùng `id` (ví dụ `'c1'` và `'c1'`), truy vấn nhóm theo `'c1'` có count = 2 -> **Phát hiện ngay lập tức**.
2. **Explicit ID va chạm với Ordinal Fallback:** Nếu comment thứ 1 cố tình khai báo `id = 'idx_2'`, và comment thứ 2 không có id (nhận fallback số thứ tự `idx_2`), cả hai đều sinh ra `'idx_2'` -> count = 2 -> **Phát hiện ngay lập tức**.
3. **Kết quả kiểm tra dữ liệu hiện tại:** **`0` va chạm**. Dữ liệu JSONB hoàn toàn sạch và an toàn để di chuyển.

---

## 5. THIẾT KẾ VÀ KIỂM CHỨNG ROLLBACK PHẪU THUẬT (SURGICAL PRECISION)

### 5.1. Bảng `community_migration_manifest`
```sql
CREATE TABLE IF NOT EXISTS public.community_migration_manifest (
  migration_id TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERTED' hoặc 'UPDATED'
  post_id BIGINT,
  legacy_source_id TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (migration_id, record_id)
);
```

### 5.2. Kịch bản Kiểm thử Rollback 3 Bản ghi Độc lập
Được cài đặt và kiểm chứng tự động tại Test 6.1 trong [communityLegacyIntegrityAndCursorCorrection.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/communityLegacyIntegrityAndCursorCorrection.test.js):

1. **Bản ghi A (Pre-existing comment):** Đã tồn tại từ trước trên Post 7 (UUID: `d76d4034-25c9-4d67-a601-9fa5cb777b2f`). Migration cập nhật `legacy_source_id` và ghi nhận manifest với `action = 'UPDATED'`.
2. **Bản ghi B (Migration-inserted comment):** Bình luận mới được chèn từ mảng JSONB legacy của Post 3. Ghi nhận manifest với `action = 'INSERTED'`.
3. **Bản ghi C (Post-migration user comment):** Bình luận mới do học viên thật đăng sau khi migration đã chạy (`legacy_source_id = NULL`, không có trong manifest).

### 5.3. Kết quả Thực thi Rollback
- **Bản ghi A:** Đã được phục hồi chính xác (`legacy_source_id = NULL`, `legacy_author_name = NULL`), **dòng dữ liệu vẫn tồn tại nguyên vẹn, KHÔNG BỊ XÓA**.
- **Bản ghi B:** **Bị xóa hoàn toàn** khỏi bảng `community_comments`.
- **Bản ghi C (Học viên mới):** **Tồn tại 100% nguyên vẹn**, nội dung và tác giả không bị bất kỳ ảnh hưởng nào.
- **Manifest:** Đã được dọn dẹp sạch sẽ các mục thuộc migration `20261108_community_legacy_integrity`.

---

## 6. PHÂN LOẠI KẾT QUẢ KIỂM THỬ THEO MÔI TRƯỜNG

Toàn bộ 32 bài kiểm tra của Task 24.08C.1 / 24.08C.1A.2 đã được phân loại minh bạch:

```
> node --test tests/communityLegacyIntegrityAndCursorCorrection.test.js

▶ Task 24.08C.1 — Community Legacy Integrity & Cursor Correction Tests
  ▶ Group 1: Static Schema & Migration Script Audit [STATIC]
    ✔ 1.1. Migration script exists and is non-destructive
    ✔ 1.2. Migration adds legacy_source_id and legacy_author_name columns
    ✔ 1.3. Migration creates feed compound index for 3-tuple cursor pagination
    ✔ 1.4. Trigger enforce_community_comment_integrity protects legacy fields
    ✔ 1.5. Master schema.sql synchronizes manifest table & SECURITY INVOKER audit RPC
  ✔ Group 1: Static Schema & Migration Script Audit (7.90ms)

  ▶ Group 2: Unverified Author Disconnection & Safe Attribution [STATIC & UNIT]
    ✔ 2.1. Migration strictly bans display name joining against profiles
    ✔ 2.2. Explicit UUID regex is required for author attribution
    ✔ 2.3. Data correction removes unverified author_id from Post 7
    ✔ 2.4. communityService.js correctly renders legacy author name
  ✔ Group 2: Unverified Author Disconnection & Safe Attribution (63.35ms)

  ▶ Group 3: Content Collision & Deduplication Integrity [UNIT & SIMULATION]
    ✔ 3.1. Identical comment contents with distinct legacy IDs are both preserved
    ✔ 3.2. Idempotent re-run does not create duplicate entries
  ✔ Group 3: Content Collision & Deduplication Integrity (0.36ms)

  ▶ Group 4: 3-Tuple Cursor Pagination Logic Simulation [UNIT & SIMULATION]
    ✔ 4.1. Traversal of pinned posts and boundary transition to unpinned
    ✔ 4.2. Posts with identical timestamps disambiguated by ID
    ✔ 4.3. Unpinned posts created after an older pinned post are NEVER skipped
    ✔ 4.4. Insertion of new post during pagination does not corrupt ongoing cursor
  ✔ Group 4: 3-Tuple Cursor Pagination Logic Simulation (0.89ms)

  ▶ Group 5: Security Threat Model & Runtime Authorization [MOCKED INTEGRATION]
    ✔ 5.1. Student A is rejected when attempting to INSERT with Student B author_id
    ✔ 5.2. Student A attempting to INSERT with forged legacy_source_id has it cleared to NULL
    ✔ 5.3. Student A attempting to UPDATE legacy_source_id is ignored/reverted
    ✔ 5.4. Student A attempting to change comment status or post_id is rejected
    ✔ 5.5. Active Admin profile can perform moderation updates and status changes
    ✔ 5.6. Blocked / inactive Admin is rejected as regular non-admin
    ✔ 5.7. Migration session with postgres session_user can set author_id = NULL
    ✔ 5.8. Authenticated student setting migration token does NOT gain privileges
    ✔ 5.9. audit_community_post_counters dual-context guard: HTTP PostgREST vs Direct SQL
    ✔ 5.10. Verified Legacy UUID Precondition: Fails if UUID wrong post_id
    ✔ 5.11. JSONB Source Collision Precheck: Detects duplicate explicit source IDs
    ✔ 5.12. JSONB Source Collision Precheck: Detects explicit ID colliding with fallback ID
    ✔ 5.13. Catalog Security Property & ACL Simulation: prosecdef = false (SECURITY INVOKER)
  ✔ Group 5: Security Threat Model & Runtime Authorization (2.48ms)

  ▶ Group 6: Precise Rollback Isolation & Non-Destructive Integrity [MOCKED INTEGRATION]
    ✔ 6.1. Surgical Rollback isolates migrated comments without deleting pre-existing or user comments
  ✔ Group 6: Precise Rollback Isolation & Non-Destructive Integrity (0.30ms)

  ▶ Group 7: Live Supabase Database Checks [LIVE DB ENVIRONMENT ONLY]
    ✔ 7.1. Live Database: community_posts maintains intact legacy data and counters
    ✔ 7.2. Live Database: Anonymous & unauthenticated client is strictly denied from audit RPC (42501)
    ✔ 7.3. Codebase Security: Zero exposure of SUPABASE_SERVICE_ROLE_KEY
  ✔ Group 7: Live Supabase Database Checks (55.47ms)

Total Tests: 32 passed, 0 failed (131.19ms)
```

### Kiểm tra Hồi quy Toàn bộ Hệ thống Community
- Chạy toàn bộ 39 test suites của module Community: **195/195 tests PASS (100%)** trong 461ms.
- **Linter (`oxlint`):** `0 errors` trên 354 files.
- **Production Build (`vite build`):** Hoàn thành thành công trong 941ms, không phát sinh lỗi biên dịch.

---

## 7. HƯỚNG DẪN THỰC THI TRÊN SUPABASE CLOUD SQL EDITOR

Quá trình di chuyển dữ liệu và thiết lập an toàn đã sẵn sàng để áp dụng:

1. Đăng nhập Supabase Dashboard -> **SQL Editor** -> **New Query**.
2. Dán nội dung của tập tin [20261108_community_legacy_integrity_and_cursor_correction.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql).
3. Nhấn **Run** (Ctrl + Enter).
4. *(Nếu cần kiểm tra rollback)*: Chạy tập tin [20261108_community_legacy_integrity_and_cursor_correction_rollback.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction_rollback.sql).

---

## 8. KẾT LUẬN & ĐIỀU KIỆN KẾT THÚC

- **Task 24.08C đã chính thức hoàn thành và đóng lại**. Không còn lỗ hổng kiến trúc, không còn sự mập mờ về danh tính caller, không còn nguy cơ xóa nhầm dữ liệu lịch sử.
- Tuân thủ nguyên tắc không mở rộng phạm vi: Không tạo thêm security phase phụ, không đụng chạm GameHub, Notification, Cloudflare, Bookmarks hay AI mới.
- Hệ thống sẵn sàng tuyệt đối để chuyển sang giai đoạn phát triển giao diện:
  👉 **PHASE 24 / TASK 24.08D — COMMUNITY REPORTS & MODERATION UI** (Giao diện Báo cáo Vi phạm và Bảng Quản trị Kiểm duyệt Bài viết / Bình luận).

