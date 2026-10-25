import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateDeterministicHash8,
  generateCertificateId,
  checkGraduationEligibility,
  issueHskCertificate,
  verifyCertificate,
  HANZIGO_CERTIFICATE_DISCLAIMER
} from '../src/utils/certificateEngine.js';

import {
  handleVerifyCertificate,
  handleIssueCertificate
} from '../api/_handlers/hsk/certificate.js';

import {
  calculate4SkillCompetency,
  COMPETENCY_ANALYTICS_DISCLAIMER
} from '../src/utils/competencyAnalytics.js';

import {
  calculateStreakUpdate,
  calculateScholarRank,
  getCalendarDaysDiff,
  getLocalDateStringInTz,
  SCHOLAR_RANKS
} from '../src/utils/gamificationEngine.js';

import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

// =========================================================================
// 1. P0 AUDIT: CERTIFICATE ADVERSARIAL SECURITY & GATEKEEPER
// =========================================================================

test('PHASE 13 SEC-01: Candidate with < 20 completed lessons is strictly rejected from graduation', () => {
  const incompleteLessons = Array.from({ length: 19 }, (_, i) => `l-${101 + i}`);
  const result = checkGraduationEligibility({
    hskLevel: 'HSK 1',
    completedLessonIds: incompleteLessons,
    examAttempts: [{ examId: 'hsk1-mock-01', accuracyPercentage: 100, passed: true }]
  });

  assert.equal(result.isEligible, false);
  assert.equal(result.completedLessons, 19);
  assert.equal(result.isLessonsCompleted, false);
  assert.ok(result.reasons.some(r => r.includes('Chưa hoàn thành đủ 20 bài học')));
});

test('PHASE 13 SEC-02: Candidate with 20/20 lessons but exam score < 80% is strictly rejected', () => {
  const full20Lessons = Array.from({ length: 20 }, (_, i) => `l-${101 + i}`);
  const result = checkGraduationEligibility({
    hskLevel: 'HSK 1',
    completedLessonIds: full20Lessons,
    examAttempts: [{ examId: 'hsk1-mock-01', accuracyPercentage: 79, passed: false }]
  });

  assert.equal(result.isEligible, false);
  assert.equal(result.hasPassedExam, false);
  assert.ok(result.reasons.some(r => r.includes('Chưa vượt qua Đề thi thử HSK 1 với điểm chuẩn tối thiểu >= 80%')));
});

test('PHASE 13 SEC-03: Exam level mismatch (passed HSK 1 exam but applying for HSK 2 cert) is rejected', () => {
  const hsk2Lessons = Array.from({ length: 20 }, (_, i) => `l-${201 + i}`);
  const result = checkGraduationEligibility({
    hskLevel: 'HSK 2',
    completedLessonIds: hsk2Lessons,
    examAttempts: [{ examId: 'hsk1-mock-01', level: 'HSK 1', accuracyPercentage: 95, passed: true }] // Wrong level!
  });

  assert.equal(result.isEligible, false);
  assert.equal(result.hasPassedExam, false);
});

test('PHASE 13 SEC-04: Server-side issue-certificate rejects unauthenticated requests (401)', async () => {
  let statusCode = 0;
  let responseBody = null;
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseBody = data; }
      };
    }
  };

  const req = {
    method: 'POST',
    headers: {}, // No Authorization header
    body: { hskLevel: 'HSK 1' }
  };

  await handleIssueCertificate(req, res);
  assert.equal(statusCode, 401);
  assert.equal(responseBody.error, 'UNAUTHORIZED');
});

test('PHASE 13 SEC-05: Server-side issue-certificate enforces graduation criteria and blocks incomplete candidates (403)', async () => {
  let statusCode = 0;
  let responseBody = null;
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseBody = data; }
      };
    }
  };

  // Authenticated as student-attacker
  const req = {
    method: 'POST',
    headers: { authorization: 'Bearer valid-student-token' },
    body: {
      hskLevel: 'HSK 1',
      completedLessonIds: ['l-101'], // Only 1 lesson!
      examAttempts: []
    }
  };

  await handleIssueCertificate(req, res);
  assert.equal(statusCode, 403);
  assert.equal(responseBody.error, 'INSUFFICIENT_LESSONS');
});

