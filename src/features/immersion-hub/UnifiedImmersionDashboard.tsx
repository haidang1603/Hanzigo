import React, { useState, useEffect } from 'react';
import {
  Pickaxe,
  Sparkles,
  Volume2,
  Check,
  Compass,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  scanEcosystemForImmersionRecommendations,
  listMinedSentenceCards,
  mineSentenceToMultimediaCard,
  type AnalyzedSentenceResult,
  type RecommendedImmersionChannel,
  type MinedSentenceCard,
} from '../../services/sentenceMiningEngine.ts';
import { MultimediaClozeFlashcard } from './MultimediaClozeFlashcard.tsx';

interface UnifiedImmersionDashboardProps {
  user?: any;
  onNavigateTab?: (tabId: string) => void;
  onOpenDictionary?: (term: string) => void;
  onOpenPronunciation?: (text: string, pinyin?: string) => void;
}

export const UnifiedImmersionDashboard: React.FC<UnifiedImmersionDashboardProps> = ({
  user,
  onNavigateTab,
  onOpenDictionary,
  onOpenPronunciation,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [knownCount, setKnownCount] = useState(0);
  const [channels, setChannels] = useState<RecommendedImmersionChannel[]>([]);
  const [goldenQueue, setGoldenQueue] = useState<AnalyzedSentenceResult[]>([]);
  const [minedCards, setMinedCards] = useState<MinedSentenceCard[]>([]);
  const [minedSet, setMinedSet] = useState<Set<string>>(() => new Set());
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [activeView, setActiveView] = useState<'queue' | 'review'>('queue');

  const runScan = async () => {
    setIsScanning(true);
    try {
      const [scanRes, savedCards] = await Promise.all([
        scanEcosystemForImmersionRecommendations(user),
        listMinedSentenceCards(user),
      ]);
      setKnownCount(scanRes.knownWordsCount);
      setChannels(scanRes.recommendedChannels);
      setGoldenQueue(scanRes.goldenQueue);
      setMinedCards(savedCards);
      setMinedSet(new Set(savedCards.map((c) => c.sentence_zh)));
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    runScan();
  }, [user]);

  const handleMineSentence = async (analyzed: AnalyzedSentenceResult) => {
    const newCard = await mineSentenceToMultimediaCard({ analyzed, user });
    setMinedCards((prev) => [newCard, ...prev.filter((c) => c.sentence_zh !== newCard.sentence_zh)]);
    setMinedSet((prev) => new Set(prev).add(newCard.sentence_zh));
  };

  const activeReviewCard = minedCards[activeCardIdx] || minedCards[0] || null;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Immersion Hub Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Comprehensible Input (i+1) · Sentence Mining
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Unified Immersion Hub &amp; Đào câu Ngữ cảnh (i+1)
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Tự động quét qua Video, Báo chí, OCR, Truyện đọc &amp; Giáo trình để tìm những câu chứa đúng 1 từ mới (+1) trên nền tảng từ vựng bạn đã thuộc (i).
            </p>
          </div>

          <button
            type="button"
            onClick={runScan}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-white text-slate-900 font-bold px-4 py-2.5 text-xs shadow-md hover:bg-amber-50 transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Quét lại hệ sinh thái</span>
          </button>
        </div>

        {/* Stats & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/20">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="bg-white/15 px-3 py-1.5 rounded-xl">
              Vốn từ đã biết (i): {knownCount} từ
            </span>
            <span className="bg-white/15 px-3 py-1.5 rounded-xl">
              Câu vàng i+1 tìm thấy: {goldenQueue.length} câu
            </span>
            <span className="bg-white/15 px-3 py-1.5 rounded-xl">
              Thẻ Cloze đã đào: {minedCards.length} thẻ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('queue')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === 'queue'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              ⛏️ Hàng đợi Câu vàng i+1
            </button>
            <button
              type="button"
              onClick={() => setActiveView('review')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === 'review'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              🎴 Ôn thẻ Cloze ({minedCards.length})
            </button>
          </div>
        </div>
      </div>

      {activeView === 'queue' ? (
        <div className="space-y-6">
          {/* Recommended Immersion Channels Today */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Kênh Immersion đề xuất hôm nay (Độ phủ từ vựng tối ưu 85%–96%)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {channels.slice(0, 6).map((ch) => (
                <div
                  key={`${ch.source_module}-${ch.source_id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-500">
                        {ch.subtitle}
                      </span>
                      <span
                        className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                          ch.coverage_pct >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Độ phủ {ch.coverage_pct}%
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 line-clamp-2">
                      {ch.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="font-bold text-amber-700">
                      ✨ {ch.i_plus_one_count} câu vàng i+1
                    </span>
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab(ch.target_route_tab)}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        <span>Mở học</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Golden i+1 Sentence Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Hàng đợi Câu vàng i+1 (Golden Sentence Queue)</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Mỗi câu chỉ chứa đúng 1 từ mới cần học
              </span>
            </div>

            {goldenQueue.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                {isScanning
                  ? 'Đang phân tích câu i+1 từ toàn bộ hệ sinh thái...'
                  : 'Chưa phát hiện thêm câu i+1 nào mới. Hãy nạp thêm bài báo hoặc video để quét!'}
              </div>
            ) : (
              <div className="space-y-3">
                {goldenQueue.slice(0, 15).map((item, idx) => {
                  const isMined = minedSet.has(item.candidate.sentence_zh);
                  return (
                    <div
                      key={`${item.candidate.media_context.source_id}-${idx}`}
                      className="rounded-2xl border-2 border-amber-300/80 bg-gradient-to-r from-amber-50/50 via-white to-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 font-black">
                            Từ mới (+1): {item.target_word}
                            {item.target_pinyin ? ` (${item.target_pinyin})` : ''}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {item.comprehensibility_ratio}% đã hiểu
                          </span>
                          <span className="text-slate-500 font-medium">
                            Nguồn: {item.candidate.media_context.source_title}
                          </span>
                        </div>

                        <p className="text-base font-black text-slate-900 leading-snug">
                          {item.candidate.sentence_zh}
                        </p>
                        {item.candidate.sentence_pinyin && (
                          <p className="text-xs text-emerald-700 font-medium">
                            {item.candidate.sentence_pinyin}
                          </p>
                        )}
                        {item.candidate.sentence_vi && (
                          <p className="text-xs text-slate-500 italic">
                            {item.candidate.sentence_vi}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => speakChinese(item.candidate.sentence_zh, 0.85)}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 cursor-pointer"
                          title="Nghe câu này"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          disabled={isMined}
                          onClick={() => handleMineSentence(item)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer ${
                            isMined
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                          }`}
                        >
                          {isMined ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã đào thẻ</span>
                            </>
                          ) : (
                            <>
                              <Pickaxe className="w-3.5 h-3.5" />
                              <span>Đào câu này (Mine i+1)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* REVIEW MINED MULTIMEDIA CLOZE CARDS */
        <div className="space-y-4">
          {minedCards.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700">
                Bạn chưa đào thẻ câu ngữ cảnh i+1 nào.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('queue')}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 text-xs cursor-pointer"
              >
                Quay lại Hàng đợi Câu vàng để đào thẻ
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>
                  Thẻ {activeCardIdx + 1} / {minedCards.length}
                </span>
                <div className="flex items-center gap-2">
                  {minedCards.slice(0, 8).map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCardIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer ${
                        idx === activeCardIdx
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {c.target_word}
                    </button>
                  ))}
                </div>
              </div>

              {activeReviewCard && (
                <MultimediaClozeFlashcard
                  key={activeReviewCard.id}
                  card={activeReviewCard}
                  onOpenDictionary={onOpenDictionary}
                  onOpenPronunciation={onOpenPronunciation}
                  onNextCard={() =>
                    setActiveCardIdx((prev) => (prev + 1) % minedCards.length)
                  }
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

