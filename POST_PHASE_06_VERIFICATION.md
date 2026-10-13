# HANZIGO AI TUTOR — BÁO CÁO XÁC MINH ĐỘC LẬP HẬU PHASE 06
(POST-PHASE-06 INDEPENDENT VERIFICATION REPORT)

**Người thực hiện:** Senior Full-Stack Engineer, AI/RAG Auditor & Security Reviewer  
**Ngày thực hiện:** 13/10/2026  
**Mục tiêu:** Kiểm tra chéo độc lập toàn bộ các tuyên bố trong báo cáo nghiệm thu Phase 06 (`docs/HANZIGO_AI_TUTOR_QA_RELEASE_REPORT.md`) bằng kiểm tra mã nguồn, truy vấn trực tiếp database/API thực tế, và chạy benchmark mở rộng.  
**Nguyên tắc thẩm định:** Trung thực tuyệt đối, chứng cứ có thể tái lập (reproducible), không che giấu khiếm khuyết kỹ thuật.

---

## 1. TỔNG HỢP PHÂN LOẠI TUYÊN BỐ (VERIFICATION STATUS)

| Hạng mục tuyên bố | Phân loại | Tóm tắt phát hiện thực tế |
| :--- | :---: | :--- |
| **1. Embedding ngữ nghĩa thực sự** | ❌ **FAILED** | `api/_utils/embeddingProvider.js` sử dụng **thuật toán băm N-gram / ký tự (Deterministic Feature Hashing)** modulo 768; chưa kết nối model neural embedding thực tế (Gemini/BERT). |
| **2. Dữ liệu Vector trong PostgreSQL** | ⚠️ **PARTIALLY VERIFIED** | Migration SQL và hàm RPC `match_rag_knowledge` tồn tại trên Supabase, nhưng bảng `rag_knowledge_chunks` hiện có **0 dòng (hoàn toàn rỗng)**. Dữ liệu chạy test là in-memory fixture. |
| **3. Benchmark RAG Recall@3 / Recall@5** | ⚠️ **PARTIALLY VERIFIED** | Đạt 100% trên tập 10 câu hỏi chuẩn ban đầu vì câu hỏi chứa từ khóa chữ Hán/Pinyin khớp trực tiếp vào 5 fixture chunks bằng **Lexical Search**. Chạy trên tập mở rộng, Recall đạt **81.8%** (thất bại ở Pinyin không dấu). |
| **4. Rate Limiting phân tán (Distributed)** | ⚠️ **PARTIALLY VERIFIED** | Thuật toán hỗ trợ Upstash Redis nhưng `.env` **chưa cấu hình Redis token**, đang chạy fallback `memoryStore = new Map()` trong RAM Node.js (không chia sẻ giữa các serverless instances). |
| **5. Gọi xKiro API thực tế & Model ID** | ✅ **VERIFIED** | Đã gọi live request thành công tới `https://api.xkiro.com/v1/chat/completions` (HTTP 200, độ trễ 4549ms, 326 tokens). **Lưu ý:** Model thực tế là `qwen/qwen-plus-2025-07-28:free` (khác với `meta/llama-3.3-70b-instruct` trong báo cáo Phase 06). |
| **6. Khóa chi phí (Zero Silent Charges)** | ✅ **VERIFIED** | Cờ `ALLOW_PAID_FALLBACK=false` được thực thi nghiêm ngặt, chặn mọi chuyển hướng sang model tính phí khi xKiro gặp lỗi 429. |
| **7. An ninh RLS, Zero-Trust & Chống Injection** | ✅ **VERIFIED** | RLS Postgres chặn ghi trái phép (lỗi 42501), client tự gửi `role: admin` bị tước bỏ (`sanitizeContextForAi`), Prompt Injection bị chặn tại `api/ai/tutor.js`. |
| **8. Bảo mật Secrets (Zero Secret Leakage)** | ✅ **VERIFIED** | Quét toàn bộ AST file `.js`/`.jsx` trong `src/` xác nhận 0 biến môi trường bí mật lọt vào bundle client. |
| **9. Xóa dữ liệu học viên (GDPR)** | ✅ **VERIFIED** | Client xóa sạch `localStorage`, server không lưu trữ persistent chat logs nên không tồn tại rò rỉ dữ liệu cá nhân. |
| **10. Regression Test Suite hiện hành** | ✅ **VERIFIED** | Chạy `npm test`: **434 / 434 tests passed** (100% pass rate, 0 hồi quy). |

