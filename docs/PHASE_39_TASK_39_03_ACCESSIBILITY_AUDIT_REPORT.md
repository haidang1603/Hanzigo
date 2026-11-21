# PHASE 39 — TASK 39.03: ACCESSIBILITY AUDIT REPORT (WCAG 2.2 AA)

- **Repository:** `https://github.com/haidang1603/Hanzigo.git`
- **Production URL:** `https://hanzigo-xi.vercel.app`
- **Ngày thực hiện:** `2026-11-21`
- **Chuẩn mục tiêu:** WCAG 2.2 Level AA (Perceivable, Operable, Understandable, Robust)
- **Phương pháp kiểm định:** Kiểm toán mã nguồn tĩnh (20 files layout/modal/page cốt lõi) + Kiểm thử trực tiếp **Chrome Accessibility Tree & Bàn phím (`Tab`/`Escape`)** trên `http://localhost:5173` + Bộ test hồi quy tự động `tests/accessibilityPhase39.test.js`.

---

## 1. Mục tiêu & Phạm vi Kiểm toán
Đánh giá và nâng cấp khả năng tiếp cận (Accessibility) của HanziGo theo 10 hạng mục WCAG 2.2 AA trên:
- **Layout & Overlays toàn cục:** `App.jsx`, `index.css`, `AppHeader.jsx`, `AppSidebar.jsx`, `MobileNavigation.jsx`, `SmartCommandPalette.jsx`, `AuthModal.jsx`, `UniversalSlideOverDrawer.tsx`, `AudioButton.jsx`, `Footer.jsx`.
- **Các trang cốt lõi:** `HomePage.jsx`, `DashboardPage.jsx`, `RoadmapPage.jsx`, `LessonPage.jsx`, `VocabularyPage.jsx`, `HskPracticePage.jsx`, `Hsk7to9IntegratedExamSimulator.jsx`, `LiveClassroomPage.jsx`, `TeacherDashboardPage.jsx`, `AdminPage.jsx`.

---

## 2. Kết quả Audit Hiện trạng (Trước khi sửa)
Quét tĩnh 20 files trọng yếu ghi nhận các lỗ hổng Accessibility ưu tiên sau:
1. **Thiếu Skip-to-Main-Content link (`WCAG 2.4.1`):** `src/App.jsx` chưa có liên kết bỏ qua thanh điều hướng và `<main>` chưa có `id="main-content"`.
2. **Focus Indicator bị ghi đè (`WCAG 2.4.7`):** Quy tắc `:focus-visible` trong `src/index.css` nằm trong `@layer base`, bị Tailwind `@layer utilities` (`focus:outline-none`) ghi đè trên hàng loạt `<input>` và `<button>`.
3. **Dialog & Drawer thiếu ngữ nghĩa/phím `Escape` (`WCAG 2.1.1 / 4.1.2`):**
   - `UniversalSlideOverDrawer.tsx` thiếu `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, thiếu `Escape` handler và nút loa thiếu `aria-label`.
   - `MobileNavigation.jsx` có `role="dialog"` nhưng thiếu xử lý phím `Escape` để đóng Drawer.
4. **Phần tử tương tác `<div onClick>` không thao tác được bằng bàn phím (`WCAG 2.1.1`):** Thẻ lật Flashcard (`VocabularyPage.jsx:2403`) và thẻ KPI Chuỗi ngày học (`DashboardPage.jsx:716`) thiếu `role="button"`, `tabIndex={0}`, `aria-label` và xử lý phím `Enter`/`Space`.
5. **Nhãn Screen Reader & Form (`WCAG 1.3.1 / 3.3.1 / 4.1.2`):**
   - `AudioButton.jsx` chỉ có `title`, thiếu `aria-label`, `aria-pressed` và `aria-hidden="true"` cho icon SVG.
   - `AuthModal.jsx` thiếu `role="alert"` cho thông báo lỗi, `role="status" aria-live="polite"` cho thông báo thành công và thiếu `htmlFor`/`id`/`name` liên kết trên 5 trường nhập liệu.
   - Các ô tìm kiếm/chọn cốt lõi (`Footer`, `SmartCommandPalette`, `VocabularyPage`, `LessonPage`) thiếu `id`/`aria-label`.

---

## 3. Chiến lược Khắc phục & Bảo toàn Ngân sách CSS
- **Ưu tiên giải pháp toàn cục chi phí thấp:** Đưa `:focus-visible` ra ngoài `@layer base` trong `src/index.css` với `!important` (bảo đảm viền focus nổi bật `#E85D3F` / `#F4B942` thắng mọi `focus:outline-none` trên toàn ứng dụng mà chỉ tốn vài chục byte CSS).
- **Giữ nguyên cấu trúc giao diện:** Không thay đổi bố cục Mobile/Desktop đã xác minh ở Task 39.02, không đổi logic nghiệp vụ hay API.

