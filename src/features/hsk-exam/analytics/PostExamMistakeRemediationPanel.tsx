import React, { useMemo, useState } from 'react';
import { BookMarked, CheckCircle2, Compass, Layers, Sparkles } from 'lucide-react';
import {
  extractRemediationFromMistakes,
  pushMistakeVocabToWorkspaceDeck,
  type MistakeQuestionLike,
} from './hskMistakeRemediationService.ts';

interface PostExamMistakeRemediationPanelProps {
  mistakes: MistakeQuestionLike[];
  paperCode?: string;
  user?: { id?: string | null } | null;
  onOpenGrammarExplorer?: (grammarCode: string) => void;
}

export const PostExamMistakeRemediationPanel: React.FC<
  PostExamMistakeRemediationPanelProps
> = ({ mistakes, paperCode = 'HSK-CBT', user, onOpenGrammarExplorer }) => {
  const [pushing, setPushing] = useState(false);
  const [pushedInfo, setPushedInfo] = useState<string | null>(null);

  const summary = useMemo(
    () => extractRemediationFromMistakes(mistakes, paperCode),
    [mistakes, paperCode]
  );

  if (summary.totalMistakes === 0) return null;

  const handlePushDeck = async () => {
    if (pushing || summary.vocabWords.length === 0) return;
    setPushing(true);
    try {
      const res = await pushMistakeVocabToWorkspaceDeck({
        paperCode: summary.paperCode,
        vocabWords: summary.vocabWords,
        user,
      });
      setPushedInfo(
        `Đã đẩy ${res.pushedCount} từ vựng vào Deck "${res.deck.name}" tại Vocabulary Workspace!`
      );
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">
              Khắc phục lỗ hổng sau thi ({summary.totalMistakes} câu sai)
            </h4>
            <p className="text-xs text-slate-500">
              Tự động trích xuất từ vựng & điểm ngữ pháp cần ôn từ các câu trả lời chưa đúng.
            </p>
          </div>
        </div>

        {summary.vocabWords.length > 0 && (
          <button
            type="button"
            disabled={pushing || Boolean(pushedInfo)}
            onClick={() => void handlePushDeck()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 px-4 py-2 text-xs font-bold text-white cursor-pointer transition"
          >
            {pushedInfo ? <CheckCircle2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            {pushedInfo
              ? 'Đã đẩy vào Vocabulary Workspace'
              : `Đẩy ${summary.vocabWords.length} từ sai vào Deck`}
          </button>
        )}
      </div>

      {pushedInfo && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800">
          {pushedInfo}
        </div>
      )}

      {/* Target Vocab */}
      {summary.vocabWords.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BookMarked className="w-3.5 h-3.5 text-amber-600" />
            Từ vựng trích xuất từ câu sai:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.vocabWords.map((w) => (
              <span
                key={w}
                className="rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Target Grammar Codes */}
      {summary.grammarSuggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            Ngữ pháp cần ôn lại (Grammar Explorer):
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.grammarSuggestions.map((g) => (
              <button
                key={g.code}
                type="button"
                onClick={() => onOpenGrammarExplorer?.(g.code)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-800 cursor-pointer transition"
              >
                <span>{g.titleVi}</span>
                <span className="text-[11px] text-indigo-500">
                  (Câu {g.questionNumbers.join(', ')})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
