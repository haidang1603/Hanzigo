import React from 'react';
import { 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Headphones, 
  Mic, 
  BookOpen, 
  PenTool, 
  Layers, 
  BookMarked,
  Award
} from 'lucide-react';
import { getSkillMastery, getPersonalizedRecommendation } from '../../services/learningPathService';
import { playClickSound } from '../../utils/audio';

export default function SkillMasteryCard({ user, onNavigateTab }) {
  const mastery = getSkillMastery(user);
  const recommendation = getPersonalizedRecommendation(user);

  const skills = [
    { id: 'listening', label: 'Luyện nghe (Listening)', score: mastery.listening, icon: Headphones, color: 'from-blue-500 to-cyan-500' },
    { id: 'speaking', label: 'Phát âm (Speaking)', score: mastery.speaking, icon: Mic, color: 'from-emerald-500 to-teal-500' },
    { id: 'reading', label: 'Đọc hiểu (Reading)', score: mastery.reading, icon: BookOpen, color: 'from-purple-500 to-indigo-500' },
    { id: 'writing', label: 'Tập viết (Writing)', score: mastery.writing, icon: PenTool, color: 'from-amber-500 to-orange-500' },
    { id: 'vocabulary', label: 'Từ vựng (Vocabulary)', score: mastery.vocabulary, icon: Layers, color: 'from-rose-500 to-red-500' },
    { id: 'hanzi', label: 'Chữ Hán & Bộ thủ (Hanzi)', score: mastery.hanzi, icon: BookMarked, color: 'from-fuchsia-500 to-pink-500' },
    { id: 'grammar', label: 'Ngữ pháp (Grammar)', score: mastery.grammar, icon: Award, color: 'from-sky-500 to-blue-600' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#243447] dark:text-white">
              Phân tích 7 Kỹ năng cốt lõi
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Theo dõi độ thành thạo và phát triển đồng đều
            </p>
          </div>
        </div>
      </div>

      {/* Notice when user has 0% real activity */}
      {skills.every(s => s.score === 0) && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2.5">
          <span className="text-base">💡</span>
          <span>Chưa có dữ liệu học tập thực tế. Điểm số bắt đầu từ 0% và sẽ tăng dần khi bạn làm bài học, luyện phát âm, hoặc làm bài <strong>Kiểm tra trình độ</strong>!</span>
        </div>
      )}

      {/* Skills progress bars */}
      <div className="space-y-3.5">
        {skills.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#243447] dark:text-white flex items-center gap-2">
                  <Icon size={14} className="text-[#748092]" />
                  <span>{s.label}</span>
                </span>
                <span className="font-bold font-mono text-[#E85D3F]">
                  {s.score}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#F1E5D8] dark:bg-[#131B24] overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, s.score)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Personalized AI recommendation */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF9F2] to-[#FDEEEB] dark:from-[#1A2634] dark:to-[#241A18] border border-[#E85D3F]/20 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-[#E85D3F] text-white shrink-0 mt-0.5 shadow-xs">
            <Sparkles size={16} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#243447] dark:text-white">
              Gợi ý cá nhân hóa từ HanziGo
            </h4>
            <p className="text-xs text-[#748092] dark:text-[#CBD5E1] leading-relaxed">
              {recommendation.advice}
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => {
              playClickSound();
              onNavigateTab(recommendation.recommendedTab);
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{recommendation.desc}</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
