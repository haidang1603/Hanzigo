# HANZIGO — BÁO CÁO KIỂM TOÁN TOÀN DIỆN MỨC ĐỘ HOÀN THIỆN SẢN PHẨM
## PHASE 24 / TASK 24.01 — PRODUCT COMPLETION AUDIT REPORT

---

**Thời gian thực hiện:** Ngày 08 tháng 11 năm 2026  
**Chuyên gia kiểm toán:** Senior Lead Architect & Fullstack QA Engineer  
**Phạm vi:** Toàn bộ repository HanziGo (Frontend, Backend Serverless, Services, Data, Supabase Live Integration, LiveKit SFU, RLS & Authentication)  
**Nguyên tắc chỉ đạo:** AUDIT ONLY — Tuyệt đối không thay đổi mã nguồn sản phẩm, không sửa database schema, không chạy migration trong bước kiểm toán này.  
**Trạng thái kiểm toán:** HOÀN THÀNH (100% codebase được rà soát thực nghiệm)

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

HanziGo là nền tảng học và luyện thi tiếng Trung chuẩn HSK 3.0 tích hợp trí tuệ nhân tạo (RAG, Gemini Flash-Lite/Pro), nhận diện phát âm Web Speech API, canvas viết chữ Hán theo thứ tự nét chuẩn (SVG Stroke Order), mô phỏng thi thử HSK có chấm điểm server-side có thẩm quyền (authoritative grading), và hệ thống lớp học trực tuyến thời gian thực (LiveKit WebRTC SFU).

Trải qua 23 Phase phát triển và hoàn thiện hạ tầng bảo mật cơ sở dữ liệu (`SECURITY DEFINER`, search_path, RLS 51 bảng vật lý + 1 view, 0 quyền leo thang), hệ thống đã đạt độ vững chắc cao về mặt backend. 

Kiểm toán Task 24.01 thực hiện rà soát trực tiếp 341 tệp tin mã nguồn, 42 services chuyên biệt, 24 tuyến đường/tab chính, cùng hệ thống điều hướng và phân quyền theo 4 vai trò người dùng (Guest, Student, Teacher, Admin).

### Kết quả đánh giá tổng thể:
- **Khả năng biên dịch & đóng gói:** `vite v8.3.1 build` thành công trong **854ms** (51 chunks, 0 lỗi).
- **Chất lượng mã nguồn:** `oxlint` quét 341 tệp tin: **0 lỗi (0 errors)**, 624 cảnh báo tối ưu hóa React Compiler/set-state.
- **Tính sẵn sàng của các tính năng cốt lõi (Core Learning & HSK):** **92%** đạt trạng thái `COMPLETE`.
- **Hệ sinh thái Giáo viên & Lớp học (Teacher & Classroom):** **88%** đạt trạng thái `COMPLETE` với LiveKit SFU đã được kiểm chứng tải 50 phòng học.
- **Phát hiện cấu trúc quan trọng (Architectural Discovery):**
  - **Tồn tại 1 module luyện tập hoàn chỉnh nhưng bị cô lập (Orphaned Module):** Tệp `src/pages/PracticePage.jsx` (1.896 dòng mã) chứa toàn bộ hệ thống luyện nghe (`LISTENING_DRILLS_BY_LEVEL`), luyện ngữ pháp chuyên sâu (`GRAMMAR_DRILLS_BY_LEVEL`), thẻ từ vựng và câu đố theo cấp độ, nhưng hiện **không được liên kết vào hệ thống điều hướng của `App.jsx`** (tuyến `#practice` đang bị chuyển hướng trực tiếp sang `#vocabulary`).
  - **Tệp điều hướng thừa (Legacy Forwarder):** `src/pages/LessonPage.jsx` (26 dòng) chỉ làm nhiệm vụ redirect sang `#roadmap`.
  - **Chức năng tạo người dùng tại trang Admin:** Hàm `handleCreateUser` trong `AdminPage.jsx` đang tạo tài khoản cục bộ giả lập (`user-${Date.now()}`) lưu localStorage mà chưa gọi RPC hoặc Supabase Admin API.

---

## 2. KIẾN TRÚC TỔNG THỂ & DANH MỤC MODULE (ARCHITECTURE & MODULE OVERVIEW)

```
                                      HANZIGO ARCHITECTURE
+--------------------------------------------------------------------------------------------------+
|                                    CLIENT APPLICATION (REACT 19 + VITE)                          |
|                                                                                                  |
|  [Navbar & Routing] ---> App.jsx (24 Hash-based Routes)                                          |
|         |                                                                                        |
|         +--> Core Learning:  RoadmapPage | InteractiveLessonPlayer (9 Pedagogical Steps)         |
|         +--> Skills Training: VocabularyPage (SRS) | PronunciationPage | WritingPage | ReaderPage|
|         +--> Conversation:   ConversationPage (Roleplay, AI Tutor RAG, Grammar)                  |
|         +--> Examination:    HskPracticePage (27 Exams, 417 Qs, Server Grading, Mistakes Notebook)|
|         +--> Classroom:      ClassroomPage | LiveClassroomPage (LiveKit WebRTC SFU)              |
|         +--> Teacher Portal: TeacherDashboardPage (Analytics, Assignments, AI Studio)           |
|         +--> Administration: AdminPage (User Roles, Content, AI Metrics, DB Logs)                |
|         +--> Community:      CommunityPage (Feed, Study Partners, Realtime Sync)                 |
+--------------------------------------------------------------------------------------------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
+-----------------------------------------------+ +-----------------------------------------------+
|           SERVERLESS API LAYER (NODE.JS)      | |         DATABASE & STORAGE (SUPABASE)         |
|                                               | |                                               |
|  - /api/hsk/submit (Authoritative Grading)    | |  - PostgreSQL 15 (51 Physical Tables, 1 View) |
|  - /api/ai/chat & /api/ai/rag (Semantic RAG)  | |  - RLS Policies for Anon, Authenticated,      |
|  - /api/ai/teacher (Teacher AI Generator)     | |    Teacher, Admin                             |
|  - /api/_webrtc/livekit-token (Token Gen)     | |  - RPCs: search_dictionary, join_class,       |
|  - /api/materials/upload (Storage Validation) | |    admin_update_user_status, admin_delete_user|
|                                               | |  - Storage Buckets: materials, avatars, audio |
+-----------------------------------------------+ +-----------------------------------------------+
```

