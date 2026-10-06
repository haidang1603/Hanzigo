import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  Undo2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Volume2, 
  Sparkles,
  CheckCircle2,
  PenTool
} from 'lucide-react';
import { speakChinese, playClickSound } from '../../utils/audio';
import { HANZI_BOARD_DICTIONARY } from '../../services/liveClassroomService';

export default function HanziStrokeOrderBoard({
  isTeacher = false,
  strokeState = {},
  onUpdateState
}) {
  const selectedChar = strokeState?.char || '你';
  const charDetails = HANZI_BOARD_DICTIONARY[selectedChar] || {
    char: selectedChar,
    pinyin: 'nǐ',
    strokesCount: 7,
    strokeOrder: ['1. Nét phẩy (丿)', '2. Nét sổ (丨)', '3. Nét phẩy ngắn (丿)', '4. Nét ngang móc (乛)', '5. Nét sổ móc (亅)', '6. Nét phẩy (丿)', '7. Nét chấm (丶)']
  };

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedStrokeIndex, setAnimatedStrokeIndex] = useState(-1);
  const [showWatermarkGuide, setShowWatermarkGuide] = useState(true);

  // Student Writing Canvas state
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  // Quick characters selector
  const POPULAR_CHARS = ['你', '好', '我', '学', '习', '中', '文', '喜', '欢'];

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setHasDrawn(false);
    setStrokeCount(0);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 320;
    clearCanvas();
  }, [selectedChar, clearCanvas]);

  // Stroke Order Animation simulation
  const handlePlayAnimation = () => {
    playClickSound();
    setIsAnimating(true);
    setAnimatedStrokeIndex(-1);

    const totalStrokes = charDetails.strokeOrder?.length || charDetails.strokesCount || 7;
    let step = 0;
    const interval = setInterval(() => {
      setAnimatedStrokeIndex(step);
      step++;
      if (step >= totalStrokes) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimating(false);
          setAnimatedStrokeIndex(-1);
        }, 1200);
      }
    }, 650);
  };

  // Canvas drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(snapshot);
      if (historyRef.current.length > 30) historyRef.current.shift();
    } catch {}

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

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#F4B942';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleUndo = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    const prevState = historyRef.current.pop();
    ctx.putImageData(prevState, 0, 0);
    setStrokeCount(prev => Math.max(0, prev - 1));
    if (historyRef.current.length === 0) setHasDrawn(false);
  };

  const handleSelectChar = (ch) => {
    if (!isTeacher) return;
    playClickSound();
    const targetDetails = HANZI_BOARD_DICTIONARY[ch] || {
      char: ch,
      pinyin: 'zì',
      strokesCount: 6,
      strokeOrder: ['Nét 1', 'Nét 2', 'Nét 3', 'Nét 4', 'Nét 5', 'Nét 6']
    };

    if (onUpdateState) {
      onUpdateState({
        char: ch,
        pinyin: targetDetails.pinyin,
        strokesCount: targetDetails.strokesCount,
        strokeOrder: targetDetails.strokeOrder
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Hanzi Stroke Order & Practice</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Thuận bút chữ Hán
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            {isTeacher 
              ? 'Trình chiếu thứ tự các nét bút chuẩn. Học viên thực hành trực tiếp trên bảng vẽ.' 
              : 'Theo dõi animation thứ tự các nét và tự tay viết chữ Hán trên bảng tập viết.'}
          </p>
        </div>

        {/* Character Pickers (Teacher) */}
        {isTeacher && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-white/60 mr-1">Chọn chữ:</span>
            {POPULAR_CHARS.map(ch => (
              <button
                key={ch}
                onClick={() => handleSelectChar(ch)}
                className={`w-8 h-8 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  selectedChar === ch
                    ? 'bg-[#E85D3F] text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Left Animation & Right Practice Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT (6 cols): Stroke Order Animation & Demonstration */}
        <div className="lg:col-span-6 rounded-3xl bg-[#111827] border border-white/10 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E85D3F]" />
              <h3 className="text-sm font-bold text-white">Thứ tự nét chuẩn (Stroke Order Demo)</h3>
            </div>
            <button
              onClick={() => speakChinese(selectedChar)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
              title="Phát âm"
            >
              <Volume2 size={15} className="text-emerald-400" />
            </button>
          </div>

          {/* Central Tianzige Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-56 h-56 rounded-3xl bg-[#0B0F19] border-2 border-emerald-500/40 relative flex items-center justify-center shadow-inner overflow-hidden">
              {/* Tianzige grid */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-px bg-white border-dashed border-t border-white" />
                <div className="h-full w-px bg-white border-dashed border-l border-white absolute" />
              </div>

              {/* Character display */}
              <span className={`text-9xl font-black font-serif select-none transition-all duration-300 ${
                isAnimating ? 'text-[#E85D3F] scale-105' : 'text-[#F4B942]'
              }`}>
                {selectedChar}
              </span>

              {/* Step indicator pill */}
              {isAnimating && (
                <div className="absolute bottom-3 px-3 py-1 rounded-full bg-[#E85D3F] text-white text-[11px] font-black uppercase shadow-lg animate-pulse">
                  Nét {animatedStrokeIndex + 1} / {charDetails.strokeOrder?.length || charDetails.strokesCount}
                </div>
              )}
            </div>

            <p className="text-xs text-white/60 mt-3 font-medium">
              Chữ <span className="font-bold text-[#F4B942]">{selectedChar}</span> ({charDetails.pinyin}) • Tổng số: <span className="text-emerald-400 font-bold">{charDetails.strokesCount} nét</span>
            </p>
          </div>

          {/* Stroke sequence buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-semibold">Trình tự từng nét bút:</span>
              <button
                onClick={handlePlayAnimation}
                disabled={isAnimating}
                className="px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#E85D3F]/20"
              >
                <Play size={13} />
                <span>{isAnimating ? 'Đang chạy demo...' : 'Chạy lại Animation'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {charDetails.strokeOrder?.map((strokeName, idx) => {
                const isCurrentStroke = animatedStrokeIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isCurrentStroke
                        ? 'bg-[#E85D3F]/20 border-[#E85D3F] text-white font-bold'
                        : 'bg-white/5 border-white/5 text-white/70'
                    }`}
                  >
                    {strokeName}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT (6 cols): Student Practice Canvas */}
        <div className="lg:col-span-6 rounded-3xl bg-[#111827] border border-white/10 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenTool size={16} className="text-[#F4B942]" />
              <h3 className="text-sm font-bold text-white">Bảng luyện viết (Student Practice Canvas)</h3>
            </div>
            
            {/* Toggle Watermark Guide */}
            <button
              onClick={() => setShowWatermarkGuide(prev => !prev)}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-bold text-white/80 transition-all flex items-center gap-1 cursor-pointer"
            >
              {showWatermarkGuide ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showWatermarkGuide ? 'Ẩn nét mờ' : 'Hiện nét mờ'}</span>
            </button>
          </div>

          {/* Practice Canvas with Tianzige Guide & Watermark */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl bg-[#0B0F19] border-2 border-white/20 relative flex items-center justify-center shadow-inner overflow-hidden touch-none select-none">
              
              {/* Tianzige grid guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-px bg-white border-dashed border-t border-white" />
                <div className="h-full w-px bg-white border-dashed border-l border-white absolute" />
                {/* Diagonal lines */}
                <div className="w-full h-px bg-white/40 border-dotted border-t border-white rotate-45 transform origin-center absolute" />
                <div className="w-full h-px bg-white/40 border-dotted border-t border-white -rotate-45 transform origin-center absolute" />
              </div>

              {/* Character watermark guide underneath canvas */}
              {showWatermarkGuide && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                  <span className="text-8xl sm:text-9xl font-black font-serif text-white select-none">
                    {selectedChar}
                  </span>
                </div>
              )}

              {/* Drawing Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full relative z-10 cursor-crosshair"
              />
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
              <span>Đã viết: <strong className="text-emerald-400">{strokeCount} nét</strong></span>
              {hasDrawn && (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 size={12} />
                  <span>Đang có bài viết</span>
                </span>
              )}
            </div>
          </div>

          {/* Canvas Actions Bar: Undo, Clear, Replay */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={!hasDrawn}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Quay lại nét vừa viết"
              >
                <Undo2 size={14} />
                <span>Undo (Quay lại)</span>
              </button>

              <button
                onClick={clearCanvas}
                disabled={!hasDrawn}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 disabled:opacity-30 text-rose-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Xóa trắng bảng vẽ"
              >
                <Trash2 size={14} />
                <span>Clear (Xóa bảng)</span>
              </button>
            </div>

            <button
              onClick={handlePlayAnimation}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Xem lại nét mẫu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
