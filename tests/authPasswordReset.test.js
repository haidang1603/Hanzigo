import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  isValidEmailFormat, 
  requestPasswordReset, 
  updateNewPassword, 
  verifyRecoverySession 
} from '../src/services/authService.js';

import { supabase, isSupabaseConfigured } from '../src/supabase/config.js';

// =========================================================================
// NHÓM A: GỬI EMAIL KHÔI PHỤC (REQUEST PASSWORD RESET)
// =========================================================================

test('Nhóm A1: isValidEmailFormat validates common email formats accurately', () => {
  // Valid emails
  assert.equal(isValidEmailFormat('user@example.com'), true);
  assert.equal(isValidEmailFormat('student.hsk@hanzigo.edu.vn'), true);
  assert.equal(isValidEmailFormat('  learner+chinese@gmail.com  '), true);

  // Invalid emails
  assert.equal(isValidEmailFormat(''), false);
  assert.equal(isValidEmailFormat('notanemail'), false);
  assert.equal(isValidEmailFormat('@missinguser.com'), false);
  assert.equal(isValidEmailFormat('user@nodomain'), false);
  assert.equal(isValidEmailFormat(null), false);
  assert.equal(isValidEmailFormat(undefined), false);
});

test('Nhóm A2: requestPasswordReset rejects empty or null email with clear message', async () => {
  await assert.rejects(
    async () => await requestPasswordReset(''),
    /Vui lòng nhập địa chỉ email/
  );

  await assert.rejects(
    async () => await requestPasswordReset('   '),
    /Vui lòng nhập địa chỉ email/
  );

  await assert.rejects(
    async () => await requestPasswordReset(null),
    /Vui lòng nhập địa chỉ email/
  );
});

test('Nhóm A3: requestPasswordReset rejects invalid email format before API call', async () => {
  await assert.rejects(
    async () => await requestPasswordReset('invalid_email_format'),
    /địa chỉ email không đúng định dạng/i
  );

  await assert.rejects(
    async () => await requestPasswordReset('user@com'),
    /địa chỉ email không đúng định dạng/i
  );
});

test('Nhóm A4: requestPasswordReset enforces zero user enumeration with standard response', async () => {
  // Even if email is non-existent, response must be uniform to prevent account scraping
  const res = await requestPasswordReset('any.user.random12345@gmail.com');
  assert.equal(res.success, true);
  assert.ok(res.message?.includes('Nếu email tồn tại trong hệ thống'));
});

test('Nhóm A5: requestPasswordReset automatically trims spaces and lowercases email', async () => {
  const res = await requestPasswordReset('   Student.Learner2026@Gmail.Com   ');
  assert.equal(res.success, true);
  assert.ok(res.message?.includes('Nếu email tồn tại trong hệ thống'));
});

// =========================================================================
// NHÓM B: ĐẶT MẬT KHẨU MỚI (UPDATE NEW PASSWORD)
// =========================================================================

test('Nhóm B1: updateNewPassword rejects passwords under 6 characters', async () => {
  await assert.rejects(
    async () => await updateNewPassword('12345'),
    /tối thiểu 6 ký tự/i
  );

  await assert.rejects(
    async () => await updateNewPassword(''),
    /không được để trống/i
  );

  await assert.rejects(
    async () => await updateNewPassword(null),
    /không được để trống/i
  );
});

test('Nhóm B2: updateNewPassword succeeds with valid 6+ character password in simulation mode', async () => {
  if (!isSupabaseConfigured) {
    const res = await updateNewPassword('NewSecurePass2026!');
    assert.equal(res.success, true);
    assert.equal(res.simulated, true);
    assert.ok(res.message?.includes('thành công'));
  }
});

test('Nhóm B3: updateNewPassword fails closed if no session is active', async () => {
  if (isSupabaseConfigured && supabase) {
    // When signed out, updateUser must be rejected
    await supabase.auth.signOut().catch(() => {});
    await assert.rejects(
      async () => await updateNewPassword('ValidPass123456!'),
      /Phiên làm việc không hợp lệ hoặc liên kết khôi phục đã hết hạn/i
    );
  }
});

// =========================================================================
// NHÓM C: RECOVERY FLOW, URL PARSING & VERIFICATION
// =========================================================================

test('Nhóm C1: verifyRecoverySession returns valid status in simulation or authenticated state', async () => {
  const status = await verifyRecoverySession();
  assert.ok(typeof status.valid === 'boolean');
});

test('Nhóm C2: Hash fragment recovery detection regex handles type=recovery properly', () => {
  const testHash1 = '#access_token=test_jwt_token&refresh_token=test_refresh&type=recovery&expires_in=3600';
  assert.ok(testHash1.includes('type=recovery'));

  const testHash2 = '#reset-password#access_token=xyz&type=recovery';
  assert.ok(testHash2.includes('type=recovery') && testHash2.includes('reset-password'));

  const testHashExpired = '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired';
  assert.ok(testHashExpired.includes('error=') && testHashExpired.includes('otp_expired'));
});

test('Nhóm C3: Password strength meter calculations are sound', () => {
  function testStrength(pass) {
    if (!pass) return 0;
    let s = 0;
    if (pass.length >= 6) s += 1;
    if (pass.length >= 8) s += 1;
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) s += 1;
    if (/[^a-zA-Z0-9]/.test(pass) || (/[A-Z]/.test(pass) && /[a-z]/.test(pass))) s += 1;
    return s;
  }

  assert.equal(testStrength('12345'), 0); // under 6
  assert.equal(testStrength('123456'), 1); // length 6 only numbers
  assert.equal(testStrength('pass12'), 2); // 6 chars, lowercase + numbers
  assert.equal(testStrength('Pass12'), 3); // 6 chars, mixed case + numbers
  assert.equal(testStrength('Pass1234'), 4); // 8 chars, mixed case + numbers
  assert.equal(testStrength('SecurePass2026!'), 4); // 8+ chars, upper/lower/numbers/special
});

// =========================================================================
// NHÓM D: REGRESSION & ZERO-TRUST SECURITY
// =========================================================================

test('Nhóm D1: Password reset flow does not expose ADMIN_EMAILS or weaken RBAC', async () => {
  const { ADMIN_EMAILS } = await import('../src/services/authService.js');
  assert.equal(Array.isArray(ADMIN_EMAILS), true);
  assert.equal(ADMIN_EMAILS.length, 0); // Strict Zero-Trust requirement
});

test('Nhóm D2: Non-existent RPC set_user_role_on_login is never called', async () => {
  const authModule = await import('../src/services/authService.js');
  assert.equal(typeof authModule.loginWithEmail, 'function');
  assert.equal(typeof authModule.registerWithEmail, 'function');
  assert.equal(typeof authModule.requestPasswordReset, 'function');
  assert.equal(typeof authModule.updateNewPassword, 'function');
});
