import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  GitBranch,
  Layers,
  Mic,
  PenTool,
  Plus,
  Repeat,
  Volume2,
} from 'lucide-react';
import { setAdaptiveNavigationTarget } from '../../services/adaptiveLearningService.js';
import { saveWordToDeck } from '../../services/dictionaryService.ts';
import { speakChinese } from '../../utils/audio.js';
import type { DictionaryEntry, PosTag } from '../../types/dictionary.types.ts';
import CharacterDecompositionTree from './CharacterDecompositionTree.tsx';

export interface DictionaryEntryDetailProps {
  entry: DictionaryEntry;
  user?: { id?: string | null } | null;
  isSaved?: boolean;
  onWordSaved?: (simplified: string) => void;
  onSelectWord?: (word: string) => void;
  setActiveTab?: (tab: string) => void;
}

type DetailTab = 'meanings' | 'decomposition' | 'examples';

const POS_LABELS: Record<PosTag, string> = {
  v: 'Động từ (v.)',
  n: 'Danh từ (n.)',
  adj: 'Tính từ (adj.)',
  mw: 'Lượng từ (mw.)',
  adv: 'Phó từ (adv.)',
  prep: 'Giới từ (prep.)',
  conj: 'Liên từ (conj.)',
  pron: 'Đại từ (pron.)',
  num: 'Số từ (num.)',
  idiom: 'Thành ngữ (idiom)',
  other: 'Từ loại khác',
};

