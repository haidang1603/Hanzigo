# BÁO CÁO NGHIỆM THU TASK 39.07 — BACKUP & DISASTER RECOVERY

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Phase 39 — Task 39.07 (Backup & Disaster Recovery)
- **Ngày thực hiện:** 2026-11-21
- **Phương pháp:** Audit 8 hạng mục sao lưu & phục hồi trong repo (`scripts/`, `supabase/migrations/`, `OfflineSyncManager.js`, `GlobalErrorBoundary.jsx`, `progressService.js`, `.env.example`) → Thiết lập mục tiêu RPO/RTO & Runbook 4 sự cố → Khóa kiểm chứng bằng `tests/backupDisasterRecoveryPhase39.test.js` → Xác minh `lint`, `test`, `build:verify`.

---

## 1. Mục tiêu & Phạm vi Kiểm toán Backup / DR

Task 39.07 đánh giá khả năng bảo toàn dữ liệu và phục hồi dịch vụ của HanziGo trên 8 lớp:
1. Supabase Database Backup & Seed/Sync scripts.
2. Storage Backup (`materials`, `tts-audio-cache`, avatar).
3. Lịch sử Migration & tính sẵn sàng Rollback (`45` file SQL trong `supabase/migrations/`).
4. User Data Recovery & GDPR Snapshot Export (`exportUserLearningSnapshot`).
5. Exam Draft Rescue (`GlobalErrorBoundary.jsx`).
6. Learning Progress & SRS Offline Recovery (`OfflineSyncManager.js`, `progressService.js`).
7. Configuration & Secrets Recovery (kiểm kê tên biến môi trường từ `.env.example`, **không** đọc `.env`).
8. Mục tiêu RPO/RTO & Runbook phục hồi thảm họa từng bước.

---

## 2. Đánh giá Supabase Database Backup & Seed Recovery

- **Nguồn dữ liệu tĩnh & seed tái tạo được trong repo:**
  - Bộ script `npm run db:sync` (`scripts/syncSupabaseMaster.js`), `npm run db:seed:learning`, `npm run db:seed:dictionary`, `npm run db:seed:hsk`, `npm run db:seed:quotes` có thể tái tạo toàn bộ dữ liệu học liệu chuẩn (180 bài học, từ điển, đề thi HSK, danh ngôn ngày).
  - Bộ script kiểm chứng schema & integrity (`scripts/verify_schema_migrations.js`, `scripts/audit_supabase_live.js`).
- **Backup tự động của Supabase Cloud (Daily Backups / Point-in-Time Recovery - PITR):**
  - **`[NOT VERIFIED — NO LIVE SUPABASE DASHBOARD ACCESS]`**: Phiên kiểm toán không truy cập Supabase Dashboard live nên chưa xác minh được gói cước hiện tại đang bật Daily Backups (Free/Pro 7 ngày) hay PITR (Pro + PITR add-on).
  - **Bước quản trị viên cần kiểm tra trên Supabase Dashboard:** Vào *Project Settings → Database → Backups*, xác nhận lịch Daily Backup gần nhất thành công (`Completed`), bật PITR nếu có > 100 người dùng hoạt động thường xuyên, và tải thử 1 bản `.backup`/SQL dump định kỳ hàng tuần lưu trữ ngoại tuyến (encrypted).

---

## 3. Phân loại Sao lưu Supabase Storage

| Bucket / Dữ liệu | Mức độ quan trọng | Yêu cầu Backup | Cơ chế phục hồi |
| :--- | :---: | :--- | :--- |
| **`materials`** (tài liệu PDF/Word/Audio do GV/Admin tải lên) | **Bắt buộc sao lưu** | Cao — không thể tái sinh từ code | Đồng bộ/backup định kỳ bucket `materials` qua script hoặc Supabase Storage sync sang kho lưu trữ phụ |
| **Avatar người dùng** | **Bắt buộc sao lưu** | Trung bình | Bao gồm trong bản sao lưu Storage hoặc cho phép user upload lại |
| **`tts-audio-cache`** (file `.mp3` cache theo SHA-256) | **Không bắt buộc backup** | Thấp (Ephemeral Cache) | **Tái tạo tự động 100%** khi user phát âm qua `api/audio/tts.js` (Azure Neural TTS) hoặc `scripts/prewarmHskAudioCache.js` |

