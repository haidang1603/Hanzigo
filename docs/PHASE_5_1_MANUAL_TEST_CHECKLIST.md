# HANZIGO — PHASE 5.1: SỔ TAY KIỂM THỬ THỰC TẾ TRÊN THIẾT BỊ THẬT (MANUAL TEST CHECKLIST)

> **Mục tiêu**: Cung cấp quy trình từng bước để Đội ngũ QA và Quản trị viên tiến hành chạy thử nghiệm lớp học trực tuyến Live Classroom với người dùng thật, thiết bị thật và kết nối mạng thực tế.  
> **Nguyên tắc an toàn**: Không ghi lại mật khẩu, API keys, token đăng nhập hoặc thông tin định danh cá nhân (PII) trong biên bản kiểm thử.  

---

## 1. LỘ TRÌNH THỬ NGHIỆM TỪNG BƯỚC (STAGED PILOT ROADMAP)

### Giai đoạn 1: Lớp học Tối thiểu (2 người)
- **Đối tượng**: 1 Giáo viên (Laptop/PC) + 1 Học viên (Laptop hoặc Điện thoại di động).
- **Mục tiêu**: Xác thực luồng tạo phòng, cấp token WebRTC, truyền phát Camera/Micro của giáo viên, chia sẻ màn hình và cấp quyền xin phát biểu của học viên.
- **Thời lượng**: 15 – 20 phút.

### Giai đoạn 2: Lớp học Nhóm nhỏ (5 – 10 người)
- **Đối tượng**: 1 Giáo viên + 4 đến 9 Học viên trên nhiều hệ điều hành (Windows, macOS, iOS, Android).
- **Mục tiêu**: Kiểm tra độ trễ mạng, tính ổn định của SFU LiveKit khi nhiều client subscribe cùng lúc, tính năng Mute All và khả năng kết nối lại khi có người dùng mất mạng.
- **Thời lượng**: 30 – 45 phút.

### Giai đoạn 3: Kiểm thử Tải Sĩ số Lớn (50 người)
- **Điều kiện tiên quyết**: Chỉ tiến hành sau khi Giai đoạn 1 và 2 đạt 100% tiêu chí chấp nhận không có lỗi P0/P1.
- **Mục tiêu**: Đo băng thông SFU, CPU máy giáo viên và kiểm tra phản hồi từ chối của học viên thứ 51.

---

## 2. BẢNG TIÊU CHÍ ĐÁNH GIÁ CHẤT LƯỢNG (ACCEPTANCE CRITERIA)

| Tiêu chí | Ngưỡng đạt yêu cầu (Pass) | Dấu hiệu cảnh báo (Warning) | Không đạt (Fail) |
| :--- | :--- | :--- | :--- |
| **Độ trễ Âm thanh (Audio Latency)** | < 300 ms (Nói và nghe gần như tức thời) | 300 – 600 ms | > 600 ms, âm thanh giật cục, méo tiếng |
| **Độ trượt Hình ảnh (Video Quality)** | 720p / 24–30 fps mượt mà | 480p / 15–20 fps | Đứng hình, mất gói tin nặng, vỡ hạt kéo dài |
| **Độ trễ Chia sẻ Màn hình** | Chữ đọc rõ nét, độ trễ thao tác < 500 ms | Chữ hơi nhòe khi cuộn trang nhanh | Không xem được nội dung trình chiếu |
| **Thời gian Reconnect khi mất mạng** | Tự động phục hồi trong vòng 3 – 5 giây | 5 – 10 giây | Treo giao diện, bắt buộc người dùng bấm F5 |
| **Độ trễ Phân quyền Micro** | Giáo viên bấm "Cấp Mic", học viên bật được sau < 1s | 1 – 2 giây | Học viên không bật được mic dù đã được cấp |

---

## 3. CHECKLIST 14 KỊCH BẢN KIỂM THỬ THỰC TẾ CHI TIẾT

