import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, PlusCircle, Clock, Sparkles, X } from 'lucide-react';
import {
  calculateVocabularyCoverage,
  createCustomReadingArticle,
  getBuiltInReadingArticles,
  listReadingArticles,
  type ReadingArticle,
} from '../../services/readingStudioService.ts';
import { getSavedDeckWords } from '../../services/dictionaryService.ts';
import { ReaderControlToolbar, type ReaderSettings } from './ReaderControlToolbar.tsx';
import { InteractiveArticleRenderer } from './InteractiveArticleRenderer.tsx';
import { ComprehensionQuizPanel } from './ComprehensionQuizPanel.tsx';

interface ChineseReadingStudioProps {
  user?: { id?: string | null } | null;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  pinyinMode: 'hard_only',
  hskHighlight: true,
  savedHighlight: true,
  showInterlinearVi: false,
  fontSize: 20,
  fontFamily: 'Noto Sans SC',
};

export const ChineseReadingStudio: React.FC<ChineseReadingStudioProps> = ({ user }) => {
  const [articles, setArticles] = useState<ReadingArticle[]>(() => getBuiltInReadingArticles());
  const [selectedId, setSelectedId] = useState<string>(() => getBuiltInReadingArticles()[0]?.id || '');
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [savedWords, setSavedWords] = useState<Set<string>>(() => new Set(getSavedDeckWords(user)));
  const [savedInSessionCount, setSavedInSessionCount] = useState(0);
  const [highlightedSentenceId, setHighlightedSentenceId] = useState<string | null>(null);

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTitleZh, setCustomTitleZh] = useState('');
  const [customTitleVi, setCustomTitleVi] = useState('');
  const [customHsk, setCustomHsk] = useState(3);
  const [customRawText, setCustomRawText] = useState('');
  const [creatingCustom, setCreatingCustom] = useState(false);

  useEffect(() => {
    let active = true;
    listReadingArticles().then((items) => {
      if (!active || items.length === 0) return;
      setArticles(items);
      setSelectedId((prev) => prev || items[0].id);
    });
    return () => {
      active = false;
    };
  }, []);

  const currentArticle = useMemo(() => {
    return articles.find((a) => a.id === selectedId) || articles[0];
  }, [articles, selectedId]);

  const coverage = useMemo(() => {
    if (!currentArticle) return null;
    return calculateVocabularyCoverage(currentArticle, user, Array.from(savedWords));
  }, [currentArticle, user, savedWords]);

  const handleWordSaved = (word: string) => {
    setSavedWords((prev) => {
      const next = new Set(prev);
      next.add(word);
      return next;
    });
    setSavedInSessionCount((c) => c + 1);
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRawText.trim()) return;
    setCreatingCustom(true);
    try {
      const created = await createCustomReadingArticle({
        titleZh: customTitleZh.trim() || 'Bài đọc tùy chỉnh',
        titleVi: customTitleVi.trim() || 'Văn bản tự nhập',
        rawText: customRawText.trim(),
        hskLevel: customHsk,
        user,
      });
      setArticles((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setHighlightedSentenceId(null);
      setShowCustomForm(false);
      setCustomTitleZh('');
      setCustomTitleVi('');
      setCustomRawText('');
    } finally {
      setCreatingCustom(false);
    }
  };

  if (!currentArticle) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header + Article Switcher */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Chinese Reading Studio</h1>
              <p className="text-xs text-slate-500">
                Tách từ thông minh, Pinyin động, độ phủ từ vựng cá nhân &amp; phân tích ngữ pháp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomForm((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white transition"
          >
            {showCustomForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            {showCustomForm ? 'Đóng nhập bài' : 'Custom Article'}
          </button>
        </div>

        {/* Custom Article Form */}
        {showCustomForm && (
          <form
            onSubmit={handleCreateCustom}
            className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tiêu đề tiếng Trung (tùy chọn)"
                value={customTitleZh}
                onChange={(e) => setCustomTitleZh(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Tiêu đề tiếng Việt (tùy chọn)"
                value={customTitleVi}
                onChange={(e) => setCustomTitleVi(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <select
                value={customHsk}
                onChange={(e) => setCustomHsk(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    HSK {lvl}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              rows={4}
              required
              placeholder="Dán đoạn văn tiếng Trung bất kỳ vào đây để hệ thống tự động tách từ, gắn Pinyin và tính độ phủ từ vựng..."
              value={customRawText}
              onChange={(e) => setCustomRawText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creatingCustom || !customRawText.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-4 py-2 text-xs font-semibold text-white"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {creatingCustom ? 'Đang tách từ...' : 'Phân tích & Đọc ngay'}
              </button>
            </div>
          </form>
        )}

        {/* Article Pills */}
        <div className="flex flex-wrap gap-2">
          {articles.map((art) => {
            const active = art.id === currentArticle.id;
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => {
                  setSelectedId(art.id);
                  setHighlightedSentenceId(null);
                }}
                className={`rounded-xl border px-3 py-2 text-left transition ${
                  active
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200">
                    HSK {art.hsk_level}
                  </span>
                  <span className="text-sm font-semibold">{art.title_zh}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{art.title_vi}</div>
              </button>
            );
          })}
        </div>

        {/* Personalized Vocabulary Coverage Banner */}
        {coverage && (
          <div className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-sky-950">
                {coverage.recommendationLabel}
              </p>
              <p className="text-xs text-sky-800">
                Đã biết {coverage.knownCount}/{coverage.totalUniqueWords} từ vựng duy nhất trong bài ·{' '}
                {currentArticle.word_count} chữ
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-sky-200">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              ~{currentArticle.estimated_minutes} phút đọc
            </div>
          </div>
        )}
      </div>

      {/* Sticky Toolbar */}
      <ReaderControlToolbar settings={settings} onChange={setSettings} />

      {/* Main Article Body */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-2xl font-bold text-slate-900">{currentArticle.title_zh}</h2>
          <p className="text-sm text-slate-500">{currentArticle.title_vi}</p>
        </div>

        <InteractiveArticleRenderer
          paragraphs={currentArticle.paragraphs}
          articleHskLevel={currentArticle.hsk_level}
          settings={settings}
          savedWords={savedWords}
          highlightedSentenceId={highlightedSentenceId}
          user={user}
          onWordSaved={handleWordSaved}
        />
      </div>

      {/* Comprehension Quiz */}
      <ComprehensionQuizPanel
        article={currentArticle}
        knownPercentage={coverage?.knownPercentage ?? 0}
        savedVocabCount={savedInSessionCount}
        user={user}
        onJumpToEvidence={(sentenceId) => setHighlightedSentenceId(sentenceId)}
      />
    </div>
  );
};

