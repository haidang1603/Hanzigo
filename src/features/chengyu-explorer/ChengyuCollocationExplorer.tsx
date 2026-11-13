import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  GitBranch,
  Trophy,
  BookOpen,
  Filter,
  X,
} from 'lucide-react';
import {
  listChengyuEntries,
  listCollocationHubs,
  searchChengyuEntries,
  searchCollocationHubs,
  type ChengyuEntry,
  type WordCollocationHub,
  type ChengyuTopic,
  type SentimentPolarity,
} from '../../services/chengyuCollocationService.ts';
import { ChengyuStoryCard } from './ChengyuStoryCard.tsx';
import { CollocationMindmapVisualizer } from './CollocationMindmapVisualizer.tsx';
import { ChengyuSolitaireGame } from './ChengyuSolitaireGame.tsx';

interface ChengyuCollocationExplorerProps {
  user?: any;
  onOpenWriting?: (hanzi: string) => void;
}

type ExplorerTab = 'chengyu' | 'collocations' | 'solitaire';

const TOPIC_OPTIONS: { id: ChengyuTopic; label: string }[] = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'study', label: 'Học tập' },
  { id: 'work', label: 'Công việc' },
  { id: 'wisdom', label: 'Trí tuệ' },
  { id: 'emotion', label: 'Cảm xúc' },
  { id: 'lifestyle', label: 'Ứng xử' },
  { id: 'time', label: 'Thời gian' },
];

const SENTIMENT_OPTIONS: { id: SentimentPolarity | 'all'; label: string }[] = [
  { id: 'all', label: 'Mọi sắc thái' },
  { id: 'positive_褒义', label: '🟢 Nghĩa tốt (褒义)' },
  { id: 'neutral_中性', label: '🟡 Trung tính (中性)' },
  { id: 'negative_贬义', label: '🔴 Nghĩa xấu (贬义)' },
];

const PATTERN_PRESETS = ['一_二_', '半_半_', '_心_意', '水_石_'];

