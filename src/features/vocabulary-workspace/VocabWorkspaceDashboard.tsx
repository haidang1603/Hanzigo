import React, { useMemo, useState } from 'react';
import {
  Brain,
  FolderPlus,
  Flame,
  AlertTriangle,
  Play,
  Tag,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  computeWorkspaceStats,
  isVocabItemMastered,
  type ReviewModalMode,
  type UserVocabItem,
  type VocabDeck,
} from '../../services/vocabWorkspaceService.ts';

interface VocabWorkspaceDashboardProps {
  decks: VocabDeck[];
  items: UserVocabItem[];
  onCreateDeck: (name: string, description: string, colorHex: string) => Promise<void>;
  onStartReview: (targetItems: UserVocabItem[], mode: 'mixed' | ReviewModalMode) => void;
  onMarkMastered?: (itemId: string) => void;
}

export const VocabWorkspaceDashboard: React.FC<VocabWorkspaceDashboardProps> = ({
  decks,
  items,
  onCreateDeck,
  onStartReview,
  onMarkMastered,
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [selectedHsk, setSelectedHsk] = useState<number | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyLeeches, setOnlyLeeches] = useState(false);
  const [hideMastered, setHideMastered] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewMode, setReviewMode] = useState<'mixed' | ReviewModalMode>('mixed');

  const [showNewDeck, setShowNewDeck] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');
  const [deckColor, setDeckColor] = useState('#10b981');

  const stats = useMemo(() => computeWorkspaceStats(items), [items]);
  const maxForecast = Math.max(1, ...stats.forecast7Days.map((d) => d.count));

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((it) => it.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (hideMastered && isVocabItemMastered(item)) return false;
      if (selectedDeckId !== 'all' && item.deck_id !== selectedDeckId) return false;
      if (selectedHsk !== 'all' && item.hsk_level !== selectedHsk) return false;
      if (selectedTag !== 'all' && !item.tags.includes(selectedTag)) return false;
      if (onlyLeeches && item.lapses < 3) return false;
      if (q) {
        const hay = `${item.simplified} ${item.pinyin} ${item.meaning_vi} ${item.han_viet}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, hideMastered, selectedDeckId, selectedHsk, selectedTag, onlyLeeches, searchQuery]);

  const handleCreateDeckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckName.trim()) return;
    await onCreateDeck(deckName, deckDesc, deckColor);
    setDeckName('');
    setDeckDesc('');
    setShowNewDeck(false);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <div className="text-xs font-semibold text-emerald-800">Cần ôn hôm nay</div>
          <div className="text-2xl font-bold text-emerald-950 mt-1">{stats.dueToday}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Ưu tiên hàng đợi SRS</div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
          <div className="text-xs font-semibold text-sky-800">Từ mới (New)</div>
          <div className="text-2xl font-bold text-sky-950 mt-1">{stats.newCount}</div>
          <div className="text-[11px] text-sky-700 mt-0.5">Chưa bắt đầu lặp lại</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="text-xs font-semibold text-amber-800">Đang học (Learning)</div>
          <div className="text-2xl font-bold text-amber-950 mt-1">{stats.learningCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Đang củng cố trí nhớ</div>
        </div>
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
          <div className="text-xs font-semibold text-indigo-800">Đã thành thạo</div>
          <div className="text-2xl font-bold text-indigo-950 mt-1">{stats.masteredCount}</div>
          <div className="text-[11px] text-indigo-700 mt-0.5">Chu kỳ ôn ≥ 7 ngày</div>
        </div>
      </div>

      {/* 7-Day Forecast & Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Dự báo khối lượng ôn tập 7 ngày tới
            </h3>
            <span className="text-xs text-slate-500">{items.length} từ trong kho</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-28 pt-3">
            {stats.forecast7Days.map((day) => {
              const heightPct = Math.max(12, Math.round((day.count / maxForecast) * 100));
              return (
                <div key={day.dateLabel} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[11px] font-bold text-slate-700">{day.count}</span>
                  <div
                    className="w-full max-w-[36px] rounded-t-lg bg-emerald-500/85 transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-slate-500">{day.dateLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-600" />
              Bắt đầu phiên ôn tập đa chiều
            </h3>
            <select
              value={reviewMode}
              onChange={(e) => setReviewMode(e.target.value as 'mixed' | ReviewModalMode)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="mixed">Kết hợp thông minh (Thẻ + Nghe + Ngữ cảnh)</option>
              <option value="flashcard">Chỉ lật thẻ 3D (Flashcard)</option>
              <option value="audio_choice">Nghe Audio chọn từ đúng</option>
              <option value="context_cloze">Điền từ vào câu ngữ cảnh đã lưu</option>
            </select>
          </div>

          <button
            type="button"
            disabled={filteredItems.length === 0}
            onClick={() => onStartReview(filteredItems, reviewMode)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 px-4 py-3 text-sm font-semibold text-white transition"
          >
            <Play className="w-4 h-4" />
            Ôn tập ngay ({filteredItems.length} từ)
          </button>
        </div>
      </div>

      {/* Decks + Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Bộ từ (Decks) &amp; Bộ lọc thông minh</h3>
          <button
            type="button"
            onClick={() => setShowNewDeck((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FolderPlus className="w-3.5 h-3.5 text-emerald-600" />
            Tạo Deck mới
          </button>
        </div>

        {showNewDeck && (
          <form
            onSubmit={handleCreateDeckSubmit}
            className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 grid grid-cols-1 sm:grid-cols-4 gap-2"
          >
            <input
              type="text"
              required
              placeholder="Tên Deck..."
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
            />
            <input
              type="text"
              placeholder="Mô tả ngắn..."
              value={deckDesc}
              onChange={(e) => setDeckDesc(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs sm:col-span-2"
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={deckColor}
                onChange={(e) => setDeckColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <button
                type="submit"
                className="flex-1 rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold"
              >
                Lưu Deck
              </button>
            </div>
          </form>
        )}

        {/* Deck Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedDeckId('all')}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              selectedDeckId === 'all'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            Tất cả Decks ({items.length})
          </button>
          {decks.map((dk) => {
            const count = items.filter((i) => i.deck_id === dk.id).length;
            const active = selectedDeckId === dk.id;
            return (
              <button
                key={dk.id}
                type="button"
                onClick={() => setSelectedDeckId(dk.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: dk.color_hex }}
                />
                {dk.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search, HSK, Tag, Leech Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm Chữ Hán, Pinyin, nghĩa..."
              className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
            />
          </div>

          <select
            value={selectedHsk}
            onChange={(e) =>
              setSelectedHsk(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700"
          >
            <option value="all">Mọi cấp HSK</option>
            {[1, 2, 3, 4, 5, 6].map((lvl) => (
              <option key={lvl} value={lvl}>
                HSK {lvl}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700"
          >
            <option value="all">Mọi Tag</option>
            {allTags.map((tg) => (
              <option key={tg} value={tg}>
                #{tg}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOnlyLeeches((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              onlyLeeches
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Từ hay quên ({stats.leechCount})
          </button>

          <button
            type="button"
            onClick={() => setHideMastered((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              hideMastered
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {hideMastered ? 'Đang ẩn từ đã thuộc' : 'Hiện cả từ đã thuộc'} ({stats.masteredCount})
          </button>
        </div>

        {/* Vocabulary List */}
        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div key={item.id} className="py-3 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-bold text-slate-900">{item.simplified}</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {item.pinyin}
                  </span>
                  {item.han_viet && (
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      {item.han_viet}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                    HSK {item.hsk_level}
                  </span>
                  {item.lapses >= 3 && (
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                      Hay quên ({item.lapses}x)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700">{item.meaning_vi}</p>
                {item.personal_mnemonic && (
                  <p className="text-[11px] text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Mẹo nhớ: {item.personal_mnemonic}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {item.tags.map((t) => (
                      <span
                        key={`${item.id}-${t}`}
                        className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-semibold text-slate-700">
                  Chu kỳ: {item.interval_days} ngày
                </div>
                <div className="text-[11px] text-slate-500">
                  Mastery: {item.meaning_mastery}%
                </div>
                {!isVocabItemMastered(item) && onMarkMastered && (
                  <button
                    type="button"
                    onClick={() => onMarkMastered(item.id)}
                    className="mt-1 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                  >
                    Đã thuộc ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

