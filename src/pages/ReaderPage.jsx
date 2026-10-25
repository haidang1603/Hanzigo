import React, { useState, useMemo, useCallback } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  Eye, 
  EyeOff, 
  Volume2, 
  Palette, 
  BookmarkPlus, 
  BookmarkCheck, 
  ExternalLink, 
  FileText, 
  PenTool, 
  HelpCircle, 
  ChevronRight, 
  X,
  Aperture,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AudioButton from '../components/AudioButton.jsx';
import { analyzeChineseText } from '../utils/chineseNlpEngine.js';
import { GRADED_READERS_DATA, getGradedReadersByLevel, getGradedReaderById } from '../data/gradedReadersData.js';
import { saveCustomVocab, getStoredCustomVocab } from '../utils/materialsStorage.js';
import { awardXp } from '../utils/gamification.js';
import { playClickSound, playSuccessSound, speakChinese } from '../utils/audio.js';

// Bảng màu phân cấp HSK
const HSK_BADGE_COLORS = {
  'HSK 1': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'HSK 2': 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  'HSK 3': 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  'HSK 4': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'HSK 5': 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'HSK 6': 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'Khác': 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
};

const HSK_HIGHLIGHT_STYLES = {
  'HSK 1': 'hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100',
  'HSK 2': 'hover:bg-teal-100/70 dark:hover:bg-teal-900/40 text-teal-950 dark:text-teal-100',
  'HSK 3': 'hover:bg-sky-100/70 dark:hover:bg-sky-900/40 text-sky-950 dark:text-sky-100',
  'HSK 4': 'hover:bg-amber-100/70 dark:hover:bg-amber-900/40 text-amber-950 dark:text-amber-100',
  'HSK 5': 'hover:bg-orange-100/70 dark:hover:bg-orange-900/40 text-orange-950 dark:text-orange-100',
  'HSK 6': 'hover:bg-rose-100/70 dark:hover:bg-rose-900/40 text-rose-950 dark:text-rose-100',
  'Khác': 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
};

// Mẫu văn bản tùy chỉnh gợi ý
const SAMPLE_CUSTOM_TEXTS = [
  {
    title: 'Ngân hàng & Đời sống (Từ đa âm 行)',
    text: '我明天得去中国银行开户办业务。一路上有一行人走过，大家都行色匆匆。'
  },
  {
    title: 'Học tập & Cảm giác (Từ đa âm 觉 / 得)',
    text: '今天上课我觉得很累，下午在房间里睡了个午觉。醒来后精神好多了，跑得也很快。'
  },
  {
    title: 'Âm nhạc & Trưởng thành (Từ đa âm 乐 / 长)',
    text: '小明渐渐长大了，他很喜欢听古典音乐。每当音乐响起，他都感到特别快乐。'
  }
];

