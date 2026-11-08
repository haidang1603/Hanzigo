# HANZIGO PLATFORM — PHASE 24 / TASK 24.08C.1 REPORT
## COMMUNITY LEGACY MIGRATION INTEGRITY & CURSOR PAGINATION CORRECTION
### Báo Cáo Nghiệm Thu & Kiểm Chứng Toàn Vẹn Dữ Liệu Di Trú & Phân Trang Cursor 3 Thành Phần

---

## 1. TỔNG QUAN VÀ TRẠNG THÁI TRIỂN KHAI

| Thông Số | Chi Tiết |
| :--- | :--- |
| **Dự án** | HanziGo Community Learning Platform |
| **Phase / Task** | Phase 24 — Task 24.08C.1 |
| **Nhiệm vụ trọng tâm** | Sửa triệt để lỗi gán sai tác giả di trú do trùng tên; cơ chế chống trùng lặp bình luận bằng khóa nhận diện nguồn (`legacy_source_id`); giải phóng trigger `enforce_community_comment_integrity` cho phiên migration; sửa phân trang cursor 3-tuple `(is_pinned, created_at, id)` |
| **Trạng thái thẩm định** | **PRODUCTION VERIFICATION PARTIAL** |
| **File migration tạo mới** | `supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql` |
| **File kiểm thử runtime** | `tests/communityLegacyIntegrityAndCursorCorrection.test.js` |
| **Kết quả kiểm thử** | **180/180 tests PASS (100%)** qua toàn bộ 5 bộ test suites Community |
| **Trạng thái Build & Lint** | Lint 0 error, Vite Build thành công (964ms) |

> [!NOTE]
> Trạng thái được giữ nghiêm ngặt ở mức **`PRODUCTION VERIFICATION PARTIAL`** vì file migration `20261108_community_legacy_integrity_and_cursor_correction.sql` được chuẩn bị sẵn sàng, an toàn 100% không phá hủy (non-destructive) và đang chờ thực thi trực tiếp trên Supabase SQL Editor bởi quản trị viên.

---

## 2. KIỂM TOÁN VÀ ĐỐI SOÁT DỮ LIỆU THỰC TẾ TRÊN SUPABASE CLOUD

### 2.1. Kiểm tra trực tiếp bảng `public.community_posts`
```json
[
  {
    "id": 3,
    "likes": 12,
    "liked_by": [],
    "likes_count": 12,
    "comments_count": 1,
    "comments": [
      {
        "id": "c1",
        "time": "Hôm qua",
        "author": "Nguyễn Văn Minh",
        "content": "Ứng dụng tuyệt vời quá! Phần luyện bút thuận và nhận diện phát âm AI chấm điểm rất nhạy ạ!"
      }
    ]
  },
  {
    "id": 7,
    "likes": 1,
    "liked_by": [],
    "likes_count": 1,
    "comments_count": 1,
    "comments": [
      {
        "id": "comment-1791666635196",
        "time": "Vừa xong",
        "author": "Alibaba và 36 tên Thanh Hoá",
        "content": "ní hảo ní nha"
      }
    ]
  }
]
```

### 2.2. Phát hiện và xử lý lỗi gán sai tác giả (Author Attribution Issue)
- **Nguyên nhân gốc rễ**: Ở Task 24.08C trước đó, câu lệnh di trú tìm `profiles` bằng biểu thức so khớp tên hiển thị `WHERE pr.name = TRIM(elem->>'author')`. Do một tài khoản học viên trong cơ sở dữ liệu có tên là `"Alibaba và 36 tên Thanh Hoá"` (UUID: `7d9b3e76-a53f-4abd-a3aa-b565801ede89`), hệ thống đã vô tình gán `author_id` của bình luận cũ này cho học viên đó, vi phạm tính toàn vẹn danh tính và trách nhiệm phát ngôn.
- **Biện pháp khắc phục**:
  1. Hủy bỏ hoàn toàn việc map tác giả bằng display name (`pr.name` hoặc `pr.full_name`).
  2. Chỉ gán `author_id` khi trong nguồn dữ liệu JSONB tồn tại tường minh `user_id` hoặc `author_id` dưới định dạng chuỗi UUID hợp lệ (`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`) và tồn tại trong `public.profiles`.
  3. Mọi bình luận di trú không có UUID xác thực được đặt `author_id = NULL`.
  4. Bổ sung 2 cột: `legacy_source_id TEXT` (lưu ID nguồn cũ như `'comment-1791666635196'` hay `'c1'`) và `legacy_author_name TEXT` (bảo toàn nguyên vẹn tên tác giả lịch sử như `"Alibaba và 36 tên Thanh Hoá"`, `"Nguyễn Văn Minh"`).

