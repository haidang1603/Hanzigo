import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Search,
  Sparkles,
  PenTool,
  Mic,
  BookmarkPlus,
  Volume2,
} from 'lucide-react';
import { useUnifiedTools } from '../../core/ecosystem/UnifiedToolsContext.tsx';
import type { SourceContextPayload } from '../../types/unifiedEcosystem.types.ts';

interface FloatingPosition {
  top: number;
  left: number;
}

const HANZI_REGEX = /[\u4e00-\u9fa5]/;

/**
 * Tự động trích xuất cả câu tiếng Trung chứa cụm từ được bôi đen
 * để lưu làm câu ví dụ ngữ cảnh (Source Context Sentence)
 */
function extractSurroundingChineseSentence(selection: Selection): string {
  const anchorNode = selection.anchorNode;
  if (!anchorNode || !anchorNode.textContent) {
    return selection.toString().trim();
  }
  const fullBlockText = anchorNode.parentElement?.innerText || anchorNode.textContent;
  const selectedStr = selection.toString().trim();

  // Tách theo các dấu kết thúc câu tiếng Trung
  const sentences = fullBlockText
    .split(/(?<=[。！？!?；\n])/)
    .map((s) => s.trim())
    .filter(Boolean);

  const matchedSentence = sentences.find((s) => s.includes(selectedStr));
  return matchedSentence || selectedStr;
}

export const GlobalTextSelectionActionBar: React.FC = () => {
  const { openToolDrawer, quickSaveToVocabulary, speakChineseText } = useUnifiedTools();

  const [visible, setVisible] = useState(false);
  const [selectedHanzi, setSelectedHanzi] = useState('');
  const [contextSentence, setContextSentence] = useState('');
  const [position, setPosition] = useState<FloatingPosition>({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setVisible(false);
      return;
    }

    const rawText = selection.toString().trim();
    // Chỉ kích hoạt khi vùng chọn có ít nhất 1 chữ Hán và độ dài hợp lý (1 - 60 ký tự)
    if (!rawText || rawText.length > 60 || !HANZI_REGEX.test(rawText)) {
      setVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setVisible(false);
      return;
    }

    const surroundingSentence = extractSurroundingChineseSentence(selection);
    const toolbarWidth = 440;
    const clampedLeft = Math.max(
      16,
      Math.min(
        window.innerWidth - toolbarWidth - 16,
        rect.left + rect.width / 2 - toolbarWidth / 2
      )
    );
    const computedTop = rect.top > 68 ? rect.top - 54 : rect.bottom + 12;

    setSelectedHanzi(rawText);
    setContextSentence(surroundingSentence);
    setPosition({ top: computedTop, left: clampedLeft });
    setVisible(true);
  }, []);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
        return;
      }
      setTimeout(handleSelectionChange, 15);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyDown);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyDown);
    };
  }, [handleSelectionChange]);

  if (!visible || !selectedHanzi) return null;

  const currentContext: SourceContextPayload = {
    source_type: 'selection',
    sentence_zh: contextSentence,
  };

  return (
    <div
      ref={toolbarRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={(e) => e.preventDefault()} // Giữ nguyên vùng bôi đen khi bấm vào nút trên thanh
      className="fixed z-[105] flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-[#0a0a1f]/95 border border-[#00D4FF]/40 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,212,255,0.22)] text-slate-100 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Badge hiển thị chữ Hán đang chọn + Nút nghe nhanh */}
      <button
        type="button"
        onClick={() => speakChineseText(selectedHanzi, 0.9)}
        title="Nghe phát âm nhanh"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] hover:bg-[#00D4FF]/25 transition text-xs font-semibold max-w-[110px] truncate"
      >
        <Volume2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{selectedHanzi}</span>
      </button>

      <div className="h-4 w-[1px] bg-slate-700/80 mx-0.5" />

      {/* 1. Tra từ điển (27.01) */}
      <button
        type="button"
        onClick={() => {
          openToolDrawer('dictionary', selectedHanzi, currentContext);
          setVisible(false);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 hover:text-[#00D4FF] transition"
      >
        <Search className="w-3.5 h-3.5 text-[#00D4FF]" />
        <span>Tra từ</span>
      </button>

      {/* 2. Phân tích câu ngữ pháp (27.02) */}
      <button
        type="button"
        onClick={() => {
          openToolDrawer('grammar', selectedHanzi, currentContext);
          setVisible(false);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 hover:text-purple-300 transition"
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span>Ngữ pháp</span>
      </button>

      {/* 3. Tập viết chữ Hán (27.03) */}
      <button
        type="button"
        onClick={() => {
          openToolDrawer('writing', selectedHanzi, currentContext);
          setVisible(false);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 hover:text-amber-300 transition"
      >
        <PenTool className="w-3.5 h-3.5 text-amber-400" />
        <span>Tập viết</span>
      </button>

      {/* 4. Luyện phát âm & Biến điệu (27.07) */}
      <button
        type="button"
        onClick={() => {
          openToolDrawer('pronunciation', selectedHanzi, currentContext);
          setVisible(false);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 hover:text-emerald-300 transition"
      >
        <Mic className="w-3.5 h-3.5 text-emerald-400" />
        <span>Phát âm</span>
      </button>

      <div className="h-4 w-[1px] bg-slate-700/80 mx-0.5" />

      {/* 5. Lưu 1-Click vào Vocabulary Workspace (27.06) */}
      <button
        type="button"
        onClick={async () => {
          await quickSaveToVocabulary(selectedHanzi, currentContext);
          setVisible(false);
        }}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 transition text-xs font-semibold"
      >
        <BookmarkPlus className="w-3.5 h-3.5" />
        <span>Lưu từ</span>
      </button>
    </div>
  );
};
