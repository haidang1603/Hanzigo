# BÁO CÁO BÀN GIAO HỆ THỐNG LUYỆN THI HSK (PHASE 3) — HANZIGO
**Thời điểm bàn giao**: 16/10/2026  
**Chuyên gia phụ trách**: Senior Full-Stack Engineer, Database Architect & QA Lead  
**Dự án**: HanziGo ([GitHub](https://github.com/haidang1603/Hanzigo) / [Production](https://hanzigo-xi.vercel.app/))

---

## 1. KẾT QUẢ AUDIT BAN ĐẦU VÀ CÁC ĐIỂM NGHẼN ĐÃ GIẢI QUYẾT

Trước khi can thiệp mã nguồn, quá trình audit trực tiếp (chi tiết tại [docs/PHASE_3_HSK_AUDIT.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_3_HSK_AUDIT.md)) đã ghi nhận:
1. **DB-01**: Bảng `public.hsk_exams` trên Supabase có 0 dòng dữ liệu khiến toàn bộ thao tác nộp bài thi hoặc ghi câu hỏi sai lên Supabase bị lỗi ràng buộc khóa ngoại `hsk_mistakes_exam_id_fkey` (`23503`).
2. **DB-02**: Bảng `public.hsk_mistakes` có chỉ mục duy nhất dạng partial index (`WHERE user_id IS NOT NULL`), khiến lệnh `upsert(..., { onConflict: 'user_id,question_id' })` của Supabase SDK thất bại với mã lỗi `42P10`.
3. **SEC-01**: Endpoint `POST /api/hsk/submit` thiếu lớp xác thực JWT Zero-Trust (`verifyRequestAuth`), khiến học viên đã đăng nhập khi nộp bài bị lưu thành bài thi ẩn danh.
4. **SEC-02**: Endpoint `GET /api/hsk/attempt` không kiểm tra quyền sở hữu, tạo ra lỗ hổng rò rỉ kết quả và câu trả lời giữa các tài khoản khác nhau.
5. **SEC-03**: Endpoint `GET/PATCH/DELETE /api/hsk/mistakes` và `GET /api/hsk/history` thiếu xác thực server-side, chưa cô lập lịch sử và sổ tay câu sai theo tài khoản.
6. **OPS-01**: Thiếu migration chính thức và script nạp dữ liệu chuẩn mực (`seedHskExams.js`).

---

## 2. CÁC FILE ĐÃ THÊM VÀ CHỈNH SỬA

### 2.1. File thêm mới
- [docs/PHASE_3_HSK_AUDIT.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_3_HSK_AUDIT.md): Báo cáo audit chi tiết toàn diện hệ thống luyện thi HSK trước khi thay đổi.
- [supabase/migrations/20261016_phase3_hsk_exam_center.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261016_phase3_hsk_exam_center.sql): Migration chuẩn hóa các bảng `hsk_exam_structures`, `hsk_exams`, `hsk_questions`, `hsk_attempts`, `hsk_mistakes`, Security View `v_hsk_questions_public` và các chính sách Row Level Security (RLS).
- [scripts/seedHskExams.js](file:///d:/DELL/Dowloads/HanziGo/scripts/seedHskExams.js): Công cụ nạp dữ liệu lũy đẳng (Idempotent Seed Tool) hỗ trợ cờ xem trước `--dry-run`, nạp cấu trúc, đề thi và câu hỏi.
- [tests/hskExamCenterPhase3.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/hskExamCenterPhase3.test.js): Bộ kiểm thử tự động 9 kịch bản chuyên sâu kiểm tra Anti-cheat, chấm điểm, phân quyền Zero-Trust, Sổ tay câu sai và phân biệt phiên bản HSK.
- [docs/PHASE_3_HSK_COMPLETION_REPORT.md](file:///d:/DELL/Dowloads/HanziGo/docs/PHASE_3_HSK_COMPLETION_REPORT.md): Tài liệu nghiệm thu và bàn giao Phase 3.

### 2.2. File chỉnh sửa & Nâng cấp
- [api/_handlers/hsk/submit.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/hsk/submit.js):
  - Tích hợp `verifyRequestAuth(req)` lấy danh tính người dùng uy tín từ JWT.
  - Chấm điểm khách quan trên server, tính điểm quy đổi theo chuẩn CTI, tỉ lệ chính xác, phân tích kỹ năng.
  - Tự động ghi nhận câu sai vào bảng `hsk_mistakes` trên server với khóa chính tất định (`mst_${userId || anonId}_${q.questionId}`).
  - Kháng giả mạo: Client không thể tự gửi điểm hoặc trạng thái `passed` để thay đổi kết quả.
- [api/_handlers/hsk/attempt.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/hsk/attempt.js):
  - Kiểm tra quyền sở hữu bài làm: Chỉ người tạo bài làm hoặc Quản trị viên (`role: 'admin'`) mới được phép truy xuất chi tiết bài làm cá nhân. Trả về `401` nếu chưa đăng nhập, `403` nếu truy cập bài của học viên khác.
- [api/_handlers/hsk/history.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/hsk/history.js):
  - Xác thực người dùng, cô lập lịch sử làm bài theo tài khoản, chặn việc so sánh bài làm của học viên khác.
- [api/_handlers/hsk/mistakes.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/hsk/mistakes.js):
  - Xác thực và truyền context `user` vào các thao tác đọc danh sách câu sai, cập nhật trạng thái (`mastered`/`needs_review`) và xóa câu sai.
- [src/services/hskService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/hskService.js):
  - Bổ sung `exam_mode` khi đồng bộ `hsk_attempts`.
  - Chuẩn hóa tạo ID câu sai tất định và đổi mục tiêu `onConflict: 'id'` trong `syncMistakesToSupabase`, loại bỏ triệt để lỗi `42P10`.
- [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json):
  - Thêm `tests/hskExamCenterPhase3.test.js` vào lệnh `npm test`.
  - Thêm script `npm run db:seed:hsk`.

---

## 3. THIẾT KẾ SCHEMA & BẢO MẬT DATABASE (SUPABASE)

### 3.1. Các thực thể cốt lõi
1. **`hsk_exam_structures`**: Định nghĩa cấu trúc chuẩn theo syllabus CTI (thời lượng, số câu từng phần nghe/đọc/viết, điểm tối đa, điểm đạt, số lượt phát audio).
2. **`hsk_exams`**: Lưu thông tin đề thi, phân loại cấp độ (HSK 1-6), phiên bản (2015-Standard / HSK 3.0), loại đề (`mock` / `official_sample`), trạng thái xuất bản (`is_published`).
3. **`hsk_questions`**: Lưu nội dung câu hỏi, file âm thanh, lời thoại, phương án lựa chọn, đáp án đúng (`correct_option_index`), thang điểm và lời giải chi tiết.
4. **`v_hsk_questions_public` (Security View)**: View an toàn tước bỏ hoàn toàn đáp án đúng, thứ tự sắp xếp và lời giải để phục vụ client khi làm bài thi.
5. **`hsk_attempts`**: Lưu từng lượt làm bài, bao gồm `user_id`, `anonymous_session_id`, thời gian làm bài, đáp án đã chọn, điểm số, tỉ lệ chính xác, phân tích kỹ năng.
6. **`hsk_mistakes`**: Sổ tay câu hỏi sai với cơ chế khử trùng lặp (Deduplication) theo `(user_id, question_id)` hoặc khóa chính tất định, lưu số lần làm sai (`mistake_count`) và trạng thái (`needs_review` / `mastered`).

### 3.2. Chính sách RLS (Row Level Security)
- Không vô hiệu hóa RLS trên bất kỳ bảng nào.
- Học viên chỉ có quyền xem, sửa, xóa dữ liệu bài làm và sổ tay câu sai của chính mình.
- Đề thi ở trạng thái chưa xuất bản (`is_published: false`) chỉ có Admin mới có quyền truy cập.

---

## 4. NGUỒN TÀI LIỆU, GIẤY PHÉP VÀ DỮ LIỆU ĐÃ KIỂM DUYỆT

### 4.1. Quy tắc ghi nhận nguồn và bản quyền
- **Đề thi thử HanziGo (`exam_type: 'mock'`)**: Do Ban Học Thuật HanziGo biên soạn, gắn giấy phép `CC BY-NC-SA 4.0`.
- **Đề tham chiếu CTI (`exam_type: 'official_sample'`)**: Trích dẫn đối chiếu từ cổng khảo thí chính thức `chinesetest.cn` (CLEC / CTI). Tuyệt đối không tự ý gắn nhãn đề tự soạn thành đề khảo thí quốc gia.

### 4.2. Thống kê dữ liệu thực tế đã kiểm duyệt
- **Tổng số bộ đề sẵn sàng trong kho**: 7 bộ đề (HSK 1 đến HSK 4).
- **Tổng số câu hỏi hoàn chỉnh đã biên soạn đầy đủ pinyin, audio script, dịch nghĩa, đáp án và lời giải**: 37 câu hỏi.
- **Cấu trúc chuẩn đã lập hồ sơ**: 13 hồ sơ cấu trúc cho 7 cấp bậc (HSK 1, 2, 3, 4, 5, 6 và 7-9) qua 2 hệ thống chuẩn 2015-Standard và HSK 3.0.

---

## 5. KẾT QUẢ KIỂM THỬ, LINT VÀ BUILD

### 5.1. Kết quả kiểm thử tự động (Unit & Integration Tests)
Chạy lệnh: `npm test`
```
ℹ tests 494
ℹ suites 0
ℹ pass 494
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1805.8225
```
**Kết quả**: **494 / 494 bài kiểm thử vượt qua 100%**, bao gồm toàn bộ hồi quy bảo mật Phase 1, Phase 2, và 9 bài kiểm thử mở rộng Phase 3.

### 5.2. Kết quả kiểm tra cú pháp (Linting)
Chạy lệnh: `npm run lint`
```
Found 460 warnings and 0 errors.
Finished in 220ms on 233 files with 104 rules using 12 threads.
```
**Kết quả**: **0 lỗi (0 errors)**.

### 5.3. Kết quả đóng gói sản phẩm (Production Build)
Chạy lệnh: `npm run build`
```
vite v8.3.1 building client environment for production...
transforming...
✓ 2199 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                   2.38 kB │ gzip:   1.11 kB
dist/assets/index-BH8Tooq3.css                  283.44 kB │ gzip:  31.29 kB
dist/assets/HskPracticePage-BHnOWK-Q.js         178.25 kB │ gzip:  38.29 kB
✓ built in 700ms
```
**Kết quả**: **Đóng gói production thành công trong 700ms**, không có lỗi TypeScript/JavaScript nào.

---

## 6. HƯỚNG DẪN KIỂM THỬ THỦ CÔNG (MANUAL TESTING GUIDE)

1. **Khởi chạy môi trường thử nghiệm**:
   ```bash
   npm run dev
   ```
   Truy cập trình duyệt tại `http://localhost:5174/#hsk`.
2. **Kiểm tra danh sách đề thi (`#hsk/exams`)**:
   - Sử dụng bộ lọc theo cấp độ (HSK 1, HSK 2, HSK 3, HSK 4).
   - Sử dụng bộ lọc kỹ năng (Nghe hiểu, Đọc hiểu, Tổng hợp).
   - Kiểm tra nhãn bản quyền và mô tả đề thi.
3. **Làm bài thi thử (`#hsk/take/hsk1-mock-01`)**:
   - Kiểm tra đồng hồ đếm ngược chạy đều, không bị nhảy số hay cộng dồn khi chọn câu hỏi.
   - Thử bấm F5/Reload trang: xác nhận các câu trả lời đã chọn và câu đánh dấu xem lại (`flagged`) vẫn được giữ nguyên vẹn.
   - Thử bấm phát audio câu nghe: kiểm tra chỉ được phát tối đa 2 lần trong chế độ thi mô phỏng.
4. **Nộp bài và xem kết quả (`#hsk/result/:id`)**:
   - Bấm nộp bài: xác nhận xuất hiện bảng kết quả chi tiết, điểm thi ước tính theo thang chuẩn 200 điểm, tỉ lệ đúng và bảng phân tích kỹ năng.
   - Kiểm tra đáp án đúng và lời giải thích tiếng Việt hiển thị chính xác.
5. **Kiểm tra Sổ tay câu sai (`#hsk/mistakes`)**:
   - Chuyển sang tab Sổ tay câu sai: xác nhận các câu làm sai trong bài thi vừa rồi đã tự động xuất hiện.
   - Bấm đổi trạng thái một câu sang "Đã nắm vững": xác nhận giao diện cập nhật ngay.
   - Bấm "Luyện tập từ câu sai": xác nhận tạo được bài tập gồm các câu hỏi cần ôn lại.
6. **Kiểm tra Lịch sử làm bài (`#hsk/history`)**:
   - Xem danh sách các lần thi đã thực hiện.
   - Chọn 2 lượt làm bài của cùng một đề thi và bấm "So sánh kết quả": xác nhận xuất hiện bảng đối chiếu tiến độ điểm số và kỹ năng.

---

## 7. CÁC BƯỚC CẦN PHÊ DUYỆT TRƯỚC KHI DEPLOY PRODUCTION

1. **Phê duyệt chạy Migration Database trên Supabase Production**:
   - Áp dụng migration [supabase/migrations/20261016_phase3_hsk_exam_center.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261016_phase3_hsk_exam_center.sql) trên SQL Editor của Supabase Production Dashboard.
2. **Chạy Seed Script dữ liệu đề thi trên Production**:
   - Sử dụng `SUPABASE_SERVICE_ROLE_KEY` của dự án production:
     ```bash
     node scripts/seedHskExams.js
     ```
3. **Cấu hình biến môi trường Vercel**:
   - Đảm bảo `SUPABASE_SERVICE_ROLE_KEY` được khai báo trong cài đặt Environment Variables trên Vercel.
4. **Git Commit & Push**:
   - Đẩy các thay đổi hoàn thiện Phase 3 lên nhánh chính (`main`) của GitHub `haidang1603/Hanzigo`.