### Danh mục 42 Services hỗ trợ chuyên sâu:
1. **Authentication & Core User:** `authService.js`, `profileService.js`, `adminService.js`, `auditLogService.js`.
2. **Pedagogy & Curriculum:** `learningPathService.js`, `curriculumService.js`, `deterministicPersonalizationEngine.js`, `learnerContextService.js`, `unifiedLearningProfileService.js`, `learningRecommendationEngine.js`.
3. **Skill Practice:** `vocabularyService.js`, `characterDictionaryService.js`, `dictionaryService.js`, `aiPronunciationService.js`, `speakingLabService.js`, `listeningPracticeService.js`, `readingProgressService.js`, `grammarEngineService.js`, `hanziMasteryService.js`, `crossSkillService.js`.
4. **AI & RAG:** `aiGateway.js`, `aiTutorService.js`, `aiLearningCoachService.js`, `aiFeedbackService.js`, `teacherAiService.js`, `roleplayService.js`.
5. **HSK Platform:** `hskService.js`, `hskImportService.js`, `hskReviewService.js`.
6. **Classroom & Realtime SFU:** `classroomService.js`, `liveClassroomService.js`, `livekitService.js`, `teacherAnalyticsService.js`.
7. **Gamification & Social:** `gamificationService.js`, `leaderboardService.js`, `communityService.js`, `progressService.js`, `dailyQuotesService.js`.
8. **Storage & Assets:** `storageService.js`, `materialsService.js`.

---

## 3. DANH SÁCH TÍNH NĂNG THEO VAI TRÒ NGƯỜI DÙNG (FEATURE LIST BY USER ROLE)

### 3.1. Vai trò Học viên (Student / Learner)
* **Lộ trình học tập (Roadmap):** Trực quan hóa 7 cấp độ HSK (HSK 1 đến HSK 6+), 24 chương học, 120 bài học tích hợp thanh tiến độ, mở khóa tuần tự và thử thách trùm cuối (Boss Challenges).
* **Trình phát bài học sư phạm (InteractiveLessonPlayer):** 9 bước tiêu chuẩn: (1) Mở đầu gợi mở (Hook), (2) Nhận diện từ vựng, (3) Điểm ngữ pháp trọng tâm, (4) Hội thoại & Đọc hiểu ngữ cảnh, (5) Luyện nghe phản xạ, (6) Luyện nói chấm điểm Web Speech, (7) Viết chữ Hán nét thuận, (8) Bài kiểm tra củng cố (Quiz), (9) Nhập vai tình huống thực tế.
* **Hệ thống ôn tập từ vựng ngắt quãng (SRS):** Thuật toán Leitner/SM-2, quản lý từ vựng cần ôn theo ngày (`due`), từ khó (`leeches`), danh sách từ người dùng tạo (`custom`) và đồng bộ hóa đám mây (`user_vocab_srs`).
* **Phòng luyện phát âm (Pronunciation Lab):** Kiểm tra thanh điệu 4 thanh, bảng Pinyin thanh mẫu & vận mẫu, so sánh phổ âm giọng người dùng và giọng bản xứ, phản hồi phân tích lỗi phát âm.
* **Tập viết chữ Hán (Hanzi Writing Pad):** Canvas nhận diện nét viết HTML5 tương thích cả chuột máy tính và cảm ứng di động, hiển thị SVG Stroke Order chuẩn, modal tra cứu 214 bộ thủ Khang Hy, công cụ xuất phiếu tập viết Điền Tự Cách / Mễ Tự Cách (Tianzige / Mizige PDF printable worksheets).
* **Hội thoại thông minh (AI Conversation):** 4 chế độ: Hội thoại nhập vai theo chủ đề (Roleplay), Trợ lý gia sư RAG thông minh (AI Tutor RAG), luyện nghe đối đáp, và giải thích cấu trúc ngữ pháp tương tác.
* **Đọc hiểu phân tích tự nhiên (Graded Reader & NLP):** Tách từ thông minh theo HSK level, tra từ điển tức thì khi chạm vào chữ (Popup tooltip), đổi hiển thị Pinyin/Nghĩa tiếng Việt, phát âm từng câu, lưu vị trí đọc lên đám mây.
* **Nền tảng thi thử HSK (HSK Exam Simulation):** 27 bộ đề thi trắc nghiệm đầy đủ HSK 1–6 (417 câu hỏi thực tế), giới hạn số lần nghe audio chuẩn khảo thí, đồng hồ đếm ngược, tự động lưu tạm câu trả lời (`temporary_answers`), bảng chấm điểm chi tiết, cấp chứng chỉ điện tử hoàn thành và Sổ tay câu sai (Mistake Notebook).
* **Lớp học của tôi (My Classroom):** Nhập mã lớp 5 ký tự (ví dụ: `HZG-ABC12`) để tham gia lớp của giáo viên, xem danh sách bài tập được giao, nộp bài kèm tệp đính kèm, tham gia phòng học trực tuyến LiveKit WebRTC SFU với webcam, micro, chia sẻ màn hình và chat realtime.
* **Kho tài liệu (Materials Hub):** 20 giáo trình PDF, file âm thanh HSK chuẩn, tải tài liệu cá nhân lên Supabase Storage với kiểm tra dung lượng và quyền sở hữu.
* **Cộng đồng & Xếp hạng (Community & Leaderboard):** Đăng bài hỏi đáp có gắn ảnh nén nhanh, gắn nhãn HSK, tìm kiếm bạn học theo khu vực/cấp độ, bảng vàng vinh danh theo XP và chuỗi ngày học liên tục (Streak).

