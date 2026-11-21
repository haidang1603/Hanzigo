# PHASE 39 — TASK 39.02: PAGE-BY-PAGE RESPONSIVE AUDIT & MOBILE UX OPTIMIZATION REPORT

- **Repository:** `https://github.com/haidang1603/Hanzigo.git`
- **Production URL:** `https://hanzigo-xi.vercel.app`
- **Ngày kiểm toán Đợt 1:** `2026-11-21`
- **Phạm vi đợt hiện tại:** **Đợt 6 — Regression & Final Report (Hoàn tất toàn bộ 6 đợt `TASK 39.02`)**
- **Giới hạn môi trường kiểm thử trình duyệt:** Đã chạy kiểm thử trực tiếp trên **Chrome DevTools Emulation (`http://localhost:5173`)** qua `browser` subagent cho **8 route công khai/học tập cốt lõi** (`#home`, `#roadmap`, `#lesson`, `#vocabulary`, `#writing`, `#hsk`, `#community`, `#materials`) trên 5 mốc viewport (`320×568`, `360×800`, `390×844`, `768×1024`, `1440×900`) bằng `emulate`, `take_screenshot`, `take_snapshot`, `get_css_styles`, `click`, `list_console_messages`. Các route cần đăng nhập (`#dashboard`, `#intelligence`, `#classroom`, `#teacher`, `#admin`, `#profile`) và thiết bị iOS Safari thật vẫn được đánh dấu trung thực **`[NOT VERIFIED — AUTH REQUIRED / NOT VISITED]`** và **`[SAFARI NOT VERIFIED — EMULATION ONLY]`**.

---

## A. Route Inventory (Source-of-Truth từ `src/App.jsx`)+

Tổng cộng **`32` tabs hợp lệ** trong `VALID_TABS` (`src/App.jsx:67-74`), **1 full-screen live route** (`src/App.jsx:372-389`), và **8 thành phần layout/overlay toàn cục** (`src/App.jsx:396-806`).

### A.1. Public, Auth & Legal Routes

| # | Route / Hash | Component chính | Sub-views / Modes | Quyền truy cập |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `#home` | `UnifiedDashboard` → `HomePage` (khách) / `DashboardPage` (học viên) / `TeacherDashboardPage` (GV) | Guest 3-tier Showcase (`vocab`, `phrases`, `radicals`), Sandbox (`quiz`, `hanviet`), Explore Tabs (`lessons`, `faq`, `explore`) | Public / Role-adaptive |
| 2 | `#reset-password` (`/reset-password`, `/reset`) | `ResetPasswordPage.jsx` | Form đặt lại mật khẩu mới | Public (Recovery flow) |
| 3 | `#privacy` (`/privacy-policy`) | `PrivacyPolicyPage.jsx` | Tài liệu + bảng dữ liệu | Public |
| 4 | `#terms` (`/terms-of-service`) | `TermsOfServicePage.jsx` | Điều khoản sử dụng | Public |
| 5 | `#cookies` (`/cookie-policy`) | `CookiePolicyPage.jsx` | Chính sách cookie + bảng | Public |
| 6 | `#refund` (`/refund-policy`) | `RefundPolicyPage.jsx` | Chính sách hoàn tiền | Public |
| 7 | `#storage-preferences` (`/tuy-chon-luu-tru`) | `StoragePreferencesPage.jsx` | Quản lý tùy chọn lưu trữ cục bộ | Public |

### A.2. Student Learning & Practice Routes

