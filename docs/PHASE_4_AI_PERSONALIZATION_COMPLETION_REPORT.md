# BÁO CÁO HOÀN THÀNH PHASE 4: PERSONALIZED AI LEARNING ENGINE

**Dự án:** HanziGo — Nền tảng Học tiếng Trung Trực tuyến Cá nhân hóa cho Người Việt  
**Giai đoạn:** Phase 4 — Personalized AI Learning Engine  
**Thời gian hoàn thành:** 16/10/2026  
**Chuyên gia thực hiện:** Senior AI Engineer, Full-Stack Architect & Learning Analytics Engineer  
**Kho mã nguồn:** [https://github.com/haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
**Môi trường Production:** [https://hanzigo-xi.vercel.app](https://hanzigo-xi.vercel.app/)

---

## 1. TỔNG QUAN VÀ MỤC TIÊU ĐẠT ĐƯỢC

Phase 4 đã hoàn thành việc xây dựng **Hệ thống AI Cá nhân hóa việc học tiếng Trung**, kế thừa và xâu chuỗi toàn bộ hạ tầng đã phát triển ở các giai đoạn trước (Lộ trình bài học 60 bài, Thuật toán lặp lại ngắt quãng SRS SuperMemo-2, Trung tâm luyện thi HSK & Sổ tay câu sai Phase 3, và Hạ tầng AI Lão Sư HanziGo với cơ chế Free-First):

1. **Zero-Hallucination & Zero-Fabrication:**
   - Tuyệt đối không sinh điểm số ngẫu nhiên hoặc tạo lịch sử ảo.
   - Phân biệt rạch ròi giữa "Chưa có dữ liệu" (`score: null`, `hasEnoughData: false`) và "Điểm bằng 0".
   - Học viên mới được kích hoạt trạng thái Cold-Start minh bạch (`hasSparseData: true`).
2. **Unified Learning Profile Service:**
   - Hợp nhất đa nguồn dữ liệu học tập thực tế từ Lộ trình, Từ vựng SRS, Kết quả thi HSK, Sổ tay câu sai và Microphone.
3. **Multi-Signal Learning Recommendation Engine:**
   - Hệ thống xếp hạng đề xuất theo quy tắc kết hợp đa tín hiệu dữ liệu: Từ vựng đến hạn ôn, câu sai trong các đề HSK, bài học tiên quyết chưa hoàn thành, kỹ năng yếu, mục tiêu học tập và nguy cơ gián đoạn học tập.
   - Mỗi đề xuất đều có lý do giải thích minh bạch (`reason`), mức ưu tiên (`priority`), thời lượng ước tính (`estimatedMinutes`), căn cứ dữ liệu (`signals`) và đường dẫn thực tế (`actionUrl`), cam kết **100% Zero Broken Links** (không đề xuất bài học ảo).
4. **Bảo mật Zero-Trust & Free-First Cost Policy:**
   - Endpoint `/api/ai/personalize` được khóa chặt: Xác thực JWT Bearer, từ chối client mạo danh `userId` của tài khoản khác (`403 Forbidden`).
   - Giữ vững chính sách **Free-First**: Ưu tiên tối đa hạn ngạch miễn phí của xKiro, `ALLOW_PAID_FALLBACK=false` (không tự ý trừ tiền tài khoản), tự động hạ cấp sang bộ máy quy tắc xác định ngoại tuyến (`deterministicPersonalizationEngine.js`) khi mất mạng hoặc vượt quota.
   - Smart Caching theo ngày ngăn chặn việc gọi API AI trùng lặp lãng phí tài nguyên.

---

## 2. DANH SÁCH CÁC FILE ĐÃ TẠO MỚI VÀ THAY ĐỔI

### 2.1. File tạo mới
1. `src/services/unifiedLearningProfileService.js`:
   - Dịch vụ tổng hợp hồ sơ năng lực học tập thống nhất, xử lý cold-start, phân biệt no-data, hợp nhất kết quả HSK attempts và HSK mistakes từ Phase 3.
2. `src/services/learningRecommendationEngine.js`:
   - Bộ máy đề xuất nội dung học tiếp theo theo quy tắc đa tín hiệu, xếp hạng ưu tiên, sinh lý do sư phạm giải thích được và đối chiếu với danh mục bài học hợp lệ (`CURRICULUM_60_LESSONS`).
3. `tests/aiPersonalizationPhase4.test.js`:
   - Bộ kiểm thử tự động 12 kịch bản trọng tâm cho Phase 4.
4. `docs/PHASE_4_AI_PERSONALIZATION_AUDIT.md`:
   - Báo cáo kiểm toán kiến trúc, luồng dữ liệu và đánh giá khoảng trống trước khi triển khai.
5. `docs/PHASE_4_AI_PERSONALIZATION_COMPLETION_REPORT.md`:
   - Báo cáo tổng kết nghiệm thu Phase 4.

### 2.2. File cập nhật
1. `api/ai/personalize.js`:
   - Siết chặt kiểm tra quyền sở hữu `userId`: Bắt buộc `payload.userId === auth.user.id` (hoặc admin), chống tấn công IDOR phân tích dữ liệu người khác.
2. `src/services/aiLearningCoachService.js`:
   - Tích hợp `hskProgress` (attempts và mistakes) vào `buildStudentLearningProfile`.
   - Bổ sung chẩn đoán câu sai HSK vào `detectWeaknesses`.
   - Tự động gắn `recommendations` từ `generateLearningRecommendations` vào kết quả trả về của cả chế độ AI và offline heuristic.
   - Xuất khẩu (re-export) các hàm từ `unifiedLearningProfileService.js` và `learningRecommendationEngine.js`.
3. `src/components/learning/AiLearningCoachWidget.jsx`:
   - Bổ sung tab **"Học gì tiếp theo?"** hiển thị danh sách đề xuất cá nhân hóa có lý do sư phạm, mức ưu tiên, thời lượng và tín hiệu căn cứ.
   - Cập nhật điều hướng `handleNavigateStep` hỗ trợ chuyển hướng tức thì sang Sổ tay câu sai HSK (`#hsk/mistakes`).
4. `package.json`:
   - Thêm `tests/aiPersonalizationPhase4.test.js` vào kịch bản kiểm thử tự động `npm test`.

---

## 3. CƠ CHẾ HOẠT ĐỘNG CHI TIẾT

### 3.1. Quy trình Xây dựng Hồ sơ Năng lực (Unified Profile)
1. **Thu thập tín hiệu**:
   - Dữ liệu từ vựng: Số từ đã thuộc (`hanzigo_vocab_remembered`), số từ cần ôn (`hanzigo_vocab_review`), số từ đến hạn SRS (`srsDueCount`).
   - Lộ trình bài học: Danh sách bài đã hoàn thành (`completedLessons`), bài tiếp theo (`nextLesson`), các bài điểm thấp cần ôn (`reviewLessons`).
   - HSK Exam & Mistakes: Đọc toàn bộ lượt thi (`hsk_attempts`), trích xuất điểm phân rã theo kỹ năng (`listening`, `reading`, `writing`), đọc Sổ tay câu sai (`hsk_mistakes`), phân loại câu sai đang cần ôn (`needs_review`) và các câu sai lặp lại nhiều lần (`topRecurringMistakes`).
   - Microphone: Lịch sử phát âm, điểm âm sắc, thanh điệu 1-4.
   - Thói quen học: Số ngày không hoạt động (`daysInactive`), chuỗi ngày học (`streak`).
2. **Quy tắc phân loại**:
   - Nếu toàn bộ các chỉ số trên đều trống $\rightarrow$ Kích hoạt `hasSparseData: true` (Cold-Start).
   - Nếu kỹ năng nào chưa từng có bài tập/lượt kiểm tra $\rightarrow$ Gán `score: null` và `hasEnoughData: false` (không hiển thị 0%).

### 3.2. Quy trình Sinh Đề xuất Học tập (Recommendation Engine)
Hệ thống chạy qua bộ quy tắc xác định 7 tầng tín hiệu:
- **Tầng 1 (Cold-Start)**: Gợi ý Placement Test 3 phút + Bài 101 mở đầu.
- **Tầng 2 (Inactivity)**: Nếu nghỉ $\ge 3$ ngày $\rightarrow$ Gợi ý bài khởi động nhanh 5 phút để kích hoạt lại thói quen.
- **Tầng 3 (SRS Backlog)**: Nếu có từ đến hạn $\rightarrow$ Gợi ý phiên Flashcard SRS (ưu tiên Cao nếu $\ge 10$ từ).
- **Tầng 4 (HSK Mistakes)**: Nếu có câu sai trong Sổ tay câu sai $\rightarrow$ Gợi ý luyện lại câu sai (ưu tiên Cao nếu có lỗi lặp lại $\ge 2$ lần), chuyển thẳng đến `#hsk/mistakes`.
- **Tầng 5 (Prerequisite / Review)**: Gợi ý ôn lại bài điểm thấp và học tiếp bài lộ trình mới (đối chiếu kiểm tra ID bài học hợp lệ trong `CURRICULUM_60_LESSONS`).
- **Tầng 6 (Skill Deficit)**: Gợi ý luyện phát âm Mic nếu điểm $< 70$, hoặc luyện nghe HSK nếu điểm nghe $< 60$.
- **Tầng 7 (User Goal)**: Thích ứng theo mục tiêu cá nhân (`hsk_exam`, `daily_communication`, `travel_speaking`).

---

## 4. KẾT QUẢ KIỂM THỬ THỰC TẾ

| Công cụ kiểm thử | Lệnh thực thi | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Node Test Suite Phase 4** | `node --test tests/aiPersonalizationPhase4.test.js` | **12 / 12 tests PASS** (174ms) | **HOÀN TOÀN ĐẠT** |
| **Toàn bộ Test Suite Dự án** | `npm test` | **510 / 510 tests PASS** (Toàn bộ 46 test files) | **HOÀN TOÀN ĐẠT** |
| **Kiểm tra Lint (Oxlint)** | `npm run lint` | **0 errors** (461 warnings style/unused) | **ĐẠT TIÊU CHUẨN** |
| **Kiểm tra Đóng gói (Vite Build)**| `npm run build` | **Build thành công trong 725ms**, xuất `dist/` | **ĐẠT TIÊU CHUẨN** |

### Chi tiết 12 kịch bản kiểm thử Phase 4:
1. `SCENARIO 1`: Hồ sơ học viên mới (Cold-Start) gán `hasSparseData: true`, gợi ý Placement Test, không sinh điểm ảo.
2. `SCENARIO 2`: Phân biệt trung thực giữa không có dữ liệu (`score: null`) và điểm bằng 0.
3. `SCENARIO 3`: Hợp nhất chuẩn xác các lượt thi HSK và Sổ tay câu sai từ Phase 3.
4. `SCENARIO 4`: Sinh khuyến nghị khởi đầu rõ ràng cho học viên mới với cờ `isInitialRecommendation: true`.
5. `SCENARIO 5`: Tồn đọng từ vựng SRS kích hoạt khuyến nghị ưu tiên cao.
6. `SCENARIO 6`: Câu sai HSK lặp lại kích hoạt bài luyện tập trong Sổ tay câu sai.
7. `SCENARIO 7`: Chống liên kết hỏng — chỉ đề xuất bài học có trong danh mục giáo trình hợp lệ.
8. `SCENARIO 8`: Nhận diện gián đoạn học tập $\ge 3$ ngày và gợi ý khôi phục thói quen.
9. `SCENARIO 9`: Bảo mật Zero-Trust từ chối yêu cầu chưa đăng nhập (401) và giả mạo `userId` (403).
10. `SCENARIO 10`: Bộ lọc chống Prompt Injection phát hiện các mẫu can thiệp hệ thống.
11. `SCENARIO 11`: Trích xuất JSON kiên cường khi AI trả về code block hoặc lời thoại bọc ngoài.
12. `SCENARIO 12`: Bảo vệ ngân sách với bộ nhớ đệm Smart Caching theo ngày, không gọi AI trùng lặp.

---

## 5. GIỚI HẠN VÀ KHUYẾN CÁO VẬN HÀNH

1. **Giới hạn AI suy luận:**
   - AI được thiết kế đóng vai trò "Cố vấn Sư phạm" gợi ý chiến lược học tập, giải thích ngữ pháp và động viên học viên.
   - AI **không được phép** tự ý sửa điểm thi, sửa tiến độ hoàn thành bài học, hoặc tự động cấp chứng chỉ chính thức.
2. **Chi phí và Hạn ngạch API:**
   - Hệ thống được cấu hình mặc định ở chế độ **Free-First**. Nếu token xKiro chạm ngưỡng rate-limit trong ngày, hệ thống tự động chạy tiếp bằng bộ máy quy tắc ngoại tuyến mà không làm gián đoạn trải nghiệm người dùng.
   - Khuyến cáo Quản trị viên **không** bật cờ `ALLOW_PAID_FALLBACK=true` trừ khi có quyết định tài chính rõ ràng.

---

## 6. HƯỚNG DẪN KIỂM THỬ THỦ CÔNG (MANUAL QA)

1. **Kiểm tra Học viên Mới (Cold-Start):**
   - Mở trình duyệt ẩn danh (Incognito) truy cập `http://localhost:5174/`.
   - Vào Dashboard: Quan sát khối "Lão Sư HanziGo", thấy xuất hiện banner xanh dương hướng dẫn học viên mới làm bài Placement Test hoặc bắt đầu Bài 1.
   - Bấm vào tab "Học gì tiếp theo?": Thấy 2 khuyến nghị khởi đầu với nhãn "Khuyên dùng".
2. **Kiểm tra Đề xuất từ Sổ tay câu sai HSK:**
   - Vào mục Thi thử HSK (`#hsk`), làm một bài thi và cố ý chọn sai 2-3 câu rồi nộp bài.
   - Quay lại Dashboard (`#dashboard`), bấm vào tab "Học gì tiếp theo?": Thấy xuất hiện khuyến nghị "Luyện lại các câu sai trong Sổ tay câu sai" màu đỏ/vàng với nút "Học ngay".
   - Bấm "Học ngay": Hệ thống tự động chuyển mượt mà sang tab Sổ tay câu sai HSK (`#hsk/mistakes`).
3. **Kiểm tra Điều chỉnh Mục tiêu:**
   - Trong widget Lão Sư HanziGo, đổi mục tiêu từ "Nền tảng vững chắc" sang "Luyện thi HSK" hoặc đổi thời lượng từ 15p sang 30p.
   - Quan sát danh sách đề xuất cập nhật theo đúng mục tiêu đã chọn.

---

## 7. KẾT LUẬN VÀ TRẠNG THÁI TRIỂN KHAI

### **KẾT LUẬN: PHASE 4 ĐÃ HOÀN THÀNH TOÀN DIỆN VÀ SẴN SÀNG TRIỂN KHAI (READY FOR PRODUCTION REVIEW)**

- Toàn bộ các yêu cầu của Phase 4 về AI cá nhân hóa học tập, thống nhất hồ sơ năng lực, đề xuất đa tín hiệu, bảo mật Zero-Trust và kiểm thử tự động đã được thực hiện và kiểm chứng thành công.
- Không có bất kỳ thay đổi nào làm ảnh hưởng đến dữ liệu Production của người dùng.
