# BÁO CÁO NGHIỆM THU TASK 39.04 — PERFORMANCE & LOAD VERIFICATION

- **Dự án:** HanziGo (`https://github.com/haidang1603/Hanzigo.git` | `https://hanzigo-xi.vercel.app`)
- **Giai đoạn:** Phase 39 — Task 39.04 (Performance & Load Verification)
- **Ngày thực hiện:** 2026-11-21
- **Phương pháp:** Kế thừa tối ưu bundle (Task 38.05) → Kiểm định `npm run build:verify` → Đo đạc thực tế trên **Local Production Preview Build** (`vite preview --port 4173`) bằng Chrome DevTools MCP → Đánh giá kiến trúc chịu tải API/DB ở mức tĩnh & cấu hình.
- **Ràng buộc an toàn:** **KHÔNG** chạy stress/load test tạo tải lên `https://hanzigo-xi.vercel.app`, Supabase Production, Upstash Redis hay AI/TTS API trả phí.

---

## 1. Mục tiêu & Phạm vi Xác minh

Task 39.04 nhằm xác minh toàn diện năng lực hiệu năng frontend và mức độ sẵn sàng chịu tải backend của HanziGo trên 3 lớp:
1. **Bundle & Asset Budget:** Xác minh dung lượng raw/gzip của `index.js`, `TOTAL CSS`, route chunks, data chunks và cơ chế cách ly thư viện nặng (`vendor-livekit`, `vendor-hanzi`) trong `dist/index.html`.
2. **Runtime Web Vitals & Route Loading (Local Production Preview):** Đo thực tế `LCP`, `CLS`, `TTFB`, `INP`, render-blocking requests, số lượng network requests và lazy chunks trên `#home`, `#roadmap`, `#lesson`, `#vocabulary`, `#writing`, `#practice`, `#hsk`, `#reader`, `#pronunciation`.
3. **API Latency, Database Query & Load Readiness (Static & Architecture Review):** Rà soát rate limiting phân tán (Upstash Redis), TTS storage caching, giới hạn payload AI, phân trang truy vấn Supabase, chỉ mục SQL và các nút thắt tiềm ẩn khi đồng thời tăng.

---

## 2. Kết quả Bundle & Asset Budget (`npm run build:verify`)

Kết quả đo từ bản build production gần nhất (`vite build` + `scripts/verify-build-budget.mjs`):

| Nhóm / Tên Chunk | Raw Size | Gzip Size | Ngưỡng Cho Phép | Khoảng trống còn lại | Trạng thái |
| :--- | ---: | ---: | ---: | ---: | :---: |
| `index-DClTP1qk.js` (Entry Shell) | 364.02 KB | **95.86 KB** | `<= 160 KB` | 64.14 KB | **PASS** |
| `TOTAL CSS` (`index-DlEwin0j.css`, 1 file) | 388.55 KB | **43.92 KB** | `<= 45 KB` | 1.08 KB | **PASS** |
| `vendor-react-core-CWoo_Nzq.js` | 205.69 KB | **63.48 KB** | `<= 180 KB` | 116.52 KB | **PASS** |
| `data-learning-path-C_bS36YY.js` | 470.51 KB | **175.25 KB** | `<= 180 KB` | **4.75 KB** | **PASS (Sát trần)** |
| `data-hsk-core-BOZOumuR.js` | 602.89 KB | **175.00 KB** | `<= 180 KB` | **5.00 KB** | **PASS (Sát trần)** |
| `feature-hskk-exam-EFLbwoOF.js` | 524.23 KB | **165.48 KB** | `<= 180 KB` | 14.52 KB | **PASS** |
| `data-chinese-BkPI851j.js` | 494.32 KB | **147.19 KB** | `<= 180 KB` | 32.81 KB | **PASS** |
| `vendor-livekit-C8if_5UX.js` (Lazy) | 509.55 KB | **131.41 KB** | `<= 260 KB` | 128.59 KB | **PASS** |
| `data-curriculum-hsk6-774jSl9n.js` | 221.17 KB | **73.28 KB** | `<= 180 KB` | 106.72 KB | **PASS** |
| `feature-hsk79-exam-DBz8CcyQ.js` | 263.15 KB | **71.34 KB** | `<= 180 KB` | 108.66 KB | **PASS** |
| `feature-hsk6-exam-BWGgdq0x.js` | 57.43 KB | **23.30 KB** | `<= 180 KB` | 156.70 KB | **PASS** |
| `vendor-hanzi-DBeYW2rk.js` (Lazy) | 44.71 KB | **13.95 KB** | `<= 180 KB` | 166.05 KB | **PASS** |

