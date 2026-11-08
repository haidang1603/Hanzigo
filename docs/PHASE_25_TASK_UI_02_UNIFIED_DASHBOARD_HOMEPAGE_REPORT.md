# HANZIGO — PHASE 25 / TASK 25.UI.02
# UNIFIED ROLE-BASED DASHBOARD & HOMEPAGE ACCEPTANCE REPORT

**Project:** HanziGo — Chinese Learning Platform for Vietnamese Learners  
**Version:** v2.5.x  
**Task:** 25.UI.02 — Unified Role-Based Dashboard & Homepage  
**Date:** 2026-11-09  
**Status:** **PASSED / ACCEPTANCE READY**

---

## 1. TỔNG QUAN & TRIẾT LÝ THIẾT KẾ

Nhiệm vụ **Task 25.UI.02** thực hiện hợp nhất hoàn toàn trải nghiệm giữa Trang chủ (Homepage) và Bảng điều khiển (Dashboard) trên nền tảng HanziGo theo triết lý:

> **ONE HOMEPAGE — ROLE-ADAPTIVE EXPERIENCE — REAL DATA ONLY.**

Trước đây, nền tảng tồn tại sự phân mảnh giữa trang giới thiệu sản phẩm (`HomePage.jsx`), trang thống kê học viên (`DashboardPage.jsx`), bảng điều khiển giáo viên (`TeacherDashboardPage.jsx`), và cổng quản trị hệ thống (`AdminPage.jsx`), dẫn tới dư thừa điều hướng và thao tác chuyển tab không cần thiết.

Sau khi nâng cấp:
1. **Một điểm truy cập duy nhất**: Toàn bộ hệ thống điều hướng chỉ duy trì mục **"Trang chủ"** (`#home`), đóng vai trò là Dashboard tổng quan tự thích ứng theo vai trò người dùng (`UnifiedDashboard`).
2. **Thích ứng theo vai trò (Role-Adaptive)**:
   - **Người dùng ẩn danh (Khách / Chưa đăng nhập)**: Hiển thị giao diện giới thiệu sản phẩm cao cấp, bài tập phản xạ mini, kho chữ Hán - Việt, kế hoạch mẫu và CTA đăng ký/đăng nhập.
   - **Học viên (Student)**: Hiển thị Dashboard học tập cá nhân hóa với nút *Tiếp tục học* bài học kế tiếp (dữ liệu thật từ `learningPathService`), hàng đợi ôn tập ngắt quãng (SRS), chuỗi ngày học thực tế (Streak), bảng theo dõi thời gian học trong tuần (biểu đồ Real-Time) và bài tập lớp học.
   - **Giáo viên (Teacher)**: Hiển thị Bảng điều khiển giảng dạy tổng quan với số lớp đang quản lý, số lượng học sinh thực tế, bài tập nộp cần chấm gấp (`pendingSubmissions`) và lối tắt AI Lesson Studio.
   - **Quản trị viên (Admin)**: Hiển thị Trung tâm điều hành & giám sát hệ thống với tổng tài khoản (học viên, giáo viên, admin, tài khoản bị khóa), số liệu giáo trình/tài liệu thư viện số, lối tắt phân quyền và kiểm duyệt cộng đồng.
3. **Bảo toàn dữ liệu thật & Không mock**: Không tự sinh XP/streak giả, không tạo tiến độ bài học ảo khi chưa học, dữ liệu lấy trực tiếp từ database Supabase và LocalStorage authoritative sync.
4. **Tương thích ngược tuyệt đối (Backward Compatibility)**: Giữ toàn vẹn route cũ `#dashboard`, tự động ánh xạ về `UnifiedDashboard` để bảo đảm mọi liên kết nội bộ, bookmark và deep link không bị đứt gãy.

---

## 2. AUDIT TRƯỚC TRIỂN KHAI & FEATURE MAPPING

### 2.1. Kiểm toán các thành phần Dashboard cũ
| Thành phần cũ | Vị trí file | Vai trò phục vụ | Tình trạng tích hợp |
| :--- | :--- | :--- | :--- |
| **Public Showcase** | `src/pages/HomePage.jsx` | Khách vãng lai, học viên muốn xem lại giới thiệu | Giữ nguyên cho Anonymous & Blocked user trong `UnifiedDashboard`. |
| **Student Dashboard** | `src/pages/DashboardPage.jsx` | Học viên đã đăng nhập | Chuẩn hóa thành trải nghiệm mặc định cho `role: 'student'`. |
| **Teacher Dashboard** | `src/pages/TeacherDashboardPage.jsx` | Giáo viên quản lý lớp & chấm bài | Trích xuất thành `TeacherDashboard.jsx` (Widget-first) cho trang chủ của Teacher. Trang chuyên sâu `TeacherDashboardPage` vẫn giữ nguyên cho sub-routes. |
| **Admin Dashboard** | `src/pages/AdminPage.jsx` | Quản trị viên tối cao | Trích xuất thành `AdminDashboard.jsx` (Widget-first) cho trang chủ của Admin. Trang chi tiết `AdminPage` vẫn giữ nguyên cho quản lý bảng. |

