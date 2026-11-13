import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Tv, RefreshCw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { supabase } from '../../../supabase/config';

export default function ClassMistakeHeatmapPanel({
  classroomId,
  onOpenCreateModal,
  onLaunchLiveReview,
}) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [livePackNotice, setLivePackNotice] = useState('');

  useEffect(() => {
    if (!classroomId) return;
    let active = true;

    async function loadAssignments() {
      try {
        const { data: sessionData } = (await supabase?.auth?.getSession?.()) || {};
        const token = sessionData?.session?.access_token;
        const res = await fetch(
          `/api/classroom/assignments?classroomId=${encodeURIComponent(classroomId)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const payload = await res.json();
        if (!active) return;
        const list = payload?.assignments || [];
        setAssignments(list);
        if (list.length > 0 && !selectedAssignmentId) {
          setSelectedAssignmentId(list[0].id);
        }
      } catch {
        // silent fallback if offline/demo
      }
    }

    loadAssignments();
    return () => {
      active = false;
    };
  }, [classroomId, selectedAssignmentId]);

  useEffect(() => {
    if (!selectedAssignmentId) return;
    let active = true;

    async function loadAnalytics() {
      setLoading(true);
      try {
        const { data: sessionData } = (await supabase?.auth?.getSession?.()) || {};
        const token = sessionData?.session?.access_token;
        const res = await fetch(
          `/api/classroom/assignments?assignmentId=${encodeURIComponent(selectedAssignmentId)}&analytics=true`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const payload = await res.json();
        if (!active) return;
        setAnalytics(payload?.analytics || null);
        setSubmissions(payload?.submissions || []);
      } catch {
        // ignore network error
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      active = false;
    };
  }, [selectedAssignmentId]);

  const highMissQuestions = useMemo(() => {
    const list = analytics?.top_missed_questions || [];
    const overHalf = list.filter((q) => Number(q.miss_rate_pct || 0) >= 50);
    return overHalf.length > 0 ? overHalf : list;
  }, [analytics]);

  const handleSendToLiveClassroom = () => {
    const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId);
    const reviewPack = {
      classroomId,
      assignmentId: selectedAssignmentId,
      assignmentTitle: selectedAssignment?.title || 'Chữa bài HSK',
      targetResourceId: selectedAssignment?.target_resource_id || '',
      missedQuestions: highMissQuestions,
      weakVocabWords: analytics?.top_weak_vocab || [],
      savedAt: Date.now(),
    };

    try {
      const json = JSON.stringify(reviewPack);
      sessionStorage.setItem(`hanzigo_live_review_pack_${classroomId}`, json);
      localStorage.setItem('hanzigo_live_review_pack_latest', json);
    } catch {
      // ignore storage quota errors
    }

    setLivePackNotice('Đã nạp danh sách câu sai & từ vựng yếu vào hàng đợi phòng LiveKit!');
    setTimeout(() => setLivePackNotice(''), 3500);
    if (onLaunchLiveReview) onLaunchLiveReview(reviewPack);
  };

  return (
    <div className="bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#E85D3F]" />
            Phân Tích Lỗi Sai Cả Lớp & Chữa Bài LiveKit
          </h3>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Gom tự động câu hỏi trên 50% học viên làm sai và từ vựng yếu để chiếu lên Bảng trắng Live
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {assignments.length > 0 && (
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#0F172A] px-3 py-2 text-xs font-bold text-[#243447] dark:text-white"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.target_resource_id})
                </option>
              ))}
            </select>
          )}

          {onOpenCreateModal && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="px-3.5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d84f31] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              Giao đề HSK mới
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center gap-2 text-xs font-bold text-[#748092]">
          <RefreshCw size={15} className="animate-spin" />
          Đang tổng hợp dữ liệu bài làm của lớp...
        </div>
      ) : assignments.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#748092] dark:text-[#94A3B8]">
          Chưa có bài tập HSK nào được giao cho lớp này. Bấm <strong>Giao đề HSK mới</strong> để bắt đầu.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Cột trái: Câu hỏi >50% học viên làm sai + nút đẩy sang LiveKit */}
          <div className="space-y-3 bg-[#FFF8F4] dark:bg-[#0F172A]/60 border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#E85D3F]">
                Các câu hỏi trên 50% học viên làm sai
              </h4>
              <button
                type="button"
                onClick={handleSendToLiveClassroom}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Tv size={13} />
                Đưa vào phòng LiveKit chữa bài
              </button>
            </div>

            {livePackNotice && (
              <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                {livePackNotice}
              </div>
            )}

            {highMissQuestions.length === 0 ? (
              <p className="text-xs text-[#748092]">Chưa ghi nhận câu hỏi nào có tỷ lệ sai cao.</p>
            ) : (
              <div className="space-y-2">
                {highMissQuestions.map((q) => (
                  <div
                    key={q.question_number}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]"
                  >
                    <span className="text-xs font-bold text-[#243447] dark:text-white">
                      Câu số #{q.question_number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[11px] font-black">
                      Sai {q.miss_rate_pct}% ({q.miss_count} học viên)
                    </span>
                  </div>
                ))}
              </div>
            )}

            {(analytics?.top_weak_vocab || []).length > 0 && (
              <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <span className="text-[11px] font-bold text-[#748092] block mb-1.5">
                  Top từ vựng yếu cần luyện viết trên Bảng trắng:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analytics.top_weak_vocab.map((v) => (
                    <span
                      key={v.word}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-bold"
                    >
                      {v.word} ({v.occurrence_count})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Bảng điểm từng học viên */}
          <div className="space-y-3 bg-[#FFFDF9] dark:bg-[#0F172A]/60 border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#243447] dark:text-white">
                Bảng điểm học viên ({analytics?.submitted_count || 0}/{analytics?.total_students || 0} đã nộp)
              </h4>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                TB: {analytics?.avg_score ?? 0}đ • Đạt {analytics?.pass_rate_pct ?? 0}%
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {submissions.length === 0 ? (
                <p className="text-xs text-[#748092]">Chưa có dữ liệu nộp bài.</p>
              ) : (
                submissions.map((sub) => {
                  const passed = Number(sub.accuracy_pct || 0) >= 60;
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#243447] dark:text-white">
                          Học viên {String(sub.student_id).slice(0, 8)}
                        </p>
                        <p className="text-[11px] text-[#748092]">
                          {sub.status === 'submitted' || sub.status === 'graded'
                            ? `${sub.total_score}/${sub.max_score}đ (${sub.accuracy_pct}%)`
                            : 'Chưa nộp bài'}
                        </p>
                      </div>
                      {sub.status === 'submitted' || sub.status === 'graded' ? (
                        passed ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Đạt
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
                            <XCircle size={12} /> Chưa đạt
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                          Đang chờ
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