| # | Route / Hash | Component chính | Sub-views / Modes | Quyền truy cập |
| :--- | :--- | :--- | :--- | :--- |
| 8 | `#dashboard` | `DashboardPage.jsx` + `DashboardDeepAnalyticsTabs.jsx` | 3-tier Hero/KPI, Workspace (`daily_loop`, `ai_coach`), Deep Tabs (`readiness`, `telemetry`, `community`) | Student / Authenticated |
| 9 | `#intelligence` | `LearningIntelligenceHub.tsx` | 5 sub-tabs: `smart_plan`, `analytics`, `srs_retention`, `writing_lab`, `hsk7_9_cbt` | Student / Authenticated |
| 10 | `#roadmap` | `RoadmapPage.jsx` | Bản đồ 180 bài HSK 1–9, bộ lọc tìm kiếm, Modal xếp lớp / chi tiết | Public / Student |
| 11 | `#lesson` (`/lesson?id=...`) | `LessonPage.jsx` | 5–6 tabs sư phạm (Hội thoại, Từ vựng, Chữ Hán + `HanziWriter`, Ngữ pháp, Trắc nghiệm) | Public / Student |
| 12 | `#vocabulary` | `VocabularyPage.jsx` | 6 chế độ: `flashcard`, `grid`, `quiz`, `dictionary`, `workspace`, `chengyu` + 2 Modals (`Chi tiết từ`, `Thêm từ cá nhân`) | Public / Student |
| 13 | `#pronunciation` | `PronunciationPage.jsx` | `record` (AI Speaking Lab), bảng Pinyin/thanh điệu, modal thêm câu luyện | Public / Student |
| 14 | `#writing` (alias `#dictionary`) | `WritingPage.jsx` + `HanziWritingStudio.tsx` + `HanziCanvasStage.tsx` + `SmartSearchBar.tsx` | Tra cứu từ điển, vẽ tay nhận diện chữ, luyện viết Mễ Tự Cách & in A4 | Public / Student |
| 15 | `#reader` | `ReaderPage.jsx` | `graded` (Đọc phân cấp), tách từ NLP, dán văn bản phân tích | Public / Student |
| 16 | `#conversation` | `ConversationPage.jsx` | `roleplay` (Hội thoại AI đóng vai), chọn tình huống & chat | Public / Student |
| 17 | `#practice`, `#grammar`, `#listening`, `#listening-studio`, `#video`, `#video-studio`, `#hsk30-translation` | `PracticePage.jsx` | 7 sub-skills: `overview`, `grammar`, `listening`, `listening-studio`, `video-studio`, `hsk30-translation` | Public / Student |
| 18 | `#hsk` (alias `#hsk-practice`, `#exam-center`) | `HskPracticePage.jsx` + `Hsk6TwoPhaseSummarySimulator.tsx` + `Hsk7to9IntegratedExamSimulator.jsx` | 11 sub-routes: `home`, `exams`, `exam/:id`, `take/:id`, `result/:id`, `history`, `mistakes`, `analytics`, `resources`, `structure`, `hsk6_simulator`, `hsk7_9_simulator`, `hskk_simulator` | Public / Student |
| 19 | `#classroom` | `ClassroomPage.jsx` | `list`, `join`, `:classId`, `:classId/assignments` + modal nộp bài | Authenticated |
| 20 | `#classroom/:classId/live/:sessionId` | `LiveClassroomPage.jsx` + `LiveHanziWhiteboardStage.jsx` + `WhiteboardBoard.jsx` + `HanziStrokeOrderBoard.jsx` | Full-screen LiveKit video/audio, bảng trắng tương tác, chat lớp học | Authenticated |
| 21 | `#community`, `#leaderboard` | `CommunityPage.jsx` + `LeaderboardView.jsx` | 4 sub-views: `feed`, `leaderboard`, `partners`, `challenge` + modal đăng bài / báo cáo | Public / Student |
| 22 | `#materials` | `MaterialsPage.jsx` | Kho giáo trình PDF/MP3, bộ lọc nâng cao + 3 modals xem/tạo/chỉnh sửa học liệu | Public / Student / Admin |
| 23 | `#profile` | `ProfilePage.jsx` | Hồ sơ, đổi mật khẩu, cài đặt, phòng truyền thống huy hiệu | Authenticated |

### A.3. Teacher & Admin Portals

| # | Route / Hash | Component chính | Sub-views / Modes | Quyền truy cập |
| :--- | :--- | :--- | :--- | :--- |
| 24 | `#teacher` | `TeacherGuard` → `TeacherDashboardPage.jsx` | 6 sub-routes: `dashboard`, `classes`, `classes/:id`, `students`, `grading`, `analytics`, `ai-studio` + 4 bảng dữ liệu + `CreateHskAssignmentModal` | Teacher / Admin |
| 25 | `#admin` | `AdminGuard` → `AdminPage.jsx` + `CommunityModerationDashboard.jsx` + `HskBulkImporterPanel.tsx` | Quản lý người dùng (bảng), học liệu, đề thi HSK, kiểm duyệt cộng đồng, tạo tài khoản | Admin only |

### A.4. Global Layout, Navigation & Overlays (`src/App.jsx`)

| # | Component | Vị trí | Chức năng |
| :--- | :--- | :--- | :--- |
| G1 | `AppSidebar.jsx` | `src/components/navigation/AppSidebar.jsx` | Sidebar Desktop (`hidden lg:flex`, collapsible) |
| G2 | `AppHeader.jsx` | `src/components/navigation/AppHeader.jsx` | Sticky Header (`h-16 sm:h-20`), hamburger mobile, search, gamification |
| G3 | `MobileNavigation.jsx` | `src/components/navigation/MobileNavigation.jsx` | Mobile Drawer (`< lg`) + Fixed Bottom Navigation Bar (`env(safe-area-inset-bottom)`) |
| G4 | `SmartCommandPalette.jsx` | `src/components/navigation/SmartCommandPalette.jsx` | Global Search Modal (`Ctrl+K`) |
| G5 | `AuthModal.jsx` | `src/components/AuthModal.jsx` | Modal Đăng nhập / Đăng ký / Quên mật khẩu |
| G6 | `UniversalSlideOverDrawer.tsx` | `src/features/unified-ecosystem/UniversalSlideOverDrawer.tsx` | Ngăn công cụ Từ điển / Ngữ pháp / Luyện viết / Phát âm |
| G7 | `CookieStorageConsentBanner.jsx` | `src/components/legal/CookieStorageConsentBanner.jsx` | Banner đồng ý lưu trữ |
| G8 | `Footer.jsx` | `src/components/Footer.jsx` | Footer toàn cục + ô đăng ký nhận bản tin |

---

