import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  registerAllAgentTools,
  getAllowedToolNamesForRole,
  getAgentToolDeclarationsForRole,
} from '../api/_agent/tools/index.js';

describe('Task 05: Learner, Exam & Safe-Write Tools', () => {
  const registry = registerAllAgentTools();

  test('blocks guest and cross-user IDOR on get_learner_adaptive_profile & suggest_save_vocab_to_srs', async () => {
    const guestProfile = await registry.executeTool(
      'get_learner_adaptive_profile',
      { hskLevel: 'HSK 2' },
      { user: null, role: 'guest' }
    );
    assert.equal(guestProfile.ok, false);
    assert.match(guestProfile.error, /đăng nhập/i);

    const idorAttempt = await registry.executeTool(
      'get_learner_adaptive_profile',
      { userId: 'student-b' },
      { user: { id: 'student-a' }, role: 'student' }
    );
    assert.equal(idorAttempt.ok, false);
    assert.match(idorAttempt.error, /IDOR/i);

    const ownProfile = await registry.executeTool(
      'get_learner_adaptive_profile',
      { hskLevel: 'HSK 3' },
      { user: { id: 'student-a' }, role: 'student', supabaseClient: null }
    );
    assert.equal(ownProfile.ok, true);
    assert.equal(ownProfile.data.hskLevel, 'HSK 3');
    assert.equal(ownProfile.data.hasSparseData, true);
  });

  test('inspect_hsk_exam_question hides answers during active CBT session and reveals in review mode', async () => {
    const activeRes = await registry.executeTool(
      'inspect_hsk_exam_question',
      { questionId: 'q-hsk1-01-01' },
      { isActiveExamSession: true }
    );
    assert.equal(activeRes.ok, true);
    assert.equal(activeRes.data.found, true);
    assert.equal(activeRes.data.answerHidden, true);
    assert.equal(activeRes.data.question.correct_answer, undefined);
    assert.equal(activeRes.data.question.correct_option_index, undefined);
    assert.equal(activeRes.data.question.explanation, undefined);

    const reviewRes = await registry.executeTool(
      'inspect_hsk_exam_question',
      { questionId: 'q-hsk1-01-01' },
      { isActiveExamSession: false }
    );
    assert.equal(reviewRes.ok, true);
    assert.equal(reviewRes.data.answerHidden, false);
    assert.equal(reviewRes.data.question.correct_option_index, 0);
    assert.ok(reviewRes.data.question.explanation);
  });

  test('suggest_save_vocab_to_srs returns pendingConfirmation without direct DB writes', async () => {
    const guestSave = await registry.executeTool(
      'suggest_save_vocab_to_srs',
      { hanzi: '把', meaning: 'Giới từ chữ 把' },
      { user: null, role: 'guest' }
    );
    assert.equal(guestSave.ok, false);

    let dbMutated = false;
    const mockSupabase = {
      from: () => {
        dbMutated = true;
        return { insert: async () => ({}) };
      },
    };

    const proposeRes = await registry.executeTool(
      'suggest_save_vocab_to_srs',
      { hanzi: '把', pinyin: 'bǎ', meaning: 'Giới từ xử lý', hskLevel: 'HSK 3' },
      { user: { id: 'student-a' }, role: 'student', supabaseClient: mockSupabase }
    );
    assert.equal(proposeRes.ok, true);
    assert.equal(dbMutated, false);
    assert.equal(proposeRes.data.savedDirectly, false);
    assert.equal(proposeRes.data.pendingConfirmation.requiresConfirmation, true);
    assert.equal(proposeRes.data.pendingConfirmation.actionType, 'save_vocab_to_srs');
    assert.equal(proposeRes.data.pendingConfirmation.payload.userId, 'student-a');
  });

  test('generate_study_prescription returns cold-start recommendations with valid routes', async () => {
    const rx = await registry.executeTool(
      'generate_study_prescription',
      { hskLevel: 'HSK 1' },
      { user: { id: 'student-new' }, role: 'student', supabaseClient: null }
    );
    assert.equal(rx.ok, true);
    assert.equal(rx.data.isColdStart, true);
    assert.ok(rx.data.prescriptions.length >= 3 && rx.data.prescriptions.length <= 4);
    assert.ok(rx.data.uiActions.every((a) => /^#(vocabulary|lesson|writing|hsk|pronunciation)$/.test(a.route)));
  });

  test('role-based tool filtering exposes 6 public tools to guest and all 10 tools to student', () => {
    const guestNames = getAllowedToolNamesForRole('guest');
    assert.equal(guestNames.length, 6);
    const guestDecls = getAgentToolDeclarationsForRole(registry, 'guest');
    assert.equal(guestDecls.length, 6);

    const studentDecls = getAgentToolDeclarationsForRole(registry, 'student');
    assert.equal(studentDecls.length, 10);
  });
});
