import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT_DIR = process.cwd();
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'src', 'components');

const MAX_PAGE_BYTES = 45 * 1024; // 45 KB ceiling for refactored & new pages

// Remaining legacy pages not yet scheduled for modular extraction.
// Locked at current size ceilings (+1 KB tolerance) so they can never grow larger.
const LEGACY_PAGE_CEILING_KB = {
  'TeacherDashboardPage.jsx': 123,
  'PronunciationPage.jsx': 108,
  'ClassroomPage.jsx': 84,
  'RoadmapPage.jsx': 77,
  'LiveClassroomPage.jsx': 77,
  'ReaderPage.jsx': 76,
  'LessonPage.jsx': 67,
  'ProfilePage.jsx': 64,
  'ConversationPage.jsx': 61,
  'PracticePage.jsx': 60,
  'HomePage.jsx': 50,
};

// Intentional legacy shell router (imported only by App.jsx, never by any src/pages/*)
const ALLOWED_LEGACY_SHELL_IMPORTS = new Set([
  'src/components/dashboard/UnifiedDashboard.jsx',
]);

function collectFilesRecursive(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesRecursive(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

function extractImportSpecifiers(src) {
  const specs = [];
  const regex = /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  while ((match = regex.exec(src)) !== null) {
    specs.push(match[1] || match[2]);
  }
  return specs;
}

test('Architecture Guard 1: Refactored and new src/pages/*.jsx stay <= 45 KB (and legacy pages never grow)', () => {
  const pageFiles = fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith('.jsx') || f.endsWith('.tsx'));

  assert.ok(pageFiles.length > 0, 'src/pages must contain page files');

  const violations = [];
  for (const fileName of pageFiles) {
    const fullPath = path.join(PAGES_DIR, fileName);
    const bytes = fs.statSync(fullPath).size;
    const ceilingBytes = LEGACY_PAGE_CEILING_KB[fileName]
      ? LEGACY_PAGE_CEILING_KB[fileName] * 1024
      : MAX_PAGE_BYTES;

    if (bytes > ceilingBytes) {
      violations.push(
        `${fileName}: ${(bytes / 1024).toFixed(2)} KB exceeds ${(ceilingBytes / 1024).toFixed(0)} KB limit`
      );
    }
  }

  assert.deepEqual(violations, [], `Page size ceiling violations:\n${violations.join('\n')}`);
});

test('Architecture Guard 2: Zero direct circular dependencies between src/pages/* and src/components/*', () => {
  const pageFiles = fs
    .readdirSync(PAGES_DIR)
    .filter((f) => /\.(js|jsx|ts|tsx)$/.test(f))
    .map((f) => path.join(PAGES_DIR, f));

  const componentFiles = collectFilesRecursive(COMPONENTS_DIR, ['.js', '.jsx', '.ts', '.tsx']);

  const pageToComponentTargets = new Map();
  for (const pageFile of pageFiles) {
    const pageRel = path.relative(ROOT_DIR, pageFile).replace(/\\/g, '/');
    const specs = extractImportSpecifiers(fs.readFileSync(pageFile, 'utf8'));
    for (const spec of specs) {
      if (!spec.startsWith('.')) continue;
      const resolvedNoExt = path
        .resolve(path.dirname(pageFile), spec)
        .replace(/\\/g, '/')
        .replace(/\.(js|jsx|ts|tsx)$/, '');
      const list = pageToComponentTargets.get(pageRel) || new Set();
      list.add(resolvedNoExt);
      pageToComponentTargets.set(pageRel, list);
    }
  }

  const circularOrDisallowed = [];
  for (const compFile of componentFiles) {
    const compRel = path.relative(ROOT_DIR, compFile).replace(/\\/g, '/');
    const compNoExt = compFile.replace(/\\/g, '/').replace(/\.(js|jsx|ts|tsx)$/, '');
    const specs = extractImportSpecifiers(fs.readFileSync(compFile, 'utf8'));

    for (const spec of specs) {
      if (!spec.startsWith('.') || !spec.includes('/pages/')) continue;
      const targetPageNoExt = path
        .resolve(path.dirname(compFile), spec)
        .replace(/\\/g, '/')
        .replace(/\.(js|jsx|ts|tsx)$/, '');

      // Check direct circular loop: page imports component && component imports page
      for (const [pageRel, targets] of pageToComponentTargets.entries()) {
        const pageNoExt = path
          .join(ROOT_DIR, pageRel)
          .replace(/\\/g, '/')
          .replace(/\.(js|jsx|ts|tsx)$/, '');
        if (pageNoExt === targetPageNoExt && targets.has(compNoExt)) {
          circularOrDisallowed.push(`Circular edge: ${pageRel} <-> ${compRel}`);
        }
      }

      if (!ALLOWED_LEGACY_SHELL_IMPORTS.has(compRel)) {
        circularOrDisallowed.push(`Disallowed component->page import: ${compRel} imports ${spec}`);
      }
    }
  }

  assert.deepEqual(
    circularOrDisallowed,
    [],
    `Architecture cycle / reverse import detected:\n${circularOrDisallowed.join('\n')}`
  );
});