## B. Page-by-Page Baseline Audit (Static Code Inspection — Đợt 1)

> **Ghi chú:** Các hạng mục đã tối ưu trước đó (Phase 38.08 / Mobile Quick Pass & Dashboard/HomePage 3-tier Reorganization) đã giải quyết `overflow-x-clip` ở `App.jsx`, lưới `稿纸` responsive (`grid-cols-10 sm:grid-cols-15 lg:grid-cols-20`), `touch-none overscroll-contain` trên toàn bộ 9 canvas viết Hán tự/bảng trắng, `AudioButton` `44×44px`, và `dvh` trên `LiveClassroomPage` & `UniversalSlideOverDrawer`. Bảng dưới đây ghi nhận **toàn bộ tồn đọng thực tế còn lại** có `file:line`.

### B.1. Shared Navigation, Layout & Global Modals (Sẽ xử lý ở Đợt 2)
- **`src/App.jsx:431`**: `<main>` dùng `min-h-[70vh]` thay vì `min-h-[70dvh]`.
- **`src/components/navigation/AppHeader.jsx:91`**: Nút Hamburger mobile `p-2` (~36×36px), chưa đạt chuẩn vùng chạm tối thiểu `44×44px` (`min-w-[44px] min-h-[44px]`).
- **`src/components/navigation/MobileNavigation.jsx:336,356`**:
  - Nút Đăng xuất trong Drawer (`L356`) dùng `p-1.5` (~28×28px < `44×44px`).
  - Footer của Drawer (`L336`) chưa có `pb-[max(0.75rem,env(safe-area-inset-bottom))]` khi mở trên thiết bị có thanh Home Indicator (iOS).
- **`src/components/navigation/AppSidebar.jsx:388`**: Dùng `h-screen` thay vì `h-[100dvh]`.
- **`src/components/navigation/SmartCommandPalette.jsx:288`**: Modal dùng `max-h-[...vh]` thay vì `dvh`.
- **`src/components/AuthModal.jsx:397,503,520,552,567`**: 5 ô `<input>` / `<select>` dùng `text-sm`/`text-xs` (không có `text-base`), sẽ gây **iOS Safari auto-zoom** ngay khi khách bấm đăng nhập/đăng ký trên iPhone.
- **`src/components/Footer.jsx:389`**: Ô `<input>` nhận bản tin dùng font `< 16px` (`text-xs`/`text-sm`).

### B.2. Public & Legal Pages
- **`src/pages/HomePage.jsx`**: Đã tái cấu trúc 3 tầng Action-First, touch targets `>= 44px`, không còn `60 bài` cũ. Không có lỗi High/Critical mới.
- **`src/pages/ResetPasswordPage.jsx:165,281,324`**: Container dùng `min-h-[80vh]` (`L165`), 2 ô nhập mật khẩu (`L281, L324`) chưa có `text-base`.
- **`src/pages/PrivacyPolicyPage.jsx:348`, `CookiePolicyPage.jsx:195`, `TermsOfServicePage.jsx`, `RefundPolicyPage.jsx`, `StoragePreferencesPage.jsx`**: Bảng đã bọc `overflow-x-auto`. Không có lỗi High/Critical.

### B.3. Student Learning Pages (Sẽ xử lý ở Đợt 3)
- **`src/pages/DashboardPage.jsx` & `DashboardDeepAnalyticsTabs.jsx`**: Đã tái cấu trúc 3 tầng gọn gàng (`45.86 KB` raw). Không có lỗi High/Critical.
- **`src/features/intelligence/LearningIntelligenceHub.tsx:112`**: Wrapper dùng `min-h-screen` thay vì `min-h-[100dvh]`.
- **`src/pages/RoadmapPage.jsx:551,577,1128,1137,1406,1416`**: 2 container dùng `min-h-[80vh]`/`min-h-screen`; 4 ô `<input>`/`<select>` (`L1128, L1137, L1406, L1416`) chưa có `text-base`.
- **`src/pages/LessonPage.jsx:565,601`**: Container dùng `min-h-screen` (`L565`); `<select>` chọn bài (`L601`) chưa có `text-base`. Canvas viết chữ (`L977`) đã có `touch-none overscroll-contain`.
- **`src/pages/VocabularyPage.jsx:2050,3248..3430`**: Ô tìm kiếm từ điển CC-CEDICT (`L2050`) và 12 ô form trong Modal "Thêm từ vựng cá nhân" (`L3248–L3430`) chưa có `text-base` (gây iOS Safari auto-zoom khi gõ Pinyin/Hán tự).
- **`src/features/srs/SrsRetentionDashboard.tsx:183,544`**: 2 ô `<select>`/`<input>` lọc và ghi chú mnemonic chưa có `text-base`.
- **`src/pages/PronunciationPage.jsx:839,1985,1999,2014,2031`**: 5 ô `<input>`/`<select>` (tìm kiếm & modal thêm câu luyện) chưa có `text-base`.
- **`src/pages/WritingPage.jsx:257` & `src/features/writing-studio/HanziWritingStudio.tsx:124` & `HanziCanvasStage.tsx:392,403`**:
  - 4 ô `<input>`/`<select>` nhập chữ Hán & chọn chế độ viết chưa có `text-base`.
  - Canvas `HanziCanvasStage.tsx:287` đã có `touch-none overscroll-contain`, nhưng kích thước `w-[320px] h-[320px]` cần bổ sung `max-w-full` để an toàn tuyệt đối ở viewport `320×568` (khi có padding `px-3`).