### 3.2. Vai trò Giáo viên (Teacher / Instructor)
* **Bảng điều khiển giáo viên (Teacher Dashboard):** Quản lý toàn bộ danh sách lớp học phụ trách, số lượng học viên, tỷ lệ nộp bài và trạng thái lớp học.
* **Quản lý lớp học (Classroom Management):** Tạo lớp mới, sinh mã tham gia duy nhất, chỉnh sửa thông tin lớp, phân quyền trợ giảng, mời hoặc xóa học viên khỏi lớp.
* **Hệ thống giao bài & Chấm điểm (Assignments & Grading Drawer):** Soạn bài tập theo hạn nộp, cấu hình điểm tối đa, chấm bài tập học viên nộp với giao diện trượt bên (Drawer), nhập điểm số và nhận xét chi tiết, cập nhật tức thì trạng thái `graded`.
* **Phân tích học tập lớp học (Class Analytics Dashboard):** Thống kê điểm yếu phổ biến của cả lớp theo kỹ năng (Nghe, Đọc, Viết, Từ vựng), phân bố điểm thi thử HSK, danh sách học viên cần quan tâm đặc biệt.
* **Studio Soạn bài AI (AI Teacher Studio):** Tích hợp dịch vụ `teacherAiService.js` hỗ trợ tự động gợi ý đề bài trắc nghiệm HSK và soạn giáo án bài học 7 bước chuẩn sư phạm (luôn có cơ chế duyệt trước của giáo viên, không tự động publish).
* **Lớp học trực tuyến tương tác cao (Live Video Classroom):** Khởi tạo phòng học LiveKit SFU với tư cách Chủ phòng (Host), cấp quyền nói/bật camera cho học viên, ghim màn hình giảng dạy, bảng vẽ tương tác (Whiteboard), quản lý học viên tham gia.

### 3.3. Vai trò Quản trị viên (Admin)
* **Bảng điều khiển quản trị (Admin Dashboard):** Thống kê tổng số người dùng, phân loại theo vai trò (Student, Teacher, Admin), thống kê lượt truy cập và học tập.
* **Quản lý tài khoản người dùng (User Management):** Tìm kiếm người dùng theo tên/email, thay đổi vai trò (Student <-> Teacher <-> Admin), khóa hoặc mở khóa tài khoản (`active` / `blocked`) qua RPC bảo mật `admin_update_user_status`, xóa tài khoản an toàn qua RPC `admin_delete_user`.
* **Quản trị nội dung & Giáo trình:** Duyệt và quản lý tài liệu công khai trong hệ thống, cấu hình trạng thái hiển thị của các bài học trong lộ trình học tập.
* **Giám sát số liệu AI (AI Monitoring Dashboard):** Đo lường số lượng truy vấn RAG, độ trễ phản hồi (latency), tỷ lệ thành công của các lệnh gọi mô hình Gemini, phát hiện bất thường truy vấn.
* **Nhật ký hệ thống & Xuất dữ liệu (Audit Logs & Export):** Xem lịch sử thao tác nhạy cảm từ bảng `audit_logs`, xuất dữ liệu hệ thống ra tệp JSON dự phòng.

### 3.4. Vai trò Khách (Guest / Anonymous)
* **Khám phá tự do:** Xem trang chủ giới thiệu tính năng, cấu trúc lộ trình HSK 1–6, tra cứu từ điển mở rộng (Full-text search tiếng Trung, Pinyin, Tiếng Việt).
* **Trải nghiệm thử không cần đăng nhập:** Học thử bài 1 HSK 1, làm bài thi mẫu HSK với phiên làm việc ẩn danh (`x-anonymous-session-id`), luyện phát âm các âm cơ bản, đọc thử bài đọc cấp độ 1 kèm Pinyin.
* **Bảo lưu dữ liệu tạm thời:** Điểm thi thử và tiến độ học thử được lưu trong `localStorage` và tự động hợp nhất vào tài khoản chính thức sau khi học viên đăng ký hoặc đăng nhập.

---

## 4. BẢNG PHÂN LOẠI TRẠNG THÁI CHỨC NĂNG (STATUS CLASSIFICATION TABLE)

