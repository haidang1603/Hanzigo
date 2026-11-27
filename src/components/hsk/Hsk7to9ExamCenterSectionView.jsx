import React from 'react';
import { GraduationCap, Play } from 'lucide-react';
import { HSK_7_TO_9_PAPER_CATALOG } from '@/features/hsk-exam/data/hsk7to9SampleExamPaper';

export default function Hsk7to9ExamCenterSectionView({
  selectedLevel = 7,
  onSelectLevel,
  onLaunchHsk7to9Paper,
}) {
  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] border border-amber-400/35 shadow-xl space-y-3 sm:space-y-5 text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-[#E85D3F]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Chuẩn Khảo Thí HSK 3.0 Mới • Kỳ Thi Tích Hợp Cấp 7 – 9</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-['Noto_Serif_SC']">
              Phòng Thi Tích Hợp HSK 7–9 (Nghe • Đọc Biểu Đồ • Dịch Thuật • Luận Văn 600 Chữ • Khẩu Ngữ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed line-clamp-2 sm:line-clamp-none">
              Một bài thi tổng hợp <strong className="text-white">300 điểm / 210 phút</strong> tự động phân loại năng lực
              học thuật theo 3 bậc:{' '}
              <span className="text-cyan-300 font-bold">HSK 7 (≥ 180đ)</span> •{' '}
              <span className="text-purple-300 font-bold">HSK 8 (≥ 210đ)</span> •{' '}
              <span className="text-amber-300 font-bold">Đại sư HSK 9 (≥ 240đ)</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            {[7, 8, 9].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onSelectLevel && onSelectLevel(lvl)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white border-[#E85D3F] shadow-md'
                    : 'bg-white/10 border-white/15 text-amber-300 hover:bg-white/20'
                }`}
              >
                HSK {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới 3 Đề thi H79001, H79002, H79003 */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {HSK_7_TO_9_PAPER_CATALOG.map((paper) => {
            const isHighlighted = selectedLevel === paper.targetLevel;
            return (
              <div
                key={paper.paperCode}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between gap-4 ${
                  isHighlighted
                    ? 'bg-white/15 border-amber-400/70 ring-2 ring-amber-400/30 shadow-xl'
                    : 'bg-black/25 border-white/15 hover:bg-black/35'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold">
                      Mã đề: {paper.paperCode}
                    </span>
                    <span className="text-xs font-bold text-orange-300">
                      Trọng tâm: HSK {paper.targetLevel}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white leading-snug font-['Noto_Serif_SC']">
                    {paper.titleZh}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {paper.titleVi}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                      ⏱️ {paper.durationMinutes} phút
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                      📊 Biểu đồ số liệu
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                      🈯 Dịch Tín-Đạt-Nhã
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                      ✍️ Luận 600 chữ
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onLaunchHsk7to9Paper && onLaunchHsk7to9Paper(paper.paperCode)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-extrabold text-xs hover:opacity-95 transition shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Vào Phòng Thi {paper.paperCode} Ngay</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
