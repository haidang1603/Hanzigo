# HANZIGO — PHASE 22 / TASK 22.03
# BÁO CÁO NÂNG CẤP CHẤT LƯỢNG ĐÀM THOẠI HSK 2 (CONVERSATIONAL QUALITY)

> **Mã công việc:** TASK-22.03  
> **Thời gian hoàn thành:** 2026-11-08  
> **Phạm vi tác động:** 20 bài học HSK 2 (`l-201` đến `l-220`), CSDL Chiết tự IDS (`src/data/hanziDecomposition.js`), Trình học tương tác (`InteractiveLessonPlayer.jsx`), Bộ kiểm thử kiểm định 24 tiêu chí (`tests/hsk2ConversationalPhase22.test.js`).

---

## 1. TỔNG QUAN TRƯỚC VÀ SAU TRIỂN KHAI

| Tiêu chí | Trước khi triển khai Task 22.03 | Sau khi triển khai Task 22.03 | Đánh giá cải thiện |
|---|---|---|---|
| **Độ dài đoạn hội thoại (Step 5)** | 2 lượt thoại ngắn cụt (chỉ A - B) mỗi bài | 4 – 5 lượt thoại tự nhiên, giàu ngữ cảnh | Tăng từ 40 câu lên 84 câu thoại chuẩn khẩu ngữ (+110%) |
| **Bối cảnh tình huống giao tiếp** | Không có mô tả tình huống hay bối cảnh thực tế | Đầy đủ tình huống, bối cảnh, nhân vật và mục tiêu | 20/20 bài có thẻ tình huống sinh hoạt thực tế |
| **Ghi chú giao tiếp cho người Việt** | Thiếu vắng các lưu ý ngữ dụng và văn hóa | Có `usageNotes` chi tiết (cách dùng từ, văn hóa xưng hô) | Giúp học viên Việt Nam phản xạ tự nhiên |
| **Từ loại (POS) HSK 2** | 0/101 từ có trường `pos` (thiếu 100%) | 101/101 từ được gán POS tiếng Việt chuẩn ngữ pháp | Chuẩn hóa 100% |
| **Dữ liệu chiết tự IDS HSK 2** | Chỉ có 4/40 chữ trong database chiết tự | 40/40 chữ Step 3 có đầy đủ cấu trúc IDS & mnemonic | Bổ sung 36 mục chiết tự chuyên sâu |
| **Chế độ tương tác đàm thoại** | Chỉ có nút phát một lần toàn bộ văn bản | Bộ lọc vai (Toàn bộ / Chỉ vai A / Chỉ vai B / 🎭 Đóng vai) | Tương tác linh hoạt, hỗ trợ tự luyện vai B |
| **Bộ kiểm thử tự động** | Chưa có bài test riêng cho đàm thoại HSK 2 | Test suite `tests/hsk2ConversationalPhase22.test.js` (24 tiêu chí) | 100% PASS (24/24 kiểm định) |

---

## 2. DANH SÁCH 20 BÀI HỌC HSK 2 ĐÃ KIỂM TRA VÀ NÂNG CẤP