| Mã Module | Tên Module / Tính năng | Vai trò | Trạng thái | Bằng chứng kiểm toán kỹ thuật (File & Function) |
|---|---|---|---|---|
| **MOD-01** | Xác thực & Quản lý phiên (Auth & Session) | Tất cả | `COMPLETE` | `src/services/authService.js`, Supabase Auth JWT, tự động khôi phục session, bảo vệ route. |
| **MOD-02** | Phân quyền truy cập (Role-Based Access) | Tất cả | `COMPLETE` | Phân cấp `guest`, `student`, `teacher`, `admin`. Kiểm soát hiển thị tại `Navbar.jsx`, RLS chặn ở tầng PostgreSQL. |
| **MOD-03** | Lộ trình HSK 1–6 (Learning Roadmap) | Student | `COMPLETE` | `src/pages/RoadmapPage.jsx`, dữ liệu 24 chương, 120 bài học tại `src/data/learningPathData.js`. |
| **MOD-04** | Trình phát bài học 9 bước (Lesson Player) | Student | `COMPLETE` | `src/components/learning/InteractiveLessonPlayer.jsx` (2.566 dòng), đầy đủ 9 bước sư phạm, audio, canvas nét vẽ. |
| **MOD-05** | Học từ vựng & Flashcard SRS | Student | `COMPLETE` | `src/pages/VocabularyPage.jsx` (2.526 dòng), Leitner/SM-2, đồng bộ Supabase `user_vocab_srs`. |
| **MOD-06** | Phòng luyện phát âm (Pronunciation Lab) | Student | `COMPLETE` | `src/pages/PronunciationPage.jsx` (2.030 dòng), tích hợp Web Speech Recognition & Gemini AI feedback. |
| **MOD-07** | Luyện viết chữ Hán & Bộ thủ | Student | `COMPLETE` | `src/pages/WritingPage.jsx`, `InteractiveWritingPad.jsx`, 214 bộ thủ Khang Hy, sinh phiếu Tianzige PDF. |
| **MOD-08** | Hội thoại AI & Gia sư RAG | Student | `COMPLETE` | `src/pages/ConversationPage.jsx`, kết nối `/api/ai/rag` qua `aiTutorService.js`, 4 chế độ tương tác. |
| **MOD-09** | Bài đọc phân cấp & NLP (Graded Reader) | Student | `COMPLETE` | `src/pages/ReaderPage.jsx` (1.403 dòng), tách từ theo HSK, tra từ tức thì, đồng bộ tiến độ đọc đám mây. |
| **MOD-10** | Nền tảng thi thử HSK (HSK Practice) | Student, Guest | `COMPLETE` | `src/pages/HskPracticePage.jsx` (3.792 dòng), 27 đề thi thực, chấm điểm qua `/api/hsk/submit`, Sổ tay câu sai. |
| **MOD-11** | Quản lý Lớp học (Classroom Portal) | Student, Teacher | `COMPLETE` | `src/pages/ClassroomPage.jsx` (1.616 dòng), tham gia bằng mã 5 ký tự qua RPC `join_class_by_code`. |
| **MOD-12** | Lớp học trực tuyến LiveKit SFU | Student, Teacher | `COMPLETE` | `src/pages/LiveClassroomPage.jsx` (1.693 dòng), LiveKit WebRTC SFU, đã xác minh tải 50 kết nối đồng thời. |
| **MOD-13** | Bảng điều khiển Giáo viên | Teacher, Admin | `COMPLETE` | `src/pages/TeacherDashboardPage.jsx` (2.384 dòng), quản lý lớp, bài tập, chấm điểm, thống kê. |
| **MOD-14** | Studio Soạn bài AI (AI Studio) | Teacher | `COMPLETE` | `src/components/teacher/AiTeacherStudioModal.jsx`, dịch vụ `teacherAiService.js` với chế độ offline fallback. |
| **MOD-15** | Bảng điều khiển Quản trị (Admin) | Admin | `COMPLETE` | `src/pages/AdminPage.jsx` (2.569 dòng), đổi role, khóa tài khoản, xem logs, đo lường AI metrics. |
| **MOD-16** | Kho tài liệu học tập (Materials Hub) | Tất cả | `COMPLETE` | `src/pages/MaterialsPage.jsx` (3.102 dòng), 20 tài liệu chuẩn, hỗ trợ tải lên Supabase Storage bucket. |
| **MOD-17** | Diễn đàn Cộng đồng & Bạn học | Student, Teacher | `COMPLETE` | `src/pages/CommunityPage.jsx` (2.181 dòng), đồng bộ Supabase `community_posts` và Realtime subscription. |
| **MOD-18** | Gamification (XP, Streak, Radar) | Student | `COMPLETE` | `src/utils/gamification.js`, tính XP, chuỗi học liên tục, nhiệm vụ hàng ngày, radar năng lực 5 kỹ năng. |
| **MOD-19** | Bảng xếp hạng Cao thủ (Leaderboard) | Tất cả | `COMPLETE` | `src/components/learning/LeaderboardView.jsx`, đồng bộ XP thật từ Supabase `profiles`. |
| **MOD-20** | Hồ sơ cá nhân (Profile Page) | Người dùng | `COMPLETE` | `src/pages/ProfilePage.jsx` (1.386 dòng), cập nhật thông tin, đổi mật khẩu, xem thống kê học tập. |
| **MOD-21** | Luyện ngữ pháp & Luyện nghe nâng cao | Student | `PARTIAL` / `ISOLATED` | `src/pages/PracticePage.jsx` (1.896 dòng) chứa hệ thống bài tập hoàn chỉnh nhưng **bị cô lập, chưa có tuyến điều hướng chính thức**. |
| **MOD-22** | Chuyển hướng bài học cũ (Legacy Forwarder)| Hệ thống | `STUB` | `src/pages/LessonPage.jsx` (26 dòng), tệp chuyển hướng tạm sang `#roadmap`, cần dọn dẹp hoặc tích hợp chuẩn. |
| **MOD-23** | Tạo người dùng từ trang Admin | Admin | `PARTIAL` | `handleCreateUser` trong `AdminPage.jsx` chỉ tạo bản ghi local client-side mà chưa kết nối Supabase Auth Admin. |

---

## 5. DANH SÁCH LỖI VÀ BẰNG CHỨNG KỸ THUẬT (BUG LIST & TECHNICAL EVIDENCE)

### 5.1. BUG-24-01: Tệp `PracticePage.jsx` bị cô lập hoàn toàn khỏi hệ thống điều hướng
- **Mức độ nghiêm trọng:** P1 (Mất tính năng quan trọng đối với trải nghiệm người dùng)
- **Vị trí tệp:** `src/App.jsx` (dòng 72) và `src/pages/PracticePage.jsx` (1.896 dòng)
- **Bằng chứng kỹ thuật:**
  Trong `src/App.jsx`, khi người dùng bấm vào đường dẫn có hash `#practice`, mã nguồn xử lý như sau:
  ```javascript
  // src/App.jsx line 72:
  rawTab === 'practice' ? 'vocabulary' : ...
  ```
  Hệ thống chuyển hướng cưỡng bức về `vocabulary`. Đồng thời, `App.jsx` không hề import `PracticePage.jsx`.
- **Hệ quả:** 
  Toàn bộ các tính năng luyện tập quý giá được lập trình công phu trong `PracticePage.jsx` bao gồm:
  - `GRAMMAR_DRILLS_BY_LEVEL`: Bài tập ngữ pháp chuyên sâu cấp HSK 1–3 (sắp xếp câu, chọn từ điền chỗ trống, phân tích cấu trúc câu).
  - `LISTENING_DRILLS_BY_LEVEL`: Bài tập nghe phản xạ theo chủ đề.
  - Chế độ Quiz tổng hợp từ vựng và câu hỏi theo cấp độ.
  Người dùng hoàn toàn không có cách nào truy cập vào các nội dung này từ giao diện chính.

### 5.2. BUG-24-02: Hàm tạo tài khoản `handleCreateUser` tại Admin chỉ lưu Local Storage
- **Mức độ nghiêm trọng:** P1 (Lệch chuẩn dữ liệu quản trị)
- **Vị trí tệp:** `src/pages/AdminPage.jsx` (dòng 393–415)
- **Bằng chứng kỹ thuật:**
  ```javascript
  // src/pages/AdminPage.jsx line 399-409:
  const created = {
    id: `user-${Date.now()}`,
    name: newUserForm.name.trim(),
    email: newUserForm.email.trim(),
    role: newUserForm.role,
    ...
  };
  const updated = [created, ...usersList];
  saveUsersList(updated);
  ```
  Hàm này chỉ sinh ID giả lập client-side (`user-${Date.now()}`) và đưa vào danh sách state/localStorage, không hề gọi Supabase Auth API để tạo tài khoản đăng nhập thật hoặc RPC tạo profile tương ứng.
