import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  generateClassCode, 
  calculateStudentHealthStatus,
  autoEvaluateQuiz,
  createClassroom,
  joinClassByCode,
  submitAssignment,
  gradeSubmission,
  deleteClassroom
} from '../src/services/classroomService.js';

test('Classroom: Class code generation follows HZG-XXXXX pattern', () => {
  const code = generateClassCode();
  assert.match(code, /^HZG-[2-9A-HJ-NP-Z]{5}$/);
  
  // Test uniqueness across 50 generations
  const codeSet = new Set();
  for (let i = 0; i < 50; i++) {
    codeSet.add(generateClassCode());
  }
  assert.equal(codeSet.size, 50);
});

test('Classroom: Student Health Diagnostic categorizes At Risk correctly', () => {
  // Inactive >= 7 days
  const r1 = calculateStudentHealthStatus({ daysInactive: 8, completionRate: 90, overdueCount: 0, avgScore: 85 });
  assert.equal(r1.status, 'At Risk');

  // Completion rate < 40%
  const r2 = calculateStudentHealthStatus({ daysInactive: 2, completionRate: 35, overdueCount: 0, avgScore: 85 });
  assert.equal(r2.status, 'At Risk');

  // Overdue count >= 2
  const r3 = calculateStudentHealthStatus({ daysInactive: 1, completionRate: 80, overdueCount: 2, avgScore: 80 });
  assert.equal(r3.status, 'At Risk');

  // Consecutive low score < 50
  const r4 = calculateStudentHealthStatus({ daysInactive: 1, completionRate: 80, overdueCount: 0, avgScore: 45 });
  assert.equal(r4.status, 'At Risk');
});

test('Classroom: Student Health Diagnostic categorizes Needs Attention correctly', () => {
  // Inactive 4-6 days
  const r1 = calculateStudentHealthStatus({ daysInactive: 5, completionRate: 80, overdueCount: 0, avgScore: 80 });
  assert.equal(r1.status, 'Needs Attention');

  // Single overdue assignment
  const r2 = calculateStudentHealthStatus({ daysInactive: 1, completionRate: 85, overdueCount: 1, avgScore: 80 });
  assert.equal(r2.status, 'Needs Attention');

  // Completion rate between 40% and 70%
  const r3 = calculateStudentHealthStatus({ daysInactive: 1, completionRate: 60, overdueCount: 0, avgScore: 80 });
  assert.equal(r3.status, 'Needs Attention');
});

test('Classroom: Student Health Diagnostic categorizes Healthy correctly', () => {
  const r = calculateStudentHealthStatus({ daysInactive: 1, completionRate: 95, overdueCount: 0, avgScore: 92 });
  assert.equal(r.status, 'Healthy');
  assert.equal(r.color, 'emerald');
});

test('Classroom: Auto-evaluation of quiz assignments computes accurate percentage', () => {
  const questions = [
    { id: 'q1', correctIndex: 0 },
    { id: 'q2', correctIndex: 2 },
    { id: 'q3', correctIndex: 1 },
    { id: 'q4', correctIndex: 3 }
  ];

  // All correct
  assert.equal(autoEvaluateQuiz(questions, { q1: 0, q2: 2, q3: 1, q4: 3 }), 100);

  // Half correct
  assert.equal(autoEvaluateQuiz(questions, { q1: 0, q2: 2, q3: 0, q4: 0 }), 50);

  // All wrong
  assert.equal(autoEvaluateQuiz(questions, { q1: 1, q2: 0, q3: 0, q4: 0 }), 0);

  // Empty questions fallback
  assert.equal(autoEvaluateQuiz([], {}), 100);
});

test('Classroom: Create class, join by code, submit and grade workflow', async () => {
  // 1. Create class
  const classRes = await createClassroom({
    teacherId: 'teacher-test-1',
    name: 'Lớp Luyện Thi HSK 3 Cấp Tốc',
    description: 'Khóa học 6 tuần',
    hskLevel: 'HSK 3',
    maxStudents: 2
  });

  assert.equal(classRes.success, true);
  const classroom = classRes.classroom;
  assert.ok(classroom.id);
  assert.match(classroom.class_code, /^HZG-/);

  // 2. Student 1 joins with valid code
  const student1 = { uid: 'student-test-1', name: 'Trần Văn Bình', email: 'binh@test.com', level: 'HSK 3' };
  const joinRes1 = await joinClassByCode(classroom.class_code, student1);
  assert.equal(joinRes1.success, true);

  // 3. Prevent duplicate join
  const dupRes = await joinClassByCode(classroom.class_code, student1);
  assert.equal(dupRes.success, false);
  assert.match(dupRes.error, /đã là thành viên/);

  // 4. Student 2 joins (reaches maxStudents = 2)
  const student2 = { uid: 'student-test-2', name: 'Lê Thị Cúc', email: 'cuc@test.com', level: 'HSK 3' };
  const joinRes2 = await joinClassByCode(classroom.class_code, student2);
  assert.equal(joinRes2.success, true);

  // 5. Student 3 fails because class is full
  const student3 = { uid: 'student-test-3', name: 'Đặng Quốc Dũng', email: 'dung@test.com' };
  const fullRes = await joinClassByCode(classroom.class_code, student3);
  assert.equal(fullRes.success, false);
  assert.match(fullRes.error, /sĩ số tối đa/);

  // 6. Submit an assignment and grade it
  const submitRes = await submitAssignment({
    assignmentId: 'test-asg-1',
    studentId: student1.uid,
    studentName: student1.name,
    submissionData: { notes: 'Bài giải phần viết chữ' }
  });
  assert.equal(submitRes.success, true);
  assert.equal(submitRes.submission.status, 'submitted');

  // 7. Teacher grades submission
  const gradeRes = await gradeSubmission({
    submissionId: submitRes.submission.id,
    score: 95,
    feedback: 'Viết rất đẹp và đúng nét thuận!',
    teacherId: 'teacher-test-1'
  });
  assert.equal(gradeRes.success, true);
});

test('Classroom: 1-on-1 tutoring allows maxStudents = 1 and enforces cap', async () => {
  const classRes = await createClassroom({
    teacherId: 'teacher-tutor-1',
    name: 'Kèm 1-1 Luyện Phản Xạ HSK 4',
    description: 'Lớp gia sư 1-1',
    hskLevel: 'HSK 4',
    maxStudents: 1
  });

  assert.equal(classRes.success, true);
  assert.equal(classRes.classroom.max_students, 1);

  const studentA = { uid: 'student-tutor-a', name: 'Hoàng Anh', email: 'anh@test.com' };
  const joinA = await joinClassByCode(classRes.classroom.class_code, studentA);
  assert.equal(joinA.success, true);

  const studentB = { uid: 'student-tutor-b', name: 'Minh Quang', email: 'quang@test.com' };
  const joinB = await joinClassByCode(classRes.classroom.class_code, studentB);
  assert.equal(joinB.success, false);
  assert.match(joinB.error, /sĩ số tối đa/);
});

test('Classroom: deleteClassroom purges classroom successfully', async () => {
  const created = await createClassroom({
    teacherId: 'teacher-del-test',
    name: 'Lớp Sắp Bị Xóa',
    maxStudents: 10
  });
  assert.equal(created.success, true);
  const classId = created.classroom.id;

  const delRes = await deleteClassroom(classId);
  assert.equal(delRes.success, true);

  // Deleting invalid id returns error
  const invalidDel = await deleteClassroom('');
  assert.equal(invalidDel.success, false);
});


