# PHASE 38 — TASK 38.01: LEARNING DATA QUALITY AUDIT REPORT

- **Giai đoạn:** Phase 38 — Platform Quality & Data Intelligence
- **Task:** Task 38.01 — Learning Data Quality Audit *(Chế độ: Audit-Only)*
- **Repository:** `https://github.com/haidang1603/Hanzigo.git`
- **Production Website:** `https://hanzigo-xi.vercel.app`
- **Ngày kiểm toán:** 2026-11-19
- **Môi trường kiểm toán:** Mã nguồn local, SQL schema & migrations (`supabase/`), script kiểm toán tĩnh, `oxlint`, `vite build`, Node.js Native Test Runner (`npm test`).

---

## 1. Executive Summary

Task 38.01 thực hiện kiểm toán toàn diện **tính toàn vẹn cấu trúc dữ liệu học tập** của HanziGo trên tất cả phân hệ (HSK 1–9 Curriculum, Vocabulary, Grammar, CBT Exams & Attempts, SM-2 SRS, Reading/Listening/Writing/Pronunciation Studio, Telemetry, Classroom, LocalStorage/SessionStorage và hợp đồng Supabase SQL), tuân thủ tuyệt đối chế độ **Audit-Only** (không chỉnh sửa mã nguồn ứng dụng, không thay đổi dữ liệu, không chạy migration).

### Bức tranh tổng quan nền tảng (xác minh từ repo)
- **Stack kỹ thuật (`package.json`):** `hanzigo@0.0.0` (`"type": "module"`), React `^19.2.8`, React DOM `^19.2.8`, Vite `^8.3.0`, Tailwind CSS `^4.3.3`, `@supabase/supabase-js` `^2.117.2`, `hanzi-writer` `^3.7.3`, `livekit-client` `^2.22.4`, `livekit-server-sdk` `^2.19.1`, `oxlint` `^1.81.0`, Node.js Native Test Runner (`96` file test trong script `test`).
- **Hạ tầng Serverless (`vercel.json` & `api/`):** 6 action rewrite (`/api/ai/:action`, `/api/classroom/:action`, `/api/live/:action`, `/api/hsk/:action`, `/api/webrtc/:action`, `/api/newsletter/:action`), cộng `api/admin/[action].js` và `api/audio/tts.js` (tổng 47 file trong `api/`), kèm 5 security headers chuẩn và cache `immutable` cho `/assets/(.*)`.
- **Database Schema (`supabase/schema.sql` + 43 files trong `supabase/migrations/`):** **99** bảng SQL phân biệt, **2** Views (`v_hsk_questions_public`, `student_telemetry_daily_summary`), **39** Functions/RPCs; **0** lỗi `FOREIGN KEY` trỏ tới bảng không tồn trong DDL tĩnh.
- **Bộ dữ liệu học liệu tĩnh (`src/data/`):**
  - `VOCABULARY_LIST`: **830** mục; `getLocalHsk79Flashcards()`: **484** mục; `HSK_7_9_VOCABULARY`: **13** mục; `HSK6_IDIOMS_DATABASE`: **50** mục; `EXTENDED_COMMON_CHARS`: **94** mục.
  - Curriculum: **7** `LEARNING_LEVELS` (`lvl-1`..`lvl-7`), **24** `LEARNING_CHAPTERS`, **120** bài HSK 1–6 (`LEARNING_LESSONS` / `CURRICULUM_ALL_LESSONS` / `HSK_120_LESSONS`, ID `l-101`..`l-620`), **60** bài HSK 7–9 (`HSK_79_60_LESSONS`, ID `121`..`180`), **24** Boss Challenges, **10** Placement Questions.
  - Drills & Graded Readers: **90** Grammar Drills, **90** Listening Drills, **24** Graded Readers (**0** lỗi ID trùng lặp hay đáp án sai phạm vi).
  - Ngân hàng đề CBT: **30** `HSK_EXAMS`, **530** `HSK_QUESTIONS`, **3** đề mẫu HSK 7–9 (`H79001`–`H79003`).
- **Browser Storage Footprint:** **177** key `localStorage`/`sessionStorage` được tham chiếu trong `src/`.

### Tóm tắt phát hiện (13 Findings)
| Mức độ | Số lượng | Mã phát hiện | Trọng tâm |
|---|---:|---|---|
| **CRITICAL** | 2 | `DQ-CRIT-01`, `DQ-CRIT-02` | Ghi đè/lây nhiễm dữ liệu chéo tài khoản giữa `localStorage` không phân vùng và Supabase; hỏng GDPR Data Export |
| **HIGH** | 6 | `DQ-HIGH-01` .. `DQ-HIGH-06` | 4 truy vấn Supabase sai tên cột/bảng; 1 đề thi published rỗng (0 câu) + 18 đề lệch tổng điểm; phân mảnh nhiều bảng cùng miền; mất `lapse_count`/`writing_answers`; lệch múi giờ UTC vs `UTC+7`; 18 từ vựng trùng + 45 chồng chéo HSK 7–9 |
| **MEDIUM** | 3 | `DQ-MED-01` .. `DQ-MED-03` | Định nghĩa bảng/view lặp trong `schema.sql`; lưu song song `camelCase` + `snake_case`; cấu trúc không đối xứng trong đề HSK 7–9 |
| **LOW** | 2 | `DQ-LOW-01`, `DQ-LOW-02` | 731 cảnh báo `oxlint` tồn đọng (0 error); bảng/key mồ côi chưa dùng hoặc không có writer |

> **Giới hạn bằng chứng:** Môi trường hiện tại **không có quyền truy cập trực tiếp** vào PostgreSQL/Supabase Production, Upstash Redis live và trình duyệt Production để đo RUM/Core Web Vitals. Các hạng mục phụ thuộc dữ liệu runtime thực tế được đánh dấu rõ **`[NOT VERIFIED — NO LIVE ACCESS]`**.

---

## 2. Audit Findings

### [CRITICAL] `DQ-CRIT-01` — Ghi đè dữ liệu & lây nhiễm chéo tài khoản giữa `localStorage` và Supabase Cloud

