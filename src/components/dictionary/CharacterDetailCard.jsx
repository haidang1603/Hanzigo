import { 
  Sparkles, 
  BookOpen,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Printer
} from 'lucide-react';
import AudioButton from '../AudioButton';

export default function CharacterDetailCard({
  detail,
  onSelectRelatedWord,
  onSelectRadical,
  onOpenAiTutor,
  onOpenWorksheet
}) {
  if (!detail) return null;

  const {
    char,
    pinyin,
    hanviet,
    meaning,
    hskLevel,
    strokesCount,
    radical,
    radicalDetails,
    structure,
    components,
    traditional,
    hasTraditionalVariant,
    etymologyType,
    mnemonic,
    confusingPair,
    relatedWords,
    example
  } = detail;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-[#F1E5D8] dark:border-[#334155] shadow-sm space-y-6">
      {/* 1. Header Hero Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F1E5D8] dark:border-[#334155]">
        <div className="flex items-center gap-4">
          {/* Character Badge */}
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#FFF9F2] to-[#FCEEE2] dark:from-[#0F172A] dark:to-[#1E293B] border-2 border-[#E85D3F]/40 flex items-center justify-center shadow-inner shrink-0">
            <span className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl font-black text-[#E85D3F]">
              {char}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-[#243447] dark:text-[#F3F4F6]">
                {pinyin}
              </span>
              <AudioButton text={char} size="sm" />
              {hskLevel && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E85D3F]/10 text-[#E85D3F] border border-[#E85D3F]/20">
                  {hskLevel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              {hanviet && (
                <span>
                  Hán Việt: <strong className="text-[#243447] dark:text-[#F3F4F6]">{hanviet}</strong>
                </span>
              )}
              {hasTraditionalVariant && (
                <>
                  <span>•</span>
                  <span>
                    Phồn thể: <strong className="font-['Noto_Serif_SC'] text-indigo-600 dark:text-indigo-400">{traditional}</strong>
                  </span>
                </>
              )}
            </div>

            <p className="text-base font-semibold text-[#243447] dark:text-[#F3F4F6] mt-1">
              {meaning}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Worksheet Generator Button */}
          {onOpenWorksheet && (
            <button
              type="button"
              onClick={onOpenWorksheet}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-500/20 active:scale-95 transition-all shadow-xs"
              title="Tạo bảng in ô Điền tự / Mễ tự chuẩn A4 để luyện viết chữ này"
            >
              <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>In tập viết (A4)</span>
            </button>
          )}

          {/* AI Tutor Button */}
          {onOpenAiTutor && (
            <button
              type="button"
              onClick={onOpenAiTutor}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-500/20 active:scale-95 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Hỏi AI về chữ này</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Structured Properties Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Bộ thủ */}
        <div 
          onClick={() => onSelectRadical && radicalDetails && onSelectRadical(radicalDetails.radical)}
          className={`p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155] ${
            onSelectRadical && radicalDetails ? 'cursor-pointer hover:border-[#E85D3F] transition-colors' : ''
          }`}
        >
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] block mb-1">
            Bộ thủ tra từ
          </span>
          <div className="font-bold text-sm text-[#243447] dark:text-[#F3F4F6] flex items-center justify-between">
            <span className="font-['Noto_Serif_SC'] text-base text-[#E85D3F] font-black mr-1">
              {radicalDetails ? radicalDetails.radical : radical}
            </span>
            <span className="text-xs truncate">
              {radicalDetails ? radicalDetails.hanviet : ''}
            </span>
          </div>
        </div>

        {/* Tổng số nét */}
        <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155]">
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] block mb-1">
            Tổng số nét
          </span>
          <span className="font-bold text-base text-[#243447] dark:text-[#F3F4F6]">
            {strokesCount} <span className="text-xs font-normal text-gray-500">nét</span>
          </span>
        </div>

        {/* Cấu trúc chữ */}
        <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155]">
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] block mb-1">
            Cấu trúc chữ
          </span>
          <div className="flex items-center gap-1.5 font-bold text-xs text-[#243447] dark:text-[#F3F4F6] truncate">
            {structure && structure.symbol && (
              <span className="px-1 py-0.5 rounded-sm bg-gray-200 dark:bg-gray-700 font-mono text-[11px]">
                {structure.symbol}
              </span>
            )}
            <span className="truncate">{structure ? structure.name.split('(')[0] : 'Đơn thể'}</span>
          </div>
        </div>

        {/* Phương pháp tạo chữ */}
        <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155]">
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] block mb-1">
            Cơ chế tạo chữ
          </span>
          <span className="font-bold text-xs text-[#243447] dark:text-[#F3F4F6] block truncate">
            {etymologyType || 'Hội ý / Hình thanh'}
          </span>
        </div>
      </div>

      {/* 3. Chiết tự & Mẹo nhớ câu chuyện */}
      {mnemonic && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-rose-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Mẹo chiết tự & Câu chuyện ghi nhớ</span>
          </div>
          <p className="text-sm text-[#243447] dark:text-[#E2E8F0] leading-relaxed">
            {mnemonic}
          </p>
        </div>
      )}

      {/* 4. Thành phần cấu tạo (Components Breakdown) */}
      {components && components.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2.5">
            Thành phần cấu tạo chữ (Components)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {components.map((comp, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 flex items-center justify-center font-['Noto_Serif_SC'] text-lg font-bold text-[#E85D3F]">
                  {comp.char}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#243447] dark:text-[#F3F4F6]">
                    {comp.name || comp.char}
                  </div>
                  <div className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    {comp.meaning || (comp.role === 'meaning' ? 'Gợi ý nghĩa' : 'Gợi ý âm thanh')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Cảnh báo Chữ dễ gây nhầm lẫn (Confusing Pair Alert) */}
      {confusingPair && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Phân biệt chữ dễ nhầm lẫn: {confusingPair.title}</span>
          </div>

          <p className="text-xs text-[#243447] dark:text-[#E2E8F0] mb-3 leading-relaxed">
            {confusingPair.distinction}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {confusingPair.details.map((item, idx) => (
              <div 
                key={idx}
                className={`p-2.5 rounded-lg border text-center ${
                  item.char === char 
                    ? 'bg-rose-100/70 dark:bg-rose-900/40 border-rose-300 dark:border-rose-700 font-bold' 
                    : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="font-['Noto_Serif_SC'] text-2xl font-black text-[#E85D3F]">
                  {item.char}
                </div>
                <div className="text-xs font-semibold text-[#243447] dark:text-[#F3F4F6] mt-1">
                  {item.pinyin} ({item.hanviet})
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                  {item.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Từ vựng ghép trong HSK chứa chữ này */}
      {relatedWords && relatedWords.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              Từ ghép chứa chữ "{char}" ({relatedWords.length} từ)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {relatedWords.map((vocab) => (
              <div
                key={vocab.id || vocab.hanzi}
                onClick={() => onSelectRelatedWord && onSelectRelatedWord(vocab)}
                className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155] flex items-center justify-between hover:border-[#E85D3F] cursor-pointer transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Noto_Serif_SC'] font-bold text-base text-[#243447] dark:text-[#F3F4F6] group-hover:text-[#E85D3F] transition-colors">
                      {vocab.hanzi}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {vocab.pinyin}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                    {vocab.meaning}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {vocab.level}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E85D3F] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Ví dụ mẫu câu */}
      {example && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#E85D3F]" />
              Ví dụ câu ứng dụng
            </span>
            <AudioButton text={example.hanzi} size="sm" />
          </div>

          <p className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-[#F3F4F6]">
            {example.hanzi}
          </p>
          <p className="text-xs text-[#E85D3F] font-medium">
            {example.pinyin}
          </p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            {example.meaning}
          </p>
        </div>
      )}
    </div>
  );
}
