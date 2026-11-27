import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  Dices,
  ShieldCheck,
  Volume2,
  ChevronRight,
  Clock,
  FileText,
  BarChart2,
} from 'lucide-react';
import { getHskExams, getPastAttempts } from '../../services/hskService';
import DualSystemExamBuilderPanel from './DualSystemExamBuilderPanel.jsx';

export function HskHomeView({
  user = null,
  onNavigate,
  onOpenRandomModal,
  selectedLevel = 7,
  onSelectLevel,
  onLaunchHsk7to9Paper,
  Hsk7to9ExamCenterSection,
}) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pastAttempts, setPastAttempts] = useState([]);

  useEffect(() => {
    getHskExams().then((data) => {
      setExams(data);
      setLoading(false);
    });
    setPastAttempts(getPastAttempts());
  }, []);

  const HSK_LEVEL_CARDS = [
    {
      level: 'HSK 1',
      title: 'HSK 1 — Nền Tảng Cốt Lõi',
      desc: '150 từ vựng cơ bản, mẫu câu chào hỏi, chữ số & sinh hoạt thường ngày. 40 câu chuẩn CTI.',
      badge: '🟢 Nhập môn (Dễ)',
      color: 'border-emerald-500 hover:border-emerald-600',
      tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      duration: '40 phút • 120/200 điểm đạt',
    },
    {
      level: 'HSK 2',
      title: 'HSK 2 — Sinh Hoạt Thực Chiến',
      desc: '300 từ vựng, giao tiếp mua sắm, hỏi đường, đặt xe, câu so sánh chữ 比. 60 câu chuẩn thi (HSK 2.0 & 3.0).',
      badge: '🟡 Sơ cấp (Vừa)',
      color: 'border-amber-500 hover:border-amber-600',
      tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      duration: '55 phút • 120/200 điểm đạt',
    },
    {
      level: 'HSK 3',
      title: 'HSK 3 — Độc Lập Giao Tiếp',
      desc: '600 từ vựng, câu chữ 把, chữ 被, các cặp liên từ phức & viết sắp xếp câu. 70–80 câu chuẩn thi (HSK 3.0 / 2.0).',
      badge: '🔴 Trung cấp (Khá)',
      color: 'border-rose-500 hover:border-rose-600',
      tagColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      duration: '85 phút • 180/300 điểm đạt',
    },
    {
      level: 'HSK 4',
      title: 'HSK 4 — Lưu Loát & Công Sở',
      desc: '1200 từ vựng thương mại, đàm phán, nghe 1 lần, sắp xếp đoạn ABC & viết câu. 70–100 câu chuẩn thi (HSK 3.0 / 2.0).',
      badge: '🔵 Cao cấp',
      color: 'border-blue-500 hover:border-blue-600',
      tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      duration: '105 phút • 180/300 điểm đạt',
    },
    {
      level: 'HSK 5',
      title: 'HSK 5 — Chuyên Nghiệp & Học Thuật',
      desc: '2500 từ vựng nâng cao, báo chí thời sự, đàm phán hợp đồng, chuỗi thành ngữ & viết luận 80 chữ.',
      badge: '🟣 Nâng cao (Khó)',
      color: 'border-purple-500 hover:border-purple-600',
      tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
      duration: '125 phút • 180/300 điểm đạt',
    },
    {
      level: 'HSK 6',
      title: 'HSK 6 — Đỉnh Phong & Tự Nhiên',
      desc: '5000+ từ vựng, bình luận chính luận, nhận diện lỗi ngữ pháp (病句) & kỹ năng tóm tắt 400 chữ.',
      badge: '👑 Đỉnh phong (Rất khó)',
      color: 'border-indigo-500 hover:border-indigo-600',
      tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
      duration: '140 phút • 180/300 điểm đạt',
    },
    {
      level: 'HSK 7–9',
      title: 'HSK 7–9 — Bậc Thầy HSK 3.0',
      desc: '11.092 từ vựng học thuật, 5 kỹ năng Nghe giảng - Đọc biểu đồ - Dịch 2 chiều - Luận 600 chữ - Biện luận.',
      badge: '🎓 Bậc Thầy (Chuẩn HSK 3.0)',
      color: 'border-amber-500 hover:border-amber-600',
      tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      duration: '210 phút • 180/210/240 điểm xét cấp',
      routeView: 'hsk7_9_simulator',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E85D3F] via-[#CB4529] to-[#992E17] text-white p-3.5 sm:p-7 shadow-lg shadow-orange-500/10 mb-5 sm:mb-7">
        <div className="relative z-10 max-w-4xl">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Nền tảng Luyện Thi HSK Miễn Phí 100%
          </div>
          <h1 className="text-lg sm:text-3xl font-black tracking-tight leading-snug mb-1.5 sm:mb-2">
            Thi Thử HSK Trực Tuyến{' '}
            <span className="text-amber-200">Không Cần Đăng Nhập</span>
          </h1>
          <p className="text-white/90 text-xs sm:text-sm mb-3 sm:mb-5 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
            Hệ thống đề thi mô phỏng chuẩn quốc tế từ HSK 1 đến HSK 9: Đầy đủ {exams.length} đề thi chuẩn hóa thực chiến (HSK 2.0, HSK 3.0 &amp; HSKK 3 cấp), tự động tính điểm và giải thích chi tiết.
          </p>
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            <button
              onClick={() => onNavigate('exams')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#E85D3F] font-bold text-xs whitespace-nowrap shadow-sm hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Award className="w-3.5 h-3.5" />
              Toàn bộ đề thi ({exams.length})
            </button>
            <button
              onClick={onOpenRandomModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-xs whitespace-nowrap shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Dices className="w-3.5 h-3.5 text-slate-950" />
              Thi ngẫu nhiên 🎲
            </button>
            <button
              onClick={() => onNavigate('structure')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-all cursor-pointer border border-white/20 shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Cấu trúc Đề HSK
            </button>
            <button
              onClick={() => onNavigate('hsk7_9_simulator')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#243447] hover:bg-slate-900 text-amber-300 font-extrabold text-xs whitespace-nowrap shadow-xs transition-all cursor-pointer border border-amber-300/40 shrink-0"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Mô phỏng HSK 7–9
            </button>
            <button
              onClick={() => onNavigate('hskk_simulator')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-all cursor-pointer border border-white/20 shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5 text-white" />
              Phòng thi nói HSKK
            </button>
          </div>
        </div>
      </div>

      {/* Dual-System CBT Exam Builder (HSK 2.0 & HSK 3.0) */}
      <DualSystemExamBuilderPanel
        user={user}
        onNavigate={onNavigate}
        onLaunchHsk7to9Paper={onLaunchHsk7to9Paper}
      />

      {/* 5 CHẾ ĐỘ THI & LUYỆN TẬP TOÀN DIỆN (PHASE 18) */}
      <div className="mb-12">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E85D3F] bg-orange-100 dark:bg-orange-950/60 px-3 py-1 rounded-full">
            Đa Dạng Phương Pháp
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            5 Chế Độ Luyện Thi HSK Toàn Diện
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Từ thi thử áp lực phòng thi thật, luyện sâu từng phân môn, ôn theo chủ đề đến sinh đề ngẫu nhiên thông minh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Chế độ 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold text-lg mb-3">
                ⏱️
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 group-hover:text-[#E85D3F]">
                1. Thi thử toàn phần
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Mô phỏng 100% thời gian thi thật CTI, đếm ngược tự động nộp bài, tước bỏ đáp án chống gian lận.
              </p>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="w-full min-h-11 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#E85D3F] hover:text-white transition-colors cursor-pointer"
            >
              Chọn đề thi ngay
            </button>
          </div>

          {/* Chế độ 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-lg mb-3">
                🎧
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 group-hover:text-[#E85D3F]">
                2. Luyện tập từng phần
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Chuyên sâu Nghe hiểu, Đọc hiểu hoặc Viết. Xem ngay lời giải chi tiết và audio script từng câu.
              </p>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="w-full min-h-11 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#E85D3F] hover:text-white transition-colors cursor-pointer"
            >
              Luyện theo kỹ năng
            </button>
          </div>

          {/* Chế độ 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-lg mb-3">
                🎯
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 group-hover:text-[#E85D3F]">
                3. Luyện theo chủ đề
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Đời sống, Mua sắm, Du lịch, Công sở, Khoa học... Tích lũy vốn từ theo tình huống ứng dụng thực tế.
              </p>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="w-full min-h-11 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#E85D3F] hover:text-white transition-colors cursor-pointer"
            >
              Lọc theo chủ đề
            </button>
          </div>

          {/* Chế độ 4 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-lg mb-3">
                📓
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 group-hover:text-[#E85D3F]">
                4. Sổ tay câu sai
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Tự động thu thập các câu trả lời sai từ các bài thi. Cho phép luyện lại đến khi đạt 100% độ hiểu.
              </p>
            </div>
            <button
              onClick={() => onNavigate('mistakes')}
              className="w-full min-h-11 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#E85D3F] hover:text-white transition-colors cursor-pointer"
            >
              Mở sổ câu sai
            </button>
          </div>

          {/* Chế độ 5 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-orange-400 dark:border-orange-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-16 h-16 bg-orange-500/10 rounded-full pointer-events-none" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center font-bold text-lg mb-3">
                🎲
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 group-hover:text-[#E85D3F] flex items-center gap-1.5">
                5. Thi ngẫu nhiên
                <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded">Mới</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Tự động sinh đề thi mới không trùng lặp từ kho 1.726 câu hỏi chuẩn HSK 2.0 &amp; HSK 3.0. Tùy biến số lượng câu và kỹ năng.
              </p>
            </div>
            <button
              onClick={onOpenRandomModal}
              className="w-full min-h-11 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:bg-[#CB4529] shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Dices className="w-3.5 h-3.5" />
              Tạo đề ngay
            </button>
          </div>
        </div>
      </div>

      {/* Cấp độ luyện thi HSK */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Chọn cấp độ luyện thi HSK
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Phù hợp cho cả học viên tự học nhập môn lẫn ôn thi chứng chỉ quốc tế
            </p>
          </div>
          <button
            onClick={() => onNavigate('exams')}
            className="text-sm font-bold text-[#E85D3F] hover:underline flex items-center gap-1"
          >
            Xem tất cả đề <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HSK_LEVEL_CARDS.map((card) => {
            const count = exams.filter((e) => e.level === card.level).length;
            return (
              <div
                key={card.level}
                onClick={() => onNavigate(card.routeView || 'exams')}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 ${card.color} shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${card.tagColor}`}>
                      {card.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {card.routeView === 'hsk7_9_simulator' ? 'Đề tích hợp H79001' : `${count} đề thi`}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#E85D3F] transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{card.duration}</span>
                  <span className="text-[#E85D3F] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Thi ngay &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Khu vực Phòng Thi Tích Hợp HSK 7–9 (H79001, H79002, H79003) */}
      <div className="mb-12">
        <Hsk7to9ExamCenterSection
          selectedLevel={selectedLevel}
          onSelectLevel={onSelectLevel}
          onLaunchHsk7to9Paper={onLaunchHsk7to9Paper}
        />
      </div>

      {/* Đề thi tiêu biểu nổi bật */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
          Đề thi thử mới nhất &amp; Phổ biến
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Đang tải danh sách đề thi...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.slice(0, 6).map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] font-bold text-xs">
                      {exam.level}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {exam.exam_type === 'mock' ? '📝 Đề HanziGo' : '🏛️ Đề Minh Họa'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.duration_minutes} phút
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {exam.total_questions} câu
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      Đạt {exam.passing_score}/{exam.max_score}đ
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('exam', exam.id)}
                      className="flex-1 min-h-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => onNavigate('take', exam.id)}
                      className="flex-1 min-h-11 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] transition-colors cursor-pointer"
                    >
                      Làm bài ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lịch sử làm bài gần đây (nếu có) */}
      {pastAttempts.length > 0 && (
        <div className="mb-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#E85D3F]" />
              Lịch sử làm bài gần đây
            </h2>
            <span className="text-xs text-slate-400">
              Lưu trữ trên thiết bị ({pastAttempts.length} lượt thi)
            </span>
          </div>

          <div className="space-y-3">
            {pastAttempts.slice(0, 3).map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        att.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {att.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {att.examTitle}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Điểm số: <strong className="text-slate-700 dark:text-slate-300">{att.score}/{att.maxScore}</strong> (Chính xác {att.accuracyPercentage}%) • {new Date(att.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('result', att.id)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Xem kết quả &amp; lời giải
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thông tin minh bạch bản quyền */}
      <div id="copyright-info" className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <h4 className="font-bold text-base text-amber-900 dark:text-amber-200 mb-2">
              Cam kết minh bạch về Nguồn gốc Đề thi &amp; Quyền tác giả
            </h4>
            <p className="mb-2">
              - <strong>Đề thi thử HanziGo (Mock):</strong> Do Ban Học Thuật HanziGo độc lập biên soạn theo chuẩn từ vựng và ngữ pháp của Khung HSK quốc tế, cấp phép mở theo chuẩn CC BY-NC-SA 4.0. Chúng tôi không bao giờ dán nhãn đề tự tạo là đề thi chính thức.
            </p>
            <p className="mb-2">
              - <strong>Đề tham chiếu (Official Sample):</strong> Các câu hỏi tham chiếu học thuật được trích dẫn hợp pháp từ các đề thi minh họa công khai của CLEC/CTI (Chinese Testing International). Các đề thi có bản quyền tác giả được dẫn link trực tiếp tới nguồn chính thống của chinesetest.cn.
            </p>
            <p>
              - <strong>Bảo mật đáp án:</strong> Hệ thống mã hóa và tước bỏ đáp án trước khi tải về trình duyệt làm bài. Học viên chỉ nhận được đáp án và giải thích chi tiết sau khi đã bấm nộp bài.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