- **Mô tả:** Luồng đồng bộ cốt lõi `triggerCloudSync` / `loadAllUserDataFromDb` và `syncUserVocabSrsFromCloud` vẫn đọc hoặc nhân bản dữ liệu vào các key `localStorage` **toàn cục không gắn `userId`**, trong khi `logout()` bỏ sót không dọn các key này.
- **Bằng chứng cụ thể:**
  - `src/services/progressService.js:59-63, 111-115, 126`: `triggerCloudSync(uid)` đọc `localStorage.getItem('hanzigo_vocab_remembered')` và `localStorage.getItem('hanzigo_completed_lessons')` (toàn cục), `upsert` lên `user_lesson_progress` cho `targetUid`, và ghi đè `profiles.words_learned = rememberedWords.length` không kiểm tra điều kiện đơn điệu tăng hay timestamp.
  - `src/services/progressService.js:204-207`: `loadAllUserDataFromDb(uid)` ghi đè danh sách bài học từ Supabase của User A vào key toàn cục `hanzigo_completed_lessons`.
  - `src/services/vocabularyService.js:144, 148, 152`: `syncUserVocabSrsFromCloud(userId)` ghi song song state SRS vào cả key có prefix `userId` lẫn key toàn cục `hanzigo_vocab_srs_state`, `hanzigo_vocab_remembered`, `hanzigo_vocab_review`.
  - `src/context/AuthContext.jsx:250-265`: `logout()` chỉ xóa 10 key (`hanzigo_user`, `hanzigo_custom_avatar`, `hanzigo_user_bio`, `hanzigo_streak_count`, `hanzigo_last_study_date`, `hanzigo_streak_data`, `hanzigo_longest_streak`, `hanzigo_total_xp`, `hanzigo_bonus_xp`, `hanzigo_active_tab`) và **bỏ sót** `hanzigo_completed_lessons`, `hanzigo_vocab_remembered`, `hanzigo_vocab_review`, `hanzigo_vocab_srs_state`.
- **Tác động:**
  1. **Mất dữ liệu thật trên Cloud:** Nếu User A đăng nhập trên thiết bị/trình duyệt sạch mà key toàn cục `hanzigo_vocab_remembered` rỗng, `triggerCloudSync` ghi đè `profiles.words_learned = 0`.
  2. **Lây nhiễm chéo tài khoản:** Nếu User A đăng xuất rồi User B đăng nhập trên cùng trình duyệt, `triggerCloudSync` lấy bài đã học và từ vựng của User A trong key toàn cục đẩy lên bảng `user_lesson_progress` và `profiles` của User B.
- **Đề xuất xử lý (cho Task 38.03/38.04):** Chuyển toàn bộ đọc/ghi trong `progressService.js` và `vocabularyService.js` sang `getUserStorageKey(..., user)`, ngừng ghi gương (mirror) ra key toàn cục, xóa sạch mọi key học tập không phân vùng khi đăng xuất, và bổ sung kiểm tra hợp nhất an toàn trước khi cập nhật `profiles.words_learned`.

---

### [CRITICAL] `DQ-CRIT-02` — 12+ phân hệ dùng key `localStorage` toàn cục không phân vùng theo `userId` & lỗi trích xuất GDPR

- **Mô tả:** Ngoài `progressService.js`, ít nhất **12 service** lưu trạng thái học tập/làm bài/cache cá nhân bằng key `localStorage` tĩnh (không gọi `getUserStorageKey`), và modal xuất dữ liệu cá nhân đọc sai key hoặc đọc key không phân vùng.
- **Bằng chứng cụ thể:**
  - `src/services/vocabWorkspaceService.ts:68-69, 344, 356, 365`: `hanzigo_vocab_workspace_decks_v1`, `hanzigo_vocab_workspace_items_v1`. Khi User B có `0` bản ghi trên `vocab_decks`, dòng 356 trả về `local` — chính là dữ liệu cached của User A.
  - `src/services/dictionaryService.ts:33-35, 579, 651`: `hanzigo_smart_dict_history_v1`, `hanzigo_smart_dict_saved_deck_v1`, `hanzigo_smart_dict_ai_cache_v1` không phân vùng theo `userId`.
  - `src/services/hskService.js:51-54, 461, 465, 563, 581, 772-777`: `hanzigo_hsk_attempts` (dùng chung giới hạn `.slice(0, 30)` cho mọi user), `hanzigo_hsk_draft_<examId>` (nháp bài thi và timer còn hạn 4 giờ chảy sang tài khoản khác), `hanzigo_hsk_mistakes` (không phân vùng và dòng 776 `m.userId === user.id || m.userId === null` trộn lỗi sai Guest vào tài khoản thật).
  - `src/services/learningDataService.ts:120-121, 480, 528`: `hanzigo_telemetry_offline_queue_v1`, `hanzigo_user_mistake_records_v1`.
  - `src/core/telemetry/learningTelemetryService.js:4-7`: `hanzigo_telemetry_buffer_v1`, `hanzigo_telemetry_history_v1`, `hanzigo_roadmap_120_progress_v1`, `hanzigo_vocab_workspace_items_v1`.
  - `src/core/ecosystem/useUnifiedEcosystemStore.ts:58, 172-174`: `hanzigo_unified_learning_events_v1` (trần `.slice(0, 50)` toàn cục).
  - `src/core/sync/OfflineSyncManager.js:4`: `hanzigo_sync_queue_v1` (hàng đợi sync dùng chung giữa các tài khoản).
  - `src/services/listeningStudioService.ts:1317-1325`: `hanzigo_listening_studio_logs_v1`.
  - `src/services/pronunciationLabService.ts:352-360`: `hanzigo_pronunciation_lab_attempts_v1`.
  - `src/services/translationStudioService.ts:71, 881-883`: `hanzigo_translation_submissions_v1`.
  - `src/services/textbookCompanionService.ts:93, 534-543`: `hanzigo_textbook_enrollments_v1`.
  - `src/services/classroomService.js:8-17`: `hanzigo_classrooms_store`, `hanzigo_class_members_store`, `hanzigo_assignments_store`, `hanzigo_submissions_store`, `hanzigo_announcements_store`, `hanzigo_class_materials_store`.
  - `src/utils/materialsStorage.js:623, 658`: `hanzigo_custom_vocab`, `hanzigo_custom_lessons`.
  - `src/components/DataSubjectRequestModal.jsx:64-68`: Khi xuất dữ liệu người dùng (GDPR Art. 20 / NĐ 13), modal đọc `hanzigo_completed_lessons`, `hanzigo_vocab_remembered`, `hanzigo_hsk_mistakes`, `hanzigo_learner_context` không phân vùng, và đọc nhầm key không tồn tại `hanzigo_hsk_exam_history` (thực tế `hskService.js:51` lưu vào `hanzigo_hsk_attempts`).
- **Đề xuất xử lý (cho Task 38.03):** Chuẩn hóa registry key tập trung sử dụng `getUserStorageKey` cho toàn bộ 12+ service, dọn triệt để theo `userId` khi đổi phiên/đăng xuất và sửa `DataSubjectRequestModal.jsx` đọc đúng key theo `user`.

---

### [HIGH] `DQ-HIGH-01` — Sai lệch hợp đồng Schema Supabase: 4 truy vấn trỏ tới bảng hoặc cột không tồn tại

