import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
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
  Gauge,
  Play,
  Pause,
  Award,
  ArrowRight,
  Target,
  Music,
  Headphones,
  Check
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { PINYIN_DATA, VOCABULARY_LIST } from '../data/chineseData';
import { triggerCloudSync, getPronunciationItemsFromDb, addPronunciationItemToDb } from '../supabase/services';
import { awardXp } from '../utils/gamification';
import { evaluateRealPronunciation } from '../utils/pronunciationEvaluator';

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

export default function PronunciationPage({ targetVocab, onClearTargetVocab }) {
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
    if (targetVocab && targetVocab.hanzi) {
      return {
        id: `target-vocab-${targetVocab.id || targetVocab.hanzi}`,
        hanzi: targetVocab.hanzi,
        pinyin: targetVocab.pinyin || '',
        meaning: targetVocab.meaning || '',
        category: targetVocab.level || 'Từ vựng HSK',
        tip: targetVocab.mnemonic || `Luyện phát âm chuẩn: ${targetVocab.hanzi} (${targetVocab.pinyin || ''}) - ${targetVocab.meaning || ''}`,
        isTargetVocab: true
      };
    }
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

  // Extract practice item if a vocabulary word is being practiced
  const targetPracticeItem = useMemo(() => {
    if (!targetVocab || !targetVocab.hanzi) return null;
    return {
      id: `target-vocab-${targetVocab.id || targetVocab.hanzi}`,
      hanzi: targetVocab.hanzi,
      pinyin: targetVocab.pinyin || '',
      meaning: targetVocab.meaning || '',
      category: targetVocab.level || 'Từ vựng HSK',
      tip: targetVocab.mnemonic || `Luyện phát âm chuẩn: ${targetVocab.hanzi} (${targetVocab.pinyin || ''}) - ${targetVocab.meaning || ''}`,
      isTargetVocab: true
    };
  }, [targetVocab]);


  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'hsk', 'communication', 'custom'

  // Speech Speed state
  const [speechSpeed, setSpeechSpeed] = useState(0.85); // 1.0, 0.85, 0.65, 0.5

  // Stored best scores per item
  const [savedScores, setSavedScores] = useState(() => {
    try {
      const stored = localStorage.getItem('hanzigo_pronounce_scores');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Fetch items from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    getPronunciationItemsFromDb().then(dbItems => {
      if (!isMounted || !dbItems || dbItems.length === 0) return;
      setPracticeList(prev => {
        const customItems = prev.filter(p => p.isCustom);
        const merged = [...customItems];
        dbItems.forEach(dbItem => {
          if (!merged.some(m => m.hanzi === dbItem.hanzi)) {
            merged.push(dbItem);
          }
        });
        return merged;
      });
    });
    return () => { isMounted = false; };
  }, []);

  // Recording, MediaRecorder & Audio Visualizer State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingScore, setRecordingScore] = useState(null);
  const [speechError, setSpeechError] = useState(null);
  const [userAudioUrl, setUserAudioUrl] = useState(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Synchronize targetPracticeItem when user navigates from VocabularyPage
  useEffect(() => {
    if (targetPracticeItem) {
      setActiveTab('record');
      setPracticeList(prev => {
        const withoutTarget = prev.filter(p => p.hanzi !== targetPracticeItem.hanzi);
        return [targetPracticeItem, ...withoutTarget];
      });
      setSelectedItem(targetPracticeItem);
      setRecordingScore(null);
      setSpeechError(null);
      setUserAudioUrl(null);
    }
  }, [targetPracticeItem]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);
  const userAudioPlayerRef = useRef(null);
  const isRecordingRef = useRef(false);
  const recognitionRef = useRef(null);
  const recordingStartTimeRef = useRef(0);
  
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

  const toneQuizzes = [
    { sound: 'mā', hanzi: '妈 (Mẹ)', correctTone: 1, explanation: 'Thanh 1 giữ cao độ 55 bằng phẳng, ngân dài đều: mā.' },
    { sound: 'má', hanzi: '麻 (Cây gai)', correctTone: 2, explanation: 'Thanh 2 giọng đi lên từ cao độ 3 đến 5 giống dấu sắc tiếng Việt: má.' },
    { sound: 'mǎ', hanzi: '马 (Con ngựa)', correctTone: 3, explanation: 'Thanh 3 hạ thấp xuống 1 rồi uốn vòng lên 4: mǎ.' },
    { sound: 'mà', hanzi: '骂 (Mắng mỏ)', correctTone: 4, explanation: 'Thanh 4 rơi dứt khoát từ 5 xuống 1, ngắt âm dứt điểm: mà.' },
    { sound: 'bā', hanzi: '八 (Số 8)', correctTone: 1, explanation: 'Thanh 1 âm b không bật hơi, cao độ 55 ngân đều.' },
    { sound: 'bái', hanzi: '白 (Màu trắng)', correctTone: 2, explanation: 'Thanh 2 giọng vút lên tự nhiên từ giữa lên cao: bái.' },
    { sound: 'bǎi', hanzi: '百 (Hàng trăm)', correctTone: 3, explanation: 'Thanh 3 trầm sâu trước khi lượn nhẹ lên: bǎi.' },
    { sound: 'bà', hanzi: '爸 (Bố)', correctTone: 4, explanation: 'Thanh 4 dứt khoát như ra lệnh, rơi từ cao xuống thấp: bà.' },
    { sound: 'hē', hanzi: '喝 (Uống)', correctTone: 1, explanation: 'Thanh 1 âm cuống họng, cao độ 55 bằng phẳng: hē.' },
    { sound: 'chá', hanzi: '茶 (Trà)', correctTone: 2, explanation: 'Thanh 2 bật hơi uốn lưỡi, giọng vút lên điệu nghệ: chá.' },
    { sound: 'hǎo', hanzi: '好 (Tốt / Đẹp)', correctTone: 3, explanation: 'Thanh 3 hạ sâu xuống 1 rồi lượn nhẹ lên: hǎo.' },
    { sound: 'xiè', hanzi: '谢 (Cảm ơn)', correctTone: 4, explanation: 'Thanh 4 mặt lưỡi phẳng dứt khoát dứt điểm: xiè.' }
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

  // Add new word or sentence with Supabase cloud sync
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

    // Save custom items to localStorage
    const customItems = updatedList.filter(item => item.isCustom);
    localStorage.setItem(STORAGE_CUSTOM_PRONOUNCE, JSON.stringify(customItems));
    
    // Also save to Supabase cloud
    addPronunciationItemToDb(newItem);
    triggerCloudSync();
    awardXp(15);

    playSuccessSound();
    setShowAddModal(false);
    setNewHanzi('');
    setNewPinyin('');
    setNewMeaning('');
    setNewTip('');
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
  };

  // Clean up audio streams and visualizer
  const cleanupAudioRecording = useCallback(() => {
    setIsRecording(false);
    isRecordingRef.current = false;
    setAudioLevel(0);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Recorder stop error:', e);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn('AudioContext close notice:', e);
      }
      audioContextRef.current = null;
    }
  }, []);

  // Play user voice playback
  const playUserVoice = () => {
    if (!userAudioUrl) return;
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.currentTime = 0;
      userAudioPlayerRef.current.play();
      setIsPlayingUserAudio(true);
    }
  };

  // Real Speech Recognition & Audio Capture
  const handleStartRecording = async () => {
    playClickSound();
    setSpeechError(null);
    setRecordingScore(null);
    setUserAudioUrl(null);
    audioChunksRef.current = [];
    isRecordingRef.current = true;
    setIsRecording(true);

    // 1. Setup MediaStream & Live Visualizer
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // Web Audio Analyser
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevel = () => {
            if (!isRecordingRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            setAudioLevel(sum / dataArray.length);
            animFrameRef.current = requestAnimationFrame(updateLevel);
          };
          updateLevel();
        }

        // MediaRecorder to record audio blob for playback
        if (typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.onstop = () => {
            if (audioChunksRef.current.length > 0) {
              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const url = URL.createObjectURL(blob);
              setUserAudioUrl(url);
            }
          };
          recorder.start(100);
        }
      }
    } catch (mediaErr) {
      console.warn('Microphone access / MediaRecorder notice:', mediaErr);
    }

    // 2. Setup SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      cleanupAudioRecording();
      setSpeechError('Trình duyệt hiện tại không hỗ trợ Web Speech API nhận diện tiếng Trung. Khuyên dùng Google Chrome hoặc Microsoft Edge để luyện nói và chấm điểm chính xác.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        isRecordingRef.current = true;
        recordingStartTimeRef.current = Date.now();
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const durationMs = Date.now() - (recordingStartTimeRef.current || Date.now());
        evaluatePronunciation(selectedItem.hanzi, selectedItem.pinyin, spoken, durationMs);
        cleanupAudioRecording();
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        cleanupAudioRecording();
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone bị chặn. Vui lòng cấp quyền Micro trên trình duyệt để luyện nói.');
        } else if (event.error === 'no-speech') {
          setSpeechError('Không phát hiện được giọng nói. Hãy tiến gần microphone hơn và phát âm to, dứt khoát từng chữ nhé!');
        } else {
          setSpeechError('Nhận dạng giọng nói gặp lỗi: ' + (event.error || 'Vui lòng thử lại.'));
        }
      };

      recognition.onend = () => {
        cleanupAudioRecording();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start failed', err);
      cleanupAudioRecording();
      setSpeechError('Không thể khởi động bộ nhận dạng giọng nói. Vui lòng kiểm tra micro hoặc tải lại trang.');
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    cleanupAudioRecording();
  };

  // Real speech evaluation comparing target with spoken transcript
  const evaluatePronunciation = (targetHanzi, targetPinyin, spoken, durationMs) => {
    const result = evaluateRealPronunciation({
      targetHanzi,
      targetPinyin,
      spokenTranscript: spoken,
      audioDurationMs: durationMs
    });

    if (result.overall >= 75) {
      try {
        confetti({
          particleCount: result.overall >= 90 ? 70 : 35,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
      playSuccessSound();
    } else {
      playClickSound();
    }

    if (result.xpEarned > 0) {
      awardXp(result.xpEarned, null, `pronounce_${targetHanzi}`);
    }

    setRecordingScore(result);
    saveHistoryResult(result);

    // Save best score for this item
    setSavedScores(prev => {
      const prevBest = prev[targetHanzi] || 0;
      const updated = {
        ...prev,
        [targetHanzi]: Math.max(prevBest, result.overall)
      };
      try {
        localStorage.setItem('hanzigo_pronounce_scores', JSON.stringify(updated));
      } catch (e) {
        console.warn('Save scores error:', e);
      }
      return updated;
    });

    triggerCloudSync();
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
    if (item.isTargetVocab) return true;
    const matchesSearch = 
      item.hanzi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter === 'custom') return item.isCustom;
    if (categoryFilter === 'hsk') return (item.category || '').includes('HSK');
    if (categoryFilter === 'communication') return (item.category || '').includes('giao tiếp') || (item.category || '').includes('Câu');
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
                  <span>Thêm từ / câu</span>
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
                  const itemBestScore = savedScores[item.hanzi];
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedItem(item);
                        setRecordingScore(null);
                        setSpeechError(null);
                        setUserAudioUrl(null);
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
                          {itemBestScore !== undefined && (
                            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded text-white shrink-0 ${
                              itemBestScore >= 80 ? 'bg-emerald-500' : itemBestScore >= 65 ? 'bg-blue-500' : 'bg-amber-500'
                            }`} title={`Điểm cao nhất: ${itemBestScore}/100`}>
                              {itemBestScore}đ
                            </span>
                          )}
                          {item.isTargetVocab && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold shrink-0">
                              Đang luyện
                            </span>
                          )}
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
              
              {/* Hidden audio player for user voice playback */}
              {userAudioUrl && (
                <audio 
                  ref={userAudioPlayerRef} 
                  src={userAudioUrl} 
                  onEnded={() => setIsPlayingUserAudio(false)} 
                  className="hidden" 
                />
              )}

              {/* Target Vocabulary Highlight Banner */}
              {targetVocab && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/20 border-2 border-emerald-400/50 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                      🎙️
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                          Từ vựng đang luyện phát âm
                        </span>
                        <span className="text-base sm:text-lg font-black font-['Noto_Serif_SC'] text-[#243447] dark:text-white">
                          {targetVocab.hanzi}
                        </span>
                        <span className="text-xs font-bold text-[#E85D3F]">
                          ({targetVocab.pinyin})
                        </span>
                      </div>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                        Nghĩa: <strong className="text-emerald-600 dark:text-emerald-400">{targetVocab.meaning}</strong>
                      </p>
                    </div>
                  </div>
                  {onClearTargetVocab && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onClearTargetVocab();
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#748092] hover:text-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] shrink-0 transition-colors"
                    >
                      ✕ Xem danh sách chung
                    </button>
                  )}
                </div>
              )}

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

              {/* Big Microphone Recording Action & Dynamic Waveform Equalizer */}
              <div className="pt-2 space-y-4">
                <div className="relative inline-block">
                  {isRecording && (
                    <span className="absolute -inset-4 rounded-full bg-red-500/30 animate-ping"></span>
                  )}
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl transition-all duration-300 cursor-pointer ${
                      isRecording 
                        ? 'bg-red-500 scale-105 shadow-red-500/50 ring-4 ring-red-300 dark:ring-red-900' 
                        : 'bg-[#E85D3F] hover:bg-[#CB4529] hover:scale-105 active:scale-95 shadow-[#E85D3F]/40'
                    }`}
                  >
                    {isRecording ? <MicOff size={38} className="animate-pulse" /> : <Mic size={38} />}
                  </button>
                </div>

                {/* Dynamic Real-time Audio Waveform Equalizer */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-1.5 h-9 py-1 animate-in fade-in duration-200">
                    {[0.35, 0.7, 1.0, 0.85, 0.45, 0.9, 0.6, 0.3].map((factor, i) => {
                      const dynamicH = Math.max(6, Math.min(34, (audioLevel / 255) * 45 * factor + (Math.sin(Date.now() / 140 + i) * 6 + 10)));
                      return (
                        <span
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-[#CB4529] to-[#E85D3F] rounded-full transition-all duration-75"
                          style={{ height: `${dynamicH}px` }}
                        />
                      );
                    })}
                  </div>
                )}

                <div>
                  <p className="text-sm font-bold text-[#243447] dark:text-white">
                    {isRecording ? '🎙️ Đang nghe giọng bạn... (Bấm micro để dừng)' : 'Chạm vào micro để bắt đầu phát âm'}
                  </p>
                  <p className="text-xs text-[#748092] mt-0.5">
                    {isRecording 
                      ? `Hãy phát âm to, rõ: "${selectedItem.hanzi}"` 
                      : 'AI sẽ phân tích độ chính xác từ vựng, thanh điệu và độ lưu loát'}
                  </p>
                </div>

                {isRecording && (
                  <button
                    onClick={handleStopRecording}
                    className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs font-bold hover:bg-red-200 transition-colors"
                  >
                    Dừng ghi âm & Chấm điểm
                  </button>
                )}

                {speechError && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2 max-w-md mx-auto">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{speechError}</span>
                  </div>
                )}
              </div>

              {/* Comprehensive AI Feedback Scorecard with Dual Audio & Character Breakdown */}
              {recordingScore && (
                <div className={`p-6 rounded-3xl border-2 text-left space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm ${
                  recordingScore.overall >= 90
                    ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/40 dark:from-emerald-950/50 dark:to-[#1E293B] border-emerald-400 dark:border-emerald-700'
                    : recordingScore.overall >= 78
                    ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/40 dark:from-blue-950/50 dark:to-[#1E293B] border-blue-400 dark:border-blue-700'
                    : recordingScore.overall >= 65
                    ? 'bg-gradient-to-br from-amber-50/90 to-yellow-50/40 dark:from-amber-950/50 dark:to-[#1E293B] border-amber-400 dark:border-amber-700'
                    : 'bg-gradient-to-br from-orange-50/90 to-rose-50/40 dark:from-orange-950/50 dark:to-[#1E293B] border-orange-400 dark:border-orange-700'
                }`}>
                  {/* Top Header: Rank + Big Score + XP */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                          recordingScore.overall >= 90
                            ? 'bg-emerald-500 text-white'
                            : recordingScore.overall >= 78
                            ? 'bg-blue-500 text-white'
                            : recordingScore.overall >= 65
                            ? 'bg-amber-500 text-white'
                            : 'bg-orange-500 text-white'
                        }`}>
                          <Award size={14} />
                          <span>{recordingScore.rankBadge}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-800">
                          <Sparkles size={12} />
                          +{recordingScore.xpEarned} XP
                        </span>
                      </div>
                      <p className="text-xs text-[#243447] dark:text-[#E2E8F0] font-medium leading-relaxed">
                        {recordingScore.feedback}
                      </p>
                    </div>

                    <div className="shrink-0 text-center">
                      <div className={`w-18 h-18 rounded-2xl flex flex-col items-center justify-center font-black shadow-md ${
                        recordingScore.overall >= 90
                          ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                          : recordingScore.overall >= 78
                          ? 'bg-blue-500 text-white shadow-blue-500/30'
                          : recordingScore.overall >= 65
                          ? 'bg-amber-500 text-white shadow-amber-500/30'
                          : 'bg-orange-500 text-white shadow-orange-500/30'
                      }`}>
                        <span className="text-3xl leading-none">{recordingScore.overall}</span>
                        <span className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Điểm</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Progress Bars: Word, Tone, Fluency */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 1. Word Accuracy */}
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-black/5 dark:border-white/5 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-[#243447] dark:text-[#E2E8F0]">
                          <Target size={13} className="text-[#E85D3F]" />
                          <span>Độ chính xác từ</span>
                        </span>
                        <span className="text-[#E85D3F] font-black">{recordingScore.wordScore}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div 
                          className="h-full bg-[#E85D3F] rounded-full transition-all duration-500" 
                          style={{ width: `${recordingScore.wordScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] block">Nhận diện mặt chữ</span>
                    </div>

                    {/* 2. Tone Accuracy */}
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-black/5 dark:border-white/5 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-[#243447] dark:text-[#E2E8F0]">
                          <Music size={13} className="text-blue-500" />
                          <span>Chuẩn thanh điệu</span>
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-black">{recordingScore.toneScore}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                          style={{ width: `${recordingScore.toneScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] block">Cao độ & luyến âm</span>
                    </div>

                    {/* 3. Fluency */}
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-black/5 dark:border-white/5 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-[#243447] dark:text-[#E2E8F0]">
                          <Sparkles size={13} className="text-emerald-500" />
                          <span>Độ lưu loát</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">{recordingScore.fluencyScore}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${recordingScore.fluencyScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] block">Ngữ điệu tự nhiên</span>
                    </div>
                  </div>

                  {/* Dual Audio Comparison Player */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-[#131B24]/80 border border-black/5 dark:border-white/5">
                    <span className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                      <Headphones size={15} className="text-[#E85D3F]" />
                      <span>So sánh trực quan:</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => speakChinese(selectedItem.hanzi, speechSpeed)}
                        className="px-3 py-1.5 rounded-xl bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] hover:bg-[#FDEED3] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Volume2 size={14} />
                        <span>Nghe âm mẫu bản xứ</span>
                      </button>
                      {userAudioUrl && (
                        <button
                          onClick={playUserVoice}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isPlayingUserAudio 
                              ? 'bg-emerald-600 text-white animate-pulse' 
                              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                          }`}
                        >
                          <Headphones size={14} />
                          <span>{isPlayingUserAudio ? 'Đang phát giọng bạn...' : '🎧 Nghe lại giọng của bạn'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Character-by-Character Phoneme Breakdown */}
                  {recordingScore.charBreakdown && recordingScore.charBreakdown.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] block">
                        Đánh giá chi tiết từng chữ Hán:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {recordingScore.charBreakdown.map((item, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-2xl border text-center font-bold ${
                              item.status === 'correct'
                                ? 'bg-emerald-100/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                : item.status === 'warning'
                                ? 'bg-amber-100/70 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                                : 'bg-rose-100/70 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                            }`}
                          >
                            <span className="font-['Noto_Serif_SC'] text-2xl block leading-tight">{item.char}</span>
                            <span className="text-[10px] block opacity-90 mt-0.5">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spoken Text Recognized vs Target */}
                  {recordingScore.spokenText && (
                    <div className="text-xs space-y-1">
                      <span className="text-[#748092] text-[11px] font-semibold">Văn bản AI thu được:</span>
                      <p className="p-2.5 rounded-xl bg-white dark:bg-[#131B24] border border-black/5 dark:border-white/5 font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">
                        {recordingScore.spokenText}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons: Retry & Next Item */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-black/5 dark:border-white/10">
                    <button
                      onClick={handleStartRecording}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-black/10 dark:border-white/10 text-xs font-bold text-[#243447] dark:text-white hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>Luyện lại câu này</span>
                    </button>

                    {filteredList.findIndex(i => i.id === selectedItem.id) < filteredList.length - 1 && (
                      <button
                        onClick={() => {
                          playClickSound();
                          const curIdx = filteredList.findIndex(i => i.id === selectedItem.id);
                          if (curIdx >= 0 && curIdx < filteredList.length - 1) {
                            setSelectedItem(filteredList[curIdx + 1]);
                            setRecordingScore(null);
                            setSpeechError(null);
                            setUserAudioUrl(null);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Luyện câu tiếp theo</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
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
