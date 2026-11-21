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
    name: '1. [WCAG 2.4.1 / 1.3.1] App.jsx provides Skip-to-Main-Content link and <main id="main-content"> landmark',
    fn: () => {
      const appSrc = readRel('src/App.jsx');
      assert.match(appSrc, /href="#main-content"/, 'App.jsx must include skip link to #main-content');
      assert.match(appSrc, /Bỏ qua đến nội dung chính/, 'Skip link must have Vietnamese accessible text');
      assert.match(appSrc, /<main\s+id="main-content"\s+tabIndex=\{-1\}/, '<main> must have id="main-content" and tabIndex={-1}');
    },
  },
  {
    name: '2. [WCAG 2.4.7 / 2.3.3] index.css enforces :focus-visible ring (overriding focus:outline-none) and prefers-reduced-motion',
    fn: () => {
      const cssSrc = readRel('src/index.css');
      assert.match(cssSrc, /:focus-visible\s*\{[\s\S]*outline:\s*2px solid #E85D3F\s*!important;/, 'Light mode :focus-visible outline must win over focus:outline-none');
      assert.match(cssSrc, /\.dark\s+:focus-visible\s*\{[\s\S]*outline:\s*2px solid #F4B942\s*!important;/, 'Dark mode :focus-visible outline must win over focus:outline-none');
      assert.match(cssSrc, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'index.css must honor prefers-reduced-motion');
    },
  },
  {
    name: '3. [WCAG 4.1.2 / 1.1.1] AudioButton exposes aria-label, aria-pressed, and aria-hidden decorative icon',
    fn: () => {
      const audioSrc = readRel('src/components/AudioButton.jsx');
      assert.match(audioSrc, /aria-label=\{isPlaying\s*\?/, 'AudioButton must expose dynamic Vietnamese aria-label');
      assert.match(audioSrc, /aria-pressed=\{isPlaying\}/, 'AudioButton must expose aria-pressed state');
      assert.match(audioSrc, /<Volume2[^>]*aria-hidden="true"/, 'Decorative Volume2 icon must be aria-hidden');
    },
  },
  {
    name: '4. [WCAG 3.3.1 / 1.3.1 / 4.1.2] AuthModal implements accessible dialog, role="alert", and label/input associations',
    fn: () => {
      const authSrc = readRel('src/components/AuthModal.jsx');
      assert.match(authSrc, /role="dialog"/, 'AuthModal must have role="dialog"');
      assert.match(authSrc, /aria-modal="true"/, 'AuthModal must have aria-modal="true"');
      assert.match(authSrc, /aria-labelledby="auth-modal-title"/, 'AuthModal must bind aria-labelledby');
      assert.match(authSrc, /role="alert"/, 'AuthModal error container must use role="alert"');
      assert.match(authSrc, /role="status"\s+aria-live="polite"/, 'AuthModal success message must use polite live region');
      assert.match(authSrc, /htmlFor="auth-email"[\s\S]*id="auth-email"/, 'Email label must bind to input id');
      assert.match(authSrc, /htmlFor="auth-password"[\s\S]*id="auth-password"/, 'Password label must bind to input id');
    },
  },
  {
    name: '5. [WCAG 2.1.1 / 4.1.2] MobileNavigation & UniversalSlideOverDrawer support dialog semantics and Escape key dismissal',
    fn: () => {
      const navSrc = readRel('src/components/navigation/MobileNavigation.jsx');
      assert.match(navSrc, /role="dialog"/, 'MobileNavigation drawer must have role="dialog"');
      assert.match(navSrc, /e\.key\s*===\s*['"]Escape['"]/, 'MobileNavigation drawer must close on Escape key');

      const drawerSrc = readRel('src/features/unified-ecosystem/UniversalSlideOverDrawer.tsx');
      assert.match(drawerSrc, /role="dialog"/, 'UniversalSlideOverDrawer must have role="dialog"');
      assert.match(drawerSrc, /aria-modal="true"/, 'UniversalSlideOverDrawer must have aria-modal="true"');
      assert.match(drawerSrc, /aria-labelledby="unified-drawer-title"/, 'UniversalSlideOverDrawer must bind aria-labelledby');
      assert.match(drawerSrc, /e\.key\s*===\s*['"]Escape['"]/, 'UniversalSlideOverDrawer must close on Escape key');
      assert.match(drawerSrc, /aria-label="Nghe phát âm chuẩn"/, 'Drawer audio button must have aria-label');
    },
  },
  {
    name: '6. [WCAG 2.1.1] Interactive Flashcard and Dashboard Streak KPI support keyboard Enter/Space activation',
    fn: () => {
      const vocabSrc = readRel('src/pages/VocabularyPage.jsx');
      assert.match(vocabSrc, /role="button"\s+tabIndex=\{0\}\s+aria-label=\{isFlipped/, 'Flashcard must have role="button", tabIndex={0}, and aria-label');
      assert.match(vocabSrc, /e\.key === 'Enter' \|\| e\.key === ' '/, 'Flashcard must flip on Enter or Space');

      const dashSrc = readRel('src/pages/DashboardPage.jsx');
      assert.match(dashSrc, /role="button"\s+tabIndex=\{0\}\s+aria-label=\{`Chuỗi ngày học:/, 'Streak KPI card must be keyboard focusable with aria-label');
      assert.match(dashSrc, /e\.key === 'Enter' \|\| e\.key === ' '/, 'Streak KPI card must activate on Enter or Space');
    },
  },
  {
    name: '7. [WCAG 1.3.1 / 3.3.2] Core search & selector inputs expose accessible id/name/aria-label',
    fn: () => {
      assert.match(readRel('src/components/Footer.jsx'), /id="footer-newsletter-email"/, 'Footer newsletter input must have id');
      assert.match(readRel('src/components/navigation/SmartCommandPalette.jsx'), /id="global-command-search"/, 'Command palette search must have id');
      assert.match(readRel('src/pages/VocabularyPage.jsx'), /id="vocab-search-input"/, 'Vocabulary search must have id');
      assert.match(readRel('src/pages/VocabularyPage.jsx'), /id="vocab-topic-filter"/, 'Vocabulary topic filter must have id');
      assert.match(readRel('src/pages/LessonPage.jsx'), /id="lesson-selector"/, 'Lesson selector must have id and aria-label');
    },
  },
  {
    name: '8. [WCAG 1.3.1 / 2.4.6] Core pages expose a clear primary <h1> heading',
    fn: () => {
      const pagesWithSingleH1 = [
        'src/pages/HomePage.jsx',
        'src/pages/DashboardPage.jsx',
        'src/pages/RoadmapPage.jsx',
        'src/pages/LessonPage.jsx',
        'src/pages/VocabularyPage.jsx',
        'src/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator.jsx',
        'src/pages/LiveClassroomPage.jsx',
        'src/pages/TeacherDashboardPage.jsx',
        'src/pages/AdminPage.jsx',
      ];
      for (const rel of pagesWithSingleH1) {
        const count = (readRel(rel).match(/<h1\b/g) || []).length;
        assert.equal(count, 1, `${rel} should render exactly 1 <h1> heading (found ${count})`);
      }
    },
  },
];

let passed = 0;
for (const t of tests) {
  t.fn();
  passed += 1;
  console.log(`PASS: ${t.name}`);
}
console.log(`\nAll ${passed}/${tests.length} accessibilityPhase39 tests passed.`);
