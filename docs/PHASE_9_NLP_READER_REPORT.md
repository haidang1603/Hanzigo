# HANZIGO — BÁO CÁO KỸ THUẬT PHASE 9: SMART CHINESE READER, CONTEXT-FIRST NLP & SRS VOCABULARY CAPTURE

**Thời gian hoàn thành:** 25/10/2026  
**Mục tiêu:** Xây dựng phân hệ Đọc hiểu thông minh (Smart Chinese Reader) trên HanziGo, giải quyết bài toán từ đa âm (多音字) bằng thuật toán Context-First Alignment, tích hợp 12 bài đọc phân cấp HSK 1–6 (Graded Readers), bộ dữ liệu chiết tự chuẩn IDS (Ideographic Description Sequences) và luồng bắt từ vựng vào hàng đợi ôn tập SRS SM-2.

---

## 1. Kiến trúc Thuật toán Context-First Alignment & Xử lý Từ Đa Âm (多音字)

### 1.1. Thách thức kỹ thuật
Trong tiếng Trung, hiện tượng từ đa âm (多音字 - Heteronyms) là rào cản lớn nhất đối với việc phát âm và gắn Pinyin tự động:
- Chữ `行`: trong `银行` đọc là `yínháng`, nhưng trong `行动` / `行李` đọc là `xíngdòng` / `xíngli`, trong `一行人` lại đọc là `yī háng rén`.
- Chữ `觉`: trong `睡觉` đọc là `shuìjiào`, nhưng trong `觉得` / `感觉` đọc là `juéde` / `gǎnjué`.
- Chữ `长`: trong `长大` / `校长` đọc là `zhǎngdà` / `xiàozhǎng`, trong `长城` / `长短` đọc là `chángchéng` / `chángduǎn`.
- Chữ `乐`: trong `快乐` đọc là `kuàilè`, trong `音乐` đọc là `yīnyuè`.
- Chữ `还`: trong `还钱` / `归还` đọc là `huánqián` / `guīhuán`, trong `还有` / `还是` đọc là `háiyǒu` / `háishì`.
- Chữ `得`: trong `得去` đọc là `děi qù`, trong `跑得快` đọc là `pǎo de kuài`, trong `得到` đọc là `dédào`.

Nếu tách từ độc lập mà không xét ngữ cảnh của cụm từ hoặc cả câu, các thư viện Pinyin truyền thống sẽ gắn âm mặc định (thường là âm có tần suất cao nhất), dẫn tới sai lệch nghĩa nghiêm trọng. Ngoài ra, việc dùng native addon C++ (như `nodejieba`) bị cấm hoàn toàn vì gây crash môi trường Edge/Serverless của Vercel.

### 1.2. Giải pháp: Thuật toán Context-First Alignment
Được cài đặt thuần JavaScript tại `src/utils/chineseNlpEngine.js`, thuật toán thực hiện theo 3 giai đoạn:

```
[Văn bản đầu vào]
       │
       ▼
[Giai đoạn 1: Context-First Sentence Scan]
  - Quét văn bản theo từ điển cụm từ đa âm ưu tiên cao (Priority Heteronym Compound Rules)
  - Khớp các cụm từ đa âm phức (ngữ cảnh 2-4 ký tự) trước để gán chính xác mảng âm Pinyin
  - Lưu bản đồ phiên âm ký tự theo vị trí tuyệt đối (char-index-to-pinyin map)
       │
       ▼
[Giai đoạn 2: Forward Maximum Matching Tokenization]
  - Tách câu thành các token từ vựng bằng thuật toán Forward Maximum Matching (độ dài tối đa 6 ký tự)
  - Đối chiếu kho từ vựng HSK 1–6 (500+ từ cốt lõi + 120 bài học HanziGo + 214 bộ thủ)
  - Bảo tồn nguyên vẹn dấu câu tiếng Trung (`。，！？《》“”‘’；：—…`), tiếng Anh, khoảng trắng và dấu xuống dòng `\n`
       │
       ▼
[Giai đoạn 3: Token Enrichment & Character Pointer Alignment]
  - Ánh xạ mảng âm Pinyin từ Giai đoạn 1 vào từng token từ ghép ở Giai đoạn 2
  - Bổ sung siêu dữ liệu cho token:
    + hanzi, traditional (chữ Phồn thể)
    + pinyin ngữ cảnh
    + hanviet (Âm Hán-Việt)
    + meaningVi, meaningEn (Nghĩa Việt & Anh)
    + pos (Từ loại: danh từ, động từ, tính từ...)
    + level (Cấp độ: HSK 1 – HSK 6)
    + decomposition (Chiết tự IDS ISO/IEC 10646)
    + isKnown / isSaved
```