export default function DictionaryEntryDetail({
  entry,
  user = null,
  isSaved = false,
  onWordSaved,
  onSelectWord,
  setActiveTab,
}: DictionaryEntryDetailProps) {
  const [useTraditional, setUseTraditional] = useState(false);
  const [activeTab, setLocalTab] = useState<DetailTab>('meanings');
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(isSaved);

  const displayedHanzi = useTraditional && entry.traditional ? entry.traditional : entry.simplified;

  const handlePlayAudio = (text: string, rate: number) => {
    void speakChinese(text, rate);
  };

  const handleSaveToDeck = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveWordToDeck(entry, user);
      setSavedNotice(true);
      onWordSaved?.(entry.simplified);
    } finally {
      setSaving(false);
    }
  };

  const handlePracticeWriting = () => {
    setAdaptiveNavigationTarget({
      targetTab: 'writing',
      source: 'hanzi_writer',
      levelNum: entry.hsk_2_level || entry.hsk_3_level || 1,
      targetRef: entry.simplified,
    });
    setActiveTab?.('writing');
  };

  const handlePracticePronunciation = () => {
    setAdaptiveNavigationTarget({
      targetTab: 'pronunciation',
      source: 'dictionary',
      levelNum: entry.hsk_2_level || entry.hsk_3_level || 1,
      targetRef: entry.simplified,
    });
    setActiveTab?.('pronunciation');
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#243447] dark:text-white">
                {displayedHanzi}
              </h2>

              {entry.traditional && entry.traditional !== entry.simplified && (
                <button
                  type="button"
                  onClick={() => setUseTraditional((prev) => !prev)}
                  className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold text-[#5B6B7F] dark:text-slate-300 hover:border-[#E85D3F] cursor-pointer inline-flex items-center gap-1"
                  title="Chuyển đổi Giản thể / Phồn thể"
                >
                  <Repeat size={12} />
                  <span>{useTraditional ? 'Phồn thể' : 'Giản thể'}</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {entry.pinyin_display && (
                <span className="text-lg font-extrabold text-[#E85D3F]">
                  {entry.pinyin_display}
                </span>
              )}
              {entry.han_viet && (
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-extrabold uppercase tracking-wide">
                  Hán Việt: {entry.han_viet}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {entry.hsk_2_level && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                  HSK 2.0 · Cấp {entry.hsk_2_level}
                </span>
              )}
              {entry.hsk_3_level && (
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[11px] font-bold">
                  HSK 3.0 · Cấp {entry.hsk_3_level}
                </span>
              )}
              {entry.source === 'ai_fallback' && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                  AI Lexicographer Cache
                </span>
              )}
            </div>
          </div>

          {/* Audio Controls (1.0x & 0.7x) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handlePlayAudio(entry.simplified, 1.0)}
              className="px-3.5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
            >
              <Volume2 size={15} />
              <span>Nghe 1.0x</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlayAudio(entry.simplified, 0.7)}
              className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Volume2 size={14} />
              <span>Chậm 0.7x</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSaveToDeck}
            disabled={saving}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
              savedNotice || isSaved
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-[#243447] hover:bg-[#1a2636] text-white dark:bg-slate-700 dark:hover:bg-slate-600'
            }`}
          >
            {savedNotice || isSaved ? <Check size={14} /> : <Plus size={14} />}
            <span>{savedNotice || isSaved ? 'Đã lưu vào Bộ từ' : 'Lưu vào Bộ từ'}</span>
          </button>

          <button
            type="button"
            onClick={handlePracticeWriting}
            className="px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <PenTool size={14} className="text-[#E85D3F]" />
            <span>Luyện viết chữ này</span>
          </button>

          <button
            type="button"
            onClick={handlePracticePronunciation}
            className="px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Mic size={14} className="text-sky-500" />
            <span>Luyện phát âm</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setLocalTab('meanings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            activeTab === 'meanings'
              ? 'bg-[#E85D3F] text-white'
              : 'bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300'
          }`}
        >
          <Layers size={14} />
          <span>Từ loại, Lượng từ & Cụm từ</span>
        </button>

        <button
          type="button"
          onClick={() => setLocalTab('decomposition')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            activeTab === 'decomposition'
              ? 'bg-[#E85D3F] text-white'
              : 'bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300'
          }`}
        >
          <GitBranch size={14} />
          <span>Chiết tự & Cấu tạo chữ</span>
        </button>

        <button
          type="button"
          onClick={() => setLocalTab('examples')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            activeTab === 'examples'
              ? 'bg-[#E85D3F] text-white'
              : 'bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300'
          }`}
        >
          <BookOpen size={14} />
          <span>Ví dụ ({entry.examples.length})</span>
        </button>
      </div>

      {/* Tab 1: POS Meanings, Measure Words, Collocations & Synonyms */}
      {activeTab === 'meanings' && (
        <div className="space-y-4">
          {/* POS Meanings */}
          <div className="space-y-3">
            {entry.pos_meanings.map((pm, idx) => (
              <div
                key={`${pm.pos}-${idx}`}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-3"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#E85D3F]/10 text-[#E85D3F] text-xs font-extrabold">
                  {POS_LABELS[pm.pos] || pm.pos}
                </span>

                {pm.definitions_vi.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[#243447] dark:text-white font-medium">
                    {pm.definitions_vi.map((def, i) => (
                      <li key={i}>{def}</li>
                    ))}
                  </ul>
                )}

                {pm.definitions_en.length > 0 && (
                  <p className="text-xs text-[#748092] dark:text-slate-400">
                    EN: {pm.definitions_en.join(' · ')}
                  </p>
                )}

                {pm.collocations.length > 0 && (
                  <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#748092]">
                      Cụm từ cố định (Collocations)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pm.collocations.map((col, cIdx) => (
                        <button
                          key={`${col.word}-${cIdx}`}
                          type="button"
                          onClick={() => onSelectWord?.(col.word)}
                          className="p-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] hover:border-[#E85D3F] border border-[#EFE4D6] dark:border-[#2B3A4F] text-left cursor-pointer"
                        >
                          <div className="text-sm font-bold text-[#243447] dark:text-white">
                            {col.word}{' '}
                            <span className="text-xs font-normal text-[#E85D3F]">
                              {col.pinyin}
                            </span>
                          </div>
                          <div className="text-xs text-[#5B6B7F] dark:text-slate-300">
                            {col.meaning_vi}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Measure Words */}
          {entry.measure_words.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2">
              <div className="text-xs font-extrabold text-[#243447] dark:text-white uppercase tracking-wider">
                Lượng từ đi kèm
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {entry.measure_words.map((mw, idx) => (
                  <div
                    key={`${mw.simplified}-${idx}`}
                    className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F]"
                  >
                    <div className="text-sm font-extrabold text-[#243447] dark:text-white">
                      {mw.simplified}{' '}
                      <span className="text-xs font-semibold text-[#E85D3F]">
                        ({mw.pinyin})
                      </span>
                    </div>
                    <p className="text-xs text-[#5B6B7F] dark:text-slate-300 mt-0.5">
                      {mw.usage_note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synonyms & Antonyms */}
          {(entry.synonyms_antonyms.synonyms.length > 0 ||
            entry.synonyms_antonyms.antonyms.length > 0) && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-3">
              {entry.synonyms_antonyms.synonyms.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-[#243447] dark:text-white uppercase tracking-wider">
                    Phân biệt từ đồng nghĩa
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#EFE4D6] dark:border-[#2B3A4F] text-[#748092]">
                          <th className="py-2 pr-3 font-bold">Từ đồng nghĩa</th>
                          <th className="py-2 font-bold">Khác biệt sắc thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.synonyms_antonyms.synonyms.map((syn, idx) => (
                          <tr
                            key={`${syn.word}-${idx}`}
                            className="border-b last:border-b-0 border-[#F1E5D8] dark:border-[#2B3A4F]"
                          >
                            <td className="py-2 pr-3 font-bold text-[#E85D3F]">
                              <button
                                type="button"
                                onClick={() => onSelectWord?.(syn.word)}
                                className="hover:underline cursor-pointer"
                              >
                                {syn.word}
                              </button>
                            </td>
                            <td className="py-2 text-[#5B6B7F] dark:text-slate-300">
                              {syn.diff_note_vi}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {entry.synonyms_antonyms.antonyms.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-[#748092]">Từ trái nghĩa:</span>
                  {entry.synonyms_antonyms.antonyms.map((ant) => (
                    <button
                      key={ant}
                      type="button"
                      onClick={() => onSelectWord?.(ant)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-xs font-bold cursor-pointer hover:underline"
                    >
                      {ant}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Character Decomposition Tree */}
      {activeTab === 'decomposition' && (
        <CharacterDecompositionTree
          hanzi={entry.simplified}
          decomposition={entry.decomposition}
          onSelectComponent={onSelectWord}
        />
      )}

      {/* Tab 3: Graded Examples */}
      {activeTab === 'examples' && (
        <div className="space-y-3">
          {entry.examples.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-center text-xs text-[#748092]">
              Chưa có câu ví dụ cho mục từ này.
            </div>
          ) : (
            entry.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-base font-bold text-[#243447] dark:text-white">
                    {ex.hanzi}
                  </div>
                  {ex.pinyin && (
                    <div className="text-xs font-medium text-[#E85D3F]">{ex.pinyin}</div>
                  )}
                  <div className="text-xs text-[#5B6B7F] dark:text-slate-300">{ex.vi}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(ex.hanzi, 0.9)}
                  aria-label="Nghe câu ví dụ"
                  className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] hover:bg-[#E85D3F] hover:text-white text-[#5B6B7F] cursor-pointer shrink-0 transition-colors"
                >
                  <Volume2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

