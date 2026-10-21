# HANZIGO — CONTENT & ASSET LICENSE REGISTER
## Phase 6.6: Intellectual Property, Licensing, Attribution & Usage Inventory

**Tài liệu:** Sổ bộ Kiểm kê Bản quyền & Giấy phép Tài nguyên  
**Phiên bản:** 1.0 (Audit Độc lập Trước Phát hành Public)  
**Ngày kiểm toán:** 20/10/2026  
**Đơn vị vận hành:** Dự án Học Tiếng Trung HanziGo  
**URL Hệ thống:** [https://hanzigo-xi.vercel.app/](https://hanzigo-xi.vercel.app/)  
**Mã nguồn:** [https://github.com/haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  

---

### 1. NGUYÊN TẮC BẢN QUYỀN & CHÍNH SÁCH BẢO HỘ

1. **Không tự suy diễn quyền tái phân phối:** Mọi tài nguyên không có giấy phép rõ ràng (unspecified license) phải được phân loại `NOT VERIFIED` hoặc `PARTIAL` và yêu cầu xác minh trước khi sử dụng thương mại.
2. **Ưu tiên Open Educational Resources (OER):** Toàn bộ học liệu tham khảo được cấp phép mở (Creative Commons, MIT, Apache 2.0, SIL OFL) hoặc dẫn chiếu siêu dữ liệu (metadata) trực tiếp tới nguồn phát hành chính thống.
3. **Tuyên bố bảo hộ nhãn hiệu HSK/CTI:** HanziGo ghi nhận nhãn hiệu "HSK", "HSKK" thuộc sở hữu của CTI (Chinese Testing International) / Hanban (Bộ Giáo dục Trung Quốc). Đề thi mô phỏng trên HanziGo chỉ phục vụ mục đích rèn luyện học thuật, hoàn toàn độc lập và không thay thế chứng chỉ chính thức.
4. **Không thu thập dữ liệu trái phép (Zero Web Scraping):** Tuyệt đối không trích xuất, sao chép mã nguồn, CSS hay dữ liệu từ các trang web thương mại như `bishun.net`.

---

### 2. BẢNG KIỂM KÊ TÀI NGUYÊN & GIẤY PHÉP (CONTENT LICENSE REGISTER)

| Asset / Resource | Nguồn dữ liệu | Chủ sở hữu | Giấy phép / Thỏa thuận | Cách ghi công (Attribution) | Trạng thái | Hành động đề xuất |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HanziWriter Engine (v3.7.3)** | [github.com/chanind/hanzi-writer](https://github.com/chanind/hanzi-writer) | Chanind | **MIT License** | Giữ nguyên copyright notice trong package.json và license file bundle | **PASS** | Tiếp tục sử dụng; đã có license MIT hợp lệ. |
| **Dữ liệu Vector Nét Chữ Hán (Make Me a Hanzi)** | jsDelivr CDN (`hanzi-writer-data@2.0`) / [skishore/makemeahanzi](https://github.com/skishore/makemeahanzi) | Shaun O'Leary, Arphic Technology & Cộng đồng | **Arphic Public License / LGPL** | Công bố tại `docs/HANZIGO_DICTIONARY_STROKE_DATA_LICENSES.md` | **PASS** | Tải On-Demand qua CDN; không nhúng hàng chục MB vào bundle chính. |
| **214 Bộ thủ Khang Hy (Kangxi Radicals)** | Unicode Standard CJK Radicals (U+2F00–U+2FD5) | Unicode Consortium / Di sản ngôn ngữ | **Public Domain / Open Lexical Standard** | Chú thích quy chuẩn Khang Hy tại trang Tra cứu Bộ thủ | **PASS** | Sử dụng toàn bộ 214 bộ thủ chuẩn Unicode 15.0+. |
| **Từ điển Giản - Phồn & Pinyin (CC-CEDICT)** | Dữ liệu đối chiếu âm Pinyin & nghĩa tiếng Anh/Việt | MDBG & Dự án CC-CEDICT | **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)** | Ghi công dự án CC-CEDICT trong Điều khoản sử dụng và tài liệu pháp lý | **PASS** | Đã ghi nhận trong Điều khoản sử dụng; tiếp tục cập nhật định kỳ. |
| **Kho ngữ liệu 60 bài học Lộ trình (curriculumLessons.js)** | Đội ngũ sư phạm HanziGo biên soạn | Lê Hải Đăng & HanziGo Contributors | **Bản quyền sở hữu riêng (Proprietary / CC BY-NC-SA 4.0)** | Ghi nhận bản quyền © 2026 HanziGo Việt Nam | **PASS** | Bảo hộ bản quyền nội dung tự biên soạn; miễn phí cho người học. |
| **Cấu trúc & Ma trận Đề thi HSK 1 - HSK 6 (hskStructureData.js)** | Chuẩn hóa theo Tiêu chuẩn Năng lực Giáo dục Quốc tế (GF0025-2021) | CTI (Chinese Testing International) / Hanban | **Educational Reference / Fair Use** | Ghi rõ nhãn hiệu thuộc CTI; gắn disclaimer đề thi mô phỏng trên từng giao diện | **PASS** | Đã thêm cảnh báo miễn trừ trách nhiệm tại mọi trang thi và Điều khoản dịch vụ. |
| **Câu hỏi Đề thi Mô phỏng HSK (hskExamsData.js)** | Đội ngũ giáo viên HanziGo tổng hợp và cấu trúc lại | HanziGo Team | **Educational Non-Commercial Use** | Ghi nhận nguồn mô phỏng phục vụ cộng đồng phi thương mại | **PASS** | Tiếp tục rà soát ngữ liệu; không dùng file audio có bản quyền thương mại chưa cấp phép. |
| **Thư viện Tài liệu & Học liệu mở (materialsStorage.js, 20+ PDFs/HTML)** | Kho tài liệu mở, Khổng Tử Học Viện, BLCU, và tài liệu tự soạn | Nhiều tác giả / Open Educational Resources | **OER / CC BY-NC-SA 4.0 / Fair Use** | Hiển thị nguồn gốc, nhà xuất bản, ghi chú kiểm định tại từng thẻ tài liệu | **PASS** | Chỉ lưu trữ siêu dữ liệu (metadata) và liên kết nguồn mở; không bán lại. |
| **Phông chữ: Noto Serif SC** | Google Fonts ([fonts.google.com](https://fonts.google.com/specimen/Noto+Serif+SC)) | Google Inc. & Adobe Systems | **SIL Open Font License 1.1 (OFL)** | Nhúng trực tiếp qua Google Fonts CDN với cờ crossorigin | **PASS** | Tự do sử dụng cho giao diện web và in ấn tài liệu A4. |
| **Phông chữ: Plus Jakarta Sans** | Google Fonts ([fonts.google.com](https://fonts.google.com/specimen/Plus+Jakarta+Sans)) | Tokotype (Gumpita Rahayu) | **SIL Open Font License 1.1 (OFL)** | Nhúng trực tiếp qua Google Fonts CDN | **PASS** | Tự do nhúng web thương mại và phi thương mại. |
| **Phông chữ: ZCOOL XiaoWei** | Google Fonts ([fonts.google.com](https://fonts.google.com/specimen/ZCOOL+XiaoWei)) | ZCOOL (Li Zhiqian) | **SIL Open Font License 1.1 (OFL)** | Nhúng trực tiếp qua Google Fonts CDN | **PASS** | Phông chữ tiêu đề chữ Hán nghệ thuật mở. |
| **Bộ Icon giao diện (lucide-react v1.48.0)** | [lucide.dev](https://lucide.dev) | Lucide Project Contributors | **ISC / MIT License** | Đóng gói qua npm dependency | **PASS** | Cấp phép mở toàn quyền sử dụng. |
| **Âm thanh hiệu ứng (Click, Success, Error)** | Sinh bằng Web Audio API Synthesizer (`utils/audio.js`) | HanziGo tự phát triển mã nguồn | **MIT / Public Domain** | Không dùng tệp âm thanh bên ngoài tải lậu | **PASS** | Thuần thuật toán âm thanh của trình duyệt, không có rủi ro bản quyền âm thanh. |
| **Công nghệ Giọng nói & Phát âm (Web Speech API)** | Web Speech Synthesis & Recognition chuẩn W3C | Trình duyệt người dùng (Google Chrome, Edge, Safari) | **Native Browser API** | Không lưu trữ file giọng nói của bên thứ ba | **PASS** | Không vi phạm bản quyền giọng đọc; người dùng dùng engine có sẵn của thiết bị. |
| **Logo & Đồ họa Vector (logo.svg, favicon.svg)** | Đồ họa vector hình chữ Hán cách điệu ô Mễ | HanziGo Design Team | **Proprietary (Bản quyền HanziGo)** | Đã tích hợp trong mã nguồn dự án | **PASS** | Tự thiết kế 100%, không sao chép thương hiệu khác. |
| **Thư viện WebRTC & LiveClassroom (@livekit/*)** | LiveKit Cloud SDK ([livekit.io](https://livekit.io)) | LiveKit, Inc. | **Apache 2.0 License** | Đóng gói qua npm package | **PASS** | Cấp phép chuẩn mã nguồn mở Apache 2.0. |
| **Supabase Client (@supabase/supabase-js)** | Supabase ([supabase.com](https://supabase.com)) | Supabase, Inc. | **MIT License** | Đóng gói qua npm package | **PASS** | Cấp phép mở MIT hợp lệ. |

---

### 3. QUY TRÌNH TIẾP NHẬN BÁO CÁO VI PHẠM BẢN QUYỀN (DMCA / NOTICE & TAKEDOWN)

Nếu bất kỳ cá nhân hoặc tổ chức sở hữu quyền tác giả phát hiện tài nguyên học thuật nào trên HanziGo bị nghi ngờ vi phạm bản quyền hoặc chưa được cấp phép thỏa đáng:
1. **Kênh tiếp nhận:** Gửi văn bản thông báo quyền sở hữu qua email: `lehaidang16032006@gmail.com`.
2. **Nội dung thông báo:**
   - Họ tên/Tổ chức sở hữu quyền tác giả hợp pháp.
   - Liên kết (URL) tài nguyên bị phản ánh trên HanziGo.
   - Bằng chứng quyền sở hữu trí tuệ hoặc chứng nhận đăng ký bản quyền.
3. **Thời hạn xử lý:** Ban Quản Trị HanziGo cam kết rà soát, phản hồi và **tạm ẩn/gỡ bỏ tài nguyên trong vòng 24 - 48 giờ làm việc** trong thời gian xác minh pháp lý.