- **Mô tả:** Đối chiếu tự động toàn bộ lời gọi `.from(...).select/order/eq/insert(...)` trong `src/` và `api/` với DDL trong `supabase/schema.sql` + 43 migrations phát hiện 4 lỗi hợp đồng schema chạy âm thầm (bị nuốt bởi `try/catch`):
- **Bằng chứng cụ thể:**
  1. `src/pages/RoadmapPage.jsx:240-244`: `.from('hsk_attempts').select('hsk_level, total_score').eq('user_id', targetUid).order('total_score', { ascending: false })`. Thực tế bảng `public.hsk_attempts` (`supabase/schema.sql:1685-1701`) chỉ có `exam_id`, `score`, `max_score`, **không có cột `hsk_level` hay `total_score`**. Khi chạy thực tế, Postgres trả lỗi 400 (`column does not exist`) -> rơi vào `catch {}` -> điểm CBT cao nhất trên Roadmap luôn trắng.
  2. `src/services/adminAnalyticsService.js:208, 228`: `.from('submissions').select('id', { count: 'exact', head: true })`. Trong toàn bộ 99 bảng SQL **không có bảng `submissions`** (tên thật là `assignment_submissions` và `classroom_assignment_submissions`). Ngoài ra nhánh offline ở dòng 228 đọc `hanzigo_reading_progress_store` — một key không có nơi nào ghi vào (`0` writers).
  3. `api/_handlers/ai/tutor.js:419-426`: `adminClient.from('profiles').select('hsk_level, target_hsk').eq('id', verifiedUserId).single()`. Bảng `public.profiles` chỉ có cột `level` (tổng 16 cột), **không có `hsk_level` hay `target_hsk`** -> AI Tutor luôn bỏ qua profile level từ DB.
  4. `api/_handlers/admin/create-user.js:150-161`: `.from('audit_logs').insert({ user_id: auth.user.id, action: 'ADMIN_CREATE_USER', details: ..., created_at: ... })`. Thực tế bảng `public.audit_logs` (`supabase/schema.sql:1488-1497`) định nghĩa `actor_id TEXT NOT NULL` và `metadata JSONB`, **không có cột `user_id` hay `details`** -> mọi thao tác tạo user của Admin đều thất bại ghi audit log và bị nuốt bởi `try {} catch {}`.
- **Đề xuất xử lý (cho Task 38.03/38.04/38.07):** Sửa `RoadmapPage.jsx` query qua `exam_id, score` ánh xạ với `HSK_EXAMS`; sửa `adminAnalyticsService.js` sang `assignment_submissions` + `classroom_assignment_submissions`; sửa `tutor.js` chọn `level` từ `profiles`; sửa `create-user.js` dùng đúng cột `actor_id`, `target_id`, `metadata` của `audit_logs` và log lỗi rõ ràng.

---

### [HIGH] `DQ-HIGH-02` — Đề thi published rỗng (`hsk1-official-ref-01`: 0 câu hỏi) & lệch tổng điểm câu hỏi so với `max_score` ở 18/30 đề CBT

- **Mô tả:** Ngân hàng đề CBT HSK 1–6 gồm 30 `HSK_EXAMS` và 530 `HSK_QUESTIONS` (`correct_option_index` và `audio_script` đủ 100%, không thiếu đáp án ở 530 câu hiện có), nhưng tồn tại sai lệch cấu trúc ở cấp đề thi:
- **Bằng chứng cụ thể:**
  - `src/data/hskExamsData.js`: Đề `hsk1-official-ref-01` (`Đề Minh Họa HSK 1 CLEC/CTI Chính Thức (Mã đề H10901 - Tham Chiếu)`, `is_published: true`, khai báo `total_questions: 20`, `max_score: 200`) có **0** câu hỏi trong `HSK_QUESTIONS` (`getFullExamById('hsk1-official-ref-01').questions.length === 0`), trùng mã tài liệu `H10901` với `hsk1-official-sample-01` (có đủ 20 câu).
  - Trong 29 đề còn lại, **18 đề** có tổng `sum(question.points)` khác `exam.max_score` (nhưng `exam.total_points === sum(points)` khớp trong mọi trường hợp): ví dụ `hsk2-mock-01` (`sumPts=190`, `max=200`), `hsk3-mock-01` & `hsk4-mock-01` (`252/300`), `hsk5-mock-01` & `hsk6-mock-01` (`150/300`), `hsk2-official-ref-02` (`60/200`), `hsk3-official-ref-02` (`100/300`), `hsk1-mock-02` (`400/200`), `hsk1-mock-03` & `hsk2-mock-03` (`260/200`), và 6 đề `hsk3-mock-03`, `hsk4-mock-03`, `hsk5-mock-02/03`, `hsk6-mock-02/03` (`400/300`).
  - *Ghi chú bảo toàn nghiệp vụ:* `api/_handlers/hsk/submit.js:202-212` có cơ chế quy đổi `(totalScore / totalMaxRawPoints) * maxScore` hoặc `calculateHskCbtScore`, nên chưa gây sai thang điểm chuẩn hóa khi nộp, nhưng đề rỗng `hsk1-official-ref-01` có thể làm người thi mở vào 0 câu hỏi và tổng `points` thô không thống nhất gây sai lệch nếu module khác cộng thẳng `points`.
- **Đề xuất xử lý (cho Task 38.02 & 38.04):** Ẩn (`is_published: false`) hoặc hợp nhất `hsk1-official-ref-01` vào `hsk1-official-sample-01`; chuẩn hóa `points` trên mỗi đề khớp quy chuẩn hiển thị và thêm unit test chặn đề published có 0 câu.

---

### [HIGH] `DQ-HIGH-03` — Phân mảnh nhiều bảng SQL song song (Split Source of Truth) trên 6 miền học tập

- **Mô tả:** Qua 43 file migration, hệ thống tích lũy **99 bảng SQL** với nhiều cặp bảng song song cùng phục vụ một nghiệp vụ nhưng đọc/ghi từ các màn hình khác nhau, làm dữ liệu bị đứt gãy giữa các phân hệ.
- **Bằng chứng cụ thể:**
  1. **Từ vựng & SRS (4 bảng song song + 1 service offline):**
     - `user_vocab_srs` (`supabase/schema.sql`, ghi bởi `VocabularyPage.jsx` qua `vocabularyService.js`).
     - `user_vocab_items` + `vocab_decks` (`20261112_2706_vocabulary_workspace.sql`, ghi bởi `vocabWorkspaceService.ts`). Đặc biệt RPC `get_user_telemetry_dashboard_summary` (`20261117_3801_learning_telemetry_hub.sql:209`) **chỉ đọc `user_vocab_items`**, nên học viên ôn Flashcards trên `VocabularyPage` không cập nhật dự báo SRS trong Telemetry Hub.
     - `user_saved_vocabulary` (`20261112_2701_smart_dictionary.sql`, ghi bởi `dictionaryService.ts`).
     - `user_srs_cards` và `srs_review_logs` (`supabase/schema.sql`) có định nghĩa nhưng **0 nơi query** trong `src/` và `api/`.
     - `srsRetentionService.ts` chỉ lưu `localStorage`, **0 bảng Supabase**.
  2. **Telemetry (3 bảng song song):** `learning_telemetry_events` (`20261112_learning_data_foundation.sql`), `unified_learning_events` (`20261112_2708_unified_ecosystem.sql`), `user_learning_telemetry_events` (`20261117_3801_learning_telemetry_hub.sql`).
  3. **Bài học (2 bảng):** `lessons` vs `learning_lessons`.
  4. **Đề thi HSK (2 cặp bảng):** `hsk_exams`/`hsk_questions` (PK `TEXT`) vs `hsk_exam_papers`/`hsk_question_bank` (PK `UUID` + `paper_code`).
  5. **Bài tập lớp học (2 cặp bảng):** `assignments`/`assignment_submissions` vs `classroom_hsk_assignments`/`classroom_assignment_submissions`.
  6. **Đọc hiểu & Phát âm (mỗi miền 2 mô hình):** `reading_progress` vs `user_reading_sessions`; `pronunciation_items` vs `pronunciation_drills`/`user_pronunciation_attempts`.
