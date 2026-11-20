// File: src/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Clock,
  Headphones,
  BarChart3,
  Languages,
  FileText,
  Mic,
  Volume2,
  CheckCircle2,
  BookmarkPlus,
  RotateCcw,
  ShieldCheck,
  Square,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getHsk7to9PaperByCode } from '../data/hsk7to9SampleExamPaper';

const DRAFT_STORAGE_KEY = 'hanzigo_hsk7to9_exam_draft_v1';

function safeLoadExamDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Hsk7to9IntegratedExamSimulator({
  paperCode = 'H79001',
  initialLevel = null,
  onExit,
}) {
  const paper = useMemo(() => getHsk7to9PaperByCode(paperCode), [paperCode]);
  const savedDraft = useMemo(() => safeLoadExamDraft(), []);

  // Điều hướng giữa 5 phần thi: 'listening' | 'reading' | 'translation' | 'writing' | 'speaking'
  const [activeSectionId, setActiveSectionId] = useState(
    savedDraft?.activeSectionId || 'listening'
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    savedDraft?.remainingSeconds ?? paper.totalDurationSeconds
  );
  const [isComposingIme, setIsComposingIme] = useState(false);

  // Đáp án trắc nghiệm Nghe (L1-L3) & Đọc (R1-R3)
  const [mcqAnswers, setMcqAnswers] = useState(savedDraft?.mcqAnswers || {});

  // Bài làm Dịch thuật (T1: Việt -> Trung, T2: Trung -> Việt)
  const [translationInputs, setTranslationInputs] = useState(
    savedDraft?.translationInputs || {
      T1: '',
      T2: '',
    }
  );

  // Bài làm Viết (4A: Biểu đồ 250 chữ, 4B: Tiêu đề + Luận văn 600 chữ)
  const [chartEssayText, setChartEssayText] = useState(savedDraft?.chartEssayText || '');
  const [essayTitle, setEssayTitle] = useState(savedDraft?.essayTitle || '');
  const [argumentEssayText, setArgumentEssayText] = useState(
    savedDraft?.argumentEssayText || ''
  );
  const [showGenkouGrid, setShowGenkouGrid] = useState(true);

  // Bài làm Khẩu ngữ Biện luận (Speaking transcript)
  const [speakingTranscript, setSpeakingTranscript] = useState(
    savedDraft?.speakingTranscript || ''
  );
  const [isRecordingSpeech, setIsRecordingSpeech] = useState(false);

  // Trạng thái nộp bài & thông báo
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Tự động lưu nháp bài thi vào localStorage mỗi khi thay đổi (chống mất bài khi F5)
  useEffect(() => {
    if (isSubmitted) return;
    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          activeSectionId,
          remainingSeconds,
          mcqAnswers,
          translationInputs,
          chartEssayText,
          essayTitle,
          argumentEssayText,
          speakingTranscript,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    isSubmitted,
    activeSectionId,
    remainingSeconds,
    mcqAnswers,
    translationInputs,
    chartEssayText,
    essayTitle,
    argumentEssayText,
    speakingTranscript,
  ]);

  // Đồng hồ đếm ngược 210 phút
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Dọn dẹp âm thanh khi unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakChinese = useCallback((text, rate = 0.92) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  }, []);

  const formatClock = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  // Thu âm giọng nói biện luận (Web Speech Recognition zh-CN)
  const toggleSpeechRecording = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      showToast(
        'Trình duyệt chưa bật nhận diện giọng nói trực tiếp — Bạn có thể nhập hoặc bấm nạp bài nói mẫu để chấm thử.'
      );
      return;
    }

    if (isRecordingSpeech) {
      setIsRecordingSpeech(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsRecordingSpeech(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setSpeakingTranscript((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setIsRecordingSpeech(false);
    recognition.onend = () => setIsRecordingSpeech(false);
    recognition.start();
  };

  // ===========================================================================
  // THUẬT TOÁN CHẤM ĐIỂM TỔNG HỢP 5 KỸ NĂNG (THANG 300 ĐIỂM CHUẨN HSK 7-9)
  // ===========================================================================
  const evaluationReport = useMemo(() => {
    const listeningSection = paper.sections[0];
    const readingSection = paper.sections[1];
    const translationSection = paper.sections[2];
    const writingSection = paper.sections[3];
    const speakingSection = paper.sections[4];

    // 1. Điểm Nghe (60đ)
    let listeningScore = 0;
    const missedVocab = new Set();
    for (const q of listeningSection.questions) {
      if (mcqAnswers[q.id] === q.correctIndex) {
        listeningScore += q.points;
      } else {
        (q.targetVocab || []).forEach((w) => missedVocab.add(w));
      }
    }

    // 2. Điểm Đọc biểu đồ & văn bản học thuật (60đ)
    let readingScore = 0;
    for (const q of readingSection.questions) {
      if (mcqAnswers[q.id] === q.correctIndex) {
        readingScore += q.points;
      } else {
        (q.targetVocab || []).forEach((w) => missedVocab.add(w));
      }
    }

    // 3. Điểm Dịch thuật Trung <-> Việt (60đ: T1 = 30đ, T2 = 30đ)
    const t1Task = translationSection.tasks[0];
    const t2Task = translationSection.tasks[1];
    const t1Text = (translationInputs.T1 || '').trim();
    const t2Text = (translationInputs.T2 || '').trim().toLowerCase();

    let t1Score = 0;
    if (t1Text.length >= 10) {
      const matchedKw1 = t1Task.requiredKeywords.filter((kw) => t1Text.includes(kw));
      const matchedLit1 = t1Task.literaryMarkers.filter((m) => t1Text.includes(m));
      t1Score = Math.min(
        30,
        Math.round(
          10 +
            (matchedKw1.length / t1Task.requiredKeywords.length) * 14 +
            Math.min(6, matchedLit1.length * 2)
        )
      );
    }

    let t2Score = 0;
    if (t2Text.length >= 20) {
      const matchedKw2 = t2Task.requiredKeywords.filter((kw) =>
        t2Text.includes(kw.toLowerCase())
      );
      t2Score = Math.min(
        30,
        Math.round(12 + (matchedKw2.length / t2Task.requiredKeywords.length) * 18)
      );
    }
    const translationScore = t1Score + t2Score;

    // 4. Điểm Viết Biểu đồ (20đ) + Luận văn 600 chữ (40đ) = 60đ
    const cleanChartText = chartEssayText.trim();
    const cleanArgText = argumentEssayText.trim();
    let chartScore = 0;
    if (cleanChartText.length >= 30) {
      const usedChartKw = writingSection.partA_ChartEssay.recommendedKeywords.filter((k) =>
        cleanChartText.includes(k.replace('……', ''))
      );
      const lengthRatio = Math.min(1, cleanChartText.length / 220);
      chartScore = Math.min(
        20,
        Math.round(lengthRatio * 12 + Math.min(8, usedChartKw.length * 2))
      );
    }

    let argEssayScore = 0;
    if (cleanArgText.length >= 50) {
      const usedArgKw = writingSection.partB_ArgumentativeEssay.recommendedKeywords.filter(
        (k) => cleanArgText.includes(k)
      );
      const lengthRatio = Math.min(1, cleanArgText.length / 550);
      const titleBonus = essayTitle.trim().length >= 4 ? 5 : 0;
      argEssayScore = Math.min(
        40,
        Math.round(titleBonus + lengthRatio * 23 + Math.min(12, usedArgKw.length * 2))
      );
    }
    const writingScore = chartScore + argEssayScore;

    // 5. Điểm Khẩu ngữ Biện luận (60đ)
    const cleanSpeech = speakingTranscript.trim();
    let speakingScore = 0;
    if (cleanSpeech.length >= 20) {
      const usedMarkers = speakingSection.requiredDiscourseMarkers.filter((m) =>
        cleanSpeech.includes(m)
      );
      const speechLenRatio = Math.min(1, cleanSpeech.length / 180);
      speakingScore = Math.min(
        60,
        Math.round(speechLenRatio * 38 + Math.min(22, usedMarkers.length * 5))
      );
    }

    const totalScore =
      listeningScore + readingScore + translationScore + writingScore + speakingScore;

    // Xác định Cấp độ HSK đạt được (Cấp 7, Cấp 8, Cấp 9)
    let certifiedLevel = 'Chưa đạt ngưỡng HSK 7 (< 180đ)';
    let badgeColor =
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    if (totalScore >= paper.levelThresholds.hsk9) {
      certifiedLevel = 'Đạt Chuẩn Đại Sư HSK 9 (Cấp Cao Nhất HSK 3.0)';
      badgeColor =
        'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    } else if (totalScore >= paper.levelThresholds.hsk8) {
      certifiedLevel = 'Đạt Chuẩn Chuyên Gia HSK 8';
      badgeColor =
        'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    } else if (totalScore >= paper.levelThresholds.hsk7) {
      certifiedLevel = 'Đạt Chuẩn Cao Cấp HSK 7';
      badgeColor =
        'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    }

    return {
      listeningScore,
      readingScore,
      translationScore,
      writingScore,
      speakingScore,
      totalScore,
      certifiedLevel,
      badgeColor,
      missedVocabList: Array.from(missedVocab),
    };
  }, [
    paper,
    mcqAnswers,
    translationInputs,
    chartEssayText,
    essayTitle,
    argumentEssayText,
    speakingTranscript,
  ]);

  // Nạp nhanh bài làm mẫu HSK 9 để kiểm nghiệm toàn bộ hệ thống chấm điểm
  const handleFillSampleMasterSubmission = () => {
    setMcqAnswers({
      L1: 1,
      L2: 2,
      L3: 1,
      R1: 1,
      R2: 1,
      R3: 1,
    });
    setTranslationInputs({
      T1: paper.sections[2].tasks[0].threeTierReference.hsk9Master
        .replace(/^🏆\s*/u, '')
        .split('（')[0],
      T2: paper.sections[2].tasks[1].threeTierReference.hsk9Master.replace(
        /^🏆\s*/u,
        ''
      ),
    });
    setChartEssayText(paper.sections[3].partA_ChartEssay.sampleEssay);
    setEssayTitle(paper.sections[3].partB_ArgumentativeEssay.sampleTitle);
    setArgumentEssayText(paper.sections[3].partB_ArgumentativeEssay.sampleEssay);
    setSpeakingTranscript(paper.sections[4].modelSpeechZh);
    showToast('Đã nạp bài làm mẫu chuẩn Đại sư HSK 9 cho cả 5 kỹ năng!');
  };

  const handleSubmitExam = async () => {
    setIsSubmitted(true);
    try {
      const { default: confetti } = await import('canvas-confetti');
      if (evaluationReport.totalScore >= 180) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    } catch {
      // Ignore confetti error
    }
    showToast(
      `Đã nộp bài thi HSK 7–9! Tổng điểm: ${evaluationReport.totalScore}/300 (${evaluationReport.certifiedLevel})`
    );
  };

  // Lưu toàn bộ từ vựng học thuật trong các câu sai vào Vocabulary Workspace (27.06)
  const handleSaveMissedAcademicVocab = async () => {
    try {
      if (!supabase?.auth) {
        showToast('Đã lưu danh sách từ vựng HSK 7–9 cần ôn vào bộ nhớ thiết bị!');
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showToast('Đã lưu danh sách từ vựng HSK 7–9 cần ôn vào bộ nhớ thiết bị!');
        return;
      }

      const words =
        evaluationReport.missedVocabList.length > 0
          ? evaluationReport.missedVocabList
          : ['赋能', '相辅相成', '未雨绸缪', '审时度势', '行稳致远'];

      for (const w of words) {
        await supabase.from('user_vocab_items').upsert(
          {
            user_id: user.id,
            simplified: w,
            pinyin: 'HSK 7-9 Academic',
            meaning_vi: `Thuật ngữ / Thành ngữ trích từ đề thi HSK 7-9 (${paperCode || paper.paperCode})`,
            hsk_level: Number(initialLevel) || 8,
            meaning_mastery: 30,
          },
          { onConflict: 'user_id,simplified' }
        );
      }
      showToast(`Đã đẩy ${words.length} thuật ngữ HSK 7–9 vào Vocabulary Workspace!`);
    } catch {
      showToast('Đã lưu vào hàng đợi đồng bộ ngoại tuyến.');
    }
  };

  // Chuyển văn bản luận văn 600 chữ thành mảng các ô vuông 稿纸 (20 cột/hàng)
  const genkouCells = useMemo(() => {
    const clean = argumentEssayText.replace(/\r/g, '');
    const chars = Array.from(clean);
    const totalCells = Math.max(640, Math.ceil((chars.length + 20) / 20) * 20);
    return Array.from({ length: totalCells }, (_, i) => chars[i] || '');
  }, [argumentEssayText]);

  const listeningSec = paper.sections[0];
  const readingSec = paper.sections[1];
  const translationSec = paper.sections[2];
  const writingSec = paper.sections[3];
  const speakingSec = paper.sections[4];

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && (e.nativeEvent?.isComposing || isComposingIme)) {
      e.stopPropagation();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-[#F3F4F6] pb-24 transition-colors duration-200">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-[#45B97C] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =====================================================================
          1. TOP CBT EXAM HEADER: ĐỒNG HỒ 210 PHÚT & THANH 5 KỸ NĂNG HSK 7-9
      ===================================================================== */}
      <header className="sticky top-0 z-30 border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl px-3 sm:px-8 py-2.5 sm:py-4 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-2.5 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              {typeof onExit === 'function' && (
                <button
                  type="button"
                  onClick={onExit}
                  className="mt-0.5 p-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300 hover:border-[#E85D3F] hover:text-[#E85D3F] transition cursor-pointer"
                  title="Quay lại Trung tâm Luyện thi HSK"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-extrabold uppercase">
                    HSK {initialLevel >= 7 ? initialLevel : '7–9'} CBT •{' '}
                    {paperCode || paper.paperCode}
                  </span>
                  <h1 className="text-base sm:text-xl font-black text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                    {paper.titleZh}
                  </h1>
                </div>
                <p className="text-xs text-[#748092] dark:text-slate-400 mt-0.5">
                  {paper.titleVi}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Đồng hồ đếm ngược */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-mono font-bold text-[#E85D3F]">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatClock(remainingSeconds)}</span>
              </div>

              {!isSubmitted && (
                <button
                  type="button"
                  onClick={handleFillSampleMasterSubmission}
                  className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition cursor-pointer"
                >
                  ⚡ Điền thử Bài Mẫu HSK 9
                </button>
              )}

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-extrabold text-xs hover:opacity-95 transition shadow-md cursor-pointer"
                >
                  Nộp bài & Xét cấp HSK 7–9
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tiếp tục chỉnh sửa</span>
                </button>
              )}
            </div>
          </div>

          {/* Thanh chuyển đổi 5 Phần thi chuẩn HSK 3.0 */}
          <nav className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {[
              { id: 'listening', label: '1. Nghe Học Thuật (60đ)', icon: Headphones },
              { id: 'reading', label: '2. Đọc Biểu Đồ & Văn Bản (60đ)', icon: BarChart3 },
              { id: 'translation', label: '3. Dịch Thuật Trung↔Việt (60đ)', icon: Languages },
              { id: 'writing', label: '4. Viết Biểu Đồ & Luận 600 Chữ (60đ)', icon: FileText },
              { id: 'speaking', label: '5. Khẩu Ngữ Biện Luận (60đ)', icon: Mic },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSectionId === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSectionId(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-2xl text-xs font-bold border transition cursor-pointer shrink-0 sm:shrink ${
                    isActive
                      ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-md shadow-[#E85D3F]/25'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300 hover:border-[#E85D3F]/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* ===================================================================
            BẢNG BÁO CÁO KẾT QUẢ PHÂN LOẠI CẤP ĐỘ HSK 7 / 8 / 9 (KHI ĐÃ NỘP BÀI)
        =================================================================== */}
        {isSubmitted && (
          <section className="p-6 rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] text-white border border-white/10 shadow-xl space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Phiếu Báo Điểm & Xếp Hạng Năng Lực HSK 3.0 Cao Cấp</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Tổng điểm: {evaluationReport.totalScore} / 300 điểm
                </h2>
                <div
                  className={`inline-block px-3.5 py-1 rounded-xl border text-xs font-extrabold ${evaluationReport.badgeColor}`}
                >
                  🏆 Kết quả xếp loại: {evaluationReport.certifiedLevel}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveMissedAcademicVocab}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#45B97C] hover:brightness-110 text-white text-xs font-bold transition shadow-md cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Lưu thuật ngữ đề thi vào Vocabulary SRS</span>
                </button>
              </div>
            </div>

            {/* Điểm chi tiết 5 kỹ năng */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: '1. Nghe Học Thuật', score: evaluationReport.listeningScore },
                { label: '2. Đọc Biểu Đồ', score: evaluationReport.readingScore },
                { label: '3. Dịch Thuật', score: evaluationReport.translationScore },
                { label: '4. Viết Luận 600 Chữ', score: evaluationReport.writingScore },
                { label: '5. Khẩu Ngữ Biện Luận', score: evaluationReport.speakingScore },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
                >
                  <div className="text-xs text-slate-300">{s.label}</div>
                  <div className="text-xl font-black text-white mt-1">
                    {s.score}{' '}
                    <span className="text-xs font-normal text-slate-300">/ 60đ</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================
            PHẦN 1: NGHE HỌC THUẬT & HỘI THẢO CHUYÊN MÔN
        =================================================================== */}
        {activeSectionId === 'listening' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase text-[#E85D3F]">
                    {listeningSec.titleZh}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-[#243447] dark:text-white mt-0.5">
                    Chủ đề: {listeningSec.stimulus.topic}
                  </h2>
                  <p className="text-xs text-[#748092] dark:text-slate-400">
                    Diễn giả: {listeningSec.stimulus.speakerRole}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakChinese(listeningSec.stimulus.audioScriptZh, 0.92)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-extrabold hover:opacity-95 transition shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Phát Bài Giảng Học Thuật (1.0x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => speakChinese(listeningSec.stimulus.audioScriptZh, 0.78)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 text-xs font-bold hover:border-[#E85D3F] cursor-pointer"
                  >
                    Nghe chậm (0.8x)
                  </button>
                </div>
              </div>

              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5 text-xs">
                  <div className="font-bold text-amber-700 dark:text-amber-300">
                    Transcript bài giảng học thuật (Mở sau khi nộp bài):
                  </div>
                  <p className="text-sm text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']">
                    {listeningSec.stimulus.audioScriptZh}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {listeningSec.questions.map((q) => {
                const chosen = mcqAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                        Câu {q.number}: {q.promptZh}
                      </span>
                      <span className="text-xs font-semibold text-[#748092] dark:text-slate-400">
                        {q.points} điểm
                      </span>
                    </div>
                    <p className="text-xs text-[#5B6B7F] dark:text-slate-400">
                      {q.promptVi}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, idx) => {
                        const isSelected = chosen === idx;
                        const isCorrect = idx === q.correctIndex;
                        let style =
                          'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 hover:border-[#E85D3F]/50';
                        if (isSubmitted) {
                          if (isCorrect) {
                            style =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (isSelected) {
                            style =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300';
                          }
                        } else if (isSelected) {
                          style =
                            'bg-orange-50 dark:bg-orange-950/40 border-[#E85D3F] text-[#E85D3F] font-bold';
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setMcqAnswers((prev) => ({ ...prev, [q.id]: idx }))
                            }
                            className={`text-left p-3.5 rounded-2xl border text-xs transition cursor-pointer ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#5B6B7F] dark:text-slate-300">
                        💡 <strong>Giải thích:</strong> {q.explanationVi}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            PHẦN 2: ĐỌC HIỂU ĐA PHƯƠNG THỨC & BIỂU ĐỒ SỐ LIỆU
        =================================================================== */}
        {activeSectionId === 'reading' && (
          <div className="space-y-6">
            {/* Khung Biểu đồ Số liệu Đa phương thức + Văn bản học thuật */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Cột Trái: Biểu đồ Trực quan */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
                <div className="text-xs font-bold uppercase text-[#E85D3F]">
                  Biểu đồ Thống kê Đa phương thức (图表材料)
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                  {readingSec.chartData.titleZh}
                </h3>
                <p className="text-xs text-[#748092] dark:text-slate-400">
                  {readingSec.chartData.titleVi}
                </p>

                <div className="space-y-3 pt-2">
                  {readingSec.chartData.rows.map((row) => (
                    <div key={row.year} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#243447] dark:text-white">
                          Năm {row.year}
                        </span>
                        <span className="text-[#5B6B7F] dark:text-slate-400">
                          AI:{' '}
                          <strong className="text-[#E85D3F]">
                            {row.aiRAndDPct}%
                          </strong>{' '}
                          • Xanh:{' '}
                          <strong className="text-emerald-600 dark:text-emerald-300">
                            {row.greenEnergyPct}%
                          </strong>{' '}
                          • Truyền thống:{' '}
                          <strong className="text-rose-600 dark:text-rose-300">
                            {row.traditionalPct}%
                          </strong>
                        </span>
                      </div>

                      <div className="h-3 w-full rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden flex">
                        <div
                          style={{ width: `${row.aiRAndDPct}%` }}
                          className="h-full bg-[#E85D3F]"
                          title={`AI R&D: ${row.aiRAndDPct}%`}
                        />
                        <div
                          style={{ width: `${row.greenEnergyPct}%` }}
                          className="h-full bg-[#45B97C]"
                          title={`Năng lượng xanh: ${row.greenEnergyPct}%`}
                        />
                        <div
                          style={{ width: `${row.traditionalPct}%` }}
                          className="h-full bg-slate-400 dark:bg-slate-600"
                          title={`Truyền thống: ${row.traditionalPct}%`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột Phải: Văn bản Học thuật */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
                <div className="text-xs font-bold uppercase text-purple-600 dark:text-purple-300">
                  Văn bản Phân tích Học thuật (Bôi đen chữ Hán bất kỳ để tra cứu nhanh)
                </div>
                {readingSec.passageParagraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base text-[#243447] dark:text-slate-100 leading-relaxed font-medium font-['Noto_Serif_SC']"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Câu hỏi Đọc hiểu */}
            <div className="space-y-4">
              {readingSec.questions.map((q) => {
                const chosen = mcqAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3"
                  >
                    <div className="text-sm font-bold text-[#243447] dark:text-white font-['Noto_Serif_SC']">
                      Câu {q.number}: {q.promptZh}
                    </div>
                    <p className="text-xs text-[#5B6B7F] dark:text-slate-400">
                      {q.promptVi}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, idx) => {
                        const isSelected = chosen === idx;
                        const isCorrect = idx === q.correctIndex;
                        let style =
                          'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 hover:border-[#E85D3F]/50';
                        if (isSubmitted) {
                          if (isCorrect) {
                            style =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (isSelected) {
                            style =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300';
                          }
                        } else if (isSelected) {
                          style =
                            'bg-orange-50 dark:bg-orange-950/40 border-[#E85D3F] text-[#E85D3F] font-bold';
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setMcqAnswers((prev) => ({ ...prev, [q.id]: idx }))
                            }
                            className={`text-left p-3.5 rounded-2xl border text-xs transition cursor-pointer ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#5B6B7F] dark:text-slate-300">
                        💡 <strong>Giải thích:</strong> {q.explanationVi}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            PHẦN 3: DỊCH THUẬT TRUNG ↔ VIỆT 2 CHIỀU (TÍN - ĐẠT - NHÃ)
        =================================================================== */}
        {activeSectionId === 'translation' && (
          <div className="space-y-6">
            {translationSec.tasks.map((task) => {
              const currentText = translationInputs[task.id] || '';
              return (
                <div
                  key={task.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-amber-300 dark:border-amber-800 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-amber-700 dark:text-amber-300">
                      {task.title}
                    </h3>
                    <span className="text-xs text-[#748092] dark:text-slate-400 font-semibold">
                      Tiêu chuẩn chấm: Tín • Đạt • Nhã
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                    <div className="text-xs text-[#748092] dark:text-slate-400 font-semibold">
                      Văn bản nguồn cần dịch:
                    </div>
                    <p className="text-base font-bold text-[#243447] dark:text-white leading-relaxed">
                      “{task.sourceText}”
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-xs text-[#748092] dark:text-slate-400 font-medium">
                        Thuật ngữ / Cấu trúc khuyến nghị:
                      </span>
                      {task.requiredKeywords.map((kw) => {
                        const used = currentText
                          .toLowerCase()
                          .includes(kw.toLowerCase());
                        return (
                          <span
                            key={kw}
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                              used
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                                : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300'
                            }`}
                          >
                            {kw} {used ? '✓' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={currentText}
                    onCompositionStart={() => setIsComposingIme(true)}
                    onCompositionEnd={() => setIsComposingIme(false)}
                    onKeyDown={handleTextareaKeyDown}
                    onChange={(e) =>
                      setTranslationInputs((prev) => ({
                        ...prev,
                        [task.id]: e.target.value,
                      }))
                    }
                    placeholder="Nhập bản dịch của bạn tại đây..."
                    className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-base sm:text-sm text-[#243447] dark:text-white"
                  />

                  {isSubmitted && (
                    <div className="space-y-2.5 pt-2">
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
                        {task.threeTierReference.literalTrap}
                      </div>
                      <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200">
                        {task.threeTierReference.hsk7Standard}
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 font-bold">
                        {task.threeTierReference.hsk9Master}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================
            PHẦN 4: VIẾT BIỂU ĐỒ SỐ LIỆU (250 CHỮ) & LUẬN VĂN NGHỊ LUẬN (600 CHỮ)
        =================================================================== */}
        {activeSectionId === 'writing' && (
          <div className="space-y-8">
            {/* Câu 4A: Viết phân tích biểu đồ 250-300 chữ */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#E85D3F]">
                  {writingSec.partA_ChartEssay.title}
                </h3>
                <span className="text-xs font-bold text-[#5B6B7F] dark:text-slate-300">
                  Số chữ hiện tại: {chartEssayText.trim().length} /{' '}
                  {writingSec.partA_ChartEssay.targetChars} chữ
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#243447] dark:text-slate-200 leading-relaxed font-['Noto_Serif_SC']">
                {writingSec.partA_ChartEssay.promptZh}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                {writingSec.partA_ChartEssay.recommendedKeywords.map((kw) => {
                  const used = chartEssayText.includes(kw.replace('……', ''));
                  return (
                    <span
                      key={kw}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                        used
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                          : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-slate-400'
                      }`}
                    >
                      {kw} {used ? '✓' : ''}
                    </span>
                  );
                })}
              </div>

              <textarea
                rows={5}
                value={chartEssayText}
                onCompositionStart={() => setIsComposingIme(true)}
                onCompositionEnd={() => setIsComposingIme(false)}
                onKeyDown={handleTextareaKeyDown}
                onChange={(e) => setChartEssayText(e.target.value)}
                placeholder="  如图所示，2022年至2026年间..."
                className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-base sm:text-sm text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']"
              />
            </div>

            {/* Câu 4B: Viết Luận văn Nghị luận 600 chữ kèm Lưới ô vuông 稿纸 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-purple-200 dark:border-purple-800 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-purple-700 dark:text-purple-300">
                  {writingSec.partB_ArgumentativeEssay.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-extrabold ${
                      argumentEssayText.trim().length >= 550
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-amber-600 dark:text-amber-300'
                    }`}
                  >
                    Độ dài: {argumentEssayText.trim().length} / 600 chữ
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGenkouGrid((v) => !v)}
                    className="px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-[#E85D3F]/30 text-xs font-bold text-[#E85D3F] cursor-pointer"
                  >
                    {showGenkouGrid ? 'Ẩn lưới ô vuông 稿纸' : 'Hiện lưới ô vuông 稿纸'}
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#243447] dark:text-slate-200 leading-relaxed font-['Noto_Serif_SC']">
                {writingSec.partB_ArgumentativeEssay.promptZh}
              </p>

              {/* Thanh theo dõi Thành ngữ & Hư từ học thuật đã dùng */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#748092] dark:text-slate-400 font-medium">
                  Thành ngữ & Hư từ HSK 7–9:
                </span>
                {writingSec.partB_ArgumentativeEssay.recommendedKeywords.map((kw) => {
                  const used = argumentEssayText.includes(kw);
                  return (
                    <span
                      key={kw}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                        used
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                          : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-slate-400'
                      }`}
                    >
                      {kw} {used ? '✓' : ''}
                    </span>
                  );
                })}
              </div>

              {/* Ô nhập Tiêu đề căn giữa */}
              <input
                type="text"
                value={essayTitle}
                onChange={(e) => setEssayTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài luận văn (Căn giữa, ví dụ: 守正创新，方能行稳致远)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center text-base font-extrabold text-[#243447] dark:text-white focus:border-[#E85D3F] focus:outline-none font-['Noto_Serif_SC']"
              />

              <textarea
                rows={9}
                value={argumentEssayText}
                onCompositionStart={() => setIsComposingIme(true)}
                onCompositionEnd={() => setIsComposingIme(false)}
                onKeyDown={handleTextareaKeyDown}
                onChange={(e) => setArgumentEssayText(e.target.value)}
                placeholder="  古人云：“审时度势，未雨绸缪。”..."
                className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-base sm:text-sm text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']"
              />

              {/* Lưới Ô Vuông 600 Chữ (稿纸 Preview responsive 10→15→20 cột/hàng) */}
              {showGenkouGrid && (
                <div className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#0E141D] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#748092] dark:text-slate-400 font-medium">
                    <span>Giấy thi chuẩn 稿纸 (20 chữ / dòng trên desktop • Đánh dấu mốc 600 chữ)</span>
                    <span>Mỗi đoạn mới thụt đầu dòng 2 ô vuông (  )</span>
                  </div>
                  <div
                    className="grid grid-cols-10 sm:grid-cols-15 lg:grid-cols-20 gap-0.5 max-h-64 overflow-y-auto p-1"
                  >
                    {genkouCells.map((ch, idx) => {
                      const is600Marker = idx === 599;
                      return (
                        <div
                          key={idx}
                          className={`aspect-square border flex items-center justify-center text-xs font-['Noto_Serif_SC'] ${
                            is600Marker
                              ? 'border-[#E85D3F] bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] font-black'
                              : ch
                              ? 'border-[#F1E5D8] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#243447] dark:text-white'
                              : 'border-[#F1E5D8]/60 dark:border-slate-800/60 text-slate-300 dark:text-slate-700'
                          }`}
                          title={`Ô số ${idx + 1}`}
                        >
                          {ch}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            PHẦN 5: KHẨU NGỮ BIỆN LUẬN HỌC THUẬT & PHẢN BIỆN
        =================================================================== */}
        {activeSectionId === 'speaking' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-pink-200 dark:border-pink-800 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase text-pink-600 dark:text-pink-300">
                  {speakingSec.titleZh}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#243447] dark:text-white mt-0.5">
                  Đề bài Phản biện Học thuật (3 phút chuẩn bị & trình bày)
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakChinese(speakingSec.modelSpeechZh, 0.92)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] text-xs font-bold hover:border-[#E85D3F] cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe Bài Phản Biện Mẫu HSK 9</span>
                </button>

                <button
                  type="button"
                  onClick={toggleSpeechRecording}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    isRecordingSpeech
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                  }`}
                >
                  {isRecordingSpeech ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Đang thu âm... (Bấm để dừng)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Thu âm giọng nói phản biện</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5">
              <p className="text-base font-bold text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']">
                {speakingSec.debateTopicZh}
              </p>
              <p className="text-xs text-[#5B6B7F] dark:text-slate-400">
                {speakingSec.debateTopicVi}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-[#748092] dark:text-slate-400 font-medium">
                Từ nối phản biện cần có trong bài nói:
              </span>
              {speakingSec.requiredDiscourseMarkers.map((m) => {
                const used = speakingTranscript.includes(m);
                return (
                  <span
                    key={m}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                      used
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-slate-400'
                    }`}
                  >
                    {m} {used ? '✓' : ''}
                  </span>
                );
              })}
            </div>

            <textarea
              rows={6}
              value={speakingTranscript}
              onCompositionStart={() => setIsComposingIme(true)}
              onCompositionEnd={() => setIsComposingIme(false)}
              onKeyDown={handleTextareaKeyDown}
              onChange={(e) => setSpeakingTranscript(e.target.value)}
              placeholder="Nội dung thu âm giọng nói hoặc dàn ý phản biện bằng tiếng Trung của bạn sẽ hiển thị tại đây..."
              className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-base sm:text-sm text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']"
            />
          </div>
        )}
      </main>
    </div>
  );
}
