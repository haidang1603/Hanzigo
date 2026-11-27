import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Dices,
  Search,
  Filter,
  HelpCircle,
  Flame,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import {
  getHskExams,
  getHskExamDetails,
  HSK_TOPICS_CATALOG,
} from '../../services/hskService';

export function HskExamsListView({
  onNavigate,
  onOpenRandomModal,
  selectedLevel = 7,
  onSelectLevel,
  onLaunchHsk7to9Paper,
  Hsk7to9ExamCenterSection,
  renderMobileFilterToggle,
}) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeExamFilterCount = [levelFilter, skillFilter, typeFilter, topicFilter].filter(
    (v) => v !== 'all'
  ).length;

  useEffect(() => {
    setLoading(true);
    getHskExams({
      level: levelFilter,
      skill: skillFilter,
      type: typeFilter,
      topic: topicFilter,
      query: searchQuery,
    }).then((data) => {
      setExams(data);
      setLoading(false);
    });
  }, [levelFilter, skillFilter, typeFilter, topicFilter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-slate-500 hover:text-[#E85D3F] flex items-center gap-1 mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Về trang luyện thi HSK
          </button>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Thư Viện Đề Thi Thử HSK
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {exams.length} đề thi chuẩn hóa &amp; 1.726 câu hỏi thực chiến đủ 100% số câu (HSK 2.0 &amp; HSK 3.0)
          </p>
        </div>
        <button
          onClick={onOpenRandomModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-black text-xs shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Dices className="w-4 h-4" />
          <span>Sinh Đề Ngẫu Nhiên 🎲</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-5 sm:mb-8 space-y-3 sm:space-y-4">
        {/* Search & Mobile Filter Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên đề thi, từ khóa..."
              className="w-full min-h-11 pl-11 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base sm:text-sm focus:outline-none focus:border-[#E85D3F]"
            />
          </div>
          {renderMobileFilterToggle ? (
            renderMobileFilterToggle({
              showMobileFilters,
              toggleMobileFilters: () => setShowMobileFilters((prev) => !prev),
              activeExamFilterCount,
            })
          ) : (
            <button
              type="button"
              onClick={() => setShowMobileFilters((prev) => !prev)}
              className="sm:hidden min-h-11 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#E85D3F]" />
              <span>Bộ lọc đề thi</span>
              {activeExamFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#E85D3F] text-white text-[10px] font-black">
                  {activeExamFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Filters (Collapsible on mobile, always visible on sm+) */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block space-y-3 sm:space-y-4`}>
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-between text-xs font-semibold">
            {/* Level Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400">Cấp độ:</span>
              {['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7–9'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setLevelFilter(lvl);
                    if (lvl === 'HSK 7–9' && onSelectLevel) {
                      onSelectLevel(selectedLevel >= 7 ? selectedLevel : 7);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    levelFilter === lvl
                      ? 'bg-[#E85D3F] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả cấp độ' : lvl}
                </button>
              ))}
            </div>

            {/* Skill Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400">Kỹ năng:</span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'listening', label: 'Nghe hiểu' },
                { id: 'reading', label: 'Đọc hiểu' },
                { id: 'mixed', label: 'Tổng hợp' },
              ].map((sk) => (
                <button
                  key={sk.id}
                  onClick={() => setSkillFilter(sk.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    skillFilter === sk.id
                      ? 'bg-[#E85D3F] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sk.label}
                </button>
              ))}
            </div>

            {/* Exam Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400">Loại đề:</span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'mock', label: 'Đề HanziGo' },
                { id: 'official_sample', label: 'Đề mẫu CTI' },
              ].map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setTypeFilter(tp.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    typeFilter === tp.id
                      ? 'bg-[#E85D3F] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Filter Row */}
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Chủ đề:</span>
            <button
              onClick={() => setTopicFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                topicFilter === 'all'
                  ? 'bg-[#E85D3F] text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Tất cả chủ đề
            </button>
            {HSK_TOPICS_CATALOG.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopicFilter(t.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  topicFilter === t.id
                    ? 'bg-[#E85D3F] text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Khu vực Đề thi Tích hợp HSK 7–9 (Hiển thị khi chọn Tất cả hoặc HSK 7–9) */}
      {(levelFilter === 'all' || levelFilter === 'HSK 7–9') && (
        <div className="mb-8">
          <Hsk7to9ExamCenterSection
            selectedLevel={selectedLevel}
            onSelectLevel={onSelectLevel}
            onLaunchHsk7to9Paper={onLaunchHsk7to9Paper}
          />
        </div>
      )}

      {/* Exam Grid */}
      {levelFilter === 'HSK 7–9' ? null : loading ? (
        <div className="text-center py-16 text-slate-400">Đang tìm kiếm đề thi...</div>
      ) : exams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">Không tìm thấy đề thi phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bớt bộ lọc hoặc thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] font-bold text-xs">
                      {exam.level}
                    </span>
                    {exam.total_questions >= 25 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold text-[10px] flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-600" />
                        Chuẩn thi thật CTI
                      </span>
                    )}
                    {exam.topic && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 font-bold text-[10px] flex items-center gap-1">
                        <span>{HSK_TOPICS_CATALOG.find((t) => t.id === exam.topic)?.icon || '🎯'}</span>
                        <span>{HSK_TOPICS_CATALOG.find((t) => t.id === exam.topic)?.label.split('&')[0].trim() || exam.topic}</span>
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      exam.exam_type === 'mock'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    {exam.exam_type === 'mock' ? 'Biên soạn HanziGo' : 'Đề mẫu CTI'}
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
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl font-semibold">
                  <span>⏱️ {exam.duration_minutes} phút</span>
                  <span className={exam.total_questions >= 25 ? 'font-bold text-rose-600 dark:text-rose-400' : ''}>
                    📄 {exam.total_questions} câu
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">Điểm đạt: {exam.passing_score}đ</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('exam', exam.id)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  {exam.total_questions === 0 ? (
                    <button
                      onClick={() => onNavigate('exam', exam.id)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Đề tham chiếu
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('take', exam.id)}
                      className="flex-1 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] transition-colors cursor-pointer"
                    >
                      Vào thi
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HskExamDetailView({ examId, onNavigate }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHskExamDetails(examId).then((data) => {
      setExam(data);
      setLoading(false);
    });
  }, [examId]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Đang tải thông tin đề thi...</div>;
  }

  if (!exam) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16 text-center">
        <h2 className="text-xl font-bold mb-4">Không tìm thấy đề thi</h2>
        <button
          onClick={() => onNavigate('exams')}
          className="px-6 py-2.5 bg-[#E85D3F] text-white rounded-xl text-sm font-bold"
        >
          Quay lại danh sách đề
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
      <button
        onClick={() => onNavigate('exams')}
        className="text-xs font-bold text-slate-500 hover:text-[#E85D3F] flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đề
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-lg bg-orange-100 text-[#E85D3F] font-bold text-xs">
            {exam.level}
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
            Phiên bản: {exam.exam_version}
          </span>
          <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-bold text-xs">
            {exam.exam_type === 'mock' ? 'Đề thi thử HanziGo' : 'Đề thi mẫu CTI'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">
          {exam.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {exam.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 mb-8 text-center">
          <div>
            <div className="text-xs text-slate-400 font-medium">Thời gian thi</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {exam.duration_minutes} phút
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Số lượng câu</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {exam.total_questions} câu
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Điểm tối đa</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {exam.max_score} điểm
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Điểm đạt chuẩn</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {exam.passing_score} điểm
            </div>
          </div>
        </div>

        {/* Cấu trúc các phần */}
        <div className="mb-8">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3">
            Cấu trúc đề thi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                🎧 Phần 1: Nghe hiểu (Listening)
              </span>
              <span className="font-bold text-[#E85D3F]">
                {exam.partsSummary?.listening || 0} câu hỏi
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                📖 Phần 2: Đọc hiểu (Reading)
              </span>
              <span className="font-bold text-[#E85D3F]">
                {exam.partsSummary?.reading || 0} câu hỏi
              </span>
            </div>
          </div>
        </div>

        {/* Nguồn gốc & Bản quyền */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs leading-relaxed space-y-1.5">
          <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Nguồn gốc &amp; Tình trạng cấp phép
          </div>
          <div>• <strong>Tác giả / Đơn vị biên soạn:</strong> {exam.source_author}</div>
          <div>• <strong>Giấy phép:</strong> {exam.license}</div>
          <div>• <strong>Ngày thẩm định:</strong> {exam.verified_date}</div>
          {exam.source_url && (
            <div>
              • <strong>Đường dẫn nguồn gốc:</strong>{' '}
              <a href={exam.source_url} target="_blank" rel="noopener noreferrer" className="text-[#E85D3F] hover:underline inline-flex items-center gap-0.5">
                {exam.source_url} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            * Miễn phí hoàn toàn. Bài làm sẽ được tự động chấm và bảo mật điểm số.
          </div>
          {exam.total_questions === 0 ? (
            exam.source_url ? (
              <a
                href={exam.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Xem tài liệu tham chiếu gốc CTI <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-base cursor-not-allowed"
              >
                Tài liệu tham chiếu học thuật
              </button>
            )
          ) : (
            <button
              onClick={() => onNavigate('take', exam.id)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#E85D3F] text-white font-bold text-base shadow-lg shadow-orange-500/20 hover:bg-[#CB4529] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Bắt đầu làm bài thi ngay <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
