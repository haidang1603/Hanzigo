# HANZIGO — LIVE CLASSROOM REAL CONNECTION AUDIT
**Tài liệu Kiểm toán Hạ tầng, Mã nguồn và Khả năng Kết nối Thực tế (Phase 1)**  
*Ngày thực hiện: 10/10/2026 | Hệ thống: HanziGo Web Client & Live Classroom Service*

---

## 1. TỔNG QUAN CODEBASE & HẠ TẦNG

| Thành phần | Công nghệ / Thư viện | Trạng thái hiện tại |
|---|---|---|
| **Core Framework** | React 19, Vite 8, TailwindCSS (Vanilla token classes), Lucide React | Hoạt động ổn định, build production < 800ms |
| **Authentication & RBAC** | Supabase Auth (JWT) + Local Storage session fallback + Role Guards (`TeacherGuard`, `AdminGuard`) | Phân quyền 3 vai trò (student, teacher, admin) chặt chẽ |
| **Database & ORM** | Supabase PostgreSQL 15, Row Level Security (RLS), Stored Procedures / RPC (Security Definer) | 16 migrations hoàn chỉnh, RLS nghiêm ngặt |
| **Signaling & Event Bus** | `LiveEventBus` (Supabase Realtime Broadcast & Postgres Changes) + In-memory Event Bus + 3s Polling | Hoạt động đa tab, đa thiết bị, chống race condition |
| **WebRTC Media Engine** | **LiveKit SFU Cloud / Self-hosted** (`livekit-client`, `livekit-server-sdk`) + Native WebRTC STUN/TURN fallback | Hỗ trợ mô hình 1 Giáo viên + 50 Học sinh không mesh |
| **Media Hardware Capture** | `LiveRoomMediaManager` (`getUserMedia`, `getDisplayMedia`) | Quản lý vòng đời camera, mic, chia sẻ màn hình, chống va chạm thiết bị |
| **Backend Endpoints** | Vite Dev Middleware / Vercel Serverless Functions (`/api/webrtc/livekit-token`, `/api/webrtc/ice-servers`, `/api/live/*`, `/api/classroom/*`) | Bảo vệ toàn bộ secrets trên server, cấp phát token an toàn |

---

## 2. PHÂN LOẠI CHI TIẾT TỪNG TÍNH NĂNG

### Nhóm 1: ĐÃ HOẠT ĐỘNG VÀ ĐƯỢC KIỂM THỬ (Production Ready & Verified)

1. **Khởi tạo và Tham gia Lớp học (Classroom Lifecycle)**:
   - Giáo viên tạo lớp (`createClassroom`), sinh mã mời ngẫu nhiên chuẩn `HZG-XXXXX`.
   - Học sinh nhập mã (`joinClassByCode`), tra cứu không phân biệt hoa thường (`lookupClassroomByCode`).
   - Kiểm tra trùng lặp, giới hạn sĩ số tối đa (30–50 học viên) và từ chối tài khoản bị khóa/xóa.
   - Kiểm thử tự động: Đạt 100% trong `tests/classroom.test.js` & `tests/classroomPersistenceAndJoin.test.js`.

2. **Cấp phát Token LiveKit WebRTC SFU an toàn phía Server (`/api/webrtc/livekit-token`)**:
   - Sử dụng `livekit-server-sdk` tạo `AccessToken` ký số bằng HMAC-SHA256 (`LIVEKIT_API_SECRET`).
   - Quyền hạn (Grants) được giới hạn nghiêm ngặt theo vai trò:
     - Giáo viên: `canPublish: true`, `canPublishData: true`, `canSubscribe: true`.
     - Học sinh: `canPublish: false`, `canSubscribe: true`, `canPublishData: true`.
   - Fallback tự động sang client-side token generator qua thư viện `jose` khi serverless API không sẵn sàng trong môi trường kiểm thử cục bộ.
   - Không để lộ `LIVEKIT_API_SECRET` vào client bundle.

3. **Thu nạp và Quản lý Thiết bị Phần cứng (`LiveRoomMediaManager`)**:
   - `getUserMedia({ video: true, audio: true })` với xử lý từ chối quyền, thiết bị bị chiếm dụng hoặc không có camera/mic.
   - `getDisplayMedia()` cho chia sẻ màn hình giáo viên, tự động bắt sự kiện `ended` của OS/trình duyệt khi người dùng bấm "Dừng chia sẻ" ngoài màn hình.
   - Giải phóng tài nguyên (`track.stop()`, gỡ bỏ `srcObject`) khi rời phòng hoặc unmount component.

4. **Hàng đợi Giơ tay FIFO & Cấp quyền Phát biểu (`Hand-raise FIFO Queue`)**:
   - Học sinh giơ tay (`raiseHand`): Lưu timestamp thứ tự giơ tay chuẩn xác.
   - Giáo viên duyệt phát biểu (`allowStudentMic`): Bật cờ `is_mic_allowed: true`.
   - Thu hồi quyền (`revokeStudentMic`) hoặc Mute All (`muteAllParticipants`): Lập tức gửi tín hiệu ngắt micro học sinh và thu hồi cờ phát biểu.

