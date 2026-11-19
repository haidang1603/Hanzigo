# PHASE 38 — TASK 38.02: CURRICULUM QUALITY ASSURANCE REPORT

- **Giai đoạn:** Phase 38 — Platform Quality & Data Intelligence
- **Task:** Task 38.02 — Curriculum Quality Assurance *(Audit-First -> Fix đúng phạm vi -> Test -> Verify)*
- **Repository:** `https://github.com/haidang1603/Hanzigo.git`
- **Production Website:** `https://hanzigo-xi.vercel.app`
- **Ngày thực hiện:** 2026-11-19

---

## 1. Executive Summary

Task 38.02 thực hiện kiểm định chất lượng học thuật trên toàn bộ giáo trình HSK 1–9 (`VOCABULARY_LIST`, `LEARNING_LEVELS`, `HSK_120_LESSONS`, `CURRICULUM_ALL_LESSONS`, `HSK_79_60_LESSONS`, `GRAMMAR_DRILLS_BY_LEVEL`, `LISTENING_DRILLS_BY_LEVEL`, `GRADED_READERS_DATA`, `HSK_EXAMS`/`HSK_QUESTIONS`, `HSK_7_TO_9_PAPER_CATALOG`), xử lý dứt điểm các lỗi học liệu đã có bằng chứng từ Task 38.01 (`DQ-HIGH-02`, `DQ-HIGH-06`, `DQ-MED-03`) và bổ sung bộ test hồi quy khóa chất lượng tại `tests/curriculumQualityPhase38.test.js`.

- **Không** đụng chạm tới `progressService.js`, `AuthContext.jsx`, đồng bộ `localStorage` hay Supabase RLS (giữ nguyên cho Task 38.03–38.06).
- **Không** tự tạo thêm bài học để làm đẹp số liệu và **không** thay đổi công thức chấm điểm CBT.
- **Kết quả kiểm chứng sau sửa:** `npm run lint` (`0` errors), `npm test` (`1144/1144` pass), `npm run build` (`2251` modules, `1.18s`), `npm run audit:curriculum` (`100/100`).

---

## 2. Audit Findings

### Kết quả rà soát học thuật HSK 1–9 (Audit-First)
| Phân hệ | Quy mô rà soát | Phát hiện lỗi | Trạng thái |
|---|---|---|---|
| `VOCABULARY_LIST` (`src/data/chineseData.js`) | `830` -> `812` mục sau khử trùng | 18 cặp trùng `hanzi`; 17 mục (`id: 715..731`) lỗi `pinyin` + thiếu `hanviet` + `meaning` cắt từ ví dụ; 2 chuỗi `topic` bị cắt cụt; 42 mục nhãn gộp `'HSK 5-6'` | **Đã sửa triệt để** |
| Bộ thẻ HSK 7–9 (`hsk30FlashcardDeckService.js`) | `484` thẻ `getLocalHsk79Flashcards()` | 45 `hanzi` chồng chéo với `VOCABULARY_LIST` làm ghi đè cấp độ HSK 3–6 sang HSK 7–9 | **Đã sửa** |
| Bài học HSK 1–6 (`HSK_120_LESSONS` / `CURRICULUM_ALL_LESSONS`) | `120` bài (`l-101`..`l-620`) | `0` lỗi Pinyin thanh điệu số, `0` lỗi thiếu từ vựng/bài tập, `0` lệch tiêu đề giữa 2 nguồn | **Đạt chuẩn** |
| Bài học HSK 7–9 (`HSK_79_60_LESSONS` + `synthesizeHsk79Lesson`) | `60` bài (`121`..`180`, 20 bài/cấp 7–9) | `0` lỗi Pinyin/ký tự lỗi; `LEARNING_LEVELS` `lvl-7` dùng chung container 20/60 bài tách sang `HSK_79_60_LESSONS` | **Đã ghi nhận & đối soát** |
| Grammar Drills & Listening Drills (`practiceLevelData.js`) | `90` Grammar + `90` Listening | `0` trùng ID, `0` thiếu trường, `0` đáp án sai phạm vi | **Đạt chuẩn** |
| Graded Readers (`gradedReadersData.js`) | `24` bài đọc | `0` trùng ID/tiêu đề, `0` câu hỏi lỗi | **Đạt chuẩn** |
| Ngân hàng đề CBT (`hskExamsData.js`) | `30` đề / `530` câu hỏi | Đề `hsk1-official-ref-01` (`is_published: true`) có **0** câu hỏi (trùng mã `H10901` với `hsk1-official-sample-01`); 18 đề lệch `sum(points)` vs `max_score` (đã có chuẩn hóa tỷ lệ trong `submit.js`) | **Đã unpublish `hsk1-official-ref-01`** |
| Đề tích hợp HSK 7–9 (`hsk7to9SampleExamPaper.js`) | `3` mã đề (`H79001`–`H79003`) | Section 4 (Viết) & Section 5 (Nói) không nằm trong `questions`/`tasks`, khiến tổng đếm thô chỉ ra 8 mục / 120 điểm | **Đã bổ sung adapter chuẩn hóa 300đ** |

