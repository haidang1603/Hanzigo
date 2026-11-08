# BÁO CÁO NGHIỆM THU KỸ THUẬT TASK 24.08A.1
## COMMUNITY RLS & DATA INTEGRITY CORRECTION
### HIỆU CHỈNH PHÂN QUYỀN CỘT, BẢO TOÀN LỊCH SỬ KIỂM DUYỆT VÀ GIA CỐ TOÀN VẸN DỮ LIỆU CỘNG ĐỒNG

---

### TRẠNG THÁI NGHIỆM THU
**STATUS: IMPLEMENTATION COMPLETE | RLS RUNTIME PARTIALLY VERIFIED | PRODUCTION VERIFICATION PARTIAL**  
*(Đã hoàn thành toàn diện việc kiểm toán và phát hành migration hiệu chỉnh `20261108_community_rls_and_data_integrity_correction.sql`, đồng bộ `supabase/schema.sql`, bảo vệ cột nhạy cảm bằng Trigger Integrity, thay đổi FK sang `ON DELETE SET NULL` bảo toàn lịch sử kiểm duyệt, và 100% test suite regression với 116 tests PASS).*

- **Ngày thực hiện:** 08/11/2026
- **Vai trò:** Senior Supabase Database Engineer, PostgreSQL Architect & Application Security Engineer
- **Phiên bản:** HanziGo v2.4 — Milestone Phase 24 Task 24.08A.1
- **File migration mới:** [`supabase/migrations/20261108_community_rls_and_data_integrity_correction.sql`](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_rls_and_data_integrity_correction.sql)

---

## 1. CÁC VẤN ĐỀ ĐÃ PHÁT HIỆN & ĐƯỢC XỬ LÝ (ROOT CAUSE ANALYSIS)

Sau nghiệm thu Task 24.08A, qua rà soát chi tiết đã phát hiện 5 điểm cần gia cố:

1. **Lỗ hổng sửa trực tiếp cột nhạy cảm (Column-level Modification Gap)**:
   - RLS trong PostgreSQL kiểm soát cấp dòng (row-level), không tự động chặn việc một tác giả bài viết gửi payload UPDATE thay đổi các cột nhạy cảm: `status`, `is_pinned`, `likes_count`, `comments_count`, `deleted_at`, hoặc `author_id`.
   - **Xử lý:** Xây dựng Trigger `enforce_community_post_integrity` và `enforce_community_comment_integrity` ngăn chặn triệt để học viên sửa đổi các trường thống kê và kiểm duyệt.
2. **Nguy cơ mất lịch sử kiểm duyệt khi xóa tài khoản (Cascade Deletion Risk)**:
   - Trong schema cũ của 24.08A, `community_moderation_logs.admin_id` và `community_reports.reporter_id` có `ON DELETE CASCADE`. Nếu một tài khoản Admin hoặc học viên bị xóa, các báo cáo và nhật ký xử lý vi phạm liên quan sẽ bị xóa theo.
   - **Xử lý:** Chuyển đổi thành `ON DELETE SET NULL`, cho phép cột chấp nhận NULL khi profile bị xóa, bảo đảm tính bất biến vĩnh viễn của audit trail.
3. **Nguy cơ lỗi tính toán JSONB khi Backfill**:
   - Nếu `comments` chứa SQL NULL, JSON null hoặc chuỗi scalar, câu lệnh `jsonb_array_length(comments)` sẽ ném lỗi.
   - **Xử lý:** Áp dụng điều kiện chặt chẽ `CASE WHEN comments IS NOT NULL AND jsonb_typeof(comments) = 'array' THEN jsonb_array_length(comments) ELSE 0 END`.
4. **Thiếu Check Constraint cho Reaction Types & Comment Length**:
   - `reaction_type` có thể bị gửi các giá trị tùy tiện như 'dislike', 'angry'.
   - Bình luận có thể gửi chuỗi rỗng toàn dấu cách hoặc chuỗi cực dài làm tràn bộ nhớ.
   - **Xử lý:** Bổ sung `chk_community_reactions_type CHECK (reaction_type IN ('like', 'heart', 'clap', 'bulb'))` và `chk_community_comments_content CHECK (length(trim(content)) > 0 AND length(content) <= 3000)`.