---

## 2. ĐỐI CHIẾU CHI TIẾT THEO TỪNG HẠNG MỤC

### 2.1. Embedding và RAG (Chi tiết mã nguồn & Dữ liệu Database)

#### Phát hiện về Thuật toán Embedding:
- **File:** `api/_utils/embeddingProvider.js`, dòng 48–114 (`generateDeterministicEmbedding`).
- **Mã nguồn thực tế:**
  ```javascript
  // api/_utils/embeddingProvider.js (L71-98)
  for (let i = 0; i < norm.length; i++) {
    const charCode = norm.charCodeAt(i);
    const idx1 = (charCode * 31 + i * 17) % dimension;
    vector[idx1] += 0.5;
    // Bigram & Trigram hashing...
    const bigramCode = charCode * 37 + norm.charCodeAt(i + 1);
    const idx2 = (bigramCode * 53) % dimension;
    vector[idx2] += 1.0;
  }
  ```
- **Kết luận:** Đây là **Deterministic N-Gram Pseudo-Embedding (Feature Hashing)** dựa trên mã ký tự và từ vựng, **KHÔNG PHẢI MÔ HÌNH NEURAL EMBEDDING NGỮ NGHĨA**. Hai từ đồng nghĩa nhưng không chung chữ Hán/Pinyin/ký tự (ví dụ: `开心` vs `高兴`, `xin chào` vs `lời chào`) sẽ có vector gần như trực giao (Cosine Similarity $\approx 0$).
- **Trạng thái cấu hình:** Dòng 157–168 chỉ định fallback sang thuật toán này khi `!process.env.GEMINI_API_KEY`. Hiện tại file `.env` **chưa có `GEMINI_API_KEY`**, do đó toàn bộ vector sinh ra ở môi trường hiện tại đều là hash n-gram.

#### Phát hiện về Dữ liệu Vector trong Database Supabase:
- **Lệnh kiểm tra thực tế:**
  ```javascript
  const { data: chunks } = await supabase.from('rag_knowledge_chunks').select('id').limit(5);
  // Kết quả: count = 0 (mảng rỗng [])
  ```
- **Kết luận:** 
  1. Bảng `rag_knowledge_chunks` và hàm RPC `match_rag_knowledge` đã được tạo trên Supabase qua migration `20261013_rag_retrieval_pgvector.sql`.
  2. Tuy nhiên, **chưa có bất kỳ dòng dữ liệu nào được nạp vào bảng production**.
  3. Script `scripts/knowledge/importer.js` (dòng 250–276) khi nạp chunk cũng chưa tính toán và ghi giá trị cột `embedding`.
  4. Các bài test trong `tests/ragRetrievalEngine.test.js` và `tests/aiTutorProductionQA.test.js` chạy hoàn toàn trên in-memory fixtures (`mockStorage.chunks`), không gọi tới Postgres live.

---

### 2.2. Kiểm định Benchmark RAG: Tập 10 câu gốc vs Tập mở rộng

#### Phân tích tập 10 câu hỏi gốc trong Phase 06:
- 10 câu hỏi ban đầu:
  1. `你好 nghĩa là gì?` $\to$ chứa `你好`
  2. `Cách dùng nǐ hǎo trong giao tiếp` $\to$ chứa `nǐ hǎo`
  3. `Cấu trúc câu chữ 把 trong HSK 3` $\to$ chứa `把`
  4. `Đặt câu với bǎ` $\to$ chứa `bǎ`
  5. `Câu so sánh chữ 比` $\to$ chứa `比`
  6. `bǐ trong tiếng Trung` $\to$ chứa `bǐ`
  7. `Màu xanh lá cây 绿色` $\to$ chứa `绿色`
  8. `lǜ sè phát âm thế nào` $\to$ chứa `lǜ sè`
  9. `Từ vựng gāoxìng vui vẻ` $\to$ chứa `gāoxìng`
  10. `Hôm nay tôi rất vui 高兴` $\to$ chứa `高兴`
