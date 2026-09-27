import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Download, 
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
  Layers,
  ArrowRight,
  Star
} from 'lucide-react';
import { 
  getStoredMaterials, 
  saveMaterial, 
  deleteMaterial,
  MATERIAL_CATEGORIES, 
  MATERIAL_LEVELS,
  MATERIAL_FORMATS
} from '../utils/materialsStorage';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { 
  triggerCloudSync, 
  getMaterialsFromDb, 
  addMaterialToDb, 
  deleteMaterialFromDb 
} from '../supabase/services';
import { awardXp } from '../utils/gamification';

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

// Quick suggestions for rapid material addition
const QUICK_MATERIAL_SUGGESTIONS = [
  {
    title: '500 Mẫu Câu Giao Tiếp Khẩu Ngữ Tiếng Trung Đời Sống Hàng Ngày',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 2',
    format: 'PDF + MP3',
    fileSize: '500 mẫu câu thực tế',
    author: 'HanziGo Biên soạn',
    downloadUrl: 'https://www.youtube.com/results?search_query=500+cau+giao+tiep+tieng+trung',
    description: 'Tuyển tập 500 câu khẩu ngữ ngắn gọn, thông dụng nhất dùng khi đi chợ, gọi món, đi taxi, làm quen, chúc tụng và xử lý tình huống giao tiếp thường ngày.',
    tags: 'Giao tiếp, Khẩu ngữ, HSK 2, Đàm thoại'
  },
  {
    title: 'Sổ Tay 100 Cấu Trúc Ngữ Pháp Tiếng Trung Trọng Tâm HSK 3 - 4',
    category: 'Ngữ pháp chuyên sâu',
    level: 'HSK 3',
    format: 'PDF',
    fileSize: '100 cấu trúc ngữ pháp',
    author: 'Khoa Ngôn ngữ BLCU',
    downloadUrl: 'https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points',
    description: 'Tổng hợp chi tiết các mẫu câu liên từ, phó từ chỉ mức độ, câu chữ 把, câu chữ 被, bổ ngữ xu hướng kép và cách phân biệt các cặp từ đồng nghĩa hay bị nhầm lẫn.',
    tags: 'Ngữ pháp, HSK 3, Luyện thi, Cấu trúc câu'
  },
  {
    title: 'Bộ Đề Thi Thử HSK 2 Đầy Đủ Đọc Hiểu & Nghe Kèm Đáp Án Chi Tiết',
    category: 'Đề thi HSK',
    level: 'HSK 2',
    format: 'PDF + MP3',
    fileSize: '5 bộ đề thi chuẩn',
    author: 'CTI Chinesetest',
    downloadUrl: 'https://www.chinesetest.cn/godownload.do',
    description: 'Trọn bộ 5 đề thi thử mô phỏng 100% cấu trúc đề thi thật của Hanban / CTI. Có file nghe giọng Bắc Kinh chuẩn và bảng giải thích đáp án chi tiết từng câu.',
    tags: 'Đề thi, HSK 2, Có đáp án, File nghe MP3'
  },
  {
    title: 'Bảng Tổng Hợp 100 Cụm Từ Lóng & Ngôn Ngữ Mạng Tiếng Trung Douyin',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 3',
    format: 'Trực tuyến & MP3',
    fileSize: 'Tài liệu bổ trợ',
    author: 'Cộng đồng HanziGo',
    downloadUrl: 'https://en.wiktionary.org/wiki/Appendix:Mandarin_chengyu',
    description: 'Khám phá ngôn ngữ mạng và từ lóng hiện đại của giới trẻ Trung Quốc trên Douyin, Weibo, Xiaohongshu giúp bạn trò chuyện tự nhiên và gần gũi.',
    tags: 'Từ lóng, Giới trẻ, Giao tiếp thực tế, Douyin'
  }
];

