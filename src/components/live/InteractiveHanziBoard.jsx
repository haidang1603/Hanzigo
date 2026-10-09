import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Check, 
  Layers, 
  Edit3,
  ArrowRight,
  Eye
} from 'lucide-react';
import { speakChinese, playClickSound } from '../../utils/audio';
import { HANZI_BOARD_DICTIONARY } from '../../services/liveClassroomService';

export default function InteractiveHanziBoard({
  isTeacher = false,
  hanziState = {},
  onUpdateState,
  onLinkToStroke,
  onSendToSideBoard,
  onLinkToVocab
}) {
  const [customSentenceInput, setCustomSentenceInput] = useState('');
  const [isEditingSentence, setIsEditingSentence] = useState(false);

  const sentence = hanziState?.sentence || '我喜欢学习中文。';
  const activeChar = hanziState?.activeChar || '学';

  // Lookup character details or synthesize fallback
  const charData = hanziState?.charData || HANZI_BOARD_DICTIONARY[activeChar] || {
    char: activeChar,
    pinyin: 'zì',
    tone: 'Thanh điệu chuẩn',
    toneNumber: 1,
    meaning: 'Chữ Hán trong câu',
    audioText: activeChar,
    strokesCount: 6,
    strokeOrder: ['Nét phẩy (丿)', 'Nét ngang (一)', 'Nét sổ (丨)', 'Nét mác (乀)'],
    exampleSentence: {
      hanzi: sentence,
      pinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.',
      meaning: 'Tôi thích học tiếng Trung.'
    }
  };

  const charactersInSentence = Array.from(sentence).filter(ch => /\p{Script=Han}/u.test(ch) || !/[，。！？\s]/.test(ch));

  const handleSelectChar = (ch) => {
    playClickSound();
    if (!isTeacher) return;

    const matchedData = HANZI_BOARD_DICTIONARY[ch] || {
      char: ch,
      pinyin: ch === '我' ? 'wǒ' : ch === '学' ? 'xué' : 'hàn',
      tone: 'Thanh điệu chuẩn',
      toneNumber: 2,
      meaning: `Ký tự "${ch}" trong ngữ cảnh câu`,
      audioText: ch,
      strokesCount: 6,
      strokeOrder: ['Nét cơ bản', 'Nét hoàn thiện'],
      exampleSentence: {
        hanzi: sentence,
        pinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.',
        meaning: 'Tôi thích học tiếng Trung.'
      }
    };

    if (onUpdateState) {
      onUpdateState({
        sentence,
        activeChar: ch,
        charData: matchedData
      });
    }
  };

  const handleSaveCustomSentence = (e) => {
    e.preventDefault();
    if (!isTeacher || !customSentenceInput.trim()) return;
    const newSentence = customSentenceInput.trim();
    const firstHanzi = Array.from(newSentence).find(ch => /\p{Script=Han}/u.test(ch)) || newSentence[0] || '你';
    const matchedData = HANZI_BOARD_DICTIONARY[firstHanzi] || {
      char: firstHanzi,
      pinyin: 'zì',
      tone: 'Thanh điệu chuẩn',
      meaning: `Chữ Hán "${firstHanzi}"`,
      audioText: firstHanzi,
      strokesCount: 6,
      strokeOrder: ['Nét thuận bút'],
      exampleSentence: {
        hanzi: newSentence,
        pinyin: 'Câu mẫu mới',
        meaning: 'Ví dụ tương tác'
      }
    };

    if (onUpdateState) {
      onUpdateState({
        sentence: newSentence,
        activeChar: firstHanzi,
        charData: matchedData
      });
    }
    setIsEditingSentence(false);
    setCustomSentenceInput('');
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto space-y-5 text-white">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🀄</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Interactive Hanzi Board</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                Bảng Hán tự tương tác
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            {isTeacher 
              ? 'Bấm vào chữ Hán bất kỳ để trình chiếu chi tiết phiên âm, nét bút và ngữ cảnh cho cả lớp.' 
              : 'Đang xem bục giảng tương tác theo sự điều phối của Giáo viên.'}
          </p>
        </div>

        {/* Teacher Edit Sentence Button */}
        {isTeacher && (
          <div>
            {!isEditingSentence ? (
              <button
                onClick={() => {
                  setCustomSentenceInput(sentence);
                  setIsEditingSentence(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Đổi câu mẫu</span>
              </button>
            ) : (
              <form onSubmit={handleSaveCustomSentence} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSentenceInput}
                  onChange={(e) => setCustomSentenceInput(e.target.value)}
                  placeholder="Nhập câu tiếng Trung..."
                  className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-[#E85D3F]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1"
                >
                  <Check size={14} />
                  <span>Áp dụng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSentence(false)}
                  className="px-2 py-1.5 rounded-xl bg-white/10 text-xs text-white/60 hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* 1. Sentence Projection Banner with Clickable Glyphs */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#F4B942]" />
            <span>Câu mẫu trình chiếu (Click từng chữ để giải nghĩa):</span>
          </span>
          <button
            onClick={() => speakChinese(sentence)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Nghe phát âm toàn bộ câu"
          >
            <Volume2 size={13} className="text-emerald-400" />
            <span>Đọc cả câu</span>
          </button>
        </div>

        {/* Clickable Glyphs Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-2">
          {charactersInSentence.map((ch, idx) => {
            const isSelected = ch === activeChar;
            return (
              <button
                key={`${ch}-${idx}`}
                onClick={() => handleSelectChar(ch)}
                disabled={!isTeacher}
                className={`w-12 h-14 sm:w-16 sm:h-18 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#E85D3F] to-[#F4B942] text-white shadow-xl shadow-[#E85D3F]/40 scale-110 border-2 border-white ring-4 ring-[#E85D3F]/30 z-10'
                    : isTeacher
                    ? 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 hover:scale-105'
                    : 'bg-white/5 text-white/70 border border-white/5 cursor-default'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black font-serif leading-none">
                  {ch}
                </span>
                {isSelected && (
                  <span className="text-[9px] font-black uppercase tracking-wider text-black bg-white/90 px-1 rounded mt-0.5">
                    Đang chọn
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Focused Hanzi Detail Spotlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Giant Hanzi Character Spotlight */}
        <div className="lg:col-span-5 rounded-3xl bg-[#111827] border border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden shadow-2xl">
          <div className="absolute top-3 left-4 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-bold text-white/70 flex items-center gap-1.5">
            <Eye size={12} className="text-[#E85D3F]" />
            <span>Tiêu điểm chữ Hán</span>
          </div>

          <div className="relative group my-2">
            {/* Giant glyph container with Tianzige subtle background */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-[#0B0F19] border-2 border-[#E85D3F]/40 flex items-center justify-center relative shadow-inner">
              {/* Tianzige cross guide lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-px bg-white border-dashed border-t border-white" />
                <div className="h-full w-px bg-white border-dashed border-l border-white absolute" />
              </div>

              <span className="text-7xl sm:text-8xl font-black text-[#F4B942] font-serif select-none drop-shadow-md">
                {charData.char}
              </span>
            </div>
          </div>

          {/* Quick Voice Audio Trigger & Bridge Actions */}
          <div className="flex flex-col gap-2 w-full px-1">
            <button
              onClick={() => speakChinese(charData.audioText || charData.char)}
              className="w-full px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Volume2 size={16} />
              <span>Phát âm: {charData.pinyin}</span>
            </button>

            {isTeacher && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {onLinkToStroke && (
                  <button
                    onClick={() => onLinkToStroke(charData.char)}
                    className="px-3 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    title="Mở bảng tập viết thuận bút với chữ này"
                  >
                    <span>Luyện viết nét</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                {onSendToSideBoard && (
                  <button
                    onClick={() => onSendToSideBoard(charData.char, charData.pinyin, charData.meaning)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    title="Đưa chữ này sang Bảng phụ trợ bên phải cho học sinh theo dõi"
                  >
                    <Sparkles size={13} className="text-[#F4B942]" />
                    <span>Sang Bảng phụ</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Linguistic Breakdown & Example Sentence */}
        <div className="lg:col-span-7 rounded-3xl bg-[#111827] border border-white/10 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="space-y-4">
            {/* Meta Row: Pinyin, Tone, Strokes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">PINYIN</span>
                <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">{charData.pinyin}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">THANH ĐIỆU</span>
                <p className="text-xs font-bold text-sky-400 mt-1 truncate" title={charData.tone}>{charData.tone}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">SỐ NÉT THUẬN BÚT</span>
                <p className="text-base font-black text-[#F4B942] mt-0.5">{charData.strokesCount} nét</p>
              </div>
            </div>

            {/* Meaning card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5">
                <BookOpen size={12} className="text-[#E85D3F]" />
                <span>Ý nghĩa chữ Hán</span>
              </span>
              <p className="text-sm font-bold text-white/90 leading-relaxed">
                {charData.meaning}
              </p>
            </div>

            {/* Stroke order breakdown */}
            {charData.strokeOrder && charData.strokeOrder.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5">
                  <Layers size={12} className="text-violet-400" />
                  <span>Thứ tự các nét viết (Stroke Order)</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {charData.strokeOrder.map((st, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-xl bg-white/10 text-[11px] font-medium text-white/80 border border-white/10"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Example Sentence Section */}
          {charData.exampleSentence && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E85D3F]/15 to-[#F4B942]/15 border border-[#E85D3F]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#E85D3F] tracking-wider flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Câu ví dụ ứng dụng</span>
                </span>
                <button
                  onClick={() => speakChinese(charData.exampleSentence.hanzi)}
                  className="text-xs text-white/70 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Volume2 size={13} className="text-emerald-400" />
                  <span>Nghe câu mẫu</span>
                </button>
              </div>

              <div className="space-y-0.5">
                <div className="text-base font-black text-white font-serif">
                  {charData.exampleSentence.hanzi}
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  {charData.exampleSentence.pinyin}
                </div>
                <div className="text-xs text-white/70 italic">
                  "{charData.exampleSentence.meaning}"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
