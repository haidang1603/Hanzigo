# BÁO CÁO AUDIT ĐỘC LẬP PHASE 13: CÔNG THỨC NĂNG LỰC 4 KỸ NĂNG (COMPETENCY ANALYTICS)

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến  
**Giai đoạn:** Phase 13 — Independent Audit & Verification of Phase 12  
**Đối tượng kiểm tra:** `src/utils/competencyAnalytics.js`, `src/pages/ProfilePage.jsx`, `src/components/analytics/CompetencyAnalyticsPanel.jsx`.  
**Ngày thực hiện:** 25/10/2026  
**Trạng thái kiểm tra:** Hoàn tất & Đã khắc phục triệt để.

---

## 1. Phương pháp & Phạm vi kiểm tra trực tiếp

Chúng tôi đã tiến hành phân tích chi tiết mã nguồn thuật toán trong `src/utils/competencyAnalytics.js`, đồng thời truy vết luồng cấp dữ liệu đầu vào thực tế từ `ProfilePage.jsx`:

1. **Kiểm tra tính chân thực của dữ liệu đầu vào:**
   - Xác minh các tham số truyền vào hàm `calculate4SkillCompetency` lấy từ đâu (LocalStorage, Supabase hay hằng số giả lập).
2. **Kiểm tra công thức từng kỹ năng:**
   - **Listening:** `audioCompletionRatio`, `examListeningScores`, `blindListeningFrequency`.
   - **Speaking:** `pronunciationScores`, `roleplayCompletedMissions`.
   - **Reading:** `matureSrsCardsCount`, `examReadingScores`, `smartReaderCompletedArticles`.
   - **Writing:** `writingStrokeScores`, `uniqueCharsPracticedCount`.
3. **Kiểm tra tính an toàn toán học:**
   - Xử lý chia cho 0 khi mẫu số bằng 0.
   - Thử nghiệm với các giá trị biên: mảng rỗng, `null`, `undefined`, số âm, `NaN`, `Infinity`, số cực lớn (overflow).
4. **Kiểm tra phân tầng dữ liệu (Data Readiness Stages):**
   - Phân biệt giữa người học chưa từng làm bài (`no_data`), có dữ liệu nhưng rất ít (`insufficient_sample`), và đủ mẫu (`reliable`).

---

## 2. Các phát hiện có thể tái hiện (Bugs & Findings)

### Phát hiện P1-01: Dữ liệu giả lập (hardcoded) trong ProfilePage.jsx
- **Mã lỗi:** `BUG-PH13-COMP-01` (Severity: High)
- **Hiện trạng ban đầu:**
  Trong `src/pages/ProfilePage.jsx`, dữ liệu đưa vào radar chart không phản ánh hoàn toàn lịch sử học tập thực tế mà chèn các số liệu hardcode:
  ```javascript
  // Đoạn code cũ trong ProfilePage.jsx:
  const competencyData = useMemo(() => {
    return calculate4SkillCompetency({
      targetLevel: currentHskLevel,
      // ...
      roleplayCompletedMissions: 5,         // HARDCODED giả lập!
      smartReaderCompletedArticles: 3,      // HARDCODED giả lập!
      pronunciationScores: [85, 88],        // HARDCODED fallback nếu chưa nói!
    });
  }, [...]);
  ```
- **Hậu quả:** Ngay cả khi một học viên mới tạo tài khoản, chưa từng mở bài báo hay chưa từng vào AI Roleplay Studio, hệ thống vẫn tự động cấp 5 nhiệm vụ đối thoại và 3 bài đọc, khiến điểm Speaking và Reading bị đội lên một cách giả tạo.
- **Biện pháp đã sửa:**
  - Loại bỏ hoàn toàn các hằng số giả lập trong [src/pages/ProfilePage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/ProfilePage.jsx).
  - Tích hợp đọc trực tiếp từ LocalStorage và lịch sử thực:
    * `hanzigo_roleplay_history` -> tính số nhiệm vụ nhập vai thực tế đã hoàn thành.
    * `hanzigo_reader_completed` -> tính số bài báo Smart Reader đã đọc xong.
    * Không dùng fallback điểm phát âm `[85, 88]`. Nếu học viên chưa từng thu âm bài nào, mảng điểm phát âm để rỗng `[]`.

### Phát hiện P1-02: Nguy cơ tràn số (Overflow) khi số thẻ SRS Mature vượt Benchmark
- **Mã lỗi:** `BUG-PH13-COMP-02` (Severity: Medium)
- **Hiện trạng ban đầu:**
  ```javascript
  const vocabCoverageRatio = matureSrsCardsCount / targetVocab;
  const vocabScore = vocabCoverageRatio * 100;
  ```
  Nếu học viên học HSK 1 (benchmark = 150 từ), nhưng đã học 600 từ, thì `vocabCoverageRatio = 4.0`, dẫn đến `vocabScore = 400`. Khi nhân trọng số 40% (0.4 * 400 = 160), điểm Reading có thể vượt 100 hoặc làm lệch toàn bộ trọng số của các thành phần khác.
