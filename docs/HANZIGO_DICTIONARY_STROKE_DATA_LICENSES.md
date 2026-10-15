# HANZIGO — CHINESE CHARACTER DICTIONARY & STROKE WRITING
## Data Sources, Licensing, Attribution & Update Policies

Tài liệu này xác định nguồn gốc, giấy phép sử dụng, trách nhiệm ghi công (Attribution), cách thức xử lý dữ liệu và quy trình cập nhật cho module **Chinese Character Dictionary & Interactive Stroke Writing** trên nền tảng HanziGo.

---

### 1. NGUỒN DỮ LIỆU & GIẤY PHÉP PHÁP LÝ

Module sử dụng kết hợp các nguồn dữ liệu mã nguồn mở và chuẩn mực ngôn ngữ được cấp phép hợp pháp:

| Thành phần | Nguồn dữ liệu | Phiên bản / Thời điểm | Giấy phép áp dụng | Quyền sử dụng & Ràng buộc |
| :--- | :--- | :--- | :--- | :--- |
| **Thư viện điều khiển nét & Quiz** | [HanziWriter](https://github.com/chanind/hanzi-writer) (bởi Chanind) | `v3.7.3` | **MIT License** | Tự do sử dụng, chỉnh sửa, tích hợp vào sản phẩm thương mại hoặc phi thương mại. Yêu cầu giữ thông cáo bản quyền MIT gốc. |
| **Dữ liệu hoạt ảnh thứ tự nét (SVG & Medians)** | [Make Me a Hanzi (MMAH)](https://github.com/skishore/makemeahanzi) / `hanzi-writer-data` | `2.0` (CDN jsdelivr) | **Arphic Public License / LGPL** | Dữ liệu hình học nét chữ được sinh từ bộ font mã nguồn mở Arphic. Miễn phí cho giáo dục và nghiên cứu; tuân thủ điều khoản chia sẻ và ghi công tác giả Shaun O'Leary & cộng đồng. |
| **Chuẩn mực 214 Bộ thủ Khang Hy** | Kangxi Radicals (Unicode Standard CJK Radicals U+2F00–U+2FD5) | Unicode 15.0+ | **Public Domain / Open Lexical Standard** | Tiêu chuẩn từ điển chữ Hán truyền thống 214 bộ thủ, phiên âm Hán Việt và nghĩa ngữ dụng tiếng Việt do đội ngũ sư phạm HanziGo biên tập và hiệu đính. |
| **Từ vựng & Ngữ liệu HSK HanziGo** | HanziGo Curated Lexicon (`chineseData.js`, `curriculumLessons.js`) | HanziGo 2026 Core Edition | **Bản quyền sở hữu HanziGo (Proprietary)** | Biên tập riêng cho người Việt học tiếng Trung, bao gồm phiên âm Pinyin chuẩn, giải nghĩa Hán Việt, câu ví dụ thực tế và mẹo nhớ chiết tự. |
| **Từ điển đối chiếu Giản - Phồn & Pinyin** | Dựa trên tập dữ liệu chuẩn hóa mở CC-CEDICT (MDBG) & Unihan | Phiên bản cập nhật thường kỳ | **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)** | Cho phép sử dụng và chuyển thể với điều kiện ghi công đúng và cấp phép tương tự cho các phái sinh. |

---

### 2. TUYÊN BỐ KHÔNG SAO CHÉP ĐỘC QUYỀN TỪ BISHUN.NET

- **Phân tích trải nghiệm**: HanziGo chỉ tham khảo mô hình tra cứu trực quan và bố cục ô Mễ/Điền (Tianzige/Mizige) để tối ưu hóa trải nghiệm người học Việt Nam.
- **Không trích xuất (Scraping)**: HanziGo **hoàn toàn không tải hàng loạt, không trích xuất trái phép, không sao chép mã nguồn, CSS hoặc bất kỳ tài nguyên độc quyền nào** từ `bishun.net`.
- **Tự phát triển 100%**: Toàn bộ kiến trúc logic tra cứu, chuẩn hóa Pinyin không dấu, bộ lọc bộ thủ, thuật toán phân rã thành phần và giao diện người dùng được xây dựng độc lập phù hợp với hệ thống HanziGo.

---

### 3. NGUYÊN TẮC XỬ LÝ DỮ LIỆU CHỮ HÁN

1. **Chữ Giản thể (Simplified) & Phồn thể (Traditional)**:
   - Mặc định ưu tiên chữ Hán Giản thể theo chuẩn giáo trình HSK phổ thông hiện nay.
   - Khi có dữ liệu phồn thể tương ứng (ví dụ: 汉 ↔ 漢, 学 ↔ 學, 国 ↔ 國), hiển thị rõ ràng ký tự phồn thể trong thẻ đối chiếu để học viên nhận diện.
   - Nếu không có biến thể phồn thể (chữ vốn là đơn thể hoặc giản thể trùng dạng), hệ thống không tạo dữ liệu giả mà để trống hoặc ghi chú tương đồng.

2. **Chính sách Không Bịa Đặt Dữ Liệu (Zero Hallucination)**:
   - Các trường thông tin (Số nét, Bộ thủ, Hán Việt, Nghĩa tiếng Việt, Cấu trúc chữ, Mẹo nhớ): Nếu chưa được kiểm chứng trong kho ngữ liệu, giao diện sẽ ẩn trường đó hoặc hiển thị trạng thái *"Đang cập nhật"* một cách minh bạch.
   - Hoạt ảnh nét thuận: Chỉ kích hoạt hoạt ảnh chuẩn khi có dữ liệu vector xác thực từ HanziWriter/Make Me a Hanzi. Nếu ký tự hiếm chưa có dữ liệu nét vector, hệ thống cung cấp chế độ **Bảng vẽ tự do trên ô Mễ tự** cùng hướng dẫn quy tắc bút thuận chung thay vì giả mạo nét động.

3. **Tải dữ liệu On-Demand & Tối ưu Băng thông**:
   - Dữ liệu nét vector của từng chữ Hán được tải bất đồng bộ (Lazy Load) theo nhu cầu tra cứu thông qua cơ chế nạp ký tự của HanziWriter (`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/{char}.json`).
   - Tuyệt đối không đóng gói hàng chục nghìn file JSON nét vào gói JavaScript ban đầu (`initial bundle`) của ứng dụng web.

---

### 4. QUY TRÌNH KIỂM TOÁN VÀ CẬP NHẬT DỮ LIỆU

1. **Cập nhật Từ vựng**: Định kỳ kiểm tra bổ sung các chữ Hán thuộc khung HSK 1 - 9 mới vào bộ lọc từ điển.
2. **Kiểm tra liên kết dữ liệu nét**: Tự động ghi nhận log các ký tự không tìm thấy dữ liệu nét trên CDN để bổ sung dữ liệu nội bộ (fallback local bundle).
3. **Phản hồi từ học viên**: Cho phép người học báo lỗi chiết tự hoặc âm Hán Việt để ban quản trị rà soát cập nhật qua Supabase.
