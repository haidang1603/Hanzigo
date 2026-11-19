# BÁO CÁO NGHIỆM THU TASK 38.05 — PLATFORM PERFORMANCE OPTIMIZATION (PHASE 38)

**Ngày hoàn thành:** 19/11/2026  
**Phạm vi:** Đo baseline bundle & cảnh báo build, tách nhỏ chunk `feature-hsk-exam-engine` (`1,751.13 KB` raw / `518.23 KB` gzip) đạt ngân sách `<= 180 KB` gzip, xử lý dứt điểm 2 cảnh báo `[INEFFECTIVE_DYNAMIC_IMPORT]`, thu hẹp `select('*')` trên `profiles`, kiểm tra cache policy & viết test hồi quy hiệu năng.  
**Trạng thái tổng thể:** **PASS (Local Build Budget & Test Suite Verified — Production RUM/CWV `[NOT VERIFIED — NO LIVE ACCESS]`)**

---

## 1. Thông tin định danh nhiệm vụ (Task Metadata)
- **Phase / Task:** Phase 38 — Task 38.05: Platform Performance Optimization
- **Repository:** `https://github.com/haidang1603/Hanzigo.git` (nhánh `main`)
- **Công cụ đo lường sử dụng:** `vite build` (v8.3.1), `scripts/verifyBuildBudget.js`, `oxlint`, Node.js Test Runner (`node --env-file=.env --test`)
- **Hard Stop Gate:** Dừng sau khi hoàn tất báo cáo để chờ người dùng đánh giá trước khi chuyển sang Task 38.06.

---

## 2. Tóm tắt điều hành (Executive Summary)
- **Đạt 100% Ngân sách Build (`npm run build:verify`):** Đã tách `feature-hsk-exam-engine` (trước đó `1,751.13 KB` raw / `518.23 KB` gzip — **FAIL** ngưỡng `<= 180 KB`) thành các chunk tải theo nhu cầu (`feature-hskk-exam`, `feature-hsk6-exam`, `feature-hsk79-exam`, `PostExamMistakeRemediationPanel`, `data-hsk-core`, `data-hsk-resources`, `data-hanzi-decomposition`, `utils-chinese-nlp`), giúp **100% chunk JS & CSS đều đạt PASS** theo `verifyBuildBudget.js`.
- **Xóa sạch cảnh báo `[INEFFECTIVE_DYNAMIC_IMPORT]`:** Chuyển 2 lệnh `await import(...)` trùng lặp trong `customLessonService.js` (`learningPathService.js`, `gamification.js`) sang static import, giảm số cảnh báo từ **2 xuống 0**.
- **Tối ưu truy vấn & bảo toàn cách ly:** Thu hẹp `profiles.select('*')` trong `progressService.js` xuống 7 cột cần thiết; xác nhận `vendor-livekit` và `vendor-hanzi` hoàn toàn không xuất hiện trong `dist/index.html` (`18` thẻ script/modulepreload).

---

## 3. Số liệu Baseline trước tối ưu (Measured Before Edits)
Kết quả đo từ `vite build` + `node scripts/verifyBuildBudget.js` trước khi chỉnh sửa Task 38.05:
- **Thời gian build:** `1.18s` (`2251 modules transformed`).
- **Entry `index.js`:** `334.31 KB` raw / `83.34 KB` gzip (Vite reporter: `342.33 kB` / `85.64 kB`).
- **Top 5 chunk JS lớn nhất (Raw / Gzip theo `verifyBuildBudget.js`):**
  1. `feature-hsk-exam-engine-Bs5c963J.js`: `1,751.13 KB` raw / `518.23 KB` gzip — **FAIL** (`> 180 KB`)
  2. `vendor-livekit-C8if_5UX.js`: `509.55 KB` raw / `131.41 KB` gzip — PASS (`<= 260 KB`)
  3. `data-chinese-BkPI851j.js`: `494.32 KB` raw / `147.19 KB` gzip — PASS (`<= 180 KB`)
  4. `data-learning-path-C_bS36YY.js`: `470.51 KB` raw / `175.25 KB` gzip — PASS (`<= 180 KB`)
  5. `index-DCxEkM_y.js`: `334.31 KB` raw / `83.34 KB` gzip — PASS (`<= 160 KB`)
- **Cảnh báo `[INEFFECTIVE_DYNAMIC_IMPORT]`:** **2** (`src/services/learningPathService.js` và `src/utils/gamification.js` trong `src/services/customLessonService.js`).

---

