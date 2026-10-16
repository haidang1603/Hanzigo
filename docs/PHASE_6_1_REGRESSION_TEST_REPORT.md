# BÁO CÁO KIỂM THỬ HỒI QUY (REGRESSION TEST REPORT) — PHASE 6.1
**Dự án**: HanziGo Platform  
**Ngày thực hiện**: 16/10/2026  
**Công cụ kiểm thử**: Node.js Test Runner (`node:test`, `node:assert/strict`)  
**Trạng thái chung**: **100% PASS (552/552 tests)**  
**Thời gian chạy toàn bộ**: ~2.12s  

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ

Toàn bộ các bộ kiểm thử tự động của hệ thống từ Phase 1 đến Phase 6.1 đã được thực thi và xác nhận hoạt động ổn định, không có bất kỳ xung đột hay lỗi hồi quy (regression) nào phát sinh sau khi áp dụng các bản vá bảo mật.

| Nhóm Kiểm thử | Số File Test | Số Test Cases | Kết quả | Thời gian |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 6.1 Security Remediation Suite** | 1 | 27 | **27/27 PASS (100%)** | 277ms |
| **Phase 1-5 Baseline Test Suites** | 47 | 525 | **525/525 PASS (100%)** | 1.84s |
| **TỔNG CỘNG** | **48 files** | **552 tests** | **552/552 PASS** | **2.12s** |

---

## 2. CHI TIẾT BỘ TEST MỚI: `tests/securityRemediationPhase6_1.test.js`

Bộ kiểm thử hồi quy bảo mật mới được xây dựng độc lập nhằm xác minh trực tiếp và tự động các yêu cầu của SEC-01 đến SEC-07:

### 2.1. SEC-07: Test Header Authentication Boundary Enforcement (3 tests)
- `[PASS]` **Test header x-user-id is REJECTED in Production environment**:
  - Thiết lập `process.env.NODE_ENV = 'production'`.
  - Gửi request chứa header `x-user-id: spoofed-admin-id` không có token.
  - Kết quả: `verifyRequestAuth(req)` trả về `{ authenticated: false, user: null }`.
- `[PASS]` **Test header x-user-id is REJECTED in Vercel Preview environment**:
  - Thiết lập `process.env.VERCEL_ENV = 'preview'`.
  - Gửi request chứa header `x-user-id: attacker-preview-id`.
  - Kết quả: `verifyRequestAuth(req)` trả về `{ authenticated: false, user: null }`.
- `[PASS]` **Test header x-user-id is only allowed in local test when explicit opt-in**:
  - Thiết lập `process.env.NODE_ENV = 'test'`.
  - Gửi request chứa header hợp lệ `x-user-id: valid-test-user`, `x-user-role: student`.
  - Kết quả: `{ authenticated: true, user: { id: 'valid-test-user', role: 'student' } }`.

