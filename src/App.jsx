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

const VALID_TABS = [
  'home', 'dashboard', 'roadmap', 'lesson', 'vocabulary', 
  'pronunciation', 'writing', 'conversation', 'community', 
  'materials', 'admin', 'profile', 'leaderboard'
];

function MainApp() {
  const { user, setUser, isAdmin, logout } = useAuth();
  const { darkMode, setDarkMode, soundEnabled, setSoundEnabled } = useTheme();

  // Navigation tab state with hash & localStorage sync
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (hash && VALID_TABS.includes(hash)) return hash;
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
        window.location.hash = `#${activeTab}`;
      }
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
        if (hash && VALID_TABS.includes(hash)) {
          setActiveTab(hash);
        }
      } catch {}
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Gamification state
  const [streak, setStreak] = useState(() => getStreakStatus(user).streak);
  const [xp, setXp] = useState(() => calculateTotalXp(user));

  useEffect(() => {
    setStreak(getStreakStatus(user).streak);
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
    setStreak(getStreakStatus(userData).streak || userData.streak || 0);
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
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage 
              user={user} 
              setActiveTab={setActiveTab} 
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
