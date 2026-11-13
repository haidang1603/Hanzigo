import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getBuiltInListeningTracks,
  evaluateDictationDiff,
  recordListeningProgress,
} from '../src/services/listeningStudioService.ts';

test('getBuiltInListeningTracks returns tracks with valid synced segments', () => {
  const tracks = getBuiltInListeningTracks();
  assert.ok(tracks.length >= 3);
  for (const track of tracks) {
    assert.ok(track.transcript_segments.length > 0);
    for (const seg of track.transcript_segments) {
      assert.ok(seg.end_ms > seg.start_ms);
      assert.ok(seg.hanzi.length > 0);
    }
  }
});

test('evaluateDictationDiff scores exact Hanzi match ignoring punctuation at 100%', () => {
  const segment = {
    hanzi: '你好，请问你想喝点儿什么？',
    pinyin: 'Nǐ hǎo, qǐngwèn nǐ xiǎng hē diǎnr shénme?',
  };
  const result = evaluateDictationDiff('你好请问你想喝点儿什么', segment, 'hanzi');
  assert.equal(result.accuracy, 100);
  assert.equal(result.correctCount, result.totalExpected);
  assert.ok(result.diffs.every((d) => d.status === 'correct'));
});

test('evaluateDictationDiff detects wrong, missing, extra characters and homophone hints', () => {
  const segment = {
    hanzi: '我想买一杯热拿铁',
    pinyin: 'Wǒ xiǎng mǎi yì bēi rè nátiě',
  };
  // Wrong '卖' instead of '买', missing '热', extra '的' at end
  const result = evaluateDictationDiff('我想卖一杯拿铁的', segment, 'hanzi');
  assert.ok(result.accuracy < 100);
  assert.ok(result.diffs.some((d) => d.status === 'wrong' && d.expected === '买'));
  assert.ok(result.diffs.some((d) => d.status === 'missing' && d.expected === '热'));
  assert.ok(result.diffs.some((d) => d.status === 'extra' && d.char === '的'));
  assert.ok(result.homophoneHints.some((h) => h.includes('买')));
});

test('evaluateDictationDiff supports Pinyin mode with numeric tones', () => {
  const segment = {
    hanzi: '你好，请问',
    pinyin: 'Nǐ hǎo, qǐng wèn',
  };
  const result = evaluateDictationDiff('ni3 hao3 qing3 wen4', segment, 'pinyin');
  assert.equal(result.accuracy, 100);
  assert.equal(result.correctCount, 4);
});

test('recordListeningProgress completes cleanly in local simulation mode', async () => {
  const track = getBuiltInListeningTracks()[0];
  await recordListeningProgress({
    user: null,
    track,
    dictationAccuracy: 92.5,
    completedSegments: [0, 1],
    quizScore: 100,
  });
  assert.ok(true);
});

test('listening studio SQL migration defines listening_tracks and user_listening_logs', () => {
  const sqlPath = path.resolve('supabase/migrations/20261112_2705_chinese_listening_studio.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.listening_tracks/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_listening_logs/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
});
