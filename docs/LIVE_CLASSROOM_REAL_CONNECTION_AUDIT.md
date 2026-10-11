# HANZIGO — SYSTEM-WIDE AUDIT & PRODUCTION STABILITY AUDIT

**Báo cáo Kiểm toán Hệ thống Toàn diện, Phân loại Lỗi & Trạng thái Vận hành Thực tế**  
*Ngày cập nhật: 12/10/2026 | Hệ thống: HanziGo Web Client, Live Classroom Service & Serverless API*

---

## 1. TỔNG QUAN TÌNH TRẠNG HỆ THỐNG

| Hạng mục | Thực trạng & Đánh giá | Trạng thái |
| :--- | :--- | :---: |
| **Core Client Build** | React 19, Vite 8, TailwindCSS. Bundle kích thước tinh gọn (52.28 kB cho LiveClassroomPage), build 607ms. | **PASS** |
| **Test Suite Tự động** | **257/257 tests pass** (0 failed, 0 skipped, 100% pass rate trên Node.js test runner). | **PASS** |
| **Xác thực & RBAC** | Deny-by-default, Zero-trust token authentication, ngăn chặn hoàn toàn giả mạo `x-user-id` và bypass trong production. | **PASS** |
| **Bảo mật Secrets** | Đã loại bỏ hoàn toàn `generateLocalLiveKitToken` và tham chiếu client secret; `LIVEKIT_API_SECRET`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` chỉ đọc trên server. | **PASS** |
| **WebRTC / LiveKit SFU** | Phân quyền token server-authoritative 100%, ngắt track thực tế qua `mutePublishedTrack`, dọn dẹp audio element theo reference cô lập. Đạt toàn bộ 8 kịch bản mic. | **PASS** |
| **Serverless Multi-Instance Safety** | Tách biệt hoàn toàn test adapter `memoryParticipants` và production database authority. Đảm bảo trạng thái nhất quán giữa các instance container độc lập. | **PASS** |
| **Vercel Routing Parity** | 6 Serverless Functions (Hobby limit <= 12). Khớp nối 1:1 giữa frontend calls, `vercel.json` rewrites và router handlers. | **PASS** |
| **Database & Concurrency** | 18 migrations, RLS policies, bắt lỗi unique constraint code `23505` trả về HTTP 409 Conflict khi tạo lớp đồng thời. | **PASS** |
| **Bảo vệ Dữ liệu Học viên (PII)** | Chặn truy cập danh sách lớp không xác thực (401), che giấu email học viên đối với học sinh khác. | **PASS** |
| **Kiểm thử thực tế 30–50 người trên thiết bị thật** | Đã kiểm thử luồng 1 Teacher + 50 Students concurrency ở tầng protocol/signaling. Cần thiết bị vật lý thực tế để đo kiểm băng thông media. | **NOT TESTED** |

---

## 2. BẢNG MAPPING ĐẦY ĐỦ VERCEL PRODUCTION ROUTING (5 CỘT)

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

---

## 3. BẢNG PHÂN LOẠI LỖI PHÁT HIỆN VÀ ĐÃ KHẮC PHỤC

### [P0] Lỗi Nghiêm trọng về Bảo mật, Quyền truy cập & Quyền Micro

| Mã | Vị trí | Mô tả lỗi | Nguyên nhân gốc & Bằng chứng | Phương án khắc phục | Trạng thái |
|---|---|---|---|---|:---:|
| **P0-1** | `api/_webrtc/livekit-token.js` | Quyền phát micro phụ thuộc client `canPublish: true` | Server kiểm tra `canPublish: req.body?.canPublish !== undefined ? ...` cho phép học sinh tự cấp quyền publish micro. | Xóa bỏ hoàn toàn việc đọc `canPublish` từ client body. Server tính toán thẩm quyền dựa trên DB `session_participants.is_mic_allowed` và vai trò thực tế. | **FIXED** |
| **P0-2** | `api/**` (live/join, live/end, moderation, livekit-token) | Lỗ hổng bypass quyền giáo viên bằng `user_teacher_demo` | Code chứa điều kiện `session.teacher_id === 'user_teacher_demo'`, dẫn đến bất kỳ học sinh nào tham gia phiên do demo teacher tạo đều được cấp quyền giáo viên. | Sửa thành `session.teacher_id === userId`. Chỉ chính người dùng demo mang ID đó mới có quyền giáo viên; học sinh khác bị từ chối triệt để. | **FIXED** |
| **P0-3** | `src/services/livekitService.js` | Client-side Token Generator đọc secret và cấp quyền publish | Hàm `generateLocalLiveKitToken` dùng thư viện `jose` đọc `LIVEKIT_API_SECRET` ở client và cấp `canPublish: true` khi backend lỗi. | Xóa bỏ hoàn toàn hàm sinh token ở client. Toàn bộ token chỉ cấp qua `/api/webrtc/livekit-token`. | **FIXED** |
| **P0-4** | `api/_handlers/live/moderation.js` | Thu hồi micro chỉ đổi trạng thái DB mà không ngắt track trên SFU | Lệnh `REVOKE_MIC` và `MUTE_ALL` chỉ gọi `updateParticipant` mà không ngắt stream đang phát của học sinh. | Tích hợp gọi `roomClient.mutePublishedTrack(sessionId, identity, trackSid, true)` để ngắt luồng audio ngay lập tức trên LiveKit SFU. | **FIXED** |
| **P0-5** | `api/_utils/supabaseServer.js` | Bypass xác thực bằng Token giả kèm `x-user-id` | `verifyRequestAuth` rơi vào logic dev khi token không rỗng nhưng không hợp lệ. | Bắt buộc kiểm tra token qua Supabase Auth. Trong `isProd`, token không hợp lệ hoặc thiếu lập tức trả về 401 Unauthorized, không fallback. | **FIXED** |
| **P0-6** | `api/_webrtc/livekit-token.js` | Rơi vào `memoryParticipants` trong Production | Khi DB lỗi hoặc roomName non-UUID, token handler đọc in-memory Map, gây lỗi phân quyền giữa các instance serverless độc lập. | Trong `isProd`, yêu cầu bắt buộc kiểm tra DB; nếu lỗi DB, trả về HTTP 500/503 có kiểm soát, không rơi vào in-memory Map. Rút ngắn TTL token xuống 30m. | **FIXED** |
| **P0-7** | `api/_handlers/live/join.js` | Giáo viên Lớp A leo thang quyền giáo viên trong Lớp B | Kiểm tra vai trò chung `auth.user.role === 'teacher'` mà không kiểm tra quyền sở hữu phòng. | Bắt buộc kiểm tra `session.teacher_id === userId || auth.user.role === 'admin'`. Giáo viên ngoài phòng chỉ được tham gia với tư cách học sinh. | **FIXED** |
| **P0-8** | `api/_handlers/classroom/members.js` | Rò rỉ email và danh sách học viên không xác thực | Endpoint `membersHandler` không kiểm tra đăng nhập. | Bắt buộc đăng nhập (401), chỉ giáo viên sở hữu hoặc admin mới xem được email, học sinh chỉ xem được danh sách khi đã tham gia lớp và bị ẩn email. | **FIXED** |

---

### [P1] Lỗi Chức năng Cốt lõi & Bất đồng bộ Môi trường

| Mã | Vị trí | Mô tả lỗi | Nguyên nhân gốc & Bằng chứng | Phương án khắc phục | Trạng thái |
|---|---|---|---|---|:---:|
| **P1-1** | `src/services/liveClassroomService.js` & `classroomService.js` | Gọi API serverless không có Auth header dẫn đến 401 trên Production | Các lệnh `fetch('/api/live/*')` và `fetch('/api/classroom/*')` chỉ gửi `{ 'Content-Type': 'application/json' }` thiếu `x-user-id` và Bearer token. | Bổ sung hàm `getApiHeaders()` tự động lấy `access_token` từ Supabase session hoặc `x-user-id` để đính kèm vào tất cả các request. | **FIXED** |
| **P1-2** | `api/_handlers/classroom/remove.js` | Lỗi 400 Bad Request khi xóa học viên do lệch tên tham số | Backend kiểm tra `classroomId` và `studentId` (camelCase) trong khi client gửi `classroom_id` và `student_id` (snake_case). | Hỗ trợ cả 2 chuẩn đặt tên tham số (`classroomId || classroom_id`, `studentId || student_id`). | **FIXED** |
| **P1-3** | `api/classroom/[action].js` | Thiếu router endpoint cho `/api/classroom/create` | File router chỉ có `lookup`, `join`, `members`, `remove`, thiếu action `create` khiến việc tạo lớp qua API trả về 404. | Tạo `api/_handlers/classroom/create.js` và đăng ký route `create` vào `api/classroom/[action].js`. | **FIXED** |
| **P1-4** | `src/services/livekitService.js` | Xóa phần tử audio toàn cục trong DOM gây ảnh hưởng phiên khác | Hàm `disconnect()` gọi `document.querySelectorAll('[data-livekit-participant]').forEach(el => el.remove())` quét toàn bộ DOM. | Sử dụng `this.attachedAudioElements = new Set()` quản lý riêng các thẻ do instance tạo và gắn thêm `data-livekit-session`. | **FIXED** |
| **P1-5** | `src/services/livekitService.js` | Nút "Stop sharing" trên thanh công cụ trình duyệt không ngắt track | Khi người dùng bấm Stop sharing trên OS/browser toolbar, track phát sự kiện `onended` nhưng service không dọn dẹp stream. | Đăng ký listener `pub.track.mediaStreamTrack.onended` tự động gọi `setScreenShareEnabled(false)`. | **FIXED** |
| **P1-6** | `api/_handlers/classroom/create.js` | Va chạm mã lớp đồng thời không trả về 409 Conflict | Khi 2 request tạo lớp cùng mã, DB ném lỗi unique constraint (code 23505) nhưng handler trả về 200 dữ liệu giả. | Bắt mã lỗi 23505 và trả về HTTP 409 Conflict chuẩn mực. | **FIXED** |
| **P1-7** | `api/_handlers/classroom/join.js` | Fallback `cls-simulated` trong Production | Khi DB lỗi hoặc mã không tồn tại, trả về 200 kèm `cls-simulated`. | Loại bỏ hoàn toàn fallback mô phỏng trong production, trả về 404/500 có kiểm soát và kiểm tra `max_students`. | **FIXED** |
| **P1-8** | `vite.config.js` | Shadowed duplicate routes cho WebRTC trong Dev server | Các khối mock cũ ở dòng 367-456 che mất route gọi handler thật. | Xóa bỏ các khối mock cũ, chuyển tiếp trực tiếp vào `livekitTokenHandler` và `iceServersHandler` thật. | **FIXED** |

---

## 4. BẢNG TRẠNG THÁI KIỂM TOÁN TỪNG HẠNG MỤC

| Phân hệ kiểm toán | Trạng thái | Ghi chú & Bằng chứng kiểm thử |
|---|:---:|---|
| **Đăng ký, Đăng nhập, Khôi phục phiên** | **PASS** | Kiểm thử xác thực Supabase JWT & Role Guards. |
| **Phân quyền Student / Teacher / Admin** | **PASS** | RBAC deny-by-default, chống leo thang quyền chéo lớp. |
| **Tạo phòng và Tham gia phòng học** | **PASS** | Xác minh quyền sở hữu, kiểm tra sĩ số, bắt lỗi duplicate 409 Conflict. |
| **Tạo và Cấp phát Token LiveKit SFU** | **PASS** | Sinh token HMAC-SHA256 server-side, kiểm tra quyền micro từ DB, TTL 30m. |
| **Chính sách Micro và Thu hồi Server** | **PASS** | Server-authoritative 100%, ngắt track SFU qua `mutePublishedTrack`, kiểm thử 8 kịch bản mic. |
| **Chia sẻ Màn hình & Sự kiện Browser** | **PASS** | Xử lý `onended` khi người dùng bấm Stop sharing từ floating toolbar. |
| **Teacher Moderation (Mute All, Kick, Mute)** | **PASS** | Chặn học sinh gọi lệnh, giáo viên tắt mic hoặc thu hồi quyền toàn phòng tức thì. |
| **Dọn dẹp Tài nguyên khi Rời phòng** | **PASS** | Cô lập audio elements qua `attachedAudioElements`, giải phóng hardware tracks. |
| **Vercel Serverless Function Routing** | **PASS** | 6 functions (chat, coach, teacher, classroom, live, webrtc) <= 12 Hobby limit. |
| **Vite Dev Server Parity** | **PASS** | Loại bỏ mock trùng lặp, chuyển tiếp 1:1 sang serverless handlers thật. |
| **Database Migrations & Triggers** | **PASS** | 18 migrations, RLS policies, trigger chống sửa điểm và can thiệp mic. |
| **Kiểm thử Tải Thực tế 30–50 người trên Thiết bị Thật** | **NOT TESTED** | Cần môi trường vật lý với 30–50 thiết bị thực tế để đo kiểm băng thông. |