---

## 3. Root Cause

1. **Lỗi import dữ liệu trước đây trên `id: 715..731` (`src/data/chineseData.js`):** Script sinh dữ liệu đã cắt token đầu tiên của `example.pinyin` gán vào `pinyin` (`"Zài"`, `"Xiǎng"`, `"Shàng"`, ...), bỏ trống `hanviet: ""`, và cắt 50 ký tự đầu của `example.meaning` gán vào `meaning`.
2. **Nạp nhiều đợt vào `VOCABULARY_LIST` không khử trùng theo `hanzi`:** Sinh ra 18 cặp `hanzi` trùng ID (`435/755`, `448/762`, `451/757`, `452/767`, `453/764`, `457/766`, `465/758`, `474/763`, `476/777`, `478/775`, `479/771`, `480/781`, `482/772`, `483/773`, `510/760`, `512/769`, `638/788`, `653/793`) và 45 từ chồng chéo với `HSK79_VOCAB_GLOSSARY`.
3. **Thiếu cổng kiểm định `is_published` với đề tham chiếu 0 câu:** `hsk1-official-ref-01` được giữ `is_published: true` dù `hsk1-official-sample-01` đã số hóa đủ 20 câu cho cùng mã đề `H10901`.
4. **Cấu trúc bất đối xứng ở Phần 4–5 của đề HSK 7–9:** Thiếu hàm adapter tổng hợp cả 5 kỹ năng về chuẩn `300` điểm.

---

## 4. Implementation Details

1. **Sửa toàn diện `src/data/chineseData.js` (`DQ-HIGH-06`):**
   - Khôi phục chính xác `pinyin` có dấu thanh, âm `hanviet`, `meaning` tiếng Việt, `traditional` và `topic` chuẩn cho toàn bộ **17 mục `id: 715..731`** (`结识` .. `革新`, đồng thời chuẩn hóa `id: 731` sang `HSK 5`).
   - Khử trùng toàn bộ **18 cặp `hanzi` trùng lặp** (giữ lại bản ghi chuẩn/giàu ngữ cảnh nhất và chuẩn hóa 7 mục `HSK 5-6` trùng sang `HSK 4`/`HSK 5`; chỉnh `hanviet` chuẩn cho `763` `Thâm khắc`, `773` `Khải phát`, `775` `La tập`), đưa `VOCABULARY_LIST` từ `830` xuống **`812` mục duy nhất 100%**.
   - Hoàn chỉnh 2 chuỗi `topic` bị cắt cụt: `"So sánh mức độ nâng cao với 更, 最 (Càng & Nhất)"` và `"Boss Challenge HSK 3 (Đề thi thử 80 câu CTI & Thi nói HSKK)"`.
   - Bổ sung helper `normalizeVocabHskLevel(level)` ánh xạ `'HSK 5-6'` -> `'HSK 5'` khi cần cấp độ đơn chuẩn, đồng thời bảo toàn các mục `'HSK 5-6'` còn lại để tương thích ngược với `tests/practiceLevels.test.js`.
2. **Loại bỏ chồng chéo 45 từ giữa HSK 1–6 và HSK 7–9 (`src/services/hsk30FlashcardDeckService.js`):**
   - Trong `getCuratedVietnamesePool(bandId)`, lọc `getLocalHsk79Flashcards()` loại bỏ các `hanzi` đã có trong `VOCABULARY_LIST` (`!baseHanziSet.has(item.hanzi)`), ngăn việc thẻ HSK 3–6 bị ghi đè thành HSK 7–9 trong bộ Flashcards.
3. **Xử lý đề published rỗng `hsk1-official-ref-01` (`src/data/hskExamsData.js`, `src/services/hskService.js` — `DQ-HIGH-02`):**
   - Đặt `is_published: false` cho `hsk1-official-ref-01` để `getHskExams()` không hiển thị đề 0 câu hỏi cho học viên (vẫn giữ `hsk1-official-sample-01` đủ 20 câu cho mã `H10901`).
   - Trong `getExamForTaking`, kiểm tra `!sanitized.questions || sanitized.questions.length === 0` trước nhánh `is_published`, bảo toàn thông báo lỗi đặc thù cho bài test hồi quy Phase 3 (`tests/hskExamCenterPhase3.test.js:544`).
