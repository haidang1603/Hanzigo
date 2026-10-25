import { HskResourcesView, HskReportModal, HskAdminImportModal } from '../components/HskPhase3Components';
import HskStructureView from '../components/HskStructureView';
import HskAiDiagnosticPanel from '../components/personalization/HskAiDiagnosticPanel';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  Volume2, 
  VolumeX,
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  BarChart2, 
  Layers, 
  Calendar, 
  UserCheck, 
  FileText, 
  Eye, 
  RefreshCw,
  Info,
  TrendingUp,
  TrendingDown,
  BookMarked,
  Bookmark,
  CheckCircle,
  Flame,
  ArrowUpDown,
  Compass,
  FileCheck2,
  Trash2,
  Check,
  Zap,
  Target
} from 'lucide-react';
import { 
  getHskExams, 
  getHskExamDetails, 
  getExamForTaking, 
  submitExamAttempt, 
  getAttemptResult, 
  getPastAttempts,
  saveTemporaryAnswers, 
  getTemporaryAnswers, 
  getTemporaryExamSession,
  getAudioPlayLimit,
  clearTemporaryAnswers,
  getUserExamHistory,
  compareExamAttempts,
  getMistakeNotebook,
  updateMistakeStatus,
  removeMistakeItem,
  getMistakePracticeExam,
  generateStudyAnalytics,
  generateStudyRecommendations,
  mergeLocalAttemptsToUser
} from '../services/hskService';
import { speakChinese } from '../utils/audio';
import SentenceReorderQuestion from '../components/hsk/SentenceReorderQuestion.jsx';
import { saveCustomVocab } from '../utils/materialsStorage.js';

export default function HskPracticePage({ 
  user, 
  setActiveTab, 
  subRoute = 'home', 
  paramId = null,
  onNavigate = null 
}) {
  const [reportTarget, setReportTarget] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Navigation helper
  const navigateTo = (view, id = null) => {
    if (onNavigate) {
      onNavigate(view, id);
    } else {
      if (view === 'home' || view === 'levels') {
        window.location.hash = '#hsk';
      } else if (view === 'exams') {
        window.location.hash = '#hsk/exams';
      } else if (view === 'structure') {
        window.location.hash = '#hsk/structure';
      } else if (view === 'resources') {
        window.location.hash = '#hsk/resources';
      } else if (view === 'history') {
        window.location.hash = '#hsk/history';
      } else if (view === 'mistakes') {
        window.location.hash = '#hsk/mistakes';
      } else if (view === 'analytics') {
        window.location.hash = '#hsk/analytics';
      } else if (view === 'exam' && id) {
        window.location.hash = `#hsk/exam/${id}`;
      } else if (view === 'take' && id) {
        window.location.hash = `#hsk/take/${id}`;
      } else if (view === 'result' && id) {
        window.location.hash = `#hsk/result/${id}`;
      }
    }
  };

  // Determine current active view based on subRoute
  const currentView = useMemo(() => {
    if (subRoute === 'exams') return 'exams';
    if (subRoute === 'structure') return 'structure';
    if (subRoute === 'resources') return 'resources';
    if (subRoute === 'history') return 'history';
    if (subRoute === 'mistakes') return 'mistakes';
    if (subRoute === 'analytics') return 'analytics';
    if (subRoute === 'exam' && paramId) return 'exam_detail';
    if (subRoute === 'take' && paramId) return 'exam_taking';
    if (subRoute === 'result' && paramId) return 'exam_result';
    return 'home';
  }, [subRoute, paramId]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors pb-16">
      {/* Sub Navigation Bar for HSK Module (Hidden during exam taking) */}
      {currentView !== 'exam_taking' && (
        <HskSubNavHeader 
          currentView={currentView} 
          user={user} 
          onNavigate={navigateTo} 
          onOpenAdmin={() => setAdminModalOpen(true)} 
        />
      )}

      {currentView === 'home' && (
        <HskHomeView 
          onNavigate={navigateTo} 
        />
      )}

      {currentView === 'structure' && (
        <HskStructureView 
          onNavigate={navigateTo} 
        />
      )}

      {currentView === 'exams' && (
        <HskExamsListView 
          onNavigate={navigateTo} 
        />
      )}

      {currentView === 'resources' && (
        <HskResourcesView 
          user={user} 
          onNavigate={navigateTo} 
          onOpenReport={(item) => setReportTarget(item)} 
          onOpenAdmin={() => setAdminModalOpen(true)} 
        />
      )}

      {currentView === 'history' && (
        <HskHistoryView 
          user={user} 
          onNavigate={navigateTo} 
        />
      )}

      {currentView === 'mistakes' && (
        <HskMistakesView 
          user={user} 
          onNavigate={navigateTo} 
        />
      )}

      {currentView === 'analytics' && (
        <HskAnalyticsView 
          user={user} 
          onNavigate={navigateTo} 
          setActiveTab={setActiveTab} 
        />
      )}

      {currentView === 'exam_detail' && (
        <HskExamDetailView 
          examId={paramId} 
          onNavigate={navigateTo} 
        />
      )}

      {currentView === 'exam_taking' && (
        <HskExamTakingView 
          examId={paramId} 
          user={user} 
          onNavigate={navigateTo} 
        />
      )}

      {currentView === 'exam_result' && (
        <HskExamResultView 
          attemptId={paramId} 
          user={user}
          onNavigate={navigateTo} 
        />
      )}

      {/* Modal Báo cáo sự cố từ học viên */}
      <HskReportModal 
        isOpen={!!reportTarget} 
        onClose={() => setReportTarget(null)} 
        targetItem={reportTarget} 
        user={user} 
      />

      {/* Modal Quản trị đề thi & Nhập liệu JSON */}
      <HskAdminImportModal 
        isOpen={adminModalOpen} 
        onClose={() => setAdminModalOpen(false)} 
        user={user} 
      />
    </div>
  );
}

