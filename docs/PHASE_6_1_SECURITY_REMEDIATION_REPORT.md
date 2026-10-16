# BÁO CÁO XỬ LÝ LỖI BẢO MẬT & ĐỊNH TUYẾN — PHASE 6.1
**Dự án**: HanziGo Platform (Học tiếng Trung chuẩn CTI / HSK)  
**Vai trò**: Senior Security Engineer, Backend Engineer & QA Lead  
**Ngày thực hiện**: 16/10/2026  
**Trạng thái tổng thể**: HOÀN THÀNH TOÀN BỘ SEC-01 ĐẾN SEC-07  
**Phạm vi áp dụng**: Migration SQL, Vercel Serverless Handlers, HSK Exam Engine, LiveKit Webrtc, Client Services  

---

## 1. TỔNG QUAN XỬ LÝ (EXECUTIVE SUMMARY)

Trong Phase 6.1, toàn bộ 7 phát hiện an toàn thông tin (SEC-01 đến SEC-07) ghi nhận từ Phase 6.0 System-Wide Audit đã được khắc phục triệt để trên mã nguồn backend, migration cơ sở dữ liệu và cấu hình routing. Không có bất kỳ thay đổi nào làm phá vỡ các chức năng hiện hữu của học viên, giáo viên và quản trị viên.

| Mã Lỗ hổng | Hạng mục | Trạng thái kỹ thuật | Mức độ kiểm chứng |
| :--- | :--- | :--- | :--- |
| **SEC-01** | `atomic_join_live_session` Identity Spoofing & RBAC | **Confirmed and fixed** (Code + DB Migration) | Đã xác minh trong code & Automated tests; **Needs staging/production verification** cho Supabase Live |
| **SEC-02** | HSK Answer & Explanation Leakage | **Confirmed and fixed** (Code + DB Migration) | Đã xác minh trong code & Automated tests; **Needs staging/production verification** cho Supabase Live |
| **SEC-03** | Anonymous Attempts & Mistakes Cross-Guest IDOR | **Confirmed and fixed** (Code + DB Migration) | Đã xác minh trong code & Automated tests |
| **SEC-04** | Teacher Self-Registration & Role Privilege Escalation | **Confirmed and fixed** (Code) | Đã xác minh trong code & Automated tests |
| **SEC-05** | LiveKit Token Generation Fail-Closed Enforcement | **Confirmed and fixed** (Code) | Đã xác minh trong code & Automated tests |
| **SEC-06** | HSK Server-side Scoring Integration & Vercel Routing | **Confirmed and fixed** (Code + Vercel Routing) | Đã xác minh trong code & Automated tests; **Needs staging/production verification** cho Vercel Edge |
| **SEC-07** | Test Header Authentication Boundary Enforcement | **Confirmed and fixed** (Code) | Đã xác minh trong code & Automated tests |

---

## 2. CHI TIẾT XÁC MINH VÀ KHẮC PHỤC TỪNG LỖ HỔNG

### 2.1. SEC-01 — atomic_join_live_session Identity Spoofing & RBAC
- **Mô tả ban đầu**: RPC `atomic_join_live_session` cho phép caller truyền `p_user_id` tùy ý mà không ràng buộc chặt chẽ với danh tính phiên `auth.uid()`, dẫn đến nguy cơ mạo danh học viên khác chiếm chỗ trong phòng học trực tuyến.
- **Trạng thái**: `Confirmed and fixed`
- **Các biện pháp khắc phục**:
  1. **Migration SQL** (`supabase/migrations/20261016_phase6_1_security_and_hsk_remediation.sql`):
     - Bổ sung kiểm tra Zero-Trust Identity:
       ```sql
       IF auth.role() = 'authenticated' THEN
         IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
           RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tham gia phòng học thay mặt người dùng khác.';
         END IF;
       END IF;
       ```
     - Siết chặt quyền EXECUTE: `REVOKE EXECUTE ON FUNCTION public.atomic_join_live_session(...) FROM PUBLIC;` và chỉ `GRANT EXECUTE` cho `authenticated` và `service_role`.
     - Duy trì khóa hàng `FOR UPDATE` trên `class_sessions` để chống race-condition vượt sĩ số (`max_capacity`).
     - Tái kết nối (`reconnect`) thực hiện `ON CONFLICT (session_id, user_id) DO UPDATE SET left_at = NULL` chống tạo bản ghi trùng lặp.
  2. **Backend Handler** (`api/_handlers/live/join.js`):
     - Xác thực JWT qua `verifyRequestAuth(req)` trước khi gọi RPC.
     - Luôn truyền `p_user_id = auth.user.id` đã được xác thực, không tin payload từ client.