### 2.2. Ma trận ánh xạ chức năng (Old-to-New Mapping)
| Nhóm tính năng | Dashboard cũ | Unified Homepage mới | Nguồn cấp dữ liệu (Data Source) |
| :--- | :--- | :--- | :--- |
| **Welcome & Continue Learning** | DashboardPage | Nổi bật trên đầu Student Dashboard | `getRecommendedNextLesson()`, `getUserJourneyProgress()` |
| **Weekly Study Time Chart** | DashboardPage | Custom Bar Chart trực quan với mốc chỉ tiêu | `getLocalDateString()`, tính toán phút học thực tế |
| **Spaced Repetition (SRS)** | DashboardPage | Danh sách từ vựng đến hạn kèm Audio | `VOCABULARY_LIST`, `getStoredCustomVocab()` |
| **Classrooms & Assignments** | DashboardPage | Danh sách bài tập lớp học kèm hạn nộp và điểm | `getClassroomsForStudent()`, `getAssignmentsForClassroom()` |
| **Teacher Overview Metrics** | TeacherDashboardPage | Bar 4 metrics: Lớp, Học viên, Bài cần chấm | `getClassroomsForTeacher()`, `getAllSubmissionsForTeacher()` |
| **Teacher Quick Grading** | TeacherDashboardPage | Widget hiển thị 5 bài nộp mới nhất kèm nút chấm | `getAllSubmissionsForTeacher()` lọc `!s.graded` |
| **Admin System Metrics** | AdminPage | Bar 4 metrics: Tổng user, Giáo viên, Tài liệu, Khóa | `getAllProfilesFromDb()`, `getMaterialsFromDb()` |
| **Admin Governance Shortcuts**| AdminPage | Widget người dùng mới & lối tắt kiểm duyệt | `getAllProfilesFromDb()`, hash navigation `#admin#users` |

---

## 3. KIẾN TRÚC MỚI ĐÃ TRIỂN KHAI (ARCHITECTURE)

Toàn bộ logic hợp nhất được tổ chức trong thư mục chuẩn module hóa:
`src/components/dashboard/`