- **Đề xuất xử lý (cho Task 38.03–38.04):** Chốt bảng Source of Truth chính thức cho từng miền và đồng bộ ghi/đọc cầu nối (hoặc view/RPC tổng hợp), không xóa bảng lịch sử để giữ tương thích ngược.

---

### [HIGH] `DQ-HIGH-04` — Phân biệt rạch ròi Dữ liệu Thực Sự Bị Mất vs Dữ liệu Chưa Đồng Bộ

Để tránh nhầm lẫn giữa **chưa sync lên cloud** và **mất vĩnh viễn**, bảng dưới đây phân loại toàn bộ điểm đứt gãy đã xác minh trong mã nguồn:

| Phân loại | Phân hệ / File nguồn | Cơ chế lỗi thực tế & Bằng chứng | Hậu quả |
|---|---|---|---|
| **MẤT DỮ LIỆU THỰC SỰ** | `vocabularyService.js:68-81, 125-132` (`user_vocab_srs`) | Bảng `user_vocab_srs` và hàm `saveUserVocabSrsCard`/`syncUserVocabSrsFromCloud` không lưu trường `lapse_count` (trong khi `srsEngine.js` dùng `lapseCount >= 4` để xác định Leeches). | Số lần quên (lapses) và trạng thái Leech bị mất trắng khi đổi thiết bị hoặc tải lại từ Cloud. |
| **MẤT DỮ LIỆU THỰC SỰ** | `progressService.js:59, 111-115, 126` (`profiles`) | Khi key toàn cục `hanzigo_vocab_remembered` trống, `triggerCloudSync` cập nhật `profiles.words_learned = 0` lên Supabase. | Ghi đè mất số từ đã học thật trên hồ sơ Cloud. |
| **MẤT DỮ LIỆU THỰC SỰ** | `hskService.js:472-491` (`hsk_attempts`) | Luồng fallback client `syncAttemptToSupabase` insert thiếu cột `writing_answers` (dù cột này tồn tại trong `schema.sql` và được xử lý ở `api/_handlers/hsk/submit.js`) và nuốt lỗi ở `catch {}`. | Bài làm tự luận (HSK 4–6) bị mất phần viết nếu lưu qua fallback client. |
| **MẤT DỮ LIỆU THỰC SỰ** | Giới hạn cắt mảng `.slice(0, N)` âm thầm ở cache cục bộ | `readingStudioService.ts:523` (`.slice(0, 20)` bài tự tạo), `hskService.js:464` (`.slice(0, 30)` lịch sử thi), `articleImporterService.ts:431` (`.slice(0, 30)`), `ocrScannerService.ts:659` (`.slice(0, 30)`), `translationStudioService.ts:883` (`.slice(0, 30)`), `pronunciationLabService.ts:360` (`.slice(0, 50)`), `useUnifiedEcosystemStore.ts:174` (`.slice(0, 50)`). | Bản ghi cũ thứ 21/31/51 trở đi bị cắt bỏ vĩnh viễn ở localStorage khi vượt ngưỡng (đặc biệt với các module hoặc tài khoản guest chưa đồng bộ Supabase). |
| **CHƯA ĐỒNG BỘ (Cục bộ trình duyệt)** | `srsRetentionService.ts` | Có `0` lời gọi Supabase; chỉ lưu trên `localStorage`. | Dữ liệu còn trên trình duyệt hiện tại nhưng không lên được đa thiết bị. |
| **CHƯA ĐỒNG BỘ (Cục bộ trình duyệt)** | `videoStudioService.ts` (`getCustomYouTubeVideos`) | Video YouTube người dùng tự dán chỉ lưu trong `localStorage`; bảng `immersion_videos` chưa có cột `user_id`/`created_by` nên không sync cloud. | Chỉ thấy trên máy/trình duyệt đã thêm video. |
| **CHƯA ĐỒNG BỘ (Cục bộ trình duyệt)** | `characterDictionaryService.js:19-20` | Chỉ lưu `hanzigo_writing_progress_map`, `hanzigo_writing_history_log` ở localStorage; không đồng bộ với `hanzi_character_mastery`/`hanzi_writing_logs` của `writingStudioService.ts`. | Tiến độ luyện viết tách đôi giữa 2 module. |
| **CHƯA ĐỒNG BỘ (Thiếu Retry Queue)** | `vocabularyService.js:89-92` & `hskService.js:491` | Khi mất mạng lúc lưu thẻ SRS hoặc attempt, lỗi chỉ `console.warn` / nuốt bỏ, không đẩy vào hàng đợi retry của `OfflineSyncManager`. | Dữ liệu mới nằm lại localStorage hiện tại, không tự đồng bộ bù khi có mạng lại. |

- **Đề xuất xử lý:** Bổ sung `lapse_count` + `writing_answers` + retry queue thống nhất qua `OfflineSyncManager` trong Task 38.03/38.04/38.07.

---

### [HIGH] `DQ-HIGH-05` — Lệch chuẩn Timestamp & Múi giờ (UTC vs Giờ địa phương `UTC+7`)

- **Mô tả:** Hệ thống pha trộn **31** vị trí cắt ngày theo UTC (`toISOString().split('T')[0]` / `.slice(0, 10)`) và **40** vị trí dùng `getLocalDateString()` / `getLocalDateStringInTz()` trong `src/` + `api/`, đồng thời SQL RPC sử dụng `DATE(created_at AT TIME ZONE 'UTC')` và `CURRENT_DATE`.
- **Bằng chứng cụ thể:**
  - `src/services/aiLearningCoachService.js`: dòng 952 dùng `getLocalDateString(new Date())`, nhưng dòng 1070 & 1094 lại sinh khóa cache thêm theo `new Date().toISOString().split('T')[0]`; còn `src/components/learning/AiLearningCoachWidget.jsx:94, 106` dùng UTC `toISOString().split('T')[0]`.
  - `src/services/srsRetentionService.ts:654, 659`: khởi tạo `setUTCHours(0, 0, 0, 0)` và `toISOString().slice(0, 10)`, trong khi `src/pages/VocabularyPage.jsx:1012, 1035` và `src/utils/gamification.js` dùng `getLocalDateString()`.
  - `src/core/telemetry/learningTelemetryService.js:288` và `src/features/analytics/studentAnalyticsService.ts:178, 180, 190` gom nhóm ngày theo UTC, đối nghịch với `src/pages/DashboardPage.jsx:292, 316, 336` và `src/services/gamificationService.js:67, 268, 308` gom theo giờ local.
  - `src/pages/CommunityPage.jsx:951, 964, 1200`: thử thách 21 ngày điểm danh dùng UTC `new Date().toISOString().slice(0, 10)`.
  - SQL: `supabase/migrations/20261112_student_analytics_rpc.sql:12, 125-126, 138` ép `AT TIME ZONE 'UTC'`, còn `20261117_3801_learning_telemetry_hub.sql:95, 103, 204, 209` so sánh trực tiếp `DATE(created_at AT TIME ZONE 'UTC')` với `CURRENT_DATE` (nếu server Postgres đặt timezone khác UTC sẽ lệch ngày so với vế còn lại).
