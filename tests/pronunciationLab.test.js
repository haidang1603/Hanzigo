import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  applyMandarinToneSandhi,
  generateReferencePitchContour,
} from '../src/utils/toneSandhiEngine.ts';
import {
  getBuiltInPronunciationDrills,
  evaluatePronunciationAttempt,
} from '../src/services/pronunciationLabService.ts';
import {
  detectPitchAutocorrelation,
  normalizeHzToChaoScale,
} from '../src/features/pronunciation-lab/usePitchContourAnalyzer.ts';

test('applyMandarinToneSandhi handles 3+3, 3+3+3, 一 and 不 rules', () => {
  const nihao = applyMandarinToneSandhi('你好', 'nǐ hǎo');
  assert.equal(nihao.surfacePinyin, 'ní hǎo');
  assert.equal(nihao.syllables[0].surfaceTone, 2);
  assert.equal(nihao.syllables[1].surfaceTone, 3);

  const henhao = applyMandarinToneSandhi('我很好', 'wǒ hěn hǎo');
  assert.equal(henhao.surfacePinyin, 'wǒ hén hǎo');

  const yiding = applyMandarinToneSandhi('一定', 'yī dìng');
  assert.equal(yiding.surfacePinyin, 'yí dìng');

  const yiban = applyMandarinToneSandhi('一般', 'yī bān');
  assert.equal(yiban.surfacePinyin, 'yì bān');

  const bushi = applyMandarinToneSandhi('不是', 'bù shì');
  assert.equal(bushi.surfacePinyin, 'bú shì');
});

test('generateReferencePitchContour returns normalized [0..100] values', () => {
  const contour = generateReferencePitchContour([1, 2, 3, 4], 10);
  assert.equal(contour.length, 40);
  assert.ok(contour.every((v) => v >= 0 && v <= 100));
});

test('detectPitchAutocorrelation detects synthetic 200Hz sine wave and normalizes to Chao scale', () => {
  const sampleRate = 16000;
  const freq = 200;
  const buffer = new Float32Array(2048);
  for (let i = 0; i < buffer.length; i += 1) {
    buffer[i] = 0.5 * Math.sin((2 * Math.PI * freq * i) / sampleRate);
  }
  const detected = detectPitchAutocorrelation(buffer, sampleRate);
  assert.ok(detected !== null);
  assert.ok(Math.abs(detected - freq) < 3);

  const chao = normalizeHzToChaoScale(detected);
  assert.ok(chao >= 5 && chao <= 98);
});

test('evaluatePronunciationAttempt scores matching contour high and detects wrong tones', () => {
  const drills = getBuiltInPronunciationDrills();
  const nihao = drills[0];

  const goodResult = evaluatePronunciationAttempt({
    drill: nihao,
    userContour: nihao.reference_pitch_contour,
  });
  assert.ok(goodResult.overall_score >= 90);
  assert.ok(goodResult.syllable_breakdown.every((s) => s.score >= 85));

  const invertedContour = nihao.reference_pitch_contour.map((v) => 100 - v);
  const badResult = evaluatePronunciationAttempt({
    drill: nihao,
    userContour: invertedContour,
  });
  assert.ok(badResult.overall_score < goodResult.overall_score);
  assert.ok(badResult.syllable_breakdown.some((s) => s.error_type === 'wrong_tone'));
});

test('pronunciation lab SQL migration defines pronunciation_drills and user_pronunciation_attempts', () => {
  const sqlPath = path.resolve('supabase/migrations/20261112_2707_pronunciation_lab.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.pronunciation_drills/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_pronunciation_attempts/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
});