- **Nguyên nhân đạt 100%:** Trong `api/_utils/ragRetriever.js`, hàm `calculateLexicalScore` chấm điểm từ 0.60 đến 0.75 cho bất kỳ câu hỏi nào trùng chữ Hán hoặc Pinyin có dấu. Vì tập dữ liệu mẫu chỉ có 5 mục, việc trùng từ khóa hiển nhiên đưa chunk đó lên Top 1/Top 2 mà **không cần đến Vector Search**.

#### Kết quả Benchmark Mở rộng (Extended Benchmark):
Đã tạo và thực thi kiểm thử trên tập 15 trường hợp biên (Edge cases):

```
================================================================
   HANZIGO RAG EXTENDED BENCHMARK VERIFICATION (POST-PHASE-06)   
================================================================
Truy vấn đúng phạm vi (In-domain): 11
  - Recall@1: 81.8% (9/11)
  - Recall@3: 81.8% (9/11)
  - Recall@5: 81.8% (9/11)
  - MRR:      0.818
Truy vấn ngoài phạm vi / Rác (Out-of-domain / Noise): 4
  - Tỷ lệ từ chối chuẩn xác (Rejection / Precision): 100.0% (4/4)

Chi tiết theo nhóm:
  * Paraphrase (Thuần tiếng Việt):           3/3  (100.0%) - ĐẠT
  * Pinyin Typo / Không dấu / Viết liền:    1/3  ( 33.3%) - THẤT BẠI
  * Chữ Phồn thể (Traditional Hanzi):        3/3  (100.0%) - ĐẠT
  * Từ gần nghĩa / Đồng nghĩa:              2/2  (100.0%) - ĐẠT
  * Thiếu chứng cứ (Out-of-domain):          2/2  (100.0%) - ĐẠT
  * Truy vấn không liên quan / Rác:          2/2  (100.0%) - ĐẠT
================================================================
```

#### Phân tích thất bại thực tế:
- **Truy vấn:** `"Cách đọc nihao trong tiếng Trung"` $\to$ **NOT FOUND** (Score: 0.000).  
  *Lý do:* `normalizeQueryForRetrieval` chỉ nhận dạng Pinyin có dấu thanh điệu (`nǐ hǎo`) hoặc có số (`ni3 hao3`), không nhận dạng Pinyin không dấu viết liền (`nihao`).
- **Truy vấn:** `"Từ xiexie biểu thị điều gì"` $\to$ **NOT FOUND**.  
  *Lý do:* Chunk lưu trữ là `xièxie`, chuỗi query là `xiexie` (không dấu). Lexical matcher không khớp.

---

### 2.3. Rate Limiting và Kiểm soát Chi phí

- **File kiểm tra:** `api/_utils/distributedRateLimiter.js`.
- **Thực tế:**
  - Dòng 18–19 đọc `process.env.UPSTASH_REDIS_REST_URL` và `process.env.UPSTASH_REDIS_REST_TOKEN`.
  - Trong file `.env`, cả hai biến này **đều chưa được khai báo**.
  - Hệ thống tự động rơi vào dòng 78–135: `memoryStore = new Map()`.
- **Hệ quả kiến trúc:**
  - Trong môi trường Vercel Serverless, mỗi instance Node.js (lambda container) sở hữu một `memoryStore` riêng biệt.
  - Khi người dùng gửi 50 requests đồng thời phân tán qua 5 lambdas khác nhau, bộ đếm không được chia sẻ giữa các instance.
  - Do đó, **Rate Limiting phân tán thực sự chưa hoạt động trên production** mà chỉ là in-memory rate limiting cục bộ cho từng container.
- **Kiểm soát Chi phí (`ALLOW_PAID_FALLBACK=false`):**
  - **VERIFIED:** Được thực thi chính xác ở `api/_utils/aiProviderAdapter.js` dòng 240–265. Khi xKiro báo hết quota (429), gateway không chuyển sang Google Gemini có phí và trả về mã lỗi 429 hoặc chuyển sang Deterministic Offline Engine.

---

