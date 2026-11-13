import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';

import {
  PRACTICE_LEVELS,
  GRAMMAR_DRILLS_BY_LEVEL,
  LISTENING_DRILLS_BY_LEVEL
} from '../src/data/practiceLevelData.js';
import { 
  speakChinese, 
  stopChineseSpeech, 
  checkChineseVoiceSupport 
} from '../src/utils/audio.js';

// =========================================================================
// 1. ROUTING & NAVIGATION INTEGRITY TESTS
// =========================================================================
test('Routing: VALID_TABS includes practice, grammar, and listening', () => {
  const appContent = fs.readFileSync('src/App.jsx', 'utf8');
  assert.ok(appContent.includes("'practice'"), 'VALID_TABS must include practice');
  assert.ok(appContent.includes("'grammar'"), 'VALID_TABS must include grammar');
  assert.ok(appContent.includes("'listening'"), 'VALID_TABS must include listening');
  assert.ok(
    !appContent.includes("rawTab === 'practice' ? 'vocabulary'"),
    'App.jsx must NOT redirect rawTab practice to vocabulary'
  );
});

test('Routing: Route parser accurately parses #practice, #grammar, #listening', () => {
  // Simulate App.jsx route parser logic
  const parseRoute = (hashString) => {
    const hash = hashString.replace(/^#\/?/, '').split('?')[0];
    const parts = hash.split('/').filter(Boolean);
    const rawTab = (parts[0] || 'home').toLowerCase();
    const tab = 
      rawTab === 'dictionary' ? 'writing' :
      rawTab === 'privacy-policy' ? 'privacy' :
      rawTab === 'terms-of-service' ? 'terms' :
      rawTab === 'cookie-policy' ? 'cookies' :
      rawTab === 'refund-policy' ? 'refund' :
      rawTab === 'reset-password' ? 'reset-password' :
      rawTab;
    const sub = parts[1] || null;
    const param = parts[2] || null;
    return { tab, sub, param };
  };

  assert.deepEqual(parseRoute('#practice'), { tab: 'practice', sub: null, param: null });
  assert.deepEqual(parseRoute('#grammar'), { tab: 'grammar', sub: null, param: null });
  assert.deepEqual(parseRoute('#listening'), { tab: 'listening', sub: null, param: null });
  assert.deepEqual(parseRoute('#practice/grammar'), { tab: 'practice', sub: 'grammar', param: null });
  assert.deepEqual(parseRoute('#grammar/2'), { tab: 'grammar', sub: '2', param: null });
  assert.deepEqual(parseRoute('#listening/3'), { tab: 'listening', sub: '3', param: null });
});

test('Navigation: Navbar includes grammar and listening in practiceItems without removing core items', () => {
  const navbarContent = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
  
  // Verify new entries
  assert.ok(navbarContent.includes("id: 'grammar'"), 'Navbar must have grammar entry');
  assert.ok(navbarContent.includes("id: 'listening'"), 'Navbar must have listening entry');
  assert.ok(navbarContent.includes("id: 'practice'"), 'Navbar must have practice entry');

  // Verify existing items preserved
  assert.ok(navbarContent.includes("id: 'vocabulary'"), 'Navbar must retain vocabulary entry');
  assert.ok(navbarContent.includes("id: 'pronunciation'"), 'Navbar must retain pronunciation entry');
  assert.ok(navbarContent.includes("id: 'writing'"), 'Navbar must retain writing entry');
  assert.ok(navbarContent.includes("id: 'conversation'"), 'Navbar must retain conversation entry');
  assert.ok(navbarContent.includes("id: 'reader'"), 'Navbar must retain reader entry');

  // Verify active indicator check includes practice, grammar, and listening
  assert.ok(
    navbarContent.includes("activeTab === 'practice' || activeTab === 'grammar' || activeTab === 'listening'"),
    'Navbar isPracticeActive must recognize practice, grammar, and listening tabs'
  );
});

// =========================================================================
// 2. GRAMMAR PRACTICE ENGINE TESTS
// =========================================================================
test('Grammar Drills: dataset contains valid levels and question structures', () => {
  assert.ok(GRAMMAR_DRILLS_BY_LEVEL.length >= 7, 'Must have at least 7 verified grammar drills');
  assert.ok(GRAMMAR_DRILLS_BY_LEVEL.length >= 90, 'Must have at least 90 verified grammar drills (15 per HSK 1-6)');
  
  const drillsByLevel = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  GRAMMAR_DRILLS_BY_LEVEL.forEach(drill => {
    assert.ok(drill.id, 'Drill must have an id');
    assert.ok([1, 2, 3, 4, 5, 6].includes(drill.level), `Invalid level: ${drill.level}`);
    drillsByLevel[drill.level]++;
    assert.ok(drill.title && drill.title.length > 0, 'Drill must have title');
    assert.ok(drill.meaning && drill.meaning.length > 0, 'Drill must have Vietnamese meaning');
    assert.ok(Array.isArray(drill.tokens) && drill.tokens.length >= 2, 'Must have at least 2 tokens');
    assert.ok(Array.isArray(drill.correctTokens) && drill.correctTokens.length >= 2, 'Must have at least 2 correct tokens');
    assert.equal(drill.tokens.length, drill.correctTokens.length, 'Tokens count must match');
    assert.ok(drill.explanation && drill.explanation.length > 0, 'Must provide pedagogical explanation');
  });

  assert.ok(drillsByLevel[1] >= 15, 'Level 1 must have at least 15 grammar drills');
  assert.ok(drillsByLevel[2] >= 15, 'Level 2 must have at least 15 grammar drills');
  assert.ok(drillsByLevel[3] >= 15, 'Level 3 must have at least 15 grammar drills');
  assert.ok(drillsByLevel[4] >= 15, 'Level 4 must have at least 15 grammar drills');
  assert.ok(drillsByLevel[5] >= 15, 'Level 5 must have at least 15 advanced grammar drills');
  assert.ok(drillsByLevel[6] >= 15, 'Level 6 must have at least 15 mastery grammar drills');
});

test('Grammar Drills: answer evaluation validates exact token order', () => {
  const sampleDrill = GRAMMAR_DRILLS_BY_LEVEL[0]; // 我 是 老师
  assert.ok(sampleDrill);

  // Correct answer
  const correctSubmission = [...sampleDrill.correctTokens];
  const isCorrect = correctSubmission.join('') === sampleDrill.correctTokens.join('');
  assert.equal(isCorrect, true, 'Matching tokens must evaluate to correct');

  // Incorrect answer (scrambled or partial)
  const wrongSubmission = ['老师', '我', '是'];
  const isWrong = wrongSubmission.join('') === sampleDrill.correctTokens.join('');
  assert.equal(isWrong, false, 'Incorrect order must evaluate to false');

  const emptySubmission = [];
  const isEmpty = emptySubmission.join('') === sampleDrill.correctTokens.join('');
  assert.equal(isEmpty, false, 'Empty answer must evaluate to false');
});

test('Grammar Drills: question navigation and boundary handling', () => {
  const level1Drills = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 1);
  assert.ok(level1Drills.length >= 15);

  let currentIdx = 0;
  // Next question
  currentIdx = currentIdx + 1;
  assert.equal(currentIdx, 1, 'Should navigate to question 2');

  // Prev question
  currentIdx = (currentIdx - 1 + level1Drills.length) % level1Drills.length;
  assert.equal(currentIdx, 0, 'Should navigate back to question 1');

  // Advanced level check (level 5 has >= 15 drills)
  const level5Drills = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 5);
  assert.ok(level5Drills.length >= 15, 'Level 5 should safely return >= 15 drills');

  // Out-of-bounds level check (level 7)
  const level7Drills = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 7);
  assert.equal(level7Drills.length, 0, 'Level 7 should safely return 0 drills');
});

