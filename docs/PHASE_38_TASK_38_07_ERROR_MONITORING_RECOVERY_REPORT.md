# BÁO CÁO NGHIỆM THU TASK 38.07 — ERROR MONITORING & RECOVERY (PHASE 38)

**Ngày hoàn thành:** 19/11/2026  
**Phạm vi:** Chuẩn hóa phân loại lỗi & module phát sinh trong `errorReporter.js`, xác minh PII/Secret Redaction & Deduplication, sửa `GlobalErrorBoundary.jsx` thu thập đúng bản nháp `hanzigo_hsk_draft_*` theo `userId`, bổ sung `maxRetries` + quarantine cho `OfflineSyncManager.js`, bảo toàn `writingAnswers` trong Exam Draft Rescue (`hskService.js`), và ẩn chi tiết lỗi nội bộ/stack trace trên Serverless APIs ở chế độ Production (`sendSafeServerError`).  
**Trạng thái tổng thể:** **PASS (Local Verified — Chờ phê duyệt tại Hard Stop Gate trước Task 38.08)**

---

## 1. Thông tin định danh nhiệm vụ (Task Metadata)
- **Phase / Task:** Phase 38 — Task 38.07: Error Monitoring & Recovery
- **Repository:** `https://github.com/haidang1603/Hanzigo.git` (nhánh `main`)
- **Công cụ kiểm chứng:** `oxlint`, `vite build` + `scripts/verifyBuildBudget.js`, Node.js Test Runner (`node --env-file=.env --test`)
- **Hard Stop Gate:** Dừng sau khi hoàn tất báo cáo để chờ người dùng đánh giá trước khi chuyển sang Task 38.08.

---

## 2. Tóm tắt điều hành (Executive Summary)
- **Chuẩn hóa Error Reporter (`src/core/telemetry/errorReporter.js`):** Bổ sung `ERROR_CATEGORIES` (`network`, `database`, `auth`, `validation`, `render`, `sync`, `unknown`), `classifyErrorCategory()`, và `inferSourceModule()` gắn trực tiếp `category` & `module` vào payload chẩn đoán; mở rộng `sanitizeSensitiveText()` tẩy sạch thêm `cookie`, `set-cookie`, `x-api-key` bên cạnh email, JWT, Bearer token và password; giữ nguyên cơ chế deduplicate 60s.
- **Sửa lỗi cứu hộ bài thi trong `GlobalErrorBoundary.jsx` & `hskService.js`:** `GlobalErrorBoundary` trước đây tìm nhầm prefix `hsk_exam_draft_` và key tĩnh `hanzigo_sync_queue_v1`; nay đã cập nhật để thu thập đúng `hanzigo_hsk_draft_*` và `hanzigo_sync_queue_v1_*` theo đúng `userId` đang đăng nhập. `saveTemporaryAnswers` trong `hskService.js` bảo toàn thêm `writingAnswers` khi lưu nháp.
- **Chặn Retry vô hạn trong `OfflineSyncManager.js`:** Bổ sung `MAX_SYNC_RETRIES = 5`, backoff tăng dần theo cấp số nhân, và kho cách ly lỗi `FAILED_SYNC_QUEUE_KEY` (`getFailedSyncItems`) để item hỏng vĩnh viễn không retry vô hạn và không chặn các item hợp lệ phía sau.
- **Bảo vệ Serverless Error Responses (`api/`):** Bổ sung `sendSafeServerError()` trong `api/_utils/supabaseServer.js` và áp dụng trên toàn bộ 7 router `[action].js` (`admin`, `ai`, `classroom`, `hsk`, `live`, `newsletter`, `webrtc`) để không trả raw `err.message` hay `err.stack` ra client ở chế độ Production.

---

