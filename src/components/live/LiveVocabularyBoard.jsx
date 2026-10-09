import React, { useState } from 'react';
import { 
  Plus, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  Search,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers
} from 'lucide-react';
import { speakChinese, playClickSound, playSuccessSound } from '../../utils/audio';
import { addVocabToTodayLesson } from '../../services/liveClassroomService';

const PRESET_VOCAB_LIST = [
  {
    id: 'v-xuexi',
    hanzi: '学习',
    pinyin: 'xuéxí',
    meaning: 'Học tập, nghiên cứu',
    radical: '子 (Tử)',
    strokes: 8,
    example: {
      hanzi: '我喜欢学习中文。',
      pinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.',
      meaning: 'Tôi thích học tiếng Trung.'
    }
  },
  {
    id: 'v-laoshi',
    hanzi: '老师',
    pinyin: 'lǎoshī',
    meaning: 'Thầy giáo, cô giáo, giáo viên',
    radical: '匕 (Chủy)',
    strokes: 6,
    example: {
      hanzi: '王老师是我们的中文老师。',
      pinyin: 'Wáng lǎoshī shì wǒmen de Zhōngwén lǎoshī.',
      meaning: 'Thầy Vương là giáo viên tiếng Trung của chúng tôi.'
    }
  },
  {
    id: 'v-pengyou',
    hanzi: '朋友',
    pinyin: 'péngyou',
    meaning: 'Bạn bè, bạn hữu',
    radical: '月 (Nguyệt)',
    strokes: 8,
    example: {
      hanzi: '我们都是好朋友。',
      pinyin: 'Wǒmen dōu shì hǎo péngyou.',
      meaning: 'Chúng tôi đều là bạn tốt.'
    }
  },
  {
    id: 'v-xiexie',
    hanzi: '谢谢',
    pinyin: 'xièxie',
    meaning: 'Cảm ơn, tạ ơn',
    radical: '讠(Ngôn)',
    strokes: 12,
    example: {
      hanzi: '谢谢老师的指导！',
      pinyin: 'Xièxie lǎoshī de zhǐdǎo!',
      meaning: 'Cảm ơn sự chỉ bảo của thầy/cô!'
    }
  },
  {
    id: 'v-zhongwen',
    hanzi: '中文',
    pinyin: 'Zhōngwén',
    meaning: 'Tiếng Trung, Trung văn',
    radical: '文 (Văn)',
    strokes: 4,
    example: {
      hanzi: '学中文很有用。',
      pinyin: 'Xué Zhōngwén hěn yǒuyòng.',
      meaning: 'Học tiếng Trung rất hữu ích.'
    }
  }
];

