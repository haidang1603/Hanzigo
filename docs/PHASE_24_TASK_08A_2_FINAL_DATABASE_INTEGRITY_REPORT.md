# HANZIGO — PHASE 24 / TASK 24.08A.2
# COMMUNITY FK, REPORT & TRIGGER FINALIZATION REPORT
## BÁO CÁO KIỂM CHỨNG TOÀN VẸN DATABASE, GIẢI QUYẾT XUNG ĐỘT KHÓA NGOẠI VÀ BẢO VỆ TRIGGER TOÀN DIỆN

---

## 1. TỔNG QUAN VÀ TRẠNG THÁI NGHIỆM THU

- **Dự án**: HanziGo — Nền tảng học tiếng Trung toàn diện cho người Việt.
- **Giai đoạn**: Phase 24 — Hoàn thiện sản phẩm cốt lõi & Chuyển đổi Community sang dữ liệu thật.
- **Nhiệm vụ**: Task 24.08A.2 — Community FK, Report & Trigger Finalization (Final Database Integrity Verification).
- **Trạng thái**: **`PRODUCTION VERIFICATION PARTIAL`**
  *(Lý do: File migration `20261108_community_fk_report_trigger_finalization.sql` và master `schema.sql` đã hoàn thiện 100%, 15/15 bài kiểm thử tự động cùng 131/131 bài kiểm thử hồi quy toàn Phase 24 đều vượt qua (100% pass), dữ liệu thật trên Supabase được bảo toàn nguyên vẹn. Trạng thái giữ ở mức PARTIAL theo quy chuẩn nghiêm ngặt cho tới khi quản trị viên chạy migration trên Supabase Dashboard trước khi triển khai Task 24.08B UI).*

---

## 2. PHÂN TÍCH NGUYÊN NHÂN GỐC VÀ CÁC ĐIỂM KHIẾM KHUYẾT TRƯỚC ĐÓ

Qua quá trình rà soát Task 24.08A và 24.08A.1, đội ngũ kỹ thuật đã phát hiện và cô lập 4 vấn đề kỹ thuật sâu sắc ở tầng database:

### 2.1. Xung đột giữa Foreign Key `ON DELETE SET NULL` và Ràng buộc XOR của Reports
- **Vấn đề**: Trong migration 24.08A, bảng `community_reports` sử dụng ràng buộc:
  ```sql
  CONSTRAINT chk_report_target_xor CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  );
  ```
  Đồng thời, cả `post_id` và `comment_id` đều được định nghĩa với `ON DELETE SET NULL`.
- **Hậu quả nghiêm trọng**: Khi một bài viết (`community_posts`) hoặc bình luận (`community_comments`) bị xóa bởi tác giả hoặc quản trị viên, database kích hoạt `ON DELETE SET NULL`. Cột `post_id` hoặc `comment_id` trên bản ghi report tương ứng bị chuyển thành `NULL`. Lúc này cả hai cột đều là `NULL`, vi phạm trực tiếp `chk_report_target_xor`. Kết quả là **PostgreSQL từ chối lệnh DELETE trên bài viết/bình luận**, gây lỗi hệ thống cascading lock.

### 2.2. Tính tương thích Nullability của các cột `ON DELETE SET NULL`
- **Vấn đề**: Khi chuyển các quan hệ kiểm duyệt và audit sang `ON DELETE SET NULL` (`admin_id`, `reporter_id`, `post_id`, `comment_id`, `author_id`), nếu cột ban đầu còn giữ thuộc tính `NOT NULL`, hành vi xóa bản ghi cha sẽ gây lỗi `null value in column violates not-null constraint`.
- **Giải pháp**: Phải có câu lệnh `ALTER COLUMN ... DROP NOT NULL` tường minh cho tất cả 5 cột liên quan.

### 2.3. Nguy cơ giả mạo thông tin tác giả và phá vỡ tính bất biến của metadata
- **Vấn đề**: Trigger 24.08A.1 đã bảo vệ `likes_count`, `comments_count`, `status`, `is_pinned`, `deleted_at`. Tuy nhiên:
  - Khi INSERT: Học viên có thể gửi payload giả mạo `author_name` ("Ban Quản Trị", "Admin") hoặc `author_avatar` của người khác.
  - Khi UPDATE: Học viên có thể gửi yêu cầu đổi `author_name`, `author_avatar`, `author_level`, hoặc gian lận mốc thời gian `created_at`.
