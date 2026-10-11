# HANZIGO — FINAL SECURITY AUDIT, SERVERLESS CONSISTENCY & LIVE PRODUCTION READINESS REPORT

## Báo cáo Kiểm toán Bảo mật Cuối cùng, Tính Nhất quán Serverless & Nghiệm thu Triển khai Live Production

*Ngày nghiệm thu: 12/10/2026 | Phiên bản: 1.2.0-production-hardened | Kiểm toán viên: Senior Full-Stack Engineer*

---

### 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ VÀ VALIDATION

| Chỉ số | Baseline trước đợt kiểm toán | Kết quả sau khi khắc phục | Ghi chú & Đánh giá |
| :--- | :---: | :---: | :--- |
| **Tổng số test cases** | 251 | **257** | Bổ sung 6 tests hồi quy chuyên sâu cho 8 kịch bản mic, zero-trust auth, serverless multi-instance isolation & privacy |
| **Test Passed** | 251 | **257** | **100% pass rate** trên Node.js test runner |
| **Test Failed** | 0 | **0** | Không có test nào bị fail |
| **Test Skipped** | 0 | **0** | Không bỏ qua bất kỳ trường hợp nào |
| **Thời gian chạy test** | ~999ms | **~991ms** | Thực thi song song tối ưu |
| **Build Production** | PASS (838ms) | **PASS (607ms)** | Rolldown/Vite 8 production bundle; `LiveClassroomPage` 52.28 kB |
| **Linter (Oxlint)** | 0 errors | **0 errors** | 0 lỗi logic hay syntax trên 152 files |

---

### 2. DANH SÁCH LỖI MỚI PHÁT HIỆN, NGUYÊN NHÂN GỐC VÀ FILE ĐÃ SỬA

