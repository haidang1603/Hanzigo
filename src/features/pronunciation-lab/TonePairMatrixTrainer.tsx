import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';

interface TonePairItem {
  pairKey: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
}

const TONE_PAIR_MATRIX: TonePairItem[][] = [
  // Row 1: Tone 1 + (1, 2, 3, 4, 5)
  [
    { pairKey: '1+1', hanzi: '今天', pinyin: 'jīntiān', meaningVi: 'Hôm nay' },
    { pairKey: '1+2', hanzi: '中国', pinyin: 'Zhōngguó', meaningVi: 'Trung Quốc' },
    { pairKey: '1+3', hanzi: '听写', pinyin: 'tīngxiě', meaningVi: 'Nghe viết' },
    { pairKey: '1+4', hanzi: '高兴', pinyin: 'gāoxìng', meaningVi: 'Vui vẻ' },
    { pairKey: '1+5', hanzi: '妈妈', pinyin: 'māma', meaningVi: 'Mẹ' },
  ],
  // Row 2: Tone 2 + (1, 2, 3, 4, 5)
  [
    { pairKey: '2+1', hanzi: '明天', pinyin: 'míngtiān', meaningVi: 'Ngày mai' },
    { pairKey: '2+2', hanzi: '学习', pinyin: 'xuéxí', meaningVi: 'Học tập' },
    { pairKey: '2+3', hanzi: '牛奶', pinyin: 'niúnǎi', meaningVi: 'Sữa bò' },
    { pairKey: '2+4', hanzi: '容易', pinyin: 'róngyì', meaningVi: 'Dễ dàng' },
    { pairKey: '2+5', hanzi: '朋友', pinyin: 'péngyou', meaningVi: 'Bạn bè' },
  ],
  // Row 3: Tone 3 + (1, 2, 3, 4, 5)
  [
    { pairKey: '3+1', hanzi: '老师', pinyin: 'lǎoshī', meaningVi: 'Giáo viên' },
    { pairKey: '3+2', hanzi: '旅游', pinyin: 'lǚyóu', meaningVi: 'Du lịch' },
    { pairKey: '3+3', hanzi: '你好', pinyin: 'nǐhǎo (níhǎo)', meaningVi: 'Xin chào' },
    { pairKey: '3+4', hanzi: '米饭', pinyin: 'mǐfàn', meaningVi: 'Cơm' },
    { pairKey: '3+5', hanzi: '喜欢', pinyin: 'xǐhuan', meaningVi: 'Thích' },
  ],
  // Row 4: Tone 4 + (1, 2, 3, 4, 5)
  [
    { pairKey: '4+1', hanzi: '唱歌', pinyin: 'chànggē', meaningVi: 'Hát' },
    { pairKey: '4+2', hanzi: '问题', pinyin: 'wèntí', meaningVi: 'Vấn đề' },
    { pairKey: '4+3', hanzi: '跳舞', pinyin: 'tiàowǔ', meaningVi: 'Nhảy múa' },
    { pairKey: '4+4', hanzi: '再见', pinyin: 'zàijiàn', meaningVi: 'Tạm biệt' },
    { pairKey: '4+5', hanzi: '谢谢', pinyin: 'xièxie', meaningVi: 'Cảm ơn' },
  ],
];

export const TonePairMatrixTrainer: React.FC = () => {
  const [activePair, setActivePair] = useState<TonePairItem>(TONE_PAIR_MATRIX[0][0]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Ma trận 20 tổ hợp cặp thanh điệu (4 × 5)
          </h3>
          <p className="text-xs text-slate-500">
            Bấm vào từng ô để nghe và luyện phản xạ nối âm giữa 4 thanh chính và thanh nhẹ.
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-900">
          Đang chọn [{activePair.pairKey}]: {activePair.hanzi} · {activePair.pinyin} ({activePair.meaningVi})
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="text-slate-500">
              <th className="p-2 text-left">Âm 1 \ Âm 2</th>
              <th className="p-2 text-center">Thanh 1 (ˉ)</th>
              <th className="p-2 text-center">Thanh 2 (ˊ)</th>
              <th className="p-2 text-center">Thanh 3 (ˇ)</th>
              <th className="p-2 text-center">Thanh 4 (ˋ)</th>
              <th className="p-2 text-center">Thanh nhẹ</th>
            </tr>
          </thead>
          <tbody>
            {TONE_PAIR_MATRIX.map((row, rIdx) => (
              <tr key={`row-${rIdx}`} className="border-t border-slate-100">
                <td className="p-2 font-bold text-slate-700 whitespace-nowrap">
                  Thanh {rIdx + 1}
                </td>
                {row.map((cell) => {
                  const selected = activePair.pairKey === cell.pairKey;
                  return (
                    <td key={cell.pairKey} className="p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePair(cell);
                          speakChinese(cell.hanzi, 0.8);
                        }}
                        className={`w-full rounded-xl border p-2 text-center transition ${
                          selected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
                            : 'bg-slate-50/60 border-slate-200 hover:bg-white text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 font-bold text-sm">
                          {cell.hanzi}
                          <Volume2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-slate-600">{cell.pinyin}</div>
                        <div className="text-[10px] text-slate-400">{cell.meaningVi}</div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

