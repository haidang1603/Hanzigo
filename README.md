# 🐉 HanziGo - Nền Tảng Học Tiếng Trung & Hán Tự Toàn Diện

> **HanziGo** là ứng dụng web học tiếng Trung hiện đại, kết hợp phương pháp sư phạm chuẩn quốc tế (HSK 1 - HSK 6) với công nghệ trí tuệ nhân tạo (AI), hệ thống game hóa (Gamification) và kho tài liệu học tập phong phú.

---

## 📑 Mục Lục
1. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng)
2. [Tổng Hợp Tất Cả Tính Năng Trong Website](#-tổng-hợp-tất-cả-tính-năng-trong-website)
   - [1. Trang Chủ & Giới Thiệu (Home Page)](#1-trang-chủ--giới-thiệu-home-page)
   - [2. Bảng Điều Khiển Học Tập Cá Nhân (Dashboard)](#2-bảng-điều-khiển-học-tập-cá-nhân-dashboard)
   - [3. Lộ Trình Học HSK Chuẩn Quốc Tế (Roadmap & Lessons)](#3-lộ-trình-học-hsk-chuẩn-quốc-tế-roadmap--lessons)
   - [4. Học Từ Vựng Thông Minh & Flashcard 3D (Vocabulary)](#4-học-từ-vựng-thông-minh--flashcard-3d-vocabulary)
   - [5. Luyện Phát Âm & Nhận Diện Giọng Nói AI (Pronunciation)](#5-luyện-phát-âm--nhận-diện-giọng-nói-ai-pronunciation)
   - [6. Luyện Viết Chữ Hán & Bút Thuận Tương Tác (Writing)](#6-luyện-viết-chữ-hán--bút-thuận-tương-tác-writing)
   - [7. Luyện Đàm Thoại & Trợ Lý AI Song Ngữ (Conversation)](#7-luyện-đàm-thoại--trợ-lý-ai-song-ngữ-conversation)
   - [8. Cộng Đồng Học Viên & Thảo Luận (Community)](#8-cộng-đồng-học-viên--thảo-luận-community)
   - [9. Kho Tài Liệu & Giáo Trình Số (Materials Library)](#9-kho-tài-liệu--giáo-trình-số-materials-library)
   - [10. Trang Quản Trị Hệ Thống & Phân Quyền (Admin Portal & RBAC)](#10-trang-quản-trị-hệ-thống--phân-quyền-admin-portal--rbac)
   - [11. Hồ Sơ Cá Nhân & Hệ Thống Danh Hiệu (Profile & Gamification)](#11-hồ-sơ-cá-nhân--hệ-thống-danh-hiệu-profile--gamification)
   - [12. Đăng Nhập, Xác Thực & Đồng Bộ Đám Mây (Auth & Cloud Sync)](#12-đăng-nhập-xác-thực--đồng-bộ-đám-mây-auth--cloud-sync)
3. [Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Getting Started)](#-hướng-dẫn-cài-đặt--chạy-cục-bộ)
4. [Cấu Hình Cơ Sở Dữ Liệu Supabase (Database Setup)](#-cấu-hình-cơ-sở-dữ-liệu-supabase)

---

## 🛠️ Công Nghệ Sử Dụng

| Lĩnh vực | Công nghệ |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (Tốc độ biên dịch cực nhanh) |
| **Styling & Giao diện** | [Tailwind CSS](https://tailwindcss.com/) + Vanilla CSS, Glassmorphism, Dark Mode chuẩn |
| **Icon System** | [Lucide React](https://lucide.dev/) (Bộ icon vector sắc nét, tối ưu) |
| **Audio & Âm thanh** | Web Audio API + HTML5 Audio Synth (Hiệu ứng âm thanh học tập tương tác) |
| **Nhận diện giọng nói AI** | Web Speech API (SpeechRecognition & SpeechSynthesis chuẩn phát âm tiếng Trung Quốc ngữ) |
| **Bút thuận & Canvas** | HTML5 Canvas 2D tương tác + Hanzi Writer Vector Algorithm |
| **Cơ sở dữ liệu & Auth** | [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication, Cloud Storage) |
| **Lưu trữ Offline/Local** | LocalStorage Engine độc lập theo từng tài khoản người dùng (`getUserStorageKey`) |

---

## 🚀 Tổng Hợp Tất Cả Tính Năng Trong Website

### 1. Trang Chủ & Giới Thiệu (Home Page)
* **Hero Banner tương tác**: Giới thiệu tổng quan hệ thống HanziGo với hình ảnh sống động và lời kêu gọi hành động học tập trực tiếp.
* **Lộ trình HSK trực quan**: Tổng hợp các mốc trình độ từ Nhập môn Pinyin đến HSK 6 cao cấp.
* **Số liệu hệ thống theo thời gian thực**: Thống kê số lượng từ vựng, bài học, tài liệu và học viên tích cực.
* **Phím tắt điều hướng nhanh**: Dẫn thẳng vào bài học tiếp theo hoặc ôn tập từ vựng chỉ với 1 click.

---

### 2. Bảng Điều Khiển Học Tập Cá Nhân (Dashboard)
* **Lời chào cá nhân hóa**: Nhận diện tên học viên, cấp độ HSK đang theo học và ảnh đại diện.
* **Theo dõi Chuỗi ngày học liên tục (Streak 🔥)**: Ghi nhận và duy trì thói quen học tiếng Trung mỗi ngày; tự động cập nhật khi học viên hoàn thành bất kỳ hoạt động nào.
* **Hệ thống Điểm tích lũy (XP)**: Tính toán điểm kinh nghiệm chi tiết dựa trên: bài học hoàn thành (50 XP/bài), từ vựng đã nhớ (10 XP/từ), luyện phát âm và viết chữ.
* **Mục tiêu học tập hàng ngày (Daily Study Goal)**:
  * Cho phép tùy chỉnh mục tiêu học (10 phút, 15 phút, 30 phút, 45 phút, 60 phút mỗi ngày).
  * Đo lường thời gian và thanh tiến độ hoàn thành mục tiêu trong ngày.
* **Hàng đợi ôn tập ngắt quãng (Spaced Repetition Review Queue)**: Tự động gom các từ vựng người dùng đánh dấu "Cần ôn tập" lên đầu bảng để ôn luyện ngay.
* **Thanh tiến độ lộ trình chung**: Tính toán tỷ lệ % hoàn thành toàn bộ khóa học theo cấp độ của người dùng.

---

### 3. Lộ Trình Học HSK Chuẩn Quốc Tế (Roadmap & Lessons)
* **Phân cấp lộ trình chi tiết**:
  * **Nhập môn**: Bảng 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu, quy tắc biến điệu, 8 nét cơ bản, 7 quy tắc bút thuận và 20 bộ thủ cốt lõi.
  * **HSK 1 - Sơ cấp**: Chào hỏi, xưng hô, mua sắm, ngày tháng, gia đình, sở thích.
  * **HSK 2 - Sơ cấp nâng cao**: Đi lại, gọi món, thời tiết, hỏi đường, khám bệnh.
  * **HSK 3 - Trung cấp 1**: Du lịch tự túc, câu chữ 把, câu bị động chữ 被, luyện đề mô phỏng.
  * **HSK 4 - Trung cấp 2**: Phỏng vấn xin việc, công nghệ, thương mại sơ cấp.
  * **HSK 5 & HSK 6 - Cao cấp**: Thành ngữ 4 chữ (成语), phân tích báo chí, giao thương chuyên sâu.
* **Hệ thống Bài học tương tác đa dạng**:
  * Học lý thuyết & từ mới có kèm Pinyin, Audio phát âm và giải nghĩa.
  * Trắc nghiệm phản xạ nghĩa, chọn phiên âm đúng, ghép câu hoàn chỉnh.
  * Hoàn thành bài học nhận ngay 50 XP và mở khóa bài kế tiếp.
* **Tính năng tạo bài học mới**: Giảng viên / học viên có thể tự thêm bài học tùy chỉnh vào từng chặng lộ trình.

---

### 4. Học Từ Vựng Thông Minh & Flashcard 3D (Vocabulary)
* **Kho từ vựng 500+ từ chuẩn HSK**: Đầy đủ Chữ Hán giản thể, phiên âm Pinyin có dấu, âm Hán Việt, nghĩa tiếng Việt, cấp độ HSK, chủ đề và câu ví dụ song ngữ.
* **Chế độ Thẻ ghi nhớ 3D (3D Flashcard Mode)**:
  * Hiệu ứng lật thẻ 3D xoay chiều mượt mà.
  * Tích hợp nút phát âm giọng bản xứ chuẩn.
  * Nút đánh dấu: **"Chưa thuộc / Cần ôn"** (đưa vào hàng đợi Spaced Repetition) và **"Đã nhớ"** (cộng điểm XP).
* **Chế độ Lưới thẻ (Card Grid Mode)**: Xem nhiều thẻ từ vựng cùng lúc, hiển thị chi tiết âm Hán Việt và ví dụ minh họa.
* **Chế độ Danh sách (Table View Mode)**: Bảng tra cứu từ vựng chi tiết, dễ dàng duyệt và học tuần tự.
* **Chế độ Kiểm tra trắc nghiệm (Quiz Mode)**: Bài kiểm tra phản xạ nhanh 4 đáp án giúp củng cố trí nhớ dài hạn.
* **Bộ lọc & Tìm kiếm thông minh**:
  * Tìm kiếm tức thì theo chữ Hán, Pinyin hoặc nghĩa tiếng Việt.
  * Lọc theo cấp độ: *Nhập môn, HSK 1, HSK 2, HSK 3, HSK 4, HSK 5, HSK 6*.
  * Lọc theo trạng thái: *Tất cả*, *Đã thuộc*, *Cần ôn tập*.
* **Tự tạo từ vựng mới**: Hỗ trợ người dùng tự thêm chữ Hán, phiên âm, câu ví dụ và mẹo nhớ riêng.

---

### 5. Luyện Phát Âm & Nhận Diện Giọng Nói AI (Pronunciation)
* **Bảng thanh mẫu, vận mẫu & thanh điệu tương tác**:
  * 23 Thanh mẫu (b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s, y, w).
  * 24 Vận mẫu đơn và kép kèm âm uốn lưỡi Er.
  * Mô tả chi tiết khẩu hình miệng, độ mở hàm và vị trí đặt đầu lưỡi cho từng âm khó.
* **Trực quan hóa Cao độ Thanh điệu (Tone Pitch Curve Visualization)**:
  * Đồ thị cao độ trực quan cho cả 4 thanh (Thanh 1: cao bằng 55, Thanh 2: lên cao 35, Thanh 3: xuống trầm lên nhẹ 214, Thanh 4: rơi dứt khoát 51).
  * Quy tắc biến điệu hai thanh 3 và biến điệu chữ 不, 一.
* **Chấm điểm giọng nói AI (Speech Recognition)**:
  * Thu âm giọng đọc của học viên qua Micro và so khớp với thuật toán nhận diện giọng nói.
  * Đánh giá độ chính xác theo thang điểm %, phản hồi màu sắc (Xanh lá: Phát âm chuẩn, Vàng: Khá, Đỏ: Cần cải thiện).
  * Thưởng điểm XP khi đạt điểm phát âm tốt.
* **Thư viện mẫu câu luyện giọng**: Đa dạng các câu giao tiếp thực tế và hỗ trợ thêm từ/câu tự chọn.

---

### 6. Luyện Viết Chữ Hán & Bút Thuận Tương Tác (Writing)
* **Bảng vẽ Canvas kẻ ô Mễ tự (米字格)**:
  * Giả lập giấy tập viết chuẩn 8 hướng với các đường chéo và đường ngang dọc định hình chữ.
  * Hỗ trợ viết bằng chuột, bút cảm ứng stylus hoặc ngón tay trên màn hình cảm ứng.
* **Hoạt họa thứ tự nét thuận (Stroke Order Animation)**:
  * Từng nét chữ Hán được vẽ tự động từng bước theo thứ tự chuẩn.
  * Bảng hướng dẫn 8 nét cơ bản: *Ngang, Sổ, Phẩy, Mác, Hất, Gập, Móc, Điểm*.
  * 7 Quy tắc thuận bút vàng: *Trên trước dưới sau, Trái trước phải sau, Ngoài trước trong sau, Vào trước đóng sau...*
* **Chấm điểm tự động nét vẽ**: So khớp tỷ lệ bao phủ và hình khối nét vẽ của học viên so với chữ mẫu để cho điểm % chuẩn xác.
* **Thư viện chữ tập viết**: Tuyển tập các chữ Hán đẹp và thường gặp nhất theo các cấp độ HSK.
* **Thêm chữ Hán tùy chọn**: Cho phép nhập bất kỳ chữ Hán nào để mở bảng luyện viết và phân tích nét.

---

### 7. Luyện Đàm Thoại & Trợ Lý AI Song Ngữ (Conversation)
* **Kịch bản đàm thoại theo ngữ cảnh**:
  * Chào hỏi & Làm quen lần đầu
  * Mua sắm & Mặc cả tại chợ
  * Gọi món tại nhà hàng Trung Hoa
  * Hỏi đường & Đi taxi / tàu điện ngầm
  * Đặt phòng khách sạn & Thủ tục check-in
  * Du lịch & Khám phá danh lam
  * Phỏng vấn xin việc & Giới thiệu kinh nghiệm
* **Audio đàm thoại đa vai (A/B Dialogues)**: Nghe từng câu đối thoại của nhân vật với giọng đọc chuẩn bản ngữ.
* **Trợ lý AI tiếng Trung (AI Chinese Tutor)**:
  * Đặt câu hỏi và trò chuyện trực tiếp bằng tiếng Trung hoặc tiếng Việt.
  * Tự động phân tích ngữ pháp, phiên âm Pinyin, chiết tự chữ Hán và gợi ý cách trả lời tự nhiên.
  * Phát âm câu trả lời của AI và lưu lịch sử trò chuyện.

---

### 8. Cộng Đồng Học Viên & Thảo Luận (Community)
* **Bảng tin chia sẻ học tập**:
  * Đăng bài viết chia sẻ kinh nghiệm tự học, tài liệu hay, thắc mắc ngữ pháp.
  * Gắn thẻ chuyên mục (Hỏi đáp, Kinh nghiệm HSK, Văn hóa, Du học).
  * Thả tim (Like) và bình luận trao đổi sôi nổi giữa các học viên.
* **Bảng xếp hạng Vinh danh (Leaderboard)**:
  * Xếp hạng Top học viên theo Điểm tích lũy XP.
  * Xếp hạng Top học viên theo Chuỗi ngày học liên tục (Streak).
  * Vinh danh huy hiệu Top 1, Top 2, Top 3 hàng tuần.
* **Thử thách học tập & Sự kiện**: Các mục tiêu chung giúp thúc đẩy động lực học tập mỗi ngày.

---

### 9. Kho Tài Liệu & Giáo Trình Số (Materials Library)
* **Kho sách & tài liệu học tiếng Trung phong phú**:
  * Giáo trình Chuẩn HSK 1 - HSK 6 (Standard Course BLCU) kèm File Audio MP3.
  * Sách Ngữ pháp tiếng Trung thực dụng & Bách khoa toàn thư ngữ pháp.
  * Trọn bộ 214 Bộ thủ chữ Hán Khang Hy (Hình vẽ chiết tự, Pinyin, Bút thuận).
  * Tệp vở tập viết chữ Hán ô Mễ tự khổ A4 vector độ nét cao (Bấm là in ra giấy hoặc lưu PDF ngay).
  * 500 Thành ngữ tiếng Trung thông dụng (成语 4 chữ).
  * Đề thi mô phỏng HSK các cấp kèm đáp án chi tiết.
* **Tính năng quản lý & tra cứu**:
  * Tải file trực tiếp hoặc mở liên kết Google Drive tốc độ cao.
  * Xem trước tài liệu trực tiếp trên trang.
  * Đánh dấu tài liệu yêu thích (Bookmark) để xem lại khi cần.
  * Lọc theo định dạng: *Sách PDF, File Audio MP3, Tiện ích tương tác, Bản in A4*.
  * Lọc theo cấp độ: *Nhập môn, HSK 1 -> HSK 6, Tất cả*.
  * Nút gửi yêu cầu tài liệu mới đến ban biên tập.

---

### 10. Trang Quản Trị Hệ Thống & Phân Quyền (Admin Portal & RBAC)
* **Hệ thống Phân quyền người dùng (Role-Based Access Control - RBAC)**:
  * 👑 **Quản trị viên (Admin)**: Toàn quyền quản trị, thay đổi vai trò người dùng, khóa/mở khóa tài khoản, duyệt tài liệu, thêm/sửa/xóa nội dung, sao lưu dữ liệu toàn hệ thống.
  * 🛡️ **Kiểm duyệt viên (Moderator)**: Quản lý kho tài liệu (thêm mới, chỉnh sửa, ghim nổi bật, ẩn/hiện), duyệt bài giảng & từ vựng; xem danh bạ học viên (không được phép đổi vai trò hoặc xóa tài khoản).
  * 🎓 **Học viên (Student / Khách)**: Hoàn toàn không nhìn thấy nút Admin trên Navbar và bị chặn truy cập bởi màn hình bảo mật nghiêm ngặt nếu cố tình nhập URL.
  * 👑 **Tài khoản Quản trị viên tối cao**: Gán cố định cho email `lehaidang16032006@gmail.com` (Toàn quyền quản trị, tự động cấp quyền khi đăng nhập).
* **Quản lý Học viên & Người dùng (User Management)**:
  * Danh bạ người dùng thật: Hiển thị Avatar, Họ tên, Email, Cấp độ HSK, Chuỗi ngày (Streak), Điểm XP, Trạng thái hoạt động.
  * Không chứa tài khoản ảo / demo (toàn bộ dữ liệu phản ánh học viên thật hoặc tài khoản tự tạo).
  * Thao tác trực tiếp: Đổi vai trò (Thăng cấp Admin / Chuyển Mod / Học viên), Khóa / Mở khóa tài khoản, Chỉnh sửa thông tin học viên, Xóa tài khoản.
  * Tạo tài khoản học viên mới với form đầy đủ thông tin.
* **Quản lý Kho tài liệu (Materials Management)**:
  * Thêm tài liệu mới / Chỉnh sửa tài liệu: Tiêu đề, danh mục, cấp độ, link tải Drive, mô tả, định dạng, tác giả, tags.
  * **Ghim nổi bật (⭐ Featured)**: Đưa tài liệu quan trọng lên đầu danh sách cho toàn bộ học viên.
  * **Ẩn / Hiện tài liệu (👁️‍🗨️ Visibility Toggle)**: Tạm ẩn tài liệu đang soạn thảo mà không cần xóa.
  * Mở kiểm tra liên kết tải trực tiếp, xóa tài liệu hoặc khôi phục kho tài liệu mẫu chuẩn.
* **Quản lý Từ vựng & Bài giảng tùy chỉnh**: Thêm, sửa, duyệt và xóa các từ vựng/bài học tự biên soạn.
* **Sao lưu & Đồng bộ hệ thống (Backup JSON)**: Xuất toàn bộ dữ liệu (Người dùng, Tài liệu, Từ vựng, Bài giảng) ra một file JSON duy nhất để lưu trữ an toàn.

---

### 11. Hồ Sơ Cá Nhân & Hệ Thống Danh Hiệu (Profile & Gamification)
* **Quản lý thông tin cá nhân**:
  * Tùy chỉnh Họ và tên hiển thị, Trình độ HSK mục tiêu, Tiểu sử giới thiệu ngắn (Bio).
  * **Tải ảnh đại diện tùy chỉnh (Upload Avatar)** từ máy tính cá nhân; ảnh được lưu trữ bền vững và hiển thị trên toàn bộ ứng dụng.
  * Bộ sưu tập avatar linh vật có sẵn: *Gấu trúc 🐼, Hổ dũng 🐯, Rồng vàng 🐲, Học sĩ 🎓, Đại Thánh 🐒...*
* **Bảo toàn điểm số & Tiến độ độc lập 100%**:
  * Mỗi tài khoản có hệ thống lưu trữ riêng biệt (`getUserStorageKey`), đảm bảo điểm XP, chuỗi ngày Streak, danh sách từ đã thuộc, lịch sử phát âm và luyện viết **hoàn toàn độc lập**, không bị gộp hay trùng lặp giữa các tài khoản khác nhau.
* **Bộ sưu tập Danh hiệu (Achievements)**: Tự động mở khóa các danh hiệu danh giá khi người dùng đạt mốc học tập:
  * 🌟 *Khởi đầu nan*: Hoàn thành bài học đầu tiên
  * 📚 *Kho tàng Hán tự*: Thuộc 50 từ vựng
  * 🎙️ *Bản ngữ Bắc Kinh*: Đạt 10 bài luyện phát âm chuẩn
  * ✍️ *Thần bút thuận*: Hoàn thành 20 chữ viết tay
  * 🔥 *Kỷ luật thép*: Đạt chuỗi 7 ngày học liên tục
* **Cài đặt tiện ích**:
  * Bật/Tắt chế độ tối (Dark Mode / Light Mode).
  * Bật/Tắt hiệu ứng âm thanh thao tác (Sound Effects).
  * Cài đặt giờ nhắc nhở học tập hàng ngày.
  * Đăng xuất an toàn.

---

### 12. Đăng Nhập, Xác Thực & Đồng Bộ Đám Mây (Auth & Cloud Sync)
* **Đăng nhập & Đăng ký qua Email**: Đăng ký tài khoản với tên, email, mật khẩu và cấp độ ban đầu. Hỗ trợ cơ chế tự động khôi phục phiên đăng nhập khi Supabase ở chế độ xác thực email.
* **Đăng nhập hoàn chỉnh bằng Google (Google OAuth 2.0)**:
  * **Xác thực trực tiếp Google OAuth**: Bấm nút *Đăng nhập với tài khoản Google* chuyển hướng trực tiếp sang trang xác thực chính thức của Google (`accounts.google.com`), cho phép chọn tài khoản Gmail cá nhân.
  * **Tự động lấy thông tin từ Google**: Hệ thống tự động trích xuất Tên hiển thị (`full_name`) và Ảnh đại diện Google (`avatar_url`) lưu vào bảng `profiles` trên Supabase.
  * **Chế độ Dự phòng thông minh**: Nếu dự án Supabase chưa được dán Client ID/Secret từ Google Cloud Console, hệ thống tự động hiển thị bảng hướng dẫn cấu hình và cung cấp tùy chọn đăng nhập Gmail nhanh để không gián đoạn quá trình trải nghiệm.
  * **Bảo toàn vị trí trang (`redirectTo`)**: Khi đăng nhập Google thành công, người dùng được điều hướng về đúng trang đang học dở (ví dụ `#vocabulary`, `#materials`, `#dashboard`), không bị đưa về trang chủ.
* **Bảo toàn trạng thái trang khi tải lại (Persistent Navigation)**:
  * Đồng bộ tab hiện tại (`activeTab`) vào URL Hash (`#vocabulary`, `#pronunciation`, `#materials`, `#admin`...) và `localStorage`.
  * Khi bấm **F5 / Tải lại trang**, ứng dụng giữ nguyên chính xác trang bạn đang học và giữ nguyên phiên đăng nhập, **không bao giờ bị tự động đăng xuất hay tự nhảy về trang chủ**.

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu môi trường
* [Node.js](https://nodejs.org/) phiên bản 18.0 trở lên.
* Trình quản lý gói `npm` hoặc `yarn`.

### 2. Các bước cài đặt
```bash
# 1. Clone repository về máy tính
git clone https://github.com/haidang1603/Hanzigo.git

# 2. Di chuyển vào thư mục dự án
cd HanziGo

# 3. Cài đặt các thư viện phụ thuộc
npm install

# 4. Khởi chạy máy chủ phát triển (Development Server)
npm run dev
```

Sau khi chạy lệnh, truy cập trình duyệt tại địa chỉ: `http://localhost:5173/`

### 3. Đóng gói ứng dụng (Production Build)
```bash
npm run build
```
Mã nguồn sau khi biên dịch và tối ưu hóa sẽ nằm trong thư mục `dist/`, sẵn sàng triển khai lên Vercel, Netlify hoặc máy chủ riêng.

---

## 🗄️ Cấu Hình Cơ Sở Dữ Liệu Supabase

Ứng dụng đã được cấu hình sẵn kết nối tới cơ sở dữ liệu Supabase PostgreSQL. Để kích hoạt trọn vẹn toàn bộ các tính năng phân quyền (RBAC) và ghim tài liệu trên đám mây, hãy chạy đoạn mã SQL sau trong mục **SQL Editor** trên Supabase Dashboard:

```sql
-- 1. Bổ sung cột phân quyền và trạng thái tài khoản vào bảng profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Bổ sung cột ghim nổi bật và tạm ẩn vào bảng materials
ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- 3. (Tùy chọn) Gán quyền Quản trị viên (Admin) cho tài khoản chính của bạn:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your_email@gmail.com';
```

---

## 📜 Giấy Phép & Bản Quyền

Dự án được phát triển và duy trì bởi **HanziGo Team**. Toàn bộ tài liệu giáo trình và từ điển được trích xuất từ các nguồn học thuật chuẩn HSK và Khổng Tử Học Viện vì mục đích giáo dục phi thương mại.
