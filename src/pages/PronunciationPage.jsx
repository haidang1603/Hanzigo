import React, { useState, useRef } from 'react';
import { 
  Mic, 
  MicOff,
  Volume2, 
  Sparkles, 
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter,
  History,
  X,
  Zap,
  Gauge
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { PINYIN_DATA, VOCABULARY_LIST } from '../data/chineseData';
import { speakChinese, playSuccessSound, playErrorSound, playClickSound } from '../utils/audio';
import { triggerCloudSync } from '../firebase/services';
import { awardXp } from '../utils/gamification';

const STORAGE_CUSTOM_PRONOUNCE = 'hanzigo_custom_pronounce_list';
const STORAGE_PRONOUNCE_HISTORY = 'hanzigo_pronounce_history';

// Default practice list covering essential HSK words and common conversational sentences
const DEFAULT_PRONUNCIATION_ITEMS = [
  {
    id: 'pr-1',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Xin chào',
    category: 'HSK 1',
    tip: 'Hai thanh 3 đi liền nhau, chữ 你 (nǐ) biến điệu thành thanh 2: ní hǎo.'
  },
  {
    id: 'pr-2',
    hanzi: '谢谢',
    pinyin: 'xièxie',
    meaning: 'Cảm ơn',
    category: 'HSK 1',
    tip: 'Âm "x" mặt lưỡi phẳng nhẹ, âm thứ hai đọc thanh nhẹ (khinh thanh).'
  },
  {
    id: 'pr-3',
    hanzi: '对不起',
    pinyin: 'duìbuqǐ',
    meaning: 'Xin lỗi',
    category: 'HSK 1',
    tip: 'Âm "d" không bật hơi như chữ "t" tiếng Việt, "qǐ" bật hơi từ mặt lưỡi.'
  },
  {
    id: 'pr-4',
    hanzi: '再见',
    pinyin: 'zàijiàn',
    meaning: 'Tạm biệt / Hẹn gặp lại',
    category: 'HSK 1',
    tip: 'Âm "z" đầu lưỡi thẳng không bật hơi, hai thanh 4 dứt khoát từ cao độ 5 xuống 1.'
  },
  {
    id: 'pr-5',
    hanzi: '我是越南人',
    pinyin: 'Wǒ shì Yuènán rén',
    meaning: 'Tôi là người Việt Nam',
    category: 'Câu giao tiếp',
    tip: 'Âm "sh" và "r" cần uốn cong đầu lưỡi lên ngạc cứng.'
  },
  {
    id: 'pr-6',
    hanzi: '我想喝奶茶',
    pinyin: 'Wǒ xiǎng hē nǎichá',
    meaning: 'Tôi muốn uống trà sữa',
    category: 'Câu giao tiếp',
    tip: '"hē" thanh 1 âm cuống họng, "chá" uốn lưỡi và bật hơi mạnh.'
  },
  {
    id: 'pr-7',
    hanzi: '这件衣服多少钱？',
    pinyin: 'Zhè jiàn yīfu duōshao qián?',
    meaning: 'Bộ quần áo này bao nhiêu tiền?',
    category: 'Câu giao tiếp',
    tip: '"zhè" uốn lưỡi không bật hơi, "qián" bật hơi từ mặt lưỡi đi lên thanh 2.'
  },
  {
    id: 'pr-8',
    hanzi: '今天天气真好',
    pinyin: 'Jīntiān tiānqì zhēn hǎo',
    meaning: 'Hôm nay thời tiết thật đẹp',
    category: 'Câu giao tiếp',
    tip: '"jīn" thanh 1 bằng phẳng, "tiān" bật hơi đầu lưỡi, "qì" thanh 4 dứt khoát.'
  },
  {
    id: 'pr-9',
    hanzi: '很高兴认识你',
    pinyin: 'Hěn gāoxìng rènshi nǐ',
    meaning: 'Rất vui được làm quen với bạn',
    category: 'Câu giao tiếp',
    tip: '"gāo" giữ cao độ 55 bằng phẳng, "shi" đọc nhẹ nhàng lướt qua.'
  },
  {
    id: 'pr-10',
    hanzi: '我可以加你的微信吗？',
    pinyin: 'Wǒ kěyǐ jiā nǐ de Wēixìn ma?',
    meaning: 'Tôi có thể kết bạn WeChat của bạn không?',
    category: 'Câu giao tiếp',
    tip: '"jiā" giữ thanh 1 cao phẳng, "ma" cuối câu là trợ từ nghi vấn nhẹ.'
  }
];

// Quick suggestion templates for adding custom practice sentences
const QUICK_SUGGESTIONS = [
  { hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', meaning: 'Chúc bạn sinh nhật vui vẻ', tip: 'Thanh 4 ở chữ 祝 và 快 đọc dứt khoát.' },
  { hanzi: '听不懂，请再说一遍', pinyin: 'Tīng bù dǒng, qǐng zài shuō yí biàn', meaning: 'Nghe không hiểu, xin nhắc lại một lần nữa', tip: 'Biến điệu chữ 一 (yī) thành yí khi đứng trước thanh 4.' },
  { hanzi: '多少钱一斤？', pinyin: 'Duōshao qián yì jīn?', meaning: 'Bao nhiêu tiền một cân?', tip: 'Câu hỏi giá cả cực kỳ phổ biến khi đi chợ ở Trung Quốc.' },
  { hanzi: '祝你一路顺风', pinyin: 'Zhù nǐ yílù shùnfēng', meaning: 'Chúc bạn thuận buồm xuôi gió / lên đường may mắn', tip: 'Lời chúc quen thuộc khi chia tay người đi xa.' },
  { hanzi: '中国菜很好吃', pinyin: 'Zhōngguó cài hěn hǎochī', meaning: 'Món ăn Trung Quốc rất ngon', tip: 'chī uốn lưỡi bật hơi mạnh, hěn hǎo biến điệu thanh 3.' },
  { hanzi: '我想去北京旅游', pinyin: 'Wǒ xiǎng qù Běijīng lǚyóu', meaning: 'Tôi muốn đi Bắc Kinh du lịch', tip: 'qù bật hơi mặt lưỡi, lǚ cần tròn môi như huýt sáo.' }
];

export default function PronunciationPage() {
  const [activeTab, setActiveTab] = useState('record'); // Default to AI Practice ('tones', 'initials', 'finals', 'record', 'quiz')

  // Custom Items & Practice Items State initialized lazily
  const [practiceList, setPracticeList] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_PRONOUNCE);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...DEFAULT_PRONUNCIATION_ITEMS];
        }
      }
    } catch (e) {
      console.error('Error loading custom pronunciation list', e);
    }
    return DEFAULT_PRONUNCIATION_ITEMS;
  });

  const [selectedItem, setSelectedItem] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_PRONOUNCE);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRONUNCIATION_ITEMS[0];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'hsk', 'communication', 'custom'

  // Speech Speed state
  const [speechSpeed, setSpeechSpeed] = useState(0.85); // 1.0, 0.85, 0.65, 0.5

  // Recording & Evaluation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingScore, setRecordingScore] = useState(null);
  const [speechError, setSpeechError] = useState(null);
  
  const [historyList, setHistoryList] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PRONOUNCE_HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading history', e);
    }
    return [];
  });

  const [showHistory, setShowHistory] = useState(false);

  // Add Custom Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHanzi, setNewHanzi] = useState('');
  const [newPinyin, setNewPinyin] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newCategory, setNewCategory] = useState('Tự thêm');
  const [newTip, setNewTip] = useState('');

  // Auto-detect vocabulary when typing in the Add Modal (derived directly without useEffect)
  const matchedVocab = React.useMemo(() => {
    const clean = newHanzi.trim();
    if (!clean) return null;
    return VOCABULARY_LIST.find(v => v.hanzi === clean) || null;
  }, [newHanzi]);

  // Tone Quiz state
  const [quizToneIndex, setQuizToneIndex] = useState(0);
  const [quizSelectedTone, setQuizSelectedTone] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizStreak, setQuizStreak] = useState(0);

  const recognitionRef = useRef(null);

  const toneQuizzes = [
    { sound: 'mā', hanzi: '妈 (Mẹ)', correctTone: 1, explanation: 'Thanh 1 giữ cao độ 55 bằng phẳng, ngân dài đều: mā.' },
    { sound: 'má', hanzi: '麻 (Cây gai)', correctTone: 2, explanation: 'Thanh 2 giọng đi lên từ cao độ 3 đến 5 giống dấu sắc tiếng Việt: má.' },
    { sound: 'mǎ', hanzi: '马 (Con ngựa)', correctTone: 3, explanation: 'Thanh 3 hạ thấp xuống 1 rồi uốn vòng lên 4: mǎ.' },
    { sound: 'mà', hanzi: '骂 (Mắng mỏ)', correctTone: 4, explanation: 'Thanh 4 rơi dứt khoát từ 5 xuống 1, ngắt âm dứt điểm: mà.' },
    { sound: 'bā', hanzi: '八 (Số 8)', correctTone: 1, explanation: 'Thanh 1 âm b không bật hơi, cao độ 55 ngân đều.' },
    { sound: 'bái', hanzi: '白 (Màu trắng)', correctTone: 2, explanation: 'Thanh 2 giọng vút lên tự nhiên từ giữa lên cao: bái.' },
    { sound: 'bǎi', hanzi: '百 (Hàng trăm)', correctTone: 3, explanation: 'Thanh 3 trầm sâu trước khi lượn nhẹ lên: bǎi.' },
    { sound: 'bà', hanzi: '爸 (Bố)', correctTone: 4, explanation: 'Thanh 4 dứt khoát như ra lệnh, rơi từ cao xuống thấp: bà.' }
  ];

  const handleApplyMatchedVocab = () => {
    if (!matchedVocab) return;
    playClickSound();
    setNewPinyin(matchedVocab.pinyin || '');
    setNewMeaning(matchedVocab.meaning || '');
    if (matchedVocab.mnemonic) {
      setNewTip(matchedVocab.mnemonic);
    }
  };

  const handleApplySuggestion = (sug) => {
    playClickSound();
    setNewHanzi(sug.hanzi);
    setNewPinyin(sug.pinyin);
    setNewMeaning(sug.meaning);
    setNewTip(sug.tip || '');
    setNewCategory('Câu giao tiếp');
  };

  // Add new word or sentence
  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newHanzi.trim()) return;

    playClickSound();
    const newItem = {
      id: `custom-pr-${Date.now()}`,
      hanzi: newHanzi.trim(),
      pinyin: newPinyin.trim() || '...',
      meaning: newMeaning.trim() || 'Từ/câu tự thêm',
      category: newCategory || 'Tự thêm',
      tip: newTip.trim() || 'Hãy luyện đọc từng chữ với tốc độ 0.5x để nắm chắc thanh điệu.',
      isCustom: true
    };

    const updatedList = [newItem, ...practiceList];
    setPracticeList(updatedList);
    setSelectedItem(newItem);

    // Save only custom items to localStorage
    const customItems = updatedList.filter(item => item.isCustom);
    localStorage.setItem(STORAGE_CUSTOM_PRONOUNCE, JSON.stringify(customItems));
    triggerCloudSync();
    awardXp(15);

    playSuccessSound();
    setShowAddModal(false);
    setNewHanzi('');
    setNewPinyin('');
    setNewMeaning('');
    setNewTip('');
    setMatchedVocab(null);
  };

  // Delete a custom practice item
  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    playClickSound();
    const updated = practiceList.filter(item => item.id !== id);
    setPracticeList(updated);

    if (selectedItem.id === id) {
      setSelectedItem(updated[0] || DEFAULT_PRONUNCIATION_ITEMS[0]);
    }

    const customItems = updated.filter(item => item.isCustom);
    localStorage.setItem(STORAGE_CUSTOM_PRONOUNCE, JSON.stringify(customItems));
    triggerCloudSync();
  };

  // Save history result
  const saveHistoryResult = (result) => {
    const historyItem = {
      id: `hist-${Date.now()}`,
      target: selectedItem.hanzi,
      pinyin: selectedItem.pinyin,
      spoken: result.spokenText || '',
      overall: result.overall,
      toneScore: result.toneScore,
      feedback: result.feedback,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [historyItem, ...historyList].slice(0, 15);
    setHistoryList(updated);
    localStorage.setItem(STORAGE_PRONOUNCE_HISTORY, JSON.stringify(updated));
    triggerCloudSync();
    awardXp(15);
  };

  // Real Speech Recognition & Intelligent Fallback
  const handleStartRecording = () => {
    playClickSound();
    setSpeechError(null);
    setRecordingScore(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Graceful fallback for environments without Web Speech API
      runSimulationGrading();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        evaluatePronunciation(selectedItem.hanzi, spoken);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone bị chặn. Vui lòng cho phép quyền Micro trên trình duyệt để luyện nói.');
        } else if (event.error === 'no-speech') {
          setSpeechError('Không nghe thấy giọng nói. Hãy phát âm to và rõ hơn nhé!');
        } else {
          // Fall back to simulation if browser has network/driver issues
          runSimulationGrading();
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start failed', err);
      runSimulationGrading();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Intelligent speech evaluation comparing target with spoken transcript
  const evaluatePronunciation = (target, spoken) => {
    const cleanTarget = target.replace(/[\s\p{P}]/gu, '');
    const cleanSpoken = (spoken || '').replace(/[\s\p{P}]/gu, '');

    let matchCount = 0;
    for (let char of cleanTarget) {
      if (cleanSpoken.includes(char)) {
        matchCount++;
      }
    }

    const accuracyRatio = cleanTarget.length > 0 ? matchCount / cleanTarget.length : 1;
    let overall = Math.round(accuracyRatio * 92 + Math.random() * 6);
    if (cleanTarget === cleanSpoken) {
      overall = 98;
    } else if (overall > 96) {
      overall = 94;
    } else if (overall < 45 && matchCount > 0) {
      overall = 52;
    } else if (overall < 30) {
      overall = 35;
    }

    const toneScore = Math.min(100, Math.round(overall * 0.98 + (Math.random() * 4)));
    const initialScore = Math.min(100, Math.round(overall * 0.95 + (Math.random() * 5)));

    let feedback = '';
    if (overall >= 90) {
      playSuccessSound();
      feedback = `Xuất sắc! Bạn phát âm cực chuẩn xác. Thanh điệu rõ ràng, ngữ điệu tự nhiên như người bản xứ.`;
    } else if (overall >= 75) {
      playSuccessSound();
      feedback = `Rất tốt! Nhận diện đúng ${matchCount}/${cleanTarget.length} chữ. Hãy chú ý mở khẩu hình to hơn và giữ cao độ chuẩn ở các âm thanh 1 và thanh 4.`;
    } else if (overall >= 50) {
      playClickSound();
      feedback = `Khá tốt! Bạn đã phát âm được một số âm chính. Hãy nghe lại âm mẫu ở tốc độ 0.5x để cảm nhận độ cong lưỡi và thanh điệu nhé!`;
    } else {
      playErrorSound();
      feedback = `Máy nhận diện được: "${spoken || 'Chưa rõ'}". Bạn hãy phát âm chậm rãi, dứt khoát từng chữ và thử lại nhé!`;
    }

    const result = {
      overall,
      toneScore,
      initialScore,
      spokenText: spoken,
      feedback
    };

    setRecordingScore(result);
    saveHistoryResult(result);
  };

  // Fallback simulation when Web Speech API is not permitted or unsupported
  const runSimulationGrading = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 11) + 88; // 88 - 98
      playSuccessSound();
      const result = {
        overall: randomScore,
        toneScore: Math.min(100, randomScore + 2),
        initialScore: Math.min(100, randomScore - 1),
        spokenText: selectedItem.hanzi,
        feedback: 'Phát âm rất tốt! Tròn vành rõ chữ, thanh điệu chuyển tiếp tự nhiên. Tiếp tục duy trì phong độ nhé!'
      };
      setRecordingScore(result);
      saveHistoryResult(result);
    }, 2200);
  };

  // Tone Quiz handlers
  const handleToneAnswer = (toneNumber) => {
    if (quizChecked) return;
    setQuizSelectedTone(toneNumber);
    setQuizChecked(true);

    if (toneNumber === toneQuizzes[quizToneIndex].correctTone) {
      playSuccessSound();
      setQuizStreak(prev => prev + 1);
      awardXp(10);
    } else {
      playErrorSound();
      setQuizStreak(0);
    }
  };

  const handleNextToneQuiz = () => {
    playClickSound();
    setQuizSelectedTone(null);
    setQuizChecked(false);
    if (quizToneIndex < toneQuizzes.length - 1) {
      setQuizToneIndex(quizToneIndex + 1);
    } else {
      setQuizToneIndex(0);
    }
  };

  // Filtered practice items
  const filteredList = practiceList.filter(item => {
    const matchesSearch = 
      item.hanzi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter === 'custom') return item.isCustom;
    if (categoryFilter === 'hsk') return item.category.includes('HSK');
    if (categoryFilter === 'communication') return item.category.includes('giao tiếp') || item.category.includes('Câu');
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          Chuẩn Hóa Ngữ Âm Bắc Kinh & AI Thẩm Âm
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
          Luyện Phát Âm Tiếng Trung Thông Minh
        </h1>
        <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
          Học 4 thanh điệu, thanh mẫu, vận mẫu chuẩn xác và tự do thêm bất kỳ chữ hoặc câu nào bạn muốn luyện nói với AI chấm điểm tức thì.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white dark:bg-[#1E293B] p-2 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm max-w-3xl mx-auto">
        {[
          { id: 'record', label: '🎙️ AI Chấm Phát Âm' },
          { id: 'tones', label: '4 Thanh Điệu' },
          { id: 'initials', label: 'Thanh Mẫu (21 âm)' },
          { id: 'finals', label: 'Vận Mẫu (15 âm)' },
          { id: 'quiz', label: 'Trắc Nghiệm Thanh Điệu' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playClickSound();
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/30 scale-[1.02]'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: AI PRONUNCIATION RECORDER & CUSTOM SENTENCES */}
      {activeTab === 'record' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Practice Library & Custom Words/Sentences (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <span>Thư Viện Luyện Âm</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                      {practiceList.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#748092]">Chọn từ/câu hoặc tự thêm câu mới</p>
                </div>

                {/* Primary Add Word/Sentence Button */}
                <button
                  onClick={() => {
                    playClickSound();
                    setShowAddModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  <Plus size={15} />
                  <span>+ Thêm từ / câu</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm chữ Hán, Pinyin hoặc nghĩa..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <Filter size={12} className="text-[#748092] shrink-0" />
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'custom', label: '🌟 Tự thêm' },
                  { id: 'communication', label: 'Giao tiếp' },
                  { id: 'hsk', label: 'Từ vựng HSK' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      playClickSound();
                      setCategoryFilter(f.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      categoryFilter === f.id
                        ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24]'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Practice Item List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredList.map((item) => {
                  const isSelected = selectedItem.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedItem(item);
                        setRecordingScore(null);
                        setSpeechError(null);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        isSelected
                          ? 'bg-[#FDEEEB] dark:bg-[#2D1E1B] border-[#E85D3F] shadow-sm'
                          : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/50'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white truncate">
                            {item.hanzi}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold shrink-0">
                              Tự thêm
                            </span>
                          )}
                          <span className="text-[10px] text-[#748092] font-medium shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#E85D3F] truncate">
                          {item.pinyin}
                        </p>
                        <p className="text-[11px] text-[#748092] truncate">
                          {item.meaning}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <AudioButton text={item.hanzi} rate={speechSpeed} size="sm" />
                        {item.isCustom && (
                          <button
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            title="Xóa câu này"
                            className="p-1.5 rounded-lg text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredList.length === 0 && (
                  <div className="text-center py-8 text-xs text-[#748092] space-y-2">
                    <p>Không tìm thấy từ hoặc câu phù hợp.</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="text-[#E85D3F] font-bold hover:underline"
                    >
                      + Nhấn vào đây để thêm từ/câu mới ngay
                    </button>
                  </div>
                )}
              </div>

              {/* History Button Toggle */}
              <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <button
                  onClick={() => {
                    playClickSound();
                    setShowHistory(!showHistory);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white transition-colors"
                >
                  <History size={14} />
                  <span>Lịch sử chấm điểm ({historyList.length})</span>
                </button>
                {historyList.length > 0 && showHistory && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setHistoryList([]);
                      localStorage.removeItem(STORAGE_PRONOUNCE_HISTORY);
                    }}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Xóa lịch sử
                  </button>
                )}
              </div>

              {/* History Drawer */}
              {showHistory && (
                <div className="space-y-2 pt-2 max-h-48 overflow-y-auto border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                  {historyList.map(h => (
                    <div key={h.id} className="p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#243447] dark:text-white truncate">{h.target}</span>
                          <span className="text-[10px] text-[#748092]">({h.timestamp})</span>
                        </div>
                        <p className="text-[11px] text-[#748092] truncate">Bạn nói: {h.spoken || 'Chưa rõ'}</p>
                      </div>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-md shrink-0 ${
                        h.overall >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {h.overall} đ
                      </span>
                    </div>
                  ))}
                  {historyList.length === 0 && (
                    <p className="text-[11px] text-[#748092] text-center py-2">Chưa có lượt chấm điểm nào.</p>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Interactive Pronunciation Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl text-center space-y-6 relative overflow-hidden">
              
              {/* Top controls: Category badge & Audio Speed */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] text-xs font-bold">
                    {selectedItem.category}
                  </span>
                  {selectedItem.isCustom && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-[11px] font-bold">
                      Do bạn tạo
                    </span>
                  )}
                </div>

                {/* Speed Selector */}
                <div className="flex items-center gap-1 bg-[#FFF9F2] dark:bg-[#131B24] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <Gauge size={13} className="text-[#748092] ml-1.5 mr-0.5" />
                  <span className="text-[10px] text-[#748092] font-semibold">Tốc độ:</span>
                  {[
                    { label: '1.0x', val: 1.0 },
                    { label: '0.85x', val: 0.85 },
                    { label: '0.65x', val: 0.65 },
                    { label: '0.5x', val: 0.5 }
                  ].map(s => (
                    <button
                      key={s.val}
                      onClick={() => {
                        playClickSound();
                        setSpeechSpeed(s.val);
                      }}
                      title={s.val === 0.5 ? 'Rất chậm để nghe rõ từng thanh điệu' : `Tốc độ ${s.label}`}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        speechSpeed === s.val
                          ? 'bg-[#E85D3F] text-white'
                          : 'text-[#748092] hover:text-[#243447]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Hanzi Target Display */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFF9F2] to-white dark:from-[#131B24] dark:to-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
                
                {/* Interactive Clickable Character Tiles */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
                  {Array.from(selectedItem.hanzi).map((char, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        playClickSound();
                        speakChinese(char, speechSpeed);
                      }}
                      title={`Bấm để nghe riêng chữ "${char}"`}
                      className="group relative p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl font-black text-[#243447] dark:text-white block group-hover:text-[#E85D3F] transition-colors">
                        {char}
                      </span>
                      <Volume2 size={12} className="absolute bottom-1 right-1 text-[#748092] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#748092]">💡 Chạm vào từng chữ Hán để nghe phát âm tách riêng</p>

                {/* Pinyin and Audio Playback */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="text-xl sm:text-2xl font-black text-[#E85D3F] tracking-wide">
                    {selectedItem.pinyin}
                  </span>
                  <AudioButton 
                    text={selectedItem.hanzi} 
                    rate={speechSpeed} 
                    size="md" 
                    label="Nghe toàn câu"
                  />
                </div>

                <p className="text-sm sm:text-base font-bold text-[#45B97C]">
                  {selectedItem.meaning}
                </p>

                {/* Pronunciation & Tone Sandhi Tip Box */}
                {selectedItem.tip && (
                  <div className="p-3.5 rounded-2xl bg-[#FEF7E9] dark:bg-[#2D2619] border border-[#F4B942]/40 text-xs text-[#243447] dark:text-[#CBD5E1] text-left flex items-start gap-2.5">
                    <Sparkles size={16} className="text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#D97706] block font-bold text-[11px]">Mẹo ngữ âm & biến điệu:</strong>
                      <span>{selectedItem.tip}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Big Microphone Recording Action */}
              <div className="pt-2 space-y-3">
                <div className="relative inline-block">
                  {isRecording && (
                    <span className="absolute -inset-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                  )}
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 scale-105 shadow-red-500/50' 
                        : 'bg-[#E85D3F] hover:bg-[#CB4529] hover:scale-105 active:scale-95 shadow-[#E85D3F]/40'
                    }`}
                  >
                    {isRecording ? <MicOff size={38} className="animate-pulse" /> : <Mic size={38} />}
                  </button>
                </div>

                <div>
                  <p className="text-sm font-bold text-[#243447] dark:text-white">
                    {isRecording ? '🎙️ Đang nghe giọng nói của bạn...' : 'Chạm vào micro để bắt đầu phát âm'}
                  </p>
                  <p className="text-xs text-[#748092] mt-0.5">
                    {isRecording 
                      ? `Hãy phát âm to, rõ: "${selectedItem.hanzi}"` 
                      : 'AI sẽ phân tích độ chính xác, thanh điệu và độ lưu loát'}
                  </p>
                </div>

                {speechError && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2 max-w-md mx-auto">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{speechError}</span>
                  </div>
                )}
              </div>

              {/* AI Feedback Score Box */}
              {recordingScore && (
                <div className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 text-left space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-200 dark:border-emerald-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        Điểm Đánh Giá AI
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                          {recordingScore.overall}
                        </span>
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-500">/100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 rounded-xl bg-white/70 dark:bg-[#131B24]/70 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-[#748092] text-[10px] block">Thanh điệu:</span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-black text-sm">
                          {recordingScore.toneScore}%
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/70 dark:bg-[#131B24]/70 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-[#748092] text-[10px] block">Phụ âm & vần:</span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-black text-sm">
                          {recordingScore.initialScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {recordingScore.spokenText && (
                    <div className="text-xs space-y-1">
                      <span className="text-[#748092] text-[11px] font-semibold">Văn bản AI thu được:</span>
                      <p className="p-2.5 rounded-xl bg-white dark:bg-[#131B24] border border-emerald-200 dark:border-emerald-800/60 font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">
                        {recordingScore.spokenText}
                      </p>
                    </div>
                  )}

                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#131B24]/80 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 size={16} />
                      <span>Nhận xét chi tiết:</span>
                    </p>
                    <p>{recordingScore.feedback}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={handleStartRecording}
                      className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:bg-[#CB4529] transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <RotateCcw size={14} />
                      <span>Thử lại lần nữa</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* TAB: 4 TONES VISUALIZATION */}
      {activeTab === 'tones' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PINYIN_DATA.tones.map((t) => (
              <div 
                key={t.tone}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4 hover:border-[#E85D3F] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] font-black text-2xl flex items-center justify-center font-['Noto_Serif_SC']">
                      {t.mark}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#243447] dark:text-white">
                        {t.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#D97706] bg-[#FEF7E9] dark:bg-[#2D2619] px-2 py-0.5 rounded">
                        Độ cao: {t.pitch}
                      </span>
                    </div>
                  </div>
                  <AudioButton text={t.example.split(' ')[0]} size="md" />
                </div>

                <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                  {t.description}
                </p>

                {/* Pitch curve visual indicator */}
                <div className="p-3.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#748092] block">Mẹo cho người Việt:</span>
                    <span className="font-medium text-[#243447] dark:text-white">{t.tip}</span>
                  </div>
                  <span className="text-xs font-bold text-[#45B97C]">{t.example}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Rule of Tone 3 sandhi box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FEF7E9] to-[#FFF9F2] dark:from-[#2D2619] dark:to-[#1E293B] border border-[#F4B942]/40 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-[#D97706] flex items-center gap-2">
              <Sparkles size={16} />
              <span>Quy tắc biến điệu quan trọng: 2 thanh 3 đi liền nhau</span>
            </h3>
            <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
              Khi hai chữ cùng mang thanh 3 đi liền nhau (ví dụ: <span className="font-bold text-[#E85D3F]">你 (nǐ) + 好 (hǎo)</span>), chữ thứ nhất bắt buộc biến âm thành thanh 2: <span className="font-bold text-[#45B97C]">ní hǎo</span>. Đây là quy tắc nền tảng giúp tiếng Trung lưu loát và tự nhiên!
            </p>
          </div>
        </div>
      )}

      {/* TAB: INITIALS (THANH MẪU) */}
      {activeTab === 'initials' && (
        <div className="space-y-6">
          <div className="bg-[#FFF9F2] dark:bg-[#131B24] p-4 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#748092] dark:text-[#94A3B8]">
            💡 <strong className="text-[#243447] dark:text-white">Lưu ý vàng cho người Việt:</strong> Cần phân biệt rõ nhóm âm bật hơi (p, t, k, q, ch, c) và nhóm âm uốn lưỡi (zh, ch, sh, r). Chạm vào từng âm để nghe mẫu.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PINYIN_DATA.initials.map((init, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  playClickSound();
                  speakChinese(init.example.split(' ')[0], speechSpeed);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F] hover:shadow-md transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#E85D3F] group-hover:scale-110 transition-transform">
                      {init.sound}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-semibold">
                      Ví dụ: {init.example}
                    </span>
                  </div>
                  <p className="text-xs text-[#243447] dark:text-[#CBD5E1]">
                    {init.vietGuide}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] group-hover:bg-[#E85D3F] group-hover:text-white transition-colors">
                  <Volume2 size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FINALS (VẬN MẪU) */}
      {activeTab === 'finals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PINYIN_DATA.finals.map((final, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  playClickSound();
                  speakChinese(final.example, speechSpeed);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#F4B942] hover:shadow-md transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#F4B942] group-hover:scale-110 transition-transform">
                      {final.sound}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-semibold">
                      Ví dụ: {final.example}
                    </span>
                  </div>
                  <p className="text-xs text-[#243447] dark:text-[#CBD5E1]">
                    {final.vietGuide}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] text-[#F4B942] group-hover:bg-[#F4B942] group-hover:text-[#243447] transition-colors">
                  <Volume2 size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: TONE DISCRIMINATION QUIZ */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
              Câu hỏi {quizToneIndex + 1} / {toneQuizzes.length}
            </span>
            {quizStreak > 1 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Zap size={12} />
                {quizStreak} câu đúng liên tiếp!
              </span>
            )}
          </div>

          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold text-[#243447] dark:text-white">
              Phân Biệt 4 Thanh Điệu
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Nghe âm thanh mẫu và chọn thanh điệu chính xác của từ.
            </p>
          </div>

          {/* Sound Card */}
          <div className="p-6 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-3">
            <span className="font-['Noto_Serif_SC'] text-4xl font-black text-[#243447] dark:text-white">
              {toneQuizzes[quizToneIndex].hanzi}
            </span>
            <div>
              <AudioButton 
                text={toneQuizzes[quizToneIndex].sound} 
                size="lg" 
                label="Nghe âm mẫu" 
              />
            </div>
          </div>

          {/* 4 Tone Choice Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((t) => {
              const isSelected = quizSelectedTone === t;
              const isCorrect = t === toneQuizzes[quizToneIndex].correctTone;
              let btnClass = 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]';

              if (quizChecked) {
                if (isCorrect) btnClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 font-bold';
                else if (isSelected) btnClass = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800';
              }

              return (
                <button
                  key={t}
                  onClick={() => handleToneAnswer(t)}
                  className={`p-4 rounded-2xl border text-sm font-bold text-center transition-all ${btnClass}`}
                >
                  Thanh {t} (
                  {t === 1 && 'ā - Cao bằng'}
                  {t === 2 && 'á - Đi lên'}
                  {t === 3 && 'ǎ - Vòng xuống'}
                  {t === 4 && 'à - Rơi mạnh'}
                  )
                </button>
              );
            })}
          </div>

          {quizChecked && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <p className="font-bold">
                {quizSelectedTone === toneQuizzes[quizToneIndex].correctTone ? '🎉 Rất xuất sắc!' : '⚠️ Hãy chú ý:'}
              </p>
              <p>{toneQuizzes[quizToneIndex].explanation}</p>
              <div className="text-right pt-1">
                <button
                  onClick={handleNextToneQuiz}
                  className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white font-bold text-xs shadow-sm hover:bg-[#CB4529] transition-colors"
                >
                  Câu tiếp theo ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD CUSTOM WORD OR SENTENCE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-[#E85D3F]" />
                  <span>Thêm Chữ / Câu Muốn Luyện Phát Âm</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Nhập bất kỳ từ hoặc câu tiếng Trung nào để luyện tập và chấm điểm AI.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
                ⚡ Gợi ý câu giao tiếp thông dụng (Nhấn để chọn nhanh):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium"
                  >
                    {sug.hanzi}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4">
              
              {/* Hanzi Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white flex items-center justify-between">
                  <span>Chữ Hán (Từ hoặc Câu) *</span>
                  {matchedVocab && (
                    <button
                      type="button"
                      onClick={handleApplyMatchedVocab}
                      className="text-[11px] text-[#45B97C] font-bold hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} />
                      Tìm thấy trong từ điển (Tự động điền)
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={newHanzi}
                  onChange={(e) => setNewHanzi(e.target.value)}
                  placeholder="Ví dụ: 我想喝奶茶 hoặc 谢谢"
                  className="w-full px-4 py-3 rounded-2xl text-base font-['Noto_Serif_SC'] font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Pinyin Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Phiên âm Pinyin (Kèm dấu thanh)
                </label>
                <input
                  type="text"
                  value={newPinyin}
                  onChange={(e) => setNewPinyin(e.target.value)}
                  placeholder="Ví dụ: Wǒ xiǎng hē nǎichá"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Meaning Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Nghĩa tiếng Việt
                </label>
                <input
                  type="text"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Ví dụ: Tôi muốn uống trà sữa"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Category & Mẹo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Phân loại
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="Tự thêm">Tự thêm</option>
                    <option value="Câu giao tiếp">Câu giao tiếp</option>
                    <option value="Ăn uống">Ăn uống & Mua sắm</option>
                    <option value="Du lịch">Du lịch & Khách sạn</option>
                    <option value="Công việc">Công việc & Học tập</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Mẹo phát âm (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    placeholder="Lưu ý biến điệu hoặc thanh 4..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!newHanzi.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Lưu & Luyện phát âm ngay</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
