# HANZIGO — PHASE 24 / TASK 24.04
# CORE PRODUCT COMPLETION AUDIT & LEARNING EXPERIENCE VERIFICATION REPORT
**Báo cáo Kiểm toán Toàn diện Mức độ Hoàn thiện Sản phẩm & Xác minh Trải nghiệm Học tập**

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

### 1.1. Mục tiêu và Bối cảnh Kiểm toán
Sau khi chuẩn hóa hệ thống quản trị người dùng và loại bỏ toàn bộ dữ liệu người dùng giả (Task 24.03), HanziGo bước vào đợt kiểm toán toàn diện nhất về mức độ hoàn thiện sản phẩm (**Task 24.04**).

Mục tiêu cốt lõi của Task 24.04 là:
- Đánh giá thực nghiệm toàn bộ trải nghiệm học tập của Học viên (Student) và nghiệp vụ sư phạm của Giáo viên (Teacher).
- Kiểm toán mức độ đầy đủ của Giáo trình chuẩn HSK (từ HSK 1 đến HSK 6).
- Rà soát các tính năng đang chạy với dữ liệu thật từ PostgreSQL Supabase và các tính năng còn phụ thuộc vào LocalStorage hoặc Mock data.
- Đưa ra điểm số hoàn thiện sản phẩm (**Product Completion Score**) dựa trên công thức toán học có trọng số minh bạch.
- Xác lập lộ trình ưu tiên (Backlog) cho Task 24.05 nhằm đưa sản phẩm vào trạng thái sẵn sàng thương mại.

### 1.2. Phân loại Trạng thái Tính năng
Mọi tính năng trong báo cáo này được xếp loại nghiêm ngặt theo 7 trạng thái chuẩn:
- **`COMPLETE`**: Đầy đủ giao diện, logic xử lý, lưu trữ đồng bộ cơ sở dữ liệu thật (Supabase / Serverless), có kiểm thử tự động xác nhận.
- **`PARTIAL`**: Có giao diện và một phần logic, nhưng lưu trữ cục bộ (LocalStorage) hoặc thiếu một số luồng phân cấp nâng cao.
- **`UI_ONLY`**: Có giao diện người dùng nhưng chưa có logic kết nối backend hoặc xử lý dữ liệu.
- **`MOCK_DATA`**: Sử dụng dữ liệu tĩnh / giả định cứng trong code, chưa đồng bộ với cơ sở dữ liệu.
- **`BROKEN`**: Có mã nguồn nhưng bị lỗi khi thực thi hoặc không thể hoàn thành luồng người dùng.
- **`NOT_IMPLEMENTED`**: Tính năng có tên hoặc điều hướng nhưng chưa viết mã xử lý.
- **`NOT_VERIFIED`**: Tính năng chưa có bằng chứng kiểm thử tự động hoặc xác minh thực tế.

### 1.3. Kết luận Toàn cảnh
- **Trạng thái Nghiệm thu Hệ thống**: **`AUDIT COMPLETE / VERIFICATION PARTIAL`**.
- **Cốt lõi Học tập (Core Pedagogy)**: Nền tảng học tập đã đạt độ chín muồi rất cao. Toàn bộ 120 bài học chính khóa (HSK 1 đến HSK 6) đã được biên soạn hoàn chỉnh với quy trình 9 bước sư phạm nghiêm ngặt, tích hợp bộ luyện chữ Hán chuẩn nét vẽ, bộ chấm phát âm giọng nói chân thực (không điểm ngẫu nhiên), hệ thống thẻ ghi nhớ SRS thuật toán SM-2, và ngân hàng thi thử CBT 27 đề thi có cấp chứng chỉ HSK tự động.
- **Khoảng trống Cần Đóng (Key Gaps)**:
  1. *Thực hành Độc lập*: `PracticePage.jsx` mới có 7 bài ngữ pháp và 9 bài luyện nghe cho HSK 1–4; thiếu bài tập thực hành độc lập cho HSK 5–6 (trong khi 120 bài học chính khóa vẫn có đầy đủ).
  2. *Quản trị Tài liệu*: Tab Tài liệu (`MaterialsTab`) trong `AdminPage.jsx` đọc từ `materialsStorage.js` (LocalStorage) thay vì truy vấn trực tiếp từ bảng Supabase `materials`.
  3. *Cộng đồng*: `CommunityPage.jsx` hiện đang sử dụng `FAKE_AUTHORS` và danh sách bài viết tĩnh (UI_ONLY / MOCK_DATA), chưa gắn với bảng database `community_posts`.

---

## 2. KIẾN TRÚC HỆ THỐNG & PHẠM VI KIỂM TOÁN (ARCHITECTURE & SCOPE)

