# HANZIGO — PHASE 25 / TASK 25.UI.03
# BÁO CÁO NGHIỆM THU: ADMIN & TEACHER DASHBOARD ANALYTICS
## HỆ THỐNG BIỂU ĐỒ PHÂN TÍCH TƯƠNG TÁC XÁC THỰC DÀNH CHO ADMIN VÀ GIÁO VIÊN

---

## 1. TỔNG QUAN VÀ MỤC TIÊU HOÀN THÀNH

Task 25.UI.03 nâng cấp toàn diện phân hệ thống kê và trực quan hóa dữ liệu trên HanziGo cho 2 đối tượng cốt lõi:
- **Admin Dashboard:** Trung tâm giám sát và điều hành toàn nền tảng (quy mô người dùng, xu hướng tăng trưởng thực tế, hoạt động học tập, phân bố giáo trình HSK 1–6 và kiểm duyệt cộng đồng).
- **Teacher Dashboard:** Trung tâm theo dõi học tập của học viên theo từng lớp học do giáo viên trực tiếp phụ trách (tiến độ hoàn thành bài tập, phổ điểm bài kiểm tra, tỷ lệ nộp bài, lịch sử hoạt động nộp bài và danh sách học viên cần can thiệp sư phạm).

**Nguyên tắc triển khai:**
- **REAL DATA:** Toàn bộ số liệu tính toán từ các bảng Supabase (`profiles`, `classrooms`, `assignments`, `submissions`, `materials`, `community_reports`, `community_posts`). Tuyệt đối không mock hay bịa đặt số liệu ảo.
- **ROLE ISOLATION:** Giáo viên chỉ truy xuất dữ liệu trong các lớp học thuộc quyền sở hữu của mình (`teacher_id === user.id`). Backend service từ chối mọi yêu cầu truy xuất chéo lớp.
- **ZERO BUNDLE BLOAT:** Xây dựng biểu đồ thuần React SVG siêu nhẹ, responsive, tương thích 100% với Dark Mode và hệ thống Design Tokens của HanziGo mà không phát sinh dependency bên ngoài.

---

## 2. DANH SÁCH BIỂU ĐỒ ĐÃ TRIỂN KHAI

### 2.1. Phân hệ Admin Dashboard
| STT | Tên Biểu Đồ | Loại Biểu Đồ | Mục Đích & Nội Dung |
|---|---|---|---|
| 1 | **Key Metrics Bar (6 Cards)** | Metric Cards | Thống kê số lượng thực tế: Tổng tài khoản, Học viên, Giáo viên, Lớp học đang hoạt động, Tài liệu số BLCU, Tài khoản bị khóa. |
| 2 | **User Distribution** | Donut Chart (SVG) | Phân bố tài khoản theo vai trò (Student, Teacher, Admin) và trạng thái (Active, Blocked). Hiển thị số lượng, tỷ lệ %, tooltip hover và tổng số ở tâm donut. |
| 3 | **User Growth** | Area Chart (SVG) | Xu hướng tăng trưởng đăng ký tài khoản mới theo ngày/tháng với các bộ lọc `7 ngày`, `30 ngày`, `90 ngày`, `12 tháng`. Hiển thị đường gióng và tooltip ngày + số lượng. |
| 4 | **Platform Learning Activity** | Bar Chart (SVG) | Tương tác học tập toàn nền tảng: Bài nộp học viên (`submissions`), Bài đọc hoàn thành (`reading_progress`), Thảo luận cộng đồng (`community_posts`), Tài liệu giáo trình (`materials`). |
| 5 | **HSK Curriculum Distribution** | Horizontal Bar Chart | Phân bố 120 bài học chuẩn và tài liệu số từ HSK 1 đến HSK 6 kèm màu sắc thương hiệu và thanh tiến độ. |
| 6 | **Community Moderation Overview** | Status Cards & Meters | Tình trạng kiểm duyệt nội dung cộng đồng: Chờ duyệt (`pending`), Đã xử lý (`resolved`), Đã gỡ/ẩn (`hidden`), tỷ lệ xử lý vi phạm. |

