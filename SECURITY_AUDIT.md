# BÁO CÁO BẢO MẬT VÀ TỐI ƯU HÓA HỆ THỐNG (SECURITY AUDIT) - HANZIGO

*Dự án: HanziGo Chinese Learning Platform*  
*Phiên bản: Production Hardening (Post-Classroom & Live Teaching)*  
*Thời gian thực hiện: Tháng 10/2026*  
*Trạng thái kiểm định: 85/85 Tests Passed (100%), Oxlint 0 Errors, Vite Production Build Successful*

---

## 1. TỔNG QUAN KIỂM ĐỊNH (EXECUTIVE SUMMARY)

Đợt kiểm tra và tăng cường an ninh (Production Hardening) tập trung toàn diện vào 5 trụ cột cốt lõi:
1. **Security**: Bảo vệ định danh, kiểm soát truy cập đa người dùng (Multi-tenant), an ninh điểm cuối AI và ngăn chặn khai thác tham số (IDOR / Injection).
2. **Performance**: Giảm thiểu truy vấn dư thừa, tối ưu hóa Realtime Subscriptions, loại trừ Memory Leaks và bổ sung hệ thống chỉ mục (Database Indexes) trọng yếu.
3. **Testing**: Mở rộng bộ kiểm thử tự động đạt 85 kiểm thử tích hợp và kiểm thử đơn vị bao phủ toàn diện Auth, RLS, Classroom, Live Session và AI.
4. **Reliability**: Tách biệt luồng môi trường giả lập (Offline Simulation) và cơ chế sản xuất (Supabase Production), kiểm soát vòng đời phiên trực tuyến.
5. **Monitoring & Error Handling**: Chuẩn hóa thông báo lỗi, tuyệt đối không để lộ mã lỗi SQL, khóa bí mật API Key, cấu trúc bảng hay Stack Trace tới người dùng.

---

## 2. CÁC LỖ HỔNG VÀ ĐIỂM YẾU ĐÃ PHÁT HIỆN (VULNERABILITIES FOUND)

### 2.1. Lỗ hổng RLS: Chính sách `classrooms_select_policy` quá rộng
* **Mức độ nghiêm trọng**: Cao (High)
* **Mô tả**: Trong Migration 10 trước đây, điều kiện `OR status = 'active'` cho phép bất kỳ người dùng nào (kể cả học sinh hoặc người dùng lạ) truy vấn danh sách toàn bộ các lớp học đang hoạt động trong hệ thống, vi phạm tính riêng tư giữa các giáo viên và học sinh.
* **Tác động**: Giáo viên A hoặc học sinh có thể liệt kê được thông tin lớp học của Giáo viên B.

### 2.2. Chiếm quyền điều hành lớp trực tuyến (Live Session Hijack)
* **Mức độ nghiêm trọng**: Nghiêm trọng (Critical)
* **Mô tả**: Trong logic hàm `verifySessionAccess` tại `liveClassroomService.js`, hệ thống kiểm tra `user.isTeacher` để cấp vai trò Giáo viên điều hành mà không đối soát ID của giáo viên tạo phiên (`session.teacher_id === userId`).
* **Tác động**: Một giáo viên B có tài khoản giáo viên hợp lệ có thể can thiệp, khóa phòng, mute mic và điều khiển công cụ giảng dạy của Giáo viên A.

### 2.3. Rò rỉ kênh truyền thời gian thực (Realtime Channel Leak)
* **Mức độ nghiêm trọng**: Trung bình (Medium)
* **Mô tả**: Component `LiveClassroomPage.jsx` đăng ký lắng nghe sự kiện (`liveEventBus.subscribe`) ngay khi khởi tạo component trước khi hoàn tất quá trình xác thực quyền tham gia (`verifySessionAccess`).
* **Tác động**: Người dùng chưa được phê duyệt hoặc kẻ tấn công có thể nghe lén sự kiện bảng vẽ, tin nhắn lớp học trực tiếp dù bị chặn vào giao diện.

### 2.4. Điểm cuối AI `/api/ai/chat` chưa có kiểm soát an ninh toàn diện
* **Mức độ nghiêm trọng**: Cao (High)
* **Mô tả**: 
  - Thiếu kiểm tra xác thực người dùng (Cho phép Anonymous request gọi thẳng API).
  - Không giới hạn độ dài ký tự đầu vào (dẫn tới nguy cơ Prompt Injection / Resource Exhaustion).
  - Thiếu Rate Limiting và Hạn ngạch (Quota) theo ngày.
  - Lộ khóa API nếu cấu hình serverless gặp sự cố.

### 2.5. Lỗ hổng can thiệp điểm số chéo (Cross-Teacher Grading Tampering)
* **Mức độ nghiêm trọng**: Cao (High)
* **Mô tả**: Hàm `gradeSubmission` và `deleteAssignment` trước đây chưa kiểm tra quyền sở hữu lớp học của giáo viên khi chấm điểm hoặc xóa bài tập.
* **Tác động**: Giáo viên B có thể chấm điểm hoặc sửa điểm bài tập của học sinh thuộc lớp Giáo viên A.