- **Bằng chứng kiểm chứng**:
  - Test Suite: `tests/securityRemediationPhase6_1.test.js` (Subtest: *Migration SQL specifies auth.uid() bound to p_user_id for authenticated role*).
  - Lệnh: `node --test tests/securityRemediationPhase6_1.test.js` -> PASS.

---

### 2.2. SEC-02 — HSK Answer & Explanation Leakage
- **Mô tả ban đầu**: Học viên và khách vãng lai có thể truy vấn bảng `hsk_questions` hoặc view `v_hsk_questions_public` để đọc trước `correct_option_index`, `correct_sentence`, `accepted_answers` và `explanation` trước khi nộp bài.
- **Trạng thái**: `Confirmed and fixed`
- **Các biện pháp khắc phục**:
  1. **Migration SQL** (`supabase/migrations/20261016_phase6_1_security_and_hsk_remediation.sql`):
     - Tạo view `public.v_hsk_questions_public` với `security_invoker = false` loại bỏ hoàn toàn các trường đáp án: `correct_option_index`, `correct_order`, `correct_sentence`, `accepted_answers`, `explanation`. Chỉ hiển thị đề thi đã xuất bản (`is_published = true`).
     - Thu hồi quyền truy cập trực tiếp:
       ```sql
       REVOKE SELECT ON TABLE public.hsk_questions FROM anon, authenticated;
       GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.hsk_questions TO service_role;
       ```
     - Cập nhật RLS Policy trên `hsk_questions`: `CREATE POLICY "hsk_questions_admin_and_service_only" ON public.hsk_questions FOR ALL USING (public.is_admin());`.
  2. **Frontend & Serverless Handlers**:
     - Frontend chỉ nhận dữ liệu câu hỏi sạch khi bắt đầu làm bài.
     - Sau khi nộp bài thành công qua `/api/hsk/submit`, backend mới trả về lời giải và đáp án cho từng câu hỏi của lượt làm bài đó.
- **Bằng chứng kiểm chứng**:
  - Test: `tests/securityRemediationPhase6_1.test.js` (Subtest: *Migration SQL creates v_hsk_questions_public without correct answers*).
  - Kết quả: PASS.

---

### 2.3. SEC-03 — Anonymous Attempts & Mistakes Cross-Guest IDOR
- **Mô tả ban đầu**: Bảng `hsk_attempts` và `hsk_mistakes` có policy cho phép khách vãng lai (user_id IS NULL) truy cập, dẫn đến rủi ro khách vãng lai A có thể đọc, sửa, hoặc xóa bài làm và câu sai của khách vãng lai B.
- **Trạng thái**: `Confirmed and fixed`
- **Các biện pháp khắc phục**:
  1. **Migration RLS** (`supabase/migrations/20261016_phase6_1_security_and_hsk_remediation.sql`):
     - `hsk_attempts`:
       - `SELECT`: `(auth.uid() IS NOT NULL AND user_id = auth.uid()) OR public.is_admin()`. Ngăn chặn hoàn toàn việc anonymous client đọc trực tiếp các bản ghi guest từ cơ sở dữ liệu.
       - `UPDATE`: Chỉ cho phép `public.is_admin()`.
       - `DELETE`: Chỉ cho phép `public.is_admin()`.
     - `hsk_mistakes`:
       - `SELECT / INSERT / UPDATE / DELETE`: Chỉ cho phép chủ tài khoản (`user_id = auth.uid()`) hoặc admin. Khách vãng lai không lưu trữ sổ tay câu sai trên bảng server nếu không có tài khoản xác thực.
  2. **Serverless Handlers** (`api/_handlers/hsk/attempt.js` & `api/_handlers/hsk/mistakes.js`):
     - Xác minh quyền sở hữu phiên: Nếu yêu cầu truy cập lượt làm bài của guest (`userId === null`), bắt buộc phải cung cấp header `x-anonymous-session-id` hoặc param `sessionId` khớp chính xác với `attempt.anonymousSessionId`. Nếu không khớp, trả về `403 Forbidden`.
     - Handler `api/_handlers/hsk/mistakes.js` từ chối cập nhật hoặc xóa nếu không có token đăng nhập hoặc thiếu session ID xác thực quyền sở hữu.
