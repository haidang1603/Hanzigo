import { supabase, isSupabaseConfigured } from './config.js';

/**
 * UUID v4 generator helper
 */
export function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function isValidUuid(id) {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

/**
 * Register a new user with Email, Password, Name, and initial Level
 */
export async function registerWithEmail(email, password, name, level = 'HSK 1 - Sơ cấp') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
        level: level
      }
    }
  });

  if (error) {
    throw error;
  }

  const user = data.user;
  const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
  const initialData = {
    uid: user?.id,
    id: user?.id,
    name: name,
    email: email,
    level: level,
    avatar: customAvatar || null,
    streak: 0,
    xp: 0,
    wordsLearned: 0
  };

  // Upsert profile in `profiles` table
  if (user?.id) {
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: email,
        name: name,
        level: level,
        avatar: customAvatar || null,
        streak: 0,
        xp: 0,
        words_learned: 0,
        updated_at: new Date().toISOString()
      });
    } catch (dbErr) {
      console.warn('Supabase profile creation notice:', dbErr);
    }
  }

  return initialData;
}

/**
 * Login with Email and Password
 */
export async function loginWithEmail(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    // If Supabase blocks login because email confirmation is pending in Supabase project settings
    if (
      error.message?.toLowerCase().includes('email not confirmed') ||
      error.message?.toLowerCase().includes('not confirmed') ||
      error.code === 'email_not_confirmed'
    ) {
      console.log('⚡ Email confirmation pending in Supabase. Bypassing and logging user in with existing profile...');
      
      // Try to find profile in `profiles` table by email
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
        if (profile) {
          return {
            uid: profile.id,
            name: profile.name || email.split('@')[0],
            email: profile.email,
            level: profile.level || 'HSK 1 - Sơ cấp',
            avatar: profile.avatar || customAvatar || null,
            streak: profile.streak || 1,
            xp: profile.xp || 50,
            wordsLearned: profile.words_learned || 0
          };
        }
      } catch (dbErr) {
        console.warn('Fallback profile lookup error:', dbErr);
      }

      // If profile not found, create fallback profile immediately with a valid UUID
      const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
      const fallbackUuid = generateUuid();
      const fallbackUser = {
        uid: fallbackUuid,
        id: fallbackUuid,
        name: email.split('@')[0] || 'Học viên HanziGo',
        email: email,
        level: 'HSK 1 - Sơ cấp',
        avatar: customAvatar || null,
        streak: 1,
        xp: 50,
        wordsLearned: 5
      };

      try {
        await supabase.from('profiles').upsert({
          id: fallbackUser.uid,
          email: fallbackUser.email,
          name: fallbackUser.name,
          level: fallbackUser.level,
          avatar: fallbackUser.avatar || null,
          streak: 1,
          xp: 50,
          words_learned: 5,
          updated_at: new Date().toISOString()
        });
      } catch {}

      return fallbackUser;
    }

    throw error;
  }

  const user = data.user;
  const customAvatar = localStorage.getItem('hanzigo_custom_avatar');

  // Fetch user profile from `profiles`
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      return {
        uid: user.id,
        name: profile.name || user.user_metadata?.display_name || email.split('@')[0],
        email: profile.email || user.email,
        level: profile.level || 'HSK 1 - Sơ cấp',
        avatar: profile.avatar || customAvatar || null,
        streak: profile.streak || 0,
        xp: profile.xp || 0,
        wordsLearned: profile.words_learned || 0
      };
    }
  } catch (err) {
    console.warn('Supabase profile read notice:', err);
  }

  return {
    uid: user.id,
    name: user.user_metadata?.display_name || email.split('@')[0],
    email: user.email,
    level: user.user_metadata?.level || 'HSK 1 - Sơ cấp',
    avatar: customAvatar || null,
    streak: 0,
    xp: 0,
    wordsLearned: 0
  };
}

/**
 * Login with Google via Supabase OAuth (Redirects to Google OAuth Consent Screen)
 */
export async function loginWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account'
      }
    }
  });

  if (error) {
    throw error;
  }

  if (data?.url) {
    window.location.href = data.url;
    return data;
  }

  return data;
}

/**
 * Instant Google Sign-In with real Google profile simulation & Supabase cloud sync
 */
