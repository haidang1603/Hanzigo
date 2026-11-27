import React from 'react';
import {
  Bookmark,
  Volume2,
  Eye,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import SentenceReorderQuestion from './SentenceReorderQuestion.jsx';
import HskSubjectiveQuestionBox from './HskSubjectiveQuestionBox.jsx';
import {
  resolveQuestionPinyin,
  getVietnameseInstructionForQuestion,
} from '../../data/hskExamBlueprints.js';
import {
  lookupChineseTokenLocal,
  segmentChineseForLookup,
} from '../../utils/localVocabLookup.js';
import { saveCustomVocab } from '../../utils/materialsStorage.js';

export default function HskQuestionRenderer({
  exam,
  user,
  currentQ,
  currentIdx,
  setCurrentIdx,
  totalQuestions,
  answers,
  recordAnswerChange,
  isFlagged,
  toggleFlagQuestion,
  isLearningMode,
  isActiveExamSession,
  examMode,
  showPinyinInTaking,
  audioPlaying,
  canPlayAudio,
  currentPlays,
  audioLimit,
  listeningVoice,
  listeningRate,
  audioFallbackActive,
  audioNotice,
  handlePlayAudio,
  handleChangeListeningVoice,
  handleChangeListeningRate,
  showPracticeScript,
  setShowPracticeScript,
  failedImageKeys,
  setFailedImageKeys,
  lookupEntry,
  setLookupEntry,
  lookupSavedFlash,
  setLookupSavedFlash,
  savedSrsIds,
  setSavedSrsIds,
  isSubmitting,
  triggerInstantLearningCheck,
  subjectiveTestingId,
  handleGradeSubjectiveInLearning,
  showPracticeExplanation,
  setShowPracticeExplanation,
  learningFeedbackMap,
  subjectiveGradingMap,
  sectionLockState,
  activeSectionSchedule,
  hasNextUnlockedSection,
  setConfirmFinishSectionOpen,
  setShowConfirmModal,
  renderHsk6SummarySimulator,
}) {
  const isSentenceReorder =
    currentQ.question_type === 'writing_reorder' ||
    currentQ.question_type === 'reorder_sentence' ||
    (currentQ.part_type === 'writing' &&
      currentQ.question_type !== 'essay' &&
      currentQ.question_type !== 'essay_summary' &&
      currentQ.question_type !== 'free_writing' &&
      currentQ.question_type !== 'translation' &&
      currentQ.question_type !== 'speaking' &&
      ((currentQ.scrambledWords && currentQ.scrambledWords.length > 0) ||
        (currentQ.words && currentQ.words.length > 0)));

  const strictActiveIndexes =
    isActiveExamSession &&
    sectionLockState?.strictSectionLock &&
    activeSectionSchedule?.questionIndexes?.length > 0
      ? activeSectionSchedule.questionIndexes
      : null;
  const posInStrict = strictActiveIndexes ? strictActiveIndexes.indexOf(currentIdx) : -1;
  const prevTarget = strictActiveIndexes
    ? posInStrict > 0
      ? strictActiveIndexes[posInStrict - 1]
      : null
    : currentIdx > 0
      ? currentIdx - 1
      : null;
  const nextTarget = strictActiveIndexes
    ? posInStrict >= 0 && posInStrict < strictActiveIndexes.length - 1
      ? strictActiveIndexes[posInStrict + 1]
      : null
    : currentIdx < totalQuestions - 1
      ? currentIdx + 1
      : null;

  return (
    <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Question Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
            {isLearningMode ? `Câu ${currentQ.question_number} / ${totalQuestions}` : `第 ${currentQ.question_number} / ${totalQuestions} 题`}
          </span>
          <span className="text-xs font-semibold text-[#E85D3F]">
            {isLearningMode
              ? (currentQ.part_type === 'listening'
                  ? '🎧 Phần Nghe'
                  : currentQ.part_type === 'writing'
                  ? '✍️ Phần Viết'
                  : currentQ.part_type === 'translation'
                  ? '🌐 Phần Dịch'
                  : currentQ.part_type === 'speaking'
                  ? '🎙️ Phần Nói'
                  : '📖 Phần Đọc')
              : (currentQ.part_type === 'listening'
                  ? '🎧 听力'
                  : currentQ.part_type === 'writing'
                  ? '✍️ 书写'
                  : currentQ.part_type === 'translation'
                  ? '🌐 翻译'
                  : currentQ.part_type === 'speaking'
                  ? '🎙️ 口语'
                  : '📖 阅读')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Flag / Bookmark button */}
          <button
            type="button"
            onClick={() => toggleFlagQuestion(currentQ.id)}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isFlagged
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-amber-600'
            }`}
            title={isLearningMode ? 'Đánh dấu câu hỏi này để xem lại trước khi nộp' : '标记此题'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span className="text-[11px]">{isLearningMode ? (isFlagged ? 'Đã đánh dấu' : 'Đánh dấu') : (isFlagged ? '已标记' : '标记')}</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">
            {currentQ.points} {isLearningMode ? 'điểm' : '分'}
          </span>
        </div>
      </div>

      {/* Listening audio controller */}
      {currentQ.part_type === 'listening' && (
        <div className="mb-6 p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handlePlayAudio(currentQ)}
              disabled={audioPlaying || (!canPlayAudio && examMode === 'simulation')}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shrink-0 ${
                audioPlaying
                  ? 'bg-amber-500 animate-pulse'
                  : !canPlayAudio && examMode === 'simulation'
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-400'
                  : 'bg-[#E85D3F] hover:scale-105 active:scale-95 shadow-md shadow-orange-500/20'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {audioPlaying
                  ? (isLearningMode ? 'Đang phát âm thanh...' : '正在播放录音...')
                  : !canPlayAudio && examMode === 'simulation'
                  ? '本小题听力已播放完毕'
                  : (isLearningMode ? 'Bấm để nghe đoạn ghi âm' : '点击播放听力录音')}
              </div>
              <div className="text-xs text-slate-500">
                {examMode === 'simulation'
                  ? `标准普通话录音 • 已播放 ${currentPlays}/${audioLimit} 次`
                  : 'Phát âm giọng phổ thông chuẩn Bắc Kinh • Luyện tập không giới hạn'}
              </div>
            </div>
          </div>

          {/* Voice + Speed selector + Status badge */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-orange-200 dark:border-orange-900/40">
              {[
                { id: 'female', label: 'Nữ' },
                { id: 'male', label: 'Nam' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleChangeListeningVoice(v.id)}
                  className={`min-h-11 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    listeningVoice === v.id
                      ? 'bg-[#E85D3F] text-white'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-orange-200 dark:border-orange-900/40">
              {[0.75, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleChangeListeningRate(spd)}
                  className={`min-h-11 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    listeningRate === spd
                      ? 'bg-[#E85D3F] text-white'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
            {audioFallbackActive && (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px]">
                Đang dùng giọng thiết bị
              </span>
            )}
            {examMode === 'simulation' ? (
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] ${
                  canPlayAudio ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {canPlayAudio ? `剩余 ${audioLimit - currentPlays} 次` : '已达上限'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                Nghe lại tự do
              </span>
            )}
          </div>
        </div>
      )}

      {/* Practice Mode: AudioScript Peek */}
      {examMode === 'practice' && currentQ.part_type === 'listening' && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowPracticeScript((prev) => !prev)}
            className="min-h-11 px-3 py-2 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/30 text-xs font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            {showPracticeScript ? 'Ẩn kịch bản nghe' : '👁️ Xem kịch bản nghe (Chữ Hán + Pinyin + Dịch)'}
          </button>
          {showPracticeScript && currentQ.audio_script && (
            <div className="mt-2 p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-200 leading-relaxed space-y-1">
              <strong className="block font-bold text-sky-800 dark:text-sky-300">Lời thoại phát thanh:</strong>
              <p className="font-medium text-sm">{currentQ.audio_script}</p>
              {resolveQuestionPinyin({ prompt: currentQ.audio_script }) && (
                <p className="text-sky-600 dark:text-sky-400 font-medium">
                  {resolveQuestionPinyin({ prompt: currentQ.audio_script })}
                </p>
              )}
              {currentQ.translation && <p className="text-slate-500 italic">Dịch: {currentQ.translation}</p>}
            </div>
          )}
        </div>
      )}

      {/* Audio warning toast */}
      {audioNotice && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{audioNotice}</span>
        </div>
      )}

      {/* Question Prompt + Image Asset + Vietnamese Instruction & Pinyin */}
      <div className="mb-6">
        {isLearningMode && (
          <div className="mb-2 px-3 py-2 rounded-xl bg-sky-50 dark:bg-slate-800 border-l-4 border-sky-500 text-xs font-semibold text-sky-800 dark:text-sky-300 break-words">
            Hướng dẫn: {getVietnameseInstructionForQuestion(currentQ)}
          </div>
        )}
        {currentQ.imageUrl && String(currentQ.imageUrl).startsWith('/images/hsk/') && (
          <div className="mb-4 flex justify-center">
            {!failedImageKeys[currentQ.id] ? (
              <img
                src={currentQ.imageUrl}
                alt={currentQ.imageAlt || 'Hình minh họa câu hỏi HSK'}
                width={currentQ.part_type === 'writing' ? 640 : 480}
                height={currentQ.part_type === 'writing' ? 420 : 320}
                loading="lazy"
                decoding="async"
                onError={() =>
                  setFailedImageKeys((prev) => ({ ...prev, [currentQ.id]: true }))
                }
                className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white object-contain"
              />
            ) : (
              <div className="w-full max-w-md p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center">
                {currentQ.imageAlt || 'Tranh minh họa câu hỏi HSK'}
              </div>
            )}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-2 break-words">
          {isLearningMode && !isActiveExamSession ? (
            <>
              {segmentChineseForLookup(currentQ.prompt).map((tok, tIdx) =>
                tok.isHanzi ? (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => {
                      setLookupSavedFlash(false);
                      setLookupEntry(lookupChineseTokenLocal(tok.text));
                    }}
                    className="inline hover:text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-md px-0.5 underline cursor-pointer"
                    title="Bấm để tra nhanh Pinyin & nghĩa tiếng Việt"
                  >
                    {tok.text}
                  </button>
                ) : (
                  <span key={tIdx}>{tok.text}</span>
                )
              )}
            </>
          ) : (
            currentQ.prompt
          )}
        </h2>
        {isLearningMode && !isActiveExamSession && lookupEntry && (
          <div className="mb-3 p-3.5 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-sky-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <div className="font-black text-sm text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                <span>{lookupEntry.hanzi}</span>
                {lookupEntry.pinyin && (
                  <span className="text-sky-600 dark:text-sky-400 font-bold">{lookupEntry.pinyin}</span>
                )}
                {lookupEntry.hanviet && (
                  <span className="text-[11px] text-slate-500">[{lookupEntry.hanviet}]</span>
                )}
              </div>
              <div className="text-slate-700 dark:text-slate-300">{lookupEntry.meaning}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const uid = user?.id || user?.uid || 'guest';
                  saveCustomVocab({
                    id: `lookup_${uid}_${lookupEntry.hanzi}`,
                    hanzi: lookupEntry.hanzi,
                    traditional: lookupEntry.traditional || lookupEntry.hanzi,
                    pinyin: lookupEntry.pinyin || '',
                    hanviet: lookupEntry.hanviet || '',
                    meaning: lookupEntry.meaning || '',
                    level: exam?.level || lookupEntry.level || 'HSK 1',
                    topic: 'Tra nhanh Đọc hiểu HSK',
                    strokes: lookupEntry.strokes || 6,
                  });
                  setSavedSrsIds((prev) => ({ ...prev, [lookupEntry.hanzi]: true }));
                  setLookupSavedFlash(true);
                }}
                className="min-h-11 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                {lookupSavedFlash || savedSrsIds[lookupEntry.hanzi] ? '✓ Đã lưu sổ SRS' : '+ Lưu vào sổ SRS'}
              </button>
              <button
                type="button"
                onClick={() => setLookupEntry(null)}
                className="min-h-11 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
        {showPinyinInTaking && resolveQuestionPinyin(currentQ) && (
          <div className="text-sm font-medium text-sky-600 dark:text-sky-400 mb-1 break-words">
            {resolveQuestionPinyin(currentQ)}
          </div>
        )}
        {isLearningMode && (currentQ.translationVi || currentQ.translation) && (
          <div className="text-xs text-slate-500 italic break-words">
            (Dịch nghĩa: {currentQ.translationVi || currentQ.translation})
          </div>
        )}
      </div>

      {/* QUESTION TYPE: WORD REORDERING (Sắp xếp từ thành câu — 书写) */}
      {isSentenceReorder && (
        <div className="mb-8">
          <SentenceReorderQuestion
            question={currentQ}
            scrambledWords={currentQ.scrambledWords || currentQ.words || []}
            userAnswer={answers[currentQ.id]}
            currentAnswer={answers[currentQ.id]}
            onAnswerChange={(val) => recordAnswerChange(currentQ.id, val)}
            options={currentQ.options}
            disabled={isSubmitting}
            isReviewMode={isSubmitting}
            isLearningMode={isLearningMode}
          />
        </div>
      )}

      {/* QUESTION TYPE: SENTENCE ORDER A-B-C (Sắp xếp câu logic A-B-C) */}
      {(currentQ.question_type === 'sentence_order_abc' || currentQ.propositions) && currentQ.propositions && (
        <div className="mb-6 space-y-3">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
            {isLearningMode ? 'Đọc 3 mệnh đề sau và sắp xếp theo trình tự mạch lạc logic:' : '请阅读以下三句话并按逻辑顺序排列：'}
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {['A', 'B', 'C'].map((propKey) =>
              currentQ.propositions[propKey] ? (
                <div key={propKey} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-[#E85D3F] font-black text-sm flex items-center justify-center shrink-0">
                    {propKey}
                  </span>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pt-0.5">
                    {currentQ.propositions[propKey]}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* QUESTION TYPE: FILL IN THE BLANK (Điền từ/chữ Hán — 书写第二部分) */}
      {currentQ.question_type === 'fill_blank' && (
        <div className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
            {isLearningMode ? 'Nhập chữ Hán hoặc từ cần điền vào chỗ trống:' : '请在空格处填写正确的汉字或词语：'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={typeof answers[currentQ.id] === 'string' ? answers[currentQ.id] : ''}
              onChange={(e) => recordAnswerChange(currentQ.id, e.target.value)}
              placeholder={isLearningMode ? 'Gõ chữ Hán vào đây (Ví dụ: 友, 关上)...' : '请在此输入汉字...'}
              className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base text-slate-900 dark:text-white focus:border-[#E85D3F] focus:outline-none"
            />
          </div>
          {isLearningMode && (
            <div className="text-[11px] text-slate-500 mt-2 italic">
              * Bạn có thể gõ trực tiếp chữ Hán hoặc lựa chọn một trong các phương án trắc nghiệm tương ứng.
            </div>
          )}
        </div>
      )}

      {/* QUESTION TYPE: FREE WRITING / ESSAY & HSK 6 SUMMARY */}
      <HskSubjectiveQuestionBox
        exam={exam}
        currentQ={currentQ}
        answers={answers}
        recordAnswerChange={recordAnswerChange}
        isLearningMode={isLearningMode}
        examMode={examMode}
        renderHsk6SummarySimulator={renderHsk6SummarySimulator}
      />

      {/* Standard Options List */}
      {currentQ.question_type !== 'essay_summary' && !isSentenceReorder && currentQ.options && currentQ.options.length > 0 && (
        <div className="space-y-3 mb-8">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
            {isLearningMode ? 'Chọn phương án trả lời:' : '请选择正确答案：'}
          </div>
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = answers[currentQ.id] === optIdx;
            const optPinyin = showPinyinInTaking
              ? resolveQuestionPinyin({
                  prompt: opt.text || '',
                  pinyin:
                    opt.pinyin ||
                    (Array.isArray(currentQ.optionsPinyin) ? currentQ.optionsPinyin[optIdx] : ''),
                })
              : '';
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => {
                  recordAnswerChange(currentQ.id, optIdx);
                  if (isLearningMode) {
                    triggerInstantLearningCheck(currentQ, optIdx);
                  }
                }}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E85D3F] bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-[#E85D3F] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  {Array.isArray(currentQ.optionImages) &&
                    typeof currentQ.optionImages[optIdx] === 'string' &&
                    currentQ.optionImages[optIdx].startsWith('/images/hsk/') && (
                      <img
                        src={currentQ.optionImages[optIdx]}
                        alt=""
                        width={160}
                        height={110}
                        loading="lazy"
                        decoding="async"
                        className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white object-contain shrink-0"
                      />
                    )}
                  <div className="min-w-0">
                    <div className="font-bold text-base text-slate-900 dark:text-white break-words">
                      {opt.text}
                    </div>
                    {optPinyin && (
                      <div className="text-xs text-sky-600 dark:text-sky-400 font-medium break-words">
                        {optPinyin}
                      </div>
                    )}
                    {isLearningMode && opt.translation && (
                      <div className="text-xs text-slate-500 break-words">
                        {opt.translation}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#E85D3F]' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#E85D3F]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Learning Mode: Instant Check + 4-Part Learning Feedback Card */}
      {isLearningMode && !isActiveExamSession && (
        <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {(currentQ.question_type === 'free_writing' ||
              currentQ.question_type === 'essay_summary' ||
              currentQ.is_subjective ||
              currentQ.questionType === 'essay' ||
              currentQ.questionType === 'translation' ||
              currentQ.questionType === 'speaking') ? (
              <button
                type="button"
                disabled={subjectiveTestingId === currentQ.id}
                onClick={() => handleGradeSubjectiveInLearning(currentQ)}
                className="min-h-11 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{subjectiveTestingId === currentQ.id ? 'Đang chấm thử...' : 'Chấm thử câu này'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => triggerInstantLearningCheck(currentQ, answers[currentQ.id])}
                className="min-h-11 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kiểm tra câu này</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPracticeExplanation((prev) => !prev)}
              className="min-h-11 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{showPracticeExplanation ? 'Ẩn gợi ý' : '💡 Gợi ý nhanh'}</span>
            </button>
          </div>

          {(() => {
            const fb = learningFeedbackMap[currentQ.id];
            const subGrade = subjectiveGradingMap[currentQ.id];
            if (!fb && !showPracticeExplanation) return null;

            const isCorrect = fb?.isCorrect;
            const cardClass =
              fb && !fb.isSubjective
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-slate-800 dark:border-emerald-700 dark:text-emerald-200'
                  : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-slate-800 dark:border-rose-700 dark:text-rose-200'
                : 'bg-amber-50 border-amber-200 text-slate-800 dark:bg-slate-800 dark:border-amber-700 dark:text-slate-200';

            const vocabTarget =
              (fb?.relatedVocab && fb.relatedVocab[0]) ||
              (currentQ.relatedVocab && currentQ.relatedVocab[0]) ||
              (fb?.correctAnswerText && fb.correctAnswerText.replace(/^[A-D]\.\s*/, '').slice(0, 12)) ||
              '';

            return (
              <div className={`p-4 rounded-2xl border border-l-4 text-xs leading-relaxed space-y-2.5 break-words ${cardClass}`}>
                {fb && !fb.isSubjective && (
                  <div className="font-bold text-sm">
                    {isCorrect ? '✅ Chính xác!' : '❌ Chưa chính xác.'}{' '}
                    {fb.correctAnswerText && (
                      <span>
                        Đáp án đúng: <strong>{fb.correctAnswerText}</strong>
                      </span>
                    )}
                  </div>
                )}

                {subGrade && (
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <div className="font-black text-emerald-700 dark:text-emerald-300">
                      Điểm chấm thử Rubric: {subGrade.overallScore}/100
                    </div>
                    {subGrade.fallbackNotice && (
                      <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                        ℹ️ {subGrade.fallbackNotice}
                      </div>
                    )}
                    <div className="text-slate-700 dark:text-slate-300">{subGrade.feedbackVi}</div>
                    {fb?.sampleAnswer && (
                      <div className="pt-1 text-slate-800 dark:text-slate-200">
                        <strong>Bài mẫu tham khảo:</strong> {fb.sampleAnswer}
                      </div>
                    )}
                  </div>
                )}

                {(fb?.translationVi || currentQ.translation) && (
                  <div>
                    <strong>Dịch nghĩa tiếng Việt:</strong> {fb?.translationVi || currentQ.translation}
                  </div>
                )}

                <div>
                  <strong>Giải thích ngữ pháp &amp; từ vựng:</strong>{' '}
                  {fb?.explanationVi || currentQ.explanation || 'Hãy phân tích kỹ các thành phần câu và ngữ cảnh để chọn đáp án tối ưu.'}
                </div>

                {((fb?.relatedVocab?.length > 0) || (currentQ.relatedVocab?.length > 0) || (fb?.grammarCodes?.length > 0)) && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold">Trọng tâm:</span>
                    {(fb?.relatedVocab || currentQ.relatedVocab || []).map((v, vIdx) => (
                      <span key={vIdx} className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900 font-semibold text-[11px]">
                        {v}
                      </span>
                    ))}
                    {(fb?.grammarCodes || []).map((g, gIdx) => (
                      <span key={`g-${gIdx}`} className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 font-semibold text-[11px]">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {fb && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          sessionStorage.setItem('hanzigo_ai_tutor_prefill', fb.askAiTutorPrompt || '');
                        } catch {}
                        window.location.hash = '#conversation/tutor';
                      }}
                      className="min-h-11 px-3 py-2 rounded-xl border border-[#E85D3F] bg-white dark:bg-slate-900 text-[#E85D3F] font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hỏi Lão Sư AI về câu này</span>
                    </button>

                    {vocabTarget && (
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            saveCustomVocab({
                              id: `lookup_${user?.id || user?.uid || 'guest'}_${vocabTarget}`,
                              hanzi: vocabTarget,
                              pinyin: resolveQuestionPinyin({ prompt: vocabTarget }),
                              meaning: fb.translationVi || fb.explanationVi || 'Từ vựng luyện tập HSK',
                              level: exam?.level || 'HSK 1',
                            });
                            setSavedSrsIds((prev) => ({ ...prev, [currentQ.id]: true }));
                          } catch {}
                        }}
                        className="min-h-11 px-3 py-2 rounded-xl border border-sky-400 bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 font-bold text-xs cursor-pointer"
                      >
                        {savedSrsIds[currentQ.id] ? '✅ Đã lưu vào sổ SRS' : '+ Lưu từ vào sổ SRS'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Nav Buttons */}
      <div className="flex items-center justify-between gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => prevTarget !== null && setCurrentIdx(prevTarget)}
          disabled={prevTarget === null}
          className="min-h-11 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {isLearningMode ? 'Câu trước' : '上一题'}
        </button>

        {nextTarget !== null ? (
          <button
            onClick={() => setCurrentIdx(nextTarget)}
            className="min-h-11 px-6 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isLearningMode ? 'Câu tiếp theo' : '下一题'} <ArrowRight className="w-4 h-4" />
          </button>
        ) : hasNextUnlockedSection ? (
          <button
            type="button"
            onClick={() => setConfirmFinishSectionOpen(true)}
            className="min-h-11 px-6 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-sm hover:bg-[#CB4529] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            Kết thúc phần này &amp; sang phần tiếp theo <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="min-h-11 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isLearningMode ? 'Hoàn tất & Nộp bài' : '完成并交卷'} <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
