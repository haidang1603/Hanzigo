import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  X, 
  Compass, 
  Sparkles, 
  Headphones, 
  Layers, 
  Mic, 
  PenTool, 
  MessageSquare, 
  BookOpen, 
  Award, 
  FolderDown, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Trophy, 
  ArrowRight, 
  Volume2, 
  Check 
} from 'lucide-react';
import { searchDictionaryHybrid } from '../../services/dictionaryService.js';
import { CURRICULUM_ALL_LESSONS } from '../../data/curriculumLessons.js';
import { HSK_EXAMS } from '../../data/hskExamsData.js';
import { playClickSound, speakChinese } from '../../utils/audio.js';

// Normalize Vietnamese accents for fuzzy matching
function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * SmartCommandPalette Component
 * Full command palette with role-based filtering, global navigation, curriculum search,
 * HSK exam lookup, and hybrid dictionary integration.
 */
export default function SmartCommandPalette({
  isOpen,
  onClose,
  user = null,
  onNavigate = null,
  onSelectLesson = null
}) {
  const [query, setQuery] = useState('');
  const [dictResults, setDictResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingDict, setIsLoadingDict] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');
  const isTeacher = Boolean(user && (user.role === 'teacher' || isAdmin) && user.status !== 'blocked');

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setDictResults([]);
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Debounced hybrid dictionary search
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 1) {
      setDictResults([]);
      setIsLoadingDict(false);
      return;
    }

    setIsLoadingDict(true);
    let isCancelled = false;

    const timer = setTimeout(async () => {
      try {
        const res = await searchDictionaryHybrid(trimmed, { limit: 6 });
        if (!isCancelled) {
          setDictResults(res || []);
          setIsLoadingDict(false);
        }
      } catch (err) {
        console.warn('Hybrid search notice:', err);
        if (!isCancelled) setIsLoadingDict(false);
      }
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // Build static searchable items with role-based filtering
  const staticNavigationItems = [
    // Core Navigation
    { id: 'nav-home', category: 'Trang & Điều hướng', title: 'Trang chủ & Tổng quan', subtitle: 'Trang chủ thống nhất thích ứng theo vai trò người dùng', tab: 'home', icon: BookOpen },
    { id: 'nav-roadmap', category: 'Trang & Điều hướng', title: 'Lộ trình HSK 1 - 6', subtitle: 'Hành trình 60 bài học chuẩn 9 bước sư phạm', tab: 'roadmap', icon: Compass },
    { id: 'nav-hsk', category: 'Trang & Điều hướng', title: 'Thi thử HSK Chuẩn CTI', subtitle: 'Luyện đề thi thử mô phỏng thời gian thật', tab: 'hsk', icon: Award },
    { id: 'nav-classroom', category: 'Trang & Điều hướng', title: 'Lớp học & Khóa học', subtitle: 'Lớp học trực tuyến và bài tập giáo viên', tab: 'classroom', icon: GraduationCap },
    { id: 'nav-materials', category: 'Trang & Điều hướng', title: 'Thư viện tài liệu số', subtitle: 'Kho giáo trình BLCU, audio và vở ô mễ tự A4', tab: 'materials', icon: FolderDown },
    { id: 'nav-community', category: 'Trang & Điều hướng', title: 'Cộng đồng học viên', subtitle: 'Hỏi đáp bài tập và tìm bạn cùng tiến HSK', tab: 'community', icon: Users },
    { id: 'nav-leaderboard', category: 'Trang & Điều hướng', title: 'Bảng vàng cao thủ', subtitle: 'Bảng xếp hạng kinh nghiệm XP học viên', tab: 'leaderboard', icon: Trophy },

    // Practice & Skills
    { id: 'skill-grammar', category: 'Kỹ năng & Luyện tập', title: 'Luyện ngữ pháp HSK', subtitle: 'Bách khoa cấu trúc câu, chữ 把, chữ 被, câu so sánh', tab: 'grammar', icon: Sparkles },
    { id: 'skill-listening', category: 'Kỹ năng & Luyện tập', title: 'Luyện nghe phản xạ HSK', subtitle: 'Nghe giọng chuẩn Bắc Kinh và trả lời câu hỏi', tab: 'listening', icon: Headphones },
    { id: 'skill-vocab', category: 'Kỹ năng & Luyện tập', title: 'Flashcards Từ vựng HSK', subtitle: 'Hệ thống lặp lại ngắt quãng SRS ghi nhớ sâu', tab: 'vocabulary', icon: Layers },
    { id: 'skill-pronounce', category: 'Kỹ năng & Luyện tập', title: 'Luyện phát âm AI & Pinyin', subtitle: 'Bảng thanh mẫu, vận mẫu và nhận diện giọng nói', tab: 'pronunciation', icon: Mic },
    { id: 'skill-writing', category: 'Kỹ năng & Luyện tập', title: 'Từ điển & Viết chữ Hán', subtitle: 'Quy tắc thuận bút và luyện viết chữ tượng hình', tab: 'writing', icon: PenTool },
    { id: 'skill-conversation', category: 'Kỹ năng & Luyện tập', title: 'Hội thoại phản xạ Lão Sư AI', subtitle: 'Giao tiếp tình huống thực tế cùng gia sư ảo', tab: 'conversation', icon: MessageSquare },
    { id: 'skill-reader', category: 'Kỹ năng & Luyện tập', title: 'Luyện đọc hiểu & Báo chí', subtitle: 'Phân tích từ vựng NLP theo ngữ cảnh bài văn', tab: 'reader', icon: BookOpen },

    // Role-based: Teacher Tools (Strictly guarded)
    ...(isTeacher ? [
      { id: 'teacher-main', category: 'Cổng Giáo viên', title: 'Tổng quan giảng dạy', subtitle: 'Dashboard thống kê lớp học và học viên', tab: 'teacher', sub: null, icon: GraduationCap },
      { id: 'teacher-classes', category: 'Cổng Giáo viên', title: 'Quản lý phòng học & Lớp', subtitle: 'Tạo lớp mới, chia sẻ mã tham gia', tab: 'teacher', sub: 'classes', icon: Users },
      { id: 'teacher-students', category: 'Cổng Giáo viên', title: 'Danh sách học viên', subtitle: 'Theo dõi điểm số và quá trình học của học sinh', tab: 'teacher', sub: 'students', icon: Users },
      { id: 'teacher-grading', category: 'Cổng Giáo viên', title: 'Chấm bài tập & Nhận xét', subtitle: 'Kiểm tra bài nộp của học viên trong lớp', tab: 'teacher', sub: 'grading', icon: Check },
      { id: 'teacher-studio', category: 'Cổng Giáo viên', title: 'AI Lesson Studio', subtitle: 'Tạo giáo án và bài tập hỗ trợ bởi AI', tab: 'teacher', sub: 'ai-studio', icon: Sparkles }
    ] : []),

    // Role-based: Admin Tools (Strictly guarded)
    ...(isAdmin ? [
      { id: 'admin-main', category: 'Quản trị hệ thống', title: 'Bảng điều khiển Admin', subtitle: 'Tổng quan số liệu người dùng và hệ thống', tab: 'admin', icon: ShieldCheck },
      { id: 'admin-users', category: 'Quản trị hệ thống', title: 'Quản lý người dùng', subtitle: 'Phân quyền tài khoản học viên và giáo viên', tab: 'admin', hash: '#admin#users', icon: Users },
      { id: 'admin-moderation', category: 'Quản trị hệ thống', title: 'Kiểm duyệt nội dung cộng đồng', subtitle: 'Xử lý báo cáo bài viết vi phạm', tab: 'admin', hash: '#admin#moderation', icon: ShieldCheck },
      { id: 'admin-materials', category: 'Quản trị hệ thống', title: 'Quản lý tài liệu học tập', subtitle: 'Thêm và kiểm duyệt giáo trình thư viện', tab: 'admin', hash: '#admin#materials', icon: FolderDown }
    ] : [])
  ];

  // Filter static items by search query
  const normalizedQuery = removeVietnameseTones(query.trim());
  const matchedNavItems = staticNavigationItems.filter(item => {
    if (!normalizedQuery) return true;
    const titleNorm = removeVietnameseTones(item.title);
    const subNorm = removeVietnameseTones(item.subtitle);
    return titleNorm.includes(normalizedQuery) || subNorm.includes(normalizedQuery);
  });

  // Filter lessons from 120 curriculum lessons
  const matchedLessons = normalizedQuery ? CURRICULUM_ALL_LESSONS.filter(l => {
    const titleNorm = removeVietnameseTones(l.title || '');
    const titleCn = (l.title_cn || '').toLowerCase();
    const id = (l.id || '').toLowerCase();
    return titleNorm.includes(normalizedQuery) || titleCn.includes(normalizedQuery) || id.includes(normalizedQuery);
  }).slice(0, 5).map(l => ({
    id: `lesson-${l.id}`,
    category: 'Bài học Lộ trình HSK',
    title: `${l.title} (${l.title_cn || ''})`,
    subtitle: `${l.levelId || 'HSK'} • ${l.estimatedMinutes || 25} phút • 9 bước sư phạm`,
    lessonId: l.id,
    icon: Compass
  })) : [];

  // Filter HSK mock exams
  const matchedExams = normalizedQuery ? HSK_EXAMS.filter(e => {
    const titleNorm = removeVietnameseTones(e.title || '');
    const levelNorm = removeVietnameseTones(e.level || '');
    return titleNorm.includes(normalizedQuery) || levelNorm.includes(normalizedQuery);
  }).slice(0, 4).map(e => ({
    id: `exam-${e.id}`,
    category: 'Đề thi thử HSK',
    title: e.title,
    subtitle: `${e.level} • ${e.duration_minutes} phút • ${e.total_questions} câu hỏi chuẩn CTI`,
    tab: 'hsk',
    examId: e.id,
    icon: Award
  })) : [];

  // Format dictionary results
  const formattedDictResults = dictResults.map((v, idx) => ({
    id: `dict-${v.hanzi}-${idx}`,
    category: 'Từ vựng & Từ điển',
    title: `${v.hanzi} (${v.pinyin})`,
    subtitle: `${v.hanviet ? `[${v.hanviet}] ` : ''}${v.meaningVi || v.meaning || ''}`,
    vocabItem: v,
    icon: BookOpen
  }));

  // Combine all matched items into a flat list for keyboard navigation
  const allResults = query.trim()
    ? [...matchedNavItems.slice(0, 8), ...matchedLessons, ...matchedExams, ...formattedDictResults]
    : matchedNavItems.slice(0, 10);

  // Handle action execution
  const executeItem = useCallback((item) => {
    if (!item) return;
    playClickSound();
    onClose();

    if (item.vocabItem) {
      speakChinese(item.vocabItem.hanzi);
      if (onNavigate) onNavigate('writing');
      return;
    }

    if (item.lessonId) {
      if (onSelectLesson) {
        onSelectLesson(item.lessonId);
      } else if (onNavigate) {
        window.location.hash = `#roadmap/${item.lessonId}`;
        onNavigate('roadmap');
      }
      return;
    }

    if (item.examId) {
      window.location.hash = `#hsk/exam/${item.examId}`;
      if (onNavigate) onNavigate('hsk');
      return;
    }

    if (item.hash) {
      window.location.hash = item.hash;
      if (onNavigate) onNavigate(item.tab);
      return;
    }

    if (item.tab && onNavigate) {
      if (item.sub) {
        window.location.hash = `#${item.tab}/${item.sub}`;
      } else {
        window.location.hash = `#${item.tab}`;
      }
      onNavigate(item.tab);
    }
  }, [onClose, onNavigate, onSelectLesson]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (allResults.length > 0 ? (prev + 1) % allResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (allResults.length > 0 ? (prev - 1 + allResults.length) % allResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        executeItem(allResults[selectedIndex]);
      }
    }
  }, [isOpen, allResults, selectedIndex, onClose, executeItem]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Keep active element scrolled into view
  useEffect(() => {
    if (resultsRef.current && resultsRef.current.children[selectedIndex]) {
      resultsRef.current.children[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-label="Truy cập nhanh & Tìm kiếm thông minh"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="relative p-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-3 bg-white dark:bg-[#1E293B]">
          <Search size={20} className="text-[#E85D3F] shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tìm kiếm bài học, từ vựng, ngữ pháp, đề thi hoặc chức năng..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="p-1 text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Quick Category Hints */}
        {!query && (
          <div className="px-5 py-2.5 bg-[#FFF9F2] dark:bg-[#131B24] border-b border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 flex items-center justify-between text-[11px] text-[#748092] dark:text-[#94A3B8] font-medium">
            <span>⚡ Gợi ý truy cập nhanh:</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Phím tắt:</span>
              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border text-[10px] font-mono">↑↓ để chọn</span>
              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border text-[10px] font-mono">↵ để mở</span>
            </div>
          </div>
        )}

        {/* Results List */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
          {isLoadingDict && (
            <div className="py-2 px-4 text-xs text-[#E85D3F] font-semibold flex items-center gap-2 animate-pulse">
              <Sparkles size={14} className="animate-spin" />
              <span>Đang tra cứu từ điển toàn cục...</span>
            </div>
          )}

          {allResults.length > 0 ? (
            allResults.map((item, idx) => {
              const Icon = item.icon || ArrowRight;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border border-[#E85D3F]/30 shadow-xs' 
                      : 'hover:bg-gray-50 dark:hover:bg-[#253243] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-[#E85D3F] text-white shadow-xs' 
                        : 'bg-orange-500/10 text-[#E85D3F] dark:bg-orange-950/40 dark:text-orange-400'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected ? 'text-[#E85D3F]' : 'text-[#243447] dark:text-white'
                        }`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {item.vocabItem && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          speakChinese(item.vocabItem.hanzi);
                        }}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        title="Phát âm tiếng Trung"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                    <span className={`p-1.5 rounded-lg transition-transform ${isSelected ? 'translate-x-0.5 text-[#E85D3F]' : 'text-gray-400'}`}>
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-2">
              <Search size={32} className="mx-auto text-gray-400 opacity-60" />
              <p className="text-sm font-bold text-[#243447] dark:text-white">
                Không tìm thấy kết quả cho "{query}"
              </p>
              <p className="text-xs text-[#748092]">
                Thử tìm theo từ khóa tiếng Việt không dấu, số bài học (ví dụ: "101", "ngữ pháp") hoặc chữ Hán.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-gray-50 dark:bg-[#16212E] border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-[11px] text-[#748092] dark:text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>HanziGo Smart Search • HSK 1 - 6</span>
          </div>
          <span className="text-[10px]">
            Nhấn <kbd className="font-mono bg-white dark:bg-gray-800 px-1 py-0.5 rounded border">ESC</kbd> để thoát
          </span>
        </div>

      </div>
    </div>
  );
}