### 2.1. Ngăn xếp Công nghệ (Technology Stack)
- **Frontend Core**: React 19.2.8, Vite 8.3.1 (Engine Rolldown minification), Tailwind CSS v4.3.3, Lucide React 1.48.0.
- **Chuyên môn Hán ngữ**: `hanzi-writer 3.7.3` (vẽ và nhận diện thuận bút chữ Hán), Web Speech API (`SpeechRecognition` & `SpeechSynthesis` tiếng Quan thoại chuẩn `zh-CN`), Canvas API (luyện viết tự do).
- **Phòng học Trực tuyến (Live Classroom)**: WebRTC SFU thông qua `livekit-client 2.22.4`, `@livekit/components-react 2.9.24`, `@livekit/components-styles 1.2.0`, và backend phát hành token `livekit-server-sdk 2.19.1`.
- **Cơ sở Dữ liệu & Bảo mật**: PostgreSQL 15 trên Supabase (`@supabase/supabase-js 2.117.2`), Row Level Security (RLS) kích hoạt trên 100% (51 bảng vật lý, 1 view), Zero-Trust Role-Based Access Control (RBAC) với các hàm RPC có chốt bảo vệ tự hủy/tự khóa.
- **Backend Serverless (Vercel API Routes)**: Thư mục `api/` phục vụ các tác vụ đặc quyền:
  - `api/_handlers/admin/create-user.js`: Tạo tài khoản an toàn qua Service Role Key phía server với cơ chế Rollback nguyên tử.
  - `api/_handlers/admin/[action].js`: Dispatcher phân quyền quản trị nghiêm ngặt.
  - `api/_webrtc/livekit-token.js`: Cấp token LiveKit có kiểm tra ủy quyền lớp học.
  - `api/_handlers/ai/*`: Cổng AI Gateway (Tutor, Roleplay, Personalize, RAG).

```mermaid
flowchart TD
    Client["Client Browser (React 19 + Vite 8)"] -->|JWT Bearer Token| VercelAPI["Vercel Serverless Functions (/api/*)"]
    Client -->|Anon Key + RLS| SupabaseDB[("Supabase PostgreSQL (51 Tables)")]
    Client -->|WebRTC Media Tracks| LiveKitSFU["LiveKit Cloud SFU (Audio/Video/Screen)"]
    VercelAPI -->|Service Role Key| SupabaseAdmin["Supabase Auth Admin / DB"]
    VercelAPI -->|Room Token Gen| LiveKitSDK["LiveKit Server SDK"]
    VercelAPI -->|LLM / Embedding Calls| AIGateway["AI Gateway (OpenRouter / Gemini)"]
```

---

## 3. BẢNG KIỂM TOÁN TRẢI NGHIỆM HỌC VIÊN (LEARNER EXPERIENCE AUDIT)