### 2.4. Kiểm định Thực tế xKiro API

- **File cấu hình:** `.env`:
  ```env
  XKIRO_BASE_URL=https://api.xkiro.com/v1
  XKIRO_MODEL=qwen/qwen-plus-2025-07-28:free
  ```
- **Lệnh thực thi trực tiếp:**
  Đã gửi request POST tới `https://api.xkiro.com/v1/chat/completions` với payload tiếng Việt và chữ Hán:
  *"Chào lão sư, giải thích từ 绿色 (màu xanh lá) giúp em nhé."*
- **Kết quả đo lường thực tế:**
  - **HTTP Status:** `200 OK`
  - **Thời gian phản hồi (Latency):** **4549 ms** (~4.55 giây)
  - **Model ID phản hồi:** `qwen/qwen-plus-2025-07-28:free`
  - **Token Usage:** `prompt_tokens: 224, completion_tokens: 102, total_tokens: 326`
  - **Chất lượng nội dung:** Trả về JSON hợp lệ, giải thích chính xác nghĩa của `绿色` (lǜ sè), tách nghĩa của `绿` và `色`.
- **Điểm cần đính chính:** Báo cáo Phase 06 ghi model sử dụng là `meta/llama-3.3-70b-instruct` với latency 1.8s–3.2s. Trên thực tế cấu hình đang trỏ vào `qwen/qwen-plus-2025-07-28:free` với latency đo được là 4.55s.

---

### 2.5. Bảo mật, RLS và Quyền Riêng Tư

1. **PostgreSQL Row-Level Security (RLS):**
   - Đã kiểm tra trực tiếp bằng việc dùng `VITE_SUPABASE_ANON_KEY` thử ghi vào bảng `rag_knowledge_chunks`:
     ```json
     {
       "error": "new row violates row-level security policy for table 'rag_knowledge_chunks'",
       "code": "42501"
     }
     ```
   - **Xác nhận:** RLS được kích hoạt chuẩn xác, ngăn chặn hoàn toàn việc client ghi/sửa dữ liệu tri thức.
2. **Quyền riêng tư và Leo thang đặc quyền (Privilege Escalation):**
   - Payload mạo danh `{ learner_context: { role: 'admin', permissions: ['god_mode'] } }` bị tước bỏ triệt để tại `sanitizeContextForAi` (`src/services/learnerContextService.js`, dòng 380–388).
3. **Prompt Injection:**
   - Bộ lọc `detectAbuseOrInjection` trong `api/ai/tutor.js` (dòng 52–66) chặn đứng các chuỗi tấn công DAN, system prompt override, script tag với HTTP 400.
4. **Bảo mật Bí mật (Secrets Scan):**
   - Quét mã nguồn client thư mục `src/`: 0 biến môi trường `XKIRO_API_KEY` hay `SUPABASE_SERVICE_ROLE_KEY` tồn tại trong mã frontend.
5. **Xóa dữ liệu (GDPR):**
   - Hàm `clearLearnerPersonalizationData` xóa sạch storage của user. Backend không duy trì bảng log hội thoại vĩnh viễn trên database, do đó dữ liệu được giải phóng hoàn toàn.

---

## 3. BẢNG TỔNG HỢP VẤN ĐỀ THEO MỨC ĐỘ NGHIÊM TRỌNG

| ID | Vấn đề phát hiện | Mức độ | Tác động |
| :---: | :--- | :---: | :--- |
| **ISS-01** | Bảng PostgreSQL `rag_knowledge_chunks` hiện có 0 bản ghi | 🔴 **CAO** | Nếu gọi RPC tới DB production hiện tại sẽ không có dữ liệu; hệ thống đang phải dựa vào `BUILTIN_CURATED_CHUNKS` trong code. |
| **ISS-02** | Embedding hiện tại là N-gram Hash, không phải Neural Semantic Embedding | 🟡 **TRUNG BÌNH** | Không thể tìm kiếm ngữ nghĩa sâu khi người học dùng các cách diễn đạt hoàn toàn không trùng từ vựng. |
| **ISS-03** | Truy vấn Pinyin không dấu (`nihao`, `xiexie`) bị trượt (Recall = 33%) | 🟡 **TRUNG BÌNH** | Học viên mới học thường gõ Pinyin không dấu thanh; hệ thống sẽ báo thiếu bằng chứng thay vì tìm thấy từ. |
| **ISS-04** | Rate limiter phân tán chưa có Redis URL nên chỉ chạy in-memory | 🟡 **TRUNG BÌNH** | Trên môi trường serverless nhiều container, học viên có thể gửi vượt quá quota nếu request chia đều cho các container. |
| **ISS-05** | Lệch thông tin Model ID giữa báo cáo (Llama 3.3) và cấu hình (`qwen-plus:free`) | 🟢 **THẤP** | Cần đồng bộ tài liệu chính xác với cấu hình thực tế trong `.env`. |

