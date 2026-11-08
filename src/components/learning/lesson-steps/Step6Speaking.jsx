import React from 'react';
import { Volume2, Mic, MicOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Step6Speaking({
  lesson,
  handleSpeak,
  handleToggleRecord,
  isRecording = false,
  speakingFeedback,
  speechTranscript,
  recordedAudioUrl
}) {
  if (!lesson?.step6_speaking) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 text-center animate-in fade-in">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
          Step 6: Nói phản xạ & Chấm điểm thanh điệu
        </span>
        <h3 className="text-base font-bold text-[#243447] dark:text-white">
          Tình huống: {lesson.step6_speaking.prompt}
        </h3>
      </div>

      {/* Target Sentence Card */}
      <div className="p-6 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-[#E85D3F]/30 space-y-2">
        <span className="text-[11px] text-[#748092] uppercase font-bold">Câu mục tiêu cần nói:</span>
        <div className="text-2xl font-black text-[#243447] dark:text-white font-serif">
          {lesson.step6_speaking.targetSentence}
        </div>
        <div className="text-sm font-bold font-mono text-[#E85D3F]">
          {lesson.step6_speaking.targetPinyin}
        </div>
        <div className="text-xs text-[#748092]">
          Nghĩa: {lesson.step6_speaking.targetMeaning}
        </div>
        <button
          type="button"
          onClick={() => handleSpeak(lesson.step6_speaking.targetSentence)}
          className="mt-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] text-xs font-bold text-[#E85D3F] inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Volume2 size={14} />
          <span>Nghe giọng mẫu</span>
        </button>
      </div>

      {/* Mic Record Button */}
      <div className="py-2">
        <button
          type="button"
          onClick={handleToggleRecord}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
            isRecording 
              ? 'bg-red-500 animate-pulse ring-8 ring-red-500/20' 
              : 'bg-gradient-to-tr from-[#E85D3F] to-[#F4B942]'
          }`}
        >
          {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
        <p className="text-xs font-bold text-[#748092] mt-3">
          {isRecording ? 'Đang lắng nghe... Bấm lại để dừng và chấm điểm' : 'Bấm micro để bắt đầu nói'}
        </p>
      </div>

      {/* Pronunciation Feedback */}
      {speakingFeedback && (
        <div className={`p-4 rounded-2xl border text-left space-y-2 text-xs animate-in zoom-in-95 ${
          speakingFeedback.score >= 50 && speakingFeedback.isValid
            ? 'bg-[#EBF8F2] dark:bg-[#162B21] border-[#45B97C]/30'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/50'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className={`flex items-center gap-1.5 ${
              speakingFeedback.score >= 50 && speakingFeedback.isValid ? 'text-[#3AA56E]' : 'text-amber-700 dark:text-amber-300'
            }`}>
              {speakingFeedback.score >= 50 && speakingFeedback.isValid ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <AlertCircle size={16} className="shrink-0 text-amber-600" />
              )}
              <span>{speakingFeedback.rankBadge || 'Đánh giá phản xạ'}: {speakingFeedback.feedback}</span>
            </span>
            <span className={`font-mono text-base font-black ${
              speakingFeedback.score >= 50 && speakingFeedback.isValid ? 'text-[#45B97C]' : 'text-rose-500'
            }`}>
              {speakingFeedback.score} / 100 điểm
            </span>
          </div>

          {speechTranscript && (
            <div className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
              Máy nhận diện được: <strong className="text-[#243447] dark:text-white">"{speechTranscript}"</strong>
            </div>
          )}

          {recordedAudioUrl && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] text-[#748092]">Nghe lại bản thu của bạn:</span>
              <audio src={recordedAudioUrl} controls className="h-8 w-48" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