4. **Chuẩn hóa adapter đề HSK 7–9 (`src/features/hsk-exam/data/hsk7to9SampleExamPaper.js` — `DQ-MED-03`):**
   - Thêm hàm `getHsk7to9PaperNormalizedSummary(paperOrCode)` đếm đầy đủ cả 5 phần thi (`11` nhiệm vụ, `totalMaxScore === 300`) cho `H79001`, `H79002`, `H79003`.
5. **Bổ sung bộ test hồi quy Task 38.02 (`tests/curriculumQualityPhase38.test.js`, `package.json`):**
   - Khóa cứng 3 bộ kiểm định tự động: (1) `VOCABULARY_LIST` không trùng `hanzi`/`id`, không thiếu `hanviet`/`pinyin`/`meaning`, không topic mất dấu ngoặc; (2) mọi đề `is_published: true` phải có `> 0` câu hỏi và `hsk1-official-ref-01` bị ẩn khỏi `getHskExams()`; (3) pool HSK 7–9 không chồng lấn `VOCABULARY_LIST` và 3 đề HSK 7–9 chuẩn hóa đủ `5` phần / `11` nhiệm vụ / `300` điểm.

---

## 5. Files Created

- `tests/curriculumQualityPhase38.test.js` — Bộ test hồi quy chất lượng học liệu Phase 38 Task 38.02.
- `docs/PHASE_38_TASK_38_02_CURRICULUM_QUALITY_ASSURANCE_REPORT.md` — Báo cáo nghiệm thu Task 38.02.

---

## 6. Files Modified

- `src/data/chineseData.js` — Sửa 17 mục lỗi `715..731`, khử 18 cặp trùng `hanzi`, sửa 2 `topic` cắt cụt, thêm `normalizeVocabHskLevel`.
- `src/services/hsk30FlashcardDeckService.js` — Loại bỏ 45 `hanzi` chồng chéo khi gộp pool Flashcards HSK 7–9.
- `src/data/hskExamsData.js` — Đặt `is_published: false` cho `hsk1-official-ref-01`.
- `src/services/hskService.js` — Kiểm tra đề 0 câu trước `is_published` trong `getExamForTaking`.
- `src/features/hsk-exam/data/hsk7to9SampleExamPaper.js` — Thêm `getHsk7to9PaperNormalizedSummary`.
- `package.json` — Đăng ký `tests/curriculumQualityPhase38.test.js` vào script `npm test`.

---

## 7. Database Changes

- **Không có.** Không tạo hoặc chạy bất kỳ migration nào lên Supabase.

---

## 8. Security Impact

- Việc đặt `is_published: false` cho `hsk1-official-ref-01` và giữ nguyên kiểm soát `getSanitizedExamForTaking` đảm bảo không lộ đáp án và không phát hành đề rỗng ra danh sách thi công khai.
- Không đọc/ghi hay thay đổi bất kỳ chính sách RLS, auth token hoặc bí mật `.env` nào.

---

## 9. Test Results

| Kiểm tra | Trước Task 38.02 | Sau Task 38.02 | Kết quả |
|---|---:|---:|---|
| `node --env-file=.env --test tests/curriculumQualityPhase38.test.js` | N/A | `3/3` pass | **PASS** |
| `npm test` (toàn bộ `97` file test trong `package.json`) | `1141/1141` (31 suites) | **`1144/1144`** (31 suites, `0` fail, `0` skipped, `24.26s`) | **PASS** |
| `npm run audit:curriculum` | `100 / 100` (830 từ) | **`100 / 100`** (812 từ duy nhất, 0 thiếu) | **PASS** |
| `npm run lint` (`oxlint`) | `0` errors (`731` warnings, 598 files) | **`0` errors** (`731` warnings, 599 files, `484ms`) | **PASS** |

---

## 10. Build Results

| Chỉ số | Trước Task 38.02 | Sau Task 38.02 |
|---|---|---|
| `npm run build` (`vite build`) | Thành công (`2251` modules, `1.23s`) | **Thành công (`2251` modules, `1.18s`)** |
| Chunk `data-chinese` | `517.92 kB` (gzip `153.97 kB`) | **`506.18 kB` (gzip `151.16 kB`)** (-11.74 kB nhờ khử trùng) |

