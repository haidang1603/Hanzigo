# BÁO CÁO NGHIỆM THU TASK 38.06 — SECURITY & ACCESS CONTROL REVIEW (PHASE 38)

**Ngày hoàn thành:** 19/11/2026  
**Phạm vi:** Xử lý tồn đọng `DQ-HIGH-01` (`create-user.js` `audit_logs`) & `DQ-LOW-02` (`leaderboardService.js`), kiểm toán toàn diện RLS/RPC/Storage Policies, kiểm toán xác thực/phân quyền/rate limit/rò rỉ bí mật trên `api/`, `src/`, `dist/`, xuất migration hardening tương thích ngược kèm Rollback và viết test bảo mật hồi quy.  
**Trạng thái tổng thể:** **PASS (Local Security & Static/Handler Audit Verified — Production Live DB JWT Checks `[NOT VERIFIED — NO LIVE ACCESS]`)**

---

## 1. Thông tin định danh nhiệm vụ (Task Metadata)
- **Phase / Task:** Phase 38 — Task 38.06: Security & Access Control Review
- **Repository:** `https://github.com/haidang1603/Hanzigo.git` (nhánh `main`)
- **Nguyên tắc bảo mật:** Tuyệt đối không đọc, in hoặc ghi giá trị secret/token từ `.env`; không tự chạy migration lên Supabase Production.
- **Hard Stop Gate:** Dừng sau khi hoàn tất báo cáo để chờ người dùng đánh giá trước khi chuyển sang Task 38.07.

---

## 2. Tóm tắt điều hành (Executive Summary)
- **Xử lý `DQ-HIGH-01` (`create-user.js`):** Sửa lệnh ghi `public.audit_logs` sang đúng schema cột (`action`, `category`, `severity`, `actor_id`, `target_id`, `metadata`, `created_at`), bổ sung log cảnh báo khi lỗi thay vì nuốt lỗi, và bổ sung rate limit (`checkRateLimitAndQuota`).
- **Xử lý `DQ-LOW-02` (`leaderboardService.js`):** Xóa bỏ hoàn toàn mọi thao tác đọc/ghi `hanzigo_shared_profiles_cache` và phân vùng `hanzigo_class_members_store` theo `getUserStorageKey`.
- **Vá bảo mật API Live Classroom (`participants.js`):** Bổ sung `verifyRequestAuth(req)` (fail-closed `401` khi ở Production hoặc khi Supabase được cấu hình) để chặn truy cập ẩn danh lấy danh sách thành viên phòng học.
- **Tạo Migration Hardening SQL (`20261119_3806_security_hardening.sql`):** Vá 3 hàm `SECURITY DEFINER` thuộc Phase 27–30 còn thiếu `SET search_path = public, pg_temp` và kiểm tra quyền sở hữu `auth.uid()` (`sync_word_multidimensional_mastery`, `trg_fn_sync_word_multidimensional_mastery`, `update_vocab_dimension_score`).
- **Quét rò rỉ bí mật (`src/` & `dist/`):** Xác nhận **0** chuỗi bí mật server (`SUPABASE_SERVICE_ROLE_KEY`, `LIVEKIT_API_SECRET`, `AZURE_SPEECH_KEY`, `UPSTASH_REDIS_REST_TOKEN`) lọt vào mã nguồn client hoặc bundle build.

---

## 3. Phạm vi kiểm toán & Phương pháp (Audit Scope & Methodology)
1. **API Serverless (`api/`):** Quét toàn bộ router và handler trong `api/admin/`, `api/ai/`, `api/audio/tts.js`, `api/classroom/`, `api/hsk/`, `api/live/`, `api/newsletter/`, `api/_webrtc/` về xác thực token (`verifyRequestAuth`), phân quyền vai trò từ DB (`profiles.role`), rate limiting (`distributedRateLimiter.js`), và giới hạn input.
2. **Database RLS, Policies & RPC (`supabase/`):** Rà soát `supabase/schema.sql` và toàn bộ `44` file migration trong `supabase/migrations/` về `USING (true)` trên `UPDATE`/`DELETE`, `SET search_path` trên các hàm `SECURITY DEFINER`, `REVOKE`/`GRANT EXECUTE`, và `storage.objects` policies.
3. **Client & Build Artifact (`src/`, `dist/`):** Quét tĩnh mã nguồn client và toàn bộ JS bundle đã build để bảo đảm zero secret leakage.