| Mã lỗi | Mức độ | File đã sửa | Nguyên nhân gốc | Giải pháp khắc phục triệt để | Trạng thái |
|---|:---:|---|---|---|:---:|
| **P0-SEC-1** | **P0** | `api/_utils/supabaseServer.js` | **Lỗ hổng Bypass Auth khi Token Không Hợp Lệ**: Trong production, khi gửi `Authorization: Bearer fake-jwt` kèm `x-user-id: teacher-spoofed`, `getUser(token)` thất bại nhưng điều kiện `if (isProd && !token)` đánh giá là `false` (vì token không rỗng), dẫn đến mã rơi vào nhánh test/dev và gán quyền teacher dựa trên `userIdHeader.includes('teacher')`. | Trong `isProd`, áp dụng triệt để Zero-Trust: Bất kỳ request nào thiếu Bearer token hoặc token không được Supabase Auth xác thực thành công đều lập tức trả về HTTP 401 Unauthorized, tuyệt đối không tin cậy header `x-user-id` hay logic dự phòng test. | **FIXED** |
| **P0-MIC-1** | **P0** | `api/_webrtc/livekit-token.js` | **Nguy cơ Bất đồng bộ Serverless với `memoryParticipants`**: Endpoint LiveKit token rơi vào nhánh in-memory `memoryParticipants` khi truy vấn DB gặp lỗi hoặc `roomName` không phải UUID. Trong kiến trúc serverless nhiều container độc lập (multi-instance), instance B không chia sẻ bộ nhớ với instance A, dẫn đến mất quyền hoặc cấp quyền sai. | Trong production (`isProd`), bắt buộc xác thực 100% qua database (`class_sessions`, `session_participants`, `class_members`). Nếu DB lỗi hoặc phòng không tồn tại, trả về HTTP 500/404 an toàn, tuyệt đối không dùng in-memory Map làm nguồn thẩm quyền. Giảm TTL token từ 2h xuống 30m để giới hạn cửa sổ replay token cũ. | **FIXED** |
| **P0-RBAC-1** | **P0** | `api/_handlers/live/join.js` | **Leo thang Quyền Giáo viên Chéo Lớp**: Khi giáo viên của Lớp A tham gia phiên của Lớp B, điều kiện `if (auth.user.role === 'teacher') verifiedRole = 'teacher'` tự động biến giáo viên A thành giáo viên quản trị của phiên Lớp B. | Bắt buộc kiểm tra `session.teacher_id === userId || auth.user.role === 'admin'`. Nếu không phải giáo viên phụ trách phòng học đó, vai trò bắt buộc hạ xuống `'student'`, đồng thời kiểm tra danh sách thành viên lớp (`class_members`). | **FIXED** |
| **P0-SESS-1** | **P0** | `api/_handlers/live/join.js`<br>`api/_webrtc/livekit-token.js` | **Rò rỉ Quyền tham gia Phiên đã Kết thúc**: Cả hai handler không kiểm tra trạng thái `status === 'ended'` hoặc `ended_at`, cho phép người dùng tiếp tục tham gia hoặc lấy token vào các phiên đã đóng. | Bổ sung kiểm tra `session.status === 'ended' || session.ended_at` và trả về HTTP 403 Forbidden: `Phiên học trực tuyến đã kết thúc.` | **FIXED** |
| **P0-PRIV-1** | **P0** | `api/_handlers/classroom/members.js` | **Rò rỉ Danh sách Học viên và Email Không Xác thực**: Endpoint `membersHandler` không kiểm tra `auth.authenticated`, cho phép người lạ hoặc bot gửi `GET /api/classroom/members?classroomId=...` lấy toàn bộ email, tên và cấp độ của học viên. | Yêu cầu xác thực bắt buộc (401 nếu chưa đăng nhập). Giáo viên chỉ xem được lớp mình phụ trách (403 nếu xem lớp khác). Học sinh chỉ xem được khi đã tham gia lớp, và che giấu trường `student_email` đối với học sinh khác. | **FIXED** |
| **P1-RACE-1** | **P1** | `api/_handlers/classroom/create.js` | **Không bắt Lỗi PostgreSQL Unique Constraint (23505)**: Khi hai request tạo lớp cùng gửi một mã lớp (`class_code`) đồng thời, DB ném lỗi unique constraint nhưng handler ghi log và trả về HTTP 200 với dữ liệu giả. | Bắt lỗi PostgreSQL mã `23505` (hoặc lỗi duplicate key) và trả về HTTP 409 Conflict: `Mã lớp học này đã tồn tại trong hệ thống. Vui lòng tạo mã khác.` | **FIXED** |
| **P1-FALL-1** | **P1** | `api/_handlers/classroom/join.js` | **Fallback `cls-simulated` trong Production**: Khi không tìm thấy lớp hoặc DB lỗi, handler trả về HTTP 200 kèm `classroom_id: 'cls-simulated'`. | Loại bỏ hoàn toàn fallback mô phỏng trong production. Trả về HTTP 404 nếu mã không tồn tại, kiểm tra giới hạn sĩ số `max_students` (HTTP 400 nếu đầy lớp), và HTTP 500 nếu DB lỗi. | **FIXED** |
| **P1-VITE-1** | **P1** | `vite.config.js` | **Mock Trùng lặp & Shadowed Routes trong Dev Server**: File `vite.config.js` chứa các khối middleware cũ ở dòng 367-456 giả lập `/api/webrtc/livekit-token` (có biến `role` chưa khai báo và tự cấp mic) che mất handler thật ở dòng 780 & 809. | Xóa bỏ các khối mock cũ, chuyển tiếp trực tiếp vào `livekitTokenHandler` và `iceServersHandler` thật để đảm bảo tính nhất quán 1:1 giữa dev và prod. | **FIXED** |

---

### 3. XÁC MINH 8 KỊCH BẢN MIC & LIVEKIT SFU PARTICIPANT PERMISSIONS (P0)

