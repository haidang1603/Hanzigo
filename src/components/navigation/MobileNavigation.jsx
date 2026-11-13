import React, { useState, useEffect } from 'react';
import UserAvatar from '../common/UserAvatar.jsx';
import {
  X,
  Home,
  Compass,
  Target,
  Award,
  Play,
  Menu,
  ChevronRight,
  ChevronDown,
  LogOut,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import {
  CORE_TREE_ITEMS,
  SKILLS_TREE_ITEMS,
  EXPLORE_TREE_ITEMS,
  TEACHER_TREE_ITEMS,
  ADMIN_TREE_ITEMS,
  ALL_PRACTICE_SKILL_IDS,
  isTreeNodeActive,
} from './navTreeConfig';

/**
 * MobileNavigation Component
 * Provides:
 * 1. Off-canvas Drawer for detailed folder-tree menu navigation on mobile
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
  onLogout = null,
}) {
  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');
  const isTeacher = Boolean(user && (user.role === 'teacher' || isAdmin) && user.status !== 'blocked');

  const [currentHash, setCurrentHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : ''
  );

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const isCurrentTabInPractice = ALL_PRACTICE_SKILL_IDS.includes(activeTab);
  const [expandedFolders, setExpandedFolders] = useState(() => ({
    skills: isCurrentTabInPractice,
    'skills:input': isCurrentTabInPractice,
    'skills:core': isCurrentTabInPractice,
    'skills:output': isCurrentTabInPractice,
    hsk: activeTab === 'hsk',
    reader: activeTab === 'reader',
    community: activeTab === 'community' || activeTab === 'leaderboard',
    teacher: activeTab === 'teacher',
  }));

  useEffect(() => {
    if (isCurrentTabInPractice) {
      setExpandedFolders((prev) => ({ ...prev, skills: true, 'skills:input': true }));
    }
    if (activeTab === 'hsk' || activeTab === 'reader' || activeTab === 'teacher') {
      setExpandedFolders((prev) => ({ ...prev, [activeTab]: true }));
    }
    if (activeTab === 'community' || activeTab === 'leaderboard') {
      setExpandedFolders((prev) => ({ ...prev, community: true }));
    }
  }, [activeTab, isCurrentTabInPractice]);

  const handleItemClick = (id, hash = null) => {
    playClickSound();
    if (hash && typeof window !== 'undefined') {
      window.location.hash = hash;
      setCurrentHash(hash);
    }
    setActiveTab(id);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFolder = (key, e = null) => {
    if (e) e.stopPropagation();
    playClickSound();
    setExpandedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMobileTree = (nodes, depth = 0) =>
    nodes.map((node) => {
      const Icon = node.icon;
      const hasChildren = Array.isArray(node.children) && node.children.length > 0;
      const isExpanded = Boolean(expandedFolders[node.key]);
      const isActive = isTreeNodeActive(node, activeTab, currentHash);

      const handlePress = () => {
        if (node.isGroupOnly) {
          toggleFolder(node.key);
          return;
        }
        if (hasChildren) {
          setExpandedFolders((prev) => ({ ...prev, [node.key]: true }));
        }
        handleItemClick(node.id, node.hash || null);
      };

      return (
        <div key={node.key} className="space-y-0.5 min-w-0">
          <div className="relative flex items-center min-w-0">
            {depth > 0 && (
              <span
                aria-hidden="true"
                className="w-2.5 h-px bg-[#DFCBB5] dark:bg-[#334155] shrink-0 mr-1"
              />
            )}
            <button
              type="button"
              onClick={handlePress}
              className={`w-full min-w-0 flex items-center gap-2.5 ${depth === 0 ? 'px-3 py-2.5 rounded-xl text-xs' : 'px-2.5 py-2 rounded-xl text-[11px]'
                } font-bold transition-all cursor-pointer ${hasChildren ? 'pr-8' : ''
                } ${isActive && !hasChildren
                  ? 'bg-[#E85D3F] text-white font-black shadow-xs'
                  : isActive && hasChildren
                    ? 'text-[#E85D3F] bg-[#FDEEEB]/60 dark:bg-[#2D1E1B]/40 font-extrabold'
                    : 'text-[#243447] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#1E293B]'
                }`}
            >
              {node.isGroupOnly ? (
                isExpanded ? (
                  <FolderOpen size={15} className="shrink-0 text-amber-500" />
                ) : (
                  <Folder size={15} className="shrink-0 text-amber-500/80" />
                )
              ) : (
                <Icon
                  size={depth === 0 ? 16 : 14}
                  className={isActive && !hasChildren ? 'text-white' : 'text-[#748092] dark:text-[#94A3B8]'}
                />
              )}
              <span className="truncate text-left">{node.label}</span>
              {node.badge && !(isActive && !hasChildren) && (
                <span className="ml-auto text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F]">
                  {node.badge}
                </span>
              )}
            </button>

            {hasChildren && (
              <button
                type="button"
                onClick={(e) => toggleFolder(node.key, e)}
                aria-label={isExpanded ? `Thu gọn ${node.label}` : `Mở rộng ${node.label}`}
                className="absolute right-1.5 p-1.5 rounded-lg text-[#748092] hover:text-[#E85D3F] cursor-pointer"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : '-rotate-90'}`}
                />
              </button>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div
              className={`space-y-0.5 border-l-2 border-[#E9D8C6] dark:border-[#2B3A4F] ${depth === 0 ? 'ml-3.5 pl-2' : 'ml-3 pl-1.5'
                } animate-in fade-in duration-150`}
            >
              {renderMobileTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  // 5 primary items for the bottom navigation bar
  const bottomBarItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'roadmap', label: 'Lộ trình', icon: Compass },
    { id: 'practice', label: 'Luyện tập', icon: Target },
    { id: 'hsk', label: 'Thi HSK', icon: Award },
    { id: 'more-drawer', label: 'Thêm', icon: Menu, isDrawerTrigger: true },
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
          <div className="relative w-[85vw] max-w-xs bg-[#FFF9F2] dark:bg-[#131B24] h-full shadow-2xl flex flex-col z-10 border-r border-[#F1E5D8] dark:border-[#2B3A4F] animate-in slide-in-from-left duration-200">
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
                    <span className="text-xs font-bold truncate block">
                      {lastLesson ? lastLesson.title : 'Vào Lộ trình HSK'}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="shrink-0" />
              </button>
            </div>

            {/* Grouped Folder-Tree Links */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
              {/* Group 1: Core */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                  Học tập cốt lõi
                </p>
                {renderMobileTree(CORE_TREE_ITEMS, 0)}
              </div>

              {/* Group 2: Practice Skills Folder Tree */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleFolder('skills')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isCurrentTabInPractice
                      ? 'text-[#E85D3F] bg-[#FDEEEB]/60 dark:bg-[#2D1E1B]/40'
                      : 'text-[#243447] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#1E293B]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Target size={16} className={isCurrentTabInPractice ? 'text-[#E85D3F]' : ''} />
                    <span>Kỹ năng & Luyện tập</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#E85D3F] font-bold">
                      {ALL_PRACTICE_SKILL_IDS.length}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${expandedFolders.skills ? 'rotate-180' : '-rotate-90'}`}
                  />
                </button>

                {expandedFolders.skills && (
                  <div className="mt-1 pl-2 space-y-1 border-l-2 border-[#E9D8C6] dark:border-[#2B3A4F] ml-3 animate-in fade-in duration-150">
                    {renderMobileTree(SKILLS_TREE_ITEMS, 1)}
                  </div>
                )}
              </div>

              {/* Group 3: Community & Explore */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                  Cộng đồng & Mở rộng
                </p>
                {renderMobileTree(EXPLORE_TREE_ITEMS, 0)}
              </div>

              {/* Role-based Portals */}
              {isTeacher && (
                <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                  <p className="px-3 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Cổng Giáo viên
                  </p>
                  {renderMobileTree(TEACHER_TREE_ITEMS, 0)}
                </div>
              )}

              {isAdmin && (
                <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                  <p className="px-3 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Quản trị viên
                  </p>
                  {renderMobileTree(ADMIN_TREE_ITEMS, 0)}
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
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#131B24]/95 backdrop-blur-lg border-t border-[#F1E5D8] dark:border-[#2B3A4F] px-1.5 sm:px-3 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg"
      >
        {bottomBarItems.map((item) => {
          const Icon = item.icon;
          const isSelected = item.isDrawerTrigger ? isOpen : activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playClickSound();
                if (item.isDrawerTrigger) {
                  if (isOpen) onClose();
                  else onClose(true);
                } else {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex-1 max-w-[76px] flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-2xl min-w-[52px] min-h-[44px] transition-all cursor-pointer ${isSelected
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
