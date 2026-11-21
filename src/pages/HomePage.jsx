import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Mic,
  PenTool,
  Trophy,
  Clock,
  Flame,
  Layers,
  ChevronDown,
  Volume2,
  HelpCircle,
  FolderDown,
  Zap,
  Check,
  UserPlus,
  GraduationCap,
  Compass,
  MessageCircle,
  LogIn,
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';
import { getLessonsByChapter } from '../services/learningPathService';
import useAiPersonalization from '../hooks/useAiPersonalization.js';
import PersonalizedRecommendationCard from '../components/personalization/PersonalizedRecommendationCard.jsx';
import AiContextBadge from '../components/personalization/AiContextBadge.jsx';

// Mini Quick Reflex Practice Dataset
const QUICK_PRACTICE = [
  {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    options: ['Xin chào', 'Cảm ơn', 'Tạm biệt'],
    correctIndex: 0,
    explanation:
      '你好 (nǐ hǎo): Lời chào thông dụng nhất trong tiếng Trung. Hán-Việt: "Nhĩ Hảo" (Chúc bạn luôn an lành).',
  },
  {
    hanzi: '谢谢',
    pinyin: 'xièxie',
    options: ['Xin lỗi', 'Cảm ơn', 'Không có chi'],
    correctIndex: 1,
    explanation: '谢谢 (xièxie): Thể hiện sự cảm kích và cảm ơn chân thành. Hán-Việt: "Tạ Tạ".',
  },
  {
    hanzi: '再见',
    pinyin: 'zàijiàn',
    options: ['Hẹn gặp lại', 'Chúc ngủ ngon', 'Chào buổi sáng'],
    correctIndex: 0,
    explanation: '再见 (zàijiàn): Hẹn gặp lại. 再 (lại) + 见 (gặp mặt). Hán-Việt: "Tái Kiến".',
  },
  {
    hanzi: '学习',
    pinyin: 'xuéxí',
    options: ['Nghỉ ngơi', 'Làm việc', 'Học tập'],
    correctIndex: 2,
    explanation: '学习 (xuéxí): Học hỏi và rèn luyện kiến thức. Đồng âm Hán-Việt: "Học Tập".',
  },
  {
    hanzi: '朋友',
    pinyin: 'péngyou',
    options: ['Bạn bè', 'Thầy cô', 'Bố mẹ'],
    correctIndex: 0,
    explanation: '朋友 (péngyou): Bạn bè, bằng hữu tri kỷ. Hán-Việt: "Bằng Hữu".',
  },
  {
    hanzi: '高兴',
    pinyin: 'gāoxìng',
    options: ['Buồn bã', 'Vui mừng, phấn khởi', 'Mệt mỏi'],
    correctIndex: 1,
    explanation: '高兴 (gāoxìng): Tâm trạng phấn khởi, hân hoan. Hán-Việt: "Cao Hứng".',
  },
];