| STT | Kịch bản kiểm thử | Điều kiện ban đầu | Các bước thực hiện | Kết quả mong đợi | Bằng chứng thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | **Giáo viên tạo lớp và tham gia** | Giáo viên đã đăng nhập tài khoản có role `teacher` | 1. Vào Lớp học → Bấm "Bắt đầu buổi học".<br>2. Nhập tiêu đề buổi học → Bấm "Tạo phòng". | Phòng học khởi tạo thành công; giáo viên vào phòng Live; camera & micro khởi động mượt mà. | Unit test Scenario 1 PASS; UI render video container | **READY FOR PILOT** |
| **TC-02** | **Học viên tham gia bằng mã lớp** | Học viên có tài khoản `student` đã đăng ký lớp | 1. Vào phòng qua liên kết lớp hoặc mã phòng.<br>2. Kiểm tra giao diện chờ / vào lớp. | Tham gia thành công; hiển thị danh sách người tham dự; nút Micro bị khóa biểu tượng ổ khóa. | Unit test Scenario 2 PASS; API joinHandler trả 200 | **READY FOR PILOT** |
| **TC-03** | **Hai thiết bị nghe & nhìn thấy giáo viên** | 1 Giáo viên (PC) và 1 Học viên (Phone/Laptop) trong phòng | 1. Giáo viên bật camera và nói vào mic.<br>2. Học viên quan sát màn hình và lắng nghe loa. | Học viên nhìn thấy video giáo viên nét, nghe âm thanh rõ ràng, không bị vọng tiếng (echo). | Cần kiểm tra trên LiveKit Cloud với 2 thiết bị thật | **NOT VERIFIED** (Chờ test thiết bị) |
| **TC-04** | **Giáo viên chia sẻ màn hình** | Giáo viên đang trong phòng học | 1. Bấm nút "Chia sẻ màn hình".<br>2. Chọn cửa sổ tài liệu bài giảng hoặc tab trình duyệt. | Khung hình màn hình trình chiếu thay thế khung camera chính; học viên thấy tài liệu sắc nét. | Scenario 6 Unit test PASS; WebRTC track published | **READY FOR PILOT** |
| **TC-05** | **Giáo viên bấm Stop sharing trình duyệt** | Giáo viên đang chia sẻ màn hình | Bấm vào nút nổi "Stop sharing" mặc định của trình duyệt (thay vì nút trên trang web). | Nút chia sẻ trên web tự động đổi về trạng thái tắt; luồng phát màn hình dừng ngay lập tức. | Scenario 6 Unit test PASS; event `track.onended` kích hoạt | **READY FOR PILOT** |
| **TC-06** | **Học viên xin phát biểu & được cấp mic** | Học viên đang nghe giảng, mic bị khóa | 1. Học viên bấm "Giơ tay xin phát biểu".<br>2. Giáo viên nhận thông báo và bấm "Cho phép phát biểu".<br>3. Học viên bấm bật Micro và nói. | Nút micro học viên mở khóa; học viên phát biểu và cả lớp nghe rõ tiếng. | Scenario 4 & 8D PASS; `TrackSource.MICROPHONE` granted | **READY FOR PILOT** |
| **TC-07** | **Học viên bị thu hồi quyền mic khi đang phát** | Học viên đang bật mic và phát biểu | Giáo viên bấm nút "Tắt mic" hoặc "Thu hồi mic" của học viên đó. | Micro của học viên ngay lập tức bị tắt; biểu tượng mic chuyển sang khóa đỏ; track âm thanh dừng truyền. | Scenario 4 PASS; LiveKit SFU `mutePublishedTrack` | **READY FOR PILOT** |
| **TC-08** | **Học viên bị từ chối quyền mic/cam ở trình duyệt** | Trình duyệt thiết lập "Block Microphone" | 1. Vào phòng học.<br>2. Thử bật micro khi được cấp quyền. | Ứng dụng hiển thị thông báo thân thiện: "Không thể truy cập Microphone. Vui lòng cấp quyền trong cài đặt trình duyệt". | Try/catch trong `livekitService.js` xử lý `NotAllowedError` | **READY FOR PILOT** |
| **TC-09** | **Đổi thiết bị âm thanh hoặc video** | Thiết bị có 2 microphone hoặc tai nghe Bluetooth | 1. Cắm tai nghe hoặc kết nối Bluetooth.<br>2. Chọn thiết bị mới trong menu Cài đặt thiết bị. | Luồng âm thanh chuyển mượt mà sang tai nghe mới mà không làm ngắt kết nối phòng học. | Hàm `switchDevice()` trong `livekitService.js` | **READY FOR PILOT** |
| **TC-10** | **Học viên mất mạng rồi kết nối lại** | Học viên đang tham gia lớp học | 1. Tắt Wi-Fi trong 5 giây rồi bật lại.<br>2. Quan sát phản hồi của trang web. | Giao diện hiện thông báo "Đang kết nối lại..."; khi có mạng, kết nối tự khôi phục không mất phiên. | LiveKit SDK auto-reconnect + Service sync presence | **READY FOR PILOT** |
| **TC-11** | **Học viên đóng tab đột ngột** | Học viên đang ở trong phòng học | Đóng tab trình duyệt hoặc tắt nguồn thiết bị. | Trong vòng 10–15s, tên học viên biến mất khỏi danh sách người tham gia; thẻ audio DOM được dọn dẹp. | Sự kiện `ParticipantDisconnected` + cleanup logic | **READY FOR PILOT** |
| **TC-12** | **Giáo viên rời lớp & kết thúc phiên** | Giáo viên phụ trách phòng học | Giáo viên bấm "Kết thúc buổi học". | Toàn bộ học viên nhận thông báo "Buổi học đã kết thúc" và được điều hướng an toàn về trang lớp học. | Scenario 1 Unit test PASS; API `/api/live/end` cập nhật status | **READY FOR PILOT** |
| **TC-13** | **Kẻ xấu thử kết thúc lớp hoặc điều khiển người khác** | Học viên hoặc người ngoài lớp | Gọi trực tiếp API `/api/live/end` hoặc `/api/live/moderation`. | Máy chủ trả về HTTP 403 Forbidden; không có thay đổi nào xảy ra với phòng học. | Scenario 10 Unit test PASS (Status 403) | **VERIFIED (Security)** |
| **TC-14** | **Học viên thứ 51 bị từ chối khi lớp đã có 50 học viên** | Phòng học đã có 50 học viên hoạt động | Học viên thứ 51 bấm tham gia phòng học. | Máy chủ trả về HTTP 403 với thông báo "Phòng học đã đạt sĩ số tối đa (50 học viên)"; không cấp token. | Scenario 3 & 9 Unit test PASS (Status 403) | **VERIFIED (Logic)** |

---

## 4. HƯỚNG DẪN GHI NHẬN LỖI AN TOÀN (INCIDENT REPORTING PROTOCOL)

Khi phát hiện sự cố trong quá trình thử nghiệm, Tester cần ghi nhận vào biên bản sự cố theo định dạng chuẩn sau:

```markdown
### Phiếu báo cáo sự cố Live Classroom
- **Thời điểm**: [Ví dụ: 14:35 ngày 16/10/2026]
- **Kịch bản gặp lỗi**: [Ví dụ: TC-10 - Reconnection]
- **Thiết bị & Trình duyệt**: [Ví dụ: Laptop Dell Windows 11, Chrome 129]
- **Hành động đã thực hiện**: [Mô tả chi tiết các bước]
- **Hiện tượng quan sát**: [Ví dụ: Sau khi bật lại Wi-Fi, màn hình video bị đen]
- **Log Console trình duyệt (ĐÃ LỌC BÍ MẬT)**:
  - ⚠️ LƯU Ý: Xóa bỏ mọi chuỗi token JWT, Bearer token hoặc API keys trước khi dán log!
  - `[LiveKit] Reconnecting...`
  - `[LiveKit] Failed to resume session: timeout`
```
