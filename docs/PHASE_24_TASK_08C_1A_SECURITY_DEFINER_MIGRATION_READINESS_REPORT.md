# HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08C.1A REPORT
## COMMUNITY SECURITY DEFINER IDENTITY FIX & PRODUCTION MIGRATION READINESS
### Báo Cáo Nghiệm Thu & Kiểm Chứng Toàn Vẹn Bảo Mật Quyền Quản Trị, Token Di Trú & Sẵn Sàng Vận Hành Production

---

## 1. TỔNG QUAN VÀ TRẠNG THÁI TRIỂN KHAI

| Thông Số | Chi Tiết |
| :--- | :--- |
| **Dự án** | HanziGo Community Learning Platform |
| **Phase / Task** | Phase 24 — Task 24.08C.1A |
| **Mục tiêu cốt lõi** | Loại bỏ hoàn toàn lỗ hổng xác định danh tính do sử dụng `current_user` trong hàm `SECURITY DEFINER`; bảo vệ dữ liệu bình luận di trú; thiết lập cơ chế token di trú cục bộ theo transaction (`hanzigo.internal_migration_session`); bao bọc migration trong khối transaction nguyên tử (`BEGIN ... COMMIT`) không tắt vĩnh viễn các trigger; duy trì đối soát bộ đếm chính xác |
| **Trạng thái thẩm định** | **PRODUCTION VERIFICATION PARTIAL** |
| **File migration hoàn thiện** | `supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql` |
| **File kiểm thử bảo mật** | `tests/communityLegacyIntegrityAndCursorCorrection.test.js` (26 tests) |
| **Toàn bộ Community Tests** | **189/189 tests PASS (100%)** qua 38 suites |
| **Trạng thái Build & Lint** | Lint 0 error, Vite Build thành công (926ms) |

> [!IMPORTANT]
> **Quy định trạng thái**: Trạng thái được cam kết giữ nguyên ở mức **`PRODUCTION VERIFICATION PARTIAL`**. Toàn bộ script migration đã được đóng gói an toàn tuyệt đối, có khả năng rollback tự động nếu phát sinh lỗi và sẵn sàng để quản trị viên chạy trên Supabase Cloud SQL Editor khi được chấp thuận.

---

## 2. PHÂN TÍCH NGUY CƠ BẢO MẬT: `SECURITY DEFINER` VÀ DANH TÍNH THỰC THI

### 2.1. Bản chất kỹ thuật của `SECURITY DEFINER` trong PostgreSQL
Trong PostgreSQL, một hàm được khai báo với thuộc tính `SECURITY DEFINER` sẽ được thực thi với quyền hạn và ngữ cảnh của **người sở hữu hàm (Owner)** thay vì người gọi hàm:
- Biến hệ thống `current_user` trong quá trình thực thi hàm `SECURITY DEFINER` sẽ trả về **Owner của function** (thường là `postgres` hoặc `supabase_admin`).
- Nếu một trigger hoặc function sử dụng `IF current_user IN ('postgres', 'supabase_admin') THEN ...` để kiểm tra quyền hạn, điều kiện này sẽ **luôn luôn trả về `TRUE`** bất kể người gọi là ai (kể cả Student A, Student B, hay Anonymous thông qua PostgREST API).
- Hậu quả: Mọi client thông thường có thể vượt qua (bypass) toàn bộ các bước kiểm tra toàn vẹn dữ liệu, giả mạo `author_id`, tự ý sửa đổi `legacy_source_id`, hoặc thay đổi trạng thái kiểm duyệt của bình luận.

### 2.2. Bảng ma trận so sánh các biến danh tính trong Supabase PostgreSQL

