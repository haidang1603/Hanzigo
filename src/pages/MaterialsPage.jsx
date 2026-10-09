import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  FolderDown, 
  Headphones, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Eye, 
  X, 
  Sparkles, 
  Filter, 
  Printer, 
  Heart, 
  Copy, 
  Check, 
  BookOpen, 
  PenTool, 
  Mic, 
  RefreshCw, 
  Send, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  Compass, 
  BookCheck, 
  RotateCcw, 
  SlidersHorizontal,
  Volume2,
  Award,
  Zap,
  Target,
  Layers,
  HelpCircle,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { 
  getStoredMaterials, 
  saveMaterial, 
  deleteMaterial, 
  updateMaterial, 
  MATERIAL_CATEGORIES, 
  MATERIAL_LEVELS, 
  MATERIAL_FORMATS, 
  MATERIAL_SKILLS, 
  VERIFICATION_STATUS_META 
} from '../utils/materialsStorage';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';
import { 
  triggerCloudSync, 
  getMaterialsFromDb, 
  addMaterialToDb, 
  deleteMaterialFromDb, 
  updateMaterialInDb 
} from '../supabase/services';
import { awardXp } from '../utils/gamification';
import { useAuth } from '../context/AuthContext';

// Featured Exclusive Interactive Tools in HanziGo
const FEATURED_EXCLUSIVE_TOOLS = [
  {
    id: 'feat-mizige',
    title: 'Vở Luyện Viết Ô Mễ Tự (米字格) Chuẩn A4',
    badge: '✍️ In ấn & Luyện viết',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
    description: 'Trang kẻ ô mễ tự 8 hướng chuẩn kèm dòng pinyin. Tối ưu in A4 vector nét căng hoặc xuất file PDF để tập viết chữ Hán bằng bút mực.',
    url: '/vo-tap-viet-chu-han-a4.html',
    actionText: 'Mở & In A4 ngay',
    type: 'print'
  },
  {
    id: 'feat-radicals',
    title: 'Cẩm Nang 214 Bộ Thủ Khang Hy Tương Tác',
    badge: '📖 Chiết tự & Tra cứu',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'Bảng tra cứu 214 bộ thủ đầy đủ âm Hán-Việt, Pinyin, số nét bút, ý nghĩa tượng hình cổ và danh sách chữ Hán cấu thành tiêu biểu.',
    url: '/214-bo-thu-chu-han.html',
    actionText: 'Tra cứu bộ thủ',
    type: 'interactive'
  },
  {
    id: 'feat-hanviet',
    title: 'Bảng Quy Tắc Chuyển Âm Hán - Việt & Pinyin',
    badge: '🔄 Bí quyết ghi nhớ',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    description: 'Bí quyết ghi nhớ từ vựng siêu tốc dựa trên sự tương đồng ngữ âm lịch sử giữa tiếng Việt và tiếng Hán, chuyển đổi thanh mẫu & vận mẫu.',
    url: '/bang-doi-chieu-han-viet.html',
    actionText: 'Xem bảng quy tắc',
    type: 'guide'
  }
];

// Curated HSK Starter Packs for rapid level-based browsing
const CURATED_LEVEL_BUNDLES = [
  {
    id: 'bundle-hsk1',
    level: 'HSK 1',
    title: 'HSK 1 Nhập Môn Vững Vàng',
    subtitle: '150 từ vựng cốt lõi & Phát âm',
    color: '#45B97C',
    bgLight: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: '🌱',
    stats: '150 từ • 20 bài học',
    recommendDocId: 'mat-1'
  },
  {
    id: 'bundle-hsk2',
    level: 'HSK 2',
    title: 'HSK 2 Đàm Thoại Đời Sống',
    subtitle: '300 từ vựng & 500 câu khẩu ngữ',
    color: '#D97706',
    bgLight: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: '💬',
    stats: '300 từ • Giao tiếp mua sắm',
    recommendDocId: 'mat-2'
  },
  {
    id: 'bundle-hsk3',
    level: 'HSK 3',
    title: 'HSK 3 Trung Cấp Toàn Diện',
    subtitle: '600 từ vựng & 100 ngữ pháp',
    color: '#E85D3F',
    bgLight: 'from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30',
    borderColor: 'border-rose-200 dark:border-rose-800',
    icon: '🚀',
    stats: '600 từ • Đề thi CTI chuẩn',
    recommendDocId: 'mat-3'
  },
  {
    id: 'bundle-hsk4',
    level: 'HSK 4',
    title: 'HSK 4+ Nâng Cao & Thành Ngữ',
    subtitle: '1200+ từ & Ngữ pháp AllSet Wiki',
    color: '#8B5CF6',
    bgLight: 'from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: '🎓',
    stats: '1200+ từ • Thành ngữ 4 chữ',
    recommendDocId: 'mat-5'
  }
];

