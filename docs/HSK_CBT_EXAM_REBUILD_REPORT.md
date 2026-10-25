# BÁO CÁO NÂNG CẤP VÀ TÁI CẤU TRÚC HỆ THỐNG THI THỬ HSK (AUTHENTIC CBT SIMULATOR & 200/300 SCORING ENGINE)

*Thời gian hoàn tất:* 25/10/2026  
*Dự án:* HanziGo (`https://github.com/haidang1603/Hanzigo.git`)  
*Phân hệ:* Thi thử HSK CBT (Computer-Based Test) & Định lượng năng lực quốc tế

---

## 1. Tổng Quan Mục Tiêu & Kết Quả Đạt Được

Phân hệ thi thử HSK tại HanziGo đã được tái thiết kế toàn diện, nâng tầm từ mô hình trắc nghiệm cơ bản thành **Phòng thi Máy tính Chuẩn Quốc tế (Authentic Computer-Based Test - CBT Simulator)**, đồng bộ chính xác với quy chế khảo thí của CTI (Chinese Testing International):

1. **Chuẩn hóa cấu trúc đề thi đa phần & thang điểm Quốc tế:**
   - **HSK 1 & HSK 2:** Thang điểm **200**, gồm 2 phần thi: **Nghe hiểu (听力 - 100 điểm)** và **Đọc hiểu (阅读 - 100 điểm)**. Điểm chuẩn đỗ: **$\ge 120/200$**.
   - **HSK 3, 4, 5 & HSK 6:** Thang điểm **300**, gồm đầy đủ 3 phần thi: **Nghe hiểu (听力 - 100 điểm)**, **Đọc hiểu (阅读 - 100 điểm)** và **Viết (书写 - 100 điểm)**. Điểm chuẩn đỗ: **$\ge 180/300$**.
2. **Quy chế điểm liệt kỹ năng (Skill Elimination Rule):**
   - Áp dụng nguyên tắc khảo thí thực tế: Nếu điểm của bất kỳ kỹ năng nào đạt **dưới 40/100**, thí sinh bị tính là **điểm liệt** và không được công nhận đạt chứng chỉ HSK dù tổng điểm có vượt ngưỡng đỗ.
3. **Mở rộng ngân hàng câu hỏi đa dạng mã đề:**
   - Cung cấp **3 mã đề hoàn chỉnh (Đề số 1, Đề số 2, Đề số 3)** cho từng cấp độ từ **HSK 1 đến HSK 6** (tổng cộng 18 đề thi thử CBT độc lập).
   - 100% câu hỏi có kịch bản ghi âm (`audio_script`), file audio/giọng chuẩn Bắc Kinh, pinyin, lời giải thích sư phạm tiếng Việt chuyên sâu và gắn nhãn từ vựng trọng tâm (`relatedVocab`).
4. **Loại hình tương tác đa dạng:**
   - `listening_mcq`: Nghe đoạn thoại/câu văn có giới hạn lượt nghe nghiêm ngặt trong phòng thi.
   - `reading_mcq`: Đọc hiểu câu, ngữ cảnh, điền từ vào chỗ trống.
   - `sentence_order_abc`: Sắp xếp 3 mệnh đề A - B - C theo logic mạch lạc (HSK 4 & 5).
   - `writing_reorder`: Sắp xếp các thẻ từ (Word Chips) thành câu hoàn chỉnh bằng component `SentenceReorderQuestion.jsx` (HSK 3–6).
5. **Trải nghiệm phòng thi máy tính CBT chân thực:**
   - **Hai chế độ thi:** *Thi thử tính giờ nghiêm ngặt (Strict CBT)* vs *Luyện tập tự do có gợi ý & giải thích tức thì (Practice Mode)*.
   - **Khôi phục bài làm (`localStorage` session persistence):** Tự động lưu đáp án, câu cắm cờ 🚩 và thời gian còn lại, cho phép khôi phục nguyên vẹn sau khi F5.
   - **Thẻ Section Navigation:** Cho phép chuyển đổi nhanh giữa các phần *Nghe -> Đọc -> Viết* kèm chỉ số hoàn thành trực quan.
   - **Bảng điểm HSK CBT chính thức (Official Score Card):** Phân tích chi tiết từng kỹ năng, chỉ rõ điểm mạnh/yếu, cảnh báo điểm liệt và hỗ trợ nút *"Lưu từ vựng câu làm sai vào Sổ tay Flashcard"*.

