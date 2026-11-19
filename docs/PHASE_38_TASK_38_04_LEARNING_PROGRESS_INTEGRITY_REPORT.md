# BÁO CÁO NGHIỆM THU TASK 38.04 — LEARNING PROGRESS INTEGRITY (PHASE 38)

**Ngày hoàn thành:** 19/11/2026  
**Phạm vi:** Vá bù `dictionaryService.ts` (`DQ-CRIT-02`), sửa truy vấn sai cột/bảng (`DQ-HIGH-01`), bảo toàn dữ liệu SRS `lapse_count` & `writing_answers` & idempotent CBT (`DQ-HIGH-04`), cầu nối Source of Truth SRS-Telemetry (`DQ-HIGH-03`), chuẩn hóa múi giờ địa phương `UTC+7` (`DQ-HIGH-05`), viết test hồi quy và xuất migration tương thích ngược.  
**Trạng thái tổng thể:** **PASS (Local Verified — Chờ phê duyệt tại Hard Stop Gate trước Task 38.05)**

---

## 1. Thông tin định danh nhiệm vụ (Task Metadata)
- **Phase / Task:** Phase 38 — Task 38.04: Learning Progress Integrity
- **Repository:** `https://github.com/haidang1603/Hanzigo.git` (nhánh `main`)
- **Môi trường kiểm chứng:** Local Node.js Test Runner (`--env-file=.env --test`), Oxlint, Vite Production Build
- **Hard Stop Gate:** Dừng sau khi hoàn tất báo cáo để chờ người dùng đánh giá trước khi chuyển sang Task 38.05.

---

## 2. Tóm tắt điều hành (Executive Summary)
- **Vá bù `DQ-CRIT-02` (`dictionaryService.ts`):** Đã phân vùng nốt `AI_CACHE_STORAGE_KEY` (`hanzigo_smart_dict_ai_cache_v1`) theo `userId` qua `getUserStorageKey`, thống nhất `getUserScopedKey` và bổ sung đủ 3 key của `dictionaryService.ts` vào `LEGACY_UNSCOPED_LEARNING_KEYS`.
- **Xử lý `DQ-HIGH-01` (Truy vấn sai cột/bảng):** Sửa `RoadmapPage.jsx` query `hsk_attempts` (`exam_id, score, max_score` thay vì `hsk_level, total_score`), sửa `adminAnalyticsService.js` (`classroom_assignment_submissions` thay vì `submissions`, và đọc `hanzigo_reading_progress_*` thay vì key chết `hanzigo_reading_progress_store`), và sửa `api/_handlers/ai/tutor.js` (`profiles.level` thay vì `hsk_level, target_hsk`).
- **Xử lý `DQ-HIGH-04` (Bảo toàn SRS & CBT):** Bảo toàn `lapse_count` trong `vocabularyService.js` (kèm fallback an toàn khi cột SQL chưa được migrate trên Production), bổ sung `writing_answers` + `upsert(..., { onConflict: 'id' })` trong `hskService.js` để chống trùng lặp attempt.
- **Xử lý `DQ-HIGH-03` & `DQ-HIGH-05`:** Nối sự kiện ôn tập `user_vocab_srs` trong `VocabularyPage.jsx` vào Unified Telemetry (`recordLearningEvent` + `trackLearningEvent`), chuẩn hóa ngày địa phương (`getLocalDateString`) tại 6 module client và tạo migration tương thích ngược [20261119_3804_learning_progress_integrity.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261119_3804_learning_progress_integrity.sql) cho `lapse_count` và `Asia/Ho_Chi_Minh`.

---

## 3. Phạm vi kiểm định & Tài liệu tham chiếu (Scope & Evidence)
- **Codebase đã rà soát:** `src/services/dictionaryService.ts`, `src/utils/gamification.js`, `src/pages/RoadmapPage.jsx`, `src/services/adminAnalyticsService.js`, `api/_handlers/ai/tutor.js`, `src/services/vocabularyService.js`, `src/services/hskService.js`, `src/pages/VocabularyPage.jsx`, `src/pages/DashboardPage.jsx`, `src/services/aiLearningCoachService.js`, `src/components/learning/AiLearningCoachWidget.jsx`, `src/services/srsRetentionService.ts`, `src/core/telemetry/learningTelemetryService.js`, `src/features/analytics/studentAnalyticsService.ts`, `src/pages/CommunityPage.jsx`.
- **Schema & Migrations đối chiếu:** [supabase/schema.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/schema.sql), [20261114_3301_classroom_assignments_and_whiteboard.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261114_3301_classroom_assignments_and_whiteboard.sql), [20261112_student_analytics_rpc.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261112_student_analytics_rpc.sql), [20261117_3801_learning_telemetry_hub.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261117_3801_learning_telemetry_hub.sql).

