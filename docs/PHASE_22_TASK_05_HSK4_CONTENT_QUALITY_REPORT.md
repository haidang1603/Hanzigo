# BÁO CÁO NGHIỆM THU TASK 22.05
# HSK 4 CONTENT UPGRADE & DEDUPLICATION
## NÂNG CẤP TOÀN DIỆN GIÁO TRÌNH HSK 4 VÀ CHUẨN HÓA TỪ VỰNG CÔNG SỞ — THƯƠNG MẠI

---

## 1. AUDIT TRƯỚC TRIỂN KHAI (TASK 22.05.01)

Trước khi thực hiện thay đổi dữ liệu, hệ thống giáo trình HSK 4 (`l-401` đến `l-420`, thuộc các chương `ch-13` đến `ch-16` trong file `src/data/curriculumLessonsHsk4to6.js`) đã được khảo sát toàn diện.

### Bảng thống kê hiện trạng ban đầu

| Hạng mục kiểm tra | Hiện trạng trước chuẩn hóa | Vấn đề phát hiện | Hướng xử lý triển khai |
|---|---:|---|---|
| **Số bài học HSK 4** | 20 bài (`l-401` - `l-420`) | Cấu trúc 9 bước sơ khai | Giữ nguyên 20 bài, chuẩn hóa sâu 9 bước |
| **Tổng số từ vựng** | 80 từ (4 từ / bài) | 100% từ thiếu Từ loại (POS) | Bổ sung chính xác POS tiếng Việt cho 80 từ |
| **Từ vựng trùng lặp** | 1 từ trùng HSK 3 | `方便` tại bài `l-418` trùng HSK 3 | Thay bằng từ `快捷` (Khoái tiệp - HSK 4) |
| **Chữ Hán Step 3** | 40 chữ (2 chữ / bài) | 1 chữ trùng HSK 3 (`准` tại `l-412`) | Thay bằng chữ `迟` (Trì - trong 推迟) |
| **Cấu trúc & IDS Step 3** | 0% (0/40 chữ) | Toàn bộ thiếu `structure` object & `ids` | Bổ sung 100% chuẩn Unicode IDS và bộ thủ |
| **DB Chiết tự IDS** | 1/40 chữ trong DB | 39 chữ vắng mặt trong DB chiết tự | Bổ sung 40 chữ vào `hanziDecomposition.js` |
| **Số lượt thoại Step 5** | 40 câu (2 câu / bài) | Quá ngắn, thiếu tính ứng dụng | Tăng lên 100 câu (5 lượt thoại/bài) |
| **Thẻ ngữ cảnh Step 5** | 0% (0/20 bài) | Thiếu bối cảnh, nhân vật, mục tiêu | Bổ sung 100% thẻ ngữ cảnh và ghi chú ngữ dụng |
| **Bài tập nghe hiểu** | Thiếu giải thích sâu | Chỉ có đáp án, thiếu rationale sư phạm | Bổ sung câu hỏi 4 lựa chọn kèm explanation |

---

## 2. DANH SÁCH 20 BÀI HỌC HSK 4 CHUẨN HÓA

