# HANZIGO — PHASE 24 / TASK 24.08B
# ATOMIC COMMUNITY REACTION RPC & COMMENT COUNTER TRIGGER REPORT
## BÁO CÁO TRIỂN KHAI NGHIỆP VỤ REACTION NGUYÊN TỬ VÀ ĐỒNG BỘ BỘ ĐẾM BÌNH LUẬN CỘNG ĐỒNG

---

## 1. TỔNG QUAN VÀ TRẠNG THÁI NGHIỆM THU

- **Dự án**: HanziGo — Nền tảng học tiếng Trung toàn diện cho người Việt.
- **Giai đoạn**: Phase 24 — Hoàn thiện sản phẩm cốt lõi & Chuyển đổi Community sang dữ liệu thật.
- **Nhiệm vụ**: Task 24.08B — Atomic Community Reaction RPC & Comment Counter Trigger.
- **Trạng thái**: **`PRODUCTION VERIFICATION PARTIAL`**
  *(Cơ sở: Migration `20261108_community_atomic_reaction_and_comment_counter.sql` và master `schema.sql` đã hoàn thành 100%, 32/32 tests mới cùng 196/196 tests hồi quy toàn Phase 24 đạt 100% PASS, Linter `oxlint` 0 errors, Build `vite build` 1.01s. Trạng thái giữ ở mức PARTIAL theo quy chuẩn nghiêm ngặt cho tới khi quản trị viên thực thi DDL trên Supabase Cloud Console trước khi chuyển sang Task 24.08C).*

---

## 2. PRE-FLIGHT AUDIT DỮ LIỆU THỰC TẾ TRƯỚC KHI TRIỂN KHAI

Trước khi tác động schema và viết logic RPC, đội ngũ kỹ thuật đã tiến hành kiểm toán trực tiếp trên Supabase Database:

### 2.1. Hiện trạng dữ liệu thực tế
- **Bảng `public.community_posts`**:
  - Post ID 3 (*Ban Quản Trị HanziGo*): `likes_count = 12`, `comments_count = 1`, `likes = 12`, `comments` (JSONB) chứa 1 bình luận cũ.
  - Post ID 7 (*Đăng*): `likes_count = 1`, `comments_count = 1`, `likes = 1`, `comments` (JSONB) chứa 1 bình luận cũ.
- **Bảng `public.community_reactions`**: Hiện có **0 bản ghi**.
- **Bảng `public.community_comments`**: Hiện có **0 bản ghi** (các bình luận lịch sử hiện lưu trong cột JSONB của `community_posts` và sẽ được migrate sang các hàng riêng biệt ở Task 24.08C).
- **Bảng `public.community_reports`**: Hiện có **0 bản ghi**.

### 2.2. Phân tích nguyên nhân chênh lệch Counters (Discrepancy Analysis)
- `likes_count` của Post 3 (= 12) và Post 7 (= 1) đang phản ánh giá trị từ đợt backfill ban đầu từ cột legacy `likes`.
- Vì `community_reactions` chưa có dữ liệu quan hệ, nếu hệ thống đột ngột reset `likes_count = (SELECT COUNT(*) FROM community_reactions)`, bài viết của Ban Quản Trị và tác giả sẽ mất toàn bộ 12 likes lịch sử ban đầu.
- **Quyết định kiến trúc tuân thủ chỉ thị**:
  1. Không tùy tiện reset counters về 0.
  2. Áp dụng cơ chế **Atomic Increment/Decrement có khóa dòng (`FOR UPDATE`)** để mọi lượt react/unreact mới cập nhật chính xác theo vi phân (+1, -1, 0) trên nền baseline hiện tại.
  3. Cung cấp hàm telemetry `audit_community_post_counters()` để theo dõi chi tiết độ lệch và hỗ trợ reconciliation an toàn khi migrate dữ liệu legacy ở Task 24.08C.

---

## 3. THIẾT KẾ & TRIỂN KHAI ATOMIC REACTION RPC

### 3.1. Chữ ký Hàm (Function Signature)
```sql
public.toggle_community_post_reaction(p_post_id BIGINT, p_reaction_type TEXT) RETURNS JSONB
```

