# BÁO CÁO AUDIT ĐỐI CHIẾU BACKEND–FRONTEND (PHASE 15)

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến cho người Việt  
**Giai đoạn:** Phase 15 — Backend–Frontend Integration & Feature Completion  
**Ngày thực hiện:** 25/10/2026  
**Phạm vi audit:** Toàn bộ API endpoints (`api/`), Database Schema & Migrations (`supabase/migrations/`), Frontend Services (`src/services/`), Pages (`src/pages/`), Components (`src/components/`).

---

## 1. Bảng đối chiếu Backend–Frontend Toàn Diện

Bảng đối chiếu dưới đây ghi nhận thực trạng chính xác dựa trên mã nguồn thực tế, kiểm tra từng endpoint, service và giao diện người dùng:

| Tính năng | Backend hiện trạng | Frontend hiện trạng | Nguồn dữ liệu | Vấn đề phát hiện trước tích hợp | Hướng xử lý đã triển khai |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lộ trình bài học HSK 1–6** | 120 bài học chuẩn (`curriculumLessons.js`, `curriculumLessonsHsk4to6.js`), 24 chương, 12 Boss Challenges | `RoadmapPage.jsx`, `InteractiveLessonPlayer.jsx` kết nối đầy đủ 120 bài học từ `l-101` đến `l-620` | `CURRICULUM_ALL_LESSONS` + Supabase `user_journey_progress` | Học viên học HSK 4–6 cần đảm bảo không dùng fallback bài học HSK 1 | Đã xác minh 100% 120 bài học có đầy đủ 9 bước sư phạm độc lập, không dùng fallback |
| **Ôn tập Flashcard & SM-2 SRS** | Schema `user_vocab_srs` trên Supabase; hàm tính toán SM-2 trong `srsEngine.js` | `VocabularyPage.jsx` có 3D Flashcard, 4 nút đánh giá (Again, Hard, Good, Easy) | `VOCABULARY_LIST` + `user_vocab_srs` + LocalStorage | Khi spam double-click nút đánh giá, `handleSrsRate` bị gọi nhiều lần gây cộng lặp XP; khi lọc thẻ cần ôn mà danh sách rỗng thì hiển thị thông báo lỗi tìm kiếm | Thêm `isRatingRef` khóa 350ms chống double-click; bổ sung trạng thái rỗng đặc thù khi hoàn thành ôn tập hôm nay |
| **Luyện phát âm & Nhận dạng giọng nói** | Backend Proxy Azure TTS `/api/audio/tts` (giọng bản ngữ Xiaoxiao/Yunxi); bộ đánh giá `pronunciationEvaluator.js` | `PronunciationPage.jsx` có giao diện ghi âm, phân tích âm vị, thanh điệu, thanh đo decibel trực tiếp | Web Speech API (`zh-CN`) + Azure TTS + `pronunciationEvaluator.js` | Trình duyệt không hỗ trợ Web Speech API hoặc người dùng chặn quyền Micro cần thông báo rõ ràng | Đã hoàn thiện bắt lỗi `not-allowed`, `no-speech` và khuyến nghị trình duyệt Chrome/Edge |
| **Luyện viết chữ Hán & Bộ thủ** | Thuật toán chiết tự HanziWriter, ngân hàng bộ thủ, `WorksheetGenerator` tạo file PDF A4 | `WritingPage.jsx`, `InteractiveWritingPad.jsx`, `StrokeOrderPlayer.jsx` | Thư viện `hanzi-writer` + `characterDictionaryService.js` | URL hash shareable `#writing?char=...` cần đồng bộ chính xác khi chuyển chữ | Đã có cơ chế parse hash và lưu tiến độ viết độc bản của người học |
| **Trung tâm thi thử HSK (CBT)** | Serverless Endpoint `/api/hsk/submit` chấm điểm khách quan độc lập, chống can thiệp client | `HskPracticePage.jsx` hỗ trợ thi thử HSK 1–6, đồng hồ đếm ngược, lưu nháp tạm thời chống F5 | `HSK_EXAMS` (21 đề), `HSK_QUESTIONS` + Supabase `hsk_attempts` | Đề tham chiếu học thuật CLEC/CTI (`hsk1-official-ref-01`) có 0 câu hỏi số hóa, nếu bấm "Vào thi" sẽ văng lỗi | Bổ sung phân nhánh: đề có 0 câu hiển thị nút "Đề tham chiếu" dẫn tới nguồn CTI, không cho vào giao diện thi giả lập |
| **Kho tài nguyên & Đề thi mẫu HSK** | Serverless Endpoint `/api/hsk/resources` hỗ trợ lọc theo cấp độ, danh mục, định dạng | `HskPhase3Components.jsx` (`HskResourcesView`) | `/api/hsk/resources` + `HSK_RESOURCES` + Supabase `hsk_resources` | Frontend chưa kết nối trực tiếp gọi endpoint serverless `/api/hsk/resources` mà chỉ đọc local | Đã bổ sung gọi API `/api/hsk/resources` bất đồng bộ với fallback offline |
| **Gia sư AI Lão Sư (AI Tutor)** | Serverless Endpoint `/api/ai/tutor` tích hợp RAG Retrieval lai (Vector + Lexical), xKiro & Gemini | `ConversationPage.jsx` (`AiTutorChatView.jsx`) giao diện chat sư phạm, gợi ý câu hỏi, trích dẫn tri thức | `/api/ai/tutor` qua `aiGateway.js` | Cần bảo đảm không bịa đặt nguồn khi RAG thiếu chứng cứ (`insufficient_evidence`) | Backend đã có cờ `evidence_status` và frontend hiển thị minh bạch nhãn trích dẫn |
| **Cấp phát Chứng nhận HSK** | Serverless Endpoint `/api/hsk/issue-certificate` kiểm tra 20/20 bài và điểm thi `>= 80%` | `ProfilePage.jsx` (`CertificateGeneratorModal.jsx`) | `/api/hsk/issue-certificate` + Supabase `issued_certificates` | Giao diện Profile chỉ hiển thị chứng nhận cho HSK 1–3, bỏ sót HSK 4–6; chưa tự động đồng bộ chứng nhận cũ từ cloud khi đăng nhập mới | Đã mở rộng lưới chứng nhận sang HSK 1–6; tích hợp `getUserIssuedCertificates(user)` tải từ Supabase |
| **Tra cứu Chứng nhận Công khai** | RPC Postgres `verify_hsk_certificate_public` và endpoint `/api/hsk/verify-certificate` | `CertificateVerificationModal.jsx` tra cứu theo mã chứng nhận | `verify_hsk_certificate_public` (chỉ trả tên, cấp độ, ngày cấp, trạng thái thu hồi) | Cần hiển thị rõ ràng nếu chứng nhận đã bị thu hồi (`is_revoked`) | Đã hoàn thiện giao diện cảnh báo thu hồi màu đỏ kèm lý do và tuyên bố miễn trừ trách nhiệm |
| **Lớp học & Phòng học Trực tuyến** | Serverless Endpoints `/api/classroom/*`, `/api/live/*`, WebRTC ICE servers `/api/webrtc/*` | `ClassroomPage.jsx`, `LiveClassroomPage.jsx` | Supabase Realtime + LiveKit WebRTC Server | Đảm bảo học viên không tự cấp quyền mic/publish mà phải qua phê duyệt của giáo viên | Hệ thống đã có phân quyền token LiveKit và kiểm thử 17 kịch bản hồi quy RBAC đạt 100% |

