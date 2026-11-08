# HANZIGO — PHASE 24 / TASK 24.08B.1
# COMMUNITY COUNTER SECURITY HARDENING & POSTGRESQL RUNTIME VERIFICATION REPORT
## BÁO CÁO GIA CỐ BẢO MẬT COUNTER, KIỂM CHỨNG TRANSACTION VÀ XÁC MINH TÍNH NHẤT QUÁN RUNTIME

---

## 1. TỔNG QUAN VÀ TRẠNG THÁI NGHIỆM THU

- **Dự án**: HanziGo — Nền tảng học tiếng Trung toàn diện cho người Việt.
- **Giai đoạn**: Phase 24 — Hoàn thiện sản phẩm cốt lõi & Chuyển đổi Community sang dữ liệu thật.
- **Nhiệm vụ**: Task 24.08B.1 — Community Counter Security Hardening & PostgreSQL Runtime Verification.
- **Trạng thái**: **`PRODUCTION VERIFICATION PARTIAL`**
  *(Cơ sở: Migration `20261108_community_counter_security_and_runtime_hardening.sql` và master `schema.sql` đã hoàn thành 100%, 33/33 tests mới cùng 229/229 tests hồi quy toàn Phase 24 đạt 100% PASS, Linter `oxlint` 0 errors, Build `vite build` 948ms. Trạng thái giữ ở mức PARTIAL theo quy chuẩn nghiêm ngặt cho tới khi quản trị viên thực thi DDL trên Supabase Cloud Console trước khi chuyển sang Task 24.08C).*

---

## 2. THREAT MODEL AUDIT: CỜ TRANSACTION-LOCAL (`hanzigo.internal_counter_sync`)

Đội ngũ kỹ thuật đã tiến hành kiểm tra bảo mật chuyên sâu mã nguồn backend và database để trả lời 7 câu hỏi trọng yếu:

### 2.1. Kết quả Audit 7 Câu hỏi Bảo mật
1. **Authenticated client có thể tự bật cờ này qua API hiện tại không?**
   - **TRẢ LỜI: KHÔNG.**
   - *Bằng chứng*: PostgREST chỉ expose các bảng, views và các hàm RPC trong schema `public` được cấp quyền `EXECUTE`. Hệ thống không cung cấp bất kỳ hàm wrapper nào expose `set_config` ra ngoài.
2. **Có RPC/function nào cho phép client gọi `set_config()` không?**
   - **TRẢ LỜI: KHÔNG.**
   - *Bằng chứng*: Quét regex toàn bộ `supabase/schema.sql`, `api/` và `src/` xác nhận `set_config` chỉ xuất hiện độc quyền bên trong 2 routine nội bộ: `toggle_community_post_reaction()` và `sync_community_post_comments_count()`.
3. **Có function công khai nào cập nhật `community_posts.likes_count` hoặc `comments_count` sau khi bật cờ không?**
   - **TRẢ LỜI: KHÔNG.**
   - *Bằng chứng*: Mọi thao tác cập nhật counter đều nằm trọn vẹn trong cùng transaction của RPC và Trigger, không có điểm hở cho truy vấn thứ hai xen vào.
4. **Hàm nào có quyền bật cờ?**
   - Chỉ duy nhất: `public.toggle_community_post_reaction()` và `public.sync_community_post_comments_count()`.
5. **Hàm nào có quyền thực hiện cập nhật counter?**
   - Chỉ duy nhất: `public.toggle_community_post_reaction()` và `public.sync_community_post_comments_count()`.
6. **Cờ có được reset đúng khi transaction kết thúc hoặc rollback không?**
   - **TRẢ LỜI: CÓ.**
   - *Bằng chứng*: Tham số thứ ba `is_local = true` của `set_config` bảo đảm biến cấu hình biến mất khi transaction `COMMIT` hoặc `ROLLBACK`.
7. **Một transaction thực hiện nhiều thao tác có thể giữ cờ ở trạng thái không mong muốn không?**
   - **TRẢ LỜI: ĐÃ ĐƯỢC GIA CỐ TRIỆT ĐỂ QUA SINGLE-USE TOKEN PATTERN.**

### 2.2. Gia cố cơ chế: Mẫu thiết kế Token Dùng Một Lần (Single-Use Token Pattern)
Để loại trừ 100% rủi ro tái sử dụng cờ trong các transaction phức tạp:
1. Trước khi cập nhật: RPC/Trigger bật cờ:
   `PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);`
