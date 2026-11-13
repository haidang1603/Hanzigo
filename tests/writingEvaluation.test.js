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
  HSK_WRITING_PROMPTS,
  countChineseCharacters,
  runDeterministicPreChecks,
  parseWritingEvaluationResponse,
  evaluateHskWriting,
} = await import('../src/services/writingEvaluationService.ts');

const {
  getPendingLearningEvents,
  getLocalMistakeRecords,
  configureLearningDataService,
} = await import('../src/services/learningDataService.ts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Task 26.05: HSK Writing & Translation Evaluation', () => {
  const user = { id: '11111111-1111-4111-8111-111111111111' };

  beforeEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
    configureLearningDataService({ flushDebounceMs: 60000 });
  });

  it('supports all 5 HSK 4-6 task formats and counts Chinese characters', () => {
    const types = HSK_WRITING_PROMPTS.map((p) => p.taskType);
    assert.deepEqual(types, [
      'hsk4_reorder',
      'hsk4_picture_keyword',
      'hsk5_keywords_essay',
      'hsk5_picture_essay',
      'hsk6_summary',
    ]);

    assert.equal(countChineseCharacters('请把桌子上的那本词典拿给我。'), 13);
  });

  it('runs deterministic pre-checks for keywords, HSK 6 subjective opinion, and 病句', () => {
    const hsk5Task = HSK_WRITING_PROMPTS.find((p) => p.taskType === 'hsk5_keywords_essay');
    const pre5 = runDeterministicPreChecks(
      hsk5Task,
      '我每天坚持学习汉语，老师经常鼓励我，我学到了很多经验'
    );
    assert.deepEqual(pre5.usedKeywords, ['坚持', '经验', '鼓励']);
    assert.deepEqual(pre5.missingKeywords, ['克服', '收获']);
    assert.equal(pre5.withinLengthRange, false);
    assert.equal(pre5.hasSentenceEndPunctuation, false);

    const hsk6Task = HSK_WRITING_PROMPTS.find((p) => p.taskType === 'hsk6_summary');
    const pre6 = runDeterministicPreChecks(
      hsk6Task,
      '我认为林先生经营的旧书店非常感人，他把笔记本还给了小周。'
    );
    assert.deepEqual(pre6.subjectiveMarkersFound, ['我认为']);
    assert.ok(pre6.detectedIssues.some((i) => i.hsk_grammar_point.includes('HSK 6')));
  });

  it('parses markdown-fenced AI JSON strictly and falls back safely on malformed JSON', () => {
    const hsk4Task = HSK_WRITING_PROMPTS.find((p) => p.taskType === 'hsk4_reorder');
    const text = '请把桌子上的那本词典拿给我。';
    const pre = runDeterministicPreChecks(hsk4Task, text);

    const fencedJson = [
      '```json',
      JSON.stringify({
        dimensions: {
          task_fulfillment: 24,
          grammar_accuracy: 25,
          vocabulary_richness: 22,
          coherence_cohesion: 23,
        },
        inline_corrections: [],
        model_rewrites: {
          band_pass: '请把桌子上的那本词典拿给我。',
          high_scoring_native: '麻烦您把桌子上的那本词典递给我。',
        },
      }),
      '```',
    ].join('\n');

    const parsedAi = parseWritingEvaluationResponse(fencedJson, hsk4Task, text, pre);
    assert.equal(parsedAi.evaluationSource, 'ai_gateway');
    assert.equal(parsedAi.overall_score, 94);
    assert.equal(parsedAi.dimensions.grammar_accuracy, 25);

    const malformed = parseWritingEvaluationResponse('{broken json...', hsk4Task, text, pre);
    assert.equal(malformed.evaluationSource, 'deterministic_rubric');
    assert.ok(malformed.overall_score > 0 && malformed.overall_score <= 100);
    assert.ok(malformed.model_rewrites.band_pass.length > 0);
  });

  it('logs writing_eval telemetry events and pushes inline corrections into user_mistake_records', async () => {
    const hsk5Task = HSK_WRITING_PROMPTS.find((p) => p.taskType === 'hsk5_keywords_essay');
    const res = await evaluateHskWriting({
      user,
      task: hsk5Task,
      responseText: '我坚持学习了过很多年，把。',
      durationMs: 45000,
    });

    assert.ok(res.overall_score >= 0 && res.overall_score <= 100);
    assert.ok(res.inline_corrections.length >= 1);

    const events = getPendingLearningEvents();
    assert.ok(events.some((e) => e.source_module === 'writing_eval' && e.item_id === hsk5Task.id));

    const mistakes = getLocalMistakeRecords(user.id);
    assert.ok(mistakes.length >= 1);
  });

  it('HskWritingEvaluator.tsx includes live counter, HSK 6 timer, and interactive diff viewer', () => {
    const ui = fs.readFileSync(
      path.join(projectRoot, 'src/features/writing/HskWritingEvaluator.tsx'),
      'utf8'
    );
    assert.match(ui, /HSK 6 缩写 Timer/);
    assert.match(ui, /Số chữ Hán:/);
    assert.match(ui, /Add to Mistake Notebook/);
    assert.match(ui, /Band-Pass Version/);
    assert.match(ui, /High-Scoring Native Version/);
  });
});

