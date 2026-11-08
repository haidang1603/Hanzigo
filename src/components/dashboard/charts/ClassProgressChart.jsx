import React, { useState, useMemo } from 'react';
import { BarChart3, ArrowDownUp, CheckCircle2 } from 'lucide-react';
import DashboardChartContainer from './DashboardChartContainer';

/**
 * Class Learning Progress Bar Chart (Teacher)
 * Compares student completion rates within teacher's classrooms
 */
export default function ClassProgressChart({
  data = null,
  classrooms = [],
  selectedClassId = 'all',
  onSelectClass = null,
  loading = false,
  error = null,
  onRetry = null
}) {
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [hoveredStudent, setHoveredStudent] = useState(null);

  const rawStudents = data?.studentsProgress || [];
  const classAverage = data?.classAverage || 0;
  const isEmpty = !data || rawStudents.length === 0;

  // Sắp xếp học viên theo tỷ lệ hoàn thành
  const sortedStudents = useMemo(() => {
    return [...rawStudents].sort((a, b) => {
      if (sortOrder === 'desc') return b.completionRate - a.completionRate;
      return a.completionRate - b.completionRate;
    });
  }, [rawStudents, sortOrder]);

  return (
    <DashboardChartContainer
      title="Tiến độ Hoàn thành Bài tập của Lớp"
      subtitle={`Điểm trung bình tiến độ toàn lớp: ${classAverage}%`}
      icon={BarChart3}
      badge={`${rawStudents.length} Học viên`}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyMessage="Chưa có học viên hoặc dữ liệu bài nộp trong lớp này."
      controls={
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Selector Dropdown */}
          {classrooms.length > 0 && (
            <select
              value={selectedClassId}
              onChange={(e) => onSelectClass && onSelectClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-xs font-bold text-[#243447] dark:text-white cursor-pointer focus:ring-2 focus:ring-[#E85D3F]"
            >
              <option value="all">Tất cả lớp học</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.student_count || 0} HV)
                </option>
              ))}
            </select>
          )}

          {/* Sort Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold text-[#748092] dark:text-gray-300 transition-all cursor-pointer"
            title="Đổi thứ tự sắp xếp"
          >
            <ArrowDownUp size={12} />
            <span>{sortOrder === 'desc' ? 'Cao ➔ Thấp' : 'Thấp ➔ Cao'}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-3 py-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {sortedStudents.map((stu) => {
          const isHovered = hoveredStudent?.studentId === stu.studentId;
          const barColor = stu.completionRate >= 80 
            ? '#10B981' 
            : stu.completionRate >= 50 
              ? '#3B82F6' 
              : '#F59E0B';

          return (
            <div
              key={stu.studentId}
              onMouseEnter={() => setHoveredStudent(stu)}
              onMouseLeave={() => setHoveredStudent(null)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500'
                  : 'bg-gray-50/60 dark:bg-gray-800/30 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {stu.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[#243447] dark:text-white truncate block">
                      {stu.name}
                    </span>
                    <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] block -mt-0.5">
                      {stu.classroomName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
                    {stu.completedCount}/{stu.totalAssignmentsCount || '?'} bài
                  </span>
                  <span
                    className="font-black text-xs min-w-[42px] text-right"
                    style={{ color: barColor }}
                  >
                    {stu.completionRate}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(4, stu.completionRate)}%`,
                    backgroundColor: barColor
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardChartContainer>
  );
}

