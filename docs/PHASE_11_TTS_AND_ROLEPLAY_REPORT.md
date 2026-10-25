# BÁO CÁO NGHIỆM THU PHASE 11: AZURE NEURAL TTS CACHING PROXY & CONTEXTUAL AI ROLEPLAY STUDIO

**Dự án:** HanziGo — Nền tảng Học Tiếng Trung Toàn Diện Cho Người Việt  
**Phiên bản:** Release 1.3 (Phase 11)  
**Thời gian nghiệm thu:** 25/10/2026  
**Trạng thái kiểm thử:** ✅ **611 / 611 Tests PASS (100%)** | **0 Lint Errors** | **Vite Production Build Thành công**

---

## 1. TỔNG QUAN MỤC TIÊU PHASE 11
Phase 11 hoàn thiện 2 trụ cột tính năng chiến lược:
1. **Kiến trúc Phát âm Phân tầng & Backend Proxy Azure Neural TTS (`/api/audio/tts`):**
   - Tích hợp giọng đọc thần kinh tự nhiên chuẩn của Microsoft Azure (`zh-CN-XiaoxiaoNeural`, `zh-CN-YunxiNeural`, `zh-CN-XiaoyiNeural`).
   - Xây dựng cơ chế lưu đệm (caching) MP3 trên Supabase Storage bucket `audio-cache` với mã băm `SHA-256` tiền định, giúp tiết kiệm hơn 95% chi phí và hạn ngạch API Azure.
   - Cơ chế Graceful Fallback: Tự động chuyển đổi mượt mà về Web Speech API cục bộ khi offline hoặc chưa cấu hình khóa Azure, tuyệt đối không làm crash server hoặc hiển thị lỗi đỏ trên UI.
2. **Phòng Luyện Hội thoại Nhập vai theo Ngữ cảnh Bài học (Contextual AI Roleplay Studio):**
   - Trích xuất động ngữ cảnh, nhân vật AI, 3 mục tiêu nhiệm vụ, từ vựng (`targetVocab`) và ngữ pháp (`targetGrammar`) bám sát từng bài trong **120 bài học HSK 1–6** (`l-101` đến `l-620`) cùng **6 kịch bản giao tiếp thực tế đặc biệt**.
   - Endpoint `/api/ai/roleplay` tuân thủ nghiêm ngặt chính sách AI Gateway Free-First (xKiro ưu tiên + Gemini dự phòng + Bộ máy Sư phạm Ngoại tuyến Offline Pedagogical Fallback).
   - Giao diện phòng học tương tác đa phương thức: Hỗ trợ nhấn giữ nói (Push-to-Talk Web Speech `zh-CN`), chấm điểm, theo dõi tiến độ nhiệm vụ thời gian thực, bảng phân tích sửa lỗi ngữ pháp (Inline Grammar Coach) kèm 1-click **"Lưu cấu trúc này vào SRS"**.

---

## 2. CHI TIẾT KIẾN TRÚC KỸ THUẬT

### 2.1. Backend Proxy Azure Neural TTS & 4 Chốt Chặn Bảo Mật (`api/audio/tts.js`)

```
Học viên Client
       │
       ▼  [POST /api/audio/tts] kèm Bearer Token
┌────────────────────────────────────────────────────────┐
│ Chốt chặn 1: Zero-Trust Bearer Token Auth               │
│ - Xác thực token với Supabase Auth. Từ chối 401 nếu thiếu│
└──────────────────────────┬─────────────────────────────┘
                           │ Hợp lệ
                           ▼
┌────────────────────────────────────────────────────────┐
│ Chốt chặn 2: Ràng buộc Nội dung & Anti-SSML Injection   │
│ - 1 <= Độ dài <= 150 ký tự                             │
│ - Bắt buộc chứa chữ Hán: /[\u4e00-\u9fa5]/             │
│ - Whitelist giọng đọc & tốc độ: 0.7 <= rate <= 1.2     │
│ - escapeSsml() làm sạch các ký tự <, >, &, ", '        │
└──────────────────────────┬─────────────────────────────┘
                           │ Hợp lệ
                           ▼
┌────────────────────────────────────────────────────────┐
│ Chốt chặn 3: Định danh SHA-256 Cache Key               │
│ - cacheKey = SHA256("${voice}_${rate}_${text}")        │
│ - Kiểm tra Supabase Storage: tts/${cacheKey}.mp3       │
└──────────────────────────┬─────────────────────────────┘
          Cache HIT ───────┴─────── Cache MISS
          │                         │
          ▼                         ▼
   Trả về URL Cache         ┌───────────────────────────────────────┐
   (0 ms Azure latency,     │ Chốt chặn 4: Gọi Azure Cognitive TTS  │
    0 chi phí API)          │ - Gửi SSML tới Azure Speech REST API  │
                            │ - Upload MP3 buffer lên Storage cache │
                            │ - Graceful Fallback: nếu thiếu Key     │
                            │   hoặc lỗi 429/5xx, trả về:           │
                            │   { fallbackToWebSpeech: true }       │
                            └───────────────────────────────────────┘
```

