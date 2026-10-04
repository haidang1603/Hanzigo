import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRealPronunciation, extractTone } from '../src/utils/pronunciationEvaluator.js';

test('Tone extraction: extracts correct numerical tone from pinyin', () => {
  assert.equal(extractTone('māo'), 1);
  assert.equal(extractTone('chá'), 2);
  assert.equal(extractTone('nǐ'), 3);
  assert.equal(extractTone('hào'), 4);
  assert.equal(extractTone('ma'), 5);
});

test('Pronunciation evaluation: exact match gets high honest score and praise', () => {
  const result = evaluateRealPronunciation({
    targetHanzi: '你好',
    targetPinyin: 'nǐ hǎo',
    spokenTranscript: '你好',
    audioDurationMs: 800
  });

  assert.equal(result.isValid, true);
  assert.ok(result.overall >= 90);
  assert.equal(result.accuracyScore, 100);
  assert.equal(result.charBreakdown[0].status, 'correct');
  assert.equal(result.charBreakdown[1].status, 'correct');
  assert.ok(result.xpEarned > 0);
});

test('Pronunciation evaluation: partial match flags tone warning without fake random number', () => {
  const result = evaluateRealPronunciation({
    targetHanzi: '漂亮',
    targetPinyin: 'piàoliang',
    spokenTranscript: '漂',
    audioDurationMs: 500
  });

  assert.equal(result.isValid, true);
  assert.ok(result.overall < 90);
  assert.equal(result.charBreakdown[0].status, 'correct');
  assert.equal(result.charBreakdown[1].status, 'incorrect');
});

test('Pronunciation evaluation: empty or unrecognized voice returns honest diagnostic feedback without points', () => {
  const result = evaluateRealPronunciation({
    targetHanzi: '谢谢',
    targetPinyin: 'xièxie',
    spokenTranscript: '',
    audioDurationMs: 0
  });

  assert.equal(result.isValid, false);
  assert.equal(result.overall, 0);
  assert.equal(result.xpEarned, 0);
  assert.equal(result.charBreakdown[0].status, 'unrecognized');
  assert.ok(result.feedback.includes('chưa thu được'));
});
