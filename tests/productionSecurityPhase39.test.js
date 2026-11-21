import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { sendSafeServerError, setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';
import assignmentsHandler from '../api/_handlers/classroom/assignments.js';
import { sanitizeFilename, validateMaterialFile, MAX_FILE_SIZE_BYTES } from '../src/services/storageService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readRel(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function collectFiles(dir, exts) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

test('Task 39.05 (1): vercel.json enforces core HTTP Security Headers', () => {
  const vercelCfg = JSON.parse(readRel('vercel.json'));
  const globalHeadersRule = vercelCfg.headers.find((h) => h.source === '/(.*)');
  assert.ok(globalHeadersRule, 'Global /(.*) headers rule must exist in vercel.json');

  const headerMap = new Map(globalHeadersRule.headers.map((h) => [h.key, h.value]));
  assert.equal(headerMap.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(headerMap.get('X-Frame-Options'), 'SAMEORIGIN');
  assert.equal(headerMap.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.ok(headerMap.get('Strict-Transport-Security')?.includes('max-age=63072000'));
  assert.ok(headerMap.get('Permissions-Policy')?.includes('geolocation=()'));
});

test('Task 39.05 (2): CORS wildcard (*) is never paired with Access-Control-Allow-Credentials', () => {
  const apiFiles = collectFiles(path.join(ROOT, 'api'), ['.js']);
  for (const file of apiFiles) {
    const src = fs.readFileSync(file, 'utf8');
    const hasWildcardOrigin = /Access-Control-Allow-Origin['"`]\s*,\s*['"`]\*['"`]/.test(src);
    const hasCredentialsTrue = /Access-Control-Allow-Credentials['"`]\s*,\s*['"`]true['"`]/.test(src);
    assert.equal(
      hasWildcardOrigin && hasCredentialsTrue,
      false,
      `Unsafe CORS wildcard + credentials detected in ${path.relative(ROOT, file)}`
    );
  }
});

test('Task 39.05 (3): File upload validation & path traversal sanitization', () => {
  assert.equal(sanitizeFilename('../../etc/passwd'), 'passwd');
  assert.equal(sanitizeFilename('..\\..\\secret<script>.pdf'), 'secret_script_.pdf');

  const oversized = validateMaterialFile({
    name: 'lesson.pdf',
    size: MAX_FILE_SIZE_BYTES + 1,
    type: 'application/pdf',
  });
  assert.equal(oversized.valid, false);

  const dangerousExt = validateMaterialFile({
    name: 'payload.html',
    size: 1024,
    type: 'text/html',
  });
  assert.equal(dangerousExt.valid, false);

  const validPdf = validateMaterialFile({
    name: 'HSK3_Grammar.pdf',
    size: 2048,
    type: 'application/pdf',
  });
  assert.equal(validPdf.valid, true);
});

test('Task 39.05 (4): Database migration locks down profile role self-escalation', () => {
  const migrationSrc = readRel('supabase/migrations/20261108_final_security_hardening_v2.sql');
  assert.match(migrationSrc, /trg_prevent_role_escalation/);
  assert.match(migrationSrc, /NEW\.role IS DISTINCT FROM OLD\.role/);
  assert.match(migrationSrc, /NOT public\.is_admin\(\)/);
});

test('Task 39.05 (5): sendSafeServerError suppresses internal error messages in production and sub-handlers use it', () => {
  const prevEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    let capturedStatus = null;
    let capturedPayload = null;
    const mockRes = {
      headersSent: false,
      status(code) {
        capturedStatus = code;
        return this;
      },
      json(body) {
        capturedPayload = body;
        return this;
      },
    };

    sendSafeServerError(mockRes, 'Lỗi máy chủ nội bộ.', new Error('relation "secret_table" does not exist'));
    assert.equal(capturedStatus, 500);
    assert.equal(capturedPayload.error, 'Lỗi máy chủ nội bộ.');
    assert.equal(capturedPayload.message, undefined);
  } finally {
    process.env.NODE_ENV = prevEnv;
  }

  const hardenedHandlers = [
    'api/_handlers/ai/pronunciation.js',
    'api/_webrtc/ice-servers.js',
    'api/_webrtc/livekit-token.js',
    'api/_handlers/classroom/assignments.js',
    'api/_handlers/classroom/create.js',
    'api/_handlers/classroom/join.js',
    'api/_handlers/classroom/remove.js',
    'api/_handlers/hsk/analytics.js',
    'api/_handlers/hsk/history.js',
    'api/_handlers/hsk/import.js',
    'api/_handlers/hsk/mistakes.js',
    'api/_handlers/hsk/report.js',
    'api/_handlers/hsk/resources.js',
    'api/_handlers/hsk/review.js',
  ];

  for (const rel of hardenedHandlers) {
    const src = readRel(rel);
    assert.match(src, /sendSafeServerError\(/, `${rel} must use sendSafeServerError()`);
    assert.doesNotMatch(
      src,
      /res\.status\(500\)\.json\([^)]*(err\.message|err\?\.message|error\.message)/,
      `${rel} must not leak raw error.message in HTTP 500`
    );
  }
});

test('Task 39.05 (6): Client source and vercel.json contain zero server-only secrets', () => {
  const clientFiles = collectFiles(path.join(ROOT, 'src'), ['.js', '.jsx', '.ts', '.tsx']);
  const secretUsagePattern =
    /(import\.meta\.env\.(VITE_)?(SUPABASE_SERVICE_ROLE_KEY|LIVEKIT_API_SECRET|AZURE_SPEECH_KEY|UPSTASH_REDIS_REST_TOKEN|GEMINI_API_KEY|OPENAI_API_KEY)|process\.env\.(SUPABASE_SERVICE_ROLE_KEY|LIVEKIT_API_SECRET|AZURE_SPEECH_KEY|UPSTASH_REDIS_REST_TOKEN|GEMINI_API_KEY|OPENAI_API_KEY)|AIza[0-9A-Za-z_-]{20,}|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/;

  for (const file of clientFiles) {
    const src = fs.readFileSync(file, 'utf8');
    assert.equal(
      secretUsagePattern.test(src),
      false,
      `Server secret usage or literal found in client file ${path.relative(ROOT, file)}`
    );
  }
  assert.equal(secretUsagePattern.test(readRel('vercel.json')), false);
});

test('Task 39.05+ (7): Teacher A cannot create assignment in Teacher B classroom (HTTP 403)', async () => {
  const mockSupabase = {
    auth: {
      async getUser() {
        return { data: { user: { id: 'teacher-a', email: 'ta@hanzigo.test' } }, error: null };
      },
    },
    from(table) {
      if (table === 'profiles') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return { data: { id: 'teacher-a', role: 'teacher', status: 'active' }, error: null };
                  },
                };
              },
            };
          },
        };
      }
      if (table === 'classrooms') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return { data: { id: 'cls-b', teacher_id: 'teacher-b' }, error: null };
                  },
                };
              },
            };
          },
        };
      }
      throw new Error(`Unexpected DB write to ${table}`);
    },
  };

  try {
    setSupabaseAdminClientForTesting(mockSupabase);
    let capturedStatus = null;
    let capturedBody = null;
    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer teacher-a-token' },
      body: {
        action: 'create_assignment',
        classroomId: 'cls-b',
        title: 'Cross-teacher unauthorized assignment',
        assignmentType: 'hsk_mock_exam',
        targetResourceId: 'H31329',
      },
    };
    const res = {
      status(code) {
        capturedStatus = code;
        return this;
      },
      json(payload) {
        capturedBody = payload;
        return this;
      },
    };
    await assignmentsHandler(req, res);
    assert.equal(capturedStatus, 403);
    assert.match(capturedBody?.error || '', /không có quyền giao bài/i);
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