---

## 4. Phương pháp & Nguyên tắc thực hiện (Methodology)
1. **Audit-First:** Truy vết từng cột SQL thực tế trong `supabase/schema.sql` và `supabase/migrations/` trước khi chỉnh sửa query.
2. **Bảo toàn nghiệp vụ cốt lõi:** Không sửa công thức chấm điểm CBT (`examScoringEngine.js`) hay thuật toán SM-2 (`srsEngine.js`).
3. **Tương thích ngược & An toàn Production:** Không tự chạy migration lên Supabase Production; tạo file migration `IF NOT EXISTS` kèm hướng dẫn Rollback và bổ sung fallback ở tầng client nếu cột mới chưa tồn tại trên DB.

---

## 5. Kết quả Audit chi tiết theo từng mã lỗi

| Mã lỗi | Trạng thái trước 38.04 | Bằng chứng thực tế phát hiện | Trạng thái sau 38.04 |
| :--- | :--- | :--- | :--- |
| `DQ-CRIT-02` (phần bù) | `FAIL` | `AI_CACHE_STORAGE_KEY` trong `dictionaryService.ts` chưa phân vùng theo `userId`; 3 key từ điển chưa có trong `LEGACY_UNSCOPED_LEARNING_KEYS`. | `PASS` |
| `DQ-HIGH-01` | `FAIL` | `RoadmapPage.jsx` query `hsk_level, total_score`; `adminAnalyticsService.js` query `submissions` và đọc `hanzigo_reading_progress_store`; `tutor.js` query `hsk_level, target_hsk`. | `PASS` |
| `DQ-HIGH-04` | `FAIL` | `user_vocab_srs` chưa lưu `lapse_count`; `hskService.js` thiếu `writing_answers` trong `syncAttemptToSupabase` và dùng `.insert()` dễ lỗi khi retry. | `PASS` (kèm migration chờ chạy DB) |
| `DQ-HIGH-03` | `PARTIAL` | Ôn tập ở `VocabularyPage.jsx` (`user_vocab_srs`) chưa bắn sự kiện sang Unified Telemetry (`learningDataService` / `learningTelemetryService`). | `PASS` |
| `DQ-HIGH-05` | `FAIL` | 6 module client + 2 SQL RPC dùng `UTC` (`toISOString().slice(0,10)` / `AT TIME ZONE 'UTC'`), lệch ngày trong khung `00:00–06:59 UTC+7`. | `PASS` (client) / Migration sẵn sàng (SQL) |

---

