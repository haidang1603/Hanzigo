import React, { useState } from 'react';
import UserAvatar from '../common/UserAvatar.jsx';
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
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Play, 
  Target,
  LogOut
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';

/**
 * AppSidebar Component
 * Modern Educational SaaS Collapsible Sidebar with Clean Accordion Grouping.
 */
export default function AppSidebar({
  activeTab = 'home',
  setActiveTab,
  user = null,
  isCollapsed = false,
  onToggleCollapse,
  onContinueLearning = null,
  lastLesson = null,
  onOpenAuth = null,
  onLogout = null
}) {
  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');
  const isTeacher = Boolean(user && (user.role === 'teacher' || isAdmin) && user.status !== 'blocked');

  // Sub-skills belonging to Practice Hub
  const practiceSkills = [
    { id: 'listening', label: 'Luyện nghe HSK', icon: Headphones },
    { id: 'grammar', label: 'Ngữ pháp HSK', icon: Sparkles },
    { id: 'vocabulary', label: 'Flashcards Từ vựng', icon: Layers },
    { id: 'pronunciation', label: 'Luyện phát âm AI', icon: Mic },
    { id: 'writing', label: 'Từ điển & Viết chữ', icon: PenTool },
    { id: 'conversation', label: 'Hội thoại Lão Sư', icon: MessageSquare },
    { id: 'reader', label: 'Đọc hiểu & NLP', icon: BookOpen },
    { id: 'practice', label: 'Trung tâm tổng hợp', icon: Target }
  ];

  const isCurrentTabInPractice = practiceSkills.some(s => s.id === activeTab);

  // Accordion state: auto-expand if active tab is in practice skills
  const [skillsExpanded, setSkillsExpanded] = useState(() => isCurrentTabInPractice);

  // Keep expanded if user navigates into practice tab
  React.useEffect(() => {
    if (isCurrentTabInPractice) {
      setSkillsExpanded(true);
    }
  }, [activeTab, isCurrentTabInPractice]);

  // Primary Navigation Groups
  const coreItems = [
    { id: 'home', label: 'Trang chủ', icon: BookOpen },
    { id: 'roadmap', label: 'Lộ trình HSK', icon: Compass },
    { id: 'hsk', label: 'Thi thử HSK', icon: Award },
    { id: 'classroom', label: 'Lớp học', icon: GraduationCap }
  ];

  const exploreItems = [
    { id: 'materials', label: 'Thư viện tài liệu', icon: FolderDown },
    { id: 'community', label: 'Cộng đồng học viên', icon: Users },
    { id: 'leaderboard', label: 'Bảng vàng cao thủ', icon: Trophy }
  ];

  // For test compatibility matching
  const navSections = [
    { id: 'core', title: 'Học tập cốt lõi', items: coreItems },
    { id: 'skills', title: 'Kỹ năng & Luyện tập', items: practiceSkills },
    { id: 'explore', title: 'Khám phá & Cộng đồng', items: exploreItems },
    ...(isTeacher ? [{
      id: 'teacher',
      title: 'Cổng Giáo viên',
      items: [{ id: 'teacher', label: 'Quản lý giảng dạy', icon: GraduationCap }]
    }] : []),
    ...(isAdmin ? [{
      id: 'admin',
      title: 'Quản trị hệ thống',
      items: [{ id: 'admin', label: 'Bảng điều khiển Admin', icon: ShieldCheck }]
    }] : [])
  ];

  const handleItemClick = (id) => {
    playClickSound();
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Sidebar điều hướng"
      className={`hidden lg:flex flex-col border-r border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] transition-all duration-200 select-none z-40 sticky top-0 h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] shrink-0">
        <div 
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
          title="HanziGo - Học tiếng Trung dễ hơn mỗi ngày"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-md shadow-[#E85D3F]/25 group-hover:scale-105 transition-transform shrink-0">
            <span className="font-['Noto_Serif_SC'] text-2xl font-black">汉</span>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F4B942] rounded-full border-2 border-[#FFF9F2] dark:border-[#131B24]" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#243447] dark:text-white">
                  Hanzi<span className="text-[#E85D3F]">Go</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] font-medium truncate">
                Nền tảng học tiếng Trung
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action: Continue Learning CTA (Streamlined & Compact) */}
      <div className={`border-b border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 shrink-0 ${isCollapsed ? 'py-2 px-2' : 'p-2.5'}`}>
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onContinueLearning) onContinueLearning();
              else handleItemClick('roadmap');
            }}
            title={lastLesson ? `Tiếp tục học: ${lastLesson.title}` : 'Tiếp tục học'}
            className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white flex items-center justify-center shadow-xs shadow-[#E85D3F]/25 hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play size={13} className="fill-white ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onContinueLearning) onContinueLearning();
              else handleItemClick('roadmap');
            }}
            className="w-full p-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white shadow-xs shadow-[#E85D3F]/20 hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Play size={12} className="fill-white ml-0.5" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-[9px] font-bold text-amber-200 uppercase tracking-wider leading-tight">
                  Tiếp tục học
                </span>
                <span className="block text-xs font-bold truncate text-white leading-tight">
                  {lastLesson ? lastLesson.title : 'Vào Lộ trình HSK'}
                </span>
              </div>
            </div>
            <ChevronRight size={13} className="text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
          </button>
        )}
      </div>

      {/* Streamlined & Compact Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        
        {/* 1. Core Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
              Học tập cốt lõi
            </p>
          )}
          {coreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isCollapsed ? 'justify-center' : 'justify-start'
                } ${
                  isActive
                    ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25 font-black'
                    : 'text-[#243447] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]'
                }`}
              >
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {!isCollapsed && isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ml-auto shrink-0 animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* 2. Compact Collapsible Skills Section (Luyện tập) */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <div>
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSkillsExpanded(prev => !prev);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrentTabInPractice
                    ? 'text-[#E85D3F] bg-[#FDEEEB]/50 dark:bg-[#2D1E1B]/30'
                    : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target size={17} className={isCurrentTabInPractice ? 'text-[#E85D3F]' : ''} />
                  <span>Kỹ năng & Luyện tập</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#E85D3F] font-bold">
                    8
                  </span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-200 ${skillsExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Sub-items drawer */}
              {skillsExpanded && (
                <div className="mt-1 pl-3 space-y-0.5 border-l-2 border-[#F1E5D8] dark:border-[#2B3A4F] ml-4 animate-in fade-in duration-150">
                  {practiceSkills.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleItemClick(sub.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-[#E85D3F] text-white font-black shadow-xs'
                            : 'text-[#748092] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]'
                        }`}
                      >
                        <SubIcon size={14} className={isSubActive ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // In Collapsed mode: direct button to Practice Hub
            <button
              type="button"
              onClick={() => handleItemClick('practice')}
              title="Kỹ năng & Luyện tập (8 kỹ năng)"
              className={`w-full flex items-center justify-center p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isCurrentTabInPractice
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25 font-black'
                  : 'text-[#748092] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]'
              }`}
            >
              <Target size={18} />
            </button>
          )}
        </div>

        {/* 3. Explore & Community Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
              Khám phá & Cộng đồng
            </p>
          )}
          {exploreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isCollapsed ? 'justify-center' : 'justify-start'
                } ${
                  isActive
                    ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25 font-black'
                    : 'text-[#243447] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]'
                }`}
              >
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {!isCollapsed && isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ml-auto shrink-0 animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* 4. Role-based: Teacher Portals */}
        {isTeacher && (
          <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
            {!isCollapsed && (
              <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Cổng Giáo viên
              </p>
            )}
            <button
              type="button"
              onClick={() => handleItemClick('teacher')}
              title={isCollapsed ? 'Quản lý giảng dạy' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } ${
                activeTab === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-black'
                  : 'text-[#243447] dark:text-[#CBD5E1] hover:text-emerald-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]'
              }`}
            >
              <GraduationCap size={18} className={`shrink-0 ${activeTab === 'teacher' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
              {!isCollapsed && <span className="truncate">Quản lý giảng dạy</span>}
            </button>
          </div>
        )}

        {/* 5. Role-based: Admin Portals */}
        {isAdmin && (
          <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
            {!isCollapsed && (
              <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Quản trị hệ thống
              </p>
            )}
            <button
              type="button"
              onClick={() => handleItemClick('admin')}
              title={isCollapsed ? 'Bảng điều khiển Admin' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 font-black'
                  : 'text-[#243447] dark:text-[#CBD5E1] hover:text-rose-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]'
              }`}
            >
              <ShieldCheck size={18} className={`shrink-0 ${activeTab === 'admin' ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`} />
              {!isCollapsed && <span className="truncate">Bảng điều khiển Admin</span>}
            </button>
          </div>
        )}

      </nav>

      {/* Sidebar Footer: User Card & Collapse Toggle */}
      <div className="p-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/50 dark:bg-[#1E293B]/40 shrink-0 space-y-2">
        {user ? (
          <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div 
              onClick={() => handleItemClick('profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
              title="Xem hồ sơ cá nhân"
            >
              <UserAvatar 
                user={user} 
                size="md" 
                className="group-hover:scale-105 transition-transform" 
              />
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#243447] dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                    {isAdmin ? 'Quản trị viên' : user.role === 'teacher' ? 'Giáo viên' : user.level || 'HSK 1'}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Đăng xuất"
                className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        ) : (
          !isCollapsed && (
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Đăng nhập / Đăng ký
            </button>
          )
        )}

        {/* Toggle Collapse Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            if (onToggleCollapse) onToggleCollapse();
          }}
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          className={`w-full py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer`}
        >
          {isCollapsed ? <ChevronRight size={15} /> : (
            <>
              <ChevronLeft size={15} />
              <span className="text-[11px]">Thu gọn</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
}