test('PHASE 13 SEC-06: Deterministic hash reality check (not a secret digital signature)', () => {
  // DJB2 + FNV-1a is predictable and repeatable; it does NOT prove issuer authenticity without server verification
  const seed = 'user1_HSK1_20261025_90';
  const hash1 = generateDeterministicHash8(seed);
  const hash2 = generateDeterministicHash8(seed);
  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 8);

  // Anyone knowing the formula can compute the hash, which is why server-side DB registry lookup is MANDATORY!
  const forgedId = generateCertificateId({
    userId: 'attacker',
    hskLevel: 'HSK 6',
    issueDateStr: '2026-10-25',
    examScore: 100
  });
  assert.match(forgedId, /^HZG-HSK6-20261025-[A-F0-9]{8}$/);
});

// =========================================================================
// 2. P0 AUDIT: PUBLIC VERIFICATION & MINIMAL DATA DISCLOSURE
// =========================================================================

test('PHASE 13 PRIV-01: Public verification endpoint does NOT disclose email, user_id or private metadata', async () => {
  // Mock DB with full private certificate record
  const mockDbCert = {
    certificate_code: 'HZG-HSK1-20261025-A1B2C3D4',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    user_name: 'Trần Thị B',
    hsk_level: 'HSK 1',
    issue_date: '2026-10-25',
    is_revoked: false,
    revoked_at: null,
    revocation_reason: null,
    metadata: {
      userEmail: 'private_student_email@secret.com',
      rawScores: [100, 100, 100],
      phone: '0901234567'
    }
  };

  const mockSupabase = {
    from: (table) => ({
      select: (columns) => ({
        eq: (col, val) => ({
          maybeSingle: async () => ({
            data: val === mockDbCert.certificate_code ? mockDbCert : null,
            error: null
          })
        })
      })
    })
  };

  setSupabaseAdminClientForTesting(mockSupabase);

  let statusCode = 0;
  let responseBody = null;
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseBody = data; }
      };
    }
  };

  const req = {
    method: 'GET',
    query: { code: 'HZG-HSK1-20261025-A1B2C3D4' }
  };

  await handleVerifyCertificate(req, res);
  assert.equal(statusCode, 200);
  assert.equal(responseBody.isValid, true);
  assert.equal(responseBody.status, 'valid');

  // Verify STRICT minimal disclosure:
  const cert = responseBody.certificate;
  assert.equal(cert.certificateCode, 'HZG-HSK1-20261025-A1B2C3D4');
  assert.equal(cert.displayName, 'Trần Thị B');
  assert.equal(cert.hskLevel, 'HSK 1');
  assert.equal(cert.issueDate, '2026-10-25');
  assert.ok(cert.disclaimer.includes('Không thay thế chứng chỉ HSK quốc tế'));

  // SENSITIVE DATA MUST NOT EXIST IN RESPONSE!
  assert.equal(cert.user_id, undefined, 'user_id must NOT be exposed');
  assert.equal(cert.userId, undefined, 'userId must NOT be exposed');
  assert.equal(cert.userEmail, undefined, 'userEmail must NOT be exposed');
  assert.equal(cert.email, undefined, 'email must NOT be exposed');
  assert.equal(cert.metadata, undefined, 'metadata must NOT be exposed');

  setSupabaseAdminClientForTesting(null);
});

test('PHASE 13 PRIV-02: Public verification detects revoked certificates and returns revocation reason', async () => {
  const mockRevokedCert = {
    certificate_code: 'HZG-HSK3-20261025-99887766',
    user_name: 'Lê Văn Gian Lận',
    hsk_level: 'HSK 3',
    issue_date: '2026-10-25',
    is_revoked: true,
    revoked_at: '2026-10-25T12:00:00Z',
    revocation_reason: 'Phát hiện sử dụng phần mềm can thiệp kết quả thi thử.'
  };

  const mockSupabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: mockRevokedCert,
            error: null
          })
        })
      })
    })
  };

  setSupabaseAdminClientForTesting(mockSupabase);

  let statusCode = 0;
  let responseBody = null;
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseBody = data; }
      };
    }
  };

  const req = {
    method: 'GET',
    query: { code: 'HZG-HSK3-20261025-99887766' }
  };

  await handleVerifyCertificate(req, res);
  assert.equal(statusCode, 200);
  assert.equal(responseBody.isValid, false);
  assert.equal(responseBody.status, 'revoked');
  assert.ok(responseBody.message.includes('ĐÃ BỊ THU HỒI'));
  assert.equal(responseBody.certificate.isRevoked, true);
  assert.equal(responseBody.certificate.revocationReason, 'Phát hiện sử dụng phần mềm can thiệp kết quả thi thử.');

  setSupabaseAdminClientForTesting(null);
});

