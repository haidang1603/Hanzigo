import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  createClassSession,
  verifySessionAccess,
  joinLiveSession,
  leaveLiveSession,
  endLiveSession,
  toggleRoomLock,
  toggleChatMute,
  raiseHand,
  lowerHand,
  allowStudentMic,
  revokeStudentMic,
  muteParticipant,
  muteAllParticipants,
  removeParticipant,
  sendSessionChatMessage,
  deleteSessionChatMessage,
  getSessionAttendanceReport,
  getSessionParticipants,
  getLiveTeachingState,
  setSessionActiveTool,
  updateLiveTeachingToolState,
  startLiveQuiz,
  submitQuizAnswer,
  endLiveQuiz,
  createPronunciationChallenge,
  submitPronunciationRecording,
  addVocabToTodayLesson,
  broadcastWhiteboardOperation,
  clearWhiteboard,
  submitGrammarAnswer,
  generateAILessonSummary,
  getSessionHistoryAndSummary,
  HANZI_BOARD_DICTIONARY
} from '../src/services/liveClassroomService.js';
import { 
  createClassroom,
  joinClassByCode
} from '../src/services/classroomService.js';

test('Live Classroom: Session creation and security validation', async () => {
  // 1. Create a class
  const classRes = await createClassroom({
    teacherId: 'teacher-live-owner',
    name: 'HSK 3 Live Masterclass',
    description: 'Lớp học trực tuyến',
    hskLevel: 'HSK 3'
  });
  assert.equal(classRes.success, true);
  const classroomId = classRes.classroom.id;

  // 2. Teacher creates a live session
  const sessionRes = await createClassSession({
    classroomId,
    teacherId: 'teacher-live-owner',
    title: 'Buổi 1: Luyện khẩu ngữ HSK 3'
  });
  assert.equal(sessionRes.success, true);
  assert.ok(sessionRes.session.id);
  assert.equal(sessionRes.session.status, 'live');
  assert.equal(sessionRes.session.max_capacity, 50);

  // 3. Unauthorized user (not enrolled in classroom) attempts to access via URL tampering
  const intruderUser = { uid: 'intruder-999', name: 'Hacker', role: 'student' };
  const accessRes = await verifySessionAccess(sessionRes.session.id, intruderUser);
  assert.equal(accessRes.allowed, false);
  assert.match(accessRes.reason, /chưa tham gia lớp học/);

  // 4. Enrolled student accesses session successfully
  const student = { uid: 'student-valid-1', name: 'Nguyễn Thu Trang', role: 'student' };
  const joinClassRes = await joinClassByCode(classRes.classroom.class_code, student);
  assert.equal(joinClassRes.success, true);

  const studentAccess = await verifySessionAccess(sessionRes.session.id, student);
  assert.equal(studentAccess.allowed, true);
  assert.equal(studentAccess.role, 'student');
});

test('Live Classroom: Room lock prevents late entry', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-lock-test',
    name: 'HSK Exam Room',
    hskLevel: 'HSK 4'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-lock-test',
    title: 'Khảo hạch giữa kỳ'
  });

  const student = { uid: 'stu-lock-1', name: 'Lê Văn Nam', role: 'student' };
  await joinClassByCode(classRes.classroom.class_code, student);

  // Lock room
  await toggleRoomLock(sesRes.session.id, 'teacher-lock-test', true);

  // Student attempts to join locked room
  const joinAttempt = await verifySessionAccess(sesRes.session.id, student);
  assert.equal(joinAttempt.allowed, false);
  assert.match(joinAttempt.reason, /tạm khóa/);

  // Unlock room
  await toggleRoomLock(sesRes.session.id, 'teacher-lock-test', false);
  const joinUnlocked = await verifySessionAccess(sesRes.session.id, student);
  assert.equal(joinUnlocked.allowed, true);
});

