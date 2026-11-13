import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FORBIDDEN_SECRET_PATTERNS = [
  { name: 'SUPABASE_SERVICE_ROLE_KEY', regex: /\bSUPABASE_SERVICE_ROLE_KEY\b/ },
  { name: 'LIVEKIT_API_SECRET', regex: /\bLIVEKIT_API_SECRET\b/ },
  { name: 'OPENAI_API_KEY', regex: /\bOPENAI_API_KEY\b/ },
  { name: 'AZURE_SPEECH_KEY', regex: /\bAZURE_SPEECH_KEY\b/ },
  { name: 'Hardcoded JWT', regex: /\beyJhbGciOi[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}/ },
];

const LEGAL_PAGE_FILES = [
  'src/pages/PrivacyPolicyPage.jsx',
  'src/pages/TermsOfServicePage.jsx',
  'src/pages/CookiePolicyPage.jsx',
  'src/pages/RefundPolicyPage.jsx',
  'src/pages/StoragePreferencesPage.jsx',
];

function walkFiles(dirPath, { ignoreUnderscoreDirs = false, extensions = null } = {}) {
  if (!fs.existsSync(dirPath)) return [];
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoreUnderscoreDirs && entry.name.startsWith('_')) {
        continue;
      }
      results.push(...walkFiles(path.join(dirPath, entry.name), { ignoreUnderscoreDirs, extensions }));
    } else if (entry.isFile()) {
      if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(path.join(dirPath, entry.name));
      }
    }
  }
  return results;
}

export function scanClientSecretLeaks(rootDir = process.cwd()) {
  const srcDir = path.join(rootDir, 'src');
  const files = walkFiles(srcDir, { extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'] });
  const findings = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const pattern of FORBIDDEN_SECRET_PATTERNS) {
      if (pattern.regex.test(content)) {
        findings.push({
          file: path.relative(rootDir, filePath).replaceAll('\\', '/'),
          pattern: pattern.name,
        });
      }
    }
  }

  return {
    scannedFiles: files.length,
    leaks: findings,
    passed: findings.length === 0,
  };
}

export function countServerlessEntrypoints(rootDir = process.cwd()) {
  const apiDir = path.join(rootDir, 'api');
  const files = walkFiles(apiDir, { ignoreUnderscoreDirs: true, extensions: ['.js', '.ts', '.mjs'] });
  const entrypoints = files.map((filePath) => path.relative(rootDir, filePath).replaceAll('\\', '/'));

  return {
    count: entrypoints.length,
    limit: 12,
    entrypoints,
    passed: entrypoints.length > 0 && entrypoints.length <= 12,
  };
}