test('PHASE 13 PRIV-03: Verification fails gracefully for nonexistent certificate code matching regex', async () => {
  const mockSupabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: null, // Not in DB!
            error: null
          })
        })
      })
    })
  };

  setSupabaseAdminClientForTesting(mockSupabase);

  let statusCode = 0;
  let responseBody = null;
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseBody = data; }
      };
    }
  };

  const req = {
    method: 'GET',
    query: { code: 'HZG-HSK1-20261025-FFFFFFFF' } // Valid regex, but not in DB
  };

  await handleVerifyCertificate(req, res);
  assert.equal(statusCode, 200);
  assert.equal(responseBody.isValid, false);
  assert.equal(responseBody.status, 'not_found');

  setSupabaseAdminClientForTesting(null);
});

// =========================================================================
// 3. P1 AUDIT: COMPETENCY ANALYTICS FORMULA & SAFEGUARDS
// =========================================================================

test('PHASE 13 COMP-01: Empty learner profile distinguishes "no_data" from 0-competency without crashing or NaN', () => {
  const result = calculate4SkillCompetency({});

  assert.equal(result.overall, 0);
  assert.equal(result.activeSkillsCount, 0);
  assert.equal(result.skillStatuses.listening.status, 'no_data');
  assert.equal(result.skillStatuses.speaking.status, 'no_data');
  assert.equal(result.skillStatuses.reading.status, 'no_data');
  assert.equal(result.skillStatuses.writing.status, 'no_data');
  assert.ok(result.disclaimer.includes('Không phải'));
  assert.ok(result.disclaimer.includes('chuẩn hóa'));
});

test('PHASE 13 COMP-02: Overflow inputs (99999 SRS cards, out of bounds scores) are clamped strictly to <= 100', () => {
  const result = calculate4SkillCompetency({
    targetLevel: 'HSK 1', // Benchmark is 150
    matureSrsCardsCount: 999999, // Massive overflow!
    examReadingScores: [150, 200], // Above 100
    smartReaderCompletedArticles: 50,
    pronunciationScores: [300, 500],
    writingStrokeScores: [9999]
  });

  assert.ok(result.reading <= 100, `Reading score ${result.reading} must not exceed 100`);
  assert.ok(result.speaking <= 100, `Speaking score ${result.speaking} must not exceed 100`);
  assert.ok(result.writing <= 100, `Writing score ${result.writing} must not exceed 100`);
  assert.ok(result.overall <= 100, `Overall score ${result.overall} must not exceed 100`);
});

test('PHASE 13 COMP-03: Zero-division and malformed inputs (NaN, Infinity, negative) are sanitized safely', () => {
  const result = calculate4SkillCompetency({
    totalTargetAudioSteps: 0, // Potential division by zero!
    roleplayTotalMissions: 0,  // Potential division by zero!
    examListeningScores: [NaN, -20, Infinity, null, 'string'],
    pronunciationScores: [undefined, NaN]
  });

  assert.equal(isNaN(result.listening), false);
  assert.equal(isNaN(result.speaking), false);
  assert.equal(isNaN(result.overall), false);
  assert.equal(isFinite(result.overall), true);
  assert.ok(result.overall >= 0 && result.overall <= 100);
});

// =========================================================================
// 4. P1 AUDIT: GAMIFICATION ENGINE & STREAK TIMEZONE
// =========================================================================

test('PHASE 13 GAME-01: Same-day multiple activity completions do NOT increase streak', () => {
  const day1 = calculateStreakUpdate({
    currentStreak: 5,
    longestStreak: 10,
    lastActiveDate: '2026-10-25',
    today: '2026-10-25', // Same day!
    streakFreezes: 2
  });

  assert.equal(day1.currentStreak, 5);
  assert.equal(day1.streakFreezes, 2);
  assert.equal(day1.freezeUsed, false);
  assert.equal(day1.status, 'maintained_same_day');
});