test('Live Classroom: Raise-Hand FIFO queue & mic grant/revoke lifecycle', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-queue-owner',
    name: 'Lớp phát âm chuẩn Bắc Kinh',
    hskLevel: 'HSK 1'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-queue-owner',
    title: 'Phát âm Thanh 1 và Thanh 4'
  });
  const sessionId = sesRes.session.id;

  // 3 students enroll and join live room
  const s1 = { uid: 'stu-q-1', name: 'Học viên A', role: 'student' };
  const s2 = { uid: 'stu-q-2', name: 'Học viên B', role: 'student' };
  const s3 = { uid: 'stu-q-3', name: 'Học viên C', role: 'student' };

  await joinClassByCode(classRes.classroom.class_code, s1);
  await joinClassByCode(classRes.classroom.class_code, s2);
  await joinClassByCode(classRes.classroom.class_code, s3);

  await joinLiveSession(sessionId, s1);
  await joinLiveSession(sessionId, s2);
  await joinLiveSession(sessionId, s3);

  // Students raise hands in order: A first, then B, then C
  await raiseHand(sessionId, 'stu-q-1');
  await new Promise(r => setTimeout(r, 10));
  await raiseHand(sessionId, 'stu-q-2');
  await new Promise(r => setTimeout(r, 10));
  await raiseHand(sessionId, 'stu-q-3');

  let participants = await getSessionParticipants(sessionId);
  let handQueue = participants.filter(p => p.hand_raised);
  assert.equal(handQueue.length, 3);
  assert.equal(handQueue[0].user_id, 'stu-q-1');
  assert.equal(handQueue[1].user_id, 'stu-q-2');
  assert.equal(handQueue[2].user_id, 'stu-q-3');

  // Teacher allows Student A to speak
  await allowStudentMic(sessionId, 'teacher-queue-owner', 'stu-q-1');
  participants = await getSessionParticipants(sessionId);
  const partA = participants.find(p => p.user_id === 'stu-q-1');
  assert.equal(partA.is_mic_allowed, true);
  assert.equal(partA.hand_raised, false); // hand is lowered when mic granted

  // Teacher mutes and revokes Student A
  await revokeStudentMic(sessionId, 'teacher-queue-owner', 'stu-q-1');
  participants = await getSessionParticipants(sessionId);
  assert.equal(participants.find(p => p.user_id === 'stu-q-1').is_mic_allowed, false);
});

test('Live Classroom: Chat and teacher moderation controls', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-chat-owner',
    name: 'HSK 2 Giao tiếp',
    hskLevel: 'HSK 2'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-chat-owner',
    title: 'Chat Test'
  });
  const sessionId = sesRes.session.id;

  const teacher = { uid: 'teacher-chat-owner', name: 'Cô Lan', role: 'teacher' };
  const student = { uid: 'stu-chat-1', name: 'Minh', role: 'student' };

  // Student sends message
  const m1 = await sendSessionChatMessage(sessionId, student, '老师好! Em đã vào lớp.');
  assert.equal(m1.success, true);
  assert.equal(m1.message.sender_role, 'student');

  // Teacher sends message
  const m2 = await sendSessionChatMessage(sessionId, teacher, 'Chào cả lớp, chúng ta bắt đầu nhé.');
  assert.equal(m2.success, true);
  assert.equal(m2.message.sender_role, 'teacher');

  // Teacher deletes student's message (moderation)
  const delRes = await deleteSessionChatMessage(sessionId, teacher.uid, m1.message.id);
  assert.equal(delRes.success, true);

  // Teacher mutes chat
  await toggleChatMute(sessionId, teacher.uid, true);

  // Student tries to send while chat is muted -> blocked!
  const blockedMsg = await sendSessionChatMessage(sessionId, student, 'Chat được không ạ?');
  assert.equal(blockedMsg.success, false);
  assert.match(blockedMsg.error, /khóa chat/);

  // Teacher can still send while chat is muted
  const teacherPrivilegedMsg = await sendSessionChatMessage(sessionId, teacher, 'Thông báo quan trọng');
  assert.equal(teacherPrivilegedMsg.success, true);
});