- **`src/pages/ReaderPage.jsx:693`**: `<textarea>` dán văn bản tiếng Trung để phân tích NLP chưa có `text-base`.
- **`src/pages/ConversationPage.jsx:830,1081`**: `<select>` chọn tình huống (`L830`) và `<input>` chat với Lão Sư AI (`L1081`) chưa có `text-base` (ảnh hưởng trực tiếp thao tác gõ tiếng Trung IME trên iOS).
- **`src/pages/ProfilePage.jsx:792,806,821,835,1155`**: 5 ô `<input>`/`<select>`/`<textarea>` trong hồ sơ & đổi mật khẩu chưa có `text-base`.

### B.4. Complex Interactive Pages (Sẽ xử lý ở Đợt 4)
- **`src/pages/HskPracticePage.jsx:358,380,665,1247,3545,3805,3815,3827`**:
  - Modal chi tiết lịch sử/kết quả (`L3545`) vẫn dùng `max-h-[90vh]` thay vì `max-h-[90dvh] pb-[max(1.5rem,env(safe-area-inset-bottom))]`.
  - 5 ô `<input>`/`<select>` lọc đề thi & sổ lỗi sai (`L665, L1247, L3805, L3815, L3827`) chưa có `text-base`.
  - 2 wrapper loading/page (`L358, L380`) dùng `min-h-screen`.
- **`src/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator.jsx:441`**: Wrapper dùng `min-h-screen` (lưới `稿纸`, sticky header và 4 `<textarea>` đã chuẩn hóa ở đợt trước).
- **`src/pages/LiveClassroomPage.jsx:937,949,1612` & `src/features/classroom/live/LiveHanziWhiteboardStage.jsx:619,626`**:
  - Ô chat trực tiếp trong phòng học (`LiveClassroomPage.jsx:1612`) và 2 ô nhập chữ trên bảng trắng (`LiveHanziWhiteboardStage.jsx:619,626`) chưa có `text-base`.
  - 2 màn hình chờ/lỗi (`L937, L949`) dùng `min-h-screen` thay vì `min-h-[100dvh]`.
- **`src/pages/ClassroomPage.jsx:578,894,1511,1592`**:
  - Modal nộp bài tập (`L1511`) dùng `max-h-[90vh]`, chưa có `dvh` & safe-area bottom.
  - Ô nhập mã lớp (`L894`) và `<textarea>` nộp bài (`L1592`) chưa có `text-base`.
- **`src/pages/CommunityPage.jsx:1484..2654,2529,2903`**:
  - Modal tạo bài/báo cáo (`L2529`) dùng `max-h-[90vh]`, ảnh preview (`L2903`) dùng `max-h-[70vh]`.
  - 15 ô `<input>`/`<textarea>`/`<select>` (tìm kiếm, đăng bài, bình luận, tìm bạn học) chưa có `text-base`.
- **`src/pages/MaterialsPage.jsx:1466..3093,2093,2611,2722`**:
  - 3 modals (`L2093, L2611, L2722`) dùng `max-h-[90vh]` thay vì `max-h-[90dvh]`.
  - 27 ô `<input>`/`<textarea>`/`<select>` (tìm kiếm, lọc, thêm/sửa học liệu) chưa có `text-base`.

### B.5. Teacher & Admin Portals (Sẽ xử lý ở Đợt 5)
- **`src/pages/TeacherDashboardPage.jsx:682,1195,1276,1417,1426,1519,1818,2210`** & **`CreateHskAssignmentModal.jsx:141,192,209,223,236`** & **`ClassMistakeHeatmapPanel.jsx:123`**:
  - 4 bảng dữ liệu (`L1195, L1519, L1818, L2210`) đã có `overflow-x-auto`, cần rà soát `min-w` & padding trên mobile `320–390px`.
  - 9 ô `<input>`/`<textarea>`/`<select>` chưa có `text-base`.
  - Wrapper (`L682`) dùng `min-h-screen`.
- **`src/pages/AdminPage.jsx:1069..2778,1450,2464`** & **`HskBulkImporterPanel.tsx:60`**:
  - Modal quản trị (`L2464`) dùng `max-h-[90vh]`.
  - 34 ô `<input>`/`<textarea>`/`<select>` chưa có `text-base`.
  - Bảng quản lý người dùng (`L1450`) cần đảm bảo thao tác mượt trên mobile `320–390px`.

---

## C. Issue Summary (Phân loại theo mức độ ưu tiên)

