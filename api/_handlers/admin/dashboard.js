/**
 * =========================================================================
 * HANZI GO - ADMIN DASHBOARD SUMMARY HANDLER
 * =========================================================================
 * Zero-trust Admin summary endpoint (/api/admin/dashboard):
 * - Enforces CORS allowlist & Bearer JWT auth + active ADMIN role from DB.
 * - Aggregates real database metrics (0 mock numbers).
 * - Masks PII in client error logs & reports.
 * - Never exposes server secret/env variable names in responses.
 */

import {
  verifyRequestAuth,
  getSupabaseAdminClient,
  sendSafeServerError,
} from '../../_utils/supabaseServer.js';
import {
  applyCorsAllowlist,
  isAiKillSwitchEnabled,
} from '../../_utils/corsAndIp.js';

export function redactServerPii(input = '') {
  return String(input || '')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email-đã-che]')
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [đã-che]')
    .replace(/eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.?[A-Za-z0-9_-]*/g, '[token-đã-che]')
    .replace(/\b(?:\+?84|0)(?:3|5|7|8|9)\d{8}\b/g, '[sđt-đã-che]')
    .slice(0, 500);
}

export function buildSafeServiceHealth(env = process.env, hasDbClient = false) {
  const aiDisabled = isAiKillSwitchEnabled();
  const hasAiProvider = Boolean(
    env.GEMINI_API_KEY || env.GEMINI_API_KEYS || env.GROQ_API_KEY || env.OPENROUTER_API_KEY
  );
  const hasSpeechProvider = Boolean(env.AZURE_SPEECH_KEY || env.VITE_SUPABASE_URL || env.SUPABASE_URL);
  const hasRateStore = Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);

  return [
    {
      id: 'ai_tutor',
      label: 'Dịch vụ AI Gia sư & Coach',
      status: aiDisabled ? 'maintenance' : hasAiProvider ? 'active' : 'fallback',
      detail: aiDisabled
        ? 'Đang bật chế độ bảo trì an toàn (chuyển sang sư phạm cục bộ)'
        : hasAiProvider
          ? 'Đang bật · Định tuyến đa tầng sẵn sàng'
          : 'Đang chạy Engine Sư phạm Ngoại tuyến dự phòng',
    },
    {
      id: 'audio_cdn',
      label: 'Audio CDN Azure Neural TTS',
      status: hasSpeechProvider ? 'ready' : 'fallback',
      detail: hasSpeechProvider
        ? 'Sẵn sàng · Bộ nhớ đệm CDN & tổng hợp giọng chuẩn'
        : 'Đang dùng Web Speech trình duyệt dự phòng',
    },
    {
      id: 'database',
      label: 'Cơ sở dữ liệu & Realtime',
      status: hasDbClient ? 'online' : 'degraded',
      detail: hasDbClient
        ? 'Kết nối Supabase PostgreSQL & RLS ổn định'
        : 'Đang ở chế độ đọc cục bộ / chưa kết nối máy chủ',
    },
    {
      id: 'rate_limiter',
      label: 'Giới hạn tốc độ & Chống lạm dụng',
      status: hasRateStore ? 'active' : 'fallback',
      detail: hasRateStore
        ? 'Bộ đệm phân tán đang bảo vệ các tuyến AI & API'
        : 'Đang dùng bộ giới hạn bộ nhớ cục bộ từng phiên',
    },
  ];
}