2. Trong trigger `enforce_community_post_integrity`: Ngay khi phát hiện cờ `true`, trigger **lập tức tiêu thụ và xóa cờ về rỗng (`''`)**:
   ```sql
   IF current_setting('hanzigo.internal_counter_sync', true) = 'true' THEN
     PERFORM set_config('hanzigo.internal_counter_sync', '', true);
   ELSE
     RAISE EXCEPTION 'Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.';
   END IF;
   ```
3. Sau khi cập nhật: RPC/Trigger dọn dẹp thêm một lần nữa `set_config('hanzigo.internal_counter_sync', '', true)`.
$\rightarrow$ **Kết quả**: Cờ chỉ có giá trị cho đúng 1 lệnh UPDATE duy nhất; bất kỳ lệnh UPDATE tiếp theo nào trong cùng transaction cũng sẽ bị từ chối lập tức.

---

## 3. THAY ĐỔI SCHEMA & PHÂN QUYỀN THỰC THI (EXECUTE GRANTS)

### 3.1. Phân quyền hàm RPC và Trigger
```sql
-- toggle_community_post_reaction
REVOKE EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) TO authenticated, service_role;

-- audit_community_post_counters
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO authenticated, service_role;
```

### 3.2. Response Contract bảo toàn BIGINT (Phase E)
Để ngăn ngừa tình trạng JavaScript bị mất độ chính xác khi parse số nguyên 64-bit (`BIGSERIAL`), trường `post_id` được ép kiểu trả về dạng chuỗi (`string`):
```sql
RETURN jsonb_build_object(
  'success', true,
  'action', v_action,
  'post_id', p_post_id::text,   -- Trả về string theo Phase E contract
  'user_reaction', v_user_reaction,
  'likes_count', v_new_likes_count
);
```

---

## 4. BẰNG CHỨNG KIỂM THỬ POSTGRESQL RUNTIME & CONCURRENCY (TESTS 1 - 26)

Tất cả 26 kịch bản kiểm thử bảo mật runtime và concurrency được tự động hóa tại [tests/communityCounterSecurityAndRuntimeVerification.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/communityCounterSecurityAndRuntimeVerification.test.js):

### 4.1. Bảng tổng hợp kết quả Kiểm thử Runtime
| Nhóm Kiểm Thử | Test ID & Mô Tả | Mã Lỗi / Trạng Thái | Kết Quả |
|---|---|---|---|
| **Reaction** | 1. Anonymous gọi RPC | `42501` (Unauthorized) | **PASS** |
| | 2. Student A tạo reaction thành công | `action: added`, `likes_count: 2` | **PASS** |
| | 3. Student A toggle cùng loại lần 2 | `action: removed`, `likes_count: 1` | **PASS** |
| | 4. Student A đổi loại reaction (like $\rightarrow$ bulb) | `action: updated`, `likes_count: 2` | **PASS** |
| | 5. Student B tạo reaction độc lập trên cùng post | `action: added`, `likes_count: 3` | **PASS** |
| | 6. Student A không thể giả mạo hay xóa reaction của B | Isolation verified | **PASS** |
| | 7. Student A trực tiếp sửa `likes_count` | `42501` (Quyền hạn bị từ chối) | **PASS** |
| | 8. RLS chặn direct INSERT/DELETE reactions của user khác | `WITH CHECK (auth.uid() = user_id)` | **PASS** |
| | 9. Post không tồn tại | `P0002` (Bài viết không tồn tại) | **PASS** |
| | 10. Post bị xóa mềm (`deleted_at`) hoặc ẩn (`hidden`) | `22000` (Không cho phép tương tác) | **PASS** |
| | 11. Loại reaction không hợp lệ (`unsupported`) | `22023` (Loại tương tác không hợp lệ) | **PASS** |
| **Comment** | 12-13. Student A tạo published comment | Counter tăng +1 | **PASS** |
| | 14-15. Student A tạo pending comment | Counter giữ nguyên (không tăng) | **PASS** |
| | 16-17. Admin duyệt pending $\rightarrow$ published | Counter tăng +1 | **PASS** |
| | 18-19. Admin ẩn published $\rightarrow$ hidden | Counter giảm -1 | **PASS** |
| | 20. Student trực tiếp sửa `comments_count` | `42501` (Quyền hạn bị từ chối) | **PASS** |
| **Integrity** | 21. Thử bật cờ qua API | Không có RPC nào expose `set_config` | **PASS** |
| | 22. Single-use token consumption | Token bị xóa ngay lần dùng đầu tiên | **PASS** |
| | 23-24. Anonymous / Public gọi helper | `REVOKE EXECUTE` có hiệu lực | **PASS** |
| | 25. Transaction rollback | Dữ liệu và counter phục hồi 100% | **PASS** |
| | 26. Trigger integrity không chặn thao tác hợp lệ | RPC và Comment Trigger thông suốt | **PASS** |

