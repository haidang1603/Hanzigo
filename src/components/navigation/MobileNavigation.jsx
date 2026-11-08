import React, { useState, useEffect } from 'react';
import UserAvatar from '../common/UserAvatar.jsx';
import { 
  X, 
  Home, 
  Compass, 
  Target, 
  Award, 
  GraduationCap, 
  Sparkles, 
  Headphones, 
  Layers, 
  Mic, 
  PenTool, 
  MessageSquare, 
  BookOpen, 
  FolderDown, 
  Users, 
  Trophy, 
  ShieldCheck, 
  Play, 
  Menu,
  ChevronRight,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';

/**
 * MobileNavigation Component
 * Provides:
 * 1. Off-canvas Drawer for detailed full menu navigation on mobile
 * 2. Fixed Bottom Navigation Bar for rapid one-thumb primary switching
 */
export default function MobileNavigation({
  isOpen = false,
  onClose,
  activeTab = 'home',
  setActiveTab,
  user = null,
  onContinueLearning = null,
  lastLesson = null,
  onOpenAuth = null,
  onLogout = null
}) {
  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');
  const isTeacher = Boolean(user && (user.role === 'teacher' || isAdmin) && user.status !== 'blocked');

  const practiceSkills = [
    { id: 'listening', label: 'Luyện nghe HSK', icon: Headphones },
    { id: 'grammar', label: 'Ngữ pháp HSK', icon: Sparkles },
    { id: 'vocabulary', label: 'Từ vựng Flashcards', icon: Layers },
    { id: 'pronunciation', label: 'Luyện phát âm AI', icon: Mic },
    { id: 'writing', label: 'Từ điển & Viết chữ', icon: PenTool },
    { id: 'conversation', label: 'Hội thoại Lão Sư', icon: MessageSquare },
    { id: 'reader', label: 'Đọc hiểu & Báo chí', icon: BookOpen },
    { id: 'practice', label: 'Trung tâm tổng hợp', icon: Target }
  ];

  const isCurrentTabInPractice = practiceSkills.some(s => s.id === activeTab);
  const [skillsExpanded, setSkillsExpanded] = useState(() => isCurrentTabInPractice);

  useEffect(() => {
    if (isCurrentTabInPractice) {
      setSkillsExpanded(true);
    }
  }, [activeTab, isCurrentTabInPractice]);

  const handleItemClick = (id) => {
    playClickSound();
    setActiveTab(id);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5 primary items for the bottom navigation bar
  const bottomBarItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'roadmap', label: 'Lộ trình', icon: Compass },
    { id: 'practice', label: 'Luyện tập', icon: Target },
    { id: 'hsk', label: 'Thi HSK', icon: Award },
    { id: 'more-drawer', label: 'Thêm', icon: Menu, isDrawerTrigger: true }
  ];

  return (
    <>
      {/* 1. OFF-CANVAS MOBILE DRAWER */}
      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng di động"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Backdrop blur */}
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[#FFF9F2] dark:bg-[#131B24] h-full shadow-2xl flex flex-col z-10 border-r border-[#F1E5D8] dark:border-[#2B3A4F] animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
              <div 
                onClick={() => handleItemClick('home')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-xs">
                  <span className="font-['Noto_Serif_SC'] text-xl font-black">汉</span>
                </div>
                <div>
                  <span className="text-lg font-black text-[#243447] dark:text-white">
                    Hanzi<span className="text-[#E85D3F]">Go</span>
                  </span>
                  <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                    PRO
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng menu"
                className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-xl cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Continue Learning Banner */}
            <div className="p-3 border-b border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (onContinueLearning) onContinueLearning();
                  else handleItemClick('roadmap');
                }}
                className="w-full p-2.5 rounded-2xl bg-linear-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Play size={12} className="fill-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="text-[10px] text-amber-200 block uppercase font-bold">Tiếp tục học</span>
                    <span className="text-xs font-bold truncate block">{lastLesson ? lastLesson.title : 'Vào Lộ trình HSK'}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="shrink-0" />
              </button>
            </div>

            {/* Grouped Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              
              {/* Group 1: Core */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                  Học tập cốt lõi
                </p>
                {[
                  { id: 'home', label: 'Trang chủ', icon: Home },
                  { id: 'roadmap', label: 'Lộ trình HSK', icon: Compass },
                  { id: 'hsk', label: 'Thi thử HSK', icon: Award },
                  { id: 'classroom', label: 'Lớp học', icon: GraduationCap }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#E85D3F] text-white font-black shadow-xs'
                          : 'text-[#243447] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#1E293B]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Group 2: Compact Practice Skills Accordion */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSkillsExpanded(prev => !prev);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrentTabInPractice
                      ? 'text-[#E85D3F] bg-[#FDEEEB]/60 dark:bg-[#2D1E1B]/40'
                      : 'text-[#243447] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Target size={16} className={isCurrentTabInPractice ? 'text-[#E85D3F]' : ''} />
                    <span>Kỹ năng & Luyện tập</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#E85D3F] font-bold">
                      8
                    </span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${skillsExpanded ? 'rotate-180' : ''}`} />
                </button>

                {skillsExpanded && (
                  <div className="mt-1 pl-3 space-y-0.5 border-l-2 border-[#F1E5D8] dark:border-[#2B3A4F] ml-3 animate-in fade-in duration-150">
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

              {/* Group 3: Community & Explore */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                  Cộng đồng & Mở rộng
                </p>
                {[
                  { id: 'materials', label: 'Thư viện tài liệu', icon: FolderDown },
                  { id: 'community', label: 'Cộng đồng học viên', icon: Users },
                  { id: 'leaderboard', label: 'Bảng vàng cao thủ', icon: Trophy }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#E85D3F] text-white font-black shadow-xs'
                          : 'text-[#243447] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#1E293B]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Role-based Portals */}
              {isTeacher && (
                <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                  <p className="px-3 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Cổng Giáo viên
                  </p>
                  <button
                    type="button"
                    onClick={() => handleItemClick('teacher')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                      activeTab === 'teacher' ? 'bg-[#E85D3F] text-white' : 'text-orange-700 dark:text-orange-300'
                    }`}
                  >
                    <GraduationCap size={16} />
                    <span>Quản lý giảng dạy</span>
                  </button>
                </div>
              )}

              {isAdmin && (
                <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                  <p className="px-3 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Quản trị viên
                  </p>
                  <button
                    type="button"
                    onClick={() => handleItemClick('admin')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                      activeTab === 'admin' ? 'bg-[#E85D3F] text-white' : 'text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    <span>Bảng điều khiển Admin</span>
                  </button>
                </div>
              )}

            </div>

            {/* Drawer Footer: User Profile / Logout */}
            <div className="p-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/50 dark:bg-[#1E293B]/40">
              {user ? (
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => handleItemClick('profile')}
                    className="flex items-center gap-2 cursor-pointer min-w-0"
                  >
                    <UserAvatar user={user} size="md" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#243447] dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">{user.level || 'HSK 1'}</p>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                      title="Đăng xuất"
                    >
                      <LogOut size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Đăng nhập / Đăng ký
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <nav 
        aria-label="Điều hướng nhanh di động"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#131B24]/95 backdrop-blur-lg border-t border-[#F1E5D8] dark:border-[#2B3A4F] px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        {bottomBarItems.map((item) => {
          const Icon = item.icon;
          const isSelected = item.isDrawerTrigger ? isOpen : (activeTab === item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playClickSound();
                if (item.isDrawerTrigger) {
                  if (isOpen) onClose();
                  else onClose(true); // Toggle
                } else {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[56px] min-h-[44px] transition-all cursor-pointer ${
                isSelected
                  ? 'text-[#E85D3F]'
                  : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-xl transition-transform ${isSelected ? 'scale-110' : ''}`}>
                <Icon size={19} />
              </div>
              <span className={`text-[10px] leading-tight font-bold ${isSelected ? 'font-black' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

