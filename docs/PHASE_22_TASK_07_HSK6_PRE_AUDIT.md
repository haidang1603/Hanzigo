# HANZIGO — PHASE 22 / TASK 22.07: HSK 6 PRE-AUDIT REPORT
# KHẢO SÁT TOÀN DIỆN GIÁO TRÌNH HSK 6 TRƯỚC KHI NÂNG CẤP

**Thời điểm audit**: 08/11/2026  
**Chuyên gia phụ trách**: Senior Educational Product Architect, Chinese Language Curriculum Specialist, Senior Full-stack Engineer & QA Engineer  
**Codebase khảo sát**: `d:\DELL\Dowloads\HanziGo`  
**File mục tiêu chính**:
- `src/data/curriculumLessonsHsk4to6.js` (Bài học `l-601` đến `l-620`)
- `src/data/hanziDecomposition.js` (Cơ sở dữ liệu chiết tự IDS)
- `src/data/chineseData.js` (Cơ sở dữ liệu từ điển và kho từ vựng)

---

## 1. TỔNG QUAN HIỆN TRẠNG 20 BÀI HỌC HSK 6

Hệ thống HSK 6 hiện tại bao gồm 20 bài học thuộc 4 chương (`ch-21` đến `ch-24`), nằm trong mảng `CURRICULUM_HSK4_6_LESSONS`:

- **Chương 21 (`ch-21`)**: Thành ngữ chuyên sâu & Văn chương HSK 6 (`l-601` đến `l-605`).
- **Chương 22 (`ch-22`)**: Tuyển dụng cao cấp & Năng lực Lãnh đạo (`l-606` đến `l-610`).
- **Chương 23 (`ch-23`)**: Đàm phán thương mại quốc tế & Pháp lý hợp đồng (`l-611` đến `l-615`).
- **Chương 24 (`ch-24`)**: Báo cáo kinh tế vĩ mô, Công nghệ & Chinh phục HSK 6 toàn diện (`l-616` đến `l-620`).

---

## 2. KẾT QUẢ KHẢO SÁT CHI TIẾT THEO TỪNG HẠNG MỤC

### 2.1. Cấu trúc bài học (9 bước sư phạm)
- **Tình trạng**: 20/20 bài học (100%) đều có đầy đủ 9 trường bước: `step1_learn`, `step2_vocabulary`, `step3_hanzi`, `step4_grammar`, `step5_listening`, `step6_speaking`, `step7_writing`, `step8_quiz`, `step9_challenge`.
- **Đánh giá**: **PASS** về khung cấu trúc cơ bản.

### 2.2. Từ vựng HSK 6 (`step2_vocabulary`)
- **Tổng số từ vựng**: 80 từ (4 từ vựng / bài).
- **Pinyin**: 80/80 có dấu thanh điệu chuẩn.
- **Nghĩa tiếng Việt**: 80/80 có giải nghĩa tự nhiên, không placeholder.
- **Âm Hán Việt**: 80/80 có âm Hán Việt.
- **Bộ thủ**: 80/80 có thông tin bộ thủ.
- **Từ loại tiếng Việt (`pos`)**: **0/80 từ (0%) có trường `pos`** -> **NEEDS_UPGRADE (100% thiếu từ loại)**.
- **Ví dụ câu**: Các ví dụ có sẵn nhưng cần đối chiếu tính thực tế và chuyên sâu học thuật theo tiêu chuẩn HSK 6 mới.

### 2.3. Chữ Hán và Chiết tự IDS (`step3_hanzi`)
- **Số lượng chữ Hán**: 40 chữ (2 chữ / bài).
- **Thuộc tính khóa**: Hiện đang dùng `hanzi` thay vì chuẩn hóa thành `char`.
- **Cấu trúc chữ Hán (`structure`)**: **0/40 (0%) có đối tượng `structure: { code, name, symbol }`** -> **NEEDS_UPGRADE**.
- **Chuỗi IDS (`ids`)**: **0/40 (0%) có chuỗi IDS chuẩn Unicode** -> **NEEDS_UPGRADE**.
- **Bộ thủ (`radical`)**: Thiếu đối tượng bộ thủ chi tiết `{ char, name, strokes }`.
- **Mảng thành phần (`components`)**: Hiện là chuỗi mô tả thô (string), chưa phải mảng đối tượng `{ char, pinyin, hanviet, name, meaning }`.
- **Độ bao phủ trong `hanziDecomposition.js`**:
  - Chỉ có **1/40 chữ (`备` trong `l-615`)** đã có trong `HANZI_DECOMPOSITION_DATABASE`.
  - Còn lại **39/40 chữ (97.5%) hoàn toàn chưa có trong database**: `懈`, `废`, `彬`, `睦`, `逢`, `缓`, `薪`, `釜`, `锦`, `睛`, `简`, `履`, `筹`, `协`, `划`, `挑`, `酬`, `险`, `竭`, `聘`, `询`, `鉴`, `扣`, `让`, `撤`, `销`, `抗`, `裁`, `署`, `膨`, `胀`, `覆`, `慧`, `残`, `缺`, `缩`, `炼`, `极`, `贯`.