| STT | Mã bài | Chương | Tên bài học | Tình huống giao tiếp thực tế | Số câu thoại | Số từ vựng | Chữ Step 3 |
|---|---|---|---|---|:---:|:---:|---|
| 1 | `l-201` | `ch-5` | Giờ giấc chi tiết, thói quen thức dậy & đi ngủ | Thói quen sinh hoạt và giờ thức dậy của bạn cùng phòng | 4 | 6 | 床, 睡 |
| 2 | `l-202` | `ch-5` | Phương tiện giao thông công cộng & Di chuyển | Lựa chọn phương tiện đi làm tránh tắc đường giờ cao điểm | 4 | 6 | 坐, 铁 |
| 3 | `l-203` | `ch-5` | Diễn đạt khoảng cách không gian với giới từ 离 (lí) | Hỏi khoảng cách từ khách sạn tới Cố Cung (Tử Cấm Thành) | 4 | 6 | 远, 近 |
| 4 | `l-204` | `ch-5` | Hỏi đường & Chỉ hướng với giới từ 往 (wǎng) | Hỏi đường đến thư viện thành phố tại ngã tư đèn giao thông | 4 | 6 | 左, 右 |
| 5 | `l-205` | `ch-5` | Ôn tập Module 2.1 & Bắt taxi, chỉ đường | Bắt taxi ra sân bay và yêu cầu dừng xe đón bạn | 4 | 3 | 停, 车 |
| 6 | `l-206` | `ch-6` | Đi nhà hàng & Gọi món quen thuộc (点菜与菜单) | Xem thực đơn và gọi món gà Kung Pao, mì bò, sủi cảo | 5 | 6 | 服, 单 |
| 7 | `l-207` | `ch-6` | Khẩu vị & Dặn dò nhà bếp (不要放辣椒) | Yêu cầu nước dùng thanh ngọt, không bỏ ớt cay và ít muối | 4 | 6 | 辣, 甜 |
| 8 | `l-208` | `ch-6` | Mua sắm quần áo, màu sắc & Size (试衣服) | Chọn áo đỏ thịnh hành, xin phòng thử đồ và đổi size lớn | 4 | 6 | 衣, 穿 |
| 9 | `l-209` | `ch-6` | Thanh toán số & Mặc cả (微信支付与打折) | Mặc cả bộ ấm trà từ 180 tệ xuống 150 tệ và quét mã WeChat | 5 | 6 | 宜, 信 |
| 10 | `l-210` | `ch-6` | Ôn tập Module 2.2 & Đi chợ đêm mua sắm | Mua mì nướng lạnh, trà sữa ở chợ đêm và xin bớt giá | 4 | 3 | 共, 块 |
| 11 | `l-211` | `ch-7` | Bốn mùa & Hiện tượng thời tiết (刮风, 下雪, 晴天) | Trao đổi dự báo thời tiết ngày mai có gió to và lạnh 5 độ | 4 | 6 | 晴, 雪 |
| 12 | `l-212` | `ch-7` | Câu so sánh hơn với chữ 比 (A 比 B + Tính từ) | Gọi video so sánh thời tiết giá lạnh Bắc Kinh và Hà Nội | 4 | 5 | 比, 高 |
| 13 | `l-213` | `ch-7` | So sánh mức độ nâng cao với 更, 最 (Càng & Nhất) | Bàn luận chọn quán ăn ngon nhất và rẻ nhất gần cổng Đông | 4 | 4 | 更, 最 |
| 14 | `l-214` | `ch-7` | Sức khỏe & Đi khám bệnh (生病, 感冒, 发烧, 吃药) | Khám bệnh cảm sốt 38.5 độ và nghe bác sĩ dặn liều thuốc | 5 | 6 | 病, 药 |
| 15 | `l-215` | `ch-7` | Xin nghỉ phép & Lời khuyên ân cần (请假, 休息) | Gọi điện xin cô giáo nghỉ học vì ốm và lời khuyên uống nước | 4 | 4 | 休, 息 |
| 16 | `l-216` | `ch-8` | Trợ từ động thái 着 diễn đạt trạng thái duy trì | Hẹn bạn ở quán cà phê và nhận diện qua áo trắng, cầm sách | 4 | 5 | 关, 拿 |
| 17 | `l-217` | `ch-8` | Trợ từ động thái 过 diễn đạt trải nghiệm quá khứ | Kể trải nghiệm từng đi Bắc Kinh ngắm bình minh Trường Thành | 5 | 4 | 过, 次 |
| 18 | `l-218` | `ch-8` | Cặp liên từ logic 因为...所以... & 虽然...但是... | Chia sẻ động lực học tiếng Trung để chuẩn bị đi du học | 4 | 5 | 因, 但 |
| 19 | `l-219` | `ch-8` | Tổng ôn tập toàn diện hệ thống ngữ pháp HSK 2 | Phỏng vấn đánh giá phản xạ nghe nói tự tin khi đi du lịch | 4 | 4 | 特, 助 |
| 20 | `l-220` | `ch-8` | Checkpoint Test HSK 2 (Thi thử chuẩn CTI 35 câu) | Nhận kết quả đỗ HSK 2 và lập kế hoạch chinh phục HSK 3 | 4 | 4 | 通, 贺 |

