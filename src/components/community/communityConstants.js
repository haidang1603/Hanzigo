export const STORAGE_KEYS = {
  POSTS: 'hanzigo_community_posts',
  PARTNERS: 'hanzigo_study_partners',
  CHALLENGE: 'hanzigo_community_challenge',
  COMPLETED_LESSONS: 'hanzigo_completed_lessons',
  SAVED_POSTS: 'hanzigo_saved_post_ids',
  SOLVED_POSTS: 'hanzigo_community_solved_posts',
};

export const TAG_FILTERS = [
  { id: 'all', label: 'Tất cả bài viết' },
  { id: '#ThiHSK', label: '🎯 Hỏi đáp HSK' },
  { id: '#SuaCauLuyenViet', label: '✍️ Sửa câu / Luyện viết' },
  { id: '#MeoHocTuVung', label: '💡 Mẹo học từ vựng' },
  { id: '#KinhNghiemHoc', label: '📚 Chia sẻ kinh nghiệm' },
  { id: '#TimBanLuyenNoi', label: '🗣️ Tìm bạn học' },
  { id: '#HoiDapNguPhap', label: '💬 Ngữ pháp' },
  { id: 'saved', label: '⭐ Đã lưu' },
];

export const HSK_GROUP_FILTERS = [
  { id: 'all', label: 'Tất cả HSK' },
  { id: 'HSK 1–3', label: 'HSK 1–3' },
  { id: 'HSK 4–6', label: 'HSK 4–6' },
  { id: 'HSK 7–9', label: 'HSK 7–9' },
];

export const HSK_LEVEL_OPTIONS = [
  'HSK 1',
  'HSK 2',
  'HSK 3',
  'HSK 4',
  'HSK 5',
  'HSK 6',
  'HSK 7-9',
];

export const PARTNER_LEVEL_OPTIONS = [
  'HSK 1',
  'HSK 2',
  'HSK 3',
  'HSK 4',
  'HSK 5',
  'HSK 6',
  'Giao tiếp tự do',
];

export const PARTNER_CONTACT_METHODS = [
  'Zalo',
  'Google Meet',
  'WeChat',
  'Zoom',
  'Telegram',
];

export const DAILY_DISCUSSION_TOPIC = {
  date: 'Hôm nay',
  title: 'Chủ đề đàm thoại: Mùa yêu thích trong năm',
  chinese: '你最喜欢哪个季节？为什么？',
  pinyin: 'Nǐ zuì xǐhuan nǎge jìjié? Wèishénme?',
  meaning: 'Bạn thích mùa nào nhất trong năm? Vì sao?',
  vocabHints: [
    { zh: '春天', py: 'chūntiān', vi: 'mùa xuân' },
    { zh: '夏天', py: 'xiàtiān', vi: 'mùa hè' },
    { zh: '秋天', py: 'qiūtiān', vi: 'mùa thu' },
    { zh: '冬天', py: 'dōngtiān', vi: 'mùa đông' },
    { zh: '天气暖和', py: 'tiānqì nuǎnhuo', vi: 'thời tiết ấm áp' },
  ],
};

export const QUICK_POST_PROMPTS = [
  {
    tag: '#ChuDeHomNay',
    label: '🏮 Trả lời chủ đề hôm nay',
    prompt: 'Trả lời chủ đề hôm nay: 我最喜欢秋天，因为秋天的天气不冷也不热，非常舒服。(Tôi thích nhất mùa thu vì thời tiết không lạnh cũng không nóng, rất dễ chịu).',
  },
  {
    tag: '#HoiDapNguPhap',
    label: '💡 Phân biệt câu chữ 把 & 被',
    prompt: 'Mọi người cho mình hỏi câu chữ 把 (Bǎ) và câu chữ 被 (Bèi) khác nhau cơ bản thế nào và khi nào bắt buộc phải dùng câu chữ 把 ạ? Xin cảm ơn cả nhà!',
  },
  {
    tag: '#TimBanLuyenNoi',
    label: '🗣️ Tìm bạn luyện nói tối nay',
    prompt: 'Chào các bạn! Mình đang học HSK 2 lên HSK 3, muốn tìm 1 bạn cùng luyện khẩu ngữ 20 - 30 phút mỗi tối qua Zalo hoặc Google Meet. Bạn nào cùng mục tiêu thì kết nối nhé!',
  },
  {
    tag: '#KinhNghiemHoc',
    label: '📚 Mẹo nhớ nhanh 214 bộ thủ',
    prompt: 'Chia sẻ kinh nghiệm: Mình thấy học chữ Hán qua chiết tự và 214 bộ thủ Khang Hy nhớ nhanh hơn rất nhiều so với chép tay từng nét. Mọi người hay áp dụng phương pháp nào?',
  },
  {
    tag: '#ThiHSK',
    label: '🎯 Kinh nghiệm phân bổ thời gian thi HSK',
    prompt: 'Các bạn từng thi HSK cho mình xin lời khuyên: Trong phần Nghe hiểu (听力) và Đọc hiểu (阅读), phần nào dễ bẫy nhất và cần lưu ý phân bổ thời gian làm bài thế nào ạ?',
  },
];

export const FAKE_AUTHORS = [
  'Trần Thảo Ly',
  'Đặng Quốc Anh',
  'Phạm Thu Trang',
  'Nguyễn Thu Trang',
  'Trần Đăng Khoa',
  'Lê Hoàng Nam',
];

export const FAKE_PARTNERS = [
  'Nguyễn Thị Ánh Tuyết',
  'Hoàng Minh Tuấn',
  'Vũ Lan Phương',
  'Nguyễn Thúy Hằng',
  'Lê Tuấn Anh',
  'Đặng Mai Phương',
];