---

## 2. Chi tiết các API và Nguồn Dữ liệu được Kiểm tra

1. **Nhóm API HSK & Khảo thí:**
   - `/api/hsk/submit` — Chấm điểm bài thi độc lập phía máy chủ.
   - `/api/hsk/resources` — Truy xuất tài liệu học thuật và đề mẫu CTI.
   - `/api/hsk/history` — Lịch sử và so sánh kết quả 2 lần thi.
   - `/api/hsk/mistakes` — Sổ tay câu hỏi sai, cập nhật trạng thái ôn luyện.
   - `/api/hsk/issue-certificate` — Thẩm định điều kiện và cấp phát chứng nhận.
   - `/api/hsk/verify-certificate` — Xác thực tính hợp lệ công khai, bảo vệ PII.

2. **Nhóm API AI & Trợ lý thông minh:**
   - `/api/ai/tutor` — Gia sư AI tích hợp RAG Retrieval và kiểm duyệt ngữ pháp.
   - `/api/ai/roleplay` — Phòng luyện khẩu ngữ nhập vai tình huống thực tế.
   - `/api/ai/coach` — Huấn luyện viên học tập phân tích lỗi sai và đề xuất bài học tiếp theo.
   - `/api/ai/teacher` — Trợ giảng AI cho giáo viên soạn giáo án và phân tích học sinh có nguy cơ.