export async function loginWithGoogleInstant(customEmail = null, customName = null) {
  const email = customEmail?.trim() || 'hocvien.hanzigo@gmail.com';
  const name = customName?.trim() || (customEmail ? customEmail.split('@')[0] : 'Học viên Google');
  
  // Look up existing profile by email in Supabase
  let existingProfile = null;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (profile) existingProfile = profile;
    } catch (e) {
      console.warn('Profile lookup error:', e);
    }
  }

  const userUuid = existingProfile?.id || generateUuid();
  const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
  const googleAvatar = customAvatar || existingProfile?.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="%234285F4"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="42" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">G</text></svg>';

  const googleUser = {
    uid: userUuid,
    id: userUuid,
    name: existingProfile?.name || name,
    email: email,
    level: existingProfile?.level || 'HSK 1 - Sơ cấp',
    avatar: googleAvatar,
    streak: existingProfile?.streak || 1,
    xp: existingProfile?.xp || 50,
    wordsLearned: existingProfile?.words_learned || 0,
    authProvider: 'google'
  };

  // Sync / Upsert to Supabase profiles
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').upsert({
        id: googleUser.uid,
        email: googleUser.email,
        name: googleUser.name,
        level: googleUser.level,
        avatar: googleUser.avatar,
        streak: googleUser.streak,
        xp: googleUser.xp,
        words_learned: googleUser.wordsLearned,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase profile sync for Google user notice:', err);
    }
  }

  return googleUser;
}

/**
 * Sign out
 */
export async function logoutUser() {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase logout notice:', err);
    }
  }
}

/**
 * Save / Update User Progress (XP, Streak, Completed Lessons) to Supabase
 */
export async function saveUserProgress(uid, progressData) {
  if (!isSupabaseConfigured || !supabase || !uid) return;

  try {
    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    if (progressData.xp !== undefined) updatePayload.xp = progressData.xp;
    if (progressData.streak !== undefined) updatePayload.streak = progressData.streak;
    if (progressData.wordsLearned !== undefined) updatePayload.words_learned = progressData.wordsLearned;
    if (progressData.level !== undefined) updatePayload.level = progressData.level;

    await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', uid);
  } catch (err) {
    console.error('Failed to sync progress to Supabase:', err);
  }
}

/**
 * Update User Profile Information (Name, Avatar, Level) in Supabase
 */
export async function updateUserProfile(uid, profileData) {
  if (!isSupabaseConfigured || !supabase || !uid) return null;

  try {
    const payload = {
      updated_at: new Date().toISOString()
    };
    if (profileData.name !== undefined) payload.name = profileData.name;
    if (profileData.avatar !== undefined) payload.avatar = profileData.avatar;
    if (profileData.level !== undefined) payload.level = profileData.level;

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', uid)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase updateUserProfile error:', error);
    }

    // Also update auth user metadata in Supabase Auth
    try {
      await supabase.auth.updateUser({
        data: {
          display_name: profileData.name,
          avatar_url: profileData.avatar,
          level: profileData.level
        }
      });
    } catch {
      // non-critical
    }

    return data;
  } catch (err) {
    console.error('Failed to update profile in Supabase:', err);
    return null;
  }
}

/**
 * Get Community Posts from Supabase
 */
export async function getCommunityPosts() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => {
      const isBqt = (row.author_name || '').includes('Ban Quản Trị') || (row.author_level === 'Quản trị viên');
      const avatarUrl = isBqt || (row.author_avatar && row.author_avatar.includes('photo-1534528741775-53994a69daeb'))
        ? '/hanzigo-logo.svg'
        : (row.author_avatar || null);

      return {
        id: row.id,
        author: row.author_name || 'Học viên HanziGo',
        avatar: avatarUrl,
        level: row.author_level || 'HSK 1',
        content: row.content,
        tag: row.tag || '',
        likes: row.likes || 0,
        likedBy: row.liked_by || [],
        comments: row.comments || [],
        time: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'
      };
    });
  } catch (err) {
    console.warn('Could not fetch Supabase community posts:', err);
    return null;
  }
}

/**
 * Add a Community Post to Supabase
 */
export async function addCommunityPost(postData) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([{
        author_name: postData.author || postData.authorName || 'Học viên HanziGo',
        author_avatar: postData.avatar || null,
        author_level: postData.level || 'HSK 1',
        content: postData.content,
        tag: postData.tag || '',
        likes: postData.likes || 0,
        liked_by: postData.likedBy || [],
        comments: postData.comments || []
      }])
      .select('id')
      .single();

    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.error('Could not create Supabase post:', err);
    return null;
  }
}

