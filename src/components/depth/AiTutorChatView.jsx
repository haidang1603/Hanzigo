import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  BookOpen,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle,
  MessageSquare,
  Target,
  Compass,
  Sliders
} from 'lucide-react';

import { askAiTutor } from '../../services/aiGateway';
import {
  getLearnerPreferences,
  saveLearnerPreferences,
  buildComprehensiveLearnerContext,
  clearLearnerPersonalizationData,
  isPersonalizationEnabled
} from '../../services/learnerContextService';
import { speakChinese, playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';

const STORAGE_PREFIX = 'hanzigo_ai_tutor_history';
const MAX_QUESTION_LEN = 500;

// Các câu hỏi gợi ý chia thành 4 chuyên mục sư phạm
const SUGGESTED_PROMPTS = [
  {
    category: '🧱 Giải thích ngữ pháp',
    items: [
      'Giải thích cấu trúc câu chữ 把 trong HSK 3',
      'Cách dùng trợ từ nghi vấn 吗 và 呢 khác nhau thế nào?'
    ]
  },
  {
    category: '🔍 Phân biệt từ',
    items: [
      'Phân biệt cách dùng giữa 二 (èr) và 两 (liǎng)',
      'Phân biệt 知道 (zhīdào) và 认识 (rènshi)'
    ]
  },
  {
    category: '✏️ Sửa câu',
    items: [
      'Sửa giúp tôi câu này: 我明天去看他',
      'Kiểm tra ngữ pháp câu: 我去学校学习昨天'
    ]
  },
  {
    category: '💡 Đặt ví dụ',
    items: [
      'Đặt 2 câu ví dụ với từ 高兴 (gāoxìng) kèm Pinyin',
      'Đặt ví dụ về câu so sánh chữ 比 trong HSK 2'
    ]
  }
];

export default function AiTutorChatView({ user, openAuthModal }) {
  const userId = user?.id || user?.uid || 'guest';
  const storageKey = `${STORAGE_PREFIX}_${userId}`;

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        data: {
          answer: 'Chào bạn! Lão Sư HanziGo là gia sư tiếng Trung cá nhân hóa của bạn. Lão Sư sử dụng kho giáo trình HSK đã qua kiểm duyệt đối chiếu để giải thích từ vựng, chữ Hán, ngữ pháp và sửa lỗi câu chuẩn xác. Hôm nay bạn muốn tìm hiểu hoặc giải đáp thắc mắc gì nào?',
          hanzi: '你好',
          pinyin: 'nǐ hǎo',
          vietnamese_translation: 'Xin chào',
          grounded_facts: [
            'Hệ thống truy xuất kiến thức kiểm duyệt chuẩn HSK 3.0',
            'Phân định minh bạch giữa sự thật giáo trình và giải thích mở rộng'
          ],
          supplementary_explanation: 'Bạn có thể chọn nhanh các câu hỏi gợi ý bên dưới hoặc gõ trực tiếp thắc mắc bằng tiếng Việt hoặc tiếng Trung.',
          examples: [
            {
              chinese: '你好！很高兴为你答疑解惑。',
              pinyin: 'Nǐ hǎo! Hěn gāoxìng wèi nǐ dáyí jiěhuò.',
              vietnamese: 'Xin chào! Rất vui được giải đáp thắc mắc cho bạn.'
            }
          ],
          hsk_level: 'HSK 1',
          next_learning_step: {
            action: 'start_lesson',
            target_topic: 'Bài 1: Chào hỏi căn bản',
            recommended_lesson_id: 'l-101',
            reason: 'Bắt đầu với bài học đầu tiên trên lộ trình để làm quen với ngữ âm'
          }
        },
        citations: [],
        evidence_status: 'grounded'
      }
    ];
  });

  const [inputQuestion, setInputQuestion] = useState('');
  const [learnerPrefs, setLearnerPrefs] = useState(() => getLearnerPreferences(user));
  const [learnerContext, setLearnerContext] = useState(() => buildComprehensiveLearnerContext(user));
  const [selectedHskLevel, setSelectedHskLevel] = useState(learnerPrefs.targetHskLevel || user?.hskLevel || 'HSK 1');
  const [selectedContextType, setSelectedContextType] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [expandedCitations, setExpandedCitations] = useState({});
  const [dailyRemaining, setDailyRemaining] = useState(150);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Feature Flag & Emergency Kill Switch phía Frontend
  const isFeatureEnabled = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_AI_TUTOR !== 'false';

  const chatBottomRef = useRef(null);
  const textareaRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Tự động cuộn xuống đáy khi có tin nhắn mới
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading, scrollToBottom]);

  // Lưu lịch sử theo phạm vi người dùng (User Isolation)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  // Chuyển đổi khi đăng xuất hoặc đổi người dùng
  useEffect(() => {
    const prefs = getLearnerPreferences(user);
    const ctx = buildComprehensiveLearnerContext(user);
    setLearnerPrefs(prefs);
    setLearnerContext(ctx);
    if (prefs.targetHskLevel) setSelectedHskLevel(prefs.targetHskLevel);

    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_${user?.id || user?.uid || 'guest'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {}
  }, [user?.id, user?.uid]);

  // Gửi câu hỏi tới AI Gia sư
  const handleSendQuestion = async (customText = null) => {
    const textToSend = (typeof customText === 'string' ? customText : inputQuestion).trim();
    if (!textToSend || isLoading) return;

    if (textToSend.length > MAX_QUESTION_LEN) {
      showToast(`Câu hỏi không được vượt quá ${MAX_QUESTION_LEN} ký tự!`);
      return;
    }

    playClickSound();
    setErrorState(null);
    setInputQuestion('');

    const userMessageId = `user-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Chuẩn bị lịch sử hội thoại gần đây
      const recentHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.role === 'user' ? m.text : (m.data?.answer || '')
      }));

      // Lấy ngữ cảnh học tập thời gian thực
      const currentContext = buildComprehensiveLearnerContext(user);
      setLearnerContext(currentContext);

      const res = await askAiTutor({
        question: textToSend,
        contextType: selectedContextType,
        learnerLevel: selectedHskLevel,
        conversationHistory: recentHistory,
        learnerContext: isPersonalizationEnabled(user) ? currentContext : null,
        user
      });

      if (!res.success) {
        throw new Error(res.error || 'Dịch vụ Gia sư AI tạm thời gián đoạn.');
      }

      playSuccessSound();

      // Cập nhật số lượt còn lại nếu có trong metadata
      if (typeof res._metadata?.daily_remaining === 'number') {
        setDailyRemaining(res._metadata.daily_remaining);
      } else {
        setDailyRemaining(prev => Math.max(0, prev - 1));
      }

      const assistantMessageId = `tutor-${Date.now()}`;
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        data: res.data || {},
        citations: res.citations || [],
        evidence_status: res.evidence_status || 'grounded',
        context_type: res.context_type,
        learner_level: res.learner_level,
        feedback: null
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      playErrorSound();
      console.warn('[AI Tutor UI] Call error:', err.message);
      setErrorState({
        message: err.message,
        failedQuestion: textToSend
      });
      // Giữ lại câu hỏi trong textarea để người dùng không bị mất nội dung
      setInputQuestion(textToSend);
      showToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Thử lại câu hỏi vừa bị lỗi
  const handleRetry = () => {
    if (errorState?.failedQuestion) {
      handleSendQuestion(errorState.failedQuestion);
    }
  };

  // Phản hồi hữu ích / chưa rõ
  const handleFeedback = (messageId, type) => {
    playClickSound();
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, feedback: type };
      }
      return m;
    }));
    showToast(type === 'helpful' ? '👍 Cảm ơn bạn! Phản hồi giúp Lão Sư cải thiện tốt hơn.' : '👎 Đã ghi nhận! Lão Sư sẽ giải thích chi tiết hơn.');
  };

  // Đóng mở trích dẫn nguồn
  const toggleCitation = (msgId) => {
    playClickSound();
    setExpandedCitations(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Xóa toàn bộ lịch sử trò chuyện
  const handleClearHistory = () => {
    playClickSound();
    localStorage.removeItem(storageKey);
    setMessages([]);
    setShowClearModal(false);
    showToast('Đã xóa sạch lịch sử trò chuyện với Gia sư AI!');
  };

  // Phím tắt bàn phím
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div className="flex flex-col h-[750px] max-w-5xl mx-auto bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-hidden">
      
      {/* Toast Thông báo */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in">
          <CheckCircle2 size={16} className="text-[#45B97C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER: Thông tin Lão Sư & Quota */}
      <div className="px-5 py-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FAF8F5] dark:bg-[#1A2433] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#D94827] flex items-center justify-center text-white font-black shadow-md shadow-[#E85D3F]/20">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#243447] dark:text-white">
                Lão Sư HanziGo
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1">
                <ShieldCheck size={11} />
                RAG Kiểm Duyệt
              </span>
            </div>
            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
              Gia sư tiếng Trung bản ngữ • Đối chiếu giáo trình chuẩn HSK
            </p>
          </div>
        </div>

        {/* Level Selector, Quota & Xóa lịch sử */}
        <div className="flex items-center gap-2">
          {/* Nút Xem & Chỉnh sửa Mục tiêu Học tập cá nhân */}
          <button
            onClick={() => {
              playClickSound();
              setLearnerContext(buildComprehensiveLearnerContext(user));
              setShowGoalModal(true);
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 text-[#E85D3F] hover:border-[#E85D3F] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Xem và điều chỉnh mục tiêu học tập cá nhân hóa"
          >
            <Target size={13} />
            <span className="hidden sm:inline">Mục tiêu:</span>
            <span>{learnerPrefs.targetHskLevel || selectedHskLevel}</span>
          </button>

          {/* Chọn cấp độ HSK */}
          <select
            value={selectedHskLevel}
            onChange={(e) => {
              setSelectedHskLevel(e.target.value);
              saveLearnerPreferences({ targetHskLevel: e.target.value }, user);
              setLearnerPrefs(prev => ({ ...prev, targetHskLevel: e.target.value }));
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-hidden focus:border-[#E85D3F]"
            title="Chọn cấp độ HSK của bạn để AI điều chỉnh độ khó"
          >
            {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          {/* Chọn Ngữ cảnh */}
          <select
            value={selectedContextType}
            onChange={(e) => setSelectedContextType(e.target.value)}
            className="hidden sm:block px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-hidden focus:border-[#E85D3F]"
            title="Ngữ cảnh tra cứu"
          >
            <option value="general">Toàn bộ</option>
            <option value="grammar">Ngữ pháp</option>
            <option value="vocabulary">Từ vựng</option>
            <option value="hanzi">Chữ Hán</option>
            <option value="conversation">Hội thoại</option>
          </select>

          {/* Thẻ Quota trong ngày */}
          <span className="hidden md:inline-flex px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-extrabold text-[11px]">
            Hạn mức: {dailyRemaining}/150
          </span>

          {/* Nút Xóa lịch sử */}
          <button
            onClick={() => setShowClearModal(true)}
            className="p-2 rounded-xl text-[#748092] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Xóa lịch sử hội thoại"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* DANH SÁCH TIN NHẮN (MESSAGE FEED) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FCFBF9] dark:bg-[#16202E]">
        {!isFeatureEnabled && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <div>
              <div className="font-extrabold">Tính năng Gia sư AI đang tạm bảo trì</div>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Hệ thống đang được nâng cấp chất lượng mô hình và bảo trì định kỳ. Vui lòng quay lại sau ít phút.
              </p>
            </div>
          </div>
        )}

        {!user && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-orange-950 dark:text-orange-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-[#E85D3F] shrink-0" />
              <div>
                <span className="font-bold">Đăng nhập tài khoản HanziGo</span>
                <p className="text-[11px] text-orange-800/80 dark:text-orange-300/80 mt-0.5">
                  Đăng nhập để đồng bộ lịch sử hội thoại, cá nhân hóa lộ trình và trò chuyện trực tiếp cùng Lão Sư AI.
                </p>
              </div>
            </div>
            {openAuthModal && (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            )}
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[70%] bg-[#E85D3F] text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs space-y-1">
                  <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                  <span className="text-[10px] text-white/70 block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          // Tin nhắn của AI Gia Sư
          const data = msg.data || {};
          const citations = msg.citations || [];
          const isGrounded = msg.evidence_status === 'grounded';
          const isExpanded = !!expandedCitations[msg.id];

          return (
            <div key={msg.id} className="flex gap-3 max-w-[95%] sm:max-w-[88%]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-center text-[#E85D3F] shrink-0 mt-1 shadow-xs">
                <Bot size={18} />
              </div>

              <div className="flex-1 space-y-3 bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-2xl rounded-tl-xs border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
                
                {/* 1. Thẻ Chữ Hán & Pinyin Trọng Tâm (Nếu có) */}
                {(data.hanzi || data.pinyin) && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {data.hanzi && (
                        <span className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white tracking-wider">
                          {data.hanzi}
                        </span>
                      )}
                      <div>
                        {data.pinyin && (
                          <div className="text-sm font-extrabold text-[#E85D3F]">
                            {data.pinyin}
                          </div>
                        )}
                        {data.vietnamese_translation && (
                          <div className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
                            {data.vietnamese_translation}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {data.hsk_level && (
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1E293B] border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold">
                          {data.hsk_level}
                        </span>
                      )}
                      {data.hanzi && (
                        <button
                          onClick={() => {
                            playClickSound();
                            speakChinese(data.hanzi);
                          }}
                          className="p-1.5 rounded-lg bg-white dark:bg-[#1E293B] text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors"
                          title="Nghe phát âm chuẩn"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Lời giải thích tự nhiên bằng tiếng Việt */}
                <div className="text-sm text-[#243447] dark:text-[#E2E8F0] leading-relaxed whitespace-pre-wrap font-medium">
                  {data.answer}
                </div>

                {/* 3. Sự thật được kiểm duyệt (Grounded Facts) */}
                {Array.isArray(data.grounded_facts) && data.grounded_facts.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
                    <div className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Chứng cứ đối chiếu từ giáo trình kiểm duyệt</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 font-medium pl-1 text-[12px]">
                      {data.grounded_facts.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Giải thích bổ sung / Mẹo ghi nhớ */}
                {data.supplementary_explanation && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-xs text-[#243447] dark:text-slate-300 space-y-1">
                    <div className="font-extrabold text-[#748092] dark:text-slate-400 flex items-center gap-1.5">
                      <Lightbulb size={14} className="text-amber-500" />
                      <span>Giải thích mở rộng & Mẹo sư phạm</span>
                    </div>
                    <p className="text-[12px] leading-relaxed pl-1">
                      {data.supplementary_explanation}
                    </p>
                  </div>
                )}

                {/* 5. Các câu ví dụ câu thực tế */}
                {Array.isArray(data.examples) && data.examples.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-[#748092] dark:text-slate-400 uppercase tracking-wider block">
                      Câu ví dụ thực tế:
                    </span>
                    <div className="space-y-2">
                      {data.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#16202E] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-[#243447] dark:text-white">
                              {ex.chinese}
                            </span>
                            <button
                              onClick={() => {
                                playClickSound();
                                speakChinese(ex.chinese);
                              }}
                              className="text-[#E85D3F] hover:opacity-80 p-1"
                              title="Nghe câu ví dụ"
                            >
                              <Volume2 size={14} />
                            </button>
                          </div>
                          <div className="text-[11px] font-semibold text-[#E85D3F]">
                            {ex.pinyin}
                          </div>
                          <div className="text-[11px] text-[#748092] dark:text-slate-400">
                            {ex.vietnamese}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5b. Lưu ý lỗi sai đã xác nhận của người học (Verified Quiz / Exam Mistakes) */}
                {data.confirmed_mistake_note && (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <Target size={16} className="text-[#E85D3F] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-[#E85D3F]">
                        Lưu ý lỗi sai đã xác nhận từ bài kiểm tra của bạn:
                      </div>
                      <p className="text-[12px] leading-relaxed font-medium">
                        {data.confirmed_mistake_note}
                      </p>
                    </div>
                  </div>
                )}

                {/* 5c. Đề xuất bước học tiếp theo (Next Learning Step) */}
                {data.next_learning_step && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200/80 dark:border-orange-800/40 text-xs space-y-1.5">
                    <div className="font-extrabold text-[#E85D3F] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Compass size={15} />
                        <span>Đề xuất bước học tiếp theo</span>
                      </div>
                      {data.next_learning_step.recommended_lesson_id && (
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1E293B] border border-orange-300 dark:border-orange-700 text-[10px] font-bold text-orange-800 dark:text-orange-300">
                          {data.next_learning_step.recommended_lesson_id}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-sm text-[#243447] dark:text-white">
                      {data.next_learning_step.target_topic}
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-slate-400 leading-relaxed font-medium">
                      {data.next_learning_step.reason}
                    </p>
                  </div>
                )}

                {/* 6. THẺ NGUỒN THAM KHẢO CÓ THỂ MỞ (Citations Card) */}
                {isGrounded && citations.length > 0 ? (
                  <div className="pt-2 border-t border-[#F1E5D8]/60 dark:border-[#2B3A4F]/60">
                    <button
                      onClick={() => toggleCitation(msg.id)}
                      className="text-xs font-bold text-[#E85D3F] hover:text-[#D94827] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Nguồn tài liệu kiểm duyệt ({citations.length} nguồn tham khảo)</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 space-y-2 animate-fade-in">
                        {citations.map((c, cIdx) => (
                          <div key={cIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[#243447] dark:text-white">
                                {c.source_title}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">
                                Độ tin cậy: {Math.round((c.confidence || 0) * 100)}%
                              </span>
                            </div>
                            <div className="text-slate-500 dark:text-slate-400">
                              Phân mục: <strong>{c.section}</strong> • Giấy phép: <strong>{c.license_identifier}</strong>
                            </div>
                            {c.source_url && (
                              <a
                                href={c.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[#E85D3F] hover:underline font-bold text-[10px] pt-0.5"
                              >
                                Xem tài liệu gốc <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#F1E5D8]/60 dark:border-[#2B3A4F]/60">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <HelpCircle size={13} className="text-amber-500" />
                      Chưa có giáo trình kiểm duyệt trực tiếp — Kiến thức bổ sung phổ quát
                    </span>
                  </div>
                )}

                {/* 7. FOOTER: Feedback Hữu Ích / Chưa Rõ */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-[#748092] dark:text-slate-400">
                  <span>{msg.timestamp}</span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px]">Giải thích này có ích?</span>
                    <button
                      onClick={() => handleFeedback(msg.id, 'helpful')}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        msg.feedback === 'helpful'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                      }`}
                      title="Hữu ích"
                    >
                      <ThumbsUp size={12} /> Có
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'unhelpful')}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        msg.feedback === 'unhelpful'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40'
                          : 'border-slate-200 dark:border-slate-800 hover:border-rose-300'
                      }`}
                      title="Chưa rõ"
                    >
                      <ThumbsDown size={12} /> Chưa rõ
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {/* Trạng thái AI đang suy nghĩ / tra cứu RAG */}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-center text-[#E85D3F] shrink-0">
              <Bot size={18} className="animate-spin" />
            </div>
            <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl rounded-tl-xs border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E85D3F] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#E85D3F] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#E85D3F] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
                Lão Sư đang đối chiếu giáo trình kiểm duyệt và soạn giải thích...
              </span>
            </div>
          </div>
        )}

        {/* Trạng thái Lỗi & Nút Retry / Login */}
        {errorState && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-900 dark:text-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorState.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {openAuthModal && (errorState.message.toLowerCase().includes('đăng nhập') || errorState.message.toLowerCase().includes('xác thực')) && (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  Đăng nhập ngay
                </button>
              )}
              <button
                type="button"
                onClick={handleRetry}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RotateCcw size={13} /> Thử lại câu hỏi
              </button>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* CÂU HỎI GỢI Ý (SUGGESTED PROMPTS) */}
      <div className="px-4 py-2.5 bg-white dark:bg-[#1E293B] border-t border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max pb-1">
          <span className="text-[11px] font-extrabold text-[#748092] dark:text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles size={12} className="text-amber-500" /> Gợi ý nhanh:
          </span>
          {SUGGESTED_PROMPTS.flatMap(cat => cat.items).map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                playClickSound();
                handleSendQuestion(item);
              }}
              disabled={isLoading}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#FAF8F5] dark:bg-[#16202E] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-300 hover:border-[#E85D3F] hover:text-[#E85D3F] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT BAR: Khung nhập câu hỏi responsive & Multi-line */}
      <div className="p-3 sm:p-4 bg-white dark:bg-[#1E293B] border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
        <div className="flex items-end gap-2 bg-[#FAF8F5] dark:bg-[#16202E] p-2 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] focus-within:border-[#E85D3F] transition-colors">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isFeatureEnabled ? "Hỏi Lão Sư về ngữ pháp, chữ Hán, Pinyin, đặt câu ví dụ... (Enter để gửi, Shift+Enter xuống dòng)" : "Hệ thống Gia sư AI đang tạm bảo trì..."}
            disabled={isLoading || !isFeatureEnabled}
            className="flex-1 bg-transparent border-0 focus:outline-hidden text-xs sm:text-sm text-[#243447] dark:text-white placeholder-[#748092] resize-none px-2 py-1 max-h-24 disabled:opacity-50"
          />

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <span className="text-[10px] text-[#748092] dark:text-slate-500 font-mono hidden sm:inline">
              {inputQuestion.length}/{MAX_QUESTION_LEN}
            </span>

            <button
              onClick={() => handleSendQuestion()}
              disabled={isLoading || !isFeatureEnabled || !inputQuestion.trim()}
              className="w-10 h-10 rounded-xl bg-[#E85D3F] text-white flex items-center justify-center hover:bg-[#D94827] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#E85D3F]/20 cursor-pointer"
              title="Gửi câu hỏi"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL XÁC NHẬN XÓA LỊCH SỬ (GDPR & Data Privacy) */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 max-w-sm w-full space-y-4 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-[#243447] dark:text-white">
                Xóa lịch sử hội thoại?
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Hành động này sẽ xóa vĩnh viễn toàn bộ tin nhắn đã lưu với Gia sư AI của tài khoản này trên thiết bị hiện tại.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#748092] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL QUẢN LÝ MỤC TIÊU HỌC TẬP & CÁ NHÂN HÓA AI (User Learning Goals Modal) */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 max-w-lg w-full space-y-5 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDEEEB] dark:bg-[#E85D3F]/20 text-[#E85D3F] flex items-center justify-center">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#243447] dark:text-white">
                    Mục tiêu học tập & Cá nhân hóa
                  </h3>
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                    AI tự động điều chỉnh lời giải thích dựa trên tiến độ thật
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form cài đặt mục tiêu */}
            <div className="space-y-4 text-xs">
              
              {/* 1. Cấp độ HSK mục tiêu */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-[#243447] dark:text-white">
                  Cấp độ HSK mục tiêu
                </label>
                <select
                  value={learnerPrefs.targetHskLevel || 'HSK 1'}
                  onChange={(e) => setLearnerPrefs(prev => ({ ...prev, targetHskLevel: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#16202E] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold focus:outline-hidden focus:border-[#E85D3F]"
                >
                  {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* 2. Định hướng học tập */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-[#243447] dark:text-white">
                  Định hướng học tập chính
                </label>
                <select
                  value={learnerPrefs.learningGoal || 'general_foundation'}
                  onChange={(e) => setLearnerPrefs(prev => ({ ...prev, learningGoal: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#16202E] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold focus:outline-hidden focus:border-[#E85D3F]"
                >
                  <option value="general_foundation">Nền tảng giao tiếp căn bản</option>
                  <option value="hsk_exam">Luyện thi chứng chỉ HSK</option>
                  <option value="daily_communication">Giao tiếp khẩu ngữ đời sống</option>
                  <option value="travel_speaking">Du lịch & Khẩu ngữ thực tế</option>
                  <option value="hanzi_culture">Văn hóa & Chiết tự chữ Hán</option>
                  <option value="work_business">Tiếng Trung thương mại & Công việc</option>
                </select>
              </div>

              {/* 3. Thời lượng học mỗi ngày */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-[#243447] dark:text-white">
                  Thời lượng học mục tiêu mỗi ngày (phút)
                </label>
                <select
                  value={learnerPrefs.dailyGoalMinutes || 15}
                  onChange={(e) => setLearnerPrefs(prev => ({ ...prev, dailyGoalMinutes: parseInt(e.target.value, 10) }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#16202E] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold focus:outline-hidden focus:border-[#E85D3F]"
                >
                  <option value={10}>10 phút / ngày</option>
                  <option value={15}>15 phút / ngày</option>
                  <option value={20}>20 phút / ngày</option>
                  <option value={30}>30 phút / ngày</option>
                  <option value={45}>45 phút / ngày</option>
                  <option value={60}>60 phút / ngày</option>
                </select>
              </div>

              {/* 4. Bật / Tắt cá nhân hóa AI */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#16202E] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-[#243447] dark:text-white">
                    Bật cá nhân hóa AI
                  </div>
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                    Cho phép Lão Sư AI tự động điều chỉnh độ khó và câu ví dụ theo kết quả học thật
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={learnerPrefs.personalizationEnabled !== false}
                  onChange={(e) => setLearnerPrefs(prev => ({ ...prev, personalizationEnabled: e.target.checked }))}
                  className="w-5 h-5 accent-[#E85D3F] cursor-pointer"
                />
              </div>

              {/* 5. Dữ liệu học tập thực tế & Điểm yếu đã xác nhận */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Tín hiệu học tập thực tế:</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Không giả lập điểm số</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800">
                    <div className="text-base font-black text-[#243447] dark:text-white">
                      {learnerContext?.completedLessonsCount || 0}
                    </div>
                    <div className="text-[10px] text-[#748092]">Bài học đã học</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800">
                    <div className="text-base font-black text-[#E85D3F]">
                      {learnerContext?.streak || 0}
                    </div>
                    <div className="text-[10px] text-[#748092]">Chuỗi ngày</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800">
                    <div className="text-base font-black text-amber-600">
                      {learnerContext?.srsDueCount || 0}
                    </div>
                    <div className="text-[10px] text-[#748092]">Từ SRS đến hạn</div>
                  </div>
                </div>

                {/* Danh sách lỗi sai đã xác nhận */}
                <div className="pt-1.5 space-y-1">
                  <span className="text-[11px] font-bold text-[#748092] dark:text-slate-400 block">
                    Lỗi sai xác nhận từ bài kiểm tra:
                  </span>
                  {Array.isArray(learnerContext?.weaknesses) && learnerContext.weaknesses.length > 0 ? (
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {learnerContext.weaknesses.map((w, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-[11px] space-y-0.5">
                          <span className="font-extrabold text-amber-800 dark:text-amber-300 block">
                            • {w.label}
                          </span>
                          <span className="text-[#748092] dark:text-slate-400 block text-[10px]">
                            {w.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#748092] italic">
                      {learnerContext?.hasSparseData ? 'Học viên mới (Cold Start) — Chưa có bài kiểm tra làm sai.' : 'Chưa ghi nhận điểm yếu hoặc lỗi sai đáng chú ý.'}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <button
                onClick={() => {
                  playClickSound();
                  clearLearnerPersonalizationData(user);
                  const freshPrefs = getLearnerPreferences(user);
                  const freshCtx = buildComprehensiveLearnerContext(user);
                  setLearnerPrefs(freshPrefs);
                  setLearnerContext(freshCtx);
                  showToast('Đã xóa toàn bộ dữ liệu cá nhân hóa theo chính sách bảo mật!');
                  setShowGoalModal(false);
                }}
                className="py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors"
                title="Xóa sạch tùy chọn và hồ sơ cá nhân hóa (GDPR / Nghị định 13)"
              >
                Xóa dữ liệu cá nhân hóa
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#748092] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    playSuccessSound();
                    saveLearnerPreferences(learnerPrefs, user);
                    setSelectedHskLevel(learnerPrefs.targetHskLevel || 'HSK 1');
                    setLearnerContext(buildComprehensiveLearnerContext(user));
                    showToast('Đã lưu mục tiêu học tập thành công!');
                    setShowGoalModal(false);
                  }}
                  className="py-2 px-4 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:bg-[#D94827] transition-colors shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