export default function LiveVocabularyBoard({
  isTeacher = false,
  user,
  sessionId,
  vocabState = {},
  onUpdateState: _onUpdateState,
  onLinkToQuiz,
  onLinkToGrammar
}) {
  const currentVocab = vocabState?.currentVocab || PRESET_VOCAB_LIST[0];
  const todayLessonVocab = vocabState?.todayLessonVocab || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [savedLocally, setSavedLocally] = useState({});

  const handleSelectVocab = async (vocab) => {
    playClickSound();
    if (!isTeacher) return;
    await addVocabToTodayLesson(sessionId, user.uid || user.id, vocab);
  };

  const handleAddToTodayLesson = async () => {
    playClickSound();
    if (!isTeacher) return;
    await addVocabToTodayLesson(sessionId, user.uid || user.id, currentVocab);
    playSuccessSound();
  };

  const handleSaveToPersonalNotebook = (vocab) => {
    playClickSound();
    try {
      const saved = JSON.parse(localStorage.getItem('hanzigo_saved_vocab') || '[]');
      if (!saved.some(v => v.hanzi === vocab.hanzi)) {
        saved.push(vocab);
        localStorage.setItem('hanzigo_saved_vocab', JSON.stringify(saved));
      }
      setSavedLocally(prev => ({ ...prev, [vocab.hanzi]: true }));
      playSuccessSound();
    } catch {}
  };

  const filteredPreset = PRESET_VOCAB_LIST.filter(v => 
    v.hanzi.includes(searchQuery) || 
    v.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Live Vocabulary Board</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Từ vựng trực tiếp
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            {isTeacher 
              ? 'Trình chiếu từ vựng bài học, thêm vào danh sách từ vựng hôm nay (Today\'s Lesson) cho học sinh lưu về.' 
              : 'Theo dõi từ mới trên bục giảng, bấm "Lưu từ vựng" để lưu vào sổ tay cá nhân.'}
          </p>
        </div>

        {/* Teacher Search / Select */}
        {isTeacher && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm từ vựng mẫu..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-[#E85D3F]"
            />
          </div>
        )}
      </div>

      {/* Main Split: Current Spotlight Card & Today's Lesson Vocab List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT (7 cols): Current Vocabulary Spotlight Card */}
        <div className="lg:col-span-7 rounded-3xl bg-[#111827] border border-white/10 p-6 flex flex-col justify-between space-y-5 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                TỪ VỰNG TIÊU ĐIỂM
              </span>
              <button
                onClick={() => speakChinese(currentVocab.hanzi)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 size={15} className="text-emerald-400" />
                <span>Phát âm</span>
              </button>
            </div>

            {/* Giant Hanzi & Pinyin */}
            <div className="text-center py-2 space-y-1">
              <div className="text-6xl font-black text-[#F4B942] font-serif">
                {currentVocab.hanzi}
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {currentVocab.pinyin}
              </div>
            </div>

            {/* Linguistic Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase text-white/40">BỘ THỦ</span>
                <p className="text-sm font-bold text-white mt-0.5">{currentVocab.radical || 'Bộ thủ'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase text-white/40">SỐ NÉT</span>
                <p className="text-sm font-bold text-white mt-0.5">{currentVocab.strokes || 6} nét</p>
              </div>
            </div>

            {/* Meaning */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-black uppercase text-white/40">Ý NGHĨA</span>
              <p className="text-sm font-bold text-white mt-1 leading-relaxed">{currentVocab.meaning}</p>
            </div>

            {/* Example sentence */}
            {currentVocab.example && (
              <div className="p-4 rounded-2xl bg-[#E85D3F]/15 border border-[#E85D3F]/30 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#E85D3F]">CÂU VÍ DỤ</span>
                <p className="text-sm font-bold text-white font-serif">{currentVocab.example.hanzi}</p>
                <p className="text-xs text-emerald-400 font-mono">{currentVocab.example.pinyin}</p>
                <p className="text-xs text-white/70 italic">"{currentVocab.example.meaning}"</p>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-white/10 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {isTeacher ? (
                <>
                  <button
                    onClick={handleAddToTodayLesson}
                    className="px-3.5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white font-bold text-xs shadow-lg shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Thêm từ này vào danh sách từ vựng bài giảng hôm nay"
                  >
                    <Plus size={15} />
                    <span>Thêm vào bài học</span>
                  </button>

                  {onLinkToQuiz && (
                    <button
                      onClick={() => onLinkToQuiz(currentVocab)}
                      className="px-3.5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title="Tạo nhanh câu hỏi trắc nghiệm từ vựng cho cả lớp"
                    >
                      <HelpCircle size={15} />
                      <span>Tạo Quiz ➔</span>
                    </button>
                  )}

                  {onLinkToGrammar && (
                    <button
                      onClick={() => onLinkToGrammar(currentVocab)}
                      className="px-3.5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title="Đưa từ này vào phân tích mẫu câu ngữ pháp"
                    >
                      <Layers size={15} />
                      <span>Đưa vào Ngữ pháp ➔</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleSaveToPersonalNotebook(currentVocab)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    savedLocally[currentVocab.hanzi]
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {savedLocally[currentVocab.hanzi] ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  <span>{savedLocally[currentVocab.hanzi] ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ từ vựng (Save)'}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => speakChinese(currentVocab.hanzi)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 size={14} className="text-emerald-400" />
              <span>Luyện nghe âm</span>
            </button>
          </div>
        </div>

        {/* RIGHT (5 cols): Today's Lesson Accumulated Vocab List */}
        <div className="lg:col-span-5 rounded-3xl bg-[#111827] border border-white/10 p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#F4B942]" />
                <h3 className="text-sm font-bold text-white">Từ vựng bài học hôm nay</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                {todayLessonVocab.length} từ
              </span>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {todayLessonVocab.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/40">
                  {isTeacher 
                    ? 'Bấm "Add to Today\'s Lesson" để thêm các từ vựng đã dạy vào danh sách này.' 
                    : 'Chưa có từ vựng nào được thêm vào bài hôm nay.'}
                </div>
              ) : (
                todayLessonVocab.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-[#F4B942] font-serif">{item.hanzi}</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{item.pinyin}</span>
                      </div>
                      <p className="text-xs text-white/70 truncate">{item.meaning}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => speakChinese(item.hanzi)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
                        title="Phát âm"
                      >
                        <Volume2 size={13} className="text-emerald-400" />
                      </button>
                      {!isTeacher && (
                        <button
                          onClick={() => handleSaveToPersonalNotebook(item)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
                          title="Lưu từ vựng"
                        >
                          <Bookmark size={13} className={savedLocally[item.hanzi] ? 'text-emerald-400 fill-emerald-400' : ''} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Preset Selector for Teacher */}
          {isTeacher && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-white/60">Chọn nhanh từ danh sách mẫu:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {filteredPreset.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectVocab(p)}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    {p.hanzi} ({p.pinyin})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
