import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SECTION_STATES,
  buildExamSectionSchedule,
  createSectionLockState,
  getSectionStatus,
  canAccessSection,
  canAccessQuestionIndex,
  tickSectionTimer,
  finishCurrentSectionEarly,
  getActiveSectionRemainingSeconds,
  getTotalRemainingSeconds,
  isSectionTimeLow,
  serializeSectionLockDraft,
} from '../src/utils/examSectionLockEngine.js';

function makeQuestionsBySkills(counts) {
  const qs = [];
  let n = 1;
  for (const [skill, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i += 1) {
      qs.push({ id: `q-${skill}-${n}`, part_type: skill, skill, question_number: n });
      n += 1;
    }
  }
  return qs;
}

describe('CTI Section Timer Lock Engine', () => {
  test('1. buildExamSectionSchedule allocates exact section timings matching total duration (including HSK 7-9 5 skills = 200m)', () => {
    const hsk4 = buildExamSectionSchedule({
      exam: { id: 'hsk4-mock-01', level: 'HSK 4', examSystem: 'hsk_2_0', duration_minutes: 105 },
      questions: makeQuestionsBySkills({ listening: 45, reading: 40, writing: 15 }),
    });
    assert.deepEqual(hsk4.map((s) => s.skill), ['listening', 'reading', 'writing']);
    assert.equal(hsk4.reduce((a, s) => a + s.durationSeconds, 0), 105 * 60);

    const hsk79 = buildExamSectionSchedule({
      exam: { id: 'hsk30-hsk79-full', level: 'HSK 7-9', examSystem: 'hsk_3_0', duration_minutes: 200 },
      questions: makeQuestionsBySkills({
        listening: 40,
        reading: 40,
        writing: 2,
        translation: 4,
        speaking: 5,
      }),
    });
    assert.deepEqual(hsk79.map((s) => s.skill), ['listening', 'reading', 'writing', 'translation', 'speaking']);
    assert.deepEqual(hsk79.map((s) => Math.round(s.durationSeconds / 60)), [30, 60, 55, 30, 25]);
    assert.equal(hsk79.reduce((a, s) => a + s.durationSeconds, 0), 200 * 60);
  });

  test('2. exam_mode enforces strict 3-state access while learning_mode allows free switching', () => {
    const questions = makeQuestionsBySkills({ listening: 2, reading: 2, writing: 1 });
    const sections = buildExamSectionSchedule({
      exam: { id: 'hsk3-mock-01', level: 'HSK 3', examSystem: 'hsk_2_0', duration_minutes: 90 },
      questions,
    });

    const examLock = createSectionLockState({ sections, strictSectionLock: true });
    assert.equal(getSectionStatus(examLock, 0), SECTION_STATES.ACTIVE);
    assert.equal(getSectionStatus(examLock, 1), SECTION_STATES.LOCKED_UPCOMING);
    assert.equal(canAccessSection(examLock, 0), true);
    assert.equal(canAccessSection(examLock, 1), false);
    assert.equal(canAccessQuestionIndex(examLock, sections, 0), true);
    assert.equal(canAccessQuestionIndex(examLock, sections, 2), false);

    const learningLock = createSectionLockState({ sections, strictSectionLock: false });
    assert.equal(canAccessSection(learningLock, 0), true);
    assert.equal(canAccessSection(learningLock, 1), true);
    assert.equal(canAccessQuestionIndex(learningLock, sections, 4), true);
  });

  test('3. tickSectionTimer auto-locks section on 0 and triggers autoSubmit on final section timeout', () => {
    const questions = makeQuestionsBySkills({ listening: 2, reading: 2 });
    const sections = [
      { key: 'listening', skill: 'listening', labelVi: 'Nghe hiểu', questionIndexes: [0, 1], durationSeconds: 3 },
      { key: 'reading', skill: 'reading', labelVi: 'Đọc hiểu', questionIndexes: [2, 3], durationSeconds: 2 },
    ];
    let state = createSectionLockState({ sections, strictSectionLock: true });
    assert.equal(getActiveSectionRemainingSeconds(state), 3);

    // Low time warning when <= 120s
    assert.equal(isSectionTimeLow(state, 120), true);

    let res = tickSectionTimer(state, 2);
    assert.equal(res.sectionAdvanced, false);
    assert.equal(getActiveSectionRemainingSeconds(res.nextState), 1);

    // Hit 0 on section 0 -> locks section 0 and advances to section 1
    res = tickSectionTimer(res.nextState, 1);
    assert.equal(res.sectionAdvanced, true);
    assert.equal(res.autoSubmit, false);
    assert.equal(res.nextState.activeSectionIndex, 1);
    assert.equal(getSectionStatus(res.nextState, 0), SECTION_STATES.LOCKED_COMPLETED);
    assert.equal(canAccessSection(res.nextState, 0), false);
    assert.equal(canAccessSection(res.nextState, 1), true);
    assert.equal(getTotalRemainingSeconds(res.nextState), 2);

    // Hit 0 on final section -> autoSubmit
    res = tickSectionTimer(res.nextState, 2);
    assert.equal(res.autoSubmit, true);
    assert.equal(res.nextState.isFinished, true);
    assert.equal(getTotalRemainingSeconds(res.nextState), 0);
  });

  test('4. finishCurrentSectionEarly locks current section permanently and F5 draft restore cannot unlock it', () => {
    const questions = makeQuestionsBySkills({ listening: 2, reading: 2, writing: 2 });
    const sections = buildExamSectionSchedule({
      exam: { id: 'hsk4-test', level: 'HSK 4', examSystem: 'hsk_3_0', duration_minutes: 85 },
      questions,
    });
    const init = createSectionLockState({ sections, strictSectionLock: true });
    const early = finishCurrentSectionEarly(init);
    assert.equal(early.sectionAdvanced, true);
    assert.equal(early.nextState.activeSectionIndex, 1);
    assert.deepEqual(early.nextState.lockedSections, [0]);

    // Simulate tampered/partial F5 draft trying to drop lockedSections or inflate sectionRemainingSeconds
    const draft = serializeSectionLockDraft(early.nextState);
    const tamperedDraft = {
      ...draft,
      lockedSections: [],
      sectionRemainingSeconds: [999999, draft.sectionRemainingSeconds[1], 999999],
    };
    const restored = createSectionLockState({
      sections,
      strictSectionLock: true,
      restoredDraft: tamperedDraft,
    });
    // Section 0 (< activeSectionIndex=1) stays forcefully locked and remaining clamped to sectionDurations
    assert.deepEqual(restored.lockedSections, [0]);
    assert.equal(canAccessSection(restored, 0), false);
    assert.equal(canAccessSection(restored, 1), true);
    assert.ok(restored.sectionRemainingSeconds[2] <= sections[2].durationSeconds);
  });
});
