// Helper for managing Documents, Materials, and Custom Content in HanziGo
import { triggerCloudSync } from '../supabase/services.js';

export const CURRENT_MATERIALS_VERSION = 'v2.1_academic';

export const DEFAULT_MATERIALS = [
  {
    id: 'mat-1',
    title: 'Giáo trình Chuẩn HSK 1 - Standard Course (Từ vựng, Ngữ pháp & Audio)',
    category: 'Giáo trình chuẩn',
    level: 'HSK 1',
    skills: ['Nghe hiểu', 'Đọc hiểu', 'Ngữ pháp', 'Từ vựng'],
    format: 'Trực tuyến & MP3',
    fileSize: '150 từ vựng cốt lõi',
    author: 'Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    publisher: 'BLCU Press & Hanban',
    language: 'Song ngữ Trung - Việt',
    license: 'Bản quyền Giáo trình (Trích dẫn học thuật)',
    verificationStatus: 'academic_reference',
    relatedLessonId: 'Module 1.1 - 1.4 (Bài 101-120)',
    verificationNotes: 'Giáo trình chuẩn mực quốc tế theo khung HSK 1, phù hợp cho người học nhập môn xây nền tảng.',
    description: 'Tài liệu học và tra cứu chuẩn HSK 1 chính thức. Bao gồm 150 chữ Hán, phát âm Audio bản ngữ, âm Hán Việt, câu ví dụ và bài tập thực hành theo giáo trình chuẩn.',
    downloadUrl: 'https://www.hsk.academy/en/hsk_1',
    sourceUrl: 'https://www.hsk.academy/en/hsk_1',
    tags: ['HSK 1', 'Giáo trình', 'Có Audio', 'Nhập môn', 'BLCU'],
    createdAt: '2026-03-01',
    downloadsCount: 1420,
    isFeatured: true
  },
  {
    id: 'mat-2',
    title: 'Giáo trình Chuẩn HSK 2 - Standard Course (Sách bài học & Từ vựng đàm thoại)',
    category: 'Giáo trình chuẩn',
    level: 'HSK 2',
    skills: ['Nói & Khẩu ngữ', 'Nghe hiểu', 'Giao tiếp', 'Từ vựng'],
    format: 'Trực tuyến & MP3',
    fileSize: '300 từ vựng đàm thoại',
    author: 'Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    publisher: 'BLCU Press & Hanban',
    language: 'Song ngữ Trung - Việt',
    license: 'Bản quyền Giáo trình (Trích dẫn học thuật)',
    verificationStatus: 'academic_reference',
    relatedLessonId: 'Module 2.1 - 2.4 (Bài 201-220)',
    verificationNotes: 'Nối tiếp HSK 1, trang bị kỹ năng đàm thoại đời sống, mua sắm và đi lại trôi chảy.',
    description: 'Tiếp nối HSK 1, trang bị thêm 150 từ vựng và các cấu trúc ngữ pháp đàm thoại sinh hoạt hàng ngày, mua sắm, thời tiết và giao thông kèm file nghe chuẩn.',
    downloadUrl: 'https://www.hsk.academy/en/hsk_2',
    sourceUrl: 'https://www.hsk.academy/en/hsk_2',
    tags: ['HSK 2', 'Giáo trình', 'Đàm thoại', 'Có Audio'],
    createdAt: '2026-03-05',
    downloadsCount: 1180,
    isFeatured: true
  },
  {
    id: 'mat-3',
    title: 'Giáo trình Chuẩn HSK 3 - Standard Course (Trọn bộ Trung cấp 1)',
    category: 'Giáo trình chuẩn',
    level: 'HSK 3',
    skills: ['Đọc hiểu', 'Ngữ pháp', 'Viết & Thuận bút', 'Tổng hợp'],
    format: 'Trực tuyến & MP3',
    fileSize: '600 từ vựng',
    author: 'Khổng Tử Học Viện & BLCU',
    publisher: 'BLCU Press',
    language: 'Song ngữ Trung - Việt',
    license: 'Bản quyền Giáo trình (Trích dẫn học thuật)',
    verificationStatus: 'academic_reference',
    relatedLessonId: 'Module 3.1 - 3.4 (Bài 301-320)',
    verificationNotes: 'Mốc chuyển mình lên Trung cấp, giúp học viên tự tin du lịch tự túc và làm việc cơ bản.',
    description: 'Chinh phục trình độ Trung cấp 1 với 600 từ vựng cốt lõi. Giúp bạn tự tin du lịch Trung Quốc tự túc, xử lý đặt phòng khách sạn, giao tiếp văn phòng và thi đậu HSK 3.',
    downloadUrl: 'https://www.hsk.academy/en/hsk_3',
    sourceUrl: 'https://www.hsk.academy/en/hsk_3',
    tags: ['HSK 3', 'Giáo trình', 'Trung cấp', 'Công việc'],
    createdAt: '2026-03-10',
    downloadsCount: 950,
    isFeatured: true
  },
  {
    id: 'mat-4',
    title: 'Cẩm Nang 214 Bộ Thủ Chữ Hán Khang Hy (Hình vẽ, Pinyin & Bút thuận)',
    category: 'Bộ thủ & Hán tự',
    level: 'Tất cả',
    skills: ['Viết & Thuận bút', 'Từ vựng', 'Chiết tự'],
    format: 'Tương tác & In PDF',
    fileSize: 'Trọn bộ 214 bộ thủ',
    author: 'Ban Học thuật HanziGo',
    publisher: 'HanziGo Research Studio',
    language: 'Song ngữ Trung - Việt',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 1.1 (Bài 102-104)',
    verificationNotes: 'Bảng đối chiếu 214 bộ thủ độc quyền, hỗ trợ in A4 vector và học qua âm Hán Việt.',
    description: 'Tài liệu chiết tự chữ Hán độc quyền với bảng tra cứu đầy đủ 214 bộ thủ, âm Hán Việt, phiên âm Pinyin, nét viết và các chữ Hán ví dụ tạo thành. Có nút in ra giấy hoặc lưu PDF.',
    downloadUrl: '/214-bo-thu-chu-han.html',
    sourceUrl: '/214-bo-thu-chu-han.html',
    tags: ['Bộ thủ', 'Chiết tự', 'Tập viết', 'Tượng hình'],
    createdAt: '2026-02-15',
    downloadsCount: 2850,
    isFeatured: true
  },
  {
    id: 'mat-5',
    title: 'Bách Khoa Toàn Thư Ngữ Pháp Tiếng Trung HSK 1–4 (Chinese Grammar Wiki)',
    category: 'Ngữ pháp chuyên sâu',
    level: 'HSK 1 - 4',
    skills: ['Ngữ pháp', 'Đặt câu', 'Cú pháp thực chiến'],
    format: 'Bách khoa Ngữ pháp',
    fileSize: '185 điểm ngữ pháp',
    author: 'AllSet Learning (John Pasden)',
    publisher: 'AllSet Learning Wiki Project',
    language: 'Song ngữ Trung - Anh / Việt',
    license: 'CC BY-NC-SA 3.0 (Creative Commons)',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 1.1 - 3.4 (Toàn diện ngữ pháp)',
    verificationNotes: 'Tài nguyên bách khoa ngữ pháp mở uy tín nhất thế giới, hỗ trợ tra cứu công thức và so sánh lỗi sai.',
    description: 'Bách khoa toàn thư ngữ pháp tiếng Trung uy tín nhất thế giới: Câu chữ 把, câu chữ 被, câu so sánh 比, trợ từ trạng thái 了/着/过, bổ ngữ kết quả và xu hướng kèm ví dụ chi tiết.',
    downloadUrl: 'https://resources.allsetlearning.com/chinese/grammar/HSK_1_grammar_points',
    sourceUrl: 'https://resources.allsetlearning.com/chinese/grammar/',
    tags: ['Ngữ pháp', 'Câu chữ 把', 'Song ngữ', 'HSK 1-4', 'Wiki mở'],
    createdAt: '2026-02-20',
    downloadsCount: 3100,
    isFeatured: true
  },
  {
    id: 'mat-6',
    title: 'Cổng Tải Đề Thi Thử HSK & Audio Chính Thức (Chinese Testing International)',
    category: 'Đề thi HSK',
    level: 'HSK 3',
    skills: ['Luyện thi HSK', 'Nghe hiểu', 'Đọc hiểu'],
    format: 'PDF + MP3 Chính thức',
    fileSize: 'Kho đề thi CTI',
    author: 'Trung tâm Khảo thí Quốc tế HSK (CTI chinesetest.cn)',
    publisher: 'Chinese Testing International / Hanban',
    language: 'Tiếng Trung Giản thể',
    license: 'Tài liệu Khảo thí Chính thức CTI (Tải tự học miễn phí)',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Module 3.4 (Bài 320 - Boss Challenge HSK 3)',
    verificationNotes: 'Đề thi thật và đề mô phỏng chuẩn 100% của cơ quan tổ chức khảo thí HSK quốc tế.',
    description: 'Kho đề thi mô phỏng và đề thi thật các kỳ thi HSK của đơn vị tổ chức thi chính thức CTI. Bao gồm đầy đủ đề thi PDF, đáp án và file nghe Audio chất lượng cao.',
    downloadUrl: 'https://www.chinesetest.cn/godownload.do',
    sourceUrl: 'https://www.chinesetest.cn/godownload.do',
    tags: ['Đề thi', 'HSK 3', 'Luyện thi', 'Có đáp án', 'CTI Official'],
    createdAt: '2026-03-12',
    downloadsCount: 890,
    isFeatured: true
  },
  {
    id: 'mat-7',
    title: 'Bộ Đề Thi Thử & Luyện Thi HSK 4 Chuẩn Mới (CTI Download Center)',
    category: 'Đề thi HSK',
    level: 'HSK 4',
    skills: ['Luyện thi HSK', 'Đọc hiểu', 'Viết & Thuận bút'],
    format: 'PDF + MP3',
    fileSize: 'Đề thi chuẩn quốc tế',
    author: 'Trung tâm Khảo thí Quốc tế HSK (chinesetest.cn)',
    publisher: 'Chinese Testing International',
    language: 'Tiếng Trung Giản thể',
    license: 'Tài liệu Khảo thí Chính thức CTI',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Mở rộng Level 4',
    verificationNotes: 'Đề thi rèn luyện kỹ năng đọc nghị luận ngắn và sắp xếp trật tự câu đạt điểm cao.',
    description: 'Tài liệu luyện thi HSK 4 chính thức với các dạng bài đọc hiểu nghị luận ngắn, sắp xếp trật tự câu và viết đoạn văn theo tranh mẫu đạt điểm cao.',
    downloadUrl: 'https://www.chinesetest.cn/godownload.do',
    sourceUrl: 'https://www.chinesetest.cn/godownload.do',
    tags: ['Đề thi', 'HSK 4', 'Luyện thi', 'Audio', 'CTI'],
    createdAt: '2026-03-15',
    downloadsCount: 760,
    isFeatured: false
  },
  {
    id: 'mat-8',
    title: 'Bảng Quy Tắc Chuyển Âm Hán Việt & Pinyin Tiếng Trung',
    category: 'Bộ thủ & Hán tự',
    level: 'Tất cả',
    skills: ['Từ vựng', 'Quy tắc chuyển âm', 'Chiết tự'],
    format: 'Trực tuyến & In A4',
    fileSize: 'Bảng quy tắc vàng',
    author: 'HanziGo Research Studio',
    publisher: 'HanziGo Academic',
    language: 'Song ngữ Trung - Việt',
    license: 'Tài liệu Giáo dục Độc quyền HanziGo',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 1.1 (Bài 101-105)',
    verificationNotes: 'Quy luật chuyển âm phụ âm đầu B, C, Đ, H, L, M, N... dựa trên Unicode Unihan kVietnamese.',
    description: 'Bí quyết giúp người Việt học tiếng Trung nhanh gấp 3 lần: Quy tắc đối chiếu phụ âm đầu (B, C, Đ, H, L, M, N, T, V...) và vần tương ứng sang thanh mẫu/vận mẫu Pinyin.',
    downloadUrl: '/bang-doi-chieu-han-viet.html',
    sourceUrl: '/bang-doi-chieu-han-viet.html',
    tags: ['Hán Việt', 'Bảng tra', 'Quy tắc', 'Tốc hành'],
    createdAt: '2026-02-10',
    downloadsCount: 4200,
    isFeatured: true
  },
  {
    id: 'mat-9',
    title: 'Vở Tập Viết Chữ Hán Chuẩn Ô Mễ Tự (Mizige A4 In Ngay & Lưu PDF)',
    category: 'Bộ thủ & Hán tự',
    level: 'Nhập môn',
    skills: ['Viết & Thuận bút', 'Tập viết ô mễ tự'],
    format: 'PDF In A4 Vector',
    fileSize: 'Khổ A4 chuẩn nét',
    author: 'HanziGo Studio',
    publisher: 'HanziGo Design',
    language: 'Tiếng Trung Giản thể',
    license: 'Giáo dục Mở HanziGo',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 1.1 (Bài 102-103)',
    verificationNotes: 'Khổ giấy in kẻ sẵn 8 hướng chuẩn Bộ Giáo dục Trung Quốc, tối ưu nét bút mực.',
    description: 'Tệp giấy tập viết kẻ sẵn ô mễ tự (米字格) 8 hướng chuẩn và dòng kẻ pinyin phía trên, độ nét vector cao khổ A4. Bấm vào là in ra giấy hoặc lưu PDF ngay lập tức.',
    downloadUrl: '/vo-tap-viet-chu-han-a4.html',
    sourceUrl: '/vo-tap-viet-chu-han-a4.html',
    tags: ['Tập viết', 'Ô mễ tự', 'In A4', 'Nét bút'],
    createdAt: '2026-01-25',
    downloadsCount: 5120,
    isFeatured: true
  },
  {
    id: 'mat-10',
    title: '500 Thành Ngữ Tiếng Trung Thông Dụng (Thành ngữ 4 chữ 成语 Wiktionary)',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 4 - 6',
    skills: ['Từ vựng', 'Thành ngữ', 'Văn hóa'],
    format: 'Từ điển Trực tuyến',
    fileSize: '500 thành ngữ',
    author: 'Wiktionary Appendix Team',
    publisher: 'Wikimedia Foundation',
    language: 'Song ngữ Trung - Anh / Việt',
    license: 'CC BY-SA 4.0 (Creative Commons)',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 3.4 (Bài 316) & HSK 4-6',
    verificationNotes: 'Tuyển tập thành ngữ 4 chữ quen thuộc trong phim ảnh, văn học và giao tiếp thường nhật.',
    description: 'Tra cứu 500 thành ngữ 4 chữ (成语) quen thuộc nhất trong đời sống, phim ảnh và văn học Trung Hoa kèm chữ Hán, Pinyin, giải nghĩa và ngữ cảnh sử dụng.',
    downloadUrl: 'https://en.wiktionary.org/wiki/Appendix:Mandarin_chengyu',
    sourceUrl: 'https://en.wiktionary.org/wiki/Appendix:Mandarin_chengyu',
    tags: ['Thành ngữ', 'Thành ngữ 4 chữ', 'Cao cấp', 'Văn hóa'],
    createdAt: '2026-03-18',
    downloadsCount: 680,
    isFeatured: false
  },
  {
    id: 'mat-11',
    title: 'Tiêu Chuẩn Đẳng Cấp Trình Độ HSK 3.0 (GF 0025-2021) - Bộ Giáo Dục TQ',
    category: 'Giáo trình chuẩn',
    level: 'Tất cả',
    skills: ['Tổng hợp đa kỹ năng', 'Chuẩn HSK 3.0'],
    format: 'Văn bản Quy chuẩn PDF',
    fileSize: 'Tiêu chuẩn quốc gia 3 giai đoạn 9 cấp',
    author: 'Bộ Giáo dục Trung Quốc (MOE) & Ủy ban Ngôn ngữ',
    publisher: 'Bộ Giáo dục Trung Quốc & CLEC',
    language: 'Tiếng Trung Giản thể',
    license: 'Văn bản Quy chuẩn Công khai Nhà nước (Public Regulatory Document)',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Toàn bộ Lộ trình (HSK 1-9)',
    verificationNotes: 'Văn bản gốc quy định chuẩn 4 chiều kích: m tiết, Chữ Hán, Từ vựng và Ngữ pháp.',
    description: 'Khung tiêu chuẩn quốc gia chính thức định hình hệ thống HSK 3.0 với cấu trúc 3 giai đoạn và 9 cấp độ. Cung cấp chuẩn định lượng chi tiết cho từng cấp bậc để học viên tham chiếu.',
    downloadUrl: 'http://www.moe.gov.cn/',
    sourceUrl: 'https://archive.org/details/gf-0025-2021',
    tags: ['HSK 3.0', 'GF 0025-2021', 'Tiêu chuẩn quốc gia', 'MOE'],
    createdAt: '2026-03-20',
    downloadsCount: 1540,
    isFeatured: true
  },
  {
    id: 'mat-12',
    title: 'Kho Âm Thanh Phát Âm Bản Xứ Mở Wikimedia Commons & Lingua Libre',
    category: 'Kỹ năng Nghe & Đọc',
    level: 'Nhập môn',
    skills: ['Nghe hiểu', 'Phát âm & Thanh điệu'],
    format: 'Tệp Âm thanh CC0',
    fileSize: '40.000+ tệp âm thanh OGG/MP3',
    author: 'Wikimedia Commons & Lingua Libre Community',
    publisher: 'Wikimedia Foundation',
    language: 'Tiếng Trung giọng chuẩn Bắc Kinh',
    license: 'CC BY-SA / CC0 Public Domain',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 1.1 (Bài 101 - 4 Thanh điệu)',
    verificationNotes: 'Kho âm thanh người bản xứ thu âm từng âm tiết và từ vựng HSK, miễn phí bản quyền.',
    description: 'Hơn 40.000 tệp âm thanh thu âm phát âm giọng người bản xứ Bắc Kinh chuẩn cho từng âm tiết pinyin đơn lẻ và các từ vựng chữ Hán thông dụng phục vụ luyện nghe phát âm chuẩn xác.',
    downloadUrl: 'https://commons.wikimedia.org/wiki/Category:Mandarin_pronunciation',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Mandarin_pronunciation',
    tags: ['Audio', 'Phát âm', 'Wikimedia', 'Pinyin', 'CC0'],
    createdAt: '2026-03-22',
    downloadsCount: 1890,
    isFeatured: true
  },
  {
    id: 'mat-13',
    title: 'Từ Điển Chữ Hán & Từ Vựng Mở CC-CEDICT (MDBG Database)',
    category: 'Bộ thủ & Hán tự',
    level: 'Tất cả',
    skills: ['Từ vựng', 'Tra cứu chữ Hán'],
    format: 'Từ điển Mở',
    fileSize: '120.000+ mục từ chi tiết',
    author: 'MDBG Community Project',
    publisher: 'MDBG / CC-CEDICT Team',
    language: 'Song ngữ Trung - Anh / Việt',
    license: 'CC BY-SA 4.0 (Creative Commons)',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Toàn bộ Lộ trình HSK 1-6',
    verificationNotes: 'Cơ sở dữ liệu từ điển mở lớn nhất thế giới, làm gốc cho hầu hết ứng dụng học tiếng Trung.',
    description: 'Từ điển Hán - Anh đồ sộ và đáng tin cậy nhất hiện nay với hơn 120.000 mục từ chữ Hán (cả Giản thể và Phồn thể), phiên âm Pinyin chuẩn có dấu thanh điệu và định nghĩa từ chi tiết.',
    downloadUrl: 'https://www.mdbg.net/chinese/dictionary?page=cc-cedict',
    sourceUrl: 'https://cc-cedict.org/wiki/',
    tags: ['Từ điển', 'CC-CEDICT', 'MDBG', 'Tra cứu', 'Nguồn mở'],
    createdAt: '2026-03-25',
    downloadsCount: 2100,
    isFeatured: false
  },
  {
    id: 'mat-14',
    title: 'Dữ Liệu Thuận Bút & Phân Tách Bộ Thủ Vector (MakeMeAHanzi & Hanzi Writer)',
    category: 'Bộ thủ & Hán tự',
    level: 'HSK 1 - 6',
    skills: ['Viết & Thuận bút', 'Vector nét bút'],
    format: 'Vector Thuận bút',
    fileSize: '9.000+ chữ Hán SVG',
    author: 'Shiro Kishore & Chanind',
    publisher: 'Open Source GitHub Project',
    language: 'Tiếng Trung Giản thể',
    license: 'Arphic Public License (APL) & MIT',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 1.1 (Bài 103) & Trang Writing',
    verificationNotes: 'Bộ vector động thứ tự nét bút chuẩn xác được nhúng trực tiếp trong tính năng Luyện viết.',
    description: 'Cơ sở dữ liệu đồ họa vector SVG quy chuẩn cho hơn 9.000 chữ Hán giản thể và phồn thể. Cung cấp chính xác: tọa độ nét vẽ, thứ tự thuận bút, phân tách bộ thủ và hướng nét bút.',
    downloadUrl: 'https://hanziwriter.org/',
    sourceUrl: 'https://github.com/skishore/makemeahanzi',
    tags: ['Thuận bút', 'SVG', 'MakeMeAHanzi', 'HanziWriter', 'Luyện viết'],
    createdAt: '2026-03-26',
    downloadsCount: 1670,
    isFeatured: false
  },
  {
    id: 'mat-15',
    title: 'Kho Bài Đọc Phân Cấp HSK 1–6 Có Audio & Pinyin (Mandarin Bean Graded Reader)',
    category: 'Kỹ năng Nghe & Đọc',
    level: 'HSK 1 - 6',
    skills: ['Đọc hiểu', 'Nghe hiểu', 'Từ vựng theo ngữ cảnh'],
    format: 'Bài đọc Tương tác',
    fileSize: 'Hàng trăm bài đọc phân cấp',
    author: 'Mandarin Bean Education Team',
    publisher: 'Mandarin Bean',
    language: 'Song ngữ Trung - Anh / Pinyin',
    license: 'Truy cập Tự do Miễn phí (Free Web Educational Access)',
    verificationStatus: 'curated',
    relatedLessonId: 'Module 2.1 - 3.4 (Luyện đọc hiểu)',
    verificationNotes: 'Nền tảng đọc hiểu phân cấp xuất sắc với tính năng bật tắt Pinyin và file nghe audio tiện lợi.',
    description: 'Thư viện bài đọc phân cấp chuẩn xác theo từng cấp độ từ HSK 1 đến HSK 6 với các mẩu truyện ngắn, tin tức văn hóa, câu chuyện danh ngôn và bài luận thực tế có file nghe audio kèm theo.',
    downloadUrl: 'https://mandarinbean.com/',
    sourceUrl: 'https://mandarinbean.com/',
    tags: ['Đọc hiểu', 'Graded Reader', 'Mandarin Bean', 'Có Audio', 'Bật tắt Pinyin'],
    createdAt: '2026-03-27',
    downloadsCount: 1350,
    isFeatured: true
  },
  {
    id: 'mat-16',
    title: 'Kịch Bản Đối Thoại Khẩu Ngữ Đời Sống Thực Tế (Mandarin Corner Dialogues)',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 1 - 4',
    skills: ['Nói & Khẩu ngữ', 'Nghe hiểu', 'Phản xạ giao tiếp'],
    format: 'Video & Audio MP3',
    fileSize: 'Kho đối thoại đời sống tự nhiên',
    author: 'Mandarin Corner Educational Project',
    publisher: 'Mandarin Corner',
    language: 'Tiếng Trung phổ thông có phụ đề',
    license: 'Truy cập Mở Miễn phí (YouTube/Web Free Access)',
    verificationStatus: 'curated',
    relatedLessonId: 'Module 2.1 (Bài 201-202: Ẩm thực & Đi lại)',
    verificationNotes: 'Video phỏng vấn đường phố và đối thoại tốc độ thực tế giúp người học quen ngữ điệu bản ngữ.',
    description: 'Hàng trăm video và audio hội thoại tiếng Trung tự nhiên theo tốc độ thực tế (Natural Speed) và tốc độ chậm dành cho người học HSK 1 đến HSK 5 có phụ đề 3 dòng Hanzi, Pinyin và bản dịch.',
    downloadUrl: 'https://mandarincorner.org',
    sourceUrl: 'https://www.youtube.com/@MandarinCorner',
    tags: ['Khẩu ngữ', 'Đàm thoại', 'Mandarin Corner', 'Video', 'Audio'],
    createdAt: '2026-03-28',
    downloadsCount: 1220,
    isFeatured: false
  },
  {
    id: 'mat-17',
    title: 'Phim Tình Huống Giao Tiếp Thực Tế CCTV "Happy Chinese" (快乐汉语)',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 1 - 3',
    skills: ['Nghe hiểu', 'Giao tiếp đời sống', 'Văn hóa'],
    format: 'Video Bài giảng',
    fileSize: 'Trọn bộ series kịch tình huống',
    author: 'Đài Truyền hình Trung ương Trung Quốc (CCTV)',
    publisher: 'CCTV International Education Channel',
    language: 'Song ngữ Trung - Việt / Anh',
    license: 'Truyền hình Công cộng Miễn phí (Public Educational Broadcast)',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Module 1.2, 2.1, 3.1',
    verificationNotes: 'Phim tình huống hài hước ngắn 15 phút/tập do CCTV sản xuất riêng cho người học tiếng Trung.',
    description: 'Series video kịch tình huống giao tiếp sinh động xoay quanh các chủ đề thực tế: mua sắm, gọi món, đi taxi, thuê nhà, kết bạn, du lịch, hỏi đường có hướng dẫn nhắc lại theo nhịp bản xứ.',
    downloadUrl: 'https://www.cctv.com/',
    sourceUrl: 'https://www.youtube.com/results?search_query=cctv+happy+chinese',
    tags: ['CCTV', 'Happy Chinese', 'Phim tình huống', 'Giao tiếp', 'Video'],
    createdAt: '2026-03-29',
    downloadsCount: 1480,
    isFeatured: false
  },
  {
    id: 'mat-18',
    title: 'Tuyển Tập Truyện Ngụ Ngôn & Đọc Hiểu Văn Hóa (Chinese Reading Practice)',
    category: 'Kỹ năng Nghe & Đọc',
    level: 'HSK 1 - 4',
    skills: ['Đọc hiểu', 'Văn hóa Trung Hoa'],
    format: 'Bài đọc Tương tác',
    fileSize: '300+ mẩu truyện ngụ ngôn & văn hóa',
    author: 'Chinese Reading Practice Project',
    publisher: 'CRP Open Blog',
    language: 'Song ngữ Trung - Anh',
    license: 'Truy cập Mở Miễn phí (Open Educational Access)',
    verificationStatus: 'curated',
    relatedLessonId: 'Module 2.3 & Module 3.1',
    verificationNotes: 'Các mẩu truyện ngụ ngôn và giai thoại ngắn có tính năng rê chuột xem pinyin tức thì.',
    description: 'Tuyển tập hơn 300 câu chuyện ngụ ngôn Trung Quốc cổ đại, truyện thiếu nhi và bài luận ngắn đương đại được phân theo 3 trình độ Sơ cấp, Trung cấp và Cao cấp có chú giải từ vựng tương tác.',
    downloadUrl: 'https://chinesereadingpractice.com/',
    sourceUrl: 'https://chinesereadingpractice.com/',
    tags: ['Đọc hiểu', 'Ngụ ngôn', 'CRP', 'Văn hóa', 'Hover Pinyin'],
    createdAt: '2026-03-30',
    downloadsCount: 990,
    isFeatured: false
  },
  {
    id: 'mat-19',
    title: '301 Câu Đàm Thoại Tiếng Hoa Kinh Điển (BLCU Press & Bản Dịch Tiếng Việt)',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 1 - 3',
    skills: ['Nói & Khẩu ngữ', 'Đàm thoại sinh hoạt'],
    format: 'Giáo trình Đàm thoại',
    fileSize: '40 chủ đề thực tiễn',
    author: 'Khang Ngọc Hoa, Lai Tư Bình (BLCU)',
    publisher: 'BLCU Press & NXB Tổng hợp',
    language: 'Song ngữ Trung - Việt',
    license: 'Bản quyền Giáo trình (Trích mẫu câu đời sống)',
    verificationStatus: 'academic_reference',
    relatedLessonId: 'Module 1.2 (Bài 106-108) & Module 2.1 (Bài 201)',
    verificationNotes: 'Giáo trình đàm thoại phổ biến nhất tại Việt Nam với 40 bài học về chào hỏi, mua sắm, giá cả.',
    description: 'Bộ tài liệu đàm thoại tiếng Trung kinh điển nhất với 40 bài học xoay quanh 301 mẫu câu giao tiếp căn bản: chào hỏi, làm quen, đổi tiền, mua sắm, đi lại, khám bệnh, đặt phòng khách sạn.',
    downloadUrl: 'http://www.blcup.com',
    sourceUrl: 'http://www.blcup.com',
    tags: ['301 câu', 'Đàm thoại', 'BLCU', 'Khẩu ngữ', 'Tiếng Việt'],
    createdAt: '2026-03-30',
    downloadsCount: 3200,
    isFeatured: true
  },
  {
    id: 'mat-20',
    title: 'Bộ Đề Thi Khẩu Ngữ HSKK Sơ Cấp & Trung Cấp Có File Nghe (CTI chinesetest.cn)',
    category: 'Đề thi HSK',
    level: 'HSK 1 - 4',
    skills: ['Luyện thi HSK', 'Nói & Khẩu ngữ', 'Phản xạ khẩu ngữ HSKK'],
    format: 'Đề thi Chính thức',
    fileSize: 'Trọn bộ đề thi nói CTI',
    author: 'Trung tâm Khảo thí Quốc tế HSK (CTI)',
    publisher: 'Chinese Testing International',
    language: 'Tiếng Trung Giản thể',
    license: 'Tài liệu Khảo thí Chính thức CTI',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Module 3.4 (Bài 320 - Khẩu ngữ HSKK)',
    verificationNotes: 'Tiêu chuẩn đề thi đánh giá năng lực nói tiếng Trung chuẩn hóa quốc tế của Hanban/CTI.',
    description: 'Tiêu chuẩn và đề thi đánh giá năng lực nói tiếng Trung chuẩn hóa quốc tế: HSKK Sơ cấp (nhắc lại câu, trả lời nhanh) và Trung cấp (kể lại câu chuyện, miêu tả tranh ảnh và phỏng vấn).',
    downloadUrl: 'https://www.chinesetest.cn',
    sourceUrl: 'https://www.chinesetest.cn',
    tags: ['HSKK', 'Khẩu ngữ', 'Đề thi nói', 'CTI', 'Audio'],
    createdAt: '2026-03-31',
    downloadsCount: 1110,
    isFeatured: true
  }
];

