import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AdminGuard from './components/AdminGuard';
import RouteSuspenseFallback from './components/common/RouteSuspenseFallback';
import { lazyWithRetry } from './core/routing/lazyWithRetry';
import HomePage from './pages/HomePage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { calculateTotalXp, awardXp, getStreakStatus, getUserStorageKey } from './utils/gamification';
import { loadAllUserDataFromDb, triggerCloudSync, saveUserProgress } from './services';

// Route-level code splitting with network retry & deploy-manifest auto-reload
const DashboardPage = lazyWithRetry(() => import('./pages/DashboardPage'), ['dashboard']);
const RoadmapPage = lazyWithRetry(() => import('./pages/RoadmapPage'), ['roadmap', 'lesson']);
const LearningIntelligenceHub = lazyWithRetry(() => import('./features/intelligence/LearningIntelligenceHub.tsx'), ['intelligence']);
const VocabularyPage = lazyWithRetry(() => import('./pages/VocabularyPage'), ['vocabulary']);
const PronunciationPage = lazyWithRetry(() => import('./pages/PronunciationPage'), ['pronunciation']);
const WritingPage = lazyWithRetry(() => import('./pages/WritingPage'), ['writing']);
const ConversationPage = lazyWithRetry(() => import('./pages/ConversationPage'), ['conversation']);
const CommunityPage = lazyWithRetry(() => import('./pages/CommunityPage'), ['community', 'leaderboard']);
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'), ['profile']);
const MaterialsPage = lazyWithRetry(() => import('./pages/MaterialsPage'), ['materials']);
const AdminPage = lazyWithRetry(() => import('./pages/AdminPage'), ['admin']);
const TeacherDashboardPage = lazyWithRetry(() => import('./pages/TeacherDashboardPage'), ['teacher']);
const ClassroomPage = lazyWithRetry(() => import('./pages/ClassroomPage'), ['classroom']);
const LiveClassroomPage = lazyWithRetry(() => import('./pages/LiveClassroomPage'), ['live']);
const HskPracticePage = lazyWithRetry(() => import('./pages/HskPracticePage'), ['hsk', 'hsk-practice']);
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/PrivacyPolicyPage'), ['privacy']);
const TermsOfServicePage = lazyWithRetry(() => import('./pages/TermsOfServicePage'), ['terms']);
const CookiePolicyPage = lazyWithRetry(() => import('./pages/CookiePolicyPage'), ['cookies']);
const RefundPolicyPage = lazyWithRetry(() => import('./pages/RefundPolicyPage'), ['refund']);
const StoragePreferencesPage = lazyWithRetry(() => import('./pages/StoragePreferencesPage'), ['storage-preferences']);
const ReaderPage = lazyWithRetry(() => import('./pages/ReaderPage'), ['reader']);
const ResetPasswordPage = lazyWithRetry(() => import('./pages/ResetPasswordPage'), ['reset-password']);
const PracticePage = lazyWithRetry(() => import('./pages/PracticePage'), ['practice', 'listening', 'grammar']);
import CookieStorageConsentBanner from './components/legal/CookieStorageConsentBanner';
import TeacherGuard from './components/TeacherGuard';
import CommandPaletteModal from './components/dictionary/CommandPaletteModal.jsx';
import { AppSidebar, AppHeader, MobileNavigation, SmartCommandPalette } from './components/navigation';
import { UnifiedDashboard } from './components/dashboard';
import { getRecommendedNextLesson, getLessonById } from './services/learningPathService';
import { UnifiedToolsProvider, useUnifiedTools } from './core/ecosystem/UnifiedToolsContext.tsx';
import { GlobalTextSelectionActionBar } from './features/unified-ecosystem/GlobalTextSelectionActionBar.tsx';
const UniversalSlideOverDrawer = lazyWithRetry(() =>
  import('./features/unified-ecosystem/UniversalSlideOverDrawer.tsx').then((m) => ({
    default: m.UniversalSlideOverDrawer,
  }))
);

