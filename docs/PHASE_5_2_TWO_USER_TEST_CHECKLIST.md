# HANZIGO — PHASE 5.2: SỔ TAY KIỂM THỬ PILOT 2 NGƯỜI (TWO-USER TEST CHECKLIST)

> **Mô hình thử nghiệm**: 1 Giáo viên (Thiết bị A) + 1 Học viên (Thiết bị B).  
> **Mục tiêu**: Xác thực tương tác media hai chiều giữa 2 thiết bị vật lý thực tế qua LiveKit Cloud SFU và Supabase Production.  
> **Nguyên tắc an toàn**: Không ghi lại mật khẩu, token JWT, service keys hoặc dữ liệu cá nhân trong báo cáo này.  

---

## 1. THIẾT BỊ & MÔI TRƯỜNG THỰC HIỆN

| Vai trò | Thiết bị phần cứng | Hệ điều hành & Trình duyệt | Kết nối mạng |
| :--- | :--- | :--- | :--- |
| **Giáo viên (Host)** | Laptop / PC có Camera + Mic ngoài | Windows 11 / macOS, Chrome phiên bản mới nhất | Wi-Fi / Cáp LAN tốc độ >= 30 Mbps |
| **Học viên (Client)** | Laptop hoặc Điện thoại thông minh | macOS / iOS / Android, Safari hoặc Chrome | Wi-Fi hoặc 4G tốc độ >= 15 Mbps |

---

## 2. CHECKLIST 10 BÀI KIỂM THỬ THỰC TẾ CHI TIẾT

### 2.1. TC-01: Đăng nhập & Khởi tạo Lớp học Trực tuyến
- **Điều kiện ban đầu**: Tài khoản Giáo viên đã được gán role `teacher` trong `public.profiles`.
- **Các bước thực hiện**:
  1. Giáo viên đăng nhập trên Thiết bị A tại `/login`.
  2. Truy cập Lớp học → Chọn lớp giảng dạy → Bấm "Bắt đầu buổi học Live".
  3. Nhập tiêu đề buổi học (ví dụ: "Thử nghiệm Lớp HSK 3") → Bấm "Tạo phòng học".
- **Kết quả mong đợi**:
  - Bản ghi mới được tạo trong `class_sessions` với trạng thái `status: 'live'`.
  - Màn hình chuyển vào phòng học Live; camera và micro ở trạng thái sẵn sàng.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Giao diện phòng học hiển thị mã phòng (UUID) và tiêu đề buổi học; log không in secret.
- **Trạng thái**: **READY FOR TEST**

---

### 2.2. TC-02: Học viên Tham gia Lớp học bằng Mã Lớp
- **Điều kiện ban đầu**: Học viên đã đăng nhập tài khoản học viên và đã là thành viên của lớp.
- **Các bước thực hiện**:
  1. Học viên mở Thiết bị B tại `/classroom`.
  2. Bấm vào lớp học đang có phiên Live (hoặc dán đường dẫn phòng học).
  3. Bấm "Tham gia buổi học".
- **Kết quả mong đợi**:
  - Máy chủ gọi `/api/live/join`, xác thực thành viên và tạo bản ghi trong `session_participants`.
  - Học viên vào phòng thành công; danh sách hiển thị tên Giáo viên và Học viên.
  - Nút Micro của học viên bị **khóa màu xám** kèm biểu tượng ổ khóa.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Participant list hiển thị 2 người; nút mic học viên hiển thị "Cần giáo viên cấp quyền".
- **Trạng thái**: **READY FOR TEST**

---

### 2.3. TC-03: Kiểm tra Quyền Token WebRTC Serverless
- **Điều kiện ban đầu**: Cả 2 người đã gửi request lấy token qua `/api/webrtc/livekit-token`.
- **Các bước thực hiện**:
  1. Kiểm tra Network tab (không sao chép chuỗi token).
  2. Đối chiếu phản hồi HTTP 200 trả về từ serverless endpoint.