1. **[`DashboardWidget.jsx`](file:///d:/DELL/Dowloads/HanziGo/src/components/dashboard/DashboardWidget.jsx)**:
   - Container widget chuẩn SaaS với tiêu đề, phụ đề, biểu tượng, nút thao tác góc phải (`action`).
   - Tích hợp sẵn 3 trạng thái: `loading` (spinner/skeleton), `error` (thông báo lỗi kèm nút Thử lại), và `empty` (thông báo dữ liệu trống thân thiện).
2. **[`UnifiedDashboard.jsx`](file:///d:/DELL/Dowloads/HanziGo/src/components/dashboard/UnifiedDashboard.jsx)**:
   - Điểm phân phối trung tâm (Role Dispatcher):
     - `!user` -> `HomePage` (Showcase sản phẩm)
     - `user.status === 'blocked'` -> `HomePage` (Cắt quyền dashboard)
     - `user.role === 'admin'` -> `AdminDashboard`
     - `user.role === 'teacher'` -> `TeacherDashboard`
     - `user.role === 'student'` -> `DashboardPage`
3. **[`TeacherDashboard.jsx`](file:///d:/DELL/Dowloads/HanziGo/src/components/dashboard/TeacherDashboard.jsx)**:
   - Widget tổng quan dành riêng cho giáo viên: theo dõi số lớp, số học viên, danh sách bài tập chờ chấm điểm và khởi động nhanh AI Lesson Studio.
4. **[`AdminDashboard.jsx`](file:///d:/DELL/Dowloads/HanziGo/src/components/dashboard/AdminDashboard.jsx)**:
   - Widget trung tâm điều hành dành cho quản trị viên: giám sát số lượng tài khoản phân bổ theo vai trò, tỷ lệ tài khoản khóa, kho tài liệu số BLCU và danh sách người dùng mới đăng ký.
5. **[`index.js`](file:///d:/DELL/Dowloads/HanziGo/src/components/dashboard/index.js)**:
   - Xuất khẩu thống nhất các thành phần dashboard.
6. **Tích hợp [`App.jsx`](file:///d:/DELL/Dowloads/HanziGo/src/App.jsx)**:
   - Hợp nhất điều kiện hiển thị: `(activeTab === 'home' || activeTab === 'dashboard')` đều trỏ về `<UnifiedDashboard />`.
   - Loại bỏ mục tab "Dashboard" dư thừa trong thanh Sidebar và Mobile Drawer, chỉ giữ duy nhất một mục **"Trang chủ"** làm điểm hội tụ.

---

## 4. KẾT QUẢ KIỂM THỬ VÀ XÁC MINH (TEST RESULTS)

### 4.1. Unit & Integration Test Suite
Tạo mới file kiểm thử chuyên biệt [`tests/unifiedDashboardRoleBased.test.js`](file:///d:/DELL/Dowloads/HanziGo/tests/unifiedDashboardRoleBased.test.js) và thực thi đồng thời toàn bộ 5 bộ kiểm thử của dự án:
```bash
node --test tests/unifiedDashboardRoleBased.test.js tests/smartNavigationAndUI.test.js tests/adminManagementStandardization.test.js tests/materialsIntegration.test.js tests/interactiveLessonPlayerModularization.test.js
```
**Kết quả: 52 / 52 tests PASS (100% Passed)**
- `unifiedDashboardRoleBased.test.js`: **7 / 7 PASS**
  - Test 1: Khách vãng lai xem HomePage showcase; Admin xem AdminDashboard; Teacher xem TeacherDashboard; Student xem DashboardPage.
  - Test 2: Chống vượt quyền, tài khoản bị khóa (`blocked`) hoặc giả mạo role bị chặn.
  - Test 3: Student Dashboard tích hợp Continue Learning, Lộ trình HSK, dữ liệu thời gian thực và hàng đợi SRS.
  - Test 4: Teacher Dashboard truy vấn và hiển thị đúng lớp, học viên, bài tập chờ chấm và AI Studio.
  - Test 5: Admin Dashboard hiển thị thống kê tài khoản, tài liệu và các lối tắt kiểm duyệt.
  - Test 6: DashboardWidget đáp ứng chuẩn các trạng thái loading, error, empty.
  - Test 7: Tương thích ngược: cả `#home` và `#dashboard` đều được gắn vào UnifiedDashboard.
- `smartNavigationAndUI.test.js`: **10 / 10 PASS**
- `adminManagementStandardization.test.js`: **16 / 16 PASS**
- `interactiveLessonPlayerModularization.test.js`: **13 / 13 PASS**
- `materialsIntegration.test.js`: **6 / 6 PASS**

### 4.2. Runtime Browser Verification (Google Chrome Headless via CDP)
Chạy script kiểm thử trực tiếp trên trình duyệt Chrome:
```bash
node scripts/browser_runtime_verify.js
```
- **Desktop (1440 × 900):** Sidebar mở rộng 256px, thu gọn 80px, Breadcrumb tại `#home` tự động ẩn, không có lỗi tràn ngang (`hasHorizontalOverflow: false`).
- **Tablet (768 × 1024):** Ẩn sidebar desktop, chuyển sang layout co giãn tối ưu, không tràn ngang.
- **Mobile (390 × 844):** Bottom Bar cố định 5 nút chuẩn touch target (tối thiểu 56 × 48px >= 44px), drawer trượt mượt mà.
- **Smart Command Palette:** Kích hoạt mở tức thì bằng nút tìm kiếm hoặc Ctrl+K, tìm kiếm tiếng Việt không dấu (`chao hoi` -> Bài 101) chính xác 100%.
- **Route Guards & Anti-Tampering:** Chặn hoàn toàn truy cập trái phép của Anonymous và Student vào `#admin` / `#teacher`. Tấn công sửa đổi LocalStorage role bị Zero Trust Cache của `AuthContext` triệt tiêu ngay lập tức.
- **Console Exceptions:** **0 JavaScript Exceptions** ghi nhận trên toàn bộ phiên chạy.

### 4.3. Production Build & Static Lint
- `npx oxlint src/`: **0 errors** (Chỉ có các cảnh báo unused-vars thông thường).
- `npm run build`: Hoàn tất trong **942ms**, xuất toàn bộ bundle nén vào thư mục `dist/` với mã thoát **0 (Success)**.

---

## 5. BẢNG ĐỐI CHIẾU TIÊU CHÍ NGHIỆM THU (ACCEPTANCE MATRIX)

| Tiêu chí nghiệm thu | Hiện trạng thực tế | Kết luận |
| :--- | :--- | :---: |
| Một điểm truy cập Trang chủ thống nhất | Chỉ còn 1 mục "Trang chủ" trên Sidebar/MobileNav, đại diện cho Dashboard thích ứng | **ĐẠT** |
| Thích ứng theo vai trò (Role-Adaptive) | Tự động chuyển đổi giữa Khách (Showcase), Học viên, Giáo viên và Admin | **ĐẠT** |
| Bảo toàn chức năng của Dashboard cũ | Toàn bộ tiến độ học tập, SRS, lớp học, chấm bài và quản trị đều nguyên vẹn | **ĐẠT** |
| Dữ liệu thật & Không hiển thị số liệu giả | Sử dụng API Supabase và dữ liệu học tập thực tế, không dùng số liệu mock | **ĐẠT** |
| Bảo mật và cách ly vai trò tuyệt đối | Client tampering không thể vượt rào; AdminGuard và TeacherGuard bảo vệ tầng route và API | **ĐẠT** |
| Tương thích ngược đường dẫn | Cả `#home` và `#dashboard` đều được hỗ trợ liền mạch | **ĐẠT** |
| Build & Tests thành công | 52/52 tests PASS, build thành công trong 942ms | **ĐẠT** |

---

## 6. KẾT LUẬN

Task 25.UI.02 đã hoàn thành xuất sắc toàn bộ mục tiêu đề ra, đem lại một trải nghiệm Trang chủ & Dashboard hợp nhất, cá nhân hóa sâu sắc theo vai trò người dùng với hiệu năng và độ ổn định cao.

