import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import { 
  getHskStructure, 
  getAllHskLevels, 
  HSK_OFFICIAL_VERSIONS 
} from '../data/hskStructureData';

export default function HskStructureView({ onNavigate }) {
  const allLevels = useMemo(() => getAllHskLevels(), []);
  const [selectedLevelKey, setSelectedLevelKey] = useState('hsk-1');
  const [selectedVersion, setSelectedVersion] = useState('2015-Standard');
  const [activeSectionTab, setActiveSectionTab] = useState('all');

  const structure = useMemo(() => {
    return getHskStructure(selectedLevelKey, selectedVersion);
  }, [selectedLevelKey, selectedVersion]);

  const levelInfo = useMemo(() => {
    return allLevels.find(l => l.key === selectedLevelKey) || allLevels[0];
  }, [allLevels, selectedLevelKey]);

  // Lọc phần thi theo tab
  const filteredSections = useMemo(() => {
    if (!structure.sections) return [];
    if (activeSectionTab === 'all') return structure.sections;
    return structure.sections.filter(s => s.sectionId === activeSectionTab);
  }, [structure.sections, activeSectionTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white p-6 sm:p-10 shadow-xl mb-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Cấu Trúc Khảo Thí Quốc Tế Đã Thẩm Định Chính Thức
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            Cấu Trúc Đề Thi HSK Toàn Diện <br className="hidden sm:inline" />
            <span className="text-amber-200">Từ HSK 1 đến HSK 7–9</span>
          </h1>
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-6">
            Hệ thống đối chiếu chuẩn xác cấu trúc khảo thí HSK theo từng cấp độ, số lượng câu hỏi, thời lượng, quy tắc phát audio và dạng bài thi. Phân định minh bạch giữa <strong>HSK 2015 (Hiện hành)</strong> và <strong>HSK 3.0 (Tiêu chuẩn mới)</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="http://www.chinesetest.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-orange-700 font-bold hover:bg-amber-50 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Cổng khảo thí chính thức chinesetest.cn
            </a>
            <span className="text-white/80 font-medium">
              Ngày xác minh: <strong>{structure.verifiedDate || '2026-10-12'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            1. Chọn cấp độ HSK cần tìm hiểu
          </span>
          <span className="text-xs text-slate-500">
            Hỗ trợ 7 cấp bậc chính thức
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {allLevels.map(lvl => {
            const isSelected = lvl.key === selectedLevelKey;
            return (
              <button
                key={lvl.key}
                type="button"
                onClick={() => {
                  setSelectedLevelKey(lvl.key);
                  // Nếu là HSK 7-9 thì phiên bản tự động là HSK 3.0
                  if (lvl.key === 'hsk-7-9') {
                    setSelectedVersion('HSK 3.0-2021');
                  }
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E85D3F] bg-white dark:bg-slate-900 shadow-md ring-2 ring-[#E85D3F]/30 scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`text-base font-black ${isSelected ? 'text-[#E85D3F]' : 'text-slate-800 dark:text-slate-200'}`}>
                  {lvl.level}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {lvl.vocabCount} từ vựng
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Version Selector Tabs & Notice */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
              2. Chọn phiên bản khảo thí
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {structure.level} — {structure.levelNameVi}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {structure.tagline}
            </p>
          </div>

          {/* Toggle Versions */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0 self-start sm:self-center">
            {HSK_OFFICIAL_VERSIONS.map(ver => {
              const isVerActive = selectedVersion === ver.id;
              // Nếu là 7-9 thì 2015 không áp dụng
              const isDisabled = selectedLevelKey === 'hsk-7-9' && ver.id === '2015-Standard';

              return (
                <button
                  key={ver.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setSelectedVersion(ver.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isVerActive
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  } ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {ver.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification Status & Disclaimer Banner */}
        <div className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border mb-6 ${
          structure.verificationStatus === 'verified'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
        }`}>
          {structure.verificationStatus === 'verified' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold flex items-center gap-2">
              <span>
                {structure.verificationStatus === 'verified'
                  ? 'Cấu trúc khảo thí chính thức được xác nhận'
                  : 'Tiêu chuẩn tham chiếu mới (Đang trong lộ trình chuyển tiếp CTI)'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                structure.verificationStatus === 'verified'
                  ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                  : 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
              }`}>
                {structure.verificationStatus === 'verified' ? 'CHÍNH THỨC 100%' : 'CHƯA TRIỂN KHAI ĐỒNG LOẠT'}
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-xs">
              {structure.verificationStatus === 'verified' ? (
                <>
                  Dữ liệu đối chiếu chuẩn xác với <strong>Đề cương Khảo thí HSK chính thức</strong> do CTI công bố. Đang được áp dụng cho toàn bộ kỳ thi giấy và máy trên toàn cầu.
                </>
              ) : (
                <>
                  {structure.notesVi || 'Tiêu chuẩn HSK 3.0 đã ban hành định lượng từ vựng, tuy nhiên CTI chưa áp dụng cấu trúc đề mới cho mọi điểm thi. Không tự suy đoán đề thi mới đã thay thế hoàn toàn đề 2015 trong năm 2026.'}
                </>
              )}
            </p>
            {structure.unverifiedFields && structure.unverifiedFields.length > 0 && (
              <div className="mt-2 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <span>Thông số đánh dấu Chưa xác minh:</span>
                <span className="italic">{structure.unverifiedFields.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* 6 Key Parameter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Thời lượng thi</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              ~{structure.totalDurationMinutes} <span className="text-xs font-normal text-slate-400">phút</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">+5p điền thông tin</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Tổng số câu</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {structure.totalQuestions} <span className="text-xs font-normal text-slate-400">câu</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{structure.sections?.length || 0} phần thi</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Điểm tối đa</span>
            <div className="text-xl font-black text-[#E85D3F] mt-1">
              {structure.maxScore} <span className="text-xs font-normal text-slate-400">điểm</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">100đ / kỹ năng</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Điểm chuẩn Đạt</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {structure.passingScore}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tổng điểm &gt;= 60%</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Yêu cầu từ vựng</span>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {structure.vocabularyRequirement} <span className="text-xs font-normal text-slate-400">từ</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{structure.characterRequirement || 'N/A'} chữ Hán</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Quy tắc Audio</span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {structure.audioPlayCount} <span className="text-xs font-normal text-slate-400">lượt/câu</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {structure.audioPlayCount === 1 ? 'Chỉ phát 1 lần' : 'Phát đúng 2 lần'}
            </div>
          </div>
        </div>

        {/* Action Button: Jump directly to matching practice tests */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E85D3F] text-white flex items-center justify-center font-black">
              {structure.levelCode || 'HSK'}
            </div>
            <div>
              <div className="font-black text-sm text-slate-900 dark:text-white">
                Muốn làm bài tập theo đúng cấu trúc {structure.level}?
              </div>
              <div className="text-xs text-slate-500">
                Luyện tập miễn phí trên HanziGo với các đề thi mô phỏng đã được đối chiếu chuẩn format.
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('exams')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Vào danh sách đề thi {structure.level}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detailed Section Breakdown */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Phân rã chi tiết từng phần thi ({structure.sections?.length || 0} kỹ năng)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thời gian, số lượng câu, dạng câu hỏi và kỹ năng đo lường
            </p>
          </div>

          {/* Section filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveSectionTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeSectionTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Tất cả phần
            </button>
            {structure.sections?.map(s => (
              <button
                key={s.sectionId}
                onClick={() => setActiveSectionTab(s.sectionId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeSectionTab === s.sectionId
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s.nameVi} ({s.nameCn})
              </button>
            ))}
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-6">
          {filteredSections.map((sec, idx) => (
            <div
              key={sec.sectionId}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{sec.nameVi}</span>
                      <span className="text-sm font-bold text-slate-400">({sec.nameCn})</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {sec.audioRules}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs self-start sm:self-center">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-[#E85D3F]" />
                    {sec.durationMinutes} phút
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <FileText className="w-3.5 h-3.5 inline mr-1 text-sky-500" />
                    {sec.questionCount} câu hỏi
                  </span>
                </div>
              </div>

              {/* Sub-parts breakdown */}
              {sec.parts && sec.parts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                        <th className="py-2.5 px-3">Phần nhỏ</th>
                        <th className="py-2.5 px-3">Số câu</th>
                        <th className="py-2.5 px-3">Dạng bài thi</th>
                        <th className="py-2.5 px-3">Kỹ năng đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {sec.parts.map(p => (
                        <tr key={p.partNumber} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            Phần {p.partNumber}
                          </td>
                          <td className="py-3 px-3 font-black text-[#E85D3F] whitespace-nowrap">
                            {p.questionCount} câu
                          </td>
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                            {p.formatDescription}
                          </td>
                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                            {p.skillsTested}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  {sec.audioRules || 'Không có yêu cầu kiểm tra ở cấp độ này.'}
                </div>
              )}

              {/* Free Writing / Essay Rubric Notice */}
              {sec.sectionId === 'writing' && structure.levelCode >= '3' && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                    <Info className="w-4 h-4 text-amber-600" />
                    Nguyên tắc chấm điểm phần Viết trên HanziGo
                  </div>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11px]">
                    Các câu hỏi dạng <strong>Sắp xếp từ thành câu</strong> được chấm tự động dựa trên trật tự cú pháp chuẩn xác. Đối với các bài <strong>Viết tự do / bài luận</strong> (HSK 4, 5, 6), hệ thống cung cấp <em>tiêu chí tự chấm điểm (Rubric)</em> và <em>bài mẫu tham khảo</em>, không tự động chấm bằng thuật toán đơn giản để đảm bảo tính trung thực học thuật.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Academic Citation & Official Sources Footer */}
      <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 text-xs">
        <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#E85D3F]" />
          Nguồn tham chiếu học thuật & Giấy phép tài liệu
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <div>
            <strong className="block text-slate-800 dark:text-slate-200 mb-1">
              1. Cổng thông tin Khảo thí Quốc tế (CTI):
            </strong>
            Toàn bộ cấu trúc đề thi HSK 1–6 và HSK 7–9 được trích xuất trực tiếp từ <em>Đề cương Khảo thí HSK</em> (HSK 考试大纲) do Trung tâm Khảo thí Quốc tế HSK (CTI) và Trung tâm Hợp tác Giao lưu Ngôn ngữ Trung - Ngoại (CLEC) ban hành công khai tại [chinesetest.cn](http://www.chinesetest.cn/).
          </div>
          <div>
            <strong className="block text-slate-800 dark:text-slate-200 mb-1">
              2. Tiêu chuẩn Quốc gia GF0025-2021:
            </strong>
            Tiêu chuẩn Đánh giá Năng lực Tiếng Trung trong Giáo dục Quốc tế (3 giai đoạn 9 cấp) do Bộ Giáo dục Trung Quốc và Ủy ban Ngôn ngữ Quốc gia ban hành, định hình lộ trình phát triển HSK 3.0 trong tương lai.
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <span>
            Minh bạch bản quyền: Các đề thi mang nhãn "Đề HanziGo" là đề mô phỏng do HanziGo tự biên soạn, không phải đề thi rò rỉ hay thương mại trái phép.
          </span>
          <span className="font-semibold text-slate-500">
            HanziGo Academic Standard Engine • 2026
          </span>
        </div>
      </div>
    </div>
  );
}