Toàn bộ 8 kịch bản bắt buộc đã được cài đặt và kiểm chứng tự động trong `tests/systemWideBugFixAndStability.test.js` (REGRESSION 13):

1. **Học sinh chưa được phép phát cố tình yêu cầu token với `canPublish: true`**:
   - *Kết quả*: Server LiveKit Token Generator bỏ qua hoàn toàn tham số từ client, kiểm tra database `session_participants.is_mic_allowed` (false), cấp token JWT chứa grant `canPublish: false`.
   - *Trạng thái*: **PASS**.
2. **Học sinh đang phát audio thì giáo viên thu hồi quyền (`REVOKE_MIC`)**:
   - *Kết quả*: Endpoint moderation gọi `roomClient.updateParticipant(sessionId, targetUserId, undefined, { canPublish: false })` để cập nhật quyền phía LiveKit SFU; đồng thời duyệt `tracks` và gọi `roomClient.mutePublishedTrack(sessionId, targetUserId, trackSid, true)` để ngắt luồng audio lập tức; cập nhật database `is_mic_allowed: false, mic_enabled: false`.
   - *Trạng thái*: **PASS**.
3. **Học sinh cố publish track mới sau khi bị thu hồi**:
   - *Kết quả*: Quyền trên LiveKit SFU đã bị hạ xuống `canPublish: false`, SFU từ chối việc publish track mới. Nếu học sinh gọi lại endpoint token với `canPublish: true`, server tiếp tục trả về token có `canPublish: false`.
   - *Trạng thái*: **PASS**.
4. **Học sinh dùng token cũ để reconnect**:
   - *Kết quả*: LiveKit room permissions trên SFU đã được cập nhật vĩnh viễn cho session đó. Đồng thời TTL của token mới được rút ngắn xuống 30 phút. Khi client HanziGo reconnect, hệ thống luôn gọi lại endpoint lấy token mới nhất phản ánh đúng trạng thái `is_mic_allowed: false`.
   - *Trạng thái*: **PASS**.
5. **Học sinh refresh trang hoặc tham gia lại phòng**:
   - *Kết quả*: Endpoint `/api/webrtc/livekit-token` truy vấn database có thẩm quyền. Vì `is_mic_allowed` vẫn là `false`, token mới sinh ra tiếp tục có `canPublish: false`.
   - *Trạng thái*: **PASS**.
6. **Giáo viên Mute một học sinh (`MUTE_STUDENT` / `MUTE_MIC`)**:
   - *Kết quả*: Khác với `REVOKE_MIC`, hành động này gọi `roomClient.mutePublishedTrack()` để tắt tiếng tức thì và cập nhật DB `mic_enabled: false` mà không tước bỏ vĩnh viễn quyền `is_mic_allowed`.
   - *Trạng thái*: **PASS**.
7. **Giáo viên Mute All (`MUTE_ALL`)**:
   - *Kết quả*: LiveKit SFU duyệt danh sách participants, ngoại trừ giáo viên chủ tọa, toàn bộ học sinh bị cập nhật `canPublish: false` và ngắt toàn bộ track audio active qua `mutePublishedTrack`. Database cập nhật hàng loạt `session_participants` với `neq('role', 'teacher')`.
   - *Trạng thái*: **PASS**.
8. **Giáo viên cấp lại quyền cho một học sinh (`ALLOW_MIC`)**:
   - *Kết quả*: Moderation cập nhật SFU participant grant `canPublish: true` và cập nhật database `is_mic_allowed: true, mic_enabled: true`. Token request tiếp theo của học sinh này nhận được `canPublish: true`.
   - *Trạng thái*: **PASS**.

---

### 4. BẢNG MAPPING ĐẦY ĐỦ VERCEL ROUTING THỰC TẾ (5 CỘT)