## 3. Hiện trạng Audit trước khi triển khai (Pre-Fix Findings)
1. `src/core/telemetry/errorReporter.js`: Đã có `sanitizeSensitiveText`, `isDuplicateError` (60s), `initGlobalErrorReporter` (được gọi tại `src/App.jsx`), nhưng payload thiếu phân loại lỗi (`category`) và module nguồn (`module`), regex chưa tẩy `cookie` / `set-cookie` / `x-api-key`.
2. `src/components/common/GlobalErrorBoundary.jsx`: `collectExamRescueSnapshot` tìm `hsk_exam_draft_` và exact key `hanzigo_sync_queue_v1`, bỏ sót toàn bộ bản nháp `hanzigo_hsk_draft_<examId>_<userId>` và queue `hanzigo_sync_queue_v1_<userId>`, đồng thời chưa lọc theo `userId`.
3. `src/services/hskService.js`: `saveTemporaryAnswers` chưa lưu kèm trường `writingAnswers` trong draft JSON.
4. `src/core/sync/OfflineSyncManager.js`: `flushOfflineQueueToSupabase` đẩy lại mọi item lỗi vào `remaining` mà không có `retryCount` hay `maxRetries` — dẫn đến nguy cơ retry vô hạn khi gặp lỗi schema/constraint vĩnh viễn.
5. `api/*/[action].js`: Toàn bộ 7 dispatcher trả `message: err?.message` trong HTTP 500 ngay cả khi `NODE_ENV === 'production'`.

---

## 4. Kiến trúc Giám sát & Khôi phục Lỗi (Architecture Overview)
- **Tầng UI & Runtime:** `App.jsx` khởi tạo `initGlobalErrorReporter()` (bắt `window.error`, `unhandledrejection`, sự kiện `online` để flush queue offline) và bọc cả `app` lẫn route bên trong `GlobalErrorBoundary`.
- **Tầng Chuẩn hóa & Bảo mật Log:** Mọi lỗi đi qua `reportClientError` đều được tẩy PII/secret (`sanitizeSensitiveText`), phân loại (`classifyErrorCategory`), gắn `module` (`inferSourceModule`), và chống bão log trong cửa sổ `60_000ms` (`isDuplicateError`).
- **Tầng Khôi phục Dữ liệu Học tập:** Bản nháp thi HSK lưu cả trắc nghiệm (`answers`) lẫn tự luận (`writingAnswers`) theo namespace `userId`; `OfflineSyncManager` bảo đảm idempotency qua `idempotencyKey`, backoff theo `retryCount` và cách ly item vượt `maxRetries`.

---

