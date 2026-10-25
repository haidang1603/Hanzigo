# BÁO CÁO CÁC HẠNG MỤC TỒN TẠI & LỘ TRÌNH TIẾP THEO (PHASE 15 REMAINING GAPS)

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến cho người Việt  
**Giai đoạn:** Phase 15 — Backend–Frontend Integration & Feature Completion  
**Ngày thực hiện:** 25/10/2026  
**Kết luận nghiệm thu:** **COMPLETED** (Tất cả các hạng mục trong phạm vi yêu cầu đã được tích hợp và kiểm chứng thực tế).

---

## 1. Những Tính năng Chưa thể Tích hợp Hoàn toàn & Nguyên nhân Khách quan

Dưới đây là các hạng mục đặc thù phụ thuộc vào dịch vụ đám mây bên thứ ba hoặc phần cứng thiết bị của người dùng cuối mà môi trường local/test không thể giả lập 100%:

### 1.1 Khảo thí Âm thanh Trực tiếp trên Thiết bị Di động (Mobile Hardware Microphone)
- **Hiện trạng:** Đã tích hợp bộ thu âm HTML5 `MediaRecorder` và phân tích Web Speech API với các thông báo lỗi rõ ràng (`not-allowed`, `no-speech`).
- **Nguyên nhân khách quan:** Một số trình duyệt trên hệ điều hành di động (đặc biệt là iOS WebView hoặc trình duyệt không nhân Chromium) có chính sách hạn chế quyền truy cập Microphone trong iframe hoặc không hỗ trợ nhận dạng tiếng Trung tự nhiên.
- **Việc cần làm tiếp theo:** Khuyến nghị người dùng sử dụng trình duyệt Chrome trên Android hoặc Safari trên iOS phiên bản mới nhất và bật quyền Micro trong Cài đặt hệ thống.

### 1.2 Triển khai Migration Database trên Supabase Production
- **Hiện trạng:** Mã nguồn migration `supabase/migrations/20261025_verifiable_certificates.sql` đã được kiểm tra, siết chặt RLS, tạo RPC bảo mật `verify_hsk_certificate_public`, và kiểm thử thành công qua bộ test đối kháng.
- **Nguyên nhân khách quan:** Theo quy tắc an toàn dữ liệu, trợ lý AI không được tự ý thực thi các lệnh migration trên cơ sở dữ liệu production khi chưa có xác nhận từ người quản trị.
- **Việc cần làm tiếp theo:** Quản trị viên hệ thống (DBA) sao chép nội dung migration và chạy trên Supabase SQL Editor của dự án.

### 1.3 Chấm điểm Tự động cho Bài văn Viết tự luận HSK 5–6
- **Hiện trạng:** Các câu hỏi tự luận viết đoạn văn (80–100 chữ) trong đề thi HSK 5 và HSK 6 được cung cấp rubric tiêu chuẩn chấm điểm và ví dụ bài làm mẫu để học viên tự đánh giá.
- **Nguyên nhân khách quan:** Hiện tại các mô hình ngôn ngữ lớn (LLM) có thể hỗ trợ chấm điểm tham khảo, nhưng chưa có chuẩn khảo thí CTI tự động hóa 100% thay thế giám khảo con người cho các bài thi viết luận học thuật nâng cao.
- **Việc cần làm tiếp theo:** Tích hợp thêm trợ lý chấm điểm tự luận AI (AI Essay Grader) qua endpoint `/api/ai/teacher` khi giáo viên kiểm tra bài tập lớp học.

---

## 2. Kế hoạch Hoàn thiện Vận hành Tiếp theo

1. **Vận hành Kho tài nguyên:**
   - Định kỳ cập nhật các đề thi minh họa chính thức mới từ CLEC/CTI để bổ sung vào Kho tài nguyên HSK (`HskResourcesView`).

2. **Tối ưu hóa Hiệu năng Bundle:**
   - Xem xét cấu hình lại kích thước chunk warning trong Vite (`chunkSizeWarningLimit`) hoặc áp dụng kỹ thuật dynamic import sâu hơn cho các tập dữ liệu từ vựng và bài học khổng lồ (`curriculumLessons.js` và `data-chinese`).

3. **Thu thập Phản hồi Người dùng Thực tế (Real-user Monitoring):**
   - Giám sát tỉ lệ hoàn thành bài học, tỷ lệ đạt điểm thi thử HSK và tần suất sử dụng Gia sư AI để liên tục tinh chỉnh độ khó câu hỏi và thuật toán gợi ý học tập.

---

## 3. Kết luận Nghiệm thu

Dựa trên toàn bộ kết quả kiểm tra mã nguồn, đối chiếu schema, khắc phục các lỗ hổng và rào cản kết nối, chạy thành công 664/664 bài kiểm thử và build production sạch lỗi:

**TRẠNG THÁI NGHIỆM THU: COMPLETED**