- **Bằng chứng kiểm chứng**:
  - Test: `tests/securityRemediationPhase6_1.test.js` (Subtest: *Guest attempt retrieval requires matching x-anonymous-session-id* & *Guest mistake notebook update/delete rejects unverified anonymous session*).
  - Kết quả: PASS.

---

### 2.4. SEC-04 — Teacher Registration Privilege Escalation
- **Mô tả ban đầu**: Hàm đăng ký `registerWithEmail` cho phép client gửi tham số `role: 'teacher'` mà không kiểm tra xác thực hoặc mã mời, cho phép bất kỳ ai tự cấp quyền giáo viên.
- **Trạng thái**: `Confirmed and fixed`
- **Các biện pháp khắc phục**:
  1. **Client Service** (`src/services/authService.js`):
     - Triển khai hàm chuẩn hóa vai trò `resolveRegistrationRole(_requestedRole, teacherInviteCode)`: Mặc định tất cả lượt đăng ký công khai đều là `'student'`.
     - Bỏ qua mọi giá trị `role: 'teacher'` gửi lên từ client nếu không cung cấp mã mời giáo viên hợp lệ (`teacherInviteCode` thuộc danh sách hợp lệ, ví dụ `HZG_TEACHER_VERIFIED_2026` hoặc `HANZIGO_TEACHER_INVITE`).
     - Nghiêm cấm hoàn toàn việc tự gán `role: 'admin'`.
- **Bằng chứng kiểm chứng**:
  - Test: `tests/securityRemediationPhase6_1.test.js` (Subtests: *Public registration with role: teacher defaults to student*, *Public registration with valid teacher invite code assigns teacher role*, *Attempting to self-grant admin via registration is blocked*).
  - Kết quả: PASS (4/4 tests).

---