| Ngữ Cảnh Gọi | `SESSION_USER` | `CURRENT_USER` (bên trong SECURITY DEFINER) | `auth.uid()` | `auth.role()` | `request.jwt.claims ->> 'role'` | `public.is_admin()` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase SQL Editor** (DB Admin) | `postgres` | `postgres` | `NULL` | `NULL` / `anon` | `NULL` | `FALSE` |
| **PostgREST - Anonymous** | `authenticator` | `postgres` | `NULL` | `'anon'` | `'anon'` | `FALSE` |
| **PostgREST - Student A** | `authenticator` | `postgres` | `UUID_A` | `'authenticated'` | `'authenticated'` | `FALSE` |
| **PostgREST - Student B** | `authenticator` | `postgres` | `UUID_B` | `'authenticated'` | `'authenticated'` | `FALSE` |
| **PostgREST - Admin (Active)** | `authenticator` | `postgres` | `UUID_Admin` | `'authenticated'` | `'authenticated'` | `TRUE` |
| **PostgREST - Admin (Blocked)**| `authenticator` | `postgres` | `UUID_Admin` | `'authenticated'` | `'authenticated'` | `FALSE` |
| **PostgREST - Service Role** | `authenticator` | `postgres` | `NULL` | `'service_role'` | `'service_role'` | `FALSE` |

> [!CAUTION]
> Bảng trên chứng minh rõ ràng: Tuyệt đối **KHÔNG ĐƯỢC** sử dụng `current_user` bên trong thân hàm `SECURITY DEFINER` để phân quyền.

---

## 3. THIẾT KẾ BẢO MẬT MỚI: CƠ CHẾ 3 LỚP PHÂN QUYỀN