export const ChengyuCollocationExplorer: React.FC<ChengyuCollocationExplorerProps> = ({
  user,
  onOpenWriting,
}) => {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('chengyu');

  // Chengyu State
  const [chengyuEntries, setChengyuEntries] = useState<ChengyuEntry[]>([]);
  const [chengyuQuery, setChengyuQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<ChengyuTopic>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentPolarity | 'all'>('all');
  const [selectedChengyuId, setSelectedChengyuId] = useState<string | null>(null);

  // Collocation State
  const [collocationHubs, setCollocationHubs] = useState<WordCollocationHub[]>([]);
  const [collocationQuery, setCollocationQuery] = useState('');
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listChengyuEntries().then((items) => {
      if (!mounted) return;
      setChengyuEntries(items);
      if (items.length > 0) {
        setSelectedChengyuId((cur) => cur || items[0].id);
      }
    });
    listCollocationHubs().then((hubs) => {
      if (!mounted) return;
      setCollocationHubs(hubs);
      if (hubs.length > 0) {
        setSelectedHubId((cur) => cur || hubs[0].id);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredChengyu = useMemo(() => {
    return searchChengyuEntries(chengyuEntries, {
      query: chengyuQuery,
      topic: selectedTopic,
      sentiment: selectedSentiment,
    });
  }, [chengyuEntries, chengyuQuery, selectedTopic, selectedSentiment]);

  const activeChengyu = useMemo(() => {
    return (
      filteredChengyu.find((e) => e.id === selectedChengyuId) ||
      filteredChengyu[0] ||
      null
    );
  }, [filteredChengyu, selectedChengyuId]);

  const filteredHubs = useMemo(() => {
    return searchCollocationHubs(collocationHubs, collocationQuery);
  }, [collocationHubs, collocationQuery]);

  const activeHub = useMemo(() => {
    return filteredHubs.find((h) => h.id === selectedHubId) || filteredHubs[0] || null;
  }, [filteredHubs, selectedHubId]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Studio Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Chengyu & Collocation Explorer
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Thành ngữ 4 chữ (成语) & Kết hợp từ cố định (词语搭配)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Khám phá nghĩa Hán cổ từng chữ, sắc thái khen/chê, điển tích lịch sử và tránh lỗi dịch từng chữ Việt–Trung khi nói và viết HSK cao cấp.
            </p>
          </div>
        </div>

        {/* Sub-mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab('chengyu')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'chengyu'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Thành ngữ 4 chữ ({chengyuEntries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collocations')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'collocations'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Sơ đồ Kết hợp từ ({collocationHubs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('solitaire')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'solitaire'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Game Nối đuôi Thành ngữ (成语接龙)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHENGYU EXPLORER */}
      {activeTab === 'chengyu' && (
        <div className="space-y-5">
          {/* Pattern Search & Filter Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={chengyuQuery}
                  onChange={(e) => setChengyuQuery(e.target.value)}
                  placeholder='Tìm theo mẫu (VD: "一_二_", "半_半_", "_心_意"), Hán-Việt hoặc thành ngữ Việt...'
                  className="w-full rounded-2xl border border-slate-200 pl-10 pr-9 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {chengyuQuery && (
                  <button
                    type="button"
                    onClick={() => setChengyuQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value as ChengyuTopic)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {TOPIC_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSentiment}
                  onChange={(e) =>
                    setSelectedSentiment(e.target.value as SentimentPolarity | 'all')
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SENTIMENT_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Pattern Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Mẫu tìm nhanh:
              </span>
              {PATTERN_PRESETS.map((pat) => (
                <button
                  key={pat}
                  type="button"
                  onClick={() => setChengyuQuery(pat)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold border transition cursor-pointer ${
                    chengyuQuery === pat
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>

          {/* Master-Detail Layout */}
          {filteredChengyu.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">
                Không tìm thấy thành ngữ phù hợp với bộ lọc hiện tại.
              </p>
              <button
                type="button"
                onClick={() => {
                  setChengyuQuery('');
                  setSelectedTopic('all');
                  setSelectedSentiment('all');
                }}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Xóa bộ lọc để xem toàn bộ thành ngữ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* List Selector */}
              <div className="lg:col-span-4 space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
                {filteredChengyu.map((item) => {
                  const isActive = activeChengyu?.id === item.id;
                  const dot =
                    item.sentiment_polarity === 'positive_褒义'
                      ? '🟢'
                      : item.sentiment_polarity === 'negative_贬义'
                        ? '🔴'
                        : '🟡';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedChengyuId(item.id)}
                      className={`w-full text-left rounded-2xl border p-3.5 transition-all cursor-pointer ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-lg font-black text-slate-900 tracking-wider">
                          {item.chengyu}
                        </span>
                        <span className="text-xs">{dot}</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-700">{item.pinyin}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.vietnamese_equivalent_idiom || item.figurative_meaning_vi}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Detail Story Card */}
              <div className="lg:col-span-8">
                {activeChengyu && (
                  <ChengyuStoryCard
                    entry={activeChengyu}
                    user={user}
                    onOpenWriting={onOpenWriting}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COLLOCATION MINDMAP */}
      {activeTab === 'collocations' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={collocationQuery}
                onChange={(e) => setCollocationQuery(e.target.value)}
                placeholder="Tìm từ trung tâm hoặc cụm từ kết hợp (VD: 提高, 水平, thói quen)..."
                className="w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {filteredHubs.map((hub) => {
                const isSelected = activeHub?.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHubId(hub.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {hub.core_word}
                  </button>
                );
              })}
            </div>
          </div>

          {activeHub ? (
            <CollocationMindmapVisualizer hub={activeHub} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              Không tìm thấy sơ đồ kết hợp từ phù hợp.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHENGYU SOLITAIRE GAME */}
      {activeTab === 'solitaire' && <ChengyuSolitaireGame entries={chengyuEntries} />}
    </div>
  );
};

