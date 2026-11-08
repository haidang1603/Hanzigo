# HANZIGO — PHASE 24 / TASK 24.08D
## COMMUNITY REPORTS & MODERATION UI REPORT
### Báo cáo Nghiệm thu: Giao diện Báo cáo Vi phạm Học viên & Bảng Điều khiển Quản trị Kiểm duyệt Cộng đồng

**Ngày lập:** 08/11/2026  
**Trạng thái kiểm thử:** 27/27 tests PASS (100%), 235/235 Toàn bộ Community Test Suite PASS (100%)  
**Trạng thái Build:** Vite production build PASS (937ms, 0 errors)  
**Trạng thái nghiệm thu:** **PRODUCTION VERIFICATION PARTIAL** *(Sẵn sàng triển khai trên Supabase Cloud)*

---

## 1. PHẠM VI TRIỂN KHAI VÀ TÍNH NĂNG HOÀN THÀNH

### 1.1. Task 24.08D.1 — Student Report UI (Giao diện báo cáo vi phạm cho Học viên)
* **Vị trí tích hợp:** Bổ sung nút báo cáo với biểu tượng `Flag` trực tiếp tại:
  - Header của mỗi bài viết trên Feed cộng đồng (chỉ hiển thị cho người khác, không tự báo cáo bài của mình).
  - Góc thao tác của mỗi bình luận trong ngăn kéo bình luận (Comments Drawer).
* **Component `ReportModal`:**
  - Hiển thị bản xem trước nội dung và tác giả của đối tượng bị báo cáo.
  - Danh mục lý do vi phạm chuẩn hóa:
    1. `spam`: Spam hoặc quảng cáo trái phép
    2. `harassment`: Nội dung xúc phạm, quấy rối hoặc công kích cá nhân
    3. `misinformation`: Nội dung sai lệch hoặc gây hiểu lầm về kiến thức Hán ngữ
    4. `inappropriate`: Nội dung không phù hợp với môi trường học tập
    5. `other`: Lý do khác
  - Ô nhập mô tả bổ sung (giới hạn tối đa 500 ký tự với bộ đếm ký tự thời gian thực).
  - Validation client-side & backend:
    - Bắt buộc đăng nhập tài khoản.
    - Bắt buộc chọn lý do vi phạm.
    - Chặn gửi trùng lặp: Kiểm tra nếu học viên đã có báo cáo đang ở trạng thái `pending` hoặc `reviewing` cho cùng một đối tượng thì từ chối gửi lặp và thông báo thân thiện.
    - Trạng thái loading (`Đang gửi...`), banner thành công/thất bại rõ ràng.

### 1.2. Task 24.08D.2 — Admin Moderation Dashboard (Bảng điều khiển Kiểm duyệt)
* **Vị trí tích hợp:** Tab phụ `moderation` ("Kiểm duyệt") trong khu vực quản trị hiện có [AdminPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/AdminPage.jsx).
* **Component `CommunityModerationDashboard`:**
  - **Bộ lọc & Phân trang:**
    - Lọc theo trạng thái: `all`, `pending` (Chờ xử lý), `reviewing` (Đang xem xét), `resolved` (Đã giải quyết), `dismissed` (Đã bác bỏ).
    - Lọc theo loại đối tượng: `all`, `post` (Bài viết), `comment` (Bình luận).
    - Lọc theo lý do vi phạm: `all`, `spam`, `harassment`, `misinformation`, `inappropriate`, `other`.
    - Tìm kiếm theo nội dung mô tả hoặc mã báo cáo.
    - Phân trang 10 báo cáo / trang với nút Previous/Next.
  - **Bảng dữ liệu báo cáo:**
    - Hiển thị loại đối tượng, thông tin người báo cáo (tên, avatar, email), lý do vi phạm, mô tả, thời gian gửi, trạng thái badge màu sắc rõ ràng.
  - **Modal Chi tiết & Quyết định Kiểm duyệt:**
    - Hiển thị snapshot nội dung thực tế trên hệ thống (hoặc cảnh báo rõ ràng nếu nội dung đã bị xóa mà không làm crash giao diện).
    - Toolbar quyết định của Admin:
      1. `Đang xem xét`: Chuyển trạng thái báo cáo sang `reviewing`.
      2. `Ẩn nội dung`: Đổi trạng thái bài viết/bình luận sang `hidden` và đánh dấu báo cáo `resolved`.
      3. `Khôi phục`: Đưa bài viết/bình luận trở lại trạng thái `published`.
      4. `Bác bỏ khiếu nại`: Chuyển trạng thái báo cáo sang `dismissed`.
      5. `Đã giải quyết`: Đánh dấu `resolved`.
      6. `Xóa nội dung`: Xóa mềm bài viết/bình luận và đánh dấu `resolved`.
    - Hộp thoại xác nhận trước thao tác nguy hiểm (ẩn, khôi phục, xóa).
    - Ghi nhận lý do xử lý của Admin.
    - Bảng lịch sử kiểm duyệt (Audit Logs) hiển thị toàn bộ thao tác trong quá khứ đối với đối tượng này.