// =========================================================================
// 1. HOME VIEW: Tổng quan & Chọn cấp độ HSK 1 - 6
// =========================================================================
function HskHomeView({ onNavigate }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pastAttempts, setPastAttempts] = useState([]);

  useEffect(() => {
    getHskExams().then(data => {
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
      duration: '40 phút • 120/200 điểm đạt'
    },
    {
      level: 'HSK 2',
      title: 'HSK 2 — Sinh Hoạt Thực Chiến',
      desc: '300 từ vựng, giao tiếp mua sắm, hỏi đường, đặt xe, câu so sánh chữ 比. 35 câu toàn diện.',
      badge: '🟡 Sơ cấp (Vừa)',
      color: 'border-amber-500 hover:border-amber-600',
      tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      duration: '55 phút • 120/200 điểm đạt'
    },
    {
      level: 'HSK 3',
      title: 'HSK 3 — Độc Lập Giao Tiếp',
      desc: '600 từ vựng, câu chữ 把, chữ 被, các cặp liên từ phức & viết sắp xếp câu. 30 câu chuẩn thi.',
      badge: '🔴 Trung cấp (Khá)',
      color: 'border-rose-500 hover:border-rose-600',
      tagColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      duration: '85 phút • 180/300 điểm đạt'
    },
    {
      level: 'HSK 4',
      title: 'HSK 4 — Lưu Loát & Công Sở',
      desc: '1200 từ vựng thương mại, đàm phán, nghe 1 lần, sắp xếp đoạn ABC & viết câu. 30 câu chuyên sâu.',
      badge: '🔵 Cao cấp',
      color: 'border-blue-500 hover:border-blue-600',
      tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      duration: '105 phút • 180/300 điểm đạt'
    },
    {
      level: 'HSK 5',
      title: 'HSK 5 — Chuyên Nghiệp & Học Thuật',
      desc: '2500 từ vựng nâng cao, báo chí thời sự, đàm phán hợp đồng, chuỗi thành ngữ & viết luận 80 chữ.',
      badge: '🟣 Nâng cao (Khó)',
      color: 'border-purple-500 hover:border-purple-600',
      tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
      duration: '125 phút • 180/300 điểm đạt'
    },
    {
      level: 'HSK 6',
      title: 'HSK 6 — Đỉnh Phong & Tự Nhiên',
      desc: '5000+ từ vựng, bình luận chính luận, nhận diện lỗi ngữ pháp (病句) & kỹ năng tóm tắt 400 chữ.',
      badge: '👑 Đỉnh phong (Rất khó)',
      color: 'border-indigo-500 hover:border-indigo-600',
      tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
      duration: '140 phút • 180/300 điểm đạt'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E85D3F] via-[#CB4529] to-[#992E17] text-white p-8 sm:p-12 shadow-xl shadow-orange-500/10 mb-10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Nền tảng Luyện Thi HSK Miễn Phí 100%
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            Thi Thử HSK Trực Tuyến <br className="hidden sm:inline"/>
            <span className="text-amber-200">Không Cần Đăng Nhập</span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-8 leading-relaxed">
            Hệ thống đề thi mô phỏng chuẩn quốc tế từ HSK 1 đến HSK 4: Đầy đủ phần thi Nghe hiểu (kèm Audio bản ngữ) và Đọc hiểu, tự động tính điểm theo thang chuẩn và cung cấp lời giải thích chi tiết bằng tiếng Việt.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('exams')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#E85D3F] font-bold text-base shadow-lg hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Award className="w-5 h-5" />
              Khám phá toàn bộ đề thi ({exams.length})
            </button>
            <button
              onClick={() => onNavigate('structure')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-base shadow-lg hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              Tra cứu Cấu trúc Đề HSK
            </button>
            <a
              href="#copyright-info"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-base transition-colors"
            >
              <Info className="w-5 h-5 text-emerald-300" />
              Minh bạch bản quyền & Nguồn đề
            </a>
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
          {HSK_LEVEL_CARDS.map(card => {
            const count = exams.filter(e => e.level === card.level).length;
            return (
              <div
                key={card.level}
                onClick={() => onNavigate('exams')}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 ${card.color} shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${card.tagColor}`}>
                      {card.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {count} đề thi
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

      {/* Đề thi tiêu biểu nổi bật */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
          Đề thi thử mới nhất & Phổ biến
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Đang tải danh sách đề thi...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.slice(0, 6).map(exam => (
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
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => onNavigate('take', exam.id)}
                      className="flex-1 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] transition-colors"
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
            {pastAttempts.slice(0, 3).map(att => (
              <div 
                key={att.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      att.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
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
                  Xem kết quả & lời giải
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
              Cam kết minh bạch về Nguồn gốc Đề thi & Quyền tác giả
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

// =========================================================================
// 2. EXAM LIST VIEW: Bộ lọc & Khám phá đề thi
// =========================================================================
function HskExamsListView({ onNavigate }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    getHskExams({
      level: levelFilter,
      skill: skillFilter,
      type: typeFilter,
      query: searchQuery
    }).then(data => {
      setExams(data);
      setLoading(false);
    });
  }, [levelFilter, skillFilter, typeFilter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
      <div className="mb-8">
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
          Lọc theo cấp độ, kỹ năng (Nghe, Đọc, Ngữ pháp) và dạng đề thi
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên đề thi, từ khóa (ví dụ: nghe hiểu, ngữ pháp câu chữ 把...)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#E85D3F]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between text-xs font-semibold">
          {/* Level Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">Cấp độ:</span>
            {['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
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
              { id: 'mixed', label: 'Tổng hợp' }
            ].map(sk => (
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
              { id: 'official_sample', label: 'Đề mẫu CTI' }
            ].map(tp => (
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
      </div>

      {/* Exam Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Đang tìm kiếm đề thi...</div>
      ) : exams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">Không tìm thấy đề thi phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bớt bộ lọc hoặc thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
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
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    exam.exam_type === 'mock' 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' 
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}>
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

// =========================================================================
// 3. EXAM DETAIL VIEW: Chi tiết đề thi & Thông tin bản quyền
// =========================================================================
function HskExamDetailView({ examId, onNavigate }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHskExamDetails(examId).then(data => {
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
            Nguồn gốc & Tình trạng cấp phép
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

// =========================================================================
// 4. EXAM TAKING ENGINE VIEW: Giao diện thi, đếm giờ, lưu tạm, nộp bài
// =========================================================================
// =========================================================================
// 4. EXAM TAKING ENGINE VIEW: Giao diện thi, đếm giờ, lưu tạm, nộp bài
// =========================================================================
function HskExamTakingView({ examId, user, onNavigate }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedIds, setFlaggedIds] = useState([]);
  const [examMode, setExamMode] = useState('simulation'); // 'simulation' (Thi thử) | 'practice' (Luyện tập)
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPlayCounts, setAudioPlayCounts] = useState({});
  const [paletteFilter, setPaletteFilter] = useState('all'); // 'all', 'unanswered', 'flagged'
  const [restoredToast, setRestoredToast] = useState(false);
  const [audioNotice, setAudioNotice] = useState(null);
  const [showPracticeScript, setShowPracticeScript] = useState(false);
  const [showPracticeExplanation, setShowPracticeExplanation] = useState(false);

  useEffect(() => {
    setShowPracticeScript(false);
    setShowPracticeExplanation(false);
  }, [currentIdx]);

  // Khung các phần thi (Section list: Nghe -> Đọc -> Viết)
  const sections = useMemo(() => {
    if (!exam || !exam.questions) return [];
    const order = ['listening', 'reading', 'writing'];
    const map = {};
    exam.questions.forEach((q, idx) => {
      const secKey = q.part_type || q.section || 'reading';
      if (!map[secKey]) {
        map[secKey] = {
          key: secKey,
          title: secKey === 'listening' ? 'I. Nghe hiểu (听力)' : secKey === 'writing' ? 'III. Viết (书写)' : 'II. Đọc hiểu (阅读)',
          firstIdx: idx,
          indices: [],
          total: 0,
          answered: 0
        };
      }
      map[secKey].indices.push(idx);
      map[secKey].total += 1;
      if (answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '') {
        map[secKey].answered += 1;
      }
    });
    return order.filter(k => !!map[k]).map(k => map[k]);
  }, [exam, answers]);

  // Khởi tạo bài thi & phục hồi phiên làm bài dang dở
  useEffect(() => {
    let timer = null;
    getExamForTaking(examId).then(data => {
      setExam(data);

      // Phục hồi bản nháp từ localStorage nếu có
      const session = getTemporaryExamSession(examId);
      if (session && session.answers && Object.keys(session.answers).length > 0) {
        setAnswers(session.answers);
        if (session.flaggedQuestionIds) setFlaggedIds(session.flaggedQuestionIds);
        if (session.examMode) setExamMode(session.examMode);
        if (typeof session.currentIdx === 'number') setCurrentIdx(Math.min(session.currentIdx, data.questions.length - 1));
        setRestoredToast(true);
        setTimeout(() => setRestoredToast(false), 5000);
      }

      // Khởi tạo thời gian làm bài (giây)
      const durationSeconds = (data.duration_minutes || 40) * 60;
      setTimeLeft(durationSeconds);
      setLoading(false);
    }).catch(err => {
      alert(err.message);
      onNavigate('exams');
    });

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examId]);

  // Bộ đếm thời gian
  useEffect(() => {
    if (loading || !exam || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeSpentSeconds(prev => prev + 1);

      if (examMode === 'simulation') {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, exam, isSubmitting, examMode]);

  // Tự động lưu bản nháp vào localStorage
  const recordAnswerChange = (questionId, value) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    saveTemporaryAnswers(examId, updated, {
      flaggedQuestionIds: flaggedIds,
      examMode,
      currentIdx
    });
  };

  // Bật/tắt đánh dấu câu hỏi xem lại
  const toggleFlagQuestion = (qId) => {
    const nextFlagged = flaggedIds.includes(qId)
      ? flaggedIds.filter(id => id !== qId)
      : [...flaggedIds, qId];
    setFlaggedIds(nextFlagged);
    saveTemporaryAnswers(examId, answers, {
      flaggedQuestionIds: nextFlagged,
      examMode,
      currentIdx
    });
  };

  // Tự động nộp bài khi hết giờ ở chế độ thi thử
  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    alert('⏱️ Đã hết thời gian làm bài thi! Hệ thống đang tự động nộp bài của bạn.');
    await executeSubmission(true);
  };

  // Nộp bài thi
  const executeSubmission = async (isAuto = false) => {
    setIsSubmitting(true);
    try {
      const calculatedTimeSpent = examMode === 'simulation'
        ? Math.max(1, ((exam.duration_minutes || 40) * 60) - timeLeft)
        : Math.max(1, timeSpentSeconds);

      const attempt = await submitExamAttempt({
        examId: exam.id,
        submittedAnswers: answers,
        timeSpentSeconds: calculatedTimeSpent,
        user,
        examMode
      });
      clearTemporaryAnswers(examId);
      onNavigate('result', attempt.id);
    } catch (err) {
      alert('Lỗi nộp bài: ' + err.message);
      setIsSubmitting(false);
    }
  };

  // Phát âm thanh câu hỏi nghe có kiểm soát quy chế
  const handlePlayAudio = (q) => {
    const maxPlays = getAudioPlayLimit(exam?.level, examMode);
    const currentPlays = audioPlayCounts[q.id] || 0;

    if (examMode === 'simulation' && currentPlays >= maxPlays) {
      setAudioNotice(`Đã đạt giới hạn số lần nghe theo quy chế (${maxPlays} lần). Trong phòng thi không thể phát lại.`);
      setTimeout(() => setAudioNotice(null), 4000);
      return;
    }

    setAudioPlaying(true);
    setAudioPlayCounts(prev => ({
      ...prev,
      [q.id]: (prev[q.id] || 0) + 1
    }));

    if (q.audio_url && q.audio_url.trim().length > 5) {
      try {
        const audio = new Audio(q.audio_url);
        audio.play().catch(() => {
          // Fallback to Web Speech API TTS
          speakChinese(q.audio_script || q.prompt);
        });
        audio.onended = () => setAudioPlaying(false);
        audio.onerror = () => {
          speakChinese(q.audio_script || q.prompt);
          setAudioPlaying(false);
        };
      } catch {
        speakChinese(q.audio_script || q.prompt);
        setTimeout(() => setAudioPlaying(false), 2500);
      }
    } else {
      // Speech synthesis fallback
      speakChinese(q.audio_script || q.prompt);
      setTimeout(() => setAudioPlaying(false), 3000);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-slate-400 font-bold">Đang tải đề thi và thiết lập phòng thi...</div>;
  }

  const currentQ = exam.questions[currentIdx];
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== null && answers[k] !== '').length;
  const isAnswered = currentQ && answers[currentQ.id] !== undefined && answers[currentQ.id] !== null && answers[currentQ.id] !== '';
  const isFlagged = currentQ && flaggedIds.includes(currentQ.id);
  const audioLimit = getAudioPlayLimit(exam?.level, examMode);
  const currentPlays = currentQ ? (audioPlayCounts[currentQ.id] || 0) : 0;
  const canPlayAudio = examMode === 'practice' || currentPlays < audioLimit;

  // Format thời gian hiển thị (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };


  const currentSecKey = currentQ ? (currentQ.part_type || currentQ.section || 'reading') : 'reading';
  const examLevelNum = parseInt((exam?.level || 'HSK 1').replace(/\D/g, '') || '1');
  const showPinyinInTaking = examMode === 'practice' || examLevelNum <= 2;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Toast khôi phục phiên */}
      {restoredToast && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã tự động khôi phục các câu trả lời bạn đang làm dở từ phiên trước.</span>
          </div>
          <button onClick={() => setRestoredToast(false)} className="text-emerald-700 hover:text-emerald-950 text-xs font-black">
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Sticky Timer */}
      <div className="sticky top-0 z-30 bg-[#FFF9F2]/95 dark:bg-slate-950/95 backdrop-blur-md py-3 border-b border-slate-200 dark:border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#E85D3F] uppercase tracking-wider">
              {exam.level} • {exam.title}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              examMode === 'simulation'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}>
              {examMode === 'simulation' ? '⏱️ Thi thử nghiêm ngặt' : '📚 Luyện tập tự do'}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Đã làm: <strong className="text-slate-900 dark:text-white">{answeredCount}</strong> / {totalQuestions} câu
            {flaggedIds.length > 0 && <span className="ml-2 text-amber-600 font-bold">• Đánh dấu xem lại: {flaggedIds.length} câu</span>}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mode Switch Toggle */}
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setExamMode('simulation')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                examMode === 'simulation'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Thi thử
            </button>
            <button
              type="button"
              onClick={() => setExamMode('practice')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                examMode === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Luyện tập
            </button>
          </div>

          {/* Clock */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-black ${
            examMode === 'simulation' && timeLeft < 300 
              ? 'bg-rose-100 text-rose-700 animate-pulse' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
          }`}>
            <Clock className="w-4 h-4 text-[#E85D3F]" />
            {examMode === 'simulation' ? formatTime(timeLeft) : formatTime(timeSpentSeconds)}
          </div>

          {/* Submit Action */}
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white font-bold text-xs shadow-sm hover:bg-[#CB4529] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs (I. Nghe -> II. Đọc -> III. Viết) */}
      {sections.length > 1 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {sections.map(sec => {
            const isActive = sec.key === currentSecKey;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setCurrentIdx(sec.firstIdx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E85D3F] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-300'
                }`}
              >
                <span>{sec.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {sec.answered}/{sec.total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start pb-12">
        {/* Main Question Card (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Question Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                Câu {currentQ.question_number} / {totalQuestions}
              </span>
              <span className="text-xs font-semibold text-[#E85D3F]">
                {currentQ.part_type === 'listening' ? '🎧 Phần Nghe' : currentQ.part_type === 'writing' ? '✍️ Phần Viết' : '📖 Phần Đọc'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Flag / Bookmark button */}
              <button
                type="button"
                onClick={() => toggleFlagQuestion(currentQ.id)}
                className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isFlagged
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-amber-600'
                }`}
                title="Đánh dấu câu hỏi này để xem lại trước khi nộp"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="text-[11px]">{isFlagged ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
              </button>

              <span className="text-xs text-slate-400 font-medium">
                {currentQ.points} điểm
              </span>
            </div>
          </div>

          {/* Listening audio controller */}
          {currentQ.part_type === 'listening' && (
            <div className="mb-6 p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePlayAudio(currentQ)}
                  disabled={audioPlaying || (!canPlayAudio && examMode === 'simulation')}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shrink-0 ${
                    audioPlaying 
                      ? 'bg-amber-500 animate-pulse' 
                      : !canPlayAudio && examMode === 'simulation'
                      ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-400'
                      : 'bg-[#E85D3F] hover:scale-105 active:scale-95 shadow-md shadow-orange-500/20'
                  }`}
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {audioPlaying 
                      ? 'Đang phát âm thanh...' 
                      : !canPlayAudio && examMode === 'simulation'
                      ? 'Đã hết lượt nghe câu này'
                      : 'Bấm để nghe đoạn ghi âm'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Phát âm giọng phổ thông chuẩn Bắc Kinh • {examMode === 'simulation' ? `Đã nghe ${currentPlays}/${audioLimit} lượt` : 'Luyện tập không giới hạn'}
                  </div>
                </div>
              </div>

              {/* Status badge */}
              <div className="text-xs font-semibold self-end sm:self-center">
                {examMode === 'simulation' ? (
                  <span className={`px-2.5 py-1 rounded-full text-[11px] ${
                    canPlayAudio ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {canPlayAudio ? `Còn ${audioLimit - currentPlays} lượt nghe` : 'Hết lượt nghe'}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                    Nghe lại tự do
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Practice Mode: AudioScript Peek */}
          {examMode === 'practice' && currentQ.part_type === 'listening' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowPracticeScript(prev => !prev)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                {showPracticeScript ? 'Ẩn kịch bản nghe' : '👁️ Xem kịch bản nghe (AudioScript)'}
              </button>
              {showPracticeScript && currentQ.audio_script && (
                <div className="mt-2 p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-200 leading-relaxed animate-in fade-in">
                  <strong className="block mb-1 font-bold text-sky-800 dark:text-sky-300">Lời thoại phát thanh:</strong>
                  <p className="font-medium text-sm">{currentQ.audio_script}</p>
                  {currentQ.translation && <p className="text-slate-500 italic mt-1">Dịch: {currentQ.translation}</p>}
                </div>
              )}
            </div>
          )}

          {/* Audio warning toast */}
          {audioNotice && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{audioNotice}</span>
            </div>
          )}

          {/* Question Prompt */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-2">
              {currentQ.prompt}
            </h2>
            {showPinyinInTaking && currentQ.pinyin && (
              <div className="text-sm font-medium text-sky-600 dark:text-sky-400 mb-1">
                {currentQ.pinyin}
              </div>
            )}
            {examMode === 'practice' && currentQ.translation && (
              <div className="text-xs text-slate-500 italic">
                (Dịch nghĩa: {currentQ.translation})
              </div>
            )}
          </div>

          {/* =========================================================================
              QUESTION TYPE: WORD REORDERING (Sắp xếp từ thành câu — 书写)
          ========================================================================= */}
          {(currentQ.question_type === 'writing_reorder' || currentQ.question_type === 'reorder_sentence' || (currentQ.part_type === 'writing' && (currentQ.scrambledWords || currentQ.words))) && (
            <div className="mb-8">
              <SentenceReorderQuestion
                scrambledWords={currentQ.scrambledWords || currentQ.words || []}
                currentAnswer={answers[currentQ.id]}
                onAnswerChange={(val) => recordAnswerChange(currentQ.id, val)}
                options={currentQ.options}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* =========================================================================
              QUESTION TYPE: SENTENCE ORDER A-B-C (Sắp xếp câu logic A-B-C)
          ========================================================================= */}
          {(currentQ.question_type === 'sentence_order_abc' || currentQ.propositions) && currentQ.propositions && (
            <div className="mb-6 space-y-3">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Đọc 3 mệnh đề sau và sắp xếp theo trình tự mạch lạc logic:
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {['A', 'B', 'C'].map(propKey => (
                  currentQ.propositions[propKey] ? (
                    <div key={propKey} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-[#E85D3F] font-black text-sm flex items-center justify-center shrink-0">
                        {propKey}
                      </span>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pt-0.5">
                        {currentQ.propositions[propKey]}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              QUESTION TYPE: FILL IN THE BLANK (Điền từ/chữ Hán — 书写第二部分)
          ========================================================================= */}
          {currentQ.question_type === 'fill_blank' && (
            <div className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Nhập chữ Hán hoặc từ cần điền vào chỗ trống:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typeof answers[currentQ.id] === 'string' ? answers[currentQ.id] : ''}
                  onChange={(e) => recordAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Gõ chữ Hán vào đây (Ví dụ: 友, 关上)..."
                  className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base text-slate-900 dark:text-white focus:border-[#E85D3F] focus:outline-none"
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-2 italic">
                * Bạn có thể gõ trực tiếp chữ Hán hoặc lựa chọn một trong các phương án trắc nghiệm tương ứng.
              </div>
            </div>
          )}

          {/* =========================================================================
              QUESTION TYPE: FREE WRITING / ESSAY TASK (Viết tự luận theo tranh)
          ========================================================================= */}
          {currentQ.question_type === 'free_writing' && (
            <div className="mb-8 p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  Nhiệm vụ viết câu / đoạn văn tự do
                </span>
                <span className="text-xs text-amber-800 dark:text-amber-300 font-bold">
                  Yêu cầu: {currentQ.min_words || 6} — {currentQ.max_words || 30} chữ Hán
                </span>
              </div>

              {currentQ.required_words && currentQ.required_words.length > 0 && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Từ vựng bắt buộc có trong câu:</span>
                  {currentQ.required_words.map((rw, rwIdx) => (
                    <span key={rwIdx} className="px-2.5 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-[#E85D3F] font-black text-xs">
                      {rw}
                    </span>
                  ))}
                </div>
              )}

              <textarea
                rows={4}
                value={typeof answers[currentQ.id] === 'string' ? answers[currentQ.id] : ''}
                onChange={(e) => recordAnswerChange(currentQ.id, e.target.value)}
                placeholder="Nhập bài viết của bạn bằng chữ Hán tại đây..."
                className="w-full p-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white focus:border-[#E85D3F] focus:outline-none"
              />

              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Số chữ hiện tại: <strong>{(answers[currentQ.id] || '').length}</strong> ký tự</span>
                <span className="italic text-[11px] text-amber-700 dark:text-amber-400">
                  * Bài viết tự luận sẽ được tự đánh giá theo thang tiêu chí & đối chiếu bài mẫu sau khi nộp.
                </span>
              </div>
            </div>
          )}

          {/* Standard Options List (Trắc nghiệm phương án cho các câu không phải dạng Sentence Reorder) */}
          {currentQ.question_type !== 'writing_reorder' && currentQ.question_type !== 'reorder_sentence' && !(currentQ.part_type === 'writing' && (currentQ.scrambledWords || currentQ.words)) && currentQ.options && currentQ.options.length > 0 && (
            <div className="space-y-3 mb-8">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                Chọn phương án trả lời:
              </div>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => recordAnswerChange(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#E85D3F] bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected 
                          ? 'bg-[#E85D3F] text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <div>
                        <div className="font-bold text-base text-slate-900 dark:text-white">
                          {opt.text}
                        </div>
                        {showPinyinInTaking && opt.pinyin && (
                          <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                            {opt.pinyin}
                          </div>
                        )}
                        {examMode === 'practice' && opt.translation && (
                          <div className="text-xs text-slate-500">
                            {opt.translation}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#E85D3F]' : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#E85D3F]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Practice Mode: Instant Pedagogical Explanation */}
          {examMode === 'practice' && (
            <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowPracticeExplanation(prev => !prev)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {showPracticeExplanation ? 'Ẩn gợi ý giải thích' : '💡 Xem gợi ý & giải thích tức thì'}
              </button>
              {showPracticeExplanation && (
                <div className="mt-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed animate-in fade-in">
                  <div className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    Gợi ý phương pháp & ngữ pháp:
                  </div>
                  <div>{currentQ.explanation || 'Hãy phân tích kỹ các thành phần câu và ngữ cảnh để chọn đáp án tối ưu.'}</div>
                  {currentQ.relatedVocab && currentQ.relatedVocab.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-bold">Từ vựng trọng tâm:</span>
                      {currentQ.relatedVocab.map((v, vIdx) => (
                        <span key={vIdx} className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-semibold text-[11px]">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Câu trước
            </button>

            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Câu tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Hoàn tất & Nộp bài <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Palette Drawer (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Bảng câu hỏi ({answeredCount}/{totalQuestions})
            </h3>
          </div>

          {/* Filter tabs on palette */}
          <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold mb-3">
            <button
              type="button"
              onClick={() => setPaletteFilter('all')}
              className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                paletteFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Tất cả ({totalQuestions})
            </button>
            <button
              type="button"
              onClick={() => setPaletteFilter('unanswered')}
              className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                paletteFilter === 'unanswered' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Chưa làm ({totalQuestions - answeredCount})
            </button>
            <button
              type="button"
              onClick={() => setPaletteFilter('flagged')}
              className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                paletteFilter === 'flagged' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              Đánh dấu ({flaggedIds.length})
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 scrollbar-none">
            {exam.questions.map((q, idx) => {
              const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';
              const isCurrent = idx === currentIdx;
              const isFlag = flaggedIds.includes(q.id);

              if (paletteFilter === 'unanswered' && hasAnswer) return null;
              if (paletteFilter === 'flagged' && !isFlag) return null;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center relative transition-all cursor-pointer ${
                    isCurrent 
                      ? 'ring-2 ring-[#E85D3F] ring-offset-2' 
                      : ''
                  } ${
                    hasAnswer
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  } ${
                    isFlag ? 'border-2 border-amber-400' : ''
                  }`}
                >
                  {idx + 1}
                  {isFlag && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"></span>
              <span>Đã trả lời ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-300 dark:bg-slate-700 inline-block"></span>
              <span>Chưa làm ({totalQuestions - answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md border-2 border-amber-400 bg-amber-100 inline-block"></span>
              <span>Đánh dấu xem lại ({flaggedIds.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#E85D3F] flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2">
              Xác nhận nộp bài thi?
            </h3>
            
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span>Tổng số câu:</span>
                <strong>{totalQuestions} câu</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                <span>Đã làm:</span>
                <strong>{answeredCount} câu</strong>
              </div>
              {totalQuestions - answeredCount > 0 && (
                <div className="flex justify-between p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold">
                  <span>Chưa trả lời:</span>
                  <strong>{totalQuestions - answeredCount} câu</strong>
                </div>
              )}
              {flaggedIds.length > 0 && (
                <div className="flex justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                  <span>Đánh dấu xem lại:</span>
                  <strong>{flaggedIds.length} câu</strong>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  executeSubmission();
                }}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-[#E85D3F] text-white font-bold text-xs shadow-md hover:bg-[#CB4529] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Đang chấm điểm...' : 'Đồng ý nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 5. EXAM RESULTS & ANSWER REVIEW VIEW: Báo cáo kết quả & Lời giải chi tiết
// =========================================================================
function HskExamResultView({ attemptId, user, onNavigate }) {
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'incorrect', 'correct'
  const [vocabToast, setVocabToast] = useState(null);

  useEffect(() => {
    getAttemptResult(attemptId).then(data => {
      setAttempt(data);
      setLoading(false);
    });
  }, [attemptId]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-bold">Đang tải kết quả thi...</div>;
  }

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <h3 className="font-bold text-lg mb-4">Không tìm thấy lượt làm bài</h3>
        <button
          onClick={() => onNavigate('exams')}
          className="px-6 py-2 bg-[#E85D3F] text-white rounded-xl text-xs font-bold"
        >
          Về danh sách đề
        </button>
      </div>
    );
  }

  const results = attempt.detailedResults || [];
  const filteredResults = results.filter(r => {
    if (filterMode === 'incorrect') return r.isCorrect === false;
    if (filterMode === 'correct') return r.isCorrect === true;
    return true;
  });

  const handleSaveWrongWordsToFlashcard = () => {
    const wrongQuestions = results.filter(r => !r.isCorrect);
    const wordsToSave = [];
    wrongQuestions.forEach(q => {
      if (q.relatedVocab && Array.isArray(q.relatedVocab)) {
        q.relatedVocab.forEach(v => {
          if (v && typeof v === 'string' && !wordsToSave.includes(v)) {
            wordsToSave.push(v);
          }
        });
      }
    });

    if (wordsToSave.length === 0) {
      wrongQuestions.forEach(q => {
        if (q.prompt && typeof q.prompt === 'string') {
          const match = q.prompt.match(/[\u4e00-\u9fa5]{2,4}/g);
          if (match) {
            match.slice(0, 2).forEach(w => {
              if (!wordsToSave.includes(w)) wordsToSave.push(w);
            });
          }
        }
      });
    }

    if (wordsToSave.length > 0) {
      wordsToSave.forEach(word => {
        saveCustomVocab({
          id: `hsk-mistake-${Date.now()}-${word}`,
          hanzi: word,
          traditional: word,
          pinyin: '',
          hanviet: '',
          meaning: `Từ vựng cần củng cố từ đề ${attempt.examTitle || 'HSK'}`,
          level: attempt.examLevel || 'HSK 1',
          topic: 'Ôn tập câu sai HSK CBT',
          radical: '—',
          strokes: word.length * 6,
          mnemonic: 'Ghi nhớ từ vựng trọng tâm từ đề thi thử HSK.',
          example: {
            hanzi: word,
            pinyin: '',
            meaning: `Trích từ đề thi ${attempt.examTitle || 'HSK'}`
          }
        });
      });
      setVocabToast(`✓ Đã lưu ${wordsToSave.length} từ vựng vào Sổ tay Flashcard!`);
      setTimeout(() => setVocabToast(null), 4000);
    } else {
      setVocabToast('Không có câu làm sai hoặc đã lưu đầy đủ!');
      setTimeout(() => setVocabToast(null), 3000);
    }
  };

  const isEliminated = attempt.cbtScore?.eliminatedByZeroScore || (
    attempt.sectionsBreakdown && Object.values(attempt.sectionsBreakdown).some(s => s.score < 40)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      {/* Top action */}
      <button
        onClick={() => onNavigate('exams')}
        className="text-xs font-bold text-slate-500 hover:text-[#E85D3F] flex items-center gap-1 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đề thi
      </button>

      {/* Toast thông báo lưu từ vựng */}
      {vocabToast && (
        <div className="mb-4 p-3.5 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-300 text-sky-900 dark:text-sky-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>{vocabToast}</span>
          <button onClick={() => setVocabToast(null)} className="text-sky-700 hover:text-sky-950 font-black">✕</button>
        </div>
      )}

      {/* Main Score Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-8 text-center relative overflow-hidden">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${
          attempt.passed 
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
        }`}>
          {isEliminated 
            ? '⚠️ BỊ ĐIỂM LIỆT KỸ NĂNG (< 40/100)'
            : attempt.passed 
            ? '🎉 CHÚC MỪNG! BẠN ĐÃ ĐẠT CHUẨN HSK' 
            : '⚠️ CẦN CỐ GẮNG THÊM (CHƯA ĐẠT CHUẨN)'}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
          {attempt.examTitle}
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Thời gian làm bài: {Math.round(attempt.timeSpentSeconds / 60)} phút • Chế độ: {attempt.examMode === 'simulation' ? 'Phòng thi CBT tính giờ' : 'Luyện tập tự do'} • Hoàn thành ngày {new Date(attempt.createdAt).toLocaleDateString('vi-VN')}
        </p>

        {/* Score Ring / Digits */}
        <div className="inline-block p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 mb-4 border border-slate-100 dark:border-slate-800">
          <div className="text-4xl sm:text-5xl font-black text-[#E85D3F]">
            {attempt.score} <span className="text-xl text-slate-400 font-bold">/ {attempt.maxScore}</span>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-2">
            Thang điểm chuẩn Quốc tế • Điểm chuẩn đậu: <strong className="text-slate-800 dark:text-slate-200">{attempt.passingScore}đ</strong> (Độ chính xác: {attempt.accuracyPercentage}%)
          </div>
        </div>

        {/* Elimination Notice Banner if any skill < 40 */}
        {isEliminated && (
          <div className="max-w-xl mx-auto mb-6 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-center gap-2 font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Quy chế khảo thí: Thí sinh có kỹ năng dưới 40/100 điểm bị tính điểm liệt và không được công nhận đạt chứng chỉ HSK.</span>
          </div>
        )}

        {/* Official CBT Section Breakdown Cards (Nghe - Đọc - Viết) */}
        {attempt.sectionsBreakdown && Object.keys(attempt.sectionsBreakdown).length > 0 && (
          <div className="max-w-2xl mx-auto my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(attempt.sectionsBreakdown).map(([secKey, secData]) => {
              const secElim = secData.score < 40;
              const title = secKey === 'listening' ? '🎧 Nghe hiểu (听力)' : secKey === 'reading' ? '📖 Đọc hiểu (阅读)' : '✍️ Viết (书写)';
              return (
                <div 
                  key={secKey}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    secElim
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {title}
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className={`text-2xl font-black ${secElim ? 'text-rose-600' : 'text-[#E85D3F]'}`}>
                      {secData.score}
                      <span className="text-xs text-slate-400 font-bold"> / 100đ</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {secData.correct}/{secData.total} câu
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-1.5">
                    <div 
                      className={`h-full rounded-full ${secElim ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min(100, secData.score)}%` }}
                    />
                  </div>
                  {secElim ? (
                    <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      ⚠️ Điểm liệt (&lt; 40đ)
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Đạt yêu cầu
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer Banner: Honest scoring notice */}
        <div className="max-w-xl mx-auto mb-6 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {attempt.disclaimer || 'Điểm số luyện tập mô phỏng theo chuẩn CTI của HanziGo, không thay thế chứng chỉ khảo thí chính thức.'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-center text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
            <div className="text-emerald-700 dark:text-emerald-400 font-bold">Câu đúng</div>
            <div className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
              {attempt.correctCount}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30">
            <div className="text-rose-700 dark:text-rose-400 font-bold">Câu sai</div>
            <div className="text-xl font-black text-rose-800 dark:text-rose-300 mt-1">
              {attempt.incorrectCount}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500 font-bold">Bỏ qua</div>
            <div className="text-xl font-black text-slate-700 dark:text-slate-300 mt-1">
              {attempt.unansweredCount}
            </div>
          </div>
          {attempt.subjectiveCount > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 col-span-3 sm:col-span-1">
              <div className="text-amber-700 dark:text-amber-400 font-bold">Tự luận</div>
              <div className="text-xl font-black text-amber-800 dark:text-amber-300 mt-1">
                {attempt.subjectiveCount}
              </div>
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            onClick={() => onNavigate('take', attempt.examId)}
            className="px-6 py-3 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md hover:bg-[#CB4529] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Làm lại đề thi này
          </button>
          {attempt.incorrectCount > 0 && (
            <button
              onClick={() => setFilterMode('incorrect')}
              className="px-6 py-3 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              Xem lại {attempt.incorrectCount} câu làm sai
            </button>
          )}
          {attempt.incorrectCount > 0 && (
            <button
              onClick={handleSaveWrongWordsToFlashcard}
              className="px-6 py-3 rounded-xl border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-200 text-xs font-bold hover:bg-sky-100 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-600" /> Lưu từ vựng câu làm sai vào Sổ tay Flashcard
            </button>
          )}
          <button
            onClick={() => onNavigate('mistakes')}
            className="px-6 py-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookMarked className="w-4 h-4" /> Vào sổ tay câu sai
          </button>
          {/* Phase 12: Certificate graduation prompt when scoring >= 80% */}
          {(attempt.accuracyPercentage >= 80 || attempt.passed) && (
            <button
              onClick={() => {
                window.location.hash = '#profile';
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white text-xs font-black shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" /> Kiểm tra & Nhận Chứng Nhận HSK ✨
            </button>
          )}
          <button
            onClick={() => {
              window.location.hash = `#materials?level=${attempt.examLevel || 'HSK 1'}&category=hsk_preparation`;
            }}
            className="px-6 py-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-600" /> Ôn tập trong Thư viện tài nguyên
          </button>
        </div>
      </div>


      {/* Phân tích kỹ năng */}
      {attempt.skillBreakdown && Object.keys(attempt.skillBreakdown).length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#E85D3F]" />
            Đánh giá theo từng phần kỹ năng
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(attempt.skillBreakdown).map(([k, s]) => {
              const pct = s.totalQuestions > 0 ? Math.round((s.correctQuestions / s.totalQuestions) * 100) : 0;
              return (
                <div key={k} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="text-[#E85D3F]">{s.correctQuestions}/{s.totalQuestions} câu ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${pct >= 60 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Sư phạm Chẩn đoán lỗi bài làm */}
      {attempt.incorrectCount > 0 && (
        <HskAiDiagnosticPanel
          mistakes={(attempt.detailedResults || []).filter(r => !r.isCorrect)}
          attempts={[attempt]}
          user={user}
          onNavigate={onNavigate}
        />
      )}

      {/* Answer Review Filter & List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl text-slate-900 dark:text-white">
            Chi tiết lời giải từng câu hỏi ({filteredResults.length})
          </h3>

          {/* Filter tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              Tất cả ({results.length})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Câu sai ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Câu đúng ({attempt.correctCount})
            </button>
          </div>
        </div>

        {/* Detailed Questions List */}
        {filteredResults.map(q => (
          <div 
            key={q.questionId}
            className={`p-6 rounded-3xl border-2 bg-white dark:bg-slate-900 transition-all ${
              q.isSubjective
                ? 'border-amber-200 dark:border-amber-950/60'
                : q.isCorrect 
                ? 'border-emerald-200 dark:border-emerald-950/60' 
                : 'border-rose-200 dark:border-rose-950/60 shadow-xs'
            }`}
          >
            {/* Question head */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${
                  q.isSubjective
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : q.isCorrect 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {q.isSubjective ? (
                    '✍️ Tự luận (Đối chiếu tự chấm)'
                  ) : q.isCorrect ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Câu {q.questionNumber}: Đúng</>
                  ) : (
                    <><XCircle className="w-3.5 h-3.5" /> Câu {q.questionNumber}: Sai</>
                  )}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {q.partType === 'listening' ? '🎧 Nghe hiểu' : q.partType === 'writing' ? '✍️ Viết' : '📖 Đọc hiểu'}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                +{q.pointsAwarded}/{q.points} điểm
              </span>
            </div>

            {/* Prompt */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.prompt}
                  </h4>
                  {q.pinyin && <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1">{q.pinyin}</div>}
                  {q.translation && <div className="text-xs text-slate-500 italic mt-0.5">{q.translation}</div>}
                </div>

                {q.partType === 'listening' && (
                  <button
                    onClick={() => speakChinese(q.audio_script || q.prompt)}
                    className="p-2.5 rounded-xl bg-orange-100 text-[#E85D3F] hover:bg-orange-200 flex-shrink-0 transition-colors cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {q.audio_script && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Lời thoại phát thanh:</span> {q.audio_script}
                </div>
              )}
            </div>

            {/* Sub-format review: Reorder Sentence result */}
            {q.questionType === 'reorder_sentence' && (
              <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-500">Câu của bạn:</span>{' '}
                  <span className={q.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                    {Array.isArray(q.userAnswer) ? q.userAnswer.join(' ') : (q.options?.[q.selectedIndex]?.text || q.userAnswer || 'Chưa làm')}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Trật tự chuẩn xác:</span>{' '}
                  <span className="text-emerald-600 font-bold">
                    {q.correctSentence || (q.correctOrder || []).join(' ') || q.options?.[q.correctIndex]?.text}
                  </span>
                </div>
              </div>
            )}

            {/* Sub-format review: Free Writing with Rubric */}
            {q.isSubjective && (
              <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-3">
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-200">Bài làm của bạn:</span>
                  <div className="mt-1 p-3 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 italic">
                    {q.userAnswer ? String(q.userAnswer) : '(Chưa điền câu trả lời)'}
                  </div>
                </div>

                {q.sampleAnswer && (
                  <div>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">Bài mẫu tham khảo đạt điểm tối đa:</span>
                    <div className="mt-1 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium">
                      {q.sampleAnswer}
                    </div>
                  </div>
                )}

                {q.writingCriteria && q.writingCriteria.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Thang tiêu chí tự đánh giá (Rubric):
                    </span>
                    <div className="space-y-1">
                      {q.writingCriteria.map((crit, crIdx) => (
                        <div key={crIdx} className="flex justify-between items-center text-[11px] p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-700 dark:text-slate-300">• {crit.name}</span>
                          <span className="font-bold text-amber-600">Trọng số: {crit.weight}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-amber-800 dark:text-amber-300 italic">
                  * HanziGo không chấm bài viết tự do bằng quy tắc đơn giản. Vui lòng đối chiếu với bài mẫu và tiêu chí trên.
                </div>
              </div>
            )}

            {/* Options review */}
            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {q.options.map((opt, oIdx) => {
                  const isSelectedByUser = q.selectedIndex === oIdx;
                  const isCorrectOption = q.correctIndex === oIdx;
                  return (
                    <div
                      key={oIdx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        isCorrectOption
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                          : isSelectedByUser && !isCorrectOption
                          ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div>
                        <span className="mr-2 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt.text}</span>
                        {opt.translation && <span className="text-slate-400 font-normal ml-1">({opt.translation})</span>}
                      </div>
                      {isCorrectOption && <span className="text-emerald-600 font-bold">✓ Đáp án đúng</span>}
                      {isSelectedByUser && !isCorrectOption && <span className="text-rose-600 font-bold">✗ Bạn đã chọn</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Detailed Explanation */}
            {q.explanation && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <strong className="text-amber-900 dark:text-amber-300 font-bold block mb-1">
                  💡 Lời giải chi tiết:
                </strong>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// =========================================================================
// 6. PHASE 2 SUB-NAVIGATION HEADER & CLOUD SYNC BANNER
// =========================================================================
function HskSubNavHeader({ currentView, user, onNavigate, onOpenAdmin }) {
  const [unmergedCount, setUnmergedCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hanzigo_hsk_attempts');
      if (raw) {
        const list = JSON.parse(raw);
        const unmerged = list.filter(a => !a.userId).length;
        setUnmergedCount(unmerged);
      }
    } catch {}
  }, [user]);

  const handleSyncLocalData = async () => {
    if (!user) return;
    setSyncing(true);
    const res = await mergeLocalAttemptsToUser(user.id);
    setSyncing(false);
    if (res.success) {
      setUnmergedCount(0);
      setSyncNotice(`Đã đồng bộ thành công ${res.mergedCount} lượt thi vào tài khoản của bạn!`);
      setTimeout(() => setSyncNotice(null), 5000);
    } else {
      setSyncNotice('Có lỗi khi đồng bộ dữ liệu.');
    }
  };

  const isAdmin = Boolean(user && (user.role === 'admin' || user.isAdmin === true));

  const navItems = [
    { id: 'exams', label: 'Đề thi HSK', icon: BookOpen, view: 'exams', active: currentView === 'home' || currentView === 'exams' || currentView === 'exam_detail' },
    { id: 'structure', label: 'Cấu trúc đề thi', icon: ShieldCheck, view: 'structure', active: currentView === 'structure' },
    { id: 'resources', label: 'Kho tài liệu & Đề mẫu', icon: Layers, view: 'resources', active: currentView === 'resources' },
    { id: 'history', label: 'Lịch sử thi', icon: Clock, view: 'history', active: currentView === 'history' },
    { id: 'mistakes', label: 'Sổ tay câu sai', icon: BookMarked, view: 'mistakes', active: currentView === 'mistakes' },
    { id: 'analytics', label: 'Báo cáo & Khuyến nghị', icon: BarChart2, view: 'analytics', active: currentView === 'analytics' },
  ];

  return (
    <div className="border-b border-amber-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Module Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.view)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    item.active
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-amber-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sync & Account State */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                  <UserCheck className="w-3.5 h-3.5 mr-1" />
                  Đã kết nối tài khoản
                </span>
                {unmergedCount > 0 && (
                  <button
                    onClick={handleSyncLocalData}
                    disabled={syncing}
                    className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>Đồng bộ {unmergedCount} bài thi</span>
                  </button>
                )}
                {isAdmin && onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer text-xs"
                    title="Quản trị nội dung & Thẩm định đề thi"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Quản trị</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/40 text-[11px] sm:text-xs">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Chế độ Khách (Lưu trên máy này)</span>
              </div>
            )}
          </div>
        </div>

        {/* Sync Toast Notification */}
        {syncNotice && (
          <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
            <span>{syncNotice}</span>
            <button onClick={() => setSyncNotice(null)} className="font-bold ml-2">×</button>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 7. PHASE 2 VIEW: LỊCH SỬ THI & SO SÁNH TIẾN ĐỘ
// =========================================================================
function HskHistoryView({ user, onNavigate }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareError, setCompareError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserExamHistory({ user }).then(data => {
      setAttempts(data);
      setLoading(false);
    });
  }, [user]);

  const filteredAttempts = useMemo(() => {
    if (levelFilter === 'all') return attempts;
    return attempts.filter(a => a.examLevel?.toLowerCase() === levelFilter.toLowerCase());
  }, [attempts, levelFilter]);

  const toggleSelectAttempt = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
    setCompareError(null);
  };

  const handleExecuteComparison = () => {
    if (selectedIds.length !== 2) {
      setCompareError('Vui lòng chọn chính xác 2 lượt làm bài để đối chiếu.');
      return;
    }

    const attA = attempts.find(a => a.id === selectedIds[0]);
    const attB = attempts.find(a => a.id === selectedIds[1]);

    if (!attA || !attB) {
      setCompareError('Không tìm thấy thông tin lượt thi đã chọn.');
      return;
    }

    const result = compareExamAttempts(attA, attB);
    if (!result.compatible) {
      setCompareError(result.reason);
      return;
    }

    setComparisonResult(result);
    setCompareError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-amber-500" />
            Lịch Sử Làm Bài & Tiến Độ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi tất cả bài thi bạn đã hoàn thành và so sánh để thấy rõ sự tiến bộ qua từng đợt luyện.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {attempts.length >= 2 && (
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedIds([]);
                setCompareError(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                compareMode 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{compareMode ? 'Hủy chế độ so sánh' : 'So sánh 2 lần thi'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('exams')}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer flex items-center space-x-1"
          >
            <BookOpen className="w-4 h-4" />
            <span>Làm đề mới</span>
          </button>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'HSK 1', 'HSK 2', 'HSK 3'].map(lvl => (
          <button
            key={lvl}
            onClick={() => setLevelFilter(lvl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              levelFilter === lvl
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {lvl === 'all' ? 'Tất cả cấp độ' : lvl}
          </button>
        ))}
      </div>

      {/* Compare Mode Notice Banner */}
      {compareMode && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              Chọn 2 lượt thi của <strong>cùng một đề thi</strong> để đối chiếu điểm số và độ chính xác (Đã chọn: {selectedIds.length}/2).
            </span>
          </div>
          {selectedIds.length === 2 && (
            <button
              onClick={handleExecuteComparison}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Xem kết quả so sánh
            </button>
          )}
        </div>
      )}

      {/* Compare Error Notice */}
      {compareError && (
        <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{compareError}</span>
        </div>
      )}

      {/* Attempts List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang tải lịch sử bài làm...</p>
        </div>
      ) : filteredAttempts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
          <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Chưa có lượt thi nào</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Hãy bắt đầu thử sức với các đề thi HSK chuẩn mẫu để hệ thống ghi nhận lịch sử và phân tích năng lực.
          </p>
          <button
            onClick={() => onNavigate('exams')}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
          >
            Làm bài thi đầu tiên ngay
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAttempts.map(att => {
            const isSelected = selectedIds.includes(att.id);
            const formattedDate = att.createdAt 
              ? new Date(att.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
              : 'Gần đây';

            return (
              <div
                key={att.id}
                onClick={() => {
                  if (compareMode) toggleSelectAttempt(att.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-amber-300'
                } ${compareMode ? 'cursor-pointer' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start space-x-3">
                    {compareMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectAttempt(att.id)}
                        className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold">
                          {att.examLevel}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          att.passed
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                        }`}>
                          {att.passed ? '✓ Đạt' : '✗ Chưa đạt'}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {formattedDate}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {att.examTitle || att.examId}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>Đúng: <strong>{att.correctCount || 0}</strong>/{att.totalQuestions || 20} câu</span>
                        <span>•</span>
                        <span>Thời gian: <strong>{Math.floor((att.timeSpentSeconds || 0) / 60)}p {(att.timeSpentSeconds || 0) % 60}s</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores & Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {att.score} <span className="text-xs font-normal text-slate-400">/ {att.maxScore}</span>
                      </div>
                      <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {att.accuracyPercentage}% chính xác
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('result', att.id);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('take', att.examId);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        Thi lại
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Modal */}
      {comparisonResult && (
        <AttemptComparisonModal
          comparison={comparisonResult}
          onClose={() => setComparisonResult(null)}
          onReviewAttempt={(id) => onNavigate('result', id)}
        />
      )}
    </div>
  );
}

// =========================================================================
// 8. ATTEMPT COMPARISON MODAL (SO SÁNH 2 LẦN THI ĐỐI CHIẾU)
// =========================================================================
function AttemptComparisonModal({ comparison, onClose, onReviewAttempt }) {
  const { baseline, target, metrics, skillsDelta, examTitle, examLevel } = comparison;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              {examLevel} • Đối chiếu 2 lần thi
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {examTitle}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* Head-to-Head Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
          {/* Baseline */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Lần thi trước</span>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {baseline.score} <span className="text-xs text-slate-400">/{baseline.maxScore}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Độ chính xác: {baseline.accuracyPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {new Date(baseline.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* Delta Progression */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-center items-center text-center ${
            metrics.improved
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {metrics.improved ? 'Tiến bộ' : 'Cần cải thiện'}
            </span>
            <div className="text-2xl font-black mt-1 flex items-center space-x-1">
              {metrics.improved ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-rose-600" />}
              <span>{metrics.scoreDelta >= 0 ? `+${metrics.scoreDelta}` : metrics.scoreDelta} điểm</span>
            </div>
            <div className="text-xs font-semibold mt-0.5">
              {metrics.accuracyDelta >= 0 ? `+${metrics.accuracyDelta}%` : `${metrics.accuracyDelta}%`} chính xác
            </div>
            <div className="text-[11px] opacity-80 mt-1">
              {metrics.timeDeltaSeconds < 0 
                ? `Nhanh hơn ${Math.abs(metrics.timeDeltaSeconds)} giây` 
                : `Thêm ${metrics.timeDeltaSeconds} giây`}
            </div>
          </div>

          {/* Target */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider block">Lần thi sau</span>
            <div className="text-2xl font-extrabold text-indigo-950 dark:text-indigo-200 mt-1">
              {target.score} <span className="text-xs text-slate-400">/{target.maxScore}</span>
            </div>
            <div className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
              Độ chính xác: {target.accuracyPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {new Date(target.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Skill-by-skill Breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Đối chiếu chi tiết theo từng kỹ năng:
          </h4>
          <div className="space-y-2.5">
            {Object.entries(skillsDelta).map(([key, s]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                  <span className="text-slate-400 ml-2">
                    Lần 1: {s.baselinePoints}đ ➔ Lần 2: {s.targetPoints}đ
                  </span>
                </div>
                <div className={`font-bold ${s.pointsDelta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {s.pointsDelta >= 0 ? `+${s.pointsDelta}đ` : `${s.pointsDelta}đ`} ({s.accuracyDelta >= 0 ? `+${s.accuracyDelta}%` : `${s.accuracyDelta}%`})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => onReviewAttempt(baseline.id)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Xem lại Lần 1
            </button>
            <button
              onClick={() => onReviewAttempt(target.id)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Xem lại Lần 2
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer w-full sm:w-auto"
          >
            Đóng bảng đối chiếu
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 9. PHASE 2 VIEW: SỔ TAY CÂU HỎI SAI (MISTAKE REVIEW NOTEBOOK)
// =========================================================================
function HskMistakesView({ user, onNavigate }) {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'needs_review', 'mastered'
  const [levelFilter, setLevelFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionId, setActionId] = useState(null);

  const loadMistakes = () => {
    setLoading(true);
    getMistakeNotebook({ 
      user, 
      level: levelFilter, 
      skill: skillFilter, 
      status: statusFilter, 
      search: searchQuery 
    }).then(data => {
      setMistakes(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadMistakes();
  }, [user, statusFilter, levelFilter, skillFilter, searchQuery]);

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'mastered' ? 'needs_review' : 'mastered';
    setActionId(item.id);
    await updateMistakeStatus(item.id, nextStatus, user);
    setActionId(null);
    loadMistakes();
  };

  const handleRemove = async (item) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này khỏi sổ tay câu sai?')) return;
    setActionId(item.id);
    await removeMistakeItem(item.id, user);
    setActionId(null);
    loadMistakes();
  };

  const unmasteredCount = mistakes.filter(m => m.status === 'needs_review').length;
  const masteredCount = mistakes.filter(m => m.status === 'mastered').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-7 h-7 text-amber-500" />
            Sổ Tay Câu Hỏi Sai & Bẫy Đề
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nơi tập hợp tự động các câu bạn làm sai hoặc chưa chắc chắn. Ôn luyện tập trung để không lặp lại lỗi sai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.location.hash = '#materials?category=grammar';
            }}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tra cứu ngữ pháp</span>
          </button>
          {unmasteredCount > 0 && (
            <button
              onClick={() => {
                // Khởi chạy bài thi từ câu sai
                onNavigate('take', 'hsk1-mock-01'); // fallback to active mock exam
              }}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Luyện {unmasteredCount} câu sai ngay</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{mistakes.length}</div>
            <div className="text-xs text-slate-500">Tổng số câu trong sổ tay</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-rose-600">{unmasteredCount}</div>
            <div className="text-xs text-slate-500">Cần ôn lại (Chưa thành thạo)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600">{masteredCount}</div>
            <div className="text-xs text-slate-500">Đã hiểu & thành thạo</div>
          </div>
        </div>
      </div>

      {/* AI Sư phạm: Chẩn đoán lỗi sai sổ tay */}
      {mistakes.length > 0 && (
        <HskAiDiagnosticPanel
          mistakes={mistakes}
          user={user}
          onNavigate={onNavigate}
        />
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm Chữ Hán, Pinyin hoặc nghĩa tiếng Việt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Level Dropdown */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="HSK 1">HSK 1</option>
            <option value="HSK 2">HSK 2</option>
            <option value="HSK 3">HSK 3</option>
          </select>

          {/* Skill Dropdown */}
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="listening">Nghe hiểu</option>
            <option value="reading">Đọc hiểu</option>
            <option value="writing">Viết</option>
          </select>
        </div>

        {/* Status Tab Pills */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 mr-2">Trạng thái:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'needs_review', label: '🔴 Cần ôn lại' },
            { id: 'mastered', label: '🟢 Đã hiểu' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mistakes Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang tải sổ tay câu sai...</p>
        </div>
      ) : mistakes.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
          <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Không có câu hỏi sai nào trong bộ lọc</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Rất tốt! Bạn không có câu sai tồn đọng nào hoặc tất cả câu hỏi đã được đánh dấu Đã hiểu.
          </p>
          <button
            onClick={() => onNavigate('exams')}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
          >
            Thử sức đề thi mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map(item => {
            const isMastered = item.status === 'mastered';
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  isMastered 
                    ? 'border-emerald-200 dark:border-emerald-950/60 opacity-80' 
                    : 'border-slate-200/90 dark:border-slate-800 shadow-xs'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold">
                      {item.level}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                      {item.category || (item.partType === 'listening' ? 'Nghe hiểu' : 'Đọc hiểu')}
                    </span>
                    {item.mistakeCount > 1 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
                        Đã sai {item.mistakeCount} lần
                      </span>
                    )}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isMastered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}>
                    {isMastered ? '✓ Đã hiểu' : '● Cần ôn lại'}
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                      {item.prompt}
                    </h3>
                    {item.pinyin && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                        {item.pinyin}
                      </div>
                    )}
                    {item.translation && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                        {item.translation}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => speakChinese(item.prompt)}
                    className="p-2 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Options Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                  {item.options?.map((opt, idx) => {
                    const isCorrect = idx === item.correctAnswerIndex;
                    const isUserChoice = idx === item.userAnswerIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold'
                            : isUserChoice
                            ? 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 line-through'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div>
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrect && <span className="text-emerald-600 text-[11px] font-bold">✓ Đáp án đúng</span>}
                        {isUserChoice && !isCorrect && <span className="text-rose-600 text-[11px] font-bold">✗ Bạn đã chọn</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Pedagogical Explanation */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs leading-relaxed text-slate-700 dark:text-slate-300 my-3">
                  <strong className="text-amber-900 dark:text-amber-300 block mb-0.5 font-bold">
                    💡 Phân tích bẫy sai & Lời giải:
                  </strong>
                  {item.explanation || 'Chưa có lời giải chi tiết cho câu hỏi này.'}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    Nguồn: {item.examTitle || item.examId}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      disabled={actionId === item.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                        isMastered
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isMastered ? 'Đổi sang Cần ôn' : 'Đánh dấu Đã hiểu'}</span>
                    </button>

                    <button
                      onClick={() => handleRemove(item)}
                      disabled={actionId === item.id}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Xóa câu hỏi khỏi sổ tay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 10. PHASE 2 VIEW: BÁO CÁO TIẾN ĐỘ & KHUYẾN NGHỊ HỌC TẬP THÔNG MINH
// =========================================================================
function HskAnalyticsView({ user, onNavigate, setActiveTab }) {
  const [attempts, setAttempts] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUserExamHistory({ user }),
      getMistakeNotebook({ user })
    ]).then(([attData, mstData]) => {
      setAttempts(attData);
      setMistakes(mstData);
      setLoading(false);
    });
  }, [user]);

  const analytics = useMemo(() => {
    return generateStudyAnalytics(attempts, mistakes);
  }, [attempts, mistakes]);

  const recommendations = useMemo(() => {
    return generateStudyRecommendations(analytics, mistakes);
  }, [analytics, mistakes]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="w-7 h-7 text-amber-500" />
          Báo Cáo Tiến Độ & Khuyến Nghị Học Tập
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hệ thống phân tích năng lực chuẩn xác dựa trên kết quả các bài thi thử bạn đã hoàn thành.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang tổng hợp báo cáo phân tích...</p>
        </div>
      ) : (
        <>
          {/* Data Honesty Banner */}
          <div className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm flex items-start space-x-3 border ${
            analytics.dataStatus === 'no_data'
              ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              : analytics.dataStatus === 'insufficient'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}>
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">
                {analytics.dataStatus === 'no_data' 
                  ? 'Chưa có dữ liệu bài thi' 
                  : analytics.dataStatus === 'insufficient' 
                  ? 'Dữ liệu đang thu thập (Chưa đủ 3 đề thi)' 
                  : 'Dữ liệu đo lường tin cậy'}
              </strong>
              <span>{analytics.message}</span>
            </div>
          </div>

          {/* 4 Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Đề hoàn thành</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {analytics.totalExams}
              </div>
              <div className="text-xs text-slate-500 mt-1">Tổng câu: {analytics.totalQuestions}</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tỷ lệ đỗ kỳ thi</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                {analytics.passRate}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Chuẩn HSK: &gt;= 60%</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Độ chính xác</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
                {analytics.overallAccuracy}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Đúng: {analytics.totalCorrect} câu</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Thời gian tích lũy</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
                {analytics.totalTimeMinutes} <span className="text-xs font-normal text-slate-400">phút</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Luyện thi thực chiến</div>
            </div>
          </div>

          {/* Skill Accuracy & Level Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Skills Progress */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Độ chính xác theo Kỹ năng
              </h3>

              <div className="space-y-4">
                {Object.entries(analytics.skillsAccuracy).map(([key, s]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">
                        {s.accuracy}% ({s.correct}/{s.total} câu)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          s.accuracy >= 80 ? 'bg-emerald-500' : s.accuracy >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(s.accuracy, 2))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Performance & Frequently Missed */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                Các dạng câu hỏi cần chú ý nhất
              </h3>

              {analytics.frequentlyMissedCategories.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Chưa ghi nhận lỗi sai định kỳ nào trong sổ tay.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {analytics.frequentlyMissedCategories.map((cat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {cat.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold text-[11px]">
                        Làm sai {cat.count} lần
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Sư phạm: Chẩn đoán toàn diện kỹ năng & khắc phục lỗi */}
          <HskAiDiagnosticPanel
            mistakes={mistakes}
            attempts={attempts}
            user={user}
            onNavigate={onNavigate}
          />

          {/* Deterministic Study Recommendations */}
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-500" />
              Khuyến Nghị Học Tập Dựa Trên Dữ Liệu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(rec => (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold mb-2 inline-block ${
                      rec.priority === 'high'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : rec.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                    }`}>
                      {rec.badge}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {rec.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (rec.targetTab === 'hsk' && rec.subRoute) {
                        onNavigate(rec.subRoute);
                      } else if (setActiveTab && rec.targetTab) {
                        setActiveTab(rec.targetTab);
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer self-start flex items-center space-x-1"
                  >
                    <span>{rec.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