- **Biện pháp đã sửa:**
  - Giới hạn tỷ lệ trong đoạn `[0, 1]` trước khi nhân 100:
    ```javascript
    const vocabCoverageRatio = Math.min(1, Math.max(0, safeSrsCount / targetVocab));
    ```
  - Tương tự với số bài đọc Smart Reader, số chữ Hán viết độc bản (`charVolumeRatio`), và số nhiệm vụ Roleplay (`roleplayRatio`).

### Phát hiện P1-03: Đánh đồng "Chưa có dữ liệu" với "Năng lực = 0"
- **Mã lỗi:** `DEFECT-PH13-COMP-03` (Severity: Medium)
- **Hiện trạng ban đầu:** Khi học viên mới bắt đầu, tất cả kỹ năng trả về điểm 0 mà không có bất kỳ trạng thái nào giải thích rằng học viên "chưa thực hiện bài tập nào". Điều này gây hoang mang và hiểu sai rằng người học yếu kém toàn diện.
- **Biện pháp đã sửa:**
  - Bổ sung cơ chế phân loại trạng thái dữ liệu `skillStatuses` cho từng kỹ năng:
    * `'no_data'`: Chưa có dữ liệu thực nghiệm (chưa làm bài tập nào).
    * `'insufficient_sample'`: Đã có dữ liệu nhưng số lượng mẫu còn ít (`< 3`), điểm số chỉ mang tính chất tham khảo tạm thời.
    * `'reliable'`: Dữ liệu có độ tin cậy tốt (`>= 3` mẫu quan sát).
  - Cập nhật giao diện [src/components/analytics/CompetencyAnalyticsPanel.jsx](file:///d:/DELL/Dowloads/HanziGo/src/components/analytics/CompetencyAnalyticsPanel.jsx) hiển thị nhãn trạng thái trực quan: `Chưa học`, `Tạm thời`, `Ổn định`.

### Phát hiện P1-04: Thiếu Tuyên bố Khoa học và Miễn trừ Trách nhiệm
- **Mã lỗi:** `FINDING-PH13-COMP-04` (Severity: Low)
- **Hiện trạng ban đầu:** Bản hiển thị radar chart và điểm tổng hợp không có chú thích rõ ràng về bản chất thuật toán, dễ khiến người học lầm tưởng đây là điểm thi chuẩn hóa psychometric hoặc trắc nghiệm tâm lý học đã được thẩm định quốc tế.
- **Biện pháp đã sửa:**
  - Bổ sung hằng số `COMPETENCY_ANALYTICS_DISCLAIMER` trong `src/utils/competencyAnalytics.js`:
    > *"Chỉ số năng lực học tập nội bộ HanziGo dựa trên tiến độ và bài tập thực tế. Không phải kết quả trắc nghiệm tâm lý học hoặc bài thi khảo thí chuẩn hóa quốc tế."*
  - Hiển thị disclaimer này ở phần chân của `CompetencyAnalyticsPanel`.

---

## 3. Bảng chuẩn hóa Trọng số và Tiêu chí 4 Kỹ năng sau Audit

| Kỹ năng | Nguồn dữ liệu thực tế | Trọng số | Xử lý mẫu nhỏ |
| :--- | :--- | :---: | :--- |
| **Listening** | 1. Tỷ lệ hoàn thành Audio Step 5<br>2. Điểm thi thử phần Nghe (ExamListeningAvg)<br>3. Tần suất luyện phản xạ không xem sub | 40%<br>40%<br>20% | Nếu chưa thi thử HSK, trọng số dồn vào bài tập hoàn thành (70%) và phản xạ (30%). |
| **Speaking** | 1. Điểm phát âm thực tế từ `pronunciationEvaluator`<br>2. Tỷ lệ hoàn thành nhiệm vụ AI Roleplay Studio | 50%<br>50% | Chỉ tính điểm phát âm khi có bản ghi âm thực tế; không dùng fallback mặc định 85-88. |
| **Reading** | 1. Số thẻ SRS Mature so với Benchmark cấp độ<br>2. Điểm thi thử phần Đọc (ExamReadingAvg)<br>3. Tỷ lệ hoàn thành bài đọc Smart Reader | 40%<br>40%<br>20% | Giới hạn `vocabCoverageRatio <= 1.0` chống tràn số; chỉ tính số bài đọc thực sự đã hoàn thành. |
| **Writing** | 1. Điểm chính xác nét bút từ HanziWriter Pad<br>2. Số chữ Hán độc bản đã viết so với Benchmark | 60%<br>40% | Lọc mảng điểm hợp lệ `[0, 100]`, loại bỏ `NaN`, chống chia cho 0. |

---

## 4. Kết quả Kiểm thử Toán học (Pure Mathematical Test Results)

Đã chạy kiểm thử với `node --test tests/phase13AdversarialSecurity.test.js`:

```text
✔ PHASE 13 COMP-01: Empty learner profile distinguishes "no_data" from 0-competency without crashing or NaN (0.37ms)
✔ PHASE 13 COMP-02: Overflow inputs (99999 SRS cards, out of bounds scores) are clamped strictly to <= 100 (0.20ms)
✔ PHASE 13 COMP-03: Zero-division and malformed inputs (NaN, Infinity, negative) are sanitized safely (0.10ms)
```

**Tất cả các kiểm thử toán học và xử lý ngoại lệ đều đạt (PASS) 100%.**
