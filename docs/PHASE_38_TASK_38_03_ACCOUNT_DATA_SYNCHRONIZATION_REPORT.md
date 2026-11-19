# BÁO CÁO NGHIỆM THU TASK 38.03 — ACCOUNT DATA SYNCHRONIZATION (PHASE 38)

**Ngày hoàn thành:** 19/11/2026  
**Phạm vi:** Cô lập dữ liệu tài khoản theo `userId`, chống ghi đè dữ liệu Cloud từ cache rỗng (`DQ-CRIT-01`), phân vùng `localStorage` cho các service & sửa GDPR Data Export (`DQ-CRIT-02`), cô lập hàng đợi offline kèm idempotency.  
**Trạng thái:** **HOÀN TẤT — CHỜ PHÊ DUYỆT TẠI HARD STOP GATE TRƯỚC KHI SANG TASK 38.04**

---

## 1. Tóm tắt điều hành (Executive Summary)
- **Đã xử lý triệt để `DQ-CRIT-01`:** Chấm dứt hoàn toàn việc đọc/ghi vào các key `localStorage` toàn cục không phân vùng (`hanzigo_completed_lessons`, `hanzigo_vocab_remembered`, `hanzigo_vocab_review`, `hanzigo_vocab_srs_state`, `hanzigo_shared_profiles_cache`) trong `progressService.js`, `vocabularyService.js`, `gamification.js` và `AuthContext.jsx`. Bổ sung bảo vệ chống ghi đè `profiles.words_learned = 0` khi thiết bị mới có cache rỗng và hợp nhất bài học đã hoàn thành bằng phép hợp (Set union) giữa Cloud và local.
- **Đã xử lý triệt để `DQ-CRIT-02`:** Phân vùng toàn bộ key lưu trữ theo `userId` (`getUserStorageKey`) trên các service dùng key tĩnh (`vocabWorkspaceService.ts`, `hskService.js`, `learningDataService.ts`, `learningTelemetryService.js`, `useUnifiedEcosystemStore.ts`, `OfflineSyncManager.js`, `listeningStudioService.ts`, `pronunciationLabService.ts`, `translationStudioService.ts`, `textbookCompanionService.ts`, `classroomService.js`, `materialsStorage.js`) và sửa `DataSubjectRequestModal.jsx` để export đúng dữ liệu của người dùng đang đăng nhập (`hanzigo_hsk_attempts`).
- **Đã kiểm chứng hồi quy:** Bổ sung bộ test `tests/accountSyncPhase38.test.js` (5/5 test pass). Toàn bộ hệ thống đạt **1149/1149 unit/integration tests pass**, **0 lỗi `oxlint`**, **`vite build` thành công** (`2251 modules`, `1.01s`).

---

## 2. Bối cảnh & Bằng chứng Audit trước khi sửa
Trước Task 38.03, audit thực tế mã nguồn ghi nhận các rủi ro nghiêm trọng:
1. **`DQ-CRIT-01` (Ghi đè Cloud & lây nhiễm chéo tài khoản):**
   - `src/services/progressService.js`: `triggerCloudSync` đọc trực tiếp `localStorage.getItem('hanzigo_vocab_remembered')` và `localStorage.getItem('hanzigo_completed_lessons')` (toàn cục) rồi đẩy thẳng `words_learned: rememberedWords.length` lên `profiles` Supabase (khiến máy mới có cache rỗng ghi đè `words_learned = 0` lên Cloud), đồng thời ghi vào `hanzigo_shared_profiles_cache`. `loadAllUserDataFromDb` ghi đè vào key toàn cục `hanzigo_completed_lessons`, `hanzigo_streak_count`, `hanzigo_last_study_date`.
   - `src/services/vocabularyService.js`: `syncUserVocabSrsFromCloud` ghi gương (mirror) toàn bộ `srsMap`, `remembered`, `review` ra 3 key toàn cục không phân vùng. `saveUserVocabSrsCard` nuốt lỗi mạng mà không đẩy vào hàng đợi đồng bộ offline.
   - `src/context/AuthContext.jsx`: `logout()` chỉ xóa 10 key phiên, bỏ sót hàng loạt key học tập toàn cục cũ.
