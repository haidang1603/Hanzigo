import test from 'node:test';
import assert from 'node:assert/strict';
import {
  POST_LIMITS,
  sanitizePublicDisplayName,
  validateCommunityPostInput,
  validateCommunityCommentInput,
  getVietnamLeaderboardWindow,
  filterAndRankHallOfFame,
  toggleLikeOptimisticList,
  resetActionCooldowns,
} from '../src/utils/communitySafety.js';
import { getXpLeaderboard } from '../src/services/leaderboardService.js';
import {
  normalizePostData,
  createCommunityPost,
  createCommunityComment,
  togglePostReaction,
} from '../src/services/communityService.js';

// Polyfill localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

test('Scenario 1: Zero PII Masking on Leaderboard & Community Posts', async () => {
  localStorage.clear();

  assert.equal(sanitizePublicDisplayName('nguyenvana@gmail.com'), 'ngu***');
  assert.equal(sanitizePublicDisplayName('ab@domain.vn'), 'a***');
  assert.equal(sanitizePublicDisplayName('Trần Minh Tâm'), 'Trần Minh Tâm');
  assert.equal(sanitizePublicDisplayName('<script>alert(1)</script>'), 'scriptalert(1)/script');

  const mixedDirectory = [
    { id: 'u-pii-1', name: 'minhanh.hsk@gmail.com', email: 'minhanh.hsk@gmail.com', xp: 620, streak: 6, level: 'HSK 4' },
    { id: 'u-pii-2', name: 'Lan Hương', email: 'lanhuong.secret@company.vn', xp: 480, streak: 3, level: 'HSK 3' },
  ];
  localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(mixedDirectory));

  const lbResult = await getXpLeaderboard({
    uid: 'u-pii-2',
    name: 'Lan Hương',
    email: 'lanhuong.secret@company.vn',
  });
  assert.equal(lbResult.leaderboard.length, 2);
  for (const entry of lbResult.leaderboard) {
    assert.equal(entry.email, undefined, 'Public leaderboard row must never expose raw email field');
    assert.equal(entry.name.includes('@'), false, 'Display name must mask email-shaped strings');
  }
  assert.equal(lbResult.leaderboard[0].name, 'min***');
  assert.equal(lbResult.leaderboard[1].name, 'Lan Hương');

  const normalizedPost = normalizePostData({
    id: 101,
    author_id: 'u-pii-1',
    author_name: 'minhanh.hsk@gmail.com',
    content: 'Xin kinh nghiệm thi HSK 4',
    tag: '#ThiHSK',
    likes_count: 2,
    comments_count: 1,
    created_at: new Date().toISOString(),
  });
  assert.equal(normalizedPost.author, 'min***');
  assert.equal(normalizedPost.email, undefined);
});

test('Scenario 2: XSS Blocking & Input Length Validation for Posts & Comments', () => {
  const emptyPost = validateCommunityPostInput({ content: '   ' });
  assert.equal(emptyPost.valid, false);

  const overTitle = validateCommunityPostInput({
    title: 'A'.repeat(POST_LIMITS.TITLE_MAX + 1),
    content: 'Nội dung hợp lệ',
  });
  assert.equal(overTitle.valid, false);

  const overContent = validateCommunityPostInput({
    content: 'B'.repeat(POST_LIMITS.CONTENT_MAX + 1),
  });
  assert.equal(overContent.valid, false);

  const scriptPost = validateCommunityPostInput({
    title: 'Mẹo học <script>alert(1)</script>',
    content: 'Xem link javascript:alert(2)',
  });
  assert.equal(scriptPost.valid, false);

  const badImgPost = validateCommunityPostInput({
    content: 'Ảnh học tập',
    imageUrl: 'javascript:alert(document.cookie)',
  });
  assert.equal(badImgPost.valid, false);

  const validPost = validateCommunityPostInput({
    title: '  Hỏi cách dùng 把  ',
    content: '  Mình hay nhầm câu chữ 把 trong HSK 3  ',
    chineseSnippet: '我把书放在桌子上',
    pinyinSnippet: 'Wǒ bǎ shū fàng zài zhuōzi shàng',
  });
  assert.equal(validPost.valid, true);
  assert.equal(validPost.sanitized.title, 'Hỏi cách dùng 把');

  const emptyComment = validateCommunityCommentInput('');
  assert.equal(emptyComment.valid, false);

  const overComment = validateCommunityCommentInput('C'.repeat(POST_LIMITS.COMMENT_MAX + 1));
  assert.equal(overComment.valid, false);

  const xssComment = validateCommunityCommentInput('Hay quá <script>steal()</script>');
  assert.equal(xssComment.valid, false);

  const okComment = validateCommunityCommentInput('  Rất hữu ích ạ!  ');
  assert.equal(okComment.valid, true);
  assert.equal(okComment.sanitizedContent, 'Rất hữu ích ạ!');
});

test('Scenario 3: Guest Auth Guard Blocks Unauthenticated Community Mutations', async () => {
  localStorage.clear();
  resetActionCooldowns();

  const postRes = await createCommunityPost({
    content: 'Bài viết thử khi chưa đăng nhập',
    tag: '#ThiHSK',
  });
  assert.equal(postRes.success, false);
  assert.equal(postRes.code, 'AUTH_REQUIRED');

  const commentRes = await createCommunityComment('123', 'Bình luận khi chưa đăng nhập');
  assert.equal(commentRes, null, 'Unauthenticated comment creation must be blocked safely');

  const likeRes = await togglePostReaction('123', 'like');
  assert.equal(likeRes.success, false);
  assert.equal(likeRes.code, 'AUTH_REQUIRED');
});