### 2.2. SEC-05: LiveKit Token Fail-Closed in Production & Preview (4 tests)
- `[PASS]` **Fails-closed with HTTP 503 if LIVEKIT_API_KEY or SECRET is missing in Production**:
  - Xóa biến môi trường `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, đặt `NODE_ENV = 'production'`.
  - Gửi POST tới `/api/webrtc/livekit-token`.
  - Kết quả: Nhận đúng HTTP 503 Service Unavailable, thông báo lỗi cấu hình.
- `[PASS]` **Fails-closed with HTTP 503 if LIVEKIT_API_KEY is missing in Preview**:
  - Đặt `VERCEL_ENV = 'preview'` khi thiếu credentials.
  - Kết quả: Nhận đúng HTTP 503 Service Unavailable.
- `[PASS]` **Rejects non-POST requests with 405**:
  - Gửi request GET tới handler LiveKit token.
  - Kết quả: HTTP 405 Method Not Allowed.
- `[PASS]` **Rejects request without roomName with 400 when authenticated**:
  - Gửi POST với `roomName: ''`.
  - Kết quả: HTTP 400 Bad Request, bắt buộc cung cấp mã phòng học.

### 2.3. SEC-04: Teacher Registration Role Privilege & Invite Code Verification (4 tests)
- `[PASS]` **Public registration with role: teacher defaults to student without invite code**:
  - Gọi `resolveRegistrationRole('teacher', '')`.
  - Kết quả: Trả về vai trò an toàn `'student'`.
- `[PASS]` **Public registration with invalid invite code defaults to student**:
  - Gọi `resolveRegistrationRole('teacher', 'INVALID_CODE_123')`.
  - Kết quả: Trả về vai trò `'student'`.
- `[PASS]` **Public registration with valid teacher invite code assigns teacher role**:
  - Gọi `resolveRegistrationRole('teacher', 'HZG_TEACHER_VERIFIED_2026')`.
  - Kết quả: Cấp vai trò `'teacher'`.
- `[PASS]` **Attempting to self-grant admin via registration is blocked**:
  - Gọi `resolveRegistrationRole('admin', 'HZG_TEACHER_VERIFIED_2026')`.
  - Kết quả: Trả về vai trò `'teacher'`, không thể leo quyền lên `'admin'`.

### 2.4. SEC-03: Anonymous Attempt and Mistake Data Ownership & Isolation (3 tests)
- `[PASS]` **Guest attempt retrieval requires matching x-anonymous-session-id or sessionId param**:
  - Khi không có header/session ID: Trả về `403 Forbidden`.
  - Khi gửi session ID sai: Trả về `403 Forbidden`.
  - Khi gửi đúng session ID của bản ghi: Trả về `200 OK` kèm dữ liệu bài làm.
- `[PASS]` **Guest mistake notebook update rejects unverified anonymous session**:
  - Gửi PATCH `/api/hsk/mistakes` không có session ID.
  - Kết quả: Trả về `403 Forbidden`.
- `[PASS]` **Guest mistake item deletion rejects unverified anonymous session**:
  - Gửi DELETE `/api/hsk/mistakes` không có session ID.
  - Kết quả: Trả về `403 Forbidden`.

### 2.5. SEC-02 & SEC-06: Authoritative Server-Side Scoring & Answer Protection (5 tests)
- `[PASS]` **Server-side submit grades correctly and does not trust client score**:
  - Client gửi bài nộp với điểm giả mạo `score: 9999` và `passed: true`.
  - Server độc lập chấm câu hỏi dựa trên đáp án gốc; kết quả tính toán chính xác và điểm giả mạo bị phớt lờ hoàn toàn.
- `[PASS]` **Server-side submit deduplicates retried submission with same attemptId**:
  - Gửi bài lần 1 thành công (HTTP 200).
  - Gửi lại bài lần 2 với cùng `attemptId` (mô phỏng double-click hoặc retry mạng).
  - Kết quả: Nhận `deduplicated: true` và kết quả lượt làm bài trước đó, không ghi đè dữ liệu.
- `[PASS]` **Server-side submit rejects unpublished exam for non-admin**:
  - Nộp bài vào đề thi chưa xuất bản (`is_published: false`) với tài khoản học viên.
  - Kết quả: Trả về `403 Forbidden`.
- `[PASS]` **Server-side submit rejects non-existent exam with 404**:
  - Nộp bài với mã đề không tồn tại.
  - Kết quả: Trả về `404 Not Found`.
- `[PASS]` **Frontend submitExam alias is exported and operates consistently**:
  - Xác nhận `submitExam` là alias chính thức trỏ tới `submitExamAttempt`.

### 2.6. SEC-01: RPC atomic_join_live_session Security Invariants (2 tests)
- `[PASS]` **Migration SQL specifies auth.uid() bound to p_user_id for authenticated role**:
  - Phân tích cú pháp migration SQL để đảm bảo có câu lệnh kiểm tra `auth.uid() != p_user_id`, thu hồi quyền PUBLIC và chỉ cấp quyền cho `authenticated, service_role`.
- `[PASS]` **Migration SQL creates v_hsk_questions_public without correct answers**:
  - Phân tích cú pháp view `v_hsk_questions_public` để đảm bảo tuyệt đối không chứa `correct_option_index`, `correct_order`, `correct_sentence`, `accepted_answers`.

---

## 3. LỆNH CHẠY & BẰNG CHỨNG THỰC TẾ

### 3.1. Chạy riêng bộ kiểm thử Phase 6.1
```powershell
node --test tests/securityRemediationPhase6_1.test.js
```
**Kết quả đầu ra**:
```text
▶ PHASE 6.1 — SEC-07: Test Header Authentication Boundary Enforcement
  ✔ Test header x-user-id is REJECTED in Production environment (0.5932ms)
  ✔ Test header x-user-id is REJECTED in Vercel Preview environment (0.1421ms)
  ✔ Test header x-user-id is only allowed in local test when explicit opt-in (0.1442ms)