### 1.3. Kết quả kiểm thử Từ Đa Âm (Unit Tests)
Bộ test tại `tests/chineseNlpEngine.test.js` kiểm tra 12 cặp ngữ cảnh đối kháng khắt khe và đạt độ chính xác 100%:
1. `银行` (`yín háng`) vs `行动` (`xíng dòng`) & `一行人` (`yī háng rén`)
2. `睡觉` (`shuì jiào`) vs `觉得` (`jué de`)
3. `长大` (`zhǎng dà`) vs `长城` (`cháng chéng`)
4. `快乐` (`kuài lè`) vs `音乐` (`yīn yuè`)
5. `还钱` (`huán qián`) vs `还有` (`hái yǒu`)
6. `得去` (`děi qù`) vs `跑得快` (`pǎo de kuài`) vs `得到` (`dé dào`)
7. `看门` (`kān mén`) vs `看书` (`kàn shū`)
8. `重新` (`chóng xīn`) vs `重要` (`zhòng yào`)
9. `便宜` (`pián yi`) vs `方便` (`fāng biàn`)
10. `着急` (`zháo jí`) vs `看着` (`kàn zhe`)
11. `因为` (`yīn wèi`) vs `成为` (`chéng wéi`)
12. `地方` (`dì fang`) vs `慢慢地` (`màn màn de`)

---

## 2. Danh mục Bài đọc Phân cấp (Graded Readers HSK 1–6)

Kho bài đọc mẫu được biên soạn công phu tại `src/data/gradedReadersData.js`, bao gồm 12 bài đọc chia đều từ HSK 1 đến HSK 6 (2 bài/cấp), phản ánh chân thực đời sống, văn hóa, ẩm thực và công nghệ Trung Hoa hiện đại:

| ID | Cấp độ | Tiêu đề Chữ Hán | Tiêu đề Tiếng Việt | Chủ đề / Giá trị Văn hóa | Số câu hỏi đọc hiểu |
|---|---|---|---|---|:---:|
| `gr-101` | **HSK 1** | 我的幸福小家庭 | Gia đình nhỏ hạnh phúc của tôi | Giới thiệu các thành viên, tuổi tác, trà | 2 |
| `gr-102` | **HSK 1** | 在中国餐厅点菜 | Gọi món tại nhà hàng Trung Quốc | Trải nghiệm gọi sủi cảo, trà cúc, tính tiền | 2 |
| `gr-201` | **HSK 2** | 周末的北京旅行 | Chuyến du lịch Bắc Kinh cuối tuần | Thăm Tử Cấm Thành, ăn vịt quay, thời tiết | 2 |
| `gr-202` | **HSK 2** | 我的中国朋友小李 | Người bạn Trung Quốc Tiểu Lý của tôi | Bạn cùng phòng, nấu mì xào, kiên nhẫn dạy tiếng | 2 |
| `gr-301` | **HSK 3** | 中国的茶文化体验 | Trải nghiệm Văn hóa Trà đạo Trung Hoa | Trà Long Tỉnh, nghệ thuật thưởng trà, thư thái | 2 |
| `gr-302` | **HSK 3** | 搬进新公寓的第一天 | Ngày đầu tiên dọn vào căn hộ mới | Cuộc sống độc lập, siêu thị, hàng xóm nhiệt tình | 2 |
| `gr-401` | **HSK 4** | 移动支付如何改变中国生活 | Thanh toán di động thay đổi cuộc sống | WeChat Pay, Alipay, nền kinh tế không tiền mặt | 2 |
| `gr-402` | **HSK 4** | 现代年轻人的职场减压之道 | Cách giải tỏa áp lực của giới trẻ | Chạy bộ, cắm trại ngoại ô, cân bằng công việc | 2 |
| `gr-501` | **HSK 5** | 人工智能时代的传统手工艺 | Thủ công truyền thống trong kỷ nguyên AI | Gốm Cảnh Đức Trấn, nhiệt huyết nghệ nhân | 2 |
| `gr-502` | **HSK 5** | 共享经济与现代城市绿色出行 | Kinh tế chia sẻ và giao thông xanh đô thị | Xe đạp chia sẻ, giảm phát thải carbon | 2 |
| `gr-601` | **HSK 6** | 数字化浪潮下的乡村文化重构 | Tái cấu trúc văn hóa nông thôn số | Livestream nông sản, hồi sinh kinh tế làng quê | 2 |
| `gr-602` | **HSK 6** | 传统节庆在当代社会的文化衍变 | Biến chuyển văn hóa của lễ hội truyền thống | Tết Trung Thu, bảo tồn căn cước văn hóa | 2 |

