export const SITE_ORIGIN = 'https://hanzigo-xi.vercel.app';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/hanzigo-logo.svg`;
export const SITE_NAME = 'HanziGo';

const DEFAULT_META = {
  title: 'HanziGo — Học tiếng Trung dễ hơn mỗi ngày | Nền tảng học tiếng Trung cho người Việt',
  description:
    'Nền tảng học tiếng Trung trực tuyến chuẩn HSK 1–9 dành cho người Việt. Tích hợp từ điển Hán-Việt, luyện viết chữ Hán, phòng luyện nghe, thi thử HSK/HSKK CBT và lớp học LiveKit.',
  path: '/',
  ogType: 'website',
  robots: 'index, follow',
};

/**
 * Metadata chuẩn tiếng Việt cho toàn bộ 23+ trang và phân khu của HanziGo.
 */
export const ROUTE_SEO_CONFIG = {
  home: {
    ...DEFAULT_META,
    path: '/',
  },
  dashboard: {
    title: 'Bảng Điều Khiển Học Tập Cá Nhân | HanziGo',
    description:
      'Theo dõi tiến độ HSK, chuỗi ngày học liên tiếp (Streak), điểm kinh nghiệm XP và mục tiêu ôn tập từ vựng SRS mỗi ngày trên HanziGo.',
    path: '/dashboard',
    ogType: 'website',
    robots: 'index, follow',
  },
  intelligence: {
    title: 'Trung Tâm Phân Tích Học Tập AI & SRS | HanziGo',
    description:
      'Phân tích đường cong quên lãng, tỷ lệ ghi nhớ từ vựng SRS và đề xuất bài học tối ưu theo năng lực cá nhân bằng AI.',
    path: '/intelligence',
    ogType: 'website',
    robots: 'index, follow',
  },
  roadmap: {
    title: 'Lộ Trình Học Tiếng Trung HSK 1–9 Chuẩn Quốc Tế | HanziGo',
    description:
      'Khám phá lộ trình 120 bài học bài bản từ HSK 1 đến HSK 6 và hệ thống HSK 3.0 (Cấp 7–9) với bài giảng tương tác, ngữ pháp và bài tập thực hành.',
    path: '/roadmap',
    ogType: 'website',
    robots: 'index, follow',
  },
  lesson: {
    title: 'Bài Học Tương Tác Tiếng Trung HSK | HanziGo',
    description:
      'Học bài giảng tương tác kèm phát âm bản ngữ, ví dụ ngữ cảnh, giải thích ngữ pháp và bài kiểm tra nhanh sau mỗi bài học.',
    path: '/lesson',
    ogType: 'article',
    robots: 'index, follow',
  },
  vocabulary: {
    title: 'Kho Từ Vựng HSK 1–9 & Ôn Tập Spaced Repetition | HanziGo',
    description:
      'Học và ghi nhớ từ vựng tiếng Trung HSK 1–9 bền vững với thuật toán lặp lại ngắt quãng (SRS), thẻ ghi nhớ thông minh và âm thanh chuẩn.',
    path: '/vocabulary',
    ogType: 'website',
    robots: 'index, follow',
  },
  pronunciation: {
    title: 'Luyện Phát Âm Pinyin & 4 Thanh Điệu Chuẩn Bắc Kinh | HanziGo',
    description:
      'Làm chủ bảng phiên âm Pinyin, thanh mẫu, vận mẫu và biến điệu tiếng Trung với công nghệ nhận diện giọng nói AI và phản hồi tức thì.',
    path: '/pronunciation',
    ogType: 'website',
    robots: 'index, follow',
  },
  writing: {
    title: 'Từ Điển Hán-Việt & Luyện Viết Chữ Hán Theo Nét | HanziGo',
    description:
      'Tra cứu từ điển Hán-Việt thông minh, phân tích 214 bộ thủ và luyện viết chữ Hán đúng thứ tự nét trên bảng vẽ tương tác.',
    path: '/writing',
    ogType: 'website',
    robots: 'index, follow',
  },
  reader: {
    title: 'Đọc Hiểu Tiếng Trung & Phân Tích NLP Song Ngữ | HanziGo',
    description:
      'Luyện đọc hiểu báo chí, truyện ngắn tiếng Trung với công cụ tách từ NLP, hiện Pinyin, dịch nghĩa nhanh và lưu từ mới vào sổ tay SRS.',
    path: '/reader',
    ogType: 'website',
    robots: 'index, follow',
  },
  conversation: {
    title: 'Luyện Giao Tiếp & Hội Thoại Tiếng Trung Thực Tế AI | HanziGo',
    description:
      'Thực hành phản xạ giao tiếp tiếng Trung theo tình huống đời sống, công việc và du lịch cùng trợ lý hội thoại AI.',
    path: '/conversation',
    ogType: 'website',
    robots: 'index, follow',
  },
  practice: {
    title: 'Trung Tâm Luyện Tập Tiếng Trung 4 Kỹ Năng | HanziGo',
    description:
      'Tổng hợp bài tập luyện nghe, ngữ pháp, đọc hiểu và dịch thuật theo từng cấp độ HSK giúp củng cố kiến thức mỗi ngày.',
    path: '/practice',
    ogType: 'website',
    robots: 'index, follow',
  },
  grammar: {
    title: 'Sổ Tay Ngữ Pháp Tiếng Trung HSK Cốt Lõi | HanziGo',
    description:
      'Hệ thống mẫu câu và cấu trúc ngữ pháp tiếng Trung từ sơ cấp đến cao cấp kèm ví dụ song ngữ dễ hiểu và bài tập vận dụng.',
    path: '/grammar',
    ogType: 'website',
    robots: 'index, follow',
  },
  listening: {
    title: 'Phòng Luyện Nghe Tiếng Trung Chuẩn Giọng Bản Ngữ | HanziGo',
    description:
      'Nâng cao kỹ năng nghe hiểu tiếng Trung với bài nghe phân cấp HSK, điều chỉnh tốc độ phát và chế độ chép chính tả tương tác.',
    path: '/listening',
    ogType: 'website',
    robots: 'index, follow',
  },
  'listening-studio': {
    title: 'Listening Studio — Luyện Nghe Chuyên Sâu & Shadowing | HanziGo',
    description:
      'Phòng lab luyện nghe chuyên sâu với phụ đề đồng bộ thời gian thực, lặp đoạn thông minh và bài tập kiểm tra khả năng nắm bắt ý chính.',
    path: '/listening-studio',
    ogType: 'website',
    robots: 'index, follow',
  },
  video: {
    title: 'Học Tiếng Trung Qua Video Thực Tế & Phụ Đề Kép | HanziGo',
    description:
      'Học tiếng Trung tự nhiên qua video bản ngữ có phụ đề Hán tự, Pinyin và tiếng Việt giúp ghi nhớ ngữ cảnh giao tiếp chuẩn xác.',
    path: '/video',
    ogType: 'website',
    robots: 'index, follow',
  },
  'video-studio': {
    title: 'Video Studio — Học Tiếng Trung Qua Phim & Hội Thoại | HanziGo',
    description:
      'Khám phá kho video song ngữ có tương tác từng câu thoại để luyện nghe và nói tiếng Trung tự nhiên.',
    path: '/video-studio',
    ogType: 'website',
    robots: 'index, follow',
  },
  'hsk30-translation': {
    title: 'Luyện Dịch & Viết Học Thuật HSK 3.0 (Cấp 7–9) | HanziGo',
    description:
      'Chinh phục kỹ năng biên dịch Trung–Việt, Việt–Trung và viết luận học thuật theo khung năng lực HSK 3.0 cao cấp (Cấp 7–9).',
    path: '/hsk30-translation',
    ogType: 'website',
    robots: 'index, follow',
  },
  hsk: {
    title: 'Thi Thử HSK 1-6 & HSKK Chuẩn CTI Trực Tuyến | HanziGo',
    description:
      'Phòng thi thử HSK 1–6 và HSKK trên máy tính (CBT) mô phỏng chuẩn đề thi thật của CTI, tự động chấm điểm và phân tích lỗi sai chi tiết.',
    path: '/hsk-practice',
    ogType: 'website',
    robots: 'index, follow',
  },
  classroom: {
    title: 'Lớp Học Tiếng Trung Trực Tuyến LiveKit | HanziGo',
    description:
      'Tham gia lớp học tương tác thời gian thực với giảng viên qua LiveKit HD, bảng trắng viết chữ Hán và bài tập nhóm trực tuyến.',
    path: '/classroom',
    ogType: 'website',
    robots: 'index, follow',
  },
  community: {
    title: 'Cộng Đồng Học Tiếng Trung & Chia Sẻ Kinh Nghiệm HSK | HanziGo',
    description:
      'Kết nối cùng cộng đồng học viên tiếng Trung tại Việt Nam, hỏi đáp ngữ pháp, chia sẻ tài liệu và mẹo thi đạt điểm cao HSK.',
    path: '/community',
    ogType: 'website',
    robots: 'index, follow',
  },
  leaderboard: {
    title: 'Bảng Vàng Thành Tích & Thi Đua Học Tập | HanziGo',
    description:
      'Xem bảng xếp hạng XP, chuỗi Streak và thành tích nổi bật của học viên HanziGo theo tuần và toàn thời gian.',
    path: '/leaderboard',
    ogType: 'website',
    robots: 'index, follow',
  },
  materials: {
    title: 'Kho Tài Liệu, Giáo Trình & Vở Tập Viết Tiếng Trung Miễn Phí | HanziGo',
    description:
      'Tải miễn phí bảng 214 bộ thủ, vở luyện viết ô điền tự Tianzige A4, bảng Pinyin, 500 câu giao tiếp và sổ tay ngữ pháp HSK.',
    path: '/materials',
    ogType: 'website',
    robots: 'index, follow',
  },
  profile: {
    title: 'Hồ Sơ Học Viên & Thành Tích Cá Nhân | HanziGo',
    description:
      'Quản lý hồ sơ học tập cá nhân, mục tiêu HSK, huy hiệu đạt được và lịch sử thi thử trên HanziGo.',
    path: '/profile',
    ogType: 'profile',
    robots: 'noindex, nofollow',
  },
  teacher: {
    title: 'Cổng Giảng Viên & Quản Lý Lớp Học | HanziGo',
    description: 'Không gian quản lý lớp học, giao bài tập và theo dõi tiến độ học viên dành cho giảng viên HanziGo.',
    path: '/teacher',
    ogType: 'website',
    robots: 'noindex, nofollow',
  },
  admin: {
    title: 'Quản Trị Hệ Thống | HanziGo',
    description: 'Trang quản trị nội bộ hệ thống HanziGo.',
    path: '/admin',
    ogType: 'website',
    robots: 'noindex, nofollow',
  },
  privacy: {
    title: 'Chính Sách Bảo Mật Thông Tin | HanziGo',
    description:
      'Tìm hiểu cách HanziGo thu thập, bảo vệ, mã hóa và xử lý dữ liệu học tập cá nhân của người dùng theo tiêu chuẩn bảo mật minh bạch.',
    path: '/privacy-policy',
    ogType: 'article',
    robots: 'index, follow',
  },
  terms: {
    title: 'Điều Khoản Sử Dụng Dịch Vụ | HanziGo',
    description:
      'Quy định và điều khoản sử dụng nền tảng học tiếng Trung trực tuyến HanziGo, quyền lợi học viên và trách nhiệm bản quyền nội dung.',
    path: '/terms-of-service',
    ogType: 'article',
    robots: 'index, follow',
  },
  cookies: {
    title: 'Chính Sách Cookie & Lưu Trữ Trình Duyệt | HanziGo',
    description:
      'Thông tin chi tiết về các nhóm dữ liệu lưu trữ trên trình duyệt (Thiết yếu, Học tập cục bộ, Chức năng) khi sử dụng HanziGo.',
    path: '/cookie-policy',
    ogType: 'article',
    robots: 'index, follow',
  },
  refund: {
    title: 'Chính Sách Hoàn Tiền & Gia Hạn Gói Học | HanziGo',
    description:
      'Quy trình và điều kiện hoàn tiền minh bạch đối với các gói nâng cấp và khóa học trực tuyến trên HanziGo.',
    path: '/refund-policy',
    ogType: 'article',
    robots: 'index, follow',
  },
  'storage-preferences': {
    title: 'Tùy Chọn Lưu Trữ Dữ Liệu & Đồng Bộ Ngoại Tuyến | HanziGo',
    description:
      'Kiểm soát dữ liệu lưu trữ cục bộ, sao lưu tiến độ học tập, đồng bộ hàng đợi ngoại tuyến và dọn bộ nhớ đệm trình duyệt trên HanziGo.',
    path: '/storage-preferences',
    ogType: 'website',
    robots: 'index, follow',
  },
  'reset-password': {
    title: 'Đặt Lại Mật Khẩu Tài Khoản | HanziGo',
    description: 'Khôi phục và đặt lại mật khẩu tài khoản HanziGo của bạn một cách an toàn.',
    path: '/reset-password',
    ogType: 'website',
    robots: 'noindex, nofollow',
  },
};

export function getRouteSeoMeta(activeTab = 'home', routeInfo = {}) {
  const normalizedTab =
    activeTab === 'leaderboard' || routeInfo?.sub === 'leaderboard'
      ? 'leaderboard'
      : String(activeTab || 'home').toLowerCase();

  const entry = ROUTE_SEO_CONFIG[normalizedTab] || DEFAULT_META;
  const canonicalPath = entry.path === '/' ? '/' : entry.path;

  return {
    title: entry.title,
    description: entry.description,
    canonicalUrl: `${SITE_ORIGIN}${canonicalPath}`,
    ogType: entry.ogType || 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogLocale: 'vi_VN',
    twitterCard: 'summary_large_image',
    robots: entry.robots || 'index, follow',
  };
}

/**
 * Xây dựng dữ liệu có cấu trúc JSON-LD Schema.org cho HanziGo:
 * - WebApplication
 * - EducationalOrganization
 * - Course (HSK 1–6 và HSK 3.0 Cấp 7–9)
 */
export function buildGlobalJsonLdSchemas() {
  return [
    {
      '@type': 'WebApplication',
      '@id': `${SITE_ORIGIN}/#webapp`,
      name: 'HanziGo',
      url: SITE_ORIGIN,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      inLanguage: 'vi',
      description:
        'Nền tảng học tiếng Trung trực tuyến chuẩn HSK 1–9 dành cho người Việt với từ điển Hán-Việt, luyện viết chữ Hán, thi thử HSK CBT và lớp học LiveKit.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'VND',
      },
      publisher: {
        '@id': `${SITE_ORIGIN}/#organization`,
      },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: 'HanziGo',
      url: SITE_ORIGIN,
      logo: DEFAULT_OG_IMAGE,
      description:
        'Tổ chức giáo dục công nghệ phát triển nền tảng học tiếng Trung và luyện thi HSK/HSKK trực tuyến cho học viên Việt Nam.',
      areaServed: {
        '@type': 'Country',
        name: 'VN',
      },
    },
    {
      '@type': 'Course',
      '@id': `${SITE_ORIGIN}/roadmap#hsk-1-6`,
      name: 'Lộ Trình Học Tiếng Trung Chuẩn Quốc Tế HSK 1–6',
      description:
        'Hệ thống 120 bài học bài bản từ nhập môn Pinyin đến thành thạo giao tiếp và đạt chứng chỉ HSK 1–6 với SRS, luyện nghe và thi thử CBT.',
      provider: {
        '@id': `${SITE_ORIGIN}/#organization`,
      },
      inLanguage: ['vi', 'zh-Hans'],
      educationalLevel: 'HSK 1 - HSK 6',
      url: `${SITE_ORIGIN}/roadmap`,
    },
    {
      '@type': 'Course',
      '@id': `${SITE_ORIGIN}/hsk30-translation#hsk-7-9`,
      name: 'Lộ Trình HSK 3.0 Cao Cấp (Cấp 7–9)',
      description:
        'Chương trình đào tạo tiếng Trung học thuật cao cấp chuẩn HSK 3.0 (Cấp 7–9) tập trung đọc hiểu chuyên sâu, biên phiên dịch và viết luận.',
      provider: {
        '@id': `${SITE_ORIGIN}/#organization`,
      },
      inLanguage: ['vi', 'zh-Hans'],
      educationalLevel: 'HSK 3.0 Level 7-9',
      url: `${SITE_ORIGIN}/hsk30-translation`,
    },
  ];
}

