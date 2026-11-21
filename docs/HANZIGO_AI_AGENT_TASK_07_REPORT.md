# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 07: TÍCH HỢP ORCHESTRATOR VÀO /api/ai/tutor & /api/ai/chat

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 07
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 07
Đưa Lão Sư AI Agent (`runAgentOrchestrator`, `validateAgentInput`, `selectModelTier`, `redactSensitiveData`) vào luồng API thực tế của `/api/ai/tutor` và `/api/ai/chat` mà giữ tương thích ngược 100% với Frontend hiện hành (`AiTutorChatView.jsx`, `ConversationPage.jsx`, `aiTutorService.js`, `aiGateway.js`) và toàn bộ bộ test hồi quy cũ.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa DB/migration, không đọc `.env`.**
- **100% tương thích ngược:** Toàn bộ `aiTutorBackend.test.js`, `aiTutorProductionQA.test.js`, `productionSecurityHardening.test.js`, `roleplay*.test.js`, `aiGatewayReliability.test.js` đều xanh.

## 3. Tích hợp `/api/ai/tutor` (`api/_handlers/ai/tutor.js`)
- Giữ nguyên cổng bảo vệ `verifyRequestAuth()`, `checkRateLimitAndQuota()` (Upstash Redis fail-closed), và `ENABLE_AI_TUTOR` / `AI_TUTOR_KILL_SWITCH`.
- Chạy `validateAgentInput()` từ `api/_agent/guardrails.js` ở bước kiểm tra đầu vào.
- Thay thế nhánh gọi LLM đơn lẻ cũ bằng `runAgentOrchestrator()` với `executionContext: { user: auth.user, role: auth.user.role, supabaseClient, isActiveExamSession }`.
- Bảo toàn 100% trường response cũ (`data.answer`, `answerMarkdown`, `structuredBreakdown`, `citations`, `interactive_citations`, `evidence_status`, `_metadata`) và bổ sung additive fields: `tools_used`, `ui_actions`, `pending_confirmations`, `agent_metadata`.
- Thay nhánh trả lỗi `500` raw bằng `sendSafeServerError()`.

## 4. Đồng bộ `/api/ai/chat` (`api/_handlers/ai/chat.js`)
- Giữ nguyên JSON chat/roleplay contract cho `ConversationPage.jsx`.
- Dùng chung `validateAgentInput()` & `redactSensitiveData()` từ `api/_agent/guardrails.js`.
- Áp dụng `selectModelTier()` (`lite` cho HSK 1–3, `standard` cho HSK trung-cao cấp) và gắn `tier` vào `_metadata`.
- Thay nhánh trả lỗi `500` raw bằng `sendSafeServerError()`.

## 5. Files Changed
1. [tutor.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/ai/tutor.js) — Tích hợp `runAgentOrchestrator`, `validateAgentInput`, `sendSafeServerError` & additive Agent fields.
2. [chat.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/ai/chat.js) — Đồng bộ `validateAgentInput`, `redactSensitiveData`, `selectModelTier`, `sendSafeServerError`.
3. [guardrails.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/guardrails.js#L87-L93) — Chuẩn hóa thông báo từ chối injection khớp hợp đồng test bảo mật hiện hành.
4. [agentEndpointIntegration.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentEndpointIntegration.test.js) *(Mới)* — `4` integration tests cho `/api/ai/tutor` và `/api/ai/chat`.
5. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentEndpointIntegration.test.js` vào `npm test`.

## 6. Security & Compatibility Controls
- `401` khi thiếu JWT auth, `400` khi phát hiện injection đa ngữ, `sendSafeServerError` chặn rò rỉ stack/internal error ở Production.
- Bảo toàn `evidence_status = 'insufficient_evidence'` với `citations = []` khi không có nguồn xác minh.

## 7. Regression Results (`npm test`)
- **Tổng số test:** **`1240 / 1240` tests passed** (`41` suites, `0` fail, `0` skipped — tăng **`+4` tests / `+1` suite** so với Task 06 `1236`).

## 8. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 9. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 10. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload).

## 11. Remaining Work (Next: Task 08)
- **Task 08 — Controlled Learner Memory & Multi-Turn Compression:** Chuẩn hóa tóm tắt ngữ cảnh phiên (`sessionSummary`) và quyền bật/tắt/xóa ký ức học tập trong `learnerContextService.js` & `tutor.js`.

## 12. Notes & Constraints
- Các trường mới `tools_used`, `ui_actions`, `pending_confirmations`, `agent_metadata` là additive; client cũ vẫn hoạt động bình thường khi chưa render các trường này (sẽ nâng cấp UI ở Task 10).

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 07 trước khi triển khai **Task 08**.