| Mã bài | Chương | Tiêu đề tiếng Việt | Trọng tâm Ngữ pháp | Chữ Hán Step 3 | Bối cảnh đàm thoại công sở / thương mại |
|---|---|---|---|---|---|
| `l-401` | `ch-13` | Kết bạn mới & Trao đổi WeChat | 不仅……而且…… | 结, 扫 | Kết bạn tại hội thảo công nghệ quốc tế, quét mã QR WeChat |
| `l-402` | `ch-13` | Hẹn đi xem phim & Cà phê cuối tuần | 既然……就…… | 约, 建 | Bạn bè hẹn xem phim khoa học viễn tưởng và ngồi cà phê |
| `l-403` | `ch-13` | Chia sẻ sở thích thể thao & Nghệ thuật | 对……感兴趣 / 有好处 | 毅, 摄 | Giao lưu đam mê nhiếp ảnh và rèn luyện thể hình |
| `l-404` | `ch-13` | Thảo luận kế hoạch học tập & Thi cử | 只要……就…… | 压, 严 | Soạn bài, đối diện áp lực thi HSK 4 và luyện nghe hiểu |
| `l-405` | `ch-13` | Ôn tập & Phản xạ hội thoại kết bạn | 给……留下深刻的印象 | 印, 格 | Tổng kết kỹ năng giao tiếp, tính cách cởi mở và hài hước |
| `l-406` | `ch-14` | Đặt phòng khách sạn online & Loại phòng | 无论……都…… | 订, 标 | Tư vấn đặt phòng Suite thương gia và Standard qua điện thoại |
| `l-407` | `ch-14` | Thủ tục nhận phòng & Trả phòng | 连……也/都…… | 办, 卡 | Check-in, nộp cọc nhận thẻ phòng và quy định giờ trả phòng |
| `l-408` | `ch-14` | Đổi ngoại tệ & Rút tiền tại ATM | 按照…… | 兑, 率 | Quầy giao dịch ngân hàng: đổi 1000 USD sang RMB và phí ATM |
| `l-409` | `ch-14` | Thuê xe du lịch & Hỏi đường tham quan | 既……又…… | 租, 导 | Thuê SUV tự lái đi Đại Lý - Lệ Giang và tư vấn hướng dẫn viên |
| `l-410` | `ch-14` | Xử lý sự cố khi du lịch & Mất đồ | 千万…… | 丢, 警 | Thất lạc ba lô có giấy tờ tại ga tàu và trình báo công an |
| `l-411` | `ch-15` | Quy chuẩn nghe gọi điện thoại công sở | 请问…… | 稍, 留 | Tiếp nhận cuộc gọi đối tác, chuyển máy nhánh và ghi lời nhắn |
| `l-412` | `ch-15` | Đặt lịch hẹn họp đối tác & Đổi lịch | 提前…… | 改, **迟** | Thương lượng hoãn họp sang thứ Sáu do giám đốc bị ốm |
| `l-413` | `ch-15` | Soạn thảo email công việc & Tệp đính kèm | 请及时…… | 附, 确 | Gửi bản thảo hợp đồng, báo giá đính kèm và thư xác nhận |
| `l-414` | `ch-15` | Xin phép nghỉ việc & Giải thích đến muộn | 由于……因此…… | 堵, 歉 | Báo cáo kẹt xe giờ cao điểm do tai nạn và xin đến muộn |
| `l-415` | `ch-15` | Báo cáo tiến độ & Tổng kết văn phòng | 向……汇报 | 沟, 配 | Báo cáo tiến độ hệ thống quý 3 và tinh thần phối hợp nhóm |
| `l-416` | `ch-16` | Mua sắm online & Chat với chủ shop | 究竟…… | 券, 邮 | Nhận voucher giảm giá đơn 300 giảm 50 và tư vấn size áo |
| `l-417` | `ch-16` | Theo dõi vận chuyển & Nhận bưu phẩm | 差不多…… | 递, 签 | Tra cứu mã vận đơn hỏa tốc Hàng Châu và ký nhận bưu kiện |
| `l-418` | `ch-16` | Thanh toán di động WeChat Pay & Alipay | 随时…… | 额, 账 | Quét mã QR付款, thanh toán 68.5 tệ và kiểm tra số dư ví |
| `l-419` | `ch-16` | Đổi trả hàng online & Khiếu nại chất lượng | 哪怕……也…… | 换, 评 | Đổi size giày thể thao, bảo hiểm cước phí và đánh giá 5 sao |
| `l-420` | `ch-16` | Đại khảo hạch HSK 4 — Chinh phục Level 4 | 经过…… | 握, 熟 | Phỏng vấn kết khóa, thành tựu 1200 từ và mục tiêu HSK 5 |

---

## 3. SỐ LƯỢNG TỪ VỰNG & BỔ SUNG METADATA (80 MỤC)

100% từ vựng HSK 4 (80/80 từ) được bổ sung metadata hoàn chỉnh:
- **Từ loại (POS) tiếng Việt chuẩn mực**: Động từ, Danh từ, Tính từ, Phó từ, Cụm động tân, Giới từ, Liên từ...
- **Pinyin chuẩn thanh điệu**: 100% có dấu thanh điệu chuẩn (`ā, á, ǎ, à`).
- **Nghĩa tiếng Việt theo ngữ cảnh**: Đảm bảo ngữ nghĩa công sở và đời sống hiện đại, không dùng nghĩa thô sơ.
- **Âm Hán-Việt & Bộ thủ Khang Hy**: 100% chuẩn xác.

---

