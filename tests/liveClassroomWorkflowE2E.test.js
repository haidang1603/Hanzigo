import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createClassSession,
  joinLiveSession,
  leaveLiveSession,
  endLiveSession,
  getSessionById,
  verifySessionAccess,
  getSessionParticipants,
  raiseHand,
  lowerHand,
  allowStudentMic,
  revokeStudentMic,
  muteAllParticipants,
  setSessionActiveTool,
  setHanziViewMode,
  updateSideHanziBoard,
  linkHanziToStrokeBoard,
  linkVocabToQuiz,
  linkPinyinToPronunciationChallenge,
  linkVocabToGrammar,
  linkListeningToGrammar,
  toggleWhiteboardStudentDrawing,
  broadcastWhiteboardOperation,
  getLiveTeachingState,
  startLiveQuiz,
  submitQuizAnswer,
  endLiveQuiz,
  startListeningActivity,
  submitListeningAnswer,
  endListeningActivity,
  submitPronunciationRecording,
  submitGrammarAnswer,
  generateAILessonSummary,
  getSessionHistoryAndSummary,
  recordStudentLearningOutcome,
  getSessionLearningOutcomes,
  liveEventBus
} from '../src/services/liveClassroomService.js';

import { createClassroom, joinClassByCode } from '../src/services/classroomService.js';

// Polyfill localStorage in Node test runner
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

function resetTestStore() {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
}

test('SCENARIO A: Giảng chữ Hán (Hanzi -> Stroke Order -> Side Board -> Vocabulary -> Quiz)', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-a', uid: 'teacher-a', name: 'Thầy Vương', role: 'teacher' };
  const student = { id: 'student-a', uid: 'student-a', name: 'Học viên An', role: 'student' };

  // 1. Create class & session
  const clsRes = await createClassroom({
    name: 'Lớp HSK 1 Chuyên sâu',
    teacherId: teacher.id,
    teacherName: teacher.name,
    hskLevel: 'HSK 1'
  });
  assert.ok(clsRes.success);
  const classId = clsRes.classroom.id;

  // Student enrolls into class
  const enrollRes = await joinClassByCode(clsRes.classroom.class_code, student);
  assert.ok(enrollRes.success);

  const sesRes = await createClassSession({
    classroomId: classId,
    teacherId: teacher.id,
    title: 'Bài 1: Chữ Hán căn bản'
  });
  assert.ok(sesRes.success);
  const sessionId = sesRes.session.id;

  const teacherJoin = await joinLiveSession(sessionId, teacher);
  assert.ok(teacherJoin.success);
  const studentJoin = await joinLiveSession(sessionId, student);
  assert.ok(studentJoin.success);

  // 2. Teacher links Hanzi to Stroke Order Board
  const strokeRes = await linkHanziToStrokeBoard(sessionId, teacher.id, '学');
  assert.ok(strokeRes.success);
  assert.equal(strokeRes.strokeState.char, '学');

  const state1 = await getLiveTeachingState(sessionId);
  assert.equal(state1.active_tool, 'hanzi');
  assert.equal(state1.hanzi_view_mode, 'stroke');
  assert.equal(state1.stroke_state.char, '学');

  // 3. Teacher updates Side Hanzi Board
  const sideRes = await updateSideHanziBoard(sessionId, teacher.id, {
    char: '学',
    pinyin: 'xué',
    meaning: 'Học tập'
  });
  assert.ok(sideRes.success);
  assert.equal(sideRes.sideBoard.char, '学');

  const state2 = await getLiveTeachingState(sessionId);
  assert.equal(state2.side_board_state.char, '学');
  assert.equal(state2.side_board_state.meaning, 'Học tập');

  // 4. Teacher creates Quiz from vocabulary bridge
  const vocabItem = {
    hanzi: '学习',
    pinyin: 'xuéxí',
    meaning: 'Học tập, nghiên cứu'
  };
  const quizBridgeRes = await linkVocabToQuiz(sessionId, teacher.id, vocabItem);
  assert.ok(quizBridgeRes.success);
  assert.equal(quizBridgeRes.quiz.status, 'active');
  assert.ok(quizBridgeRes.quiz.question.includes('学习'));

  const state3 = await getLiveTeachingState(sessionId);
  assert.equal(state3.active_tool, 'quiz');
  assert.equal(state3.quiz_state.correctAnswer, 1);
  assert.equal(state3.quiz_state.options[1], 'Học tập, nghiên cứu');

  // Student submits correct answer
  const answerRes = await submitQuizAnswer(sessionId, student, state3.quiz_state.id, 1);
  assert.ok(answerRes.success);
  assert.equal(answerRes.isCorrect, true);
  assert.equal(answerRes.accuracyPercentage, 100);

  // Verify learning outcome persistence
  const outcomes = await getSessionLearningOutcomes(sessionId, student.id);
  assert.ok(outcomes.length > 0);
  assert.equal(outcomes[0].activity_type, 'quiz');
  assert.equal(outcomes[0].score, 100);
});

