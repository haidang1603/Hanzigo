import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Flame, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  GraduationCap, 
  Play,
  Award
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import Breadcrumbs from './Breadcrumbs';
import UserAvatar from '../common/UserAvatar.jsx';
import StreakModal from '../learning/StreakModal';

/**
 * AppHeader Component
 * Sticky top navigation header featuring breadcrumbs, global command palette trigger,
 * streak/XP gamification, theme toggles, and user profile management.
 */
export default function AppHeader({
  activeTab = 'home',
  setActiveTab,
  routeInfo = null,
  user = null,
  streak = 0,
  xp = 0,
  openAuthModal,
  onLogout,
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  onOpenCommandPalette,
  onToggleMobileMenu,
  onContinueLearning = null,
  lastLesson = null
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');
  const isTeacher = Boolean(user && (user.role === 'teacher' || isAdmin) && user.status !== 'blocked');

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    playClickSound();
    setActiveTab(id);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F2]/95 dark:bg-[#131B24]/95 backdrop-blur-md border-b border-[#F1E5D8] dark:border-[#2B3A4F] transition-colors duration-200">
      <div className="w-full px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Left Side: Mobile Menu Button + Breadcrumbs Trail */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onToggleMobileMenu) onToggleMobileMenu();
            }}
            aria-label="Mở menu điều hướng di động"
            className="lg:hidden p-2 rounded-xl text-[#243447] dark:text-white hover:bg-white dark:hover:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] transition-colors cursor-pointer shrink-0"
          >
            <Menu size={18} />
          </button>

          {/* Mobile Brand Mark */}
          <div 
            onClick={() => handleNavClick('home')}
            className="lg:hidden flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-xs">
              <span className="font-['Noto_Serif_SC'] text-lg font-black">汉</span>
            </div>
          </div>

          {/* Breadcrumb Navigation Trail */}
          <div className="hidden sm:block min-w-0">
            <Breadcrumbs 
              activeTab={activeTab} 
              routeInfo={routeInfo} 
              onNavigate={(tab) => handleNavClick(tab)} 
            />
          </div>
        </div>

        {/* Right Side: Command Search + Gamification + Toggles + User */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Action: Continue Learning (Tablet/Desktop) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onContinueLearning) onContinueLearning();
              else handleNavClick('roadmap');
            }}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-sm shadow-[#E85D3F]/25 hover:shadow-md transition-all active:scale-95 cursor-pointer"
            title={lastLesson ? `Tiếp tục: ${lastLesson.title}` : "Tiếp tục học bài học gần nhất"}
          >
            <Play size={13} className="fill-white" />
            <span>Tiếp tục học</span>
          </button>

          {/* Global Command Palette Trigger Button (Ctrl + K) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenCommandPalette) onOpenCommandPalette();
            }}
            aria-label="Mở tìm kiếm nhanh (Ctrl + K)"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] hover:text-[#E85D3F] hover:border-[#E85D3F] text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Tìm kiếm nhanh toàn cục (Ctrl + K / Cmd + K)"
          >
            <Search size={15} className="text-[#E85D3F]" />
            <span className="hidden md:inline text-xs">Tìm kiếm...</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700">
              Ctrl K
            </kbd>
          </button>

          {/* Gamification Badges: Streak & XP */}
          {user && (
            <>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setStreakModalOpen(true);
                }}
                title="Nhấn để xem chuỗi ngày học 🔥"
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] border border-[#F4B942]/40 hover:border-[#F4B942] text-[#D97706] dark:text-amber-400 text-xs font-bold shadow-xs whitespace-nowrap transition-all cursor-pointer hover:scale-105 active:scale-95 group"
              >
                <Flame size={14} className="text-[#F4B942] fill-[#F4B942] group-hover:animate-bounce" />
                <span className="text-xs">{streak} ngày</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('leaderboard')}
                title="Bảng vàng cao thủ XP"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border border-[#E85D3F]/30 text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
              >
                <Trophy size={13} className="text-amber-500 fill-amber-500" />
                <span>{xp >= 10000 ? `${(xp / 1000).toFixed(1)}k` : xp} XP</span>
              </button>
            </>
          )}

          {/* Sound & Dark Mode Toggles */}
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-0.5 border border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playClickSound();
              }}
              aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              title={soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
              className="p-1.5 rounded-lg text-[#748092] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] hover:text-[#E85D3F] transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} className="text-red-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setDarkMode(!darkMode);
                playClickSound();
              }}
              aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              title={darkMode ? 'Giao diện: Tối' : 'Giao diện: Sáng'}
              className="p-1.5 rounded-lg text-[#748092] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] hover:text-[#E85D3F] transition-colors cursor-pointer"
            >
              {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>

          {/* User Profile Dropdown Menu */}
          {user ? (
            <div ref={userDropdownRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(prev => !prev)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#F1E5D8] dark:hover:border-[#2B3A4F] transition-all cursor-pointer group"
                title="Tài khoản người dùng"
              >
                <UserAvatar 
                  user={user} 
                  size="md" 
                  className="group-hover:scale-105 transition-transform" 
                />

                <div className="hidden xl:block text-left whitespace-nowrap">
                  <p className="text-xs font-bold text-[#243447] dark:text-white leading-tight truncate max-w-[90px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
                    {isAdmin ? 'Quản trị viên' : user.role === 'teacher' ? 'Giáo viên' : user.level || 'HSK 1'}
                  </p>
                </div>
                <ChevronDown size={12} className={`text-[#748092] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full pt-2 z-50 w-64 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 rounded-2xl bg-white/95 dark:bg-[#1A2433]/95 backdrop-blur-xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-2">
                    <div className="pb-2 border-b border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                      <p className="text-xs font-bold text-[#243447] dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-[#748092] truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isAdmin 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                          : user.role === 'teacher'
                          ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] border-[#E85D3F]/20'
                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      }`}>
                        {isAdmin ? '🛡️ Quản trị viên (Admin)' : user.role === 'teacher' ? '🧑‍🏫 Giáo viên' : '🎓 Học viên'}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => handleNavClick('profile')}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#FFF9F2] dark:hover:bg-[#243447] text-[#243447] dark:text-white cursor-pointer"
                      >
                        <User size={15} className="text-[#E85D3F]" />
                        <span>Hồ sơ cá nhân</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#FFF9F2] dark:hover:bg-[#243447] text-[#243447] dark:text-white cursor-pointer"
                      >
                        <Award size={15} className="text-amber-500" />
                        <span>Dashboard học tập</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('classroom')}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#FFF9F2] dark:hover:bg-[#243447] text-[#243447] dark:text-white cursor-pointer"
                      >
                        <GraduationCap size={15} className="text-blue-500" />
                        <span>Lớp học của tôi</span>
                      </button>

                      {isTeacher && (
                        <button
                          type="button"
                          onClick={() => handleNavClick('teacher')}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#FFF9F2] dark:hover:bg-[#243447] text-[#E85D3F] cursor-pointer"
                        >
                          <GraduationCap size={15} />
                          <span>Cổng Giáo viên (Teacher Mode)</span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleNavClick('admin')}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#FFF9F2] dark:hover:bg-[#243447] text-emerald-600 dark:text-emerald-400 cursor-pointer"
                        >
                          <ShieldCheck size={15} />
                          <span>Trang quản trị (Admin)</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal && openAuthModal('login')}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-[#243447] dark:text-white hover:text-[#E85D3F] transition-colors cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('roadmap')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-linear-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-md shadow-[#E85D3F]/25 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Bắt đầu học
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Streak Details Modal */}
      {streakModalOpen && (
        <StreakModal 
          isOpen={streakModalOpen} 
          onClose={() => setStreakModalOpen(false)} 
          streak={streak} 
          user={user} 
        />
      )}
    </header>
  );
}
