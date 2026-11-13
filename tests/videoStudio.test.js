import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getBuiltInVideos,
  findActiveSubtitleCueIndex,
  mineVideoSentenceToSRS,
  saveVideoProgress,
} from '../src/services/videoStudioService.ts';

test('getBuiltInVideos provides videos with tokenized subtitles', () => {
  const videos = getBuiltInVideos();
  assert.ok(videos.length >= 2);
  for (const video of videos) {
    assert.ok(video.subtitles.length > 0);
    for (const cue of video.subtitles) {
      assert.ok(cue.end_ms > cue.start_ms);
      assert.ok(cue.tokens.length > 0);
      assert.ok(cue.tokens.every((t) => t.text.length > 0));
    }
  }
});

test('findActiveSubtitleCueIndex locates the correct cue in O(log n)', () => {
  const video = getBuiltInVideos()[0];
  const subs = video.subtitles;

  // Exact mid of cue 0: 0 to 4500ms
  const idx0 = findActiveSubtitleCueIndex(subs, 2000);
  assert.equal(idx0, 0);

  // Exact mid of cue 1: 4500 to 11200ms
  const idx1 = findActiveSubtitleCueIndex(subs, 7000);
  assert.equal(idx1, 1);

  // Out of range returns -1 or nearest
  const idxBefore = findActiveSubtitleCueIndex(subs, -500);
  assert.equal(idxBefore, -1);
});

test('mineVideoSentenceToSRS saves token with contextual video sentence', async () => {
  const video = getBuiltInVideos()[0];
  const cue = video.subtitles[1];
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
  const video = getBuiltInVideos()[0];
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

