import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Volume2,
  X,
  Edit3,
  Shuffle
} from 'lucide-react';
import { speakChinese, playSuccessSound, playClickSound, playErrorSound } from '../utils/audio';
import { recordAuditLog, AUDIT_CATEGORIES, AUDIT_SEVERITY } from '../services/auditLogService';
import { getDailyQuote, getRandomQuote } from '../data/dailyQuotesData';
import { fetchDailyQuotes, getNextRandomQuote, calculateQuoteOfTheDay } from '../services/dailyQuotesService';
import { ZaloBrandIcon, FacebookBrandIcon } from './common/SocialBrandIcons';

const DEFAULT_WELCOME_LESSON = {
  character: '好',
  pinyin: 'hǎo',
  meaning: 'Tốt, đẹp, hay, được',
  hanViet: 'HẢO',
  hskLevel: 'HSK 1',
  breakdown: 'Bộ Nữ (女 - người phụ nữ) + bộ Tử (子 - đứa con).',
  mnemonic: 'Người mẹ ôm đứa con thơ là biểu tượng tuyệt đẹp của tình mẫu tử, sự viên mãn và những điều tốt lành (Hảo).',
  strokeCount: 6,
  examples: [
    { zh: '你好！', py: 'Nǐ hǎo!', vi: 'Xin chào!' },
    { zh: '今天天气很好。', py: 'Jīntiān tiānqì hěn hǎo.', vi: 'Hôm nay thời tiết rất đẹp.' }
  ]
};

const DEFAULT_QUOTE = {
  id: 10,
  hanzi: '持之以恒，金石可镂',
  pinyin: 'Chí zhī yǐ héng, jīn shí kě lòu',
  meaning: 'Kiên trì bền bỉ, sắt đá ngàn năm cũng có thể khắc chạm thành tác phẩm.',
  author: 'Tuân Tử — Khuyến Học'
};

