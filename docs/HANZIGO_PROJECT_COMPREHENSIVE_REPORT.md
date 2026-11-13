# Báo Cáo Toàn Diện Dự Án HanziGo

> **Ngày tổng hợp:** 13/11/2026  
> **Tên dự án:** HanziGo (`hanzigo`) — Nền tảng học tiếng Trung & luyện thi HSK/HSKK toàn diện cho người Việt  
> **Trạng thái build:** Đã xác minh `npm run build` (`vite build`) thành công (2364 modules transformed)

---

## 1. Tổng Quan & Kiến Trúc Công Nghệ

HanziGo được thiết kế theo kiến trúc Full-Stack hiện đại, kết hợp SPA React tối ưu hóa theo chunk với Serverless API (Vercel Functions) và Supabase PostgreSQL (Auth, RLS, RPC, Storage, Realtime).

| Tầng hệ thống | Công nghệ & Phiên bản (`package.json`) | Vai trò chính |
| :--- | :--- | :--- |
| **Frontend UI** | React `19.2.8`, Vite `8.3.0`, Tailwind CSS `4.3.3` (`@tailwindcss/vite`), Lucide React `1.48.0` | Giao diện học tập đa module, responsive desktop/mobile, dark/light mode |
| **Học chữ & Tương tác** | `hanzi-writer` `3.7.3`, `canvas-confetti` `1.9.4`, Web Speech API (`zh-CN`) | Luyện viết Mễ tự cách chấm nét, nhận diện phát âm & TTS bản ngữ |
| **Realtime & Lớp học trực tuyến** | `livekit-client` `2.22.4`, `@livekit/components-react` `2.9.24`, `livekit-server-sdk` `2.19.1` | Phòng học Live Classroom đa người dùng, cấp token JWT, WebRTC/ICE |
| **Backend & Database** | `@supabase/supabase-js` `2.117.2`, PostgreSQL (`pg_trgm`, `pgcrypto`), Vercel Serverless (`api/`) | Xác thực, lưu tiến độ đồng bộ cloud, chấm bài AI, rate limiting, RAG |
| **Chất lượng mã nguồn** | `oxlint` `1.81.0`, `node --test` (131 file test trong `tests/`) | Kiểm tra lint và kiểm thử tự động các module cốt lõi |

---

## 2. Hệ Sinh Thái Tính Năng (23 Modules trong `src/features/`)

### 2.1. Hệ Sinh Thái Học Tập Thống Nhất (Unified Ecosystem)
- **`unified-ecosystem` & `src/core/ecosystem/`**:
  - `UnifiedToolsContext.tsx` & `useUnifiedEcosystemStore.ts`: Quản lý trạng thái toàn cục cho thanh công cụ nổi và ngăn kéo trượt 4-in-1.
  - `GlobalTextSelectionActionBar.tsx`: Tự động nhận diện khi người dùng bôi đen chữ Hán ở bất kỳ trang nào, trích xuất câu ngữ cảnh gốc và mở nhanh 4 công cụ hoặc lưu từ 1-click.
  - `UniversalSlideOverDrawer.tsx`: Ngăn kéo trượt 4 tab (**Từ điển 27.01**, **Ngữ pháp 27.02**, **Luyện viết 27.03** với HanziWriter, **Phát âm 27.07** với Web Speech Recognition), đồng bộ điểm Mastery đa chiều qua RPC `update_vocab_dimension_score`.
  - `DailySmartStudyFlow.tsx`: Điều phối lộ trình học thông minh hàng ngày.

### 2.2. Nhóm Kỹ Năng Đầu Vào & Ngôn Ngữ Học (Phase 27 & 29)
- **`dictionary`**: Từ điển thông minh đa phương thức (giản thể, phồn thể, pinyin thanh điệu/số/không dấu, Hán Việt, chiết tự bộ thủ, lượng từ, đồng/trái nghĩa, collocations).
- **`reading-studio`**: Đọc hiểu tương tác theo cấp độ HSK, click từng từ để xem nghĩa/pinyin, lưu tiến độ đọc cloud.
- **`listening-studio`**: Phòng luyện nghe 60fps đồng bộ transcript (`SyncedTranscriptView`), lặp đoạn A-B (`StudioAudioDeck`), nghe chép chính tả (`SentenceDictationWorkbench`) và câu hỏi trắc nghiệm chuẩn hóa đa định dạng (`normalizeListeningQuestions`).
- **`video-studio`**: Xem video song ngữ Dual-Sub (`DualSubInteractiveVideoStudio`, `DualSubInteractivePlayer`), click phụ đề để tra từ và đào câu.
- **`ocr-scanner` & `web-importer`**: Quét ảnh chữ Hán (OCR) và nhập bài viết từ web (`articleImporterService.ts`) thành bài đọc tương tác.
- **`immersion-hub`**: Trung tâm Sentence Mining ($i+1$), tự động gom câu có 1 từ mới từ bài đọc, video, OCR, giáo trình thành thẻ học ngữ cảnh.
- **`chengyu-explorer`**: Khám phá Thành ngữ 4 chữ (四字成语) kèm chiết tự từng chữ cổ, nghĩa đen/bóng và thành ngữ tiếng Việt tương đương.
- **`textbook-companion`**: Đồng bộ giáo trình chuẩn đại học (Hán Ngữ 6 quyển, HSK Standard Course, Boya Chinese, Msutong).
- **`hsk30-translation`**: Chuẩn HSK 3.0 Cấp 7–9, gói thuật ngữ chuyên ngành (IT, Thương mại, Logistics...) và Xưởng Luyện Dịch Trung ↔ Việt.