### 2.6. Lộ thông tin kỹ thuật trong thông báo lỗi (Information Disclosure)
* **Mức độ nghiêm trọng**: Trung bình (Medium)
* **Mô tả**: Các hàm bắt lỗi Supabase trả trực tiếp `err.message` (như `PGRST116`, tên bảng `classrooms`, vi phạm khóa ngoại `violates foreign key constraint`) ra thông báo giao diện.

---

## 3. CÁC BIỆN PHÁP KHẮC PHỤC ĐÃ TRIỂN KHAI (VULNERABILITIES FIXED)

### 3.1. Thắt chặt RLS & Bổ sung Database Indexes (Migration 11)
Đã triển khai migration `supabase/migrations/11_production_indexes.sql`:
1. **Khắc phục RLS**:
   - Loại bỏ hoàn toàn điều kiện `OR status = 'active'` khỏi `classrooms_select_policy`.
   - Lớp học chỉ được phép hiển thị cho:
     - Giáo viên phụ trách (`teacher_id = auth.uid()`)
     - Quản trị viên hệ thống (`role = 'admin'`)
     - Học viên đã được duyệt và ghi danh trong bảng `class_members`.
   - Tìm kiếm lớp học qua mã lớp vẫn an toàn tuyệt đối thông qua hàm `SECURITY DEFINER` `lookup_classroom_by_code`.
2. **Bổ sung chỉ mục (Database Indexes)**:
   - `idx_classrooms_teacher_id` trên `classrooms(teacher_id)`
   - `idx_class_members_lookup` trên `class_members(classroom_id, student_id)`
   - `idx_assignments_classroom_due` trên `assignments(classroom_id, due_date)`
   - `idx_submissions_composite` trên `assignment_submissions(assignment_id, student_id)`
   - `idx_live_sessions_class_status` trên `class_sessions(classroom_id, status)`
   - `idx_live_participants_composite` trên `live_session_participants(session_id, user_id)`
   - `idx_live_chat_session_time` trên `live_session_chat(session_id, created_at)`

### 3.2. Cố định vai trò và ngăn chặn chiếm quyền Live Classroom
- Tại `liveClassroomService.js`:
  - Vai trò điều hành được giới hạn nghiêm ngặt: `session.teacher_id === userId || user.role === 'admin'`.
  - Giáo viên khác tham gia phiên chỉ được đối xử như người tham gia bình thường (nếu được ghi danh) hoặc bị từ chối truy cập.
- Tại `LiveClassroomPage.jsx`:
  - Kênh lắng nghe `liveEventBus.subscribe` được bảo vệ chặt chẽ bằng điều kiện: `sessionData && !accessDeniedReason && !authChecking`. Kẻ tấn công không thể nhận sự kiện realtime nếu chưa qua bước xác thực.

### 3.3. Bảo mật toàn diện Endpoint AI (`/api/ai/chat` & `/api/ai/teacher`)
- **Xác thực**: Bắt buộc có `Authorization: Bearer <token>` hoặc `x-user-id`.
- **Validation đầu vào**:
  - Độ dài `userText` bị giới hạn tối đa `500 ký tự`.
  - Lịch sử hội thoại tối đa `10 tin nhắn`, mỗi tin tối đa `300 ký tự`.
- **Phòng chống tấn công Prompt Injection**:
  - Bộ lọc Regex tự động chặn các mẫu nguy hiểm (`ignore previous instructions`, `system prompt override`, `reveal api_key`, SQL injection, `<script>`).
- **Giới hạn lưu lượng (Rate Limit & Daily Quota)**:
  - Tối đa `20 requests / phút / user/IP`.
  - Hạn ngạch tối đa `150 requests / ngày`.
  - Sử dụng `.unref()` cho bộ đếm thời gian rác (GC timer) tránh gây treo tiến trình.
- **Giới hạn Token đầu ra**: `maxOutputTokens: 1000` (ngăn cản cạn kiệt tài nguyên / API bill abuse).

### 3.4. Kiểm soát phân quyền phân công & chấm điểm (Classroom Isolation)
- `createAssignment`: Xác thực bắt buộc `teacherId` và quyền sở hữu lớp học trước khi tạo.
- `deleteAssignment`: Bắt buộc kiểm tra quyền sở hữu bài tập theo lớp của giáo viên.
- `gradeSubmission`: Xác thực chéo giáo viên chấm điểm phải là chủ sở hữu của lớp học chứa bài tập tương ứng.

### 3.5. Xử lý lỗi an toàn (Production Error Sanitization)
- Tạo tiện ích chuyên biệt `src/utils/errorSanitizer.js`:
  - Tự động bóc tách và che giấu: `PGRST...`, `syntax error`, `violates constraint`, `AIza...` API keys, JWT tokens, tên cột và tên bảng CSDL.
  - Chuyển đổi thành các thông báo thân thiện bằng tiếng Việt phù hợp với ngữ cảnh học tập.

