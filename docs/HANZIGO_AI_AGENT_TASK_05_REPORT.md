# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 05: LEARNER CONTEXT, EXAM & SAFE-WRITE PROPOSAL TOOLS

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 05
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 05
Hoàn thiện nhóm công cụ Medium-risk có kiểm soát (`get_learner_adaptive_profile`, `inspect_hsk_exam_question`, `generate_study_prescription`, `suggest_save_vocab_to_srs`) kèm khóa quyền RBAC chặt chẽ, chống lộ đáp án CBT, Human-in-the-Loop cho safe-write, và helper đăng ký trọn bộ 10 Real Tools phân theo role.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa endpoint runtime cũ:** `tutor.js`, `chat.js`, `coach.js` giữ nguyên 100%.
- **Không sửa DB/migration, không đọc `.env`, không đăng ký tool xóa/đổi quyền (`HIGH` risk).**

## 3. 4 Công cụ Medium-Risk & Context (`api/_agent/tools/learnerExamTools.js`)
1. `get_learner_adaptive_profile`:
   - `permissionGuard`: Khóa cứng vào `executionContext.user?.id`, chặn Guest và chặn mọi nỗ lực truyền `args.userId` khác user hiện tại (anti-IDOR).
   - Kế thừa `retrieveLearnerAdaptiveProfile()` (`get_user_adaptive_ai_context`), lọc PII/secret qua `redactSensitiveData()`.
2. `inspect_hsk_exam_question`:
   - Tra từ `hsk_question_bank` (Supabase nếu có) hoặc `HSK_QUESTIONS` (`hskExamsData.js`).
   - Khi `executionContext.isActiveExamSession === true`, tự động tước bỏ toàn bộ `correct_answer`, `correct_option_index`, `explanation` (`answerHidden: true`), chỉ giữ gợi ý phương pháp.
3. `generate_study_prescription`:
   - Chỉ đọc hồ sơ thật của `executionContext.user.id` (có xử lý cold-start cho học viên mới), trả về `3–4` hành động ưu tiên kèm `uiActions` trỏ đúng `#vocabulary`, `#lesson`, `#writing`, `#hsk`, `#pronunciation`.
4. `suggest_save_vocab_to_srs`:
   - Tuyệt đối không ghi trực tiếp vào DB `user_vocab_srs`; chỉ trả `pendingConfirmation` (`requiresConfirmation: true`) qua `createPendingConfirmationContract()` để UI hiển thị nút cho người học xác nhận.

## 4. Unified Tool Index & Role Filtering (`api/_agent/tools/index.js`)
- `registerAllAgentTools()`: Đăng ký trọn bộ **10 Real Tools** (6 Low-risk + 4 Learner/Exam/Safe-Write).
- `getAllowedToolNamesForRole(role)` & `getAgentToolDeclarationsForRole(registry, role)`:
  - `guest`: chỉ nhận **6** tool Read-Only public.
  - `student` / `teacher` / `admin`: nhận đủ **10** tool.

## 5. Files Changed
1. [learnerExamTools.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/tools/learnerExamTools.js) *(Mới)* — 4 công cụ Learner, Exam & Safe-Write Proposal.
2. [index.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/tools/index.js) *(Mới)* — Đăng ký trọn bộ 10 tools & lọc theo role.
3. [agentLearnerExamTools.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentLearnerExamTools.test.js) *(Mới)* — `5` unit/security tests mới.
4. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentLearnerExamTools.test.js` vào `npm test`.

## 6. Security & Anti-Leakage Controls
- Chặn cross-user IDOR & Guest trên dữ liệu cá nhân.
- Khóa chống lộ đáp án CBT khi `isActiveExamSession === true`.
- Chặn ghi DB ngầm (Human-in-the-Loop `pendingConfirmation`).

## 7. Regression Results (`npm test`)
- **Tổng số test:** **`1228 / 1228` tests passed** (`39` suites, `0` fail, `0` skipped — tăng **`+5` tests / `+1` suite** so với Task 04 `1223`).

## 8. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 9. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 10. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload).

## 11. Remaining Work (Next: Task 06)
- **Task 06 — Stateless Agent Orchestrator Loop (`<= 3` bước):** Tạo `api/_agent/orchestrator.js` chạy vòng lặp suy luận -> gọi tool -> quan sát -> tổng hợp phản hồi JSON sư phạm, tối đa 3 tool calls/request, timeout tổng `25s`, và fallback deterministic thông minh khi 429/timeout.

## 12. Notes & Constraints
- Không phát sinh thay đổi nào trên DB hoặc API endpoints hiện hành.

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 05 trước khi triển khai **Task 06**.
