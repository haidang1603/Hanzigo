# HANZIGO — BÁO CÁO NGUỒN DỮ LIỆU VÀ GIẤY PHÉP BẢN QUYỀN (PHASE 16)
**Ngày thực hiện:** 25/10/2026  
**Dự án:** HanziGo — Nền tảng học tiếng Trung cho người Việt  
**Tập trung:** Xác minh nguồn gốc, điều kiện phân phối, ghi nhận bản quyền và chính sách xử lý gỡ bỏ dữ liệu.

---

## 1. Nguồn Dữ liệu CC-CEDICT

### 1.1. Thông tin chung
* **Tên tập dữ liệu:** CC-CEDICT (Chinese-English Community Dictionary)
* **Phiên bản:** Release định kỳ từ MDBG
* **Tệp dữ liệu cục bộ:** `scripts/cedict_1_0_ts_utf-8_mdbg/cedict_ts.u8`
* **URL chính thức:** [https://www.mdbg.net/chinese/dictionary?page=cedict](https://www.mdbg.net/chinese/dictionary?page=cedict)
* **Định dạng tệp:** Văn bản thuần mã hóa UTF-8 không BOM (UNIX line endings).

### 1.2. Giấy phép Bản quyền & Điều kiện Phân phối
* **Giấy phép:** **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**
* **URL giấy phép:** [https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0/)
* **Điều kiện bắt buộc:**
  1. **Attribution (Ghi nhận tác giả):** HanziGo ghi nhận rõ ràng sự đóng góp của dự án CC-CEDICT và cộng đồng MDBG trong phần giới thiệu từ điển và trang bản quyền.
  2. **ShareAlike (Chia sẻ tương tự):** Nếu chỉnh sửa hoặc tạo sản phẩm phái sinh từ CC-CEDICT, các dữ liệu từ điển phái sinh được phân phối dưới giấy phép tương thích.
  3. **Không áp đặt các rào cản kỹ thuật trái phép:** Không sử dụng các biện pháp kỹ thuật số DRM để ngăn chặn quyền tự do được cấp phép.

### 1.3. Ghi công hiển thị trong Giao diện HanziGo
Trong chân trang (Footer), màn hình `Chi tiết từ vựng`, và `Cài đặt Bản quyền`, HanziGo hiển thị thông báo ghi công rõ ràng:
> *"Kho từ điển mở rộng tích hợp dữ liệu từ dự án CC-CEDICT thuộc bản quyền của MDBG và các tác giả đóng góp, được cấp phép theo Creative Commons Attribution-ShareAlike 4.0 International License."*

---

## 2. Nguồn Dữ liệu Nội bộ HanziGo Core

* **Tên tập dữ liệu:** HanziGo Curated Core Vocabulary
* **Vị trí tệp:** `src/data/chineseData.js`, `src/data/curriculumLessons.js`, `src/data/curriculumLessonsHsk4to6.js`
* **Số lượng:** ~588 từ trọng tâm (HSK 1 - HSK 4) kèm bộ 1.000 câu hỏi bài tập và đề thi mô phỏng.
* **Bản quyền:** Thuộc sở hữu nội bộ của dự án HanziGo (HanziGo Educational Proprietary / Open Education).
* **Đặc tính dữ liệu:** Đã được kiểm duyệt thủ công bởi đội ngũ sư phạm, bao gồm đầy đủ chữ Hán, Pinyin, Âm Hán-Việt, Nghĩa tiếng Việt, ví dụ câu thực tế và chiết tự bộ thủ.

---

## 3. Chính sách Xử lý Yêu cầu Bản quyền và Gỡ bỏ Dữ liệu (Takedown Policy)

HanziGo tuân thủ các quy tắc đạo đức dữ liệu và quyền tác giả:
1. **Tiếp nhận phản ánh:** Mọi yêu cầu đính chính nghĩa, phát âm hoặc gỡ bỏ mục từ có thể được gửi về qua kênh `support@hanzigo.edu.vn` hoặc tạo Issue trên kho mã nguồn GitHub [https://github.com/haidang1603/Hanzigo.git](https://github.com/haidang1603/Hanzigo.git).
2. **Quy trình xử lý:**
   * Trong vòng 48 giờ: Tạm thời ẩn mục từ hoặc đính chính thông tin bị khiếu nại trong cơ sở dữ liệu.
   * Cập nhật bản vá định kỳ thông qua quy trình migrate không gián đoạn dịch vụ.
3. **Tuyệt đối không sao chép dữ liệu từ các nguồn thương mại đóng:** HanziGo không cào dữ liệu từ các ứng dụng từ điển thương mại có phí hoặc vi phạm điều khoản dịch vụ của bên thứ ba.