*Ghi chú*: Theo đúng nguyên tắc kiểm toán trung thực, do chưa có tài khoản đăng nhập hay phiên browser truy cập trực tiếp trên domain Vercel live production thực tế, cột **Production test** được ghi chính xác là **NOT TESTED**. Không tạo kết quả giả định.

| Frontend request | Vercel route | Handler | Local test | Production test |
|---|---|---|:---:|:---:|
| `POST /api/webrtc/livekit-token` | `/api/webrtc/[action]?action=livekit-token` | `api/_webrtc/livekit-token.js` | **PASS** | **NOT TESTED** |
| `GET /api/webrtc/ice-servers` | `/api/webrtc/[action]?action=ice-servers` | `api/_webrtc/ice-servers.js` | **PASS** | **NOT TESTED** |
| `GET /api/live/session` | `/api/live/[action]?action=session` | `api/_handlers/live/session.js` | **PASS** | **NOT TESTED** |
| `POST /api/live/session` | `/api/live/[action]?action=session` | `api/_handlers/live/session.js` | **PASS** | **NOT TESTED** |
| `POST /api/live/join` | `/api/live/[action]?action=join` | `api/_handlers/live/join.js` | **PASS** | **NOT TESTED** |
| `POST /api/live/leave` | `/api/live/[action]?action=leave` | `api/_handlers/live/leave.js` | **PASS** | **NOT TESTED** |
| `POST /api/live/moderation` | `/api/live/[action]?action=moderation` | `api/_handlers/live/moderation.js` | **PASS** | **NOT TESTED** |
| `GET /api/live/participants` | `/api/live/[action]?action=participants` | `api/_handlers/live/participants.js` | **PASS** | **NOT TESTED** |
| `POST /api/live/end` | `/api/live/[action]?action=end` | `api/_handlers/live/end.js` | **PASS** | **NOT TESTED** |
| `GET /api/classroom/lookup` | `/api/classroom/[action]?action=lookup` | `api/_handlers/classroom/lookup.js` | **PASS** | **NOT TESTED** |
| `POST /api/classroom/create` | `/api/classroom/[action]?action=create` | `api/_handlers/classroom/create.js` | **PASS** | **NOT TESTED** |
| `POST /api/classroom/join` | `/api/classroom/[action]?action=join` | `api/_handlers/classroom/join.js` | **PASS** | **NOT TESTED** |
| `GET /api/classroom/members` | `/api/classroom/[action]?action=members` | `api/_handlers/classroom/members.js` | **PASS** | **NOT TESTED** |
| `POST /api/classroom/remove` | `/api/classroom/[action]?action=remove` | `api/_handlers/classroom/remove.js` | **PASS** | **NOT TESTED** |
| `POST /api/ai/chat` | `/api/ai/chat` | `api/ai/chat.js` | **PASS** | **NOT TESTED** |
| `POST /api/ai/coach` | `/api/ai/coach` | `api/ai/coach.js` | **PASS** | **NOT TESTED** |
| `POST /api/ai/teacher` | `/api/ai/teacher` | `api/ai/teacher.js` | **PASS** | **NOT TESTED** |

**Đánh giá tổng số serverless functions**:
Dự án có chính xác 6 serverless functions:
1. `api/ai/chat.js`
2. `api/ai/coach.js`
3. `api/ai/teacher.js`
4. `api/classroom/[action].js`
5. `api/live/[action].js`
6. `api/webrtc/[action].js`
Con số này hoàn toàn nằm trong giới hạn 12 functions của gói Vercel Hobby plan.

---

### 5. BIẾN MÔI TRƯỜNG BẮT BUỘC TRÊN VERCEL PRODUCTION

Các biến môi trường sau phải được cấu hình trên Vercel Project Settings:

| Tên biến | Phạm vi | Mô tả & Mục đích |
|---|:---:|---|
| `VITE_SUPABASE_URL` | Client & Server | URL dự án Supabase |
| `VITE_SUPABASE_ANON_KEY` | Client & Server | Khóa ẩn danh an toàn cho client |
| `SUPABASE_SERVICE_ROLE_KEY` | **Chỉ Server** (Secret) | Khóa đặc quyền cho serverless backend (bỏ qua RLS để quản trị) |
| `LIVEKIT_URL` / `VITE_LIVEKIT_URL` | Client & Server | Địa chỉ LiveKit Cloud / LiveKit Server (e.g. `wss://hanzigo-xxx.livekit.cloud`) |
| `LIVEKIT_API_KEY` | **Chỉ Server** (Secret) | LiveKit API Key sinh token |
| `LIVEKIT_API_SECRET` | **Chỉ Server** (Secret) | LiveKit API Secret ký JWT token |
| `GEMINI_API_KEY` | **Chỉ Server** (Secret) | Khóa API Google Gemini AI cho trợ giảng và gia sư sư phạm |
| `TURN_SERVER_URL` | **Chỉ Server** (Tùy chọn) | Địa chỉ CoTURN server cho mạng firewall nghiêm ngặt |
| `TURN_SHARED_SECRET` | **Chỉ Server** (Tùy chọn) | Khóa chia sẻ HMAC sinh credentials TURN tạm thời (RFC 5766) |

*Cảnh báo*: Tuyệt đối không thêm tiền tố `VITE_` vào các biến `LIVEKIT_API_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`.

---

### 6. QUY TRÌNH TRIỂN KHAI VÀ KẾ HOẠCH ROLLBACK

#### Quy trình triển khai (Deployment):
1. **Kiểm tra cục bộ**:
   ```powershell
   npm test
   npm run build
   npm run lint
   ```
2. **Commit và đẩy lên GitHub**:
   ```powershell
   git add .
   git commit -m "feat(security): production zero-trust auth, livekit mic permissions, serverless consistency"
   git push origin main
   ```
3. **Xác nhận build trên Vercel Dashboard**:
   - Kiểm tra log build: Đảm bảo không có lỗi thiếu biến môi trường hoặc timeout.
   - Kiểm tra Function deployment: Xác nhận 6 serverless functions được tạo thành công.

#### Kế hoạch Rollback tức thì:
- Nếu phát hiện lỗi trên production:
  - Truy cập **Vercel Dashboard** -> **Deployments**.
  - Nhấp vào Deployment trước đó (v1.1.0) -> Chọn **Instant Rollback**.
  - Thời gian rollback: Dưới 5 giây, không cần build lại.

---

### 7. TỔNG KẾT ĐÁNH GIÁ NGHIỆM THU

| Hạng mục nghiệm thu | Trạng thái | Ghi chú |
|---|:---:|---|
| **Zero-Trust Token Authentication** | **PASS** | Chặn đứng 100% giả mạo `x-user-id` và token giả trong production. |
| **Server-Authoritative Mic Permissions** | **PASS** | 8/8 kịch bản mic, token refresh, reconnect, mute all vượt qua kiểm thử. |
| **Serverless Multi-Instance Consistency** | **PASS** | Tách biệt hoàn toàn test in-memory adapter và production database authority. |
| **Classroom Concurrency & Code Unique (23505)** | **PASS** | Xử lý va chạm mã lớp trả về HTTP 409 Conflict chuẩn mực. |
| **Student Privacy & PII Masking** | **PASS** | Chặn truy cập danh sách lớp trái phép, ẩn email học viên. |
| **Vercel Routing Table Mapping** | **PASS** | Khớp nối 100% giữa frontend fetch, vercel.json rewrites và serverless router. |
| **Production Build & Bundle Optimization** | **PASS** | Build 607ms, LiveClassroomPage 52.28 kB, 0 Oxlint errors. |
| **Live Media Load Testing trên 30–50 thiết bị vật lý** | **NOT TESTED** | Cần lab kiểm thử thiết bị thực tế sau khi triển khai production URL. |
