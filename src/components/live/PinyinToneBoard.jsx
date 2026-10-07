import React, { useState, useRef } from 'react';
import { 
  Volume2, 
  RotateCcw, 
  Mic, 
  Square, 
  Check, 
  Edit3,
  Layers,
  Info
} from 'lucide-react';
import { speakChinese, playClickSound, playSuccessSound } from '../../utils/audio';

export default function PinyinToneBoard({
  isTeacher = false,
  pinyinState = {},
  onUpdateState
}) {
  const text = pinyinState?.text || '你好';
  const pinyin = pinyinState?.pinyin || 'nǐ hǎo';
  const tones = pinyinState?.tones || '3rd tone + 3rd tone';
  const toneSandhiNote = pinyinState?.toneSandhiNote || 'Quy tắc biến điệu: 2 thanh 3 đi liền nhau (nǐ hǎo) đọc thành thanh 2 + thanh 3 (ní hǎo).';

  // Custom phrase editor
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editPinyin, setEditPinyin] = useState('');
  const [editTones, setEditTones] = useState('');

  // Audio Recording (Student Practice)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecord = async () => {
    playClickSound();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
        playSuccessSound();
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission denied:', err);
      alert('Vui lòng cấp quyền Micro cho trình duyệt để thực hành ghi âm.');
    }
  };

  const handleStopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSavePhrase = (e) => {
    e.preventDefault();
    if (!isTeacher || !editText.trim()) return;

    if (onUpdateState) {
      onUpdateState({
        text: editText.trim(),
        pinyin: editPinyin.trim() || 'pīn yīn',
        tones: editTones.trim() || 'Thanh điệu chuẩn',
        toneSandhiNote: 'Chú ý nhấn đúng cao độ thanh điệu chuẩn tiếng Phổ thông.'
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">拼</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Pinyin & Tone Phonetic Board</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold">
                Phiên âm & Thanh điệu
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            {isTeacher 
              ? 'Phân tích cao độ thanh điệu và quy tắc biến điệu. Cho phép học viên nghe, lặp lại và ghi âm.' 
              : 'Luyện tập phát âm chuẩn Pinyin với 3 chế độ: Nghe mẫu, Lặp lại chậm, và Tự ghi âm kiểm tra.'}
          </p>
        </div>

        {/* Teacher Edit Button */}
        {isTeacher && (
          <div>
            {!isEditing ? (
              <button
                onClick={() => {
                  setEditText(text);
                  setEditPinyin(pinyin);
                  setEditTones(tones);
                  setIsEditing(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Đổi cụm từ luyện âm</span>
              </button>
            ) : (
              <form onSubmit={handleSavePhrase} className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Chữ Hán (VD: 你好)"
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white w-24"
                />
                <input
                  type="text"
                  value={editPinyin}
                  onChange={(e) => setEditPinyin(e.target.value)}
                  placeholder="Pinyin (VD: nǐ hǎo)"
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white w-28"
                />
                <input
                  type="text"
                  value={editTones}
                  onChange={(e) => setEditTones(e.target.value)}
                  placeholder="Thanh điệu"
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white w-32"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#E85D3F] text-xs font-bold text-white cursor-pointer"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1.5 rounded-xl bg-white/10 text-xs text-white/60 cursor-pointer"
                >
                  Hủy
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Main Pronunciation Spotlight Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center space-y-5">
        
        {/* Big Hanzi & Pinyin Showcase */}
        <div className="space-y-2">
          <div className="text-6xl sm:text-7xl font-black text-[#F4B942] font-serif tracking-wider select-none">
            {text}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-widest">
            {pinyin}
          </div>
        </div>

        {/* Tone Badge & Phonetic Formula */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm font-black text-sky-300">
          <Layers size={16} />
          <span>{tones}</span>
        </div>

        {/* Tone Sandhi Explanation Note */}
        {toneSandhiNote && (
          <div className="max-w-xl p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2.5 text-left">
            <Info size={18} className="shrink-0 text-amber-400" />
            <p className="leading-relaxed">{toneSandhiNote}</p>
          </div>
        )}

        {/* Action Controls for Students & Teachers */}
        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          {/* 1. Listen (Standard Speed) */}
          <button
            onClick={() => {
              playClickSound();
              speakChinese(text, 0.85);
            }}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Volume2 size={16} />
            <span>Listen (Nghe chuẩn)</span>
          </button>

          {/* 2. Repeat (Slower Speed for articulation) */}
          <button
            onClick={() => {
              playClickSound();
              speakChinese(text, 0.60);
            }}
            className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw size={16} />
            <span>Repeat (Nghe chậm)</span>
          </button>

          {/* 3. Record (Student Voice Practice) */}
          {!isRecording ? (
            <button
              onClick={handleStartRecord}
              className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white font-bold text-xs shadow-lg shadow-[#E85D3F]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Mic size={16} />
              <span>Record (Thu âm luyện giọng)</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecord}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/40 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <Square size={16} />
              <span>Dừng thu âm</span>
            </button>
          )}
        </div>

        {/* Recorded Audio Playback */}
        {recordedAudioUrl && (
          <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-400">Bản thu của bạn:</span>
            <audio controls src={recordedAudioUrl} className="h-8 w-60 sm:w-72" />
          </div>
        )}
      </div>
    </div>
  );
}
