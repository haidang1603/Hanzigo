import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Download, 
  Send, 
  HelpCircle, 
  TrendingUp,
  RefreshCw,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  analyzeClassWithAi, 
  generateAssignmentWithAi, 
  generateLessonPlanWithAi 
} from '../../services/teacherAiService.js';
import { playClickSound, playSuccessSound } from '../../utils/audio.js';

export default function AiTeacherStudioModal({
  isOpen,
  onClose,
  initialTab = 'analysis', // 'analysis' | 'assignment' | 'lesson_plan'
  classrooms = [],
  currentClassId = null,
  analyticsData = null,
  onPublishAssignment = null,
  onSaveLessonPlanToMaterials = null,
  showToast = () => {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Selected Class
  const [selectedClassId, setSelectedClassId] = useState(currentClassId || classrooms[0]?.id || '');
  const activeClass = classrooms.find(c => c.id === selectedClassId) || classrooms[0] || null;

  // -------------------------------------------------------------
  // 1. AI CLASS ANALYSIS STATE
  // -------------------------------------------------------------
  const [analyzingClass, setAnalyzingClass] = useState(false);
  const [classAnalysisResult, setClassAnalysisResult] = useState(null);

  const handleRunClassAnalysis = async () => {
    playClickSound();
    setAnalyzingClass(true);
    try {
      const payload = {
        totalStudents: analyticsData?.totalStudents || 10,
        hskLevel: activeClass?.hsk_level || 'HSK 1',
        averageScore: analyticsData?.averageScore || 75,
        assignmentCompletion: analyticsData?.assignmentCompletion || 70,
        attendanceRate: analyticsData?.attendanceRate || 80,
        skillBreakdown: analyticsData?.skillBreakdown || { listening: 70, speaking: 65, reading: 75, writing: 60 }
      };

      const result = await analyzeClassWithAi(payload);
      setClassAnalysisResult(result);
      playSuccessSound();
      showToast('🤖 AI đã hoàn tất phân tích sư phạm cho lớp học!');
    } catch (err) {
      showToast(err.message || 'Lỗi khi phân tích lớp học.');
    } finally {
      setAnalyzingClass(false);
    }
  };

  // -------------------------------------------------------------
  // 2. AI ASSIGNMENT GENERATOR STATE (MANDATORY REVIEW STEP)
  // -------------------------------------------------------------
  const [asgHskLevel, setAsgHskLevel] = useState(activeClass?.hsk_level || 'HSK 1');
  const [asgTopic, setAsgTopic] = useState('Du lịch & Hỏi đường');
  const [asgQuestionCount, setAsgQuestionCount] = useState(5);
  const [asgType, setAsgType] = useState('Quiz');
  const [generatingAsg, setGeneratingAsg] = useState(false);
  
  // Draft assignment questions that MUST be reviewed by teacher
  const [draftQuestions, setDraftQuestions] = useState(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [asgReviewed, setAsgReviewed] = useState(false);

  const handleGenerateAssignment = async () => {
    playClickSound();
    setGeneratingAsg(true);
    try {
      const result = await generateAssignmentWithAi({
        hskLevel: asgHskLevel,
        topic: asgTopic,
        questionCount: asgQuestionCount,
        assignmentType: asgType
      });

      setDraftQuestions(result.questions || []);
      setDraftTitle(`Bài tập ${asgHskLevel}: ${asgTopic}`);
      setAsgReviewed(false);
      playSuccessSound();
      showToast('Đã tạo bản nháp đề bài! Vui lòng KIỂM DUYỆT trước khi giao cho học sinh.');
    } catch (err) {
      showToast(err.message || 'Lỗi khi tạo bài tập bằng AI.');
    } finally {
      setGeneratingAsg(false);
    }
  };

  // Teacher edits question
  const handleEditQuestionText = (index, newText) => {
    setDraftQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], question: newText };
      return updated;
    });
  };

  // Teacher edits option
  const handleEditOption = (qIdx, optIdx, newOpt) => {
    setDraftQuestions(prev => {
      const updated = [...prev];
      const newOptions = [...updated[qIdx].options];
      newOptions[optIdx] = newOpt;
      updated[qIdx] = { ...updated[qIdx], options: newOptions };
      return updated;
    });
  };

  // Teacher sets correct answer
  const handleSetCorrectAnswer = (qIdx, optIdx) => {
    setDraftQuestions(prev => {
      const updated = [...prev];
      updated[qIdx] = { ...updated[qIdx], correctAnswer: optIdx };
      return updated;
    });
  };

  // Teacher deletes a question
  const handleDeleteDraftQuestion = (qIdx) => {
    setDraftQuestions(prev => prev.filter((_, idx) => idx !== qIdx));
  };

  // Teacher approves and publishes assignment
  const handleApproveAndPublish = async () => {
    if (!draftQuestions || draftQuestions.length === 0) {
      showToast('Bộ đề cần có ít nhất 1 câu hỏi.');
      return;
    }

    if (!selectedClassId) {
      showToast('Vui lòng chọn lớp học để giao bài.');
      return;
    }

    if (!window.confirm(`Xác nhận duyệt và giao bài tập "${draftTitle}" (${draftQuestions.length} câu) cho lớp học?`)) {
      return;
    }

    if (onPublishAssignment) {
      await onPublishAssignment({
        classroomId: selectedClassId,
        title: draftTitle,
        description: `Bài tập do AI hỗ trợ soạn thảo và đã được Giáo viên kiểm duyệt • Chủ đề: ${asgTopic}`,
        hskLevel: asgHskLevel,
        contentType: 'Quiz',
        questions: draftQuestions
      });
      playSuccessSound();
      showToast('🎉 Đã chính thức duyệt và xuất bản bài tập cho học viên!');
      setDraftQuestions(null);
    }
  };

  // -------------------------------------------------------------
  // 3. AI LESSON PLAN STATE (GIÁO ÁN THỰC CHIẾN)
  // -------------------------------------------------------------
  const [lpTopic, setLpTopic] = useState('Đi mua sắm và mặc cả tại chợ Bắc Kinh');
  const [lpHskLevel, setLpHskLevel] = useState(activeClass?.hsk_level || 'HSK 1');
  const [lpDuration, setLpDuration] = useState(45);
  const [lpOutcomes, setLpOutcomes] = useState('Nắm được 5 từ vựng mua sắm và mẫu câu hỏi giá');
  const [generatingLp, setGeneratingLp] = useState(false);
  const [lessonPlanResult, setLessonPlanResult] = useState(null);

  const handleGenerateLessonPlan = async () => {
    playClickSound();
    setGeneratingLp(true);
    try {
      const result = await generateLessonPlanWithAi({
        hskLevel: lpHskLevel,
        topic: lpTopic,
        duration: lpDuration,
        targetOutcomes: lpOutcomes
      });

      setLessonPlanResult(result);
      playSuccessSound();
      showToast('Đã tạo giáo án 7 bước thành công! Thầy/cô có thể chỉnh sửa theo ý muốn.');
    } catch (err) {
      showToast(err.message || 'Lỗi khi tạo giáo án.');
    } finally {
      setGeneratingLp(false);
    }
  };

  // Copy Lesson Plan to Clipboard
  const handleCopyLessonPlan = () => {
    if (!lessonPlanResult) return;
    const jsonStr = JSON.stringify(lessonPlanResult, null, 2);
    navigator.clipboard.writeText(jsonStr);
    playClickSound();
    showToast('Đã sao chép toàn bộ giáo án vào clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1A2433] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-5 sm:p-8 space-y-6 my-6 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#243447] dark:text-white">
                  AI Teacher Studio
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Hỗ trợ Giáo viên • Không thay thế
                </span>
              </div>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Công cụ thông minh giúp giáo viên thấu hiểu lớp học, soạn bài tập và chuẩn bị giáo án chuẩn HSK 3.0.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#243447] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Classroom Selector Bar */}
        <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Lớp học mục tiêu:</span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
            >
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.hsk_level})</option>
              ))}
            </select>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              onClick={() => { playClickSound(); setActiveTab('analysis'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analysis'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              1. Phân tích Lớp học
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab('assignment'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'assignment'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              2. Tạo Bài tập AI
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab('lesson_plan'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'lesson_plan'
                  ? 'bg-[#E85D3F] text-white shadow-2xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              3. Soạn Giáo án AI
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">

          {/* ========================================================== */}
          {/* TAB 1: AI CLASS ANALYSIS */}
          {/* ========================================================== */}
          {activeTab === 'analysis' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Chẩn đoán Sư phạm Tổng thể với AI
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    AI sẽ tổng hợp ẩn danh điểm số, tỷ lệ hoàn thành và 4 kỹ năng của lớp để chỉ ra điểm mạnh, điểm yếu và đề xuất bài tập củng cố.
                  </p>
                </div>

                <button
                  onClick={handleRunClassAnalysis}
                  disabled={analyzingClass}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {analyzingClass ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{analyzingClass ? 'Đang phân tích...' : 'Bắt đầu Phân tích AI'}</span>
                </button>
              </div>

              {/* Analysis Result Display */}
              {classAnalysisResult ? (
                <div className="space-y-5 animate-in fade-in duration-300">
                  
                  {/* Strengths & Weaknesses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Strengths */}
                    <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                        <CheckCircle2 size={16} />
                        <span>ĐIỂM MẠNH CỦA LỚP HỌC (STRENGTHS)</span>
                      </div>
                      <ul className="space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
                        {classAnalysisResult.classStrengths?.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-3">
                      <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                        <AlertCircle size={16} />
                        <span>ĐIỂM YẾU CẦN KHẮC PHỤC (WEAKNESSES)</span>
                      </div>
                      <ul className="space-y-2 text-xs text-rose-900 dark:text-rose-200">
                        {classAnalysisResult.classWeaknesses?.map((wk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-black mt-0.5">•</span>
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Recommended Review */}
                  <div className="p-5 rounded-3xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs">
                      <BookOpen size={16} />
                      <span>NỘI DUNG TRỌNG TÂM CẦN ÔN TẬP (RECOMMENDED REVIEW)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-900 dark:text-blue-200">
                      {classAnalysisResult.recommendedReview?.map((rev, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-white dark:bg-[#1A2433] border border-blue-100 dark:border-blue-900/60 flex items-start gap-2">
                          <span className="font-mono font-bold text-blue-600">{idx + 1}.</span>
                          <span>{rev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Exercises with 1-Click Setup to Tab 2 */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider">
                        Đề Xuất Bài Tập Tiếp Theo (1-Click Generator)
                      </span>
                      <span className="text-[11px] text-[#748092]">Bấm vào để tạo bài tập tương ứng</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {classAnalysisResult.recommendedExercises?.map((ex, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F]">
                                {ex.hskLevel} • {ex.type}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-[#243447] dark:text-white">{ex.title}</h5>
                            <p className="text-[11px] text-[#748092]">{ex.focus}</p>
                          </div>

                          <button
                            onClick={() => {
                              playClickSound();
                              setAsgHskLevel(ex.hskLevel || 'HSK 1');
                              setAsgTopic(ex.suggestedTopic || ex.title);
                              setAsgType(ex.type || 'Quiz');
                              setActiveTab('assignment');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                          >
                            <span>Tạo bài tập này bằng AI</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-10 rounded-3xl bg-gray-50/50 dark:bg-gray-800/20 border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-2">
                  <Sparkles size={24} className="mx-auto text-[#748092]" />
                  <p className="text-xs font-bold text-[#748092]">Chưa có báo cáo chẩn đoán</p>
                  <p className="text-[11px] text-[#748092] max-w-sm mx-auto">
                    Bấm nút "Bắt đầu Phân tích AI" ở trên để nhận chẩn đoán điểm mạnh, lỗ hổng kiến thức và lộ trình khắc phục cho lớp học.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: AI ASSIGNMENT GENERATOR (MANDATORY REVIEW STEP) */}
          {/* ========================================================== */}
          {activeTab === 'assignment' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Generator Input Form */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-[#E85D3F]" />
                    <span>Thiết Lập Thông Số Đề Bài</span>
                  </h4>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200">
                    Quy trình: AI Tạo nháp ➔ Giáo viên Duyệt ➔ Xuất bản
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[#748092] font-bold mb-1">Cấp độ HSK</label>
                    <select
                      value={asgHskLevel}
                      onChange={e => setAsgHskLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-[#243447] dark:text-white"
                    >
                      <option value="HSK 1">HSK 1</option>
                      <option value="HSK 2">HSK 2</option>
                      <option value="HSK 3">HSK 3</option>
                      <option value="HSK 4">HSK 4</option>
                      <option value="HSK 5">HSK 5</option>
                      <option value="HSK 6">HSK 6</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#748092] font-bold mb-1">Chủ đề bài tập (Topic)</label>
                    <input
                      type="text"
                      value={asgTopic}
                      onChange={e => setAsgTopic(e.target.value)}
                      placeholder="Ví dụ: Du lịch, Ẩm thực, Sở thích..."
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-[#243447] dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#748092] font-bold mb-1">Số lượng câu hỏi</label>
                    <select
                      value={asgQuestionCount}
                      onChange={e => setAsgQuestionCount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-[#243447] dark:text-white"
                    >
                      <option value={5}>5 câu</option>
                      <option value={10}>10 câu</option>
                      <option value={15}>15 câu</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleGenerateAssignment}
                    disabled={generatingAsg}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {generatingAsg ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    <span>{generatingAsg ? 'AI Đang soạn đề...' : 'AI Soạn Bộ Đề Bài'}</span>
                  </button>
                </div>
              </div>

              {/* MANDATORY REVIEW CARD SECTION */}
              {draftQuestions && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1A2433] border-2 border-[#E85D3F]/40 shadow-md space-y-5 animate-in fade-in duration-300">
                  
                  {/* Review Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                          BẢN NHÁP KIỂM DUYỆT
                        </span>
                        <h4 className="text-sm font-bold text-[#243447] dark:text-white">
                          Bộ Đề: {draftTitle} ({draftQuestions.length} câu)
                        </h4>
                      </div>
                      <p className="text-xs text-[#748092] mt-0.5">
                        Thầy/cô có toàn quyền chỉnh sửa nội dung, đổi đáp án đúng hoặc loại bỏ câu hỏi trước khi giao bài.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDraftQuestions(null)}
                        className="px-3 py-2 rounded-xl border border-gray-300 text-[#748092] text-xs font-bold hover:bg-gray-100 cursor-pointer"
                      >
                        Hủy bỏ
                      </button>

                      <button
                        onClick={handleApproveAndPublish}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={15} />
                        <span>Duyệt & Giao cho lớp</span>
                      </button>
                    </div>
                  </div>

                  {/* Editable Question Cards */}
                  <div className="space-y-4">
                    {draftQuestions.map((q, qIdx) => (
                      <div key={q.id || qIdx} className="p-4 rounded-2xl bg-[#FFF9F2]/70 dark:bg-[#243447]/40 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#E85D3F]">
                            Câu {qIdx + 1} ({q.difficulty || 'Trung bình'})
                          </span>
                          <button
                            onClick={() => handleDeleteDraftQuestion(qIdx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Xóa câu hỏi này"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Question Prompt Editor */}
                        <div>
                          <label className="text-[11px] font-bold text-[#748092] block mb-1">Nội dung câu hỏi:</label>
                          <textarea
                            value={q.question}
                            onChange={e => handleEditQuestionText(qIdx, e.target.value)}
                            rows={2}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                          />
                        </div>

                        {/* Options Editor */}
                        <div>
                          <label className="text-[11px] font-bold text-[#748092] block mb-1">Các đáp án lựa chọn (Click radio để đặt đáp án đúng):</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options?.map((opt, optIdx) => {
                              const isCorrect = q.correctAnswer === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2 rounded-xl border flex items-center gap-2 ${
                                    isCorrect 
                                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A2433]'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`correct_${qIdx}`}
                                    checked={isCorrect}
                                    onChange={() => handleSetCorrectAnswer(qIdx, optIdx)}
                                    className="cursor-pointer accent-emerald-600"
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={e => handleEditOption(qIdx, optIdx, e.target.value)}
                                    className="flex-1 bg-transparent text-xs text-[#243447] dark:text-white font-medium focus:outline-none"
                                  />
                                  {isCorrect && (
                                    <span className="text-[10px] font-bold text-emerald-600 shrink-0">Đúng</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Explanation Note */}
                        {q.explanation && (
                          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 text-[11px] text-amber-900 dark:text-amber-300">
                            <strong>💡 Giải thích sư phạm:</strong> {q.explanation}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                  {/* Bottom Approval Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-xs text-[#748092]">
                      Sau khi duyệt, bài tập sẽ tự động đồng bộ vào kho bài tập của lớp {activeClass?.name}.
                    </span>

                    <button
                      onClick={handleApproveAndPublish}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check size={16} />
                      <span>Xác Nhận & Giao Bài Ngay</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: AI LESSON PLAN (SOẠN GIÁO ÁN) */}
          {/* ========================================================== */}
          {activeTab === 'lesson_plan' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Form Input */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <BookOpen size={16} className="text-[#E85D3F]" />
                    <span>Thiết Kế Giáo Án 7 Bước Thực Chiến</span>
                  </h4>
                  <span className="text-[11px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200">
                    Khởi động • Từ vựng • Ngữ pháp • Nghe • Nói • Quiz • Về nhà
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[#748092] font-bold mb-1">Cấp độ</label>
                    <select
                      value={lpHskLevel}
                      onChange={e => setLpHskLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-[#243447] dark:text-white"
                    >
                      <option value="HSK 1">HSK 1</option>
                      <option value="HSK 2">HSK 2</option>
                      <option value="HSK 3">HSK 3</option>
                      <option value="HSK 4">HSK 4</option>
                      <option value="HSK 5">HSK 5</option>
                      <option value="HSK 6">HSK 6</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#748092] font-bold mb-1">Chủ đề tiết học (Topic)</label>
                    <input
                      type="text"
                      value={lpTopic}
                      onChange={e => setLpTopic(e.target.value)}
                      placeholder="Ví dụ: Đi mua sắm, Gọi món ăn tại nhà hàng..."
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-[#243447] dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#748092] font-bold mb-1">Thời lượng</label>
                    <select
                      value={lpDuration}
                      onChange={e => setLpDuration(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-[#243447] dark:text-white"
                    >
                      <option value={30}>30 phút (Tiết ngắn)</option>
                      <option value={45}>45 phút (Tiêu chuẩn)</option>
                      <option value={60}>60 phút</option>
                      <option value={90}>90 phút (Khóa chuyên sâu)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#748092] font-bold mb-1 text-xs">Mục tiêu đầu ra của tiết học (Tùy chọn)</label>
                  <input
                    type="text"
                    value={lpOutcomes}
                    onChange={e => setLpOutcomes(e.target.value)}
                    placeholder="Ví dụ: Học sinh tự tin hỏi giá và mặc cả giảm giá bằng tiếng Trung"
                    className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleGenerateLessonPlan}
                    disabled={generatingLp}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {generatingLp ? <RefreshCw size={14} className="animate-spin" /> : <BookOpen size={14} />}
                    <span>{generatingLp ? 'Đang tạo giáo án...' : 'AI Soạn Giáo Án'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Plan Output Display */}
              {lessonPlanResult && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-md space-y-6 animate-in fade-in duration-300">
                  
                  {/* Lesson Plan Header Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <div>
                      <h3 className="text-base font-black text-[#243447] dark:text-white">
                        {lessonPlanResult.title}
                      </h3>
                      <p className="text-xs text-[#748092] mt-0.5">
                        Thời lượng: {lessonPlanResult.duration} phút • Cấp độ: {lessonPlanResult.hskLevel}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyLessonPlan}
                        className="px-3.5 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#F1E5D8] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy size={13} />
                        <span>Sao chép</span>
                      </button>

                      {onSaveLessonPlanToMaterials && (
                        <button
                          onClick={() => {
                            onSaveLessonPlanToMaterials({
                              classroomId: selectedClassId,
                              title: lessonPlanResult.title,
                              content: JSON.stringify(lessonPlanResult, null, 2)
                            });
                            playSuccessSound();
                            showToast('Đã lưu giáo án vào tài liệu lớp học!');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Download size={13} />
                          <span>Lưu vào kho tài liệu</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 7 Interactive Sections */}
                  <div className="space-y-4">
                    
                    {/* 1. Warm-up */}
                    {lessonPlanResult.sections?.warmUp && (
                      <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 dark:bg-[#243447]/30 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                        <span className="text-xs font-bold text-[#E85D3F]">
                          {lessonPlanResult.sections.warmUp.title} ({lessonPlanResult.sections.warmUp.durationMinutes} phút)
                        </span>
                        <ul className="list-disc list-inside text-xs text-[#243447] dark:text-white space-y-1">
                          {lessonPlanResult.sections.warmUp.activities?.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 2. Vocabulary */}
                    {lessonPlanResult.sections?.vocabulary && (
                      <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 dark:bg-[#243447]/30 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                        <span className="text-xs font-bold text-teal-600">
                          {lessonPlanResult.sections.vocabulary.title} ({lessonPlanResult.sections.vocabulary.durationMinutes} phút)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {lessonPlanResult.sections.vocabulary.items?.map((item, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                              <p className="font-bold text-[#243447] dark:text-white">
                                {item.hanzi} <span className="font-mono text-xs font-normal text-[#748092]">({item.pinyin})</span>: {item.meaning}
                              </p>
                              {item.example && <p className="text-[11px] text-[#748092] italic mt-0.5">Ví dụ: {item.example}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Grammar */}
                    {lessonPlanResult.sections?.grammar && (
                      <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 dark:bg-[#243447]/30 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                        <span className="text-xs font-bold text-purple-600">
                          {lessonPlanResult.sections.grammar.title} ({lessonPlanResult.sections.grammar.durationMinutes} phút)
                        </span>
                        <div className="space-y-2 text-xs">
                          {lessonPlanResult.sections.grammar.rules?.map((rule, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                              <p className="font-bold text-[#E85D3F]">{rule.pattern}</p>
                              <p className="text-[#748092] mt-0.5">{rule.explanation}</p>
                              {rule.example && <p className="text-[11px] text-[#243447] dark:text-white mt-1 italic font-medium">{rule.example}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Listening & 5. Speaking */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {lessonPlanResult.sections?.listening && (
                        <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 dark:bg-[#243447]/30 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                          <span className="text-xs font-bold text-blue-600">
                            {lessonPlanResult.sections.listening.title}
                          </span>
                          <p className="text-xs text-[#243447] dark:text-white whitespace-pre-line font-mono bg-white dark:bg-[#1A2433] p-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                            {lessonPlanResult.sections.listening.script}
                          </p>
                          <p className="text-[11px] text-[#748092] italic">
                            Dịch: {lessonPlanResult.sections.listening.translation}
                          </p>
                        </div>
                      )}

                      {lessonPlanResult.sections?.speaking && (
                        <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 dark:bg-[#243447]/30 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                          <span className="text-xs font-bold text-emerald-600">
                            {lessonPlanResult.sections.speaking.title}
                          </span>
                          <p className="text-xs text-[#243447] dark:text-white">
                            <strong>Tình huống:</strong> {lessonPlanResult.sections.speaking.scenario}
                          </p>
                          <ul className="list-disc list-inside text-[11px] text-[#748092] space-y-1">
                            {lessonPlanResult.sections.speaking.prompts?.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* 6. Quiz & 7. Homework */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {lessonPlanResult.sections?.quiz && (
                        <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 dark:bg-[#243447]/30 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                          <span className="text-xs font-bold text-amber-600">
                            {lessonPlanResult.sections.quiz.title}
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#243447] dark:text-white">
                            {lessonPlanResult.sections.quiz.questions?.map((q, i) => (
                              <li key={i} className="p-2 rounded-lg bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                                <span className="font-semibold">{q.prompt}</span> ➔ <strong className="text-emerald-600">{q.answer}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {lessonPlanResult.sections?.homework && (
                        <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 dark:bg-[#243447]/30 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                          <span className="text-xs font-bold text-rose-600">
                            {lessonPlanResult.sections.homework.title}
                          </span>
                          <ul className="list-disc list-inside text-xs text-[#243447] dark:text-white space-y-1">
                            {lessonPlanResult.sections.homework.tasks?.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