// Sino-Vietnamese Bridge Word Dataset
const SINO_VIETNAMESE_WORDS = [
  { hanzi: '幸福', pinyin: 'xìngfú', hanViet: 'Hạnh Phúc', meaning: 'Hạnh phúc, trọn vẹn viên mãn' },
  { hanzi: '成功', pinyin: 'chénggōng', hanViet: 'Thành Công', meaning: 'Đạt được mục tiêu, thắng lợi' },
  { hanzi: '国家', pinyin: 'guójiā', hanViet: 'Quốc Gia', meaning: 'Đất nước, tổ quốc' },
  { hanzi: '准备', pinyin: 'zhǔnbèi', hanViet: 'Chuẩn Bị', meaning: 'Sẵn sàng chu đáo trước' },
  { hanzi: '态度', pinyin: 'tàidu', hanViet: 'Thái Độ', meaning: 'Cách ứng xử, tinh thần đón nhận' },
  { hanzi: '经济', pinyin: 'jīngjì', hanViet: 'Kinh Tế', meaning: 'Tài chính, thương mại mậu dịch' },
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
      color: '#E85D3F',
    },
    {
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      hanViet: 'Nhĩ Hảo',
      meaning: 'Xin chào, lời chúc tốt lành',
      tag: 'Nhập môn',
      color: '#F4B942',
    },
    {
      hanzi: '进步',
      pinyin: 'jìnbù',
      hanViet: 'Tiến Bộ',
      meaning: 'Phát triển, vươn lên mỗi ngày',
      tag: 'HSK 2',
      color: '#45B97C',
    },
  ],
  phrases: [
    {
      hanzi: '很高兴认识你',
      pinyin: 'hěn gāoxìng rènshi nǐ',
      hanViet: 'Hấn cao hứng nhận thức nhĩ',
      meaning: 'Rất vui được làm quen với bạn',
      tag: 'Giao tiếp',
      color: '#3B82F6',
    },
    {
      hanzi: '这个多少钱？',
      pinyin: 'zhè ge duōshao qián?',
      hanViet: 'Giá cá đa thiếu tiền?',
      meaning: 'Cái này bao nhiêu tiền vậy?',
      tag: 'Mua sắm',
      color: '#E85D3F',
    },
    {
      hanzi: '明天见！',
      pinyin: 'míngtiān jiàn!',
      hanViet: 'Minh thiên kiến!',
      meaning: 'Ngày mai gặp lại nhé!',
      tag: 'Tạm biệt',
      color: '#8B5CF6',
    },
  ],
  radicals: [
    {
      hanzi: '休',
      pinyin: 'xiū',
      hanViet: 'Hưu (Nghỉ ngơi)',
      meaning: 'Người (亻) tựa vào Cây (木) để dừng chân nghỉ',
      tag: 'Chiết tự',
      color: '#45B97C',
    },
    {
      hanzi: '明',
      pinyin: 'míng',
      hanViet: 'Minh (Sáng tỏ)',
      meaning: 'Mặt trời (日) kết hợp Mặt trăng (月) tỏa sáng',
      tag: 'Chiết tự',
      color: '#F4B942',
    },
    {
      hanzi: '好',
      pinyin: 'hǎo',
      hanViet: 'Hảo (Tốt đẹp)',
      meaning: 'Người phụ nữ (女) bồng người con (子) là trọn vẹn',
      tag: 'Chiết tự',
      color: '#E85D3F',
    },
  ],
};

// FAQ List
const FAQS = [
  {
    q: 'Người chưa biết gì về tiếng Trung có học được trên HanziGo không?',
    a: 'Hoàn toàn học được! HanziGo thiết kế lộ trình Nhập môn dành riêng cho người mới bắt đầu từ con số 0: từ cách đặt khẩu hình phát âm chuẩn Pinyin, quy tắc 4 thanh điệu, đến 8 nét viết cơ bản và mẹo ghép vần cực dễ hiểu.',
  },
  {
    q: 'Tại sao phương pháp Hán-Việt lại giúp người Việt học tiếng Trung hiệu quả hơn?',
    a: 'Rất nhiều từ vựng tiếng Việt bắt nguồn từ gốc Hán (từ Hán-Việt). Nhờ sự tương đồng về âm và nghĩa này, người Việt khi học tiếng Trung có thể nắm quy luật chuyển âm để liên tưởng và ghi nhớ từ vựng tự nhiên hơn.',
  },
  {
    q: 'Tôi có thể luyện phát âm và viết chữ Hán trên máy tính hoặc điện thoại không?',
    a: 'Có! HanziGo trang bị công nghệ nhận diện giọng nói AI Web Speech để chẩn đoán ngữ điệu, đồng thời cung cấp bảng vẽ Mễ Tự Cách (米字格) tương tác trực tiếp bằng ngón tay hoặc chuột cảm ứng.',
  },
  {
    q: 'Các bài học và tài liệu in ấn trên trang web có miễn phí không?',
    a: 'Tất cả các bài học cơ bản, flashcard từ vựng, hệ thống tra cứu chiết tự, phòng luyện viết chữ Hán và kho tài liệu PDF A4 (Mẫu ô mễ tự, bảng 214 bộ thủ, đề thi HSK) đều được cung cấp hoàn toàn miễn phí.',
  },
  {
    q: 'Lộ trình học tại HanziGo bám sát chuẩn HSK nào?',
    a: 'Nội dung bài học, ngân hàng đề thi thử và hệ thống từ vựng trên HanziGo được đối sánh trực tiếp với khung chuẩn HSK 3.0 (180 bài HSK 1–9 & 11.092 từ vựng), đảm bảo học sát thực tế và thi đạt kết quả cao.',
  },
];