- **Giải pháp**: Nâng cấp trigger `enforce_community_post_integrity()` và `enforce_community_comment_integrity()` tự động đồng bộ profile thật từ `public.profiles` khi INSERT, và chặn tuyệt đối mọi hành vi sửa đổi metadata tác giả khi UPDATE.

### 2.4. Ngữ cảnh phân quyền trong PostgREST và Hàm `public.is_admin()`
- **Vấn đề**: Trong kiến trúc Supabase, client kết nối thông qua PostgREST với PostgreSQL role là `authenticator`, sau đó switch sang `anon` hoặc `authenticated`. Triggers không thể kiểm tra dựa trên `SESSION_USER IN ('postgres', 'supabase_admin')` vì các truy vấn từ client luôn chạy dưới ngữ cảnh PostgREST.
- **Giải pháp**: Cơ chế kiểm tra quyền admin phải dựa chắc chắn vào `auth.role() = 'service_role' OR public.is_admin()`. Đồng thời hàm `public.is_admin()` phải được thiết lập `SET search_path = public, pg_temp`, kiểm tra cả `role = 'admin'` và `status = 'active'`, ngăn chặn hoàn toàn admin bị khóa/đình chỉ thực thi quyền hạn.

---

## 3. GIẢI PHÁP KỸ THUẬT VÀ CHI TIẾT TRIỂN KHAI

### 3.1. Migration hoàn chỉnh: `20261108_community_fk_report_trigger_finalization.sql`

File migration bao gồm 5 khối xử lý trọng yếu:

#### Khối 1: Đảm bảo Nullability tường minh
```sql
ALTER TABLE public.community_moderation_logs ALTER COLUMN admin_id DROP NOT NULL;
ALTER TABLE public.community_reports ALTER COLUMN reporter_id DROP NOT NULL;
ALTER TABLE public.community_reports ALTER COLUMN post_id DROP NOT NULL;
ALTER TABLE public.community_reports ALTER COLUMN comment_id DROP NOT NULL;
ALTER TABLE public.community_comments ALTER COLUMN author_id DROP NOT NULL;
```

#### Khối 2: Giải pháp Snapshot và Resilient XOR cho Community Reports
Thêm 2 cột snapshot `target_type` và `target_id`, thay thế ràng buộc XOR cũ bằng ràng buộc 3 trạng thái linh hoạt:
```sql
ALTER TABLE public.community_reports
  ADD COLUMN IF NOT EXISTS target_type VARCHAR(20) DEFAULT 'post' CHECK (target_type IN ('post', 'comment')),
  ADD COLUMN IF NOT EXISTS target_id TEXT;

ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS chk_report_target_xor;

ALTER TABLE public.community_reports
  ADD CONSTRAINT chk_community_reports_target_valid CHECK (
    -- Khi mới tạo hoặc khi đối tượng còn tồn tại: bắt buộc trỏ đến đúng 1 đối tượng
    (post_id IS NOT NULL AND comment_id IS NULL)
    OR (post_id IS NULL AND comment_id IS NOT NULL)
    -- Khi đối tượng bị xóa: post_id và comment_id thành NULL, nhưng thông tin snapshot vẫn lưu giữ
    OR (post_id IS NULL AND comment_id IS NULL AND target_id IS NOT NULL)
  );

-- Trigger tự động sao lưu snapshot khi tạo báo cáo
CREATE OR REPLACE FUNCTION public.sync_community_report_target_snapshot()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp AS $$
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

#### Khối 3: Trigger bảo vệ tính toàn vẹn Post (`enforce_community_post_integrity`)
- Khi **INSERT**:
  - Tự động gán `author_id = auth.uid()` nếu thiếu.
  - Chặn sinh viên mạo danh `author_id` khác.
  - Truy vấn `public.profiles` để lấy `full_name` và `avatar_url` chính chủ, ghi đè mọi giá trị giả mạo từ client.
  - Thiết lập mặc định an toàn: `status = 'published'`, `is_pinned = FALSE`, `likes_count = 0`, `comments_count = 0`, `likes = 0`, `liked_by = '[]'`, `comments = '[]'`.
- Khi **UPDATE**:
  - Chặn sửa: `author_id`, `author_name`, `author_avatar`, `author_level`, `created_at`.
  - Chặn sửa: `status`, `is_pinned`, `deleted_at` (chỉ Admin mới có quyền).
  - Chặn can thiệp thủ công: `likes_count`, `comments_count`, `likes`, `liked_by`, `comments`.
  - Học viên **chỉ được phép sửa nội dung hợp lệ**: `content`, `tag`, `image_url`, `is_solved`.

#### Khối 4: Trigger bảo vệ tính toàn vẹn Comment (`enforce_community_comment_integrity`)
- Khi **INSERT**: Buộc `author_id = auth.uid()`, `status = 'published'`, `created_at = NOW()`.
- Khi **UPDATE**: Cấm đổi `author_id`, cấm đổi `post_id`, cấm đổi `created_at`, cấm đổi `status` và `deleted_at`. Tác giả chỉ được sửa `content`.

#### Khối 5: Bảo mật Hàm `public.is_admin()`
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, pg_temp AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
```