### 3.2. Quy tắc nghiệp vụ và Tính nguyên tử
1. **Xác thực danh tính Zero-Trust**:
   - Nghiêm cấm nhận `user_id` từ client payload.
   - Định danh thực thi được lấy tuyệt đối từ `auth.uid()`. Nếu unauthenticated, ném exception mã lỗi `42501` (`insufficient_privilege`).
2. **Kiểm tra hợp lệ bài viết & Khóa dòng (`Row Locking`)**:
   - Sử dụng `SELECT ... FOR UPDATE` trên bảng `community_posts` theo `p_post_id`.
   - Ngăn chặn triệt để race condition khi nhiều người dùng hoặc cùng một người dùng double-click đồng thời.
   - Kiểm tra bài viết phải tồn tại, chưa bị xóa mềm (`deleted_at IS NULL`) và ở trạng thái `status = 'published'`.
3. **Bộ chuyển đổi trạng thái 3 nhánh (State Machine)**:
   - **Nhánh A (Chưa react)**: `INSERT` bản ghi mới vào `community_reactions` $\rightarrow$ Tăng `likes_count = likes_count + 1` $\rightarrow$ Trả về `action: 'added'`.
   - **Nhánh B (React cùng loại)**: `DELETE` bản ghi cũ (Toggle OFF) $\rightarrow$ Giảm `likes_count = GREATEST(0, likes_count - 1)` $\rightarrow$ Trả về `action: 'removed'`.
   - **Nhánh C (Đổi loại reaction, ví dụ: like sang heart)**: `UPDATE` bản ghi `community_reactions.reaction_type = p_reaction_type` $\rightarrow$ `likes_count` giữ nguyên $\rightarrow$ Trả về `action: 'updated'`.
4. **Ràng buộc duy nhất làm chốt chặn cuối cùng**:
   - `CONSTRAINT uq_community_reactions_post_user UNIQUE (post_id, user_id)` bảo đảm ở tầng vật lý rằng một user không thể có 2 reactions trên cùng 1 bài viết.

---

## 4. THIẾT KẾ & TRIỂN KHAI COMMENT COUNTER TRIGGER

### 4.1. Cơ chế hoạt động của `sync_community_post_comments_count`
Trigger thực thi `AFTER INSERT OR UPDATE OR DELETE ON public.community_comments FOR EACH ROW`:

- **Định nghĩa bình luận hợp lệ**: `status = 'published' AND deleted_at IS NULL`.
- **Ma trận chuyển trạng thái**:
  - `INSERT`: Nếu comment mới hợp lệ $\rightarrow$ `comments_count + 1`.
  - `DELETE`: Nếu comment bị xóa từng là hợp lệ $\rightarrow$ `GREATEST(0, comments_count - 1)`.
  - `UPDATE chuyển bài (Cross-post)`: Nếu chuyển từ bài A sang bài B, giảm counter bài A và tăng counter bài B.
  - `UPDATE trạng thái (State transition)`:
    - `pending/hidden` $\rightarrow$ `published`: Tăng counter + 1.
    - `published` $\rightarrow$ `hidden/deleted`: Giảm counter - 1.
    - Sửa nội dung (content): Không thay đổi counter.

---

## 5. GIẢI PHÁP ĐỒNG BỘ BẢO MẬT: BẢO VỆ POST INTEGRITY TRIGGER

### Vấn đề xung đột tiềm ẩn được phát hiện & triệt tiêu:
Trước đây, trigger `enforce_community_post_integrity()` cấm mọi hành vi cập nhật trực tiếp `likes_count` và `comments_count` đối với người dùng thông thường (`NOT v_is_admin`). Khi học viên react hoặc bình luận, lệnh `UPDATE community_posts` bên trong RPC/Trigger sẽ kích hoạt trigger integrity và bị chặn nếu không có cơ chế nhận diện.

### Giải pháp cắm cờ an toàn theo Transaction (`Transaction-local Flag`):
Trong RPC `toggle_community_post_reaction` và trigger `sync_community_post_comments_count`, hệ thống thực thi:
```sql
PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
```
*(Tham số thứ ba `is_local = true` chỉ áp dụng trong phạm vi transaction hiện tại).*