---

## 4. Xử lý tồn đọng bảo mật từ Task 38.01 & 38.03
1. **[api/_handlers/admin/create-user.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/admin/create-user.js) (`DQ-HIGH-01`):**
   - Trước đây: ghi `audit_logs` với cột sai `user_id` và `details` (bảng `public.audit_logs` trong `supabase/schema.sql` dùng `actor_id`, `target_id`, `action`, `category`, `severity`, `metadata`, `created_at`) và dùng `catch {}` nuốt lỗi im lặng.
   - Sau sửa: ghi đúng schema cột `public.audit_logs`, kiểm tra `auditError` và ghi `console.warn`, đồng thời bổ sung `checkRateLimitAndQuota` (`20 req/min`, `200 req/day`, prefix `admin_create_user`).
2. **[src/services/leaderboardService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/leaderboardService.js) (`DQ-LOW-02`):**
   - Trước đây: còn đọc và ghi `hanzigo_shared_profiles_cache` gây rò rỉ metadata nhiều tài khoản trên trình duyệt dùng chung.
   - Sau sửa: gỡ bỏ hoàn toàn `hanzigo_shared_profiles_cache` ở cả nhánh đọc và ghi; phân vùng `hanzigo_class_members_store` qua `getUserStorageKey`.

---

## 5. Kết quả kiểm toán Authentication, Authorization & Rate Limiting (`api/`)
- **Admin Endpoints (`api/admin/*`):** `create-user.js` xác thực JWT qua `verifyRequestAuth(req)` (`401`), kiểm tra `auth.user.role === 'admin'` & `status !== 'blocked'` từ DB (`403`), cấm tạo role `admin` (`400`), và áp dụng rate limiting.
- **Classroom & Live Endpoints (`api/classroom/*`, `api/live/*`, `api/_webrtc/*`):**
  - `create.js`, `join.js`, `remove.js`, `members.js`, `assignments.js`, `session.js`, `leave.js`, `moderation.js`, `end.js`, `livekit-token.js`, `ice-servers.js` đều kiểm tra `verifyRequestAuth`.
  - **Lỗ hổng phát hiện & đã vá:** [api/_handlers/live/participants.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/live/participants.js) trước đây không kiểm tra xác thực mà dùng `getSupabaseAdminClient()` trả về danh sách thành viên phiên học. Đã bổ sung `verifyRequestAuth(req)` fail-closed `401` khi ở Production hoặc khi Supabase được cấu hình.
- **AI & TTS Endpoints (`api/ai/*`, `api/audio/tts.js`):**
  - `chat.js`, `coach.js`, `personalize.js`, `roleplay.js`, `teacher.js`, `tutor.js`, `api/audio/tts.js` có cả `verifyRequestAuth` và `checkRateLimitAndQuota`.
  - `grade.js` và `pronunciation.js` phục vụ chế độ luyện tập tự do có áp dụng `checkRateLimitAndQuota` theo IP/user và giới hạn độ dài input (`MAX_TEXT_LEN`, `MAX_AUDIO_BASE64_LEN`).

---

