import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  Flag, 
  CheckCircle2, 
  FileCheck2 
} from 'lucide-react';
import { 
  getPublicHskResources, 
  submitContentReport, 
  getAdminReports 
} from '../services/hskReviewService';
import { 
  importHskExamWithValidation, 
  generateSampleImportJson 
} from '../services/hskImportService';

// =========================================================================
// 1. PHASE 3 VIEW: KHO TÀI LIỆU & ĐỀ MẪU HSK (HSK RESOURCE HUB)
// =========================================================================
export function HskResourcesView({ user, onNavigate, onOpenReport, onOpenAdmin }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true || (typeof user.email === 'string' && user.email.includes('admin')));

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPublicHskResources({
      level: selectedLevel,
      category: selectedCategory,
      skill: selectedSkill,
      format: selectedFormat,
      search: searchQuery
    }).then(data => {
      if (mounted) {
        setResources(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [selectedLevel, selectedCategory, selectedSkill, selectedFormat, searchQuery]);

  const levelOptions = ['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
  const categoryOptions = [
    { id: 'all', label: 'Tất cả danh mục' },
    { id: 'official_sample', label: '🏛️ Đề mẫu chính thức' },
    { id: 'hanzigo_mock', label: '⚡ Đề mô phỏng HanziGo' },
    { id: 'textbook_grammar', label: '📚 Giáo trình & Ngữ pháp' },
    { id: 'portal_guideline', label: '🌐 Cổng thông tin khảo thí' },
  ];
  const formatOptions = [
    { id: 'all', label: 'Tất cả định dạng' },
    { id: 'online_practice', label: 'Đề thi online' },
    { id: 'document_pdf', label: 'Tài liệu PDF' },
    { id: 'audio', label: 'Âm thanh (Audio)' },
    { id: 'portal', label: 'Cổng thông tin' },
  ];
  const skillOptions = [
    { id: 'all', label: 'Tất cả kỹ năng' },
    { id: 'mixed', label: 'Tổng hợp' },
    { id: 'listening', label: 'Nghe hiểu' },
    { id: 'reading', label: 'Đọc hiểu' },
    { id: 'grammar', label: 'Ngữ pháp' },
    { id: 'vocabulary', label: 'Từ vựng' },
  ];

  const clearFilters = () => {
    setSelectedLevel('all');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setSelectedSkill('all');
    setSearchQuery('');
  };

  const getFormatBadge = (fmt) => {
    switch (fmt) {
      case 'online_practice':
        return { label: 'Đề thi Online', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'document_pdf':
        return { label: 'Tài liệu PDF', color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
      case 'audio':
        return { label: 'File Âm thanh', color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'portal':
        return { label: 'Cổng thông tin', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      default:
        return { label: fmt, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const getPermissionBadge = (perm) => {
    switch (perm) {
      case 'reproducible':
        return { label: '🟢 Cho phép trích dẫn / Tự do', desc: 'Có thể tái sử dụng & luyện tập trực tiếp' };
      case 'linked_only':
        return { label: '🔵 Dẫn nguồn liên kết', desc: 'Bản quyền thuộc tác giả gốc, không sao chép' };
      case 'unverified':
      default:
        return { label: '🟡 Chưa thẩm định bản quyền', desc: 'Tài liệu đang trong quy trình rà soát' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-amber-500/10 mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kho Tri Thức HSK Miễn Phí & Minh Bạch Bản Quyền</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
            Thư Viện Tài Liệu & Đề Thi Mẫu HSK
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Tuyển tập đề thi mẫu chính thức, đề mô phỏng HanziGo, tài liệu ngữ pháp và cổng khảo thí quốc tế. Mọi tài nguyên đều được xác minh nguồn gốc và phân loại bản quyền minh bạch.
          </p>
        </div>
        {isAdmin && onOpenAdmin && (
          <div className="mt-4 sm:mt-0 sm:absolute sm:right-6 sm:top-6 z-10">
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white text-amber-800 hover:bg-amber-50 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Quản trị & Nhập đề thi</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài liệu theo tên, tác giả, nhà xuất bản, từ khóa..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Cấp độ:</span>
          {levelOptions.map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedLevel === lvl
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl === 'all' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>

        {/* Category & Format Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Danh mục</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            >
              {categoryOptions.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Định dạng</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            >
              {formatOptions.map(fmt => (
                <option key={fmt.id} value={fmt.id}>{fmt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Kỹ năng</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            >
              {skillOptions.map(sk => (
                <option key={sk.id} value={sk.id}>{sk.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filter Notice if filtered */}
        {(selectedLevel !== 'all' || selectedCategory !== 'all' || selectedFormat !== 'all' || selectedSkill !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span>Tìm thấy <strong>{resources.length}</strong> tài nguyên phù hợp.</span>
            <button
              onClick={clearFilters}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">Đang tải danh mục tài liệu HSK...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 mb-8">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">Không tìm thấy tài nguyên phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Vui lòng thử tìm với từ khóa khác hoặc điều chỉnh lại các tiêu chí bộ lọc cấp độ, định dạng hoặc danh mục.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Xem toàn bộ tài liệu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {resources.map((res) => {
            const formatBadge = getFormatBadge(res.format);
            const permBadge = getPermissionBadge(res.permission_status);
            return (
              <div
                key={res.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between shadow-xs hover:border-amber-300 dark:hover:border-amber-600/40 transition-all group"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {res.level === 'all' ? 'Đa cấp độ' : res.level}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${formatBadge.color}`}>
                      {formatBadge.label}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {res.description}
                  </p>

                  {/* Metadata: Author & Permission */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Nguồn / Tác giả:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                        {res.source_author || res.publisher || 'Ban Học Thuật'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Bản quyền:</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400" title={permBadge.desc}>
                        {permBadge.label}
                      </span>
                    </div>

                    {res.publication_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Xuất bản:</span>
                        <span>{res.publication_date}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {Array.isArray(res.tags) && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {res.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenReport(res)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Báo cáo lỗi liên kết hoặc nghi vấn bản quyền"
                  >
                    <Flag className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-2">
                    {res.format === 'online_practice' && res.exam_id ? (
                      <button
                        onClick={() => onNavigate('exam', res.exam_id)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Làm bài ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : res.source_url ? (
                      <a
                        href={res.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center space-x-1 transition-colors"
                      >
                        <span>Xem nguồn gốc</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content Quality & Copyright Disclaimer Banner */}
      <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Cam kết Minh Bạch Nguồn Gốc & Quyền Sở Hữu Trí Tuệ (HanziGo Quality Assurance)
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <p>
                <strong>1. Đề thi mô phỏng HanziGo (Mock Exams):</strong> Được Ban Học Thuật HanziGo biên soạn độc lập dựa trên khung năng lực HSK chuẩn hóa, không mạo danh đề thi khảo thí thực tế. Mọi ước tính độ khó đều mang tính tham khảo nội bộ.
              </p>
              <p>
                <strong>2. Tài liệu mẫu chính thức (CLEC / CTI ChineTest):</strong> Luôn được gắn nhãn rõ ràng và dẫn liên kết trực tiếp về cổng khảo thí quốc tế của cơ quan chủ quản. HanziGo không phân phối lại nội dung có bản quyền bảo hộ mà không có thỏa thuận cấp phép.
              </p>
              <p>
                <strong>3. Đóng góp & Báo cáo cộng đồng:</strong> Nếu bạn phát hiện bất kỳ liên kết nào bị hỏng, lỗi âm thanh, hoặc nội dung cần chỉnh lý bản quyền, vui lòng nhấn nút <strong>Báo lỗi (Lá cờ)</strong> để Ban Học Thuật kiểm tra và xử lý trong vòng 24–48 giờ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 2. PHASE 3 MODAL: BÁO CÁO SỰ CỐ & NGHI VẤN HỌC THUẬT (PUBLIC QUALITY REPORT)
// =========================================================================
export function HskReportModal({ isOpen, onClose, targetItem, user }) {
  const [reportType, setReportType] = useState('broken_link');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setReporterEmail(user.email);
    }
    setResultMsg(null);
    setErrorMsg(null);
    setDescription('');
  }, [isOpen, user, targetItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 5) {
      setErrorMsg('Vui lòng mô tả chi tiết sự cố tối thiểu 5 ký tự.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const res = await submitContentReport({
      resourceId: targetItem?.id,
      examId: targetItem?.exam_id,
      reportType,
      description,
      reporterEmail
    });

    setSubmitting(false);

    if (res.success) {
      setResultMsg(res.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setErrorMsg(res.error || 'Có lỗi xảy ra khi gửi báo cáo.');
    }
  };

  const reportTypes = [
    { id: 'broken_link', label: '🔗 Liên kết hỏng / Không truy cập được' },
    { id: 'incorrect_answer', label: '❓ Nghi vấn đáp án / Lời giải chưa chuẩn' },
    { id: 'typo_content', label: '✍️ Lỗi phiên âm, chữ Hán hoặc dịch nghĩa' },
    { id: 'audio_issue', label: '🔊 Lỗi âm thanh / Phát âm không khớp' },
    { id: 'copyright_concern', label: '🛡️ Vấn đề bản quyền / Nguồn gốc tài liệu' },
    { id: 'other', label: '📝 Ý kiến đóng góp khác' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Báo Cáo Sự Cố & Kiểm Định Nội Dung
            </h3>
            <p className="text-xs text-slate-500">
              {targetItem?.title ? `Mục: ${targetItem.title}` : 'Đóng góp chất lượng cho HanziGo'}
            </p>
          </div>
        </div>

        {resultMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs text-center font-bold">
            {resultMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Loại sự cố gặp phải:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              >
                {reportTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Mô tả chi tiết vấn đề:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vui lòng cung cấp chi tiết (ví dụ: liên kết bị 404, câu số 3 phiên âm sai, đáp án B hợp lý hơn C vì...)"
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Email của bạn (tùy chọn để nhận kết quả rà soát):
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="vidu@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-sm"
              >
                <span>{submitting ? 'Đang gửi...' : 'Gửi phản hồi'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 3. PHASE 3 MODAL: QUẢN TRỊ NỘI DUNG & NHẬP ĐỀ THI (ADMIN WORKFLOW)
// =========================================================================
export function HskAdminImportModal({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState('import'); // 'import' | 'reports'
  const [jsonText, setJsonText] = useState('');
  const [validationReport, setValidationReport] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResult, setCommitResult] = useState(null);
  const [reportsList, setReportsList] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'reports') {
      setLoadingReports(true);
      getAdminReports({ user }).then(data => {
        setReportsList(data);
        setLoadingReports(false);
      });
    }
  }, [isOpen, activeTab, user]);

  if (!isOpen) return null;

  const handleLoadSample = (level) => {
    const sample = generateSampleImportJson(level);
    setJsonText(sample);
    setValidationReport(null);
    setCommitResult(null);
  };

  const handleDryRun = async () => {
    if (!jsonText.trim()) {
      alert('Vui lòng nhập nội dung JSON.');
      return;
    }

    try {
      setIsValidating(true);
      setCommitResult(null);
      const parsed = JSON.parse(jsonText);
      const result = await importHskExamWithValidation({
        jsonPayload: parsed,
        dryRun: true,
        user
      });
      setValidationReport(result);
    } catch (err) {
      setValidationReport({
        valid: false,
        dryRun: true,
        errors: [`Lỗi cú pháp JSON: ${err.message}`],
        warnings: [],
        preview: null
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleCommit = async () => {
    if (!validationReport || !validationReport.valid) {
      alert('Chỉ có thể nhập chính thức khi gói dữ liệu vượt qua kiểm tra Dry-run.');
      return;
    }

    try {
      setIsCommitting(true);
      const parsed = JSON.parse(jsonText);
      const result = await importHskExamWithValidation({
        jsonPayload: parsed,
        dryRun: false,
        user
      });
      setCommitResult(result);
    } catch (err) {
      setCommitResult({
        success: false,
        error: `Lỗi nhập liệu: ${err.message}`
      });
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 shrink-0">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Bảng Điều Khiển Quản Trị & Kiểm Định Nội Dung HSK
            </h3>
            <p className="text-xs text-slate-500">
              Quy trình nhập liệu nguyên tử (Dry-run), thẩm định bản quyền và giám sát sự cố học thuật.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'import'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            📥 Nhập đề thi JSON (Dry-run & Commit)
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🚩 Phản ánh từ người học
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {activeTab === 'import' && (
            <div>
              {/* Sample loader buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Dữ liệu JSON đề thi & câu hỏi:
                </span>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Nạp mẫu:</span>
                  <button
                    onClick={() => handleLoadSample('HSK 1')}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-amber-100 hover:text-amber-800 cursor-pointer"
                  >
                    HSK 1
                  </button>
                  <button
                    onClick={() => handleLoadSample('HSK 2')}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-amber-100 hover:text-amber-800 cursor-pointer"
                  >
                    HSK 2
                  </button>
                  <button
                    onClick={() => handleLoadSample('HSK 3')}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-amber-100 hover:text-amber-800 cursor-pointer"
                  >
                    HSK 3
                  </button>
                </div>
              </div>

              {/* JSON Textarea */}
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setValidationReport(null);
                  setCommitResult(null);
                }}
                placeholder="Dán cấu trúc JSON chứa 'exam' và 'questions' vào đây..."
                rows={10}
                className="w-full p-3 font-mono text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />

              {/* Action Buttons for Dry-run & Commit */}
              <div className="flex items-center justify-between gap-3 pt-3">
                <button
                  onClick={handleDryRun}
                  disabled={isValidating || !jsonText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  <span>{isValidating ? 'Đang thẩm định...' : 'Kiểm tra trước (Dry-run)'}</span>
                </button>

                <button
                  onClick={handleCommit}
                  disabled={isCommitting || !validationReport?.valid}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                    validationReport?.valid
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCommitting ? 'Đang nhập...' : 'Xác nhận nhập chính thức (Commit)'}</span>
                </button>
              </div>

              {/* Commit Result Toast */}
              {commitResult && (
                <div className={`mt-4 p-4 rounded-2xl border text-xs font-bold ${
                  commitResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}>
                  {commitResult.success ? commitResult.message : commitResult.error}
                </div>
              )}

              {/* Validation Report Card */}
              {validationReport && (
                <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Báo Cáo Kiểm Tra (Validation Report):
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      validationReport.valid
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {validationReport.valid ? '🟢 Hợp lệ (Sẵn sàng commit)' : '🔴 Không hợp lệ (Có lỗi)'}
                    </span>
                  </div>

                  {/* Errors List */}
                  {validationReport.errors?.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                      <div className="font-bold">Các lỗi cần khắc phục:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {validationReport.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings List */}
                  {validationReport.warnings?.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                      <div className="font-bold">Cảnh báo học thuật (vẫn cho phép nhập):</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {validationReport.warnings.map((warn, idx) => (
                          <li key={idx}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Preview Card */}
                  {validationReport.preview && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Bản xem trước đề thi:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-400">
                        <div>Tiêu đề: <strong className="text-slate-800 dark:text-slate-200">{validationReport.preview.title}</strong></div>
                        <div>Cấp độ: <strong className="text-slate-800 dark:text-slate-200">{validationReport.preview.level}</strong></div>
                        <div>Số câu hỏi: <strong className="text-slate-800 dark:text-slate-200">{validationReport.preview.question_count} câu</strong></div>
                        <div>Tổng điểm: <strong className="text-slate-800 dark:text-slate-200">{validationReport.preview.total_score} điểm</strong></div>
                      </div>
                      <div className="text-slate-500 pt-1 text-[11px]">
                        Nguồn: {validationReport.preview.source} • Bản quyền: {validationReport.preview.permission_status} • Trạng thái: {validationReport.preview.review_status}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Danh sách phản ánh từ người học
                </h4>
                <button
                  onClick={() => {
                    setLoadingReports(true);
                    getAdminReports({ user }).then(data => {
                      setReportsList(data);
                      setLoadingReports(false);
                    });
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Làm mới
                </button>
              </div>

              {loadingReports ? (
                <div className="py-12 text-center text-xs text-slate-400">Đang tải phản ánh...</div>
              ) : reportsList.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-400">
                  Chưa có báo cáo sự cố nào đang chờ xử lý.
                </div>
              ) : (
                <div className="space-y-3">
                  {reportsList.map(rep => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-rose-600 dark:text-rose-400 uppercase text-[11px]">
                          {rep.report_type}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(rep.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        {rep.description}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Người gửi: {rep.reporter_email || 'Khách ẩn danh'}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {rep.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