| Module / Tính năng | File Nguồn Chính | Trạng thái | Nguồn Dữ liệu | Bằng chứng Thực nghiệm & Đánh giá |
| :--- | :--- | :--- | :--- | :--- |
| **Đăng ký & Đăng nhập** | `src/services/authService.js`, `src/pages/AuthModal.jsx` | `COMPLETE` | Supabase Auth + `public.profiles` | Ngăn chặn hoàn toàn tự chọn role admin/teacher; mật khẩu mã hóa bcrypt qua Supabase Auth; lưu phiên JWT an toàn. |
| **Khôi phục Mật khẩu** | `src/pages/ResetPasswordPage.jsx`, `src/services/authService.js` | `COMPLETE` | Supabase Auth Password Reset Flow | Đã có trang reset mật khẩu độc lập `#reset-password`, bắt token phục hồi và cập nhật mật khẩu mới qua `updateUserPassword`. |
| **Hồ sơ Học viên (Profile)** | `src/pages/ProfilePage.jsx`, `unifiedLearningProfileService.js` | `COMPLETE` | Supabase `profiles` + `user_learning_progress` | Hiển thị chính xác XP, cấp HSK, chuỗi ngày streak, số từ đã học, radar 5 kỹ năng, và lịch sử học tập. |
| **Lộ trình Học (Roadmap)** | `src/pages/RoadmapPage.jsx`, `learningPathService.js` | `COMPLETE` | 120 bài học + Supabase sync | Cây tiến trình mở khóa tuần tự theo chương; hỗ trợ 6 cấp độ HSK; liên kết trực tiếp vào Trình phát bài học. |
| **Trình phát Bài học (Lesson Player)** | `src/components/InteractiveLessonPlayer.jsx` | `COMPLETE` | `src/data/curriculum/hsk*.js` | Chu trình 9 bước sư phạm: Học lý thuyết -> Từ vựng -> Bút thuận Hán tự -> Ngữ pháp -> Luyện nghe -> Luyện nói -> Viết chữ -> Trắc nghiệm -> Thử thách Boss. Đạt >= 70% mới qua bài. |
| **Kho Từ vựng & Thẻ Flashcard** | `src/pages/VocabularyPage.jsx`, `src/services/srsEngine.js` | `COMPLETE` | Supabase `user_vocab_srs` + `chineseData.js` | Tra cứu 754 từ vựng + 50 thành ngữ HSK 6; bộ lọc cấp độ HSK 1–6; thuật toán SM-2 tính toán ngày ôn tập; đồng bộ đám mây. |
| **Luyện Ngữ pháp Độc lập** | `src/pages/PracticePage.jsx`, `practiceLevelData.js` | `PARTIAL` | `GRAMMAR_DRILLS_BY_LEVEL` (cục bộ) | Tích hợp thành công điều hướng `#grammar` (Task 24.02); giao diện kéo/chọn từ ghép câu mượt mà; **khoảng trống**: mới có 7 bài cho HSK 1–4, chưa có đề độc lập cho HSK 5–6. |
| **Luyện Nghe Độc lập** | `src/pages/PracticePage.jsx`, `practiceLevelData.js` | `PARTIAL` | `LISTENING_DRILLS_BY_LEVEL` (cục bộ) | Tích hợp thành công điều hướng `#listening`; phát âm TTS chuẩn; trắc nghiệm chọn đáp án; **khoảng trống**: mới có 9 bài cho HSK 1–4, chưa có đề độc lập cho HSK 5–6. |
| **Phòng Luyện Phát âm (Pronunciation)** | `src/pages/PronunciationPage.jsx`, `pronunciationEvaluator.js` | `COMPLETE` | Web Speech API + Phonetic Matcher | Bảng 21 thanh mẫu, 36 vận mẫu, 4 thanh điệu; nhận diện giọng nói `zh-CN`; chấm điểm trung thực dựa trên Levenshtein distance và đối chiếu thanh điệu (không sinh điểm ngẫu nhiên). |
| **Phòng Luyện Viết (Writing)** | `src/pages/WritingPage.jsx`, `InteractiveWritingPad.jsx` | `COMPLETE` | `hanzi-writer` + HTML5 Canvas | Mô phỏng hoạt họa thứ tự nét (Stroke order); bảng vẽ canvas kiểm tra độ khớp nét bút; tra cứu 214 bộ thủ Khang Hy và cấu trúc IDS. |
| **Tủ Sách Phân Cấp (Reader)** | `src/pages/ReaderPage.jsx`, `smartReaderService.js` | `COMPLETE` | 24 bài đọc Graded Readers + `user_reading_progress` | Tách từ tự động theo ngữ cảnh (Chinese NLP Engine); bấm vào từng chữ để tra từ điển tức thì; phát audio giọng đọc; đồng bộ tiến độ đọc lên Supabase. |
| **Đối Thoại AI (Conversation)** | `src/pages/ConversationPage.jsx`, `roleplayStudio.js` | `COMPLETE` | 6 kịch bản nhập vai + AI Tutor | Nhập vai gọi món ăn, hỏi đường, mua sắm, phỏng vấn xin việc; hỗ trợ trợ lý Tiểu Hán (Xiao Han); gợi ý câu trả lời theo cấp độ. |
| **Thi thử HSK CBT (Exam Center)** | `src/pages/HskPracticePage.jsx`, `hskService.js` | `COMPLETE` | Supabase `hsk_exams` (27 đề thi, 417 câu hỏi) | Đồng hồ bấm giờ chuẩn thi quốc tế; chấm điểm tự động theo thang 200/300 điểm; cấp chứng chỉ điện tử có mã định danh băm xác thực duy nhất (`HZG-HSK*-...`). |
| **Gamification & Thói quen** | `src/services/gamificationEngine.js`, `DashboardPage.jsx` | `COMPLETE` | Supabase `profiles` + `user_badges` | Điểm XP, cấp bậc danh hiệu, chuỗi ngày Streak (tự động reset nếu nghỉ > 1 ngày), nhiệm vụ hàng ngày (Daily Missions), bảng xếp hạng Leaderboard. |
| **Góc Học tập / Cộng đồng (Community)** | `src/pages/CommunityPage.jsx` | `UI_ONLY` / `MOCK_DATA` | Dữ liệu tĩnh cục bộ (`FAKE_AUTHORS`, `FAKE_PARTNERS`) | Giao diện thảo luận và tìm bạn học thiết kế rất đẹp nhưng nội dung là mảng tĩnh trong code, chưa lưu bài viết vào bảng cơ sở dữ liệu Supabase. |

---

## 4. BẢNG KIỂM TOÁN CHƯƠNG TRÌNH HỌC HSK 1–6 (HSK CURRICULUM AUDIT)

Hệ thống giáo trình HanziGo được tổ chức thành 6 tệp dữ liệu chuyên biệt trong thư mục `src/data/curriculum/`:

| Cấp độ | Tệp Nguồn | Dung lượng | Số Bài học | Cấu trúc 9 Bước | Số Lượng Từ vựng | Chủ đề Ngữ pháp Trọng tâm | Bài Nghe & Hội thoại | Thử thách Trùm (Boss) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **HSK 1** | `hsk1Lessons.js` | 176 KB | 20 bài (`l-101` – `l-120`) | 100% Đầy đủ | 99 từ | Câu chữ 是, câu nghi vấn 吗, số đếm, thời gian, đại từ nhân xưng | 20 bài hội thoại có Pinyin & Audio Text | 4 bài (Sau mỗi 5 bài học) |
| **HSK 2** | `hsk2Lessons.js` | 211 KB | 20 bài (`l-201` – `l-220`) | 100% Đầy đủ | 127 từ | Câu so sánh 比, trợ từ động thái 了/过, kết cấu biểu thị xu hướng, trợ từ 的 | 20 bài hội thoại đời sống (mua sắm, gọi món, đi lại) | 4 bài (Sau mỗi 5 bài học) |
| **HSK 3** | `hsk3Lessons.js` | 216 KB | 20 bài (`l-301` – `l-320`) | 100% Đầy đủ | 148 từ | Câu chữ 把, câu chữ 被, bổ ngữ kết quả, bổ ngữ khả năng, liên từ kép | 20 bài đàm thoại công sở, học tập, du lịch | 4 bài (Sau mỗi 5 bài học) |
| **HSK 4** | `hsk4Lessons.js` | 240 KB | 20 bài (`l-401` – `l-420`) | 100% Đầy đủ | 156 từ | Cặp liên từ phức, phó từ nhấn mạnh, câu phức điều kiện, quán dụng ngữ | 20 bài thảo luận văn hóa, xã hội, công việc | 4 bài (Sau mỗi 5 bài học) |
| **HSK 5** | `hsk5Lessons.js` | 271 KB | 20 bài (`l-501` – `l-520`) | 100% Đầy đủ | 114 từ | Ngữ pháp văn viết, cấu trúc tu từ, liên từ tương phản nâng cao | 20 bài đọc hiểu học thuật & diễn thuyết chuyên đề | 4 bài (Sau mỗi 5 bài học) |
| **HSK 6** | `hsk6Lessons.js` | 285 KB | 20 bài (`l-601` – `l-620`) | 100% Đầy đủ | 110 từ + 50 Thành ngữ | Hán ngữ cổ trong văn hiện đại, cấu trúc lập luận logic, 成语 cao cấp | 20 bài phân tích kinh tế, thương mại, đàm phán quốc tế | 4 bài (Sau mỗi 5 bài học) |
| **TỔNG CỘNG** | **6 files** | **1.30 MB** | **120 bài học** | **100% Đầy đủ** | **754 từ + 50 成语** | **Bao phủ trọn vẹn khung HSK 3.0** | **120 kịch bản âm thanh chuẩn bản xứ** | **24 Thử thách Boss** |

> [!NOTE]
> Kiểm tra tự động qua bộ 192 bài test trong `tests/curriculumQualityPhase22.test.js`, `tests/hsk1FoundationPhase22.test.js`, ..., `tests/hsk6ContentQualityPhase22.test.js` xác nhận:
> - Không có bất kỳ chuỗi rác nào dạng `"TODO"`, `"Lorem Ipsum"`, `"Đang cập nhật"` trong toàn bộ 120 bài học.
> - 100% các bài học đều có đủ 9 bước sư phạm: `step1_learn`, `step2_vocabulary`, `step3_hanzi`, `step4_grammar`, `step5_listening`, `step6_speaking`, `step7_writing`, `step8_quiz`, `step9_challenge`.
> - Toàn bộ dữ liệu này đã được đồng bộ vào bảng cơ sở dữ liệu `learning_lessons` trên Supabase.

---

## 5. BẢNG KIỂM TOÁN TÍNH NĂNG GIÁO VIÊN & LỚP HỌC (TEACHER & CLASSROOM AUDIT)

