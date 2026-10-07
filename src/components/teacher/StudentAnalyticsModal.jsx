import React from 'react';
import { 
  X, 
  Flame, 
  Award, 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  Layers,
  Activity,
  FileText
} from 'lucide-react';

export default function StudentAnalyticsModal({
  studentData,
  onClose,
  onSendReminder = null,
  onAssignReview = null
}) {
  if (!studentData) return null;

  const {
    name,
    email,
    avatar,
    daysInactive,
    xp,
    streak,
    vocabularyCount,
    srs,
    skills,
    studyTime,
    assignments,
    attendance,
    health
  } = studentData;

  const isAtRisk = health?.status === 'At Risk';
  const isAttention = health?.status === 'Needs Attention';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A2433] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#243447] cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header: Student Profile & Risk Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
          <div className="flex items-center gap-3.5">
            {avatar ? (
              <img src={avatar} alt={name} className="w-14 h-14 rounded-2xl object-cover border border-[#F1E5D8]" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white flex items-center justify-center font-black text-xl shadow-md">
                {name ? name.charAt(0).toUpperCase() : 'H'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-[#243447] dark:text-white">{name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${health?.badgeClass || 'bg-emerald-100 text-emerald-700'}`}>
                  {health?.status || 'Healthy'}
                </span>
              </div>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{email || 'Chưa cập nhật email'}</p>
              <p className="text-[11px] text-[#748092] mt-0.5">
                Hoạt động gần nhất: {daysInactive === 0 ? 'Hôm nay' : `${daysInactive} ngày trước`}
              </p>
            </div>
          </div>
        </div>

        {/* Deterministic Rule Alert Message if At Risk or Needs Attention */}
        {(isAtRisk || isAttention) && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            isAtRisk 
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}>
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">
                {isAtRisk ? 'Cảnh báo nguy cơ cao (At Risk):' : 'Cần lưu ý sư phạm (Needs Attention):'} {health.reason}
              </p>
              <p className="text-[11px] opacity-90">
                Khuyến nghị: Giáo viên nên gửi lời nhắc ôn tập hoặc kiểm tra khó khăn trong việc làm bài.
              </p>
            </div>
          </div>
        )}

        {/* 1. Core Learning Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          
          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center justify-center gap-1 text-xs text-[#748092] font-semibold">
              <Award size={13} className="text-[#E85D3F]" />
              <span>Tổng XP</span>
            </div>
            <p className="text-lg font-black text-[#E85D3F] mt-1">{xp}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center justify-center gap-1 text-xs text-[#748092] font-semibold">
              <Flame size={13} className="text-amber-500" />
              <span>Chuỗi Streak</span>
            </div>
            <p className="text-lg font-black text-amber-500 mt-1">{streak} ngày</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center justify-center gap-1 text-xs text-[#748092] font-semibold">
              <Clock size={13} className="text-blue-500" />
              <span>Thời lượng học</span>
            </div>
            <p className="text-lg font-black text-blue-500 mt-1">{studyTime?.formatted || '0m'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center justify-center gap-1 text-xs text-[#748092] font-semibold">
              <Calendar size={13} className="text-purple-500" />
              <span>Chuyên cần</span>
            </div>
            <p className="text-lg font-black text-purple-500 mt-1">{attendance?.rate || 0}%</p>
          </div>

        </div>

        {/* 2. SRS & Vocabulary Memory State */}
        <div className="p-4 rounded-2xl bg-[#FFF9F2]/70 dark:bg-[#243447]/50 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
              <Layers size={14} className="text-[#E85D3F]" />
              <span>Bộ Nhớ Lặp Lại Ngắt Quãng (SRS Vocabulary)</span>
            </span>
            <span className="text-xs font-bold text-emerald-600">Ghi nhớ: {srs?.retentionRate || 75}%</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[10px] text-[#748092] block">Đã thành thạo</span>
              <span className="text-sm font-black text-emerald-600">{srs?.mastered || 0} từ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[10px] text-[#748092] block">Đang ôn tập</span>
              <span className="text-sm font-black text-amber-600">{srs?.reviewing || 0} từ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[10px] text-[#748092] block">Từ mới nạp</span>
              <span className="text-sm font-black text-blue-600">{srs?.learning || 0} từ</span>
            </div>
          </div>
        </div>

        {/* 3. 4-Skill Proficiency Bars */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider">
            Năng Lực 4 Kỹ Năng Ngôn Ngữ
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[#748092]">🎧 Nghe (Listening)</span>
                <span className="font-bold text-blue-600">{skills?.listening || 0}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div style={{ width: `${skills?.listening || 0}%` }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[#748092]">🗣️ Nói (Speaking)</span>
                <span className="font-bold text-emerald-600">{skills?.speaking || 0}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div style={{ width: `${skills?.speaking || 0}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[#748092]">📖 Đọc (Reading)</span>
                <span className="font-bold text-amber-600">{skills?.reading || 0}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div style={{ width: `${skills?.reading || 0}%` }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[#748092]">✍️ Viết (Writing)</span>
                <span className="font-bold text-purple-600">{skills?.writing || 0}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div style={{ width: `${skills?.writing || 0}%` }} className="h-full bg-purple-500 rounded-full" />
              </div>
            </div>

          </div>
        </div>

        {/* 4. Assignment Score History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
            <span>Lịch sử bài nộp ({assignments?.submittedCount || 0} bài)</span>
            <span>Điểm trung bình: <strong className="text-[#E85D3F]">{assignments?.averageScore || 0} đ</strong></span>
          </div>

          {assignments?.history && assignments.history.length > 0 ? (
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {assignments.history.map((h, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#748092]" />
                    <span className="font-medium text-[#243447] dark:text-white line-clamp-1">{h.title}</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded-lg ${
                    h.score >= 80 ? 'bg-emerald-100 text-emerald-700' : h.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {h.score !== null ? `${h.score}/100` : 'Đang chấm'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#748092] italic">Chưa có bài tập nào được nộp gần đây.</p>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
          {onSendReminder && (
            <button
              onClick={() => onSendReminder(studentData)}
              className="px-4 py-2 rounded-xl bg-[#FFF9F2] hover:bg-[#F1E5D8] dark:bg-[#243447] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Send size={13} />
              <span>Gửi nhắc nhở ôn tập</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold cursor-pointer transition-all shadow-md"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
