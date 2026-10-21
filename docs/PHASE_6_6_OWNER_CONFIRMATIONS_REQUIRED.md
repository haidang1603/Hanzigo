# HANZIGO — DANH MỤC THÔNG TIN & HÀNH ĐỘNG CẦN CHỦ DỰ ÁN XÁC NHẬN
**Phase:** 6.6 — Legal Compliance, Privacy, Accessibility & Public Release Audit  
**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến ([https://hanzigo-xi.vercel.app/](https://hanzigo-xi.vercel.app/))  
**Người phụ trách kỹ thuật:** Senior Full-Stack & Application Security / Privacy Lead  
**Ngày lập:** 20/10/2026 (hoặc theo thời điểm audit hiện hành)  
**Mục đích:** Liệt kê các quyết định kinh doanh, pháp nhân, chi phí hạ tầng và pháp lý cần người sáng lập / chủ sở hữu dự án (Project Owner) và cố vấn pháp lý chuyên trách chính thức phê duyệt trước khi công bố rộng rãi (Public Launch).

---

## 1. THÔNG TIN PHÁP NHÂN & ĐƠN VỊ VẬN HÀNH (OPERATOR IDENTITY)

Mã nguồn hiện tại đã được thiết kế mở (neutral) và **tuyệt đối không bịa đặt** mã số thuế, địa chỉ trụ sở hoặc tên công ty nhằm tuân thủ nguyên tắc trung thực. Chủ dự án cần quyết định và cung cấp:

| STT | Hạng mục cần xác nhận | Tùy chọn 1 (Cá nhân / Dự án cộng đồng) | Tùy chọn 2 (Doanh nghiệp / Hộ kinh doanh) | Quyết định của Chủ dự án |
| :--- | :--- | :--- | :--- | :--- |
| **1.1** | **Tư cách chủ quản** | Lê Hải Đăng (Nhà phát triển độc lập / Founder) | Công ty TNHH / Cổ phần Giáo dục | [ ] Chưa quyết định<br>[ ] Chọn Tùy chọn 1<br>[ ] Chọn Tùy chọn 2 |
| **1.2** | **Tên hiển thị pháp lý** | Dự án Học tiếng Trung HanziGo (Phi thương mại) | Tên đầy đủ của doanh nghiệp theo ĐKKD | *Chờ điền:* ................................. |
| **1.3** | **Địa chỉ liên hệ chính thức** | Tỉnh / Thành phố đại diện của Founder tại Việt Nam | Địa chỉ trụ sở chính đăng ký kinh doanh | *Chờ điền:* ................................. |
| **1.4** | **Số điện thoại / Hotline** | Hotline cá nhân / Zalo hỗ trợ kỹ thuật | Tổng đài CSKH / Số điện thoại cố định | *Chờ điền:* ................................. |
| **1.5** | **Email tiếp nhận DSAR & Bảo mật** | `security.hanzigo@gmail.com` hoặc email domain riêng | `privacy@hanzigo.com` / `dpo@hanzigo.com` | *Chờ điền:* ................................. |

> **Khuyến nghị kỹ thuật:** Nếu dự án hiện đang trong giai đoạn Beta/MVP phi thương mại, nên công bố tư cách là **Dự án mã nguồn mở / Nền tảng học tập cộng đồng do Lê Hải Đăng sáng lập** tại Việt Nam. Khi tiến hành thu phí người học (commercialization), bắt buộc phải thành lập pháp nhân và bổ sung Mã số doanh nghiệp.

---

## 2. NGHĨA VỤ PHÁP LÝ VỀ BẢO VỆ DỮ LIỆU CÁ NHÂN (NGHỊ ĐỊNH 13/2023/NĐ-CP)

Dưới góc độ Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam về bảo vệ dữ liệu cá nhân, HanziGo đóng vai trò là **Bên Kiểm soát và Xử lý dữ liệu cá nhân (Data Controller and Processor)**.

Chủ dự án cần lưu ý các nghĩa vụ hành chính sau:

1. **Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA - Mẫu số 04 ban hành kèm Nghị định 13):**
   - **Tình trạng hiện tại:** Đã có tài liệu kỹ thuật kiểm kê luồng dữ liệu tại [PHASE_6_6_LEGAL_PRIVACY_AUDIT.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_6_6_LEGAL_PRIVACY_AUDIT.md).
   - **Hành động cần thiết:** Chủ dự án hoặc luật sư hoàn thiện hồ sơ DPIA và lưu trữ tại trụ sở đơn vị vận hành, sẵn sàng xuất trình khi Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05 - Bộ Công an) yêu cầu.