- **Trùng lặp với HSK 1–5**: **0 chữ trùng lặp (PASS)**. Cả 40 chữ Hán HSK 6 đều là từ vựng độc lập, mang tính văn ngôn và phân hóa cao độ.

### 2.4. Hội thoại và Luyện nghe (`step5_listening`)
- **Số lượt thoại (`dialogue`)**: Hiện chỉ có 2 lượt thoại/bài (tổng 40 lượt thoại cho 20 bài). Quá sơ sài so với yêu cầu một buổi thảo luận hay đàm phán HSK 6.
  - *Yêu cầu*: Mở rộng tối thiểu 5 lượt thoại/bài (tổng >= 100 lượt thoại).
- **Thẻ tình huống (`situation`, `context`, `participants`, `targetGoal`)**: **0/20 bài (0%) có thẻ bối cảnh** -> **MISSING**.
- **Ghi chú ngữ dụng cho người Việt (`usageNotes`)**: **0/20 bài (0%) có ghi chú ngữ dụng** -> **MISSING**.
- **Văn bản âm thanh thực tế (`audioText`)**: Đã có câu văn tiếng Trung thực tế (không dùng fake URL), nhưng nội dung còn ngắn, cần đồng bộ với đối thoại 5 lượt thoại mở rộng.
- **Bài tập nghe hiểu**: Đã có câu hỏi và 4 lựa chọn, nhưng cần nâng cấp câu hỏi suy luận và bổ sung lời giải chi tiết (`explanation`).

### 2.5. Thành ngữ bốn chữ (四字成语) — Trọng tâm Task 22.07
- Hiện tại, các bài học `l-601` đến `l-605` có 20 thành ngữ trong từ vựng, một số bài kinh tế có thêm vài thành ngữ rời rạc.
- Hệ thống **chưa có một cơ sở dữ liệu hoàn chỉnh gồm 50 thành ngữ bốn chữ HSK 6 có giá trị thực tiễn cao** với đầy đủ các trường: `id`, `chengyu`, `pinyin`, `meaning`, `literalMeaning`, `figurativeMeaning`, `usage`, `register`, `example`, `examplePinyin`, `exampleMeaning`, `relatedWords`, `commonMistakes`, `origin`, `originSourceType`.
- Cần xây dựng module dữ liệu riêng `src/data/hsk6IdiomsData.js` và đồng bộ vào kho từ điển, Flashcard, SRS, cũng như tích hợp xuyên suốt vào 20 bài học.

### 2.6. Đàm phán và Báo cáo Kinh tế vĩ mô (Chương 23 & 24)
- Các bài `l-611` đến `l-615` (Đàm phán thương mại) và `l-616` đến `l-620` (Kinh tế, AI, phân tích thị trường) đã có chủ đề tốt, nhưng đối thoại và bài đọc chưa phản ánh văn phong đàm phán song phương thực tế (mặc cả điều khoản thanh toán, thư tín dụng L/C, bất khả kháng, trọng tài kinh tế).
- Cần bổ sung các thuật ngữ chuyên ngành kinh tế và phân định rõ ràng giữa số liệu phân tích minh họa sư phạm và tin tức thực tế.

---

## 3. BẢNG PHÂN LOẠI VÀ ĐÁNH GIÁ 20 BÀI HỌC HSK 6