test('Live Classroom: Scale Acceptance Test (1 Teacher + 5, 10, up to 35-50 participants without Mesh)', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-scale-sfu',
    name: 'Phòng học Quy mô lớn HSK SFU',
    hskLevel: 'HSK 3',
    maxStudents: 50
  });
  const classroomId = classRes.classroom.id;

  const sesRes = await createClassSession({
    classroomId,
    teacherId: 'teacher-scale-sfu',
    title: 'Đại giảng đường HSK 3 (50 học viên)'
  });
  const sessionId = sesRes.session.id;

  const teacher = { uid: 'teacher-scale-sfu', name: 'Thầy Vương', role: 'teacher' };
  const teacherJoin = await joinLiveSession(sessionId, teacher);
  assert.equal(teacherJoin.success, true);

  // 1. PHASE A: 1 Teacher + 5 Students
  for (let i = 1; i <= 5; i++) {
    const s = { uid: `scale-stu-${i}`, name: `Học viên ${i}`, role: 'student' };
    await joinClassByCode(classRes.classroom.class_code, s);
    const j = await joinLiveSession(sessionId, s);
    assert.equal(j.success, true);
  }
  let p5 = await getSessionParticipants(sessionId);
  assert.equal(p5.length, 6); // 1 teacher + 5 students

  // 2. PHASE B: Expand to 1 Teacher + 10 Students
  for (let i = 6; i <= 10; i++) {
    const s = { uid: `scale-stu-${i}`, name: `Học viên ${i}`, role: 'student' };
    await joinClassByCode(classRes.classroom.class_code, s);
    const j = await joinLiveSession(sessionId, s);
    assert.equal(j.success, true);
  }
  let p10 = await getSessionParticipants(sessionId);
  assert.equal(p10.length, 11); // 1 teacher + 10 students

  // 3. PHASE C: High-Capacity Simulation to 35-50 participants
  for (let i = 11; i <= 45; i++) {
    const s = { uid: `scale-stu-${i}`, name: `Học viên ${i}`, role: 'student' };
    await joinClassByCode(classRes.classroom.class_code, s);
    const j = await joinLiveSession(sessionId, s);
    assert.equal(j.success, true);
  }

  const p46 = await getSessionParticipants(sessionId);
  // 1 teacher + 45 students = 46 participants
  assert.equal(p46.length, 46);

  // Verify SFU stream economics:
  // In a mesh network, 46 participants would require 46 * 45 = 2,070 connections!
  // In our SFU classroom architecture, only 1 presenter broadcasts downstream O(N).
  const publisherCount = p46.filter(p => p.role === 'teacher').length;
  assert.equal(publisherCount, 1);

  // Teacher mutes all 45 students with 1 command
  await muteAllParticipants(sessionId, teacher.uid);
  const activeStudentsAfterMute = await getSessionParticipants(sessionId);
  const unmutedStudentCount = activeStudentsAfterMute.filter(p => p.role === 'student' && p.mic_enabled).length;
  assert.equal(unmutedStudentCount, 0);

  // 4. End session and verify attendance report calculation
  await endLiveSession(sessionId, teacher.uid);
  const report = await getSessionAttendanceReport(sessionId, teacher.uid);
  assert.equal(report.success, true);
  assert.equal(report.totalEnrolled, 45);
  assert.equal(report.presentCount + report.lateCount, 45);
  assert.equal(report.absentCount, 0);
});

// =========================================================================
// LIVE CHINESE TEACHING ENVIRONMENT TESTS
// =========================================================================