- **Chunk Isolation (`dist/index.html`):** **PASS** — Đã kiểm tra `18` thẻ `<script>` / `<link rel="modulepreload">`; **không** chứa `vendor-livekit` hay `vendor-hanzi` trong tải ban đầu.

---

## 3. Đo Runtime Web Vitals — Tải Trang Ban Đầu (`#home`, Local Production Preview)

- **Môi trường đo:** `npm run preview -- --port 4173 --strictPort` (`http://localhost:4173/#home`), Chrome Desktop `1440×900`, CPU `1x`, mạng không giới hạn (`reload: true, ignoreCache: true`).

| Chỉ số | Giá trị đo thực tế | Phân tích chi tiết từ Trace | Ngưỡng Google CWV ("Good") | Đánh giá |
| :--- | :---: | :--- | :---: | :---: |
| **TTFB** | `8 ms` | Chiếm `1.1%` tổng LCP (server cục bộ `vite preview`) | `<= 800 ms` | **GOOD** *(Local)* |
| **LCP** | `724 ms` | Phần tử LCP: `<h1>` (text, không tải ảnh từ mạng); render delay `716 ms` (`98.9%`) | `<= 2,500 ms` | **GOOD** |
| **CLS** | `0.00` | Không ghi nhận dịch chuyển bố cục trong quá trình tải | `<= 0.10` | **GOOD** |
| **FCP** | *Không tách riêng trong trace summary* | Insight `RenderBlocking`: ước tính tiết kiệm `FCP 0 ms, LCP 0 ms` | `<= 1,800 ms` | *Quan sát qua LCP* |
| **INP** | *Xem mục 4 (`#vocabulary`)* | Đo tương tác click chuyển tab `"Danh sách"` trên `#vocabulary` | `<= 200 ms` | *Xem mục 4* |

- **Render-blocking requests (2):**
  1. `https://fonts.googleapis.com/css2?...` — tổng `241 ms` (`124 ms` tải, `21 ms` main thread, HTTP `200`, `h3`).
  2. `http://localhost:4173/assets/css/index-DlEwin0j.css` — tổng `123 ms` (`7 ms` tải, `72 ms` main thread, HTTP `200`, `http/1.1`).
- **Network Requests (`#home` cold load):** Tổng `45` requests (gồm `11` request từ `chrome-extension://` của trình duyệt và **`34` request của ứng dụng**: `1` HTML, `18` JS chunks, `1` CSS bundle, `1` Google Fonts CSS, `11` font `fonts.gstatic.com/*.woff2`, `2` Supabase `daily_quotes` GET+OPTIONS — tất cả HTTP `200`).
- **Xác minh cô lập chunk khi tải `#home`:** `vendor-livekit` và `vendor-hanzi` **không xuất hiện** trong danh sách request ban đầu.

---

## 4. Kết quả Tải Route & Tương tác Thực tế (Local Production Preview)