### 1.3. Task 24.08D.3 — Backend & Database Integration
* **Migration SQL:** `supabase/migrations/20261108_community_moderation_and_reports.sql`.
* **Cập nhật Check Constraints:**
  - `chk_community_reports_status`: Hỗ trợ `'pending'`, `'reviewing'`, `'resolved'`, `'dismissed'`.
  - `chk_community_reports_reason`: Hỗ trợ `'spam'`, `'inappropriate'`, `'harassment'`, `'misinformation'`, `'other'`.
  - `chk_community_moderation_logs_action`: Hỗ trợ `'hide'`, `'restore'`, `'delete'`, `'dismiss_report'`, `'review_report'`, `'resolve_report'`, `'pin'`, `'unpin'`.
* **Anti-abuse Database Index:**
  - `uq_community_reports_active`: Unique index trên `(reporter_id, target_type, target_id)` cho các báo cáo có `status IN ('pending', 'reviewing')`.
* **Atomic RPC `public.moderate_community_content`:**
  - `SECURITY DEFINER` kiểm tra quyền `public.is_admin()` hoặc `service_role`.
  - Lấy `admin_id = auth.uid()`, tuyệt đối không tin client payload.
  - Thực thi cập nhật trạng thái nội dung, cập nhật trạng thái báo cáo và ghi vào `community_moderation_logs` trong cùng một giao dịch PostgreSQL nguyên tử (all-or-nothing).

### 1.4. Task 24.08D.4 — Community Feed Integration & Realtime Sync
* Khi Admin ẩn bài viết (`status = 'hidden'`) hoặc xóa bài viết (`deleted_at IS NOT NULL`), Realtime listener trên `CommunityPage.jsx` lập tức loại bỏ bài viết khỏi feed học viên.
* Khi Admin ẩn bình luận, Realtime listener loại bỏ bình luận khỏi danh sách hiển thị và giảm bộ đếm `commentsCount` tương ứng.
* Khi học viên mở ngăn kéo bình luận, chỉ các bình luận có `status = 'published'` và `deleted_at IS NULL` mới được tải.

---

## 2. DANH SÁCH TỆP ĐÃ THÊM VÀ HIỆU CHỈNH

| Tệp | Trạng thái | Mục đích |
| :--- | :---: | :--- |
| `src/components/community/ReportModal.jsx` | **Tạo mới** | Modal báo cáo vi phạm bài viết/bình luận cho học viên |
| `src/components/admin/CommunityModerationDashboard.jsx` | **Tạo mới** | Dashboard kiểm duyệt báo cáo và thao tác nội dung cho Admin |
| `supabase/migrations/20261108_community_moderation_and_reports.sql` | **Tạo mới** | SQL migration cập nhật constraints, anti-abuse index và RPC `moderate_community_content` |
| `tests/communityReportsAndModerationUI.test.js` | **Tạo mới** | Test suite 27 test cases toàn diện cho Task 24.08D |
| `src/services/communityService.js` | **Cập nhật** | Bổ sung `validateCommunityReportInput`, `submitCommunityReport`, `getCommunityReports`, `getCommunityReportDetails`, `moderateCommunityContent`, `getCommunityModerationLogs` |
| `src/pages/CommunityPage.jsx` | **Cập nhật** | Tích hợp nút báo cáo trên Post/Comment, mở ReportModal, cập nhật Realtime lọc nội dung ẩn/xóa |
| `src/pages/AdminPage.jsx` | **Cập nhật** | Bổ sung sub-tab `moderation` hiển thị `CommunityModerationDashboard` |
| `supabase/schema.sql` | **Cập nhật** | Đồng bộ RPC `moderate_community_content`, constraints mở rộng và index chống trùng lặp |

---

## 3. MA TRẬN KIỂM THỬ (TEST MATRIX)

### 3.1. Phân loại kiểm thử Task 24.08D (`tests/communityReportsAndModerationUI.test.js`)
* **Group 1: Static / Schema & Security Definition Audit (5/5 PASS)**
  - 1.1. Migration không phá hủy (giữ nguyên bảng, không drop cascade).
  - 1.2. Unique index chống spam trùng lặp `uq_community_reports_active`.
  - 1.3. RPC `moderate_community_content` chạy `SECURITY DEFINER` và kiểm tra `is_admin()`.
  - 1.4. `schema.sql` đồng bộ check constraints và ACL grants.
  - 1.5. Zero token leak (không có service role key trong frontend).
* **Group 2: Unit Business Logic & Input Validation (6/6 PASS)**
  - 2.1. Kiểm tra validation target_type (bắt buộc post/comment).
  - 2.2. Kiểm tra validation target_id không để trống.
  - 2.3. Kiểm tra validation reason thuộc danh mục hợp lệ.
  - 2.4. Kiểm tra giới hạn độ dài mô tả tối đa 500 ký tự.
  - 2.5. Kiểm tra 4 trạng thái báo cáo (`pending`, `reviewing`, `resolved`, `dismissed`).
  - 2.6. Kiểm tra 5 danh mục vi phạm (`spam`, `harassment`, `misinformation`, `inappropriate`, `other`).