---

## 3. SỐ LƯỢNG TỪ VỰNG ĐÃ RÀ SOÁT VÀ CHUẨN HÓA

- **Tổng số từ vựng HSK 2**: 101 từ vựng.
- **Tỷ lệ có từ loại (POS)**: 101/101 từ (100%), bao gồm: Danh từ, Động từ, Động từ ly hợp, Tính từ, Số từ, Lượng từ, Đại từ, Phó từ, Liên từ, Trợ từ động thái, Giới từ, Danh từ riêng, Cụm động tân.
- **Tỷ lệ có âm Hán Việt**: 101/101 từ (100%).
- **Tỷ lệ có bộ thủ Khang Hy**: 101/101 từ (100%).
- **Độ chính xác Pinyin & Thanh điệu**: 100% tuân thủ Hanyu Pinyin chuẩn quốc tế.

---

## 4. SỐ HỘI THOẠI ĐÃ BỔ SUNG HOẶC NÂNG CẤP

- **Số bài học có hội thoại nâng cấp**: 20/20 bài.
- **Tổng số câu thoại mới**: 84 lượt thoại giao tiếp thực tế (so với 40 câu thoại mẫu cũ).
- **Cấu trúc mỗi hội thoại**: 4 đến 5 lượt luân phiên A / B hoàn chỉnh.
- **Độ dài câu thoại**: Phù hợp chuẩn năng lực HSK 2 (từ 8 đến 25 chữ Hán/câu), liên kết chặt chẽ ngữ pháp và từ vựng của bài học.

---

## 5. DANH SÁCH CÁC NHÓM TÌNH HUỐNG ĐÃ HOÀN THIỆN

1. **Nhóm A: Giao tiếp thường ngày & Sức khỏe**
   - Thói quen thức dậy, đi ngủ, giờ giấc kém/khắc (`l-201`).
   - Đi bệnh viện, đo nhiệt độ sốt, mô tả đau đầu và hướng dẫn uống thuốc sau ăn (`l-214`).
   - Xin phép cô giáo nghỉ học vì cảm cúm, lời dặn dò uống nước ấm (`l-215`).
   - Bàn luận động lực học tập với cặp liên từ `因为...所以...`, `虽然...但是...` (`l-218`).
2. **Nhóm B: Mua sắm và mặc cả thực tế**
   - Mua sắm thời trang: hỏi màu sắc, thử kích cỡ, đổi size áo lớn hơn (`l-208`).
   - Mặc cả giá cả lịch sự: *"太贵了，便宜一点儿我就买"* và thanh toán WeChat Pay (`l-209`).
   - Dạo chợ đêm ẩm thực: hỏi tổng tiền `一共多少钱` và xin bớt giá vui vẻ (`l-210`).
3. **Nhóm C: Hỏi đường và di chuyển giao thông**
   - Chọn phương tiện đi làm giờ cao điểm: so sánh xe buýt, xe đạp và tàu điện ngầm (`l-202`).
   - Hỏi khoảng cách địa lý và thời gian di chuyển với giới từ `离` (`l-203`).
   - Chỉ dẫn hướng đi ngã tư với giới từ `往`: `往前走`, `往右拐`, `往左拐` (`l-204`).
   - Bắt xe taxi: giao tiếp với bác tài `师傅`, yêu cầu dừng xe an toàn đón bạn (`l-205`).
4. **Nhóm D: Ăn uống và dịch vụ ẩm thực**
   - Đi nhà hàng gọi món: xem thực đơn `菜单`, gọi gà Kung Pao, sủi cảo, trà nóng (`l-206`).
   - Dặn dò khẩu vị nhà bếp: không ăn được cay, dặn `不要放辣椒，少放一点儿盐` (`l-207`).