// Rich interactive excerpts for Preview Studio Modal
const SAMPLE_EXCERPTS = {
  'mat-1': {
    type: 'vocab_table',
    title: 'Trích đoạn Từ vựng Cốt lõi HSK 1 (Bài 1 - 3)',
    subtitle: 'Chuẩn Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    items: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', hanViet: 'Nhĩ Hảo', meaning: 'Xin chào', example: '你好！很高兴认识你。' },
      { hanzi: '谢谢', pinyin: 'xièxie', hanViet: 'Tạ Tạ', meaning: 'Cảm ơn', example: '谢谢你的帮助！' },
      { hanzi: '再见', pinyin: 'zàijiàn', hanViet: 'Tái Kiến', meaning: 'Tạm biệt', example: '明天见，再见！' },
      { hanzi: '学习', pinyin: 'xuéxí', hanViet: 'Học Tập', meaning: 'Học hỏi, học tập', example: '我们在学习汉语。' },
      { hanzi: '中国', pinyin: 'zhōngguó', hanViet: 'Trung Quốc', meaning: 'Nước Trung Quốc', example: '我喜欢中国文化。' }
    ]
  },
  'mat-2': {
    type: 'dialogue',
    title: 'Trích đoạn Đàm thoại Thực tế HSK 2 (Đi chợ & Mua sắm)',
    subtitle: 'Giao tiếp hàng ngày giọng bản xứ',
    lines: [
      { speaker: '顾客 (Khách)', hanzi: '服务员，这个苹果一斤多少钱？', pinyin: 'Fúwùyuán, zhè ge píngguǒ yì jīn duōshao qián?', viet: 'Phục vụ ơi, một cân táo này bao nhiêu tiền thế?' },
      { speaker: '店员 (Nhân viên)', hanzi: '五块钱一斤，很甜很好吃。', pinyin: 'Wǔ kuài qián yì jīn, hěn tián hěn hǎochī.', viet: 'Năm tệ một cân, rất ngọt và ngon lắm.' },
      { speaker: '顾客 (Khách)', hanzi: '太贵了，便宜一点儿吧！四块怎么样？', pinyin: 'Tài guì le, piányi yìdiǎnr ba! Sì kuài zěnmeyàng?', viet: 'Đắt quá, rẻ bớt chút đi! Bốn tệ được không?' },
      { speaker: '店员 (Nhân viên)', hanzi: '行，买两斤算你八块。', pinyin: 'Xíng, mǎi liǎng jīn suàn nǐ bā kuài.', viet: 'Được rồi, mua hai cân tính bạn tám tệ.' }
    ]
  },
  'mat-3': {
    type: 'vocab_table',
    title: 'Trích đoạn Từ vựng Trọng tâm HSK 3 (Công việc & Du lịch)',
    subtitle: 'Mở rộng vốn từ trung cấp',
    items: [
      { hanzi: '打算', pinyin: 'dǎsuàn', hanViet: 'Đả Toán', meaning: 'Dự định, kế hoạch', example: '你周末有什么打算？' },
      { hanzi: '满意', pinyin: 'mǎnyì', hanViet: 'Mãn Ý', meaning: 'Hài lòng, vừa ý', example: '我对这次旅行很满意。' },
      { hanzi: '环境', pinyin: 'huánjìng', hanViet: 'Hoàn Cảnh', meaning: 'Môi trường, không gian', example: '这里的环境非常安静。' },
      { hanzi: '经常', pinyin: 'jīngcháng', hanViet: 'Kinh Thường', meaning: 'Thường xuyên', example: '他经常去图书馆借书。' },
      { hanzi: '解决', pinyin: 'jiějué', hanViet: 'Giải Quyết', meaning: 'Giải quyết vấn đề', example: '我们已经解决了这个问题。' }
    ]
  },
  'mat-4': {
    type: 'radicals',
    title: 'Trích đoạn 5 Bộ Thủ Căn Bản Tiêu Biểu Nhất',
    subtitle: 'Gốc rễ tạo chữ tượng hình',
    items: [
      { radical: '亻', name: 'Nhân đứng (人)', strokes: 2, meaning: 'Liên quan đến con người', examples: '你, 他, 们, 休, 伴' },
      { radical: '氵', name: 'Ba chấm thủy (水)', strokes: 3, meaning: 'Liên quan đến nước, chất lỏng', examples: '江, 河, 海, 洗, 渴' },
      { radical: '口', name: 'Khẩu (Miệng)', strokes: 3, meaning: 'Liên quan đến ăn uống, lời nói', examples: '吃, 喝, 叫, 听, 问' },
      { radical: '木', name: 'Mộc (Cây cối)', strokes: 4, meaning: 'Liên quan đến gỗ, cây cối, rừng', examples: '林, 森, 桌, 椅, 本' },
      { radical: '忄', name: 'Tâm đứng (心)', strokes: 3, meaning: 'Liên quan đến tâm tư, cảm xúc', examples: '快, 慢, 怕, 忆, 懂' }
    ]
  },
  'mat-5': {
    type: 'grammar',
    title: 'Trích đoạn Bách Khoa Ngữ Pháp: Cấu Trúc Câu Chữ 把 (Bǎ)',
    subtitle: 'Chinese Grammar Wiki chuẩn AllSet',
    formula: 'Chủ ngữ (S) + 把 + Tân ngữ (O) + Động từ (V) + Thành phần khác (了/bổ ngữ)',
    explanation: 'Dùng để nhấn mạnh sự tác động làm thay đổi vị trí, trạng thái hoặc kết quả của tân ngữ.',
    examples: [
      { correct: '我把作业做完了。 (Wǒ bǎ zuòyè zuò wán le.)', viet: 'Tôi đã làm xong bài tập rồi.', note: 'Tân ngữ "bài tập" chịu tác động và hoàn thành.' },
      { correct: '请把门关上。 (Qǐng bǎ mén guān shàng.)', viet: 'Làm ơn đóng cửa lại.', note: 'Tân ngữ "cửa" thay đổi trạng thái đóng.' },
      { incorrect: '我把作业做。 ❌ (Sai: Thiếu thành phần bổ ngữ hoặc 了 sau động từ)', viet: 'Câu chữ 把 bắt buộc phải có thành phần kết quả sau động từ.' }
    ]
  },
  'mat-6': {
    type: 'quiz',
    title: 'Trích đoạn Câu hỏi Đọc hiểu Mẫu Đề Thi CTI HSK 3',
    subtitle: 'Mô phỏng đề thi thật CTI Hanban',
    question: '阅读理解: "喂，你到哪儿了？大家都在等你呢。"',
    pinyin: 'Wèi, nǐ dào nǎr le? Dàjiā dōu zài děng nǐ ne.',
    translation: 'A lô, cậu đến đâu rồi? Mọi người đều đang đợi cậu đấy.',
    options: [
      { text: 'A. 我在出租车上，马上就到！ (Tôi đang trên taxi, tới liền!)', correct: true },
      { text: 'B. 明天下午见吧。 (Hẹn chiều mai gặp nhé.)', correct: false },
      { text: 'C. 这个苹果太贵了。 (Táo này đắt quá.)', correct: false }
    ],
    explanation: 'Đáp án A phù hợp nhất với ngữ cảnh trả lời qua điện thoại khi được hỏi vị trí đang di chuyển.'
  },
  'mat-8': {
    type: 'cognate',
    title: 'Trích đoạn Quy Tắc Chuyển Phụ Âm Đầu Hán - Việt Sang Pinyin',
    subtitle: 'Bí quyết ghi nhớ từ vựng siêu tốc',
    rules: [
      { viInitial: 'Âm B trong tiếng Việt', zhInitial: 'Âm b / p trong Pinyin', example: 'Bảo (bǎo 宝), Bất (bù 不), Binh (bīng 兵), Biến (biàn 变)' },
      { viInitial: 'Âm C/K trong tiếng Việt', zhInitial: 'Âm j / q / g / k', example: 'Kim (jīn 金), Cung (gōng 宫), Quốc (guó 国), Cảm (gǎn 感)' },
      { viInitial: 'Âm Đ/T trong tiếng Việt', zhInitial: 'Âm d / t trong Pinyin', example: 'Địa (dì 地), Đại (dà 大), Tâm (xīn 心), Thiên (tiān 天)' },
      { viInitial: 'Âm H trong tiếng Việt', zhInitial: 'Âm h / x trong Pinyin', example: 'Học (xué 学), Hảo (hǎo 好), Hoa (huā 花), Hạnh (xìng 幸)' }
    ]
  },
  'mat-9': {
    type: 'mizige',
    title: 'Mô Phỏng Vở Kẻ Ô Mễ Tự (米字格) Chuẩn A4 Khang Hy',
    subtitle: 'Vĩnh tự bát pháp (永字八法)',
    character: '永',
    pinyin: 'yǒng (Vĩnh - vĩnh cửu)',
    note: 'Chữ "Vĩnh" (永) chứa trọn vẹn 8 nét bút cơ bản trong thư pháp chữ Hán: Điểm (chấm), Hoành (ngang), Túng (dọc), Câu (móc), Đề (hất), Trích (ngắn), Phiệt (phẩy), Nại (mác).'
  },
  'mat-10': {
    type: 'idioms',
    title: 'Trích đoạn Tuyển tập Thành Ngữ 4 Chữ (成语) Kinh Điển',
    subtitle: 'Thành ngữ thông dụng trong giao tiếp và phim ảnh',
    items: [
      { idiom: '一心一意', pinyin: 'yī xīn yí yì', viet: 'Một lòng một dạ', meaning: 'Toàn tâm toàn ý làm một việc.' },
      { idiom: '马到成功', pinyin: 'mǎ dào chéng gōng', viet: 'Mã đáo thành công', meaning: 'Chúc việc gì cũng thành công ngay từ đầu.' },
      { idiom: '入乡随俗', pinyin: 'rù xiāng suí sú', viet: 'Nhập gia tùy tục', meaning: 'Đến nơi nào thì theo phong tục nơi ấy.' },
      { idiom: '半途而废', pinyin: 'bàn tú ér fèi', viet: 'Bỏ dở nửa chừng', meaning: 'Làm việc thiếu kiên nhẫn, bỏ cuộc giữa chừng.' }
    ]
  }
};

// Quick suggestions for rapid material addition
const QUICK_MATERIAL_SUGGESTIONS = [
  {
    title: '500 Mẫu Câu Giao Tiếp Khẩu Ngữ Tiếng Trung Đời Sống Hàng Ngày',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 2',
    skills: ['Nói & Khẩu ngữ', 'Nghe hiểu', 'Giao tiếp'],
    format: 'PDF + MP3',
    fileSize: '500 mẫu câu thực tế',
    author: 'HanziGo Biên soạn',
    publisher: 'Ban Đào tạo HanziGo',
    language: 'Song ngữ Trung - Việt',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 2.1 (Bài 201 - 204)',
    verificationNotes: 'Tổng hợp mẫu câu sinh hoạt gia đình, mua sắm, chào hỏi hàng ngày chuẩn khẩu ngữ.',
    downloadUrl: 'https://www.youtube.com/results?search_query=500+cau+giao+tiep+tieng+trung',
    sourceUrl: 'https://www.youtube.com/results?search_query=500+cau+giao+tiep+tieng+trung',
    description: 'Tuyển tập 500 câu khẩu ngữ ngắn gọn, thông dụng nhất dùng khi đi chợ, gọi món, đi taxi, làm quen, chúc tụng và xử lý tình huống giao tiếp thường ngày.',
    tags: 'Giao tiếp, Khẩu ngữ, HSK 2, Đàm thoại'
  },
  {
    title: 'Sổ Tay 100 Cấu Trúc Ngữ Pháp Tiếng Trung Trọng Tâm HSK 3 - 4',
    category: 'Ngữ pháp chuyên sâu',
    level: 'HSK 3',
    skills: ['Ngữ pháp', 'Đọc hiểu'],
    format: 'Bách khoa Ngữ pháp',
    fileSize: '100 cấu trúc ngữ pháp',
    author: 'Khoa Ngôn ngữ BLCU',
    publisher: 'AllSet Chinese Grammar Wiki',
    language: 'Song ngữ Trung - Việt',
    license: 'Creative Commons CC BY-NC-SA 3.0',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 3.1 - 3.4 (Bài 301 - 320)',
    verificationNotes: 'Bách khoa toàn thư ngữ pháp tiếng Trung chuẩn học thuật quốc tế.',
    downloadUrl: 'https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points',
    sourceUrl: 'https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points',
    description: 'Tổng hợp chi tiết các mẫu câu liên từ, phó từ chỉ mức độ, câu chữ 把, câu chữ 被, bổ ngữ xu hướng kép và cách phân biệt các cặp từ đồng nghĩa.',
    tags: 'Ngữ pháp, HSK 3, Luyện thi, Cấu trúc câu'
  },
  {
    title: 'Bộ Đề Thi Thử HSK 2 Đầy Đủ Đọc Hiểu & Nghe Kèm Đáp Án Chi Tiết',
    category: 'Đề thi HSK',
    level: 'HSK 2',
    skills: ['Luyện thi HSK', 'Nghe hiểu', 'Đọc hiểu'],
    format: 'Đề thi Chính thức',
    fileSize: '5 bộ đề thi chuẩn',
    author: 'CTI Chinesetest',
    publisher: 'Chinese Testing International',
    language: 'Tiếng Trung Giản thể',
    license: 'Đề thi Khảo thí Hanban / CTI',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Module 2.4 (Bài 220)',
    verificationNotes: 'Đề thi mô phỏng 100% định dạng thi chuẩn hóa của Khổng Tử Học Viện.',
    downloadUrl: 'https://www.chinesetest.cn/godownload.do',
    sourceUrl: 'https://www.chinesetest.cn/godownload.do',
    description: 'Trọn bộ 5 đề thi thử mô phỏng 100% cấu trúc đề thi thật của Hanban / CTI. Có file nghe giọng Bắc Kinh chuẩn và bảng giải thích đáp án chi tiết từng câu.',
    tags: 'Đề thi, HSK 2, Có đáp án, File nghe MP3'
  }
];

