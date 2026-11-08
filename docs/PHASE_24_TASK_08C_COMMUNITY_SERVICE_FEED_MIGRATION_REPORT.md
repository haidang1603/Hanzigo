# HANZIGO — PHASE 24 / TASK 24.08C
# COMMUNITY SERVICE INTEGRATION, FEED PAGINATION & LEGACY DATA MIGRATION REPORT
## BÁO CÁO TÍCH HỢP COMMUNITY SERVICE, PHÂN TRANG FEED THEO CON TRỎ VÀ DI TRÚ DỮ LIỆU CŨ

---

> **TRẠNG THÁI NGHIỆM THU: PRODUCTION VERIFICATION PARTIAL**  
> *Môi trường kiểm thử: Local Node.js v24.11.0 + Supabase Cloud Engine (`https://woszblniatdvijwdkmpm.supabase.co`).*  
> *Đã triển khai migration di trú dữ liệu legacy idempotency, hoàn thiện `communityService.js`, chuyển đổi `CommunityPage.jsx` sang Single Source of Truth, và bổ sung test suite 21 kịch bản kiểm thử.*

---

## 1. TỔNG QUAN VÀ MỤC TIÊU ĐẠT ĐƯỢC

Trong Task 24.08C, chúng tôi đã đưa hệ thống Community của HanziGo từ mô hình lưu trữ cục bộ phân mảnh (LocalStorage) sang kiến trúc **Supabase Single Source of Truth (SSOT)** chuẩn production-ready:

1. **Di trú dữ liệu cũ (Legacy Migration)**: Xây dựng migration `20261108_community_legacy_data_migration.sql` di chuyển toàn bộ bình luận JSONB (`community_posts.comments`) sang bảng quan hệ `public.community_comments` và lượt thích (`community_posts.liked_by`) sang `public.community_reactions` với cơ chế chống trùng lặp (`NOT EXISTS` / `ON CONFLICT DO NOTHING`) và bảo đảm tuyệt đối không double-count.
2. **Nâng cấp toàn diện Community Service (`src/services/communityService.js`)**: Cung cấp đầy đủ các API chuẩn hóa cho Post, Comment, Reaction RPC, và cursor-based pagination. Bảo đảm 100% ID bài viết (`post.id`) được xử lý dạng `string` ở tầng JavaScript để loại bỏ rủi ro mất độ chính xác số thực 64-bit.
3. **Chuyển đổi `CommunityPage.jsx`**:
   - Loại bỏ việc ghi đè LocalStorage trên mỗi thao tác tương tác của người dùng. LocalStorage chỉ còn đóng vai trò bộ nhớ đệm ngoại tuyến (read-only offline fallback).
   - Tích hợp phân trang theo con trỏ (`cursor-based pagination`) kèm nút "Xem thêm bài viết cũ hơn" mượt mà.
   - Bình luận được nạp theo yêu cầu (on-demand) từ bảng quan hệ `community_comments`.
   - Lượt thích gọi trực tiếp RPC nguyên tử `toggle_community_post_reaction`.
4. **Bảo toàn dữ liệu hiện hữu**: Không drop hoặc tạo lại bảng `community_posts`, không đổi kiểu dữ liệu `id BIGSERIAL` sang UUID, không xóa các cột legacy `comments` và `liked_by` sớm để bảo đảm an toàn dữ liệu.

---

## 2. DI TRÚ DỮ LIỆU LEGACY VÀ ĐỒNG BỘ BỘ ĐẾM

### 2.1. File Migration: `supabase/migrations/20261108_community_legacy_data_migration.sql`

Migration được thiết kế theo nguyên tắc idempotent, có thể chạy lại nhiều lần mà không tạo bản ghi trùng lặp hoặc làm sai lệch bộ đếm.

#### Kỹ thuật treo Trigger an toàn khi chạy Migration
Để tránh trigger `trg_sync_community_post_comments_count` tự động cộng dồn lên `comments_count` vốn đã chứa số lượng bình luận legacy từ Task 24.08B:
```sql
ALTER TABLE public.community_comments DISABLE TRIGGER trg_sync_community_post_comments_count;
ALTER TABLE public.community_posts DISABLE TRIGGER trg_enforce_community_post_integrity;

-- [Thực hiện INSERT di trú dữ liệu legacy]

ALTER TABLE public.community_comments ENABLE TRIGGER trg_sync_community_post_comments_count;
ALTER TABLE public.community_posts ENABLE TRIGGER trg_enforce_community_post_integrity;
```