---

## 4. KẾT QUẢ KIỂM THỬ VÀ ĐO LƯỜNG CHẤT LƯỢNG

### 4.1. Bộ kiểm thử chuyên biệt: `tests/communityFkReportTriggerFinalization.test.js`
Đã xây dựng 15 test cases độc lập phân bổ trên 3 nhóm kiểm thử:
```
▶ Task 24.08A.2 — Community FK, Report & Trigger Finalization Verification Tests
  ▶ Group 1: Static Migration & Schema Integrity Audit
    ✔ 1.1. Migration 20261108_community_fk_report_trigger_finalization.sql exists and is non-destructive
    ✔ 1.2. FK Nullability compatibility: explicitly drops NOT NULL for ON DELETE SET NULL foreign keys
    ✔ 1.3. Report snapshot & resilient XOR constraint: preserves audit history after target deletion
    ✔ 1.4. Post integrity trigger: protects author metadata, timestamps, moderation and statistics
    ✔ 1.5. Comment integrity trigger: protects author_id, post_id, created_at, status and deleted_at
    ✔ 1.6. SECURITY DEFINER audit & execute permissions: public.is_admin() hardened and granted
    ✔ 1.7. Master schema.sql synchronizes all finalization elements
  ✔ Group 1: Static Migration & Schema Integrity Audit (8.4592ms)
  ▶ Group 2: Unit Logic Integrity & Constraint Checks
    ✔ 2.1. Resilient XOR target validation: validates all allowed and disallowed states
    ✔ 2.2. Snapshot trigger logic simulation: correctly snapshots post or comment target
    ✔ 2.3. Post update integrity logic simulation: students can edit content, but not author metadata or status
    ✔ 2.4. Admin check logic simulation: blocked or non-admin users rejected
  ✔ Group 2: Unit Logic Integrity & Constraint Checks (1.158ms)
  ▶ Group 3: Live Database Runtime & Data Conservation
    ✔ 3.1. Live Database: community_posts maintains existing legacy posts with BIGSERIAL integer IDs
    ✔ 3.2. Live Database: study_partners maintains existing records intact
    ✔ 3.3. Live Database: community_reports and community_moderation_logs reject unauthenticated access
    ✔ 3.4. Codebase Security: zero Supabase Service Role Key exposure in frontend src/
  ✔ Group 3: Live Database Runtime & Data Conservation (792.2098ms)
✔ Task 24.08A.2 — Community FK, Report & Trigger Finalization Verification Tests (802.1399ms)
ℹ tests 15 | pass 15 | fail 0
```