### 2.2. Phân hệ Teacher Dashboard
| STT | Tên Biểu Đồ | Loại Biểu Đồ | Mục Đích & Nội Dung |
|---|---|---|---|
| 1 | **Key Metrics Bar (4 Cards)** | Metric Cards | Thống kê lớp học: Lớp đang quản lý, Tổng học viên, Bài cần chấm gấp, Tổng bài tập giao. |
| 2 | **Class Learning Progress** | Bar Chart (SVG) | So sánh tiến độ hoàn thành bài tập giữa các học viên. Hỗ trợ lọc theo lớp học cụ thể hoặc tất cả các lớp, sắp xếp `Cao ➔ Thấp` hoặc `Thấp ➔ Cao`. |
| 3 | **Student Performance** | Tier Bars & Badge | Phổ điểm đánh giá theo 4 phân khúc: Xuất sắc (85-100đ), Khá (70-84đ), Trung bình (50-69đ), Cần nỗ lực (<50đ), kèm điểm trung bình toàn lớp. |
| 4 | **Assignment Status** | Donut Chart (SVG) | Tỷ lệ trạng thái bài tập loại trừ lẫn nhau (không đếm trùng): Đã chấm, Chờ chấm, Quá hạn, Chưa nộp. |
| 5 | **Class Learning Activity** | Area Chart (SVG) | Dòng thời gian nộp bài của học sinh theo các mốc `7 ngày`, `30 ngày`, `90 ngày`. |
| 6 | **Students Requiring Attention** | Diagnostic Table | Bảng chẩn đoán học viên cần hỗ trợ theo chuẩn `calculateStudentHealthStatus`: phân loại `At Risk` (Cần can thiệp) và `Needs Attention` (Cần chú ý) kèm lý do sư phạm cụ thể. |

---

## 3. NGUỒN DỮ LIỆU VÀ CÔNG THỨC TÍNH TOÁN

### 3.1. Admin Analytics
- **Nguồn dữ liệu:** `profiles` (Auth & User Metadata), `materials` (BLCU Digital Library), `classrooms`, `submissions`, `reading_progress`, `community_reports`, `community_posts`.
- **Tăng trưởng người dùng:** Lấy timestamp `created_at` từ `profiles`. Ánh xạ vào mốc `N` ngày tương ứng, tích lũy theo ngày; ngày không có đăng ký hiển thị `0` (không nội suy ảo).
- **Phân bố HSK:** Đồng bộ từ mảng bài học chuẩn 120 lessons trong `learningPathService.js` và tài liệu số phân loại theo HSK 1–6.

### 3.2. Teacher Analytics & Cách Ly Quyền (Role Isolation)
- **Ranh giới bảo mật:** Mọi phương thức trong `teacherAnalyticsService.js` đều yêu cầu `teacherId`. Kiểm tra danh sách lớp học do giáo viên sở hữu (`teacher_id === teacherId`). Nếu client gửi `classroomId` của giáo viên khác, phương thức lập tức kích hoạt lỗi: `Từ chối truy cập: Lớp học không thuộc quyền quản lý của bạn`.
- **Trạng thái bài nộp loại trừ nhau:**
  1. Nếu học viên đã nộp bài:
     - `sub.graded === true` ➔ **Đã chấm**
     - `sub.graded === false` ➔ **Chờ chấm**
  2. Nếu học viên chưa nộp bài:
     - `assignment.due_date < now` ➔ **Quá hạn**
     - `assignment.due_date >= now` ➔ **Chưa nộp**
  $$\sum (\text{Đã chấm} + \text{Chờ chấm} + \text{Quá hạn} + \text{Chưa nộp}) = \text{Tổng lượt bài tập giao}$$
  Đảm bảo **tuyệt đối không đếm trùng** dữ liệu.

---

## 4. DANH SÁCH FILE THAY ĐỔI VÀ TẠO MỚI

### 4.1. Services
- `src/services/adminAnalyticsService.js`: Dịch vụ tổng hợp chỉ số, tăng trưởng, phân bố tài khoản, tài nguyên HSK và kiểm duyệt cộng đồng cho Admin.
- `src/services/teacherAnalyticsService.js`: Dịch vụ phân tích lớp học, phân bố điểm, trạng thái bài tập, tiến độ học viên và chẩn đoán At-Risk cho Teacher.
- `src/services/index.js`: Re-export các analytics services.

### 4.2. Component Biểu Đồ Tái Sử Dụng (`src/components/dashboard/charts/`)
- `DashboardChartContainer.jsx`: Khung chứa chuẩn hóa hỗ trợ Header, Controls (Timeframe/Class), Skeleton Loading, Error State với nút thử lại, và Empty State.
- `UserDistributionChart.jsx`: Donut Chart SVG phân bố vai trò & trạng thái.
- `UserGrowthChart.jsx`: Area/Line Chart SVG tăng trưởng đăng ký theo ngày.
- `PlatformActivityChart.jsx`: Bar Chart SVG hoạt động học tập nền tảng.
- `CurriculumDistributionChart.jsx`: Horizontal Bar Chart phân bố giáo trình HSK 1–6.
- `CommunityModerationChart.jsx`: Thống kê xử lý vi phạm cộng đồng.
- `ClassProgressChart.jsx`: Bar Chart tiến độ học viên kèm bộ lọc lớp và sắp xếp.
- `StudentPerformanceChart.jsx`: Phổ điểm bài tập theo 4 thang xếp loại.
- `AssignmentStatusChart.jsx`: Donut Chart trạng thái bài nộp phân loại độc quyền.
- `ClassActivityChart.jsx`: Area Chart hoạt động nộp bài của lớp theo thời gian.
- `StudentsRequiringAttentionTable.jsx`: Bảng chẩn đoán học viên cần hỗ trợ sư phạm.
- `index.js`: Barrel export cho toàn bộ thư mục charts.

