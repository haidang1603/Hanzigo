import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readRel(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

const tests = [
  {
    name: '1. App shell prevents horizontal overflow and uses dvh viewport height',
    fn: () => {
      const appSrc = readRel('src/App.jsx');
      assert.match(appSrc, /overflow-x-clip/, 'App wrapper should clip horizontal overflow');
      assert.match(appSrc, /min-h-\[100dvh\]/, 'App wrapper should use min-h-[100dvh]');
    },
  },
  {
    name: '2. HSK 7-9 600-char Genkou grid uses responsive columns instead of rigid repeat(20)',
    fn: () => {
      const simSrc = readRel(
        'src/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator.jsx'
      );
      assert.doesNotMatch(
        simSrc,
        /gridTemplateColumns:\s*['"]repeat\(20,\s*minmax\(0,\s*1fr\)\)['"]/,
        'Genkou grid must not hardcode 20 columns on mobile'
      );
      assert.match(
        simSrc,
        /grid-cols-10\s+sm:grid-cols-15\s+lg:grid-cols-20/,
        'Genkou grid should scale 10 -> 15 -> 20 columns responsively'
      );
    },
  },
  {
    name: '3. Hanzi writing & whiteboard canvases enforce touch-none and overscroll-contain',
    fn: () => {
      const canvasFiles = [
        'src/components/dictionary/InteractiveWritingPad.jsx',
        'src/components/dictionary/StrokeOrderPlayer.jsx',
        'src/components/live/HanziStrokeOrderBoard.jsx',
        'src/components/live/WhiteboardBoard.jsx',
        'src/features/classroom/live/LiveHanziWhiteboardStage.jsx',
        'src/features/dictionary/SmartSearchBar.tsx',
        'src/features/unified-ecosystem/UniversalSlideOverDrawer.tsx',
        'src/features/writing-studio/HanziCanvasStage.tsx',
        'src/pages/LessonPage.jsx',
      ];
      for (const rel of canvasFiles) {
        const src = readRel(rel);
        assert.match(src, /touch-none/, `${rel} must include touch-none`);
        assert.match(src, /overscroll-contain/, `${rel} must include overscroll-contain`);
      }
    },
  },
  {
    name: '4. AudioButton and SM-2 rating buttons meet >= 44px mobile touch target',
    fn: () => {
      const audioSrc = readRel('src/components/AudioButton.jsx');
      assert.match(
        audioSrc,
        /min-w-\[44px\]\s+min-h-\[44px\]/,
        'AudioButton should enforce 44x44px touch target on mobile'
      );
      const vocabSrc = readRel('src/pages/VocabularyPage.jsx');
      assert.match(
        vocabSrc,
        /min-h-\[48px\]/,
        'VocabularyPage SM-2 rating buttons should have >= 48px touch height'
      );
      assert.match(
        vocabSrc,
        /showMobileFilters/,
        'VocabularyPage should have collapsible mobile filters for one-handed flashcard access'
      );
      assert.match(
        vocabSrc,
        /cardTouchMovedRef/,
        'VocabularyPage flashcard should guard against accidental flip while touch-scrolling'
      );
    },
  },
  {
    name: '5. Key Chinese IME inputs/textareas use text-base on mobile to prevent iOS Safari auto-zoom',
    fn: () => {
      const filesToCheck = [
        'src/pages/VocabularyPage.jsx',
        'src/pages/HskPracticePage.jsx',
        'src/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator.jsx',
        'src/features/dictionary/SmartSearchBar.tsx',
      ];
      for (const rel of filesToCheck) {
        const src = readRel(rel);
        assert.match(src, /text-base/, `${rel} should use text-base on mobile inputs`);
      }
    },
  },
  {
    name: '6. Modals, Drawers & LiveClassroom use dvh and safe-area-inset-bottom',
    fn: () => {
      const liveSrc = readRel('src/pages/LiveClassroomPage.jsx');
      assert.match(liveSrc, /h-\[100dvh\]/, 'LiveClassroomPage should use h-[100dvh]');
      assert.match(
        liveSrc,
        /env\(safe-area-inset-bottom\)/,
        'LiveClassroomPage should include safe-area-inset-bottom'
      );
      const drawerSrc = readRel('src/features/unified-ecosystem/UniversalSlideOverDrawer.tsx');
      assert.match(drawerSrc, /h-\[100dvh\]/, 'UniversalSlideOverDrawer should use h-[100dvh]');
      assert.match(
        drawerSrc,
        /min-w-\[44px\]\s+min-h-\[44px\]/,
        'UniversalSlideOverDrawer close button should be >= 44x44px on mobile'
      );
    },
  },
];

let passed = 0;
for (const t of tests) {
  t.fn();
  passed += 1;
  console.log(`PASS: ${t.name}`);
}
console.log(`\nAll ${passed}/${tests.length} mobileResponsiveAudit tests passed.`);