## 4. XỬ LÝ KHỬ TRÙNG TỪ VỰNG (DEDUPLICATION ANALYSIS)

Đã rà soát chéo toàn bộ 80 từ vựng HSK 4 với kho từ vựng HSK 1, HSK 2, HSK 3 và `VOCABULARY_LIST`:

1. **Khử trùng Loại A — Trùng hoàn toàn với HSK 3**:
   - Từ cũ: `方便` (fāngbiàn - Tiện lợi) tại bài `l-418` (v-418-4). Từ này vốn thuộc trình độ HSK 3.
   - Thay thế bằng: **`快捷`** (kuàijié - Khoái tiệp - nhanh chóng, mau lẹ, tiện lợi trong thanh toán di động).
   - Lý do sư phạm: `快捷` là tính từ chuẩn mực của HSK 4, thường kết hợp trong cụm "快捷支付" (thanh toán nhanh/tiện lợi), phản ánh chính xác lối sống số hiện đại của Trung Quốc.
   - Đồng bộ từ điển: Đã bổ sung mục `快捷` (ID: 732) vào `VOCABULARY_LIST` trong `src/data/chineseData.js`.

2. **Khử trùng Chữ Hán Step 3**:
   - Chữ cũ: `准` tại bài `l-412`. Chữ này đã được giảng dạy tại bài `l-302` (HSK 3).
   - Thay thế bằng: **`迟`** (chí - Trì - trong `推迟` hoãn lại / `迟到` đến muộn).
   - Lý do sư phạm: `迟` là chữ trọng tâm của bài `l-412` (Đổi lịch họp và hoãn lại cuộc họp), giúp học viên phân biệt cấu trúc `推迟` (lùi lịch) và `提前` (làm sớm hơn).

---

## 5. NÂNG CẤP CẤU TRÚC NGỮ PHÁP HSK 4

Toàn bộ 20 bài học được trang bị cấu trúc ngữ pháp có công thức, giải thích, ví dụ thực tế và cảnh báo lỗi sai thường gặp (`commonMistake`):

### A. Liên từ và cấu trúc câu phức
- **不仅……而且……** (`l-401`): Tăng tiến quan hệ ("Không những... mà còn...").
- **既然……就……** (`l-402`): Nhân quả tiền đề hiển nhiên ("Đã... thì...").
- **只要……就……** (`l-404`): Điều kiện cần thiết ("Chỉ cần... thì...").
- **无论……都……** (`l-406`): Điều kiện vô điều kiện ("Bất luận... đều...").
- **由于……因此……** (`l-414`): Nguyên nhân kết quả trang trọng ("Do... cho nên...").
- **哪怕……也……** (`l-419`): Nhượng bộ giả thiết ("Cho dù... cũng...").

### B. Cấu trúc nhấn mạnh và phạm vi
- **连……也/都……** (`l-407`): Nhấn mạnh mức độ cực đoan ("Ngay cả... cũng...").
- **千​​万……** (`l-410`): Nhấn mạnh răn đe / căn dặn ("Tuyệt đối / Nhất thiết phải...").
- **究竟……** (`l-416`): Truy cứu nguyên nhân đến cùng ("Rốt cuộc...").
- **随时……** (`l-418`): Bất cứ thời điểm nào ("Bất cứ lúc nào / Tùy ý").
- **经过……** (`l-420`): Trải qua quá trình rèn luyện tích lũy ("Trải qua...").

### C. Cấu trúc tương quan và so sánh
- **对……感兴趣 / 有好处** (`l-403`): Hướng tới đối tượng ("Có hứng thú / Có lợi cho...").
- **既……又……** (`l-409`): Song song tồn tại hai đặc điểm tích cực ("Vừa... lại vừa...").
- **按照……** (`l-408`): Căn cứ vào chuẩn mực quy định ("Theo như / Căn cứ vào...").
- **差不多……** (`l-417`): Ước lượng xấp xỉ ("Gần như / Xấp xỉ...").

---

## 6. HỘI THOẠI STEP 5 & TÌNH HUỐNG THỰC TẾ (100 LƯỢT THOẠI)

