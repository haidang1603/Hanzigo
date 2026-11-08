import React from 'react';
import { AlertTriangle, Clock, ArrowRight, UserCheck, MessageSquare } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * Students Requiring Pedagogical Attention Table (Teacher)
 * Displays list of students diagnosed as 'At Risk' or 'Needs Attention'
 */
export default function StudentsRequiringAttentionTable({
  students = [],
  classrooms = [],
  selectedClassId = 'all',
  onSelectClass = null,
  onNavigateToStudent = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const isEmpty = students.length === 0;

  return (
    <DashboardChartContainer
      title="Học viên Cần Hỗ trợ & Quan tâm Đặc biệt"
      subtitle="Chẩn đoán tự động dựa trên tần suất vào lớp, bài tập quá hạn và điểm số"
      icon={AlertTriangle}
      badge={students.length > 0 ? `${students.length} Cần lưu ý` : 'An toàn'}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="🎉 Tuyệt vời! Tất cả học viên trong lớp đều đang duy trì tiến độ học tập tốt."
      controls={
        classrooms.length > 0 && (
          <select
            value={selectedClassId}
            onChange={(e) => onSelectClass && onSelectClass(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-xs font-bold text-[#243447] dark:text-white cursor-pointer focus:ring-2 focus:ring-[#E85D3F]"
          >
            <option value="all">Tất cả lớp học</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px] font-bold text-[#748092] dark:text-[#94A3B8]">
              <th className="py-2.5 px-3">Học viên</th>
              <th className="py-2.5 px-3">Lớp học</th>
              <th className="py-2.5 px-3">Trạng thái</th>
              <th className="py-2.5 px-3">Lý do chẩn đoán</th>
              <th className="py-2.5 px-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1E5D8]/60 dark:divide-[#2B3A4F]/60">
            {students.map((stu) => {
              const isAtRisk = stu.status === 'At Risk';

              return (
                <tr
                  key={stu.studentId}
                  className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                >
                  {/* Student Info */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center font-bold text-xs shrink-0">
                        {stu.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#243447] dark:text-white truncate">
                          {stu.name}
                        </p>
                        <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">
                          {stu.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Classroom */}
                  <td className="py-3 px-3 font-semibold text-[#243447] dark:text-gray-300">
                    <span className="truncate block max-w-[140px]">
                      {stu.classroomName}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${stu.badgeClass}`}
                    >
                      <AlertTriangle size={11} />
                      <span>{isAtRisk ? 'Cần can thiệp' : 'Cần chú ý'}</span>
                    </span>
                  </td>

                  {/* Diagnostic Reason */}
                  <td className="py-3 px-3 text-[#748092] dark:text-[#94A3B8]">
                    <span className="font-medium text-[#243447] dark:text-gray-200">
                      {stu.reason}
                    </span>
                    {stu.overdueCount > 0 && (
                      <span className="text-rose-500 font-bold block text-[10px]">
                        • {stu.overdueCount} bài tập chưa nộp
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigateToStudent && onNavigateToStudent(stu.classroomId, stu.studentId)}
                      className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-[#E85D3F] text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>Chi tiết</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardChartContainer>
  );
}