### Tính năng tương tác bài đọc:
1. **Bật/tắt Pinyin Ruby:** Dùng thẻ chuẩn `<ruby>` và `<rt>`, căn chỉnh chính xác phía trên chữ Hán, không làm giật dòng chữ khi phóng to thu nhỏ.
2. **Tô màu cấp độ HSK (HSK Level Highlighting):**
   - HSK 1: Xanh ngọc lục bảo (Emerald)
   - HSK 2: Xanh lam mòng két (Teal)
   - HSK 3: Xanh da trời (Sky)
   - HSK 4: Vàng hổ phách (Amber)
   - HSK 5: Cam san hô (Orange)
   - HSK 6: Đỏ mận quý tộc (Rose/Purple)
3. **Phát âm câu và đoạn:** Tích hợp `AudioButton` và Web Speech API cho từng câu và toàn bài.
4. **Trắc nghiệm đọc hiểu (Comprehension Quiz):** Có giải thích chi tiết đáp án và thưởng +15 XP khi hoàn thành.
5. **Chế độ văn bản tùy chỉnh:** Cho phép paste bất kỳ đoạn văn nào ($\le 2.000$ ký tự) để phân tích từ vựng tức thì.

---

## 3. Bộ Dữ liệu Chiết tự Chuẩn IDS (Ideographic Description Sequences)

Được chuẩn hóa tại `src/data/hanziDecomposition.js` theo tiêu chuẩn quốc tế ISO/IEC 10646 & Unicode CJK IDS:

### 3.1. Các ký hiệu cấu trúc IDS được hỗ trợ:
- `⿰` (U+2FF0): Cấu trúc Trái - Phải (Left to Right) — ví dụ: `你`, `好`, `休`, `明`, `语`, `行`
- `⿱` (U+2FF1): Cấu trúc Trên - Dưới (Above to Below) — ví dụ: `字`, `草`, `学`, `想`, `茶`, `分`
- `⿲` (U+2FF2): Cấu trúc Trái - Giữa - Phải (Left to Middle to Right) — ví dụ: `做`, `谢`, `树`
- `⿳` (U+2FF3): Cấu trúc Trên - Giữa - Dưới (Above to Middle to Below) — ví dụ: `爱`, `高`
- `⿴` (U+2FF4): Cấu trúc Bao quanh toàn bộ (Full Surround) — ví dụ: `国`, `回`, `团`, `四`
- `⿵` (U+2FF5): Cấu trúc Bao quanh hở đáy (Surround from Above) — ví dụ: `问`, `间`, `同`
- `⿶` (U+2FF6): Cấu trúc Bao quanh hở đỉnh (Surround from Below) — ví dụ: `凶`, `画`
- `⿷` (U+2FF7): Cấu trúc Bao quanh hở phải (Surround from Left) — ví dụ: `区`, `医`
- `⿸` (U+2FF8): Cấu trúc Góc trên trái (Surround from Upper Left) — ví dụ: `房`, `度`, `店`, `病`
- `⿹` (U+2FF9): Cấu trúc Góc trên phải (Surround from Upper Right) — ví dụ: `句`, `包`
- `⿺` (U+2FFA): Cấu trúc Góc dưới trái (Surround from Lower Left) — ví dụ: `这`, `起`, `道`, `过`
- `⿻` (U+2FFB): Cấu trúc Đan xen / Chồng chéo (Overlaid) — ví dụ: `中`, `重`

