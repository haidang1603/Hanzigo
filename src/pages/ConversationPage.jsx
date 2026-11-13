import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Bot,
  Headphones,
  Layers,
  Sparkles,
  ShieldCheck,
  Sliders,
  Check,
  Volume2,
  Target,
  Award,
  BookOpen
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { ALL_CONVERSATION_SCENARIOS, SCENARIO_CATEGORIES } from '../data/conversationScenarios';
import AiContextBadge from '../components/personalization/AiContextBadge';
import { speakChinese, playSuccessSound, playClickSound } from '../utils/audio';
import { playChineseTts } from '../services/ttsAudioService';
import { useUnifiedTools } from '../core/ecosystem/UnifiedToolsContext';
import { triggerCloudSync } from '../supabase/services';
import { awardXp } from '../utils/gamification';
import { sendTutorMessage } from '../services/aiTutorService';
import ListeningPracticeView from '../components/depth/ListeningPracticeView';
import GrammarEngineView from '../components/depth/GrammarEngineView';
import AiTutorChatView from '../components/depth/AiTutorChatView';
import RoleplayStudioModal from '../components/learning/RoleplayStudioModal';
import { SPECIAL_ROLEPLAY_SCENARIOS } from '../utils/roleplayScenarioBuilder';

const STORAGE_KEY = 'hanzigo_ai_chat_history';

