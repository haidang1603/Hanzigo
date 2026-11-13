import React, { useState } from 'react';
import {
  Volume2,
  PenTool,
  BookmarkPlus,
  Check,
  BookOpen,
  Sparkles,
  AlertCircle,
  MessageSquareQuote,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  saveChengyuToSRS,
  type ChengyuEntry,
  type SentimentPolarity,
} from '../../services/chengyuCollocationService.ts';

interface ChengyuStoryCardProps {
  entry: ChengyuEntry;
  user?: any;
  onOpenWriting?: (hanzi: string) => void;
}

const SENTIMENT_BADGE_MAP: Record<
  SentimentPolarity,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dot: string;
    hint?: string;
  }
> = {
  positive_褒义: {
    label: 'Nghĩa tốt (褒义)',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200',
    dot: '🟢',
    hint: 'Dùng để khen ngợi, biểu dương hoặc mang sắc thái tích cực.',
  },
  neutral_中性: {
    label: 'Trung tính (中性)',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    dot: '🟡',
    hint: 'Dùng để mô tả khách quan tùy thuộc vào ngữ cảnh của câu.',
  },
  negative_贬义: {
    label: 'Nghĩa xấu / Chê (贬义)',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-800',
    borderClass: 'border-rose-200',
    dot: '🔴',
    hint: 'Cẩn trọng: Mang sắc thái phê phán hoặc chê trách, không dùng để khen!',
  },
};

export const ChengyuStoryCard: React.FC<ChengyuStoryCardProps> = ({
  entry,
  user,
  onOpenWriting,
}) => {
  const [hoveredCharIdx, setHoveredCharIdx] = useState<number | null>(0);
  const [savedToSrs, setSavedToSrs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showOriginStory, setShowOriginStory] = useState(true);

  const sentiment = SENTIMENT_BADGE_MAP[entry.sentiment_polarity] || SENTIMENT_BADGE_MAP.neutral_中性;
  const activeBreakdown =
    hoveredCharIdx !== null && entry.char_breakdown[hoveredCharIdx]
      ? entry.char_breakdown[hoveredCharIdx]
      : null;

  const handleSave = async () => {
    if (isSaving || savedToSrs) return;
    setIsSaving(true);
    try {
      await saveChengyuToSRS(entry, user);
      setSavedToSrs(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Top Header Strip */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 via-amber-50/40 to-emerald-50/30 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white">
            HSK {entry.hsk_level}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${sentiment.bgClass} ${sentiment.textClass} ${sentiment.borderClass}`}
            title={sentiment.hint}
          >
            <span>{sentiment.dot}</span>
            <span>{sentiment.label}</span>
          </span>
          <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">
            {entry.han_viet}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => speakChinese(entry.chengyu, 0.85)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition cursor-pointer shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Nghe phát âm</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={savedToSrs || isSaving}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer shadow-xs ${
              savedToSrs
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {savedToSrs ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{savedToSrs ? 'Đã lưu SRS' : 'Lưu vào SRS'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* 4 Calligraphy Character Tiles */}
        <div className="flex flex-col items-center space-y-3">
          <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-md">
            {Array.from(entry.chengyu).map((char, idx) => {
              const bd = entry.char_breakdown[idx];
              const isSelected = hoveredCharIdx === idx;
              return (
                <button
                  key={`${char}-${idx}`}
                  type="button"
                  onMouseEnter={() => setHoveredCharIdx(idx)}
                  onClick={() => {
                    setHoveredCharIdx(idx);
                    speakChinese(char, 0.8);
                  }}
                  className={`group relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 shadow-md -translate-y-0.5'
                      : 'border-slate-200 bg-[#fdfbf7] hover:border-amber-300'
                  }`}
                >
                  {/* Mi-grid calligraphy guide lines */}
                  <div className="absolute inset-2 border border-dashed border-amber-200/70 rounded-xl pointer-events-none" />
                  <span className="font-serif text-3xl sm:text-4xl font-black text-slate-900 leading-none relative z-10">
                    {char}
                  </span>
                  {bd?.pinyin && (
                    <span className="text-[11px] font-semibold text-emerald-700 mt-1.5 relative z-10">
                      {bd.pinyin}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-sm font-semibold text-emerald-700 tracking-wide">
            {entry.pinyin}
          </p>

          {/* Classical Character Meaning Interactive Bar */}
          {activeBreakdown && (
            <div className="w-full rounded-2xl bg-amber-50/70 border border-amber-200/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-serif font-black text-base flex items-center justify-center shrink-0">
                  {activeBreakdown.char}
                </span>
                <div>
                  <span className="font-bold text-slate-900">
                    {activeBreakdown.han_viet} ({activeBreakdown.pinyin})
                  </span>
                  <span className="text-slate-500 mx-1.5">•</span>
                  <span className="text-slate-700 font-medium">
                    Nghĩa Hán cổ: <strong className="text-amber-900">{activeBreakdown.classical_meaning_vi}</strong>
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-amber-700 font-medium">
                Di chuột / chạm từng chữ để xem nghĩa cổ
              </span>
            </div>
          )}
        </div>

        {/* Meanings & Vietnamese Equivalent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nghĩa đen & Nghĩa bóng
            </div>
            <p className="text-xs text-slate-600">
              <strong className="text-slate-800">Nghĩa đen:</strong> {entry.literal_meaning_vi}
            </p>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {entry.figurative_meaning_vi}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-4 space-y-2.5">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thành ngữ Việt tương đương & Ngữ pháp</span>
            </div>

            {entry.vietnamese_equivalent_idiom ? (
              <p className="text-sm font-bold text-emerald-900">
                ⇄ “{entry.vietnamese_equivalent_idiom}”
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">Không có thành ngữ thuần Việt đồng nhất 1:1</p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500">Chức năng câu:</span>
              {entry.syntactic_function.map((fn) => (
                <span
                  key={fn}
                  className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[11px] font-bold text-emerald-700"
                >
                  {fn}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment Usage Warning for Negative Polarity */}
        {entry.sentiment_polarity === 'negative_贬义' && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-2.5 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý sắc thái (贬义):</strong> {sentiment.hint}
            </span>
          </div>
        )}

        {/* Origin Story Section */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOriginStory((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/70 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Điển tích thành ngữ & Xuất xứ lịch sử
            </span>
            <span className="text-slate-400">{showOriginStory ? 'Thu gọn' : 'Mở rộng'}</span>
          </button>
          {showOriginStory && (
            <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60">
              {entry.origin_story_vi}
            </div>
          )}
        </div>

        {/* Usage Examples */}
        {entry.examples && entry.examples.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-600" />
              Ví dụ thực tế trong câu:
            </span>
            {entry.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">{ex.zh}</p>
                  <p className="text-xs text-emerald-700 font-medium">{ex.pinyin}</p>
                  <p className="text-xs text-slate-600 italic">{ex.vi}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakChinese(ex.zh, 0.85)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 shrink-0 cursor-pointer"
                  title="Nghe câu ví dụ"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Action: Practice Writing all 4 Characters */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Thực hành viết chuẩn thứ tự nét cả 4 chữ trong câu thành ngữ
          </span>
          <button
            type="button"
            onClick={() => {
              if (onOpenWriting) {
                onOpenWriting(entry.chengyu);
              }
            }}
            disabled={!onOpenWriting}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-sm disabled:opacity-50 transition cursor-pointer"
          >
            <PenTool className="w-4 h-4 text-amber-400" />
            <span>Luyện viết cả 4 chữ này</span>
          </button>
        </div>
      </div>
    </div>
  );
};

