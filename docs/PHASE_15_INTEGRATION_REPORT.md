# BÁO CÁO KẾT QUẢ TÍCH HỢP TÍNH NĂNG (PHASE 15 INTEGRATION REPORT)

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến cho người Việt  
**Giai đoạn:** Phase 15 — Backend–Frontend Integration & Feature Completion  
**Ngày thực hiện:** 25/10/2026  
**Trạng thái tích hợp:** **COMPLETED**

---

## 1. Các Tính năng Đã Kết nối và Hoàn thiện

### 1.1 Luồng Lộ trình & 120 Bài học Sư phạm HSK 1–6
- **Kết nối dữ liệu thực:** Toàn bộ 120 bài học từ `l-101` đến `l-620` thuộc 24 chương đã được nạp đầy đủ vào `RoadmapPage.jsx` và `InteractiveLessonPlayer.jsx`.
- **9 bước học tương tác chuẩn mực:**
  1. Giới thiệu bài học & ngữ cảnh giao tiếp.
  2. Bảng từ vựng tương tác kèm phát âm bản ngữ.
  3. Chiết tự chữ Hán, bộ thủ và thứ tự nét bút.
  4. Cấu trúc ngữ pháp trọng tâm và ví dụ song ngữ.
  5. Luyện nghe phản xạ (Audio Lab) với 3 tốc độ.
  6. Luyện phát âm khẩu ngữ qua bộ đánh giá âm vị.
  7. Luyện viết chữ Hán trên InteractiveWritingPad.
  8. Trắc nghiệm củng cố (Quiz).
  9. Thử thách phản xạ (Challenge).
- **Đồng bộ tiến độ:** Khi hoàn thành bài học, hàm `completeLesson` tự động lưu vào LocalStorage và đồng bộ lên bảng `user_journey_progress` trên Supabase (nếu có tài khoản đăng nhập).

### 1.2 Luồng Từ vựng, Flashcard 3D & SM-2 SRS
- **Kết nối dữ liệu:** Hơn 450 từ vựng cốt lõi HSK 1–3 và hệ thống từ vựng mở rộng được tích hợp trong `VocabularyPage.jsx`.
- **4 mức đánh giá Spaced Repetition:**
  * `1. Quên (Again)` — Đặt lại chu kỳ về 1 ngày, tăng chỉ số hay quên (`lapseCount`).
  * `2. Khó (Hard)` — Giữ nguyên chu kỳ hiện tại, giảm Ease Factor.
  * `3. Tốt (Good)` — Nhân chu kỳ với Ease Factor (mặc định 2.50).
  * `4. Dễ (Easy)` — Tăng Ease Factor và mở rộng chu kỳ nhanh chóng.
- **Cải tiến UX:**
  * Khóa chống double-click (`isRatingRef`, 350ms) ngăn gửi trùng yêu cầu hoặc cộng lặp XP.
  * Trạng thái hoàn thành ôn tập (`statusFilter === 'due'` khi danh sách rỗng): Hiển thị thông điệp chúc mừng và nút chuyển nhanh sang chế độ ôn tập tự do.

### 1.3 Luồng Trung tâm Khảo thí HSK (CBT Mock Exams)
- **21 bộ đề thi chuẩn hóa:** Bao gồm đề thi thử toàn diện (Nghe, Đọc, Viết) từ HSK 1 đến HSK 6.
- **Bảo mật đề thi:** Tước bỏ đáp án đúng và lời giải thích trước khi tải về client (`getSanitizedExamForTaking`).
- **Chấm điểm độc lập:** Gửi bài thi qua endpoint serverless `/api/hsk/submit` để chấm điểm khách quan.
- **Xử lý đề tham chiếu:** Đối với đề tham chiếu CLEC/CTI (`hsk1-official-ref-01`, 0 câu hỏi số hóa), giao diện tự động hiển thị nút dẫn trực tiếp tới tài liệu chính thống của CTI thay vì báo lỗi không tìm thấy câu hỏi.

### 1.4 Luồng Kho Tài nguyên HSK (HSK Resource Hub)
- **Kết nối API Serverless:** Hàm `getPublicHskResources` trong `src/services/hskReviewService.js` đã được kết nối với endpoint `/api/hsk/resources` kèm theo tham số lọc (cấp độ, danh mục, kỹ năng, định dạng, từ khóa).
- **Cơ chế Fallback:** Tự động chuyển sang dữ liệu nội bộ và Supabase nếu mất kết nối mạng.