- **Tác động:** Trong khung **00:00–06:59 sáng giờ Việt Nam (UTC+7)**, ngày UTC chậm hơn ngày local 1 ngày — làm lệch ngày điểm danh 21 ngày, cache AI Coach, biểu đồ heatmap và dự báo SRS 7 ngày.
- **Đề xuất xử lý (cho Task 38.03–38.04):** Thống nhất helper ngày theo IANA timezone người dùng (mặc định `Asia/Ho_Chi_Minh`) ở client, truyền `p_timezone` hoặc mốc ISO boundary theo ngày local xuống SQL RPC, và chuẩn hóa mọi `DATE(...) AT TIME ZONE` cùng múi giờ với `CURRENT_DATE`.

---

### [HIGH] `DQ-HIGH-06` — Trùng lặp 18 `hanzi` trong `VOCABULARY_LIST`, chồng chéo 45 từ với HSK 7–9, thiếu 17 Hán-Việt & lệch ID bài học

- **Mô tả:** Dù `npm run audit:curriculum` đạt `100 / 100` về độ phủ ma trận kỹ năng và 0 chuỗi fallback, kiểm toán toàn vẹn khóa & thuộc tính trên dữ liệu tĩnh phát hiện các bất nhất thực tế:
- **Bằng chứng cụ thể:**
  - `src/data/chineseData.js` (`VOCABULARY_LIST` = 830 mục):
    - **18 cặp trùng `hanzi`** mang 2 `id` khác nhau, kéo theo xung đột cấp độ/pinyin và va chạm khóa duy nhất `(user_id, hanzi)` trên bảng `user_vocab_srs`:
      - `坚持` (`id: 435`, HSK 3 vs `id: 755`, HSK 4)
      - `深刻` (`id: 474`, `HSK 5-6` vs `id: 763`, HSK 4)
      - `贡献` (`476`, `HSK 5-6` vs `777`, `HSK 5`), `逻辑` (`478` vs `775`), `趋势` (`479` vs `771`), `核心` (`480` vs `781`), `协调` (`482` vs `772`), `启发` (`483` vs `773`)
      - Trùng cùng cấp HSK 4/6: `丰富` (`448`/`762`), `适应` (`451`/`757`), `积累` (`452`/`767`), `顺利` (`453`/`764`), `招聘` (`457`/`766`), `态度` (`465`/`758`), `压力` (`510`/`760`), `交流` (`512`/`769`), `循序渐进` (`638` pinyin `xúnxù-jiànjìn` HSK 5 vs `788` `xúnxùjiànjìn` HSK 6), `破釜沉舟` (`653` `pòfǔ-chénzhōu` vs `793` `pòfǔchénzhōu`).
    - **17 mục thiếu trường `hanviet`:** `id: 715..731` (`结识` .. `革新`).
    - **42 mục mang `level: 'HSK 5-6'`** (hybrid) không khớp bộ lọc chuẩn `HSK 5` hoặc `HSK 6`.
    - **160+ nhãn `topic` tự do ngoài `TOPIC_FILTERS`**, gồm cả chuỗi bị cắt cụt `'So sánh mức độ nâng cao với 更, 最 (Càng'`.
  - Chồng chéo giữa các bộ thẻ: **45 từ Hán** xuất hiện ở cả `VOCABULARY_LIST` (830) và `getLocalHsk79Flashcards()` (484), gồm `循序渐进`, `未雨绸缪`, `潜移默化`, `精益求精`, `防微杜渐`, `画龙点睛`, v.v.
  - Lệch mô hình ID & metadata lộ trình (`src/data/learningPathData.js` vs `src/features/curriculum/hsk7to9CurriculumData.js`):
    - `LEARNING_LEVELS` mục `lvl-7` khai báo `totalChapters: 4, totalLessons: 20`, nhưng `LEARNING_CHAPTERS` và `LEARNING_LESSONS` có **0** bản ghi thuộc `lvl-7`.
    - 120 bài HSK 1–6 dùng ID chuỗi `'l-101'..'l-620'`, còn 60 bài HSK 7–9 trong `HSK_79_60_LESSONS` dùng ID số `121..180` (kèm trường phụ `stringId: 'l-701'..`).
- **Đề xuất xử lý (cho Task 38.02 & 38.04):** Chuẩn hóa deduplication theo `(hanzi, level)` (chỉ thực hiện sau khi phê duyệt Task 38.02), bổ sung 17 âm Hán-Việt thiếu, map chuẩn hóa `HSK 5-6` và thống nhất lookup ID bài học `l-701` <-> `121..180`.

---

### [MEDIUM] `DQ-MED-01` — Định nghĩa lặp `CREATE TABLE` và `VIEW` ngay bên trong `supabase/schema.sql`

- **Mô tả:** File schema tổng hợp `supabase/schema.sql` chứa nhiều khối `CREATE TABLE IF NOT EXISTS` và `CREATE OR REPLACE VIEW` bị dán lặp ở cuối file với nguy cơ lệch định nghĩa cột nếu chạy độc lập.
- **Bằng chứng cụ thể:** Quét `supabase/schema.sql` xác nhận **11 bảng** xuất hiện 2 lần (`class_sessions` dòng 1284 & 5187; `session_participants` 1302 & 5206; `session_chat_messages` 1323 & 5229; `hsk_exam_structures` 1598 & 4925; `hsk_exams` 1625 & 4948; `hsk_questions` 1655 & 4978; `hsk_attempts` 1685 & 5008; `hsk_mistakes` 1708 & 5031; `rag_knowledge_sources` 1953 & 2130; `rag_knowledge_chunks` 1976 & 2153; `rag_ingestion_audit_logs` 2001 & 2178) và View `v_hsk_questions_public` được định nghĩa **5 lần** (dòng 1816, 2082, 5072, 5571, 6114).
- **Đề xuất xử lý:** Chốt thứ tự chạy migration chuẩn (`supabase/migrations/` làm chuẩn tăng tiến), tránh chỉnh sửa thủ công trùng khối trong `schema.sql`.

---

### [MEDIUM] `DQ-MED-02` — Lưu trữ dư thừa song song `camelCase` + `snake_case` trong mô hình thẻ SRS cục bộ

