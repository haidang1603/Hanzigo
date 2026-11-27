import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

const BUDGETS = {
  mainEntryGzipKb: 160,
  routeChunkGzipKb: 180,
  livekitVendorGzipKb: 260,
  totalCssGzipKb: 45,
};

function walkFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function toKb(bytes) {
  return bytes / 1024;
}

function fmtKb(kb) {
  return `${kb.toFixed(2)} KB`;
}

function getJsLimitKb(fileName) {
  if (/^index-[^/\\]+\.js$/i.test(fileName)) {
    return BUDGETS.mainEntryGzipKb;
  }
  if (/^vendor-livekit-[^/\\]+\.js$/i.test(fileName)) {
    return BUDGETS.livekitVendorGzipKb;
  }
  return BUDGETS.routeChunkGzipKb;
}

function verifyIsolation(indexHtmlPath) {
  if (!fs.existsSync(indexHtmlPath)) {
    return { passed: false, errors: ['Không tìm thấy dist/index.html'] };
  }

  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  const scriptMatches = [...html.matchAll(/<script\b[^>]*type=["']module["'][^>]*>/gi)].map((m) => m[0]);
  const preloadMatches = [...html.matchAll(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi)].map((m) => m[0]);
  const tags = [...scriptMatches, ...preloadMatches];

  const violations = [];
  for (const tag of tags) {
    if (/vendor-livekit/i.test(tag)) {
      violations.push(`Phát hiện vendor-livekit trong preload/script trang chủ: ${tag}`);
    }
    if (/vendor-hanzi/i.test(tag)) {
      violations.push(`Phát hiện vendor-hanzi trong preload/script trang chủ: ${tag}`);
    }
  }

  return {
    passed: violations.length === 0,
    checkedTagCount: tags.length,
    errors: violations,
  };
}

function printTable(rows) {
  const headers = ['Tên File Chunk', 'Raw Size (KB)', 'Gzip Size (KB)', 'Ngưỡng Cho Phép', 'Trạng Thái'];
  const colWidths = [
    Math.max(headers[0].length, ...rows.map((r) => r.name.length)),
    Math.max(headers[1].length, ...rows.map((r) => r.raw.length)),
    Math.max(headers[2].length, ...rows.map((r) => r.gzip.length)),
    Math.max(headers[3].length, ...rows.map((r) => r.limit.length)),
    Math.max(headers[4].length, ...rows.map((r) => r.status.length)),
  ];

  const pad = (val, width) => String(val).padEnd(width, ' ');
  const sep = `+-${colWidths.map((w) => '-'.repeat(w)).join('-+-')}-+`;

  console.log(sep);
  console.log(`| ${headers.map((h, i) => pad(h, colWidths[i])).join(' | ')} |`);
  console.log(sep);
  for (const row of rows) {
    console.log(
      `| ${[
        pad(row.name, colWidths[0]),
        pad(row.raw, colWidths[1]),
        pad(row.gzip, colWidths[2]),
        pad(row.limit, colWidths[3]),
        pad(row.status, colWidths[4]),
      ].join(' | ')} |`
    );
  }
  console.log(sep);
}

function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('❌ Không tìm thấy thư mục dist/assets/. Hãy chạy `npm run build` trước.');
    process.exit(1);
  }

  const allFiles = walkFiles(ASSETS_DIR);
  const jsFiles = allFiles.filter((f) => f.endsWith('.js'));
  const cssFiles = allFiles.filter((f) => f.endsWith('.css'));

  const tableRows = [];
  let hasFailure = false;

  const analyzedJs = jsFiles
    .map((filePath) => {
      const buf = fs.readFileSync(filePath);
      const gzipBuf = gzipSync(buf);
      const name = path.basename(filePath);
      const rawKb = toKb(buf.length);
      const gzipKb = toKb(gzipBuf.length);
      const limitKb = getJsLimitKb(name);
      const passed = gzipKb <= limitKb;
      if (!passed) hasFailure = true;
      return {
        name,
        rawKb,
        gzipKb,
        limitKb,
        passed,
      };
    })
    .sort((a, b) => b.gzipKb - a.gzipKb);

  for (const item of analyzedJs) {
    tableRows.push({
      name: item.name,
      raw: fmtKb(item.rawKb),
      gzip: fmtKb(item.gzipKb),
      limit: `<= ${item.limitKb} KB`,
      status: item.passed ? 'PASS' : 'FAIL',
    });
  }

  let totalCssRawBytes = 0;
  let totalCssGzipBytes = 0;
  for (const cssPath of cssFiles) {
    const buf = fs.readFileSync(cssPath);
    const gzipBuf = gzipSync(buf);
    totalCssRawBytes += buf.length;
    totalCssGzipBytes += gzipBuf.length;
  }

  const totalCssRawKb = toKb(totalCssRawBytes);
  const totalCssGzipKb = toKb(totalCssGzipBytes);
  const cssPassed = totalCssGzipKb <= BUDGETS.totalCssGzipKb;
  if (!cssPassed) hasFailure = true;

  tableRows.push({
    name: `TOTAL CSS (${cssFiles.length} file)`,
    raw: fmtKb(totalCssRawKb),
    gzip: fmtKb(totalCssGzipKb),
    limit: `<= ${BUDGETS.totalCssGzipKb} KB`,
    status: cssPassed ? 'PASS' : 'FAIL',
  });

  console.log('\n=== HANZIGO BUNDLE PERFORMANCE BUDGET REPORT ===\n');
  printTable(tableRows);

  const isolation = verifyIsolation(INDEX_HTML_PATH);
  if (!isolation.passed) hasFailure = true;

  console.log('\n=== CHUNK ISOLATION ASSERTION (dist/index.html) ===');
  if (isolation.passed) {
    console.log(
      `PASS: Đã kiểm tra ${isolation.checkedTagCount} thẻ script/modulepreload; không chứa vendor-livekit hay vendor-hanzi.`
    );
  } else {
    for (const err of isolation.errors) {
      console.error(`FAIL: ${err}`);
    }
  }

  const entryFile = jsFiles.find((filePath) => /^index-[^/\\]+\.js$/i.test(path.basename(filePath)));
  console.log('\n=== ENTRY BUNDLE ESM BOOT SMOKE CHECK ===');
  if (!entryFile) {
    hasFailure = true;
    console.error('FAIL: Không tìm thấy file entry index-*.js trong dist/assets/js.');
  } else {
    try {
      const entryUrl = pathToFileURL(entryFile).href;
      const bootScript = `
        globalThis.window = globalThis;
        globalThis.self = globalThis;
        globalThis.location = { href: 'https://www.hanzigo.io.vn/', origin: 'https://www.hanzigo.io.vn', hash: '', pathname: '/', search: '' };
        globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
        globalThis.sessionStorage = globalThis.localStorage;
        globalThis.addEventListener = () => {};
        globalThis.removeEventListener = () => {};
        globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
        globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
        globalThis.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} });
        if (typeof globalThis.Event !== 'function') globalThis.Event = class Event { constructor(t) { this.type = t; } };
        if (typeof globalThis.CustomEvent !== 'function') globalThis.CustomEvent = class CustomEvent extends globalThis.Event { constructor(t, o = {}) { super(t); this.detail = o.detail; } };
        globalThis.MutationObserver = class { observe() {} disconnect() {} };
        globalThis.ResizeObserver = class { observe() {} disconnect() {} };
        globalThis.IntersectionObserver = class { observe() {} disconnect() {} };
        globalThis.Node = class Node {};
        globalThis.Element = class Element extends globalThis.Node {};
        globalThis.HTMLElement = class HTMLElement extends globalThis.Element {};
        globalThis.document = {
          documentElement: { classList: { add: () => {}, remove: () => {}, toggle: () => {} }, setAttribute: () => {}, style: {}, addEventListener: () => {}, removeEventListener: () => {} },
          head: { appendChild: () => {} },
          body: { appendChild: () => {}, classList: { add: () => {}, remove: () => {} } },
          createElement: () => ({ style: {}, setAttribute: () => {}, appendChild: () => {}, addEventListener: () => {}, removeEventListener: () => {} }),
          getElementById: () => ({ innerHTML: '', appendChild: () => {}, addEventListener: () => {}, removeEventListener: () => {}, nodeType: 1, ownerDocument: globalThis.document }),
          querySelector: () => null,
          querySelectorAll: () => [],
          addEventListener: () => {},
          removeEventListener: () => {},
          title: '',
        };
        await import(${JSON.stringify(entryUrl)});
        process.exit(0);
      `;
      execFileSync(process.execPath, ['--input-type=module', '-e', bootScript], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      console.log(`PASS: Entry bundle ${path.basename(entryFile)} khởi chạy sạch, không lỗi circular TDZ / TypeError.`);
    } catch (bootErr) {
      hasFailure = true;
      const errDetail = bootErr?.stderr?.toString()?.trim() || bootErr?.message || String(bootErr);
      console.error(`FAIL: Entry bundle ${path.basename(entryFile)} bị lỗi khi boot:\n${errDetail}`);
    }
  }

  if (hasFailure) {
    console.error('\n❌ Build budget verification FAILED: Một hoặc nhiều chunk vượt ngưỡng cho phép.');
    process.exit(1);
  }

  console.log('\n✅ Build budget verification PASSED: Toàn bộ chunk đạt ngưỡng hiệu năng.');
}

main();