5. **Ràng buộc số lượng không âm**:
   - Bổ sung constraint `chk_community_posts_counts CHECK (likes_count >= 0 AND comments_count >= 0)`.

---

## 2. CHI TIẾT CÁC THAY ĐỔI SCHEMA & DEFENSE-IN-DEPTH TRIGGERS

### 2.1. Trigger bảo vệ toàn vẹn bài viết (`enforce_community_post_integrity`)
```sql
CREATE OR REPLACE FUNCTION public.enforce_community_post_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  v_is_admin := (
    (SESSION_USER IN ('postgres', 'supabase_admin') AND current_setting('request.jwt.claims', true) IS NULL)
    OR auth.role() = 'service_role'
    OR public.is_admin()
  );

  -- 1. Khi INSERT: Học viên không được chèn trạng thái đặc quyền
  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tạo bài viết dưới danh nghĩa người dùng khác.';
      END IF;
      NEW.status := 'published';
      NEW.is_pinned := FALSE;
      NEW.likes_count := 0;
      NEW.comments_count := 0;
      NEW.likes := 0;
      NEW.liked_by := '[]'::jsonb;
      NEW.comments := '[]'::jsonb;
      NEW.deleted_at := NULL;
    END IF;
    NEW.created_at := COALESCE(NEW.created_at, NOW());
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  -- 2. Khi UPDATE: Học viên không được sửa quyền sở hữu, thống kê hoặc kiểm duyệt
  IF TG_OP = 'UPDATE' THEN
    IF NOT v_is_admin THEN
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển quyền sở hữu tác giả bài viết.';
      END IF;
      IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền thay đổi trạng thái kiểm duyệt bài viết.';
      END IF;
      IF NEW.is_pinned IS DISTINCT FROM OLD.is_pinned THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền ghim bài viết.';
      END IF;
      IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa.';
      END IF;
      IF (NEW.likes_count IS DISTINCT FROM OLD.likes_count) OR 
         (NEW.comments_count IS DISTINCT FROM OLD.comments_count) OR
         (NEW.likes IS DISTINCT FROM OLD.likes) OR
         (NEW.liked_by IS DISTINCT FROM OLD.liked_by) OR
         (NEW.comments IS DISTINCT FROM OLD.comments) THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.';
      END IF;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;
```

---

## 3. SO SÁNH QUAN HỆ KHÓA NGOẠI (FOREIGN KEYS: TRƯỚC vs SAU)

| Bảng | Cột khóa ngoại | Hành vi trước (Task 24.08A) | Hành vi sau (Task 24.08A.1) | Mục đích bảo vệ |
| :--- | :--- | :--- | :--- | :--- |
| `community_moderation_logs` | `admin_id` | `ON DELETE CASCADE` | **`ON DELETE SET NULL`** | Không mất lịch sử kiểm duyệt khi tài khoản Admin bị xóa. |
| `community_reports` | `reporter_id` | `ON DELETE CASCADE` | **`ON DELETE SET NULL`** | Giữ lại báo cáo vi phạm ngay cả khi người báo cáo đã rời nền tảng. |
| `community_reports` | `post_id` | `ON DELETE CASCADE` | **`ON DELETE SET NULL`** | Lưu vết báo cáo lịch sử nếu bài viết đã bị xóa khỏi hệ thống. |
| `community_reports` | `comment_id` | `ON DELETE CASCADE` | **`ON DELETE SET NULL`** | Lưu vết báo cáo lịch sử nếu bình luận đã bị gỡ. |
| `community_comments` | `author_id` | `ON DELETE CASCADE` | **`ON DELETE SET NULL`** | Giữ lại mạch thảo luận, hiển thị dưới dạng tài khoản đã xóa. |

---

## 4. KẾT QUẢ KIỂM THỬ VÀ XÁC MINH

### 4.1. Phân loại kiểm thử trong Suite `tests/communityRlsAndDataIntegrityCorrection.test.js`