---

## 4. Migration History & Khả năng Rollback (`supabase/migrations/`)

- Repo hiện có **`45` file SQL migration** sắp xếp tuần tự theo timestamp (`20261106` → `20261119`).
- **Kiểm tra 2 migration Phase 38 trọng yếu:**
  - `supabase/migrations/20261119_3804_learning_progress_integrity.sql`: Dùng `ADD COLUMN IF NOT EXISTS lapse_count`, `CREATE OR REPLACE VIEW`, `CREATE OR REPLACE FUNCTION` (an toàn chạy lại/idempotent) và kèm sẵn **`ROLLBACK GUIDE`** chi tiết ở cuối file.
  - `supabase/migrations/20261119_3806_security_hardening.sql`: Dùng `CREATE OR REPLACE FUNCTION` + `REVOKE/GRANT` rõ ràng và kèm sẵn **`ROLLBACK GUIDE`** chỉ đúng 2 file SQL gốc để khôi phục nếu cần revert.

---

## 5. User Data Recovery & GDPR Export (`exportUserLearningSnapshot`)

- Hàm `exportUserLearningSnapshot(supabaseClient, activeUser)` trong [OfflineSyncManager.js](file:///d:/DELL/Dowloads/HanziGo/src/core/sync/OfflineSyncManager.js#L510-L572):
  - Thu thập đầy đủ `user_vocab_items`, `hsk_attempts` từ Supabase, `pending_sync_items`, `preferences`, và toàn bộ `local_storage` theo `userId` (`_${user.id}` hoặc `_guest`).
  - **Cô lập & Bảo mật:** Bỏ qua các key thuộc người dùng khác và loại trừ các key `essential` chứa token/phiên đăng nhập (trừ `hanzigo_storage_preferences_v1`).
  - Cho phép người dùng tự tải file JSON sao lưu cá nhân bất kỳ lúc nào tại trang `StoragePreferencesPage` (`DataSubjectRequestModal`).

---

## 6. Exam Draft Rescue & Crash Recovery (`GlobalErrorBoundary.jsx`)

- Khi xảy ra lỗi React runtime hoặc crash trình duyệt trong lúc làm bài thi CBT:
  - [GlobalErrorBoundary.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/common/GlobalErrorBoundary.jsx#L35-L125) tự động quét `localStorage` qua `collectExamRescueSnapshot()`, gom toàn bộ bản nháp bài thi (`hanzigo_exam_draft_*` gắn với `userSuffix`) và hàng đợi đồng bộ (`hanzigo_sync_queue_v1_*`).
  - Hiển thị nút tải khẩn cấp tệp JSON cứu hộ `hanzigo-exam-rescue-<timestamp>.json` để thí sinh không mất đáp án khi F5/rớt mạng/crash tab.

---

## 7. Learning Progress & SRS Offline Recovery (`OfflineSyncManager.js` & `progressService.js`)

- **Hàng đợi Offline & Kho cách ly lỗi (Quarantine):**
  - Hàng đợi đồng bộ gắn theo user: `hanzigo_sync_queue_v1_<userId>`.
  - Giới hạn thử lại `MAX_SYNC_RETRIES = 5`; các item lỗi quá ngưỡng được chuyển sang kho cách ly `hanzigo_sync_failed_v1_<userId>` (`FAILED_SYNC_QUEUE_KEY`) thay vì bị xóa âm thầm.
- **Bảo toàn dữ liệu khi hợp nhất (`progressService.js`):**
  - Dùng `Math.max(rememberedWords.length, existingWordsCount)` chống ghi đè `words_learned = 0` khi đăng nhập trên thiết bị mới.
  - Hợp nhất danh sách bài học hoàn thành bằng **Set union** (`new Set([...localIds, ...cloudIds])`).
  - Cột `lapse_count` trên `user_vocab_srs` bảo toàn số lần quên thẻ SM-2.

---

## 8. Kiểm kê Cấu hình & Biến Môi trường Cần Sao lưu Ngoài Repo

*(Chỉ liệt kê **tên biến** từ [.env.example](file:///d:/DELL/Dowloads/HanziGo/.env.example) — **TUYỆT ĐỐI KHÔNG** đọc hoặc in giá trị bí mật từ `.env`)*:

| Nhóm Dịch vụ | Tên biến môi trường bắt buộc sao lưu (Encrypted Vault / 1Password / Vercel) |
| :--- | :--- |
| **Supabase** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **AI / LLM** | `GEMINI_API_KEY`, `GEMINI_API_KEYS`, `GEMINI_MODEL`, `OPENAI_API_KEY`, `ENABLE_AI_TUTOR`, `AI_TUTOR_KILL_SWITCH`, `VITE_ENABLE_AI_TUTOR` |
| **Upstash Redis** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ALLOW_IN_MEMORY_RATE_LIMIT` |
| **LiveKit & WebRTC** | `VITE_LIVEKIT_URL`, `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `TURN_SERVER_URL`, `COTURN_SERVER_URL`, `TURN_SHARED_SECRET` |
| **Azure Neural TTS** | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`, `EDGE_TTS_ENDPOINT` |

---

## 9. Mục tiêu RPO / RTO Đề xuất & Runbook Phục hồi Thảm họa

### 9.1. Mục tiêu RPO & RTO Thực tế
- **RPO (Recovery Point Objective):**
  - Dữ liệu học tập cá nhân (tiến độ, SRS, bài thi): `<= 24 giờ` với Supabase Daily Backup (hoặc `<= 5 phút` nếu bật PITR); **`0` mất mát** đối với phiên làm việc đang mở trên trình duyệt nhờ `OfflineSyncManager` + `Exam Draft Rescue`.
  - Dữ liệu học liệu tĩnh (180 bài, từ điển, đề thi): **`0`** (quản lý 100% trong Git + script `db:sync`).
- **RTO (Recovery Time Objective):**
  - Lỗi Frontend / Vercel Deploy: **`<= 5 phút`** (Instant Rollback trên Vercel Dashboard).
  - Lỗi Migration SQL cần revert: **`<= 15 phút`** (chạy `ROLLBACK GUIDE` thủ công).
  - Sự cố mất kết nối Supabase / Upstash: **`<= 15–30 phút`** (tự chuyển degrade mode / in-memory fallback có kiểm soát hoặc khôi phục từ Supabase Backup).

### 9.2. Runbook Phục hồi 4 Sự cố Điển hình
1. **(a) Migration SQL lỗi cần Rollback:**
   - Bước 1: Mở file migration tương ứng trong `supabase/migrations/` và đọc mục `ROLLBACK GUIDE`.
   - Bước 2: Chụp snapshot/export bảng bị ảnh hưởng trước khi sửa.
   - Bước 3: Chạy lại định nghĩa View/Function gốc từ file migration trước đó trên Supabase SQL Editor, xác minh lại RLS bằng `scripts/test_52_objects_rls.js`.
2. **(b) Mất / hỏng dữ liệu bảng học tập (`profiles`, `user_vocab_srs`, `hsk_attempts`):**
   - Bước 1: Tạm bật maintenance hoặc khóa ghi API liên quan.
   - Bước 2: Trên Supabase Dashboard → *Database → Backups*, chọn điểm khôi phục gần nhất (Daily Backup hoặc PITR timestamp trước thời điểm sự cố).
   - Bước 3: Đối với dữ liệu tĩnh (`lessons`, `vocabulary`, `hsk_exams`), chạy lại `npm run db:sync` sau khi xác minh DB khỏe mạnh.
3. **(c) Sự cố mất kết nối Supabase / Upstash Redis:**
   - Nếu Upstash Redis gián đoạn: hệ thống fail-closed `HTTP 503` cho các endpoint AI/TTS; trong trường hợp khẩn cấp quy mô nhỏ có thể tạm đặt `ALLOW_IN_MEMORY_RATE_LIMIT=true` trên Vercel Env và redeploy để duy trì dịch vụ có giới hạn.
   - Nếu Supabase gián đoạn: Frontend tự giữ dữ liệu học tập trong `hanzigo_sync_queue_v1_<userId>` (OfflineSyncManager) và tự động đẩy lại khi kết nối phục hồi.
4. **(d) Redeploy khẩn cấp Vercel từ commit ổn định:**
   - Bước 1: Vào Vercel Dashboard → *Deployments* → chọn bản build Production ổn định gần nhất → **Promote to Production / Instant Rollback** (`~30s`).
   - Bước 2: Hoặc từ Git cục bộ, `git revert <bad_commit>` và push lên `main` để CI/Vercel build lại từ nguồn sạch đã qua `npm run build:verify`.

---

## 10. Bộ Test Kiểm chứng Backup & Recovery (`tests/backupDisasterRecoveryPhase39.test.js`)

Đã tạo mới [backupDisasterRecoveryPhase39.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/backupDisasterRecoveryPhase39.test.js) (5 test cases) và đăng ký vào `npm test` trong [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12):
1. `exportUserLearningSnapshot`: cô lập theo `userId`, bỏ qua key `essential` chứa token, giữ đủ `user_vocab_items` & `hsk_attempts`.
2. `GlobalErrorBoundary` Exam Draft Rescue: cô lập `hanzigo_exam_draft_*` theo `userSuffix` và build payload JSON cứu hộ.
3. `OfflineSyncManager`: scope `hanzigo_sync_queue_v1_<userId>` và `hanzigo_sync_failed_v1_<userId>`, giữ `MAX_SYNC_RETRIES = 5`.
4. Hai migration Phase 38 (`20261119_3804` & `20261119_3806`): xác nhận idempotent và có `ROLLBACK GUIDE`.
5. `progressService.js`: xác nhận bảo vệ chống ghi đè `words_learned = 0` và hợp nhất bài học bằng Set union.

---

## 11. Kết quả Kiểm định Tổng thể (`lint`, `test`, `build:verify`)

Chạy ngay sau chỉnh sửa cuối cùng:
- `npm run lint` (`oxlint`): **PASS** (`0` errors)
- `npm test`: **PASS** — **`1191 / 1191`** tests passed (`31` suites, `0` fail, `0` skipped)
- `npm run build:verify`: **PASS**
  - `TOTAL CSS`: **`43.92 KB` gzip** (`<= 45 KB`, mức tăng CSS = **`0.00 KB`**)
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload, không chứa `vendor-livekit` hay `vendor-hanzi`).

---

## 12. Các Tồn đọng Nhỏ (Non-blocking Backlog)

1. **Xác minh trực tiếp cấu hình Backup/PITR trên Supabase Dashboard:** Quản trị viên cần kiểm tra và ghi lại lịch Daily Backup / PITR thực tế của project Production.
2. **Tự động hóa backup bucket `materials`:** Thiết lập lịch đồng bộ định kỳ (weekly cron/rclone) các tài liệu do Admin/GV tải lên sang kho lưu trữ dự phòng.

---

## 13. Trạng thái Bằng chứng & Minh bạch

- **Xác minh trực tiếp trong phiên:** Toàn bộ mã nguồn `OfflineSyncManager.js`, `GlobalErrorBoundary.jsx`, `progressService.js`, `20261119_3804`, `20261119_3806`, `.env.example`, kết quả `oxlint`, `1191 / 1191` unit/integration tests, và `build:verify`.
- **Chưa xác minh do không truy cập Dashboard live:** **`[NOT VERIFIED — NO LIVE SUPABASE DASHBOARD ACCESS]`** (gói backup thực tế và bản chụp gần nhất trên Supabase Production).

---

## 14. Kết luận & Trạng thái Chốt Task 39.07

- **AUDIT COMPLETE**
- **IMPLEMENTATION COMPLETE**
- **TESTS PASSED** (`1191 / 1191`)
- **BUILD VERIFIED** (`TOTAL CSS = 43.92 KB` gzip `<= 45 KB`, `0.00 KB` CSS delta)
- **PRODUCTION VERIFICATION PARTIAL** *(`[NOT VERIFIED — NO LIVE SUPABASE DASHBOARD ACCESS]`)*

**DỪNG TẠI ĐÂY** — chờ bạn đánh giá trước khi chuyển sang **Task 39.08 (Final Production Readiness Audit)**.