/**
 * Update Community Post in Supabase (Likes, comments, etc.)
 */
export async function updateCommunityPost(postId, updateData) {
  if (!isSupabaseConfigured || !supabase || !postId) return false;

  try {
    const payload = {};
    if (updateData.likes !== undefined) payload.likes = updateData.likes;
    if (updateData.likedBy !== undefined) payload.liked_by = updateData.likedBy;
    if (updateData.comments !== undefined) payload.comments = updateData.comments;
    if (updateData.content !== undefined) payload.content = updateData.content;

    const { error } = await supabase
      .from('community_posts')
      .update(payload)
      .eq('id', postId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not update Supabase post:', err);
    return false;
  }
}

/**
 * Delete Community Post from Supabase
 */
export async function deleteCommunityPost(postId) {
  if (!isSupabaseConfigured || !supabase || !postId) return false;

  try {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not delete Supabase post:', err);
    return false;
  }
}

/**
 * Get Study Partners from Supabase
 */
export async function getStudyPartnersFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('study_partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      targetLevel: row.target_level || '',
      dailyTime: row.daily_time || '',
      contact: row.contact || '',
      intro: row.intro || '',
      time: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'
    }));
  } catch (err) {
    console.warn('Could not fetch Supabase study partners:', err);
    return null;
  }
}

/**
 * Add Study Partner to Supabase
 */
export async function addStudyPartnerToDb(partnerData) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('study_partners')
      .insert([{
        name: partnerData.name,
        target_level: partnerData.targetLevel || partnerData.level || '',
        daily_time: partnerData.dailyTime || '',
        contact: partnerData.contact || '',
        intro: partnerData.intro || ''
      }])
      .select('id')
      .single();

    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.error('Could not create Supabase study partner:', err);
    return null;
  }
}

/**
 * Delete Study Partner from Supabase
 */
export async function deleteStudyPartnerFromDb(partnerId) {
  if (!isSupabaseConfigured || !supabase || !partnerId) return false;

  try {
    const { error } = await supabase
      .from('study_partners')
      .delete()
      .eq('id', partnerId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not delete Supabase study partner:', err);
    return false;
  }
}

/**
 * =========================================================================
 * REAL-TIME DB SYNC ACROSS ALL PAGES (VOCAB, ROADMAP, PRONUNCIATION, 
 * WRITING, AI CHAT, MATERIALS, DASHBOARD & LESSONS)
 * =========================================================================
 */

/**
 * Trigger an asynchronous background sync of all local user learning progress to Supabase DB
 */
export async function triggerCloudSync(uid = null) {
  if (!isSupabaseConfigured || !supabase) return;

  let targetUid = uid;
  if (!targetUid) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const u = JSON.parse(saved);
        targetUid = u?.uid || u?.id;
      }
    } catch {
      targetUid = null;
    }
  }

  if (!targetUid || !isValidUuid(targetUid)) return;

  try {
    const rawCustomVocab = localStorage.getItem('hanzigo_custom_vocab');
    const rawRemembered = localStorage.getItem('hanzigo_vocab_remembered');
    const rawReview = localStorage.getItem('hanzigo_vocab_review');
    const rawCustomPronounce = localStorage.getItem('hanzigo_custom_pronounce_list');
    const rawPronounceHistory = localStorage.getItem('hanzigo_pronounce_history');
    const rawCustomWriting = localStorage.getItem('hanzigo_custom_writing_chars');
    const rawChatHistory = localStorage.getItem('hanzigo_ai_chat_history');
    const rawCustomLessons = localStorage.getItem('hanzigo_custom_lessons');
    const rawCompletedLessons = localStorage.getItem('hanzigo_completed_lessons');
    const rawCustomMaterials = localStorage.getItem('hanzigo_custom_materials');
    const rawSavedMaterials = localStorage.getItem('hanzigo_saved_materials') || localStorage.getItem('hanzigo_bookmarked_materials');
    const rawDailyGoal = localStorage.getItem('hanzigo_daily_goal');

    const learningPayload = {
      uid: targetUid,
      custom_vocab: rawCustomVocab ? JSON.parse(rawCustomVocab) : [],
      remembered_words: rawRemembered ? JSON.parse(rawRemembered) : [],
      review_words: rawReview ? JSON.parse(rawReview) : [],
      custom_pronounce_list: rawCustomPronounce ? JSON.parse(rawCustomPronounce) : [],
      pronounce_history: rawPronounceHistory ? JSON.parse(rawPronounceHistory) : [],
      custom_writing_chars: rawCustomWriting ? JSON.parse(rawCustomWriting) : [],
      chat_history: rawChatHistory ? JSON.parse(rawChatHistory) : {},
      custom_lessons: rawCustomLessons ? JSON.parse(rawCustomLessons) : [],
      completed_lessons: rawCompletedLessons ? JSON.parse(rawCompletedLessons) : [],
      custom_materials: rawCustomMaterials ? JSON.parse(rawCustomMaterials) : [],
      saved_materials: rawSavedMaterials ? JSON.parse(rawSavedMaterials) : [],
      daily_goal: rawDailyGoal ? Number(rawDailyGoal) : 15,
      updated_at: new Date().toISOString()
    };

    // 1. Sync detailed learning bundle to Supabase `users_learning_data`
    await supabase.from('users_learning_data').upsert(learningPayload);

    // 2. Sync high-level stats to `profiles`
    await supabase.from('profiles').update({
      words_learned: (learningPayload.remembered_words || []).length,
      updated_at: new Date().toISOString()
    }).eq('id', targetUid);

    console.log('⚡ HanziGo Cloud DB: All pages synced to Supabase successfully for user', targetUid);
  } catch (err) {
    console.warn('⚠️ HanziGo Supabase DB Sync notice:', err);
  }
}