### 1.5 Luồng Chứng nhận Khóa học & Tra cứu Công khai
- **Cấp phát an toàn:** Toàn bộ quá trình cấp chứng nhận được kiểm tra qua endpoint `/api/hsk/issue-certificate`, bắt buộc thỏa mãn 20/20 bài học và điểm thi thử `>= 80%`.
- **Hỗ trợ toàn diện HSK 1–6:** Mở rộng giao diện `ProfilePage.jsx` để học viên có thể xem và nhận chứng nhận cho cả 6 cấp độ.
- **Đồng bộ đa thiết bị:** Tích hợp hàm `getUserIssuedCertificates(user)` tải danh sách chứng nhận đã cấp từ bảng `issued_certificates` trên Supabase khi đăng nhập trên thiết bị mới.
- **Tra cứu công khai:** `CertificateVerificationModal.jsx` kết nối với RPC `verify_hsk_certificate_public`, hiển thị thông tin tối thiểu không chứa dữ liệu cá nhân nhạy cảm, đồng thời cảnh báo rõ ràng nếu chứng nhận đã bị thu hồi.

### 1.6 Luồng Gia sư AI Lão Sư (AI Tutor)
- **Kết nối Gateway:** `AiTutorChatView.jsx` gọi qua `aiGateway.js` tới endpoint serverless `/api/ai/tutor`.
- **RAG Retrieval:** Truy xuất tài liệu giáo trình đã kiểm duyệt, trích dẫn nguồn minh bạch và cảnh báo nếu thiếu bằng chứng ngữ pháp.

---

## 2. Các File Được Tạo và Chỉnh Sửa

| Đường dẫn File | Loại thay đổi | Mô tả nội dung thay đổi |
| :--- | :---: | :--- |
| `src/utils/certificateEngine.js` | Chỉnh sửa | Bổ sung hàm `getUserIssuedCertificates(user)` truy vấn Supabase RLS an toàn và hợp nhất với LocalStorage. |
| `src/pages/ProfilePage.jsx` | Chỉnh sửa | Tích hợp `getUserIssuedCertificates(user)` vào `useEffect`; mở rộng lưới chứng nhận từ HSK 1–3 lên HSK 1–6. |
| `src/pages/VocabularyPage.jsx` | Chỉnh sửa | Bổ sung cờ `isRatingRef` chống double-click khi đánh giá thẻ SRS; hoàn thiện giao diện Empty State cho bộ lọc thẻ đến hạn (`due`). |
| `src/pages/HskPracticePage.jsx` | Chỉnh sửa | Phân nhánh hiển thị nút "Đề tham chiếu" dẫn tới nguồn CTI cho các đề có 0 câu hỏi trắc nghiệm, ngăn lỗi khi làm bài. |
| `src/services/hskReviewService.js` | Chỉnh sửa | Kết nối trực tiếp endpoint serverless `/api/hsk/resources` kèm bộ lọc query string. |
| `docs/PHASE_15_BACKEND_FRONTEND_AUDIT.md` | Tạo mới | Báo cáo đối chiếu chi tiết toàn bộ chức năng backend–frontend. |
| `docs/PHASE_15_INTEGRATION_REPORT.md` | Tạo mới | Báo cáo chi tiết các tính năng đã kết nối, luồng thao tác và file thay đổi. |
| `docs/PHASE_15_TEST_RESULTS.md` | Tạo mới | Báo cáo kết quả kiểm thử toàn diện sau tích hợp (Unit, E2E, Lint, Build). |
| `docs/PHASE_15_REMAINING_GAPS.md` | Tạo mới | Liệt kê các hạng mục còn phụ thuộc tài nguyên ngoại bộ và lộ trình tiếp theo. |

---

## 3. Các Chức Năng Còn Thiếu Backend (Nếu có)

- **Số hóa toàn bộ đề thi mẫu CTI HSK 1 (H10901):** Hiện tại đề `hsk1-official-ref-01` hoạt động dưới dạng tài liệu tham chiếu ngoại bộ (External Reference Document) dẫn link tới CTI thay vì ngân hàng câu hỏi tương tác.
- **Chấm điểm tự luận viết đoạn văn HSK 5–6 hoàn toàn tự động:** Các câu hỏi tự luận viết đoạn văn 80–100 từ trong đề thi HSK 5 và HSK 6 hiện đang áp dụng cơ chế tự chấm có hướng dẫn (Self-Assessment with Rubric Guidelines) kết hợp gợi ý từ AI, chưa có bộ chấm tự động thay thế hoàn toàn giám khảo khảo thí.