test('SCENARIO B: Luyện phát âm (PinyinToneBoard -> PronunciationPracticeBoard)', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-b', uid: 'teacher-b', name: 'Cô Lý', role: 'teacher' };
  const student = { id: 'student-b', uid: 'student-b', name: 'Học viên Bình', role: 'student' };

  const clsRes = await createClassroom({
    name: 'Lớp Luyện âm Pinyin',
    teacherId: teacher.id,
    teacherName: teacher.name,
    hskLevel: 'HSK 1'
  });
  await joinClassByCode(clsRes.classroom.class_code, student);

  const sesRes = await createClassSession({
    classroomId: clsRes.classroom.id,
    teacherId: teacher.id,
    title: 'Phát âm Thanh điệu'
  });
  const sessionId = sesRes.session.id;

  await joinLiveSession(sessionId, teacher);
  await joinLiveSession(sessionId, student);

  // 1. Teacher bridges Pinyin into Pronunciation Challenge
  const bridgeRes = await linkPinyinToPronunciationChallenge(sessionId, teacher.id, {
    text: '你好',
    pinyin: 'nǐ hǎo'
  });
  assert.ok(bridgeRes.success);

  const tState = await getLiveTeachingState(sessionId);
  assert.equal(tState.active_tool, 'pronunciation');
  assert.equal(tState.pronunciation_state.activeChallenge.targetHanzi, '你好');

  // 2. Student records voice submission
  const subRes = await submitPronunciationRecording(sessionId, student, tState.pronunciation_state.activeChallenge.id, {
    targetHanzi: '你好',
    targetPinyin: 'nǐ hǎo',
    spokenTranscript: '你好',
    audioDurationMs: 1400,
    audioEnergyRms: 0.18
  });
  assert.ok(subRes.success);
  assert.ok(subRes.diagnostic.overall >= 70);

  // 3. Verify learning outcome was saved for student
  const outcomes = await getSessionLearningOutcomes(sessionId, student.id);
  const pronOutcome = outcomes.find(o => o.activity_type === 'pronunciation');
  assert.ok(pronOutcome, 'Pronunciation outcome must be stored');
  assert.equal(pronOutcome.status, 'passed');
});

test('SCENARIO C: Luyện nghe và ngữ pháp (ListeningActivityBoard -> GrammarBoard)', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-c', uid: 'teacher-c', name: 'Thầy Hưng', role: 'teacher' };
  const student = { id: 'student-c', uid: 'student-c', name: 'Học viên Chi', role: 'student' };

  const cls = await createClassroom({ name: 'Lớp Nghe hiểu', teacherId: teacher.id, teacherName: teacher.name });
  await joinClassByCode(cls.classroom.class_code, student);
  const ses = await createClassSession({ classroomId: cls.classroom.id, teacherId: teacher.id, title: 'Luyện nghe' });
  const sessionId = ses.session.id;

  await joinLiveSession(sessionId, teacher);
  await joinLiveSession(sessionId, student);

  // 1. Start listening activity
  const listStart = await startListeningActivity(sessionId, teacher.id, {
    audioText: '我喜欢学习中文。',
    audioPinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.',
    question: 'Người nói thích làm gì?',
    options: ['Học tiếng Trung', 'Đi bơi', 'Ăn cơm', 'Ngủ'],
    correctAnswer: 0
  });
  assert.ok(listStart.success);

  // 2. Student submits listening answer
  const listAnswer = await submitListeningAnswer(sessionId, student, listStart.listening.id, 0);
  assert.ok(listAnswer.success);
  assert.equal(listAnswer.isCorrect, true);

  // 3. Teacher bridges listening text to GrammarBoard for breakdown
  const grammarBridge = await linkListeningToGrammar(sessionId, teacher.id, {
    audioText: '我喜欢学习中文。',
    audioPinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.'
  });
  assert.ok(grammarBridge.success);

  const tState = await getLiveTeachingState(sessionId);
  assert.equal(tState.active_tool, 'grammar');
  assert.ok(tState.grammar_state.pattern.includes('Chữa bài'));

  // 4. Student arranges grammar syntax exercise
  const grammarRes = await submitGrammarAnswer(sessionId, student, tState.grammar_state.miniExercise.correct);
  assert.ok(grammarRes.success);
  assert.equal(grammarRes.isCorrect, true);

  // 5. Verify outcomes
  const outcomes = await getSessionLearningOutcomes(sessionId, student.id);
  assert.ok(outcomes.some(o => o.activity_type === 'listening'));
  assert.ok(outcomes.some(o => o.activity_type === 'grammar'));
});

