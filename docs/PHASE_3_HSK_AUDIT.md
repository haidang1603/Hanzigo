# BÁO CÁO AUDIT HỆ THỐNG LUYỆN THI HSK (PHASE 3) — HANZIGO
**Ngày thực hiện**: 16/10/2026  
**Chuyên gia phụ trách**: Senior Full-Stack Engineer, Database Architect & QA Lead  
**Phạm vi kiểm tra**: Trung tâm HSK, Cơ sở dữ liệu Supabase, API Serverless, Dịch vụ luyện thi, Sổ tay câu sai & Kiểm thử

---

## 1. TỔNG QUAN HỆ THỐNG HIỆN TẠI

Trước khi tiến hành sửa đổi, chúng tôi đã thực hiện rà soát trực tiếp mã nguồn, cơ sở dữ liệu Supabase đang hoạt động, bộ API serverless và toàn bộ 485 bài kiểm thử hiện có.

### 1.1. Hiện trạng giao diện người dùng (Frontend)
- **Component chính**: [HskPracticePage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/HskPracticePage.jsx) (3,127 dòng), [HskPhase3Components.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/HskPhase3Components.jsx), [HskStructureView.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/HskStructureView.jsx).
- **Các luồng giao diện**:
  1. `#hsk` / `#hsk/exams`: Danh sách bộ đề, phân loại theo Cấp độ (HSK 1 - HSK 6, HSK 7-9), Kỹ năng (Nghe, Đọc, Viết, Tổng hợp), Định dạng (Thi thử HanziGo Mock, Đề mẫu CTI tham chiếu).
  2. `#hsk/exam/:id`: Thông tin chi tiết đề thi, quy chế thi, số câu hỏi, thời gian, thang điểm, giấy phép bản quyền.
  3. `#hsk/take/:id`: Phòng thi trực tuyến responsive, đồng hồ đếm ngược, phân đoạn kỹ năng, bộ chọn đáp án, thanh tiến độ, phát âm audio kèm giới hạn lượt nghe theo chuẩn thi, cơ chế lưu nháp chống mất bài khi F5.
  4. `#hsk/result/:id`: Báo cáo kết quả bài thi, điểm quy đổi theo chuẩn CTI, tỉ lệ chính xác, phân tích thế mạnh/yếu theo từng kỹ năng, hiển thị đáp án đúng và giải thích chi tiết.
  5. `#hsk/history`: Lịch sử các lần thi, biểu đồ tiến độ điểm số, chức năng so sánh trực quan giữa 2 lần làm bài.
  6. `#hsk/mistakes`: Sổ tay câu hỏi sai (Mistakes Notebook), bộ lọc cấp độ, kỹ năng, trạng thái (cần ôn lại / đã nắm vững), chế độ tạo bài thi luyện tập chuyên sâu từ các câu sai.
  7. `#hsk/structure`: Bảng đối chiếu cấu trúc chuẩn HSK 2.0 (2015-Standard) và HSK 3.0 (GF0025-2021).
  8. `#hsk/resources`: Thư viện tài nguyên giáo trình, đề mẫu miễn phí.

### 1.2. Hiện trạng Cơ sở dữ liệu Supabase
Kiểm tra trực tiếp database Supabase thông qua Admin Client:
- `public.hsk_exam_structures`: Bảng đã tạo, **0 bản ghi**.
- `public.hsk_exams`: Bảng đã tạo, **0 bản ghi**.
- `public.hsk_questions`: Bảng đã tạo, **0 bản ghi**.
- `public.hsk_attempts`: Bảng đã tạo, **0 bản ghi**.
- `public.hsk_mistakes`: Bảng đã tạo, **0 bản ghi**.
- `public.hsk_resources`: Bảng đã tạo, **0 bản ghi**.
- `public.hsk_reports`: Bảng đã tạo, **0 bản ghi**.
- `public.v_hsk_questions_public`: View đã tạo, **0 bản ghi**.

### 1.3. Hiện trạng Dữ liệu cục bộ (Local Dataset)
- `src/data/hskExamsData.js`: Đã biên soạn 7 bộ đề thi chuẩn:
  - `hsk1-mock-01` (HSK 1 - 20 câu hỏi hoàn chỉnh: 10 nghe + 10 đọc, kèm file audio/script, pinyin, dịch nghĩa, lời giải)
  - `hsk1-reading-02` (HSK 1 - Đọc hiểu chuyên sâu)
  - `hsk2-mock-01` (HSK 2 - 5 câu hỏi hoàn chỉnh)
  - `hsk2-listening-02` (HSK 2 - Luyện nghe)
  - `hsk3-mock-01` (HSK 3 - 6 câu hỏi hoàn chỉnh)
  - `hsk4-mock-01` (HSK 4 - 6 câu hỏi hoàn chỉnh)
  - `hsk1-official-ref-01` (Metadata đề mẫu tham chiếu chính thức CTI)
  - Tổng số câu hỏi sẵn sàng kiểm thử: **37 câu hỏi**.