const HERO_HIGHLIGHTS = [
  { value: '180 bài', label: 'Lộ trình HSK 1–9' },
  { value: '11.092 từ', label: 'Flashcard SRS SM-2' },
  { value: 'CBT Chuẩn', label: 'Thi thử HSK 3.0' },
  { value: 'Miễn phí', label: 'Học thử không cần thẻ' },
];

const CORE_ECOSYSTEM_SHORTCUTS = [
  {
    id: 'roadmap',
    label: 'Lộ trình 180 bài',
    sub: 'HSK 1–9 chuẩn CTI',
    icon: Compass,
    iconBg: 'bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]',
  },
  {
    id: 'vocabulary',
    label: 'Flashcard & SRS',
    sub: '11.092 từ SM-2',
    icon: Layers,
    iconBg: 'bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]',
  },
  {
    id: 'pronunciation',
    label: 'AI Phát âm',
    sub: 'Chấm 4 thanh điệu',
    icon: Mic,
    iconBg: 'bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]',
  },
  {
    id: 'writing',
    label: 'Tập viết Mễ tự',
    sub: 'Thứ tự nét & in A4',
    icon: PenTool,
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-[#3B82F6]',
  },
  {
    id: 'hsk',
    label: 'Phòng thi CBT',
    sub: 'Mô phỏng thi thật',
    icon: GraduationCap,
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  },
  {
    id: 'materials',
    label: 'Học liệu & Lớp học',
    sub: 'PDF, MP3 & Lớp trực tuyến',
    icon: FolderDown,
    iconBg: 'bg-orange-50 dark:bg-orange-950/40 text-[#EA580C]',
  },
];

export default function HomePage({
  user,
  streak = 0,
  xp = 0,
  setActiveTab,
  openAuthModal,
  onSelectLesson,
}) {
  const { studyPlan, learnerContext } = useAiPersonalization(user);

  // Tier 1 Showcase tab
  const [showcaseTab, setShowcaseTab] = useState('vocab');
  // Tier 2 Interactive sandbox tab ('quiz' | 'hanviet')
  const [tryTab, setTryTab] = useState('quiz');
  // Tier 3 Progressive disclosure tab ('lessons' | 'faq' | 'explore')
  const [exploreTab, setExploreTab] = useState('lessons');

  // Mini Practice Interactive State
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [practiceScore, setPracticeScore] = useState(0);

  // Selected Sino-Vietnamese word
  const [activeSinoWord, setActiveSinoWord] = useState(SINO_VIETNAMESE_WORDS[0]);

  // FAQ Expand State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);

  const starterLessons = useMemo(() => getLessonsByChapter('ch-1') || [], []);
  const currentPractice = QUICK_PRACTICE[practiceIndex];

  const handleSelectPracticeOption = (optIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIndex);
    if (optIndex === currentPractice.correctIndex) {
      playSuccessSound();
      setPracticeScore((prev) => prev + 10);
    } else {
      playErrorSound();
    }
  };

  const handleNextPractice = () => {
    playClickSound();
    setSelectedAnswer(null);
    setPracticeIndex((prev) => (prev + 1) % QUICK_PRACTICE.length);
  };

  const handleStartLearning = () => {
    playClickSound();
    if (!user && openAuthModal) {
      openAuthModal('register');
    } else {
      setActiveTab('roadmap');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-8 sm:space-y-10 pb-16 animate-in fade-in duration-300">
      {/* =====================================================================
          TẦNG 1: HERO HÀNH ĐỘNG NGAY (ABOVE THE FOLD — 7:5 DESKTOP, 1 COL MOBILE)
      ===================================================================== */}
      <section
        aria-label="Giới thiệu HanziGo và trải nghiệm nghe phát âm"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#FFF9F2] to-white dark:from-[#1E293B] dark:via-[#131B24] dark:to-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] p-3.5 sm:p-8 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center relative z-10">
          {/* Left 7 cols: Value Prop + Action-First CTA + 4 Compact Highlights */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-5 text-center lg:text-left">
            {user ? (
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xs text-xs">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#45B97C] animate-pulse" />
                <span className="font-bold text-[#243447] dark:text-white">
                  Chào mừng trở lại, <span className="text-[#E85D3F]">{user.name || 'Học viên'}</span>!
                </span>
                <span className="font-semibold text-[#D97706] flex items-center gap-1">
                  <Flame size={13} className="fill-[#F4B942] text-[#F4B942]" />
                  {streak || user.streak || 0} ngày
                </span>
                <span className="font-semibold text-[#E85D3F] flex items-center gap-1">
                  <Sparkles size={13} />
                  {xp || user.xp || 0} XP
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border border-[#E85D3F]/30 text-[#E85D3F] text-[11px] sm:text-xs font-bold">
                <span className="flex h-2 w-2 rounded-full bg-[#E85D3F] animate-ping" />
                <span>🏮 Học tiếng Trung HSK 1–9 chuẩn HSK 3.0 cho người Việt</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#243447] dark:text-white leading-[1.15]">
              Chinh phục tiếng Trung{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D3F] via-[#F4B942] to-[#E85D3F]">
                dễ hơn, nhớ lâu hơn
              </span>
            </h1>

            <p className="text-xs sm:text-base text-[#748092] dark:text-[#94A3B8] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 line-clamp-2 sm:line-clamp-none">
              Liên tưởng <strong className="text-[#243447] dark:text-white">gốc Hán-Việt</strong>, chiết tự trực quan, luyện phát âm AI và ôn tập SRS SM-2 — chỉ 15 phút mỗi ngày.
            </p>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2 sm:gap-3">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveTab('dashboard');
                    }}
                    className="min-h-[46px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-sm shadow-lg shadow-[#E85D3F]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Trophy size={17} />
                    <span>Vào Bảng điều khiển</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveTab('roadmap');
                    }}
                    className="min-h-[46px] px-5 py-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-sm hover:border-[#E85D3F] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <BookOpen size={16} className="text-[#E85D3F]" />
                    <span>Tiếp tục Lộ trình</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleStartLearning}
                    className="min-h-[46px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-sm shadow-lg shadow-[#E85D3F]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles size={17} />
                    <span>Bắt đầu học miễn phí</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveTab('hsk');
                    }}
                    className="min-h-[46px] px-5 py-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-sm hover:border-[#E85D3F] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <GraduationCap size={16} className="text-[#E85D3F]" />
                    <span>Thi thử HSK miễn phí</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal && openAuthModal('login')}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold text-[#748092] dark:text-[#94A3B8] hover:text-[#E85D3F] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn size={14} />
                    <span>Đăng nhập</span>
                  </button>
                </>
              )}
            </div>

            {/* 4 Compact Value Highlights (2x2 on mobile, 4 cols on sm+) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5 sm:pt-1">
              {HERO_HIGHLIGHTS.map((stat) => (
                <div
                  key={stat.value}
                  className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-[#0F172A]/70 border border-[#F1E5D8] dark:border-[#2B3A4F] text-left"
                >
                  <p className="text-sm sm:text-base font-black text-[#E85D3F] leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8] mt-0.5 truncate">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 cols: Interactive Audio & Decomposition Showcase Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-4 sm:p-5 bg-white dark:bg-[#1B2636] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-md space-y-3.5">
              {/* Showcase Tabs */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center gap-1 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto scrollbar-none">
                  {[
                    { id: 'vocab', label: 'Từ vựng' },
                    { id: 'phrases', label: 'Mẫu câu' },
                    { id: 'radicals', label: 'Chiết tự' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setShowcaseTab(tab.id);
                      }}
                      className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        showcaseTab === tab.id
                          ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-xs'
                          : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <span className="hidden sm:inline-flex text-[11px] font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2.5 py-1 rounded-full items-center gap-1 shrink-0">
                  <Sparkles size={11} />
                  <span>Nghe chuẩn</span>
                </span>
              </div>

              {/* Showcase Items */}
              <div className="space-y-2.5">
                {SHOWCASE_ITEMS[showcaseTab].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FFFDF9] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2 hover:border-[#E85D3F]/60 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl bg-white dark:bg-[#1E293B] shadow-2xs flex items-center justify-center font-['Noto_Serif_SC'] text-base sm:text-lg font-black border border-[#F1E5D8] dark:border-[#2B3A4F] shrink-0"
                        style={{ color: item.color }}
                      >
                        {showcaseTab === 'phrases' ? '💬' : item.hanzi}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {showcaseTab === 'phrases' && (
                            <span
                              className="font-['Noto_Serif_SC'] text-sm font-black"
                              style={{ color: item.color }}
                            >
                              {item.hanzi}
                            </span>
                          )}
                          <span className="text-xs font-black text-[#243447] dark:text-white">
                            {item.pinyin}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-bold">
                            {item.hanViet}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate mt-0.5">
                          {item.meaning}
                        </p>
                      </div>
                    </div>

                    <AudioButton text={item.hanzi} size="sm" />
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#748092] dark:text-[#94A3B8] font-medium">
                  Bấm loa để nghe phát âm chuẩn
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab(
                      showcaseTab === 'vocab'
                        ? 'vocabulary'
                        : showcaseTab === 'phrases'
                        ? 'conversation'
                        : 'writing'
                    );
                  }}
                  className="min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <span>Thử ngay</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          TẦNG 2: TRẢI NGHIỆM 1 PHÚT & 6 CÔNG CỤ CỐT LÕI (7:5 DESKTOP)
      ===================================================================== */}
      <section
        aria-label="Trải nghiệm tương tác nhanh và 6 công cụ cốt lõi"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
      >
        {/* Left 7 cols: Unified 1-Minute Interactive Sandbox (Quiz + Han-Viet) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Zap size={17} className="text-[#E85D3F]" />
                <span>Trải nghiệm ngay trong 1 phút</span>
              </h2>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Thử phản xạ chữ Hán hoặc khám phá quy luật chuyển âm Hán-Việt không cần đăng ký.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setTryTab('quiz');
                }}
                className={`min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tryTab === 'quiz'
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                Phản xạ nhanh
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setTryTab('hanviet');
                }}
                className={`min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tryTab === 'hanviet'
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                Gốc Hán-Việt
              </button>
            </div>
          </div>

          {tryTab === 'quiz' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] px-2.5 py-1 rounded-lg">
                  Điểm thử: {practiceScore} XP
                </span>
                <span className="text-[#748092] dark:text-[#94A3B8]">
                  Câu {practiceIndex + 1}/{QUICK_PRACTICE.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 text-center p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center">
                  <h3 className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl font-black text-[#E85D3F] my-1">
                    {currentPractice.hanzi}
                  </h3>
                  <p className="text-xs font-bold text-[#243447] dark:text-white mb-2">
                    {currentPractice.pinyin}
                  </p>
                  <button
                    type="button"
                    onClick={() => speakChinese(currentPractice.hanzi)}
                    className="min-h-[44px] sm:min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] text-xs font-bold hover:border-[#E85D3F] transition-colors cursor-pointer"
                  >
                    <Volume2 size={14} />
                    <span>Nghe phát âm</span>
                  </button>
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  {currentPractice.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === oIdx;
                    const isCorrect = oIdx === currentPractice.correctIndex;
                    let btnStyle =
                      'bg-white dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-[#EBF8F2] dark:bg-[#162B21] border-[#45B97C] text-[#45B97C] font-bold';
                      } else if (isSelected) {
                        btnStyle =
                          'bg-[#FDEEEB] dark:bg-[#2D1E1B] border-[#E85D3F] text-[#E85D3F] font-bold';
                      } else {
                        btnStyle =
                          'opacity-50 border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092]';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={selectedAnswer !== null}
                        onClick={() => handleSelectPracticeOption(oIdx)}
                        className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && isCorrect && (
                          <Check size={16} className="text-[#45B97C]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedAnswer !== null && (
                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                    💡 <strong>Giải nghĩa:</strong> {currentPractice.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextPractice}
                    className="min-h-[44px] sm:min-h-[36px] self-end sm:self-auto px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Câu tiếp</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {SINO_VIETNAMESE_WORDS.map((w) => {
                  const isActive = activeSinoWord.hanzi === w.hanzi;
                  return (
                    <button
                      key={w.hanzi}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setActiveSinoWord(w);
                        speakChinese(w.hanzi);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FFF9F2] dark:bg-[#2D1E1B] border-[#E85D3F] shadow-xs'
                          : 'bg-[#FFFDF9] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/50'
                      }`}
                    >
                      <span className="font-['Noto_Serif_SC'] text-xl sm:text-2xl font-black text-[#E85D3F] block">
                        {w.hanzi}
                      </span>
                      <p className="text-[11px] font-bold text-[#243447] dark:text-white mt-0.5 truncate">
                        {w.hanViet}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F4B942]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-['Noto_Serif_SC'] text-lg font-black text-[#E85D3F]">
                      {activeSinoWord.hanzi}
                    </span>
                    <span className="text-xs font-bold text-[#243447] dark:text-white">
                      ({activeSinoWord.pinyin})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E85D3F]/10 text-[#E85D3F] text-[11px] font-bold">
                      Hán-Việt: {activeSinoWord.hanViet}
                    </span>
                  </div>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">
                    Nghĩa: <strong className="text-[#243447] dark:text-white">{activeSinoWord.meaning}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <AudioButton text={activeSinoWord.hanzi} size="sm" />
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveTab('vocabulary');
                    }}
                    className="min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Mở Flashcard</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 cols: 6 Core Ecosystem Tools (grid-cols-2 gap-2.5) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#243447] dark:text-white">
                Hệ sinh thái 6 kỹ năng cốt lõi
              </h2>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                Chọn bất kỳ công cụ nào để trải nghiệm ngay
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {CORE_ECOSYSTEM_SHORTCUTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab(item.id);
                  }}
                  className="min-h-[84px] p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-left flex flex-col justify-between gap-2 transition-all active:scale-95 cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#243447] dark:text-white truncate group-hover:text-[#E85D3F] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">
                      {item.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          TẦNG 3: KHÁM PHÁ SÂU (PROGRESSIVE DISCLOSURE TABS) + CTA CUỐI TRANG
      ===================================================================== */}
      <section aria-label="Khám phá bài học, hỏi đáp và học liệu" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
              Khám phá lộ trình & giải đáp
            </h2>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Xem trước bài học nhập môn, câu hỏi thường gặp hoặc các công cụ AI nâng cao.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Tab khám phá cho khách"
            className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto max-w-full scrollbar-none shadow-xs"
          >
            {[
              { id: 'lessons', label: 'Bài học khởi đầu', icon: BookOpen },
              { id: 'faq', label: 'Hỏi đáp (FAQ)', icon: HelpCircle },
              { id: 'explore', label: 'AI & Học liệu', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = exploreTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    playClickSound();
                    setExploreTab(tab.id);
                  }}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E85D3F] text-white shadow-sm'
                      : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: BÀI HỌC KHỞI ĐẦU & GỢI Ý CÁ NHÂN HÓA */}
        {exploreTab === 'lessons' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {starterLessons.slice(0, 3).map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onSelectLesson) {
                      onSelectLesson(lesson.id);
                    } else {
                      setActiveTab('roadmap');
                    }
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs hover:border-[#E85D3F] transition-all text-left flex flex-col justify-between gap-4 cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold">
                        Bài {lesson.lessonNumber || 1} • HSK 1
                      </span>
                      <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-medium flex items-center gap-1">
                        <Clock size={12} />
                        <span>{lesson.durationMinutes || 15}p</span>
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1.5 line-clamp-2">
                      {lesson.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-xs font-bold">
                    <span className="text-[#45B97C]">+{lesson.xpReward || 50} XP</span>
                    <span className="text-[#E85D3F] inline-flex items-center gap-1">
                      <span>Học thử ngay</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Compact Placement / Personalized Strip */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-[#243447] dark:text-white">
                    Chưa biết bắt đầu từ cấp HSK nào?
                  </span>
                  <AiContextBadge
                    type={studyPlan?.isOffline ? 'offline_rule' : 'ai_pedagogy'}
                    size="xs"
                  />
                </div>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Làm nhanh bài xếp lớp Placement Test hoặc xem đầy đủ lộ trình 180 bài HSK 1–9.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab('roadmap');
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass size={14} className="text-[#E85D3F]" />
                  <span>Xem đủ 180 bài</span>
                </button>
              </div>
            </div>

            {!learnerContext.hasSparseData && (studyPlan?.dailyPlan || []).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(studyPlan?.dailyPlan || []).slice(0, 2).map((item) => (
                  <PersonalizedRecommendationCard
                    key={item.id}
                    item={item}
                    onNavigate={(route, targetRef) => {
                      playClickSound();
                      if (route === 'roadmap' && targetRef && onSelectLesson) {
                        onSelectLesson(targetRef);
                      } else {
                        setActiveTab(route);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FAQ ACCORDION */}
        {exploreTab === 'faq' && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            {FAQS.map((faq, fIdx) => {
              const isExpanded = expandedFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setExpandedFaqIndex(isExpanded ? -1 : fIdx);
                    }}
                    className="min-h-[48px] w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#243447] dark:text-white hover:text-[#E85D3F] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-[#E85D3F] shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#748092] shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#E85D3F]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 border-t border-[#F1E5D8]/50 dark:border-[#2B3A4F]/50 text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: AI & HỌC LIỆU */}
        {exploreTab === 'explore' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            {[
              {
                tab: 'conversation',
                icon: MessageCircle,
                color: 'text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40',
                title: 'Hội thoại AI ngữ cảnh',
                desc: 'Đóng vai giao tiếp thực tế (mua sắm, du lịch, phỏng vấn) có chấm điểm phản xạ.',
              },
              {
                tab: 'reader',
                icon: BookOpen,
                color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40',
                title: 'Đọc hiểu & Tách từ NLP',
                desc: 'Bấm trực tiếp vào từng chữ Hán trong bài đọc để tra Pinyin, Hán-Việt và lưu SRS.',
              },
              {
                tab: 'materials',
                icon: FolderDown,
                color: 'text-[#EA580C] bg-orange-50 dark:bg-orange-950/40',
                title: 'Thư viện PDF & File nghe',
                desc: 'Tải miễn phí giấy luyện viết ô mễ tự A4, 214 bộ thủ và đề thi HSK có MP3.',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.tab}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab(card.tab);
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-left space-y-3 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                    {card.desc}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================================
          COMPACT FINAL CTA BANNER
      ===================================================================== */}
      <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#E85D3F] via-[#CB4529] to-[#992E17] text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-5 relative z-10">
          <div className="space-y-1 sm:space-y-1.5 max-w-xl">
            <h2 className="text-lg sm:text-2xl font-black">
              Sẵn sàng bắt đầu 15 phút học tiếng Trung mỗi ngày?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 line-clamp-2 sm:line-clamp-none">
              Tạo tài khoản miễn phí để đồng bộ tiến độ 180 bài HSK 1–9, chuỗi ngày học và kho SRS trên mọi thiết bị.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleStartLearning}
              className="min-h-[46px] px-6 py-3 rounded-xl bg-white text-[#E85D3F] hover:bg-[#FFF9F2] font-black text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {!user ? (
                <>
                  <UserPlus size={18} />
                  <span>Đăng ký miễn phí</span>
                </>
              ) : (
                <>
                  <span>Vào học ngay</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
