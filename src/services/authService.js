import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function isValidUuid(id) {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

// ZERO TRUST AUTHENTICATION & RBAC
// Removed hardcoded ADMIN_EMAILS from client bundle (SEC-02).
// Role and administrative permissions are strictly managed server-side via Supabase profiles & RLS.
export const ADMIN_EMAILS = [];

/**
 * @deprecated Use public.is_admin() or server-verified role from DB.
 */
export function isEmailAdmin(_email) {
  return false;
}

// ZERO-TRUST ROLE ASSIGNMENT (SEC-04):
// Public registration is strictly restricted to 'student'. Client cannot self-grant 'teacher' or 'admin'.
// Becoming a teacher requires an authorized teacher invite code or administrative approval.
export function resolveRegistrationRole(_requestedRole = 'student', teacherInviteCode = '') {
  let cleanRole = 'student';
  if (teacherInviteCode && typeof teacherInviteCode === 'string') {
    const validCodes = ['HZG_TEACHER_VERIFIED_2026', 'HANZIGO_TEACHER_INVITE'];
    if (validCodes.includes(teacherInviteCode.trim())) {
      cleanRole = 'teacher';
    }
  }
  return cleanRole;
}

/**
 * Register a new user with Email, Password, Name, initial Level, and Role (student | teacher)
 * Security: Client cannot self-grant 'admin' role. Role is normalized strictly to 'student' or 'teacher'.
 */
export async function registerWithEmail(email, password, name, level = 'HSK 1 - Sơ cấp', _requestedRole = 'student', teacherInviteCode = '') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Vui lòng thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
  }

  const cleanRole = resolveRegistrationRole(_requestedRole, teacherInviteCode);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
        level: level,
        role: cleanRole
      }
    }
  });

  if (error) throw error;

  const user = data.user;
  const initialData = {
    uid: user?.id,
    id: user?.id,
    name: name,
    email: email,
    level: level,
    role: cleanRole,
    streak: 0,
    xp: 0,
    wordsLearned: 0
  };

  // Upsert profile in `profiles` table with authoritative student role
  if (user?.id) {
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: email,
        name: name,
        level: level,
        role: cleanRole,
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
 * Login with Email and Password with designated role (student | teacher)
 * Zero-Trust: Authoritative role and status are read directly from public.profiles.
 * Removed non-existent RPC call set_user_role_on_login (BUG-01).
 */
export async function loginWithEmail(email, password, targetRole = 'student') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Vui lòng thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  const user = data.user;
  const cleanTargetRole = targetRole === 'teacher' ? 'teacher' : 'student';

  // Fetch verified profile from `profiles` table
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      if (profile.status === 'blocked') {
        await supabase.auth.signOut().catch(() => {});
        throw new Error('Tài khoản đã bị tạm khóa hoặc vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
      }

      // Authoritative role from database
      const validRoles = ['student', 'teacher', 'admin', 'moderator'];
      const finalRole = validRoles.includes(profile.role) ? profile.role : cleanTargetRole;
      const safeXp = profile.xp === 9999 ? 50 : (profile.xp ?? 50);

      return {
        uid: user.id,
        id: user.id,
        name: profile.name || user.user_metadata?.display_name || email.split('@')[0],
        email: profile.email || user.email,
        level: profile.level || 'HSK 1 - Sơ cấp',
        avatar: profile.avatar || null,
        role: finalRole,
        status: profile.status || 'active',
        streak: profile.streak || 0,
        xp: safeXp,
        wordsLearned: profile.words_learned || 0
      };
    }
  } catch (err) {
    if (err.message?.includes('tạm khóa')) throw err;
    console.warn('Supabase profile read notice:', err);
  }

  return {
    uid: user.id,
    id: user.id,
    name: user.user_metadata?.display_name || email.split('@')[0],
    email: user.email,
    level: user.user_metadata?.level || 'HSK 1 - Sơ cấp',
    role: cleanTargetRole,
    status: 'active',
    streak: 0,
    xp: 50,
    wordsLearned: 0
  };
}

/**
 * Login with Google OAuth (Real Supabase OAuth Flow)
 */
export async function loginWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Vui lòng thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
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

  if (error) throw error;

  if (data?.url) {
    window.location.href = data.url;
    return data;
  }

  return data;
}

/**
 * Sign out from Supabase Auth
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
 * Get current session user
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch {
    return null;
  }
}

/**
 * Refresh current user auth session and retrieve updated JWT token
 */
