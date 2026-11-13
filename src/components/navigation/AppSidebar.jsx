import React, { useState, useEffect, useMemo } from 'react';
import UserAvatar from '../common/UserAvatar.jsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Target,
  LogOut,
  Pin,
  Search,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { prefetchRoute } from '../../core/routing/lazyWithRetry';
import {
  getPinnedNavTabs,
  togglePinnedNavTab,
  recordNavigationVisit,
  SMART_NAV_CATALOG,
} from '../../utils/smartNavEngine';
import {
  CORE_TREE_ITEMS,
  SKILLS_TREE_ITEMS,
  EXPLORE_TREE_ITEMS,
  TEACHER_TREE_ITEMS,
  ADMIN_TREE_ITEMS,
  ALL_PRACTICE_SKILL_IDS,
  isTreeNodeActive,
  filterTreeNodes,
} from './navTreeConfig';

const TREE_EXPANDED_STORAGE_KEY = 'hanzigo_sidebar_tree_expanded_v1';

const ACCENT_STYLES = {
  brand: {
    activeParent: 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-md shadow-[#E85D3F]/25 font-black',
    activeParentSoft: 'text-[#E85D3F] bg-[#FDEEEB]/70 dark:bg-[#2D1E1B]/40 font-extrabold',
    activeChild: 'bg-[#E85D3F] text-white font-black shadow-xs',
    hover: 'text-[#243447] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]',
    hoverChild: 'text-[#64748B] dark:text-[#CBD5E1] hover:text-[#E85D3F] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]',
    icon: 'text-[#748092] dark:text-[#94A3B8]',
  },
  emerald: {
    activeParent: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-black',
    activeParentSoft: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 font-extrabold',
    activeChild: 'bg-emerald-600 text-white font-black shadow-xs',
    hover: 'text-[#243447] dark:text-[#CBD5E1] hover:text-emerald-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]',
    hoverChild: 'text-[#64748B] dark:text-[#CBD5E1] hover:text-emerald-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  rose: {
    activeParent: 'bg-rose-600 text-white shadow-md shadow-rose-600/25 font-black',
    activeParentSoft: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 font-extrabold',
    activeChild: 'bg-rose-600 text-white font-black shadow-xs',
    hover: 'text-[#243447] dark:text-[#CBD5E1] hover:text-rose-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]',
    hoverChild: 'text-[#64748B] dark:text-[#CBD5E1] hover:text-rose-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B]',
    icon: 'text-rose-600 dark:text-rose-400',
  },
};

function collectActiveBranchKeys(nodes, activeTab, currentHash, acc = []) {
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      if (isTreeNodeActive(node, activeTab, currentHash)) {
        acc.push(node.key);
        collectActiveBranchKeys(node.children, activeTab, currentHash, acc);
      }
    }
  }
  return acc;
}