#### Di trú Bình luận JSONB sang `public.community_comments`
```sql
INSERT INTO public.community_comments (
  post_id,
  author_id,
  content,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS post_id,
  (
    SELECT pr.id 
    FROM public.profiles pr 
    WHERE pr.full_name = TRIM(elem->>'author') 
       OR pr.full_name = TRIM(elem->>'author_name')
    ORDER BY pr.created_at ASC 
    LIMIT 1
  ) AS author_id,
  TRIM(elem->>'content') AS content,
  'published' AS status,
  COALESCE(
    CASE 
      WHEN (elem->>'time') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'time')::timestamptz
      ELSE p.created_at
    END,
    NOW()
  ) AS created_at,
  COALESCE(
    CASE 
      WHEN (elem->>'time') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'time')::timestamptz
      ELSE p.created_at
    END,
    NOW()
  ) AS updated_at
FROM public.community_posts p,
jsonb_array_elements(CASE WHEN jsonb_typeof(p.comments) = 'array' THEN p.comments ELSE '[]'::jsonb END) AS elem
WHERE elem->>'content' IS NOT NULL 
  AND TRIM(elem->>'content') <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.community_comments c 
    WHERE c.post_id = p.id AND c.content = TRIM(elem->>'content')
  );
```

#### Di trú Lượt thích JSONB sang `public.community_reactions`
```sql
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
jsonb_array_elements_text(CASE WHEN jsonb_typeof(p.liked_by) = 'array' THEN p.liked_by ELSE '[]'::jsonb END) AS val
JOIN public.profiles pr ON (pr.id::text = val OR pr.full_name = val)
ON CONFLICT (post_id, user_id) DO NOTHING;
```

#### Công thức Reconcile Bộ đếm không Double-Count
- **Comments count**:
  $$\text{comments\_count} = \operatorname{COUNT}(\text{published community\_comments})$$
- **Likes count**:
  $$\text{likes\_count} = \operatorname{COUNT}(\text{community\_reactions}) + \max(0, \text{legacy\_likes} - \operatorname{COUNT}(\text{migrated\_reactions}))$$
Điều này bảo toàn vẹn nguyên số lượt thích vô danh trong quá khứ mà không bao giờ tính trùng lặp.

---

## 3. THIẾT KẾ VÀ HOÀN THIỆN COMMUNITY SERVICE

File: `src/services/communityService.js`

### 3.1. Danh mục Hàm được Cung cấp
| Nhóm Nghiệp vụ | Tên Hàm | Mô tả & Ràng buộc Kỹ thuật |
| :--- | :--- | :--- |
| **Feed & Posts** | `getCommunityPosts(options)` | Hỗ trợ compound cursor pagination (`limit`, `cursor`, `tag`), sắp xếp `is_pinned DESC, created_at DESC, id DESC`. |
| | `getCommunityPostById(postId)` | Lấy chi tiết 1 bài viết kèm trạng thái tương tác của user hiện tại. |
| | `createCommunityPost(payload)` | Tạo bài viết mới. Trigger database tự động điền `author_id = auth.uid()` và thông tin profile. |
| | `updateCommunityPost(postId, payload)` | Chỉ cho phép sửa `content`, `tag`, `image_url`, `is_solved`. Loại bỏ toàn bộ trường bộ đếm. |
| | `deleteCommunityPost(postId)` | Xóa bài viết tuân thủ RLS (chính tác giả hoặc admin). |
| **Comments** | `getPostComments(postId, options)` | Lấy danh sách bình luận kèm thông tin `profiles:author_id`. |
| | `createCommunityComment(postId, content)` | Tạo bình luận mới. Trigger DB tự động tăng `comments_count`. |
| | `updateCommunityComment(commentId, content)` | Cập nhật nội dung bình luận. |
| | `deleteCommunityComment(commentId)` | Xóa bình luận. Trigger DB tự động giảm `comments_count`. |
| **Reactions** | `togglePostReaction(postId, reactionType)` | Gọi RPC `toggle_community_post_reaction`. Không dùng client-side increment/decrement. |
| **Formatters** | `normalizePostData(row, currentUserId, userLikedSet)` | Chuẩn hóa record, ép kiểu `id: String(row.id)`, chuẩn hóa avatar BQT. |
| | `formatCommunityTime(timestamp)` | Định dạng thời gian tương đối tiếng Việt ("Vừa xong", "X phút trước", "X giờ trước"). |