function LazyGlobalDrawer() {
  const { isOpen } = useUnifiedTools();
  if (!isOpen) return null;
  return (
    <Suspense fallback={null}>
      <UniversalSlideOverDrawer />
    </Suspense>
  );
}

const VALID_TABS = [
  'home', 'dashboard', 'intelligence', 'roadmap', 'lesson', 'vocabulary', 
  'pronunciation', 'writing', 'dictionary', 'reader', 'conversation', 'community', 
  'materials', 'admin', 'profile', 'leaderboard',
  'teacher', 'classroom', 'hsk', 'privacy', 'terms', 'cookies', 'refund', 'storage-preferences',
  'reset-password', 'practice', 'grammar', 'listening'
];

function MainApp() {
  const { user, setUser, isAdmin, isTeacher, logout } = useAuth();
  const { darkMode, setDarkMode, soundEnabled, setSoundEnabled } = useTheme();

  // Helper to parse detailed sub-routes for teacher and classroom
  const parseCurrentRoute = () => {
    try {
      // Check pathname first for clean legal routes (e.g., /privacy-policy, /terms-of-service)
      const path = (window.location.pathname || '').replace(/^\//, '').toLowerCase();
      if (path === 'privacy-policy' || path === 'privacy') return { tab: 'privacy', sub: null, param: null, extra: null };
      if (path === 'terms-of-service' || path === 'terms') return { tab: 'terms', sub: null, param: null, extra: null };
      if (path === 'cookie-policy' || path === 'cookies') return { tab: 'cookies', sub: null, param: null, extra: null };
      if (path === 'refund-policy' || path === 'refund') return { tab: 'refund', sub: null, param: null, extra: null };
      if (path === 'storage-preferences' || path === 'tuy-chon-luu-tru') return { tab: 'storage-preferences', sub: null, param: null, extra: null };
      if (path === 'reset-password' || path === 'reset') return { tab: 'reset-password', sub: null, param: null, extra: null };

      // Recovery flow detection: if URL hash contains recovery token, route directly to reset-password
      const rawHash = (window.location.hash || '');
      if (rawHash.includes('type=recovery') || rawHash.includes('reset-password')) {
        return { tab: 'reset-password', sub: null, param: null, extra: null };
      }

      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      const parts = hash.split('/').filter(Boolean);
      const rawTab = (parts[0] || 'home').toLowerCase();
      const tab = 
        rawTab === 'dictionary' ? 'writing' :
        rawTab === 'privacy-policy' ? 'privacy' :
        rawTab === 'terms-of-service' ? 'terms' :
        rawTab === 'cookie-policy' ? 'cookies' :
        rawTab === 'refund-policy' ? 'refund' :
        rawTab === 'tuy-chon-luu-tru' ? 'storage-preferences' :
        rawTab === 'reset-password' ? 'reset-password' :
        rawTab;
      const sub = parts[1] || null;
      const param = parts[2] || null;
      const extra = parts[3] || null;
      return { tab, sub, param, extra };
    } catch {
      return { tab: 'home', sub: null, param: null, extra: null };
    }
  };

  const [routeInfo, setRouteInfo] = useState(parseCurrentRoute);

  // Navigation tab state with hash & localStorage sync
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const parsed = parseCurrentRoute();
      if (parsed.tab && VALID_TABS.includes(parsed.tab)) return parsed.tab;
      const savedTab = localStorage.getItem('hanzigo_active_tab');
      if (savedTab && VALID_TABS.includes(savedTab)) return savedTab;
      return 'home';
    } catch {
      return 'home';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hanzigo_active_tab', activeTab);
      if (!window.location.hash.includes('access_token=') && !window.location.hash.includes('error=')) {
        const parsed = parseCurrentRoute();
        if (parsed.tab !== activeTab) {
          window.location.hash = `#${activeTab}`;
        }
      }
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const parsed = parseCurrentRoute();
        setRouteInfo(parsed);
        if (parsed.tab && VALID_TABS.includes(parsed.tab)) {
          setActiveTab(parsed.tab);
        }
      } catch {}
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Gamification state - synchronized across Navbar and Dashboard
  const getEffectiveStreak = (u) => {
    if (!u) return 0;
    return getStreakStatus(u).streak || 0;
  };

  const [streak, setStreak] = useState(() => getEffectiveStreak(user));
  const [xp, setXp] = useState(() => calculateTotalXp(user));
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop sidebar collapsed state persisted in localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('hanzigo_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('hanzigo_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Smart quick-access next recommended lesson
  const lastLesson = React.useMemo(() => {
    try {
      const nextId = getRecommendedNextLesson(user);
      return getLessonById(nextId) || { id: nextId, title: `Bài ${nextId}` };
    } catch {
      return { id: 'l-101', title: 'Bài 101: Chào hỏi' };
    }
  }, [user]);

  const handleContinueLearning = () => {
    handleSelectLesson(lastLesson?.id || 'l-101');
  };

  // Global hotkey Ctrl+K / Cmd+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setStreak(getEffectiveStreak(user));
    setXp(calculateTotalXp(user));
  }, [activeTab, user]);

  useEffect(() => {
    const handleGamificationUpdated = () => {
      setStreak(getEffectiveStreak(user));
      setXp(calculateTotalXp(user));
    };
    window.addEventListener('hanzigo_gamification_updated', handleGamificationUpdated);
    window.addEventListener('storage', handleGamificationUpdated);
    return () => {
      window.removeEventListener('hanzigo_gamification_updated', handleGamificationUpdated);
      window.removeEventListener('storage', handleGamificationUpdated);
    };
  }, [user]);

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    if (userData?.uid) {
      try {
        await loadAllUserDataFromDb(userData.uid);
        await triggerCloudSync(userData.uid);
      } catch (err) {
        console.warn('DB sync error upon login:', err);
      }
    }
    setStreak(getEffectiveStreak(userData));
    setXp(calculateTotalXp(userData));
  };

  const handleLogout = async () => {
    await logout();
    setStreak(0);
    setXp(0);
    setActiveTab('home');
  };

  const handleAddXp = (amount) => {
    const newTotal = awardXp(amount, user, `lesson_award_${Date.now()}`);
    const newStreak = getEffectiveStreak(user);
    setXp(newTotal);
    setStreak(newStreak);
    if (user?.uid) {
      saveUserProgress(user.uid, { xp: newTotal, streak: newStreak });
    }
  };

  // Cross-page navigation and target selection
  const [targetRoadmapLessonId, setTargetRoadmapLessonId] = useState(null);

  const [writingTarget, setWritingTarget] = useState(() => {
    try {
      const saved = sessionStorage.getItem('hanzigo_writing_target');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pronounceTarget, setPronounceTarget] = useState(() => {
    try {
      const saved = sessionStorage.getItem('hanzigo_pronounce_target');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSelectLesson = (lessonIdOrObj) => {
    let id = 'l-101';
    if (typeof lessonIdOrObj === 'string') {
      id = lessonIdOrObj;
    } else if (lessonIdOrObj && typeof lessonIdOrObj === 'object') {
      id = lessonIdOrObj.id || 'l-101';
    } else if (typeof lessonIdOrObj === 'number') {
      const indexMap = ['l-101', 'l-102', 'l-103', 'l-104', 'l-105', 'l-106'];
      id = indexMap[lessonIdOrObj] || 'l-101';
    }
    setTargetRoadmapLessonId(id);
    setActiveTab('roadmap');
  };

  const handleSelectWriting = (vocabItem) => {
    setWritingTarget(vocabItem);
    try {
      sessionStorage.setItem('hanzigo_writing_target', JSON.stringify(vocabItem));
    } catch {}
    setActiveTab('writing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPronounce = (vocabItem) => {
    setPronounceTarget(vocabItem);
    try {
      sessionStorage.setItem('hanzigo_pronounce_target', JSON.stringify(vocabItem));
    } catch {}
    setActiveTab('pronunciation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearWritingTarget = () => {
    setWritingTarget(null);
    try {
      sessionStorage.removeItem('hanzigo_writing_target');
    } catch {}
  };

  const handleClearPronounceTarget = () => {
    setPronounceTarget(null);
    try {
      sessionStorage.removeItem('hanzigo_pronounce_target');
    } catch {}
  };

  // Full-screen Live Classroom mode
  const isLiveRoom = activeTab === 'classroom' && routeInfo.param === 'live' && Boolean(routeInfo.extra);
  if (isLiveRoom) {
    return (
      <Suspense fallback={<RouteSuspenseFallback />}>
        <LiveClassroomPage
          user={user}
          classId={routeInfo.sub}
          sessionId={routeInfo.extra}
          onNavigateBack={() => {
            window.location.hash = `#classroom/${routeInfo.sub}`;
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-[#F3F4F6] transition-colors duration-200">
      
      {/* 1. Desktop Smart Adaptive Collapsible Sidebar */}
      <AppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onContinueLearning={handleContinueLearning}
        lastLesson={lastLesson}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* 2. Main Layout Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Top Header with Breadcrumbs, Global Search, Gamification */}
        <AppHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          routeInfo={routeInfo}
          user={user}
          streak={streak}
          xp={xp}
          openAuthModal={handleOpenAuth}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
          onContinueLearning={handleContinueLearning}
          lastLesson={lastLesson}
        />

        {/* Main Content Area (pb-20 on mobile for bottom navigation bar) */}
        <main className="flex-1 pb-20 lg:pb-0">
        <Suspense fallback={<RouteSuspenseFallback />}>
          {(activeTab === 'home' || activeTab === 'dashboard') && (
            <UnifiedDashboard 
              user={user}
              streak={streak}
              xp={xp}
              setActiveTab={setActiveTab} 
              openAuthModal={handleOpenAuth} 
              onSelectLesson={handleSelectLesson}
              onNavigate={(route, id) => {
                if (route === 'dashboard') {
                  window.location.hash = '#teacher';
                } else if (route === 'classes' && !id) {
                  window.location.hash = '#teacher/classes';
                } else if (route === 'classes' && id) {
                  window.location.hash = `#teacher/classes/${id}`;
                } else if (route === 'students') {
                  window.location.hash = '#teacher/students';
                } else if (route === 'grading') {
                  window.location.hash = '#teacher/grading';
                } else if (route === 'analytics') {
                  window.location.hash = '#teacher/analytics';
                } else if (route === 'ai-studio' || route === 'ai_studio') {
                  window.location.hash = '#teacher/ai-studio';
                }
              }}
            />
          )}

          {activeTab === 'intelligence' && (
            <LearningIntelligenceHub
              user={user}
              streak={streak}
              setActiveTab={setActiveTab}
            />
          )}

          {(activeTab === 'roadmap' || activeTab === 'lesson') && (
            <RoadmapPage 
              user={user}
              setActiveTab={setActiveTab} 
              initialLessonId={targetRoadmapLessonId}
              onClearInitialLesson={() => setTargetRoadmapLessonId(null)}
              onAddXp={handleAddXp}
              onSelectWriting={handleSelectWriting}
              onSelectPronounce={handleSelectPronounce}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyPage 
              user={user}
              setActiveTab={setActiveTab} 
              onSelectWriting={handleSelectWriting}
              onSelectPronounce={handleSelectPronounce}
            />
          )}

          {activeTab === 'pronunciation' && (
            <PronunciationPage 
              user={user}
              targetVocab={pronounceTarget}
              onClearTargetVocab={handleClearPronounceTarget}
              setActiveTab={setActiveTab}
              onSelectWriting={handleSelectWriting}
            />
          )}

          {activeTab === 'writing' && (
            <WritingPage 
              user={user}
              targetVocab={writingTarget}
              onClearTargetVocab={handleClearWritingTarget}
              setActiveTab={setActiveTab}
              onSelectPronounce={handleSelectPronounce}
            />
          )}

          {activeTab === 'reader' && (
            <ReaderPage 
              user={user}
              setActiveTab={setActiveTab}
              initialMode={routeInfo.sub || 'graded'}
              onSelectWritingChar={handleSelectWriting}
            />
          )}

          {activeTab === 'conversation' && (
            <ConversationPage user={user} openAuthModal={handleOpenAuth} />
          )}

          {(activeTab === 'practice' || activeTab === 'grammar' || activeTab === 'listening' || activeTab === 'listening-studio' || activeTab === 'video' || activeTab === 'video-studio' || activeTab === 'hsk30-translation') && (
            <PracticePage
              user={user}
              setActiveTab={setActiveTab}
              initialSkill={
                activeTab === 'grammar'
                  ? 'grammar'
                  : activeTab === 'listening'
                  ? 'listening'
                  : activeTab === 'listening-studio'
                  ? 'listening-studio'
                  : activeTab === 'video' || activeTab === 'video-studio'
                  ? 'video-studio'
                  : activeTab === 'hsk30-translation'
                  ? 'hsk30-translation'
                  : (routeInfo.sub || 'overview')
              }
              initialLevel={routeInfo.param ? parseInt(routeInfo.param, 10) : 1}
              onSelectWriting={handleSelectWriting}
              onSelectPronounce={handleSelectPronounce}
              onSelectLesson={(lessonId) => {
                window.location.hash = `#roadmap/${lessonId}`;
                setActiveTab('roadmap');
              }}
            />
          )}


          {(activeTab === 'community' || activeTab === 'leaderboard') && (
            <CommunityPage 
              user={user} 
              setActiveTab={setActiveTab}
              initialView={
                activeTab === 'leaderboard' || routeInfo.sub === 'leaderboard'
                  ? 'leaderboard'
                  : routeInfo.sub === 'partners'
                  ? 'partners'
                  : routeInfo.sub === 'challenge'
                  ? 'challenge'
                  : 'feed'
              }
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsPage 
              setActiveTab={setActiveTab} 
              user={user} 
              isAdmin={isAdmin}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {activeTab === 'admin' && (
            <AdminGuard 
              user={user} 
              isAdmin={isAdmin} 
              onGoHome={() => setActiveTab('home')}
            >
              <AdminPage 
                user={user} 
                onUpdateUser={setUser} 
                setActiveTab={setActiveTab} 
              />
            </AdminGuard>
          )}

          {activeTab === 'teacher' && (
            <TeacherGuard 
              user={user} 
              isTeacher={isTeacher} 
              onGoHome={() => setActiveTab('home')}
            >
              <TeacherDashboardPage 
                user={user}
                setActiveTab={setActiveTab}
                subRoute={
                  routeInfo.sub === 'classes' && routeInfo.param ? 'class_detail' :
                  routeInfo.sub === 'classes' ? 'classes' :
                  routeInfo.sub === 'students' ? 'students' :
                  routeInfo.sub === 'grading' ? 'grading' :
                  routeInfo.sub === 'analytics' ? 'analytics' :
                  routeInfo.sub === 'ai_studio' || routeInfo.sub === 'ai-studio' ? 'ai_studio' :
                  'dashboard'
                }
                classId={routeInfo.sub === 'classes' ? routeInfo.param : null}
                onNavigate={(route, id) => {
                  if (route === 'dashboard') {
                    window.location.hash = '#teacher';
                  } else if (route === 'classes' && !id) {
                    window.location.hash = '#teacher/classes';
                  } else if (route === 'classes' && id) {
                    window.location.hash = `#teacher/classes/${id}`;
                  } else if (route === 'students') {
                    window.location.hash = '#teacher/students';
                  } else if (route === 'grading') {
                    window.location.hash = '#teacher/grading';
                  } else if (route === 'analytics') {
                    window.location.hash = '#teacher/analytics';
                  } else if (route === 'ai_studio' || route === 'ai-studio') {
                    window.location.hash = '#teacher/ai-studio';
                  }
                }}
              />
            </TeacherGuard>
          )}

          {activeTab === 'classroom' && (
            <ClassroomPage 
              user={user}
              setActiveTab={setActiveTab}
              subRoute={
                routeInfo.sub === 'join' ? 'join' :
                routeInfo.sub ? 'detail' :
                'list'
              }
              classId={routeInfo.sub && routeInfo.sub !== 'join' ? routeInfo.sub : null}
              onNavigate={(route, id) => {
                if (route === 'list') {
                  window.location.hash = '#classroom';
                } else if (route === 'join') {
                  window.location.hash = '#classroom/join';
                } else if (route === 'detail' && id) {
                  window.location.hash = `#classroom/${id}`;
                } else if (route === 'assignments' && id) {
                  window.location.hash = `#classroom/${id}/assignments`;
                }
              }}
            />
          )}

          {activeTab === 'hsk' && (
            <HskPracticePage 
              user={user}
              setActiveTab={setActiveTab}
              subRoute={routeInfo.sub || 'home'}
              paramId={routeInfo.param}
              onNavigate={(view, id) => {
                if (view === 'home' || view === 'levels') {
                  window.location.hash = '#hsk';
                } else if (view === 'exams') {
                  window.location.hash = '#hsk/exams';
                } else if (view === 'history') {
                  window.location.hash = '#hsk/history';
                } else if (view === 'mistakes') {
                  window.location.hash = '#hsk/mistakes';
                } else if (view === 'analytics') {
                  window.location.hash = '#hsk/analytics';
                } else if (view === 'resources') {
                  window.location.hash = '#hsk/resources';
                } else if (view === 'structure') {
                  window.location.hash = '#hsk/structure';
                } else if (view === 'hsk6_simulator') {
                  window.location.hash = '#hsk/hsk6_simulator';
                } else if (view === 'hskk_simulator') {
                  window.location.hash = '#hsk/hskk_simulator';
                } else if (view === 'exam' && id) {
                  window.location.hash = `#hsk/exam/${id}`;
                } else if (view === 'take' && id) {
                  window.location.hash = `#hsk/take/${id}`;
                } else if (view === 'result' && id) {
                  window.location.hash = `#hsk/result/${id}`;
                }
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage 
              user={user} 
              onUpdateUser={setUser}
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyPolicyPage setActiveTab={setActiveTab} />
          )}

          {activeTab === 'terms' && (
            <TermsOfServicePage setActiveTab={setActiveTab} />
          )}

          {activeTab === 'cookies' && (
            <CookiePolicyPage setActiveTab={setActiveTab} />
          )}

          {activeTab === 'refund' && (
            <RefundPolicyPage setActiveTab={setActiveTab} />
          )}
          {activeTab === 'storage-preferences' && (
            <StoragePreferencesPage setActiveTab={setActiveTab} />
          )}

          {activeTab === 'reset-password' && (
            <ResetPasswordPage 
              onNavigateHome={() => {
                setActiveTab('home');
                window.location.hash = '#home';
              }}
              onOpenLogin={() => {
                setActiveTab('home');
                window.location.hash = '#home';
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
            />
          )}
        </Suspense>
        </main>

        {/* 3. Global Footer */}
        <Footer setActiveTab={setActiveTab} user={user} />
      </div>

      {/* 4. Mobile Navigation Drawer & Bottom Bar */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={(toggle) => setMobileMenuOpen(toggle === true ? !mobileMenuOpen : false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onContinueLearning={handleContinueLearning}
        lastLesson={lastLesson}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* 5. Login / Register Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
        setActiveTab={setActiveTab}
      />

      {/* 6. Cookie & Storage Consent Banner */}
      <CookieStorageConsentBanner setActiveTab={setActiveTab} />

      {/* 7. Global Smart Command Palette Modal (Ctrl + K) */}
      <SmartCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        user={user}
        onNavigate={setActiveTab}
        onSelectLesson={handleSelectLesson}
      />

      {/* 8. Unified Ecosystem Global Overlay & Action Bar */}
      <GlobalTextSelectionActionBar />
      <LazyGlobalDrawer />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UnifiedToolsProvider>
          <MainApp />
        </UnifiedToolsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