## 4. Phân tích điểm nghẽn gốc rễ (Root Cause Audit)
1. **Gom cụm quá tay trong `vite.config.js`:** Quy tắc `manualChunks` cũ gom toàn bộ `/src/features/hsk-exam/` và `/src/features/hskk-exam/` vào một chunk duy nhất `feature-hsk-exam-engine`, kéo theo cả dữ liệu đề thi HSK và `dictionaryService` / `chineseNlpEngine` / `hanziDecomposition` vào cùng 1 file `1.75 MB`.
2. **Import tĩnh các trình mô phỏng nặng trong `HskPracticePage.jsx`:** 4 component nặng (`Hsk6SimulatorWorkspace`, `Hsk6TwoPhaseSummarySimulator`, `HskkSpeakingSimulator`, `PostExamMistakeRemediationPanel`) được import tĩnh ở đầu trang thay vì `React.lazy()`.
3. **Dynamic import không hiệu quả trong `customLessonService.js`:** `learningPathService.js` và `gamification.js` đã được `App.jsx` import tĩnh nên `await import(...)` trong `completeCustomLesson` không tách được chunk mới mà sinh cảnh báo `[INEFFECTIVE_DYNAMIC_IMPORT]`.
4. **`select('*')` không cần thiết:** `progressService.js` đọc toàn bộ cột bảng `profiles` dù chỉ sử dụng 7 trường (`id, xp, streak, longest_streak, level, words_learned, last_study_date`).

---

## 5. Giải pháp tối ưu Code Splitting & Lazy Loading
1. **[src/pages/HskPracticePage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/HskPracticePage.jsx):**
   - Chuyển `Hsk6SimulatorWorkspace`, `Hsk6TwoPhaseSummarySimulator`, `HskkSpeakingSimulator`, `PostExamMistakeRemediationPanel` sang `React.lazy()` kèm `<Suspense fallback={...}>` tại 4 điểm render.
   - Giữ nguyên lazy-loading sẵn có của `Hsk7to9IntegratedExamSimulator`.