export const MATERIAL_CATEGORIES = [
  'Tất cả',
  'Giáo trình chuẩn',
  'Ngữ pháp chuyên sâu',
  'Đề thi HSK',
  'Bộ thủ & Hán tự',
  'Thành ngữ & Giao tiếp',
  'Kỹ năng Nghe & Đọc'
];

export const MATERIAL_LEVELS = [
  'Tất cả',
  'Nhập môn',
  'HSK 1',
  'HSK 2',
  'HSK 3',
  'HSK 4',
  'HSK 5',
  'HSK 6'
];

export const MATERIAL_SKILLS = [
  'Tất cả kỹ năng',
  'Nghe hiểu',
  'Nói & Khẩu ngữ',
  'Đọc hiểu',
  'Viết & Thuận bút',
  'Ngữ pháp',
  'Từ vựng',
  'Luyện thi HSK'
];

export const MATERIAL_FORMATS = [
  'PDF',
  'PDF + MP3',
  'ZIP (PDF + MP3)',
  'PDF In A4 Vector',
  'Tương tác & In PDF',
  'Trực tuyến & MP3',
  'Trực tuyến & In A4',
  'Bách khoa Ngữ pháp',
  'Từ điển Mở',
  'Vector Thuận bút',
  'Tệp Âm thanh CC0',
  'Video Bài giảng',
  'Đề thi Chính thức'
];