### 4.3. Nâng Cấp Giao Diện Dashboard
- `src/components/dashboard/AdminDashboard.jsx`: Bổ sung 6 metric cards, 5 biểu đồ quản trị và kết nối `adminAnalyticsService`.
- `src/components/dashboard/TeacherDashboard.jsx`: Bổ sung bộ lọc lớp học, 5 biểu đồ giảng dạy, bảng học viên cần quan tâm và kết nối `teacherAnalyticsService`.
- `src/components/dashboard/index.js`: Re-export chart components.

### 4.4. Kiểm Thử
- `tests/dashboardAnalyticsAdminTeacher.test.js`: Bộ test tự động 11 hạng mục kiểm tra toán học, cách ly quyền, không đếm trùng và kiến trúc component.

---

## 5. KẾT QUẢ KIỂM THỬ VÀ XÁC THỰC

### 5.1. Unit & Deep Integration Tests
```bash
node --test tests/dashboardAnalyticsAdminTeacher.test.js tests/unifiedDashboardRoleBased.test.js tests/smartNavigationAndUI.test.js tests/practiceLevels.test.js tests/privacyAndTerms.test.js tests/adminManagementStandardization.test.js tests/materialsIntegration.test.js
```
* **Tổng số bài test:** `68/68 tests PASSED (100%)`
* **Thời gian thực thi:** `375.24ms`
* **Kết quả:**
  - `getAdminOverviewMetrics`: Cấu trúc metric toán học chính xác.
  - `getUserDistributionData`: Tổng các role bằng đúng tổng tài khoản (0 sai số).
  - `getUserGrowthData`: Đúng số ngày của mốc (7, 30, 90, 365), không tạo dữ liệu ảo.
  - `getTeacherOverviewMetrics`: Chỉ trả về lớp do giáo viên quản lý.
  - `Role Isolation Guard`: Ném ngoại lệ khi truy cập chéo `classroomId` hoặc thiếu `teacherId`.
  - `getAssignmentStatusData`: 4 trạng thái loại trừ lẫn nhau, tổng các trạng thái khớp 100% với tổng lượt bài giao.
  - `getStudentsRequiringAttention`: Gắn cờ chính xác học viên vắng học hoặc trễ hạn.

### 5.2. Linter (Oxlint)
```bash
npx oxlint
```
* **Kết quả:** `0 errors` trên toàn bộ 403 files.

### 5.3. Production Build (Vite)
```bash
npm run build
```
* **Kết quả:** `✓ built in 1.01s`
* Bundle sinh ra sạch sẽ, không có lỗi phân giải module hay xung đột namespace.

### 5.4. Browser Runtime Verification (Chrome Headless CDP)
```bash
node scripts/browser_runtime_verify.js
```
* **Desktop (1440x900):** Sidebar mở rộng/thu gọn mượt mà, header sticky, không tràn ngang (`hasHorizontalOverflow: false`).
* **Tablet (768x1024):** Responsive tự động chuyển đổi sang Bottom Nav + Drawer.
* **Mobile (390x844):** 5-item bottom bar đạt chuẩn touch target tối thiểu $\ge 48\text{px}$, không che nội dung.
* **Smart Command Palette:** Tìm kiếm không dấu tiếng Việt hoạt động trơn tru.
* **Security Guard:** Anonymous và Student truy cập `#admin` hoặc `#teacher` bị chặn ngay lập tức. Client tampering `localStorage.role = 'admin'` bị vô hiệu hóa hoàn toàn.
* **Console Exception Count:** `0 errors`.

---

## 6. DANH MỤC TRẠNG THÁI NGHIỆM THU

- [x] **IMPLEMENTATION COMPLETE**
- [x] **TESTS PASSED (68/68)**
- [x] **BUILD VERIFIED (1.01s)**
- [x] **BROWSER RUNTIME VERIFIED (CDP Engine - 0 Exceptions)**
- [x] **SECURITY VERIFICATION VERIFIED (Role Isolation & Cross-Class Guard)**
- [ ] **PRODUCTION VERIFICATION PARTIAL (Chờ triển khai Vercel và dữ liệu thực tế môi trường production)**

---

*Báo cáo được khởi tạo tự động và lưu trữ tại `docs/PHASE_25_TASK_UI_03_ADMIN_TEACHER_DASHBOARD_ANALYTICS_REPORT.md`.*