---

## 3. CÁC HẠNG MỤC HIỆU CHỈNH ĐÃ HOÀN TẤT

### 3.1. Database Schema & Migration (`20261108_community_legacy_integrity_and_cursor_correction.sql`)
1. **Thêm cột lưu danh tính nguồn & metadata tác giả**:
   ```sql
   ALTER TABLE public.community_comments 
     ADD COLUMN IF NOT EXISTS legacy_source_id TEXT,
     ADD COLUMN IF NOT EXISTS legacy_author_name TEXT;

   CREATE UNIQUE INDEX IF NOT EXISTS uq_community_comments_legacy_source 
     ON public.community_comments (post_id, legacy_source_id) 
     WHERE legacy_source_id IS NOT NULL;
   ```
2. **Tạo Compound Index phục vụ phân trang cursor 3-tuple**:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_community_posts_feed_compound 
     ON public.community_posts (is_pinned DESC, created_at DESC, id DESC) 
     WHERE deleted_at IS NULL AND status <> 'hidden';
   ```
3. **Cập nhật trigger bảo vệ bình luận cho phiên migration**:
   Trigger `enforce_community_comment_integrity()` được bổ sung kiểm tra quyền quản trị:
   ```sql
   v_is_admin := (
     auth.role() = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin')
     OR public.is_admin()
   );
   ```
   Ngăn chặn client giả mạo hoặc chỉnh sửa `legacy_source_id` và `legacy_author_name`, nhưng cho phép phiên chạy migration của DB Admin thiết lập an toàn.
4. **Hiệu chỉnh dữ liệu bình luận đã map sai**:
   Gỡ bỏ liên kết `author_id` của bình luận Post 7 về `NULL` và gán `legacy_author_name = 'Alibaba và 36 tên Thanh Hoá'`.

---

### 3.2. Sửa thuật toán Phân trang Feed (3-Tuple Cursor Pagination)
- **Vấn đề của Cursor 1-2 thành phần cũ**: Thứ tự hiển thị feed là `ORDER BY is_pinned DESC, created_at DESC, id DESC`. Nếu chỉ dùng `created_at` làm cursor:
  - Một bài viết ghim (pinned) cũ có thể có `created_at` trước các bài viết không ghim mới tạo. Khi người dùng lướt qua bài ghim và truyền `cursor = pinned_post.created_at`, điều kiện `created_at < cursor` sẽ vô tình bỏ qua (skip) toàn bộ các bài viết không ghim mới hơn.
  - Các bài viết có cùng `created_at` sẽ bị nhảy cóc nếu không có `id` để phân định.
- **Biểu thức toán học chuẩn 3-Tuple**:
  Cursor được định nghĩa là bộ 3: `{ is_pinned, created_at, id }`.
  - Khi `cursor.is_pinned === true`:
    ```sql
    (is_pinned = true AND (created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id)))
    OR (is_pinned = false)
    ```
    *(Tức là tiếp tục duyệt các bài ghim cũ hơn/id nhỏ hơn; hoặc khi hết bài ghim thì chuyển sang toàn bộ các bài không ghim)*.
  - Khi `cursor.is_pinned === false`:
    ```sql
    is_pinned = false AND (created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id))
    ```
    *(Tức là tiếp tục duyệt các bài không ghim theo thứ tự giảm dần của thời gian và id)*.
- **Triển khai trong `src/services/communityService.js`**:
  Hàm `getCommunityPosts(options)` đã được cập nhật hoàn chỉnh với cú pháp PostgREST `.or(...)`, đồng thời trả về `nextCursor = { is_pinned, created_at, id: String(lastItem.id) }`.

---

### 3.3. Hiển thị Bình luận Tương thích Ngược & An Toàn Cao
- Cập nhật `getPostComments` trong `src/services/communityService.js`:
  - Hỗ trợ fallback linh hoạt khi cột `legacy_author_name` chưa được áp dụng lên Cloud (tránh lỗi PostgREST `42703`).
  - Hàm `mapCommentRow` chuẩn hóa tên hiển thị tác giả:
    ```javascript
    const authorName = (row.author_id && (profile.name || profile.full_name))
      ? (profile.name || profile.full_name)
      : (row.legacy_author_name || (!row.author_id ? 'Học viên ẩn danh' : 'Học viên HanziGo'));
    ```

---

## 4. KẾT QUẢ KIỂM THỬ RUNTIME

Bộ test suite toàn diện được thực thi với Node.js test runner trên môi trường thực:
```bash
node --env-file=.env --test tests/community*.test.js
```

### Chi tiết các bộ test suite đã vượt qua (180/180 PASS):
1. **`tests/communityLegacyIntegrityAndCursorCorrection.test.js`**: **17/17 tests PASS**
   - **Group 1**: Static schema & migration script audit (5/5 PASS).
   - **Group 2**: Unverified author disconnection & safe attribution (4/4 PASS).
   - **Group 3**: Content collision & stable deduplication (2/2 PASS).
   - **Group 4**: 3-tuple cursor pagination logic simulation đầy đủ 6 ca nghiệp vụ (4/4 PASS).
   - **Group 5**: Live Supabase database checks & codebase security (2/2 PASS).
2. **`tests/communityCounterSecurityAndRuntimeVerification.test.js`**: **33/33 tests PASS**
3. **`tests/communityAtomicReactionAndCommentCounter.test.js`**: **32/32 tests PASS**
4. **`tests/communitySchemaAndRlsHardening.test.js`**: **80/80 tests PASS**
5. **`tests/communityServiceIntegration.test.js`**: **18/18 tests PASS**

---

## 5. HƯỚNG DẪN THỰC THI SQL TRÊN SUPABASE DASHBOARD

Để hoàn tất áp dụng lên Supabase Cloud, vui lòng dán và chạy đoạn mã sau tại mục **SQL Editor**:

```sql
-- =========================================================================
-- HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08C.1
-- MIGRATION SCRIPT: LEGACY INTEGRITY & CURSOR COMPOUND INDEX
-- =========================================================================