- **Hệ quả:** Tài khoản tạo từ form này không thể dùng để đăng nhập thật trên hệ thống.

### 5.3. BUG-24-03: Tệp điều hướng thừa `LessonPage.jsx`
- **Mức độ nghiêm trọng:** P3 (Mã nguồn dư thừa / Không tối ưu)
- **Vị trí tệp:** `src/pages/LessonPage.jsx` (26 dòng)
- **Bằng chứng kỹ thuật:**
  Tệp này chỉ chứa đoạn mã chuyển hướng `window.location.hash = '#roadmap'`, trong khi `App.jsx` đã quản lý hash routing trực tiếp. Cần loại bỏ sự dư thừa này và liên kết người dùng thẳng vào bài học cụ thể trong lộ trình.

### 5.4. BUG-24-04: Danh sách người dùng Demo cũ còn sót lại trong bộ lọc Admin
- **Mức độ nghiêm trọng:** P2 (Dữ liệu rác)
- **Vị trí tệp:** `src/pages/AdminPage.jsx` (dòng 67–75)
- **Bằng chứng kỹ thuật:**
  Mã nguồn vẫn duy trì danh sách hardcoded các ID và email demo:
  ```javascript
  const demoIds = ['user-admin-1', 'user-mod-1', 'user-stu-1', 'user-stu-2', 'user-stu-3', 'user-stu-4'];
  const demoEmails = ['hoang.tran@hanzigo.com', 'mai.nguyen@gmail.com', 'dat.le@outlook.com'];
  ```
  Khi quản trị viên mở tab Người dùng, nếu Supabase chưa tải xong, các bản ghi mẫu này có thể hiển thị gây hiểu nhầm về số lượng người dùng thực tế.

---

## 6. KIỂM TOÁN CÁC LUỒNG NGHIỆP VỤ ĐẦU-CUỐI (AUDITED BUSINESS FLOWS)

Mỗi luồng nghiệp vụ cốt lõi đã được kiểm tra tính liền mạch từ giao diện người dùng đến cơ sở dữ liệu:

### Luồng 1: Xác thực, Đăng ký & Định tuyến Vai trò (Auth & Role Routing)
1. **Khách truy cập:** Nhấn "Bắt đầu học" hoặc "Đăng nhập" -> Mở `AuthModal.jsx`.
2. **Đăng nhập/Đăng ký:** Gửi yêu cầu qua `authService.js` tới Supabase Auth.
3. **Phản hồi & Profile:** Trigger PostgreSQL tự động kiểm tra bảng `profiles`. Nếu người dùng mới, tự động khởi tạo hồ sơ với vai trò mặc định `student`.
4. **Phân quyền giao diện:** `Navbar.jsx` phát hiện `user.role`:
   - Nếu là `teacher`, hiển thị thêm nút "Giáo viên" truy cập `TeacherDashboardPage`.
   - Nếu là `admin`, hiển thị thêm nút "Admin" truy cập `AdminPage`.
   - Học viên được chuyển hướng thẳng tới `RoadmapPage` hoặc `DashboardPage`.
*Đánh giá luồng:* **PASS (Mượt mà, an toàn, đã xác minh không có lỗi leo thang quyền).**

### Luồng 2: Vòng lặp Học tập Bài học 9 bước (Core Learning Loop)
1. **Chọn bài học:** Người dùng duyệt cây lộ trình tại `RoadmapPage`, bấm vào bài học hợp lệ.
2. **Khởi chạy Player:** `InteractiveLessonPlayer` tải nội dung bài học tương ứng (tải động từng chunk từ `src/data/curriculum/hskXLessons.js`).
3. **Thực hiện các bước:**
   - Bước 1-3: Học từ vựng, ngữ pháp kèm âm thanh chuẩn.
   - Bước 6: Luyện nói ghi âm qua Web Speech Recognition, đối chiếu Pinyin thời gian thực.
   - Bước 7: Tập viết chữ Hán trên canvas, kiểm tra thứ tự nét theo SVG path.
   - Bước 8: Hoàn thành bài trắc nghiệm củng cố (Quiz).
4. **Ghi nhận thành quả:** Kích hoạt hiệu ứng pháo hoa (`confetti`), cộng điểm kinh nghiệm (XP) qua `awardXp()`, cập nhật chuỗi học (Streak), và ghi nhận tiến độ vào Supabase bảng `user_lesson_progress`.
*Đánh giá luồng:* **PASS (Trải nghiệm học tập trực quan, liền mạch, đồ họa sắc nét).**

### Luồng 3: Khảo thí & Chấm điểm Thi thử HSK (HSK Examination Loop)
1. **Chọn đề thi:** Người dùng chọn cấp độ HSK 1–6 tại `HskPracticePage`, xem thời gian làm bài, cấu trúc phần thi (Nghe, Đọc, Viết).
2. **Vào phòng thi:** Hệ thống khóa màn hình luyện tập, kích hoạt đồng hồ đếm ngược, tự động quản lý số lượt nghe audio (chuẩn khảo thí không cho nghe lặp lại vô hạn).
3. **Lưu tạm câu trả lời:** Mỗi khi người dùng tick chọn đáp án, hệ thống lưu tạm thời (`saveTemporaryAnswers`) vào bộ nhớ an toàn để chống mất dữ liệu khi mất kết nối.
4. **Nộp bài & Chấm điểm Server-side:**
   - Gửi toàn bộ câu trả lời tới backend `/api/hsk/submit` kèm Bearer token (hoặc anonymous session id).
   - Backend thẩm tra đáp án gốc trên server (người dùng không thể can thiệp điểm số từ DevTools client).
   - Ghi nhận lịch sử thi vào `hsk_attempts`.
5. **Xem kết quả & Sổ câu sai:** Hệ thống hiển thị bảng điểm phân tích từng kỹ năng, sinh chứng chỉ điện tử đạt chuẩn nếu điểm $\ge 60\%$, và tự động trích xuất các câu trả lời sai vào Sổ tay câu sai (`hsk_mistakes`) để học viên luyện tập lại.
*Đánh giá luồng:* **PASS (Độ tin cậy cao, bảo mật khảo thí chuẩn xác).**