## 5. Chi tiết thay đổi Error Reporter & `GlobalErrorBoundary`
1. **[src/core/telemetry/errorReporter.js](file:///d:/DELL/Dowloads/HanziGo/src/core/telemetry/errorReporter.js):**
   - Mở rộng `sanitizeSensitiveText` tẩy sạch `password`, `passwd`, `pwd`, `passcode`, `secret`, `token`, `access_token`, `refresh_token`, `id_token`, `api_key`, `apikey`, `x-api-key`, `authorization`, `cookie`, `set-cookie`, email và JWT `eyJ...`.
   - Bổ sung `ERROR_CATEGORIES`, `classifyErrorCategory(errorInput, context)`, `inferSourceModule(context, routePath)` và xuất `category`, `module` trong `buildDiagnosticPayload`.
2. **[src/components/common/GlobalErrorBoundary.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/common/GlobalErrorBoundary.jsx):**
   - Cập nhật `collectExamRescueSnapshot(customStorage, user = null)` nhận diện đúng `hanzigo_hsk_draft_*` (cùng `hsk_exam_draft_*` legacy) và `hanzigo_sync_queue_v1_*` theo đúng hậu tố user đang đăng nhập (`resolveActiveUserSuffix`).
   - Trong `componentDidCatch`, gắn `module` và `category: 'render'` khi gọi `reportClientError`.

---

## 6. Chi tiết thay đổi Offline Queue, Retry Cap & Exam Draft Rescue
1. **[src/core/sync/OfflineSyncManager.js](file:///d:/DELL/Dowloads/HanziGo/src/core/sync/OfflineSyncManager.js):**
   - Bổ sung hằng số `MAX_SYNC_RETRIES = 5`, key `FAILED_SYNC_QUEUE_KEY = 'hanzigo_sync_failed_v1'`, hàm `getScopedFailedSyncKey(user)` và `getFailedSyncItems(user)`.
   - Cập nhật `flushOfflineQueueToSupabase(supabaseClient, user, options)`:
     - Hỗ trợ `{ maxRetries, ignoreBackoff, nowMs }`.
     - Tính backoff theo cấp số nhân `Math.min(60000, 1000 * 2 ** (nextRetryCount - 1))`.
     - Khi `nextRetryCount >= maxRetries`, chuyển item sang `FAILED_SYNC_QUEUE_KEY` với trạng thái `failed_max_retries` để chấm dứt retry vô hạn và không cản trở các item hợp lệ phía sau.
2. **[src/services/hskService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/hskService.js):**
   - Cập nhật `saveTemporaryAnswers` lưu thêm `writingAnswers: extra.writingAnswers || {}` vào key phân vùng `hanzigo_hsk_draft_<examId>_<userId>`.

---

## 7. Chi tiết thay đổi Serverless Error Handling (`api/`)
- **[api/_utils/supabaseServer.js](file:///d:/DELL/Dowloads/HanziGo/api/_utils/supabaseServer.js):**
  - Thêm `sendSafeServerError(res, publicMessage = 'Lỗi máy chủ nội bộ.', err = null, statusCode = 500)`: trong `NODE_ENV === 'production'`, chỉ trả `{ error: publicMessage }`, tuyệt đối không trả raw `err.message` hoặc `err.stack` ra client.
- **Áp dụng cho toàn bộ 7 Serverless Dispatchers:**
  - [api/admin/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/admin/[action].js)
  - [api/ai/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/ai/[action].js)
  - [api/classroom/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/classroom/[action].js)
  - [api/hsk/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/hsk/[action].js)
  - [api/live/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/live/[action].js)
  - [api/newsletter/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/newsletter/[action].js)
  - [api/webrtc/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/webrtc/[action].js)

---

## 8. Kiểm toán `catch {}` nuốt lỗi im lặng & Luồng khôi phục
- Các thao tác quan trọng trong `vocabularyService.js` (`saveUserVocabSrsCard`) và `hskService.js` (`syncAttemptToSupabase`) đã đẩy lỗi mạng vào `OfflineSyncManager` với `idempotencyKey` (từ Task 38.03/38.04), nay được bảo vệ thêm bởi giới hạn `MAX_SYNC_RETRIES = 5` và `FAILED_SYNC_QUEUE_KEY`.
- `create-user.js` đã ghi nhận cảnh báo `audit_logs` thay vì nuốt lỗi im lặng (từ Task 38.06).

---

## 9. Kiểm thử hồi quy (`tests/errorMonitoringRecoveryPhase38.test.js`)
Đã tạo mới [tests/errorMonitoringRecoveryPhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/errorMonitoringRecoveryPhase38.test.js) (đăng ký trong [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json), đạt **5/5 pass**):
1. Tẩy sạch PII/secret (email, JWT, password, cookie) và deduplicate lỗi trùng lặp trong cửa sổ 60s.
2. Phân loại chính xác `category` (`network`, `database`, `auth`, `sync`, `render`) và suy luận `module` nguồn (`hsk_exam`, `vocabulary_srs`, ...).
3. `OfflineSyncManager` dừng đúng ngưỡng `maxRetries` (chuyển vào `getFailedSyncItems`), không retry vô hạn và vẫn đồng bộ bình thường các item hợp lệ phía sau.
4. Exam Draft Rescue bảo toàn `answers` + `writingAnswers` và cô lập theo `userId`, khớp với `GlobalErrorBoundary.jsx`.
5. `sendSafeServerError` loại bỏ hoàn toàn `err.message` và `err.stack` ở chế độ Production.

---

## 10. Kết quả Verification (`lint`, `test`, `build:verify`) — Trước & Sau
| Kiểm tra | Trước Task 38.07 (sau 38.06) | Sau Task 38.07 (lần chạy cuối) | Trạng thái |
| :--- | :--- | :--- | :--- |
| `npm run lint` (`oxlint`) | `0 errors`, `731 warnings` (`603 files`) | `0 errors`, `731 warnings` (`604 files`, `400ms`) | `PASS` |
| `npm run build:verify` | `PASS` (100% chunk đạt ngưỡng) | `PASS` (100% chunk đạt ngưỡng, `18` preload/script tags sạch) | `PASS` |
| `npm test` (`node --test`) | `1164/1164 pass` (`31 suites`) | **`1169/1169 pass`**, `0 fail`, `0 skipped` (`31 suites`, `27516.8247ms`) | `PASS` |

---

## 11. Xác minh trên Production Live
- Kiểm thử telemetry endpoint & crash recovery trực tiếp trên domain Production live `https://hanzigo-xi.vercel.app`: **`[NOT VERIFIED — NO LIVE ACCESS]`** (đã kiểm chứng đầy đủ bằng unit/integration test với mock runtime ở local).

---

## 12. Danh sách tệp đã tạo / chỉnh sửa
- [src/core/telemetry/errorReporter.js](file:///d:/DELL/Dowloads/HanziGo/src/core/telemetry/errorReporter.js)
- [src/components/common/GlobalErrorBoundary.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/common/GlobalErrorBoundary.jsx)
- [src/core/sync/OfflineSyncManager.js](file:///d:/DELL/Dowloads/HanziGo/src/core/sync/OfflineSyncManager.js)
- [src/services/hskService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/hskService.js)
- [api/_utils/supabaseServer.js](file:///d:/DELL/Dowloads/HanziGo/api/_utils/supabaseServer.js)
- [api/admin/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/admin/[action].js), [api/ai/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/ai/[action].js), [api/classroom/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/classroom/[action].js), [api/hsk/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/hsk/[action].js), [api/live/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/live/[action].js), [api/newsletter/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/newsletter/[action].js), [api/webrtc/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/webrtc/[action].js)
- [tests/errorMonitoringRecoveryPhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/errorMonitoringRecoveryPhase38.test.js) (mới)
- [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json)

---

## 13. Ràng buộc phạm vi (Scope Guardrails)
- Tái sử dụng `GlobalErrorBoundary`, `errorReporter.js` và `OfflineSyncManager.js` hiện có; không tích hợp dịch vụ bên thứ ba trả phí.
- Không thay đổi công thức chấm điểm CBT / SM-2 và không tự chạy migration lên Production.
- Kiểm thử tích hợp tổng thể 16 luồng nghiệp vụ giữ nguyên cho **Task 38.08**.

---

## 14. Rủi ro còn lại & Khuyến nghị
1. Cần cấu hình biến môi trường `VITE_TELEMETRY_ENDPOINT` nếu muốn đẩy error log client về endpoint thu thập tập trung trên Vercel/Supabase sau khi deploy.
2. Các handler con nằm sâu trong `api/_handlers/hsk/*.js` và `api/_webrtc/ice-servers.js` vẫn có thể chuyển dần sang gọi `sendSafeServerError` khi refactor ở các đợt sau (hiện các router `[action].js` bao ngoài đã dùng `sendSafeServerError`).

---

## 15. Kết luận & Trạng thái Hard Stop Gate
- **Trạng thái:** `IMPLEMENTATION COMPLETE` | `TESTS PASSED` | `BUILD VERIFIED` | `PRODUCTION VERIFICATION PARTIAL`
- **Hard Stop Gate:** Đã hoàn tất báo cáo **Task 38.07**, dừng lại chờ bạn đánh giá và phê duyệt trước khi chuyển sang **Task 38.08**.