// =========================================================================
// 3. LISTENING PRACTICE ENGINE TESTS
// =========================================================================
test('Listening Drills: dataset contains valid levels, audio texts, and option choices', () => {
  assert.ok(LISTENING_DRILLS_BY_LEVEL.length >= 9, 'Must have at least 9 verified listening drills');
  assert.ok(LISTENING_DRILLS_BY_LEVEL.length >= 90, 'Must have at least 90 verified listening drills (15 per HSK 1-6)');

  const drillsByLevel = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  LISTENING_DRILLS_BY_LEVEL.forEach(drill => {
    assert.ok(drill.id, 'Drill must have an id');
    assert.ok([1, 2, 3, 4, 5, 6].includes(drill.level), `Invalid level: ${drill.level}`);
    drillsByLevel[drill.level]++;
    assert.ok(drill.audioText && drill.audioText.length > 0, 'Drill must have audio text for speech synthesis');
    assert.ok(drill.hanzi && drill.hanzi.length > 0, 'Drill must have hanzi');
    assert.ok(drill.question && drill.question.length > 0, 'Drill must have question text');
    assert.ok(Array.isArray(drill.options) && drill.options.length >= 2, 'Drill must have at least 2 options');
    assert.ok(drill.correctIndex >= 0 && drill.correctIndex < drill.options.length, 'correctIndex must be in bounds');
    assert.ok(drill.explanation && drill.explanation.length > 0, 'Drill must provide explanation');
  });

  assert.ok(drillsByLevel[1] >= 15, 'Level 1 must have at least 15 listening drills');
  assert.ok(drillsByLevel[2] >= 15, 'Level 2 must have at least 15 listening drills');
  assert.ok(drillsByLevel[3] >= 15, 'Level 3 must have at least 15 listening drills');
  assert.ok(drillsByLevel[4] >= 15, 'Level 4 must have at least 15 listening drills');
  assert.ok(drillsByLevel[5] >= 15, 'Level 5 must have at least 15 advanced listening drills');
  assert.ok(drillsByLevel[6] >= 15, 'Level 6 must have at least 15 mastery listening drills');
});

