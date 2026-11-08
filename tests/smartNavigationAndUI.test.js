import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Import pure JS modules
import { DESIGN_COLORS, BUTTON_VARIANTS, BADGE_VARIANTS, CARD_SURFACE, NAVIGATION_GROUPS } from '../src/styles/designTokens.js';
import { CURRICULUM_ALL_LESSONS } from '../src/data/curriculumLessons.js';
import { HSK_EXAMS } from '../src/data/hskExamsData.js';

// Read source files for structural/syntactic assertions
const appSidebarPath = path.join(process.cwd(), 'src/components/navigation/AppSidebar.jsx');
const appHeaderPath = path.join(process.cwd(), 'src/components/navigation/AppHeader.jsx');
const breadcrumbsPath = path.join(process.cwd(), 'src/components/navigation/Breadcrumbs.jsx');
const mobileNavPath = path.join(process.cwd(), 'src/components/navigation/MobileNavigation.jsx');
const smartCmdPath = path.join(process.cwd(), 'src/components/navigation/SmartCommandPalette.jsx');
const appPath = path.join(process.cwd(), 'src/App.jsx');

const appSidebarSrc = fs.readFileSync(appSidebarPath, 'utf8');
const appHeaderSrc = fs.readFileSync(appHeaderPath, 'utf8');
const breadcrumbsSrc = fs.readFileSync(breadcrumbsPath, 'utf8');
const mobileNavSrc = fs.readFileSync(mobileNavPath, 'utf8');
const smartCmdSrc = fs.readFileSync(smartCmdPath, 'utf8');
const appSrc = fs.readFileSync(appPath, 'utf8');

test('1. DESIGN TOKENS: Centralized modern educational SaaS tokens are defined', () => {
  assert.ok(DESIGN_COLORS.primary, 'Primary color must exist');
  assert.equal(DESIGN_COLORS.primary, '#E85D3F', 'Primary must be HanziGo Imperial Red');
  assert.equal(DESIGN_COLORS.secondary, '#F4B942', 'Secondary must be Gold Accent');
  assert.equal(DESIGN_COLORS.success, '#45B97C', 'Success must be Jade Green');
  assert.equal(DESIGN_COLORS.dark, '#243447', 'Dark text must be Ink Slate');

  assert.ok(BUTTON_VARIANTS.primary, 'Button primary variant must exist');
  assert.ok(BUTTON_VARIANTS.secondary, 'Button secondary variant must exist');
  assert.ok(BADGE_VARIANTS.primary, 'Badge primary variant must exist');
  assert.ok(CARD_SURFACE.default, 'Card surface must exist');
});

test('2. NAVIGATION TAXONOMY: Core, Skills, Explore, Teacher, Admin sections', () => {
  assert.ok(Array.isArray(NAVIGATION_GROUPS), 'NAVIGATION_GROUPS must be an array');
  const groupIds = NAVIGATION_GROUPS.map(g => g.id);
  assert.ok(groupIds.includes('core'), 'Must contain core group');
  assert.ok(groupIds.includes('skills'), 'Must contain skills group');
  assert.ok(groupIds.includes('explore'), 'Must contain explore group');
  assert.ok(groupIds.includes('teacher'), 'Must contain teacher group');
  assert.ok(groupIds.includes('admin'), 'Must contain admin group');

  const teacherGroup = NAVIGATION_GROUPS.find(g => g.id === 'teacher');
  assert.equal(teacherGroup.requiredRole, 'teacher', 'Teacher group requires teacher role');

  const adminGroup = NAVIGATION_GROUPS.find(g => g.id === 'admin');
  assert.equal(adminGroup.requiredRole, 'admin', 'Admin group requires admin role');
});

test('3. BREADCRUMBS LOGIC: Suppresses Home tab to prevent redundancy', () => {
  assert.ok(breadcrumbsSrc.includes("if (!activeTab || activeTab === 'home')"), 
    'Breadcrumbs component must suppress rendering on Home tab');
  assert.ok(breadcrumbsSrc.includes('aria-label="Breadcrumb"'), 
    'Breadcrumbs must have accessible aria-label');
  assert.ok(breadcrumbsSrc.includes("label: 'Luyện tập'"), 
    'Breadcrumbs must nest practice sub-skills under Luyện tập');
  assert.ok(breadcrumbsSrc.includes("teacher: 'Cổng Giáo viên'"), 
    'Breadcrumbs must support Cổng Giáo viên mapping');
});

test('4. ROLE-BASED SIDEBAR: Restricts teacher and admin links from student', () => {
  // Check filtering logic inside AppSidebar.jsx
  assert.ok(appSidebarSrc.includes("const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');"),
    'AppSidebar must compute isAdmin safely');
  assert.ok(appSidebarSrc.includes("const isTeacher = Boolean(user && (user.role === 'teacher' || isAdmin) && user.status !== 'blocked');"),
    'AppSidebar must compute isTeacher safely');
  assert.ok(appSidebarSrc.includes('...(isTeacher ? [{'),
    'AppSidebar must gate teacher section on isTeacher');
  assert.ok(appSidebarSrc.includes('...(isAdmin ? [{'),
    'AppSidebar must gate admin section on isAdmin');
});

