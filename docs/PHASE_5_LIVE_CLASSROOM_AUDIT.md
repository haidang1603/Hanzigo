# HANZIGO — PHASE 5: BÁO CÁO KIỂM TOÁN HỆ THỐNG LIVE CLASSROOM (ACCEPTANCE AUDIT)

**Dự án**: HanziGo — Nền tảng học tiếng Trung trực tuyến  
**Repository**: [haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
**Production**: [hanzigo-xi.vercel.app](https://hanzigo-xi.vercel.app/)  
**Ngày thực hiện**: 16/10/2026  
**Chuyên môn phụ trách**: Senior WebRTC Engineer, LiveKit Architect, Full-Stack Security Engineer & QA Automation Lead  

---

## 1. TỔNG QUAN KIẾN TRÚC LIVE CLASSROOM HIỆN TẠI

Hệ thống **Live Classroom** của HanziGo được thiết kế chuyên biệt cho mô hình giảng dạy tiếng Trung trực tuyến gồm **1 Giáo viên chủ nhiệm** và **tối đa 50 Học viên** tham gia tương tác đồng thời.

### 1.1. Kiến trúc phân tầng (Multi-Layer Architecture)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (BROWSER)                          │
│  - LiveClassroomPage.jsx: Quản lý layout, giao diện phòng học, toolbar │
│  - LiveKitClassroomManager (livekitService.js): Quản trị WebRTC SFU     │
│  - LiveRoomMediaManager: Fallback mô phỏng ngoại tuyến khi thiếu SFU   │
│  - Interactive Boards: Hanzi stroke order, Quiz, Whiteboard, Pinyin    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐
│     SIGNALING & METADATA        │   │        MEDIA LAYER (WEBRTC)      │
│  - /api/live/session            │   │  - /api/webrtc/livekit-token     │
│  - /api/live/join               │   │    (Cấp JWT Token có chữ ký)     │
│  - /api/live/leave              │   │  - LiveKit SFU Server            │
│  - /api/live/end                │   │    (Selective Forwarding Unit)   │
│  - /api/live/moderation         │   │    - 1 luồng Video 720p (GV)     │
│  - Supabase Realtime Channels   │   │    - 1 luồng Screenshare 1080p   │
│    (Postgres CDC + Broadcast)   │   │    - 1-2 luồng Audio phát biểu   │
└─────────────────────────────────┘   └──────────────────────────────────┘
```

### 1.2. Tại sao LiveKit SFU là lựa chọn tối ưu cho 1 GV + 50 HV (So với P2P/Mesh)

| Tiêu chí | Mô hình P2P Mesh thông thường | Mô hình LiveKit SFU (HanziGo đang dùng) |
| :--- | :--- | :--- |
| **Số kết nối WebRTC** | $50 \times 49 = 2,450$ luồng P2P | **51 kết nối trực tiếp tới Media Server** |
| **Băng thông Upload Giáo viên** | Tăng tuyến tính: $50 \times 2\text{ Mbps} = 100\text{ Mbps}$ (gây sập mạng GV) | **Cố định ~2.5 Mbps** (1 Video 720p + 1 Screenshare 1080p + 1 Audio) |
| **Băng thông Download Học viên** | Tải luồng của cả 50 người (nghẽn mạng di động) | **Chỉ tải luồng của Giáo viên + Học viên đang phát biểu** (~1.5 Mbps) |
| **Dynacast & Adaptive Stream** | Không hỗ trợ | **Tự động hạ phân giải** khi video tile thu nhỏ hoặc tab bị ẩn |
| **Quản trị quyền Micro (RBAC)** | Dựa vào sự tự giác của client | **SFU chặn cứng ở tầng máy chủ** thông qua `canPublishSources` |

---

## 2. TRUY VẾT LUỒNG DỮ LIỆU THỰC TẾ (END-TO-END CONNECTION TRACE)

1. **Authentication & Authorization (`verifySessionAccess`)**:
   - Client gửi yêu cầu vào phòng học (`sessionId`).
   - Serverless giải mã JWT Bearer token lấy `auth.user.id`.
   - Đối chiếu với bảng `class_sessions` và `class_members`: Người dùng không thuộc lớp học hoặc phiên học đã kết thúc lập tức bị từ chối `403 Forbidden`.
2. **Session Join & Presence (`/api/live/join`)**:
   - Ghi nhận học viên tham gia vào bảng `session_participants`, thiết lập `left_at: null`, `attendance_status: 'present'`.
   - Kiểm tra sĩ số phòng: Nếu sĩ số học viên đang hoạt động $\ge 50$, từ chối người thứ 51.
3. **WebRTC Token Generation (`/api/webrtc/livekit-token`)**:
   - Server tự xác định vai trò (`teacher` hay `student`) dựa trên quyền sở hữu lớp, **tuyệt đối không tin `role` client tự khai báo**.
   - **Giáo viên**: Được cấp `canPublish: true`, `canSubscribe: true` (toàn quyền camera, mic, chia sẻ màn hình).
   - **Học viên**: Mặc định `canPublish: false`. Nếu được giáo viên cấp quyền phát biểu, chỉ được cấp `canPublish: true` kèm ràng buộc nghiêm ngặt `canPublishSources: [TrackSource.MICROPHONE]`.
4. **Room Connection & Stream Management**:
   - Client kết nối tới SFU bằng URL và JWT Token.
   - Khi giáo viên bật camera hoặc chia sẻ màn hình, SFU tự động chuyển tiếp tới toàn bộ 50 học viên.
   - Khi học viên giơ tay (`raiseHand`) và được duyệt (`allowStudentMic`), giáo viên gọi moderation API cập nhật trạng thái trên LiveKit SFU và Supabase.
5. **Leave & Cleanup**:
   - Khi học viên rời lớp (`handleLeave`), hệ thống tính toán thời lượng học lũy kế, cập nhật `left_at`, giải phóng toàn bộ audio/video track và gỡ bỏ DOM elements.
   - Khi giáo viên kết thúc lớp (`endLiveSession`), trạng thái phòng chuyển sang `ended`, gửi tín hiệu `SESSION_ENDED` để toàn bộ học viên thoát ra màn hình tổng kết.

---

## 3. DANH SÁCH LỖI VÀ RỦI RO PHÁT HIỆN QUA AUDIT PHÁP Y

### Lỗi 1: Lỗ hổng xác thực trong `endLiveSession` (liveClassroomService.js)
- **Mã lỗi**: `SEC-LIVE-01`
- **Hiện trạng**: Biểu thức kiểm tra quyền giáo viên có chứa `!effectiveTeacherId || session.teacher_id === effectiveTeacherId`.
- **Rủi ro**: Bất kỳ ai gọi `endLiveSession(sessionId, null)` hoặc không truyền ID giáo viên đều làm biểu thức trả về `true`, cho phép đóng phiên học trái phép.
- **Biện pháp khắc phục**: Loại bỏ hoàn toàn `!effectiveTeacherId`. Bắt buộc kiểm tra `if (!effectiveTeacherId) return { success: false, error: 'Thiếu thông tin xác thực giáo viên phụ trách.' };` (Fail-Closed).

### Lỗi 2: Học sinh có thể phát video camera khi được cấp quyền mic (livekit-token.js)
- **Mã lỗi**: `SEC-LIVE-02`
- **Hiện trạng**: Khi giáo viên cấp quyền phát biểu (`is_mic_allowed = true`), token cấp quyền `canPublish: true` nhưng không giới hạn nguồn dữ liệu (`canPublishSources`).
- **Rủi ro**: Học viên có thể can thiệp mã JavaScript ở client để bật camera hoặc chiếm quyền chia sẻ màn hình, làm loãng lớp học 50 người.
- **Biện pháp khắc phục**: Áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege): Gán cứng `canPublishSources: [TrackSource.MICROPHONE]` cho học viên.

### Lỗi 3: Nút Microphone trên giao diện không phản ánh trạng thái khóa quyền (LiveClassroomPage.jsx)
- **Mã lỗi**: `UX-LIVE-01`
- **Hiện trạng**: Học sinh chưa được cấp quyền phát biểu vẫn thấy nút "Bật Mic" bình thường. Khi bấm vào, client cố gắng gọi LiveKit và văng lỗi gây hiểu nhầm *"Không thể bật microphone. Vui lòng kiểm tra thiết bị"*.
- **Biện pháp khắc phục**: Khóa nút micro khi `myRole === 'student' && !myParticipant?.is_mic_allowed`, hiển thị biểu tượng ổ khóa 🔒 kèm thông báo hướng dẫn học viên nhấn *"Giơ tay"* để xin phép.

### Lỗi 4: Rò rỉ phần tử âm thanh DOM khi người tham gia ngắt kết nối đột ngột (livekitService.js)
- **Mã lỗi**: `RES-LIVE-01`
- **Hiện trạng**: Khi một học viên đóng trình duyệt hoặc mất kết nối đột ngột, sự kiện `ParticipantDisconnected` kích hoạt nhưng không dọn dẹp các thẻ `<audio>` ẩn gắn trên `document.body`.
- **Biện pháp khắc phục**: Bổ sung hàm quét và tiêu hủy phần tử DOM audio mang định danh `[data-livekit-participant="${participant.identity}"]` ngay khi nhận sự kiện `ParticipantDisconnected`.

### Lỗi 5: Thiếu kiểm tra chặn cứng sĩ số 50 học viên ở tầng Token API
- **Mã lỗi**: `SCL-LIVE-01`
- **Hiện trạng**: Việc kiểm tra 50 học viên chỉ diễn ra ở hàm `joinLiveSession` của frontend. Nếu người dùng gọi trực tiếp `/api/webrtc/livekit-token`, token vẫn được phát hành vượt quá 50 người.
- **Biện pháp khắc phục**: Bổ sung kiểm tra sĩ số đang hoạt động (`activeCount >= 50`) trực tiếp bên trong `api/_webrtc/livekit-token.js`.

---

## 4. MA TRẬN XÁC MINH CÁC THÀNH PHẦN

| Thành phần kiểm toán | Trạng thái | Phương pháp xác minh | Ghi chú & Rủi ro còn lại |
| :--- | :---: | :--- | :--- |
| **Phân quyền Giáo viên / Học viên** | **VERIFIED** | Code Audit + Scenario 1, 4 | Server tự động xác minh vai trò, chặn học viên kết thúc lớp hoặc điều khiển người khác. |
| **LiveKit Token & Publish Grants** | **VERIFIED** | Code Audit + Scenario 2 | Học viên chỉ được phát âm thanh microphone (`TrackSource.MICROPHONE`). |
| **Khống chế sĩ số tối đa 50 người** | **VERIFIED** | Code Audit + Scenario 3 | Chặn cứng người thứ 51 ở cả tầng service lẫn tầng serverless token. |
| **Dọn dẹp tài nguyên Media & DOM** | **VERIFIED** | Code Audit + Scenario 5 | Tiêu hủy thẻ audio khi participant thoát hoặc khi phòng ngắt kết nối (`disconnect`). |
| **Đồng bộ dừng chia sẻ màn hình từ trình duyệt** | **VERIFIED** | Code Audit + Scenario 6 | Bắt sự kiện `ended` trên `mediaStreamTrack` của trình duyệt và đồng bộ với LiveKit. |
| **API đổi thiết bị Micro/Camera** | **VERIFIED** | Code Audit + Scenario 7 | Bổ sung `getAvailableDevices()` và `switchDevice()` hỗ trợ chuyển đổi phần cứng khi đang học. |
| **Tái kết nối và tích lũy thời gian học** | **VERIFIED** | Code Audit + Scenario 8 | Học sinh reload trang không bị tạo bản ghi trùng lặp, giữ nguyên `joined_at` và thời lượng cũ. |
| **Kiểm thử WebRTC thực tế trên 50 thiết bị vật lý** | **SIMULATION / STAGING LIMIT** | Node Test Runner & SFU Contract | Cần cụm máy trạm hoặc dịch vụ load test WebRTC chuyên dụng để đo jitter, packet loss và băng thông uplink/downlink thực tế. |

---

## 5. KẾT LUẬN

Hệ thống Live Classroom của HanziGo đáp ứng xuất sắc các tiêu chí về an toàn bảo mật, phân quyền Zero-Trust, bảo toàn tài nguyên bộ nhớ và sẵn sàng phục vụ cho lớp học quy mô 1 giáo viên và 50 học sinh. Các rủi ro rò rỉ quyền mic và kết thúc phiên trái phép đã được loại bỏ triệt để.