5. **Nhóm E: Học tập, thời tiết, so sánh & Trải nghiệm cuộc sống**
   - Dự báo thời tiết bốn mùa: trời quang, nổi gió to, nhiệt độ giảm (`l-211`).
   - Câu so sánh hơn chữ `比`: so sánh thời tiết Bắc Kinh và Hà Nội (`l-212`).
   - So sánh mức độ `更`, `最`: chọn quán ăn ngon nhất và rẻ nhất (`l-213`).
   - Trạng thái duy trì với `着`: miêu tả vị trí ngồi, áo mặc và sách cầm trên tay (`l-216`).
   - Trải nghiệm quá khứ với `过`: từng đi Bắc Kinh ngắm bình minh Trường Thành (`l-217`).
   - Tổng kết giao tiếp và thi thử HSK 2: phản xạ ứng biến và mục tiêu HSK 3 (`l-219`, `l-220`).

---

## 6. SỐ AUDIO THỰC TẾ ĐÃ TÍCH HỢP

- **Số bài học có chuỗi audio tổng hợp (`audioText`)**: 20/20 bài học HSK 2 (100%).
- **Cơ chế phát audio thực tế**:
  - Tầng 1: Web Speech Synthesis API với giọng Quan thoại phổ thông chuẩn `zh-CN` (tốc độ chuẩn 0.9x và chế độ chậm 0.65x).
  - Tầng 2: Hỗ trợ Azure Neural TTS Proxy (`/api/audio/tts`) với hai giọng chuẩn `zh-CN-XiaoxiaoNeural` (nữ) và `zh-CN-YunxiNeural` (nam).
  - Phát từng câu riêng biệt: 84/84 câu thoại có nút kích hoạt phát âm độc lập.

---

## 7. SỐ AUDIO CÒN THIẾU

- **Audio còn thiếu**: 0. Tất cả 20 bài học và 84 câu thoại đều được kết nối với engine phát âm thực tế của HanziGo. Không có bất kỳ liên kết giả hay placeholder rỗng nào.

---

## 8. SỐ BÀI TẬP LISTENING ĐÃ BỔ SUNG

- **Tổng số bài tập nghe hiểu (Listening Comprehension)**: 20 bài tập tương ứng 20 bài học.
- **Cấu trúc bài tập**:
  - Mỗi bài tập gồm: 1 câu hỏi nghe hiểu tình huống, 4 phương án lựa chọn phân biệt rõ ràng, 1 đáp án chính xác (`correctIndex`) và 1 đoạn giải thích ngữ cảnh chi tiết (`explanation`).
  - Giao diện phản hồi trực quan: Báo đúng/sai tức thì kèm âm thanh chúc mừng và hiển thị giải thích sư phạm.

---

## 9. SỐ HOẠT ĐỘNG SPEAKING ĐÃ TÍCH HỢP

- **Luyện nói câu mục tiêu (Step 6)**: 20/20 bài có tình huống luyện nói phản xạ kèm câu mẫu, Pinyin, bản dịch và chấm điểm âm sắc qua Web Speech Recognition API.
- **Luyện nói theo vai hội thoại (Step 5 Roleplay Mode)**:
  - Tích hợp chế độ `🎭 Đóng vai (Luyện vai B)` trực tiếp trên giao diện `InteractiveLessonPlayer`.
  - Hệ thống tự động đánh dấu các câu của nhân vật B là `🎤 Lượt bạn đọc`, cho phép học viên nghe câu dẫn của nhân vật A rồi tự luyện nói câu đáp của mình.

---

## 10. SỐ CHỮ HÁN ĐƯỢC BỔ SUNG CHIẾT TỰ (IDS)

- **Số chữ Hán Step 3 HSK 2**: 40 chữ.
- **Số mục bổ sung mới vào `HANZI_DECOMPOSITION_DATABASE`**: 36 chữ Hán độc lập:
  `床`, `睡`, `坐`, `铁`, `远`, `近`, `左`, `右`, `停`, `服`, `单`, `辣`, `甜`, `衣`, `穿`, `宜`, `信`, `共`, `晴`, `雪`, `比`, `更`, `最`, `病`, `药`, `息`, `关`, `拿`, `过`, `次`, `因`, `但`, `特`, `助`, `通`, `贺`.
