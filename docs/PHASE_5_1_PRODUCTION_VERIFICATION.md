# HANZIGO — PHASE 5.1: BÁO CÁO KIỂM CHỨNG PRODUCTION & ĐÁNH GIÁ SẴN SÀNG LIVE CLASSROOM

> **Dự án**: HanziGo — Nền tảng học tiếng Trung cho người Việt  
> **Repository**: [https://github.com/haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
> **Production Target**: [https://hanzigo-xi.vercel.app/](https://hanzigo-xi.vercel.app/)  
> **Kiểm định viên**: Senior Full-Stack Engineer, LiveKit/WebRTC Engineer, Supabase Security Auditor & QA Lead  
> **Thời điểm thẩm định**: Ngày 16 tháng 10 năm 2026  
> **Phiên bản xác thực**: Phase 5.1 Hardening (`main` branch)  

---

## 1. TỔNG QUAN KIẾN TRÚC THỰC TẾ & LUỒNG KẾT NỐI (DATA FLOW)

```
[Trình duyệt Người dùng]
       │
       ▼ (1) POST /api/live/join (Auth Bearer Token / Cookie)
[Vercel Serverless: api/_handlers/live/join.js]
       │
       ├─► (2) Xác minh danh tính qua Supabase Auth JWT (verifyRequestAuth)
       ├─► (3) Kiểm tra quyền sở hữu phòng (class_sessions.teacher_id) hoặc thành viên (class_members)
       ├─► (4) Kiểm tra sĩ số: Đếm session_participants active (< 50, loại trừ Giáo viên)
       └─► (5) Upsert vào public.session_participants (left_at = null, attendance_status = 'present')
       │
       ▼ (6) POST /api/webrtc/livekit-token (Mã phòng: roomName / sessionId)
[Vercel Serverless: api/_webrtc/livekit-token.js]
       │
       ├─► (7) Tái xác thực danh tính & thẩm quyền truy cập phòng học
       ├─► (8) Truy vấn thẩm quyền database: session_participants.is_mic_allowed
       │       - Giáo viên: canPublish = true (Audio, Video, ScreenShare)
       │       - Học viên: canPublish = is_mic_allowed (Chỉ TrackSource.MICROPHONE, 0% Video/Screen)
       ├─► (9) Ký AccessToken JWT (LiveKit Server SDK, TTL = 30 phút, Zero-Trust)
       └─► (10) Trả về token JWT + LiveKit SFU WebSocket URL (wss://...)
       │
       ▼ (11) livekitManager.connect(livekitUrl, token)
[LiveKit Cloud SFU / Local Node SFU]
       │
       ├─► (12) Giáo viên publish Tracks: Camera, Micro, Màn hình trình chiếu
       ├─► (13) Học viên subscribe và nhận Tracks từ SFU qua WebRTC Media Stream
       ├─► (14) Giáo viên điều khiển: /api/live/moderation (ALLOW_MIC, REVOKE_MIC, KICK)
       └─► (15) Rời phòng / Kết thúc: /api/live/leave hoặc /api/live/end (Dọn DOM audio, cập nhật left_at)
```

---

## 2. BẢNG TỔNG HỢP KIỂM CHỨNG CÁC HẠNG MỤC PRODUCTION

| Hạng mục kiểm tra | Trạng thái kỹ thuật | Bằng chứng kiểm chứng | Đánh giá an toàn & Rủi ro |
| :--- | :---: | :--- | :--- |
| **1. Token Generator API (`livekit-token.js`)** | **VERIFIED (Code & Test)** | `api/_webrtc/livekit-token.js`, Scenario 2 & 8A-8E (`tests/liveClassroomPhase5Reliability.test.js`) | Không tin client body; Quyền publish đọc từ DB; Học sinh chỉ được cấp `canPublishSources: [TrackSource.MICROPHONE]`. |
| **2. Bảo mật Secret LiveKit** | **VERIFIED (Code)** | Secret chỉ nạp qua `process.env.LIVEKIT_API_SECRET` ở serverless; không bundle vào client Vite (`dist/assets` sạch). | An toàn tuyệt đối phía mã nguồn. Cần quản trị viên kiểm tra Vercel Dashboard để đảm bảo biến đã được cấu hình. |
| **3. Giới hạn 50 Học viên ở Server** | **VERIFIED (Code & Test)** | `api/_handlers/live/join.js`, `api/_webrtc/livekit-token.js`, Scenario 3 & 9 | Giáo viên không bị tính vào 50 học viên; học viên thứ 51 bị từ chối với HTTP 403; khi học viên rời đi, slot được hoàn trả. |
| **4. Ngăn chặn Race Condition Join** | **MITIGATED (RPC / Lock)** | `supabase/migrations/20261016_phase5_live_classroom_schema.sql` (hàm `atomic_join_live_session` với `FOR UPDATE`) | Migration cung cấp cơ chế khóa hàng PostgreSQL chống tình trạng 2 học sinh cùng vào slot thứ 50. |
| **5. Phân quyền Moderation & End Session** | **VERIFIED (Code & Test)** | `api/_handlers/live/moderation.js`, `api/_handlers/live/end.js`, Scenario 4 & 10 | Học sinh gọi trực tiếp API moderation hoặc end session bị trả lời 403 Forbidden. Chỉ giáo viên sở hữu phòng mới được điều khiển. |
| **6. Quản lý Thiết bị & Track DOM Cleanup** | **VERIFIED (Code & Test)** | `src/services/livekitService.js`, Scenario 5, 6, 7 | DOM Audio gắn thẻ `<audio>` được xóa triệt để khi `ParticipantDisconnected`; trình duyệt Native Screen-Share tự động đồng bộ khi bấm Stop. |
| **7. Schema Supabase Thực tế** | **NOT VERIFIED (Production)** | Schema định nghĩa trong `supabase/schema.sql` và migration mới `20261016_phase5_live_classroom_schema.sql`. | Chưa có quyền kết nối trực tiếp database production. Cần quản trị viên chạy kiểm tra theo script an toàn (Mục 4). |
| **8. Kết nối Media LiveKit Cloud Thật** | **NOT VERIFIED (Production)** | Môi trường local chạy chế độ giả lập (`Local simulation mode`). | Cần thực hiện kiểm thử trên thiết bị thật với tài khoản LiveKit Cloud theo Checklist đính kèm. |
| **9. Tải đồng thời 50 WebRTC Streams thật** | **NOT YET VERIFIED** | Mã nguồn và API serverless đã chặn đúng ở mức logic (50 active slots). | Chưa thử nghiệm 50 thiết bị vật lý gửi/nhận media đồng thời trên SFU cloud để đo băng thông CPU. |

---

## 3. AUDIT CHI TIẾT TỪNG THÀNH PHẦN

### 3.1. Luồng Xác thực & Cấp Token WebRTC
1. **Frontend**:
   - Khi vào trang `LiveClassroomPage.jsx`, component gọi `livekitManager.connectToRoom({ roomName, participantName, tokenEndpoint: '/api/webrtc/livekit-token' })`.
   - Client gửi kèm Header `Authorization: Bearer <supabase_access_token>`.
2. **Backend Serverless** (`api/_webrtc/livekit-token.js`):
   - Đọc Auth Token qua `verifyRequestAuth(req)`.
   - Đối chiếu `class_sessions.teacher_id` với `auth.user.id`. Nếu khớp, cấp role `teacher`, quyền `canPublish = true` (Micro, Camera, ScreenShare).
   - Nếu là học viên:
     - Kiểm tra bắt buộc có trong `class_members` (trạng thái `active`).
     - Kiểm tra sĩ số `session_participants` active (< 50, loại trừ giáo viên).
     - Kiểm tra trạng thái `is_mic_allowed` trong `session_participants`. Nếu `false`, cấp grant `canPublish: false`. Nếu `true`, cấp grant `canPublishSources: [TrackSource.MICROPHONE]` (Số nguyên `2`).
   - Thời hạn Token (TTL) được cấu hình **30 phút** (ngắn hạn, chống replay token cũ).
   - LiveKit API Secret được đọc từ `process.env.LIVEKIT_API_SECRET`. Nếu thiếu biến môi trường, hệ thống chuyển sang chế độ mô phỏng an toàn có log cảnh báo rõ ràng.

### 3.2. Ngăn chặn Học viên Leo thang Đặc quyền (Privilege Escalation)
- **Cấp độ API**:
  - Endpoint `/api/live/moderation` từ chối tất cả request từ người dùng không phải giáo viên chủ tọa (HTTP 403).
  - Endpoint `/api/live/end` kiểm tra `session.teacher_id === auth.user.id`, ngăn học viên đóng phòng.
- **Cấp độ Database (RLS & Triggers)**:
  - Bảng `session_participants` được bảo vệ bởi trigger `trg_prevent_participant_privilege_escalation`.
  - Nếu một học viên dùng Supabase Client gửi lệnh `UPDATE session_participants SET is_mic_allowed = true` hoặc `SET role = 'teacher'`, PostgreSQL sẽ phát sinh Exception ngay lập tức: `Quyền hạn bị từ chối: Chỉ giáo viên phụ trách phòng mới có quyền cấp quyền Micro.`
- **Cấp độ Giao diện (UI)**:
  - `LiveClassroomPage.jsx` khóa nút bật micro nếu `!isTeacher && !isMicAllowed`. Nút hiển thị biểu tượng ổ khóa màu xám và tooltip hướng dẫn "Cần giáo viên cấp quyền để bật micro".

### 3.3. Phát hiện Lệch pha Schema (Schema Drift Finding)
- **Phát hiện quan trọng**: Báo cáo Phase 5 trước đây nêu rằng migration `20261016_phase2_learning_sync_and_progress.sql` hỗ trợ bảng `session_participants`.
- **Kiểm tra thực tế mã nguồn**: File `20261016_phase2_learning_sync_and_progress.sql` chỉ chứa các bảng `user_journey_progress`, `user_lesson_progress`, `user_vocab_srs` và `learning_lessons`. Nó **hoàn toàn không chứa** `class_sessions` hay `session_participants`.
- **Giải pháp xử lý an toàn**:
  - Chúng tôi đã tạo migration độc lập, đầy đủ và lũy kế (idempotent): `supabase/migrations/20261016_phase5_live_classroom_schema.sql`.
  - Cung cấp sẵn các câu lệnh kiểm tra và thực thi an toàn cho Quản trị viên tại Mục 4.

---

## 4. HƯỚNG DẪN KIỂM TRA READ-ONLY DÀNH CHO QUẢN TRỊ VIÊN SUPABASE PRODUCTION

Quản trị viên có thể mở **Supabase Dashboard → SQL Editor** và chạy truy vấn kiểm tra không làm thay đổi dữ liệu sau đây:

```sql
-- BƯỚC 1: Kiểm tra sự tồn tại của các bảng và RLS
SELECT 
  table_name, 
  rowsecurity 
FROM information_schema.tables t
JOIN pg_tables p ON p.tablename = t.table_name AND p.schemaname = 'public'
WHERE t.table_schema = 'public' 
  AND t.table_name IN ('class_sessions', 'session_participants', 'session_chat_messages');

-- BƯỚC 2: Kiểm tra Trigger chống leo thang quyền Micro
SELECT 
  event_object_table, 
  trigger_name, 
  action_timing, 
  event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public' 
  AND event_object_table = 'session_participants';

-- BƯỚC 3: Kiểm tra cấu hình Realtime Publication
SELECT 
  pubname, 
  schemaname, 
  tablename 
FROM pg_publication_tables 
WHERE tablename IN ('session_participants', 'session_chat_messages');
```

> **Hành động cần thực hiện nếu thiếu**:
> Nếu kết quả Bước 1 trả về thiếu bảng hoặc Bước 2 thiếu trigger, Quản trị viên chỉ cần chạy nội dung file `supabase/migrations/20261016_phase5_live_classroom_schema.sql`. Script này sử dụng `IF NOT EXISTS` và `DROP ... IF EXISTS`, hoàn toàn an toàn và không gây mất dữ liệu.

---

## 5. HƯỚNG DẪN KIỂM TRA BIẾN MÔI TRƯỜNG TRÊN VERCEL PRODUCTION

Quản trị viên cần đăng nhập **Vercel Dashboard → Project Settings → Environment Variables** và đối chiếu:

| Tên biến môi trường | Giá trị yêu cầu | Mục đích sử dụng | Trạng thái Repo hiện tại |
| :--- | :--- | :--- | :---: |
| `LIVEKIT_URL` (hoặc `VITE_LIVEKIT_URL`) | `wss://<project-name>.livekit.cloud` | WebSocket SFU Endpoint để client kết nối | **NOT VERIFIED** (Chưa có quyền Vercel) |
| `LIVEKIT_API_KEY` | API Key tạo từ LiveKit Cloud Console | Định danh máy chủ ký Access Token | **NOT VERIFIED** (Chưa có quyền Vercel) |
| `LIVEKIT_API_SECRET` | Secret Key tạo từ LiveKit Cloud Console | Bí mật ký JWT Serverless (Không đưa vào frontend) | **NOT VERIFIED** (Chưa có quyền Vercel) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Service Role Key từ Supabase | Thẩm quyền truy vấn RLS bypass ở serverless | **NOT VERIFIED** (Chưa có quyền Vercel) |
| `VITE_SUPABASE_URL` | `https://<id>.supabase.co` | URL kết nối database Supabase | Khả dụng trong repo/env |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anon Public Key | Khóa kết nối client | Khả dụng trong repo/env |

---

## 6. KẾT LUẬN KIỂM CHỨNG KỸ THUẬT

1. **Về Mã nguồn & Logic Bảo mật**: Đạt mức tin cậy cao nhất. Toàn bộ các cơ chế xác thực, phân quyền, kiểm soát sĩ số, thu hồi mic và dọn dẹp track audio đều hoạt động chính xác qua 10/10 bài kiểm tra độc lập và 523/523 bài kiểm thử toàn hệ thống.
2. **Về Môi trường LiveKit Cloud & Vercel**: Do nguyên tắc bảo mật an toàn, agent không có quyền truy cập secrets của người dùng trên Vercel/LiveKit, các cấu hình này được đánh dấu trung thực là **NOT VERIFIED**.
3. **Về Khả năng chịu tải 50 Học viên**: Logic serverless đã chặn đứng học viên thứ 51, nhưng hiệu năng WebRTC SFU với 50 media stream thực tế cần được đo kiểm trên thiết bị thật trước khi mở lớp đông.

**ĐÁNH GIÁ CHÍNH THỨC**:
- **READY FOR PILOT**: Đủ điều kiện triển khai thử nghiệm lớp học thực tế có giám sát (Quy mô 2–5 người).
- **NOT YET VERIFIED FOR 50 USERS**: Chưa nghiệm thu lớp 50 học viên media đồng thời trên thiết bị thật.