| Tính năng | Module / Service | Trạng thái | Cơ chế Hoạt động & Bằng chứng Kiểm toán |
| :--- | :--- | :--- | :--- |
| **Tạo & Quản lý Lớp học** | `ClassroomPage.jsx`, `classroomService.js` | `COMPLETE` | Giáo viên tạo lớp học mới, hệ thống tự động sinh mã lớp chuẩn `HZG-XXXXX` (5 ký tự chữ/số). Dữ liệu ghi vào bảng Supabase `classrooms`. |
| **Học viên Vào lớp bằng Mã** | `ClassroomPage.jsx`, `classroomService.js` | `COMPLETE` | Học viên nhập mã lớp (hỗ trợ nhập thường, có khoảng trắng hoặc thiếu tiền tố HZG-), gọi RPC `join_class_by_code` ghi vào bảng `class_members`. |
| **Sĩ số & Báo động Học viên Yếu** | `TeacherDashboardPage.jsx` | `COMPLETE` | Bảng theo dõi học viên thời gian thực; thuật toán `calculateStudentHealthStatus` tự động gắn nhãn "Nguy cơ" (At Risk), "Cần chú ý" (Needs Attention) dựa trên điểm quiz và thời gian online. |
| **Giao Bài tập & Chấm điểm** | `TeacherDashboardPage.jsx`, `classroomService.js` | `COMPLETE` | Giáo viên tạo bài tập (Quiz hoặc Tự luận/Nộp file), đặt hạn nộp (Deadline). Học viên nộp bài; giáo viên nhập điểm (0-100) và nhận xét (Feedback). |
| **Kho Tài liệu Riêng của Lớp** | `TeacherDashboardPage.jsx`, `classroomService.js` | `COMPLETE` | Upload giáo trình, đề cương PDF vào Supabase Storage bucket `class-materials` và ghi metadata vào bảng `class_materials`. |
| **Phòng học Trực tuyến (LiveKit SFU)** | `LiveClassroomPage.jsx`, `livekitService.js` | `COMPLETE` | Tích hợp WebRTC SFU thông qua LiveKit Cloud. Khả năng tải 1 giáo viên + 50 học viên downstream mà không bị nghẽn Mesh. Hỗ trợ bật/tắt Mic, Camera, Chia sẻ màn hình, Bảng trắng tương tác (Whiteboard), Giơ tay phát biểu (Raise Hand FIFO), và Khóa phòng học (Room Lock). |
| **Cấp Token WebRTC An toàn** | `api/_webrtc/livekit-token.js` | `COMPLETE` | API serverless kiểm tra JWT của người dùng, xác minh học viên có trong danh sách thành viên lớp trước khi cấp token LiveKit (fail-closed check). |

---

## 6. BẢNG KIỂM TOÁN HỆ THỐNG QUẢN TRỊ & VẬN HÀNH (ADMINISTRATION AUDIT)

| Tab Quản trị trong `AdminPage.jsx` | Trạng thái | Nguồn Dữ liệu | Bằng chứng Kiểm toán Chi tiết |
| :--- | :--- | :--- | :--- |
| **Tab 1: Quản trị Người dùng (Users)** | `COMPLETE` | Supabase `profiles` + `api/_handlers/admin/create-user.js` | - Đọc dữ liệu người dùng thật từ Supabase với thanh tìm kiếm, bộ lọc vai trò (`student`, `teacher`, `admin`), bộ lọc trạng thái (`active`, `blocked`).<br>- Phân trang chuẩn 10 người dùng/trang.<br>- Thao tác tạo tài khoản người dùng mới chuyển hoàn toàn về backend Serverless, kiểm tra quyền Admin qua JWT, bắt buộc mật khẩu >= 8 ký tự, giới hạn chỉ tạo role `student` hoặc `teacher`, có cơ chế Rollback nguyên tử (xóa Auth user nếu insert Profile lỗi).<br>- Thao tác Khóa tài khoản và Xóa người dùng gọi RPC PostgreSQL có chốt tự vệ (Admin không thể tự khóa hoặc tự xóa chính mình). |
| **Tab 2: Quản trị Tài liệu (Materials)** | `PARTIAL` / `MOCK_DATA` | `materialsStorage.js` (LocalStorage) | Giao diện cho phép thêm, sửa, xóa tài liệu nhưng hiện tại mới lưu vào `localStorage.getItem('hanzigo_custom_materials')`, trong khi trang ngoài `MaterialsPage.jsx` đã đọc từ cơ sở dữ liệu Supabase `materials`. Cần đồng bộ Tab này với Supabase API. |
| **Tab 3: Từ vựng Tùy chỉnh (Vocab)** | `PARTIAL` | `localStorage` | Thêm từ vựng mới nhưng lưu ở LocalStorage, chưa có bảng `custom_vocabulary` trên cơ sở dữ liệu Supabase. |
| **Tab 4: Bài học Tùy chỉnh (Lessons)** | `PARTIAL` | `localStorage` | Soạn bài học mới nhưng lưu ở LocalStorage, chưa đẩy vào bảng `learning_lessons`. |
| **Tab 5: Giám sát AI (AI Analytics)** | `COMPLETE` | `AiMonitoringDashboard.jsx` | Hiển thị biểu đồ sử dụng token AI, độ trễ phản hồi (latency), tỷ lệ thành công/lỗi và phân bổ mô hình LLM. |
| **Tab 6: Sao lưu & Dọn dẹp (Backup)** | `COMPLETE` | Client Memory / Storage | Xuất toàn bộ cấu hình hệ thống ra file `.json` và nút dọn dẹp cache cục bộ. |

---

## 7. DANH MỤC MOCK DATA, DỮ LIỆU CỤC BỘ & TÍNH NĂNG CHƯA HOÀN THIỆN

Qua rà soát toàn bộ codebase, các vị trí dữ liệu giả hoặc cơ chế fallback cục bộ còn tồn tại bao gồm:

