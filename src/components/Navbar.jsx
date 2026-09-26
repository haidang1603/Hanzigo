import React, { useState } from 'react';
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
  ShieldCheck
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

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: Layers, highlight: true },
    { id: 'roadmap', label: 'Lộ trình', icon: Compass },
    { id: 'materials', label: 'Tài liệu', icon: FolderDown },
    { id: 'vocabulary', label: 'Từ vựng', icon: Layers },
    { id: 'pronunciation', label: 'Luyện phát âm', icon: Mic },
    { id: 'writing', label: 'Viết chữ Hán', icon: PenTool },
    { id: 'conversation', label: 'Hội thoại AI', icon: MessageSquare },
    { id: 'community', label: 'Cộng đồng', icon: Users },
  ];

  const handleNavClick = (id) => {
    playClickSound();
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFF9F2]/90 dark:bg-[#131B24]/90 backdrop-blur-md border-b border-[#F1E5D8] dark:border-[#2B3A4F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-md shadow-[#E85D3F]/25 group-hover:scale-105 transition-transform">
              <span className="font-['Noto_Serif_SC'] text-2xl font-black">汉</span>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F4B942] rounded-full border-2 border-white dark:border-[#131B24]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#243447] dark:text-white">
                  Hanzi<span className="text-[#E85D3F]">Go</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] font-medium hidden sm:block -mt-1">
                Học tiếng Trung dễ hơn mỗi ngày
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                      : 'text-[#243447] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Streak & EXP Badges (Only shown when user is logged in) */}
            {user && (
              <>
                <div 
                  title="Chuỗi ngày học liên tiếp"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] border border-[#F4B942]/30 text-[#D97706] text-xs font-bold shadow-sm"
                >
                  <Flame size={16} className="text-[#F4B942] fill-[#F4B942] animate-bounce" />
                  <span>{streak} ngày</span>
                </div>

                <div 
                  title="Điểm kinh nghiệm"
                  className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border border-[#E85D3F]/20 text-[#E85D3F] text-xs font-bold"
                >
                  <Sparkles size={14} />
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
              className="p-2 rounded-lg text-[#748092] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#F1E5D8] dark:hover:border-[#2B3A4F] transition-colors"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-red-400" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                playClickSound();
              }}
              title={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              className="p-2 rounded-lg text-[#748092] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#F1E5D8] dark:border-[#2B3A4F] transition-colors"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => handleNavClick('admin')}
              title="Trang quản trị (Admin)"
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all border ${
                activeTab === 'admin'
                  ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-sm'
                  : 'text-[#748092] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] border-transparent hover:border-[#F1E5D8] dark:hover:border-[#2B3A4F]'
              }`}
            >
              <ShieldCheck size={16} className={activeTab === 'admin' ? 'text-white' : 'text-[#E85D3F]'} />
              <span className="hidden md:inline">Admin</span>
            </button>

            {/* User Profile or Login Button */}
            {user ? (
              <div 
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 pl-2 cursor-pointer group"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#E85D3F] shadow-sm group-hover:ring-2 ring-[#E85D3F]/50 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border-2 border-[#E85D3F] flex items-center justify-center text-[#E85D3F] font-bold text-xs shadow-sm group-hover:ring-2 ring-[#E85D3F]/50 transition-all">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-[#243447] dark:text-white leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#45B97C] font-semibold">
                    {user.level || 'HSK 1 - Sơ cấp'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#243447] dark:text-white hover:text-[#E85D3F] transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => handleNavClick('lesson')}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-md shadow-[#E85D3F]/25 hover:shadow-lg hover:shadow-[#E85D3F]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Bắt đầu học
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#243447] dark:text-white hover:bg-white dark:hover:bg-[#1E293B]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FFF9F2] dark:bg-[#131B24] border-b border-[#F1E5D8] dark:border-[#2B3A4F] px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E85D3F] text-white'
                      : 'text-[#243447] dark:text-[#CBD5E1] bg-white dark:bg-[#1B2636]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 text-xs font-bold text-[#243447] dark:text-white"
              >
                <User size={16} className="text-[#E85D3F]" />
                <span>Hồ sơ</span>
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#E85D3F]"
              >
                <ShieldCheck size={16} />
                <span>Admin</span>
              </button>
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