test('Task 39.05+ (8): newsletter/subscribe.js uses distributed checkRateLimitAndQuota', () => {
  const src = readRel('api/_handlers/newsletter/subscribe.js');
  assert.match(src, /import\s*\{\s*checkRateLimitAndQuota\s*\}\s*from\s*'\.\.\/\.\.\/_utils\/distributedRateLimiter\.js'/);
  assert.match(src, /checkRateLimitAndQuota\(/);
  assert.doesNotMatch(src, /new Map\(\)/);
});

test('Task 39.05+ (9): vercel.json includes Content-Security-Policy-Report-Only with required origins', () => {
  const vercelCfg = JSON.parse(readRel('vercel.json'));
  const globalRule = vercelCfg.headers.find((h) => h.source === '/(.*)');
  const cspHeader = globalRule.headers.find((h) => h.key === 'Content-Security-Policy-Report-Only');
  assert.ok(cspHeader, 'Content-Security-Policy-Report-Only must be configured');
  assert.match(cspHeader.value, /default-src 'self'/);
  assert.match(cspHeader.value, /fonts\.googleapis\.com/);
  assert.match(cspHeader.value, /fonts\.gstatic\.com/);
  assert.match(cspHeader.value, /\*\.supabase\.co/);
  assert.match(cspHeader.value, /\*\.livekit\.cloud/);
  assert.match(cspHeader.value, /cdn\.jsdelivr\.net/);
});