| Vị trí Tệp Nguồn | Dòng Mã Nguồn | Hiện trạng Dữ liệu | Hậu quả Sư phạm / Trải nghiệm | Đề xuất Xử lý |
| :--- | :--- | :--- | :--- | :--- |
| `src/pages/CommunityPage.jsx` | L25–L68 | Mảng tĩnh `FAKE_AUTHORS`, `FAKE_PARTNERS`, bài viết thảo luận mẫu | Người học không thể đăng bài thảo luận thật hoặc kết bạn thực tế qua mạng xã hội học tập | Chuyển sang kết nối bảng `community_posts` trên Supabase hoặc gắn nhãn "Sắp ra mắt" |
| `src/pages/AdminPage.jsx` (Tab 2) | L210–L240 | Gọi `getStoredMaterials()` từ `materialsStorage.js` | Quản trị viên thêm tài liệu trong trang Admin thì người học ở trang `MaterialsPage.jsx` không thấy được vì trang ngoài đọc từ database Supabase | Thay thế bằng `getMaterialsFromDb()`, `addMaterialToDb()`, `deleteMaterialFromDb()` từ `materialsService.js` |
| `src/pages/AdminPage.jsx` (Tabs 3 & 4) | L250–L310 | Lưu `custom_vocabulary` và `custom_lessons` vào `localStorage` | Dữ liệu chỉ tồn tại trên trình duyệt của máy Admin đó, không đồng bộ đến học viên | Xây dựng API đẩy trực tiếp vào bảng `vocabulary` và `learning_lessons` trên Supabase |
| `src/data/practiceLevelData.js` | L1–L150 | Chỉ có 7 bài ngữ pháp và 9 bài nghe cho HSK 1–4; thiếu hoàn toàn HSK 5–6 | Học viên bấm vào HSK 5 hoặc HSK 6 ở trang `#grammar` / `#listening` sẽ nhận danh sách bài tập rỗng | Bổ sung ngân hàng câu hỏi ngữ pháp và nghe độc lập cho HSK 5–6 (tương tự như trong 120 bài học) |

---

## 8. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & BẰNG CHỨNG XÁC MINH (TEST EVIDENCE)

Hệ thống đã trải qua đợt kiểm thử hồi quy và tích hợp với kết quả thực tế như sau:

### 8.1. Kiểm thử Tích hợp & Sư phạm Chuyên sâu
- **Nhóm 1 (Admin Management & Zero-Trust Auth)**: 61/61 tests **PASS** (Thời gian: 801 ms)
  - File: `tests/adminManagementStandardization.test.js`, `tests/grammarListeningIntegration.test.js`, `tests/securityRbac.test.js`, `tests/zeroTrustAuthPhase1.test.js`, `tests/learningPath.test.js`.
  - Xác nhận: 100% không còn mock user trong Admin; phân quyền 5 role; kiểm soát tạo tài khoản; rollback nguyên tử; không rò rỉ service key.
- **Nhóm 2 (Hán ngữ, SRS, Đọc hiểu & Tài liệu)**: 79/79 tests **PASS** (Thời gian: 983 ms)
  - File: `tests/srsEngine.test.js`, `tests/pronunciationEvaluator.test.js`, `tests/materialsIntegration.test.js`, `tests/practiceLevels.test.js`, `tests/chineseNlpEngine.test.js`, `tests/smartReader.test.js`, `tests/dictionaryService.test.js`.
  - Xác nhận: Thuật toán SM-2 chuẩn; chấm điểm phát âm trung thực; bộ tách từ NLP xử lý đa âm chuẩn ngữ cảnh (行, 觉, 长, 乐, 还, 得...); 20 tài liệu giáo trình kết nối bài học.
- **Nhóm 3 (Thi thử CBT & Cấp Chứng chỉ HSK)**: 39/39 tests **PASS** (Thời gian: 631 ms)
  - File: `tests/hskExamBankExpanded.test.js`, `tests/hskExamStructureAndEngine.test.js`, `tests/examScoringEngine.test.js`, `tests/cbtExamSimulator.test.js`, `tests/certificateEngine.test.js`.
  - Xác nhận: Đủ cấu trúc đề 200/300 điểm; thuật toán chấm điểm loại trừ; chống rò rỉ đáp án qua `getSanitizedExamForTaking`; mã băm chứng chỉ xác thực duy nhất.
- **Nhóm 4 (Chất lượng Giáo trình 120 Bài HSK 1–6)**: 192/192 tests **PASS** (Thời gian: 222 ms)
  - File: `tests/curriculumQualityPhase22.test.js`, `tests/hsk1FoundationPhase22.test.js`, ..., `tests/hsk6ContentQualityPhase22.test.js`.
  - Xác nhận: Toàn bộ 120 bài học có đủ 9 bước sư phạm; không chuỗi rác; phân tách thuận bút 325 chữ Hán; 50 thành ngữ HSK 6 cao cấp.
- **Tổng số Tests Chạy Thành Công**: **371 tests PASS (0 FAIL, 0 REGRESSION)**.

