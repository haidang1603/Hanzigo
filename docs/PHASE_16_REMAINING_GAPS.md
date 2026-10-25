# HANZIGO — BÁO CÁO KHOẢNG TRỐNG VÀ KẾ HOẠCH BỔ SUNG (PHASE 16)
**Ngày thực hiện:** 25/10/2026  
**Dự án:** HanziGo — Nền tảng học tiếng Trung cho người Việt  
**Tập trung:** Nhận diện trung thực các hạn chế hiện tại, dữ liệu chưa xác minh, và lộ trình phát triển trong các giai đoạn tiếp theo.

---

## 1. Các Khoảng trống Dữ liệu Hiện tại (Honest Gap Analysis)

Để đảm bảo tính trung thực học thuật và không lừa dối người học, HanziGo công khai các điểm còn thiếu sót trong tập dữ liệu:

### 1.1. Nghĩa tiếng Việt cho từ vựng mở rộng (CC-CEDICT)
* **Hiện trạng:** Trong tổng số 124.164 mục từ CC-CEDICT, có **588 mục từ cốt lõi** có nghĩa tiếng Việt đầy đủ và đã được kiểm duyệt (`quality_status = 'verified_human'`).
* **Khoảng trống:** ~123.576 mục từ còn lại hiện chỉ có định nghĩa tiếng Anh nguyên bản từ CC-CEDICT (`quality_status = 'community_standard'`).
* **Nguyên tắc xử lý:** Hệ thống **tuyệt đối không dịch tự động hàng loạt bằng AI/Google Translate** rồi mạo nhận là bản dịch chính thức. Giao diện người dùng sẽ hiển thị nghĩa tiếng Anh kèm nhãn thông báo minh bạch, và khuyến khích người học tham khảo nghĩa học thuật.

### 1.2. Phân loại Cấp độ HSK 3.0 Mới
* **Hiện trạng:** Cột `hsk_level` hiện tại phản ánh chính xác theo khung HSK 2.0 (từ HSK 1 đến HSK 6) dựa trên kho dữ liệu giáo trình hiện có của HanziGo.
* **Khoảng trống:** Chưa đồng bộ hoàn toàn với danh mục 11.092 từ vựng theo Khung tiêu chuẩn HSK 3.0 mới (HSK 7-9 và phân cấp lại từ HSK 1-6).
* **Kế hoạch:** Sẽ bổ sung trường `hsk_3_level` khi có bộ dữ liệu công bố chính thức từ Ủy ban Khảo thí Ngôn ngữ Trung Quốc (Hanban / CTI).

### 1.3. Âm Hán-Việt cho toàn bộ 120.000 từ
* **Hiện trạng:** Các từ đơn chữ Hán và các từ vựng cốt lõi có âm Hán-Việt chính xác (ví dụ: `学习` -> `HỌC TẬP`).
* **Khoảng trống:** Một số thành ngữ, thuật ngữ hiện đại (IT, y khoa) và tiếng lóng trong CC-CEDICT chưa có âm Hán-Việt chuẩn hóa.

---

## 2. Các Rủi ro Kỹ thuật Cần Giám sát

1. **Supabase Migration Pending on Production:**
   * Script migration `supabase/migrations/20261025_phase16_large_scale_vocabulary.sql` đã được viết và kiểm thử cục bộ.
   * Để áp dụng lên Supabase Production, quản trị viên dự án cần chạy tệp SQL migration này trong Supabase SQL Editor.
   * *Ghi chú an toàn:* Importer script và frontend service đã được thiết kế cơ chế dò quét động (`probe_database_schema`), tự động thích ứng an toàn cả khi migration chưa được chạy trên môi trường production.

2. **Dung lượng Database Index:**
   * Khi kích hoạt 5 chỉ mục GIN trigram trên bảng 120.000 dòng, dung lượng lưu trữ index trên PostgreSQL sẽ tăng khoảng ~35 - 50 MB.
   * Cần đảm bảo tài khoản Supabase có hạn mức dung lượng đĩa phù hợp (gói Free hỗ trợ tới 500 MB).

---

## 3. Lộ trình Hoàn thiện Tiếp theo (Next Steps & Roadmap)

1. **Giai đoạn cộng đồng đóng góp (Crowdsourced Verification):**
   * Xây dựng tính năng cho phép giáo viên tiếng Trung và người học uy tín đề xuất bản dịch tiếng Việt cho các từ CC-CEDICT đang có nghĩa tiếng Anh.
   * Quy trình duyệt 2 bước trước khi chuyển trạng thái thành `verified_human`.

2. **Tích hợp Phát âm Azure TTS chất lượng cao cho toàn bộ 120.000 từ:**
   * Tận dụng `azureTtsProxy` đã kiểm thử thành công trong Phase 14 để phát âm chuẩn xác ngữ điệu tiếng Trung phổ thông cho mọi mục từ tra cứu.

3. **Mở rộng Kho Đề thi và Flashcard SRS theo Chuyên đề:**
   * Cho phép người học phân loại từ vựng thành các sổ tay từ vựng chuyên ngành (Thương mại, Du lịch, CNTT, HSK 1-6) để ôn tập định kỳ theo thuật toán SuperMemo-2 / SM-2.
