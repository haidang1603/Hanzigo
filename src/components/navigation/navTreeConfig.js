import {
  BookOpen,
  Compass,
  Award,
  GraduationCap,
  Sparkles,
  Headphones,
  Layers,
  Mic,
  PenTool,
  MessageSquare,
  FolderDown,
  Users,
  Trophy,
  ShieldCheck,
  Target,
  Brain,
  Video,
  Languages,
  FileText,
  AlertTriangle,
  BarChart3,
  LayoutGrid,
  ClipboardCheck,
  Wand2,
  BookMarked,
  Volume2,
  Home,
  Camera,
  Globe,
  Pickaxe,
  Flame,
  MessageCircle,
} from 'lucide-react';

/**
 * Parse current window.location.hash into { tab, sub }
 */
export function parseHashRoute(hashStr = '') {
  try {
    const raw = (hashStr || (typeof window !== 'undefined' ? window.location.hash : '')).replace(/^#/, '');
    if (!raw || raw.includes('access_token=') || raw.includes('error=')) {
      return { tab: '', sub: '' };
    }
    const [tab = '', sub = ''] = raw.split('/');
    return { tab, sub };
  } catch {
    return { tab: '', sub: '' };
  }
}

export function isTreeNodeActive(node, activeTab, currentHash) {
  if (!node) return false;
  const { sub } = parseHashRoute(currentHash);

  if (node.match) {
    return node.match(activeTab, sub);
  }
  if (node.children && node.children.length > 0) {
    return node.children.some((child) => isTreeNodeActive(child, activeTab, currentHash));
  }
  return activeTab === node.id;
}

export function filterTreeNodes(nodes, normalizedFilter) {
  if (!normalizedFilter) return nodes;
  return nodes
    .map((node) => {
      const selfMatches = node.label.toLowerCase().includes(normalizedFilter);
      if (node.children && node.children.length > 0) {
        const filteredChildren = filterTreeNodes(node.children, normalizedFilter);
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        if (selfMatches) {
          return node;
        }
        return null;
      }
      return selfMatches ? node : null;
    })
    .filter(Boolean);
}

export const CORE_TREE_ITEMS = [
  { key: 'home', id: 'home', label: 'Trang chủ', icon: Home },
  { key: 'intelligence', id: 'intelligence', label: 'Trung tâm AI Học tập', icon: Brain },
  { key: 'roadmap', id: 'roadmap', label: 'Lộ trình HSK', icon: Compass },
  {
    key: 'hsk',
    id: 'hsk',
    hash: '#hsk',
    label: 'Thi thử HSK',
    icon: Award,
    children: [
      {
        key: 'hsk:home',
        id: 'hsk',
        hash: '#hsk',
        label: 'Tổng quan & Cấp độ',
        icon: LayoutGrid,
        match: (tab, sub) => tab === 'hsk' && (!sub || sub === 'home' || sub === 'levels'),
      },
      {
        key: 'hsk:exams',
        id: 'hsk',
        hash: '#hsk/exams',
        label: 'Kho đề thi HSK 1–6',
        icon: FileText,
        match: (tab, sub) => tab === 'hsk' && sub === 'exams',
      },
      {
        key: 'hsk:hsk6',
        id: 'hsk',
        hash: '#hsk/hsk6_simulator',
        label: 'Mô phỏng HSK 6',
        icon: Award,
        badge: 'HSK 6',
        match: (tab, sub) => tab === 'hsk' && sub === 'hsk6_simulator',
      },
      {
        key: 'hsk:hskk',
        id: 'hsk',
        hash: '#hsk/hskk_simulator',
        label: 'Thi nói HSKK',
        icon: Mic,
        badge: 'HSKK',
        match: (tab, sub) => tab === 'hsk' && sub === 'hskk_simulator',
      },
      {
        key: 'hsk:mistakes',
        id: 'hsk',
        hash: '#hsk/mistakes',
        label: 'Sổ tay lỗi sai',
        icon: AlertTriangle,
        match: (tab, sub) => tab === 'hsk' && sub === 'mistakes',
      },
      {
        key: 'hsk:analytics',
        id: 'hsk',
        hash: '#hsk/analytics',
        label: 'Lịch sử & Phân tích',
        icon: BarChart3,
        match: (tab, sub) => tab === 'hsk' && (sub === 'analytics' || sub === 'history'),
      },
      {
        key: 'hsk:structure',
        id: 'hsk',
        hash: '#hsk/structure',
        label: 'Cấu trúc đề HSK',
        icon: BookMarked,
        match: (tab, sub) => tab === 'hsk' && sub === 'structure',
      },
    ],
  },
  { key: 'classroom', id: 'classroom', label: 'Lớp học', icon: GraduationCap },
];

export const SKILLS_TREE_ITEMS = [
  {
    key: 'skills:input',
    id: 'practice',
    label: 'Nghe & Đọc (Input)',
    icon: Volume2,
    isGroupOnly: true,
    children: [
      { key: 'listening', id: 'listening', label: 'Luyện nghe HSK', icon: Headphones },
      { key: 'listening-studio', id: 'listening-studio', label: 'Listening & Dictation', icon: Headphones },
      { key: 'video-studio', id: 'video-studio', label: 'Video Studio Song ngữ', icon: Video },
      {
        key: 'reader',
        id: 'reader',
        hash: '#reader',
        label: 'Đọc hiểu & NLP',
        icon: BookOpen,
        children: [
          {
            key: 'reader:graded',
            id: 'reader',
            hash: '#reader/graded',
            label: 'Kho Bài đọc HSK 1–6',
            icon: Layers,
            match: (tab, sub) => tab === 'reader' && (!sub || sub === 'graded'),
          },
          {
            key: 'reader:custom',
            id: 'reader',
            hash: '#reader/custom',
            label: 'Phân tích văn bản NLP',
            icon: FileText,
            match: (tab, sub) => tab === 'reader' && sub === 'custom',
          },
          {
            key: 'reader:studio',
            id: 'reader',
            hash: '#reader/studio',
            label: 'Reading Studio (Quiz)',
            icon: Sparkles,
            match: (tab, sub) => tab === 'reader' && sub === 'studio',
          },
          {
            key: 'reader:ocr',
            id: 'reader',
            hash: '#reader/ocr',
            label: 'Quét ảnh & Sách (OCR)',
            icon: Camera,
            match: (tab, sub) => tab === 'reader' && sub === 'ocr',
          },
          {
            key: 'reader:importer',
            id: 'reader',
            hash: '#reader/importer',
            label: 'Web Clipper & Báo chí',
            icon: Globe,
            match: (tab, sub) => tab === 'reader' && sub === 'importer',
          },
          {
            key: 'reader:immersion',
            id: 'reader',
            hash: '#reader/immersion',
            label: 'Immersion Hub (i+1)',
            icon: Pickaxe,
            badge: 'i+1',
            match: (tab, sub) => tab === 'reader' && sub === 'immersion',
          },
        ],
      },
    ],
  },
  {
    key: 'skills:core',
    id: 'practice',
    label: 'Từ vựng & Ngữ pháp',
    icon: Layers,
    isGroupOnly: true,
    children: [
      { key: 'vocabulary', id: 'vocabulary', label: 'Flashcards Từ vựng', icon: Layers },
      { key: 'grammar', id: 'grammar', label: 'Ngữ pháp HSK', icon: Sparkles },
    ],
  },
  {
    key: 'skills:output',
    id: 'practice',
    label: 'Nói, Viết & Dịch',
    icon: PenTool,
    isGroupOnly: true,
    children: [
      { key: 'writing', id: 'writing', label: 'Từ điển & Viết chữ', icon: PenTool },
      {
        key: 'pronunciation',
        id: 'pronunciation',
        hash: '#pronunciation',
        label: 'Luyện phát âm AI',
        icon: Mic,
        children: [
          {
            key: 'pronunciation:record',
            id: 'pronunciation',
            hash: '#pronunciation/record',
            label: 'AI Chấm Phát Âm',
            icon: Mic,
            match: (tab, sub) => tab === 'pronunciation' && (!sub || sub === 'record'),
          },
          {
            key: 'pronunciation:lab',
            id: 'pronunciation',
            hash: '#pronunciation/lab',
            label: 'Lab Cao độ & Sandhi',
            icon: Wand2,
            badge: 'Lab',
            match: (tab, sub) => tab === 'pronunciation' && sub === 'lab',
          },
          {
            key: 'pronunciation:tones',
            id: 'pronunciation',
            hash: '#pronunciation/tones',
            label: '4 Thanh Điệu',
            icon: Volume2,
            match: (tab, sub) => tab === 'pronunciation' && sub === 'tones',
          },
          {
            key: 'pronunciation:initials',
            id: 'pronunciation',
            hash: '#pronunciation/initials',
            label: 'Thanh Mẫu (21 âm)',
            icon: BookOpen,
            match: (tab, sub) => tab === 'pronunciation' && sub === 'initials',
          },
          {
            key: 'pronunciation:finals',
            id: 'pronunciation',
            hash: '#pronunciation/finals',
            label: 'Vận Mẫu (15 âm)',
            icon: BookMarked,
            match: (tab, sub) => tab === 'pronunciation' && sub === 'finals',
          },
        ],
      },
      {
        key: 'conversation',
        id: 'conversation',
        hash: '#conversation',
        label: 'Hội thoại Lão Sư',
        icon: MessageSquare,
        children: [
          {
            key: 'conversation:roleplay',
            id: 'conversation',
            hash: '#conversation/roleplay',
            label: 'Hội Thoại Nhập Vai',
            icon: MessageSquare,
            match: (tab, sub) => tab === 'conversation' && (!sub || sub === 'roleplay' || sub === 'conversation'),
          },
          {
            key: 'conversation:tutor',
            id: 'conversation',
            hash: '#conversation/tutor',
            label: 'Gia Sư AI Lão Sư',
            icon: Brain,
            badge: 'AI',
            match: (tab, sub) => tab === 'conversation' && sub === 'tutor',
          },
          {
            key: 'conversation:listening',
            id: 'conversation',
            hash: '#conversation/listening',
            label: 'Luyện Nghe Phản Xạ',
            icon: Headphones,
            match: (tab, sub) => tab === 'conversation' && sub === 'listening',
          },
          {
            key: 'conversation:grammar',
            id: 'conversation',
            hash: '#conversation/grammar',
            label: 'Ngữ Pháp Hội Thoại',
            icon: Sparkles,
            match: (tab, sub) => tab === 'conversation' && sub === 'grammar',
          },
        ],
      },
      { key: 'hsk30-translation', id: 'hsk30-translation', label: 'Xưởng Dịch & HSK 7–9', icon: Languages },
    ],
  },
  { key: 'practice', id: 'practice', label: 'Trung tâm tổng hợp', icon: Target },
];

export const EXPLORE_TREE_ITEMS = [
  { key: 'materials', id: 'materials', label: 'Thư viện tài liệu', icon: FolderDown },
  {
    key: 'community',
    id: 'community',
    hash: '#community',
    label: 'Cộng đồng & Bảng vàng',
    icon: Users,
    children: [
      {
        key: 'community:feed',
        id: 'community',
        hash: '#community',
        label: 'Diễn đàn thảo luận',
        icon: MessageCircle,
        match: (tab, sub) => tab === 'community' && (!sub || sub === 'feed'),
      },
      {
        key: 'community:leaderboard',
        id: 'leaderboard',
        hash: '#community/leaderboard',
        label: 'Bảng Vàng XP',
        icon: Trophy,
        match: (tab, sub) => tab === 'leaderboard' || (tab === 'community' && sub === 'leaderboard'),
      },
      {
        key: 'community:partners',
        id: 'community',
        hash: '#community/partners',
        label: 'Ghép đôi 1-1',
        icon: Users,
        match: (tab, sub) => tab === 'community' && sub === 'partners',
      },
      {
        key: 'community:challenge',
        id: 'community',
        hash: '#community/challenge',
        label: 'Thử thách 21 ngày',
        icon: Flame,
        match: (tab, sub) => tab === 'community' && sub === 'challenge',
      },
    ],
  },
];

export const TEACHER_TREE_ITEMS = [
  {
    key: 'teacher',
    id: 'teacher',
    hash: '#teacher',
    label: 'Quản lý giảng dạy',
    icon: GraduationCap,
    children: [
      {
        key: 'teacher:dashboard',
        id: 'teacher',
        hash: '#teacher',
        label: 'Tổng quan giảng dạy',
        icon: LayoutGrid,
        match: (tab, sub) => tab === 'teacher' && !sub,
      },
      {
        key: 'teacher:classes',
        id: 'teacher',
        hash: '#teacher/classes',
        label: 'Quản lý lớp học',
        icon: GraduationCap,
        match: (tab, sub) => tab === 'teacher' && sub === 'classes',
      },
      {
        key: 'teacher:students',
        id: 'teacher',
        hash: '#teacher/students',
        label: 'Danh sách học viên',
        icon: Users,
        match: (tab, sub) => tab === 'teacher' && sub === 'students',
      },
      {
        key: 'teacher:grading',
        id: 'teacher',
        hash: '#teacher/grading',
        label: 'Chấm bài & Nhận xét',
        icon: ClipboardCheck,
        match: (tab, sub) => tab === 'teacher' && sub === 'grading',
      },
      {
        key: 'teacher:analytics',
        id: 'teacher',
        hash: '#teacher/analytics',
        label: 'Thống kê lớp học',
        icon: BarChart3,
        match: (tab, sub) => tab === 'teacher' && sub === 'analytics',
      },
      {
        key: 'teacher:ai-studio',
        id: 'teacher',
        hash: '#teacher/ai-studio',
        label: 'AI Studio soạn bài',
        icon: Wand2,
        badge: 'AI',
        match: (tab, sub) => tab === 'teacher' && (sub === 'ai-studio' || sub === 'ai_studio'),
      },
    ],
  },
];

export const ADMIN_TREE_ITEMS = [
  { key: 'admin', id: 'admin', label: 'Bảng điều khiển Admin', icon: ShieldCheck },
];

export const ALL_PRACTICE_SKILL_IDS = [
  'listening',
  'listening-studio',
  'video-studio',
  'reader',
  'vocabulary',
  'grammar',
  'writing',
  'pronunciation',
  'conversation',
  'hsk30-translation',
  'practice',
];