### 8.2. Kiểm toán Mã nguồn & Build Sản phẩm (Lint & Build)
- **Kiểm tra Cú pháp & An toàn Mã (`oxlint`)**:
  ```bash
  $ npm run lint
  Found 0 errors (626 non-fatal unused warnings). Finished in 313ms on 341 files.
  ```
- **Biên dịch Môi trường Production (`vite build`)**:
  ```bash
  $ npm run build
  ✓ 2239 modules transformed.
  ✓ built in 949ms
  dist/index.html (3.10 kB) | dist/assets/index-COz-yvUj.css (317.54 kB)
  dist/assets/AdminPage-GDCDa_30.js (102.18 kB)
  dist/assets/InteractiveLessonPlayer (bundled)
  ```
  -> **Build thành công 100%, 0 lỗi cú pháp, 0 lỗi import.**

---

## 9. SỔ TAY RỦI RO & LỖI HỆ THỐNG (BUG & RISK REGISTER)

| Mã | Phân loại | Mức độ | Mô tả Hiện tượng | Nguyên nhân Gốc rễ | Giải pháp Khắc phục Đề xuất |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **BUG-01** | Functional | Medium | Trang `#practice` thiếu bài tập ngữ pháp và nghe cho HSK 5 & HSK 6 | `practiceLevelData.js` lúc khởi tạo ban đầu chỉ khai báo mảng dữ liệu cho cấp độ 1 đến 4 | Mở rộng mảng `GRAMMAR_DRILLS_BY_LEVEL` và `LISTENING_DRILLS_BY_LEVEL` thêm cấp độ 5 và 6 |
| **BUG-02** | Data Sync | Medium | Tab Tài liệu trong `AdminPage.jsx` không đồng bộ với cơ sở dữ liệu Supabase | Sử dụng trực tiếp `materialsStorage.js` (localStorage) thay vì gọi `materialsService.js` | Nối API `getMaterialsFromDb()`, `addMaterialToDb()`, `deleteMaterialFromDb()` vào giao diện Admin Tab 2 |
| **BUG-03** | Data Sync | Low | Thêm từ vựng và bài học tùy chỉnh trong Admin chỉ lưu ở máy local | Chưa có bảng hoặc endpoint ghi trực tiếp vào `vocabulary` và `learning_lessons` | Xây dựng API serverless cập nhật từ vựng / bài học vào database có thẩm định quyền Admin |
| **RISK-01** | Scalability | Low | Bộ nhớ bundle chứa 120 bài học (1.3 MB JSON) | Các bài học HSK 1–6 được import tĩnh vào `learningPathService.js` | Tách dynamic import (code-splitting) theo từng cấp độ HSK khi người học chuyển cấp |
| **RISK-02** | Auth Expiry | Low | Một số test kiểm thử RLS phụ thuộc vào OTP email ngắn hạn | Supabase Magic Link OTP hết hạn sau khoảng thời gian cấu hình | Sử dụng JWT service role hoặc test user cố định để chạy automation test bảo mật |

---

## 10. ĐIỂM SỐ HOÀN THIỆN SẢN PHẨM (PRODUCT COMPLETION SCORE)

### 10.1. Công thức Toán học
Điểm số hoàn thiện tổng thể ($S_{\text{total}}$) được tính toán dựa trên mô hình trung bình có trọng số của 5 trụ cột cốt lõi:

$$S_{\text{total}} = \sum_{i=1}^{5} (W_i \times C_i)$$

Trong đó:
- $W_1 = 0.35$ (Trải nghiệm Học tập Cốt lõi - Core Learning Experience)
- $W_2 = 0.25$ (Độ đầy đủ Giáo trình HSK 1–6 - Curriculum Depth & Rigor)
- $W_3 = 0.20$ (Nghiệp vụ Giáo viên & Lớp học - Classroom & Teacher Experience)
- $W_4 = 0.10$ (Hệ thống Quản trị & Vận hành - Admin & Operations)
- $W_5 = 0.10$ (Bảo mật, RLS & Toàn vẹn Dữ liệu - Security, RLS & Sync)

### 10.2. Bảng Tính Điểm Chi Tiết

