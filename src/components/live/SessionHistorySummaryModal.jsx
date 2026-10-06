import React from 'react';
import { 
  Sparkles, 
  X, 
  Clock, 
  Users, 
  Layers, 
  Award, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Download
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';

export default function SessionHistorySummaryModal({
  summaryData,
  onClose
}) {
  if (!summaryData) return null;

  const durationMin = Math.round((summaryData.durationSeconds || 1800) / 60);

  const handleExportText = () => {
    playClickSound();
    const content = `
=== HANZI GO LIVE CLASSROOM - BÁO CÁO TỔNG KẾT BUỔI HỌC ===
Phiên học: ${summaryData.title}
Thời lượng: ${durationMin} phút
Sĩ số học viên tham gia: ${summaryData.attendanceCount} người
Công cụ đã sử dụng: ${(summaryData.toolsUsed || []).join(', ')}

1. TỪ VỰNG ĐÃ HỌC:
${(summaryData.vocabularyCovered || []).map(v => `- ${v.hanzi} (${v.pinyin}): ${v.meaning}`).join('\n')}

2. CẤU TRÚC NGỮ PHÁP:
- ${summaryData.grammarStructure || 'S + V + O'}

3. KẾT QUẢ TRẮC NGHIỆM:
- Câu hỏi: ${summaryData.quizResults?.question || 'N/A'}
- Độ chính xác cả lớp: ${summaryData.quizResults?.accuracyPercentage || 0}%

4. THỬ THÁCH PHÁT ÂM:
- Lời nhắc: ${summaryData.pronunciationPerformance?.challengePrompt || 'N/A'}
- Số học viên tham gia: ${summaryData.pronunciationPerformance?.participantsCount || 0}
- Điểm cao nhất: ${summaryData.pronunciationPerformance?.topScore || 0}/100 (${summaryData.pronunciationPerformance?.topScorer || 'N/A'})

5. ĐIỂM CẦN CẢI THIỆN (WEAK AREAS):
${(summaryData.weakAreas || []).map(w => `- ${w}`).join('\n')}

6. KHUYẾN NGHỊ ÔN TẬP:
${(summaryData.recommendedPractice || []).map(r => `- ${r}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hanzigo-summary-${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-[#111827] border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6 text-white my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E85D3F] to-[#F4B942] flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Báo Cáo Tổng Kết & AI Lesson Summary</h2>
              <p className="text-xs text-white/50">{summaryData.title} • {summaryData.classroomName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Core Session Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1">
              <Clock size={11} /> THỜI LƯỢNG
            </span>
            <p className="text-lg font-black text-white mt-0.5">{durationMin} phút</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1">
              <Users size={11} /> THAM DỰ
            </span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{summaryData.attendanceCount} học viên</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1">
              <Award size={11} /> QUIZ ACCURACY
            </span>
            <p className="text-lg font-black text-[#F4B942] mt-0.5">{summaryData.quizResults?.accuracyPercentage || 0}%</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1">
              <Layers size={11} /> CÔNG CỤ DÙNG
            </span>
            <p className="text-lg font-black text-sky-400 mt-0.5">{summaryData.toolsUsed?.length || 1} tools</p>
          </div>
        </div>

        {/* 2. AI Lesson Summary Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#E85D3F]/15 via-black/30 to-[#F4B942]/15 border border-[#E85D3F]/30 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#F4B942]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Lesson Summary</h3>
          </div>

          {/* Today's Lesson Highlights */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-white/70 block">📌 Nội dung trọng tâm đã học:</span>
            <ul className="list-disc pl-5 space-y-1 text-white/90">
              <li>Mẫu câu ngữ pháp chính: <strong className="text-amber-300 font-mono">{summaryData.grammarStructure}</strong></li>
              <li>{summaryData.vocabularyCovered?.length || 0} từ vựng mới: {summaryData.vocabularyCovered?.map(v => v.hanzi).join(', ') || 'Chưa thêm từ'}</li>
              <li>Thử thách phát âm: {summaryData.pronunciationPerformance?.participantsCount || 0} học viên đã hoàn thành, điểm cao nhất đạt {summaryData.pronunciationPerformance?.topScore}/100</li>
            </ul>
          </div>

          {/* Weak Areas Detected */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle size={13} /> Điểm yếu của lớp cần chú ý (Weak areas):
            </span>
            <ul className="list-disc pl-5 space-y-1 text-white/80">
              {summaryData.weakAreas?.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          {/* Recommended Practice */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> Kế hoạch ôn tập đề xuất (Recommended practice):
            </span>
            <ul className="list-disc pl-5 space-y-1 text-white/80">
              {summaryData.recommendedPractice?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={handleExportText}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <span>Tải báo cáo tóm tắt (.txt)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
