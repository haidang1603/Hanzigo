import React from 'react';
import { Languages, Highlighter, BookMarked, Type, Eye } from 'lucide-react';

export type PinyinDisplayMode = 'off' | 'all' | 'hard_only';
export type ReaderFontFamily = 'Noto Sans SC' | 'KaiTi' | 'Noto Serif SC';

export interface ReaderSettings {
  pinyinMode: PinyinDisplayMode;
  hskHighlight: boolean;
  savedHighlight: boolean;
  showInterlinearVi: boolean;
  fontSize: number;
  fontFamily: ReaderFontFamily;
}

interface ReaderControlToolbarProps {
  settings: ReaderSettings;
  onChange: (next: ReaderSettings) => void;
}

const PINYIN_OPTIONS: Array<{ value: PinyinDisplayMode; label: string }> = [
  { value: 'off', label: 'Tắt Pinyin' },
  { value: 'all', label: 'Hiện tất cả' },
  { value: 'hard_only', label: 'Từ mới / HSK cao' },
];

const FONT_OPTIONS: Array<{ value: ReaderFontFamily; label: string }> = [
  { value: 'Noto Sans SC', label: 'Hiện đại (Sans)' },
  { value: 'KaiTi', label: 'Khải thư (KaiTi)' },
  { value: 'Noto Serif SC', label: 'Sách in (Serif)' },
];

export const ReaderControlToolbar: React.FC<ReaderControlToolbarProps> = ({
  settings,
  onChange,
}) => {
  const update = <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="sticky top-2 z-20 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Pinyin mode */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 mr-1">
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            Pinyin:
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
            {PINYIN_OPTIONS.map((opt) => {
              const active = settings.pinyinMode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('pinyinMode', opt.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    active
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => update('hskHighlight', !settings.hskHighlight)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              settings.hskHighlight
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            Màu HSK
          </button>

          <button
            type="button"
            onClick={() => update('savedHighlight', !settings.savedHighlight)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              settings.savedHighlight
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            Từ đã lưu
          </button>

          <button
            type="button"
            onClick={() => update('showInterlinearVi', !settings.showInterlinearVi)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              settings.showInterlinearVi
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Dịch từng câu
          </button>
        </div>

        {/* Font size & family */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="range"
              min={16}
              max={28}
              step={2}
              value={settings.fontSize}
              onChange={(e) => update('fontSize', Number(e.target.value))}
              aria-label="Cỡ chữ bài đọc"
              className="w-20 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-600 w-9">{settings.fontSize}px</span>
          </div>

          <select
            value={settings.fontFamily}
            onChange={(e) => update('fontFamily', e.target.value as ReaderFontFamily)}
            aria-label="Phông chữ tiếng Trung"
            className="text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

