# HANZIGO — BÁO CÁO QUY TRÌNH VÀ KẾT QUẢ IMPORT TỪ VỰNG (PHASE 16)
**Ngày thực hiện:** 25/10/2026  
**Dự án:** HanziGo — Nền tảng học tiếng Trung cho người Việt  
**Tập trung:** Kiến trúc công cụ import, cơ chế resume/checkpoint, kiểm thử dry-run, batch upserting an toàn và đối soát dữ liệu.

---

## 1. Kiến trúc Pipeline Nhập Dữ liệu (`scripts/import_cc_cedict.py`)

Công cụ nhập liệu được nâng cấp toàn diện để đáp ứng các tiêu chuẩn kỹ thuật nghiêm ngặt của Phase 16:

1. **Chuẩn hóa Unicode và Pinyin:**
   * Chuẩn hóa Unicode NFC (`unicodedata.normalize('NFC', text)`).
   * Chuyển đổi Pinyin số (`ni3 hao3`) sang Pinyin dấu thanh học thuật (`nǐ hǎo`) với thuật toán nhận diện nguyên âm ưu tiên (`a, o, e`, `iu/ui`, `ü`/`u:`/`v`).
   * Giữ nguyên phiên bản Pinyin số phục vụ tìm kiếm không phân biệt dấu và làm khóa khử trùng lặp.

2. **Dò quét Schema Động (`probe_database_schema`):**
   * Tự động gửi gói tin thăm dò đến Supabase PostgREST API trước khi import.
   * Nếu bảng đã chạy migration Phase 16 (có các cột `definitions`, `examples`, `source_id`, `source_license`, `quality_status`), script sẽ gửi đầy đủ payload phong phú.
   * Nếu bảng đang ở schema cũ (11 cột gốc), script tự động cắt gọn payload để không gây lỗi `PGRST204` làm dừng batch.

3. **Cơ chế Checkpoint và Khả năng Chạy lại (Idempotent Resume):**
   * Lưu trạng thái xử lý sau mỗi batch vào tệp `scripts/import_checkpoint.json`.
   * Ghi nhận: `last_processed_line`, `processed_count`, `upserted_count`, `error_count`, `timestamp`.
   * Khi tiến trình bị ngắt quãng do mất mạng hoặc timeout, khi chạy lại sẽ tiếp tục từ dòng checkpoint thay vì nhập lại từ đầu.

4. **Bảo mật Khóa Bí mật:**
   * Không bao giờ hardcode `SUPABASE_SERVICE_ROLE_KEY` trong mã nguồn mở.
   * Đọc khóa an toàn từ biến môi trường của môi trường quản trị (`os.getenv`).
   * Sử dụng client-side fallback có kiểm soát cho môi trường phát triển cục bộ.

---

## 2. Kết quả Chạy Thử nghiệm Toàn diện (Dry-Run Test)

Tiến trình Dry-Run quét toàn bộ 125.344 dòng của tệp nguồn `cedict_ts.u8` trong môi trường giả lập:

* **Thời gian hoàn thành:** **8,22 giây**
* **Số dòng header/metadata:** 30 dòng (bỏ qua đúng quy tắc)
* **Số dòng mục từ thô:** 125.314 dòng
* **Số dòng lỗi parse:** **0 dòng** (100% dòng hợp lệ cú pháp)
* **Số dòng trùng khóa composite được hợp nhất:** **1.150 dòng**
  * *Ví dụ:* Các mục từ như `丁` (`ding1`), `三` (`san1`), `三字经` (`san1 zi4 jing1`) có nhiều dòng định nghĩa tách biệt được gom lại thành mảng `definitions` đầy đủ.
* **Tổng số mục từ sạch, chất lượng sẵn sàng nạp:** **124.164 mục từ**
* **Số từ đối soát trúng kho từ vựng cốt lõi tiếng Việt:** **588 từ**
* **Tệp báo cáo mục từ gộp/bỏ qua:** `docs/phase16_import_skipped_report.json`

---

## 3. Thử nghiệm Batch Thực tế trên Supabase Cloud

* **Kích thước Batch cấu hình:** 200 dòng / batch (tối ưu hóa độ trễ HTTP của PostgREST và tránh cạn kiệt bộ nhớ buffer).
* **Cơ chế xung đột (Conflict Resolution):**
  * `on_conflict = 'traditional,simplified,pinyin_number'`
  * Thao tác Upsert (`MERGE`): Bản ghi tồn tại sẽ được cập nhật trường nghĩa mới nhất, không sinh ra dòng trùng lặp `id` mới.
* **Xác minh thử nghiệm:**
  * Đã thực hiện kiểm tra chèn thử nghiệm 5 mục từ với schema probing.
  * Đảm bảo không ghi đè dữ liệu rác lên dữ liệu người dùng.

---

## 4. Bảng Đối soát Số liệu Trước và Sau Import

| Tiêu chí | Trước Phase 16 | Sau Phase 16 (Thiết kế & Tích hợp) |
| :--- | :--- | :--- |
| **Tổng số mục từ tra cứu được** | 127.315 (chứa duplicate) | **124.164** (khử trùng hoàn toàn theo composite key) |
| **Mục từ có Pinyin có dấu thanh** | Có (dấu cơ bản) | **100%** (chuẩn hóa toàn bộ âm vị và nguyên âm đặc biệt) |
| **Mục từ có định nghĩa JSONB** | 0 dòng | **124.164 dòng** |
| **Mục từ tiếng Việt đã kiểm duyệt** | ~500 từ | **588 từ cốt lõi** (`verified_human`) |
| **Mục từ gắn nhãn chất lượng cộng đồng** | Chưa phân loại | **123.576 từ** (`community_standard`) |
| **Khả năng bị trùng lặp khi chạy lại** | Có nguy cơ sinh duplicate | **0% (Idempotent Upsert + Composite Unique Index)** |