export function runPreFlightGoLiveAudit({ rootDir = process.cwd() } = {}) {
  // 1. Security & Secrets (25 pts)
  const secretScan = scanClientSecretLeaks(rootDir);
  const hasTelemetry = fs.existsSync(path.join(rootDir, 'src/core/telemetry/errorReporter.js'));
  const hasErrorBoundary = fs.existsSync(path.join(rootDir, 'src/components/common/GlobalErrorBoundary.jsx'));
  let securityScore = 0;
  if (secretScan.passed) securityScore += 15;
  if (hasTelemetry) securityScore += 5;
  if (hasErrorBoundary) securityScore += 5;

  // 2. Serverless & Vercel Config (20 pts)
  const serverless = countServerlessEntrypoints(rootDir);
  const vercelPath = path.join(rootDir, 'vercel.json');
  let vercelValid = false;
  let vercelHeadersOk = false;
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      const globalRule = vercelConfig.headers?.find((h) => h.source === '/(.*)');
      const headerKeys = new Set((globalRule?.headers || []).map((h) => h.key));
      vercelHeadersOk =
        headerKeys.has('X-Content-Type-Options') &&
        headerKeys.has('X-Frame-Options') &&
        headerKeys.has('Strict-Transport-Security') &&
        headerKeys.has('Permissions-Policy');
      vercelValid = Array.isArray(vercelConfig.rewrites) && vercelHeadersOk;
    } catch {
      vercelValid = false;
    }
  }
  let serverlessScore = 0;
  if (serverless.passed) serverlessScore += 10;
  if (vercelValid) serverlessScore += 10;

  // 3. Database & RLS Integrity (20 pts)
  const auditMigrationPath = path.join(
    rootDir,
    'supabase/migrations/20261114_3701_security_rls_and_telemetry_audit.sql'
  );
  let dbScore = 0;
  let dbAuditPassed = false;
  if (fs.existsSync(auditMigrationPath)) {
    const sql = fs.readFileSync(auditMigrationPath, 'utf8');
    dbAuditPassed =
      sql.includes('system_error_logs') &&
      sql.includes('ENABLE ROW LEVEL SECURITY') &&
      sql.includes('SET search_path = public') &&
      sql.includes('auth.uid()');
    if (dbAuditPassed) dbScore = 20;
  }

  // 4. SEO & PWA Readiness (15 pts)
  const hasRobots = fs.existsSync(path.join(rootDir, 'public/robots.txt'));
  const hasSitemap = fs.existsSync(path.join(rootDir, 'public/sitemap.xml'));
  const manifestPath = path.join(rootDir, 'public/manifest.webmanifest');
  let hasValidManifest = false;
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      hasValidManifest = Boolean(manifest.name && manifest.start_url);
    } catch {
      hasValidManifest = false;
    }
  }
  const hasSeoManager =
    fs.existsSync(path.join(rootDir, 'src/core/seo/routeSeoConfig.js')) &&
    fs.existsSync(path.join(rootDir, 'src/core/seo/SeoHeadManager.jsx'));

  let seoScore = 0;
  if (hasRobots && hasSitemap) seoScore += 6;
  if (hasValidManifest) seoScore += 4;
  if (hasSeoManager) seoScore += 5;

  // 5. Legal & Privacy Compliance (20 pts)
  const missingLegalPages = LEGAL_PAGE_FILES.filter(
    (relPath) => !fs.existsSync(path.join(rootDir, relPath))
  );
  const legalScore = missingLegalPages.length === 0 ? 20 : Math.max(0, 20 - missingLegalPages.length * 4);

  const categories = [
    {
      name: 'Security & Secrets',
      score: securityScore,
      max: 25,
      passed: securityScore === 25,
      detail: secretScan.passed
        ? `${secretScan.scannedFiles} files scanned, 0 leaks`
        : `${secretScan.leaks.length} secret leak(s) found`,
    },
    {
      name: 'Serverless & Vercel Config',
      score: serverlessScore,
      max: 20,
      passed: serverlessScore === 20,
      detail: `${serverless.count}/${serverless.limit} serverless entrypoints, vercel.json=${vercelValid}`,
    },
    {
      name: 'Database & RLS Integrity',
      score: dbScore,
      max: 20,
      passed: dbScore === 20,
      detail: dbAuditPassed ? 'Audit migration & RPC hardening verified' : 'Audit migration incomplete',
    },
    {
      name: 'SEO & PWA Readiness',
      score: seoScore,
      max: 15,
      passed: seoScore === 15,
      detail: `robots=${hasRobots}, sitemap=${hasSitemap}, manifest=${hasValidManifest}, seo=${hasSeoManager}`,
    },
    {
      name: 'Legal & Privacy Compliance',
      score: legalScore,
      max: 20,
      passed: legalScore === 20,
      detail:
        missingLegalPages.length === 0
          ? '5/5 legal pages present'
          : `Missing: ${missingLegalPages.join(', ')}`,
    },
  ];

  const totalScore = categories.reduce((sum, item) => sum + item.score, 0);
  const maxScore = categories.reduce((sum, item) => sum + item.max, 0);

  return {
    totalScore,
    maxScore,
    passed: totalScore === maxScore,
    categories,
    secretScan,
    serverless,
    missingLegalPages,
  };
}

function printScorecard(report) {
  console.log('\n==============================================================');
  console.log('         HANZIGO PRE-FLIGHT GO-LIVE READINESS SCORECARD       ');
  console.log('==============================================================');
  for (const cat of report.categories) {
    const status = cat.passed ? 'PASS' : 'FAIL';
    const label = `${cat.name}`.padEnd(28, ' ');
    const pts = `${cat.score}/${cat.max}`.padStart(6, ' ');
    console.log(`[${status}] ${label} ${pts}  | ${cat.detail}`);
  }
  console.log('--------------------------------------------------------------');
  console.log(`TOTAL READINESS SCORE: ${report.totalScore}/${report.maxScore}`);
  console.log('==============================================================\n');
}

const isDirectExecution =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  const report = runPreFlightGoLiveAudit();
  printScorecard(report);
  process.exit(report.passed ? 0 : 1);
}