| Route | Trạng thái | Lỗi Console mới | Lazy Chunks / Tài nguyên mới nạp (`[200]`) | Ghi chú hiệu năng & dữ liệu |
| :--- | :---: | :---: | :--- | :--- |
| `#home` | **PASS** | `1` *(xem §11)* | `18` core JS + `index-DlEwin0j.css` | `LCP 724 ms`, `CLS 0.00` |
| `#roadmap` | **PASS** | `0` | `RoadmapPage`, `PlacementTestModal`, `RoleplayStudioModal`, `lessonContentSynthesizer`, `hsk79VocabGlossary`, `InteractiveWritingPad`, `vendor-hanzi` | Supabase `lessons` + `9` font `.woff2` |
| `#lesson` | **PASS** | `0` | `LessonPage-Pqoy-auq.js` | Supabase `dictionary_entries`, `grammar_points` |
| `#vocabulary` | **PASS** | `0` | `VocabularyPage-7CgLJKc0.js`, `learningTelemetryService-CDXsYfEO.js` | Supabase `vocabulary?select=*&order=id.asc&limit=5000`; **Interaction Trace (click tab `"Danh sách"`): `INP = 308 ms`** (`2 ms` input delay, `65 ms` processing, `241 ms` presentation delay), `CLS = 0.00` |
| `#writing` | **PASS** | `0` | `WritingPage-CId2cnjC.js`, `HskWritingEvaluator-Dx3R4xeq.js` | `vendor-hanzi` tái sử dụng cache; tải `hanzi-writer-data@2.0.1` từ jsDelivr |
| `#practice` | **PASS** | `0` | `PracticePage`, `readingStudioService`, `listeningStudioService`, `practiceLevelData`, `sentenceMiningEngine`, `textbookCompanionService` | Nạp 6 chunk theo nhu cầu |
| `#hsk` | **PASS** | `0` | `HskPracticePage-B_BNgbW1.js`, `HskPhase3Components-C1pf6rT8.js` | Simulator HSK 6 / HSK 7–9 / HSKK tách chunk riêng |
| `#reader` | **PASS** | `0` | `ReaderPage`, `readingProgressService`, `utils-chinese-nlp` | `+2` font `.woff2` |
| `#pronunciation` | **PASS** | `0` | `PronunciationPage-t78GxXe0.js` | Supabase `pronunciation_items?...&limit=1000` + `9` font `.woff2` |
| `#dashboard` | **AUTH GATE** | `0` | Hiển thị giao diện Guest Landing khi chưa đăng nhập | **`[NOT VERIFIED — AUTH REQUIRED]`** cho dashboard đã đăng nhập |

*(Lưu ý: Công cụ `list_network_requests` của Chrome DevTools MCP không xuất trường byte transfer size cho từng request nên dung lượng chi tiết từng chunk được đối chiếu trực tiếp từ bảng `npm run build:verify` ở Mục 2).*

---

## 5. Rà soát Kiến trúc API Latency & Bảo vệ Tài nguyên (`api/*`)

### 5.1. Distributed Rate Limiting (`api/_utils/distributedRateLimiter.js`)
- Sử dụng **Upstash Redis REST `/pipeline`** (gộp 4 lệnh `INCR`/`EXPIRE` trong 1 round-trip HTTP) với **timeout cứng `REDIS_TIMEOUT_MS = 2500 ms`**.
- **Chính sách Fail-Closed trên Production:** Nếu thiếu `UPSTASH_REDIS_REST_URL`/`TOKEN` hoặc Redis timeout/lỗi (khi không bật `ALLOW_IN_MEMORY_RATE_LIMIT=true`), API trả về HTTP `503` có kiểm soát thay vì để lọt tải không giới hạn tới LLM/TTS.