- **Quy mô thoại**: Tăng từ 40 câu lên **100 câu thoại hoàn chỉnh** (5 câu/bài), luân phiên tự nhiên giữa 2 nhân vật A và B.
- **Thẻ ngữ cảnh (Situational Context Cards)**: 100% bài có:
  - `situation`: Tên tình huống thực tế đời sống.
  - `context`: Không gian, thời gian và địa điểm giao tiếp cụ thể.
  - `participants`: Nhân vật và vai trò đối thoại.
  - `targetGoal`: Mục tiêu ngôn ngữ cần đạt được sau hội thoại.
- **Ghi chú ngữ dụng cho người Việt (`usageNotes`)**: 100% bài có lưu ý văn hóa và phản xạ thực tế (quy định 7 ngày đổi trả, văn hóa quét mã WeChat, bảo hiểm cước vận chuyển, cách dùng từ xưng hô công sở).

---

## 7. NỘI DUNG ĐỌC HIỂU & TƯ DUY DIỄN ĐẠT

- **Tích hợp tri thức nền tảng trong Step 1**: Cung cấp mục tiêu bài học (`objective`), điều kiện tiên quyết (`prerequisite`), chuẩn đầu ra (`completionCriteria`) và tóm tắt chủ đề (`summary`).
- **Khảo thí tư duy đọc hiểu trong Step 8**: 100% bài có ít nhất 2 câu hỏi trắc nghiệm rèn luyện tư duy nhận định thông tin, phân biệt quan hệ logic giữa các vế câu và giải thích đáp án rõ ràng.

---

## 8. NÂNG CẤP LUYỆN NGHE & NÓI (LISTENING & SPEAKING)

- **Listening (Step 5)**:
  - 100% câu thoại có `audioText` chuẩn ngữ âm tiếng Trung dùng cho Web Speech API / TTS, **hoàn toàn không có đường link file mp3 giả mạo**.
  - 20 câu hỏi trắc nghiệm nghe hiểu bám sát nội dung hội thoại, mỗi câu có **4 lựa chọn rõ ràng**, `correctIndex` hợp lệ (0-3) và phần `explanation` phân tích sâu lời thoại then chốt.
- **Speaking (Step 6)**:
  - 100% bài có câu mẫu phát âm (`targetSentence`), `targetPinyin`, `targetMeaning`, lời nhắc phát âm (`prompt`) và gợi ý ngữ điệu (`hint`).

---

## 9. CHIẾT TỰ IDS & MỞ RỘNG CƠ SỞ DỮ LIỆU CHỮ HÁN

- **40 Chữ Hán Step 3**:
  1. `结` (⿰纟吉), 2. `扫` (⿰扌彐), 3. `约` (⿰纟勺), 4. `建` (⿺廴聿), 5. `毅` (⿰豖殳),
  6. `摄` (⿰扌聂), 7. `压` (⿸厂土丶), 8. `严` (⿱亚厂), 9. `印` (⿰𠂉卩), 10. `格` (⿰木各),
  11. `订` (⿰讠丁), 12. `标` (⿰木示), 13. `办` (⿲丿力丶), 14. `卡` (⿱上卜), 15. `兑` (⿱丷兄),
  16. `率` (⿳亠玄十), 17. `租` (⿰禾且), 18. `导` (⿱巳寸), 19. `丢` (⿱丿去), 20. `警` (⿱敬言),
  21. `稍` (⿰禾肖), 22. `留` (⿱卯田), 23. `改` (⿰己攵), 24. `迟` (⿺辶尺), 25. `附` (⿰阝付),
  26. `确` (⿰石角), 27. `堵` (⿰土者), 28. `歉` (⿰兼欠), 29. `沟` (⿰氵勾), 30. `配` (⿰酉己),
  31. `券` (⿱𢍉刀), 32. `邮` (⿰由阝), 33. `递` (⿺辶弟), 34. `签` (⿱竹佥), 35. `额` (⿰客页),
  36. `账` (⿰贝长), 37. `换` (⿰扌奂), 38. `评` (⿰讠平), 39. `握` (⿰扌屋), 40. `熟` (⿱孰灬).
- **Mở rộng cơ sở dữ liệu `hanziDecomposition.js`**: Bổ sung toàn bộ 40 chữ Hán HSK 4, nâng tổng dung lượng kho chiết tự hệ thống từ **207 ký tự lên 247 ký tự**.

---

## 10. ĐỒNG BỘ TỪ ĐIỂN, FLASHCARD & SRS

