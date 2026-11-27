import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  buildVietnam7DayTrendSeries,
  canModifyTargetUser,
  checkIsAdmin,
  createEmptyDashboardSummary,
  formatVietnamDateTime,
  groupClientErrorLogs,
  redactPiiText,
} from '../src/components/admin/adminHelpers.js';
import dashboardHandler, {
  buildSafeServiceHealth,
  redactServerPii,
} from '../api/_handlers/admin/dashboard.js';
import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

const SECRET_ENV_TOKENS = [
  'GEMINI_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AZURE_SPEECH_KEY',
  'UPSTASH_REDIS_REST_TOKEN',
  'LIVEKIT_API_SECRET',
];

function createMockReqRes({ method = 'GET', headers = {}, query = {}, url = '/api/admin/dashboard' } = {}) {
  let statusCode = 200;
  let body = null;
  const resHeaders = {};
  const req = { method, headers, query, url, socket: { remoteAddress: '127.0.0.1' } };
  const res = {
    setHeader(k, v) {
      resHeaders[k] = v;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
  return { req, res, getStatus: () => statusCode, getBody: () => body, getHeaders: () => resHeaders };
}

test('1. RBAC Guard: Client & Server /api/admin/dashboard block guests, students, teachers, and blocked admins', async () => {
  // Client helper
  assert.equal(checkIsAdmin(null), false);
  assert.equal(checkIsAdmin({ role: 'student', status: 'active' }), false);
  assert.equal(checkIsAdmin({ role: 'teacher', status: 'active' }), false);
  assert.equal(checkIsAdmin({ role: 'admin', status: 'blocked' }), false);
  assert.equal(checkIsAdmin({ role: 'ADMIN', status: 'active' }), true);
  assert.equal(checkIsAdmin({ role: 'admin', status: 'active' }), true);

  // AdminPage & AdminDashboard enforce !isAdmin UI gate & useAdminDashboard short-circuits fetches
  const adminPageSrc = fs.readFileSync(path.resolve('src/pages/AdminPage.jsx'), 'utf8');
  assert.match(adminPageSrc, /if\s*\(\s*!dash\.isAdmin\s*\)/);
  const adminHomeSrc = fs.readFileSync(path.resolve('src/components/dashboard/AdminDashboard.jsx'), 'utf8');
  assert.ok(adminHomeSrc.includes('checkIsAdmin'), 'AdminDashboard must validate admin role with checkIsAdmin');
  assert.match(adminHomeSrc, /if\s*\(\s*!isAdmin\s*\)/);
  const hookSrc = fs.readFileSync(path.resolve('src/components/admin/hooks/useAdminDashboard.js'), 'utf8');
  assert.match(hookSrc, /if\s*\(\s*!isAdmin\s*\)/);
  assert.ok(hookSrc.includes('parseAdminTabFromHash'), 'useAdminDashboard must support #admin?tab= deep links');

  // Server endpoint rejects unauthenticated caller (401)
  const unauth = createMockReqRes({ method: 'GET' });
  await dashboardHandler(unauth.req, unauth.res);
  assert.equal(unauth.getStatus(), 401);

  // Mock Supabase admin client with deterministic verifyRequestAuth profiles
  const mockProfileById = new Map([
    ['stu-1', { id: 'stu-1', role: 'student', status: 'active', email: 's@hanzigo.test' }],
    ['tea-1', { id: 'tea-1', role: 'teacher', status: 'active', email: 't@hanzigo.test' }],
    ['adm-blocked', { id: 'adm-blocked', role: 'admin', status: 'blocked', email: 'b@hanzigo.test' }],
    ['adm-1', { id: 'adm-1', role: 'admin', status: 'active', email: 'a@hanzigo.test' }],
  ]);

  const makeQueryChain = (tableName) => {
    const state = { filters: [] };
    const resolveData = () => {
      if (tableName === 'profiles') {
        const idFilter = state.filters.find((f) => f.col === 'id');
        if (idFilter) {
          return { data: mockProfileById.get(idFilter.val) || null, error: null };
        }
        return { data: [], count: 0, error: null };
      }
      return { data: [], count: 0, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(col, val) {
        state.filters.push({ col, val });
        return chain;
      },
      neq() { return chain; },
      in() { return chain; },
      gte() { return chain; },
      order() { return chain; },
      limit() { return chain; },
      single() { return Promise.resolve(resolveData()); },
      maybeSingle() { return Promise.resolve(resolveData()); },
      then(resolve, reject) {
        return Promise.resolve(resolveData()).then(resolve, reject);
      },
    };
    return chain;
  };

  setSupabaseAdminClientForTesting({
    auth: {
      getUser: async (token) => {
        if (!token || !mockProfileById.has(token)) {
          return { data: { user: null }, error: new Error('Invalid token') };
        }
        return { data: { user: { id: token, email: `${token}@hanzigo.test` } }, error: null };
      },
    },
    from(table) {
      return makeQueryChain(table);
    },
  });

  try {
    // Student -> 403
    const stuReq = createMockReqRes({ headers: { authorization: 'Bearer stu-1' } });
    await dashboardHandler(stuReq.req, stuReq.res);
    assert.equal(stuReq.getStatus(), 403);

    // Teacher -> 403
    const teaReq = createMockReqRes({ headers: { authorization: 'Bearer tea-1' } });
    await dashboardHandler(teaReq.req, teaReq.res);
    assert.equal(teaReq.getStatus(), 403);

    // Blocked Admin -> 401 (denied directly at verifyRequestAuth gate)
    const blockedReq = createMockReqRes({ headers: { authorization: 'Bearer adm-blocked' } });
    await dashboardHandler(blockedReq.req, blockedReq.res);
    assert.equal(blockedReq.getStatus(), 401);

    // Active Admin -> 200 with structured payload
    const admReq = createMockReqRes({ headers: { authorization: 'Bearer adm-1' } });
    await dashboardHandler(admReq.req, admReq.res);
    assert.equal(admReq.getStatus(), 200);
    const payload = admReq.getBody();
    assert.ok(payload && payload.kpis && Array.isArray(payload.trends7d) && Array.isArray(payload.serviceHealth));
    const jsonBlob = JSON.stringify(payload);
    for (const secretName of SECRET_ENV_TOKENS) {
      assert.equal(jsonBlob.includes(secretName), false, `API payload leaked secret name: ${secretName}`);
    }
  } finally {
    setSupabaseAdminClientForTesting(null);
  }
});

test('2. Self-Lockout Guard prevents admin from demoting, locking, or deleting own account', () => {
  const adminUser = { id: 'uid-admin-1', uid: 'uid-admin-1', email: 'admin@hanzigo.io.vn', role: 'admin' };
  const byId = canModifyTargetUser(adminUser, { id: 'uid-admin-1', email: 'other@hanzigo.io.vn' });
  assert.equal(byId.allowed, false);

  const byEmail = canModifyTargetUser(adminUser, { id: 'uid-999', email: 'Admin@HanziGo.io.vn' });
  assert.equal(byEmail.allowed, false);

  const otherStudent = canModifyTargetUser(adminUser, { id: 'uid-student-2', email: 'student@hanzigo.io.vn' });
  assert.equal(otherStudent.allowed, true);
});

test('3. Zero Env / Secret Name Leak across Admin UI and Service Health builder', () => {
  const health = buildSafeServiceHealth({ GEMINI_API_KEY: 'fake', AZURE_SPEECH_KEY: 'fake' }, true);
  const healthBlob = JSON.stringify(health);
  for (const secretName of SECRET_ENV_TOKENS) {
    assert.equal(healthBlob.includes(secretName), false, `Service health leaked env name ${secretName}`);
  }

  const adminDir = path.resolve('src/components/admin');
  const uiFiles = [
    path.resolve('src/pages/AdminPage.jsx'),
    path.resolve('src/components/dashboard/AdminDashboard.jsx'),
    ...fs.readdirSync(adminDir)
      .filter((f) => f.endsWith('.js') || f.endsWith('.jsx'))
      .map((f) => path.join(adminDir, f)),
  ];

  for (const file of uiFiles) {
    const src = fs.readFileSync(file, 'utf8');
    for (const secretName of [...SECRET_ENV_TOKENS, 'AI_ALLOW_PREMIUM_TIER']) {
      assert.equal(src.includes(secretName), false, `Secret/env name ${secretName} found in ${file}`);
    }
  }
});

test('4. Zero XSS & PII Safety in Admin UI, client_error_logs grouping, and server redaction', () => {
  const adminFiles = [
    path.resolve('src/pages/AdminPage.jsx'),
    path.resolve('src/components/dashboard/AdminDashboard.jsx'),
    ...fs.readdirSync(path.resolve('src/components/admin'))
      .filter((f) => f.endsWith('.js') || f.endsWith('.jsx'))
      .map((f) => path.join(path.resolve('src/components/admin'), f)),
  ];

  for (const file of adminFiles) {
    const src = fs.readFileSync(file, 'utf8');
    assert.equal(src.includes('dangerouslySetInnerHTML'), false, `Unsafe dangerouslySetInnerHTML in ${file}`);
  }

  const dirty = 'User alice@example.com failed with Bearer abcdef12345 and phone 0912345678 <script>alert(1)</script>';
  const cleanClient = redactPiiText(dirty);
  const cleanServer = redactServerPii(dirty);
  assert.equal(cleanClient.includes('alice@example.com'), false);
  assert.equal(cleanClient.includes('abcdef12345'), false);
  assert.equal(cleanClient.includes('0912345678'), false);
  assert.equal(cleanServer.includes('alice@example.com'), false);

  const grouped = groupClientErrorLogs([
    {
      id: 1,
      fingerprint: 'fp-1',
      route: '#hsk',
      error_name: 'TypeError',
      error_message: 'Bad token for bob@example.com',
      created_at: '2026-11-28T01:00:00Z',
    },
    {
      id: 2,
      fingerprint: 'fp-1',
      route: '#hsk',
      error_name: 'TypeError',
      error_message: 'Bad token for bob@example.com',
      created_at: '2026-11-28T02:00:00Z',
    },
  ]);
  assert.equal(grouped.length, 1);
  assert.equal(grouped[0].count, 2);
  assert.equal(grouped[0].message.includes('bob@example.com'), false);
  assert.ok(formatVietnamDateTime('2026-11-28T02:00:00Z').length > 4);
});

test('5. Zero Mock Data & Valid Empty States + Additive SECURITY DEFINER SQL Migration', () => {
  const empty = createEmptyDashboardSummary();
  assert.equal(empty.kpis.totalUsers, 0);
  assert.equal(empty.kpis.totalHskAttempts, 0);
  assert.equal(empty.kpis.clientErrors24h, 0);
  assert.equal(empty.urgentItems.length, 0);

  const emptyTrends = buildVietnam7DayTrendSeries([]);
  assert.equal(emptyTrends.length, 7);
  assert.ok(emptyTrends.every((pt) => pt.count === 0));

  const aiDashSrc = fs.readFileSync(path.resolve('src/components/admin/AiMonitoringDashboard.jsx'), 'utf8');
  assert.equal(aiDashSrc.includes('totalRequestsToday: 142'), false, 'Hardcoded mock metric 142 must be removed');
  assert.equal(aiDashSrc.includes('128400'), false, 'Hardcoded mock metric 128400 must be removed');

  const sqlSrc = fs.readFileSync(
    path.resolve('supabase/migrations/20261130_admin_dashboard_summary_rpc.sql'),
    'utf8'
  );
  assert.match(sqlSrc, /SECURITY DEFINER/i);
  assert.match(sqlSrc, /SET search_path = public, pg_temp/i);
  assert.match(sqlSrc, /public\.is_admin\(\)/i);
});

test('6. File Size Guard (AdminPage.jsx <= 35 KB), Live Summary Integration & Responsive Controls', () => {
  const adminSize = fs.statSync(path.resolve('src/pages/AdminPage.jsx')).size;
  assert.ok(adminSize <= 35 * 1024, `AdminPage.jsx (${adminSize} B) exceeds 35 KB target`);

  const adminDashSrc = fs.readFileSync(path.resolve('src/components/dashboard/AdminDashboard.jsx'), 'utf8');
  assert.ok(adminDashSrc.includes('fetchAdminDashboardSummary'), 'AdminDashboard must wire fetchAdminDashboardSummary');
  assert.ok(adminDashSrc.includes('redactPiiText'), 'AdminDashboard must redact PII in urgent admin items');

  for (const rel of [
    'src/pages/AdminPage.jsx',
    'src/components/dashboard/AdminDashboard.jsx',
    'src/components/admin/AdminOverviewPanel.jsx',
    'src/components/admin/AdminSystemHealthPanel.jsx',
  ]) {
    const src = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.match(src, /min-h-11/, `${rel} must include >= 44px touch targets`);
    assert.match(src, /overflow-x-auto/, `${rel} must guard wide tables/charts with overflow-x-auto`);
  }
});
