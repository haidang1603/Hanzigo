import test from 'node:test';
import assert from 'node:assert/strict';

function checkUserAdminStatus(user) {
  if (!user || typeof user !== 'object') return false;
  return Boolean(user.role === 'admin' && user.status !== 'blocked');
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
