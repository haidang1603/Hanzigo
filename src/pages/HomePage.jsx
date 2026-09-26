import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Mic, 
  PenTool, 
  MessageSquare, 
  Trophy, 
  Clock, 
  Flame,
  Layers,
  ChevronRight,
  ChevronDown,
  Volume2,
  HelpCircle,
  FolderDown,
  Users,
  Zap,
  Check,
  RotateCcw
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';
import { ROADMAP_LEVELS, LESSONS_DATA } from '../data/chineseData';

// Mini Quick Reflex Quiz Dataset
const QUICK_QUIZZES = [
  {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    options: ['Xin chào', 'Cảm ơn', 'Tạm biệt'],
    correctIndex: 0,
    explanation: '你好 (nǐ hǎo): Lời chào thông dụng nhất. Hán-Việt: "Nhĩ Hảo" (Chúc bạn an lành).'
  },
  {
    hanzi: '谢谢',
    pinyin: 'xièxie',
    options: ['Xin lỗi', 'Cảm ơn', 'Không có chi'],
    correctIndex: 1,
    explanation: '谢谢 (xièxie): Thể hiện sự cảm ơn chân thành. Hán-Việt: "Tạ Tạ".'
  },
  {
    hanzi: '再见',
    pinyin: 'zàijiàn',
    options: ['Hẹn gặp lại', 'Chúc ngủ ngon', 'Chào buổi sáng'],
    correctIndex: 0,
    explanation: '再见 (zàijiàn): Hẹn gặp lại. 再 (lại) + 见 (gặp mặt). Hán-Việt: "Tái Kiến".'
  },
  {
    hanzi: '学习',
    pinyin: 'xuéxí',
    options: ['Nghỉ ngơi', 'Làm việc', 'Học tập'],
    correctIndex: 2,
    explanation: '学习 (xuéxí): Học hỏi kiến thức. Đồng âm Hán-Việt: "Học Tập".'
  },
  {
    hanzi: '朋友',
    pinyin: 'péngyou',
    options: ['Bạn bè', 'Thầy cô', 'Bố mẹ'],
    correctIndex: 0,
    explanation: '朋友 (péngyou): Bạn bè, tri kỷ. Hán-Việt: "Bằng Hữu".'
  },
  {
    hanzi: '高兴',
    pinyin: 'gāoxìng',
    options: ['Buồn bã', 'Vui mừng, phấn khởi', 'Mệt mỏi'],
    correctIndex: 1,
    explanation: '高兴 (gāoxìng): Phấn chấn, vui mừng. Hán-Việt: "Cao Hứng".'
  }
];

// Showcase Tabs Data
const SHOWCASE_ITEMS = {
  vocab: [
    {
      hanzi: '学习',
      pinyin: 'xuéxí',
      hanViet: 'Học Tập',
      meaning: 'Học hỏi, tiếp thu tri thức mới',
      tag: 'HSK 1',
      color: '#E85D3F'
    },
    {
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      hanViet: 'Nhĩ Hảo',
      meaning: 'Xin chào, lời chúc tốt lành',
      tag: 'Nhập môn',
      color: '#F4B942'
    },
    {
      hanzi: '进步',
      pinyin: 'jìnbù',
      hanViet: 'Tiến Bộ',
      meaning: 'Phát triển, vươn lên mỗi ngày',
      tag: 'HSK 2',
      color: '#45B97C'
    }
  ],
  phrases: [
    {
      hanzi: '很高兴认识你',
      pinyin: 'hěn gāoxìng rènshi nǐ',
      hanViet: 'Hấn cao hứng nhận thức nhĩ',
      meaning: 'Rất vui được làm quen với bạn',
      tag: 'Giao tiếp',
      color: '#3B82F6'
    },
    {
      hanzi: '这个多少钱？',
      pinyin: 'zhè ge duōshao qián?',
      hanViet: 'Giá cá đa thiếu tiền?',
      meaning: 'Cái này bao nhiêu tiền vậy?',
      tag: 'Mua sắm',
      color: '#E85D3F'
    },
    {
      hanzi: '明天见！',
      pinyin: 'míngtiān jiàn!',
      hanViet: 'Minh thiên kiến!',
      meaning: 'Ngày mai gặp lại nhé!',
      tag: 'Tạm biệt',
      color: '#8B5CF6'
    }
  ],
  radicals: [
    {
      hanzi: '休',
      pinyin: 'xiū',
      hanViet: 'Hưu (Nghỉ ngơi)',
      meaning: 'Người (亻) tựa vào Cây (木) để dừng chân nghỉ',
      tag: 'Chiết tự',
      color: '#45B97C'
    },
    {
      hanzi: '明',
      pinyin: 'míng',
      hanViet: 'Minh (Sáng tỏ)',
      meaning: 'Mặt trời (日) kết hợp Mặt trăng (月) tỏa sáng',
      tag: 'Chiết tự',
      color: '#F4B942'
    },
    {
      hanzi: '好',
      pinyin: 'hǎo',
      hanViet: 'Hảo (Tốt đẹp)',
      meaning: 'Người phụ nữ (女) bồng người con (子) là trọn vẹn',
      tag: 'Chiết tự',
      color: '#E85D3F'
    }
  ]
};

