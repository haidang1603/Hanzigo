import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trash2, 
  Check, 
  Play, 
  Eye, 
  EyeOff, 
  Award, 
  Sparkles, 
  Plus,
  Undo2,
  Download,
  X,
  CheckCircle2,
  Palette,
  RotateCcw,
  ArrowRight,
  Target,
  Scale,
  PenTool,
  Info
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { CHARACTERS_WRITING, VOCABULARY_LIST } from '../data/chineseData';
import { playSuccessSound, playClickSound } from '../utils/audio';
import { triggerCloudSync, getWritingCharactersFromDb } from '../supabase/services';
import { awardXp } from '../utils/gamification';

const STORAGE_CUSTOM_CHARS = 'hanzigo_custom_writing_chars';

// Quick character auto-lookup database for popular Chinese characters
const POPULAR_CHARS_DICT = {
  '家': { pinyin: 'jiā', hanviet: 'Gia', meaning: 'Nhà, gia đình', radical: '宀 (Miên)', strokesCount: 10, mnemonic: 'Dưới mái nhà (宀) có nuôi chú heo (豕) là gia đình ấm no.', tip: 'Mái nhà che chở cân đối, nét móc cuối cùng cong nhẹ vững chãi.' },
  '茶': { pinyin: 'chá', hanviet: 'Trà', meaning: 'Lá trà, nước trà', radical: '艹 (Thảo)', strokesCount: 9, mnemonic: 'Cây cỏ (艹) của con người (人) trồng trên cây gỗ (木).', tip: 'Bộ thảo trên đầu viết gọn gàng, nét phẩy và mác dưới chân dang rộng.' },
  '水': { pinyin: 'shuǐ', hanviet: 'Thủy', meaning: 'Nước, dòng sông', radical: '水 (Thủy)', strokesCount: 4, mnemonic: 'Dòng nước chảy cuồn cuộn với giọt nước hai bên.', tip: 'Nét sổ móc ở giữa đặt đúng tâm mễ tự cách, các nét bên viết dốc đều.' },
  '人': { pinyin: 'rén', hanviet: 'Nhân', meaning: 'Con người', radical: '人 (Nhân)', strokesCount: 2, mnemonic: 'Hình ảnh hai chân con người đứng vững trên mặt đất.', tip: 'Nét phẩy khởi bút từ tâm đỉnh, nét mác hạ dần tạo thế đứng cân xứng.' },
  '天': { pinyin: 'tiān', hanviet: 'Thiên', meaning: 'Trời, ngày', radical: '大 (Đại)', strokesCount: 4, mnemonic: 'Phía trên con người (大) chính là bầu trời (一).', tip: 'Nét ngang trên ngắn, nét ngang dưới dài, nét phẩy và mác thanh thoát.' },
  '国': { pinyin: 'guó', hanviet: 'Quốc', meaning: 'Đất nước, quốc gia', radical: '囗 (Vi)', strokesCount: 8, mnemonic: 'Viên ngọc quý (玉) được bao bọc kiên cố bên trong bờ cõi thành trì (囗).', tip: 'Viết khung ngoài trước, viết chữ ngọc bên trong rồi đóng cửa đáy sau cùng.' },
  '车': { pinyin: 'chē', hanviet: 'Xa', meaning: 'Xe cộ, phương tiện', radical: '车 (Xa)', strokesCount: 4, mnemonic: 'Hình chiếc xe có bánh và trục xe đứng thẳng.', tip: 'Nét sổ cuối cùng xuyên thẳng chính giữa, vuông vức cân đối.' },
  '钱': { pinyin: 'qián', hanviet: 'Tiền', meaning: 'Tiền bạc, tài chính', radical: '钅(Kim)', strokesCount: 10, mnemonic: 'Đúc bằng kim loại (钅), ai cũng dùng vũ khí (戈) tranh giành.', tip: 'Bộ kim bên trái viết thon gọn nhường chỗ cho nửa bên phải.' },
  '心': { pinyin: 'xīn', hanviet: 'Tâm', meaning: 'Trái tim, lòng dạ', radical: '心 (Tâm)', strokesCount: 4, mnemonic: 'Ba giọt máu bao quanh vầng trăng khuyết của trái tim.', tip: 'Nét cong móc nằm ngang mềm mại, 3 giọt chấm phân bố đều đặn.' },
  '生': { pinyin: 'shēng', hanviet: 'Sinh', meaning: 'Sinh sống, sinh ra', radical: '生 (Sinh)', strokesCount: 5, mnemonic: 'Cây cỏ đâm chồi nảy lộc từ mặt đất vươn lên mầm sống.', tip: '3 nét ngang song song, nét ngang đáy dài nhất đỡ toàn chữ.' },
  '道': { pinyin: 'dào', hanviet: 'Đạo', meaning: 'Con đường, đạo lý', radical: '辶 (Sước)', strokesCount: 12, mnemonic: 'Cái đầu (首) dẫn đường cho bước chân bước đi (辶).', tip: 'Viết phần chữ thủ 首 trước, sau đó viết bộ quai sước 辶 ôm trọn bên dưới.' },
  '语': { pinyin: 'yǔ', hanviet: 'Ngữ', meaning: 'Ngôn ngữ, lời nói', radical: '讠(Ngôn)', strokesCount: 9, mnemonic: 'Lời nói (讠) của chính bản thân tôi (吾 = ngũ + khẩu).', tip: 'Bộ ngôn thon gọn, các nét ngang bên phải xếp tầng khoảng cách đều.' }
};

