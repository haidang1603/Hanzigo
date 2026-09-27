import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  BookOpen, 
  Compass, 
  Layers, 
  Mic, 
  PenTool, 
  MessageSquare, 
  Users, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  FolderDown, 
  ShieldCheck,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  streak = 0, 
  xp = 0, 
  openAuthModal, 
  onLogout,
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const practiceRef = useRef(null);

  const ADMIN_EMAILS = ['lehaidang16032006@gmail.com', 'admin@hanzigo.com'];
  const isAdmin = Boolean(user && (ADMIN_EMAILS.includes((user.email || '').toLowerCase().trim()) || user.role === 'admin'));

  // Main high-level tabs
  const primaryNavItems = [
    { id: 'home', label: 'Trang chủ', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'roadmap', label: 'Lộ trình', icon: Compass },
  ];

  const secondaryNavItems = [
    { id: 'materials', label: 'Tài liệu', icon: FolderDown },
    { id: 'community', label: 'Cộng đồng', icon: Users },
  ];

  // Specific skill training items grouped cleanly under "Luyện tập"
  const practiceItems = [
    { 
      id: 'vocabulary', 
      label: 'Từ vựng HSK', 
      desc: 'Kho từ vựng chuẩn & Flashcard', 
      icon: Layers, 
      color: 'text-amber-500 bg-amber-500/10' 
    },
    { 
      id: 'pronunciation', 
      label: 'Luyện phát âm', 
      desc: 'Pinyin, thanh điệu & nhận diện giọng', 
      icon: Mic, 
      color: 'text-emerald-500 bg-emerald-500/10' 
    },
    { 
      id: 'writing', 
      label: 'Viết chữ Hán', 
      desc: 'Quy tắc nét thuận & tập viết chữ', 
      icon: PenTool, 
      color: 'text-indigo-500 bg-indigo-500/10' 
    },
    { 
      id: 'conversation', 
      label: 'Hội thoại AI', 
      desc: 'Giao tiếp phản xạ theo tình huống', 
      icon: MessageSquare, 
      color: 'text-rose-500 bg-rose-500/10' 
    },
  ];

  const isPracticeActive = practiceItems.some(item => item.id === activeTab);
  const activePractice = practiceItems.find(item => item.id === activeTab);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (practiceRef.current && !practiceRef.current.contains(e.target)) {
        setPracticeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    playClickSound();
    setActiveTab(id);
    setMobileMenuOpen(false);
    setPracticeOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFF9F2]/95 dark:bg-[#131B24]/95 backdrop-blur-md border-b border-[#F1E5D8] dark:border-[#2B3A4F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-md shadow-[#E85D3F]/25 group-hover:scale-105 transition-transform">
              <span className="font-['Noto_Serif_SC'] text-xl sm:text-2xl font-black">汉</span>
              <div className="absolute -top-1 -right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 bg-[#F4B942] rounded-full border-2 border-white dark:border-[#131B24]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#243447] dark:text-white">
                  Hanzi<span className="text-[#E85D3F]">Go</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] font-medium hidden 2xl:block -mt-1">
                Học tiếng Trung dễ hơn mỗi ngày
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links - Compact, Neat & Never Wraps */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                      : 'text-[#243447] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Dropdown "Luyện tập" Grouping Practice Tools */}
            <div 
              ref={practiceRef}
              className="relative"
              onMouseEnter={() => setPracticeOpen(true)}
              onMouseLeave={() => setPracticeOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPracticeOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isPracticeActive
                    ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                    : practiceOpen
                      ? 'bg-white/90 dark:bg-[#1E293B] text-[#E85D3F] dark:text-white shadow-sm'
                      : 'text-[#243447] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1E293B]'
                }`}
              >
                <GraduationCap size={16} className={isPracticeActive ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'} />
                <span>{isPracticeActive ? activePractice?.label : 'Luyện tập'}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${practiceOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Popover */}
              {practiceOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-72 p-2 rounded-2xl bg-white/95 dark:bg-[#1A2433]/95 backdrop-blur-xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl shadow-black/15 space-y-1">
                    <div className="px-3 py-1.5 pb-2 border-b border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                        Kỹ năng & Luyện tập
                      </p>
                    </div>
                    {practiceItems.map((p) => {
                      const PIcon = p.icon;
                      const isPActive = activeTab === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            handleNavClick(p.id);
                            setPracticeOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left cursor-pointer group ${
                            isPActive
                              ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border border-[#E85D3F]/25 shadow-sm'
                              : 'hover:bg-[#FFF9F2] dark:hover:bg-[#243447]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${p.color}`}>
                            <PIcon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs font-bold ${isPActive ? 'text-[#E85D3F]' : 'text-[#243447] dark:text-white group-hover:text-[#E85D3F]'}`}>
                                {p.label}
                              </p>
                              {isPActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E85D3F]" />
                              )}
                            </div>
                            <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">
                              {p.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                      : 'text-[#243447] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Streak & EXP Badges (Only shown when user is logged in) */}
            {user && (
              <>
                <div 
                  title="Chuỗi ngày học liên tiếp"
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] border border-[#F4B942]/30 text-[#D97706] text-xs font-bold shadow-sm whitespace-nowrap shrink-0"
                >
                  <Flame size={14} className="text-[#F4B942] fill-[#F4B942]" />
                  <span>{streak} ngày</span>
                </div>

                <div 
                  title="Điểm kinh nghiệm"
                  className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border border-[#E85D3F]/20 text-[#E85D3F] text-xs font-bold whitespace-nowrap shrink-0"
                >
                  <Sparkles size={13} />
                  <span>{xp} XP</span>
                </div>
              </>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playClickSound();
              }}
              title={soundEnabled ? 'Âm thanh bật' : 'Âm thanh tắt'}
              className="p-1.5 sm:p-2 rounded-xl text-[#748092] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#F1E5D8] dark:hover:border-[#2B3A4F] transition-colors cursor-pointer shrink-0"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                playClickSound();
              }}
              title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              className="p-1.5 sm:p-2 rounded-xl text-[#748092] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#F1E5D8] dark:hover:border-[#2B3A4F] transition-colors cursor-pointer shrink-0"
            >
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            {/* Admin Portal Button - Only visible to Admin */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                title="Trang quản trị (Admin)"
                className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all border whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === 'admin'
                    ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-sm shadow-[#E85D3F]/30'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </button>
            )}

            {/* User Profile or Login Button */}
            {user ? (
              <div 
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 pl-1 cursor-pointer group shrink-0"
                title="Xem hồ sơ cá nhân"
              >
                {(() => {
                  const navAvatar = user.avatar || localStorage.getItem('hanzigo_custom_avatar');
                  if (navAvatar) {
                    return navAvatar.length <= 4 ? (
                      <div className="w-8 h-8 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] border-2 border-[#E85D3F] flex items-center justify-center text-sm shadow-sm group-hover:ring-2 ring-[#E85D3F]/50 transition-all">
                        {navAvatar}
                      </div>
                    ) : (
                      <img 
                        src={navAvatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#E85D3F] shadow-sm group-hover:ring-2 ring-[#E85D3F]/50 transition-all"
                      />
                    );
                  }
                  return (
                    <div className="w-8 h-8 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border-2 border-[#E85D3F] flex items-center justify-center text-[#E85D3F] font-bold text-xs shadow-sm group-hover:ring-2 ring-[#E85D3F]/50 transition-all">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                    </div>
                  );
                })()}
                <div className="hidden 2xl:block text-left whitespace-nowrap">
                  <p className="text-xs font-bold text-[#243447] dark:text-white leading-tight truncate max-w-[100px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#45B97C] font-semibold">
                    {user.level || 'HSK 1 - Sơ cấp'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={() => openAuthModal('login')}
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-[#243447] dark:text-white hover:text-[#E85D3F] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => handleNavClick('lesson')}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-md shadow-[#E85D3F]/25 hover:shadow-lg hover:shadow-[#E85D3F]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
                >
                  Bắt đầu học
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-[#243447] dark:text-white hover:bg-white dark:hover:bg-[#1E293B] cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF9F2] dark:bg-[#131B24] border-b border-[#F1E5D8] dark:border-[#2B3A4F] px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {/* Main quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...primaryNavItems, ...secondaryNavItems].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E85D3F] text-white shadow-sm'
                      : 'text-[#243447] dark:text-[#CBD5E1] bg-white dark:bg-[#1B2636] border border-[#F1E5D8]/60 dark:border-[#2B3A4F]/60'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Practice section in mobile drawer */}
          <div className="space-y-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <p className="text-[11px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8] px-1">
              Kỹ năng & Luyện tập
            </p>
            <div className="grid grid-cols-2 gap-2">
              {practiceItems.map((p) => {
                const PIcon = p.icon;
                const isPActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleNavClick(p.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                      isPActive
                        ? 'bg-[#E85D3F] text-white shadow-sm'
                        : 'bg-white dark:bg-[#1B2636] border border-[#F1E5D8]/60 dark:border-[#2B3A4F]/60 text-[#243447] dark:text-[#CBD5E1]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isPActive ? 'bg-white/20 text-white' : p.color}`}>
                      <PIcon size={15} />
                    </div>
                    <span className="text-xs font-bold truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 text-xs font-bold text-[#243447] dark:text-white"
              >
                <User size={16} className="text-[#E85D3F]" />
                <span>Hồ sơ</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </button>
              )}
            </div>
            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="text-xs font-bold text-[#E85D3F]"
              >
                Đăng nhập tài khoản
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs font-semibold text-[#748092]"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