---

## 4. MA TRẬN KIỂM THỬ BẢO MẬT (SECURITY TEST MATRIX)

Tất cả các ca kiểm thử bảo mật đã được tự động hóa tại `tests/productionSecurityHardening.test.js`:

| Mục kiểm thử | Kịch bản thử nghiệm | Kết quả | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Auth Security** | Ngăn chặn người dùng tự ý leo thang quyền thành admin/teacher | Bị chặn, chỉ giữ vai trò hợp lệ | PASSED |
| **RLS - Student** | Học viên cố gắng tạo lớp, sửa bài tập hoặc xem dữ liệu nhạy cảm | Bị từ chối truy cập | PASSED |
| **RLS - Teacher Multi-tenant** | Giáo viên A cố gắng xóa bài hoặc sửa điểm của lớp Giáo viên B | Bị từ chối (403 Forbidden logic) | PASSED |
| **RLS - Unauthenticated** | Khách vãng lai gọi các thao tác ghi danh hoặc tạo lớp | Bị chặn với thông báo yêu cầu đăng nhập | PASSED |
| **AI - Method Check** | Gửi GET/PUT/DELETE tới `/api/ai/chat` | Trả về HTTP 405 Method Not Allowed | PASSED |
| **AI - Missing Auth** | Gửi yêu cầu thiếu Header định danh | Trả về HTTP 401 Unauthorized | PASSED |
| **AI - Input Length** | Gửi tin nhắn vượt quá 500 ký tự | Trả về HTTP 400 Bad Request | PASSED |
| **AI - Injection Defense** | Gửi mẫu Jailbreak / Prompt Override / SQL Injection | Trả về HTTP 400 và chặn can thiệp hệ thống | PASSED |
| **AI - Rate Limiting** | Gửi burst 25 yêu cầu dồn dập | Trả về HTTP 429 Too Many Requests | PASSED |
| **Fake Identifiers** | Gửi fake class ID, fake session ID, fake teacher ID | Báo lỗi an toàn, không làm crash server | PASSED |
| **Live Session Role Hijack** | Giáo viên B cố gắng chiếm quyền phòng dạy của Giáo viên A | Bị tước quyền điều hành | PASSED |
| **Cross-Teacher Grading** | Giáo viên B can thiệp hạ điểm bài nộp lớp Giáo viên A | Thao tác chấm điểm bị chặn | PASSED |
| **E2E Classroom Flow** | Tạo lớp $\to$ Mã lớp $\to$ Học viên vào $\to$ Giao bài $\to$ Nộp bài $\to$ Chấm điểm | Luồng hoàn tất chuẩn xác | PASSED |
| **E2E Live Flow** | Mở phòng $\to$ Học viên vào $\to$ Giơ tay $\to$ Cấp mic $\to$ Chat $\to$ Đóng phòng | Đồng bộ hoàn hảo | PASSED |
| **Error Leak Prevention** | Ném lỗi SQL nội bộ và khóa API giả lập qua Sanitizer | Ẩn toàn bộ dấu vết kỹ thuật, trả về tiếng Việt | PASSED |

---

## 5. RỦI RO CÒN LẠI VÀ KHUYẾN NGHỊ TƯƠNG LAI (REMAINING RISKS & FUTURE WORK)

### 5.1. Rủi ro còn lại (Remaining Risks)
1. **Chế độ In-Memory Rate Limiting trong môi trường Multi-Instance**:
   - Hiện tại, Rate Limiter của endpoint AI sử dụng `Map` trong bộ nhớ Node.js cục bộ. Khi ứng dụng triển khai trên nhiều instance serverless độc lập không chia sẻ bộ nhớ, hạn ngạch có thể bị nhân theo số lượng container.
2. **WebRTC P2P trong môi trường tường lửa nghiêm ngặt**:
   - Hiện tại Live Classroom hỗ trợ WebRTC qua STUN server công cộng của Google. Một số mạng doanh nghiệp hoặc trường học chặn UDP có thể cần TURN server relay chuyên dụng (như Coturn hoặc Twilio TURN).

### 5.2. Khuyến nghị nâng cấp tiếp theo (Recommended Future Work)
1. **Triển khai Redis / Upstash Rate Limiting**:
   - Tích hợp Redis phân tán để đồng bộ chính xác Rate Limit và Quota của AI Tutor trên toàn bộ các vùng serverless.
2. **Kích hoạt Audit Logging tập trung**:
   - Ghi nhận lịch sử các hành vi bất thường (liên tục thử mã lớp lạ, thử can thiệp quyền, rate limit breaches) vào bảng `audit_logs` có thời gian lưu trữ 90 ngày.
3. **Cơ chế xoay vòng JWT Refresh Token**:
   - Tăng cường bảo mật phiên học viên trên thiết bị di động bằng cách cấu hình thời gian sống của Access Token là 1 giờ và tự động làm mới qua Supabase Refresh Token.
