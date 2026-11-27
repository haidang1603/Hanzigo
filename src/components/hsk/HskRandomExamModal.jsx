import React, { useState } from 'react';
import { Dices } from 'lucide-react';
import { generateRandomExam, HSK_TOPICS_CATALOG } from '../../services/hskService';

export default function HskRandomExamModal({
  isOpen,
  onClose,
  onNavigate,
  modalPanelClassName = 'bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90dvh] overflow-y-auto pb-[max(0.75rem,env(safe-area-inset-bottom))]',
  topicSelectClassName = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base sm:text-sm font-medium focus:outline-none focus:border-[#E85D3F]',
}) {
  const [level, setLevel] = useState('HSK 1');
  const [questionCount, setQuestionCount] = useState(15);
  const [skills, setSkills] = useState(['listening', 'reading', 'writing']);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      if (skills.length === 1) return;
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleGenerate = () => {
    try {
      setIsGenerating(true);
      setErrorMsg('');
      const exam = generateRandomExam({
        level,
        questionCount,
        skills,
        topic: selectedTopic,
      });
      onClose();
      onNavigate('take', exam.id);
    } catch (err) {
      setErrorMsg(err.message || 'Không thể tạo đề thi ngẫu nhiên với tiêu chí này.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className={modalPanelClassName}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center font-bold text-xl">
              🎲
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Tạo Đề Thi Ngẫu Nhiên
              </h3>
              <p className="text-xs text-slate-500">
                Trích xuất câu hỏi thật cân bằng độ khó &amp; kỹ năng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            1. Chọn Cấp Độ HSK:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  level === lvl
                    ? 'bg-[#E85D3F] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            2. Số lượng câu hỏi:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 15, 20, 25].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setQuestionCount(cnt)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  questionCount === cnt
                    ? 'bg-[#E85D3F] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cnt} câu
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            3. Phân bổ kỹ năng:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            {[
              { id: 'listening', label: '🎧 Nghe hiểu' },
              { id: 'reading', label: '📖 Đọc hiểu' },
              { id: 'writing', label: '✍️ Viết & Sắp xếp' },
            ].map((sk) => {
              const active = skills.includes(sk.id);
              return (
                <button
                  key={sk.id}
                  type="button"
                  onClick={() => toggleSkill(sk.id)}
                  className={`py-2.5 px-3 rounded-xl border transition-all text-center cursor-pointer ${
                    active
                      ? 'border-[#E85D3F] bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {sk.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            4. Chủ đề bài học:
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className={topicSelectClassName}
          >
            <option value="all">Tất cả chủ đề (Ngẫu nhiên tổng hợp)</option>
            {HSK_TOPICS_CATALOG.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 py-3 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Dices className="w-4 h-4" />
            {isGenerating ? 'Đang tạo...' : 'Bắt đầu làm bài'}
          </button>
        </div>
      </div>
    </div>
  );
}