---

## 11. Runtime Verification

- Đã xác minh trực tiếp qua Node.js test runner các luồng `getHskExams()`, `getExamForTaking('hsk1-official-ref-01')`, `fetchHsk30FlashcardBatch({ hskBand: 'HSK 7-9' })`, `getHsk7to9PaperNormalizedSummary('H79001'..'H79003')`, và quét toàn bộ 812 mục `VOCABULARY_LIST`.
- Trình duyệt live Production (`https://hanzigo-xi.vercel.app`) và dữ liệu bảng `public.vocabulary`/`public.hsk_exams` trên Supabase Production: **`[NOT VERIFIED — NO LIVE ACCESS]`**.

---

## 12. Known Issues

- Một số điểm thuộc phạm vi các Task sau (chưa sửa theo đúng ranh giới Task 38.02):
  - `18` đề CBT trong `hskExamsData.js` vẫn giữ tổng điểm thô `sum(points)` khác `max_score` (đã có quy đổi tỷ lệ trong `api/_handlers/hsk/submit.js`, sẽ tiếp tục kiểm tra trong Task 38.04).
  - `LEARNING_LEVELS` `lvl-7` trong `src/data/learningPathData.js` giữ cấu hình `totalChapters: 4, totalLessons: 20` để tương thích test cũ, trong khi 60 bài HSK 7–9 thực tế nằm ở `HSK_79_60_LESSONS` (`121..180`).
  - Lệch múi giờ, `localStorage` không phân vùng, và các query Supabase sai cột sẽ được xử lý ở Task 38.03–38.04.

---

## 13. Remaining Risks

- Nếu Supabase bảng `public.vocabulary` hoặc `public.hsk_exams` trên môi trường Production từng được seed trước đây bằng dữ liệu cũ (chưa chạy lại `npm run db:seed`), DB live vẫn có thể còn `18` bản ghi trùng hoặc `hsk1-official-ref-01` ở trạng thái `is_published = true` cho đến khi người vận hành đồng bộ lại seed.

---

## 14. Acceptance Criteria

| Tiêu chí Task 38.02 | Trạng thái | Bằng chứng |
|---|---|---|
| Sửa dứt điểm 17 mục lỗi `pinyin`/`hanviet`/`meaning` (`715..731`) & 2 `topic` cắt cụt | Đạt | `src/data/chineseData.js` + `tests/curriculumQualityPhase38.test.js` |
| Khử trùng 18 cặp `hanzi` trong `VOCABULARY_LIST` & xử lý chồng chéo 45 từ với HSK 7–9 | Đạt | `812` mục duy nhất; `0` overlap trong `fetchHsk30FlashcardBatch` |
| Xử lý đề published rỗng `hsk1-official-ref-01` & adapter chuẩn hóa 300đ cho HSK 7–9 | Đạt | `is_published: false`, `getHsk7to9PaperNormalizedSummary` trả `5` phần / `11` tasks / `300đ` |
| Không chạm `progressService.js`, `AuthContext.jsx`, `localStorage` sync hay Supabase RLS | Đạt | `git status` chỉ gồm 6 file học liệu/test + báo cáo |
| `npm run lint`, `npm test`, `npm run build` xanh toàn bộ & dừng tại Hard Stop Gate | Đạt | `0` lint errors, `1144/1144` tests pass, build `1.18s` |

---

## 15. Final Status

- **`IMPLEMENTATION COMPLETE`** — Đã hoàn tất sửa lỗi học liệu `DQ-HIGH-02`, `DQ-HIGH-06`, `DQ-MED-03` và bổ sung test khóa hồi quy trong phạm vi Task 38.02.
- **`TESTS PASSED`** — `npm test`: `1144/1144` pass (`0` fail, `0` skipped trên `31` suites); `npm run audit:curriculum`: `100/100`; `npm run lint`: `0` errors (`731` warnings).
- **`BUILD VERIFIED`** — `npm run build` thành công (`2251` modules, `1.18s`).
- **`PRODUCTION VERIFICATION PARTIAL`** — Chưa truy cập trực tiếp Supabase Production để đối chiếu/seed lại bảng `vocabulary` và `hsk_exams` live (`[NOT VERIFIED — NO LIVE ACCESS]`).
- **HARD STOP GATE:** Dừng lại tại đây, chờ bạn đánh giá và phê duyệt báo cáo Task 38.02 trước khi chuyển sang **`TASK 38.03 — ACCOUNT DATA SYNCHRONIZATION`**.