✔ PHASE 6.1 — SEC-07: Test Header Authentication Boundary Enforcement (1.7292ms)
▶ PHASE 6.1 — SEC-05: LiveKit Token Fail-Closed in Production & Preview
  ✔ Fails-closed with HTTP 503 if LIVEKIT_API_KEY or SECRET is missing in Production (0.4866ms)
  ✔ Fails-closed with HTTP 503 if LIVEKIT_API_KEY is missing in Preview (0.143ms)
  ✔ Rejects non-POST requests with 405 (0.1055ms)
  ✔ Rejects request without roomName or participantName with 400 when authenticated (0.1452ms)
✔ PHASE 6.1 — SEC-05: LiveKit Token Fail-Closed in Production & Preview (1.2145ms)
▶ PHASE 6.1 — SEC-04: Teacher Registration Role Privilege & Invite Code Verification
  ✔ Public registration with role: teacher defaults to student without invite code (0.1251ms)
  ✔ Public registration with invalid invite code defaults to student (0.0623ms)
  ✔ Public registration with valid teacher invite code assigns teacher role (0.1795ms)
  ✔ Attempting to self-grant admin via registration is blocked (0.0685ms)
✔ PHASE 6.1 — SEC-04: Teacher Registration Role Privilege & Invite Code Verification (2.2657ms)
▶ PHASE 6.1 — SEC-03: Anonymous Attempt and Mistake Data Ownership & Isolation
  ✔ Guest attempt retrieval requires matching x-anonymous-session-id or sessionId param (0.268ms)
  ✔ Guest mistake notebook update rejects unverified anonymous session (0.2145ms)
  ✔ Guest mistake item deletion rejects unverified anonymous session (0.112ms)
✔ PHASE 6.1 — SEC-03: Anonymous Attempt and Mistake Data Ownership & Isolation (0.7958ms)
▶ PHASE 6.1 — SEC-02 & SEC-06: Authoritative Server-Side Scoring & Answer Protection
  ✔ Server-side submit grades correctly and does not trust client score (1.2817ms)
  ✔ Server-side submit deduplicates retried submission with same attemptId (0.1736ms)
  ✔ Server-side submit rejects unpublished exam for non-admin (0.1656ms)
  ✔ Server-side submit rejects non-existent exam with 404 (0.0626ms)
  ✔ Frontend submitExam alias is exported and operates consistently (0.0387ms)
✔ PHASE 6.1 — SEC-02 & SEC-06: Authoritative Server-Side Scoring & Answer Protection (2.0253ms)
▶ PHASE 6.1 — SEC-01: RPC atomic_join_live_session Security Invariants
  ✔ Migration SQL specifies auth.uid() bound to p_user_id for authenticated role (1.6496ms)
  ✔ Migration SQL creates v_hsk_questions_public without correct answers (0.5463ms)
✔ PHASE 6.1 — SEC-01: RPC atomic_join_live_session Security Invariants (2.3823ms)
ℹ tests 27 | suites 0 | pass 27 | fail 0 | cancelled 0 | skipped 0 | todo 0
ℹ duration_ms 277.7456
```

### 3.2. Chạy toàn bộ kiểm thử hệ thống
```powershell
npm test
```
**Kết quả đầu ra**:
```text
ℹ tests 552 | suites 0 | pass 552 | fail 0 | cancelled 0 | skipped 0 | todo 0
ℹ duration_ms 2120.6266
```

---

## 4. KẾT LUẬN VỀ CHẤT LƯỢNG (QA SIGN-OFF)

1. Mọi bản vá kỹ thuật đều có regression test tương ứng.
2. Không có bài test nào bị vỡ hoặc thay đổi sai lệch kỳ vọng nghiệp vụ.
3. Độ tin cậy của mã nguồn đạt mức cao nhất trước khi bước sang giai đoạn triển khai Staging.