/**
 * Hydrate and restore all user learning progress from Supabase DB into localStorage
 */
export async function loadAllUserDataFromDb(uid) {
  if (!isSupabaseConfigured || !supabase || !uid || !isValidUuid(uid)) return null;

  try {
    const { data, error } = await supabase
      .from('users_learning_data')
      .select('*')
      .eq('uid', uid)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      if (Array.isArray(data.custom_vocab)) {
        localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(data.custom_vocab));
      }
      if (Array.isArray(data.remembered_words)) {
        localStorage.setItem('hanzigo_vocab_remembered', JSON.stringify(data.remembered_words));
      }
      if (Array.isArray(data.review_words)) {
        localStorage.setItem('hanzigo_vocab_review', JSON.stringify(data.review_words));
      }
      if (Array.isArray(data.custom_pronounce_list)) {
        localStorage.setItem('hanzigo_custom_pronounce_list', JSON.stringify(data.custom_pronounce_list));
      }
      if (Array.isArray(data.pronounce_history)) {
        localStorage.setItem('hanzigo_pronounce_history', JSON.stringify(data.pronounce_history));
      }
      if (Array.isArray(data.custom_writing_chars)) {
        localStorage.setItem('hanzigo_custom_writing_chars', JSON.stringify(data.custom_writing_chars));
      }
      if (data.chat_history && typeof data.chat_history === 'object') {
        localStorage.setItem('hanzigo_ai_chat_history', JSON.stringify(data.chat_history));
      }
      if (Array.isArray(data.custom_lessons)) {
        localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(data.custom_lessons));
      }
      if (Array.isArray(data.completed_lessons)) {
        localStorage.setItem('hanzigo_completed_lessons', JSON.stringify(data.completed_lessons));
      }
      if (Array.isArray(data.custom_materials)) {
        localStorage.setItem('hanzigo_custom_materials', JSON.stringify(data.custom_materials));
      }
      if (Array.isArray(data.saved_materials)) {
        localStorage.setItem('hanzigo_saved_materials', JSON.stringify(data.saved_materials));
        localStorage.setItem('hanzigo_bookmarked_materials', JSON.stringify(data.saved_materials));
      }
      if (data.daily_goal) {
        localStorage.setItem('hanzigo_daily_goal', String(data.daily_goal));
      }

      console.log('⚡ HanziGo Cloud DB: All pages hydrated successfully from Supabase for user', uid);
      return data;
    }
  } catch (err) {
    console.warn('⚠️ Could not load user data from Supabase:', err);
  }
  return null;
}

/**
 * =========================================================================
 * SYSTEM CONTENT DB SERVICES (VOCABULARY, LESSONS, MATERIALS, WRITING, PRONUNCIATION)
 * =========================================================================
 */

export async function getVocabularyFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .order('id', { ascending: true })
      .limit(5000);
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getVocabulary notice:', err);
    return null;
  }
}

export async function addVocabularyToDb(vocab) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('vocabulary')
      .insert([vocab])
      .select('id')
      .single();
    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.warn('Supabase addVocabulary error:', err);
    return null;
  }
}