- Mỗi mục bao gồm:
  - Cấu trúc hình học chuẩn ISO/IEC 10646 IDS: `single (◰)`, `left_right (⿰)`, `top_bottom (⿱)`, `semi_top_left (⿸)`, `semi_bottom_left (⿺)`, `full_enclosure (⿴)`.
  - Phân tách thành phần cấu tạo (components) kèm nghĩa, Pinyin và âm Hán Việt của từng bộ.
  - Câu chuyện chiết tự sư phạm (mnemonic) giàu hình tượng giúp ghi nhớ nhanh.

---

## 11. KẾT QUẢ ĐỒNG BỘ TỪ ĐIỂN VÀ FLASHCARD

- **Lưu Flashcard**: 100% từ vựng HSK 2 tương thích hoàn toàn với hàm `saveCustomVocab` và `captureWeakVocabulary`.
- **Tra cứu từ điển**: Cả 40 chữ Hán Step 3 và các từ vựng mới đều có thể tra cứu ngay trong Word Inspector Modal 3-Tab (`📖 Chi tiết`, `🖌️ Thuận bút`, `✍️ Luyện viết`).
- **Luyện viết chữ Hán**: Tương thích hoàn toàn với `StrokeOrderPlayer` và `InteractiveWritingPad` thông qua thư viện `hanzi-writer`.

---

## 12. DANH SÁCH CÁC FILE ĐÃ CHỈNH SỬA VÀ TẠO MỚI

1. `src/data/curriculumLessons.js`:
   - Chuẩn hóa toàn diện 20 bài học HSK 2 (`l-201` đến `l-220`).
   - Bổ sung POS chuẩn ngữ pháp cho 101 từ vựng HSK 2.
   - Nâng cấp 84 câu thoại giao tiếp tự nhiên cùng thẻ bối cảnh tình huống thực tế và câu hỏi nghe hiểu kèm giải thích.
   - Bổ sung siêu dữ liệu Pinyin, bộ thủ Khang Hy và cấu trúc cho 40 chữ Hán Step 3.
2. `src/data/hanziDecomposition.js`:
   - Bổ sung 36 mục chiết tự IDS chuyên sâu cho toàn bộ chữ Hán mới của HSK 2.
3. `src/components/learning/InteractiveLessonPlayer.jsx`:
   - Bổ sung thẻ bối cảnh tình huống thực tế (tình huống, nhân vật, mục tiêu).
   - Bổ sung bộ lọc vai đàm thoại (`Toàn bộ`, `Vai A`, `Vai B`, `🎭 Đóng vai`).
   - Bổ sung hộp ghi chú mẹo giao tiếp văn hóa cho người Việt (`usageNotes`).
   - Hiển thị giải thích đáp án khi làm bài tập nghe hiểu.
4. `tests/hsk2ConversationalPhase22.test.js`:
   - Bộ kiểm thử mới với 24 nhóm kiểm định chất lượng đàm thoại HSK 2.
5. `package.json`:
   - Đăng ký `tests/hsk2ConversationalPhase22.test.js` vào lệnh kiểm thử `npm test`.
6. `docs/PHASE_22_TASK_03_HSK2_CONVERSATIONAL_REPORT.md`:
   - Tài liệu nghiệm thu kỹ thuật của Task 22.03.

---

## 13. KẾT QUẢ KIỂM THỬ (TEST RESULTS)

