import React, { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react';
import {
  Search,
  Sparkles,
  PenTool,
  Mic,
  BookmarkPlus,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUnifiedTools } from '../../core/ecosystem/UnifiedToolsContext.tsx';
import {
  extractContextSentenceFromDomSelection,
  cancelActiveSelectionRequest,
  MAX_SELECTION_LENGTH,
} from '../../utils/selectionTextUtils.js';
import type { SourceContextPayload } from '../../types/unifiedEcosystem.types.ts';

const SelectionAiPopover = lazy(() => import('./SelectionAiPopover.jsx'));

interface FloatingPosition {
  top: number;
  left: number;
}

interface AnchorRectSnapshot {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

type PopoverTab = 'dictionary' | 'grammar' | 'pronunciation';

const HANZI_REGEX = /[\u4e00-\u9fa5]/;

export function shouldBlockSelectionToolbarForExam(isActiveExamSession: boolean): boolean {
  return Boolean(isActiveExamSession);
}

export const GlobalTextSelectionActionBar: React.FC = () => {
  const { user } = useAuth();
  const {
    openToolDrawer,
    quickSaveToVocabulary,
    speakChineseText,
    isActiveExamSession,
  } = useUnifiedTools();

  const examLocked = shouldBlockSelectionToolbarForExam(isActiveExamSession);

  const [visible, setVisible] = useState(false);
  const [selectedHanzi, setSelectedHanzi] = useState('');
  const [contextSentence, setContextSentence] = useState('');
  const [position, setPosition] = useState<FloatingPosition>({ top: 0, left: 0 });
  const [anchorRect, setAnchorRect] = useState<AnchorRectSnapshot | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverTab, setPopoverTab] = useState<PopoverTab>('dictionary');

  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const selectionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (examLocked) {
      cancelActiveSelectionRequest();
      setVisible(false);
      setPopoverOpen(false);
    }
  }, [examLocked]);

  const handleSelectionChange = useCallback(() => {
    if (examLocked) {
      setVisible(false);
      setPopoverOpen(false);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setVisible(false);
      return;
    }

    const rawText = selection.toString().trim();
    if (!rawText || rawText.length > MAX_SELECTION_LENGTH || !HANZI_REGEX.test(rawText)) {
      setVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setVisible(false);
      return;
    }

    const surroundingSentence = extractContextSentenceFromDomSelection(selection) || rawText;
    const maxToolbarWidth = Math.min(440, window.innerWidth - 24);
    const clampedLeft = Math.max(
      12,
      Math.min(
        window.innerWidth - maxToolbarWidth - 12,
        rect.left + rect.width / 2 - maxToolbarWidth / 2
      )
    );
    const rawComputedTop = rect.top > 68 ? rect.top - 54 : rect.bottom + 12;
    const computedTop = Math.max(
      12,
      Math.min(window.innerHeight - 64, rawComputedTop)
    );

    cancelActiveSelectionRequest();
    setSelectedHanzi(rawText);
    setContextSentence(surroundingSentence);
    setAnchorRect({
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
    });
    setPosition({ top: computedTop, left: clampedLeft });
    setPopoverOpen(false);
    setVisible(true);
  }, [examLocked]);

  useEffect(() => {
    const onPointerRelease = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (toolbarRef.current && toolbarRef.current.contains(target)) {
        return;
      }
      if (target?.closest?.('[role="dialog"]')) {
        return;
      }
      if (selectionTimeoutRef.current !== null) {
        window.clearTimeout(selectionTimeoutRef.current);
      }
      selectionTimeoutRef.current = window.setTimeout(() => {
        selectionTimeoutRef.current = null;
        handleSelectionChange();
      }, 25);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelActiveSelectionRequest();
        setVisible(false);
        setPopoverOpen(false);
      }
    };

    document.addEventListener('mouseup', onPointerRelease);
    document.addEventListener('touchend', onPointerRelease, { passive: true });
    document.addEventListener('keyup', onKeyDown);
    return () => {
      if (selectionTimeoutRef.current !== null) {
        window.clearTimeout(selectionTimeoutRef.current);
        selectionTimeoutRef.current = null;
      }
      document.removeEventListener('mouseup', onPointerRelease);
      document.removeEventListener('touchend', onPointerRelease);
      document.removeEventListener('keyup', onKeyDown);
    };
  }, [handleSelectionChange]);

  if (examLocked) return null;

  const openAiPopover = (tab: PopoverTab) => {
    setPopoverTab(tab);
    setPopoverOpen(true);
    setVisible(false);
  };

  const currentContext: SourceContextPayload = {
    source_type: 'selection',
    sentence_zh: contextSentence,
  };

  return (
    <>
      {visible && selectedHanzi && (
        <div
          ref={toolbarRef}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onMouseDown={(e) => e.preventDefault()}
          className="fixed z-[105] max-w-[calc(100vw-24px)] overflow-x-auto flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-[#0a0a1f]/95 border border-[#00D4FF]/40 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,212,255,0.22)] text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* 1. Nghe */}
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

          {/* 2. Tra từ -> Mở Tab Tra từ trong SelectionAiPopover */}
          <button
            type="button"
            onClick={() => openAiPopover('dictionary')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 hover:text-[#00D4FF] transition"
          >
            <Search className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Tra từ</span>
          </button>

          {/* 3. Ngữ pháp -> Mở Tab Ngữ pháp AI trong SelectionAiPopover */}
          <button
            type="button"
            onClick={() => openAiPopover('grammar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 hover:text-purple-300 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Ngữ pháp</span>
          </button>

          {/* 4. Tập viết -> Giữ nguyên UniversalSlideOverDrawer */}
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

          {/* 5. Phát âm -> Mở Tab Phát âm AI (/api/ai/pronunciation) */}
          <button
            type="button"
            onClick={() => openAiPopover('pronunciation')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 hover:text-emerald-300 transition"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phát âm</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-700/80 mx-0.5" />

          {/* 6. Lưu từ -> Giữ nguyên Lưu 1-Click */}
          <button
            type="button"
            disabled={isSaving}
            onClick={async () => {
              if (isSaving) return;
              setIsSaving(true);
              try {
                await quickSaveToVocabulary(selectedHanzi, currentContext);
                setVisible(false);
              } finally {
                setIsSaving(false);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-60 transition text-xs font-semibold"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu từ'}</span>
          </button>
        </div>
      )}

      {popoverOpen && selectedHanzi && (
        <Suspense fallback={null}>
          <SelectionAiPopover
            isOpen={popoverOpen}
            activeTab={popoverTab}
            onTabChange={setPopoverTab}
            onClose={() => {
              cancelActiveSelectionRequest();
              setPopoverOpen(false);
            }}
            selectedText={selectedHanzi}
            contextSentence={contextSentence}
            anchorRect={anchorRect}
            user={user}
            onSpeak={speakChineseText}
            onQuickSaveVocab={quickSaveToVocabulary}
          />
        </Suspense>
      )}
    </>
  );
};