test('Scenario 4: Vietnam Timezone (Asia/Ho_Chi_Minh) Weekly & Monthly Boundary', () => {
  // Sunday 2026-11-22 23:30:00 +07:00 == 2026-11-22T16:30:00Z
  const sundayLateVn = new Date('2026-11-22T16:30:00.000Z');
  const winSunday = getVietnamLeaderboardWindow(sundayLateVn);

  // Monday 2026-11-23 00:15:00 +07:00 == 2026-11-22T17:15:00Z (same UTC date, new VN week!)
  const mondayEarlyVn = new Date('2026-11-22T17:15:00.000Z');
  const winMonday = getVietnamLeaderboardWindow(mondayEarlyVn);

  assert.equal(winSunday.timezone, 'Asia/Ho_Chi_Minh');
  assert.equal(winSunday.vnDateKey, '2026-11-22');
  assert.equal(winSunday.weekStartIso, '2026-11-16T00:00:00+07:00');
  assert.equal(winSunday.countdownToNextWeek.days, 0);
  assert.equal(winSunday.countdownToNextWeek.hours, 0);
  assert.equal(winSunday.countdownToNextWeek.minutes, 30);

  assert.equal(winMonday.vnDateKey, '2026-11-23');
  assert.equal(winMonday.weekStartIso, '2026-11-23T00:00:00+07:00');
  assert.equal(winMonday.monthStartIso, '2026-11-01T00:00:00+07:00');
  assert.notEqual(winSunday.weekStartIso, winMonday.weekStartIso);
});

test('Scenario 5: Hall of Fame Strictly Includes Exam Mode Only & Respects System/Level Filters', () => {
  const attempts = [
    {
      id: 'a1',
      userId: 'u-1',
      displayName: 'Nguyễn Minh',
      examMode: 'learning_mode',
      examSystem: 'hsk_2_0',
      examLevel: 'HSK 4',
      score: 299,
      maxScore: 300,
    },
    {
      id: 'a2',
      userId: 'u-2',
      displayName: 'Phạm Thảo',
      examMode: 'practice',
      examSystem: 'hsk_3_0',
      examLevel: 'HSK 7-9',
      score: 300,
      maxScore: 300,
    },
    {
      id: 'a3',
      userId: 'u-3',
      displayName: 'hoanglong@gmail.com',
      examMode: 'simulation',
      examSystem: 'hsk_3_0',
      examLevel: 'HSK 7-9',
      score: 265,
      maxScore: 300,
      passed: true,
    },
    {
      id: 'a4',
      userId: 'u-4',
      displayName: 'Lê An',
      examMode: 'exam_mode',
      examSystem: 'hsk_2_0',
      examLevel: 'HSK 4',
      score: 250,
      maxScore: 300,
      passed: true,
    },
    {
      id: 'a5',
      userId: 'u-5',
      displayName: 'Ẩn Danh User',
      examMode: 'simulation',
      examSystem: 'hsk_2_0',
      examLevel: 'HSK 4',
      score: 295,
      maxScore: 300,
      isOptedOut: true,
    },
  ];

  const allHall = filterAndRankHallOfFame(attempts, { examSystem: 'all', level: 'all' });
  assert.equal(allHall.entries.length, 2, 'Only non-opted-out simulation/exam_mode attempts should appear');
  assert.equal(allHall.entries[0].userId, 'u-3');
  assert.equal(allHall.entries[0].name, 'hoa***');
  assert.equal(allHall.entries[1].userId, 'u-4');

  const hsk30Only = filterAndRankHallOfFame(attempts, { examSystem: 'hsk_3_0', level: 'HSK 7-9' });
  assert.equal(hsk30Only.entries.length, 1);
  assert.equal(hsk30Only.entries[0].userId, 'u-3');

  // Self opted-out record still remains visible to owner with isOptedOut flag
  const ownerSelfView = filterAndRankHallOfFame(attempts, {
    examSystem: 'hsk_2_0',
    level: 'HSK 4',
    currentUserId: 'u-5',
  });
  assert.equal(ownerSelfView.entries.some((r) => r.userId === 'u-5' && r.isOptedOut === true), true);
});

test('Scenario 6: Zero Bot Injection When Empty & Exact Optimistic Like Rollback', async () => {
  localStorage.clear();

  const emptyLeaderboard = await getXpLeaderboard();
  assert.equal(emptyLeaderboard.leaderboard.length, 0, 'Empty directory must never inject fake bot learners');

  const seedPosts = [
    { id: 'p-1', liked: false, likes: 4 },
    { id: 'p-2', liked: true, likes: 10 },
  ];

  // Optimistic toggle on p-1 -> likes 5, liked true
  const afterLike = toggleLikeOptimisticList(seedPosts, 'p-1');
  assert.equal(afterLike[0].liked, true);
  assert.equal(afterLike[0].likes, 5);
  assert.equal(afterLike[1].likes, 10);

  // Server failed -> rollback restores exact original count & liked state
  const afterRollback = toggleLikeOptimisticList(afterLike, 'p-1');
  assert.equal(afterRollback[0].liked, false);
  assert.equal(afterRollback[0].likes, 4);
});
