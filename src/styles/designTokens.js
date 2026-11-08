/**
 * =========================================================================
 * HANZI GO — DESIGN TOKENS & SYSTEM SPECIFICATION (TASK 25.UI.01)
 * =========================================================================
 * Centralized Design System tokens for Modern Educational SaaS styling:
 * - Color semantics (Primary Imperial Red, Gold Accent, Jade Green, Ink Dark, Warm Cream)
 * - Typography hierarchies for Latin & Chinese (Noto Serif SC + Plus Jakarta Sans)
 * - Component variant classes (Buttons, Badges, Cards, Inputs, Tables)
 * - Role-based navigation metadata
 */

export const DESIGN_COLORS = {
  primary: '#E85D3F',
  primaryHover: '#CB4529',
  primaryLight: '#FDEEEB',
  primaryDark: '#B9381E',
  secondary: '#F4B942',
  secondaryHover: '#D97706',
  secondaryLight: '#FEF7E9',
  accent: '#E85D3F',
  success: '#45B97C',
  successLight: '#EBF8F2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  dark: '#243447',
  darkSurface: '#1E293B',
  darkSurfaceElevated: '#26354A',
  bgWarm: '#FFF9F2',
  cardBg: '#FFFFFF',
  borderColor: '#F1E5D8',
  borderColorDark: '#2B3A4F',
  textMuted: '#748092',
  textMutedDark: '#94A3B8'
};

export const BUTTON_VARIANTS = {
  primary: 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#CB4529] hover:to-[#B9381E] text-white font-bold shadow-md shadow-[#E85D3F]/25 hover:shadow-lg hover:shadow-[#E85D3F]/35 transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer',
  secondary: 'bg-white dark:bg-[#1E293B] hover:bg-[#FFF9F2] dark:hover:bg-[#2B3A4F] text-[#243447] dark:text-white font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs transition-all duration-150 active:scale-95 cursor-pointer',
  accent: 'bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold shadow-sm shadow-amber-400/25 transition-all duration-150 active:scale-95 cursor-pointer',
  subtle: 'bg-[#FDEEEB] dark:bg-[#2D1E1B] hover:bg-[#FCD8D2] dark:hover:bg-[#3D2520] text-[#E85D3F] font-bold transition-colors duration-150 cursor-pointer',
  ghost: 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150 cursor-pointer',
  danger: 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900/40 transition-colors duration-150 cursor-pointer'
};

export const BADGE_VARIANTS = {
  primary: 'bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] border border-[#E85D3F]/20',
  gold: 'bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] dark:text-amber-400 border border-[#F4B942]/30',
  jade: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
};

export const CARD_SURFACE = {
  default: 'bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm rounded-3xl transition-all',
  elevated: 'bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-md hover:shadow-xl rounded-3xl transition-all',
  interactive: 'bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] shadow-xs hover:shadow-md hover:-translate-y-0.5 rounded-3xl transition-all cursor-pointer'
};

/**
 * Standard Navigation Groups with Role-based Visibility
 */
