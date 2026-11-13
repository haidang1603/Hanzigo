/**
 * =========================================================================
 * HANZI GO - CLASSROOM HSK ASSIGNMENTS & ANALYTICS HANDLER
 * =========================================================================
 * Task 33.04:
 * - GET  ?classroomId=...                   -> List assignments + student status or teacher completion stats
 * - GET  ?assignmentId=...&analytics=true   -> RPC get_classroom_assignment_analytics + submissions breakdown
 * - POST (action: 'create_assignment')      -> Teacher/Admin creates assignment & initializes 'assigned' rows
 * - POST (action: 'submit_assignment')      -> Student submits score, wrong_question_numbers & weak_vocab_words
 */
import { verifyRequestAuth, getSupabaseAdminClient } from '../../_utils/supabaseServer.js';

const ALLOWED_ASSIGNMENT_TYPES = new Set([
  'hsk_mock_exam',
  'reading_article',
  'vocab_deck_srs',
  'hanzi_writing_drill',
]);

function isTeacherOrAdminRole(user) {
  return user?.role === 'teacher' || user?.role === 'admin';
}

export default async function assignmentsHandler(req, res) {
  const auth = await verifyRequestAuth(req);
  if (!auth.authenticated || !auth.user) {
    return res.status(401).json({ error: 'Yêu cầu chưa được xác thực. Vui lòng đăng nhập.' });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return res.status(503).json({ error: 'Dịch vụ cơ sở dữ liệu chưa sẵn sàng.' });
  }

  const user = auth.user;

  if (req.method === 'GET') {
    const { classroomId, assignmentId, analytics } = req.query || {};

    if (analytics === 'true' && assignmentId) {
      try {
        const { data: assignmentRow, error: asgErr } = await supabase
          .from('classroom_hsk_assignments')
          .select('id, classroom_id, teacher_id, title, assignment_type, target_resource_id, hsk_level, due_at')
          .eq('id', assignmentId)
          .maybeSingle();

        if (asgErr || !assignmentRow) {
          return res.status(404).json({ error: 'Không tìm thấy bài tập.' });
        }

        if (!isTeacherOrAdminRole(user) && String(assignmentRow.teacher_id) !== String(user.id)) {
          return res.status(403).json({ error: 'Chỉ giáo viên hoặc quản trị viên mới có quyền xem phân tích lớp.' });
        }

        const [{ data: rpcData, error: rpcErr }, { data: submissionRows, error: subErr }] = await Promise.all([
          supabase.rpc('get_classroom_assignment_analytics', { p_assignment_id: assignmentId }),
          supabase
            .from('classroom_assignment_submissions')
            .select('id, student_id, status, total_score, max_score, accuracy_pct, wrong_question_numbers, weak_vocab_words, submitted_at')
            .eq('assignment_id', assignmentId)
            .order('total_score', { ascending: false }),
        ]);

        if (rpcErr) {
          return res.status(500).json({ error: `Lỗi RPC phân tích bài tập: ${rpcErr.message}` });
        }

        return res.status(200).json({
          success: true,
          assignment: assignmentRow,
          analytics: rpcData || null,
          submissions: subErr ? [] : (submissionRows || []),
        });
      } catch (err) {
        return res.status(500).json({ error: err?.message || 'Lỗi máy chủ khi lấy phân tích bài tập.' });
      }
    }

    if (!classroomId) {
      return res.status(400).json({ error: 'Thiếu tham số classroomId.' });
    }

    try {
      const { data: assignments, error: listErr } = await supabase
        .from('classroom_hsk_assignments')
        .select('*')
        .eq('classroom_id', classroomId)
        .order('created_at', { ascending: false });

      if (listErr) {
        return res.status(500).json({ error: `Không thể tải danh sách bài tập: ${listErr.message}` });
      }

      const assignmentList = assignments || [];
      if (assignmentList.length === 0) {
        return res.status(200).json({ success: true, assignments: [] });
      }

      const assignmentIds = assignmentList.map((a) => a.id);

      if (isTeacherOrAdminRole(user)) {
        const { data: allSubs } = await supabase
          .from('classroom_assignment_submissions')
          .select('assignment_id, status, total_score')
          .in('assignment_id', assignmentIds);

        const statsMap = new Map();
        for (const row of allSubs || []) {
          const entry = statsMap.get(row.assignment_id) || { total: 0, submitted: 0 };
          entry.total += 1;
          if (row.status === 'submitted' || row.status === 'graded') {
            entry.submitted += 1;
          }
          statsMap.set(row.assignment_id, entry);
        }

        const enriched = assignmentList.map((a) => {
          const stats = statsMap.get(a.id) || { total: 0, submitted: 0 };
          return {
            ...a,
            completion_stats: {
              total_assigned: stats.total,
              submitted_count: stats.submitted,
              completion_rate_pct: stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0,
            },
          };
        });

        return res.status(200).json({ success: true, assignments: enriched });
      }

      const { data: mySubs } = await supabase
        .from('classroom_assignment_submissions')
        .select('*')
        .in('assignment_id', assignmentIds)
        .eq('student_id', user.id);

      const mySubMap = new Map((mySubs || []).map((s) => [s.assignment_id, s]));
      const enriched = assignmentList
        .filter((a) => a.published !== false)
        .map((a) => ({
          ...a,
          my_submission: mySubMap.get(a.id) || null,
        }));

      return res.status(200).json({ success: true, assignments: enriched });
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Lỗi máy chủ khi tải bài tập.' });
    }
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const action = body.action || req.query?.actionType;

    if (action === 'create_assignment') {
      if (!isTeacherOrAdminRole(user)) {
        return res.status(403).json({ error: 'Chỉ giáo viên hoặc quản trị viên mới có quyền giao bài tập cho lớp.' });
      }

      const {
        classroomId,
        title,
        instructions = '',
        assignmentType,
        targetResourceId,
        hskLevel = 3,
        dueAt = null,
        allowLateSubmission = true,
        maxAttempts = 1,
      } = body;

      if (!classroomId || !title || !String(title).trim()) {
        return res.status(400).json({ error: 'classroomId và title là bắt buộc.' });
      }
      if (!ALLOWED_ASSIGNMENT_TYPES.has(assignmentType)) {
        return res.status(400).json({ error: 'Loại bài tập (assignmentType) không hợp lệ.' });
      }
      if (!targetResourceId || !String(targetResourceId).trim()) {
        return res.status(400).json({ error: 'targetResourceId (mã đề/bài đọc/bộ từ) là bắt buộc.' });
      }

      try {
        const { data: created, error: insertErr } = await supabase
          .from('classroom_hsk_assignments')
          .insert({
            classroom_id: classroomId,
            teacher_id: user.id,
            title: String(title).trim(),
            instructions: instructions ? String(instructions).trim() : null,
            assignment_type: assignmentType,
            target_resource_id: String(targetResourceId).trim(),
            hsk_level: Math.min(9, Math.max(1, Number(hskLevel) || 3)),
            due_at: dueAt || null,
            allow_late_submission: Boolean(allowLateSubmission),
            max_attempts: Math.max(1, Number(maxAttempts) || 1),
            published: true,
          })
          .select()
          .single();

        if (insertErr || !created) {
          return res.status(500).json({ error: `Không thể tạo bài tập: ${insertErr?.message || 'Lỗi không xác định'}` });
        }

        const { data: members } = await supabase
          .from('class_members')
          .select('student_id')
          .eq('classroom_id', classroomId)
          .eq('status', 'active');

        const studentIds = (members || []).map((m) => m.student_id).filter(Boolean);
        if (studentIds.length > 0) {
          const initialRows = studentIds.map((sid) => ({
            assignment_id: created.id,
            student_id: sid,
            status: 'assigned',
          }));
          await supabase
            .from('classroom_assignment_submissions')
            .upsert(initialRows, { onConflict: 'assignment_id,student_id' });
        }

        return res.status(200).json({
          success: true,
          assignment: created,
          initialized_students_count: studentIds.length,
        });
      } catch (err) {
        return res.status(500).json({ error: err?.message || 'Lỗi máy chủ khi giao bài tập.' });
      }
    }

    if (action === 'submit_assignment') {
      const {
        assignmentId,
        hskAttemptId = null,
        totalScore = 0,
        maxScore = 300,
        accuracyPct = 0,
        wrongQuestionNumbers = [],
        weakVocabWords = [],
        weakGrammarCodes = [],
      } = body;

      if (!assignmentId) {
        return res.status(400).json({ error: 'Thiếu assignmentId để nộp bài.' });
      }

      try {
        const sanitizedWrong = Array.isArray(wrongQuestionNumbers)
          ? wrongQuestionNumbers.map((n) => Number(n)).filter((n) => Number.isInteger(n) && n > 0)
          : [];
        const sanitizedVocab = Array.isArray(weakVocabWords)
          ? weakVocabWords.map((w) => String(w).trim()).filter(Boolean)
          : [];
        const sanitizedGrammar = Array.isArray(weakGrammarCodes)
          ? weakGrammarCodes.map((g) => String(g).trim()).filter(Boolean)
          : [];

        const nowIso = new Date().toISOString();
        const { data: savedSub, error: subErr } = await supabase
          .from('classroom_assignment_submissions')
          .upsert(
            {
              assignment_id: assignmentId,
              student_id: user.id,
              hsk_attempt_id: hskAttemptId || null,
              status: 'submitted',
              total_score: Number(totalScore) || 0,
              max_score: Math.max(1, Number(maxScore) || 300),
              accuracy_pct: Math.min(100, Math.max(0, Number(accuracyPct) || 0)),
              wrong_question_numbers: sanitizedWrong,
              weak_vocab_words: sanitizedVocab,
              weak_grammar_codes: sanitizedGrammar,
              submitted_at: nowIso,
              updated_at: nowIso,
            },
            { onConflict: 'assignment_id,student_id' }
          )
          .select()
          .single();

        if (subErr) {
          return res.status(500).json({ error: `Không thể lưu bài nộp: ${subErr.message}` });
        }

        return res.status(200).json({ success: true, submission: savedSub });
      } catch (err) {
        return res.status(500).json({ error: err?.message || 'Lỗi máy chủ khi nộp bài.' });
      }
    }

    return res.status(400).json({ error: `Hành động POST không hợp lệ: ${action || 'unknown'}` });
  }

  return res.status(405).json({ error: 'Phương thức HTTP không được hỗ trợ.' });
}

