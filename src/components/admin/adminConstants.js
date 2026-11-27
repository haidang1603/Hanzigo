export const ADMIN_PAGE_SIZE = 10;

export const ADMIN_ROLE_LABELS = {
  student: 'STUDENT (Học viên)',
  teacher: 'TEACHER (Giáo viên)',
  admin: 'ADMIN (Quản trị viên)',
};

export const ADMIN_TAB_GROUPS = [
  { id: 'overview', label: 'Tổng quan & KPI' },
  { id: 'users', label: 'Người dùng & Phân quyền' },
  { id: 'moderation', label: 'Kiểm duyệt & Kho đề' },
  { id: 'materials', label: 'Kho Tài liệu' },
  { id: 'vocab', label: 'Từ vựng' },
  { id: 'lessons', label: 'Bài học' },
  { id: 'ai_metrics', label: 'Hệ thống, AI & Log lỗi' },
  { id: 'backup', label: 'Sao lưu & Dọn dẹp' },
];

export const DEFAULT_NEW_USER_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  level: 'HSK 1 - Sơ cấp',
  status: 'active',
  xp: 0,
  streak: 0,
};

export const DEFAULT_MAT_FORM = {
  title: '',
  category: 'Giáo trình chuẩn',
  level: 'HSK 1',
  format: 'PDF',
  fileSize: '10 MB',
  author: 'HanziGo Biên soạn',
  publisher: 'BLCU Press / CTI',
  sourceUrl: '',
  skills: 'Từ vựng, Ngữ pháp',
  language: 'Song ngữ Trung - Việt',
  license: 'Bản quyền Giáo trình (Trích dẫn học thuật)',
  verificationStatus: 'verified_official',
  relatedLessonId: 'Module 1.1',
  verificationNotes: '',
  description: '',
  downloadUrl: '',
  tags: '',
  isFeatured: false,
  isHidden: false,
};

export const DEFAULT_VOCAB_FORM = {
  hanzi: '',
  pinyin: '',
  hanviet: '',
  meaning: '',
  hsk: 'hsk1',
  topic: 'Giao tiếp hàng ngày',
  example: '',
  examplePinyin: '',
  exampleMeaning: '',
  memoryTip: '',
};

export const DEFAULT_LESSON_FORM = {
  title: '',
  level: 'HSK 1',
  duration: '20',
  xp: '50',
  description: '',
  grammarPoints: '',
};

export const ADMIN_USER_LEVEL_OPTIONS = [
  'HSK 1 - Sơ cấp',
  'HSK 2 - Cơ bản',
  'HSK 3 - Trung cấp',
  'HSK 4 - Độc lập',
  'HSK 5 - Cao cấp',
  'HSK 6 - Thành thạo',
  'HSK 7-9 - Bậc thầy',
];

export const ADMIN_MATERIAL_QUICK_CATEGORIES = [
  'Tất cả',
  'Giáo trình chuẩn',
  'Ngữ pháp chuyên sâu',
  'Đề thi HSK',
  'Bộ thủ & Hán tự',
  'Thành ngữ & Giao tiếp',
];

export const MOCK_STORAGE_KEYS_TO_PURGE = [
  'hanzigo_pronounce_history',
  'hanzigo_pronounce_scores',
  'hanzigo_custom_pronounce_list',
  'hanzigo_hsk_attempts',
  'hanzigo_hsk_history',
  'hanzigo_hsk_mistakes',
  'hanzigo_hsk_analytics',
  'hanzigo_chat_history',
  'hanzigo_daily_missions',
  'hanzigo_study_minutes_map',
];