Trong `enforce_community_post_integrity()`, kiểm tra:
```sql
IF (NEW.likes_count IS DISTINCT FROM OLD.likes_count) OR 
   (NEW.comments_count IS DISTINCT FROM OLD.comments_count) THEN
  IF current_setting('hanzigo.internal_counter_sync', true) = 'true' THEN
    NULL; -- Cho phép hệ thống đồng bộ nội bộ
  ELSE
    RAISE EXCEPTION 'Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.';
  END IF;
END IF;
```
**Kết quả**:
- Client REST API trực tiếp gửi PATCH/UPDATE sửa `likes_count`: Bị từ chối 100% vì cờ `internal_counter_sync` là NULL.
- Reaction RPC và Comment Trigger nội bộ: Cập nhật counters mượt mà, chính xác.

---

## 6. KẾT QUẢ KIỂM THỬ RUNTIME & ĐO LƯỜNG CHẤT LƯỢNG

### 6.1. Bộ kiểm thử tự động chuyên biệt: `tests/communityAtomicReactionAndCommentCounter.test.js`
Đã thực thi 32 test cases bao quát toàn bộ yêu cầu:

```
▶ Task 24.08B — Atomic Community Reaction RPC & Comment Counter Trigger Tests
  ▶ Group 1: Static Schema, Migration & RPC Definition Audit
    ✔ 1.1. Migration 20261108_community_atomic_reaction_and_comment_counter.sql exists and is non-destructive (0.8066ms)
    ✔ 1.2. RPC toggle_community_post_reaction defined with row locking and strict auth.uid() identity (0.2241ms)
    ✔ 1.3. Comment counter trigger sync_community_post_comments_count defined for INSERT, UPDATE, DELETE (0.2688ms)
    ✔ 1.4. Post integrity trigger updated to permit internal counter sync via transaction-local setting (0.7531ms)
    ✔ 1.5. Telemetry audit function audit_community_post_counters defined (0.2461ms)
    ✔ 1.6. Master schema.sql synchronizes RPC, trigger and security settings (5.2451ms)
  ✔ Group 1: Static Schema, Migration & RPC Definition Audit (8.1273ms)
  ▶ Group 2: Unit Logic Integrity Simulation (Reaction RPC & Comment Trigger)
    ✔ 2.1. RPC 1: Anonymous cannot call reaction RPC (0.6154ms)
    ✔ 2.2. RPC 2: Authenticated user creates reaction successfully (0.2175ms)
    ✔ 2.3. RPC 3: Toggling same reaction a second time removes reaction and decrements counter (0.1436ms)
    ✔ 2.4. RPC 4: Changing reaction type updates record without changing total count (0.1168ms)
    ✔ 2.5. RPC 5: A user cannot create duplicate reactions for the same post (0.0842ms)
    ✔ 2.6. RPC 6: User A cannot impersonate or toggle User B reactions (0.0934ms)
    ✔ 2.7. RPC 7: Non-existent post is rejected with error (0.0915ms)
    ✔ 2.8. RPC 8: Deleted or hidden post cannot be reacted to (0.0785ms)
    ✔ 2.9. RPC 9: Invalid reaction type is rejected (0.0733ms)
    ✔ 2.10. RPC 10: Client cannot directly mutate likes_count without internal sync permission (0.0705ms)
    ✔ 2.11. RPC 11 & 12: Concurrent reactions from multiple users maintain accurate atomic count (0.0837ms)
    ✔ 2.12. RPC 13 & 14: Reaction removal never allows likes_count to drop below zero (0.0658ms)
    ✔ 2.13. Comment 1: INSERT published comment increments counter by 1 (0.0573ms)
    ✔ 2.14. Comment 2: INSERT pending comment does NOT increment counter (0.0314ms)
    ✔ 2.15. Comment 3: Transition pending -> published increments counter (0.0912ms)
    ✔ 2.16. Comment 4: Transition published -> hidden decrements counter (0.04ms)
    ✔ 2.17. Comment 5: Transition published -> soft deleted decrements counter (0.0324ms)
    ✔ 2.18. Comment 6: Transition hidden -> published increments counter (0.0281ms)
    ✔ 2.19. Comment 7: DELETE published comment decrements counter (0.051ms)
    ✔ 2.20. Comment 8: Content update without validity change leaves counter unaffected (0.0531ms)
    ✔ 2.21. Comment 9: Transferring comment between posts updates both post counters correctly (0.0543ms)
    ✔ 2.22. Comment 10 & 11: Counter never drops below zero and direct student mutation blocked (0.0347ms)
  ✔ Group 2: Unit Logic Integrity Simulation (Reaction RPC & Comment Trigger) (2.5681ms)
  ▶ Group 3: Live Supabase Database RLS & Runtime Checks
    ✔ 3.1. Live Supabase: anonymous user cannot call toggle_community_post_reaction RPC (557.8383ms)
    ✔ 3.2. Live Supabase: existing community_posts remain intact with baseline counters (122.8831ms)
    ✔ 3.3. Live Supabase: unauthenticated direct mutation on likes_count is blocked (112.4123ms)
    ✔ 3.4. Codebase Security: frontend codebase contains zero service role keys (51.1372ms)
  ✔ Group 3: Live Supabase Database RLS & Runtime Checks (844.5036ms)
✔ Task 24.08B — Atomic Community Reaction RPC & Comment Counter Trigger Tests (855.5409ms)
ℹ tests 32 | pass 32 | fail 0
```