export default function Footer({ setActiveTab, user = null }) {
  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');
  const [emailInput, setEmailInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'already' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [todayLesson, setTodayLesson] = useState(DEFAULT_WELCOME_LESSON);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(DEFAULT_QUOTE);
  const [quotesPool, setQuotesPool] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchDailyQuotes().then(quotes => {
      if (isMounted && quotes && quotes.length > 0) {
        setQuotesPool(quotes);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleNextQuote = () => {
    playClickSound();
    setCurrentQuote(prev => getNextRandomQuote(prev?.id, quotesPool));
  };

  const handleNav = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    // Kiểm tra định dạng email chuẩn RFC
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      playErrorSound();
      setStatus('error');
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ (ví dụ: ban@gmail.com).');
      return;
    }

    playClickSound();
    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Kiểm tra trong danh sách đã đăng ký cục bộ trước
      const STORAGE_KEY = 'hanzigo_newsletter_subscribers';
      let existingList = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) existingList = JSON.parse(stored);
      } catch {}

      if (existingList.some(item => (typeof item === 'string' ? item : item.email) === cleanEmail)) {
        setStatus('already');
        playSuccessSound();
        return;
      }

      // 2. Gửi tới API backend Vercel /api/newsletter/subscribe
      let apiSuccess = false;
      let fetchedLesson = DEFAULT_WELCOME_LESSON;

      try {
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            source: 'footer_newsletter'
          })
        });

        if (res.ok) {
          const data = await res.json();
          apiSuccess = true;
          if (data.lesson) fetchedLesson = data.lesson;
          if (data.isNewSubscriber === false) {
            setStatus('already');
            playSuccessSound();
            return;
          }
        } else if (res.status === 429) {
          setStatus('error');
          setErrorMessage('Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.');
          playErrorSound();
          return;
        }
      } catch (networkErr) {
        // Môi trường dev hoặc offline -> graceful fallback
      }

      // 3. Lưu vào danh sách subscribers cục bộ
      const newEntry = {
        email: cleanEmail,
        subscribedAt: new Date().toISOString(),
        source: 'footer_newsletter'
      };
      existingList.unshift(newEntry);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingList));
      } catch {}

      // 4. Ghi audit log hệ thống
      recordAuditLog({
        action: 'NEWSLETTER_SUBSCRIBE',
        category: AUDIT_CATEGORIES.AUTH,
        severity: AUDIT_SEVERITY.INFO,
        actorId: 'anonymous_visitor',
        targetId: cleanEmail,
        metadata: {
          subscribedAt: newEntry.subscribedAt,
          source: 'footer_daily_lesson',
          apiSynced: apiSuccess
        }
      });

      setTodayLesson(fetchedLesson);
      playSuccessSound();
      setStatus('success');
      setEmailInput('');
    } catch (err) {
      console.warn('Lỗi đăng ký newsletter:', err);
      playErrorSound();
      setStatus('error');
      setErrorMessage('Không thể hoàn tất đăng ký lúc này. Vui lòng thử lại sau.');
    }
  };

  return (
    <footer className="bg-[#182330] text-white pt-12 pb-12 border-t border-[#233346] relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-4 bottom-1 font-['Noto_Serif_SC'] text-[9rem] sm:text-[11rem] font-black text-white/[0.035] select-none pointer-events-none leading-none">
        汉语
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Highlight Banner: Warm Asian-Modern Cultural Quote Card */}
        <div className="mb-14 px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8 rounded-3xl bg-[#DF5334] shadow-xl shadow-[#DF5334]/20 relative overflow-hidden transition-all group">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Quote Body */}
            <div className="space-y-2 text-left flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs shadow-xs">
                  <Sparkles size={13} className="text-white" />
                  <span>Châm ngôn mỗi ngày</span>
                </div>
                <button
                  type="button"
                  onClick={handleNextQuote}
                  className="px-3 py-1 rounded-full bg-black/15 hover:bg-black/25 active:scale-95 text-white/95 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Bấm để đổi và khám phá thêm các câu châm ngôn ý nghĩa khác"
                >
                  <Shuffle size={12} />
                  <span>Đổi câu khác</span>
                </button>
              </div>

              {/* Chinese Calligraphy Characters */}
              <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black font-['Noto_Serif_SC'] tracking-wider text-white drop-shadow-xs my-1">
                {currentQuote.hanzi}
              </h3>

              {/* Pinyin, Meaning & Author */}
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal">
                <span className="font-medium mr-1.5">{currentQuote.pinyin}</span>
                <span>— <span className="italic">"{currentQuote.meaning}"</span></span>
                {currentQuote.author && (
                  <span className="text-xs text-white/80 ml-2 font-normal">({currentQuote.author})</span>
                )}
              </p>
            </div>

            {/* Pronounce Action Button */}
            <button
              type="button"
              onClick={() => speakChinese(currentQuote.hanzi)}
              className="px-6 py-3 rounded-full bg-white hover:bg-orange-50 active:scale-95 text-[#DF5334] font-bold text-xs sm:text-sm shadow-lg shadow-black/15 hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shrink-0 self-start sm:self-center lg:self-center"
              title={`Nghe phát âm chuẩn: "${currentQuote.hanzi}"`}
            >
              <Volume2 size={16} />
              <span>Nghe phát âm</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Main Footer Links: 4 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#233346]/80">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DF5334] flex items-center justify-center text-white font-bold shadow-md">
                <span className="font-['Noto_Serif_SC'] text-2xl font-black">汉</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Hanzi<span className="text-[#DF5334]">Go</span>
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Nền tảng học tiếng Trung trực tuyến hiện đại dành riêng cho người Việt Nam. Tối ưu phương pháp phản xạ, chiết tự chữ Hán, phát âm chuẩn Bắc Kinh và đồng hành cùng bạn thi đỗ HSK.
            </p>

            <div className="pt-2 text-xs text-[#94A3B8] space-y-2">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#DF5334] shrink-0" />
                <span>lehaidang16032006@gmail.com</span>
              </p>
              <a
                href="https://zalo.me/03995095780"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors w-fit"
              >
                <ZaloBrandIcon size={14} className="shrink-0" />
                <span>Zalo liên hệ</span>
              </a>
              <a
                href="https://www.facebook.com/hdang.1603"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors w-fit"
              >
                <FacebookBrandIcon size={14} className="shrink-0" />
                <span>Facebook liên hệ</span>
              </a>
              <p className="flex items-center gap-2">
                <Globe size={14} className="text-[#45B97C] shrink-0" />
                <span>Đà Nẵng, Việt Nam</span>
              </p>
            </div>
          </div>

          {/* Links 1: Khóa học & Lộ trình */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B942]">
              Khóa học & Lộ trình
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Nhập môn Pinyin & Bút thuận</button></li>
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Khóa HSK 1 – 150 từ cơ bản</button></li>
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Khóa HSK 2 – Sơ cấp đàm thoại</button></li>
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Khóa HSK 3–4 Giao tiếp công sở</button></li>
              <li><button onClick={() => handleNav('hsk')} className="hover:text-white hover:translate-x-1 transition-all text-left font-medium cursor-pointer">Thi thử HSK 1–6 &amp; Nói HSKK</button></li>
              <li><button onClick={() => handleNav('hsk30-translation')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">HSK 3.0 (Cấp 7–9) &amp; Xưởng Dịch</button></li>
              <li><button onClick={() => handleNav('classroom')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Lớp học trực tuyến (Live)</button></li>
            </ul>
          </div>

          {/* Links 2: Tính năng nổi bật */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B942]">
              Tính năng nổi bật
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
              <li><button onClick={() => handleNav('materials')} className="text-[#F4B942] hover:text-amber-300 hover:translate-x-1 transition-all text-left font-medium cursor-pointer">Thư viện Tài liệu &amp; Giáo trình</button></li>
              <li><button onClick={() => handleNav('intelligence')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Trung tâm AI Học tập</button></li>
              <li><button onClick={() => handleNav('vocabulary')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Flashcard 3D thông minh SRS</button></li>
              <li><button onClick={() => handleNav('reader')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Đọc hiểu &amp; Đào câu (i+1)</button></li>
              <li><button onClick={() => handleNav('listening-studio')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Listening Studio &amp; Dictation</button></li>
              <li><button onClick={() => handleNav('video-studio')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Video Studio Song ngữ</button></li>
              <li><button onClick={() => handleNav('grammar')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Ngữ pháp HSK &amp; Bắt lỗi</button></li>
              <li><button onClick={() => handleNav('pronunciation')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Luyện phát âm &amp; Nhận diện giọng</button></li>
              <li><button onClick={() => handleNav('writing')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Từ điển &amp; Canvas viết mễ tự</button></li>
              <li><button onClick={() => handleNav('conversation')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Hội thoại AI Tiểu Hàm</button></li>
              <li><button onClick={() => handleNav('community')} className="hover:text-white hover:translate-x-1 transition-all text-left cursor-pointer">Cộng đồng &amp; Tìm bạn luyện nói</button></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscribe */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B942]">
              Nhận bài học mỗi ngày
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Đăng ký nhận mẹo nhớ chữ Hán và từ vựng thông dụng gửi vào hòm thư mỗi sáng.
            </p>

            {status === 'success' ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-2.5 animate-in fade-in duration-200 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Đăng ký thành công!</span>
                </div>
                <p className="text-[11px] text-white/85 leading-relaxed">
                  Cảm ơn bạn! Mẹo nhớ chữ Hán và bài học bổ ích sẽ được gửi đều đặn vào 07:00 sáng mỗi ngày.
                </p>
                <div className="pt-1 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <BookOpen size={13} />
                    <span>Mở bài học mở đầu hôm nay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold text-center cursor-pointer pt-0.5"
                  >
                    Đăng ký thêm email khác
                  </button>
                </div>
              </div>
            ) : status === 'already' ? (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs space-y-2.5 animate-in fade-in duration-200 shadow-lg shadow-amber-500/5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  <span>Email đã có trong danh sách!</span>
                </div>
                <p className="text-[11px] text-white/85 leading-relaxed">
                  Email của bạn đã được đăng ký từ trước. Bạn có thể mở xem ngay bài học chữ Hán đặc sắc hôm nay:
                </p>
                <div className="pt-1 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-[#F4B942] hover:bg-[#e0a835] text-[#1E293B] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <BookOpen size={13} />
                    <span>Xem bài học chữ Hán hôm nay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold text-center cursor-pointer pt-0.5"
                  >
                    Đăng ký email khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative">
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Nhập email của bạn..." 
                    required
                    disabled={status === 'loading'}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#131D28] border transition-colors text-white placeholder-slate-500 focus:outline-none ${
                      status === 'error' 
                        ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/30' 
                        : 'border-[#233346] focus:border-[#DF5334]'
                    }`}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-rose-400 text-[11px] animate-in fade-in">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#DF5334] hover:bg-[#C9472B] disabled:opacity-60 text-xs font-bold text-white transition-all shadow-md shadow-[#DF5334]/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Đang xử lý đăng ký...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng ký miễn phí 🚀</span>
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(true)}
                    className="text-[#F4B942] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles size={12} className="text-[#F4B942]" />
                    <span>Xem thử bài học mẫu hôm nay</span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  * Thông báo quyền riêng tư: Email chỉ dùng để gửi bài học hàng ngày, không chia sẻ cho bên thứ ba. Hủy đăng ký bất kỳ lúc nào.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4 relative z-10">
          <p>© 2026 HanziGo. Dự án giáo dục phi thương mại dành cho người Việt.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {isAdmin && (
              <button 
                onClick={() => handleNav('admin')} 
                className="text-[#DF5334] hover:text-[#f87171] font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck size={14} className="text-[#DF5334]" />
                <span>Quản trị viên (Admin)</span>
              </button>
            )}
            <a 
              href="#privacy" 
              onClick={(e) => {
                e.preventDefault();
                handleNav('privacy');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Chính sách bảo mật
            </a>
            <a 
              href="#terms" 
              onClick={(e) => {
                e.preventDefault();
                handleNav('terms');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Điều khoản sử dụng
            </a>
            <a 
              href="#cookies" 
              onClick={(e) => {
                e.preventDefault();
                handleNav('cookies');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Chính sách cookie
            </a>
            <a 
              href="#refund" 
              onClick={(e) => {
                e.preventDefault();
                handleNav('refund');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Học phí & Hoàn tiền
            </a>
            <a 
              href="#storage-preferences" 
              onClick={(e) => {
                e.preventDefault();
                handleNav('storage-preferences');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tùy chọn lưu trữ
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('hanzigo_open_consent_modal'))}
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer text-xs"
            >
              Tùy chọn lưu trữ
            </button>
          </div>
        </div>
      </div>

      {/* Daily Lesson Preview Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setShowLessonModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Đóng bài học"
            >
              <X size={20} />
            </button>

            {/* Header Tag */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30 text-xs font-bold flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Mẹo Nhớ Chữ Hán Hôm Nay</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {todayLesson.hskLevel || 'HSK 1'}
              </span>
            </div>

            {/* Character Spotlight */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#243447] to-[#162230] border border-[#2F4056] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-[#E85D3F]/15 border border-[#E85D3F]/40 flex items-center justify-center text-white shadow-inner">
                  <span className="font-['Noto_Serif_SC'] text-5xl font-black text-[#F4B942]">
                    {todayLesson.character}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-wide text-white">
                      {todayLesson.pinyin}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakChinese(todayLesson.character)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-[#E85D3F] text-white transition-colors cursor-pointer"
                      title="Phát âm chuẩn"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-[#F4B942]">
                    Hán-Việt: {todayLesson.hanViet}
                  </p>
                  <p className="text-xs text-slate-300">
                    Nghĩa: {todayLesson.meaning}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 space-y-1">
                <div>Số nét: <span className="text-white font-bold">{todayLesson.strokeCount || 6} nét</span></div>
                <div className="text-emerald-400 font-medium">7h sáng gửi bài mới</div>
              </div>
            </div>

            {/* Breakdown & Mnemonics */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-[#F4B942] flex items-center gap-1.5">
                  <BookOpen size={14} />
                  <span>Chiết tự bộ thủ</span>
                </div>
                <p className="text-slate-200">
                  {todayLesson.breakdown}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#E85D3F]/10 border border-[#E85D3F]/30 space-y-1">
                <div className="font-bold text-[#E85D3F] flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Mẹo liên tưởng ghi nhớ nhanh</span>
                </div>
                <p className="text-slate-200">
                  {todayLesson.mnemonic}
                </p>
              </div>
            </div>

            {/* Example Sentences */}
            {todayLesson.examples && todayLesson.examples.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ví dụ đàm thoại thực tế
                </h5>
                <div className="space-y-2">
                  {todayLesson.examples.map((ex, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-['Noto_Serif_SC'] font-bold text-white text-sm">
                            {ex.zh}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {ex.py}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          {ex.vi}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakChinese(ex.zh)}
                        className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                        title="Nghe câu ví dụ"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowLessonModal(false);
                  handleNav('writing');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Edit3 size={15} />
                <span>Tập viết chữ "{todayLesson.character}" ngay</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLessonModal(false)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
