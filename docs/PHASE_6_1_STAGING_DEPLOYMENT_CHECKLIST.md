# BẢNG KIỂM TRA TRIỂN KHAI STAGING (STAGING DEPLOYMENT CHECKLIST) — PHASE 6.1
**Dự án**: HanziGo Platform  
**Phiên bản**: Phase 6.1 Security & HSK Server-side Remediation  
**Người thực hiện**: Quản trị viên hệ thống (DBA / Project Owner / DevOps)  
**Quy tắc an toàn**: Không chạy trực tiếp trên Supabase Production. Toàn bộ các bước phải thực hiện và nghiệm thu trên môi trường **Staging / Preview** trước.

---

## 1. CÔNG TÁC CHUẨN BỊ (PRE-FLIGHT CHECKS)

- [ ] **Môi trường cơ sở dữ liệu Staging**:
  - Đã có Supabase Staging instance độc lập (hoặc local Supabase CLI instance `supabase start`).
  - Đã sao lưu dữ liệu hiện có trên Staging trước khi chạy migration mới.
- [ ] **Môi trường Serverless / Vercel Staging**:
  - Đã cấu hình Vercel Preview branch deployment cho PR tương ứng.
  - Đã cấu hình các biến môi trường bắt buộc trên Vercel Preview/Staging:
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `LIVEKIT_URL` (URL LiveKit Cloud Staging / Sandbox)
    - `LIVEKIT_API_KEY`
    - `LIVEKIT_API_SECRET`
    - `ALLOW_PAID_FALLBACK=false` (Mặc định tuân thủ ngân sách)

---

## 2. QUY TRÌNH ÁP DỤNG MIGRATION CƠ SỞ DỮ LIỆU

### File migration cần áp dụng:
`supabase/migrations/20261016_phase6_1_security_and_hsk_remediation.sql`

### Cách thức áp dụng:
1. **Cách 1: Qua Supabase CLI (Khuyến nghị)**
   ```bash
   supabase db push
   ```
2. **Cách 2: Qua Supabase Dashboard SQL Editor (Môi trường Staging)**
   - Mở SQL Editor trên project Staging.
   - Sao chép toàn bộ nội dung file `20261016_phase6_1_security_and_hsk_remediation.sql`.
   - Bấm **Run** và kiểm tra thông báo `Success. No rows returned`.

---

## 3. CÁC CÂU LỆNH KIỂM CHỨNG SAU KHI ÁP DỤNG (POST-MIGRATION VERIFICATION QUERIES)

Chạy các câu lệnh SQL sau trên Staging SQL Editor để xác nhận chính sách đã có hiệu lực:

### 3.1. Xác minh quyền hạn trên RPC `atomic_join_live_session` (SEC-01)
```sql
SELECT routine_name, grantee, privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_name = 'atomic_join_live_session';
```
- **Kỳ vọng**: 
  - `PUBLIC` **không** còn xuất hiện.
  - Chỉ có `authenticated` và `service_role` được cấp quyền `EXECUTE`.

### 3.2. Xác minh cấu trúc View `v_hsk_questions_public` (SEC-02)
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'v_hsk_questions_public' 
  AND column_name IN ('correct_option_index', 'correct_order', 'correct_sentence', 'accepted_answers', 'explanation');
```
- **Kỳ vọng**: Trả về **0 rows** (các cột đáp án và lời giải đã được loại bỏ hoàn toàn khỏi view công khai).

### 3.3. Xác minh quyền truy cập bảng gốc `hsk_questions` (SEC-02)
```sql
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'hsk_questions' AND grantee IN ('anon', 'authenticated');
```
- **Kỳ vọng**: Trả về **0 rows** (Quyền SELECT trực tiếp đã bị thu hồi khỏi anon và authenticated).

### 3.4. Xác minh RLS Policies trên `hsk_attempts` và `hsk_mistakes` (SEC-03)
```sql
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('hsk_attempts', 'hsk_mistakes')
ORDER BY tablename, cmd;
```
- **Kỳ vọng**:
  - `hsk_attempts` có policy `hsk_attempts_select_owner` (chỉ owner hoặc admin). Không có policy cho phép anonymous client đọc dữ liệu của nhau.
  - `hsk_mistakes` chỉ cho phép owner (`auth.uid() = user_id`) thao tác.

---

## 4. KỊCH BẢN KIỂM THỬ KHÓI TRÊN STAGING (STAGING SMOKE TESTS)

Thực hiện các thao tác người dùng thực tế trên giao diện Staging Preview URL:

### Test Case 1: Đăng ký tài khoản mới (SEC-04)
- **Thao tác**: Vào trang Đăng ký tài khoản, mở DevTools Console.
- **Kỳ vọng**: 
  - Đăng ký công khai luôn được tạo với vai trò `student` trong bảng `public.profiles`.
  - Nếu điền mã mời giáo viên hợp lệ (`HZG_TEACHER_VERIFIED_2026`), tài khoản được cấp quyền `teacher`.

### Test Case 2: Kiểm tra chống lộ đáp án HSK trên DevTools Network (SEC-02)
- **Thao tác**: Vào làm đề thi thử HSK 1 (`hsk1-mock-01`), mở tab Network trên DevTools.
- **Kỳ vọng**: Trong payload câu hỏi tải về, hoàn toàn không có trường `correct_option_index` hay `explanation`.

### Test Case 3: Nộp bài thi HSK và xác minh chấm điểm phía máy chủ (SEC-06)
- **Thao tác**: Hoàn thành đề thi và bấm "Nộp bài".
- **Kỳ vọng**:
  - Request gửi tới `POST /api/hsk/submit`.
  - Phản hồi nhận về HTTP 200 kèm `attempt` đã được server tính toán điểm số chính xác.
  - Bấm nộp bài lần 2 (hoặc double-click): Server trả về kết quả kèm cờ `deduplicated: true`, không tạo 2 bản ghi trong cơ sở dữ liệu.

### Test Case 4: Tham gia phòng học trực tuyến LiveKit (SEC-01 & SEC-05)
- **Thao tác**: Đăng nhập với tài khoản học viên và bấm tham gia lớp học đang diễn ra.
- **Kỳ vọng**:
  - LiveKit token được cấp phát thành công nếu credentials trên Staging hợp lệ.
  - Nếu biến môi trường LiveKit bị gỡ bỏ, endpoint phản hồi đúng `503 Service Unavailable`, không rơi vào trạng thái treo hoặc crash serverless function.

---

## 5. KẾ HOẠCH ROLLBACK (TRƯỜNG HỢP GẶP SỰ CỐ)

Nếu phát sinh lỗi ngoài dự kiến trên Staging, quản trị viên có thể rollback an toàn theo các bước:

1. **Rollback Vercel Deployment**:
   - Chuyển instant rollback sang deployment trước đó trên Vercel Dashboard.
2. **Khôi phục View / Grant Supabase**:
   - Khôi phục quyền tạm thời nếu cần thiết cho phiên bản cũ:
     ```sql
     GRANT SELECT ON TABLE public.hsk_questions TO anon, authenticated;
     ```
   - Chú ý: Chỉ thực hiện trên Staging để chẩn đoán lỗi, không chạy trên Production.
