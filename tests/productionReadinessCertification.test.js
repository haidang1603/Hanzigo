import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { evaluateHskWriting } from '../src/services/writingEvaluationService.ts';
import { evaluateTranslationWithAi } from '../src/services/translationStudioService.ts';
import { sendRoleplayMessage } from '../src/services/roleplayService.js';
import { scorePronunciationWithAi } from '../src/services/aiPronunciationService.js';
import { submitExamAttempt, getExamForTaking } from '../src/services/hskService.js';
import gradeHandler from '../api/_handlers/ai/grade.js';
import pronunciationHandler from '../api/_handlers/ai/pronunciation.js';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

function collectFiles(dir, exts = ['.js', '.jsx', '.ts', '.tsx']) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

function createMockRes() {
  const state = { statusCode: 200, headers: {}, body: null };
  return {
    state,
    setHeader(k, v) {
      state.headers[k] = v;
    },
    status(code) {
      state.statusCode = code;
      return this;
    },
    json(payload) {
      state.body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
}

test('Pillar 1 & 2: Guest/Offline fallback works seamlessly when AI or submit API fails/aborts', async () => {
  localStorage.clear();
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;

  globalThis.fetch = async () => {
    const abortErr = new Error('The operation was aborted.');
    abortErr.name = 'AbortError';
    throw abortErr;
  };
  globalThis.window = {
    fetch: globalThis.fetch,
    localStorage: globalThis.localStorage,
  };

  try {
    const roleplayRes = await sendRoleplayMessage({
      userMessage: '我想买这件衣服',
      targetVocab: ['衣服'],
    });
    assert.equal(roleplayRes.mode, 'client_local_fallback');
    assert.ok(roleplayRes.replyHanzi.length > 0);

    const pronRes = await scorePronunciationWithAi({
      targetHanzi: '你好',
      targetPinyin: 'nǐ hǎo',
      spokenTranscript: '你好',
      audioDurationMs: 900,
    });
    assert.equal(pronRes.isAiEvaluated, false);
    assert.ok(typeof pronRes.overall === 'number');

    const writingRes = await evaluateHskWriting({
      task: {
        id: 'hsk5-w1',
        hskLevel: 5,
        taskType: 'sentence_creation',
        instructionVi: 'Dùng từ 保护 viết đoạn ngắn',
        promptText: '保护 环境',
        mandatoryKeywords: ['保护'],
        targetMinChars: 10,
        targetMaxChars: 120,
      },
      responseText: '我们每个人都应该保护环境，让地球变得更加美好。',
      user: null,
    });
    assert.ok(writingRes.overall_score >= 0 && writingRes.overall_score <= 100);

    const transRes = await evaluateTranslationWithAi(
      {
        id: 'drill-test-1',
        direction: 'vi_to_zh',
        level: 'hsk3',
        domain_slug: 'daily',
        source_text: 'Hôm nay thời tiết rất tốt.',
        reference_translations: ['今天天气很好。'],
        required_keywords: [
          { word_or_pattern: '天气', pinyin: 'tiānqì', hint_vi: 'thời tiết' },
        ],
        translation_pitfalls_vi: '',
      },
      '今天天气很好。'
    );
    assert.ok(transRes.overall_score >= 0 && transRes.overall_score <= 100);

    const fullExam = await getExamForTaking('hsk1-mock-01');
    if (fullExam?.questions?.length) {
      const attempt = await submitExamAttempt({
        examId: fullExam.id,
        submittedAnswers: { [fullExam.questions[0].id]: 0 },
        timeSpentSeconds: 120,
        user: null,
      });
      assert.equal(attempt.examId, fullExam.id);
      assert.ok(typeof attempt.score === 'number' && typeof attempt.cbtScore === 'number');
    }
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test('Pillar 1: Privacy consent banner, HSK draft recovery, and LiveKit whiteboard integration exist', () => {
  const bannerSrc = fs.readFileSync(path.resolve('src/components/legal/CookieStorageConsentBanner.jsx'), 'utf8');
  assert.ok(bannerSrc.includes('acceptEssentialOnlyPreferences'));
  assert.ok(bannerSrc.includes('Cookie phân tích mặc định'));

  const hskPageSrc = fs.readFileSync(path.resolve('src/pages/HskPracticePage.jsx'), 'utf8');
  assert.ok(hskPageSrc.includes('getTemporaryExamSession'));
  assert.ok(hskPageSrc.includes('saveTemporaryAnswers'));

  const livePageSrc = fs.readFileSync(path.resolve('src/pages/LiveClassroomPage.jsx'), 'utf8');
  assert.ok(livePageSrc.includes('LiveKitClassroomManager'));
  assert.ok(livePageSrc.includes('LiveHanziWhiteboardStage'));
});

test('Pillar 2: All frontend AI/TTS/HSK fetch calls enforce AbortController timeouts and anti-double-submit guards', () => {
  const timeoutFiles = [
    'src/utils/audio.js',
    'src/services/hskService.js',
    'src/services/aiPronunciationService.js',
    'src/services/roleplayService.js',
    'src/services/aiTutorService.js',
    'src/core/ecosystem/UnifiedToolsContext.tsx',
    'src/features/hskk-exam/hskkEngine.ts',
    'src/services/translationStudioService.ts',
    'src/services/writingEvaluationService.ts',
  ];

  for (const relPath of timeoutFiles) {
    const content = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.ok(content.includes('AbortController'), `${relPath} must use AbortController timeout`);
    assert.ok(content.includes('clearTimeout'), `${relPath} must clearTimeout cleanly in finally`);
  }

  const drawerSrc = fs.readFileSync(path.resolve('src/features/unified-ecosystem/UniversalSlideOverDrawer.tsx'), 'utf8');
  assert.ok(drawerSrc.includes('disabled={isSavingVocab}'), 'UniversalSlideOverDrawer must lock Save button while saving');

  const barSrc = fs.readFileSync(path.resolve('src/features/unified-ecosystem/GlobalTextSelectionActionBar.tsx'), 'utf8');
  assert.ok(barSrc.includes('disabled={isSaving}'), 'GlobalTextSelectionActionBar must lock Save button while saving');
});

test('Pillar 3: AppSec checks — zero dangerouslySetInnerHTML in src/, API rate-limit, maxLength, and server RBAC', async () => {
  const srcFiles = collectFiles(path.resolve('src'));
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.ok(
      !content.includes('dangerouslySetInnerHTML'),
      `Unsafe dangerouslySetInnerHTML found in ${path.relative(process.cwd(), file)}`
    );
  }

  // Test oversized payload rejection on /api/ai/grade
  const oversizedRes = createMockRes();
  await gradeHandler(
    {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid_student_token',
        'x-real-ip': '127.0.0.10',
      },
      body: { type: 'writing', responseText: '汉'.repeat(3500) },
    },
    oversizedRes
  );
  assert.equal(oversizedRes.state.statusCode, 400);

  // Test oversized payload rejection on /api/ai/pronunciation
  const oversizedPronRes = createMockRes();
  await pronunciationHandler(
    {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid_student_token',
        'x-real-ip': '127.0.0.11',
      },
      body: { targetHanzi: '汉'.repeat(250), spokenTranscript: 'test' },
    },
    oversizedPronRes
  );
  assert.equal(oversizedPronRes.state.statusCode, 400);

  // Verify rate limit + RBAC wiring across sensitive API endpoints
  const gradeSrc = fs.readFileSync(path.resolve('api/_handlers/ai/grade.js'), 'utf8');
  assert.ok(gradeSrc.includes('checkRateLimitAndQuota'));
  const pronSrc = fs.readFileSync(path.resolve('api/_handlers/ai/pronunciation.js'), 'utf8');
  assert.ok(pronSrc.includes('checkRateLimitAndQuota'));
  const ttsSrc = fs.readFileSync(path.resolve('api/audio/tts.js'), 'utf8');
  assert.ok(ttsSrc.includes('checkRateLimitAndQuota'));
  const adminCreateSrc = fs.readFileSync(path.resolve('api/_handlers/admin/create-user.js'), 'utf8');
  assert.ok(adminCreateSrc.includes('verifyRequestAuth'));
  assert.ok(adminCreateSrc.includes("auth.user.role !== 'admin'"));
  const clsCreateSrc = fs.readFileSync(path.resolve('api/_handlers/classroom/create.js'), 'utf8');
  assert.ok(clsCreateSrc.includes('verifyRequestAuth'));
});

test('Pillar 4: Chinese IME isComposing guard on Enter handlers & touch-none on all Hanzi writing canvases', () => {
  const imeFiles = [
    'src/features/listening-studio/SentenceDictationWorkbench.tsx',
    'src/features/curriculum/HskAdvancedModule.tsx',
    'src/components/depth/AiTutorChatView.jsx',
    'src/components/learning/RoleplayStudioModal.jsx',
    'src/components/navigation/SmartCommandPalette.jsx',
    'src/features/vocabulary-workspace/SmartFlashcardSession.tsx',
    'src/pages/ClassroomPage.jsx',
    'src/pages/CommunityPage.jsx',
  ];

  for (const relPath of imeFiles) {
    const content = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.ok(content.includes('isComposing'), `${relPath} must guard Enter key with isComposing check`);
  }

  const touchCanvasFiles = [
    'src/components/dictionary/InteractiveWritingPad.jsx',
    'src/components/dictionary/StrokeOrderPlayer.jsx',
    'src/components/live/HanziStrokeOrderBoard.jsx',
    'src/features/classroom/live/LiveHanziWhiteboardStage.jsx',
    'src/features/writing-studio/HanziCanvasStage.tsx',
    'src/features/unified-ecosystem/UniversalSlideOverDrawer.tsx',
  ];

  for (const relPath of touchCanvasFiles) {
    const content = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.ok(
      content.includes('touch-none') && content.includes("touchAction: 'none'"),
      `${relPath} must apply touch-none and touchAction: 'none' to prevent scroll hijacking on mobile`
    );
  }
});

test('Pillar 5: .env.example documents all environment variables and vercel.json locks SPA & cache rules', () => {
  const envExample = fs.readFileSync(path.resolve('.env.example'), 'utf8');
  const expectedEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GEMINI_API_KEY',
    'GEMINI_API_KEYS',
    'GEMINI_MODEL',
    'OPENAI_API_KEY',
    'ENABLE_AI_TUTOR',
    'AI_TUTOR_KILL_SWITCH',
    'TURN_SERVER_URL',
    'COTURN_SERVER_URL',
    'TURN_SHARED_SECRET',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'ALLOW_IN_MEMORY_RATE_LIMIT',
    'VITE_LIVEKIT_URL',
    'LIVEKIT_URL',
    'LIVEKIT_API_KEY',
    'LIVEKIT_API_SECRET',
    'AZURE_SPEECH_KEY',
    'AZURE_SPEECH_REGION',
    'EDGE_TTS_ENDPOINT',
  ];

  for (const key of expectedEnvVars) {
    assert.ok(envExample.includes(`${key}=`), `.env.example must document ${key}`);
  }

  // Ensure server secrets are never referenced in src/
  const srcFiles = collectFiles(path.resolve('src'));
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.ok(
      !content.includes('SUPABASE_SERVICE_ROLE_KEY'),
      `Client code ${file} must never reference SUPABASE_SERVICE_ROLE_KEY`
    );
    assert.ok(
      !content.includes('VITE_GEMINI_API_KEY'),
      `Client code ${file} must never reference VITE_GEMINI_API_KEY`
    );
    assert.ok(
      !content.includes('LIVEKIT_API_SECRET'),
      `Client code ${file} must never reference LIVEKIT_API_SECRET`
    );
  }

  const vercelConfig = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf8'));
  const assetHeaders = vercelConfig.headers?.find((h) => h.source === '/assets/(.*)');
  assert.ok(
    assetHeaders?.headers?.some(
      (hdr) => hdr.key === 'Cache-Control' && hdr.value.includes('immutable')
    ),
    'vercel.json must configure immutable long-lived cache for /assets/*'
  );

  const rootHeaders = vercelConfig.headers?.find((h) => h.source === '/(.*)');
  assert.ok(
    rootHeaders?.headers?.some((hdr) => hdr.key === 'Permissions-Policy'),
    'vercel.json must configure Permissions-Policy'
  );

  const spaRewrite = vercelConfig.rewrites?.find((r) => r.destination === '/index.html');
  assert.ok(spaRewrite, 'vercel.json must have SPA fallback rewrite to /index.html');
  assert.ok(spaRewrite.source.includes('api/'), 'SPA rewrite must exclude /api/ routes');
});

