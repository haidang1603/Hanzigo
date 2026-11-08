import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

const TAB_TITLES = {
  home: 'Trang chủ',
  dashboard: 'Dashboard',
  roadmap: 'Lộ trình HSK',
  lesson: 'Lộ trình HSK',
  practice: 'Luyện tập',
  grammar: 'Ngữ pháp HSK',
  listening: 'Luyện nghe HSK',
  vocabulary: 'Từ vựng HSK',
  pronunciation: 'Luyện phát âm',
  writing: 'Từ điển & Viết chữ',
  reader: 'Đọc hiểu & Báo chí',
  conversation: 'Hội thoại AI',
  hsk: 'Thi thử HSK',
  classroom: 'Lớp học',
  materials: 'Thư viện tài liệu',
  community: 'Cộng đồng học viên',
  leaderboard: 'Bảng vàng',
  teacher: 'Cổng Giáo viên',
  admin: 'Quản trị hệ thống',
  profile: 'Hồ sơ cá nhân',
  privacy: 'Chính sách bảo mật',
  terms: 'Điều khoản dịch vụ',
  cookies: 'Chính sách Cookie',
  refund: 'Chính sách hoàn tiền',
  'reset-password': 'Đặt lại mật khẩu'
};

const TEACHER_SUB_TITLES = {
  classes: 'Quản lý lớp học',
  students: 'Danh sách học viên',
  grading: 'Chấm bài & Nhận xét',
  analytics: 'Báo cáo học tập',
  'ai-studio': 'AI Lesson Studio'
};

const CLASSROOM_SUB_TITLES = {
  join: 'Tham gia lớp học mới',
  assignments: 'Bài tập lớp học'
};

/**
 * Breadcrumbs Component
 * Automatically computes hierarchical navigation based on active route and sub-routes.
 */
export default function Breadcrumbs({ 
  activeTab = 'home', 
  routeInfo = null, 
  onNavigate = null,
  className = ''
}) {
  // Never show redundant breadcrumb on home page
  if (!activeTab || activeTab === 'home') {
    return null;
  }

  const items = [
    { id: 'home', label: 'Trang chủ', isHome: true, clickable: true }
  ];

  // Group practice sub-skills under "Luyện tập" if specific skill
  const isPracticeSkill = ['grammar', 'listening', 'vocabulary', 'pronunciation', 'writing', 'reader', 'conversation'].includes(activeTab);
  if (isPracticeSkill) {
    items.push({
      id: 'practice',
      label: 'Luyện tập',
      clickable: true
    });
  }

  // Primary active tab
  const mainLabel = TAB_TITLES[activeTab] || activeTab;
  const hasSub = routeInfo && routeInfo.sub;

  items.push({
    id: activeTab,
    label: mainLabel,
    clickable: Boolean(hasSub)
  });

  // Handle sub routes (Teacher, Classroom, etc.)
  if (routeInfo && routeInfo.sub) {
    if (activeTab === 'teacher') {
      const subLabel = TEACHER_SUB_TITLES[routeInfo.sub] || routeInfo.sub;
      items.push({
        id: `${activeTab}/${routeInfo.sub}`,
        label: subLabel,
        clickable: Boolean(routeInfo.param)
      });
      if (routeInfo.param) {
        items.push({
          id: `${activeTab}/${routeInfo.sub}/${routeInfo.param}`,
          label: `Lớp #${routeInfo.param}`,
          clickable: false
        });
      }
    } else if (activeTab === 'classroom') {
      const subLabel = CLASSROOM_SUB_TITLES[routeInfo.sub] || `Chi tiết lớp #${routeInfo.sub}`;
      items.push({
        id: `${activeTab}/${routeInfo.sub}`,
        label: subLabel,
        clickable: false
      });
    } else if (activeTab === 'practice' && routeInfo.sub) {
      items.push({
        id: `practice/${routeInfo.sub}`,
        label: `Kỹ năng: ${routeInfo.sub}`,
        clickable: false
      });
    } else if (routeInfo.sub) {
      items.push({
        id: `${activeTab}/${routeInfo.sub}`,
        label: routeInfo.sub,
        clickable: false
      });
    }
  }

  const handleClick = (item) => {
    if (!item.clickable || !onNavigate) return;
    playClickSound();
    onNavigate(item.id);
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center text-xs font-semibold text-[#748092] dark:text-[#94A3B8] overflow-x-auto whitespace-nowrap py-1 ${className}`}
    >
      <ol className="flex items-center gap-1 sm:gap-1.5 list-none m-0 p-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="inline-flex items-center gap-1 sm:gap-1.5">
              {idx > 0 && (
                <ChevronRight size={13} className="text-gray-400 dark:text-gray-600 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span 
                  aria-current="page" 
                  className="font-bold text-[#243447] dark:text-white truncate max-w-[200px] sm:max-w-[320px]"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className="hover:text-[#E85D3F] transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E85D3F] rounded px-1"
                >
                  {item.isHome && <Home size={13} className="shrink-0" />}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