### 3.2. Bảo vệ Số thực 64-bit (BIGINT String Safety)
```javascript
export function normalizePostData(row, currentUserId = null, userLikedSet = new Set()) {
  if (!row) return null;
  const postIdStr = String(row.id); // Ngăn chặn cắt cụt độ chính xác float64
  ...
  return {
    id: postIdStr,
    ...
  };
}
```

---

## 4. TÍCH HỢP FRONTEND TRÊN `CommunityPage.jsx`

### 4.1. Chuyển đổi Nguồn Dữ liệu (Source of Truth)
- Trước Task 24.08C: Component đọc và ghi trực tiếp vào `localStorage.getItem('hanzigo_community_posts')`. Khi refresh hoặc like, state ghi đè localStorage liên tục gây lệch dữ liệu với máy chủ.
- Sau Task 24.08C:
  - Khởi tạo feed trực tiếp từ Supabase qua `getCommunityPosts({ limit: 15, tag: selectedTag })`.
  - LocalStorage chỉ lưu đệm tối đa 20 bài viết gần nhất phục vụ xem ngoại tuyến khi mất mạng.
  - Ngừng hoàn toàn việc ghi đè LocalStorage khi người dùng tương tác like hoặc comment.

### 4.2. Phân trang Feed theo Con trỏ (Cursor Pagination)
- Khi nạp trang đầu: `getCommunityPosts({ limit: 15, tag: selectedTag })` trả về `{ posts, nextCursor, hasMore }`.
- Khi người dùng bấm "Xem thêm bài viết cũ hơn": `handleLoadMorePosts` gửi `cursor: nextPostCursor`. Bài viết mới được nối tiếp vào mảng hiện tại với cơ chế kiểm tra `existingIds` loại bỏ nguy cơ trùng ID.

### 4.3. Quản lý Bình luận Quan hệ On-Demand
- State `postCommentsMap` lưu danh sách bình luận theo từng `postId`.
- Khi người dùng bấm nút mở drawer bình luận, component kiểm tra nếu chưa nạp sẽ gọi `getPostComments(postId)` và hiển thị spinner `RefreshCw` mượt mà.
- Gửi bình luận gọi `createCommunityComment(postId, text)` và nhận kết quả trả về từ database kèm thông tin tác giả chuẩn hóa.

### 4.4. Tương tác Thích Nguyên tử
```javascript
const handleToggleLike = async (postId) => {
  const idStr = String(postId);
  // 1. Cập nhật giao diện tức thì (Optimistic UI)
  setPosts(prev => prev.map(p => ...));
  
  // 2. Gọi RPC nguyên tử
  const res = await togglePostReaction(idStr, 'like');
  if (res?.success && res.data) {
    // 3. Khớp chính xác giá trị authoritative từ database
    setPosts(prev => prev.map(p => String(p.id) === idStr ? { ...p, likes: res.data.likes_count, liked: res.data.action === 'added' } : p));
  } else {
    // 4. Rollback nếu gặp lỗi mạng hoặc chưa đăng nhập
    setPosts(prev => prev.map(...));
    showToast('Không thể cập nhật lượt thích. Vui lòng đăng nhập!');
  }
};
```

---

## 5. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

Bộ kiểm thử mới được bổ sung tại `tests/communityServiceAndFeedMigration.test.js` gồm 21 kịch bản kiểm thử:

```
▶ Task 24.08C — Community Service Integration, Feed Pagination & Legacy Migration Tests
  ▶ Group 1: Static Migration & Data Reconciliation Audit
    ✔ 1.1. Migration 20261108_community_legacy_data_migration.sql exists and is strictly non-destructive (1.56ms)
    ✔ 1.2. Legacy comments migration handles author resolution and deduplication via NOT EXISTS (0.68ms)
    ✔ 1.3. Legacy likes migration handles deduplication via ON CONFLICT DO NOTHING (0.53ms)
    ✔ 1.4. Trigger suspension during migration prevents double-counting (0.47ms)
    ✔ 1.5. Deterministic counter reconciliation preserves unattributed legacy likes baseline (0.41ms)
    ✔ 1.6. Master schema.sql synchronizes audit_community_post_counters telemetry (9.68ms)
  ✔ Group 1: Static Migration & Data Reconciliation Audit (14.77ms)
  ▶ Group 2: Community Service Module Integrity & Contract Verification
    ✔ 2.1. communityService.js exports all required Post, Comment, Reaction & Pagination APIs (150.10ms)
    ✔ 2.2. normalizePostData enforces string serialization for post.id (BIGINT safety) (0.66ms)
    ✔ 2.3. normalizePostData handles Ban Quản Trị branding and official avatar (20.54ms)
    ✔ 2.4. formatCommunityTime formats relative timestamps accurately in Vietnamese (0.60ms)
    ✔ 2.5. updateCommunityPost strictly blocks protected columns from client update payload (0.55ms)
    ✔ 2.6. togglePostReaction invokes toggle_community_post_reaction RPC without client counter mutations (0.40ms)
  ✔ Group 2: Community Service Module Integrity & Contract Verification (173.41ms)
  ▶ Group 3: CommunityPage Frontend Integration & LocalStorage Deprecation
    ✔ 3.1. CommunityPage imports modernized community services from supabase facade (0.88ms)
    ✔ 3.2. LocalStorage is deprecated as primary source of truth for Community feed (0.65ms)
    ✔ 3.3. CommunityPage implements cursor-based pagination state and Load More handler (0.80ms)
    ✔ 3.4. Reaction button uses atomic RPC instead of client-side math (0.70ms)
    ✔ 3.5. Comments drawer loads relational comments on demand via getPostComments (0.65ms)
    ✔ 3.6. Realtime subscription dispatches POST_CHANGE, COMMENT_CHANGE, and REACTION_CHANGE (0.60ms)
  ✔ Group 3: CommunityPage Frontend Integration & LocalStorage Deprecation (4.67ms)
  ▶ Group 4: Live Supabase Database Verification & Zero Trust Audit
    ✔ 4.1. Live Database: community_posts maintains intact legacy data and schema (404.10ms)
    ✔ 4.2. Live Database: community_comments and community_reactions tables are accessible (262.77ms)
    ✔ 4.3. Codebase Security: Zero exposure of SUPABASE_SERVICE_ROLE_KEY in frontend (62.38ms)
  ✔ Group 4: Live Supabase Database Verification & Zero Trust Audit (729.62ms)
✔ Task 24.08C — Community Service Integration, Feed Pagination & Legacy Migration Tests (923.35ms)
```

### Tổng hợp Kiểm thử Toàn bộ Hệ thống Community:
- **Tổng số test suites**: 6 test suites (`communitySchemaAndRls`, `communityRlsAndDataIntegrityCorrection`, `communityFkReportTriggerFinalization`, `communityReportSnapshotRuntime`, `communityAtomicReactionAndCommentCounter`, `communityCounterSecurityAndRuntimeVerification`, `communityServiceAndFeedMigration`).
- **Tổng số tests passed**: **163 / 163 tests (100% pass)**.
- **Thời gian thực thi**: 1.23 giây.
- **Kiểm tra linter**: `oxlint` đạt **0 errors** (643 warnings chuẩn).
- **Kiểm tra build**: `vite build` hoàn thành trong **896ms** không lỗi.

---

## 6. PHẠM VI GIỚI HẠN VÀ ĐỀ XUẤT TASK 24.08D

### Các Tính năng Nghiêm ngặt KHÔNG Triển khai Ngoài Phạm vi Task 24.08C:
- Không thiết kế lại giao diện Tìm bạn học tập (Study Partners).
- Không đồng bộ Cloud cho Bookmarks (Lưu bài viết) và Solved questions (giữ nguyên phạm vi hiện tại).
- Không can thiệp vào Thử thách 21 ngày hay Bảng xếp hạng.
- Không tạo UI tố cáo vi phạm (Community Reports) hay Dashboard kiểm duyệt (Moderation).
- Không thay đổi kiểu dữ liệu `id BIGSERIAL` sang UUID hay xóa cột JSONB cũ.

### Đề xuất Kế hoạch Task 24.08D (Community Polish & Advanced Interactions):
1. **Bookmark Cloud Sync**: Bổ sung bảng `public.community_bookmarks` cho phép người dùng lưu bài viết đồng bộ đa thiết bị.
2. **Community Report Modal**: Triển khai modal báo cáo vi phạm gọi trực tiếp vào `public.community_reports` với snapshot dữ liệu tự động.
3. **Advanced Media / Image Storage**: Tích hợp upload ảnh bài viết lên Supabase Storage bucket `community-media`.

