import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getXpLeaderboard, 
  getXpHonorificTitle, 
  XP_HONORIFIC_TITLES 
} from '../src/services/leaderboardService.js';

// Polyfill localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

test('Leaderboard: Honorific title calculation based on XP tiers', () => {
  assert.equal(getXpHonorificTitle(2000).title, '👑 Đại Tông Sư HSK');
  assert.equal(getXpHonorificTitle(1500).title, '👑 Đại Tông Sư HSK');
  assert.equal(getXpHonorificTitle(1200).title, '🐉 Cao Thủ Phản Xạ');
  assert.equal(getXpHonorificTitle(800).title, '🔥 Bậc Thầy Hán Tự');
  assert.equal(getXpHonorificTitle(400).title, '🌿 Học Giả Siêng Năng');
  assert.equal(getXpHonorificTitle(150).title, '🌱 Tân Binh Nỗ Lực');
  assert.equal(getXpHonorificTitle(20).title, '🐣 Người Mới Bắt Đầu');
});

test('Leaderboard: Dynamic ranking and current user placement', async () => {
  localStorage.clear();

  // Seed local learners
  const mockLearners = [
    { id: 'learner-1', name: 'Minh Hằng', email: 'minhhang@test.com', xp: 450, streak: 5, level: 'HSK 2' },
    { id: 'learner-2', name: 'Thanh Tùng', email: 'tung.thanh@test.com', xp: 850, streak: 12, level: 'HSK 3' }
  ];
  localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(mockLearners));

  const currentUser = {
    uid: 'current-user-1',
    name: 'Hải Đăng',
    email: 'haidang@test.com',
    level: 'HSK 2'
  };

  const result = await getXpLeaderboard(currentUser);
  assert.ok(Array.isArray(result.leaderboard), 'Leaderboard must be an array');
  assert.equal(result.totalLearners >= 3, true, 'Must include mock learners + current user');

  // Verify sorted by XP descending
  for (let i = 0; i < result.leaderboard.length - 1; i++) {
    assert.ok(
      result.leaderboard[i].xp >= result.leaderboard[i + 1].xp,
      `Rank ${i + 1} must have XP >= Rank ${i + 2}`
    );
  }

  // Top 1 should be Thanh Tùng with 850 XP
  assert.equal(result.leaderboard[0].email, 'tung.thanh@test.com');
  assert.equal(result.leaderboard[0].rank, 1);

  // Current user rank must be identified
  assert.ok(result.currentUserRank > 0, 'Current user rank must be identified');
  assert.ok(result.currentUserEntry, 'Current user entry must be returned');
});

test('Leaderboard: Demo users filtering', async () => {
  localStorage.clear();

  const mixedDirectory = [
    { id: 'user-stu-1', name: 'Fake Demo Student', email: 'mai.nguyen@gmail.com', xp: 9999 },
    { id: 'real-stu-1', name: 'Học viên thật', email: 'real.student@domain.com', xp: 200 }
  ];
  localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(mixedDirectory));

  const result = await getXpLeaderboard();
  const fakeFound = result.leaderboard.some(u => u.name === 'Fake Demo Student' || u.email === 'mai.nguyen@gmail.com');
  assert.equal(fakeFound, false, 'Demo user must be filtered out from leaderboard');

  const realFound = result.leaderboard.some(u => u.email === 'real.student@domain.com');
  assert.equal(realFound, true, 'Real student must be retained on leaderboard');
});