export default function MaterialsPage({ setActiveTab, user: propUser, isAdmin: propIsAdmin, onSelectLesson = null }) {
  const authContext = useAuth();
  const user = propUser !== undefined ? propUser : authContext?.user;
  const ADMIN_EMAILS = ['lehaidang16032006@gmail.com', 'admin@hanzigo.com'];
  const isAdmin = propIsAdmin !== undefined 
    ? propIsAdmin 
    : Boolean(authContext?.isAdmin || user?.role === 'admin' || (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim())));

  // Core Data State
  const [materials, setMaterials] = useState(() => getStoredMaterials());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedSkill, setSelectedSkill] = useState('Tất cả kỹ năng');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all', 'bookmarked', 'custom'
  const [sortBy, setSortBy] = useState('downloads'); // 'downloads', 'newest', 'name'
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  // Bookmarks state (persisted in localStorage with user isolation)
  const bookmarkStorageKey = useMemo(() => {
    return user?.id ? `hanzigo_bookmarked_materials_${user.id}` : 'hanzigo_bookmarked_materials';
  }, [user?.id]);

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey) || localStorage.getItem('hanzigo_bookmarked_materials');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMizigeGenModal, setShowMizigeGenModal] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [previewTab, setPreviewTab] = useState('excerpt'); // 'excerpt', 'provenance', 'ecosystem'
  const [quizAnsweredIndex, setQuizAnsweredIndex] = useState(null);

  // Quick Mizige Generator State
  const [mizigeInputText, setMizigeInputText] = useState('学海无涯');
  const [mizigeGridStyle, setMizigeGridStyle] = useState('mizige'); // 'mizige', 'tianzige', 'blank'

  // New Material Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Giáo trình chuẩn');
  const [newLevel, setNewLevel] = useState('HSK 1');
  const [newSkills, setNewSkills] = useState('Từ vựng, Nghe hiểu');
  const [newPublisher, setNewPublisher] = useState('');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newLanguage, setNewLanguage] = useState('Song ngữ Trung - Việt');
  const [newLicense, setNewLicense] = useState('Tài liệu Giáo dục Mở HanziGo');
  const [newVerificationStatus, setNewVerificationStatus] = useState('curated');
  const [newRelatedLessonId, setNewRelatedLessonId] = useState('');
  const [newVerificationNotes, setNewVerificationNotes] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  // Request Material Form State
  const [reqTitle, setReqTitle] = useState('');
  const [reqCategory, setReqCategory] = useState('Giáo trình chuẩn');
  const [reqLevel, setReqLevel] = useState('HSK 1');
  const [reqFormat, setReqFormat] = useState('PDF + MP3');
  const [reqNote, setReqNote] = useState('');

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  };

  // Fetch materials from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    getMaterialsFromDb()
      .then(dbItems => {
        if (!isMounted) return;
        if (dbItems && dbItems.length > 0) {
          setMaterials(prev => {
            const custom = prev.filter(p => p.isCustom);
            const merged = [...custom];
            dbItems.forEach(dbItem => {
              if (!merged.some(m => String(m.id) === String(dbItem.id) || m.title === dbItem.title)) {
                merged.push(dbItem);
              }
            });
            return merged;
          });
        }
      })
      .catch(err => {
        if (isMounted) {
          console.warn('Không thể tải từ máy chủ, sử dụng dữ liệu cục bộ:', err);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Sync / Refresh with Supabase cloud
  const handleRefreshCloud = async () => {
    setIsSyncing(true);
    setFetchError(null);
    playClickSound();
    try {
      const dbItems = await getMaterialsFromDb();
      if (dbItems && dbItems.length > 0) {
        setMaterials(prev => {
          const custom = prev.filter(p => p.isCustom);
          const merged = [...custom];
          dbItems.forEach(dbItem => {
            if (!merged.some(m => String(m.id) === String(dbItem.id) || m.title === dbItem.title)) {
              merged.push(dbItem);
            }
          });
          return merged;
        });
        showToast('Đã làm mới dữ liệu tài liệu từ máy chủ!');
      } else {
        showToast('Dữ liệu tài liệu đang ở trạng thái mới nhất!');
      }
    } catch {
      setFetchError('Chưa thể đồng bộ với máy chủ. HanziGo đang hiển thị dữ liệu cục bộ đã xác minh.');
      showToast('Đã chuyển sang kho tài liệu cục bộ an toàn.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (id, title) => {
    playClickSound();
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((item) => item !== id);
      showToast(`Đã bỏ lưu: "${title}"`);
    } else {
      updated = [...bookmarkedIds, id];
      showToast(`Đã lưu tài liệu vào danh sách yêu thích (+5 XP)!`);
      playSuccessSound();
      awardXp(5);
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem(bookmarkStorageKey, JSON.stringify(updated));
      localStorage.setItem('hanzigo_bookmarked_materials', JSON.stringify(updated));
    } catch {}
    triggerCloudSync();
  };

  // Copy document link
  const handleCopyLink = (item) => {
    playClickSound();
    const targetUrl = item.sourceUrl || item.downloadUrl || window.location.href;
    const fullUrl = targetUrl.startsWith('http') 
      ? targetUrl 
      : `${window.location.origin}${targetUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    showToast('Đã sao chép liên kết tài liệu vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Increment download count and open URL
  const handleDownloadClick = (item) => {
    playClickSound();
    awardXp(5);
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === item.id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m
      )
    );
  };

  // Inline Pronunciation Audio preview for cards
  const handlePlaySampleAudio = (e, item) => {
    e.stopPropagation();
    playClickSound();
    const sampleText = item.title.includes('HSK 1') ? '你好，很高兴认识你'
      : item.title.includes('HSK 2') ? '这个多少钱？'
      : item.title.includes('HSK 3') ? '我们一起学习汉语'
      : item.title.includes('214') ? '人，木，水，火，土'
      : item.title.includes('500') ? '马到成功'
      : '天天向上';
    speakChinese(sampleText);
    showToast(`🔊 Đang phát âm giọng chuẩn Bắc Kinh: "${sampleText}"`);
  };

  // Quick fill suggestion
  const handleApplySuggestion = (sug) => {
    playClickSound();
    setNewTitle(sug.title);
    setNewCategory(sug.category);
    setNewLevel(sug.level);
    setNewSkills(Array.isArray(sug.skills) ? sug.skills.join(', ') : (sug.skills || ''));
    setNewPublisher(sug.publisher || '');
    setNewFormat(sug.format);
    setNewLanguage(sug.language || 'Song ngữ Trung - Việt');
    setNewLicense(sug.license || 'Tài liệu Giáo dục Mở HanziGo');
    setNewVerificationStatus(sug.verificationStatus || 'curated');
    setNewRelatedLessonId(sug.relatedLessonId || '');
    setNewVerificationNotes(sug.verificationNotes || '');
    setNewFileSize(sug.fileSize);
    setNewAuthor(sug.author);
    setNewDownloadUrl(sug.downloadUrl);
    setNewSourceUrl(sug.sourceUrl || sug.downloadUrl);
    setNewDescription(sug.description);
    setNewTags(sug.tags);
  };

  // Handle Add New Material
  const handleAddNewMaterial = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('⚠️ Chỉ Quản trị viên mới có quyền đăng tải học liệu lên thư viện.');
      setShowAddModal(false);
      return;
    }
    if (!newTitle.trim()) return;

    playClickSound();

    const tagList = newTags
      ? newTags.split(/[,，]/).map(t => t.trim()).filter(Boolean)
      : [newCategory, newLevel];

    const skillList = newSkills
      ? newSkills.split(/[,，]/).map(s => s.trim()).filter(Boolean)
      : ['Từ vựng', 'Ngữ pháp'];

    const newMat = {
      id: `mat-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      level: newLevel,
      skills: skillList,
      format: newFormat || 'PDF',
      fileSize: newFileSize.trim() || 'Tài liệu số',
      author: newAuthor.trim() || 'Người dùng HanziGo',
      publisher: newPublisher.trim() || newAuthor.trim() || 'Cộng đồng HanziGo',
      language: newLanguage || 'Song ngữ Trung - Việt',
      license: newLicense.trim() || 'Tài liệu học tập HanziGo',
      verificationStatus: newVerificationStatus || 'curated',
      relatedLessonId: newRelatedLessonId.trim() || '',
      verificationNotes: newVerificationNotes.trim() || 'Được đóng góp bởi học viên và cộng đồng HanziGo.',
      description: newDescription.trim() || 'Tài liệu học tiếng Trung do người dùng tự tổng hợp và chia sẻ.',
      downloadUrl: newDownloadUrl.trim() || '#',
      sourceUrl: newSourceUrl.trim() || newDownloadUrl.trim() || '#',
      tags: tagList,
      isCustom: true,
      isHidden: false,
      createdAt: new Date().toISOString().split('T')[0],
      downloadsCount: 1
    };

    saveMaterial(newMat);
    const updated = [newMat, ...materials];
    setMaterials(updated);

    const cloudId = await addMaterialToDb(newMat);
    awardXp(20);

    playSuccessSound();
    setShowAddModal(false);
    if (cloudId) {
      showToast('Đã thêm tài liệu mới & đồng bộ lên máy chủ! (+20 XP)');
    } else {
      showToast('Đã lưu tài liệu vào danh mục cục bộ (+20 XP)');
    }

    // Reset Form
    setNewTitle('');
    setNewCategory('Giáo trình chuẩn');
    setNewLevel('HSK 1');
    setNewSkills('Từ vựng, Nghe hiểu');
    setNewPublisher('');
    setNewFormat('PDF');
    setNewLanguage('Song ngữ Trung - Việt');
    setNewLicense('Tài liệu Giáo dục Mở HanziGo');
    setNewVerificationStatus('curated');
    setNewRelatedLessonId('');
    setNewVerificationNotes('');
    setNewFileSize('');
    setNewAuthor('');
    setNewDownloadUrl('');
    setNewSourceUrl('');
    setNewDescription('');
    setNewTags('');
  };

  // Handle Request Material Submit
  const handleRequestMaterialSubmit = (e) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    playClickSound();
    try {
      const existing = JSON.parse(localStorage.getItem('hanzigo_material_requests') || '[]');
      const newReq = {
        id: `req-${Date.now()}`,
        title: reqTitle.trim(),
        category: reqCategory,
        level: reqLevel,
        format: reqFormat,
        note: reqNote.trim(),
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('hanzigo_material_requests', JSON.stringify([newReq, ...existing]));
    } catch {}

    awardXp(10);
    playSuccessSound();
    setShowRequestModal(false);
    showToast('Cảm ơn bạn! Ban Học thuật HanziGo đã ghi nhận yêu cầu tài liệu (+10 XP)!');

    setReqTitle('');
    setReqNote('');
  };

  // Delete Material
  const handleDeleteMaterial = (id, title, e) => {
    if (e) e.stopPropagation();
    playClickSound();
    if (!window.confirm(`Bạn có chắc muốn xóa tài liệu: "${title}"?`)) return;

    deleteMaterial(id);
    deleteMaterialFromDb(id);
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);

    if (selectedPreviewDoc && selectedPreviewDoc.id === id) {
      setSelectedPreviewDoc(null);
    }

    showToast('Đã xóa tài liệu khỏi danh sách.');
  };

  // Admin Toggle Hide
  const handleToggleHide = async (item, e) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    playClickSound();
    const newHidden = !item.isHidden;
    const updatedItem = { ...item, isHidden: newHidden };
    updateMaterial(item.id, { isHidden: newHidden });
    await updateMaterialInDb(item.id, { isHidden: newHidden });
    setMaterials(prev => prev.map(m => m.id === item.id ? updatedItem : m));
    showToast(newHidden ? `Đã tạm ẩn: "${item.title}"` : `Đã công khai: "${item.title}"`);
  };

  // Admin Toggle Feature
  const handleToggleFeature = async (item, e) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    playClickSound();
    const newFeatured = !item.isFeatured;
    const updatedItem = { ...item, isFeatured: newFeatured };
    updateMaterial(item.id, { isFeatured: newFeatured });
    await updateMaterialInDb(item.id, { isFeatured: newFeatured });
    setMaterials(prev => prev.map(m => m.id === item.id ? updatedItem : m));
    showToast(newFeatured ? `Đã ghim nổi bật: "${item.title}"` : `Đã bỏ ghim: "${item.title}"`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    playClickSound();
    setSearchTerm('');
    setSelectedCategory('Tất cả');
    setSelectedLevel('Tất cả');
    setSelectedSkill('Tất cả kỹ năng');
    setSelectedVerification('all');
    setFormatFilter('all');
    setActiveTabFilter('all');
  };

  // Select Level Bundle
  const handleSelectBundle = (bundle) => {
    playClickSound();
    setSelectedLevel(bundle.level);
    setSelectedCategory('Tất cả');
    setActiveTabFilter('all');
    const matched = materials.find(m => m.id === bundle.recommendDocId);
    if (matched) {
      showToast(`Đã lọc gói tài liệu: ${bundle.title}`);
    }
  };

  // Filtered & Sorted Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      // 1. RBAC check: Non-admins cannot see hidden materials
      if (item.isHidden && !isAdmin) return false;

      // 2. Multi-dimensional search
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || (
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.author && item.author.toLowerCase().includes(term)) ||
        (item.publisher && item.publisher.toLowerCase().includes(term)) ||
        (item.license && item.license.toLowerCase().includes(term)) ||
        (item.relatedLessonId && item.relatedLessonId.toLowerCase().includes(term)) ||
        (Array.isArray(item.skills) && item.skills.some(s => s.toLowerCase().includes(term))) ||
        (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(term)))
      );

      // 3. Category Filter
      const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;

      // 4. Level Filter
      const matchesLevel = selectedLevel === 'Tất cả' || item.level === selectedLevel;

      // 5. Skill Filter
      let matchesSkill = true;
      if (selectedSkill !== 'Tất cả kỹ năng') {
        matchesSkill = Array.isArray(item.skills) && item.skills.some(s => 
          s.toLowerCase().includes(selectedSkill.toLowerCase()) || 
          selectedSkill.toLowerCase().includes(s.toLowerCase())
        );
      }

      // 6. Verification Status Filter
      let matchesVerification = true;
      if (selectedVerification !== 'all') {
        matchesVerification = item.verificationStatus === selectedVerification;
      }

      // 7. Tabs Filter
      let matchesTab = true;
      if (activeTabFilter === 'bookmarked') {
        matchesTab = bookmarkedIds.includes(item.id);
      } else if (activeTabFilter === 'custom') {
        matchesTab = Boolean(item.isCustom);
      }

      // 8. Format Filter
      let matchesFormat = true;
      if (formatFilter === 'pdf') {
        matchesFormat = (item.format || '').toLowerCase().includes('pdf');
      } else if (formatFilter === 'audio') {
        matchesFormat = (item.format || '').toLowerCase().includes('mp3') || 
          (item.tags && item.tags.some(t => t.toLowerCase().includes('audio') || t.toLowerCase().includes('mp3')));
      } else if (formatFilter === 'interactive') {
        matchesFormat = (item.format || '').toLowerCase().includes('trực tuyến') || 
          (item.format || '').toLowerCase().includes('tương tác') || 
          (item.format || '').toLowerCase().includes('bách khoa') ||
          (item.format || '').toLowerCase().includes('từ điển') ||
          (item.format || '').toLowerCase().includes('vector');
      } else if (formatFilter === 'print') {
        matchesFormat = (item.format || '').toLowerCase().includes('in') || 
          (item.downloadUrl || '').endsWith('.html');
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesSkill && matchesVerification && matchesTab && matchesFormat;
    }).sort((a, b) => {
      if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
        return b.isFeatured ? 1 : -1;
      }
      if (sortBy === 'downloads') {
        return (b.downloadsCount || 0) - (a.downloadsCount || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || '2026-01-01') - new Date(a.createdAt || '2026-01-01');
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title, 'vi');
      }
      return 0;
    });
  }, [
    materials, 
    searchTerm, 
    selectedCategory, 
    selectedLevel, 
    selectedSkill, 
    selectedVerification, 
    activeTabFilter, 
    formatFilter, 
    sortBy, 
    bookmarkedIds, 
    isAdmin
  ]);

  const hasActiveFilters = 
    searchTerm !== '' || 
    selectedCategory !== 'Tất cả' || 
    selectedLevel !== 'Tất cả' || 
    selectedSkill !== 'Tất cả kỹ năng' || 
    selectedVerification !== 'all' || 
    formatFilter !== 'all' || 
    activeTabFilter !== 'all';

  const customMaterialsCount = materials.filter(m => m.isCustom).length;
  const audioMaterialsCount = materials.filter(m => (m.format || '').includes('MP3') || (m.tags && m.tags.some(t => t.toLowerCase().includes('audio')))).length;
  const verifiedCount = materials.filter(m => m.verificationStatus === 'verified_official' || m.verificationStatus === 'verified_oer').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-200 border border-white/20">
          <CheckCircle2 size={18} className="shrink-0 text-amber-300" />
          <p className="text-xs sm:text-sm font-bold">{toast}</p>
        </div>
      )}

      {/* 1. HERO HEADER BANNER (ASIAN-MODERN PALETTE) */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#E85D3F] via-[#CB4529] to-[#991B1B] text-white shadow-2xl">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-xs">
              <FolderDown size={14} className="text-amber-300" />
              <span>Kho học liệu & Giáo trình số HanziGo</span>
              {isAdmin && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                  Admin Access
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-['Noto_Serif_SC'] leading-tight">
              Thư Viện Tài Liệu Tiếng Trung
            </h1>
            
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              Tuyển tập giáo trình chuẩn CTI & BLCU, kho tài nguyên giáo dục mở (OER), bách khoa ngữ pháp Wiki, đề thi HSK có đáp án và file nghe Audio bản ngữ. Tất cả tài liệu đều được thẩm định học thuật và trích dẫn bản quyền minh bạch.
            </p>
            
            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                📚 <strong>{materials.length}</strong> tài liệu học tập
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                🛡️ <strong>{verifiedCount}</strong> tài liệu CTI & OER
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                🎧 <strong>{audioMaterialsCount}</strong> tài liệu có Audio
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-amber-300">
                ⭐ <strong>{bookmarkedIds.length}</strong> đã lưu yêu thích
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            
            {/* Primary Add Material Button (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => {
                  playClickSound();
                  setShowAddModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-white text-[#E85D3F] hover:bg-[#FFF9F2] font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Plus size={18} />
                <span>Thêm tài liệu (Admin)</span>
              </button>
            )}

            {/* In Ô Mễ Tự Studio Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowMizigeGenModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Printer size={15} />
              <span>✍️ Tạo & In Ô Mễ Tự A4</span>
            </button>

            {/* Return to Roadmap Button */}
            {setActiveTab && (
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('roadmap');
                }}
                className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass size={14} />
                <span>🗺️ Quay lại Lộ trình</span>
              </button>
            )}

            {/* Request Document Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowRequestModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send size={14} />
              <span>📬 Yêu cầu tài liệu mới</span>
            </button>

            {/* Refresh from Supabase */}
            <button
              onClick={handleRefreshCloud}
              disabled={isSyncing}
              title="Đồng bộ lại danh mục tài liệu từ máy chủ"
              className="px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/35 text-white/90 text-xs font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-1.5 self-center md:self-end cursor-pointer"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Đang tải...' : 'Làm mới máy chủ'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Chinese calligraphy watermark */}
        <div className="absolute right-6 -bottom-8 font-['Noto_Serif_SC'] text-8xl sm:text-9xl font-black text-white/10 select-none pointer-events-none">
          博览群书
        </div>
      </div>

      {/* Error alert banner if any */}
      {fetchError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-between gap-4 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{fetchError}</span>
          </div>
          <button 
            onClick={handleRefreshCloud}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 transition-colors cursor-pointer"
          >
            Thử lại kết nối
          </button>
        </div>
      )}

      {/* 2. CURATED LEVEL STARTER PACKS (CHỌN NHANH THEO TRÌNH ĐỘ HSK) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F]">
              <Target size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
              Gói Tài Liệu Học Trọng Tâm Theo Trình Độ
            </h2>
          </div>
          <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-semibold hidden sm:inline">
            Nhấp vào gói để lọc tài liệu tương ứng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURATED_LEVEL_BUNDLES.map((bundle) => {
            const isSelected = selectedLevel === bundle.level;
            return (
              <div
                key={bundle.id}
                onClick={() => handleSelectBundle(bundle)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group bg-gradient-to-br ${bundle.bgLight} ${
                  isSelected 
                    ? 'border-2 border-[#E85D3F] shadow-lg shadow-[#E85D3F]/15 -translate-y-1' 
                    : `${bundle.borderColor} hover:shadow-md hover:-translate-y-0.5`
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{bundle.icon}</span>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-black"
                      style={{ backgroundColor: `${bundle.color}20`, color: bundle.color }}
                    >
                      {bundle.level}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors leading-snug">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                    {bundle.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[11px] text-[#748092] dark:text-[#94A3B8]">{bundle.stats}</span>
                  <span className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: bundle.color }}>
                    <span>Xem gói</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. FEATURED EXCLUSIVE TOOLS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#E85D3F]/10 text-[#E85D3F]">
              <Sparkles size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
              Học Cụ & Tiện Ích Độc Quyền HanziGo
            </h2>
          </div>
          <span className="text-xs text-[#748092] font-semibold hidden sm:inline">
            Tích hợp sẵn & In ấn không cần cài đặt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_EXCLUSIVE_TOOLS.map((tool) => (
            <div 
              key={tool.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md hover:border-[#E85D3F] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors leading-snug">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 flex items-center justify-between">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D3F] hover:text-[#CB4529] group-hover:translate-x-0.5 transition-all"
                >
                  <span>{tool.actionText}</span>
                  <ArrowRight size={14} />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    const fullUrl = `${window.location.origin}${tool.url}`;
                    navigator.clipboard.writeText(fullUrl);
                    showToast('Đã sao chép liên kết tiện ích!');
                  }}
                  title="Sao chép liên kết"
                  className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MULTI-DIMENSIONAL FILTER AND SEARCH BAR */}
      <div className="space-y-4 bg-white dark:bg-[#1E293B] p-5 sm:p-6 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
        
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#748092]" />
          <input
            type="text"
            placeholder="Tìm theo tên sách, nhà xuất bản (BLCU, CTI), kỹ năng, bài học lộ trình, từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs sm:text-sm font-semibold text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#748092] hover:text-[#243447] cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Quick Filter Tabs & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'all', label: `Tất cả tài liệu (${materials.length})` },
              { id: 'bookmarked', label: `❤️ Đã lưu yêu thích (${bookmarkedIds.length})` },
              { id: 'custom', label: `🌟 Đóng góp (${customMaterialsCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTabFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTabFilter === tab.id
                    ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-sm'
                    : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-[#E85D3F] bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Xóa toàn bộ bộ lọc và từ khóa tìm kiếm"
              >
                <RotateCcw size={12} />
                <span>Đặt lại lọc</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
              <span className="hidden sm:inline">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="downloads">Lượt quan tâm nhiều nhất</option>
                <option value="newest">Mới cập nhật</option>
                <option value="name">Tên tài liệu A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* SKILLS FILTER ROW */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            <BookCheck size={14} className="text-[#E85D3F]" />
            <span>Kỹ năng trọng tâm:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MATERIAL_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  playClickSound();
                  setSelectedSkill(skill);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedSkill === skill
                    ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Level / Verification */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Filter size={13} className="text-[#748092] shrink-0 ml-1" />
            {MATERIAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-sm'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level & Verification Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Level Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Cấp độ:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
              >
                {MATERIAL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Verification Status Filter */}
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Kiểm định:</span>
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả nguồn</option>
                <option value="verified_official">🛡️ Chính thức CTI / Bộ GD</option>
                <option value="verified_oer">✅ Giáo dục mở OER / CC</option>
                <option value="academic_reference">🏛️ Đại học BLCU / ULIS</option>
                <option value="curated">⭐ Tuyển chọn chất lượng</option>
              </select>
            </div>
          </div>

        </div>

        {/* Format Filter Pills */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider mr-1 shrink-0">Định dạng:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'pdf', label: '📄 Sách / PDF' },
              { id: 'audio', label: '🎧 File Audio MP3' },
              { id: 'interactive', label: '💻 Tương tác / Web' },
              { id: 'print', label: '🖨️ In ấn A4' }
            ].map(fmt => (
              <button
                key={fmt.id}
                onClick={() => {
                  playClickSound();
                  setFormatFilter(fmt.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  formatFilter === fmt.id
                    ? 'bg-[#E85D3F] text-white shadow-sm'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447]'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#748092] font-semibold shrink-0">
            Hiển thị <strong className="text-[#243447] dark:text-white">{filteredMaterials.length}</strong> / {materials.length} tài liệu
          </div>
        </div>

      </div>

      {/* 5. LOADING SKELETON STATE */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(sk => (
            <div key={sk} className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* 6. MATERIALS GRID */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const hasAudio = (item.format || '').includes('MP3') || (item.tags && item.tags.some(t => t.toLowerCase().includes('audio')));
            const isPrintable = (item.format || '').includes('In') || (item.downloadUrl || '').endsWith('.html');
            const vMeta = VERIFICATION_STATUS_META[item.verificationStatus] || VERIFICATION_STATUS_META.curated;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl bg-white dark:bg-[#1E293B] border ${item.isHidden ? 'border-dashed border-amber-400 dark:border-amber-600 bg-amber-50/20' : 'border-[#F1E5D8] dark:border-[#2B3A4F]'} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4 group relative`}
              >
                
                <div className="space-y-3.5">
                  
                  {/* Badges top row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${vMeta.badgeClass} flex items-center gap-1`}>
                        <span>{vMeta.icon}</span>
                        <span>{vMeta.label}</span>
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                        {item.level}
                      </span>

                      {hasAudio && (
                        <button
                          type="button"
                          onClick={(e) => handlePlaySampleAudio(e, item)}
                          title="Bấm để nghe giọng phát âm mẫu"
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Volume2 size={11} />
                          <span>Nghe mẫu</span>
                        </button>
                      )}

                      {item.isCustom && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          Tự thêm
                        </span>
                      )}

                      {item.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                          <Star size={10} className="fill-amber-500 text-amber-500" />
                          Nổi bật
                        </span>
                      )}

                      {item.isHidden && isAdmin && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          👁️‍🗨️ Tạm ẩn
                        </span>
                      )}
                    </div>

                    {/* Top Right Action Icons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyLink(item)}
                        title="Sao chép liên kết"
                        className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {copiedId === item.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={(e) => handleToggleFeature(item, e)}
                            title={item.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim nổi bật'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${item.isFeatured ? 'text-amber-500' : 'text-[#748092] hover:text-amber-500'}`}
                          >
                            <Star size={15} className={item.isFeatured ? 'fill-amber-400' : ''} />
                          </button>
                          <button
                            onClick={(e) => handleToggleHide(item, e)}
                            title={item.isHidden ? 'Hiện công khai tài liệu' : 'Tạm ẩn tài liệu'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${item.isHidden ? 'text-amber-600' : 'text-[#748092] hover:text-gray-700'}`}
                          >
                            <SlidersHorizontal size={15} />
                          </button>
                        </>
                      )}

                      {(item.isCustom || isAdmin) && (
                        <button
                          onClick={(e) => handleDeleteMaterial(item.id, item.title, e)}
                          title="Xóa tài liệu này"
                          className="p-1.5 rounded-lg text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => toggleBookmark(item.id, item.title)}
                        title={isBookmarked ? 'Bỏ lưu' : 'Lưu tài liệu yêu thích'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B]'
                            : 'text-[#748092] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => {
                      playClickSound();
                      setSelectedPreviewDoc(item);
                      setPreviewTab('excerpt');
                    }}
                    className="text-base font-bold text-[#243447] dark:text-white line-clamp-2 leading-snug group-hover:text-[#E85D3F] transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Skills Chips */}
                  {Array.isArray(item.skills) && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                        >
                          🎯 {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata Strip */}
                  <div className="pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-[11px] text-[#748092] dark:text-[#94A3B8] space-y-1.5">
                    
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe size={12} className="shrink-0 text-[#E85D3F]" />
                      <span className="font-semibold text-[#243447] dark:text-[#E2E8F0] truncate">
                        {item.publisher || item.author || 'HanziGo Biên soạn'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#748092] dark:text-[#94A3B8]">
                      <span>Định dạng: <strong className="text-[#243447] dark:text-white">{item.format}</strong></span>
                      <span className="truncate max-w-[140px] text-right" title={item.license}>
                        📜 {item.license || 'Trích dẫn học thuật'}
                      </span>
                    </div>

                    {item.relatedLessonId && (
                      <div 
                        onClick={() => {
                          playClickSound();
                          const match = String(item.relatedLessonId).match(/\b(\d+)\b/);
                          if (match && onSelectLesson) {
                            onSelectLesson(match[1]);
                          } else if (setActiveTab) {
                            setActiveTab('roadmap');
                          }
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-[#E85D3F] hover:underline cursor-pointer pt-0.5"
                        title="Bấm để mở bài học hoặc lộ trình tương ứng"
                      >
                        <Compass size={12} className="shrink-0" />
                        <span className="truncate">Lộ trình: {item.relatedLessonId}</span>
                      </div>
                    )}

                  </div>

                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedPreviewDoc(item);
                      setPreviewTab('excerpt');
                    }}
                    className="px-3 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#FEF7E9] text-[#243447] dark:text-white text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Xem đọc mẫu</span>
                  </button>

                  <a
                    href={item.sourceUrl || item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDownloadClick(item)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#CB4529] hover:to-[#B9381E] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center gap-1.5 transition-all group-hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {isPrintable ? <Printer size={14} /> : <ExternalLink size={14} />}
                    <span>{isPrintable ? 'Mở & In' : 'Nguồn gốc'}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 7. EMPTY STATE */}
      {!isLoading && filteredMaterials.length === 0 && (
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4 max-w-lg mx-auto shadow-sm animate-in fade-in">
          <FileText size={48} className="mx-auto text-[#748092]" />
          <h3 className="text-base font-bold text-[#243447] dark:text-white">
            Không tìm thấy tài liệu phù hợp
          </h3>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
            Không có tài liệu nào khớp với từ khóa tìm kiếm hoặc các tiêu chí lọc hiện tại của bạn.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl bg-[#243447] text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Đặt lại toàn bộ lọc</span>
            </button>
            {isAdmin ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm tài liệu (Admin)</span>
              </button>
            ) : (
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={14} />
                <span>Yêu cầu tài liệu mới</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 8. COPYRIGHT & COMPLIANCE FOOTER NOTE */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#748092] dark:text-[#94A3B8] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-[#243447] dark:text-white">
          <ShieldCheck size={18} className="text-emerald-600" />
          <span className="text-sm">Cam kết bản quyền & Trách nhiệm học thuật HanziGo</span>
        </div>
        <p className="leading-relaxed text-xs">
          HanziGo cam kết bảo vệ sở hữu trí tuệ của các tổ chức khảo thí và nhà xuất bản (CTI Chinesetest, Đại học Ngôn ngữ Bắc Kinh BLCU, Khổng Tử Học Viện). Hệ thống ưu tiên lưu trữ siêu dữ liệu (metadata), đối chiếu chuẩn khung HSK và liên kết trực tiếp tới nguồn gốc phát hành chính thức hoặc kho học liệu mở (OER). HanziGo tuyệt đối không sao chép hoặc phân phối trái phép các tác phẩm có bản quyền thương mại.
        </p>
      </div>

      {/* 9. MODAL: INTERACTIVE DOCUMENT READER & PREVIEW STUDIO */}
      {selectedPreviewDoc && (() => {
        const modalMeta = VERIFICATION_STATUS_META[selectedPreviewDoc.verificationStatus] || VERIFICATION_STATUS_META.curated;
        const excerpt = SAMPLE_EXCERPTS[selectedPreviewDoc.id] || {
          type: 'general',
          title: `Trích đoạn & Nội dung then chốt: ${selectedPreviewDoc.title}`,
          subtitle: selectedPreviewDoc.publisher || 'HanziGo Academic'
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-3xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${modalMeta.badgeClass} flex items-center gap-1`}>
                    <span>{modalMeta.icon}</span>
                    <span>{modalMeta.label}</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                    {selectedPreviewDoc.level}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                    {selectedPreviewDoc.category}
                  </span>
                  {selectedPreviewDoc.isCustom && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      Tự thêm
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Metadata Strip */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white leading-snug">
                  {selectedPreviewDoc.title}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[#748092] block text-[10px]">Định dạng</span>
                    <strong className="text-[#243447] dark:text-white">{selectedPreviewDoc.format}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[#748092] block text-[10px]">Nhà xuất bản</span>
                    <strong className="text-[#243447] dark:text-white truncate block">
                      {selectedPreviewDoc.publisher || selectedPreviewDoc.author || 'HanziGo'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[#748092] block text-[10px]">Ngôn ngữ</span>
                    <strong className="text-[#243447] dark:text-white truncate block">
                      {selectedPreviewDoc.language || 'Song ngữ Trung - Việt'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[#748092] block text-[10px]">Lượt quan tâm</span>
                    <strong className="text-[#E85D3F]">
                      {selectedPreviewDoc.downloadsCount ? `${selectedPreviewDoc.downloadsCount.toLocaleString()} lượt` : 'Mới'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Preview Studio Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setPreviewTab('excerpt')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    previewTab === 'excerpt'
                      ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                      : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>Trích đoạn đọc mẫu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('provenance')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    previewTab === 'provenance'
                      ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                      : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Thẩm định & Bản quyền</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('ecosystem')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    previewTab === 'ecosystem'
                      ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                      : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  <Layers size={14} />
                  <span>Học cùng HanziGo</span>
                </button>
              </div>

              {/* TAB 1: INTERACTIVE EXCERPT READER */}
              {previewTab === 'excerpt' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FEF7E9] dark:from-[#131B24] dark:via-[#1B2636] dark:to-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
                      <div>
                        <h4 className="text-sm font-black text-[#243447] dark:text-white flex items-center gap-2">
                          <Sparkles size={16} className="text-[#E85D3F]" />
                          <span>{excerpt.title}</span>
                        </h4>
                        <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                          {excerpt.subtitle}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        Đọc thử miễn phí
                      </span>
                    </div>

                    {/* Excerpt Type: Vocab Table */}
                    {excerpt.type === 'vocab_table' && (
                      <div className="space-y-2">
                        <div className="divide-y divide-[#F1E5D8]/70 dark:divide-[#2B3A4F]/70">
                          {excerpt.items.map((it, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="font-['Noto_Serif_SC'] text-xl font-black text-[#E85D3F]">
                                  {it.hanzi}
                                </span>
                                <div>
                                  <p className="font-bold text-[#243447] dark:text-white">{it.pinyin} • <span className="text-[#D97706]">{it.hanViet}</span></p>
                                  <p className="text-[#748092] dark:text-[#94A3B8] text-[11px]">{it.meaning}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => speakChinese(it.hanzi)}
                                className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] hover:bg-orange-100 transition-colors cursor-pointer"
                                title="Nghe phát âm"
                              >
                                <Volume2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Excerpt Type: Dialogue */}
                    {excerpt.type === 'dialogue' && (
                      <div className="space-y-3">
                        {excerpt.lines.map((ln, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">{ln.speaker}</span>
                              <button 
                                onClick={() => speakChinese(ln.hanzi)}
                                className="text-xs text-[#748092] hover:text-[#E85D3F] flex items-center gap-1 cursor-pointer"
                              >
                                <Volume2 size={12} />
                                <span>Nghe</span>
                              </button>
                            </div>
                            <p className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">{ln.hanzi}</p>
                            <p className="text-xs text-[#D97706] font-semibold">{ln.pinyin}</p>
                            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">Ý nghĩa: {ln.viet}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Excerpt Type: Radicals */}
                    {excerpt.type === 'radicals' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {excerpt.items.map((rad, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-['Noto_Serif_SC'] text-2xl font-black text-[#E85D3F]">{rad.radical}</span>
                              <div>
                                <h5 className="text-xs font-bold text-[#243447] dark:text-white">{rad.name} ({rad.strokes} nét)</h5>
                                <p className="text-[11px] text-[#748092]">{rad.meaning}</p>
                              </div>
                            </div>
                            <p className="text-[11px] text-[#D97706] font-semibold pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                              Chữ ví dụ: {rad.examples}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Excerpt Type: Grammar */}
                    {excerpt.type === 'grammar' && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                          <strong>Công thức:</strong> {excerpt.formula}
                        </div>
                        <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                          {excerpt.explanation}
                        </p>
                        <div className="space-y-2">
                          {excerpt.examples.map((ex, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1">
                              <p className="font-bold text-[#243447] dark:text-white">{ex.correct || ex.incorrect}</p>
                              <p className="text-[#748092] dark:text-[#94A3B8]">{ex.viet}</p>
                              <span className="text-[11px] text-[#E85D3F] font-semibold block">{ex.note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Excerpt Type: Mock Quiz */}
                    {excerpt.type === 'quiz' && (
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                          <p className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">{excerpt.question}</p>
                          <p className="text-xs text-[#D97706] font-semibold">{excerpt.pinyin}</p>
                          <p className="text-xs text-[#748092]">Dịch nghĩa: {excerpt.translation}</p>
                        </div>
                        
                        <div className="space-y-2">
                          {excerpt.options.map((opt, oIdx) => {
                            const isAnswered = quizAnsweredIndex !== null;
                            const isChosen = quizAnsweredIndex === oIdx;
                            let btnCls = 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';
                            if (isAnswered) {
                              if (opt.correct) btnCls = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                              else if (isChosen) btnCls = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300';
                              else btnCls = 'opacity-50 border-[#F1E5D8]';
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={isAnswered}
                                onClick={() => {
                                  playClickSound();
                                  setQuizAnsweredIndex(oIdx);
                                  if (opt.correct) playSuccessSound();
                                  else playErrorSound();
                                }}
                                className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${btnCls}`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>

                        {quizAnsweredIndex !== null && (
                          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                            💡 <strong>Giải thích chi tiết:</strong> {excerpt.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Excerpt Type: General Fallback */}
                    {excerpt.type === 'general' && (
                      <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                        {selectedPreviewDoc.description}
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* TAB 2: PROVENANCE & COPYRIGHT */}
              {previewTab === 'provenance' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-blue-50/70 dark:from-emerald-950/30 dark:to-blue-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-3">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck size={18} />
                      <span className="text-sm">Xác minh nguồn gốc & Điều kiện bản quyền</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-[#748092] dark:text-[#94A3B8] block text-[11px]">Giấy phép phân phối:</span>
                        <strong className="text-[#243447] dark:text-white">
                          {selectedPreviewDoc.license || 'Trích dẫn học thuật'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#748092] dark:text-[#94A3B8] block text-[11px]">Trạng thái thẩm định:</span>
                        <strong className="text-[#243447] dark:text-white">
                          {modalMeta.label}
                        </strong>
                      </div>
                    </div>

                    {selectedPreviewDoc.verificationNotes && (
                      <p className="text-xs text-[#243447] dark:text-[#CBD5E1] bg-white/70 dark:bg-black/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 leading-relaxed">
                        <strong>Đánh giá học thuật:</strong> {selectedPreviewDoc.verificationNotes}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-emerald-100 dark:border-emerald-900/40">
                      <span className="text-[#748092] dark:text-[#94A3B8]">URL gốc nhà phát hành:</span>
                      <a
                        href={selectedPreviewDoc.sourceUrl || selectedPreviewDoc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E85D3F] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink size={13} />
                        <span>Mở trang phát hành gốc</span>
                      </a>
                    </div>
                  </div>

                  {/* Skills Focus */}
                  {Array.isArray(selectedPreviewDoc.skills) && selectedPreviewDoc.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider block">
                        Kỹ năng trọng tâm rèn luyện:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPreviewDoc.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                          >
                            🎯 {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedPreviewDoc.tags && selectedPreviewDoc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {selectedPreviewDoc.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: HỌC CÙNG HỆ SINH THÁI HANZIGO */}
              {previewTab === 'ecosystem' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* ROADMAP CURRICULUM INTEGRATION LINK */}
                  {selectedPreviewDoc.relatedLessonId && (
                    <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                          📍 Tương thích Lộ trình học HanziGo:
                        </span>
                        <strong className="text-[#243447] dark:text-white text-sm">
                          {selectedPreviewDoc.relatedLessonId}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSelectLesson && (
                          <button
                            onClick={() => {
                              playClickSound();
                              const match = String(selectedPreviewDoc.relatedLessonId).match(/\b(\d+)\b/);
                              const targetLesson = match ? match[1] : selectedPreviewDoc.relatedLessonId;
                              setSelectedPreviewDoc(null);
                              onSelectLesson(targetLesson);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <BookOpen size={14} />
                            <span>Vào bài học ngay</span>
                          </button>
                        )}
                        {setActiveTab && (
                          <button
                            onClick={() => {
                              playClickSound();
                              setSelectedPreviewDoc(null);
                              setActiveTab('roadmap');
                            }}
                            className="px-4 py-2 rounded-xl border border-[#E85D3F] text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Compass size={14} />
                            <span>Xem Lộ trình</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cross Practice Shortcuts with other modules */}
                  {setActiveTab && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                      <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider block">
                        🚀 Luyện tập bổ trợ cùng HanziGo:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          onClick={() => {
                            playClickSound();
                            setSelectedPreviewDoc(null);
                            setActiveTab('writing');
                          }}
                          className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-orange-200 dark:border-orange-900/40 cursor-pointer"
                        >
                          <PenTool size={14} />
                          <span>Luyện viết chữ Hán</span>
                        </button>
                        <button
                          onClick={() => {
                            playClickSound();
                            setSelectedPreviewDoc(null);
                            setActiveTab('pronunciation');
                          }}
                          className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-emerald-200 dark:border-emerald-900/40 cursor-pointer"
                        >
                          <Mic size={14} />
                          <span>Luyện phát âm AI</span>
                        </button>
                        <button
                          onClick={() => {
                            playClickSound();
                            setSelectedPreviewDoc(null);
                            setActiveTab('vocabulary');
                          }}
                          className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-blue-200 dark:border-blue-900/40 cursor-pointer"
                        >
                          <BookOpen size={14} />
                          <span>Flashcards SRS</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Study Tips Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FEF7E9] to-[#FFF9F2] dark:from-[#2D2619] dark:to-[#1E293B] border border-[#F4B942]/40 text-xs text-[#243447] dark:text-[#CBD5E1] space-y-2">
                    <h4 className="font-bold text-[#D97706] flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Mẹo khai thác tài liệu hiệu quả cùng HanziGo:</span>
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#748092] dark:text-[#94A3B8]">
                      <li>Đối với giáo trình và đề thi có Audio: Nghe lặp lại 2-3 lần trước khi xem phụ đề / transcript.</li>
                      <li>Đối với vở tập viết mễ tự: In khổ A4 và sử dụng bút gel mực đen 0.5 - 0.7mm để nét chữ sắc sảo.</li>
                      <li>Ghi nhớ từ vựng qua âm Hán-Việt tương đồng để tăng tốc gấp đôi hiệu suất học.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Modal Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(selectedPreviewDoc.id, selectedPreviewDoc.title)}
                    className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer"
                  >
                    <Heart size={14} className={bookmarkedIds.includes(selectedPreviewDoc.id) ? 'fill-[#E85D3F] text-[#E85D3F]' : 'text-[#748092]'} />
                    <span>{bookmarkedIds.includes(selectedPreviewDoc.id) ? 'Đã lưu yêu thích' : 'Lưu yêu thích'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(selectedPreviewDoc)}
                    className="px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer"
                  >
                    <Copy size={14} />
                    <span>Sao chép link</span>
                  </button>

                  {(selectedPreviewDoc.isCustom || isAdmin) && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMaterial(selectedPreviewDoc.id, selectedPreviewDoc.title, e)}
                      className="px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>

                <a
                  href={selectedPreviewDoc.sourceUrl || selectedPreviewDoc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleDownloadClick(selectedPreviewDoc)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#E85D3F]/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  {(selectedPreviewDoc.format || '').includes('In') || (selectedPreviewDoc.downloadUrl || '').endsWith('.html') ? (
                    <>
                      <Printer size={16} />
                      <span>Mở In & Tải File</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={16} />
                      <span>Mở Nguồn Gốc / Tải Ngay</span>
                    </>
                  )}
                </a>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 10. MODAL: QUICK MIZIGE SHEET GENERATOR & PRINT STUDIO */}
      {showMizigeGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Printer size={18} className="text-[#E85D3F]" />
                  <span>Xưởng Tạo Giấy Luyện Viết Ô Mễ Tự A4</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Nhập chữ Hán bất kỳ để tạo trang kẻ ô mễ tự (米字格) 8 hướng chuẩn và in ra giấy A4.
                </p>
              </div>
              <button
                onClick={() => setShowMizigeGenModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Chữ Hán hoặc cụm từ bạn muốn luyện viết:
                </label>
                <input
                  type="text"
                  value={mizigeInputText}
                  onChange={(e) => setMizigeInputText(e.target.value)}
                  placeholder="Ví dụ: 学海无涯, 你好, 汉语..."
                  className="w-full px-4 py-2.5 rounded-xl text-base font-semibold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Grid Style Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#748092]">Kiểu lưới:</span>
                {[
                  { id: 'mizige', label: 'Ô Mễ Tự (米字格 - 8 hướng)' },
                  { id: 'tianzige', label: 'Điền Tự Cách (田字格 - 4 ô)' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      playClickSound();
                      setMizigeGridStyle(st.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mizigeGridStyle === st.id
                        ? 'bg-[#E85D3F] text-white shadow-xs'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Real-time Visual Preview Canvas */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131B24] border-2 border-dashed border-[#F4B942]/60 flex flex-wrap items-center justify-center gap-4 min-h-[160px]">
                {(mizigeInputText.trim() || '永').split('').map((char, cIdx) => (
                  <div key={cIdx} className="relative w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#E85D3F] bg-[#FFFDF9] dark:bg-[#1E293B] flex items-center justify-center select-none shadow-xs">
                    {/* Mizige Dashed Guidelines */}
                    <div className="absolute inset-0 border-t border-dashed border-red-300 dark:border-red-900/60 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute inset-0 border-l border-dashed border-red-300 dark:border-red-900/60 left-1/2 -translate-x-1/2 pointer-events-none" />
                    {mizigeGridStyle === 'mizige' && (
                      <>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-red-200 dark:stroke-red-900/40" strokeDasharray="3 3">
                          <line x1="0" y1="0" x2="100%" y2="100%" />
                          <line x1="100%" y1="0" x2="0" y2="100%" />
                        </svg>
                      </>
                    )}
                    <span className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl font-black text-[#243447] dark:text-white relative z-10 opacity-75">
                      {char}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                💡 Khổ giấy được thiết lập chuẩn tỉ lệ A4 (210 x 297 mm), bạn có thể mở trang in độc quyền của HanziGo để xuất file PDF hoặc in trực tiếp qua máy in.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowMizigeGenModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  Đóng
                </button>
                <a
                  href="/vo-tap-viet-chu-han-a4.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Mở Trang In Chuẩn A4 Toàn Màn Hình</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 11. MODAL: ADD CUSTOM MATERIAL (ADMIN ONLY) */}
      {showAddModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-[#E85D3F]" />
                  <span>Đóng Góp Tài Liệu Vào Thư Viện</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Lưu trữ metadata và liên kết đến tài liệu chuẩn, đề thi thử hoặc tài nguyên giáo dục mở.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
                ⚡ Gợi ý mẫu tài liệu chuẩn (Nhấp để điền nhanh toàn bộ):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_MATERIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium text-left truncate max-w-full cursor-pointer"
                  >
                    {sug.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddNewMaterial} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Tiêu đề tài liệu *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Giáo trình Chuẩn HSK 3 kèm Audio..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Chuyên mục
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_CATEGORIES.filter(c => c !== 'Tất cả').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Cấp độ phù hợp
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_LEVELS.filter(l => l !== 'Tất cả').map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Kỹ năng trọng tâm (cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="Nghe hiểu, Đọc hiểu, Ngữ pháp..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Nhà xuất bản / Tổ chức phát hành
                  </label>
                  <input
                    type="text"
                    value={newPublisher}
                    onChange={(e) => setNewPublisher(e.target.value)}
                    placeholder="BLCU Press, CTI, Khổng Tử Học Viện..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Định dạng
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_FORMATS.map((fmt) => (
                      <option key={fmt} value={fmt}>{fmt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Giấy phép / Bản quyền
                  </label>
                  <input
                    type="text"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    placeholder="OER, CC-BY, Trích dẫn học thuật..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Trạng thái kiểm định
                  </label>
                  <select
                    value={newVerificationStatus}
                    onChange={(e) => setNewVerificationStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="verified_official">🛡️ Chính thức CTI / Hanban</option>
                    <option value="verified_oer">✅ Giáo dục Mở OER / CC</option>
                    <option value="academic_reference">🏛️ Đại học BLCU / Học thuật</option>
                    <option value="curated">⭐ Tuyển chọn nội bộ HanziGo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Liên kết Lộ trình học (Module / Bài học)
                  </label>
                  <input
                    type="text"
                    value={newRelatedLessonId}
                    onChange={(e) => setNewRelatedLessonId(e.target.value)}
                    placeholder="Ví dụ: Module 1.1 (Bài 101-105)"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Ngôn ngữ thể hiện
                  </label>
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Song ngữ Trung - Việt, Tiếng Trung Giản thể..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    URL Nguồn gốc phát hành *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://chinesetest.cn... hoặc link nguồn gốc"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    URL Tải / Xem trực tuyến
                  </label>
                  <input
                    type="text"
                    value={newDownloadUrl}
                    onChange={(e) => setNewDownloadUrl(e.target.value)}
                    placeholder="https://drive.google.com/... hoặc link tải"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Mô tả chi tiết nội dung
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Giới thiệu nội dung, cấu trúc sách, đối tượng phù hợp và cách học hiệu quả..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Ghi chú kiểm định học thuật & Đánh giá nguồn
                </label>
                <input
                  type="text"
                  value={newVerificationNotes}
                  onChange={(e) => setNewVerificationNotes(e.target.value)}
                  placeholder="Đã xác thực qua website chính thức CTI, cấp phép theo điều khoản giáo dục..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Thẻ từ khóa (phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="HSK 1, Ngữ pháp, Audio, Đề thi, CTI..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || (!newSourceUrl.trim() && !newDownloadUrl.trim())}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Lưu & Chia sẻ tài liệu</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 12. MODAL: REQUEST A MATERIAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Send size={18} className="text-[#E85D3F]" />
                  <span>Yêu Cầu Tài Liệu Học Tập Mới</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Bạn đang tìm kiếm giáo trình, file Audio hoặc bộ đề nào mà chưa có trong kho?
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestMaterialSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Tên tài liệu / Giáo trình muốn yêu cầu *
                </label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="Ví dụ: Giáo trình Hán ngữ Boya Sơ cấp tập 2, Đề thi HSK 5 có audio..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Chuyên mục
                  </label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_CATEGORIES.filter(c => c !== 'Tất cả').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Cấp độ HSK
                  </label>
                  <select
                    value={reqLevel}
                    onChange={(e) => setReqLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_LEVELS.filter(l => l !== 'Tất cả').map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Định dạng học liệu mong muốn
                </label>
                <select
                  value={reqFormat}
                  onChange={(e) => setReqFormat(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="PDF + MP3">📄+🎧 PDF kèm Audio MP3</option>
                  <option value="PDF">📄 Sách / Giáo trình PDF</option>
                  <option value="Audio MP3">🎧 Tệp âm thanh MP3</option>
                  <option value="Trực tuyến & Web">💻 Web tương tác trực tuyến</option>
                  <option value="In ấn A4">🖨️ Tài liệu in ấn A4</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Ghi chú hoặc link tham khảo (nếu có)
                </label>
                <textarea
                  rows={3}
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  placeholder="Mô tả cụ thể phiên bản bạn cần (Ví dụ: Cần file nghe MP3 bài 5-10, sách tái bản mới...)"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!reqTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Gửi yêu cầu tài liệu (+10 XP)</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