test('SCENARIO D: Quản lý lớp & Whiteboard permissions (FIFO hand-raise, Mic control, Drawing lock)', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-d', uid: 'teacher-d', name: 'Cô Mai', role: 'teacher' };
  const s1 = { id: 's-1', uid: 's-1', name: 'HS 1', role: 'student' };
  const s2 = { id: 's-2', uid: 's-2', name: 'HS 2', role: 'student' };

  const cls = await createClassroom({ name: 'Lớp Quản lý', teacherId: teacher.id, teacherName: teacher.name });
  await joinClassByCode(cls.classroom.class_code, s1);
  await joinClassByCode(cls.classroom.class_code, s2);
  const ses = await createClassSession({ classroomId: cls.classroom.id, teacherId: teacher.id, title: 'Live Control' });
  const sessionId = ses.session.id;

  await joinLiveSession(sessionId, teacher);
  await joinLiveSession(sessionId, s1);
  await joinLiveSession(sessionId, s2);

  // 1. FIFO Hand raise
  await raiseHand(sessionId, s1.id);
  await new Promise(r => setTimeout(r, 10)); // tiny delay to ensure distinct timestamp
  await raiseHand(sessionId, s2.id);

  let parts = await getSessionParticipants(sessionId);
  const queue = parts
    .filter(p => p.role === 'student' && p.hand_raised)
    .sort((a, b) => new Date(a.hand_raised_at) - new Date(b.hand_raised_at));

  assert.equal(queue[0].user_id, s1.id, 's1 must be first in FIFO queue');
  assert.equal(queue[1].user_id, s2.id, 's2 must be second in FIFO queue');

  // 2. Allow and Revoke mic
  await allowStudentMic(sessionId, teacher.id, s1.id);
  parts = await getSessionParticipants(sessionId);
  assert.equal(parts.find(p => p.user_id === s1.id).is_mic_allowed, true);

  await revokeStudentMic(sessionId, teacher.id, s1.id);
  parts = await getSessionParticipants(sessionId);
  assert.equal(parts.find(p => p.user_id === s1.id).is_mic_allowed, false);

  // 3. Mute All
  await allowStudentMic(sessionId, teacher.id, s2.id);
  await muteAllParticipants(sessionId, teacher.id);
  parts = await getSessionParticipants(sessionId);
  assert.equal(parts.find(p => p.user_id === s2.id).is_mic_allowed, false);

  // 4. Whiteboard drawing permissions
  const permRes1 = await toggleWhiteboardStudentDrawing(sessionId, teacher.id, false);
  assert.equal(permRes1.permissions.studentDrawingAllowed, false);

  const permRes2 = await toggleWhiteboardStudentDrawing(sessionId, teacher.id, true);
  assert.equal(permRes2.permissions.studentDrawingAllowed, true);
});