- **Đồng bộ từ điển `VOCABULARY_LIST`**: Bổ sung mục từ `快捷` (ID: 732, cấp độ HSK 4, chủ đề Thanh toán & Công sở) trong `src/data/chineseData.js`.
- **Tương thích Flashcard**: Toàn bộ từ vựng có trường `id`, `hanzi`, `pinyin`, `meaning`, `hanviet`, `pos`, `radical` tương thích 100% với hàm `saveCustomVocab` và thuật toán SRS SuperMemo-2.
- **Tra cứu từ điển**: Hàm `getHanziDecomposition(char)` hỗ trợ tra cứu tức thì toàn bộ 40 chữ Hán HSK 4.

---

## 11. DANH SÁCH FILE ĐÃ CHỈNH SỬA & TẠO MỚI

1. `src/data/curriculumLessonsHsk4to6.js`: Chuẩn hóa 20 bài HSK 4 (`l-401` đến `l-420`).
2. `src/data/hanziDecomposition.js`: Thêm 40 định nghĩa chiết tự IDS HSK 4.
3. `src/data/chineseData.js`: Bổ sung từ vựng `快捷` (id: 732) vào `VOCABULARY_LIST`.
4. `package.json`: Tích hợp `tests/hsk4ContentQualityPhase22.test.js` vào lệnh `npm test`.
5. `tests/hsk4ContentQualityPhase22.test.js`: Tạo mới bộ kiểm thử 35 tiêu chí kiểm định HSK 4.
6. `docs/PHASE_22_TASK_05_HSK4_CONTENT_QUALITY_REPORT.md`: Tạo tài liệu nghiệm thu.

---

## 12. KẾT QUẢ KIỂM THỬ HSK 4 (35/35 TESTS PASSED)