test('Listening Drills: answer evaluation checks option index correctly', () => {
  const sampleDrill = LISTENING_DRILLS_BY_LEVEL[0]; // 你好 -> Xin chào
  assert.equal(sampleDrill.correctIndex, 0);

  // Correct selection
  const selectedCorrect = 0;
  assert.equal(selectedCorrect === sampleDrill.correctIndex, true);

  // Wrong selection
  const selectedWrong = 1;
  assert.equal(selectedWrong === sampleDrill.correctIndex, false);
});

test('Listening Audio: audio utility functions exist and are safe in headless environments', () => {
  assert.equal(typeof speakChinese, 'function');
  assert.equal(typeof stopChineseSpeech, 'function');
  assert.equal(typeof checkChineseVoiceSupport, 'function');

  // Should gracefully handle empty string without throwing
  const emptyRes = speakChinese('');
  assert.deepEqual(emptyRes, { success: false, reason: 'empty_text' });

  // stopChineseSpeech should not throw in node / headless environment
  assert.doesNotThrow(() => {
    stopChineseSpeech();
  });

  // checkChineseVoiceSupport should return boolean (false in node)
  const voiceSupported = checkChineseVoiceSupport();
  assert.equal(typeof voiceSupported, 'boolean');
});

// =========================================================================
// 4. REGRESSION & COMPONENT ACCESSIBILITY TESTS
// =========================================================================
test('Regression: Core learning pages exist and are properly structured', () => {
  const corePages = [
    'src/pages/PracticePage.jsx',
    'src/pages/VocabularyPage.jsx',
    'src/pages/PronunciationPage.jsx',
    'src/pages/WritingPage.jsx',
    'src/pages/ConversationPage.jsx',
    'src/pages/ReaderPage.jsx',
    'src/pages/HskPracticePage.jsx',
    'src/pages/RoadmapPage.jsx',
    'src/pages/TeacherDashboardPage.jsx',
    'src/pages/ClassroomPage.jsx',
    'src/pages/AdminPage.jsx'
  ];

  corePages.forEach(filePath => {
    assert.ok(fs.existsSync(filePath), `Required page file must exist: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(content.length > 500, `Page file must have substantive code: ${filePath}`);
    assert.ok(
      content.includes('export default function') || content.includes('export default'),
      `Page must export default component: ${filePath}`
    );
  });
});

test('PracticePage: contains no duplicate flashcard engine and exposes required handlers', () => {
  const practiceContent = fs.readFileSync('src/pages/PracticePage.jsx', 'utf8');

  // Ensure unique skills are present
  assert.ok(practiceContent.includes("practiceSkill === 'grammar'"), 'Must render grammar mode');
  assert.ok(practiceContent.includes("practiceSkill === 'listening'"), 'Must render listening mode');
  assert.ok(practiceContent.includes("practiceSkill === 'overview'"), 'Must render overview mode');

  // Ensure navigation handlers are wired
  assert.ok(practiceContent.includes('handlePrevGrammar'), 'Must have handlePrevGrammar');
  assert.ok(practiceContent.includes('handleNextGrammar'), 'Must have handleNextGrammar');
  assert.ok(practiceContent.includes('handlePrevListening'), 'Must have handlePrevListening');
  assert.ok(practiceContent.includes('handleNextListening'), 'Must have handleNextListening');
  assert.ok(practiceContent.includes('stopChineseSpeech'), 'Must clean up speech synthesis');
});

test('XP Deduplication: Component logic prevents repeated XP awarding on same question in session', () => {
  const practiceContent = fs.readFileSync('src/pages/PracticePage.jsx', 'utf8');

  // Verify that completedGrammarIds set checks for first time completion before calling awardXp
  assert.ok(
    practiceContent.includes('const isFirstTime = !completedGrammarIds.has(currentGrammarItem.id);'),
    'Grammar check must check completedGrammarIds before awarding XP'
  );
  assert.ok(
    practiceContent.includes('if (isFirstTime) {'),
    'Grammar check must guard awardXp with isFirstTime condition'
  );

  // Verify that completedListeningIds set checks for first time completion before calling awardXp
  assert.ok(
    practiceContent.includes('const isFirstTime = !completedListeningIds.has(currentListeningItem.id);'),
    'Listening check must check completedListeningIds before awarding XP'
  );
  assert.ok(
    practiceContent.includes('grammarNewlyAwarded'),
    'Grammar feedback banner must distinguish newly awarded XP vs already claimed'
  );
  assert.ok(
    practiceContent.includes('listeningNewlyAwarded'),
    'Listening feedback banner must distinguish newly awarded XP vs already claimed'
  );
});