- **Mô tả:** Mỗi object thẻ SRS lưu xuống `localStorage` chứa đồng thời 2 bộ thuộc tính cho cùng một giá trị, làm tăng gấp đôi dung lượng JSON lưu trình duyệt (dễ chạm giới hạn quota 5 MB khi tích hợp bộ 11.092 từ) và tiềm ẩn lệch đồng bộ nếu UI chỉ sửa một bên.
- **Bằng chứng cụ thể:** `src/utils/srsEngine.js:104-124` trả về cả `repetitions` & `repetition`, `intervalDays` & `interval_days`, `easeFactor` & `ease_factor`, `lapseCount` & `lapse_count`, `lastReviewedAt` & `last_reviewed_at`, `nextReviewAt` & `next_review_at`, `sourceContext` & `source_context` — bắt nguồn từ sự không đồng nhất giữa bảng `user_vocab_srs` (`repetitions`) và `user_srs_cards` (`repetition`).
- **Đề xuất xử lý:** Chọn 1 schema chuẩn nội bộ (adapter chuyển đổi chỉ thực hiện tại biên API/Supabase).

---

### [MEDIUM] `DQ-MED-03` — Cấu trúc section không đối xứng trong bộ đề HSK 7–9 (`H79001`–`H79003`)

- **Mô tả:** 3 bộ đề tích hợp HSK 7–9 khai báo `maxScore: 300` qua 5 sections, nhưng chỉ Section 1, 2, 3 dùng mảng chuẩn hóa (`questions`/`tasks`, tổng 8 mục = 120 điểm), còn Section 4 (Writing) và Section 5 (Speaking) dùng các field riêng biệt (`partA_ChartEssay`, `partB_ArgumentativeEssay`, `debateTopicZh`), khiến bộ đếm tổng quát đọc thiếu câu/điểm nếu chỉ duyệt `section.questions`.
- **Bằng chứng cụ thể:** `src/features/hsk-exam/data/hsk7to9SampleExamPaper.js` — kiểm tra trực tiếp cho thấy `H79001`, `H79002`, `H79003` đều có `maxScore: 300`, `qCount: 8` và `sumPts: 120` từ 3 section đầu.
- **Đề xuất xử lý (cho Task 38.02/38.04):** Bổ sung adapter chuẩn hóa tổng số nhiệm vụ & thang điểm 300 cho mọi trình kiểm toán/analytics đọc đề HSK 7–9.

---

### [LOW] `DQ-LOW-01` — Nợ cảnh báo `oxlint` nền (731 warnings, 0 errors)

- **Mô tả:** Chạy `npm run lint` trên toàn repo cho `0` lỗi nhưng còn **731 cảnh báo** (`no-unused-vars`, `react(set-state-in-effect)`, `react(preserve-manual-memoization)`, `react(immutability)`).
- **Bằng chứng cụ thể:** Output thực tế từ `npm run lint`: `Found 731 warnings and 0 errors. Finished in 486ms on 598 files with 104 rules using 12 threads.`

---

### [LOW] `DQ-LOW-02` — Bảng SQL và key `localStorage` mồ côi / dư thừa

- **Bằng chứng cụ thể:**
  - Bảng `user_srs_cards` và `srs_review_logs` có trong `supabase/schema.sql` nhưng **0 truy vấn** trong `src/` và `api/`.
  - Key `hanzigo_reading_progress_store` (`src/services/adminAnalyticsService.js:228`) và `hanzigo_hsk_exam_history` (`src/components/DataSubjectRequestModal.jsx:66`) chỉ có code đọc, **0 code ghi**.
  - Key `hanzigo_shared_profiles_cache` (`src/services/progressService.js:130-144`, `src/utils/gamification.js:286`) lưu danh sách profile nhiều tài khoản trong `localStorage` dùng chung (tiềm ẩn rò rỉ metadata giữa các tài khoản trên máy công cộng).

---

## 3. Root Cause

Các bất thường dữ liệu trong Task 38.01 bắt nguồn từ **4 nguyên nhân gốc rễ**:
1. **Tiến hóa nhiều Phase mà chưa hợp nhất bảng nguồn (Schema Layering):** Qua các Phase 10, 22, 26, 27, 29, 34, 37, 38, mỗi tính năng mới thêm bảng riêng (`user_vocab_srs` -> `user_saved_vocabulary` -> `user_vocab_items`; `learning_telemetry_events` -> `unified_learning_events` -> `user_learning_telemetry_events`; `hsk_exams` -> `hsk_exam_papers`; `assignments` -> `classroom_hsk_assignments`) nhưng code cũ không được nối sang bảng mới và `schema.sql` bị ghép lặp.
2. **Chiến lược `getUserStorageKey` áp dụng chưa triệt để:** Các service mới viết giai đoạn trước hoặc dùng pattern `safeReadJson(CONST_KEY)` giữ nguyên key `localStorage` tĩnh không có `userId`, trong khi `progressService.js` và `vocabularyService.js` vẫn vừa ghi key theo user vừa ghi gương ra key toàn cục để tương thích ngược, nhưng `logout()` lại không dọn sạch các key toàn cục đó.
3. **Thiếu kiểm định hợp đồng cột SQL tự động & lỗi bị `try/catch` nuốt âm thầm:** Khi refactor schema (`hsk_attempts`, `audit_logs`, `profiles`, `assignment_submissions`), các query ở `RoadmapPage.jsx`, `adminAnalyticsService.js`, `tutor.js`, `create-user.js` không được đối chiếu với DDL nên lỗi trả về từ Supabase bị nuốt yên lặng.
4. **Hợp nhất nhiều đợt dữ liệu tĩnh không có bước deduplication khóa nghiệp vụ:** `VOCABULARY_LIST` được bổ sung nhiều đợt (`id` 4xx, 5xx, 6xx, 7xx) nên sinh ra 18 `hanzi` trùng ID khác nhau và 45 từ chồng chéo với bộ HSK 7–9.

---

## 4. Implementation Details

> **Tuân thủ chế độ Audit-Only & Hard Stop Gate:**
> - **Không thực hiện bất kỳ chỉnh sửa mã nguồn ứng dụng, dữ liệu, hay migration nào trong Task 38.01.**
> - Các đề xuất khắc phục được lập bản đồ phân bổ về đúng phạm vi từng Task tiếp theo của Phase 38:
>   - **Task 38.02 (Curriculum Quality Assurance):** Xử lý `DQ-HIGH-02` (đề rỗng `hsk1-official-ref-01`, chuẩn hóa điểm câu hỏi), `DQ-HIGH-06` (18 từ trùng, 45 chồng chéo HSK 7–9, 17 `hanviet` thiếu, chuẩn hóa `HSK 5-6` và `topic`), `DQ-MED-03`.
>   - **Task 38.03 (Account Data Synchronization):** Xử lý triệt để `DQ-CRIT-01`, `DQ-CRIT-02` (phân vùng 100% key `localStorage` theo `userId`, dọn key khi logout, sửa `DataSubjectRequestModal.jsx`), và `DQ-HIGH-04` (thêm retry queue + đồng bộ đa thiết bị không ghi đè).
>   - **Task 38.04 (Learning Progress Integrity):** Xử lý `DQ-HIGH-01` (`RoadmapPage.jsx` CBT scores, `adminAnalyticsService.js` submissions), `DQ-HIGH-03` (cầu nối/hợp nhất Source of Truth cho SRS & Telemetry), `DQ-HIGH-04` (`lapse_count`, `writing_answers`), `DQ-HIGH-05` (thống nhất múi giờ `UTC+7` / IANA timezone).
>   - **Task 38.06 (Security & Access Control Review):** Xử lý phần bảo mật liên quan tới `DQ-HIGH-01` (`audit_logs` ở `create-user.js`), `DQ-LOW-02` (`hanzigo_shared_profiles_cache`) và rà soát RLS/RPC toàn hệ thống.
>   - **Task 38.07 (Error Monitoring & Recovery):** Loại bỏ cơ chế nuốt lỗi âm thầm tại các query hỏng và hoàn thiện hàng đợi khôi phục lỗi mạng.

