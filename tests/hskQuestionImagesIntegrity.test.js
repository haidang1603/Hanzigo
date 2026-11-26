import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { HSK_QUESTIONS, HSK_EXAMS } from '../src/data/hskExamsData.js';
import { loadAllHsk30Exams, loadHsk20FullExpansion } from '../src/data/hsk30/index.js';
import { enrichQuestionWithImageAsset } from '../src/data/hskQuestionImageRegistry.js';
import { shuffleSessionQuestions } from '../src/utils/examOptionShuffler.js';
import { buildQuestionAnswerSnapshot } from '../src/utils/examAttemptSnapshot.js';
import * as s2 from '../src/data/examSupplements/hsk2Mock01Supplement.js';
import * as s4 from '../src/data/examSupplements/hsk4Mock01Supplement.js';

const HANZI_REGEX = /[\u4e00-\u9fff]/;

describe('HSK 1-5 Local Image Asset Pipeline Integrity', () => {
  test('1. All imageUrl & optionImages use local /images/hsk/ paths, exist on disk, and pass SVG/WebP safety limits', async () => {
    const h30Banks = await loadAllHsk30Exams();
    const exp20 = await loadHsk20FullExpansion();
    const sup2 = (Object.values(s2).find(Array.isArray) || []).map((q) => enrichQuestionWithImageAsset(q, 'HSK 2'));
    const sup4 = (Object.values(s4).find(Array.isArray) || []).map((q) => enrichQuestionWithImageAsset(q, 'HSK 4'));

    const allQuestions = [
      ...HSK_QUESTIONS,
      ...exp20,
      ...sup2,
      ...sup4,
      ...h30Banks.flatMap((b) => b.questions || []),
    ];

    const examLevelById = new Map(HSK_EXAMS.map((e) => [e.id, e.level]));
    const referencedPaths = new Set();

    for (const q of allQuestions) {
      if (q.imageUrl !== undefined) {
        assert.equal(typeof q.imageUrl, 'string', `${q.id} imageUrl must be string`);
        assert.ok(q.imageUrl.startsWith('/images/hsk/'), `${q.id} must use local /images/hsk/ path, got ${q.imageUrl}`);
        assert.ok(!/^https?:|^data:/i.test(q.imageUrl), `${q.id} must never hotlink or inline base64`);
        assert.ok(q.imageAlt && q.imageAlt.length >= 6, `${q.id} must include neutral imageAlt`);
        assert.ok(!HANZI_REGEX.test(q.imageAlt), `${q.id} imageAlt must not leak Chinese characters/answers: ${q.imageAlt}`);
        referencedPaths.add(q.imageUrl);
        const diskFile = path.resolve('public', q.imageUrl.replace(/^\//, ''));
        assert.ok(fs.existsSync(diskFile), `Missing image asset on disk: ${diskFile} for ${q.id}`);
      }
      if (Array.isArray(q.optionImages)) {
        for (const optImg of q.optionImages) {
          assert.ok(String(optImg).startsWith('/images/hsk/'), `${q.id} optionImage must be local`);
          referencedPaths.add(optImg);
          const diskFile = path.resolve('public', String(optImg).replace(/^\//, ''));
          assert.ok(fs.existsSync(diskFile), `Missing optionImage on disk: ${diskFile}`);
        }
      }

      // Check 100% HSK 1-2 Listening/Reading P1-P2 coverage
      const lvl = q.level || examLevelById.get(q.exam_id) || '';
      const skill = q.part_type || q.skill;
      const part = Number(q.part_number || q.part || 0);
      if ((lvl === 'HSK 1' || lvl === 'HSK 2') && (skill === 'listening' || skill === 'reading') && (part === 1 || part === 2)) {
        assert.ok(q.imageUrl, `HSK 1-2 ${skill} P${part} question ${q.id} must have imageUrl`);
      }
    }

    // Check 11 HSK 4-5 picture writing IDs
    const requiredHsk45Ids = [
      'q-hsk4-01-29',
      'q-hsk4-03-09',
      'hsk4-mock-01-sup-68',
      'hsk4-mock-01-sup-69',
      'hsk4-mock-01-sup-70',
      'hsk30-l4-wri-p1-01',
      'hsk30-l4-wri-p1-02',
      'hsk30-l4-wri-p1-03',
      'hsk30-l4-wri-p1-04',
      'hsk30-l4-wri-p1-05',
      'hsk30-l5-wri-p1-01',
    ];
    const byId = new Map(allQuestions.map((q) => [q.id, q]));
    for (const reqId of requiredHsk45Ids) {
      const q = byId.get(reqId);
      assert.ok(q, `Expected picture writing question ${reqId} to exist`);
      assert.ok(q.imageUrl && q.imageUrl.startsWith('/images/hsk/'), `${reqId} must have local imageUrl`);
    }

    // Check every file under public/images/hsk/ size, security & manifest coverage
    const manifestPath = path.resolve('docs/HSK_IMAGE_ASSETS_MANIFEST.json');
    assert.ok(fs.existsSync(manifestPath), 'docs/HSK_IMAGE_ASSETS_MANIFEST.json must exist');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const manifestByPath = new Map((manifest.assets || []).map((a) => [a.path, a]));

    for (const sub of ['sourced', 'generated']) {
      const dir = path.resolve('public/images/hsk', sub);
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (!stat.isFile()) continue;
        const webPath = `/images/hsk/${sub}/${name}`;
        const kb = stat.size / 1024;
        assert.ok(kb <= 60, `${webPath} exceeds 60 KB hard cap (${kb.toFixed(2)} KB)`);
        if (name.endsWith('.svg')) {
          assert.ok(kb <= 12, `${webPath} SVG exceeds 12 KB cap (${kb.toFixed(2)} KB)`);
          const svgText = fs.readFileSync(full, 'utf8');
          assert.ok(!/<script/i.test(svgText), `${webPath} SVG must not contain <script>`);
          assert.ok(!/\son\w+=/i.test(svgText), `${webPath} SVG must not contain inline event handlers`);
          assert.ok(!/<text[\s>]/i.test(svgText), `${webPath} SVG must not contain <text> elements`);
        }
        const entry = manifestByPath.get(webPath);
        assert.ok(entry, `${webPath} missing from HSK_IMAGE_ASSETS_MANIFEST.json`);
        assert.ok(Array.isArray(entry.usedByQuestionIds) && entry.usedByQuestionIds.length > 0, `${webPath} must be used by at least 1 question`);
      }
    }
    assert.ok(referencedPaths.size >= 30, 'Should utilize diverse local HSK visual assets');
  });

  test('2. Dynamic option shuffler keeps optionImages synchronized with shuffled options and correctIndex', () => {
    const sample = [
      {
        id: 'img-shuffle-q1',
        question_type: 'multiple_choice',
        options: ['甲', '乙', '丙', '丁'],
        optionImages: [
          '/images/hsk/sourced/tea-cup.svg',
          '/images/hsk/sourced/coffee-cup.svg',
          '/images/hsk/sourced/train-rail.svg',
          '/images/hsk/sourced/white-dog.svg',
        ],
        correct_option_index: 2,
      },
    ];
    const shuffled = shuffleSessionQuestions(sample, { enabled: true, sessionSeed: 'seed-img-2026' });
    const q = shuffled[0];
    assert.equal(q.options[q.correct_option_index], '丙');
    assert.equal(q.optionImages[q.correct_option_index], '/images/hsk/sourced/train-rail.svg');
  });

  test('3. Immutable answer snapshot preserves safe local imageUrl and strips external/base64 URIs', () => {
    const safeSnap = buildQuestionAnswerSnapshot(
      {
        id: 'snap-img-1',
        skill: 'listening',
        part: 1,
        questionType: 'mcq',
        prompt: '请选择正确的图片',
        imageUrl: '/images/hsk/generated/hsk12-classroom-teacher.webp',
        imageAlt: 'Hình minh họa lớp học HSK 1',
        options: ['A', 'B'],
        correctIndex: 0,
      },
      { userAnswer: 0, isCorrect: true }
    );
    assert.equal(safeSnap.imageUrl, '/images/hsk/generated/hsk12-classroom-teacher.webp');
    assert.equal(safeSnap.imageAlt, 'Hình minh họa lớp học HSK 1');

    const unsafeSnap = buildQuestionAnswerSnapshot(
      {
        id: 'snap-img-2',
        skill: 'reading',
        part: 1,
        questionType: 'mcq',
        prompt: '测试',
        imageUrl: 'data:image/png;base64,AAAA1234',
        options: ['A', 'B'],
        correctIndex: 0,
      },
      { userAnswer: 0, isCorrect: true }
    );
    assert.equal(unsafeSnap.imageUrl, undefined);
  });
});