export const NAVIGATION_GROUPS = [
  {
    id: 'core',
    label: 'Học tập cốt lõi',
    items: [
      { id: 'home', label: 'Trang chủ', path: '#home', icon: 'BookOpen', desc: 'Trang chủ tổng quan' },
      { id: 'roadmap', label: 'Lộ trình HSK', path: '#roadmap', icon: 'Compass', desc: '60 bài học chuẩn 9 bước' },
      { id: 'hsk', label: 'Thi thử HSK', path: '#hsk', icon: 'Award', desc: 'Kho đề thi mô phỏng CTI' },
      { id: 'classroom', label: 'Lớp học', path: '#classroom', icon: 'GraduationCap', desc: 'Lớp học & Bài tập giáo viên' }
    ]
  },
  {
    id: 'skills',
    label: 'Kỹ năng & Luyện tập',
    items: [
      { id: 'grammar', label: 'Luyện ngữ pháp', path: '#grammar', icon: 'Sparkles', desc: 'Cấu trúc câu & Cú pháp' },
      { id: 'listening', label: 'Luyện nghe HSK', path: '#listening', icon: 'Headphones', desc: 'Phản xạ âm thanh bản xứ' },
      { id: 'vocabulary', label: 'Từ vựng HSK', path: '#vocabulary', icon: 'Layers', desc: 'Flashcards SRS & Nhớ lâu' },
      { id: 'pronunciation', label: 'Luyện phát âm', path: '#pronunciation', icon: 'Mic', desc: 'Pinyin & Nhận diện giọng nói' },
      { id: 'writing', label: 'Từ điển & Viết chữ', path: '#writing', icon: 'PenTool', desc: 'Thuận bút & Ô mễ tự' },
      { id: 'conversation', label: 'Hội thoại AI', path: '#conversation', icon: 'MessageSquare', desc: 'Lão Sư AI phản xạ tình huống' },
      { id: 'reader', label: 'Đọc hiểu & Báo chí', path: '#reader', icon: 'BookOpen', desc: 'Bài đọc NLP & Phân tích từ' },
      { id: 'practice', label: 'Trung tâm tổng hợp', path: '#practice', icon: 'Target', desc: 'Tổng quan kỹ năng theo cấp' }
    ]
  },
  {
    id: 'explore',
    label: 'Khám phá & Cộng đồng',
    items: [
      { id: 'materials', label: 'Thư viện tài liệu', path: '#materials', icon: 'FolderDown', desc: 'Giáo trình BLCU & Audio CTI' },
      { id: 'community', label: 'Cộng đồng học viên', path: '#community', icon: 'Users', desc: 'Hỏi đáp, ghép bạn học & bài viết' },
      { id: 'leaderboard', label: 'Bảng vàng cao thủ', path: '#leaderboard', icon: 'Trophy', desc: 'Vinh danh bảng xếp hạng XP' }
    ]
  },
  {
    id: 'teacher',
    label: 'Cổng Giáo viên',
    requiredRole: 'teacher',
    items: [
      { id: 'teacher-dash', tab: 'teacher', sub: null, label: 'Tổng quan giảng dạy', path: '#teacher', icon: 'GraduationCap', desc: 'Dashboard giáo viên' },
      { id: 'teacher-classes', tab: 'teacher', sub: 'classes', label: 'Quản lý lớp học', path: '#teacher/classes', icon: 'Users', desc: 'Danh sách & phòng học' },
      { id: 'teacher-students', tab: 'teacher', sub: 'students', label: 'Danh sách học viên', path: '#teacher/students', icon: 'UserCheck', desc: 'Theo dõi thành tích học sinh' },
      { id: 'teacher-grading', tab: 'teacher', sub: 'grading', label: 'Chấm bài & Nhận xét', path: '#teacher/grading', icon: 'CheckCircle2', desc: 'Chấm điểm bài tập đã nộp' },
      { id: 'teacher-studio', tab: 'teacher', sub: 'ai-studio', label: 'AI Lesson Studio', path: '#teacher/ai-studio', icon: 'Sparkles', desc: 'Trợ lý soạn giáo án tự động' }
    ]
  },
  {
    id: 'admin',
    label: 'Quản trị hệ thống',
    requiredRole: 'admin',
    items: [
      { id: 'admin-dash', tab: 'admin', sub: null, label: 'Bảng điều khiển Admin', path: '#admin', icon: 'ShieldCheck', desc: 'Tổng quan hệ thống' },
      { id: 'admin-users', tab: 'admin', sub: 'users', label: 'Quản lý người dùng', path: '#admin#users', icon: 'Users', desc: 'Tài khoản, vai trò & phân quyền' },
      { id: 'admin-moderation', tab: 'admin', sub: 'moderation', label: 'Kiểm duyệt cộng đồng', path: '#admin#moderation', icon: 'Shield', desc: 'Xử lý báo cáo vi phạm' },
      { id: 'admin-materials', tab: 'admin', sub: 'materials', label: 'Quản lý học liệu', path: '#admin#materials', icon: 'FolderDown', desc: 'Kho học liệu số' },
      { id: 'admin-content', tab: 'admin', sub: 'content', label: 'Nội dung tùy chỉnh', path: '#admin#content', icon: 'Layers', desc: 'Bài học & từ vựng giáo trình' }
    ]
  }
];