- **Kết quả mong đợi**:
  - Token giáo viên chứa grant `canPublish: true` (video, audio, data).
  - Token học viên chứa grant `canPublish: false` hoặc chỉ `canPublishSources: [2]` (micro).
  - Tuyệt đối không chứa quyền camera hoặc screenshare cho học viên.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Response JSON trả về `{ success: true, token: "ey...", livekitUrl: "wss://..." }`.
- **Trạng thái**: **READY FOR TEST**

---

### 2.4. TC-04: Giáo viên Bật/Tắt Camera và Micro
- **Điều kiện ban đầu**: Giáo viên đang trong phòng học trên Thiết bị A.
- **Các bước thực hiện**:
  1. Giáo viên bấm nút "Bật Camera" → Trình duyệt hỏi quyền → Chọn "Allow".
  2. Bấm nút "Bật Micro" → Trình duyệt hỏi quyền → Chọn "Allow".
  3. Bấm Tắt Camera rồi bật lại; bấm Tắt Micro rồi bật lại.
- **Kết quả mong đợi**:
  - Video giáo viên hiển thị ở khung chính; thanh âm lượng dao động theo giọng nói.
  - Khi tắt, khung video chuyển thành avatar hoặc nền đen chữ tên; micro ngắt tiếng ngay.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Giao diện giáo viên chuyển đổi trạng thái icon camera/mic xanh/đỏ chính xác.
- **Trạng thái**: **READY FOR TEST**

---

### 2.5. TC-05: Học viên Xem Hình ảnh & Nghe Âm thanh Giáo viên
- **Điều kiện ban đầu**: Giáo viên đang phát camera và micro từ Thiết bị A.
- **Các bước thực hiện**:
  1. Học viên trên Thiết bị B quan sát màn hình và lắng nghe loa/tai nghe.
  2. Giáo viên đếm số từ 1 đến 10.
- **Kết quả mong đợi**:
  - Học viên nhìn thấy hình ảnh giáo viên sắc nét (tối thiểu 720p, chuyển động mượt).
  - Âm thanh nghe rõ ràng, không bị trễ tiếng quá 500ms, không có hiện tượng tiếng vọng (echo).
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Track video và audio remote render trong DOM phần tử `<video>` và `<audio>`.
- **Trạng thái**: **READY FOR TEST**

---

### 2.6. TC-06: Chia sẻ Màn hình & Nhận diện Dừng Chia sẻ
- **Điều kiện ban đầu**: Giáo viên đang trong phòng học.
- **Các bước thực hiện**:
  1. Giáo viên bấm nút "Chia sẻ màn hình" → Chọn 1 tab trình duyệt chứa slide bài học Hanzi.
  2. Học viên quan sát Thiết bị B xem có thấy slide hay không.
  3. Giáo viên bấm nút "Stop sharing" màu xanh mặc định trên thanh nổi của trình duyệt.
- **Kết quả mong đợi**:
  - Màn hình học viên lập tức chuyển sang hiển thị slide bài học với độ nét cao (chữ Hán đọc rõ).
  - Khi giáo viên bấm Stop của trình duyệt, icon chia sẻ màn hình trên trang web tự động tắt.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Sự kiện `screenTrack.mediaStreamTrack.onended` kích hoạt đồng bộ state.
- **Trạng thái**: **READY FOR TEST**

---

### 2.7. TC-07: Học viên Xin Quyền Phát biểu (Giơ tay)
- **Điều kiện ban đầu**: Học viên đang nghe giảng, micro bị khóa.
- **Các bước thực hiện**:
  1. Học viên bấm nút "Giơ tay xin phát biểu" trên Thiết bị B.
  2. Giáo viên quan sát màn hình Thiết bị A xem thông báo và biểu tượng giơ tay.
- **Kết quả mong đợi**:
  - Biểu tượng giơ tay vàng xuất hiện bên cạnh tên học viên trong danh sách người tham gia.
  - Giáo viên nhận được thông báo: "Học viên [Tên] đang xin phát biểu".
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Database cập nhật `session_participants.hand_raised = true`.
- **Trạng thái**: **READY FOR TEST**

---