- `src/data/hskStructureData.js`: Cấu trúc chi tiết 7 cấp độ (HSK 1 đến HSK 6 và HSK 7-9), phân định rõ ràng giữa HSK 2015-Standard và HSK 3.0-2021.

---

## 2. NHỮNG GÌ ĐÃ HOẠT ĐỘNG TỐT

1. **Giao diện làm bài và tương tác**:
   - Đồng hồ đếm ngược hoạt động ổn định, có cảnh báo hết giờ tự động nộp bài.
   - Bộ chọn đáp án, điều hướng giữa các câu, đánh dấu câu cần xem lại (`flagged`) mượt mà.
   - Cơ chế phát audio tôn trọng số lần phát tối đa theo cấp độ (HSK 1-2 tối đa 2 lần, HSK 3+ tối đa 1 lần trong chế độ thi mô phỏng).
   - Tự động lưu nháp câu trả lời vào `localStorage` theo prefix `hanzigo_hsk_draft_<examId>`, khôi phục liền mạch khi tải lại trang.
2. **Chống gian lận phía Client (Sanitization)**:
   - Hàm `getSanitizedExamForTaking(examId)` tước bỏ hoàn toàn `correct_option_index`, `correct_order`, `accepted_answers` và `explanation` trước khi cấp cho học viên làm bài.
   - Học viên chỉ nhận được đáp án đúng và lời giải chi tiết sau khi đã nộp bài thành công.
3. **Chấm điểm và phân tích sư phạm**:
   - Hỗ trợ đa dạng loại câu: Trắc nghiệm khách quan, Đúng/Sai, Sắp xếp từ ngữ thành câu (`reorder_sentence`), Điền từ vào chỗ trống (`fill_blank`).
   - Câu hỏi tự luận viết (`free_writing`) được gắn cờ `needsSelfAssessment`, không tự tạo điểm giả hoặc coi là đúng tự động khi chưa có barem chấm.
   - Quy đổi điểm tương ứng theo thang 200 điểm (HSK 1-2) hoặc 300 điểm (HSK 3-6) kèm phân tích kỹ năng (Nghe hiểu, Đọc hiểu, Viết).
4. **Phân biệt phiên bản HSK minh bạch**:
   - Phân biệt rõ HSK 2.0 (2015-Standard, đang áp dụng toàn cầu tại các điểm thi) và HSK 3.0 (GF0025-2021, HSK 7-9 đã thi, HSK 1-6 đang trong lộ trình chuyển tiếp).
   - Ghi chú đầy đủ nguồn thẩm định chính thức từ `chinesetest.cn`.

---

## 3. CÁC LỖI, RỦI RO & THIẾU SÓT PHÁT HIỆN ĐƯỢC

### 3.1. [DB-01] Rào cản Khóa ngoại do `hsk_exams` trên Supabase chưa có dữ liệu
- **Hiện tượng**: Bảng `hsk_exams` trên database Supabase có 0 dòng.
- **Rủi ro**: Khi học viên nộp bài thi hoặc ghi câu hỏi sai, thao tác `INSERT` vào `hsk_attempts` hoặc `hsk_mistakes` với `exam_id: 'hsk1-mock-01'` sẽ bị PostgreSQL chặn đứng với lỗi:
  ```
  code: '23503', message: 'insert or update on table "hsk_mistakes" violates foreign key constraint "hsk_mistakes_exam_id_fkey"'
  ```
- **Hệ quả**: Dữ liệu không thể lưu trữ bền vững trên đám mây; chỉ lưu tạm thời ở `localStorage`.

### 3.2. [DB-02] Lỗi xung đột Upsert `hsk_mistakes` (Error 42P10)
- **Hiện tượng**: Trong `src/services/hskService.js`:
  ```javascript
  await supabase.from('hsk_mistakes').upsert(rows, { onConflict: 'user_id,question_id' });
  ```
  Nhưng trong database, chỉ mục duy nhất được khai báo dạng partial index:
  `CREATE UNIQUE INDEX uq_hsk_mistakes_user_question ON public.hsk_mistakes(user_id, question_id) WHERE user_id IS NOT NULL;`
