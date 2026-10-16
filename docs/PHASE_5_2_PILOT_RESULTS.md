# HANZIGO — PHASE 5.2: BÁO CÁO KẾT QUẢ THẨM ĐỊNH & KẾ HOẠCH TRIỂN KHAI PILOT (PILOT RESULTS)

> **Dự án**: HanziGo — Nền tảng học tiếng Trung cho người Việt  
> **Repository**: [https://github.com/haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
> **Production Target**: [https://hanzigo-xi.vercel.app/](https://hanzigo-xi.vercel.app/)  
> **Vai trò**: Senior Full-Stack Engineer, LiveKit/WebRTC Engineer & QA Lead  
> **Thời điểm thẩm định**: Ngày 16 tháng 10 năm 2026  
> **Trạng thái chính thức**: **READY FOR TWO-USER PILOT** | **CONDITIONAL FOR 5–10 USERS** | **NOT YET VERIFIED FOR 50 USERS**  

---

## 1. TỔNG QUAN HIỆN TRẠNG KIỂM THỬ THỰC TẾ

Nhằm tuân thủ nguyên tắc **kiểm định trung thực và an toàn cao nhất**, chúng tôi phân định rõ ràng giữa những gì hệ thống đã được kiểm chứng bằng mã nguồn/kiểm thử tự động và những gì cần người dùng thật thực hiện trên thiết bị vật lý:

| Phân loại kiểm tra | Nội dung chi tiết | Hiện trạng kỹ thuật |
| :--- | :--- | :---: |
| **Đã thực hiện (Automated & Code)** | • Kiểm toán toàn bộ router và handlers: `/api/live/*`, `/api/webrtc/*`.<br>• Tích hợp hàm RPC nguyên tử `atomic_join_live_session` vào [join.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/live/join.js).<br>• Bổ sung cơ chế fallback cho [participants.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/live/participants.js).<br>• Chạy bộ kiểm thử hồi quy 47 suites: **524 / 524 tests PASS** (11/11 scenarios Live Classroom).<br>• Kiểm tra Linter: **0 errors** (467 warnings).<br>• Kiểm tra Production Build Vite: **Thành công trong 698ms**. | **HOÀN TẤT (100%)** |
| **Chưa thực hiện (Physical Devices)** | • Kết nối media 2 chiều giữa 2 thiết bị vật lý trên LiveKit Cloud SFU.<br>• Kiểm thử đa điểm với 5–10 thiết bị thật tham gia đồng thời.<br>• Thử tải băng thông và jitter với 50 media streams thật. | **CHỜ THỰC HIỆN BỞI TESTER** |
| **Môi trường kiểm thử hiện tại** | Môi trường phát triển cục bộ + Node.js Test Runner + Vite Production Build + Local in-memory simulation mode (do chưa cấu hình LiveKit Cloud secrets). | **STAGING / DEV READY** |
| **Số lượng thiết bị thật tham gia** | 0 thiết bị vật lý (Tất cả kết quả PASS trong console là kiểm thử logic và giả lập WebRTC). | **CHƯA ĐO TRÊN THIẾT BỊ THẬT** |

---

## 2. CÁC LỖI ĐÃ PHÁT HIỆN & BIỆN PHÁP XỬ LÝ TRONG PHASE 5.2

1. **Lỗ hổng chưa kích hoạt RPC khóa hàng ở `join.js`**:
   - *Vấn đề*: Trong Phase 5.1, migration `atomic_join_live_session` đã được tạo nhưng file `api/_handlers/live/join.js` chưa gọi RPC này, khiến các yêu cầu gia nhập vẫn có thể gặp race condition ở mức Supabase direct query khi gần đầy lớp.
   - *Khắc phục*: Đã cập nhật [api/_handlers/live/join.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/live/join.js) để ưu tiên gọi `supabase.rpc('atomic_join_live_session')` với khóa `FOR UPDATE` tuần tự hóa các yêu cầu. Nếu RPC chưa cài đặt, hệ thống fallback mượt mà sang direct upsert.
2. **Thiếu cơ chế fallback tại `participants.js`**:
   - *Vấn đề*: Khi chạy không có Supabase credentials, endpoint `/api/live/participants` trả về mảng rỗng `[]`, khiến client không thể theo dõi danh sách người tham dự ở chế độ mô phỏng hoặc staging mất kết nối DB.
   - *Khắc phục*: Đã bổ sung đọc dữ liệu đồng bộ từ `memoryParticipants` trong [api/_handlers/live/participants.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/live/participants.js).
3. **Mở rộng kiểm thử hồi quy Scenario 11**:
   - Tạo mới Scenario 11 trong [tests/liveClassroomPhase5Reliability.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/liveClassroomPhase5Reliability.test.js) kiểm chứng toàn diện luồng RPC, xử lý từ chối vượt sĩ số và endpoint trả về danh sách participant.

---

## 3. TIÊU CHÍ DỪNG THỬ NGHIỆM KHẨN CẤP (ABORT CRITERIA / STOP CONDITIONS)

Trong quá trình tổ chức buổi học thử nghiệm thực tế (dù ở cấp 2 người hay 5–10 người), buổi pilot **BẮT BUỘC PHẢI DỪNG NGAY LẬP TỨC** và lập phiếu báo cáo sự cố nếu xảy ra bất kỳ trường hợp nào sau đây:

> 🛑 **ĐIỀU KIỆN DỪNG KHẨN CẤP (RED ALERTS)**:
> 1. **Lỗ hổng Bảo mật & Rò rỉ**: Phát hiện token JWT bí mật, API Key hoặc Service Role Key xuất hiện trên console trình duyệt, log công khai hoặc network response client.
> 2. **Leo thang Quyền hạn Trái phép**: Học viên có thể tự bật camera, chia sẻ màn hình, hoặc tự mở micro mà không cần giáo viên phê duyệt.
> 3. **Mất kiểm soát Phòng học**: Giáo viên bấm "Thu hồi mic" hoặc "Tắt mic tất cả" nhưng học viên vẫn tiếp tục truyền âm thanh được vào phòng.
> 4. **Người lạ Xâm nhập trái phép**: Người dùng không có tài khoản hoặc không phải thành viên lớp học có thể tham gia vào phòng Live.
> 5. **Vỡ Giới hạn Sĩ số**: Hệ thống cho phép vượt quá số lượng học viên tối đa đã cấu hình (`max_capacity`).
> 6. **Giáo viên mất Quyền kết thúc**: Giáo viên không thể bấm kết thúc phiên học, hoặc người tham gia không được chuyển hướng an toàn về trang lớp học.
> 7. **Sập Media Toàn bộ (Total Media Failure)**: Âm thanh bị giật méo tiếng liên tục kéo dài trên 1 phút mà không thể tự phục hồi.

---

## 4. LỘ TRÌNH ĐIỀU KIỆN ĐỂ MỞ RỘNG QUY MÔ (SCALE-UP GATES)

```
[BƯỚC 1: Sẵn sàng Kỹ thuật] ──► (524 Tests PASS, Lint 0 error, RPC integrated)
          │
          ▼
[BƯỚC 2: Pilot 2 Người] ─────► (1 Giáo viên + 1 Học viên trên 2 thiết bị thật)
          │                     Phải đạt 10/10 tiêu chí trong TWO-USER CHECKLIST
          │                     Không có lỗi P0/P1
          ▼
[BƯỚC 3: Pilot 5–10 Người] ──► (1 Giáo viên + 4–9 Học viên đa nền tảng)
          │                     Phải đạt 8/8 kịch bản trong MULTI-USER CHECKLIST
          │                     Jitter < 30ms, Latency < 300ms, CPU Host < 70%
          ▼
[BƯỚC 4: Load Test 50 Người] ─► (Thực hiện kiểm thử tải media WebRTC chuyên dụng
                                trên LiveKit Cloud trước khi mở lớp đại trà)
```

---

## 5. KẾT LUẬN NGHIỆM THU CHÍNH THỨC CHO TỪNG CẤP ĐỘ

### 🟢 Cấp độ 1: 1 Giáo viên + 1 Học viên
👉 **READY FOR TWO-USER PILOT**  
- Hệ thống đã sẵn sàng 100% để Quản trị viên và Tester tiến hành buổi học thử nghiệm thực tế đầu tiên giữa 2 người theo tài liệu [PHASE_5_2_TWO_USER_TEST_CHECKLIST.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_5_2_TWO_USER_TEST_CHECKLIST.md).

### 🟡 Cấp độ 2: 1 Giáo viên + 2–5 Học viên và 5–10 Học viên
👉 **READY FOR 5–10 USER PILOT (CONDITIONAL)**  
- Mã nguồn và kiến trúc serverless đã sẵn sàng hỗ trợ nhóm 5–10 người.
- **Điều kiện mở**: Chỉ được kích hoạt sau khi Cấp độ 1 hoàn thành và được Tester ký biên bản xác nhận không có lỗi media hay bảo mật. Quy trình thực hiện chi tiết tại [PHASE_5_2_MULTI_USER_TEST_CHECKLIST.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_5_2_MULTI_USER_TEST_CHECKLIST.md).

### 🔴 Cấp độ 3: Lớp học 50 Học viên đồng thời
👉 **NOT YET VERIFIED FOR 50 USERS**  
- Giới hạn 50 học viên đã được bảo vệ chặt chẽ ở cấp độ logic serverless và database PostgreSQL (có khóa hàng chống race condition).
- Tuy nhiên, **tuyệt đối không tuyên bố hệ thống đã nghiệm thu 50 người** khi chưa có dữ liệu đo kiểm thực tế về băng thông SFU và độ trễ media trên 50 thiết bị vật lý thật.