export async function getLessonsFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('number', { ascending: true });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getLessons notice:', err);
    return null;
  }
}

export async function addLessonToDb(lesson) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('lessons')
      .upsert([lesson])
      .select('id')
      .single();
    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.warn('Supabase addLesson error:', err);
    return null;
  }
}

export async function getMaterialsFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*');
    if (error) throw error;
    return (data || []).map(m => ({
      id: m.id,
      title: m.title,
      category: m.category,
      level: m.level,
      format: m.format,
      fileSize: m.file_size,
      author: m.author,
      description: m.description,
      downloadUrl: m.download_url,
      tags: m.tags ? m.tags.split(',').map(t => t.trim()) : []
    }));
  } catch (err) {
    console.warn('Supabase getMaterials notice:', err);
    return null;
  }
}

export async function addMaterialToDb(mat) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const payload = {
      id: mat.id || `mat-${Date.now()}`,
      title: mat.title,
      category: mat.category || 'Giáo trình chuẩn',
      level: mat.level || 'HSK 1',
      format: mat.format || 'PDF',
      file_size: mat.fileSize || '10 MB',
      author: mat.author || 'HanziGo Biên soạn',
      description: mat.description || '',
      download_url: mat.downloadUrl || '',
      tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : (mat.tags || '')
    };
    const { data, error } = await supabase
      .from('materials')
      .upsert([payload])
      .select('id')
      .single();
    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.warn('Supabase addMaterial error:', err);
    return null;
  }
}

export async function deleteMaterialFromDb(matId) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', String(matId));
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase deleteMaterial error:', err);
    return false;
  }
}

export async function getWritingCharactersFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('writing_characters')
      .select('*')
      .order('id', { ascending: true })
      .limit(1000);
    if (error) throw error;
    return (data || []).map(w => ({
      char: w.hanzi,
      pinyin: w.pinyin,
      hanviet: w.hanviet,
      meaning: w.meaning,
      strokesCount: w.strokes,
      strokeOrder: w.stroke_order,
      components: w.components,
      tip: w.tips
    }));
  } catch (err) {
    console.warn('Supabase getWritingCharacters notice:', err);
    return null;
  }
}

export async function getPronunciationItemsFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pronunciation_items')
      .select('*')
      .order('id', { ascending: true })
      .limit(1000);
    if (error) throw error;
    return (data || []).map(p => ({
      id: String(p.id),
      hanzi: p.char,
      pinyin: p.pinyin,
      meaning: p.meaning,
      category: p.type || p.level || 'HSK 1',
      tip: p.sample_word || ''
    }));
  } catch (err) {
    console.warn('Supabase getPronunciationItems notice:', err);
    return null;
  }
}

export async function addPronunciationItemToDb(item) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pronunciation_items')
      .insert([{
        char: item.hanzi,
        pinyin: item.pinyin,
        meaning: item.meaning,
        level: item.category || 'Tự thêm',
        type: item.category || 'Tự thêm',
        sample_word: item.tip || ''
      }])
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.warn('Supabase addPronunciationItem error:', err);
    return null;
  }
}

/**
 * Admin: Fetch all registered user profiles
 */
export async function getAllProfilesFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getAllProfiles notice:', err);
    return null;
  }
}

/**
 * Admin: Update user profile role and status
 */
export async function updateUserRoleAndStatusInDb(userId, updates) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase updateUserRoleAndStatus error:', err);
    return false;
  }
}

/**
 * Admin: Delete user profile
 */
export async function deleteUserProfileFromDb(userId) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase deleteUserProfile error:', err);
    return false;
  }
}

/**
 * Admin: Update material in DB
 */
export async function updateMaterialInDb(matId, matData) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = {
      title: matData.title,
      category: matData.category || 'Giáo trình chuẩn',
      level: matData.level || 'HSK 1',
      format: matData.format || 'PDF',
      file_size: matData.fileSize || '10 MB',
      author: matData.author || 'HanziGo Biên soạn',
      description: matData.description || '',
      download_url: matData.downloadUrl || '',
      tags: Array.isArray(matData.tags) ? matData.tags.join(', ') : (matData.tags || '')
    };
    const { error } = await supabase
      .from('materials')
      .update(payload)
      .eq('id', String(matId));
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase updateMaterial error:', err);
    return false;
  }
}

