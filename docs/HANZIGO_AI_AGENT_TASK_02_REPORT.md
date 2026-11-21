# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 02: CORE AGENT CONTRACTS, PROMPT REGISTRY & GUARDRAILS

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 02
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 02
Xây dựng nền móng `api/_agent/` cho Lão Sư AI Agent (Contracts, Prompt Registry có versioning, và Multilingual Input/Output Guardrails + PII/Secret Redactor), không sửa đổi luồng runtime hiện tại của `tutor.js`, `chat.js`, `coach.js` để đảm bảo 0 rủi ro hồi quy và `0.00 KB` CSS delta.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa endpoint runtime cũ:** `api/_handlers/ai/tutor.js`, `chat.js`, `coach.js` giữ nguyên 100% (sẽ tích hợp ở Task 07).
- **Không sửa DB/migration, không đọc `.env`.**

## 3. Core Agent Contracts (`api/_agent/contracts.js`)
- Định nghĩa `AGENT_INTENTS` (`8` intents: `general_tutor`, `vocab_tutor`, `grammar_tutor`, `reading_translation`, `writing_coach`, `pronunciation_coach`, `hsk_exam_coach`, `progress_coach`), `RISK_LEVELS` (`low`, `medium`, `high`), `EVIDENCE_STATUS` (`grounded`, `partial`, `insufficient_evidence`), `HSK_TIERS` + `resolveHskTier()`.
- Chuẩn hóa factory `createToolCallContract`, `createPendingConfirmationContract`, `createUiActionContract`.

## 4. Versioned Prompt Registry (`api/_agent/promptRegistry.js`)
- `PROMPT_REGISTRY` quản lý `promptId`, `version` (`1.0.0`), `updatedAt`, `roleDirective` và `pedagogicalFocus` riêng cho từng trong 8 intents.
- `buildAgentSystemPrompt()` tự động điều chỉnh độ sâu sư phạm theo 3 bậc `HSK 1–3` (luôn kèm Pinyin đầy đủ), `HSK 4–6` (collocation/đồng nghĩa), `HSK 7–9` (tu từ/dịch Tín–Đạt–Nhã).
- Bao bọc dữ liệu ngoài bằng thẻ `<verified_knowledge>` và `<learner_context>` kèm chỉ thị coi đây là dữ liệu thụ động, tuyệt đối không phải mệnh lệnh, và luôn xưng danh **Trợ lý AI Lão Sư HanziGo**.

## 5. Input/Output Guardrails & Sanitizer (`api/_agent/guardrails.js`)
- `validateAgentInput()`: Chặn prompt injection đa ngữ (tiếng Việt, tiếng Trung, tiếng Anh), kiểm tra giới hạn độ dài (`500` ký tự), ký tự điều khiển và yêu cầu rủi ro cao (xóa dữ liệu, nâng quyền, truy cập dữ liệu học viên khác).
- `sanitizeUntrustedContext()`: Lọc thẻ XML đóng giả (`</verified_knowledge>`, `</learner_context>`, `</system>`, `<script>`) và cụm chỉ thị ẩn chống RAG poisoning.
- `redactSensitiveData()`: Che JWT (`Bearer ...`, `eyJ...`), API keys (`AIza...`, `sk-...`), email, số điện thoại và khóa nhạy cảm.
- `validateAgentOutput()`: Chặn rò rỉ secret/internal tags và loại bỏ mọi citation không nằm trong `allowedSourceIds` hoặc khi `evidence_status === 'insufficient_evidence'`.

## 6. Files Changed
1. [contracts.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/contracts.js) *(Mới)* — Core constants, HSK tier resolver & payload contracts.
2. [promptRegistry.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/promptRegistry.js) *(Mới)* — Versioned Prompt Registry cho 8 intents + XML isolation.
3. [guardrails.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/guardrails.js) *(Mới)* — Multilingual injection defense, RAG sanitizer, PII/secret redactor & output guardrail.
4. [agentContractsGuardrails.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentContractsGuardrails.test.js) *(Mới)* — `10` unit tests cho Task 02.
5. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentContractsGuardrails.test.js` vào `npm test`.

## 7. Security & Anti-Hallucination Controls
- Chặn injection đa ngữ (`VI / ZH / EN`), chặn RAG poisoning qua thẻ đóng giả `</verified_knowledge>`, chặn hành động xóa/nâng quyền/cross-user, và xóa sạch citation bịa đặt ở tầng output.

## 8. Regression Results (`npm test`)
- **Tổng số test:** **`1210 / 1210` tests passed** (`34` suites, `0` fail, `0` skipped — tăng **`+10` tests / `+3` suites** từ `tests/agentContractsGuardrails.test.js` so với baseline `1200`).

## 9. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 10. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 11. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload, không chứa `vendor-livekit` hay `vendor-hanzi`).

## 12. Remaining Work (Next: Task 03)
- **Task 03 — Model Router & Tool-Calling Adapter:** Nâng cấp `api/_utils/aiProviderAdapter.js` hỗ trợ `selectModelTier(intent, hskLevel)`, Gemini `tools`/`functionCall` parsing và giữ nguyên multi-key rotation + fallback policy.

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 02 trước khi triển khai **Task 03**.