2. **[vite.config.js](file:///d:/DELL/Dowloads/HanziGo/vite.config.js):**
   - Thay chunk khổng lồ `feature-hsk-exam-engine` bằng các chunk tách biệt theo tính năng và dữ liệu: `feature-hskk-exam`, `feature-hsk6-exam`, `feature-hsk79-exam`, `data-hsk-core`, `data-hsk6-exam`, `data-hsk-resources`, `data-hanzi-decomposition`, `utils-chinese-nlp`.
3. **[src/services/customLessonService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/customLessonService.js):**
   - Thay 2 `await import(...)` (`learningPathService.js`, `gamification.js`) bằng static import ở đầu module (đã kiểm tra không có circular dependency).

---

## 6. Tối ưu React Rendering, Database Queries & Media/Cache
- **Database Query Projection:**
  - Rà soát `DashboardPage.jsx`, `RoadmapPage.jsx`, `VocabularyPage.jsx`, `HskPracticePage.jsx`: không có `select('*')` trực tiếp trong 4 trang này.
  - Thu hẹp `profiles.select('*')` trong [src/services/progressService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/progressService.js) thành `.select('id, xp, streak, longest_streak, level, words_learned, last_study_date')`.
- **Media & Cache Policy:**
  - Xác nhận 4 trang cốt lõi không chứa thẻ `<img>` tải nặng không kiểm soát.
  - Kiểm tra [vercel.json](file:///d:/DELL/Dowloads/HanziGo/vercel.json): chỉ cấu hình `Cache-Control: public, max-age=31536000, immutable` cho `/assets/(.*)` (file tĩnh có hash), không cấu hình public CDN cache cho bất kỳ route `/api/*` nào chứa dữ liệu người dùng.

---

## 7. Bảng so sánh số liệu Trước vs Sau tối ưu (Evidence Comparison)

| Chỉ số đo lường | Trước tối ưu (Baseline) | Sau tối ưu (Verified) | Thay đổi / Đánh giá |
| :--- | :--- | :--- | :--- |
| **Thời gian build (`vite build`)** | `1.18s` | `959ms` | Giảm `~18.7%` |
| **Cảnh báo `[INEFFECTIVE_DYNAMIC_IMPORT]`** | `2` | `0` | Giảm `100%` |
| **`verifyBuildBudget.js` tổng thể** | **FAIL** (1 chunk vượt ngưỡng) | **PASS** (100% chunk đạt ngưỡng) | Đạt chuẩn ngân sách |
| **Chunk HSK Exam lớn nhất (`feature-hsk-exam-engine`)** | `1,751.13 KB` raw / `518.23 KB` gzip | Đã tách nhỏ; lớn nhất là `data-hsk-core` (`175.00 KB` gzip) & `feature-hskk-exam` (`166.08 KB` gzip) | Giảm >66% gzip đỉnh chunk |
| **Simulator HSK 6 / HSK 7-9 / Remediation** | Gộp chung `518.23 KB` gzip | `feature-hsk6-exam`: `23.30 KB` gzip; `feature-hsk79-exam`: `71.30 KB` gzip; `PostExamMistakeRemediationPanel`: `2.33 KB` gzip | Tải theo nhu cầu (on-demand) |
| **Entry `index.js` (`verifyBuildBudget.js`)** | `334.31 KB` raw / `83.34 KB` gzip | `371.98 KB` raw / `96.54 KB` gzip | Vẫn **PASS** sâu dưới ngưỡng `<= 160 KB` gzip |
| **`vendor-livekit` & `vendor-hanzi` trên `index.html`** | Không có (`13` tags) | Không có (`18` tags) | Cách ly hoàn toàn khỏi tải ban đầu |
| **`TOTAL CSS` (1 file)** | `387.11 KB` raw / `43.68 KB` gzip | `387.11 KB` raw / `43.68 KB` gzip | **PASS** (`<= 45 KB` gzip) |

---

## 8. Đánh giá Core Web Vitals trên Production
- **LCP / INP / CLS trên `https://hanzigo-xi.vercel.app`:** **`[NOT VERIFIED — NO LIVE ACCESS]`** (môi trường CLI local không chạy Lighthouse/RUM trên domain Production live; không suy diễn số liệu).

---

## 9. Kiểm thử hồi quy & Budget Guard (`tests/performancePhase38.test.js`)
Đã tạo mới [tests/performancePhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/performancePhase38.test.js) (đăng ký trong [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json), **5/5 pass**):
1. Xác minh `customLessonService.js` không còn `INEFFECTIVE_DYNAMIC_IMPORT`.
2. Xác minh 5 simulator/panel nặng trong `HskPracticePage.jsx` đều dùng `React.lazy()`.
3. Xác minh `vite.config.js` tách nhỏ các chunk `feature-hskk-exam`, `feature-hsk6-exam`, `feature-hsk79-exam`, `data-hsk-core`, `data-hsk-resources`, `data-hsk6-exam`.
4. Xác minh `progressService.js` dùng narrow projection trên `profiles` và `vercel.json` không cache `/api/*`.
5. Xác minh toàn bộ file JS trong `dist/assets/js/` đều đạt ngưỡng gzip (`<= 160 KB` entry, `<= 260 KB` LiveKit, `<= 180 KB` route/data chunks).
- Đồng thời cập nhật [tests/phase35SystemIntegrity.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/phase35SystemIntegrity.test.js) để khớp tên các chunk HSK đã tách mới (`feature-hsk79-exam`, `feature-hsk6-exam`, `feature-hskk-exam`).

---

## 10. Kết quả Verification (`lint`, `test`, `build:verify`) sau chỉnh sửa cuối
- **`npm run lint` (`oxlint`):** **PASS** — `0 errors`, `731 warnings` (`602 files`, `407ms`).
- **`npm run build:verify`:** **PASS** — `2251 modules transformed`, build `959ms`, **0 cảnh báo `INEFFECTIVE_DYNAMIC_IMPORT`**, `verifyBuildBudget.js` **PASS 100%**.
- **`npm test`:** **PASS** — **1159/1159 tests pass**, `0 fail`, `0 cancelled`, `0 skipped`, `0 todo` (`31 suites`, `22721.9885ms`).

---

## 11. Các tệp đã tạo / chỉnh sửa
- [vite.config.js](file:///d:/DELL/Dowloads/HanziGo/vite.config.js)
- [src/pages/HskPracticePage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/HskPracticePage.jsx)
- [src/services/customLessonService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/customLessonService.js)
- [src/services/progressService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/progressService.js)
- [tests/phase35SystemIntegrity.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/phase35SystemIntegrity.test.js)
- [tests/performancePhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/performancePhase38.test.js) (mới)
- [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json)

---

## 12. Ràng buộc phạm vi (Scope Guardrails)
- Không thay đổi chính sách RLS, RBAC hay `audit_logs` ở `create-user.js` (giữ cho Task 38.06).
- Không sửa `GlobalErrorBoundary` hay Error Reporter (giữ cho Task 38.07).
- Không thay đổi công thức CBT / SM-2 và không chạy migration lên Production.

---

## 13. Rủi ro còn lại & Khuyến nghị tiếp theo
1. Cần chạy Lighthouse / Vercel Speed Insights trên URL live `https://hanzigo-xi.vercel.app` sau khi deploy để ghi nhận chỉ số `LCP`, `INP`, `CLS` thực tế của người dùng cuối.
2. Hai chunk dữ liệu `data-learning-path` (`175.25 KB` gzip) và `data-hsk-core` (`175.00 KB` gzip) đang ở sát ngưỡng `180 KB` gzip; nếu bổ sung nhiều đề thi hoặc bài học mới ở các phase sau, nên tách tiếp theo từng cấp độ HSK.

---

## 14. Checklist nghiệm thu Task 38.05
- [x] Đo đạc Baseline trước khi sửa code
- [x] Tách nhỏ chunk `feature-hsk-exam-engine` đạt `<= 180 KB` gzip
- [x] Xử lý 0/2 cảnh báo `[INEFFECTIVE_DYNAMIC_IMPORT]`
- [x] Kiểm tra cách ly `vendor-livekit`, `vendor-hanzi`, cache policy `vercel.json`, và `select` cột hẹp
- [x] Viết test hồi quy `tests/performancePhase38.test.js` và chạy `lint`, `test`, `build:verify` pass 100%

---

## 15. Kết luận & Trạng thái Hard Stop Gate
- **Trạng thái:** `IMPLEMENTATION COMPLETE` | `TESTS PASSED` | `BUILD VERIFIED` | `PRODUCTION VERIFICATION PARTIAL`
- **Hard Stop Gate:** Đã hoàn tất báo cáo **Task 38.05**, dừng lại chờ bạn đánh giá và phê duyệt trước khi chuyển sang **Task 38.06**.