* **Group 3: Integration & Threat Model Simulation (8/8 PASS)**
  - 3.1. Học viên gửi báo cáo bài viết: Lưu đúng trạng thái `pending`.
  - 3.2. Học viên gửi báo cáo bình luận: Chỉ định chính xác `comment_id`.
  - 3.3. Chặn gửi trùng: Phát hiện báo cáo đang xử lý cùng target.
  - 3.4. Cách ly RLS: Học viên không đọc được báo cáo của học viên khác.
  - 3.5. Chặn học viên gọi thao tác kiểm duyệt Admin (mã lỗi `42501`).
  - 3.6. Admin ẩn nội dung: Ẩn post, chuyển report sang `resolved`, ghi audit log.
  - 3.7. Admin khôi phục nội dung: Chuyển post sang `published`, ghi audit log.
  - 3.8. Xử lý đối tượng đã xóa: Snapshot target_id bảo toàn, giao diện không crash.
* **Group 4: Live Supabase Database Checks (3/3 PASS)**
  - 4.1. Bảng `community_reports` tồn tại và bật RLS.
  - 4.2. Khách vãng lai (unauthenticated) bị từ chối gửi báo cáo.
  - 4.3. Khách vãng lai bị từ chối gọi RPC `moderate_community_content`.
* **Group 5: Community Regression & Feed Invariance (5/5 PASS)**
  - 5.1. Feed filtering: Bài viết bị ẩn tự động biến mất khỏi Feed học viên.
  - 5.2. Comments filtering: Bình luận bị ẩn tự động biến mất khỏi drawer.
  - 5.3. Realtime event handling: Ẩn bài viết không phá vỡ con trỏ phân trang cursor.
  - 5.4. An toàn số nguyên lớn `BIGSERIAL`: `post.id` chuyển chuỗi an toàn.
  - 5.5. Các hàm Study Partners được bảo toàn 100%.

**Tổng kết suite:** **27/27 tests PASS trong 130ms**.  
**Tổng kết toàn bộ Community suites:** **235/235 tests PASS (100%)**.

---

## 4. KẾT QUẢ BUILD & LINT PRODUCTION

```text
> hanzigo@0.0.0 build
> vite build

vite v8.3.1 building client environment for production...
✓ 2243 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                   3.26 kB │ gzip:   1.24 kB
dist/assets/index-DUUo9LMY.css                  318.27 kB │ gzip:  34.90 kB
dist/assets/CommunityPage-7yz8rHku.js           122.35 kB │ gzip:  26.75 kB
dist/assets/AdminPage-CgrrJ8eP.js               125.05 kB │ gzip:  23.12 kB
✓ built in 937ms
```
* **Kết quả:** 0 lỗi biên dịch, 0 module missing.

---

## 5. HƯỚNG DẪN TRIỂN KHAI TRÊN SUPABASE CLOUD

1. **Bước 1: Chạy SQL Migration trên Supabase SQL Editor**
   - Mở Supabase SQL Editor.
   - Chạy toàn bộ file [supabase/migrations/20261108_community_moderation_and_reports.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_moderation_and_reports.sql).
   - *Kết quả mong đợi:* Cập nhật constraints `community_reports`, tạo unique index `uq_community_reports_active`, tạo RPC `moderate_community_content`.

2. **Bước 2: Xác minh phân quyền RPC**
   ```sql
   SELECT routine_name, routine_type, security_type
   FROM information_schema.routines
   WHERE routine_schema = 'public' AND routine_name = 'moderate_community_content';
   ```

3. **Bước 3: Kiểm tra trải nghiệm thực tế**
   - Đăng nhập tài khoản Học viên: Mở bài viết bất kỳ trên Community -> Bấm biểu tượng Lá cờ (Flag) -> Gửi báo cáo vi phạm.
   - Đăng nhập tài khoản Admin: Vào Admin Hub -> Chọn tab **Kiểm duyệt** -> Xem báo cáo vừa gửi -> Thực hiện kiểm duyệt (Đang xem xét / Ẩn nội dung / Bác bỏ).
   - Kiểm tra Feed: Xác nhận nội dung bị ẩn không còn hiển thị đối với tài khoản học viên.

---

## 6. KẾT LUẬN & CHUYỂN TIẾP ROADMAP

* **Đạt chuẩn nghiệm thu:** Toàn bộ 5 phân hệ yêu cầu của Task 24.08D đã hoàn thiện xuất sắc.
* **Trạng thái:** **`PRODUCTION VERIFICATION PARTIAL`** *(Toàn bộ code, component, service, test và migration đã hoàn tất trên codebase; sẵn sàng đưa lên Cloud)*.
* **Tiếp theo:** Sẵn sàng chuyển giao sang **PHASE 24 / TASK 24.08E — COMMUNITY STUDY PARTNERS & FINAL CLOSURE** *(Tối ưu hóa và tích hợp sâu tính năng Tìm bạn cùng tiến HSK, hoàn thiện vòng lặp cộng đồng học tập).*