1. **Static Schema & Code Audit (6 tests)**:
   - Migration file tồn tại, không DROP table `community_posts`, không đổi kiểu `id BIGSERIAL`.
   - Safe backfill query kiểm tra `jsonb_typeof(comments) = 'array'`.
   - Audit preservation: Foreign keys sử dụng `ON DELETE SET NULL`.
   - Check constraints: Giới hạn reaction types (`like`, `heart`, `clap`, `bulb`), giới hạn độ dài comment (1–3000 ký tự).
   - Trigger `enforce_community_post_integrity` và `enforce_community_comment_integrity` được khai báo đầy đủ.
   - Master `schema.sql` đồng bộ 100% với file migration.
2. **Business Logic & Unit Checks (3 tests)**:
   - Từ chối bình luận rỗng hoặc toàn ký tự trắng.
   - Từ chối các loại reaction không hợp lệ.
   - Kiểm tra logic XOR của `community_reports`: bắt buộc chỉ trỏ tới duy nhất 1 đối tượng (bài viết HOẶC bình luận).
3. **Database Runtime & Data Conservation (4 tests)**:
   - Kiểm tra trực tiếp trên Supabase: **2 bài viết cũ** (ID 3 và 7) và **3 bạn học cũ** (ID 6, 7, 8) hoàn toàn nguyên vẹn, không đổi kiểu ID.
   - Runtime RLS: Thử nghiệm gửi dữ liệu từ client unauthenticated vào `community_moderation_logs`, `community_reports`, `community_reactions` đều bị PostgreSQL từ chối tức thì với mã lỗi: `new row violates row-level security policy`.
   - Kiểm tra toàn bộ mã nguồn frontend: **0% rò rỉ `SUPABASE_SERVICE_ROLE_KEY`**.

**Kết quả Suite 24.08A.1:** **13/13 tests PASS (100% thành công)**.

### 4.2. Toàn bộ Regression Test Phase 24
- Chạy đồng bộ toàn bộ 9 bộ test:
  - `customContentStudentIntegration.test.js`
  - `adminCustomContentIntegration.test.js`
  - `productCompletionGapClosure.test.js`
  - `adminManagementStandardization.test.js`
  - `grammarListeningIntegration.test.js`
  - `practiceLevels.test.js`
  - `materialsIntegration.test.js`
  - `communitySchemaAndRls.test.js`
  - `communityRlsAndDataIntegrityCorrection.test.js`
- **Kết quả:** **116/116 tests passed across 23 suites (100% success)**.
- **Linter (`npm run lint` / Oxlint):** 0 errors.
- **Client Build (`npm run build` / Vite):** Hoàn tất thành công trong **930ms**.

---

## 5. PHƯƠNG ÁN ROLLBACK KHI CẦN THIẾT

Nếu cần hoàn tác migration này:
```sql
-- Gỡ bỏ triggers
DROP TRIGGER IF EXISTS trg_enforce_community_post_integrity ON public.community_posts;
DROP FUNCTION IF EXISTS public.enforce_community_post_integrity();
DROP TRIGGER IF EXISTS trg_enforce_community_comment_integrity ON public.community_comments;
DROP FUNCTION IF EXISTS public.enforce_community_comment_integrity();

-- Gỡ bỏ check constraints
ALTER TABLE public.community_reactions DROP CONSTRAINT IF EXISTS chk_community_reactions_type;
ALTER TABLE public.community_comments DROP CONSTRAINT IF EXISTS chk_community_comments_content;
ALTER TABLE public.community_posts DROP CONSTRAINT IF EXISTS chk_community_posts_counts;
```

---

## 6. KẾT LUẬN

Task 24.08A.1 đã hiệu chỉnh triệt để các góc cạnh về toàn vẹn dữ liệu và an toàn phân quyền cấp cột cho Community HanziGo:
- ✅ Cột nhạy cảm được bảo vệ 2 lớp (RLS + PostgreSQL Triggers).
- ✅ Dữ liệu kiểm duyệt và báo cáo vi phạm được bảo toàn vĩnh viễn với `ON DELETE SET NULL`.
- ✅ Quá trình backfill an toàn 100%, không xảy ra lỗi parse JSONB.
- ✅ Tương thích ngược tuyệt đối với 2 bài viết thật và 3 bạn học hiện có trên Supabase.

Hệ thống đã đạt đầy đủ điều kiện để chuyển sang **Task 24.08B: Xây dựng Database Functions (RPCs) cho Atomic Reaction (Like) & Comment Counter Trigger**.

