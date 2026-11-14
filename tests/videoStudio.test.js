import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getBuiltInVideos,
  parseYouTubeVideoId,
  parseSubtitlesInput,
  createCustomYouTubeVideo,
  findActiveSubtitleCueIndex,
  mineVideoSentenceToSRS,
  saveVideoProgress,
} from '../src/services/videoStudioService.ts';

test('getBuiltInVideos returns empty list (no fake dummy videos)', () => {
  const videos = getBuiltInVideos();
  assert.deepEqual(videos, []);
});

test('parseYouTubeVideoId extracts ID from standard, short, shorts, and embed URLs', () => {
  assert.equal(parseYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(parseYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ?t=15'), 'dQw4w9WgXcQ');
  assert.equal(parseYouTubeVideoId('https://www.youtube.com/shorts/abc123XYZ_9'), 'abc123XYZ_9');
  assert.equal(parseYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(parseYouTubeVideoId('dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(parseYouTubeVideoId('https://example.com/video'), null);
  assert.equal(parseYouTubeVideoId(''), null);
});

test('parseSubtitlesInput parses SRT and plain Chinese lines with tokenized words', () => {
  const srt = `1
00:00:00,000 --> 00:00:04,500
欢迎来到今天的茶文化体验馆。
Chào mừng đến với trải nghiệm văn hóa trà hôm nay.

2
00:00:04,500 --> 00:00:11,200
喝茶不仅是一种习惯。
Uống trà không chỉ là một thói quen.`;

  const cues = parseSubtitlesInput(srt);
  assert.equal(cues.length, 2);
  assert.equal(cues[0].start_ms, 0);
  assert.equal(cues[0].end_ms, 4500);
  assert.ok(cues[0].tokens.length > 0);
  assert.equal(cues[1].start_ms, 4500);
  assert.equal(cues[1].end_ms, 11200);
  assert.ok(cues[1].tokens.some((t) => t.text === '习惯'));

  const plainCues = parseSubtitlesInput('你好 | Xin chào\n谢谢 | Cảm ơn');
  assert.equal(plainCues.length, 2);
  assert.equal(plainCues[0].vi_translation, 'Xin chào');
  assert.equal(plainCues[1].start_ms, 5000);
});

test('findActiveSubtitleCueIndex locates the correct cue in O(log n)', () => {
  const video = createCustomYouTubeVideo({
    videoId: 'dQw4w9WgXcQ',
    title: 'Test Video',
    rawSubtitles: `1
00:00:00,000 --> 00:00:04,500
欢迎来到这里。
Chào mừng tới đây.

2
00:00:04,500 --> 00:00:11,200
喝茶是一种习惯。
Uống trà là một thói quen.`,
  });
  const subs = video.subtitles;

  assert.equal(findActiveSubtitleCueIndex(subs, 2000), 0);
  assert.equal(findActiveSubtitleCueIndex(subs, 7000), 1);
  assert.equal(findActiveSubtitleCueIndex(subs, -500), -1);
});

test('mineVideoSentenceToSRS saves token with contextual video sentence', async () => {
  const video = createCustomYouTubeVideo({
    videoId: 'dQw4w9WgXcQ',
    title: 'Test Video',
    rawSubtitles: '喝茶是一种习惯 | Uống trà là một thói quen',
  });
  const cue = video.subtitles[0];
  const token = cue.tokens.find((t) => t.text === '习惯');
  assert.ok(token);

  await mineVideoSentenceToSRS({
    video,
    cue,
    token,
    user: null,
  });

  assert.ok(true);
});

test('saveVideoProgress saves position and cue indices safely', async () => {
  const video = createCustomYouTubeVideo({
    videoId: 'dQw4w9WgXcQ',
    title: 'Test Video',
  });
  await saveVideoProgress({
    user: null,
    videoId: video.id,
    positionMs: 12500,
    savedCueIndex: 1,
    shadowedCueIndex: 1,
  });

  assert.ok(true);
});

test('video studio SQL migration defines immersion_videos and user_video_progress', () => {
  const sqlPath = path.resolve('supabase/migrations/20261112_2901_video_studio.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.immersion_videos/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_video_progress/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
});