## 6. Kết quả kiểm toán Supabase RLS, Policies & Storage (`supabase/`)
- **RLS Policies (`USING`/`WITH CHECK`):** Quét toàn bộ `44` migration không phát hiện policy `UPDATE`/`DELETE` nào dùng `USING (true)` trên dữ liệu riêng tư người dùng. Các bảng học tập (`profiles`, `user_vocab_srs`, `user_vocab_items`, `user_lesson_progress`, `hsk_attempts`) gắn điều kiện sở hữu `auth.uid() = user_id` / `public.is_admin()`.
- **Storage Policies (`storage.objects`):**
  - Bucket `materials` ([20261108_storage_and_materials_metadata.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_storage_and_materials_metadata.sql)): yêu cầu `authenticated`, phân quyền `SELECT`/`INSERT`/`UPDATE`/`DELETE` theo `public.is_admin()` hoặc quyền sở hữu lớp học/tài liệu.
  - Bucket `tts-audio-cache` ([20261114_3201_tts_audio_cache.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261114_3201_tts_audio_cache.sql)): `SELECT` cho `anon, authenticated`; mọi thao tác ghi/xóa (`INSERT`, `UPDATE`, `DELETE`) chỉ cấp cho `service_role`.

---

## 7. Kết quả kiểm toán `SECURITY DEFINER` & Migration Hardening SQL
- **Phát hiện khi audit `44` file migration:**
  - Phần lớn hàm `SECURITY DEFINER` cốt lõi (`is_admin`, `is_classroom_teacher`, `get_student_activity_heatmap`, `get_user_telemetry_dashboard_summary`, ...) đã có `SET search_path`.
  - Tuy nhiên, 3 hàm thuộc Phase 27–30 trong `20261112_2708_unified_ecosystem.sql` và `20261113_master_seed_and_reconciliation_p27_29_30.sql` **thiếu `SET search_path`** và **thiếu kiểm tra `auth.uid()`** khi nhận tham số `p_user_id`:
    1. `public.sync_word_multidimensional_mastery(UUID, TEXT, TEXT, NUMERIC)`
    2. `public.trg_fn_sync_word_multidimensional_mastery()`
    3. `public.update_vocab_dimension_score(UUID, TEXT, TEXT, SMALLINT)`
- **Khắc phục:** Tạo migration tương thích ngược [supabase/migrations/20261119_3806_security_hardening.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261119_3806_security_hardening.sql) (kèm `ROLLBACK GUIDE`, **chưa chạy lên Production**):
  - Bổ sung `SET search_path = public, pg_temp` cho cả 3 hàm.
  - Bổ sung kiểm tra `IF auth.uid() IS NOT NULL AND p_user_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN RAISE EXCEPTION ...` ở 2 hàm RPC.
  - `REVOKE ALL ... FROM PUBLIC, anon` và cấp `GRANT EXECUTE` đúng đối tượng (`authenticated, service_role` cho RPC; `service_role` cho trigger function).

---

## 8. Kiểm toán rò rỉ bí mật (Secret Exposure Scan)
- Đã quét toàn bộ tệp nguồn trong `src/` và toàn bộ tệp bundle build trong `dist/` đối với các biến/tên khóa nhạy cảm:
  - `SUPABASE_SERVICE_ROLE_KEY`: **0 kết quả**
  - `LIVEKIT_API_SECRET`: **0 kết quả**
  - `AZURE_SPEECH_KEY`: **0 kết quả**
  - `UPSTASH_REDIS_REST_TOKEN`: **0 kết quả**
- Không in hoặc ghi bất kỳ giá trị `.env` nào vào code, test hay báo cáo.

---

## 9. Kiểm thử bảo mật tự động (`tests/securityAccessControlPhase38.test.js`)
Đã tạo mới [tests/securityAccessControlPhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/securityAccessControlPhase38.test.js) (đã đăng ký vào [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json), **5/5 pass**):
1. `createUserHandler` và `participantsHandler` từ chối request thiếu token với `401` trong chế độ Production fail-closed.
2. `create-user.js` ghi `audit_logs` đúng cột `actor_id`, `target_id`, `metadata` (không dùng `user_id`/`details`) và có rate limiting.
3. `leaderboardService.js` không còn tham chiếu `hanzigo_shared_profiles_cache`.
4. `20261119_3806_security_hardening.sql` vá đủ 3 hàm `SECURITY DEFINER` với `SET search_path = public, pg_temp`, kiểm tra `auth.uid()`/`is_admin()`, và có `ROLLBACK GUIDE`.
5. Quét toàn bộ `src/` và `dist/` xác nhận 0 bí mật server bị lộ.

