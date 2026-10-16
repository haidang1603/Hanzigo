# HANZIGO — PHASE 5.2: SỔ TAY KIỂM THỬ PILOT NHÓM 5–10 NGƯỜI (MULTI-USER TEST CHECKLIST)

> **Mô hình thử nghiệm**: 1 Giáo viên + 4 đến 9 Học viên thật kết nối đồng thời từ các thiết bị và vị trí mạng khác nhau.  
> **Điều kiện tiên quyết**: Chỉ được bắt đầu sau khi Pilot 2 người ([PHASE_5_2_TWO_USER_TEST_CHECKLIST.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_5_2_TWO_USER_TEST_CHECKLIST.md)) đạt 10/10 PASS không còn lỗi tồn đọng.  
> **Mục tiêu**: Đánh giá độ chịu tải của LiveKit SFU, chất lượng âm thanh/hình ảnh khi phân phối đa điểm, tính năng Mute All và khả năng đồng bộ trạng thái danh sách lớp học.  

---

## 1. THÀNH PHẦN THIẾT BỊ VÀ PHÂN BỔ MÔ HÌNH THỬ NGHIỆM

| Nhóm kiểm thử | Quy mô | Phân bổ thiết bị thực tế | Kịch bản kiểm thử trọng tâm |
| :--- | :--- | :--- | :--- |
| **Cấp độ A (Nhóm nhỏ)** | 1 Giáo viên + 3–5 Học viên | 1 Laptop PC (Host) + 2 Laptops + 2 Điện thoại di động (Android / iOS) | Phân phối audio giáo viên; 1-2 học viên phát biểu luân phiên; Mute All. |
| **Cấp độ B (Nhóm mở rộng)** | 1 Giáo viên + 7–9 Học viên | 1 Laptop PC (Host) + 4 Laptops + 4 Thiết bị di động trên nhiều mạng | Tham gia đồng thời; đo độ trễ jitter; rớt mạng cục bộ; kiểm tra participant ma. |

---

## 2. CHECKLIST 8 BÀI KIỂM THỬ NHÓM ĐỒNG THỜI (CONCURRENT PILOT SCENARIOS)

### 2.1. MC-01: Nhiều Học viên Tham gia Gần như Đồng thời (Near-Concurrent Joins)
- **Các bước thực hiện**:
  1. Giáo viên mở phòng Live.
  2. 5 học viên cùng lúc bấm "Tham gia buổi học" trong vòng 3–5 giây.
- **Kết quả mong đợi**:
  - Toàn bộ 5 học viên đều vào phòng thành công, không bị lỗi 500 hay timeout.
  - Hàm RPC `atomic_join_live_session` hoặc endpoint serverless xử lý tuần tự an toàn.
  - Danh sách người tham dự hiển thị đúng 6 người (1 Giáo viên + 5 Học viên).
- **Trạng thái**: **READY FOR TEST**

---

### 2.2. MC-02: Phân phối Luồng Âm thanh & Video Giáo viên Đa điểm (Fan-Out Distribution)
- **Các bước thực hiện**:
  1. Giáo viên giảng bài và chia sẻ màn hình tài liệu chữ Hán.
  2. Tất cả học viên cùng mở loa/tai nghe và quan sát màn hình.
- **Kết quả mong đợi**:
  - Toàn bộ học viên đều nghe rõ tiếng giáo viên, âm thanh đồng đều, không bị rè hoặc ngắt quãng.
  - Hình ảnh slide bài giảng rõ nét trên cả màn hình máy tính và điện thoại.
  - CPU trên máy giáo viên không bị quá tải (dưới 70%) nhờ LiveKit SFU đảm nhận việc sao chép luồng (Fan-Out).
- **Trạng thái**: **READY FOR TEST**

---

### 2.3. MC-03: Nhiều Học viên Giơ tay & Cấp quyền Phát biểu Tuần tự
- **Các bước thực hiện**:
  1. 3 học viên cùng bấm nút "Giơ tay xin phát biểu".
  2. Giáo viên chọn Học viên A để cấp mic.
  3. Sau khi Học viên A phát biểu xong, giáo viên thu hồi mic của A và cấp mic cho Học viên B.
- **Kết quả mong đợi**:
  - Danh sách giơ tay sắp xếp theo thứ tự thời gian.
  - Khi A được cấp mic: Cả lớp nghe thấy tiếng A, các học viên khác vẫn bị khóa mic.
  - Khi đổi sang B: Mic của A tắt tức thì, mic của B mở khóa mượt mà.
- **Trạng thái**: **READY FOR TEST**

---

### 2.4. MC-04: Thử nghiệm Tính năng "Tắt Mic Tất cả" (Mute All Participants)
- **Các bước thực hiện**:
  1. Đang có 2 học viên được cấp quyền mở micro và cùng phát âm.
  2. Giáo viên bấm nút "Tắt mic tất cả" (Mute All).
- **Kết quả mong đợi**:
  - Toàn bộ micro của học viên bị tắt ngay lập tức trong vòng < 500ms.
  - LiveKit SFU thực hiện `mutePublishedTrack` và database cập nhật `is_mic_allowed: false`.
  - Không có âm thanh dư thừa nào tiếp tục lọt vào phòng.
