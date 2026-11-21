# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 06: STATELESS AGENT ORCHESTRATOR LOOP (<= 3 BƯỚC)

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 06
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 06
Kết nối toàn bộ nền móng Task 02–05 (`contracts`, `promptRegistry`, `guardrails`, `modelRouter`, `callAgentModelTurn`, và `10 Real Tools`) thành bộ điều phối `runAgentOrchestrator()` chạy **stateless** an toàn trên Vercel Serverless với giới hạn `MAX_TOOL_CALLS = 3` và `TOTAL_TIMEOUT_MS = 25000`.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa endpoint runtime cũ:** `tutor.js`, `chat.js`, `coach.js` giữ nguyên 100% (sẽ nối ở Task 07).
- **Không sửa DB/migration, không đọc `.env`.**

## 3. Kiến trúc Stateless Orchestrator (`api/_agent/orchestrator.js`)
1. **Bước 1 — Input Guardrails & Intent Router:**
   - Chạy `validateAgentInput()` trước; nếu có prompt injection (VN/ZH/EN), high-risk action hoặc vượt độ dài thì chặn ngay (`0` LLM call, `0` tool call).
   - `classifyAgentIntent(message, explicitIntent)` phân loại nhanh về 1 trong 8 `AGENT_INTENTS`.
2. **Bước 2 — Bounded Stateless Agent Loop:**
   - Lọc bộ công cụ theo vai trò (`getAgentToolDeclarationsForRole`), chọn model qua `selectModelTier()`, dựng system prompt qua `buildAgentSystemPrompt()`.
   - Thực thi tối đa `MAX_TOOL_CALLS = 3` lượt gọi tool trong `TOTAL_TIMEOUT_MS = 25000`.
   - Chống gọi trùng lặp `(toolName + args)` trong cùng request; lỗi từng tool được chuyển thành `function` response có cấu trúc để model xử lý tiếp mà không làm sập request.
   - Nếu chạm trần tool hoặc model lặp lại yêu cầu cũ, chạy lượt tổng hợp cuối với `tools: []`.
3. **Bước 3 — Output Guardrails & Groundedness:**
   - Mọi phản hồi đi qua `validateAgentOutput()` kèm `allowedSourceIds` thực tế; tước bỏ citation bịa và đặt `evidenceStatus = 'insufficient_evidence'` nếu không có nguồn xác minh.
4. **Bước 4 — Smart Deterministic Fallback:**
   - Khi LLM trả `429` / timeout / thiếu key, tự động tra cứu `1–2` Read-Only tools (`lookup_dictionary_entry`, `lookup_grammar_pattern`, `lookup_hanzi_decomposition`, `search_curated_knowledge`) để trả câu trả lời có căn cứ thật kèm `fallbackUsed: true`.

## 4. Unified Response Envelope
`{ ok, blocked?, answer, structured?, intent, evidenceStatus, citations, toolsUsed, uiActions, pendingConfirmations, metadata: { requestId, promptId, promptVersion, model, tier, stepsCount, toolCallsCount, latencyMs, usage, costUsd, fallbackUsed, fallbackReason? } }`

## 5. Files Changed
1. [orchestrator.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/orchestrator.js) *(Mới)* — Stateless Agent Orchestrator Loop + Smart Deterministic Fallback.
2. [agentOrchestrator.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentOrchestrator.test.js) *(Mới)* — `8` unit/integration tests bao phủ đủ 7 kịch bản bắt buộc + intent router.
3. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentOrchestrator.test.js` vào `npm test`.

## 6. Security & Reliability Controls
- Chặn injection ngay tại cửa vào (`0` LLM/tool cost).
- Giới hạn cứng `<= 3` tool calls & `25s` timeout tổng phù hợp Vercel Serverless.
- Chuyển tiếp `pendingConfirmations` từ `suggest_save_vocab_to_srs` mà không ghi DB.

## 7. Regression Results (`npm test`)
- **Tổng số test:** **`1236 / 1236` tests passed** (`40` suites, `0` fail, `0` skipped — tăng **`+8` tests / `+1` suite** so với Task 05 `1228`).

## 8. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 9. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 10. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload).

## 11. Remaining Work (Next: Task 07)
- **Task 07 — Tích hợp Orchestrator vào `/api/ai/tutor` & `/api/ai/chat`:** Nối `api/_handlers/ai/tutor.js` (và giữ tương thích ngược 100% response envelope cho client cũ) qua Agent Orchestrator mới.

## 12. Notes & Constraints
- `runAgentOrchestrator` hỗ trợ inject `modelTurnFn` và `registry` phục vụ test offline 100%.

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 06 trước khi triển khai **Task 07**.