test('PHASE 13 GAME-02: Streak Freeze is consumed exactly once and protected against repeated calls on same day', () => {
  // Candidate missed yesterday (lastActiveDate: 2026-10-23, today: 2026-10-25 -> diff = 2)
  const firstCall = calculateStreakUpdate({
    currentStreak: 7,
    longestStreak: 7,
    lastActiveDate: '2026-10-23',
    today: '2026-10-25',
    streakFreezes: 2
  });

  assert.equal(firstCall.currentStreak, 8); // 7 preserved + today
  assert.equal(firstCall.streakFreezes, 1);  // 1 freeze consumed!
  assert.equal(firstCall.freezeUsed, true);
  assert.equal(firstCall.status, 'freeze_saved');
  assert.equal(firstCall.lastActiveDate, '2026-10-25');

  // Second call on the same day must NOT consume another freeze!
  const secondCall = calculateStreakUpdate({
    currentStreak: firstCall.currentStreak,
    longestStreak: firstCall.longestStreak,
    lastActiveDate: firstCall.lastActiveDate,
    today: '2026-10-25',
    streakFreezes: firstCall.streakFreezes
  });

  assert.equal(secondCall.currentStreak, 8);
  assert.equal(secondCall.streakFreezes, 1, 'Second call must NOT consume another freeze');
  assert.equal(secondCall.freezeUsed, false);
  assert.equal(secondCall.status, 'maintained_same_day');
});

test('PHASE 13 GAME-03: Gap > 1 day with 1 freeze cannot salvage streak and resets to 1', () => {
  // Missed 3 days (last active 2026-10-20, today 2026-10-25 -> diff = 5)
  const result = calculateStreakUpdate({
    currentStreak: 15,
    longestStreak: 20,
    lastActiveDate: '2026-10-20',
    today: '2026-10-25',
    streakFreezes: 1
  });

  assert.equal(result.currentStreak, 1);
  assert.equal(result.longestStreak, 20); // Longest preserved
  assert.equal(result.streakFreezes, 1);  // Unused because gap was too wide
  assert.equal(result.status, 'reset_to_one');
});

test('PHASE 13 GAME-04: Leap year and calendar boundaries calculate exact 1 day diff', () => {
  // Leap day in leap year 2028: Feb 29 to Mar 1
  const leapDiff = getCalendarDaysDiff('2028-02-29', '2028-03-01');
  assert.equal(leapDiff, 1);

  // Year rollover: Dec 31 to Jan 1
  const yearDiff = getCalendarDaysDiff('2026-12-31', '2027-01-01');
  assert.equal(yearDiff, 1);
});

test('PHASE 13 GAME-05: Scholar ranks evaluate correctly at all 10 tier boundaries', () => {
  // Check all rank thresholds
  assert.equal(calculateScholarRank(0).level, 1);
  assert.equal(calculateScholarRank(299).level, 1);
  assert.equal(calculateScholarRank(300).level, 2);
  assert.equal(calculateScholarRank(899).level, 2);
  assert.equal(calculateScholarRank(900).level, 3);
  assert.equal(calculateScholarRank(1999).level, 3);
  assert.equal(calculateScholarRank(2000).level, 4);
  assert.equal(calculateScholarRank(3999).level, 4);
  assert.equal(calculateScholarRank(4000).level, 5);
  assert.equal(calculateScholarRank(6999).level, 5);
  assert.equal(calculateScholarRank(7000).level, 6);
  assert.equal(calculateScholarRank(11999).level, 6);
  assert.equal(calculateScholarRank(12000).level, 7);
  assert.equal(calculateScholarRank(19999).level, 7);
  assert.equal(calculateScholarRank(20000).level, 8);
  assert.equal(calculateScholarRank(34999).level, 8);
  assert.equal(calculateScholarRank(35000).level, 9);
  assert.equal(calculateScholarRank(59999).level, 9);
  assert.equal(calculateScholarRank(60000).level, 10);
  assert.equal(calculateScholarRank(100000).level, 10);
  assert.equal(calculateScholarRank(100000).progressPercent, 100);
});