---

## 10. Kết quả Verification (`lint`, `test`, `build:verify`) — Trước & Sau
| Kiểm tra | Trước Task 38.06 (sau 38.05) | Sau Task 38.06 (lần chạy cuối) | Trạng thái |
| :--- | :--- | :--- | :--- |
| `npm run lint` (`oxlint`) | `0 errors`, `731 warnings` (`602 files`) | `0 errors`, `731 warnings` (`603 files`, `390ms`) | `PASS` |
| `npm run build:verify` | `PASS` (100% chunk đạt ngưỡng) | `PASS` (100% chunk đạt ngưỡng, `18` preload/script tags sạch) | `PASS` |
| `npm test` (`node --test`) | `1159/1159 pass` (`31 suites`) | **`1164/1164 pass`**, `0 fail`, `0 skipped` (`31 suites`, `23578.8738ms`) | `PASS` |

---

## 11. Xác minh trên Production Live (Supabase Postgres / Vercel Live)
- Kiểm thử JWT thật trực tiếp trên Postgres RLS/RPC Production và quét endpoint live trên `https://hanzigo-xi.vercel.app`: **`[NOT VERIFIED — NO LIVE ACCESS]`** (môi trường kiểm thử local không chạy migration và không thực thi pentest trực tiếp lên Production DB).

---

## 12. Các tệp đã tạo / chỉnh sửa
- [api/_handlers/admin/create-user.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/admin/create-user.js)
- [api/_handlers/live/participants.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/live/participants.js)
- [src/services/leaderboardService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/leaderboardService.js)
- [supabase/migrations/20261119_3806_security_hardening.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261119_3806_security_hardening.sql) (mới, chưa chạy Production)
- [tests/securityAccessControlPhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/securityAccessControlPhase38.test.js) (mới)
- [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json)

---

## 13. Ràng buộc phạm vi (Scope Guardrails)
- Không sửa `GlobalErrorBoundary` hay hệ thống Error Reporter (giữ cho Task 38.07).
- Không thay đổi công thức chấm điểm CBT hoặc thuật toán SM-2.
- Không tự chạy migration `20261119_3806_security_hardening.sql` lên Supabase Production.

---

## 14. Rủi ro còn lại & Khuyến nghị vận hành
1. Cần review và áp dụng có kiểm soát 2 file migration tương thích ngược (`20261119_3804_learning_progress_integrity.sql` và `20261119_3806_security_hardening.sql`) lên Supabase Production trong cửa sổ bảo trì.
2. Hai endpoint luyện tập tự do `api/_handlers/ai/grade.js` và `api/_handlers/ai/pronunciation.js` hiện cho phép gọi ở chế độ khách (chỉ có rate limit theo IP); nếu muốn siết chặt hơn chi phí AI về sau, cân nhắc yêu cầu Bearer token tương tự `chat.js`/`tutor.js`.

---

## 15. Kết luận & Trạng thái Hard Stop Gate
- **Trạng thái:** `IMPLEMENTATION COMPLETE` | `TESTS PASSED` | `BUILD VERIFIED` | `SECURITY VERIFICATION PARTIAL` | `PRODUCTION VERIFICATION PARTIAL`
- **Hard Stop Gate:** Đã hoàn tất báo cáo **Task 38.06**, dừng lại chờ bạn đánh giá và phê duyệt trước khi chuyển sang **Task 38.07**.