-- 1. Thêm cột nhận diện nguồn và tên tác giả lịch sử
ALTER TABLE public.community_comments 
  ADD COLUMN IF NOT EXISTS legacy_source_id TEXT,
  ADD COLUMN IF NOT EXISTS legacy_author_name TEXT;

-- 2. Đảm bảo chống trùng lặp bình luận di trú theo từng bài viết
CREATE UNIQUE INDEX IF NOT EXISTS uq_community_comments_legacy_source 
  ON public.community_comments (post_id, legacy_source_id) 
  WHERE legacy_source_id IS NOT NULL;

-- 3. Tạo compound index phục vụ phân trang feed tối ưu
CREATE INDEX IF NOT EXISTS idx_community_posts_feed_compound 
  ON public.community_posts (is_pinned DESC, created_at DESC, id DESC) 
  WHERE deleted_at IS NULL AND status <> 'hidden';

-- 4. Cập nhật trigger bảo vệ bình luận cho phiên migration
CREATE OR REPLACE FUNCTION public.enforce_community_comment_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  v_is_admin := (
    auth.role() = 'service_role'
    OR current_user IN ('postgres', 'supabase_admin')
    OR public.is_admin()
  );

  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
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
    IF NOT v_is_admin THEN
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

-- 5. Đính chính dữ liệu bình luận đã map sai tác giả ở Task trước
UPDATE public.community_comments
SET 
  author_id = NULL,
  legacy_source_id = 'comment-1791666635196',
  legacy_author_name = 'Alibaba và 36 tên Thanh Hoá'
WHERE post_id = 7 AND content = 'ní hảo ní nha';

UPDATE public.community_comments
SET 
  author_id = NULL,
  legacy_source_id = 'c1',
  legacy_author_name = 'Nguyễn Văn Minh'
WHERE post_id = 3 AND content LIKE '%Phần luyện bút thuận%';

-- 6. Tái đồng bộ bộ đếm
ALTER TABLE public.community_comments DISABLE TRIGGER trg_sync_community_post_comments_count;
ALTER TABLE public.community_posts DISABLE TRIGGER trg_enforce_community_post_integrity;

UPDATE public.community_posts p
SET comments_count = (
  SELECT COUNT(*)
  FROM public.community_comments c
  WHERE c.post_id = p.id 
    AND c.status = 'published' 
    AND c.deleted_at IS NULL
);

ALTER TABLE public.community_comments ENABLE TRIGGER trg_sync_community_post_comments_count;
ALTER TABLE public.community_posts ENABLE TRIGGER trg_enforce_community_post_integrity;
```

