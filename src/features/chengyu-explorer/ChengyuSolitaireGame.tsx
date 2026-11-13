import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  RotateCcw,
  Send,
  Lightbulb,
  Volume2,
  Trophy,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  playChengyuSolitaireTurn,
  getValidSolitaireNextMoves,
  getLastCharPinyin,
  type ChengyuEntry,
} from '../../services/chengyuCollocationService.ts';

interface ChengyuSolitaireGameProps {
  entries: ChengyuEntry[];
}

export const ChengyuSolitaireGame: React.FC<ChengyuSolitaireGameProps> = ({ entries }) => {
  // Choose a rich starting Chengyu that has valid continuation moves
  const defaultSeed = useMemo(() => {
    return (
      entries.find((e) => e.chengyu === '虎头蛇尾') ||
      entries.find((e) => e.chengyu === '一心一意') ||
      entries[0]
    );
  }, [entries]);

  const [chain, setChain] = useState<{ entry: ChengyuEntry; by: 'ai' | 'user' }[]>(() =>
    defaultSeed ? [{ entry: defaultSeed, by: 'ai' }] : []
  );
  const [userInput, setUserInput] = useState('');
  const [allowHomophone, setAllowHomophone] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );
  const [showHints, setShowHints] = useState(true);

  const lastEntry = chain.length > 0 ? chain[chain.length - 1].entry : null;
  const usedSet = useMemo(() => new Set(chain.map((c) => c.entry.chengyu)), [chain]);

  const validHints = useMemo(() => {
    if (!lastEntry) return [];
    return getValidSolitaireNextMoves(entries, lastEntry, usedSet, allowHomophone);
  }, [entries, lastEntry, usedSet, allowHomophone]);

  const targetTailChar = lastEntry ? Array.from(lastEntry.chengyu)[3] : '';
  const targetTailPinyin = lastEntry ? getLastCharPinyin(lastEntry) : '';

  const userTurnsCount = chain.filter((c) => c.by === 'user').length;

  const submitMove = (inputStr: string) => {
    if (!lastEntry) return;
    const result = playChengyuSolitaireTurn({
      entries,
      previousEntry: lastEntry,
      userInput: inputStr,
      usedChengyu: Array.from(usedSet),
      allowHomophone,
    });

    if (!result.valid || !result.userEntry) {
      setFeedback({ type: 'error', message: result.reason_vi || 'Nước đi chưa hợp lệ.' });
      return;
    }

    const nextItems: { entry: ChengyuEntry; by: 'ai' | 'user' }[] = [
      { entry: result.userEntry, by: 'user' },
    ];

    if (result.aiReply) {
      nextItems.push({ entry: result.aiReply, by: 'ai' });
      setFeedback({
        type: 'success',
        message: `Chính xác! AI nối tiếp bằng "${result.aiReply.chengyu}" (${result.aiReply.pinyin}).`,
      });
    } else {
      setFeedback({
        type: 'success',
        message: `Tuyệt vời! Bạn đã đánh bại AI và hoàn thành chuỗi ${chain.length + 1} thành ngữ!`,
      });
    }

    setChain((prev) => [...prev, ...nextItems]);
    setUserInput('');
  };

  const handleReset = () => {
    if (!entries.length) return;
    const randomSeed = entries[Math.floor(Math.random() * entries.length)];
    setChain([{ entry: randomSeed, by: 'ai' }]);
    setUserInput('');
    setFeedback(null);
  };

  if (!lastEntry) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Banner Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-100" />
            <h3 className="text-base sm:text-lg font-black">
              Chengyu Solitaire · Nối đuôi Thành ngữ (成语接龙)
            </h3>
          </div>
          <p className="text-xs text-amber-100">
            Nối chữ cuối của thành ngữ trước làm chữ đầu của thành ngữ tiếp theo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 backdrop-blur-xs px-3 py-1.5 text-xs font-bold">
            Chuỗi: {chain.length} · Điểm: {userTurnsCount * 10}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white text-slate-900 px-3 py-1.5 text-xs font-bold hover:bg-amber-50 transition cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ván mới</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Rule & Homophone Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span>Cần nối tiếp chữ:</span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-white font-serif font-black text-lg shadow-xs">
              {targetTailChar}
            </span>
            {allowHomophone && targetTailPinyin && (
              <span className="text-slate-500">
                (hoặc đồng âm Pinyin <strong className="text-emerald-700">{targetTailPinyin}</strong>)
              </span>
            )}
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowHomophone}
              onChange={(e) => setAllowHomophone(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Cho phép đồng âm (同音接龙)</span>
          </label>
        </div>

        {/* Visual Chain Timeline */}
        <div className="flex flex-wrap items-center gap-2.5">
          {chain.map((item, idx) => {
            const chars = Array.from(item.entry.chengyu);
            return (
              <React.Fragment key={`${item.entry.chengyu}-${idx}`}>
                <div
                  className={`rounded-2xl border px-3.5 py-2.5 flex items-center gap-2.5 transition ${
                    item.by === 'user'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/80 text-slate-500 border border-slate-200/70">
                        {item.by === 'user' ? 'Bạn' : 'AI'}
                      </span>
                      <span className="font-serif text-lg font-black tracking-widest">
                        <span className="text-emerald-700">{chars[0]}</span>
                        <span>{chars[1]}</span>
                        <span>{chars[2]}</span>
                        <span className="text-amber-600 underline decoration-amber-400">
                          {chars[3]}
                        </span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.entry.pinyin} · {item.entry.figurative_meaning_vi.slice(0, 40)}...
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakChinese(item.entry.chengyu, 0.85)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {idx < chain.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMove(userInput);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`Nhập thành ngữ 4 chữ bắt đầu bằng "${targetTailChar}"...`}
            maxLength={8}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || validHints.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 text-sm shadow-sm disabled:opacity-50 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nối thành ngữ</span>
          </button>
        </form>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`rounded-2xl px-4 py-3 text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Quick Hints */}
        <div className="border-t border-slate-100 pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowHints((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>
                {showHints
                  ? `Gợi ý nước đi hợp lệ (${validHints.length})`
                  : 'Hiện gợi ý nối tiếp'}
              </span>
            </button>
          </div>

          {showHints && (
            <div className="flex flex-wrap gap-2">
              {validHints.length > 0 ? (
                validHints.map((hint) => (
                  <button
                    key={hint.id}
                    type="button"
                    onClick={() => submitMove(hint.chengyu)}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 px-3 py-2 text-xs font-bold text-slate-900 transition cursor-pointer"
                  >
                    <span className="font-serif text-sm">{hint.chengyu}</span>
                    <span className="text-[11px] font-normal text-slate-600">
                      ({hint.pinyin})
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Không còn thành ngữ nối tiếp trong kho hiện tại — hãy bấm “Ván mới” để tiếp tục!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

