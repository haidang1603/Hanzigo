import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

Object.assign(globalThis, {
  localStorage: createMemoryStorage(),
  sessionStorage: createMemoryStorage(),
});

const {
  configureLearningDataService,
  getLocalMistakeRecords,
  getPendingLearningEvents,
} = await import('../services/learningDataService.ts');
const {
  evaluateHskWriting,
  HSK_WRITING_PROMPTS,
} = await import('../services/writingEvaluationService.ts');
const {
  getLearningIntelligenceState,
  processLearningActivity,
} = await import('../services/learningIntelligenceOrchestrator.ts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

describe('Task 26.08: Learning Intelligence Ecosystem E2E Integration', () => {
  const user = {
    id: '22222222-2222-4222-8222-222222222222',
    hskLevel: 5,
  };

  beforeEach(() => {
    globalThis.localStorage.clear();
    globalThis.sessionStorage.clear();
    configureLearningDataService({ flushDebounceMs: 60000 });
  });

  it('simulates full lifecycle: HSK 5/7 failures -> mistakes -> SRS leech escalation -> Adaptive remediation', async () => {
    // 1. User fails an HSK 5 Writing task (graceful deterministic fallback without AI latency)
    const hsk5WritingTask = HSK_WRITING_PROMPTS.find(
      (p) => p.taskType === 'hsk5_keywords_essay'
    )!;
    const writingEval = await evaluateHskWriting({
      user,
      task: hsk5WritingTask,
      responseText: '我坚持学习了过，把。',
      durationMs: 30000,
      aiRawResponse: null, // Simulates AI endpoint timeout / fallback
    });
    assert.equal(writingEval.evaluationSource, 'deterministic_rubric');
    assert.ok(writingEval.inline_corrections.length >= 1);

    // 2. User fails an HSK 7 CBT Reading item via closed-loop orchestrator
    const readingFail = await processLearningActivity({
      user,
      sourceModule: 'cbt_mock_exam',
      hskLevel: 7,
      skillDomain: 'reading',
      itemId: 'hsk7_read_q14',
      isCorrect: false,
      scoreEarned: 0,
      scoreMax: 1,
      durationMs: 45000,
      userAnswer: 'A',
      expectedAnswer: 'C',
    });
    assert.ok(readingFail.mistakeRecord);
    assert.equal(readingFail.mistakeRecord?.error_category, 'reading_inference');

    // 3. User lapses 4 times on an SRS card -> triggers Leech escalation
    let srsResult = null;
    for (let i = 0; i < 4; i += 1) {
      srsResult = await processLearningActivity({
        user,
        sourceModule: 'srs_review',
        hskLevel: 7,
        skillDomain: 'vocabulary',
        itemId: 'adv_v_1',
        hanzi: '相辅相成',
        pinyin: 'xiāng fǔ xiāng chéng',
        meaning: 'Bổ trợ lẫn nhau',
        reviewRating: 1, // Again
        isCorrect: false,
        confusedWith: '相反相成',
      });
    }

    assert.ok(srsResult?.srsCard);
    assert.equal(srsResult?.srsCard?.isLeech, true);
    assert.equal(srsResult?.srsCard?.maturity, 'Leech');
    assert.equal(srsResult?.srsCard?.lapses, 4);

    // 4. Verify Task 26.01 telemetry & mistake notebook populated
    const events = getPendingLearningEvents();
    const mistakes = getLocalMistakeRecords(user.id);
    assert.ok(events.length >= 6);
    assert.ok(mistakes.length >= 2);

    // 5. Verify Adaptive Engine surfaces SRS Leech & Mistake remediation in Today's Smart Session
    const state = getLearningIntelligenceState({ user, hskLevel: 5 });
    assert.equal(state.srs.leechCount, 1);
    assert.ok(state.analytics.kpis.activeMistakesCount >= 2);
    assert.ok(state.adaptivePlan.quests.length >= 2);

    const hasLeechQuest = state.adaptivePlan.quests.some(
      (q) => q.blockType === 'srs_leech' && q.targetRef === 'adv_v_1'
    );
    const hasMistakeQuest = state.adaptivePlan.quests.some(
      (q) => q.blockType === 'mistake_repair'
    );
    assert.equal(hasLeechQuest, true);
    assert.equal(hasMistakeQuest, true);

    state.adaptivePlan.quests.forEach((q) => {
      assert.ok(q.whyRecommended.length > 10);
      assert.ok(q.targetTab);
    });
  });

  it('audits RLS policies on all new Phase 26 Supabase migrations', () => {
    const migrations = [
      'supabase/migrations/20261112_learning_data_foundation.sql',
      'supabase/migrations/20261112_student_analytics_rpc.sql',
      'supabase/migrations/20261112_hsk7_9_curriculum_expansion.sql',
    ];

    migrations.forEach((relPath) => {
      const sql = fs.readFileSync(path.join(projectRoot, relPath), 'utf8');
      assert.ok(sql.length > 200);
      if (relPath.includes('learning_data_foundation')) {
        assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
        assert.match(sql, /auth\.uid\(\) = user_id/);
      }
      if (relPath.includes('student_analytics_rpc')) {
        assert.match(sql, /security_invoker = true/);
        assert.match(sql, /auth\.uid\(\)/);
      }
      if (relPath.includes('hsk7_9_curriculum_expansion')) {
        assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
        assert.match(sql, /public\.is_admin\(\)/);
      }
    });
  });

  it('verifies LearningIntelligenceHub is wired into AppSidebar and App.jsx', () => {
    const hubUi = fs.readFileSync(
      path.join(projectRoot, 'src/features/intelligence/LearningIntelligenceHub.tsx'),
      'utf8'
    );
    assert.match(hubUi, /Smart Daily Plan/);
    assert.match(hubUi, /Analytics & Mistakes/);
    assert.match(hubUi, /SRS Memory & Leech/);
    assert.match(hubUi, /AI Writing Lab/);
    assert.match(hubUi, /HSK 7–9 & CBT/);

    const sidebar = fs.readFileSync(
      path.join(projectRoot, 'src/components/navigation/AppSidebar.jsx'),
      'utf8'
    );
    assert.match(sidebar, /id: 'intelligence'/);

    const appJsx = fs.readFileSync(path.join(projectRoot, 'src/App.jsx'), 'utf8');
    assert.match(appJsx, /LearningIntelligenceHub/);
    assert.match(appJsx, /'intelligence'/);
  });
});