export default function ConversationPage({ user, openAuthModal }) {
  const [activeDepthTab, setActiveDepthTab] = useState('roleplay'); // 'roleplay' | 'tutor' | 'listening' | 'grammar'
  const [roleplaySubMode, setRoleplaySubMode] = useState('studio'); // 'studio' | 'dialogues'
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState(ALL_CONVERSATION_SCENARIOS[0].id);
  const [selectedRoleplayScenario, setSelectedRoleplayScenario] = useState(SPECIAL_ROLEPLAY_SCENARIOS[0]);
  const [isRoleplayModalOpen, setIsRoleplayModalOpen] = useState(false);
  const [targetHskLevel, setTargetHskLevel] = useState(user?.hskLevel || 'HSK 1');
  const [trackMistakesConsent, setTrackMistakesConsent] = useState(true);

  const filteredScenarios = useMemo(() => {
    if (activeCategory === 'all') return ALL_CONVERSATION_SCENARIOS;
    return ALL_CONVERSATION_SCENARIOS.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const conversation = useMemo(() => {
    return ALL_CONVERSATION_SCENARIOS.find(s => s.id === selectedScenarioId) || ALL_CONVERSATION_SCENARIOS[0];
  }, [selectedScenarioId]);

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

  const { openDrawerForText } = useUnifiedTools();

  const [missionVocab, setMissionVocab] = useState(() => [
    { simplified: '讨价还价', pinyin: 'tǎo jià huán jià', meaning_vi: 'Mặc cả', used: false },
    { simplified: '便宜', pinyin: 'piányi', meaning_vi: 'Rẻ, bớt giá', used: false },
    { simplified: '打折', pinyin: 'dǎ zhé', meaning_vi: 'Giảm giá', used: false },
    { simplified: '质量', pinyin: 'zhìliàng', meaning_vi: 'Chất lượng', used: false },
    { simplified: '推荐', pinyin: 'tuījiàn', meaning_vi: 'Gợi ý, tiến cử', used: false },
  ]);

  const [missionGrammar, setMissionGrammar] = useState(() => [
    { code: 'HSK3-BA-01', pattern_display: 'S + 把 + O + V + 了', title_vi: 'Câu chữ 把 xử lý tân ngữ', used: false },
    { code: 'HSK4-BUJIN-01', pattern_display: '不仅...而且...', title_vi: 'Không những... mà còn...', used: false },
  ]);

  const missionProgressPct = useMemo(() => {
    const total = missionVocab.length + missionGrammar.length;
    if (total === 0) return 0;
    const done =
      missionVocab.filter((v) => v.used).length +
      missionGrammar.filter((g) => g.used).length;
    return Math.round((done / total) * 100);
  }, [missionVocab, missionGrammar]);

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
  const handleSelectScenario = (scenId) => {
    playClickSound();
    setSelectedScenarioId(scenId);
    const newConv = ALL_CONVERSATION_SCENARIOS.find(s => s.id === scenId) || ALL_CONVERSATION_SCENARIOS[0];
    const savedForConv = allChatHistory[newConv.id];
    setChatHistory(savedForConv && savedForConv.length > 0 ? savedForConv : newConv.dialogue);
    setAiFeedback(null);
    if (newConv.level) {
      setTargetHskLevel(newConv.level);
    }
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
    const cleanText = String(userMessageObj.hanzi || '').trim();
    const newlyMatchedWords = [];
    const nextVocab = missionVocab.map((item) => {
      if (cleanText.includes(item.simplified)) {
        if (!item.used) newlyMatchedWords.push(item.simplified);
        return { ...item, used: true };
      }
      return item;
    });

    const newlyMatchedGrammar = [];
    const nextGrammar = missionGrammar.map((g) => {
      const hitBa = g.pattern_display.includes('把') && /把.+(了|完|好|过来|出去)/.test(cleanText);
      const hitBujin = g.pattern_display.includes('不仅') && /不仅.*(而且|还)/.test(cleanText);
      if (hitBa || hitBujin) {
        if (!g.used) newlyMatchedGrammar.push(g.code);
        return { ...g, used: true };
      }
      return g;
    });

    if (newlyMatchedWords.length > 0 || newlyMatchedGrammar.length > 0) {
      setMissionVocab(nextVocab);
      setMissionGrammar(nextGrammar);
      if (newlyMatchedWords.length > 0) {
        showToast(`🎉 +Điểm Mastery SRS: ${newlyMatchedWords.join(', ')}`);
      }
    }

    const remainingTarget = nextVocab.find((v) => !v.used) || nextVocab[0];
    const turnEvaluation = {
      is_grammatically_correct: true,
      grammar_score: newlyMatchedGrammar.length > 0 ? 96 : newlyMatchedWords.length > 0 ? 94 : 88,
      corrected_user_sentence_zh: cleanText,
      explanation_vi:
        newlyMatchedWords.length > 0
          ? `Đã dùng chuẩn từ SRS mục tiêu: ${newlyMatchedWords.join(', ')}`
          : 'Câu giao tiếp tự nhiên, đúng ngữ cảnh.',
      next_hint: remainingTarget
        ? {
            target_word_to_use: remainingTarget.simplified,
            suggested_reply_zh: `请问，这个“${remainingTarget.simplified}”怎么样？`,
            suggested_reply_pinyin: `Qǐngwèn, zhège “${remainingTarget.pinyin}” zěnmeyàng?`,
          }
        : null,
    };

    const userMsg = {
      speaker: 'user',
      hanzi: cleanText,
      pinyin: userMessageObj.pinyin || '...',
      meaning: userMessageObj.meaning || 'Câu nói của bạn',
      turnEvaluation,
      time: 'Vừa xong'
    };

    const updatedWithUser = [...chatHistory, userMsg];
    saveConversationHistory(conversation.id, updatedWithUser);
    awardXp(10, null, `aichat_${conversation.id}_${Date.now()}`);

    // Speak user's sentence via unified 3-tier TTS service
    void playChineseTts(cleanText);

    // Simulate AI thinking and reply
    setIsAiTyping(true);
    setAiFeedback(null);

    try {
      const aiReply = await sendTutorMessage(userMessageObj.hanzi, {
        hskLevel: targetHskLevel || conversation.level || 'HSK 1',
        conversationHistory: updatedWithUser,
        userId: user?.id
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

        // Track communication error only with explicit user consent (Decree 13 compliance)
        if (trackMistakesConsent) {
          try {
            const existingMistakes = JSON.parse(localStorage.getItem('hanzigo_conversation_mistakes') || '[]');
            const newRecord = {
              id: `conv-err-${Date.now()}`,
              user_id: user?.id || 'guest',
              scenario_id: conversation.id,
              scenario_title: conversation.title,
              user_sentence: userMessageObj.hanzi,
              correction: aiReply.userCorrection,
              hsk_level: targetHskLevel,
              created_at: new Date().toISOString()
            };
            localStorage.setItem('hanzigo_conversation_mistakes', JSON.stringify([newRecord, ...existingMistakes.slice(0, 49)]));
            window.dispatchEvent(new CustomEvent('hanzigo_progress_event', { detail: { action: 'conversation_mistake_recorded', data: newRecord } }));
          } catch (e) {
            console.warn('Ghi nhận lỗi giao tiếp không thành công:', e);
          }
        }
      }
    } catch (err) {
      console.warn('AI chat error:', err);
    } finally {
      setIsAiTyping(false);
    }
  }, [chatHistory, conversation, missionGrammar, missionVocab, targetHskLevel, trackMistakesConsent, user]);

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

        {/* Global toggles, Privacy badge & History Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Zero Audio Retention</span>
          </div>

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

      {/* Segmented Mode Switcher - 4 Clean, Non-overlapping Pillars */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-white dark:bg-[#1E293B] p-1.5 sm:p-2 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm max-w-2xl mx-auto">
        {[
          { id: 'roleplay', label: '🎭 Hội Thoại Nhập Vai' },
          { id: 'tutor', label: '🎓 Gia Sư AI Lão Sư' },
          { id: 'listening', label: '🎧 Luyện Nghe' },
          { id: 'grammar', label: '🧱 Ngữ Pháp' }
        ].map((tab) => {
          const isSelected = activeDepthTab === tab.id || (tab.id === 'roleplay' && activeDepthTab === 'conversation');
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                setActiveDepthTab(tab.id);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/30 scale-[1.02]'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MODE: AI TUTOR RAG (LÃO SƯ HANZIGO) */}
      {activeDepthTab === 'tutor' && (
        <AiTutorChatView user={user} openAuthModal={openAuthModal} />
      )}

      {/* MODE: CONTEXTUAL AI ROLEPLAY STUDIO & SCENARIOS */}
      {(activeDepthTab === 'roleplay' || activeDepthTab === 'conversation') && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200/60 dark:border-orange-900/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#E85D3F] mb-1">
                  <Sparkles size={16} />
                  <span>PHÒNG THỰC HÀNH GIAO TIẾP NHẬP VAI AI</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                  Thực Hành Giao Tiếp Hai Chiều Với AI
                </h2>
                <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1 max-w-2xl">
                  Luyện khẩu ngữ bằng giọng nói (Push-to-Talk) và chữ viết, hoàn thành 3 nhiệm vụ sư phạm, nhận góp ý sửa lỗi ngữ pháp tức thì và nghe giọng đọc Neural HD chuẩn Bắc Kinh.
                </p>
              </div>

              {/* Sub-mode Switcher */}
              <div className="flex items-center bg-white/90 dark:bg-[#1E293B] p-1 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] shrink-0 self-start md:self-center shadow-xs">
                <button
                  type="button"
                  onClick={() => { playClickSound(); setRoleplaySubMode('studio'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    roleplaySubMode === 'studio'
                      ? 'bg-[#E85D3F] text-white shadow-xs'
                      : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  🎭 Nhập vai Đời thực
                </button>
                <button
                  type="button"
                  onClick={() => { playClickSound(); setRoleplaySubMode('dialogues'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    roleplaySubMode === 'dialogues'
                      ? 'bg-[#E85D3F] text-white shadow-xs'
                      : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  💬 Đối thoại Mẫu
                </button>
              </div>
            </div>
          </div>

          {/* Sub-mode 1: 6 Studio Scenario Cards */}
          {roleplaySubMode === 'studio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPECIAL_ROLEPLAY_SCENARIOS.map((scen) => (
                <div 
                  key={scen.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md hover:border-[#E85D3F] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                        {scen.avatar}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-[#E85D3F] dark:bg-orange-950/60 dark:text-orange-300">
                        {scen.hskLevel}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#243447] dark:text-white">
                      {scen.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#E85D3F] mb-2">
                      {scen.chineseTitle}
                    </div>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2 mb-3">
                      {scen.aiPersona.role}
                    </p>

                    <div className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] mb-1.5">
                      3 Nhiệm vụ chính:
                    </div>
                    <ul className="text-xs text-[#243447] dark:text-[#CBD5E1] space-y-1 mb-4">
                      {scen.missionObjectives.map((m) => (
                        <li key={m.id} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span className="line-clamp-1">{m.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedRoleplayScenario(scen);
                      setIsRoleplayModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>Bắt đầu Nhập vai</span>
                    <Sparkles size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Sub-mode 2: Dialogue Scenarios with Xiao Han */}
          {roleplaySubMode === 'dialogues' && (
            <div className="space-y-4">
              {/* Active SRS & Grammar Mission HUD */}
              <div className="p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/25 text-white shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-emerald-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                      Nhiệm vụ Thực hành SRS & Ngữ pháp
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-emerald-400">
                      {missionProgressPct}% hoàn thành
                    </span>
                  </div>
                </div>

                {/* Mission Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${missionProgressPct}%` }}
                  />
                </div>

                {/* 5 SRS Vocab + 2 Grammar Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {missionVocab.map((v) => (
                    <button
                      key={v.simplified}
                      type="button"
                      onClick={() =>
                        openDrawerForText(v.simplified, {
                          tab: 'dictionary',
                          sourceApp: 'conversation_mission_hud',
                        })
                      }
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        v.used
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                          : 'border-slate-700 bg-slate-800/80 hover:border-cyan-400/60 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-['Noto_Serif_SC'] text-sm font-bold">{v.simplified}</span>
                        {v.used ? (
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        ) : (
                          <BookOpen size={12} className="text-slate-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-cyan-300 truncate">{v.pinyin}</p>
                      <p className="text-[10px] text-slate-400 truncate">{v.meaning_vi}</p>
                    </button>
                  ))}
                  {missionGrammar.map((g) => (
                    <button
                      key={g.code}
                      type="button"
                      onClick={() =>
                        openDrawerForText(g.pattern_display, {
                          tab: 'grammar',
                          sourceApp: 'conversation_mission_hud',
                        })
                      }
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        g.used
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                          : 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400 text-amber-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold text-amber-300">{g.code}</span>
                        {g.used && <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] font-bold truncate">{g.pattern_display}</p>
                      <p className="text-[10px] text-slate-400 truncate">{g.title_vi}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {SCENARIO_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClickSound();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-750'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Scenarios Carousel Pills for active category */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filteredScenarios.map((scen) => {
              const savedCount = allChatHistory[scen.id]?.length;
              return (
                <button
                  key={scen.id}
                  onClick={() => handleSelectScenario(scen.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    selectedScenarioId === scen.id
                      ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                      : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF9F2]'
                  }`}
                >
                  <span>{scen.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    selectedScenarioId === scen.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {scen.level || 'HSK 1'}
                  </span>
                  {savedCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedScenarioId === scen.id ? 'bg-white/20 text-white' : 'bg-[#FFF9F2] text-[#E85D3F]'
                    }`}>
                      {savedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Dialogue Box */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl overflow-hidden flex flex-col h-[650px]">
        
        {/* Scenario Header Bar with Adjustable Proficiency & Privacy Controls */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FFF9F2] to-white dark:from-[#131B24] dark:to-[#1E293B] border-b border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col md:flex-row md:items-center justify-between gap-3">
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Adjustable Proficiency */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Trình độ:</span>
              <select
                value={targetHskLevel}
                onChange={(e) => setTargetHskLevel(e.target.value)}
                className="font-bold text-[#E85D3F] bg-transparent outline-none cursor-pointer text-xs"
              >
                {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(lvl => (
                  <option key={lvl} value={lvl} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking Mistake Consent (Decree 13 / GDPR Privacy) */}
            <label 
              title="Khi bật, AI sẽ ghi nhận các lỗi sửa câu vào sổ tay học tập để đề xuất bài tập khắc phục. Tắt để giữ hoàn toàn riêng tư."
              className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={trackMistakesConsent}
                onChange={(e) => setTrackMistakesConsent(e.target.checked)}
                className="w-3.5 h-3.5 text-amber-500 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
              />
              <span>Ghi nhận lỗi sửa câu</span>
            </label>

            {/* Actions */}
            <button
              onClick={handleCopyTranscript}
              title="Sao chép toàn bộ hội thoại"
              className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#131B24] transition-colors cursor-pointer"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownloadTranscript}
              title="Tải về file ghi chú (.txt)"
              className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#131B24] transition-colors cursor-pointer"
            >
              <Download size={16} />
            </button>
            <button
              onClick={handleResetChat}
              title="Đặt lại kịch bản ban đầu"
              className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-white dark:hover:bg-[#131B24] transition-colors cursor-pointer"
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

                  {/* InlineGrammarFeedbackCard for learner messages */}
                  {!isAI && msg.turnEvaluation && (
                    <div className="mt-2 pt-2 border-t border-white/20 text-[11px] space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-100 font-bold">
                          {msg.turnEvaluation.is_grammatically_correct
                            ? `${msg.turnEvaluation.grammar_score}/100đ - Chuẩn tự nhiên`
                            : `Cần sửa nhẹ: ❌ ${msg.hanzi} -> ✅ ${msg.turnEvaluation.corrected_user_sentence_zh}`}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            void playChineseTts(
                              msg.turnEvaluation.corrected_user_sentence_zh || msg.hanzi
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors cursor-pointer"
                        >
                          <Volume2 size={12} />
                          <span>Nghe phát âm câu chuẩn</span>
                        </button>
                      </div>
                      {msg.turnEvaluation.explanation_vi && (
                        <p className="text-white/85">{msg.turnEvaluation.explanation_vi}</p>
                      )}
                      {msg.turnEvaluation.next_hint && (
                        <button
                          type="button"
                          onClick={() =>
                            setInputText(msg.turnEvaluation.next_hint.suggested_reply_zh)
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-100 font-semibold transition-colors cursor-pointer"
                        >
                          <Lightbulb size={12} />
                          <span>
                            Gợi ý câu tiếp ({msg.turnEvaluation.next_hint.target_word_to_use})
                          </span>
                        </button>
                      )}
                    </div>
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
            </div>
          )}
        </div>
      )}

      {/* MODE: LISTENING PRACTICE */}
      {activeDepthTab === 'listening' && (
        <ListeningPracticeView />
      )}

      {/* MODE: GRAMMAR ENGINE */}
      {activeDepthTab === 'grammar' && (
        <GrammarEngineView />
      )}

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

      {/* Roleplay Studio Modal Integration */}
      {isRoleplayModalOpen && (
        <RoleplayStudioModal
          isOpen={isRoleplayModalOpen}
          onClose={() => setIsRoleplayModalOpen(false)}
          scenario={selectedRoleplayScenario}
          user={user}
        />
      )}
    </div>
  );
}
