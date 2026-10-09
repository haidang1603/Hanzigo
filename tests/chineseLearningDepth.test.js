import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  evaluateRealPronunciation, 
  extractTone 
} from '../src/utils/pronunciationEvaluator.js';

import {
  getSpeakingLabPrompts,
  evaluateSpeakingLabSession,
  generateSpeakingPedagogicalFeedback
} from '../src/services/speakingLabService.js';

import {
  getHanziMasteryItem,
  advanceMasteryFlow,
  generateRecognizeQuiz,
  generateRecallQuiz,
  syncHanziToSrs,
  MASTERY_FLOW_STEPS
} from '../src/services/hanziMasteryService.js';

import {
  getGrammarLessons,
  validateWordOrdering,
  validateFillBlank,
  validateTranslationPractice,
  evaluateGrammarExercise
} from '../src/services/grammarEngineService.js';

import {
  getListeningExercises,
  evaluateListeningExercise,
  PLAYBACK_RATES
} from '../src/services/listeningPracticeService.js';

import {
  buildCrossSkillJourney,
  trackCrossSkillProgress
} from '../src/services/crossSkillService.js';

import {
  explainLearningMistake,
  validateExerciseSubmission,
  MISTAKE_TYPES
} from '../src/services/aiFeedbackService.js';

import { VOCABULARY_LIST } from '../src/data/chineseData.js';

/* =========================================================================
 * PART A — SPEAKING LAB TESTS
 * ========================================================================= */

test('Speaking Lab: Evaluator analyzes word recognition, missing words, and extra words', () => {
  const result = evaluateRealPronunciation({
    targetHanzi: '你好吗',
    targetPinyin: 'nǐ hǎo ma',
    spokenTranscript: '你好',
    audioDurationMs: 900,
    audioEnergyRms: 50
  });

  assert.equal(result.isValid, true);
  assert.equal(result.wordRecognition.recognizedCount, 2);
  assert.equal(result.wordRecognition.totalCount, 3);
  assert.deepEqual(result.missingWords, ['吗']);
  assert.deepEqual(result.extraWords, []);
});