| Mức độ | Mã lỗi | Nhóm vấn đề | Số vị trí | Đợt xử lý dự kiến |
| :--- | :--- | :--- | :---: | :---: |
| **Critical** | `MOB-CRIT-01` | Nguy cơ tràn ngang tại `320×568` trên canvas `w-[320px]` (`HanziCanvasStage.tsx:287`) khi kết hợp padding container (`px-3`). | 1 | Đợt 3 |
| **High** | `MOB-HIGH-01` | **iOS Safari Auto-Zoom trên IME tiếng Trung & Form đăng nhập:** 131 ô `<input>`/`<textarea>`/`<select>` dùng `text-xs`/`text-sm` thay vì `text-base sm:text-sm` (tập trung nặng tại `AuthModal`, `ConversationPage`, `VocabularyPage` modal/dict, `LiveClassroomPage`, `CommunityPage`, `MaterialsPage`, `AdminPage`). | 131 | Đợt 2–5 |
| **High** | `MOB-HIGH-02` | **Touch Targets < 44×44px** trên điều hướng cốt lõi mobile: nút Hamburger `AppHeader.jsx:91` (~36px), nút Đăng xuất `MobileNavigation.jsx:356` (~28px). | 2+ | Đợt 2 |
| **Medium** | `MOB-MED-01` | **Viewport `vh` / `h-screen` cứng trên Modal & Trang:** 22 vị trí vẫn dùng `max-h-[90vh]` / `min-h-screen` / `h-screen` thay vì `dvh` + thiếu `env(safe-area-inset-bottom)` trên footer Drawer & 7 modals (`MaterialsPage`, `CommunityPage`, `ClassroomPage`, `HskPracticePage`, `AdminPage`, `SmartCommandPalette`, `MobileNavigation`). | 22 | Đợt 2–5 |
| **Low** | `MOB-LOW-01` | Bảng quản trị nhiều cột (`AdminPage`, `TeacherDashboardPage`) tuy đã bọc `overflow-x-auto` nhưng có thể tối ưu mật độ padding/scroll hint tốt hơn trên màn hình `320–390px`. | 5 bảng | Đợt 5 |

---

## D. Responsive Test Matrix (Route × Viewport — Final + Live Chrome Visual Verification)

> **Chú thích:** 8 route công khai/học tập cốt lõi đã được kiểm chứng trực tiếp trên Chrome (`localhost:5173`) bằng `emulate` + `take_screenshot` + `get_css_styles` (chú ý `evaluate_script` bị chặn bởi policy, nên đo bằng ảnh chụp & CSS thực tế). Các route yêu cầu đăng nhập giữ nhãn `[NOT VERIFIED — AUTH REQUIRED]`; iOS Safari thật giữ nhãn `[SAFARI NOT VERIFIED — EMULATION ONLY]`.