- **Mã hóa khóa băm tiền định:**
  ```javascript
  const normalizedText = text.trim();
  const rawKey = `${voice}_${rate.toFixed(2)}_${normalizedText}`;
  const cacheKey = crypto.createHash('sha256').update(rawKey).digest('hex');
  ```
- **Bộ nhớ đệm phía Client (In-Memory Audio Cache):**
  - Tại `src/utils/audio.js`, triển khai `IN_MEMORY_AUDIO_CACHE` (Map lưu blob URL) giúp người học khi bấm nghe lại cùng một từ hoặc câu trong phiên học sẽ phát ngay từ RAM mà không phát sinh thêm bất kỳ request mạng nào.

---

### 2.2. Contextual AI Roleplay Studio

#### A. Bộ máy Xây dựng Kịch bản Động (`src/utils/roleplayScenarioBuilder.js`)
- **120 Bài học HSK 1–6:** Hàm `buildScenarioForLesson(lessonId)` trích xuất tự động `step2_vocab`, `step4_grammar` và bối cảnh hội thoại từ `step1_intro` hoặc `step5_audio`.
- **6 Kịch bản Thực tế Đặc biệt:**
  1. `scenario-restaurant`: Gọi món tại Nhà hàng Tứ Xuyên (`Vương Tiểu Nhị`).
  2. `scenario-shopping`: Mặc cả Mua sắm tại Chợ Đêm Vương Phủ Tỉnh (`Bác Trương`).
  3. `scenario-taxi`: Hỏi đường & Bắt taxi đến Ga Tàu Bắc Kinh (`Bác tài Lý`).
  4. `scenario-pharmacy`: Khám bệnh & Mua thuốc tại Hiệu thuốc Đồng Nhân Đường (`Dược sĩ Lưu`).
  5. `scenario-job-interview`: Phỏng vấn xin việc Kỹ sư phần mềm IT (`Giám đốc nhân sự Trần`).
  6. `scenario-business`: Đàm phán Hợp đồng Phân phối Xuất nhập khẩu (`Tổng Giám đốc Lâm`).
- **Nhiệm vụ 3 Bước Cụ thể:** Mỗi kịch bản bao gồm 3 mục tiêu rõ ràng (ví dụ: *1. Chào hỏi và nói số lượng người; 2. Hỏi giá và dặn khẩu vị ít cay; 3. Chốt món và cảm ơn*).

#### B. Backend Sư phạm `/api/ai/roleplay` & Free-First Gateway
- Bảo vệ Bearer Token với `verifyRequestAuth`.
- Chống lạm dụng và Prompt Injection qua biểu thức chính quy (`INJECTION_PATTERNS`).
- Ràng buộc HSK Level: AI Persona bị khóa từ vựng trong phạm vi HSK của bài học đó.
- Cấu trúc phản hồi JSON:
  - `replyHanzi`, `replyPinyin`, `replyVietnamese`
  - `grammarFeedback`, `correctedHanzi`
  - `usedTargetItems` (các từ mục tiêu mà học viên vừa dùng)
  - `completedObjectives` (danh sách nhiệm vụ đã hoàn thành)
  - `suggestedReplies` (2–3 câu trả lời gợi ý kèm Pinyin và tiếng Việt)
- **Offline Pedagogical Fallback:** Khi môi trường chưa có API key hoặc hết hạn ngạch ngày, hệ thống rẽ nhánh tự động theo từ khóa của học viên dựa trên kịch bản sư phạm offline, cam kết không bao giờ bị gián đoạn phiên học.

#### C. Giao diện Tương tác `RoleplayStudioModal.jsx`
- Tích hợp Push-to-Talk (Web Speech Recognition nhận diện giọng nói `zh-CN`).
- Nút nghe âm thanh tích hợp 2 tầng (Azure Neural HD Voice / Web Speech).
- Thanh Mission Tracker trực quan với thanh tiến trình % và hiệu ứng chúc mừng (Confetti) khi đạt 3/3 mục tiêu.
- Thẻ Inline Grammar Coach phân tích điểm cải thiện và nút **"Lưu cấu trúc này vào SRS"** (gọi `captureWeakVocabulary`).

---

## 3. DANH SÁCH FILE THAY ĐỔI & TẠO MỚI