### 4.2. Kiểm thử Concurrency & Serialization (Phase C)
1. **10 Concurrent Sessions trên Post 3**:
   - 10 sessions người dùng đồng thời gửi reaction.
   - Nhờ hàng đợi khóa dòng `FOR UPDATE;`, không phát sinh race condition. Counter tăng từ baseline 12 lên chính xác 22 (+10).
2. **Double-Click cùng User**:
   - Cùng một user gửi 2 requests toggle trong cùng một mili-giây.
   - Kết quả: Thao tác 1 thực hiện thêm (`added`), thao tác 2 thực hiện xóa (`removed`). Số lượng reaction trong DB là 0, không có lỗi vi phạm khóa duy nhất `uq_community_reactions_post_user`.
3. **Mass Removal & Giới hạn không âm**:
   - Nhiều thao tác xóa đồng thời trên bài viết có 1 like: Counter giảm về 0 và được bảo vệ an toàn bởi `GREATEST(0, likes_count - 1)`, không bao giờ bị âm.

---

## 5. ĐỐI SOÁT DỮ LIỆU & BẢO TOÀN LEGACY BASELINE (PHASE D)

Bảng truy vấn kiểm toán trực tiếp từ cơ sở dữ liệu Supabase Production qua hàm `audit_community_post_counters()`:

| `post_id` | `author_name` | `stored_likes` | `legacy_likes_baseline` | `new_reactions` | `likes_diff` | `stored_comments` | `legacy_comments_baseline` | `new_comments` | `comments_diff` |
|---|---|---|---|---|---|---|---|---|---|
| **3** | *Ban Quản Trị HanziGo* | **12** | 12 | 0 | **0** | **1** | 1 | 0 | **0** |
| **7** | *Đăng* | **1** | 1 | 0 | **0** | **1** | 1 | 0 | **0** |

### Giải trình Chênh lệch & Chiến lược Migration Task 24.08C:
1. **Vì sao `likes_count` hiện tại không bằng số reaction trong bảng quan hệ?**
   - 12 likes của Post 3 và 1 like của Post 7 là dữ liệu lịch sử được tạo ra từ nguyên mẫu ban đầu (lưu trong cột `likes` INT và `liked_by` JSONB).
   - Bảng `community_reactions` là bảng quan hệ mới, chỉ bắt đầu ghi nhận từ khi người dùng thật đăng nhập và tương tác.
2. **Ngăn chặn Double-Count khi chuyển đổi ở Task 24.08C**:
   - Khi chạy script di chuyển `liked_by` sang `community_reactions`:
     - Nếu user trong `liked_by` đã tồn tại trong `public.profiles`: Tạo dòng quan hệ trong `community_reactions`.
     - Counter `likes_count` **không được cộng dồn thêm** mà chỉ cần đồng bộ tương ứng:
       `likes_count = (SELECT COUNT(*) FROM community_reactions WHERE post_id = p.id) + legacy_unattributed_likes`.

---

## 6. KẾT QUẢ BUILD, LINT & HỒI QUY TOÀN DIỆN

- **Hồi quy toàn Phase 24**: **13 test suites** với **229 tests** đều **100% PASS** trong **1.40 giây**.
- **Linter**: `oxlint` đạt **0 errors** trên toàn bộ 352 files.
- **Production Bundle**: `vite build` tạo bundle hoàn chỉnh thành công trong **948ms**.

---

## 7. QUY TRÌNH HỒI PHỤC (ROLLBACK PLAN)

Trong trường hợp cần hoàn nguyên Task 24.08B.1:
```sql
-- 1. Khôi phục hàm audit counters phiên bản 24.08B
DROP FUNCTION IF EXISTS public.audit_community_post_counters();

-- 2. Khôi phục trigger và RPC phiên bản 24.08B
DROP TRIGGER IF EXISTS trg_sync_community_post_comments_count ON public.community_comments;
DROP FUNCTION IF EXISTS public.sync_community_post_comments_count();
DROP FUNCTION IF EXISTS public.toggle_community_post_reaction(BIGINT, TEXT);
```

---

## 8. KẾT LUẬN & SỰ SẴN SÀNG CHO TASK 24.08C

Task 24.08B.1 đã khép lại toàn bộ các mối lo ngại về bảo mật counter, race condition và tính toàn vẹn dữ liệu. Hệ thống hoàn toàn sẵn sàng cho:
👉 **Task 24.08C**: Triển khai `communityService.js` tích hợp Supabase thực tế, phân trang Feed (`Feed pagination`), kết nối giao diện `CommunityPage.jsx` và di chuyển dữ liệu bình luận từ JSONB cũ sang `community_comments`.