| Route | Static Audit (Final) | `320×568` | `360×800` | `390×844` | `768×1024` | `1440×900` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `#home` (Guest) | PASS (3-tier) | **PASS** (Chrome Visual) | **PASS** (44px btn + Drawer) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) |
| `#dashboard` (Student) | PASS (3-tier) | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` |
| `#intelligence` | PASS (Static — Đợt 3) | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` |
| `#roadmap` | PASS (Static — Đợt 3) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) |
| `#lesson` | PASS (Static + Fixed Runtime) | **PASS** (Fixed & Re-verified) | **PASS** (Fixed & Re-verified) | **PASS** (Fixed & Re-verified) | **PASS** (Scrollbar Fixed) | **PASS** (Chrome Visual) |
| `#vocabulary` (6 modes) | PASS (Static — Đợt 3) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) |
| `#pronunciation` | PASS (Static — Đợt 3) | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` |
| `#writing` / `#dictionary` | PASS (Static — Đợt 3) | **PASS** (Canvas fits 320px) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) |
| `#reader` | PASS (Static — Đợt 3) | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` |
| `#conversation` | PASS (Static — Đợt 3) | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` |
| `#practice` / `#grammar` / `#listening*` / `#video*` / `#hsk30-translation` | PASS (Static) | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` |
| `#hsk` (HSK 1–9, HSKK) | PASS (Static — Đợt 4) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) |
| `#classroom` | PASS (Static — Đợt 4) | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` |
| `#classroom/:id/live/:sid` | PASS (Static — Đợt 4) | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` |
| `#community` / `#leaderboard` | PASS (Static — Đợt 4) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) |
| `#materials` | PASS (Static — Đợt 4) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) | **PASS** (Chrome Visual) |
| `#profile` | PASS (Static — Đợt 3) | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` |
| `#teacher` (6 sub-routes) | PASS (Static — Đợt 5) | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` |
| `#admin` | PASS (Static — Đợt 5) | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` | `[NOT VERIFIED — AUTH REQUIRED]` |
| `#reset-password` | PASS (Static — Đợt 2) | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` |
| Legal (`#privacy`, `#terms`, `#cookies`, `#refund`, `#storage-preferences`) | PASS (tables wrapped) | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` | `[NOT VERIFIED — NOT VISITED]` |

---

## E. Files Changed

### Đợt 1 (Audit-Only)
- Tạo báo cáo `docs/PHASE_39_TASK_39_02_RESPONSIVE_MOBILE_UX_REPORT.md`.

### Đợt 2 — Mobile Navigation, Shared Layout & Auth (8 files)
1. `src/components/navigation/AppHeader.jsx` (`L91`): Nâng nút Hamburger mobile lên `min-w-11 min-h-11 flex items-center justify-center` (`>= 44×44px`).
2. `src/components/navigation/MobileNavigation.jsx` (`L336-L374`): Thêm `pb-[max(0.75rem,env(safe-area-inset-bottom))]` cho Drawer footer, nâng nút Đăng xuất (`min-w-11 min-h-11`), vùng chạm hồ sơ & nút đăng nhập (`min-h-11`).
3. `src/App.jsx` (`L431`): Thay `min-h-[70vh]` → `min-h-[70dvh]`.
4. `src/components/navigation/AppSidebar.jsx` (`L388`): Thay `h-screen` → `h-dvh`.
5. `src/components/navigation/SmartCommandPalette.jsx` (`L288, L304`): Thay `max-h-[80vh]` → `max-h-[80dvh]` và chuẩn hóa ô tìm kiếm sang `text-base` chống iOS Safari auto-zoom.
6. `src/components/AuthModal.jsx` (`L403, L508, L525, L557, L570`): Chuyển 5 ô `<input>`/`<select>` sang `text-base sm:text-sm`.
7. `src/components/Footer.jsx` (`L399`): Chuyển ô nhập email nhận bản tin sang `text-base sm:text-sm`.
8. `src/pages/ResetPasswordPage.jsx` (`L165, L287, L330`): Chuyển `min-h-[80vh]` → `min-h-[80dvh]` và 2 ô nhập mật khẩu sang `text-base sm:text-sm`.

### Đợt 3 — Student Learning Pages (12 files)
1. `src/features/writing-studio/HanziCanvasStage.tsx` (`L287, L396, L407`): Đóng **`MOB-CRIT-01`** bằng `w-full max-w-[320px] aspect-square sm:w-[360px] sm:max-w-[360px] sm:h-[360px] lg:w-[400px] lg:max-w-[400px] lg:h-[400px]` (giữ nguyên `touch-none overscroll-contain`, không tràn ở `320×568`); chuyển 2 `<select>` sang `text-base sm:text-sm`.
2. `src/features/writing-studio/HanziWritingStudio.tsx` (`L129`): Chuyển `<input>` nạp hàng đợi chữ Hán sang `text-base sm:text-sm`.
3. `src/features/intelligence/LearningIntelligenceHub.tsx` (`L112`): Chuyển `min-h-screen` → `min-h-dvh`.
4. `src/features/srs/SrsRetentionDashboard.tsx` (`L190, L554`): Chuyển `<select>` lọc HSK & `<input>` ghi chú mnemonic sang `text-base sm:text-sm`.
5. `src/pages/WritingPage.jsx` (`L262`): Chuyển `<input>` tìm chữ Hán sang `text-base sm:text-sm`.
6. `src/pages/ReaderPage.jsx` (`L698`): Chuyển `<textarea>` dán văn bản NLP sang `text-base sm:text-sm`.
7. `src/pages/ConversationPage.jsx` (`L833, L1086`): Chuyển `<select>` trình độ HSK & `<input>` chat với Lão Sư AI sang `text-base sm:text-sm`.
8. `src/pages/LessonPage.jsx` (`L565, L604`): Chuyển `min-h-screen` → `min-h-dvh` và `<select>` chọn bài sang `text-base sm:text-sm`.
9. `src/pages/RoadmapPage.jsx` (`L551, L577, L1133, L1140, L1411, L1419`): Chuyển `min-h-[80vh]`/`min-h-screen` → `min-h-[80dvh]`/`min-h-dvh` và 4 ô `<input>`/`<select>` sang `text-base sm:text-sm`.
10. `src/pages/VocabularyPage.jsx` (`L2058, L3291-L3439`): Chuyển ô tìm kiếm từ điển CC-CEDICT và 11 ô form (`text-xs` → `text-base sm:text-sm`) trong Modal Thêm từ cá nhân (ô chữ Hán đã dùng `text-lg`, 2 modal đã dùng `max-h-[90dvh]`).
11. `src/pages/PronunciationPage.jsx` (`L844, L1990, L2004, L2017, L2036`): Chuyển 5 ô `<input>`/`<select>` sang `text-base sm:text-sm`.
12. `src/pages/ProfilePage.jsx` (`L797, L809, L826, L839, L1159`): Chuyển 5 ô `<input>`/`<select>`/`<textarea>` sang `text-base sm:text-sm`.

### Đợt 4 — Complex Interactive Pages (7 files)
1. `src/pages/HskPracticePage.jsx` (`L358, L380, L668, L1252, L3545, L3810-L3830`): Chuyển 2 wrapper `min-h-screen` → `min-h-dvh`; Modal `AttemptComparisonModal` (`L3545`) chuyển `max-h-[90vh]` → `max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))]`; chuyển 5 ô `<input>`/`<select>` sang `text-base sm:text-sm`.
2. `src/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator.jsx` (`L441`): Chuyển wrapper `min-h-screen` → `min-h-dvh`.
3. `src/pages/LiveClassroomPage.jsx` (`L937, L949, L1617`): Chuyển 2 màn hình chờ/lỗi `min-h-screen` → `min-h-dvh`; chuyển ô chat phòng học sang `text-base sm:text-sm`.
4. `src/features/classroom/live/LiveHanziWhiteboardStage.jsx` (`L624, L631`): Chuyển 2 ô nhập chữ/nghĩa trên bảng trắng sang `text-base sm:text-sm` (giữ nguyên `touch-none overscroll-contain`).
5. `src/pages/ClassroomPage.jsx` (`L578, L899, L1511, L1597`): Chuyển `min-h-screen` → `min-h-dvh`, Modal nộp bài (`L1511`) → `max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))]`, ô tìm kiếm lớp & `<textarea>` nộp bài → `text-base sm:text-sm`.
6. `src/pages/CommunityPage.jsx`: Chuyển Modal (`L2529`) sang `max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))]`, ảnh preview (`L2903`) sang `max-h-[70dvh]`, và toàn bộ 17 ô `<input>`/`<textarea>`/`<select>` sang `text-base sm:text-sm`.
7. `src/pages/MaterialsPage.jsx`: Chuyển 3 modals (`L2093, L2611, L2722`) sang `max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))]` và toàn bộ 27 ô `<input>`/`<textarea>`/`<select>` sang `text-base sm:text-sm`.

### Đợt 5 — Teacher & Admin Portals (5 files)
1. `src/pages/TeacherDashboardPage.jsx` (`L682, L1194, L1276, L1417, L1426, L1518, L1817, L2209`): Chuyển `min-h-screen` → `min-h-dvh`; chuyển 3 ô `<input>`/`<select>` sang `text-base sm:text-sm`; bổ sung `max-w-full` cho 4 wrapper bảng `overflow-x-auto` để không bao giờ đẩy rộng container cha trên mobile `320–390px`.
2. `src/features/classroom/assignments/CreateHskAssignmentModal.jsx` (`L114-L241`): Bổ sung `max-h-[90dvh] overflow-y-auto pb-[max(0.75rem,env(safe-area-inset-bottom))]` cho modal, nâng nút đóng lên `min-w-11 min-h-11`, và chuyển 5 ô `<select>`/`<input>`/`<textarea>` sang `text-base sm:text-sm`.
3. `src/features/classroom/assignments/ClassMistakeHeatmapPanel.jsx` (`L126`): Chuyển `<select>` chọn bài tập sang `text-base sm:text-sm`.
4. `src/pages/AdminPage.jsx` (`L1069..2778, L1449, L2464`): Chuyển Modal quản trị (`L2464`) từ `max-h-[90vh]` → `max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))]`; bổ sung `max-w-full` cho wrapper bảng người dùng `overflow-x-auto` (`L1449`); chuyển toàn bộ 33 ô `<input>`/`<textarea>`/`<select>` sang `text-base sm:text-sm` (ô `L2622` đã dùng `text-lg`).
5. `src/features/hsk-exam/admin-importer/HskBulkImporterPanel.tsx` (`L64`): Chuyển `<textarea>` dán JSON đề thi sang `text-base sm:text-sm`.

**Tổng kết đóng lỗi ở mức Static Audit (Sau Đợt 2 + 3 + 4 + 5 — Tổng `32` files):**
- **`MOB-CRIT-01`** (Canvas `320px` overflow): **Đóng `100%`** (`1/1`).
- **`MOB-HIGH-02`** (Touch targets điều hướng cốt lõi): **Đóng `100%`** (`2/2`, cộng thêm nút đóng `CreateHskAssignmentModal`).
- **`MOB-HIGH-01`** (iOS Safari auto-zoom `< 16px` trên `<input>`/`<textarea>`/`<select>`): **Đóng `100%`** (Đợt 5 đóng nốt `43` vị trí cuối cùng; không còn ô nhập liệu `< 16px` nào trên toàn bộ routes).
- **`MOB-MED-01`** (Viewport `dvh` & safe-area): **Đóng `100%`** (Đợt 5 đóng nốt `3` vị trí cuối cùng ở `TeacherDashboardPage`, `AdminPage`, `CreateHskAssignmentModal`).
- **`MOB-LOW-01`** (Bảng dữ liệu quản trị nhiều cột): **Đóng `100%`** (`5/5` bảng trên `TeacherDashboardPage` & `AdminPage` bọc `overflow-x-auto max-w-full`).

### Đợt 6 — Regression Tests & Final Report (2 files)
1. `tests/mobileResponsiveAudit.test.js` (đã đăng ký trong `npm test` tại `package.json`): Mở rộng lên **12 test hồi quy tự động** (thêm tests #9–#12), khóa chặt:
   - `MOB-CRIT-01`: `HanziCanvasStage.tsx` dùng `w-full max-w-[320px] aspect-square` và `touch-none overscroll-contain`.
   - `MOB-HIGH-02`: `AppHeader.jsx`, `MobileNavigation.jsx`, `CreateHskAssignmentModal.jsx` giữ `min-w-11 min-h-11` (`>= 44×44px`) và safe-area bottom.
   - `MOB-HIGH-01`: Quét tĩnh toàn bộ `26` files đã chuẩn hóa ở Đợt 2–5, đảm bảo **0** `<input>`/`<textarea>`/`<select>` bị hồi quy về `< 16px`.
   - `MOB-MED-01` & `MOB-LOW-01`: Đảm bảo **0** `max-h-[90vh]` / `min-h-screen` / `h-screen` hồi quy trên các modal/layout trọng yếu và đủ `5/5` bảng dữ liệu trong `TeacherDashboardPage.jsx` + `AdminPage.jsx` bọc `overflow-x-auto max-w-full`.
2. `docs/PHASE_39_TASK_39_02_RESPONSIVE_MOBILE_UX_REPORT.md`: Chốt báo cáo cuối cùng 8 mục cho toàn bộ Task 39.02.

### Bổ sung sau Live Chrome Browser Verification (2 files)
1. `src/pages/LessonPage.jsx` (`L590-L626`): Sửa lỗi cắt cạnh phải trên thanh chọn bài ở `320px/360px/390px` (chuyển `<select>` full-width ở hàng 1 `order-first sm:order-none w-full sm:w-auto min-w-0` và 2 nút `Bài #N-1` / `Bài #N+1` nằm gọn hàng 2; desktop giữ nguyên 1 hàng). Đã re-verify **PASS** trên Chrome thực tế.
2. `src/components/navigation/Breadcrumbs.jsx` (`L132`): Bổ sung `scrollbar-none` loại bỏ thanh cuộn ngang hiển thị dưới breadcrumb ở `768×1024`. Đã re-verify **PASS** trên Chrome thực tế.