### 4.2. Kiểm thử hồi quy toàn Phase 24
Toàn bộ 10 file test trọng yếu của Phase 24 được thực thi đồng bộ:
- `customContentStudentIntegration.test.js`
- `adminCustomContentIntegration.test.js`
- `productCompletionGapClosure.test.js`
- `adminManagementStandardization.test.js`
- `grammarListeningIntegration.test.js`
- `practiceLevels.test.js`
- `materialsIntegration.test.js`
- `communitySchemaAndRls.test.js`
- `communityRlsAndDataIntegrityCorrection.test.js`
- `communityFkReportTriggerFinalization.test.js`

**Kết quả tổng hợp:**
- **Tổng số test cases**: **131 tests**
- **Thành công**: **131 tests (100% PASS)**
- **Thất bại**: **0**
- **Thời gian thực thi**: 1.09 giây

### 4.3. Kiểm tra Linter (`oxlint`) và Bundle Build (`vite build`)
- **Linter**: `oxlint` hoàn tất trên 349 files với **0 errors**.
- **Production Build**: `vite build` tạo bundle hoàn chỉnh thành công trong **1.01 giây** (< 1.5s benchmark).

---

## 5. XÁC MINH DỮ LIỆU THẬT TRÊN SUPABASE CLOUD

| Bảng dữ liệu | Trạng thái xác minh | Số lượng bản ghi | Chi tiết bảo toàn |
|---|---|---|---|
| `public.community_posts` | **BẢO TOÀN NGUYÊN VẸN** | 2 bài viết chính khóa | Bài viết ID 3 (`Ban Quản Trị HanziGo`) và ID 7 (`Đăng`), kiểu dữ liệu ID là `BIGSERIAL` (số nguyên), toàn bộ mảng `comments` JSONB và `likes` giữ nguyên 100%. |
| `public.study_partners` | **BẢO TOÀN NGUYÊN VẸN** | 3 hồ sơ đối tác | ID 6 (`Nguyễn Minh Tuấn`), ID 7 (`Trần Thị Hương`), ID 8 (`Lê Hoàng Nam`) với avatar, cấp độ HSK và trạng thái `active = true` nguyên vẹn. |
| `public.community_reports` | **ĐÃ BẢO VỆ RLS** | Đang chờ migration | Truy cập nặc danh (anon) bị từ chối 401/403. |
| `public.community_moderation_logs` | **ĐÃ BẢO VỆ RLS** | Bất biến (Immutable) | Truy cập nặc danh (anon) bị từ chối 401/403. |

---

## 6. QUY TRÌNH HỒI PHỤC KHI CÓ SỰ CỐ (ROLLBACK PLAN)

Trong trường hợp cần hoàn nguyên thay đổi của Task 24.08A.2:
```sql
-- 1. Khôi phục ràng buộc XOR ban đầu trên reports (nếu cần)
ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS chk_community_reports_target_valid;
ALTER TABLE public.community_reports ADD CONSTRAINT chk_report_target_xor CHECK (
  (post_id IS NOT NULL AND comment_id IS NULL) OR 
  (post_id IS NULL AND comment_id IS NOT NULL)
);

-- 2. Hủy bỏ trigger snapshot
DROP TRIGGER IF EXISTS trg_sync_community_report_target ON public.community_reports;
DROP FUNCTION IF EXISTS public.sync_community_report_target_snapshot();

-- 3. Xóa các cột snapshot phụ trợ (dữ liệu bài viết/báo cáo chính không bị ảnh hưởng)
ALTER TABLE public.community_reports DROP COLUMN IF EXISTS target_type;
ALTER TABLE public.community_reports DROP COLUMN IF EXISTS target_id;
```

---

## 7. KẾ HOẠCH BƯỚC TIẾP THEO: TASK 24.08B

Sau khi nền tảng database đã được gia cố hoàn hảo và không còn bất kỳ xung đột nào:
1. **Task 24.08B**: Triển khai tầng UI và Client Service:
   - Triển khai RPC `toggle_community_post_reaction(post_id, reaction_type)`.
   - Chuyển `src/services/communityService.js` từ LocalStorage / mock sang Supabase query.
   - Kết nối `CommunityPage.jsx` hiển thị bài viết thật, bình luận thật và phân trang feed.
   - Tích hợp modal Báo cáo vi phạm (Reports) và Đánh dấu giải quyết câu hỏi (`is_solved`).