2. **`DQ-CRIT-02` (Key tĩnh dùng chung giữa nhiều tài khoản & lỗi GDPR Data Export):**
   - `src/services/vocabWorkspaceService.ts` (dòng 356): khi User B có `0` deck trên Supabase (`data.length === 0`), hàm `listVocabDecks` rơi ngược về `local` đọc từ key tĩnh `hanzigo_vocab_workspace_decks_v1` — làm lộ toàn bộ deck của User A sang User B.
   - `src/services/hskService.js`: `STORAGE_ATTEMPTS_KEY`, `STORAGE_DRAFT_PREFIX`, `STORAGE_MISTAKES_KEY` dùng key toàn cục; `getMistakeNotebook` và `getUserExamHistory` cho phép gộp bản ghi `userId === null` của Guest vào tài khoản đã đăng nhập; `syncAttemptToSupabase` không đẩy vào `OfflineSyncManager` khi lỗi mạng.
   - `src/components/DataSubjectRequestModal.jsx`: đọc các key toàn cục không theo `user` và tham chiếu nhầm `hanzigo_hsk_exam_history` (thay vì `hanzigo_hsk_attempts`).
   - Nhiều service khác (`OfflineSyncManager.js`, `learningDataService.ts`, `learningTelemetryService.js`, `useUnifiedEcosystemStore.ts`, `listeningStudioService.ts`, `pronunciationLabService.ts`, `translationStudioService.ts`, `textbookCompanionService.ts`, `classroomService.js`, `materialsStorage.js`) dùng key `localStorage` tĩnh chưa gắn `userId`.

---

## 3. Thiết kế kiến trúc & Nguyên tắc xử lý
1. **Nguồn chân lý (Source of Truth):** Supabase là nguồn chân lý cho dữ liệu tài khoản đã đăng nhập; `localStorage` chỉ đóng vai trò cache phân vùng theo `userId` thông qua `getUserStorageKey(key, user)` (`src/utils/gamification.js`).
2. **Không ghi đè ngược từ cache rỗng:** Khi `rememberedWords.length === 0` ở cache local, `triggerCloudSync` không ghi đè `profiles.words_learned = 0` lên Supabase; khi có dữ liệu, giữ `Math.max(rememberedWords.length, targetUser?.wordsLearned || 0)`.
3. **Hợp nhất an toàn (Conflict Resolution):** `loadAllUserDataFromDb` hợp nhất danh sách bài học đã hoàn thành giữa local scoped và Cloud bằng phép hợp (Set union).
4. **Hàng đợi Offline cô lập & Idempotent:** `OfflineSyncManager.js` phân vùng `SYNC_QUEUE_KEY` và `LAST_SYNC_KEY` theo `userId`, chống trùng lặp bằng `idempotencyKey` (cập nhật in-place thay vì nhân bản), và hỗ trợ `onConflict` khi flush lên Supabase.
5. **Dọn dẹp toàn diện khi đăng xuất:** `clearLegacyUnscopedLearningKeys()` xóa toàn bộ danh sách `LEGACY_UNSCOPED_LEARNING_KEYS` và mọi key nháp `hanzigo_hsk_draft_*` khi `logout()`.

---

## 4. Chi tiết các thay đổi đã triển khai