### 2.8. TC-08: Giáo viên Cấp & Thu hồi Quyền Micro của Học viên
- **Điều kiện ban đầu**: Học viên đang giơ tay.
- **Các bước thực hiện**:
  1. Giáo viên bấm nút "Cho phép phát biểu" trên Thiết bị A.
  2. Học viên nhận thông báo và bấm nút "Bật Micro" trên Thiết bị B, thử nói vào mic.
  3. Giáo viên lắng nghe âm thanh từ học viên.
  4. Giáo viên bấm "Thu hồi mic" (hoặc "Tắt mic học viên").
- **Kết quả mong đợi**:
  - Khi được cấp: Nút micro học viên chuyển sang có thể bấm; học viên nói thì giáo viên nghe thấy.
  - Khi bị thu hồi: Micro học viên ngay lập tức bị tắt; biểu tượng khóa lại; âm thanh dừng phát ngay.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Endpoint `/api/live/moderation` cập nhật LiveKit SFU và database `is_mic_allowed: false`.
- **Trạng thái**: **READY FOR TEST**

---

### 2.9. TC-09: Mất Mạng, Tự động Kết nối lại & Rời phòng
- **Điều kiện ban đầu**: Học viên đang trong phòng học.
- **Các bước thực hiện**:
  1. Học viên tắt Wi-Fi Thiết bị B trong khoảng 5 giây rồi bật lại.
  2. Quan sát giao diện có hiện banner "Đang kết nối lại...".
  3. Sau khi kết nối lại thành công, học viên bấm nút "Rời phòng".
- **Kết quả mong đợi**:
  - Kết nối WebRTC tự động phục hồi trong 3–5 giây mà không cần bấm F5 tải lại trang.
  - Khi học viên bấm rời phòng: Thiết bị B trở về trang lớp học; Thiết bị A thấy học viên biến mất khỏi danh sách.
  - Thẻ DOM audio của học viên trên Thiết bị A được gỡ bỏ hoàn toàn.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Database cập nhật `session_participants.left_at = NOW()` và tổng thời gian tham dự.
- **Trạng thái**: **READY FOR TEST**

---

### 2.10. TC-10: Giáo viên Kết thúc Buổi học & Kiểm tra Dữ liệu
- **Điều kiện ban đầu**: Buổi học đang diễn ra.
- **Các bước thực hiện**:
  1. Giáo viên bấm nút "Kết thúc buổi học".
  2. Xác nhận hộp thoại "Bạn có chắc chắn muốn kết thúc buổi học?".
  3. Kiểm tra chuyển hướng trên cả 2 thiết bị.
- **Kết quả mong đợi**:
  - Phòng học đóng lại; toàn bộ người dùng nhận thông báo và chuyển về trang tổng quan lớp.
  - Bản ghi `class_sessions` cập nhật `status: 'ended'`, `ended_at: NOW()`.
  - Toàn bộ người tham gia được cập nhật `left_at` (nếu chưa rời) và trạng thái điểm danh.
- **Kết quả quan sát**: *[Ghi nhận khi tester thực hiện trên thiết bị]*
- **Bằng chứng an toàn**: Endpoint `/api/live/end` hoàn tất với status 200; không thể join lại phòng này.
- **Trạng thái**: **READY FOR TEST**

---

## 3. BIỂU MẪU KÝ DUYỆT HOÀN THÀNH PILOT 2 NGƯỜI

| Mục tiêu thẩm định | Kết quả thực tế | Người thực hiện | Chữ ký xác nhận |
| :--- | :--- | :--- | :--- |
| **Âm thanh Giáo viên** | Đạt / Không đạt | Tester 1 (Giáo viên) | |
| **Hình ảnh & Slide** | Đạt / Không đạt | Tester 2 (Học viên) | |
| **Phân quyền Micro** | Đạt / Không đạt | QA Lead | |
| **Độ ổn định Reconnect** | Đạt / Không đạt | QA Lead | |

> **Điều kiện phê duyệt mở rộng lên 5–10 người**: Phải đạt 10/10 bài kiểm thử trên mà không có bất kỳ lỗi P0 (Crash, rò rỉ bảo mật, không nghe được tiếng).