3. **Nhóm API Realtime & Phòng học:**
   - `/api/classroom/create`, `join`, `lookup`, `members`, `remove` — Quản trị lớp học.
   - `/api/live/session`, `join`, `leave`, `moderation`, `participants` — Quản lý phòng học trực tuyến.
   - `/api/webrtc/livekit-token`, `ice-servers` — Cấp phát token âm thanh bảo mật.

---

## 3. Các Khoảng Trống Phát Hiện & Đã Xử Lý Thành Công

1. **Chứng nhận HSK 4–6 chưa hiển thị ở Profile:**
   - *Phát hiện:* Lưới hiển thị chứng nhận tốt nghiệp trong `ProfilePage.jsx` chỉ lặp qua `['HSK 1', 'HSK 2', 'HSK 3']`, bỏ qua HSK 4, 5, 6 mặc dù hệ thống đã có đầy đủ 120 bài học và đề thi HSK 4–6.
   - *Khắc phục:* Mở rộng mảng duyệt thành `['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6']`.

2. **Đồng bộ Chứng chỉ từ Cloud khi đăng nhập thiết bị mới:**
   - *Phát hiện:* `ProfilePage.jsx` chỉ đọc `localStorage.getItem(CERTIFICATES_STORAGE_KEY)`, dẫn đến việc học viên đăng nhập trên thiết bị mới không thấy các chứng nhận đã được cấp trước đó.
   - *Khắc phục:* Triển khai và tích hợp hàm `getUserIssuedCertificates(user)` truy vấn Supabase RLS an toàn và hợp nhất với LocalStorage.

3. **Trải nghiệm trống (Empty State) khi hoàn thành Flashcard SRS:**
   - *Phát hiện:* Khi người học lọc các thẻ cần ôn tập hôm nay (`due`) và đã ôn xong hết, giao diện hiển thị thông báo "Không tìm thấy từ vựng nào phù hợp", gây hiểu lầm là lỗi tìm kiếm.
   - *Khắc phục:* Thiết kế trạng thái chúc mừng: *"🎉 Đã hoàn thành toàn bộ thẻ cần ôn hôm nay!"* kèm nút chuyển nhanh sang chế độ ôn tập tự do.

4. **Chống lặp hành vi (Double-click Protection) trên các nút SRS:**
   - *Phát hiện:* Bấm liên tục nhiều lần vào nút "Nhớ rõ" hoặc "Quên" làm tăng XP và gọi API đồng bộ dồn dập.
   - *Khắc phục:* Tích hợp cờ khóa tạm thời `isRatingRef` (350ms) trong `handleSrsRate`.

5. **Đề thi tham chiếu 0 câu hỏi:**
   - *Phát hiện:* Đề `hsk1-official-ref-01` là tài liệu tham khảo chính thức từ CTI, không có câu hỏi trắc nghiệm nội bộ. Bấm "Vào thi" sẽ gây lỗi người dùng.
   - *Khắc phục:* Tự động phát hiện `total_questions === 0` để đổi nút thành *"Đề tham chiếu"* và mở liên kết trực tiếp tới tài liệu gốc của CTI/CLEC.
