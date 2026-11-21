import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  trackLearningEvent,
  getTelemetryBuffer,
  getTelemetryLocalHistory,
  clearTelemetryLocalState,
  computeLocalTelemetrySnapshot,
} from '../src/core/telemetry/learningTelemetryService.js';
import {
  buildDailyAiPrescription,
  buildDeterministicTelemetryBriefing,
} from '../src/features/analytics/aiStudyPrescriptionEngine.js';
import {
  HSK_30_TOTAL_VOCAB_COUNT,
  HSK_30_BANDS,
  getLocalHsk79Flashcards,
  fetchHsk30FlashcardBatch,
} from '../src/services/hsk30FlashcardDeckService.js';
import {
  createCustomYouTubeVideo,
  saveCustomYouTubeVideo,
  listImmersionVideos,
} from '../src/services/videoStudioService.ts';
import {
  importWebContentOrText,
  listImportedWebArticles,
} from '../src/services/articleImporterService.ts';
import {
  createCustomReadingArticle,
  listReadingArticles,
} from '../src/services/readingStudioService.ts';
import {
  processImageWithOCR,
  listOcrDocuments,
} from '../src/services/ocrScannerService.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function readRepoFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function extractValidTabsFromApp() {
  const appSrc = readRepoFile('src/App.jsx');
  const match = appSrc.match(/const VALID_TABS\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(match, 'VALID_TABS must exist in src/App.jsx');
  return Array.from(match[1].matchAll(/'([^']+)'/g)).map((m) => m[1]);
}

test('learningTelemetryService queues events, computes retention & latency, and handles empty/guest mode safely', () => {
  clearTelemetryLocalState();

  // Safe when localStorage is absent / empty and user is null (Guest mode)
  const emptySnap = computeLocalTelemetrySnapshot({ events: [], vocabItems: [], roadmapProgress: {} });
  assert.equal(emptySnap.retention_rate_pct, 0);
  assert.equal(emptySnap.avg_response_latency_ms.overall, 0);
  assert.equal(emptySnap.srs_forecast_7d.length, 7);
  assert.equal(emptySnap.hskHeatmap.length, 9);

  // Starter demo items (vitem-1..4, starter-1) must be excluded so 0 real study = 0%
  const starterOnlySnap = computeLocalTelemetrySnapshot({
    events: [],
    vocabItems: [
      { id: 'vitem-1', simplified: '你好', repetitions: 1, lapses: 0, meaning_mastery: 55, writing_mastery: 40, pronunciation_mastery: 65 },
      { id: 'starter-1', simplified: '学习', repetitions: 2, lapses: 0, meaning_mastery: 90, writing_mastery: 80, pronunciation_mastery: 85 },
    ],
    roadmapProgress: {},
  });
  assert.equal(starterOnlySnap.retention_rate_pct, 0);
  assert.equal(starterOnlySnap.triDimensionalMastery.meaningPct, 0);

  // Queue events via trackLearningEvent
  const nowIso = new Date().toISOString();
  trackLearningEvent({
    event_type: 'vocab_review',
    hsk_level: 3,
    lesson_id: 42,
    target_key: '把',
    is_correct: true,
    latency_ms: 4000,
    created_at: nowIso,
  });
  trackLearningEvent({
    event_type: 'vocab_review',
    hsk_level: 3,
    lesson_id: 42,
    target_key: '被',
    is_correct: false,
    latency_ms: 18000,
    created_at: nowIso,
  });
  trackLearningEvent({
    event_type: 'grammar_drill',
    hsk_level: 3,
    lesson_id: 42,
    target_key: 'HSK3-BA-01',
    is_correct: false,
    latency_ms: 28000,
    created_at: nowIso,
  });
  trackLearningEvent({
    event_type: 'listening_ab_loop',
    hsk_level: 3,
    lesson_id: 42,
    target_key: 'L42-AUDIO-1',
    is_correct: true,
    latency_ms: 10000,
    created_at: nowIso,
  });

  const buffer = getTelemetryBuffer();
  const history = getTelemetryLocalHistory();
  assert.equal(buffer.length, 4);
  assert.equal(history.length, 4);

  const snap = computeLocalTelemetrySnapshot({
    events: history,
    vocabItems: [
      {
        id: 'v1',
        simplified: '影响',
        pinyin: 'yǐngxiǎng',
        meaning_vi: 'Ảnh hưởng',
        meaning_mastery: 90,
        writing_mastery: 35,
        pronunciation_mastery: 70,
        next_review_at: nowIso,
      },
    ],
    roadmapProgress: { completedLessons: [1, 2, 3, 21] },
  });

  // 1 of 2 vocab_review events was correct => 50%
  assert.equal(snap.retention_rate_pct, 50);
  // Listening avg = 10000ms, Grammar avg = 28000ms, Overall avg = (4000+18000+28000+10000)/4 = 15000ms
  assert.equal(snap.avg_response_latency_ms.listening, 10000);
  assert.equal(snap.avg_response_latency_ms.grammar, 28000);
  assert.equal(snap.avg_response_latency_ms.overall, 15000);
  assert.ok(snap.top_cognitive_bottlenecks.length >= 2);
  assert.equal(snap.srs_forecast_7d[0].due_count, 1);
  assert.equal(snap.hskHeatmap[0].completedCount, 3);
  assert.equal(snap.hskHeatmap[1].completedCount, 1);

  clearTelemetryLocalState();
});

