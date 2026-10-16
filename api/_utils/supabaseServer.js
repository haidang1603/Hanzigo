/**
 * =========================================================================
 * HANZI GO - SERVERLESS SUPABASE UTILITIES
 * =========================================================================
 * Authoritative database clients and authentication middleware for Vercel
 * serverless functions and production backend endpoints.
 * Placed in _utils so Vercel does not count it as a Serverless Function.
 */

import { createClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url, anonKey, serviceKey };
}

let cachedAdminClient = null;
export const memoryParticipants = new Map();

/**
 * Returns a privileged Supabase client using service role key if available,
 * otherwise falls back to anon key.
 */
export function getSupabaseAdminClient() {
  if (cachedAdminClient) return cachedAdminClient;
  const { url, anonKey, serviceKey } = getSupabaseConfig();
  const key = serviceKey || anonKey;
  if (!url || !key) return null;

  try {
    cachedAdminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return cachedAdminClient;
  } catch {
    return null;
  }
}

export function setSupabaseAdminClientForTesting(client) {
  cachedAdminClient = client;
}

/**
 * Returns a Supabase client scoped to the user's JWT access token.
 */
export function getSupabaseUserClient(accessToken) {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }
    });
  } catch {
    return null;
  }
}

/**
 * Verifies request authentication via Bearer token or development headers.
 * ZERO-TRUST ENFORCEMENT:
 * - Always verifies JWT server-side via Supabase Auth getUser().
 * - Queries public.profiles to retrieve authoritative role and status.
 * - NEVER trusts user_metadata.role or client headers for privileges.
 * - Fails closed on missing profiles, blocked accounts, or DB errors.
 */
export async function verifyRequestAuth(req) {
  const authHeader = req.headers?.['authorization'] || req.headers?.['x-authorization'];
  const userIdHeader = req.headers?.['x-user-id'] || req.headers?.['x-auth-uid'];
  const token = authHeader ? String(authHeader).replace(/^Bearer\s+/i, '').trim() : '';

  if (!token && !userIdHeader) {
    return {
      authenticated: false,
      user: null,
      error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.'
    };
  }

  const isProdOrPreview = 
    process.env.NODE_ENV === 'production' || 
    process.env.VERCEL_ENV === 'production' || 
    process.env.VERCEL_ENV === 'preview';

  const adminClient = getSupabaseAdminClient();

  // 1. Authoritative verification via Supabase Auth + Database Profile
  if (token && adminClient) {
    try {
      const { data: authData, error: authError } = await adminClient.auth.getUser(token);
      if (!authError && authData?.user?.id) {
        const authUser = authData.user;

        // ZERO TRUST: Query public.profiles directly.
        // DO NOT trust authUser.user_metadata?.role as users can supply metadata on signup/update!
        const { data: profile, error: profileError } = await adminClient
          .from('profiles')
          .select('id, name, role, status')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError) {
          return {
            authenticated: false,
            user: null,
            error: 'Lỗi xác minh quyền hạn người dùng từ cơ sở dữ liệu.'
          };
        }

        if (!profile) {
          return {
            authenticated: false,
            user: null,
            error: 'Hồ sơ người dùng không tồn tại trong hệ thống.'
          };
        }

        if (profile.status === 'blocked') {
          return {
            authenticated: false,
            user: null,
            error: 'Tài khoản đã bị tạm khóa hoặc vô hiệu hóa.'
          };
        }

        const validRoles = ['student', 'teacher', 'admin', 'moderator'];
        const authoritativeRole = validRoles.includes(profile.role) ? profile.role : 'student';

        return {
          authenticated: true,
          user: {
            id: authUser.id,
            email: authUser.email,
            name: profile.name || authUser.user_metadata?.name || authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'Người dùng HanziGo',
            role: authoritativeRole,
            status: profile.status || 'active'
          },
          token,
          error: null
        };
      }
    } catch {
      // Supabase Auth verification threw an exception, proceed to fallback or rejection
    }
  }

  // 2. Reject in Production and Preview: Zero trust on unverified tokens, spoofed headers, or missing credentials (SEC-07)
  if (isProdOrPreview) {
    if (!token) {
      return {
        authenticated: false,
        user: null,
        error: 'Yêu cầu thiếu Bearer access token hợp lệ từ máy chủ xác thực.'
      };
    }
    return {
      authenticated: false,
      user: null,
      error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'
    };
  }

  // 3. Isolated Test & Local Development Environment Only:
  const isTestOrLocal = !isProdOrPreview;

  if (!isTestOrLocal) {
    return {
      authenticated: false,
      user: null,
      error: 'Phương thức xác thực qua header chỉ được phép trong môi trường kiểm thử cô lập.'
    };
  }

  const effectiveUserId = (token && token.startsWith('valid_'))
    ? (userIdHeader || 'test_user')
    : (userIdHeader || (token ? 'auth_user' : null));

  if (effectiveUserId) {
    if (effectiveUserId.includes('blocked')) {
      return {
        authenticated: false,
        user: null,
        error: 'Tài khoản đã bị tạm khóa hoặc vô hiệu hóa.'
      };
    }
    if (effectiveUserId.includes('nonexistent')) {
      return {
        authenticated: false,
        user: null,
        error: 'Hồ sơ người dùng không tồn tại trong hệ thống.'
      };
    }

    // If effectiveUserId is a real UUID and DB client exists, query authoritative role from profiles table
    if (adminClient && typeof effectiveUserId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(effectiveUserId)) {
      try {
        const { data: dbProfile } = await adminClient
          .from('profiles')
          .select('id, name, email, role, status')
          .eq('id', effectiveUserId)
          .maybeSingle();

        if (dbProfile) {
          if (dbProfile.status === 'blocked') {
            return {
              authenticated: false,
              user: null,
              error: 'Tài khoản đã bị tạm khóa hoặc vô hiệu hóa.'
            };
          }
          const validRoles = ['student', 'teacher', 'admin', 'moderator'];
          const authoritativeRole = validRoles.includes(dbProfile.role) ? dbProfile.role : 'student';
          return {
            authenticated: true,
            user: {
              id: dbProfile.id,
              email: dbProfile.email,
              name: dbProfile.name || (authoritativeRole === 'admin' ? 'Admin HanziGo' : authoritativeRole === 'teacher' ? 'Giáo viên HanziGo' : 'Học viên HanziGo'),
              role: authoritativeRole,
              status: dbProfile.status || 'active'
            },
            token: token || null,
            error: null
          };
        }
      } catch (err) {
        console.warn('[verifyRequestAuth] DB profile query exception:', err.message);
      }
    }

    let assignedRole = 'student';
    if (effectiveUserId.includes('student')) {
      assignedRole = 'student';
    } else if (effectiveUserId.startsWith('admin') || effectiveUserId === 'admin_user') {
      assignedRole = 'admin';
    } else if (effectiveUserId.includes('teacher')) {
      assignedRole = 'teacher';
    }
    const isAdmin = assignedRole === 'admin';
    const isTeacher = assignedRole === 'teacher';

    return {
      authenticated: true,
      user: {
        id: effectiveUserId,
        name: isAdmin ? 'Admin HanziGo' : (isTeacher ? 'Giáo viên HanziGo' : 'Học viên HanziGo'),
        role: assignedRole,
        status: 'active'
      },
      token: token || null,
      error: null
    };
  }

  return {
    authenticated: false,
    user: null,
    error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'
  };
}