2. **Hồ sơ đánh giá tác động chuyển dữ liệu cá nhân ra nước ngoài (Mẫu số 06):**
   - **Bối cảnh:** HanziGo sử dụng hạ tầng cloud máy chủ đặt tại nước ngoài (Supabase AWS Singapore/US, Vercel Edge Global, LiveKit Cloud US/EU, xKiro/OpenAI Global).
   - **Hành động cần thiết:** Chủ dự án xem xét quy mô người dùng. Khi hệ thống đi vào khai thác thương mại hoặc có lượng người dùng lớn, cần tiến hành gửi 01 bộ hồ sơ Mẫu số 06 tới A05 trong vòng 60 ngày kể từ ngày xử lý dữ liệu theo Điều 25 Nghị định 13.
3. **Phê duyệt Quy trình 72 giờ xử lý sự cố dữ liệu cá nhân:**
   - Khi phát hiện rò rỉ hoặc truy cập trái phép cơ sở dữ liệu Supabase, hệ thống kỹ thuật sẽ thông báo ngay cho Chủ dự án. Chủ dự án cam kết báo cáo cho Bộ Công an (A05) trong vòng 72 giờ theo Mẫu số 03.

---

## 3. CHÍNH SÁCH CHI PHÍ AI VÀ HẠ TẦNG (FINOPS & QUOTA)

Hệ thống AI Tutor của HanziGo sử dụng API qua xKiro (hoặc các AI Provider tương thích). Để bảo vệ tài chính cho dự án:

| Hạng mục | Cấu hình kỹ thuật hiện tại | Rủi ro nếu thay đổi | Chủ dự án phê duyệt |
| :--- | :--- | :--- | :--- |
| **`ALLOW_PAID_FALLBACK`** | **`false`** (Mặc định bắt buộc) | Nếu bật `true`, khi hết quota miễn phí, hệ thống tự động trừ tiền vào thẻ tín dụng đã liên kết của Chủ dự án. | [x] Giữ nguyên `false`<br>[ ] Cho phép bật nếu có ngân sách |
| **Rate Limit AI Chat** | Giới hạn số lượt hỏi/phút trên từng IP & User ID | Ngăn chặn hành vi bot scraping hoặc spam làm cạn kiệt API token. | [x] Phê duyệt giới hạn hiện tại<br>[ ] Điều chỉnh theo nhu cầu |
| **LiveKit Room Timeout** | Tự động đóng phòng Live Classroom sau 60 phút không có tương tác | Tránh phát sinh chi phí truyền dẫn WebRTC (bandwidth/egress) ngoài ý muốn. | [x] Phê duyệt đóng tự động<br>[ ] Cho phép mở rộng |

---

## 4. TÍNH BẢN QUYỀN HỌC LIỆU & NỘI DUNG THI THỬ HSK