| File | Hành động | Nội dung & Vai trò |
| :--- | :--- | :--- |
| `api/audio/tts.js` | Tạo mới | Serverless Function Proxy Azure Neural TTS với 4 chốt chặn bảo mật, cache SHA-256 trên Supabase Storage và Graceful Fallback. |
| `src/utils/audio.js` | Nâng cấp | Thêm In-memory RAM cache, hỗ trợ phát âm 2 tầng (Neural HD Voice qua `/api/audio/tts` + Web Speech API fallback). |
| `src/utils/roleplayScenarioBuilder.js` | Tạo mới | Trích xuất kịch bản động từ 120 bài học HSK 1–6 và 6 kịch bản giao tiếp thực tế đặc biệt, nhận diện từ vựng mục tiêu. |
| `api/ai/roleplay.js` | Tạo mới | Serverless Function AI Roleplay Studio với Zero-Trust Auth, Prompt Injection Guard, Free-First Gateway và Offline Pedagogical Engine. |
| `src/services/roleplayService.js` | Tạo mới | Service kết nối client với `/api/ai/roleplay`, tự động đính kèm Supabase Bearer token và xử lý offline fallback an toàn. |
| `src/components/learning/RoleplayStudioModal.jsx` | Tạo mới | Modal phòng luyện hội thoại nhập vai với Push-to-Talk, Mission Tracker, Inline Grammar Coach, SRS 1-click capture. |
| `src/components/learning/InteractiveLessonPlayer.jsx` | Cập nhật | Tích hợp nút "🎭 Nhập vai AI" trên thanh tiêu đề bài học, khởi chạy Roleplay Studio bám sát bài học hiện tại. |
| `src/pages/ConversationPage.jsx` | Cập nhật | Bổ sung tab "🎭 Roleplay Studio (Nhập Vai)" với danh sách 6 kịch bản đời thực cho học viên luyện tập tự do. |
| `.env.example` | Cập nhật | Bổ sung tài liệu cấu hình `AZURE_SPEECH_KEY` và `AZURE_SPEECH_REGION`. |
| `package.json` | Cập nhật | Đăng ký các file test mới vào kịch bản `npm test`. |
| `tests/azureTtsProxy.test.js` | Tạo mới | Bộ unit & security test cho `/api/audio/tts`: Escape SSML, SHA-256 hash, 401 unauth, 400 validation, graceful fallback. |
| `tests/roleplayStudio.test.js` | Tạo mới | Bộ test kịch bản bài học, kiểm tra nhận diện từ vựng mục tiêu, chống prompt injection, offline pedagogical engine và auth. |
| `docs/PHASE_11_TTS_AND_ROLEPLAY_REPORT.md` | Tạo mới | Báo cáo chi tiết kỹ thuật và nghiệm thu Phase 11. |
| `docs/HANZIGO_MASTER_DOCUMENTATION.md` | Cập nhật | Nâng cấp tài liệu kỹ thuật tổng thể hệ thống lên Release 1.3. |

---

## 4. KẾT QUẢ KIỂM THỬ & CHẤT LƯỢNG MÃ NGUỒN

### 4.1. Unit & Security Integration Tests
- Lệnh chạy: `npm test`
- Kết quả: **611 / 611 tests PASSED (100%)**
- Chi tiết:
  - 595 tests hiện có từ Phase 1 đến Phase 10: Giữ vững 100% không suy suyển.
  - 8 tests mới trong `tests/azureTtsProxy.test.js`: PASS 100%.
  - 8 tests mới trong `tests/roleplayStudio.test.js`: PASS 100%.

### 4.2. Code Quality & Linting
- Lệnh chạy: `npm run lint` (`oxlint`)
- Kết quả: **0 Errors** (500 warnings từ các thư viện và code gốc, 0 lỗi cú pháp hoặc vi phạm rules of hooks).

### 4.3. Production Build & Bundle Optimization
- Lệnh chạy: `npm run build` (`vite build`)
- Kết quả: **Build thành công trong 845ms**.
- Code-splitting tự động:
  - `dist/assets/RoleplayStudioModal-D_TUpp2y.js` được tách thành chunk riêng với dung lượng nhỏ gọn **31.19 kB (11.42 kB gzip)**.
  - Không làm phình to bundle chính (`index.html` và core components giữ nguyên hiệu năng ban đầu).

---

## 5. KẾT LUẬN & BÀN GIAO
Toàn bộ mục tiêu đặt ra cho **Phase 11 (Azure Neural TTS Caching Proxy & Contextual AI Roleplay Studio)** đã được hoàn thành xuất sắc, tuân thủ nghiêm ngặt các nguyên tắc bảo mật Zero-Trust, chính sách chi phí AI Free-First và tính ổn định tuyệt đối của hệ thống HanziGo.
Hệ thống sẵn sàng cho việc triển khai môi trường sản xuất (Production Deployment).
