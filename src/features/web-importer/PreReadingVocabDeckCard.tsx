import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import type { KeyVocabItem } from '../../services/articleImporterService.ts';

interface PreReadingVocabDeckCardProps {
  keyVocab: KeyVocabItem[];
  onSaveToDeck?: (words: string[]) => void;
}

export const PreReadingVocabDeckCard: React.FC<PreReadingVocabDeckCardProps> = ({
  keyVocab,
  onSaveToDeck,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [savedAll, setSavedAll] = useState(false);

  if (!keyVocab || keyVocab.length === 0) return null;

  const handleSaveAll = () => {
    setSavedAll(true);
    if (onSaveToDeck) {
      onSaveToDeck(keyVocab.map((k) => k.text));
    }
  };

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Từ vựng cốt lõi nên chuẩn bị trước ({keyVocab.length} từ)
            </h3>
            <p className="text-[11px] text-slate-500">
              Lướt qua trong 1 phút để đạt ngưỡng Comprehensible Input 90%+ khi đọc bài
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savedAll}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            {savedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Đã lưu thẻ</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-600" />
                <span>Lưu vào thẻ SRS</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grid of Key Vocab Pills */}
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1 animate-in fade-in">
          {keyVocab.map((item, idx) => (
            <div
              key={`${item.text}-${idx}`}
              className="rounded-2xl border border-white/80 bg-white p-3 shadow-xs space-y-1 hover:border-amber-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{item.text}</span>
                <button
                  type="button"
                  onClick={() => speakChinese(item.text, 0.85)}
                  className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold">{item.pinyin}</span>
                {item.hsk_level && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                    H{item.hsk_level}
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-500 line-clamp-1 italic">
                {item.meaning_vi}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

