import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ensureSimulationSeed,
  getClassroomsForTeacher,
  getClassroomsForStudent,
  createClassroom,
  lookupClassroomByCode,
  joinClassByCode,
  deleteClassroom
} from '../src/services/classroomService.js';

test('Classroom Persistence: Default foundational classes are never lost or suppressed', async () => {
  // 1. Initial teacher classrooms should contain at least 1 classroom
  const teacherClasses = await getClassroomsForTeacher('user_teacher_demo');
  assert.ok(teacherClasses.length >= 1, 'Teacher must see at least 1 classroom initially');
  const hsk1 = teacherClasses.find(c => c.id === 'cls-hsk1-foundation' || c.class_code === 'HZG-7K2P9');
  assert.ok(hsk1, 'Foundational HSK 1 classroom must be present');

  // 2. Initial student classrooms should not be blank
  const studentClasses = await getClassroomsForStudent('user_guest');
  assert.ok(studentClasses.length >= 1, 'Student portal must never be empty by default');
  assert.equal(studentClasses[0].name, 'HSK 1 - Nhập môn Giao tiếp & Phát âm');

  // 3. Lookup default code directly
  const lookup1 = await lookupClassroomByCode('HZG-7K2P9');
  assert.ok(lookup1, 'Should find HSK 1 class by full code');
  assert.equal(lookup1.class_code, 'HZG-7K2P9');

  const lookupShort = await lookupClassroomByCode('7K2P9');
  assert.ok(lookupShort, 'Should find HSK 1 class by short code without prefix');

  const lookup2 = await lookupClassroomByCode('HZG-9M4X2');
  assert.ok(lookup2, 'Should find HSK 2 class by code');
});

test('Classroom Join Workflow: Newly created classroom can be looked up and joined by code', async () => {
  // 1. Teacher creates a new classroom
  const created = await createClassroom({
    teacherId: 'teacher-demo-new',
    name: 'Lớp Luyện Đề HSK 4 Đột Phá',
    description: 'Chinh phục 600 từ vựng và cấu trúc ngữ pháp',
    hskLevel: 'HSK 4',
    maxStudents: 25
  });

  assert.equal(created.success, true);
  assert.ok(created.classroom.class_code, 'Must generate valid class code');
  const code = created.classroom.class_code;

  // 2. Lookup by code (with or without prefix, lower or upper case)
  const preview = await lookupClassroomByCode(code.toLowerCase());
  assert.ok(preview, 'Must find newly created class by code');
  assert.equal(preview.id, created.classroom.id);
  assert.equal(preview.name, 'Lớp Luyện Đề HSK 4 Đột Phá');

  // 3. Student joins using the code
  const studentUser = {
    uid: 'student-new-user-1',
    name: 'Phạm Thu Trang',
    email: 'thutrang@test.com',
    role: 'student'
  };

  const joinRes = await joinClassByCode(code, studentUser);
  assert.equal(joinRes.success, true, 'Student join must succeed');
  assert.equal(joinRes.classroom_id, created.classroom.id);

  // 4. Student enrolled list must now include this classroom
  const studentClasses = await getClassroomsForStudent('student-new-user-1');
  assert.ok(studentClasses.some(c => c.id === created.classroom.id), 'Student must have newly joined class in their list');

  // 5. Teacher must see the joined student in class members and all students list
  const { getClassMembers, getAllStudentsForTeacher } = await import('../src/services/classroomService.js');
  const classMembers = await getClassMembers(created.classroom.id);
  assert.ok(classMembers.some(m => m.student_name === 'Phạm Thu Trang'), 'Teacher must see joined student in class members list');

  const allTeacherStudents = await getAllStudentsForTeacher('teacher-demo-new');
  assert.ok(allTeacherStudents.some(s => s.student_name === 'Phạm Thu Trang'), 'Teacher must see student in all-students overview');

  // 6. Duplicate join is properly rejected
  const dupJoin = await joinClassByCode(code, studentUser);
  assert.equal(dupJoin.success, false);
  assert.match(dupJoin.error, /đã là thành viên/);
});

test('Classroom Join Workflow: Demo user can test entering code without self-block', async () => {
  const created = await createClassroom({
    teacherId: 'user_teacher_demo',
    name: 'Lớp Demo Tương Tác Trực Tuyến',
    hskLevel: 'HSK 2',
    maxStudents: 30
  });

  assert.equal(created.success, true);
  const code = created.classroom.class_code;

  // In demo mode where current user is guest or switched role, joining should not be blocked
  const demoStudent = {
    uid: 'user_guest',
    name: 'Học viên Thử Nghiệm',
    role: 'student'
  };

  const joinRes = await joinClassByCode(code, demoStudent);
  assert.equal(joinRes.success, true, 'Demo join should succeed');
});

test('Live Classroom: Join and participant listing sync', async () => {
  const { createClassSession, joinLiveSession, getSessionParticipants, leaveLiveSession } = await import('../src/services/liveClassroomService.js');
  
  // Teacher creates a classroom and starts session
  const cls = await createClassroom({
    teacherId: 'teacher-live-sync',
    name: 'Lớp Trực Tuyến Đồng Bộ',
    hskLevel: 'HSK 1'
  });
  const ses = await createClassSession({
    classroomId: cls.classroom.id,
    teacherId: 'teacher-live-sync',
    title: 'Buổi học trực tuyến'
  });
  assert.equal(ses.success, true);
  const sessionId = ses.session.id;

  // Student joins the class and then the live session
  const testStudent = {
    uid: 'stu-live-test-1',
    name: 'Học viên Live Test',
    role: 'student'
  };
  await joinClassByCode(cls.classroom.class_code, testStudent);

  const joinRes = await joinLiveSession(sessionId, testStudent);
  assert.equal(joinRes.success, true);

  const parts = await getSessionParticipants(sessionId);
  assert.ok(parts.some(p => p.user_id === 'stu-live-test-1'));

  await leaveLiveSession(sessionId, 'stu-live-test-1');
  const activeParts = await getSessionParticipants(sessionId, true);
  assert.ok(!activeParts.some(p => p.user_id === 'stu-live-test-1'));
});