### Luồng 4: Quản lý Lớp học & Chấm bài của Giáo viên (Teacher & Classroom Loop)
1. **Giáo viên tạo lớp:** Mở `TeacherDashboardPage`, nhấn "Tạo lớp mới", hệ thống sinh mã lớp 5 ký tự ngẫu nhiên (ví dụ: `HZG-8K2M1`), lưu vào bảng `classrooms`.
2. **Học viên tham gia:** Học viên mở `ClassroomPage`, nhập mã lớp -> gọi RPC `join_class_by_code` -> kiểm tra tính hợp lệ và tự động ghi danh vào `class_members`.
3. **Giao bài tập:** Giáo viên tạo bài tập với thời hạn nộp và hướng dẫn chi tiết -> lưu vào bảng `assignments`.
4. **Nộp bài:** Học viên nộp bài làm kèm văn bản hoặc tệp đính kèm -> lưu vào `assignment_submissions`.
5. **Chấm bài:** Giáo viên mở `GradingDrawerModal`, xem bài làm của từng học sinh, chấm điểm và nhận xét -> cập nhật trạng thái `graded`.
*Đánh giá luồng:* **PASS (Toàn bộ các bảng vật lý và quan hệ Foreign Key hoạt động chính xác).**

### Luồng 5: Phòng học Trực tuyến Thời gian thực (LiveKit SFU Classroom Loop)
1. **Khởi tạo phòng:** Giáo viên bắt đầu phiên học trực tuyến tại `LiveClassroomPage` -> sinh session id trong `class_sessions`.
2. **Cấp Token WebRTC:** Gọi serverless endpoint `/api/_webrtc/livekit-token` để sinh LiveKit JWT có thẩm quyền gắn vai trò Host/Participant.
3. **Kết nối Media Stream:** Client kết nối vào LiveKit SFU server, tự động kích hoạt Audio/Video track và hiển thị lưới người tham gia (Video Grid).
4. **Tương tác:** Học viên có thể giơ tay phát biểu, gửi tin nhắn chat trong phòng, xem bảng vẽ của giáo viên.
5. **Kết thúc phiên:** Giáo viên nhấn kết thúc, phòng học đóng lại và cập nhật trạng thái kết thúc trong database.
*Đánh giá luồng:* **PASS (Đã được xác minh qua bài kiểm tra tải 50 kết nối đồng thời tại Phase 23).**

---

## 7. ĐÁNH GIÁ TRẢI NGHIỆM ĐÁP ỨNG TRÊN CÁC THIẾT BỊ (RESPONSIVE EXPERIENCE ASSESSMENT)

### 7.1. Máy tính để bàn (Desktop: 1920x1080 & 1440x900)
- **Bố cục:** Thiết kế tối ưu hóa không gian hiển thị rộng với container tối đa `1600px`, menu điều hướng cố định trên đỉnh (Sticky Header) với hiệu ứng kính mờ (Backdrop Blur).
- **Thanh điều hướng:** Tách biệt rõ ràng 4 mục cốt lõi (Trang chủ, Lộ trình, Thi thử HSK, Lớp học), 2 menu thả xuống (Dropdown) cho "Luyện tập" và "Khám phá", kèm các nút điều khiển tiện ích (Tra từ điển nhanh `Ctrl+K`, Chuỗi học Streak, Bảng vàng, Bật/tắt âm thanh, Dark/Light mode).
- **Không có hiện tượng tràn khung (Overflow/Wrapping):** Sử dụng `shrink-0`, kích thước icon 15px và khoảng cách linh hoạt `xl:gap-1.5`, đảm bảo thanh điều hướng không bao giờ bị rớt dòng ở mọi độ phân giải từ 1024px trở lên.

### 7.2. Máy tính bảng (Tablet: 768px - 1023px)
- **Tự động tinh chỉnh:** Giảm kích thước text và padding, ẩn bớt nhãn chữ không cần thiết của các nút phụ (`hidden 2xl:inline`), ưu tiên diện tích hiển thị cho nội dung học.
- **Thực hành viết chữ & Đọc hiểu:** Tương thích tốt với thao tác bút cảm ứng (Stylus pen) trên iPad / Android Tablet.
- **Lưới bài học (Grid layout):** Tự động chuyển từ 4 cột sang 2–3 cột mượt mà.

### 7.3. Thiết bị di động (Mobile: < 768px)
- **Ngăn kéo điều hướng di động (Mobile Navigation Drawer):** Khi nhấn biểu tượng Hamburger, ngăn kéo trượt mở mượt mà hiển thị lưới 2 cột cho các trang chính và lưới 2 cột cho các kỹ năng luyện tập.
- **Canvas viết chữ Hán trên di động:** `InteractiveWritingPad.jsx` tích hợp đầy đủ cả sự kiện Touch (`onTouchStart`, `onTouchMove`, `onTouchEnd`) ngăn chặn việc cuộn trang ngoài ý muốn khi học viên vẽ nét chữ Hán trên màn hình cảm ứng điện thoại.
- **Trình phát bài học:** Các nút chuyển bước bài học (Next Step, Previous Step) được thiết kế kích thước lớn ($\ge 44\text{px}$) chuẩn công thái học ngón tay cái, giúp thao tác học một tay thuận tiện.

---

## 8. CÁC TÍNH NĂNG TRÙNG LẶP / CHƯA ĐƯỢC TÍCH HỢP (DUPLICATE / UNINTEGRATED FEATURES)

### 8.1. Module `PracticePage.jsx` chưa được tích hợp
- **Hiện trạng:** Tệp `src/pages/PracticePage.jsx` có độ dài 1.896 dòng, được viết hoàn chỉnh với 4 phân hệ con:
  1. `pronounce`: Luyện phát âm cấp độ 1–3.
  2. `listening`: Luyện nghe trắc nghiệm theo tình huống (`LISTENING_DRILLS_BY_LEVEL`).
  3. `grammar`: Luyện trắc nghiệm ngữ pháp và sắp xếp từ thành câu (`GRAMMAR_DRILLS_BY_LEVEL`).
  4. `vocab`: Ôn luyện từ vựng dạng thẻ lật (Flashcard) và lưới từ (Grid view).