export default function MaterialsPage({ setActiveTab }) {
  const [materials, setMaterials] = useState(() => getStoredMaterials());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all', 'bookmarked', 'custom'
  const [formatFilter, setFormatFilter] = useState('all'); // 'all', 'pdf', 'audio', 'interactive', 'print'
  const [sortBy, setSortBy] = useState('downloads'); // 'downloads', 'newest', 'name'
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  // Bookmarks state (persisted in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_bookmarked_materials');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);

  // New Material Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Giáo trình chuẩn');
  const [newLevel, setNewLevel] = useState('HSK 1');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newFileSize, setNewFileSize] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
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
    getMaterialsFromDb().then(dbItems => {
      if (!isMounted || !dbItems || dbItems.length === 0) return;
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
    });
    return () => { isMounted = false; };
  }, []);

  // Sync / Refresh with Supabase cloud
  const handleRefreshCloud = async () => {
    setIsSyncing(true);
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
      showToast('Đã kết nối kho tài liệu cục bộ.');
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
      showToast(`Đã lưu tài liệu vào danh sách yêu thích!`);
      playSuccessSound();
      awardXp(5);
    }
    setBookmarkedIds(updated);
    localStorage.setItem('hanzigo_bookmarked_materials', JSON.stringify(updated));
    triggerCloudSync();
  };

  // Copy document link
  const handleCopyLink = (item) => {
    playClickSound();
    const fullUrl = item.downloadUrl.startsWith('http') 
      ? item.downloadUrl 
      : `${window.location.origin}${item.downloadUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    showToast('Đã sao chép liên kết tài liệu vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Increment download count and open URL
  const handleDownloadClick = (item) => {
    playClickSound();
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === item.id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m
      )
    );
  };

  // Quick fill suggestion
  const handleApplySuggestion = (sug) => {
    playClickSound();
    setNewTitle(sug.title);
    setNewCategory(sug.category);
    setNewLevel(sug.level);
    setNewFormat(sug.format);
    setNewFileSize(sug.fileSize);
    setNewAuthor(sug.author);
    setNewDownloadUrl(sug.downloadUrl);
    setNewDescription(sug.description);
    setNewTags(sug.tags);
  };

  // Handle Add New Material
  const handleAddNewMaterial = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playClickSound();

    const tagList = newTags
      ? newTags.split(/[,，]/).map(t => t.trim()).filter(Boolean)
      : [newCategory, newLevel];

    const newMat = {
      id: `mat-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      level: newLevel,
      format: newFormat || 'PDF',
      fileSize: newFileSize.trim() || 'Tài liệu số',
      author: newAuthor.trim() || 'Người dùng HanziGo',
      description: newDescription.trim() || 'Tài liệu học tiếng Trung do người dùng tự tổng hợp và chia sẻ.',
      downloadUrl: newDownloadUrl.trim() || '#',
      tags: tagList,
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
      downloadsCount: 1
    };

    // 1. Save to local storage
    saveMaterial(newMat);
    const updated = [newMat, ...materials];
    setMaterials(updated);

    // 2. Save to Supabase cloud
    addMaterialToDb(newMat);
    awardXp(20);

    playSuccessSound();
    setShowAddModal(false);
    showToast('Đã thêm tài liệu mới & đồng bộ lên máy chủ! (+20 XP)');

    // Reset Form
    setNewTitle('');
    setNewCategory('Giáo trình chuẩn');
    setNewLevel('HSK 1');
    setNewFormat('PDF');
    setNewFileSize('');
    setNewAuthor('');
    setNewDownloadUrl('');
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

  // Delete Custom Material
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

  // Filtered & Sorted Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
      const matchesLevel = selectedLevel === 'Tất cả' || item.level === selectedLevel;

      let matchesTab = true;
      if (activeTabFilter === 'bookmarked') {
        matchesTab = bookmarkedIds.includes(item.id);
      } else if (activeTabFilter === 'custom') {
        matchesTab = !!item.isCustom;
      }

      let matchesFormat = true;
      if (formatFilter === 'pdf') {
        matchesFormat = (item.format || '').toLowerCase().includes('pdf');
      } else if (formatFilter === 'audio') {
        matchesFormat = (item.format || '').toLowerCase().includes('mp3') || 
          (item.tags && item.tags.some(t => t.toLowerCase().includes('audio') || t.toLowerCase().includes('mp3')));
      } else if (formatFilter === 'interactive') {
        matchesFormat = (item.format || '').toLowerCase().includes('trực tuyến') || 
          (item.format || '').toLowerCase().includes('tương tác') || 
          (item.format || '').toLowerCase().includes('bách khoa');
      } else if (formatFilter === 'print') {
        matchesFormat = (item.format || '').toLowerCase().includes('in') || 
          (item.downloadUrl || '').endsWith('.html');
      }

      if (item.isHidden) return false;

      return matchesSearch && matchesCategory && matchesLevel && matchesTab && matchesFormat;
    }).sort((a, b) => {
      // Pinned / Featured items first
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
  }, [materials, searchTerm, selectedCategory, selectedLevel, activeTabFilter, formatFilter, sortBy, bookmarkedIds]);

  const customMaterialsCount = materials.filter(m => m.isCustom).length;
  const audioMaterialsCount = materials.filter(m => (m.format || '').includes('MP3') || (m.tags && m.tags.some(t => t.toLowerCase().includes('audio')))).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-[#E85D3F] text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-200">
          <CheckCircle2 size={18} className="shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{toast}</p>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#E85D3F] via-[#CB4529] to-[#991B1B] text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              <FolderDown size={14} />
              <span>Kho học liệu & Giáo trình số HanziGo</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-['Noto_Serif_SC']">
              Thư Viện Tài Liệu Tiếng Trung
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Trọn bộ giáo trình Chuẩn HSK 1 - 6, sách ngữ pháp bỏ túi, đề thi thử có đáp án, file nghe Audio chuẩn Bắc Kinh và sổ tay luyện viết chữ Hán mễ tự hoàn toàn miễn phí.
            </p>
            
            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-black/20 font-medium backdrop-blur-sm">
                📚 <strong>{materials.length}</strong> tài liệu học tập
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/20 font-medium backdrop-blur-sm">
                🎧 <strong>{audioMaterialsCount}</strong> tài liệu có file Audio
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/20 font-medium backdrop-blur-sm">
                ⭐ <strong>{bookmarkedIds.length}</strong> tài liệu đã lưu
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            
            {/* Primary Add Material Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowAddModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-white text-[#E85D3F] hover:bg-[#FFF9F2] font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              <span>Thêm tài liệu mới</span>
            </button>

            {/* Request Document Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowRequestModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Send size={14} />
              <span>📬 Yêu cầu tài liệu</span>
            </button>

            {/* Refresh from Supabase */}
            <button
              onClick={handleRefreshCloud}
              disabled={isSyncing}
              title="Đồng bộ lại danh mục tài liệu từ máy chủ"
              className="px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-white/90 text-xs font-semibold backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 self-center md:self-end"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Đang tải...' : 'Làm mới máy chủ'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Chinese watermark */}
        <div className="absolute right-4 -bottom-6 font-['Noto_Serif_SC'] text-9xl font-black text-white/10 select-none pointer-events-none">
          资料
        </div>
      </div>

      {/* FEATURED EXCLUSIVE TOOLS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E85D3F]/10 text-[#E85D3F]">
              <Sparkles size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
              Học Cụ & Tiện Ích Độc Quyền HanziGo
            </h2>
          </div>
          <span className="text-xs text-[#748092] font-semibold hidden sm:inline">
            Tích hợp sẵn & In ấn không cần tài khoản
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
                  className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
        
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#748092]" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, giáo trình, đề thi HSK, tác giả, từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs sm:text-sm font-semibold text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#748092] hover:text-[#243447]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Quick Filter Tabs: Tất cả vs Đã lưu vs Tự thêm */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'all', label: `Tất cả (${materials.length})` },
              { id: 'bookmarked', label: `❤️ Đã lưu (${bookmarkedIds.length})` },
              { id: 'custom', label: `🌟 Tự thêm (${customMaterialsCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTabFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTabFilter === tab.id
                    ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-sm'
                    : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
            <span>Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
            >
              <option value="downloads">Lượt tải nhiều nhất</option>
              <option value="newest">Mới cập nhật</option>
              <option value="name">Tên tài liệu A - Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Level Filter */}
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Cấp độ:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
            >
              {MATERIAL_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Format Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
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
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                formatFilter === fmt.id
                  ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-sm'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447]'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((item) => {
          const isBookmarked = bookmarkedIds.includes(item.id);
          const hasAudio = (item.format || '').includes('MP3') || (item.tags && item.tags.some(t => t.toLowerCase().includes('audio')));
          const isPrintable = (item.format || '').includes('In') || (item.downloadUrl || '').endsWith('.html');

          return (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4 group relative"
            >
              
              <div className="space-y-3.5">
                
                {/* Badges top row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                      {item.level}
                    </span>
                    {hasAudio && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Headphones size={10} />
                        Audio
                      </span>
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
                  </div>

                  {/* Top Right Action Icons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyLink(item)}
                      title="Sao chép liên kết"
                      className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      {copiedId === item.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>

                    {item.isCustom && (
                      <button
                        onClick={(e) => handleDeleteMaterial(item.id, item.title, e)}
                        title="Xóa tài liệu này"
                        className="p-1.5 rounded-lg text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => toggleBookmark(item.id, item.title)}
                      title={isBookmarked ? 'Bỏ lưu' : 'Lưu tài liệu yêu thích'}
                      className={`p-1.5 rounded-lg transition-colors ${
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
                  onClick={() => setSelectedPreviewDoc(item)}
                  className="text-base font-bold text-[#243447] dark:text-white line-clamp-2 leading-snug group-hover:text-[#E85D3F] transition-colors cursor-pointer"
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* File info details */}
                <div className="pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-[11px] text-[#748092] dark:text-[#94A3B8] space-y-1">
                  {item.author && (
                    <p className="truncate"><span className="font-semibold">Nguồn/Tác giả:</span> {item.author}</p>
                  )}
                  <div className="flex items-center justify-between text-[10px]">
                    <span>Định dạng: <strong className="text-[#243447] dark:text-white">{item.format}</strong></span>
                    {item.fileSize && <span>{item.fileSize}</span>}
                  </div>
                </div>

              </div>

              {/* Action Buttons: Preview vs Download */}
              <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreviewDoc(item)}
                  className="px-3 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#FEF7E9] text-[#243447] dark:text-white text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={14} />
                  <span>Chi tiết</span>
                </button>

                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleDownloadClick(item)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#CB4529] hover:to-[#B9381E] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center gap-1.5 transition-all group-hover:scale-105 active:scale-95"
                >
                  {isPrintable ? <Printer size={14} /> : <Download size={14} />}
                  <span>{isPrintable ? 'Mở & In' : 'Tải / Xem'}</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4 max-w-lg mx-auto shadow-sm">
          <FileText size={48} className="mx-auto text-[#748092]" />
          <h3 className="text-base font-bold text-[#243447] dark:text-white">
            Không tìm thấy tài liệu phù hợp
          </h3>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Không có tài liệu nào khớp với bộ lọc hiện tại. Bạn có thể nhấn bên dưới để xem toàn bộ kho tài liệu hoặc tự thêm tài liệu mới.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tất cả');
                setSelectedLevel('Tất cả');
                setActiveTabFilter('all');
                setFormatFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#243447] text-white text-xs font-bold hover:opacity-90"
            >
              Xem tất cả
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529]"
            >
              Thêm tài liệu mới
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM MATERIAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-[#E85D3F]" />
                  <span>Thêm Tài Liệu Mới Vào Thư Viện</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Lưu trữ các giáo trình, link Google Drive, bộ đề thi hoặc tài liệu bạn tâm đắc.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
                ⚡ Gợi ý mẫu tài liệu (Nhấp để điền nhanh toàn bộ):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_MATERIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium text-left truncate max-w-full"
                  >
                    {sug.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddNewMaterial} className="space-y-4">
              
              {/* Title */}
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

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Chuyên mục
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
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
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  >
                    {MATERIAL_LEVELS.filter(l => l !== 'Tất cả').map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Format, Author & FileSize */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Định dạng
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  >
                    {MATERIAL_FORMATS.map((fmt) => (
                      <option key={fmt} value={fmt}>{fmt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Tác giả / Nguồn
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="BLCU, CTI, HanziGo..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Dung lượng / Quy mô
                  </label>
                  <input
                    type="text"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    placeholder="Ví dụ: 150 trang, 25MB..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Đường dẫn tải / Xem trực tuyến (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={newDownloadUrl}
                  onChange={(e) => setNewDownloadUrl(e.target.value)}
                  placeholder="https://drive.google.com/... hoặc đường link tài liệu"
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Mô tả chi tiết nội dung
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Giới thiệu nội dung, cấu trúc sách, đối tượng phù hợp và cách học hiệu quả..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Thẻ từ khóa (phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="HSK 1, Ngữ pháp, Audio, Đề thi..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newDownloadUrl.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Lưu & Chia sẻ tài liệu</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: REQUEST A MATERIAL */}
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
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
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
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
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
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  >
                    {MATERIAL_LEVELS.filter(l => l !== 'Tất cả').map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
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
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!reqTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Gửi yêu cầu tài liệu (+10 XP)</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: DOCUMENT PREVIEW & DETAILS */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                  {selectedPreviewDoc.category}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                  {selectedPreviewDoc.level}
                </span>
                {selectedPreviewDoc.isCustom && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Tự thêm
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Title & Metadata */}
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
                  <span className="text-[#748092] block text-[10px]">Tác giả</span>
                  <strong className="text-[#243447] dark:text-white truncate block">{selectedPreviewDoc.author || 'Nhiều tác giả'}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <span className="text-[#748092] block text-[10px]">Quy mô</span>
                  <strong className="text-[#243447] dark:text-white">{selectedPreviewDoc.fileSize || 'Chuẩn'}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <span className="text-[#748092] block text-[10px]">Lượt quan tâm</span>
                  <strong className="text-[#E85D3F]">
                    {selectedPreviewDoc.downloadsCount ? `${selectedPreviewDoc.downloadsCount.toLocaleString()} lượt` : 'Mới'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider block">
                Mô tả tài liệu:
              </span>
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs sm:text-sm text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                {selectedPreviewDoc.description}
              </div>
            </div>

            {/* Cross Practice Shortcuts with other modules */}
            {setActiveTab && (
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <span className="text-[11px] font-bold text-[#E85D3F] uppercase tracking-wider block">
                  🚀 Luyện tập bổ trợ cùng HanziGo:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setSelectedPreviewDoc(null);
                      setActiveTab('writing');
                    }}
                    className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-orange-200 dark:border-orange-900/40"
                  >
                    <PenTool size={13} />
                    <span>Luyện viết chữ Hán</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPreviewDoc(null);
                      setActiveTab('pronunciation');
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-emerald-200 dark:border-emerald-900/40"
                  >
                    <Mic size={13} />
                    <span>Luyện phát âm AI</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPreviewDoc(null);
                      setActiveTab('vocabulary');
                    }}
                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-blue-200 dark:border-blue-900/40"
                  >
                    <BookOpen size={13} />
                    <span>Học Flashcards HSK</span>
                  </button>
                </div>
              </div>
            )}

            {/* Study Tips Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FEF7E9] to-[#FFF9F2] dark:from-[#2D2619] dark:to-[#1E293B] border border-[#F4B942]/40 text-xs text-[#243447] dark:text-[#CBD5E1] space-y-1.5">
              <h4 className="font-bold text-[#D97706] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Mẹo khai thác tài liệu hiệu quả cùng HanziGo:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#748092] dark:text-[#94A3B8]">
                <li>Đối với giáo trình và đề thi có Audio: Hãy nghe lặp lại 2-3 lần trước khi xem transcript.</li>
                <li>Đối với vở tập viết mễ tự: In khổ A4 và sử dụng bút mực gel đen ngòi 0.5 - 0.7mm để nét chữ sắc sảo.</li>
                <li>Kết hợp Spaced Repetition Flashcards để ghi nhớ nhanh các từ vựng xuất hiện trong tài liệu.</li>
              </ul>
            </div>

            {/* Tags */}
            {selectedPreviewDoc.tags && selectedPreviewDoc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBookmark(selectedPreviewDoc.id, selectedPreviewDoc.title)}
                  className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors"
                >
                  <Heart size={14} className={bookmarkedIds.includes(selectedPreviewDoc.id) ? 'fill-[#E85D3F] text-[#E85D3F]' : 'text-[#748092]'} />
                  <span>{bookmarkedIds.includes(selectedPreviewDoc.id) ? 'Đã lưu yêu thích' : 'Lưu yêu thích'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLink(selectedPreviewDoc)}
                  className="px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors"
                >
                  <Copy size={14} />
                  <span>Sao chép link</span>
                </button>

                {selectedPreviewDoc.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMaterial(selectedPreviewDoc.id, selectedPreviewDoc.title, e)}
                    className="px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    <span>Xóa</span>
                  </button>
                )}
              </div>

              <a
                href={selectedPreviewDoc.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleDownloadClick(selectedPreviewDoc)}
                className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 flex items-center gap-2 transition-all active:scale-95"
              >
                {(selectedPreviewDoc.format || '').includes('In') || (selectedPreviewDoc.downloadUrl || '').endsWith('.html') ? (
                  <>
                    <Printer size={16} />
                    <span>Mở In & Tải File</span>
                  </>
                ) : (
                  <>
                    <ExternalLink size={16} />
                    <span>Mở Tải / Xem Ngay</span>
                  </>
                )}
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
