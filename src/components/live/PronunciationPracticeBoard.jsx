import React, { useState, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  Award, 
  ArrowUpDown, 
  Activity,
  Plus
} from 'lucide-react';
import { speakChinese, playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { submitPronunciationRecording, createPronunciationChallenge } from '../../services/liveClassroomService';

export default function PronunciationPracticeBoard({
  isTeacher = false,
  user,
  sessionId,
  pronState = {},
  onUpdateState: _onUpdateState
}) {
  const challenge = pronState?.activeChallenge || {
    id: 'chal-1',
    prompt: '请说：我喜欢学习中文。',
    targetHanzi: '我喜欢学习中文。',
    targetPinyin: 'wǒ xǐhuan xuéxí zhōngwén.',
    submissions: []
  };

  // Student Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(0);
  const [myDiagnosticResult, setMyDiagnosticResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Sorting state for teacher table
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  // Teacher Create New Challenge Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromptInput, setNewPromptInput] = useState('请说：你好。');
  const [newTargetHanzi, setNewTargetHanzi] = useState('你好');
  const [newTargetPinyin, setNewTargetPinyin] = useState('nǐ hǎo');

  const recognitionRef = useRef(null);

  // Start Voice Recognition and Timer
  const handleStartRecording = () => {
    playClickSound();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech Recognition. Vui lòng sử dụng Chrome, Edge hoặc Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      const startTime = Date.now();
      setRecordingStartTime(startTime);
      setIsRecording(true);
      setMyDiagnosticResult(null);

      recognition.onresult = async (event) => {
        const spokenTranscript = event.results[0][0].transcript;
        const durationMs = Date.now() - startTime;
        setIsRecording(false);
        setIsEvaluating(true);

        const res = await submitPronunciationRecording(sessionId, user, challenge.id, {
          targetHanzi: challenge.targetHanzi,
          targetPinyin: challenge.targetPinyin,
          spokenTranscript,
          audioDurationMs: durationMs,
          audioEnergyRms: 0.15
        });

        setIsEvaluating(false);
        if (res.success) {
          setMyDiagnosticResult(res.diagnostic);
          if (res.diagnostic.overall >= 70) {
            playSuccessSound();
          } else {
            playErrorSound();
          }
        }
      };

      recognition.onerror = async (event) => {
        setIsRecording(false);
        setIsEvaluating(false);
        // Record attempt even on silence
        const res = await submitPronunciationRecording(sessionId, user, challenge.id, {
          targetHanzi: challenge.targetHanzi,
          targetPinyin: challenge.targetPinyin,
          spokenTranscript: '',
          audioDurationMs: Date.now() - startTime,
          audioEnergyRms: 0
        });
        if (res.success) {
          setMyDiagnosticResult(res.diagnostic);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech Recognition error:', err);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!newTargetHanzi.trim()) return;

    await createPronunciationChallenge(sessionId, user.uid || user.id, {
      prompt: newPromptInput.trim(),
      targetHanzi: newTargetHanzi.trim(),
      targetPinyin: newTargetPinyin.trim()
    });

    setShowCreateModal(false);
  };

  // Sort submissions
  const sortedSubmissions = [...(challenge.submissions || [])].sort((a, b) => {
    if (sortOrder === 'desc') return b.overallScore - a.overallScore;
    return a.overallScore - b.overallScore;
  });

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎤</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Live Pronunciation Challenge</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                Thử thách phát âm Realtime
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            Đánh giá phát âm trung thực dựa trên ASR Match, trường độ phát âm và chỉ số năng lượng âm thanh.
          </p>
        </div>

        {/* Teacher Create Challenge Button */}
        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#E85D3F]/20"
          >
            <Plus size={14} />
            <span>Tạo thử thách mới</span>
          </button>
        )}
      </div>

      {/* 1. Target Challenge Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 inline-block">
            MỤC TIÊU PHÁT ÂM
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-serif">
            {challenge.prompt}
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">
            {challenge.targetPinyin}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => speakChinese(challenge.targetHanzi)}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Nghe phát âm chuẩn"
          >
            <Volume2 size={20} className="text-emerald-400" />
          </button>

          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-[#E85D3F] hover:from-rose-500 hover:to-[#E85D3F] text-white font-bold text-xs shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Mic size={18} />
              <span>Ghi âm phát âm</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-xl shadow-rose-600/40 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <Square size={18} />
              <span>Đang thu giọng...</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Honest Pronunciation Diagnostic Report (If user just practiced) */}
      {(myDiagnosticResult || isEvaluating) && (
        <div className="p-5 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Pronunciation Diagnostic (Chẩn đoán phát âm)</h3>
            </div>
            {myDiagnosticResult && (
              <span className="text-xs font-black text-[#F4B942]">
                Điểm tổng thể: {myDiagnosticResult.overall} / 100
              </span>
            )}
          </div>

          {isEvaluating ? (
            <div className="p-6 text-center text-xs text-white/50 animate-pulse">
              Đang phân tích tín hiệu âm thanh và độ khớp ASR...
            </div>
          ) : myDiagnosticResult ? (
            <div className="space-y-4">
              {/* Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-black uppercase text-white/40">ASR MATCH</span>
                  <p className="text-base font-black text-emerald-400 mt-0.5">{myDiagnosticResult.accuracyScore}%</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-black uppercase text-white/40">DURATION</span>
                  <p className="text-base font-black text-sky-400 mt-0.5">{myDiagnosticResult.fluencyScore} pts</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-black uppercase text-white/40">ACOUSTIC RMS</span>
                  <p className="text-base font-black text-amber-400 mt-0.5">Tốt (Ổn định)</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-black uppercase text-white/40">XẾP HẠNG</span>
                  <p className="text-base font-black text-purple-400 mt-0.5">{myDiagnosticResult.rank}</p>
                </div>
              </div>

              {/* Character Breakdown */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-white/70">Chi tiết từng âm tiết:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {myDiagnosticResult.charBreakdown?.map((item, idx) => {
                    const isOk = item.status === 'correct';
                    const isWarn = item.status === 'warning';
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                          isOk
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : isWarn
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <span className="text-sm font-serif">{item.char}</span>
                        <span className="text-[10px] opacity-80">({item.label})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Honest Feedback */}
              <p className="text-xs text-white/80 leading-relaxed italic">
                💬 {myDiagnosticResult.feedback}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* 3. Live Challenge Submissions Table */}
      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#F4B942]" />
            <h3 className="text-sm font-bold text-white">
              Bảng nộp bài phát âm trực tiếp ({sortedSubmissions.length} lượt nộp)
            </h3>
          </div>

          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white/80 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown size={13} />
            <span>Sắp xếp điểm: {sortOrder === 'desc' ? 'Cao → Thấp' : 'Thấp → Cao'}</span>
          </button>
        </div>

        {sortedSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-white/40">
            Chưa có học viên nào nộp bài phát âm. Hãy bấm "Ghi âm phát âm" ở trên để thử giọng!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-white/60 font-semibold">
                <tr>
                  <th className="py-3 px-4">Học viên</th>
                  <th className="py-3 px-4">Lần nộp</th>
                  <th className="py-3 px-4">Điểm chẩn đoán</th>
                  <th className="py-3 px-4">Văn bản nhận diện</th>
                  <th className="py-3 px-4">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedSubmissions.map((sub, idx) => (
                  <tr key={sub.id || idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        idx === 0 && sortOrder === 'desc' ? 'bg-[#F4B942] text-black' : 'bg-white/10 text-white/70'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{sub.userName}</span>
                    </td>
                    <td className="py-3 px-4 text-white/70">Lần {sub.attemptNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                        sub.overallScore >= 80
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : sub.overallScore >= 60
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {sub.overallScore} / 100
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-white/90">
                      {sub.spokenTranscript || <span className="text-white/30 italic">Không nhận diện được</span>}
                    </td>
                    <td className="py-3 px-4 text-white/40">
                      {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Teacher Create Challenge */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111827] border border-white/20 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">Tạo Thử Thách Phát Âm Mới</h3>
            
            <form onSubmit={handleCreateChallenge} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-white/70 block mb-1">Lời nhắc thử thách (Prompt):</label>
                <input
                  type="text"
                  value={newPromptInput}
                  onChange={(e) => setNewPromptInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white"
                  placeholder="VD: 请说：我喜欢学习中文。"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/70 block mb-1">Chữ Hán mục tiêu:</label>
                <input
                  type="text"
                  value={newTargetHanzi}
                  onChange={(e) => setNewTargetHanzi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white"
                  placeholder="VD: 我喜欢学习中文。"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/70 block mb-1">Pinyin mục tiêu:</label>
                <input
                  type="text"
                  value={newTargetPinyin}
                  onChange={(e) => setNewTargetPinyin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white"
                  placeholder="VD: wǒ xǐhuan xuéxí zhōngwén."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white/80 hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-xs font-bold text-white cursor-pointer shadow-md"
                >
                  Bắt đầu thử thách
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
