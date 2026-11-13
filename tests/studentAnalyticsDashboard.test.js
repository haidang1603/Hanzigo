import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

global.localStorage = createMemoryStorage();
global.sessionStorage = createMemoryStorage();

const {
  computeStudentAnalyticsSnapshot,
  calculateHskReadinessScore,
  getTargetBenchmarkForLevel,
  mapErrorCategoryToAction,
} = await import('../src/features/analytics/studentAnalyticsService.ts');

const {
  normalizeLearningEvent,
} = await import('../src/services/learningDataService.ts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Task 26.02: Student Analytics Dashboard', () => {
  beforeEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
  });

  it('handles empty state gracefully for brand-new users', () => {
    const snap = computeStudentAnalyticsSnapshot({
      hskLevel: 2,
      daysWindow: 90,
      localEvents: [],
      localMistakes: [],
      examAttempts: [],
    });

    assert.equal(snap.isEmpty, true);
    assert.equal(snap.kpis.totalStudyHours, 0);
    assert.equal(snap.kpis.activeStreakDays, 0);
    assert.equal(snap.kpis.hskReadinessScore, 0);
    assert.equal(snap.kpis.activeMistakesCount, 0);
    assert.equal(snap.skillRadar.length, 6);
    assert.equal(snap.heatmap.length, 90);
    assert.equal(snap.errorPatterns.length, 0);
    assert.equal(snap.cbtProgress.length, 0);
  });

  it('computes 6-skill radar, 90/180-day heatmap, error patterns, and 200/300 CBT progress', () => {
    const todayIso = new Date().toISOString();
    const userId = '11111111-1111-4111-8111-111111111111';

    const localEvents = [
      normalizeLearningEvent({
        userId,
        sourceModule: 'lesson',
        hskLevel: 3,
        skillDomain: 'listening',
        itemId: 'l1',
        isCorrect: true,
        scoreEarned: 1,
        scoreMax: 1,
        durationMs: 120000,
        createdAt: todayIso,
      }),
      normalizeLearningEvent({
        userId,
        sourceModule: 'hanzi_writer',
        hskLevel: 3,
        skillDomain: 'stroke_order',
        itemId: 'c1',
        isCorrect: false,
        scoreEarned: 0,
        scoreMax: 1,
        durationMs: 60000,
        createdAt: todayIso,
      }),
    ];

    const snap = computeStudentAnalyticsSnapshot({
      hskLevel: 3,
      daysWindow: 180,
      localEvents,
      localMistakes: [
        {
          id: 'm1',
          user_id: userId,
          error_category: 'tone_confusion',
          hsk_level: 3,
          target_entity_id: 'v1',
          user_answer: {},
          expected_answer: {},
          occurrence_count: 4,
          resolved_status: 'active',
          last_mistake_at: todayIso,
        },
        {
          id: 'm2',
          user_id: userId,
          error_category: 'tone_confusion',
          hsk_level: 3,
          target_entity_id: 'v2',
          user_answer: {},
          expected_answer: {},
          occurrence_count: 1,
          resolved_status: 'mastered',
          last_mistake_at: todayIso,
        },
      ],
      examAttempts: [
        {
          id: 'ex_hsk2',
          hskLevel: 2,
          score: 160,
          totalPoints: 200,
          timeSpent: 1800,
          submittedAt: '2026-11-01T10:00:00Z',
        },
        {
          id: 'ex_hsk3',
          hskLevel: 3,
          score: 240,
          totalPoints: 300,
          timeSpent: 3600,
          submittedAt: todayIso,
        },
      ],
    });

    assert.equal(snap.isEmpty, false);
    assert.equal(snap.heatmap.length, 180);
    assert.equal(snap.kpis.activeMistakesCount, 1);
    assert.ok(snap.kpis.totalStudyHours >= 1.5);
    assert.ok(snap.kpis.hskReadinessScore > 0 && snap.kpis.hskReadinessScore <= 99);

    const listening = snap.skillRadar.find((s) => s.skillKey === 'listening');
    assert.equal(listening?.proficiency, 100);
    assert.equal(listening?.targetBenchmark, 80);

    assert.equal(snap.errorPatterns[0].errorCategory, 'tone_confusion');
    assert.equal(snap.errorPatterns[0].totalOccurrences, 5);
    assert.equal(snap.errorPatterns[0].resolutionRate, 50);
    assert.equal(snap.errorPatterns[0].recommendedTab, 'pronunciation');

    assert.equal(snap.cbtProgress[0].maxScore, 200);
    assert.equal(snap.cbtProgress[0].normalizedPercent, 80);
    assert.equal(snap.cbtProgress[1].maxScore, 300);
    assert.equal(snap.cbtProgress[1].normalizedPercent, 80);
  });

  it('provides benchmark thresholds and error-to-action mappings', () => {
    assert.equal(getTargetBenchmarkForLevel(1), 75);
    assert.equal(getTargetBenchmarkForLevel(4), 80);
    assert.equal(getTargetBenchmarkForLevel(6), 85);

    const action = mapErrorCategoryToAction('word_order_syntax');
    assert.equal(action.recommendedTab, 'practice');
    assert.equal(action.recommendedSkill, 'grammar');

    assert.equal(calculateHskReadinessScore([], [], 3), 0);
  });

  it('executes selector snapshot in well under 200ms for 500 events over 180 days', () => {
    const events = [];
    const now = Date.now();
    for (let i = 0; i < 500; i += 1) {
      events.push(
        normalizeLearningEvent({
          sourceModule: 'lesson',
          hskLevel: 4,
          skillDomain: 'reading',
          itemId: `item_${i}`,
          isCorrect: i % 3 !== 0,
          durationMs: 15000,
          createdAt: new Date(now - (i % 180) * 86400000).toISOString(),
        })
      );
    }

    const t0 = performance.now();
    const snap = computeStudentAnalyticsSnapshot({
      hskLevel: 4,
      daysWindow: 180,
      localEvents: events,
      localMistakes: [],
      examAttempts: [],
    });
    const elapsedMs = performance.now() - t0;

    assert.equal(snap.heatmap.length, 180);
    assert.ok(elapsedMs < 200, `Expected < 200ms, got ${elapsedMs}ms`);
  });

  it('SQL migration and React dashboard component satisfy architectural requirements', () => {
    const sql = fs.readFileSync(
      path.join(projectRoot, 'supabase/migrations/20261112_student_analytics_rpc.sql'),
      'utf8'
    );
    assert.match(sql, /CREATE OR REPLACE FUNCTION public\.get_student_skill_radar/);
    assert.match(sql, /CREATE OR REPLACE FUNCTION public\.get_study_activity_heatmap/);
    assert.match(sql, /CREATE OR REPLACE FUNCTION public\.get_top_error_patterns/);
    assert.match(sql, /CREATE OR REPLACE VIEW public\.student_telemetry_daily_summary/);

    const ui = fs.readFileSync(
      path.join(projectRoot, 'src/features/analytics/StudentAnalyticsDashboard.tsx'),
      'utf8'
    );
    assert.match(ui, /useMemo/);
    assert.match(ui, /Practice Weaknesses Now/);
    assert.match(ui, /Multi-Skill Proficiency Radar Chart/);
    assert.match(ui, /Dual-axis CBT Mock Exam and Daily Study Chart/);
  });
});