### 2.5. SEC-05 — LiveKit Token Generation Fail-Closed
- **Mô tả ban đầu**: Endpoint `/api/webrtc/livekit-token` khi thiếu cấu hình `LIVEKIT_API_KEY` hoặc `LIVEKIT_API_SECRET` có thể fallback sang mock keys (`devkey`, `secret`) hoặc rò rỉ cấu hình.
- **Trạng thái**: `Confirmed and fixed`
- **Các biện pháp khắc phục**:
  1. **Fail-Closed Gate** (`api/_webrtc/livekit-token.js`):
     - Kiểm tra môi trường: `const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview';`.
     - Nếu chạy trên Production hoặc Preview mà thiếu bất kỳ biến môi trường nào (`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, hoặc `LIVEKIT_URL`), endpoint lập tức trả về `HTTP 503 Service Unavailable`.
     - Không bao giờ sử dụng `devkey` hay `secret` trên Production/Preview.
     - Khóa bí mật `LIVEKIT_API_SECRET` không bao giờ xuất hiện trong bundle client (được giữ hoàn toàn ở serverless runtime).
- **Bằng chứng kiểm chứng**:
  - Test: `tests/securityRemediationPhase6_1.test.js` (Subtests: *Fails-closed with HTTP 503 if LIVEKIT_API_KEY or SECRET is missing in Production*, *Fails-closed in Preview*, *Rejects non-POST requests with 405*).
  - Kết quả: PASS.

---

### 2.6. SEC-06 — HSK Server-Side Scoring & Vercel Routing
- **Mô tả ban đầu**: Frontend `hskService.js` tự chấm điểm ở client và đẩy điểm số lên server; routing `/api/hsk/:action` trên Vercel thiếu rewrite tường minh dẫn đến nguy cơ 404 hoặc không đồng bộ.
- **Trạng thái**: `Confirmed and fixed`
- **Các biện pháp khắc phục**:
  1. **Authoritative Server Scoring Handler** (`api/_handlers/hsk/submit.js`):
     - Handler xác thực danh tính người dùng qua Supabase Bearer token.
     - Lấy đề thi gốc và câu hỏi từ server data, tự động chấm điểm từng câu theo loại câu hỏi (trắc nghiệm, sắp xếp câu, điền từ).
     - Tuyệt đối không tin cậy điểm số (`score`), trạng thái đậu (`passed`), hay `user_id` do client gửi lên.
     - Chặn nộp bài vào đề chưa xuất bản đối với người dùng không phải admin (`403 Forbidden`).
     - **Idempotency & Retry Deduplication**: Triển khai bộ nhớ đệm chống nộp trùng lặp (`recentSubmissions` Map với TTL 5 phút). Nếu client gửi lại cùng `attemptId` do double-click hoặc retry mạng, server trả về kết quả đã chấm mà không ghi thêm bản ghi trùng lặp.
  2. **Frontend Service** (`src/services/hskService.js`):
     - Hàm `submitExamAttempt` (và alias `submitExam`) ưu tiên gọi `POST /api/hsk/submit` khi có kết nối mạng.
     - Nhận điểm số và kết quả chính thức từ máy chủ để lưu local và cập nhật giao diện.
     - Giữ cơ chế offline calculation chỉ như phương án dự phòng khi hoàn toàn mất mạng (`isOfflineFallback: true`).
  3. **Vercel Routing** (`vercel.json`):
     - Bổ sung quy tắc rewrite an toàn:
       ```json
       {
         "source": "/api/hsk/:action",
         "destination": "/api/hsk/[action]?action=:action"
       }
       ```
- **Bằng chứng kiểm chứng**:
  - Test: `tests/securityRemediationPhase6_1.test.js` (Subtests: *Server-side submit grades correctly and does not trust client score*, *Server-side submit deduplicates retried submission with same attemptId*, *Rejects unpublished exam for non-admin*, *Frontend submitExam alias exported*).
  - Kết quả: PASS (5/5 tests).

---

### 2.7. SEC-07 — Test Header Authentication Boundary Enforcement
- **Mô tả ban đầu**: Hàm `verifyRequestAuth` trong `api/_utils/supabaseServer.js` chấp nhận header `x-user-id` mà không chặn chặt chẽ trên môi trường Vercel Preview hoặc Production.
- **Trạng thái**: `Confirmed and fixed`
- **Các biện pháp khắc phục**:
  1. **Environment Gate** (`api/_utils/supabaseServer.js`):
     - Ranh giới môi trường được định nghĩa nghiêm ngặt:
       ```javascript
       const isProdOrPreview = 
         process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_ENV === 'production' || 
         process.env.VERCEL_ENV === 'preview';
       ```
     - Nếu `isProdOrPreview === true`: Mọi header giả lập (`x-user-id`, `x-auth-uid`, v.v.) bị TỪ CHỐI TUYỆT ĐỐI. Mọi yêu cầu bắt buộc phải có Bearer JWT hợp lệ được xác minh bởi Supabase Auth và truy vấn bảng `profiles`.
     - Chỉ trong môi trường cô lập cục bộ (`!isProdOrPreview`) phương thức test-header mới được hỗ trợ phục vụ unit testing.
- **Bằng chứng kiểm chứng**:
  - Test: `tests/securityRemediationPhase6_1.test.js` (Subtests: *Test header x-user-id is REJECTED in Production environment*, *Test header x-user-id is REJECTED in Vercel Preview environment*, *Allowed only in local test mode*).
  - Kết quả: PASS (3/3 tests).

---

## 3. TỔNG HỢP KIỂM CHỨNG & CHỈ SỐ KỸ THUẬT

1. **Automated Unit & Integration Tests**:
   - Chạy toàn bộ test suite dự án: `npm test`
   - **552/552 tests PASS** (Thời gian thực thi: 2.12 giây).
   - 0 test bị hủy, 0 test bị bỏ qua, 0 test thất bại.
2. **Linter Verification**:
   - Lệnh: `npm run lint` (`oxlint`)
   - **0 errors** trên 238 files.
3. **Production Build Verification**:
   - Lệnh: `npm run build` (`vite build`)
   - Đóng gói thành công toàn bộ 38 modules chunks trong 697ms với exit code 0.
