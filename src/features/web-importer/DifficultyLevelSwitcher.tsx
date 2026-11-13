import React from 'react';
import {
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export type ArticleVersionType = 'original' | 'simplified_hsk4' | 'simplified_hsk3' | 'glossed';

interface DifficultyLevelSwitcherProps {
  activeVersion: ArticleVersionType;
  onChangeVersion: (version: ArticleVersionType) => void;
  originalHskLevel: number;
}

export const DifficultyLevelSwitcher: React.FC<DifficultyLevelSwitcherProps> = ({
  activeVersion,
  onChangeVersion,
  originalHskLevel,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            AI Adaptive Text Rewriter:
          </span>
          <span className="text-xs text-slate-500">
            (Bản gốc: HSK {originalHskLevel}+)
          </span>
        </div>

        {/* Segmented Button Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100">
          <button
            type="button"
            onClick={() => onChangeVersion('original')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeVersion === 'original'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bản gốc báo chí
          </button>

          <button
            type="button"
            onClick={() => onChangeVersion('simplified_hsk4')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeVersion === 'simplified_hsk4'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            Rút gọn HSK 4
          </button>

          <button
            type="button"
            onClick={() => onChangeVersion('simplified_hsk3')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeVersion === 'simplified_hsk3'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Rút gọn HSK 3
          </button>

          <button
            type="button"
            onClick={() => onChangeVersion('glossed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeVersion === 'glossed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Chú thích trong dòng
          </button>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          {activeVersion === 'original' &&
            'Đang hiển thị nguyên văn gốc từ bài báo với cấu trúc câu phức tạp và từ vựng báo chí nâng cao.'}
          {activeVersion === 'simplified_hsk4' &&
            'AI đã viết lại câu văn mượt mà, thay thế thành ngữ và từ cổ ngữ bằng từ vựng tương đương HSK 4.'}
          {activeVersion === 'simplified_hsk3' &&
            'AI tối giản cấu trúc câu, giữ nguyên ý chính nhưng chỉ dùng từ vựng và ngữ pháp nền tảng HSK 3.'}
          {activeVersion === 'glossed' &&
            'Giữ nguyên văn bản gốc nhưng tự động mở ngoặc giải thích từ đồng nghĩa đơn giản ngay sau từ khó.'}
        </span>
      </div>
    </div>
  );
};
