import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/config';
import { 
  loginWithEmail as apiLoginWithEmail, 
  registerWithEmail as apiRegisterWithEmail,
  loginWithGoogle as apiLoginWithGoogle,
  logoutUser as apiLogoutUser,
  getUserProfile,
  isValidUuid
} from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...parsed,
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

      const mergedUser = {
        uid: authUser.id,
        id: authUser.id,
        email: authUser.email,
        name: dbProfile?.name || googleName || authUser.email?.split('@')[0] || 'Học viên HanziGo',
        level: dbProfile?.level || authUser.user_metadata?.level || 'HSK 1 - Sơ cấp',
        avatar: dbProfile?.avatar || googleAvatar || null,
        bio: dbProfile?.bio || '',
        role: dbProfile?.role || 'student',
        status: dbProfile?.status || 'active',
        streak: dbProfile?.streak || 1,
        xp: dbProfile?.xp || 50,
        wordsLearned: dbProfile?.words_learned || 0
      };

      setUser(mergedUser);
      localStorage.setItem('hanzigo_user', JSON.stringify(mergedUser));
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

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [syncProfile]);

  const loginWithEmail = async (email, password) => {
    const userData = await apiLoginWithEmail(email, password);
    setUser(userData);
    localStorage.setItem('hanzigo_user', JSON.stringify(userData));
    return userData;
  };

  const registerWithEmail = async (email, password, name, level) => {
    const userData = await apiRegisterWithEmail(email, password, name, level);
    setUser(userData);
    localStorage.setItem('hanzigo_user', JSON.stringify(userData));
    return userData;
  };

  const loginWithGoogle = async () => {
    return await apiLoginWithGoogle();
  };

  const logout = async () => {
    await apiLogoutUser();
    setUser(null);
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

  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin,
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
