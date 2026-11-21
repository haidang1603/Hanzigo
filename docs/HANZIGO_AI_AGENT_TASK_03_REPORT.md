# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 03: MODEL ROUTER & TOOL-CALLING ADAPTER

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 03
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 03
Xây dựng bộ định tuyến model theo độ phức tạp tác vụ (`lite` / `standard` / `reasoning`) và nâng cấp AI Provider Adapter để hỗ trợ chuẩn Gemini Function Calling (`tools` / `functionCall`) với multi-key rotation, bounded retries và fallback model, đồng thời giữ tương thích ngược 100% với `callUnifiedAiProvider()` và toàn bộ 7 endpoints đang chạy.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa endpoint runtime cũ:** `tutor.js`, `chat.js`, `coach.js` giữ nguyên 100% (sẽ tích hợp ở Task 07).
- **Không sửa DB/migration, không đọc `.env`.**

## 3. Model Router (`api/_agent/modelRouter.js`)
- Hỗ trợ override cấu hình model qua env (`GEMINI_MODEL_LITE`, `GEMINI_MODEL_STANDARD`, `GEMINI_MODEL_REASONING`, fallback an toàn về `GEMINI_MODEL`).
- `selectModelTier({ intent, hskLevel, hasTools, requiresDeepReasoning, allowPremiumTier })`:
  - **`lite`:** Q&A/hội thoại cơ bản `HSK 1–3` không cần tool (`maxOutputTokens: 600`, `timeoutMs: 12000`).
  - **`standard`:** `HSK 4–6`, lượt có `hasTools: true`, hoặc intent cần cấu trúc (`grammar_tutor`, `reading_translation`, `progress_coach`).
  - **`reasoning`:** `writing_coach`, `hsk_exam_coach` (`HSK 7–9`), `requiresDeepReasoning: true` — **chỉ kích hoạt khi `allowPremiumTier === true`** (`AI_ALLOW_PREMIUM_TIER=true`), mặc định khóa ở `standard` để tránh leo thang chi phí ngoài kiểm soát.
- Trả về đầy đủ `{ tier, model, fallbackModel, maxOutputTokens, temperature, timeoutMs, reason }`.

## 4. Tool-Calling Adapter (`api/_utils/aiProviderAdapter.js`)
- **Giữ nguyên 100%** chữ ký và hành vi của `callUnifiedAiProvider()`.
- Bổ sung `callAgentModelTurn({ systemInstruction, contents, tools, routingDecision, timeoutMs, maxRetries })`:
  - Hỗ trợ `tools: [{ functionDeclarations }]` và multi-turn `contents` (`user` / `model` / `function`).
  - Tái sử dụng `getGeminiApiKeys()` và `markGeminiKeyRateLimited()` (cooldown 60s khi gặp `429` / `403`).
  - Giới hạn `maxRetries <= 2`, timeout cứng (`<= 25000ms`), parse chuẩn `type: 'tool_calls' | 'final_text'`, `toolCalls: [{ name, args }]`, `parsedJson`, `usage`, `costUsd`, `fallbackUsed`.
  - Hạ cấp tự động sang `fallbackModel` khi model chính lỗi/timeout (trừ `400 Bad Request`).

## 5. Files Changed
1. [modelRouter.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/modelRouter.js) *(Mới)* — Định tuyến 3 tầng model & kiểm soát chi phí.
2. [aiProviderAdapter.js](file:///d:/DELL/Dowloads/HanziGo/api/_utils/aiProviderAdapter.js#L480-L735) — Bổ sung `callAgentModelTurn()` giữ nguyên `callUnifiedAiProvider()`.
3. [agentModelRouterAdapter.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentModelRouterAdapter.test.js) *(Mới)* — `5` unit tests mới kiểm chứng routing + mock Gemini `functionCall` + rotation `429` + fallback model.
4. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentModelRouterAdapter.test.js` vào `npm test`.

## 6. Security & Cost Controls
- Không leo thang sang tầng `reasoning` nếu không bật `allowPremiumTier`.
- Không retry khi `400 Bad Request`; cooldown key 60s khi gặp `429`/`403`; giới hạn timeout per-turn `<= 25s` phù hợp Vercel Serverless.

## 7. Regression Results (`npm test`)
- **Tổng số test:** **`1215 / 1215` tests passed** (`36` suites, `0` fail, `0` skipped — tăng **`+5` tests / `+2` suites** so với Task 02 `1210`).
- Toàn bộ bài test cũ của `aiProviderAdapter.js` (`aiGatewayReliability.test.js`) tiếp tục xanh 100%.

## 8. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 9. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 10. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload).

## 11. Remaining Work (Next: Task 04)
- **Task 04 — Real Tool Registry & Read-Only Knowledge Tools:** Tạo `api/_agent/toolRegistry.js` và gắn nhóm tool Low-risk đọc dữ liệu thật (`lookup_dictionary_entry`, `lookup_hanzi_decomposition`, `lookup_grammar_pattern`, `lookup_chengyu_idiom`, `get_curriculum_lesson_context`).

## 12. Notes & Constraints
- Không phát sinh side-effect lên các API endpoints hiện hành.

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 03 trước khi triển khai **Task 04**.
