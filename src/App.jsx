import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
import LessonPage from './pages/LessonPage';
import VocabularyPage from './pages/VocabularyPage';
import PronunciationPage from './pages/PronunciationPage';
import WritingPage from './pages/WritingPage';
import ConversationPage from './pages/ConversationPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import MaterialsPage from './pages/MaterialsPage';
import AdminPage from './pages/AdminPage';
import { loadAllUserDataFromDb, triggerCloudSync, saveUserProgress } from './firebase/services';
import { calculateTotalXp, awardXp, getStreakStatus } from './utils/gamification';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('home');

  // User auth state with local storage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only remove if it was the legacy hardcoded mock account
        if (!parsed.uid || parsed.email === 'minh.nguyen@hanzigo.vn') {
          localStorage.removeItem('hanzigo_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      localStorage.removeItem('hanzigo_user');
      return null;
    }
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('hanzigo_theme') === 'dark';
    } catch {
      return false;
    }
  });

  // Sound effects state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Gamification state: synchronized with real learner progress
  const [streak, setStreak] = useState(() => getStreakStatus().streak);
  const [xp, setXp] = useState(() => calculateTotalXp(user));

  // Sync XP and Streak on active tab change or learner action
  useEffect(() => {
    const currentStreak = getStreakStatus().streak;
    const currentXp = calculateTotalXp(user);
    setStreak(currentStreak);
    setXp(currentXp);
  }, [activeTab, user]);

  // Handle Dark mode class on body/html and persist choice
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hanzigo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hanzigo_theme', 'light');
    }
  }, [darkMode]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem('hanzigo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hanzigo_user');
    }
  }, [user]);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = async (userData) => {
    setUser(userData);

    // Sync all learning progress to/from Firestore DB
    if (userData?.uid) {
      try {
        await loadAllUserDataFromDb(userData.uid);
        await triggerCloudSync(userData.uid);
      } catch (err) {
        console.warn('DB sync error upon login:', err);
      }
    }

    const currentStreak = getStreakStatus().streak || userData.streak || 0;
    const currentXp = calculateTotalXp(userData);
    setStreak(currentStreak);
    setXp(currentXp);
  };

  const handleLogout = () => {
    setUser(null);
    setStreak(0);
    setXp(0);
    setActiveTab('home');
  };

  const handleAddXp = (amount) => {
    const newTotal = awardXp(amount);
    const newStreak = getStreakStatus().streak;
    setXp(newTotal);
    setStreak(newStreak);
    if (user?.uid) {
      saveUserProgress(user.uid, { xp: newTotal, streak: newStreak });
    }
  };

  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  const handleSelectLesson = (index) => {
    setSelectedLessonIndex(index);
    setActiveTab('lesson');
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

      {/* 2. Main Active Page Content */}
      <main className="flex-1">
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
            setActiveTab={setActiveTab} 
            onSelectLesson={handleSelectLesson}
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
          <VocabularyPage />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationPage />
        )}

        {activeTab === 'writing' && (
          <WritingPage />
        )}

        {activeTab === 'conversation' && (
          <ConversationPage />
        )}

        {activeTab === 'community' && (
          <CommunityPage user={user} />
        )}

        {activeTab === 'materials' && (
          <MaterialsPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'admin' && (
          <AdminPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'profile' && (
          <ProfilePage 
            user={user} 
            onLogout={handleLogout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        )}
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
