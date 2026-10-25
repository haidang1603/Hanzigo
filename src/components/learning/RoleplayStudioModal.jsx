import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  Languages, 
  Type, 
  BookmarkPlus, 
  Award,
  RefreshCw,
  Lightbulb,
  MessageSquareQuote,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import AudioButton from '../AudioButton';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { sendRoleplayMessage } from '../../services/roleplayService';
import { captureWeakVocabulary } from '../../utils/srsEngine';
import { awardXp } from '../../utils/gamification';
import { detectUsedTargetVocab } from '../../utils/roleplayScenarioBuilder';

export default function RoleplayStudioModal({
  isOpen,
  onClose,
  scenario,
  user
}) {
  // Settings states
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [voiceRate, setVoiceRate] = useState(0.85);

  // Conversation state
  const [messages, setMessages] = useState(() => [
    {
      id: 'msg-init',
      role: 'ai',
      hanzi: scenario?.initialAiGreeting?.hanzi || '你好！我们开始吧。',
      pinyin: scenario?.initialAiGreeting?.pinyin || 'Nǐ hǎo! Wǒmen kāishǐ ba.',
      vietnamese: scenario?.initialAiGreeting?.vi || 'Xin chào! Chúng ta bắt đầu nhé.',
      grammarFeedback: null,
      timestamp: Date.now()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [completedObjectiveIds, setCompletedObjectiveIds] = useState(new Set());
  const [usedVocabSet, setUsedVocabSet] = useState(new Set());
  const [hasCompletedAll, setHasCompletedAll] = useState(false);
  const [activeGrammarCoach, setActiveGrammarCoach] = useState(null);
  const [savedSrsMessage, setSavedSrsMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, activeGrammarCoach]);

  // Speech Recognition setup (zh-CN)
  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  const toggleMic = useCallback(() => {
    playClickSound();
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech Recognition nhận diện giọng nói tiếng Trung.');
      return;
    }

    if (isListening) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [isListening]);

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    playClickSound();
    setInputMessage('');
    setIsSending(true);

    // 1. Append User Message
    const userMsgObj = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      hanzi: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsgObj]);

    // 2. Track Local Used Vocab immediately
    const matched = detectUsedTargetVocab(text, scenario.targetVocab || []);
    if (matched.length > 0) {
      setUsedVocabSet(prev => {
        const next = new Set(prev);
        matched.forEach(w => next.add(w));
        return next;
      });
    }

    try {
      const res = await sendRoleplayMessage({
        userMessage: text,
        scenario,
        conversationHistory: [...messages, userMsgObj],
        hskLevel: scenario.hskLevel || 'HSK 1',
        targetVocab: scenario.targetVocab || [],
        targetGrammar: scenario.targetGrammar || []
      });

      // 3. Append AI Response
      const aiMsgObj = {
        id: `msg-ai-${Date.now()}`,
        role: 'ai',
        hanzi: res.replyHanzi,
        pinyin: res.replyPinyin,
        vietnamese: res.replyVietnamese,
        grammarFeedback: res.grammarFeedback,
        correctedHanzi: res.correctedHanzi,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsgObj]);

      // 4. Update Suggestions & Objectives
      if (Array.isArray(res.suggestedReplies) && res.suggestedReplies.length > 0) {
        setSuggestedReplies(res.suggestedReplies);
      }

      if (Array.isArray(res.usedTargetItems)) {
        setUsedVocabSet(prev => {
          const next = new Set(prev);
          res.usedTargetItems.forEach(w => next.add(w));
          return next;
        });
      }

      if (Array.isArray(res.completedObjectives)) {
        setCompletedObjectiveIds(prev => {
          const next = new Set(prev);
          res.completedObjectives.forEach(id => next.add(id));
          if (next.size >= (scenario.missionObjectives?.length || 3) && !hasCompletedAll) {
            setHasCompletedAll(true);
            playSuccessSound();
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            awardXp(30);
          }
          return next;
        });
      }

      // 5. Grammar Coach Card
      if (res.grammarFeedback) {
        setActiveGrammarCoach({
          feedback: res.grammarFeedback,
          original: text,
          corrected: res.correctedHanzi || text
        });
      }

    } catch (err) {
      console.warn('Lỗi gửi tin nhắn roleplay:', err.message);
    } finally {
      setIsSending(false);
    }
  };

  // Save grammar sentence to SRS
  const handleSaveToSrs = (item) => {
    playClickSound();
    try {
      captureWeakVocabulary({
        hanzi: item.corrected || item.original,
        pinyin: '...',
        meaning: item.feedback || 'Mẫu câu giao tiếp nhập vai AI',
        hsk_level: 2
      }, 'roleplay_coach', user);

      setSavedSrsMessage('Đã lưu mẫu câu vào hàng đợi ôn tập SRS SM-2!');
      setTimeout(() => setSavedSrsMessage(null), 3000);
    } catch {}
  };

  if (!isOpen || !scenario) return null;

  const objectivesCount = scenario.missionObjectives?.length || 3;
  const completedCount = completedObjectiveIds.size;
  const progressPercent = Math.min(100, Math.round((completedCount / objectivesCount) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl shadow-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-50 via-white to-amber-50 dark:from-[#1A2234] dark:via-[#1E293B] dark:to-[#172033] border-b border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E85D3F] text-white flex items-center justify-center text-2xl shadow-md shadow-[#E85D3F]/20">
              {scenario.avatar || '🎭'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#243447] dark:text-white">
                  {scenario.title}
                </h2>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-[#E85D3F] dark:bg-orange-950/60 dark:text-orange-300">
                  {scenario.hskLevel}
                </span>
              </div>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Đóng vai với: <span className="font-semibold text-[#243447] dark:text-white">{scenario.aiPersona?.name}</span> ({scenario.aiPersona?.role})
              </p>
            </div>
          </div>

          {/* Quick Settings & Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { playClickSound(); setShowPinyin(prev => !prev); }}
              title="Bật/Tắt Pinyin"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                showPinyin ? 'bg-orange-100 text-[#E85D3F] dark:bg-orange-950/70' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              <Type size={14} />
              <span className="hidden sm:inline">Pinyin</span>
            </button>

            <button
              type="button"
              onClick={() => { playClickSound(); setShowTranslation(prev => !prev); }}
              title="Bật/Tắt Dịch nghĩa tiếng Việt"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                showTranslation ? 'bg-orange-100 text-[#E85D3F] dark:bg-orange-950/70' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              <Languages size={14} />
              <span className="hidden sm:inline">Dịch nghĩa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setVoiceRate(prev => (prev === 0.85 ? 1.0 : 0.85));
              }}
              title="Tốc độ phát âm"
              className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {voiceRate === 0.85 ? '0.85x Chậm' : '1.0x Chuẩn'}
            </button>

            <button
              type="button"
              onClick={() => { playClickSound(); onClose(); }}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col h-full bg-[#FFFBF7] dark:bg-[#131B24] overflow-hidden">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {/* Mission Progress Callout */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🎯</span>
                  <div>
                    <div className="text-xs font-bold text-[#243447] dark:text-white">
                      Tiến độ hoàn thành nhiệm vụ: {completedCount}/{objectivesCount}
                    </div>
                    <div className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                      Hoàn thành 3 mục tiêu để nhận 30 XP và mở khóa chứng nhận nhập vai
                    </div>
                  </div>
                </div>
                <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shrink-0">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Chat Transcript */}
              {messages.map((msg) => {
                const isAi = msg.role === 'ai';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[75%]">
                      {isAi && (
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300 flex items-center justify-center text-sm font-bold shrink-0 mt-1">
                          {scenario.avatar || 'AI'}
                        </div>
                      )}

                      <div 
                        className={`p-4 rounded-3xl shadow-xs transition-all ${
                          isAi 
                            ? 'bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white rounded-tl-xs' 
                            : 'bg-[#E85D3F] text-white rounded-tr-xs'
                        }`}
                      >
                        {/* Pinyin Line */}
                        {isAi && showPinyin && msg.pinyin && (
                          <div className="text-xs font-semibold text-[#E85D3F] dark:text-orange-300 mb-1 tracking-wide">
                            {msg.pinyin}
                          </div>
                        )}

                        {/* Hanzi Line */}
                        <div className="text-base sm:text-lg font-bold leading-relaxed">
                          {msg.hanzi}
                        </div>

                        {/* Vietnamese Translation Line */}
                        {isAi && showTranslation && msg.vietnamese && (
                          <div className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1.5 pt-1.5 border-t border-black/5 dark:border-white/5">
                            {msg.vietnamese}
                          </div>
                        )}

                        {/* Audio Button for AI Messages */}
                        {isAi && (
                          <div className="mt-2 flex items-center gap-2">
                            <AudioButton 
                              text={msg.hanzi} 
                              rate={voiceRate} 
                              size="sm" 
                              variant="ghost" 
                            />
                            <span className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
                              Nghe giọng Neural HD
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Sending Indicator */}
              {isSending && (
                <div className="flex items-center gap-2 text-xs text-[#748092] dark:text-[#94A3B8] italic p-2 animate-pulse">
                  <span>{scenario.aiPersona?.name} đang suy nghĩ câu trả lời...</span>
                </div>
              )}

              {/* Inline Grammar Coach Card */}
              {activeGrammarCoach && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <Lightbulb size={15} />
                      Góp ý sư phạm từ Giáo viên AI
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSaveToSrs(activeGrammarCoach)}
                      className="text-[11px] font-bold px-2 py-1 rounded-lg bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <BookmarkPlus size={13} />
                      Lưu vào SRS
                    </button>
                  </div>
                  <p className="leading-relaxed">{activeGrammarCoach.feedback}</p>
                  {activeGrammarCoach.corrected && activeGrammarCoach.corrected !== activeGrammarCoach.original && (
                    <div className="bg-white/80 dark:bg-black/30 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/60 font-semibold">
                      Cách diễn đạt chuẩn xác hơn: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{activeGrammarCoach.corrected}</span>
                    </div>
                  )}
                  {savedSrsMessage && (
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                      ✅ {savedSrsMessage}
                    </div>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Replies Chips */}
            {suggestedReplies.length > 0 && !isSending && (
              <div className="px-4 py-2 bg-white/60 dark:bg-[#1A2234]/60 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] shrink-0 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#E85D3F]" />
                  Gợi ý:
                </span>
                {suggestedReplies.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(sug.hanzi)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-orange-200 dark:border-orange-900/40 text-xs text-[#243447] dark:text-white font-medium hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all shrink-0 cursor-pointer text-left"
                  >
                    <span className="font-bold">{sug.hanzi}</span>
                    {sug.vi && <span className="opacity-70 text-[10px] ml-1">({sug.vi})</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3.5 bg-white dark:bg-[#1E293B] border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-2">
              
              {/* Push-to-Talk Mic Button */}
              <button
                type="button"
                onClick={toggleMic}
                title={isListening ? 'Đang lắng nghe... bấm để dừng' : 'Bấm để nói tiếng Trung'}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                    : 'bg-orange-100 text-[#E85D3F] hover:bg-orange-200 dark:bg-orange-950/60 dark:text-orange-300'
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder={isListening ? 'Đang lắng nghe giọng bạn...' : 'Nhập câu trả lời bằng chữ Hán hoặc Pinyin...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
                className="flex-1 px-4 py-3 rounded-2xl bg-[#FFFBF7] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] transition-colors"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isSending}
                className="px-5 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-40 text-white text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              >
                <span>Gửi</span>
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* Right Sidebar: Mission Tracker & Target Vocabulary */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] p-5 flex flex-col gap-5 overflow-y-auto">
            
            {/* Mission Tracker Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8] flex items-center gap-1.5">
                  <Award size={14} className="text-amber-500" />
                  Nhiệm vụ cuộc hội thoại
                </h3>
                <span className="text-xs font-bold text-[#E85D3F]">
                  {completedCount}/{objectivesCount}
                </span>
              </div>

              <div className="space-y-2">
                {scenario.missionObjectives?.map((obj) => {
                  const isDone = completedObjectiveIds.has(obj.id);
                  return (
                    <div 
                      key={obj.id}
                      className={`p-3 rounded-2xl border text-xs transition-all flex items-start gap-2.5 ${
                        isDone 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold' 
                          : 'bg-[#FFFBF7] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8]'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      )}
                      <span>{obj.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Vocabulary Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#E85D3F]" />
                  Từ vựng mục tiêu bài học
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {usedVocabSet.size}/{scenario.targetVocab?.length || 0}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {scenario.targetVocab?.map((v, idx) => {
                  const isUsed = usedVocabSet.has(v.hanzi);
                  return (
                    <div
                      key={idx}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
                        isUsed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                          : 'bg-[#FFFBF7] dark:bg-[#131B24] text-[#243447] dark:text-white border-[#F1E5D8] dark:border-[#2B3A4F]'
                      }`}
                      title={`${v.pinyin} - ${v.meaning}`}
                    >
                      <span>{v.hanzi}</span>
                      {isUsed && <span>✅</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Grammar Section */}
            {scenario.targetGrammar && scenario.targetGrammar.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8] mb-2 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-blue-500" />
                  Cấu trúc ngữ pháp trọng tâm
                </h3>
                <div className="space-y-2">
                  {scenario.targetGrammar.map((g, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#FFFBF7] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
                      <div className="font-bold text-[#243447] dark:text-white">{g.title}</div>
                      {g.structure && (
                        <div className="text-[11px] font-mono text-[#E85D3F] mt-0.5">{g.structure}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Banner */}
            {hasCompletedAll && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2 animate-in fade-in zoom-in-95">
                <div className="text-2xl">🏆</div>
                <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  Chúc mừng bạn đã hoàn thành phiên nhập vai!
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  Bạn đã xuất sắc vận dụng các từ vựng và hoàn tất 3/3 mục tiêu hội thoại (+30 XP).
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
