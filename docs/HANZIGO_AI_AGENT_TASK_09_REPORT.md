# HANZIGO — LÃO SƯ AI AGENT
# BÁO CÁO TASK 09: AGENT COST GUARD, QUOTA MULTIPLIER & OBSERVABILITY

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Chiến dịch Lão Sư AI Agent — Task 09
- **Ngày hoàn thành:** 2026-11-22
- **Trạng thái chốt:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**

---

## 1. Mục tiêu Task 09
Hoàn thiện lớp kiểm soát chi phí đa bước (Token/USD Budget Cap), tối ưu tốc độ qua Public-Only Exact-Match Cache an toàn, bổ sung trọng số quota cho lượt Agent nhiều bước và phát structured observability trace không rò rỉ PII trên kiến trúc Vercel Serverless stateless.

## 2. Phạm vi & Ràng buộc Tuân thủ
- **Không chạm UI/CSS:** `TOTAL CSS` giữ nguyên **`44.10 KB` gzip** (delta **`+0.00 KB`**).
- **Không sửa DB/migration, không đọc `.env`.**
- **Stateless:** Cache dùng Upstash Redis (fail-open khi lỗi), không dùng in-memory state làm nguồn chân lý bảo mật giữa các serverless instances.

## 3. Cost Guard, Public Cache & Structured Tracer (`api/_agent/costAndObservability.js`)
- **Per-Request Budget Guard (`checkAgentRequestBudget`):** Giới hạn `MAX_REQUEST_TOTAL_TOKENS = 6000` và `MAX_REQUEST_COST_USD = 0.02`; khi chạm ngưỡng sẽ dừng gọi thêm tool và đặt `budget_capped: true`.
- **Strict Public-Only Exact-Match Cache (`isCacheEligible`, `buildPublicCacheKey`, `getPublicCachedAnswer`, `setPublicCachedAnswer`):**
  - Chỉ cache `vocab_tutor` / `grammar_tutor` thuần công khai (`memoryApplied === false`, không có `history`, không gọi tool cá nhân).
  - Key SHA-256 gắn `normalizedQuery + intent + hskLevel + promptVersion + modelTier`.
  - Lưu qua Upstash Redis TTL 20 phút (`1200s`), fail-open hoàn toàn nếu Redis lỗi/timeout.
- **Structured Agent Tracer (`buildAgentTraceRecord`, `emitAgentTrace`):**
  - Xuất bản ghi JSON chuẩn gồm `traceId`, `requestId`, `userIdHash`, `intent`, `tier`, `model`, `promptId`, `promptVersion`, `stepsCount`, `toolCallsCount`, `toolsUsed`, `ragSourceIds`, `evidenceStatus`, `cacheHit`, `budgetCapped`, `fallbackUsed`, `memoryApplied`, `totalTokens`, `costUsd`, `latencyMs`.
  - Mọi trường đều chạy qua `redactSensitiveData()`.

## 4. Quota Multiplier (`api/_utils/distributedRateLimiter.js`)
- Bổ sung tham số tùy chọn `costWeight = 1` vào `checkRateLimitAndQuota()` (`INCRBY` trên Upstash Redis, giữ nguyên `costWeight = 1` cho toàn bộ 7 endpoints cũ).
- Bổ sung `computeAgentQuotaWeight()` & `recordAgentQuotaWeight()` tính trọng số bổ sung cho các lượt Agent chạy `>= 2` tool calls.

## 5. Files Changed
1. [costAndObservability.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/costAndObservability.js) *(Mới)* — Budget guard, Public-only cache & PII-free structured tracer.
2. [distributedRateLimiter.js](file:///d:/DELL/Dowloads/HanziGo/api/_utils/distributedRateLimiter.js#L12-L210) — Hỗ trợ `costWeight` & `recordAgentQuotaWeight()`.
3. [orchestrator.js](file:///d:/DELL/Dowloads/HanziGo/api/_agent/orchestrator.js) — Tích hợp cache check, per-step budget guard, trace emitter & additive fields (`cache_hit`, `budget_capped`, `trace_id`).
4. [tutor.js](file:///d:/DELL/Dowloads/HanziGo/api/_handlers/ai/tutor.js#L770-L785) — Ghi nhận trọng số quota cho multi-step Agent calls.
5. [agentCostObservability.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/agentCostObservability.test.js) *(Mới)* — `6` tests kiểm chứng đủ 6 kịch bản bắt buộc.
6. [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json#L12) — Đăng ký `tests/agentCostObservability.test.js` vào `npm test`.

## 6. Security & Privacy Controls
- Tuyệt đối không cache hoặc đọc cache khi `memoryApplied === true` hoặc có gọi tool cá nhân.
- `userId` được băm SHA-256 (`userIdHash`) và toàn bộ trace đi qua `redactSensitiveData()`.
- Cache fail-open, rate limiter vẫn giữ fail-closed ở Production.

## 7. Regression Results (`npm test`)
- **Tổng số test:** **`1252 / 1252` tests passed** (`43` suites, `0` fail, `0` skipped — tăng **`+6` tests / `+1` suite** so với Task 08 `1246`).

## 8. Curriculum Audit (`npm run audit:curriculum`)
- **Kết quả:** **`100 / 100`** (**PASS**).

## 9. Lint (`npm run lint`)
- **Kết quả:** **PASS** (`0` errors).

## 10. Build & CSS Budget (`npm run build:verify`)
- **Kết quả:** **PASS**
  - `TOTAL CSS (1 file)`: `389.84 KB` raw / **`44.10 KB` gzip** (`<= 45.00 KB` — **PASS**, delta **`+0.00 KB`**, còn dư `0.90 KB`).
  - Chunk isolation (`dist/index.html`): **PASS** (`18` thẻ script/modulepreload).

## 11. Remaining Work (Next: Task 10)
- **Task 10 — Lão Sư Learning Workspace UI & Transparency Chips:** Nâng cấp `AiTutorChatView.jsx` hiển thị tool chips đã tra cứu, nút xác nhận `pending_confirmations` (lưu từ SRS), nút `ui_actions` điều hướng nhanh, và điều khiển bật/tắt/xóa Controlled Memory ngay trên giao diện mobile-first (`TOTAL CSS <= 45.00 KB` gzip).

## 12. Notes & Constraints
- Không phát sinh thay đổi UI/CSS trong Task 09.

## 13. Final Status & Hard Stop Gate
- **Trạng thái:** **`IMPLEMENTATION COMPLETE` · `TESTS PASSED` · `BUILD VERIFIED`**
- **HARD STOP GATE:** Dừng lại chờ bạn phê duyệt báo cáo Task 09 trước khi triển khai **Task 10**.
