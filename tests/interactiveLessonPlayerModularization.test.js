import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('=== PHASE 25 / TASK 25.04: LESSON PLAYER MODULARIZATION TESTS ===', () => {

  const stepsDir = path.join(rootDir, 'src', 'components', 'learning', 'lesson-steps');
  const playerFile = path.join(rootDir, 'src', 'components', 'learning', 'InteractiveLessonPlayer.jsx');

  const stepFiles = [
    'Step1Learn.jsx',
    'Step2Vocabulary.jsx',
    'Step3Hanzi.jsx',
    'Step4Grammar.jsx',
    'Step5Listening.jsx',
    'Step6Speaking.jsx',
    'Step7Writing.jsx',
    'Step8Quiz.jsx',
    'Step9Challenge.jsx',
    'index.js'
  ];

  test('1. Directory src/components/learning/lesson-steps/ exists', () => {
    assert.ok(fs.existsSync(stepsDir), 'lesson-steps directory must exist');
  });

  test('2. All 9 step components and index.js exist', () => {
    for (const f of stepFiles) {
      const fullPath = path.join(stepsDir, f);
      assert.ok(fs.existsSync(fullPath), `File ${f} must exist in lesson-steps/`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 50, `File ${f} must not be empty (size: ${stat.size} bytes)`);
    }
  });

  test('3. index.js correctly re-exports all 9 step components', () => {
    const indexPath = path.join(stepsDir, 'index.js');
    const content = fs.readFileSync(indexPath, 'utf-8');
    for (let i = 1; i <= 9; i++) {
      assert.ok(content.includes(`Step${i}`), `index.js must export Step${i}`);
    }
  });

  test('4. InteractiveLessonPlayer.jsx imports all 9 step components from ./lesson-steps', () => {
    const playerContent = fs.readFileSync(playerFile, 'utf-8');
    assert.ok(playerContent.includes("from './lesson-steps'"), 'Must import from ./lesson-steps');
    for (let i = 1; i <= 9; i++) {
      assert.ok(playerContent.includes(`<Step${i}`), `Player must invoke <Step${i}`);
    }
  });

  test('5. Line count reduction: Monolithic player refactored from ~2,578 lines down to ~1,353 lines', () => {
    const playerContent = fs.readFileSync(playerFile, 'utf-8');
    const lines = playerContent.split('\n');
    assert.ok(lines.length < 1500, `Player line count should be < 1500 lines (current: ${lines.length})`);
    assert.ok(lines.length > 1000, `Player should retain control logic, state and modals (current: ${lines.length})`);
  });

  test('6. Step 1 (Learn) component handles toneGuide and initialsGuide gracefully', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step1Learn.jsx'), 'utf-8');
    assert.ok(content.includes('step1_learn.toneGuide'), 'Must support toneGuide');
    assert.ok(content.includes('step1_learn.initialsGuide'), 'Must support initialsGuide');
    assert.ok(content.includes('step1_learn.audioDemoText'), 'Must support audioDemoText');
  });

  test('7. Step 2 (Vocabulary) component supports stroke order, flashcards, pronunciation and dictionary actions', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step2Vocabulary.jsx'), 'utf-8');
    assert.ok(content.includes('handleSaveFlashcard'), 'Must support saving flashcard to SRS');
    assert.ok(content.includes('onSelectWriting'), 'Must support writing pad action');
    assert.ok(content.includes('onSelectPronounce'), 'Must support speaking evaluation action');
    assert.ok(content.includes('setSelectedDictWord'), 'Must support dictionary lookup action');
  });

  test('8. Step 3 (Hanzi) component integrates StrokeOrderPlayer & InteractiveWritingPad', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step3Hanzi.jsx'), 'utf-8');
    assert.ok(content.includes('StrokeOrderPlayer'), 'Must embed StrokeOrderPlayer');
    assert.ok(content.includes('InteractiveWritingPad'), 'Must embed InteractiveWritingPad');
    assert.ok(content.includes('getHanziDecomposition'), 'Must fetch decomposition');
  });

  test('9. Step 5 (Listening) component supports roleplay mode and speed toggling', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step5Listening.jsx'), 'utf-8');
    assert.ok(content.includes('ROLEPLAY_B'), 'Must support roleplay mode');
    assert.ok(content.includes('isSlowAudio'), 'Must support 0.65x slow audio');
    assert.ok(content.includes('showPinyin'), 'Must support Pinyin toggle');
    assert.ok(content.includes('showTranslation'), 'Must support translation toggle');
  });

  test('10. Step 6 (Speaking) component evaluates pronunciation and records audio', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step6Speaking.jsx'), 'utf-8');
    assert.ok(content.includes('handleToggleRecord'), 'Must handle recording toggle');
    assert.ok(content.includes('speakingFeedback'), 'Must render pronunciation feedback');
    assert.ok(content.includes('speechTranscript'), 'Must render recognized transcript');
  });

  test('11. Step 7 (Writing) component supports word tile assembly, reset and check answer', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step7Writing.jsx'), 'utf-8');
    assert.ok(content.includes('handleWordTileClick'), 'Must handle word tile click');
    assert.ok(content.includes('handleResetWriting'), 'Must handle reset');
    assert.ok(content.includes('handleCheckWriting'), 'Must handle check answer');
  });

  test('12. Step 8 (Quiz) component provides multiple choice with feedback and audio', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step8Quiz.jsx'), 'utf-8');
    assert.ok(content.includes('handleSelectQuizOption'), 'Must handle option selection');
    assert.ok(content.includes('isAnsweredCorrectly'), 'Must check correctness');
  });

  test('13. Step 9 (Challenge) component integrates recording timer, reflex mode and completion unlock', () => {
    const content = fs.readFileSync(path.join(stepsDir, 'Step9Challenge.jsx'), 'utf-8');
    assert.ok(content.includes('handleStartChallengeRecording'), 'Must support recording challenge');
    assert.ok(content.includes('handleStartReflexChallenge'), 'Must support reflex challenge fallback');
    assert.ok(content.includes('handleFinishLesson'), 'Must handle lesson completion');
    assert.ok(content.includes('Lock'), 'Must lock completion before challenge');
  });
});

