import React, { useEffect, useState } from 'react';
import { Clock, Play, CheckCircle2, FileText, BookOpen, PenTool } from 'lucide-react';
import { supabase } from '../../../supabase/config';

function formatCountdown(dueAt) {
  if (!dueAt) return 'Không giới hạn';
  const diffMs = new Date(dueAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Đã quá hạn';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `Còn ${days} ngày ${hours % 24} giờ`;
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `Còn ${hours}g ${mins}p`;
}

export default function StudentHskAssignmentsPanel({ classroomId, onNavigate }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classroomId) return;
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const { data: sessionData } = (await supabase?.auth?.getSession?.()) || {};
        const token = sessionData?.session?.access_token;
        const res = await fetch(
          `/api/classroom/assignments?classroomId=${encodeURIComponent(classroomId)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const payload = await res.json();
        if (active && payload?.assignments) {
          setAssignments(payload.assignments);
        }
      } catch {
        // silent fallback
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [classroomId]);

  if (!loading && assignments.length === 0) return null;

  const handleStartAssignment = (asg) => {
    const resource = encodeURIComponent(asg.target_resource_id || '');
    const asgId = encodeURIComponent(asg.id);
    let targetPath = `/hsk-practice?paper=${resource}&assignmentId=${asgId}`;
    if (asg.assignment_type === 'reading_article') {
      targetPath = `/reader?article=${resource}&assignmentId=${asgId}`;
    } else if (asg.assignment_type === 'hanzi_writing_drill') {
      targetPath = `/writing?char=${resource}&assignmentId=${asgId}`;
    }

    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      window.location.assign(targetPath);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl p-5 space-y-3 shadow-sm mb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-[#243447] dark:text-white flex items-center gap-2">
          <FileText size={17} className="text-[#E85D3F]" />
          Bài tập HSK Giáo viên giao
        </h3>
        <span className="text-xs font-bold text-[#748092]">
          {assignments.length} bài tập
        </span>
      </div>

      {loading ? (
        <p className="text-xs text-[#748092]">Đang tải danh sách bài tập HSK...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {assignments.map((asg) => {
            const sub = asg.my_submission;
            const isSubmitted = sub?.status === 'submitted' || sub?.status === 'graded';
            const isInProgress = sub?.status === 'in_progress';

            let statusLabel = 'Chưa làm';
            let statusCls = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            if (isSubmitted) {
              statusLabel = `Đã nộp - ${sub.total_score}/${sub.max_score || 300}đ`;
              statusCls = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
            } else if (isInProgress) {
              statusLabel = 'Đang làm dở';
              statusCls = 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
            }

            const Icon =
              asg.assignment_type === 'reading_article'
                ? BookOpen
                : asg.assignment_type === 'hanzi_writing_drill'
                  ? PenTool
                  : FileText;

            return (
              <div
                key={asg.id}
                className="p-4 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#0F172A]/60 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#E85D3F]">
                      <Icon size={13} />
                      HSK {asg.hsk_level} • {asg.target_resource_id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusCls}`}>
                      {isSubmitted && <CheckCircle2 size={11} className="inline mr-1" />}
                      {statusLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#243447] dark:text-white">
                    {asg.title}
                  </h4>
                  {asg.instructions && (
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2">
                      {asg.instructions}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <span className="text-[11px] font-semibold text-[#748092] flex items-center gap-1">
                    <Clock size={12} />
                    {formatCountdown(asg.due_at)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleStartAssignment(asg)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#d84f31] text-white text-xs font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Play size={12} />
                    {isSubmitted ? 'Xem / Làm lại' : 'Làm bài ngay'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

