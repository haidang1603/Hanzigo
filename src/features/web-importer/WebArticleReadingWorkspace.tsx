import React, { useState, useEffect } from 'react';
import {
  Globe,
  BookOpen,
  Volume2,
  Sparkles,
  PenTool,
  BookmarkPlus,
  Check,
  Copy,
  Plus,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  listImportedWebArticles,
  convertWebArticleToReadingStudio,
  type ImportedWebContent,
} from '../../services/articleImporterService.ts';
import type { ReadingToken } from '../../utils/chineseTokenizer.ts';
import { SmartContentImporterModal } from './SmartContentImporterModal.tsx';
import { PreReadingVocabDeckCard } from './PreReadingVocabDeckCard.tsx';
import {
  DifficultyLevelSwitcher,
  type ArticleVersionType,
} from './DifficultyLevelSwitcher.tsx';

interface WebArticleReadingWorkspaceProps {
  user?: any;
  onOpenReadingStudio?: (articleId: string) => void;
  onOpenWriting?: (hanzi: string) => void;
  onOpenDictionary?: (term: string) => void;
}

export const WebArticleReadingWorkspace: React.FC<WebArticleReadingWorkspaceProps> = ({
  user,
  onOpenReadingStudio,
  onOpenWriting,
  onOpenDictionary,
}) => {
  const [articles, setArticles] = useState<ImportedWebContent[]>([]);
  const [activeArticle, setActiveArticle] = useState<ImportedWebContent | null>(null);
  const [activeVersion, setActiveVersion] = useState<ArticleVersionType>('original');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ReadingToken | null>(null);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [savedTokens, setSavedTokens] = useState<Set<string>>(() => new Set());

  // Load articles on mount
  useEffect(() => {
    let isMounted = true;
    listImportedWebArticles(user).then((list) => {
      if (isMounted) {
        setArticles(list);
        if (list.length > 0) {
          setActiveArticle((current) => current || list[0]);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleArticleImported = (article: ImportedWebContent) => {
    setArticles((prev) => [article, ...prev]);
    setActiveArticle(article);
    setActiveVersion('original');
    setSelectedToken(null);
  };

  const handleConvertToReadingStudio = async () => {
    if (!activeArticle) return;
    setIsConverting(true);
    try {
      const readingArticle = await convertWebArticleToReadingStudio(
        activeArticle,
        activeVersion,
        user
      );
      if (onOpenReadingStudio) {
        onOpenReadingStudio(readingArticle.id);
      }
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyCurrentVersion = async () => {
    if (!activeArticle) return;
    const paragraphs = activeArticle.versions[activeVersion] || activeArticle.versions.original;
    const text = paragraphs.map((p) => p.sentences.map((s) => s.zh_raw).join('')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const currentParagraphs = activeArticle
    ? activeArticle.versions[activeVersion] || activeArticle.versions.original
    : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Studio Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider backdrop-blur-xs">
              Web Clipper & AI Text Rewriter
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Đọc báo tiếng Trung & Tự động điều chỉnh trình độ
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              Nhập link bài báo hoặc văn bản dài. Hệ thống tự động phân loại từ vựng HSK, gợi ý từ khó cần học trước và cho phép chuyển đổi sang bản rút gọn HSK 3–4 chỉ với 1 chạm.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-teal-900 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md hover:bg-teal-50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-700" />
              <span>Nhập bài báo mới (Clipper)</span>
            </button>
          </div>
        </div>

        {/* Article Switcher Pills */}
        {articles.length > 0 && (
          <div className="pt-2 border-t border-white/20 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs font-semibold text-teal-200 shrink-0 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              Bài đã lưu:
            </span>
            {articles.slice(0, 6).map((art) => {
              const isActive = activeArticle?.id === art.id;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => {
                    setActiveArticle(art);
                    setActiveVersion('original');
                    setSelectedToken(null);
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-teal-900 font-bold shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {art.original_title_zh}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeArticle ? (
        <div className="space-y-5">
          {/* Difficulty Switcher */}
          <DifficultyLevelSwitcher
            activeVersion={activeVersion}
            onChangeVersion={(v) => {
              setActiveVersion(v);
              setSelectedToken(null);
            }}
            originalHskLevel={activeArticle.hsk_distribution.estimated_hsk_level}
          />

          {/* Pre-reading Glossary Card */}
          <PreReadingVocabDeckCard
            keyVocab={activeArticle.extracted_key_vocab}
            onSaveToDeck={(words) => {
              setSavedTokens((prev) => {
                const next = new Set(prev);
                words.forEach((w) => next.add(w));
                return next;
              });
            }}
          />

          {/* Article Reading Canvas */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-100 text-teal-800">
                  Nguồn: {activeArticle.domain_name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCurrentVersion}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép bản này'}</span>
                  </button>

                  {activeArticle.source_url && (
                    <a
                      href={activeArticle.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline px-2.5 py-1"
                    >
                      <span>Xem nguồn gốc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {activeArticle.original_title_zh}
              </h1>
            </div>

            {/* Paragraphs with interactive tokens */}
            <div className="space-y-6 text-lg sm:text-xl leading-relaxed text-slate-800">
              {currentParagraphs.map((para) => (
                <p key={para.paragraph_index} className="indent-6 flex flex-wrap items-center gap-x-1 gap-y-2">
                  {para.sentences.map((sent) =>
                    sent.tokens.map((tok, tokIdx) => {
                      if (tok.is_punctuation) {
                        return (
                          <span key={`punc-${tokIdx}`} className="text-slate-400 select-none">
                            {tok.text}
                          </span>
                        );
                      }

                      const isSelected = selectedToken?.text === tok.text;
                      return (
                        <button
                          key={`tok-${sent.sentence_id}-${tokIdx}`}
                          type="button"
                          onClick={() => setSelectedToken(tok)}
                          className={`inline-flex flex-col items-center rounded px-1 transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400'
                              : 'hover:bg-teal-50 hover:text-teal-900'
                          }`}
                        >
                          <ruby className="ruby-align-center">
                            <span>{tok.text}</span>
                            {tok.pinyin ? (
                              <rt className="text-[10px] text-teal-600 font-normal select-none">
                                {tok.pinyin}
                              </rt>
                            ) : null}
                          </ruby>
                        </button>
                      );
                    })
                  )}
                </p>
              ))}
            </div>

            {/* Token Quick Lookup Popover */}
            {selectedToken && (
              <div className="rounded-2xl border border-teal-200 bg-teal-50/90 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-900">{selectedToken.text}</span>
                    {selectedToken.pinyin ? (
                      <span className="text-sm font-semibold text-teal-800 bg-white px-2 py-0.5 rounded-md border border-teal-200">
                        {selectedToken.pinyin}
                      </span>
                    ) : null}
                    {selectedToken.hsk_level && (
                      <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                        HSK {selectedToken.hsk_level}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700">
                    {selectedToken.meaning_vi || 'Từ vựng trong bài báo.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakChinese(selectedToken.text, 0.85)}
                    className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    Nghe
                  </button>

                  {onOpenDictionary && (
                    <button
                      type="button"
                      onClick={() => onOpenDictionary(selectedToken.text)}
                      className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Từ điển
                    </button>
                  )}

                  {onOpenWriting && (
                    <button
                      type="button"
                      onClick={() => onOpenWriting(selectedToken.text[0])}
                      className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5 text-purple-600" />
                      Tập viết
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSavedTokens((prev) => new Set(prev).add(selectedToken.text))}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    {savedTokens.has(selectedToken.text) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Đã lưu SRS
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        Lưu từ
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedToken(null)}
                    className="text-xs text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}

            {/* Bottom 1-Click Convert Deck */}
            <div className="border-t border-slate-100 pt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Chuyển bài đọc sang phòng Reading Studio để làm bài kiểm tra hiểu nội dung
              </span>

              <button
                type="button"
                disabled={isConverting}
                onClick={handleConvertToReadingStudio}
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md shadow-teal-600/20 disabled:opacity-50 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {isConverting
                    ? 'Đang chuẩn bị bài đọc...'
                    : 'Chuyển thành bài đọc Reading Studio'}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-3 bg-white">
          <Globe className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Chưa có bài báo nào được chọn</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Nhấn vào nút "Nhập bài báo mới" để dán đường dẫn bài báo tiếng Trung hoặc chọn nhanh từ danh sách bài mẫu.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 text-white font-bold px-5 py-2.5 text-xs shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mở Web Clipper</span>
          </button>
        </div>
      )}

      {/* Clipper Modal */}
      <SmartContentImporterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onArticleImported={handleArticleImported}
        user={user}
      />
    </div>
  );
};