### 6.2. Kiểm thử hồi quy toàn Phase 24
- Tổng cộng: **12 test suites**.
- Tổng số tests: **196 tests**.
- Kết quả: **196/196 PASS (100%)** trong **1.15 giây**.
- Linter: `oxlint` đạt **0 errors**.
- Build: `vite build` tạo production bundle thành công trong **1.01 giây**.

---

## 7. SERVICE CONTRACT & HƯỚNG DẪN TÍCH HỢP FRONTEND (TASK 24.08C)

Nhằm chuẩn bị cho Task 24.08C kết nối giao diện thực tế mà không cần viết lại nghiệp vụ:

### 7.1. Chữ ký RPC & Payload
```typescript
// Gọi hàm toggle reaction
const { data, error } = await supabase.rpc('toggle_community_post_reaction', {
  p_post_id: postId,         // number | string (BIGINT)
  p_reaction_type: 'like'    // 'like' | 'heart' | 'clap' | 'bulb'
});
```

### 7.2. Cấu trúc Response
```typescript
interface ReactionResponse {
  success: boolean;
  action: 'added' | 'removed' | 'updated';
  post_id: number;
  user_reaction: 'like' | 'heart' | 'clap' | 'bulb' | null;
  likes_count: number;
}
```

### 7.3. Hướng dẫn Frontend State Synchronization
- Không tự cộng trừ likes_count ở client.
- Cập nhật state bài viết dựa trực tiếp trên `data.likes_count` và `data.user_reaction` trả về từ RPC.
- Xử lý lỗi: Nếu người dùng chưa đăng nhập, bắt `error.code === '42501'` để mở AuthModal đăng nhập.

---

## 8. QUY TRÌNH HỒI PHỤC (ROLLBACK PLAN)

Trong trường hợp cần rollback thay đổi Task 24.08B:
```sql
-- 1. Hủy bỏ trigger comment counter
DROP TRIGGER IF EXISTS trg_sync_community_post_comments_count ON public.community_comments;
DROP FUNCTION IF EXISTS public.sync_community_post_comments_count();

-- 2. Hủy bỏ RPC toggle reaction
DROP FUNCTION IF EXISTS public.toggle_community_post_reaction(BIGINT, TEXT);

-- 3. Hủy bỏ hàm audit counters
DROP FUNCTION IF EXISTS public.audit_community_post_counters();
```

---

## 9. ĐỀ XUẤT BƯỚC TIẾP THEO

Toàn bộ nghiệp vụ database nguyên tử, trigger đồng bộ counters và RPC đã hoàn thành và sẵn sàng cho:
👉 **Task 24.08C**: Triển khai `CommunityService.js` tích hợp Supabase thực tế, phân trang Feed (`Feed pagination`), kết nối giao diện `CommunityPage.jsx` và di chuyển dữ liệu bình luận từ JSONB cũ sang `community_comments`.