---

## 5. Files Created

- `docs/PHASE_38_TASK_38_01_LEARNING_DATA_QUALITY_AUDIT_REPORT.md` — Báo cáo kiểm toán chất lượng dữ liệu học tập Task 38.01 (tạo mới duy nhất).

---

## 6. Files Modified

- **Không có** (`0` file mã nguồn, test, cấu hình hay tài liệu hiện có bị sửa đổi).

---

## 7. Database Changes

- **Không có.** Tuân thủ nghiêm nguyên tắc không tự chạy migration lên Supabase Production và chế độ Audit-Only của Task 38.01.
- Mọi bất nhất schema đã phát hiện (`user_vocab_srs.lapse_count`, thống nhất `audit_logs`, `immersion_videos.user_id`, chuẩn hóa timezone trong RPC) sẽ được xem xét tạo migration tương thích ngược có hướng dẫn rollback trong các Task triển khai (Task 38.03–38.07) sau khi được phê duyệt.

---

## 8. Security Impact

Kiểm toán chất lượng dữ liệu phát hiện **3 điểm giao thoa trực tiếp với an toàn & bảo mật dữ liệu** (sẽ kiểm tra sâu hơn ở Task 38.06):
1. **Rò rỉ / ghi chéo dữ liệu trên máy dùng chung (`DQ-CRIT-01`, `DQ-CRIT-02`):** Do `logout()` không xóa `hanzigo_completed_lessons`, `hanzigo_vocab_remembered`, `hanzigo_vocab_srs_state` cùng hơn 12 key service toàn cục khác (`hanzigo_hsk_draft_*`, `hanzigo_hsk_mistakes`, `hanzigo_vocab_workspace_decks_v1`, `hanzigo_smart_dict_history_v1`, `hanzigo_shared_profiles_cache`), User B có thể nhìn thấy hoặc đồng bộ nhầm dữ liệu của User A lên tài khoản Cloud của mình.
2. **Mất dấu vết kiểm toán hành chính (`DQ-HIGH-01`):** `api/_handlers/admin/create-user.js:150-161` insert sai cột (`user_id`, `details` thay vì `actor_id`, `metadata`) vào `audit_logs`, làm mất bản ghi kiểm toán khi Admin tạo tài khoản mới.
3. **Tuân thủ trích xuất dữ liệu cá nhân (`DQ-CRIT-02`):** `DataSubjectRequestModal.jsx:64-68` đọc nhầm key lịch sử thi (`hanzigo_hsk_exam_history`) và đọc key toàn cục, dẫn tới gói dữ liệu GDPR/NĐ 13 xuất ra không đầy đủ hoặc không cô lập đúng user.
- **Bảo mật bí mật trong audit:** Không đọc, không in và không lưu bất kỳ API key, token hay biến bí mật nào từ `.env` vào báo cáo.

---

## 9. Test Results

Chạy kiểm thử tự động trên toàn bộ bộ test nền hiện tại (read-only, trước khi sửa bất kỳ code nào):
- **Lệnh `npm test` (`node --env-file=.env --test` trên 96 file test trong `package.json:12`):**
  - Tổng số suites: **31**
  - Tổng số tests: **1141**
  - Pass: **1141** | Fail: **0** | Cancelled: **0** | Skipped: **0** | Todo: **0**
  - Thời gian chạy: **29072.5905 ms** (~29.1s)
  - Lưu ý môi trường: Biến Supabase live chưa cấu hình cho test runner nên nhiều suite chạy ở local simulation mode (`⚠️ Supabase credentials missing. Running in local simulation mode.`).
- **Lệnh `npm run audit:curriculum` (`node scripts/auditCurriculumCompleteness.js`):**
  - Total Score: **100 / 100** (Pillar 1: 25/25, Pillar 2: 25/25, Pillar 3: 25/25, Pillar 4: 25/25).
  - Rà soát 830 từ trong `VOCABULARY_LIST`, 180 bài học (HSK 1–6: 120, HSK 7–9: 60), 0 chuỗi fallback bị phát hiện, 30 đề / 530 câu.
  - *Lưu ý phản biện kiểm toán:* Kết quả `100/100` của script này kiểm tra độ phủ danh mục tối thiểu và không phát hiện được `18` từ trùng `hanzi`, `17` thiếu `hanviet`, đề rỗng `hsk1-official-ref-01`, hay `18` đề lệch tổng điểm như kiểm toán Task 38.01 vừa chỉ ra.
- **Lệnh `npm run lint` (`oxlint`):**
  - Errors: **0** | Warnings: **731** | Files checked: **598** | Rules: **104** | Time: **486 ms**.

---

## 10. Build Results

- **Lệnh `npm run build` (`vite build`):**
  - Trạng thái: **Thành công (exit code 0)**
  - Modules transformed: **2251**
  - Thời gian build: **1.23 s**
  - Chunk lớn nhất (ghi nhận baseline cho Task 38.05):
    - `dist/assets/js/feature-hsk-exam-engine-DP0VPVmn.js`: **1,783.21 kB** (gzip: `529.50 kB`) — vượt ngưỡng cảnh báo 450 kB của Vite.
    - `dist/assets/js/vendor-livekit-C8if_5UX.js`: **521.78 kB** (gzip: `135.63 kB`).
    - `dist/assets/js/data-chinese-BZYYqkq4.js`: **517.92 kB** (gzip: `153.97 kB`).
    - `dist/assets/js/data-learning-path-C_bS36YY.js`: **481.80 kB** (gzip: `179.93 kB`).
    - Cảnh báo `[INEFFECTIVE_DYNAMIC_IMPORT]` đối với `src/services/learningPathService.js` và `src/utils/gamification.js` (bị import đồng thời cả static và dynamic).

---

## 11. Runtime Verification

