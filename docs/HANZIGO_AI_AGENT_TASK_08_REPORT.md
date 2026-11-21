# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 08: CONTROLLED LEARNER MEMORY & MULTI-TURN COMPRESSION

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 08
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 08
Xây dựng cơ chế bộ nhớ học tập có kiểm soát (Controlled Learner Memory) và nén ngữ cảnh hội thoại đa lượt (`sessionSummary`) gọn nhẹ, an toàn, tôn trọng quyền kiểm soát/xóa dữ liệu của người dùng mà không thay đổi DB schema.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa DB/migration, không đọc `.env`.**
- **Không lưu vô thời hạn & không vượt token budget:** Nén lịch sử về cửa sổ trượt `MAX_WINDOW_TURNS = 6` + `sessionSummary <= 600` ký tự; TTL 30 ngày cho bộ nhớ client.

## 3. Backend Memory & Multi-Turn Compression (`api/_agent/memoryManager.js`)
- `compressConversationHistory()`:
  - Nén lịch sử dài thành cửa sổ trượt `<= 6` lượt gần nhất và bản tóm tắt `sessionSummary <= 600` ký tự (trích xuất từ vựng chữ Hán, mã bài học, câu hỏi trước đó) với **0** chi phí LLM phụ.
  - Đi qua `redactSensitiveData()` và `sanitizeUntrustedContext()` chống memory poisoning & rò rỉ PII.
- `buildSafeLearnerMemoryContext()`:
  - Hợp nhất 3 tầng: `learnerProfile` (mục tiêu, số bài học), `learningMemory` (chỉ nhận lỗi sai đã xác nhận, từ SRS đến hạn, chủ đề gần đây — không suy diễn lỗi sai), và `sessionSummary`.
  - Tôn trọng tuyệt đối `memoryEnabled === false` (bỏ qua toàn bộ lịch sử & ký ức dài hạn, trả `memoryApplied: false`).
  - Hỗ trợ Cold-start an toàn cho học viên mới.

## 4. Per-User Controlled Memory Service (`src/services/learnerContextService.js`)
- Gắn chặt theo `userId` (`hanzigo_ai_memory_v1_<userId>`), tuyệt đối tách biệt giữa các tài khoản:
  - `getLearnerMemoryPreferences(userOrId)` / `setLearnerMemoryEnabled(userOrId, enabled)`
  - `getControlledLearnerMemory(userOrId)` (kiểm tra TTL 30 ngày)
  - `updateControlledLearnerMemory(userOrId, patch)` (từ chối ghi khi `memoryEnabled === false`, tẩy PII/token)
  - `clearControlledLearnerMemory(userOrId)` (xóa sạch toàn bộ ký ức của user đó).

## 5. Nối vào Orchestrator & `/api/ai/tutor`
- `api/_agent/orchestrator.js`: Chạy `compressConversationHistory()` + `buildSafeLearnerMemoryContext()` trước khi dựng system prompt, gắn `memory_applied` và `compressed_turns` vào `metadata`.
- `api/_handlers/ai/tutor.js`: Nhận `memory_enabled` / `session_summary` từ request body và truyền vào `executionContext`.

## 6. Files Changed
1. [memoryManager.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/memoryManager.js) *(Mới)* — Nén hội thoại đa lượt & hợp nhất ký ức 3 tầng an toàn.
2. [learnerContextService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/learnerContextService.js#L448-L594) — Quản lý bộ nhớ học tập theo từng `userId` (bật/tắt, cập nhật, xóa sạch).
3. [orchestrator.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/orchestrator.js#L211-L245) — Nối nén hội thoại & controlled memory vào vòng lặp Agent.
4. [tutor.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/ai/tutor.js#L589-L618) — Truyền `memoryEnabled` & `sessionSummary` vào `runAgentOrchestrator()`.
5. [agentLearnerMemory.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentLearnerMemory.test.js) *(Mới)* — `6` tests kiểm chứng đủ 6 kịch bản bắt buộc.
6. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentLearnerMemory.test.js` vào `npm test`.

## 7. Security & Privacy Controls
- Chống memory poisoning (`</learner_context>`, chỉ thị injection) và tẩy PII (JWT, email, SĐT) trước khi nạp vào `<learner_context>`.
- Cô lập hoàn toàn bộ nhớ giữa các `userId`.

## 8. Regression Results (`npm test`)
- **Tổng số test:** **`1246 / 1246` tests passed** (`42` suites, `0` fail, `0` skipped — tăng **`+6` tests / `+1` suite** so với Task 07 `1240`).

## 9. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 10. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 11. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload).

## 12. Remaining Work (Next: Task 09)
- **Task 09 — Agent Cost Guard, Quota Multiplier & Observability:** Bổ sung theo dõi chi phí/token đa bước, hệ số quota Agent trong `distributedRateLimiter.js` / `api/_agent/`, và trace metadata không rò rỉ PII.

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 08 trước khi triển khai **Task 09**.