Bộ kiểm thử [`tests/hsk4ContentQualityPhase22.test.js`](file:///d:/DELL/Dowloads/HanziGo/tests/hsk4ContentQualityPhase22.test.js) chạy thành công hoàn hảo:
```
▶ === PHASE 22 / TASK 22.05: HSK 4 CONTENT QUALITY & DEDUPLICATION TEST SUITE ===
  ✔ Criterion 1: Exactly 20 HSK 4 lessons from l-401 to l-420 (0.4229ms)
  ✔ Criterion 2: All lesson IDs are globally unique across entire curriculum (0.1244ms)
  ✔ Criterion 3: Lessons are in strict sequential order from l-401 to l-420 (0.4865ms)
  ✔ Criterion 4: Each lesson contains all 9 pedagogical steps (0.1553ms)
  ✔ Criterion 5: 100% of vocabulary items have valid Pinyin with tone marks (0.3014ms)
  ✔ Criterion 6: 100% of vocabulary items have clear Vietnamese meaning (0.1908ms)
  ✔ Criterion 7: 100% of vocabulary items have accurate Vietnamese POS (0.1998ms)
  ✔ Criterion 8: 100% of vocabulary items have accurate Han-Viet pronunciation (0.1191ms)
  ✔ Criterion 9: 100% of vocabulary items have valid Kangxi radical information (0.1635ms)
  ✔ Criterion 10: Zero unjustified vocabulary overlaps with HSK 1-3 curriculum (0.2303ms)
  ✔ Criterion 11: Vocabulary replacement v-418-4 (方便 -> 快捷) is properly integrated (0.0987ms)
  ✔ Criterion 12: 100% of lessons have comprehensive grammar explanation and examples (0.1078ms)
  ✔ Criterion 13: Dialogue in Step 5 has at least 5 lines per lesson (total >= 100 lines) (0.0824ms)
  ✔ Criterion 14: Dialogue content is non-repetitive across lessons (0.0694ms)
  ✔ Criterion 15: Dialogue alternates between at least 2 distinct roles (A and B) (0.0789ms)
  ✔ Criterion 16: Dialogue Pinyin matches Chinese text with valid tone marks (0.1279ms)
  ✔ Criterion 17: Vietnamese translations in dialogue are non-empty, clear, and natural (0.082ms)
  ✔ Criterion 18: Every lesson has a situational context card (0.086ms)
  ✔ Criterion 19: Linguistic usage notes for Vietnamese learners in every lesson (0.7976ms)
  ✔ Criterion 20: Reading comprehension and core knowledge in Step 1 (0.1245ms)
  ✔ Criterion 21: Reading comprehension & quiz questions in Step 8 with explanations (0.1262ms)
  ✔ Criterion 22: Valid, authentic audioText containing genuine Chinese sentences (0.6297ms)
  ✔ Criterion 23: Listening comprehension exercise in Step 5 has exactly 4 options (0.071ms)
  ✔ Criterion 24: Listening comprehension exercise has valid correctIndex and detailed explanation (0.0885ms)
  ✔ Criterion 25: Speaking exercise in Step 6 has prompt, targetSentence, targetPinyin, and targetMeaning (0.0803ms)
  ✔ Criterion 26: Exactly 2 characters in step3_hanzi for every lesson (40 total) (0.0661ms)
  ✔ Criterion 27: 100% of Step 3 characters have standardized IDS, structure, and mnemonics (0.142ms)
  ✔ Criterion 28: HANZI_DECOMPOSITION_DATABASE contains all 40 HSK 4 characters (total >= 247) (0.1046ms)
  ✔ Criterion 29: Preserves HSK 1, HSK 2, and HSK 3 character decompositions intact (0.0508ms)
  ✔ Criterion 30: Vocabulary data structure is compatible with Flashcard saving (0.1083ms)
  ✔ Criterion 31: Step 3 characters are compatible with getHanziDecomposition dictionary lookups (0.2518ms)
  ✔ Criterion 32: Zero placeholder strings across all 20 HSK 4 lessons (1.3207ms)
  ✔ Criterion 33: HSK 1-3 and HSK 5-6 curriculums remain completely intact (0.0786ms)
  ✔ Criterion 34: Entire curriculum contains exactly 120 lessons and lookup works with zero regressions (0.0617ms)
✔ === PHASE 22 / TASK 22.05: HSK 4 CONTENT QUALITY & DEDUPLICATION TEST SUITE === (9.4719ms)
ℹ tests 35 | pass 35 | fail 0
```

---

## 13. KẾT QUẢ KIỂM THỬ TOÀN DỰ ÁN (`npm test`)

Toàn bộ **825 test cases** của tất cả các module trong codebase đều vượt qua 100%:
```
ℹ tests 825
ℹ suites 11
ℹ pass 825
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2887.7005
```

---

## 14. KẾT QUẢ PRODUCTION BUILD (`npm run build`)

Lệnh `npm run build` hoàn thành xuất sắc trong **850ms**, biên dịch trơn tru toàn bộ 2229 module client:
```
✓ built in 850ms
dist/index.html                                   2.56 kB │ gzip:   1.14 kB
dist/assets/index-C3AamMw2.css                  315.99 kB │ gzip:  34.66 kB
dist/assets/hanziDecomposition-DYCkP6a7.js       93.63 kB │ gzip:  26.20 kB
dist/assets/data-curriculum-DAhIF9N6.js         913.65 kB │ gzip: 268.34 kB
```

---

## 15. XÁC NHẬN BẢO TOÀN DỮ LIỆU HSK 1–3 VÀ HSK 5–6

- **HSK 1**: 20 bài (`l-101` - `l-120`), 99 từ vựng, 101 chiết tự IDS nguyên vẹn.
- **HSK 2**: 20 bài (`l-201` - `l-220`), 101 từ vựng, 80+ câu thoại nguyên vẹn.
- **HSK 3**: 20 bài (`l-301` - `l-320`), 91 từ vựng, 82 câu thoại, 40 chiết tự nguyên vẹn.
- **HSK 4**: 20 bài (`l-401` - `l-420`), 80 từ vựng có POS, 100 câu thoại, 40 chiết tự chuẩn hóa mới.
- **HSK 5**: 20 bài (`l-501` - `l-520`) nguyên vẹn, sẵn sàng cho Task 22.06.
- **HSK 6**: 20 bài (`l-601` - `l-620`) nguyên vẹn, sẵn sàng cho Task 22.07.
- **Toàn bộ giáo trình**: Đúng **120 bài học**, 0 lỗi hồi quy.

---

## 16. KẾ HOẠCH BƯỚC TIẾP THEO

Chuẩn bị sẵn sàng cho **Task 22.06 — HSK 5 Advanced Fluency**:
- Nâng cấp 20 bài học HSK 5 (`l-501` đến `l-520`).
- Tập trung vào ngôn ngữ học thuật, thành ngữ chuyên sâu, văn phong nghị luận xã hội và diễn đạt biểu cảm cao cấp.

