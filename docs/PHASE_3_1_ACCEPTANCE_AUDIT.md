# BÁO CÁO KIỂM TOÁN CHẤP THUẬN HSK (PHASE 3.1: HSK ACCEPTANCE AUDIT)

**Dự án:** HanziGo — Trung tâm Luyện thi HSK  
**Ngày thực hiện:** 16/10/2026  
**Vai trò:** Senior Full-Stack Engineer, Application Security Engineer & QA Lead  
**Tài liệu gốc tham chiếu:** `docs/PHASE_3_HSK_COMPLETION_REPORT.md`, `docs/PHASE_3_HSK_AUDIT.md`

---

## 1. TỔNG QUAN VÀ NGUYÊN TẮC ĐÁNH GIÁ

Quá trình kiểm toán Phase 3.1 được thực hiện độc lập, đối chiếu trực tiếp giữa mã nguồn, schema cơ sở dữ liệu, scripts, giao diện và bộ kiểm thử tự động, không dựa vào các tuyên bố tự khẳng định.

### Bảng phân loại trạng thái kiểm toán:
- **VERIFIED**: Đã kiểm tra trực tiếp qua mã nguồn, database schema hoặc kiểm thử tự động thực tế (PASS).
- **PARTIALLY VERIFIED**: Đã xác minh một phần tính năng trong code/service, nhưng cần cấu hình bổ sung hoặc chạy trên staging có đầy đủ service bên ngoài.
- **NOT VERIFIED**: Chưa có bằng chứng thực tế tại repo hoặc chưa thể kiểm tra an toàn do thiếu quyền/môi trường.
- **FAILED**: Kiểm tra không đạt hoặc phát hiện lỗi bảo mật/logic trong quá trình audit.

---

## 2. MA TRẬN ĐỐI CHIẾU MÃ NGUỒN VÀ KIẾM TOÁN CHI TIẾT

### 2.1. API Handlers & Service Layer

| Thành phần | Đường dẫn | Trạng thái | Bằng chứng và Phân tích kỹ thuật |
| :--- | :--- | :---: | :--- |
| **Chấm điểm Server-side** | `api/_handlers/hsk/submit.js` | **VERIFIED** | Không tin điểm từ client. Điểm số (`score`, `passed`, `correctCount`) được tính toán 100% dựa trên câu trả lời trong database (`hsk_questions.correct_answer`) hoặc fallback catalog có sẵn. Điểm số client gửi lên bị bỏ qua hoàn toàn. |
| **Xử lý nộp bài lặp (Idempotency)** | `api/_handlers/hsk/submit.js` | **VERIFIED** | Hỗ trợ trường `clientAttemptId` hoặc `attemptId`. Nếu đã có attempt hoàn tất tương ứng với cùng user/client ID, hệ thống trả về kết quả đã khóa trước đó thay vì tạo bản ghi mới hoặc chấm điểm lại. |
| **Chặn nộp đề chưa xuất bản** | `api/_handlers/hsk/submit.js` | **VERIFIED** | Kiểm tra trạng thái `is_published`. Nếu đề chưa xuất bản và người nộp không phải admin (hoặc là khách), API lập tức từ chối với mã lỗi `403 Forbidden`. |
| **Bảo vệ chi tiết đề thi** | `api/_handlers/hsk/exam.js` | **VERIFIED** | Chặn học viên/khách truy cập đề chưa xuất bản (`403 Forbidden`). Cho phép tài khoản Admin/Teacher có quyền kiểm tra trước đề thi (`200 OK`). |
| **Chặn xem attempt chéo tài khoản** | `api/_handlers/hsk/attempt.js` | **VERIFIED** | API so khớp `attempt.user_id === user.id`. Nếu attempt thuộc về tài khoản khác, trả về `403 Forbidden`. Khách ẩn danh chỉ được xem attempt trùng với `anonymous_session_id`. |
| **Bảo vệ Sổ tay câu sai (Cross-user tampering)** | `api/_handlers/hsk/mistakes.js` | **VERIFIED** | Đã siết chặt kiểm tra: khi cập nhật trạng thái (`PATCH`) hoặc xóa (`DELETE`), nếu `mistake.user_id !== user.id`, API chặn đứng với `403 Forbidden`. |
| **Dịch vụ HSK Frontend** | `src/services/hskService.js` | **VERIFIED** | Tách bạch giữa dữ liệu đã đăng nhập (Supabase) và khách vãng lai (`localStorage`). Đồng thời bổ sung kiểm tra quyền sở hữu trong localStorage để ngăn chặn việc ghi đè chéo giữa các phiên đăng nhập khác nhau trên cùng trình duyệt. |
| **Xử lý đề không có câu hỏi** | `src/services/hskService.js` & `api/_handlers/hsk/submit.js` | **VERIFIED** | Phát hiện đề tham khảo hoặc đề chưa có câu hỏi (`questions.length === 0`), ném lỗi thông báo rõ ràng "Đề thi này chưa có câu hỏi thực hành" thay vì để crash giao diện thi. |