Trong hàm [`enforce_community_comment_integrity()`](file:///d:/DELL/Dowloads/HanziGo/supabase/schema.sql#L1082), cơ chế xác định đặc quyền được tái cấu trúc thành 3 lớp độc lập và nghiêm ngặt:

```sql
CREATE OR REPLACE FUNCTION public.enforce_community_comment_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_service_role BOOLEAN;
  v_is_admin BOOLEAN;
  v_is_migration_session BOOLEAN;
BEGIN
  -- 1. Xác thực JWT service role chặt chẽ (dành cho backend scripts / cron / system daemons)
  v_is_service_role := (
    auth.role() = 'service_role' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
  );

  -- 2. Kiểm tra quyền Quản trị viên chủ động qua hồ sơ người dùng (chặn Admin bị khóa hoặc inactive)
  v_is_admin := public.is_admin();

  -- 3. Phiên di trú đặc quyền cục bộ (Transaction-Scoped Migration Token):
  -- Chỉ hợp lệ khi được bật chủ động trong khối lệnh SQL của DB Admin (SESSION_USER = 'postgres' / 'supabase_admin')
  v_is_migration_session := (
    current_setting('hanzigo.internal_migration_session', true) = 'true'
    AND (
      SESSION_USER IN ('postgres', 'supabase_admin')
      OR v_is_service_role
    )
  );

  IF TG_OP = 'INSERT' THEN
    IF NOT (v_is_service_role OR v_is_admin OR v_is_migration_session) THEN
      -- Student không thể mạo danh tác giả khác
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể đăng bình luận dưới danh nghĩa người khác.';
      END IF;
      NEW.author_id := auth.uid();
      NEW.status := 'published';
      NEW.deleted_at := NULL;
      NEW.created_at := NOW();
      -- Học viên không thể tự gán danh tính nguồn di trú
      NEW.legacy_source_id := NULL;
      NEW.legacy_author_name := NULL;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NOT (v_is_service_role OR v_is_admin OR v_is_migration_session) THEN
      -- Bất biến tác giả
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể thay đổi tác giả bình luận.';
      END IF;
      -- Bất biến bài viết liên kết
      IF NEW.post_id IS DISTINCT FROM OLD.post_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển bình luận sang bài viết khác.';
      END IF;
      -- Bất biến mốc thời gian tạo
      IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể sửa đổi thời gian đăng bình luận.';
      END IF;
      -- Trạng thái kiểm duyệt chỉ Admin mới có quyền đổi
      IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền đổi trạng thái bình luận.';
      END IF;
      -- Mốc thời gian xóa bất biến với người dùng thường
      IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa bình luận.';
      END IF;
      -- Thuộc tính legacy được bảo tồn tuyệt đối
      NEW.legacy_source_id := OLD.legacy_source_id;
      NEW.legacy_author_name := OLD.legacy_author_name;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;
```

### Điểm vượt trội của giải pháp:
1. **Không có kẽ hở leo thang đặc quyền**: Nếu một học viên gửi request `set_config('hanzigo.internal_migration_session', 'true', true)` qua RPC hoặc SQL injection, việc kiểm tra `SESSION_USER IN ('postgres', 'supabase_admin')` sẽ phát hiện ngay `SESSION_USER = 'authenticator'` và từ chối cấp quyền migration.
2. **Không tạo RPC công khai**: Token `hanzigo.internal_migration_session` là biến nội bộ của PostgreSQL transaction, không có bất kỳ RPC nào cho phép gọi từ client.
3. **An toàn tự động (Auto-Expiring)**: Token được thiết lập với tham số thứ 3 là `is_local = true` (`set_config(..., true)`), nghĩa là token sẽ tự động hủy ngay khi transaction kết thúc (`COMMIT` hoặc `ROLLBACK`).

---

## 4. BẢO TOÀN DANH TÍNH DỮ LIỆU DI TRÚ (LEGACY IDENTITY AUDIT)

Đối chiếu và bảo vệ chính xác hai bản ghi bình luận lịch sử:

| Post ID | Nguồn Lịch Sử (`legacy_source_id`) | Tác Giả Lịch Sử (`legacy_author_name`) | `author_id` Sau Sửa Đổi | Trạng Thái Danh Tính |
| :---: | :---: | :---: | :---: | :--- |
| **Post 3** | `'c1'` | `"Nguyễn Văn Minh"` | `NULL` | Không có UUID xác thực trong JSONB nguồn -> Giữ `NULL`, hiển thị tên lịch sử qua `legacy_author_name`. |
| **Post 7** | `'comment-1791666635196'` | `"Alibaba và 36 tên Thanh Hoá"` | `NULL` | Tách hoàn toàn khỏi tài khoản học viên bị gán sai ở Task trước -> Giữ `NULL`, bảo toàn nguyên bản chuỗi tên. |

- Ràng buộc duy nhất `uq_community_comments_legacy_source` trên `(post_id, legacy_source_id)` đảm bảo rằng việc chạy lại migration nhiều lần sẽ **100% IDEMPOTENT**, không bao giờ sinh ra bình luận trùng lặp.
- Hai bình luận có cùng nội dung (ví dụ: *"Cảm ơn bạn!"*) nhưng có mã nguồn khác nhau (`c_01` vs `c_02`) sẽ được lưu độc lập, không bị gộp sai sót.

---

## 5. TÍNH NGUYÊN TỬ CỦA TRANSACTION VÀ BẢO TOÀN TRIGGER TRONG MIGRATION

File migration [`20261108_community_legacy_integrity_and_cursor_correction.sql`](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql) được tái cấu trúc toàn diện:
1. **Bọc trong khối lệnh `BEGIN ... COMMIT`**: Bất kỳ lỗi cú pháp hoặc vi phạm ràng buộc nào xảy ra ở giữa quá trình thực thi sẽ khiến toàn bộ transaction rollback về trạng thái ban đầu.
2. **Không vô hiệu hóa (DISABLE) trigger vĩnh viễn**:
   - Thay vì dùng `ALTER TABLE ... DISABLE TRIGGER`, migration sử dụng token nội bộ `hanzigo.internal_counter_sync` (đã được chứng minh ở Task 24.08B.1) để thực hiện đối soát `comments_count` và `likes_count`.
   - Các trigger toàn vẹn dữ liệu (`trg_enforce_community_post_integrity`, `trg_sync_community_post_comments_count`) luôn duy trì trạng thái **ACTIVE** trong suốt quá trình migration, loại bỏ hoàn toàn rủi ro "bị quên bật lại sau lỗi".

---

## 6. PHÂN TRANG CURSOR 3 THÀNH PHẦN `(is_pinned, created_at, id)`

Hàm `getCommunityPosts()` trong [`communityService.js`](file:///d:/DELL/Dowloads/HanziGo/src/services/communityService.js) thực hiện chính xác mô hình toán học:
```javascript
if (cursorPinned) {
  query = query.or(
    `and(is_pinned.eq.true,or(created_at.lt.${cursorCreatedAt},and(created_at.eq.${cursorCreatedAt},id.lt.${cursorId}))),is_pinned.eq.false`
  );
} else {
  query = query
    .eq('is_pinned', false)
    .or(`created_at.lt.${cursorCreatedAt},and(created_at.eq.${cursorCreatedAt},id.lt.${cursorId})`);
}
```

### Các trường hợp biên đã được kiểm chứng (Test Suite Group 4):
- **Trường hợp 1**: Lướt qua danh sách các bài viết ghim (pinned) theo thứ tự thời gian giảm dần, id giảm dần.
- **Trường hợp 2**: Chuyển giao ranh giới từ bài ghim cuối cùng sang bài viết không ghim đầu tiên mà không bị nhảy cóc hoặc sót dữ liệu.
- **Trường hợp 3**: Nhiều bài viết có cùng `created_at` chính xác đến microsecond được phân định bằng `id`.
- **Trường hợp 4**: Một bài viết không ghim mới tạo (có `created_at` mới hơn bài ghim cũ) sẽ **KHÔNG BAO GIỜ** bị bỏ qua khi người dùng lướt tiếp từ bài ghim.
- **Trường hợp 5**: Thêm bài viết mới vào hệ thống giữa các lần lướt không làm hỏng dòng dữ liệu phân trang tiếp theo.
- **Trường hợp 6**: Đến cuối danh sách dữ liệu, hệ thống trả về chính xác `nextCursor = null` và `hasMore = false`.

---

## 7. KẾT QUẢ KIỂM THỬ RUNTIME & ĐỐI SOÁT DỮ LIỆU

### 7.1. Chạy toàn bộ 5 test suites Community
```bash
node --env-file=.env --test tests/community*.test.js
```
```
ℹ tests 189
ℹ suites 38
ℹ pass 189
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1210.544
```

### 7.2. Chi tiết bộ kiểm thử Task 24.08C.1 & 24.08C.1A (26/26 tests PASS)
- **Group 1: Static Schema & Migration Script Audit (5/5 PASS)**: Kiểm tra cấu trúc migration, không chứa `current_user` trong SECURITY DEFINER, đồng bộ schema.
- **Group 2: Unverified Author Disconnection & Safe Attribution (4/4 PASS)**: Không map tác giả bằng display name, yêu cầu UUID hợp lệ, ngắt liên kết sai sót Post 7.
- **Group 3: Content Collision & Deduplication Integrity (2/2 PASS)**: Bảo toàn bình luận trùng nội dung có id khác nhau, đảm bảo tính idempotent.
- **Group 4: 3-Tuple Cursor Pagination Logic Simulation (4/4 PASS)**: Kiểm chứng 6 ca phân trang biên.
- **Group 5: Security Definer Threat Model & Runtime Authorization (8/8 PASS)**:
  - 5.1. Học viên A bị từ chối khi INSERT với `author_id` của Học viên B.
  - 5.2. Học viên A cố tình điền `legacy_source_id` giả mạo sẽ bị xóa về `NULL`.
  - 5.3. Học viên A cố tình UPDATE `legacy_source_id` hoặc `legacy_author_name` sẽ bị khôi phục về giá trị cũ.
  - 5.4. Học viên A chuyển bài viết hoặc đổi trạng thái kiểm duyệt bị từ chối bằng exception.
  - 5.5. Quản trị viên chủ động (Active Admin) có toàn quyền kiểm duyệt và đổi trạng thái.
  - 5.6. Quản trị viên bị khóa (Blocked Admin) bị tước quyền và xử lý như người dùng thường.
  - 5.7. Phiên di trú của `postgres` với token nội bộ được phép thiết lập `author_id = NULL` và metadata legacy.
  - 5.8. Học viên thiết lập cờ session variable không thể bypass vì bị chặn bởi `SESSION_USER = 'authenticator'`.
- **Group 6: Live Supabase Database Checks (3/3 PASS)**: Dữ liệu thực tế được bảo toàn; RPC `audit_community_post_counters()` xác nhận sai lệch = 0; không lộ Service Role Key.

---

## 8. HƯỚNG DẪN CHẠY MIGRATION AN TOÀN TRÊN SUPABASE CLOUD SQL EDITOR

Quản trị viên có thể sao chép và thực thi toàn bộ đoạn mã SQL chuẩn hóa dưới đây trên **Supabase Cloud SQL Editor**:

```sql
-- =========================================================================
-- HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08C.1A
-- PRODUCTION MIGRATION SCRIPT: LEGACY INTEGRITY & SECURITY DEFINER HARDENING
-- =========================================================================

BEGIN;

-- 1. Bổ sung các cột lưu trữ danh tính nguồn và tên tác giả lịch sử
ALTER TABLE public.community_comments 
  ADD COLUMN IF NOT EXISTS legacy_source_id TEXT,
  ADD COLUMN IF NOT EXISTS legacy_author_name TEXT;

-- 2. Đảm bảo chống trùng lặp bình luận di trú theo từng bài viết
CREATE UNIQUE INDEX IF NOT EXISTS uq_community_comments_legacy_source 
  ON public.community_comments (post_id, legacy_source_id) 
  WHERE legacy_source_id IS NOT NULL;

-- 3. Tạo compound index phục vụ phân trang feed tối ưu (3-tuple cursor)
CREATE INDEX IF NOT EXISTS idx_community_posts_feed_compound 
  ON public.community_posts (is_pinned DESC, created_at DESC, id DESC) 
  WHERE deleted_at IS NULL AND status <> 'hidden';

-- 4. Cập nhật trigger bảo vệ bình luận loại bỏ triệt để rủi ro SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.enforce_community_comment_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_service_role BOOLEAN;
  v_is_admin BOOLEAN;
  v_is_migration_session BOOLEAN;
BEGIN
  v_is_service_role := (
    auth.role() = 'service_role' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
  );

  v_is_admin := public.is_admin();

  v_is_migration_session := (
    current_setting('hanzigo.internal_migration_session', true) = 'true'
    AND (
      SESSION_USER IN ('postgres', 'supabase_admin')
      OR v_is_service_role
    )
  );

  IF TG_OP = 'INSERT' THEN
    IF NOT (v_is_service_role OR v_is_admin OR v_is_migration_session) THEN
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể đăng bình luận dưới danh nghĩa người khác.';
      END IF;
      NEW.author_id := auth.uid();
      NEW.status := 'published';
      NEW.deleted_at := NULL;
      NEW.created_at := NOW();
      NEW.legacy_source_id := NULL;
      NEW.legacy_author_name := NULL;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NOT (v_is_service_role OR v_is_admin OR v_is_migration_session) THEN
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể thay đổi tác giả bình luận.';
      END IF;
      IF NEW.post_id IS DISTINCT FROM OLD.post_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển bình luận sang bài viết khác.';
      END IF;
      IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể sửa đổi thời gian đăng bình luận.';
      END IF;
      IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền đổi trạng thái bình luận.';
      END IF;
      IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa bình luận.';
      END IF;
      NEW.legacy_source_id := OLD.legacy_source_id;
      NEW.legacy_author_name := OLD.legacy_author_name;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- 5. Kích hoạt cờ di trú đặc quyền trong phiên giao dịch hiện tại
SELECT set_config('hanzigo.internal_migration_session', 'true', true);

-- 6. Hiệu chỉnh bình luận đã map sai danh tính ở Task trước
UPDATE public.community_comments
SET 
  author_id = NULL,
  legacy_source_id = 'comment-1791666635196',
  legacy_author_name = 'Alibaba và 36 tên Thanh Hoá'
WHERE post_id = 7 AND (content = 'ní hảo ní nha' OR legacy_source_id = 'comment-1791666635196');

UPDATE public.community_comments
SET 
  author_id = NULL,
  legacy_source_id = 'c1',
  legacy_author_name = 'Nguyễn Văn Minh'
WHERE post_id = 3 AND (content LIKE '%Phần luyện bút thuận%' OR legacy_source_id = 'c1');

-- 7. Di chuyển các bình luận lịch sử còn thiếu (đảm bảo idempotent)
INSERT INTO public.community_comments (
  post_id,
  author_id,
  content,
  status,
  legacy_source_id,
  legacy_author_name,
  created_at,
  updated_at
)
SELECT
  p.id AS post_id,
  CASE 
    WHEN (elem->>'user_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
      AND EXISTS (SELECT 1 FROM public.profiles WHERE id = (elem->>'user_id')::uuid)
    THEN (elem->>'user_id')::uuid
    WHEN (elem->>'author_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
      AND EXISTS (SELECT 1 FROM public.profiles WHERE id = (elem->>'author_id')::uuid)
    THEN (elem->>'author_id')::uuid
    ELSE NULL
  END AS author_id,
  TRIM(elem->>'content') AS content,
  'published' AS status,
  COALESCE(elem->>'id', 'idx_' || ord::text) AS legacy_source_id,
  COALESCE(TRIM(elem->>'author'), TRIM(elem->>'author_name'), 'Học viên HanziGo') AS legacy_author_name,
  COALESCE(
    CASE 
      WHEN (elem->>'time') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'time')::timestamptz
      WHEN (elem->>'created_at') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'created_at')::timestamptz
      ELSE p.created_at
    END,
    NOW()
  ) AS created_at,
  COALESCE(
    CASE 
      WHEN (elem->>'time') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'time')::timestamptz
      WHEN (elem->>'created_at') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'created_at')::timestamptz
      ELSE p.created_at
    END,
    NOW()
  ) AS updated_at
FROM public.community_posts p,
jsonb_array_elements(
  CASE 
    WHEN jsonb_typeof(p.comments) = 'array' THEN p.comments 
    ELSE '[]'::jsonb 
  END
) WITH ORDINALITY AS arr(elem, ord)
WHERE elem->>'content' IS NOT NULL 
  AND TRIM(elem->>'content') <> ''
  AND NOT EXISTS (
    SELECT 1 
    FROM public.community_comments c 
    WHERE c.post_id = p.id 
      AND c.legacy_source_id = COALESCE(elem->>'id', 'idx_' || ord::text)
  );

-- 8. Di chuyển lượt thích lịch sử có UUID hợp lệ
INSERT INTO public.community_reactions (
  post_id,
  user_id,
  reaction_type,
  created_at
)
SELECT
  p.id AS post_id,
  pr.id AS user_id,
  'like' AS reaction_type,
  COALESCE(p.created_at, NOW()) AS created_at
FROM public.community_posts p,
jsonb_array_elements_text(
  CASE 
    WHEN jsonb_typeof(p.liked_by) = 'array' THEN p.liked_by 
    ELSE '[]'::jsonb 
  END
) AS val
JOIN public.profiles pr ON pr.id::text = val
WHERE val ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
ON CONFLICT (post_id, user_id) DO NOTHING;

-- 9. Đối soát bộ đếm bằng token nội bộ (không cần tắt trigger)
DO $$
DECLARE
  v_post RECORD;
  v_comm_count BIGINT;
  v_rx_count BIGINT;
  v_likes_count INT;
BEGIN
  FOR v_post IN SELECT id, likes FROM public.community_posts LOOP
    SELECT COUNT(*) INTO v_comm_count
    FROM public.community_comments
    WHERE post_id = v_post.id AND status = 'published' AND deleted_at IS NULL;

    SELECT COUNT(*) INTO v_rx_count
    FROM public.community_reactions
    WHERE post_id = v_post.id;

    v_likes_count := v_rx_count + GREATEST(0, COALESCE(v_post.likes, 0) - v_rx_count);

    PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
    UPDATE public.community_posts
    SET 
      comments_count = v_comm_count,
      likes_count = v_likes_count
    WHERE id = v_post.id;
  END LOOP;
END;
$$;

-- 10. Hủy bỏ cờ di trú đặc quyền
SELECT set_config('hanzigo.internal_migration_session', '', true);

-- 11. Cập nhật hàm telemetry đối soát
DROP FUNCTION IF EXISTS public.audit_community_post_counters();

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
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO authenticated, service_role;

COMMIT;
```

---

## 9. ĐỀ XUẤT BƯỚC TIẾP THEO

Theo đúng nguyên tắc ranh giới của Phase 24, sau khi hoàn thành Task 24.08C.1A:
- Hệ thống đã sẵn sàng cho bước tiếp theo: **Task 24.08D — Community Reports & Moderation UI** (Giao diện gửi báo cáo vi phạm, kiểm duyệt bài viết và bình luận).
- Không tự ý triển khai trước khi có chỉ thị từ người dùng.