### 2.3. Nhóm Luyện Tập Chủ Động, Ghi Nhớ & Lộ Trình
- **`writing` & `writing-studio`**: Canvas tập viết Mễ tự cách, kiểm tra thứ tự nét và in phiếu luyện viết A4 (Ô Mễ Tự).
- **`pronunciation-lab`**: Luyện thanh điệu, biến điệu và chấm điểm phát âm AI.
- **`srs` & `vocabulary-workspace`**: Flashcard 3D SRS thông minh, theo dõi Mastery đa chiều (Nghĩa 40% + Viết 30% + Phát âm 30%).
- **`curriculum`, `adaptive`, `intelligence`, `analytics`**: Lộ trình học HSK 1–6 & 7–9, AI Learning Coach cá nhân hóa và bảng phân tích năng lực.

### 2.4. Nhóm Thi Thử HSK / HSKK & Lớp Học Trực Tuyến (Phase 30 & Live)
- **`hsk-exam`**: Kho đề thi mô phỏng HSK 1–6 chuẩn CTI, tự động tính điểm, giải thích tiếng Việt, trình mô phỏng chuyên biệt **HSK 6** (Câu 51–60 Tìm câu bệnh & Câu 101 Tóm tắt văn bản 2 giai đoạn 10 phút đọc / 35 phút viết) và AI Writing Rubric Grader.
- **`hskk-exam`**: Phòng thi nói HSKK (Sơ cấp, Trung cấp, Cao cấp) với ghi âm và đánh giá bài nói.
- **Lớp học trực tuyến (`ClassroomPage.jsx`, `LiveClassroomPage.jsx`)**: Quản lý lớp bằng mã mời, giao bài tập, phòng học video/audio thời gian thực qua LiveKit với phân quyền giáo viên/học viên.

---

## 3. Cấu Trúc Trang (`src/pages/` — 23 Pages) & Điều Hướng

| Nhóm trang | Các file trong `src/pages/` |
| :--- | :--- |
| **Trang chủ & Tổng quan** | `HomePage.jsx`, `DashboardPage.jsx`, `ProfilePage.jsx` |
| **Học tập & Lộ trình** | `RoadmapPage.jsx`, `LessonPage.jsx`, `VocabularyPage.jsx`, `ReaderPage.jsx`, `PracticePage.jsx`, `WritingPage.jsx`, `PronunciationPage.jsx`, `ConversationPage.jsx` |
| **Thi cử & Học liệu** | `HskPracticePage.jsx`, `MaterialsPage.jsx` |
| **Lớp học & Cộng đồng** | `ClassroomPage.jsx`, `LiveClassroomPage.jsx`, `CommunityPage.jsx` |
| **Quản trị & Giảng dạy** | `TeacherDashboardPage.jsx`, `AdminPage.jsx` |
| **Xác thực & Pháp lý** | `ResetPasswordPage.jsx`, `PrivacyPolicyPage.jsx`, `TermsOfServicePage.jsx`, `CookiePolicyPage.jsx`, `RefundPolicyPage.jsx` |

**Điều hướng thống nhất**:
- Sidebar (`AppSidebar.jsx`) và Mobile Drawer (`MobileNavigation.jsx`) nhóm **Kỹ năng & Luyện tập** gồm 11 kỹ năng theo luồng *Input → Core → Output → Tổng hợp*, gộp **Cộng đồng & Bảng vàng**, và ẩn mục **Quản trị viên (Admin)** ở `Footer.jsx` khi người dùng không phải Admin.
- Các Hero Banner trên `MaterialsPage.jsx`, `ClassroomPage.jsx`, `CommunityPage.jsx` và thanh tab kỹ năng trên `PracticePage.jsx` đã được tinh gọn để hiển thị cân đối, không rớt dòng.