---

## F. Regression Results (Final — Sau Live Chrome Verification)
- `npm run lint`: **PASS** — `0` errors
- `npm test`: **PASS** — `1174 / 1174` pass (`0` fail, `0` skipped; gồm `12/12` trong `tests/mobileResponsiveAudit.test.js`)
- `npm run audit:curriculum`: **PASS** — **`100 / 100`** (toàn bộ 4 trụ cột giáo trình HSK 1–9, 180 bài học)
- `npm run build:verify`: **PASS** — `TOTAL CSS`: `385.28 KB` (**`43.51 KB` gzip `<= 45 KB`**); Chunk Isolation Assertion: **PASS**
- **Live Chrome Visual Verification (`http://localhost:5173`):** **8/8 routes công khai/học tập cốt lõi PASS** (`#home`, `#roadmap`, `#lesson`, `#vocabulary`, `#writing`, `#hsk`, `#community`, `#materials`) trên đủ 5 mốc viewport (`320×568`, `360×800`, `390×844`, `768×1024`, `1440×900`), **0 uncaught JS exceptions**; xác nhận nút Hamburger `44×44px` + Drawer trên `360×800` và Canvas viết chữ Hán vừa vặn `320×568`.
- **Routes cần đăng nhập & iOS Safari thật:** **`[AUTH ROUTES NOT VISITED IN GUEST SESSION]`** | **`[SAFARI NOT VERIFIED — EMULATION ONLY]`**