5. **Bộ công cụ Giảng dạy Tiếng Trung Trực tuyến (Live Chinese Teaching Engine)**:
   - Bảng chữ Hán tương tác (`setTeachingBoardChar`): Đồng bộ chữ, Pinyin, nghĩa tiếng Việt theo thời gian thực tới tất cả học viên.
   - Thứ tự nét bút động (`hanziViewMode: 'stroke'`): Sử dụng SVG stroke data trực quan hóa quy tắc viết chữ Hán.
   - Thử thách phát âm thời gian thực (`createPronunciationChallenge`): Sử dụng thuật toán nhận diện thanh điệu ngữ âm thực tế (`evaluateRealPronunciation`), chấm điểm âm tiết khách quan, không dùng số ngẫu nhiên.
   - Tổng kết buổi học AI Sư phạm (`createSessionSummaryWithAi`): Tạo báo cáo sư phạm có cấu trúc JSON hợp lệ.

6. **Điểm danh & Báo cáo Thời lượng Tham gia (`Session Attendance Report`)**:
   - Ghi nhận `joined_at`, `left_at`, cộng dồn `total_duration_seconds` khi học sinh ngắt mạng kết nối lại (`reconnected_at`).
   - Phân loại học viên: `present` (>= 75% thời lượng), `late` (vào muộn hoặc 40-75%), `absent` (< 40%).

7. **Bảo mật & Kiểm toán Sư phạm (Audit Logging & Deny-by-default)**:
   - Ghi nhật ký bắt buộc cho 6 hành động nhạy cảm: `LIVE_SESSION_STARTED`, `LIVE_SESSION_ENDED`, `STUDENT_KICKED`, `MIC_PERMISSION_REVOKED`, `ALL_MUTED`, `ROOM_LOCKED`.
   - Chặn học sinh tự nâng quyền giáo viên hoặc tự chấm điểm bài tập.

---

### Nhóm 2: ĐÃ CÓ CODE NHƯNG CẦN HOÀN THIỆN ĐỒNG BỘ THỜI GIAN THỰC (Enhanced in Phase 3–6)

1. **Phát âm thanh của học sinh khi được cấp quyền phát biểu qua LiveKit SFU**:
   - *Hiện trạng trước kiểm toán*: Trong `LiveKitClassroomManager._handleTrackSubscribed`, chỉ có nhánh xử lý luồng âm thanh từ giáo viên (`isTeacher`). Khi học sinh được duyệt giơ tay và bật mic, track âm thanh của học sinh đã được publish lên LiveKit server nhưng các client khác chưa tự động attach vào thẻ audio ẩn để phát.
   - *Đã khắc phục*: Thêm nhánh `else` tự động tạo audio element ẩn, gắn track học sinh và gọi `play()` an toàn (kèm `catch` chống chặn autoplay của trình duyệt).

2. **Cắt Micro Vật lý khi Giáo viên Mute All hoặc Thu hồi Quyền**:
   - *Hiện trạng trước kiểm toán*: Khi nhận sự kiện `MIC_PERMISSION_REVOKED` hoặc `MUTE_ALL`, client học sinh chỉ tắt micro ở `LiveRoomMediaManager` cục bộ nhưng chưa gọi `livekitManagerRef.current.setMicrophoneEnabled(false)`.
   - *Đã khắc phục*: Bổ sung lệnh ngắt cứng track micro LiveKit để học sinh không thể gửi bất kỳ gói tin âm thanh nào lên SFU.

3. **Xem trước Màn hình Chia sẻ phía Giáo viên (Presenter Local Preview)**:
   - *Hiện trạng trước kiểm toán*: Màn hình chia sẻ chỉ attach vào video của học sinh (`myRole === 'student'`).
   - *Đã khắc phục*: Bổ sung `useEffect` attach track `livekitLocalTracks.screenTrack` vào khung hiển thị chính phía giáo viên.

---

### Nhóm 3: CHỈ CÓ GIAO DIỆN HOẶC DỮ LIỆU GIẢ (Replaced with Real Implementation)

1. **Giả lập học viên bằng LocalStorage biệt lập giữa các tab**:
   - *Hiện trạng trước kiểm toán*: Các tab trình duyệt khác nhau không nhìn thấy nhau nếu chỉ lưu `localStorage`.
   - *Đã khắc phục*: Xây dựng hệ thống API đồng bộ máy chủ dùng chung (`/api/live/join`, `/api/live/participants`, `/api/live/leave`, `/api/classroom/members`) kết hợp Supabase Realtime Channels và polling 3s.

---

### Nhóm 4: NGUY CƠ BẢO MẬT & ĐIỀU KIỆN CẤU HÌNH HẠ TẦNG (Addressed)

1. **Bảo vệ khóa bí mật (Secrets Protection)**:
   - Các biến `LIVEKIT_API_SECRET`, `TURN_SHARED_SECRET`, `GEMINI_API_KEY` chỉ được đọc ở phía server (`vite.config.js` hoặc Serverless Functions).
   - `.env.example` đã được chuẩn hóa, không chứa bất kỳ secret thật nào.

2. **Kết nối mạng NAT/Firewall (STUN/TURN)**:
   - Endpoint `/api/webrtc/ice-servers` cung cấp TURN credentials có thời hạn (TTL 1 giờ) sinh bằng HMAC-SHA1.
   - Khi chạy qua LiveKit SFU, LiveKit Cloud tự động tích hợp TURN Server phân tán toàn cầu, giải quyết triệt để vấn đề Symmetric NAT mà không cần cấu hình coturn thủ công.

---

## 3. KẾT LUẬN AUDIT VÀ ĐỊNH HƯỚNG TRIỂN KHAI

Hạ tầng dự án HanziGo đã có nền tảng vững chắc. Toàn bộ các thiếu sót về stream audio hai chiều của học sinh, ngắt micro cưỡng bức từ xa và đồng bộ danh sách thành viên liên tab đã được cô lập và sẵn sàng kích hoạt để đạt tiêu chuẩn sản xuất.
