import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PenTool, 
  Highlighter, 
  Eraser, 
  Type, 
  Minus, 
  Square, 
  Circle, 
  ArrowUpRight, 
  Trash2, 
  Palette,
  Undo2
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { broadcastWhiteboardOperation, clearWhiteboard } from '../../services/liveClassroomService';

export default function WhiteboardBoard({
  isTeacher = false,
  user,
  sessionId,
  whiteboardState = {},
  onUpdateState: _onUpdateState
}) {
  const operations = whiteboardState?.operations || [];

  const [activeTool, setActiveTool] = useState('pen'); // 'pen' | 'eraser' | 'highlighter' | 'text' | 'line' | 'rectangle' | 'circle' | 'arrow'
  const [activeColor, setActiveColor] = useState('#F4B942');
  const [strokeSize, setStrokeSize] = useState(4);
  const [textInput, setTextInput] = useState('你好');

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef([]);
  const startPointRef = useRef({ x: 0, y: 0 });

  const PALETTE_COLORS = ['#FFFFFF', '#F4B942', '#E85D3F', '#45B97C', '#3B82F6', '#A855F7', '#EF4444'];

  // Redraw all vector operations on canvas
  const redrawAllOperations = useCallback((opsList) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    opsList.forEach(op => {
      ctx.save();
      ctx.strokeStyle = op.color || '#FFFFFF';
      ctx.lineWidth = op.size || 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (op.tool === 'highlighter') {
        ctx.strokeStyle = op.color || '#F4B942';
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = (op.size || 6) * 3;
      } else if (op.tool === 'eraser') {
        ctx.strokeStyle = '#0B0F19';
        ctx.lineWidth = (op.size || 4) * 4;
      }

      switch (op.tool) {
        case 'pen':
        case 'highlighter':
        case 'eraser':
          if (op.points && op.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(op.points[0].x, op.points[0].y);
            for (let i = 1; i < op.points.length; i++) {
              ctx.lineTo(op.points[i].x, op.points[i].y);
            }
            ctx.stroke();
          }
          break;

        case 'line':
          ctx.beginPath();
          ctx.moveTo(op.x1, op.y1);
          ctx.lineTo(op.x2, op.y2);
          ctx.stroke();
          break;

        case 'rectangle':
          ctx.strokeRect(
            Math.min(op.x1, op.x2),
            Math.min(op.y1, op.y2),
            Math.abs(op.x2 - op.x1),
            Math.abs(op.y2 - op.y1)
          );
          break;

        case 'circle': {
          const radius = Math.sqrt(Math.pow(op.x2 - op.x1, 2) + Math.pow(op.y2 - op.y1, 2));
          ctx.beginPath();
          ctx.arc(op.x1, op.y1, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        }

        case 'arrow': {
          ctx.beginPath();
          ctx.moveTo(op.x1, op.y1);
          ctx.lineTo(op.x2, op.y2);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(op.y2 - op.y1, op.x2 - op.x1);
          const headlen = 16;
          ctx.beginPath();
          ctx.moveTo(op.x2, op.y2);
          ctx.lineTo(op.x2 - headlen * Math.cos(angle - Math.PI / 6), op.y2 - headlen * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(op.x2, op.y2);
          ctx.lineTo(op.x2 - headlen * Math.cos(angle + Math.PI / 6), op.y2 - headlen * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
          break;
        }

        case 'text':
          ctx.font = `bold ${op.size * 5}px "Noto Serif SC", serif`;
          ctx.fillStyle = op.color || '#FFFFFF';
          ctx.fillText(op.text || '', op.x, op.y);
          break;

        default:
          break;
      }
      ctx.restore();
    });
  }, []);

  // Update canvas on operations change
  useEffect(() => {
    redrawAllOperations(operations);
  }, [operations, redrawAllOperations]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 960;
    canvas.height = 540;
    redrawAllOperations(operations);
  }, [redrawAllOperations, operations]);

  // Coordinate helper
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasCoords(e);
    isDrawingRef.current = true;
    startPointRef.current = { x, y };

    if (activeTool === 'text') {
      const op = {
        tool: 'text',
        x,
        y,
        text: textInput,
        color: activeColor,
        size: strokeSize
      };
      broadcastWhiteboardOperation(sessionId, user, op);
      isDrawingRef.current = false;
      return;
    }

    currentPathRef.current = [{ x, y }];
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    const { x, y } = getCanvasCoords(e);

    if (['pen', 'highlighter', 'eraser'].includes(activeTool)) {
      currentPathRef.current.push({ x, y });
      // Temporary local preview
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.strokeStyle = activeTool === 'eraser' ? '#0B0F19' : activeColor;
      ctx.lineWidth = activeTool === 'highlighter' ? strokeSize * 3 : activeTool === 'eraser' ? strokeSize * 4 : strokeSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (activeTool === 'highlighter') ctx.globalAlpha = 0.35;

      const pts = currentPathRef.current;
      if (pts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const { x, y } = getCanvasCoords(e);
    const start = startPointRef.current;

    let op = null;
    if (['pen', 'highlighter', 'eraser'].includes(activeTool)) {
      if (currentPathRef.current.length > 1) {
        op = {
          tool: activeTool,
          points: currentPathRef.current,
          color: activeColor,
          size: strokeSize
        };
      }
    } else if (['line', 'rectangle', 'circle', 'arrow'].includes(activeTool)) {
      op = {
        tool: activeTool,
        x1: start.x,
        y1: start.y,
        x2: x,
        y2: y,
        color: activeColor,
        size: strokeSize
      };
    }

    if (op) {
      broadcastWhiteboardOperation(sessionId, user, op);
    }
    currentPathRef.current = [];
  };

  const handleClear = async () => {
    playClickSound();
    await clearWhiteboard(sessionId, user);
  };

  const TOOLS = [
    { id: 'pen', label: 'Bút vẽ (Pen)', icon: PenTool },
    { id: 'highlighter', label: 'Dạ quang (Highlighter)', icon: Highlighter },
    { id: 'eraser', label: 'Tẩy xóa (Eraser)', icon: Eraser },
    { id: 'text', label: 'Chữ Hán (Text)', icon: Type },
    { id: 'line', label: 'Đường thẳng (Line)', icon: Minus },
    { id: 'rectangle', label: 'Hình chữ nhật', icon: Square },
    { id: 'circle', label: 'Hình tròn', icon: Circle },
    { id: 'arrow', label: 'Mũi tên (Arrow)', icon: ArrowUpRight }
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-hidden space-y-3 text-white">
      {/* Top Toolbar */}
      <div className="p-2 sm:p-3 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-between gap-3 flex-wrap">
        {/* Tools picker */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  playClickSound();
                  setActiveTool(t.id);
                }}
                className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-[#E85D3F] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
                title={t.label}
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>

        {/* Text tool input if text is active */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Chữ Hán:</span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-xs text-white w-28"
              placeholder="VD: 老师"
            />
          </div>
        )}

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {PALETTE_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                activeColor === c ? 'scale-125 border-white ring-2 ring-white/40' : 'border-white/20'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Size Slider & Clear Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-white/60">
            <span>Size:</span>
            <input
              type="range"
              min="2"
              max="16"
              value={strokeSize}
              onChange={(e) => setStrokeSize(Number(e.target.value))}
              className="w-16 accent-[#E85D3F]"
            />
          </div>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
            title="Xóa trắng bảng vẽ cho cả lớp"
          >
            <Trash2 size={13} />
            <span>Clear bảng</span>
          </button>
        </div>
      </div>

      {/* Main Vector Canvas Area */}
      <div className="flex-1 rounded-3xl bg-[#0B0F19] border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="w-full h-full relative z-10 cursor-crosshair touch-none select-none"
        />

        <div className="absolute bottom-3 left-4 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/60 pointer-events-none">
          ⚡ Đồng bộ vector realtime ({operations.length} nét vẽ)
        </div>
      </div>
    </div>
  );
}