- **Rủi ro**: PostgREST báo lỗi `42P10` (*there is no unique or exclusion constraint matching the ON CONFLICT specification*).
- **Hệ quả**: Thao tác ghi nhận câu hỏi sai lên Supabase bị thất bại âm thầm (bị nuốt lỗi trong try/catch).

### 3.3. [SEC-01] Endpoint `/api/hsk/submit` thiếu Zero-Trust User Authentication
- **Hiện tượng**: Endpoint `api/_handlers/hsk/submit.js` chỉ đọc `anonymousSessionId` từ body, không gọi `verifyRequestAuth(req)` để gắn `user_id` chính thức từ JWT của người dùng đã đăng nhập.
- **Rủi ro**: Học viên đã đăng nhập khi nộp bài qua server API sẽ bị lưu thành bài thi vô danh hoặc không liên kết được với hồ sơ cá nhân.

### 3.4. [SEC-02] Endpoint `/api/hsk/attempt` thiếu kiểm tra quyền sở hữu (Access Control Bypass)
- **Hiện tượng**: Endpoint `api/_handlers/hsk/attempt.js` trả về dữ liệu bài làm của bất kỳ `id` nào được truyền vào mà không xác thực xem người yêu cầu có phải là chủ sở hữu hoặc Quản trị viên hay không.
- **Rủi ro**: Người dùng B có thể xem toàn bộ câu trả lời, điểm số và thông tin bài thi của Người dùng A nếu biết ID bài làm.

### 3.5. [SEC-03] Endpoint `/api/hsk/history` & `/api/hsk/mistakes` chưa cô lập dữ liệu người dùng trên Serverless
- **Hiện tượng**: `history.js` và `mistakes.js` chưa gọi `verifyRequestAuth(req)` để truyền context người dùng vào các hàm service. Thao tác `PATCH` / `DELETE` câu sai chưa kiểm tra người thực hiện có quyền với bản ghi đó hay không.

### 3.6. [OPS-01] Thiếu Script Seed đề thi mẫu chính thức lên Supabase
- **Hiện tượng**: Repository có các script seed từ vựng, bài học, lộ trình học tập nhưng chưa có `scripts/seedHskExams.js` để đẩy cấu trúc đề, thông tin đề thi và câu hỏi đã kiểm duyệt lên Supabase.

---

## 4. KẾ HOẠCH HÀNH ĐỘNG (ACTION PLAN THEO ĐỘ ƯU TIÊN)

| Ưu tiên | Hạng mục | Giải pháp kỹ thuật |
|---|---|---|
| **P0** | **Migration Phase 3 & RLS** | Tạo migration `supabase/migrations/20261016_phase3_hsk_exam_center.sql` sửa ràng buộc Unique trên `hsk_mistakes`, đảm bảo RLS cho phép người dùng truy cập an toàn. |
| **P0** | **Idempotent Seed Script** | Tạo `scripts/seedHskExams.js` nạp đầy đủ cấu trúc HSK (`hsk_exam_structures`), 7 bộ đề (`hsk_exams`) và 37 câu hỏi (`hsk_questions`) lên Supabase. |
| **P0** | **Harden Server-Side HSK APIs** | Cập nhật `submit.js`, `attempt.js`, `history.js`, `mistakes.js`: gọi `verifyRequestAuth(req)`, chặn truy cập chéo giữa 2 tài khoản, lưu kết quả và câu sai vào database trên server. |
| **P1** | **Chuẩn hóa HskService** | Chuẩn hóa `syncAttemptToSupabase` (bổ sung `exam_mode`), chuẩn hóa `syncMistakesToSupabase` với ID xác định (`mst_${userId || anonId}_${questionId}`) để upsert thành công 100%. |
| **P1** | **Sổ tay câu sai & Lịch sử** | Hoàn thiện luồng deduplication câu sai, tính năng ôn tập câu sai, so sánh 2 lần thi, empty state khi chưa có bài làm. |
| **P0** | **Kiểm thử nghiệm thu** | Viết bộ kiểm thử toàn diện `tests/hskExamCenterPhase3.test.js`, chạy `npm test -- --run`, `npm run lint`, `npm run build`. |
| **P0** | **Báo cáo hoàn thành** | Xuất tài liệu bàn giao `docs/PHASE_3_HSK_COMPLETION_REPORT.md`. |