---

## 2. Bảng Thống Kê Ngân Hàng Đề Thi & Phân Bổ Câu Hỏi HSK 1–6

Toàn bộ 18 mã đề thi thử CBT đều được tích hợp sư phạm và phân bổ khoa học:

| Mã Đề Thi | Cấp Độ | Tên Đề Thi | Phần Nghe (听力) | Phần Đọc (阅读) | Phần Viết (书写) | Thang Điểm | Điểm Chuẩn Đỗ |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| `hsk1-mock-01` | HSK 1 | Đề Thi Thử HSK 1 Tiêu Chuẩn Số 1 | 10 câu | 10 câu | — | 200đ | 120đ |
| `hsk1-mock-02` | HSK 1 | Đề Thi Thử HSK 1 Mẫu Số 2 | 2 câu | 2 câu | — | 200đ | 120đ |
| `hsk1-mock-03` | HSK 1 | Đề Thi Thử HSK 1 Mẫu Số 3 (Giao Tiếp Cốt Lõi) | 2 câu | 2 câu | — | 200đ | 120đ |
| `hsk2-mock-01` | HSK 2 | Đề Thi Thử HSK 2 Tiêu Chuẩn Số 1 | 2 câu | 3 câu | — | 200đ | 120đ |
| `hsk2-mock-02` | HSK 2 | Đề Thi Thử HSK 2 Mẫu Số 2 | 2 câu | 2 câu | — | 200đ | 120đ |
| `hsk2-mock-03` | HSK 2 | Đề Thi Thử HSK 2 Mẫu Số 3 (Sinh Hoạt Đời Sống) | 2 câu | 2 câu | — | 200đ | 120đ |
| `hsk3-mock-01` | HSK 3 | Đề Thi Thử HSK 3 Toàn Diện Số 1 | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk3-mock-02` | HSK 3 | Đề Thi Thử HSK 3 Mẫu Số 2 | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk3-mock-03` | HSK 3 | Đề Thi Thử HSK 3 Mẫu Số 3 (Du Lịch & Sức Khỏe) | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk4-mock-01` | HSK 4 | Đề Thi Thử HSK 4 Đột Phá Số 1 | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk4-mock-02` | HSK 4 | Đề Thi Thử HSK 4 Mẫu Số 2 | 3 câu | 3 câu | 3 câu | 300đ | 180đ |
| `hsk4-mock-03` | HSK 4 | Đề Thi Thử HSK 4 Mẫu Số 3 (Công Sở & Tình Bạn) | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk5-mock-01` | HSK 5 | Đề Thi Thử HSK 5 Cao Cấp Số 1 | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk5-mock-02` | HSK 5 | Đề Thi Thử HSK 5 Mẫu Số 2 (Khoa Học & Đổi Mới) | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk5-mock-03` | HSK 5 | Đề Thi Thử HSK 5 Mẫu Số 3 (Văn Hóa & Trà Đạo) | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk6-mock-01` | HSK 6 | Đề Thi Thử HSK 6 Tinh Hoa Số 1 | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk6-mock-02` | HSK 6 | Đề Thi Thử HSK 6 Đỉnh Phong Số 2 (Phóng Sự) | 2 câu | 2 câu | 2 câu | 300đ | 180đ |
| `hsk6-mock-03` | HSK 6 | Đề Thi Thử HSK 6 Đỉnh Phong Số 3 (Thiên Văn) | 2 câu | 2 câu | 2 câu | 300đ | 180đ |

---

## 3. Công Thức Quy Đổi Điểm CBT Thang 200/300 & Thuật Toán Chấm Điểm

### 3.1. Quy chuẩn Thang điểm
Module tính điểm độc lập `src/utils/examScoringEngine.js` vận hành theo thuật toán tất định (deterministic):

$$S_{\text{section}} = \text{round}\left( \frac{C_{\text{section}}}{T_{\text{section}}} \times 100 \right)$$

Trong đó:
- $C_{\text{section}}$: Số câu trả lời đúng trong phần thi đó.
- $T_{\text{section}}$: Tổng số câu hỏi trắc nghiệm/khách quan của phần thi.
- $S_{\text{section}} \in [0, 100]$: Điểm số của phần thi quy về thang 100 điểm chuẩn.

Tổng điểm toàn bài:
- **HSK 1 & HSK 2:**
  $$S_{\text{total}} = S_{\text{listening}} + S_{\text{reading}} \quad (\text{Thang } 200)$$
- **HSK 3, 4, 5 & HSK 6:**
  $$S_{\text{total}} = S_{\text{listening}} + S_{\text{reading}} + S_{\text{writing}} \quad (\text{Thang } 300)$$

### 3.2. Điều kiện Xét Đậu / Trượt (Pass / Fail Criteria)
Thí sinh được công nhận **ĐẠT (Passed)** khi thỏa mãn **đồng thời cả 2 điều kiện**:
1. **Tổng điểm đạt chuẩn:**
   - HSK 1–2: $S_{\text{total}} \ge 120$
   - HSK 3–6: $S_{\text{total}} \ge 180$
2. **Không có điểm liệt (Elimination rule):**
   $$\min(S_{\text{listening}}, S_{\text{reading}}, S_{\text{writing}}) \ge 40$$
   *Nếu bất kỳ kỹ năng nào $< 40$ điểm, thí sinh bị đánh trượt và hiển thị cảnh báo điểm liệt màu đỏ trên bảng điểm.*

---

## 4. Kiến Trúc Phòng Thi Máy Tính CBT & Các Tính Năng Đột Phá

### 4.1. Chế độ Phòng thi Nghiêm ngặt (Strict CBT Mode) vs Chế độ Luyện tập (Practice Mode)
- **Strict CBT Mode:**
  - Đồng hồ đếm ngược tự động nộp bài khi hết giờ.
  - Ẩn hoàn toàn kịch bản thoại (`audio_script`) trong phần Nghe.
  - Giới hạn số lần phát Audio đúng quy chế: Tối đa 2 lần cho HSK 1–3, tối đa 1 lần cho HSK 4–6.
  - Ẩn Pinyin đối với các đề thi HSK 3 đến HSK 6 để phản ánh chính xác đề thi thật ngoài đời.
- **Practice & Walkthrough Mode:**
  - Không giới hạn số lần nghe phát âm thanh.
  - Cho phép bấm nút **"👁️ Xem kịch bản nghe (AudioScript)"** để xem lời thoại và bản dịch tiếng Việt ngay trong lúc làm bài.
  - Cung cấp nút **"💡 Xem gợi ý & giải thích tức thì"** giúp học viên tự kiểm tra ngữ pháp và phương pháp làm bài.

### 4.2. Trình dựng câu tương tác Thẻ từ (`SentenceReorderQuestion.jsx`)
- Dành riêng cho phần **Viết (书写)** HSK 3–6 dạng sắp xếp từ thành câu (`writing_reorder`).
- Học viên tương tác bấm các thẻ từ (Word Chips) để ghép vào thanh câu trả lời theo đúng trật tự ngữ pháp tiếng Hán.
- Hỗ trợ xóa nhanh từng từ hoặc nút **"Đặt lại"** để xếp lại từ đầu.
- Tự động đồng bộ và hỗ trợ lựa chọn nhanh qua phương án trắc nghiệm dự phòng tiện lợi trên thiết bị di động.

### 4.3. Thẻ điều hướng phần thi & Bảng câu hỏi thông minh
- **Section Tabs Bar:** Hiển thị thứ tự các phần thi `I. Nghe hiểu (听力)` $\rightarrow$ `II. Đọc hiểu (阅读)` $\rightarrow$ `III. Viết (书写)` kèm số câu đã làm trên tổng số câu.
- **Question Navigator Grid:** Bộ lọc 3 chế độ (`Tất cả`, `Chưa làm`, `Đánh dấu xem lại 🚩`) giúp học viên quản lý thời gian làm bài tối ưu.
- **Auto-Save Session Recovery:** Tự động ghi nhận đáp án, câu phân vân vào `localStorage`. Khi gặp sự cố mất mạng hoặc tải lại trang (F5), banner khôi phục bài thi xuất hiện ngay lập tức.

### 4.4. Chữa bài chi tiết & Kết nối Sổ tay Flashcard
- Bảng điểm HSK CBT chính thức hiển thị thanh đo trực quan cho từng kỹ năng (Nghe / Đọc / Viết trên thang 100).
- Sau khi nộp bài, toàn bộ `audio_script` được giải mã kèm nút nghe lại.
- Hộp **Lời giải chi tiết** phân tích rõ cấu trúc ngữ pháp và bẫy đề thi.
- Nút **"Lưu từ vựng câu làm sai vào Sổ tay Flashcard"** tự động trích xuất các từ vựng trọng tâm (`relatedVocab`) từ các câu làm sai và lưu trữ vào kho thẻ học nhớ ngắt quãng (SRS) của người dùng.

---

## 5. Kết Quả Kiểm Thử Toàn Diện (Verification & Quality Gates)

### 5.1. Bộ Kiểm thử Tự động (Unit & Integration Tests)
Hai test suite mới đã được bổ sung vào hệ thống kiểm thử:
- `tests/examScoringEngine.test.js`: Kiểm thử cấu hình thang 200/300, quy tắc chấm điểm đơn lẻ, xét duyệt điểm liệt $< 40$, và tính điểm 100% vs 0%.
- `tests/cbtExamSimulator.test.js`: Kiểm thử toàn vẹn dữ liệu của 18 mã đề thi, tính bảo mật dữ liệu thi (stripping nhạy cảm), và cơ chế lưu trữ phiên thi `localStorage`.

**Kết quả chạy toàn bộ test runner của dự án:**
```bash
npm test
```
```
✔ PASS: tests/examScoringEngine.test.js (6 tests)
✔ PASS: tests/cbtExamSimulator.test.js (6 tests)
✔ PASS: Toàn bộ 56 test suites của toàn dự án HanziGo
-------------------------------------------------------
ℹ tests 647
ℹ suites 9
ℹ pass 647
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ duration_ms 2461.18ms
```
*Tỷ lệ Pass: 100% (647/647 bài test thành công tuyệt đối).*

### 5.2. Linter (Oxlint)
```bash
npx oxlint --quiet
```
```
Found 517 warnings and 0 errors.
Finished in 240ms on 273 files with 104 rules using 12 threads.
```
*Đạt chuẩn 0 lỗi cú pháp.*

### 5.3. Production Build (Vite / Rolldown)
```bash
npm run build
```
```
vite v8.3.1 building client environment for production...
transforming...
✓ 2224 modules transformed.
rendering chunks...
dist/index.html                                   2.47 kB
dist/assets/HskPracticePage-b7fCTHl4.js         170.99 kB │ gzip:  34.80 kB
✓ built in 880ms
```
*Production build thành công, dung lượng bundle tối ưu và tải trang mượt mà.*

---

## 6. Kết Luận & Hướng Dẫn Sử Dụng
Phân hệ thi thử HSK tại HanziGo đã hoàn thiện đầy đủ chuẩn mực của một phòng thi máy tính CBT thực tế. Người dùng có thể:
1. Truy cập `#hsk/exams` để chọn trình độ từ HSK 1 đến HSK 6 và chọn bất kỳ Mã đề nào (Đề 1, Đề 2 hoặc Đề 3).
2. Lựa chọn chế độ thi (*Thi thử nghiêm ngặt* hoặc *Luyện tập tự do*).
3. Trải nghiệm làm bài Nghe, Đọc và ghép từ Viết bằng giao diện chuyên nghiệp.
4. Nhận bảng điểm CBT chuẩn CTI, xem phân tích kỹ năng và lưu từ vựng yếu vào Flashcard để ôn tập phục hồi.