---

## 4. Chi tiết 10 Hạng mục WCAG 2.2 AA & Trạng thái Đánh giá

| # | Hạng mục WCAG 2.2 AA | Mức đạt | Bằng chứng & Ghi chú trung thực |
| :--- | :--- | :--- | :--- |
| 1 | **Semantic HTML & Landmarks** (`2.4.1`, `1.3.1`) | **Đạt (Static + Chrome A11y Tree)** | Verified `banner`, `navigation`, `main` (`#main-content`), `contentinfo` và Skip Link `"Bỏ qua đến nội dung chính"` trên Chrome `#home`. *(Ghi chú nhỏ: `#lesson` có `<main>` lồng nhau bên trong `<main>` chính — liệt kê ở Mục 11).* |
| 2 | **Heading Hierarchy** (`1.3.1`, `2.4.6`) | **Đạt (Static + Chrome A11y Tree)** | 9/9 trang cốt lõi có đúng 1 `<h1>` (`accessibilityPhase39.test.js` Test #8); verified `heading level="1"` trên Chrome `#home` và `#lesson`. *(Ghi chú: `HskPracticePage.jsx` có 7 nhánh `<h1>` render có điều kiện theo từng `subRoute` độc lập).* |
| 3 | **Keyboard Navigation & Focus** (`2.1.1`) | **Đạt (Static + Chrome Keyboard)** | Verified `Tab` vào Skip Link, `Escape` đóng `AuthModal` & `MobileNavigation` Drawer kèm trả focus về nút kích hoạt; Flashcard & Streak KPI hỗ trợ `Enter`/`Space`. |
| 4 | **Focus Visibility** (`2.4.7`) | **Đạt (Static + Chrome Visual)** | `:focus-visible` (`2px solid #E85D3F` / `#F4B942` `!important`) ngoài `@layer base` trong `src/index.css`; verified viền focus hiển thị rõ trên Chrome. |
| 5 | **Screen Reader Labels (`aria-*`)** (`4.1.2`, `1.1.1`) | **Đạt một phần (Static + Chrome A11y Tree)** | `AudioButton`, `AppHeader`, `MobileNavigation`, `UniversalSlideOverDrawer`, `VocabularyPage`, `LessonPage` đều lộ tên tiếng Việt rõ trong Chrome A11y Tree. *(Còn một số nút loa nội tuyến trong tab từ vựng của `#lesson` chưa có `aria-label` — ghi nhận ở Mục 11).* |
| 6 | **Form Accessibility** (`1.3.1`, `3.3.1`, `3.3.2`) | **Đạt (Core Forms — Static + Chrome A11y Tree)** | `AuthModal` có `htmlFor`/`id`/`name`, `role="alert"` & `aria-live="polite"`; các ô tìm kiếm/chọn cốt lõi có `id`/`name`/`aria-label`. |
| 7 | **Dialog & Drawer Accessibility** (`2.1.1`, `4.1.2`) | **Đạt (Static + Chrome A11y Tree)** | `AuthModal`, `MobileNavigation`, `SmartCommandPalette`, `UniversalSlideOverDrawer` đều có `role="dialog"`, `aria-modal="true"`, nhãn tiêu đề và đóng bằng `Escape`. |
| 8 | **Color Contrast** (`1.4.3`) | **Đạt một phần (Audit)** | `--text-muted` (`#556272` trên `#FFF9F2`/`#FFFFFF` ≈ `5.8:1` đạt AA); tuy nhiên còn một số nhãn phụ dùng `text-slate-400`/`text-gray-400` trên nền sáng (dưới `4.5:1`) cần tinh chỉnh dần ở đợt UI polish tiếp theo. |
| 9 | **Text Scaling & Reduced Motion** (`1.4.4`, `2.3.3`) | **Đạt (Static)** | `@media (prefers-reduced-motion: reduce)` trong `src/index.css:46-53` vô hiệu hóa animation/transition dài khi người dùng bật giảm chuyển động. |
| 10 | **Audio / Video & Canvas Accessibility** (`1.1.1`, `4.1.2`) | **Đạt (Static + Chrome A11y Tree)** | `AudioButton` có `aria-label` động + `aria-pressed`; `HanziCanvasStage` có `aria-label="Khung tập viết chữ ..."`. |
| — | **Kiểm thử Trình đọc màn hình thật (NVDA / VoiceOver / TalkBack)** | **`[NOT VERIFIED — NO SCREEN READER / REAL NVDA-VOICEOVER]`** | Không có trình đọc màn hình thật trong môi trường CLI/emulation. |

---

## 5. Danh sách Files Đã Chỉnh Sửa (12 files)
1. `src/index.css`: Di chuyển `:focus-visible` ra ngoài `@layer base` với `!important` (chống `focus:outline-none` ghi đè).
2. `src/App.jsx`: Thêm Skip-to-Main-Content link (`Bỏ qua đến nội dung chính`) và `id="main-content" tabIndex={-1}` trên `<main>`.
3. `src/components/AudioButton.jsx`: Thêm `aria-label` động tiếng Việt, `aria-pressed={isPlaying}` và `aria-hidden="true"` cho `<Volume2>`.
4. `src/components/AuthModal.jsx`: Thêm `role="alert" aria-live="assertive"` cho lỗi, `role="status" aria-live="polite"` cho thông báo thành công, và `htmlFor`/`id`/`name` cho 5 trường form + `aria-hidden="true"` cho icon.
5. `src/components/Footer.jsx`: Thêm `id="footer-newsletter-email"`, `name`, `aria-label` cho ô email nhận bản tin.
6. `src/components/navigation/SmartCommandPalette.jsx`: Thêm `id="global-command-search"`, `name`, `aria-label` cho ô tìm kiếm toàn trang.
7. `src/components/navigation/MobileNavigation.jsx`: Bổ sung listener phím `Escape` để đóng Mobile Drawer.
8. `src/features/unified-ecosystem/UniversalSlideOverDrawer.tsx`: Thêm `role="dialog"`, `aria-modal="true"`, `aria-labelledby="unified-drawer-title"`, listener phím `Escape` và `aria-label="Nghe phát âm chuẩn"`.
9. `src/pages/VocabularyPage.jsx`: Bổ sung `role="button"`, `tabIndex={0}`, `aria-label`, `onKeyDown` (`Enter`/`Space`) cho Flashcard và `id`/`name`/`aria-label` cho ô tìm kiếm & chọn chủ đề.
10. `src/pages/LessonPage.jsx`: Bổ sung `id="lesson-selector"`, `name`, `aria-label="Chọn bài học HSK 1 đến 9"` cho `<select>` chọn bài.
11. `src/pages/DashboardPage.jsx`: Bổ sung `role="button"`, `tabIndex={0}`, `aria-label`, `onKeyDown` (`Enter`/`Space`) cho thẻ KPI Chuỗi ngày học.
12. `tests/accessibilityPhase39.test.js` & `package.json`: Tạo mới bộ test hồi quy Accessibility (8 tests) và đăng ký vào `npm test`.

---

## 6. Kết quả Kiểm thử Chrome Accessibility Tree & Bàn phím (`localhost:5173`)
Thực hiện trực tiếp qua `browser` subagent (`take_snapshot`, `press_key`, `click`, `take_screenshot`):
1. **`#home` (1440×900):**
   - Landmarks (`banner`, `navigation`, `main`, `contentinfo`), Skip Link (`"Bỏ qua đến nội dung chính"`) và 1 `<h1>`: **PASS**.
   - Nhấn `Tab` lần đầu: Skip Link nhận focus và hiện rõ góc trên trái kèm focus ring: **PASS**.
   - Mở `AuthModal` → thấy `dialog "Chào mừng bạn trở lại!" modal` → nhấn `Escape` đóng gọn và trả focus về nút `"Đăng nhập"`: **PASS**.
2. **`#home` (360×800):**
   - Bấm `"Mở menu điều hướng di động"` → thấy `dialog "Menu điều hướng di động" modal` → nhấn `Escape` đóng gọn và trả focus về nút Hamburger: **PASS**.
3. **`#vocabulary` (1440×900):**
   - Flashcard lộ `button "Lật xem mặt sau thẻ từ vựng"`, `AudioButton` lộ `button "Nghe phát âm: ..."`, tìm kiếm & lọc chủ đề lộ đủ `textbox`/`combobox` có tên tiếng Việt: **PASS**.
4. **`#lesson` (1440×900):**
   - Combobox chọn bài lộ tên `"Chọn bài học HSK 1 đến 9"` và có `heading level="1"`: **PASS**.

---

## 7. Kiểm thử Hồi quy Tự động (`tests/accessibilityPhase39.test.js`)
- Đã tạo mới `tests/accessibilityPhase39.test.js` gồm **8 test cases** khóa chặt Skip Link, `:focus-visible`, `prefers-reduced-motion`, `AudioButton`, `AuthModal`, `MobileNavigation`/`UniversalSlideOverDrawer`, Flashcard/Dashboard keyboard activation, form labels và single `<h1>`.
- Kết quả chạy độc lập & trong `npm test`: **`8 / 8` PASS**.

---

## 8. Kết quả Kiểm định Tổng thể (`lint`, `test`, `build:verify`)

| Lệnh kiểm định | Kết quả | Chi tiết |
| :--- | :---: | :--- |
| `npm run lint` | **PASS** | `0` errors (`727` warnings có sẵn) |
| `npm test` | **PASS** | **`1175 / 1175`** pass (`0` fail, `0` skipped; gồm `8/8` trong `tests/accessibilityPhase39.test.js`) |
| `npm run build:verify` | **PASS** | `index.js`: `363.77 KB` (`95.79 KB` gzip `<= 160 KB`); `TOTAL CSS`: `386.34 KB` (**`43.73 KB` gzip `<= 45 KB`**); Chunk Isolation: **PASS** |

---

## 9. Đánh giá Ngân sách CSS & Hiệu năng
- `TOTAL CSS` gzip tăng từ `43.51 KB` → **`43.73 KB`** (`+0.22 KB` gzip), vẫn nằm gọn trong trần `<= 45 KB` (còn dư `1.27 KB`).
- Không phát sinh thêm chunk hay thư viện mới; không ảnh hưởng thời gian tải trang đầu tiên.

---

## 10. Rủi ro & Tác động Hồi quy
- **Rủi ro thấp:** Chỉ bổ sung thuộc tính ARIA, `id`/`name`/`htmlFor`, listener phím `Escape` và quy tắc `:focus-visible`.
- Không thay đổi state nghiệp vụ, API, RLS hay bố cục Mobile/Desktop đã xác minh ở Task 39.02.

---

## 11. Các Tồn đọng Nhỏ (Non-blocking Backlog)
1. **`#lesson` (`src/pages/LessonPage.jsx`):** Có thẻ `<main>` phụ lồng bên trong `<main id="main-content">` của `App.jsx` và một số nút phát âm nội tuyến trong danh sách từ vựng chưa gắn `aria-label` (đã ghi nhận từ Chrome A11y Tree).
2. **Độ tương phản phụ (`WCAG 1.4.3`):** Một số nhãn phụ dùng `text-slate-400` / `text-gray-400` trên nền sáng (`HskPracticePage`, `AdminPage`, `RoadmapPage`) nên chuyển dần sang `text-slate-500`/`#556272` trong đợt UI polish.
3. **Form fields ở các trang quản trị phụ:** Một số ô nhập liệu nhỏ ở `AdminPage`/`MaterialsPage` chưa có thuộc tính `id`/`name` riêng lẻ.

---

## 12. Hướng dẫn Kiểm tra Thủ công với Trình đọc màn hình thật
1. **Windows (NVDA + Chrome/Edge):** Bật NVDA, mở `#home`, nhấn `Tab` kiểm tra đọc Skip Link → vào `#vocabulary` kiểm tra đọc Flashcard (`Enter`/`Space` lật thẻ) và `AudioButton`.
2. **macOS / iOS (VoiceOver + Safari):** Kiểm tra điều hướng Landmark (`VO + U`), mở/đóng `AuthModal` và `MobileNavigation` Drawer.
3. **High Contrast / Zoom 200%:** Phóng to trình duyệt `200%` và kiểm tra không mất chữ hoặc chồng lấn nút bấm.

---

## 13. Trạng thái Bằng chứng & Minh bạch
- **Static & Automated A11y Tests:** **PASS** (`8/8` trong `tests/accessibilityPhase39.test.js`, `1175/1175` toàn dự án).
- **Chrome Accessibility Tree & Keyboard (`Tab`/`Escape`):** **PASS** (4/4 kịch bản kiểm thử trực tiếp trên `http://localhost:5173`).
- **Real Screen Reader (NVDA / VoiceOver / TalkBack):** **`[NOT VERIFIED — NO SCREEN READER / REAL NVDA-VOICEOVER]`**.

---

## 14. Kết luận & Trạng thái Chốt Task 39.03
- **Trạng thái:** **`AUDIT COMPLETE`** | **`IMPLEMENTATION COMPLETE`** | **`STATIC A11Y TESTS PASSED`** | **`CHROME A11Y TREE & KEYBOARD VERIFIED`** | **`BUILD VERIFIED`**
- **Lưu ý trung thực:** Không tuyên bố đạt chứng nhận WCAG 2.2 AA toàn diện trên thiết bị thực tế do chưa chạy kiểm thử với trình đọc màn hình thật (`[NOT VERIFIED — NO SCREEN READER / REAL NVDA-VOICEOVER]`).
- **Hard Stop Gate:** Đã hoàn tất `TASK 39.03` — Dừng lại chờ phê duyệt trước khi chuyển sang `TASK 39.04`.
