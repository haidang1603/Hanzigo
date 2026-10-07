import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  RotateCcw,
  CheckCircle2,
  Copy,
  Download,
  Trash2,
  Lightbulb,
  History,
  X,
  Bot
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { CONVERSATIONS_DATA } from '../data/chineseData';
import { speakChinese, playSuccessSound, playClickSound } from '../utils/audio';
import { triggerCloudSync } from '../supabase/services';
import { awardXp } from '../utils/gamification';
import { sendTutorMessage } from '../services/aiTutorService';

const STORAGE_KEY = 'hanzigo_ai_chat_history';

export default function ConversationPage() {
  const [selectedConvIndex, setSelectedConvIndex] = useState(0);
  const conversation = CONVERSATIONS_DATA[selectedConvIndex];

  // Global chat history store { [convId]: messages[] }
  const [allChatHistory, setAllChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Toggles for UI
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Active chat dialogue messages
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[conversation.id] && parsed[conversation.id].length > 0) {
          return parsed[conversation.id];
        }
      }
      return conversation.dialogue;
    } catch {
      return conversation.dialogue;
    }
  });

  const [inputText, setInputText] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const chatContainerRef = useRef(null);
  const isInitialMount = useRef(true);
  const recognitionRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Always keep browser window at top when entering Conversation page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Scroll to bottom of chat box only, without scrolling the main window
  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      if (smooth) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      scrollToBottom(false);
      return;
    }
    scrollToBottom(true);
  }, [chatHistory, isAiTyping]);

  // Sync active scenario dialogue when switching
  const handleSelectConversation = (idx) => {
    playClickSound();
    setSelectedConvIndex(idx);
    const newConv = CONVERSATIONS_DATA[idx];
    const savedForConv = allChatHistory[newConv.id];
    setChatHistory(savedForConv && savedForConv.length > 0 ? savedForConv : newConv.dialogue);
    setAiFeedback(null);
  };

  // Save conversation messages to persistent storage
  const saveConversationHistory = (convId, messages) => {
    setChatHistory(messages);
    setAllChatHistory(prev => {
      const updated = {
        ...prev,
        [convId]: messages
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        triggerCloudSync();
      } catch (err) {
        console.error('Failed to save chat history:', err);
      }
      return updated;
    });
  };

  // Send a message & trigger AI intelligent response
  const handleSendMessage = useCallback(async (userMessageObj) => {
    const userMsg = {
      speaker: 'user',
      hanzi: userMessageObj.hanzi,
      pinyin: userMessageObj.pinyin || '...',
      meaning: userMessageObj.meaning || 'Câu nói của bạn',
      time: 'Vừa xong'
    };

    const updatedWithUser = [...chatHistory, userMsg];
    saveConversationHistory(conversation.id, updatedWithUser);
    awardXp(10, null, `aichat_${conversation.id}_${Date.now()}`);

    // Speak user's sentence
    speakChinese(userMessageObj.hanzi);

    // Simulate AI thinking and reply
    setIsAiTyping(true);
    setAiFeedback(null);

    try {
      const aiReply = await sendTutorMessage(userMessageObj.hanzi, {
        hskLevel: conversation.level || 'HSK 1',
        conversationHistory: updatedWithUser
      });

      const aiMsg = {
        speaker: 'ai',
        hanzi: aiReply.hanzi,
        pinyin: aiReply.pinyin,
        meaning: aiReply.meaning,
        grammarAnalysis: aiReply.grammarAnalysis,
        userCorrection: aiReply.userCorrection,
        vocabSuggestions: aiReply.vocabSuggestions || [],
        provider: aiReply.provider,
        time: 'Vừa xong'
      };

      const finalThread = [...updatedWithUser, aiMsg];
      saveConversationHistory(conversation.id, finalThread);

      // Play success audio & speak AI reply
      playSuccessSound();
      speakChinese(aiReply.hanzi);

      if (aiReply.userCorrection) {
        setAiFeedback({
          rating: aiReply.provider === 'gemini' ? 'AI Tutor Gemini' : 'AI Offline Tutor',
          note: aiReply.userCorrection
        });
      }
    } catch (err) {
      console.warn('AI chat error:', err);
    } finally {
      setIsAiTyping(false);
    }
  }, [chatHistory, conversation]);

  // Handle custom input submission
  const handleCustomSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playClickSound();
    handleSendMessage({
      hanzi: inputText.trim(),
      pinyin: '',
      meaning: 'Câu bạn vừa nhập'
    });
    setInputText('');
  };

  // Toggle Speech Recognition (Microphone)
  const handleToggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      playClickSound();
      speakChinese('你好，很高兴认识你');
      showToast('Trình duyệt chưa hỗ trợ ghi âm trực tiếp. Đã phát âm thanh mẫu!');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN'; // Recognizes Mandarin Chinese
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        playClickSound();
        showToast('Đang lắng nghe... Hãy nói một câu tiếng Trung!');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          showToast(`Nhận diện thành công: "${transcript}"`);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Không nhận diện được giọng nói, vui lòng thử lại.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      showToast('Không thể bật Microphone. Vui lòng cấp quyền micro cho trình duyệt!');
    }
  };

  // Reset current scenario chat
  const handleResetChat = () => {
    if (window.confirm(`Bạn có chắc muốn đặt lại cuộc trò chuyện "${conversation.title}" về ban đầu?`)) {
      playClickSound();
      saveConversationHistory(conversation.id, conversation.dialogue);
      setAiFeedback(null);
      showToast('Đã đặt lại cuộc trò chuyện về kịch bản ban đầu!');
    }
  };

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử các cuộc hội thoại đã lưu?')) {
      playClickSound();
      localStorage.removeItem(STORAGE_KEY);
      setAllChatHistory({});
      setChatHistory(conversation.dialogue);
      setAiFeedback(null);
      setIsHistoryModalOpen(false);
      showToast('Đã xóa sạch toàn bộ lịch sử trò chuyện!');
    }
  };

  // Copy full conversation transcript to clipboard
  const handleCopyTranscript = () => {
    playClickSound();
    const text = chatHistory
      .map(m => `${m.speaker === 'ai' ? conversation.aiName : 'Bạn'}:\n${m.hanzi}\n(${m.pinyin})\n[Dịch: ${m.meaning}]\n`)
      .join('\n');

    navigator.clipboard.writeText(text);
    showToast('Đã sao chép toàn bộ hội thoại vào bộ nhớ tạm!');
  };

  // Download conversation transcript as .txt file
  const handleDownloadTranscript = () => {
    playClickSound();
    const text = `HỘI THOẠI TIẾNG TRUNG HANZIGO - ${conversation.title}\nTình huống: ${conversation.scenario}\nNgày lưu: ${new Date().toLocaleString('vi-VN')}\n\n` + 
      chatHistory
        .map(m => `${m.speaker === 'ai' ? conversation.aiName : 'Học viên'}:\n${m.hanzi}\n${m.pinyin}\n${m.meaning}\n`)
        .join('\n----------------------------------------\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hanzigo-hoi-thoai-${conversation.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống file bản ghi hội thoại!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10 animate-bounce">
          <CheckCircle2 size={16} className="text-[#45B97C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
            Luyện phản xạ giao tiếp thực tế
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
            Hội Thoại AI Tiểu Hàm (小涵)
          </h1>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-0.5">
            Nhập vai tình huống thực tế, đối thoại trực tiếp và tự động lưu lại toàn bộ lịch sử học tập.
          </p>
        </div>

        {/* Global toggles & History Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white hover:border-[#E85D3F] transition-colors flex items-center gap-1.5 shadow-xs"
            title="Xem danh sách lịch sử hội thoại đã lưu"
          >
            <History size={14} className="text-[#E85D3F]" />
            <span>Lịch sử trò chuyện</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setShowPinyin(!showPinyin);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              showPinyin 
                ? 'bg-[#FDEEEB] dark:bg-[#2D1E1B] border-[#E85D3F] text-[#E85D3F]' 
                : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092]'
            }`}
          >
            <span>{showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setShowTranslation(!showTranslation);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              showTranslation 
                ? 'bg-[#EBF8F2] dark:bg-[#162B21] border-[#45B97C] text-[#45B97C]' 
                : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092]'
            }`}
          >
            <span>{showTranslation ? 'Ẩn Dịch VN' : 'Hiện Dịch VN'}</span>
          </button>
        </div>
      </div>

      {/* Scenarios Carousel Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CONVERSATIONS_DATA.map((conv, idx) => {
          const savedCount = allChatHistory[conv.id]?.length;
          return (
            <button
              key={conv.id}
              onClick={() => handleSelectConversation(idx)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedConvIndex === idx
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF9F2]'
              }`}
            >
              <span>{conv.title}</span>
              {savedCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedConvIndex === idx ? 'bg-white/20 text-white' : 'bg-[#FFF9F2] text-[#E85D3F]'
                }`}>
                  {savedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Dialogue Box */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Scenario Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FFF9F2] to-white dark:from-[#131B24] dark:to-[#1E293B] border-b border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={conversation.avatar} 
              alt={conversation.aiName} 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#E85D3F]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#243447] dark:text-white">
                  {conversation.aiName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#45B97C] animate-pulse" />
                  <span>Trực tuyến</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#E85D3F]/30 font-medium">
                  Đã tự động lưu ({chatHistory.length} tin)
                </span>
              </div>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                {conversation.scenario}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyTranscript}
              title="Sao chép toàn bộ hội thoại"
              className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#131B24] transition-colors"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownloadTranscript}
              title="Tải về file ghi chú (.txt)"
              className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#131B24] transition-colors"
            >
              <Download size={16} />
            </button>
            <button
              onClick={handleResetChat}
              title="Đặt lại kịch bản ban đầu"
              className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#131B24] transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatHistory.map((msg, idx) => {
            const isAI = msg.speaker === 'ai';
            return (
              <div 
                key={idx}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <img 
                    src={conversation.avatar} 
                    alt="AI" 
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-[#E85D3F]"
                  />
                )}

                <div className={`max-w-md sm:max-w-lg rounded-2xl p-4 shadow-sm space-y-1.5 ${
                  isAI 
                    ? 'bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white rounded-tl-sm' 
                    : 'bg-[#E85D3F] text-white rounded-tr-sm'
                }`}>
                  {/* Chinese Text */}
                  <div className="flex items-center justify-between gap-3">
                    <p className={`font-['Noto_Serif_SC'] text-base sm:text-lg font-bold leading-relaxed ${
                      isAI ? 'text-[#243447] dark:text-white' : 'text-white'
                    }`}>
                      {msg.hanzi}
                    </p>
                    <AudioButton 
                      text={msg.hanzi} 
                      size="sm" 
                      variant={isAI ? 'ghost' : 'dark'}
                    />
                  </div>

                  {/* Pinyin */}
                  {showPinyin && msg.pinyin && (
                    <p className={`text-xs font-semibold ${
                      isAI ? 'text-[#E85D3F]' : 'text-white/80'
                    }`}>
                      {msg.pinyin}
                    </p>
                  )}

                  {/* Vietnamese Translation */}
                  {showTranslation && msg.meaning && (
                    <p className={`text-xs pt-1 border-t ${
                      isAI 
                        ? 'border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8]' 
                        : 'border-white/20 text-white/90'
                    }`}>
                      {msg.meaning}
                    </p>
                  )}

                  {/* AI Pedagogical Extensions: Grammar, Correction & Vocab */}
                  {isAI && (msg.grammarAnalysis || msg.userCorrection || (msg.vocabSuggestions && msg.vocabSuggestions.length > 0)) && (
                    <div className="pt-2 mt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5 text-[11px]">
                      {msg.grammarAnalysis && (
                        <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60 leading-relaxed">
                          <span className="font-bold">💡 Ngữ pháp: </span>
                          <span>{msg.grammarAnalysis}</span>
                        </div>
                      )}
                      {msg.userCorrection && (
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 leading-relaxed">
                          <span className="font-bold">✍️ Sửa câu / Gợi ý: </span>
                          <span>{msg.userCorrection}</span>
                        </div>
                      )}
                      {msg.vocabSuggestions && msg.vocabSuggestions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] font-bold">Từ mới gợi ý:</span>
                          {msg.vocabSuggestions.map((v, vIdx) => (
                            <span key={vIdx} className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-medium text-[#243447] dark:text-white">
                              <strong className="text-[#E85D3F] font-['Noto_Serif_SC']">{v.hanzi}</strong> ({v.pinyin}): {v.meaning}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-sm">
                    Bạn
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAiTyping && (
            <div className="flex items-center gap-3 justify-start animate-pulse">
              <img 
                src={conversation.avatar} 
                alt="AI Typing" 
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E85D3F]"
              />
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#E85D3F] flex items-center gap-2">
                <Bot size={15} />
                <span>{conversation.aiName} đang soạn câu trả lời...</span>
              </div>
            </div>
          )}

          {/* AI Feedback Banner */}
          {aiFeedback && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <Lightbulb size={16} className="text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#D97706]">Nhận xét phản xạ AI ({aiFeedback.rating}): </span>
                <span className="text-[#243447] dark:text-[#CBD5E1]">{aiFeedback.note}</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Replies Area */}
        {conversation.suggestedReplies && (
          <div className="p-3 bg-[#FFF9F2] dark:bg-[#131B24] border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#748092] block mb-2">
              💡 Gợi ý câu trả lời nhanh:
            </span>
            <div className="flex flex-wrap gap-2">
              {conversation.suggestedReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-xs font-semibold text-[#243447] dark:text-white transition-all text-left shadow-sm hover:scale-102 active:scale-95"
                >
                  <span className="font-bold text-[#E85D3F] block font-['Noto_Serif_SC']">{reply.hanzi}</span>
                  <span className="text-[10px] text-[#748092]">{reply.meaning}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleCustomSend} className="p-4 bg-white dark:bg-[#1E293B] border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMic}
            title={isListening ? "Đang ghi âm (Bấm để dừng)" : "Luyện nói qua Microphone"}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-md'
                : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] hover:bg-[#FDEEEB] border-[#F1E5D8] dark:border-[#2B3A4F]'
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            placeholder={isListening ? "Đang nghe bạn nói tiếng Trung..." : "Nhập câu trả lời bằng tiếng Trung hoặc pinyin..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Gửi</span>
            <Send size={14} />
          </button>
        </form>

      </div>

      {/* History Manager Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <History size={18} className="text-[#E85D3F]" />
                <span>Quản lý Lịch sử Hội thoại AI đã lưu</span>
              </h3>
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Tất cả các tin nhắn thoại và đối thoại giữa bạn với AI Tiểu Hàm đều được tự động lưu bền vững trong máy.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {CONVERSATIONS_DATA.map((conv, idx) => {
                const thread = allChatHistory[conv.id] || conv.dialogue;
                const messageCount = thread.length;
                const isCurrent = selectedConvIndex === idx;

                return (
                  <div 
                    key={conv.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      isCurrent
                        ? 'bg-[#FDEEEB] dark:bg-[#2D1E1B] border-[#E85D3F]'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#243447] dark:text-white">
                          {conv.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">
                            Đang mở
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] mt-0.5">
                        {messageCount} lượt trao đổi • {conv.aiName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleSelectConversation(idx);
                          setIsHistoryModalOpen(false);
                          showToast(`Đã chuyển sang chủ đề: ${conv.title}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white hover:border-[#E85D3F]"
                      >
                        Mở xem
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <button
                onClick={handleClearAllHistory}
                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                <span>Xóa sạch lịch sử</span>
              </button>

              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#243447] dark:bg-[#334155] text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
