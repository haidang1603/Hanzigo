import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/config';
import { 
  loginWithEmail as apiLoginWithEmail, 
  registerWithEmail as apiRegisterWithEmail,
  loginWithGoogle as apiLoginWithGoogle,
  logoutUser as apiLogoutUser,
  getUserProfile,
  isValidUuid,
  flushPendingAuditLogs,
  mergeGuestProgressIntoUser,
  syncUserJourneyProgressFromCloud,
  syncUserVocabSrsFromCloud
} from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessionVerified, setSessionVerified] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const safeXp = parsed.xp === 9999 ? 50 : (parsed.xp ?? 50);
          // ZERO TRUST: Client cache must default to 'student' until server session is verified
          return {
            ...parsed,
            role: (parsed.role === 'admin' || parsed.role === 'teacher') ? 'student' : (parsed.role || 'student'),
            xp: safeXp,
            uid: parsed.uid || parsed.id || 'user_guest',
            id: parsed.uid || parsed.id || 'user_guest'
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync profile details from Supabase `profiles` table
  const syncProfile = useCallback(async (authUser) => {
    if (!authUser || !isSupabaseConfigured || !supabase) return null;

    try {
      const dbProfile = await getUserProfile(authUser.id);
      const googleName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.user_metadata?.display_name;
      const googleAvatar = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;
      
      // If user profile is marked blocked in database, immediately sign out
      if (dbProfile?.status === 'blocked') {
        await supabase.auth.signOut().catch(() => {});
        setUser(null);
        localStorage.removeItem('hanzigo_user');
        setSessionVerified(false);
        return null;
      }

      // Authoritative role from public.profiles table
      const effectiveRole = dbProfile?.role || 'student';
      const safeXp = dbProfile?.xp !== undefined && dbProfile.xp !== 9999 ? dbProfile.xp : 50;

      const mergedUser = {
        uid: authUser.id,
        id: authUser.id,
        email: authUser.email,
        name: dbProfile?.name || googleName || authUser.email?.split('@')[0] || 'Học viên HanziGo',
        level: dbProfile?.level || authUser.user_metadata?.level || 'HSK 1 - Sơ cấp',
        avatar: dbProfile?.avatar || googleAvatar || null,
        bio: dbProfile?.bio || '',
        role: effectiveRole,
        status: dbProfile?.status || 'active',
        streak: typeof dbProfile?.streak === 'number' ? dbProfile.streak : 0,
        xp: safeXp,
        wordsLearned: dbProfile?.words_learned || 0,
        last_study_date: dbProfile?.last_study_date || null,
        longest_streak: dbProfile?.longest_streak || null
      };

      setUser(mergedUser);
      setSessionVerified(true);
      localStorage.setItem('hanzigo_user', JSON.stringify(mergedUser));

      if (typeof dbProfile?.streak === 'number' && dbProfile.streak > 0) {
        localStorage.setItem(`hanzigo_streak_count_${authUser.id}`, String(dbProfile.streak));
        localStorage.setItem('hanzigo_streak_count', String(dbProfile.streak));
      }
      if (dbProfile?.last_study_date) {
        localStorage.setItem(`hanzigo_last_study_date_${authUser.id}`, String(dbProfile.last_study_date));
        localStorage.setItem('hanzigo_last_study_date', String(dbProfile.last_study_date));
      }
      if (typeof dbProfile?.longest_streak === 'number') {
        localStorage.setItem(`hanzigo_longest_streak_${authUser.id}`, String(dbProfile.longest_streak));
      }

      // Cross-Device Progress Hydration & Guest Progress Merge
      try {
        mergeGuestProgressIntoUser(mergedUser);
        syncUserJourneyProgressFromCloud(mergedUser).catch(() => {});
        syncUserVocabSrsFromCloud(authUser.id).catch(() => {});
      } catch (syncErr) {
        console.warn('Cross-device progress hydration notice:', syncErr);
      }

      return mergedUser;
    } catch (err) {
      console.warn('AuthContext profile sync notice:', err);
      return null;
    }
  }, []);

  // Listen to Auth State and handle OAuth redirects
  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    async function initAuth() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) setLoading(false);
        return;
      }

      // Check for OAuth PKCE callback code (?code=...) in URL
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const authError = urlParams.get('error_description') || urlParams.get('error');

        if (authError) {
          console.warn('OAuth redirect error:', authError);
        } else if (code) {
          console.log('⚡ Exchanging OAuth code for session...');
          const { data } = await supabase.auth.exchangeCodeForSession(code);
          if (data?.session?.user && isMounted) {
            await syncProfile(data.session.user);
            const cleanUrl = window.location.pathname + (window.location.hash || '');
            window.history.replaceState(null, '', cleanUrl);
          }
        }
      } catch (err) {
        console.warn('OAuth code exchange notice:', err);
      }

      // Recover existing active session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          await syncProfile(session.user);
        } else if (isMounted) {
          // No active session: purge any unverified elevated role from localStorage
          setUser(prev => {
            if (!prev) return null;
            if (prev.role === 'admin' || prev.role === 'teacher') {
              const clean = { ...prev, role: 'student' };
              localStorage.setItem('hanzigo_user', JSON.stringify(clean));
              return clean;
            }
            return prev;
          });
          setSessionVerified(false);
        }
      } catch (err) {
        console.warn('Session restore notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }

      // Subscribe to live auth events (token refresh, sign in, sign out)
      try {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
            if (session?.user && isMounted) {
              await syncProfile(session.user);
            }
          } else if (event === 'SIGNED_OUT') {
            if (isMounted) {
              setUser(null);
              setSessionVerified(false);
              localStorage.removeItem('hanzigo_user');
            }
          }
        });
        subscription = data?.subscription;
      } catch (e) {
        console.warn('Auth subscription notice:', e);
      }
    }

    initAuth();

    const handleOnline = async () => {
      try {
        await flushPendingAuditLogs();
      } catch {}

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            await syncProfile(session.user);
            await syncUserJourneyProgressFromCloud(session.user);
            await syncUserVocabSrsFromCloud(session.user.id);
          }
        } catch {}
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
      }
    };
  }, [syncProfile]);

  const loginWithEmail = async (email, password, targetRole = 'student') => {
    const userData = await apiLoginWithEmail(email, password, targetRole);
    setUser(userData);
    setSessionVerified(true);
    localStorage.setItem('hanzigo_user', JSON.stringify(userData));
    return userData;
  };

  const registerWithEmail = async (email, password, name, level, role = 'student') => {
    const userData = await apiRegisterWithEmail(email, password, name, level, role);
    setUser(userData);
    setSessionVerified(true);
    localStorage.setItem('hanzigo_user', JSON.stringify(userData));
    return userData;
  };

  const loginWithGoogle = async () => {
    return await apiLoginWithGoogle();
  };

  const logout = async () => {
    await apiLogoutUser();
    setUser(null);
    setSessionVerified(false);
    localStorage.removeItem('hanzigo_user');
    localStorage.removeItem('hanzigo_custom_avatar');
    localStorage.removeItem('hanzigo_user_bio');
  };

  const updateUser = useCallback((updater) => {
    setUser(prev => {
      const nextUser = typeof updater === 'function' ? updater(prev) : updater;
      if (nextUser) {
        localStorage.setItem('hanzigo_user', JSON.stringify(nextUser));
      } else {
        localStorage.removeItem('hanzigo_user');
      }
      return nextUser;
    });
  }, []);

  // ZERO-TRUST AUTHORIZATION GATES:
  // Requires verified server session and active status. Tampered localStorage cannot grant privileges.
  const isAdmin = Boolean(
    sessionVerified &&
    user && 
    isValidUuid(user.id) &&
    user.role === 'admin' && 
    user.status === 'active'
  );

  const isTeacher = Boolean(
    sessionVerified &&
    user && 
    isValidUuid(user.id) &&
    (user.role === 'teacher' || user.role === 'admin') && 
    user.status === 'active'
  );

  const isStudent = Boolean(!isAdmin && !isTeacher);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        loading,
        sessionVerified,
        isAuthenticated: Boolean(user && sessionVerified),
        isAdmin,
        isTeacher,
        isStudent,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        syncProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