---

## G. Remaining Issues & Manual Verification Checklist (Cho thiết bị thật)
Ở mức kiểm toán tĩnh, bộ test tự động và kiểm thử Chrome trực tiếp 8 route công khai, **100% lỗi đã kiểm kê + 2 lỗi runtime phát hiện trực tiếp (`LessonPage` selector & `Breadcrumbs` scrollbar) đã được đóng**. Các mục cần kiểm tra bổ sung trực tiếp trên thiết bị thật:
1. **Routes cần đăng nhập (`#dashboard`, `#intelligence`, `#classroom`, `#teacher`, `#admin`, `#profile`):** Kiểm tra trực tiếp bằng tài khoản Student / Teacher / Admin trên mobile `360×800` & `390×844`.
2. **Kiểm tra iOS Safari thật (iPhone):** Chạm vào ô đăng nhập (`AuthModal`), ô tìm kiếm (`VocabularyPage`, `SmartSearchBar`), ô chat AI (`ConversationPage`) và ô viết luận (`Hsk7to9IntegratedExamSimulator`) với bàn phím Pinyin IME để xác nhận **không auto-zoom** và không bị Home Indicator che khuất.
3. **Kiểm tra chế độ ngang (Landscape) & cảm ứng:** Viết thử chữ Hán trên `HanziCanvasStage` / `LessonPage` / `LiveHanziWhiteboardStage` và kiểm tra lưới `稿纸` trên màn hình ngang/dọc.

---

## H. Final Status
- **`AUDIT COMPLETE`**
- **`IMPLEMENTATION COMPLETE`**
- **`STATIC RESPONSIVE TESTS PASSED`** (`12/12` trong `tests/mobileResponsiveAudit.test.js`, `1174/1174` toàn dự án)
- **`BUILD VERIFIED`** (`npm run build:verify` PASS, `TOTAL CSS` = `43.51 KB` gzip `<= 45 KB`)
- **`CHROME EMULATION VERIFIED (8/8 PUBLIC & LEARNING ROUTES)`** | **`[SAFARI NOT VERIFIED — EMULATION ONLY]`**
