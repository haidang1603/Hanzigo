import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Target, 
  Calendar, 
  Clock, 
  Languages, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Check, 
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { useAiPersonalization } from '../../hooks/useAiPersonalization.js';

const GOAL_OPTIONS = [
  { id: 'general_foundation', label: 'Nền tảng HSK 3.0 toàn diện', desc: 'Cân bằng cả 7 kỹ năng: Nghe, Nói, Đọc, Viết, Ngữ pháp, Từ vựng, Pinyin' },
  { id: 'hsk_exam', label: 'Luyện thi chứng chỉ HSK', desc: 'Trọng tâm vào cấu trúc đề thi, bẫy trắc nghiệm, mẹo làm bài và luyện đề' },
  { id: 'daily_communication', label: 'Giao tiếp đời sống hàng ngày', desc: 'Ưu tiên phát âm, thanh điệu, ngữ điệu tự nhiên và khẩu ngữ thực tế' },
  { id: 'travel_speaking', label: 'Khẩu ngữ du lịch cấp tốc', desc: 'Tập trung các mẫu câu thông dụng: hỏi đường, mua sắm, ẩm thực, khách sạn' },
  { id: 'hanzi_culture', label: 'Chữ Hán & Bút thuận', desc: 'Tìm hiểu 214 bộ thủ, quy tắc thuận bút và chiết tự nguồn gốc chữ Hán' },
  { id: 'work_business', label: 'Giao dịch & Công việc', desc: 'Từ vựng thương mại, email, phỏng vấn và trao đổi đối tác Trung Quốc' }
];

const HSK_LEVELS = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
const DURATION_OPTIONS = [10, 15, 20, 30, 45, 60];

export default function PersonalizationSettingsModal({
  isOpen,
  onClose,
  user = null
}) {
  const {
    preferences,
    updatePreferences,
    clearPersonalizationData,
    exportPersonalizationData
  } = useAiPersonalization(user);

  const [goal, setGoal] = useState(preferences.learningGoal || 'general_foundation');
  const [targetLevel, setTargetLevel] = useState(preferences.targetHskLevel || 'HSK 1');
  const [targetExamDate, setTargetExamDate] = useState(preferences.targetExamDate || '');
  const [dailyMinutes, setDailyMinutes] = useState(preferences.dailyGoalMinutes || 15);
  const [language, setLanguage] = useState(preferences.explanationLanguage || 'vi');
  const [enabled, setEnabled] = useState(preferences.personalizationEnabled !== false);
  const [toast, setToast] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = () => {
    updatePreferences({
      learningGoal: goal,
      targetHskLevel: targetLevel,
      targetExamDate: targetExamDate || null,
      dailyGoalMinutes: Number(dailyMinutes),
      explanationLanguage: language,
      personalizationEnabled: enabled
    });
    showToast('Đã lưu cài đặt cá nhân hóa thành công!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleExport = () => {
    const data = exportPersonalizationData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hanzigo_learning_profile_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Đã xuất hồ sơ học tập ra tệp JSON thành công.');
  };

  const handleClear = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử phân tích và đề xuất cá nhân hóa? (Tiến độ bài học và từ vựng của bạn sẽ không bị ảnh hưởng).')) {
      clearPersonalizationData();
      showToast('Đã xóa dữ liệu cá nhân hóa thành công.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1A232E] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-orange-100 dark:border-gray-800 shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#E85D3F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Cài đặt Cá nhân hóa Học tập AI
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tùy biến kế hoạch học và trợ lý phù hợp với mục tiêu riêng của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {toast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {/* 1. Toggle Bật/Tắt Cá nhân hóa */}
          <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-gray-800/50 border border-orange-100 dark:border-gray-700 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Bật tính năng Đề xuất AI Cá nhân hóa</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Khi tắt, HanziGo sẽ sử dụng lộ trình tiêu chuẩn và không gửi ngữ cảnh phân tích đến mô hình AI.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={enabled} 
                onChange={e => setEnabled(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E85D3F]"></div>
            </label>
          </div>

          {/* 2. Mục tiêu học tập ưu tiên */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              1. Mục tiêu học tập ưu tiên
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOAL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGoal(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${goal === opt.id ? 'border-[#E85D3F] bg-orange-50/70 dark:bg-orange-950/20 text-[#E85D3F]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}`}
                >
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{opt.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Cấp độ HSK mục tiêu & Ngày thi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                2. Cấp độ HSK Mục tiêu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {HSK_LEVELS.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setTargetLevel(lvl)}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${targetLevel === lvl ? 'border-[#E85D3F] bg-[#E85D3F] text-white' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                3. Ngày dự kiến thi (Tùy chọn)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={e => setTargetExamDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E85D3F]"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Giúp AI phân bổ khối lượng ôn tập đếm ngược đến kỳ thi</p>
            </div>
          </div>

          {/* 4. Thời lượng học mỗi ngày */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              4. Thời lượng học mục tiêu mỗi ngày (phút)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {DURATION_OPTIONS.map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyMinutes(mins)}
                  className={`px-4 py-2 rounded-xl border font-bold text-xs transition-all ${dailyMinutes === mins ? 'border-[#E85D3F] bg-orange-50/70 dark:bg-orange-950/20 text-[#E85D3F]' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {mins} phút
                </button>
              ))}
            </div>
          </div>

          {/* 5. Ngôn ngữ giải thích */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              5. Ngôn ngữ giải thích ngữ pháp
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'vi', label: 'Tiếng Việt (Khuyến nghị)' },
                { id: 'zh', label: 'Song ngữ Trung - Việt' },
                { id: 'en', label: 'English' }
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="explanationLanguage"
                    checked={language === item.id}
                    onChange={() => setLanguage(item.id)}
                    className="text-[#E85D3F] focus:ring-[#E85D3F]"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Quản trị Dữ liệu & Quyền riêng tư (Data Portability & Erasure) */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              6. Quyền riêng tư & Quản lý dữ liệu học tập
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleExport}
                className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất hồ sơ (JSON)</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa dữ liệu cá nhân hóa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44D31] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            Lưu cài đặt
          </button>
        </div>

      </div>
    </div>
  );
}