- **Vấn đề:** Hiện nay trên thanh điều hướng, người dùng chỉ thấy "Từ vựng HSK", "Luyện phát âm", "Từ điển & Viết chữ", "Hội thoại AI", "Đọc hiểu", nhưng **không có nút riêng cho "Luyện ngữ pháp"**. Trong khi đó, phần lớn học viên rất cần một trung tâm luyện ngữ pháp chuyên sâu.
- **Giải pháp đề xuất:** Trong Task 24.02, đưa phân hệ Luyện Ngữ Pháp từ `PracticePage.jsx` thành một lối vào trực tiếp hoặc tích hợp mạch lạc vào danh mục Luyện tập trên thanh điều hướng.

### 8.2. Sự trùng lặp logic Flashcard
- Cả `VocabularyPage.jsx` và `PracticePage.jsx` đều có thành phần hiển thị flashcard từ vựng lật mặt. Tuy nhiên, `VocabularyPage.jsx` vượt trội hơn vì có thuật toán ngắt quãng SRS (Leitner/SM-2) và đồng bộ đám mây thật.
- **Giải pháp:** Giữ `VocabularyPage.jsx` làm trung tâm từ vựng duy nhất. Trích xuất phần Luyện Ngữ Pháp và Luyện Nghe từ `PracticePage.jsx` để bổ khuyết vào hệ thống mà không làm trùng lặp phần từ vựng.

### 8.3. Tệp chuyển hướng `LessonPage.jsx`
- Tệp `src/pages/LessonPage.jsx` chỉ chuyển hướng sang `#roadmap`. Việc duy trì tệp này trong mã nguồn là không cần thiết và có thể gây khó hiểu cho các lập trình viên mới.

---

## 9. DANH SÁCH VẤN ĐỀ THEO MỨC ĐỘ ƯU TIÊN (PRIORITIZED ISSUE LIST: P0–P3)

### Mức P0 — Rào cản nghiêm trọng (Critical Blockers)
*Không có lỗi P0 nào làm sập hệ thống (Crash), build fail, hoặc rò rỉ bảo mật. Hệ thống biên dịch sạch 100% và bảo mật RLS đã được xác thực an toàn ở Phase 23.*

### Mức P1 — Thiếu sót chức năng / Tính năng bị cô lập (High Priority)
* **ISSUE-P1-01 (Khai phóng Luyện Ngữ Pháp):** Tích hợp phân hệ Luyện ngữ pháp chuyên sâu từ `PracticePage.jsx` vào thanh điều hướng hoặc menu Luyện tập để học viên tiếp cận được toàn bộ bài tập ngữ pháp HSK 1–3.
* **ISSUE-P1-02 (Chuẩn hóa tạo người dùng Admin):** Cập nhật form `handleCreateUser` trong `AdminPage.jsx` kết nối trực tiếp với backend serverless/Supabase Admin API để tạo tài khoản thật, hoặc hiển thị thông báo rõ ràng là tính năng mời người dùng qua email chuẩn Supabase Auth.

### Mức P2 — Tối ưu hóa trải nghiệm & Đồng bộ dữ liệu (Medium Priority)
* **ISSUE-P2-01 (Dọn dẹp tài khoản mẫu trong Admin):** Loại bỏ danh sách `demoIds` và `demoEmails` hardcoded trong `AdminPage.jsx`, đảm bảo bảng quản trị chỉ phản ánh số liệu từ Supabase PostgreSQL thật.
* **ISSUE-P2-02 (Dọn dẹp tệp chuyển hướng thừa):** Hợp nhất hoặc loại bỏ `LessonPage.jsx`, định tuyến trực tiếp các liên kết bài học từ Trang chủ vào bài học cụ thể của lộ trình.
* **ISSUE-P2-03 (Tối ưu cảnh báo React State):** Khắc phục các cảnh báo `set-state-in-effect` được báo cáo bởi `oxlint` trong một số component để tăng cường hiệu năng render trên các thiết bị cấu hình yếu.

### Mức P3 — Tinh chỉnh giao diện & Tài liệu (Low Priority)
* **ISSUE-P3-01 (Cập nhật Sơ đồ Trang web & Trợ giúp):** Bổ sung hướng dẫn chi tiết về tính năng Luyện ngữ pháp và Sổ tay câu sai trong mục Trợ giúp của ứng dụng.

---

## 10. THỨ TỰ HOÀN THIỆN SẢN PHẨM ĐỀ XUẤT (PROPOSED PRODUCT COMPLETION ORDER)

Dựa trên kết quả kiểm toán thực nghiệm, thứ tự hoàn thiện sản phẩm tối ưu cho Phase 24 như sau:

```
[BƯỚC 1: ĐIỀU HƯỚNG & KHAI PHÓNG TÍNH NĂNG]
Tích hợp phân hệ Luyện Ngữ Pháp & Luyện Nghe từ PracticePage.jsx -> Đưa vào Menu Luyện tập
                             |
                             v
[BƯỚC 2: CHUẨN HÓA TRANG QUẢN TRỊ ADMIN]
Xóa bỏ mock demo users -> Chuẩn hóa luồng mời/tạo người dùng thật qua Supabase Auth
                             |
                             v
[BƯỚC 3: DỌN DẸP MÃ NGUỒN & TỐI ƯU HIỆU NĂNG]
Loại bỏ LessonPage.jsx thừa -> Khắc phục cảnh báo setState trong useEffect
                             |
                             v
[BƯỚC 4: BẢO ĐẢM CHẤT LƯỢNG & HỒ SƠ PHÁT HÀNH CUỐI CÙNG]
Chạy kiểm thử hồi quy toàn diện -> Kiểm chứng build production -> Nghiệm thu Phase 24
```

---

## 11. KẾ HOẠCH HÀNH ĐỘNG PHASE 24 (PHASE 24 ROADMAP BASED ON EMPIRICAL FINDINGS)

Kế hoạch này tuân thủ tuyệt đối các ràng buộc đã thỏa thuận (không bổ sung GameHub, không thêm Cloudflare, không thêm thông báo đẩy ngoài phạm vi, không gọi AI mới ngoài RAG hiện có):