test('aiStudyPrescriptionEngine detects weakest dimension (writing vs pronunciation vs meaning) and emits 4 VALID_TABS routes', () => {
  const validTabs = extractValidTabsFromApp();

  // Case 1: writing is weakest
  const rxWriting = buildDailyAiPrescription({
    vocabItems: [
      {
        id: 'w1',
        simplified: '习惯',
        pinyin: 'xíguàn',
        meaning_vi: 'Thói quen',
        meaning_mastery: 88,
        writing_mastery: 25,
        pronunciation_mastery: 72,
      },
    ],
    roadmapProgress: { completedLessons: [1, 2] },
  });
  assert.equal(rxWriting.weakestDimension, 'writing');
  assert.equal(rxWriting.tasks.length, 4);
  assert.equal(rxWriting.tasks[0].route, 'writing');
  assert.equal(rxWriting.recommendedNextLessonId, 3);
  for (const task of rxWriting.tasks) {
    assert.ok(validTabs.includes(task.route), `Route "${task.route}" must be in VALID_TABS`);
  }

  // Case 2: pronunciation is weakest
  const rxPron = buildDailyAiPrescription({
    vocabItems: [
      {
        id: 'p1',
        simplified: '知道',
        pinyin: 'zhīdào',
        meaning_vi: 'Biết',
        meaning_mastery: 85,
        writing_mastery: 78,
        pronunciation_mastery: 30,
      },
    ],
    roadmapProgress: { completedLessons: Array.from({ length: 125 }, (_, i) => i + 1) },
  });
  assert.equal(rxPron.weakestDimension, 'pronunciation');
  assert.equal(rxPron.tasks[0].route, 'pronunciation');
  assert.equal(rxPron.recommendedNextLessonId, 126);
  for (const task of rxPron.tasks) {
    assert.ok(validTabs.includes(task.route), `Route "${task.route}" must be in VALID_TABS`);
  }

  // Case 3: meaning is weakest + deterministic briefing
  const rxMeaning = buildDailyAiPrescription({
    vocabItems: [
      {
        id: 'm1',
        simplified: '尽管',
        pinyin: 'jǐnguǎn',
        meaning_vi: 'Mặc dù',
        meaning_mastery: 32,
        writing_mastery: 80,
        pronunciation_mastery: 75,
      },
    ],
  });
  assert.equal(rxMeaning.weakestDimension, 'meaning');
  assert.equal(rxMeaning.tasks[0].route, 'vocabulary');

  // Case 4: empty vocabItems must NOT emit fake placeholder words
  const rxEmpty = buildDailyAiPrescription({ vocabItems: [] });
  assert.equal(rxEmpty.prescribedTargets.vocabTargets.length, 0);
  assert.equal(rxEmpty.prescribedTargets.writingCharacters.length, 0);

  const briefing = buildDeterministicTelemetryBriefing(
    { retention_rate_pct: 78 },
    rxMeaning
  );
  assert.ok(briefing.summary.includes('78%'));
  assert.ok(briefing.examTactic.length > 10);
});