## 6. Vá bù `DQ-CRIT-02`: Phân vùng `dictionaryService.ts`
- **Tệp chỉnh sửa:** [src/services/dictionaryService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/dictionaryService.ts), [src/utils/gamification.js](file:///d:/DELL/Dowloads/HanziGo/src/utils/gamification.js)
- **Chi tiết triển khai:**
  - `getUserScopedKey(base, user)` trong `dictionaryService.ts` ủy quyền trực tiếp cho `getUserStorageKey(base, user || null)`.
  - `searchDictionaryMultimodal` và `fetchOrGenerateDictionaryEntry` đọc/ghi `AI_CACHE_STORAGE_KEY` qua `getUserScopedKey(AI_CACHE_STORAGE_KEY, user)`.
  - Bổ sung `'hanzigo_smart_dict_history_v1'`, `'hanzigo_smart_dict_saved_deck_v1'`, `'hanzigo_smart_dict_ai_cache_v1'` vào `LEGACY_UNSCOPED_LEARNING_KEYS` để `logout()` dọn sạch toàn bộ cache cũ.

---

## 7. Xử lý `DQ-HIGH-01`: Sửa truy vấn Supabase sai cột & bảng
1. **[src/pages/RoadmapPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/RoadmapPage.jsx):**
   - Sửa query `hsk_attempts` từ `.select('hsk_level, total_score')` sang `.select('exam_id, score, max_score').order('score', { ascending: false })`.
   - Dùng helper mới `mapCbtAttemptsToBestScores(attempts)` (export từ `hskService.js`) ánh xạ `exam_id` qua `HSK_EXAMS` sang đúng cấp HSK `1..9`, loại bỏ các bản ghi `draft`/`in_progress`.
2. **[src/services/adminAnalyticsService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/adminAnalyticsService.js):**
   - Đổi `supabase.from('submissions')` sang bảng thực tế `supabase.from('classroom_assignment_submissions')`.
   - Thay nhánh fallback đọc key chết `hanzigo_reading_progress_store` bằng tổng hợp từ các key phân vùng `hanzigo_reading_progress_*`.
3. **[api/_handlers/ai/tutor.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/ai/tutor.js):**
   - Đổi `.select('hsk_level, target_hsk')` sang `.select('level')` và trích xuất mã cấp HSK hợp lệ từ chuỗi `profile.level` (ví dụ `'HSK 1 - Sơ cấp'` → `'HSK 1'`).
4. **Giữ nguyên theo phân công:** Lỗi `audit_logs` ở `api/_handlers/admin/create-user.js` giữ nguyên cho **Task 38.06**.

---

## 8. Xử lý `DQ-HIGH-04`: Bảo toàn SRS `lapse_count`, `writing_answers` & Idempotency
- **[src/services/vocabularyService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/vocabularyService.js):**
  - `saveUserVocabSrsCard` bảo toàn `lapse_count: srsCard.lapseCount ?? srsCard.lapse_count ?? 0`, đồng bộ cả nhánh hàng đợi offline (`interval_days`, `stage`, `pinyin`, `meaning`, `level`, `lapse_count`).
  - Bổ sung cơ chế fallback an toàn: nếu Supabase trả lỗi `42703` / thiếu cột `lapse_count` trước khi chạy migration, tự động retry `upsert` không kèm `lapse_count` để không làm gián đoạn việc lưu thẻ của người dùng.
  - `syncUserVocabSrsFromCloud` đọc và giữ lại `lapseCount` trong `srsMap[hanzi]`.
- **[src/services/hskService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/hskService.js):**
  - `syncAttemptToSupabase` bổ sung `writing_answers: attempt.writingAnswers || attempt.writing_answers || {}` và chuyển từ `.insert(payload)` sang `.upsert(payload, { onConflict: 'id' })` để đảm bảo idempotency khi retry.
- **[src/pages/DashboardPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/DashboardPage.jsx):**
  - Xác nhận thống kê hoàn thành bài học chỉ đọc `hanzigo_completed_lessons` (không tính đề thi `draft`/`in_progress`).

---

## 9. Xử lý `DQ-HIGH-03`: Cầu nối Source of Truth giữa SRS & Telemetry
- **[src/pages/VocabularyPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/VocabularyPage.jsx):**
  - Khi người dùng ôn tập từ vựng qua `user_vocab_srs` (`saveUserVocabSrsCard`), hệ thống đồng thời ghi nhận sự kiện chuẩn hóa qua `recordLearningEvent` (`sourceModule: 'srs_review'`, `skillDomain: 'vocabulary'`) và `trackLearningEvent` (`eventType: 'vocab_review'`).
  - Nhờ đó, dữ liệu ôn tập từ `VocabularyPage` (`user_vocab_srs`) và `VocabularyWorkspace` (`user_vocab_items`) cùng hội tụ về Dashboard Analytics & Telemetry mà không cần xóa hay gộp cưỡng bức các bảng lịch sử.

---

## 10. Xử lý `DQ-HIGH-05`: Chuẩn hóa Múi giờ địa phương (`UTC+7`)
Đã thay thế `toISOString().split('T')[0]` / `.slice(0, 10)` và `Date.UTC` bằng `getLocalDateString()` / ngày địa phương tại toàn bộ 6 điểm mục tiêu:
1. [src/services/aiLearningCoachService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/aiLearningCoachService.js): Loại bỏ nhánh ghi cache phụ `utcDateStr` theo UTC, chỉ dùng `todayStr` (`getLocalDateString()`).
2. [src/components/learning/AiLearningCoachWidget.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/learning/AiLearningCoachWidget.jsx): Dùng `getLocalDateString()` khi đọc/ghi `hanzigo_coach_steps_${today}`.
3. [src/services/srsRetentionService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/srsRetentionService.ts): Dùng `startOfToday.setHours(0, 0, 0, 0)` và `getLocalDateString(dayStart)` trong `workloadForecast` 7 ngày.
4. [src/core/telemetry/learningTelemetryService.js](file:///d:/DELL/Dowloads/HanziGo/src/core/telemetry/learningTelemetryService.js): Chuyển `formatIsoDate` và `buildSrsForecast7Days` sang `getLocalDateString` và ngày địa phương.
5. [src/features/analytics/studentAnalyticsService.ts](file:///d:/DELL/Dowloads/HanziGo/src/features/analytics/studentAnalyticsService.ts): Chuyển `toUtcDateKey` và `buildDateRangeKeys` sang `getLocalDateString` và `setHours(0, 0, 0, 0)`.
6. [src/pages/CommunityPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/CommunityPage.jsx): Dùng `getLocalDateString()` cho thử thách 21 ngày và kiểm tra điểm danh hằng ngày.

---

## 11. Migration SQL tương thích ngược (Chưa chạy Production)
- **Tệp mới:** [supabase/migrations/20261119_3804_learning_progress_integrity.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261119_3804_learning_progress_integrity.sql)
- **Nội dung:**
  1. `ALTER TABLE public.user_vocab_srs ADD COLUMN IF NOT EXISTS lapse_count INT NOT NULL DEFAULT 0;`
  2. `CREATE OR REPLACE VIEW public.student_telemetry_daily_summary` chuẩn hóa `DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh')`.
  3. `CREATE OR REPLACE FUNCTION public.get_student_activity_heatmap` chuẩn hóa `Asia/Ho_Chi_Minh`.
  4. `CREATE OR REPLACE FUNCTION public.get_user_telemetry_dashboard_summary` chuẩn hóa `v_today_vn := (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE` và `AT TIME ZONE 'Asia/Ho_Chi_Minh'`.
  5. Kèm hướng dẫn `ROLLBACK GUIDE` đầy đủ ở cuối file. **Chưa thực thi lên Production.**

---

## 12. Kiểm thử hồi quy (Unit & Integration Tests)
- **Bộ test mới:** [tests/progressIntegrityPhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/progressIntegrityPhase38.test.js) (đã đăng ký vào `package.json`, đạt **5/5 pass**):
  1. `RoadmapPage` ánh xạ đúng `exam_id, score` từ `hsk_attempts` qua `HSK_EXAMS`, bỏ qua `draft`, không nhảy cấp sai; xác minh SQL fix tại `RoadmapPage.jsx`, `adminAnalyticsService.js`, `tutor.js`.
  2. `hskService` bảo toàn `writing_answers` và dùng `upsert(..., { onConflict: 'id' })` idempotent.
  3. `vocabularyService` bảo toàn `lapse_count` khi lưu/đồng bộ và fallback an toàn khi cột SQL chưa tồn tại; xác minh file migration `20261119_3804`.
  4. Đồng nhất ngày địa phương trong khung giờ `00:00–06:59 UTC+7` (không bị lùi ngày UTC).
  5. `dictionaryService.ts` phân vùng đủ 3 key theo `userId` và có mặt trong `LEGACY_UNSCOPED_LEARNING_KEYS`.

---

## 13. Kết quả Verification (`lint`, `test`, `build`) — Trước & Sau
| Kiểm tra | Trước Task 38.04 (sau 38.03) | Sau Task 38.04 (lần chạy cuối) | Trạng thái |
| :--- | :--- | :--- | :--- |
| `npm run lint` (`oxlint`) | `0 errors`, `731 warnings` (`600 files`) | `0 errors`, `731 warnings` (`601 files`, `420ms`) | `PASS` |
| `npm test` (`node --test`) | `1149/1149 pass` (`31 suites`) | `1154/1154 pass`, `0 fail`, `0 skipped` (`31 suites`, `28085.1573ms`) | `PASS` |
| `npm run build` (`vite build`) | `2251 modules`, `1.01s` | `2251 modules`, `1.18s` | `PASS` |

---

## 14. Ràng buộc phạm vi & Tồn đọng ngoài phạm vi (Scope Guardrails)
- **Không thay đổi:** Công thức chấm điểm CBT (`examScoringEngine.js`), thuật toán SM-2 (`srsEngine.js`), kích thước bundle Vite (để dành Task 38.05), và chính sách RLS / `audit_logs` ở `create-user.js` (để dành Task 38.06).
- **Rủi ro / Lưu ý:** Migration `20261119_3804_learning_progress_integrity.sql` mới được tạo trong repo, chưa áp dụng lên Supabase Production; nhờ cơ chế fallback `42703` trong `vocabularyService.js`, ứng dụng vẫn vận hành bình thường trước và sau khi bạn chạy migration.

---

## 15. Kết luận & Hard Stop Gate
**Task 38.04 — Learning Progress Integrity đạt trạng thái `PASS` (đã xác minh đầy đủ qua `lint`, `test` 1154/1154 và `build`).**  
Hệ thống **DỪNG TẠI HARD STOP GATE** chờ bạn đánh giá và phê duyệt báo cáo trước khi chuyển sang **Task 38.05**.