---

## 4. PHƯƠNG ÁN SỬA TỐI THIỂU (MINIMAL REMEDIATION PLAN)

### Sửa lỗi ISS-03: Bổ sung chuẩn hóa Pinyin không dấu vào `ragRetriever.js`
Trong `api/_utils/ragRetriever.js`:
- Bổ sung hàm ánh xạ Pinyin không dấu sang từ vựng tương ứng (ví dụ: `nihao` $\to$ `nǐ hǎo`, `xiexie` $\to$ `xièxie`, `luse` $\to$ `lǜ sè`).
- Cập nhật `calculateLexicalScore`: Nếu `chunk.pinyin` khi bỏ dấu thanh trùng với từ khóa không dấu trong query, cộng điểm `0.50`.

### Sửa lỗi ISS-01: Chạy Ingestion nạp dữ liệu vào Supabase Production
- Chạy script nạp tri thức `scripts/knowledge/cli.js import --source cedict` có kết nối `SUPABASE_SERVICE_ROLE_KEY` để nạp dữ liệu từ điển và giáo trình vào bảng `rag_knowledge_chunks` trên Supabase.

### Sửa lỗi ISS-04: Cấu hình Upstash Redis cho Serverless Production
- Đăng ký Upstash Redis REST và bổ sung vào Vercel / Production:
  ```env
  UPSTASH_REDIS_REST_URL=https://...upstash.io
  UPSTASH_REDIS_REST_TOKEN=...
  ```

---

## 5. ĐIỀU KIỆN BẮT BUỘC ĐỂ ĐƯỢC PHÉP MỞ PILOT (GATE CRITERIA)

Trước khi mở tính năng cho nhóm học viên và giáo viên thử nghiệm (Pilot), bắt buộc phải thỏa mãn 4 điều kiện:

1. [ ] **Nạp tối thiểu 200–500 đoạn tri thức kiểm duyệt vào Supabase:** Chạy script import để bảng `rag_knowledge_chunks` trên database production có dữ liệu thực tế thay vì 0 dòng.
2. [ ] **Xử lý Pinyin không dấu:** Sửa nhẹ bộ matcher trong `ragRetriever.js` để câu hỏi dạng `nihao`, `xiexie` đạt Recall $\ge 90\%$.
3. [ ] **Cấu hình Upstash Redis:** Đảm bảo Rate Limiter hoạt động xuyên suốt các serverless lambdas.
4. [ ] **Giữ nguyên Emergency Kill Switch:** Xác nhận `ENABLE_AI_TUTOR=false` hoặc `AI_TUTOR_KILL_SWITCH=true` sẵn sàng ngắt tính năng trong 5 giây nếu có sự cố.

---

## 6. KẾT LUẬN

Hệ thống **HanziGo AI Tutor** có nền tảng an ninh, phòng thủ injection, xử lý unicode và tích hợp xKiro API **rất vững chắc và hoạt động thực tế tốt**. Tuy nhiên, tuyên bố về **Vector Database** và **Distributed Rate Limiter** trong báo cáo Phase 06 cần được nhìn nhận đúng thực tế: hệ thống hiện tại đang vận hành dựa trên **Lexical In-Memory RAG** và **In-Memory Rate Limiting**. Sau khi bổ sung dữ liệu vào DB và sửa lỗi nhận dạng Pinyin không dấu theo kế hoạch trên, hệ thống sẽ hoàn toàn đủ điều kiện phát hành Pilot an toàn.
