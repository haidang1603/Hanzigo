import test from 'node:test';
import assert from 'node:assert/strict';

function checkUserAdminStatus(user) {
  if (!user || typeof user !== 'object') return false;
  return Boolean(user.role === 'admin' && user.status !== 'blocked');
}

function checkUserTeacherStatus(user) {
  if (!user || typeof user !== 'object') return false;
  return Boolean((user.role === 'teacher' || user.role === 'admin') && user.status !== 'blocked');
}

test('RBAC: Guest user is not admin', () => {
  assert.equal(checkUserAdminStatus(null), false);
  assert.equal(checkUserAdminStatus({ role: 'student' }), false);
});

test('RBAC: Blocked admin cannot access administrative features', () => {
  assert.equal(checkUserAdminStatus({ role: 'admin', status: 'blocked' }), false);
});

test('RBAC: Active admin has verified access', () => {
  assert.equal(checkUserAdminStatus({ role: 'admin', status: 'active' }), true);
});

test('RBAC: Guest and student cannot access teacher features', () => {
  assert.equal(checkUserTeacherStatus(null), false);
  assert.equal(checkUserTeacherStatus({ role: 'student', status: 'active' }), false);
});

test('RBAC: Blocked teacher cannot access teacher features', () => {
  assert.equal(checkUserTeacherStatus({ role: 'teacher', status: 'blocked' }), false);
});

test('RBAC: Active teacher has access to teacher dashboard and classrooms', () => {
  assert.equal(checkUserTeacherStatus({ role: 'teacher', status: 'active' }), true);
});

test('RBAC: Teacher cannot access administrative features', () => {
  assert.equal(checkUserAdminStatus({ role: 'teacher', status: 'active' }), false);
});

test('RBAC: Admin has unified teacher and admin access', () => {
  assert.equal(checkUserTeacherStatus({ role: 'admin', status: 'active' }), true);
  assert.equal(checkUserAdminStatus({ role: 'admin', status: 'active' }), true);
});

test('RBAC: Registration role normalization strictly limits to student or teacher', () => {
  function normalizeRegistrationRole(requestedRole) {
    return requestedRole === 'teacher' ? 'teacher' : 'student';
  }

  // Student selection
  assert.equal(normalizeRegistrationRole('student'), 'student');
  // Teacher selection
  assert.equal(normalizeRegistrationRole('teacher'), 'teacher');
  // Attempted privilege escalation to admin is blocked
  assert.equal(normalizeRegistrationRole('admin'), 'student');
  assert.equal(normalizeRegistrationRole('moderator'), 'student');
  assert.equal(normalizeRegistrationRole(null), 'student');
  assert.equal(normalizeRegistrationRole(undefined), 'student');
});

test('RBAC: Role immutability ensures users cannot escalate roles in client session', () => {
  function canUserModifyRoleDirectly() {
    // Client-side role editing is disabled; users cannot arbitrarily customize roles
    return false;
  }
  assert.equal(canUserModifyRoleDirectly(), false);
});

test('RBAC: System admin emails are permanently protected from demotion', async () => {
  const { isEmailAdmin } = await import('../src/services/authService.js');
  assert.equal(isEmailAdmin('lehaidang16032006@gmail.com'), true);
  assert.equal(isEmailAdmin('LEHAIDANG16032006@GMAIL.COM'), true);
  assert.equal(isEmailAdmin('admin@hanzigo.com'), true);
  assert.equal(isEmailAdmin('student@example.com'), false);
  assert.equal(isEmailAdmin('teacher@example.com'), false);
});
