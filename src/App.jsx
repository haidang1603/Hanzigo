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
import { supabase, isSupabaseConfigured } from './supabase/config';
import { loadAllUserDataFromDb, triggerCloudSync, saveUserProgress, logoutUser, generateUuid, isValidUuid } from './supabase/services';
import { calculateTotalXp, awardXp, getStreakStatus } from './utils/gamification';

const VALID_TABS = ['home', 'dashboard', 'roadmap', 'lesson', 'vocabulary', 'pronunciation', 'writing', 'conversation', 'community', 'materials', 'admin', 'profile'];

export default function App() {
  // Navigation active tab with localStorage & hash persistence across reloads
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (hash && VALID_TABS.includes(hash)) {
        return hash;
      }
      const savedTab = localStorage.getItem('hanzigo_active_tab');
      if (savedTab && VALID_TABS.includes(savedTab)) {
        return savedTab;
      }
      return 'home';
    } catch {
      return 'home';
    }
  });

  // Keep activeTab saved across reloads and sync to URL hash (preserving OAuth callbacks)
  useEffect(() => {
    try {
      localStorage.setItem('hanzigo_active_tab', activeTab);
      // Avoid clobbering Supabase OAuth redirect tokens in URL hash
      if (!window.location.hash.includes('access_token=') && !window.location.hash.includes('error=')) {
        window.location.hash = `#${activeTab}`;
      }
    } catch {}
  }, [activeTab]);

  // Listen to browser Back/Forward or manual URL hash changes
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

  // User auth state with local storage & custom avatar preservation
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
          const userId = parsed.uid || parsed.id || 'user_guest';
          const email = (parsed.email || '').toLowerCase().trim();
          const isMasterAdmin = email === 'lehaidang16032006@gmail.com' || email === 'admin@hanzigo.com';
          return {
            ...parsed,
            uid: userId,
            id: userId,
            role: isMasterAdmin ? 'admin' : (parsed.role || 'student'),
            avatar: parsed.avatar || customAvatar || null
          };
        }
      }
      return null;
    } catch {
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

  // Gamification state: isolated and accurately synchronized per user
  const [streak, setStreak] = useState(() => getStreakStatus(user).streak);
  const [xp, setXp] = useState(() => calculateTotalXp(user));

  // Auto-restore Supabase session on reload/startup & subscribe to auth changes
  useEffect(() => {
    let isMounted = true;

    async function syncAuthUser(authUser) {
      if (!authUser || !isMounted) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
        const googleName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.user_metadata?.display_name;
        const googleAvatar = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;
        const normalizedEmail = (authUser.email || '').toLowerCase().trim();
        const isMasterAdmin = normalizedEmail === 'lehaidang16032006@gmail.com' || normalizedEmail === 'admin@hanzigo.com';
        const userRole = isMasterAdmin ? 'admin' : (profile?.role || 'student');

        const restoredUser = {
          uid: authUser.id,
          id: authUser.id,
          name: profile?.name || googleName || authUser.email?.split('@')[0] || 'Học viên HanziGo',
          email: profile?.email || authUser.email,
          level: profile?.level || authUser.user_metadata?.level || 'HSK 1 - Sơ cấp',
          avatar: profile?.avatar || googleAvatar || customAvatar || null,
          bio: profile?.bio || localStorage.getItem('hanzigo_user_bio') || '',
          streak: profile?.streak || 1,
          xp: profile?.xp || 50,
          wordsLearned: profile?.words_learned || 0,
          role: userRole
        };

        // If master admin but profile role in DB is not admin yet, elevate it immediately
        if (isMasterAdmin && profile?.role !== 'admin' && isSupabaseConfigured && supabase) {
          try {
            await supabase.from('profiles').update({ role: 'admin' }).eq('id', authUser.id);
          } catch (e) {
            console.warn('Elevate master admin role notice:', e);
          }
        }

        // If profile was missing in DB (e.g. fresh OAuth sign-up before trigger), ensure profile exists
        if (!profile && isSupabaseConfigured && supabase) {
          try {
            await supabase.from('profiles').upsert({
              id: restoredUser.uid,
              email: restoredUser.email,
              name: restoredUser.name,
              level: restoredUser.level,
              avatar: restoredUser.avatar,
              role: restoredUser.role,
              streak: restoredUser.streak,
              xp: restoredUser.xp,
              words_learned: restoredUser.wordsLearned,
              updated_at: new Date().toISOString()
            });
          } catch (upsertErr) {
            console.warn('Auto profile upsert on OAuth notice:', upsertErr);
          }
        }

        // Clean up raw OAuth token fragment from URL hash after successful sign-in
        if (window.location.hash.includes('access_token=')) {
          const currentTab = localStorage.getItem('hanzigo_active_tab') || 'home';
          window.history.replaceState(null, '', `/#${currentTab}`);
        }

        setUser(prev => {
          const merged = {
            ...restoredUser,
            ...(prev || {}),
            avatar: prev?.avatar || restoredUser.avatar || customAvatar || null
          };
          try {
            localStorage.setItem('hanzigo_user', JSON.stringify(merged));
            if (merged.avatar) {
              localStorage.setItem('hanzigo_custom_avatar', merged.avatar);
            }
          } catch (err) {
            console.warn('Storage save notice:', err);
          }
          return merged;
        });
      } catch (err) {
        console.warn('Supabase auth profile sync notice:', err);
      }
    }

    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      // 0. Check for OAuth callback code (?code=...) in URL query
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const authError = urlParams.get('error_description') || urlParams.get('error');

        if (authError) {
          console.warn('OAuth redirect error returned from provider:', authError);
        } else if (code) {
          console.log('⚡ Detected OAuth PKCE auth code in URL, exchanging for session...');
          supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
            if (error) {
              console.warn('exchangeCodeForSession error:', error);
            } else if (data?.session?.user && isMounted) {
              console.log('✅ Google OAuth session established successfully for:', data.session.user.email);
              syncAuthUser(data.session.user);
              // Clean query string from URL while preserving path
              const cleanUrl = window.location.pathname + (window.location.hash || '');
              window.history.replaceState(null, '', cleanUrl);
              const savedTab = localStorage.getItem('hanzigo_active_tab');
              if (savedTab && VALID_TABS.includes(savedTab)) {
                setActiveTab(savedTab);
              }
            }
          }).catch(err => console.warn('PKCE exchange error:', err));
        }
      } catch (e) {
        console.warn('Error reading URL params on startup:', e);
      }

      // 1. Recover existing session immediately on startup/refresh
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && isMounted) {
          syncAuthUser(session.user);
        }
      }).catch(err => console.warn('Supabase session restore notice:', err));

      // 2. Subscribe to auth state changes (OAuth redirect callbacks, logins, token refresh)
      try {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (
            event === 'SIGNED_IN' || 
            event === 'INITIAL_SESSION' || 
            event === 'TOKEN_REFRESHED' || 
            event === 'USER_UPDATED'
          ) {
            if (session?.user && isMounted) {
              syncAuthUser(session.user);
            }
          }
        });
        subscription = data?.subscription;
      } catch (e) {
        console.warn('Supabase auth state change subscription error:', e);
      }
    }

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Sync XP and Streak on active tab change or learner action per user
  useEffect(() => {
    const currentStreak = getStreakStatus(user).streak;
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

  // Persist user and custom avatar safely without quota exceptions
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('hanzigo_user', JSON.stringify(user));
        if (user.avatar) {
          localStorage.setItem('hanzigo_custom_avatar', user.avatar);
        }
      } catch (err) {
        console.warn('Failed to save user to localStorage:', err);
      }
    }
  }, [user]);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = async (userData) => {
    const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
    const finalUser = {
      ...userData,
      uid: userData.uid || userData.id,
      id: userData.uid || userData.id,
      avatar: userData.avatar || customAvatar || null
    };

    setUser(finalUser);

    try {
      localStorage.setItem('hanzigo_user', JSON.stringify(finalUser));
      if (finalUser.avatar) {
        localStorage.setItem('hanzigo_custom_avatar', finalUser.avatar);
      }
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    // Sync all learning progress to/from Supabase DB
    if (finalUser?.uid) {
      try {
        await loadAllUserDataFromDb(finalUser.uid);
        await triggerCloudSync(finalUser.uid);
      } catch (err) {
        console.warn('DB sync error upon login:', err);
      }
    }

    const currentStreak = getStreakStatus(finalUser).streak || finalUser.streak || 0;
    const currentXp = calculateTotalXp(finalUser);
    setStreak(currentStreak);
    setXp(currentXp);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem('hanzigo_user');
    localStorage.removeItem('hanzigo_custom_avatar');
    localStorage.removeItem('hanzigo_user_bio');
    setStreak(0);
    setXp(0);
    setActiveTab('home');
  };

  const handleAddXp = (amount) => {
    const newTotal = awardXp(amount, user);
    const newStreak = getStreakStatus(user).streak;
    setXp(newTotal);
    setStreak(newStreak);
    if (user?.uid) {
      saveUserProgress(user.uid, { xp: newTotal, streak: newStreak });
    }
  };

  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Selected vocabulary for cross-page writing and pronunciation practice
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

        {activeTab === 'community' && (
          <CommunityPage user={user} />
        )}

        {activeTab === 'materials' && (
          <MaterialsPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'admin' && (
          <AdminPage 
            user={user} 
            onUpdateUser={setUser} 
            setActiveTab={setActiveTab} 
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
