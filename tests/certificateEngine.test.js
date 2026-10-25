import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateDeterministicHash8,
  generateCertificateId,
  checkGraduationEligibility,
  issueHskCertificate,
  verifyCertificate
} from '../src/utils/certificateEngine.js';

describe('Certificate Engine - Deterministic ID Generation', () => {
  it('generates reproducible 8-char uppercase hex hash for identical inputs', () => {
    const hash1 = generateDeterministicHash8('user-123_HSK1_20261025_95');
    const hash2 = generateDeterministicHash8('user-123_HSK1_20261025_95');
    const hashDifferent = generateDeterministicHash8('user-123_HSK1_20261025_96');

    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 8);
    assert.strictEqual(hash1, hash1.toUpperCase());
    assert.notStrictEqual(hash1, hashDifferent);
  });

  it('generates standard format certificate ID: HZG-HSK[Level]-[YYYYMMDD]-[Hash8]', () => {
    const id = generateCertificateId({
      userId: 'usr_abc_789',
      hskLevel: 'HSK 3',
      issueDateStr: '2026-10-25',
      examScore: 92
    });

    assert.ok(id.startsWith('HZG-HSK3-20261025-'));
    assert.strictEqual(id.split('-').length, 4);
    assert.match(id, /^HZG-HSK3-20261025-[A-F0-9]{8}$/);
  });
});

describe('Certificate Engine - Graduation Gatekeeper', () => {
  const hsk1Lessons20 = Array.from({ length: 20 }, (_, i) => `l-${101 + i}`);

  it('rejects candidate if completed lessons < 20/20 even with 100% exam score', () => {
    const incomplete19 = hsk1Lessons20.slice(0, 19);
    const result = checkGraduationEligibility({
      hskLevel: 'HSK 1',
      completedLessonIds: incomplete19,
      examAttempts: [
        { examId: 'exam-hsk1-mock1', accuracyPercentage: 100, passed: true }
      ]
    });

    assert.strictEqual(result.isEligible, false);
    assert.strictEqual(result.completedLessons, 19);
    assert.strictEqual(result.isLessonsCompleted, false);
    assert.strictEqual(result.hasPassedExam, true);
    assert.ok(result.reasons[0].includes('Chưa hoàn thành đủ 20 bài học'));
  });

  it('rejects candidate if completed 20/20 lessons but exam score < 80%', () => {
    const result = checkGraduationEligibility({
      hskLevel: 'HSK 1',
      completedLessonIds: hsk1Lessons20,
      examAttempts: [
        { examId: 'exam-hsk1-mock1', accuracyPercentage: 75, passed: false }
      ]
    });

    assert.strictEqual(result.isEligible, false);
    assert.strictEqual(result.completedLessons, 20);
    assert.strictEqual(result.isLessonsCompleted, true);
    assert.strictEqual(result.hasPassedExam, false);
    assert.ok(result.reasons[0].includes('Chưa vượt qua Đề thi thử HSK 1 với điểm chuẩn tối thiểu >= 80%'));
  });

  it('approves candidate who completed 20/20 lessons AND passed exam >= 80%', () => {
    const result = checkGraduationEligibility({
      hskLevel: 'HSK 1',
      completedLessonIds: hsk1Lessons20,
      examAttempts: [
        { examId: 'exam-hsk1-mock1', accuracyPercentage: 88, passed: true }
      ]
    });

    assert.strictEqual(result.isEligible, true);
    assert.strictEqual(result.completedLessons, 20);
    assert.strictEqual(result.isLessonsCompleted, true);
    assert.strictEqual(result.hasPassedExam, true);
    assert.strictEqual(result.reasons.length, 0);
  });
});

describe('Certificate Engine - Issuance and Verification', () => {
  const hsk2Lessons20 = Array.from({ length: 20 }, (_, i) => `l-${201 + i}`);

  it('issues certificate successfully for eligible student and persists data', async () => {
    const mockUser = {
      uid: 'u_tester_99',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com'
    };

    const issuance = await issueHskCertificate({
      user: mockUser,
      hskLevel: 'HSK 2',
      completedLessonIds: hsk2Lessons20,
      examAttempts: [{ examId: 'exam-hsk2-mock1', accuracyPercentage: 92, passed: true }],
      issueDate: new Date('2026-10-25T10:00:00Z')
    });

    assert.strictEqual(issuance.success, true);
    assert.ok(issuance.certificate.id.startsWith('HZG-HSK2-20261025-'));
    assert.strictEqual(issuance.certificate.userName, 'Nguyễn Văn A');

    // Verify invalid format
    const invalidCheck = await verifyCertificate('INVALID-CODE-XYZ');
    assert.strictEqual(invalidCheck.isValid, false);

    // Verify non-existent formatted code
    const nonExistent = await verifyCertificate('HZG-HSK2-20261025-00000000');
    assert.strictEqual(nonExistent.isValid, false);
  });
});