test('Live Chinese Teaching: Teacher controls active tool and syncs state', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-tool-ctrl',
    name: 'HSK 2 Khẩu ngữ trực tuyến',
    hskLevel: 'HSK 2'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-tool-ctrl',
    title: 'Buổi 2: Đại từ nghi vấn'
  });
  const sessionId = sesRes.session.id;

  // 1. Check initial default teaching state (default is hanzi)
  const initialState = await getLiveTeachingState(sessionId);
  assert.equal(initialState.active_tool, 'hanzi');
  assert.ok(initialState.hanzi_state);

  // 2. Student cannot switch tool (permission denied)
  const studentFail = await setSessionActiveTool(sessionId, 'student-unauth', 'quiz');
  assert.equal(studentFail.success, false);
  assert.match(studentFail.error, /Chỉ giáo viên/);

  // 3. Teacher switches tool to 'quiz'
  const switchRes = await setSessionActiveTool(sessionId, 'teacher-tool-ctrl', 'quiz');
  assert.equal(switchRes.success, true);
  assert.equal(switchRes.active_tool, 'quiz');

  // Verify state persisted
  const updatedState = await getLiveTeachingState(sessionId);
  assert.equal(updatedState.active_tool, 'quiz');
  assert.ok(updatedState.tools_used.includes('quiz'));

  // 4. Invalid tool key rejected
  const invalidSwitch = await setSessionActiveTool(sessionId, 'teacher-tool-ctrl', 'invalid-tool-xyz');
  assert.equal(invalidSwitch.success, false);
});

test('Live Chinese Teaching: Interactive Hanzi Board dictionary and glyph update', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-hanzi-test',
    name: 'Nhập môn chữ Hán',
    hskLevel: 'HSK 1'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-hanzi-test',
    title: 'Học chữ Hán tương tác'
  });
  const sessionId = sesRes.session.id;

  // Verify built-in dictionary contains key character "学"
  assert.ok(HANZI_BOARD_DICTIONARY['学']);
  assert.equal(HANZI_BOARD_DICTIONARY['学'].char, '学');
  assert.equal(HANZI_BOARD_DICTIONARY['学'].pinyin, 'xué');
  assert.equal(HANZI_BOARD_DICTIONARY['学'].strokesCount, 8);
  assert.ok(HANZI_BOARD_DICTIONARY['学'].exampleSentence);

  // Teacher clicks character "中" to project
  const projectedChar = HANZI_BOARD_DICTIONARY['中'];
  await updateLiveTeachingToolState(sessionId, 'teacher-hanzi-test', 'hanzi', {
    activeChar: '中',
    charData: projectedChar
  });

  const state = await getLiveTeachingState(sessionId);
  assert.equal(state.hanzi_state.activeChar, '中');
  assert.equal(state.hanzi_state.charData.char, '中');
  assert.equal(state.hanzi_state.charData.pinyin, 'zhōng');
});

test('Live Chinese Teaching: Live Quiz real-time distribution and accuracy', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-quiz-test',
    name: 'HSK 3 Luyện thi',
    hskLevel: 'HSK 3'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-quiz-test',
    title: 'Luyện thi Mock Test'
  });
  const sessionId = sesRes.session.id;

  // 1. Teacher starts Quiz: “中文” nghĩa là gì? (Correct answer is option 1: Chinese)
  const quizRes = await startLiveQuiz(sessionId, 'teacher-quiz-test', {
    question: '“中文” nghĩa là gì?',
    options: ['English', 'Chinese', 'Korean', 'Japanese'],
    correctAnswer: 1
  });
  assert.equal(quizRes.success, true);
  assert.equal(quizRes.quiz.status, 'active');

  // 2. 4 students submit answers: 3 pick B (correct), 1 picks A (incorrect)
  const s1 = { uid: 'quiz-stu-1', name: 'Trần Bình', role: 'student' };
  const s2 = { uid: 'quiz-stu-2', name: 'Lê Hoa', role: 'student' };
  const s3 = { uid: 'quiz-stu-3', name: 'Phạm Minh', role: 'student' };
  const s4 = { uid: 'quiz-stu-4', name: 'Đặng Tuấn', role: 'student' };

  const sub1 = await submitQuizAnswer(sessionId, s1, quizRes.quiz.id, 1); // B: correct
  const sub2 = await submitQuizAnswer(sessionId, s2, quizRes.quiz.id, 1); // B: correct
  const sub3 = await submitQuizAnswer(sessionId, s3, quizRes.quiz.id, 1); // B: correct
  const sub4 = await submitQuizAnswer(sessionId, s4, quizRes.quiz.id, 0); // A: wrong

  assert.equal(sub1.isCorrect, true);
  assert.equal(sub4.isCorrect, false);

  // Verify real-time distribution: A: 1, B: 3, C: 0, D: 0
  assert.deepEqual(sub4.distribution, [1, 3, 0, 0]);
  assert.equal(sub4.totalVotes, 4);
  assert.equal(sub4.accuracyPercentage, 75); // 3 out of 4 = 75%

  // 3. Teacher ends Quiz
  const endRes = await endLiveQuiz(sessionId, 'teacher-quiz-test', quizRes.quiz.id);
  assert.equal(endRes.success, true);
  assert.equal(endRes.quiz.status, 'ended');
  assert.equal(endRes.quiz.accuracyPercentage, 75);
});