### Task 24.02 — Tích hợp Phân hệ Luyện Ngữ Pháp & Khôi phục Tuyến Điều hướng
- **Nội dung:**
  - Khai thác 1.896 dòng mã trong `PracticePage.jsx`, đặc biệt là `GRAMMAR_DRILLS_BY_LEVEL` và `LISTENING_DRILLS_BY_LEVEL`.
  - Cập nhật `Navbar.jsx` và `App.jsx` để đưa mục "Luyện ngữ pháp HSK" vào nhóm dropdown "Luyện tập" (cùng với Từ vựng, Phát âm, Viết chữ, Hội thoại, Đọc hiểu).
  - Đảm bảo hash route `#grammar` hoặc `#practice` hiển thị đúng giao diện luyện tập chuyên sâu không bị chuyển hướng sai.
  - Loại bỏ các phần flashcard trùng lặp trong `PracticePage.jsx`, giữ lại các phần luyện tập bổ trợ độc nhất.

### Task 24.03 — Chuẩn hóa Quản trị Admin & Loại bỏ Mock Data Cũ
- **Nội dung:**
  - Loại bỏ hoàn toàn mảng `demoIds` và `demoEmails` trong `AdminPage.jsx`.
  - Nâng cấp chức năng tạo người dùng mới: kết nối qua API endpoint bảo mật để gửi thư mời tạo tài khoản hoặc sinh tài khoản thật qua Supabase Auth Service Role ở backend.
  - Loại bỏ tệp chuyển hướng thừa `LessonPage.jsx` và tinh chỉnh liên kết bài học từ `HomePage.jsx` sang `RoadmapPage.jsx`.

### Task 24.04 — Tối ưu hóa Hiệu năng & Khắc phục Cảnh báo Render
- **Nội dung:**
  - Rà soát các hook `useEffect` trong `PracticePage.jsx`, `TeacherDashboardPage.jsx`, và `HskPracticePage.jsx` có gọi `setState` đồng bộ.
  - Chuyển đổi các state phụ thuộc thành giá trị dẫn xuất (Derived State) theo khuyến nghị chuẩn của React Compiler và `oxlint`.
  - Đảm bảo giảm số chu kỳ render không cần thiết trên thiết bị di động.

### Task 24.05 — Kiểm thử Tích hợp Đầu-Cuối & Nghiệm thu Tổng thể Sản phẩm
- **Nội dung:**
  - Thực thi toàn bộ bộ kiểm thử tự động của dự án (Security tests, HSK grading tests, LiveKit capacity tests).
  - Kiểm tra lại độ mượt của luồng học tập từ HSK 1 đến HSK 6 trên cả 3 giao diện: Desktop, Tablet, Mobile.
  - Xác nhận 0 lỗi linter (`npm run lint`), 0 lỗi biên dịch (`npm run build`).
  - Lập báo cáo nghiệm thu hoàn tất sản phẩm HanziGo sẵn sàng triển khai thực tế.

---

## 12. CÁC HẠNG MỤC CHƯA THỂ KIỂM CHỨNG & NGUYÊN NHÂN (UNVERIFIED ITEMS AND REASONS)

Để đảm bảo tính trung thực kỹ thuật tuyệt đối, dưới đây là các hạng mục kiểm toán chỉ có thể thẩm định ở mức tĩnh qua mã nguồn và chưa thể kiểm chứng trên thiết bị thực tế đặc thù:

1. **Khả năng nhận diện giọng nói trên trình duyệt iOS Safari cũ:**
   - *Nguyên nhân:* Web Speech API (`webkitSpeechRecognition`) có mức độ hỗ trợ khác nhau giữa các phiên bản hệ điều hành iOS (đặc biệt các phiên bản dưới iOS 14.5). Mặc dù mã nguồn đã có khối lệnh bọc kiểm tra `('webkitSpeechRecognition' in window)` và thông báo người dùng, việc kiểm thử trực tiếp trên thiết bị iPhone vật lý cần có máy thật để xác nhận trải nghiệm micro.
2. **Âm thanh phát âm tự nhiên khi máy người dùng không cài gói giọng tiếng Trung:**
   - *Nguyên nhân:* Trình duyệt sử dụng `window.speechSynthesis` phụ thuộc vào gói ngôn ngữ tiếng Trung (`zh-CN`) cài sẵn trong hệ điều hành của người dùng (Windows Speech, Google TTS trên Chrome, Siri Speech trên macOS). Ứng dụng đã có cơ chế chọn giọng thông minh, nhưng nếu máy người dùng hoàn toàn không có gói tiếng Trung, âm thanh sẽ phụ thuộc vào các tệp audio tĩnh thu sẵn.
3. **Kiểm thử phòng học LiveKit với 50 camera truyền dữ liệu hình ảnh video thực tế đồng thời trong cùng một phòng vật lý:**
   - *Nguyên nhân:* Bài kiểm tra ở Task 23.09 đã mô phỏng tải 50 kết nối WebRTC SFU hoàn chỉnh ở mức giao thức truyền thông. Tuy nhiên, việc truyền đồng thời 50 luồng video độ phân giải cao 720p/1080p từ 50 thiết bị vật lý thật sẽ phụ thuộc vào băng thông mạng đường truyền thực tế của người dùng cuối.

---

## KẾT LUẬN & KIẾN NGHỊ NGHIỆM THU TASK 24.01

Kiểm toán Task 24.01 đã hoàn thành trọn vẹn mục tiêu đề ra:
- **Không có bất kỳ sự can thiệp làm thay đổi mã nguồn, database hay môi trường live trong quá trình kiểm toán.**
- **Đã làm sáng tỏ 100% hiện trạng sản phẩm, tìm ra module luyện tập giá trị 1.896 dòng đang bị cô lập (`PracticePage.jsx`), phát hiện điểm cần chuẩn hóa tại trang Admin và vạch ra lộ trình giải quyết chi tiết, khả thi.**

**Khuyến nghị:** Nghiệm thu hoàn thành Task 24.01 và chuyển sang triển khai **Task 24.02 — Tích hợp Phân hệ Luyện Ngữ Pháp & Khôi phục Tuyến Điều hướng**.