### 5.2. Định mức & Giới hạn Payload trên Các Endpoint Tốn Tài nguyên
| Endpoint | Rate Limit / Phút | Daily Quota | Giới hạn Payload / Output | Cơ chế bảo vệ bổ sung |
| :--- | :---: | :---: | :--- | :--- |
| `POST /api/ai/chat` | `20 req/phút` | `150 req/ngày` | `MAX_USER_TEXT_LENGTH = 500`, `MAX_HISTORY_ITEMS = 10` (`300` ký tự/tin), `maxOutputTokens = 1000` | Prompt injection filter đa ngôn ngữ (`INJECTION_PATTERNS`) |
| `POST /api/ai/tutor` | `20 req/phút` | `150 req/ngày` | `MAX_QUESTION_LENGTH = 500`, `MAX_OUTPUT_TOKENS = 750` | RAG retrieval giới hạn tối đa `6` chunks (`ragRetriever.js`) |
| `POST /api/ai/coach` | `15 req/phút` | `80 req/ngày` | Bound theo user ID | Zero-trust JWT (`verifyRequestAuth`) |
| `POST /api/ai/grade` | `30 req/phút` | `300 req/ngày` | `MAX_TEXT_LEN = 3000`, `MAX_AUDIO_BASE64_LEN = 4_000_000` | Chặn payload âm thanh/văn bản quá khổ |
| `POST /api/ai/roleplay` | `25 req/phút` | `150 req/ngày` | Bound theo user ID | Lưu phiên thoại kiểm soát dung lượng |
| `POST /api/ai/teacher` | `20 req/phút` | `150 req/ngày` | Bound theo user ID | Role guard giáo viên/admin |
| `GET/POST /api/audio/tts` | `60 req/phút` | `2000 req/ngày` | `MAX_TEXT_LENGTH = 600`, bắt buộc chứa chữ Hán `[\u4e00-\u9fa5]` | **2-tier Content-Addressable Cache**: SHA-256 (`text\|voice\|rate`) → bảng `tts_audio_cache_registry` → bucket `tts-audio-cache` (sharded path); fallback `client_fallback_required` không ném 500 |
| `POST /api/hsk/submit` | — *(Auth optional)* | — | Chấm điểm server-side trên `getFullExamById(examId)` | Idempotency cache in-memory `5 phút` (`recentSubmissions`) chống double-submit |
| `POST /api/live/join` | Auth required | — | Giới hạn sĩ số mặc định `max_capacity = 50` học viên/phòng | Ưu tiên **PostgreSQL Atomic RPC `atomic_join_live_session`**, fallback query đếm `head: true, count: 'exact'` |

---

## 6. Rà soát Truy vấn Cơ sở Dữ liệu & Chỉ mục (`supabase/migrations/`)

- **Chỉ mục SQL:** Hệ thống migration có **`164` câu lệnh `CREATE INDEX` / `CREATE UNIQUE INDEX`** trên các cột truy vấn nóng (`user_id`, `status`, `created_at DESC`, `classroom_id`, `session_id`, `hsk_level`, GIN index cho `weak_vocab`, `user_learning_telemetry(user_id, created_at)`, `tts_audio_cache_registry`, v.v.).
- **Phân trang & Giới hạn dòng (`range` / `limit`):**
  - `communityService.js`, `dictionaryService.js`, `hsk30FlashcardDeckService.js`, `readingStudioService.ts`, `writingStudioService.ts`, `leaderboardService.js` đều áp dụng `.range()` hoặc `.limit(12..100)`.
  - **Điểm cần lưu ý:** `vocabularyService.js` (`limit(5000)` cho bảng `vocabulary`) và `PronunciationPage` (`limit(1000)`) đang kéo lượng bản ghi lớn trong 1 request khi vào trang lần đầu.
- **CDN & HTTP Caching (`vercel.json`):** Toàn bộ `/assets/(.*)` được gắn `Cache-Control: public, max-age=31536000, immutable`, giúp các lần truy cập lặp lại gần như bằng `0` chi phí băng thông tĩnh.

---

## 7. Phân tích Các Nút thắt Tiềm ẩn Khi Tăng Đồng thời (Bottleneck Analysis)

1. **Vercel Serverless Cold Start & Bộ nhớ cục bộ:**
   - `api/_handlers/hsk/submit.js` dùng `recentSubmissions = new Map()` trong RAM để chống double-submit. Trên Vercel Serverless đa instance, khi lưu lượng tăng và scale nhiều container, cache RAM không chia sẻ giữa các instance (dù không gây sai logic chấm điểm vì DB vẫn lưu bản ghi).