test('SCENARIO E: Kết thúc buổi học (Attendance without double-count & AI Session Summary)', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-e', uid: 'teacher-e', name: 'Thầy Tuấn', role: 'teacher' };
  const student = { id: 'student-e', uid: 'student-e', name: 'HS Em', role: 'student' };

  const cls = await createClassroom({ name: 'Lớp Tổng kết', teacherId: teacher.id, teacherName: teacher.name });
  await joinClassByCode(cls.classroom.class_code, student);
  const ses = await createClassSession({ classroomId: cls.classroom.id, teacherId: teacher.id, title: 'Buổi 1' });
  const sessionId = ses.session.id;

  await joinLiveSession(sessionId, teacher);
  await joinLiveSession(sessionId, student);

  // Teacher links a quiz
  await linkVocabToQuiz(sessionId, teacher.id, { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Thầy cô giáo' });
  const tState = await getLiveTeachingState(sessionId);
  await submitQuizAnswer(sessionId, student, tState.quiz_state.id, 1);

  // End session
  const endRes = await endLiveSession(sessionId, teacher.id);
  assert.ok(endRes.success);
  assert.equal(endRes.session.status, 'ended');

  // Verify participants marked left
  const parts = await getSessionParticipants(sessionId);
  assert.ok(parts.every(p => p.left_at !== null));

  // AI Session summary
  const summary = await getSessionHistoryAndSummary(sessionId);
  assert.ok(summary);
  assert.equal(summary.sessionId, sessionId);
  assert.ok(summary.quizResults.totalVotes > 0);
  assert.ok(Array.isArray(summary.recommendedPractice));
  assert.ok(summary.recommendedPractice.length > 0);
});

test('SCENARIO F: Reconnect & Resilience (Cumulative duration without duplication)', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-f', uid: 'teacher-f', name: 'Thầy Nam', role: 'teacher' };
  const student = { id: 'student-f', uid: 'student-f', name: 'Học viên F', role: 'student' };

  const cls = await createClassroom({ name: 'Lớp Reconnect', teacherId: teacher.id, teacherName: teacher.name });
  await joinClassByCode(cls.classroom.class_code, student);
  const ses = await createClassSession({ classroomId: cls.classroom.id, teacherId: teacher.id, title: 'Mạng yếu' });
  const sessionId = ses.session.id;

  await joinLiveSession(sessionId, teacher);

  // 1. First join
  const join1 = await joinLiveSession(sessionId, student);
  assert.ok(join1.success);
  const firstJoinedAt = join1.participant.joined_at;

  // 2. Disconnect / Leave
  await leaveLiveSession(sessionId, student.id);
  let parts = await getSessionParticipants(sessionId);
  const part1 = parts.find(p => p.user_id === student.id);
  assert.ok(part1.left_at);

  // 3. Reconnect / Join again
  const join2 = await joinLiveSession(sessionId, student);
  assert.ok(join2.success);
  assert.equal(join2.participant.joined_at, firstJoinedAt, 'Original joined_at must be preserved on reconnect');
  assert.ok(join2.participant.reconnected_at, 'reconnected_at must be populated on reconnect');
  assert.equal(join2.participant.left_at, null, 'left_at must be cleared on reconnect');

  // 4. End session
  await endLiveSession(sessionId, teacher.id);
  parts = await getSessionParticipants(sessionId);
  const finalPart = parts.find(p => p.user_id === student.id);
  assert.ok(typeof finalPart.total_duration_seconds === 'number');
  assert.ok(!isNaN(finalPart.total_duration_seconds));
});

test('SCENARIO G: Security & Unauthorized Role Rejection', async () => {
  resetTestStore();

  const teacher = { id: 'teacher-owner', uid: 'teacher-owner', name: 'Giáo viên Sở hữu', role: 'teacher' };
  const stranger = { id: 'user-stranger', uid: 'user-stranger', name: 'Kẻ giả mạo', role: 'student' };

  const cls = await createClassroom({ name: 'Lớp Bảo mật', teacherId: teacher.id, teacherName: teacher.name });
  const ses = await createClassSession({ classroomId: cls.classroom.id, teacherId: teacher.id, title: 'Bảo mật' });
  const sessionId = ses.session.id;

  // 1. Stranger student not enrolled in class should be denied or identified as unauthorized
  const strangerAccess = await verifySessionAccess(sessionId, stranger);
  assert.equal(strangerAccess.allowed, false, 'Unenrolled student must be rejected from live session');

  // 2. Non-teacher cannot end session
  const illegalEnd = await endLiveSession(sessionId, stranger.id);
  assert.equal(illegalEnd.success, false, 'Student cannot end session');

  // 3. Fake session ID handling
  const fakeAccess = await verifySessionAccess('fake-session-999', teacher);
  assert.equal(fakeAccess.allowed, false);
});