- **Môi trường local (Node.js scripts kiểm toán tĩnh trên dataset):** Đã thực thi và xác minh trực tiếp toàn bộ cấu trúc dữ liệu của `VOCABULARY_LIST`, `LEARNING_LEVELS`, `LEARNING_CHAPTERS`, `LEARNING_LESSONS`, `CURRICULUM_ALL_LESSONS`, `HSK_79_60_LESSONS`, `HSK_EXAMS`, `HSK_QUESTIONS`, `HSK_7_TO_9_PAPER_CATALOG`, `GRAMMAR_DRILLS_BY_LEVEL`, `LISTENING_DRILLS_BY_LEVEL`, `GRADED_READERS_DATA` và phân tích AST/chuỗi truy vấn Supabase + `localStorage`.
- **Môi trường Production (`https://hanzigo-xi.vercel.app`, Supabase DB live, Upstash live): `[NOT VERIFIED — NO LIVE ACCESS]`**
  - Chưa truy cập được DB Production để kiểm tra các chỉ số dữ liệu thực tế sau đây (đề xuất chạy read-only trên Supabase SQL Editor):
    1. Đếm số lượng bản ghi trùng lặp thực tế trong bảng `public.vocabulary` (theo `hanzi`), `public.user_vocab_srs` (theo `(user_id, hanzi)`), `public.user_lesson_progress` (theo `(user_id, lesson_id)`), `public.user_vocab_items`.
    2. Kiểm tra bản ghi mồ côi (`LEFT JOIN` không khớp `profiles` / `auth.users` / `hsk_exams` / `classrooms`).
    3. Đối soát danh sách migration đã áp dụng trong `supabase_migrations.schema_migrations` so với 43 file migration trong repo (xác nhận các cột `user_vocab_srs`, `user_learning_telemetry_events`, `community_posts.deleted_at`, v.v. đã thực sự tồn tại trên DB live hay chưa).
    4. Kiểm tra runtime browser trên `https://hanzigo-xi.vercel.app` (Core Web Vitals LCP/INP/CLS và Console/Network HTTP 400/500).

---

## 12. Known Issues

- **Không có sự cố phát sinh mới** do Task 38.01 là Audit-Only và giữ nguyên 100% mã nguồn.
- Toàn bộ 13 phát hiện (`DQ-CRIT-01..02`, `DQ-HIGH-01..06`, `DQ-MED-01..03`, `DQ-LOW-01..02`) được ghi nhận nguyên trạng để lần lượt xử lý theo roadmap Task 38.02 – 38.08.
- Các hạng mục dữ liệu live Production thuộc trạng thái **`[NOT VERIFIED — NO LIVE ACCESS]`** như đã liệt kê tại Mục 11.

---

## 13. Remaining Risks

1. **Rủi ro dữ liệu sai lệch trên Production trước khi vá Task 38.03/38.04:** Khi người dùng dùng chung trình duyệt hoặc tải lại trang thiếu key toàn cục, tình trạng ghi đè `profiles.words_learned = 0` và rò rỉ cache SRS/HSK draft vẫn có khả năng xảy ra cho tới khi Task 38.03 hoàn tất.
2. **Rủi ro sai lệch DB live vs Repo migrations:** Nếu một số migration gần đây (như `20261114_3701` hoặc `20261117_3801`) chưa được đẩy lên Supabase Production, số bảng/cột thực tế trên Production có thể khác với 99 bảng phân tích từ thư mục `supabase/`. Cần người vận hành đối soát trước khi triển khai sửa đổi.
3. **Rủi ro hiệu năng gói bundle (`feature-hsk-exam-engine` 1,783 kB):** Chưa được tối ưu trong Task 38.01, chuyển sang đo đạc và xử lý ở Task 38.05.

---

## 14. Acceptance Criteria

| Tiêu chí Task 38.01 | Trạng thái | Bằng chứng |
|---|---|---|
| Kiểm toán tính toàn vẹn cấu trúc dữ liệu (duplicate, thiếu trường, sai kiểu) toàn hệ thống | Đạt | Đã quét 830 từ vựng, 180 bài học, 30 đề/530 câu, 180 drills, 24 graded readers, 99 bảng SQL & 177 storage keys |
| Kiểm tra khóa ngoại & quan hệ bảng/service | Đạt | 0 broken DDL FKs; phát hiện 4 truy vấn JS/TS sai cột/bảng & phân mảnh 6 miền bảng |
| Phân biệt rõ dữ liệu chưa đồng bộ vs dữ liệu thực sự bị mất | Đạt | Bảng đối chiếu 8 trường hợp cụ thể ở `DQ-HIGH-04` |
| Kiểm tra chuẩn timestamp, UTC vs local date và chênh lệch schema lịch sử | Đạt | 31 UTC vs 40 `getLocalDateString()` + SQL timezone collision (`DQ-HIGH-05`), phân mảnh schema (`DQ-HIGH-03`) |
| Kiểm tra nhất quán contract giữa Supabase và LocalStorage/SessionStorage | Đạt | Chỉ rõ 12+ module unscoped keys (`DQ-CRIT-01`, `DQ-CRIT-02`) |
| Ràng buộc Audit-Only: Không sửa code ứng dụng, không xóa/sửa dữ liệu | Đạt | Chỉ tạo file báo cáo tại `docs/`, `git status` không có file tracked nào bị sửa |
| Xuất báo cáo chuẩn 15 mục & dừng lại ở Hard Stop Gate chờ phê duyệt | Đạt | File báo cáo đủ 15 mục, dừng trước Task 38.02 |

---

## 15. Final Status

- **`AUDIT COMPLETE`** — Đã hoàn tất kiểm toán chất lượng dữ liệu học tập Phase 38 Task 38.01 và lưu báo cáo đầy đủ bằng chứng tại `docs/PHASE_38_TASK_38_01_LEARNING_DATA_QUALITY_AUDIT_REPORT.md`.
- **`TESTS PASSED`** — Baseline test suite hiện tại đạt `1141/1141` pass (`0` fail, `0` skipped trên 31 suites, chạy trong local simulation mode với Supabase fallback); `npm run audit:curriculum` đạt `100/100`; `npm run lint` đạt `0` errors (`731` warnings).
- **`BUILD VERIFIED`** — `npm run build` (`vite build`) thành công (`2251` modules, `1.23s`).
- **`SECURITY VERIFICATION PARTIAL`** — Xác minh tĩnh phát hiện rủi ro lây nhiễm dữ liệu chéo tài khoản qua key `localStorage` không phân vùng và lỗi ghi `audit_logs` ở cấp mã nguồn; RLS/authz toàn diện trên Production sẽ được kiểm toán sâu tại Task 38.06.
- **`PRODUCTION VERIFICATION PARTIAL`** — Do môi trường không có quyền truy cập Supabase DB live, Upstash live và trình duyệt đo RUM/Core Web Vitals trên `https://hanzigo-xi.vercel.app`, các truy vấn kiểm đếm dữ liệu thực tế trên Production được đánh dấu `[NOT VERIFIED — NO LIVE ACCESS]` để vận hành đối soát.
- **HARD STOP GATE:** Dừng lại tại đây theo đúng quy trình, chờ bạn đánh giá và phê duyệt trước khi chuyển sang **`TASK 38.02 — CURRICULUM QUALITY ASSURANCE`**.