2. **Nạp danh sách từ vựng lớn trên `#vocabulary` (`INP = 308 ms`, `limit=5000`):**
   - Tải 1 lần `vocabulary?limit=5000` và render danh sách lớn khi chuyển tab `"Danh sách"` tạo `241 ms` presentation delay (`INP = 308 ms > 200 ms`). Nếu người dùng mở cùng lúc, chi phí băng thông DB Supabase và thời gian render DOM trên thiết bị yếu sẽ tăng.
3. **Chunk dữ liệu sát trần ngân sách `180 KB` gzip:**
   - `data-learning-path` (`175.25 KB` gzip, dư `4.75 KB`) và `data-hsk-core` (`175.00 KB` gzip, dư `5.00 KB`) đã rất sát ngưỡng `180 KB`. Việc thêm bài/đề thi mới trong tương lai cần tách theo cấp độ HSK thay vì gộp chung.
4. **`TOTAL CSS` sát trần `45 KB` gzip:**
   - Hiện tại là `43.92 KB` gzip (dư `1.08 KB`). Cần tiếp tục kỷ luật tái sử dụng class Tailwind chuẩn như đã làm ở Task 39.02–39.03.
5. **Render-blocking Google Fonts CSS:**
   - Yêu cầu `https://fonts.googleapis.com/css2?...` chặn render `241 ms` ở lần tải đầu khi mạng chậm.

---

## 8. Những Gì Đã Sửa Trong Task 39.04

- **Không có thay đổi mã nguồn ứng dụng** trong Task 39.04 (vì toàn bộ metric tải trang `#home` đạt `LCP 724 ms`, `CLS 0.00`, `0` lỗi tải chunk và `build:verify` đã PASS toàn diện sau đợt tối ưu banner mobile trước đó).
- Chỉ tạo mới báo cáo kiểm định này tại `docs/PHASE_39_TASK_39_04_PERFORMANCE_LOAD_VERIFICATION_REPORT.md`.

---

## 9. Kết quả Kiểm định Tổng thể (`lint`, `test`, `build:verify`)

Kết quả chạy ngay trên trạng thái mã nguồn hiện tại (sau đợt thu gọn banner mobile, không chỉnh sửa code thêm ở Task 39.04):
- `npm run lint` (`oxlint`): **PASS** (`0` errors)
- `npm test`: **PASS** (toàn bộ bộ test đều xanh)
- `npm run build:verify`: **PASS** (`index.js = 95.86 KB` gzip `<= 160 KB`; `TOTAL CSS = 43.92 KB` gzip `<= 45 KB`; Chunk isolation PASS).

---

## 10. So sánh Local Production Preview vs Production Load Capacity

| Khía cạnh | Local Production Preview (`localhost:4173`) | Production (`hanzigo-xi.vercel.app`) |
| :--- | :--- | :--- |
| **Bundle & Lazy Chunking** | Đã đo thực tế trên bản build minified (`vite preview`) | Dùng cùng artifact build; kèm Vercel `max-age=31536000, immutable` |
| **TTFB / Network Latency** | `8 ms` (mạng loopback nội bộ) | Phụ thuộc Edge/Serverless cold start & vùng địa lý **[NOT VERIFIED — NO PRODUCTION LOAD TEST]** |
| **DB / Redis Concurrency** | Chưa tạo tải đồng thời lớn | Đánh giá qua kiến trúc fail-closed Upstash + `164` index + RPC **[NOT VERIFIED — NO PRODUCTION LOAD TEST]** |

---

## 11. Các Tồn đọng Nhỏ & Đề xuất Tối ưu Kế tiếp (Non-blocking Backlog)