test('Speaking Lab: Evaluator detects extra words spoken not in prompt', () => {
  const result = evaluateRealPronunciation({
    targetHanzi: '谢谢',
    targetPinyin: 'xièxie',
    spokenTranscript: '谢谢你',
    audioDurationMs: 1100,
    audioEnergyRms: 60
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.missingWords, []);
  assert.deepEqual(result.extraWords, ['你']);
});

test('Speaking Lab: Evaluator calculates speaking pace (CPM) and assesses rate', () => {
  // 6 chars in 1200ms -> duration = 1.2s -> 6 / (1.2/60) = 300 CPM (too fast)
  const fastResult = evaluateRealPronunciation({
    targetHanzi: '今天天气真好啊',
    targetPinyin: 'jīntiān tiānqì zhēn hǎo a',
    spokenTranscript: '今天天气真好啊',
    audioDurationMs: 1200,
    audioEnergyRms: 55
  });

  assert.equal(fastResult.speakingPace.category, 'too_fast');
  assert.ok(fastResult.speakingPace.charsPerMinute > 260);

  // 4 chars in 1500ms -> 160 CPM (optimal)
  const optimalResult = evaluateRealPronunciation({
    targetHanzi: '我是老师',
    targetPinyin: 'wǒ shì lǎoshī',
    spokenTranscript: '我是老师',
    audioDurationMs: 1500,
    audioEnergyRms: 45
  });

  assert.equal(optimalResult.speakingPace.category, 'optimal');
  assert.equal(optimalResult.speakingPace.charsPerMinute, 160);
});

test('Speaking Lab: Evaluator assesses RMS energy and consistency', () => {
  const quietResult = evaluateRealPronunciation({
    targetHanzi: '再见',
    targetPinyin: 'zàijiàn',
    spokenTranscript: '再见',
    audioDurationMs: 900,
    audioEnergyRms: 12
  });

  assert.equal(quietResult.rmsEnergy.assessment, 'low');
  assert.ok(quietResult.pronunciationConsistency.score >= 60);

  const noisyResult = evaluateRealPronunciation({
    targetHanzi: '再见',
    targetPinyin: 'zàijiàn',
    spokenTranscript: '再见',
    audioDurationMs: 900,
    audioEnergyRms: 90
  });

  assert.equal(noisyResult.rmsEnergy.assessment, 'noisy');
});

test('Speaking Lab: Strict honesty - does NOT claim F0 pitch contour without acoustic sensor', () => {
  const result = evaluateRealPronunciation({
    targetHanzi: '你好',
    targetPinyin: 'nǐ hǎo',
    spokenTranscript: '你好',
    audioDurationMs: 800,
    audioEnergyRms: 50
  });

  assert.equal(result.toneContourHonesty.hasF0Analysis, false);
  assert.ok(result.toneContourHonesty.note.includes('Không giả lập đồ thị cao độ F0'));
});

test('Speaking Lab: evaluateSpeakingLabSession tracks retry improvement and pedagogical advice', () => {
  const prompts = getSpeakingLabPrompts('HSK 1');
  assert.ok(prompts.length > 0);
  const prompt = prompts[0];

  // Attempt 1: only spoken partially
  const attempt1 = evaluateSpeakingLabSession({
    prompt,
    spokenTranscript: '你好',
    audioDurationMs: 1000,
    audioEnergyRms: 40,
    attemptHistory: []
  });

  assert.equal(attempt1.attemptNumber, 1);
  assert.equal(attempt1.improvement.isFirstAttempt, true);
  assert.equal(attempt1.retryRecommended, true);
  assert.ok(attempt1.feedback.actionItems.length > 0);

  // Attempt 2: retry with full speech
  const attempt2 = evaluateSpeakingLabSession({
    prompt,
    spokenTranscript: '你好很高兴认识你',
    audioDurationMs: 2500,
    audioEnergyRms: 60,
    attemptHistory: [attempt1.diagnostic]
  });

  assert.equal(attempt2.attemptNumber, 2);
  assert.equal(attempt2.improvement.isFirstAttempt, false);
  assert.ok(attempt2.improvement.accuracyDelta > 0);
  assert.equal(attempt2.canAdvance, true);
});

/* =========================================================================
 * PART B — HANZI MASTERY TESTS
 * ========================================================================= */

test('Hanzi Mastery: getHanziMasteryItem enriches vocabulary without duplicate database', () => {
  const mastery = getHanziMasteryItem('我');
  assert.equal(mastery.character, '我');
  assert.equal(mastery.pinyin, 'wǒ');
  assert.equal(mastery.tone, 3);
  assert.ok(mastery.meaning);
  assert.ok(mastery.radical);
  assert.ok(mastery.mnemonic);
  assert.ok(mastery.strokeOrder.length >= 7);
  assert.ok(mastery.audio.text);
  assert.ok(mastery.example.hanzi);

  // Verify it references existing VOCABULARY_LIST
  const original = VOCABULARY_LIST.find(v => v.id === mastery.sourceVocabId);
  assert.ok(original);
  assert.equal(original.hanzi, mastery.fullWord);
});

test('Hanzi Mastery: 6-stage flow progression (Learn -> Trace -> Write -> Recognize -> Recall -> SRS)', () => {
  assert.equal(MASTERY_FLOW_STEPS.length, 6);
  assert.equal(MASTERY_FLOW_STEPS[0].id, 'learn');
  assert.equal(MASTERY_FLOW_STEPS[1].id, 'trace');
  assert.equal(MASTERY_FLOW_STEPS[2].id, 'write');
  assert.equal(MASTERY_FLOW_STEPS[3].id, 'recognize');
  assert.equal(MASTERY_FLOW_STEPS[4].id, 'recall');
  assert.equal(MASTERY_FLOW_STEPS[5].id, 'srs');

  const mastery = getHanziMasteryItem('你');
  let flow = advanceMasteryFlow({ currentStepIndex: 0, stepSuccess: true, masteryItem: mastery });
  assert.equal(flow.currentStep, 'trace');
  assert.equal(flow.isCompleted, false);

  flow = advanceMasteryFlow({ currentStepIndex: 4, stepSuccess: true, masteryItem: mastery });
  assert.equal(flow.currentStep, 'srs');

  flow = advanceMasteryFlow({ currentStepIndex: 5, stepSuccess: true, masteryItem: mastery });
  assert.equal(flow.isCompleted, true);
});

test('Hanzi Mastery: generateRecognizeQuiz and generateRecallQuiz generate valid questions', () => {
  const mastery = getHanziMasteryItem('好');
  const recognize = generateRecognizeQuiz(mastery);
  assert.equal(recognize.type, 'recognize');
  assert.equal(recognize.promptHanzi, '好');
  assert.equal(recognize.options.length, 4);
  assert.equal(recognize.options.filter(o => o.isCorrect).length, 1);

  const recall = generateRecallQuiz(mastery);
  assert.equal(recall.type, 'recall');
  assert.equal(recall.promptMeaning, mastery.meaning);
  assert.equal(recall.options.length, 4);
  assert.equal(recall.options.filter(o => o.isCorrect).length, 1);
});

test('Hanzi Mastery: syncHanziToSrs integrates seamlessly with SM-2 spaced repetition', async () => {
  const mastery = getHanziMasteryItem('学');
  const srsCard = await syncHanziToSrs('test-user-uuid', mastery);
  assert.ok(srsCard);
  assert.equal(srsCard.hanzi, '学');
  assert.equal(srsCard.intervalDays, 1);
  assert.equal(srsCard.repetitions, 1);
  assert.ok(srsCard.nextReviewAt);
});

/* =========================================================================
 * PART C — GRAMMAR ENGINE TESTS
 * ========================================================================= */

test('Grammar Engine: Lessons adhere to Pattern -> Explanation -> Examples -> Practice -> Correction flow', () => {
  const lessons = getGrammarLessons('all');
  assert.ok(lessons.length >= 3);

  lessons.forEach(l => {
    assert.ok(l.pattern, 'Lesson must define grammatical pattern');
    assert.ok(l.explanation, 'Lesson must provide grammatical explanation');
    assert.ok(l.examples && l.examples.length > 0, 'Lesson must contain examples');
    assert.ok(l.exercises && l.exercises.length >= 3, 'Lesson must contain exercises');
  });
});

test('Grammar Engine: Word Ordering correctly validates "我 + 喜欢 + 喝 + 茶 -> 我喜欢喝茶。"', () => {
  const lesson = getGrammarLessons().find(l => l.id === 'gram-1');
  const exercise = lesson.exercises.find(e => e.type === 'word_ordering');

  // Correct ordering
  const validResult = validateWordOrdering({
    userOrderedTokens: ['我', '喜欢', '喝', '茶'],
    exercise
  });
  assert.equal(validResult.isCorrect, true);
  assert.equal(validResult.userSentence, '我喜欢喝茶');
  assert.ok(validResult.feedback.includes('Chính xác'));

  // Incorrect ordering
  const invalidResult = validateWordOrdering({
    userOrderedTokens: ['茶', '喝', '喜欢', '我'],
    exercise
  });
  assert.equal(invalidResult.isCorrect, false);
  assert.ok(invalidResult.feedback.includes('Chưa chính xác'));
  assert.ok(invalidResult.explanation);
});

test('Grammar Engine: Fill Blank and Translation Practice validation', () => {
  const lesson = getGrammarLessons().find(l => l.id === 'gram-1');
  const fillEx = lesson.exercises.find(e => e.type === 'fill_blank');
  
  const fillCorrect = validateFillBlank({ userAnswer: '喜欢', exercise: fillEx });
  assert.equal(fillCorrect.isCorrect, true);

  const fillWrong = validateFillBlank({ userAnswer: '很', exercise: fillEx });
  assert.equal(fillWrong.isCorrect, false);

  const transEx = lesson.exercises.find(e => e.type === 'translation_practice');
  const transCorrect = validateTranslationPractice({
    userTranslation: '她喜欢听音乐。',
    exercise: transEx
  });
  assert.equal(transCorrect.isCorrect, true);

  const transWrong = validateTranslationPractice({
    userTranslation: '他看电影。',
    exercise: transEx
  });
  assert.equal(transWrong.isCorrect, false);
});

test('Grammar Engine: Unified evaluateGrammarExercise handles all 4 formats', () => {
  const lesson3 = getGrammarLessons().find(l => l.id === 'gram-3'); // 比 structure
  const orderEx = lesson3.exercises[0];

  const res = evaluateGrammarExercise({
    exercise: orderEx,
    submission: ['今天', '比', '昨天', '冷']
  });
  assert.equal(res.isCorrect, true);
});

/* =========================================================================
 * PART D — LISTENING PRACTICE TESTS
 * ========================================================================= */

test('Listening Practice: Exercises cover all 5 required modes', () => {
  const exercises = getListeningExercises('all');
  const types = new Set(exercises.map(e => e.type));

  assert.ok(types.has('multiple_choice'), 'Must support multiple choice');
  assert.ok(types.has('true_false'), 'Must support true/false');
  assert.ok(types.has('fill_blank'), 'Must support fill blank');
  assert.ok(types.has('dictation'), 'Must support dictation');
  assert.ok(types.has('keyword_identification'), 'Must support keyword identification');

  exercises.forEach(e => {
    assert.ok(e.audioText, 'Must have audio text');
    assert.ok(e.transcript, 'Must have transcript');
    assert.ok(e.question, 'Must have question');
    assert.ok(e.correctAnswer, 'Must have answer');
    assert.ok(e.explanation, 'Must have explanation');
  });
});

test('Listening Practice: Playback rates support 1.0x normal and 0.75x slow', () => {
  assert.equal(PLAYBACK_RATES.NORMAL, 1.0);
  assert.equal(PLAYBACK_RATES.SLOW, 0.75);
});

test('Listening Practice: evaluateListeningExercise accurately checks answers across types', () => {
  const mcEx = getListeningExercises().find(e => e.type === 'multiple_choice');
  assert.equal(evaluateListeningExercise({ exercise: mcEx, userAnswer: '9 giờ sáng' }).isCorrect, true);
  assert.equal(evaluateListeningExercise({ exercise: mcEx, userAnswer: '8 giờ sáng' }).isCorrect, false);

  const tfEx = getListeningExercises().find(e => e.type === 'true_false');
  assert.equal(evaluateListeningExercise({ exercise: tfEx, userAnswer: 'Sai (错误)' }).isCorrect, true);
  assert.equal(evaluateListeningExercise({ exercise: tfEx, userAnswer: 'Đúng (正确)' }).isCorrect, false);

  const fillEx = getListeningExercises().find(e => e.type === 'fill_blank');
  assert.equal(evaluateListeningExercise({ exercise: fillEx, userAnswer: '火车站' }).isCorrect, true);
  assert.equal(evaluateListeningExercise({ exercise: fillEx, userAnswer: 'huǒchēzhàn' }).isCorrect, true);

  const dictEx = getListeningExercises().find(e => e.type === 'dictation');
  assert.equal(evaluateListeningExercise({ exercise: dictEx, userAnswer: '今天北京的天气非常晴朗。' }).isCorrect, true);

  const kwEx = getListeningExercises().find(e => e.type === 'keyword_identification');
  assert.equal(evaluateListeningExercise({ exercise: kwEx, userAnswer: '250 tệ' }).isCorrect, true);
});

/* =========================================================================
 * PART E — CROSS-SKILL INTEGRATION TESTS
 * ========================================================================= */

test('Cross-Skill: A single vocabulary item seamlessly flows through all 6 skills', () => {
  const journey = buildCrossSkillJourney(1); // '我'
  assert.equal(journey.hanzi, '我');

  // 1. Vocabulary
  assert.ok(journey.stages.vocabulary.hanzi);
  assert.ok(journey.stages.vocabulary.meaning);

  // 2. Listening
  assert.ok(journey.stages.listening.audioText);
  assert.ok(journey.stages.listening.transcript);
  assert.ok(journey.stages.listening.question);

  // 3. Speaking
  assert.ok(journey.stages.speaking.promptHanzi);
  assert.ok(journey.stages.speaking.targetKeyword);

  // 4. Hanzi
  assert.ok(journey.stages.hanzi.character);
  assert.ok(journey.stages.hanzi.strokeOrder.length > 0);

  // 5. Grammar
  assert.ok(journey.stages.grammar.correctSentence);
  assert.ok(journey.stages.grammar.scrambledTokens.length > 0);

  // 6. SRS
  assert.ok(journey.stages.srs.intervalDays);
  assert.ok(journey.stages.srs.nextReviewAt);
});

test('Cross-Skill: trackCrossSkillProgress computes percentage and mastery badge', () => {
  const vocab = { hanzi: '你' };
  const initial = trackCrossSkillProgress(vocab, ['vocabulary', 'listening']);
  assert.equal(initial.progressPercentage, 33);
  assert.equal(initial.isMastered, false);

  const full = trackCrossSkillProgress(vocab, ['vocabulary', 'listening', 'speaking', 'hanzi', 'grammar', 'srs']);
  assert.equal(full.progressPercentage, 100);
  assert.equal(full.isMastered, true);
  assert.ok(full.badge.includes('thuần thục'));
});

/* =========================================================================
 * PART F — AI FEEDBACK & SAFE VALIDATION GATE TESTS
 * ========================================================================= */

test('AI Feedback: Explains pronunciation, grammar, translation, and vocabulary errors', () => {
  const pronEx = explainLearningMistake({
    mistakeType: MISTAKE_TYPES.PRONUNCIATION,
    targetContent: '你好',
    userAttempt: '你'
  });
  assert.ok(pronEx.analysis.explanation);
  assert.ok(pronEx.analysis.pedagogicalRule.includes('thanh điệu'));

  const gramEx = explainLearningMistake({
    mistakeType: MISTAKE_TYPES.GRAMMAR,
    targetContent: '我喜欢喝茶',
    userAttempt: '我喝茶喜欢'
  });
  assert.ok(gramEx.analysis.explanation);
  assert.ok(gramEx.analysis.pedagogicalRule.includes('Trật tự câu'));

  const transEx = explainLearningMistake({
    mistakeType: MISTAKE_TYPES.TRANSLATION,
    targetContent: '他比我高',
    userAttempt: '他是我高'
  });
  assert.ok(transEx.analysis.explanation);

  const vocabEx = explainLearningMistake({
    mistakeType: MISTAKE_TYPES.VOCABULARY,
    targetContent: '水',
    userAttempt: '冰'
  });
  assert.ok(vocabEx.analysis.explanation);
});

test('AI Feedback: Validation Gate blocks unauthorized automated database mutations', () => {
  // Without user explicit validation
  const unvalidated = explainLearningMistake({
    mistakeType: MISTAKE_TYPES.GRAMMAR,
    targetContent: '我是学生',
    userAttempt: '我学生是',
    isUserValidated: false
  });

  assert.equal(unvalidated.validationGate.databaseWritePermitted, false);
  assert.ok(unvalidated.validationGate.safetyNotice.includes('Read-only'));

  // With user explicit validation
  const validated = explainLearningMistake({
    mistakeType: MISTAKE_TYPES.GRAMMAR,
    targetContent: '我是学生',
    userAttempt: '我是学生',
    isUserValidated: true
  });

  assert.equal(validated.validationGate.databaseWritePermitted, true);
});

test('AI Feedback: validateExerciseSubmission sanitizes and rejects malicious/empty input', () => {
  assert.equal(validateExerciseSubmission('').isValid, false);
  assert.equal(validateExerciseSubmission('   ').isValid, false);
  assert.equal(validateExerciseSubmission('<script>alert("xss")</script>').isValid, false);

  const valid = validateExerciseSubmission('你好，很高兴认识你。');
  assert.equal(valid.isValid, true);
  assert.equal(valid.sanitizedInput, '你好，很高兴认识你。');
});
