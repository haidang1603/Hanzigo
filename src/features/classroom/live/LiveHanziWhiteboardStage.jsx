import React, { useEffect, useMemo, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import confetti from 'canvas-confetti';
import {
  Play,
  PenTool,
  Eraser,
  Sparkles,
  Grid,
  BookmarkPlus,
  Search,
  UserCheck,
  UserX,
  BarChart3,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Radio,
  Clock,
  Layers,
} from 'lucide-react';
import { useLiveHanziWhiteboard } from './useLiveHanziWhiteboard';
import { useUnifiedTools } from '../../../core/ecosystem/UnifiedToolsContext.tsx';

const STAGE_SIZE = 340;

const PRESET_SPOTLIGHT_CARDS = [
  {
    type: 'grammar',
    label: 'Ngữ pháp: 把字句 (Câu chữ 把)',
    payload: {
      code: 'HSK3-BA-01',
      title: 'Câu chữ 把 (Biểu thị sự xử lý)',
      formula: 'Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác',
      example: '请把书放在桌子上。 (Hãy đặt sách lên trên bàn.)',
      tip: 'Động từ phía sau 把 không được đứng trơ trọi; cần bổ ngữ, 了, hoặc lặp lại động từ.',
    },
  },
  {
    type: 'hsk_question',
    label: 'Đề HSK 4: Phân biệt 整理 vs 收拾',
    payload: {
      level: 'HSK 4',
      question: '房间太乱了，我们一起______一下吧。',
      options: ['A. 整理', 'B. 收拾', 'C. 修理', 'D. 准备'],
      hint: '收拾 thường dùng cho dọn dẹp phòng ốc/đồ đạc bừa bộn; 整理 thiên về sắp xếp tài liệu, ý tưởng có hệ thống.',
    },
  },
];

const PRESET_QUIZ = {
  question: 'Từ nào có nghĩa là "sắp xếp, chỉnh lý tài liệu"?',
  options: ['整理 (zhěnglǐ)', '收拾 (shōushi)', '坚持 (jiānchí)', '解释 (jiěshì)'],
  correctIndex: 0,
};

function renderGridSvg(gridType) {
  return (
    <svg
      viewBox="0 0 340 340"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="336"
        height="336"
        rx="12"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="2"
      />
      <line x1="170" y1="2" x2="170" y2="338" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="6 6" />
      <line x1="2" y1="170" x2="338" y2="170" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="6 6" />
      {gridType === 'mizige' && (
        <>
          <line x1="2" y1="2" x2="338" y2="338" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="6 6" />
          <line x1="338" y1="2" x2="2" y2="338" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="6 6" />
        </>
      )}
    </svg>
  );
}

export default function LiveHanziWhiteboardStage({
  room,
  currentUser,
  isTeacher = false,
  participants = [],
}) {
  const {
    boardState,
    canDrawOnBoard,
    broadcastSetCharacter,
    broadcastAnimateCharacter,
    broadcastStrokeResult,
    broadcastStrokePoint,
    broadcastClearInk,
    grantPenToStudent,
    broadcastSpotlightCard,
    launchPopQuiz,
    submitPopQuizAnswer,
  } = useLiveHanziWhiteboard(room, currentUser, isTeacher);

  const { openDrawerForText, quickSaveToVocabulary } = useUnifiedTools();

  const writerHostRef = useRef(null);
  const writerRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const activeStrokeIdRef = useRef(null);

  const [activeTool, setActiveTool] = useState('hanzi'); // 'hanzi' | 'pen' | 'laser'
  const [penColor, setPenColor] = useState('#E85D3F');
  const [wordInput, setWordInput] = useState('整理汉字');
  const [meaningInput, setMeaningInput] = useState('');
  const [savedNotice, setSavedNotice] = useState('');

  const [quizQuestion, setQuizQuestion] = useState(PRESET_QUIZ.question);
  const [quizOptions, setQuizOptions] = useState(PRESET_QUIZ.options);
  const [quizCorrectIdx, setQuizCorrectIdx] = useState(PRESET_QUIZ.correctIndex);
  const [myQuizChoice, setMyQuizChoice] = useState(null);
  const [quizSecondsLeft, setQuizSecondsLeft] = useState(0);

  const characterQueue = useMemo(() => {
    const chars = Array.from(wordInput || '').filter((ch) => /[\u4e00-\u9fff]/.test(ch));
    return chars.length > 0 ? chars : ['整'];
  }, [wordInput]);

  const studentOptions = useMemo(() => {
    return (participants || []).filter((p) => p.role !== 'teacher');
  }, [participants]);

  // Mount & update HanziWriter instance
  useEffect(() => {
    const host = writerHostRef.current;
    if (!host) return undefined;

    host.innerHTML = '';
    const char = boardState.activeCharacter || '整';

    let writer = null;
    try {
      writer = HanziWriter.create(host, char, {
        width: STAGE_SIZE,
        height: STAGE_SIZE,
        padding: 18,
        showOutline: true,
        showCharacter: boardState.mode !== 'quiz',
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 160,
        strokeColor: '#0F172A',
        outlineColor: '#CBD5E1',
        drawingColor: '#E85D3F',
        drawingWidth: 10,
        highlightColor: '#10B981',
      });
      writerRef.current = writer;

      if (boardState.mode === 'quiz' && canDrawOnBoard && activeTool === 'hanzi') {
        writer.quiz({
          onCorrectStroke: (strokeData) => {
            broadcastStrokeResult({
              strokeNum: strokeData.strokeNum,
              isCorrect: true,
              totalMistakes: strokeData.totalMistakes,
            });
          },
          onMistake: (strokeData) => {
            broadcastStrokeResult({
              strokeNum: strokeData.strokeNum,
              isCorrect: false,
              totalMistakes: strokeData.totalMistakes,
            });
          },
          onComplete: () => {
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
            } catch {
              // ignore confetti errors in headless env
            }
          },
        });
      }
    } catch {
      writerRef.current = null;
    }

    return () => {
      writerRef.current = null;
      if (host) host.innerHTML = '';
    };
  }, [boardState.activeCharacter, boardState.mode, canDrawOnBoard, activeTool, broadcastStrokeResult]);

  // Synchronized stroke animation trigger
  useEffect(() => {
    if (!boardState.animationCommand || !writerRef.current) return;
    try {
      writerRef.current.animateCharacter();
    } catch {
      // ignore if writer unmounted mid-animation
    }
  }, [boardState.animationCommand]);

  // Render freehand & laser strokes onto Layer 2 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, STAGE_SIZE, STAGE_SIZE);
    const strokes = boardState.freehandStrokes || [];
    if (strokes.length === 0) return;

    const grouped = new Map();
    for (const pt of strokes) {
      const key = pt.strokeId || 'default';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(pt);
    }

    for (const points of grouped.values()) {
      if (points.length === 0) continue;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const strokeColor = points[0].color || '#E85D3F';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeColor === '#EF4444' ? 5 : 4;
      if (strokeColor === '#EF4444') {
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
        ctx.shadowBlur = 10;
      }
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = pt.x * STAGE_SIZE;
        const py = pt.y * STAGE_SIZE;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      if (points.length === 1) {
        const px = points[0].x * STAGE_SIZE;
        const py = points[0].y * STAGE_SIZE;
        ctx.lineTo(px + 0.5, py + 0.5);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [boardState.freehandStrokes]);

  // Pop-Quiz countdown timer
  useEffect(() => {
    const quiz = boardState.activePopQuiz;
    if (!quiz) {
      setMyQuizChoice(null);
      setQuizSecondsLeft(0);
      return undefined;
    }

    setMyQuizChoice(null);
    const totalMs = (quiz.durationSec || 30) * 1000;
    const startedAt = quiz.startedAt || Date.now();

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((startedAt + totalMs - Date.now()) / 1000));
      setQuizSecondsLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [boardState.activePopQuiz]);

  const getNormalizedPoint = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    return { x, y };
  };

  const handleCanvasPointerDown = (e) => {
    if (!canDrawOnBoard || activeTool === 'hanzi') return;
    const pt = getNormalizedPoint(e);
    if (!pt) return;
    isDrawingRef.current = true;
    activeStrokeIdRef.current = `${activeTool}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const color = activeTool === 'laser' ? '#EF4444' : penColor;
    broadcastStrokePoint(pt.x, pt.y, { strokeId: activeStrokeIdRef.current, color });
  };

  const handleCanvasPointerMove = (e) => {
    if (!isDrawingRef.current || !canDrawOnBoard || activeTool === 'hanzi') return;
    const pt = getNormalizedPoint(e);
    if (!pt) return;
    const color = activeTool === 'laser' ? '#EF4444' : penColor;
    broadcastStrokePoint(pt.x, pt.y, { strokeId: activeStrokeIdRef.current, color });
  };

  const handleCanvasPointerUp = () => {
    isDrawingRef.current = false;
    activeStrokeIdRef.current = null;
  };

  const handleQuickSave = async () => {
    const char = boardState.activeCharacter;
    if (!char) return;
    await quickSaveToVocabulary(
      {
        simplified: char,
        pinyin: boardState.pinyin || '',
        meaning_vi: boardState.meaningVi || 'Từ vựng bảng trắng lớp học',
      },
      { sourceApp: 'live_whiteboard' }
    );
    setSavedNotice(`Đã lưu "${char}" vào Sổ từ!`);
    setTimeout(() => setSavedNotice(''), 2500);
  };

  const handleLaunchPopQuiz = () => {
    if (!quizQuestion.trim()) return;
    launchPopQuiz({
      id: `quiz-${Date.now()}`,
      question: quizQuestion.trim(),
      options: quizOptions.map((o) => o.trim()).filter(Boolean),
      correctIndex: quizCorrectIdx,
      durationSec: 30,
      startedAt: Date.now(),
    });
  };

  const handleSelectQuizOption = (idx) => {
    if (!boardState.activePopQuiz || myQuizChoice !== null || quizSecondsLeft <= 0) return;
    setMyQuizChoice(idx);
    submitPopQuizAnswer({
      selectedOption: idx,
      isCorrect: idx === boardState.activePopQuiz.correctIndex,
    });
  };

  const quizStats = useMemo(() => {
    const quiz = boardState.activePopQuiz;
    if (!quiz) return { total: 0, counts: [] };
    const counts = new Array(quiz.options?.length || 4).fill(0);
    const responses = Object.values(boardState.popQuizResponses || {});
    for (const r of responses) {
      if (typeof r.selectedOption === 'number' && counts[r.selectedOption] !== undefined) {
        counts[r.selectedOption] += 1;
      }
    }
    return { total: responses.length, counts };
  }, [boardState.activePopQuiz, boardState.popQuizResponses]);

  const canvasInteractive = canDrawOnBoard && activeTool !== 'hanzi';

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-y-auto p-1">
      {/* LEFT / CENTER: DUAL-LAYER HANZI WHITEBOARD STAGE */}
      <div className="flex-1 bg-[#161923] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-between gap-4">
        {/* Stage Header Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-white leading-none">
              {boardState.activeCharacter}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-300">
                  {boardState.pinyin || 'Pinyin đang cập nhật'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/80">
                  {boardState.mode === 'quiz' ? 'Chế độ Luyện viết' : 'Chế độ Minh họa'}
                </span>
              </div>
              <p className="text-xs text-white/60">
                {boardState.meaningVi || 'Chạm nút Phân tích sâu để tra nghĩa & ví dụ'}
              </p>
            </div>
          </div>

          {/* Pen Holder Status Pill */}
          <div className="flex items-center gap-2">
            {boardState.grantedStudentIdentity ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <UserCheck size={13} />
                Đang mở bút: {boardState.grantedStudentName || 'Học viên'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-xs font-semibold flex items-center gap-1.5">
                <PenTool size={13} />
                Bảng Giáo viên
              </span>
            )}
          </div>
        </div>

        {/* 340x340 Dual-Layer Interactive Stage */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative rounded-2xl bg-[#FFFDF8] shadow-2xl border-4 border-slate-700/80 overflow-hidden select-none"
            style={{ width: STAGE_SIZE, height: STAGE_SIZE }}
          >
            {renderGridSvg(boardState.gridType)}

            {/* Layer 1: HanziWriter Vector Layer */}
            <div
              ref={writerHostRef}
              className="absolute inset-0"
              style={{ pointerEvents: activeTool === 'hanzi' && canDrawOnBoard ? 'auto' : 'none' }}
            />

            {/* Layer 2: HTML5 Canvas Freehand / Laser Overlay */}
            <canvas
              ref={canvasRef}
              width={STAGE_SIZE}
              height={STAGE_SIZE}
              onMouseDown={handleCanvasPointerDown}
              onMouseMove={handleCanvasPointerMove}
              onMouseUp={handleCanvasPointerUp}
              onMouseLeave={handleCanvasPointerUp}
              onTouchStart={handleCanvasPointerDown}
              onTouchMove={handleCanvasPointerMove}
              onTouchEnd={handleCanvasPointerUp}
              className={`absolute inset-0 touch-none ${
                canvasInteractive ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
              }`}
            />
          </div>

          {/* Drawing Tools Row (for Teacher or Pen-Granted Student) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTool('hanzi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTool === 'hanzi'
                  ? 'bg-[#E85D3F] text-white shadow'
                  : 'bg-white/10 text-white/75 hover:bg-white/20'
              }`}
            >
              <Layers size={13} />
              Nét chữ Hán
            </button>

            {canDrawOnBoard && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTool('pen')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeTool === 'pen'
                      ? 'bg-sky-500 text-white shadow'
                      : 'bg-white/10 text-white/75 hover:bg-white/20'
                  }`}
                >
                  <PenTool size={13} />
                  Bút vẽ tự do
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTool('laser')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeTool === 'laser'
                      ? 'bg-rose-500 text-white shadow'
                      : 'bg-white/10 text-white/75 hover:bg-white/20'
                  }`}
                >
                  <Radio size={13} />
                  Laser đỏ
                </button>

                {activeTool === 'pen' && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/5">
                    {['#E85D3F', '#0EA5E9', '#10B981'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPenColor(c)}
                        className={`w-4 h-4 rounded-full border cursor-pointer ${
                          penColor === c ? 'border-white scale-110' : 'border-transparent opacity-70'
                        }`}
                        style={{ backgroundColor: c }}
                        title="Đổi màu bút"
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => broadcastClearInk()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white/80 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eraser size={13} />
                  Xóa nét vẽ
                </button>
              </>
            )}
          </div>

          {/* Live Stroke Feedback Strip */}
          {boardState.liveStrokeFeed?.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {boardState.liveStrokeFeed.slice(-4).map((item, idx) => (
                <span
                  key={`${item.timestamp}-${idx}`}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    item.isCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {item.isCorrect ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                  {item.senderName}: Nét {(item.strokeNum ?? 0) + 1}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Student Quick Actions */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleQuickSave}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <BookmarkPlus size={14} />
              + Lưu chữ này vào Sổ từ
            </button>

            <button
              type="button"
              onClick={() =>
                openDrawerForText(boardState.activeCharacter, {
                  tab: 'dictionary',
                  sourceApp: 'live_whiteboard',
                })
              }
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Search size={14} />
              Mở Drawer phân tích sâu
            </button>
          </div>

          {savedNotice && (
            <span className="text-xs font-bold text-emerald-400">{savedNotice}</span>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: TEACHER LIVE DECK + SPOTLIGHT + POP-QUIZ */}
      <div className="w-full lg:w-[390px] shrink-0 flex flex-col gap-3">
        {/* Teacher Controls Deck */}
        {isTeacher && (
          <div className="bg-[#161923] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} />
                Bảng Điều Khiển Giáo Viên
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    broadcastSetCharacter({
                      character: boardState.activeCharacter,
                      pinyin: boardState.pinyin,
                      meaning_vi: boardState.meaningVi,
                      gridType: boardState.gridType === 'mizige' ? 'tianzige' : 'mizige',
                      mode: boardState.mode,
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white/80 flex items-center gap-1 cursor-pointer"
                >
                  <Grid size={12} />
                  {boardState.gridType === 'mizige' ? 'Mễ tự' : 'Điền tự'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    broadcastSetCharacter({
                      character: boardState.activeCharacter,
                      pinyin: boardState.pinyin,
                      meaning_vi: boardState.meaningVi,
                      gridType: boardState.gridType,
                      mode: boardState.mode === 'quiz' ? 'demonstrate' : 'quiz',
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white/80 cursor-pointer"
                >
                  {boardState.mode === 'quiz' ? 'Về Minh họa' : 'Mở Luyện viết'}
                </button>
              </div>
            </div>

            {/* Quick Word / Sentence Queue */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  placeholder="Nhập từ/câu chữ Hán (VD: 整理汉字)"
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E85D3F]"
                />
                <input
                  type="text"
                  value={meaningInput}
                  onChange={(e) => setMeaningInput(e.target.value)}
                  placeholder="Nghĩa ngắn"
                  className="w-24 bg-black/40 border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {characterQueue.map((ch, idx) => (
                  <button
                    key={`${ch}-${idx}`}
                    type="button"
                    onClick={() =>
                      broadcastSetCharacter({
                        character: ch,
                        pinyin: '',
                        meaning_vi: meaningInput.trim(),
                        gridType: boardState.gridType,
                        mode: boardState.mode,
                      })
                    }
                    className={`w-9 h-9 rounded-xl font-black text-base flex items-center justify-center cursor-pointer transition-all ${
                      boardState.activeCharacter === ch
                        ? 'bg-[#E85D3F] text-white shadow'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {ch}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    broadcastAnimateCharacter({ character: boardState.activeCharacter })
                  }
                  className="ml-auto px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Play size={13} />
                  Chạy mẫu bút thuận
                </button>
              </div>
            </div>

            {/* Grant Pen to Student */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/70">
                  Gọi học viên lên bảng viết:
                </span>
                {boardState.grantedStudentIdentity && (
                  <button
                    type="button"
                    onClick={() => grantPenToStudent(null, null)}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <UserX size={12} /> Thu hồi bút
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {studentOptions.length === 0 ? (
                  <span className="text-[11px] text-white/40">Chưa có học viên nào trong phòng</span>
                ) : (
                  studentOptions.map((s) => {
                    const sid = String(s.user_id || s.identity || s.id);
                    const sname = s.user_name || s.name || 'Học viên';
                    const isGranted = boardState.grantedStudentIdentity === sid;
                    return (
                      <button
                        key={sid}
                        type="button"
                        onClick={() =>
                          isGranted ? grantPenToStudent(null, null) : grantPenToStudent(sid, sname)
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                          isGranted
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {sname}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Spotlight & Pop-Quiz Triggers */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-white/70">
                Chiếu Thẻ Ngữ Pháp / Câu Hỏi Đề HSK:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SPOTLIGHT_CARDS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => broadcastSpotlightCard(preset.type, preset.payload)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-400/30 text-[11px] font-bold text-indigo-200 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
                {boardState.spotlightCard && (
                  <button
                    type="button"
                    onClick={() => broadcastSpotlightCard(null, null)}
                    className="px-2 py-1 rounded-lg bg-white/10 text-[11px] text-white/70 cursor-pointer"
                  >
                    Ẩn thẻ
                  </button>
                )}
              </div>
            </div>

            {/* Pop-Quiz Launcher */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/70 flex items-center gap-1">
                  <BarChart3 size={12} className="text-amber-400" />
                  Phát Pop-Quiz 30s
                </span>
                <button
                  type="button"
                  onClick={handleLaunchPopQuiz}
                  className="px-2.5 py-1 rounded-lg bg-[#E85D3F] hover:bg-[#d84f31] text-white text-[11px] font-black cursor-pointer"
                >
                  Phát ngay
                </button>
              </div>
              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                className="bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 text-[11px] text-white"
                placeholder="Câu hỏi trắc nghiệm nhanh..."
              />
              <div className="grid grid-cols-2 gap-1">
                {quizOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="quiz-correct"
                      checked={quizCorrectIdx === idx}
                      onChange={() => setQuizCorrectIdx(idx)}
                      title="Đáp án đúng"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const next = [...quizOptions];
                        next[idx] = e.target.value;
                        setQuizOptions(next);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[11px] text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Spotlight Card (Grammar / HSK Question / Vocab) */}
        {boardState.spotlightCard && (
          <div className="bg-[#161923] border border-indigo-500/40 rounded-2xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                {boardState.spotlightCard.cardType === 'grammar' ? (
                  <BookOpen size={13} />
                ) : (
                  <HelpCircle size={13} />
                )}
                {boardState.spotlightCard.cardType === 'grammar'
                  ? 'Thẻ Ngữ Pháp Trọng Tâm'
                  : 'Câu Hỏi Đề HSK Minh Họa'}
              </span>
            </div>

            {boardState.spotlightCard.cardType === 'grammar' ? (
              <div className="text-xs text-white/90 space-y-1.5">
                <p className="font-bold text-white">{boardState.spotlightCard.payload?.title}</p>
                <p className="px-2 py-1 rounded bg-black/40 font-mono text-[11px] text-amber-300">
                  {boardState.spotlightCard.payload?.formula}
                </p>
                <p className="text-white/80">{boardState.spotlightCard.payload?.example}</p>
                {boardState.spotlightCard.payload?.tip && (
                  <p className="text-[11px] text-emerald-300/90">
                    Mẹo: {boardState.spotlightCard.payload.tip}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xs text-white/90 space-y-1.5">
                <p className="font-bold text-white">{boardState.spotlightCard.payload?.question}</p>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-white/80">
                  {(boardState.spotlightCard.payload?.options || []).map((opt) => (
                    <div key={opt} className="px-2 py-1 rounded bg-white/5">
                      {opt}
                    </div>
                  ))}
                </div>
                {boardState.spotlightCard.payload?.hint && (
                  <p className="text-[11px] text-amber-300">
                    Gợi ý: {boardState.spotlightCard.payload.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Active Pop-Quiz Card with Live A/B/C/D Bar Chart */}
        {boardState.activePopQuiz && (
          <div className="bg-[#161923] border border-amber-500/40 rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <BarChart3 size={14} />
                POP-QUIZ TRỰC TIẾP
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                <Clock size={11} />
                {quizSecondsLeft}s
              </span>
            </div>

            <p className="text-xs font-bold text-white">{boardState.activePopQuiz.question}</p>

            <div className="flex flex-col gap-1.5">
              {(boardState.activePopQuiz.options || []).map((opt, idx) => {
                const count = quizStats.counts[idx] || 0;
                const pct = quizStats.total > 0 ? Math.round((count / quizStats.total) * 100) : 0;
                const isSelected = myQuizChoice === idx;
                const isCorrect = idx === boardState.activePopQuiz.correctIndex;
                const showResult = myQuizChoice !== null || quizSecondsLeft === 0 || isTeacher;

                return (
                  <button
                    key={`${opt}-${idx}`}
                    type="button"
                    onClick={() => handleSelectQuizOption(idx)}
                    disabled={myQuizChoice !== null || quizSecondsLeft === 0}
                    className={`relative overflow-hidden rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-500/20 text-white'
                          : 'border-rose-400 bg-rose-500/20 text-white'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/90'
                    }`}
                  >
                    {showResult && (
                      <div
                        className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                          isCorrect ? 'bg-emerald-500/20' : 'bg-white/10'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-2">
                      <span>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </span>
                      {showResult && (
                        <span className="text-[11px] font-black text-white/80">
                          {pct}% ({count})
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

