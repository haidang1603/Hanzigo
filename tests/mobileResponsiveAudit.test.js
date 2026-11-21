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
  {
    name: '7. Student Dashboard uses 3-tier layout (Hero 7:5 + 4 KPIs, Core 8:4 + 6 shortcuts, Progressive Disclosure tabs)',
    fn: () => {
      const dashSrc = readRel('src/pages/DashboardPage.jsx');
      assert.match(dashSrc, /lg:col-span-7/, 'Dashboard Tier 1 should have 7-col Hero Focus Card');
      assert.match(dashSrc, /lg:col-span-5/, 'Dashboard Tier 1 should have 5-col Compact KPI Strip');
      assert.match(dashSrc, /TOTAL_HSK_LESSONS\s*=\s*180/, 'Dashboard KPI should track 180 HSK 1-9 lessons');
      assert.match(dashSrc, /getUserExamHistory/, 'Dashboard CBT KPI should read from hsk_attempts via getUserExamHistory');
      assert.match(dashSrc, /lg:col-span-8/, 'Dashboard Tier 2 should have 8-col Mission & AI Coach');
      assert.match(dashSrc, /lg:col-span-4/, 'Dashboard Tier 2 should have 4-col 6 Core Shortcuts');
      assert.match(dashSrc, /DashboardDeepAnalyticsTabs/, 'Dashboard Tier 3 should use Progressive Disclosure Tabs');
      assert.doesNotMatch(dashSrc, /TelemetryVisualAnalyticsGrid/, 'DashboardPage should keep TelemetryVisualAnalyticsGrid lazy inside child tabs');

      const tabsSrc = readRel('src/components/dashboard/DashboardDeepAnalyticsTabs.jsx');
      assert.match(tabsSrc, /role="tablist"/, 'Deep analytics tabs should expose accessible tablist');
      assert.match(tabsSrc, /HskReadinessRadarCard/, 'Tab 1 should render HskReadinessRadarCard');
      assert.match(tabsSrc, /TelemetryVisualAnalyticsGrid/, 'Tab 2 should lazy-render TelemetryVisualAnalyticsGrid');
      assert.match(tabsSrc, /min-h-\[44px\]/, 'Deep analytics tab buttons should meet >= 44px touch height');
    },
  },
  {
    name: '8. Guest HomePage uses 3-tier layout (Hero 7:5 + 4 highlights, 1-min Sandbox + 6 tools, Progressive Disclosure tabs)',
    fn: () => {
      const homeSrc = readRel('src/pages/HomePage.jsx');
      assert.match(homeSrc, /lg:col-span-7/, 'Guest HomePage Tier 1 should have 7-col Hero content');
      assert.match(homeSrc, /lg:col-span-5/, 'Guest HomePage Tier 1 should have 5-col Showcase card');
      assert.match(homeSrc, /180 bài/, 'Guest HomePage should reflect updated 180 HSK 1-9 lessons');
      assert.match(homeSrc, /11\.092 từ/, 'Guest HomePage should reflect updated 11,092 HSK 3.0 vocab');
      assert.match(homeSrc, /role="tablist"/, 'Guest HomePage Tier 3 should use Progressive Disclosure tabs');
      assert.match(homeSrc, /min-h-\[44px\]/, 'Guest HomePage interactive buttons should meet >= 44px touch height');
    },
  },
  {
    name: '9. [MOB-CRIT-01] HanziCanvasStage uses responsive 320px width and retains touch-none overscroll-contain',
    fn: () => {
      const stageSrc = readRel('src/features/writing-studio/HanziCanvasStage.tsx');
      assert.match(
        stageSrc,
        /w-full\s+max-w-\[320px\]\s+aspect-square/,
        'HanziCanvasStage must use w-full max-w-[320px] aspect-square to prevent 320x568 horizontal overflow'
      );
      assert.doesNotMatch(
        stageSrc,
        /\bw-\[320px\]\s+h-\[320px\]/,
        'HanziCanvasStage must not hardcode w-[320px] h-[320px] on mobile'
      );
      assert.match(stageSrc, /touch-none\s+overscroll-contain/, 'HanziCanvasStage must preserve touch-none overscroll-contain');
    },
  },
  {
    name: '10. [MOB-HIGH-02] Mobile navigation & modal buttons enforce >= 44x44px touch targets and safe-area footer',
    fn: () => {
      const headerSrc = readRel('src/components/navigation/AppHeader.jsx');
      assert.match(headerSrc, /min-w-11\s+min-h-11/, 'AppHeader hamburger button must be >= 44x44px');

      const navSrc = readRel('src/components/navigation/MobileNavigation.jsx');
      assert.match(navSrc, /min-w-11\s+min-h-11/, 'MobileNavigation logout button must be >= 44x44px');
      assert.match(
        navSrc,
        /pb-\[max\(0\.75rem,env\(safe-area-inset-bottom\)\)\]/,
        'MobileNavigation drawer footer must include safe-area-inset-bottom'
      );

      const assignModalSrc = readRel('src/features/classroom/assignments/CreateHskAssignmentModal.jsx');
      assert.match(assignModalSrc, /min-w-11\s+min-h-11/, 'CreateHskAssignmentModal close button must be >= 44x44px');
    },
  },
  {
    name: '11. [MOB-HIGH-01] Zero <input>/<textarea>/<select> regressions below 16px on mobile across Waves 2-5 files',
    fn: () => {
      const normalizedFiles = [
        'src/components/AuthModal.jsx',
        'src/components/Footer.jsx',
        'src/components/navigation/SmartCommandPalette.jsx',
        'src/pages/ResetPasswordPage.jsx',
        'src/pages/RoadmapPage.jsx',
        'src/pages/LessonPage.jsx',
        'src/pages/VocabularyPage.jsx',
        'src/features/srs/SrsRetentionDashboard.tsx',
        'src/pages/PronunciationPage.jsx',
        'src/pages/WritingPage.jsx',
        'src/features/writing-studio/HanziWritingStudio.tsx',
        'src/features/writing-studio/HanziCanvasStage.tsx',
        'src/pages/ReaderPage.jsx',
        'src/pages/ConversationPage.jsx',
        'src/pages/ProfilePage.jsx',
        'src/pages/HskPracticePage.jsx',
        'src/pages/LiveClassroomPage.jsx',
        'src/features/classroom/live/LiveHanziWhiteboardStage.jsx',
        'src/pages/ClassroomPage.jsx',
        'src/pages/CommunityPage.jsx',
        'src/pages/MaterialsPage.jsx',
        'src/pages/TeacherDashboardPage.jsx',
        'src/features/classroom/assignments/CreateHskAssignmentModal.jsx',
        'src/features/classroom/assignments/ClassMistakeHeatmapPanel.jsx',
        'src/pages/AdminPage.jsx',
        'src/features/hsk-exam/admin-importer/HskBulkImporterPanel.tsx',
      ];

      const regressions = [];
      for (const rel of normalizedFiles) {
        const lines = readRel(rel).split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          if (/<(input|textarea|select)\b/.test(lines[i])) {
            let endIdx = i;
            for (let j = i; j < Math.min(lines.length, i + 16); j++) {
              endIdx = j;
              if (lines[j].replace(/=>/g, '').includes('>')) break;
            }
            const block = lines.slice(i, endIdx + 1).join(' ');
            if (
              /className=/.test(block) &&
              !/type=["'](checkbox|radio|hidden|file|range)["']/.test(block) &&
              !/\btext-(base|lg|xl|2xl)\b/.test(block) &&
              /\btext-(xs|sm)\b/.test(block)
            ) {
              regressions.push(`${rel}:L${i + 1}`);
            }
          }
        }
      }

      assert.deepEqual(
        regressions,
        [],
        `Found mobile auto-zoom input regressions (< 16px): ${regressions.join(', ')}`
      );
    },
  },
  {
    name: '12. [MOB-MED-01 & MOB-LOW-01] Modals/layouts use dvh + safe-area and Teacher/Admin tables wrap overflow-x-auto max-w-full',
    fn: () => {
      const modalFiles = [
        'src/pages/HskPracticePage.jsx',
        'src/pages/ClassroomPage.jsx',
        'src/pages/CommunityPage.jsx',
        'src/pages/MaterialsPage.jsx',
        'src/pages/AdminPage.jsx',
        'src/features/classroom/assignments/CreateHskAssignmentModal.jsx',
      ];
      for (const rel of modalFiles) {
        const src = readRel(rel);
        assert.doesNotMatch(src, /max-h-\[90vh\]/, `${rel} must not regress to max-h-[90vh]`);
        assert.match(src, /max-h-\[90dvh\]/, `${rel} must use max-h-[90dvh]`);
        assert.match(
          src,
          /pb-\[max\(0\.75rem,env\(safe-area-inset-bottom\)\)\]/,
          `${rel} must include safe-area bottom padding`
        );
      }

      const dvhFiles = [
        'src/App.jsx',
        'src/components/navigation/AppSidebar.jsx',
        'src/components/navigation/SmartCommandPalette.jsx',
        'src/pages/ResetPasswordPage.jsx',
        'src/features/intelligence/LearningIntelligenceHub.tsx',
        'src/pages/LessonPage.jsx',
        'src/pages/RoadmapPage.jsx',
        'src/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator.jsx',
        'src/pages/LiveClassroomPage.jsx',
        'src/pages/TeacherDashboardPage.jsx',
      ];
      for (const rel of dvhFiles) {
        const src = readRel(rel);
        assert.doesNotMatch(src, /\b(min-h-screen|h-screen)\b/, `${rel} must not regress to rigid vh/h-screen`);
      }

      const teacherSrc = readRel('src/pages/TeacherDashboardPage.jsx');
      const teacherTableWrappers = teacherSrc.match(/overflow-x-auto max-w-full/g) || [];
      assert.ok(
        teacherTableWrappers.length >= 4,
        `TeacherDashboardPage must wrap all 4 tables with overflow-x-auto max-w-full (found ${teacherTableWrappers.length})`
      );

      const adminSrc = readRel('src/pages/AdminPage.jsx');
      assert.match(adminSrc, /overflow-x-auto max-w-full/, 'AdminPage user table must wrap with overflow-x-auto max-w-full');
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