1. **Tối ưu `INP` (`308 ms`) tại `#vocabulary` tab `"Danh sách"`:** Áp dụng phân trang UI/virtualization (ví dụ render 50–100 mục/trang) và phân trang API `vocabulary` thay vì kéo `limit=5000` một lần.
2. **Tách nhỏ `data-learning-path` & `data-hsk-core`:** Khi bổ sung thêm nội dung HSK mới, chia nhỏ theo từng cấp (`hsk1-3`, `hsk4-6`, `hsk7-9`) để giữ khoảng cách an toàn dưới `180 KB` gzip.
3. **Font Loading:** Cân nhắc `font-display: swap` hoặc preconnect/subset gọn hơn cho Google Fonts để giảm render-blocking `241 ms`.
4. **Console Error `msgid=242`:** `Permissions policy violation: unload is not allowed in this document.` (thường đến từ listener `unload` của thư viện/extension bên ngoài; nên thay bằng `pagehide` nếu có trong mã nguồn/dependency).

---

## 12. Kế hoạch Kiểm thử Tải Có Kiểm Soát (Trước Khi Mở Rộng Quy Mô)

Nếu dự án chuẩn bị đón đợt tăng trưởng người dùng đồng thời lớn (ví dụ sự kiện thi thử HSK tập trung > 200 thí sinh cùng lúc):
1. **Môi trường:** Tạo **Staging Environment riêng** (Vercel Preview + Supabase Staging + Upstash Staging), **tuyệt đối không** bắn tải vào Production.
2. **Kịch bản k6 / Artillery (ramp-up từng bước 20 → 50 → 100 VU trong 5 phút):**
   - Luồng 1: Tải static + `/api/hsk/exams` (kiểm tra P95 < 500 ms).
   - Luồng 2: Nộp bài `/api/hsk/submit` đồng thời (kiểm tra idempotency & DB write throughput).
   - Luồng 3: `/api/live/join` với 50+ user vào 1 phòng (kiểm tra `atomic_join_live_session` lock & capacity cap).
   - Luồng 4: `/api/audio/tts` cache hit vs cache miss (kiểm tra hit-rate `tts-audio-cache` & rate limiter HTTP `429`).

---

## 13. Trạng thái Bằng chứng & Minh bạch

- **Dữ liệu đo thực tế trực tiếp trong phiên:**
  - `npm run build:verify` (raw/gzip toàn bộ chunks & `dist/index.html` isolation check).
  - Chrome DevTools MCP trên `http://localhost:4173/` (`LCP 724 ms`, `TTFB 8 ms`, `CLS 0.00`, `INP 308 ms`, `34` app requests, lazy chunks từng route).
  - Rà soát trực tiếp mã nguồn `api/_utils/distributedRateLimiter.js`, `api/audio/tts.js`, `api/_handlers/ai/*.js`, `api/_handlers/hsk/submit.js`, `api/_handlers/live/join.js`, `vercel.json`, và `supabase/migrations/*.sql`.
- **Mục không xác minh trong phiên (được gắn nhãn minh bạch):**
  - `#dashboard` sau đăng nhập: **`[NOT VERIFIED — AUTH REQUIRED]`**.
  - Sức chịu tải thực tế dưới concurrency cao trên Production: **`[NOT VERIFIED — NO PRODUCTION LOAD TEST]`**.

---

## 14. Kết luận & Trạng thái Chốt Task 39.04

- **Kết luận:** Hiệu năng frontend trên **Local Production Preview** đạt chuẩn tốt (`LCP 724 ms`, `CLS 0.00`, entry JS `95.86 KB` gzip, CSS `43.92 KB` gzip, cách ly triệt để `vendor-livekit` & `vendor-hanzi`). Kiến trúc API/DB đã trang bị đầy đủ lớp phòng vệ (Upstash Redis fail-closed, SHA-256 TTS cache, atomic Live join RPC, `164` SQL indexes), sẵn sàng cho vận hành hiện tại và có lộ trình rõ ràng để tối ưu `INP` tab Danh sách từ vựng (`308 ms`) cũng như tách data chunk khi mở rộng.
- **Trạng thái:** **HOÀN TẤT TASK 39.04** — **DỪNG TẠI ĐÂY**, chờ phê duyệt của bạn trước khi chuyển sang **Task 39.05**.