| Mã bài | Tên bài học | Chương | Step Count | Từ loại (POS) | Step 3 IDS | Step 5 Dialogue | Thành ngữ | Trạng thái |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `l-601` | Thành ngữ về học tập & Kiên trì | ch-21 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 4 | **NEEDS_UPGRADE** |
| `l-602` | Thành ngữ về giao tiếp & Ứng xử | ch-21 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 4 | **NEEDS_UPGRADE** |
| `l-603` | Thành ngữ về thời gian & Cơ hội | ch-21 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 4 | **NEEDS_UPGRADE** |
| `l-604` | Thành ngữ điển cố lịch sử & Triết lý | ch-21 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 4 | **NEEDS_UPGRADE** |
| `l-605` | Nghệ thuật ứng dụng thành ngữ vào văn viết HSK 6 | ch-21 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 4 | **NEEDS_UPGRADE** |
| `l-606` | Phỏng vấn tuyển dụng cao cấp: CV & Giới thiệu bản thân | ch-22 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-607` | Trình bày năng lực lãnh đạo & Quản lý dự án | ch-22 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-608` | Kỹ năng giải quyết khủng hoảng & Đối thoại áp lực cao | ch-22 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 1 | **NEEDS_UPGRADE** |
| `l-609` | Đàm phán đãi ngộ, cổ phần & Điều khoản bảo mật | ch-22 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-610` | Đánh giá năng lực ứng viên & Thư mời nhận việc | ch-22 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 1 | **NEEDS_UPGRADE** |
| `l-611` | Thăm dò nhu cầu & Chào giá thương mại ban đầu | ch-23 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-612` | Thương lượng giá cả, chiết khấu & Khối lượng đơn hàng | ch-23 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-613` | Điều khoản giao hàng quốc tế (Incoterms) & Thanh toán L/C | ch-23 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-614` | Xử lý bất đồng, vi phạm hợp đồng & Trọng tài thương mại | ch-23 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 1 | **NEEDS_UPGRADE** |
| `l-615` | Ký kết hợp đồng song phương & Biên bản ghi nhớ (MOU) | ch-23 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 1 | **NEEDS_UPGRADE** |
| `l-616` | Báo cáo kinh tế vĩ mô: Tăng trưởng GDP, Lạm phát & Lãi suất | ch-24 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-617` | Phân tích xu hướng công nghệ: AI, Dữ liệu lớn & Chuyển đổi số | ch-24 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-618` | Kỹ năng phát hiện lỗi ngữ pháp nâng cao HSK 6 (病句分析) | ch-24 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-619` | Chiến thuật viết tóm tắt văn bản HSK 6 (缩写策略) | ch-24 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 0 | **NEEDS_UPGRADE** |
| `l-620` | Tổng kết toàn khóa HSK 6: Đỉnh cao ngôn ngữ & Văn hóa | ch-24 | 9/9 | Thiếu (0/4) | Thiếu IDS (0/2) | 2 lượt (Sơ sài) | 3 | **NEEDS_UPGRADE** |

---

## 4. KẾ HOẠCH TRIỂN KHAI NÂNG CẤP (ACTION PLAN)

1. **Chuẩn hóa 80 từ vựng HSK 6**:
   - Thêm đầy đủ `pos` (Danh từ, Động từ, Tính từ, Phó từ, Thành ngữ, v.v.).
   - Kiểm tra và chuẩn hóa câu ví dụ, Pinyin dấu thanh và dịch tiếng Việt.
2. **Xây dựng bộ 50 Thành ngữ Bốn chữ HSK 6 (`src/data/hsk6IdiomsData.js`)**:
   - 5 nhóm chủ đề rõ ràng (10 thành ngữ/nhóm).
   - Đầy đủ metadata học thuật: `literalMeaning`, `figurativeMeaning`, `register`, `relatedWords`, `commonMistakes`, `origin`, `originSourceType`.
   - Tích hợp vào từ điển `chineseData.js`, flashcard và bài tập.
3. **Chuẩn hóa 40 chữ Hán Step 3**:
   - Chuẩn hóa thuộc tính `char`, `structure: { code, name, symbol }`, `ids`, `radical: { char, name, strokes }`, `components`, `mnemonic`.
   - Bổ sung 39 chữ Hán còn thiếu vào `HANZI_DECOMPOSITION_DATABASE` trong `src/data/hanziDecomposition.js`.
4. **Nâng cấp đối thoại Step 5 lên 100 lượt thoại (5 lượt/bài)**:
   - Thêm thẻ tình huống `situation`, `context`, `participants`, `targetGoal`.
   - Thêm `usageNotes` chuyên biệt cho người học Việt Nam.
   - Thêm câu hỏi nghe hiểu 4 đáp án và lời giải chi tiết `explanation`.
5. **Nâng cấp Đọc hiểu (Step 8 & Step 1)**:
   - Các bài đọc nghị luận, báo chí kinh tế, phân tích văn hóa và chiến lược viết tóm tắt HSK 6.
6. **Kiểm thử và Hoàn thiện**:
   - Xây dựng `tests/hsk6ContentQualityPhase22.test.js` bao gồm tối thiểu 40 tiêu chí.
   - Chạy toàn bộ test suite (`npm test`) đảm bảo 900+ test đạt 100%.
   - Chạy production build (`npm run build`).
   - Xuất báo cáo nghiệm thu `docs/PHASE_22_TASK_07_HSK6_MASTERY_REPORT.md`.