export const VERIFICATION_STATUS_META = {
  verified_official: {
    label: 'Chính thức CTI / Bộ GD',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    icon: '🛡️'
  },
  verified_oer: {
    label: 'Giáo dục mở OER / CC',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    icon: '✅'
  },
  academic_reference: {
    label: 'Đại học BLCU / ULIS',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    icon: '🏛️'
  },
  curated: {
    label: 'Tuyển chọn chất lượng',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    icon: '⭐'
  }
};

// Helper functions for Materials
export function getStoredMaterials() {
  try {
    const savedVersion = localStorage.getItem('hanzigo_materials_version');
    const saved = localStorage.getItem('hanzigo_materials');

    if (saved && savedVersion === CURRENT_MATERIALS_VERSION) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Auto-migrate to current academic version if version mismatched or missing
    let customItems = [];
    if (saved) {
      try {
        const oldParsed = JSON.parse(saved);
        if (Array.isArray(oldParsed)) {
          customItems = oldParsed.filter(item => item.isCustom);
        }
      } catch {}
    }

    const merged = [...customItems, ...DEFAULT_MATERIALS];
    localStorage.setItem('hanzigo_materials', JSON.stringify(merged));
    localStorage.setItem('hanzigo_materials_version', CURRENT_MATERIALS_VERSION);
    return merged;
  } catch (err) {
    console.error('Error reading stored materials:', err);
  }
  // Fallback to default
  localStorage.setItem('hanzigo_materials', JSON.stringify(DEFAULT_MATERIALS));
  localStorage.setItem('hanzigo_materials_version', CURRENT_MATERIALS_VERSION);
  return DEFAULT_MATERIALS;
}