function getVietnamDateKey(isoOrDate) {
  try {
    const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
}

function getVietnamShortLabel(dateKey) {
  const parts = String(dateKey || '').split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateKey;
}

function deriveAttemptExamSystem(examId = '', examMeta = null) {
  const ver = String(examMeta?.exam_version || '');
  const lvl = String(examMeta?.level || '');
  const idLower = String(examId || '').toLowerCase();
  if (/3\.0/i.test(ver) || idLower.includes('hsk30') || /7/.test(lvl)) {
    return 'hsk_3_0';
  }
  return 'hsk_2_0';
}

export default async function dashboardHandler(req, res) {
  if (applyCorsAllowlist(req, res, 'GET, OPTIONS')) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET.' });
  }

  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated || !auth.user) {
    return res.status(401).json({ error: 'Yêu cầu chưa được xác thực.' });
  }

  const role = String(auth.user.role || '').trim().toLowerCase();
  if (role !== 'admin' || auth.user.status === 'blocked') {
    return res.status(403).json({ error: 'Quyền truy cập bị từ chối. Chỉ Quản trị viên mới được phép truy cập.' });
  }

  try {
    const adminClient = getSupabaseAdminClient();
    const serviceHealth = buildSafeServiceHealth(process.env, Boolean(adminClient));

    const now = new Date();
    const sevenDaysAgoIso = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oneDayAgoIso = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const dayKeys = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const dt = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
      dayKeys.push(getVietnamDateKey(dt));
    }

    const emptyTrends = dayKeys.map((dk) => ({
      date: dk,
      label: getVietnamShortLabel(dk),
      count: 0,
    }));

    if (!adminClient) {
      return res.status(200).json({
        kpis: {
          totalUsers: 0,
          activeLearners7d: 0,
          totalHskAttempts: 0,
          hsk20Attempts: 0,
          hsk30Attempts: 0,
          communityPostsCount: 0,
          openReportsCount: 0,
          clientErrors24h: 0,
        },
        trends7d: emptyTrends,
        hskDistribution: [],
        contentHealth: {
          hsk20QuestionsCount: 0,
          hsk30QuestionsCount: 0,
          hsk15ImageCoveragePercent: 0,
          hsk15ImageCount: 0,
          hsk15TotalCount: 0,
          materialsCount: 0,
        },
        urgentItems: [],
        serviceHealth,
        clientErrorLogs: [],
        generatedAt: now.toISOString(),
      });
    }

    const safeSelect = async (promise) => {
      try {
        const result = await promise;
        return result || { data: null, count: 0, error: null };
      } catch {
        return { data: null, count: 0, error: true };
      }
    };

    const [
      profilesAllRes,
      profilesActiveRes,
      examsRes,
      attemptsRes,
      questionsRes,
      postsRes,
      openReportsCountRes,
      recentReportsRes,
      materialsRes,
      errors24hRes,
      recentErrorsRes,
    ] = await Promise.all([
      safeSelect(adminClient.from('profiles').select('id', { count: 'exact', head: true })),
      safeSelect(
        adminClient
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('updated_at', sevenDaysAgoIso)
      ),
      safeSelect(adminClient.from('hsk_exams').select('id, level, exam_version')),
      safeSelect(
        adminClient
          .from('hsk_attempts')
          .select('id, exam_id, created_at', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(500)
      ),
      safeSelect(adminClient.from('hsk_questions').select('id, exam_id, image_url')),
      safeSelect(
        adminClient
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .neq('status', 'deleted')
      ),
      safeSelect(
        adminClient
          .from('community_reports')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'reviewing'])
      ),
      safeSelect(
        adminClient
          .from('community_reports')
          .select('id, target_type, target_id, reason, details, status, created_at')
          .in('status', ['pending', 'reviewing'])
          .order('created_at', { ascending: false })
          .limit(5)
      ),
      safeSelect(adminClient.from('materials').select('id', { count: 'exact', head: true })),
      safeSelect(
        adminClient
          .from('client_error_logs')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', oneDayAgoIso)
      ),
      safeSelect(
        adminClient
          .from('client_error_logs')
          .select('id, created_at, route, error_name, error_message, component_stack_short, app_version, fingerprint')
          .order('created_at', { ascending: false })
          .limit(50)
      ),
    ]);

    const examsMap = new Map();
    if (Array.isArray(examsRes.data)) {
      examsRes.data.forEach((ex) => {
        if (ex?.id) examsMap.set(ex.id, ex);
      });
    }

    const trendBuckets = new Map(dayKeys.map((dk) => [dk, 0]));
    const levelBuckets = new Map();
    let hsk20Attempts = 0;
    let hsk30Attempts = 0;

    const attemptRows = Array.isArray(attemptsRes.data) ? attemptsRes.data : [];
    attemptRows.forEach((att) => {
      const ex = examsMap.get(att.exam_id);
      const sys = deriveAttemptExamSystem(att.exam_id, ex);
      if (sys === 'hsk_3_0') hsk30Attempts += 1;
      else hsk20Attempts += 1;

      const dk = getVietnamDateKey(att.created_at);
      if (trendBuckets.has(dk)) {
        trendBuckets.set(dk, trendBuckets.get(dk) + 1);
      }

      const lvl = ex?.level || (String(att.exam_id || '').match(/hsk\s*\d/i)?.[0] || 'Khác').toUpperCase();
      levelBuckets.set(lvl, (levelBuckets.get(lvl) || 0) + 1);
    });

    const trends7d = dayKeys.map((dk) => ({
      date: dk,
      label: getVietnamShortLabel(dk),
      count: trendBuckets.get(dk) || 0,
    }));

    const hskDistribution = Array.from(levelBuckets.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => a.level.localeCompare(b.level));

    let hsk20QuestionsCount = 0;
    let hsk30QuestionsCount = 0;
    let hsk15TotalCount = 0;
    let hsk15ImageCount = 0;

    if (Array.isArray(questionsRes.data)) {
      questionsRes.data.forEach((q) => {
        const ex = examsMap.get(q.exam_id);
        const sys = deriveAttemptExamSystem(q.exam_id, ex);
        if (sys === 'hsk_3_0') hsk30QuestionsCount += 1;
        else hsk20QuestionsCount += 1;

        const lvlStr = String(ex?.level || q.exam_id || '');
        if (/hsk[\s_-]*[1-5](?:\D|$)/i.test(lvlStr)) {
          hsk15TotalCount += 1;
          if (q.image_url) hsk15ImageCount += 1;
        }
      });
    }

    const hsk15ImageCoveragePercent =
      hsk15TotalCount > 0 ? Math.round((hsk15ImageCount / hsk15TotalCount) * 100) : 0;

    const cleanErrorLogs = (Array.isArray(recentErrorsRes.data) ? recentErrorsRes.data : []).map((row) => ({
      id: row.id,
      created_at: row.created_at,
      route: String(row.route || '/').slice(0, 120),
      error_name: String(row.error_name || 'Error').slice(0, 80),
      error_message: redactServerPii(row.error_message || ''),
      component_stack_short: redactServerPii(row.component_stack_short || ''),
      app_version: String(row.app_version || '').slice(0, 40),
      fingerprint: String(row.fingerprint || `${row.error_name || 'Error'}|${row.route || '/'}`).slice(0, 120),
    }));

    const urgentReports = (Array.isArray(recentReportsRes.data) ? recentReportsRes.data : []).map((rep) => ({
      id: `rep-${rep.id}`,
      type: 'report',
      targetTab: 'moderation',
      title: `Báo cáo ${rep.target_type || 'nội dung'} (${rep.reason || 'other'})`,
      summary: redactServerPii(rep.details || 'Chờ quản trị viên xem xét'),
      createdAt: rep.created_at,
    }));

    const errorCounts = new Map();
    cleanErrorLogs.forEach((log) => {
      const existing = errorCounts.get(log.fingerprint) || { ...log, count: 0 };
      existing.count += 1;
      errorCounts.set(log.fingerprint, existing);
    });
    const urgentErrors = Array.from(errorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((err) => ({
        id: `err-${err.fingerprint}`,
        type: 'error',
        targetTab: 'ai_metrics',
        title: `${err.error_name} (${err.count} lần) · ${err.route}`,
        summary: err.error_message,
        createdAt: err.created_at,
      }));

    const urgentItems = [...urgentReports, ...urgentErrors].slice(0, 5);

    return res.status(200).json({
      kpis: {
        totalUsers: Number(profilesAllRes.count || 0),
        activeLearners7d: Number(profilesActiveRes.count || 0),
        totalHskAttempts: Number(attemptsRes.count || attemptRows.length || 0),
        hsk20Attempts,
        hsk30Attempts,
        communityPostsCount: Number(postsRes.count || 0),
        openReportsCount: Number(openReportsCountRes.count || urgentReports.length || 0),
        clientErrors24h: Number(errors24hRes.count || 0),
      },
      trends7d,
      hskDistribution,
      contentHealth: {
        hsk20QuestionsCount,
        hsk30QuestionsCount,
        hsk15ImageCoveragePercent,
        hsk15ImageCount,
        hsk15TotalCount,
        materialsCount: Number(materialsRes.count || 0),
      },
      urgentItems,
      serviceHealth,
      clientErrorLogs: cleanErrorLogs,
      generatedAt: now.toISOString(),
    });
  } catch (err) {
    return sendSafeServerError(res, 'Không thể tải dữ liệu tổng quan quản trị.', err);
  }
}
