import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Lightbulb, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';

export default function AiCharacterTutorModal({
  isOpen,
  onClose,
  character,
  characterDetail,
  user
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Chào bạn! Mình là AI Tutor trợ giảng chữ Hán của HanziGo. Bạn muốn tìm hiểu sâu về chiết tự, mẹo nhớ, các chữ dễ nhầm hay ví dụ câu của chữ "${character}"?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '💡 Mẹo nhớ & Chiết tự', query: `Giải thích chi tiết chiết tự và câu chuyện ghi nhớ chữ "${character}".` },
    { label: '⚠️ Chữ dễ nhầm lẫn', query: `Chữ "${character}" dễ nhầm với những chữ nào và cách phân biệt?` },
    { label: '📝 Tạo câu ví dụ HSK', query: `Tạo 2 câu ví dụ giao tiếp thực tế chứa chữ "${character}" kèm Pinyin và dịch nghĩa.` }
  ];

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    playClickSound();
    setInputText('');

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let authToken = '';
      let authUid = '';
      try {
        if (typeof localStorage !== 'undefined') {
          const rawUser = localStorage.getItem('hanzigo_user');
          if (rawUser) {
            const u = JSON.parse(rawUser);
            authUid = u.uid || u.id || '';
            authToken = u.token || u.access_token || '';
          }
        }
      } catch {}

      const promptPayload = `[Ngữ cảnh Chữ Hán]:
Ký tự: "${characterDetail?.char || character}"
Pinyin: "${characterDetail?.pinyin || ''}"
Nghĩa: "${characterDetail?.meaning || ''}"
Bộ thủ: "${characterDetail?.radical || ''}"
Số nét: ${characterDetail?.strokesCount || 6}
Cấp độ: ${characterDetail?.hskLevel || 'HSK 1'}
Mẹo nhớ hệ thống: "${characterDetail?.mnemonic || ''}"

Câu hỏi của học viên: "${query}"

Hãy đóng vai gia sư tiếng Trung HanziGo thân thiện, giải thích ngắn gọn, sư phạm, có dẫn chứng Pinyin và bản dịch tiếng Việt rõ ràng.`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
          ...(authUid ? { 'x-user-id': authUid } : {})
        },
        body: JSON.stringify({
          userText: promptPayload,
          hskLevel: characterDetail?.hskLevel || 'HSK 1',
          conversationHistory: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiAnswer = data.meaning 
          ? `${data.hanzi ? data.hanzi + '\n' : ''}${data.pinyin ? data.pinyin + '\n\n' : ''}${data.meaning}${data.grammarAnalysis ? '\n\n💡 Ngữ pháp: ' + data.grammarAnalysis : ''}`
          : (data.text || data.reply || data.response || 'Đã nhận phản hồi từ gia sư AI.');

        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiAnswer
        }]);
      } else {
        throw new Error(`API error ${response.status}`);
      }
    } catch {
      // Offline Pedagogical Fallback Engine
      const offlineReply = generateOfflinePedagogicalAnswer(query, characterDetail);
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: offlineReply
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  function generateOfflinePedagogicalAnswer(q, detail) {
    const c = detail?.char || character;
    const lower = q.toLowerCase();

    if (lower.includes('nhầm') || lower.includes('phân biệt')) {
      if (detail?.confusingPair) {
        return `⚠️ Về các chữ dễ nhầm với chữ "${c}":\n${detail.confusingPair.title}.\n${detail.confusingPair.distinction}\n\n💡 Mẹo phân biệt: ${detail.confusingPair.mnemonic}`;
      }
      return `Chữ "${c}" có các nét cơ bản cần chú ý viết đúng tỷ lệ giữa các nét ngang và nét sổ để tránh nhầm lẫn với các chữ cùng bộ thủ "${detail?.radical || 'bộ thủ'}".`;
    }

    if (lower.includes('câu') || lower.includes('ví dụ')) {
      if (detail?.example) {
        return `Dưới đây là câu ví dụ tiêu biểu cho chữ "${c}":\n\n🇨🇳 ${detail.example.hanzi}\n🔤 ${detail.example.pinyin}\n🇻🇳 ${detail.example.meaning}`;
      }
      return `Ví dụ câu giao tiếp cơ bản:\n\n🇨🇳 我在学习"${c}"这个字。\n🔤 Wǒ zài xuéxí "${c}" zhè ge zì.\n🇻🇳 Tôi đang học viết chữ "${c}" này.`;
    }

    // Mẹo chiết tự
    return `💡 Chiết tự & Mẹo ghi nhớ chữ "${c}":\n- Bộ thủ: ${detail?.radical || 'Bộ thủ'}\n- Ý nghĩa: ${detail?.meaning || ''}\n- Cấu trúc: ${detail?.structure?.name || 'Đơn thể'}\n\n📖 Mẹo ghi nhớ: ${detail?.mnemonic || 'Hãy ghi nhớ nét bút từ trên xuống dưới, từ trái sang phải để có chữ viết cân đối đẹp mắt!'}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-[#F1E5D8] dark:border-[#334155] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#F1E5D8] dark:border-[#334155] flex items-center justify-between bg-[#FFF9F2] dark:bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#243447] dark:text-[#F3F4F6] text-base">
                  Gia sư AI Chữ Hán
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                  Chữ: {character}
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Giải thích chiết tự, mẹo nhớ & phân biệt chữ tương đồng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Buttons */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/40 border-b border-[#F1E5D8] dark:border-[#334155] flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.query)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-xs font-semibold text-[#243447] dark:text-[#F3F4F6] hover:border-amber-500 hover:text-amber-600 active:scale-95 transition-all shadow-2xs disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div 
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white rounded-tr-xs shadow-xs'
                    : 'bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155] text-[#243447] dark:text-[#F3F4F6] rounded-tl-xs shadow-2xs'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span>AI Tutor đang phân tích...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#F1E5D8] dark:border-[#334155] bg-white dark:bg-[#1E293B]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Đặt câu hỏi cho AI về chữ "${character}"...`}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#334155] bg-[#FFF9F2] dark:bg-[#0F172A] text-sm text-[#243447] dark:text-[#F3F4F6] focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