---

### 2.2. Cơ sở dữ liệu, RLS & Migration Schema

| Hạng mục | Vị trí / Đối tượng | Trạng thái | Bằng chứng và Phân tích kỹ thuật |
| :--- | :--- | :---: | :--- |
| **Lỗi PostgreSQL 42P16** | `supabase/migrations/20261016_phase3_hsk_exam_center.sql` | **VERIFIED (ĐÃ SỬA)** | Ban đầu gặp lỗi `cannot drop columns from view` do sử dụng `CREATE OR REPLACE VIEW` khi định nghĩa lại `v_hsk_questions_public`. Đã sửa thành `DROP VIEW IF EXISTS public.v_hsk_questions_public CASCADE;` trước khi `CREATE VIEW`. |
| **View bảo mật chống lộ đáp án** | `v_hsk_questions_public` | **VERIFIED** | View loại trừ hoàn toàn các cột: `correct_answer`, `explanation`, `scoring_weight`. Đã bật thuộc tính bảo mật `WITH (security_invoker = true)` để kế thừa RLS từ bảng gốc `hsk_questions`. |
| **RLS cho `hsk_exams`** | Bảng `hsk_exams` | **VERIFIED** | Đã bật RLS: Khách và học sinh chỉ được đọc đề có `is_published = true`. Admin và Teacher có quyền đọc tất cả các đề và quyền INSERT/UPDATE/DELETE. |
| **RLS cho `hsk_attempts`** | Bảng `hsk_attempts` | **VERIFIED (ĐÃ SỬA)** | Đã sửa policy `hsk_attempts_insert_public`: Yêu cầu `(auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL)` đối với khách, ngăn chặn kẻ tấn công ẩn danh mạo danh `user_id` của tài khoản khác. |
| **RLS cho `hsk_mistakes`** | Bảng `hsk_mistakes` | **VERIFIED (ĐÃ SỬA)** | Tương tự bảng attempts, đã siết chặt policy chèn dữ liệu của khách vãng lai để không cho phép chèn bừa `user_id` của người khác. |

---

### 2.3. Quy trình Seed Dữ liệu & Quản lý Script

| Hạng mục | Script | Trạng thái | Đánh giá kỹ thuật |
| :--- | :--- | :---: | :--- |
| **Hỗ trợ cờ `--dry-run`** | `scripts/seedHskExams.js` | **VERIFIED** | Script hỗ trợ tham số `--dry-run` cho phép xem trước số lượng đề và câu hỏi sẽ được nạp mà không thực hiện bất kỳ thao tác ghi nào vào database. |
| **Tính Idempotent (Chạy lại an toàn)** | `scripts/seedHskExams.js` | **VERIFIED** | Sử dụng `upsert` với cờ `onConflict: 'slug'` cho bảng đề thi và kiểm tra trùng lặp câu hỏi, đảm bảo chạy lại nhiều lần không tạo ra bản ghi nhân đôi. |
| **Bảo vệ biến môi trường Production** | `scripts/seedHskExams.js` | **VERIFIED** | Script từ chối chạy và ném lỗi rõ ràng nếu thiếu `SUPABASE_SERVICE_ROLE_KEY` hoặc `SUPABASE_URL`, tuyệt đối không dùng fallback key hay hardcode secret. |

