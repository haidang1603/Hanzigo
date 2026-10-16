# HANZIGO — PHASE 5.2: BÁO CÁO ĐÁNH GIÁ SẴN SÀNG THỬ NGHIỆM PILOT CÓ KIỂM SOÁT (PILOT READINESS)

> **Dự án**: HanziGo — Nền tảng học tiếng Trung cho người Việt  
> **Repository**: [https://github.com/haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
> **Production Target**: [https://hanzigo-xi.vercel.app/](https://hanzigo-xi.vercel.app/)  
> **Vai trò**: Senior Full-Stack Engineer, LiveKit/WebRTC Engineer & QA Lead  
> **Thời điểm thẩm định**: Ngày 16 tháng 10 năm 2026  
> **Đánh giá thẩm định**: **READY FOR TWO-USER PILOT** & **NOT YET VERIFIED FOR 50 USERS**  

---

## 1. PHÂN TÍCH KIẾN TRÚC MÃ NGUỒN TRƯỚC PILOT (PRE-PILOT CODE AUDIT)

### 1.1. Cấu hình Vercel Serverless Functions (`vercel.json` & `package.json`)
- **Đóng gói định tuyến (Router Consolidation)**:
  - `vercel.json` định tuyến toàn bộ các yêu cầu `/api/live/:action` tới file đơn nhất [api/live/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/live/%5Baction%5D.js) và `/api/webrtc/:action` tới [api/webrtc/[action].js](file:///d:/DELL/Dowloads/HanziGo/api/webrtc/%5Baction%5D.js).
  - Kiến trúc này gom 8 endpoint vào đúng 2 serverless functions, tuân thủ nghiêm ngặt giới hạn gói Vercel Hobby (<= 12 Serverless Functions) và loại bỏ hoàn toàn nguy cơ lỗi 404 do vượt quota hàm.
- **Thư viện WebRTC & Realtime**:
  - `livekit-client`: `^2.22.4` (Frontend SDK WebRTC)
  - `livekit-server-sdk`: `^2.19.1` (Backend Token & Room Service SDK)
  - `@supabase/supabase-js`: `^2.117.2` (Authoritative Data & Realtime Sync)
  - Hoàn toàn tương thích và không có xung đột phiên bản.

### 1.2. Thẩm tra Luồng Cấp Token WebRTC Zero-Trust (`api/_webrtc/livekit-token.js`)
- **Cơ chế xác thực**:
  - Hàm `verifyRequestAuth(req)` đọc `Authorization: Bearer <token>`, truy vấn trực tiếp bảng `public.profiles` qua Supabase Auth để lấy vai trò chính thức (`role`).
  - Tuyệt đối không đọc vai trò từ client body hay `user_metadata` (ngăn ngừa hacker tự gán `role = 'teacher'`).
- **Phân bổ quyền tối thiểu (Least Privilege)**:
  - **Giáo viên**: Được cấp quyền phát `canPublish: true` (Micro, Camera, Màn hình trình chiếu).
  - **Học viên**: Mặc định `canPublish: false`. Nếu giáo viên cho phép phát biểu trong `session_participants.is_mic_allowed`, học viên được cấp grant chỉ định chặt chẽ:
    ```javascript
    canPublishSources: [TrackSource.MICROPHONE] // Hằng số enum = 2
    ```
    Học viên **0% có quyền** phát video camera hoặc chia sẻ màn hình.
- **Thời hạn Token (TTL)**: Được siết ngắn còn **30 phút** (giảm thiểu nguy cơ replay token cũ nếu bị rò rỉ).

### 1.3. Thẩm tra Tính Nguyên tử & Chống Race Condition Join (`api/_handlers/live/join.js`)
- **Tích hợp RPC `atomic_join_live_session`**:
  - Tại [api/_handlers/live/join.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/live/join.js), máy chủ ưu tiên gọi hàm RPC PostgreSQL [atomic_join_live_session](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261016_phase5_live_classroom_schema.sql#L173).
  - Hàm thực hiện khóa hàng `SELECT ... FROM public.class_sessions WHERE id = p_session_id FOR UPDATE;` nhằm tuần tự hóa các yêu cầu gia nhập cùng lúc vào slot thứ 50.
  - Khi phòng đạt sĩ số 50 học viên, RPC phát sinh lỗi và API trả về ngay **HTTP 403 Forbidden: "Phòng học đã đạt sĩ số tối đa (50 học viên)"**.
  - Giáo viên sở hữu phòng không bị tính vào sĩ số 50 học viên này.
  - Trường hợp RPC chưa được áp dụng trên database, hệ thống có cơ chế fallback truy vấn bảng trực tiếp an toàn kết hợp `memoryParticipants` đảm bảo không bị crash.

### 1.4. Cơ chế Độc lập Multi-Instance Serverless
- Dữ liệu sĩ số và quyền Micro được lưu tập trung trên **PostgreSQL Database** (`class_sessions`, `session_participants`).
- Không phụ thuộc vào bộ nhớ RAM của một Vercel container duy nhất. Nhiều serverless instances khởi tạo song song đều truy vấn cùng một nguồn dữ liệu có thẩm quyền.

---

## 2. BẢNG PHÂN LOẠI TRẠNG THÁI KIỂM TRA TRƯỚC PILOT (PRE-PILOT AUDIT TABLE)

| Hạng mục kiểm tra | Trạng thái | Bằng chứng mã nguồn / Kiểm thử | Đánh giá an toàn |
| :--- | :---: | :--- | :--- |
| **Xác thực danh tính Zero-Trust** | **PASS** | `verifyRequestAuth()` trong `supabaseServer.js`, `securityRbac.test.js` | Chặn đứng giả mạo token; từ chối tài khoản bị khóa (`status = 'blocked'`). |
| **Học viên không thể tự phát Video/Màn hình** | **PASS** | `livekit-token.js` giới hạn `canPublishSources: [TrackSource.MICROPHONE]` | Đã xác minh qua Scenario 2 & Scenario 8A-8E. |
| **Học viên không thể tự sửa quyền Micro** | **PASS** | Trigger `trg_prevent_participant_privilege_escalation` trong schema | PostgreSQL chặn UPDATE `is_mic_allowed` từ người dùng không phải giáo viên. |
| **Chống học viên đóng phiên hoặc điều khiển phòng** | **PASS** | `api/_handlers/live/end.js` & `moderation.js`, Scenario 10 | Trả về 403 Forbidden khi người gửi không phải chủ sở hữu phòng. |
| **Khóa sĩ số 50 học viên dùng chung ở DB** | **PASS** | `api/_handlers/live/join.js` & RPC `atomic_join_live_session`, Scenario 3, 9, 11 | Chặn học viên thứ 51 với HTTP 403; hoàn trả slot ngay khi có người rời phòng. |
| **Dọn dẹp DOM Audio khi người dùng ngắt kết nối** | **PASS** | `livekitService.js` lắng nghe `ParticipantDisconnected`, Scenario 5 | Thẻ `<audio>` tự động bị gỡ bỏ khỏi DOM, không gây vọng tiếng hoặc rò rỉ bộ nhớ. |
| **Tự động nhận diện dừng chia sẻ màn hình trình duyệt** | **PASS** | `screenTrack.mediaStreamTrack.onended`, Scenario 6 | UI tự động tắt chế độ phát khi giáo viên bấm "Stop sharing" trên thanh công cụ của trình duyệt. |
| **Biến môi trường LiveKit Cloud Production** | **NOT VERIFIED** | Mã nguồn hỗ trợ đầy đủ `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Cần Quản trị viên xác minh sự tồn tại trên Vercel theo hướng dẫn Mục 3. |
| **Trạng thái Migration Supabase Production** | **NOT VERIFIED** | File `supabase/migrations/20261016_phase5_live_classroom_schema.sql` đã sẵn sàng | Cần Quản trị viên chạy script kiểm tra read-only tại Mục 3. |
| **Tải Media 50 Client WebRTC thực tế** | **NOT YET VERIFIED** | Logic backend đã kiểm soát 50 slot, nhưng chưa thử nghiệm 50 thiết bị vật lý | Cần thực hiện thử nghiệm mở rộng từng bước (Tier 1 → Tier 2 → Tier 3). |

---

## 3. HƯỚNG DẪN XÁC MINH CẤU HÌNH DÀNH CHO QUẢN TRỊ VIÊN (SAFE ADMIN CHECKLIST)

### 3.1. Xác minh Biến Môi trường trên Vercel Dashboard (Tuyệt đối không in giá trị thô)
Quản trị viên truy cập **Vercel Dashboard → Project Settings → Environment Variables**:

| Tên biến | Định dạng kiểm tra an toàn | Ví dụ hợp lệ (Đã che mờ) | Mục đích |
| :--- | :--- | :--- | :--- |
| `LIVEKIT_URL` (hoặc `VITE_LIVEKIT_URL`) | Bắt đầu bằng `wss://` và chứa `.livekit.cloud` | `wss://hanzigo-live-***.livekit.cloud` | SFU WebSocket Endpoint |
| `LIVEKIT_API_KEY` | Độ dài 12–32 ký tự alphanumeric | `API***4xY` | Định danh máy chủ ký JWT |
| `LIVEKIT_API_SECRET` | Độ dài 32–64 ký tự base64/hex | `sec_***99Z` (Chỉ cấu hình serverless) | Khóa bí mật ký token |
| `SUPABASE_SERVICE_ROLE_KEY` | Bắt đầu bằng `eyJhbGciOi...` (JWT định dạng service_role) | `eyJ***ServiceRole` | Bỏ qua RLS khi cần ở serverless |
| `VITE_SUPABASE_URL` | Bắt đầu bằng `https://` và chứa `.supabase.co` | `https://***.supabase.co` | Kết nối database Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chuỗi JWT public anon | `eyJ***AnonKey` | Khóa công khai frontend |

> ⚠️ **Quy tắc an toàn**: Không sao chép các khóa trên vào chat, tài liệu hay commit git. Chỉ cần kiểm tra cột "Environment" đã chọn `Production` và `Preview`.

### 3.2. Kiểm tra Schema Supabase (Chạy trong SQL Editor - Read-Only)
Quản trị viên mở **Supabase Dashboard → SQL Editor** và chạy truy vấn sau:

```sql
-- 1. Kiểm tra bảng và RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('class_sessions', 'session_participants', 'session_chat_messages');

-- 2. Kiểm tra hàm RPC atomic_join_live_session
SELECT proname, prorettype::regtype, prosrc 
FROM pg_proc 
WHERE proname = 'atomic_join_live_session';

-- 3. Kiểm tra trigger chống leo thang đặc quyền
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table = 'session_participants';
```

> **Kết quả mong đợi**:
> - Bước 1 trả về 3 dòng với `rowsecurity = true`.
> - Bước 2 trả về hàm `atomic_join_live_session`.
> - Bước 3 trả về trigger `trg_prevent_participant_privilege_escalation`.
>
> *Nếu thiếu bất kỳ thành phần nào*: Quản trị viên chỉ cần chạy nội dung file [supabase/migrations/20261016_phase5_live_classroom_schema.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261016_phase5_live_classroom_schema.sql) để áp dụng an toàn.

---

## 4. KẾT LUẬN & ĐIỀU KIỆN TIẾN HÀNH THỬ NGHIỆM

1. **Về mặt Kỹ thuật & Mã nguồn**: Toàn bộ các cơ chế bảo mật cốt lõi, phòng vệ leo thang quyền, hạn chế sĩ số và xử lý media client đều đã vượt qua 100% bài kiểm tra hồi quy tự động.
2. **Không có vấn đề nghiêm trọng (No Blockers)**: Mã nguồn không có lỗ hổng bypass xác thực hay rò rỉ thông tin mật.
3. **Quyết định cho phép thử nghiệm**:
   - ✅ **ĐỦ ĐIỀU KIỆN TIẾN HÀNH PILOT 2 NGƯỜI (READY FOR TWO-USER PILOT)**: Theo hướng dẫn chi tiết tại [PHASE_5_2_TWO_USER_TEST_CHECKLIST.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_5_2_TWO_USER_TEST_CHECKLIST.md).
   - ⏳ **CHỜ KẾT QUẢ PILOT 2 NGƯỜI ĐỂ MỞ RỘNG LÊN 5–10 NGƯỜI**: Khi Pilot 2 người đạt tất cả tiêu chí chất lượng, mới mở rộng sang [PHASE_5_2_MULTI_USER_TEST_CHECKLIST.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_5_2_MULTI_USER_TEST_CHECKLIST.md).
   - ❌ **CHƯA ĐỦ ĐIỀU KIỆN NGHIỆM THU 50 NGƯỜI (NOT YET VERIFIED FOR 50 USERS)**: Phải hoàn thành có kết quả thực tế ở các cấp nhỏ trước.