export function saveMaterial(material) {
  const current = getStoredMaterials();
  const newMaterial = {
    ...material,
    id: material.id || `mat-${Date.now()}`,
    skills: Array.isArray(material.skills) ? material.skills : (material.skills ? [material.skills] : ['Tổng hợp']),
    language: material.language || 'Song ngữ Trung - Việt',
    license: material.license || 'Tài liệu giáo dục',
    verificationStatus: material.verificationStatus || 'curated',
    relatedLessonId: material.relatedLessonId || null,
    sourceUrl: material.sourceUrl || material.downloadUrl || '',
    createdAt: material.createdAt || new Date().toISOString().split('T')[0],
    downloadsCount: material.downloadsCount || 0
  };
  const updated = [newMaterial, ...current];
  localStorage.setItem('hanzigo_materials', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function updateMaterial(id, updatedData) {
  const current = getStoredMaterials();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
  localStorage.setItem('hanzigo_materials', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteMaterial(id) {
  const current = getStoredMaterials();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem('hanzigo_materials', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function resetMaterials() {
  localStorage.setItem('hanzigo_materials', JSON.stringify(DEFAULT_MATERIALS));
  localStorage.setItem('hanzigo_materials_version', CURRENT_MATERIALS_VERSION);
  triggerCloudSync();
  return DEFAULT_MATERIALS;
}

// Custom Vocabulary Helpers
export function getStoredCustomVocab() {
  try {
    const saved = localStorage.getItem('hanzigo_custom_vocab');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored custom vocab:', err);
  }
  return [];
}

export function saveCustomVocab(vocab) {
  const current = getStoredCustomVocab();
  const newItem = {
    ...vocab,
    id: vocab.id || `custom-vocab-${Date.now()}`,
    isCustom: true
  };
  const updated = [newItem, ...current];
  localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteCustomVocab(id) {
  const current = getStoredCustomVocab();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

// Custom Lessons Helpers
export function getStoredCustomLessons() {
  try {
    const saved = localStorage.getItem('hanzigo_custom_lessons');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored custom lessons:', err);
  }
  return [];
}

export function saveCustomLesson(lesson) {
  const current = getStoredCustomLessons();
  const newItem = {
    ...lesson,
    id: lesson.id || `custom-lesson-${Date.now()}`,
    isCustom: true
  };
  const updated = [newItem, ...current];
  localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteCustomLesson(id) {
  const current = getStoredCustomLessons();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}