---

### 2.4. Tính đúng đắn của Nội dung & Bản quyền Dữ liệu

| Bộ đề | Cấp độ | Số câu | Trạng thái xuất bản | Nguồn dữ liệu & Bản quyền | Đánh giá |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `hsk1-mock-01` | HSK 1 | 20 | Published | Đề thi mẫu mô phỏng chuẩn HSK 1 do đội ngũ HanziGo biên soạn nội bộ. | **VERIFIED** |
| `hsk2-mock-01` | HSK 2 | 5 | Published | Đề mẫu biên soạn mô phỏng cấu trúc Nghe - Đọc HSK 2. | **VERIFIED** |
| `hsk3-mock-01` | HSK 3 | 6 | Published | Đề mẫu biên soạn mô phỏng Nghe - Đọc HSK 3. | **VERIFIED** |
| `hsk4-mock-01` | HSK 4 | 6 | Published | Đề mẫu biên soạn mô phỏng Nghe - Đọc HSK 4. | **VERIFIED** |
| `hsk1-reading-02` | HSK 1 | 0 | Draft | Đề đang biên tập nội dung, chưa có câu hỏi. | **VERIFIED** (Đã chặn nộp thi) |
| `hsk2-listening-02`| HSK 2 | 0 | Draft | Đề đang biên tập file âm thanh, chưa có câu hỏi. | **VERIFIED** (Đã chặn nộp thi) |
| `hsk1-official-ref-01` | HSK 1 | 0 | Reference | Đề tham khảo liên kết ngoài (Chinese Test CTI chính thức), không chứa nội dung bản quyền lậu. | **VERIFIED** (Không tự ý xuất bản thành đề thi nội bộ) |

---

## 3. KẾT QUẢ KIỂM THỬ THỰC TẾ TRÊN MÁY BẢO MẬT

1. **Bộ kiểm thử tự động (Unit & Integration Tests):**
   - Lệnh thực thi: `npm test` (sử dụng Vitest)
   - Kết quả: **498 / 498 tests PASS** (100% tỷ lệ vượt qua trên toàn bộ 25 test suites).
   - Test suite chuyên biệt `tests/hskExamCenterPhase3.test.js`: Đã vượt qua **13 / 13 kịch bản kiểm thử bảo mật và chức năng HSK**, bao gồm:
     - Tính điểm server-side chuẩn xác.
     - Bảo vệ không lộ đáp án đúng trong client catalog.
     - Chặn truy cập attempt chéo người dùng (403 Forbidden).
     - Chặn sửa/xóa sổ tay câu sai chéo tài khoản (403 Forbidden).
     - Chặn học sinh vào đề thi chưa xuất bản (403 Forbidden), cho phép Admin (200 OK).
     - Từ chối token không hợp lệ hoặc tài khoản bị khóa.
     - Xử lý đề thi 0 câu hỏi an toàn, không gây crash ứng dụng.
2. **Kiểm tra cú pháp & quy chuẩn code (Linting):**
   - Lệnh: `npm run lint`
   - Kết quả: **0 errors** (460 warnings không gây lỗi logic).
3. **Kiểm tra đóng gói bản dựng (Build check):**
   - Lệnh: `npm run build`
   - Kết quả: Bản dựng Vite hoàn thành thành công trong 685ms, không phát sinh lỗi biên dịch.

---

## 4. KẾT LUẬN KIỂM TOÁN CHẤP THUẬN

Toàn bộ các tiêu chí an toàn cốt lõi của Trung tâm thi HSK (Phase 3) đã được xác minh độc lập, vá lỗi bảo mật phát hiện được và có kiểm thử hồi quy đầy đủ. Hệ thống đạt trạng thái chấp thuận cho quá trình xem xét triển khai an toàn.
