import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import HanziWriter from 'hanzi-writer';
import { 
  RotateCcw, 
  Trash2, 
  Undo2, 
  Download, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  PenTool, 
  Award,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Check
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../utils/audio';

const BRUSH_SIZES = [
  { id: 'thin', label: 'Mảnh', size: 6 },
  { id: 'medium', label: 'Vừa', size: 12 },
  { id: 'thick', label: 'Bút lông', size: 20 }
];

const BRUSH_COLORS = [
  { id: 'black', label: 'Mực đen', color: '#243447', bg: 'bg-[#243447]' },
  { id: 'vermilion', label: 'Chu sa', color: '#E85D3F', bg: 'bg-[#E85D3F]' },
  { id: 'blue', label: 'Mực lam', color: '#2563EB', bg: 'bg-[#2563EB]' }
];

export default function InteractiveWritingPad({
  character,
  strokesCount = 6,
  onPracticeComplete
}) {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'freehand'

  // Quiz state
  const quizContainerRef = useRef(null);
  const quizWriterRef = useRef(null);
  const [quizState, setQuizState] = useState({
    isActive: false,
    isComplete: false,
    mistakes: 0,
    totalStrokes: strokesCount,
    currentStroke: 0,
    message: 'Bấm "Bắt đầu viết" để thử thách thứ tự nét bút!',
    messageType: 'info', // 'info', 'success', 'warning'
    score: null,
    showOutline: true
  });

  // Freehand Canvas state
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [brushSize, setBrushSize] = useState(12);
  const [brushColor, setBrushColor] = useState('#243447');
  const [showGhostOutline, setShowGhostOutline] = useState(true);
  const [gridMode, setGridMode] = useState('mizige'); // 'mizige', 'tianzige'

  /**
   * =========================================================================
   * 1. QUIZ ENGINE LOGIC (Xác thực thứ tự nét & hướng nét chuẩn xác)
   * =========================================================================
   */
  const startQuiz = useCallback((outlineVisible = quizState.showOutline) => {
    if (!quizContainerRef.current || !character) return;

    quizContainerRef.current.innerHTML = '';
    quizWriterRef.current = null;

    try {
      const writer = HanziWriter.create(quizContainerRef.current, character, {
        width: 280,
        height: 280,
        padding: 20,
        showOutline: outlineVisible,
        strokeAnimationSpeed: 1.2,
        strokeColor: '#E85D3F',
        outlineColor: '#CBD5E1',
        highlightColor: '#F59E0B',
        drawingColor: '#243447',
        drawingWidth: 16,
        showCharacter: false,
        onLoadCharDataSuccess: (data) => {
          setQuizState(prev => ({
            ...prev,
            isActive: true,
            isComplete: false,
            mistakes: 0,
            totalStrokes: data?.strokes ? data.strokes.length : strokesCount,
            currentStroke: 0,
            message: outlineVisible 
              ? 'Tô theo nét mẫu mờ đúng thứ tự nét nhé!' 
              : 'Thử thách trí nhớ: Tự viết chữ mà không cần mẫu!',
            messageType: 'info',
            score: null
          }));

          // Bắt đầu chế độ Quiz của HanziWriter
          writer.quiz({
            showOutline: outlineVisible,
            showHintAfterMisses: 2,
            onCorrectStroke: (strokeData) => {
              playClickSound();
              setQuizState(prev => ({
                ...prev,
                currentStroke: strokeData.strokeNum + 1,
                message: `Tuyệt vời! Viết đúng nét thứ ${strokeData.strokeNum + 1}.`,
                messageType: 'success'
              }));
            },
            onMistake: (strokeData) => {
              setQuizState(prev => {
                const newMistakes = prev.mistakes + 1;
                return {
                  ...prev,
                  mistakes: newMistakes,
                  message: `Chưa đúng nét thứ ${strokeData.strokeNum + 1}. Hãy viết từ trên xuống dưới, trái sang phải!`,
                  messageType: 'warning'
                };
              });
            },
            onComplete: (summary) => {
              playSuccessSound();
              try {
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
              } catch {}

              const finalScore = Math.max(50, Math.round(100 - (summary.totalMistakes * 12)));
              setQuizState(prev => ({
                ...prev,
                isActive: false,
                isComplete: true,
                score: finalScore,
                message: `Xuất sắc! Bạn đã hoàn thành chữ "${character}" (${finalScore} điểm)!`,
                messageType: 'success'
              }));

              if (onPracticeComplete) {
                onPracticeComplete({
                  character,
                  mode: 'quiz',
                  score: finalScore,
                  mistakes: summary.totalMistakes
                });
              }
            }
          });
        },
        onLoadCharDataError: () => {
          setQuizState(prev => ({
            ...prev,
            isActive: false,
            message: 'Ký tự này chưa có dữ liệu nét kiểm tra. Hãy chuyển sang bảng "Tập viết tự do" nhé!',
            messageType: 'warning'
          }));
        }
      });

      quizWriterRef.current = writer;
    } catch (err) {
      console.warn('Quiz init error:', err);
    }
  }, [character, strokesCount, quizState.showOutline, onPracticeComplete]);

  // Restart quiz whenever character or tab changes
  useEffect(() => {
    if (activeTab === 'quiz') {
      startQuiz(quizState.showOutline);
    }
    return () => {
      if (quizWriterRef.current) {
        try {
          quizWriterRef.current.cancelQuiz();
        } catch {}
        quizWriterRef.current = null;
      }
    };
  }, [character, activeTab]);

  // Toggle Outline in Quiz
  const toggleQuizOutline = () => {
    playClickSound();
    const nextOutline = !quizState.showOutline;
    setQuizState(prev => ({ ...prev, showOutline: nextOutline }));
    startQuiz(nextOutline);
  };

  /**
   * =========================================================================
   * 2. FREEHAND CALLIGRAPHY LOGIC (Vẽ bút lông tự do trên ô Mễ / Điền)
   * =========================================================================
   */
  const clearFreehandCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setHasDrawn(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'freehand') {
      clearFreehandCanvas();
    }
  }, [character, activeTab, clearFreehandCanvas]);

  // Drawing event handlers with Pointer Events for touch/stylus/mouse
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Save snapshot for Undo
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(snap);
      if (historyRef.current.length > 30) historyRef.current.shift();
    } catch {}

    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== 'pointerdown') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Undo stroke
  const handleUndo = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    const prev = historyRef.current.pop();
    ctx.putImageData(prev, 0, 0);
    if (historyRef.current.length === 0) {
      setHasDrawn(false);
    }
  };

  // Export handwriting image PNG
  const handleExportPng = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create composite canvas with grid
    const compCanvas = document.createElement('canvas');
    compCanvas.width = canvas.width;
    compCanvas.height = canvas.height;
    const cCtx = compCanvas.getContext('2d');

    // Paper background
    cCtx.fillStyle = '#FFFCF8';
    cCtx.fillRect(0, 0, compCanvas.width, compCanvas.height);

    // Border
    cCtx.strokeStyle = '#E85D3F';
    cCtx.lineWidth = 4;
    cCtx.strokeRect(4, 4, compCanvas.width - 8, compCanvas.height - 8);

    // Draw user strokes
    cCtx.drawImage(canvas, 0, 0);

    const dataUrl = compCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `hanzigo-${character}-tap-viet.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-[#F1E5D8] dark:border-[#334155] shadow-sm">
      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1E5D8] dark:border-[#334155]">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kiểm tra nét bút (Quiz)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('freehand');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'freehand'
                ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Tập viết tự do (Canvas)</span>
          </button>
        </div>

        {activeTab === 'quiz' && quizState.score && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Điểm: {quizState.score}/100</span>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: QUIZ MODE CONTAINER                                            */}
      {/* ===================================================================== */}
      {activeTab === 'quiz' && (
        <div className="flex flex-col items-center">
          {/* Status Message Banner */}
          <div className={`w-full max-w-[280px] p-2.5 mb-3 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
            quizState.messageType === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : quizState.messageType === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              : 'bg-[#FFF9F2] dark:bg-[#0F172A] border-[#F1E5D8] dark:border-[#334155] text-[#243447] dark:text-[#E2E8F0]'
          }`}>
            {quizState.messageType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : quizState.messageType === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <Lightbulb className="w-4 h-4 text-[#E85D3F] shrink-0" />
            )}
            <span className="leading-tight">{quizState.message}</span>
          </div>

          {/* Tianzige Quiz Canvas */}
          <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden border-2 border-[#E85D3F]/40 shadow-inner bg-[#FFFCF8] dark:bg-[#0F172A]">
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#E85D3F]/25 stroke-dasharray-[4,4] stroke-1" viewBox="0 0 280 280">
              <line x1="140" y1="0" x2="140" y2="280" />
              <line x1="0" y1="140" x2="280" y2="140" />
              <line x1="0" y1="0" x2="280" y2="280" />
              <line x1="280" y1="0" x2="0" y2="280" />
            </svg>

            {/* Mount HanziWriter Interactive Quiz */}
            <div ref={quizContainerRef} className="w-full h-full flex items-center justify-center cursor-crosshair" />
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex items-center gap-2 mt-4 w-full max-w-[280px]">
            <button
              type="button"
              onClick={toggleQuizOutline}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                quizState.showOutline
                  ? 'bg-[#E85D3F]/10 border-[#E85D3F]/30 text-[#E85D3F]'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              title={quizState.showOutline ? 'Bấm để ẩn mẫu mờ (chế độ nhớ)' : 'Bấm để hiện mẫu mờ'}
            >
              {quizState.showOutline ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{quizState.showOutline ? 'Có mẫu mờ' : 'Tập nhớ (Ẩn mẫu)'}</span>
            </button>

            <button
              type="button"
              onClick={() => startQuiz(quizState.showOutline)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Viết lại</span>
            </button>
          </div>

          {/* Mistake Counter */}
          <div className="mt-3 text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-3">
            <span>Số nét: <strong className="text-[#243447] dark:text-white">{quizState.currentStroke} / {quizState.totalStrokes}</strong></span>
            <span>•</span>
            <span>Số lần lỗi: <strong className={quizState.mistakes > 0 ? 'text-amber-500' : 'text-emerald-500'}>{quizState.mistakes}</strong></span>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: FREEHAND CANVAS CONTAINER                                      */}
      {/* ===================================================================== */}
      {activeTab === 'freehand' && (
        <div className="flex flex-col items-center">
          {/* Drawing Tools Bar */}
          <div className="flex items-center justify-between w-full max-w-[280px] mb-3">
            {/* Brush Sizes */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
              {BRUSH_SIZES.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBrushSize(b.size)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                    brushSize === b.size 
                      ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Ink Colors */}
            <div className="flex items-center gap-1">
              {BRUSH_COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBrushColor(c.color)}
                  className={`w-6 h-6 rounded-full ${c.bg} transition-all ${
                    brushColor === c.color ? 'ring-2 ring-offset-2 ring-[#E85D3F] scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Canvas Box */}
          <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden border-2 border-[#E85D3F]/40 shadow-inner bg-[#FFFCF8] dark:bg-[#0F172A] touch-none">
            {/* Grid SVG */}
            {gridMode === 'mizige' ? (
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#E85D3F]/25 stroke-dasharray-[4,4] stroke-1" viewBox="0 0 280 280">
                <line x1="140" y1="0" x2="140" y2="280" />
                <line x1="0" y1="140" x2="280" y2="140" />
                <line x1="0" y1="0" x2="280" y2="280" />
                <line x1="280" y1="0" x2="0" y2="280" />
              </svg>
            ) : (
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#E85D3F]/25 stroke-dasharray-[4,4] stroke-1" viewBox="0 0 280 280">
                <line x1="140" y1="0" x2="140" y2="280" />
                <line x1="0" y1="140" x2="280" y2="140" />
              </svg>
            )}

            {/* Ghost Reference Char Outline */}
            {showGhostOutline && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="font-['Noto_Serif_SC'] text-[170px] font-bold text-gray-300/40 dark:text-gray-600/30 leading-none">
                  {character}
                </span>
              </div>
            )}

            {/* Pointer Canvas */}
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />
          </div>

          {/* Freehand Action Buttons */}
          <div className="flex items-center justify-between w-full max-w-[280px] mt-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowGhostOutline(!showGhostOutline);
              }}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all ${
                showGhostOutline
                  ? 'bg-[#E85D3F]/10 border-[#E85D3F]/30 text-[#E85D3F]'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
              }`}
              title="Ẩn/Hiện chữ mẫu mờ phía dưới"
            >
              {showGhostOutline ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Chữ mờ</span>
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={!hasDrawn}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-40"
              title="Quay lại nét trước"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={clearFreehandCanvas}
              disabled={!hasDrawn}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-rose-500 hover:bg-rose-50 active:scale-95 transition-all disabled:opacity-40"
              title="Xóa trắng bảng vẽ"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleExportPng}
              disabled={!hasDrawn}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 active:scale-95 transition-all disabled:opacity-40"
              title="Tải ảnh chữ bạn viết về máy (PNG)"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