test('Live Chinese Teaching: Authentic Pronunciation challenge and ranking', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-pron-test',
    name: 'Khẩu ngữ chuẩn Bắc Kinh',
    hskLevel: 'HSK 1'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-pron-test',
    title: 'Luyện âm thanh điệu'
  });
  const sessionId = sesRes.session.id;

  // 1. Teacher creates Challenge: 请说：我喜欢学习中文。
  const chalRes = await createPronunciationChallenge(sessionId, 'teacher-pron-test', {
    prompt: '请说：我喜欢学习中文。',
    targetHanzi: '我喜欢学习中文。',
    targetPinyin: 'wǒ xǐhuan xuéxí zhōngwén.'
  });
  assert.equal(chalRes.success, true);

  // 2. Student 1 records excellent match
  const s1 = { uid: 'p-stu-1', name: 'Học viên Giỏi', role: 'student' };
  const rec1 = await submitPronunciationRecording(sessionId, s1, chalRes.challenge.id, {
    spokenTranscript: '我喜欢学习中文',
    audioDurationMs: 2500,
    audioEnergyRms: 0.18
  });
  assert.equal(rec1.success, true);
  assert.ok(rec1.diagnostic.overall >= 80);
  assert.equal(rec1.diagnostic.accuracyScore, 100);

  // 3. Student 2 records partial match
  const s2 = { uid: 'p-stu-2', name: 'Học viên Khá', role: 'student' };
  const rec2 = await submitPronunciationRecording(sessionId, s2, chalRes.challenge.id, {
    spokenTranscript: '我喜欢',
    audioDurationMs: 1400,
    audioEnergyRms: 0.12
  });
  assert.equal(rec2.success, true);
  assert.ok(rec2.diagnostic.overall < rec1.diagnostic.overall);

  // 4. Submissions are sorted descending by score (Top scorer first, no random fake score)
  assert.equal(rec2.submissions[0].userId, 'p-stu-1');
  assert.ok(rec2.submissions[0].overallScore >= rec2.submissions[1].overallScore);
});

test('Live Chinese Teaching: Live Vocabulary to Today\'s Lesson accumulation', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-vocab-test',
    name: 'Lớp từ vựng HSK',
    hskLevel: 'HSK 2'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-vocab-test',
    title: 'Từ vựng chủ đề Trường học'
  });
  const sessionId = sesRes.session.id;

  const word1 = {
    hanzi: '学习',
    pinyin: 'xuéxí',
    meaning: 'Học tập'
  };
  const word2 = {
    hanzi: '老师',
    pinyin: 'lǎoshī',
    meaning: 'Giáo viên'
  };

  // Add word 1
  const res1 = await addVocabToTodayLesson(sessionId, 'teacher-vocab-test', word1);
  assert.equal(res1.success, true);
  assert.equal(res1.todayLessonVocab.length, 1);

  // Add word 2
  const res2 = await addVocabToTodayLesson(sessionId, 'teacher-vocab-test', word2);
  assert.equal(res2.todayLessonVocab.length, 2);

  // Re-adding duplicate word doesn't duplicate
  const resDup = await addVocabToTodayLesson(sessionId, 'teacher-vocab-test', word1);
  assert.equal(resDup.todayLessonVocab.length, 2);
});

