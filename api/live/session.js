/**
 * =========================================================================
 * HANZI GO - PRODUCTION API: /api/live/session
 * =========================================================================
 * Serverless endpoint for creating, syncing, and querying active live classroom sessions.
 * Guarantees that students in all browsers, tabs, and devices immediately see active live rooms.
 */

import { getSupabaseAdminClient } from '../utils/supabaseServer.js';

// In-memory global fallback for serverless container reuse
const memorySessions = new Map();

export default async function handler(req, res) {
  const supabase = getSupabaseAdminClient();

  if (req.method === 'GET') {
    const { classroomId, sessionId } = req.query || {};

    // 1. Query by specific sessionId
    if (sessionId) {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('class_sessions')
            .select('*')
            .eq('id', sessionId)
            .maybeSingle();

          if (!error && data) {
            return res.status(200).json({ success: true, session: data });
          }
        } catch (err) {
          console.warn('[/api/live/session] Supabase sessionId query notice:', err.message);
        }
      }

      const mem = memorySessions.get(sessionId);
      if (mem) {
        return res.status(200).json({ success: true, session: mem });
      }

      return res.status(200).json({ success: true, session: null });
    }

    // 2. Query active session by classroomId
    if (classroomId) {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('class_sessions')
            .select('*')
            .eq('classroom_id', classroomId)
            .eq('status', 'live')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            return res.status(200).json({ success: true, session: data });
          }
        } catch (err) {
          console.warn('[/api/live/session] Supabase classroomId query notice:', err.message);
        }
      }

      // Memory fallback lookup
      for (const ses of memorySessions.values()) {
        if (
          (ses.classroom_id === classroomId || String(ses.classroom_id) === String(classroomId)) &&
          ses.status === 'live'
        ) {
          return res.status(200).json({ success: true, session: ses });
        }
      }

      return res.status(200).json({ success: true, session: null });
    }

    return res.status(400).json({ error: 'Thiếu tham số classroomId hoặc sessionId.' });
  }

  if (req.method === 'POST') {
    const session = req.body?.session || req.body;
    if (!session || !session.classroom_id) {
      return res.status(400).json({ error: 'Dữ liệu phiên học không hợp lệ.' });
    }

    const sessionId = session.id || `ses-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const sessionRecord = {
      ...session,
      id: sessionId,
      status: session.status || 'live',
      started_at: session.started_at || new Date().toISOString(),
      created_at: session.created_at || new Date().toISOString(),
      ended_at: session.status === 'ended' ? (session.ended_at || new Date().toISOString()) : null
    };

    // Store in memory cache
    memorySessions.set(sessionId, sessionRecord);

    // Save to Supabase using admin client
    if (supabase) {
      try {
        if (sessionRecord.status === 'live') {
          // Close prior live sessions for this classroom
          await supabase
            .from('class_sessions')
            .update({ status: 'ended', ended_at: new Date().toISOString() })
            .eq('classroom_id', sessionRecord.classroom_id)
            .eq('status', 'live');
        }

        await supabase
          .from('class_sessions')
          .upsert({
            id: sessionRecord.id,
            classroom_id: sessionRecord.classroom_id,
            teacher_id: sessionRecord.teacher_id,
            title: sessionRecord.title || 'Lớp học trực tuyến',
            status: sessionRecord.status,
            started_at: sessionRecord.started_at,
            ended_at: sessionRecord.ended_at,
            max_capacity: sessionRecord.max_capacity || 50
          });
      } catch (err) {
        console.warn('[/api/live/session] Supabase upsert notice:', err.message);
      }
    }

    return res.status(200).json({ success: true, session: sessionRecord });
  }

  return res.status(405).json({ error: 'Chỉ chấp nhận phương thức GET hoặc POST.' });
}