// FAQ List
const FAQS = [
  {
    q: 'Người chưa biết gì về tiếng Trung có học được trên HanziGo không?',
    a: 'Hoàn toàn học được! HanziGo thiết kế lộ trình Nhập môn dành riêng cho người mới bắt đầu từ con số 0: từ cách đặt khẩu hình phát âm chuẩn Pinyin, quy tắc 4 thanh điệu, đến 8 nét viết cơ bản và mẹo ghép vần cực dễ hiểu.'
  },
  {
    q: 'Tại sao phương pháp Hán-Việt lại giúp người Việt học nhanh hơn 50%?',
    a: 'Tiếng Việt có hơn 70% từ ngữ bắt nguồn từ gốc Hán (từ Hán-Việt). Nhờ sự tương đồng kỳ diệu này, người Việt khi học tiếng Trung chỉ cần nắm được quy luật chuyển âm là có thể đoán đúng nghĩa và ghi nhớ hàng ngàn từ vựng mà không phải học vẹt.'
  },
  {
    q: 'Tôi có thể luyện phát âm và giao tiếp một mình như thế nào?',
    a: 'Bạn có thể sử dụng tính năng "Luyện phát âm AI" để chấm điểm âm lượng, cao độ từng thanh điệu, hoặc trò chuyện 24/7 với Trợ lý ảo "Tiểu Hàm" qua các kịch bản thực tế như mua sắm Taobao, gọi món nhà hàng hay hỏi đường du lịch.'
  },
  {
    q: 'Các bài học và tài liệu in ấn trên trang web có miễn phí không?',
    a: 'Tất cả các bài học cơ bản, flashcard từ vựng, hệ thống tra cứu chiết tự, phòng luyện viết chữ Hán và kho tài liệu PDF A4 (Mẫu ô mễ tự, bảng 214 bộ thủ) đều được cung cấp hoàn toàn miễn phí.'
  }
];