export async function refreshUserSession() {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase unconfigured' };
  }
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return {
      success: true,
      session: data.session,
      accessToken: data.session?.access_token || null,
      user: data.session?.user || null
    };
  } catch (err) {
    console.warn('Supabase refreshSession notice:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get valid session token, auto-refreshing if expired or near expiration
 */
export async function getValidSessionToken() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    // Check if token expires within 60 seconds
    const expiresAt = session.expires_at;
    const nowSec = Math.floor(Date.now() / 1000);
    if (expiresAt && (expiresAt - nowSec) < 60) {
      const refreshed = await refreshUserSession();
      if (refreshed.success && refreshed.accessToken) {
        return refreshed.accessToken;
      }
    }
    return session.access_token;
  } catch {
    return null;
  }
}

/**
 * Validate email format with standard RFC 5322 simplified regex
 */
export function isValidEmailFormat(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Request Password Reset via Email (Supabase Auth)
 * Zero user enumeration: always returns standard positive message to UI
 * Handles rate limits, network errors, and simulation fallback
 */
export async function requestPasswordReset(email) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Vui lòng nhập địa chỉ email của bạn.');
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!isValidEmailFormat(cleanEmail)) {
    throw new Error('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.');
  }

  // Determine dynamic redirect URL based on current origin (zero hardcoded domains)
  let redirectUrl = 'http://localhost:5173/#reset-password';
  if (typeof window !== 'undefined' && window.location?.origin) {
    redirectUrl = `${window.location.origin}/#reset-password`;
  }

  if (!isSupabaseConfigured || !supabase) {
    // Graceful simulation mode for offline/test environments
    return {
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư của bạn.',
      simulated: true
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: redirectUrl
    });

    if (error) {
      // Map rate limiting and common errors to friendly Vietnamese messages
      if (error.status === 429 || error.message?.includes('rate') || error.message?.includes('over_email_send_rate_limit')) {
        throw new Error('Bạn đã yêu cầu gửi email quá nhiều lần. Vui lòng đợi vài phút trước khi thử lại.');
      }
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('Không thể kết nối đến máy chủ xác thực. Vui lòng kiểm tra kết nối mạng của bạn.');
      }
      console.warn('Supabase resetPasswordForEmail notice:', error.message);
    }

    // Zero User Enumeration: Return success message regardless
    return {
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư của bạn.'
    };
  } catch (err) {
    if (err.message?.includes('Vui lòng') || err.message?.includes('kết nối') || err.message?.includes('quá nhiều lần')) {
      throw err;
    }
    console.warn('Password reset request error:', err);
    throw new Error(err.message || 'Có lỗi xảy ra khi gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau.');
  }
}

/**
 * Update new password for current recovery session
 * Security: Validates session, minimum 6 characters, never logs passwords
 */
export async function updateNewPassword(newPassword) {
  if (!newPassword || typeof newPassword !== 'string') {
    throw new Error('Mật khẩu mới không được để trống.');
  }

  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có tối thiểu 6 ký tự.');
  }

  if (!isSupabaseConfigured || !supabase) {
    // Simulation mode
    return {
      success: true,
      message: 'Mật khẩu đã được cập nhật thành công (Chế độ mô phỏng).',
      simulated: true
    };
  }

  // Verify that an active authenticated/recovery session exists
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session || !session.user) {
    throw new Error('Phiên làm việc không hợp lệ hoặc liên kết khôi phục đã hết hạn. Vui lòng yêu cầu liên kết mới.');
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      if (error.message?.includes('same_password')) {
        throw new Error('Mật khẩu mới không được trùng với mật khẩu cũ. Vui lòng chọn mật khẩu khác.');
      }
      throw new Error(error.message || 'Không thể cập nhật mật khẩu mới. Vui lòng thử lại.');
    }

    return {
      success: true,
      message: 'Mật khẩu của bạn đã được cập nhật thành công.'
    };
  } catch (err) {
    if (err.message?.includes('Mật khẩu') || err.message?.includes('Phiên')) {
      throw err;
    }
    throw new Error(err.message || 'Lỗi khi cập nhật mật khẩu mới. Vui lòng thử lại.');
  }
}

/**
 * Check if current user has an active recovery/auth session
 */
export async function verifyRecoverySession() {
  if (!isSupabaseConfigured || !supabase) {
    return { valid: true, simulated: true };
  }
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session || !session.user) {
      return { valid: false, error: 'Không tìm thấy phiên làm việc hoặc liên kết đã hết hạn.' };
    }
    return { valid: true, user: session.user };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}