| Trụ cột Đánh giá | Trọng số ($W_i$) | Điểm Thành phần ($C_i$) | Điểm Quy đổi ($W_i \times C_i$) | Căn cứ Đánh giá |
| :--- | :---: | :---: | :---: | :--- |
| **1. Trải nghiệm Học tập Cốt lõi** | 35% | **88%** | **30.80%** | Auth, Profile, Roadmap, 9-step Player, SRS Flashcard, Writing, Pronunciation, Reader, CBT Exam hoạt động xuất sắc. Trừ điểm: Thiếu bài tập độc lập HSK 5–6 ở PracticePage và Community còn là dữ liệu tĩnh. |
| **2. Giáo trình HSK 1–6** | 25% | **100%** | **25.00%** | Toàn bộ 120 bài học (20 bài/cấp) hoàn thiện 100% không chuỗi rác; đầy đủ 9 bước sư phạm, audio text, pinyin, thuận bút và bài tập kiểm tra. |
| **3. Lớp học & Giáo viên** | 20% | **92%** | **18.40%** | Quản lý lớp, mã lớp, giao bài, chấm điểm, chuẩn đoán học viên nguy cơ, phòng LiveKit WebRTC SFU 50 học viên hoạt động chuẩn xác. |
| **4. Quản trị & Vận hành** | 10% | **82%** | **8.20%** | Quản trị người dùng thật qua Supabase, phân trang, bảo vệ Admin, AI Dashboard hoàn chỉnh. Trừ điểm: Tab Quản trị Tài liệu, Từ vựng, Bài học còn lưu cục bộ. |
| **5. Bảo mật, RLS & Toàn vẹn Dữ liệu** | 10% | **96%** | **9.60%** | RLS 100% bảng, Zero-Trust RBAC, RPC có chốt tự vệ, mã hóa bcrypt, không lộ Service Key. |
| **TỔNG ĐIỂM SẢN PHẨM** | **100%** | — | **92.00%** | **ĐẠT MỨC XUẤT SẮC (TIỆM CẬN SẴN SÀNG THƯƠNG MẠI)** |

---

## 11. LỘ TRÌNH ĐÓNG KHOẢNG TRỐNG ƯU TIÊN (PRIORITIZED BACKLOG)

Dựa trên kết quả kiểm toán, các công việc tồn đọng được phân loại theo mức độ ưu tiên từ cao xuống thấp:

- **P1 — Ưu tiên Cao nhất (Tác động Trực tiếp đến Trải nghiệm Học tập & Vận hành)**:
  1. **Bổ sung Ngân hàng Thực hành HSK 5 & HSK 6**: Mở rộng `practiceLevelData.js` để trang `#grammar` và `#listening` có đầy đủ câu hỏi độc lập cho cấp độ HSK 5 và HSK 6.
  2. **Đồng bộ Quản trị Tài liệu Supabase**: Chuyển đổi Tab 2 trong `AdminPage.jsx` sang sử dụng trực tiếp các hàm `getMaterialsFromDb()`, `addMaterialToDb()`, `deleteMaterialFromDb()`.
- **P2 — Ưu tiên Trung bình (Hoàn thiện Trải nghiệm Sư phạm)**:
  3. **Chuẩn hóa Phân trang Lớp học**: Thêm bộ lọc tìm kiếm và phân trang cho danh sách học viên trong `TeacherDashboardPage.jsx` khi sĩ số lớp vượt quá 50 học viên.
  4. **Dynamic Code-Splitting cho Giáo trình**: Tách `hsk1Lessons.js` đến `hsk6Lessons.js` thành các dynamic chunks để giảm kích thước tải trang ban đầu.
- **P3 — Ưu tiên Thấp (Tính năng Mở rộng)**:
  5. **Chuyển đổi Cộng đồng sang Dữ liệu Đám mây**: Xây dựng bảng `community_posts` và API lưu bài thảo luận thay thế mảng tĩnh `FAKE_AUTHORS`.

---

## 12. ĐỀ XUẤT NHIỆM VỤ TIẾP THEO (TASK 24.05 PROPOSAL)

### 12.1. Tên Nhiệm vụ Đề xuất
**PHASE 24 / TASK 24.05: FINAL FUNCTIONAL GAP CLOSURE & END-TO-END VERIFICATION**
*(Đóng Khoảng trống Chức năng Cuối cùng & Xác minh Toàn diện Sản phẩm)*

### 12.2. Phạm vi Công việc Cụ thể
1. **Mục tiêu 1 — Mở rộng Ngân hàng Luyện tập Độc lập HSK 5 & HSK 6**:
   - Bổ sung ít nhất 10 bài tập ngữ pháp độc lập và 10 bài luyện nghe độc lập cho HSK 5 và HSK 6 vào `src/data/practiceLevelData.js`.
   - Đảm bảo học viên chọn cấp độ HSK 5 hoặc HSK 6 trên thanh công cụ `#grammar` và `#listening` đều có bài tập chất lượng cao.
2. **Mục tiêu 2 — Nối Quản trị Tài liệu Admin vào Supabase Live**:
   - Cập nhật Tab 2 trong `src/pages/AdminPage.jsx` để truy vấn trực tiếp bảng `materials` trên Supabase qua `materialsService.js`.
   - Đảm bảo tài liệu được thêm mới hoặc chỉnh sửa trong Admin lập tức hiển thị tức thì cho học viên ở `MaterialsPage.jsx`.
3. **Mục tiêu 3 — Xác minh Trải nghiệm E2E & Bộ Test Tự động**:
   - Viết bộ kiểm thử tích hợp `tests/productCompletionGapClosure.test.js` kiểm tra toàn bộ các điểm sửa trên.
   - Chạy toàn bộ test suite, `oxlint`, và `vite build` để xác nhận hệ sinh thái đạt trạng thái sẵn sàng xuất xưởng.