export default function HomePage({ user, streak = 0, xp = 0, setActiveTab, openAuthModal }) {
  // Showcase Tab State
  const [showcaseTab, setShowcaseTab] = useState('vocab');

  // Mini Quiz Interactive State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  // FAQ Expand State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);

  // Get actual completed lessons from localStorage
  const completedLessonCount = useMemo(() => {
    try {
      const raw = localStorage.getItem('hanzigo_completed_lessons');
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  }, []);

  // Handle Quick Quiz Answer
  const currentQuiz = QUICK_QUIZZES[quizIndex];

  const handleSelectQuizOption = (optIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIndex);
    if (optIndex === currentQuiz.correctIndex) {
      playSuccessSound();
      setQuizScore(prev => prev + 10);
    } else {
      playErrorSound();
    }
  };

  const handleNextQuiz = () => {
    playClickSound();
    setSelectedAnswer(null);
    setQuizIndex((prev) => (prev + 1) % QUICK_QUIZZES.length);
  };

  const handleStartLearning = () => {
    playClickSound();
    setActiveTab('roadmap');
  };

  const handleExploreRoadmap = () => {
    playClickSound();
    setActiveTab('roadmap');
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-20">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#E85D3F]/15 via-[#F4B942]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#45B97C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* User Greeting Bar if logged in, or Badge if guest */}
              {user ? (
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
                  <span className="flex h-3 w-3 rounded-full bg-[#45B97C] animate-pulse" />
                  <span className="text-xs font-bold text-[#243447] dark:text-white">
                    Chào mừng trở lại, <span className="text-[#E85D3F]">{user.name || 'Học viên'}</span>!
                  </span>
                  <span className="text-xs font-semibold text-[#D97706] flex items-center gap-1">
                    <Flame size={14} className="fill-[#F4B942] text-[#F4B942]" />
                    {streak || user.streak || 0} ngày streak
                  </span>
                  <span className="text-xs text-[#748092] dark:text-[#94A3B8]">•</span>
                  <span className="text-xs font-semibold text-[#E85D3F] flex items-center gap-1">
                    <Sparkles size={14} />
                    {xp || user.xp || 0} XP
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border border-[#E85D3F]/30 text-[#E85D3F] text-xs font-bold shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-[#E85D3F] animate-ping" />
                  <span>Nền tảng học tiếng Trung tối ưu cho người Việt</span>
                </div>
              )}

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#243447] dark:text-white leading-[1.15]">
                Chinh phục tiếng Trung <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D3F] via-[#F4B942] to-[#E85D3F]">
                  dễ hơn, nhớ lâu hơn
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#748092] dark:text-[#94A3B8] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Phương pháp liên tưởng <strong className="text-[#243447] dark:text-white">Hán-Việt</strong>, hiểu sâu bản chất chiết tự và luyện phản xạ giao tiếp cùng AI thông minh.
                <span className="block mt-1 font-semibold text-[#E85D3F]">
                  “Học 15 phút mỗi ngày – Tự tin giao tiếp tiếng Trung sau 30 ngày.”
                </span>
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        playClickSound();
                        setActiveTab('dashboard');
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-base shadow-lg shadow-[#E85D3F]/30 hover:shadow-xl hover:shadow-[#E85D3F]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Trophy size={18} />
                      <span>Xem Bảng điều khiển</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={handleStartLearning}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-base hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <BookOpen size={18} className="text-[#F4B942]" />
                      <span>Tiếp tục học lộ trình</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleStartLearning}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-base shadow-lg shadow-[#E85D3F]/30 hover:shadow-xl hover:shadow-[#E85D3F]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Sparkles size={18} />
                      <span>Bắt đầu học miễn phí</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => openAuthModal && openAuthModal('login')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-base hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Đăng nhập tài khoản</span>
                    </button>
                  </>
                )}
              </div>

              {/* Trust proof */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#748092] dark:text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#45B97C]" />
                  <span>100% Miễn phí bài học cơ bản</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#45B97C]" />
                  <span>Phát âm chuẩn Bắc Kinh</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#45B97C]" />
                  <span>Luyện viết ô mễ tự A4</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative card wrapper */}
                <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1B2636] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl relative">
                  
                  {/* Category Filter Tabs */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] mb-5">
                    <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                      <button
                        onClick={() => {
                          playClickSound();
                          setShowcaseTab('vocab');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          showcaseTab === 'vocab'
                            ? 'bg-[#E85D3F] text-white shadow-sm'
                            : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447]'
                        }`}
                      >
                        Từ vựng
                      </button>
                      <button
                        onClick={() => {
                          playClickSound();
                          setShowcaseTab('phrases');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          showcaseTab === 'phrases'
                            ? 'bg-[#E85D3F] text-white shadow-sm'
                            : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447]'
                        }`}
                      >
                        Mẫu câu
                      </button>
                      <button
                        onClick={() => {
                          playClickSound();
                          setShowcaseTab('radicals');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          showcaseTab === 'radicals'
                            ? 'bg-[#E85D3F] text-white shadow-sm'
                            : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447]'
                        }`}
                      >
                        Chiết tự
                      </button>
                    </div>

                    <span className="text-[11px] font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>Trực quan</span>
                    </span>
                  </div>

                  {/* Dynamic Showcase Items */}
                  <div className="space-y-3">
                    {SHOWCASE_ITEMS[showcaseTab].map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between group hover:border-[#E85D3F] transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div 
                            className="w-13 h-13 rounded-xl bg-white dark:bg-[#1E293B] shadow-sm flex items-center justify-center font-['Noto_Serif_SC'] text-xl font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] px-2"
                            style={{ color: item.color }}
                          >
                            {item.hanzi}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">{item.pinyin}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-semibold">
                                {item.hanViet}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] font-medium line-clamp-1 mt-0.5">
                              {item.meaning}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <AudioButton text={item.hanzi} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Buttons at Bottom */}
                  <div className="mt-5 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#45B97C] animate-pulse" />
                      <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-medium">
                        Bấm loa để nghe phát âm
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        playClickSound();
                        setActiveTab(showcaseTab === 'vocab' ? 'vocabulary' : showcaseTab === 'phrases' ? 'conversation' : 'writing');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Thử ngay</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>

                {/* Floating Achievement badge */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1E293B] p-3.5 rounded-2xl shadow-xl border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF7E9] dark:bg-[#2D2619] flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#243447] dark:text-white">Lộ trình HSK 1 - HSK 6</p>
                    <p className="text-[10px] text-[#45B97C] font-semibold">Tự tin giao tiếp thực tế</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MINI REFLEX GAME (Thử tài phản xạ tiếng Trung trong 1 phút) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FEF7E9] dark:from-[#1E293B] dark:via-[#1B2636] dark:to-[#131B24] border-2 border-[#F4B942]/40 shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] flex items-center justify-center text-2xl shadow-sm">
                🎮
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#243447] dark:text-white">
                    Khởi động phản xạ 1 phút
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E85D3F] text-white">
                    Mini Game
                  </span>
                </div>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Thử khả năng phán đoán nghĩa của chữ Hán ngay trên trang chủ!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] px-3 py-1.5 rounded-xl border border-[#E85D3F]/20">
                Điểm: {quizScore} XP
              </span>
              <span className="text-[#748092] dark:text-[#94A3B8]">
                Câu {quizIndex + 1}/{QUICK_QUIZZES.length}
              </span>
            </div>
          </div>

          {/* Quiz Question Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Big Character */}
            <div className="md:col-span-4 text-center p-6 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col items-center justify-center">
              <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-semibold mb-1">
                Từ vựng:
              </span>
              <h2 className="font-['Noto_Serif_SC'] text-5xl sm:text-6xl font-black text-[#E85D3F] my-2">
                {currentQuiz.hanzi}
              </h2>
              <p className="text-sm font-bold text-[#243447] dark:text-white mb-2">
                {currentQuiz.pinyin}
              </p>
              <button
                onClick={() => speakChinese(currentQuiz.hanzi)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF9F2] dark:bg-[#1E293B] text-[#E85D3F] text-xs font-bold hover:bg-[#FDEEEB] transition-colors"
              >
                <Volume2 size={14} />
                <span>Nghe đọc</span>
              </button>
            </div>

            {/* Right Options */}
            <div className="md:col-span-8 space-y-3">
              <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">
                Chọn nghĩa tiếng Việt chính xác nhất:
              </p>
              
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuiz.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswer === oIdx;
                  const isCorrect = oIdx === currentQuiz.correctIndex;
                  let btnStyle = 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';
                  
                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-[#EBF8F2] dark:bg-[#162B21] border-[#45B97C] text-[#45B97C] font-bold shadow-sm';
                    } else if (isSelected) {
                      btnStyle = 'bg-[#FDEEEB] dark:bg-[#2D1E1B] border-[#E85D3F] text-[#E85D3F] font-bold';
                    } else {
                      btnStyle = 'opacity-50 border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092]';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && isCorrect && (
                        <Check size={18} className="text-[#45B97C]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next */}
              {selectedAnswer !== null && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 animate-fade-in">
                  <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                    💡 <strong>Giải nghĩa:</strong> {currentQuiz.explanation}
                  </p>
                  <button
                    onClick={handleNextQuiz}
                    className="self-end sm:self-auto px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Câu tiếp</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 3. FOUR PILLARS FOR VIETNAMESE LEARNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">Lợi thế độc quyền</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243447] dark:text-white mt-1">
            Tại sao người Việt học tiếng Trung tại <span className="text-[#E85D3F]">HanziGo</span> nhanh gấp đôi?
          </h2>
          <p className="text-sm text-[#748092] dark:text-[#94A3B8] mt-2">
            Phương pháp học tập thiết kế riêng biệt dựa trên mối liên hệ mật thiết giữa kho tàng từ Hán-Việt và văn hóa Á Đông.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-base font-bold text-[#243447] dark:text-white mb-2">
              Tận dụng 70% từ Hán-Việt
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Biết một hiểu mười. Bạn đã sở hữu sẵn vốn từ khổng lồ: 幸福 (Hạnh phúc), 国家 (Quốc gia), 成功 (Thành công)... chỉ cần chuyển âm là đọc chuẩn.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PenTool size={24} />
            </div>
            <h3 className="text-base font-bold text-[#243447] dark:text-white mb-2">
              Kể chuyện chiết tự chữ Hán
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Giải mã từng con chữ qua các bộ thủ và hình tượng sống động. Chữ Hán không còn là những nét vẽ vô hồn mà là câu chuyện triết lý sâu sắc.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic size={24} />
            </div>
            <h3 className="text-base font-bold text-[#243447] dark:text-white mb-2">
              Chỉnh âm chuẩn Bắc Kinh
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Chỉ điểm trực diện các lỗi người Việt hay mắc: uốn lưỡi zh/ch/sh, bật hơi j/q/x và biến điệu hai thanh 3. Có thu âm so sánh trực tiếp.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E293B] text-[#3B82F6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RotateCcw size={24} />
            </div>
            <h3 className="text-base font-bold text-[#243447] dark:text-white mb-2">
              Spaced Repetition (SRS)
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Thuật toán lặp lại ngắt quãng thông minh tự động xếp lịch từ khó cần ôn tập hôm nay, đánh bại đường cong quên lãng não bộ.
            </p>
          </div>

        </div>
      </section>

      {/* 4. ROADMAP PREVIEW WITH REAL COMPLETED TRACKING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
              Khung chuẩn quốc tế HSK 3.0
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243447] dark:text-white mt-1">
              Lộ trình bài bản từ con số 0 đến thành thạo
            </h2>
            <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
              Bạn đã hoàn thành <strong className="text-[#E85D3F]">{completedLessonCount}</strong> bài học trên hệ thống.
            </p>
          </div>
          <button
            onClick={handleExploreRoadmap}
            className="text-xs sm:text-sm font-bold text-[#E85D3F] hover:text-[#CB4529] flex items-center gap-1 self-start md:self-auto"
          >
            <span>Khám phá toàn bộ 6 cấp độ</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROADMAP_LEVELS.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              onClick={handleExploreRoadmap}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: item.color }}>
                    {item.code}
                  </span>
                  <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
                    {item.vocabCount} từ vựng mục tiêu
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Grammar highlight */}
                <div className="mt-4 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                    Điểm nổi bật:
                  </span>
                  {item.grammarPoints && item.grammarPoints.slice(0, 2).map((gp, gIdx) => (
                    <div key={gIdx} className="flex items-center gap-1.5 text-[11px] text-[#243447] dark:text-[#CBD5E1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E85D3F]" />
                      <span className="truncate">{gp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-[#243447] dark:text-white">Mục tiêu cấp độ</span>
                  <span className="text-[#E85D3F] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    <span>Xem bài học</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ALL CORE FEATURES GRID */}
      <section className="bg-gradient-to-b from-[#FFF9F2] via-white to-[#FFF9F2] dark:from-[#131B24] dark:via-[#1E293B] dark:to-[#131B24] py-16 border-y border-[#F1E5D8] dark:border-[#2B3A4F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">Hệ sinh thái toàn diện</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243447] dark:text-white mt-1">
              Bộ công cụ học tập thông minh 6 trong 1
            </h2>
            <p className="text-sm text-[#748092] dark:text-[#94A3B8] mt-2">
              Tích hợp mọi kỹ năng Nghe - Nói - Đọc - Viết trong cùng một nền tảng duy nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div 
              onClick={() => {
                playClickSound();
                setActiveTab('vocabulary');
              }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                Flashcard 3D & Thêm từ tự do
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Lật thẻ 3D mượt mà, phân loại từ theo Spaced Repetition SRS. Tự do thêm bất kỳ từ vựng nào bạn muốn học vào kho cá nhân.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#E85D3F]">
                <span>Trải nghiệm Flashcard</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => {
                playClickSound();
                setActiveTab('pronunciation');
              }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                Luyện phát âm & Nhận diện giọng nói
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Hệ thống nhận diện giọng nói Web Speech API chấm điểm tức thì. Tự thêm câu giao tiếp bất kỳ để AI phân tích khẩu hình chuẩn.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#D97706]">
                <span>Luyện phát âm ngay</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => {
                playClickSound();
                setActiveTab('writing');
              }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PenTool size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                Tập viết chữ Hán mễ tự cách
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Khung canvas mô phỏng nét bút lông mực mài. Xem hoạt họa thứ tự thuận bút và tự gõ thêm chữ Hán bất kỳ để tập viết.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#45B97C]">
                <span>Mở bàn viết chữ</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => {
                playClickSound();
                setActiveTab('conversation');
              }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E293B] text-[#3B82F6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                Hội thoại AI Tiểu Hàm thực chiến
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Nhập vai đối thoại trực tiếp theo các tình huống đời sống (mua sắm Taobao, ăn lẩu Haidilao, hỏi đường). Lưu lại lịch sử trò chuyện.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#3B82F6]">
                <span>Trò chuyện cùng AI</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 5 */}
            <div 
              onClick={() => {
                playClickSound();
                setActiveTab('materials');
              }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] dark:bg-[#201B2E] text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FolderDown size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                Thư viện tài liệu in ấn A4
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Xem và in trực tiếp mẫu giấy kẻ ô Mễ Tự A4, sổ tay 214 bộ thủ, giáo trình ngữ pháp HSK. Hỗ trợ tự upload tài liệu học cá nhân.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#8B5CF6]">
                <span>Tải tài liệu PDF</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 6 */}
            <div 
              onClick={() => {
                playClickSound();
                setActiveTab('community');
              }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] dark:bg-[#2A1D15] text-[#EA580C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                Cộng đồng hỏi đáp & Bảng vàng
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Giao lưu cùng bạn học khắp cả nước, đăng câu hỏi xin trợ giúp, chia sẻ bài viết hay và đua top bảng vàng vinh danh hàng tuần.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#EA580C]">
                <span>Tham gia cộng đồng</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FEATURED LESSONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">Bài học nổi bật</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243447] dark:text-white mt-1">
            Khởi đầu ngay với các chủ đề thông dụng nhất
          </h2>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-2">
            Mỗi bài học chỉ mất từ 10 đến 15 phút, giải thích rõ ràng từng từ vựng và câu đàm thoại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LESSONS_DATA.map((lesson) => (
            <div 
              key={lesson.id}
              onClick={() => {
                playClickSound();
                setActiveTab('lesson');
              }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md hover:border-[#E85D3F] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold">
                    Bài {lesson.number} • {lesson.level}
                  </span>
                  <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-medium flex items-center gap-1">
                    <Clock size={12} />
                    <span>{lesson.durationMinutes} phút</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 line-clamp-2">
                  {lesson.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <span className="text-xs font-bold text-[#45B97C]">
                  +{lesson.xpReward} XP thưởng
                </span>
                <span className="text-xs font-bold text-[#E85D3F] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Học thử ngay</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">Hỏi đáp thường gặp</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243447] dark:text-white mt-1">
            Bạn có thắc mắc về phương pháp học?
          </h2>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, fIdx) => {
            const isExpanded = expandedFaqIndex === fIdx;
            return (
              <div 
                key={fIdx}
                className="rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => {
                    playClickSound();
                    setExpandedFaqIndex(isExpanded ? -1 : fIdx);
                  }}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#243447] dark:text-white hover:text-[#E85D3F] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-[#E85D3F] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown 
                    size={18} 
                    className={`text-[#748092] shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#E85D3F]' : ''}`} 
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#F1E5D8]/50 dark:border-[#2B3A4F]/50 text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#E85D3F] via-[#CB4529] to-[#992E17] text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 font-['Noto_Serif_SC'] text-8xl font-black text-white/5 select-none pointer-events-none">
            加油
          </div>

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-xs font-bold">
              Đồng hành cùng 10.000+ học viên Việt Nam
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Sẵn sàng bắt đầu hành trình học tiếng Trung ngay hôm nay?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Không cần tốn hàng chục triệu đi trung tâm. Chỉ cần 15 phút mỗi ngày với phương pháp Hán-Việt khoa học, bạn sẽ thấy sự khác biệt sau 2 tuần!
            </p>
            <div className="pt-2">
              <button
                onClick={handleStartLearning}
                className="px-8 py-4 rounded-xl bg-white text-[#E85D3F] hover:bg-[#FFF9F2] font-black text-base shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Bắt đầu học miễn phí ngay</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