/**
 * AppSidebar Component
 * Modern Educational SaaS Collapsible Sidebar with Folder-Tree Navigation.
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

  const [expandedFolders, setExpandedFolders] = useState(() => {
    const defaults = {
      skills: isCurrentTabInPractice,
      'skills:input': isCurrentTabInPractice,
      'skills:core': isCurrentTabInPractice,
      'skills:output': isCurrentTabInPractice,
      hsk: activeTab === 'hsk',
      reader: activeTab === 'reader',
      community: activeTab === 'community' || activeTab === 'leaderboard',
      teacher: activeTab === 'teacher',
    };
    try {
      const saved = localStorage.getItem(TREE_EXPANDED_STORAGE_KEY);
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return defaults;
  });

  const [menuFilter, setMenuFilter] = useState('');
  const [pinnedIds, setPinnedIds] = useState(() => getPinnedNavTabs());

  // Auto-expand the active branch whenever route changes
  useEffect(() => {
    const allRoots = [
      ...CORE_TREE_ITEMS,
      { key: 'skills', id: 'practice', label: 'Kỹ năng & Luyện tập', children: SKILLS_TREE_ITEMS },
      ...EXPLORE_TREE_ITEMS,
      ...(isTeacher ? TEACHER_TREE_ITEMS : []),
    ];
    const activeBranches = collectActiveBranchKeys(allRoots, activeTab, currentHash);
    if (activeBranches.length > 0) {
      setExpandedFolders((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const key of activeBranches) {
          if (!next[key]) {
            next[key] = true;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }
  }, [activeTab, currentHash, isTeacher]);

  useEffect(() => {
    try {
      localStorage.setItem(TREE_EXPANDED_STORAGE_KEY, JSON.stringify(expandedFolders));
    } catch {
      // ignore
    }
  }, [expandedFolders]);

  // For test compatibility matching
  const navSections = useMemo(
    () => [
      { id: 'core', title: 'Học tập cốt lõi', items: CORE_TREE_ITEMS },
      { id: 'skills', title: 'Kỹ năng & Luyện tập', items: SKILLS_TREE_ITEMS },
      { id: 'explore', title: 'Khám phá & Cộng đồng', items: EXPLORE_TREE_ITEMS },
      ...(isTeacher ? [{
        id: 'teacher',
        title: 'Cổng Giáo viên',
        items: TEACHER_TREE_ITEMS,
      }] : []),
      ...(isAdmin ? [{
        id: 'admin',
        title: 'Quản trị hệ thống',
        items: ADMIN_TREE_ITEMS,
      }] : []),
    ],
    [isTeacher, isAdmin]
  );

  const handleItemClick = (id, hash = null) => {
    playClickSound();
    recordNavigationVisit(id);
    if (hash && typeof window !== 'undefined') {
      window.location.hash = hash;
      setCurrentHash(hash);
    }
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFolder = (key, e = null) => {
    if (e) e.stopPropagation();
    playClickSound();
    setExpandedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTogglePin = (e, id) => {
    e.stopPropagation();
    playClickSound();
    setPinnedIds(togglePinnedNavTab(id));
  };

  const normalizedFilter = menuFilter.trim().toLowerCase();
  const filteredCore = useMemo(
    () => filterTreeNodes(CORE_TREE_ITEMS, normalizedFilter),
    [normalizedFilter]
  );
  const filteredSkills = useMemo(
    () => filterTreeNodes(SKILLS_TREE_ITEMS, normalizedFilter),
    [normalizedFilter]
  );
  const filteredExplore = useMemo(
    () => filterTreeNodes(EXPLORE_TREE_ITEMS, normalizedFilter),
    [normalizedFilter]
  );
  const filteredTeacher = useMemo(
    () => filterTreeNodes(TEACHER_TREE_ITEMS, normalizedFilter),
    [normalizedFilter]
  );
  const filteredAdmin = useMemo(
    () => filterTreeNodes(ADMIN_TREE_ITEMS, normalizedFilter),
    [normalizedFilter]
  );

  const renderTreeNodes = (nodes, depth = 0, accent = 'brand') => {
    const palette = ACCENT_STYLES[accent] || ACCENT_STYLES.brand;

    return nodes.map((node) => {
      const Icon = node.icon;
      const hasChildren = Array.isArray(node.children) && node.children.length > 0;
      const isExpanded = Boolean(normalizedFilter) || Boolean(expandedFolders[node.key]);
      const isActive = isTreeNodeActive(node, activeTab, currentHash);
      const badge = node.badge || (depth === 0 && !hasChildren ? SMART_NAV_CATALOG[node.id]?.badge : null);
      const canPin =
        !isCollapsed &&
        !hasChildren &&
        !node.isGroupOnly &&
        Boolean(SMART_NAV_CATALOG[node.id]) &&
        (!node.hash || node.key === node.id);
      const isPinned = canPin && pinnedIds.includes(node.id);

      // Collapsed desktop mode renders top-level icons only
      if (isCollapsed && depth === 0) {
        return (
          <button
            key={node.key}
            type="button"
            onMouseEnter={() => prefetchRoute(node.id)}
            onTouchStart={() => prefetchRoute(node.id)}
            onClick={() => handleItemClick(node.id, node.hash || null)}
            title={node.label}
            className={`w-full flex items-center justify-center p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              isActive ? palette.activeParent : palette.hover
            }`}
          >
            <Icon size={18} className={isActive ? 'text-white' : palette.icon} />
          </button>
        );
      }

      const rowButtonClass =
        depth === 0
          ? isActive && !hasChildren
            ? palette.activeParent
            : isActive && hasChildren
            ? palette.activeParentSoft
            : palette.hover
          : isActive && !hasChildren
          ? palette.activeChild
          : isActive && hasChildren
          ? palette.activeParentSoft
          : palette.hoverChild;

      const handleNodePress = () => {
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
          <div className="group relative flex items-center min-w-0">
            {depth > 0 && (
              <span
                aria-hidden="true"
                className="w-2.5 h-px bg-[#DFCBB5] dark:bg-[#334155] shrink-0 mr-1"
              />
            )}
            <button
              type="button"
              onMouseEnter={() => !node.isGroupOnly && prefetchRoute(node.id)}
              onTouchStart={() => !node.isGroupOnly && prefetchRoute(node.id)}
              onClick={handleNodePress}
              className={`w-full min-w-0 flex items-center gap-2 ${
                depth === 0 ? 'px-3 py-2 rounded-2xl text-xs' : 'px-2.5 py-1.5 rounded-xl text-[11px]'
              } font-bold transition-all duration-150 cursor-pointer ${
                hasChildren ? 'pr-7' : canPin ? 'pr-7' : ''
              } ${rowButtonClass}`}
            >
              {node.isGroupOnly ? (
                isExpanded ? (
                  <FolderOpen size={14} className={`shrink-0 ${isActive ? 'text-[#E85D3F]' : 'text-amber-500'}`} />
                ) : (
                  <Folder size={14} className={`shrink-0 ${isActive ? 'text-[#E85D3F]' : 'text-amber-500/80'}`} />
                )
              ) : (
                <Icon
                  size={depth === 0 ? 17 : 14}
                  className={`shrink-0 ${
                    isActive && !hasChildren ? 'text-white' : isActive ? 'text-[#E85D3F]' : palette.icon
                  }`}
                />
              )}

              <span className="truncate text-left">{node.label}</span>

              {badge && !(isActive && !hasChildren) && (
                <span className="ml-auto text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] shrink-0">
                  {badge}
                </span>
              )}

              {!hasChildren && isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white ml-auto shrink-0 animate-pulse" />
              )}
            </button>

            {hasChildren && (
              <button
                type="button"
                onClick={(e) => toggleFolder(node.key, e)}
                aria-label={isExpanded ? `Thu gọn ${node.label}` : `Mở rộng ${node.label}`}
                title={isExpanded ? 'Thu gọn nhánh' : 'Mở rộng nhánh'}
                className="absolute right-1.5 p-1 rounded-lg text-[#748092] dark:text-[#94A3B8] hover:text-[#E85D3F] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : '-rotate-90'}`}
                />
              </button>
            )}

            {canPin && (
              <button
                type="button"
                onClick={(e) => handleTogglePin(e, node.id)}
                title={isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                className={`absolute right-1.5 p-1 rounded-lg transition cursor-pointer ${
                  isPinned
                    ? 'opacity-100 text-amber-400'
                    : 'opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#E85D3F]'
                }`}
              >
                <Pin size={10} className={isPinned ? 'fill-amber-400' : ''} />
              </button>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div
              className={`space-y-0.5 border-l-2 border-[#E9D8C6] dark:border-[#2B3A4F] ${
                depth === 0 ? 'ml-4 pl-2' : 'ml-3.5 pl-1.5'
              } animate-in fade-in duration-150`}
            >
              {renderTreeNodes(node.children, depth + 1, accent)}
            </div>
          )}
        </div>
      );
    });
  };

  const skillsFolderExpanded = Boolean(normalizedFilter) || Boolean(expandedFolders.skills);

  return (
    <aside
      aria-label="Sidebar điều hướng"
      data-sections={navSections.length}
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

      {/* Quick Action: Continue Learning CTA */}
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

      {/* Tree Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        {/* Quick Menu Filter & Pinned Shortcuts (Expanded only) */}
        {!isCollapsed && (
          <div className="space-y-2 pb-1">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748092]" />
              <input
                type="text"
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                placeholder="Lọc nhanh cây menu..."
                className="w-full rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/90 dark:bg-[#1E293B] pl-8 pr-3 py-1.5 text-[11px] font-medium text-[#243447] dark:text-white placeholder:text-[#94A3B8] focus:border-[#E85D3F] focus:outline-hidden"
              />
            </div>

            {!normalizedFilter && pinnedIds.length > 0 && (
              <div className="space-y-1">
                <p className="px-2 text-[9px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8] flex items-center gap-1">
                  <Pin size={10} className="text-[#E85D3F]" />
                  Đã ghim nhanh
                </p>
                <div className="flex flex-wrap gap-1 px-1">
                  {pinnedIds.map((pid) => {
                    const meta = SMART_NAV_CATALOG[pid];
                    if (!meta) return null;
                    const isPinActive = activeTab === pid;
                    return (
                      <button
                        key={pid}
                        type="button"
                        onMouseEnter={() => prefetchRoute(pid)}
                        onTouchStart={() => prefetchRoute(pid)}
                        onClick={() => handleItemClick(pid)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          isPinActive
                            ? 'bg-[#E85D3F] text-white shadow-2xs'
                            : 'bg-white dark:bg-[#1E293B] text-[#243447] dark:text-[#CBD5E1] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F]'
                        }`}
                      >
                        {meta.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1. Core Section */}
        {filteredCore.length > 0 && (
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                Học tập cốt lõi
              </p>
            )}
            {renderTreeNodes(filteredCore, 0, 'brand')}
          </div>
        )}

        {/* 2. Skills Folder Tree */}
        {filteredSkills.length > 0 && (
          <div className="space-y-1">
            {!isCollapsed ? (
              <div>
                <button
                  type="button"
                  onClick={() => toggleFolder('skills')}
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
                      {ALL_PRACTICE_SKILL_IDS.length}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${skillsFolderExpanded ? 'rotate-180' : '-rotate-90'}`}
                  />
                </button>

                {skillsFolderExpanded && (
                  <div className="mt-1 pl-2 space-y-1 border-l-2 border-[#E9D8C6] dark:border-[#2B3A4F] ml-4 animate-in fade-in duration-150">
                    {renderTreeNodes(filteredSkills, 1, 'brand')}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleItemClick('practice')}
                title={`Kỹ năng & Luyện tập (${ALL_PRACTICE_SKILL_IDS.length} kỹ năng)`}
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
        )}

        {/* 3. Explore & Community Section */}
        {filteredExplore.length > 0 && (
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                Khám phá & Cộng đồng
              </p>
            )}
            {renderTreeNodes(filteredExplore, 0, 'brand')}
          </div>
        )}

        {/* 4. Role-based: Teacher Portals */}
        {isTeacher && filteredTeacher.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
            {!isCollapsed && (
              <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Cổng Giáo viên
              </p>
            )}
            {renderTreeNodes(filteredTeacher, 0, 'emerald')}
          </div>
        )}

        {/* 5. Role-based: Admin Portals */}
        {isAdmin && filteredAdmin.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
            {!isCollapsed && (
              <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Quản trị hệ thống
              </p>
            )}
            {renderTreeNodes(filteredAdmin, 0, 'rose')}
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
          className="w-full py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight size={15} />
          ) : (
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
