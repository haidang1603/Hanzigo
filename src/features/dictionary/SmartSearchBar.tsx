import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  Eraser,
  Grid,
  History,
  PenTool,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { VOCABULARY_LIST } from '../../data/chineseData.js';
import { KANGXI_RADICALS } from '../../data/radicalsData.js';
import { detectSearchInputType } from '../../services/dictionaryService.ts';
import type {
  DictionaryHistoryItem,
  SearchInputType,
} from '../../types/dictionary.types.ts';

export interface SmartSearchBarProps {
  query: string;
  onSearch: (nextQuery: string, hskFilter: number | null) => void;
  hskFilter: number | null;
  onHskFilterChange: (hsk: number | null) => void;
  history: DictionaryHistoryItem[];
  latencyMs?: number;
  isLoading?: boolean;
}

const INPUT_TYPE_LABELS: Record<SearchInputType, { label: string; badgeClass: string }> = {
  hanzi: { label: 'Chữ Hán', badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  pinyin_numeric: { label: 'Pinyin số', badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  pinyin_clean: { label: 'Pinyin', badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  han_viet: { label: 'Hán Việt', badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  vietnamese: { label: 'Nghĩa Việt', badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
};

type StrokePoint = { x: number; y: number };

export default function SmartSearchBar({
  query,
  onSearch,
  hskFilter,
  onHskFilterChange,
  history,
  latencyMs = 0,
  isLoading = false,
}: SmartSearchBarProps) {
  const [localInput, setLocalInput] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setLocalInput(query);
  }
  const [showHistory, setShowHistory] = useState(false);
  const [assistMode, setAssistMode] = useState<'none' | 'handwriting' | 'radical'>('none');
  const [strokes, setStrokes] = useState<StrokePoint[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [radicalStrokeFilter, setRadicalStrokeFilter] = useState<number | 'all'>('all');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStrokeRef = useRef<StrokePoint[]>([]);

  // Debounced search (250ms)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearch(localInput, hskFilter);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [localInput, hskFilter, onSearch]);

  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowHistory(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const inputType = useMemo(() => detectSearchInputType(localInput), [localInput]);
  const typeMeta = INPUT_TYPE_LABELS[inputType];

  // Handwriting canvas stroke-count candidate matching
  const handwritingCandidates = useMemo(() => {
    if (strokes.length === 0) return [];
    const targetCount = strokes.length;
    const singleChars = VOCABULARY_LIST.filter(
      (v) => v?.hanzi && Array.from(v.hanzi).length === 1
    );

    const scored = singleChars.map((item) => {
      const approxStrokes = Number(item.strokes) || Math.max(1, targetCount);
      const diff = Math.abs(approxStrokes - targetCount);
      return { hanzi: item.hanzi, pinyin: item.pinyin, diff };
    });

    scored.sort((a, b) => a.diff - b.diff);
    return scored.slice(0, 8);
  }, [strokes]);

  const filteredRadicals = useMemo(() => {
    return KANGXI_RADICALS.filter((r) =>
      radicalStrokeFilter === 'all' ? true : r.strokes === radicalStrokeFilter
    ).slice(0, 48);
  }, [radicalStrokeFilter]);

  const redrawCanvas = useCallback((allStrokes: StrokePoint[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tianzige grid guides
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.restore();

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#E85D3F';
    ctx.lineWidth = 5;

    for (const stroke of allStrokes) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i += 1) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    if (assistMode === 'handwriting') {
      redrawCanvas(strokes);
    }
  }, [assistMode, strokes, redrawCanvas]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): StrokePoint => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
      y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    currentStrokeRef.current = [getCanvasPoint(e)];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    currentStrokeRef.current.push(getCanvasPoint(e));
    redrawCanvas([...strokes, currentStrokeRef.current]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStrokeRef.current.length > 0) {
      setStrokes((prev) => [...prev, currentStrokeRef.current]);
      currentStrokeRef.current = [];
    }
  };

  const appendCharToSearch = (char: string) => {
    const next = `${localInput}${char}`;
    setLocalInput(next);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      {/* Main Search Input */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-[#1E293B] border-2 border-[#EFE4D6] dark:border-[#2B3A4F] focus-within:border-[#E85D3F] shadow-sm transition-colors">
          <Search size={18} className="text-[#748092] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={localInput}
            onFocus={() => setShowHistory(true)}
            onBlur={() => window.setTimeout(() => setShowHistory(false), 180)}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Tra Hán tự, Pinyin (ni3 hao3 / nihao), Hán Việt, nghĩa Việt hoặc dán cả câu..."
            aria-label="Tìm kiếm từ điển tiếng Trung"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#243447] dark:text-white placeholder:text-[#94A3B8] focus:outline-none"
          />

          {localInput && (
            <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-lg text-[11px] font-bold shrink-0 ${typeMeta.badgeClass}`}>
              {typeMeta.label}
            </span>
          )}

          {localInput && (
            <button
              type="button"
              onClick={() => {
                setLocalInput('');
                inputRef.current?.focus();
              }}
              aria-label="Xóa từ khóa"
              className="p-1 rounded-lg hover:bg-[#FAF6F0] dark:hover:bg-[#0F172A] text-[#748092] cursor-pointer"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setAssistMode((m) => (m === 'handwriting' ? 'none' : 'handwriting'))
            }
            title="Bảng vẽ tay chữ Hán"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1 transition-colors shrink-0 ${
              assistMode === 'handwriting'
                ? 'bg-[#E85D3F] text-white'
                : 'bg-[#FAF6F0] dark:bg-[#0F172A] text-[#5B6B7F] dark:text-slate-300 hover:bg-[#EFE4D6]'
            }`}
          >
            <PenTool size={14} />
            <span className="hidden md:inline">Vẽ tay</span>
          </button>

          <button
            type="button"
            onClick={() => setAssistMode((m) => (m === 'radical' ? 'none' : 'radical'))}
            title="Tra theo 214 bộ thủ"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1 transition-colors shrink-0 ${
              assistMode === 'radical'
                ? 'bg-[#E85D3F] text-white'
                : 'bg-[#FAF6F0] dark:bg-[#0F172A] text-[#5B6B7F] dark:text-slate-300 hover:bg-[#EFE4D6]'
            }`}
          >
            <Grid size={14} />
            <span className="hidden md:inline">Bộ thủ</span>
          </button>

          <kbd className="hidden lg:inline-flex px-2 py-0.5 rounded-md bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[10px] font-bold text-[#748092]">
            Ctrl+K
          </kbd>
        </div>

        {/* Recent History Dropdown */}
        {showHistory && !localInput && history.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 z-30 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] shadow-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#748092] px-2">
              <span className="inline-flex items-center gap-1">
                <History size={13} />
                Lịch sử tra cứu gần đây
              </span>
              <span>Nhấn để tra lại</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {history.slice(0, 6).map((item) => (
                <button
                  key={`${item.query_text}-${item.searched_at}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLocalInput(item.query_text);
                    setShowHistory(false);
                  }}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-[#FAF6F0] dark:hover:bg-[#0F172A] text-left cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#243447] dark:text-white truncate">
                      {item.simplified || item.query_text}
                      {item.pinyin_display && (
                        <span className="ml-1.5 text-xs font-medium text-[#E85D3F]">
                          {item.pinyin_display}
                        </span>
                      )}
                    </div>
                    {item.meaning_vi && (
                      <div className="text-[11px] text-[#748092] truncate">
                        {item.meaning_vi}
                      </div>
                    )}
                  </div>
                  <Clock size={12} className="text-[#94A3B8] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HSK Quick Filter Pills + Latency */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onHskFilterChange(null)}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              hskFilter === null
                ? 'bg-[#243447] text-white dark:bg-[#E85D3F]'
                : 'bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300'
            }`}
          >
            Tất cả HSK
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onHskFilterChange(hskFilter === lvl ? null : lvl)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                hskFilter === lvl
                  ? 'bg-[#E85D3F] text-white'
                  : 'bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300 hover:border-[#E85D3F]'
              }`}
            >
              HSK {lvl}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-[#748092] dark:text-slate-400 font-medium">
          {isLoading ? 'Đang truy vấn...' : latencyMs > 0 ? `Truy vấn ${latencyMs}ms` : 'Sẵn sàng'}
        </div>
      </div>

      {/* Handwriting Canvas Mini-Pad */}
      {assistMode === 'handwriting' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 flex flex-col items-center gap-2">
            <canvas
              ref={canvasRef}
              width={220}
              height={180}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-[220px] h-[180px] rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-dashed border-[#E85D3F]/50 touch-none cursor-crosshair"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStrokes((prev) => prev.slice(0, -1))}
                className="px-3 py-1 rounded-lg bg-[#FAF6F0] dark:bg-[#0F172A] text-xs font-bold text-[#5B6B7F] cursor-pointer"
              >
                Hoàn tác nét
              </button>
              <button
                type="button"
                onClick={() => setStrokes([])}
                className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-xs font-bold text-rose-600 cursor-pointer inline-flex items-center gap-1"
              >
                <Eraser size={12} />
                Xóa bảng
              </button>
            </div>
          </div>

          <div className="md:col-span-7 space-y-2">
            <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#E85D3F]" />
              <span>Gợi ý chữ Hán theo số nét ({strokes.length} nét đã vẽ)</span>
            </div>
            {handwritingCandidates.length === 0 ? (
              <p className="text-xs text-[#748092]">
                Vẽ trực tiếp chữ Hán vào ô bên trái để nhận diện ứng viên theo số nét.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {handwritingCandidates.map((cand) => (
                  <button
                    key={cand.hanzi}
                    type="button"
                    onClick={() => appendCharToSearch(cand.hanzi)}
                    className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] hover:border-[#E85D3F] border border-[#EFE4D6] dark:border-[#2B3A4F] text-center cursor-pointer"
                  >
                    <div className="text-xl font-extrabold text-[#243447] dark:text-white">
                      {cand.hanzi}
                    </div>
                    <div className="text-[10px] text-[#E85D3F] font-semibold">
                      {cand.pinyin}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kangxi Radical Browser */}
      {assistMode === 'radical' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#243447] dark:text-white">
              Chọn bộ thủ Khang Hy để ghép từ khóa tra cứu
            </span>
            <select
              aria-label="Lọc bộ thủ theo số nét"
              value={String(radicalStrokeFilter)}
              onChange={(e) =>
                setRadicalStrokeFilter(
                  e.target.value === 'all' ? 'all' : Number(e.target.value)
                )
              }
              className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold"
            >
              <option value="all">Tất cả số nét</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  {s} nét
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 max-h-40 overflow-y-auto">
            {filteredRadicals.map((rad) => (
              <button
                key={rad.id}
                type="button"
                onClick={() => appendCharToSearch(rad.radical)}
                title={`${rad.radical} (${rad.hanViet}) - ${rad.meaning}`}
                className="p-1.5 rounded-lg bg-[#FAF6F0] dark:bg-[#0F172A] hover:bg-[#E85D3F] hover:text-white border border-[#EFE4D6] dark:border-[#2B3A4F] text-center cursor-pointer transition-colors"
              >
                <div className="text-base font-bold">{rad.radical}</div>
                <div className="text-[9px] truncate opacity-75">{rad.hanViet}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