test('Live-Browser Findings: Fixes [object Object] lesson label, Lesson nav overlay lock, Guest 401 personalize call, and Supabase env newline trim', () => {
  const appSrc = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
  assert.ok(appSrc.includes('rec?.lessonId || rec?.lesson?.id'), 'App.jsx must unwrap getRecommendedNextLesson() object');

  const roadmapSrc = fs.readFileSync(path.resolve('src/pages/RoadmapPage.jsx'), 'utf8');
  assert.ok(
    !roadmapSrc.includes('if (activeLessonToPlay) {\n    return (\n      <div className="fixed inset-0 z-50'),
    'RoadmapPage must not cover sidebar/bottom-nav with fixed inset-0 z-50 when lesson player is open'
  );

  const aiGatewaySrc = fs.readFileSync(path.resolve('src/services/aiGateway.js'), 'utf8');
  assert.ok(aiGatewaySrc.includes('hasAuthCredentials'), 'aiGateway must skip unauthenticated /api/ai/personalize fetch in Guest mode');
  assert.ok(aiGatewaySrc.includes('AbortController'), 'aiGateway must apply AbortController timeout');

  const supabaseCfgSrc = fs.readFileSync(path.resolve('src/supabase/config.js'), 'utf8');
  assert.ok(supabaseCfgSrc.includes('.trim()'), 'supabase config must trim env vars to prevent %0A WebSocket corruption');
});
