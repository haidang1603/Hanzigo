# HANZIGO — BÁO CÁO AUDIT DỮ LIỆU TỪ VỰNG TIẾNG TRUNG (PHASE 16)
**Ngày thực hiện:** 25/10/2026  
**Dự án:** HanziGo — Nền tảng học tiếng Trung cho người Việt  
**Tập trung:** Rà soát schema, hiện trạng dữ liệu Supabase, tập dữ liệu nguồn CC-CEDICT, và phân tích rủi ro toàn vẹn dữ liệu.

---

## 1. Hiện trạng Database & Schema Từ điển (Trước Import)

### 1.1. Bảng `public.dictionary_entries` hiện tại
Bảng `public.dictionary_entries` trong cơ sở dữ liệu Supabase phục vụ tính năng từ điển và tra cứu toàn cục:
* **Số lượng bản ghi hiện có trên Cloud:** 127.315 dòng.
* **Số cột gốc (11 cột):**
  * `id` (bigint / serial, Primary Key)
  * `simplified` (varchar)
  * `traditional` (varchar)
  * `pinyin_clean` (varchar)
  * `pinyin_tone` (varchar)
  * `pinyin_number` (varchar)
  * `vietnamese_meaning` (text)
  * `english_meanings` (text)
  * `hsk_level` (varchar)
  * `hanviet` (varchar)
  * `created_at` (timestamptz)

### 1.2. Vấn đề Duplicate trong dữ liệu cũ
Kiểm tra truy vấn phân tích phát hiện dữ liệu cũ chưa có Unique Constraint cấp độ phát âm:
* **Hiện tượng:** Cùng một từ `学习` xuất hiện 2 dòng (id: `1` có `hsk_level = 'HSK 1'`, id: `33772` có `hsk_level = 'HSK 1-6'`).
* **Nguyên nhân:** Thiếu ràng buộc `UNIQUE (traditional, simplified, pinyin_number)`.
* **Rủi ro đa âm (Polyphone):** Các từ đa âm như `行` (`xíng`: đi, được / `háng`: hàng, nghề) nếu chỉ deduplicate theo `simplified` sẽ làm mất nghĩa và phát âm hợp lệ.

### 1.3. Mở rộng Schema không phá vỡ tương thích (Backward-Compatible)
Migration `supabase/migrations/20261025_phase16_large_scale_vocabulary.sql` bổ sung 5 cột tiêu chuẩn:
1. `definitions JSONB DEFAULT '[]'::jsonb`: Danh sách các nét nghĩa và ngữ cảnh chi tiết.
2. `examples JSONB DEFAULT '[]'::jsonb`: Danh sách ví dụ kèm phiên âm và bản dịch.
3. `source_id VARCHAR(50) DEFAULT 'cc_cedict'`: Định danh nguồn dữ liệu.
4. `source_license VARCHAR(50) DEFAULT 'CC BY-SA 4.0'`: Giấy phép bản quyền phân phối.
5. `quality_status VARCHAR(30) DEFAULT 'community_standard'`: Phân loại chất lượng (`verified_human` đối với 500 từ cốt lõi HanziGo, `community_standard` đối với CC-CEDICT).

---

## 2. Thống kê Chi tiết Dữ liệu Nguồn CC-CEDICT

| Hạng mục | Số lượng | Ghi chú |
| :--- | :--- | :--- |
| **Tổng số dòng tệp nguồn (`cedict_ts.u8`)** | **125.344** | File UTF-8 chuẩn từ MDBG CC-CEDICT |
| **Dòng Header / Metadata chú thích** | **30** | Bắt đầu bằng ký tự `#` |
| **Dòng mục từ thô (Raw Entries)** | **125.314** | Tỷ lệ phân tích cú pháp hợp lệ: 100% |
| **Dòng lỗi cú pháp (Parse Errors)** | **0** | Cú pháp `[Traditional] [Simplified] [pinyin] /def1/def2/` |
| **Mục từ trùng khóa composite phát âm** | **1.150** | Trùng `(traditional, simplified, pinyin_number)` nhưng chia làm nhiều dòng theo họ/tên riêng |
| **Mục từ hợp nhất sau khi khử trùng** | **124.164** | Giữ toàn bộ nét nghĩa và hợp nhất vào mảng `definitions` |
| **Mục từ cốt lõi được đối soát tiếng Việt** | **588** | Khớp chính xác với kho HanziGo Core (`src/data/chineseData.js`) |
| **Mục từ giữ nguyên định dạng CC-CEDICT** | **123.576** | Tiếng Anh chuẩn xác, tiếng Việt giữ trống (không dịch máy bừa bãi) |

---

## 3. Phân tích Dữ liệu Thiếu & Bất thường (Missing & Anomalies)

1. **Nghĩa tiếng Việt (`vietnamese_meaning`):**
   * Tuân thủ nghiêm ngặt nguyên tắc **Không dịch tự động toàn bộ 120.000 từ rồi mạo nhận là đã kiểm duyệt**.
   * Chỉ 588 từ trọng tâm (HSK 1 đến HSK 4) có nghĩa tiếng Việt đã được biên tập và rà soát thủ công.
   * 123.576 từ còn lại hiển thị nghĩa tiếng Anh học thuật CC-CEDICT và phân loại `quality_status = 'community_standard'`.

2. **Cấp độ HSK (`hsk_level`):**
   * Chỉ các từ có bằng chứng học thuật trong giáo trình HanziGo và kho đề HSK chính thức mới được gán nhãn `HSK 1` đến `HSK 6`.
   * Các từ cổ, thành ngữ chuyên sâu hoặc địa danh trong CC-CEDICT không bị ép gán HSK giả tạo.

3. **Từ đa âm đa nghĩa (Polyphones):**
   * Script import và unique constraint phân biệt phát âm dựa trên `pinyin_number` (ví dụ: `chong2` vs `zhong4` cho `重`).
   * Không bao giờ gộp bừa chỉ dựa trên chữ Hán giản thể `simplified`.

---

## 4. Tách biệt Kho Dữ liệu Chung và SRS Cá nhân

* **Kho từ điển dùng chung:** Lưu tại bảng `public.dictionary_entries` (chỉ cho phép `SELECT` công khai, cấm mọi thao tác ghi/sửa từ phía anonymous/học viên).
* **Tiến độ học tập và Flashcard:** Lưu tại `user_vocabulary` và `user_srs_state` liên kết với `auth.uid()`.
* **Cơ chế thêm từ vào Flashcard:** Khi người học bấm `+ Thêm vào Flashcard SRS` trên từ điển, hệ thống chỉ lưu một tham chiếu bookmark nhẹ nhàng (`wordId` hoặc `hanzi`), tuyệt đối không copy nhân bản 120.000 dòng vào hồ sơ người dùng.
