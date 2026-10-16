# BÁO CÁO NGHIỆM THU, XÁC MINH BẢO MẬT VÀ SẴN SÀNG TRIỂN KHAI HSK (PHASE 3.1)

**Dự án:** HanziGo — Hệ thống Luyện thi Tiếng Trung Trực tuyến  
**Phiên bản kiểm toán:** Phase 3.1 (Post-Phase 3 Audit & Security Verification)  
**Ngày báo cáo:** 16/10/2026  
**Chuyên gia thực hiện:** Senior Full-Stack Engineer, Application Security Engineer & QA Lead  
**Kho mã nguồn:** [https://github.com/haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
**Môi trường Production:** [https://hanzigo-xi.vercel.app](https://hanzigo-xi.vercel.app/)

---

## 1. CÁC KẾT LUẬN ĐÃ XÁC MINH (VERIFIED FINDINGS)

1. **Chấm điểm độc lập phía Server (Zero-Trust Grading):**
   - Đã xác minh trực tiếp mã nguồn `api/_handlers/hsk/submit.js` và hàm `gradeExamServerSide`.
   - Đáp án đúng (`correct_answer`) không bao giờ được gửi về máy học viên trước khi nộp bài.
   - Điểm số client gửi lên (`score`, `passed`, `correctCount`) bị bỏ qua hoàn toàn. Kết quả điểm thi được tính toán 100% dựa vào dữ liệu chuẩn trên server.
2. **Không lộ đáp án qua Security View & API:**
   - View `public.v_hsk_questions_public` chỉ cung cấp `id`, `exam_id`, `section_id`, `question_index`, `type`, `prompt`, `audio_url`, `image_url`, `options`, `words`.
   - Cột `correct_answer`, `explanation` và `scoring_weight` bị loại trừ hoàn toàn khỏi view công khai.
3. **Phân quyền truy cập đề thi (Published vs Unpublished):**
   - Học sinh và khách vãng lai bị chặn truy cập (`403 Forbidden`) đối với các đề thi chưa xuất bản (`is_published: false` hoặc đề nháp).
   - Giáo viên và Quản trị viên (Admin/Teacher) vẫn truy cập được (`200 OK`) để kiểm tra nội dung và duyệt đề trước khi công bố.
4. **Bảo vệ quyền sở hữu dữ liệu cá nhân (Cross-tenant & IDOR Protection):**
   - API `api/_handlers/hsk/attempt.js` chặn người dùng xem bài làm của người khác (`403 Forbidden`).
   - API `api/_handlers/hsk/mistakes.js` và hàm service `updateMistakeStatus` / `removeMistakeItem` chặn đứng hành vi sửa, xóa mục câu sai của tài khoản khác (`403 Forbidden`).
5. **Chống nộp trùng lặp (Idempotency):**
   - Hệ thống hỗ trợ khóa nộp bài dựa trên `clientAttemptId`. Nếu cùng một yêu cầu nộp bài được gửi liên tiếp (do lỗi mạng hoặc bấm đúp), hệ thống trả về kết quả đã khóa trước đó thay vì tạo lượt nộp mới làm sai lệch lịch sử thi.
6. **Xử lý an toàn cho đề tham khảo / 0 câu hỏi:**
   - Hệ thống từ chối mở chế độ làm bài cho các đề chỉ mang tính tham khảo (0 câu hỏi), hiển thị thông báo rõ ràng cho người dùng, ngăn ngừa lỗi sập giao diện (runtime crash).

---

## 2. CÁC LỖI TÌM THẤY VÀ CÁCH ĐÃ KHẮC PHỤC

| Mã vấn đề | Phân loại | Mô tả lỗi phát hiện | Giải pháp đã áp dụng |
| :--- | :--- | :--- | :--- |
| **SEC-3.1-01** | High Risk (Bảo mật) | Kẻ tấn công ẩn danh có thể giả mạo `user_id` của tài khoản khác khi ghi vào `hsk_attempts` hoặc `hsk_mistakes` thông qua RLS insert lỏng lẻo. | Đã cập nhật RLS Policy trong `20261016_phase3_hsk_exam_center.sql`: Yêu cầu rõ ràng `(auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL)` đối với phiên khách. |
| **SEC-3.1-02** | Medium Risk (Bảo mật) | Endpoint `api/_handlers/hsk/mistakes.js` và service frontend cho phép gửi lệnh cập nhật/xóa bản ghi câu sai mà không kiểm tra triệt để quyền sở hữu của user đang đăng nhập. | Đã bổ sung kiểm tra bắt buộc `mistake.user_id === user.id` trước khi thực hiện UPDATE / DELETE, trả về `403 Forbidden` nếu không khớp. |
| **SEC-3.1-03** | Medium Risk (Logic) | Học sinh có thể truy cập và nộp bài thi cho các bộ đề đang ở chế độ bản nháp (`is_published: false`) nếu biết được slug/id. | Đã thêm kiểm tra phân quyền trong `api/_handlers/hsk/exam.js` và `api/_handlers/hsk/submit.js`: Chặn học sinh/khách với mã lỗi `403 Forbidden`; chỉ cho phép Admin/Teacher. |
| **DB-3.1-01** | Blocker (Database) | Khi chạy lại migration `20261016_phase3_hsk_exam_center.sql`, PostgreSQL báo lỗi `ERROR: 42P16: cannot drop columns from view v_hsk_questions_public` do lệnh `CREATE OR REPLACE VIEW` không cho phép bớt cột so với view cũ. | Đã thay thế bằng `DROP VIEW IF EXISTS public.v_hsk_questions_public CASCADE;` trước khi thực hiện `CREATE VIEW public.v_hsk_questions_public WITH (security_invoker = true)`. |
| **UX-3.1-01** | Low Risk (Giao diện) | Mở đề thi có 0 câu hỏi (như đề tham khảo `hsk1-official-ref-01`) khiến component làm bài bị crash do truy cập `questions[0]`. | Bổ sung kiểm tra guard clause trong `src/services/hskService.js` và `api/_handlers/hsk/submit.js`, thông báo lỗi rõ ràng và từ chối vào phòng thi. |

---

## 3. DANH SÁCH CÁC FILE ĐÃ THAY ĐỔI

1. `supabase/migrations/20261016_phase3_hsk_exam_center.sql`
   - Sửa lỗi view 42P16 bằng `DROP VIEW IF EXISTS ... CASCADE`.
   - Bổ sung cột `words` vào view công khai.
   - Siết chặt RLS insert policies trên `hsk_attempts` và `hsk_mistakes`.
2. `api/_handlers/hsk/exam.js`
   - Thêm logic kiểm tra quyền truy cập đề thi chưa xuất bản (403 cho học sinh/khách, 200 cho admin).
3. `api/_handlers/hsk/submit.js`
   - Chặn nộp bài đề chưa xuất bản (403) và đề 0 câu hỏi (400).
   - Kiểm tra trùng lặp nộp bài (idempotency via `clientAttemptId`).
4. `api/_handlers/hsk/mistakes.js`
   - Kiểm tra quyền sở hữu bản ghi khi PATCH / DELETE (403 nếu sai tài khoản).
5. `src/services/hskService.js`
   - Thêm kiểm tra quyền sở hữu trong cả Supabase và localStorage store.
   - Thêm guard clause cho đề 0 câu hỏi trong `getExamForTaking`.
6. `tests/hskExamCenterPhase3.test.js`
   - Bổ sung 4 bài test bảo mật mở rộng (Tests 10 - 13), nâng tổng số test lên 13 tests.
7. `docs/PHASE_3_1_ACCEPTANCE_AUDIT.md`
   - Tài liệu ma trận kiểm toán chi tiết của Phase 3.1.
8. `docs/PHASE_3_1_ACCEPTANCE_REPORT.md`
   - Báo cáo tổng kết nghiệm thu và khuyến nghị triển khai.

---

## 4. KẾT QUẢ KIỂM THỬ THỰC TẾ

| Công cụ kiểm tra | Lệnh chạy | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Vitest Test Suite** | `npm test` | **498 / 498 tests PASS** (25 files kiểm thử) | **HOÀN TOÀN ĐẠT** |
| **HSK Phase 3.1 Suite**| `npx vitest run tests/hskExamCenterPhase3.test.js` | **13 / 13 tests PASS** | **HOÀN TOÀN ĐẠT** |
| **ESLint Static Code** | `npm run lint` | **0 errors**, 460 warnings (style/unused vars) | **ĐẠT TIÊU CHUẨN** |
| **Vite Production Build**| `npm run build` | **Thành công trong 685ms**, tạo thư mục `dist/` đầy đủ | **ĐẠT TIÊU CHUẨN** |

---

## 5. TÌNH TRẠNG MIGRATION VÀ DỮ LIỆU

- **Dữ liệu hiện có trong mã nguồn:**
  - 4 bộ đề có câu hỏi hoàn chỉnh (37 câu hỏi): `hsk1-mock-01` (20 câu), `hsk2-mock-01` (5 câu), `hsk3-mock-01` (6 câu), `hsk4-mock-01` (6 câu).
  - 3 bộ đề tham khảo/bản nháp: `hsk1-reading-02` (draft), `hsk2-listening-02` (draft), `hsk1-official-ref-01` (tham khảo chính thức).
- **Trạng thái Database Migration:**
  - File migration `supabase/migrations/20261016_phase3_hsk_exam_center.sql` đã được sửa hoàn chỉnh, có thể chạy nhiều lần mà không gây lỗi (`DROP VIEW IF EXISTS CASCADE`, `IF NOT EXISTS`).
  - **Lưu ý bảo mật:** Migration **CHƯA** được tự ý thực thi trên Production database để đảm bảo tuân thủ nguyên tắc không can thiệp trái phép. Cần thực hiện theo quy trình phê duyệt bên dưới.

---

## 6. CÁC RỦI RO CÒN LẠI VÀ BIỆN PHÁP GIẢM THIỂU

1. **Rủi ro tài nguyên Audio/Media:**
   - Một số câu hỏi nghe HSK 2/3/4 sử dụng audio mẫu hoặc placeholder audio.
   - *Biện pháp:* Giữ trạng thái nháp (`is_published: false`) đối với các đề chưa cập nhật xong file âm thanh chất lượng cao trước khi mở cho học viên thi thử.
2. **Quy đổi điểm thi chính thức:**
   - Hệ thống hiện tại tính điểm theo thang điểm phần trăm chuẩn của đề thi nội bộ, không tự xưng là chứng chỉ chính thức của Bộ Giáo dục Trung Quốc (CTI). Giao diện đã có ghi chú rõ ràng về mục đích tự đánh giá và luyện tập.

---

## 7. DANH SÁCH THAO TÁC CẦN NGƯỜI DÙNG PHÊ DUYỆT (CHECKLIST TRIỂN KHAI)

Quản trị viên / Chủ sở hữu dự án vui lòng thực hiện hoặc xác nhận các bước sau:

- [ ] **Bước 1: Sao lưu (Backup) Database Supabase hiện tại**
  - Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard/project/qdrdvrwouikuxprmevup).
  - Vào mục `Database` -> `Backups` -> Tạo một bản manual backup trước khi thực hiện migration.
- [ ] **Bước 2: Áp dụng Migration lên Supabase**
  - Mở file [supabase/migrations/20261016_phase3_hsk_exam_center.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261016_phase3_hsk_exam_center.sql).
  - Vào SQL Editor trên Supabase Dashboard và dán toàn bộ nội dung để chạy (Run).
  - *Phương án rollback nếu cần:* Nếu cần quay về phiên bản trước, chạy lệnh khôi phục từ snapshot backup ở Bước 1.
- [ ] **Bước 3: Nạp dữ liệu đề thi ban đầu (Seed Data)**
  - Chạy thử trước để kiểm tra: `node scripts/seedHskExams.js --dry-run`
  - Chạy nạp chính thức: `node scripts/seedHskExams.js`
- [ ] **Bước 4: Đồng bộ mã nguồn lên Git và Vercel Production**
  - Xác nhận đẩy các commit đã audit lên branch `main`: `git push origin main`
  - Vercel sẽ tự động build và deploy bản mới nhất mà không gặp bất kỳ lỗi biên dịch nào.

---

## 8. KẾT LUẬN & KHUYẾN NGHỊ CUỐI CÙNG

### **ĐÁNH GIÁ: READY FOR PRODUCTION REVIEW**

- Toàn bộ các tiêu chí an toàn (chấm điểm độc lập, không lộ đề/đáp án, chống IDOR, bảo vệ đề chưa xuất bản, chống nộp lặp) đã được xác minh bằng mã nguồn thực tế và kiểm thử tự động.
- Không còn lỗ hổng bảo mật mức độ Nghiêm trọng (Critical) hoặc Cao (High).
- Bản dựng và bộ kiểm thử đã vượt qua 100% (**498/498 tests pass**).
- Hệ thống đã sẵn sàng để Chủ dự án phê duyệt và tiến hành chạy migration theo checklist ở Mục 7.