test('SQL migration 3801 defines user_learning_telemetry_events, RLS policies, and hardened RPC', () => {
  const sql = readRepoFile('supabase/migrations/20261117_3801_learning_telemetry_hub.sql');

  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_learning_telemetry_events/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
  assert.match(sql, /user_learning_telemetry_select_own/);
  assert.match(sql, /user_learning_telemetry_insert_own/);
  assert.match(sql, /user_learning_telemetry_delete_own/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.get_user_telemetry_dashboard_summary/i);
  assert.match(sql, /SECURITY DEFINER/i);
  assert.match(sql, /SET search_path = public/i);
  assert.match(sql, /retention_rate_pct/);
  assert.match(sql, /avg_response_latency_ms/);
  assert.match(sql, /top_cognitive_bottlenecks/);
  assert.match(sql, /srs_forecast_7d/);
});

test('AI Coach, LearningIntelligenceHub, and DailySmartStudyFlow integrate Smart Learning Telemetry Hub with Asian-Modern theme', () => {
  const coachSrc = readRepoFile('api/_handlers/ai/coach.js');
  assert.match(coachSrc, /generate_telemetry_briefing/);
  assert.match(coachSrc, /deterministic_fallback/);

  const hubSrc = readRepoFile('src/features/intelligence/LearningIntelligenceHub.tsx');
  assert.match(hubSrc, /TelemetryVisualAnalyticsGrid/);
  assert.match(hubSrc, /HskReadinessRadarCard/);
  assert.match(hubSrc, /Khởi chạy Phiên Học Thích Ứng 15 Phút/);
  assert.match(hubSrc, /prescribedTargets=\{dailyPrescription\.prescribedTargets\}/);

  const dashSrc = readRepoFile('src/pages/DashboardPage.jsx');
  assert.doesNotMatch(dashSrc, /TelemetryVisualAnalyticsGrid/);

  const gridSrc = readRepoFile('src/features/analytics/TelemetryVisualAnalyticsGrid.jsx');
  assert.match(gridSrc, /#FFF9F2/);
  assert.match(gridSrc, /#E85D3F/);
  assert.doesNotMatch(gridSrc, /#0a0a1f/);

  const radarSrc = readRepoFile('src/features/analytics/HskReadinessRadarCard.jsx');
  assert.match(radarSrc, /#E85D3F/);
  assert.doesNotMatch(radarSrc, /#0a0a1f/);

  const flowSrc = readRepoFile('src/features/unified-ecosystem/DailySmartStudyFlow.tsx');
  assert.match(flowSrc, /prescribedTargets/);
  assert.match(flowSrc, /trackLearningEvent/);
});

test('hsk30FlashcardDeckService integrates 11,092 HSK 3.0 corpus bands & HSK 7-9 flashcards into VocabularyPage', async () => {
  assert.equal(HSK_30_TOTAL_VOCAB_COUNT, 11000);

  const bandSum =
    HSK_30_BANDS['HSK 1'].limit +
    HSK_30_BANDS['HSK 2'].limit +
    HSK_30_BANDS['HSK 3'].limit +
    HSK_30_BANDS['HSK 4'].limit +
    HSK_30_BANDS['HSK 5'].limit +
    HSK_30_BANDS['HSK 6'].limit +
    HSK_30_BANDS['HSK 7-9'].limit;
  assert.equal(bandSum, 11000);

  const localHsk79 = getLocalHsk79Flashcards();
  assert.ok(localHsk79.length >= 450, `Expected >= 450 HSK 7-9 local cards, got ${localHsk79.length}`);

  const batch = await fetchHsk30FlashcardBatch({ hskBand: 'HSK 7-9', page: 1, pageSize: 20 });
  assert.equal(batch.entries.length, 20);
  assert.ok(batch.entries[0].hanzi.length > 0);

  const vocabPageSrc = readRepoFile('src/pages/VocabularyPage.jsx');
  assert.match(vocabPageSrc, /fetchHsk30FlashcardBatch/);
  assert.match(vocabPageSrc, /Kho 11\.092 từ chuẩn HSK 3\.0/);
  assert.match(vocabPageSrc, /HSK 7-9/);
});

test('Video Studio, Web Article Importer, Reading Studio, and OCR Scanner isolate user content per user', async () => {
  const prevStorage = globalThis.localStorage;
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };

  try {
    const userA = { id: 'user-a-iso' };
    const userB = { id: 'user-b-iso' };

    // 1. Video Studio
    const customVideo = createCustomYouTubeVideo({
      youtubeUrlOrId: 'dQw4w9WgXcQ',
      titleZh: 'User A Video',
      titleVi: 'Video riêng của User A',
    });
    saveCustomYouTubeVideo(customVideo, userA);

    const videosA = await listImmersionVideos(userA);
    const videosB = await listImmersionVideos(userB);
    const videosGuest = await listImmersionVideos(null);

    assert.ok(videosA.some((v) => v.id === customVideo.id), 'User A should see their custom video');
    assert.ok(!videosB.some((v) => v.id === customVideo.id), 'User B must NOT see User A custom video');
    assert.ok(!videosGuest.some((v) => v.id === customVideo.id), 'Guest must NOT see User A custom video');

    // 2. Imported Web Link / Article
    const importedA = await importWebContentOrText({
      url: 'https://example.com/user-a-article',
      text: '今天天气很好，我去公园散步。',
      title: 'User A Web Article',
      user: userA,
    });
    const webA = await listImportedWebArticles(userA);
    const webB = await listImportedWebArticles(userB);
    const webGuest = await listImportedWebArticles(null);

    assert.ok(webA.some((a) => a.id === importedA.id), 'User A should see their imported web article');
    assert.ok(!webB.some((a) => a.id === importedA.id), 'User B must NOT see User A imported web article');
    assert.ok(!webGuest.some((a) => a.id === importedA.id), 'Guest must NOT see User A imported web article');

    // 3. Custom Reading Studio Article
    const readingA = await createCustomReadingArticle({
      titleZh: 'User A Reading',
      titleVi: 'Bài đọc riêng của User A',
      rawText: '我喜欢学习汉语。每天我都练习阅读。',
      hskLevel: 2,
      user: userA,
    });
    const listReadA = await listReadingArticles(userA);
    const listReadB = await listReadingArticles(userB);
    const listReadGuest = await listReadingArticles(null);

    assert.ok(listReadA.some((r) => r.id === readingA.id), 'User A should see their custom reading article');
    assert.ok(!listReadB.some((r) => r.id === readingA.id), 'User B must NOT see User A custom reading article');
    assert.ok(!listReadGuest.some((r) => r.id === readingA.id), 'Guest must NOT see User A custom reading article');

    // 4. OCR Scanner
    const ocrA = await processImageWithOCR({
      imageUrl: 'data:image/png;base64,AAA',
      title: 'User A Scan',
      simulatedLines: ['你好世界'],
      user: userA,
    });
    const ocrListA = await listOcrDocuments(userA);
    const ocrListB = await listOcrDocuments(userB);
    const ocrListGuest = await listOcrDocuments(null);

    assert.ok(ocrListA.some((d) => d.id === ocrA.id), 'User A should see their OCR scan');
    assert.ok(!ocrListB.some((d) => d.id === ocrA.id), 'User B must NOT see User A OCR scan');
    assert.ok(!ocrListGuest.some((d) => d.id === ocrA.id), 'Guest must NOT see User A OCR scan');
  } finally {
    globalThis.localStorage = prevStorage;
  }
});