test('5. SIDEBAR COLLAPSE STATE: Persists in localStorage and toggles width', () => {
  assert.ok(appSidebarSrc.includes("isCollapsed ? 'w-20' : 'w-64'"), 'Sidebar toggles between w-20 and w-64');
  assert.ok(appSrc.includes("localStorage.getItem('hanzigo_sidebar_collapsed')"), 'App.jsx reads persisted sidebar collapse state');
  assert.ok(appSrc.includes("localStorage.setItem('hanzigo_sidebar_collapsed'"), 'App.jsx writes persisted sidebar collapse state');
});

test('6. SMART COMMAND PALETTE: Keyboard shortcuts, dialog role, and ARIA modal', () => {
  assert.ok(smartCmdSrc.includes('role="dialog"'), 'Command palette must have role="dialog"');
  assert.ok(smartCmdSrc.includes('aria-modal="true"'), 'Command palette must have aria-modal="true"');
  assert.ok(appSrc.includes("(e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'"),
    'App.jsx must register Ctrl+K / Cmd+K shortcut');
  assert.ok(smartCmdSrc.includes('removeVietnameseTones'), 'Command palette must normalize Vietnamese diacritics');
});

test('7. SMART COMMAND PALETTE: Indexes 120 curriculum lessons and HSK exams', () => {
  assert.ok(Array.isArray(CURRICULUM_ALL_LESSONS), 'Curriculum lessons must be loaded');
  assert.equal(CURRICULUM_ALL_LESSONS.length, 120, 'Should have all 120 lessons across HSK 1-6');
  assert.ok(Array.isArray(HSK_EXAMS), 'HSK Exams must be loaded');
  assert.ok(HSK_EXAMS.length >= 10, 'Should have verified HSK exams in dataset');
  assert.ok(smartCmdSrc.includes('CURRICULUM_ALL_LESSONS.filter'), 'Command palette must index curriculum lessons');
  assert.ok(smartCmdSrc.includes('HSK_EXAMS.filter'), 'Command palette must index HSK mock exams');
});

test('8. MOBILE NAVIGATION: Provides off-canvas drawer and 5-item bottom touch bar', () => {
  assert.ok(mobileNavSrc.includes('aria-label="Điều hướng nhanh di động"'), 'Bottom bar must have accessible label');
  assert.ok(mobileNavSrc.includes("id: 'home'"), 'Bottom bar contains home');
  assert.ok(mobileNavSrc.includes("id: 'roadmap'"), 'Bottom bar contains roadmap');
  assert.ok(mobileNavSrc.includes("id: 'practice'"), 'Bottom bar contains practice');
  assert.ok(mobileNavSrc.includes("id: 'hsk'"), 'Bottom bar contains hsk');
  assert.ok(mobileNavSrc.includes("id: 'more-drawer'"), 'Bottom bar contains more-drawer');
  assert.ok(mobileNavSrc.includes('min-h-[44px]'), 'Touch targets must be at least 44px');
});

test('9. APP INTEGRATION: App.jsx embeds Sidebar, Header, MobileNav, and SmartCommandPalette', () => {
  assert.ok(appSrc.includes('<AppSidebar'), 'App.jsx must render AppSidebar');
  assert.ok(appSrc.includes('<AppHeader'), 'App.jsx must render AppHeader');
  assert.ok(appSrc.includes('<MobileNavigation'), 'App.jsx must render MobileNavigation');
  assert.ok(appSrc.includes('<SmartCommandPalette'), 'App.jsx must render SmartCommandPalette');
  assert.ok(appSrc.includes('lastLesson'), 'App.jsx must compute continue learning lastLesson');
});

test('10. REGRESSION: Legacy Navbar.jsx and CommandPaletteModal.jsx maintain compatibility', () => {
  const navbarPath = path.join(process.cwd(), 'src/components/Navbar.jsx');
  assert.ok(fs.existsSync(navbarPath), 'Navbar.jsx must still exist for regression safety');
  const navbarContent = fs.readFileSync(navbarPath, 'utf8');
  assert.ok(navbarContent.includes("handleNavClick('roadmap')"), 'Navbar routes to roadmap');

  const cmdModalPath = path.join(process.cwd(), 'src/components/dictionary/CommandPaletteModal.jsx');
  assert.ok(fs.existsSync(cmdModalPath), 'CommandPaletteModal.jsx must still exist');
  const cmdModalContent = fs.readFileSync(cmdModalPath, 'utf8');
  assert.ok(cmdModalContent.includes('SmartCommandPalette'), 'CommandPaletteModal forwards to SmartCommandPalette');
});

test('11. AVATAR SYNCHRONIZATION: Navigation components synchronize user avatar with main profile avatar', () => {
  const userAvatarPath = path.join(process.cwd(), 'src/components/common/UserAvatar.jsx');
  assert.ok(fs.existsSync(userAvatarPath), 'UserAvatar.jsx component must exist');

  const userAvatarSrc = fs.readFileSync(userAvatarPath, 'utf8');
  assert.ok(userAvatarSrc.includes('hanzigo_custom_avatar'), 'UserAvatar must resolve custom avatar from localStorage');
  assert.ok(userAvatarSrc.includes('hanzigo_avatar_updated'), 'UserAvatar must listen for hanzigo_avatar_updated real-time event');

  assert.ok(appSidebarSrc.includes('UserAvatar'), 'AppSidebar must render UserAvatar');
  assert.ok(appHeaderSrc.includes('UserAvatar'), 'AppHeader must render UserAvatar');
  assert.ok(mobileNavSrc.includes('UserAvatar'), 'MobileNavigation must render UserAvatar');
});

