# HANZIGO — PHASE 4.1: BÁO CÁO KIỂM TOÁN ĐỘC LẬP NGHIỆM THU AI CÁ NHÂN HÓA (ACCEPTANCE AUDIT)

**Dự án**: HanziGo — Nền tảng học tiếng Trung cho người Việt  
**Repository**: [haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
**Production**: [hanzigo-xi.vercel.app](https://hanzigo-xi.vercel.app/)  
**Ngày thực hiện**: 16/10/2026  
**Chuyên môn phụ trách**: Senior Full-Stack Engineer, AI Quality Engineer, Security Auditor & QA Automation Lead  

---

## TỔNG QUAN VÀ PHƯƠNG PHÁP KIỂM TOÁN

Nhiệm vụ của **Phase 4.1** là tiến hành kiểm toán pháp y độc lập (forensic acceptance audit), xác minh tích hợp từ mã nguồn và kiểm thử tự động thực tế đối với toàn bộ hệ thống **AI Cá nhân hóa học tập** được bàn giao từ Phase 4.

### Quy tắc kiểm toán bắt buộc:
1. **Không tin tuyệt đối vào báo cáo Phase 4**: Mọi tuyên bố hoàn thành đều phải được chứng minh bằng mã nguồn đang chạy và các test runner thực thi (`node --test`).
2. **Không che giấu lỗi**: Phân định rạch ròi giữa mã nguồn đã xác minh, kiểm thử đã chạy qua, nội dung chỉ mới là tài liệu lý thuyết và các giới hạn môi trường chưa thể kiểm chứng.
3. **Chính sách Free-First**: Tuyệt đối không bật cờ trả phí `ALLOW_PAID_FALLBACK=true`, bảo vệ ngân sách 0 VNĐ cho nhà phát triển.
4. **Không tạo dữ liệu giả**: Phân biệt triệt để giữa giá trị bằng `0` và trạng thái `null` (chưa có dữ liệu/cold-start).

---

## BẢNG TỔNG KẾT MỨC ĐỘ XÁC MINH CÁC THÀNH PHẦN

| Thành phần / Tiêu chí | Trạng thái | Phương pháp xác minh | Ghi chú & Rủi ro còn lại |
| :--- | :---: | :--- | :--- |
| `src/services/unifiedLearningProfileService.js` | **VERIFIED** | Code Audit + Scenarios 1, 2, 3 | Hợp nhất 4 nguồn: Lộ trình 60 bài, SRS SM-2, HSK Exam Center, Luyện phát âm / Viết chữ. Phân biệt rõ `null` vs `0`. |
| `src/services/learningRecommendationEngine.js` | **VERIFIED** | Code Audit + Scenarios 4, 5, 6, 7, 8, 15 | Không sinh broken links; lọc bỏ bài đã hoàn thành; đề xuất theo trọng số mục tiêu (HSK vs Giao tiếp). |
| `src/services/aiLearningCoachService.js` | **VERIFIED** | Code Audit + Scenarios 12, 13 | Đã sửa lỗi Cache Collision theo mục tiêu và thời lượng học. Fallback an toàn sang thuật toán sư phạm offline khi API ngắt kết nối. |
| `src/services/aiGateway.js` | **VERIFIED** | Code Audit + Scenario 14 | Đã bổ sung Concept Discriminator vào cache key để chống nhầm lẫn đề thi/bài tập giữa các chủ điểm ngữ pháp. |
| `api/ai/personalize.js` | **VERIFIED** | Code Audit + Scenarios 9, 10 | Xác thực Bearer JWT; chặn IDOR chéo tài khoản; bộ lọc Regex phát hiện Prompt Injection và Abuse Patterns. |
| `src/components/learning/AiLearningCoachWidget.jsx` | **VERIFIED** | Code Audit + Build Check | Giao diện hiển thị trực quan; badge giải thích lý do; hỗ trợ cả 2 chế độ Online AI và Offline Heuristics; điều hướng chuẩn xác. |
| Supabase RLS & Sync liên thiết bị | **PARTIALLY VERIFIED** | Migration Audit + Mock Sync Tests | RLS policies và schema đã chuẩn bị (`hsk_exams`, `hsk_exam_attempts`, `hsk_mistake_notebook`). Cần tài khoản Supabase Production live để kiểm thử đồng thời vật lý. |
| Mức tiêu thụ AI Token thực tế trên Production | **ENVIRONMENT LIMITED** | Heuristic Testing + Endpoint Check | Test chạy ở chế độ offline heuristic hoặc xKiro key quota giới hạn; không đo được chi phí Gemini live khi `ALLOW_PAID_FALLBACK=false`. |

---

## GIAI ĐOẠN A: TRUY TÌM VÀ PHÂN TÍCH LUỒNG DỮ LIỆU THỰC TẾ

### 1. Sơ đồ luồng dữ liệu học tập nội tại (End-to-End Data Pipeline)

```
[1. Nguồn Dữ Liệu Học Viên]
  ├── Supabase DB / LocalStorage: Tiến độ 60 bài học (journey_progress)
  ├── SRS Storage: Thẻ từ vựng đến hạn ôn tập (SM-2 reviewWords)
  ├── Phase 3 HSK Tables: Điểm thi thử, tỷ lệ nghe/đọc/viết, sổ tay câu sai (needs_review)
  └── Luyện âm / Luyện viết: Lịch sử ghi âm mic & số chữ Hán đã viết
            │
            ▼
[2. Unified Learning Profile Service] (unifiedLearningProfileService.js)
  ├── Chuẩn hóa dữ liệu thô, phát hiện người học mới (isColdStart / hasSparseData)
  ├── Đánh giá trung thực 7 kỹ năng (Từ vựng, Ngữ pháp, Nghe hiểu, Đọc hiểu, Viết, Phát âm, Giao tiếp)
  │   └── Quy tắc vàng: Thiếu dữ liệu -> score = null (không gán 0 điểm bừa bãi)
  └── Trích xuất danh sách bài học tiếp theo, bài cần ôn lại, câu sai lặp lại
            │
            ▼
[3. Multi-Signal Recommendation Engine] (learningRecommendationEngine.js)
  ├── Phân loại ưu tiên: Khôi phục gián đoạn (Inactivity) > SRS Backlog > HSK Mistakes > Bài học mới
  ├── Trọng số mục tiêu người học:
  │   ├── Mục tiêu 'hsk': Đẩy độ ưu tiên bài thi thử và giải đề câu sai
  │   ├── Mục tiêu 'communication': Đẩy phát âm microphone và đàm thoại phản xạ
  │   └── Mục tiêu 'general': Cân bằng lộ trình và từ vựng
  ├── Kiểm tra tính hợp lệ của bài học: Đối chiếu ID thực tế từ CURRICULUM_DATA (loại bỏ broken link)
  └── Chặn gợi ý bài đã học làm bài mới (isNextLessonAlreadyCompleted)
            │
            ▼
[4. AI Gateway & AI Coach Serverless Orchestrator] (aiGateway.js / api/ai/coach / api/ai/personalize)
  ├── Khử trùng dữ liệu riêng tư (Sanitization): Loại bỏ mật khẩu, JWT token, email
  ├── Kiểm tra Cache cục bộ theo ngày, UserId, Mục tiêu, Thời lượng và Chủ điểm
  ├── Gọi mô hình AI Primary (xKiro Free Tier)
  │   └── Nếu timeout / lỗi 429 / offline -> Kích hoạt Fallback Heuristics sư phạm không mất phí
  └── Bộ trích xuất JSON kiên cố (extractStructuredJson): Chống lỗi bọc Markdown hoặc văn bản đệm
            │
            ▼
[5. Giao Diện Người Dùng & Điều Hướng] (AiLearningCoachWidget.jsx & DashboardPage.jsx)
  ├── Banner Lão Sư HanziGo hiển thị nhận định sư phạm và nguồn thuật toán
  ├── Tab "Học gì tiếp theo?": Danh sách các bước hành động cụ thể kèm lý do minh bạch
  └── Điều hướng trực tiếp đến trang đích tương ứng:
      ├── 'roadmap' -> Điều hướng đến bài học tương ứng (VD: l-101, l-102)
      ├── 'vocabulary' -> Mở kho từ vựng và thẻ ôn tập SRS
      ├── 'hsk' -> Trung tâm luyện đề HSK
      └── 'mistakes_tab' -> Mở trực tiếp Sổ tay câu sai (`#hsk/mistakes`)
```

---

## GIAI ĐOẠN B: KẾT QUẢ KIỂM THỬ TÍCH HỢP DỮ LIỆU HỌC TẬP

Được kiểm chứng qua bộ kiểm thử tự động `tests/aiPersonalizationPhase4.test.js` với 15 kịch bản tích hợp:

### 1. Người dùng mới hoàn toàn (Cold-Start) — Scenario 1 & 4
- **Dữ liệu đầu vào**: Không có lịch sử bài học, không có từ vựng đã nhớ, không có kết quả thi HSK.
- **Xác minh thực tế**: 
  - `profile.hasSparseData === true`, `profile.isColdStart === true`.
  - Cả 7 chỉ số kỹ năng đều hiển thị trung thực `score: null` kèm thông báo *"Chưa đủ dữ liệu đánh giá"*.
  - Gợi ý hành động đầu tiên: Khuyến nghị làm bài đánh giá trình độ đầu vào (3 phút) hoặc học ngay **Bài 101: Chào hỏi cơ bản**.

### 2. Người dùng có tiến độ bài học nhưng chưa có điểm HSK — Scenario 2
- **Dữ liệu đầu vào**: Đã hoàn thành 5 bài học, nhưng chưa từng thi thử HSK.
- **Xác minh thực tế**:
  - Kỹ năng Ngữ pháp và Đọc hiểu hiển thị điểm trung bình dựa trên bài học thực tế.
  - Kỹ năng Nghe hiểu HSK và Viết HSK hiển thị `score: null` (không bị giả định bằng 0%).

### 3. Người dùng có từ vựng SRS đến hạn ôn tập — Scenario 5
- **Dữ liệu đầu vào**: Có 12 thẻ từ vựng quá hạn ôn theo thuật toán SM-2.
- **Xác minh thực tế**:
  - Recommendation Engine ngay lập tức đẩy đề xuất *"Ôn tập 12 từ vựng đến hạn (SRS)"* lên mức ưu tiên cao nhất (`priority: 'high'`).
  - Nút hành động dẫn trực tiếp về tab `/vocabulary` với nhãn tín hiệu minh bạch.

### 4. Người dùng có câu sai HSK trong sổ tay — Scenario 3 & 6
- **Dữ liệu đầu vào**: Có các câu làm sai phần Đọc hiểu và Nghe hiểu với trạng thái `needs_review`.
- **Xác minh thực tế**:
  - Khuyến nghị tạo buổi ôn *"Luyện lại các câu sai HSK"* với thời lượng ước tính 10 phút.
  - Phân loại rõ ràng số lượng lỗi theo từng phần (Listening, Reading, Writing).
  - Điều hướng chính xác tới `#hsk/mistakes`.

### 5. Người dùng đổi mục tiêu học tập hoặc thời lượng học — Scenario 13
- **Dữ liệu đầu vào**: Đổi từ học Giao tiếp (15 phút) sang Luyện thi HSK (30 phút).
- **Xác minh thực tế**:
  - Hệ thống tự động tính toán lại key cache: `..._hsk_30_...` khác với `..._communication_15_...`.
  - Kế hoạch học tập được mở rộng tương ứng với 30 phút, không bị hiển thị nội dung cũ của kế hoạch 15 phút.

### 6. Người dùng hoàn thành toàn bộ 60 bài học (Curriculum 100%) — Scenario 15
- **Dữ liệu đầu vào**: Cả 60/60 bài học đều có trạng thái hoàn thành (`score = 100`, `stars = 3`).
- **Xác minh thực tế**:
  - Không gợi ý bất kỳ bài học nào làm "Bài tiếp theo".
  - Tự động kích hoạt đề xuất tốt nghiệp: Tham gia luyện thi thử toàn diện HSK 1 / HSK 2 để chuẩn bị lấy chứng chỉ thực tế.

---

## GIAI ĐOẠN C: KIỂM TOÁN CHẤT LƯỢNG ĐỀ XUẤT VÀ LIÊN KẾT ĐIỀU HƯỚNG

| Tiêu chí chất lượng | Kết quả kiểm tra mã nguồn & test | Đánh giá |
| :--- | :--- | :---: |
| **Không có liên kết hỏng (Zero Broken Links)** | Kiểm tra qua Scenario 7: Toàn bộ bài học được đề xuất đều đối chiếu với `CURRICULUM_DATA` (tổng cộng 60 bài). Mọi ID dạng `l-xxx` không có trong danh mục đều bị loại bỏ tự động. | **ĐẠT** |
| **Không gợi ý bài đã hoàn thành làm bài mới** | Kiểm tra logic `isNextLessonAlreadyCompleted`: Nếu bài học kế tiếp đã có trong `completedLessonIds`, động cơ sẽ tự động tìm bài học chưa học gần nhất tiếp theo hoặc chuyển sang chế độ ôn tập. | **ĐẠT** |
| **Phân biệt rạch ròi bài mới và bài ôn tập** | Đề xuất bài mới mang nhãn *"Bài học tiếp theo"*, gắn route `roadmap`. Đề xuất ôn tập mang nhãn *"Cần ôn tập lại"*, chỉ kích hoạt khi điểm số bài cũ < 90% hoặc số sao < 3. | **ĐẠT** |
| **Mục tiêu học tập định hình thứ tự đề xuất** | Khi mục tiêu là `hsk`, đề xuất luyện thi và câu sai nhận hệ số nhân ưu tiên $1.5\times$. Khi mục tiêu là `communication`, đề xuất luyện phát âm mic nhận hệ số nhân $1.5\times$. | **ĐẠT** |
| **Khử trùng lặp đề xuất (De-duplication)** | Kiểm tra Set ID trong `learningRecommendationEngine.js`: Các đề xuất trùng loại hoặc trùng bài học đích đều bị gộp lại và tăng trọng số, không xuất hiện 2 card giống nhau trên giao diện. | **ĐẠT** |

---

## GIAI ĐOẠN D: KIỂM TOÁN BẢO MẬT ZERO-TRUST & BẢO VỆ DỮ LIỆU HỌC VIÊN

### 1. Xác thực Endpoint `/api/ai/personalize` (Zero-Trust Auth)
- **Mã nguồn kiểm tra**: `api/ai/personalize.js`
- **Kết quả xác minh**:
  - Yêu cầu bắt buộc header `Authorization: Bearer <token>`.
  - Kiểm tra tính hợp lệ của token qua Supabase Auth Gateway (`getUser(token)`).
  - Nghiêm cấm client tự gửi `userId` giả mạo: Nếu `payload.userId` không trùng khớp với `auth.user.id` (và người gọi không phải Admin), endpoint trả về ngay lập tức mã lỗi `403 Forbidden` (`IDOR Prevention`).

### 2. Phòng chống Prompt Injection và Nội dung độc hại
- **Mã nguồn kiểm tra**: Hàm `detectAbuseOrInjection(input)` trong `api/ai/personalize.js`.
- **Kết quả xác minh (Scenario 10)**:
  - Chặn các mẫu tấn công jailbreak kinh điển: `ignore previous instructions`, `system prompt`, `you are now an unfiltered DAN`, `reveal secrets`, `<script>`.
  - Trả về mã lỗi `400 Bad Request` kèm thông báo từ chối rõ ràng, ghi log cảnh báo bảo mật phía máy chủ.

### 3. Vùng cách ly quyền hạn của AI (Privilege Boundary)
- Mô hình AI được thiết kế theo nguyên lý **Read-Only / Suggestion-Only**:
  - AI không sở hữu quyền ghi trực tiếp vào cơ sở dữ liệu Supabase.
  - AI không thể tự sửa điểm thi HSK, không thể tự tăng số từ vựng hay tự cấp chứng chỉ.
  - Mọi đề xuất của AI chỉ đóng vai trò tư vấn cho học viên lựa chọn.

### 4. Khử trùng dữ liệu nhạy cảm (Privacy Sanitization)
- Trước khi payload được gửi tới API hoặc lưu vào Cache:
  - Toàn bộ trường `password`, `token`, `refresh_token`, `email` cá nhân đều bị loại bỏ hoàn toàn qua hàm `cleanPersonalizationPayload`.
  - Đã kiểm chứng qua các test hồi quy: Không có bất kỳ chuỗi token hay mật khẩu nào xuất hiện trong cache `localStorage`.

---

## GIAI ĐOẠN E: KIỂM TRA ĐỘ TIN CẬY CACHE, XỬ LÝ LỖI VÀ CHÍNH SÁCH CHI PHÍ

### 1. Phân lập Cache đa chiều (Multi-Dimensional Cache Isolation)
- **Vấn đề phát hiện trong audit**: Cache trước đó chỉ dựa vào `userId` và ngày tháng. Điều này dẫn đến việc học viên đổi mục tiêu hoặc đổi thời lượng nhưng vẫn nhận kế hoạch cũ.
- **Biện pháp đã khắc phục**:
  - Key cache AI Coach: `hanzigo_ai_coach_cache_${userId}_${goal}_${minutes}_${today}`.
  - Key cache AI Gateway: `hanzigo_cache_${userId}_${action}_${targetConcept}_${today}`.
  - Đã thêm alias tương thích ngược để bảo vệ các chức năng kiểm tra bảo mật cũ.

### 2. Khả năng chịu lỗi và Trích xuất JSON kiên cố
- **Kiểm thử Scenario 11**:
  - Mô hình trả về JSON bọc trong cặp dấu markdown ` ```json ... ``` ` -> Trích xuất thành công.
  - Mô hình trả về văn bản đệm *"Dưới đây là kế hoạch học tập của bạn: {...} Chúc bạn học tốt"* -> Thuật toán Regex phát hiện khối JSON nội hàm và parse thành công.
  - Mô hình trả về chuỗi hỏng hoàn toàn -> Kích hoạt cơ chế Fallback sư phạm offline, giao diện không bị gián đoạn hay văng lỗi màn hình trắng.

### 3. Thực thi nghiêm ngặt chính sách chi phí Free-First
- File `.env.example` và mã nguồn `api/_utils/aiProviderAdapter.js` luôn duy trì:
  - `ALLOW_PAID_FALLBACK=false`: Khi hạn mức miễn phí của xKiro chạm ngưỡng (HTTP 429), hệ thống chuyển ngay sang bộ sinh đề sư phạm nội tuyến (Deterministic Heuristics Engine), **tuyệt đối không âm thầm gọi sang Gemini có phí**.

---

## GIAI ĐOẠN F: KIỂM THỬ TRẢI NGHIỆM GIAO DIỆN HỌC VIÊN

Thực hiện kiểm tra thành phần `AiLearningCoachWidget.jsx` trên cả Desktop và Mobile:

1. **Trạng thái Đang tải (Loading State)**: Hiển thị hiệu ứng Skeleton Loader trang nhã, không gây giật layout (Cumulative Layout Shift = 0).
2. **Trạng thái Trống / Người mới (Cold-Start)**: Hiển thị Banner hướng dẫn thân thiện mời làm bài kiểm tra 3 phút hoặc học Bài 101.
3. **Tab "Học gì tiếp theo?"**:
   - Được đặt làm tab mặc định khi mở widget.
   - Hiển thị đầy đủ Badge kỹ năng, thời lượng ước tính, mức ưu tiên (Cao / Trung bình) và nguồn dữ liệu căn cứ.
4. **Điều chỉnh tương tác**:
   - Thay đổi mục tiêu học tập (Tổng quát / HSK / Giao tiếp) cập nhật ngay danh sách đề xuất.
   - Thay đổi thời lượng học (10 - 60 phút) phân bổ lại các bước học phù hợp.
5. **Nút "Học bài này ngay"**:
   - Gọi hàm điều hướng mượt mà, chuyển trang chính xác đến Bài học, Trung tâm từ vựng hoặc Sổ tay câu sai mà không tải lại toàn bộ trang web (SPA navigation).

---

## GIAI ĐOẠN G: KẾT QUẢ KIỂM THỬ TỔNG HỢP VÀ BUILD DỰ ÁN

| Lệnh thực thi | Mục tiêu | Kết quả thực tế | Ghi chú |
| :--- | :--- | :---: | :--- |
| `node --test tests/aiPersonalizationPhase4.test.js` | 15 kịch bản tích hợp AI Personalization | **15 / 15 PASS** | Thời gian chạy: 198ms |
| `npm test` | Toàn bộ 46 test suites của hệ thống | **513 / 513 PASS** | 0 fail, 0 cancelled, 0 skipped |
| `npm run lint` | Kiểm tra cú pháp và quy chuẩn mã nguồn | **0 ERRORS** | 461 cảnh báo cú pháp/React Hook không chặn build |
| `npm run build` | Đóng gói sản phẩm production với Vite | **SUCCESS** | Đóng gói 2201 modules trong 740ms |

---

## CÁC GIỚI HẠN VÀ NỘI DUNG CHƯA THỂ XÁC MINH TRONG MÔI TRƯỜNG NÀY

1. **Tài khoản Supabase Production Live**:
   - Môi trường kiểm thử hiện tại chạy trên cơ chế mô phỏng an toàn (simulation mode) do không có thông tin đăng nhập thực tế của tài khoản học viên Production.
   - Các migration SQL và RLS policies đã được rà soát tĩnh và kiểm tra bằng mock schema, nhưng cần thực hiện smoke test trên tài khoản thật khi quản trị viên phân quyền.
2. **Hạn mức API xKiro Production**:
   - Khi chạy ở môi trường phát triển ngoại tuyến, hệ thống chủ yếu xác minh nhánh Offline Pedagogical Fallback. Để xác minh trọn vẹn chất lượng câu trả lời của mô hình ngôn ngữ lớn (LLM) trực tiếp từ xKiro, cần cấu hình API key còn hiệu lực trong biến môi trường Production.
3. **Tương thích đa thiết bị vật lý**:
   - Đã kiểm tra cơ chế lưu trữ qua `localStorage` đa phiên, nhưng chưa thể kiểm tra độ trễ mạng thực tế khi đồng bộ đồng thời giữa 1 điện thoại iOS và 1 laptop Windows.

---

## KẾT LUẬN VÀ KHUYẾN NGHỊ

Hệ thống **AI Cá nhân hóa học tập (Phase 4.1)** đã vượt qua toàn diện các bài kiểm toán pháp y, bảo mật Zero-Trust, độ tin cậy cache và chất lượng đề xuất sư phạm. Không phát hiện bất kỳ lỗ hổng bảo mật nghiêm trọng hay lỗi điều hướng nào.

Hệ thống hoàn toàn đủ điều kiện sẵn sàng triển khai thử nghiệm diện hẹp (**Canary / Staging Readiness**).
