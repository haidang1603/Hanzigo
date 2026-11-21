# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 04: REAL TOOL REGISTRY & READ-ONLY KNOWLEDGE TOOLS

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 04
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 04
Xây dựng `ToolRegistry` thống nhất và triển khai 6 công cụ Read-Only (Low-risk) kết nối trực tiếp vào kho dữ liệu HSK 1–9 thật của HanziGo (Node.js / Vercel Serverless compatible), không chạm UI/CSS hay luồng runtime cũ.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa endpoint runtime cũ:** `tutor.js`, `chat.js`, `coach.js` giữ nguyên 100%.
- **Không sửa DB/migration, không đọc `.env`, không tạo dữ liệu giả.**

## 3. Real Tool Registry (`api/_agent/toolRegistry.js`)
- **Allowlist & Risk Block:** Chỉ tool đăng ký hợp lệ mới chạy được; chặn cứng mọi tool mức `RISK_LEVELS.HIGH`.
- **JSON Schema Validation:** Kiểm tra kiểu (`string`, `integer`, `number`, `boolean`, `array`), `required`, `maxLength`, `enum`, `minimum`/`maximum`.
- **Permission Guard Hook:** Hỗ trợ `permissionGuard(executionContext, args)` trước khi thực thi.
- **Per-Tool Timeout & Error Redaction:** Timeout mặc định `4000ms` (giới hạn `200–10000ms`), tự động che secret/PII qua `redactSensitiveData()` khi bắt ngoại lệ.
- **Gemini Function Declarations:** `getGeminiFunctionDeclarations()` xuất chuẩn mảng `functionDeclarations` cho `callAgentModelTurn()`.
- **Output Contract:** Chuẩn `{ ok, toolName, data, sources: [{ sourceId, title, type, verified }], latencyMs, error? }`.

## 4. 6 Công cụ Read-Only Knowledge (`api/_agent/tools/knowledgeTools.js`)
1. `lookup_dictionary_entry`: Tra từ điển HSK 1–6 (`VOCABULARY_LIST`), HSK 7–9 (`HSK79_VOCAB_GLOSSARY`), chữ thông dụng (`EXTENDED_COMMON_CHARS`) và `dictionary_entries` (Supabase nếu có).
2. `lookup_hanzi_decomposition`: Chiết tự bộ thủ, cấu trúc IDS, số nét và cặp chữ dễ nhầm (`hanziDecomposition.js`, `characterDecompositionData.js`, `radicalsData.js`).
3. `lookup_grammar_pattern`: Tra công thức ngữ pháp, hư từ (`FUNCTION_WORDS_VOCAB_LIST`, `BUILTIN_CURATED_CHUNKS`) và `grammar_points` (Supabase nếu có).
4. `lookup_chengyu_idiom`: Tra thành ngữ 4 chữ HSK 6 (`HSK6_IDIOMS_DATABASE`) và `chengyu_entries` (Supabase nếu có).
5. `get_curriculum_lesson_context`: Lấy thông tin bài học lộ trình (`LEARNING_LESSONS`) theo `lessonId`, `hskLevel`, hoặc `query`.
6. `search_curated_knowledge`: Bọc `retrieveRagKnowledge()` từ `ragRetriever.js`, lọc `is_verified !== false`, áp dụng `sanitizeUntrustedContext()` chống RAG poisoning và trả `sources` chuẩn.

## 5. Files Changed
1. [toolRegistry.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/toolRegistry.js) *(Mới)* — ToolRegistry thống nhất, validation, timeout, Gemini exporter.
2. [knowledgeTools.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/tools/knowledgeTools.js) *(Mới)* — 6 Read-Only Knowledge Tools nối trực tiếp kho HSK 1–9.
3. [agentToolRegistryKnowledge.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentToolRegistryKnowledge.test.js) *(Mới)* — `8` unit tests kiểm chứng Registry + cả 6 tools trên dữ liệu thật + miss case.
4. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentToolRegistryKnowledge.test.js` vào `npm test`.

## 6. Security & Anti-Hallucination Controls
- Giới hạn kết quả mỗi tool `<= 5` mục để tiết kiệm token context.
- Khi không tìm thấy dữ liệu, trả về `{ found: false, items: [] }` và `sources: []` minh bạch.
- Kết quả RAG đi qua `sanitizeUntrustedContext()` trước khi đưa vào prompt.

## 7. Regression Results (`npm test`)
- **Tổng số test:** **`1223 / 1223` tests passed** (`38` suites, `0` fail, `0` skipped — tăng **`+8` tests / `+2` suites** so với Task 03 `1215`).

## 8. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 9. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 10. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload).

## 11. Remaining Work (Next: Task 05)
- **Task 05 — Learner Context, Exam & Safe-Write Proposal Tools:** Triển khai nhóm công cụ Medium-risk có kiểm soát (`get_learner_adaptive_profile`, `inspect_hsk_exam_question`, `generate_study_prescription`, `suggest_save_vocab_to_srs` dạng Human-in-the-Loop) kèm RBAC binding `auth.user.id`.

## 12. Notes & Constraints
- Toàn bộ 6 tools chạy sạch trong môi trường Node.js/Serverless, không phụ thuộc DOM/browser globals.

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 04 trước khi triển khai **Task 05**.