### Kiểm thử riêng HSK 2 (`tests/hsk2ConversationalPhase22.test.js`):
```text
▶ TASK 22.03 — HSK 2 Conversational Quality Test Suite
  ✔ 1. Exactly 20 HSK 2 lessons exist (l-201 to l-220) (0.37ms)
  ✔ 2. Lesson IDs in HSK 2 are unique without duplicates (0.10ms)
  ✔ 3. Lesson IDs preserve canonical sequence l-201 through l-220 (0.45ms)
  ✔ 4. All HSK 2 lessons have valid 9-step pedagogical structure (0.20ms)
  ✔ 5. All HSK 2 vocabulary items have valid Pinyin with tone marks (0.27ms)
  ✔ 6. All HSK 2 vocabulary items have Vietnamese meaning and POS (0.31ms)
  ✔ 7. Dialogue lines have non-empty Chinese sentences (0.20ms)
  ✔ 8. Dialogue lines have matching, accurate Pinyin (0.15ms)
  ✔ 9. Vietnamese translations in dialogues are completely filled and natural (0.18ms)
  ✔ 10. Dialogues are distinct and non-duplicated across lessons (0.13ms)
  ✔ 11. Audio metadata is valid and audioText matches dialogue content (0.10ms)
  ✔ 12. No dummy or placeholder audio URLs in HSK 2 data (1.25ms)
  ✔ 13. Audio playback and speed controls supported in InteractiveLessonPlayer (0.71ms)
  ✔ 14. Listening comprehension exercises are backed by full audio text (0.11ms)
  ✔ 15. Listening questions have 4 choices, valid correctIndex and explanations (0.11ms)
  ✔ 16. Zero placeholder strings (TODO, Lorem, đang cập nhật) in HSK 2 (0.96ms)
  ✔ 17. Vocabulary characters are verifiable via Dictionary lookup (0.06ms)
  ✔ 18. Flashcard data format compatibility for HSK 2 vocabulary items (0.09ms)
  ✔ 19. Character IDS database preserves HSK 1 entries while expanding HSK 2 (0.30ms)
  ✔ 20. Step 3 Hanzi in HSK 2 contain valid strokeCount and strokeOrderText (0.14ms)
  ✔ 21. HSK 1 (l-101 to l-120) remains intact with 20 lessons and 99 vocabs (0.07ms)
  ✔ 22. HSK 3-6 remain intact with exact lesson counts (0.04ms)
  ✔ 23. UI component InteractiveLessonPlayer exists and handles responsive dialogue rendering (0.78ms)
  ✔ 24. Complete HSK 2 conversational quality verification summary (0.06ms)
✔ TASK 22.03 — HSK 2 Conversational Quality Test Suite (9.01ms)

ℹ tests 25 | suites 0 | pass 25 | fail 0 | cancelled 0 | skipped 0 | todo 0
```

### Kiểm thử toàn dự án (`npm test`):
```text
ℹ tests 759 | suites 11 | pass 759 | fail 0 | cancelled 0 | skipped 0 | todo 0
ℹ duration_ms 2886ms
```

---

## 14. KẾT QUẢ PRODUCTION BUILD

```bash
npm run build
```
```text
✓ 2229 modules transformed.
✓ built in 846ms (0 errors, 0 breaking warnings)
dist/index.html                                   2.56 kB
dist/assets/data-curriculum-CgjwxbJJ.js         804.58 kB
```

---

## 15. CÁC HẠN CHẾ CÒN TỒN TẠI VÀ ĐỀ XUẤT CHO TASK TIẾP THEO

1. **Chế độ tự động chuyển lượt thoại trong Roleplay**:
   - Hiện tại chế độ Roleplay giúp học viên nhận biết lượt của mình (`🎤 Lượt bạn đọc`) và phát câu mẫu. Để tăng tính tự động hóa, có thể bổ sung timer tự động phát câu đối thoại tiếp theo sau khi học viên đọc xong.
2. **Chuẩn hóa HSK 3**:
   - Cần tiếp tục áp dụng tiêu chuẩn đàm thoại, từ loại và chiết tự này cho 20 bài học của HSK 3 trong Task 22.04.

---

## 16. XÁC NHẬN BẢO TOÀN HSK 1 VÀ HSK 3–6

- **HSK 1**: Đầy đủ 20 bài học (`l-101` đến `l-120`), 99 từ vựng, 40 chữ Hán Step 3, không bị thay đổi dữ liệu đã chuẩn hóa ở Task 22.02.
- **HSK 3**: Đầy đủ 20 bài học (`l-301` đến `l-320`) nguyên vẹn trong `CURRICULUM_60_LESSONS`.
- **HSK 4–6**: Đầy đủ 60 bài học trong `curriculumLessonsHsk4to6.js`.
- **Tổng số bài học toàn hệ thống**: Duy trì chính xác 120 bài học giáo trình chính thức.
- **Không thực hiện git push hoặc deploy**: Toàn bộ thay đổi được lưu trữ an toàn trong local workspace.