---

## 4. Kiến Trúc Backend Serverless (`api/`)

Thư mục `api/` tổ chức theo mô hình dispatcher gọn nhẹ để tối ưu số lượng Serverless Functions khi deploy:
- **Route Dispatchers**: `api/admin/[action].js`, `api/ai/[action].js`, `api/classroom/[action].js`, `api/hsk/[action].js`, `api/live/[action].js`, `api/newsletter/[action].js`, `api/webrtc/[action].js`, `api/audio/tts.js`.
- **Handlers (`api/_handlers/`)**:
  - `admin/`: `create-user.js`
  - `ai/`: `chat.js`, `coach.js`, `personalize.js`, `pronunciation.js`, `roleplay.js`, `teacher.js`, `tutor.js`
  - `classroom/`: `create.js`, `join.js`, `lookup.js`, `members.js`, `remove.js`
  - `hsk/`: `analytics.js`, `attempt.js`, `certificate.js`, `exam.js`, `exams.js`, `history.js`, `import.js`, `mistakes.js`, `report.js`, `resources.js`, `review.js`, `submit.js`
  - `live/`: `end.js`, `join.js`, `leave.js`, `moderation.js`, `participants.js`, `session.js`
  - `newsletter/`: `subscribe.js`
- **Tiện ích lõi (`api/_utils/` & `api/_webrtc/`)**: `verifyAuth.js` (xác thực JWT/RBAC), `distributedRateLimiter.js`, `aiProviderAdapter.js`, `embeddingProvider.js`, `ragRetriever.js`, `supabaseServer.js`, `livekit-token.js`, `ice-servers.js`.

---

## 5. Cơ Sở Dữ Liệu Supabase (`supabase/migrations/` — 38 Migrations)

Hệ thống schema PostgreSQL được quản lý qua **38 file SQL migration** trong `supabase/migrations/`, bao phủ toàn bộ vòng đời dữ liệu:
- **Core & Auth/RBAC**: Profiles, Audit Logs, Role Guards (`admin`, `teacher`, `student`), Newsletter subscribers, Daily Quotes.
- **Giảng dạy & Cộng đồng**: Classrooms, Assignments, Live Sessions, Community Posts/Comments/Reactions (atomic RPC counters), Moderation Reports, Study Partners.
- **Hệ sinh thái Học tập (Phase 27 & 29)**: `dictionary_entries` (chỉ mục `pg_trgm`), `grammar_points`, `reading_articles`, `listening_tracks`, `pronunciation_drills`, `chengyu_entries`, `specialized_domain_packs`, `textbook_series`, `textbook_units`, `vocab_decks`, `user_vocab_items`, `mined_sentence_cards`, và RPC `update_vocab_dimension_score`.
- **Kho đề thi HSK/HSKK (Phase 30)**: `hsk_papers`, `hsk_question_bank`, `hsk_attempts`, `hsk_writing_evaluations`.
- **Migration tổng hợp & đối soát mới nhất**: `supabase/migrations/20261113_master_seed_and_reconciliation_p27_29_30.sql` đã xử lý đầy đủ tương thích cột legacy (như `pinyin_tone`, không ép `UNIQUE` trên `dictionary_entries.simplified`, ánh xạ `series_id` cho `textbook_units`, bổ sung `slug`/`code` cho bảng Phase 27).

---

## 6. Bảo Mật, Kiểm Thử & Vận Hành

- **Bảo mật**:
  - Row Level Security (RLS) trên các bảng dữ liệu người dùng, lớp học, cộng đồng và kho tài liệu.
  - Phân quyền RBAC ở cả UI (`AdminGuard.jsx`, ẩn link Admin ở `Footer.jsx`) và API (`verifyAuth.js`), kết hợp `distributedRateLimiter.js`.
- **Kiểm thử**:
  - Hiện có **131 file test** trong `tests/` (chạy bằng `node --test`), bao gồm kiểm thử SRS, bảo mật RBAC/RLS, RAG/AI Gateway, LiveKit, HSK Exam Engine, và `tests/masterSchemaSeed.test.js` (xác minh SQL migration, `seedAllEcosystemData.ts`, và `normalizeListeningQuestions`).
- **Lệnh vận hành chính (`package.json`)**:
  - Phát triển: `npm run dev`
  - Build production: `npm run build`
  - Kiểm tra lint: `npm run lint`
  - Chạy bộ test chính: `npm test`
  - Đồng bộ & seed DB: `npm run db:sync`, `npm run db:seed`, `npm run db:seed:learning`, `npm run db:seed:hsk`, `npm run db:seed:quotes`

