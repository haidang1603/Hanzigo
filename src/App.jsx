import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AdminGuard from './components/AdminGuard';
import PageLoader from './components/PageLoader';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { calculateTotalXp, awardXp, getStreakStatus } from './utils/gamification';
import { loadAllUserDataFromDb, triggerCloudSync, saveUserProgress } from './services';

// Lazy loading all page views for code-splitting and rapid initial bundle loading
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'));
const PronunciationPage = lazy(() => import('./pages/PronunciationPage'));
const WritingPage = lazy(() => import('./pages/WritingPage'));
const ConversationPage = lazy(() => import('./pages/ConversationPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const TeacherDashboardPage = lazy(() => import('./pages/TeacherDashboardPage'));
const ClassroomPage = lazy(() => import('./pages/ClassroomPage'));
const LiveClassroomPage = lazy(() => import('./pages/LiveClassroomPage'));
import TeacherGuard from './components/TeacherGuard';

const VALID_TABS = [
  'home', 'dashboard', 'roadmap', 'lesson', 'vocabulary', 
  'pronunciation', 'writing', 'conversation', 'community', 
  'materials', 'admin', 'profile', 'leaderboard',
  'teacher', 'classroom'
];

function MainApp() {
  const { user, setUser, isAdmin, isTeacher, logout } = useAuth();
  const { darkMode, setDarkMode, soundEnabled, setSoundEnabled } = useTheme();

  // Helper to parse detailed sub-routes for teacher and classroom
  const parseCurrentRoute = () => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      const parts = hash.split('/').filter(Boolean);
      const tab = parts[0] || 'home';
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
    return getStreakStatus(u).streak;
  };

  const [streak, setStreak] = useState(() => getEffectiveStreak(user));
  const [xp, setXp] = useState(() => calculateTotalXp(user));

  useEffect(() => {
    setStreak(getEffectiveStreak(user));
    setXp(calculateTotalXp(user));
  }, [activeTab, user]);

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
    setStreak(getStreakStatus(userData).streak);
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
    const newStreak = getStreakStatus(user).streak;
    setXp(newTotal);
    setStreak(newStreak);
    if (user?.uid) {
      saveUserProgress(user.uid, { xp: newTotal, streak: newStreak });
    }
  };

  // Cross-page navigation and target selection
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

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

  const handleSelectLesson = (index) => {
    setSelectedLessonIndex(index);
    setActiveTab('lesson');
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
      <Suspense fallback={<PageLoader />}>
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
    <div className="min-h-screen flex flex-col bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-[#F3F4F6] transition-colors duration-200">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        streak={streak}
        xp={xp}
        openAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* 2. Main Page Content with Suspense & Lazy Loading */}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {activeTab === 'home' && (
            <HomePage 
              user={user}
              streak={streak}
              xp={xp}
              setActiveTab={setActiveTab} 
              openAuthModal={handleOpenAuth} 
              onSelectLesson={handleSelectLesson}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage 
              user={user} 
              setActiveTab={setActiveTab} 
              onSelectLesson={handleSelectLesson}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapPage 
              user={user}
              setActiveTab={setActiveTab} 
              onSelectLesson={handleSelectLesson}
              onAddXp={handleAddXp}
            />
          )}

          {activeTab === 'lesson' && (
            <LessonPage 
              setActiveTab={setActiveTab} 
              onAddXp={handleAddXp} 
              initialLessonIndex={selectedLessonIndex}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyPage 
              setActiveTab={setActiveTab} 
              onSelectWriting={handleSelectWriting}
              onSelectPronounce={handleSelectPronounce}
            />
          )}

          {activeTab === 'pronunciation' && (
            <PronunciationPage 
              targetVocab={pronounceTarget}
              onClearTargetVocab={handleClearPronounceTarget}
            />
          )}

          {activeTab === 'writing' && (
            <WritingPage 
              targetVocab={writingTarget}
              onClearTargetVocab={handleClearWritingTarget}
            />
          )}

          {activeTab === 'conversation' && (
            <ConversationPage />
          )}

          {(activeTab === 'community' || activeTab === 'leaderboard') && (
            <CommunityPage 
              user={user} 
              setActiveTab={setActiveTab}
              initialView={activeTab === 'leaderboard' ? 'leaderboard' : 'feed'}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsPage setActiveTab={setActiveTab} />
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
                  routeInfo.sub === 'grading' ? 'grading' :
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
                  } else if (route === 'grading') {
                    window.location.hash = '#teacher/grading';
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

          {activeTab === 'profile' && (
            <ProfilePage 
              user={user} 
              onUpdateUser={setUser}
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
        </Suspense>
      </main>

      {/* 3. Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* 4. Login / Register Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
