import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculate4SkillCompetency,
  generateStudyPrescriptions,
  generateActivityHeatmapData,
  HSK_MATURE_VOCAB_BENCHMARKS
} from '../src/utils/competencyAnalytics.js';

describe('Competency Analytics - 4-Skill Pure Math Formulation', () => {
  it('returns exactly 0 for brand new user with empty learning data (no NaN, no crash)', () => {
    const scores = calculate4SkillCompetency({});
    assert.strictEqual(scores.listening, 0);
    assert.strictEqual(scores.speaking, 0);
    assert.strictEqual(scores.reading, 0);
    assert.strictEqual(scores.writing, 0);
    assert.strictEqual(scores.overall, 0);
    assert.ok(!isNaN(scores.overall));
  });

  it('accurately computes listening score based on completed steps and exam scores', () => {
    // 20/20 audio steps (100% * 0.40 = 40)
    // Exam listening average: 85 (85 * 0.40 = 34)
    // Blind audio sessions: 10/10 (100% * 0.20 = 20)
    // Total = 40 + 34 + 20 = 94
    const res = calculate4SkillCompetency({
      completedAudioSteps: 20,
      totalTargetAudioSteps: 20,
      examListeningScores: [80, 90], // avg = 85
      blindAudioSessionsCount: 10
    });

    assert.strictEqual(res.listening, 94);
  });

  it('accurately computes speaking score from pronunciation and roleplay missions', () => {
    // Pronunciation average: 90 (90 * 0.50 = 45)
    // Roleplay: 6/10 missions (60% * 0.50 = 30)
    // Total = 45 + 30 = 75
    const res = calculate4SkillCompetency({
      pronunciationScores: [92, 88],
      roleplayCompletedMissions: 6,
      roleplayTotalMissions: 10
    });

    assert.strictEqual(res.speaking, 75);
  });

  it('accurately scales reading score against target HSK mature vocabulary benchmark', () => {
    // Target HSK 1: 150 mature cards benchmark
    // User has 150 cards -> 100%
    // Exam reading avg = 90
    // Smart reader completed: 5 articles (50%)
    // Reading = (100 * 0.4) + (90 * 0.4) + (50 * 0.2) = 40 + 36 + 10 = 86
    const res = calculate4SkillCompetency({
      targetLevel: 'HSK 1',
      matureSrsCardsCount: 150,
      examReadingScores: [90],
      smartReaderCompletedArticles: 5
    });

    assert.strictEqual(res.reading, 86);
  });

  it('accurately scales writing score from stroke accuracy and unique character count', () => {
    // Target HSK 1: 50 characters benchmark
    // User has practiced 25 unique chars -> 50%
    // Average stroke accuracy: 90%
    // Writing = (90 * 0.6) + (50 * 0.4) = 54 + 20 = 74
    const res = calculate4SkillCompetency({
      targetLevel: 'HSK 1',
      writingStrokeScores: [95, 85],
      uniqueCharsPracticedCount: 25
    });

    assert.strictEqual(res.writing, 74);
  });

  it('computes overall average score across all 4 dimensions', () => {
    const res = calculate4SkillCompetency({
      completedAudioSteps: 20,
      totalTargetAudioSteps: 20,
      examListeningScores: [85],
      blindAudioSessionsCount: 10,
      pronunciationScores: [90],
      roleplayCompletedMissions: 10,
      roleplayTotalMissions: 10,
      matureSrsCardsCount: 150,
      targetLevel: 'HSK 1',
      smartReaderCompletedArticles: 10,
      examReadingScores: [90],
      writingStrokeScores: [90],
      uniqueCharsPracticedCount: 50
    });

    assert.ok(res.overall >= 85 && res.overall <= 100);
  });
});

describe('Competency Analytics - Actionable Study Prescriptions', () => {
  it('generates high-priority prescription targeting the weakest skill', () => {
    const competency = {
      listening: 85,
      speaking: 80,
      reading: 75,
      writing: 42 // Lowest skill
    };

    const pres = generateStudyPrescriptions(competency, 'HSK 2');
    assert.strictEqual(pres.weakestSkill, 'writing');
    assert.strictEqual(pres.prescriptions[0].skill, 'writing');
    assert.strictEqual(pres.prescriptions[0].actionPath, '/writing');
    assert.ok(pres.prescriptions[0].description.includes('42/100'));
  });
});

describe('Competency Analytics - 365-Day Activity Heatmap', () => {
  it('generates 365 days of deterministic heatmap data for a normal year', () => {
    const activityMap = {
      '2026-01-01': { count: 3, xp: 150 },
      '2026-05-20': { count: 10, xp: 500 }
    };

    const heatmap = generateActivityHeatmapData(activityMap, 2026);
    assert.strictEqual(heatmap.year, 2026);
    assert.strictEqual(heatmap.totalDays, 365);
    assert.strictEqual(heatmap.activeDays, 2);
    assert.strictEqual(heatmap.totalXp, 650);

    const day1 = heatmap.days.find(d => d.date === '2026-01-01');
    assert.strictEqual(day1.intensity, 3);

    const day2 = heatmap.days.find(d => d.date === '2026-05-20');
    assert.strictEqual(day2.intensity, 4);

    const emptyDay = heatmap.days.find(d => d.date === '2026-02-01');
    assert.strictEqual(emptyDay.intensity, 0);
  });
});