### 3.2. Tích hợp giao diện:
- Hiển thị trực quan trong **Word Inspector Popover** của Smart Reader khi người dùng nhấp vào bất kỳ chữ Hán nào.
- Hiển thị trong **Trang luyện viết (`WritingPage.jsx`)** và component `CharacterDetailCard.jsx`, kết hợp mẹo chiết tự và phân rã các bộ thủ cấu thành.

---

## 4. Luồng Bắt từ vựng vào Hàng đợi SRS (Vocabulary Capture)

1. Khi người học tra từ trên Smart Reader, nút **"Lưu vào Flashcard SRS"** sẽ:
   - Ghi nhận từ mới vào kho lưu trữ cục bộ thông qua `materialsStorage.js` (`saveCustomVocab`).
   - Kích hoạt sự kiện toàn cục `window.dispatchEvent(new CustomEvent('hanzigo_vocab_saved'))`.
   - Thưởng ngay **+10 XP** cho người học qua hệ thống Gamification.
   - Chuyển trạng thái nút thành `✓ Đã lưu vào Sổ tay`.
2. Từ vựng đã lưu được đồng bộ ngay lập tức vào **Trang Flashcard 3D (`VocabularyPage.jsx`)**, sẵn sàng cho các phiên ôn tập ngắt quãng theo thuật toán SuperMemo SM-2.

---

## 5. Kết quả Kiểm thử, Lint và Kích thước Bundle

### 5.1. Unit & Integration Tests
- **Bộ test cũ:** 556 tests — PASS 100%.
- **Bộ test mới Phase 9:**
  - `tests/chineseNlpEngine.test.js`: 21 tests — PASS 100%.
  - `tests/smartReader.test.js`: 7 tests — PASS 100%.
- **Tổng cộng kiểm thử toàn hệ thống:** **584/584 tests PASS** (0 failures, 0 skipped).

### 5.2. Linter (Oxlint)
- Các file mới và sửa đổi của Phase 9 (`ReaderPage.jsx`, `chineseNlpEngine.js`, `gradedReadersData.js`, `hanziDecomposition.js`, `CharacterDetailCard.jsx`): **0 errors, 0 warnings**.
- Toàn dự án: **0 errors**.

### 5.3. Build & Code-Splitting (Vite Production Build)
- `ReaderPage.jsx` được code-split riêng qua `React.lazy()` thành:
  `dist/assets/ReaderPage-zWmBe_2R.js: 106.74 kB (gzip: 38.31 kB)`
- Entry bundle chính (`index-CwYwiSA6.js`): chỉ **85.19 kB (gzip: 20.93 kB)**, hoàn toàn không bị phình to bởi phân hệ Reader.
- Không sử dụng bất kỳ native C++ addon nào, đảm bảo tương thích 100% với Vercel Serverless và trình duyệt di động.

---

## 6. Kết luận
Phase 9 đã hoàn thành xuất sắc toàn bộ các mục tiêu P0, P1, P2, P3 và Definition of Done. HanziGo hiện sở hữu công cụ đọc hiểu tiếng Trung thông minh chuẩn ngữ cảnh đầu tiên dành cho người Việt, kết hợp chặt chẽ giữa NLP, bài đọc phân cấp HSK, chiết tự IDS và hệ thống ghi nhớ dài hạn SRS SM-2.