- **Trạng thái**: **READY FOR TEST**

---

### 2.5. MC-05: Khả năng Chịu lỗi khi 1-2 Học viên Mất Mạng Đột ngột
- **Các bước thực hiện**:
  1. Buổi học đang diễn ra bình thường.
  2. Học viên C và D đột ngột tắt Wi-Fi hoặc đóng trình duyệt.
  3. Sau 10 giây, Học viên C bật lại Wi-Fi và quay lại phòng.
- **Kết quả mong đợi**:
  - Phòng học của giáo viên và các học viên khác hoàn toàn không bị ảnh hưởng, âm thanh giáo viên không bị ngắt.
  - Khi C và D mất mạng, sau thời gian timeout (khoảng 10–15s), tên của D chuyển sang trạng thái offline/rời phòng.
  - Khi C kết nối lại: Tự động phục hồi media, không tạo bản ghi học viên trùng lặp trong danh sách.
- **Trạng thái**: **READY FOR TEST**

---

### 2.6. MC-06: Kiểm tra Tính Toàn vẹn Dữ liệu & Chống "Participant Ma" (Ghost Participants)
- **Các bước thực hiện**:
  1. Trong suốt buổi học kéo dài 20 phút, cho một số học viên luân phiên ra vào phòng.
  2. Đối chiếu số lượng hiển thị trên giao diện với kết quả trả về từ API `/api/live/participants`.
- **Kết quả mong đợi**:
  - Số lượng người tham gia trên UI khớp 100% với số lượng active trong database (`left_at IS NULL`).
  - Không xuất hiện hiện tượng "người đã thoát nhưng tên vẫn còn trong danh sách" (Ghost participant).
  - Không có thẻ `<audio>` rác nào chạy ngầm trong DOM trình duyệt.
- **Trạng thái**: **READY FOR TEST**

---

### 2.7. MC-07: Đo Độ Trễ Âm thanh & Độ Trượt Hình ảnh (Perceived Latency & Jitter)
- **Các bước thực hiện**:
  1. Giáo viên bật camera quay đồng hồ đếm giây có mili-giây (hoặc vỗ tay theo nhịp).
  2. Học viên so sánh hình ảnh/tiếng vỗ tay nhận được trên thiết bị của mình.
- **Kết quả mong đợi**:
  - Độ trễ âm thanh cảm nhận < 300ms (nói và nghe gần như tức thời).
  - Độ trễ hình ảnh < 500ms.
  - Video không bị giật cục, không bị đứng khung hình (freeze) quá 1 giây.
- **Trạng thái**: **READY FOR TEST**

---

### 2.8. MC-08: Thử nghiệm Từ chối Học viên Vượt Sĩ số khi Đầy Lớp (Capacity Rejection)
- **Các bước thực hiện**:
  - *Lưu ý*: Với lớp pilot giới hạn tạm thời N người (ví dụ cấu hình test `max_capacity = 5`), cho 5 học viên vào phòng, sau đó học viên thứ 6 bấm tham gia.
- **Kết quả mong đợi**:
  - Học viên thứ 6 nhận được thông báo từ chối rõ ràng: "Phòng học đã đạt sĩ số tối đa".
  - Máy chủ trả về HTTP 403, không cấp token WebRTC, không cho phép kết nối vào SFU.
- **Trạng thái**: **READY FOR TEST**

---

## 3. BẢNG TIÊU CHÍ ĐÁNH GIÁ CHẤT LƯỢNG PILOT ĐA ĐIỂM

| Tiêu chí | Ngưỡng chấp nhận (Pass) | Ngưỡng cảnh báo (Warning) | Thất bại (Fail) |
| :--- | :--- | :--- | :--- |
| **Độ trễ âm thanh trung bình** | < 300 ms | 300 – 600 ms | > 600 ms |
| **Tỷ lệ rớt gói tin audio (Packet Loss)** | < 2% | 2% – 5% | > 5% (Mất chữ, méo tiếng) |
| **CPU máy giáo viên khi chia sẻ màn hình** | < 60% | 60% – 80% | > 85% (Máy đơ, quạt hú to) |
| **Thời gian phục hồi Reconnect** | < 5 giây | 5 – 10 giây | Treo phòng, phải tải lại trang |
| **Sự cố rò rỉ audio / Vọng tiếng** | 0 trường hợp | Có tiếng vọng nhỏ khi bật mic | Tiếng vọng rú rít kéo dài (Feedback loop) |

---

## 4. QUY TRÌNH HÀNH ĐỘNG SAU BUỔI PILOT
1. Thu thập toàn bộ biên bản kiểm thử từ các tester tham gia.
2. Kiểm tra log hệ thống trên Vercel và LiveKit Cloud Console để ghi nhận lượng băng thông tiêu thụ và tỷ lệ lỗi WebRTC.
3. Nếu tất cả bài test MC-01 đến MC-08 đều đạt: Cấp chứng nhận **READY FOR 5–10 USER PILOT**.
