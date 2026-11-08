/**
 * =========================================================================
 * HANZI GO - ADMIN CREATE USER HANDLER
 * =========================================================================
 * Authoritative Serverless API:
 * Creates new user in Supabase auth.users and synchronizes public.profiles.
 * 
 * ZERO-TRUST SECURITY ENFORCEMENT:
 * 1. Must be authenticated via Bearer token verified server-side.
 * 2. Caller's role must be 'admin' verified against public.profiles (never client header).
 * 3. Caller's status must be 'active'.
 * 4. Only 'student' or 'teacher' roles can be created through this API.
 *    (Disallows creating 'admin' to prevent privilege escalation via web form).
 * 5. Uses SUPABASE_SERVICE_ROLE_KEY exclusively on server side.
 *    (Never exposes Service Role Key to frontend).
 */

import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

export default async function createUserHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  // 1. Authoritative caller authentication & role verification
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated || !auth.user) {
    return res.status(401).json({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập với tài khoản Quản trị viên.' });
  }

  // Zero-trust: Enforce caller must be an active administrator
  if (auth.user.role !== 'admin' || auth.user.status === 'blocked') {
    return res.status(403).json({ error: 'Quyền truy cập bị từ chối. Chỉ Quản trị viên đang hoạt động mới có quyền tạo tài khoản người dùng.' });
  }

  // 2. Validate input parameters
  const { email, name, role = 'student', password, level, status = 'active' } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Địa chỉ email là bắt buộc.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Định dạng email không hợp lệ.' });
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Họ và tên người dùng là bắt buộc.' });
  }
  const cleanName = name.trim();

  // SEC-RESTRICTION: Do not allow creating admin users via this API
  const allowedRoles = ['student', 'teacher'];
  const targetRole = String(role).trim().toLowerCase();
  if (!allowedRoles.includes(targetRole)) {
    return res.status(400).json({ 
      error: `Vai trò không hợp lệ: "${role}". Chỉ được phép tạo tài khoản "student" (Học viên) hoặc "teacher" (Giáo viên).` 
    });
  }

  const cleanStatus = status === 'blocked' ? 'blocked' : 'active';
  const cleanLevel = level && typeof level === 'string' ? level.trim() : 'HSK 1 - Sơ cấp';

  // Password validation: minimum 8 characters
  let userPassword = password && typeof password === 'string' ? password.trim() : '';
  if (!userPassword) {
    // Generate secure default temporary password if not provided
    userPassword = `HanziGo@${Math.random().toString(36).substring(2, 10)}!`;
  } else if (userPassword.length < 8) {
    return res.status(400).json({ error: 'Mật khẩu phải có độ dài tối thiểu 8 ký tự.' });
  }

  // 3. Supabase Admin Client execution
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return res.status(503).json({ error: 'Dịch vụ xác thực máy chủ Supabase hiện không khả dụng.' });
  }

  try {
    // Check if email already exists in profiles
    const { data: existingProfile } = await adminClient
      .from('profiles')
      .select('id, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingProfile) {
      return res.status(409).json({ error: 'Địa chỉ email này đã được đăng ký trong hệ thống.' });
    }

    // Call Supabase Auth Admin createUser with auto-confirm
    const { data: authCreated, error: authError } = await adminClient.auth.admin.createUser({
      email: cleanEmail,
      password: userPassword,
      email_confirm: true,
      user_metadata: {
        name: cleanName,
        level: cleanLevel,
        role: targetRole
      }
    });

    if (authError) {
      if (authError.status === 422 || /already registered|unique/i.test(authError.message || '')) {
        return res.status(409).json({ error: 'Địa chỉ email này đã được đăng ký trong hệ thống Auth.' });
      }
      return res.status(400).json({ error: `Lỗi tạo tài khoản Auth: ${authError.message}` });
    }

    const newUserId = authCreated?.user?.id;
    if (!newUserId) {
      return res.status(500).json({ error: 'Không thể khởi tạo định danh người dùng từ hệ thống Auth.' });
    }

    // Ensure profiles record exists and has correct authoritative role and status
    // (Trigger handle_new_user automatically creates default student profile, we ensure role/status synchronization)
    const { data: updatedProfile, error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        id: newUserId,
        email: cleanEmail,
        name: cleanName,
        level: cleanLevel,
        role: targetRole,
        status: cleanStatus,
        xp: 50,
        streak: 1,
        words_learned: 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select('id, email, name, role, status, level, created_at')
      .single();

    if (profileError) {
      console.error('[/api/admin/create-user] Profile upsert failed. Rolling back auth user:', profileError.message);
      try {
        await adminClient.auth.admin.deleteUser(newUserId);
      } catch (rollbackErr) {
        console.error('[/api/admin/create-user] Auth rollback failed:', rollbackErr);
      }
      return res.status(500).json({ 
        error: 'Lỗi đồng bộ hồ sơ người dùng trong cơ sở dữ liệu. Thao tác đã được hoàn tác an toàn.' 
      });
    }

    // Record administrative audit log
    try {
      await adminClient.from('audit_logs').insert({
        user_id: auth.user.id,
        action: 'ADMIN_CREATE_USER',
        details: {
          created_user_id: newUserId,
          target_email: cleanEmail,
          target_role: targetRole,
          target_name: cleanName
        },
        created_at: new Date().toISOString()
      });
    } catch {}

    // Return safe user object (Strictly NEVER return password, token, or service role key)
    return res.status(201).json({
      success: true,
      message: `Đã tạo tài khoản thành công cho ${cleanName} (${cleanEmail}) với vai trò ${targetRole.toUpperCase()}.`,
      user: {
        id: newUserId,
        email: cleanEmail,
        name: cleanName,
        role: targetRole,
        status: cleanStatus,
        level: cleanLevel,
        joinedDate: updatedProfile?.created_at ? updatedProfile.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      }
    });

  } catch (err) {
    console.error('[/api/admin/create-user] Server error:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi tạo tài khoản người dùng.' });
  }
}