### 4.1. Lõi Auth, Tiến độ & SRS (`DQ-CRIT-01`)
| Tệp | Thay đổi chính |
| :--- | :--- |
| [src/utils/gamification.js](file:///d:/DELL/Dowloads/HanziGo/src/utils/gamification.js) | Gỡ bỏ ghi `hanzigo_shared_profiles_cache` trong `awardXp`; export `LEGACY_UNSCOPED_LEARNING_KEYS` và `clearLegacyUnscopedLearningKeys()` (xóa cả `hanzigo_hsk_draft_*`). |
| [src/services/progressService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/progressService.js) | Đọc/ghi `hanzigo_vocab_remembered` và `hanzigo_completed_lessons` qua `getUserStorageKey`; bảo vệ `profiles.words_learned` không bị ghi đè thành `0` từ cache rỗng; hợp nhất bài học Cloud + local (Set union); gỡ ghi `hanzigo_shared_profiles_cache` và bỏ mirror key toàn cục trong `loadAllUserDataFromDb`. |
| [src/services/vocabularyService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/vocabularyService.js) | Xóa 3 lệnh mirror ghi key toàn cục (`hanzigo_vocab_srs_state`, `hanzigo_vocab_remembered`, `hanzigo_vocab_review`) trong `syncUserVocabSrsFromCloud`; bổ sung `enqueueOfflineMutation` với `idempotencyKey: srs:${userId}:${hanzi}` và `onConflict: 'user_id,hanzi'` khi `saveUserVocabSrsCard` gặp lỗi mạng. |
| [src/context/AuthContext.jsx](file:///d:/DELL/Dowloads/HanziGo/src/context/AuthContext.jsx) | Gọi `clearLegacyUnscopedLearningKeys()` trong `logout()`. |

### 4.2. Phân vùng Service & Sửa GDPR Data Export (`DQ-CRIT-02`)
| Tệp | Thay đổi chính |
| :--- | :--- |
| [src/core/sync/OfflineSyncManager.js](file:///d:/DELL/Dowloads/HanziGo/src/core/sync/OfflineSyncManager.js) | Phân vùng `SYNC_QUEUE_KEY` & `LAST_SYNC_KEY` qua `getUserStorageKey`; hỗ trợ `idempotencyKey` (deduplicate in-place) và `onConflict` khi flush; lọc `exportUserLearningSnapshot` chỉ xuất key thuộc user hiện tại. |
| [src/services/vocabWorkspaceService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/vocabWorkspaceService.ts) | Phân vùng `DECKS_STORAGE_KEY` & `ITEMS_STORAGE_KEY` qua `getDecksStorageKey(user)` và `getItemsStorageKey(user)`; sửa `listVocabDecks` / `listVocabItems` trả về `[]` khi Cloud trả 0 bản ghi thay vì fallback sang cache user khác. |
| [src/services/hskService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/hskService.js) | Phân vùng attempts, drafts, mistakes theo `userId`; chặn trộn bản ghi Guest (`userId === null`) vào user đã đăng nhập trong `getMistakeNotebook` & `getUserExamHistory`; tách luồng `mergeLocalAttemptsToUser` sang namespace của `userId`; đẩy lỗi `syncAttemptToSupabase` vào `OfflineSyncManager`. |
| [src/services/learningDataService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/learningDataService.ts) | Phân vùng `OFFLINE_TELEMETRY_QUEUE_KEY` và `LOCAL_MISTAKE_RECORDS_KEY` qua `getUserStorageKey`. |
| [src/core/telemetry/learningTelemetryService.js](file:///d:/DELL/Dowloads/HanziGo/src/core/telemetry/learningTelemetryService.js) | Phân vùng `TELEMETRY_BUFFER_KEY`, `TELEMETRY_HISTORY_KEY`, `ROADMAP_PROGRESS_STORAGE_KEY`, `VOCAB_ITEMS_STORAGE_KEY` qua `getUserStorageKey`; reset buffer bộ nhớ khi đổi scope user (`loadedStorageScope`); bổ sung tham số `user` cho `getTelemetryBuffer` / `getTelemetryLocalHistory` / `clearTelemetryLocalState`. |
| [src/core/ecosystem/useUnifiedEcosystemStore.ts](file:///d:/DELL/Dowloads/HanziGo/src/core/ecosystem/useUnifiedEcosystemStore.ts) | Phân vùng `EVENTS_KEY` theo `userId`. |
| [src/services/listeningStudioService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/listeningStudioService.ts) | Phân vùng `LOGS_STORAGE_KEY` theo `user`. |
| [src/services/pronunciationLabService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/pronunciationLabService.ts) | Phân vùng `ATTEMPTS_STORAGE_KEY` theo `user`. |
| [src/services/translationStudioService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/translationStudioService.ts) | Phân vùng `LOCAL_SUBMISSIONS_KEY` theo `user`. |
| [src/services/textbookCompanionService.ts](file:///d:/DELL/Dowloads/HanziGo/src/services/textbookCompanionService.ts) | Phân vùng `LOCAL_ENROLLMENTS_KEY` qua `readLocalEnrollments(user)` / `writeLocalEnrollments(list, user)`. |
| [src/services/classroomService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/classroomService.js) | Phân vùng `getLocalItem` / `setLocalItem` qua `getUserStorageKey(key)`. |
| [src/utils/materialsStorage.js](file:///d:/DELL/Dowloads/HanziGo/src/utils/materialsStorage.js) | Phân vùng `hanzigo_materials`, `hanzigo_materials_version`, `hanzigo_custom_vocab`, `hanzigo_custom_lessons` qua `getUserStorageKey`. |
| [src/components/DataSubjectRequestModal.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/DataSubjectRequestModal.jsx) | Đọc key phân vùng theo `user` qua `getUserStorageKey` và sửa `hanzigo_hsk_exam_history` → `hanzigo_hsk_attempts`. |

---

## 5. Cập nhật kiểm thử & Khóa hồi quy
- **File test mới:** [tests/accountSyncPhase38.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/accountSyncPhase38.test.js) (đã đăng ký vào script `test` trong [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json)):
  1. `Logout & clearLegacyUnscopedLearningKeys` xóa sạch toàn bộ key toàn cục cũ và `hanzigo_hsk_draft_*`, giữ nguyên namespace riêng của tài khoản.
  2. HSK drafts, mistake notebook và attempt history cô lập hoàn toàn giữa User A, User B và Guest (`userId === null`); `mergeLocalAttemptsToUser` chỉ chuyển dữ liệu Guest sang đúng user đích.
  3. `OfflineSyncManager` cô lập queue theo `userId`, deduplicate theo `idempotencyKey`, truyền `{ onConflict }` khi flush, và không đụng queue của user khác.
  4. Telemetry buffer và `exportUserLearningSnapshot` (GDPR Export) chỉ xuất key của user hiện tại.
  5. Kiểm tra tĩnh (static regression guards) đảm bảo `progressService.js`, `vocabularyService.js`, `gamification.js`, `vocabWorkspaceService.ts`, `DataSubjectRequestModal.jsx` không quay lại dùng key toàn cục hoặc `hanzigo_shared_profiles_cache`.
- **Cập nhật test legacy cho phù hợp phân vùng `userId`:**
  - [tests/materialsIntegration.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/materialsIntegration.test.js): cập nhật assertion sang `hanzigo_materials_version_guest`.
  - [tests/aiPersonalizationPhase4.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/aiPersonalizationPhase4.test.js): cập nhật mock HSK attempts/mistakes sang key phân vùng `${testUser.id}`.
  - [tests/hskPhase2LearningProgress.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/hskPhase2LearningProgress.test.js): cập nhật assertion đọc mistakes/attempts từ key phân vùng `${user.id}` / `${targetUserId}`.

---

## 6. Kết quả Verification (`lint`, `test`, `build`)
Chạy sau lần chỉnh sửa cuối cùng:
- **`npm run lint` (`oxlint`):** **PASS** — `0 errors`, `731 warnings` (trên `600 files`, `419ms`).
- **`npm test` (`node --env-file=.env --test`):** **PASS** — **1149/1149 tests pass**, `0 fail`, `0 cancelled`, `0 skipped`, `0 todo` (`31 suites`, `23388.2073ms`), bao gồm 5/5 test mới trong `tests/accountSyncPhase38.test.js`.
- **`npm run build` (`vite build`):** **PASS** — `2251 modules transformed`, `✓ built in 1.01s`.

---

## 7. Những phần giữ nguyên ngoài phạm vi (Scope Guardrails)
- Không thay đổi công thức chấm điểm CBT (`examScoringEngine.js`) hoặc thuật toán SM-2 (`srsEngine.js`).
- Không tối ưu kích thước bundle Vite (thuộc Task 38.05).
- Không chạy migration lên Supabase Production.
- Không sửa lệch tên cột SQL (`RoadmapPage.jsx`, `adminAnalyticsService.js`, `tutor.js`, `create-user.js`) hay chuẩn hóa múi giờ `UTC+7` (thuộc Task 38.04 / 38.06).

---

## 8. Rủi ro còn lại & Lưu ý vận hành
1. Trình duyệt người dùng đang có dữ liệu cũ ở các key toàn cục (`hanzigo_completed_lessons`, `hanzigo_vocab_remembered`, ...) sẽ tự được dọn sạch ở lần `logout()` kế tiếp; dữ liệu chính thức trên Supabase không bị ảnh hưởng.
2. `src/services/leaderboardService.js` vẫn giữ nhánh đọc fallback `hanzigo_shared_profiles_cache` (không có thao tác ghi mới nào từ `progressService.js` hay `gamification.js`), có thể dọn nốt ở Task 38.04/38.06 nếu cần.
3. Kết quả kiểm thử local sử dụng mock `localStorage` và mock Supabase client ở chế độ simulation; cần xác minh E2E trên Production Supabase sau khi deploy nếu muốn kiểm chứng RLS thực tế (thuộc Task 38.04).

---

## 9. Trạng thái Hard Stop Gate
**Task 38.03 đã hoàn tất đầy đủ theo phạm vi phê duyệt.** Hệ thống dừng tại Hard Stop Gate chờ người dùng đánh giá và phê duyệt báo cáo trước khi chuyển sang **Task 38.04**.