const BRUSH_SIZES = [
  { id: 'thin', label: 'Mảnh', size: 8 },
  { id: 'medium', label: 'Vừa', size: 14 },
  { id: 'thick', label: 'Bút lông', size: 22 }
];

const BRUSH_COLORS = [
  { id: 'black', label: 'Mực đen', color: '#243447', bg: 'bg-[#243447]' },
  { id: 'vermilion', label: 'Chu sa', color: '#E85D3F', bg: 'bg-[#E85D3F]' },
  { id: 'blue', label: 'Mực lam', color: '#2563EB', bg: 'bg-[#2563EB]' }
];

export default function WritingPage({ targetVocab, onClearTargetVocab }) {
  // Stored custom characters
  const [customChars, setCustomChars] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_CHARS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // DB writing characters loaded from Supabase
  const [dbChars, setDbChars] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getWritingCharactersFromDb().then(chars => {
      if (isMounted && chars && chars.length > 0) {
        setDbChars(chars);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Combined base characters (static + DB + custom)
  const baseCharacters = useMemo(() => {
    const map = new Map();
    CHARACTERS_WRITING.forEach(c => map.set(c.char, c));
    dbChars.forEach(c => map.set(c.char, c));
    customChars.forEach(c => map.set(c.char, c));
    return Array.from(map.values());
  }, [dbChars, customChars]);

  // Extract individual characters if a vocabulary word is being practiced
  const targetWordChars = useMemo(() => {
    if (!targetVocab || !targetVocab.hanzi) return [];
    const hanziStr = String(targetVocab.hanzi);
    const chars = Array.from(hanziStr).filter(ch => /\p{Script=Han}/u.test(ch));
    const validChars = chars.length > 0 ? chars : Array.from(hanziStr.trim());
    const pinyinParts = (targetVocab.pinyin || '').trim().split(/\s+/);

    return validChars.map((ch, idx) => {
      const existing = baseCharacters.find(b => b.char === ch);
      if (existing) {
        return {
          ...existing,
          parentVocab: targetVocab,
          isTargetChar: true
        };
      }
      const pop = POPULAR_CHARS_DICT[ch];
      if (pop) {
        return {
          char: ch,
          pinyin: pop.pinyin,
          hanviet: pop.hanviet,
          meaning: pop.meaning,
          radical: pop.radical,
          strokesCount: pop.strokesCount || 6,
          strokeOrder: ['Nét phẩy (丿)', 'Nét ngang (一)', 'Nét sổ (丨)', 'Nét mác (乀)'],
          components: pop.radical,
          mnemonic: pop.mnemonic,
          tip: pop.tip,
          parentVocab: targetVocab,
          isTargetChar: true
        };
      }
      return {
        char: ch,
        pinyin: pinyinParts[idx] || targetVocab.pinyin || '',
        hanviet: targetVocab.hanviet || '',
        meaning: targetVocab.meaning,
        strokesCount: Number(targetVocab.strokes) || 6,
        radical: targetVocab.radical || 'Bộ thủ',
        strokeOrder: ['Nét phẩy (丿)', 'Nét ngang (一)', 'Nét sổ (丨)', 'Nét mác (乀)'],
        components: `Chữ trong từ vựng "${targetVocab.hanzi}"`,
        mnemonic: targetVocab.mnemonic || `Chữ "${ch}" trong từ "${targetVocab.hanzi}" (${targetVocab.meaning}).`,
        tip: 'Viết cân xứng quanh tâm mễ tự, giữ nét bút dứt khoát.',
        parentVocab: targetVocab,
        isTargetChar: true
      };
    });
  }, [targetVocab, baseCharacters]);

  // All characters combined (active word characters at front)
  const allCharacters = useMemo(() => {
    if (targetWordChars.length === 0) return baseCharacters;
    const targetSet = new Set(targetWordChars.map(t => t.char));
    const rest = baseCharacters.filter(b => !targetSet.has(b.char));
    return [...targetWordChars, ...rest];
  }, [targetWordChars, baseCharacters]);

  const [selectedCharIndex, setSelectedCharIndex] = useState(0);

  // When targetVocab changes, automatically select the first character of this word
  useEffect(() => {
    if (targetVocab) {
      setSelectedCharIndex(0);
    }
  }, [targetVocab]);
  const [showGuide, setShowGuide] = useState(true);
  const [gridMode, setGridMode] = useState('mizige'); // 'mizige' or 'tianzige'
  const [brushSize, setBrushSize] = useState(14);
  const [brushColor, setBrushColor] = useState('#243447');

  const [isAnimatingStroke, setIsAnimatingStroke] = useState(false);
  const [animatedStrokeIndex, setAnimatedStrokeIndex] = useState(-1);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [strokeCount, setStrokeCount] = useState(0);

  // Stored best scores per character
  const [savedScores, setSavedScores] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_writing_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal to add custom character
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCharForm, setNewCharForm] = useState({
    char: '',
    pinyin: '',
    hanviet: '',
    meaning: '',
    radical: '',
    mnemonic: ''
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const currentChar = allCharacters[selectedCharIndex] || allCharacters[0] || CHARACTERS_WRITING[0];

  // HTML5 Canvas state & Undo history
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Clear Canvas helper
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setHasDrawn(false);
    setStrokeCount(0);
    setEvaluationResult(null);
  }, []);

  // Initialize Canvas on character switch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;

    clearCanvas();
  }, [selectedCharIndex, clearCanvas]);

  // Drawing routines
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Save history snapshot for Undo
    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(snapshot);
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
      }
    } catch (err) {
      console.warn('Canvas snapshot error:', err);
    }

    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setStrokeCount(prev => prev + 1);
    }
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Undo last stroke
  const handleUndo = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;

    const ctx = canvas.getContext('2d');
    const previousState = historyRef.current.pop();
    ctx.putImageData(previousState, 0, 0);

    setStrokeCount(prev => Math.max(0, prev - 1));

    if (historyRef.current.length === 0) {
      setHasDrawn(false);
      setEvaluationResult(null);
    }
    showToast('Đã quay lại nét trước');
  };

  // Export handwriting as PNG image
  const handleExportImage = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');

    // Draw background white
    tCtx.fillStyle = '#FFFFFF';
    tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw grid cross
    tCtx.strokeStyle = '#F1E5D8';
    tCtx.lineWidth = 1;
    tCtx.strokeRect(0, 0, tempCanvas.width, tempCanvas.height);
    tCtx.beginPath();
    tCtx.setLineDash([4, 4]);
    tCtx.moveTo(0, tempCanvas.height / 2);
    tCtx.lineTo(tempCanvas.width, tempCanvas.height / 2);
    tCtx.moveTo(tempCanvas.width / 2, 0);
    tCtx.lineTo(tempCanvas.width / 2, tempCanvas.height);
    tCtx.stroke();
    tCtx.setLineDash([]);

    // Draw user writing
    tCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `hanzigo-luyen-viet-${currentChar.char}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
    showToast('Đã tải hình ảnh bài viết về máy!');
  };

  // Play animated stroke order demonstration
  const handlePlayStrokeAnimation = () => {
    playClickSound();
    setIsAnimatingStroke(true);
    setAnimatedStrokeIndex(-1);

    const totalStrokes = (currentChar.strokeOrder && currentChar.strokeOrder.length > 0)
      ? currentChar.strokeOrder.length
      : (currentChar.strokesCount || 4);

    let step = 0;
    const interval = setInterval(() => {
      setAnimatedStrokeIndex(step);
      step++;
      if (step >= totalStrokes) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimatingStroke(false);
          setAnimatedStrokeIndex(-1);
        }, 1000);
      }
    }, 700);
  };

  // Evaluate drawing accuracy, balance and stroke count
  const handleEvaluate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const userImgData = ctx.getImageData(0, 0, width, height);
    const userPixels = userImgData.data;

    // 1. Analyze User Ink Pixels
    let userInkCount = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = userPixels[idx + 3];
        if (alpha > 30) {
          userInkCount++;
          sumX += x;
          sumY += y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (userInkCount < 200) {
      showToast('⚠️ Nét chữ còn quá ít hoặc mờ! Hãy hoàn thành chữ trước khi chấm điểm nhé.');
      return;
    }

    // 2. Render Reference Character Offscreen for Comparison
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    offCtx.fillStyle = '#000000';
    offCtx.font = "bold 210px 'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', serif";
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(currentChar.char, width / 2, height / 2 - 8);

    const refImgData = offCtx.getImageData(0, 0, width, height);
    const refPixels = refImgData.data;

    let refInkCount = 0;
    let refSumX = 0;
    let refSumY = 0;

    const refOccupied = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (refPixels[idx + 3] > 30) {
          refInkCount++;
          refSumX += x;
          refSumY += y;
          refOccupied[y * width + x] = 1;
        }
      }
    }

    if (refInkCount === 0) refInkCount = userInkCount;

    // 3. Centroid & Balance Analysis
    const userCenterX = sumX / userInkCount;
    const userCenterY = sumY / userInkCount;
    const refCenterX = refSumX / refInkCount;
    const refCenterY = refSumY / refInkCount;

    const deltaX = userCenterX - refCenterX;
    const deltaY = userCenterY - refCenterY;
    const centerDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Balance score: 100 if centerDist <= 12px, decreases gradually
    let balanceScore = Math.max(50, Math.round(100 - (centerDist / 70) * 50));
    if (balanceScore > 100) balanceScore = 100;

    // 4. Shape & Form Accuracy (with tolerance padding for brush width)
    const R = Math.max(10, Math.round(brushSize * 0.8));
    const dilatedRef = new Uint8Array(width * height);

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        if (refOccupied[y * width + x]) {
          const yStart = Math.max(0, y - R);
          const yEnd = Math.min(height - 1, y + R);
          const xStart = Math.max(0, x - R);
          const xEnd = Math.min(width - 1, x + R);
          for (let dy = yStart; dy <= yEnd; dy += 2) {
            for (let dx = xStart; dx <= xEnd; dx += 2) {
              dilatedRef[dy * width + dx] = 1;
            }
          }
        }
      }
    }

    let userInTolerance = 0;
    let sampleCount = 0;
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const idx = (y * width + x) * 4;
        if (userPixels[idx + 3] > 30) {
          sampleCount++;
          if (dilatedRef[y * width + x]) {
            userInTolerance++;
          }
        }
      }
    }

    const accuracyRatio = sampleCount > 0 ? (userInTolerance / sampleCount) : 0;
    const massRatio = Math.min(userInkCount / (refInkCount * 0.65), (refInkCount * 1.6) / userInkCount);
    const clampedMass = Math.min(1, Math.max(0.4, massRatio));

    let shapeScore = Math.round(accuracyRatio * 75 + clampedMass * 25);
    shapeScore = Math.max(52, Math.min(100, shapeScore));

    // 5. Stroke Count Analysis
    const expectedStrokes = (currentChar.strokeOrder && currentChar.strokeOrder.length > 0)
      ? currentChar.strokeOrder.length
      : (currentChar.strokesCount || 4);

    const actualStrokes = strokeCount > 0 ? strokeCount : 1;
    const strokeDiff = Math.abs(actualStrokes - expectedStrokes);

    let strokeScore = 100;
    if (strokeDiff === 0) {
      strokeScore = 100;
    } else if (strokeDiff === 1) {
      strokeScore = 92;
    } else if (strokeDiff === 2) {
      strokeScore = 80;
    } else if (strokeDiff === 3) {
      strokeScore = 68;
    } else {
      strokeScore = Math.max(45, 100 - strokeDiff * 12);
    }

    // 6. Overall Weighted Score
    const totalScore = Math.round(shapeScore * 0.45 + balanceScore * 0.35 + strokeScore * 0.20);

    // 7. Granular constructive feedback
    let rank = 'Xuất sắc';
    let rankBadge = 'Xuất sắc 🌟';
    let baseComment = '';
    const tips = [];

    if (totalScore >= 90) {
      rank = 'Xuất sắc';
      rankBadge = 'Xuất sắc 🌟';
      baseComment = 'Tuyệt vời! Nét bút dứt khoát, hình thái chữ chuẩn mực và trọng tâm đặt đúng tâm mễ tự cách!';
    } else if (totalScore >= 78) {
      rank = 'Rất tốt';
      rankBadge = 'Rất tốt 👏';
      baseComment = 'Rất tốt! Chữ viết thanh thoát, nét chữ ngay ngắn và phân bổ đường nét hài hòa.';
    } else if (totalScore >= 65) {
      rank = 'Đạt yêu cầu';
      rankBadge = 'Đạt yêu cầu 👍';
      baseComment = 'Hình dáng chữ cơ bản đúng nhận diện. Hãy kiểm soát cọ đều tay hơn ở các nét chuyển hướng.';
    } else {
      rank = 'Cần luyện thêm';
      rankBadge = 'Cần luyện thêm ✍️';
      baseComment = 'Nét chữ cần được rèn luyện thêm. Hãy bật chế độ "Hiện nét mẫu" và quan sát thứ tự nét để viết chuẩn hơn nhé!';
    }

    // Specific constructive tips
    if (strokeDiff === 0) {
      tips.push(`Số nét viết chính xác hoàn hảo (${actualStrokes}/${expectedStrokes} nét).`);
    } else if (actualStrokes < expectedStrokes) {
      tips.push(`Bạn đã viết ${actualStrokes} nét (chuẩn ${expectedStrokes} nét). Có thể một số nét rời đã bị viết liền.`);
    } else {
      tips.push(`Bạn đã viết ${actualStrokes} nét (chuẩn ${expectedStrokes} nét). Hãy chú ý viết liền mạch các nét gập móc.`);
    }

    if (centerDist > 22) {
      const dirX = deltaX > 8 ? 'sang phải' : (deltaX < -8 ? 'sang trái' : '');
      const dirY = deltaY > 8 ? 'xuống dưới' : (deltaY < -8 ? 'lên trên' : '');
      const direction = [dirX, dirY].filter(Boolean).join(' và ');
      if (direction) {
        tips.push(`Trọng tâm chữ hơi lệch ${direction}, nên căn đều vào đường trục chữ thập của ô.`);
      }
    } else {
      tips.push('Trọng tâm chữ rất cân xứng trong tâm ô Mễ tự.');
    }

    if (accuracyRatio >= 0.85) {
      tips.push('Đường nét đi sát khuôn chữ mẫu, bút lực ổn định.');
    } else if (accuracyRatio < 0.65) {
      tips.push('Một số nét hơi vươn ra ngoài khuôn khổ, hãy chú ý tỷ lệ dài ngắn của nét.');
    }

    // XP calculation
    let xpEarned = 10;
    if (totalScore >= 90) xpEarned = 25;
    else if (totalScore >= 78) xpEarned = 18;
    else if (totalScore >= 65) xpEarned = 12;
    else xpEarned = 6;

    // Confetti effect on high score
    if (totalScore >= 75) {
      try {
        confetti({
          particleCount: totalScore >= 90 ? 75 : 40,
          spread: 65,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }

    playSuccessSound();
    awardXp(xpEarned);

    const newResult = {
      score: totalScore,
      shapeScore,
      balanceScore,
      strokeScore,
      actualStrokes,
      expectedStrokes,
      rank,
      rankBadge,
      comment: baseComment,
      tips,
      xpEarned
    };

    setEvaluationResult(newResult);

    // Save best score to state and localStorage
    setSavedScores(prev => {
      const prevBest = prev[currentChar.char] || 0;
      const updated = {
        ...prev,
        [currentChar.char]: Math.max(prevBest, totalScore)
      };
      try {
        localStorage.setItem('hanzigo_writing_scores', JSON.stringify(updated));
      } catch (e) {
        console.warn('Writing scores storage error:', e);
      }
      return updated;
    });

    triggerCloudSync();
    showToast(`Đã hoàn thành chấm điểm: ${totalScore}/100 (+${xpEarned} XP)`);
  };

  // Handle auto-fill when user types or picks a character in Add Modal
  const handleCharInput = (c) => {
    const trimmed = (c || '').trim();
    if (!trimmed) {
      setNewCharForm({ char: '', pinyin: '', hanviet: '', meaning: '', radical: '', mnemonic: '' });
      return;
    }

    const firstChar = trimmed.charAt(0);
    const foundPopular = POPULAR_CHARS_DICT[firstChar];
    const foundInVocab = VOCABULARY_LIST.find(v => v.hanzi.includes(firstChar));

    if (foundPopular) {
      setNewCharForm({
        char: firstChar,
        pinyin: foundPopular.pinyin,
        hanviet: foundPopular.hanviet,
        meaning: foundPopular.meaning,
        radical: foundPopular.radical,
        mnemonic: foundPopular.mnemonic
      });
    } else if (foundInVocab) {
      setNewCharForm({
        char: firstChar,
        pinyin: foundInVocab.pinyin,
        hanviet: foundInVocab.hanviet,
        meaning: foundInVocab.meaning,
        radical: foundInVocab.radical,
        mnemonic: foundInVocab.mnemonic
      });
    } else {
      setNewCharForm(prev => ({
        ...prev,
        char: firstChar
      }));
    }
  };

  // Save new custom character
  const handleSaveCustomChar = (e) => {
    e.preventDefault();
    if (!newCharForm.char) {
      alert('Vui lòng nhập chữ Hán bạn muốn luyện viết!');
      return;
    }

    playSuccessSound();
    const newEntry = {
      char: newCharForm.char,
      pinyin: newCharForm.pinyin || 'chá',
      hanviet: newCharForm.hanviet || 'Hán',
      meaning: newCharForm.meaning || 'Chữ Hán tự chọn',
      strokesCount: newCharForm.char.length > 0 ? (newCharForm.char.charCodeAt(0) % 8 + 3) : 6,
      radical: newCharForm.radical || 'Bộ thủ tùy chọn',
      strokeOrder: ['Nét phẩy (丿)', 'Nét ngang (一)', 'Nét sổ (丨)', 'Nét mác (乀)'],
      components: 'Chữ Hán tự chọn của bạn trong quá trình học tập.',
      mnemonic: newCharForm.mnemonic || 'Tập trung quan sát các bộ phận hợp thành để nhớ mặt chữ lâu hơn.',
      tip: 'Giữ nét viết cân xứng quanh tâm chữ thập, thả lỏng cổ tay khi đưa nét.',
      isCustom: true
    };

    const updated = [newEntry, ...customChars];
    setCustomChars(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_CHARS, JSON.stringify(updated));
      triggerCloudSync();
      awardXp(15);
    } catch (err) {
      console.error(err);
    }

    setIsAddModalOpen(false);
    setSelectedCharIndex(CHARACTERS_WRITING.length); // point to new custom char
    setNewCharForm({ char: '', pinyin: '', hanviet: '', meaning: '', radical: '', mnemonic: '' });
    showToast(`Đã thêm chữ "${newEntry.char}" vào danh sách luyện viết! (+15 XP)`);
  };

  // Delete custom character
  const handleDeleteCustomChar = (charToDelete) => {
    if (window.confirm(`Bạn có chắc muốn xóa chữ "${charToDelete}" khỏi danh sách luyện viết?`)) {
      playClickSound();
      const updated = customChars.filter(c => c.char !== charToDelete);
      setCustomChars(updated);
      try {
        localStorage.setItem(STORAGE_CUSTOM_CHARS, JSON.stringify(updated));
        triggerCloudSync();
      } catch (err) {
        console.error(err);
      }
      setSelectedCharIndex(0);
      showToast(`Đã xóa chữ "${charToDelete}"!`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
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
            Thuận bút & Mễ tự cách
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
            Luyện Viết Chữ Hán Theo Thứ Tự Nét
          </h1>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
            Luyện viết thư pháp chuẩn quốc tế. Tùy chọn thêm bất kỳ chữ Hán nào bạn muốn rèn luyện.
          </p>
        </div>

        {/* Action: Add custom character button */}
        <button
          onClick={() => {
            playClickSound();
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <Plus size={16} />
          <span>Thêm chữ muốn luyện viết</span>
        </button>
      </div>

      {/* Target Vocabulary Highlight Banner */}
      {targetVocab && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-orange-950/20 border-2 border-orange-400/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-orange-500/30 shrink-0">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-200 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200">
                  Từ vựng đang luyện viết
                </span>
                <span className="text-xl sm:text-2xl font-black font-['Noto_Serif_SC'] text-[#243447] dark:text-white">
                  {targetVocab.hanzi}
                </span>
                <span className="text-sm font-bold text-[#E85D3F]">
                  ({targetVocab.pinyin})
                </span>
              </div>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                Nghĩa: <strong className="text-emerald-600 dark:text-emerald-400">{targetVocab.meaning}</strong>
                {targetVocab.hanviet && ` • Âm Hán-Việt: ${targetVocab.hanviet}`}
                {targetVocab.level && ` • Cấp độ: ${targetVocab.level}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {targetWordChars.length > 1 && (
              <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] p-1 rounded-2xl border border-orange-300 dark:border-orange-800 shadow-sm">
                <span className="text-[11px] font-bold text-[#748092] px-2">Chọn chữ viết:</span>
                {targetWordChars.map((tc, tcIdx) => {
                  const isCurrent = currentChar.char === tc.char;
                  return (
                    <button
                      key={tcIdx}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedCharIndex(tcIdx);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-['Noto_Serif_SC'] text-base font-black transition-all ${
                        isCurrent
                          ? 'bg-[#E85D3F] text-white shadow-sm scale-105'
                          : 'text-[#243447] dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900/40'
                      }`}
                    >
                      {tc.char}
                    </button>
                  );
                })}
              </div>
            )}
            {onClearTargetVocab && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClearTargetVocab();
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#748092] hover:text-[#E85D3F] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] transition-colors"
                title="Quay lại danh sách luyện viết chung"
              >
                ✕ Xem tất cả chữ
              </button>
            )}
          </div>
        </div>
      )}

      {/* Character Selector Pills with Add Badge & Saved Score */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1">
        {allCharacters.map((c, idx) => {
          const charScore = savedScores[c.char];
          return (
            <button
              key={`${c.char}-${idx}`}
              onClick={() => {
                playClickSound();
                setSelectedCharIndex(idx);
              }}
              className={`relative w-12 h-12 shrink-0 rounded-2xl font-['Noto_Serif_SC'] text-2xl font-bold transition-all flex items-center justify-center ${
                selectedCharIndex === idx
                  ? 'bg-[#E85D3F] text-white shadow-lg shadow-[#E85D3F]/30 scale-105'
                  : 'bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]'
              }`}
            >
              <span>{c.char}</span>
              {c.isTargetChar && (
                <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white dark:border-[#1E293B]" title="Chữ từ vựng bạn đã chọn" />
              )}
              {charScore !== undefined && (
                <span
                  className={`absolute -bottom-1 -right-1 text-[9px] font-black px-1 rounded-md text-white shadow-xs ${
                    charScore >= 80 ? 'bg-emerald-500' : charScore >= 65 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  title={`Điểm cao nhất: ${charScore}/100`}
                >
                  {charScore}
                </span>
              )}
              {c.isCustom && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#45B97C] border-2 border-white dark:border-[#1E293B]" title="Chữ do bạn thêm" />
              )}
            </button>
          );
        })}

        <button
          onClick={() => {
            playClickSound();
            setIsAddModalOpen(true);
          }}
          className="w-12 h-12 shrink-0 rounded-2xl border-2 border-dashed border-[#E85D3F]/50 text-[#E85D3F] hover:bg-[#FDEEEB] dark:hover:bg-[#2D1E1B] flex items-center justify-center transition-colors"
          title="Thêm chữ Hán mới"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Main Practice Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Canvas Pad (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl space-y-6">
          
          {/* Pad Top Bar: Meta & Display Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E85D3F] px-2.5 py-1 rounded-lg bg-[#FDEEEB] dark:bg-[#2D1E1B]">
                {currentChar.strokesCount} nét chuẩn
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                strokeCount === (currentChar.strokesCount || 4)
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-[#FFF9F2] dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}>
                Đã viết: {strokeCount} nét
              </span>
              <span className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
                Bộ {currentChar.radical}
              </span>
              {currentChar.isCustom && (
                <button
                  onClick={() => handleDeleteCustomChar(currentChar.char)}
                  className="text-xs text-red-500 hover:underline ml-1"
                >
                  (Xóa chữ này)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(!showGuide)}
                title="Bật/tắt nét mờ hướng dẫn"
                className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#748092] hover:text-[#243447] dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {showGuide ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showGuide ? 'Ẩn nét mẫu' : 'Hiện nét mẫu'}</span>
              </button>

              <button
                onClick={handlePlayStrokeAnimation}
                disabled={isAnimatingStroke}
                className="px-3 py-1.5 rounded-xl bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] text-xs font-bold hover:bg-[#FDEED3] flex items-center gap-1.5 transition-colors"
              >
                <Play size={14} className={isAnimatingStroke ? 'animate-spin' : ''} />
                <span>Xem thứ tự nét</span>
              </button>
            </div>
          </div>

          {/* Canvas Box with Tianzige / Mizige Grid */}
          <div className={`relative mx-auto w-[320px] h-[320px] rounded-2xl border-2 border-[#E85D3F]/60 overflow-hidden shadow-inner tianzige-grid ${gridMode === 'mizige' ? 'tianzige-cross' : ''}`}>
            
            {/* Background character watermark guide */}
            {showGuide && (
              <div className="absolute inset-0 flex items-center justify-center font-['Noto_Serif_SC'] text-[210px] font-bold text-gray-200 dark:text-gray-700/40 select-none pointer-events-none leading-none -translate-y-2">
                {currentChar.char}
              </div>
            )}

            {/* Canvas layer for actual brush drawing */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="absolute inset-0 cursor-crosshair touch-none"
            />
          </div>

          {/* Brush Controls Bar: Size, Color, Grid Mode */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
            {/* Brush sizes */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#748092]">Cọ:</span>
              {BRUSH_SIZES.map(b => (
                <button
                  key={b.id}
                  onClick={() => setBrushSize(b.size)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    brushSize === b.size
                      ? 'bg-[#E85D3F] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1E293B] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Brush colors */}
            <div className="flex items-center gap-1.5">
              <Palette size={13} className="text-[#748092]" />
              {BRUSH_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setBrushColor(c.color)}
                  className={`w-5 h-5 rounded-full ${c.bg} transition-transform ${
                    brushColor === c.color ? 'scale-125 ring-2 ring-offset-1 ring-[#E85D3F]' : ''
                  }`}
                  title={c.label}
                />
              ))}
            </div>

            {/* Grid selector */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setGridMode(gridMode === 'mizige' ? 'tianzige' : 'mizige')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] font-bold text-[11px] text-[#748092] hover:text-[#243447] dark:hover:text-white"
              >
                {gridMode === 'mizige' ? 'Ô: Mễ (※)' : 'Ô: Điền (+)'}
              </button>
            </div>
          </div>

          {/* Canvas Tools Toolbar: Undo, Clear, Save, Evaluate */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={!hasDrawn}
                title="Quay lại nét vẽ trước"
                className="px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#748092] hover:text-[#243447] dark:hover:text-white disabled:opacity-40 flex items-center gap-1.5 transition-colors"
              >
                <Undo2 size={14} />
                <span>Quay lại</span>
              </button>

              <button
                onClick={clearCanvas}
                className="px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#748092] hover:text-red-500 hover:border-red-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                <span>Xóa hết</span>
              </button>

              <button
                onClick={handleExportImage}
                disabled={!hasDrawn}
                title="Lưu ảnh nét chữ về máy"
                className="px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#748092] hover:text-[#243447] dark:hover:text-white disabled:opacity-40 flex items-center gap-1.5 transition-colors"
              >
                <Download size={14} />
                <span>Tải ảnh</span>
              </button>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={!hasDrawn}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-[#E85D3F]/30 hover:scale-102 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>Chấm điểm nét viết</span>
            </button>
          </div>

          {/* AI Score Feedback Box */}
          {evaluationResult && (
            <div className={`p-5 rounded-3xl border transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 shadow-sm ${
              evaluationResult.score >= 90
                ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/40 dark:from-emerald-950/40 dark:to-[#1E293B] border-emerald-300 dark:border-emerald-800'
                : evaluationResult.score >= 78
                ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/40 dark:from-blue-950/40 dark:to-[#1E293B] border-blue-300 dark:border-blue-800'
                : evaluationResult.score >= 65
                ? 'bg-gradient-to-br from-amber-50/80 to-yellow-50/40 dark:from-amber-950/40 dark:to-[#1E293B] border-amber-300 dark:border-amber-800'
                : 'bg-gradient-to-br from-orange-50/80 to-rose-50/40 dark:from-orange-950/40 dark:to-[#1E293B] border-orange-300 dark:border-orange-800'
            }`}>
              {/* Header: Rank + Big Score + XP */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                      evaluationResult.score >= 90
                        ? 'bg-emerald-500 text-white'
                        : evaluationResult.score >= 78
                        ? 'bg-blue-500 text-white'
                        : evaluationResult.score >= 65
                        ? 'bg-amber-500 text-white'
                        : 'bg-orange-500 text-white'
                    }`}>
                      <Award size={14} />
                      <span>{evaluationResult.rankBadge}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-800">
                      <Sparkles size={12} />
                      +{evaluationResult.xpEarned} XP
                    </span>
                  </div>
                  <p className="text-xs text-[#243447] dark:text-[#E2E8F0] font-medium leading-relaxed">
                    {evaluationResult.comment}
                  </p>
                </div>

                <div className="shrink-0 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-md ${
                    evaluationResult.score >= 90
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : evaluationResult.score >= 78
                      ? 'bg-blue-500 text-white shadow-blue-500/30'
                      : evaluationResult.score >= 65
                      ? 'bg-amber-500 text-white shadow-amber-500/30'
                      : 'bg-orange-500 text-white shadow-orange-500/30'
                  }`}>
                    <span className="text-2xl leading-none">{evaluationResult.score}</span>
                    <span className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Điểm</span>
                  </div>
                </div>
              </div>

              {/* Rubric Breakdown Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-black/5 dark:border-white/10">
                {/* 1. Shape */}
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-black/5 dark:border-white/5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-[#243447] dark:text-[#E2E8F0]">
                      <Target size={13} className="text-[#E85D3F]" />
                      <span>Hình thể nét</span>
                    </span>
                    <span className="text-[#E85D3F] font-black">{evaluationResult.shapeScore}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div 
                      className="h-full bg-[#E85D3F] rounded-full transition-all duration-500" 
                      style={{ width: `${evaluationResult.shapeScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] block">Độ khớp khuôn mẫu</span>
                </div>

                {/* 2. Balance */}
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-black/5 dark:border-white/5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-[#243447] dark:text-[#E2E8F0]">
                      <Scale size={13} className="text-blue-500" />
                      <span>Trọng tâm ô</span>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">{evaluationResult.balanceScore}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${evaluationResult.balanceScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] block">Tâm mễ tự cách</span>
                </div>

                {/* 3. Strokes */}
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-black/5 dark:border-white/5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-[#243447] dark:text-[#E2E8F0]">
                      <PenTool size={13} className="text-emerald-500" />
                      <span>Số nét bút</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{evaluationResult.strokeScore}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${evaluationResult.strokeScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] block">
                    {evaluationResult.actualStrokes}/{evaluationResult.expectedStrokes} nét viết
                  </span>
                </div>
              </div>

              {/* Specific Constructive Tips */}
              {evaluationResult.tips && evaluationResult.tips.length > 0 && (
                <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/20 border border-black/5 dark:border-white/5 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] flex items-center gap-1.5">
                    <Info size={12} />
                    <span>Chi tiết nhận xét & gợi ý rèn nét:</span>
                  </span>
                  <ul className="text-xs text-[#243447] dark:text-[#CBD5E1] space-y-1 list-disc list-inside">
                    {evaluationResult.tips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-black/10 dark:border-white/10 text-xs font-bold text-[#243447] dark:text-white hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Viết lại chữ này</span>
                </button>

                {selectedCharIndex < allCharacters.length - 1 && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedCharIndex(prev => prev + 1);
                      clearCanvas();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Luyện chữ tiếp theo</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right: Stroke Order Breakdown & Mnemonics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Character Identity Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div>
                <span className="text-xs text-[#748092] dark:text-[#94A3B8]">Chữ Hán mẫu:</span>
                <div className="flex items-center gap-3">
                  <span className="font-['Noto_Serif_SC'] text-4xl font-bold text-[#243447] dark:text-white">
                    {currentChar.char}
                  </span>
                  <span className="text-lg font-bold text-[#E85D3F]">
                    {currentChar.pinyin}
                  </span>
                </div>
              </div>
              <AudioButton text={currentChar.char} size="md" />
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#243447] dark:text-white">
                <span className="text-[#748092]">Âm Hán-Việt:</span> <strong className="text-base">{currentChar.hanviet}</strong>
              </p>
              <p className="text-[#243447] dark:text-white">
                <span className="text-[#748092]">Nghĩa:</span> <strong className="text-[#45B97C]">{currentChar.meaning}</strong>
              </p>
              <p className="text-[#243447] dark:text-white">
                <span className="text-[#748092]">Bộ thủ & cấu tạo:</span> {currentChar.components || currentChar.radical}
              </p>
            </div>
          </div>

          {/* Stroke by Stroke Order List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E85D3F]">
              Thứ tự các nét bút thuận ({currentChar.strokeOrder ? currentChar.strokeOrder.length : (currentChar.strokesCount || 4)} nét)
            </h3>
            
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {(currentChar.strokeOrder || ['Nét 1', 'Nét 2', 'Nét 3', 'Nét 4']).map((st, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    animatedStrokeIndex === idx 
                      ? 'bg-[#E85D3F] text-white font-bold border-[#E85D3F] scale-102' 
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>Nét thứ {idx + 1}: {st}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mnemonics & Writing Tip */}
          <div className="p-6 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#F4B942] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Mẹo ghi nhớ chiết tự</span>
              </span>
              <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                {currentChar.mnemonic || 'Quan sát vị trí từng nét trên mễ tự cách để giữ cho chữ Hán luôn ngay ngắn.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
              <span className="text-[11px] font-bold text-[#748092]">Gợi ý canh ô:</span>
              <p className="text-xs text-[#243447] dark:text-[#CBD5E1]">
                {currentChar.tip || 'Thả lỏng cổ tay, điều chỉnh khoảng cách nét đều nhau quanh tâm chữ thập.'}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Thêm chữ Hán muốn luyện viết */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-[#E85D3F]" />
                <span>Thêm chữ Hán muốn luyện viết</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick chips suggestion */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#748092] block">
                Gợi ý chữ phổ biến (Bấm để chọn nhanh):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['家', '茶', '水', '人', '天', '国', '车', '钱', '心', '生', '道', '语'].map(qChar => (
                  <button
                    key={qChar}
                    type="button"
                    onClick={() => handleCharInput(qChar)}
                    className="w-8 h-8 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] font-['Noto_Serif_SC'] font-bold text-sm text-[#243447] dark:text-white transition-colors"
                  >
                    {qChar}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveCustomChar} className="space-y-3.5">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-8">
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Nhập chữ Hán *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={1}
                    placeholder="Ví dụ: 家"
                    value={newCharForm.char}
                    onChange={(e) => handleCharInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xl font-['Noto_Serif_SC'] font-bold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                {/* Preview Box */}
                <div className="col-span-4 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#748092] mb-1 font-semibold">Xem trước ô:</span>
                  <div className="w-14 h-14 rounded-xl border border-[#E85D3F]/60 tianzige-grid tianzige-cross flex items-center justify-center font-['Noto_Serif_SC'] text-2xl font-bold text-[#243447] shadow-inner">
                    {newCharForm.char || '字'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Phiên âm Pinyin
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: jiā"
                    value={newCharForm.pinyin}
                    onChange={(e) => setNewCharForm({ ...newCharForm, pinyin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Âm Hán-Việt
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Gia"
                    value={newCharForm.hanviet}
                    onChange={(e) => setNewCharForm({ ...newCharForm, hanviet: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Ý nghĩa tiếng Việt
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nhà, gia đình"
                    value={newCharForm.meaning}
                    onChange={(e) => setNewCharForm({ ...newCharForm, meaning: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Bộ thủ
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 宀 (Miên)"
                    value={newCharForm.radical}
                    onChange={(e) => setNewCharForm({ ...newCharForm, radical: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                  Mẹo ghi nhớ chiết tự (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Dưới mái nhà có con heo là gia đình sung túc"
                  value={newCharForm.mnemonic}
                  onChange={(e) => setNewCharForm({ ...newCharForm, mnemonic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Lưu & Luyện viết ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