export default function ReaderPage({ user, setActiveTab, onSelectWritingChar }) {
  // Mode: 'graded' (Bài đọc HSK) hoặc 'custom' (Dán văn bản)
  const [activeMode, setActiveMode] = useState('graded');
  const [selectedHskFilter, setSelectedHskFilter] = useState('all');
  const [activeReaderId, setActiveReaderId] = useState('gr-101');
  
  // Custom text input state
  const [customInput, setCustomInput] = useState('');
  const [customAnalyzedText, setCustomAnalyzedText] = useState('');

  // Reader display controls
  const [showPinyin, setShowPinyin] = useState(true);
  const [highlightHsk, setHighlightHsk] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSizeLevel, setFontSizeLevel] = useState('text-xl'); // 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'

  // Word Inspector Modal / Drawer
  const [inspectedWord, setInspectedWord] = useState(null);
  const [savedWordsMap, setSavedWordsMap] = useState(() => {
    const list = getStoredCustomVocab();
    const map = {};
    list.forEach(v => { if (v?.hanzi) map[v.hanzi] = true; });
    return map;
  });

  // Reading Comprehension Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  // Lấy dữ liệu bài đọc HSK hiện tại
  const currentGradedReader = useMemo(() => {
    return getGradedReaderById(activeReaderId) || GRADED_READERS_DATA[0];
  }, [activeReaderId]);

  // Lấy văn bản đang được kích hoạt để phân tích NLP
  const rawTextToAnalyze = useMemo(() => {
    if (activeMode === 'graded') {
      return currentGradedReader?.contentZh || '';
    }
    return customAnalyzedText || '请在上方输入框粘贴或输入需要分析的中文段落。';
  }, [activeMode, currentGradedReader, customAnalyzedText]);

  // Phân tích NLP với thuật toán Context-First
  const nlpAnalysis = useMemo(() => {
    return analyzeChineseText(rawTextToAnalyze);
  }, [rawTextToAnalyze]);

  // Xử lý chuyển bài đọc HSK
  const handleSelectGradedReader = (reader) => {
    playClickSound();
    setActiveReaderId(reader.id);
    setQuizAnswers({});
    setQuizFeedback({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý phân tích văn bản tùy chỉnh
  const handleAnalyzeCustomText = () => {
    if (!customInput.trim()) {
      showToast('Vui lòng nhập hoặc dán đoạn văn tiếng Trung trước khi phân tích!');
      return;
    }
    if (customInput.length > 2000) {
      showToast('Đoạn văn vượt quá giới hạn 2.000 ký tự. Vui lòng rút ngắn lại!');
      return;
    }
    playClickSound();
    setCustomAnalyzedText(customInput);
    showToast('Đã phân tích văn bản thành công!');
  };

  // Nạp văn bản mẫu vào ô nhập
  const handleLoadSample = (sample) => {
    playClickSound();
    setCustomInput(sample.text);
    setCustomAnalyzedText(sample.text);
    showToast(`Đã nạp đoạn văn mẫu: "${sample.title}"`);
  };

  // Lưu từ vựng vào Flashcard SRS
  const handleSaveToFlashcard = (token) => {
    if (!token || !token.raw) return;
    playClickSound();

    const newVocabItem = {
      id: `srs-reader-${Date.now()}-${token.raw}`,
      hanzi: token.raw,
      traditional: token.traditional || token.raw,
      pinyin: token.pinyin,
      hanviet: token.hanviet || '',
      meaning: token.meaningVi || 'Đang cập nhật',
      level: token.level || 'HSK 1',
      topic: 'Bài đọc thông minh',
      radical: token.decomposition?.components?.[0]?.name || '—',
      strokes: token.raw.length * 6,
      mnemonic: token.mnemonic || token.decomposition?.mnemonic || 'Ghi nhớ qua bài đọc ngữ cảnh HanziGo.',
      en: token.meaningEn || '',
      pos: token.pos || 'Từ vựng',
      example: {
        hanzi: rawTextToAnalyze.slice(0, 50),
        pinyin: '',
        meaning: 'Trích từ bài đọc thông minh HanziGo'
      }
    };

    saveCustomVocab(newVocabItem);
    setSavedWordsMap(prev => ({ ...prev, [token.raw]: true }));
    awardXp(10, user, `srs_save_${token.raw}`);
    playSuccessSound();
    showToast(`✓ Đã lưu từ "${token.raw}" vào Flashcard SRS (+10 XP)!`);

    // Phát sự kiện toàn cục để trang VocabularyPage tự động cập nhật
    window.dispatchEvent(new CustomEvent('hanzigo_vocab_updated', { detail: newVocabItem }));
  };

  // Chuyển sang trang luyện viết cho chữ Hán
  const handleGoToWriteChar = (char) => {
    playClickSound();
    if (onSelectWritingChar) {
      onSelectWritingChar(char);
    }
    if (setActiveTab) {
      setActiveTab('writing');
    }
  };

  // Xử lý nộp câu trả lời đọc hiểu
  const handleAnswerQuiz = (qIdx, optIdx, correctIdx) => {
    playClickSound();
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const isCorrect = optIdx === correctIdx;
    setQuizFeedback(prev => ({ ...prev, [qIdx]: isCorrect }));

    if (isCorrect) {
      playSuccessSound();
      awardXp(15, user, `graded_quiz_${activeReaderId}_${qIdx}`);
      showToast('🎉 Chính xác! Bạn nhận được +15 XP!');
    }
  };

  // Danh sách bài đọc phân cấp theo filter
  const filteredGradedReaders = useMemo(() => {
    return getGradedReadersByLevel(selectedHskFilter);
  }, [selectedHskFilter]);

  return (
    <div className="w-full max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-br from-[#FFF9F2] via-white to-[#FCEEE2] dark:from-[#131B24] dark:via-[#1E293B] dark:to-[#0F172A] rounded-3xl p-6 sm:p-8 border border-[#F1E5D8] dark:border-[#334155] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E85D3F]/10 text-[#E85D3F] border border-[#E85D3F]/20 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Smart Chinese Reader & NLP
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Phiên âm Pinyin theo ngữ cảnh • Tách từ chống lỗi đa âm • Lưu thẻ SRS tức thì
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#243447] dark:text-[#F3F4F6] tracking-tight">
            Đọc hiểu Thông minh & Bóc tách Từ vựng
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Khám phá 12 bài đọc văn hóa phân cấp HSK 1–6 hoặc phân tích bất kỳ đoạn văn nào của bạn. Bấm vào từ bất kỳ để xem Pinyin ngữ cảnh, âm Hán-Việt, chiết tự IDS và lưu vào Flashcard ôn tập lặp lại ngắt quãng (SM-2).
          </p>

          {/* Mode Tabs: Graded Readers vs Custom Text Input */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => { playClickSound(); setActiveMode('graded'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeMode === 'graded'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/20 scale-102'
                  : 'bg-white dark:bg-[#1E293B] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#E85D3F]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Kho Bài đọc HSK 1–6 (12 bài)</span>
            </button>

            <button
              type="button"
              onClick={() => { playClickSound(); setActiveMode('custom'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeMode === 'custom'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/20 scale-102'
                  : 'bg-white dark:bg-[#1E293B] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#E85D3F]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Dán đoạn văn tùy chỉnh (NLP Analyzer)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Control Area: Level Selection or Custom Input Bar */}
      {activeMode === 'graded' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* HSK Level Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">Cấp độ:</span>
              {['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => { playClickSound(); setSelectedHskFilter(lvl); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHskFilter === lvl
                      ? 'bg-[#E85D3F] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1E293B] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả' : lvl}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500">
              Hiển thị {filteredGradedReaders.length} bài đọc
            </div>
          </div>

          {/* Graded Reader Horizontal Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredGradedReaders.map(reader => (
              <div
                key={reader.id}
                onClick={() => handleSelectGradedReader(reader)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left ${
                  activeReaderId === reader.id
                    ? 'bg-orange-50/80 dark:bg-orange-950/20 border-[#E85D3F] shadow-sm ring-2 ring-[#E85D3F]/20'
                    : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700/80 hover:border-orange-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${HSK_BADGE_COLORS[reader.level]}`}>
                      {reader.level}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      {reader.wordCount} chữ • {reader.readTimeMinutes} phút
                    </span>
                  </div>
                  <h3 className="font-['Noto_Serif_SC'] font-bold text-base text-gray-900 dark:text-white truncate">
                    {reader.titleZh}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {reader.titleVi}
                  </p>
                </div>
                <div className="text-[11px] text-[#E85D3F] font-semibold flex items-center gap-1 pt-1 border-t border-gray-100 dark:border-gray-800">
                  <span>Chủ đề: {reader.topic}</span>
                  <ChevronRight size={12} className="ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Custom Text Input Mode Area */
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 space-y-3 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <FileText size={14} className="text-[#E85D3F]" />
              Dán đoạn văn tiếng Trung cần phân tích (Tối đa 2.000 ký tự):
            </label>
            <span className={`text-xs font-medium ${customInput.length > 2000 ? 'text-rose-500 font-bold' : 'text-gray-400'}`}>
              {customInput.length} / 2.000 ký tự
            </span>
          </div>

          <textarea
            rows={4}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Dán hoặc gõ đoạn văn tiếng Trung tại đây... (Ví dụ: 我明天得去银行办业务，今天我觉得很累。)"
            className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#E85D3F] focus:ring-1 focus:ring-[#E85D3F] font-['Noto_Serif_SC']"
          />

          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            {/* Quick Sample Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-gray-400 font-medium">Đoạn văn mẫu:</span>
              {SAMPLE_CUSTOM_TEXTS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(s)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 hover:text-[#E85D3F] transition-all font-medium border border-gray-200 dark:border-gray-700"
                >
                  {s.title}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAnalyzeCustomText}
              className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#D4482A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/20 flex items-center gap-1.5 transition-all ml-auto"
            >
              <Sparkles size={14} />
              <span>Phân tích văn bản bằng NLP</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Interactive Workspace (2 Columns Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Interactive Text Reader */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Reader Top Controls Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3 shadow-xs">
            {/* Left Controls: Pinyin & HSK Highlighting */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => { playClickSound(); setShowPinyin(!showPinyin); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  showPinyin 
                    ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 text-[#E85D3F]' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}
              >
                {showPinyin ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>Pinyin ngữ cảnh</span>
              </button>

              <button
                type="button"
                onClick={() => { playClickSound(); setHighlightHsk(!highlightHsk); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  highlightHsk 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}
              >
                <Palette size={13} />
                <span>Tô màu cấp HSK</span>
              </button>

              {activeMode === 'graded' && (
                <button
                  type="button"
                  onClick={() => { playClickSound(); setShowTranslation(!showTranslation); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                    showTranslation 
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                  }`}
                >
                  <FileText size={13} />
                  <span>Dịch nghĩa tiếng Việt</span>
                </button>
              )}
            </div>

            {/* Right Controls: Font size & Audio */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700 text-xs">
                <button
                  type="button"
                  onClick={() => setFontSizeLevel('text-lg')}
                  className={`px-2 py-0.5 rounded font-bold ${fontSizeLevel === 'text-lg' ? 'bg-white dark:bg-gray-700 shadow-xs' : 'text-gray-500'}`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizeLevel('text-xl')}
                  className={`px-2 py-0.5 rounded font-bold ${fontSizeLevel === 'text-xl' ? 'bg-white dark:bg-gray-700 shadow-xs' : 'text-gray-500'}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizeLevel('text-2xl')}
                  className={`px-2 py-0.5 rounded font-bold ${fontSizeLevel === 'text-2xl' ? 'bg-white dark:bg-gray-700 shadow-xs' : 'text-gray-500'}`}
                >
                  A+
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  speakChinese(rawTextToAnalyze.slice(0, 200));
                  showToast('Đang phát âm giọng đọc bài...');
                }}
                className="p-1.5 rounded-lg bg-orange-100/70 hover:bg-orange-200 text-[#E85D3F] transition-colors"
                title="Nghe phát âm đoạn văn"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          {/* Interactive Text Display Canvas */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            {activeMode === 'graded' && currentGradedReader && (
              <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${HSK_BADGE_COLORS[currentGradedReader.level]}`}>
                    {currentGradedReader.level}
                  </span>
                  <span className="text-xs text-gray-400">
                    Chủ đề: {currentGradedReader.topic}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-['Noto_Serif_SC']">
                  {currentGradedReader.titleZh}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentGradedReader.titleVi}
                </p>
              </div>
            )}

            {/* Paragraphs with Tokens */}
            <div className="space-y-6">
              {nlpAnalysis.paragraphs.map((para) => (
                <div key={para.id} className="space-y-2">
                  <div className={`leading-loose tracking-wide flex flex-wrap items-baseline gap-x-1 gap-y-2 ${fontSizeLevel}`}>
                    {para.tokens.map((tok, tokIdx) => {
                      if (!tok.isChinese) {
                        return (
                          <span key={tokIdx} className="text-gray-600 dark:text-gray-400 font-medium select-none">
                            {tok.raw}
                          </span>
                        );
                      }

                      const isSelected = inspectedWord?.raw === tok.raw;
                      const isSaved = Boolean(savedWordsMap[tok.raw]);
                      const hskStyle = highlightHsk ? HSK_HIGHLIGHT_STYLES[tok.level || 'Khác'] : 'hover:bg-orange-50';

                      return (
                        <span
                          key={tokIdx}
                          onClick={() => {
                            playClickSound();
                            setInspectedWord(tok);
                          }}
                          className={`inline-block px-1 py-0.5 rounded-lg cursor-pointer transition-all border ${hskStyle} ${
                            isSelected 
                              ? 'bg-orange-100/90 dark:bg-orange-950/60 border-[#E85D3F] ring-2 ring-[#E85D3F]/30 scale-105' 
                              : isSaved
                              ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30'
                              : 'border-transparent'
                          }`}
                        >
                          {showPinyin && tok.pinyin ? (
                            <ruby className="font-['Noto_Serif_SC'] font-bold select-text">
                              {tok.raw}
                              <rt className="text-[10px] font-sans font-medium text-[#E85D3F] select-none block text-center leading-none">
                                {tok.pinyin}
                              </rt>
                            </ruby>
                          ) : (
                            <span className="font-['Noto_Serif_SC'] font-bold">
                              {tok.raw}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Song ngữ: Bản dịch tiếng Việt tự nhiên */}
            {activeMode === 'graded' && showTranslation && currentGradedReader?.translationVi && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-gray-800/60 border border-amber-200/70 dark:border-gray-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <FileText size={14} />
                  <span>Bản dịch tiếng Việt tham khảo:</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentGradedReader.translationVi}
                </p>
              </div>
            )}
          </div>

          {/* 4. Reading Comprehension Quizzes (Cho chế độ Graded Reader) */}
          {activeMode === 'graded' && currentGradedReader?.questions && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#E85D3F]" />
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Kiểm tra Đọc hiểu (Reading Comprehension)
                </h3>
              </div>

              <div className="space-y-5">
                {currentGradedReader.questions.map((q, qIdx) => {
                  const selectedOpt = quizAnswers[qIdx];
                  const hasAnswered = selectedOpt !== undefined;
                  const isCorrect = quizFeedback[qIdx];

                  return (
                    <div key={qIdx} className="p-4 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-3">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        Câu {qIdx + 1}: {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedOpt === optIdx;
                          let btnStyle = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300';
                          
                          if (hasAnswered) {
                            if (optIdx === q.answerIndex) {
                              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold';
                            } else if (isOptionSelected) {
                              btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300 font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleAnswerQuiz(qIdx, optIdx, q.answerIndex)}
                              className={`p-2.5 rounded-xl border text-xs sm:text-sm text-left transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div className={`p-3 rounded-xl text-xs space-y-1 ${
                          isCorrect 
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200' 
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200'
                        }`}>
                          <p className="font-bold flex items-center gap-1">
                            {isCorrect ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                            {isCorrect ? 'Tuyệt vời! Bạn đã chọn đáp án đúng (+15 XP).' : 'Chưa chính xác! Hãy đọc kỹ lời giải thích sau:'}
                          </p>
                          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 Cols): Word Inspector Popover & Learning Actions */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          
          {/* Word Inspector Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E85D3F]">
                <Aperture size={15} />
                <span>Word Inspector (Tra từ ngữ cảnh)</span>
              </div>
              {inspectedWord && (
                <button
                  type="button"
                  onClick={() => setInspectedWord(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {inspectedWord ? (
              <div className="space-y-4">
                {/* Hero Hanzi & Pinyin */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
                        {inspectedWord.raw}
                      </span>
                      {inspectedWord.traditional && inspectedWord.traditional !== inspectedWord.raw && (
                        <span className="font-['Noto_Serif_SC'] text-lg font-bold text-gray-400">
                          ({inspectedWord.traditional})
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[#E85D3F] mt-1">
                      {inspectedWord.pinyin}
                    </div>
                  </div>

                  <AudioButton text={inspectedWord.raw} size="md" />
                </div>

                {/* Badges Bar: Level, POS, Hanviet */}
                <div className="flex items-center gap-2 flex-wrap">
                  {inspectedWord.level && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${HSK_BADGE_COLORS[inspectedWord.level]}`}>
                      {inspectedWord.level}
                    </span>
                  )}
                  {inspectedWord.pos && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                      {inspectedWord.pos}
                    </span>
                  )}
                  {inspectedWord.hanviet && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60">
                      Âm: {inspectedWord.hanviet}
                    </span>
                  )}
                </div>

                {/* Meaning Section */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nghĩa tiếng Việt:</span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {inspectedWord.meaningVi}
                  </p>
                  {inspectedWord.meaningEn && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                      EN: {inspectedWord.meaningEn}
                    </p>
                  )}
                </div>

                {/* Chiết tự IDS & Cấu tạo chữ (Decomposition) */}
                {inspectedWord.decomposition && (
                  <div className="p-3.5 rounded-2xl bg-orange-50/50 dark:bg-gray-800/50 border border-orange-200/60 dark:border-gray-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E85D3F] flex items-center gap-1">
                        <PenTool size={12} />
                        Chiết tự IDS ({inspectedWord.decomposition.symbol})
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {inspectedWord.decomposition.structureName}
                      </span>
                    </div>

                    {inspectedWord.decomposition.ids && (
                      <div className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-1.5 rounded-lg border border-orange-100 dark:border-gray-800">
                        Mô tả cấu trúc: <span className="text-[#E85D3F]">{inspectedWord.decomposition.ids}</span>
                      </div>
                    )}

                    {inspectedWord.decomposition.components && inspectedWord.decomposition.components.length > 0 && (
                      <div className="space-y-1 text-xs">
                        {inspectedWord.decomposition.components.map((comp, cIdx) => (
                          <div key={cIdx} className="flex items-baseline gap-1.5 text-gray-700 dark:text-gray-300">
                            <span className="font-['Noto_Serif_SC'] font-bold text-sm text-[#E85D3F]">{comp.char}</span>
                            <span className="text-gray-500">({comp.pinyin || ''}):</span>
                            <span>{comp.meaning || comp.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {inspectedWord.decomposition.mnemonic && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 italic pt-1 border-t border-orange-100 dark:border-gray-800">
                        💡 {inspectedWord.decomposition.mnemonic}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveToFlashcard(inspectedWord)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      savedWordsMap[inspectedWord.raw]
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#E85D3F] hover:bg-[#D4482A] text-white shadow-md shadow-[#E85D3F]/20'
                    }`}
                  >
                    {savedWordsMap[inspectedWord.raw] ? (
                      <>
                        <BookmarkCheck size={16} />
                        <span>✓ Đã lưu vào Flashcard SRS</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus size={16} />
                        <span>Lưu vào Sổ tay Flashcard (+10 XP)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoToWriteChar(inspectedWord.chars?.[0] || inspectedWord.raw[0])}
                    className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PenTool size={13} />
                    <span>Luyện viết chữ "{inspectedWord.chars?.[0] || inspectedWord.raw[0]}"</span>
                    <ExternalLink size={12} className="ml-1 opacity-60" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-3 text-gray-400">
                <BookOpen className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Hãy bấm vào bất kỳ từ vựng nào trong đoạn văn để tra Pinyin ngữ cảnh, âm Hán-Việt, chiết tự và lưu vào Flashcard!
                </p>
              </div>
            )}
          </div>

          {/* Reading Statistics Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Phân bố độ khó văn bản (HSK Distribution)
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400 block text-[10px]">Tổng ký tự:</span>
                <span className="text-base font-black text-gray-800 dark:text-gray-200">{nlpAnalysis.stats.chineseChars} chữ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400 block text-[10px]">Số lượng từ vựng:</span>
                <span className="text-base font-black text-[#E85D3F]">{nlpAnalysis.stats.wordCount} từ</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(lvl => {
                const count = nlpAnalysis.stats.hskStats[lvl] || 0;
                const pct = nlpAnalysis.stats.wordCount > 0 ? Math.round((count / nlpAnalysis.stats.wordCount) * 100) : 0;
                if (count === 0) return null;

                return (
                  <div key={lvl} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">{lvl}:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#E85D3F] h-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-gray-900/95 text-white text-xs sm:text-sm font-bold shadow-xl border border-gray-700 animate-fade-in flex items-center gap-2">
          <Sparkles size={14} className="text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