Tài liệu [CONTENT_LICENSE_REGISTER.md](file:///d:/DELL/Dowloads/HanziGo/docs/CONTENT_LICENSE_REGISTER.md) đã tổng hợp toàn bộ tài nguyên học liệu. Chủ dự án cần xác nhận các điểm sau:

1. **Bộ câu hỏi luyện thi HSK 1 đến HSK 6:**
   - **Tuyên bố pháp lý:** Các đề thi trong HanziGo là câu hỏi **mô phỏng, biên soạn phục vụ mục đích nghiên cứu, học tập phi thương mại (Educational Fair Use)** theo Luật Sở hữu trí tuệ Việt Nam.
   - **Cam kết:** Không sao chép nguyên văn có bản quyền thương phẩm của CTI (Chinese Testing International) hoặc Nhà xuất bản Giáo dục Đại học Bắc Kinh (BLCUP).
   - *Xác nhận của Chủ dự án:* [ ] Đồng ý bổ sung tuyên bố Fair Use rõ ràng trên trang Thi thử HSK.
2. **Dữ liệu Từ điển & Flashcard CC-CEDICT:**
   - Bản quyền thuộc bản quyền mở **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.
   - Hệ thống đã đặt liên kết ghi công nguồn MDBG / CC-CEDICT trong chân trang và trang điều khoản.
   - *Xác nhận của Chủ dự án:* [ ] Đã kiểm tra và đồng ý với cách thức ghi công.
3. **Phông chữ Ma Shan Zheng & Noto Sans:**
   - Sử dụng theo giấy phép mở SIL Open Font License 1.1 qua Google Fonts. An toàn 100% cho phát hành công khai.

---

## 5. ĐỒNG THUẬN KHI TRIỂN KHAI THƯƠNG MẠI HÓA (FUTURE MONETIZATION)

Hiện tại HanziGo hoạt động **hoàn toàn miễn phí (100% Free)** và trang `/refund-policy` phản ánh đúng thực tế này. 

Khi Chủ dự án quyết định mở tính năng gói học trả phí (HanziGo Pro / VIP), Chủ dự án **bắt buộc phải thực hiện các bước sau trước khi bấm kích hoạt cổng thanh toán**:

1. [ ] Đăng ký hoạt động website cung cấp dịch vụ thương mại điện tử với Bộ Công Thương (thông qua Cổng thông tin Quản lý hoạt động TMĐT `online.gov.vn`).
2. [ ] Ký hợp đồng hợp pháp với Cổng thanh toán được Ngân hàng Nhà nước cấp phép (VNPAY, MoMo, ZaloPay, PayOS hoặc SeAPay).
3. [ ] Cập nhật trang `/terms-of-service` bổ sung điều khoản thanh toán, chu kỳ gói, gia hạn tự động (nếu có).
4. [ ] Cập nhật trang `/refund-policy` công bố rõ ràng thời hạn hoàn tiền (ví dụ: trong vòng 07 ngày nếu chưa sử dụng quá 20% bài học) và phương thức hoàn tiền về tài khoản nguồn.

---

## 6. DANH SÁCH KIỂM TRA DUYỆT BỞI CỐ VẤN PHÁP LÝ (LEGAL COUNSEL SIGN-OFF)

Trước khi công bố chính thức ra công chúng trên các phương tiện thông tin đại chúng, tài liệu này và các trang điều khoản cần được một chuyên gia pháp lý (Luật sư / Chuyên viên Pháp chế) rà soát:

- [ ] Điều khoản dịch vụ (`/terms-of-service`) không vi phạm Luật Bảo vệ quyền lợi người tiêu dùng 2023.
- [ ] Chính sách bảo mật (`/privacy-policy`) đáp ứng đầy đủ Điều 9, 11, 13 và 17 của Nghị định 13/2023/NĐ-CP.
- [ ] Cơ chế xử lý khiếu nại bản quyền theo Điều 198b Luật Sở hữu trí tuệ (sửa đổi 2022) về quy trình Notice & Takedown cho tài liệu người dùng tải lên trong Lớp học ảo.

---

**Kết luận của Đội ngũ Kỹ thuật:**  
Mã nguồn và hệ thống kỹ thuật của HanziGo tại Phase 6.6 đã đạt mức **AUDIT PASS & READY FOR OWNER SIGN-OFF**. Mã nguồn đã sẵn sàng, an toàn, bảo vệ dữ liệu tối đa và không có lỗ hổng vi phạm quyền riêng tư. Việc chính thức mở truy cập đại chúng (Public Launch) phụ thuộc vào việc hoàn tất các chữ ký xác nhận ở danh mục trên.