test('Live Chinese Teaching: Vector Whiteboard operations and clean sync', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-wb-test',
    name: 'Lớp Whiteboard',
    hskLevel: 'HSK 1'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-wb-test',
    title: 'Bảng vẽ trực tuyến'
  });
  const sessionId = sesRes.session.id;

  const teacher = { uid: 'teacher-wb-test', name: 'Giáo viên', role: 'teacher' };

  // 1. Broadcast vector pen stroke
  const penOp = {
    tool: 'pen',
    color: '#F4B942',
    size: 4,
    points: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }]
  };
  const opRes1 = await broadcastWhiteboardOperation(sessionId, teacher, penOp);
  assert.equal(opRes1.success, true);
  assert.ok(opRes1.op.id);

  // 2. Broadcast vector circle shape
  const circleOp = {
    tool: 'circle',
    color: '#E85D3F',
    size: 2,
    x1: 50,
    y1: 50,
    x2: 80,
    y2: 80
  };
  const opRes2 = await broadcastWhiteboardOperation(sessionId, teacher, circleOp);
  assert.equal(opRes2.success, true);

  let state = await getLiveTeachingState(sessionId);
  assert.equal(state.whiteboard_state.operations.length, 2);

  // 3. Clear whiteboard
  await clearWhiteboard(sessionId, teacher);
  state = await getLiveTeachingState(sessionId);
  assert.equal(state.whiteboard_state.operations.length, 0);
});

test('Live Chinese Teaching: Grammar Board syntax order verification', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-gram-test',
    name: 'Lớp Ngữ pháp',
    hskLevel: 'HSK 1'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-gram-test',
    title: 'Cấu trúc SVO'
  });
  const sessionId = sesRes.session.id;

  const student = { uid: 'stu-gram-1', name: 'Học viên A', role: 'student' };

  // Correct order is ['我', '喜欢', '学习', '中文']
  const wrongOrder = ['喜欢', '我', '中文', '学习'];
  const correctOrder = ['我', '喜欢', '学习', '中文'];

  const wrongRes = await submitGrammarAnswer(sessionId, student, wrongOrder);
  assert.equal(wrongRes.isCorrect, false);

  const correctRes = await submitGrammarAnswer(sessionId, student, correctOrder);
  assert.equal(correctRes.isCorrect, true);
});

test('Live Chinese Teaching: Session History and AI Lesson Summary generation', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-summary-test',
    name: 'Lớp Tổng kết AI',
    hskLevel: 'HSK 2'
  });
  const sesRes = await createClassSession({
    classroomId: classRes.classroom.id,
    teacherId: 'teacher-summary-test',
    title: 'Buổi học HSK 2 với AI Lesson Summary'
  });
  const sessionId = sesRes.session.id;

  // Add vocabulary and end session
  await addVocabToTodayLesson(sessionId, 'teacher-summary-test', {
    hanzi: '学习',
    pinyin: 'xuéxí',
    meaning: 'Học tập'
  });

  await endLiveSession(sessionId, 'teacher-summary-test');

  // Generate and verify AI Lesson Summary
  const summaryRes = await generateAILessonSummary(sessionId);
  assert.equal(summaryRes.success, true);
  assert.ok(summaryRes.summary);
  assert.equal(summaryRes.summary.title, 'Buổi học HSK 2 với AI Lesson Summary');
  assert.ok(summaryRes.summary.weakAreas.length > 0);
  assert.ok(summaryRes.summary.recommendedPractice.length > 0);
  assert.equal(summaryRes.summary.vocabularyCovered.length, 1);
  assert.equal(summaryRes.summary.vocabularyCovered[0].hanzi, '学习');

  // Verify getSessionHistoryAndSummary retrieves cached summary
  const cached = await getSessionHistoryAndSummary(sessionId);
  assert.equal(cached.sessionId, sessionId);
});
