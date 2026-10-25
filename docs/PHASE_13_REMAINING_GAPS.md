# BÁO CÁO CÁC HẠNG MỤC TỒN TẠI & LỘ TRÌNH TRIỂN KHAI PHASE 13 (REMAINING GAPS)

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến  
**Giai đoạn:** Phase 13 — Independent Audit & Verification of Phase 12  
**Ngày lập báo cáo:** 25/10/2026  
**Mục đích:** Liệt kê minh bạch những giới hạn kiểm thử, các hạng mục chưa thể xác minh trên môi trường thực tế nếu thiếu thông tin xác thực đám mây (cloud credentials), và các bước bàn giao vận hành cần thao tác thủ công.

---

## 1. Giới hạn Kiểm thử & Những gì Chưa thể Xác minh

Theo nguyên tắc kiểm toán độc lập và đạo đức kỹ thuật, chúng tôi **không tuyên bố** những gì chưa được chạy trên môi trường thực tế:

### 1.1 Cơ sở dữ liệu Supabase Production
- **Hiện trạng:** Toàn bộ việc kiểm toán RLS, schema và hàm Stored Procedure được thực hiện trực tiếp trên file migration mã nguồn (`supabase/migrations/20261025_verifiable_certificates.sql`) và mô phỏng logic qua bộ test tự động.
- **Giới hạn:** Trong phiên làm việc này, chúng tôi **không** kết nối trực tiếp đến cụm máy chủ Supabase Production thật (do tôn trọng quy tắc bảo vệ dữ liệu và không tự ý áp dụng migration khi chưa có lệnh từ người quản trị).
- **Việc cần thao tác thủ công:** Quản trị viên hệ thống (DBA/DevOps) cần áp dụng migration này vào Supabase Production qua giao diện Supabase SQL Editor hoặc CLI `supabase db push`.

### 1.2 Thu âm Micro Thực tế trên Thiết bị Di động (Mobile Hardware Microphone)
- **Hiện trạng:** Bộ đánh giá phát âm `pronunciationEvaluator.js` và `RoleplayStudio` đã được kiểm thử về mặt xử lý chuỗi pinyin, chuẩn hóa thanh điệu, so khớp âm vị và logic hội thoại.
- **Giới hạn:** Việc cấp quyền Micro của trình duyệt (`navigator.mediaDevices.getUserMedia`) và chất lượng thu âm môi trường ngoài phụ thuộc vào phần cứng thực tế và quyền OS của người dùng (iOS Safari, Android Chrome, Windows Microphones).

### 1.3 Giọng đọc Bản ngữ Chuẩn Phổ thông (Putonghua Accent Verification)
- **Hiện trạng:** Đã thiết lập cơ chế ưu tiên giọng đọc bản ngữ qua Azure Speech Services Proxy (`zh-CN-XiaoxiaoNeural`, `zh-CN-YunxiNeural`) và fallback Web Speech API.
- **Giới hạn:** Đối với các câu hỏi nghe hiểu HSK tự soạn, việc đánh giá độ tự nhiên, ngữ điệu và chuẩn mực sư phạm cần được một giáo viên bản ngữ tiếng Trung (native Putonghua speaker) nghe và nghiệm thu trực tiếp. Kỹ thuật viên không được tự kết luận là "chuẩn mực sư phạm hoàn hảo" nếu chỉ dựa trên test code.

---

## 2. Các Bước Cần Thao tác Thủ công Khi Triển khai (Manual Production Checklist)

Để hoàn tất việc đưa toàn bộ các cải tiến bảo mật của Phase 13 lên môi trường Production, Quản trị viên cần thực hiện các bước sau:

1. **Chạy Migration trên Supabase Production:**
   - Mở Supabase Dashboard -> Dự án HanziGo -> SQL Editor.
   - Sao chép toàn bộ nội dung của file `supabase/migrations/20261025_verifiable_certificates.sql`.
   - Bấm **Run** để:
     * Cập nhật các cột `is_revoked`, `revoked_at`, `revocation_reason`.
     * Cập nhật các chính sách RLS mới (chặn công chúng SELECT dữ liệu riêng tư).
     * Khởi tạo hàm RPC `verify_hsk_certificate_public`.

2. **Cấu hình Biến Môi trường Backend (Vercel / Cloud Functions):**
   - Đảm bảo biến môi trường `SUPABASE_SERVICE_ROLE_KEY` được cấu hình an toàn trên Backend Serverless để phục vụ API `api/_handlers/hsk/certificate.js` khi thực hiện cấp phát chứng nhận.
   - Tuyệt đối **không** đưa `SUPABASE_SERVICE_ROLE_KEY` vào client bundle (`.env.local` của Vite hay `VITE_*`).

3. **Thiết lập Quy trình Thu hồi Chứng nhận (Revocation Workflow):**
   - Khi có quyết định thu hồi chứng nhận do vi phạm quy chế thi cử, Admin thực hiện cập nhật bản ghi trong Supabase:
     ```sql
     UPDATE public.issued_certificates
     SET is_revoked = true,
         revoked_at = NOW(),
         revocation_reason = 'Phát hiện hành vi gian lận bài thi thử hoặc dữ liệu không hợp lệ.'
     WHERE certificate_code = 'HZG-HSK1-XXXX-XXXX';
     ```
   - Ngay lập tức, trang tra cứu công khai sẽ hiển thị cảnh báo đỏ thu hồi chứng nhận và vô hiệu hóa tính năng tải chứng chỉ.

4. **Rà soát Sư phạm cho Ngân hàng Đề thi HSK 4-6:**
   - Đề nghị phòng đào tạo / chuyên gia tiếng Trung rà soát toàn bộ các câu hỏi đọc hiểu và điền từ nâng cao ở các cấp độ HSK 4, 5, 6 để đảm bảo từ vựng và ngữ pháp bám sát khung HSK 3.0 mới nhất.

---

## 3. Tổng kết Trạng thái Kiến trúc Sau Phase 13

| Thành phần | Trạng thái kỹ thuật | Mức độ an toàn |
| :--- | :---: | :---: |
| **Cấp phát Chứng chỉ (Issuance)** | Server-side Enforced | **Cao (Không thể bypass ở client)** |
| **Tra cứu Công khai (Verification)** | Minimal Disclosure RPC | **Cao (Không rò rỉ PII/Email)** |
| **Thu hồi Chứng chỉ (Revocation)** | Đã tích hợp Schema & UI | **Sẵn sàng vận hành** |
| **Phân tích 4 Kỹ năng (Competency)** | Bỏ fake data; xử lý mẫu nhỏ | **Toán học chính xác, minh bạch** |
| **Gamification & Streak** | IANA Timezone, Idempotent | **Ổn định, chống cộng lặp** |
| **Con dấu & Chứng nhận (Canvas)** | Sửa lỗi chính tả `汉字通印` | **Đúng văn tự và thẩm mỹ** |
| **Pháp lý & Tuyên bố trách nhiệm** | Phân biệt rõ chứng nhận HanziGo | **Minh bạch, tránh hiểu nhầm** |
